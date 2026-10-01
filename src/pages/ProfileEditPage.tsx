import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { PageHeader } from '../components/ui/PageHeader';
import { useAuth } from '../context/AuthContext';
import { useToast } from '../context/ToastContext';

export const ProfileEditPage: React.FC = () => {
  const navigate = useNavigate();
  const { showSuccess } = useToast();
  const { currentUser, updateCurrentUserProfile } = useAuth();

  const [name, setName] = useState(currentUser.name);
  const [bio, setBio] = useState(currentUser.bio);
  const [availability, setAvailability] = useState(currentUser.availability || '');
  const [dept, setDept] = useState(currentUser.department);
  const [year, setYear] = useState(currentUser.year || '');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    updateCurrentUserProfile({
      name,
      bio,
      availability,
      department: dept,
      year,
    });

    showSuccess('Your academic profile changes have been saved to local storage.', 'Profile Updated');
    navigate('/profile');
  };

  return (
    <div className="space-y-6 pb-12 max-w-2xl mx-auto">
      <PageHeader title="Edit Academic Profile" backTo="/profile" />

      <form onSubmit={handleSubmit} className="bg-white rounded-xl border border-gray-200/90 p-5 shadow-xs space-y-4 text-xs sm:text-sm">
        <div>
          <label className="block text-xs font-semibold text-gray-700 mb-1">Full Name</label>
          <input
            type="text"
            required
            value={name}
            onChange={(e) => setName(e.target.value)}
            className="w-full h-9 rounded-lg border border-gray-300 px-3 text-xs sm:text-sm focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-600"
          />
        </div>

        <div className="grid grid-cols-2 gap-3">
          <div>
            <label className="block text-xs font-semibold text-gray-700 mb-1">Department</label>
            <input
              type="text"
              required
              value={dept}
              onChange={(e) => setDept(e.target.value)}
              className="w-full h-9 rounded-lg border border-gray-300 px-3 text-xs sm:text-sm focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-600"
            />
          </div>
          <div>
            <label className="block text-xs font-semibold text-gray-700 mb-1">Year of Study</label>
            <input
              type="text"
              required
              value={year}
              onChange={(e) => setYear(e.target.value)}
              className="w-full h-9 rounded-lg border border-gray-300 px-3 text-xs sm:text-sm focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-600"
            />
          </div>
        </div>

        <div>
          <label className="block text-xs font-semibold text-gray-700 mb-1">Academic Bio</label>
          <textarea
            rows={3}
            value={bio}
            onChange={(e) => setBio(e.target.value)}
            className="w-full rounded-lg border border-gray-300 p-2.5 text-xs sm:text-sm focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-600"
          />
        </div>

        <div>
          <label className="block text-xs font-semibold text-gray-700 mb-1">
            Weekly Mentoring Availability
          </label>
          <input
            type="text"
            value={availability}
            onChange={(e) => setAvailability(e.target.value)}
            className="w-full h-9 rounded-lg border border-gray-300 px-3 text-xs sm:text-sm focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-600"
          />
        </div>

        <div className="flex justify-end gap-3 pt-3 border-t border-gray-100">
          <button
            type="button"
            onClick={() => navigate('/profile')}
            className="px-4 py-2 border border-gray-300 rounded-lg text-xs font-medium text-gray-700 hover:bg-gray-50"
          >
            Cancel
          </button>
          <button
            type="submit"
            className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg text-xs font-semibold shadow-2xs transition-colors"
          >
            Save Changes
          </button>
        </div>
      </form>
    </div>
  );
};
