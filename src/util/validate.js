export default ({ value, values, validators, name }) => {
  const errorFound = validators.reduce((error, validator) => error || validator(value, values || {}), '') || ''

  return errorFound
}
