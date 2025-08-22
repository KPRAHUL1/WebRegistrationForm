import React, { useState, useEffect } from 'react';
import { FaDownload, FaSearch } from 'react-icons/fa';
import axios from 'axios';
import { internshipService } from '../../api/InternshipApi';

const RegistrationList = () => {
  const [internships, setInternships] = useState([]);
  const [registrations, setRegistrations] = useState([]);
  const [filter, setFilter] = useState('all');
  const [searchTerm, setSearchTerm] = useState('');
  const [loading, setLoading] = useState(true);
 console.log(internships);
 
  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      const [internshipsRes, registrationsRes] = await Promise.all([
        internshipService.getInternships(),
        axios.get('http://localhost:7700/api/internship/registrations')
      ]);
      
      console.log('Internships response:', internshipsRes);
      console.log('Registrations response:', registrationsRes);
      
      // Handle the response structure correctly
      if (internshipsRes.data && internshipsRes.data.success) {
        setInternships(internshipsRes);
        console.log(internshipsRes.data.data);
        
      } else {
        setInternships(internshipsRes || []);
        console.log(internshipsRes);
        
      }
      
      if (registrationsRes.data && registrationsRes.data.success) {
        setRegistrations(registrationsRes.data.data);
      } else {
        setRegistrations(registrationsRes.data || []);
      }
      
    } catch (error) {
      console.error('Error fetching data:', error);
      // Set empty arrays on error to prevent crashes
      setInternships([]);
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
      Internship: reg.internship ? reg.internship.title : 'N/A', // Fixed: access internship.title
      College: reg.college || 'N/A',
      Branch: reg.branch || 'N/A',
      Year: reg.year || 'N/A',
      'Registration Date': new Date(reg.createdAt).toLocaleDateString()
    }));

    const csv = convertToCSV(dataToExport);
    downloadCSV(csv, 'internship_registrations.csv');
  };

  const convertToCSV = (data) => {
    if (!data.length) return '';
    const headers = Object.keys(data[0]).join(',');
    const rows = data.map(row => 
      Object.values(row).map(value => 
        // Escape commas and quotes in CSV
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

  const filteredRegistrations = registrations
    .filter(reg => filter === 'all' || reg.internshipId === filter)
    .filter(reg =>
      reg.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      reg.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
      (reg.internship && reg.internship.title.toLowerCase().includes(searchTerm.toLowerCase())) // Fixed: access internship.title
    );

  if (loading) {
    return <div className="flex justify-center items-center h-64">Loading...</div>;
  }

  return (
    <div className="p-6">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold text-gray-900">Internship Registrations</h1>
      </div>

      <div className="flex justify-between items-center mb-4">
        <div className="flex items-center space-x-4">
          <div className="relative">
            <FaSearch className="absolute top-1/2 left-3 -translate-y-1/2 text-gray-400" />
            <input
              type="text"
              placeholder="Search users..."
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
            <option value="all">All Internships</option>
            {internships.data.map(internship => (
              <option key={internship.id} value={internship.id}>{internship.title}</option>
            ))}
          </select>
        </div>
        <button
          onClick={exportData}
          className="flex items-center bg-indigo-600 text-white px-4 py-2 rounded-md text-sm hover:bg-indigo-700"
          disabled={!filteredRegistrations.length}
        >
          <FaDownload className="mr-2" /> Export CSV
        </button>
      </div>

      <div className="bg-white shadow rounded-lg overflow-hidden">
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Name</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Contact</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Internship</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Status</th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {filteredRegistrations.length > 0 ? (
                filteredRegistrations.map(reg => (
                  <tr key={reg.id}>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                      {reg.name}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      <div>{reg.email}</div>
                      <div>{reg.phone}</div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {reg.internship ? reg.internship.title : 'N/A'}
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
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan="4" className="px-6 py-4 text-center text-sm text-gray-500">
                    No registrations found
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default RegistrationList;