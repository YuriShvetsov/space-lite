function translateHtmlToStr(html) {
  const levels = getLevel(html)
  const lines = flat(levels).map(level => {
    if (level == '<br>') return ''
    return level.replace(/<br>/, '')
  })

  return lines.join('\n')

  function getLevel(src) {
    const items = []
    let item = ''
    let counter = 0

    for (let i = 0; i < src.length; i++) {
      if (src.substr(i, 5) === '<div>' && counter === 0) {
        counter++
        i += 4

        if (item !== '') {
          items.push(item)
          item = ''
        }
      } else if (src.substr(i, 5) === '<div>' && counter > 0) {
        counter++
        i += 4
        item += '<div>'
      } else if (src.substr(i, 6) === '</div>' && counter > 1) {
        counter--
        i += 5
        item += '</div>'
      } else if (src.substr(i, 6) === '</div>' && counter === 1) {
        counter = 0
        i += 5
        items.push(item)
        item = ''
      } else if (src.substr(i, 14) === '<div><br></div>') {

      } else {
        item += src[i]
      }
    }

    return items.length ? items.map(item => getLevel(item)) : [src]
  }
}

function flat(arr) {
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

module.exports = {
  translateHtmlToStr
}
