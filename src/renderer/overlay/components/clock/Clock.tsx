import { useCurrentTime } from "../../../hooks/useCurrentTime";

export function Clock() {
  const now = useCurrentTime();
  return <div style={{ fontSize: "4vh", color: "white" }}>{now.toLocaleTimeString()}</div>;
}
