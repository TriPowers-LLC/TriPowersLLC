import { useEffect, useMemo, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { fetchApplicants, setPage, setSearch } from "../../slices/applicantsSlice";
import { getResumeDownloadUrl, updateApplicantStatus } from "../../api/adminApi";

const ApplicantsTable = ({ jobId }) => {
  const dispatch = useDispatch();
  const { list = [], loading, error, page, pageSize, search } = useSelector(
    (state) => state.applicants || {}
  );

  const [selectedApplicant, setSelectedApplicant] = useState(null);

  const [statusFilter, setStatusFilter] = useState("");

  useEffect(() => {
    dispatch(fetchApplicants({ page, search, pageSize, jobId, status: statusFilter }));
  }, [dispatch, page, search, pageSize, jobId, statusFilter]);

  const hasData = useMemo(() => Array.isArray(list) && list.length > 0, [list]);

  const getApplicantName = (applicant) =>
    applicant.fullName ||
    [applicant.firstName, applicant.lastName].filter(Boolean).join(" ") ||
    applicant.name ||
    "Unknown Applicant";

  const getStatusClass = (status) => {
    switch ((status || "").toLowerCase()) {
      case "hired":
        return "bg-green-100 text-green-700";
      case "rejected":
        return "bg-red-100 text-red-700";
      case "interviewed":
        return "bg-blue-100 text-blue-700";
      case "reviewing":
        return "bg-yellow-100 text-yellow-700";
      default:
        return "bg-gray-100 text-gray-700";
    }
  };

 const handleOpenResume = async (applicationId) => {
    try {
      const res = await getResumeDownloadUrl(applicationId);

      const url = res.data?.downloadUrl;
      if (url) {
        window.open(url, "_blank", "noopener,noreferrer");
      }
    } catch (err) {
      console.error("Resume error:", err);
      console.error("Resume detail:", err.detail);
      console.error("Resume inner:", err.inner);
      console.error("Resume response data:", err.responseData);

      alert(err.detail || err.message || "Failed to open resume.");
    }
  };

  const selectedApplicantId = selectedApplicant?.id;

  const handleStatusChange = async (id, status) => {
    try {
      await updateApplicantStatus(id, { status });

      // refresh data
      dispatch(fetchApplicants({ page, search, pageSize, jobId, status: statusFilter }));
    } catch (err) {
      console.error(err);
      alert(err.message || "Failed to update status");
    }
  };

  return (
    <div className="space-y-3">
      <div className="flex items-center gap-2">
        <input
          aria-label="Search applicants"
          value={search}
          onChange={(e) => dispatch(setSearch(e.target.value))}
          placeholder="Search applicants..."
          className="border px-3 py-2 rounded w-full"
        />
        <button
          className="px-3 py-2 bg-gray-100 border rounded"
          onClick={() => dispatch(fetchApplicants({ page: 1, search, pageSize, jobId, status: statusFilter }))}
        >
          Search
        </button>
      </div>

      <select
        value={statusFilter}
        onChange={(e) => {
          setStatusFilter(e.target.value);
          dispatch(setPage(1));
        }}
        className="border px-2 py-2 rounded"
      >
        <option value="">All Statuses</option>
        <option value="submitted">Submitted</option>
        <option value="reviewing">Reviewing</option>
        <option value="interviewed">Interviewed</option>
        <option value="offered">Offered</option>
        <option value="hired">Hired</option>
        <option value="rejected">Rejected</option>
      </select>

      {loading && <p>Loading applicants...</p>}
      {error && <p className="text-red-500">{error}</p>}

      {hasData ? (
        <table className="w-full border rounded overflow-hidden">
          <thead>
            <tr className="bg-gray-50">
              <th className="text-left p-2">Name</th>
              <th className="text-left p-2">Email</th>
              <th className="text-left p-2">Job</th>
              <th className="text-left p-2">Status</th>
              <th className="text-left p-2">Resume</th>
              <th className="text-left p-2">Actions</th>
            </tr>
          </thead>
          <tbody>
            {list.map((applicant) => (
              <tr key={applicant.id || applicant.email} className="border-t">
                <td className="p-2">{getApplicantName(applicant)}</td>
                <td className="p-2">{applicant.email || "-"}</td>
                <td className="p-2">{applicant.job?.title || "-"}</td>
                <td className="p-2">
                  <select
                    value={(applicant.status || "submitted").toLowerCase()}
                    onChange={(e) => handleStatusChange(applicant.id, e.target.value)}
                    className="border rounded px-2 py-1 text-sm"
                  >
                    <option value="submitted">Submitted</option>
                    <option value="reviewing">Reviewing</option>
                    <option value="interviewed">Interviewed</option>
                    <option value="offered">Offered</option>
                    <option value="hired">Hired</option>
                    <option value="rejected">Rejected</option>
                  </select>
                </td>
                <td className="p-2">
                  {applicant.resumeUrl ? (
                    <button
                      type="button"
                      onClick={() => handleOpenResume(applicant.id)}
                      className="text-blue-600 underline"
                    >
                      Open Resume
                    </button>
                  ) : (
                    "-"
                  )}
                </td>
                <td className="p-2">
                  <button
                    type="button"
                    onClick={() => setSelectedApplicant(applicant)}
                    className="px-3 py-1 border rounded"
                  >
                    Review
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      ) : (
        !loading && <p>No applicants found.</p>
      )}

      <div className="flex items-center gap-2">
        <button
          onClick={() => dispatch(setPage(Math.max(1, page - 1)))}
          className="px-3 py-2 border rounded"
          disabled={page === 1}
        >
          Previous
        </button>
        <span>Page {page}</span>
        <button
          onClick={() => dispatch(setPage(page + 1))}
          className="px-3 py-2 border rounded"
        >
          Next
        </button>
      </div>

      {selectedApplicant && (
        <div className="fixed inset-0 bg-black/40 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-lg shadow-xl w-full max-w-2xl p-6 relative">
            <button
              type="button"
              onClick={() => setSelectedApplicant(null)}
              className="absolute top-3 right-3 text-gray-500"
            >
              ✕
            </button>

            <h2 className="text-2xl font-semibold mb-4">Applicant Review</h2>

            <div className="space-y-2">
              <p>
                <strong>Name:</strong> {getApplicantName(selectedApplicant)}
              </p>
              <p>
                <strong>First Name:</strong> {selectedApplicant.firstName || "-"}
              </p>
              <p>
                <strong>Last Name:</strong> {selectedApplicant.lastName || "-"}
              </p>
              <p>
                <strong>Email:</strong> {selectedApplicant.email || "-"}
              </p>
              <p>
                <strong>Phone:</strong> {selectedApplicant.phone || "-"}
              </p>
              <p>
                <strong>Job:</strong> {selectedApplicant.job?.title || "-"}
              </p>
              <p>
                <strong>Location:</strong>{" "}
                {[
                  selectedApplicant.streetAddress,
                  selectedApplicant.city,
                  selectedApplicant.state,
                  selectedApplicant.zipCode,
                  selectedApplicant.country,
                ]
                  .filter(Boolean)
                  .join(", ") || "-"}
              </p>
              <p>
                <strong>LinkedIn:</strong>{" "}
                {selectedApplicant.linkedInProfile ? (
                  <a
                    href={selectedApplicant.linkedInProfile}
                    target="_blank"
                    rel="noreferrer"
                    className="text-blue-600 underline"
                  >
                    {selectedApplicant.linkedInProfile}
                  </a>
                ) : (
                  "-"
                )}
              </p>
              <p>
                <strong>Portfolio:</strong>{" "}
                {selectedApplicant.portfolioUrl ? (
                  <a
                    href={selectedApplicant.portfolioUrl}
                    target="_blank"
                    rel="noreferrer"
                    className="text-blue-600 underline"
                  >
                    {selectedApplicant.portfolioUrl}
                  </a>
                ) : (
                  "-"
                )}
              </p>
              <p>
                <strong>Status:</strong> {selectedApplicant.status || "Submitted"}
              </p>
              <p>
                <strong>Applied:</strong>{" "}
                {selectedApplicant.appliedAt
                  ? new Date(selectedApplicant.appliedAt).toLocaleString()
                  : "-"}
              </p>
            </div>

            {selectedApplicant.coverLetter && (
              <div className="mt-4">
                <h3 className="font-semibold mb-1">Cover Letter</h3>
                <div className="border rounded p-3 bg-gray-50 whitespace-pre-wrap">
                  {selectedApplicant.coverLetter}
                </div>
              </div>
            )}

            <div className="mt-4 flex gap-3">
              {selectedApplicant.resumeUrl && (
                <button
                  type="button"
                  onClick={() => handleOpenResume(selectedApplicantId)}
                  className="text-blue-600 underline"
                >
                  Open Resume
                </button>
              )}

              <button
                type="button"
                onClick={() => setSelectedApplicant(null)}
                className="px-4 py-2 border rounded"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default ApplicantsTable;
