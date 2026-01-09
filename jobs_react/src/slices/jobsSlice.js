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
    }
  }
);

export const fetchJobById = createAsyncThunk(
  "jobs/fetchById",
  async (id, { rejectWithValue }) => {
    if (!id) return rejectWithValue("Missing job id");
    try {
      const { data } = await jobsApi.get(`/jobs/${id}`);
      return data;
    } catch (error) {
      return rejectWithValue(error.message || "Unable to load job");
    }
  }
);

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
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchJobs.pending, (state) => {
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
      });
  },
});

export default jobsSlice;
