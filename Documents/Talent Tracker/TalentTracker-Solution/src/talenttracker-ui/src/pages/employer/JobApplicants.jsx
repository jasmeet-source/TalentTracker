import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import applicationService from '../../services/applicationService';
import jobService from '../../services/jobService';
import InterviewModal from '../../components/InterviewModal';
import { ArrowLeft, CheckCircle, XCircle, Clock, Calendar, FileText, Download } from 'lucide-react';

const JobApplicants = () => {
    const { jobId } = useParams();
    const navigate = useNavigate();
    const [applications, setApplications] = useState([]);
    const [job, setJob] = useState(null);
    const [loading, setLoading] = useState(true);
    const [selectedApp, setSelectedApp] = useState(null);
    const [isInterviewModalOpen, setIsInterviewModalOpen] = useState(false);

    useEffect(() => {
        fetchData();
    }, [jobId]);

    const fetchData = async () => {
        try {
            const [appsData, jobData] = await Promise.all([
                applicationService.getApplicationsByJob(jobId),
                jobService.getJobById(jobId)
            ]);
            setApplications(appsData);
            setJob(jobData);
        } catch (error) {
            console.error("Error fetching data", error);
        } finally {
            setLoading(false);
        }
    };

    const handleStatusUpdate = async (appId, status, interviewDetails = null) => {
        try {
            await applicationService.updateStatus(appId, status, interviewDetails);
            fetchData(); // Refresh list
            setIsInterviewModalOpen(false);
            setSelectedApp(null);
            alert(`Application status updated to ${status}`);
        } catch (error) {
            console.error("Error updating status", error);
            alert("Failed to update status.");
        }
    };

    const openInterviewModal = (app) => {
        setSelectedApp(app);
        setIsInterviewModalOpen(true);
    };

    const handleShortlist = (interviewData) => {
        if (selectedApp) {
            handleStatusUpdate(selectedApp.id, 'Shortlisted', interviewData);
        }
    };

    const handleReject = (appId) => {
        if (window.confirm("Are you sure you want to reject this candidate?")) {
            handleStatusUpdate(appId, 'Rejected');
        }
    };

    const getStatusBadge = (status) => {
        switch (status) {
            case 'Shortlisted':
                return <span className="flex items-center text-green-600 bg-green-50 px-2 py-1 rounded-full text-xs font-medium"><CheckCircle size={14} className="mr-1" /> Shortlisted</span>;
            case 'Pending':
                return <span className="flex items-center text-yellow-600 bg-yellow-50 px-2 py-1 rounded-full text-xs font-medium"><Clock size={14} className="mr-1" /> Pending</span>;
            case 'Rejected':
                return <span className="flex items-center text-red-600 bg-red-50 px-2 py-1 rounded-full text-xs font-medium"><XCircle size={14} className="mr-1" /> Rejected</span>;
            default:
                return <span className="text-gray-500 text-xs">{status}</span>;
        }
    };

    if (loading) return <div className="p-8 text-center text-gray-500">Loading applicants...</div>;

    return (
        <div className="space-y-6">
            <div className="flex items-center space-x-4">
                <button onClick={() => navigate(-1)} className="p-2 hover:bg-gray-100 rounded-full text-gray-600">
                    <ArrowLeft size={24} />
                </button>
                <div>
                    <h1 className="text-2xl font-bold text-gray-900">Applicants</h1>
                    <p className="text-gray-500">For job: <span className="font-medium text-gray-900">{job?.title}</span></p>
                </div>
            </div>

            <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
                <div className="overflow-x-auto">
                    <table className="w-full text-left">
                        <thead className="bg-gray-50 border-b border-gray-100">
                            <tr>
                                <th className="px-6 py-4 font-semibold text-gray-700 text-sm">Candidate</th>
                                <th className="px-6 py-4 font-semibold text-gray-700 text-sm">Applied Date</th>
                                <th className="px-6 py-4 font-semibold text-gray-700 text-sm">Resume</th>
                                <th className="px-6 py-4 font-semibold text-gray-700 text-sm">Status</th>
                                <th className="px-6 py-4 font-semibold text-gray-700 text-sm text-right">Actions</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-gray-100">
                            {applications.length === 0 ? (
                                <tr>
                                    <td colSpan="5" className="px-6 py-8 text-center text-gray-500">No applications yet.</td>
                                </tr>
                            ) : (
                                applications.map(app => (
                                    <tr key={app.id} className="hover:bg-gray-50 transition-colors">
                                        <td className="px-6 py-4">
                                            <div className="flex items-center space-x-3">
                                                <div className="h-10 w-10 rounded-full bg-indigo-100 flex items-center justify-center text-indigo-600 font-bold">
                                                    {app.applicantName?.charAt(0)}
                                                </div>
                                                <div>
                                                    <p className="font-medium text-gray-900">{app.applicantName}</p>
                                                    <p className="text-xs text-gray-400">ID: {app.applicantId}</p>
                                                </div>
                                            </div>
                                        </td>
                                        <td className="px-6 py-4 text-sm text-gray-500">
                                            {new Date(app.dateApplied).toLocaleDateString()}
                                        </td>
                                        <td className="px-6 py-4">
                                            {app.resumeUrl ? (
                                                <a
                                                    href={`http://localhost:5000${app.resumeUrl}`}
                                                    target="_blank"
                                                    rel="noopener noreferrer"
                                                    className="flex items-center text-indigo-600 hover:text-indigo-800 text-sm font-medium"
                                                >
                                                    <FileText size={16} className="mr-1" /> View Resume
                                                </a>
                                            ) : (
                                                <span className="text-gray-400 text-sm">No Resume</span>
                                            )}
                                        </td>
                                        <td className="px-6 py-4">
                                            {getStatusBadge(app.status)}
                                            {app.status === 'Shortlisted' && app.interview && (
                                                <div className="mt-1 text-xs text-gray-500 flex items-center">
                                                    <Calendar size={12} className="mr-1" />
                                                    {app.interview.date} at {app.interview.time}
                                                </div>
                                            )}
                                        </td>
                                        <td className="px-6 py-4 text-right space-x-2">
                                            {app.status === 'Pending' && (
                                                <>
                                                    <button
                                                        onClick={() => openInterviewModal(app)}
                                                        className="px-3 py-1.5 bg-indigo-600 text-white text-xs font-medium rounded-lg hover:bg-indigo-700 transition-colors"
                                                    >
                                                        Shortlist
                                                    </button>
                                                    <button
                                                        onClick={() => handleReject(app.id)}
                                                        className="px-3 py-1.5 bg-white border border-gray-300 text-gray-700 text-xs font-medium rounded-lg hover:bg-gray-50 transition-colors"
                                                    >
                                                        Reject
                                                    </button>
                                                </>
                                            )}
                                        </td>
                                    </tr>
                                ))
                            )}
                        </tbody>
                    </table>
                </div>
            </div>

            <InterviewModal
                isOpen={isInterviewModalOpen}
                onClose={() => setIsInterviewModalOpen(false)}
                onSubmit={handleShortlist}
            />
        </div>
    );
};

export default JobApplicants;
