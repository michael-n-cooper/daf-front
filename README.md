# Digital Accessibility Framework database front end

This is a [Node](nodejs.org) project using the [Astro framework](astro.build) to create a front-end to a RDF database containing content of the [Digital Accessibility Framework](https://github.com/accessiblecommunity/Digital-Accessibility-Framework). A [copy of the data](https://github.com/michael-n-cooper/a11y-data/blob/main/digital-a11y.jsonld) in JSON-LD format can be imported into a RDF database and used with this tool.

## Working with this tool

In addition to normal astro files, the `src/scripts` folder includes `import.js` to import content from the markdown / yaml format. The command line in that folder is `node import` and when prompted give the name of the file to import. The base path is hardcoded for now, and for now it must be called once per file to import. At the moment, re-importing a file creates a duplicate of the data.

Run with astro server with `npm run dev`. The `dbquery.js` file manages the connection to the server (a SPARQL endpoint), with a hardcoded location for now.

## Static build

The `static` branch of this repository is configured to build static copies of the site. To update the build:

1. Switch to the `static` branch.
1. Update from the `main` branch.
1. In the `src\script` folder run `node static-ids`. This will pull information from the database to drive the build.
1. In the project root folder, run `npm run build`. This will put the static site into the `dist` folder.
1. Commit all the changes into the `static` branch and push to the server.