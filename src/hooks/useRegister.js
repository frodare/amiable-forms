import { useRef, useCallback } from 'react'

export default current => {
  const previousRef = useRef({})
  const registrationsRef = useRef([])
  const previous = previousRef.current

  const register = useCallback(cb => {
    registrationsRef.current.push(cb)
  }, [])

  const deregister = useCallback(cb => {
    const i = registrationsRef.current.indexOf(cb)
    if (i >= 0) {
      registrationsRef.current.splice(i, 1)
    }
  }, [])

  registrationsRef.current.forEach(checkUpdate => checkUpdate({ previous, current }))

  previousRef.current = current
  return { register, deregister }
}
