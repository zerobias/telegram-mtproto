//@flow

export function applySafe<Source, Work>(before: (val: Source) => Work, after: (val: Work) => Source) {
  return (transform: (val: Work) => Work) => (val: Source): Source => {
    const prepared: Work = before(val)
    const changed: Work = transform(prepared)
    const saved: Source = after(changed)
    return saved
  }
}
