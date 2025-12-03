import React, { useState, useEffect } from 'react';
import { Building, MapPin, Briefcase, CheckCircle, Clock, XCircle, Eye, Calendar, IndianRupee, Award, ChevronDown, ChevronUp } from 'lucide-react';
import consultantService from '../../services/consultantService';
import { useAuth } from '../../context/AuthContext';

const MyClients = () => {
    const { user } = useAuth();
    const [clients, setClients] = useState([]);
    const [loading, setLoading] = useState(true);
    const [expandedCards, setExpandedCards] = useState({});

    useEffect(() => {
        if (user) {
            fetchClients();
        }
    }, [user]);

    const fetchClients = async () => {
        try {
            const data = await consultantService.getConsultantClients(user.id);
            setClients(data);
        } catch (error) {
            console.error("Error fetching clients", error);
        } finally {
            setLoading(false);
        }
    };

    const toggleExpand = (id) => {
        setExpandedCards(prev => ({ ...prev, [id]: !prev[id] }));
    };

    const getStatusBadge = (status) => {
        switch (status) {
            case 'Approved':
                return <span className="flex items-center text-emerald-700 bg-emerald-50 px-3 py-1 rounded-full text-xs font-semibold border border-emerald-100"><CheckCircle size={14} className="mr-1.5" /> Active</span>;
            case 'Pending':
                return <span className="flex items-center text-amber-700 bg-amber-50 px-3 py-1 rounded-full text-xs font-semibold border border-amber-100"><Clock size={14} className="mr-1.5" /> Pending</span>;
            case 'Rejected':
                return <span className="flex items-center text-rose-700 bg-rose-50 px-3 py-1 rounded-full text-xs font-semibold border border-rose-100"><XCircle size={14} className="mr-1.5" /> Rejected</span>;
            default:
                return <span className="text-gray-500 text-xs">{status}</span>;
        }
    };

    const parseNotes = (note) => {
        if (!note) return {};
        const lines = note.split('\n');
        const details = {};
        lines.forEach(line => {
            const [key, ...value] = line.split(':');
            if (key && value.length > 0) {
                details[key.trim().toLowerCase()] = value.join(':').trim();
            }
        });
        return details;
    };

    return (
        <div className="space-y-8 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div>
                    <h1 className="text-3xl font-bold text-gray-900 tracking-tight">My Clients</h1>
                    <p className="text-gray-500 mt-1">Manage your relationships with employers</p>
                </div>
                <div className="flex gap-2">
                    <div className="bg-white px-4 py-2 rounded-lg border border-gray-200 shadow-sm text-sm font-medium text-gray-600">
                        Total Clients: <span className="text-indigo-600 font-bold ml-1">{clients.length}</span>
                    </div>
                </div>
            </div>

            {loading ? (
                <div className="flex justify-center items-center h-64">
                    <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-600"></div>
                </div>
            ) : clients.length === 0 ? (
                <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-12 text-center">
                    <div className="w-16 h-16 bg-gray-50 rounded-full flex items-center justify-center mx-auto mb-4">
                        <Building className="text-gray-400" size={32} />
                    </div>
                    <h3 className="text-lg font-medium text-gray-900">No clients yet</h3>
                    <p className="text-gray-500 mt-2">When employers grant you access, they will appear here.</p>
                </div>
            ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {clients.map(client => {
                        const details = parseNotes(client.requestNote);
                        const isExpanded = expandedCards[client.id];

                        return (
                            <div key={client.id} className="bg-white rounded-2xl shadow-sm border border-gray-100 hover:shadow-md transition-all duration-300 overflow-hidden flex flex-col">
                                <div className="p-6 flex-1">
                                    <div className="flex justify-between items-start mb-4">
                                        <div className="h-12 w-12 rounded-xl bg-gradient-to-br from-indigo-500 to-purple-600 flex items-center justify-center text-white font-bold text-xl shadow-indigo-100 shadow-lg">
                                            {client.employer?.company?.name?.charAt(0) || client.employer?.name?.charAt(0)}
                                        </div>
                                        {getStatusBadge(client.status)}
                                    </div>

                                    <h3 className="text-lg font-bold text-gray-900 mb-1 line-clamp-1">
                                        {client.employer?.company?.name || client.employer?.name}
                                    </h3>
                                    <p className="text-sm text-gray-500 mb-4 flex items-center">
                                        <MapPin size={14} className="mr-1" />
                                        {details.location || 'Location not specified'}
                                    </p>

                                    <div className="space-y-3 mb-4">
                                        {details.role && (
                                            <div className="flex items-center text-sm text-gray-700 bg-gray-50 p-2 rounded-lg">
                                                <Briefcase size={16} className="text-indigo-500 mr-2" />
                                                <span className="font-medium">{details.role}</span>
                                            </div>
                                        )}
                                        {details.salary && (
                                            <div className="flex items-center text-sm text-gray-700">
                                                <IndianRupee size={16} className="text-green-500 mr-2" />
                                                <span>{details.salary}</span>
                                            </div>
                                        )}
                                    </div>

                                    {client.requestNote && (
                                        <div className={`text-sm text-gray-600 bg-gray-50 rounded-xl p-3 transition-all duration-300 ${isExpanded ? '' : 'line-clamp-2'}`}>
                                            <p className="font-medium text-xs text-gray-400 uppercase mb-1">Additional Notes</p>
                                            {details.notes || client.requestNote}
                                        </div>
                                    )}
                                </div>

                                <div className="px-6 py-4 bg-gray-50 border-t border-gray-100 flex justify-between items-center">
                                    <div className="text-xs text-gray-400 flex items-center">
                                        <Calendar size={14} className="mr-1" />
                                        {new Date(client.dateRequested).toLocaleDateString()}
                                    </div>
                                    {client.requestNote && client.requestNote.length > 100 && (
                                        <button
                                            onClick={() => toggleExpand(client.id)}
                                            className="text-indigo-600 hover:text-indigo-700 text-sm font-medium flex items-center transition-colors"
                                        >
                                            {isExpanded ? 'Show Less' : 'View Details'}
                                            {isExpanded ? <ChevronUp size={16} className="ml-1" /> : <ChevronDown size={16} className="ml-1" />}
                                        </button>
                                    )}
                                </div>
                            </div>
                        );
                    })}
                </div>
            )}
        </div>
    );
};

export default MyClients;
