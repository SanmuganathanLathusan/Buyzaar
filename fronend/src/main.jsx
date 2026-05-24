import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.jsx'
import { GoogleOAuthProvider } from '@react-oauth/google'

// Suppress Chrome extension message channel errors
if (typeof window !== 'undefined') {
  // Handle console errors from browser extensions
  window.addEventListener('error', (event) => {
    if (event.message?.includes('message channel closed')) {
      event.preventDefault();
    }
  });

  // Handle unhandled promise rejections from extensions
  window.addEventListener('unhandledrejection', (event) => {
    if (event.reason?.message?.includes('message channel closed') || 
        event.reason?.toString().includes('message channel closed')) {
      event.preventDefault();
    }
  });
}

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <GoogleOAuthProvider clientId={import.meta.env.VITE_GOOGLE_CLIENT_ID || 'missing-client-id'}>
      <App />
    </GoogleOAuthProvider>
  </StrictMode>,
)
