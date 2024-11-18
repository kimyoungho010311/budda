import React from "react";
import ReactDOM from "react-dom/client";
import "./index.css";
import App from "./app";
import "process"
import "process";
import { Buffer } from "buffer";
global.Buffer = Buffer;

const root = ReactDOM.createRoot(document.getElementById("root"));
root.render(<App />);
