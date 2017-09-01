//@flow

export interface ᐸTypeclassᐳMap <T> {
  map<S>(fn: (x: T) => S): ᐸTypeclassᐳMap<S>
}


export class Coyoneda<I, O> implements ᐸTypeclassᐳMap<O> {
  f: (x: I) => O
  val: I[]
  constructor(f: (x: I) => O, val: I[]) {
    this.f = f
    this.val = val
  }
  map<S>(f: (x: O) => S): Coyoneda<I, S> {
    return new Coyoneda((x: I) => f(this.f(x)), this.val)
  }
  lower() { return this.val.map(this.f) }
}

type MonoCoyoneda<I> = Coyoneda<I, I>

export function ᐸCoyonedaᐳlift<I>(x: I[]): MonoCoyoneda<I> {
  return new Coyoneda(a => a, x)
}


// function Coyoneda(f, fa){ return new _Coyoneda(f, fa) }

// Coyoneda.lift = function(x){ return Coyoneda(id, x) }
