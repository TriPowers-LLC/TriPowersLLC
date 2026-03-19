import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useParams } from "react-router-dom";
import { fetchJobById } from "../../slices/jobsSlice";
import { submitApplication, resetSubmissionState } from "../../slices/applicationsSlice";
import ApplyForm from "./ApplyForm";

const JobDetail = () => {
  const { id } = useParams();
  const dispatch = useDispatch();
  const { selectedJob, detailStatus, detailError } = useSelector((state) => state.jobs);
  const { submitStatus, submitError } = useSelector((state) => state.applications);

  useEffect(() => {
    dispatch(fetchJobById(id));
    dispatch(resetSubmissionState());
  }, [dispatch, id]);

  const handleSubmit = (form) => {
    if (!selectedJob) return;
    dispatch(submitApplication({ ...form, jobId: selectedJob.id }));
  };

  if (detailStatus === "loading") {
    return <p className="text-center text-slate-600">Loading job…</p>;
  }

  if (detailStatus === "failed") {
    return <p className="text-center text-red-600">{detailError}</p>;
  }

  if (!selectedJob) {
    return null;
  }

  const posted = selectedJob.postedAt || selectedJob.createdAt || selectedJob.postedDate;

  return (
    <div className="space-y-6">
      <header className="space-y-2">
        <p className="text-sm text-slate-600">
          Posted {posted ? new Date(posted).toLocaleDateString() : "Recently"}
        </p>
        <h1 className="text-3xl font-bold text-blue-900">{selectedJob.title}</h1>
        <p className="text-slate-700">{selectedJob.location} • {selectedJob.employmentType}</p>
      </header>

      <section className="space-y-4">
        <div>
          <h2 className="font-semibold text-lg mb-2">Description</h2>
          <p className="text-slate-800 whitespace-pre-line">{selectedJob.description}</p>
        </div>
        {selectedJob.requirements && (
          <div>
            <h2 className="font-semibold text-lg mb-2">Requirements</h2>
            <p className="text-slate-800 whitespace-pre-line">{selectedJob.requirements}</p>
          </div>
        )}
        {selectedJob.responsibilities && (
          <div>
            <h2 className="font-semibold text-lg mb-2">Responsibilities</h2>
            <p className="text-slate-800 whitespace-pre-line">{selectedJob.responsibilities}</p>
          </div>
        )}
        <div className="flex gap-4 text-sm text-slate-700">
          <span>Vendor: {selectedJob.vendorName}</span>
          {selectedJob.salaryRangeMin || selectedJob.salaryRangeMax ? (
            <span>
              Salary: {selectedJob.salaryRangeMin ?? "N/A"} - {selectedJob.salaryRangeMax ?? "N/A"}
            </span>
          ) : null}
        </div>
      </section>

      <section className="bg-slate-50 border rounded-lg p-6">
        <h2 className="text-2xl font-semibold text-blue-900 mb-4">Apply now</h2>
        <ApplyForm
          submitting={submitStatus === "loading"}
          error={submitError}
          success={submitStatus === "succeeded"}
          onSubmit={handleSubmit}
        />
      </section>
    </div>
  );
};

export default JobDetail;