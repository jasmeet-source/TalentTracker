import React, { useState, useEffect } from 'react';
import { Search, Filter } from 'lucide-react';
import jobService from '../services/jobService';
import applicationService from '../services/applicationService';
import JobCard from '../components/JobCard';
import JobDetailsModal from '../components/JobDetailsModal';
import { useAuth } from '../context/AuthContext';

const Jobs = () => {
    const { user } = useAuth();
    const [jobs, setJobs] = useState([]);
    const [filteredJobs, setFilteredJobs] = useState([]);
    const [searchTerm, setSearchTerm] = useState('');
    const [filterType, setFilterType] = useState('All');

    // Modal State
    const [selectedJob, setSelectedJob] = useState(null);
    const [isModalOpen, setIsModalOpen] = useState(false);

    useEffect(() => {
        const fetchJobs = async () => {
            try {
                // For seekers, we might want recommended jobs or all open jobs
                // For now fetching all jobs
                const allJobs = await jobService.getAllJobs();
                // Filter out closed jobs if needed, or show them with status
                setJobs(allJobs);
                setFilteredJobs(allJobs);
            } catch (error) {
                console.error("Error fetching jobs", error);
            }
        };
        fetchJobs();
    }, []);

    useEffect(() => {
        let result = jobs;

        if (searchTerm) {
            result = result.filter(job =>
                job.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                job.companyName.toLowerCase().includes(searchTerm.toLowerCase()) ||
                job.location.toLowerCase().includes(searchTerm.toLowerCase())
            );
        }

        if (filterType !== 'All') {
            result = result.filter(job => job.type === filterType);
        }

        setFilteredJobs(result);
    }, [searchTerm, filterType, jobs]);

    const handleApply = async (jobId) => {
        try {
            await applicationService.apply(jobId);
            alert("Application Sent Successfully!");
            // Refresh jobs to update status (if we were fetching status)
            // Ideally we should update the specific job in the list to show 'Applied'
            const updatedJobs = jobs.map(j =>
                j.id === jobId ? { ...j, applicationStatus: 'Applied' } : j
            );
            setJobs(updatedJobs);

            // Also update selected job if modal is open
            if (selectedJob && selectedJob.id === jobId) {
                setSelectedJob({ ...selectedJob, applicationStatus: 'Applied' });
            }

        } catch (error) {
            alert("Failed to apply. You might have already applied.");
        }
    };

    const handleViewDetails = (jobId) => {
        const job = jobs.find(j => j.id === jobId);
        if (job) {
            setSelectedJob(job);
            setIsModalOpen(true);
        }
    };

    return (
        <div className="space-y-6">
            <div className="flex flex-col md:flex-row justify-between items-center gap-4">
                <h1 className="text-3xl font-bold text-gray-900">Find Jobs</h1>

                <div className="flex gap-2 w-full md:w-auto">
                    <div className="relative flex-1 md:w-64">
                        <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={20} />
                        <input
                            type="text"
                            placeholder="Search jobs..."
                            className="pl-10 pr-4 py-2 border border-gray-300 rounded-lg w-full focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                        />
                    </div>
                    <select
                        className="border border-gray-300 rounded-lg px-4 py-2 focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                        value={filterType}
                        onChange={(e) => setFilterType(e.target.value)}
                    >
                        <option value="All">All Types</option>
                        <option value="Full-time">Full-time</option>
                        <option value="Part-time">Part-time</option>
                        <option value="Contract">Contract</option>
                        <option value="Remote">Remote</option>
                    </select>
                </div>
            </div>

            <div className="grid gap-4">
                {filteredJobs.map(job => (
                    <JobCard
                        key={job.id}
                        job={job}
                        companyName={job.companyName}
                        onApply={handleApply}
                        onViewDetails={handleViewDetails}
                    />
                ))}
                {filteredJobs.length === 0 && (
                    <div className="text-center py-10 text-gray-500">
                        No jobs found matching your criteria.
                    </div>
                )}
            </div>

            {/* Job Details Modal */}
            <JobDetailsModal
                job={selectedJob}
                isOpen={isModalOpen}
                onClose={() => setIsModalOpen(false)}
                onApply={handleApply}
            />
        </div>
    );
};

export default Jobs;
