import React, { useState } from 'react';
import CourseList from './CourseList';
import RegistrationList from './CourseRegistrationList';
import CreateCourseForm from './CreateCourse';
import EditCourseModal from './EditCourseModel';

const CourseManagement = ({
  courses,
  courseRegistrations,
  onUpdateCourse,
  onCreateCourse,
  onDeleteCourse,
  onArchiveCourse
}) => {
  const [view, setView] = useState('courses');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedCourse, setSelectedCourse] = useState(null);

  const handleEdit = (course) => {
    if (!course || !course.id) {
      console.error("Attempted to edit a course without a valid ID:", course);
      return;
    }
    setSelectedCourse(course);
    setIsModalOpen(true);
  };

  const handleModalClose = () => {
    setIsModalOpen(false);
    setSelectedCourse(null);
  };

  const handleDelete = async (courseId) => {
    if (window.confirm('Are you sure you want to delete this course? This action cannot be undone.')) {
      try {
        await onDeleteCourse(courseId);
      } catch (error) {
        console.error('Error deleting course:', error);
        alert('Failed to delete course. Please try again.');
      }
    }
  };

  const handleArchive = async (courseId) => {
    if (window.confirm('Are you sure you want to archive this course?')) {
      try {
        await onArchiveCourse(courseId);
      } catch (error) {
        console.error('Error archiving course:', error);
        alert('Failed to archive course. Please try again.');
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
    const totalCourses = courses?.length || 0;
    const activeCourses = courses?.filter(c => c.isActive)?.length || 0;
    const onlineCourses = courses?.filter(c => c.deliveryMode === 'ONLINE')?.length || 0;
    const offlineCourses = courses?.filter(c => c.deliveryMode === 'OFFLINE')?.length || 0;
    const hybridCourses = courses?.filter(c => c.deliveryMode === 'HYBRID')?.length || 0;
    const totalRegistrations = courseRegistrations?.length || 0;
    const confirmedRegistrations = courseRegistrations?.filter(r => r.status === 'confirmed')?.length || 0;

    return {
      totalCourses,
      activeCourses,
      onlineCourses,
      offlineCourses,
      hybridCourses,
      totalRegistrations,
      confirmedRegistrations
    };
  };

  const stats = getStatistics();

  return (
    <div>
      {/* Sub-navigation */}
      <div className="flex flex-wrap gap-2 mb-6 border-b pb-4">
        <SubNavButton activeView={view} targetView="courses" setView={setView}>
          Manage Courses ({stats.totalCourses})
        </SubNavButton>
        <SubNavButton activeView={view} targetView="registrations" setView={setView}>
          View Registrations ({stats.totalRegistrations})
        </SubNavButton>
        <SubNavButton activeView={view} targetView="create" setView={setView}>
          Create New Course
        </SubNavButton>
      </div>

      {/* Statistics Dashboard */}
      {view === 'courses' && (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
          <div className="bg-white p-4 rounded-lg shadow border-l-4 border-blue-500">
            <div className="flex items-center">
              <div className="flex-shrink-0">
                <div className="text-2xl">📚</div>
              </div>
              <div className="ml-3">
                <p className="text-sm font-medium text-gray-500">Total Courses</p>
                <p className="text-2xl font-semibold text-gray-900">{stats.totalCourses}</p>
              </div>
            </div>
          </div>
          
          <div className="bg-white p-4 rounded-lg shadow border-l-4 border-green-500">
            <div className="flex items-center">
              <div className="flex-shrink-0">
                <div className="text-2xl">✅</div>
              </div>
              <div className="ml-3">
                <p className="text-sm font-medium text-gray-500">Active Courses</p>
                <p className="text-2xl font-semibold text-gray-900">{stats.activeCourses}</p>
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
      {view === 'courses' && stats.totalCourses > 0 && (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
          <div className="bg-gradient-to-r from-blue-50 to-blue-100 p-4 rounded-lg border border-blue-200">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-blue-700">Online Courses</p>
                <p className="text-xl font-semibold text-blue-900">{stats.onlineCourses}</p>
              </div>
              <div className="text-2xl">🌐</div>
            </div>
          </div>
          
          <div className="bg-gradient-to-r from-green-50 to-green-100 p-4 rounded-lg border border-green-200">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-green-700">In-Person Courses</p>
                <p className="text-xl font-semibold text-green-900">{stats.offlineCourses}</p>
              </div>
              <div className="text-2xl">📍</div>
            </div>
          </div>
          
          <div className="bg-gradient-to-r from-purple-50 to-purple-100 p-4 rounded-lg border border-purple-200">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-purple-700">Hybrid Courses</p>
                <p className="text-xl font-semibold text-purple-900">{stats.hybridCourses}</p>
              </div>
              <div className="text-2xl">🔄</div>
            </div>
          </div>
        </div>
      )}

      {/* Content Views */}
      {view === 'courses' && (
        <CourseList
          courses={courses}
          handleEdit={handleEdit}
          handleDelete={handleDelete}
          handleArchive={handleArchive}
        />
      )}

      {view === 'registrations' && (
        <RegistrationList
          courses={courses}
          courseRegistrations={courseRegistrations}
        />
      )}

      {view === 'create' && (
        <CreateCourseForm
          onCreateCourse={onCreateCourse}
          setView={setView}
        />
      )}

      {/* Edit Modal */}
      {selectedCourse && (
        <EditCourseModal
          isOpen={isModalOpen}
          onClose={handleModalClose}
          course={selectedCourse}
          onSave={onUpdateCourse}
        />
      )}
    </div>
  );
};

export default CourseManagement;