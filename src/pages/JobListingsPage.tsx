import React, { useState, useMemo } from 'react';
import { useSearchParams } from 'react-router-dom';
import { Search, Filter, MapPin, Briefcase, X, SlidersHorizontal } from 'lucide-react';
import { useJobs } from '../context/JobContext';
import { JobCard } from '../components/JobCard';
import { SEOHead } from '../components/SEOHead';
import { JobCategory } from '../types/job';

interface JobListingsPageProps {
  forcedCategory?: JobCategory;
  pageTitle?: string;
  pageDescription?: string;
}

export const JobListingsPage: React.FC<JobListingsPageProps> = ({
  forcedCategory,
  pageTitle,
  pageDescription
}) => {
  const { jobs } = useJobs();
  const [searchParams, setSearchParams] = useSearchParams();

  const [searchTerm, setSearchTerm] = useState(searchParams.get('q') || '');
  const [selectedCategory, setSelectedCategory] = useState<string>(
    forcedCategory || searchParams.get('cat') || ''
  );
  const [selectedLocation, setSelectedLocation] = useState(searchParams.get('loc') || '');
  const [selectedExperience, setSelectedExperience] = useState(searchParams.get('exp') || '');
  const [sortBy, setSortBy] = useState<'latest' | 'deadline'>('latest');

  // Filter public published jobs
  const filteredJobs = useMemo(() => {
    return jobs.filter((job) => {
      // Must be published for public listing
      if (job.status !== 'published') return false;

      // Category filter
      if (forcedCategory && job.category !== forcedCategory) return false;
      if (!forcedCategory && selectedCategory && job.category !== selectedCategory) return false;

      // Location filter
      if (selectedLocation) {
        if (selectedLocation === 'Remote') {
          if (!job.location.toLowerCase().includes('remote') && job.category !== 'Work From Home') return false;
        } else {
          if (!job.location.toLowerCase().includes(selectedLocation.toLowerCase())) return false;
        }
      }

      // Experience filter
      if (selectedExperience) {
        if (selectedExperience === 'Fresher') {
          if (!job.experience.toLowerCase().includes('fresher') && !job.experience.includes('0 -') && job.category !== 'Freshers') {
            return false;
          }
        } else if (selectedExperience === 'Experienced') {
          if (job.experience.toLowerCase().includes('fresher') && !job.experience.includes('2+') && !job.experience.includes('3')) {
            return false;
          }
        }
      }

      // Search term
      if (searchTerm.trim()) {
        const query = searchTerm.toLowerCase().trim();
        const matchesTitle = job.title.toLowerCase().includes(query);
        const matchesCompany = job.company.toLowerCase().includes(query);
        const matchesDesc = job.description.toLowerCase().includes(query);
        const matchesSkill = job.required_skills?.some(s => s.toLowerCase().includes(query));
        const matchesLocation = job.location.toLowerCase().includes(query);

        if (!matchesTitle && !matchesCompany && !matchesDesc && !matchesSkill && !matchesLocation) {
          return false;
        }
      }

      return true;
    }).sort((a, b) => {
      if (sortBy === 'deadline') {
        const dA = a.application_deadline ? new Date(a.application_deadline).getTime() : Infinity;
        const dB = b.application_deadline ? new Date(b.application_deadline).getTime() : Infinity;
        return dA - dB;
      }
      // Default: latest published
      const pA = a.published_at ? new Date(a.published_at).getTime() : 0;
      const pB = b.published_at ? new Date(b.published_at).getTime() : 0;
      return pB - pA;
    });
  }, [jobs, forcedCategory, selectedCategory, selectedLocation, selectedExperience, searchTerm, sortBy]);

  const clearFilters = () => {
    setSearchTerm('');
    if (!forcedCategory) setSelectedCategory('');
    setSelectedLocation('');
    setSelectedExperience('');
    setSearchParams({});
  };

  const hasActiveFilters = Boolean(
    searchTerm || (!forcedCategory && selectedCategory) || selectedLocation || selectedExperience
  );

  const title = pageTitle || (forcedCategory ? `${forcedCategory} Jobs in India` : 'Latest Job Vacancies in India');
  const description = pageDescription || `Browse verified ${forcedCategory || 'IT, fresher, cybersecurity, and government'} job openings with direct official application links on Careerping.`;

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
      <SEOHead
        title={title}
        description={description}
        canonicalPath={forcedCategory ? `/category/${forcedCategory.toLowerCase().replace(/[^a-z0-9]+/g, '-')}` : '/latest-jobs'}
      />

      {/* Header Banner */}
      <div className="mb-8">
        <h1 className="text-3xl font-extrabold text-navy-800 tracking-tight">
          {title}
        </h1>
        <p className="text-sm text-slate-500 mt-1">
          {description}
        </p>
      </div>

      {/* Filter and Search Bar */}
      <div className="bg-white p-4 rounded-2xl border border-surface-border shadow-sm mb-8 space-y-4">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-12 gap-3">
          {/* Keyword Search */}
          <div className="lg:col-span-4 flex items-center px-3 py-2 rounded-xl bg-slate-50 border border-slate-200">
            <Search className="w-4 h-4 text-slate-400 mr-2 flex-shrink-0" />
            <input
              type="text"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              placeholder="Search title, skills, or company..."
              className="w-full bg-transparent text-xs sm:text-sm focus:outline-none text-slate-800"
            />
            {searchTerm && (
              <button onClick={() => setSearchTerm('')} className="text-slate-400 hover:text-slate-600">
                <X className="w-4 h-4" />
              </button>
            )}
          </div>

          {/* Category Dropdown (if not forced) */}
          {!forcedCategory && (
            <div className="lg:col-span-3 flex items-center px-3 py-2 rounded-xl bg-slate-50 border border-slate-200">
              <Filter className="w-4 h-4 text-slate-400 mr-2 flex-shrink-0" />
              <select
                value={selectedCategory}
                onChange={(e) => setSelectedCategory(e.target.value)}
                className="w-full bg-transparent text-xs sm:text-sm focus:outline-none text-slate-700"
              >
                <option value="">All Categories</option>
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
          )}

          {/* Location Dropdown */}
          <div className={`${forcedCategory ? 'lg:col-span-4' : 'lg:col-span-3'} flex items-center px-3 py-2 rounded-xl bg-slate-50 border border-slate-200`}>
            <MapPin className="w-4 h-4 text-slate-400 mr-2 flex-shrink-0" />
            <select
              value={selectedLocation}
              onChange={(e) => setSelectedLocation(e.target.value)}
              className="w-full bg-transparent text-xs sm:text-sm focus:outline-none text-slate-700"
            >
              <option value="">Any Location</option>
              <option value="Bengaluru">Bengaluru</option>
              <option value="Hyderabad">Hyderabad</option>
              <option value="Pune">Pune</option>
              <option value="Mumbai">Mumbai</option>
              <option value="Delhi">Delhi NCR</option>
              <option value="Chennai">Chennai</option>
              <option value="Remote">Remote / WFH</option>
            </select>
          </div>

          {/* Experience Dropdown */}
          <div className="lg:col-span-2 flex items-center px-3 py-2 rounded-xl bg-slate-50 border border-slate-200">
            <Briefcase className="w-4 h-4 text-slate-400 mr-2 flex-shrink-0" />
            <select
              value={selectedExperience}
              onChange={(e) => setSelectedExperience(e.target.value)}
              className="w-full bg-transparent text-xs sm:text-sm focus:outline-none text-slate-700"
            >
              <option value="">All Exp</option>
              <option value="Fresher">Freshers (0 Exp)</option>
              <option value="Experienced">Experienced</option>
            </select>
          </div>
        </div>

        {/* Results Meta & Active Filters */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between text-xs text-slate-500 gap-3 pt-2 border-t border-slate-100">
          <div className="flex items-center gap-2">
            <span className="font-semibold text-slate-700">{filteredJobs.length} Vacancies found</span>
            {hasActiveFilters && (
              <button
                onClick={clearFilters}
                className="inline-flex items-center gap-1 text-teal-600 hover:text-teal-800 font-bold ml-2 underline"
              >
                Clear all filters
              </button>
            )}
          </div>

          <div className="flex items-center gap-2">
            <SlidersHorizontal className="w-3.5 h-3.5 text-slate-400" />
            <span>Sort by:</span>
            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value as any)}
              className="bg-transparent font-medium text-slate-700 focus:outline-none cursor-pointer"
            >
              <option value="latest">Latest Published</option>
              <option value="deadline">Approaching Deadline</option>
            </select>
          </div>
        </div>
      </div>

      {/* Job Cards Grid */}
      {filteredJobs.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredJobs.map((job) => (
            <JobCard key={job.id} job={job} />
          ))}
        </div>
      ) : (
        <div className="bg-white rounded-2xl border border-surface-border p-12 text-center max-w-lg mx-auto">
          <div className="w-12 h-12 rounded-xl bg-slate-100 text-slate-400 flex items-center justify-center mx-auto mb-3">
            <Search className="w-6 h-6" />
          </div>
          <h3 className="text-base font-bold text-navy-800 mb-1">No Matching Vacancies Found</h3>
          <p className="text-xs text-slate-500 mb-4">
            Try adjusting your search terms or clearing your location/category filters.
          </p>
          <button
            onClick={clearFilters}
            className="px-4 py-2 rounded-xl bg-teal-500 text-white font-semibold text-xs hover:bg-teal-600"
          >
            Reset Filters
          </button>
        </div>
      )}
    </div>
  );
};
