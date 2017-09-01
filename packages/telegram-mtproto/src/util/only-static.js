//@flow


export class OnlyStatic {
  constructor() {
    throw new Error(`Created instance of only static class`)
  }
}

export default OnlyStatic
