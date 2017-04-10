import { createWriteStream } from 'fs'
import dTime from './dtime'

import { toPairs, forEach, any, is, __, type } from 'ramda'

const DEL = Symbol('delete')

export function traverse(func: (obj: any, key: string | number) => any) {
  return function visitor(obj: any) {
    if (Array.isArray(obj)) {
      const result = []
      for (const [index, value] of obj.entries()) {
        const [edited, newIndex] = func(value, index)
        if (edited === DEL) continue
        const visited = visitor(edited, newIndex)
        result.push(visited)
      }
      return result
    } else if (typeof obj === 'object') {
      const result = {}
      const iterator = forEach(([index, value]) => {
        const [edited, newIndex] = func(value, index)
        if (edited === DEL) return
        const visited = visitor(edited, newIndex)
        result[newIndex] = visited
      })

      iterator(toPairs(obj))
      return result
    }
    return obj
  }
}

const arraysNormalize = (obj, key) => {
  let result = obj
  if (any(is(__, obj), [Uint8Array, Buffer, ArrayBuffer, Int32Array, Uint32Array]))
    result = { data: Array.from(obj), type: type(obj) }
  return [result, key]
}

const beforeStringify = traverse(arraysNormalize)
const stringify = (data) => JSON.stringify(beforeStringify(data))


const getId = () => Math.trunc( Math.random() * 1e6 )
const fileName = `logs/file-log-${getId()}.log`

const writeStream = createWriteStream(fileName)

const writer = (functionName: string) => ({
  input(data) {
    const id = getId()
    writeStream.write(`${dTime()} ${functionName} ${id} input\n${stringify(data)}\n`)
    return id
  },
  output: (id, data) => writeStream.write(`${dTime()} ${functionName} ${id} output\n${stringify(data)}\n`)
})

export default writer