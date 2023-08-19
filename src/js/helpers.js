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

export const delay = (ms = 0) => {
  return new Promise(resolve => setTimeout(resolve, ms))
}
