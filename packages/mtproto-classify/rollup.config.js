import purs from 'rollup-plugin-purs'

export default {
  input : 'src/Main.purs',
  output: {
    file  : 'bundle.js',
    format: 'cjs'
  },
  sourcemap: true,
  plugins  : [
    purs({
      debug: false,
      // optimizations: {
      //   uncurry: false
      // },
    })
  ]
}