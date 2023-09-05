export const flat = arr => {
  let result = []

  for (let item of arr) {
    if (Array.isArray(item)) {
      result = result.concat(flat(item))
    } else {
      result.push(item)
    }
  }

  return result
}

export const delay = (ms = 0, cancellable = false) => {
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
