// InternshipForm.js
import React, { useState, useEffect } from "react";
import { motion } from "framer-motion";
import axios from "axios";
import { useParams, useNavigate } from "react-router-dom";

const InternshipForm = () => {
  const { id: internshipId } = useParams();
  const navigate = useNavigate();

  const [form, setForm] = useState({
    fullName: "",
    email: "",
    phone: "",
    collegeName: "",
    department: "",
    year: "",
  });

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(false);
  const [internship, setInternship] = useState(null);
  const [loadingInternship, setLoadingInternship] = useState(true);


  useEffect(() => {
    const fetchInternship = async () => {
      setLoadingInternship(true);
      try {
        const response = await axios.get(
          `http://localhost:7700/api/internship/${internshipId}`
        );
        setInternship(response.data);
      } catch (err) {
        setError(err.message || "Failed to fetch internship details");
        navigate("/internships");
      } finally {
        setLoadingInternship(false);
      }
    };

    if (internshipId) {
      fetchInternship();
    } else {
      setError("No internship ID provided");
      setLoadingInternship(false);
    }
  }, [internshipId, navigate]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!internship) {
      setError("Internship information not loaded");
      return;
    }

    setIsSubmitting(true);
    setError(null);

    try {
      const response = await axios.post(
        `http://localhost:7700/api/internship/${internshipId}/register`,
        { ...form, internshipId }
      );

      setSuccess({
        message: "Registration Successful!",
        details: response.data,
      });
    } catch (err) {
      console.error("Registration error:", err);

      if (err.response?.data?.error) {
        setError(err.response.data.error);
      } else if (err.response?.status === 500) {
        setError("Server error occurred. Please try again or contact support.");
      } else {
        setError(err.message || "Registration failed. Please try again.");
      }
    } finally {
      setIsSubmitting(false);
    }
  };

  if (loadingInternship) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="spinner border-4 border-blue-500 border-t-transparent rounded-full w-12 h-12 animate-spin mx-auto"></div>
          <p className="mt-4 text-gray-600">Loading internship details...</p>
        </div>
      </div>
    );
  }
  if (!internship) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center p-6 bg-white rounded-lg shadow-md max-w-md">
          <h2 className="text-2xl font-bold text-red-600 mb-4">Error</h2>
          <p className="mb-4">{error || "Internship not found"}</p>
          <a
            href="/internships"
            className="bg-blue-600 text-white py-2 px-4 rounded-lg font-semibold hover:bg-blue-700 transition"
          >
            Browse Internships
          </a>
        </div>
      </div>
    );
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 30 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, ease: "easeOut" }}
      className="min-h-screen flex flex-col items-center justify-center bg-gray-50"
    >
      <motion.div
        initial={{ scale: 0.97, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        transition={{ duration: 0.4, delay: 0.2 }}
        className="bg-white p-8 rounded-xl shadow-xl w-full max-w-md"
      >
        {success ? (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="text-center"
          >
            <h2 className="text-3xl font-extrabold mb-4 text-green-600">
              {success.message}
            </h2>
            <p className="mb-4">
              Thank you for registering for {internship.data.title}. We've sent a
              confirmation to your email.
            </p>
            <button
              onClick={() => setSuccess(false)}
              className="bg-blue-600 text-white py-2 px-4 rounded-lg font-semibold hover:bg-blue-700 transition"
            >
              Register Another
            </button>
          </motion.div>
        ) : (
          <>
          
            <motion.h2
              initial={{ opacity: 0, y: -15 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.4, delay: 0.3 }}
              className="text-2xl font-bold mb-6 text-center text-blue-700"
            >
              {internship.data.title} Registration
            </motion.h2>

            {error && (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="mb-4 p-3 bg-red-100 text-red-700 rounded"
              >
                {error}
              </motion.div>
            )}

            <form onSubmit={handleSubmit} className="space-y-4">
              <input
                type="text"
                name="fullName"
                placeholder="Full Name"
                value={form.fullName}
                onChange={handleChange}
                required
                className="w-full px-3 py-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
              <input
                type="email"
                name="email"
                placeholder="Email"
                value={form.email}
                onChange={handleChange}
                required
                className="w-full px-3 py-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
              <input
                type="text"
                name="phone"
                placeholder="Phone"
                value={form.phone}
                onChange={handleChange}
                required
                className="w-full px-3 py-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
              <input
                type="text"
                name="collegeName"
                placeholder="College Name"
                value={form.collegeName}
                onChange={handleChange}
                required
                className="w-full px-3 py-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
              <input
                type="text"
                name="department"
                placeholder="Department"
                value={form.department}
                onChange={handleChange}
                required
                className="w-full px-3 py-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
              <input
                type="text"
                name="year"
                placeholder="Year of Study"
                value={form.year}
                onChange={handleChange}
                required
                className="w-full px-3 py-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
              />

              <motion.button
                type="submit"
                disabled={isSubmitting}
                whileHover={{ scale: 1.03 }}
                whileTap={{ scale: 0.97 }}
                className={`w-full bg-blue-600 text-white py-2 rounded-lg font-semibold hover:bg-blue-700 transition ${
                  isSubmitting ? "opacity-70 cursor-not-allowed" : ""
                }`}
              >
                {isSubmitting ? "Processing..." : "Register"}
              </motion.button>
            </form>
          </>
        )}
      </motion.div>
    </motion.div>
  );
};

export default InternshipForm;
