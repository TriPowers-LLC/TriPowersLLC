import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import jobsApi from '../../api/jobsApiClient';

const JobList = () => {
  const [jobs, setJobs] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    const load = async () => {
      setLoading(true);
      setError('');
      try {
        const res = await jobsApi.get('jobs');
        setJobs(res.data || []);
      } catch (e) {
        setError(e.message || 'Failed to load jobs');
      } finally {
        setLoading(false);
      }
    };
    load();
  }, []);

  if (loading) return <p>Loading jobs...</p>;
  if (error) return <p className="text-red-500">{error}</p>;

  return (
    <div className="space-y-4">
      <h1 className="text-3xl font-semibold">Open Roles</h1>
      {jobs.length === 0 ? (
        <p>No open positions at the moment.</p>
      ) : (
        <ul className="space-y-3">
          {jobs.map((job) => (
            <li key={job.id} className="border p-4 rounded">
              <div className="flex items-center justify-between">
                <div>
                  <h2 className="text-xl font-medium">{job.title}</h2>
                  <p className="text-sm text-gray-600">{job.location || 'Remote'}</p>
                </div>
                <Link className="text-blue-600 underline" to={`/apply/${job.id}`}>
                  View & Apply
                </Link>
              </div>
              <p className="mt-2 text-gray-700 line-clamp-2">{job.description}</p>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
};

export default JobList;
