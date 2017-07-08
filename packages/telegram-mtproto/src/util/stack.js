//@flow

import { lensPath, split, view, over } from 'ramda'

class Pair<L, R> {
  l: L
  r: R
  constructor(l: L, r: R) {
    this.l = l
    this.r = r
  }
  static of<L1, R1>(l: L1, r: R1): Pair<L1, R1> {
    return new Pair(l, r)
  }
}

interface Both<LL, L, R, RR> {
  l: (val: LL) => L,
  r: (val: R) => RR,
  map(fn: (val: L) => R): (val: LL) => RR,
}

class Par<LL, L, R, RR> extends Pair<*, *> {
  constructor(lf: (val: LL) => L, rf: (val: R) => RR) {
    super(lf, rf)
  }
}

class Stack<L, R> {
  stack: Array<(val: mixed) => mixed>
  apply(val: L): R {
    //$FlowIssue
    return applyStack(this.stack.reverse(), val)
  }
  constructor(stack: Array<(val: mixed) => mixed>) {
    this.stack = stackFlatten(stack)
    //$FlowIssue
    this.apply = this.apply.bind(this)
  }
  append<LN, RN>(fn: (val: LN) => RN): Stack<LN, R> {
    return Stack.of([...this.stack,  fn])
  }
  //$FlowIssue
  static of<LN, RN>(stack: Array<(val: *) => mixed>): Stack<LN, RN> {
    return new Stack(stack)
  }
  concat<LN, RN>(stack: Stack<LN, RN>): Stack<L, RN> {
    return Stack.of(this.stack.concat(stack.stack))
  }
}
//$FlowIssue
function stackFlatten(stack: Array<Stack<*, *>> | Stack<*, *>): Array<(val: mixed) => mixed> {
  if (stack instanceof Stack) return stack.stack
  if (typeof stack === 'function') return [stack]
  const result: Array<Stack<*, *>> = []
  for (let i = 0; i < stack.length; ++i) {
    result.concat(stackFlatten(stack[i]))
  }
  return result
}

const Pipe = <A, B, C, D>(p1: Stack<A, B>, p2: Stack<B, C>, p3: Stack<C, D>): Stack<A, D> => Stack.of([p1, p2, p3])

const Profunctor =
  <LL, L, R, RR>(f1: (val: LL) => L, f3: (val: R) => RR) =>
  //$FlowIssue
    (f2: (val: L) => R): (val: LL) => RR => {
      const p1: Stack<LL, L> = Stack.of([f1])
      const p2: Stack<L, R> = Stack.of([f2])
      const p3: Stack<R, RR> = Stack.of([f3])
      const stack = Pipe(p1, p2, p3)
      return (val: LL) => stack.apply(val)
    }

interface InOutI<LL, L, R, RR> {
  zoomOut(fn: (val: L) => R): (val: LL) => RR,
  zoomIn(fn: (val: RR) => LL): (val: R) => L,
}

type InOutPair<L, R> = InOutI<L, L, R, R>


const InOutF = <LL, L, R, RR>(pIn: (val: LL) => L, pOut: (val: R) => RR) => ({
  //$FlowIssue
  zoomOut: (fn: (val: L) => R) => (val: LL): RR => Profunctor(pIn, pOut)(fn).apply(val),
  //$FlowIssue
  zoomIn : (fn: (val: RR) => LL) => (val: R): L => Profunctor(pOut, pIn)(fn).apply(val),
})

function ID<T>(t: T): T {
  return t
}


const Dual = <L, C, R>(fl: (val: L) => C, fr: (val: C) => R) => {
  const iso = InOutF(fl, fr)
  return {
    zoomOut: iso.zoomOut(ID),
    zoomIn : (fn: (val: R) => L) => iso.zoomIn(fn)(ID)
  }
}

const charString: InOutI<string, string[], number[], string[]> = InOutF(
  (val: string) => [...val],
  (val: number[]) => val.map(s => String.fromCharCode(s)),
)

const outter = charString.zoomIn(val => val.join(''))
const inner = charString.zoomOut(val => val.map(s => s.charCodeAt(0)))

const lens = lensPath(['field', 'value'])

const trimMap: InOutI<string, string[], string[], string> =
  InOutF((val: string) => val.split(' '), (val: string[]) => val.map(e => e.trim).join(''))

// declare var state: InOutI<{ field: { value: string } }, string, string, { field: { value: string } }> =
//   InOutF()

// class InOut<LL, L, R, RR> extends Pair<*, *> implements Both<LL, L, R, RR> {
//   constructor(lf: (val: LL) => L, rf: (val: R) => RR) {
//     super(lf, rf)
//   }
//   map(fn: (val: L) => R): (val: LL) => RR {
//     const zoomOut: (val: LL) => RR =
//                    (val: LL) => this.r(fn(this.l(val)))
//     return zoomOut
//   }
// }

export function applyStack(stack: Array<(val: mixed) => mixed>, data: mixed) {
  const ln = stack.length
  if (ln === 0)
    return data
  const history = []
  let current = data
  for (let i = 0; i < ln; ++i) {
    const fn = stack[i]
    const val = fn(current)
    history.length = i + 1
    current = history[i] = val
  }
  return current
}

export function getInitialValue(stack: Array<(val: mixed) => mixed>, obj: any): {  val: mixed, succ: boolean } {
  let val = obj
  let succ = true
  try {
    val = applyStack(stack, val)
  } catch (err) {
    succ = false
    val = err.message
  }
  return { val, succ }
}

