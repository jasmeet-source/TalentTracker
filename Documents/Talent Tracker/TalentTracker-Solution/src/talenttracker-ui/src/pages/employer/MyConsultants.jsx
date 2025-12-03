import React, { useState, useEffect } from 'react';
import { Search, UserPlus, Trash2, CheckCircle, Clock, XCircle, Eye, Briefcase, MapPin, IndianRupee, Award, FileText, ChevronRight, Filter } from 'lucide-react';
import consultantService from '../../services/consultantService';
import { useAuth } from '../../context/AuthContext';

const MyConsultants = () => {
    const { user } = useAuth();
    const [searchQuery, setSearchQuery] = useState('');
    const [searchResults, setSearchResults] = useState([]);
    const [linkedConsultants, setLinkedConsultants] = useState([]);
    const [loading, setLoading] = useState(false);

    // Modal States
    const [selectedConsultant, setSelectedConsultant] = useState(null);
    const [isAccessModalOpen, setIsAccessModalOpen] = useState(false);
    const [isDetailsModalOpen, setIsDetailsModalOpen] = useState(false);

    // Access Request Form Data
    const [accessForm, setAccessForm] = useState({
        role: '',
        salary: '',
        location: '',
        skills: '',
        experience: '',
        notes: ''
    });

    useEffect(() => {
        if (user) {
            fetchLinkedConsultants();
            handleSearch(); // Load all consultants initially
        }
    }, [user]);

    const fetchLinkedConsultants = async () => {
        try {
            const data = await consultantService.getEmployerConsultants(user.id);
            setLinkedConsultants(data);
        } catch (error) {
            console.error("Error fetching linked consultants", error);
        }
    };

    const handleSearch = async (e) => {
        if (e) e.preventDefault();
        setLoading(true);
        try {
            const results = await consultantService.searchConsultants(searchQuery);

            // Filter out already linked consultants
            const linkedIds = linkedConsultants.map(c => c.consultantId);
            const unlinked = results.filter(c => !linkedIds.includes(c.id));

            setSearchResults(unlinked);
        } catch (error) {
            console.error("Search failed", error);
        } finally {
            setLoading(false);
        }
    };

    const openAccessModal = (consultant) => {
        setSelectedConsultant(consultant);
        setAccessForm({ role: '', salary: '', location: '', skills: '', experience: '', notes: '' });
        setIsAccessModalOpen(true);
    };

    const openDetailsModal = (consultant) => {
        setSelectedConsultant(consultant);
        setIsDetailsModalOpen(true);
    };

    const handleGrantAccess = async (e) => {
        e.preventDefault();
        if (!selectedConsultant) return;

        // --- Validation Logic ---
        // Salary Validation - Must contain numbers
        const salaryRegex = /\d/;
        if (!salaryRegex.test(accessForm.salary)) {
            alert("Salary range must contain numeric values (e.g., '100k - 120k').");
            return;
        }
        // ------------------------

        // Format the note
        const note = `
Role: ${accessForm.role}
Salary: ${accessForm.salary}
Location: ${accessForm.location}
Skills: ${accessForm.skills}
Experience: ${accessForm.experience}
Notes: ${accessForm.notes}
        `.trim();

        try {
            await consultantService.grantAccess(user.id, selectedConsultant.id, note);
            alert("Access granted successfully!");
            setIsAccessModalOpen(false);
            fetchLinkedConsultants();
            handleSearch(); // Refresh list
        } catch (error) {
            console.error("Error granting access", error);
            alert("Failed to grant access.");
        }
    };

    const handleRemoveAccess = async (consultantId) => {
        if (window.confirm("Are you sure you want to remove access for this consultant?")) {
            try {
                await consultantService.removeConsultant(user.id, consultantId);
                fetchLinkedConsultants();
                handleSearch();
            } catch (error) {
                console.error("Error removing consultant", error);
            }
        }
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

    return (
        <div className="space-y-12 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div>
                    <h1 className="text-3xl font-bold text-gray-900 tracking-tight">My Consultants</h1>
                    <p className="text-gray-500 mt-1">Manage your consultant network and access</p>
                </div>
            </div>

            {/* Linked Consultants Section */}
            <section>
                <div className="flex items-center justify-between mb-6">
                    <h2 className="text-xl font-bold text-gray-900 flex items-center">
                        <CheckCircle className="text-indigo-600 mr-2" size={24} />
                        Active Network
                    </h2>
                    <span className="bg-indigo-50 text-indigo-700 px-3 py-1 rounded-full text-sm font-semibold">
                        {linkedConsultants.length} Linked
                    </span>
                </div>

                {linkedConsultants.length === 0 ? (
                    <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-12 text-center">
                        <div className="w-16 h-16 bg-gray-50 rounded-full flex items-center justify-center mx-auto mb-4">
                            <UserPlus className="text-gray-400" size={32} />
                        </div>
                        <h3 className="text-lg font-medium text-gray-900">No consultants linked yet</h3>
                        <p className="text-gray-500 mt-2">Search for consultants below to start building your network.</p>
                    </div>
                ) : (
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                        {linkedConsultants.map(link => (
                            <div key={link.id} className="group bg-white rounded-2xl shadow-sm border border-gray-100 hover:shadow-md transition-all duration-300 overflow-hidden">
                                <div className="p-6">
                                    <div className="flex justify-between items-start mb-4">
                                        <div className="h-12 w-12 rounded-xl bg-gradient-to-br from-indigo-500 to-purple-600 flex items-center justify-center text-white font-bold text-xl shadow-indigo-100 shadow-lg">
                                            {link.consultant?.name?.charAt(0)}
                                        </div>
                                        {getStatusBadge(link.status)}
                                    </div>

                                    <h3 className="text-lg font-bold text-gray-900 mb-1">{link.consultant?.name}</h3>
                                    <p className="text-sm text-gray-500 mb-4">{link.consultant?.email}</p>

                                    <div className="flex items-center text-xs text-gray-400 mb-4 bg-gray-50 p-2 rounded-lg inline-block">
                                        <Clock size={14} className="mr-1.5" />
                                        Added: {new Date(link.dateRequested).toLocaleDateString()}
                                    </div>

                                    {link.requestNote && (
                                        <div className="text-sm text-gray-600 bg-gray-50 rounded-xl p-3 mb-4">
                                            <p className="font-medium text-xs text-gray-400 uppercase mb-1">Request Note</p>
                                            <p className="line-clamp-2">{link.requestNote}</p>
                                        </div>
                                    )}
                                </div>
                                <div className="px-6 py-4 bg-gray-50 border-t border-gray-100 flex justify-end">
                                    <button
                                        onClick={() => handleRemoveAccess(link.consultantId)}
                                        className="text-gray-400 hover:text-rose-600 transition-colors flex items-center text-sm font-medium"
                                    >
                                        <Trash2 size={16} className="mr-1.5" /> Remove Access
                                    </button>
                                </div>
                            </div>
                        ))}
                    </div>
                )}
            </section>

            {/* Find Consultants Section */}
            <section className="bg-gray-50 rounded-3xl p-8 border border-gray-100">
                <div className="flex flex-col md:flex-row md:items-center justify-between mb-8 gap-4">
                    <div>
                        <h2 className="text-xl font-bold text-gray-900">Find Consultants</h2>
                        <p className="text-gray-500 text-sm mt-1">Discover and connect with top talent consultants</p>
                    </div>
                    <form onSubmit={handleSearch} className="relative w-full md:w-96">
                        <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400" size={20} />
                        <input
                            type="text"
                            placeholder="Search by name, email, or company..."
                            className="w-full pl-12 pr-4 py-3 bg-white border border-gray-200 rounded-xl focus:ring-2 focus:ring-indigo-500 focus:border-transparent shadow-sm transition-all"
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                        />
                        <button
                            type="submit"
                            className="absolute right-2 top-1/2 transform -translate-y-1/2 bg-indigo-600 text-white p-1.5 rounded-lg hover:bg-indigo-700 transition-colors"
                        >
                            <ChevronRight size={20} />
                        </button>
                    </form>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {searchResults.map(consultant => (
                        <div key={consultant.id} className="bg-white rounded-2xl shadow-sm border border-gray-200 hover:border-indigo-300 hover:shadow-md transition-all duration-300 p-6 flex flex-col">
                            <div className="flex items-center space-x-4 mb-4">
                                <div className="h-14 w-14 rounded-full bg-gray-100 flex items-center justify-center text-gray-600 font-bold text-xl border-2 border-white shadow-sm">
                                    {consultant.name?.charAt(0)}
                                </div>
                                <div>
                                    <h3 className="font-bold text-gray-900">{consultant.name}</h3>
                                    <p className="text-sm text-indigo-600 font-medium">{consultant.company?.name || "Independent Consultant"}</p>
                                </div>
                            </div>

                            <div className="flex-1"></div>

                            <div className="grid grid-cols-2 gap-3 mt-4">
                                <button
                                    onClick={() => openDetailsModal(consultant)}
                                    className="flex items-center justify-center px-4 py-2.5 border border-gray-200 text-gray-700 text-sm font-medium rounded-xl hover:bg-gray-50 hover:border-gray-300 transition-all"
                                >
                                    <Eye size={16} className="mr-2" /> Details
                                </button>
                                <button
                                    onClick={() => openAccessModal(consultant)}
                                    className="flex items-center justify-center px-4 py-2.5 bg-indigo-600 text-white text-sm font-medium rounded-xl hover:bg-indigo-700 shadow-sm hover:shadow-indigo-200 transition-all"
                                >
                                    <UserPlus size={16} className="mr-2" /> Connect
                                </button>
                            </div>
                        </div>
                    ))}
                    {searchResults.length === 0 && !loading && (
                        <div className="col-span-full text-center py-12 text-gray-400">
                            <Search size={48} className="mx-auto mb-4 opacity-20" />
                            <p>No consultants found matching your search.</p>
                        </div>
                    )}
                </div>
            </section>

            {/* Access Request Modal */}
            {isAccessModalOpen && selectedConsultant && (
                <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-center justify-center p-4">
                    <div className="bg-white rounded-2xl shadow-2xl w-full max-w-lg overflow-hidden transform transition-all scale-100">
                        <div className="p-6 border-b border-gray-100 flex justify-between items-center bg-gray-50/50">
                            <div>
                                <h2 className="text-xl font-bold text-gray-900">Grant Access</h2>
                                <p className="text-sm text-gray-500">Share requirements with {selectedConsultant.name}</p>
                            </div>
                            <button onClick={() => setIsAccessModalOpen(false)} className="text-gray-400 hover:text-gray-600 transition-colors">
                                <XCircle size={24} />
                            </button>
                        </div>
                        <form onSubmit={handleGrantAccess} className="p-6 space-y-5 max-h-[75vh] overflow-y-auto custom-scrollbar">
                            <div>
                                <label className="block text-sm font-semibold text-gray-700 mb-1.5">Role / Job Title</label>
                                <div className="relative">
                                    <Briefcase className="absolute left-3.5 top-1/2 transform -translate-y-1/2 text-gray-400" size={18} />
                                    <input
                                        type="text"
                                        required
                                        className="w-full pl-11 pr-4 py-2.5 border border-gray-200 rounded-xl focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all"
                                        value={accessForm.role}
                                        onChange={e => setAccessForm({ ...accessForm, role: e.target.value })}
                                        placeholder="e.g. Senior React Developer"
                                    />
                                </div>
                            </div>

                            <div className="grid grid-cols-2 gap-5">
                                <div>
                                    <label className="block text-sm font-semibold text-gray-700 mb-1.5">Salary Range</label>
                                    <div className="relative">
                                        <IndianRupee className="absolute left-3.5 top-1/2 transform -translate-y-1/2 text-gray-400" size={18} />
                                        <input
                                            type="text"
                                            required
                                            className="w-full pl-11 pr-4 py-2.5 border border-gray-200 rounded-xl focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all"
                                            value={accessForm.salary}
                                            onChange={e => setAccessForm({ ...accessForm, salary: e.target.value })}
                                            placeholder="e.g. 100k - 120k"
                                        />
                                    </div>
                                </div>
                                <div>
                                    <label className="block text-sm font-semibold text-gray-700 mb-1.5">Location</label>
                                    <div className="relative">
                                        <MapPin className="absolute left-3.5 top-1/2 transform -translate-y-1/2 text-gray-400" size={18} />
                                        <input
                                            type="text"
                                            required
                                            className="w-full pl-11 pr-4 py-2.5 border border-gray-200 rounded-xl focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all"
                                            value={accessForm.location}
                                            onChange={e => setAccessForm({ ...accessForm, location: e.target.value })}
                                            placeholder="e.g. Remote / NY"
                                        />
                                    </div>
                                </div>
                            </div>

                            <div>
                                <label className="block text-sm font-semibold text-gray-700 mb-1.5">Required Skills</label>
                                <div className="relative">
                                    <Award className="absolute left-3.5 top-1/2 transform -translate-y-1/2 text-gray-400" size={18} />
                                    <input
                                        type="text"
                                        required
                                        className="w-full pl-11 pr-4 py-2.5 border border-gray-200 rounded-xl focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all"
                                        value={accessForm.skills}
                                        onChange={e => setAccessForm({ ...accessForm, skills: e.target.value })}
                                        placeholder="e.g. React, Node.js, AWS"
                                    />
                                </div>
                            </div>

                            <div>
                                <label className="block text-sm font-semibold text-gray-700 mb-1.5">Experience Required</label>
                                <div className="relative">
                                    <Clock className="absolute left-3.5 top-1/2 transform -translate-y-1/2 text-gray-400" size={18} />
                                    <input
                                        type="text"
                                        required
                                        className="w-full pl-11 pr-4 py-2.5 border border-gray-200 rounded-xl focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all"
                                        value={accessForm.experience}
                                        onChange={e => setAccessForm({ ...accessForm, experience: e.target.value })}
                                        placeholder="e.g. 5+ years"
                                    />
                                </div>
                            </div>

                            <div>
                                <label className="block text-sm font-semibold text-gray-700 mb-1.5">Additional Notes</label>
                                <div className="relative">
                                    <FileText className="absolute left-3.5 top-3.5 text-gray-400" size={18} />
                                    <textarea
                                        rows="3"
                                        className="w-full pl-11 pr-4 py-2.5 border border-gray-200 rounded-xl focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all"
                                        value={accessForm.notes}
                                        onChange={e => setAccessForm({ ...accessForm, notes: e.target.value })}
                                        placeholder="Any specific requirements or context..."
                                    ></textarea>
                                </div>
                            </div>

                            <div className="flex justify-end space-x-3 pt-4 border-t border-gray-100">
                                <button
                                    type="button"
                                    onClick={() => setIsAccessModalOpen(false)}
                                    className="px-5 py-2.5 text-gray-700 hover:bg-gray-100 rounded-xl font-medium transition-colors"
                                >
                                    Cancel
                                </button>
                                <button
                                    type="submit"
                                    className="px-6 py-2.5 bg-indigo-600 text-white rounded-xl hover:bg-indigo-700 font-medium shadow-lg shadow-indigo-200 transition-all transform hover:-translate-y-0.5"
                                >
                                    Grant Access
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}

            {/* Details Modal */}
            {isDetailsModalOpen && selectedConsultant && (
                <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-center justify-center p-4">
                    <div className="bg-white rounded-2xl shadow-2xl w-full max-w-md overflow-hidden transform transition-all scale-100">
                        <div className="relative h-24 bg-gradient-to-r from-indigo-500 to-purple-600">
                            <button onClick={() => setIsDetailsModalOpen(false)} className="absolute top-4 right-4 text-white/80 hover:text-white transition-colors">
                                <XCircle size={28} />
                            </button>
                        </div>
                        <div className="px-6 pb-6 -mt-12">
                            <div className="flex flex-col items-center mb-6">
                                <div className="h-24 w-24 rounded-full bg-white p-1 shadow-lg mb-3">
                                    <div className="h-full w-full rounded-full bg-indigo-50 flex items-center justify-center text-indigo-600 text-3xl font-bold">
                                        {selectedConsultant.name?.charAt(0)}
                                    </div>
                                </div>
                                <h3 className="text-xl font-bold text-gray-900">{selectedConsultant.name}</h3>
                                <p className="text-indigo-600 font-medium">{selectedConsultant.company?.name || "Independent Consultant"}</p>
                            </div>

                            <div className="space-y-4 bg-gray-50 rounded-xl p-5 border border-gray-100">
                                <div className="flex items-start">
                                    <div className="w-8 text-indigo-500 mt-0.5"><Briefcase size={18} /></div>
                                    <div>
                                        <p className="text-xs text-gray-400 uppercase font-bold tracking-wider">Email</p>
                                        <p className="text-gray-900 font-medium">{selectedConsultant.email}</p>
                                    </div>
                                </div>
                                <div className="flex items-start">
                                    <div className="w-8 text-indigo-500 mt-0.5"><MapPin size={18} /></div>
                                    <div>
                                        <p className="text-xs text-gray-400 uppercase font-bold tracking-wider">Location</p>
                                        <p className="text-gray-900 font-medium">{selectedConsultant.city || "Not specified"}, {selectedConsultant.state}</p>
                                    </div>
                                </div>
                                <div className="flex items-start">
                                    <div className="w-8 text-indigo-500 mt-0.5"><Award size={18} /></div>
                                    <div>
                                        <p className="text-xs text-gray-400 uppercase font-bold tracking-wider">Specialization</p>
                                        <p className="text-gray-900 font-medium">{selectedConsultant.skills || "General"}</p>
                                    </div>
                                </div>
                            </div>

                            <div className="mt-6">
                                <button
                                    onClick={() => {
                                        setIsDetailsModalOpen(false);
                                        openAccessModal(selectedConsultant);
                                    }}
                                    className="w-full py-3 bg-indigo-600 text-white rounded-xl hover:bg-indigo-700 font-bold shadow-lg shadow-indigo-200 transition-all transform hover:-translate-y-0.5"
                                >
                                    Grant Access
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default MyConsultants;
