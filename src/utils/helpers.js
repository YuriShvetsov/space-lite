import { findIndex, keys, set } from 'lodash'

// Async utils

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

export const asyncRepeatBlocker = callback => {
  let isCalled = false

  return async (...params) => {
    if (isCalled) return

    isCalled = true
    await callback(...params)
    isCalled = false
  }
}

// Arrays

export const update = (arr, query, modifier) => {
  const index = findIndex(arr, query)
  const updatedItem = arr[index]
  const modifierKeys = keys(modifier)

  modifierKeys.forEach(key => {
    set(updatedItem, key, modifier[key] )
  })
}

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

// Forms

export const focusFirstElement = form => {
  const elements = [...form.elements]
  const importantElements = elements.filter(item => item.hasAttribute('important'))
  const firstElement = importantElements.length ? importantElements[0] : elements[0]

  firstElement.focus()
}

export const catchFocus = form => {
  const elements = form.elements
  const firstElement = elements[0]
  const lastElement = elements[elements.length - 1]

  lastElement.addEventListener('keydown', e => {
    if (!e.shiftKey && e.key === 'Tab') {
      firstElement.focus()
      e.preventDefault()
    }
  })

  firstElement.addEventListener('keydown', e => {
    if (e.shiftKey && e.key === 'Tab') {
      lastElement.focus()
      e.preventDefault()
    }
  })
}

export const execWhenShiftEnter = callback => {
  const handler = (e) => {
    if (e.shiftKey && e.key === 'Enter') {
      e.preventDefault()
      callback()
    }
  }

  document.addEventListener('keydown', handler)

  return function() {
    document.removeEventListener('keydown', handler)
  }
}
