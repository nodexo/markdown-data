
'use strict'
const tap = require('tap')
const markdownData = require('../index.js')

let expectedResult
let result

/**
 * Correct Headers
 */
expectedResult = {
  data: {
    meta: {
      title: 'H1 Header'
    }
  }
}

result = () => {
  let result = markdownData.parse(`
H1 Header
=====================================

Another H1 Header
=====================================
`)

  delete result.markdown
  return result
}
tap.strictSame(result(), expectedResult, 'Extract H1 Header - setext style (1)')

result = () => {
  let result = markdownData.parse(`
H2 Header
---------
Some Text

H1 Header
=====================================
Bla bla bla...
`)

  delete result.markdown
  return result
}
tap.strictSame(result(), expectedResult, 'Extract H1 Header - setext style (2)')

result = () => {
  let result = markdownData.parse(`
# H1 Header

# Another H1 Header
`)

  delete result.markdown
  return result
}
tap.strictSame(result(), expectedResult, 'Extract H1 Header - atx style (1)')

result = () => {
  let result = markdownData.parse(`
# H1 Header #

# Another H1 Header #
`)

  delete result.markdown
  return result
}
tap.strictSame(result(), expectedResult, 'Extract H1 Header - atx style (2)')

result = () => {
  let result = markdownData.parse(`
### H3 Header
Some Text

# H1 Header
Bla bla bla...
`)

  delete result.markdown
  return result
}
tap.strictSame(result(), expectedResult, 'Extract H1 Header - atx style (3)')
