import React, { FC, ReactElement, useCallback } from 'react'
import useForm from './useForm'
import get from '../util/get'
import deepEqual from '../util/deepEqual'

const valueChanged = (name: string): ShouldUpdateHandler => ({ previous, current }) => {
  if (previous.values === current.values) return false
  const currValue = get(current.values, name)
  const prevValue = get(previous.values, name)

  return !deepEqual(prevValue, currValue)
}

const removeIndex = (i: number) => (arr: any[]) => {
  const a = [...arr]
  a.splice(i, 1)
  return a
}

interface AnyKeys {
  [key: string]: any
}

interface Args {
  name: string
  Component: FC<AnyKeys>
  props: AnyKeys
}

interface Result {
  add: () => void
  remove: () => void
  elements: ReactElement[]
}

const useArrayField = ({ name, Component, props }: Args): Result => {
  const shouldUpdate = useCallback(valueChanged(name), [name])
  const { values, setValue } = useForm({ shouldUpdate })
  const arr = get(values, name, [])

  const add = (): void => setValue(name, [...arr, null])
  const remove = (): void => setValue(name, arr.slice(0, -1))

  const elements = arr.map((_: any, i: number) =>
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

export default useArrayField
