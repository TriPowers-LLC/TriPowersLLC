// src/components/Admin.jsx
import { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import ApplicantsTable from './admin/ApplicantsTable';
import JobEditor from './admin/JobEditor';
import JobsTable from './admin/JobsTable';
import {
  createJobThunk,
  deleteJobThunk,
  fetchJobs,
  updateJobThunk,
} from '../slices/jobsSlice';
import JobGenerator from './JobGenerator';
import { fetchApplicants } from '../slices/applicantsSlice';

const Admin = () => {
  const dispatch = useDispatch();
  const { list: jobs } = useSelector((state) => state.jobs);
  const [selectedJob, setSelectedJob] = useState(null);

  useEffect(() => {
    dispatch(fetchJobs());
    dispatch(fetchApplicants());
  }, [dispatch]);

  const handleSave = async (job) => {
    if (job.id) {
      await dispatch(updateJobThunk({ id: job.id, data: job }));
    } else {
      await dispatch(createJobThunk(job));
    }
    setSelectedJob(null);
  };

  const handleDelete = async (id) => {
    await dispatch(deleteJobThunk(id));
  };

  return (
    <div className="p-4 space-y-6">
      <h1 className="text-2xl mb-4">Admin Dashboard</h1>

      <div className="grid md:grid-cols-2 gap-4">
        <JobEditor job={selectedJob} onSave={handleSave} onCancel={() => setSelectedJob(null)} />
        <JobGenerator onNewJob={() => dispatch(fetchJobs())} />
      </div>

      <div className="space-y-3">
        <h2 className="text-xl">Jobs</h2>
        <JobsTable
          jobs={jobs}
          onEdit={(job) => setSelectedJob(job)}
          onDelete={handleDelete}
        />
      </div>

      <div className="space-y-3">
        <h2 className="text-xl">Applicants</h2>
        <ApplicantsTable />
      </div>
    </div>
  );
};

export default Admin;
