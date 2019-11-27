const nodeExternals = require('webpack-node-externals')
const path = require('path')

module.exports = env => {
  return {
    entry: './src/lib/index.ts',
    output: {
      path: path.resolve(__dirname, 'dist'),
      libraryTarget: 'umd',
      filename: 'index.js',
    },
    module: {
      rules: [
        {
          test: /\.(ts|tsx)?$/,
          loader: 'ts-loader',
          exclude: /node_modules/,
          options: {
            compilerOptions: {
              allowJs: false,
              baseUrl: 'src/lib',
              declaration: true,
              declarationMap: true,
              isolatedModules: false,
              jsx: 'react',
              noEmit: false,
              outDir: 'dist',
              sourceMap: true,
            },
          },
        },
        {
          test: /\.(js|jsx)$/,
          use: 'babel-loader',
          exclude: /node_modules/,
        },
        {
          test: /\.css$/,
          use: ['style-loader', 'css-loader'],
        },
        {
          test: /\.svg$/,
          use: 'svg-inline-loader',
        },
        {
          test: /\.png$/,
          use: [
            {
              loader: 'url-loader',
              options: {
                mimetype: 'image/png',
              },
            },
          ],
        },
      ],
    },
    resolve: {
      extensions: ['.tsx', '.ts', '.js', '.jsx'],
    },
    externals: [nodeExternals()],
  }
}
