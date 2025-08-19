// pages/AdminDashboard.js
import React, { useState, useEffect } from 'react';
import { 
  FaUsers, 
  FaChalkboardTeacher, 
  FaBook, 
  FaBriefcase, 
  FaSignOutAlt
} from 'react-icons/fa';
import { useNavigate } from 'react-router-dom';
import WorkshopManagement from '../components/Workshop/WorkshopManagementSystem';
import { workshopService } from '../api/WorkshopApi';

const AdminDashboard = () => {
  const navigate = useNavigate();
  const [admin, setAdmin] = useState(null);
  const [activeTab, setActiveTab] = useState('workshops');
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);

  // Consolidated state for all data
  const [dashboardData, setDashboardData] = useState({
    workshops: [],
    workshopRegistrations: [
      { id: 1, name: 'Aarav Sharma', email: 'aarav@example.com', phone: '9876543210', workshop: 'Web Development Workshop', date: '2025-08-01', paymentProof: 'proof1.jpg', status: 'Confirmed' },
      { id: 2, name: 'Priya Patel', email: 'priya@example.com', phone: '8765432109', workshop: 'Data Science Workshop', date: '2025-08-05', paymentProof: 'proof2.jpg', status: 'Pending' },
      { id: 3, name: 'Rohan Mehta', email: 'rohan@example.com', phone: '7654321098', workshop: 'Web Development Workshop', date: '2025-08-02', paymentProof: 'proof3.jpg', status: 'Confirmed' }
    ],
    stats: {
      workshops: 0,
      courses: 8, // Placeholder
      internships: 5, // Placeholder
      registrations: 125 // Placeholder
    }
  });

  // --- EFFECTS ---
  useEffect(() => {
    const adminData = localStorage.getItem('adminUser');
    if (!adminData) {
      navigate('/admin/login');
      return;
    }
    setAdmin(JSON.parse(adminData));
    
    const fetchDashboardData = async () => {
      try {
        const workshopsData = await workshopService.getWorkshops();
        setDashboardData(prevData => ({
          ...prevData,
          workshops: workshopsData,
          stats: {
            ...prevData.stats,
            workshops: workshopsData.length,
          }
        }));
        setError(null);
      } catch (err) {
        console.error("Failed to fetch dashboard data:", err);
        setError("Failed to load dashboard data. Please try again.");
      } finally {
        setIsLoading(false);
      }
    };
    
    fetchDashboardData();
  }, [navigate]);

  // --- HANDLER FUNCTIONS ---
  const handleLogout = () => {
    localStorage.removeItem('adminToken');
    localStorage.removeItem('adminUser');
    navigate('/admin/login');
  };

  const handleUpdateWorkshop = (updatedWorkshop) => {
    setDashboardData(prevData => ({
      ...prevData,
      workshops: prevData.workshops.map(ws => 
        (ws.id === updatedWorkshop.id ? updatedWorkshop : ws)
      ),
    }));
  };

  const handleCreateWorkshop = async (newWorkshop) => {
    // Note: The mock token logic is temporary and should be handled by a proper auth system
    localStorage.setItem('adminToken', 'mock_admin_token');
    try {
      const createdWorkshop = await workshopService.createWorkshop(newWorkshop);
      setDashboardData(prevData => ({
        ...prevData,
        workshops: [...prevData.workshops, createdWorkshop],
        stats: {
          ...prevData.stats,
          workshops: prevData.stats.workshops + 1,
        }
      }));
    } catch (error) {
      console.error("Error creating workshop:", error);
    } finally {
      localStorage.removeItem('adminToken');
    }
  };

  // --- RENDER LOGIC ---
  const renderActiveTabContent = () => {
    if (isLoading) {
      return <div className="text-center py-10 text-gray-500">Loading dashboard data...</div>;
    }
    if (error) {
      return <div className="text-center py-10 text-red-500">{error}</div>;
    }
    switch (activeTab) {
      case 'workshops':
        return (
          <WorkshopManagement 
            workshops={dashboardData.workshops} 
            workshopRegistrations={dashboardData.workshopRegistrations}
            onUpdateWorkshop={handleUpdateWorkshop} 
            onCreateWorkshop={handleCreateWorkshop}
          />
        );
      case 'courses':
        return <div className="text-center py-10 text-gray-500">Course Management Component will be here.</div>;
      case 'internships':
        return <div className="text-center py-10 text-gray-500">Internship Management Component will be here.</div>;
      default:
        return null;
    }
  };

  if (!admin) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-100">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-indigo-600"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-100">
      <header className="bg-white shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 flex justify-between items-center">
          <h1 className="text-2xl font-bold text-gray-900">Admin Dashboard</h1>
          <div className="flex items-center space-x-4">
            <span className="text-gray-700 hidden sm:block">Welcome, {admin.name}</span>
            <button
              onClick={handleLogout}
              className="flex items-center text-sm text-gray-500 hover:text-indigo-600"
            >
              <FaSignOutAlt className="mr-1" /> Logout
            </button>
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid grid-cols-2 gap-5 md:grid-cols-4 mb-8">
          {Object.entries(dashboardData.stats).map(([key, value]) => {
            const iconMap = {
              workshops: <FaChalkboardTeacher className="h-6 w-6 text-white" />,
              courses: <FaBook className="h-6 w-6 text-white" />,
              internships: <FaBriefcase className="h-6 w-6 text-white" />,
              registrations: <FaUsers className="h-6 w-6 text-white" />,
            };
            const colorMap = {
              workshops: 'bg-indigo-500',
              courses: 'bg-green-500',
              internships: 'bg-yellow-500',
              registrations: 'bg-blue-500',
            };
            const title = key.charAt(0).toUpperCase() + key.slice(1);
            
            return (
              <div key={key} className="bg-white overflow-hidden shadow rounded-lg p-5">
                <div className="flex items-center">
                  <div className={`flex-shrink-0 ${colorMap[key]} rounded-md p-3`}>
                    {iconMap[key]}
                  </div>
                  <div className="ml-5 w-0 flex-1">
                    <dl>
                      <dt className="text-sm font-medium text-gray-500 truncate">{title}</dt>
                      <dd className="text-2xl font-semibold text-gray-900">{value}</dd>
                    </dl>
                  </div>
                </div>
              </div>
            );
          })}
        </div>

        <div className="bg-white shadow rounded-lg">
          <div className="px-4 sm:px-6">
            <div className="border-b border-gray-200">
              <nav className="-mb-px flex space-x-8" aria-label="Tabs">
                <button
                  onClick={() => setActiveTab('workshops')}
                  className={`${activeTab === 'workshops' ? 'border-indigo-500 text-indigo-600' : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'} whitespace-nowrap py-4 px-1 border-b-2 font-medium text-sm`}
                >
                  Workshops
                </button>
                <button
                  onClick={() => setActiveTab('courses')}
                  className={`${activeTab === 'courses' ? 'border-indigo-500 text-indigo-600' : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'} whitespace-nowrap py-4 px-1 border-b-2 font-medium text-sm`}
                >
                  Courses
                </button>
                <button
                  onClick={() => setActiveTab('internships')}
                  className={`${activeTab === 'internships' ? 'border-indigo-500 text-indigo-600' : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'} whitespace-nowrap py-4 px-1 border-b-2 font-medium text-sm`}
                >
                  Internships
                </button>
              </nav>
            </div>
          </div>
          <div className="p-4 sm:p-6">
            {renderActiveTabContent()}
          </div>
        </div>
      </main>
    </div>
  );
};

export default AdminDashboard;