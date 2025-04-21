import { createSlice } from "@reduxjs/toolkit";

// Initial state for the applicants slice
const initialState = {
    applicants: [],
    loading: false,
    error: null,
  };

  const applicantSlice = createSlice({
    name: "applicants",
    initialState,
    reducers: {
      fetchApplicantsStart: (state) => {
        state.loading = true;
        state.error = null;
      },
      fetchApplicantsSuccess: (state, action) => {
        state.applicants = action.payload;
        state.loading = false;
      },
      fetchApplicantsFailure: (state, action) => {
        state.loading = false;
        state.error = action.payload;
      },
    },
  });

  export default applicantSlice;
 