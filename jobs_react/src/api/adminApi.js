import apiClient from "./apiClient";

export const getApplicants = ({ page = 1, search = "", pageSize = 10 } = {}) =>
  apiClient.get("/applicants/admin", { params: { page, search, pageSize } });

export const getJobs = () => apiClient.get("/public/jobs");

export const createJob = (payload) => apiClient.post("/admin/jobs", payload);

export const updateJob = (id, payload) => apiClient.put(`/admin/jobs/${id}`, payload);

export const deleteJob = (id) => apiClient.delete(`/admin/jobs/${id}`);

export const getJobById = (id) => apiClient.get(`/public/jobs/${id}`);

export const getResumeDownloadUrl = (objectKey) =>
  apiClient.get("/uploads/presign-download", {
    params: { objectKey },
  });