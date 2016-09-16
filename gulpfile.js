var gulp       = require('gulp');
var metalsmith = require('metalsmith');
var layouts = require('metalsmith-layouts');
var inplace = require('metalsmith-in-place');
var rootPath = require('metalsmith-rootpath');
var del = require('del');

var browserSync = require('browser-sync');
var	reload  = browserSync.reload;
var postcss = require('gulp-postcss');
var processorsArray = [
    require('precss')(),
    require('autoprefixer')({browsers: ['last 3 version']})
];

gulp.task('clean', function () {
    del.sync(['./build/**']);
});

gulp.task('html', function() {
    var ms = metalsmith(__dirname)
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
        engine: 'handlebars'
    }))
    .build(function(err) {
        if (err) {
            throw err;
        }
        else {
            console.log('Metalsmith build ran without problems');
        }
    });
});

// Static server
gulp.task('browser-sync', function() {
	 browserSync({
		  server: {
				baseDir: "./build"
		  }
	 });
});

gulp.task('css', function () {
    return gulp.src('./src/css/*.css')
        .pipe(postcss(processorsArray))
        .pipe(gulp.dest('./build/css/'))
        .pipe(browserSync.stream());
});

// Watch
gulp.task('watch', function() {

	// Watch .css files
	gulp.watch('./src/css/*.css', ['css', browserSync.reload]);

	// Watch .js files
	// gulp.watch(['src/js/*.js','main.js'], ['scripts', browserSync.reload]);

	// Watch image files
	// gulp.watch('src/img/**/*', ['images']);

	// Watch any files in dist/, reload on change
	gulp.watch("./src/*.hbs", ['html', browserSync.reload]);
});

gulp.task('default', ['clean', 'html', 'css', 'browser-sync', 'watch']);
