//@flow

import { Maybe, Just, Nothing } from 'folktale/maybe'

export interface λThese<A, B> {
  map<Bʹ>(f: (y: B) => Bʹ): λThese<A, Bʹ>,
  bimap<Aʹ, Bʹ>(f: (x: A) => Aʹ, g: (y: B) => Bʹ): λThese<Aʹ, Bʹ>,
  left(): Maybe<A>,
  right(): Maybe<B>,
  cata<X, Y, Z>(variants: {
    /*:: +*/This: (x: A) => X,
    /*:: +*/That: (y: B) => Y,
    /*:: +*/Both: (x: A, y: B) => Z,
  }): X | Y | Z,
}

/*::
declare function concatA<A, B, +Aʹ>(x: λThese<A, B>): λThese<A | Aʹ, B>
declare function concatB<A, B, +Bʹ>(x: λThese<A, B>): λThese<A, B | Bʹ>
declare function changeA<-A, B, +Aʹ>(x: λThese<A, B>): λThese<Aʹ, B>
declare function changeB<A, -B, +Bʹ>(x: λThese<A, B>): λThese<A, Bʹ>
declare function addTypes<A, +B, +C>(x: A): A | B | C
*/

class TheseCore<A, B> {
  map<Bʹ>(f: (y: B) => Bʹ): λThese<A, Bʹ> {
    return this.bimap(x => x, f)
  }
  /*::
  bimap<Aʹ, Bʹ>(f: (x: A) => Aʹ, g: (y: B) => Bʹ): λThese<Aʹ, Bʹ> {
    declare var ret: λThese<Aʹ, Bʹ>
    return ret
  }
  */
}

class This<A, B> extends TheseCore<A, B> implements λThese<A, B> {
  /*:: +*/x: A
  constructor(x: A) {
    super()
    this.x /*:: ; const xx*/ = x
  }
  bimap<Aʹ, Bʹ>(f: (x: A) => Aʹ, g: (y: B) => Bʹ): λThese<Aʹ, Bʹ> {
    return new This(f(this.x))
  }
  left(): Maybe<A> {
    return Just(this.x)
  }
  right(): Maybe<B> {
    return Nothing()
  }
  cata<X, Y, Z>({ This: fn }: {
    /*:: +*/This: (x: A) => X,
    /*:: +*/That: (y: B) => Y,
    /*:: +*/Both: (x: A, y: B) => Z,
  }): X | Y | Z {
    return /*:: addTypes( */ fn(this.x) /*:: ) */
  }
}

class That<A, B> extends TheseCore<A, B> implements λThese<A, B> {
  /*:: +*/y: B
  constructor(y: B) {
    super()
    this.y /*:: ; const xx*/ = y
  }
  bimap<Aʹ, Bʹ>(f: (x: A) => Aʹ, g: (y: B) => Bʹ): λThese<Aʹ, Bʹ> {
    return new That(g(this.y))
  }
  left(): Maybe<A> {
    return Nothing()
  }
  right(): Maybe<B> {
    return Just(this.y)
  }
  cata<X, Y, Z>({ That: fn }: {
    /*:: +*/This: (x: A) => X,
    /*:: +*/That: (y: B) => Y,
    /*:: +*/Both: (x: A, y: B) => Z,
  }): X | Y | Z {
    return /*:: addTypes( */ fn(this.y) /*:: ) */
  }
}

class Both<A, B> extends TheseCore<A, B> implements λThese<A, B> {
  /*:: +*/x: A
  /*:: +*/y: B
  constructor(x: A, y: B) {
    super()
    this.x /*:: ; const xx*/ = x
    this.y /*:: ; const yy*/ = y
  }
  bimap<Aʹ, Bʹ>(f: (x: A) => Aʹ, g: (y: B) => Bʹ): λThese<Aʹ, Bʹ> {
    return new Both(f(this.x), g(this.y))
  }
  left(): Maybe<A> {
    return Just(this.x)
  }
  right(): Maybe<B> {
    return Just(this.y)
  }
  cata<X, Y, Z>({ Both: fn }: {
    /*:: +*/This: (x: A) => X,
    /*:: +*/That: (y: B) => Y,
    /*:: +*/Both: (x: A, y: B) => Z,
  }): X | Y | Z {
    return /*:: addTypes( */ fn(this.x, this.y) /*:: ) */
  }
}

export const These = {
  This<A, +B>(x: A): λThese<A, B> {
    return new This(x)
  },
  That<+A, B>(y: B): λThese<A, B> {
    return new That(y)
  },
  Both<A, B>(x: A, y: B): λThese<A, B> {
    return new Both(x, y)
  },
  of<+A, B>(y: B): λThese<A, B> {
    return new That(y)
  },
  thisOrBoth<A, B>(x: A, y: Maybe<B>): λThese<A, B> {
    return y.matchWith({
      Just({ value: b }): λThese<A, B> {
        return new Both(x, b)
      },
      Nothing(): λThese<A, B> {
        return new This(x)
      }
    })
  },
  thatOrBoth<A, B>(x: B, y: Maybe<A>): λThese<A, B> {
    return y.matchWith({
      Just({ value: a }): λThese<A, B> {
        return new Both(a, x)
      },
      Nothing(): λThese<A, B> {
        return new That(x)
      }
    })
  }
}

export default These
