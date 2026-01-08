import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';
import { postLogin } from '../api/auth';

const tokenFromStorage = () => localStorage.getItem('token') || null;
const roleFromStorage = () => localStorage.getItem('role') || null;

export const loginUser = createAsyncThunk(
  'auth/login',
  async (credentials, { rejectWithValue }) => {
    try {
      const { data } = await postLogin(credentials);
      const token = data?.token || null;
      const role = data?.role || data?.user?.role || 'admin';

      if (token) {
        localStorage.setItem('token', token);
        localStorage.setItem('role', role);
      }
      return { token, role };
    } catch (error) {
      return rejectWithValue(error.message || 'Login failed');
    }
  }
);

const initialState = {
  token: tokenFromStorage(),
  role: roleFromStorage(),
  loading: false,
  error: null,
};

const authSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {
    logout(state) {
      state.token = null;
      state.role = null;
      localStorage.removeItem('token');
      localStorage.removeItem('role');
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(loginUser.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(loginUser.fulfilled, (state, action) => {
        state.loading = false;
        state.token = action.payload.token;
        state.role = action.payload.role;
      })
      .addCase(loginUser.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload || 'Unable to login';
      });
  },
});

export const { logout } = authSlice.actions;
export default authSlice.reducer;
