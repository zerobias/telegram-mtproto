//@flow

//
import { of, map, ap, chain } from 'ramda'
//
// // data Free i a
// //   = Ap { x: (Free i b), y: (Free i (b -> a)) }
// //   | Pure { x: a }
// //   | Lift { x: i, f: (b -> a) }
// //   | Chain { x: (Free i b), f: (b -> (Free i a)) }
// function Free() {
//   throw new TypeError('No direct use of Free constructor is Allowed')
// }

export type Freeλ = {
  foldMap(f: *, m: *): *,
  cata<C, L, A, P>(d: Cata<C, L, A, P>): *,
}

class Freeλʹ {
  retract(m) {
    return this.foldMap(id, m)
  }
  hoist(f) {
    return this.foldMap(x => liftF(f(x)), Free)
  }
  graft(f) {
    return this.foldMap(f, Free)
  }
  foldMap(f, m) {
    return m.chainRec((next, done, v) => v.cata({
      Pure : (x) => map(done, m.of(x)),
      Lift : (x, g: $off) => map(xx => done(g(xx)), f(x)),
      Ap   : (x: Freeλ, y: Freeλ) => map(done, ap(y.foldMap(f, m), x.foldMap(f, m))),
      Chain: (x: Freeλ, g: $off) => map(xx => next(g(xx)), x.foldMap(f, m)),
    }), this)
  }
  cata(d): * {}
}
// // λʹ
// function Pure(x) {
//   if (!(this instanceof Pure)) {
//     return new Pure(x)
//   }
//   this.x = x
// }
// Pure.prototype = Object.create(Free.prototype)
// Pure.prototype.constructor = Pure
// Pure.prototype.cata = function(d) { return d.Pure(this.x) }
//

export type Cata<+C, +L, +A, +P> = {
  Chain<-F>(x: Freeλ, f: F): C,
  Lift<-X, -F>(x: X, f: F): L,
  Ap(x: Freeλ, y: Freeλ): A,
  Pure<-X>(x: X): P,
}

class Pureλ<A> extends Freeλʹ {
  x: A
  constructor(x: A) {
    super()
    this.x = x
  }
  cata<-C, -L, -A, P>(d: Cata<C, L, A, P>): P {
    return d.Pure(this.x)
  }
  static toString() {
    return 'Free.Pure'
  }
  toString() {
    return 'Free.Pure'
  }
  map<B>(f: (x: A) => B): Pureλ<B> {
    return new Pureλ(f(this.x))
  }
  ap(y: *) {
    return map(f => f(this.x), y)
  }
  chain(f: *) {
    return f(this.x)
  }
  /*::
  static $call: (<B>(x: B) => Pureλ<B>)
  */
}




class Liftλ extends Freeλʹ {
  x: any
  f: any
  constructor(x: any, f: any) {
    super()
    this.x  = x
    this.f = f
  }
  cata(x: Cata<any, any, any, any>) {
    return x.Lift(this.x, this.f)
  }
  static toString() {
    return 'Free.Lift'
  }
  toString() {
    return 'Free.Lift'
  }

  ap(y) {
    return new Apλ(this, y)
  }
  chain(f) {
    return new Chainλ(this, f)
  }
  map(f) {
    return new Liftλ(this.x, x => f(this.f(x)))
  }
  /*::
  static $call: ((x: any, f: any) => Liftλ)
  */
}

class Apλ extends Freeλʹ {
  x: Freeλ
  y: Freeλ
  constructor(x: Freeλ, y: Freeλ) {
    super()
    this.x  = x
    this.y = y
  }
  cata(x: Cata<any, any, any, any>) {
    return x.Ap(this.x, this.y)
  }
  static toString() {
    return 'Free.Ap'
  }
  map(f) {
    return new Apλ(this.x, map(a => map(f, a), this.y))
  }
  toString() {
    return 'Free.Ap'
  }
  ap(y) {
    return new Apλ(this, y)
  }
  chain(f) {
    return new Chainλ(this, f)
  }
  /*::
  static $call: ((x: any, f: any) => Apλ)
  */
}

class Chainλ extends Freeλʹ {
  x: Freeλ
  f: any
  constructor(x: Freeλ, f: any) {
    super()
    this.x  = x
    this.f = f
  }
  cata(x: Cata<any, any, any, any>) {
    return x.Chain(this.x, this.f)
  }
  static toString() {
    return 'Free.Chain'
  }
  map(f) {
    return new Chainλ(this.x, a => map(f, this.f(a)))
  }
  ap(y) {
    return new Apλ(this, y)
  }
  toString() {
    return 'Free.Chain'
  }
  chain(f) {
    return new Chainλ(this.x, v => chain(f, this.f(v)))
  }
  /*::
  static $call: ((x: any, f: any) => Chainλ)
  */
}

const compose = (f, g) => (x) => f(g(x))
const id = x => x

// function Pure<B>(x: B): Pureλ<B> {
//   return new Pureλ(x)
// }

//$off
function Lift(x, f): Liftλ {
  return new Liftλ(x, f)
}

//$off
function Ap(x, y): Apλ {
  return new Apλ(x, y)
}

//$off
function Chain(x, f): Chainλ {
  return new Chainλ(x, f)
}

//$off
function Pure<A>(x: A): Pureλ<A> {
  return new Pureλ(x)
}


const mapping = {
  equals: 'fantasy-land/equals',
  lte: 'fantasy-land/lte',
  compose: 'fantasy-land/compose',
  id: 'fantasy-land/id',
  concat: 'fantasy-land/concat',
  empty: 'fantasy-land/empty',
  map: 'fantasy-land/map',
  contramap: 'fantasy-land/contramap',
  ap: 'fantasy-land/ap',
  of: 'fantasy-land/of',
  alt: 'fantasy-land/alt',
  zero: 'fantasy-land/zero',
  reduce: 'fantasy-land/reduce',
  traverse: 'fantasy-land/traverse',
  chain: 'fantasy-land/chain',
  chainRec: 'fantasy-land/chainRec',
  extend: 'fantasy-land/extend',
  extract: 'fantasy-land/extract',
  bimap: 'fantasy-land/bimap',
  promap: 'fantasy-land/promap'
}

const patch = obj => Object.keys(mapping).forEach(key => {
  //$off
  if (typeof obj[key] === 'function') {
    //$off
    obj[mapping[key]] = obj[key]
  }
})

;[
  Freeλʹ, Freeλʹ.prototype,
  Pureλ, Pureλ.prototype,
  Chainλ, Chainλ.prototype,
  Liftλ, Liftλ.prototype,
  Apλ, Apλ.prototype,
].forEach(patch)


//$off
Object.assign(Pure, Pureλ); (Pure: typeof Pureλ)
//$off
Object.assign(Chain, Chainλ); (Chain: typeof Chainλ)
//$off
Object.assign(Ap, Apλ); (Ap: typeof Apλ)
//$off
Object.assign(Lift, Liftλ); (Lift: typeof Liftλ)

function liftF(command): Liftλ {
  return new Liftλ(command, id)
}

export const Free: {
  (): void,
  Pure<A>(x: A): Pureλ<A>,
  Ap: typeof Ap,
  Lift: typeof Lift,
  Chain: typeof Chain,
  chainRec: typeof chainRec,
} = Object.assign(function Free() {}, {
  Pure,
  of: Pure,
  liftF,
  Ap,
  Chain,
  Lift,
  chainRec,
})


export default Free

//
// function Lift(x, f) {
//   if (!(this instanceof Lift)) {
//     return new Lift(x, f)
//   }
//   this.x = x
//   this.f = f
// }
// Lift.prototype = Object.create(Free.prototype)
// Lift.prototype.constructor = Lift
// Lift.prototype.cata = function(d) { return d.Lift(this.x, this.f) }
//
// function Ap(x, y) {
//   if (!(this instanceof Ap)) {
//     return new Ap(x, y)
//   }
//   this.x = x
//   this.y = y
// }
// Ap.prototype = Object.create(Free.prototype)
// Ap.prototype.constructor = Ap
// Ap.prototype.cata = function(d) { return d.Ap(this.x, this.y) }
//
// function Chain(x, f) {
//   if (!(this instanceof Chain)) {
//     return new Chain(x, f)
//   }
//   this.x = x
//   this.f = f
// }
//
// Chain.prototype = Object.create(Free.prototype)
// Chain.prototype.constructor = Chain
// Chain.prototype.cata = function(d) { return d.Chain(this.x, this.f) }
//
// Free.Pure = Pure
// Free.Ap = Ap
// Free.Lift = Lift
// Free.Chain = Chain
//
// const compose = (f, g) => (x) => f(g(x))
// const id = x => x
//
// /* istanbul ignore next */
// Free.Pure.toString = () => 'Free.Pure'
// /* istanbul ignore next */
// Free.Ap.toString = () => 'Free.Ap'
// /* istanbul ignore next */
// Free.Lift.toString = () => 'Free.Lift'
// /* istanbul ignore next */
// Free.Chain.toString = () => 'Free.Chain'
// /* istanbul ignore next */
// Free.prototype.toString = function() {
//   return this.cata({
//     Pure : (x) => `Free.Pure(${x})`,
//     Lift : (x, f) => `Free.Lift(${x},=>)`,
//     Ap   : (x, y) => `Free.Ap(${x},${y})`,
//     Chain: (x, f) => `Free.Chain(${x},=>)`,
//   })
// }
//
// Free.of = Free.Pure
// Free.liftF = command => Free.Lift(command, id)
//
// Free.prototype.map = function(f) {
//   return this.cata({
//     Pure : (x) => Free.Pure(f(x)),
//     Lift : (x, g) => Free.Lift(x, compose(f, g)),
//     Ap   : (x, y) => Free.Ap(x, map((a) => map(f, a), y)),
//     Chain: (x, g) => Free.Chain(x, (a) => map(f, g(a))),
//   })
// }
//
// Free.prototype.ap = function(y) {
//   return this.cata({
//     Pure : (x) => map((f) => f(x), y),
//     Ap   : () => Free.Ap(this, y),
//     Lift : () => Free.Ap(this, y),
//     Chain: () => Free.Ap(this, y),
//   })
// }
//
// Free.prototype.chain = function(f) {
//   return this.cata({
//     Pure : (x) => f(x),
//     Ap   : () => Free.Chain(this, f),
//     Lift : () => Free.Chain(this, f),
//     Chain: (x, g) => Free.Chain(x, (v) => chain(f, g(v))),
//   })
// }
//
// Free.prototype.hoist = function(f) {
//   return this.foldMap(compose(Free.liftF, f), Free)
// }
//
// Free.prototype.retract = function(m) {
//   return this.foldMap(id, m)
// }
//
// Free.prototype.foldMap = function(f, m) {
//   return m.chainRec((next, done, v) => v.cata({
//     Pure : (x) => map(done, of(m, x)),
//     Lift : (x, g) => map(compose(done, g), f(x)),
//     Ap   : (x, y) => map(done, ap(y.foldMap(f, m), x.foldMap(f, m))),
//     Chain: (x, g) => map(compose(next, g), x.foldMap(f, m)),
//   }), this)
// }
//
// Free.prototype.graft = function(f) {
//   return this.foldMap(f, Free)
// }
//

const chainRecNext = (value) => ({ done: false, value })
const chainRecDone = (value) => ({ done: true, value })

function chainRec(f, i) {
  return chain(
    ({ done, value }) => done ? new Pureλ(value) : chainRec(f, value),
    f(chainRecNext, chainRecDone, i)
  )
}

//
// Free.chainRec = (f, i) => chain(
//   ({ done, value }) => done ? Free.of(value) : Free.chainRec(f, value),
//   f(chainRecNext, chainRecDone, i)
// )
//
// // patchAll([Free, Free.prototype])
//
// // module.exports = Free
//
// export default Free
