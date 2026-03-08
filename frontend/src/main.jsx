import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.jsx'
import { BrowserRouter } from "react-router-dom"
import { AuthProvider } from './context/Auth.context.jsx'
import { LoaderProvider } from './context/Loader.context.jsx'
import { SongsAlbumProvider } from './context/SongsAlbums.context.jsx'
createRoot(document.getElementById('root')).render(
  <StrictMode>
    <BrowserRouter>
      <LoaderProvider>
        <SongsAlbumProvider>
        <AuthProvider>
          <App />
        </AuthProvider>
        </SongsAlbumProvider>
      </LoaderProvider>
    </BrowserRouter>
  </StrictMode>,
)
