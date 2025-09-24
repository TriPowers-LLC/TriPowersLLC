import { useState } from 'react';
import apiClient from '../lib/apiClient';

function ensureStringArray(value) {
  if (Array.isArray(value)) {
    return value.map(item => (typeof item === 'string' ? item.trim() : '')).filter(Boolean);
  }

  if (typeof value === 'string') {
    return value
      .split(/\r?\n|;|\.|\u2022|\-/)
      .map(part => part.trim())
      .filter(Boolean);
  }

  return [];
}

function parseSalaryRange(rangeText) {
  if (!rangeText || typeof rangeText !== 'string') {
    return { min: null, max: null };
  }

  const normalized = rangeText.replace(/to/gi, '-');
  const matches = normalized.match(/\$?\d[\d,]*(?:\.\d+)?\s*[kKmMbB]?/g);

  if (!matches) {
    return { min: null, max: null };
  }

  const values = matches
    .map(token => {
      const magnitude = token.match(/[kKmMbB]/);
      let multiplier = 1;
      if (magnitude) {
        switch (magnitude[0].toLowerCase()) {
          case 'k':
            multiplier = 1_000;
            break;
          case 'm':
            multiplier = 1_000_000;
            break;
          case 'b':
            multiplier = 1_000_000_000;
            break;
          default:
            multiplier = 1;
        }
      }

      const numericPortion = token.replace(/[^0-9.]/g, '');
      const baseNumber = Number.parseFloat(numericPortion);

      if (Number.isNaN(baseNumber)) {
        return null;
      }

      return Math.round(baseNumber * multiplier);
    })
    .filter(value => typeof value === 'number' && !Number.isNaN(value));

  if (!values.length) {
    return { min: null, max: null };
  }

  const [first, second] = values;
  const min = first;
  const max = second ?? first;

  return { min, max };
}

function coerceNumericValue(value) {
  if (typeof value === 'number' && Number.isFinite(value)) {
    return Math.round(value);
  }

  if (typeof value === 'string') {
    const cleaned = value.replace(/[^0-9.]/g, '');
    if (!cleaned) {
      return null;
    }

    const parsed = Number.parseFloat(cleaned);
    if (Number.isNaN(parsed)) {
      return null;
    }

    return Math.round(parsed);
  }

  return null;
}

export default function JobGenerator({ onNewJob }) {
  const [title, setTitle]               = useState('');
  const [location, setLocation]         = useState('');
  const [prompt, setPrompt]             = useState('');
  const [jobDraft, setJobDraft]         = useState(null);
  const [error, setError]               = useState('');
  const [isGenerating, setIsGenerating] = useState(false);

  const handleGenerate = async () => {
    setError('');
    setJobDraft(null);
    setIsGenerating(true);


    try {
      // Build a single prompt string combining title, location, and any extra context
      const fullPrompt = `
      Role: ${title}
      Location: ${location}
      Context: ${prompt || 'No additional context provided.'}
      Generate JSON with description, responsibilities, requirements, employmentType, vendorName, salaryRange.

          Requirements:
          - Output strictly valid JSON.
          - salaryRange must clearly indicate the minimum and maximum values.
      `;   
      const aiRes = await useActionState.post(
        '/api/generate-job-description',
        { prompt: fullPrompt }
      );

      if (aiRes.status !== 200) {
        setError('Failed to generate job description.');
        return;
      }
      const { description, responsibilities, requirements, salaryRangeMin, salaryRangeMax } = aiRes.data || {};
      if (!description || !Array.isArray(responsibilities) || !Array.isArray(requirements)) {
        setError('Incomplete job data received from AI.');
        return;
      }

      // Combine user + AI content
      const fullJob = {
        title,
        location,
        description,
        responsibilities  : responsibilities.join('; '),
        requirements      : requirements.join('; '),
        salaryRangeMin    : salaryRangeMin ?? null,
        salaryRangeMax    : salaryRangeMax ?? null
      };
      setJobDraft({
        title,
        location,
        description,
        responsibilities  : responsibilities.join('; '),
        requirements      : requirements.join('; '),
        salaryRange: salaryRangeMin != null && salaryRangeMax != null
          ? `${salaryRangeMin} - ${salaryRangeMax}`
          : salaryRangeMin != null
          ? `${salaryRangeMin} +`
          : salaryRangeMax != null
            ? `Up to ${salaryRangeMax}`
            : 'Not specified'
      });

      // 4) persist to your backend
    await apiClient.post('jobs', fullJob, {
      headers: { Authorization: `Bearer ${localStorage.getItem('token')}` }
    });

    onNewJob();

  } catch (e) {
    console.error('JobDescription error payload:', e.response?.data);
    setError(
      e.response?.data?.error ||
      e.message ||
      'Failed to generate job info.'
    );
  } finally {
    setIsGenerating(false);
  }
};

  return (
    <div className="p-4 max-w-xl mx-auto space-y-4">
      <h2 className="text-xl font-semibold">AI Job Description Generator</h2>

      {/* User-entered title */}
      <input
        type="text"
        className="w-full border p-2 rounded"
        placeholder="Job Title (e.g. Front-End Engineer)"
        value={title}
        onChange={e => setTitle(e.target.value)}
      />

      {/* User-entered location */}
      <input
        type="text"
        className="w-full border p-2 rounded"
        placeholder="Location (e.g. Austin, TX)"
        value={location}
        onChange={e => setLocation(e.target.value)}
      />

      {/* Optional extra prompt */}
      <textarea
        className="w-full border p-2 rounded"
        placeholder="Additional context for AI (e.g. company culture, seniority)…"
        rows={2}
        value={prompt}
        onChange={e => setPrompt(e.target.value)}
      />

      <button
        className="bg-blue-600 text-white px-4 py-2 rounded disabled:opacity-50"
        onClick={handleGenerate}
        disabled={!title || !location || isGenerating}
      >
        {isGenerating ? 'Generating…' : 'Generate & Save'}
      </button>

      {error && <p className="text-red-500">{error}</p>}

      {jobDraft && (
        <div className="bg-gray-50 p-4 rounded border">
          <h3 className="text-lg font-bold">{jobDraft.title}</h3>
          <p className="italic text-sm">{jobDraft.location}</p>
          <p className="mt-2">{jobDraft.description}</p>
          <p className="mt-2 text-sm">
            <strong>Employment Type:</strong> {jobDraft.employmentType}
          </p>
          <p className="text-sm">
            <strong>Vendor:</strong> {jobDraft.vendorName}
          </p>

          <h4 className="mt-4 font-semibold">Responsibilities</h4>
          <ul className="list-disc list-inside">
            {jobDraft.responsibilities.map((r,i) => <li key={i}>{r}</li>)}
          </ul>

          <h4 className="mt-4 font-semibold">Requirements</h4>
          <ul className="list-disc list-inside">
            {jobDraft.requirements.map((r,i) => <li key={i}>{r}</li>)}
          </ul>

          <p className="mt-4">
            <strong>Salary Range:</strong> {jobDraft.salaryRange || `${jobDraft.salaryRangeMin} - ${jobDraft.salaryRangeMax}`}
          </p>
        </div>
      )}
    </div>
  );
}
