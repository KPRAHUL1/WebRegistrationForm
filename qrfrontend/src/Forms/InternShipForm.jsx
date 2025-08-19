import React, { useState } from "react";

const InternshipForm = () => {
  const [form, setForm] = useState({
    fullName: "",
    email: "",
    phone: "",
    collegeName: "",
    department: "",
    year: "",
    internshipName: "",
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    // Submit logic here (API call)
    alert("Internship registration submitted!");
  };

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gray-50">
      <div className="bg-white p-8 rounded-lg shadow-md w-full max-w-md">
        <h2 className="text-2xl font-bold mb-6 text-center">Internship Registration</h2>
        <form onSubmit={handleSubmit} className="space-y-4">
          <input
            type="text"
            name="fullName"
            placeholder="Full Name"
            value={form.fullName}
            onChange={handleChange}
            required
            className="w-full px-3 py-2 border rounded"
          />
          <input
            type="email"
            name="email"
            placeholder="Email"
            value={form.email}
            onChange={handleChange}
            required
            className="w-full px-3 py-2 border rounded"
          />
          <input
            type="text"
            name="phone"
            placeholder="Phone"
            value={form.phone}
            onChange={handleChange}
            required
            className="w-full px-3 py-2 border rounded"
          />
          <input
            type="text"
            name="collegeName"
            placeholder="College Name"
            value={form.collegeName}
            onChange={handleChange}
            required
            className="w-full px-3 py-2 border rounded"
          />
          <input
            type="text"
            name="department"
            placeholder="Department"
            value={form.department}
            onChange={handleChange}
            required
            className="w-full px-3 py-2 border rounded"
          />
          <input
            type="text"
            name="year"
            placeholder="Year"
            value={form.year}
            onChange={handleChange}
            required
            className="w-full px-3 py-2 border rounded"
          />
          <input
            type="text"
            name="internshipName"
            placeholder="Internship Name"
            value={form.internshipName}
            onChange={handleChange}
            required
            className="w-full px-3 py-2 border rounded"
          />
          <button
            type="submit"
            className="w-full bg-blue-600 text-white py-2 rounded hover:bg-blue-700 transition"
          >
            Register
          </button>
        </form>
      </div>
    </div>
  );
};

export default InternshipForm;