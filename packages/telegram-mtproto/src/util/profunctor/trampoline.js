//@flow

import { cons, append, concatPair } from './prelude'

export
type Stack<I, O> = Array<(val: any) => any>

export default
class Trampoline<I, O> {
  stack: Stack<I, O>
  run(x: I): O {
    return applyStack(this.stack, x)
  }
  append<OB>(fn: (x: O) => OB): Trampoline<I, OB> {
    return new Trampoline(append(fn, this.stack))
  }
  prepend<IB>(fn: (x: IB) => I): Trampoline<IB, O> {
    return new Trampoline(cons(fn, this.stack))
  }
  concat<OB>(snd: Trampoline<O, OB>): Trampoline<I, OB> {
    return Trampoline.concat(this, snd)
  }

  static concat<IA, OA, OB>(
    fst: Trampoline<IA, OA>,
    snd: Trampoline<OA, OB>,
  ): Trampoline<IA, OB> {
    return new Trampoline(concatPair(fst.stack, snd.stack))
  }
  static empty<Any>(): Trampoline<Any, Any> {
    return new Trampoline([(x) => x])
  }

  constructor(stack: Stack<I, O>) { this.stack = stack }
  static of<I1, O1>(stack: Stack<I1, O1>): Trampoline<I1, O1> {
    return new Trampoline(stack)
  }
}


export function applyStack<I, O>(stack: Stack<I, O>, data: I): O {
  const ln = stack.length
  if (ln === 0)
    return (data: $FlowIssue)
  let current = data, fn, val
  for (let i = 0; i < ln; ++i) {
    fn = stack[i]
    val = fn(current)
    current = val
  }
  return (current: $FlowIssue)
}
