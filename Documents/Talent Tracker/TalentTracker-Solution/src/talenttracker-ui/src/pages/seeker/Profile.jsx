import React, { useState, useEffect } from 'react';
import { useAuth } from '../../context/AuthContext';
import userService from '../../services/userService';
import { User, Mail, MapPin, Briefcase, FileText, Upload, Save, ArrowLeft, Edit2, X, CheckCircle } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

const Profile = () => {
    const { user } = useAuth();
    const navigate = useNavigate();
    const [loading, setLoading] = useState(true);
    const [saving, setSaving] = useState(false);
    const [isEditing, setIsEditing] = useState(false);

    const [formData, setFormData] = useState({
        id: 0,
        name: '',
        email: '',
        address: '',
        desiredJob: '',
        experienceYears: '',
        summary: '',
        skills: ''
    });
    // Backup for cancel
    const [originalData, setOriginalData] = useState(null);

    const [resumeFile, setResumeFile] = useState(null);
    const [message, setMessage] = useState({ type: '', text: '' });

    useEffect(() => {
        const fetchProfile = async () => {
            try {
                if (user && user.id) {
                    const userData = await userService.getUserById(user.id);
                    const mappedData = {
                        id: userData.id,
                        name: userData.name,
                        email: userData.email,
                        address: userData.address || '',
                        desiredJob: userData.desiredJob || '',
                        experienceYears: userData.experienceYears || '',
                        summary: userData.summary || '',
                        skills: userData.skills || ''
                    };
                    setFormData(mappedData);
                    setOriginalData(mappedData);
                }
            } catch (error) {
                console.error("Error fetching profile", error);
            } finally {
                setLoading(false);
            }
        };

        fetchProfile();
    }, [user]);

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({
            ...prev,
            [name]: value
        }));
    };

    const handleFileChange = (e) => {
        if (e.target.files[0]) {
            setResumeFile(e.target.files[0]);
        }
    };

    const handleEdit = () => {
        setIsEditing(true);
        setMessage({ type: '', text: '' });
    };

    const handleCancel = () => {
        setFormData(originalData);
        setResumeFile(null);
        setIsEditing(false);
        setMessage({ type: '', text: '' });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setSaving(true);
        setMessage({ type: '', text: '' });

        try {
            // Update Profile Details
            const updateRequest = {
                id: formData.id,
                address: formData.address,
                desiredJob: formData.desiredJob,
                experienceYears: formData.experienceYears ? parseInt(formData.experienceYears) : null,
                summary: formData.summary,
                skills: formData.skills.split(',').map(s => s.trim()).filter(s => s)
            };

            await userService.updateProfile(formData.id, updateRequest);

            // Upload Resume if selected
            if (resumeFile) {
                await userService.uploadResume(formData.id, resumeFile);
            }

            setMessage({ type: 'success', text: 'Profile updated successfully!' });
            setOriginalData(formData); // Update backup
            setIsEditing(false);

            // Clear message after 3 seconds
            setTimeout(() => setMessage({ type: '', text: '' }), 3000);

        } catch (error) {
            console.error("Error updating profile", error);
            setMessage({ type: 'error', text: 'Failed to update profile. Please try again.' });
        } finally {
            setSaving(false);
        }
    };

    if (loading) return (
        <div className="flex justify-center items-center h-screen">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-600"></div>
        </div>
    );

    return (
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
            {/* Header */}
            <div className="flex items-center justify-between mb-8">
                <div className="flex items-center space-x-4">
                    <button
                        onClick={() => navigate('/dashboard')}
                        className="p-2 hover:bg-gray-100 rounded-full transition-colors duration-200"
                    >
                        <ArrowLeft className="w-6 h-6 text-gray-600" />
                    </button>
                    <div>
                        <h1 className="text-3xl font-bold text-gray-900">My Profile</h1>
                        <p className="text-gray-500 mt-1">Manage your professional identity</p>
                    </div>
                </div>
                {!isEditing && (
                    <button
                        onClick={handleEdit}
                        className="inline-flex items-center px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition shadow-sm"
                    >
                        <Edit2 className="w-4 h-4 mr-2" />
                        Edit Profile
                    </button>
                )}
            </div>

            {message.text && (
                <div className={`mb-6 p-4 rounded-lg flex items-center ${message.type === 'success' ? 'bg-green-50 text-green-700 border border-green-200' : 'bg-red-50 text-red-700 border border-red-200'}`}>
                    {message.type === 'success' ? <CheckCircle className="w-5 h-5 mr-3" /> : <X className="w-5 h-5 mr-3" />}
                    {message.text}
                </div>
            )}

            <form onSubmit={handleSubmit}>
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                    {/* Left Column: Basic Info */}
                    <div className="lg:col-span-1 space-y-6">
                        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6 text-center">
                            <div className="w-24 h-24 bg-indigo-100 rounded-full flex items-center justify-center mx-auto mb-4">
                                <span className="text-3xl font-bold text-indigo-600">{formData.name.charAt(0)}</span>
                            </div>
                            <h2 className="text-xl font-bold text-gray-900">
                                {formData.name}
                                <span className="ml-2 text-xs text-gray-400 font-normal">#{formData.id}</span>
                            </h2>
                            <p className="text-gray-500">{formData.desiredJob || 'Job Seeker'}</p>

                            <div className="mt-6 space-y-3 text-left">
                                <div className="flex items-center text-gray-600">
                                    <Mail className="w-4 h-4 mr-3 text-gray-400" />
                                    <span className="text-sm">{formData.email}</span>
                                </div>
                                <div className="flex items-center text-gray-600">
                                    <MapPin className="w-4 h-4 mr-3 text-gray-400" />
                                    {isEditing ? (
                                        <input
                                            type="text"
                                            name="address"
                                            value={formData.address}
                                            onChange={handleChange}
                                            placeholder="City, Country"
                                            className="block w-full rounded-xl border-gray-200 bg-gray-50 focus:bg-white focus:border-indigo-500 focus:ring-4 focus:ring-indigo-500/10 transition-all duration-200 text-sm py-2.5 px-4"
                                        />
                                    ) : (
                                        <span className="text-sm">{formData.address || 'No location added'}</span>
                                    )}
                                </div>
                            </div>
                        </div>

                        {/* Resume Section */}
                        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6">
                            <h3 className="text-lg font-bold text-gray-900 mb-4 flex items-center">
                                <FileText className="w-5 h-5 mr-2 text-indigo-500" />
                                Resume
                            </h3>
                            {isEditing ? (
                                <div className="mt-1 flex justify-center px-6 pt-5 pb-6 border-2 border-gray-300 border-dashed rounded-md hover:border-indigo-500 transition-colors bg-gray-50">
                                    <div className="space-y-1 text-center">
                                        <Upload className="mx-auto h-8 w-8 text-gray-400" />
                                        <div className="flex text-sm text-gray-600 justify-center">
                                            <label
                                                htmlFor="file-upload"
                                                className="relative cursor-pointer bg-white rounded-md font-medium text-indigo-600 hover:text-indigo-500 focus-within:outline-none focus-within:ring-2 focus-within:ring-offset-2 focus-within:ring-indigo-500"
                                            >
                                                <span>Upload new</span>
                                                <input id="file-upload" name="file-upload" type="file" className="sr-only" onChange={handleFileChange} accept=".pdf,.doc,.docx" />
                                            </label>
                                        </div>
                                        <p className="text-xs text-gray-500">PDF, DOC up to 10MB</p>
                                        {resumeFile && (
                                            <p className="text-sm text-green-600 font-medium mt-2">
                                                Selected: {resumeFile.name}
                                            </p>
                                        )}
                                    </div>
                                </div>
                            ) : (
                                <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                                    <div className="flex items-center">
                                        <FileText className="w-8 h-8 text-gray-400 mr-3" />
                                        <div>
                                            <p className="text-sm font-medium text-gray-900">Current Resume</p>
                                            <p className="text-xs text-gray-500">Uploaded previously</p>
                                        </div>
                                    </div>
                                    <button type="button" className="text-sm text-indigo-600 hover:text-indigo-800 font-medium">
                                        Download
                                    </button>
                                </div>
                            )}
                        </div>
                    </div>

                    {/* Right Column: Details */}
                    <div className="lg:col-span-2 space-y-6">
                        {/* Professional Details */}
                        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6">
                            <h3 className="text-lg font-bold text-gray-900 mb-6 flex items-center">
                                <Briefcase className="w-5 h-5 mr-2 text-indigo-500" />
                                Professional Details
                            </h3>

                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-1">Desired Job Title</label>
                                    {isEditing ? (
                                        <input
                                            type="text"
                                            name="desiredJob"
                                            value={formData.desiredJob}
                                            onChange={handleChange}
                                            className="block w-full rounded-xl border-gray-200 bg-gray-50 focus:bg-white focus:border-indigo-500 focus:ring-4 focus:ring-indigo-500/10 transition-all duration-200 text-sm py-3 px-4"
                                        />
                                    ) : (
                                        <p className="text-gray-900 font-medium">{formData.desiredJob || '-'}</p>
                                    )}
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-1">Years of Experience</label>
                                    {isEditing ? (
                                        <input
                                            type="number"
                                            name="experienceYears"
                                            value={formData.experienceYears}
                                            onChange={handleChange}
                                            className="block w-full rounded-xl border-gray-200 bg-gray-50 focus:bg-white focus:border-indigo-500 focus:ring-4 focus:ring-indigo-500/10 transition-all duration-200 text-sm py-3 px-4"
                                        />
                                    ) : (
                                        <p className="text-gray-900 font-medium">{formData.experienceYears ? `${formData.experienceYears} Years` : '-'}</p>
                                    )}
                                </div>
                                <div className="md:col-span-2">
                                    <label className="block text-sm font-medium text-gray-700 mb-1">Skills</label>
                                    {isEditing ? (
                                        <div className="space-y-2">
                                            <input
                                                type="text"
                                                name="skills"
                                                value={formData.skills}
                                                onChange={handleChange}
                                                placeholder="React, Node.js, Design..."
                                                className="block w-full rounded-xl border-gray-200 bg-gray-50 focus:bg-white focus:border-indigo-500 focus:ring-4 focus:ring-indigo-500/10 transition-all duration-200 text-sm py-3 px-4"
                                            />
                                            <p className="text-xs text-gray-500">Separate skills with commas</p>
                                        </div>
                                    ) : (
                                        <div className="flex flex-wrap gap-2">
                                            {formData.skills ? formData.skills.split(',').map((skill, index) => (
                                                <span key={index} className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-indigo-50 text-indigo-700">
                                                    {skill.trim()}
                                                </span>
                                            )) : <span className="text-gray-500 italic">No skills listed</span>}
                                        </div>
                                    )}
                                </div>
                            </div>
                        </div>

                        {/* About Me */}
                        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6">
                            <h3 className="text-lg font-bold text-gray-900 mb-4 flex items-center">
                                <User className="w-5 h-5 mr-2 text-indigo-500" />
                                About Me
                            </h3>
                            {isEditing ? (
                                <textarea
                                    name="summary"
                                    rows={6}
                                    value={formData.summary}
                                    onChange={handleChange}
                                    placeholder="Tell us about your professional background..."
                                    className="block w-full rounded-xl border-gray-200 bg-gray-50 focus:bg-white focus:border-indigo-500 focus:ring-4 focus:ring-indigo-500/10 transition-all duration-200 text-sm py-3 px-4 resize-none"
                                />
                            ) : (
                                <p className="text-gray-600 leading-relaxed whitespace-pre-wrap">
                                    {formData.summary || <span className="italic text-gray-400">No summary provided.</span>}
                                </p>
                            )}
                        </div>

                        {/* Action Buttons (Edit Mode Only) */}
                        {isEditing && (
                            <div className="flex justify-end space-x-4 pt-4">
                                <button
                                    type="button"
                                    onClick={handleCancel}
                                    className="px-6 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50 font-medium transition"
                                >
                                    Cancel
                                </button>
                                <button
                                    type="submit"
                                    disabled={saving}
                                    className="px-6 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 font-medium shadow-sm transition disabled:opacity-50 flex items-center"
                                >
                                    {saving ? 'Saving...' : (
                                        <>
                                            <Save className="w-4 h-4 mr-2" />
                                            Save Changes
                                        </>
                                    )}
                                </button>
                            </div>
                        )}
                    </div>
                </div>
            </form>
        </div>
    );
};

export default Profile;
