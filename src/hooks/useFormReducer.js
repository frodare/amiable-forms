import { useMemo } from 'react'
import reducerCreator, { initialState } from '../state/reducer'
import * as actionTypes from '../state/actions'

export default ({ initialValues, transform, validate, triggerStateUpdate }) => useMemo(() => {
  // const memoRef = useRef()
  // const stateRef = useRef()
  // if (memoRef.current) return memoRef.current
  const stateRef = {}

  const reducer = reducerCreator({ transform, validate })

  const dispatch = action => {
    const previous = stateRef.current
    const current = reducer(previous, action)
    stateRef.current = current
    triggerStateUpdate({ previous, current })
  }

  stateRef.current = initialState

  if (initialValues) {
    dispatch({ type: actionTypes.SET_VALUES, values: initialValues })
  }

  return [stateRef, dispatch]

  // memoRef.current = [stateRef, dispatch]
  // return memoRef.current
}, [])
