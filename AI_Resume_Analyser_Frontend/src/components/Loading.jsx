import React from 'react';
import { RefreshCw } from 'lucide-react';

  // View: Loading/Parsing Screen
  export default function Loading({ loadingProgress, loadingStepText }) {
    return (
      <div className="container my-auto py-5 animate-fadein text-center">
        <div className="row justify-content-center">
          <div className="col-md-7 col-lg-6">

            {/* Spinning scanner graphic */}
            <div className="position-relative d-inline-block mb-5">
              <div
                className="position-absolute w-24 h-24 rounded-circle border border-indigo border-2 opacity-50"
                style={{
                  animation: 'spin-slow 4s linear infinite',
                  top: 'calc(50% - 48px)',
                  left: 'calc(50% - 48px)',
                  borderStyle: 'dashed'
                }}
              ></div>
              <div
                className="position-absolute w-28 h-28 rounded-circle border border-purple border-3 opacity-30"
                style={{
                  animation: 'spin-slow 6s linear infinite reverse',
                  top: 'calc(50% - 56px)',
                  left: 'calc(50% - 56px)'
                }}
              ></div>
              <div className="bg-indigo bg-opacity-10 p-4 rounded-circle text-indigo position-relative" style={{ width: '80px', height: '80px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                <RefreshCw size={40} className="animate-spin" style={{ animation: 'spin-slow 2s linear infinite' }} />
              </div>
            </div>

            <h3 className="text-white fw-bold mb-2">Analyzing Resume...</h3>
            <p className="text-secondary small mb-4">Please wait while the NEXUS AI parsing engine processes your details.</p>

            {/* Progress Bar */}
            <div className="progress bg-dark bg-opacity-60 border border-light border-opacity-10 rounded-pill mb-4" style={{ height: '8px' }}>
              <div
                className="progress-bar rounded-pill bg-gradient-to-r"
                role="progressbar"
                style={{
                  width: `${loadingProgress}%`,
                  backgroundImage: 'var(--sparkle-gradient)',
                  transition: 'width 0.4s ease'
                }}
                aria-valuenow={loadingProgress}
                aria-valuemin="0"
                aria-valuemax="100"
              ></div>
            </div>

            {/* Step Ticker Console */}
            <div className="glass-panel p-3 text-start font-monospace text-success small border border-light border-opacity-10">
              <span className="d-block mb-1 text-secondary">🤖 PARSER TELEMETRY FEED:</span>
              <span className="d-flex align-items-center gap-2">
                <span className="spinner-border spinner-border-sm text-success" role="status" style={{ width: '12px', height: '12px' }}></span>
                <span>{loadingStepText}</span>
              </span>
            </div>

          </div>
        </div>
      </div>
    )
  }
