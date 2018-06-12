const { FuseBox, QuantumPlugin, UglifyJSPlugin, BabelPlugin, EnvPlugin, WebIndexPlugin, ReplacePlugin } = require('fuse-box');
const eslinter = require('fuse-box-eslint-plugin');
const isProduction = process.env.NODE_ENV === 'production' ? true : false;
const env = process.env.NODE_ENV;

const fuse = FuseBox.init({
  cache: true,
  tsConfig: false,
  target: 'universal@es5',
  sourceMap: !isProduction,
  homeDir: 'source',
  output: './build/$name.js',
  plugins: [
    EnvPlugin({ NODE_ENV: env }),
    [
      eslinter({
        pattern: /js(x)*$/
      }),
      BabelPlugin({
        sourceMaps: !isProduction,
        presets: [
          [
            'env',
            {
              useBuiltIns: 'usage',
              debug: false,
              targets: {
                browsers: ['> 1%', 'ie 11', 'safari > 9']
              }
            }
          ],
          'es2015',
          'stage-2'
        ],
        plugins: ['dynamic-import-node', 'transform-class-properties', ['inferno', { imports: true }], 'syntax-jsx']
      })
      ],
      ReplacePlugin({
        'process.env.NODE_ENV': JSON.stringify(env)
      }),
      WebIndexPlugin({
        path: '.',
        template: 'source/index.html'
      }),
      isProduction && QuantumPlugin({
        ensureES5: true,
        // target: 'universal@es5',
        // bakeApiIntoBundle: 'app',
        // containedAPI: true,
        // globalRequire: false,
        removeExportsInterop: false,
        treeshake: true
      }),
      isProduction && UglifyJSPlugin()
  ]
});

// vendor should come first
fuse.bundle('vendor').instructions('~ index.jsx');

if (!isProduction) {
  fuse
    .bundle('app')
    .watch()
    .hmr({ reload: true, socketURI: 'ws://localhost:8080' })
    .sourceMaps(true)
    .instructions('!> [index.jsx]');

  fuse.dev({
    root: 'build',
    port: 8080
  });

} else {
  fuse
    .bundle('app')
    .instructions('!> [index.jsx]');
}

fuse.run()