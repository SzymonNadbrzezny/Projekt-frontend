import React from "react";
import ReactDOM from "react-dom/client";
import App from "./App.tsx";
import { registerLicense } from "@syncfusion/ej2-base";
import "./index.css";

registerLicense(
  "Ngo9BigBOggjHTQxAR8/V1NAaF5cWWJCf1FpRmJGdld5fUVHYVZUTXxaS00DNHVRdkdnWX5eeXRTR2ZdWUxxVkQ="
);
ReactDOM.createRoot(document.getElementById("root") as HTMLElement).render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
);
