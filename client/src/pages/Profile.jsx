import { useAuth } from '../context/AuthContext';
import { useState, useEffect } from 'react';  // Add useEffect import
import { Navigate } from 'react-router-dom';

const Profile = () => {
  const { user, updateUser } = useAuth();
  const [isEditing, setIsEditing] = useState(false);
  const [error, setError] = useState('');
  const [profileData, setProfileData] = useState({
    name: user?.name || '',
    email: user?.email || '',
    age: user?.age || '',
    gender: user?.gender || '',
    phone: user?.phone || '',
  });

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const token = localStorage.getItem('token');
      const response = await fetch('http://localhost:5000/api/users/profile', {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify(profileData)
      });

      const data = await response.json();
      if (response.ok) {
        updateUser(data.user);
        setIsEditing(false);
      } else {
        setError(data.message || 'Failed to update profile');
      }
    } catch (error) {
      setError('Error updating profile');
    }
  };

  // Update form fields with proper attributes
  return (
    <div className="h-screen bg-white font-manrope flex items-center">
      <div className="max-w-5xl mx-auto px-4 w-full">
        {error && (
          <div className="mb-4 p-3 bg-red-100 text-red-700 rounded-lg">
            {error}
          </div>
        )}
        <div className="bg-white rounded-2xl flex gap-8">
          {/* Left Side - Profile Header */}
          <div className="w-1/3 text-center">
            <div className="mb-6">
              <div className="h-24 w-24 rounded-full bg-yellow-50 mx-auto flex items-center justify-center border-4 border-yellow-100">
                <span className="text-2xl font-bold text-yellow-500">
                  {user?.name?.charAt(0)?.toUpperCase() || 'U'}
                </span>
              </div>
            </div>
            <h1 className="text-2xl font-bold text-gray-900 mb-1">{user?.name || 'User'}</h1>
            <p className="text-sm text-gray-500">{user?.email || 'Loading...'}</p>
          </div>

          {/* Right Side - Form */}
          <div className="w-2/3">
            <div className="mb-6">
              <h2 className="text-xl font-semibold text-gray-900 mb-1">Personal Information</h2>
              <div className="h-0.5 w-12 bg-yellow-500"></div>
            </div>

            <form onSubmit={handleSubmit} id="profile-form">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-1">
                    Full Name
                  </label>
                  <input
                    id="name"
                    name="name"
                    type="text"
                    autoComplete="name"
                    disabled={!isEditing}
                    className={`w-full px-3 py-2 rounded-lg ${
                      isEditing 
                        ? 'border border-yellow-200 focus:ring-1 focus:ring-yellow-100 focus:border-yellow-300' 
                        : 'bg-gray-50'
                    }`}
                    value={profileData.name}
                    onChange={(e) => setProfileData({ ...profileData, name: e.target.value })}
                  />
                </div>

                <div>
                  <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-1">
                    Email
                  </label>
                  <input
                    id="email"
                    name="email"
                    type="email"
                    autoComplete="email"
                    disabled={!isEditing}
                    className={`w-full px-3 py-2 rounded-lg ${
                      isEditing 
                        ? 'border border-yellow-200 focus:ring-1 focus:ring-yellow-100 focus:border-yellow-300' 
                        : 'bg-gray-50'
                    }`}
                    value={profileData.email}
                    onChange={(e) => setProfileData({ ...profileData, email: e.target.value })}
                  />
                </div>

                <div>
                  <label htmlFor="age" className="block text-sm font-medium text-gray-700 mb-1">
                    Age
                  </label>
                  <input
                    id="age"
                    name="age"
                    type="number"
                    autoComplete="off"
                    disabled={!isEditing}
                    className={`w-full px-3 py-2 rounded-lg ${
                      isEditing 
                        ? 'border border-yellow-200 focus:ring-1 focus:ring-yellow-100 focus:border-yellow-300' 
                        : 'bg-gray-50'
                    }`}
                    value={profileData.age}
                    onChange={(e) => setProfileData({ ...profileData, age: e.target.value })}
                  />
                </div>

                <div>
                  <label htmlFor="gender" className="block text-sm font-medium text-gray-700 mb-1">
                    Gender
                  </label>
                  <select
                    id="gender"
                    name="gender"
                    disabled={!isEditing}
                    className={`w-full px-3 py-2 rounded-lg ${
                      isEditing 
                        ? 'border border-yellow-200 focus:ring-1 focus:ring-yellow-100 focus:border-yellow-300' 
                        : 'bg-gray-50'
                    }`}
                    value={profileData.gender}
                    onChange={(e) => setProfileData({ ...profileData, gender: e.target.value })}
                  >
                    <option value="">Select</option>
                    <option value="male">Male</option>
                    <option value="female">Female</option>
                    <option value="other">Other</option>
                  </select>
                </div>

                <div className="col-span-2">
                  <label htmlFor="phone" className="block text-sm font-medium text-gray-700 mb-1">
                    Phone
                  </label>
                  <input
                    id="phone"
                    name="phone"
                    type="tel"
                    autoComplete="tel"
                    disabled={!isEditing}
                    className={`w-full px-3 py-2 rounded-lg ${
                      isEditing 
                        ? 'border border-yellow-200 focus:ring-1 focus:ring-yellow-100 focus:border-yellow-300' 
                        : 'bg-gray-50'
                    }`}
                    value={profileData.phone}
                    onChange={(e) => setProfileData({ ...profileData, phone: e.target.value })}
                  />
                </div>
              </div>
              
              {error && (
                <div className="mt-4 p-3 bg-red-100 text-red-700 rounded-lg">
                  {error}
                </div>
              )}

              <div className="flex justify-end space-x-3 mt-6">
                {isEditing ? (
                  <>
                    <button
                      type="button"
                      onClick={() => setIsEditing(false)}
                      className="px-4 py-2 text-sm font-medium text-gray-700 hover:text-gray-900 transition-colors"
                    >
                      Cancel
                    </button>
                    <button
                      type="submit"
                      className="px-4 py-2 bg-yellow-500 text-white rounded-lg text-sm font-medium hover:bg-yellow-600 transition-colors"
                    >
                      Save Changes
                    </button>
                  </>
                ) : (
                  <button
                    type="button"
                    onClick={() => setIsEditing(true)}
                    className="px-4 py-2 bg-yellow-500 text-white rounded-lg text-sm font-medium hover:bg-yellow-600 transition-colors"
                  >
                    Edit Profile
                  </button>
                )}
              </div>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Profile;