import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import Enquiry from './Enquiry.jsx';
// import App from './App.jsx'

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <Enquiry />
  </StrictMode>,
)


