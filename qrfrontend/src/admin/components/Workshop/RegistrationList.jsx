// RegistrationList.js
import React, { useState, useEffect } from 'react';
import { FaEye, FaDownload, FaSearch, FaCheckCircle } from 'react-icons/fa';
import axios from 'axios';

const RegistrationList = () => {
  const [workshops, setWorkshops] = useState([]);
  const [registrations, setRegistrations] = useState([]);
  const [filter, setFilter] = useState('all');
  const [searchTerm, setSearchTerm] = useState('');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      const [workshopsRes, registrationsRes] = await Promise.all([
        axios.get('http://localhost:7700/api/workshop'),
        axios.get('http://localhost:7700/api/register/registrations')
      ]);
      
      setWorkshops(workshopsRes.data);
      setRegistrations(registrationsRes.data);
    } catch (error) {
      console.error('Error fetching data:', error);
    } finally {
      setLoading(false);
    }
  };

  const viewPaymentProof = (proofPath) => {
    // Construct full URL for the payment proof
    const fullUrl = `http://localhost:7700${proofPath}`;
    window.open(fullUrl, '_blank');
  };

  const verifyPayment = async (registrationId) => {
    try {
      await axios.patch(`http://localhost:7700/api/register/registrations/${registrationId}/verify`);
      // Refresh data after verification
      fetchData();
    } catch (error) {
      console.error('Error verifying payment:', error);
    }
  };

  const exportData = () => {
    const dataToExport = filteredRegistrations.map(reg => ({
      Name: reg.name,
      Email: reg.email,
      Phone: reg.phone,
      Workshop: reg.workshop,
      College: reg.college,
      Branch: reg.branch,
      Year: reg.year,
      Status: reg.status,
      'Registration Date': new Date(reg.createdAt).toLocaleDateString()
    }));

    const csv = convertToCSV(dataToExport);
    downloadCSV(csv, 'workshop_registrations.csv');
  };

  const convertToCSV = (data) => {
    const headers = Object.keys(data[0]).join(',');
    const rows = data.map(row => Object.values(row).join(','));
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
    .filter(reg => filter === 'all' || reg.workshopId === filter)
    .filter(reg =>
      reg.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      reg.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
      reg.workshop.toLowerCase().includes(searchTerm.toLowerCase())
    );

  if (loading) {
    return <div className="flex justify-center items-center h-64">Loading...</div>;
  }

  return (
    <div className="p-6">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold text-gray-900">Workshop Registrations</h1>
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
            <option value="all">All Workshops</option>
            {workshops.map(ws => (
              <option key={ws.id} value={ws.id}>{ws.title}</option>
            ))}
          </select>
        </div>
        <button 
          onClick={exportData} 
          className="flex items-center bg-indigo-600 text-white px-4 py-2 rounded-md text-sm hover:bg-indigo-700"
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
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">College</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Workshop</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Upi Id</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Payment Proof</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Status</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Actions</th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {filteredRegistrations.map(reg => (
                <tr key={reg.id}>
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                    {reg.name}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    <div>{reg.email}</div>
                    <div>{reg.phone}</div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    {reg.college} - {reg.branch} ({reg.year})
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    {reg.workshop}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    {reg.upiId}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm">
                    <button 
                      onClick={() => viewPaymentProof(reg.paymentProof)} 
                      className="text-indigo-600 hover:text-indigo-900 flex items-center"
                    >
                      <FaEye className="mr-1" /> View
                    </button>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${
                      reg.status === 'SUCCESS' ? 'bg-green-100 text-green-800' : 
                      reg.status === 'PENDING' ? 'bg-yellow-100 text-yellow-800' : 
                      'bg-red-100 text-red-800'
                    }`}>
                      {reg.status}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm">
                    {reg.status === 'PENDING' && (
                      <button
                        onClick={() => verifyPayment(reg.id)}
                        className="flex items-center text-green-600 hover:text-green-900"
                      >
                        <FaCheckCircle className="mr-1" /> Verify
                      </button>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default RegistrationList;