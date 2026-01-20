
import React, { useState, useRef } from 'react';
import { User } from '../types';
import { X, Camera, Briefcase, GraduationCap, MapPin, Heart, Globe, Plus } from 'lucide-react';

interface EditProfileModalProps {
  user: User;
  onClose: () => void;
  onSave: (updatedUser: User) => void;
}

const EditProfileModal: React.FC<EditProfileModalProps> = ({ user, onClose, onSave }) => {
  const [editedUser, setEditedUser] = useState<User>({ ...user });
  const avatarInputRef = useRef<HTMLInputElement>(null);
  const coverInputRef = useRef<HTMLInputElement>(null);

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>, field: 'avatar' | 'coverPhoto') => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setEditedUser(prev => ({ ...prev, [field]: reader.result as string }));
      };
      reader.readAsDataURL(file);
    }
  };

  const handleInputChange = (field: keyof User, value: string) => {
    setEditedUser(prev => ({ ...prev, [field]: value }));
  };

  const BIO_LIMIT = 101;

  return (
    <div className="fixed inset-0 bg-black/60 z-[200] flex items-center justify-center p-0 sm:p-4 backdrop-blur-sm animate-in fade-in duration-200">
      <div className="bg-white w-full h-full sm:h-auto sm:max-w-[550px] sm:rounded-xl shadow-2xl flex flex-col overflow-hidden">
        {/* Header */}
        <div className="flex items-center justify-between px-4 py-3 border-b border-gray-200">
          <h2 className="text-xl font-bold text-gray-900">Edit Profile</h2>
          <button onClick={onClose} className="p-2 hover:bg-gray-100 rounded-full transition-colors">
            <X className="w-6 h-6 text-gray-500" />
          </button>
        </div>

        {/* Content */}
        <div className="flex-1 overflow-y-auto p-4 space-y-8 no-scrollbar bg-white">
          {/* Profile Picture Section */}
          <section>
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-lg font-bold">Profile Picture</h3>
              <button 
                onClick={() => avatarInputRef.current?.click()}
                className="text-[#1877F2] font-semibold hover:bg-blue-50 px-2 py-1 rounded transition-colors"
              >
                Edit
              </button>
              <input 
                type="file" 
                ref={avatarInputRef} 
                className="hidden" 
                accept="image/*" 
                onChange={(e) => handleImageChange(e, 'avatar')} 
              />
            </div>
            <div className="flex justify-center">
              <div className="relative group cursor-pointer" onClick={() => avatarInputRef.current?.click()}>
                <img src={editedUser.avatar} className="w-40 h-40 rounded-full object-cover border-4 border-white shadow-md bg-gray-100" alt="" />
                <div className="absolute inset-0 bg-black/20 rounded-full flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                  <Camera className="text-white w-8 h-8" />
                </div>
              </div>
            </div>
          </section>

          <hr className="border-gray-200" />

          {/* Cover Photo Section */}
          <section>
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-lg font-bold">Cover Photo</h3>
              <button 
                onClick={() => coverInputRef.current?.click()}
                className="text-[#1877F2] font-semibold hover:bg-blue-50 px-2 py-1 rounded transition-colors"
              >
                Edit
              </button>
              <input 
                type="file" 
                ref={coverInputRef} 
                className="hidden" 
                accept="image/*" 
                onChange={(e) => handleImageChange(e, 'coverPhoto')} 
              />
            </div>
            <div 
              className="relative h-44 w-full bg-gray-100 rounded-lg overflow-hidden group cursor-pointer"
              onClick={() => coverInputRef.current?.click()}
            >
              <img src={editedUser.coverPhoto} className="w-full h-full object-cover" alt="" />
              <div className="absolute inset-0 bg-black/20 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                <Camera className="text-white w-8 h-8" />
              </div>
            </div>
          </section>

          <hr className="border-gray-200" />

          {/* Bio Section */}
          <section>
            <div className="flex justify-between items-center mb-2">
              <h3 className="text-lg font-bold">Bio</h3>
              <button className="text-[#1877F2] font-semibold hover:bg-blue-50 px-2 py-1 rounded transition-colors">Edit</button>
            </div>
            <p className="text-sm text-gray-500 mb-3 text-center">Describe yourself in a few words...</p>
            <textarea
              value={editedUser.bio}
              onChange={(e) => handleInputChange('bio', e.target.value.slice(0, BIO_LIMIT))}
              placeholder="What's on your mind?"
              className="w-full p-3 bg-gray-100 border border-transparent rounded-lg focus:ring-2 focus:ring-[#1877F2] focus:bg-white transition-all outline-none resize-none text-center h-24 font-medium"
            />
            <p className="text-right text-xs text-gray-400 mt-1">
              {BIO_LIMIT - (editedUser.bio?.length || 0)} characters remaining
            </p>
          </section>

          <hr className="border-gray-200" />

          {/* Details Section */}
          <section>
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-lg font-bold">Customize your Intro</h3>
              <button className="text-[#1877F2] font-semibold hover:bg-blue-50 px-2 py-1 rounded transition-colors">Edit</button>
            </div>
            <div className="space-y-5">
              <div className="flex items-center gap-4">
                <Briefcase className="w-6 h-6 text-gray-400" />
                <div className="flex-1">
                  <p className="text-xs text-gray-400 font-bold uppercase mb-1">Work</p>
                  <input 
                    type="text" 
                    value={editedUser.workplace || ''} 
                    onChange={(e) => handleInputChange('workplace', e.target.value)}
                    placeholder="Where do you work?" 
                    className="w-full bg-gray-100 border-none rounded-lg px-3 py-2 text-sm font-medium focus:ring-2 focus:ring-[#1877F2]" 
                  />
                </div>
              </div>
              <div className="flex items-center gap-4">
                <GraduationCap className="w-6 h-6 text-gray-400" />
                <div className="flex-1">
                  <p className="text-xs text-gray-400 font-bold uppercase mb-1">Education</p>
                  <input 
                    type="text" 
                    value={editedUser.education || ''} 
                    onChange={(e) => handleInputChange('education', e.target.value)}
                    placeholder="Where did you go to school?" 
                    className="w-full bg-gray-100 border-none rounded-lg px-3 py-2 text-sm font-medium focus:ring-2 focus:ring-[#1877F2]" 
                  />
                </div>
              </div>
              <div className="flex items-center gap-4">
                <MapPin className="w-6 h-6 text-gray-400" />
                <div className="flex-1">
                  <p className="text-xs text-gray-400 font-bold uppercase mb-1">Current City</p>
                  <input 
                    type="text" 
                    value={editedUser.currentCity || ''} 
                    onChange={(e) => handleInputChange('currentCity', e.target.value)}
                    placeholder="Where do you live now?" 
                    className="w-full bg-gray-100 border-none rounded-lg px-3 py-2 text-sm font-medium focus:ring-2 focus:ring-[#1877F2]" 
                  />
                </div>
              </div>
              <div className="flex items-center gap-4">
                <Globe className="w-6 h-6 text-gray-400" />
                <div className="flex-1">
                  <p className="text-xs text-gray-400 font-bold uppercase mb-1">Hometown</p>
                  <input 
                    type="text" 
                    value={editedUser.hometown || ''} 
                    onChange={(e) => handleInputChange('hometown', e.target.value)}
                    placeholder="Where are you from originally?" 
                    className="w-full bg-gray-100 border-none rounded-lg px-3 py-2 text-sm font-medium focus:ring-2 focus:ring-[#1877F2]" 
                  />
                </div>
              </div>
              <div className="flex items-center gap-4">
                <Heart className="w-6 h-6 text-gray-400" />
                <div className="flex-1">
                  <p className="text-xs text-gray-400 font-bold uppercase mb-1">Relationship</p>
                  <select 
                    value={editedUser.relationshipStatus || ''} 
                    onChange={(e) => handleInputChange('relationshipStatus', e.target.value)}
                    className="w-full bg-gray-100 border-none rounded-lg px-3 py-2 text-sm font-medium focus:ring-2 focus:ring-[#1877F2]"
                  >
                    <option value="">Status</option>
                    <option value="Single">Single</option>
                    <option value="In a relationship">In a relationship</option>
                    <option value="Married">Married</option>
                    <option value="Engaged">Engaged</option>
                    <option value="It's complicated">It's complicated</option>
                    <option value="In an open relationship">In an open relationship</option>
                    <option value="Widowed">Widowed</option>
                    <option value="Separated">Separated</option>
                    <option value="Divorced">Divorced</option>
                  </select>
                </div>
              </div>
            </div>
          </section>
        </div>

        {/* Footer */}
        <div className="p-4 border-t border-gray-200 bg-white shadow-inner">
          <button 
            onClick={() => onSave(editedUser)}
            className="w-full bg-[#1877F2] text-white font-bold py-3 rounded-lg active:scale-95 transition-transform shadow-lg hover:bg-blue-600 flex items-center justify-center gap-2"
          >
            Save Changes
          </button>
        </div>
      </div>
    </div>
  );
};

export default EditProfileModal;
