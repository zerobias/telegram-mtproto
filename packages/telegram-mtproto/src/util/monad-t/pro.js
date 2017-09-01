//@flow

import { Left, Right, type Apropos } from 'apropos'

import Tuple from './tuple'

export class Tagged<Tag> {
  +x: Tag
  constructor(x: Tag) {
    this.x/*:: ; const xx*/ = x
  }
  bimap<-F1, Tagʹ>(f: F1, g: (x: Tag) => Tagʹ): Tagged<Tagʹ> {
    return new Tagged(g(this.x))
  }

  left(): Tagged<Apropos<Tag, mixed>> {
    return new Tagged(Left(this.x))
  }

  right(): Tagged<Apropos<mixed, Tag>> {
    return new Tagged(Right(this.x))
  }
  static of<Tagʹ>(x: Tagʹ): Tagged<Tagʹ> {
    return new Tagged(x)
  }
}

// 
// const dimapʹ = curry((f, g, x) => {
//     return isFunction(x[dimap])
//          ? x[dimap](f, g)
//          : compose(g)(compose(x)(f))
// })
//
// const lmapʹ = curry((f, x) => {
//     return isFunction(x[lmap])
//          ? x[lmap]()
//          : isFunction(x[dimap])
//            ? dimapʹ(f, identity, x)
//            : compose(x)(f);
// })
//
// const mapʹ = curry((f, x) => {
//     return isFunction(x[map])
//          ? x[map]()
//          : isFunction(x[dimap])
//            ? dimap(identity, f, x)
//            : compose(f)(x)
// })
//
// const arr = f => mapʹ(f, x => x)
//
// class Profunctor<I, O> {
//   /*:: + */run: (x: I) => O
//   constructor(run: (x: I) => O) {
//     this.run/*:: ; const xx*/ = run
//   }
//   dimap(f, g) {
//     return new Profunctor(dimapʹ(f, g, this.run))
//   }
//
//   lmap<Iʹ>(f: (x: Iʹ) => I): Profunctor<Iʹ, O>
//     return new Profunctor((x: Iʹ) => this.run(f(x)))
//   }
//
//   map<Oʹ>(f: (x: O) => Oʹ): Profunctor<I, Oʹ> {
//     return new Profunctor((x: I) => f(this.run(x)))
//   }
// }
//
// const Profunctor = tagged('run')
//
//
//
//
// export type λStar<M> = {
//   of<-T>(data: T): M,
// }
//
// const Star = M => {
//
//     const Star = tagged('run');
//
//     Star.prototype[dimap] = function(f, g) {
//         return Star(mapʹ(g, compose(this.run)(f)));
//     };
//
//     Star.prototype[lmap] = function(f) {
//         return Star(compose(this.run)(f));
//     };
//
//     Star.prototype[map] = function(f) {
//         return Star(mapʹ(f, this.run));
//     };
//
//     Star.prototype.first = function() {
//         return Star(x => this.run(x._1)[map](y => Tuple(y, x._2)));
//     };
//
//     Star.prototype.second = function() {
//         return Star(x => this.run(x._2)[map](y => Tuple(x._1, y)));
//     };
//
//     Star.prototype.left = function() {
//         return Star(x => x.fold(
//             a => this.run(a)[map](Left),
//             a => M[of](Right(a))
//         ));
//     };
//
//     Star.prototype.right = function() {
//         return Star(x => x.fold(
//             a => M[of](Left(a)),
//             a => this.run(a)[map](Right)
//         ));
//     };
//
//     return Star;
// };
