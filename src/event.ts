let listeners: { [key: string]: Function[] } = {}

export const on = (eventName: string, handler: Function) => {
  if (listeners[eventName]) {
    listeners[eventName] = listeners[eventName].concat([handler])
    return
  }

  listeners[eventName] = [handler]
}

export const emit = async (eventName: string, value: any) => {
  if (!listeners[eventName]) {
    if (process.env.NODE_ENV === 'development') {
      console.warn(
        `Emitting event ${eventName} but ${eventName} is not registered.`
      )
    }

    return
  }

  await Promise.all(listeners[eventName].map(handler => handler(value)))
}
