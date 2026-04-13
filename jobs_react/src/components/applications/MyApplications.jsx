import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { fetchMyApplications } from "../../slices/applicationsSlice";
import {
  getMyResumeDownloadUrl,
  createResumeReplaceUrl,
  confirmResumeReplace,
  deleteResume,
} from "../../api/adminApi";

const MyApplications = () => {
  const dispatch = useDispatch();
  const [busyId, setBusyId] = useState(null);

  const {
    myApplications = [],
    myStatus = "idle",
    myError = null,
  } = useSelector((state) => state.applications || {});

  useEffect(() => {
    dispatch(fetchMyApplications());
  }, [dispatch]);

  const handleViewResume = async (applicationId) => {
    try {
      setBusyId(applicationId);
      const { data } = await getMyResumeDownloadUrl(applicationId);
      if (data?.downloadUrl) {
        window.open(data.downloadUrl, "_blank", "noopener,noreferrer");
      }
    } catch (err) {
      console.error(err);
      alert(err.message || "Unable to open resume.");
    } finally {
      setBusyId(null);
    }
  };

  const handleReplaceResume = async (applicationId, file) => {
    if (!file) return;

    try {
      setBusyId(applicationId);

      const { data: presign } = await createResumeReplaceUrl(applicationId, {
        fileName: file.name,
        contentType: file.type,
      });

      await fetch(presign.uploadUrl, {
        method: "PUT",
        headers: {
          "Content-Type": file.type,
        },
        body: file,
      });

      await confirmResumeReplace(applicationId, presign.objectKey);
      await dispatch(fetchMyApplications());
    } catch (err) {
      console.error(err);
      alert(err.message || "Unable to replace resume.");
    } finally {
      setBusyId(null);
    }
  };

  const handleDeleteResume = async (applicationId) => {
    try {
      setBusyId(applicationId);
      await deleteResume(applicationId);
      await dispatch(fetchMyApplications());
    } catch (err) {
      console.error(err);
      alert(err.message || "Unable to delete resume.");
    } finally {
      setBusyId(null);
    }
  };

  return (
    <section className="space-y-4">
      <header className="space-y-2">
        <h1 className="text-3xl font-bold text-blue-900">My Applications</h1>
        <p className="text-slate-700">Track applications submitted with your account.</p>
      </header>

      {myStatus === "loading" && (
        <p className="text-slate-600">Loading your applications…</p>
      )}

      {myStatus === "failed" && (
        <p className="text-red-600">{myError}</p>
      )}

      {myStatus === "succeeded" && myApplications.length === 0 && (
        <p className="text-slate-600">You have not submitted any applications yet.</p>
      )}

      {myApplications.length > 0 && (
        <div className="space-y-3">
          {myApplications.map((app) => (
            <div key={app.id} className="border rounded p-4 bg-white shadow-sm space-y-3">
              <div className="flex justify-between">
                <h3 className="text-xl font-semibold">{app.job?.title ?? "Job"}</h3>
                <span className="text-sm text-slate-600">
                  Applied {app.appliedAt ? new Date(app.appliedAt).toLocaleDateString() : ""}
                </span>
              </div>

              <p className="text-slate-700">{app.job?.location}</p>

              <div className="flex flex-wrap gap-2">
                <button
                  type="button"
                  onClick={() => handleViewResume(app.id)}
                  disabled={!app.resumeUrl || busyId === app.id}
                  className="px-3 py-2 border rounded"
                >
                  View Resume
                </button>

                <label className="px-3 py-2 border rounded cursor-pointer">
                  Replace Resume
                  <input
                    type="file"
                    accept=".pdf,.doc,.docx"
                    className="hidden"
                    onChange={(e) => handleReplaceResume(app.id, e.target.files?.[0])}
                  />
                </label>

                <button
                  type="button"
                  onClick={() => handleDeleteResume(app.id)}
                  disabled={!app.resumeUrl || busyId === app.id}
                  className="px-3 py-2 border rounded text-red-600"
                >
                  Delete Resume
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </section>
  );
};

export default MyApplications;