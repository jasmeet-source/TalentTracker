import React from 'react';
import Sidebar from './Sidebar';
import Navbar from './Navbar';
import { useAuth } from '../context/AuthContext';

const Layout = ({ children }) => {
    const { user } = useAuth();
    const [isSidebarOpen, setIsSidebarOpen] = React.useState(false);

    if (!user) {
        return <>{children}</>;
    }

    return (
        <div className="min-h-screen bg-gray-50 flex font-sans text-slate-800">
            {/* Mobile Sidebar Overlay */}
            {isSidebarOpen && (
                <div
                    className="fixed inset-0 bg-black/50 z-20 md:hidden transition-opacity"
                    onClick={() => setIsSidebarOpen(false)}
                />
            )}

            <Sidebar isOpen={isSidebarOpen} onClose={() => setIsSidebarOpen(false)} />

            <main className="flex-1 overflow-y-auto bg-gray-50 relative flex flex-col h-screen w-full">
                <Navbar toggleSidebar={() => setIsSidebarOpen(!isSidebarOpen)} />
                <div className="p-4 md:p-8 max-w-7xl mx-auto w-full flex-1 overflow-y-auto">
                    {children}
                </div>
            </main>
        </div>
    );
};

export default Layout;
