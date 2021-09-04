import React, { useState } from 'react'
import useForm from './useForm'

const toObject = (o, [name, value]) => ({ ...o, [name]: value })

const DEFAULT_DELIMETER = '_'
const DEFAULT_COUNT = 0
const DEFAULT_INDEX_FORMAT = i => i
const DEFAULT_INDEX_PARSE = i => i

export default ({
  prefix,
  Component,
  props,
  delimiter = DEFAULT_DELIMETER,
  initialCount = DEFAULT_COUNT,
  formatIndex = DEFAULT_INDEX_FORMAT,
  parseIndex = DEFAULT_INDEX_PARSE
}) => {
  const { setValues } = useForm({ shouldUpdate: () => false })

  const removeIndex = i => {
    const notIndex = ([name]) => !name.startsWith(`${prefix}${delimiter}${formatIndex(i)}${delimiter}`)

    const shiftName = name => {
      const [sPrefix, sIndex, ...aSuffix] = name.split(delimiter)

      if (!sPrefix || !sIndex || !aSuffix || !aSuffix.length) return name
      if (sPrefix !== prefix) return name

      const index = +parseIndex(sIndex)
      const suffix = aSuffix.join(delimiter)

      if (index < i) return name

      return `${prefix}${delimiter}${formatIndex(index - 1)}${delimiter}${suffix}`
    }

    const shiftKeyOver = ([name, value]) => [shiftName(name), value]

    setValues(values => Object.entries(values)
      .filter(notIndex)
      .map(shiftKeyOver)
      .reduce(toObject, {})
    )
  }

  const [count, setCount] = useState(initialCount)

  const add = () => setCount(count + 1)
  const remove = () => setCount(count - 1)

  const elements = new Array(count).fill(null).map((_, i) =>
    <Component
      {...props}
      key={i}
      index={i}
      prefix={`${prefix}${delimiter}${formatIndex(i)}${delimiter}`}
      remove={() => {
        removeIndex(i)
        remove()
      }}
    />)

  return { add, remove, elements }
}
