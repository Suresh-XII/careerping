import React from 'react';
import { ShieldCheck, Target } from 'lucide-react';
import { SEOHead } from '../components/SEOHead';

export const AboutPage: React.FC = () => {
  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
      <SEOHead
        title="About Careerping - Independent Verified Job Portal"
        description="Careerping is an independent career alert platform providing direct verified links to official company careers websites across India."
        canonicalPath="/about"
      />

      <div className="text-center mb-12">
        <span className="text-xs font-bold text-teal-600 uppercase tracking-wider block mb-1">
          Our Mission & Standards
        </span>
        <h1 className="text-3xl sm:text-4xl font-extrabold text-navy-800">
          About Careerping
        </h1>
        <p className="text-slate-500 text-sm max-w-xl mx-auto mt-2">
          Bridging the gap between Indian job seekers and legitimate employer hiring portals with 100% transparency.
        </p>
      </div>

      <div className="space-y-8 text-sm text-slate-700 leading-relaxed">
        <div className="bg-white p-6 sm:p-8 rounded-2xl border border-surface-border shadow-sm space-y-4">
          <h2 className="text-xl font-bold text-navy-800 flex items-center gap-2">
            <Target className="w-5 h-5 text-teal-600" /> What is Careerping?
          </h2>
          <p>
            Careerping is a public job publishing platform established to deliver timely, authentic, and verified employment notifications for candidates across India. We cover opportunities for freshers, experienced software engineers, cybersecurity practitioners, interns, and government job seekers.
          </p>
          <p>
            Unlike traditional job boards that gate application links behind complex sign-ups or sell candidate resumes, <strong>Careerping does not collect candidate resumes or charge any fees</strong>. Every single vacancy on Careerping redirects applicants directly to the employer's official website or verified recruitment portal.
          </p>
        </div>

        <div className="bg-white p-6 sm:p-8 rounded-2xl border border-surface-border shadow-sm space-y-4">
          <h2 className="text-xl font-bold text-navy-800 flex items-center gap-2">
            <ShieldCheck className="w-5 h-5 text-teal-600" /> Our Core Principles
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-2">
            <div className="p-4 rounded-xl bg-slate-50 border border-slate-100 space-y-1">
              <span className="font-bold text-navy-800 block text-sm">Direct Official Links</span>
              <p className="text-xs text-slate-600">
                We only link to original employer career portals (Workday, Taleo, Greenhouse, or corporate domain careers).
              </p>
            </div>
            <div className="p-4 rounded-xl bg-slate-50 border border-slate-100 space-y-1">
              <span className="font-bold text-navy-800 block text-sm">Zero Candidate Data Storage</span>
              <p className="text-xs text-slate-600">
                We never ask for your CV, Aadhaar, PAN, phone number, or bank details. Your privacy is paramount.
              </p>
            </div>
            <div className="p-4 rounded-xl bg-slate-50 border border-slate-100 space-y-1">
              <span className="font-bold text-navy-800 block text-sm">100% Free Forever</span>
              <p className="text-xs text-slate-600">
                Job seekers never pay a single rupee. No premium tiers, subscription paywalls, or paid interview passes.
              </p>
            </div>
            <div className="p-4 rounded-xl bg-slate-50 border border-slate-100 space-y-1">
              <span className="font-bold text-navy-800 block text-sm">Factual Accuracy</span>
              <p className="text-xs text-slate-600">
                We do not invent salaries, quotas, or false eligibility. Unverified details are marked as "Not disclosed".
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
