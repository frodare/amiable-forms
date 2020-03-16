import reducerCreator, { initialState } from './reducer'
import * as actionTypes from './actions'

export default ({ initialValues, transform, validate, notifyStateUpdate }) => {
  const stateRef = {}

  const reducer = reducerCreator({ transform, validate })

  const dispatch = action => {
    console.log('*** dispatch ', action)
    const previous = stateRef.current
    const current = reducer(previous, action)
    stateRef.current = current
    notifyStateUpdate({ previous, current })
  }

  stateRef.current = initialState

  if (initialValues) {
    dispatch({ type: actionTypes.SET_VALUES, values: initialValues })
  }

  return [stateRef, dispatch]
}
