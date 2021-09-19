import React, { FC, useState } from 'react'
import useForm from './useForm'

const toObject = (o: any, [name, value]: [string, any]): any => ({ ...o, [name]: value })

const DEFAULT_DELIMETER = '_'
const DEFAULT_COUNT = 0
const DEFAULT_INDEX_FORMAT: ReIndexer = i => i
const DEFAULT_INDEX_PARSE: ReIndexer = i => i

type ReIndexer = (i: number) => number

interface Args {
  prefix: string
  Component: FC
  props: any
  delimiter: string
  initialCount: number
  formatIndex: ReIndexer
  parseIndex: ReIndexer
}

interface Result {
  add: () => void
  remove: () => void
  elements: JSX.Element[]
}

const useRepeatedField = ({
  prefix,
  Component,
  props,
  delimiter = DEFAULT_DELIMETER,
  initialCount = DEFAULT_COUNT,
  formatIndex = DEFAULT_INDEX_FORMAT,
  parseIndex = DEFAULT_INDEX_PARSE
}: Args): Result => {
  const { setValues } = useForm({ shouldUpdate: () => false })

  const removeIndex = (i: number): void => {
    const notIndex = ([name]: [string, any]): boolean => !name.startsWith(`${prefix}${delimiter}${formatIndex(i)}${delimiter}`)

    const shiftName = (name: string): string => {
      const [sPrefix, sIndex, ...aSuffix] = name.split(delimiter)

      if (sPrefix === undefined || sIndex === undefined || aSuffix === undefined || aSuffix.length === 0) return name
      if (sPrefix !== prefix) return name

      const index = parseIndex(+sIndex)
      const suffix = aSuffix.join(delimiter)

      if (index < i) return name

      return `${prefix}${delimiter}${formatIndex(index - 1)}${delimiter}${suffix}`
    }

    const shiftKeyOver = ([name, value]: [string, any]): [string, any] => [shiftName(name), value]

    const newValues: ValueGetter = values => Object.entries(values)
      .filter(notIndex)
      .map(shiftKeyOver)
      .reduce(toObject, {})

    setValues(newValues, undefined)
  }

  const [count, setCount] = useState(initialCount)

  const add = (): void => setCount(count + 1)
  const remove = (): void => setCount(count - 1)

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

export default useRepeatedField
