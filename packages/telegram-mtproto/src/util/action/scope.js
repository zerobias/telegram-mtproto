//@flow

import {action, type Action} from './action'
import {AsyncAction} from './async-action'
import {getScopeId} from './register'

export class Scope {
  path: string[]
  scopeId: number = getScopeId()
  constructor(path: string[]) {
    this.path = path
    //$off
    this.scope = this.scope.bind(this)
    //$off
    this.message = this.message.bind(this)
    //$off
    this.effect = this.effect.bind(this)
  }
  scope(name: string) {
    return new Scope([...this.path, name])
  }
  message<P>(name: string): Action<P, 'act'> {
    return action([...this.path, name].join('/'))
  }
  effect<A, D, E>(name: string): AsyncAction<A, D, E> {
    return new AsyncAction([...this.path, name].join('/'))
  }
}

export const getRoot = () => new Scope([''])
