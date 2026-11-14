import React from 'react';
import { SEOHead } from '../components/SEOHead';

export const PrivacyPolicyPage: React.FC = () => {
  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
      <SEOHead
        title="Privacy Policy - Careerping"
        description="Careerping privacy policy detailing zero candidate data collection and visitor privacy rights."
        canonicalPath="/privacy-policy"
      />

      <div className="text-center mb-10">
        <h1 className="text-3xl font-extrabold text-navy-800">
          Privacy Policy
        </h1>
        <p className="text-xs text-slate-500 mt-1">
          Effective Date: November 14, 2026
        </p>
      </div>

      <div className="bg-white p-6 sm:p-8 rounded-2xl border border-surface-border shadow-sm space-y-6 text-xs sm:text-sm text-slate-700 leading-relaxed">
        <section className="space-y-2">
          <h2 className="text-base font-bold text-navy-800">1. Information We Do NOT Collect</h2>
          <p>
            Careerping is designed with a strict privacy-first architecture. <strong>We do not collect candidate resumes, curriculum vitae, telephone numbers, Aadhaar numbers, educational marks, or employment histories.</strong>
          </p>
        </section>

        <section className="space-y-2">
          <h2 className="text-base font-bold text-navy-800">2. Cookies and Analytics</h2>
          <p>
            Careerping may use minimal, privacy-friendly server logs or local browser cache to preserve your search preferences. We do not sell, trade, or monetize visitor data to third-party ad brokers.
          </p>
        </section>

        <section className="space-y-2">
          <h2 className="text-base font-bold text-navy-800">3. Outbound Links to Third-Party Career Portals</h2>
          <p>
            When you click "APPLY ON OFFICIAL WEBSITE", you leave Careerping and land on the employer's portal. Please review the destination company's respective privacy policy regarding how they store your resume and application data.
          </p>
        </section>

        <section className="space-y-2">
          <h2 className="text-base font-bold text-navy-800">4. Contacting Us</h2>
          <p>
            For questions about this policy, please reach out via our official contact page.
          </p>
        </section>
      </div>
    </div>
  );
};
