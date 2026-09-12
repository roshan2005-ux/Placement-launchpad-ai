import { useState, useEffect, useRef } from 'react';
import { api } from '../services/api';
import { 
  FileText, 
  Upload, 
  Trash2, 
  RefreshCw, 
  CheckCircle2, 
  AlertCircle, 
  FileCheck, 
  Clock, 
  HardDrive,
  Loader2,
  Sparkles
} from 'lucide-react';

const ALLOWED_EXTENSIONS = ['.pdf', '.doc', '.docx'];
const MAX_FILE_SIZE = 5 * 1024 * 1024; // 5 MB

export const ResumeSection = ({
  onAnalyze,
  analyzing = false,
  hasAnalysis = false,
  targetRole = '',
  onResumeChange,
}) => {
  const [resume, setResume] = useState(null);
  const [loading, setLoading] = useState(true);
  const [uploading, setUploading] = useState(false);
  const [deleting, setDeleting] = useState(false);
  const [error, setError] = useState(null);
  const [successMessage, setSuccessMessage] = useState(null);
  const [isDragOver, setIsDragOver] = useState(false);

  const fileInputRef = useRef(null);

  // Fetch student resume on mount
  useEffect(() => {
    fetchResume();
  }, []);

  const fetchResume = async () => {
    try {
      setLoading(true);
      setError(null);
      const res = await api.getResume();
      if (res.status === 'success') {
        setResume(res.resume);
        if (onResumeChange) onResumeChange(res.resume);
      }
    } catch (err) {
      console.error('Failed to fetch resume:', err.message);
    } finally {
      setLoading(false);
    }
  };

  const validateFile = (file) => {
    if (!file) return 'Please select a file to upload.';

    const ext = '.' + file.name.split('.').pop().toLowerCase();
    if (!ALLOWED_EXTENSIONS.includes(ext)) {
      return 'Only PDF, DOC and DOCX files are allowed.';
    }

    if (file.size > MAX_FILE_SIZE) {
      return 'Maximum file size is 5 MB.';
    }

    return null;
  };

  const handleFileUpload = async (file) => {
    const validationError = validateFile(file);
    if (validationError) {
      setError(validationError);
      setSuccessMessage(null);
      if (fileInputRef.current) fileInputRef.current.value = '';
      return;
    }

    try {
      setUploading(true);
      setError(null);
      setSuccessMessage(null);

      const formData = new FormData();
      formData.append('resume', file);

      const res = await api.uploadResume(formData);
      if (res.status === 'success' && res.resume) {
        setResume(res.resume);
        if (onResumeChange) onResumeChange(res.resume);
        setSuccessMessage('✓ Resume uploaded successfully');
        setTimeout(() => setSuccessMessage(null), 5000);
      }
    } catch (err) {
      setError(err.message || 'Failed to upload resume.');
    } finally {
      setUploading(false);
      if (fileInputRef.current) fileInputRef.current.value = '';
    }
  };

  const onFileInputChange = (e) => {
    const file = e.target.files?.[0];
    if (file) {
      handleFileUpload(file);
    }
  };

  const handleDelete = async () => {
    if (!window.confirm('Are you sure you want to delete your uploaded resume?')) {
      return;
    }

    try {
      setDeleting(true);
      setError(null);
      await api.deleteResume();
      setResume(null);
      if (onResumeChange) onResumeChange(null);
      setSuccessMessage('Resume deleted successfully.');
      setTimeout(() => setSuccessMessage(null), 4000);
    } catch (err) {
      setError(err.message || 'Failed to delete resume.');
    } finally {
      setDeleting(false);
    }
  };

  const handleAnalyzeClick = () => {
    if (!resume) {
      setError('Upload your resume to start AI analysis.');
      return;
    }
    if (!targetRole || !targetRole.trim()) {
      setError('Select a target job role before analysis.');
      return;
    }
    setError(null);
    if (onAnalyze) {
      onAnalyze();
    }
  };

  const handleDragOver = (e) => {
    e.preventDefault();
    setIsDragOver(true);
  };

  const handleDragLeave = () => {
    setIsDragOver(false);
  };

  const handleDrop = (e) => {
    e.preventDefault();
    setIsDragOver(false);
    const file = e.dataTransfer?.files?.[0];
    if (file) {
      handleFileUpload(file);
    }
  };

  const formatFileSize = (bytes) => {
    if (!bytes && bytes !== 0) return 'Unknown size';
    if (bytes < 1024) return `${bytes} B`;
    if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`;
    return `${(bytes / (1024 * 1024)).toFixed(2)} MB`;
  };

  const formatDate = (dateString) => {
    if (!dateString) return 'Just now';
    const d = new Date(dateString);
    return d.toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    });
  };

  const formatFileType = (mimeOrExt, originalName) => {
    if (originalName) {
      const ext = originalName.split('.').pop().toUpperCase();
      if (['PDF', 'DOC', 'DOCX'].includes(ext)) return ext;
    }
    if (mimeOrExt?.includes('pdf')) return 'PDF';
    if (mimeOrExt?.includes('wordprocessingml')) return 'DOCX';
    if (mimeOrExt?.includes('msword')) return 'DOC';
    return 'Document';
  };

  return (
    <div className="bg-slate-900/90 border border-slate-800 rounded-3xl p-6 sm:p-8 shadow-2xl backdrop-blur-xl relative overflow-hidden">
      {/* Background ambient lighting */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-96 h-32 bg-indigo-500/10 rounded-full blur-3xl pointer-events-none" />

      {/* Hidden File Input */}
      <input
        type="file"
        ref={fileInputRef}
        onChange={onFileInputChange}
        accept=".pdf,.doc,.docx"
        className="hidden"
        disabled={uploading || deleting || analyzing}
      />

      <div className="relative z-10 space-y-6">
        {/* Section Header */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-800 pb-5">
          <div>
            <div className="flex items-center gap-2 mb-1">
              <div className="w-8 h-8 rounded-lg bg-indigo-500/10 border border-indigo-500/20 flex items-center justify-center text-indigo-400">
                <FileText className="w-4 h-4" />
              </div>
              <h2 className="text-xl font-bold text-white tracking-tight">Resume Management</h2>
            </div>
            <p className="text-xs text-slate-400">
              Upload your resume for automated AI skills extraction and role matching.
            </p>
          </div>

          <div className="flex items-center gap-2">
            <span className="text-xs font-semibold text-slate-400">Resume Status:</span>
            {loading ? (
              <span className="px-3 py-1 rounded-full text-xs font-semibold bg-slate-800 text-slate-400 flex items-center gap-1.5 animate-pulse">
                <Loader2 className="w-3 h-3 animate-spin" /> Checking...
              </span>
            ) : resume ? (
              <span className="px-3 py-1 rounded-full text-xs font-semibold tracking-wide bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 flex items-center gap-1.5">
                <span className="w-2 h-2 rounded-full bg-emerald-400 animate-ping" />
                Active on File
              </span>
            ) : (
              <span className="px-3 py-1 rounded-full text-xs font-semibold tracking-wide bg-amber-500/10 text-amber-400 border border-amber-500/20">
                Not Uploaded Yet
              </span>
            )}
          </div>
        </div>

        {/* Dynamic Alerts */}
        {error && (
          <div className="p-3.5 rounded-xl bg-rose-500/10 border border-rose-500/20 flex items-start gap-3 text-rose-300 text-xs animate-shake">
            <AlertCircle className="w-4 h-4 mt-0.5 flex-shrink-0 text-rose-400" />
            <div className="flex-1">
              <span className="font-semibold">Notice:</span> {error}
            </div>
            <button
              onClick={() => setError(null)}
              className="text-rose-400 hover:text-rose-200 transition-colors"
            >
              &times;
            </button>
          </div>
        )}

        {successMessage && (
          <div className="p-3.5 rounded-xl bg-emerald-500/10 border border-emerald-500/20 flex items-center gap-3 text-emerald-300 text-xs">
            <CheckCircle2 className="w-4 h-4 flex-shrink-0 text-emerald-400" />
            <span className="font-semibold">{successMessage}</span>
          </div>
        )}

        {/* Content Area: Either Upload Dropzone or Uploaded Resume Card */}
        {loading ? (
          <div className="py-12 flex flex-col items-center justify-center space-y-3">
            <Loader2 className="w-8 h-8 text-indigo-400 animate-spin" />
            <span className="text-xs text-slate-400">Loading resume status...</span>
          </div>
        ) : resume ? (
          /* Active Resume Card */
          <div className="bg-slate-950/80 border border-slate-800 rounded-2xl p-5 sm:p-6 transition-all hover:border-slate-700 space-y-5">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
              {/* File details */}
              <div className="flex items-start gap-4">
                <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-indigo-500/20 to-sky-500/10 border border-indigo-500/30 flex items-center justify-center text-indigo-400 flex-shrink-0 shadow-lg shadow-indigo-500/10">
                  <FileCheck className="w-6 h-6" />
                </div>
                <div className="space-y-1">
                  <div className="flex items-center gap-2 flex-wrap">
                    <h3 className="text-sm sm:text-base font-bold text-white max-w-xs sm:max-w-md truncate" title={resume.originalName}>
                      {resume.originalName}
                    </h3>
                    <span className="px-2 py-0.5 rounded text-[10px] font-bold tracking-wider uppercase bg-indigo-500/10 text-indigo-300 border border-indigo-500/20">
                      {formatFileType(resume.fileType, resume.originalName)}
                    </span>
                  </div>

                  <div className="flex flex-wrap items-center gap-3 sm:gap-4 text-xs text-slate-400">
                    <span className="flex items-center gap-1">
                      <HardDrive className="w-3.5 h-3.5 text-slate-500" />
                      {formatFileSize(resume.fileSize)}
                    </span>
                    <span className="text-slate-600">&bull;</span>
                    <span className="flex items-center gap-1">
                      <Clock className="w-3.5 h-3.5 text-slate-500" />
                      Uploaded {formatDate(resume.uploadedAt)}
                    </span>
                  </div>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="flex flex-wrap items-center gap-3 pt-2 md:pt-0">
                {/* Stage 4: Analyze Resume Primary Button */}
                <button
                  type="button"
                  onClick={handleAnalyzeClick}
                  disabled={uploading || deleting || analyzing}
                  className="flex-1 sm:flex-initial inline-flex items-center justify-center gap-2 px-5 py-2.5 rounded-xl text-xs font-bold bg-gradient-to-r from-indigo-600 via-indigo-500 to-sky-500 hover:from-indigo-500 hover:to-sky-400 text-white shadow-lg shadow-indigo-500/25 transition-all disabled:opacity-50 disabled:cursor-not-allowed cursor-pointer"
                >
                  {analyzing ? (
                    <>
                      <Loader2 className="w-4 h-4 animate-spin" />
                      <span>Analyzing your resume...</span>
                    </>
                  ) : hasAnalysis ? (
                    <>
                      <Sparkles className="w-4 h-4 text-amber-300" />
                      <span>Analysis Complete</span>
                    </>
                  ) : (
                    <>
                      <Sparkles className="w-4 h-4" />
                      <span>Analyze My Resume</span>
                    </>
                  )}
                </button>

                <button
                  type="button"
                  onClick={() => fileInputRef.current?.click()}
                  disabled={uploading || deleting || analyzing}
                  className="inline-flex items-center justify-center gap-2 px-3.5 py-2.5 rounded-xl text-xs font-semibold bg-slate-800 hover:bg-slate-700 text-slate-300 border border-slate-700 transition-all disabled:opacity-50 disabled:cursor-not-allowed cursor-pointer"
                  title="Replace resume file"
                >
                  {uploading ? (
                    <Loader2 className="w-3.5 h-3.5 animate-spin" />
                  ) : (
                    <>
                      <RefreshCw className="w-3.5 h-3.5" />
                      <span className="hidden sm:inline">Replace</span>
                    </>
                  )}
                </button>

                <button
                  type="button"
                  onClick={handleDelete}
                  disabled={uploading || deleting || analyzing}
                  className="inline-flex items-center justify-center gap-1.5 px-3 py-2.5 rounded-xl text-xs font-semibold text-rose-400 hover:bg-rose-500/10 border border-rose-500/20 transition-all disabled:opacity-50 disabled:cursor-not-allowed cursor-pointer"
                  title="Delete resume"
                >
                  {deleting ? (
                    <Loader2 className="w-3.5 h-3.5 animate-spin" />
                  ) : (
                    <>
                      <Trash2 className="w-3.5 h-3.5" />
                      <span className="hidden sm:inline">Delete</span>
                    </>
                  )}
                </button>
              </div>
            </div>

            {/* Status Footer Banner */}
            <div className="bg-slate-900/60 border border-slate-800/80 rounded-xl p-3 flex items-center justify-between text-xs text-slate-400">
              <div className="flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                <span>
                  {hasAnalysis
                    ? 'AI analysis report active below. Click "Analyze Again" anytime to update.'
                    : 'Resume ready for AI role benchmarking analysis.'}
                </span>
              </div>
              <span className="text-[11px] font-mono text-indigo-400 font-semibold">Stage 4 AI Ready</span>
            </div>
          </div>
        ) : (
          /* Clean Upload Area */
          <div
            onDragOver={handleDragOver}
            onDragLeave={handleDragLeave}
            onDrop={handleDrop}
            className={`border-2 border-dashed rounded-2xl p-8 sm:p-10 text-center transition-all ${
              isDragOver
                ? 'border-indigo-500 bg-indigo-500/5 scale-[0.99]'
                : 'border-slate-800 hover:border-slate-700 bg-slate-950/40'
            }`}
          >
            <div className="max-w-md mx-auto space-y-4">
              <div className="w-14 h-14 rounded-2xl bg-indigo-500/10 border border-indigo-500/20 flex items-center justify-center text-indigo-400 mx-auto shadow-inner">
                {uploading ? (
                  <Loader2 className="w-7 h-7 animate-spin" />
                ) : (
                  <Upload className="w-7 h-7" />
                )}
              </div>

              <div className="space-y-1.5">
                <h3 className="text-base sm:text-lg font-bold text-white tracking-tight">
                  Upload your resume
                </h3>
                <p className="text-xs text-slate-400 font-medium">
                  PDF, DOC or DOCX &bull; Maximum 5 MB
                </p>
                <p className="text-[11px] text-slate-500">
                  Upload your resume to start AI analysis.
                </p>
              </div>

              <div className="pt-2">
                <button
                  type="button"
                  onClick={() => fileInputRef.current?.click()}
                  disabled={uploading}
                  className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl text-xs sm:text-sm font-semibold bg-indigo-600 hover:bg-indigo-500 text-white shadow-lg shadow-indigo-600/25 transition-all disabled:opacity-50 disabled:cursor-not-allowed cursor-pointer"
                >
                  {uploading ? (
                    <>
                      <Loader2 className="w-4 h-4 animate-spin" />
                      <span>Uploading Resume...</span>
                    </>
                  ) : (
                    <>
                      <Upload className="w-4 h-4" />
                      <span>Choose Resume</span>
                    </>
                  )}
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
