//@flow


type TargetFn<R, Args> = <This>(...Args[]) => R
type CallerFn<R, Args> = <This>(that: This, val: Args[]) => R

function setFnProps<R, Args>(target: TargetFn<R, Args>, length: number, name: string) {
  Object.defineProperties(target, {
    length: {
      value       : length,
      enumerable  : false,
      configurable: true,
      writable    : false,
    },
    name: {
      value       : name,
      enumerable  : false,
      configurable: true,
      writable    : false,
    },
  })
}


function getFnProps<R, Args>(fn: TargetFn<R, Args>): {| length: number, name: string |} {
  return {
    length: fn.length,
    name  : fn.name,
  }
}



function apply<R, Args, This>(that: This, fn: (...Args[]) => R, args: Args[]): R {
  const result: R = fn.apply(that, args)
  return result
}

function caller<R, Args>(fn: (...Args[]) => R): CallerFn<R, Args> {
  return function callFn<This>(that: This, args: Args[]): R {
    return apply(that, fn, args)
  }
}

function resend<R, Args>(value: R): CallerFn<R, Args> {
  const resolve: CallerFn<R, Args> = function(): R {
    return value
  }
  return resolve
}

function callWrapper<R, Args>(fn: CallerFn<R, Args>): TargetFn<R, Args> {
  let call: CallerFn<R, Args> = function<This>(that: This, args: Args[]): R {
    const result: R = fn(that, args)
    const newCall: CallerFn<R, Args> = resend(result)
    call = newCall
    return result
  }
  const target: TargetFn<R, Args> = function<This>(...args: Args[]): R {
    const self: any = this
    const that: This = self
    const result: R = call(that, args)
    return result
  }
  return target
}

function once<R, Args>(fn: TargetFn<R, Args>): TargetFn<R, Args> {
  const { length, name } = getFnProps(fn)
  const call: CallerFn<R, Args> = caller(fn)
  const target: TargetFn<R, Args> = callWrapper(call)
  setFnProps(target, length, name)
  return target
}

export default once
