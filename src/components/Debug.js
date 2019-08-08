import React from 'react'
import useForm from '../hooks/useForm'

const Debug = () => {
  const { meta, fields, values } = useForm()
  return (
    <>
      <h5>Values</h5>
      <pre>{ JSON.stringify(values, null, 2) }</pre>

      <h5>Form Meta</h5>
      <pre>{ JSON.stringify(meta, null, 2) }</pre>

      <h5>Field Meta</h5>
      <pre>{ JSON.stringify(fields, null, 2) }</pre>
    </>
  )
}

export default Debug
