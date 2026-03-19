const JobsTable = ({ jobs = [], onEdit, onDelete }) => (
  <table className="w-full border">
    <thead>
      <tr className="bg-gray-50">
        <th className="text-left p-2">Title</th>
        <th className="text-left p-2">Location</th>
        <th className="text-left p-2">Actions</th>
      </tr>
    </thead>
    <tbody>
      {jobs.map((job) => (
        <tr key={job.id || job.title} className="border-t">
          <td className="p-2">{job.title}</td>
          <td className="p-2">{job.location || 'Remote'}</td>
          <td className="p-2 space-x-2">
            <button
              aria-label={`Edit ${job.title}`}
              className="px-2 py-1 border rounded"
              onClick={() => onEdit?.(job)}
            >
              Edit
            </button>
            <button
              aria-label={`Delete ${job.title}`}
              className="px-2 py-1 border rounded bg-red-50 text-red-600"
              onClick={() => onDelete?.(job.id)}
            >
              Delete
            </button>
          </td>
        </tr>
      ))}
      {jobs.length === 0 && (
        <tr>
          <td className="p-2" colSpan={3}>
            No jobs found.
          </td>
        </tr>
      )}
    </tbody>
  </table>
);

export default JobsTable;
