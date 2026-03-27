import { configureStore, createSlice } from '@reduxjs/toolkit';
import jobsSlice from "../slices/jobsSlice.js";
import applicationsSlice from "../slices/applicationsSlice.js";

const legacyApplicantsSlice = createSlice({
  name: "applicants",
  initialState: {
    applicants: [],
    loading: false,
    error: null,
  },
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


export const store = configureStore({
  reducer: {
    applicants: legacyApplicantsSlice.reducer,
    jobs: jobsSlice.reducer,
    applications: applicationsSlice.reducer,
  },
});

export const ACTION_TYPES = {
  FETCH_APPLICANTS_START: "FETCH_APPLICANTS_START",
  FETCH_APPLICANTS_SUCCESS: "FETCH_APPLICANTS_SUCCESS",
  FETCH_APPLICANTS_FAILURE: "FETCH_APPLICANTS_FAILURE"
};

export const fetchAll = () => {
  return async (dispatch) => {
    dispatch(legacyApplicantsSlice.actions.fetchApplicantsStart());
    try {
      const response = await fetch("https://jsonplaceholder.typicode.com/users");
      const data = await response.json();
      dispatch(legacyApplicantsSlice.actions.fetchApplicantsSuccess(data));
    } catch (error) {
      dispatch(legacyApplicantsSlice.actions.fetchApplicantsFailure(error.message));
    }
  };
};
