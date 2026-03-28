import { configureStore } from '@reduxjs/toolkit';
import applicantsReducer, { fetchApplicants } from '../slices/applicantsSlice.js';
import jobsSlice from '../slices/jobsSlice.js';
import applicationsSlice from '../slices/applicationsSlice.js';
import authReducer from '../slices/authSlice.js';

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
    applicants: applicantsReducer,
    jobs: jobsSlice.reducer,
    applications: applicationsSlice.reducer,
    auth: authReducer,
  },
});

export const ACTION_TYPES = {
  FETCH_APPLICANTS_START: 'FETCH_APPLICANTS_START',
  FETCH_APPLICANTS_SUCCESS: 'FETCH_APPLICANTS_SUCCESS',
  FETCH_APPLICANTS_FAILURE: 'FETCH_APPLICANTS_FAILURE',
};

export const fetchAll = () => fetchApplicants();
