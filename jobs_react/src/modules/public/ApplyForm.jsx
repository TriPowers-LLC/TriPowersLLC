import { useEffect, useState } from "react";

const defaultForm = {
  firstName: "",
  lastName: "",
  email: "",
  phone: "",
  streetAddress: "",
  city: "",
  state: "",
  country: "",
  zipCode: "",
  resumeText: "",
};

const ApplyForm = ({ submitting, success, error, onSubmit }) => {
  const [form, setForm] = useState(defaultForm);

  useEffect(() => {
    if (success) {
      setForm(defaultForm);
    }
  }, [success]);

  const handleChange = (key, value) => {
    setForm((prev) => ({ ...prev, [key]: value }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    onSubmit(form);
  };

  return (
    <form className="space-y-4" onSubmit={handleSubmit}>
      {success && (
        <p className="text-green-700 bg-green-50 border border-green-200 px-3 py-2 rounded">
          Application submitted! We will reach out soon.
        </p>
      )}
      {error && (
        <p className="text-red-700 bg-red-50 border border-red-200 px-3 py-2 rounded">
          {error}
        </p>
      )}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <label className="space-y-1 text-sm text-slate-700">
          First name
          <input
            required
            className="w-full border rounded px-3 py-2"
            value={form.firstName}
            onChange={(e) => handleChange("firstName", e.target.value)}
          />
        </label>
        <label className="space-y-1 text-sm text-slate-700">
          Last name
          <input
            required
            className="w-full border rounded px-3 py-2"
            value={form.lastName}
            onChange={(e) => handleChange("lastName", e.target.value)}
          />
        </label>
        <label className="space-y-1 text-sm text-slate-700">
          Email
          <input
            required
            type="email"
            className="w-full border rounded px-3 py-2"
            value={form.email}
            onChange={(e) => handleChange("email", e.target.value)}
          />
        </label>
        <label className="space-y-1 text-sm text-slate-700">
          Phone
          <input
            required
            className="w-full border rounded px-3 py-2"
            value={form.phone}
            onChange={(e) => handleChange("phone", e.target.value)}
          />
        </label>
        <label className="space-y-1 text-sm text-slate-700">
          Street address
          <input
            required
            className="w-full border rounded px-3 py-2"
            value={form.streetAddress}
            onChange={(e) => handleChange("streetAddress", e.target.value)}
          />
        </label>
        <label className="space-y-1 text-sm text-slate-700">
          City
          <input
            required
            className="w-full border rounded px-3 py-2"
            value={form.city}
            onChange={(e) => handleChange("city", e.target.value)}
          />
        </label>
        <label className="space-y-1 text-sm text-slate-700">
          State/Province
          <input
            required
            className="w-full border rounded px-3 py-2"
            value={form.state}
            onChange={(e) => handleChange("state", e.target.value)}
          />
        </label>
        <label className="space-y-1 text-sm text-slate-700">
          Country
          <input
            required
            className="w-full border rounded px-3 py-2"
            value={form.country}
            onChange={(e) => handleChange("country", e.target.value)}
          />
        </label>
        <label className="space-y-1 text-sm text-slate-700">
          ZIP / Postal code
          <input
            required
            className="w-full border rounded px-3 py-2"
            value={form.zipCode}
            onChange={(e) => handleChange("zipCode", e.target.value)}
          />
        </label>
      </div>

      <label className="space-y-1 text-sm text-slate-700 block">
        Resume / Cover letter
        <textarea
          required
          rows={6}
          className="w-full border rounded px-3 py-2"
          value={form.resumeText}
          onChange={(e) => handleChange("resumeText", e.target.value)}
        />
      </label>

      <div className="flex justify-end">
        <button
          type="submit"
          disabled={submitting}
          className="bg-blue-700 text-white px-6 py-2 rounded disabled:opacity-60"
        >
          {submitting ? "Submitting…" : "Submit application"}
        </button>
      </div>
    </form>
  );
};

export default ApplyForm;