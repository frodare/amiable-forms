export default ({ value, values, validators }) =>
  validators.reduce((error, validator) => error || validator(value, values), '') || ''
