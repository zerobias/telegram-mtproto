//@flow

import Trampoline, { applyStack } from './trampoline'
import { type Stack } from './trampoline'

export
type ArrowType<I, O> =
  | Trampoline<I, O>
  | Stack<I, O>
  | Arrow<I, O>
  | ((x: I) => O)

export default
class Arrow<I, O> {
  λ: Trampoline<I, O>
  constructor(λ: Trampoline<I, O>) {
    this.λ = λ
  }
  fn() {
    //$FlowIssue
    const arrow: (x: I) => O = run(this.λ.stack)
    return arrow
  }
  ap(x: I): O {
    return this.λ.run(x)
  }
  map<O1>(fn: (x: O) => O1): Arrow<I, O1> {
    return new Arrow(this.λ.append(fn))
  }
  contramap<I1>(fn: (x: I1) => I): Arrow<I1, O> {
    return new Arrow(this.λ.prepend(fn))
  }
  bimap<I1, O1>(pre: (x: I1) => I, post: (x: O) => O1): Arrow<I1, O1> {
    return new Arrow(this.λ.prepend(pre).append(post))
  }
  compose<O1>(arrow: Arrow<O, O1>): Arrow<I, O1> {
    return new Arrow(this.λ.concat(arrow.λ))
  }
  static of<I1, O1, Val: ArrowType<I1, O1>>(val: Val): Arrow<I1, O1> {
    if (isFunc(val)) {
      return ofFunc(val)
    } else if (isStack(val)) {
      return ofStack(val)
    } else if (isTrampoline(val)) {
      return ofTrampoline(val)
    } else if (isArrow(val)) {
      return ofArrow(val)
    } else {
      throw new TypeError(`Can not create arrow from ${typeof val} ${val}`)
    }
  }
  static id<C>(): Arrow<C, C> {
    return Arrow.of((x: C) => x)
  }
}

function run<I, O>(stack: Stack<I, O>) {
  return function arrow(data: I) {
    return applyStack(stack, data)
  }
}

function isTrampoline(val: mixed): boolean %checks {
  return val instanceof Trampoline
}

function isStack(val: mixed): boolean %checks {
  return Array.isArray(val)
}

function isFunc(val: mixed): boolean %checks {
  return typeof val === 'function'
}

function isArrow(val: mixed): boolean %checks {
  return val instanceof Arrow
}

function ofTrampoline<I, O>(val: Trampoline<I, O>): Arrow<I, O> {
  return new Arrow(val)
}

function ofStack<I, O>(val: Stack<I, O>): Arrow<I, O> {
  return new Arrow(Trampoline.of(val))
}

function ofFunc<I, O>(val: (x: I) => O): Arrow<I, O> {
  const stack: Stack<I, O> = [val]
  return new Arrow(Trampoline.of(stack))
}

function ofArrow<I, O>(val: Arrow<I, O>): Arrow<I, O> {
  return val
}
