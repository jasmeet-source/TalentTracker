import React, { useState, useEffect } from 'react';
import { Eye, Calendar, CheckCircle, XCircle, Bell } from 'lucide-react';
import applicationService from '../services/applicationService';
import { useAuth } from '../context/AuthContext';
import Badge from '../components/ui/Badge';
import ApplicationDetailsModal from '../components/ApplicationDetailsModal';

const StatusBadge = ({ status }) => {
    const styles = {
        Pending: "bg-yellow-100 text-yellow-800",
        Shortlisted: "bg-green-100 text-green-800",
        Rejected: "bg-red-100 text-red-800",
        Resolved: "bg-green-100 text-green-800"
    };

    const icons = {
        Pending: <Bell size={12} className="mr-1" />,
        Shortlisted: <CheckCircle size={12} className="mr-1" />,
        Rejected: <XCircle size={12} className="mr-1" />,
        Resolved: <CheckCircle size={12} className="mr-1" />
    };

    return (
        <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${styles[status] || styles.Pending}`}>
            {icons[status]}
            {status}
        </span>
    );
};

const Applications = () => {
    const [applications, setApplications] = useState([]);
    const [loading, setLoading] = useState(true);
    const [selectedApplication, setSelectedApplication] = useState(null);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const { user } = useAuth();

    useEffect(() => {
        if (user) {
            loadApplications();
        }
    }, [user]);

    const loadApplications = async () => {
        try {
            const data = await applicationService.getApplicationsByUser(user.id);
            setApplications(data);
        } catch (error) {
            console.error("Failed to load applications", error);
        } finally {
            setLoading(false);
        }
    };

    const handleViewApplication = (application) => {
        setSelectedApplication(application);
        setIsModalOpen(true);
    };

    const handleCloseModal = () => {
        setIsModalOpen(false);
        setSelectedApplication(null);
    };

    if (loading) return <div>Loading applications...</div>;

    return (
        <div className="space-y-6">
            <h2 className="text-2xl font-bold">My Applications</h2>
            <div className="bg-white rounded-lg shadow overflow-hidden">
                <table className="min-w-full divide-y divide-gray-200">
                    <thead className="bg-gray-50">
                        <tr>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Job Title</th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Date Applied</th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Action</th>
                        </tr>
                    </thead>
                    <tbody className="bg-white divide-y divide-gray-200">
                        {applications.map(app => (
                            <tr key={app.id}>
                                <td className="px-6 py-4 whitespace-nowrap">
                                    <div className="text-sm font-medium text-gray-900">{app.jobTitle}</div>
                                    <div className="text-sm text-gray-500">{app.companyName}</div>
                                </td>
                                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                                    {new Date(app.dateApplied).toLocaleDateString()}
                                </td>
                                <td className="px-6 py-4 whitespace-nowrap">
                                    <StatusBadge status={app.status} />
                                </td>
                                <td className="px-6 py-4 whitespace-nowrap text-sm font-medium space-x-2">
                                    <button
                                        className="text-indigo-600 hover:text-indigo-900 inline-flex items-center"
                                        onClick={() => handleViewApplication(app)}
                                    >
                                        <Eye size={16} className="mr-1" /> View
                                    </button>

                                </td>
                            </tr>
                        ))}
                        {applications.length === 0 && (
                            <tr>
                                <td colSpan="4" className="px-6 py-4 text-center text-gray-500">You haven't applied to any jobs yet.</td>
                            </tr>
                        )}
                    </tbody>
                </table>
            </div>


            <ApplicationDetailsModal
                application={selectedApplication}
                isOpen={isModalOpen}
                onClose={handleCloseModal}
            />
        </div >
    );
};

export default Applications;
