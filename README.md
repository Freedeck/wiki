# wiki

## MOVED TO THE DOCS

[MOVED TO docs.freedeck.app](https://docs.freedeck.app)

This is Freewiki alongside the entirety of the Freedeck Wiki (hosted at wiki.freedeck.app)

## Hosting a live server

The live server functionality will take any path you give it (/, /plugins, etc), find the Markdown file, parse it with templates & variables, then show it to you.

It's as simple as:

- `git clone https://github.com/Freedeck/wiki.git && cd wiki`
- `npm i`
- `node live.js`

and your computer will host a HTTP server at localhost:5758! Try changing an article and refreshing to see the edits change.

## Building the static HTML

The static site functionality will traverse through `media`, 1 recursive subdirectory check, look for articles, then parse them all and output them, so that if you put them on a static server it will have the same effect as the live server.

It's as simple as:

- `git clone https://github.com/Freedeck/wiki.git && cd wiki`
- `npm i`
- `node static.js`

As soon as the program starts, you'll see it give you a very verbose detail of what it's doing.

I left that in as a debugger of sorts, as it'll get to a step and crash if something goes wrong (like improper list/for formatting)

Then, as soon as it exits, in the `public` folder, you will see HTML files and folders. That is the entirety of the wiki.

