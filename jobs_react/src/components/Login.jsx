// src/components/Login.jsx
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { postLogin, postRegister } from '../api/auth';

export default function Login() {
  
  const [creds, setCreds] = useState({ username: '', password: '' });
  const [error, setError]     = useState('');
  const [isRegister, setIsRegister] = useState(false);
  const nav = useNavigate();

  const doRegister = async () => {
    try {
      const { data } = await postRegister(creds);
      const token = data?.token || (await postLogin(creds)).data?.token;
      localStorage.setItem('token', token);
      setError('');
      nav('/admin');
    } catch (e) {
      console.error(e);
      setError(e.message || 'Registration failed');
    }
  };

  const doLogin = async (e) => {
    e.preventDefault();
    try {
      const { data } = await postLogin(creds);
      localStorage.setItem('token', data.token);
      setError('');
      nav('/admin');
    } catch (e) {
      console.error(e);
      setError(e.message || 'Login failed');
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

        <button type="submit" className="w-full bg-blue-600 text-white py-2 rounded">
          {isRegister ? 'Register' : 'Log In'}
        </button>
      </form>

      <p className="mt-4 text-center">
        {isRegister ? 'Already have an account?' : "Don't have an account?"}{' '}
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