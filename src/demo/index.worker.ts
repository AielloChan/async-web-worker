import { Expose } from '../lib'
import * as api from './api'
import store from './store'

const main = Expose<typeof store>(api)
export default {} as typeof api

async function workWithLocalStorage() {
  await main.setStore('from', 'web worker')
  const value = await main.getStore('from')
  console.log('from :', value)
}

workWithLocalStorage()
