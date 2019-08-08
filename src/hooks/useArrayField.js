import React, { useMemo } from 'react'
import useForm from './useForm'

const DEFAULT = [{}, {}, {}, {}, {}, {}, {}, {}, {}, {}, {}, {}, {}, {}, {}, {}]

export default ({ name, Component, size = 0 }) => {
  const t0 = window.performance.now()

  const { values, setValues } = useForm()
  const arr = DEFAULT

  const setValue = arr => {
    setValues({ [name]: arr }, { keepMeta: true, merge: true })
  }

  const push = () => setValue([...arr, ''])
  const pop = () => setValue(arr.slice(0, -1))

  const elements = useMemo(() => arr.map((_, i) => console.log('RENDERING ARRAY COMPS') ||
    <Component
      key={i}
      index={i}
      name={`${name}[${i}]`}
      remove={() => {
        arr.splice(i, 1)
        setValue(arr)
      }}
    />)
  , [arr])

  const t1 = window.performance.now()
  console.log('AF', (t1 - t0).toFixed(2))

  return { push, pop, elements }
}
