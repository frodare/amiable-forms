import React from 'react'
import useForm from './useForm'
import get from '../util/get'

const DEFAULT = []

export default ({ name, Component, size = 0 }) => {
  const { values, setValue } = useForm()
  const arr = get(values, name) || DEFAULT

  const push = () => setValue(name, [...arr, null])
  const pop = () => setValue(name, arr.slice(0, -1))

  const elements = arr.map((_, i) =>
    <Component
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
