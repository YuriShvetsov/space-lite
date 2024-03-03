export function focusFirstElement(form) {
  const elements = Array.from(form.elements);
  const importantElements = elements.filter(item => item.hasAttribute('important'));
  const firstElement = importantElements.length ? importantElements[0] : elements[0];

  firstElement.focus()
}

export function catchFocus(form) {
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

export function execWhenShiftEnter(callback) {
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
