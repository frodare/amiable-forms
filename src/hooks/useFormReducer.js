import { useMemo, useRef, useCallback } from 'react'
import reducerCreator, { initialState } from '../state/reducer'
import * as actionTypes from '../state/actions'

const useRenderlessReducer = (reducer, initialValues, init, registrationsRef) => {
  const ref = useRef(init(initialValues))

  const dispatch = useCallback(action => {
    const previous = ref.current
    const current = reducer(previous, action)
    ref.current = current
    registrationsRef.current.forEach(checkUpdate => checkUpdate({ previous, current }))
  }, [ref])

  return [ref, dispatch]
}

export default ({ transform, validate, initialValues }) => {
  const registrationsRef = useRef([])
  const reducer = useMemo(() => reducerCreator({ transform, validate }), [transform, validate])
  const init = useMemo(() => initialValues => initialValues ? reducer(initialState, { type: actionTypes.SET_VALUES, values: initialValues }) : initialState, [reducer])
  const [stateRef, dispatch] = useRenderlessReducer(reducer, initialValues, init, registrationsRef)

  const register = useCallback(cb => {
    registrationsRef.current.push(cb)
  }, [])

  const deregister = useCallback(cb => {
    const i = registrationsRef.current.indexOf(cb)
    if (i >= 0) {
      registrationsRef.current.splice(i, 1)
    }
  }, [])

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

  return { actions, stateRef, register, deregister }
}
