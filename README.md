
markdown-data
=============

Preprocessor for *tagged metadata* and *fenced data blocks* for markdown.


Installation
------------

    $ npm install markdown-data


Usage
-----

```
const markdownData = require('markdown-data')

let markdown = `

This is the First H1 Article Headline
=====================================
By <!--author -->Sam Text<!-- -->.

<!--summary -->
This is a summary of this document.  
It really has no content in it, though it's perfectly
suited for testing this module.  


<!--moml:metadata

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

let result = markdownData.parse(markdown)
console.log(JSON.stringify(result, null, 4))

/*
{
    "markdown": "This is the First H1 Article Headline\n=====================================\nBy Sam Text.\n\nThis is a summary of this document.\nIt really has no content in it, though it's perfectly\nsuited for testing this module.  \n\n\n# Second H1 - should be ignored for metadata title...\n\nFurther Text...bla bla bla",
    "metadata": {
        "title": "This is the First H1 Article Headline",
        "author": "Sam Text",
        "summary": "This is a summary of this document.\nIt really has no content in it, though it's perfectly suited for testing this module.",
        "description": "A brief description, maybe for search engines.",
        "type": "article",
        "tags": [
            "I",
            "really",
            "don't",
            "know"
        ],
        "publish": "2016-12-01 12:00",
        "unpublish": "never",
        "remarks": "This is an example blog article beginning.\nJust testing..."
    },
    "data": {}
}
*/
```

License
-------
ISC
