import { useState, useCallback } from "react";

export function useModalState<T = unknown>(initialOpen: boolean = false) {
  const [isOpen, setIsOpen] = useState(initialOpen);
  const [data, setData] = useState<T | null>(null);

  const open = useCallback((payload?: T) => {
    if (payload !== undefined) {
      setData(payload);
    }
    setIsOpen(true);
  }, []);

  const close = useCallback(() => {
    setIsOpen(false);
    setData(null);
  }, []);

  const toggle = useCallback(() => {
    setIsOpen((prev) => !prev);
  }, []);

  return {
    isOpen,
    data,
    open,
    close,
    toggle,
    setIsOpen,
    setData,
  };
}
