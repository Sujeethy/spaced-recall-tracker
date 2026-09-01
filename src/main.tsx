import { StrictMode } from 'react'
import ReactDOM from 'react-dom/client'
import { App } from './App'
import './index.css'
import { applyThemeToDocument, useUIStore } from './store/useUIStore'

// Apply theme before render to avoid flash
applyThemeToDocument(useUIStore.getState().theme)

const rootElement = document.getElementById('root')
if (rootElement && !rootElement.innerHTML) {
  const root = ReactDOM.createRoot(rootElement)
  root.render(
    <StrictMode>
      <App />
    </StrictMode>
  )
}
