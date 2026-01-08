import { useEffect, useState } from 'react';

const emptyJob = {
  title: '',
  description: '',
  location: '',
};

const JobEditor = ({ job, onSave, onCancel }) => {
  const [form, setForm] = useState(emptyJob);

  useEffect(() => {
    setForm(job || emptyJob);
  }, [job]);

  const handleSubmit = (e) => {
    e.preventDefault();
    onSave?.(form);
  };

  return (
    <div className="border rounded p-4 space-y-3">
      <h3 className="text-lg font-semibold">{job?.id ? 'Edit Job' : 'Create Job'}</h3>
      <form onSubmit={handleSubmit} className="space-y-3">
        <label className="block">
          <span className="text-sm">Title</span>
          <input
            required
            value={form.title}
            onChange={(e) => setForm({ ...form, title: e.target.value })}
            className="border px-3 py-2 rounded w-full"
          />
        </label>
        <label className="block">
          <span className="text-sm">Location</span>
          <input
            value={form.location}
            onChange={(e) => setForm({ ...form, location: e.target.value })}
            className="border px-3 py-2 rounded w-full"
          />
        </label>
        <label className="block">
          <span className="text-sm">Description</span>
          <textarea
            required
            value={form.description}
            onChange={(e) => setForm({ ...form, description: e.target.value })}
            className="border px-3 py-2 rounded w-full"
          />
        </label>
        <div className="flex gap-2">
          <button type="submit" className="px-3 py-2 bg-blue-600 text-white rounded">
            {job?.id ? 'Update' : 'Create'}
          </button>
          {onCancel && (
            <button
              type="button"
              className="px-3 py-2 border rounded"
              onClick={onCancel}
            >
              Cancel
            </button>
          )}
        </div>
      </form>
    </div>
  );
};

export default JobEditor;
