/* @refresh reload */
import { render } from "solid-js/web";
import { App } from "./app"

const root = document.getElementById("root")

if (!(root instanceof HTMLElement)) {
  throw new Error("Cannot find root element");
}

render(() => <App />, root);
