import React from 'react';
import { Routes, Route } from 'react-router-dom';
import { Navbar } from './components/Navbar';
import { Footer } from './components/Footer';
import { ScrollToTop } from './components/ScrollToTop';
import { HomePage } from './pages/HomePage';
import { JobDetailPage } from './pages/JobDetailPage';
import { JobListingsPage } from './pages/JobListingsPage';
import { CategoryPage } from './pages/CategoryPage';
import { AdminDashboard } from './pages/AdminDashboard';
import { AboutPage } from './pages/AboutPage';
import { ContactPage } from './pages/ContactPage';
import { DisclaimerPage } from './pages/DisclaimerPage';
import { PrivacyPolicyPage } from './pages/PrivacyPolicyPage';
import { TermsPage } from './pages/TermsPage';
import { CareerGuidancePage } from './pages/CareerGuidancePage';

export const App: React.FC = () => {
  return (
    <div className="flex flex-col min-h-screen">
      <ScrollToTop />
      <Navbar />
      <main className="flex-1">
        <Routes>
          {/* Public Home */}
          <Route path="/" element={<HomePage />} />

          {/* Job Listings & Categories */}
          <Route path="/latest-jobs" element={<JobListingsPage />} />
          <Route path="/category/:categorySlug" element={<CategoryPage />} />

          {/* Individual Job Pages: Supports both /:jobSlug (clean root custom domain) and /jobs/:jobSlug */}
          <Route path="/jobs/:jobSlug" element={<JobDetailPage />} />
          
          {/* Informational & Legal Pages */}
          <Route path="/about" element={<AboutPage />} />
          <Route path="/contact" element={<ContactPage />} />
          <Route path="/disclaimer" element={<DisclaimerPage />} />
          <Route path="/anti-fraud" element={<DisclaimerPage />} />
          <Route path="/privacy-policy" element={<PrivacyPolicyPage />} />
          <Route path="/terms" element={<TermsPage />} />
          <Route path="/guidance" element={<CareerGuidancePage />} />

          {/* Private Admin Dashboard */}
          <Route path="/admin" element={<AdminDashboard />} />

          {/* Clean root job route: /:jobSlug (e.g. /resillion-soc-analyst) */}
          <Route path="/:jobSlug" element={<JobDetailPage />} />
        </Routes>
      </main>
      <Footer />
    </div>
  );
};

export default App;
