// src/components/ApplicantForm.jsx
import { useState } from 'react';
import axios from 'axios';

export default function ApplicantForm({ jobId }) {
  const [form, setForm] = useState({ name: '', email: '', resume: '' });
  const [status, setStatus] = useState('');

  const submit = async (e) => {
    e.preventDefault();
    try {
      await axios.post(`/api/jobs/${jobId}/apply`, form);
      setStatus('Application submitted! 🎉');
    } catch (err) {
      console.error(err);
      setStatus('Error submitting application.');
    }
  };

  return (
    <form onSubmit={submit} className="space-y-4">
      {status && <p className="text-green-600">{status}</p>}
      <input
        type="text" placeholder="Your Name" required
        className="w-full border p-2"
        value={form.name}
        onChange={e => setForm({...form, name: e.target.value})}
      />
      <input
        type="email" placeholder="Your Email" required
        className="w-full border p-2"
        value={form.email}
        onChange={e => setForm({...form, email: e.target.value})}
      />
      <textarea
        placeholder="Resume / Cover Letter"
        className="w-full border p-2"
        rows={5}
        value={form.resume}
        onChange={e => setForm({...form, resume: e.target.value})}
      />
      <button className="bg-blue-600 text-white px-4 py-2 rounded">
        Submit Application
      </button>
    </form>
  );
}

