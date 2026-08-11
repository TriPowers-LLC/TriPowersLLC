// src/components/Login.jsx
import { useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate, useLocation } from 'react-router-dom';
import { confirmPasswordReset, postRegister, requestPasswordReset } from '../api/auth';
import { loginUser, loginSuccess } from '../slices/authSlice';

export default function Login() {
  const [creds, setCreds] = useState({ username: '', password: '' });
  const [isRegister, setIsRegister] = useState(false);
  const [resetStage, setResetStage] = useState(null);
  const [reset, setReset] = useState({ token: '', newPassword: '' });
  const [resetMessage, setResetMessage] = useState('');

  const dispatch = useDispatch();
  const navigate = useNavigate();
  const location = useLocation();

  const { loading, error } = useSelector(
    (state) => state.auth ?? { loading: false, error: null }
  );

  const handleChange = (e) => {
    const { name, value } = e.target;
    setCreds((prev) => ({ ...prev, [name]: value }));
  };

  const handleRedirect = (role) => {
    const from = location.state?.from;
    const jobId = location.state?.jobId;

    if (role === "admin") {
      navigate("/admin", { replace: true });
      return;
    }

    if (role === 'applicant' && from === '/careers') {
      navigate('/careers', {
        state: { applyJobId: jobId },
        replace: true,
      });
      return;
    }

    if (role === 'applicant') {
      navigate('/myapplications', { replace: true });
      return;
    }

    navigate('/careers', { replace: true });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      if (isRegister) {
        const { data } = await postRegister(creds);

        const token = data?.token || null;
        const user = data?.user || null;

        if (token && user) {
          dispatch(loginSuccess({ token, user }));
        }

        handleRedirect(user?.role || 'applicant');
        return;
      }

      const result = await dispatch(loginUser(creds)).unwrap();
      handleRedirect(result?.role || 'applicant');
    } catch (err) {
      console.error(err);
    }
  };

  const requestReset = async (e) => {
    e.preventDefault();
    setResetMessage('');
    try {
      const { data } = await requestPasswordReset(creds.username);
      setReset((prev) => ({ ...prev, token: data?.resetToken || '' }));
      setResetStage('confirm');
      setResetMessage(data?.message || 'If the account exists, reset instructions have been sent.');
    } catch (err) {
      setResetMessage(err.response?.data?.message || 'Unable to request a reset token.');
    }
  };

  const confirmReset = async (e) => {
    e.preventDefault();
    setResetMessage('');
    try {
      const { data } = await confirmPasswordReset({
        username: creds.username,
        token: reset.token,
        newPassword: reset.newPassword,
      });
      setResetMessage(data?.message || 'Password reset successfully.');
      setReset({ token: '', newPassword: '' });
      setResetStage(null);
    } catch (err) {
      setResetMessage(err.response?.data?.message || 'The reset token is invalid or has expired.');
    }
  };

  if (resetStage) {
    return (
      <div className="max-w-sm mx-auto p-4">
        <h2 className="text-2xl mb-4">Reset password</h2>
        {resetMessage && <p className="mb-3">{resetMessage}</p>}
        <form onSubmit={resetStage === 'request' ? requestReset : confirmReset}>
          <label className="block mb-3">
            Username
            <input type="text" value={creds.username} onChange={(e) => setCreds((prev) => ({ ...prev, username: e.target.value }))} className="w-full border p-2 mt-1" required readOnly={resetStage === 'confirm'} />
          </label>
          {resetStage === 'confirm' && (
            <>
              <label className="block mb-3">
                Reset token
                <input type="text" value={reset.token} onChange={(e) => setReset((prev) => ({ ...prev, token: e.target.value }))} className="w-full border p-2 mt-1" autoComplete="one-time-code" required />
              </label>
              <label className="block mb-4">
                New password
                <input type="password" value={reset.newPassword} onChange={(e) => setReset((prev) => ({ ...prev, newPassword: e.target.value }))} className="w-full border p-2 mt-1" minLength={12} autoComplete="new-password" required />
              </label>
            </>
          )}
          <button type="submit" className="w-full bg-blue-600 text-white py-2 rounded">
            {resetStage === 'request' ? 'Request reset token' : 'Reset password'}
          </button>
        </form>
        <button type="button" onClick={() => { setResetStage(null); setResetMessage(''); }} className="block mx-auto mt-4 text-blue-600 underline">Back to login</button>
      </div>
    );
  }

  return (
    <div className="max-w-sm mx-auto p-4">
      <h2 className="text-2xl mb-4">{isRegister ? 'Register' : 'Log In'}</h2>

      {error && <p className="text-red-500 mb-2">{error}</p>}

      <form onSubmit={handleSubmit}>
        <label className="block mb-2">
          Username
          <input
            type="text"
            name="username"
            value={creds.username}
            onChange={handleChange}
            className="w-full border p-2 mt-1"
            required
          />
        </label>

        <label className="block mb-4">
          Password
          <input
            type="password"
            name="password"
            value={creds.password}
            onChange={handleChange}
            className="w-full border p-2 mt-1"
            required
          />
        </label>

        <button
          type="submit"
          className="w-full bg-blue-600 text-white py-2 rounded"
          disabled={loading}
        >
          {loading ? 'Please wait...' : isRegister ? 'Register' : 'Log In'}
        </button>
      </form>

      {!isRegister && (
        <button type="button" onClick={() => { setResetStage('request'); setResetMessage(''); }} className="block mx-auto mt-3 text-blue-600 underline">
          Forgot password?
        </button>
      )}

      <p className="mt-4 text-center">
        {isRegister ? 'Already have an account?' : "Don't have an account?"}{' '}
        <button
          type="button"
          onClick={() => setIsRegister((prev) => !prev)}
          className="text-blue-600 underline"
        >
          {isRegister ? 'Log In' : 'Register'}
        </button>
      </p>
    </div>
  );
}
