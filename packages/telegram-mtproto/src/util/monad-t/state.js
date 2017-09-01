//@flow

import Tuple from './tuple'

export class State<L, R> {
  run: (r: R) => Tuple<L, R>
  constructor(run: (r: R) => Tuple<L, R>) {
    this.run = run
  }
  chain<Lʹ, Rʹ>(f: (l: L) => R): State<Lʹ, Rʹ> {
    return new State((s: R) => {
      const result = this.run(s)
      return f(result.fst()).run(result.snd())
    })
  }
  evalState(s: R): L {
    return this.run(s).fst()
  }
  exec(s: R): R {
    return this.run(s).snd()
  }
  map(f: *) {
    return this.chain(a => new State(f(a)))
  }
  ap(a: *) {
    return this.chain((f) => a.map(f))
  }

  static of<Lʹ, +Rʹ>(a: Lʹ): State<Lʹ, Rʹ> {
    return new State(b => new Tuple(a, b))
  }

  static get<+T>(): State<T, T> {
    return new State((s) => new Tuple(s, s))
  }

  static modify<-I, O>(f: (x: I) => O): State<null, O> {
    return new State((s: O) => new Tuple(null, f(s)))
  }

  static put(s) {
    return modify(no => s)
  }
}

function of(a) {
  return new State(b => new Tuple(a, b))
}

const get = new State((s) => new Tuple(s, s))

function modify(f) {
  return new State((s) => new Tuple(null, f(s)))
}

function put(s) {
  return modify(no => s)
}


// type Func<+M, T> = {
//   of<-I>(x: I): M,
//   map<-I, +O>(f: (x: I) => O, m: M): M,
// }
//
// class StateT<M> {
//
// }
//
// // Transformer
// State.StateT = (M) => {
//     const StateT = daggy.tagged('run');
//     StateT.lift = (m) => {
//         return StateT((b) => {
//             return m.map((c) => Tuple2(c, b));
//         });
//     };
//
//     // https://hackage.haskell.org/package/mmorph-1.0.9/docs/Control-Monad-Morph.html#g:1
//     StateT.hoist = (f) => (m) => {
//         return StateT((s) => {
//             return f(m.evalState(s)).map((x) => Tuple2(x, s));
//         });
//     };
//
//     StateT.of = (a) => {
//         return StateT((b) => M.of(Tuple2(a, b)));
//     };
//
//     StateT.prototype.chain = function(f) {
//         return StateT((s) => {
//             const result = this.run(s);
//             return result.chain((t) => f(t._1).run(t._2));
//         });
//     };
//
//     StateT.get = StateT((s) => M.of(Tuple2(s, s)));
//
//     StateT.modify = (f) => {
//         return StateT((s) => M.of(Tuple2(null, f(s))));
//     };
//
//     StateT.put = function(s) {
//         return StateT.modify(constant(s));
//     };
//
//     StateT.prototype.evalState = function(s) {
//         return this.run(s).map((t) => t._1);
//     };
//
//     StateT.prototype.exec = function(s) {
//         return this.run(s).map((t) => t._2);
//     };
//
//     StateT.prototype.map = function(f) {
//         return this.chain((a) => StateT.of(f(a)));
//     };
//
//     StateT.prototype.ap = function(a) {
//         return this.chain((f) => a.map(f));
//     };
//
//     return StateT;
// }
