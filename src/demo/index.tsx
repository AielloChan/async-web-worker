import React, { useCallback, useState } from 'react'
import { Wrap } from '../lib'
import APIWorker from './index.worker'
import './style.css'

// @ts-ignore
// Init wrapped worker
const apiWorker = Wrap<typeof APIWorker>(new APIWorker() as Worker)

const App = (): JSX.Element => {
  const [msg, setMsg] = useState('')
  const sayHello = useCallback(async (name: string) => {
    // call directly as async func
    // and it real running in worker
    const result = await apiWorker.sayHello(name)
    setMsg(result)
  }, [])

  return (
    <section>
      <h2>Main Call Worker</h2>
      <p>
        This demo shows that you can call api in worker from main thread with
        typescript intelligent tips.
      </p>
      <h2>{msg}</h2>
      <button className="glow-on-hover" onClick={() => sayHello('Aiello')}>
        Call "sayHello" from main
      </button>
      &nbsp;&nbsp;
      <button
        className="glow-on-hover"
        onClick={async () => setMsg(await apiWorker.echo('Hello there'))}
      >
        Call "echo" from main
      </button>
    </section>
  )
}

export default App
