//@flow

export type VariString = string[] | string

type BaseLogger = {
  (...tags: VariString[]): (...objects: any[]) => void,
}

export interface LoggerInstance extends BaseLogger {
  group(name: string): GroupLogger
}

export interface GroupLogger extends BaseLogger {
  groupEnd(): void
}