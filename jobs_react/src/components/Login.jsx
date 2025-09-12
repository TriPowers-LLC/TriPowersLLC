// src/components/Login.jsx
import { useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

export default function Login() {
  // rename to match backend DTOs
  const [creds, setCreds] = useState({ username: '', password: '' });
  const [error, setError]     = useState('');
  const [isRegister, setIsRegister] = useState(false);
  const nav = useNavigate();

  // after registering, your backend should return { token }
  const handleRegister = async () => {
    try {
      const { data } = await axios.post(
        '/api/users/register',
        creds
      );

      const token = data.token
        ? data.token
        : (await axios.post('/api/users/login', creds)).data.token;

      localStorage.setItem('token', token);
      nav('/admin');
    } catch (e) {
      console.error(e.response?.status, e.response?.data ?? e.message);
      setError(e.response?.data?.message || 'Registration failed');
    }
  };

  const handleLogin = async (e) => {
    e.preventDefault();
    try {
      const { data } = await axios.post(
        '/api/users/login',
        creds
      );
      localStorage.setItem('token', data.token);
      nav('/admin');
    } catch (e) {
      console.error(e.response?.status, e.response?.data ?? e.message);
      setError('Login failed—see console.');
    }
  };
  return (
    <div className="max-w-sm mx-auto p-4">
      <h2 className="text-2xl mb-4">{isRegister ? 'Register' : 'Log In'}</h2>
      {error && <p className="text-red-500 mb-2">{error}</p>}
      <form onSubmit={isRegister ? e => { e.preventDefault(); handleRegister(); } : handleLogin}>
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
        <button
          type="submit"
          className="w-full bg-blue-600 text-white py-2 rounded"
        >
          {isRegister ? 'Register' : 'Log In'}
        </button>
      </form>
      <p className="mt-4 text-center">
        {isRegister
          ? 'Already have an account?'
          : "Don't have an account?"}{' '}
        <button
          onClick={() => { setIsRegister(!isRegister); setError(''); }}
          className="text-blue-600 underline"
        >
          {isRegister ? 'Log In' : 'Register'}
        </button>
      </p>
    </div>
  );
}
