const startupLoader = {
  loader: new Image(),
  show() {
    this.loader.src = '/gif/rhombus.gif'
    this.loader.style.cssText = `
      position: fixed;
      top: 50%;
      left: 50%;
      transform: translate(-50%, -50%);
    `
    
    document.body.append(this.loader)
  },
  hide() {
    this.loader.remove()
    this.loader = null
  }
}

startupLoader.show()

export { startupLoader }
