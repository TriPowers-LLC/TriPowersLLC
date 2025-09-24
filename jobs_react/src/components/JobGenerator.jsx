import { useState } from 'react';
import axios from 'axios';

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
      Generate JSON with description, responsibilities, requirements, and salary range.
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
    await axios.post('/api/jobs', fullJob, {
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

          <h4 className="mt-4 font-semibold">Responsibilities</h4>
          <ul className="list-disc list-inside">
            {jobDraft.responsibilities.map((r,i) => <li key={i}>{r}</li>)}
          </ul>

          <h4 className="mt-4 font-semibold">Requirements</h4>
          <ul className="list-disc list-inside">
            {jobDraft.requirements.map((r,i) => <li key={i}>{r}</li>)}
          </ul>

          <p className="mt-4">
            <strong>Salary Range:</strong> {jobDraft.salaryRange}
          </p>
        </div>
      )}
    </div>
  );
}
