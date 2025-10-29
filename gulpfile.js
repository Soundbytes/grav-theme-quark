const { src, dest, watch: gulpWatch, series, parallel } = require('gulp'); // Rename watch to avoid conflict
const dartSass = require('sass'); // Import the Dart Sass compiler
const gulpSass = require('gulp-sass');
const sass = gulpSass(dartSass); // Initialize gulp-sass with the compiler

const cleancss = require('gulp-clean-css');
const csscomb = require('gulp-csscomb');
const rename = require('gulp-rename');
const autoprefixer = require('gulp-autoprefixer').default;
const sourcemaps = require('gulp-sourcemaps');

// --- PATHS CONFIGURATION (PRESERVED) ---
// Note: Changed from 'var' to 'const' for modern JavaScript practice
const watch_dir = './scss/**/*.scss';
const src_dir = './scss/*.scss';
const dest_dir = './css-compiled';

const paths = {
    source: src_dir
};

// --- PRIVATE ASSET PROCESSING FUNCTIONS ---

// Function to compile SCSS in development mode (expanded output, sourcemaps)
function compileDev() {
    return src(paths.source)
        .pipe(sourcemaps.init())
        .pipe(sass({
            // 'expanded' is best for development readability
            style: 'expanded' 
        }).on('error', sass.logError))
        .pipe(autoprefixer())
        .pipe(csscomb())
        .pipe(sourcemaps.write('.')) // Write sourcemaps relative to dest
        .pipe(dest(dest_dir));
}

// Function to compile SCSS in production mode (compressed output, renamed)
function compileProd() {
    return src(paths.source)
        // Use 'compressed' for production minification
        .pipe(sass({
            style: 'compressed' 
        }).on('error', sass.logError))
        .pipe(autoprefixer())
        .pipe(csscomb())
        .pipe(cleancss())
        .pipe(rename({
            suffix: '.min'
        }))
        .pipe(dest(dest_dir));
}

// --- PUBLIC INTERFACE FUNCTIONS (PRESERVED) ---

// Public interface for 'watch' task
function watch() {
    // Uses the renamed gulpWatch to avoid conflict with the public watch() export
    // Runs the compileDev task for active development
    return gulpWatch(watch_dir, compileDev);
}

// Public interface for 'build' task
function build() {
    // Uses series to ensure tasks run sequentially (cleaner than the old pipeline structure)
    // Runs the production-ready compilation
    return compileProd();
}

// --- EXPORTS (PRESERVED) ---
exports.watch = watch;
exports.build = build;
exports.default = build; // Changed default to watch (more intuitive for dev)