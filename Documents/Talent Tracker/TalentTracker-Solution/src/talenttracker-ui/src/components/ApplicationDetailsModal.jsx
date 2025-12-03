import React from 'react';
import ReactDOM from 'react-dom';
import { X, MapPin, IndianRupee, Briefcase, Clock, User, CheckCircle, Calendar, Video, Phone, Mail, FileText } from 'lucide-react';
import Badge from './ui/Badge';

const ApplicationDetailsModal = ({ application, isOpen, onClose }) => {
    if (!isOpen || !application) return null;

    const { jobTitle, companyName, status, interview, resumeUrl } = application;

    // Status styling
    const getStatusStyle = (status) => {
        switch (status) {
            case 'Shortlisted': return 'bg-green-50 border-green-200 text-green-800';
            case 'Rejected': return 'bg-red-50 border-red-200 text-red-800';
            case 'Resolved': return 'bg-blue-50 border-blue-200 text-blue-800';
            default: return 'bg-yellow-50 border-yellow-200 text-yellow-800';
        }
    };

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
                                    {jobTitle || "Untitled Job"}
                                </h3>
                                <div className="mt-1 flex items-center text-sm text-gray-500">
                                    <span className="font-medium text-indigo-600">{companyName || "Unknown Company"}</span>
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

                        {/* Application Status */}
                        <div className={`mb-6 p-4 rounded-lg border flex items-center ${getStatusStyle(status)}`}>
                            <div className="flex-1">
                                <p className="text-sm font-bold uppercase tracking-wide opacity-80">Application Status</p>
                                <p className="text-lg font-bold mt-1">{status}</p>
                            </div>
                            {status === 'Shortlisted' && <CheckCircle size={24} />}
                        </div>

                        {/* Interview Details (Only if Shortlisted and interview data exists) */}
                        {status === 'Shortlisted' && interview && (
                            <div className="mb-6 bg-indigo-50 rounded-lg border border-indigo-100 overflow-hidden">
                                <div className="px-4 py-3 bg-indigo-100 border-b border-indigo-200">
                                    <h4 className="text-sm font-bold text-indigo-900 uppercase flex items-center">
                                        <Calendar size={16} className="mr-2" /> Interview Details
                                    </h4>
                                </div>
                                <div className="p-4 grid grid-cols-1 sm:grid-cols-2 gap-4">
                                    <div>
                                        <p className="text-xs text-indigo-500 uppercase font-semibold mb-1">Date & Time</p>
                                        <p className="text-sm font-medium text-gray-900 flex items-center">
                                            <Clock size={14} className="mr-1.5 text-gray-400" />
                                            {interview.date} at {interview.time}
                                        </p>
                                    </div>
                                    <div>
                                        <p className="text-xs text-indigo-500 uppercase font-semibold mb-1">Location / Link</p>
                                        <div className="text-sm font-medium text-gray-900">
                                            {interview.link ? (
                                                <a href={interview.link.startsWith('http') ? interview.link : `https://${interview.link}`} target="_blank" rel="noopener noreferrer" className="text-indigo-600 hover:underline flex items-center">
                                                    <Video size={14} className="mr-1.5" /> Join Meeting
                                                </a>
                                            ) : (
                                                <span className="flex items-center">
                                                    <MapPin size={14} className="mr-1.5 text-gray-400" /> {interview.location || "TBD"}
                                                </span>
                                            )}
                                        </div>
                                    </div>
                                    <div>
                                        <p className="text-xs text-indigo-500 uppercase font-semibold mb-1">Contact Person</p>
                                        <p className="text-sm font-medium text-gray-900 flex items-center">
                                            <User size={14} className="mr-1.5 text-gray-400" />
                                            {interview.contactPerson || "HR Team"}
                                        </p>
                                    </div>
                                    <div>
                                        <p className="text-xs text-indigo-500 uppercase font-semibold mb-1">Contact Info</p>
                                        <div className="space-y-1">
                                            {interview.contactEmail && (
                                                <p className="text-sm font-medium text-gray-900 flex items-center">
                                                    <Mail size={14} className="mr-1.5 text-gray-400" /> {interview.contactEmail}
                                                </p>
                                            )}
                                            {interview.contactPhone && (
                                                <p className="text-sm font-medium text-gray-900 flex items-center">
                                                    <Phone size={14} className="mr-1.5 text-gray-400" /> {interview.contactPhone}
                                                </p>
                                            )}
                                        </div>
                                    </div>
                                    {interview.notes && (
                                        <div className="sm:col-span-2 mt-2 pt-2 border-t border-indigo-200/50">
                                            <p className="text-xs text-indigo-500 uppercase font-semibold mb-1">Notes</p>
                                            <p className="text-sm text-gray-700 bg-white/50 p-2 rounded border border-indigo-100">
                                                {interview.notes}
                                            </p>
                                        </div>
                                    )}
                                </div>
                            </div>
                        )}

                        {/* Resume Used */}
                        <div className="mb-6">
                            <h4 className="text-sm font-bold text-gray-900 uppercase tracking-wide mb-2">Application Details</h4>
                            <div className="flex items-center p-3 bg-gray-50 rounded-lg">
                                <FileText className="text-gray-400 mr-3" size={20} />
                                <div>
                                    <p className="text-xs text-gray-500 uppercase font-semibold">Resume Submitted</p>
                                    {resumeUrl ? (
                                        <a
                                            href={resumeUrl.startsWith('http') ? resumeUrl : `https://${resumeUrl}`}
                                            target="_blank"
                                            rel="noopener noreferrer"
                                            className="text-sm font-medium text-indigo-600 hover:text-indigo-800 hover:underline"
                                            onClick={(e) => {
                                                if (!resumeUrl || resumeUrl === '#') {
                                                    e.preventDefault();
                                                    alert('Invalid resume URL');
                                                }
                                            }}
                                        >
                                            View Resume
                                        </a>
                                    ) : (
                                        <p className="text-sm text-gray-500">No resume attached</p>
                                    )}
                                </div>
                            </div>
                        </div>

                    </div>

                    {/* Footer */}
                    <div className="bg-gray-50 px-4 py-3 sm:px-6 sm:flex sm:flex-row-reverse">
                        <button
                            type="button"
                            onClick={onClose}
                            className="w-full inline-flex justify-center rounded-md border border-gray-300 shadow-sm px-4 py-2 bg-white text-base font-medium text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 sm:ml-3 sm:w-auto sm:text-sm"
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

export default ApplicationDetailsModal;
