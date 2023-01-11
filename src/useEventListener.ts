import { useCallback, useEffect, useMemo, useRef } from 'react';

interface Options extends Omit<AddEventListenerOptions, 'once'> {
  target?: EventTarget;
}

type Handler<E extends Event> = (evt: E) => void;

export function useEventListener<E extends Event = Event>(
  name: string,
  listener: Handler<E>,
  options: Options = {}
) {
  const { target = window, passive, capture } = options;
  const ref = useRef<Handler<E>>();
  ref.current = listener;
  const handler = useCallback((evt: Event) => {
    if (!ref.current) return;
    ref.current(evt as E);
  }, []);

  useMemo(() => {
    target?.addEventListener(name, handler, { passive, capture });
  }, [name, handler, target, capture, passive]);

  useEffect(() => {
    return () => {
      target?.removeEventListener(name, handler, { capture });
    };
  }, [name, handler, target, capture, passive]);
}
