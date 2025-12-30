import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { fetchMyApplications } from "../../slices/applicationsSlice";

const MyApplications = () => {
  const dispatch = useDispatch();
  const { myApplications, myStatus, myError } = useSelector((state) => state.applications);

  useEffect(() => {
    dispatch(fetchMyApplications());
  }, [dispatch]);

  return (
    <section className="space-y-4">
      <header className="space-y-2">
        <h1 className="text-3xl font-bold text-blue-900">My Applications</h1>
        <p className="text-slate-700">Track applications submitted with your account.</p>
      </header>

      {myStatus === "loading" && <p className="text-slate-600">Loading your applications…</p>}
      {myStatus === "failed" && <p className="text-red-600">{myError}</p>}
      {myStatus === "succeeded" && myApplications.length === 0 && (
        <p className="text-slate-600">You have not submitted any applications yet.</p>
      )}

      {myApplications.length > 0 && (
        <div className="space-y-3">
          {myApplications.map((app) => (
            <div key={app.id} className="border rounded p-4 bg-white shadow-sm">
              <div className="flex justify-between">
                <h3 className="text-xl font-semibold">{app.job?.title ?? "Job"}</h3>
                <span className="text-sm text-slate-600">
                  Applied {new Date(app.appliedAt).toLocaleDateString()}
                </span>
              </div>
              <p className="text-slate-700">{app.job?.location}</p>
              <p className="text-slate-600 mt-2 line-clamp-2">{app.resumeText}</p>
            </div>
          ))}
        </div>
      )}
    </section>
  );
};

export default MyApplications;