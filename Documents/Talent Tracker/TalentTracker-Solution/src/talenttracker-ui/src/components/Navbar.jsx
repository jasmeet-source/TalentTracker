import React, { useState } from 'react';
import { Briefcase, LogOut, Menu } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { useLocation } from 'react-router-dom';
import NotificationDropdown from './NotificationDropdown';

const Navbar = ({ toggleSidebar }) => {
    const { user, logout } = useAuth();
    const location = useLocation();

    if (!user) return null;

    const getTitle = () => {
        const path = location.pathname;
        if (path === '/') return 'Dashboard';
        return path.substring(1).replace('-', ' ').replace(/\b\w/g, l => l.toUpperCase());
    };

    return (
        <header className="bg-white shadow-sm border-b sticky top-0 z-20 px-4 md:px-8 py-3 flex justify-between items-center">
            <div className="flex items-center">
                {/* Mobile Menu Button */}
                <button
                    onClick={toggleSidebar}
                    className="md:hidden mr-3 text-gray-600 hover:text-indigo-600 p-1 rounded-md hover:bg-gray-100"
                >
                    <Menu size={24} />
                </button>

                {/* Mobile Branding */}
                <div className="md:hidden flex items-center space-x-2 mr-4">
                    <div className="w-8 h-8 bg-indigo-500 rounded-lg flex items-center justify-center">
                        <Briefcase className="text-white" size={16} />
                    </div>
                    <span className="font-bold text-gray-800 hidden sm:block">Talent Tracker</span>
                </div>

                {/* Desktop Page Title */}
                <h2 className="hidden md:block text-xl font-bold text-gray-800 capitalize">
                    {getTitle()}
                </h2>
            </div>

            {/* Right Side: Notifications & Mobile Logout */}
            <div className="flex items-center space-x-4">
                {/* Notification Dropdown */}
                <NotificationDropdown />

                {/* Mobile Logout */}
                <button onClick={logout} className="md:hidden text-gray-500 hover:text-red-500">
                    <LogOut size={20} />
                </button>
            </div>
        </header>
    );
};

export default Navbar;
