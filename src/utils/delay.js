export default (ms = 0, cancellable = false) => {
  if (!cancellable) {
    return new Promise(resolve => setTimeout(resolve, ms))
  }

  let timer
  let rejectPromise

  const promise = new Promise(resolve => {
    timer = setTimeout(resolve, ms)
    rejectPromise = resolve
  })
  const cancel = () => {
    clearTimeout(timer)
    rejectPromise()
  }

  return { cancel, promise }
}
