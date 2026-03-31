// src/components/Login.jsx
import { useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { postRegister } from '../api/auth';
import { loginUser } from '../slices/authSlice';

export default function Login() {
  const [creds, setCreds] = useState({ username: '', password: '' });
  const [isRegister, setIsRegister] = useState(false);

  const dispatch = useDispatch();
  const navigate = useNavigate();

  const { loading, error } = useSelector(
    (state) => state.auth ?? { loading: false, error: null }
  );

  const handleChange = (e) => {
    const { name, value } = e.target;
    setCreds((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      if (isRegister) {
        const { data } = await postRegister(creds);
        const token = data?.token || null;
        const role = data?.role || data?.user?.role || 'admin';

        if (token) {
          localStorage.setItem('token', token);
          localStorage.setItem('role', role);
        }

        navigate('/admin');
        return;
      }

      await dispatch(loginUser(creds)).unwrap();
      navigate('/admin');
    } catch (err) {
      console.error(err);
    }
  };

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