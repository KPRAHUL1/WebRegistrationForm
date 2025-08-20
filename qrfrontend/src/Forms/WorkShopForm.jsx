// WorkShopForm.js
import React, { useState, useEffect } from "react";
import { QRCodeCanvas } from "qrcode.react";
import { motion } from "framer-motion";
import axios from "axios";
import { useParams, useNavigate } from "react-router-dom";

const WorkShopForm = () => {
  const { workshopId } = useParams();
  const navigate = useNavigate();

  const [form, setForm] = useState({
    fullName: "",
    email: "",
    phone: "",
    collegeName: "",
    department: "",
    year: "",
    upiId: "",
    paymentProof: "",
    // Add other form fields dynamically later
  });

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(false);
  const [workshop, setWorkshop] = useState(null);
  const [loadingWorkshop, setLoadingWorkshop] = useState(true);

  useEffect(() => {
    const fetchWorkshop = async () => {
      setLoadingWorkshop(true);
      try {
        const response = await axios.get(`http://localhost:7700/api/register/${workshopId}`);
        setWorkshop(response.data);
      } catch (err) {
        setError(err.message || "Failed to fetch workshop details");
        navigate("/workshops");
      } finally {
        setLoadingWorkshop(false);
      }
    };

    if (workshopId) {
      fetchWorkshop();
    } else {
      setError("No workshop ID provided");
      setLoadingWorkshop(false);
    }
  }, [workshopId, navigate]);

  const handleChange = (e) => {
    const { name, value, files } = e.target;
    setForm(prev => ({
      ...prev,
      [name]: files ? files[0] : value,
    }));
  };

// In your handleSubmit function, ensure amount is a valid number string
const handleSubmit = async (e) => {
  e.preventDefault();

  if (!workshop) {
    setError("Workshop information not loaded");
    return;
  }

  // Validate workshop price
  if (!workshop.price || isNaN(workshop.price)) {
    setError("Invalid workshop price");
    return;
  }

  setIsSubmitting(true);
  setError(null);

  try {
    const formData = new FormData();
    
    // Add basic required fields
    formData.append("fullName", form.fullName);
    formData.append("email", form.email);
    formData.append("phone", form.phone);
    formData.append("collegeName", form.collegeName);
    formData.append("department", form.department);
    formData.append("year", form.year);
    formData.append("upiId", form.upiId);
    
    // Ensure amount is a valid number string
    const amount = workshop.price.toString();
    formData.append("amount", amount);
    formData.append("workshopId", workshopId);

    // Add payment proof file
    if (form.paymentProof) {
      formData.append("paymentProof", form.paymentProof);
    } else {
      setError("Payment proof is required");
      setIsSubmitting(false);
      return;
    }

    // Add dynamic fields from workshop configuration
    if (workshop.formFields) {
      workshop.formFields.forEach(field => {
        if (form[field.name] && form[field.name] !== "") {
          formData.append(field.name, form[field.name]);
        }
      });
    }

    console.log("Sending amount:", amount); // Debug log
    
    const response = await axios.post(
      `http://localhost:7700/api/register/${workshopId}/register`,
      formData,
      {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      }
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

  if (loadingWorkshop) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="spinner border-4 border-blue-500 border-t-transparent rounded-full w-12 h-12 animate-spin mx-auto"></div>
          <p className="mt-4 text-gray-600">Loading workshop details...</p>
        </div>
      </div>
    );
  }

  if (!workshop) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center p-6 bg-white rounded-lg shadow-md max-w-md">
          <h2 className="text-2xl font-bold text-red-600 mb-4">Error</h2>
          <p className="mb-4">{error || "Workshop not found"}</p>
          <a
            href="/workshops"
            className="bg-blue-600 text-white py-2 px-4 rounded-lg font-semibold hover:bg-blue-700 transition"
          >
            Browse Workshops
          </a>
        </div>
      </div>
    );
  }

  // UPI QR code value with dynamic price
  const upiValue = `upi://pay?pa=kprahul1143@okaxis&pn=Roriri&am=${workshop.price}&cu=INR`;

  return (
    <motion.div
      initial={{ opacity: 0, y: 40 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6, ease: "easeOut" }}
      className="min-h-screen flex flex-col items-center justify-center bg-gray-50"
    >
      <motion.div
        initial={{ scale: 0.95, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        transition={{ duration: 0.5, delay: 0.2 }}
        className="bg-white p-8 rounded-xl shadow-2xl w-full max-w-md"
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
              Thank you for registering for {workshop.title}. We've sent a confirmation to your email.
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
              initial={{ opacity: 0, y: -20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.3 }}
              className="text-3xl font-extrabold mb-6 text-center text-blue-700"
            >
              {workshop.title} Registration
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

            <motion.form
              onSubmit={handleSubmit}
              className="space-y-4"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.5, delay: 0.5 }}
            >
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
                className="w-full px-3 py-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
              <input
                type="text"
                name="department"
                placeholder="Department"
                value={form.department}
                onChange={handleChange}
                className="w-full px-3 py-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
              <input
                type="text"
                name="year"
                placeholder="Year"
                value={form.year}
                onChange={handleChange}
                className="w-full px-3 py-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
              />

              {/* Dynamic fields from `formData` */}
              {workshop.formFields && workshop.formFields.map((field, index) => (
                <div key={index}>
                  <label className="block text-sm mb-1 font-medium text-gray-700">
                    {field.label}
                  </label>
                  {field.type === "text" && (
                    <input
                      type="text"
                      name={field.name}
                      placeholder={field.placeholder}
                      value={form[field.name] || ""}
                      onChange={handleChange}
                      required={field.required}
                      className="w-full px-3 py-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                  )}
                  {field.type === "select" && (
                    <select
                      name={field.name}
                      value={form[field.name] || ""}
                      onChange={handleChange}
                      required={field.required}
                      className="w-full px-3 py-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
                    >
                      <option value="">{field.placeholder}</option>
                      {field.options.map((option, idx) => (
                        <option key={idx} value={option.value}>
                          {option.label}
                        </option>
                      ))}
                    </select>
                  )}
                </div>
              ))}

              <motion.div
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.5, delay: 0.4 }}
                className="flex flex-col items-center mb-6"
              >
                <QRCodeCanvas value={upiValue} size={200} level="H" />
                <span className="text-sm text-gray-600 mt-2">
                  Scan QR to pay{" "}
                  <span className="font-semibold text-blue-700">₹{workshop.price}</span> via UPI
                </span>
              </motion.div>

              <input
                type="text"
                name="upiId"
                placeholder="Your UPI ID (used for payment)"
                value={form.upiId}
                onChange={handleChange}
                required
                className="w-full px-3 py-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
              />

              <div>
                <label className="block text-sm mb-1 font-medium text-gray-700">
                  Payment Screenshot (required)
                </label>
                <input
                  type="file"
                  name="paymentProof"
                  accept="image/*"
                  onChange={handleChange}
                  required
                  className="w-full"
                />
              </div>

              <motion.button
                type="submit"
                disabled={isSubmitting}
                whileHover={{ scale: 1.04 }}
                whileTap={{ scale: 0.98 }}
                className={`w-full bg-blue-600 text-white py-2 rounded-lg font-semibold hover:bg-blue-700 transition ${
                  isSubmitting ? "opacity-70 cursor-not-allowed" : ""
                }`}
              >
                {isSubmitting ? "Processing..." : "Register"}
              </motion.button>
            </motion.form>
          </>
        )}
      </motion.div>
    </motion.div>
  );
};

export default WorkShopForm;