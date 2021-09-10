import { useRef, useEffect, useCallback } from 'react'
import reducerCreator, { initialState } from './reducer'
import * as actionTypes from './actions'

export default ({ initialValues, transform, validate, notifyStateUpdate }) => {
  console.log('render useFormStore')
  const stateRef = useRef(initialState)

  const reducer = useCallback(reducerCreator(transform, validate), [transform, validate])

  // const dispatch = (...args) => console.log('dispatch blocked', args)

  // adding in the reducer causes a infinite loop

  const dispatch = useCallback(action => {
    const previous = stateRef.current
    const current = reducer(previous, action)
    stateRef.current = current
    notifyStateUpdate({ previous, current })
  }, [notifyStateUpdate, stateRef])

  // useEffect(() => {
  //   if (initialValues) {
  //     // FIXME replace with action dispatcher
  //     dispatch({ type: actionTypes.SET_VALUES, values: initialValues, options: { merge: false } })
  //   }
  // }, [initialValues, dispatch])

  return [stateRef, dispatch]
}
