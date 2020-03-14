import { useMemo } from 'react'

export default () => useMemo(() => {
  const handlers = []

  const trigger = event => {
    handlers.forEach(handler => handler(event))
  }

  const addHandler = handler => {
    handlers.push(handler)
  }

  const removeHandler = handler => {
    const i = handlers.indexOf(handler)
    if (i >= 0) {
      handlers.splice(i, 1)
    }
  }

  return [trigger, addHandler, removeHandler]
}, [])
