//@flow

/* eslint-disable no-underscore-dangle */

export default class Tuple {
  _1: *
  _2: *
  constructor(fst: *, snd: *) {
    this._1 = fst
    this._2 = snd
  }

  dimap(f: *, g: *) {
    return new Tuple(f(this._1), g(this._2))
  }
  map(f: *) {
    return new Tuple(this._1, f(this._2))
  }
  curry(f: *) {
    return f(this)
  }
  uncurry(f: *) {
    return f(this._1, this._2)
  }
  extend(f: *) {
    return new Tuple(this._1, f(this))
  }
  extract()  {
    return this._2
  }
  foldl(f: *, z: *) {
    return f(this._2, z)
  }
  foldr(f: *, z: *) {
    return f(z, this._2)
  }
  foldMap(f/*:: : *, p: * */) {
    return f(this._2)
  }
}

export class Tuple2 extends Tuple {
  _1: Tuple2
  _2: Tuple2
  constructor(fst: Tuple2, snd: Tuple2) {
    super(fst, snd)
  }
  concat(b: Tuple2) {
    return new Tuple2(
      this._1.concat(b._1),
      this._2.concat(b._2)
    )
  }
}
