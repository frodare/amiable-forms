interface Values {
  [key: string]: any
}

type Validator = (value: any, values: Values) => string | undefined
