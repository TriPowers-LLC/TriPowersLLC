import { useEffect, useMemo, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { fetchApplicants, setPage, setSearch } from "../../slices/applicantsSlice";
import { getResumeDownloadUrl } from "../../api/adminApi";

const ApplicantsTable = () => {
  const dispatch = useDispatch();
  const { list = [], loading, error, page, pageSize, search } = useSelector(
    (state) => state.applicants || {}
  );

  const [selectedApplicant, setSelectedApplicant] = useState(null);

  useEffect(() => {
    dispatch(fetchApplicants({ page, search, pageSize }));
  }, [dispatch, page, search, pageSize]);

  const hasData = useMemo(() => Array.isArray(list) && list.length > 0, [list]);

  const getApplicantName = (applicant) =>
    applicant.fullName ||
    [applicant.firstName, applicant.lastName].filter(Boolean).join(" ") ||
    applicant.name ||
    "Unknown Applicant";

 const handleOpenResume = async (resumeUrlOrKey) => {
  try {
    const objectKey = resumeUrlOrKey.includes(".amazonaws.com/")
      ? resumeUrlOrKey.split(".amazonaws.com/")[1]
      : resumeUrlOrKey;

    const res = await getResumeDownloadUrl(objectKey);

    const url = res.data?.downloadUrl;
    if (url) {
      window.open(url, "_blank", "noopener,noreferrer");
    }
  } catch (err) {
    console.error(err);
    alert(err.message || "Failed to open resume.");
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
          onClick={() => dispatch(fetchApplicants({ page: 1, search, pageSize }))}
        >
          Search
        </button>
      </div>

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
                <td className="p-2">{applicant.status || "Submitted"}</td>
                <td className="p-2">
                  {applicant.resumeUrl ? (
                    <button
                      type="button"
                      onClick={() => handleOpenResume(applicant.resumeUrl)}
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
                  onClick={() => handleOpenResume(selectedApplicant.resumeUrl)}
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
