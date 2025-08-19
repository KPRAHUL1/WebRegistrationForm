// components/RegistrationList.js
import React, { useState } from 'react';
import { FaEye, FaDownload, FaSearch } from 'react-icons/fa';

const RegistrationList = ({ workshops, workshopRegistrations }) => {
  const [filter, setFilter] = useState('all');
  const [searchTerm, setSearchTerm] = useState('');

  const viewPaymentProof = (proofUrl) => alert(`Viewing payment proof: ${proofUrl}`);
  const exportData = () => alert(`Exporting workshop data for: ${filter}`);
  
  const filteredRegistrations = workshopRegistrations
    .filter(reg => filter === 'all' || reg.workshop === filter)
    .filter(reg =>
      reg.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      reg.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
      reg.workshop.toLowerCase().includes(searchTerm.toLowerCase())
    );

  return (
    <div>
      <div className="flex justify-between items-center mb-4">
        <div className="flex items-center space-x-2">
            <div className="relative">
                <FaSearch className="absolute top-1/2 left-3 -translate-y-1/2 text-gray-400" />
                <input
                    type="text"
                    placeholder="Search users..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="border border-gray-300 rounded-md pl-10 pr-4 py-1 text-sm"
                />
            </div>
             <select 
                className="border border-gray-300 rounded-md px-3 py-1 text-sm"
                value={filter}
                onChange={(e) => setFilter(e.target.value)}
            >
                <option value="all">All Workshops</option>
                {workshops.map(ws => (
                <option key={ws.id} value={ws.title}>{ws.title}</option>
                ))}
            </select>
        </div>
        <button onClick={exportData} className="flex items-center bg-indigo-600 text-white px-3 py-1 rounded-md text-sm hover:bg-indigo-700">
          <FaDownload className="mr-1" /> Export
        </button>
      </div>
      
      <div className="overflow-x-auto">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Name</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Contact</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Workshop</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Payment Proof</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Status</th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {filteredRegistrations.map(reg => (
              <tr key={reg.id}>
                <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">{reg.name}</td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                  <div>{reg.email}</div>
                  <div>{reg.phone}</div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{reg.workshop}</td>
                <td className="px-6 py-4 whitespace-nowrap text-sm">
                  <button onClick={() => viewPaymentProof(reg.paymentProof)} className="text-indigo-600 hover:text-indigo-900 flex items-center">
                    <FaEye className="mr-1" /> View
                  </button>
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${reg.status === 'Confirmed' ? 'bg-green-100 text-green-800' : 'bg-yellow-100 text-yellow-800'}`}>
                    {reg.status}
                  </span>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default RegistrationList;