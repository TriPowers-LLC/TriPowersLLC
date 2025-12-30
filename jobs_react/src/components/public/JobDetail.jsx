import { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import jobsApi from '../../api/jobsApiClient';
import ApplicantForm from '../ApplicantForm';

const JobDetail = () => {
  const { id } = useParams();
  const [job, setJob] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [applied, setApplied] = useState(false);

  useEffect(() => {
    const load = async () => {
      setLoading(true);
      setError('');
      try {
        const res = await jobsApi.get(`jobs/${id}`);
        setJob(res.data);
      } catch (e) {
        setError(e.message || 'Failed to load job');
      } finally {
        setLoading(false);
      }
    };
    load();
  }, [id]);

  if (loading) return <p>Loading job...</p>;
  if (error) return <p className="text-red-500">{error}</p>;
  if (!job) return <p>Job not found.</p>;

  return (
    <div className="space-y-4">
      <h1 className="text-3xl font-semibold">{job.title}</h1>
      <p className="text-gray-700 whitespace-pre-wrap">{job.description}</p>
      <p className="text-sm text-gray-600">{job.location || 'Remote'}</p>

      {applied ? (
        <p className="text-green-600">Application submitted. Thank you!</p>
      ) : (
        <ApplicantForm
          jobId={job.id}
          onSubmitted={() => setApplied(true)}
        />
      )}
    </div>
  );
};

export default JobDetail;
