// src/components/Admin.jsx
import { useState, useEffect } from 'react';
import JobGenerator from '../../components/JobGenerator';
import apiClient from '../../lib/apiClient';

const Admin = () => {
  const [jobs, setJobs] = useState([]);

  const fetchJobs = async () => {
    const res = await apiClient.get('jobs', {
      headers: { Authorization: `Bearer ${localStorage.getItem('token')}` }
    });
    setJobs(res.data);
  };

  useEffect(() => {
    fetchJobs();
  }, []);
  
  return (
    <div className="p-4">
      <h1 className="text-2xl mb-4">Admin Dashboard</h1>
      <JobGenerator onNewJob={fetchJobs} />
      <h2 className="mt-6 text-xl">Existing Jobs</h2>
      <ul className="list-disc pl-6">
        {jobs.map(job => (
          <li key={job.id}>
            <strong>{job.title}</strong><br />
            <em>{job.description.slice(0, 100)}…</em>
          </li>
        ))}
      </ul>
    </div>
  );
}

export default Admin;