import React, { useState } from 'react';
import { FaPencilAlt, FaSearch, FaMapMarkerAlt, FaVideo, FaUser, FaUserTie, FaImage, FaCalendar, FaClock, FaMoneyBillWave, FaUsers, FaChalkboardTeacher, FaUserShield } from 'react-icons/fa';

const WorkshopList = ({ workshops, handleEdit }) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const [filterMode, setFilterMode] = useState('all');
  const [viewMode, setViewMode] = useState('table'); // 'table' or 'cards'
  const workshopsPerPage = 5;

  const filteredWorkshops = workshops.filter(ws => {
    const matchesSearch = ws.title?.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         ws.teacher?.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         ws.incharge?.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         ws.description?.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesMode = filterMode === 'all' || ws.deliveryMode === filterMode;
    return matchesSearch && matchesMode;
  });

  const indexOfLastWorkshop = currentPage * workshopsPerPage;
  const indexOfFirstWorkshop = indexOfLastWorkshop - workshopsPerPage;
  const currentWorkshops = filteredWorkshops.slice(indexOfFirstWorkshop, indexOfLastWorkshop);
  
  const totalPages = Math.ceil(filteredWorkshops.length / workshopsPerPage);
  
  const pageNumbers = [];
  for (let i = 1; i <= totalPages; i++) {
    pageNumbers.push(i);
  }

  // Handle page changes
  const paginate = (pageNumber) => {
    setCurrentPage(pageNumber);
  };
  
  const handleSearchChange = (e) => {
    setSearchTerm(e.target.value);
    setCurrentPage(1);
  };

  const handleFilterChange = (e) => {
    setFilterMode(e.target.value);
    setCurrentPage(1);
  };

  const getDeliveryModeIcon = (mode) => {
    switch (mode) {
      case 'ONLINE':
        return <FaVideo className="text-blue-500" />;
      case 'OFFLINE':
        return <FaMapMarkerAlt className="text-green-500" />;
      case 'HYBRID':
        return <span className="flex items-center"><FaMapMarkerAlt className="text-green-500 mr-1" /><FaVideo className="text-blue-500" /></span>;
      default:
        return <FaMapMarkerAlt className="text-gray-500" />;
    }
  };

  const getDeliveryModeColor = (mode) => {
    switch (mode) {
      case 'ONLINE':
        return 'bg-blue-100 text-blue-800';
      case 'OFFLINE':
        return 'bg-green-100 text-green-800';
      case 'HYBRID':
        return 'bg-purple-100 text-purple-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  const CardView = () => (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      {currentWorkshops.map((ws, idx) => (
        <div key={ws?.id ?? idx} className="bg-white rounded-lg shadow-md overflow-hidden hover:shadow-lg transition-shadow">
          {ws.posterImage && (
            <div className="h-48 overflow-hidden">
              <img
                src={`http://localhost:7700${ws.posterImage}`}
                alt={ws.title}
                className="w-full h-full object-cover"
                onError={(e) => {
                  e.target.style.display = 'none';
                  e.target.nextSibling.style.display = 'flex';
                }}
              />
              <div className="hidden h-48 bg-gray-200 items-center justify-center">
                <FaImage className="text-gray-400 text-4xl" />
              </div>
            </div>
          )}
          
          <div className="p-4">
            <div className="flex items-center justify-between mb-3">
              <h3 className="text-lg font-semibold text-gray-900 truncate">{ws.title}</h3>
              <span className={`px-2 py-1 text-xs rounded-full flex items-center ${getDeliveryModeColor(ws.deliveryMode)}`}>
                {getDeliveryModeIcon(ws.deliveryMode)}
                <span className="ml-1">{ws.deliveryMode}</span>
              </span>
            </div>
            
            {ws.description && (
              <p className="text-gray-600 text-sm mb-4 line-clamp-2">{ws.description}</p>
            )}

            <div className="bg-blue-50 p-3 rounded-lg mb-4 border border-blue-200">
              <h4 className="text-sm font-semibold text-blue-800 mb-2 flex items-center">
                <FaChalkboardTeacher className="mr-2" />
                Team Information
              </h4>
              <div className="space-y-2">
                {ws.teacher && (
                  <div className="flex items-center">
                    <FaUser className="mr-2 text-blue-600" />
                    <span className="text-sm font-medium text-blue-900">Teacher:</span>
                    <span className="ml-2 text-sm text-blue-800">{ws.teacher}</span>
                  </div>
                )}
                {ws.incharge && (
                  <div className="flex items-center">
                    <FaUserShield className="mr-2 text-blue-600" />
                    <span className="text-sm font-medium text-blue-900">Incharge:</span>
                    <span className="ml-2 text-sm text-blue-800">{ws.incharge}</span>
                  </div>
                )}
                {!ws.teacher && !ws.incharge && (
                  <div className="text-sm text-blue-600 italic">No team assigned yet</div>
                )}
              </div>
            </div>
            
            <div className="space-y-2 text-sm text-gray-700">
              <div className="flex items-center justify-between">
                <span className="flex items-center">
                  <FaCalendar className="mr-2 text-gray-400" />
                  Date:
                </span>
                <span>{new Date(ws.startDate).toLocaleDateString()}</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="flex items-center">
                  <FaClock className="mr-2 text-gray-400" />
                  Time:
                </span>
                <span>{ws.startTime} - {ws.endTime}</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="flex items-center">
                  <FaMoneyBillWave className="mr-2 text-gray-400" />
                  Price:
                </span>
                <span className="font-semibold">₹{ws.price}</span>
              </div>
              {ws.totalAmount && ws.totalAmount !== ws.price && (
                <div className="flex items-center justify-between">
                  <span className="flex items-center">
                    <FaMoneyBillWave className="mr-2 text-gray-400" />
                    Total:
                  </span>
                  <span className="font-semibold text-green-600">₹{ws.totalAmount}</span>
                </div>
              )}
              <div className="flex items-center justify-between">
                <span className="flex items-center">
                  <FaUsers className="mr-2 text-gray-400" />
                  Seats:
                </span>
                <span>{ws.maxSeats}</span>
              </div>

              {ws.venue && (
                <div className="flex items-center">
                  <FaMapMarkerAlt className="mr-2 text-gray-400" />
                  <span className="truncate text-xs">{ws.venue}</span>
                </div>
              )}
            </div>
            
            <div className="flex items-center justify-between mt-4 pt-3 border-t">
              <span className={`px-2 py-1 text-xs rounded-full ${ws.isActive ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'}`}>
                {ws.isActive ? 'Active' : 'Inactive'}
              </span>
              <button
                onClick={() => handleEdit(ws)}
                className="px-3 py-1 bg-blue-500 text-white text-sm rounded-md hover:bg-blue-600 transition-colors"
                disabled={!ws?.id}
              >
                <FaPencilAlt className="inline mr-1" />
                Edit
              </button>
            </div>
          </div>
        </div>
      ))}
    </div>
  );

  const TableView = () => (
    <div className="overflow-x-auto">
      <table className="min-w-full divide-y divide-gray-200">
        <thead className="bg-gray-50">
          <tr>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Workshop</th>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Team</th>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Schedule</th>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Details</th>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Status</th>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Actions</th>
          </tr>
        </thead>
        <tbody className="bg-white divide-y divide-gray-200">
          {currentWorkshops.map((ws, idx) => (
            <tr key={ws?.id ?? idx} className="hover:bg-gray-50">
              <td className="px-6 py-4 whitespace-nowrap">
                <div className="flex items-center">
                  {ws.posterImage && (
                    <img
                      src={`http://localhost:7700${ws.posterImage}`}
                      alt={ws.title}
                      className="w-12 h-12 rounded-md object-cover mr-3"
                      onError={(e) => {
                        e.target.style.display = 'none';
                      }}
                    />
                  )}
                  <div>
                    <div className="text-sm font-medium text-gray-900">{ws.title}</div>
                    <div className="flex items-center mt-1">
                      {getDeliveryModeIcon(ws.deliveryMode)}
                      <span className={`ml-2 px-2 py-1 text-xs rounded-full ${getDeliveryModeColor(ws.deliveryMode)}`}>
                        {ws.deliveryMode}
                      </span>
                    </div>
                    {ws.description && (
                      <div className="text-xs text-gray-500 mt-1 max-w-xs truncate">
                        {ws.description}
                      </div>
                    )}
                  </div>
                </div>
              </td>
              <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                <div className="space-y-2">
                  {ws.teacher && (
                    <div className="flex items-center">
                      <FaChalkboardTeacher className="mr-2 text-blue-500" />
                      <div>
                        <div className="font-medium text-blue-900">{ws.teacher}</div>
                        <div className="text-xs text-blue-600">Teacher</div>
                      </div>
                    </div>
                  )}
                  {ws.incharge && (
                    <div className="flex items-center">
                      <FaUserShield className="mr-2 text-green-500" />
                      <div>
                        <div className="font-medium text-green-900">{ws.incharge}</div>
                        <div className="text-xs text-green-600">Incharge</div>
                      </div>
                    </div>
                  )}
                  {!ws.teacher && !ws.incharge && (
                    <div className="text-gray-400 text-xs italic">No team assigned</div>
                  )}
                </div>
              </td>
              <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                <div className="flex items-center">
                  <FaCalendar className="mr-1 text-gray-400" />
                  {new Date(ws.startDate).toLocaleDateString()}
                </div>
                <div className="flex items-center mt-1">
                  <FaClock className="mr-1 text-gray-400" />
                  {ws.startTime} - {ws.endTime}
                </div>
                {ws.venue && (
                  <div className="flex items-center mt-1">
                    <FaMapMarkerAlt className="mr-1 text-gray-400" />
                    <span className="truncate max-w-32" title={ws.venue}>{ws.venue}</span>
                  </div>
                )}
              </td>
              <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                <div className="flex items-center">
                  <FaUsers className="mr-1 text-gray-400" />
                  Seats: {ws.maxSeats}
                </div>
                <div className="flex items-center mt-1">
                  <FaMoneyBillWave className="mr-1 text-gray-400" />
                  Price: ₹{ws.price}
                </div>
                {ws.totalAmount && ws.totalAmount !== ws.price && (
                  <div className="flex items-center mt-1 text-green-600">
                    <FaMoneyBillWave className="mr-1" />
                    Total: ₹{ws.totalAmount}
                  </div>
                )}
              </td>
              <td className="px-6 py-4 whitespace-nowrap">
                <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${ws.isActive ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'}`}>
                  {ws.isActive ? 'Active' : 'Inactive'}
                </span>
              </td>
              <td className="px-6 py-4 whitespace-nowrap text-sm">
                <button
                  onClick={() => handleEdit(ws)}
                  className="px-3 py-1 bg-blue-500 text-white rounded-md hover:bg-blue-600 transition-colors flex items-center"
                  disabled={!ws?.id}
                >
                  <FaPencilAlt className="mr-1" />
                  Edit
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );

  return (
    <div>
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-4 space-y-4 md:space-y-0">
        <h3 className="text-md font-medium text-gray-700">All Workshops ({filteredWorkshops.length})</h3>
        
        <div className="flex flex-col md:flex-row items-start md:items-center space-y-2 md:space-y-0 md:space-x-4">
          {/* View Mode Toggle */}
          <div className="flex bg-gray-100 rounded-lg p-1">
            <button
              onClick={() => setViewMode('table')}
              className={`px-3 py-1 rounded-md text-sm font-medium transition-colors ${
                viewMode === 'table' 
                  ? 'bg-white text-gray-900 shadow-sm' 
                  : 'text-gray-600 hover:text-gray-900'
              }`}
            >
              Table
            </button>
            <button
              onClick={() => setViewMode('cards')}
              className={`px-3 py-1 rounded-md text-sm font-medium transition-colors ${
                viewMode === 'cards' 
                  ? 'bg-white text-gray-900 shadow-sm' 
                  : 'text-gray-600 hover:text-gray-900'
              }`}
            >
              Cards
            </button>
          </div>

          {/* Filters */}
          <div className="flex items-center space-x-2">
            <select
              value={filterMode}
              onChange={handleFilterChange}
              className="border border-gray-300 rounded-md px-3 py-1 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
            >
              <option value="all">All Modes</option>
              <option value="ONLINE">Online</option>
              <option value="OFFLINE">Offline</option>
              <option value="HYBRID">Hybrid</option>
            </select>

            <div className="relative">
              <FaSearch className="absolute top-1/2 left-3 -translate-y-1/2 text-gray-400" />
              <input
                type="text"
                placeholder="Search workshops..."
                value={searchTerm}
                onChange={handleSearchChange}
                className="border border-gray-300 rounded-md pl-10 pr-4 py-1 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
              />
            </div>
          </div>
        </div>
      </div>

      {/* No results message */}
      {filteredWorkshops.length === 0 && (
        <div className="text-center py-8">
          <div className="text-gray-400 text-lg mb-2">No workshops found</div>
          <div className="text-gray-500 text-sm">
            Try adjusting your search terms or filters
          </div>
        </div>
      )}

      {/* Render based on view mode */}
      {filteredWorkshops.length > 0 && (
        <>
          {viewMode === 'table' ? <TableView /> : <CardView />}
          
          {/* Pagination Controls */}
          {filteredWorkshops.length > workshopsPerPage && (
            <div className="mt-6 flex justify-center space-x-2">
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
        </>
      )}
    </div>
  );
};

export default WorkshopList;