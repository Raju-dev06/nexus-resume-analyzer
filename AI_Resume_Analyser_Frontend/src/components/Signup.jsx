import React from 'react';
import { AlertCircle, CheckCircle2, Mail, Lock, User } from 'lucide-react';

  // View: Signup Page
  export default function Signup({ signupUsername, setSignupUsername, signupEmail, setSignupEmail, signupPassword, setSignupPassword, signupConfirmPassword, setSignupConfirmPassword, authError, setAuthError, authSuccess, setAuthSuccess, handleSignUp, setView }) {
    return (
      <div className="container my-auto py-5 animate-slideup">
        <div className="row justify-content-center">
          <div className="col-md-6 col-lg-5">
            <div className="glass-panel p-5 border border-light border-opacity-10 position-relative overflow-hidden">
              <div className="position-absolute top-0 start-0 w-100 h-2 bg-gradient-to-r"></div>

              <h2 className="fw-bold text-white mb-2">Create Account</h2>
              <p className="text-secondary small mb-4">Register your credentials to start scoring your resumes.</p>

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

              <form onSubmit={handleSignUp}>
                <div className="nexus-input-group">
                  <input
                    type="text"
                    className="form-control nexus-form-control"
                    placeholder="Create Username"
                    value={signupUsername}
                    onChange={(e) => setSignupUsername(e.target.value)}
                    required
                  />
                  <User className="nexus-input-icon" size={18} />
                </div>

                <div className="nexus-input-group">
                  <input
                    type="email"
                    className="form-control nexus-form-control"
                    placeholder="Your Email Address"
                    value={signupEmail}
                    onChange={(e) => setSignupEmail(e.target.value)}
                    required
                  />
                  <Mail className="nexus-input-icon" size={18} />
                </div>

                <div className="nexus-input-group">
                  <input
                    type="password"
                    className="form-control nexus-form-control"
                    placeholder="Create Password"
                    value={signupPassword}
                    onChange={(e) => setSignupPassword(e.target.value)}
                    required
                  />
                  <Lock className="nexus-input-icon" size={18} />
                </div>

                <div className="nexus-input-group">
                  <input
                    type="password"
                    className="form-control nexus-form-control"
                    placeholder="Confirm Password"
                    value={signupConfirmPassword}
                    onChange={(e) => setSignupConfirmPassword(e.target.value)}
                    required
                  />
                  <Lock className="nexus-input-icon" size={18} />
                </div>

                <button type="submit" className="btn btn-nexus w-100 py-3 mb-3">
                  Sign Up
                </button>
              </form>

              <div className="text-center mt-3">
                <span className="text-secondary small">Already have an account? </span>
                <button
                  onClick={() => { setAuthError(''); setAuthSuccess(''); setView('login') }}
                  className="btn btn-link text-indigo text-decoration-none small p-0 fw-semibold"
                >
                  Login Link
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    )
  }
