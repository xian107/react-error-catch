import typescript from '@rollup/plugin-typescript'
import commonjs from '@rollup/plugin-commonjs'
import resolve from '@rollup/plugin-node-resolve'
import babel from '@rollup/plugin-babel'

export default {
  input: 'src/index.tsx',
  output: {
    file: 'index.js',
    format: 'cjs',
    exports: "auto"
  },
  plugins: [typescript(), babel(), resolve(), commonjs()],
  external: ["react", "react-dom"]
}