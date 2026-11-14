import React, { useState } from 'react';
import { 
  PlusCircle, 
  Search, 
  Trash2, 
  Edit3, 
  ExternalLink, 
  Sparkles, 
  CheckCircle, 
  AlertCircle, 
  Eye, 
  Copy, 
  Check, 
  LogOut, 
  ShieldAlert, 
  BarChart3, 
  FolderCheck, 
  Layers, 
  Lock
} from 'lucide-react';
import { useJobs } from '../context/JobContext';
import { Job, JobStatus, JobCategory } from '../types/job';
import { SEOHead } from '../components/SEOHead';
import { generateJobArticleWithAI } from '../services/aiService';

export const AdminDashboard: React.FC = () => {
  const { 
    jobs, 
    currentUser, 
    loginAsAdmin, 
    logout, 
    addJob, 
    updateJob, 
    deleteJob, 
    togglePublishStatus, 
    markExpired,
    checkDuplicate 
  } = useJobs();

  // Navigation tab inside admin
  const [activeTab, setActiveTab] = useState<'dashboard' | 'add' | 'all' | 'published'>('dashboard');

  // Login form state for mock admin
  const [loginEmail, setLoginEmail] = useState('');
  const [loginPassword, setLoginPassword] = useState('');
  const [loginError, setLoginError] = useState('');

  // Table filters
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter] = useState<'all' | JobStatus>('all');
  const [categoryFilter, setCategoryFilter] = useState('');

  // Editing state
  const [editingJob, setEditingJob] = useState<Job | null>(null);

  // Success modal for published job
  const [publishedModalJob, setPublishedModalJob] = useState<Job | null>(null);
  const [copiedLink, setCopiedLink] = useState(false);

  // AI generating state
  const [isGeneratingAI, setIsGeneratingAI] = useState(false);
  const [aiError, setAiError] = useState('');

  // Form State
  const initialFormState = {
    title: '',
    company: '',
    company_logo: '',
    location: 'Bengaluru / Hybrid',
    qualification: 'B.Tech / B.E / BCA / MCA / B.Sc in CS or related field',
    experience: '0 - 2 Years',
    employment_type: 'Full-time' as 'Full-time' | 'Part-time' | 'Contract' | 'Internship',
    salary: '₹4,50,000 - ₹7,00,000 LPA',
    category: 'IT & Software' as JobCategory,
    description: '',
    responsibilitiesText: '',
    requiredSkillsText: '',
    eligibilityText: '',
    selectionProcessText: '',
    application_deadline: '',
    apply_url: '',
    source_url: '',
    status: 'published' as JobStatus,
    last_verified_at: new Date().toISOString().slice(0, 10),
  };

  const [formData, setFormData] = useState(initialFormState);
  const [duplicateWarning, setDuplicateWarning] = useState<Job | null>(null);

  // Stats calculation
  const totalJobsCount = jobs.length;
  const publishedCount = jobs.filter(j => j.status === 'published').length;
  const draftCount = jobs.filter(j => j.status === 'draft').length;
  const expiredCount = jobs.filter(j => j.status === 'expired').length;
  const recentlyUpdated = jobs.slice(0, 5);

  // Handle Login
  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!loginEmail.trim() || !loginPassword.trim()) {
      setLoginError('Please enter admin credentials.');
      return;
    }
    const res = await loginAsAdmin(loginEmail, loginPassword);
    if (!res.success) {
      setLoginError(res.error || 'Authentication failed. Please verify admin credentials.');
    } else {
      setLoginError('');
    }
  };

  // Open edit modal
  const handleEditClick = (job: Job) => {
    setEditingJob(job);
    setFormData({
      title: job.title,
      company: job.company,
      company_logo: job.company_logo || '',
      location: job.location,
      qualification: job.qualification,
      experience: job.experience,
      employment_type: job.employment_type,
      salary: job.salary,
      category: job.category,
      description: job.description,
      responsibilitiesText: (job.responsibilities || []).join('\n'),
      requiredSkillsText: (job.required_skills || []).join(', '),
      eligibilityText: (job.eligibility || []).join('\n'),
      selectionProcessText: (job.selection_process || []).join('\n'),
      application_deadline: job.application_deadline ? job.application_deadline.slice(0, 10) : '',
      apply_url: job.apply_url,
      source_url: job.source_url || '',
      status: job.status,
      last_verified_at: job.last_verified_at ? job.last_verified_at.slice(0, 10) : new Date().toISOString().slice(0, 10),
    });
    setActiveTab('add');
  };

  // Check duplicate on blur
  const handleDuplicateCheck = () => {
    const dup = checkDuplicate(formData.source_url, formData.company, formData.title);
    if (dup && (!editingJob || dup.id !== editingJob.id)) {
      setDuplicateWarning(dup);
    } else {
      setDuplicateWarning(null);
    }
  };

  // AI Article Generation: calls Supabase Edge Function (Gemini) with local deterministic fallback
  const handleGenerateWithAI = async () => {
    if (!formData.title || !formData.company) {
      setAiError('Please enter at least Job Title and Company Name to generate the article.');
      return;
    }
    setAiError('');
    setIsGeneratingAI(true);

    try {
      const result = await generateJobArticleWithAI({
        title: formData.title,
        company: formData.company,
        category: formData.category,
        location: formData.location,
        qualification: formData.qualification,
        experience: formData.experience,
        salary: formData.salary,
        source_notes: formData.source_url
      });

      setFormData(prev => ({
        ...prev,
        description: result.description,
        responsibilitiesText: result.responsibilities.join('\n'),
        requiredSkillsText: result.required_skills.join(', '),
        eligibilityText: result.eligibility.join('\n'),
        selectionProcessText: result.selection_process.join('\n'),
      }));
    } catch (err: any) {
      setAiError(err.message || 'AI generation encountered an issue. You can fill details manually.');
    } finally {
      setIsGeneratingAI(false);
    }
  };

  // Handle Form Submit (Add or Edit)
  const handleSaveJob = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!formData.title.trim() || !formData.company.trim() || !formData.apply_url.trim()) {
      alert('Please fill in required fields: Job Title, Company, and Official Application URL.');
      return;
    }

    const responsibilities = formData.responsibilitiesText
      .split('\n')
      .map(s => s.trim())
      .filter(Boolean);

    const required_skills = formData.requiredSkillsText
      .split(',')
      .map(s => s.trim())
      .filter(Boolean);

    const eligibility = formData.eligibilityText
      .split('\n')
      .map(s => s.trim())
      .filter(Boolean);

    const selection_process = formData.selectionProcessText
      .split('\n')
      .map(s => s.trim())
      .filter(Boolean);

    const jobPayload = {
      title: formData.title.trim(),
      company: formData.company.trim(),
      company_logo: formData.company_logo.trim(),
      location: formData.location.trim(),
      qualification: formData.qualification.trim(),
      experience: formData.experience.trim(),
      employment_type: formData.employment_type,
      salary: formData.salary.trim() || 'Not disclosed',
      category: formData.category,
      description: formData.description.trim(),
      responsibilities,
      required_skills,
      eligibility,
      selection_process,
      application_deadline: formData.application_deadline,
      apply_url: formData.apply_url.trim(),
      source_url: formData.source_url.trim(),
      status: formData.status,
      slug: editingJob ? editingJob.slug : '',
      published_at: editingJob ? editingJob.published_at : '',
      last_verified_at: new Date().toISOString(),
    };

    if (editingJob) {
      await updateJob(editingJob.id, jobPayload);
      alert('Job updated successfully!');
      setEditingJob(null);
    } else {
      const res = await addJob(jobPayload);
      if (res.success && res.job) {
        setPublishedModalJob(res.job);
      } else if (!res.success) {
        alert(res.error || 'Failed to save job');
      }
    }

    // Reset form
    setFormData(initialFormState);
    setDuplicateWarning(null);
    setActiveTab('all');
  };

  // Filtered jobs in table
  const tableJobs = jobs.filter(job => {
    if (activeTab === 'published' && job.status !== 'published') return false;
    if (statusFilter !== 'all' && job.status !== statusFilter) return false;
    if (categoryFilter && job.category !== categoryFilter) return false;
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase();
      return (
        job.title.toLowerCase().includes(q) ||
        job.company.toLowerCase().includes(q) ||
        job.slug.toLowerCase().includes(q)
      );
    }
    return true;
  });

  // Not logged in view
  if (!currentUser) {
    return (
      <div className="min-h-[80vh] flex items-center justify-center px-4 py-12">
        <SEOHead
          title="Admin Login - Careerping Portal"
          description="Authorized administrator access only. Careerping job management portal."
          canonicalPath="/admin"
          noIndex={true}
        />
        <div className="bg-white p-8 rounded-2xl border border-surface-border shadow-xl max-w-md w-full">
          <div className="w-12 h-12 rounded-2xl bg-navy-700 text-teal-300 flex items-center justify-center mx-auto mb-4 shadow-sm">
            <Lock className="w-6 h-6" />
          </div>
          <h2 className="text-xl font-extrabold text-center text-navy-800">
            Careerping Administrator Login
          </h2>
          <p className="text-xs text-center text-slate-500 mt-1 mb-6">
            Authorized admin portal for publishing and verifying job alerts
          </p>

          {loginError && (
            <div className="mb-4 p-3 rounded-xl bg-rose-50 border border-rose-200 text-rose-700 text-xs flex items-center gap-2">
              <AlertCircle className="w-4 h-4 flex-shrink-0" />
              <span>{loginError}</span>
            </div>
          )}

          <form onSubmit={handleLogin} className="space-y-4">
            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">
                Admin Email Address
              </label>
              <input
                type="email"
                value={loginEmail}
                onChange={(e) => setLoginEmail(e.target.value)}
                placeholder="admin@careerping.live"
                required
                className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 text-sm focus:outline-none focus:ring-2 focus:ring-teal-500 text-slate-800"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">
                Password
              </label>
              <input
                type="password"
                value={loginPassword}
                onChange={(e) => setLoginPassword(e.target.value)}
                placeholder="••••••••••••"
                required
                className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 text-sm focus:outline-none focus:ring-2 focus:ring-teal-500 text-slate-800"
              />
            </div>

            <button
              type="submit"
              className="w-full py-3 px-4 rounded-xl bg-teal-500 hover:bg-teal-600 text-white font-bold text-sm shadow-md transition-all flex items-center justify-center gap-2"
            >
              <Lock className="w-4 h-4" /> Sign In to Admin Dashboard
            </button>
          </form>

          <div className="mt-6 pt-4 border-t border-slate-100 text-center text-[11px] text-slate-400">
            Protected by Supabase Auth & RLS (Configured in Stage 2)
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-50 pb-20">
      <SEOHead
        title="Admin Portal - Manage Job Vacancies"
        description="Private dashboard to publish, verify, edit, and archive job vacancies on Careerping."
        canonicalPath="/admin"
        noIndex={true}
      />

      {/* Top Admin Bar */}
      <div className="bg-navy-800 text-white border-b border-navy-700">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-3 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <span className="font-extrabold text-base tracking-tight">
              Career<span className="text-teal-400">ping</span> Admin
            </span>
            <span className="text-xs bg-navy-700 text-teal-300 px-2 py-0.5 rounded border border-navy-600 font-mono">
              v1.0-frontend
            </span>
          </div>

          <div className="flex items-center gap-4 text-xs">
            <span className="text-slate-300 hidden sm:inline">Signed in as: <strong className="text-white">{currentUser.email}</strong></span>
            <button
              onClick={logout}
              className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-navy-700 hover:bg-navy-600 text-slate-200 hover:text-white transition-colors"
            >
              <LogOut className="w-3.5 h-3.5" /> Logout
            </button>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
          {/* Admin Sidebar Navigation */}
          <aside className="lg:col-span-3 space-y-4">
            <div className="bg-white rounded-2xl border border-surface-border p-4 shadow-sm space-y-1">
              <button
                onClick={() => { setActiveTab('dashboard'); setEditingJob(null); }}
                className={`w-full flex items-center gap-3 px-3.5 py-2.5 rounded-xl text-xs font-bold transition-colors ${
                  activeTab === 'dashboard' ? 'bg-navy-700 text-white' : 'text-slate-700 hover:bg-slate-100'
                }`}
              >
                <BarChart3 className="w-4 h-4 text-teal-400" /> Dashboard Overview
              </button>

              <button
                onClick={() => {
                  setEditingJob(null);
                  setFormData(initialFormState);
                  setActiveTab('add');
                }}
                className={`w-full flex items-center gap-3 px-3.5 py-2.5 rounded-xl text-xs font-bold transition-colors ${
                  activeTab === 'add' ? 'bg-navy-700 text-white' : 'text-slate-700 hover:bg-slate-100'
                }`}
              >
                <PlusCircle className="w-4 h-4 text-teal-400" />
                {editingJob ? 'Edit Job' : 'Add New Job'}
              </button>

              <button
                onClick={() => { setActiveTab('all'); setEditingJob(null); }}
                className={`w-full flex items-center justify-between px-3.5 py-2.5 rounded-xl text-xs font-bold transition-colors ${
                  activeTab === 'all' ? 'bg-navy-700 text-white' : 'text-slate-700 hover:bg-slate-100'
                }`}
              >
                <div className="flex items-center gap-3">
                  <Layers className="w-4 h-4 text-teal-400" /> All Job Listings
                </div>
                <span className="text-[11px] bg-slate-100 text-slate-700 px-2 py-0.5 rounded-full">
                  {totalJobsCount}
                </span>
              </button>

              <button
                onClick={() => { setActiveTab('published'); setEditingJob(null); }}
                className={`w-full flex items-center justify-between px-3.5 py-2.5 rounded-xl text-xs font-bold transition-colors ${
                  activeTab === 'published' ? 'bg-navy-700 text-white' : 'text-slate-700 hover:bg-slate-100'
                }`}
              >
                <div className="flex items-center gap-3">
                  <FolderCheck className="w-4 h-4 text-emerald-400" /> Published Only
                </div>
                <span className="text-[11px] bg-emerald-50 text-emerald-700 px-2 py-0.5 rounded-full">
                  {publishedCount}
                </span>
              </button>
            </div>

            {/* Quick Actions Card */}
            <div className="bg-teal-50 border border-teal-200 rounded-2xl p-4 text-xs text-teal-900 space-y-2">
              <span className="font-bold block text-teal-800">Custom Domain Status</span>
              <p className="text-[11px] text-teal-700">
                Operating with custom root domain structure: <code>https://careerping.live/:jobSlug</code>
              </p>
              <a
                href="/"
                target="_blank"
                rel="noreferrer"
                className="inline-flex items-center gap-1 font-bold text-teal-700 hover:text-teal-900 underline"
              >
                Open Public Website <ExternalLink className="w-3 h-3" />
              </a>
            </div>
          </aside>

          {/* Main Dashboard Area */}
          <main className="lg:col-span-9 space-y-6">
            {/* VIEW 1: DASHBOARD OVERVIEW */}
            {activeTab === 'dashboard' && (
              <div className="space-y-6">
                {/* 5 Stats Cards */}
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
                  <div className="bg-white p-5 rounded-2xl border border-surface-border shadow-sm">
                    <span className="text-xs text-slate-500 font-semibold block">Total Jobs</span>
                    <span className="text-2xl font-extrabold text-navy-800 mt-1 block">{totalJobsCount}</span>
                  </div>

                  <div className="bg-white p-5 rounded-2xl border border-surface-border shadow-sm">
                    <span className="text-xs text-emerald-600 font-semibold block">Published</span>
                    <span className="text-2xl font-extrabold text-emerald-700 mt-1 block">{publishedCount}</span>
                  </div>

                  <div className="bg-white p-5 rounded-2xl border border-surface-border shadow-sm">
                    <span className="text-xs text-amber-600 font-semibold block">Drafts</span>
                    <span className="text-2xl font-extrabold text-amber-700 mt-1 block">{draftCount}</span>
                  </div>

                  <div className="bg-white p-5 rounded-2xl border border-surface-border shadow-sm">
                    <span className="text-xs text-rose-600 font-semibold block">Expired</span>
                    <span className="text-2xl font-extrabold text-rose-700 mt-1 block">{expiredCount}</span>
                  </div>
                </div>

                {/* Recently Updated */}
                <div className="bg-white rounded-2xl border border-surface-border p-6 shadow-sm">
                  <div className="flex items-center justify-between mb-4">
                    <h3 className="text-base font-bold text-navy-800">Recently Updated Vacancies</h3>
                    <button
                      onClick={() => setActiveTab('all')}
                      className="text-xs font-bold text-teal-600 hover:text-teal-700"
                    >
                      View all listings →
                    </button>
                  </div>

                  <div className="divide-y divide-slate-100">
                    {recentlyUpdated.map((j) => (
                      <div key={j.id} className="py-3 flex items-center justify-between gap-4">
                        <div className="min-w-0">
                          <p className="text-xs font-bold text-slate-800 truncate">{j.title}</p>
                          <span className="text-[11px] text-slate-400">{j.company} • {j.category}</span>
                        </div>
                        <div className="flex items-center gap-2">
                          <span className={`px-2 py-0.5 rounded-full text-[10px] font-bold ${
                            j.status === 'published' ? 'bg-emerald-50 text-emerald-700' :
                            j.status === 'expired' ? 'bg-rose-50 text-rose-700' : 'bg-amber-50 text-amber-700'
                          }`}>
                            {j.status}
                          </span>
                          <button
                            onClick={() => handleEditClick(j)}
                            className="p-1 rounded text-slate-400 hover:text-teal-600"
                            title="Edit"
                          >
                            <Edit3 className="w-3.5 h-3.5" />
                          </button>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            )}

            {/* VIEW 2: ADD / EDIT JOB FORM */}
            {activeTab === 'add' && (
              <div className="bg-white rounded-2xl border border-surface-border p-6 sm:p-8 shadow-sm">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-6 border-b border-slate-100 gap-4 mb-6">
                  <div>
                    <h2 className="text-xl font-extrabold text-navy-800">
                      {editingJob ? `Edit Job: ${editingJob.title}` : 'Publish New Verified Job'}
                    </h2>
                    <p className="text-xs text-slate-500 mt-1">
                      Enter verified vacancy facts or use AI to generate the article summary
                    </p>
                  </div>

                  {/* AI Generation Button */}
                  <button
                    type="button"
                    onClick={handleGenerateWithAI}
                    disabled={isGeneratingAI}
                    className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl bg-gradient-to-r from-teal-500 to-teal-600 hover:from-teal-600 hover:to-teal-700 text-white font-bold text-xs shadow-md transition-all disabled:opacity-50"
                  >
                    <Sparkles className="w-4 h-4" />
                    {isGeneratingAI ? 'Generating with AI...' : 'GENERATE ARTICLE WITH AI'}
                  </button>
                </div>

                {aiError && (
                  <div className="mb-6 p-3 rounded-xl bg-amber-50 border border-amber-200 text-amber-800 text-xs flex items-center gap-2">
                    <AlertCircle className="w-4 h-4 flex-shrink-0" />
                    <span>{aiError}</span>
                  </div>
                )}

                {/* Duplicate Warning Alert */}
                {duplicateWarning && (
                  <div className="mb-6 p-4 rounded-xl bg-amber-50 border border-amber-200 text-amber-900 text-xs space-y-1">
                    <div className="flex items-center gap-2 font-bold text-amber-800">
                      <ShieldAlert className="w-4 h-4 text-amber-600" />
                      Potential Duplicate Detected!
                    </div>
                    <p>
                      An existing vacancy matches this source URL or Company + Title:
                    </p>
                    <p className="font-semibold text-slate-800">
                      "{duplicateWarning.title}" at {duplicateWarning.company} (Slug: /{duplicateWarning.slug})
                    </p>
                    <p className="text-[11px] text-amber-700">
                      You can edit the existing listing instead of creating a duplicate URL.
                    </p>
                  </div>
                )}

                <form onSubmit={handleSaveJob} className="space-y-6">
                  {/* Basic Info */}
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-xs font-bold text-slate-700 mb-1">
                        Job Title *
                      </label>
                      <input
                        type="text"
                        value={formData.title}
                        onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                        onBlur={handleDuplicateCheck}
                        placeholder="e.g. SOC Analyst (L1 / L2 Incident Response)"
                        required
                        className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 text-xs sm:text-sm focus:outline-none focus:ring-2 focus:ring-teal-500"
                      />
                    </div>

                    <div>
                      <label className="block text-xs font-bold text-slate-700 mb-1">
                        Company Name *
                      </label>
                      <input
                        type="text"
                        value={formData.company}
                        onChange={(e) => setFormData({ ...formData, company: e.target.value })}
                        onBlur={handleDuplicateCheck}
                        placeholder="e.g. Resillion India"
                        required
                        className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 text-xs sm:text-sm focus:outline-none focus:ring-2 focus:ring-teal-500"
                      />
                    </div>

                    <div>
                      <label className="block text-xs font-bold text-slate-700 mb-1">
                        Category *
                      </label>
                      <select
                        value={formData.category}
                        onChange={(e) => setFormData({ ...formData, category: e.target.value as JobCategory })}
                        className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 text-xs sm:text-sm focus:outline-none focus:ring-2 focus:ring-teal-500"
                      >
                        <option value="IT & Software">IT & Software</option>
                        <option value="Cybersecurity">Cybersecurity</option>
                        <option value="Freshers">Freshers</option>
                        <option value="Internships">Internships</option>
                        <option value="Government Jobs">Government Jobs</option>
                        <option value="Work From Home">Work From Home</option>
                        <option value="Banking & Finance">Banking & Finance</option>
                        <option value="Core Engineering">Core Engineering</option>
                      </select>
                    </div>

                    <div>
                      <label className="block text-xs font-bold text-slate-700 mb-1">
                        Location
                      </label>
                      <input
                        type="text"
                        value={formData.location}
                        onChange={(e) => setFormData({ ...formData, location: e.target.value })}
                        placeholder="e.g. Bengaluru / Hyderabad (Hybrid)"
                        className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 text-xs sm:text-sm focus:outline-none focus:ring-2 focus:ring-teal-500"
                      />
                    </div>

                    <div>
                      <label className="block text-xs font-bold text-slate-700 mb-1">
                        Experience Required
                      </label>
                      <input
                        type="text"
                        value={formData.experience}
                        onChange={(e) => setFormData({ ...formData, experience: e.target.value })}
                        placeholder="e.g. 0 - 2 Years or Fresher"
                        className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 text-xs sm:text-sm focus:outline-none focus:ring-2 focus:ring-teal-500"
                      />
                    </div>

                    <div>
                      <label className="block text-xs font-bold text-slate-700 mb-1">
                        Salary / CTC
                      </label>
                      <input
                        type="text"
                        value={formData.salary}
                        onChange={(e) => setFormData({ ...formData, salary: e.target.value })}
                        placeholder="e.g. ₹5,00,000 - ₹8,50,000 LPA or Not disclosed"
                        className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 text-xs sm:text-sm focus:outline-none focus:ring-2 focus:ring-teal-500"
                      />
                    </div>

                    <div>
                      <label className="block text-xs font-bold text-slate-700 mb-1">
                        Educational Qualification
                      </label>
                      <input
                        type="text"
                        value={formData.qualification}
                        onChange={(e) => setFormData({ ...formData, qualification: e.target.value })}
                        placeholder="e.g. B.Tech / B.E / BCA / MCA"
                        className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 text-xs sm:text-sm focus:outline-none focus:ring-2 focus:ring-teal-500"
                      />
                    </div>

                    <div>
                      <label className="block text-xs font-bold text-slate-700 mb-1">
                        Application Deadline
                      </label>
                      <input
                        type="date"
                        value={formData.application_deadline}
                        onChange={(e) => setFormData({ ...formData, application_deadline: e.target.value })}
                        className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 text-xs sm:text-sm focus:outline-none focus:ring-2 focus:ring-teal-500"
                      />
                    </div>
                  </div>

                  {/* Application & Source URLs */}
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-4 border-t border-slate-100">
                    <div>
                      <label className="block text-xs font-bold text-slate-700 mb-1">
                        Official Apply URL * (Must be genuine employer career portal)
                      </label>
                      <input
                        type="url"
                        value={formData.apply_url}
                        onChange={(e) => setFormData({ ...formData, apply_url: e.target.value })}
                        placeholder="https://careers.company.com/jobs/123"
                        required
                        className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 text-xs sm:text-sm focus:outline-none focus:ring-2 focus:ring-teal-500"
                      />
                    </div>

                    <div>
                      <label className="block text-xs font-bold text-slate-700 mb-1">
                        Original Source / Notification URL (for duplicate checking & audit)
                      </label>
                      <input
                        type="url"
                        value={formData.source_url}
                        onChange={(e) => setFormData({ ...formData, source_url: e.target.value })}
                        onBlur={handleDuplicateCheck}
                        placeholder="https://company.com/press-release-or-pdf"
                        className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 text-xs sm:text-sm focus:outline-none focus:ring-2 focus:ring-teal-500"
                      />
                    </div>
                  </div>

                  {/* Detailed Description */}
                  <div className="pt-4 border-t border-slate-100">
                    <label className="block text-xs font-bold text-slate-700 mb-1">
                      Job Description & Overview
                    </label>
                    <textarea
                      rows={4}
                      value={formData.description}
                      onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                      placeholder="Comprehensive overview of the role..."
                      className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 text-xs sm:text-sm focus:outline-none focus:ring-2 focus:ring-teal-500"
                    />
                  </div>

                  {/* Responsibilities */}
                  <div>
                    <label className="block text-xs font-bold text-slate-700 mb-1">
                      Responsibilities (One per line)
                    </label>
                    <textarea
                      rows={3}
                      value={formData.responsibilitiesText}
                      onChange={(e) => setFormData({ ...formData, responsibilitiesText: e.target.value })}
                      placeholder="Monitor and triage security alerts...&#10;Investigate potential security breaches..."
                      className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 text-xs sm:text-sm focus:outline-none focus:ring-2 focus:ring-teal-500"
                    />
                  </div>

                  {/* Skills */}
                  <div>
                    <label className="block text-xs font-bold text-slate-700 mb-1">
                      Required Skills (Comma separated)
                    </label>
                    <input
                      type="text"
                      value={formData.requiredSkillsText}
                      onChange={(e) => setFormData({ ...formData, requiredSkillsText: e.target.value })}
                      placeholder="Splunk, SIEM, Network Security, Python, TCP/IP"
                      className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 text-xs sm:text-sm focus:outline-none focus:ring-2 focus:ring-teal-500"
                    />
                  </div>

                  {/* Eligibility & Selection */}
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-xs font-bold text-slate-700 mb-1">
                        Eligibility Criteria (One per line)
                      </label>
                      <textarea
                        rows={3}
                        value={formData.eligibilityText}
                        onChange={(e) => setFormData({ ...formData, eligibilityText: e.target.value })}
                        placeholder="2024 or 2025 batch graduates&#10;Minimum 60% aggregate"
                        className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 text-xs sm:text-sm focus:outline-none focus:ring-2 focus:ring-teal-500"
                      />
                    </div>

                    <div>
                      <label className="block text-xs font-bold text-slate-700 mb-1">
                        Selection Rounds (One per line)
                      </label>
                      <textarea
                        rows={3}
                        value={formData.selectionProcessText}
                        onChange={(e) => setFormData({ ...formData, selectionProcessText: e.target.value })}
                        placeholder="Online Assessment&#10;Technical Round&#10;HR Interview"
                        className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 text-xs sm:text-sm focus:outline-none focus:ring-2 focus:ring-teal-500"
                      />
                    </div>
                  </div>

                  {/* Publication Status */}
                  <div className="flex items-center gap-6 pt-4 border-t border-slate-100">
                    <span className="text-xs font-bold text-slate-700">Initial Status:</span>
                    <label className="flex items-center gap-1.5 text-xs text-slate-700 cursor-pointer">
                      <input
                        type="radio"
                        name="status"
                        value="published"
                        checked={formData.status === 'published'}
                        onChange={() => setFormData({ ...formData, status: 'published' })}
                      />
                      <span>Published (Live on Website)</span>
                    </label>
                    <label className="flex items-center gap-1.5 text-xs text-slate-700 cursor-pointer">
                      <input
                        type="radio"
                        name="status"
                        value="draft"
                        checked={formData.status === 'draft'}
                        onChange={() => setFormData({ ...formData, status: 'draft' })}
                      />
                      <span>Save as Draft</span>
                    </label>
                  </div>

                  {/* Submit Actions */}
                  <div className="flex items-center gap-3 pt-6 border-t border-slate-100">
                    <button
                      type="submit"
                      className="px-6 py-3 rounded-xl bg-teal-500 hover:bg-teal-600 text-white font-bold text-xs sm:text-sm shadow-md transition-all"
                    >
                      {editingJob ? 'Save Job Changes' : 'Publish Job Vacancy'}
                    </button>
                    <button
                      type="button"
                      onClick={() => {
                        setEditingJob(null);
                        setFormData(initialFormState);
                        setActiveTab('all');
                      }}
                      className="px-4 py-3 rounded-xl border border-slate-200 text-slate-700 font-semibold text-xs sm:text-sm hover:bg-slate-50 transition-colors"
                    >
                      Cancel
                    </button>
                  </div>
                </form>
              </div>
            )}

            {/* VIEW 3: ALL JOBS TABLE */}
            {(activeTab === 'all' || activeTab === 'published') && (
              <div className="bg-white rounded-2xl border border-surface-border shadow-sm overflow-hidden">
                {/* Search & Filter Controls */}
                <div className="p-4 sm:p-6 border-b border-slate-100 flex flex-col sm:flex-row items-center justify-between gap-3">
                  <div className="flex items-center gap-2 w-full sm:w-auto">
                    <div className="flex items-center px-3 py-2 rounded-xl bg-slate-50 border border-slate-200 text-xs w-full sm:w-64">
                      <Search className="w-4 h-4 text-slate-400 mr-2 flex-shrink-0" />
                      <input
                        type="text"
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                        placeholder="Filter by title, company, slug..."
                        className="bg-transparent focus:outline-none w-full"
                      />
                    </div>

                    <select
                      value={categoryFilter}
                      onChange={(e) => setCategoryFilter(e.target.value)}
                      className="px-3 py-2 rounded-xl bg-slate-50 border border-slate-200 text-xs text-slate-700 focus:outline-none"
                    >
                      <option value="">All Categories</option>
                      <option value="IT & Software">IT & Software</option>
                      <option value="Cybersecurity">Cybersecurity</option>
                      <option value="Freshers">Freshers</option>
                      <option value="Internships">Internships</option>
                      <option value="Government Jobs">Government Jobs</option>
                      <option value="Work From Home">Work From Home</option>
                    </select>
                  </div>

                  <button
                    onClick={() => {
                      setEditingJob(null);
                      setFormData(initialFormState);
                      setActiveTab('add');
                    }}
                    className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl bg-teal-500 text-white font-bold text-xs hover:bg-teal-600 shadow-sm transition-all"
                  >
                    <PlusCircle className="w-4 h-4" /> Add New Job
                  </button>
                </div>

                {/* Table */}
                <div className="overflow-x-auto">
                  <table className="w-full text-left text-xs text-slate-600">
                    <thead className="bg-slate-50 text-slate-500 font-bold uppercase tracking-wider text-[11px] border-b border-slate-200">
                      <tr>
                        <th className="py-3 px-4">Job & Company</th>
                        <th className="py-3 px-4">Category</th>
                        <th className="py-3 px-4">Status</th>
                        <th className="py-3 px-4">Slug / URL</th>
                        <th className="py-3 px-4 text-right">Actions</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-100">
                      {tableJobs.map((job) => (
                        <tr key={job.id} className="hover:bg-slate-50/80 transition-colors">
                          <td className="py-3.5 px-4">
                            <div className="font-bold text-slate-800 text-sm max-w-xs truncate">
                              {job.title}
                            </div>
                            <span className="text-slate-400 text-xs">{job.company}</span>
                          </td>
                          <td className="py-3.5 px-4 font-medium">{job.category}</td>
                          <td className="py-3.5 px-4">
                            <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-[11px] font-bold ${
                              job.status === 'published' ? 'bg-emerald-50 text-emerald-700' :
                              job.status === 'expired' ? 'bg-rose-50 text-rose-700' : 'bg-amber-50 text-amber-700'
                            }`}>
                              {job.status}
                            </span>
                          </td>
                          <td className="py-3.5 px-4 font-mono text-[11px] text-slate-500 max-w-[160px] truncate">
                            /{job.slug}
                          </td>
                          <td className="py-3.5 px-4 text-right space-x-1 whitespace-nowrap">
                            {/* Toggle Publish / Draft */}
                            <button
                              onClick={() => togglePublishStatus(job.id)}
                              className="p-1.5 rounded-lg border border-slate-200 text-slate-600 hover:bg-slate-100"
                              title={job.status === 'published' ? 'Unpublish to draft' : 'Publish live'}
                            >
                              <FolderCheck className="w-3.5 h-3.5 text-teal-600" />
                            </button>

                            {/* Mark Expired */}
                            {job.status !== 'expired' && (
                              <button
                                onClick={() => markExpired(job.id)}
                                className="p-1.5 rounded-lg border border-slate-200 text-slate-600 hover:bg-slate-100"
                                title="Mark as Expired"
                              >
                                <AlertCircle className="w-3.5 h-3.5 text-amber-600" />
                              </button>
                            )}

                            {/* Edit */}
                            <button
                              onClick={() => handleEditClick(job)}
                              className="p-1.5 rounded-lg border border-slate-200 text-slate-600 hover:bg-slate-100"
                              title="Edit Job"
                            >
                              <Edit3 className="w-3.5 h-3.5 text-blue-600" />
                            </button>

                            {/* View Live */}
                            <a
                              href={`/${job.slug}`}
                              target="_blank"
                              rel="noreferrer"
                              className="p-1.5 rounded-lg border border-slate-200 text-slate-600 hover:bg-slate-100 inline-block"
                              title="View Live Page"
                            >
                              <Eye className="w-3.5 h-3.5 text-slate-700" />
                            </a>

                            {/* Delete */}
                            <button
                              onClick={() => {
                                if (confirm(`Are you sure you want to delete "${job.title}"?`)) {
                                  deleteJob(job.id);
                                }
                              }}
                              className="p-1.5 rounded-lg border border-slate-200 text-slate-600 hover:bg-rose-50 hover:text-rose-700"
                              title="Delete Job"
                            >
                              <Trash2 className="w-3.5 h-3.5 text-rose-500" />
                            </button>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            )}
          </main>
        </div>
      </div>

      {/* Success Publish Modal with Copy Link */}
      {publishedModalJob && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">
          <div className="bg-white rounded-2xl max-w-md w-full p-6 shadow-2xl space-y-4">
            <div className="w-12 h-12 rounded-2xl bg-emerald-50 text-emerald-600 flex items-center justify-center mx-auto">
              <CheckCircle className="w-6 h-6" />
            </div>

            <div className="text-center">
              <h3 className="text-lg font-bold text-navy-800">Job Successfully Published!</h3>
              <p className="text-xs text-slate-500 mt-1">
                "{publishedModalJob.title}" is now publicly accessible.
              </p>
            </div>

            <div className="p-3 bg-slate-50 rounded-xl border border-slate-200 text-xs font-mono text-slate-700 break-all flex items-center justify-between gap-2">
              <span>https://careerping.live/{publishedModalJob.slug}</span>
              <button
                onClick={() => {
                  navigator.clipboard.writeText(`https://careerping.live/${publishedModalJob.slug}`);
                  setCopiedLink(true);
                  setTimeout(() => setCopiedLink(false), 2000);
                }}
                className="p-1.5 bg-white border border-slate-200 rounded-lg text-slate-600 hover:text-teal-600 flex-shrink-0"
              >
                {copiedLink ? <Check className="w-4 h-4 text-emerald-600" /> : <Copy className="w-4 h-4" />}
              </button>
            </div>

            <div className="flex items-center gap-3 pt-2">
              <a
                href={`/${publishedModalJob.slug}`}
                target="_blank"
                rel="noreferrer"
                className="flex-1 py-2.5 rounded-xl bg-teal-500 text-white font-bold text-xs text-center hover:bg-teal-600"
              >
                View Public Page
              </a>
              <button
                onClick={() => setPublishedModalJob(null)}
                className="flex-1 py-2.5 rounded-xl border border-slate-200 text-slate-700 font-bold text-xs hover:bg-slate-50"
              >
                Done
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
