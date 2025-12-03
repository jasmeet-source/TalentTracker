import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { Briefcase, CheckCircle, Info, Eye, EyeOff } from 'lucide-react';

const Login = () => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [showPassword, setShowPassword] = useState(false);
    const [role, setRole] = useState('seeker');
    const [error, setError] = useState('');
    const { login, user } = useAuth();
    const navigate = useNavigate();

    // Redirect if already logged in
    if (user) {
        navigate('/');
        return null;
    }

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError('');
        try {
            await login(email, password, role);
            navigate('/');
        } catch (err) {
            console.error("Login Error:", err);
            setError(err.response?.data?.message || err.message || 'Login failed. Please try again.');
        }
    };

    return (
        <div className="min-h-screen bg-slate-50 flex items-center justify-center p-4 font-sans">
            <div className="max-w-5xl w-full bg-white rounded-2xl shadow-2xl overflow-hidden flex flex-col md:flex-row">
                {/* Left Side: Branding */}
                <div className="md:w-5/12 bg-indigo-900 p-10 flex flex-col justify-between text-white relative overflow-hidden">
                    <div className="relative z-10">
                        <div className="flex items-center space-x-2 mb-6">
                            <div className="w-10 h-10 bg-indigo-500 rounded-lg flex items-center justify-center">
                                <Briefcase className="text-white" size={24} />
                            </div>
                            <span className="text-2xl font-bold tracking-tight">Talent Tracker</span>
                        </div>
                        <h1 className="text-4xl font-bold leading-tight mb-4">Your Gateway to Perfect Job Opportunities.</h1>
                        <p className="text-indigo-200 text-lg">Streamline recruitment, manage applications, and find your dream career.</p>
                    </div>

                    <div className="mt-8 relative z-10 space-y-4">
                        <div className="flex items-center text-sm text-indigo-300">
                            <CheckCircle size={16} className="mr-3 text-emerald-400" />
                            <span>Smart Resume Matching</span>
                        </div>
                        <div className="flex items-center text-sm text-indigo-300">
                            <CheckCircle size={16} className="mr-3 text-emerald-400" />
                            <span>Real-time Application Tracking</span>
                        </div>
                        <div className="flex items-center text-sm text-indigo-300">
                            <CheckCircle size={16} className="mr-3 text-emerald-400" />
                            <span>Integrated Consultancy Portal</span>
                        </div>
                    </div>

                    {/* Decorative circles */}
                    <div className="absolute top-0 right-0 -mr-20 -mt-20 w-64 h-64 bg-indigo-800 rounded-full opacity-50 blur-3xl"></div>
                    <div className="absolute bottom-0 left-0 -ml-20 -mb-20 w-80 h-80 bg-blue-900 rounded-full opacity-50 blur-3xl"></div>
                </div>

                {/* Right Side: Login Form */}
                <div className="md:w-7/12 p-10 bg-white">
                    <div className="max-w-md mx-auto">
                        <div className="text-center mb-8">
                            <h2 className="text-2xl font-bold text-gray-900">Sign in to your account</h2>
                            <p className="text-sm text-gray-500 mt-2">Welcome back! Please enter your details.</p>
                        </div>

                        {error && (
                            <div className="bg-red-50 text-red-600 p-3 rounded mb-4 text-sm">
                                {error}
                            </div>
                        )}

                        <form onSubmit={handleSubmit} className="space-y-4 mb-8">
                            <div>
                                <label className="block text-xs font-semibold text-gray-700 uppercase tracking-wider mb-1">I am a...</label>
                                <select
                                    value={role}
                                    onChange={(e) => setRole(e.target.value)}
                                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-colors bg-white"
                                >
                                    <option value="seeker">Job Seeker</option>
                                    <option value="employer">Employer</option>
                                    <option value="consultant">Consultant</option>
                                    <option value="admin">Administrator</option>
                                </select>
                            </div>
                            <div>
                                <label className="block text-xs font-semibold text-gray-700 uppercase tracking-wider mb-1">Email or Username</label>
                                <input
                                    required
                                    type="text"
                                    value={email}
                                    onChange={(e) => setEmail(e.target.value)}
                                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-colors"
                                    placeholder="email@example.com or username"
                                />
                            </div>
                            <div>
                                <label className="block text-xs font-semibold text-gray-700 uppercase tracking-wider mb-1">Password</label>
                                <div className="relative">
                                    <input
                                        required
                                        type={showPassword ? "text" : "password"}
                                        value={password}
                                        onChange={(e) => setPassword(e.target.value)}
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
                            <button type="submit" className="w-full bg-indigo-600 text-white font-bold py-3 rounded-lg hover:bg-indigo-700 transition-colors">
                                Sign In
                            </button>

                            <div className="mt-4 text-center">
                                <p className="text-sm text-gray-600">
                                    Don't have an account?{' '}
                                    <Link to="/register" className="font-medium text-indigo-600 hover:text-indigo-500">
                                        Create an account
                                    </Link>
                                </p>
                            </div>
                        </form>

                        {/* Reference Credentials Box */}
                        <div className="relative mb-6">
                            <div className="absolute inset-0 flex items-center">
                                <div className="w-full border-t border-gray-200"></div>
                            </div>
                            <div className="relative flex justify-center text-sm">
                                <span className="px-2 bg-white text-gray-500 font-medium">Reference Credentials</span>
                            </div>
                        </div>

                        {/* Reference Credentials Box */}
                        <div className="bg-gray-50 p-4 rounded-lg border border-gray-200 text-xs text-gray-600 space-y-2">
                            <div className="flex items-start">
                                <Info size={14} className="mr-2 mt-0.5 text-blue-500 flex-shrink-0" />
                                <p className="font-semibold">Password for all accounts: <span className="font-mono bg-gray-200 px-1 rounded">pass123</span></p>
                            </div>
                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-x-4 gap-y-4 mt-2">
                                <div>
                                    <span className="font-bold block text-gray-800 mb-1">Job Seeker:</span>
                                    <div className="flex flex-col space-y-0.5">
                                        <div className="flex flex-wrap items-center gap-2">
                                            <span className="font-mono select-all bg-white border border-gray-200 px-1.5 rounded text-gray-700 font-medium">aryan</span>
                                            <span className="text-gray-400 hidden sm:inline">/</span>
                                            <span className="font-mono select-all text-[10px] text-gray-500 break-all">aryan@seeker.com</span>
                                        </div>
                                    </div>
                                </div>
                                <div>
                                    <span className="font-bold block text-gray-800 mb-1">Employer:</span>
                                    <div className="flex flex-col space-y-0.5">
                                        <div className="flex flex-wrap items-center gap-2">
                                            <span className="font-mono select-all bg-white border border-gray-200 px-1.5 rounded text-gray-700 font-medium">priya</span>
                                            <span className="text-gray-400 hidden sm:inline">/</span>
                                            <span className="font-mono select-all text-[10px] text-gray-500 break-all">priya@techflow.com</span>
                                        </div>
                                    </div>
                                </div>
                                <div>
                                    <span className="font-bold block text-gray-800 mb-1">Admin:</span>
                                    <div className="flex flex-col space-y-0.5">
                                        <div className="flex flex-wrap items-center gap-2">
                                            <span className="font-mono select-all bg-white border border-gray-200 px-1.5 rounded text-gray-700 font-medium">admin</span>
                                            <span className="text-gray-400 hidden sm:inline">/</span>
                                            <span className="font-mono select-all text-[10px] text-gray-500 break-all">admin@talenttracker.com</span>
                                        </div>
                                    </div>
                                </div>
                                <div>
                                    <span className="font-bold block text-gray-800 mb-1">Consultant:</span>
                                    <div className="flex flex-col space-y-0.5">
                                        <div className="flex flex-wrap items-center gap-2">
                                            <span className="font-mono select-all bg-white border border-gray-200 px-1.5 rounded text-gray-700 font-medium">consultant</span>
                                            <span className="text-gray-400 hidden sm:inline">/</span>
                                            <span className="font-mono select-all text-[10px] text-gray-500 break-all">consultant@talenttracker.com</span>
                                        </div>
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

export default Login;
