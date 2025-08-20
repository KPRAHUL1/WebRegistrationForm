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

  return (
    <div>
      {/* Sub-navigation */}
      <div className="flex space-x-2 mb-6 border-b pb-4">
        <SubNavButton activeView={view} targetView="courses" setView={setView}>
          Manage Courses ({courses?.length || 0})
        </SubNavButton>
        <SubNavButton activeView={view} targetView="registrations" setView={setView}>
          View Registrations ({courseRegistrations?.length || 0})
        </SubNavButton>
        <SubNavButton activeView={view} targetView="create" setView={setView}>
          Create New Course
        </SubNavButton>
      </div>

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