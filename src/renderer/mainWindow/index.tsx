import { MainApp } from "./components/MainApp";
import "./index.css";
import { createRoot } from "react-dom/client";
import ReactModal from "react-modal";

ReactModal.setAppElement("#root");
createRoot(document.getElementById("root")!).render(<MainApp></MainApp>);
