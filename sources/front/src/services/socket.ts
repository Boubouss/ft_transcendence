export function handleSocket<E extends string, S>(
  e: MessageEvent,
  handlers: Record<E, (data: {}, states: S) => void>,
  states: S,
) {
  const message = JSON.parse(e.data);
  const { event, data }: { event: E; data: {} } = message;
  if (!handlers[event]) errorSocket();
  else handlers[event](data, states);
}

function errorSocket() {
  console.error("No handler in the object");
}
