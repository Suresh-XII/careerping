import React from 'react';
import { Link } from 'react-router-dom';
import { MapPin, Briefcase, IndianRupee, Calendar, CheckCircle2, AlertCircle, ArrowRight } from 'lucide-react';
import { Job } from '../types/job';

interface JobCardProps {
  job: Job;
  featuredHighlight?: boolean;
}

export const JobCard: React.FC<JobCardProps> = ({ job, featuredHighlight = false }) => {
  // Application deadline text (defaults to ASAP)
  const deadlineText = job.application_deadline
    ? job.application_deadline.slice(0, 10)
    : 'ASAP';

  // Company Initials for badge if logo is missing
  const getCompanyInitials = (name: string) => {
    return name
      .split(' ')
      .slice(0, 2)
      .map(part => part[0])
      .join('')
      .toUpperCase();
  };

  const isExpired = job.status === 'expired';
  const isDraft = job.status === 'draft';

  return (
    <div
      className={`group bg-surface-card rounded-2xl border transition-all duration-200 p-6 flex flex-col justify-between hover:shadow-lg ${
        featuredHighlight
          ? 'border-teal-300 ring-1 ring-teal-200/50 bg-gradient-to-br from-white via-white to-teal-50/20'
          : 'border-surface-border hover:border-slate-300'
      }`}
    >
      <div>
        {/* Top Meta: Category & Status */}
        <div className="flex items-center justify-between gap-2 mb-4">
          <div className="flex items-center gap-2">
            <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-semibold bg-teal-50 text-teal-700 border border-teal-200">
              {job.category}
            </span>
            <span className="text-xs text-slate-500 font-medium">
              {job.employment_type}
            </span>
          </div>

          <div>
            {isExpired ? (
              <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-semibold bg-rose-50 text-rose-700 border border-rose-200">
                <AlertCircle className="w-3 h-3" />
                Application Closed
              </span>
            ) : isDraft ? (
              <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-semibold bg-amber-50 text-amber-700 border border-amber-200">
                Draft
              </span>
            ) : (
              <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-semibold bg-emerald-50 text-emerald-700 border border-emerald-200">
                <CheckCircle2 className="w-3 h-3" />
                Active Vacancy
              </span>
            )}
          </div>
        </div>

        {/* Company Header */}
        <div className="flex items-start gap-3.5 mb-3">
          {job.company_logo ? (
            <img
              src={job.company_logo}
              alt={`${job.company} logo`}
              className="w-12 h-12 rounded-xl object-contain border border-slate-100 bg-white p-1 flex-shrink-0"
              onError={(e) => {
                // Fallback to initials if image fails
                (e.target as HTMLElement).style.display = 'none';
              }}
            />
          ) : (
            <div className="w-12 h-12 rounded-xl bg-navy-700 text-teal-300 flex items-center justify-center font-bold text-base flex-shrink-0 shadow-sm">
              {getCompanyInitials(job.company)}
            </div>
          )}

          <div className="min-w-0 flex-1">
            <p className="text-sm font-semibold text-slate-600 truncate">{job.company}</p>
            <Link
              to={`/${job.slug}`}
              className="text-lg font-bold text-navy-800 hover:text-teal-600 transition-colors line-clamp-2 leading-snug group-hover:text-teal-600"
            >
              {job.title}
            </Link>
          </div>
        </div>

        {/* Badges / Quick Info Grid */}
        <div className="grid grid-cols-2 gap-2 my-4 text-xs text-slate-600 bg-slate-50/80 rounded-xl p-3 border border-slate-100">
          <div className="flex items-center gap-1.5 truncate">
            <MapPin className="w-3.5 h-3.5 text-teal-600 flex-shrink-0" />
            <span className="truncate">{job.location}</span>
          </div>
          <div className="flex items-center gap-1.5 truncate">
            <Briefcase className="w-3.5 h-3.5 text-teal-600 flex-shrink-0" />
            <span className="truncate">{job.experience}</span>
          </div>
          <div className="flex items-center gap-1.5 truncate">
            <IndianRupee className="w-3.5 h-3.5 text-teal-600 flex-shrink-0" />
            <span className="truncate font-semibold text-slate-800">
              {job.salary || 'Not disclosed'}
            </span>
          </div>
          <div className="flex items-center gap-1.5 truncate">
            <Calendar className="w-3.5 h-3.5 text-teal-600 flex-shrink-0" />
            <span className="truncate">
              Deadline: {deadlineText}
            </span>
          </div>
        </div>

        {/* Short description preview */}
        <p className="text-xs text-slate-500 line-clamp-2 mb-4 leading-relaxed">
          {job.description}
        </p>

        {/* Skill tags */}
        {job.required_skills && job.required_skills.length > 0 && (
          <div className="flex flex-wrap gap-1.5 mb-4">
            {job.required_skills.slice(0, 3).map((skill, idx) => (
              <span
                key={idx}
                className="inline-block px-2 py-0.5 bg-slate-100 text-slate-600 rounded text-[11px] font-medium"
              >
                {skill}
              </span>
            ))}
            {job.required_skills.length > 3 && (
              <span className="inline-block px-1.5 py-0.5 text-slate-400 text-[11px]">
                +{job.required_skills.length - 3} more
              </span>
            )}
          </div>
        )}
      </div>

      {/* Card Action Footer */}
      <div className="pt-3 border-t border-slate-100 flex items-center justify-between mt-auto">
        <span className="text-[11px] font-medium text-slate-500 flex items-center gap-1">
          <Calendar className="w-3 h-3 text-teal-600 flex-shrink-0" />
          <span>Deadline: <strong className="text-slate-700">{deadlineText}</strong></span>
        </span>

        <Link
          to={`/${job.slug}`}
          className="inline-flex items-center gap-1 text-xs font-bold text-teal-600 hover:text-teal-700 group-hover:translate-x-0.5 transition-transform"
        >
          View & Apply <ArrowRight className="w-3.5 h-3.5" />
        </Link>
      </div>
    </div>
  );
};
