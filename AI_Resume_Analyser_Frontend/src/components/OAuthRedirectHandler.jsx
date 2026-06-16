import React, { useEffect } from 'react';

export default function OAuthRedirectHandler({ setUser, setView }) {
  useEffect(() => {
    // Extract token from URL search params
    const params = new URLSearchParams(window.location.search);
    const token = params.get('token');

    if (token) {
      // Decode JWT to get user info (basic parsing)
      try {
        const payload = JSON.parse(atob(token.split('.')[1]));
        
        // Save to local storage
        localStorage.setItem('nexus_token', token);
        
        // Update user state
        setUser({
          email: payload.sub,
          username: payload.sub.split('@')[0], // Approximation, backend should ideally return username in JWT
          role: payload.role || 'USER',
          token: token
        });

        // Redirect to dashboard
        setView('dashboard');
        
        // Clean up the URL
        window.history.replaceState({}, document.title, window.location.pathname);
      } catch (e) {
        console.error("Failed to parse OAuth JWT token", e);
        setView('login');
      }
    } else {
      setView('login');
    }
  }, [setUser, setView]);

  return (
    <div className="container my-auto py-5 text-center">
      <div className="spinner-border text-indigo mb-3" role="status">
        <span className="visually-hidden">Loading...</span>
      </div>
      <p className="text-secondary">Completing Google Sign In...</p>
    </div>
  );
}
