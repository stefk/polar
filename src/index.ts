import React from "react";
import ReactDOM from "react-dom";
import Modal from "react-modal";
import App from "./App";

Modal.setAppElement("#app");

ReactDOM.render(
  React.createElement(App),
  document.querySelector("#app")
);

