// src/components/ApplicantForm.jsx
import { useState, useEffect} from "react";
import apiClient from "../../api/apiClient";

export default function ApplicantForm({ jobId, onSubmitted }) {
  const [form, setForm] = useState({
    firstName: "",
    lastName: "",
    email: "",
    phone: "",
    streetAddress: "",
    city: "",
    state: "",
    country: "",
    zipCode: "",
    coverLetter: "",
    linkedInProfile: "",
    portfolioUrl: "",
  });
  const [selectedFile, setSelectedFile] = useState(null);
  const [status, setStatus] = useState("");
  const [loading, setLoading] = useState(false);
  const isSuccess = status.includes("submitted");

  const handleChange = (e) => {
    setForm((prev) => ({
      ...prev,
      [e.target.name]: e.target.value,
    }));
  };

  const handleFileChange = (e) => {
    setSelectedFile(e.target.files?.[0] || null);
  };

  const submit = async (e) => {
    e.preventDefault();

    if (!jobId) {
      setStatus("Missing job ID.");
      return;
    }

    if (!selectedFile) {
      setStatus("Please upload a resume.");
      return;
    }

    try {
      setLoading(true);
      setStatus("");

      // 1) Request presigned upload URL from backend
      const presignRes = await apiClient.post("/uploads/presign", {
        fileName: selectedFile.name,
        contentType: selectedFile.type,
      });

      const { uploadUrl, objectKey, fileUrl } = presignRes.data;

      if (!uploadUrl || !objectKey) {
        throw new Error("Invalid presign response.");
      }

      // 2) Upload file directly to S3
      const uploadRes = await fetch(uploadUrl, {
        method: "PUT",
        headers: {
          "Content-Type": selectedFile.type,
        },
        body: selectedFile,
      });

      if (!uploadRes.ok) {
        throw new Error("Resume upload failed.");
      }

      // 3) Build resume URL
      // Prefer fileUrl from backend if you return it there.
      const resumeUrl = objectKey;

      // 4) Submit application to your ApplicantsController endpoint
      await apiClient.post(`/applicants/jobs/${jobId}`, {
        firstName: form.firstName,
        lastName: form.lastName,
        email: form.email,
        phone: form.phone,
        streetAddress: form.streetAddress,
        city: form.city,
        state: form.state,
        country: form.country,
        zipCode: form.zipCode,
        linkedInProfile: form.linkedInProfile,
        portfolioUrl: form.portfolioUrl,
        resumeUrl,
        coverLetter: form.coverLetter,
      });

      setStatus("Application submitted successfully.");
      setForm({
        firstName: "",
        lastName: "",
        email: "",
        phone: "",
        streetAddress: "",
        city: "",
        state: "",
        country: "",
        zipCode: "",
        coverLetter: "",
        linkedInProfile: "",
        portfolioUrl: "",
      });
      setSelectedFile(null);
      onSubmitted?.();
    } catch (err) {
      console.error(err);
      setStatus(
        err?.response?.data?.error ||
          err?.response?.data?.message ||
          "Error submitting application."
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={submit} className="space-y-4">
      {status && (
        <p
          className={
            status.toLowerCase().includes("success") ||
            status.toLowerCase().includes("submitted")
              ? "text-green-700 bg-green-50 border border-green-200 px-3 py-2 rounded"
              : "text-red-700 bg-red-50 border border-red-200 px-3 py-2 rounded"
          }
        >
          {status}
        </p>
        
)}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <input
          type="text"
          name="firstName"
          placeholder="Your First Name"
          required
          className="w-full border p-2 rounded"
          value={form.firstName}
          onChange={handleChange}
        />

        <input
          type="text"
          name="lastName"
          placeholder="Your Last Name"
          required
          className="w-full border p-2 rounded"
          value={form.lastName}
          onChange={handleChange}
        />
        <input
          type="tel"
          name="phone"
          placeholder="Your Phone"
          required
          className="w-full border p-2 rounded"
          value={form.phone}
          onChange={handleChange}
        />

        <input
          type="email"
          name="email"
          placeholder="Your Email"
          required
          className="w-full border p-2 rounded"
          value={form.email}
          onChange={handleChange}
        />

        <input
          type="text"
          name="streetAddress"
          placeholder="Your Street Address"
          required
          className="w-full border p-2 rounded"
          value={form.streetAddress}
          onChange={handleChange}
        />

        <input
          type="text"
          name="city"
          placeholder="Your City"
          required
          className="w-full border p-2 rounded"
          value={form.city}
          onChange={handleChange}
        />

        <input
          type="text"
          name="state"
          placeholder="Your State"
          required
          className="w-full border p-2 rounded"
          value={form.state}
          onChange={handleChange}
        />

        <input
          type="text"
          name="country"
          placeholder="Your Country"
          required
          className="w-full border p-2 rounded"
          value={form.country}
          onChange={handleChange}
        />

        <input
          type="text"
          name="zipCode"
          placeholder="Your Zip Code"
          required
          className="w-full border p-2 rounded"
          value={form.zipCode}
          onChange={handleChange}
        />

          <input
          type="text"
          name="linkedInProfile"
          placeholder="Your LinkedIn Profile"
          required
          className="w-full border p-2 rounded"
          value={form.linkedInProfile}
          onChange={handleChange}
        />

          <input
          type="text"
          name="portfolioUrl"
          placeholder="Your Portfolio URL"
          required
          className="w-full border p-2 rounded"
          value={form.portfolioUrl}
          onChange={handleChange}
        />
      </div>

        <textarea
          name="coverLetter"
          placeholder="Optional cover letter"
          className="w-full border p-2 rounded min-h-[120px]"
          value={form.coverLetter}
          onChange={handleChange}
        />

        <input
          type="file"
          accept=".pdf,.doc,.docx"
          onChange={handleFileChange}
          required
          className="w-full border p-2 rounded"
        />
      <div className="flex justify-end">
        <button
          type="submit"
          disabled={loading}
          className="bg-blue-600 text-white px-4 py-2 rounded disabled:opacity-60"
        >
          {loading ? "Submitting..." : "Submit Application"}
        </button>
      </div>
    </form>
  );
}
