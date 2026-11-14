import React from 'react';
import { AlertTriangle } from 'lucide-react';
import { SEOHead } from '../components/SEOHead';

export const DisclaimerPage: React.FC = () => {
  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
      <SEOHead
        title="Disclaimer & Anti-Fraud Notice"
        description="Legal disclaimer regarding vacancy information, external third-party links, and candidate fraud prevention."
        canonicalPath="/disclaimer"
      />

      <div className="text-center mb-10">
        <h1 className="text-3xl font-extrabold text-navy-800">
          Job Information Disclaimer
        </h1>
        <p className="text-xs text-slate-500 mt-1">
          Last Updated: November 2026
        </p>
      </div>

      <div className="bg-white p-6 sm:p-8 rounded-2xl border border-surface-border shadow-sm space-y-6 text-xs sm:text-sm text-slate-700 leading-relaxed">
        <div className="p-4 rounded-xl bg-amber-50 border border-amber-200 text-amber-900 space-y-1">
          <div className="flex items-center gap-2 font-bold text-amber-800">
            <AlertTriangle className="w-4 h-4 text-amber-600" />
            Crucial Warning for Job Seekers
          </div>
          <p>
            Careerping publishes job vacancies collected and verified from publicly available corporate careers sites, official advertisements, and verified company channels. Careerping is <strong>NOT</strong> an employer, recruitment agency, consultancy, or hiring intermediary.
          </p>
        </div>

        <section className="space-y-2">
          <h2 className="text-base font-bold text-navy-800">1. External Career Links</h2>
          <p>
            Careerping provides outbound links that direct users to external third-party websites owned and operated by respective hiring employers (e.g. Google, TCS, Resillion, ISRO, Razorpay). Careerping has no control over the content, recruitment policies, selection decisions, or terms of third-party platforms.
          </p>
        </section>

        <section className="space-y-2">
          <h2 className="text-base font-bold text-navy-800">2. No Guarantee of Selection or Employment</h2>
          <p>
            We do not promise, guarantee, or influence hiring decisions. Selection, interview calls, syllabus modifications, or vacancy cancellations are the sole discretion of the hiring company.
          </p>
        </section>

        <section className="space-y-2">
          <h2 className="text-base font-bold text-navy-800">3. Strict Anti-Fraud Policy</h2>
          <p>
            Neither Careerping nor any legitimate company will ever demand payment for interviews, job offers, or verification fees. If you encounter any individual impersonating Careerping or asking for money, report them to local cyber crime authorities immediately.
          </p>
        </section>
      </div>
    </div>
  );
};
