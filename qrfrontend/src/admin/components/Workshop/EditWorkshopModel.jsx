import React, { useState, useEffect } from 'react';
import { workshopService } from '../../api/WorkshopApi';

const EditWorkshopModal = ({ isOpen, onClose, workshop, onSave }) => {
    const [formData, setFormData] = useState({
        title: '',
        description: '',
        startDate: '',
        endDate: '',
        startTime: '10:00',
        endTime: '17:00',
        price: 0,
        totalAmount: 0,
        maxSeats: 50,
        isActive: true,
        deliveryMode: 'OFFLINE',
        venue: '',
        meetingLink: '',
        teacher: '',
        teacherBio: '',
        incharge: '',
        posterImage: null
    });
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState('');
    const [posterPreview, setPosterPreview] = useState(null);

    useEffect(() => {
        if (workshop) {
            const formattedData = {
                ...workshop,
                startDate: workshop.startDate ? new Date(workshop.startDate).toISOString().split('T')[0] : '',
                endDate: workshop.endDate ? new Date(workshop.endDate).toISOString().split('T')[0] : '',
                price: workshop.price || 0,
                totalAmount: workshop.totalAmount || workshop.price || 0,
                maxSeats: workshop.maxSeats || 50,
                deliveryMode: workshop.deliveryMode || 'OFFLINE',
                venue: workshop.venue || '',
                meetingLink: workshop.meetingLink || '',
                teacher: workshop.teacher || '',
                teacherBio: workshop.teacherBio || '',
                incharge: workshop.incharge || '',
                posterImage: null // Reset file input
            };
            setFormData(formattedData);
            
            if (workshop.posterImage) {
                setPosterPreview(`http://localhost:7700${workshop.posterImage}`);
            }
        }
    }, [workshop]);

    const handleChange = (e) => {
        const { name, value, type, checked, files } = e.target;
        
        if (type === 'file' && name === 'posterImage') {
            const file = files[0];
            setFormData(prev => ({
                ...prev,
                [name]: file
            }));
            
            // Create preview URL
            if (file) {
                const previewUrl = URL.createObjectURL(file);
                setPosterPreview(previewUrl);
            }
        } else {
            setFormData(prev => ({
                ...prev,
                [name]: type === 'checkbox' ? checked : value
            }));
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setIsLoading(true);
        setError('');

        if (!workshop || !workshop.id) {
            setError('Error: No workshop selected for update.');
            setIsLoading(false);
            return;
        }

        try {
            const formDataToSend = new FormData();

            Object.keys(formData).forEach(key => {
                if (key === 'posterImage' && formData[key]) {
                    formDataToSend.append('posterImage', formData[key]);
                } else if (key !== 'posterImage') {
                    formDataToSend.append(key, formData[key]);
                }
            });

            if (!formData.posterImage && workshop.posterImage) {
                formDataToSend.append('existingPosterImage', workshop.posterImage);
            }

            // Add other required fields
            formDataToSend.append('formFields', JSON.stringify(workshop?.formFields || null));
            formDataToSend.append('isArchived', workshop?.isArchived || false);
            
            const updatedWorkshop = await workshopService.updateWorkshopWithFile(workshop.id, formDataToSend);
            
            onSave(updatedWorkshop);
            onClose();
        } catch (err) {
            setError(err.response?.data?.message || err.message || 'Failed to update workshop');
        } finally {
            setIsLoading(false);
        }
    };
    useEffect(() => {
        return () => {
            if (posterPreview && posterPreview.startsWith('blob:')) {
                URL.revokeObjectURL(posterPreview);
            }
        };
    }, [posterPreview]);

    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex justify-center items-center p-4">
            <div className="bg-white p-6 rounded-lg shadow-xl w-full max-w-4xl max-h-[90vh] overflow-y-auto">
                <div className="flex justify-between items-center mb-6">
                    <h2 className="text-xl font-bold text-gray-900">Edit Workshop</h2>
                    <button
                        onClick={onClose}
                        className="text-gray-400 hover:text-gray-600 text-2xl"
                    >
                        &times;
                    </button>
                </div>

                {error && (
                    <div className="mb-4 p-3 bg-red-100 text-red-700 rounded-md">
                        {error}
                    </div>
                )}

                <form onSubmit={handleSubmit} className="space-y-6">
                    <div className="bg-gray-50 p-4 rounded-lg">
                        <h3 className="text-lg font-semibold mb-4 text-gray-800">Basic Information</h3>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <div>
                                <label className="block text-sm font-medium text-gray-700">Title *</label>
                                <input
                                    type="text"
                                    name="title"
                                    value={formData.title}
                                    onChange={handleChange}
                                    className="mt-1 block w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
                                    required
                                />
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-gray-700">Price (₹) *</label>
                                <input
                                    type="number"
                                    name="price"
                                    value={formData.price}
                                    onChange={handleChange}
                                    min="0"
                                    step="0.01"
                                    className="mt-1 block w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
                                    required
                                />
                            </div>
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-4">
                            <div>
                                <label className="block text-sm font-medium text-gray-700">Total Amount (₹)</label>
                                <input
                                    type="number"
                                    name="totalAmount"
                                    value={formData.totalAmount}
                                    onChange={handleChange}
                                    min="0"
                                    step="0.01"
                                    placeholder="Auto-calculated from price"
                                    className="mt-1 block w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
                                />
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-gray-700">Maximum Seats *</label>
                                <input
                                    type="number"
                                    name="maxSeats"
                                    value={formData.maxSeats}
                                    onChange={handleChange}
                                    min="1"
                                    className="mt-1 block w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
                                    required
                                />
                            </div>
                        </div>

                        <div className="mt-4">
                            <label className="block text-sm font-medium text-gray-700">Description *</label>
                            <textarea
                                name="description"
                                value={formData.description}
                                onChange={handleChange}
                                rows={3}
                                className="mt-1 block w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
                                required
                            />
                        </div>
                    </div>

                    <div className="bg-gray-50 p-4 rounded-lg">
                        <h3 className="text-lg font-semibold mb-4 text-gray-800">Schedule & Delivery</h3>
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                            <div>
                                <label className="block text-sm font-medium text-gray-700">Delivery Mode *</label>
                                <select
                                    name="deliveryMode"
                                    value={formData.deliveryMode}
                                    onChange={handleChange}
                                    className="mt-1 block w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
                                    required
                                >
                                    <option value="OFFLINE">Offline</option>
                                    <option value="ONLINE">Online</option>
                                    <option value="HYBRID">Hybrid</option>
                                </select>
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-gray-700">Start Date *</label>
                                <input
                                    type="date"
                                    name="startDate"
                                    value={formData.startDate}
                                    onChange={handleChange}
                                    className="mt-1 block w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
                                    required
                                />
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-gray-700">End Date *</label>
                                <input
                                    type="date"
                                    name="endDate"
                                    value={formData.endDate}
                                    onChange={handleChange}
                                    className="mt-1 block w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
                                    required
                                />
                            </div>
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-4">
                            <div>
                                <label className="block text-sm font-medium text-gray-700">Start Time</label>
                                <input
                                    type="time"
                                    name="startTime"
                                    value={formData.startTime}
                                    onChange={handleChange}
                                    className="mt-1 block w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
                                />
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-gray-700">End Time</label>
                                <input
                                    type="time"
                                    name="endTime"
                                    value={formData.endTime}
                                    onChange={handleChange}
                                    className="mt-1 block w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
                                />
                            </div>
                        </div>

                        {formData.deliveryMode === 'OFFLINE' || formData.deliveryMode === 'HYBRID' ? (
                            <div className="mt-4">
                                <label className="block text-sm font-medium text-gray-700">Venue</label>
                                <input
                                    type="text"
                                    name="venue"
                                    value={formData.venue}
                                    onChange={handleChange}
                                    placeholder="Enter venue address"
                                    className="mt-1 block w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
                                />
                            </div>
                        ) : null}

                        {formData.deliveryMode === 'ONLINE' || formData.deliveryMode === 'HYBRID' ? (
                            <div className="mt-4">
                                <label className="block text-sm font-medium text-gray-700">Meeting Link</label>
                                <input
                                    type="url"
                                    name="meetingLink"
                                    value={formData.meetingLink}
                                    onChange={handleChange}
                                    placeholder="Enter meeting link (Zoom, Meet, etc.)"
                                    className="mt-1 block w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
                                />
                            </div>
                        ) : null}
                    </div>

                    <div className="bg-gray-50 p-4 rounded-lg">
                        <h3 className="text-lg font-semibold mb-4 text-gray-800">Team Information</h3>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <div>
                                <label className="block text-sm font-medium text-gray-700">Teacher/Instructor</label>
                                <input
                                    type="text"
                                    name="teacher"
                                    value={formData.teacher}
                                    onChange={handleChange}
                                    placeholder="Enter teacher name"
                                    className="mt-1 block w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
                                />
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-gray-700">In-charge</label>
                                <input
                                    type="text"
                                    name="incharge"
                                    value={formData.incharge}
                                    onChange={handleChange}
                                    placeholder="Enter program coordinator name"
                                    className="mt-1 block w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
                                />
                            </div>
                        </div>

                        <div className="mt-4">
                            <label className="block text-sm font-medium text-gray-700">Teacher Bio</label>
                            <textarea
                                name="teacherBio"
                                value={formData.teacherBio}
                                onChange={handleChange}
                                rows={3}
                                placeholder="Enter teacher biography and credentials"
                                className="mt-1 block w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
                            />
                        </div>
                    </div>

                    <div className="bg-gray-50 p-4 rounded-lg">
                        <h3 className="text-lg font-semibold mb-4 text-gray-800">Media & Settings</h3>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <div>
                                <label className="block text-sm font-medium text-gray-700">Poster Image</label>
                                <input
                                    type="file"
                                    name="posterImage"
                                    onChange={handleChange}
                                    accept="image/*"
                                    className="mt-1 block w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
                                />
                                {posterPreview && (
                                    <div className="mt-2">
                                        <img
                                            src={posterPreview}
                                            alt="Poster preview"
                                            className="max-w-32 h-20 object-cover rounded-md border"
                                        />
                                    </div>
                                )}
                            </div>
                            <div className="flex items-center">
                                <input
                                    type="checkbox"
                                    name="isActive"
                                    id="isActive"
                                    checked={formData.isActive}
                                    onChange={handleChange}
                                    className="h-4 w-4 text-indigo-600 focus:ring-indigo-500 border-gray-300 rounded"
                                />
                                <label htmlFor="isActive" className="ml-2 block text-sm text-gray-900">
                                    Active Workshop
                                </label>
                            </div>
                        </div>
                    </div>

                    <div className="flex justify-end space-x-3 pt-6 border-t border-gray-200">
                        <button
                            type="button"
                            onClick={onClose}
                            className="px-4 py-2 text-sm font-medium text-gray-700 bg-gray-200 rounded-md hover:bg-gray-300"
                            disabled={isLoading}
                        >
                            Cancel
                        </button>
                        <button
                            type="submit"
                            className="px-4 py-2 text-sm font-medium text-white bg-indigo-600 rounded-md hover:bg-indigo-700 disabled:opacity-50"
                            disabled={isLoading}
                        >
                            {isLoading ? 'Updating...' : 'Update Workshop'}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default EditWorkshopModal;