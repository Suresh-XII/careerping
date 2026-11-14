import React from 'react';
import { Link } from 'react-router-dom';
import { Briefcase, ShieldCheck, Globe } from 'lucide-react';

export const Footer: React.FC = () => {
  return (
    <footer className="bg-navy-900 text-slate-300 mt-auto border-t border-navy-800">
      {/* Top Disclaimer Banner */}
      <div className="bg-navy-800/80 border-b border-navy-700 py-4 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row items-center justify-between gap-3 text-xs text-slate-300">
          <div className="flex items-center gap-2 text-teal-400">
            <ShieldCheck className="w-5 h-5 flex-shrink-0" />
            <span className="font-semibold text-white">Fraud Prevention & Candidate Safety:</span>
          </div>
          <p className="text-center md:text-left flex-1 text-slate-300">
            Careerping never asks for application fees, registration charges, or personal banking info. We only link directly to official employer career pages. Beware of fraudulent emails or agents demanding money.
          </p>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-8">
          {/* Brand info */}
          <div className="lg:col-span-2 space-y-4">
            <Link to="/" className="flex items-center gap-3">
              <div className="w-9 h-9 rounded-xl bg-teal-500 flex items-center justify-center text-white">
                <Briefcase className="w-5 h-5" />
              </div>
              <span className="text-2xl font-bold tracking-tight text-white">
                Career<span className="text-teal-400">ping</span>
              </span>
            </Link>
            <p className="text-sm text-slate-400 leading-relaxed max-w-sm">
              India's dedicated career alerts platform publishing verified job notifications for freshers, IT professionals, cybersecurity specialists, interns, and government job aspirants.
            </p>
            <div className="flex items-center gap-2 text-xs text-teal-300 bg-navy-800 px-3 py-1.5 rounded-lg w-fit border border-navy-700">
              <Globe className="w-4 h-4" />
              <span>Configured for Custom Root Domain (careerping.in / careerping.com)</span>
            </div>
          </div>

          {/* Quick Categories */}
          <div>
            <h4 className="text-sm font-semibold uppercase tracking-wider text-white mb-4">
              Job Categories
            </h4>
            <ul className="space-y-2 text-sm">
              <li>
                <Link to="/category/it-software" className="hover:text-teal-400 transition-colors">
                  IT & Software
                </Link>
              </li>
              <li>
                <Link to="/category/cybersecurity" className="hover:text-teal-400 transition-colors">
                  Cybersecurity Jobs
                </Link>
              </li>
              <li>
                <Link to="/category/freshers" className="hover:text-teal-400 transition-colors">
                  Freshers (2025/2026)
                </Link>
              </li>
              <li>
                <Link to="/category/internships" className="hover:text-teal-400 transition-colors">
                  Paid Internships
                </Link>
              </li>
              <li>
                <Link to="/category/government-jobs" className="hover:text-teal-400 transition-colors">
                  Government & PSU
                </Link>
              </li>
              <li>
                <Link to="/category/work-from-home" className="hover:text-teal-400 transition-colors">
                  Remote / WFH Jobs
                </Link>
              </li>
            </ul>
          </div>

          {/* Navigation */}
          <div>
            <h4 className="text-sm font-semibold uppercase tracking-wider text-white mb-4">
              Explore
            </h4>
            <ul className="space-y-2 text-sm">
              <li>
                <Link to="/latest-jobs" className="hover:text-teal-400 transition-colors">
                  All Active Vacancies
                </Link>
              </li>
              <li>
                <Link to="/guidance" className="hover:text-teal-400 transition-colors">
                  Career Guidance
                </Link>
              </li>
              <li>
                <Link to="/about" className="hover:text-teal-400 transition-colors">
                  About Careerping
                </Link>
              </li>
              <li>
                <Link to="/contact" className="hover:text-teal-400 transition-colors">
                  Contact & Support
                </Link>
              </li>
            </ul>
          </div>

          {/* Legal & Compliance */}
          <div>
            <h4 className="text-sm font-semibold uppercase tracking-wider text-white mb-4">
              Legal & Policies
            </h4>
            <ul className="space-y-2 text-sm">
              <li>
                <Link to="/disclaimer" className="hover:text-teal-400 transition-colors">
                  Job Disclaimer
                </Link>
              </li>
              <li>
                <Link to="/privacy-policy" className="hover:text-teal-400 transition-colors">
                  Privacy Policy
                </Link>
              </li>
              <li>
                <Link to="/terms" className="hover:text-teal-400 transition-colors">
                  Terms & Conditions
                </Link>
              </li>
              <li>
                <Link to="/anti-fraud" className="hover:text-teal-400 transition-colors">
                  Anti-Fraud Guidelines
                </Link>
              </li>
            </ul>
          </div>
        </div>

        {/* Bottom copyright */}
        <div className="border-t border-navy-800 mt-12 pt-6 flex flex-col sm:flex-row items-center justify-between text-xs text-slate-500 gap-4">
          <p>© {new Date().getFullYear()} Careerping. All rights reserved. Made for Indian job aspirants.</p>
          <p className="flex items-center gap-1 text-slate-400">
            Powered by GitHub Pages & Supabase
          </p>
        </div>
      </div>
    </footer>
  );
};
