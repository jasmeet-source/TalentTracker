import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { UserPlus, Briefcase, Building, Users, ArrowRight, CheckCircle, Eye, EyeOff } from 'lucide-react';

const Register = () => {
    const navigate = useNavigate();
    const { register } = useAuth();
    const [role, setRole] = useState('seeker');
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');
    const [showSuccessModal, setShowSuccessModal] = useState(false);
    const [showPassword, setShowPassword] = useState(false);
    const [showConfirmPassword, setShowConfirmPassword] = useState(false);

    const [formData, setFormData] = useState({
        name: '',
        username: '',
        email: '',
        password: '',
        confirmPassword: '',

        // Seeker specific
        dob: '',
        qualification: '',
        skills: '',
        experienceYears: '',

        // Address (Common)
        address: '',
        city: '',
        state: '',
        pinCode: '',

        // Employer/Consultant specific
        companyName: '',
        companyType: 'Employer', // Default
        phone: '',
        fax: '',
    });

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError('');

        if (formData.password !== formData.confirmPassword) {
            setError("Passwords do not match");
            return;
        }

        // --- Validation Logic ---
        // 1. DOB Validation (Seeker only) - Must be 18+
        if (role === 'seeker' && formData.dob) {
            const birthDate = new Date(formData.dob);
            const today = new Date();
            let age = today.getFullYear() - birthDate.getFullYear();
            const m = today.getMonth() - birthDate.getMonth();
            if (m < 0 || (m === 0 && today.getDate() < birthDate.getDate())) {
                age--;
            }
            if (age < 18) {
                setError("You must be at least 18 years old to register.");
                return;
            }
        }

        // 2. Pincode Validation (Seeker & Employer) - Must be 6 digits
        if ((role === 'seeker' || role === 'employer') && formData.pinCode) {
            const pinRegex = /^\d{6}$/;
            if (!pinRegex.test(formData.pinCode)) {
                setError("Pincode must be exactly 6 digits.");
                return;
            }
        }

        // 3. Phone Validation (Employer & Consultant) - Must be 10 digits
        if ((role === 'employer' || role === 'consultant') && formData.phone) {
            const phoneRegex = /^\d{10}$/;
            if (!phoneRegex.test(formData.phone)) {
                setError("Phone number must be exactly 10 digits.");
                return;
            }
        }
        // ------------------------

        setLoading(true);

        try {
            const payload = {
                name: formData.name,
                username: formData.username,
                email: formData.email,
                password: formData.password,
                role: role,

                // Map fields based on role
                ...(role === 'seeker' && {
                    dob: formData.dob,
                    qualification: formData.qualification,
                    skills: formData.skills,
                    experienceYears: parseInt(formData.experienceYears) || 0,
                    address: formData.address,
                    city: formData.city,
                    state: formData.state,
                    pinCode: formData.pinCode,
                }),

                ...(role === 'employer' && {
                    companyName: formData.companyName,
                    companyType: 'Employer',
                    address: formData.address,
                    city: formData.city,
                    state: formData.state,
                    pinCode: formData.pinCode,
                    phone: formData.phone,
                    fax: formData.fax,
                }),

                ...(role === 'consultant' && {
                    companyName: formData.companyName, // Agency Name
                    companyType: 'Consultancy',
                    experienceYears: parseInt(formData.experienceYears) || 0,
                    phone: formData.phone,
                })
            };

            await register(payload);
            setShowSuccessModal(true);
        } catch (err) {
            setError(err.response?.data?.message || "Registration failed. Please try again.");
        } finally {
            setLoading(false);
        }
    };

    const handleSuccessClose = () => {
        setShowSuccessModal(false);
        navigate('/login');
    };

    return (
        <div className="min-h-screen bg-slate-50 py-12 px-4 sm:px-6 lg:px-8 font-sans relative">
            {/* Success Modal */}
            {showSuccessModal && (
                <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm p-4 animate-in fade-in duration-200">
                    <div className="bg-white rounded-2xl shadow-2xl w-full max-w-md overflow-hidden transform transition-all scale-100 p-8 text-center">
                        <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
                            <CheckCircle className="text-green-600" size={32} />
                        </div>
                        <h3 className="text-2xl font-bold text-gray-900 mb-2">Account Created!</h3>
                        <p className="text-gray-600 mb-6">
                            Your account has been successfully created. Please log in to continue to your dashboard.
                        </p>
                        <button
                            onClick={handleSuccessClose}
                            className="w-full bg-indigo-600 text-white font-bold py-3 rounded-xl hover:bg-indigo-700 transition-colors shadow-lg"
                        >
                            Login Now
                        </button>
                    </div>
                </div>
            )}

            <div className="max-w-4xl mx-auto bg-white rounded-2xl shadow-xl overflow-hidden">
                <div className="bg-indigo-900 py-6 px-8 flex justify-between items-center">
                    <div className="flex items-center space-x-3">
                        <div className="bg-white/10 p-2 rounded-lg">
                            <UserPlus className="text-white" size={24} />
                        </div>
                        <h2 className="text-2xl font-bold text-white">Create Account</h2>
                    </div>
                    <Link to="/login" className="text-indigo-200 hover:text-white text-sm font-medium transition-colors">
                        Already have an account? Sign in
                    </Link>
                </div>

                <div className="p-8">
                    {error && (
                        <div className="mb-6 bg-red-50 border-l-4 border-red-500 p-4 rounded-r">
                            <div className="flex">
                                <div className="flex-shrink-0">
                                    <svg className="h-5 w-5 text-red-400" viewBox="0 0 20 20" fill="currentColor">
                                        <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
                                    </svg>
                                </div>
                                <div className="ml-3">
                                    <p className="text-sm text-red-700">{error}</p>
                                </div>
                            </div>
                        </div>
                    )}

                    <form onSubmit={handleSubmit} className="space-y-6">
                        {/* Role Selection */}
                        <div className="bg-indigo-50 p-6 rounded-xl border border-indigo-100">
                            <label className="block text-sm font-bold text-indigo-900 mb-3 uppercase tracking-wide">
                                I want to register as a...
                            </label>
                            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                                {['seeker', 'employer', 'consultant'].map((r) => (
                                    <div
                                        key={r}
                                        onClick={() => setRole(r)}
                                        className={`cursor-pointer rounded-lg p-4 border-2 flex items-center justify-center space-x-2 transition-all ${role === r
                                            ? 'border-indigo-600 bg-white shadow-md transform scale-105'
                                            : 'border-transparent bg-white/50 hover:bg-white hover:border-indigo-200'
                                            }`}
                                    >
                                        <span className={`capitalize font-bold ${role === r ? 'text-indigo-600' : 'text-gray-500'}`}>
                                            {r === 'seeker' ? 'Job Seeker' : r}
                                        </span>
                                        {role === r && <div className="w-2 h-2 bg-indigo-600 rounded-full ml-2"></div>}
                                    </div>
                                ))}
                            </div>
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            {/* Common Fields */}
                            <div className="col-span-1 md:col-span-2">
                                <h3 className="text-lg font-semibold text-gray-800 border-b pb-2 mb-4 flex items-center">
                                    <span className="bg-indigo-100 text-indigo-800 text-xs font-bold px-2 py-1 rounded mr-2">1</span>
                                    Basic Information
                                </h3>
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">Full Name *</label>
                                <input
                                    type="text"
                                    name="name"
                                    required
                                    value={formData.name}
                                    onChange={handleChange}
                                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-colors"
                                    placeholder={role === 'employer' ? "Employer Name" : "Your Full Name"}
                                />
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">Username *</label>
                                <input
                                    type="text"
                                    name="username"
                                    required
                                    value={formData.username}
                                    onChange={handleChange}
                                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-colors"
                                    placeholder="Choose a unique username"
                                />
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">Email Address *</label>
                                <input
                                    type="email"
                                    name="email"
                                    required
                                    value={formData.email}
                                    onChange={handleChange}
                                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-colors"
                                    placeholder="you@example.com"
                                />
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">Password *</label>
                                <div className="relative">
                                    <input
                                        type={showPassword ? "text" : "password"}
                                        name="password"
                                        required
                                        value={formData.password}
                                        onChange={handleChange}
                                        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-colors pr-10"
                                        placeholder="••••••••"
                                    />
                                    <button
                                        type="button"
                                        onClick={() => setShowPassword(!showPassword)}
                                        className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-500 hover:text-gray-700"
                                    >
                                        {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
                                    </button>
                                </div>
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">Confirm Password *</label>
                                <div className="relative">
                                    <input
                                        type={showConfirmPassword ? "text" : "password"}
                                        name="confirmPassword"
                                        required
                                        value={formData.confirmPassword}
                                        onChange={handleChange}
                                        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-colors pr-10"
                                        placeholder="••••••••"
                                    />
                                    <button
                                        type="button"
                                        onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                                        className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-500 hover:text-gray-700"
                                    >
                                        {showConfirmPassword ? <EyeOff size={20} /> : <Eye size={20} />}
                                    </button>
                                </div>
                            </div>

                            {/* Role Specific Fields */}
                            <div className="col-span-1 md:col-span-2 mt-4">
                                <h3 className="text-lg font-semibold text-gray-800 border-b pb-2 mb-4 flex items-center">
                                    <span className="bg-indigo-100 text-indigo-800 text-xs font-bold px-2 py-1 rounded mr-2">2</span>
                                    {role === 'seeker' ? 'Professional Details' : role === 'employer' ? 'Company Details' : 'Agency Details'}
                                </h3>
                            </div>

                            {/* Job Seeker Fields */}
                            {role === 'seeker' && (
                                <>
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-1">Date of Birth *</label>
                                        <input
                                            type="date"
                                            name="dob"
                                            required
                                            value={formData.dob}
                                            onChange={handleChange}
                                            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-colors"
                                        />
                                    </div>
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-1">Qualification *</label>
                                        <input
                                            type="text"
                                            name="qualification"
                                            required
                                            value={formData.qualification}
                                            onChange={handleChange}
                                            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-colors"
                                            placeholder="e.g. B.Tech, MBA"
                                        />
                                    </div>
                                    <div className="col-span-1 md:col-span-2">
                                        <label className="block text-sm font-medium text-gray-700 mb-1">Skills *</label>
                                        <input
                                            type="text"
                                            name="skills"
                                            required
                                            value={formData.skills}
                                            onChange={handleChange}
                                            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-colors"
                                            placeholder="e.g. Java, React, Python (Comma separated)"
                                        />
                                    </div>
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-1">Experience (Years) *</label>
                                        <input
                                            type="number"
                                            name="experienceYears"
                                            required
                                            min="0"
                                            value={formData.experienceYears}
                                            onChange={handleChange}
                                            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-colors"
                                        />
                                    </div>
                                </>
                            )}

                            {/* Employer/Consultant Fields */}
                            {(role === 'employer' || role === 'consultant') && (
                                <>
                                    <div className="col-span-1 md:col-span-2">
                                        <label className="block text-sm font-medium text-gray-700 mb-1">
                                            {role === 'employer' ? 'Company Name *' : 'Agency Name *'}
                                        </label>
                                        <input
                                            type="text"
                                            name="companyName"
                                            required
                                            value={formData.companyName}
                                            onChange={handleChange}
                                            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-colors"
                                        />
                                    </div>
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-1">Phone Number *</label>
                                        <input
                                            type="tel"
                                            name="phone"
                                            required
                                            value={formData.phone}
                                            onChange={handleChange}
                                            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-colors"
                                        />
                                    </div>
                                    {role === 'employer' && (
                                        <div>
                                            <label className="block text-sm font-medium text-gray-700 mb-1">Fax</label>
                                            <input
                                                type="text"
                                                name="fax"
                                                value={formData.fax}
                                                onChange={handleChange}
                                                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-colors"
                                            />
                                        </div>
                                    )}
                                    {role === 'consultant' && (
                                        <div>
                                            <label className="block text-sm font-medium text-gray-700 mb-1">Recruitment Experience (Years) *</label>
                                            <input
                                                type="number"
                                                name="experienceYears"
                                                required
                                                min="0"
                                                value={formData.experienceYears}
                                                onChange={handleChange}
                                                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-colors"
                                            />
                                        </div>
                                    )}
                                </>
                            )}

                            {/* Address Fields (Seeker & Employer only) */}
                            {(role === 'seeker' || role === 'employer') && (
                                <>
                                    <div className="col-span-1 md:col-span-2 mt-4">
                                        <h3 className="text-lg font-semibold text-gray-800 border-b pb-2 mb-4 flex items-center">
                                            <span className="bg-indigo-100 text-indigo-800 text-xs font-bold px-2 py-1 rounded mr-2">3</span>
                                            Location Details
                                        </h3>
                                    </div>
                                    <div className="col-span-1 md:col-span-2">
                                        <label className="block text-sm font-medium text-gray-700 mb-1">Address *</label>
                                        <input
                                            type="text"
                                            name="address"
                                            required
                                            value={formData.address}
                                            onChange={handleChange}
                                            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-colors"
                                        />
                                    </div>
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-1">City *</label>
                                        <input
                                            type="text"
                                            name="city"
                                            required
                                            value={formData.city}
                                            onChange={handleChange}
                                            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-colors"
                                        />
                                    </div>
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-1">State *</label>
                                        <input
                                            type="text"
                                            name="state"
                                            required
                                            value={formData.state}
                                            onChange={handleChange}
                                            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-colors"
                                        />
                                    </div>
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-1">Pin Code *</label>
                                        <input
                                            type="text"
                                            name="pinCode"
                                            required
                                            value={formData.pinCode}
                                            onChange={handleChange}
                                            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-colors"
                                        />
                                    </div>
                                </>
                            )}
                        </div>

                        <div className="pt-6">
                            <button
                                type="submit"
                                disabled={loading}
                                className="w-full bg-indigo-600 text-white font-bold py-4 rounded-xl hover:bg-indigo-700 transition-all shadow-lg hover:shadow-xl flex items-center justify-center space-x-2 disabled:opacity-70 disabled:cursor-not-allowed"
                            >
                                {loading ? (
                                    <span>Creating Account...</span>
                                ) : (
                                    <>
                                        <span>Create Account</span>
                                        <ArrowRight size={20} />
                                    </>
                                )}
                            </button>
                        </div>
                    </form>
                </div>
            </div>
        </div>
    );
};

export default Register;
