import React, { useState } from 'react';
import { FaPencilAlt, FaSearch, FaExclamationCircle, FaBook } from 'react-icons/fa';

const InternshipList = ({ internships = [], handleEdit }) => {
  // State for search term and pagination
  const [searchTerm, setSearchTerm] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const internshipsPerPage = 5;
console.log(internships);

  // Debug logging
  console.log('InternshipList received internships:', internships);

  // Handle empty or invalid internships data
  if (!Array.isArray(internships)) {
    console.warn('Internships is not an array:', internships);
    return (
      <div className="text-center py-10">
        <FaExclamationCircle className="mx-auto h-12 w-12 text-gray-400 mb-4" />
        <p className="text-gray-500">Invalid internships data received</p>
        <p className="text-xs text-gray-400 mt-2">Expected array, got: {typeof internships}</p>
      </div>
    );
  }

  if (internships.length === 0) {
    return (
      <div className="text-center py-10">
        <FaBook className="mx-auto h-12 w-12 text-gray-400 mb-4" />
        <p className="text-gray-500">No internships found</p>
        <p className="text-xs text-gray-400 mt-2">
          {searchTerm ? `No results for "${searchTerm}"` : 'Add your first internship to get started'}
        </p>
      </div>
    );
  }

  // Filter internships based on search term
  const filteredInternships = internships.filter(internship => {
    if (!internship || !internship.title) {
      console.warn('Invalid internship object:', internship);
      return false;
    }
    return internship.title.toLowerCase().includes(searchTerm.toLowerCase());
  });

  // Calculate pagination variables
  const indexOfLastInternship = currentPage * internshipsPerPage;
  const indexOfFirstInternship = indexOfLastInternship - internshipsPerPage;
  const currentInternships = filteredInternships.slice(indexOfFirstInternship, indexOfLastInternship);

  const totalPages = Math.ceil(filteredInternships.length / internshipsPerPage);

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

  // Safe date formatting function
  const formatDate = (dateString) => {
    if (!dateString) return 'N/A';
    try {
      return new Date(dateString).toLocaleDateString();
    } catch (error) {
      console.error('Date formatting error:', error);
      return 'Invalid Date';
    }
  };

  // Safe number formatting
  const formatNumber = (value) => {
    if (value === null || value === undefined || value === '') return 0;
    const num = Number(value);
    return isNaN(num) ? 0 : num;
  };

  return (
    <div>
      <div className="flex justify-between items-center mb-4">
        <h3 className="text-md font-medium text-gray-700">
          All Internships ({filteredInternships.length})
        </h3>
        <div className="relative">
          <FaSearch className="absolute top-1/2 left-3 -translate-y-1/2 text-gray-400" />
          <input
            type="text"
            placeholder="Search internships..."
            value={searchTerm}
            onChange={handleSearchChange}
            className="border border-gray-300 rounded-md pl-10 pr-4 py-1 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
          />
        </div>
      </div>

      {filteredInternships.length === 0 ? (
        <div className="text-center py-10">
          <p className="text-gray-500">
            {searchTerm ? `No internships found matching "${searchTerm}"` : 'No internships available'}
          </p>
        </div>
      ) : (
        <>
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                    Title
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                    Start Date
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                    End Date
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                    Seats
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                    Price
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                    Status
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {currentInternships.map((internship, idx) => {
                  // Ensure we have valid data for each field
                  const safeInternship = internship || {};
                  
                  return (
                    <tr key={safeInternship.id || `internship-${idx}`} className="hover:bg-gray-50">
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                        {safeInternship.title || 'Untitled Internship'}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                        {formatDate(safeInternship.startDate)}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                        {formatDate(safeInternship.endDate)}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                        {formatNumber(safeInternship.maxSeats)}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                        ₹{formatNumber(safeInternship.price)}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span
                          className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${
                            safeInternship.isActive
                              ? 'bg-green-100 text-green-800'
                              : 'bg-red-100 text-red-800'
                          }`}
                        >
                          {safeInternship.isActive ? 'Active' : 'Inactive'}
                        </span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm">
                        <button
                          onClick={() => handleEdit(safeInternship)}
                          className="px-3 py-1 bg-blue-500 text-white rounded-md hover:bg-blue-600 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                          disabled={!safeInternship.id}
                          title={!safeInternship.id ? 'Internship ID is required to edit' : 'Edit internship'}
                        >
                          <FaPencilAlt className="inline mr-1" />
                          Edit
                        </button>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>

          {/* Pagination Controls */}
          {filteredInternships.length > internshipsPerPage && (
            <div className="mt-4 flex justify-center space-x-2">
              <button
                onClick={() => paginate(currentPage - 1)}
                disabled={currentPage === 1}
                className="px-3 py-1 text-sm font-medium rounded-md text-gray-700 bg-gray-200 hover:bg-gray-300 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
              >
                Previous
              </button>
              {pageNumbers.map(number => (
                <button
                  key={number}
                  onClick={() => paginate(number)}
                  className={`px-3 py-1 text-sm font-medium rounded-md transition-colors ${
                    currentPage === number
                      ? 'text-white bg-indigo-600'
                      : 'text-gray-700 bg-gray-200 hover:bg-gray-300'
                  }`}
                >
                  {number}
                </button>
              ))}
              <button
                onClick={() => paginate(currentPage + 1)}
                disabled={currentPage === totalPages}
                className="px-3 py-1 text-sm font-medium rounded-md text-gray-700 bg-gray-200 hover:bg-gray-300 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
              >
                Next
              </button>
            </div>
          )}
        </>
      )}
    </div>
  );
};

export default InternshipList;