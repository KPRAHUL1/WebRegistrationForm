import React, { useState, useEffect } from 'react';
import {
  FaUsers,
  FaChalkboardTeacher,
  FaBook,
  FaBriefcase,
  FaSignOutAlt,
  FaMoneyBillWave
} from 'react-icons/fa';
import { useNavigate } from 'react-router-dom';
import WorkshopManagement from '../components/Workshop/WorkshopManagementSystem';
import CourseManagement from '../components/Courses/CourseManagemnt';
import { useDashboardData } from '../hooks/useDashboardData'; // Import the custom hook
import InternshipManagement from '../components/Internship/InternshipManagement';
import IncomeAndExpense from '../components/IncomeAndExpense/IncomeAndExpense';

const AdminDashboard = () => {
  const navigate = useNavigate();
  const [admin, setAdmin] = useState(() => {
    const data = localStorage.getItem('adminUser');
    return data ? JSON.parse(data) : null;
  });
  const [activeTab, setActiveTab] = useState('workshops');

  // Use the custom hook for all data management
  const {
    dashboardData,
    isLoading,
    error,
    refetch,
    handleUpdateWorkshop,
    handleCreateWorkshop,
    handleUpdateCourse,
    handleCreateCourse,
    handleDeleteCourse,
    handleArchiveCourse,
    handleUpdateInternship,
    handleCreateInternship
  } = useDashboardData();

  // Debug logging - you can remove this later
  console.log('Dashboard data:', dashboardData);
  console.log('Internships:', dashboardData.internships);

  useEffect(() => {
    const adminData = localStorage.getItem('adminUser');
    if (!adminData) {
      navigate('/admin/login');
      return;
    }
    setAdmin(JSON.parse(adminData));
  }, [navigate]);

  const handleLogout = () => {
    localStorage.removeItem('adminToken');
    localStorage.removeItem('adminUser');
    navigate('/admin/login');
  };

  const renderActiveTabContent = () => {
    if (isLoading) {
      return (
        <div className="text-center py-10">
          <div className="inline-block animate-spin rounded-full h-8 w-8 border-b-2 border-indigo-600"></div>
          <p className="mt-2 text-gray-500">Loading dashboard data...</p>
        </div>
      );
    }
    
    if (error) {
      return (
        <div className="text-center py-10">
          <p className="text-red-500 mb-4">{error}</p>
          <button
            onClick={refetch}
            className="px-4 py-2 bg-indigo-600 text-white rounded-md hover:bg-indigo-700"
          >
            Retry
          </button>
        </div>
      );
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
        return (
          <CourseManagement
            courses={dashboardData.courses}
            courseRegistrations={dashboardData.courseRegistrations}
            onUpdateCourse={handleUpdateCourse}
            onCreateCourse={handleCreateCourse}
            onDeleteCourse={handleDeleteCourse}
            onArchiveCourse={handleArchiveCourse}
          />
        );
      case 'internships':
        return (
          <InternshipManagement
            internships={dashboardData.internships}
            internshipRegistrations={dashboardData.internshipRegistrations}
            onUpdateInternship={handleUpdateInternship}
            onCreateInternship={handleCreateInternship}
          />
        );
      case 'income':
        return (
          <IncomeAndExpense
            workshops={dashboardData.workshops}
            courses={dashboardData.courses}
            internships={dashboardData.internships}
          />
        );
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
              className="flex items-center text-sm text-gray-500 hover:text-indigo-600 transition-colors"
            >
              <FaSignOutAlt className="mr-1" /> Logout
            </button>
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Stats Cards */}
        <div className="grid grid-cols-2 gap-5 md:grid-cols-4 mb-8">
          {Object.entries(dashboardData?.stats || {}).map(([key, value]) => {
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

            // Ensure value is a number, default to 0 if not
            const displayValue = typeof value === 'number' ? value : 0;

            return (
              <div key={key} className="bg-white overflow-hidden shadow rounded-lg p-5">
                <div className="flex items-center">
                  <div className={`flex-shrink-0 ${colorMap[key]} rounded-md p-3`}>
                    {iconMap[key]}
                  </div>
                  <div className="ml-5 w-0 flex-1">
                    <dl>
                      <dt className="text-sm font-medium text-gray-500 truncate">{title}</dt>
                      <dd className="text-2xl font-semibold text-gray-900">{displayValue}</dd>
                    </dl>
                  </div>
                </div>
              </div>
            );
          })}
        </div>

        {/* Main Content */}
        <div className="bg-white shadow rounded-lg">
          <div className="px-4 sm:px-6">
            <div className="border-b border-gray-200">
              <nav className="-mb-px flex space-x-8" aria-label="Tabs">
                {[
                  { key: 'workshops', label: 'Workshops', icon: FaChalkboardTeacher },
                  { key: 'courses', label: 'Courses', icon: FaBook },
                  { key: 'internships', label: 'Internships', icon: FaBriefcase },
                  { key: 'income', label: 'Income', icon: FaMoneyBillWave },
                ].map(({ key, label, icon: Icon }) => (
                  <button
                    key={key}
                    onClick={() => setActiveTab(key)}
                    className={`${
                      activeTab === key
                        ? 'border-indigo-500 text-indigo-600'
                        : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                    } whitespace-nowrap py-4 px-1 border-b-2 font-medium text-sm flex items-center space-x-2 transition-colors`}
                  >
                    <Icon className="h-4 w-4" />
                    <span>{label}</span>
                  </button>
                ))}
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