import nanoid from 'nanoid'

const MESSAGE_TYPE = 'async-worker'

function uuid() {
  return `${nanoid()}_${+new Date()}`
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
        return function() {
          const param = [...arguments]
          return new Promise((resolve, reject) => {
            const id = uuid()
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
  // eslint-disable-next-line
  return BindMessage<T>(self, api)
}
export function Wrap<T>(worker: Worker, api = {} as APIObj): T {
  return BindMessage<T>(worker, api)
}
