
export default () => {
  const handlers = []

  const notify = event => {
    handlers.forEach(handler => handler(event))
  }

  const addHandler = handler => {
    handlers.push(handler)
  }

  const removeHandler = handler => {
    const i = handlers.indexOf(handler)
    if (i >= 0) {
      handlers.splice(i, 1)
    }
  }

  return [notify, addHandler, removeHandler]
}
