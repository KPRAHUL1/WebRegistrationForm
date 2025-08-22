// InternshipsPage.js
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

const InternshipsPage = () => {
  const [internships, setInternships] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchInternships = async () => {
      setLoading(true);
      setError(null);
      try {
        const response = await axios.get("http://localhost:7700/api/internship/active");
        setInternships(response.data);
      } catch (err) {
        setError(err.message || "Failed to fetch internships");
        console.error("Error fetching internships:", err);
      } finally {
        setLoading(false);
      }
    };
    fetchInternships();
  }, []);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-900 text-white">
        <div className="text-center">
          <div className="spinner border-4 border-purple-500 border-t-transparent rounded-full w-12 h-12 animate-spin mx-auto"></div>
          <p className="mt-4 text-gray-400">Loading internships...</p>
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
        className="text-4xl md:text-5xl font-extrabold text-center mb-10"
      >
        Available Internships
      </motion.h1>

      <motion.div
        variants={containerVariants}
        initial="hidden"
        animate="visible"
        className="grid gap-6 md:grid-cols-2 lg:grid-cols-3 max-w-6xl w-full"
      >
        {internships.length > 0 ? (
          internships.map((internship) => (
            <motion.div
              key={internship.id}
              variants={itemVariants}
              className="bg-gray-800 rounded-xl shadow-lg p-6 flex flex-col justify-between transform hover:scale-105 transition-transform duration-300"
            >
              <div>
                <h3 className="text-2xl font-bold text-purple-400 mb-2">
                  {internship.title}
                </h3>
                <p className="text-gray-400 mb-4">{internship.description}</p>
                <div className="space-y-2 text-sm text-gray-300">
                  <p>
                    <span className="font-semibold text-white">Date:</span>{" "}
                    {new Date(internship.startDate).toLocaleDateString()}
                  </p>
                  <p>
                    <span className="font-semibold text-white">Time:</span>{" "}
                    {internship.startTime} - {internship.endTime}
                  </p>
                  <p>
                    <span className="font-semibold text-white">Price:</span> ₹
                    {internship.price}
                  </p>
                </div>
              </div>
              <Link
                to={`/register/internship/${internship.id}`}
                className="mt-6 w-full text-center bg-purple-600 text-white py-3 px-6 rounded-lg font-bold hover:bg-purple-700 transition-colors duration-300"
              >
                Register
              </Link>
            </motion.div>
          ))
        ) : (
          <p className="col-span-full text-center text-gray-500">
            No internships are currently available.
          </p>
        )}
      </motion.div>
    </div>
  );
};

export default InternshipsPage;