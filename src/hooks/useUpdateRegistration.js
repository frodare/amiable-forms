import { useRef, useCallback } from 'react'

export default () => {
  const registrationsRef = useRef([])

  const onUpdate = useCallback(({ previous, current }) => {
    registrationsRef.current.forEach(checkUpdate => checkUpdate({ previous, current }))
  }, [registrationsRef])

  const register = useCallback(cb => {
    registrationsRef.current.push(cb)
  }, [])

  const deregister = useCallback(cb => {
    const i = registrationsRef.current.indexOf(cb)
    if (i >= 0) {
      registrationsRef.current.splice(i, 1)
    }
  }, [])

  return { onUpdate, register, deregister }
}
