//@flow

export class RequestCache<T> {
  cache: Set<T> = new Set
  timeout: number
  constructor(timeout: number) {
    this.timeout = timeout
  }
  remove = (val: T) => {
    this.cache.delete(val)
  }
  add(val: T) {
    this.cache.add(val)
    setTimeout(this.remove, this.timeout, val)
  }
  has(val: T) {
    if (this.cache.has(val)) return true
    this.add(val)
    return false
  }
}


type Selector<+O, -I> = (val: I) => O

export default function filter<T, I>(
  selector: Selector<T, I>,
  timeout: number
) {
  const cache: RequestCache<T> = new RequestCache(timeout)
  return (data: I) => !cache.has(selector(data))
}
