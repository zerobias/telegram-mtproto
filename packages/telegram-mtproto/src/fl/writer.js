//@flow

/* eslint-disable no-underscore-dangle */

import { Tuple2 } from './tuple'

const Writer = M => {

  class ᐸWriterᐳ {
    run: () => Tuple2
    constructor(run: () => Tuple2) {
      this.run = run
    }
    chain(f) {
      return new ᐸWriterᐳ(() => {
        const result = this.run()
        const t = f(result._1).run()
        return new Tuple2(t._1, result._2.concat(t._2))
      })
    }

    tell(y) {
      return new ᐸWriterᐳ(() => {
        const result = this.run()
        return new Tuple2(null, result._2.concat(y))
      })
    }

    map(f) {
      return new ᐸWriterᐳ(() => {
        const result = this.run()
        return new Tuple2(f(result._1), result._2)
      })
    }

    ap(b) {
      return this.chain((a) => b.map(a))
    }
  }

  function of(x) {
    return new ᐸWriterᐳ(() => new Tuple2(x, M.empty()))
  }



  return of

}
