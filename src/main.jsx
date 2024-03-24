import ReactDOM from "react-dom/client";
import App from "./App.jsx";
import "../sass/style.css";
import { BrowserRouter } from "react-router-dom";
import { ContextProvider } from "./context/Context";

ReactDOM.createRoot(document.getElementById("root")).render(
  <BrowserRouter>
    <ContextProvider>
      <App />
    </ContextProvider>{" "}
  </BrowserRouter>
);