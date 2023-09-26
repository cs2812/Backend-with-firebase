import { StrictMode } from "react";
import { createRoot } from "react-dom/client";

import App from "./App";
import { BrowserRouter } from "react-router-dom";
import ContextApi from "./Context/ContextApi";
import { ChakraProvider } from "@chakra-ui/react";

const rootElement = document.getElementById("root");
const root = createRoot(rootElement);

root.render(
  <BrowserRouter>
    <ContextApi>
      <ChakraProvider>
        <App />
      </ChakraProvider>
    </ContextApi>
  </BrowserRouter>
);
