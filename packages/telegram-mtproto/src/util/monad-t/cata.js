//@flow

// type Maker1<A> = (a: A) => { [field: string]: A }
// type Maker2<A, B> = (a: A, b: B) => { a: A, b: B }
// type Maker3<A, B, C> = (a: A, b: B, c: C) => { a: A, b: B, c: C }
//
// declare var m: Maker3<string, number, 1>
//
// const mm = m
// mm

const example = {
  read : (path: string) => ({ path }),
  write: (path: string, data: number[]) => ({ path, data }),
}

class Cata<T> {
  data: T
  tag: string
  constructor(tag: string, data: T) {
    this.data = data
    this.tag = tag
  }
}

// const res = cata(example)
// const calls = res.read('val')
// calls
//
// type ToCata = <I, V>((...I) => V) => ((...I) => Cata<V>)
//
// function cata<T: {[variant: string]: <-I, +O>(...$ReadOnlyArray<I>) => O}>(types: T): $ObjMap<T, ToCata> {
//   const keys = Object.keys(types)
//   const result = keys.reduce((acc, key) => ({
//     ...acc,
//     [key](...args) {
//       const obj = types[key](...args)
//       return new Cata(key, obj)
//     }
//   }), {})
//
//   return result
// }
