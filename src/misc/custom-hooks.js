import { useCallback, useState } from 'react';

export function useModalState(defaultVal = false) {
  const [isOpen, setIsOpen] = useState(defaultVal);

  const openModal = useCallback(() => setIsOpen(true), []);
  const closeModal = useCallback(() => setIsOpen(false), []);

  return { isOpen, openModal, closeModal };
}
