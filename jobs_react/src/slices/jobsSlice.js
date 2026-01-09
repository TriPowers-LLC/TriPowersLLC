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
    }
  }
);

const initialState = {
  list: [],
  loading: false,
  error: null,
};

const jobsSlice = createSlice({
  name: 'jobs',
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchJobs.pending, (state) => {
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
      });
  },
});

export default jobsSlice.reducer;
