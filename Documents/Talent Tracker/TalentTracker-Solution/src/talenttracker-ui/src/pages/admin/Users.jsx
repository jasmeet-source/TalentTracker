import React, { useState, useEffect } from 'react';
import { User, Search, Filter, Shield, ShieldOff, Trash2, Mail } from 'lucide-react';
import adminService from '../../services/adminService';
import ConfirmationModal from '../../components/ConfirmationModal';

const Users = () => {
    const [users, setUsers] = useState([]);
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
        fetchUsers();
    }, []);

    const fetchUsers = async () => {
        try {
            const data = await adminService.getAllUsers();
            console.log("Fetched users:", data); // Debug log
            if (Array.isArray(data)) {
                setUsers(data);
            } else {
                console.error("Fetched data is not an array:", data);
                setUsers([]);
            }
        } catch (error) {
            console.error("Failed to fetch users", error);
        } finally {
            setLoading(false);
        }
    };

    const handleStatusChangeClick = (user) => {
        const currentStatus = user.status !== undefined ? user.status : user.Status;
        const isBlocking = currentStatus === 0; // 0 is Active, so we want to block
        setModalConfig({
            isOpen: true,
            title: isBlocking ? 'Block User' : 'Unblock User',
            message: isBlocking
                ? `Are you sure you want to block ${user.name}? They will no longer be able to log in.`
                : `Are you sure you want to unblock ${user.name}? They will regain access to the platform.`,
            confirmText: isBlocking ? 'Block' : 'Unblock',
            confirmColor: isBlocking ? 'bg-red-600 hover:bg-red-700' : 'bg-green-600 hover:bg-green-700',
            action: () => executeStatusChange(user.id || user.Id, currentStatus)
        });
    };

    const handleDeleteClick = (user) => {
        setModalConfig({
            isOpen: true,
            title: 'Delete User',
            message: `Are you sure you want to delete ${user.name}? This action cannot be undone.`,
            confirmText: 'Delete',
            confirmColor: 'bg-red-600 hover:bg-red-700',
            action: () => executeDelete(user.id || user.Id)
        });
    };

    const executeStatusChange = async (id, currentStatus) => {
        // If current is 0 (Active), new is 1 (Blocked). If current is 1 (Blocked), new is 0 (Active).
        // The backend expects the string 'blocked' or 'active' (or int if API changed, but let's assume string for now based on previous code)
        // Wait, the previous code sent 'blocked' or 'active'. Let's verify what the API expects.
        // Assuming API takes int or string that maps to enum.
        // Let's look at the previous code: const newStatus = currentStatus === 1 ? 'blocked' : 'active';
        // If current was 1 (which they thought was Active), they sent 'blocked'.
        // So if current is 0 (Active), we should send 'blocked'.
        const newStatus = currentStatus === 0 ? 'blocked' : 'active';
        try {
            await adminService.updateUserStatus(id, newStatus);
            fetchUsers();
            closeModal();
        } catch (error) {
            console.error("Failed to update status", error);
        }
    };

    const executeDelete = async (id) => {
        try {
            await adminService.deleteUser(id);
            fetchUsers();
            closeModal();
        } catch (error) {
            console.error("Failed to delete user", error);
        }
    };

    const closeModal = () => {
        setModalConfig(prev => ({ ...prev, isOpen: false }));
    };

    const filteredUsers = users.filter(user =>
        (user.name || user.Name || '').toLowerCase().includes(searchTerm.toLowerCase()) ||
        (user.email || user.Email || '').toLowerCase().includes(searchTerm.toLowerCase())
    );

    const getRoleName = (role) => {
        switch (role) {
            case 0: return 'Admin';
            case 1: return 'Seeker';
            case 2: return 'Employer';
            case 3: return 'Consultant';
            default: return 'Unknown';
        }
    };

    if (loading) return <div>Loading...</div>;

    return (
        <div className="space-y-6">
            <div className="flex justify-between items-center">
                <h1 className="text-2xl font-bold text-gray-900">User Management</h1>
                <div className="flex space-x-2">
                    <div className="relative">
                        <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={20} />
                        <input
                            type="text"
                            placeholder="Search users..."
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
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">User</th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Role</th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
                            <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
                        </tr>
                    </thead>
                    <tbody className="bg-white divide-y divide-gray-200">
                        {filteredUsers.map((user) => (
                            <tr key={user.id || user.Id} className="hover:bg-gray-50">
                                <td className="px-6 py-4 whitespace-nowrap">
                                    <div className="flex items-center">
                                        <div className="h-10 w-10 rounded-full bg-indigo-100 flex items-center justify-center text-indigo-600 font-bold">
                                            {(user.name || user.Name || '?').charAt(0)}
                                        </div>
                                        <div className="ml-4">
                                            <div className="text-sm font-medium text-gray-900">{user.name || user.Name}</div>
                                            <div className="text-sm text-gray-500 flex items-center">
                                                <Mail size={12} className="mr-1" /> {user.email || user.Email}
                                            </div>
                                        </div>
                                    </div>
                                </td>
                                <td className="px-6 py-4 whitespace-nowrap">
                                    <span className="px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-purple-100 text-purple-800">
                                        {getRoleName(user.role !== undefined ? user.role : user.Role)}
                                    </span>
                                </td>
                                <td className="px-6 py-4 whitespace-nowrap">
                                    <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${(user.status !== undefined ? user.status : user.Status) === 0 ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'}`}>
                                        {(user.status !== undefined ? user.status : user.Status) === 0 ? 'Active' : 'Blocked'}
                                    </span>
                                </td>
                                <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                                    <button
                                        onClick={() => handleStatusChangeClick(user)}
                                        className={`mr-4 font-medium ${(user.status !== undefined ? user.status : user.Status) === 0 ? 'text-red-600 hover:text-red-900' : 'text-green-600 hover:text-green-900'}`}
                                    >
                                        {(user.status !== undefined ? user.status : user.Status) === 0 ? 'Block' : 'Unblock'}
                                    </button>
                                    <button
                                        onClick={() => handleDeleteClick(user)}
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

export default Users;
