import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import './styles/main.css';
import App from './App.jsx';
import { AppProvider } from './contexts/AppContext.jsx';
import { ToastProvider } from './hooks/useToast.jsx';

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <AppProvider>
      <ToastProvider>
        <App />
      </ToastProvider>
    </AppProvider>
  </StrictMode>
);
