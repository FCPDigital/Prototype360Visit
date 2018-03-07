// Requis
var gulp = require('gulp');
var sass = require('gulp-sass');
var concat = require('gulp-concat');
var rename = require('gulp-rename');
var uglify = require('gulp-uglify');
var plugins = require('gulp-load-plugins')(); // tous les plugins de package.json

// Variables de chemins
var source = './src'; // dossier de travail
var destination = './dist'; // dossier à livrer


gulp.task('sass', function () {
  return gulp.src('./_dev/stylesheets/visit360.sass')
    .pipe(sass().on('error', sass.logError))
    .pipe(gulp.dest('./assets/'));
});
 
gulp.task('sass:watch', function () {
  gulp.watch('./_dev/stylesheets/**/*.sass', ['sass']);
});

gulp.task('js:watch', function () {
  gulp.watch('./_dev/javascripts/**/*.js', ['scripts']);
});

var scripts = [
  "vendor/three.min.js",
  "_dev/javascripts/Marker.js",
  "_dev/javascripts/Photo.js",
  "_dev/javascripts/Map.js",
  "_dev/javascripts/Nav.js",
  "_dev/javascripts/Manager.js",
  "_dev/javascripts/site.js"
];


gulp.task('scripts', function() {
    return gulp.src(scripts)
        .pipe(concat('visit360.js'))
        .pipe(gulp.dest("assets/"));
});


gulp.task('watch', function(){
  gulp.watch('./_dev/javascripts/**/*.js', ['scripts']);
  gulp.watch('./_dev/stylesheets/**/*.sass', ['sass']);
})

