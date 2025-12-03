import React from 'react';
import ReactDOM from 'react-dom';
import { X, MapPin, IndianRupee, Briefcase, Clock, User, CheckCircle } from 'lucide-react';
import Badge from './ui/Badge';
import { useAuth } from '../context/AuthContext';

const JobDetailsModal = ({ job, isOpen, onClose, onApply }) => {
    const { user } = useAuth();
    if (!isOpen || !job) return null;

    const isApplied = job.applicationStatus === 'Applied' || job.applicationStatus === 'Shortlisted' || job.applicationStatus === 'Rejected' || job.applicationStatus === 'Pending';
    const isSeeker = user?.role?.toLowerCase() === 'seeker';

    const modalContent = (
        <div className="fixed inset-0 z-50 overflow-y-auto" aria-labelledby="modal-title" role="dialog" aria-modal="true">
            <div className="flex items-end justify-center min-h-screen pt-4 px-4 pb-20 text-center sm:block sm:p-0">
                {/* Background overlay */}
                <div
                    className="fixed inset-0 bg-black/30 backdrop-blur-sm transition-opacity"
                    aria-hidden="true"
                    onClick={onClose}
                ></div>

                {/* Modal panel */}
                <span className="hidden sm:inline-block sm:align-middle sm:h-screen" aria-hidden="true">&#8203;</span>
                <div className="inline-block align-bottom bg-white rounded-lg text-left overflow-hidden shadow-xl transform transition-all sm:my-8 sm:align-middle sm:max-w-2xl w-full relative z-50">

                    {/* Header */}
                    <div className="bg-white px-4 pt-5 pb-4 sm:p-6 sm:pb-4 border-b border-gray-100">
                        <div className="flex justify-between items-start">
                            <div>
                                <h3 className="text-2xl font-bold text-gray-900" id="modal-title">
                                    {job.title || "Untitled Job"}
                                </h3>
                                <div className="mt-1 flex items-center text-sm text-gray-500">
                                    <span className="font-medium text-indigo-600">{job.companyName || "Unknown Company"}</span>
                                    <span className="mx-2">•</span>
                                    <span>{job.location || "Remote"}</span>
                                </div>
                            </div>
                            <button
                                onClick={onClose}
                                className="bg-white rounded-md text-gray-400 hover:text-gray-500 focus:outline-none"
                            >
                                <span className="sr-only">Close</span>
                                <X size={24} />
                            </button>
                        </div>
                    </div>

                    {/* Content */}
                    <div className="px-4 py-5 sm:p-6">
                        {/* Key Details Grid */}
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-6">
                            <div className="flex items-center p-3 bg-gray-50 rounded-lg">
                                <IndianRupee className="text-gray-400 mr-3" size={20} />
                                <div>
                                    <p className="text-xs text-gray-500 uppercase font-semibold">Salary</p>
                                    <p className="text-sm font-medium text-gray-900">{job.salary || "Not specified"}</p>
                                </div>
                            </div>
                            <div className="flex items-center p-3 bg-gray-50 rounded-lg">
                                <Briefcase className="text-gray-400 mr-3" size={20} />
                                <div>
                                    <p className="text-xs text-gray-500 uppercase font-semibold">Experience</p>
                                    <p className="text-sm font-medium text-gray-900">{job.experience || "Not specified"}</p>
                                </div>
                            </div>
                            <div className="flex items-center p-3 bg-gray-50 rounded-lg">
                                <Clock className="text-gray-400 mr-3" size={20} />
                                <div>
                                    <p className="text-xs text-gray-500 uppercase font-semibold">Job Type</p>
                                    <p className="text-sm font-medium text-gray-900">{job.type || "Full-time"}</p>
                                </div>
                            </div>
                            <div className="flex items-center p-3 bg-gray-50 rounded-lg">
                                <User className="text-gray-400 mr-3" size={20} />
                                <div>
                                    <p className="text-xs text-gray-500 uppercase font-semibold">HR Contact</p>
                                    <p className="text-sm font-medium text-gray-900">{job.postedByName || "Hiring Team"}</p>
                                </div>
                            </div>
                        </div>

                        {/* Description */}
                        <div className="mb-6">
                            <h4 className="text-sm font-bold text-gray-900 uppercase tracking-wide mb-2">Job Description</h4>
                            <div className="text-sm text-gray-600 space-y-2 whitespace-pre-line">
                                {typeof job.description === 'string' ? job.description : "No description available"}
                            </div>
                        </div>

                        {/* Skills */}
                        <div className="mb-6">
                            <h4 className="text-sm font-bold text-gray-900 uppercase tracking-wide mb-2">Required Skills</h4>
                            <div className="flex flex-wrap gap-2">
                                {job.skills && Array.isArray(job.skills) && job.skills.map((skill, index) => {
                                    const skillText = typeof skill === 'string' ? skill : String(skill);
                                    return <Badge key={index} color="blue">{skillText}</Badge>;
                                })}
                                {job.skills && typeof job.skills === 'string' && job.skills.split(',').map((skill, index) => (
                                    <Badge key={index} color="blue">{skill.trim()}</Badge>
                                ))}
                                {!job.skills && <span className="text-sm text-gray-500">No specific skills listed</span>}
                            </div>
                        </div>

                        {/* Application Status */}
                        {job.applicationStatus && (
                            <div className="mb-6 p-4 bg-indigo-50 rounded-lg border border-indigo-100 flex items-center">
                                <CheckCircle className="text-indigo-600 mr-3" size={20} />
                                <div>
                                    <p className="text-sm font-bold text-indigo-900">Application Status</p>
                                    <p className="text-sm text-indigo-700">
                                        You have <span className="font-bold">{job.applicationStatus}</span> for this position.
                                    </p>
                                </div>
                            </div>
                        )}
                    </div>

                    {/* Footer */}
                    <div className="bg-gray-50 px-4 py-3 sm:px-6 sm:flex sm:flex-row-reverse">
                        {isSeeker && (
                            <button
                                type="button"
                                disabled={isApplied}
                                onClick={() => {
                                    onApply(job.id);
                                    onClose();
                                }}
                                className={`w-full inline-flex justify-center rounded-md border border-transparent shadow-sm px-4 py-2 text-base font-medium text-white sm:ml-3 sm:w-auto sm:text-sm
                                    ${isApplied
                                        ? 'bg-gray-400 cursor-not-allowed'
                                        : 'bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500'
                                    }`}
                            >
                                {isApplied ? 'Applied' : 'Apply Now'}
                            </button>
                        )}
                        <button
                            type="button"
                            onClick={onClose}
                            className="mt-3 w-full inline-flex justify-center rounded-md border border-gray-300 shadow-sm px-4 py-2 bg-white text-base font-medium text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 sm:mt-0 sm:ml-3 sm:w-auto sm:text-sm"
                        >
                            Close
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );

    return ReactDOM.createPortal(modalContent, document.body);
};

export default JobDetailsModal;
