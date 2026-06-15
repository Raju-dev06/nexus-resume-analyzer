import React from 'react';
import { User, LogOut } from 'lucide-react';

  // Header Navigation Component
  export default function Header({ view, setView, user, handleSignOut, setAuthError, setAuthSuccess }) {
    return (
      <header className="navbar navbar-expand-lg navbar-dark bg-transparent py-4 px-3 border-bottom border-light border-opacity-10 mb-4 animate-fadein">
        <div className="container-fluid">
          <div className="navbar-brand cursor-pointer" onClick={() => setView(user ? 'dashboard' : 'landing')}>
            <span className="nexus-logo">
              <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                <defs>
                  <linearGradient id="nexus-gradient" x1="0%" y1="0%" x2="100%" y2="100%">
                    <stop offset="0%" stopColor="#6366f1" />
                    <stop offset="100%" stopColor="#a855f7" />
                  </linearGradient>
                </defs>
                <path d="M12 2L14.85 9.15L22 12L14.85 14.85L12 22L9.15 14.85L2 12L9.15 9.15L12 2Z" fill="url(#nexus-gradient)" />
              </svg>
              NEXUS
            </span>
          </div>

          <div className="d-flex align-items-center gap-3">
            {user ? (
              <>
                <nav className="d-none d-md-flex align-items-center gap-3 me-3">
                  <button
                    onClick={() => setView('dashboard')}
                    className={`btn btn-link text-decoration-none py-1 px-2 ${view === 'dashboard' || view === 'analyze_setup' ? 'text-white border-bottom border-indigo border-2' : 'text-secondary'}`}
                  >
                    Dashboard
                  </button>
                  <button
                    onClick={() => setView('history')}
                    className={`btn btn-link text-decoration-none py-1 px-2 ${view === 'history' ? 'text-white border-bottom border-indigo border-2' : 'text-secondary'}`}
                  >
                    History Logs
                  </button>
                </nav>

                <div className="dropdown d-flex align-items-center gap-2 bg-dark bg-opacity-40 py-2 px-3 rounded-pill border border-light border-opacity-10">
                  <User size={16} className="text-secondary" />
                  <span className="text-white small fw-medium">{user.username}</span>

                  <button onClick={handleSignOut} className="btn p-0 text-secondary hover-white border-0 ms-2" title="Sign Out">
                    <LogOut size={16} />
                  </button>
                </div>
              </>
            ) : (
              <div className="d-flex align-items-center gap-2">
                <button
                  onClick={() => { setAuthError(''); setAuthSuccess(''); setView('login') }}
                  className={`btn rounded-pill text-decoration-none fw-medium transition-all ${view === 'signup' ? 'btn-nexus px-4 py-2 fs-6' : 'btn-nexus py-2 px-4'}`}
                >
                  Sign In
                </button>
                <button
                  onClick={() => { setAuthError(''); setAuthSuccess(''); setView('signup') }}
                  className={`btn rounded-pill text-decoration-none fw-medium transition-all ${view === 'signup' ? 'btn-nexus px-4 py-2 fs-6' : 'btn-nexus py-2 px-4'}`}
                >
                  Sign Up
                </button>
              </div>
            )}
          </div>
        </div>
      </header>
    )
  }
