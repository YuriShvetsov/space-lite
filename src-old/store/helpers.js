export const generateId = prefix => prefix + '-' + Date.now().toString(36)

export const getTargetFromProxy = proxy => {
  const constructor = Object.getPrototypeOf(proxy).constructor()
  const target = Object.assign(constructor, proxy)

  for (let prop in target) {
    if (typeof target[prop] === 'object') {
      target[prop] = getTargetFromProxy(target[prop])
    }
  }

  return target
}
  
