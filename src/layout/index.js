//@flow

import has from 'ramda/src/has'
import flip from 'ramda/src/flip'
import contains from 'ramda/src/contains'

import type { SchemaElement, TLMethod, TLConstruct, TLSchema, SchemaParam } from './index.h'

class TypeClass {
  name: string

  types: Set<string> = new Set
  constructor(name: string) {
    this.name = name
  }
  /*isTypeOf(value: any): boolean {
    return false
  }*/
}

class Argument {
  id: string
  name: string
  typeClass: string
  isVector: boolean
  isBare: boolean
  isFlag: boolean
  flagIndex: number
  fullType: string
  constructor(id: string,
              name: string,
              typeClass: string,
              isVector: boolean = false,
              isBare: boolean = false,
              isFlag: boolean = false,
              flagIndex: number = NaN) {
    this.name = name
    this.typeClass = typeClass
    this.isVector = isVector
    this.isBare = isBare
    this.isFlag = isFlag
    this.flagIndex = flagIndex
    this.id = id

    this.fullType = Argument.fullType(this)
  }
  static fullType(obj: Argument) {
    const { typeClass, isVector, isFlag, flagIndex } = obj
    let result = typeClass
    if (isVector)
      result = `Vector<${result}>`
    if (isFlag)
      result = `flags.${flagIndex}?${result}`
    return result
  }
}

class Creator {
  id: number
  name: string //predicate or method
  hasFlags: boolean
  params: Argument[]
  constructor(id: number,
              name: string,
              hasFlags: boolean,
              params: Argument[]) {
    this.id = id
    this.name = name
    this.hasFlags = hasFlags
    this.params = params
  }
}

class Method extends Creator {
  returns: string
  constructor(id: number,
              name: string,
              hasFlags: boolean,
              params: Argument[],
              returns: string) {
    super(id, name, hasFlags, params)
    this.returns = returns
  }
}

class Type extends Creator {
  typeClass: string
  constructor(id: number,
              name: string,
              hasFlags: boolean,
              params: Argument[],
              typeClass: string) {
    super(id, name, hasFlags, params)
    this.typeClass = typeClass
  }
}

const isFlagItself =
  (param: SchemaParam) =>
    param.name === 'flags' &&
    param.type === '#'

export class Layout {
  typeClasses: Map<string, TypeClass> = new Map
  creators: Set<string> = new Set
  seqSet: Set<string> = new Set
  args: Map<string, Argument> = new Map
  funcs: Map<string, Method> = new Map
  types: Map<string, Type> = new Map
  typesById: Map<number, Type> = new Map
  typeDefaults: Map<string, { _: string }> = new Map
  schema: TLSchema
  makeCreator(elem: SchemaElement,
              name: string,
              sign: string,
              Construct: typeof Method | typeof Type) {
    const args: Argument[] = []
    let hasFlags = false
    for (const [ i, param ] of elem.params.entries()) {
      if (isFlagItself(param)) {
        hasFlags = true
        continue
      }
      const id = `${name}.${param.name}/${i}`
      const { typeClass, isVector, isFlag, flagIndex, isBare } = getTypeProps(param.type)
      if (isFlag) hasFlags = true
      this.pushTypeClass(typeClass)
      const arg = new Argument(id, param.name, typeClass, isVector, isBare, isFlag, flagIndex)
      if (param.name === 'seq') {
        this.seqSet.add(name)
      }
      args.push(arg)
      this.args.set(id, arg)
    }
    const id = parseInt(elem.id, 10)
    const creator = new Construct(id, name, hasFlags, args, sign)
    this.creators.add(name)
    if (creator instanceof Method)
      this.funcs.set(name, creator)
    else if (creator instanceof Type) {
      this.types.set(name, creator)
      this.typesById.set(id, creator)
    }
  }
  makeMethod(elem: TLMethod) {
    const name = elem.method
    const returns = elem.type
    this.pushTypeClass(returns, name)
    this.makeCreator(elem, name, returns, Method)
  }
  pushTypeClass(typeClass: string, type?: string) {
    let instance
    if (this.typeClasses.has(typeClass))
      instance = this.typeClasses.get(typeClass)
    else {
      instance = new TypeClass(typeClass)
      this.typeClasses.set(typeClass, instance)
    }
    if (type && instance)
      instance.types.add(type)
  }
  makeType(elem: TLConstruct) {
    const name = elem.predicate
    const typeClass = elem.type
    this.pushTypeClass(typeClass, name)
    this.makeCreator(elem, name, typeClass, Type)
  }
  makeLayout(schema: TLSchema) {
    const { methods, constructors } = schema
    constructors.map(this.makeType)
    methods.map(this.makeMethod)
    for (const [ key, type ] of this.types.entries())
      if (hasEmpty(key))
        this.typeDefaults.set(type.typeClass, { _: key })
  }
  constructor(schema: TLSchema) {
    //$FlowIssue
    this.makeType = this.makeType.bind(this)
    //$FlowIssue
    this.makeMethod = this.makeMethod.bind(this)
    // this.schema = schema
    this.makeLayout(schema)
  }
}
const hasEmpty = contains('Empty')
const hasQuestion = contains('?')
const hasVector = contains('<')
const hasBare = contains('%')

export const getTypeProps = (rawType: string) => {
  const result = {
    typeClass: rawType,
    isVector : false,
    isFlag   : false,
    flagIndex: NaN,
    isBare   : false
  }
  if (hasQuestion(rawType)) {
    const [ prefix, rest ] = rawType.split('?')
    const [ , index ] = prefix.split('.')
    result.isFlag = true
    result.flagIndex = +index
    result.typeClass = rest
  }
  if (hasVector(result.typeClass)) {
    result.isVector = true
    result.typeClass = result.typeClass.slice(7, -1)
  }
  if (hasBare(result.typeClass)) {
    result.isBare = true
    result.typeClass = result.typeClass.slice(1)
  }
  return result
}

export const isSimpleType: (type: string) => boolean =
  flip(contains)(
    ['int', /*'long',*/ 'string', /*'double', */'true', /*'bytes'*/])

const getFlagsRed =
  (data: Object) =>
    (acc: number, { name, flagIndex }: Argument) =>
        has(name, data)
          ? acc + 2 ** flagIndex
          : acc

export const getFlags = ({ params }: Creator) => {
  const flagsParams =
    params.filter(
      (e: Argument) => e.isFlag)

  return (data: Object) =>
    flagsParams
      .reduce(
        getFlagsRed(data),
        0)
}

export default Layout