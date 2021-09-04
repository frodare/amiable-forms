const isFunction = (f: any): boolean => {
  if (f == null) return false
  return {}.toString.call(f) === '[object Function]'
}

export default isFunction
