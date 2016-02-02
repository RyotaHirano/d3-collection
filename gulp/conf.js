export const DIR = {
  SRC: 'src',
  DST: 'dst/d3-collection',
  BUILD: 'public',
  IMG: 'images'
};

export const sass = {
  src: [
    `${DIR.SRC}/**/*.{scss,sass}`
  ],
  dst: `${DIR.DST}/assets/css`
};

export const eslint = {
  src: [`${DIR.SRC}/**/*.js`]
};

export const jade = {
  src: [
    `${DIR.SRC}/**/*.jade`,
    `!${DIR.SRC}/**/_**/*.jade`,
    `!${DIR.SRC}/**/_*.jade`
  ],
  dst: `${DIR.DST}/`,
  opts: {
    pretty: true,
    basedir: `${DIR.SRC}/html`
  }
};

export const scripts = {
  browserifyOpts: {
    entries: [`./${DIR.SRC}/js/main.js`],
    transform: ['babelify']
  },
  dst: `${DIR.DST}/assets/js`
};

export const serve = {
  open: 'external',
  reloadDebounce: 2000,
  ui: false,
  notify: false,
  startPath: DIR.SITE_ROOT_PATH,
  ghostMode: false,
  server: {
    baseDir: './',
    index: `${DIR.DST}/`,
    routes: {
      ['']: `${DIR.DST}/`
    }
  }
};

export const clean = {
  path: [`${DIR.BUILD}`]
};

export const imagemin = {
  src: [`${DIR.SRC}/${DIR.IMG}/**`],
  dst: `${DIR.BUILD}/${DIR.IMG}`,
  opts: {
    //options
  }
};

export const uglify = {
  src: [`${DIR.DST}/**/*.js`],
  dst: `${DIR.BUILD}/js`
};

export const copy = {
  img: {
    src: [`${DIR.SRC}/${DIR.IMG}/**`],
    dst: `${DIR.DST}/${DIR.IMG}`
  },
  build: {
    src: [
      `${DIR.DST}/**`,
      `!${DIR.DST}/js/**`,
      `!${DIR.DST}/${DIR.IMG}`,
      `!${DIR.DST}/${DIR.IMG}/**`
    ],
    dst: `${DIR.BUILD}`
  }
};
