<<<<<<< HEAD
import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';
import {
  createJob,
  deleteJob as deleteJobRequest,
  getJobs,
  updateJob,
} from '../api/adminApi';

export const fetchJobs = createAsyncThunk(
  'jobs/fetch',
  async (_, { rejectWithValue }) => {
    try {
      const { data } = await getJobs();
      return data;
    } catch (error) {
      return rejectWithValue(error.message || 'Failed to fetch jobs');
=======
import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import jobsApi from "../api/jobsApiClient";

export const fetchJobs = createAsyncThunk(
  "jobs/fetchAll",
  async (_, { rejectWithValue }) => {
    try {
      const { data } = await jobsApi.get("/jobs");
      return data;
    } catch (error) {
      return rejectWithValue(error.message || "Unable to load jobs");
>>>>>>> 0c65dfe15558630c415c8d9dd4cd911334947142
    }
  }
);

<<<<<<< HEAD
export const createJobThunk = createAsyncThunk(
  'jobs/create',
  async (payload, { rejectWithValue }) => {
    try {
      const { data } = await createJob(payload);
      return data;
    } catch (error) {
      return rejectWithValue(error.message || 'Failed to create job');
    }
  }
);

export const updateJobThunk = createAsyncThunk(
  'jobs/update',
  async ({ id, data }, { rejectWithValue }) => {
    try {
      const response = await updateJob(id, data);
      return response.data;
    } catch (error) {
      return rejectWithValue(error.message || 'Failed to update job');
    }
  }
);

export const deleteJobThunk = createAsyncThunk(
  'jobs/delete',
  async (id, { rejectWithValue }) => {
    try {
      await deleteJobRequest(id);
      return id;
    } catch (error) {
      return rejectWithValue(error.message || 'Failed to delete job');
=======
export const fetchJobById = createAsyncThunk(
  "jobs/fetchById",
  async (id, { rejectWithValue }) => {
    if (!id) return rejectWithValue("Missing job id");
    try {
      const { data } = await jobsApi.get(`/jobs/${id}`);
      return data;
    } catch (error) {
      return rejectWithValue(error.message || "Unable to load job");
>>>>>>> 0c65dfe15558630c415c8d9dd4cd911334947142
    }
  }
);

<<<<<<< HEAD
const initialState = {
  list: [],
  loading: false,
  error: null,
};

const jobsSlice = createSlice({
  name: 'jobs',
  initialState,
=======
const jobsSlice = createSlice({
  name: "jobs",
  initialState: {
    items: [],
    status: "idle",
    error: null,
    selectedJob: null,
    detailStatus: "idle",
    detailError: null,
  },
>>>>>>> 0c65dfe15558630c415c8d9dd4cd911334947142
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchJobs.pending, (state) => {
<<<<<<< HEAD
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchJobs.fulfilled, (state, action) => {
        state.loading = false;
        state.list = action.payload || [];
      })
      .addCase(fetchJobs.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      .addCase(createJobThunk.fulfilled, (state, action) => {
        state.list.push(action.payload);
      })
      .addCase(updateJobThunk.fulfilled, (state, action) => {
        const idx = state.list.findIndex((job) => job.id === action.payload.id);
        if (idx !== -1) state.list[idx] = action.payload;
      })
      .addCase(deleteJobThunk.fulfilled, (state, action) => {
        state.list = state.list.filter((job) => job.id !== action.payload);
=======
        state.status = "loading";
        state.error = null;
      })
      .addCase(fetchJobs.fulfilled, (state, action) => {
        state.status = "succeeded";
        state.items = action.payload || [];
      })
      .addCase(fetchJobs.rejected, (state, action) => {
        state.status = "failed";
        state.error = action.payload || action.error?.message;
      })

      .addCase(fetchJobById.pending, (state) => {
        state.detailStatus = "loading";
        state.detailError = null;
        state.selectedJob = null;
      })
      .addCase(fetchJobById.fulfilled, (state, action) => {
        state.detailStatus = "succeeded";
        state.selectedJob = action.payload || null;
      })
      .addCase(fetchJobById.rejected, (state, action) => {
        state.detailStatus = "failed";
        state.detailError = action.payload || action.error?.message;
>>>>>>> 0c65dfe15558630c415c8d9dd4cd911334947142
      });
  },
});

<<<<<<< HEAD
export default jobsSlice.reducer;
=======
export default jobsSlice;
>>>>>>> 0c65dfe15558630c415c8d9dd4cd911334947142
