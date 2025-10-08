import "./index.css";
import { createRoot } from "react-dom/client";

function R() {
  return <div>Hello React!</div>;
}

createRoot(document.getElementById("root")!).render(<R></R>);
