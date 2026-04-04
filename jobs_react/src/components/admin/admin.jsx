import { useEffect, useState } from "react";
import JobEditor from "./JobEditor";
import ApplicantsTable from "./ApplicantsTable";
import { getJobs, deleteJob, createJob, updateJob } from "../../api/adminApi";

const Admin = () => {
  const [jobs, setJobs] = useState([]);
  const [loadingJobs, setLoadingJobs] = useState(false);
  const [jobsError, setJobsError] = useState("");
  const [showGenerator, setShowGenerator] = useState(false);
  const [showApplicants, setShowApplicants] = useState(false);
  const [selectedJob, setSelectedJob] = useState(null);
  const [showEditor, setShowEditor] = useState(false);

  const fetchJobs = async () => {
    try {
      setLoadingJobs(true);
      setJobsError("");
      const res = await getJobs();
      setJobs(res.data || []);
    } catch (err) {
      console.error(err);
      setJobsError(err.message || "Failed to load jobs.");
    } finally {
      setLoadingJobs(false);
    }
  };

  useEffect(() => {
    fetchJobs();
  }, []);

  const handleCreateClick = () => {
    setSelectedJob(null);
    setShowEditor(true);
    setShowGenerator(false);
  };

  const handleEditClick = (job) => {
    setSelectedJob(job);
    setShowEditor(true);
    setShowGenerator(false);
  };

  const handleDeleteClick = async (jobId) => {
    const confirmed = window.confirm("Delete this job?");
    if (!confirmed) return;

    try {
      await deleteJob(jobId);
      await fetchJobs();
    } catch (err) {
      console.error(err);
      alert(err.message || "Failed to delete job.");
    }
  };

  const handleSaveJob = async (jobData) => {
  try {
    if (jobData.id) {
      await updateJob(jobData.id, jobData);
    } else {
      await createJob(jobData);
    }

    setShowEditor(false);
    setSelectedJob(null);
    await fetchJobs();
  } catch (err) {
    console.error(err);
    alert(err.message || "Failed to save job.");
  }
};

  return (
    <div className="p-6 space-y-6">
      <div className="flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
        <div>
          <h1 className="text-3xl font-bold">Admin Dashboard</h1>
          <p className="text-gray-600">Manage jobs and applicants.</p>
        </div>

        <div className="flex flex-wrap gap-2">
          <button
            type="button"
            onClick={handleCreateClick}
            className="px-4 py-2 bg-blue-600 text-white rounded"
          >
            New Job
          </button>

          <button
            type="button"
            onClick={() => setShowGenerator((prev) => !prev)}
            className="px-4 py-2 border rounded"
          >
            {showGenerator ? "Hide Job Generator" : "Use AI Generator"}
          </button>

          <button
            type="button"
            onClick={() => setShowApplicants((prev) => !prev)}
            className="px-4 py-2 border rounded"
          >
            {showApplicants ? "Hide Applicants" : "Show Applicants"}
          </button>
        </div>
      </div>

      {showGenerator && (
        <div className="border rounded-lg p-4 bg-white shadow-sm">
          <h2 className="text-xl font-semibold mb-3">Create a Job with AI</h2>
          <JobGenerator
            onNewJob={() => {
              fetchJobs();
              setShowGenerator(false);
            }}
          />
        </div>
      )}

      {showEditor && (
        <div className="border rounded-lg p-4 bg-white shadow-sm">
          <h2 className="text-xl font-semibold mb-3">
            {selectedJob ? "Edit Job" : "Create Job"}
          </h2>
          <JobEditor
            job={selectedJob}
            onSave={handleSaveJob}
            onCancel={() => {
              setShowEditor(false);
              setSelectedJob(null);
            }}
          />
        </div>
      )}

      <div className="border rounded-lg p-4 bg-white shadow-sm">
        <h2 className="text-xl font-semibold mb-4">Existing Jobs</h2>

        {loadingJobs && <p>Loading jobs...</p>}
        {jobsError && <p className="text-red-600">{jobsError}</p>}

        {!loadingJobs && !jobsError && jobs.length === 0 && (
          <p>No jobs found.</p>
        )}

        {!loadingJobs && !jobsError && jobs.length > 0 && (
          <ul className="space-y-4">
            {jobs.map((job) => (
              <li key={job.id} className="border rounded p-4">
                <div className="flex flex-col gap-3 md:flex-row md:justify-between">
                  <div className="flex-1">
                    <strong className="block text-lg">{job.title}</strong>
                    <span className="block text-sm text-gray-500 mb-2">
                      {job.location || "No location"} • {job.employmentType || "N/A"}
                    </span>
                    <p className="text-gray-700">
                      {job.description
                        ? `${job.description.slice(0, 140)}${job.description.length > 140 ? "…" : ""}`
                        : "No description available."}
                    </p>
                  </div>

                  <div className="flex gap-2 md:self-start">
                    <button
                      type="button"
                      onClick={() => handleEditClick(job)}
                      className="px-3 py-2 border rounded"
                    >
                      Edit
                    </button>
                    <button
                      type="button"
                      onClick={() => handleDeleteClick(job.id)}
                      className="px-3 py-2 bg-red-600 text-white rounded"
                    >
                      Delete
                    </button>
                  </div>
                </div>
              </li>
            ))}
          </ul>
        )}
      </div>

      {showApplicants && (
        <div className="border rounded-lg p-4 bg-white shadow-sm">
          <h2 className="text-xl font-semibold mb-4">Applicants</h2>
          <ApplicantsTable />
        </div>
      )}
    </div>
  );
};

export default Admin;