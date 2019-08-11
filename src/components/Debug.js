import React, { useEffect } from 'react'
import useForm from '../hooks/useForm'
import useRender from '../hooks/useRender'

const Debug = () => {
  const { meta, fields, values, cleanValues, register } = useForm()
  const render = useRender()

  useEffect(() => {
    register(() => render())
  }, [register])

  return (
    <>
      <h5>Values</h5>
      <pre>{ JSON.stringify(values, null, 2) }</pre>

      <h5>Form Meta</h5>
      <pre>{ JSON.stringify(meta, null, 2) }</pre>

      <h5>Field Meta</h5>
      <pre>{ JSON.stringify(fields, null, 2) }</pre>

      <h5>Clean Values</h5>
      <pre>{ JSON.stringify(cleanValues, null, 2) }</pre>
    </>
  )
}

export default Debug
