import { get } from 'lodash'
import { delay } from './helpers'

export default class Swapper {
  constructor() {
    this.parent = null
    this.timeout = null

    this.items = []
    this.movedItems = []

    this.timerStartMoving = null
    this.isMovingStarted = false

    this.observer = null
    this.observeConfig = { attributes: true, childList: true, subtree: true }

    this._firstSelectedCallback = () => {}
    this._readyCallback = () => {}
  }

  init(parent, timeout = 500) {
    this.parent = parent
    this.timeout = timeout

    this._setItems()
    this._setDocumentHandlers()
    this._observeChanges()
  }

  _setItems() {
    const children = [...this.parent.children]

    this.items = children.map(child => {
      const swapId = child.dataset.swapId
      const item = this.items.find(item => item.swapId === swapId)
      const hasHandlers = get(item, 'handled', false)

      if (hasHandlers) return item

      child.addEventListener('mousedown', this._onMouseDown.bind(this))
      child.addEventListener('mouseover', this._onMouseOver.bind(this))
      child.addEventListener('mouseout', this._onMouseOut.bind(this))

      return {
        swapId,
        el: child,
        handled: true
      }
    })
  }

  _setDocumentHandlers() {
    document.body.addEventListener('mouseup', this._onMouseUp.bind(this))
  }

  _observeChanges() {
    this.observer = new MutationObserver(this._setItems.bind(this))
    this.observer.observe(this.parent, this.observeConfig)
  }

  onFirstSelected(callback) {
    this._firstSelectedCallback = callback
  }

  onReady(callback) {
    this._readyCallback = callback
  }

  async _onMouseDown(e) {
    const leftButton = (e.which === 1)

    if (!leftButton) return

    const el = e.currentTarget
    const swapId = el.dataset.swapId

    this.timerStartMoving = delay(this.timeout, true)

    await this.timerStartMoving.promise

    if (!this.timerStartMoving) return

    this.timerStartMoving = null
    this.isMovingStarted = true

    this.movedItems.push(swapId)
    document.documentElement.setAttribute('data-mode', 'draggable')

    this._firstSelectedCallback(swapId)
  }

  _onMouseUp(e) {
    if (this.timerStartMoving) {
      this.timerStartMoving.cancel()
      this.timerStartMoving = null

      return
    }

    if (!this.isMovingStarted) return

    if (this.movedItems.length === 2) {
      this._readyCallback(this.movedItems)
    }

    document.documentElement.removeAttribute('data-mode')
    this.timerStartMoving = null
    this.movedItems = []
    this.isMovingStarted = false
  }

  _onMouseOver(e) {
    if (!this.isMovingStarted) return

    const el = e.currentTarget
    const swapId = el.dataset.swapId

    if (this.movedItems[0] === swapId) return

    this.movedItems.push(swapId)
  }

  _onMouseOut(e) {
    if (this.timerStartMoving) {
      this.timerStartMoving.cancel()
      this.timerStartMoving = null
      this._reset()

      return
    }

    if (!this.isMovingStarted) return

    const el = e.currentTarget
    const swapId = el.dataset.swapId

    if (this.movedItems[0] === swapId) return

    this.movedItems.pop()
  }

  _reset() {
    this.timerStartMoving = null
    this.isMovingStarted = false
    this.movedItems = []

    document.documentElement.removeAttribute('data-mode')
  }

  destroy() {
    this.observer.disconnect()
  }
}
