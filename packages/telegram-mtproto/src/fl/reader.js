//@flow

class ᐸReaderᐳ<I, O> {
  run: (x: I) => O
  constructor(run: (x: I) => O) {
    this.run = run
  }
  chain<A, B>(f: (x: O) => ᐸReaderᐳ<A, B>) {
    return new ᐸReaderᐳ((e) => f(this.run(e)).run(e))
  }
  map(f) {
    return new ᐸReaderᐳ((e) => ofᐸReaderᐳ(f(this.run(e))).run(e))
  }
  // ap(a) {
  //   return new ᐸReaderᐳ((e) => a.map(this.run(e)).run(e))
  // }
  // of(a) {
  //   return new ᐸReaderᐳ((e) => a)
  // }
}

function ofᐸReaderᐳ<T, /*::+*/I>(x: T): ᐸReaderᐳ<I, T> {
  return new ᐸReaderᐳ((/*::i: I*/) => x)
}

// const ofR = (a) => new ᐸReaderᐳ((e) => a)

// const askR = new ᐸReaderᐳ(x => x)


// const R = {
//   of : ofR,
//   ask: askR,
// }

// Transformer
// const ReaderTF = (M: typeof R) => {
//   class ReaderT extends ᐸReaderᐳ {
//     run: <T>(x: T) => ᐸReaderᐳ
//     map(f: *) {
//       return new ReaderT((e) => this.run(e).chain((a) => this.of(f(a)).run(e)))
//     }
//     chain(f: *) {
//       return new ReaderT((e) => this.run(e).chain((a) => f(a).run(e)))
//     }
//     ap(a: *) {
//       return new ReaderT(
//         (e) => this.run(e).chain(
//           (an) => a.map(an).run(e)))
//     }
//     constructor(run) {
//       super(run)
//     }
//     of(a) {
//       return new ReaderT((e) => M.of(a))
//     }
//   }
//   const lift = (m) => new ReaderT((e) => m)

//   const of = (a) => new ReaderT((e) => M.of(a))

//   const ask = new ReaderT((e) => M.of(e))

//   return {
//     of,
//     lift,
//     ask,
//   }
// }


