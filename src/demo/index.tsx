import React, { useCallback, useState } from 'react'
import { Wrap } from '../lib'
import APIWorker from './index.worker'

// @ts-ignore
const myWorker = new APIWorker() as Worker
const apiWorker = Wrap<typeof APIWorker>(myWorker)

export default (): JSX.Element => {
  const [msg, setMsg] = useState('')
  const sayHello = useCallback(async (name: string) => {
    const result = await apiWorker.sayHello(name)
    setMsg(result)
  }, [])

  return (
    <section>
      <h1>Async Web Worker Demo</h1>
      <h2>{msg}</h2>
      <button onClick={() => sayHello('Aiello')}>Say hello to Aiello</button>
      <button onClick={() => sayHello('Jessica')}>Say hello to Jessica</button>

      <br />
      <br />

      <button
        className="glow-on-hover"
        onClick={async () => setMsg(await apiWorker.echo('Hello there'))}
      >
        Worker Echo
      </button>
    </section>
  )
}
