import { useReducer, useCallback } from 'react'

export default () => {
  const [, forceRender] = useReducer(s => s + 1, 0)
  return useCallback(() => forceRender({}), [forceRender])
}
