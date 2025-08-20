// App.js
import './App.css'
import { BrowserRouter, Route, Routes } from 'react-router-dom'
import LandingPage from './pages/LandingPage'
import AdminLogin from './admin/pages/Login/AdminLogin'
import AdminDashboard from './admin/pages/AdminDashboard'
import WorkshopsPage from './pages/Workshop/WorkshopPage'; // Import the new WorkshopsPage component
import WorkShopForm from './Forms/WorkShopForm'; // Import the WorkShopForm component
import ProtectedRoute from './admin/hooks/ProtectedRoute'

function App() {
  return (
    <>
      <BrowserRouter>
       <Routes>
    <Route path="/" element={<LandingPage />} />
    <Route path="/admin/login" element={<AdminLogin />} />

    {/* This is now a protected route */}
    <Route element={<ProtectedRoute />}>
        <Route path="/admin/dashboard" element={<AdminDashboard />} />
        {/* You can add other protected admin routes here */}
    </Route>

    <Route path="/workshop" element={<WorkshopsPage />} />
    <Route path="/register/:workshopId" element={<WorkShopForm />} />
</Routes>
      </BrowserRouter>
    </>
  )
}

export default App