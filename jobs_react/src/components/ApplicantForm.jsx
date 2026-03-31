// src/components/ApplicantForm.jsx
import { useState } from 'react';
import apiClient from '../lib/apiClient';

export default function ApplicantForm({ jobId, onSubmitted }) {
  const [form, setForm] = useState({ firstname: '', lastname: '', phone: '', email: '' });
  const [status, setStatus] = useState('');
  const [selectedFile, setSelectedFile] = useState(null);
  const [loading, setLoading] = useState(false);
  const handleFileChange = (e) => {
    setSelectedFile(e.target.files[0]);
  };

  const submit = async (e) => {
    e.preventDefault();
    if (!selectedFile) {
      alert("Please upload a resume");
      return;
    }
    try {
      // 1️⃣ Get presigned URL
      setLoading(true);
      const presignRes = await fetch(`${API_BASE_URL}/api/uploads/presign`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          fileName: selectedFile.name,
          contentType: selectedFile.type
        })
      });

      const { uploadUrl, objectKey } = await presignRes.json();

      // 2️⃣ Upload file directly to S3
      await fetch(uploadUrl, {
        method: "PUT",
        headers: {
          "Content-Type": selectedFile.type
        },
        body: selectedFile
      });

      // 3️⃣ Submit application with resume reference
      await fetch(`${API_BASE_URL}/api/applications`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          jobId: 1, // replace with real jobId
          resumeKey: objectKey
        })
      });

      await apiClient.post(`jobs/${jobId}/apply`, form);
      setStatus('Application submitted! 🎉');
      onSubmitted?.();
    } catch (err) {
      console.error(err);
      setStatus('Error submitting application.');
    }
    setLoading(false);
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
      <input type="file" accept=".pdf,.doc,.docx" onChange={handleFileChange} required
        placeholder="Resume / Cover Letter"
        className="w-full border p-2"
      />
      <button className="bg-blue-600 text-white px-4 py-2 rounded">
        Submit Application
      </button>
    </form>
  );
}
