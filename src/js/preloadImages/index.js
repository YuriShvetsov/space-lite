import images from './images.json';

function preloadImages() {
  const imageNames = images.names
  const path = '../../assets/images/'
  const div = document.createElement('div')
  
  div.style = 'width: 0; height: 0; position: absolute; position:absolute; z-index:-1000; opacity:0; overflow: hidden;'
  
  function preload(url) {
    let img = new Image()

    img.src = url
    div.append(img)
  }

  imageNames.forEach(name => preload(path + name))
  document.body.append(div)
}

window.onload = preloadImages
