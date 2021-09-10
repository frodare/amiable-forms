import { useReducer, useCallback } from 'react'

let renderCount = 0

export default () => {
  const [, forceRender] = useReducer(s => (renderCount++), 0)
  return useCallback(() => forceRender({}), [forceRender])
}
