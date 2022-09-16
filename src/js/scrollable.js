export default class Scrollable {
  constructor(el) {
    this.el = el
    this.timeout = null
  }

  _handler(e) {
    e.target.classList.remove('scrollable-child_scrollbar-hidden')
    clearTimeout(this.timeout)

    this.timeout = setTimeout(() => {
      e.target.classList.add('scrollable-child_scrollbar-hidden')
    }, 1500)
  }

  _throttledHandler = _.throttle(this._handler, 200)

  initListener() {
    this.el.classList.add('scrollable-child_scrollbar-hidden')
    this.el.addEventListener('scroll', this._throttledHandler)
  }

  removeListener() {
    this.el.removeEventListener('scroll', this._throttledHandler)
  }
}
