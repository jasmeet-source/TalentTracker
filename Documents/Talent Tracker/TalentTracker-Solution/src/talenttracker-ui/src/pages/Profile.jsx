import React, { useState, useEffect } from 'react';
import { User, Mail, MapPin, Briefcase, FileText, Edit, Upload, Save } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import userService from '../services/userService';

const Profile = () => {
    const { user, updateUser } = useAuth();
    const [isEditing, setIsEditing] = useState(false);
    const [profile, setProfile] = useState({
        name: '',
        email: '',
        role: '',
        address: '',
        skills: '',
        desiredJob: '',
        resumeUrl: ''
    });
    const [resumeFile, setResumeFile] = useState(null);

    useEffect(() => {
        if (user) {
            fetchProfile();
        }
    }, [user]);

    const fetchProfile = async () => {
        try {
            const data = await userService.getUserById(user.id);
            setProfile({
                ...data,
                skills: data.skills || '', // Assuming skills comes as string or handled
                role: user.role // Keep role from context or map it
            });
        } catch (error) {
            console.error("Failed to fetch profile", error);
        }
    };

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setProfile(prev => ({ ...prev, [name]: value }));
    };

    const handleFileChange = (e) => {
        setResumeFile(e.target.files[0]);
    };

    const handleSave = async () => {
        try {
            // Update profile details
            await userService.updateProfile(user.id, {
                id: user.id,
                address: profile.address,
                desiredJob: profile.desiredJob,
                skills: profile.skills.split(',').map(s => s.trim()) // Convert string back to list
            });

            // Upload resume if selected
            if (resumeFile) {
                await userService.uploadResume(user.id, resumeFile);
            }

            setIsEditing(false);

            // Refresh data and update context
            const updatedData = await userService.getUserById(user.id);
            setProfile({
                ...updatedData,
                skills: updatedData.skills || '',
                role: user.role
            });

            if (updateUser) {
                updateUser({ ...user, ...updatedData });
            }

            alert('Profile updated successfully!');
        } catch (error) {
            console.error("Failed to update profile", error);
            alert('Failed to update profile.');
        }
    };

    if (!user) return <div>Please log in to view profile.</div>;

    return (
        <div className="max-w-4xl mx-auto space-y-6">
            <div className="bg-white rounded-xl shadow-sm overflow-hidden">
                <div className="h-32 bg-gradient-to-r from-indigo-500 to-purple-600"></div>
                <div className="px-8 pb-8">
                    <div className="relative flex justify-between items-end -mt-12 mb-6">
                        <div className="flex items-end">
                            <div className="h-24 w-24 rounded-xl bg-white p-1 shadow-md">
                                <div className="h-full w-full rounded-lg bg-indigo-100 flex items-center justify-center text-3xl font-bold text-indigo-600">
                                    {profile.name?.charAt(0)}
                                </div>
                            </div>
                            <div className="ml-6 mb-1">
                                <h1 className="text-2xl font-bold text-gray-900">{profile.name}</h1>
                                <p className="text-gray-500 capitalize">{profile.role}</p>
                            </div>
                        </div>
                        <button
                            onClick={() => isEditing ? handleSave() : setIsEditing(true)}
                            className={`px-4 py-2 rounded-lg flex items-center space-x-2 ${isEditing ? 'bg-green-600 text-white hover:bg-green-700' : 'bg-indigo-600 text-white hover:bg-indigo-700'}`}
                        >
                            {isEditing ? <><Save size={18} /> <span>Save Changes</span></> : <><Edit size={18} /> <span>Edit Profile</span></>}
                        </button>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                        <div className="space-y-6">
                            <div className="bg-gray-50 p-6 rounded-xl space-y-4">
                                <h3 className="font-semibold text-gray-900 flex items-center">
                                    <User size={20} className="mr-2 text-indigo-600" />
                                    Personal Information
                                </h3>
                                <div className="space-y-3">
                                    <div>
                                        <label className="text-xs text-gray-500 uppercase font-semibold">Email</label>
                                        <div className="flex items-center mt-1 text-gray-900">
                                            <Mail size={16} className="mr-2 text-gray-400" />
                                            {profile.email}
                                        </div>
                                    </div>
                                    <div>
                                        <label className="text-xs text-gray-500 uppercase font-semibold">Location</label>
                                        {isEditing ? (
                                            <input
                                                type="text"
                                                name="address"
                                                value={profile.address || ''}
                                                onChange={handleInputChange}
                                                className="w-full mt-1 p-2 border rounded"
                                            />
                                        ) : (
                                            <div className="flex items-center mt-1 text-gray-900">
                                                <MapPin size={16} className="mr-2 text-gray-400" />
                                                {profile.address || 'Not specified'}
                                            </div>
                                        )}
                                    </div>
                                </div>
                            </div>

                            <div className="bg-gray-50 p-6 rounded-xl space-y-4">
                                <h3 className="font-semibold text-gray-900 flex items-center">
                                    <FileText size={20} className="mr-2 text-indigo-600" />
                                    Resume
                                </h3>
                                <div className="flex items-center justify-between p-4 bg-white rounded-lg border border-gray-200">
                                    <div className="flex items-center">
                                        <div className="p-2 bg-red-50 rounded text-red-600 mr-3">
                                            <FileText size={24} />
                                        </div>
                                        <div>
                                            <p className="font-medium text-gray-900">{profile.resumeUrl ? 'Resume Uploaded' : 'No Resume'}</p>
                                            <p className="text-xs text-gray-500">{profile.resumeUrl || 'Upload PDF/DOCX'}</p>
                                        </div>
                                    </div>
                                    {isEditing && (
                                        <label className="cursor-pointer p-2 text-indigo-600 hover:bg-indigo-50 rounded">
                                            <Upload size={20} />
                                            <input type="file" className="hidden" onChange={handleFileChange} />
                                        </label>
                                    )}
                                </div>
                            </div>
                        </div>

                        <div className="space-y-6">
                            <div className="bg-gray-50 p-6 rounded-xl space-y-4">
                                <h3 className="font-semibold text-gray-900 flex items-center">
                                    <Briefcase size={20} className="mr-2 text-indigo-600" />
                                    Professional Details
                                </h3>
                                <div className="space-y-4">
                                    <div>
                                        <label className="text-xs text-gray-500 uppercase font-semibold">Desired Job Title</label>
                                        {isEditing ? (
                                            <input
                                                type="text"
                                                name="desiredJob"
                                                value={profile.desiredJob || ''}
                                                onChange={handleInputChange}
                                                className="w-full mt-1 p-2 border rounded"
                                            />
                                        ) : (
                                            <p className="mt-1 text-gray-900 font-medium">{profile.desiredJob || 'Not specified'}</p>
                                        )}
                                    </div>
                                    <div>
                                        <label className="text-xs text-gray-500 uppercase font-semibold">Skills</label>
                                        {isEditing ? (
                                            <textarea
                                                name="skills"
                                                value={profile.skills || ''}
                                                onChange={handleInputChange}
                                                className="w-full mt-1 p-2 border rounded"
                                                placeholder="Comma separated skills"
                                            />
                                        ) : (
                                            <div className="flex flex-wrap gap-2 mt-2">
                                                {profile.skills && profile.skills.split(',').map((skill, index) => (
                                                    <span key={index} className="px-3 py-1 bg-indigo-100 text-indigo-700 rounded-full text-sm">
                                                        {skill.trim()}
                                                    </span>
                                                ))}
                                                {!profile.skills && <span className="text-gray-500 italic">No skills listed</span>}
                                            </div>
                                        )}
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Profile;
