//@flow


const flatmap = <I, O>(fn: (x: I) => O[]) => (list: I[]) => {
  const ln = list.length
  const buffer: O[][] = new Array(ln)
  for (let i = 0; i < ln; i++) {
    const element: I = list[i]
    const callResult: O[] = fn(element)
    buffer[i] = callResult
  }
  const result: O[] = [].concat(...buffer)
  return result
}


export default flatmap
