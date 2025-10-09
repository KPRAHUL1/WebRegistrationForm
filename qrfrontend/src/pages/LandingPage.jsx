import React, { useState } from "react";
import { motion as Motion } from "framer-motion";
import { useNavigate } from "react-router-dom";
import { logo } from "../assets/logo/logo";

const options = [
   { label: "-Select Program-", value: "" },
  { label: "Workshop", value: "workshop" },
  { label: "Courses", value: "courses" },
  { label: "Internship", value: "internship" },
];

const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.2,
    },
  },
};

const itemVariants = {
  hidden: { y: 20, opacity: 0 },
  visible: {
    y: 0,
    opacity: 1,
    transition: {
      duration: 0.5,
    },
  },
};

export default function LandingPage() {
  const [selected, setSelected] = useState(options[0].value);
  const navigate = useNavigate();

  const handleContinue = () => {
    // Navigate directly to the workshops page or other selected section
    navigate(`/${selected}`);
  };

  return (
    <div className="min-h-screen flex flex-col items-center justify-center p-4  ">
      <Motion.div
        variants={containerVariants}
        initial="hidden"
        animate="visible"
        className="w-full max-w-md text-center"
      >
        {/* Logo & Title */}
        <Motion.div variants={itemVariants} className="mb-12">
          <img
            src={logo}
            alt="Company Logo"
            className="h-24 md:h-28 w-auto mx-auto mb-6"
          />
          <h1 className="text-4xl md:text-5xl font-bold mb-2">
            Welcome to Our Portal
          </h1>
          <p className="text-gray-400 text-md md:text-lg">
            Select your area of interest to get started
          </p>
        </Motion.div>

        {/* Dropdown + Button */}
        <Motion.div
          variants={itemVariants}
          className="bg-gray-800 rounded-xl shadow-2xl p-8"
        >
          <label
            htmlFor="interest-select"
            className="block mb-3 text-lg font-medium text-gray-400"
          >
            Choose a Section
          </label>
          <div className="relative">
            <select
              id="interest-select"
              value={selected}
              onChange={(e) => setSelected(e.target.value)}
              className="block w-full px-5 py-3 border border-gray-600 rounded-lg shadow-sm appearance-none focus:ring-4 focus:ring-purple-500 focus:outline-none focus:border-purple-500 transition duration-300 bg-gray-700 text-white"
            >
              {options.map((option) => (
                <option key={option.value} value={option.value} className="py-2">
                  {option.label}
                </option>
              ))}
            </select>
            <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-2 text-gray-400">
              <svg
                className="w-5 h-5"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  d="M19 9l-7 7-7-7"
                ></path>
              </svg>
            </div>
          </div>

          <Motion.button
            onClick={handleContinue}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            className={`mt-8 w-full bg-purple-600 text-white font-bold py-3 px-6 rounded-lg hover:bg-purple-700 active:bg-purple-800 shadow-lg transition-all duration-300`}
          >
            Continue
          </Motion.button>
        </Motion.div>
      </Motion.div>
    </div>
  );
}