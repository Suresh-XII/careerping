import React from 'react';
import { SEOHead } from '../components/SEOHead';

export const TermsPage: React.FC = () => {
  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
      <SEOHead
        title="Terms & Conditions - Careerping"
        description="Terms and conditions governing the use of Careerping job publishing platform."
        canonicalPath="/terms"
      />

      <div className="text-center mb-10">
        <h1 className="text-3xl font-extrabold text-navy-800">
          Terms and Conditions
        </h1>
        <p className="text-xs text-slate-500 mt-1">
          Last Revised: November 2026
        </p>
      </div>

      <div className="bg-white p-6 sm:p-8 rounded-2xl border border-surface-border shadow-sm space-y-6 text-xs sm:text-sm text-slate-700 leading-relaxed">
        <section className="space-y-2">
          <h2 className="text-base font-bold text-navy-800">1. Acceptance of Terms</h2>
          <p>
            By visiting or browsing Careerping (accessible at careerping.in or through associated subdomains), you agree to abide by these terms and conditions.
          </p>
        </section>

        <section className="space-y-2">
          <h2 className="text-base font-bold text-navy-800">2. Informational Purpose Only</h2>
          <p>
            The content provided on this website is for informational, career discovery, and educational purposes. We strive to maintain updated and verified links; however, employer vacancy deadlines and availability are subject to change without notice.
          </p>
        </section>

        <section className="space-y-2">
          <h2 className="text-base font-bold text-navy-800">3. Intellectual Property</h2>
          <p>
            All corporate trademarks, logos, and brand assets referenced on Careerping belong to their respective corporate owners. Their use on Careerping is strictly nominative to accurately identify the hiring organization.
          </p>
        </section>

        <section className="space-y-2">
          <h2 className="text-base font-bold text-navy-800">4. Limitation of Liability</h2>
          <p>
            Careerping shall not be held liable for any damages, losses, or missed opportunities arising from the use of or inability to access third-party recruitment sites.
          </p>
        </section>
      </div>
    </div>
  );
};
