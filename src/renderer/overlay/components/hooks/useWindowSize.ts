import { useEffect, useState } from "react";

export function useWindowSize() {
  const [windowWidth, setWindowWidth] = useState(window.innerWidth);
  const [windowHeight, setWindowHeight] = useState(window.innerHeight);

  useEffect(() => {
    const resize = () => {
      setWindowWidth((_) => window.innerWidth);
      setWindowHeight((_) => window.innerHeight);
    };
    window.addEventListener("resize", resize);
    return () => window.removeEventListener("resize", resize);
  }, []);

  return [windowWidth, windowHeight] as const;
}
