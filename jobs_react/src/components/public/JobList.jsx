import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Link } from "react-router-dom";
import { fetchJobs } from "../../slices/jobsSlice";

const JobCard = ({ job }) => {
  const posted = job.postedAt || job.createdAt || job.postedDate;

  return (
    <div className="border rounded-lg shadow-sm p-4 flex flex-col gap-2 bg-white">
      <div className="flex items-center justify-between">
        <h3 className="text-xl font-semibold text-blue-900">{job.title}</h3>
        <span className="text-sm text-slate-600">{job.employmentType || "N/A"}</span>
      </div>

      <p className="text-sm text-slate-600">
        {job.location || "No location"} • Posted{" "}
        {posted ? new Date(posted).toLocaleDateString() : "Recently"}
      </p>

      <p className="text-slate-700 line-clamp-3">
        {job.description || "No description available."}
      </p>

      <div className="flex justify-between items-center mt-auto pt-2">
        <span className="text-sm text-slate-600">
          Vendor: {job.vendorName || "TriPowers LLC"}
        </span>

        <Link
          to={`/apply/${job.id}`}
          className="text-blue-700 font-semibold hover:underline"
        >
          View & Apply →
        </Link>
      </div>
    </div>
  );
};

const JobList = () => {
  const dispatch = useDispatch();

  const {
    list = [],
    status = "idle",
    error = null,
  } = useSelector((state) => state.jobs || {});

  const jobs = Array.isArray(list) ? list : [];

  useEffect(() => {
    if (status === "idle") {
      dispatch(fetchJobs());
    }
  }, [dispatch, status]);

  return (
    <section className="space-y-6">
      <header className="text-center space-y-2">
        <h1 className="text-3xl font-bold text-blue-900">Open Roles</h1>
        <p className="text-slate-700">Browse our current openings.</p>
      </header>

      {status === "loading" && (
        <p className="text-center text-slate-600">Loading jobs…</p>
      )}

      {status === "failed" && (
        <p className="text-center text-red-600">{error || "Failed to load jobs."}</p>
      )}

      {status === "succeeded" && jobs.length === 0 && (
        <p className="text-center text-slate-600">No open positions right now.</p>
      )}

      {jobs.length > 0 && (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {jobs.map((job) => (
            <JobCard key={job.id} job={job} />
          ))}
        </div>
      )}
    </section>
  );
};

export default JobList;