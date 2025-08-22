import React, { useState } from 'react';
import InternshipList from './InternshipList';
import RegistrationList from './InternshipRegistrationList';
import CreateInternshipForm from './CreateInternship';
import EditInternshipModal from './EditInternshipModel';

const InternshipManagement = ({ 
  internships, 
  internshipRegistrations, 
  onUpdateInternship, 
  onCreateInternship,
  onDeleteInternship,
  onArchiveInternship 
}) => {
  
  const [view, setView] = useState('internships');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedInternship, setSelectedInternship] = useState(null);

  const handleEdit = (internship) => {
    if (!internship || !internship.id) {
      console.error("Attempted to edit a internship without a valid ID:", internship);
      return;
    }
    setSelectedInternship(internship);
    setIsModalOpen(true);
  };

  const handleModalClose = () => {
    setIsModalOpen(false);
    setSelectedInternship(null);
  };

  const handleDelete = async (internshipId) => {
    if (window.confirm('Are you sure you want to delete this internship? This action cannot be undone.')) {
      try {
        await onDeleteInternship(internshipId);
      } catch (error) {
        console.error('Error deleting internship:', error);
        alert('Failed to delete internship. Please try again.');
      }
    }
  };

  const handleArchive = async (internshipId) => {
    if (window.confirm('Are you sure you want to archive this internship?')) {
      try {
        await onArchiveInternship(internshipId);
      } catch (error) {
        console.error('Error archiving internship:', error);
        alert('Failed to archive internship. Please try again.');
      }
    }
  };

const SubNavButton = ({ targetView, children }) => (
  <button
    onClick={() => setView(targetView)}
    className={`px-4 py-2 text-sm font-medium rounded-md transition-colors ${
      view === targetView
        ? 'bg-indigo-600 text-white'
        : 'text-gray-600 bg-gray-200 hover:bg-gray-300'
    }`}
  >
    {children}
  </button>
);


  return (
    <div>
      {/* Sub-navigation */}
      <div className="flex space-x-2 mb-6 border-b pb-4">
        <SubNavButton activeView={view} targetView="internships" setView={setView}>
          Manage Internships ({internships?.length || 0})
        </SubNavButton>
        <SubNavButton activeView={view} targetView="registrations" setView={setView}>
          View Registrations
         {/* ({internshipRegistrations?.length || 0}) */}
        </SubNavButton>
        <SubNavButton activeView={view} targetView="create" setView={setView}>
          Create New Internship
        </SubNavButton>
      </div>

      {/* Content Views */}
      {view === 'internships' && (
        <InternshipList
          internships={internships}
          handleEdit={handleEdit}
          handleDelete={handleDelete}
          handleArchive={handleArchive}
        />
      )}

      {view === 'registrations' && (
        <RegistrationList
          internships={internships?.data || []}
          internshipRegistrations={internshipRegistrations}
        />
      )}

      {view === 'create' && (
        <CreateInternshipForm
          onCreateInternship={onCreateInternship}
          setView={setView}
        />
      )}

      {/* Edit Modal */}
      {isModalOpen && selectedInternship && (
        <EditInternshipModal
    isOpen={isModalOpen}
    onClose={handleModalClose}
    internship={selectedInternship}
    onSave={onUpdateInternship}
  />
      )}
    </div>
  );
};

export default InternshipManagement;