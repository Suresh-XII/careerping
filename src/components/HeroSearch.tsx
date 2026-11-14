import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Search, MapPin, Sparkles, Filter } from 'lucide-react';

export const HeroSearch: React.FC = () => {
  const navigate = useNavigate();
  const [keyword, setKeyword] = useState('');
  const [category, setCategory] = useState('');
  const [location, setLocation] = useState('');

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    const params = new URLSearchParams();
    if (keyword.trim()) params.append('q', keyword.trim());
    if (category) params.append('cat', category);
    if (location) params.append('loc', location);
    navigate(`/latest-jobs?${params.toString()}`);
  };

  const quickTags = [
    { label: 'Cybersecurity', path: '/category/cybersecurity' },
    { label: 'Freshers (0 Exp)', path: '/category/freshers' },
    { label: 'Google Intern', path: '/google-cybersecurity-intern' },
    { label: 'TCS Ninja', path: '/tcs-software-engineer' },
    { label: 'ISRO Scientist', path: '/isro-scientist-engineer-sc-computer-science' },
    { label: 'Remote / WFH', path: '/category/work-from-home' },
  ];

  return (
    <div className="relative bg-gradient-to-b from-navy-800 to-navy-900 text-white pt-12 pb-16 px-4 sm:px-6 lg:px-8 overflow-hidden">
      {/* Background ambient accents */}
      <div className="absolute top-0 right-1/4 w-96 h-96 bg-teal-500/10 rounded-full blur-3xl pointer-events-none"></div>
      <div className="absolute -bottom-10 left-10 w-72 h-72 bg-navy-500/20 rounded-full blur-2xl pointer-events-none"></div>

      <div className="max-w-5xl mx-auto relative z-10 text-center">
        {/* Trust badge */}
        <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-white/10 backdrop-blur border border-white/15 text-teal-300 text-xs font-semibold mb-6">
          <Sparkles className="w-3.5 h-3.5" />
          <span>India's Verified Free Job Alerts Platform</span>
        </div>

        {/* Headline */}
        <h1 className="text-3xl sm:text-4xl md:text-5xl font-extrabold tracking-tight leading-tight max-w-4xl mx-auto mb-4">
          Discover Verified Careers.{' '}
          <span className="text-transparent bg-clip-text bg-gradient-to-r from-teal-300 to-teal-400">
            Direct Official Links.
          </span>
        </h1>
        <p className="text-slate-300 text-base sm:text-lg max-w-2xl mx-auto mb-8 font-normal">
          No middlemen, no spam, and zero application fees. Direct application links to official employer career portals across India.
        </p>

        {/* Search Box */}
        <form
          onSubmit={handleSearch}
          className="bg-white p-2.5 sm:p-3 rounded-2xl shadow-2xl max-w-4xl mx-auto grid grid-cols-1 md:grid-cols-12 gap-2 text-surface-text text-left"
        >
          {/* Keyword Search */}
          <div className="md:col-span-5 flex items-center px-3 py-2 rounded-xl bg-slate-50 border border-slate-200/80 focus-within:border-teal-500 focus-within:ring-1 focus-within:ring-teal-500 transition-all">
            <Search className="w-5 h-5 text-slate-400 mr-2 flex-shrink-0" />
            <input
              type="text"
              value={keyword}
              onChange={(e) => setKeyword(e.target.value)}
              placeholder="Job title, skills, or company..."
              className="w-full bg-transparent text-sm focus:outline-none placeholder-slate-400 text-slate-800"
            />
          </div>

          {/* Category Dropdown */}
          <div className="md:col-span-3 flex items-center px-3 py-2 rounded-xl bg-slate-50 border border-slate-200/80 focus-within:border-teal-500 transition-all">
            <Filter className="w-4 h-4 text-slate-400 mr-2 flex-shrink-0" />
            <select
              value={category}
              onChange={(e) => setCategory(e.target.value)}
              className="w-full bg-transparent text-sm focus:outline-none text-slate-700 cursor-pointer"
            >
              <option value="">All Categories</option>
              <option value="IT & Software">IT & Software</option>
              <option value="Cybersecurity">Cybersecurity</option>
              <option value="Freshers">Freshers</option>
              <option value="Internships">Internships</option>
              <option value="Government Jobs">Govt Jobs</option>
              <option value="Work From Home">Work From Home</option>
              <option value="Banking & Finance">Banking & Finance</option>
              <option value="Core Engineering">Core Engineering</option>
            </select>
          </div>

          {/* Location Dropdown */}
          <div className="md:col-span-2 flex items-center px-3 py-2 rounded-xl bg-slate-50 border border-slate-200/80 focus-within:border-teal-500 transition-all">
            <MapPin className="w-4 h-4 text-slate-400 mr-1.5 flex-shrink-0" />
            <select
              value={location}
              onChange={(e) => setLocation(e.target.value)}
              className="w-full bg-transparent text-sm focus:outline-none text-slate-700 cursor-pointer"
            >
              <option value="">Any Location</option>
              <option value="Bengaluru">Bengaluru</option>
              <option value="Hyderabad">Hyderabad</option>
              <option value="Pune">Pune</option>
              <option value="Mumbai">Mumbai</option>
              <option value="Delhi">Delhi NCR</option>
              <option value="Chennai">Chennai</option>
              <option value="Remote">Remote/WFH</option>
            </select>
          </div>

          {/* Submit Button */}
          <div className="md:col-span-2">
            <button
              type="submit"
              className="w-full h-full min-h-[44px] bg-teal-500 hover:bg-teal-600 text-white rounded-xl font-semibold text-sm flex items-center justify-center gap-1.5 shadow-md hover:shadow-lg transition-all"
            >
              <Search className="w-4 h-4" />
              Find Jobs
            </button>
          </div>
        </form>

        {/* Quick Tags */}
        <div className="mt-6 flex flex-wrap items-center justify-center gap-2 text-xs">
          <span className="text-slate-400 font-medium">Trending Searches:</span>
          {quickTags.map((tag) => (
            <button
              key={tag.label}
              onClick={() => navigate(tag.path)}
              className="px-2.5 py-1 rounded-lg bg-white/10 hover:bg-white/20 text-slate-200 hover:text-white transition-colors border border-white/10"
            >
              {tag.label}
            </button>
          ))}
        </div>
      </div>
    </div>
  );
};
