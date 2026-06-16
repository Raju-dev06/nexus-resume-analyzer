import React, { useEffect, useState } from 'react';
import { CheckCircle2, XCircle } from 'lucide-react';

export default function VerifyEmail({ setView }) {
  const [status, setStatus] = useState('verifying'); // 'verifying', 'success', 'error'
  const [message, setMessage] = useState('');

  useEffect(() => {
    // Extract token from URL search params
    const params = new URLSearchParams(window.location.search);
    const token = params.get('token');

    if (!token) {
      setStatus('error');
      setMessage('No verification token found in the URL.');
      return;
    }

    // Call backend to verify token
    fetch(`${import.meta.env.VITE_API_BASE_URL}/api/auth/verify?token=${token}`)
      .then(async (res) => {
        if (res.ok) {
          const text = await res.text();
          setStatus('success');
          setMessage(text);
          setTimeout(() => {
            setView('login');
            // Clean up the URL
            window.history.replaceState({}, document.title, window.location.pathname);
          }, 3000);
        } else {
          const text = await res.text();
          setStatus('error');
          setMessage(text || 'Invalid or expired verification link.');
        }
      })
      .catch((err) => {
        setStatus('error');
        setMessage('Failed to connect to the server to verify your email.');
      });
  }, [setView]);

  return (
    <div className="container my-auto py-5 animate-slideup">
      <div className="row justify-content-center">
        <div className="col-md-6 col-lg-5 text-center">
          <div className="glass-panel p-5 border border-light border-opacity-10 position-relative overflow-hidden">
            <h2 className="fw-bold text-white mb-4">Email Verification</h2>

            {status === 'verifying' && (
              <div className="text-secondary">
                <div className="spinner-border text-indigo mb-3" role="status">
                  <span className="visually-hidden">Loading...</span>
                </div>
                <p>Verifying your email address...</p>
              </div>
            )}

            {status === 'success' && (
              <div className="text-success">
                <CheckCircle2 size={48} className="mb-3 mx-auto" />
                <p>{message}</p>
                <p className="small text-secondary">Redirecting to login...</p>
              </div>
            )}

            {status === 'error' && (
              <div className="text-danger">
                <XCircle size={48} className="mb-3 mx-auto" />
                <p>{message}</p>
                <button 
                  className="btn btn-outline-light mt-3" 
                  onClick={() => setView('login')}
                >
                  Go to Login
                </button>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
