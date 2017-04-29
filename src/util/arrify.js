//@flow

function arrify<E, V: E[] | E>(val?: V): E[] {
  if (val === null || val === undefined) {
    return []
  }
  if (Array.isArray(val)) return val
  else return [val]
}

export default arrify
