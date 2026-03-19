import api from './apiClient';

export const getApplicants = ({ page = 1, search = '', pageSize = 10 } = {}) =>
  api.get('admin/applicants', { params: { page, search, pageSize } });

export const getJobs = () => api.get('jobs');

export const createJob = (payload) => api.post('admin/jobs', payload);

export const updateJob = (id, payload) => api.put(`admin/jobs/${id}`, payload);

export const deleteJob = (id) => api.delete(`admin/jobs/${id}`);

export const getJobById = (id) => api.get(`jobs/${id}`);
