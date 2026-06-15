import React from 'react';
import { Sparkles, UploadCloud, Server, Brain, History } from 'lucide-react';

  // View: Landing Page
  export default function Landing({ user, setView }) {
    return (
      <div className="container my-auto py-5 animate-slideup">
        <div className="row justify-content-center text-center">
          <div className="col-lg-8">
            <div className="badge bg-indigo bg-opacity-10 text-indigo py-2 px-3 rounded-pill mb-4 border border-indigo border-opacity-20 d-inline-flex align-items-center gap-2">
              <Sparkles size={14} className="text-indigo" />
              <span>Version 2.0 Enterprise AI Enabled</span>
            </div>

            <h1 className="display-3 fw-bold text-white mb-4 tracking-tight">
              Optimize Your Resume For <br />
              <span className="bg-gradient-to-r text-indigo-gradient font-extrabold">Applicant Tracking Systems</span>
            </h1>

            <p className="lead text-secondary mb-5 px-lg-5">
              NEXUS parses, segments, matches, and analyzes your resume using advanced text-extraction and deep AI matching. Predict your ATS score instantly, match with Job Descriptions, and extract key skills today.
            </p>

            <div className="pulse-btn-container mb-5">
              <div className="pulse-glow"></div>
              <button
                onClick={() => {
                  if (user) {
                    setView('dashboard')
                  } else {
                    alert('Please log in or register to scan your resume.')
                    setView('login')
                  }
                }}
                className="btn btn-nexus btn-lg px-5 py-3 rounded-3 fs-5 d-inline-flex align-items-center gap-3"
              >
                <UploadCloud size={24} />
                Upload Your Resume Here
              </button>
            </div>

            <div className="row g-4 justify-content-center mt-4">
              <div className="col-md-4">
                <div className="glass-panel p-4 h-100">
                  <div className="text-indigo mb-3"><Server size={32} /></div>
                  <h4 className="h5 text-white mb-2">Automated Parsing</h4>
                  <p className="small text-secondary">Advanced PDF & DOCX text segmentation using enterprise Apache PDFBox/POI library protocols.</p>
                </div>
              </div>
              <div className="col-md-4">
                <div className="glass-panel p-4 h-100">
                  <div className="text-purple mb-3"><Brain size={32} /></div>
                  <h4 className="h5 text-white mb-2">AI Intelligence</h4>
                  <p className="small text-secondary">Semantically compare resume credentials against Job Descriptions via customized AI scoring grids.</p>
                </div>
              </div>
              <div className="col-md-4">
                <div className="glass-panel p-4 h-100">
                  <div className="text-cyan mb-3"><History size={32} /></div>
                  <h4 className="h5 text-white mb-2">Dashboard Management</h4>
                  <p className="small text-secondary">Seamlessly track your past scans, compare score trajectories, and access detailed feedback.</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    )
  }
