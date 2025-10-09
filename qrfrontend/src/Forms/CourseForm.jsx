import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import axios from "axios";
import { useParams, useNavigate } from "react-router-dom";
import { 
  User, 
  Mail, 
  Phone, 
  School, 
  BookOpen, 
  Calendar,
  CheckCircle,
  AlertCircle,
  Loader2,
  ArrowLeft,
  GraduationCap
} from "lucide-react";

const CourseForm = () => {
  const { id: courseId } = useParams();
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
  const [course, setCourse] = useState(null);
  const [loadingCourse, setLoadingCourse] = useState(true);
  const [focusedField, setFocusedField] = useState(null);

  useEffect(() => {
    const fetchCourse = async () => {
      setLoadingCourse(true);
      try {
        const response = await axios.get(
          `http://localhost:7700/api/courses/${courseId}`
        );
        setCourse(response.data);
      } catch (err) {
        setError(err.message || "Failed to fetch course details");
        navigate("/courses");
      } finally {
        setLoadingCourse(false);
      }
    };

    if (courseId) {
      fetchCourse();
    } else {
      setError("No course ID provided");
      setLoadingCourse(false);
    }
  }, [courseId, navigate]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!course) {
      setError("Course information not loaded");
      return;
    }

    setIsSubmitting(true);
    setError(null);

    try {
      const response = await axios.post(
        `http://localhost:7700/api/courses/${courseId}/register`,
        { ...form, courseId }
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

  if (loadingCourse) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50 flex items-center justify-center">
        <motion.div 
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          className="text-center"
        >
          <div className="relative">
            <div className="w-20 h-20 border-4 border-indigo-200 rounded-full"></div>
            <div className="w-20 h-20 border-4 border-indigo-600 border-t-transparent rounded-full animate-spin absolute top-0"></div>
          </div>
          <p className="mt-6 text-gray-600 font-medium">Loading course details...</p>
        </motion.div>
      </div>
    );
  }

  if (!course) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-red-50 to-pink-50 flex items-center justify-center p-4">
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center p-8 bg-white rounded-2xl shadow-2xl max-w-md"
        >
          <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <AlertCircle className="w-8 h-8 text-red-600" />
          </div>
          <h2 className="text-2xl font-bold text-gray-800 mb-2">Course Not Found</h2>
          <p className="text-gray-600 mb-6">{error || "The course you're looking for doesn't exist"}</p>
          <button
            onClick={() => navigate("/courses")}
            className="bg-gradient-to-r from-indigo-600 to-purple-600 text-white py-3 px-6 rounded-xl font-semibold hover:shadow-lg transform hover:-translate-y-0.5 transition-all duration-200"
          >
            Browse Courses
          </button>
        </motion.div>
      </div>
    );
  }

  const inputFields = [
    { name: "fullName", placeholder: "Full Name", icon: User, type: "text" },
    { name: "email", placeholder: "Email Address", icon: Mail, type: "email" },
    { name: "phone", placeholder: "Phone Number", icon: Phone, type: "tel" },
    { name: "collegeName", placeholder: "College Name", icon: School, type: "text" },
    { name: "department", placeholder: "Department", icon: BookOpen, type: "text" },
    { name: "year", placeholder: "Year of Study", icon: Calendar, type: "text" },
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50 py-12 px-4">
      <div className="max-w-6xl mx-auto">
        <motion.button
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          onClick={() => navigate("/courses")}
          className="mb-8 flex items-center gap-2 text-gray-600 hover:text-gray-800 transition-colors"
        >
          <ArrowLeft className="w-5 h-5" />
          <span className="font-medium">Back to Courses</span>
        </motion.button>

        <div className="grid lg:grid-cols-2 gap-8">
          <motion.div
            initial={{ opacity: 0, x: -30 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.5 }}
            className="bg-white rounded-3xl shadow-xl p-8 h-fit"
          >
            <div className="flex items-center gap-4 mb-6">
              <div className="w-12 h-12 bg-gradient-to-br from-indigo-500 to-purple-600 rounded-2xl flex items-center justify-center">
                <GraduationCap className="w-6 h-6 text-white" />
              </div>
              <div>
                <h3 className="text-sm text-gray-500 font-medium">You're registering for</h3>
                <h2 className="text-2xl font-bold text-gray-800">{course?.data?.title}</h2>
              </div>
            </div>

            {course?.data?.description && (
              <div className="mb-6">
                <h4 className="text-sm font-semibold text-gray-500 mb-2">About this course</h4>
                <p className="text-gray-700 leading-relaxed">{course.data.description}</p>
              </div>
            )}

            <div className="space-y-4 pt-6 border-t border-gray-100">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-blue-50 rounded-xl flex items-center justify-center">
                  <Calendar className="w-5 h-5 text-blue-600" />
                </div>
                <div>
                  <p className="text-sm text-gray-500">Duration</p>
                  <p className="font-semibold text-gray-800">{course?.data?.duration || "Self-paced"}</p>
                </div>
              </div>

              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-green-50 rounded-xl flex items-center justify-center">
                  <CheckCircle className="w-5 h-5 text-green-600" />
                </div>
                <div>
                  <p className="text-sm text-gray-500">Level</p>
                  <p className="font-semibold text-gray-800">{course?.data?.level || "All Levels"}</p>
                </div>
              </div>
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, x: 30 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.5 }}
            className="bg-white rounded-3xl shadow-xl p-8"
          >
            <AnimatePresence mode="wait">
              {success ? (
                <motion.div
                  key="success"
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.9 }}
                  className="text-center py-12"
                >
                  <motion.div
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                    transition={{ type: "spring", duration: 0.5 }}
                    className="w-20 h-20 bg-gradient-to-br from-green-400 to-emerald-600 rounded-full flex items-center justify-center mx-auto mb-6"
                  >
                    <CheckCircle className="w-10 h-10 text-white" />
                  </motion.div>
                  <h2 className="text-3xl font-bold mb-3 bg-gradient-to-r from-green-600 to-emerald-600 bg-clip-text text-transparent">
                    {success.message}
                  </h2>
                  <p className="text-gray-600 mb-8">
                    Thank you for registering for <span className="font-semibold">{course.data.title}</span>. 
                    We've sent a confirmation to your email.
                  </p>
                  <button
                    onClick={() => {
                      setSuccess(false);
                      setForm({
                        fullName: "",
                        email: "",
                        phone: "",
                        collegeName: "",
                        department: "",
                        year: "",
                      });
                    }}
                    className="bg-gradient-to-r from-indigo-600 to-purple-600 text-white py-3 px-8 rounded-xl font-semibold hover:shadow-lg transform hover:-translate-y-0.5 transition-all duration-200"
                  >
                    Register Another Student
                  </button>
                </motion.div>
              ) : (
                <motion.div key="form">
                  <h2 className="text-2xl font-bold mb-2 text-gray-800">
                    Complete Your Registration
                  </h2>
                  <p className="text-gray-600 mb-6">Fill in your details to secure your spot</p>

                  <AnimatePresence>
                    {error && (
                      <motion.div
                        initial={{ opacity: 0, y: -10 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -10 }}
                        className="mb-6 p-4 bg-red-50 border border-red-200 text-red-700 rounded-xl flex items-start gap-3"
                      >
                        <AlertCircle className="w-5 h-5 mt-0.5 flex-shrink-0" />
                        <span className="text-sm">{error}</span>
                      </motion.div>
                    )}
                  </AnimatePresence>

                  <form onSubmit={handleSubmit} className="space-y-4">
                    {inputFields.map((field, index) => {
                      const Icon = field.icon;
                      return (
                        <motion.div
                          key={field.name}
                          initial={{ opacity: 0, y: 20 }}
                          animate={{ opacity: 1, y: 0 }}
                          transition={{ delay: index * 0.05 }}
                          className="relative"
                        >
                          <div className={`relative rounded-xl transition-all duration-200 ${
                            focusedField === field.name 
                              ? 'ring-2 ring-indigo-500 ring-opacity-50' 
                              : ''
                          }`}>
                            <Icon className={`absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 transition-colors ${
                              focusedField === field.name ? 'text-indigo-600' : 'text-gray-400'
                            }`} />
                            <input
                              type={field.type}
                              name={field.name}
                              placeholder={field.placeholder}
                              value={form[field.name]}
                              onChange={handleChange}
                              onFocus={() => setFocusedField(field.name)}
                              onBlur={() => setFocusedField(null)}
                              required
                              className="w-full pl-12 pr-4 py-3.5 border border-gray-200 rounded-xl focus:outline-none focus:border-indigo-500 transition-colors bg-gray-50 focus:bg-white"
                            />
                          </div>
                        </motion.div>
                      );
                    })}

                    <motion.button
                      type="submit"
                      disabled={isSubmitting}
                      whileHover={{ scale: isSubmitting ? 1 : 1.02 }}
                      whileTap={{ scale: isSubmitting ? 1 : 0.98 }}
                      className={`w-full bg-gradient-to-r from-indigo-600 to-purple-600 text-white py-4 rounded-xl font-semibold transition-all duration-200 flex items-center justify-center gap-2 ${
                        isSubmitting 
                          ? "opacity-70 cursor-not-allowed" 
                          : "hover:shadow-lg hover:-translate-y-0.5"
                      }`}
                    >
                      {isSubmitting ? (
                        <>
                          <Loader2 className="w-5 h-5 animate-spin" />
                          <span>Processing Registration...</span>
                        </>
                      ) : (
                        <span>Complete Registration</span>
                      )}
                    </motion.button>
                  </form>
                </motion.div>
              )}
            </AnimatePresence>
          </motion.div>
        </div>
      </div>
    </div>
  );
};

export default CourseForm;