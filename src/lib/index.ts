(global as any).$RefreshReg$ = () => { };
(global as any).$RefreshSig$$ = () => () => { };

const MESSAGE_TYPE = 'async-worker'

// https://github.com/ai/nanoid/blob/main/nanoid.js
function nanoid(t = 21) {
  let e = "", r = crypto.getRandomValues(new Uint8Array(t));
  for (; t--;) {
    let n = 63 & r[t];
    e += n < 36 ? n.toString(36) : n < 62 ? (n - 26).toString(36).toUpperCase() : n < 63 ? "_" : "-"
  }
  return e
}

function BindMessage<T>(context: Worker | any, api?: APIObj): T {
  const bus = new Map()
  context.onmessage = ({ data }: { data: Message }) => {
    const { id, type, from } = data
    if (from !== MESSAGE_TYPE) return
    switch (type) {
      case 'call':
        if (!api) {
          console.error(`${api} is not provided`)
          return
        }
        const { func, param } = data as CallMessage
        const callApi = async () => {
          const targetFunc = api[func] as Function
          if (targetFunc) {
            try {
              const result = await targetFunc(...param)
              context.postMessage({
                id,
                result,
                from: MESSAGE_TYPE,
                success: true,
                type: 'return',
              } as ReturnMessage)
            } catch (e) {
              context.postMessage({
                id,
                result: e,
                from: MESSAGE_TYPE,
                success: false,
                type: 'return',
              } as ReturnMessage)
            }
          } else {
            console.error(`${func} is not a function`)
          }
        }
        callApi()
        break
      case 'return':
        const { success, result } = data as ReturnMessage
        const handler = bus.get(id)
        if (handler) {
          bus.delete(id) // remove processed job
          if (success) {
            handler.resolve(result)
          } else {
            handler.reject(result)
          }
        }
        break
      default:
    }
  }

  return new Proxy(
    {},
    {
      get(_, key) {
        return function () {
          const param = [...arguments]
          return new Promise((resolve, reject) => {
            const id = nanoid()
            bus.set(id, { resolve, reject })
            context.postMessage({
              id,
              param,
              from: MESSAGE_TYPE,
              type: 'call',
              func: key,
            } as CallMessage)
          })
        }
      },
    },
  ) as T
}

export function Expose<T>(api: APIObj): T {
  return BindMessage<T>(globalThis, api)
}
export function Wrap<T>(worker: Worker, api = {} as APIObj): T {
  return BindMessage<T>(worker, api)
}
