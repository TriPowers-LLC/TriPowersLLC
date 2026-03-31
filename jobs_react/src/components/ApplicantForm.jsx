// src/components/ApplicantForm.jsx
import { useState } from 'react';
import apiClient from '../lib/apiClient';

export default function ApplicantForm({ jobId, onSubmitted }) {
  const [form, setForm] = useState({ firstname: '', lastname: '', phone: '', email: '', resume: '' });
  const [status, setStatus] = useState('');

  const submit = async (e) => {
    e.preventDefault();
    try {
      await apiClient.post(`jobs/${jobId}/apply`, form);
      setStatus('Application submitted! 🎉');
      onSubmitted?.();
    } catch (err) {
      console.error(err);
      setStatus('Error submitting application.');
    }
  };

  return (
    <form onSubmit={submit} className="space-y-4">
      {status && <p className="text-green-600">{status}</p>}
      <input
        type="text" placeholder="Your First Name" required
        className="w-full border p-2"
        value={form.firstname}
        onChange={e => setForm({...form, firstname: e.target.value})}
      />
      <input
        type="text" placeholder="Your Last Name" required
        className="w-full border p-2"
        value={form.lastName}
        onChange={e => setForm({...form, lastName: e.target.value})}
      />
      <input
        type="email" placeholder="Your Phone" required
        className="w-full border p-2"
        value={form.phone}
        onChange={e => setForm({...form, phone: e.target.value})}
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
