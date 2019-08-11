import React, { useCallback } from 'react'
import useForm from './useForm'
import get from '../util/get'
import valueChangedInState from '../util/valueChangedInState'

const DEFAULT = []

export default ({ name, Component, props }) => {
  const shouldUpdate = useCallback(valueChangedInState(name), [name])
  const { values, setValue } = useForm({ shouldUpdate })
  const arr = get(values, name) || DEFAULT

  const push = () => setValue(name, [...arr, undefined])
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
