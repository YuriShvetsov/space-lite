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
