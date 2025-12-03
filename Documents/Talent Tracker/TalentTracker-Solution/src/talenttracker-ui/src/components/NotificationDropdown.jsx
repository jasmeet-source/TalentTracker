import React, { useState, useEffect } from 'react';
import { Bell } from 'lucide-react';
import notificationService from '../services/notificationService';
import { useAuth } from '../context/AuthContext';

const NotificationDropdown = () => {
    const { user } = useAuth();
    const [notifications, setNotifications] = useState([]);
    const [isOpen, setIsOpen] = useState(false);
    const [unreadCount, setUnreadCount] = useState(0);

    useEffect(() => {
        if (user) {
            fetchNotifications();
            // Poll every 30 seconds
            const interval = setInterval(fetchNotifications, 30000);
            return () => clearInterval(interval);
        }
    }, [user]);

    const fetchNotifications = async () => {
        try {
            const data = await notificationService.getNotifications(user.id);
            setNotifications(data);
            setUnreadCount(data.filter(n => !n.isRead).length);
        } catch (error) {
            console.error("Error fetching notifications", error);
        }
    };

    const handleMarkAsRead = async (id) => {
        try {
            await notificationService.markAsRead(id);
            setNotifications(prev => prev.map(n => n.id === id ? { ...n, isRead: true } : n));
            setUnreadCount(prev => Math.max(0, prev - 1));
        } catch (error) {
            console.error("Error marking as read", error);
        }
    };

    const handleToggle = () => {
        setIsOpen(!isOpen);
        if (!isOpen) {
            fetchNotifications();
        }
    };

    return (
        <div className="relative">
            <button
                onClick={handleToggle}
                className="p-2 rounded-full hover:bg-gray-100 transition-colors relative text-gray-600 hover:text-indigo-600"
            >
                <Bell size={24} />
                {unreadCount > 0 && (
                    <span className="absolute top-1 right-1 w-2.5 h-2.5 bg-red-500 border-2 border-white rounded-full"></span>
                )}
            </button>

            {isOpen && (
                <div className="absolute right-0 mt-3 w-80 bg-white rounded-xl shadow-2xl border border-gray-100 overflow-hidden z-50 transform origin-top-right transition-all">
                    <div className="p-4 border-b bg-gray-50 flex justify-between items-center">
                        <span className="font-bold text-gray-800">Notifications</span>
                        <span className="text-xs text-indigo-600 font-semibold cursor-pointer" onClick={fetchNotifications}>Refresh</span>
                    </div>
                    <div className="max-h-80 overflow-y-auto">
                        {notifications.length === 0 ? (
                            <div className="p-4 text-center text-gray-500 text-sm">No notifications</div>
                        ) : (
                            notifications.map(n => (
                                <div
                                    key={n.id}
                                    onClick={() => !n.isRead && handleMarkAsRead(n.id)}
                                    className={`p-4 border-b last:border-0 hover:bg-gray-50 transition-colors cursor-pointer ${!n.isRead ? 'bg-blue-50/50' : ''}`}
                                >
                                    <div className="flex justify-between items-start mb-1">
                                        <p className={`text-sm ${!n.isRead ? 'font-semibold text-gray-900' : 'text-gray-600'}`}>{n.text}</p>
                                        {!n.isRead && <span className="w-2 h-2 bg-blue-500 rounded-full mt-1.5"></span>}
                                    </div>
                                    <p className="text-xs text-gray-400">{new Date(n.time).toLocaleString()}</p>
                                </div>
                            ))
                        )}
                    </div>
                </div>
            )}
        </div>
    );
};

export default NotificationDropdown;
