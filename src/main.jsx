import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import { ClerkProvider } from "@clerk/clerk-react";
import "./index.css";
import App from "./App.jsx";

const clerkFrontendApi = import.meta.env.VITE_CLERK_PUBLISHABLE_KEY;

createRoot(document.getElementById("root")).render(
  <StrictMode>
    <ClerkProvider publishableKey={clerkFrontendApi}>
      <App />
    </ClerkProvider>
  </StrictMode>
);
