// //@flow

// import { of } from 'fluture'
// import Bluebird from 'bluebird'
// import { pipe } from 'ramda'
// let result



// const escapeTick = f =>  function imprisoned(x){ setTimeout(thunk(f, x), 0) }
// const escapeImmediate = f =>  function imprisoned(x){ setImmediate(thunk(f, x)) }
// const escapeNextTick = f =>  function imprisoned(x){ process.nextTick(thunk(f, x)) }

// const cases = {
//   none    : 'none',
//   promise : 'promise',
//   future  : 'future',
//   handmade: 'handmade',
//   all     : 'all',
// }

// const select = cases.all

// log(`\n--- begin ${select} ---`)

// const wrapPromise = (rs, rj) => promise => promise.then(rs, rj)

// const prom = Promise.resolve(1)

// const fn = pipe(x => x + 1, killer, log)
// const escapedLog = escapeTick(log)
// const andThen = f2 => f1 => function runner(x) { f2(f1(x)) }
// const withLog = andThen(log)

// const immediateRun = (function() {
//   if (typeof process === 'object' && typeof process.nextTick === 'function')
//     return process.nextTick
//   if (typeof setImmediate === 'function')
//     return setImmediate
//   return function(escaped, arg1) {
//     setTimeout(escaped, 0, arg1)
//   }
// })()

// function runner({ rs, rj, fn, args }) {
//   const result = fn.apply(fn, args)
//   if (result != null && typeof result.then === 'function')
//     result.then(rs, rj)
//   else
//     rs(result)
// }


// function resolveTick(fn, args) {
//   return function resolveInner(rs, rj){
//     immediateRun(runner, { rs, rj, fn, args })
//   }
// }

// function immedi<O>(
//   fn: (...args: Array<any>) => O,
//   ...args: Array<any>
// ): Promise<O> {
//   return new Bluebird(resolveTick(fn, args))
// }

// switch (select) {
//   case 'handmade': {
//     const result = prom.then(escapeImmediate(fn))
//     break
//   }
//   case 'promise': {
//     const wrapper = wrapPromise(fn, error)
//     const result = wrapper(prom)
//     // .catch(escapeTick(error))
//     // .catch(err => { throw err })
//     // .catch(error)
//     //.then(log, error)
//     //.then(escapeTick(log), escapeTick(error))
//     break
//   }
//   case 'future': {
//     const result = of(1)
//       .map(x => x + 1)
//       .map(killer)
//       .fork(error, log)
//     break
//   }
//   case 'none': {
//     const result = {}.foo.bar
//     break
//   }
//   case 'all': {
//     all()
//     break
//   }
// }


// function all() {
//   // inner: {
//   //   log('timeout inner')
//   //   setTimeout(function inner() { killer() }, 0)
//   // }
//   // noInner: {
//   //   log('timeout no inner')
//   //   setTimeout(killer, 0)
//   // }


//   // escapeTick: {
//   //   log('escaped')
//   //   escapeTick(killer)('escapeTick')
//   // }
//   immedi: {
//     log('immedi')
//     immedi((text) => Bluebird.resolve(killer(text)), 'immedi')
//       .catch(({ message }) => log(message))
//   }
//   // escapeImmediate: {
//   //   log('escapeImmediate')
//   //   escapeImmediate(killer)('escapeImmediate')
//   // }
//   // escapeNextTick: {
//   //   log('escapeNextTick')
//   //   escapeNextTick(killer)('escapeNextTick')
//   // }
//   // future: {
//   //   log('future')
//   //   of()
//   //     .map(killer)
//   //     .fork(error, log)
//   // }
//   // immediate: {
//   //   log('immediate')
//   //   setImmediate(killer)
//   // }
//   // tick: {
//   //   log('tick')
//   //   process.nextTick(killer)
//   // }
//   // promiseImm: {
//   //   log('promiseImm')
//   //   prom.then(escapeImmediate(fn))
//   // }
//   // promiseTick: {
//   //   log('promiseTick')
//   //   prom.then(escapeNextTick(killer))
//   // }
//   next: {
//     // log('next')
//   }
// }

// export { result }


// function log(data): any {
//   console.log(`\n`, data)
//   return data
// }
// function error(err: Error): any {
//   console.error(err.message, `\n--- err! ---`)
//   return err
// }

// log(`should not see this`)

// function thunk(f, x) { return () => { f(x) } }

// function killer(x: any) {
//   log(`killer ${x}`)
//   return x.foo.bar
// }
