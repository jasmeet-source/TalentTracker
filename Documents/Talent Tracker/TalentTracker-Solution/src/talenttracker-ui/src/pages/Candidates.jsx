import React, { useState, useEffect } from 'react';
import { Star, FileText, CheckCircle, XCircle, Clock, MoreVertical, Search, Filter, ChevronDown, User } from 'lucide-react';
import applicationService from '../services/applicationService';
import jobService from '../services/jobService';
import { useAuth } from '../context/AuthContext';
import ShortlistModal from '../components/ShortlistModal';

const Candidates = () => {
    const [applications, setApplications] = useState([]);
    const [jobs, setJobs] = useState([]);
    const [loading, setLoading] = useState(true);
    const [selectedApplication, setSelectedApplication] = useState(null);
    const [isShortlistModalOpen, setIsShortlistModalOpen] = useState(false);
    const { user } = useAuth();
    const [filterStatus, setFilterStatus] = useState('All');

    useEffect(() => {
        const fetchData = async () => {
            try {
                if (user.companyId) {
                    const companyJobs = await jobService.getJobsByCompany(user.companyId);
                    setJobs(companyJobs);

                    const allApps = [];
                    for (const job of companyJobs) {
                        const jobApps = await applicationService.getApplicationsByJob(job.id);
                        const enhancedApps = jobApps.map(app => ({ ...app, jobTitle: job.title, jobDescription: job.description }));
                        allApps.push(...enhancedApps);
                    }
                    setApplications(allApps);
                }
            } catch (error) {
                console.error("Failed to load candidates", error);
            } finally {
                setLoading(false);
            }
        };

        if (user) {
            fetchData();
        }
    }, [user]);

    const handleStatusChange = async (appId, newStatus) => {
        if (newStatus === 'Shortlisted') {
            const app = applications.find(a => a.id === appId);
            setSelectedApplication(app);
            setIsShortlistModalOpen(true);
        } else {
            try {
                await applicationService.updateStatus(appId, newStatus);
                setApplications(applications.map(app =>
                    app.id === appId ? { ...app, status: newStatus } : app
                ));
            } catch (error) {
                console.error("Failed to update status", error);
                alert("Failed to update status");
            }
        }
    };

    const handleShortlistSubmit = async (interviewDetails) => {
        try {
            await applicationService.updateStatus(selectedApplication.id, 'Shortlisted', interviewDetails);
            setApplications(applications.map(app =>
                app.id === selectedApplication.id ? { ...app, status: 'Shortlisted', interview: interviewDetails } : app
            ));
            setIsShortlistModalOpen(false);
            setSelectedApplication(null);
            alert("Candidate shortlisted successfully!");
        } catch (error) {
            console.error("Failed to shortlist candidate", error);
            alert("Failed to shortlist candidate");
        }
    };

    const getStatusBadge = (status) => {
        switch (status) {
            case 'Shortlisted':
                return <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-emerald-100 text-emerald-800"><CheckCircle size={12} className="mr-1" /> Shortlisted</span>;
            case 'Rejected':
                return <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-rose-100 text-rose-800"><XCircle size={12} className="mr-1" /> Rejected</span>;
            default:
                return <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-gray-100 text-gray-800"><Clock size={12} className="mr-1" /> Pending</span>;
        }
    };

    const filteredApplications = filterStatus === 'All'
        ? applications
        : applications.filter(app => app.status === filterStatus);

    if (loading) return (
        <div className="flex justify-center items-center h-64">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-600"></div>
        </div>
    );

    return (
        <div className="space-y-8 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div>
                    <h1 className="text-3xl font-bold text-gray-900 tracking-tight">Manage Candidates</h1>
                    <p className="text-gray-500 mt-1">Review and manage applications for your job postings</p>
                </div>
                <div className="flex items-center gap-3">
                    <div className="bg-white px-4 py-2 rounded-lg border border-gray-200 shadow-sm text-sm font-medium text-gray-600">
                        Total: <span className="text-indigo-600 font-bold ml-1">{applications.length}</span>
                    </div>
                </div>
            </div>

            <div className="bg-white rounded-2xl shadow-sm border border-gray-200 overflow-hidden">
                {/* Filters & Search Header */}
                <div className="p-5 border-b border-gray-100 bg-gray-50/50 flex flex-col sm:flex-row justify-between items-center gap-4">
                    <div className="relative w-full sm:w-96">
                        <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={18} />
                        <input
                            type="text"
                            placeholder="Search candidates..."
                            className="w-full pl-10 pr-4 py-2 border border-gray-200 rounded-xl focus:ring-2 focus:ring-indigo-500 focus:border-transparent text-sm"
                        />
                    </div>
                    <div className="flex items-center gap-2 w-full sm:w-auto">
                        <Filter size={16} className="text-gray-400" />
                        <select
                            className="border-none bg-transparent text-sm font-medium text-gray-600 focus:ring-0 cursor-pointer"
                            value={filterStatus}
                            onChange={(e) => setFilterStatus(e.target.value)}
                        >
                            <option value="All">All Status</option>
                            <option value="Pending">Pending</option>
                            <option value="Shortlisted">Shortlisted</option>
                            <option value="Rejected">Rejected</option>
                        </select>
                    </div>
                </div>

                {/* Desktop Table View */}
                <div className="hidden md:block overflow-x-auto">
                    <table className="min-w-full divide-y divide-gray-200">
                        <thead className="bg-gray-50">
                            <tr>
                                <th scope="col" className="px-6 py-3 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">Candidate</th>
                                <th scope="col" className="px-6 py-3 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">Applied For</th>
                                <th scope="col" className="px-6 py-3 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">Status</th>
                                <th scope="col" className="px-6 py-3 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">Resume</th>
                                <th scope="col" className="px-6 py-3 text-right text-xs font-semibold text-gray-500 uppercase tracking-wider">Actions</th>
                            </tr>
                        </thead>
                        <tbody className="bg-white divide-y divide-gray-200">
                            {filteredApplications.map((app) => (
                                <tr key={app.id} className="hover:bg-gray-50 transition-colors">
                                    <td className="px-6 py-4 whitespace-nowrap">
                                        <div className="flex items-center">
                                            <div className="h-10 w-10 rounded-full bg-indigo-100 flex items-center justify-center text-indigo-600 font-bold text-sm">
                                                {app.applicantName?.charAt(0)}
                                            </div>
                                            <div className="ml-4">
                                                <div className="text-sm font-medium text-gray-900">{app.applicantName}</div>
                                                <div className="text-xs text-gray-500">{app.applicantEmail || 'No email'}</div>
                                            </div>
                                        </div>
                                    </td>
                                    <td className="px-6 py-4 whitespace-nowrap">
                                        <div className="text-sm text-gray-900">{app.jobTitle}</div>
                                        <div className="text-xs text-gray-500">Applied: {new Date(app.appliedDate).toLocaleDateString()}</div>
                                    </td>
                                    <td className="px-6 py-4 whitespace-nowrap">
                                        {getStatusBadge(app.status)}
                                    </td>
                                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                                        {app.resumeUrl ? (
                                            <a
                                                href={app.resumeUrl.startsWith('http') ? app.resumeUrl : `https://${app.resumeUrl}`}
                                                target="_blank"
                                                rel="noopener noreferrer"
                                                className="inline-flex items-center px-3 py-1 rounded-lg border border-gray-200 text-gray-700 hover:bg-gray-50 hover:text-indigo-600 transition-colors text-xs font-medium"
                                            >
                                                <FileText size={14} className="mr-1.5" /> View
                                            </a>
                                        ) : (
                                            <span className="text-gray-400 text-xs italic">Not available</span>
                                        )}
                                    </td>
                                    <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                                        <div className="flex justify-end gap-2">
                                            {app.status === 'Pending' && (
                                                <>
                                                    <button
                                                        onClick={() => handleStatusChange(app.id, 'Shortlisted')}
                                                        className="p-1.5 text-emerald-600 hover:bg-emerald-50 rounded-lg transition-colors"
                                                        title="Shortlist"
                                                    >
                                                        <CheckCircle size={18} />
                                                    </button>
                                                    <button
                                                        onClick={() => handleStatusChange(app.id, 'Rejected')}
                                                        className="p-1.5 text-rose-600 hover:bg-rose-50 rounded-lg transition-colors"
                                                        title="Reject"
                                                    >
                                                        <XCircle size={18} />
                                                    </button>
                                                </>
                                            )}
                                            {app.status !== 'Pending' && (
                                                <span className="text-gray-400 text-xs">No actions</span>
                                            )}
                                        </div>
                                    </td>
                                </tr>
                            ))}
                            {filteredApplications.length === 0 && (
                                <tr>
                                    <td colSpan="5" className="px-6 py-12 text-center text-gray-500">
                                        <div className="flex flex-col items-center justify-center">
                                            <User size={48} className="text-gray-200 mb-4" />
                                            <p className="text-lg font-medium text-gray-900">No candidates found</p>
                                            <p className="text-sm text-gray-500">Try adjusting your search or filters.</p>
                                        </div>
                                    </td>
                                </tr>
                            )}
                        </tbody>
                    </table>
                </div>

                {/* Mobile Card View */}
                <div className="md:hidden">
                    <ul className="divide-y divide-gray-200">
                        {filteredApplications.map((app) => (
                            <li key={app.id} className="p-4 hover:bg-gray-50 transition-colors">
                                <div className="flex items-center justify-between mb-3">
                                    <div className="flex items-center">
                                        <div className="h-10 w-10 rounded-full bg-indigo-100 flex items-center justify-center text-indigo-600 font-bold text-sm">
                                            {app.applicantName?.charAt(0)}
                                        </div>
                                        <div className="ml-3">
                                            <div className="text-sm font-medium text-gray-900">{app.applicantName}</div>
                                            <div className="text-xs text-gray-500">{app.jobTitle}</div>
                                        </div>
                                    </div>
                                    {getStatusBadge(app.status)}
                                </div>

                                <div className="flex justify-between items-center mt-4">
                                    {app.resumeUrl ? (
                                        <a
                                            href={app.resumeUrl.startsWith('http') ? app.resumeUrl : `https://${app.resumeUrl}`}
                                            target="_blank"
                                            rel="noopener noreferrer"
                                            className="text-indigo-600 text-xs font-medium flex items-center"
                                        >
                                            <FileText size={14} className="mr-1" /> Resume
                                        </a>
                                    ) : (
                                        <span className="text-gray-400 text-xs italic">No Resume</span>
                                    )}

                                    <div className="flex gap-2">
                                        {app.status === 'Pending' && (
                                            <>
                                                <button
                                                    onClick={() => handleStatusChange(app.id, 'Shortlisted')}
                                                    className="px-3 py-1.5 bg-emerald-50 text-emerald-700 rounded-lg text-xs font-medium border border-emerald-100"
                                                >
                                                    Shortlist
                                                </button>
                                                <button
                                                    onClick={() => handleStatusChange(app.id, 'Rejected')}
                                                    className="px-3 py-1.5 bg-rose-50 text-rose-700 rounded-lg text-xs font-medium border border-rose-100"
                                                >
                                                    Reject
                                                </button>
                                            </>
                                        )}
                                    </div>
                                </div>
                            </li>
                        ))}
                        {filteredApplications.length === 0 && (
                            <li className="p-8 text-center text-gray-500">
                                No candidates found.
                            </li>
                        )}
                    </ul>
                </div>
            </div>

            <ShortlistModal
                isOpen={isShortlistModalOpen}
                onClose={() => setIsShortlistModalOpen(false)}
                onSubmit={handleShortlistSubmit}
                candidateName={selectedApplication?.applicantName}
            />
        </div>
    );
};

export default Candidates;
