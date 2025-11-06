import { BrowserRouter } from 'react-router';
import { createRoot } from 'react-dom/client'
import { ThemeProvider, CssBaseline } from "@mui/material";
import { getAppTheme } from "./theme/theme";
import App from './App.tsx'

const theme = getAppTheme("light");

createRoot(document.getElementById('root')!).render(
  <ThemeProvider theme={theme}>
    <CssBaseline />
    <BrowserRouter>
      <App />
    </BrowserRouter>
  </ThemeProvider>,
)
