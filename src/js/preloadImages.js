function preloadImages(urls, allImagesLoadedCallback) {
  let loadedCounter = 0
  const toBeLoadedNumber = urls.length

  urls.forEach(function (url) {
    preloadImage(url, function () {
      loadedCounter++

      if (loadedCounter == toBeLoadedNumber) {
        allImagesLoadedCallback()
      }
    })
  })

  function preloadImage(url, anImageLoadedCallback) {
    const img = new Image()

    img.onload = anImageLoadedCallback
    img.src = url
  }
}

preloadImages(
  [
    '../assets/images/add-list.svg',
    '../assets/images/add-task.svg',
    '../assets/images/check.svg',
    '../assets/images/copy.svg',
    '../assets/images/delete.svg',
    '../assets/images/edit.svg',
    '../assets/images/export.svg',
    '../assets/images/grabber.svg',
    '../assets/images/import.svg',
    '../assets/images/left-arrow.svg',
    '../assets/images/menu.svg',
    '../assets/images/minus.svg',
    '../assets/images/quill.png',
    '../assets/images/quill.svg',
    '../assets/images/upload.svg',
    '../assets/images/vue.png',
    '../assets/images/warning.svg',
    '../assets/images/webpack-logo.svg'
  ],
  function () {
    console.log('All images were loaded')
  }
)
