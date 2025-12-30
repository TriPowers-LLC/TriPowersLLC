import { useEffect, useMemo } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { fetchApplicants, setPage, setSearch } from '../../slices/applicantsSlice';

const ApplicantsTable = () => {
  const dispatch = useDispatch();
  const { list, loading, error, page, pageSize, search } = useSelector((state) => state.applicants);

  useEffect(() => {
    dispatch(fetchApplicants({ page, search, pageSize }));
  }, [dispatch, page, search, pageSize]);

  const hasData = useMemo(() => list && list.length > 0, [list]);

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
        <table className="w-full border">
          <thead>
            <tr className="bg-gray-50">
              <th className="text-left p-2">Name</th>
              <th className="text-left p-2">Email</th>
              <th className="text-left p-2">Status</th>
            </tr>
          </thead>
          <tbody>
            {list.map((applicant) => (
              <tr key={applicant.id || applicant.email} className="border-t">
                <td className="p-2">{applicant.name}</td>
                <td className="p-2">{applicant.email}</td>
                <td className="p-2">{applicant.status || 'Pending'}</td>
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
    </div>
  );
};

export default ApplicantsTable;
