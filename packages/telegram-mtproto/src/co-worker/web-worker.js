//@flow

import blueDefer, { type Defer } from 'Util/defer'
import Logger from 'mtproto-logger'
const log = Logger`web-worker`

import type { TasksType, WorkerType, Task, TaskResult } from './index.h'


export default class Webworker {
  static of() {
    return new Webworker
  }

  taskCount: number = 0
  worker: WorkerType
  awaiting: {
    [task: number]: Defer
  } = {}

  constructor() {
    this.initWorker()
    this.worker.postMessage('b')
  }

  getNextID() {
    return this.taskCount++
  }

  run(taskType: TasksType, data: *) {
    const task: Task = {
      task  : taskType,
      taskID: this.getNextID(),
      data,
    }
    return this.addTaskAwait(task)
  }

  addTaskAwait(task: Task) {
    this.awaiting[task.taskID] = blueDefer()
    this.worker.postMessage(task)
    return this.awaiting[task.taskID].promise
  }

  initWorker() {
    this.worker = getWorker()

    const onmessage = ({ data }: TaskResult) => {
      if (typeof data === 'string') {
        data === 'ready'
          ? log`init`('CW ready')
          : log`init`('Unknown worker message', data)
      } else if (!isCryptoTask(data)) {
        log`init`('Not crypto task', data)
      } else {
        this.resolveTask(data.taskID, data.result)
      }
    }

    const onerror = (err: Error) => {
      log`error`(err)
    }

    this.worker.onmessage = onmessage
    this.worker.onerror = onerror
  }

  resolveTask(taskID: number, result: *) {
    const defer = this.awaiting[taskID]
    if (!defer) {
      log`resolve task, error`(`No stored task ${taskID} found`)
      return
    }
    delete this.awaiting[taskID]
    defer.resolve(result)
  }
}

function isCryptoTask(obj: $PropertyType<TaskResult, 'data'>) {
  return (
    typeof obj === 'object' &&
    typeof obj.taskID === 'number'
  )
}

function getWorker(): WorkerType {
  let WorkerInstance
  try {
    //$FlowIssue
    WorkerInstance = require('worker-loader?inline&fallback=false!./worker.js')
  } catch (err) {
    console.error(err)
    WorkerInstance = require('./worker.js')
  }
  //$FlowIssue
  const worker = new WorkerInstance()
  return worker
}
