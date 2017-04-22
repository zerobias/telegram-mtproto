//@flow

import RandomBytes from 'randombytes'

const getRandom = (arr: number[]) => {
  const ln = arr.length
  const buf = RandomBytes(ln)
  for (let i = 0; i < ln; i++)
    arr[i] = buf[i]
  return arr
}

export default getRandom