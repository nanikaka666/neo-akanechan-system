import { useState, useEffect } from "react";

export function useCurrentTime() {
  const [now, setNow] = useState(new Date());
  useEffect(() => {
    const intervalId = setInterval(() => setNow((_) => new Date()), 1000);
    return () => clearInterval(intervalId);
  }, []);

  return now;
}
