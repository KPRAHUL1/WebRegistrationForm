// CoursesPage.js
import React, { useState, useEffect } from "react";
import axios from "axios";
import { Link } from "react-router-dom";
import { motion } from "framer-motion";

const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.1,
    },
  },
};

const itemVariants = {
  hidden: { y: 20, opacity: 0 },
  visible: {
    y: 0,
    opacity: 1,
    transition: {
      duration: 0.4,
    },
  },
};

const CoursesPage = () => {
  const [courses, setCourses] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [filter, setFilter] = useState('all');

  useEffect(() => {
    const fetchCourses = async () => {
      setLoading(true);
      setError(null);
      try {
        const response = await axios.get("http://localhost:7700/api/courses/active");
        console.log('Active courses response:', response.data);
        
        // Handle both response formats
        if (response.data.success && response.data.data) {
          setCourses(response.data.data);
        } else {
          setCourses(response.data || []);
        }
      } catch (err) {
        setError(err.message || "Failed to fetch courses");
        console.error("Error fetching courses:", err);
      } finally {
        setLoading(false);
      }
    };
    fetchCourses();
  }, []);

  const getDeliveryModeIcon = (mode) => {
    const icons = {
      ONLINE: '🌐',
      OFFLINE: '📍',
      HYBRID: '🔄'
    };
    return icons[mode] || icons.OFFLINE;
  };

  const getDeliveryModeText = (mode) => {
    const texts = {
      ONLINE: 'Online',
      OFFLINE: 'In-Person',
      HYBRID: 'Hybrid'
    };
    return texts[mode] || texts.OFFLINE;
  };

  const getDeliveryModeColor = (mode) => {
    const colors = {
      ONLINE: 'bg-blue-100 text-blue-800',
      OFFLINE: 'bg-green-100 text-green-800',
      HYBRID: 'bg-purple-100 text-purple-800'
    };
    return colors[mode] || colors.OFFLINE;
  };

  const filteredCourses = courses.filter(course => {
    if (filter === 'all') return true;
    return course.deliveryMode === filter;
  });

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-900 text-white">
        <div className="text-center">
          <div className="spinner border-4 border-purple-500 border-t-transparent rounded-full w-12 h-12 animate-spin mx-auto"></div>
          <p className="mt-4 text-gray-400">Loading courses...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-900 text-white">
        <div className="text-center p-6 bg-gray-800 rounded-lg shadow-md max-w-md">
          <h2 className="text-2xl font-bold text-red-500 mb-4">Error</h2>
          <p className="mb-4">{error}</p>
          <Link
            to="/"
            className="bg-purple-600 text-white py-2 px-4 rounded-lg font-semibold hover:bg-purple-700 transition"
          >
            Go Back
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex flex-col items-center p-8 bg-gray-900 text-white">
      <motion.h1
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="text-4xl md:text-5xl font-extrabold text-center mb-6"
      >
        Available Courses
      </motion.h1>

      {/* Filter Tabs */}
      <motion.div
        initial={{ opacity: 0, y: -10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.2 }}
        className="flex flex-wrap justify-center gap-2 mb-8"
      >
        <button
          onClick={() => setFilter('all')}
          className={`px-4 py-2 rounded-full text-sm font-medium transition-colors ${
            filter === 'all'
              ? 'bg-purple-600 text-white'
              : 'bg-gray-800 text-gray-300 hover:bg-gray-700'
          }`}
        >
          All Courses ({courses.length})
        </button>
        <button
          onClick={() => setFilter('ONLINE')}
          className={`px-4 py-2 rounded-full text-sm font-medium transition-colors ${
            filter === 'ONLINE'
              ? 'bg-blue-600 text-white'
              : 'bg-gray-800 text-gray-300 hover:bg-gray-700'
          }`}
        >
          🌐 Online ({courses.filter(c => c.deliveryMode === 'ONLINE').length})
        </button>
        <button
          onClick={() => setFilter('OFFLINE')}
          className={`px-4 py-2 rounded-full text-sm font-medium transition-colors ${
            filter === 'OFFLINE'
              ? 'bg-green-600 text-white'
              : 'bg-gray-800 text-gray-300 hover:bg-gray-700'
          }`}
        >
          📍 In-Person ({courses.filter(c => c.deliveryMode === 'OFFLINE').length})
        </button>
        <button
          onClick={() => setFilter('HYBRID')}
          className={`px-4 py-2 rounded-full text-sm font-medium transition-colors ${
            filter === 'HYBRID'
              ? 'bg-purple-600 text-white'
              : 'bg-gray-800 text-gray-300 hover:bg-gray-700'
          }`}
        >
          🔄 Hybrid ({courses.filter(c => c.deliveryMode === 'HYBRID').length})
        </button>
      </motion.div>

      <motion.div
        variants={containerVariants}
        initial="hidden"
        animate="visible"
        className="grid gap-6 md:grid-cols-2 lg:grid-cols-3 max-w-7xl w-full"
      >
        {filteredCourses.length > 0 ? (
          filteredCourses.map((course) => (
            <motion.div
              key={course.id}
              variants={itemVariants}
              className="bg-gray-800 rounded-xl shadow-lg overflow-hidden flex flex-col transform hover:scale-105 transition-transform duration-300"
            >
              {/* Course Poster */}
              {course.posterImage && (
                <div className="h-48 overflow-hidden">
                  <img 
                    src={course.posterImage} 
                    alt={course.title}
                    className="w-full h-full object-cover"
                    onError={(e) => {
                      e.target.style.display = 'none';
                    }}
                  />
                </div>
              )}
              
              <div className="p-6 flex flex-col flex-grow">
                {/* Delivery Mode Badge */}
                <div className="flex justify-between items-start mb-3">
                  <span className={`px-3 py-1 rounded-full text-xs font-semibold ${getDeliveryModeColor(course.deliveryMode)}`}>
                    {getDeliveryModeIcon(course.deliveryMode)} {getDeliveryModeText(course.deliveryMode)}
                  </span>
                  {course.totalAmount && course.totalAmount !== course.price && (
                    <div className="text-right">
                      <div className="text-sm text-gray-400 line-through">₹{course.price}</div>
                      <div className="text-lg font-bold text-green-400">₹{course.totalAmount}</div>
                    </div>
                  )}
                </div>

                <h3 className="text-2xl font-bold text-purple-400 mb-2">
                  {course.title}
                </h3>
                
                <p className="text-gray-400 mb-4 flex-grow">
                  {course.description}
                </p>

                <div className="space-y-2 text-sm text-gray-300 mb-4">
                  <div className="flex items-center">
                    <span className="font-semibold text-white mr-2">📅 Dates:</span>
                    {new Date(course.startDate).toLocaleDateString()} - {new Date(course.endDate).toLocaleDateString()}
                  </div>
                  
                  {course.teacher && (
                    <div className="flex items-center">
                      <span className="font-semibold text-white mr-2">👨‍🏫 Instructor:</span>
                      {course.teacher}
                    </div>
                  )}
                  
                  {course.incharge && (
                    <div className="flex items-center">
                      <span className="font-semibold text-white mr-2">👤 Coordinator:</span>
                      {course.incharge}
                    </div>
                  )}

                  {course.deliveryMode === 'OFFLINE' && course.venue && (
                    <div className="flex items-center">
                      <span className="font-semibold text-white mr-2">📍 Venue:</span>
                      <span className="truncate" title={course.venue}>
                        {course.venue}
                      </span>
                    </div>
                  )}

                  {course.deliveryMode === 'ONLINE' && (
                    <div className="flex items-center">
                      <span className="font-semibold text-white mr-2">🌐 Format:</span>
                      Online Meeting
                    </div>
                  )}

                  <div className="flex items-center">
                    <span className="font-semibold text-white mr-2">💺 Available Seats:</span>
                    {course.maxSeats - (course._count?.registrations || 0)} / {course.maxSeats}
                  </div>

                  {!course.totalAmount || course.totalAmount === course.price ? (
                    <div className="flex items-center">
                      <span className="font-semibold text-white mr-2">💰 Price:</span>
                      ₹{course.price}
                    </div>
                  ) : null}
                </div>

                {/* Course availability check */}
                {course.maxSeats - (course._count?.registrations || 0) > 0 ? (
                  <Link
                    to={`/register/course/${course.id}`}
                    className="w-full text-center bg-purple-600 text-white py-3 px-6 rounded-lg font-bold hover:bg-purple-700 transition-colors duration-300"
                  >
                    Register Now
                  </Link>
                ) : (
                  <button
                    disabled
                    className="w-full text-center bg-gray-600 text-gray-400 py-3 px-6 rounded-lg font-bold cursor-not-allowed"
                  >
                    Course Full
                  </button>
                )}
              </div>
            </motion.div>
          ))
        ) : (
          <div className="col-span-full text-center text-gray-500 py-12">
            <p className="text-xl mb-4">
              {filter === 'all' 
                ? "No courses are currently available." 
                : `No ${getDeliveryModeText(filter).toLowerCase()} courses are currently available.`
              }
            </p>
            {filter !== 'all' && (
              <button
                onClick={() => setFilter('all')}
                className="text-purple-400 hover:text-purple-300 underline"
              >
                View all courses
              </button>
            )}
          </div>
        )}
      </motion.div>
    </div>
  );
};

export default CoursesPage;