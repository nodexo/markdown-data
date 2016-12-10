
markdown-data
=============

Markdown preprocessor: tagged metadata and fenced data blocks for markdown.


Installation
------------

    $ npm install markdown-data


Info/Reasoning
--------------
- for document (meta)data
- heavily inspired by GFMs *fenced code blocks*
- html has been first class citizen in markdown since the beginning
- compatible to all markdown parsers/editors without having any side effects
- but: never use it for private or secret data!
- every markdown processor should be able to *strip comments*
- if not: or do a quick replace on your own: <\!--.*?--> => ''


License
-------
ISC
