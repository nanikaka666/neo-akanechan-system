import { useMemo } from "react";

export function useIndicatorColor() {
  const colors = useMemo(
    () => ["black", "red", "orange", "yellow", "#00cc00", "#0022ff"] as const,
    [],
  );
  return colors;
}
