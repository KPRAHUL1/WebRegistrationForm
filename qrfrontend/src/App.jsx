// App.js
import './App.css'
import { BrowserRouter, Route, Routes } from 'react-router-dom'
import LandingPage from './pages/LandingPage'
import AdminLogin from './admin/pages/Login/AdminLogin'
import AdminDashboard from './admin/pages/AdminDashboard'
import WorkshopsPage from './pages/Workshop/WorkshopPage'; // Import the new WorkshopsPage component
import WorkShopForm from './Forms/WorkShopForm'; // Import the WorkShopForm component
import ProtectedRoute from './admin/hooks/ProtectedRoute'
import InternshipsPage from './pages/Internship/InternShipPage'
import InternshipForm from './Forms/InternShipForm'
import CoursesPage from './pages/Course/CoursePage'
import CourseForm from './Forms/CourseForm'

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
          <Route path="/courses" element={<CoursesPage />} />
          <Route path="/internship" element={<InternshipsPage />} />
          
          {/* Separate registration forms for each type */}
          <Route path="/register/workshop/:id" element={<WorkShopForm />} />
          <Route path="/register/course/:id" element={<CourseForm />} />
          <Route path="/register/internship/:id" element={<InternshipForm />} />
          
          {/* Legacy routes for backward compatibility */}
          <Route path="/workshop-form/:id" element={<WorkShopForm />} />
          <Route path="/course-form/:id" element={<CourseForm />} />
          <Route path="/internship-form/:id" element={<InternshipForm />} />
</Routes>
      </BrowserRouter>
    </>
  )
}

export default App