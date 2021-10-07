import { flat } from './helpers'

export const translateHtmlToStr = html => {
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
      } else {
        item += src[i]
      }
    }

    return items.length ? items.map(item => getLevel(item)) : [src]
  }
}

export const translateStrToHtml = str => {
  if (str === '') return str

  const lines = str.split(/\n|\r\n|\r/)
  const divList = lines.map(line => {
    if (line === '') return '<div><br></div>'

    return `<div>${ line }</div>`
  })

  return divList.join('')
}
