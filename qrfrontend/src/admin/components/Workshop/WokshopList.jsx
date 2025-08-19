import React, { useState } from 'react';
import { FaPencilAlt, FaSearch } from 'react-icons/fa';

const WorkshopList = ({ workshops, handleEdit }) => {
  // State for search term and pagination
  const [searchTerm, setSearchTerm] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const workshopsPerPage = 5; // You can adjust this number

  // Step 1: Filter workshops based on search term
  const filteredWorkshops = workshops.filter(ws =>
    ws.title.toLowerCase().includes(searchTerm.toLowerCase())
  );

  // Step 2: Calculate pagination variables
  const indexOfLastWorkshop = currentPage * workshopsPerPage;
  const indexOfFirstWorkshop = indexOfLastWorkshop - workshopsPerPage;
  const currentWorkshops = filteredWorkshops.slice(indexOfFirstWorkshop, indexOfLastWorkshop);
  
  const totalPages = Math.ceil(filteredWorkshops.length / workshopsPerPage);
  
  // Create an array of page numbers for rendering
  const pageNumbers = [];
  for (let i = 1; i <= totalPages; i++) {
    pageNumbers.push(i);
  }

  // Handle page changes
  const paginate = (pageNumber) => {
    setCurrentPage(pageNumber);
  };
  
  // Reset page to 1 whenever the search term changes
  const handleSearchChange = (e) => {
    setSearchTerm(e.target.value);
    setCurrentPage(1);
  };

  return (
    <div>
      <div className="flex justify-between items-center mb-4">
        <h3 className="text-md font-medium text-gray-700">All Workshops ({filteredWorkshops.length})</h3>
        <div className="relative">
          <FaSearch className="absolute top-1/2 left-3 -translate-y-1/2 text-gray-400" />
          <input
            type="text"
            placeholder="Search workshops..."
            value={searchTerm}
            onChange={handleSearchChange}
            className="border border-gray-300 rounded-md pl-10 pr-4 py-1 text-sm"
          />
        </div>
      </div>
      
      <div className="overflow-x-auto">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Title</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Date</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Seats</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Price</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Status</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Actions</th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {currentWorkshops.map((ws,idx )=> (
              <tr key={ws?.id ?? idx} >
                <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">{ws.title}</td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{new Date(ws.startDate).toLocaleDateString()}</td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{ws.seats}</td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">₹{ws.price}</td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${ws.isActive ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'}`}>
                    {ws.isActive ? 'Active' : 'Inactive'}
                  </span>
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm">
                  <td className="p-2">
              <button
                onClick={() => handleEdit(ws)}
                className="px-3 py-1 bg-blue-500 text-white rounded-md hover:bg-blue-600"
                disabled={!ws?.id}
              >
                Edit
              </button>
            </td>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      
      {/* Pagination Controls */}
      {filteredWorkshops.length > workshopsPerPage && (
        <div className="mt-4 flex justify-center space-x-2">
          <button
            onClick={() => paginate(currentPage - 1)}
            disabled={currentPage === 1}
            className="px-3 py-1 text-sm font-medium rounded-md text-gray-700 bg-gray-200 hover:bg-gray-300 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            Previous
          </button>
          {pageNumbers.map(number => (
            <button
              key={number}
              onClick={() => paginate(number)}
              className={`px-3 py-1 text-sm font-medium rounded-md ${currentPage === number ? 'text-white bg-indigo-600' : 'text-gray-700 bg-gray-200 hover:bg-gray-300'}`}
            >
              {number}
            </button>
          ))}
          <button
            onClick={() => paginate(currentPage + 1)}
            disabled={currentPage === totalPages}
            className="px-3 py-1 text-sm font-medium rounded-md text-gray-700 bg-gray-200 hover:bg-gray-300 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            Next
          </button>
        </div>
      )}
    </div>
  );
};

export default WorkshopList;
