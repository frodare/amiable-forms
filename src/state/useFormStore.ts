import { useRef, useCallback } from 'react'
import reducerCreator, { initialState } from './reducer'

const useFormStore = (transform: Transform | undefined, validate: FormValidator | undefined, notifyStateUpdate: Handler): [StateRef, Dispatch] => {
  const stateRef = useRef(initialState)
  const reducer = useCallback(reducerCreator(transform, validate), [transform, validate])

  const dispatch = useCallback((action: Action) => {
    const previous = stateRef.current
    const current = reducer(previous, action)
    stateRef.current = current
    notifyStateUpdate({ previous, current })
  }, [notifyStateUpdate, stateRef])

  return [stateRef, dispatch]
}

export default useFormStore
