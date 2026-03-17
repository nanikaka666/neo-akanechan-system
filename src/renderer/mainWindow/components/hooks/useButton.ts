import { useState } from "react";

export function useButton() {
  const [disabled, setDisabled] = useState(false);
  const disable = () => setDisabled((_) => true);
  const enable = () => setDisabled((_) => false);
  return [disabled, disable, enable] as const;
}
