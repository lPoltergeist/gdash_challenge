import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.tsx'
import { BrowserRouter, Route, Routes } from 'react-router'
import WeatherDashboard from './components/weatherDashboard/index.tsx'

createRoot(document.getElementById('root')!).render(
  <BrowserRouter>
    <Routes>
      <Route index element={<App />} />
      <Route path="weather" element={<WeatherDashboard />} />
    </Routes>
  </BrowserRouter>,
)
