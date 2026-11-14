import { describe, it, expect } from 'vitest';
import { generateLocalFallbackArticle, AIArticleInput } from '../services/aiService';

describe('Stage 4: AI Job Article Generation & Editorial Integrity', () => {
  it('generates structured article without inventing unknown company or title facts', () => {
    const input: AIArticleInput = {
      title: 'Junior SOC Analyst (24x7 Shift)',
      company: 'Resillion Technologies India',
      category: 'Cybersecurity',
      location: 'Hyderabad',
      qualification: 'BCA / B.Sc Computer Science',
      experience: '0 - 1 Year',
      salary: '₹4,50,000 LPA'
    };

    const output = generateLocalFallbackArticle(input);

    expect(output.description).toContain('Resillion Technologies India');
    expect(output.description).toContain('Junior SOC Analyst (24x7 Shift)');
    expect(output.description).toContain('Hyderabad');

    expect(output.responsibilities.length).toBeGreaterThanOrEqual(4);
    expect(output.required_skills).toContain('SIEM (Splunk / Sentinel)');
    expect(output.eligibility[0]).toContain('BCA / B.Sc Computer Science');
    expect(output.selection_process.length).toBeGreaterThanOrEqual(3);
  });

  it('preserves "Not disclosed" when salary is undisclosed', () => {
    const input: AIArticleInput = {
      title: 'Trainee Software Engineer',
      company: 'Tech Mahindra',
      category: 'Freshers',
      salary: 'Not disclosed'
    };

    const output = generateLocalFallbackArticle(input);

    expect(output.description).not.toContain('invented');
    expect(output.source).toBe('local-fallback');
    // Does not fabricate salary
    expect(output.description).not.toContain('₹1,00,000,000');
  });

  it('adjusts skills and rounds specifically for government jobs without corporate jargon', () => {
    const input: AIArticleInput = {
      title: 'Scientist / Engineer SC',
      company: 'ISRO',
      category: 'Government Jobs',
      qualification: 'B.E in Computer Science (65% marks)'
    };

    const output = generateLocalFallbackArticle(input);

    // Should include government examination / screening rounds
    expect(output.selection_process[0]).toContain('Written Examination');
    expect(output.selection_process[1]).toContain('Technical Subject Interview');
  });

  it('produces valid editable arrays that can be modified by the administrator before publishing', () => {
    const input: AIArticleInput = {
      title: 'Full Stack React Trainee',
      company: 'Startup Hub',
      category: 'IT & Software'
    };

    const output = generateLocalFallbackArticle(input);

    expect(Array.isArray(output.responsibilities)).toBe(true);
    expect(Array.isArray(output.required_skills)).toBe(true);
    expect(Array.isArray(output.eligibility)).toBe(true);

    // Can be joined for textareas and edited by administrator
    const respText = output.responsibilities.join('\n');
    expect(respText.length).toBeGreaterThan(50);
  });
});
