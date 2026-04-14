import { useEffect, useState } from "react";
import apiClient from '../../api/apiClient'

const emptyJob = {
  title: "",
  description: "",
  requirements: "",
  responsibilities: "",
  location: "",
  employmentType: "",
  vendorName: "TriPowers LLC",
  salaryRangeMin: "",
  salaryRangeMax: "",
  benefits: "",
  status: "active",
};

const JobEditor = ({ job, onSave, onCancel }) => {
  const [form, setForm] = useState(emptyJob);
  const [aiPrompt, setAiPrompt] = useState("");
  const [generating, setGenerating] = useState(false);
  const [aiError, setAiError] = useState("");

  useEffect(() => {
    setForm(job || emptyJob);
  }, [job]);

  const [activeView, setActiveView] = useState("jobs"); 
// "jobs" | "create" | "applicants" | "generator"
  
  const handleSubmit = (e) => {
    e.preventDefault();
    onSave?.(form);
  };

  const handleGenerate = async () => {
    if (!aiPrompt.trim()) return;

    try {
      setGenerating(true);
      setAiError("");

      const res = await apiClient.post("/jobdescription", {
        prompt: aiPrompt,
      });

      const data = res.data || {};

      setForm((prev) => ({
        ...prev,
        description: data.description || prev.description,
        requirements: Array.isArray(data.requirements)
          ? data.requirements.join("\n")
          : prev.requirements,
        responsibilities: Array.isArray(data.responsibilities)
          ? data.responsibilities.join("\n")
          : prev.responsibilities,
        salaryRangeMin: data.salaryMin ?? prev.salaryRangeMin,
        salaryRangeMax: data.salaryMax ?? prev.salaryRangeMax,
      }));
    } catch (err) {
      console.error(err);
      setAiError(err.message || "Failed to generate job content.");
    } finally {
      setGenerating(false);
    }
  };

  return (
    <div className="border rounded p-4 space-y-4 bg-white">
      {!job?.id && (
        <div className="border rounded p-3 bg-gray-50 space-y-3">
          <h4 className="font-medium">Generate with AI</h4>
          <textarea
            value={aiPrompt}
            onChange={(e) => setAiPrompt(e.target.value)}
            placeholder="Example: Create a senior full-stack developer job for a government contractor supporting secure web apps in Texas."
            className="border px-3 py-2 rounded w-full min-h-[100px]"
          />
          <div className="flex gap-2 items-center">
            <button
              type="button"
              onClick={handleGenerate}
              disabled={generating || !aiPrompt.trim()}
              className="px-3 py-2 border rounded"
            >
              {generating ? "Generating..." : "Generate Content"}
            </button>
            {aiError && <p className="text-red-600 text-sm">{aiError}</p>}
          </div>
        </div>
      )}

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
          <span className="text-sm">Employment Type</span>
          <input
            value={form.employmentType}
            onChange={(e) => setForm({ ...form, employmentType: e.target.value })}
            className="border px-3 py-2 rounded w-full"
          />
        </label>

        <label className="block">
          <span className="text-sm">Status</span>
          <select
            value={form.status || "active"}
            onChange={(e) => setForm({ ...form, status: e.target.value })}
            className="border px-3 py-2 rounded w-full"
          >
            <option value="active">Active</option>
            <option value="draft">Draft</option>
            <option value="closed">Closed</option>
          </select>
        </label>

        <label className="block">
          <span className="text-sm">Vendor Name</span>
          <input
            value={form.vendorName}
            onChange={(e) => setForm({ ...form, vendorName: e.target.value })}
            className="border px-3 py-2 rounded w-full"
          />
        </label>

        <label className="block">
          <span className="text-sm">Description</span>
          <textarea
            required
            value={form.description}
            onChange={(e) => setForm({ ...form, description: e.target.value })}
            className="border px-3 py-2 rounded w-full min-h-[120px]"
          />
        </label>

        <label className="block">
          <span className="text-sm">Requirements</span>
          <textarea
            value={form.requirements}
            onChange={(e) => setForm({ ...form, requirements: e.target.value })}
            className="border px-3 py-2 rounded w-full min-h-[120px]"
          />
        </label>

        <label className="block">
          <span className="text-sm">Responsibilities</span>
          <textarea
            value={form.responsibilities}
            onChange={(e) => setForm({ ...form, responsibilities: e.target.value })}
            className="border px-3 py-2 rounded w-full min-h-[120px]"
          />
        </label>

        <div className="grid grid-cols-2 gap-3">
          <label className="block">
            <span className="text-sm">Salary Min</span>
            <input
              type="number"
              value={form.salaryRangeMin}
              onChange={(e) => setForm({ ...form, salaryRangeMin: e.target.value })}
              className="border px-3 py-2 rounded w-full"
            />
          </label>

          <label className="block">
            <span className="text-sm">Salary Max</span>
            <input
              type="number"
              value={form.salaryRangeMax}
              onChange={(e) => setForm({ ...form, salaryRangeMax: e.target.value })}
              className="border px-3 py-2 rounded w-full"
            />
          </label>
        </div>

        <label className="block">
          <span className="text-sm">Benefits</span>
          <textarea
            value={form.benefits}
            onChange={(e) => setForm({ ...form, benefits: e.target.value })}
            className="border px-3 py-2 rounded w-full"
          />
        </label>

        <div className="flex gap-2">
          <button type="submit" className="px-3 py-2 bg-blue-600 text-white rounded">
            {job?.id ? "Update" : "Create"}
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