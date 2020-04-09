import { useRef, useEffect, useCallback } from 'react'
import reducerCreator, { initialState } from './reducer'
import * as actionTypes from './actions'

export default ({ initialValues, transform, validate, notifyStateUpdate }) => {
  const stateRef = useRef(initialState)

  const reducer = useCallback(reducerCreator({ transform, validate }), [transform, validate])

  const dispatch = useCallback(action => {
    const previous = stateRef.current
    const current = reducer(previous, action)
    stateRef.current = current
    notifyStateUpdate({ previous, current })
  }, [notifyStateUpdate, stateRef])

  useEffect(() => {
    if (initialValues) {
      dispatch({ type: actionTypes.SET_VALUES, values: initialValues })
    }
  }, [initialValues, dispatch])

  return [stateRef, dispatch]
}
