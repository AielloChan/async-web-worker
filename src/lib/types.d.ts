interface APIObj {
  [k: string]: Function | Object
}

type MessageType = 'call' | 'return'

interface CallMessage {
  from: 'async-worker'
  id: string
  type: 'call'
  param: any
  func: string
}

interface ReturnMessage {
  from: 'async-worker'
  id: string
  type: 'return'
  success: boolean
  result: any
}

type Message = CallMessage | ReturnMessage
