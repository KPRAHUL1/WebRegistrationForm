// components/EditInternshipModal.js
import React, { useState, useEffect } from 'react';
import { internshipService } from '../../api/InternshipApi';

const EditInternshipModal = ({ isOpen, onClose, internship, onSave }) => {
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
        deliveryMode: 'OFFLINE',
        venue: '',
        meetingLink: '',
        posterImage: '',
        teacher: '',
        teacherBio: '',
        incharge: '',
        isActive: true
    });
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState('');

    useEffect(() => {
        if (internship) {
            const formattedData = {
                ...internship,
                startDate: internship.startDate ? new Date(internship.startDate).toISOString().split('T')[0] : '',
                endDate: internship.endDate ? new Date(internship.endDate).toISOString().split('T')[0] : '',
                price: internship.price || 0,
                totalAmount: internship.totalAmount || internship.price || 0,
                maxSeats: internship.maxSeats || 50,
                deliveryMode: internship.deliveryMode || 'OFFLINE',
                venue: internship.venue || '',
                meetingLink: internship.meetingLink || '',
                posterImage: internship.posterImage || '',
                teacher: internship.teacher || '',
                teacherBio: internship.teacherBio || '',
                incharge: internship.incharge || ''
            };
            setFormData(formattedData);
        }
    }, [internship]);

    const handleChange = (e) => {
        const { name, value, type, checked } = e.target;
        setFormData(prev => ({
            ...prev,
            [name]: type === 'checkbox' ? checked : value
        }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setIsLoading(true);
        setError('');

        if (!internship || !internship.id) {
            setError('Error: No internship selected for update.');
            setIsLoading(false);
            return;
        }

        // Validation for delivery mode specific fields
        if (formData.deliveryMode === 'OFFLINE' && !formData.venue.trim()) {
            setError('Venue is required for offline internships.');
            setIsLoading(false);
            return;
        }

        if (formData.deliveryMode === 'ONLINE' && !formData.meetingLink.trim()) {
            setError('Meeting link is required for online internships.');
            setIsLoading(false);
            return;
        }

        try {
            const internshipData = {
                ...formData,
                price: parseFloat(formData.price),
                totalAmount: parseFloat(formData.totalAmount),
                maxSeats: parseInt(formData.maxSeats),
                startDate: new Date(formData.startDate).toISOString(),
                endDate: new Date(formData.endDate).toISOString(),
                formFields: internship?.formFields || null,
                isArchived: internship?.isArchived || false
            };
            
            const updatedInternship = await internshipService.updateInternship(internship.id, internshipData);
            
            onSave(updatedInternship);
            onClose();
        } catch (err) {
            setError(err.response?.data?.message || err.message || 'Failed to update internship');
        } finally {
            setIsLoading(false);
        }
    };

    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex justify-center items-center p-4">
            <div className="bg-white p-6 rounded-lg shadow-xl w-full max-w-4xl max-h-[90vh] overflow-y-auto">
                <div className="flex justify-between items-center mb-6">
                    <h2 className="text-xl font-bold text-gray-900">Edit Internship</h2>
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
                    {/* Basic Information */}
                    <div className="space-y-4">
                        <h3 className="text-lg font-medium text-gray-900 border-b pb-2">Basic Information</h3>
                        
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
                                <label className="block text-sm font-medium text-gray-700">Poster Image URL</label>
                                <input
                                    type="url"
                                    name="posterImage"
                                    value={formData.posterImage}
                                    onChange={handleChange}
                                    placeholder="https://example.com/poster.jpg"
                                    className="mt-1 block w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
                                />
                            </div>
                        </div>

                        <div>
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

                    {/* Schedule Information */}
                    <div className="space-y-4">
                        <h3 className="text-lg font-medium text-gray-900 border-b pb-2">Schedule</h3>
                        
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
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
                    </div>

                    {/* Delivery Mode */}
                    <div className="space-y-4">
                        <h3 className="text-lg font-medium text-gray-900 border-b pb-2">Delivery Mode</h3>
                        
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

                        {formData.deliveryMode === 'OFFLINE' && (
                            <div>
                                <label className="block text-sm font-medium text-gray-700">Venue *</label>
                                <input
                                    type="text"
                                    name="venue"
                                    value={formData.venue}
                                    onChange={handleChange}
                                    placeholder="Enter venue address"
                                    className="mt-1 block w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
                                    required
                                />
                            </div>
                        )}

                        {formData.deliveryMode === 'ONLINE' && (
                            <div>
                                <label className="block text-sm font-medium text-gray-700">Meeting Link *</label>
                                <input
                                    type="url"
                                    name="meetingLink"
                                    value={formData.meetingLink}
                                    onChange={handleChange}
                                    placeholder="https://zoom.us/meeting-link"
                                    className="mt-1 block w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
                                    required
                                />
                            </div>
                        )}

                        {formData.deliveryMode === 'HYBRID' && (
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                <div>
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
                                <div>
                                    <label className="block text-sm font-medium text-gray-700">Meeting Link</label>
                                    <input
                                        type="url"
                                        name="meetingLink"
                                        value={formData.meetingLink}
                                        onChange={handleChange}
                                        placeholder="https://zoom.us/meeting-link"
                                        className="mt-1 block w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
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
                                <label className="block text-sm font-medium text-gray-700">Teacher/Instructor</label>
                                <input
                                    type="text"
                                    name="teacher"
                                    value={formData.teacher}
                                    onChange={handleChange}
                                    placeholder="Enter instructor name"
                                    className="mt-1 block w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
                                />
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-gray-700">Internship Coordinator</label>
                                <input
                                    type="text"
                                    name="incharge"
                                    value={formData.incharge}
                                    onChange={handleChange}
                                    placeholder="Enter coordinator name"
                                    className="mt-1 block w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
                                />
                            </div>
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-gray-700">Teacher Biography</label>
                            <textarea
                                name="teacherBio"
                                value={formData.teacherBio}
                                onChange={handleChange}
                                rows={3}
                                placeholder="Brief biography of the instructor"
                                className="mt-1 block w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
                            />
                        </div>
                    </div>

                    {/* Internship Settings */}
                    <div className="space-y-4">
                        <h3 className="text-lg font-medium text-gray-900 border-b pb-2">Internship Settings</h3>
                        
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                            <div>
                                <label className="block text-sm font-medium text-gray-700">Base Price *</label>
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
                            <div>
                                <label className="block text-sm font-medium text-gray-700">Total Amount</label>
                                <input
                                    type="number"
                                    name="totalAmount"
                                    value={formData.totalAmount}
                                    onChange={handleChange}
                                    min="0"
                                    step="0.01"
                                    placeholder="Including taxes/fees"
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
                                Active Internship
                            </label>
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
                            {isLoading ? 'Updating...' : 'Update Internship'}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default EditInternshipModal;