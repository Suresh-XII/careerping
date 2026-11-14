import React, { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Briefcase, Menu, X, Shield, Search } from 'lucide-react';

export const Navbar: React.FC = () => {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const location = useLocation();

  const navLinks = [
    { label: 'Home', path: '/' },
    { label: 'Latest Jobs', path: '/latest-jobs' },
    { label: 'IT Jobs', path: '/category/it-software' },
    { label: 'Freshers', path: '/category/freshers' },
    { label: 'Internships', path: '/category/internships' },
    { label: 'Govt Jobs', path: '/category/government-jobs' },
    { label: 'Work From Home', path: '/category/work-from-home' },
    { label: 'About', path: '/about' },
    { label: 'Contact', path: '/contact' },
  ];

  const isActive = (path: string) => {
    if (path === '/') return location.pathname === '/';
    return location.pathname.startsWith(path);
  };

  return (
    <header className="sticky top-0 z-40 bg-white/95 backdrop-blur border-b border-surface-border shadow-sm">
      {/* Top verified alert ticker */}
      <div className="bg-navy-700 text-white text-xs py-1.5 px-4">
        <div className="max-w-7xl mx-auto flex items-center justify-between">
          <div className="flex items-center gap-2">
            <span className="inline-block w-2 h-2 rounded-full bg-teal-400 animate-pulse"></span>
            <span className="font-medium">Direct Official Application Links Only • 100% Free • No Resumes Stored</span>
          </div>
          <div className="hidden md:flex items-center gap-4 text-slate-300">
            <span className="flex items-center gap-1 text-[11px]">
              <Shield className="w-3.5 h-3.5 text-teal-400" />
              Verified Employer Notices
            </span>
          </div>
        </div>
      </div>

      {/* Main navigation bar */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <Link to="/" className="flex items-center gap-3 group">
            <div className="w-10 h-10 rounded-xl bg-navy-700 flex items-center justify-center text-white shadow-md group-hover:bg-navy-800 transition-colors relative">
              <Briefcase className="w-5 h-5 text-teal-400" />
              <span className="absolute -top-1 -right-1 w-3 h-3 bg-teal-500 rounded-full border-2 border-white"></span>
            </div>
            <div>
              <span className="text-2xl font-extrabold tracking-tight text-navy-700">
                Career<span className="text-teal-500">ping</span>
              </span>
              <span className="block text-[10px] uppercase font-bold tracking-widest text-slate-400 -mt-1">
                India Job Alerts
              </span>
            </div>
          </Link>

          {/* Desktop Nav Links */}
          <nav className="hidden lg:flex items-center space-x-1">
            {navLinks.map((link) => (
              <Link
                key={link.path}
                to={link.path}
                className={`px-3 py-2 rounded-lg text-sm font-medium transition-colors ${
                  isActive(link.path)
                    ? 'text-teal-600 bg-teal-50 font-semibold'
                    : 'text-surface-text hover:text-navy-700 hover:bg-slate-100'
                }`}
              >
                {link.label}
              </Link>
            ))}
          </nav>

          {/* Right Action */}
          <div className="hidden sm:flex items-center gap-3">
            <Link
              to="/latest-jobs"
              className="inline-flex items-center gap-1.5 px-4 py-2 rounded-lg text-sm font-semibold bg-teal-500 text-white hover:bg-teal-600 transition-all shadow-sm hover:shadow"
            >
              <Search className="w-4 h-4" />
              Explore Jobs
            </Link>
          </div>

          {/* Mobile menu button */}
          <div className="flex items-center lg:hidden">
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="p-2 rounded-lg text-slate-600 hover:text-navy-700 hover:bg-slate-100 focus:outline-none"
              aria-label="Toggle menu"
            >
              {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile menu dropdown */}
      {mobileMenuOpen && (
        <div className="lg:hidden border-t border-slate-200 bg-white px-4 pt-2 pb-6 space-y-1 shadow-lg">
          {navLinks.map((link) => (
            <Link
              key={link.path}
              to={link.path}
              onClick={() => setMobileMenuOpen(false)}
              className={`block px-3 py-2.5 rounded-lg text-base font-medium ${
                isActive(link.path)
                  ? 'text-teal-600 bg-teal-50 font-semibold'
                  : 'text-surface-text hover:bg-slate-50'
              }`}
            >
              {link.label}
            </Link>
          ))}
          <div className="pt-4 border-t border-slate-100 flex flex-col gap-2">
            <Link
              to="/latest-jobs"
              onClick={() => setMobileMenuOpen(false)}
              className="w-full text-center py-2.5 px-4 rounded-lg bg-teal-500 text-white font-semibold text-sm hover:bg-teal-600"
            >
              Explore All Jobs
            </Link>
          </div>
        </div>
      )}
    </header>
  );
};
