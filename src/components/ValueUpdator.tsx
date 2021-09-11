import { FC, useEffect } from 'react'
import useForm from '../hooks/useForm'

const NOPE: ShouldUpdateHandler = () => false
const DEFAULT_MERGE = true
const DEFAULT_VALUES = {}

export interface Props {
  values: Values
  merge: boolean
}

const ValueUpdator: FC<Props> = ({ values = DEFAULT_VALUES, merge = DEFAULT_MERGE }) => {
  const { setValues } = useForm({ shouldUpdate: NOPE })
  useEffect(() => {
    setValues(values, { merge })
  }, [setValues, values])
  return null
}

export default ValueUpdator
