import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import jobService from '../services/jobService';
import authService from '../services/authService';
import userService from '../services/userService';
import { Briefcase, MapPin, IndianRupee, Clock, Layout, FileText, CheckCircle, Sparkles, Award, Layers, User } from 'lucide-react';

const PostJob = () => {
    const navigate = useNavigate();
    const [loading, setLoading] = useState(false);
    const [employers, setEmployers] = useState([]);
    const [selectedEmployer, setSelectedEmployer] = useState('');

    const currentUser = authService.getCurrentUser();
    const isConsultant = currentUser?.role?.toLowerCase() === 'consultant';

    useEffect(() => {
        if (isConsultant) {
            const fetchEmployers = async () => {
                try {
                    console.log('[PostJob] Fetching employers...');
                    const data = await userService.getEmployers();
                    console.log('[PostJob] Employers received:', data);
                    setEmployers(data);
                } catch (error) {
                    console.error("[PostJob] Failed to fetch employers", error);
                    console.error("[PostJob] Error details:", error.response?.data);
                }
            };
            fetchEmployers();
        }
    }, [isConsultant]);

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        const formData = new FormData(e.target);

        if (isConsultant && !selectedEmployer) {
            alert("Please select an employer.");
            setLoading(false);
            return;
        }

        // --- Validation Logic ---
        // Salary Validation - Must contain numbers
        const salary = formData.get('salary');
        const salaryRegex = /\d/; // Checks if string contains at least one digit
        if (!salaryRegex.test(salary)) {
            alert("Salary range must contain numeric values (e.g., '10k - 20k').");
            setLoading(false);
            return;
        }
        // ------------------------

        const jobData = {
            title: formData.get('title'),
            type: formData.get('type'),
            salary: formData.get('salary'),
            location: formData.get('location'),
            experience: formData.get('experience'),
            skills: formData.get('skills'),
            description: formData.get('description'),
            employerId: isConsultant ? selectedEmployer : null
        };

        try {
            await jobService.postJob(jobData);
            alert("Job Posted Successfully!");
            navigate('/'); // Redirect to dashboard or job list
        } catch (error) {
            console.error("Failed to post job", error);
            alert("Failed to post job. Please try again.");
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="min-h-screen bg-gray-50/50 py-12 px-4 sm:px-6 lg:px-8">
            <div className="max-w-3xl mx-auto">
                <div className="text-center mb-10">
                    <div className="inline-flex items-center justify-center p-3 bg-indigo-100 rounded-xl mb-4 shadow-sm transform hover:scale-105 transition-transform duration-300">
                        <Sparkles className="h-8 w-8 text-indigo-600" />
                    </div>
                    <h2 className="text-4xl font-extrabold text-gray-900 tracking-tight">Post a New Opportunity</h2>
                    <p className="mt-3 text-lg text-gray-600">Find the perfect talent to grow your team</p>
                </div>

                <form onSubmit={handleSubmit} className="bg-white rounded-2xl shadow-xl overflow-hidden border border-gray-100 transition-all hover:shadow-2xl duration-300">
                    <div className="p-8 space-y-8">
                        {/* Consultant: Select Employer */}
                        {isConsultant && (
                            <div className="group bg-indigo-50 p-6 rounded-xl border border-indigo-100">
                                <label className="block text-sm font-bold text-indigo-900 mb-2 flex items-center gap-2">
                                    <User className="h-4 w-4 text-indigo-600" />
                                    Post on behalf of Employer
                                </label>
                                <div className="relative">
                                    <select
                                        value={selectedEmployer}
                                        onChange={(e) => setSelectedEmployer(e.target.value)}
                                        required
                                        className="w-full p-3 bg-white border border-indigo-200 rounded-xl focus:border-indigo-500 focus:ring-4 focus:ring-indigo-500/10 transition-all duration-200 outline-none appearance-none font-medium cursor-pointer text-indigo-900"
                                    >
                                        <option value="">Select an Employer</option>
                                        {employers.map(employer => (
                                            <option key={employer.id} value={employer.id}>
                                                {employer.name} ({employer.company?.name || 'No Company'})
                                            </option>
                                        ))}
                                    </select>
                                    <div className="absolute right-3 top-1/2 transform -translate-y-1/2 pointer-events-none text-indigo-500">
                                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7"></path></svg>
                                    </div>
                                </div>
                                <p className="text-xs text-indigo-600 mt-2">
                                    Select the employer you are hiring for. The job will be linked to their company.
                                </p>
                            </div>
                        )}

                        {/* Job Title */}
                        <div className="group">
                            <label className="block text-sm font-bold text-gray-700 mb-2 flex items-center gap-2 group-focus-within:text-indigo-600 transition-colors">
                                <Briefcase className="h-4 w-4 text-gray-400 group-focus-within:text-indigo-500" />
                                Job Title
                            </label>
                            <input
                                required
                                name="title"
                                type="text"
                                className="w-full p-3 bg-gray-50 border border-gray-200 rounded-xl focus:bg-white focus:border-indigo-500 focus:ring-4 focus:ring-indigo-500/10 transition-all duration-200 outline-none font-medium"
                                placeholder="e.g. Senior Full Stack Developer"
                            />
                        </div>

                        {/* Grid: Type & Salary */}
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            <div className="group">
                                <label className="block text-sm font-bold text-gray-700 mb-2 flex items-center gap-2 group-focus-within:text-indigo-600 transition-colors">
                                    <Clock className="h-4 w-4 text-gray-400 group-focus-within:text-indigo-500" />
                                    Employment Type
                                </label>
                                <div className="relative">
                                    <select name="type" className="w-full p-3 bg-gray-50 border border-gray-200 rounded-xl focus:bg-white focus:border-indigo-500 focus:ring-4 focus:ring-indigo-500/10 transition-all duration-200 outline-none appearance-none font-medium cursor-pointer">
                                        <option>Full-time</option>
                                        <option>Part-time</option>
                                        <option>Contract</option>
                                        <option>Freelance</option>
                                        <option>Internship</option>
                                    </select>
                                    <div className="absolute right-3 top-1/2 transform -translate-y-1/2 pointer-events-none text-gray-500">
                                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7"></path></svg>
                                    </div>
                                </div>
                            </div>
                            <div className="group">
                                <label className="block text-sm font-bold text-gray-700 mb-2 flex items-center gap-2 group-focus-within:text-indigo-600 transition-colors">
                                    <IndianRupee className="h-4 w-4 text-gray-400 group-focus-within:text-indigo-500" />
                                    Salary Range
                                </label>
                                <input
                                    required
                                    name="salary"
                                    type="text"
                                    className="w-full p-3 bg-gray-50 border border-gray-200 rounded-xl focus:bg-white focus:border-indigo-500 focus:ring-4 focus:ring-indigo-500/10 transition-all duration-200 outline-none font-medium"
                                    placeholder="e.g. ₹12L - ₹18L per annum"
                                />
                            </div>
                        </div>

                        {/* Grid: Location & Experience */}
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            <div className="group">
                                <label className="block text-sm font-bold text-gray-700 mb-2 flex items-center gap-2 group-focus-within:text-indigo-600 transition-colors">
                                    <MapPin className="h-4 w-4 text-gray-400 group-focus-within:text-indigo-500" />
                                    Location
                                </label>
                                <input
                                    required
                                    name="location"
                                    type="text"
                                    className="w-full p-3 bg-gray-50 border border-gray-200 rounded-xl focus:bg-white focus:border-indigo-500 focus:ring-4 focus:ring-indigo-500/10 transition-all duration-200 outline-none font-medium"
                                    placeholder="e.g. Bangalore, India (Remote)"
                                />
                            </div>
                            <div className="group">
                                <label className="block text-sm font-bold text-gray-700 mb-2 flex items-center gap-2 group-focus-within:text-indigo-600 transition-colors">
                                    <Award className="h-4 w-4 text-gray-400 group-focus-within:text-indigo-500" />
                                    Experience Required
                                </label>
                                <input
                                    required
                                    name="experience"
                                    type="text"
                                    className="w-full p-3 bg-gray-50 border border-gray-200 rounded-xl focus:bg-white focus:border-indigo-500 focus:ring-4 focus:ring-indigo-500/10 transition-all duration-200 outline-none font-medium"
                                    placeholder="e.g. 3-5 Years"
                                />
                            </div>
                        </div>

                        {/* Skills */}
                        <div className="group">
                            <label className="block text-sm font-bold text-gray-700 mb-2 flex items-center gap-2 group-focus-within:text-indigo-600 transition-colors">
                                <Layers className="h-4 w-4 text-gray-400 group-focus-within:text-indigo-500" />
                                Required Skills
                            </label>
                            <input
                                required
                                name="skills"
                                type="text"
                                className="w-full p-3 bg-gray-50 border border-gray-200 rounded-xl focus:bg-white focus:border-indigo-500 focus:ring-4 focus:ring-indigo-500/10 transition-all duration-200 outline-none font-medium"
                                placeholder="e.g. React, Node.js, TypeScript, AWS (comma separated)"
                            />
                        </div>

                        {/* Description */}
                        <div className="group">
                            <label className="block text-sm font-bold text-gray-700 mb-2 flex items-center gap-2 group-focus-within:text-indigo-600 transition-colors">
                                <FileText className="h-4 w-4 text-gray-400 group-focus-within:text-indigo-500" />
                                Job Description
                            </label>
                            <textarea
                                required
                                name="description"
                                rows="6"
                                className="w-full p-3 bg-gray-50 border border-gray-200 rounded-xl focus:bg-white focus:border-indigo-500 focus:ring-4 focus:ring-indigo-500/10 transition-all duration-200 outline-none font-medium resize-none"
                                placeholder="Outline the key responsibilities, requirements, and benefits..."
                            ></textarea>
                        </div>

                        {/* Submit Button */}
                        <div className="pt-4">
                            <button
                                type="submit"
                                disabled={loading}
                                className={`w-full bg-gradient-to-r from-indigo-600 to-purple-600 text-white py-4 rounded-xl font-bold text-lg shadow-lg hover:shadow-xl transform hover:-translate-y-0.5 transition-all duration-200 flex items-center justify-center gap-2 ${loading ? 'opacity-70 cursor-not-allowed' : ''}`}
                            >
                                {loading ? (
                                    <>
                                        <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white"></div>
                                        Publishing...
                                    </>
                                ) : (
                                    <>
                                        <CheckCircle className="h-5 w-5" />
                                        Publish Job Opportunity
                                    </>
                                )}
                            </button>
                        </div>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default PostJob;
