import React, { useState, useEffect } from 'react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, PieChart, Pie, Cell } from 'recharts';
import adminService from '../../services/adminService';

const Reports = () => {
    const [stats, setStats] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        fetchStats();
    }, []);

    const fetchStats = async () => {
        try {
            const data = await adminService.getPlatformStats();
            setStats(data);
        } catch (error) {
            console.error("Failed to fetch stats", error);
        } finally {
            setLoading(false);
        }
    };

    if (loading) return <div>Loading...</div>;
    if (!stats) return <div>No data available</div>;

    const barData = [
        { name: 'Users', count: stats.totalUsers },
        { name: 'Companies', count: stats.registeredCompanies },
        { name: 'Jobs', count: stats.activeJobs },
        { name: 'Applications', count: stats.totalApplications },
    ];

    const pieData = [
        { name: 'Active', value: stats.totalUsers + stats.registeredCompanies - stats.blockedEntities },
        { name: 'Blocked', value: stats.blockedEntities },
    ];

    const COLORS = ['#0088FE', '#FF8042'];

    return (
        <div className="space-y-6">
            <h1 className="text-2xl font-bold text-gray-900">System Reports</h1>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="bg-white p-6 rounded-xl shadow-sm">
                    <h3 className="text-lg font-semibold mb-4">Platform Overview</h3>
                    <div className="h-64">
                        <ResponsiveContainer width="100%" height="100%">
                            <BarChart data={barData}>
                                <CartesianGrid strokeDasharray="3 3" />
                                <XAxis dataKey="name" />
                                <YAxis />
                                <Tooltip />
                                <Legend />
                                <Bar dataKey="count" fill="#8884d8" />
                            </BarChart>
                        </ResponsiveContainer>
                    </div>
                </div>

                <div className="bg-white p-6 rounded-xl shadow-sm">
                    <h3 className="text-lg font-semibold mb-4">Entity Status</h3>
                    <div className="h-64">
                        <ResponsiveContainer width="100%" height="100%">
                            <PieChart>
                                <Pie
                                    data={pieData}
                                    cx="50%"
                                    cy="50%"
                                    labelLine={false}
                                    label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                                    outerRadius={80}
                                    fill="#8884d8"
                                    dataKey="value"
                                >
                                    {pieData.map((entry, index) => (
                                        <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                                    ))}
                                </Pie>
                                <Tooltip />
                            </PieChart>
                        </ResponsiveContainer>
                    </div>
                </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                <div className="bg-white p-4 rounded-xl shadow-sm border-l-4 border-blue-500">
                    <div className="text-gray-500 text-sm">Total Users</div>
                    <div className="text-2xl font-bold">{stats.totalUsers}</div>
                </div>
                <div className="bg-white p-4 rounded-xl shadow-sm border-l-4 border-green-500">
                    <div className="text-gray-500 text-sm">Active Jobs</div>
                    <div className="text-2xl font-bold">{stats.activeJobs}</div>
                </div>
                <div className="bg-white p-4 rounded-xl shadow-sm border-l-4 border-purple-500">
                    <div className="text-gray-500 text-sm">Applications</div>
                    <div className="text-2xl font-bold">{stats.totalApplications}</div>
                </div>
                <div className="bg-white p-4 rounded-xl shadow-sm border-l-4 border-red-500">
                    <div className="text-gray-500 text-sm">Blocked Entities</div>
                    <div className="text-2xl font-bold">{stats.blockedEntities}</div>
                </div>
            </div>
        </div>
    );
};

export default Reports;
