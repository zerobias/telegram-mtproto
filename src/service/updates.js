//@flow

import Promise from 'bluebird'
import Logger from '../util/log'
const debug = Logger`updates`

import { setUpdatesProcessor } from './networker'
import type { ApiManagerInstance } from './api-manager/index.h'
import type { UpdatesState, CurState } from './updates.h'

// const AppPeersManager = null
// const AppUsersManager = null
const AppChatsManager = null

const UpdatesManager = (api: ApiManagerInstance) => {
  const updatesState: any = {
    pendingPtsUpdates: [],
    pendingSeqUpdates: {},
    syncPending      : false,
    syncLoading      : true
  }
  const channelStates = {}

  let myID = 0
  getUserID().then(id => myID = id)

  async function getUserID() {
    const auth = await api.storage.get('user_auth')
    return auth.id || 0
  }

  function popPendingSeqUpdate() {
    const nextSeq = updatesState.seq + 1
    const pendingUpdatesData = updatesState.pendingSeqUpdates[nextSeq]
    if (!pendingUpdatesData) {
      return false
    }
    const updates = pendingUpdatesData.updates
    updates.forEach(saveUpdate)
    updatesState.seq = pendingUpdatesData.seq
    if (pendingUpdatesData.date && updatesState.date < pendingUpdatesData.date) {
      updatesState.date = pendingUpdatesData.date
    }
    delete updatesState.pendingSeqUpdates[nextSeq]

    if (!popPendingSeqUpdate() &&
      updatesState.syncPending &&
      updatesState.syncPending.seqAwaiting &&
      updatesState.seq >= updatesState.syncPending.seqAwaiting) {
      if (!updatesState.syncPending.ptsAwaiting) {
        clearTimeout(updatesState.syncPending.timeout)
        updatesState.syncPending = false
      } else {
        delete updatesState.syncPending.seqAwaiting
      }
    }

    return true
  }

  function popPendingPtsUpdate(channelID) {
    const curState = channelID ? getChannelState(channelID) : updatesState
    if (!curState.pendingPtsUpdates.length) {
      return false
    }
    curState.pendingPtsUpdates.sort((a, b) => a.pts - b.pts)

    let curPts = curState.pts
    let goodPts = false
    let goodIndex = 0
    let update
    let i = 0
    for (const update of curState.pendingPtsUpdates) {
      curPts += update.pts_count
      if (curPts >= update.pts) {
        goodPts = update.pts
        goodIndex = i
      }
      i++
    }

    if (!goodPts) {
      return false
    }

    debug('pop pending pts updates')(goodPts, curState.pendingPtsUpdates.slice(0, goodIndex + 1))

    curState.pts = goodPts
    for (let i = 0; i <= goodIndex; i++) {
      update = curState.pendingPtsUpdates[i]
      saveUpdate(update)
    }
    curState.pendingPtsUpdates.splice(0, goodIndex + 1)

    if (!curState.pendingPtsUpdates.length && curState.syncPending) {
      if (!curState.syncPending.seqAwaiting) {
        clearTimeout(curState.syncPending.timeout)
        curState.syncPending = false
      } else {
        delete curState.syncPending.ptsAwaiting
      }
    }

    return true
  }

  function forceGetDifference() {
    if (!updatesState.syncLoading) {
      getDifference()
    }
  }

  function processUpdateMessage(updateMessage: any) {
    // return forceGetDifference()
    const processOpts = {
      date    : updateMessage.date,
      seq     : updateMessage.seq,
      seqStart: updateMessage.seq_start
    }

    switch (updateMessage._) {
      case 'updatesTooLong':
      case 'new_session_created':
        forceGetDifference()
        break

      case 'updateShort':
        processUpdate(updateMessage.update, processOpts)
        break

      case 'updateShortMessage':
      case 'updateShortChatMessage': {
        const isOut = updateMessage.flags & 2
        const fromID = updateMessage.from_id || (isOut ? myID : updateMessage.user_id)
        const toID = updateMessage.chat_id
          ? -updateMessage.chat_id
          : isOut ? updateMessage.user_id : myID
        
        api.emit('updateShortMessage', { 
          processUpdate,
          processOpts,
          updateMessage,
          fromID,
          toID
        })
      }
        break

      case 'updatesCombined':
      case 'updates': 
        api.emit('apiUpdate', updateMessage)

        updateMessage.updates.forEach(update => {
          processUpdate(update, processOpts)
        })
        break

      default:
        debug('Unknown update message')(updateMessage)
    }
  }

  async function getDifference() {
    if (!updatesState.syncLoading) {
      updatesState.syncLoading = true
      updatesState.pendingSeqUpdates = {}
      updatesState.pendingPtsUpdates = []
    }

    if (updatesState.syncPending) {
      clearTimeout(updatesState.syncPending.timeout)
      updatesState.syncPending = false
    }

    const differenceResult = await api('updates.getDifference', {
      pts : updatesState.pts,
      date: updatesState.date,
      qts : -1
    })
    if (differenceResult._ === 'updates.differenceEmpty') {
      debug('apply empty diff')(differenceResult.seq)
      updatesState.date = differenceResult.date
      updatesState.seq = differenceResult.seq
      updatesState.syncLoading = false
      api.emit('stateSynchronized')
      return false
    }

    api.emit('difference', differenceResult)

    // Should be first because of updateMessageID
    // console.log(dT(), 'applying', differenceResult.other_updates.length, 'other updates')

    const channelsUpdates = []
    differenceResult.other_updates.forEach(update => {
      switch (update._) {
        case 'updateChannelTooLong':
        case 'updateNewChannelMessage':
        case 'updateEditChannelMessage':
          processUpdate(update)
          return
      }
      saveUpdate(update)
    })

    // console.log(dT(), 'applying', differenceResult.new_messages.length, 'new messages')
    differenceResult.new_messages.forEach(apiMessage => {
      saveUpdate({
        _        : 'updateNewMessage',
        message  : apiMessage,
        pts      : updatesState.pts,
        pts_count: 0
      })
    })

    const nextState = differenceResult.intermediate_state || differenceResult.state
    updatesState.seq = nextState.seq
    updatesState.pts = nextState.pts
    updatesState.date = nextState.date

    // console.log(dT(), 'apply diff', updatesState.seq, updatesState.pts)

    if (differenceResult._ == 'updates.differenceSlice') {
      getDifference()
    } else {
      // console.log(dT(), 'finished get diff')
      api.emit('stateSynchronized')
      updatesState.syncLoading = false
    }
  }

  async function getChannelDifference(channelID: number) {
    const channelState = getChannelState(channelID)
    if (!channelState.syncLoading) {
      channelState.syncLoading = true
      channelState.pendingPtsUpdates = []
    }
    if (channelState.syncPending) {
      clearTimeout(channelState.syncPending.timeout)
      channelState.syncPending = false
    }
    // console.log(dT(), 'Get channel diff', AppChatsManager.getChat(channelID), channelState.pts)
    const differenceResult = await api('updates.getChannelDifference', {
      channel: AppChatsManager.getChannelInput(channelID),
      filter : { _: 'channelMessagesFilterEmpty' },
      pts    : channelState.pts,
      limit  : 30
    })
    // console.log(dT(), 'channel diff result', differenceResult)
    channelState.pts = differenceResult.pts

    if (differenceResult._ == 'updates.channelDifferenceEmpty') {
      debug('apply channel empty diff')(differenceResult)
      channelState.syncLoading = false
      api.emit('stateSynchronized')
      return false
    }

    if (differenceResult._ == 'updates.channelDifferenceTooLong') {
      debug('channel diff too long')(differenceResult)
      channelState.syncLoading = false
      delete channelStates[channelID]
      saveUpdate({ _: 'updateChannelReload', channel_id: channelID })
      return false
    }

    api.emit('difference', differenceResult)

    // Should be first because of updateMessageID
    debug('applying')(differenceResult.other_updates.length, 'channel other updates')
    differenceResult.other_updates.map(saveUpdate)

    debug('applying')(differenceResult.new_messages.length, 'channel new messages')
    differenceResult.new_messages.forEach(apiMessage => {
      saveUpdate({
        _        : 'updateNewChannelMessage',
        message  : apiMessage,
        pts      : channelState.pts,
        pts_count: 0
      })
    })

    debug('apply channel diff')(channelState.pts)

    if (differenceResult._ == 'updates.channelDifference' &&
      !differenceResult.pFlags['final']) {
      getChannelDifference(channelID)
    } else {
      debug('finished channel get diff')()
      api.emit('stateSynchronized')
      channelState.syncLoading = false
    }
  }

  function addChannelState(channelID: number, pts: ?number) {
    if (!pts) {
      throw new Error(`Add channel state without pts ${channelID}`)
    }
    if (channelStates[channelID] === undefined) {
      channelStates[channelID] = {
        pts,
        pendingPtsUpdates: [],
        syncPending      : false,
        syncLoading      : false
      }
      return true
    }
    return false
  }

  function getChannelState(channelID: number, pts?: ?number) {
    if (channelStates[channelID] === undefined) {
      addChannelState(channelID, pts)
    }
    return channelStates[channelID]
  }

  function processUpdate(update, options = {}) {
    let channelID
    switch (update._) {
      case 'updateNewChannelMessage':
      case 'updateEditChannelMessage':
        channelID = update.message.to_id.channel_id || update.message.to_id.chat_id
        break
      case 'updateDeleteChannelMessages':
        channelID = update.channel_id
        break
      case 'updateChannelTooLong':
        channelID = update.channel_id
        if (channelStates[channelID] === undefined) {
          return false
        }
        break
    }

    const curState: CurState = channelID ? getChannelState(channelID, update.pts) : updatesState

    // console.log(dT(), 'process', channelID, curState.pts, update)

    if (curState.syncLoading) {
      return false
    }

    if (update._ == 'updateChannelTooLong') {
      getChannelDifference(channelID || 0)
      return false
    }

    let popPts
    let popSeq

    if (update.pts) {
      const newPts = curState.pts + (update.pts_count || 0)
      if (newPts < update.pts) {
        // debug('Pts hole')(curState, update, channelID && AppChatsManager.getChat(channelID))
        curState.pendingPtsUpdates.push(update)
        if (!curState.syncPending) {
          curState.syncPending = {
            timeout: setTimeout(() => {
              if (channelID) {
                getChannelDifference(channelID)
              } else {
                getDifference()
              }
            }, 5000),
          }
        }
        curState.syncPending.ptsAwaiting = true
        return false
      }
      if (update.pts > curState.pts) {
        curState.pts = update.pts
        popPts = true
      }
      else if (update.pts_count) {
        // console.warn(dT(), 'Duplicate update', update)
        return false
      }
      if (channelID && options.date && updatesState.date < options.date) {
        updatesState.date = options.date
      }
    }
    else if (!channelID && options.seq > 0) {
      const seq = options.seq
      const seqStart = options.seqStart || seq

      if (seqStart != curState.seq + 1) {
        if (seqStart > curState.seq) {
          debug('Seq hole')(curState, curState.syncPending && curState.syncPending.seqAwaiting)

          if (curState.pendingSeqUpdates[seqStart] === undefined) {
            curState.pendingSeqUpdates[seqStart] = { seq, date: options.date, updates: [] }
          }
          curState.pendingSeqUpdates[seqStart].updates.push(update)

          if (!curState.syncPending) {
            curState.syncPending = {
              timeout: setTimeout(() => {
                getDifference()
              }, 5000)
            }
          }
          if (!curState.syncPending.seqAwaiting ||
            curState.syncPending.seqAwaiting < seqStart) {
            curState.syncPending.seqAwaiting = seqStart
          }
          return false
        }
      }

      if (curState.seq != seq) {
        curState.seq = seq
        if (options.date && curState.date < options.date) {
          curState.date = options.date
        }
        popSeq = true
      }
    }

    saveUpdate(update)

    if (popPts) {
      popPendingPtsUpdate(channelID)
    }
    else if (popSeq) {
      popPendingSeqUpdate()
    }
  }

  function saveUpdate(update: any) {
    api.emit('apiUpdate', update)
  }

  async function attach() {
    setUpdatesProcessor(processUpdateMessage)
    const stateResult: UpdatesState = await api('updates.getState', {}, { noErrorBox: true })
    updatesState.seq = stateResult.seq
    updatesState.pts = stateResult.pts
    updatesState.date = stateResult.date
    setTimeout(() => {
      updatesState.syncLoading = false
    }, 1000)
  }

  return {
    processUpdateMessage,
    addChannelState,
    attach
  }
}

export default UpdatesManager