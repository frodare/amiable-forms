import { useRef } from 'react'

export default () => {
  const handlersRef = useRef([])
  const memoRef = useRef()
  if (memoRef.current) return memoRef.current

  const trigger = event => {
    handlersRef.current.forEach(handler => handler(event))
  }

  const addHandler = handler => {
    handlersRef.current.push(handler)
  }

  const removeHandler = handler => {
    const i = handlersRef.current.indexOf(handler)
    if (i >= 0) {
      handlersRef.current.splice(i, 1)
    }
  }

  memoRef.current = [trigger, addHandler, removeHandler]
  return memoRef.current
}
