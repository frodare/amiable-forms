import { useReducer, useMemo, useRef } from 'react'
import reducerCreator, { initialState } from '../state/reducer'
import * as actionTypes from '../state/actions'

export default ({ transform, validate, initialValues }) => {
  const reducer = useMemo(() => reducerCreator({ transform, validate }), [transform, validate])
  const init = useMemo(() => initialValues => initialValues ? reducer(initialState, { type: actionTypes.SET_VALUES, values: initialValues }) : initialState, [reducer])
  const [state, dispatch] = useReducer(reducer, initialValues, init)
  const stateRef = useRef()
  stateRef.current = state

  const actions = useMemo(() => {
    const setField = (name, field) =>
      dispatch({ type: actionTypes.SET_FIELD, name, ...field })

    const setValue = (name, value) =>
      dispatch({ type: actionTypes.SET_VALUE, name, value })

    const setMetaValue = (key, value) =>
      dispatch({ type: actionTypes.SET_META, key, value })

    const removeField = name =>
      dispatch({ type: actionTypes.REMOVE_FIELD, name })

    const reset = () =>
      dispatch({ type: actionTypes.RESET })

    const setValues = (values, options) =>
      dispatch({ type: actionTypes.SET_VALUES, values, options })

    const clear = () =>
      dispatch({ type: actionTypes.SET_VALUES, values: {} })

    return { setField, setValue, setMetaValue, removeField, reset, setValues, clear }
  }, [dispatch])

  return { actions, state, stateRef }
}
