/* eslint-disable */
const gulp = require('gulp')
const svgSprite = require('gulp-svg-sprite')
const svgmin = require('gulp-svgmin')
const replace = require('gulp-replace')

const config = {
  shape: {
    id: {
      generator: '%s-icon'
    },
    dimension: {
      // Set maximum dimensions
      maxWidth: 128,
      maxHeight: 128
    },
    spacing: {
      // Add padding
      padding: 0
    }
  },
  mode: {
    symbol: {
      dest: '.',
      sprite: './sprite'
    }
  },
  symbol: true
}

gulp.task('svg-sprite', function () {
  return (
    gulp
      .src('./src/assets/icons/icons/*.svg', { cwd: '' })
      // minify svg
      .pipe(
        svgmin({
          js2svg: {
            pretty: true
          }
        })
      )
      // cheerio plugin create unnecessary string '&gt;', so replace it.
      .pipe(replace('&gt;', '>'))
      // build svg sprite
      .pipe(svgSprite(config))
      .pipe(gulp.dest('./src/assets/icons'))
  )
})

