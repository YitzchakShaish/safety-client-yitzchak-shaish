import { BrowserRouter } from 'react-router';
import { createRoot } from 'react-dom/client'
import { CssBaseline } from "@mui/material";
import ThemeContextProvider from "./theme/ThemeContext";
import App from './App.tsx'

createRoot(document.getElementById('root')!).render(
  <BrowserRouter>
    <CssBaseline />
    <ThemeContextProvider>
      <App />
    </ThemeContextProvider>
  </BrowserRouter>
)