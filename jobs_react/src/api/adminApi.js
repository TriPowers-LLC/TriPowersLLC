import apiClient from "./apiClient";

export const getApplicants = ({ page = 1, search = "", pageSize = 10 } = {}) =>
  apiClient.get("/applicants/admin", { params: { page, search, pageSize } });

export const getJobs = () => apiClient.get("/public/jobs");

export const createJob = (payload) => apiClient.post("/admin/jobs", payload);

export const updateJob = (id, payload) => apiClient.put(`/admin/jobs/${id}`, payload);

export const deleteJob = (id) => apiClient.delete(`/admin/jobs/${id}`);

export const getJobById = (id) => apiClient.get(`/public/jobs/${id}`);

export const getMyResumeDownloadUrl = (applicationId) =>
  apiClient.get(`/uploads/applications/${applicationId}/resume`);

export const getResumeDownloadUrl = (applicationId) =>
  apiClient.get(`/uploads/applications/${applicationId}/resume`);

export const createResumeReplaceUrl = (applicationId, payload) =>
  apiClient.post(`/uploads/applications/${applicationId}/resume/presign-replace`, payload);

export const confirmResumeReplace = (applicationId, objectKey) =>
  apiClient.put(`/uploads/applications/${applicationId}/resume`, { objectKey });

export const deleteResume = (applicationId) =>
  apiClient.delete(`/uploads/applications/${applicationId}/resume`);