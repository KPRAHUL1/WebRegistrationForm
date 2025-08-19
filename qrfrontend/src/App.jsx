// App.js
import './App.css'
import { BrowserRouter, Route, Routes } from 'react-router-dom'
import LandingPage from './pages/LandingPage'
import AdminLogin from './admin/pages/Login/AdminLogin'
import AdminDashboard from './admin/pages/AdminDashboard'
import WorkshopsPage from './pages/Workshop/WorkshopPage'; // Import the new WorkshopsPage component
import WorkShopForm from './Forms/WorkShopForm'; // Import the WorkShopForm component

function App() {
  return (
    <>
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<LandingPage />} />
          <Route path="/admin/login" element={<AdminLogin />} />
          <Route path="/admin/dashboard" element={<AdminDashboard />} />

          {/* Add the new routes for workshops */}
          <Route path="/workshop" element={<WorkshopsPage />} />
          <Route path="/register/:workshopId" element={<WorkShopForm />} />
        </Routes>
      </BrowserRouter>
    </>
  )
}

export default App