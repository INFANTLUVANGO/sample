import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'

import CalendarPage from "./Components/CalendarPage"

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <CalendarPage/>
  </StrictMode>,
)
