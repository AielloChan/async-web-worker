import nanoid from 'nanoid'

const MESSAGE_TYPE = 'async-worker'

function uuid() {
  return `${nanoid()}_${+new Date()}`
}

export function Expose(funcs: { [k: string]: Function | Object }) {
  onmessage = async ({ data }) => {
    const { type, id, func, param } = data
    if (type === MESSAGE_TYPE) {
      const targetFunc = funcs[func]
      let msg = {}
      if (targetFunc instanceof Function) {
        try {
          const result = await targetFunc(...param)
          msg = {
            id,
            result,
            type: MESSAGE_TYPE,
            success: true,
          }
        } catch (e) {
          msg = {
            id,
            type: MESSAGE_TYPE,
            success: false,
            result: e,
          }
        }
      } else {
        msg = {
          id,
          type: MESSAGE_TYPE,
          success: false,
          result: `${func} is not a function`,
        }
      }
      // @ts-ignore
      postMessage(msg)
    }
  }
}

export function Wrap<T>(worker: Worker): T {
  const bus = new Map()
  worker.onmessage = ({ data }) => {
    const { type, id, success, result } = data
    if (type === MESSAGE_TYPE) {
      const handler = bus.get(id)
      if (handler) {
        bus.delete(id) // remove processed job
        if (success) {
          handler.resolve(result)
        } else {
          handler.reject(result)
        }
      }
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
            worker.postMessage({
              id,
              param,
              type: MESSAGE_TYPE,
              func: key,
            })
          })
        }
      },
    },
  ) as T
}
