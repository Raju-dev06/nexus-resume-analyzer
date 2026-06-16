import React from 'react';
import { AlertCircle, CheckCircle2, Mail, Lock } from 'lucide-react';

  // View: Login Page
  export default function Login({ loginEmail, setLoginEmail, loginPassword, setLoginPassword, authError, setAuthError, authSuccess, setAuthSuccess, handleSignIn, setView }) {
    return (
      <div className="container my-auto py-5 animate-slideup">
        <div className="row justify-content-center">
          <div className="col-md-6 col-lg-5">
            <div className="glass-panel p-5 border border-light border-opacity-10 position-relative overflow-hidden">
              <div className="position-absolute top-0 start-0 w-100 h-2 bg-gradient-to-r"></div>

              <h2 className="fw-bold text-white mb-2">Welcome Back</h2>
              <p className="text-secondary small mb-4">Please log in to your account to upload and parse resumes.</p>

              {authError && (
                <div className="alert alert-danger bg-danger bg-opacity-10 border border-danger border-opacity-20 rounded-3 d-flex align-items-center gap-2 small text-danger mb-4">
                  <AlertCircle size={16} />
                  <span>{authError}</span>
                </div>
              )}

              {authSuccess && (
                <div className="alert alert-success bg-success bg-opacity-10 border border-success border-opacity-20 rounded-3 d-flex align-items-center gap-2 small text-success mb-4">
                  <CheckCircle2 size={16} />
                  <span>{authSuccess}</span>
                </div>
              )}

              <form onSubmit={handleSignIn}>
                <div className="nexus-input-group">
                  <input
                    type="email"
                    className="form-control nexus-form-control"
                    placeholder="Enter email address"
                    value={loginEmail}
                    onChange={(e) => setLoginEmail(e.target.value)}
                    required
                  />
                  <Mail className="nexus-input-icon" size={18} />
                </div>

                <div className="nexus-input-group">
                  <input
                    type="password"
                    className="form-control nexus-form-control"
                    placeholder="Enter password"
                    value={loginPassword}
                    onChange={(e) => setLoginPassword(e.target.value)}
                    required
                  />
                  <Lock className="nexus-input-icon" size={18} />
                </div>

                <button type="submit" className="btn btn-nexus w-100 py-3 mb-3">
                  Log In
                </button>
              </form>

              <div className="position-relative my-4 text-center">
                <hr className="border-light border-opacity-10" />
                <span className="position-absolute top-50 start-50 translate-middle bg-dark px-3 text-secondary small">or</span>
              </div>

              <a 
                href={`${import.meta.env.VITE_API_BASE_URL}/oauth2/authorization/google`} 
                className="btn btn-outline-light w-100 py-3 mb-3 d-flex align-items-center justify-content-center gap-2"
              >
                <img src="https://upload.wikimedia.org/wikipedia/commons/5/53/Google_%22G%22_Logo.svg" alt="Google" width="18" />
                <span>Sign in with Google</span>
              </a>

              <div className="text-center mt-3">
                <span className="text-secondary small">Don't have an account? </span>
                <button
                  onClick={() => { setAuthError(''); setAuthSuccess(''); setView('signup') }}
                  className="btn btn-link text-indigo text-decoration-none small p-0 fw-semibold"
                >
                  Create an account
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    )
  }
