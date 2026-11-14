import React from 'react';
import { useParams } from 'react-router-dom';
import { JobListingsPage } from './JobListingsPage';
import { JobCategory } from '../types/job';

const SLUG_TO_CATEGORY: Record<string, { category: JobCategory; title: string; desc: string }> = {
  'it-software': {
    category: 'IT & Software',
    title: 'IT & Software Development Jobs in India',
    desc: 'Explore software engineering, developer, cloud, and QA opportunities across top Indian tech firms with direct application links.'
  },
  'cybersecurity': {
    category: 'Cybersecurity',
    title: 'Cybersecurity & SOC Analyst Openings in India',
    desc: 'Verified security operations center (SOC), penetration testing, cloud security, and cyber risk vacancies across India.'
  },
  'freshers': {
    category: 'Freshers',
    title: 'Fresher Jobs & Trainee Vacancies (2025 - 2026)',
    desc: 'Entry-level campus and off-campus recruitment drives for B.Tech, BCA, B.Sc, and MCA fresh graduates in India.'
  },
  'internships': {
    category: 'Internships',
    title: 'Paid Internships & Summer Trainee Programs',
    desc: 'Verified student internships in software development, cybersecurity, research, and engineering.'
  },
  'government-jobs': {
    category: 'Government Jobs',
    title: 'Central & State Government Job Vacancies (PSU / Bank)',
    desc: 'Official notifications for ISRO, DRDO, public sector undertakings, and government scientific recruitment.'
  },
  'work-from-home': {
    category: 'Work From Home',
    title: 'Remote & Work From Home (WFH) Jobs in India',
    desc: 'Fully remote and flexible work-from-home software engineering and tech support vacancies.'
  },
  'banking-finance': {
    category: 'Banking & Finance',
    title: 'Banking & Financial Technology Jobs in India',
    desc: 'IT systems, security, and developer roles in leading private and public sector banks.'
  },
  'core-engineering': {
    category: 'Core Engineering',
    title: 'Core Engineering & Electronics Trainee Openings',
    desc: 'Embedded systems, IoT, mechanical, and electrical engineering graduate vacancies.'
  }
};

export const CategoryPage: React.FC = () => {
  const { categorySlug } = useParams<{ categorySlug: string }>();
  const match = categorySlug ? SLUG_TO_CATEGORY[categorySlug.toLowerCase()] : undefined;

  if (!match) {
    return <JobListingsPage />;
  }

  return (
    <JobListingsPage
      forcedCategory={match.category}
      pageTitle={match.title}
      pageDescription={match.desc}
    />
  );
};
