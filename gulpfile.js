var gulp        = require('gulp');
var metalsmith  = require('metalsmith');
var layouts     = require('metalsmith-layouts');
var inplace     = require('metalsmith-in-place');
var rootPath    = require('metalsmith-rootpath');
var ignore      = require('metalsmith-ignore');

var browserSync = require('browser-sync');
var	reload      = browserSync.reload;
var postcss     = require('gulp-postcss');
var processors  = [
    require('precss')(),
    require('autoprefixer')({browsers: ['last 3 version']})
];
var concat      = require('gulp-concat');
var sourcemaps  = require('gulp-sourcemaps');

gulp.task('html', function() {
    var ms = metalsmith(__dirname)
    .clean(false)
    .source('src')
    .use(ignore([
      'css/**/*',
      'js/**/*'
    ]))
    .destination('build')
    .use(rootPath())
    .use(layouts({
        engine: 'handlebars',
        directory: 'layouts',
        partials: 'layouts/partials',
        rename: true,
        pattern: '*.hbs'
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

gulp.task('scripts', function () {
    return gulp.src('./src/js/*.js')
        .pipe(sourcemaps.init())
            .pipe(concat('all.js'))
        .pipe(sourcemaps.write())
        .pipe(gulp.dest('./build/js/'))
        .pipe(browserSync.stream());
});

gulp.task('css', function () {
    return gulp.src('./src/css/*.css')
        .pipe(postcss(processors))
        .pipe(gulp.dest('./build/css/'))
        .pipe(browserSync.stream());
});

// Watch
gulp.task('watch', function() {

	// Watch .css files
	gulp.watch('./src/css/*.css', ['css', reload]);

	// Watch .js files
	gulp.watch(['src/js/*.js'], ['scripts', reload]);

	// Watch image files
	// gulp.watch('src/img/**/*', ['images']);

	// Watch any files in dist/, reload on change
	gulp.watch(['./src/**/*.hbs', './layouts/**/*.hbs'], ['html', reload]);
});

gulp.task('default', ['html', 'css', 'scripts', 'browser-sync', 'watch']);
