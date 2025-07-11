// src/components/Careers.jsx
import { useState, useEffect } from 'react';
import axios from 'axios';
import ApplicantForm from './ApplicantForm';

export default function Careers() {
  const [jobs, setJobs] = useState([]);
  const [selectedJob, setSelectedJob] = useState(null);

  useEffect(() => {
    axios.get('/api/jobs')
      .then(res => setJobs(res.data))
      .catch(console.error);
  }, []);

  return (
    <div className="p-4 max-w-3xl mx-auto">
      <h1 className="text-3xl mb-6">Careers at TriPowers LLC</h1>
      {jobs.length === 0
        ? <p>No open positions at the moment.</p>
        : jobs.map(job => (
            <div key={job.id} className="mb-6 border p-4 rounded">
              <h2 className="text-xl font-semibold">{job.title}</h2>
              <p className="mt-2 whitespace-pre-wrap">{job.description}</p>
              <button
                onClick={() => setSelectedJob(job)}
                className="mt-3 bg-green-600 text-white px-4 py-2 rounded"
              >
                Apply Now
              </button>
            </div>
          ))
      }

      {selectedJob && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center">
          <div className="bg-white p-6 rounded shadow-xl max-w-lg w-full">
            <button
              onClick={() => setSelectedJob(null)}
              className="float-right text-gray-500"
            >
              ✕
            </button>
            <h3 className="text-2xl mb-4">Apply for: {selectedJob.title}</h3>
            <ApplicantForm jobId={selectedJob.id} />
          </div>
        </div>
      )}
    </div>
  );
}
