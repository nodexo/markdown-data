
'use strict'

const PARSERS = {
  yaml: require('js-yaml').safeLoad,
  moml: require('moml').parse,
  toml: require('toml').parse,
  json: JSON.parse
}

const defaultOptions = {
  Silent: false,
  ExtractTitle: true,
  RemoveDataTags: true
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
  static _parseData (t, s, Silent) {
    try {
      return PARSERS[t](s)
    } catch (e) {
      if (Silent === false) {
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
      if (options.Silent === false) {
        throw new Error('The first parameter has to be of type string!')
      }
      return null
    }

    const data = {meta: {}}

    // Extract title
    if (options.ExtractTitle) {
      const result = s.match(/^#([^#\n]+)#?.*\n|^(.*)\n=+[ \t]*\n/m)
      if (result && !data.meta.title) {
        data.meta.title = (result[1] || result[2]).trim()
      }
    }

    // Parse tagged data
    s = s.replace(/<!--[ \t]*meta:[ \t]*([a-z0-9.]+)[ \t]*-->([^<]+)<!--[ \t]*-->/g,
        function (match, $1, $2, offset, original) {
          if (!data.meta[$1]) {
            data.meta[$1] = $2.trim()
          }
          if (options.RemoveDataTags) {
            return $2
          }
          return match
        })

    // Parse tagged multiline data
    s = s.replace(/^<!--[ \t]*meta:[ \t]*([a-zA-Z0-9-_.]+)[ \t]*-->\n((.*\S.*(\n|$))+?)(\n|$)/gm,
          function (match, $1, $2, $3, offset, original) {
            if (!data.meta[$1]) {
              data.meta[$1] = $2
                              .replace(/ {2}\n/g, '{n}')
                              .replace(/\n/g, ' ')
                              .replace(/{n}/g, '\n')
                              .trim()
            }
            if (options.RemoveDataTags) {
              return $2
            }
            return match
          })

    // Extract data blocks
    let datablocks = []
    try {
      s = s.replace(/^<!--[ \t]*(moml|yaml|toml|json):?([a-zA-Z0-9-_.]+)?[ \t]*\n((.*\n)*?)-->(\n|$)/gm,
        function (match, $1, $2, $3, offset, original) {
          datablocks.push({type: $1, key: $2 || null, data: $3.trim()})
          if (options.RemoveDataTags) {
            return ''
          }
          return match
        })
    } catch (e) {
      console.log(e.message)
    }

    // Parse data blocks
    for (let db of datablocks) {
      if (PARSERS[db.type]) {
        try {
          let obj = this._parseData(db.type, db.data, options.Silent)
          if (db.key && db.key !== 'meta') {
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
              if (db.key === 'meta') {
                if (!data.meta[k]) {
                  data.meta[k] = obj[k]
                }
              } else {
                if (!data[k]) {
                  data[k] = obj[k]
                }
              }
            }
          }
        } catch (e) {
          console.log(e.message)
        }
      } else {
        if (options.Silent === false) {
          throw new Error(`Unsupported parser: ${db.type}`)
        }
      }
    }

    return {markdown: s.trim(), data: data}
  }

}

module.exports = MarkdownData
