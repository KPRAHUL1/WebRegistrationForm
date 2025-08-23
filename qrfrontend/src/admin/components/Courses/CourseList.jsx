import React, { useState } from 'react';
import { FaPencilAlt, FaSearch, FaExclamationCircle, FaBook, FaGlobe, FaMapMarkerAlt, FaVideo } from 'react-icons/fa';

const CourseList = ({ courses = [], handleEdit }) => {
  // State for search term and pagination
  const [searchTerm, setSearchTerm] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const coursesPerPage = 5;

  // Handle empty or invalid courses data
  if (!Array.isArray(courses)) {
    return (
      <div className="text-center py-10">
        <FaExclamationCircle className="mx-auto h-12 w-12 text-gray-400 mb-4" />
        <p className="text-gray-500">Invalid courses data received</p>
      </div>
    );
  }

  if (courses.length === 0) {
    return (
      <div className="text-center py-10">
        <FaBook className="mx-auto h-12 w-12 text-gray-400 mb-4" />
        <p className="text-gray-500">No courses found</p>
      </div>
    );
  }

  // Filter courses based on search term
  const filteredCourses = courses.filter(course => {
    if (!course || !course.title) return false;
    const searchLower = searchTerm.toLowerCase();
    return course.title.toLowerCase().includes(searchLower) ||
           (course.teacher && course.teacher.toLowerCase().includes(searchLower)) ||
           (course.incharge && course.incharge.toLowerCase().includes(searchLower)) ||
           (course.deliveryMode && course.deliveryMode.toLowerCase().includes(searchLower));
  });

  // Calculate pagination variables
  const indexOfLastCourse = currentPage * coursesPerPage;
  const indexOfFirstCourse = indexOfLastCourse - coursesPerPage;
  const currentCourses = filteredCourses.slice(indexOfFirstCourse, indexOfLastCourse);

  const totalPages = Math.ceil(filteredCourses.length / coursesPerPage);

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
      return 'Invalid Date';
    }
  };

  // Delivery mode icon and badge
  const getDeliveryModeBadge = (mode) => {
    const modeConfig = {
      ONLINE: { icon: FaGlobe, color: 'bg-blue-100 text-blue-800', text: 'Online' },
      OFFLINE: { icon: FaMapMarkerAlt, color: 'bg-green-100 text-green-800', text: 'Offline' },
      HYBRID: { icon: FaVideo, color: 'bg-purple-100 text-purple-800', text: 'Hybrid' }
    };
    
    const config = modeConfig[mode] || modeConfig.OFFLINE;
    const IconComponent = config.icon;
    
    return (
      <span className={`px-2 py-1 inline-flex text-xs leading-5 font-semibold rounded-full items-center ${config.color}`}>
        <IconComponent className="mr-1 h-3 w-3" />
        {config.text}
      </span>
    );
  };

  return (
    <div>
      <div className="flex justify-between items-center mb-4">
        <h3 className="text-md font-medium text-gray-700">
          All Courses ({filteredCourses.length})
        </h3>
        <div className="relative">
          <FaSearch className="absolute top-1/2 left-3 -translate-y-1/2 text-gray-400" />
          <input
            type="text"
            placeholder="Search courses, teachers, coordinators..."
            value={searchTerm}
            onChange={handleSearchChange}
            className="border border-gray-300 rounded-md pl-10 pr-4 py-1 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 w-80"
          />
        </div>
      </div>

      {filteredCourses.length === 0 ? (
        <div className="text-center py-10">
          <p className="text-gray-500">
            {searchTerm ? `No courses found matching "${searchTerm}"` : 'No courses available'}
          </p>
        </div>
      ) : (
        <>
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                    Course Details
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                    Schedule
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                    Delivery & Location
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                    Instructor
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                    Pricing
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
                {currentCourses.map((course, idx) => (
                  <tr key={course?.id || `course-${idx}`} className="hover:bg-gray-50">
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center">
                        {course?.posterImage && (
                          <img 
                            className="h-10 w-10 rounded-lg object-cover mr-3" 
                            src={course.posterImage} 
                            alt={course.title}
                            onError={(e) => {e.target.style.display = 'none'}}
                          />
                        )}
                        <div>
                          <div className="text-sm font-medium text-gray-900">
                            {course?.title || 'Untitled Course'}
                          </div>
                          <div className="text-sm text-gray-500">
                            {course?.maxSeats || 0} seats
                          </div>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      <div>
                        <div>Start: {formatDate(course?.startDate)}</div>
                        <div>End: {formatDate(course?.endDate)}</div>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="mb-2">
                        {getDeliveryModeBadge(course?.deliveryMode)}
                      </div>
                      <div className="text-sm text-gray-500">
                        {course?.deliveryMode === 'OFFLINE' && course?.venue && (
                          <div title={course.venue}>{course.venue.length > 20 ? course.venue.substring(0, 20) + '...' : course.venue}</div>
                        )}
                        {course?.deliveryMode === 'ONLINE' && course?.meetingLink && (
                          <div className="text-blue-600">Online Meeting</div>
                        )}
                        {course?.deliveryMode === 'HYBRID' && (
                          <div>Hybrid Format</div>
                        )}
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      <div>
                        {course?.teacher && (
                          <div className="font-medium text-gray-900">{course.teacher}</div>
                        )}
                        {course?.incharge && (
                          <div className="text-gray-500">Coord: {course.incharge}</div>
                        )}
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      <div>
                        <div className="font-medium">₹{course?.price || 0}</div>
                        {course?.totalAmount && course?.totalAmount !== course?.price && (
                          <div className="text-green-600 text-xs">Total: ₹{course.totalAmount}</div>
                        )}
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span
                        className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${
                          course?.isActive
                            ? 'bg-green-100 text-green-800'
                            : 'bg-red-100 text-red-800'
                        }`}
                      >
                        {course?.isActive ? 'Active' : 'Inactive'}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm">
                      <button
                        onClick={() => handleEdit(course)}
                        className="px-3 py-1 bg-blue-500 text-white rounded-md hover:bg-blue-600 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                        disabled={!course?.id}
                        title={!course?.id ? 'Course ID is required to edit' : 'Edit course'}
                      >
                        <FaPencilAlt className="inline mr-1" />
                        Edit
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* Pagination Controls */}
          {filteredCourses.length > coursesPerPage && (
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

export default CourseList;