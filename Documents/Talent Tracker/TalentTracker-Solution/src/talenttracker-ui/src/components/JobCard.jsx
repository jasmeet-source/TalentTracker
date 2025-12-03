import React from 'react';
import { Building, MapPin, Star } from 'lucide-react';
import Badge from './ui/Badge';

const JobCard = ({ job, companyName, onApply, onViewDetails, onClose, onViewApplicants }) => {
    return (
        <div className={`bg-white p-6 rounded-lg shadow-sm border transition hover:shadow-md ${job.isPerfectMatch ? 'border-indigo-300 ring-1 ring-indigo-300' : 'border-gray-100'} ${job.status === 'Closed' ? 'opacity-60 bg-gray-50' : ''}`}>
            <div className="flex justify-between items-start">
                <div>
                    <div className="flex items-center space-x-2">
                        <h3 className="text-lg font-bold text-indigo-700">{job.title}</h3>
                        {job.status === 'Closed' && <Badge color="red">Closed</Badge>}
                        {job.isPerfectMatch && (
                            <span className="bg-indigo-100 text-indigo-700 text-xs font-bold px-2 py-0.5 rounded-full flex items-center">
                                <Star size={12} className="fill-current mr-1" /> Perfect Match
                            </span>
                        )}
                    </div>
                    <div className="flex items-center space-x-2 text-sm text-gray-600 mt-1">
                        <Building size={14} />
                        <span>{companyName || "Unknown Company"}</span>
                        <span className="mx-2">•</span>
                        <MapPin size={14} />
                        <span>{job.location}</span>
                    </div>
                </div>
            </div>
            <div className="mt-4 flex flex-wrap gap-2">
                <Badge color="gray">{job.type}</Badge>
                <Badge color="green">{job.salary}</Badge>
            </div>
            <p className="mt-4 text-sm text-gray-600 line-clamp-2">{job.description}</p>

            <div className="mt-6 pt-4 border-t border-gray-50 flex items-center justify-between">
                <span className="text-xs text-gray-400">Posted {new Date(job.createdAt).toLocaleDateString()}</span>
                <div className="flex space-x-3">
                    <button
                        onClick={() => onViewDetails && onViewDetails(job.id)}
                        className="px-4 py-2 text-indigo-600 hover:bg-indigo-50 rounded-md text-sm font-medium transition"
                    >
                        View Details
                    </button>
                    {onApply && (
                        (() => {
                            const isApplied = job.applicationStatus === 'Applied' || job.applicationStatus === 'Shortlisted' || job.applicationStatus === 'Rejected' || job.applicationStatus === 'Pending';
                            return (
                                <button
                                    onClick={() => !isApplied && onApply(job.id)}
                                    disabled={isApplied}
                                    className={`px-6 py-2 rounded-md shadow-sm transition text-sm font-medium ${isApplied
                                        ? 'bg-gray-400 text-white cursor-not-allowed'
                                        : 'bg-indigo-600 text-white hover:bg-indigo-700'
                                        }`}
                                >
                                    {isApplied ? 'Applied' : 'Apply Now'}
                                </button>
                            );
                        })()
                    )}
                    {/* Show Close Job button if onClose is provided (Employer View) and job is Open */}
                    {job.status === 'Open' && typeof onClose === 'function' && (
                        <button
                            onClick={() => onClose(job.id)}
                            className="px-6 py-2 bg-red-600 text-white rounded-md hover:bg-red-700 shadow-sm transition text-sm font-medium"
                        >
                            Close Job
                        </button>
                    )}
                    {/* Show View Applicants button if onViewApplicants is provided */}
                    {typeof onViewApplicants === 'function' && (
                        <button
                            onClick={() => onViewApplicants(job.id)}
                            className="px-6 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 shadow-sm transition text-sm font-medium"
                        >
                            View Applicants
                        </button>
                    )}
                </div>
            </div>
        </div>
    );
};

export default JobCard;
