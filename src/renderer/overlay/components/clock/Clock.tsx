import { useEffect, useState } from "react";

export function Clock() {
  const [now, setNow] = useState(new Date());
  useEffect(() => {
    const intervalId = setInterval(() => setNow((_) => new Date()), 1000);
    return () => clearInterval(intervalId);
  }, []);
  return <div style={{ fontSize: "4vh", color: "white" }}>{now.toLocaleTimeString()}</div>;
}
