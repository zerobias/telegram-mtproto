//@flow

// import type { postMessage } from './index.h'

import tasks from './tasks'
import type { TasksType, Task, WorkerMessage } from './index.h'

console.info('Crypto worker registered')

const selectTask = (taskName: TasksType) => {
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

const runTask = (ctx: Task) => {
  const { task, taskID, data } = ctx
  const fn = selectTask(task)
  const result = fn(data)
  //$FlowIssue
  postMessage({ taskID, result })
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

//$FlowIssue
postMessage('ready')
