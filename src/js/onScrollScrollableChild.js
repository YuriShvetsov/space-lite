export const addListeners = (parent) => {
  const scrollChildren = Array.from(parent.querySelectorAll('.js-scroll-child'))

  scrollChildren.forEach(element => {
    let timeout = null
    const handler = (event) => {
      clearTimeout(timeout)
      event.target.classList.remove('scrollable-child_scrollbar-hidden')
      timeout = setTimeout(() => {
        event.target.classList.add('scrollable-child_scrollbar-hidden')
      }, 2000)
    }
    const throttledHandler = _.throttle(handler, 200)

    element.classList.add('scrollable-child_scrollbar-hidden')
    element.addEventListener('scroll', throttledHandler)
  })
}

export const removeListeners = (parent) => {
  const scrollChildren = Array.from(parent.querySelectorAll('.js-scroll-child'))

  scrollChildren.forEach(element => {
    element.removeEventListener('scroll', throttledHandler);
  })
}
