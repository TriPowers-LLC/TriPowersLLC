import { configureStore } from '@reduxjs/toolkit';
import applicantsReducer from '../slices/applicantsSlice.js';
import jobsReducer from '../slices/jobsSlice.js';
import applicationsReducer from '../slices/applicationsSlice.js';
import authReducer from '../slices/authSlice.js';

export const store = configureStore({
  reducer: {
    applicants: applicantsReducer,
    jobs: jobsReducer,
    applications: applicationsReducer,
    auth: authReducer,
  },
});