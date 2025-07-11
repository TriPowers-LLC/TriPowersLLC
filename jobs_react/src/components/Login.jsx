// src/components/Login.jsx
import { useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

export default function Login() {
  const [creds, setCreds] = useState({ user: '', pass: '' });
  const [error, setError] = useState('');
  const nav = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const { data } = await axios.post('/api/login', creds);
      localStorage.setItem('token', data.token);
      nav('/admin');
    } catch (e) {
      setError('Invalid credentials');
    }
  };

  return (
    <form onSubmit={handleSubmit} className="max-w-sm mx-auto p-4">
      {error && <p className="text-red-500">{error}</p>}
      <label>Username
        <input
          type="text"
          value={creds.user}
          onChange={e => setCreds({...creds, user: e.target.value})}
          className="w-full border p-2 mb-2"
        />
      </label>
      <label>Password
        <input
          type="password"
          value={creds.pass}
          onChange={e => setCreds({...creds, pass: e.target.value})}
          className="w-full border p-2 mb-4"
        />
      </label>
      <button className="w-full bg-blue-600 text-white py-2">Log In</button>
    </form>
  );
}
