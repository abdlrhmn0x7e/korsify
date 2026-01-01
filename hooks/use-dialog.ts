import { useCallback, useState } from "react";

export function useDialog() {
  const [isOpen, setIsOpen] = useState(false);

  const trigger = useCallback(() => setIsOpen(true), []);

  const toggle = useCallback(() => setIsOpen((prev) => !prev), []);

  return {
    props: {
      open: isOpen,
      onOpenChange: setIsOpen,
    },
    toggle: toggle,
    trigger,
    dismiss: () => setIsOpen(false),
  };
}
