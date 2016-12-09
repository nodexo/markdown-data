
'use strict'

const PARSERS = {
  yaml: require('js-yaml').safeLoad,
  moml: require('moml').parse,
  toml: require('toml').parse,
  json: JSON.parse
}

const defaultOptions = {
  silent: false
}

/**
 * Markdown data static class.
 * @class
 */
class MarkdownData {

  /**
   * Merge user options with default options
   * @param {Object} userOptions
   * @return {Object}
   */
  static _mergeOptions (userOptions) {
    if (Object.prototype.toString.call(userOptions) === '[object Object]') {
      for (let key of Object.keys(userOptions)) {
        if (defaultOptions.hasOwnProperty(key) === false) {
          throw new Error('Unsupported option: ' + key)
        }
      }
      return Object.assign({}, defaultOptions, userOptions)
    }
    return defaultOptions
  }

  /**
   * Parse data string
   * @param {String} s
   * @return {Object}
   */
  static _parseData (t, s, o) {
    try {
      return PARSERS[t](s)
    } catch (e) {
      if (o.silent === false) {
        throw new Error(e.message)
      }
    }
  }

  /**
   * Parse markdown string
   * @param {String} s
   * @return {Object}
   */
  static parse (s, userOptions) {
    const options = this._mergeOptions(userOptions)
    if (!s || typeof s !== 'string') {
      if (options.silent === false) {
        throw new Error('The first parameter has to be of type string!')
      }
      return null
    }

    // Extract data blocks
    let datablocks = []
    try {
      s = s.replace(/^<!--([a-z0-9]+):?([a-z0-9-_.]+)?\n((.*\n)*?)-->(\n|$)/gm,
        function (match, $1, $2, $3, offset, original) {
          datablocks.push({type: $1, key: $2 || null, data: $3.trim()})
          return ''
        })
    } catch (e) {
      console.log(e.message)
    }

    // Parse blocks
    let data = {}
    for (let db of datablocks) {
      if (PARSERS[db.type]) {
        try {
          let obj = {}
          if (db.key) {
            obj[db.key] = this._parseData(db.type, db.data, options)
          } else {
            obj = this._parseData(db.type, db.data, options)
          }
          data = Object.assign({}, data, obj)
        } catch (e) {
          console.log(e.message)
        }
      } else {
        if (options.silent === false) {
          throw new Error(`Unsupported parser: ${db.type}`)
        }
      }
    }

    return {markdown: s, data: data}
  }

}

module.exports = MarkdownData
