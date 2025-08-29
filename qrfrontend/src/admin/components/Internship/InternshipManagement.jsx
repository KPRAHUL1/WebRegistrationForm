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

  const SubNavButton = ({ activeView, targetView, setView, children }) => (
    <button
      onClick={() => setView(targetView)}
      className={`px-4 py-2 text-sm font-medium rounded-md transition-colors ${
        activeView === targetView
          ? 'bg-indigo-600 text-white'
          : 'text-gray-600 bg-gray-200 hover:bg-gray-300'
      }`}
    >
      {children}
    </button>
  );

  // Statistics for dashboard
  const getStatistics = () => {
    const totalInternships = internships?.length || 0;
    const activeInternships = internships?.filter(c => c.isActive)?.length || 0;
    const onlineInternships = internships?.filter(c => c.deliveryMode === 'ONLINE')?.length || 0;
    const offlineInternships = internships?.filter(c => c.deliveryMode === 'OFFLINE')?.length || 0;
    const hybridInternships = internships?.filter(c => c.deliveryMode === 'HYBRID')?.length || 0;
    const totalRegistrations = internshipRegistrations?.length || 0;
    const confirmedRegistrations = internshipRegistrations?.filter(r => r.status === 'confirmed')?.length || 0;

    return {
      totalInternships,
      activeInternships,
      onlineInternships,
      offlineInternships,
      hybridInternships,
      totalRegistrations,
      confirmedRegistrations
    };
  };

  const stats = getStatistics();

  return (
    <div>
      {/* Sub-navigation */}
      <div className="flex flex-wrap gap-2 mb-6 border-b pb-4">
        <SubNavButton activeView={view} targetView="internships" setView={setView}>
          Manage Internships ({stats.totalInternships})
        </SubNavButton>
        <SubNavButton activeView={view} targetView="registrations" setView={setView}>
          View Registrations ({stats.totalRegistrations})
        </SubNavButton>
        <SubNavButton activeView={view} targetView="create" setView={setView}>
          Create New Internship
        </SubNavButton>
      </div>

      {/* Statistics Dashboard */}
      {view === 'internships' && (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
          <div className="bg-white p-4 rounded-lg shadow border-l-4 border-blue-500">
            <div className="flex items-center">
              <div className="flex-shrink-0">
                <div className="text-2xl">📚</div>
              </div>
              <div className="ml-3">
                <p className="text-sm font-medium text-gray-500">Total Internships</p>
                <p className="text-2xl font-semibold text-gray-900">{stats.totalInternships}</p>
              </div>
            </div>
          </div>
          
          <div className="bg-white p-4 rounded-lg shadow border-l-4 border-green-500">
            <div className="flex items-center">
              <div className="flex-shrink-0">
                <div className="text-2xl">✅</div>
              </div>
              <div className="ml-3">
                <p className="text-sm font-medium text-gray-500">Active Internships</p>
                <p className="text-2xl font-semibold text-gray-900">{stats.activeInternships}</p>
              </div>
            </div>
          </div>
          
          <div className="bg-white p-4 rounded-lg shadow border-l-4 border-purple-500">
            <div className="flex items-center">
              <div className="flex-shrink-0">
                <div className="text-2xl">👥</div>
              </div>
              <div className="ml-3">
                <p className="text-sm font-medium text-gray-500">Total Registrations</p>
                <p className="text-2xl font-semibold text-gray-900">{stats.totalRegistrations}</p>
              </div>
            </div>
          </div>
          
          <div className="bg-white p-4 rounded-lg shadow border-l-4 border-orange-500">
            <div className="flex items-center">
              <div className="flex-shrink-0">
                <div className="text-2xl">🎯</div>
              </div>
              <div className="ml-3">
                <p className="text-sm font-medium text-gray-500">Confirmed</p>
                <p className="text-2xl font-semibold text-gray-900">{stats.confirmedRegistrations}</p>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Delivery Mode Statistics */}
      {view === 'internships' && stats.totalInternships > 0 && (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
          <div className="bg-gradient-to-r from-blue-50 to-blue-100 p-4 rounded-lg border border-blue-200">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-blue-700">Online Internships</p>
                <p className="text-xl font-semibold text-blue-900">{stats.onlineInternships}</p>
              </div>
              <div className="text-2xl">🌐</div>
            </div>
          </div>
          
          <div className="bg-gradient-to-r from-green-50 to-green-100 p-4 rounded-lg border border-green-200">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-green-700">In-Person Internships</p>
                <p className="text-xl font-semibold text-green-900">{stats.offlineInternships}</p>
              </div>
              <div className="text-2xl">📍</div>
            </div>
          </div>
          
          <div className="bg-gradient-to-r from-purple-50 to-purple-100 p-4 rounded-lg border border-purple-200">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-purple-700">Hybrid Internships</p>
                <p className="text-xl font-semibold text-purple-900">{stats.hybridInternships}</p>
              </div>
              <div className="text-2xl">🔄</div>
            </div>
          </div>
        </div>
      )}

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
          internships={internships}
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
      {selectedInternship && (
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