import { useEffect, useMemo, useState } from "react";
import JobEditor from "./JobEditor";
import ApplicantsTable from "./ApplicantsTable";
import {
  getAdminJobs,
  deleteJob,
  createJob,
  updateJob,
} from "../../api/adminApi";
import { useSelector } from "react-redux";
import { Navigate } from "react-router-dom";

const TABS = {
  OVERVIEW: "overview",
  JOBS: "jobs",
  APPLICANTS: "applicants",
};

const getStatusClasses = (status) => {
  switch ((status || "active").toLowerCase()) {
    case "draft":
      return "bg-yellow-100 text-yellow-800";
    case "closed":
      return "bg-gray-200 text-gray-700";
    case "active":
    default:
      return "bg-green-100 text-green-700";
  }
};

const Admin = () => {
  const role = useSelector((state) => state.auth.role);

  const [activeTab, setActiveTab] = useState(TABS.OVERVIEW);
  const [jobs, setJobs] = useState([]);
  const [loadingJobs, setLoadingJobs] = useState(false);
  const [jobsError, setJobsError] = useState("");
  const [selectedJob, setSelectedJob] = useState(null);
  const [showEditor, setShowEditor] = useState(false);

  if (role !== "admin") {
    return <Navigate to="/login" replace />;
  }

  const fetchJobs = async () => {
    try {
      setLoadingJobs(true);
      setJobsError("");
      const res = await getAdminJobs();
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
    setActiveTab(TABS.JOBS);
  };

  const handleEditClick = (job) => {
    setSelectedJob(job);
    setShowEditor(true);
    setActiveTab(TABS.JOBS);
  };

  const handleDeleteClick = async (jobId) => {
    const confirmed = window.confirm("Delete this job?");
    if (!confirmed) return;

    try {
      await deleteJob(jobId);
      await fetchJobs();
      alert("Job deleted successfully.");
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

  const metrics = useMemo(() => {
    const totalJobs = jobs.length;
    const activeJobs = jobs.filter(
      (job) => (job.status || "active").toLowerCase() === "active"
    ).length;
    const draftJobs = jobs.filter(
      (job) => (job.status || "").toLowerCase() === "draft"
    ).length;
    const closedJobs = jobs.filter(
      (job) => (job.status || "").toLowerCase() === "closed"
    ).length;

    const totalApplicants = jobs.reduce(
      (sum, job) => sum + (job.applicantsCount || 0),
      0
    );

    return {
      totalJobs,
      activeJobs,
      draftJobs,
      closedJobs,
      totalApplicants,
    };
  }, [jobs]);

  return (
    <div className="min-h-screen bg-slate-50 p-6">
      <div className="mx-auto max-w-7xl space-y-6">
        <div className="rounded-2xl bg-white p-6 shadow-sm border">
          <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
            <div>
              <h1 className="text-3xl font-bold text-slate-900">Admin Dashboard</h1>
              <p className="mt-1 text-slate-600">
                Manage jobs, review applicants, and track hiring activity.
              </p>
            </div>

            <div className="flex flex-wrap gap-2">
              <button
                type="button"
                onClick={handleCreateClick}
                className="rounded-lg bg-blue-600 px-4 py-2 text-white hover:bg-blue-700"
              >
                Create Job
              </button>
              <button
                type="button"
                onClick={() => {
                  setActiveTab(TABS.APPLICANTS);
                  setSelectedJob(null);
                }}
                className="rounded-lg border px-4 py-2 text-slate-700 hover:bg-slate-100"
              >
                View Applicants
              </button>
            </div>
          </div>

          <div className="mt-6 flex flex-wrap gap-2">
            <button
              type="button"
              onClick={() => setActiveTab(TABS.OVERVIEW)}
              className={`rounded-lg px-4 py-2 text-sm font-medium ${
                activeTab === TABS.OVERVIEW
                  ? "bg-slate-900 text-white"
                  : "border bg-white text-slate-700 hover:bg-slate-100"
              }`}
            >
              Overview
            </button>
            <button
              type="button"
              onClick={() => setActiveTab(TABS.JOBS)}
              className={`rounded-lg px-4 py-2 text-sm font-medium ${
                activeTab === TABS.JOBS
                  ? "bg-slate-900 text-white"
                  : "border bg-white text-slate-700 hover:bg-slate-100"
              }`}
            >
              Jobs
            </button>
            <button
              type="button"
              onClick={() => setActiveTab(TABS.APPLICANTS)}
              className={`rounded-lg px-4 py-2 text-sm font-medium ${
                activeTab === TABS.APPLICANTS
                  ? "bg-slate-900 text-white"
                  : "border bg-white text-slate-700 hover:bg-slate-100"
              }`}
            >
              Applicants
            </button>
          </div>
        </div>

        {jobsError && (
          <div className="rounded-xl border border-red-200 bg-red-50 p-4 text-red-700">
            {jobsError}
          </div>
        )}

        {activeTab === TABS.OVERVIEW && (
          <>
            <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-5">
              <div className="rounded-2xl border bg-white p-5 shadow-sm">
                <p className="text-sm text-slate-500">Total Jobs</p>
                <p className="mt-2 text-3xl font-bold text-slate-900">{metrics.totalJobs}</p>
              </div>

              <div className="rounded-2xl border bg-white p-5 shadow-sm">
                <p className="text-sm text-slate-500">Active Jobs</p>
                <p className="mt-2 text-3xl font-bold text-green-700">{metrics.activeJobs}</p>
              </div>

              <div className="rounded-2xl border bg-white p-5 shadow-sm">
                <p className="text-sm text-slate-500">Draft Jobs</p>
                <p className="mt-2 text-3xl font-bold text-yellow-700">{metrics.draftJobs}</p>
              </div>

              <div className="rounded-2xl border bg-white p-5 shadow-sm">
                <p className="text-sm text-slate-500">Closed Jobs</p>
                <p className="mt-2 text-3xl font-bold text-slate-700">{metrics.closedJobs}</p>
              </div>

              <div className="rounded-2xl border bg-white p-5 shadow-sm">
                <p className="text-sm text-slate-500">Total Applicants</p>
                <p className="mt-2 text-3xl font-bold text-blue-700">{metrics.totalApplicants}</p>
              </div>
            </div>

            <div className="grid gap-6 xl:grid-cols-2">
              <div className="rounded-2xl border bg-white p-6 shadow-sm">
                <h2 className="text-xl font-semibold text-slate-900">Jobs Snapshot</h2>
                <div className="mt-4 space-y-4">
                  {loadingJobs && <p className="text-slate-500">Loading jobs...</p>}

                  {!loadingJobs && jobs.length === 0 && (
                    <p className="text-slate-500">No jobs found.</p>
                  )}

                  {!loadingJobs &&
                    jobs.slice(0, 5).map((job) => (
                      <div
                        key={job.id}
                        className="flex items-center justify-between rounded-xl border p-4"
                      >
                        <div>
                          <p className="font-semibold text-slate-900">{job.title}</p>
                          <p className="text-sm text-slate-500">
                            {job.location || "No location"} •{" "}
                            {job.employmentType || "N/A"}
                          </p>
                        </div>
                        <div className="text-right">
                          <span
                            className={`inline-flex rounded-full px-3 py-1 text-xs font-medium ${getStatusClasses(
                              job.status
                            )}`}
                          >
                            {job.status || "Active"}
                          </span>
                          <p className="mt-2 text-sm text-slate-500">
                            {job.applicantsCount || 0} applicants
                          </p>
                        </div>
                      </div>
                    ))}
                </div>
              </div>

              <div className="rounded-2xl border bg-white p-6 shadow-sm">
                <h2 className="text-xl font-semibold text-slate-900">Hiring Activity</h2>
                <div className="mt-4 space-y-4">
                  {jobs
                    .slice()
                    .sort((a, b) => (b.applicantsCount || 0) - (a.applicantsCount || 0))
                    .slice(0, 5)
                    .map((job) => (
                      <div key={job.id} className="rounded-xl border p-4">
                        <div className="flex items-center justify-between">
                          <p className="font-semibold text-slate-900">{job.title}</p>
                          <p className="text-sm font-medium text-blue-700">
                            {job.applicantsCount || 0} applicants
                          </p>
                        </div>
                        <div className="mt-3 h-2 rounded-full bg-slate-100">
                          <div
                            className="h-2 rounded-full bg-blue-600"
                            style={{
                              width: `${
                                metrics.totalApplicants
                                  ? Math.max(
                                      8,
                                      ((job.applicantsCount || 0) / metrics.totalApplicants) * 100
                                    )
                                  : 0
                              }%`,
                            }}
                          />
                        </div>
                      </div>
                    ))}

                  {!loadingJobs && jobs.length === 0 && (
                    <p className="text-slate-500">No applicant data yet.</p>
                  )}
                </div>
              </div>
            </div>
          </>
        )}

        {activeTab === TABS.JOBS && (
          <div className="space-y-6">
            {showEditor && (
              <div className="rounded-2xl border bg-white p-6 shadow-sm">
                <h2 className="mb-4 text-xl font-semibold text-slate-900">
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

            <div className="rounded-2xl border bg-white p-6 shadow-sm">
              <div className="mb-4 flex items-center justify-between">
                <h2 className="text-xl font-semibold text-slate-900">All Jobs</h2>
                <button
                  type="button"
                  onClick={handleCreateClick}
                  className="rounded-lg bg-blue-600 px-4 py-2 text-white hover:bg-blue-700"
                >
                  New Job
                </button>
              </div>

              {loadingJobs && <p className="text-slate-500">Loading jobs...</p>}

              {!loadingJobs && jobs.length === 0 && (
                <p className="text-slate-500">No jobs found.</p>
              )}

              {!loadingJobs && jobs.length > 0 && (
                <div className="grid gap-4">
                  {jobs.map((job) => (
                    <div
                      key={job.id}
                      className="rounded-2xl border p-5 transition hover:shadow-sm"
                    >
                      <div className="flex flex-col gap-4 lg:flex-row lg:items-start lg:justify-between">
                        <div className="flex-1">
                          <div className="flex flex-wrap items-center gap-2">
                            <h3 className="text-lg font-semibold text-slate-900">{job.title}</h3>
                            <span
                              className={`inline-flex rounded-full px-3 py-1 text-xs font-medium ${getStatusClasses(
                                job.status
                              )}`}
                            >
                              {job.status || "Active"}
                            </span>
                          </div>

                          <p className="mt-1 text-sm text-slate-500">
                            {job.location || "No location"} •{" "}
                            {job.employmentType || "N/A"}
                          </p>

                          <p className="mt-3 text-slate-700">
                            {job.description
                              ? `${job.description.slice(0, 160)}${
                                  job.description.length > 160 ? "…" : ""
                                }`
                              : "No description available."}
                          </p>

                          <div className="mt-4 flex flex-wrap gap-3 text-sm text-slate-600">
                            <span className="rounded-full bg-slate-100 px-3 py-1">
                              Applicants: {job.applicantsCount || 0}
                            </span>
                            <span className="rounded-full bg-slate-100 px-3 py-1">
                              Vendor: {job.vendorName || "TriPowers LLC"}
                            </span>
                          </div>
                        </div>

                        <div className="flex flex-wrap gap-2">
                          <button
                            type="button"
                            onClick={() => handleEditClick(job)}
                            className="rounded-lg border px-4 py-2 text-slate-700 hover:bg-slate-100"
                          >
                            Edit
                          </button>

                          <button
                            type="button"
                            onClick={() => {
                              setSelectedJob(job);
                              setActiveTab(TABS.APPLICANTS);
                            }}
                            className="rounded-lg border px-4 py-2 text-slate-700 hover:bg-slate-100"
                          >
                            View Applicants
                          </button>

                          <button
                            type="button"
                            onClick={() => handleDeleteClick(job.id)}
                            className="rounded-lg bg-red-600 px-4 py-2 text-white hover:bg-red-700"
                          >
                            Delete
                          </button>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        )}

        {activeTab === TABS.APPLICANTS && (
          <div className="rounded-2xl border bg-white p-6 shadow-sm">
            <div className="mb-4 flex flex-col gap-2 md:flex-row md:items-center md:justify-between">
              <div>
                <h2 className="text-xl font-semibold text-slate-900">Applicants</h2>
                <p className="text-sm text-slate-500">
                  {selectedJob
                    ? `Viewing applicants for ${selectedJob.title}`
                    : "Viewing applicants for all jobs"}
                </p>
              </div>

              {selectedJob && (
                <button
                  type="button"
                  onClick={() => setSelectedJob(null)}
                  className="rounded-lg border px-4 py-2 text-slate-700 hover:bg-slate-100"
                >
                  Clear Job Filter
                </button>
              )}
            </div>

            <ApplicantsTable jobId={selectedJob?.id} />
          </div>
        )}
      </div>
    </div>
  );
};

export default Admin;