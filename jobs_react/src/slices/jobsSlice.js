import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import api from "../api/apiClient";

export const fetchJobs = createAsyncThunk("jobs/fetchAll", async (_, { rejectWithValue }) => {
  try {
    const { data } = await api.get("/public/jobs");
    return data;
  } catch (error) {
    return rejectWithValue(error.message || "Unable to load jobs");
  }
});

export const fetchJobById = createAsyncThunk("jobs/fetchById", async (id, { rejectWithValue }) => {
  try {
    const { data } = await api.get(`/public/jobs/${id}`);
    return data;
  } catch (error) {
    return rejectWithValue(error.message || "Unable to load the job");
  }
});

const jobsSlice = createSlice({
  name: "jobs",
  initialState: {
    items: [],
    selectedJob: null,
    status: "idle",
    error: null,
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
        state.items = action.payload;
      })
      .addCase(fetchJobs.rejected, (state, action) => {
        state.status = "failed";
        state.error = action.payload;
      })
      .addCase(fetchJobById.pending, (state) => {
        state.detailStatus = "loading";
        state.detailError = null;
        state.selectedJob = null;
      })
      .addCase(fetchJobById.fulfilled, (state, action) => {
        state.detailStatus = "succeeded";
        state.selectedJob = action.payload;
      })
      .addCase(fetchJobById.rejected, (state, action) => {
        state.detailStatus = "failed";
        state.detailError = action.payload;
      });
  },
});

export default jobsSlice;
