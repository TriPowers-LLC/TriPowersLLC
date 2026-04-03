import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';
import apiClient from '../api/apiClient';
import { createJob, deleteJob, updateJob } from '../api/adminApi';

export const fetchJobs = createAsyncThunk(
  'jobs/fetchAll',
  async (_, { rejectWithValue }) => {
    try {
      const { data } = await apiClient.get('/public/jobs');
      return data;
    } catch (error) {
      return rejectWithValue(error.message || 'Unable to load jobs');
    }
  }
);

export const fetchJobById = createAsyncThunk(
  'jobs/fetchById',
  async (id, { rejectWithValue }) => {
    try {
      const { data } = await apiClient.get(`/public/jobs/${id}`);
      return data;
    } catch (error) {
      return rejectWithValue(error.message || 'Unable to load the job');
    }
  }
);

export const createJobThunk = createAsyncThunk(
  'jobs/create',
  async (payload, { rejectWithValue }) => {
    try {
      const { data } = await createJob(payload);
      return data;
    } catch (error) {
      return rejectWithValue(error.message || 'Unable to create the job');
    }
  }
);

export const updateJobThunk = createAsyncThunk(
  'jobs/update',
  async ({ id, data: payload }, { rejectWithValue }) => {
    try {
      await updateJob(id, payload);
      return { id, ...payload };
    } catch (error) {
      return rejectWithValue(error.message || 'Unable to update the job');
    }
  }
);

export const deleteJobThunk = createAsyncThunk(
  'jobs/delete',
  async (id, { rejectWithValue }) => {
    try {
      await deleteJob(id);
      return id;
    } catch (error) {
      return rejectWithValue(error.message || 'Unable to delete the job');
    }
  }
);

const jobsSlice = createSlice({
  name: 'jobs',
  initialState: {
    list: [],
    selectedJob: null,
    status: 'idle',
    error: null,
    detailStatus: 'idle',
    detailError: null,
  },
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchJobs.pending, (state) => {
        state.status = 'loading';
        state.error = null;
      })
      .addCase(fetchJobs.fulfilled, (state, action) => {
        state.status = 'succeeded';
        state.list = action.payload;
      })
      .addCase(fetchJobs.rejected, (state, action) => {
        state.status = 'failed';
        state.error = action.payload;
      })
      .addCase(fetchJobById.pending, (state) => {
        state.detailStatus = 'loading';
        state.detailError = null;
        state.selectedJob = null;
      })
      .addCase(fetchJobById.fulfilled, (state, action) => {
        state.detailStatus = 'succeeded';
        state.selectedJob = action.payload;
      })
      .addCase(fetchJobById.rejected, (state, action) => {
        state.detailStatus = 'failed';
        state.detailError = action.payload;
      })
      .addCase(createJobThunk.fulfilled, (state, action) => {
        state.list = [...state.list, action.payload];
      })
      .addCase(updateJobThunk.fulfilled, (state, action) => {
        const matches = (job) => String(job.id) === String(action.payload.id);

        state.list = state.list.map((job) =>
          matches(job) ? { ...job, ...action.payload } : job
        );

        if (state.selectedJob && matches(state.selectedJob)) {
          state.selectedJob = { ...state.selectedJob, ...action.payload };
        }
      })
      .addCase(deleteJobThunk.fulfilled, (state, action) => {
        const keep = (job) => String(job.id) !== String(action.payload);

        state.list = state.list.filter(keep);

        if (state.selectedJob && !keep(state.selectedJob)) {
          state.selectedJob = null;
        }
      });
  },
});

export default jobsSlice.reducer;