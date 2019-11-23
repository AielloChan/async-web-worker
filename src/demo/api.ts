import int from 'random-int'
import delay from 'delay'

export async function sayHello(name: string) {
  await delay(int(1e2, 1e3))
  return `Hello ${name}`
}

export function echo(msg: string) {
  return msg
}
