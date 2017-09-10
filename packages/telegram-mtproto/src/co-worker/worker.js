//@flow

import tasks from './tasks'
import type { TasksType, Task, WorkerMessage } from './index.h'

console.info('Crypto worker registered')

const post = (() => {
  function postStar(data: any) {
    postMessage(data, '*')
  }
  function postPlain(data: any) {
    postMessage(data)
  }
  let result = postStar
  try {
    result('ready')
  } catch (err) {
    result = postPlain
    result('ready')
  } finally {
    //eslint-disable-next-line
    return result
  }
})()

function selectTask(taskName: TasksType) {
  switch (taskName) {
    case 'factorize'  : return tasks.factorize
    case 'mod-pow'    : return tasks.modPow
    case 'sha1-hash'  : return tasks.sha1Hash
    case 'aes-encrypt': return tasks.aesEncrypt
    case 'aes-decrypt': return tasks.aesDecrypt
    default:
      throw new Error(`Unknown task: ${taskName}`)
  }
}

function runTask(ctx: Task) {
  const { task, taskID, data } = ctx
  const fn = selectTask(task)
  const result = fn(data)
  post({ taskID, result })
}

onmessage = (msg: WorkerMessage) => {
  if (typeof msg.data === 'string') {
    if (msg.data === '')
      console.info('empty crypto task')
    else
      console.info('crypto task string message', msg.data)
    return
  }
  runTask(msg.data)
}

declare function postMessage(data: string | Task, target?: '*'): void
