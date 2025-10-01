// WorkshopsPage.js
import React, { useState, useEffect } from "react";
import axios from "axios";
import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import { FaMapMarkerAlt, FaVideo, FaUser, FaUserTie, FaClock, FaCalendarAlt, FaRupeeSign } from "react-icons/fa";

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

const WorkshopsPage = () => {
  const [workshops, setWorkshops] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [filterMode, setFilterMode] = useState('all');

  useEffect(() => {
    const fetchWorkshops = async () => {
      setLoading(true);
      setError(null);
      try {
        const response = await axios.get("http://localhost:7700/api/register/workshop/active");
        setWorkshops(response.data);
      } catch (err) {
        setError(err.message || "Failed to fetch workshops");
        console.error("Error fetching workshops:", err);
      } finally {
        setLoading(false);
      }
    };
    fetchWorkshops();
  }, []);

  const getDeliveryModeIcon = (mode) => {
    switch (mode) {
      case 'ONLINE':
        return <FaVideo className="text-blue-400" />;
      case 'OFFLINE':
        return <FaMapMarkerAlt className="text-green-400" />;
      case 'HYBRID':
        return (
          <div className="flex items-center space-x-1">
            <FaMapMarkerAlt className="text-green-400" />
            <FaVideo className="text-blue-400" />
          </div>
        );
      default:
        return <FaMapMarkerAlt className="text-gray-400" />;
    }
  };

  const getDeliveryModeColor = (mode) => {
    switch (mode) {
      case 'ONLINE':
        return 'bg-blue-500/20 text-blue-300 border-blue-500/30';
      case 'OFFLINE':
        return 'bg-green-500/20 text-green-300 border-green-500/30';
      case 'HYBRID':
        return 'bg-purple-500/20 text-purple-300 border-purple-500/30';
      default:
        return 'bg-gray-500/20 text-gray-300 border-gray-500/30';
    }
  };

  // Filter workshops based on delivery mode
  const filteredWorkshops = workshops.filter(workshop => 
    filterMode === 'all' || workshop.deliveryMode === filterMode
  );

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-900 text-white">
        <div className="text-center">
          <div className="spinner border-4 border-purple-500 border-t-transparent rounded-full w-12 h-12 animate-spin mx-auto"></div>
          <p className="mt-4 text-gray-400">Loading workshops...</p>
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
        Available Workshops
      </motion.h1>

      {/* Filter Controls */}
      <motion.div
        initial={{ opacity: 0, y: -10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.2 }}
        className="mb-8 flex flex-wrap justify-center gap-2"
      >
        <button
          onClick={() => setFilterMode('all')}
          className={`px-4 py-2 rounded-full text-sm font-medium transition-colors ${
            filterMode === 'all'
              ? 'bg-purple-600 text-white'
              : 'bg-gray-800 text-gray-300 hover:bg-gray-700'
          }`}
        >
          All Workshops ({workshops.length})
        </button>
        <button
          onClick={() => setFilterMode('ONLINE')}
          className={`px-4 py-2 rounded-full text-sm font-medium transition-colors flex items-center ${
            filterMode === 'ONLINE'
              ? 'bg-blue-600 text-white'
              : 'bg-gray-800 text-gray-300 hover:bg-gray-700'
          }`}
        >
          <FaVideo className="mr-2" />
          Online ({workshops.filter(w => w.deliveryMode === 'ONLINE').length})
        </button>
        <button
          onClick={() => setFilterMode('OFFLINE')}
          className={`px-4 py-2 rounded-full text-sm font-medium transition-colors flex items-center ${
            filterMode === 'OFFLINE'
              ? 'bg-green-600 text-white'
              : 'bg-gray-800 text-gray-300 hover:bg-gray-700'
          }`}
        >
          <FaMapMarkerAlt className="mr-2" />
          Offline ({workshops.filter(w => w.deliveryMode === 'OFFLINE').length})
        </button>
        <button
          onClick={() => setFilterMode('HYBRID')}
          className={`px-4 py-2 rounded-full text-sm font-medium transition-colors flex items-center ${
            filterMode === 'HYBRID'
              ? 'bg-purple-600 text-white'
              : 'bg-gray-800 text-gray-300 hover:bg-gray-700'
          }`}
        >
          <div className="flex items-center mr-2">
            <FaMapMarkerAlt className="mr-1" />
            <FaVideo />
          </div>
          Hybrid ({workshops.filter(w => w.deliveryMode === 'HYBRID').length})
        </button>
      </motion.div>

      <motion.div
        variants={containerVariants}
        initial="hidden"
        animate="visible"
        className="grid gap-8 md:grid-cols-2 lg:grid-cols-3 max-w-7xl w-full"
      >
        {filteredWorkshops.length > 0 ? (
          filteredWorkshops.map((workshop) => (
            <motion.div
              key={workshop.id}
              variants={itemVariants}
              className="bg-gray-800 rounded-xl shadow-lg overflow-hidden transform hover:scale-105 transition-transform duration-300"
            >
              {/* Poster Image */}
              {workshop.posterImageUrl && (
                <div className="h-48 overflow-hidden">
                  <img
                    src={workshop.posterImageUrl}
                    alt={workshop.title}
                    className="w-full h-full object-cover"
                  />
                </div>
              )}
              
              <div className="p-6">
                <div className="flex items-center justify-between mb-3">
                  <h3 className="text-xl font-bold text-purple-400">
                    {workshop.title}
                  </h3>
                  <div className={`px-3 py-1 rounded-full text-xs font-medium border ${getDeliveryModeColor(workshop.deliveryMode)} flex items-center`}>
                    {getDeliveryModeIcon(workshop.deliveryMode)}
                    <span className="ml-2">{workshop.deliveryMode}</span>
                  </div>
                </div>

                <p className="text-gray-400 mb-4 line-clamp-3">{workshop.description}</p>

                <div className="space-y-3 text-sm text-gray-300 mb-6">
                  <div className="flex items-center">
                    <FaCalendarAlt className="mr-3 text-purple-400 w-4" />
                    <span>
                      {new Date(workshop.startDate).toLocaleDateString()} - {new Date(workshop.endDate).toLocaleDateString()}
                    </span>
                  </div>
                  
                  <div className="flex items-center">
                    <FaClock className="mr-3 text-purple-400 w-4" />
                    <span>{workshop.startTime} - {workshop.endTime}</span>
                  </div>

                  <div className="flex items-center">
                    <FaRupeeSign className="mr-3 text-green-400 w-4" />
                    <span className="font-semibold text-green-400">{workshop.price}</span>
                  </div>

                  {workshop.teacher && (
                    <div className="flex items-center">
                      <FaUser className="mr-3 text-blue-400 w-4" />
                      <span>Instructor: {workshop.teacher}</span>
                    </div>
                  )}

                  {workshop.incharge && (
                    <div className="flex items-center">
                      <FaUserTie className="mr-3 text-yellow-400 w-4" />
                      <span>Coordinator: {workshop.incharge}</span>
                    </div>
                  )}

                  {workshop.venue && workshop.deliveryMode !== 'ONLINE' && (
                    <div className="flex items-start">
                      <FaMapMarkerAlt className="mr-3 text-green-400 w-4 mt-0.5" />
                      <span className="text-xs">{workshop.venue}</span>
                    </div>
                  )}
                </div>

                <div className="border-t border-gray-700 pt-4">
                  <div className="flex items-center justify-between mb-4">
                    <span className="text-sm text-gray-400">
                      Available Seats: <span className="text-white font-medium">{workshop.maxSeats}</span>
                    </span>
                    {workshop._count?.registrations && (
                      <span className="text-sm text-gray-400">
                        Registered: <span className="text-purple-400 font-medium">{workshop._count.registrations}</span>
                      </span>
                    )}
                  </div>

                  <Link
                    to={`/register/workshop/${workshop.id}`}
                    className="block w-full text-center bg-gradient-to-r from-purple-600 to-blue-600 text-white py-3 px-6 rounded-lg font-bold hover:from-purple-700 hover:to-blue-700 transition-all duration-300 transform hover:scale-105"
                  >
                    Register Now
                  </Link>
                </div>
              </div>
            </motion.div>
          ))
        ) : (
          <div className="col-span-full text-center py-12">
            <div className="text-gray-500 text-lg mb-2">
              No {filterMode !== 'all' && filterMode.toLowerCase()} workshops available
            </div>
            <p className="text-gray-600">
              {filterMode !== 'all' 
                ? `Try selecting a different delivery mode or check back later.`
                : 'Check back later for new workshops.'
              }
            </p>
          </div>
        )}
      </motion.div>
    </div>
  );
};

export default WorkshopsPage;