import React, { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { FileText, Users, User, Briefcase, Building, Bell, Lock, Eye, CheckCircle, TrendingUp, Calendar, ArrowRight } from 'lucide-react';
import dashboardService from '../services/dashboardService';

import jobService from '../services/jobService';
import applicationService from '../services/applicationService';
import userService from '../services/userService';
import JobCard from '../components/JobCard';
import JobDetailsModal from '../components/JobDetailsModal';
import { useNavigate } from 'react-router-dom';

const StatCard = ({ title, value, icon, colorClass, trend }) => (
    <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100 hover:shadow-md transition-all duration-300 group">
        <div className="flex justify-between items-start">
            <div>
                <p className="text-sm font-medium text-gray-500 mb-1">{title}</p>
                <h3 className="text-3xl font-bold text-gray-900 tracking-tight">{value}</h3>
                {trend && (
                    <div className="flex items-center mt-2 text-xs font-medium text-emerald-600 bg-emerald-50 px-2 py-1 rounded-full w-fit">
                        <TrendingUp size={12} className="mr-1" />
                        {trend}
                    </div>
                )}
            </div>
            <div className={`p-3 rounded-xl ${colorClass} group-hover:scale-110 transition-transform duration-300`}>
                {icon}
            </div>
        </div>
    </div>
);

const Dashboard = () => {
    const { user } = useAuth();
    const navigate = useNavigate();
    const [stats, setStats] = useState({
        jobsApplied: 0,
        interviews: 0,
        shortlisted: 0,
        activePosts: 0,
        totalCompanyJobs: 0,
        pendingReview: 0,
        totalUsers: 0, // Admin
        registeredCompanies: 0, // Admin
        blockedEntities: 0 // Admin
    });
    const [recentJobs, setRecentJobs] = useState([]);
    const [recommendedJobs, setRecommendedJobs] = useState([]);
    const [showNotification, setShowNotification] = useState(false);
    const [completeness, setCompleteness] = useState(0);

    // Modal State
    const [selectedJob, setSelectedJob] = useState(null);
    const [isModalOpen, setIsModalOpen] = useState(false);

    useEffect(() => {
        const fetchData = async () => {
            try {
                // Fetch real-time stats
                const dashboardStats = await dashboardService.getStats();
                setStats(dashboardStats);

                if (user.role === 'seeker') {
                    // Fetch recommended jobs
                    const jobs = await jobService.getRecommendedJobs(user.id);
                    setRecommendedJobs(jobs);

                    // Check profile completeness
                    const percent = await userService.getProfileCompleteness(user.id);
                    setCompleteness(percent);
                    const dismissed = sessionStorage.getItem('profileNotificationDismissed');
                    if (percent < 100 && !dismissed) {
                        setShowNotification(true);
                    }

                } else if (user.role === 'employer') {
                    if (user.companyId) {
                        const jobs = await jobService.getJobsByCompany(user.companyId);
                        setRecentJobs(jobs.slice(0, 2));
                    }
                } else if (user.role === 'consultant') {
                    const jobs = await jobService.getJobsByConsultant(user.id);
                    setRecentJobs(jobs.slice(0, 2));
                }
            } catch (error) {
                console.error("Error fetching dashboard data", error);
            }
        };

        if (user) {
            fetchData();
        }
    }, [user]);

    const handleApply = async (jobId) => {
        try {
            await applicationService.apply(jobId);
            alert("Application Sent Successfully!");
            // Refresh jobs to update status
            if (user.role === 'seeker') {
                const jobs = await jobService.getRecommendedJobs(user.id);
                setRecommendedJobs(jobs);
                // Also update selected job if modal is open
                if (selectedJob && selectedJob.id === jobId) {
                    const updatedJob = jobs.find(j => j.id === jobId);
                    if (updatedJob) setSelectedJob(updatedJob);
                }
                // Update stats
                const applications = await applicationService.getApplicationsByUser(user.id);
                setStats(prev => ({ ...prev, jobsApplied: applications.length }));
            }
        } catch (error) {
            alert("Failed to apply. You might have already applied.");
        }
    };

    const handleCloseJob = async (jobId) => {
        if (window.confirm("Are you sure you want to close this job?")) {
            try {
                await jobService.closeJob(jobId);
                alert("Job Closed Successfully!");
                // Refresh jobs
                if (user.companyId) {
                    const jobs = await jobService.getJobsByCompany(user.companyId);
                    setStats(prev => ({
                        ...prev,
                        activePosts: jobs.filter(j => j.status === 'Open').length,
                        totalCompanyJobs: jobs.length
                    }));
                    setRecentJobs(jobs.slice(0, 2));
                } else if (user.role === 'consultant') {
                    const jobs = await jobService.getJobsByConsultant(user.id);
                    setStats(prev => ({
                        ...prev,
                        activePosts: jobs.filter(j => j.status === 'Open').length,
                        totalCompanyJobs: jobs.length
                    }));
                    setRecentJobs(jobs.slice(0, 2));
                }
            } catch (error) {
                console.error("Failed to close job", error);
                alert("Failed to close job.");
            }
        }
    };

    const handleViewDetails = (jobId) => {
        const job = recommendedJobs.find(j => j.id === jobId) || recentJobs.find(j => j.id === jobId);
        if (job) {
            setSelectedJob(job);
            setIsModalOpen(true);
        }
    };

    const handleViewApplicants = (jobId) => {
        navigate(`/jobs/${jobId}/applicants`);
    };

    return (
        <div className="space-y-8 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
            {/* Header Section */}
            <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4">
                <div>
                    <h1 className="text-3xl font-bold text-gray-900 tracking-tight">
                        Welcome back, {user.name?.split(' ')[0] || 'User'}! 👋
                    </h1>
                    <p className="text-gray-500 mt-2 flex items-center">
                        {user.role === 'seeker' ? 'Job Seeker Portal' :
                            user.role === 'admin' ? 'Admin Portal' :
                                `${user.companyName || 'Company'} Portal`}
                        <span className="mx-2 text-gray-300">|</span>
                        <span className="text-xs bg-indigo-50 text-indigo-700 px-2.5 py-0.5 rounded-full font-semibold border border-indigo-100">
                            ID: #{user.id}
                        </span>
                    </p>
                </div>
                <div className="flex items-center text-sm font-medium text-gray-500 bg-white px-4 py-2 rounded-xl shadow-sm border border-gray-100">
                    <Calendar size={16} className="mr-2 text-indigo-500" />
                    {new Date().toLocaleDateString('en-US', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}
                </div>
            </div>

            {/* Notification Banner */}
            {showNotification && (
                <div className="bg-gradient-to-r from-amber-50 to-orange-50 border border-amber-100 rounded-2xl p-5 flex flex-col sm:flex-row justify-between items-center gap-4 shadow-sm">
                    <div className="flex items-center gap-4">
                        <div className="p-3 bg-amber-100 rounded-full text-amber-600">
                            <Bell size={20} />
                        </div>
                        <div>
                            <h3 className="font-bold text-gray-900">Complete your profile</h3>
                            <p className="text-sm text-gray-600 mt-0.5">
                                Your profile is <span className="font-bold text-amber-600">{completeness}% complete</span>. Add more details to get better job matches.
                            </p>
                        </div>
                    </div>
                    <div className="flex gap-3 w-full sm:w-auto">
                        <button
                            onClick={() => {
                                setShowNotification(false);
                                sessionStorage.setItem('profileNotificationDismissed', 'true');
                            }}
                            className="px-4 py-2 text-sm font-medium text-gray-600 hover:bg-white/50 rounded-xl transition-colors"
                        >
                            Dismiss
                        </button>
                        <button
                            onClick={() => navigate('/profile')}
                            className="px-5 py-2 text-sm font-bold text-white bg-amber-500 hover:bg-amber-600 rounded-xl shadow-lg shadow-amber-200 transition-all transform hover:-translate-y-0.5"
                        >
                            Complete Now
                        </button>
                    </div>
                </div>
            )}
            {/* Stats Grid */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                {user.role === 'seeker' ? (
                    <>
                        <StatCard
                            title="Jobs Applied"
                            value={stats.jobsApplied}
                            icon={<FileText size={24} />}
                            colorClass="bg-blue-100 text-blue-600"
                            trend="+2 this week"
                        />
                        <StatCard
                            title="Interviews Scheduled"
                            value={stats.interviews}
                            icon={<Users size={24} />}
                            colorClass="bg-purple-100 text-purple-600"
                        />
                        <StatCard
                            title="Shortlisted"
                            value={stats.shortlisted}
                            icon={<CheckCircle size={24} />}
                            colorClass="bg-emerald-100 text-emerald-600"
                            trend="Great job!"
                        />
                    </>
                ) : user.role === 'admin' ? (
                    <>
                        <StatCard
                            title="Total Users"
                            value={stats.totalUsers}
                            icon={<Users size={24} />}
                            colorClass="bg-blue-100 text-blue-600"
                        />
                        <StatCard
                            title="Registered Companies"
                            value={stats.registeredCompanies}
                            icon={<Building size={24} />}
                            colorClass="bg-purple-100 text-purple-600"
                        />
                        <StatCard
                            title="Blocked Entities"
                            value={stats.blockedEntities}
                            icon={<Lock size={24} />}
                            colorClass="bg-red-100 text-red-600"
                        />
                    </>
                ) : (
                    <>
                        <StatCard
                            title="Active Job Posts"
                            value={stats.activePosts}
                            icon={<Briefcase size={24} />}
                            colorClass="bg-blue-100 text-blue-600"
                        />
                        <StatCard
                            title="Total Jobs Posted"
                            value={stats.totalCompanyJobs}
                            icon={<Building size={24} />}
                            colorClass="bg-purple-100 text-purple-600"
                        />
                        <StatCard
                            title="Pending Review"
                            value={stats.pendingReview}
                            icon={<Bell size={24} />}
                            colorClass="bg-orange-100 text-orange-600"
                        />
                    </>
                )}
            </div>

            {user.role !== 'admin' && (
                <div>
                    <div className="flex items-center justify-between mb-6">
                        <h2 className="text-xl font-bold text-gray-900 flex items-center">
                            {user.role === 'seeker' ? 'Recommended for You' : 'Recent Postings'}
                            {user.role === 'seeker' && <span className="ml-2 px-2 py-0.5 bg-indigo-50 text-indigo-600 text-xs rounded-full border border-indigo-100">Based on your skills</span>}
                        </h2>
                        {user.role === 'seeker' && (
                            <button onClick={() => navigate('/jobs')} className="text-sm font-medium text-indigo-600 hover:text-indigo-700 flex items-center transition-colors">
                                View All Jobs <ArrowRight size={16} className="ml-1" />
                            </button>
                        )}
                    </div>

                    <div className="grid gap-5">
                        {user.role === 'seeker'
                            ? recommendedJobs.map(job => (
                                <JobCard
                                    key={job.id}
                                    job={job}
                                    companyName={job.companyName}
                                    onApply={handleApply}
                                    onViewDetails={handleViewDetails}
                                />
                            ))
                            : recentJobs.map(job => (
                                <JobCard
                                    key={job.id}
                                    job={job}
                                    companyName={user.companyName}
                                    onViewDetails={handleViewDetails}
                                    onClose={handleCloseJob}
                                    onViewApplicants={handleViewApplicants}
                                />
                            ))
                        }
                        {user.role === 'seeker' && recommendedJobs.length === 0 && (
                            <div className="text-center py-12 bg-white rounded-2xl border border-gray-100 border-dashed">
                                <Briefcase className="mx-auto h-12 w-12 text-gray-300 mb-3" />
                                <p className="text-gray-500 font-medium">No recommended jobs found yet.</p>
                                <p className="text-sm text-gray-400 mt-1">Try updating your skills in your profile.</p>
                            </div>
                        )}
                        {user.role !== 'seeker' && recentJobs.length === 0 && (
                            <div className="text-center py-12 bg-white rounded-2xl border border-gray-100 border-dashed">
                                <p className="text-gray-500">No recent postings.</p>
                            </div>
                        )}
                    </div>
                </div>
            )}

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

export default Dashboard;
