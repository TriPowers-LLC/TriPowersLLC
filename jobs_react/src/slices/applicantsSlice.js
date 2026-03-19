import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';
import { getApplicants } from '../api/adminApi';

export const fetchApplicants = createAsyncThunk(
  'applicants/fetch',
  async (params, { rejectWithValue }) => {
    try {
      const { data } = await getApplicants(params);
      return data;
    } catch (error) {
      return rejectWithValue(error.message || 'Failed to fetch applicants');
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
        state.list = action.payload.items || action.payload.data || action.payload || [];
        state.total = action.payload.total || action.payload.length || 0;
        state.pageSize = action.payload.pageSize || state.pageSize;
      })
      .addCase(fetchApplicants.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      });
  },
});

export const { setPage, setSearch } = applicantsSlice.actions;
export default applicantsSlice.reducer;
