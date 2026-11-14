import React from 'react';
import { Link } from 'react-router-dom';
import { 
  Sparkles, 
  Terminal, 
  GraduationCap, 
  ShieldAlert, 
  Laptop, 
  Landmark, 
  Home, 
  ArrowRight, 
  FileText,
  Clock
} from 'lucide-react';
import { useJobs } from '../context/JobContext';
import { JobCard } from '../components/JobCard';
import { HeroSearch } from '../components/HeroSearch';
import { SEOHead } from '../components/SEOHead';

export const HomePage: React.FC = () => {
  const { jobs } = useJobs();

  // Filter only published jobs for the public homepage
  const publishedJobs = jobs.filter(j => j.status === 'published');

  // Featured jobs
  const featuredJobs = publishedJobs.filter(j => j.featured).slice(0, 4);

  // Latest jobs
  const latestJobs = publishedJobs.slice(0, 6);

  // Freshers
  const fresherJobs = publishedJobs.filter(j => j.category === 'Freshers' || j.experience.toLowerCase().includes('fresher') || j.experience.includes('0 -')).slice(0, 4);

  // IT & Cybersecurity
  const itAndCyberJobs = publishedJobs.filter(j => j.category === 'IT & Software' || j.category === 'Cybersecurity').slice(0, 4);

  // Internships
  const internshipJobs = publishedJobs.filter(j => j.category === 'Internships' || j.employment_type === 'Internship').slice(0, 4);

  // Work From Home
  const wfhJobs = publishedJobs.filter(j => j.category === 'Work From Home' || j.location.toLowerCase().includes('remote')).slice(0, 4);

  // Government Jobs
  const govtJobs = publishedJobs.filter(j => j.category === 'Government Jobs').slice(0, 4);

  const categories = [
    { name: 'IT & Software', icon: Terminal, count: '120+ Active', path: '/category/it-software', color: 'from-blue-500 to-indigo-600' },
    { name: 'Cybersecurity', icon: ShieldAlert, count: '45+ Active', path: '/category/cybersecurity', color: 'from-teal-500 to-emerald-600' },
    { name: 'Freshers (0 Exp)', icon: GraduationCap, count: '80+ Active', path: '/category/freshers', color: 'from-purple-500 to-violet-600' },
    { name: 'Paid Internships', icon: Sparkles, count: '60+ Active', path: '/category/internships', color: 'from-amber-500 to-orange-600' },
    { name: 'Remote / WFH', icon: Home, count: '35+ Active', path: '/category/work-from-home', color: 'from-cyan-500 to-blue-600' },
    { name: 'Govt & PSU', icon: Landmark, count: '50+ Active', path: '/category/government-jobs', color: 'from-rose-500 to-red-600' },
  ];

  return (
    <div>
      <SEOHead
        title="Verified Job Vacancies in India - Freshers, IT, Cyber & Govt"
        description="Careerping publishes verified job updates with direct official career links for Freshers, Experienced Developers, Cybersecurity Analysts, and Govt job seekers."
        canonicalPath="/"
      />

      {/* Hero Section with Search */}
      <HeroSearch />

      {/* Section 4: Category Shortcuts */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 -mt-8 relative z-20">
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3 sm:gap-4">
          {categories.map((cat) => {
            const Icon = cat.icon;
            return (
              <Link
                key={cat.name}
                to={cat.path}
                className="bg-white rounded-2xl p-4 shadow-md hover:shadow-xl transition-all border border-slate-100 flex flex-col items-center text-center group hover:-translate-y-1"
              >
                <div className={`w-11 h-11 rounded-xl bg-gradient-to-br ${cat.color} text-white flex items-center justify-center mb-2.5 shadow-sm group-hover:scale-110 transition-transform`}>
                  <Icon className="w-5 h-5" />
                </div>
                <h3 className="text-xs sm:text-sm font-bold text-navy-800 group-hover:text-teal-600 transition-colors">
                  {cat.name}
                </h3>
                <span className="text-[11px] text-slate-400 mt-0.5">{cat.count}</span>
              </Link>
            );
          })}
        </div>
      </section>

      {/* Section 5: Latest Job Vacancies */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="flex items-end justify-between mb-8">
          <div>
            <div className="flex items-center gap-1.5 text-xs font-bold text-teal-600 uppercase tracking-wider mb-1">
              <Clock className="w-4 h-4" /> Freshly Verified
            </div>
            <h2 className="text-2xl sm:text-3xl font-extrabold text-navy-800">
              Latest Job Vacancies
            </h2>
            <p className="text-sm text-slate-500 mt-1">
              Verified daily from official company portals and public job announcements
            </p>
          </div>
          <Link
            to="/latest-jobs"
            className="hidden sm:inline-flex items-center gap-1.5 text-sm font-bold text-teal-600 hover:text-teal-700"
          >
            View all ({publishedJobs.length}) <ArrowRight className="w-4 h-4" />
          </Link>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {latestJobs.map((job) => (
            <JobCard key={job.id} job={job} />
          ))}
        </div>

        <div className="mt-8 text-center sm:hidden">
          <Link
            to="/latest-jobs"
            className="inline-flex items-center justify-center w-full py-3 px-4 rounded-xl bg-navy-700 text-white font-semibold text-sm hover:bg-navy-800"
          >
            View all {publishedJobs.length} Vacancies
          </Link>
        </div>
      </section>

      {/* Section 6: Featured Opportunities */}
      {featuredJobs.length > 0 && (
        <section className="bg-slate-50 border-y border-slate-200 py-16">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex items-center justify-between mb-8">
              <div>
                <div className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-xs font-bold bg-amber-100 text-amber-800 mb-1">
                  <Sparkles className="w-3.5 h-3.5 text-amber-600" /> Top Priority Vacancies
                </div>
                <h2 className="text-2xl sm:text-3xl font-extrabold text-navy-800">
                  Featured High-Impact Opportunities
                </h2>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-2 gap-6">
              {featuredJobs.map((job) => (
                <JobCard key={job.id} job={job} featuredHighlight={true} />
              ))}
            </div>
          </div>
        </section>
      )}

      {/* Section 7: Freshers Opportunities */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="flex items-end justify-between mb-8">
          <div>
            <span className="text-xs font-bold text-purple-600 uppercase tracking-wider block mb-1">
              For 2024, 2025 & 2026 Batches
            </span>
            <h2 className="text-2xl sm:text-3xl font-extrabold text-navy-800">
              Fresher Hiring & Off-Campus Drives
            </h2>
            <p className="text-sm text-slate-500 mt-1">
              Zero-experience software trainee, associate, and graduate engineer roles
            </p>
          </div>
          <Link
            to="/category/freshers"
            className="inline-flex items-center gap-1 text-sm font-bold text-teal-600 hover:text-teal-700"
          >
            Explore Freshers <ArrowRight className="w-4 h-4" />
          </Link>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-2 gap-6">
          {fresherJobs.map((job) => (
            <JobCard key={job.id} job={job} />
          ))}
        </div>
      </section>

      {/* Section 8: IT & Cybersecurity Jobs */}
      <section className="bg-navy-900 text-white py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-end justify-between mb-8">
            <div>
              <span className="text-xs font-bold text-teal-400 uppercase tracking-wider block mb-1">
                Domain Specialists
              </span>
              <h2 className="text-2xl sm:text-3xl font-extrabold text-white">
                IT, Cloud & Cybersecurity Openings
              </h2>
              <p className="text-sm text-slate-400 mt-1">
                SOC Analysts, Penetration Testers, Cloud Architects, and Full-Stack Engineers
              </p>
            </div>
            <Link
              to="/category/cybersecurity"
              className="inline-flex items-center gap-1 text-sm font-bold text-teal-400 hover:text-teal-300"
            >
              All Tech Openings <ArrowRight className="w-4 h-4" />
            </Link>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-2 gap-6">
            {itAndCyberJobs.map((job) => (
              <JobCard key={job.id} job={job} />
            ))}
          </div>
        </div>
      </section>

      {/* Section 9: Internships */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="flex items-end justify-between mb-8">
          <div>
            <span className="text-xs font-bold text-amber-600 uppercase tracking-wider block mb-1">
              College Students & Graduates
            </span>
            <h2 className="text-2xl sm:text-3xl font-extrabold text-navy-800">
              Verified Internship Opportunities
            </h2>
            <p className="text-sm text-slate-500 mt-1">
              Paid summer & winter internships with top multinational companies
            </p>
          </div>
          <Link
            to="/category/internships"
            className="inline-flex items-center gap-1 text-sm font-bold text-teal-600 hover:text-teal-700"
          >
            All Internships <ArrowRight className="w-4 h-4" />
          </Link>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-2 gap-6">
          {internshipJobs.map((job) => (
            <JobCard key={job.id} job={job} />
          ))}
        </div>
      </section>

      {/* Section 10 & 11: Work From Home & Government Jobs side-by-side */}
      <section className="bg-slate-50 border-t border-slate-200 py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-10">
            {/* WFH Column */}
            <div>
              <div className="flex items-center justify-between mb-6">
                <div>
                  <h3 className="text-xl font-bold text-navy-800 flex items-center gap-2">
                    <Laptop className="w-5 h-5 text-teal-600" />
                    Remote & Work From Home
                  </h3>
                  <p className="text-xs text-slate-500">Flexible India-wide remote vacancies</p>
                </div>
                <Link to="/category/work-from-home" className="text-xs font-bold text-teal-600">
                  View all
                </Link>
              </div>
              <div className="space-y-4">
                {wfhJobs.map((job) => (
                  <JobCard key={job.id} job={job} />
                ))}
              </div>
            </div>

            {/* Govt Column */}
            <div>
              <div className="flex items-center justify-between mb-6">
                <div>
                  <h3 className="text-xl font-bold text-navy-800 flex items-center gap-2">
                    <Landmark className="w-5 h-5 text-rose-600" />
                    Government & PSU Notifications
                  </h3>
                  <p className="text-xs text-slate-500">ISRO, DRDO, Banking, and State PSC</p>
                </div>
                <Link to="/category/government-jobs" className="text-xs font-bold text-teal-600">
                  View all
                </Link>
              </div>
              <div className="space-y-4">
                {govtJobs.map((job) => (
                  <JobCard key={job.id} job={job} />
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Section 12: Career Guidance Section */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="text-center max-w-3xl mx-auto mb-12">
          <span className="text-xs font-bold text-teal-600 uppercase tracking-wider block mb-1">
            Free Knowledge Base
          </span>
          <h2 className="text-2xl sm:text-3xl font-extrabold text-navy-800">
            Career Guidance for Indian Job Seekers
          </h2>
          <p className="text-sm text-slate-500 mt-2">
            Actionable strategies to stand out, crack technical rounds, and land your dream offer.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="bg-white rounded-2xl p-6 border border-slate-200 shadow-sm hover:shadow-md transition-shadow">
            <div className="w-10 h-10 rounded-xl bg-teal-50 text-teal-600 flex items-center justify-center mb-4">
              <FileText className="w-5 h-5" />
            </div>
            <h3 className="text-base font-bold text-navy-800 mb-2">
              ATS-Optimized Resumes for Indian IT
            </h3>
            <p className="text-xs text-slate-500 leading-relaxed mb-4">
              How to structure your technical resume so it successfully passes through corporate Applicant Tracking Systems (Workday, Taleo, Greenhouse).
            </p>
            <Link to="/guidance" className="text-xs font-bold text-teal-600 hover:text-teal-700 flex items-center gap-1">
              Read guide <ArrowRight className="w-3.5 h-3.5" />
            </Link>
          </div>

          <div className="bg-white rounded-2xl p-6 border border-slate-200 shadow-sm hover:shadow-md transition-shadow">
            <div className="w-10 h-10 rounded-xl bg-blue-50 text-blue-600 flex items-center justify-center mb-4">
              <ShieldAlert className="w-5 h-5" />
            </div>
            <h3 className="text-base font-bold text-navy-800 mb-2">
              SOC Analyst & Cyber Career Roadmap
            </h3>
            <p className="text-xs text-slate-500 leading-relaxed mb-4">
              Essential foundational labs, certifications (CEH, Security+, BJA), and home projects to break into L1 SOC analysis without prior experience.
            </p>
            <Link to="/guidance" className="text-xs font-bold text-teal-600 hover:text-teal-700 flex items-center gap-1">
              Read roadmap <ArrowRight className="w-3.5 h-3.5" />
            </Link>
          </div>

          <div className="bg-white rounded-2xl p-6 border border-slate-200 shadow-sm hover:shadow-md transition-shadow">
            <div className="w-10 h-10 rounded-xl bg-purple-50 text-purple-600 flex items-center justify-center mb-4">
              <GraduationCap className="w-5 h-5" />
            </div>
            <h3 className="text-base font-bold text-navy-800 mb-2">
              TCS NQT & Mass Recruiter Prep
            </h3>
            <p className="text-xs text-slate-500 leading-relaxed mb-4">
              Cracking cognitive aptitude tests, coding rounds, and behavioral HR panels for TCS, Infosys, Cognizant, and Wipro campus drives.
            </p>
            <Link to="/guidance" className="text-xs font-bold text-teal-600 hover:text-teal-700 flex items-center gap-1">
              Read preparation tips <ArrowRight className="w-3.5 h-3.5" />
            </Link>
          </div>
        </div>
      </section>

      {/* Safety & Anti-Fraud Guarantee Banner */}
      <section className="bg-teal-500 text-white py-10 px-4 sm:px-6 lg:px-8">
        <div className="max-w-5xl mx-auto flex flex-col md:flex-row items-center justify-between gap-6">
          <div className="space-y-1 text-center md:text-left">
            <h3 className="text-xl font-bold">100% Free Service for Job Seekers</h3>
            <p className="text-teal-100 text-xs max-w-xl">
              Careerping does not accept recruitment commissions from candidates. Every job links to the genuine hiring employer.
            </p>
          </div>
          <div className="flex items-center gap-3">
            <Link
              to="/about"
              className="px-5 py-2.5 rounded-xl bg-white text-teal-700 font-bold text-xs hover:bg-teal-50 shadow-sm transition-all"
            >
              How Careerping Works
            </Link>
            <Link
              to="/disclaimer"
              className="px-5 py-2.5 rounded-xl bg-teal-600 text-white font-semibold text-xs hover:bg-teal-700 border border-teal-400 transition-all"
            >
              Fraud Warning
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
};
