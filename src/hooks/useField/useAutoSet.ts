import { useEffect } from 'react'

const isNull = (v: any): boolean => v === null || v === undefined

const valueOutOfSync = ({ value, prevValue }: FieldComm): boolean => {
  if (isNull(value) && isNull(prevValue)) return false
  return value !== prevValue
}

const useAutoSet = (name: string, comm: FieldCommRef, setValue: FieldSetValue, field: Field, form: UseFormReturn): void => {
  useEffect(() => {
    let shouldAutoSet = false

    /*
     * check for out of sync value
     */
    if (valueOutOfSync(comm.current)) {
      shouldAutoSet = true
    }

    /*
     * check if a rerun was requested by the pre-validation in shouldUpdate
     */
    if (comm.current.requestRerun) {
      shouldAutoSet = true
      comm.current.requestRerun = false
    }

    /*
     * check if the field has been registered
     */
    if (!field.registered) {
      shouldAutoSet = true
    }

    if (shouldAutoSet) {
      setValue(comm.current.value, undefined)
    }
  })
}

export default useAutoSet
