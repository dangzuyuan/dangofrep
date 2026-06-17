import React from "react";
import { createRoot } from "react-dom/client";
import App from "./App.jsx";
import "./style.less";

// iOS 写入 body class，CSS 通过 body.ios-app 限定 fixed 容器 + 左内边距
if (/iPhone|iPad|iPod/i.test(navigator.userAgent)) {
  document.body.classList.add('ios-app');
}

const root = createRoot(document.querySelector("#app"));
root.render(<App />);