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

    // We give the AI a prompt that references the user’s title & location
    const systemMsg = 'You are an assistant that outputs valid JSON only.';
    const userMsg   = `
Generate the following fields for a job:
- description (string)
- responsibilities (array of strings)
- requirements (array of strings)
- salaryRange (string)

The role is "${title}" located in "${location}".  
Keep tone professional and concise.  
Return ONLY JSON.
`;

    try {
      const aiRes = await axios.post(
        '/api/jobdescription',
        { model: 'gpt-4.1',
          messages: [
            { role: 'system', content: systemMsg },
            { role: 'user',   content: userMsg }
          ]
        }
      );

      // Parse the AI’s JSON
      const raw = aiRes.data.choices?.[0]?.message?.content?.trim();
      let parsed;
      try {
        parsed = JSON.parse(raw);
      } catch {
        throw new Error('AI did not return valid JSON:\n' + raw);
      }

      // Combine user + AI content
      const fullJob = {
        title,
        location,
        description       : parsed.description,
        responsibilities  : parsed.responsibilities,
        requirements      : parsed.requirements,
        salaryRange       : parsed.salaryRange
      };
      setJobDraft(fullJob);

      // Persist to backend
      await axios.post(
        '/api/jobs',
        fullJob,
        { headers: { Authorization: `Bearer ${localStorage.getItem('token')}` } }
      );

      onNewJob();
    } catch (e) {
      console.error(e);
      console.error("JobDescription 502 body:", e.response?.data);

      if (e.response?.status === 429) {
        const headers = e.response.headers;
        console.group('Rate Limit Info');
        console.log('Retry-After:', headers['retry-after']);
        console.log('Limit Requests:', headers['x-ratelimit-limit-requests']);
        console.log('Remaining Requests:', headers['x-ratelimit-remaining-requests']);
        console.groupEnd();
        const { retryAfter, error: msg } = e.response.data;
        const wait = retryAfter ?? 10;          // default to 10s if null
        console.log('Rate limit error:', msg, 'retryAfter:', retryAfter);
        // Use retryAfter from JSON
        setError(msg);
        console.warn(`Rate limited—retrying in ${wait}s…`);
        setTimeout(handleGenerate, wait * 1000);
        return;  // bail out so we don't run the setError below again
      } 
      setError(
        e.response?.data?.error ||
        e.message ||
        'Failed to generate job info.'
      );
} finally {
    setIsGenerating(false);
    }
  }

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
