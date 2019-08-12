import React, { useCallback } from 'react'
import useForm from './useForm'
import get from '../util/get'

const lengthChanged = name => ({ previous, current }) => {
  if (previous.values === current.values) return false
  const currValue = (get(current.values, name) || []).length
  const prevValue = (get(previous.values, name) || []).length
  return currValue !== prevValue
}

export default ({ name, Component, props }) => {
  const shouldUpdate = useCallback(lengthChanged(name), [name])
  const { values, setValue } = useForm({ shouldUpdate })
  const arr = get(values, name, [])

  const push = () => setValue(name, [...arr, null])
  const pop = () => setValue(name, arr.slice(0, -1))

  const elements = arr.map((_, i) =>
    <Component
      {...props}
      key={i}
      index={i}
      name={`${name}[${i}]`}
      remove={() => {
        const a = [...arr]
        a.splice(i, 1)
        setValue(name, a)
      }}
    />)

  return { push, pop, elements }
}
