import { configureStore } from '@reduxjs/toolkit'
import applicantSlice from "../slices/applicantSlice";
import jobsSlice from "../slices/jobsSlice";
import applicantsReducer from '../slices/applicantsSlice';
import authReducer from '../slices/authSlice';
import jobsReducer from '../slices/jobsSlice';

export const store = configureStore({
  reducer: {
    auth: authReducer,
    applicants: applicantsReducer,
    jobs: jobsReducer,
 },
});
