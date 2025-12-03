import React, { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { BarChart2, Search, FileText, User, PlusCircle, Users, Building, LogOut, X, Lock } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import Badge from './ui/Badge';
import ChangePasswordModal from './ChangePasswordModal';

const NavItem = ({ icon, label, to, active, onClick }) => (
    <Link
        to={to}
        onClick={onClick}
        className={`w-full flex items-center space-x-3 px-4 py-3 rounded-lg transition-colors ${active
            ? 'bg-indigo-600 text-white shadow-md'
            : 'text-slate-300 hover:bg-slate-800 hover:text-white'
            }`}
    >
        {icon}
        <span className="font-medium">{label}</span>
    </Link>
);

const Sidebar = ({ isOpen, onClose }) => {
    const { user, logout } = useAuth();
    const [isChangePasswordOpen, setIsChangePasswordOpen] = useState(false);
    const location = useLocation();
    const currentPath = location.pathname;

    if (!user) return null;

    return (
        <aside className={`
            fixed inset-y-0 left-0 z-30 w-64 bg-slate-900 text-white shadow-2xl transform transition-transform duration-300 ease-in-out
            md:translate-x-0 md:static md:inset-auto md:flex md:flex-col md:h-screen md:sticky md:top-0
            ${isOpen ? 'translate-x-0' : '-translate-x-full'}
        `}>
            <div className="p-6 flex justify-between items-start">
                <div>
                    <h2 className="text-2xl font-bold tracking-tight">Talent Tracker</h2>
                    <div className="flex items-center mt-2 space-x-2">
                        <Badge color={user.role === 'admin' ? 'red' : 'blue'}>{user.role?.toUpperCase()}</Badge>
                    </div>
                </div>
                <button onClick={onClose} className="md:hidden text-slate-400 hover:text-white">
                    <X size={24} />
                </button>
            </div>

            <nav className="flex-1 px-4 space-y-2 mt-4 overflow-y-auto">
                <NavItem
                    icon={<BarChart2 size={20} />}
                    label="Dashboard"
                    to="/"
                    active={currentPath === '/'}
                    onClick={onClose}
                />

                {user.role === 'seeker' && (
                    <>
                        <NavItem
                            icon={<Search size={20} />}
                            label="Find Jobs"
                            to="/jobs"
                            active={currentPath === '/jobs'}
                            onClick={onClose}
                        />
                        <NavItem
                            icon={<FileText size={20} />}
                            label="My Applications"
                            to="/applications"
                            active={currentPath === '/applications'}
                            onClick={onClose}
                        />
                        <NavItem
                            icon={<User size={20} />}
                            label="Profile Manager"
                            to="/profile"
                            active={currentPath === '/profile'}
                            onClick={onClose}
                        />
                    </>
                )}

                {(user.role === 'employer' || user.role === 'consultant') && (
                    <>
                        <NavItem
                            icon={<PlusCircle size={20} />}
                            label="Post a Job"
                            to="/post-job"
                            active={currentPath === '/post-job'}
                            onClick={onClose}
                        />
                        <NavItem
                            icon={<Users size={20} />}
                            label="Candidates"
                            to="/candidates"
                            active={currentPath === '/candidates'}
                            onClick={onClose}
                        />
                        {user.role === 'employer' && (
                            <NavItem
                                icon={<Users size={20} />}
                                label="My Consultants"
                                to="/my-consultants"
                                active={currentPath === '/my-consultants'}
                                onClick={onClose}
                            />
                        )}
                        {user.role === 'consultant' && (
                            <NavItem
                                icon={<Building size={20} />}
                                label="My Clients"
                                to="/my-clients"
                                active={currentPath === '/my-clients'}
                                onClick={onClose}
                            />
                        )}
                    </>
                )}

                {user.role === 'admin' && (
                    <>
                        <div className="pt-4 pb-1 text-xs text-gray-500 font-semibold uppercase tracking-wider">Platform Mgmt</div>
                        <NavItem
                            icon={<Building size={20} />}
                            label="Companies"
                            to="/admin/companies"
                            active={currentPath === '/admin/companies'}
                            onClick={onClose}
                        />
                        <NavItem
                            icon={<Users size={20} />}
                            label="All Users"
                            to="/admin/users"
                            active={currentPath === '/admin/users'}
                            onClick={onClose}
                        />
                        <div className="pt-4 pb-1 text-xs text-gray-500 font-semibold uppercase tracking-wider">System</div>
                        <NavItem
                            icon={<FileText size={20} />}
                            label="Reports Generator"
                            to="/reports"
                            active={currentPath === '/reports'}
                            onClick={onClose}
                        />
                    </>
                )}
            </nav>

            <div className="p-4 border-t border-slate-700 bg-slate-800">
                <div className="flex items-center space-x-3 mb-4">
                    <div className="w-8 h-8 rounded-full bg-indigo-500 flex items-center justify-center text-sm font-bold">
                        {user.name?.charAt(0)}
                    </div>
                    <div className="overflow-hidden">
                        <p className="text-sm font-medium truncate">{user.name}</p>
                        <p className="text-xs text-slate-400 truncate">
                            {user.role === 'admin' ? 'System Admin' : (user.companyName || 'User')}
                            <span className="ml-1 text-[10px] text-slate-500">#{user.id}</span>
                        </p>
                    </div>
                </div>
                <button
                    onClick={() => setIsChangePasswordOpen(true)}
                    className="flex items-center space-x-2 text-sm text-slate-400 hover:text-white transition w-full p-2 rounded hover:bg-slate-700 mb-1"
                >
                    <Lock size={16} />
                    <span>Change Password</span>
                </button>
                <button
                    onClick={logout}
                    className="flex items-center space-x-2 text-sm text-red-400 hover:text-red-300 transition w-full p-2 rounded hover:bg-slate-700"
                >
                    <LogOut size={16} />
                    <span>Sign Out</span>
                </button>
            </div>

            <ChangePasswordModal
                isOpen={isChangePasswordOpen}
                onClose={() => setIsChangePasswordOpen(false)}
            />
        </aside>
    );
};

export default Sidebar;
