import { BrowserRouter } from 'react-router';
import { createRoot } from 'react-dom/client'
import { CssBaseline } from "@mui/material";
import ThemeContextProvider from "./theme/ThemeContext";
import App from './App.tsx'
import { EventFormProvider } from './context/EventFormContext.tsx';

createRoot(document.getElementById('root')!).render(
  
  <BrowserRouter>
  <EventFormProvider>
    <CssBaseline />
    <ThemeContextProvider>
      <App />
    </ThemeContextProvider>
     </EventFormProvider >
  </BrowserRouter>
)