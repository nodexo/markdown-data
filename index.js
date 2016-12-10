
'use strict'

const PARSERS = {
  yaml: require('js-yaml').safeLoad,
  moml: require('moml').parse,
  toml: require('toml').parse,
  json: JSON.parse
}

const defaultOptions = {
  data: {},
  extractTitle: true,
  removeDataTags: false,
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
  static _parseData (t, s, silent) {
    try {
      return PARSERS[t](s)
    } catch (e) {
      if (silent === false) {
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

    const data = options.data

    // Extract title
    if (options.extractTitle) {
      const result = s.match(/^#([^#].*)\n|^(.*)\n={3,}[ \t]*\n/m)
      if (result && !data.title) {
        data.title = (result[1] || result[2]).trim()
      }
    }

    // Parse tagged data
    s = s.replace(/(<!--)([a-z0-9.]+)([ \t]*-->)([^<]+)(<!--[ \t]*-->)/g,
        function (match, $1, $2, $3, $4, $5, offset, original) {
          if (!data[$2]) {
            data[$2] = $4.trim()
          }
          if (options.removeDataTags) {
            return $4
          }
          return $1 + $2 + $3 + $4 + $5
        })

    s = s.replace(/^(<!--)([a-zA-Z0-9-_.]+)([ \t]*-->\n)((.*\S.*(\n|$))+?)(\n|$)/gm,
          function (match, $1, $2, $3, $4, $5, offset, original) {
            if (!data[$2]) {
              data[$2] = $4.trim()
            }
            if (options.removeDataTags) {
              return $4
            }
            return $1 + $2 + $3 + $4 + $5
          })


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

    // Parse data blocks
    for (let db of datablocks) {
      if (PARSERS[db.type]) {
        try {
          let obj = this._parseData(db.type, db.data, options.silent)
          if (db.key) {
            if (!data[db.key]) {
              data[db.key] = {}
            }
            for (let k of Object.keys(obj)) {
              if (!data[db.key][k]) {
                data[db.key][k] = obj[k]
              }
            }
          } else {
            for (let k of Object.keys(obj)) {
              if (!data[k]) {
                data[k] = obj[k]
              }
            }
          }
        } catch (e) {
          console.log(e.message)
        }
      } else {
        if (options.silent === false) {
          throw new Error(`Unsupported parser: ${db.type}`)
        }
      }
    }

    return {markdown: s.trim(), data: data}
  }

}

module.exports = MarkdownData
