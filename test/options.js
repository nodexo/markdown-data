
'use strict'
const tap = require('tap')
const markdownData = require('../index.js')

let markdown, expectedResult, result

/**
 * Option Check
*/
tap.throws(function () { markdownData.parse('', { OptionWithTypo: true }) }, {}, 'Throw error: unsupported option')

/**
 * Silent
*/
tap.throws(function () { markdownData.parse({}, { Silent: false }) }, {}, 'Throw - Silent: false')
tap.doesNotThrow(function () { markdownData.parse({}, { Silent: true }) }, 'Throw - Silent: true')

/**
 * ExtractTitle
*/
markdown = `
H1 Header
=====================================

Paragraph
...

`

expectedResult = {
  data: {
    meta: {
      title: 'H1 Header'
    }
  }
}
result = () => {
  let result = markdownData.parse(markdown, {ExtractTitle: true})
  delete result.markdown
  return result
}
tap.strictSame(result(), expectedResult, 'Parse - ExtractTitle: true')

expectedResult = {
  data: {meta: {}}
}
result = () => {
  let result = markdownData.parse(markdown, {ExtractTitle: false})
  delete result.markdown
  return result
}
tap.strictSame(result(), expectedResult, 'Parse - ExtractTitle: false')

/**
 * RemoveDataTags
*/
markdown = `
<!-- meta:inline -->Inline<!-- -->

<!-- meta:block -->
This is a block consisting
of two lines

<!--moml
remark: This is a complete data block!
-->
`

expectedResult = {
  markdown: 'Inline\n\nThis is a block consisting\nof two lines'
}
result = () => {
  let result = markdownData.parse(markdown, {RemoveDataTags: true})
  delete result.data
  return result
}
tap.strictSame(result(), expectedResult, 'Parse - RemoveDataTags: true')

expectedResult = {
  markdown: '<!-- meta:inline -->Inline<!-- -->\n\n<!-- meta:block -->\nThis is a block consisting\nof two lines\n\n<!--moml\nremark: This is a complete data block!\n-->'
}
result = () => {
  let result = markdownData.parse(markdown, {RemoveDataTags: false})
  delete result.data
  return result
}
tap.strictSame(result(), expectedResult, 'Parse - RemoveDataTags: false')
