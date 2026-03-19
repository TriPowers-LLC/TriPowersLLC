import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import api from "../api/apiClient";

export const submitApplication = createAsyncThunk(
  "applications/submit",
  async (payload, { rejectWithValue }) => {
    try {
      const { data } = await api.post("/Applicants", payload);
      return data;
    } catch (error) {
      return rejectWithValue(error.message || "Unable to submit application");
    }
  }
);

export const fetchMyApplications = createAsyncThunk(
  "applications/fetchMine",
  async (_, { rejectWithValue }) => {
    try {
      const { data } = await api.get("/Applicants/me");
      return data;
    } catch (error) {
      return rejectWithValue(error.message || "Unable to load your applications");
    }
  }
);

const applicationsSlice = createSlice({
  name: "applications",
  initialState: {
    submitStatus: "idle",
    submitError: null,
    myApplications: [],
    myStatus: "idle",
    myError: null,
  },
  reducers: {
    resetSubmissionState(state) {
      state.submitStatus = "idle";
      state.submitError = null;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(submitApplication.pending, (state) => {
        state.submitStatus = "loading";
        state.submitError = null;
      })
      .addCase(submitApplication.fulfilled, (state) => {
        state.submitStatus = "succeeded";
      })
      .addCase(submitApplication.rejected, (state, action) => {
        state.submitStatus = "failed";
        state.submitError = action.payload;
      })
      .addCase(fetchMyApplications.pending, (state) => {
        state.myStatus = "loading";
        state.myError = null;
      })
      .addCase(fetchMyApplications.fulfilled, (state, action) => {
        state.myStatus = "succeeded";
        state.myApplications = action.payload || [];
      })
      .addCase(fetchMyApplications.rejected, (state, action) => {
        state.myStatus = "failed";
        state.myError = action.payload;
      });
  },
});

export const { resetSubmissionState } = applicationsSlice.actions;
export default applicationsSlice;