import React, { useCallback } from 'react'
import useForm from './useForm'
import get from '../util/get'
import deepEqual from '../util/deepEqual'

const valueChanged = name => ({ previous, current }) => {
  if (previous.values === current.values) return false
  const currValue = get(current.values, name)
  const prevValue = get(previous.values, name)

  return !deepEqual(prevValue, currValue)
}

const removeIndex = i => arr => {
  const a = [...arr]
  a.splice(i, 1)
  return a
}

export default ({ name, Component, props }) => {
  const shouldUpdate = useCallback(valueChanged(name), [name])
  const { values, setValue } = useForm({ shouldUpdate })
  const arr = get(values, name, [])

  const add = () => setValue(name, [...arr, null])
  const remove = () => setValue(name, arr.slice(0, -1))

  const elements = arr.map((_, i) =>
    <Component
      {...props}
      key={i}
      index={i}
      prefix={`${name}[${i}]`}
      remove={() => {
        setValue(name, removeIndex(i))
      }}
    />)

  return { add, remove, elements }
}
