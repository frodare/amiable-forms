export default ({ value, values, validators, name }) => {
  const errorFound = validators.reduce((error, validator) => error || validator(value, values || {}), '') || ''

  console.log('validate', { name, value, errorFound })
  return errorFound
}
