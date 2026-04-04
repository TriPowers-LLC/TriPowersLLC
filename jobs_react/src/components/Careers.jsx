// src/components/Careers.jsx
import { useState, useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { useSelector } from "react-redux";
import ApplicantForm from "./applications/ApplicantForm";
import apiClient from '../../api/apiClient'

export default function Careers() {
  const [jobs, setJobs] = useState([]);
  const [selectedJob, setSelectedJob] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const navigate = useNavigate();
  const auth = useSelector((state) => state.auth || {});
  const isAuthenticated =
    auth.isAuthenticated ?? !!localStorage.getItem("token");

  const role =
    auth.role ||
    auth.user?.role ||
    localStorage.getItem("role") ||
    "public";

  const location = useLocation();

  useEffect(() => {
    const fetchJobs = async () => {
      try {
        setLoading(true);
        setError("");
        const res = await apiClient.get("/public/jobs");
        setJobs(res.data || []);
      } catch (err) {
        console.error(err);
        setError(err.message || "Failed to load jobs.");
      } finally {
        setLoading(false);
      }
    };

    fetchJobs();
  }, []);

  useEffect(() => {
  const applyJobId = location.state?.applyJobId;
  if (applyJobId && jobs.length > 0 && isAuthenticated && role === "applicant") {
    const match = jobs.find((j) => String(j.id) === String(applyJobId));
    if (match) {
      setSelectedJob(match);
    }
  }
}, [location.state, jobs, isAuthenticated, role]);

  const handleApplyClick = (job) => {
    if (!isAuthenticated) {
      navigate("/login", {
        state: {
          from: "/careers",
          jobId: job.id,
        },
      });
      return;
    }

    setSelectedJob(job);
  };

  return (
    <div className="p-4 max-w-3xl mx-auto">
      <h1 className="text-3xl mb-6">Careers at TriPowers LLC</h1>

      {loading && <p>Loading jobs...</p>}
      {error && <p className="text-red-600">{error}</p>}

      {!loading && !error && jobs.length === 0 && (
        <p>No open positions at the moment.</p>
      )}

      {!loading && !error &&
        jobs.map((job) => (
          <div key={job.id} className="mb-6 border p-4 rounded">
            <h2 className="text-xl font-semibold">{job.title}</h2>
            <p className="mt-2 whitespace-pre-wrap">{job.description}</p>
            <button
              onClick={() => handleApplyClick(job)}
              className="mt-3 bg-green-600 text-white px-4 py-2 rounded"
            >
              Apply Now
            </button>
          </div>
        ))}

      {selectedJob && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4">
          <div className="bg-white p-6 rounded shadow-xl max-w-lg w-full relative">
            <button
              onClick={() => setSelectedJob(null)}
              className="absolute top-3 right-3 text-gray-500"
            >
              ✕
            </button>
            <h3 className="text-2xl mb-4">Apply for: {selectedJob.title}</h3>
            <ApplicantForm
              jobId={selectedJob.id}
              onSubmitted={() => setSelectedJob(null)}
            />
          </div>
        </div>
      )}
    </div>
  );
}