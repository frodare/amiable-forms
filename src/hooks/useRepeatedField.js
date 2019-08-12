import React, { useState, useCallback } from 'react'
import useForm from './useForm'

const toObject = (o, [name, value]) => ({ ...o, [name]: value })

const removeIndexCreator = (setValues, prefix, delimiter) => i => {
  const notIndex = ([name]) => !name.startsWith(`${prefix}${delimiter}${i}${delimiter}`)

  const shiftName = name => {
    const [sPrefix, sIndex, ...aSuffix] = name.split(delimiter)

    if (!sPrefix || !sIndex || !aSuffix || !aSuffix.length) return name
    if (sPrefix !== prefix) return name

    const index = +sIndex
    const suffix = aSuffix.join(delimiter)

    if (index < i) return name

    return `${prefix}${delimiter}${(index - 1)}${delimiter}${suffix}`
  }

  const shiftKeyOver = ([name, value]) => [shiftName(name), value]

  setValues(values => Object.entries(values)
    .filter(notIndex)
    .map(shiftKeyOver)
    .reduce(toObject, {})
  )
}

export default ({ prefix, delimiter = '_', Component, props }) => {
  const { setValues } = useForm({ shouldUpdate: () => false })
  const removeIndex = useCallback(removeIndexCreator(setValues, prefix, delimiter), [prefix, setValues])
  const [count, setCount] = useState(2)

  const add = () => setCount(count + 1)
  const remove = () => setCount(count - 1)

  const elements = new Array(count).fill(null).map((_, i) =>
    <Component
      {...props}
      key={i}
      index={i}
      prefix={`${prefix}${delimiter}${i}${delimiter}`}
      remove={() => {
        removeIndex(i)
        remove()
      }}
    />)

  return { add, remove, elements }
}
