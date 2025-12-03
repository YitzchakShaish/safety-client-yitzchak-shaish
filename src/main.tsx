import { BrowserRouter } from 'react-router';
import { createRoot } from 'react-dom/client'
import { CssBaseline } from "@mui/material";
import ThemeContextProvider from "./theme/ThemeContext";
import App from './App.tsx'
import { EventFormProvider } from './context/EventFormContext.tsx';
import { UserProvider } from './context/UserContext.tsx';

createRoot(document.getElementById('root')!).render(
  
  <BrowserRouter>
  <EventFormProvider>
    <UserProvider>
    <CssBaseline />
    <ThemeContextProvider>
      <App />
    </ThemeContextProvider>
    </UserProvider>
     </EventFormProvider >
  </BrowserRouter>
)