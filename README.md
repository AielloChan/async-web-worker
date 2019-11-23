<image src="./logo.png" width="200"/>

# Async Web Worker

## Info

Use web worker as async function

## Use

### 1.Install libs

```bash
# Add loader to load web worker file to
# get work with webpack and web worker
yarn add -D worker-loader ts-loader

# Add this lib
yarn add async-web-worker
```

### 2.Config Webpack

```js
// webpack.config.js
export default {
  module: {
    rules: [
      {
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
      }
    ]
  }
}
```

### 3.Sample code

```typescript
// api.ts
import int from 'random-int'
import delay from 'delay'

export async function sayHello(name: string) {
  await delay(int(1e2, 1e3))
  return `Hello ${name}`
}

export function echo(msg: string) {
  return msg
}
```

```js
// index.worker.js
import { Expose } from 'async-web-worker'
import * as api from './api'

Expose(api)
export default api // to make typescript auto-suggest working
```

```typescript
// main.ts
import { Wrap } from 'async-web-worker'
import APIWorker from './index.worker'

// @ts-ignore
const myWorker = new APIWorker() as Worker
const apiWorker = Wrap<typeof APIWorker>(myWorker)

await apiWorker.sayHello('AielloChan') // this async method run in web worker 😆
```

## Issues

Welcome

## Change log

- 2019-11-23 21:28:55
  >Update output from es5 to es6

## Contributors

- AielloChan [website](http://aiellochan.com), [email](mailto:aiello.chan@gmail.com)

## Thanks

- Monoto
- Roboto
- nanoid

## License

Copyright (c) 2019 aiello.chan@gmail.com

This software is released under the MIT License.
https://opensource.org/licenses/MIT