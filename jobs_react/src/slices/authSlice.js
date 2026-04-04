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
      const user = data?.user || null;
      const role = user?.role || data?.role || 'applicant';

      if (token) {
        localStorage.setItem('token', token);
        localStorage.setItem('role', role);
      }

      return { token, role, user };
    } catch (error) {
      return rejectWithValue(error.message || 'Login failed');
    }
  }
);

const initialState = {
  token: tokenFromStorage(),
  role: roleFromStorage(),
  user: null,
  isAuthenticated: !!tokenFromStorage(),
  loading: false,
  error: null,
};

const authSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {
    loginSuccess(state, action) {
      const { token, user } = action.payload;
      const role = user?.role || 'applicant';

      state.token = token;
      state.user = user;
      state.role = role;
      state.isAuthenticated = !!token;
      state.error = null;

      localStorage.setItem('token', token);
      localStorage.setItem('role', role);
    },
    logout(state) {
      state.token = null;
      state.role = null;
      state.user = null;
      state.isAuthenticated = false;
      state.error = null;

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
        state.user = action.payload.user;
        state.isAuthenticated = !!action.payload.token;
      })
      .addCase(loginUser.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload || 'Unable to login';
        state.isAuthenticated = false;
      });
  },
});

export const { logout, loginSuccess } = authSlice.actions;
export default authSlice.reducer;
