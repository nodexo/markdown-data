'use strict'
const tap = require('tap')
const markdownData = require('../index.js')

let markdown, expectedResult

/**
 * Supported data formats
*/
markdown = `

<!--moml:MOML  
Nr: 1
MOML: OK
-->

<!--yaml:YAML
Nr: 2
YAML: OK
-->

<!--toml:TOML
Nr = 3
TOML = "OK"
-->

<!--json:JSON
{
    "Nr": 4,
    "JSON": "OK"
}
-->

`

expectedResult = {
  markdown: '',
  data: {
    meta: {},
    MOML: {
      nr: 1,
      moml: 'OK'
    },
    YAML: {
      Nr: 2,
      YAML: 'OK'
    },
    TOML: {
      Nr: 3,
      TOML: 'OK'
    },
    JSON: {
      Nr: 4,
      JSON: 'OK'
    }
  }
}

tap.strictSame(markdownData.parse(markdown), expectedResult, 'Parse - supported data formats')

/**
 * Complete markdown document
*/
markdown = `
This is the First H1 Article Headline
=====================================
By <!-- meta:author -->Sam Text<!-- -->.

<!-- meta:summary -->
This is a summary of this document.  
It really has no content in it, though it's perfectly
suited for testing this module.


<!-- moml:meta
 
Description:    A brief description, maybe for search engines.
 
Type:           article
Tags[]:         I, really, don't, know
 
Publish:        2016-12-01 12:00
Unpublish:      never
 
Remarks:        This is an example blog article beginning.
                Just testing...               
-->

# Second H1 - should be ignored for metadata title...

Further Text...bla bla bla
`

expectedResult = {
  markdown: 'This is the First H1 Article Headline\n=====================================\nBy Sam Text.\n\nThis is a summary of this document.  \nIt really has no content in it, though it\'s perfectly\nsuited for testing this module.\n\n\n# Second H1 - should be ignored for metadata title...\n\nFurther Text...bla bla bla',
  data: {
    meta: {
      title: 'This is the First H1 Article Headline',
      author: 'Sam Text',
      summary: 'This is a summary of this document.\nIt really has no content in it, though it\'s perfectly suited for testing this module.',
      description: 'A brief description, maybe for search engines.',
      type: 'article',
      tags: [
        'I',
        'really',
        'don\'t',
        'know'
      ],
      publish: '2016-12-01 12:00',
      unpublish: 'never',
      remarks: 'This is an example blog article beginning.\nJust testing...'
    }
  }
}
tap.strictSame(markdownData.parse(markdown), expectedResult, 'Parse - complete markdown document')
