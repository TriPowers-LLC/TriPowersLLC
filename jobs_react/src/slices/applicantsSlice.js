import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';
import { getApplicants } from '../api/adminApi';

const getErrorMessage = (error) =>
  error?.response?.data?.error ||
  error?.response?.data?.message ||
  error?.message ||
  'Failed to fetch applicants';

export const fetchApplicants = createAsyncThunk(
  'applicants/fetch',
  async (params, { rejectWithValue }) => {
    try {
      const { data } = await getApplicants(params);
      return data;
    } catch (error) {
      return rejectWithValue(getErrorMessage(error));
    }
  }
);

const initialState = {
  list: [],
  total: 0,
  page: 1,
  pageSize: 10,
  search: '',
  loading: false,
  error: null,
};

const applicantsSlice = createSlice({
  name: 'applicants',
  initialState,
  reducers: {
    setPage(state, action) {
      state.page = action.payload;
    },
    setSearch(state, action) {
      state.search = action.payload;
      state.page = 1;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchApplicants.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchApplicants.fulfilled, (state, action) => {
        state.loading = false;
        state.list = Array.isArray(action.payload?.items) ? action.payload.items : [];
        state.total = action.payload?.total ?? 0;
        state.page = action.payload?.page ?? state.page;
        state.pageSize = action.payload?.pageSize ?? state.pageSize;
      })
      .addCase(fetchApplicants.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload || 'Failed to fetch applicants';
      });
  },
});

export const { setPage, setSearch } = applicantsSlice.actions;
export default applicantsSlice.reducer;