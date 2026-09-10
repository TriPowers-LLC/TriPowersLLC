import { useEffect, useState } from 'react';
import { useDispatch } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { loginSuccess } from '../slices/authSlice';

export default function ExternalAuthCallback() {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const [error, setError] = useState('');
  const [authResult] = useState(() => {
    const values = new URLSearchParams(window.location.hash.slice(1));
    return {
      error: values.get('error'),
      token: values.get('token'),
      user: {
        id: Number(values.get('id')),
        username: values.get('username'),
        role: values.get('role') || 'applicant',
      },
    };
  });

  useEffect(() => {
    window.history.replaceState(null, '', window.location.pathname);

    if (authResult.error || !authResult.token || !authResult.user.username) {
      setError(authResult.error || 'Google authentication did not return a valid login.');
      return;
    }

    dispatch(loginSuccess({ token: authResult.token, user: authResult.user }));
    navigate(authResult.user.role === 'admin' ? '/admin' : '/myapplications', { replace: true });
  }, [authResult, dispatch, navigate]);

  return (
    <div className="max-w-sm mx-auto p-4 text-center">
      <h2 className="text-2xl mb-4">Google sign-in</h2>
      {error ? (
        <>
          <p className="text-red-600 mb-4">{error}</p>
          <button type="button" onClick={() => navigate('/login')} className="text-blue-600 underline">
            Back to login
          </button>
        </>
      ) : (
        <p>Completing sign-in…</p>
      )}
    </div>
  );
}
