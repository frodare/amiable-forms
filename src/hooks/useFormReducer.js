import { useRef, useCallback, useMemo } from 'react'
import reducerCreator, { initialState } from '../state/reducer'
import * as actionTypes from '../state/actions'

export default ({ initialValues, transform, validate, onUpdate }) => {
  const stateRef = useRef()
  const reducer = useMemo(() => reducerCreator({ transform, validate }), [transform, validate])

  const dispatch = useCallback(action => {
    const previous = stateRef.current
    const current = reducer(previous, action)
    stateRef.current = current
    onUpdate({ previous, current })
  }, [stateRef, reducer])

  if (!stateRef.current) {
    stateRef.current = initialState
    if (initialValues) {
      dispatch({ type: actionTypes.SET_VALUES, values: initialValues })
    }
  }

  return [stateRef, dispatch]
}
