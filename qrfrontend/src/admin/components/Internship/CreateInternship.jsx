import { useState } from "react";

const CreateInternshipForm = ({ onCreateInternship, setView }) => {
    const [admin] = useState(() => {
    const data = localStorage.getItem("adminUser");
    return data ? JSON.parse(data) : null;
  });
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    startDate: '',
    endDate: '',
    startTime: '09:00',
    endTime: '17:00',
    maxSeats: 100,
    price: 0,
    totalAmount: '',
    deliveryMode: 'OFFLINE',
    venue: '',
    meetingLink: '',
    posterImage: '',
    supervisor: '',
    supervisorBio: '',
    incharge: '',
    isActive: true,
  });

  const [errors, setErrors] = useState({});

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : 
              type === 'number' ? parseFloat(value) || 0 : 
              value
    }));

    // Clear error when field is updated
    if (errors[name]) {
      setErrors(prev => ({ ...prev, [name]: null }));
    }

    // Auto-calculate total amount when price changes if total amount is empty
    if (name === 'price' && !formData.totalAmount) {
      const price = parseFloat(value) || 0;
      const totalWithGST = Math.round((price * 1.18) * 100) / 100;
      setFormData(prev => ({ ...prev, totalAmount: totalWithGST }));
    }
  };

  const validateForm = () => {
    const newErrors = {};

    // Basic validation
    if (!formData.title.trim()) newErrors.title = "Title is required";
    if (!formData.description.trim()) newErrors.description = "Description is required";
    if (!formData.startDate) newErrors.startDate = "Start date is required";
    if (!formData.endDate) newErrors.endDate = "End date is required";

    // Date validation
    if (formData.startDate && formData.endDate) {
      const startDate = new Date(formData.startDate);
      const endDate = new Date(formData.endDate);
      if (startDate >= endDate) {
        newErrors.endDate = "End date must be after start date";
      }
    }

    // Delivery mode validation
    if (formData.deliveryMode === 'OFFLINE' && !formData.venue.trim()) {
      newErrors.venue = "Venue is required for offline internships";
    }
    if (formData.deliveryMode === 'ONLINE' && !formData.meetingLink.trim()) {
      newErrors.meetingLink = "Meeting link is required for online internships";
    }

    // Price validation
    if (formData.price < 0) newErrors.price = "Price cannot be negative";
    if (formData.totalAmount && formData.totalAmount < formData.price) {
      newErrors.totalAmount = "Total amount cannot be less than base price";
    }

    // Seats validation
    if (formData.maxSeats < 1) newErrors.maxSeats = "Maximum seats must be at least 1";

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!validateForm()) {
      return;
    }
    
    try {
      // Create the payload with required fields
      const payload = {
        title: formData.title.trim(),
        description: formData.description.trim(),
        startDate: formData.startDate,
        endDate: formData.endDate,
        startTime: formData.startTime,
        endTime: formData.endTime,
        maxSeats: parseInt(formData.maxSeats) || 100,
        price: parseFloat(formData.price) || 0,
        totalAmount: formData.totalAmount ? parseFloat(formData.totalAmount) : undefined,
        deliveryMode: formData.deliveryMode,
        venue: formData.venue.trim() || null,
        meetingLink: formData.meetingLink.trim() || null,
        posterImage: formData.posterImage.trim() || null,
        supervisor: formData.supervisor.trim() || null,
        supervisorBio: formData.supervisorBio.trim() || null,
        incharge: formData.incharge.trim() || null,
        isActive: formData.isActive,
        createdBy: admin.id, // Replace with actual admin ID from context
      };
      
      await onCreateInternship(payload);
      
      // Reset form on success
      setFormData({
        title: '',
        description: '',
        startDate: '',
        endDate: '',
        startTime: '09:00',
        endTime: '17:00',
        maxSeats: 100,
        price: 0,
        totalAmount: '',
        deliveryMode: 'OFFLINE',
        venue: '',
        meetingLink: '',
        posterImage: '',
        supervisor: '',
        supervisorBio: '',
        incharge: '',
        isActive: true,
      });
      
      setView('internships');
    } catch (error) {
      console.error("Failed to create internship:", error);
      alert(`Failed to create internship: ${error.message || 'Please try again.'}`);
    }
  };

  return (
    <div className="p-6 bg-white shadow rounded-lg">
      <h2 className="text-2xl font-bold text-gray-800 mb-6">Create New Internship</h2>
      <form onSubmit={handleSubmit} className="space-y-8">
        
        {/* Basic Information */}
        <div className="space-y-4">
          <h3 className="text-lg font-medium text-gray-900 border-b pb-2">Basic Information</h3>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label htmlFor="title" className="block text-sm font-medium text-gray-700">Internship Title *</label>
              <input
                type="text"
                id="title"
                name="title"
                value={formData.title}
                onChange={handleChange}
                className={`mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 ${
                  errors.title ? 'border-red-500' : ''
                }`}
              />
              {errors.title && <p className="mt-1 text-sm text-red-600">{errors.title}</p>}
            </div>
            <div>
              <label htmlFor="posterImage" className="block text-sm font-medium text-gray-700">Poster Image URL</label>
              <input
                type="url"
                id="posterImage"
                name="posterImage"
                value={formData.posterImage}
                onChange={handleChange}
                placeholder="https://example.com/poster.jpg"
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
              />
            </div>
          </div>
          
          <div>
            <label htmlFor="description" className="block text-sm font-medium text-gray-700">Description *</label>
            <textarea
              id="description"
              name="description"
              value={formData.description}
              onChange={handleChange}
              rows="4"
              className={`mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 ${
                errors.description ? 'border-red-500' : ''
              }`}
            />
            {errors.description && <p className="mt-1 text-sm text-red-600">{errors.description}</p>}
          </div>
        </div>
        
        {/* Schedule Information */}
        <div className="space-y-4">
          <h3 className="text-lg font-medium text-gray-900 border-b pb-2">Schedule</h3>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label htmlFor="startDate" className="block text-sm font-medium text-gray-700">Start Date *</label>
              <input
                type="date"
                id="startDate"
                name="startDate"
                value={formData.startDate}
                onChange={handleChange}
                className={`mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 ${
                  errors.startDate ? 'border-red-500' : ''
                }`}
              />
              {errors.startDate && <p className="mt-1 text-sm text-red-600">{errors.startDate}</p>}
            </div>
            <div>
              <label htmlFor="endDate" className="block text-sm font-medium text-gray-700">End Date *</label>
              <input
                type="date"
                id="endDate"
                name="endDate"
                value={formData.endDate}
                onChange={handleChange}
                className={`mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 ${
                  errors.endDate ? 'border-red-500' : ''
                }`}
              />
              {errors.endDate && <p className="mt-1 text-sm text-red-600">{errors.endDate}</p>}
            </div>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label htmlFor="startTime" className="block text-sm font-medium text-gray-700">Start Time</label>
              <input
                type="time"
                id="startTime"
                name="startTime"
                value={formData.startTime}
                onChange={handleChange}
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
              />
            </div>
            <div>
              <label htmlFor="endTime" className="block text-sm font-medium text-gray-700">End Time</label>
              <input
                type="time"
                id="endTime"
                name="endTime"
                value={formData.endTime}
                onChange={handleChange}
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
              />
            </div>
          </div>
        </div>

        {/* Delivery Mode */}
        <div className="space-y-4">
          <h3 className="text-lg font-medium text-gray-900 border-b pb-2">Delivery Mode</h3>
          
          <div>
            <label htmlFor="deliveryMode" className="block text-sm font-medium text-gray-700">Delivery Mode *</label>
            <select
              id="deliveryMode"
              name="deliveryMode"
              value={formData.deliveryMode}
              onChange={handleChange}
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
            >
              <option value="OFFLINE">Offline (In-person)</option>
              <option value="ONLINE">Online (Virtual)</option>
              <option value="HYBRID">Hybrid (Both)</option>
            </select>
          </div>

          {formData.deliveryMode === 'OFFLINE' && (
            <div>
              <label htmlFor="venue" className="block text-sm font-medium text-gray-700">Venue *</label>
              <input
                type="text"
                id="venue"
                name="venue"
                value={formData.venue}
                onChange={handleChange}
                placeholder="Enter venue address"
                className={`mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 ${
                  errors.venue ? 'border-red-500' : ''
                }`}
              />
              {errors.venue && <p className="mt-1 text-sm text-red-600">{errors.venue}</p>}
            </div>
          )}

          {formData.deliveryMode === 'ONLINE' && (
            <div>
              <label htmlFor="meetingLink" className="block text-sm font-medium text-gray-700">Meeting Link *</label>
              <input
                type="url"
                id="meetingLink"
                name="meetingLink"
                value={formData.meetingLink}
                onChange={handleChange}
                placeholder="https://zoom.us/meeting-link"
                className={`mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 ${
                  errors.meetingLink ? 'border-red-500' : ''
                }`}
              />
              {errors.meetingLink && <p className="mt-1 text-sm text-red-600">{errors.meetingLink}</p>}
            </div>
          )}

          {formData.deliveryMode === 'HYBRID' && (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label htmlFor="venue" className="block text-sm font-medium text-gray-700">Venue</label>
                <input
                  type="text"
                  id="venue"
                  name="venue"
                  value={formData.venue}
                  onChange={handleChange}
                  placeholder="Enter venue address"
                  className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
                />
              </div>
              <div>
                <label htmlFor="meetingLink" className="block text-sm font-medium text-gray-700">Meeting Link</label>
                <input
                  type="url"
                  id="meetingLink"
                  name="meetingLink"
                  value={formData.meetingLink}
                  onChange={handleChange}
                  placeholder="https://zoom.us/meeting-link"
                  className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
                />
              </div>
            </div>
          )}
        </div>

        {/* Instructor Information */}
        <div className="space-y-4">
          <h3 className="text-lg font-medium text-gray-900 border-b pb-2">Instructor Information</h3>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label htmlFor="teacher" className="block text-sm font-medium text-gray-700">Teacher/Instructor</label>
              <input
                type="text"
                id="teacher"
                name="teacher"
                value={formData.supervisor}
                onChange={handleChange}
                placeholder="Enter instructor name"
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
              />
            </div>
            <div>
              <label htmlFor="incharge" className="block text-sm font-medium text-gray-700">Internship Coordinator</label>
              <input
                type="text"
                id="incharge"
                name="incharge"
                value={formData.incharge}
                onChange={handleChange}
                placeholder="Enter coordinator name"
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
              />
            </div>
          </div>

          <div>
            <label htmlFor="teacherBio" className="block text-sm font-medium text-gray-700">Teacher Biography</label>
            <textarea
              id="teacherBio"
              name="teacherBio"
              value={formData.supervisorBio}
              onChange={handleChange}
              rows="3"
              placeholder="Brief biography of the instructor"
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
            />
          </div>
        </div>
        
        {/* Internship Settings */}
        <div className="space-y-4">
          <h3 className="text-lg font-medium text-gray-900 border-b pb-2">Internship Settings</h3>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div>
              <label htmlFor="maxSeats" className="block text-sm font-medium text-gray-700">Max Seats *</label>
              <input
                type="number"
                id="maxSeats"
                name="maxSeats"
                value={formData.maxSeats}
                onChange={handleChange}
                min="1"
                className={`mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 ${
                  errors.maxSeats ? 'border-red-500' : ''
                }`}
              />
              {errors.maxSeats && <p className="mt-1 text-sm text-red-600">{errors.maxSeats}</p>}
            </div>
            <div>
              <label htmlFor="price" className="block text-sm font-medium text-gray-700">Base Price *</label>
              <input
                type="number"
                id="price"
                name="price"
                value={formData.price}
                onChange={handleChange}
                min="0"
                step="0.01"
                className={`mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 ${
                  errors.price ? 'border-red-500' : ''
                }`}
              />
              {errors.price && <p className="mt-1 text-sm text-red-600">{errors.price}</p>}
            </div>
            <div>
              <label htmlFor="totalAmount" className="block text-sm font-medium text-gray-700">Total Amount</label>
              <input
                type="number"
                id="totalAmount"
                name="totalAmount"
                value={formData.totalAmount}
                onChange={handleChange}
                min="0"
                step="0.01"
                placeholder="Including taxes/fees"
                className={`mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 ${
                  errors.totalAmount ? 'border-red-500' : ''
                }`}
              />
              {errors.totalAmount && <p className="mt-1 text-sm text-red-600">{errors.totalAmount}</p>}
              <p className="mt-1 text-xs text-gray-500">
                Auto-calculated with 18% GST if left empty
              </p>
            </div>
          </div>
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
        
        <div className="flex justify-end space-x-3 mt-6 pt-6 border-t border-gray-200">
          <button
            type="button"
            onClick={() => setView('internships')}
            className="px-4 py-2 text-sm font-medium text-gray-700 bg-gray-200 rounded-md hover:bg-gray-300"
          >
            Cancel
          </button>
          <button
            type="submit"
            className="px-4 py-2 text-sm font-medium text-white bg-indigo-600 rounded-md hover:bg-indigo-700"
          >
            Create Internship
          </button>
        </div>
      </form>
    </div>
  );
};

export default CreateInternshipForm;