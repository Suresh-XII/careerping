import React from 'react';
import { FileCheck, ShieldAlert } from 'lucide-react';
import { SEOHead } from '../components/SEOHead';

export const CareerGuidancePage: React.FC = () => {
  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
      <SEOHead
        title="Career Guidance & Interview Preparation - Careerping"
        description="Comprehensive roadmaps for SOC analysts, software engineers, ATS resume optimization, and campus recruitment tests in India."
        canonicalPath="/guidance"
      />

      <div className="text-center mb-12">
        <span className="text-xs font-bold text-teal-600 uppercase tracking-wider block mb-1">
          Indian Tech Job Market Insights
        </span>
        <h1 className="text-3xl font-extrabold text-navy-800">
          Career Guidance & Exam Preparation
        </h1>
        <p className="text-slate-500 text-sm max-w-xl mx-auto mt-2">
          Curated guides to help freshers and experienced candidates navigate recruitment in top Indian IT & Cyber firms.
        </p>
      </div>

      <div className="space-y-8">
        <article className="bg-white p-6 sm:p-8 rounded-2xl border border-surface-border shadow-sm space-y-4">
          <div className="flex items-center gap-3 text-teal-600">
            <ShieldAlert className="w-6 h-6" />
            <h2 className="text-xl font-bold text-navy-800">
              1. L1 SOC Analyst Interview Roadmap (2026 Edition)
            </h2>
          </div>
          <p className="text-sm text-slate-600 leading-relaxed">
            Entering security operations centers in India requires a blend of networking fundamentals, protocol decoding, and real log investigation skills.
          </p>
          <div className="bg-slate-50 p-4 rounded-xl space-y-2 text-xs text-slate-700">
            <span className="font-bold text-slate-800 block">Key topics asked in technical rounds:</span>
            <ul className="list-disc list-inside space-y-1">
              <li>Three-way TCP handshake (SYN, SYN-ACK, ACK) and flags (FIN, RST, PSH, URG).</li>
              <li>Difference between IDS, IPS, Firewall, and Next-Gen Firewall (NGFW).</li>
              <li>Detecting brute-force attacks via Event ID 4625 (failed login) and 4624 (successful login).</li>
              <li>Analyzing SQL injection, XSS, and CSRF attack patterns in web server access logs.</li>
            </ul>
          </div>
        </article>

        <article className="bg-white p-6 sm:p-8 rounded-2xl border border-surface-border shadow-sm space-y-4">
          <div className="flex items-center gap-3 text-blue-600">
            <FileCheck className="w-6 h-6" />
            <h2 className="text-xl font-bold text-navy-800">
              2. ATS-Friendly Resume Blueprint for Freshers
            </h2>
          </div>
          <p className="text-sm text-slate-600 leading-relaxed">
            Corporate portals filter incoming applications through automated keyword parsing algorithms. Follow these standards:
          </p>
          <div className="bg-slate-50 p-4 rounded-xl space-y-2 text-xs text-slate-700">
            <ul className="list-disc list-inside space-y-1">
              <li>Use a single-column clean format (no multi-column tables or Canva icons that confuse OCR).</li>
              <li>Explicitly list tech stack in both title and bullet points (e.g. "React, Node.js, PostgreSQL").</li>
              <li>Highlight measurable achievements rather than generic duties (e.g. "Reduced API latency by 35%").</li>
            </ul>
          </div>
        </article>
      </div>
    </div>
  );
};
