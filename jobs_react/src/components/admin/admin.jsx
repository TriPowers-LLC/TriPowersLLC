import { useEffect, useState } from "react";
import JobGenerator from "../JobGenerator";
import apiClient from "../../lib/apiClient";

const Admin = () => {
  const [jobs, setJobs] = useState([]);
  const [loadingJobs, setLoadingJobs] = useState(false);
  const [jobsError, setJobsError] = useState("");
  const [showGenerator, setShowGenerator] = useState(false);

  const fetchJobs = async () => {
    try {
      setLoadingJobs(true);
      setJobsError("");
      const res = await apiClient.get("/api/public/jobs");
      setJobs(res.data || []);
    } catch (err) {
      console.error(err);
      setJobsError(
        err?.response?.data?.message || "Failed to load jobs."
      );
    } finally {
      setLoadingJobs(false);
    }
  };

  useEffect(() => {
    fetchJobs();
  }, []);

  return (
    <div className="p-6 space-y-6">
      <div className="flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
        <div>
          <h1 className="text-3xl font-bold">Admin Dashboard</h1>
          <p className="text-gray-600">
            Manage jobs.
          </p>
        </div>

        <div className="flex gap-2">
          <button
            type="button"
            onClick={() => setShowGenerator((prev) => !prev)}
            className="px-4 py-2 border rounded"
          >
            {showGenerator ? "Hide Job Generator" : "Create Job"}
          </button>
        </div>
      </div>

      {showGenerator && (
        <div className="border rounded-lg p-4 bg-white shadow-sm">
          <h2 className="text-xl font-semibold mb-3">Create a Job</h2>
          <JobGenerator
            onNewJob={() => {
              fetchJobs();
              setShowGenerator(false);
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
                <strong className="block text-lg">{job.title}</strong>
                <span className="block text-sm text-gray-500 mb-2">
                  {job.location || "No location"} • {job.employmentType || "N/A"}
                </span>
                <p className="text-gray-700">
                  {job.description
                    ? `${job.description.slice(0, 140)}${
                        job.description.length > 140 ? "…" : ""
                      }`
                    : "No description available."}
                </p>
              </li>
            ))}
          </ul>
        )}
      </div>
    </div>
  );
};

export default Admin;