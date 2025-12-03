import React, { useState, useEffect } from 'react';
import { Building, Search, Filter, MoreVertical, Shield, ShieldOff, Trash2 } from 'lucide-react';
import adminService from '../../services/adminService';
import ConfirmationModal from '../../components/ConfirmationModal';

const Companies = () => {
    const [companies, setCompanies] = useState([]);
    const [loading, setLoading] = useState(true);
    const [searchTerm, setSearchTerm] = useState('');
    const [modalConfig, setModalConfig] = useState({
        isOpen: false,
        title: '',
        message: '',
        confirmText: '',
        confirmColor: '',
        action: null
    });

    useEffect(() => {
        fetchCompanies();
    }, []);

    const fetchCompanies = async () => {
        try {
            const data = await adminService.getAllCompanies();
            setCompanies(data);
        } catch (error) {
            console.error("Failed to fetch companies", error);
        } finally {
            setLoading(false);
        }
    };

    const handleStatusChangeClick = (company) => {
        const currentStatus = company.status !== undefined ? company.status : company.Status;
        const isBlocking = currentStatus === 0; // 0 is Active
        setModalConfig({
            isOpen: true,
            title: isBlocking ? 'Block Company' : 'Unblock Company',
            message: isBlocking
                ? `Are you sure you want to block ${company.name}? This will restrict their access.`
                : `Are you sure you want to unblock ${company.name}? They will regain access.`,
            confirmText: isBlocking ? 'Block' : 'Unblock',
            confirmColor: isBlocking ? 'bg-red-600 hover:bg-red-700' : 'bg-green-600 hover:bg-green-700',
            action: () => executeStatusChange(company.id || company.Id, currentStatus)
        });
    };

    const handleDeleteClick = (company) => {
        setModalConfig({
            isOpen: true,
            title: 'Delete Company',
            message: `Are you sure you want to delete ${company.name}? This action cannot be undone.`,
            confirmText: 'Delete',
            confirmColor: 'bg-red-600 hover:bg-red-700',
            action: () => executeDelete(company.id || company.Id)
        });
    };

    const executeStatusChange = async (id, currentStatus) => {
        const newStatus = currentStatus === 0 ? 'blocked' : 'active';
        try {
            await adminService.updateCompanyStatus(id, newStatus);
            fetchCompanies();
            closeModal();
        } catch (error) {
            console.error("Failed to update status", error);
        }
    };

    const executeDelete = async (id) => {
        try {
            await adminService.deleteCompany(id);
            fetchCompanies();
            closeModal();
        } catch (error) {
            console.error("Failed to delete company", error);
        }
    };

    const closeModal = () => {
        setModalConfig(prev => ({ ...prev, isOpen: false }));
    };

    const filteredCompanies = companies.filter(company =>
        (company.name || company.Name || '').toLowerCase().includes(searchTerm.toLowerCase()) ||
        (company.email || company.Email || '').toLowerCase().includes(searchTerm.toLowerCase())
    );

    if (loading) return <div>Loading...</div>;

    return (
        <div className="space-y-6">
            <div className="flex justify-between items-center">
                <h1 className="text-2xl font-bold text-gray-900">Company Management</h1>
                <div className="flex space-x-2">
                    <div className="relative">
                        <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={20} />
                        <input
                            type="text"
                            placeholder="Search companies..."
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                            className="pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                        />
                    </div>
                </div>
            </div>

            <div className="bg-white rounded-xl shadow-sm overflow-hidden">
                <table className="min-w-full divide-y divide-gray-200">
                    <thead className="bg-gray-50">
                        <tr>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Company</th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Type</th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Location</th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
                            <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
                        </tr>
                    </thead>
                    <tbody className="bg-white divide-y divide-gray-200">
                        {filteredCompanies.map((company) => (
                            <tr key={company.id || company.Id} className="hover:bg-gray-50">
                                <td className="px-6 py-4 whitespace-nowrap">
                                    <div className="flex items-center">
                                        <div className="h-10 w-10 rounded-full bg-indigo-100 flex items-center justify-center text-indigo-600 font-bold">
                                            {(company.name || company.Name || '?').charAt(0)}
                                        </div>
                                        <div className="ml-4">
                                            <div className="text-sm font-medium text-gray-900">{company.name || company.Name}</div>
                                            <div className="text-sm text-gray-500">{company.email || company.Email}</div>
                                        </div>
                                    </div>
                                </td>
                                <td className="px-6 py-4 whitespace-nowrap">
                                    <span className="px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-blue-100 text-blue-800">
                                        {(company.type !== undefined ? company.type : company.Type) === 0 ? 'Employer' : 'Consultancy'}
                                    </span>
                                </td>
                                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                                    {company.location || company.Location || 'N/A'}
                                </td>
                                <td className="px-6 py-4 whitespace-nowrap">
                                    <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${(company.status !== undefined ? company.status : company.Status) === 0 ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'}`}>
                                        {(company.status !== undefined ? company.status : company.Status) === 0 ? 'Active' : 'Blocked'}
                                    </span>
                                </td>
                                <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                                    <button
                                        onClick={() => handleStatusChangeClick(company)}
                                        className={`mr-4 font-medium ${(company.status !== undefined ? company.status : company.Status) === 0 ? 'text-red-600 hover:text-red-900' : 'text-green-600 hover:text-green-900'}`}
                                    >
                                        {(company.status !== undefined ? company.status : company.Status) === 0 ? 'Block' : 'Unblock'}
                                    </button>
                                    <button
                                        onClick={() => handleDeleteClick(company)}
                                        className="text-red-600 hover:text-red-900 font-medium"
                                    >
                                        Delete
                                    </button>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>

            <ConfirmationModal
                isOpen={modalConfig.isOpen}
                onClose={closeModal}
                onConfirm={modalConfig.action}
                title={modalConfig.title}
                message={modalConfig.message}
                confirmText={modalConfig.confirmText}
                confirmColor={modalConfig.confirmColor}
            />
        </div>
    );
};

export default Companies;
