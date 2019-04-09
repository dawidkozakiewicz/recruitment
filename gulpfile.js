require('es6-promise').polyfill();

var gulp          = require('gulp'),
    sass          = require('gulp-sass'),
    rtlcss        = require('gulp-rtlcss'),
    autoprefixer  = require('gulp-autoprefixer'),
    plumber       = require('gulp-plumber'),
    gutil         = require('gulp-util'),
    rename        = require('gulp-rename'),
    concat        = require('gulp-concat'),
    jshint        = require('gulp-jshint'),
    uglify        = require('gulp-uglify'),
    imagemin      = require('gulp-imagemin'),
    uglifycss     = require('gulp-uglifycss');

var onError = function( err ) {
  console.log('An error occurred:', gutil.colors.magenta(err.message));
  gutil.beep();
  this.emit('end');
};

// Sass
gulp.task('sass', function() {
  return gulp.src('./dev/scss/style.scss')
  .pipe(plumber({ errorHandler: onError }))
  .pipe(sass())
  .pipe(autoprefixer())
  .pipe(rename({suffix: '.min'}))
  .pipe(uglifycss({
    "maxLineLen": 80,
    "uglyComments": true
  }))
  .pipe(gulp.dest('./dist/css'))

  .pipe(rtlcss())                     // Convert to RTL
  .pipe(rename({ basename: 'rtl' }))  // Rename to rtl.css
  .pipe(gulp.dest('./'));             // Output RTL stylesheets (rtl.css)
});

// JavaScript
gulp.task('js', function() { 
  return gulp.src(['./dev/js/**/*.js'])
  .pipe(jshint())
  .pipe(jshint.reporter('default'))
  .pipe(concat('app.js'))
  .pipe(rename({suffix: '.min'}))
  .pipe(uglify())
  .pipe(gulp.dest('./dist/js'));
});

// Images
gulp.task('images', function() {
  return gulp.src('./assets/images/*')
  .pipe(plumber({ errorHandler: onError }))
  .pipe(imagemin({ optimizationLevel: 7, progressive: true }))
  .pipe(gulp.dest('./dist/images'));
});

// Watch
gulp.task('watch', function() {
  gulp.watch('./dev/scss/*.scss', ['sass']);
  gulp.watch(['./dev/js/*.js', '!./js/app.min.js'], ['js']);
  gulp.watch('/assets/images/*', ['images']);
});

gulp.task('default', ['sass', 'js', 'images', 'watch']);
