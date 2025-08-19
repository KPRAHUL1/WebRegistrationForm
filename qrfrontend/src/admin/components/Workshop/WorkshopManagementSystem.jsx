// components/WorkshopManagement.js
import React, { useState } from 'react';
import EditWorkshopModal from './EditWorkshopModel';
import WorkshopList from './WokshopList';
import RegistrationList from './RegistrationList';
import CreateWorkshopForm from './CreateWorkshop';

const WorkshopManagement = ({ workshops, workshopRegistrations, onUpdateWorkshop, onCreateWorkshop }) => {
    // State for switching between views: 'workshops' or 'registrations'
    const [view, setView] = useState('workshops');
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [selectedWorkshop, setSelectedWorkshop] = useState(null);

    const handleEdit = (workshop) => {
        // Add a safety check to ensure a valid workshop object is passed
        if (!workshop || !workshop.id) {
            console.error("Attempted to edit a workshop without a valid ID:", workshop);
            return;
        }
        setSelectedWorkshop(workshop);
        setIsModalOpen(true);
    };

    const handleModalClose = () => {
        setIsModalOpen(false);
        setSelectedWorkshop(null); // Clear the selected workshop state
    };

    const SubNavButton = ({ activeView, targetView, setView, children }) => (
        <button
            onClick={() => setView(targetView)}
            className={`px-4 py-2 text-sm font-medium rounded-md ${
                activeView === targetView
                    ? 'bg-indigo-600 text-white'
                    : 'text-gray-600 bg-gray-200 hover:bg-gray-300'
            }`}
        >
            {children}
        </button>
    );

    return (
        <div>
            {/* Sub-navigation for switching views */}
            <div className="flex space-x-2 mb-6 border-b pb-4">
                <SubNavButton activeView={view} targetView="workshops" setView={setView}>
                    Manage Workshops
                </SubNavButton>
                <SubNavButton activeView={view} targetView="registrations" setView={setView}>
                    View Registrations
                </SubNavButton>
                <SubNavButton
                    activeView={view}
                    targetView="create"
                    setView={setView}
                >
                    Create Workshop
                </SubNavButton>
            </div>

            {/* Conditionally render the active view */}
            {view === 'workshops' ? (
                <WorkshopList
                    workshops={workshops}
                    handleEdit={handleEdit}
                />
            ) : view === 'registrations' ? (
                <RegistrationList
                    workshops={workshops}
                    workshopRegistrations={workshopRegistrations}
                />
            ) : (
                <CreateWorkshopForm
                    onCreateWorkshop={onCreateWorkshop}
                    setView={setView}
                />
            )}

            {/* The Edit Modal is controlled here */}
            {selectedWorkshop && (
                <EditWorkshopModal
                    isOpen={isModalOpen}
                    onClose={handleModalClose}
                    workshop={selectedWorkshop} // Correct prop name
                    onSave={onUpdateWorkshop}
                />
            )}
        </div>
    );
};

export default WorkshopManagement;