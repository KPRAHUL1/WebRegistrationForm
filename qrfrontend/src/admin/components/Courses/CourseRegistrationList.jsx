import React, { useState, useEffect } from 'react';
import { FaDownload, FaSearch, FaGlobe, FaMapMarkerAlt, FaVideo } from 'react-icons/fa';
import axios from 'axios';
import { courseService } from '../../api/CoursesApi';

const RegistrationList = () => {
  const [courses, setCourses] = useState([]);
  const [registrations, setRegistrations] = useState([]);
  const [filter, setFilter] = useState('all');
  const [searchTerm, setSearchTerm] = useState('');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      const [coursesRes, registrationsRes] = await Promise.all([
        courseService.getCourses(),
        axios.get('http://localhost:7700/api/courses/registrations')
      ]);
      
      console.log('Courses response:', coursesRes);
      console.log('Registrations response:', registrationsRes);
      
      // Handle the response structure correctly
      if (coursesRes.data && coursesRes.data.success) {
        setCourses(coursesRes.data.data);
      } else {
        setCourses(coursesRes || []);
      }
      
      if (registrationsRes.data && registrationsRes.data.success) {
        setRegistrations(registrationsRes.data.data);
      } else {
        setRegistrations(registrationsRes.data || []);
      }
      
    } catch (error) {
      console.error('Error fetching data:', error);
      setCourses([]);
      setRegistrations([]);
    } finally {
      setLoading(false);
    }
  };

  const exportData = () => {
    const dataToExport = filteredRegistrations.map(reg => ({
      Name: reg.name,
      Email: reg.email,
      Phone: reg.phone,
      Course: reg.course ? reg.course.title : 'N/A',
      'Delivery Mode': reg.course ? reg.course.deliveryMode : 'N/A',
      Venue: reg.course && reg.course.venue ? reg.course.venue : 'N/A',
      'Meeting Link': reg.course && reg.course.meetingLink ? reg.course.meetingLink : 'N/A',
      Teacher: reg.course && reg.course.teacher ? reg.course.teacher : 'N/A',
      'Course Coordinator': reg.course && reg.course.incharge ? reg.course.incharge : 'N/A',
      'Base Price': reg.course ? `₹${reg.course.price}` : 'N/A',
      'Total Amount': reg.course && reg.course.totalAmount ? `₹${reg.course.totalAmount}` : 'N/A',
      Status: reg.status || 'pending',
      'Registration Date': new Date(reg.createdAt).toLocaleDateString()
    }));

    const csv = convertToCSV(dataToExport);
    downloadCSV(csv, 'course_registrations.csv');
  };

  const convertToCSV = (data) => {
    if (!data.length) return '';
    const headers = Object.keys(data[0]).join(',');
    const rows = data.map(row => 
      Object.values(row).map(value => 
        typeof value === 'string' && (value.includes(',') || value.includes('"')) 
          ? `"${value.replace(/"/g, '""')}"` 
          : value
      ).join(',')
    );
    return [headers, ...rows].join('\n');
  };

  const downloadCSV = (csv, filename) => {
    const blob = new Blob([csv], { type: 'text/csv' });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = filename;
    a.click();
    window.URL.revokeObjectURL(url);
  };

  const getDeliveryModeIcon = (mode) => {
    const icons = {
      ONLINE: { icon: FaGlobe, color: 'text-blue-500' },
      OFFLINE: { icon: FaMapMarkerAlt, color: 'text-green-500' },
      HYBRID: { icon: FaVideo, color: 'text-purple-500' }
    };
    const config = icons[mode] || icons.OFFLINE;
    const IconComponent = config.icon;
    return <IconComponent className={`inline mr-1 ${config.color}`} />;
  };

  const filteredRegistrations = registrations
    .filter(reg => filter === 'all' || reg.courseId === filter)
    .filter(reg =>
      reg.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      reg.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
      (reg.course && reg.course.title.toLowerCase().includes(searchTerm.toLowerCase())) ||
      (reg.course && reg.course.teacher && reg.course.teacher.toLowerCase().includes(searchTerm.toLowerCase())) ||
      (reg.course && reg.course.incharge && reg.course.incharge.toLowerCase().includes(searchTerm.toLowerCase()))
    );

  if (loading) {
    return <div className="flex justify-center items-center h-64">Loading...</div>;
  }

  return (
    <div className="p-6">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold text-gray-900">Course Registrations</h1>
      </div>

      <div className="flex justify-between items-center mb-4">
        <div className="flex items-center space-x-4">
          <div className="relative">
            <FaSearch className="absolute top-1/2 left-3 -translate-y-1/2 text-gray-400" />
            <input
              type="text"
              placeholder="Search registrations..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="border border-gray-300 rounded-md pl-10 pr-4 py-2 text-sm w-64"
            />
          </div>
          <select
            className="border border-gray-300 rounded-md px-3 py-2 text-sm"
            value={filter}
            onChange={(e) => setFilter(e.target.value)}
          >
            <option value="all">All Courses ({registrations.length})</option>
            {courses.map(course => (
              <option key={course.id} value={course.id}>
                {course.title} ({registrations.filter(r => r.courseId === course.id).length})
              </option>
            ))}
          </select>
        </div>
        <button
          onClick={exportData}
          className="flex items-center bg-indigo-600 text-white px-4 py-2 rounded-md text-sm hover:bg-indigo-700 disabled:opacity-50"
          disabled={!filteredRegistrations.length}
        >
          <FaDownload className="mr-2" /> Export CSV ({filteredRegistrations.length})
        </button>
      </div>

      <div className="bg-white shadow rounded-lg overflow-hidden">
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Student</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Course Details</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Delivery & Instructor</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Pricing</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Status</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Registration Date</th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {filteredRegistrations.length > 0 ? (
                filteredRegistrations.map(reg => (
                  <tr key={reg.id} className="hover:bg-gray-50">
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm font-medium text-gray-900">{reg.name}</div>
                      <div className="text-sm text-gray-500">{reg.email}</div>
                      <div className="text-sm text-gray-500">{reg.phone}</div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm font-medium text-gray-900">
                        {reg.course ? reg.course.title : 'N/A'}
                      </div>
                      <div className="text-sm text-gray-500">
                        {reg.course && new Date(reg.course.startDate).toLocaleDateString()} - {reg.course && new Date(reg.course.endDate).toLocaleDateString()}
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm text-gray-500">
                        {reg.course && (
                          <div className="mb-1">
                            {getDeliveryModeIcon(reg.course.deliveryMode)}
                            {reg.course.deliveryMode || 'OFFLINE'}
                          </div>
                        )}
                        {reg.course && reg.course.deliveryMode === 'OFFLINE' && reg.course.venue && (
                          <div className="text-xs text-gray-400">📍 {reg.course.venue}</div>
                        )}
                        {reg.course && reg.course.deliveryMode === 'ONLINE' && (
                          <div className="text-xs text-blue-600">🔗 Online Meeting</div>
                        )}
                      </div>
                      <div className="text-sm text-gray-700 mt-1">
                        {reg.course && reg.course.teacher && (
                          <div className="text-xs">👨‍🏫 {reg.course.teacher}</div>
                        )}
                        {reg.course && reg.course.incharge && (
                          <div className="text-xs">👤 {reg.course.incharge}</div>
                        )}
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      <div>
                        <div className="font-medium">₹{reg.course ? reg.course.price : 0}</div>
                        {reg.course && reg.course.totalAmount && reg.course.totalAmount !== reg.course.price && (
                          <div className="text-green-600 text-xs">Total: ₹{reg.course.totalAmount}</div>
                        )}
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      <span className={`px-2 py-1 text-xs rounded-full ${
                        reg.status === 'confirmed' ? 'bg-green-100 text-green-800' :
                        reg.status === 'pending' ? 'bg-yellow-100 text-yellow-800' :
                        'bg-gray-100 text-gray-800'
                      }`}>
                        {reg.status || 'pending'}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {new Date(reg.createdAt).toLocaleDateString()}
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan="6" className="px-6 py-4 text-center text-sm text-gray-500">
                    {searchTerm ? `No registrations found matching "${searchTerm}"` : 'No registrations found'}
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Summary Statistics */}
      {registrations.length > 0 && (
        <div className="mt-6 grid grid-cols-1 md:grid-cols-4 gap-4">
          <div className="bg-white p-4 rounded-lg shadow">
            <div className="text-2xl font-bold text-gray-900">{registrations.length}</div>
            <div className="text-sm text-gray-500">Total Registrations</div>
          </div>
          <div className="bg-white p-4 rounded-lg shadow">
            <div className="text-2xl font-bold text-green-600">
              {registrations.filter(r => r.status === 'confirmed').length}
            </div>
            <div className="text-sm text-gray-500">Confirmed</div>
          </div>
          <div className="bg-white p-4 rounded-lg shadow">
            <div className="text-2xl font-bold text-yellow-600">
              {registrations.filter(r => r.status === 'pending').length}
            </div>
            <div className="text-sm text-gray-500">Pending</div>
          </div>
          <div className="bg-white p-4 rounded-lg shadow">
            <div className="text-2xl font-bold text-blue-600">
              {registrations.filter(r => r.course && r.course.deliveryMode === 'ONLINE').length}
            </div>
            <div className="text-sm text-gray-500">Online Courses</div>
          </div>
        </div>
      )}
    </div>
  );
};

export default RegistrationList;