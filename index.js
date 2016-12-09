
'use strict'
// const yaml = require('js-yaml')
// const moml = require('moml')

/**
 * Markdown data static class.
 * @class
 */
class MarkdownData {

  /**
   * Parses markdown string
   * @param {String} s
   * @return {Object}
   */
  static parse (s) {
    if (!s || typeof s !== 'string') {
      return null
    }

    // Extract data blocks
    let datablocks = []
    try {
      s = s.replace(/^<!--([a-z][a-z0-9:\.]+)\n((.*\n)*?)-->(\n|$)/gm,
        function (match, $1, $2, offset, original) {
          datablocks.push({type: $1, data: $2.trim()})
          return ''
        })
    } catch (e) {
      console.log(e.message)
    }

    let data = {}
    for (let db of datablocks) {
      console.log(db.type)
    }

    return {markdown: s, extracted_data: data}
  }

}

module.exports = MarkdownData
