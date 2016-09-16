var Metalsmith = require('metalsmith');
var collections = require('metalsmith-collections');
var layouts = require('metalsmith-layouts');
var inplace = require('metalsmith-in-place');

Metalsmith(__dirname)
    .source('src')
    .destination('build')
    .use(layouts({
        engine: 'handlebars',
        directory: 'layouts',
        partials: 'partials'
    }))
    .use(inplace({
        engine: 'handlebars'
    }))
    .build(function(err) {
        if (err) {
            console.log(err);
        }
        else {
            console.log('Build ran without problems');
        }
    });
