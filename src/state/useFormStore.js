import { useRef, useCallback } from 'react'
import reducerCreator, { initialState } from './reducer'

export default ({ transform, validate, notifyStateUpdate }) => {
  const stateRef = useRef(initialState)
  const reducer = useCallback(reducerCreator(transform, validate), [transform, validate])

  const dispatch = useCallback(action => {
    const previous = stateRef.current
    const current = reducer(previous, action)
    stateRef.current = current
    notifyStateUpdate({ previous, current })
  }, [notifyStateUpdate, stateRef])

  return [stateRef, dispatch]
}
