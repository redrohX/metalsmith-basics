var metalsmith = require('metalsmith');
var layouts = require('metalsmith-layouts');
var inplace = require('metalsmith-in-place');
var rootPath = require('metalsmith-rootpath');

function debug(logToConsole) {
    return function(files, metalsmith, done) {
        if (logToConsole) {
            console.log('\nMETADATA:');
            console.log(metalsmith.metadata());

            for (var f in files) {
                console.log('\nFILE:');
                console.log(files[f]);
            }
        }

        done();
    };
}

metalsmith(__dirname)
    .clean(true)
    .source('src')
    .destination('build')
    .use(rootPath())
    .use(layouts({
        engine: 'handlebars',
        directory: 'layouts',
        partials: 'layouts/partials',
        rename: true
    }))
    .use(inplace({
        engine: 'handlebars',
        rename: true
    }))
    .use(debug(true))
    .build(function(err) {
        if (err) {
            throw err;
        }
        else {
            console.log('Build ran without problems');
        }
    });
