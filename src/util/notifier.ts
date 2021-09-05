export type Handler = (event: any) => void

export type HandlerSupplier = (handler: Handler) => void

const notifier = (): [Handler, HandlerSupplier, HandlerSupplier] => {
  const handlers: Handler[] = []

  const notify: Handler = event => {
    handlers.forEach(handler => handler(event))
  }

  const addHandler: HandlerSupplier = handler => {
    handlers.push(handler)
  }

  const removeHandler: HandlerSupplier = handler => {
    const i = handlers.indexOf(handler)
    if (i >= 0) {
      handlers.splice(i, 1)
    }
  }

  return [notify, addHandler, removeHandler]
}

export default notifier
