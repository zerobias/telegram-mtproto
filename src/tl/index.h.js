//@flow

export type BinaryData = number[] | Uint8Array

type TLParam = {
  name: string,
  type: string
}

export type TLConstruct = {
  id: string,
  type: string,
  predicate: string,
  params: TLParam[]
}

type TLMethod = {
  id: string,
  type: string,
  method: string,
  params: TLParam[]
}

export type TLSchema = {
  constructors: TLConstruct[],
  methods: TLMethod[],
  constructorsIndex?: number[]
}