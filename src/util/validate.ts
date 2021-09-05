
type CombinedValidator = (validators: Validator[]) => Validator

type ValidatorInvoker = (validator: Validator, value: any, values: Values) => string | undefined

const invoker: ValidatorInvoker = (validator, value, values) => {
  const result = validator(value, values)
  if (typeof result === 'string' && result !== '') return result
  return undefined
}

const validate: CombinedValidator = validators => (value, values) => {
  const errorFound = validators.reduce((error, validator) => {
    if (error !== undefined) return error
    return invoker(validator, value, values)
  }, undefined)

  return errorFound
}

export default validate
