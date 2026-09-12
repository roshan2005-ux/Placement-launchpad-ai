import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { api } from '../services/api';
import { PlacementPipeline } from '../components/PlacementPipeline';
import {
  Briefcase,
  Plus,
  Search,
  Filter,
  CheckCircle2,
  Clock,
  MessageSquareCode,
  Trophy,
  XCircle,
  ExternalLink,
  Edit2,
  Trash2,
  AlertCircle,
  Check,
  ChevronDown,
  Loader2,
  MapPin,
  Calendar,
  Layers,
  ArrowLeft,
  X
} from 'lucide-react';

const STATUS_OPTIONS = ['Applied', 'Assessment', 'Interview', 'Selected', 'Rejected'];
const JOB_TYPE_OPTIONS = ['Full-Time', 'Internship', 'Part-Time', 'Contract'];

const STATUS_STYLES = {
  Applied: {
    badge: 'bg-sky-500/10 text-sky-400 border-sky-500/30',
    dot: 'bg-sky-400',
  },
  Assessment: {
    badge: 'bg-amber-500/10 text-amber-400 border-amber-500/30',
    dot: 'bg-amber-400',
  },
  Interview: {
    badge: 'bg-violet-500/10 text-violet-400 border-violet-500/30',
    dot: 'bg-violet-400',
  },
  Selected: {
    badge: 'bg-emerald-500/10 text-emerald-400 border-emerald-500/30',
    dot: 'bg-emerald-400',
  },
  Rejected: {
    badge: 'bg-rose-500/10 text-rose-400 border-rose-500/30',
    dot: 'bg-rose-400',
  },
};

export const JobApplications = () => {
  const [applications, setApplications] = useState([]);
  const [stats, setStats] = useState({
    total: 0,
    applied: 0,
    assessment: 0,
    interview: 0,
    selected: 0,
    rejected: 0,
    active: 0,
  });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [successMessage, setSuccessMessage] = useState(null);

  // Student prerequisites state for placement pipeline
  const [hasResume, setHasResume] = useState(false);
  const [hasRoadmap, setHasRoadmap] = useState(false);

  // Search & Filter state
  const [searchTerm, setSearchTerm] = useState('');
  const [activeStatusFilter, setActiveStatusFilter] = useState('All');

  // Modal state
  const [modalOpen, setModalOpen] = useState(false);
  const [modalMode, setModalMode] = useState('create'); // 'create' | 'edit'
  const [editingId, setEditingId] = useState(null);
  const [formData, setFormData] = useState({
    companyName: '',
    jobRole: '',
    location: 'Remote',
    applicationDate: new Date().toISOString().split('T')[0],
    jobType: 'Full-Time',
    status: 'Applied',
    jobUrl: '',
    notes: '',
  });
  const [formSubmitting, setFormSubmitting] = useState(false);
  const [formError, setFormError] = useState(null);

  // Delete confirmation modal
  const [deleteTarget, setDeleteTarget] = useState(null);
  const [deleting, setDeleting] = useState(false);

  useEffect(() => {
    loadAllData();
  }, []);

  const loadAllData = async () => {
    try {
      setLoading(true);
      setError(null);

      // Load applications and stats concurrently
      const [appsRes, statsRes] = await Promise.all([
        api.getApplications(),
        api.getApplicationStats(),
      ]);

      if (appsRes.status === 'success') {
        setApplications(appsRes.applications || []);
      }
      if (statsRes.status === 'success') {
        setStats(statsRes.stats);
      }

      // Check for resume and roadmap to power pipeline accurately
      try {
        const resumeRes = await api.getResume();
        setHasResume(Boolean(resumeRes?.resume));
      } catch {
        setHasResume(false);
      }

      try {
        const roadmapRes = await api.getLatestRoadmap();
        setHasRoadmap(Boolean(roadmapRes?.roadmap));
      } catch {
        setHasRoadmap(false);
      }
    } catch (err) {
      setError(err.message || 'Failed to load applications data.');
    } finally {
      setLoading(false);
    }
  };

  const handleOpenCreateModal = () => {
    setModalMode('create');
    setEditingId(null);
    setFormData({
      companyName: '',
      jobRole: '',
      location: 'Remote',
      applicationDate: new Date().toISOString().split('T')[0],
      jobType: 'Full-Time',
      status: 'Applied',
      jobUrl: '',
      notes: '',
    });
    setFormError(null);
    setModalOpen(true);
  };

  const handleOpenEditModal = (app) => {
    setModalMode('edit');
    setEditingId(app.id);
    setFormData({
      companyName: app.companyName || '',
      jobRole: app.jobRole || '',
      location: app.location || 'Remote',
      applicationDate: app.applicationDate
        ? new Date(app.applicationDate).toISOString().split('T')[0]
        : new Date().toISOString().split('T')[0],
      jobType: app.jobType || 'Full-Time',
      status: app.status || 'Applied',
      jobUrl: app.jobUrl || '',
      notes: app.notes || '',
    });
    setFormError(null);
    setModalOpen(true);
  };

  const handleFormSubmit = async (e) => {
    e.preventDefault();
    setFormError(null);

    // Client-side validation
    if (!formData.companyName.trim()) {
      setFormError('Company name is required.');
      return;
    }
    if (!formData.jobRole.trim()) {
      setFormError('Job role is required.');
      return;
    }
    if (formData.jobUrl && formData.jobUrl.trim()) {
      const url = formData.jobUrl.trim();
      if (!url.startsWith('http://') && !url.startsWith('https://')) {
        setFormError('Job URL must start with http:// or https://');
        return;
      }
    }

    try {
      setFormSubmitting(true);
      if (modalMode === 'create') {
        const res = await api.createApplication(formData);
        if (res.status === 'success') {
          setSuccessMessage(`Application for ${formData.companyName} added!`);
          setModalOpen(false);
          await loadAllData();
        }
      } else {
        const res = await api.updateApplication(editingId, formData);
        if (res.status === 'success') {
          setSuccessMessage(`Application for ${formData.companyName} updated!`);
          setModalOpen(false);
          await loadAllData();
        }
      }
      setTimeout(() => setSuccessMessage(null), 3500);
    } catch (err) {
      setFormError(err.message || 'Failed to save application.');
    } finally {
      setFormSubmitting(false);
    }
  };

  const handleStatusChange = async (appId, newStatus) => {
    try {
      const res = await api.updateApplicationStatus(appId, newStatus);
      if (res.status === 'success') {
        setApplications((prev) =>
          prev.map((app) => (app.id === appId ? { ...app, status: newStatus } : app))
        );
        // Refresh stats
        const statsRes = await api.getApplicationStats();
        if (statsRes.status === 'success') {
          setStats(statsRes.stats);
        }
      }
    } catch (err) {
      setError(`Failed to update status: ${err.message}`);
    }
  };

  const handleDelete = async () => {
    if (!deleteTarget) return;
    try {
      setDeleting(true);
      const res = await api.deleteApplication(deleteTarget.id);
      if (res.status === 'success') {
        setSuccessMessage(`Application for ${deleteTarget.companyName} removed.`);
        setDeleteTarget(null);
        await loadAllData();
        setTimeout(() => setSuccessMessage(null), 3500);
      }
    } catch (err) {
      setError(`Failed to delete application: ${err.message}`);
    } finally {
      setDeleting(false);
    }
  };

  // Filter applications by search and status
  const filteredApplications = applications.filter((app) => {
    const matchesStatus =
      activeStatusFilter === 'All' || app.status === activeStatusFilter;
    const matchesSearch =
      !searchTerm.trim() ||
      app.companyName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      app.jobRole.toLowerCase().includes(searchTerm.toLowerCase()) ||
      (app.location && app.location.toLowerCase().includes(searchTerm.toLowerCase()));
    return matchesStatus && matchesSearch;
  });

  return (
    <div className="min-h-[calc(100vh-4rem)] bg-slate-950 py-8 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto space-y-8">
        {/* Navigation & Header */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div className="space-y-1">
            <Link
              to="/dashboard"
              className="inline-flex items-center gap-1.5 text-xs text-slate-400 hover:text-indigo-300 font-medium transition-colors mb-1"
            >
              <ArrowLeft className="w-3.5 h-3.5" />
              <span>Back to Dashboard</span>
            </Link>
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-2xl bg-gradient-to-tr from-sky-600 to-indigo-600 flex items-center justify-center shadow-lg shadow-sky-500/20">
                <Briefcase className="w-5 h-5 text-white" />
              </div>
              <div>
                <h1 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight">
                  Job Applications Tracker
                </h1>
                <p className="text-xs sm:text-sm text-slate-400">
                  Track company applications, interview rounds, and monitor your placement journey.
                </p>
              </div>
            </div>
          </div>

          <button
            type="button"
            onClick={handleOpenCreateModal}
            className="inline-flex items-center justify-center gap-2 px-5 py-2.5 rounded-xl text-xs sm:text-sm font-bold bg-gradient-to-r from-sky-600 to-indigo-600 hover:from-sky-500 hover:to-indigo-500 text-white shadow-lg shadow-sky-500/20 transition-all cursor-pointer"
          >
            <Plus className="w-4 h-4" />
            <span>Add Job Application</span>
          </button>
        </div>

        {/* Success Alert */}
        {successMessage && (
          <div className="p-4 rounded-2xl bg-emerald-500/10 border border-emerald-500/30 flex items-center gap-3 text-emerald-300 text-xs sm:text-sm">
            <Check className="w-5 h-5 text-emerald-400 flex-shrink-0" />
            <span>{successMessage}</span>
          </div>
        )}

        {/* Global Error Alert */}
        {error && (
          <div className="p-4 rounded-2xl bg-rose-500/10 border border-rose-500/30 flex items-center justify-between gap-3 text-rose-300 text-xs sm:text-sm">
            <div className="flex items-center gap-2.5">
              <AlertCircle className="w-5 h-5 text-rose-400 flex-shrink-0" />
              <span>{error}</span>
            </div>
            <button onClick={() => setError(null)} className="text-rose-400 hover:text-rose-200">
              <X className="w-4 h-4" />
            </button>
          </div>
        )}

        {/* Feature 4: Placement Pipeline Progress */}
        <PlacementPipeline
          hasResume={hasResume}
          hasRoadmap={hasRoadmap}
          stats={stats}
        />

        {/* Feature 3: Dashboard Statistics Cards */}
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-3.5">
          {/* Total */}
          <div className="bg-slate-900/90 border border-slate-800 rounded-2xl p-4 shadow-xl flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-slate-800 border border-slate-700 flex items-center justify-center text-slate-300">
              <Layers className="w-5 h-5" />
            </div>
            <div>
              <div className="text-2xl font-black font-mono text-white">{stats.total}</div>
              <div className="text-[11px] text-slate-400 font-medium">Total Applied</div>
            </div>
          </div>

          {/* Assessments */}
          <div className="bg-slate-900/90 border border-slate-800 rounded-2xl p-4 shadow-xl flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-amber-500/10 border border-amber-500/20 flex items-center justify-center text-amber-400">
              <Clock className="w-5 h-5" />
            </div>
            <div>
              <div className="text-2xl font-black font-mono text-amber-400">{stats.assessment}</div>
              <div className="text-[11px] text-slate-400 font-medium">Assessments</div>
            </div>
          </div>

          {/* Interviews */}
          <div className="bg-slate-900/90 border border-slate-800 rounded-2xl p-4 shadow-xl flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-violet-500/10 border border-violet-500/20 flex items-center justify-center text-violet-400">
              <MessageSquareCode className="w-5 h-5" />
            </div>
            <div>
              <div className="text-2xl font-black font-mono text-violet-400">{stats.interview}</div>
              <div className="text-[11px] text-slate-400 font-medium">Interviews</div>
            </div>
          </div>

          {/* Selected */}
          <div className="bg-slate-900/90 border border-slate-800 rounded-2xl p-4 shadow-xl flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-emerald-500/10 border border-emerald-500/20 flex items-center justify-center text-emerald-400">
              <Trophy className="w-5 h-5" />
            </div>
            <div>
              <div className="text-2xl font-black font-mono text-emerald-400">{stats.selected}</div>
              <div className="text-[11px] text-slate-400 font-medium">Selected / Offers</div>
            </div>
          </div>

          {/* Rejected */}
          <div className="bg-slate-900/90 border border-slate-800 rounded-2xl p-4 shadow-xl flex items-center gap-3 col-span-2 md:col-span-1">
            <div className="w-10 h-10 rounded-xl bg-rose-500/10 border border-rose-500/20 flex items-center justify-center text-rose-400">
              <XCircle className="w-5 h-5" />
            </div>
            <div>
              <div className="text-2xl font-black font-mono text-rose-400">{stats.rejected}</div>
              <div className="text-[11px] text-slate-400 font-medium">Rejected</div>
            </div>
          </div>
        </div>

        {/* Feature 1 & 2: Applications Section with Search & Filter */}
        <div className="bg-slate-900/90 border border-slate-800 rounded-3xl p-6 sm:p-8 shadow-2xl backdrop-blur-xl space-y-6">
          {/* Controls Bar */}
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-slate-800 pb-5">
            {/* Search Input */}
            <div className="relative flex-1 max-w-md">
              <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2 pointer-events-none" />
              <input
                type="text"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                placeholder="Search by company, role, or location..."
                className="w-full pl-10 pr-4 py-2 bg-slate-950/80 border border-slate-800 rounded-xl text-xs sm:text-sm text-slate-200 placeholder-slate-500 focus:outline-none focus:border-sky-500 transition-colors"
              />
              {searchTerm && (
                <button
                  onClick={() => setSearchTerm('')}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-500 hover:text-slate-300"
                >
                  <X className="w-3.5 h-3.5" />
                </button>
              )}
            </div>

            {/* Filter Tabs */}
            <div className="flex items-center gap-1.5 overflow-x-auto pb-1 sm:pb-0">
              {['All', ...STATUS_OPTIONS].map((status) => (
                <button
                  key={status}
                  type="button"
                  onClick={() => setActiveStatusFilter(status)}
                  className={`px-3 py-1.5 rounded-xl text-xs font-semibold whitespace-nowrap transition-all cursor-pointer ${
                    activeStatusFilter === status
                      ? 'bg-sky-600 text-white shadow-md shadow-sky-500/20'
                      : 'bg-slate-950/80 text-slate-400 hover:text-slate-200 border border-slate-800'
                  }`}
                >
                  {status}
                  {status === 'All' && ` (${applications.length})`}
                  {status === 'Applied' && ` (${stats.applied})`}
                  {status === 'Assessment' && ` (${stats.assessment})`}
                  {status === 'Interview' && ` (${stats.interview})`}
                  {status === 'Selected' && ` (${stats.selected})`}
                  {status === 'Rejected' && ` (${stats.rejected})`}
                </button>
              ))}
            </div>
          </div>

          {/* Applications List */}
          {loading ? (
            <div className="py-16 text-center space-y-3">
              <Loader2 className="w-8 h-8 text-sky-400 animate-spin mx-auto" />
              <p className="text-xs text-slate-400">Loading your applications...</p>
            </div>
          ) : filteredApplications.length > 0 ? (
            <div className="space-y-3">
              {filteredApplications.map((app) => {
                const style = STATUS_STYLES[app.status] || STATUS_STYLES.Applied;
                return (
                  <div
                    key={app.id}
                    className="p-5 rounded-2xl bg-slate-950/70 border border-slate-800/90 hover:border-slate-700 transition-all flex flex-col md:flex-row md:items-center justify-between gap-4 group"
                  >
                    {/* Left: Company & Role Details */}
                    <div className="space-y-1.5 flex-1 min-w-0">
                      <div className="flex flex-wrap items-center gap-2.5">
                        <h3 className="text-base font-bold text-white tracking-tight">
                          {app.companyName}
                        </h3>

                        {/* Job Type Badge */}
                        <span className="text-[10px] font-mono px-2 py-0.5 rounded-md bg-slate-800 text-slate-300 border border-slate-700">
                          {app.jobType}
                        </span>

                        {/* External Link */}
                        {app.jobUrl && (
                          <a
                            href={app.jobUrl}
                            target="_blank"
                            rel="noreferrer"
                            className="text-slate-500 hover:text-sky-400 transition-colors inline-flex items-center gap-1 text-[11px]"
                            title="Open Job Posting"
                          >
                            <ExternalLink className="w-3 h-3" />
                            <span className="hidden sm:inline">Job Link</span>
                          </a>
                        )}
                      </div>

                      <div className="text-xs font-medium text-slate-300">
                        {app.jobRole}
                      </div>

                      {/* Meta: Location, Application Date */}
                      <div className="flex flex-wrap items-center gap-3 text-[11px] text-slate-500">
                        <span className="flex items-center gap-1">
                          <MapPin className="w-3 h-3 text-slate-600" />
                          {app.location || 'Remote'}
                        </span>
                        <span>&bull;</span>
                        <span className="flex items-center gap-1">
                          <Calendar className="w-3 h-3 text-slate-600" />
                          Applied: {app.applicationDate ? new Date(app.applicationDate).toLocaleDateString() : 'N/A'}
                        </span>
                      </div>

                      {/* Notes Preview */}
                      {app.notes && (
                        <p className="text-[11px] text-slate-400 bg-slate-900/60 p-2.5 rounded-xl border border-slate-800/80 mt-2 max-w-3xl leading-relaxed">
                          <span className="text-slate-500 font-semibold">Notes: </span>
                          {app.notes}
                        </p>
                      )}
                    </div>

                    {/* Right: Status Dropdown & Action Buttons */}
                    <div className="flex items-center gap-3 self-end md:self-center flex-shrink-0 pt-2 md:pt-0 border-t md:border-t-0 border-slate-800/80 w-full md:w-auto justify-between md:justify-end">
                      {/* Interactive Status Selector */}
                      <div className="relative">
                        <select
                          value={app.status}
                          onChange={(e) => handleStatusChange(app.id, e.target.value)}
                          className={`text-xs font-bold font-mono pl-3 pr-8 py-1.5 rounded-xl border appearance-none cursor-pointer focus:outline-none ${style.badge}`}
                        >
                          {STATUS_OPTIONS.map((st) => (
                            <option key={st} value={st} className="bg-slate-900 text-slate-200">
                              {st}
                            </option>
                          ))}
                        </select>
                        <ChevronDown className="w-3.5 h-3.5 absolute right-2.5 top-1/2 -translate-y-1/2 pointer-events-none opacity-60" />
                      </div>

                      {/* Edit Button */}
                      <button
                        type="button"
                        onClick={() => handleOpenEditModal(app)}
                        className="p-2 rounded-xl text-slate-400 hover:text-sky-300 hover:bg-slate-800 transition-colors"
                        title="Edit Application"
                      >
                        <Edit2 className="w-4 h-4" />
                      </button>

                      {/* Delete Button */}
                      <button
                        type="button"
                        onClick={() => setDeleteTarget(app)}
                        className="p-2 rounded-xl text-slate-400 hover:text-rose-400 hover:bg-rose-500/10 transition-colors"
                        title="Delete Application"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </div>
                );
              })}
            </div>
          ) : (
            <div className="py-12 text-center space-y-3 bg-slate-950/40 rounded-2xl border border-slate-800">
              <Briefcase className="w-10 h-10 text-slate-600 mx-auto" />
              <div className="space-y-1">
                <h4 className="text-sm font-bold text-slate-300">No applications found</h4>
                <p className="text-xs text-slate-500 max-w-sm mx-auto">
                  {searchTerm || activeStatusFilter !== 'All'
                    ? 'No applications match your filter criteria. Try changing your search query or status filter.'
                    : 'Start adding your targeted job applications to track assessments, interviews, and offers.'}
                </p>
              </div>
              <button
                type="button"
                onClick={handleOpenCreateModal}
                className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl text-xs font-semibold bg-sky-500/10 hover:bg-sky-500/20 text-sky-400 border border-sky-500/30 transition-all cursor-pointer"
              >
                <Plus className="w-3.5 h-3.5" />
                <span>Add Your First Application</span>
              </button>
            </div>
          )}
        </div>
      </div>

      {/* Add / Edit Application Modal */}
      {modalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-sm">
          <div className="bg-slate-900 border border-slate-800 rounded-3xl p-6 sm:p-8 max-w-lg w-full shadow-2xl space-y-5 relative max-h-[90vh] overflow-y-auto">
            {/* Header */}
            <div className="flex items-center justify-between border-b border-slate-800 pb-4">
              <div className="flex items-center gap-2.5">
                <div className="w-8 h-8 rounded-xl bg-sky-500/10 border border-sky-500/20 flex items-center justify-center text-sky-400">
                  <Briefcase className="w-4 h-4" />
                </div>
                <h3 className="text-lg font-bold text-white tracking-tight">
                  {modalMode === 'create' ? 'Add Job Application' : 'Edit Job Application'}
                </h3>
              </div>
              <button
                onClick={() => setModalOpen(false)}
                className="text-slate-500 hover:text-slate-300 p-1"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Error in modal */}
            {formError && (
              <div className="p-3 rounded-xl bg-rose-500/10 border border-rose-500/20 text-rose-300 text-xs flex items-center gap-2">
                <AlertCircle className="w-4 h-4 text-rose-400 flex-shrink-0" />
                <span>{formError}</span>
              </div>
            )}

            {/* Form */}
            <form onSubmit={handleFormSubmit} className="space-y-4">
              {/* Company Name */}
              <div className="space-y-1">
                <label className="text-xs font-semibold text-slate-300">
                  Company Name <span className="text-rose-400">*</span>
                </label>
                <input
                  type="text"
                  required
                  value={formData.companyName}
                  onChange={(e) => setFormData({ ...formData, companyName: e.target.value })}
                  placeholder="e.g. Google, Microsoft, Amazon, Atlassian"
                  className="w-full px-3.5 py-2 bg-slate-950 border border-slate-800 rounded-xl text-xs sm:text-sm text-slate-200 focus:outline-none focus:border-sky-500"
                />
              </div>

              {/* Job Role */}
              <div className="space-y-1">
                <label className="text-xs font-semibold text-slate-300">
                  Job Role <span className="text-rose-400">*</span>
                </label>
                <input
                  type="text"
                  required
                  value={formData.jobRole}
                  onChange={(e) => setFormData({ ...formData, jobRole: e.target.value })}
                  placeholder="e.g. Full Stack Engineer, Graduate SDE, Data Analyst"
                  className="w-full px-3.5 py-2 bg-slate-950 border border-slate-800 rounded-xl text-xs sm:text-sm text-slate-200 focus:outline-none focus:border-sky-500"
                />
              </div>

              {/* Grid: Job Type & Status */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
                <div className="space-y-1">
                  <label className="text-xs font-semibold text-slate-300">Job Type</label>
                  <select
                    value={formData.jobType}
                    onChange={(e) => setFormData({ ...formData, jobType: e.target.value })}
                    className="w-full px-3 py-2 bg-slate-950 border border-slate-800 rounded-xl text-xs sm:text-sm text-slate-200 focus:outline-none focus:border-sky-500"
                  >
                    {JOB_TYPE_OPTIONS.map((type) => (
                      <option key={type} value={type}>
                        {type}
                      </option>
                    ))}
                  </select>
                </div>

                <div className="space-y-1">
                  <label className="text-xs font-semibold text-slate-300">Application Status</label>
                  <select
                    value={formData.status}
                    onChange={(e) => setFormData({ ...formData, status: e.target.value })}
                    className="w-full px-3 py-2 bg-slate-950 border border-slate-800 rounded-xl text-xs sm:text-sm text-slate-200 focus:outline-none focus:border-sky-500"
                  >
                    {STATUS_OPTIONS.map((st) => (
                      <option key={st} value={st}>
                        {st}
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              {/* Grid: Location & Date */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
                <div className="space-y-1">
                  <label className="text-xs font-semibold text-slate-300">Location</label>
                  <input
                    type="text"
                    value={formData.location}
                    onChange={(e) => setFormData({ ...formData, location: e.target.value })}
                    placeholder="e.g. Bangalore, Hyderabad, Remote"
                    className="w-full px-3.5 py-2 bg-slate-950 border border-slate-800 rounded-xl text-xs sm:text-sm text-slate-200 focus:outline-none focus:border-sky-500"
                  />
                </div>

                <div className="space-y-1">
                  <label className="text-xs font-semibold text-slate-300">Application Date</label>
                  <input
                    type="date"
                    value={formData.applicationDate}
                    onChange={(e) => setFormData({ ...formData, applicationDate: e.target.value })}
                    className="w-full px-3.5 py-2 bg-slate-950 border border-slate-800 rounded-xl text-xs sm:text-sm text-slate-200 focus:outline-none focus:border-sky-500"
                  />
                </div>
              </div>

              {/* Job URL */}
              <div className="space-y-1">
                <label className="text-xs font-semibold text-slate-300">
                  Job / Company Posting URL <span className="text-slate-500 text-[10px]">(Optional)</span>
                </label>
                <input
                  type="url"
                  value={formData.jobUrl}
                  onChange={(e) => setFormData({ ...formData, jobUrl: e.target.value })}
                  placeholder="https://careers.company.com/job/12345"
                  className="w-full px-3.5 py-2 bg-slate-950 border border-slate-800 rounded-xl text-xs sm:text-sm text-slate-200 focus:outline-none focus:border-sky-500"
                />
              </div>

              {/* Notes */}
              <div className="space-y-1">
                <label className="text-xs font-semibold text-slate-300">
                  Notes & Interview Schedule <span className="text-slate-500 text-[10px]">(Optional)</span>
                </label>
                <textarea
                  rows="3"
                  value={formData.notes}
                  onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
                  placeholder="Round details, test dates, recruiter name, preparation topics..."
                  className="w-full px-3.5 py-2 bg-slate-950 border border-slate-800 rounded-xl text-xs sm:text-sm text-slate-200 focus:outline-none focus:border-sky-500"
                />
              </div>

              {/* Actions */}
              <div className="pt-3 border-t border-slate-800 flex items-center justify-end gap-3">
                <button
                  type="button"
                  onClick={() => setModalOpen(false)}
                  className="px-4 py-2 rounded-xl text-xs font-semibold text-slate-400 hover:text-slate-200 bg-slate-950 border border-slate-800 transition-colors"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={formSubmitting}
                  className="inline-flex items-center gap-2 px-5 py-2 rounded-xl text-xs font-bold bg-gradient-to-r from-sky-600 to-indigo-600 hover:from-sky-500 hover:to-indigo-500 text-white shadow-lg shadow-sky-500/20 transition-all disabled:opacity-50 cursor-pointer"
                >
                  {formSubmitting && <Loader2 className="w-3.5 h-3.5 animate-spin" />}
                  <span>{modalMode === 'create' ? 'Save Application' : 'Update Application'}</span>
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Delete Confirmation Modal */}
      {deleteTarget && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-sm">
          <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 max-w-sm w-full shadow-2xl space-y-4">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-rose-500/10 border border-rose-500/20 flex items-center justify-center text-rose-400">
                <Trash2 className="w-5 h-5" />
              </div>
              <div>
                <h4 className="text-sm font-bold text-white">Delete Application?</h4>
                <p className="text-xs text-slate-400">
                  {deleteTarget.companyName} ({deleteTarget.jobRole})
                </p>
              </div>
            </div>

            <p className="text-xs text-slate-400 leading-relaxed">
              Are you sure you want to remove this application? This action cannot be undone.
            </p>

            <div className="flex items-center justify-end gap-2.5 pt-2">
              <button
                type="button"
                onClick={() => setDeleteTarget(null)}
                disabled={deleting}
                className="px-3.5 py-1.5 rounded-xl text-xs font-semibold text-slate-400 hover:text-slate-200 bg-slate-950 border border-slate-800"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={handleDelete}
                disabled={deleting}
                className="px-4 py-1.5 rounded-xl text-xs font-semibold bg-rose-600 hover:bg-rose-500 text-white shadow-md shadow-rose-500/20 transition-colors"
              >
                {deleting ? 'Deleting...' : 'Confirm Delete'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default JobApplications;
