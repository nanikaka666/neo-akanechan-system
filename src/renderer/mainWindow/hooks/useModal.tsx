import { useState } from "react";

export function useModal() {
  const [showModal, setShowModal] = useState(false);

  function turnOn() {
    setShowModal((_) => true);
  }

  function turnOff() {
    setShowModal((_) => false);
  }

  return [showModal, turnOn, turnOff] as const;
}
