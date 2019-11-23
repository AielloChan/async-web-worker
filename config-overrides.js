function configWebWorker(config) {
  config.module.rules.push({
    test: /\.worker\.(js|ts)$/,
    use: [
      'worker-loader',
      {
        loader: 'ts-loader',
        options: {
          compilerOptions: {
            noEmit: false,
          },
        },
      },
    ],
  })
  return config
}

function fixWebWorkerWindowError(config) {
  config.output.globalObject = 'this'
  return config
}

module.exports = function(config, env) {
  configWebWorker(config)
  fixWebWorkerWindowError(config)
  return config
}
