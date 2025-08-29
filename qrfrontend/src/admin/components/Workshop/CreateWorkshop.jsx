import { useState } from "react";

const CreateWorkshopForm = ({ onCreateWorkshop, setView }) => {
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    startDate: '',
    endDate: '',
    startTime: '09:00',
    endTime: '17:00',
    maxSeats: 50,
    price: 0,
    totalAmount: 0,
    deliveryMode: 'OFFLINE',
    venue: '',
    meetingLink: '',
    posterImage: '',
    teacher: '',
    teacherBio: '',
    incharge: '',
    isActive: true,
  });

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData(prev => ({
      ...prev,
      // For number inputs, parse the value to an integer or float
      [name]: type === 'number' ? parseFloat(value) : value,
      // For checkboxes, use the checked value
      [name]: type === 'checkbox' ? checked : value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      // Calculate total amount if not provided
      const finalData = {
        ...formData,
        totalAmount: formData.totalAmount || formData.price,
        createdBy: localStorage.getItem('adminUser') ? JSON.parse(localStorage.getItem('adminUser')).id : null
      };
      
      // Await the workshop creation
      await onCreateWorkshop(finalData);
      // Only reset the form on success
      setFormData({
        title: '',
        description: '',
        startDate: '',
        endDate: '',
        startTime: '09:00',
        endTime: '17:00',
        maxSeats: 50,
        price: 0,
        totalAmount: 0,
        deliveryMode: 'OFFLINE',
        venue: '',
        meetingLink: '',
        posterImage: '',
        teacher: '',
        teacherBio: '',
        incharge: '',
        isActive: true,
      });
      // Optionally, navigate back to the workshops view
      setView('workshops');
    } catch (error) {
      // If the creation fails, do not reset the form
      // Log the error to the console or show a user-facing message
      console.error("Failed to create workshop:", error);
      alert("Failed to create workshop. Please try again.");
    }
  };

  return (
    <div className="p-6 bg-white shadow rounded-lg">
      <h2 className="text-2xl font-bold text-gray-800 mb-6">Create New Workshop</h2>
      <form onSubmit={handleSubmit} className="space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label htmlFor="title" className="block text-sm font-medium text-gray-700">Workshop Title *</label>
            <input
              type="text"
              id="title"
              name="title"
              value={formData.title}
              onChange={handleChange}
              required
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
            />
          </div>
          <div>
            <label htmlFor="price" className="block text-sm font-medium text-gray-700">Price (₹) *</label>
            <input
              type="number"
              id="price"
              name="price"
              value={formData.price}
              onChange={handleChange}
              min="0"
              required
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
            />
          </div>
        </div>

        <div>
          <label htmlFor="description" className="block text-sm font-medium text-gray-700">Description</label>
          <textarea
            id="description"
            name="description"
            value={formData.description}
            onChange={handleChange}
            rows={3}
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
          />
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label htmlFor="startDate" className="block text-sm font-medium text-gray-700">Start Date *</label>
            <input
              type="date"
              id="startDate"
              name="startDate"
              value={formData.startDate}
              onChange={handleChange}
              required
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
            />
          </div>
          <div>
            <label htmlFor="endDate" className="block text-sm font-medium text-gray-700">End Date *</label>
            <input
              type="date"
              id="endDate"
              name="endDate"
              value={formData.endDate}
              onChange={handleChange}
              required
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
            />
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label htmlFor="startTime" className="block text-sm font-medium text-gray-700">Start Time *</label>
            <input
              type="time"
              id="startTime"
              name="startTime"
              value={formData.startTime}
              onChange={handleChange}
              required
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
            />
          </div>
          <div>
            <label htmlFor="endTime" className="block text-sm font-medium text-gray-700">End Time *</label>
            <input
              type="time"
              id="endTime"
              name="endTime"
              value={formData.endTime}
              onChange={handleChange}
              required
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
            />
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label htmlFor="maxSeats" className="block text-sm font-medium text-gray-700">Max Seats *</label>
            <input
              type="number"
              id="maxSeats"
              name="maxSeats"
              value={formData.maxSeats}
              onChange={handleChange}
              min="1"
              required
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
            />
          </div>
          <div>
            <label htmlFor="totalAmount" className="block text-sm font-medium text-gray-700">Total Amount (₹)</label>
            <input
              type="number"
              id="totalAmount"
              name="totalAmount"
              value={formData.totalAmount}
              onChange={handleChange}
              min="0"
              placeholder="Auto-calculated from price"
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
            />
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label htmlFor="deliveryMode" className="block text-sm font-medium text-gray-700">Delivery Mode *</label>
            <select
              id="deliveryMode"
              name="deliveryMode"
              value={formData.deliveryMode}
              onChange={handleChange}
              required
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
            >
              <option value="OFFLINE">Offline</option>
              <option value="ONLINE">Online</option>
              <option value="HYBRID">Hybrid</option>
            </select>
          </div>
          <div>
            <label htmlFor="venue" className="block text-sm font-medium text-gray-700">Venue</label>
            <input
              type="text"
              id="venue"
              name="venue"
              value={formData.venue}
              onChange={handleChange}
              placeholder="Physical venue for offline mode"
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
            />
          </div>
        </div>

        <div>
          <label htmlFor="meetingLink" className="block text-sm font-medium text-gray-700">Meeting Link</label>
          <input
            type="url"
            id="meetingLink"
            name="meetingLink"
            value={formData.meetingLink}
            onChange={handleChange}
            placeholder="Meeting link for online mode"
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
          />
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label htmlFor="teacher" className="block text-sm font-medium text-gray-700">Primary Teacher</label>
            <input
              type="text"
              id="teacher"
              name="teacher"
              value={formData.teacher}
              onChange={handleChange}
              placeholder="Primary teacher/instructor name"
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
            />
          </div>
          <div>
            <label htmlFor="incharge" className="block text-sm font-medium text-gray-700">Program Incharge</label>
            <input
              type="text"
              id="incharge"
              name="incharge"
              value={formData.incharge}
              onChange={handleChange}
              placeholder="Program coordinator/incharge"
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
            />
          </div>
        </div>

        <div>
          <label htmlFor="teacherBio" className="block text-sm font-medium text-gray-700">Teacher Biography</label>
          <textarea
            id="teacherBio"
            name="teacherBio"
            value={formData.teacherBio}
            onChange={handleChange}
            rows={3}
            placeholder="Teacher biography and qualifications"
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
          />
        </div>

        <div>
          <label htmlFor="posterImage" className="block text-sm font-medium text-gray-700">Poster Image URL</label>
          <input
            type="url"
            id="posterImage"
            name="posterImage"
            value={formData.posterImage}
            onChange={handleChange}
            placeholder="Poster image URL/path"
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
          />
        </div>

        <div className="flex items-center space-x-2">
          <input
            type="checkbox"
            id="isActive"
            name="isActive"
            checked={formData.isActive}
            onChange={handleChange}
            className="rounded text-indigo-600 focus:ring-indigo-500"
          />
          <label htmlFor="isActive" className="text-sm font-medium text-gray-700">Set as Active</label>
        </div>

        <div className="flex justify-end space-x-3 mt-6">
          <button
            type="button"
            onClick={() => setView('workshops')}
            className="px-4 py-2 text-sm font-medium text-gray-700 bg-gray-200 rounded-md hover:bg-gray-300"
          >
            Cancel
          </button>
          <button
            type="submit"
            className="px-4 py-2 text-sm font-medium text-white bg-indigo-600 rounded-md hover:bg-indigo-700"
          >
            Create Workshop
          </button>
        </div>
      </form>
    </div>
  );
};

export default CreateWorkshopForm;