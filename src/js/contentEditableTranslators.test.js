import { translateHtmlToStr } from './contentEditableTranslators'

const testValues = [
  {
    input: '',
    output: ''
  },
  {
    input: 'abc',
    output: 'abc'
  },
  {
    input: 'abc<div>def</div>',
    output: 'abc\ndef'
  },
  {
    input: 'abc<div><br></div>',
    output: 'abc\n'
  },
  {
    input: 'abc<div><br></div><div>def</div>',
    output: 'abc\n\ndef'
  },
  {
    input: '<div>abc<div><br></div><div>def</div></div>',
    output: 'abc\n\ndef'
  },
  {
    input: '<div><div>abc<div><br></div><div>def</div></div></div>',
    output: 'abc\n\ndef'
  },
  {
    input: '1<div>2</div><div>4<br></div><div>4</div>',
    output: '1\n2\n4\n4'
  },
  {
    input: '1<div><br></div><div>3</div>',
    output: '1\n\n3'
  }
]

describe('Test of translateHtmlToStr function:', () => {

  for (let index in testValues) {
    test(`Test ${ +index + 1 }: ${testValues[index].input}`, () => {
      const input = testValues[index].input
      const output = testValues[index].output

      expect(translateHtmlToStr(input)).toBe(output)
    })
  }

})
