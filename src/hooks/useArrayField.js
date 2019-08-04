import React from 'react'
import useForm from './useForm'

export default ({ name, Component, size = 0 }) => {
  const { values, setValues } = useForm()
  const arr = values[name] || []

  const setValue = arr => {
    setValues({ [name]: arr }, { keepMeta: true, merge: true })
  }

  const push = () => setValue([ ...arr, '' ])
  const pop = () => setValue(arr.slice(0, -1))

  const elements = arr.map((_, i) =>
    <Component
      key={i}
      index={i}
      name={`${name}[${i}]`}
      remove={() => {
        arr.splice(i, 1)
        setValue(arr)
      }}
    />)
  return { push, pop, elements }
}
