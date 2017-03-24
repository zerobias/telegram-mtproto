//@flow

import uuid from 'uuid/v1'
import contains from 'ramda/src/contains'
import split from 'ramda/src/split'

import type { TLSchema, TLConstruct, TLMethod, TLParam } from '../tl/index.h'

class SchemaFunc {
  id: string
  type: string
  method: string
  params: TLParam[]

  hasFlags: boolean
  flags: TLParam[]
}

class TLType {
  name: string

  creators: string[]

  isTypeOf(value: any): boolean {
    return false
  }
}

class TLArg {
  name: string
  type: string
  isVector: boolean
  isFlag: boolean
  flagIndex: number

  link: string = uuid()
  constructor(name: string,
              type: string,
              isVector: boolean = false,
              isFlag: boolean = false,
              flagIndex: number = NaN) {
    this.name = name
    this.type = type
    this.isVector = isVector
    this.isFlag = isFlag
    this.flagIndex = flagIndex
  }
  toString() {
    let result = this.type
    if (this.isVector)
      result = TLArg.toVector(result)
    if (this.isFlag)
      result = TLArg.toFlags(this.flagIndex, result)
    return result
  }
  static toVector(type: string) {
    return `Vector<${type}>`
  }
  static toFlags(index: number, type: string) {
    return `flags.${index}?${type}`
  }
}

class TLCreator {
  id: string //NOTE Maybe number will better?
  name: string //predicate or method
  type: string
  params: TLArg[]
}

class ParsedSchema {
  types: Map<string, TLType> = new Map
  creators: Map<string, TLCreator> = new Map
  funcs: Map<string, TLCreator> = new Map
}

const parse = (schema: TLSchema) => {
  const result = new ParsedSchema
  for (const creator of schema.constructors) {

  }
}


const hasQuestion = contains('?')
const hasVector = contains('<')
const splitQuestion = split('?')
const splitDot = split('.')