//@flow

export type { TLMethod, TLConstruct, TLSchema } from '../tl/index.h'

export type SchemaParam = {
  name: string,
  type: string
}

export type SchemaElement = {
  id: string,
  type: string,
  params: SchemaParam[]
}

export type TLParam = {
  name: string,
  typeClass: string,
  isVector: boolean,
  isFlag: boolean,
  flagIndex: number
}