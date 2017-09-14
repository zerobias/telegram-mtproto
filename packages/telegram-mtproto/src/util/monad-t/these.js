//@flow

// import { Maybe, Just, Nothing } from 'folktale/maybe'
import { Maybe } from 'apropos'
const { Just, Nothing } = Maybe

import {
  ᐸMapᐳ,
  ᐸOfᐳ,
  λMap,
} from './index.h'

export interface λThese<A, B> extends λMap<'These', B> {
  typeName: 'These',
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

class This<A, B>
  extends TheseCore<A, B>
  implements
    λThese<A, B>,
    λMap<'These', B> {
  /*:: +*/x: A
  typeName: 'These'
  constructor(x: A) {
    super()
    this.x /*:: ; const xx*/ = x
  }
  bimap<Aʹ, Bʹ>(
    f: (x: A) => Aʹ /*::,
    g: (y: B) => Bʹ*/
  ): λThese<Aʹ, Bʹ> {
    return new This(f(this.x))
  }
  left(): Maybe<A> {
    return Just(this.x)
  }
  right(): Maybe<B> {
    return Nothing()
  }
  cata<X, Y, Z>(obj: {
    /*:: +*/This: (x: A) => X,
    /*:: +*/That: (y: B) => Y,
    /*:: +*/Both: (x: A, y: B) => Z,
  }): X | Y | Z {
    const { This: fn } = obj
    return /*:: addTypes( */ fn(this.x) /*:: ) */
  }
}

class That<A, B>
  extends TheseCore<A, B>
  implements
    λThese<A, B>,
    λMap<'These', B> {
  /*:: +*/y: B
  typeName: 'These'
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
  cata<X, Y, Z>(obj: {
    /*:: +*/This: (x: A) => X,
    /*:: +*/That: (y: B) => Y,
    /*:: +*/Both: (x: A, y: B) => Z,
  }): X | Y | Z {
    const { That: fn } = obj
    return /*:: addTypes( */ fn(this.y) /*:: ) */
  }
}

class Both<A, B>
  extends TheseCore<A, B>
  implements
    λThese<A, B>,
    λMap<'These', B> {
  /*:: +*/x: A
  /*:: +*/y: B
  typeName: 'These'
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
  cata<X, Y, Z>(obj: {
    /*:: +*/This: (x: A) => X,
    /*:: +*/That: (y: B) => Y,
    /*:: +*/Both: (x: A, y: B) => Z,
  }): X | Y | Z {
    const { Both: fn } = obj
    return /*:: addTypes( */ fn(this.x, this.y) /*:: ) */
  }
}

const typeID = 'zero-bias/These@1'

export const These: (
  & ᐸMapᐳ<'These'>
  & ᐸOfᐳ<'These'>
) = {
  '@@type': typeID,
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
  'fantasy-land/of': <+A, B>(y: B): λThese<A, B> => new That(y),
  thisOrBoth<A, B>(x: A, y: Maybe<B>): λThese<A, B> {
    return y.fold(
      (): λThese<A, B> => new This(x),
      (b): λThese<A, B> => new Both(x, b)
    )
  },
  thatOrBoth<A, B>(x: B, y: Maybe<A>): λThese<A, B> {
    return y.fold(
      (): λThese<A, B> => new That(x),
      (a): λThese<A, B> => new Both(a, x)
    )
  }
}

export default These


/*::
declare function concatA<A, B, +Aʹ>(x: λThese<A, B>): λThese<A | Aʹ, B>
declare function concatB<A, B, +Bʹ>(x: λThese<A, B>): λThese<A, B | Bʹ>
declare function changeA<-A, B, +Aʹ>(x: λThese<A, B>): λThese<Aʹ, B>
declare function changeB<A, -B, +Bʹ>(x: λThese<A, B>): λThese<A, Bʹ>
declare function addTypes<A, +B, +C>(x: A): A | B | C
*/
