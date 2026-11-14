import React, { useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { 
  MapPin, 
  Briefcase, 
  IndianRupee, 
  Calendar, 
  GraduationCap, 
  ShieldCheck, 
  ExternalLink, 
  Copy, 
  Check, 
  ArrowLeft, 
  AlertTriangle,
  FileCheck2,
  ChevronRight
} from 'lucide-react';
import { useJobs } from '../context/JobContext';
import { JobCard } from '../components/JobCard';
import { SEOHead } from '../components/SEOHead';

export const JobDetailPage: React.FC = () => {
  const { jobSlug } = useParams<{ jobSlug: string }>();
  const { getJobBySlug, jobs } = useJobs();
  const [copied, setCopied] = useState(false);

  const job = jobSlug ? getJobBySlug(jobSlug) : undefined;

  if (!job) {
    return (
      <div className="max-w-4xl mx-auto px-4 py-20 text-center">
        <SEOHead
          title="Job Vacancy Not Found"
          description="The requested job vacancy is not available on Careerping or the link has changed."
          canonicalPath="/jobs"
        />
        <div className="w-16 h-16 rounded-2xl bg-amber-50 text-amber-600 flex items-center justify-center mx-auto mb-4 border border-amber-200">
          <AlertTriangle className="w-8 h-8" />
        </div>
        <h1 className="text-2xl font-bold text-navy-800 mb-2">Job Vacancy Not Found</h1>
        <p className="text-slate-500 text-sm max-w-md mx-auto mb-6">
          This job vacancy link may have expired or been removed. Explore other active opportunities on Careerping.
        </p>
        <Link
          to="/latest-jobs"
          className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-teal-500 text-white font-semibold text-sm hover:bg-teal-600 transition-colors shadow-sm"
        >
          <ArrowLeft className="w-4 h-4" /> Browse Active Jobs
        </Link>
      </div>
    );
  }

  // Related jobs
  const relatedJobs = jobs
    .filter(j => j.id !== job.id && j.status === 'published' && (j.category === job.category || j.company === job.company))
    .slice(0, 3);

  // Custom domain canonical URL
  const jobPublicUrl = `https://careerping.live/${job.slug}`;

  const handleCopyLink = () => {
    navigator.clipboard.writeText(jobPublicUrl);
    setCopied(true);
    setTimeout(() => setCopied(false), 2500);
  };

  const shareText = `Check out this verified opening: ${job.title} at ${job.company}`;
  const whatsappUrl = `https://api.whatsapp.com/send?text=${encodeURIComponent(`${shareText} - ${jobPublicUrl}`)}`;
  const linkedInUrl = `https://www.linkedin.com/sharing/share-offsite/?url=${encodeURIComponent(jobPublicUrl)}`;
  const twitterUrl = `https://twitter.com/intent/tweet?text=${encodeURIComponent(shareText)}&url=${encodeURIComponent(jobPublicUrl)}`;
  const telegramUrl = `https://t.me/share/url?url=${encodeURIComponent(jobPublicUrl)}&text=${encodeURIComponent(shareText)}`;

  const isExpired = job.status === 'expired';

  return (
    <div className="min-h-screen pb-20">
      <SEOHead
        title={`${job.title} at ${job.company} - Verified Job Alert`}
        description={`${job.title} at ${job.company}. Location: ${job.location}. Experience: ${job.experience}. Qualification: ${job.qualification}. Apply directly on the official employer website.`}
        canonicalPath={`/${job.slug}`}
        job={job}
      />

      {/* Breadcrumb Navigation */}
      <div className="bg-white border-b border-surface-border py-3">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <nav className="flex items-center text-xs text-slate-500 space-x-2">
            <Link to="/" className="hover:text-navy-700 transition-colors">Home</Link>
            <ChevronRight className="w-3.5 h-3.5 text-slate-300" />
            <Link to="/latest-jobs" className="hover:text-navy-700 transition-colors">Jobs</Link>
            <ChevronRight className="w-3.5 h-3.5 text-slate-300" />
            <span className="text-teal-700 font-medium truncate">{job.category}</span>
            <ChevronRight className="w-3.5 h-3.5 text-slate-300" />
            <span className="text-slate-700 font-semibold truncate max-w-[200px] sm:max-w-xs">{job.title}</span>
          </nav>
        </div>
      </div>

      {/* Main Content Area */}
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 pt-8">
        {/* Expired Warning Banner */}
        {isExpired && (
          <div className="mb-6 p-4 rounded-2xl bg-rose-50 border border-rose-200 flex items-start gap-3 text-rose-800">
            <AlertTriangle className="w-5 h-5 flex-shrink-0 text-rose-600 mt-0.5" />
            <div className="text-sm">
              <span className="font-bold">Notice: This job vacancy has expired.</span>
              <p className="text-xs text-rose-700 mt-0.5">
                The application deadline for this opening has passed. This page is maintained for reference, salary benchmarks, and exam syllabus archives.
              </p>
            </div>
          </div>
        )}

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
          {/* Main Job Article (8 cols) */}
          <article className="lg:col-span-8 space-y-6">
            {/* Header Card */}
            <div className="bg-white rounded-2xl border border-surface-border p-6 sm:p-8 shadow-sm">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-4">
                <div className="flex items-center gap-3">
                  <div className="w-14 h-14 rounded-2xl bg-navy-700 text-teal-300 flex items-center justify-center font-bold text-xl shadow-sm flex-shrink-0">
                    {job.company.substring(0, 2).toUpperCase()}
                  </div>
                  <div>
                    <h2 className="text-base font-semibold text-slate-600">{job.company}</h2>
                    <span className="inline-flex items-center gap-1 text-xs text-teal-700 font-medium bg-teal-50 px-2 py-0.5 rounded-md border border-teal-200">
                      <ShieldCheck className="w-3.5 h-3.5 text-teal-600" /> Official Verified Notice
                    </span>
                  </div>
                </div>

                <div className="flex items-center gap-2">
                  <span className="px-3 py-1 rounded-full text-xs font-semibold bg-slate-100 text-slate-700">
                    {job.category}
                  </span>
                  <span className="px-3 py-1 rounded-full text-xs font-semibold bg-blue-50 text-blue-700">
                    {job.employment_type}
                  </span>
                </div>
              </div>

              <h1 className="text-2xl sm:text-3xl font-extrabold text-navy-800 leading-tight mb-6">
                {job.title}
              </h1>

              {/* Key Quick Facts Grid */}
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 p-4 rounded-xl bg-slate-50 border border-slate-100 text-xs text-slate-700">
                <div className="space-y-0.5">
                  <span className="text-slate-400 block font-medium">Location</span>
                  <div className="flex items-center gap-1 font-semibold text-slate-800">
                    <MapPin className="w-3.5 h-3.5 text-teal-600" />
                    <span className="truncate">{job.location}</span>
                  </div>
                </div>

                <div className="space-y-0.5">
                  <span className="text-slate-400 block font-medium">Experience</span>
                  <div className="flex items-center gap-1 font-semibold text-slate-800">
                    <Briefcase className="w-3.5 h-3.5 text-teal-600" />
                    <span>{job.experience}</span>
                  </div>
                </div>

                <div className="space-y-0.5">
                  <span className="text-slate-400 block font-medium">Salary / CTC</span>
                  <div className="flex items-center gap-1 font-semibold text-emerald-700">
                    <IndianRupee className="w-3.5 h-3.5 text-teal-600" />
                    <span>{job.salary || 'Not disclosed'}</span>
                  </div>
                </div>

                <div className="space-y-0.5">
                  <span className="text-slate-400 block font-medium">Deadline</span>
                  <div className="flex items-center gap-1 font-semibold text-slate-800">
                    <Calendar className="w-3.5 h-3.5 text-teal-600" />
                    <span>{job.application_deadline ? job.application_deadline.slice(0, 10) : 'ASAP'}</span>
                  </div>
                </div>
              </div>

              {/* Action Bar (Top) */}
              <div className="mt-6 pt-6 border-t border-slate-100 flex flex-col sm:flex-row items-center justify-between gap-4">
                <div className="text-xs text-slate-600 font-medium flex items-center gap-1.5">
                  <Calendar className="w-3.5 h-3.5 text-teal-600" />
                  <span>Application Deadline: <strong className="text-slate-800">{job.application_deadline ? job.application_deadline.slice(0, 10) : 'ASAP'}</strong></span>
                </div>

                <div className="flex items-center gap-2 w-full sm:w-auto">
                  <button
                    onClick={handleCopyLink}
                    className="flex-1 sm:flex-none inline-flex items-center justify-center gap-1.5 px-3 py-2 rounded-xl border border-slate-200 text-xs font-semibold text-slate-700 hover:bg-slate-50 transition-colors"
                  >
                    {copied ? <Check className="w-3.5 h-3.5 text-emerald-600" /> : <Copy className="w-3.5 h-3.5" />}
                    {copied ? 'Link Copied!' : 'Copy Link'}
                  </button>
                </div>
              </div>
            </div>

            {/* Job Description & Overview */}
            <div className="bg-white rounded-2xl border border-surface-border p-6 sm:p-8 shadow-sm space-y-6">
              <div>
                <h3 className="text-lg font-bold text-navy-800 mb-3 flex items-center gap-2">
                  <FileCheck2 className="w-5 h-5 text-teal-600" /> Job Overview
                </h3>
                <p className="text-sm text-slate-600 leading-relaxed whitespace-pre-line">
                  {job.description}
                </p>
              </div>

              {/* Required Qualifications */}
              {job.qualification && (
                <div className="pt-4 border-t border-slate-100">
                  <h4 className="text-sm font-bold text-navy-800 mb-2 flex items-center gap-2">
                    <GraduationCap className="w-4 h-4 text-teal-600" /> Educational Qualification
                  </h4>
                  <p className="text-sm text-slate-700 bg-slate-50 p-3 rounded-xl border border-slate-100 font-medium">
                    {job.qualification}
                  </p>
                </div>
              )}

              {/* Eligibility Criteria */}
              {job.eligibility && job.eligibility.length > 0 && (
                <div className="pt-4 border-t border-slate-100">
                  <h4 className="text-sm font-bold text-navy-800 mb-3">
                    Eligibility Criteria
                  </h4>
                  <ul className="space-y-2 text-sm text-slate-600">
                    {job.eligibility.map((item, idx) => (
                      <li key={idx} className="flex items-start gap-2.5">
                        <span className="w-1.5 h-1.5 rounded-full bg-teal-500 mt-2 flex-shrink-0"></span>
                        <span>{item}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              )}

              {/* Key Responsibilities */}
              {job.responsibilities && job.responsibilities.length > 0 && (
                <div className="pt-4 border-t border-slate-100">
                  <h4 className="text-sm font-bold text-navy-800 mb-3">
                    Roles & Key Responsibilities
                  </h4>
                  <ul className="space-y-2 text-sm text-slate-600">
                    {job.responsibilities.map((resp, idx) => (
                      <li key={idx} className="flex items-start gap-2.5">
                        <span className="w-1.5 h-1.5 rounded-full bg-navy-700 mt-2 flex-shrink-0"></span>
                        <span>{resp}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              )}

              {/* Required Skills & Technologies */}
              {job.required_skills && job.required_skills.length > 0 && (
                <div className="pt-4 border-t border-slate-100">
                  <h4 className="text-sm font-bold text-navy-800 mb-3">
                    Required Skills & Competencies
                  </h4>
                  <div className="flex flex-wrap gap-2">
                    {job.required_skills.map((skill, idx) => (
                      <span
                        key={idx}
                        className="px-3 py-1 rounded-lg text-xs font-semibold bg-teal-50 text-teal-700 border border-teal-200"
                      >
                        {skill}
                      </span>
                    ))}
                  </div>
                </div>
              )}

              {/* Selection Process (if available) */}
              {job.selection_process && job.selection_process.length > 0 && (
                <div className="pt-4 border-t border-slate-100">
                  <h4 className="text-sm font-bold text-navy-800 mb-3">
                    Selection & Interview Rounds
                  </h4>
                  <div className="space-y-2.5">
                    {job.selection_process.map((round, idx) => (
                      <div key={idx} className="flex items-center gap-3 p-3 rounded-xl bg-slate-50 border border-slate-100 text-xs sm:text-sm text-slate-700">
                        <span className="w-6 h-6 rounded-lg bg-navy-700 text-white font-bold flex items-center justify-center text-xs flex-shrink-0">
                          {idx + 1}
                        </span>
                        <span>{round}</span>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>

            {/* Mandatory Applicant Notice & Anti-Fraud */}
            <div className="bg-amber-50 border border-amber-200 rounded-2xl p-6 text-xs text-amber-900 space-y-2">
              <div className="flex items-center gap-2 font-bold text-amber-800 text-sm">
                <ShieldCheck className="w-5 h-5 text-amber-600" />
                Careerping Verification & Anti-Fraud Advisory
              </div>
              <p>
                Careerping is an independent vacancy alert portal. We do not collect job applications, resumes, or candidate personal information. Clicking the apply button will direct you directly to the employer's official website.
              </p>
              <p className="font-semibold text-amber-950">
                Never pay any fees to recruiters asking for registration charges or interview slots. Legitimate employers never charge candidates.
              </p>
            </div>
          </article>

          {/* Sidebar / Sticky Action Box (4 cols) */}
          <aside className="lg:col-span-4 space-y-6">
            {/* Primary Action Card */}
            <div className="bg-white rounded-2xl border border-surface-border p-6 shadow-md sticky top-24 space-y-6">
              <div>
                <span className="text-xs font-semibold text-slate-400 uppercase tracking-wider block mb-1">
                  Ready to Apply?
                </span>
                <h3 className="text-lg font-extrabold text-navy-800">
                  Official Application
                </h3>
                <p className="text-xs text-slate-500 mt-1">
                  You will be safely redirected to {job.company}'s verified career page.
                </p>
              </div>

              {/* Big Official Apply Button */}
              {isExpired ? (
                <div className="w-full py-4 px-4 rounded-xl bg-slate-200 text-slate-500 font-bold text-center text-sm cursor-not-allowed">
                  Application Closed
                </div>
              ) : (
                <a
                  href={job.apply_url}
                  target="_blank"
                  rel="noopener noreferrer nofollow"
                  className="w-full flex items-center justify-center gap-2 py-4 px-5 rounded-xl bg-teal-500 hover:bg-teal-600 text-white font-extrabold text-sm shadow-md hover:shadow-lg transition-all text-center tracking-wide"
                >
                  <span>APPLY ON OFFICIAL WEBSITE</span>
                  <ExternalLink className="w-4 h-4" />
                </a>
              )}

              {/* Official Source Link (for auditing) */}
              {job.source_url && (
                <div className="text-center">
                  <a
                    href={job.source_url}
                    target="_blank"
                    rel="noopener noreferrer nofollow"
                    className="text-[11px] text-slate-400 hover:text-slate-600 underline inline-flex items-center gap-1"
                  >
                    View Original Source Notification <ExternalLink className="w-2.5 h-2.5" />
                  </a>
                </div>
              )}

              {/* Social Sharing */}
              <div className="pt-4 border-t border-slate-100">
                <span className="text-xs font-bold text-slate-700 block mb-3">
                  Share this verified vacancy
                </span>
                <div className="grid grid-cols-4 gap-2">
                  <a
                    href={whatsappUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="py-2 rounded-lg bg-emerald-50 text-emerald-700 hover:bg-emerald-100 text-center text-xs font-bold transition-colors"
                  >
                    WhatsApp
                  </a>
                  <a
                    href={linkedInUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="py-2 rounded-lg bg-blue-50 text-blue-700 hover:bg-blue-100 text-center text-xs font-bold transition-colors"
                  >
                    LinkedIn
                  </a>
                  <a
                    href={twitterUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="py-2 rounded-lg bg-slate-100 text-slate-700 hover:bg-slate-200 text-center text-xs font-bold transition-colors"
                  >
                    X / Twitter
                  </a>
                  <a
                    href={telegramUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="py-2 rounded-lg bg-cyan-50 text-cyan-700 hover:bg-cyan-100 text-center text-xs font-bold transition-colors"
                  >
                    Telegram
                  </a>
                </div>
              </div>

              {/* FAQ Box */}
              <div className="pt-4 border-t border-slate-100 text-xs text-slate-600 space-y-3">
                <span className="font-bold text-navy-800 block text-xs">
                  Quick Frequently Asked Questions
                </span>
                <div>
                  <p className="font-semibold text-slate-700">Q: Does Careerping take my resume?</p>
                  <p className="text-slate-500 text-[11px] mt-0.5">
                    No. Careerping does not collect or store resumes. You submit your application directly on {job.company}'s official site.
                  </p>
                </div>
                <div>
                  <p className="font-semibold text-slate-700">Q: Is there any fee to apply?</p>
                  <p className="text-slate-500 text-[11px] mt-0.5">
                    Never. All job postings and links on Careerping are 100% free.
                  </p>
                </div>
              </div>
            </div>
          </aside>
        </div>

        {/* Related Jobs Section */}
        {relatedJobs.length > 0 && (
          <section className="mt-16 pt-12 border-t border-slate-200">
            <h3 className="text-xl font-extrabold text-navy-800 mb-6">
              Similar Vacancies You May Be Interested In
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {relatedJobs.map((rJob) => (
                <JobCard key={rJob.id} job={rJob} />
              ))}
            </div>
          </section>
        )}
      </div>
    </div>
  );
};
