//@flow

export const Switch = (patterns: *, protector: *) =>
  (matches: *, mProtector: *) => (...data: *) => {
    const keyList = Object.keys(patterns)
    const normalized = protector(...data)
    for (const key of keyList)
      if (patterns[key](normalized))
        return mProtector(matches[key])
  }

export default Switch
