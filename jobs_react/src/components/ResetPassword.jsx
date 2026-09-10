import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { confirmPasswordReset } from '../api/auth';

export default function ResetPassword() {
  const [credentials] = useState(() => {
    const values = new URLSearchParams(window.location.hash.slice(1));
    return { username: values.get('username') || '', token: values.get('token') || '' };
  });
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [message, setMessage] = useState('');
  const [complete, setComplete] = useState(false);
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    window.history.replaceState(null, '', window.location.pathname);
  }, []);

  const submit = async (event) => {
    event.preventDefault();
    if (newPassword !== confirmPassword) {
      setMessage('Passwords do not match.');
      return;
    }

    setSubmitting(true);
    setMessage('');
    try {
      const { data } = await confirmPasswordReset({ ...credentials, newPassword });
      setMessage(data?.message || 'Password reset successfully.');
      setComplete(true);
    } catch (error) {
      setMessage(error.message || 'The reset link is invalid or has expired.');
    } finally {
      setSubmitting(false);
    }
  };

  if (!credentials.username || !credentials.token) {
    return (
      <div className="max-w-sm mx-auto p-4 text-center">
        <h2 className="text-2xl mb-4">Invalid reset link</h2>
        <p className="mb-4">This password-reset link is incomplete. Request a new link from the login page.</p>
        <Link to="/login" className="text-blue-600 underline">Back to login</Link>
      </div>
    );
  }

  return (
    <div className="max-w-sm mx-auto p-4">
      <h2 className="text-2xl mb-4">Choose a new password</h2>
      {message && <p className={`mb-3 ${complete ? 'text-green-700' : 'text-red-600'}`}>{message}</p>}
      {complete ? (
        <Link to="/login" className="text-blue-600 underline">Continue to login</Link>
      ) : (
        <form onSubmit={submit}>
          <label className="block mb-3">
            New password
            <input type="password" value={newPassword} onChange={(event) => setNewPassword(event.target.value)} minLength={12} autoComplete="new-password" className="w-full border p-2 mt-1" required />
          </label>
          <label className="block mb-4">
            Confirm new password
            <input type="password" value={confirmPassword} onChange={(event) => setConfirmPassword(event.target.value)} minLength={12} autoComplete="new-password" className="w-full border p-2 mt-1" required />
          </label>
          <button type="submit" disabled={submitting} className="w-full bg-blue-600 text-white py-2 rounded disabled:opacity-50">
            {submitting ? 'Resetting…' : 'Reset password'}
          </button>
        </form>
      )}
    </div>
  );
}
