import { createRoot } from "react-dom/client";
import "./css/index.css";
import { OverlayApp } from "./components/OverlayApp";

createRoot(document.getElementById("root")!).render(<OverlayApp></OverlayApp>);
