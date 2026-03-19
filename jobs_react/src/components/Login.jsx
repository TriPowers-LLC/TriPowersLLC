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
  const { loading, error } = useSelector((state) => state.auth);
  const nav = useNavigate();

  const doRegister = async () => {
    try {
      const { data } = await postRegister(creds);
      const token = data?.token;
      if (token) {
        localStorage.setItem('token', token);
      }
      await dispatch(loginUser(creds)).unwrap();
      nav('/admin');
    } catch (e) {
      console.error(e);
    }
  };

  const doLogin = async (e) => {
    e.preventDefault();
    try {
      await dispatch(loginUser(creds)).unwrap();
      nav('/admin');
    } catch (e) {
      console.error(e);
    }
  };

  return (
    <div className="max-w-sm mx-auto p-4">
      <h2 className="text-2xl mb-4">{isRegister ? 'Register' : 'Log In'}</h2>
      {error && <p className="text-red-500 mb-2">{error}</p>}

      <form onSubmit={isRegister ? (e) => { e.preventDefault(); doRegister(); } : doLogin}>
        <label className="block mb-2">
          Username
          <input
            type="text"
            value={creds.username}
            onChange={e => setCreds({ ...creds, username: e.target.value })}
            className="w-full border p-2 mt-1"
            required
          />
        </label>

        <label className="block mb-4">
          Password
          <input
            type="password"
            value={creds.password}
            onChange={e => setCreds({ ...creds, password: e.target.value })}
            className="w-full border p-2 mt-1"
            required
          />
        </label>

        <button type="submit" className="w-full bg-blue-600 text-white py-2 rounded" disabled={loading}>
          {isRegister ? 'Register' : 'Log In'}
        </button>
      </form>

      <p className="mt-4 text-center">
        {isRegister ? 'Already have an account?' : "Don't have an account?"}{' '}
        <button
          onClick={() => { setIsRegister(!isRegister); }}
          className="text-blue-600 underline"
        >
          {isRegister ? 'Log In' : 'Register'}
        </button>
      </p>
    </div>
  );
}
