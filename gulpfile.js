const del = import('del')
const gulp = require('gulp')
const babel = require('gulp-babel')
const stylus = require('gulp-stylus')
const webpack = require('webpack')
const webpackStream = require('webpack-stream')

const { getWebpackConfig } = require('./webpack.config')

// clean built files generated by task run last time
gulp.task('dev:clean', () =>
  del.then(({ deleteSync }) =>
    deleteSync(['src/public/*', '!src/public/.gitkeep']),
  ),
)

// transpile and bundle scripts by webpack
gulp.task('dev:scripts', () =>
  gulp
    .src('src/frontend/scripts/app.ts')
    .pipe(webpackStream(getWebpackConfig('development'), webpack))
    .pipe(gulp.dest('src/public')),
)

// transpile stylus into CSS files
gulp.task('dev:styles', () =>
  gulp
    .src('src/frontend/styles/app.styl')
    .pipe(stylus())
    .pipe(gulp.dest('src/public')),
)

// task for development
gulp.task(
  'dev',
  gulp.series([
    'dev:clean',
    'dev:styles',
    gulp.parallel([
      'dev:scripts',
      function watchStyles() {
        return gulp.watch(
          ['src/frontend/styles/*.styl', 'src/frontend/styles/**/*.styl'],
          gulp.series(['dev:styles']),
        )
      },
    ]),
  ]),
)

// clean build dir
gulp.task('prod:clean', () =>
  del.then(({ deleteSync }) => deleteSync(['build/*', '!build/.gitkeep'])),
)

// bundle front scripts into build/public dir
gulp.task('prod:scripts', () =>
  gulp
    .src('src/frontend/scripts/app.ts')
    .pipe(webpackStream(getWebpackConfig('production'), webpack))
    .pipe(gulp.dest('build/public')),
)

// transpile styles into build/public/styles dir
gulp.task('prod:styles', () =>
  gulp
    .src('src/frontend/styles/app.styl')
    .pipe(stylus())
    .pipe(gulp.dest('build/public')),
)

// copy view tempaltes into build dir
gulp.task('prod:copy-views', () =>
  gulp.src('src/views/**/*').pipe(gulp.dest('build/views')),
)

// tranpile backend TypeScript file into JavaScript in build dir
gulp.task('prod:transpile-backend', () =>
  gulp
    .src(['src/**/*.ts', '!**/*.d.ts', '!src/frontend/**/*.ts'])
    .pipe(
      babel({
        presets: ['@babel/preset-env', '@babel/preset-typescript'],
      }),
    )
    .pipe(gulp.dest('build')),
)

gulp.task(
  'prod',
  gulp.series([
    'prod:clean',
    gulp.parallel([
      'prod:scripts',
      'prod:styles',
      'prod:copy-views',
      'prod:transpile-backend',
    ]),
  ]),
)
