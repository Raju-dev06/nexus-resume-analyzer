import React from 'react';
import { RefreshCw, Download, Award, CheckCircle2, XCircle, Briefcase } from 'lucide-react';

const calculateCircleDash = (score) => {
  const radius = 70;
  const circumference = 2 * Math.PI * radius;
  const offset = circumference - (score / 100) * circumference;
  return { circumference, offset };
};

const getScoreColor = (score) => {
  if (score >= 75) return '#10b981';
  if (score >= 50) return '#f59e0b';
  return '#ef4444';
};

  // View: Results/ATS Score Panel (Fidelity Score Breakdown)
  export default function Results({ currentAnalysis, setView, handlePrintReport, matchingJobs, loadingJobs }) {
    if (!currentAnalysis) return null

    const { circumference, offset } = calculateCircleDash(currentAnalysis.atsScore)
    const scoreColor = getScoreColor(currentAnalysis.atsScore)

    return (
      <div className="container py-4 animate-slideup print-section">

        {/* Header Action Tools */}
        <div className="d-flex flex-wrap justify-content-between align-items-center mb-4 gap-3 print-hide">
          <button onClick={() => setView('analyze_setup')} className="btn btn-glass py-2 px-3 small d-inline-flex align-items-center gap-2">
            <RefreshCw size={14} />
            Scan New Resume
          </button>

          <div className="d-flex gap-2">
            <button onClick={handlePrintReport} className="btn btn-nexus py-2 px-3 small d-inline-flex align-items-center gap-2">
              <Download size={14} />
              Print PDF Report
            </button>
          </div>
        </div>

        {/* PRINT ONLY Header */}
        <div className="d-none print-show mb-5">
          <div className="d-flex align-items-center justify-content-between border-bottom pb-4 border-dark">
            <div>
              <h1 className="fw-bold m-0" style={{ color: '#0b0f19' }}>NEXUS AI Analysis Report</h1>
              <p className="text-secondary m-0">Advanced ATS Scoring & Resume Insights</p>
            </div>
            <div className="text-end">
              <h6 className="fw-bold m-0" style={{ color: '#0b0f19' }}>Candidate Assessment</h6>
              <span className="small text-secondary">Date Analyzed: {new Date(currentAnalysis.date).toLocaleDateString()}</span>
            </div>
          </div>
        </div>

        <div className="row g-4">

          {/* Left Column: ATS Score Radial Gauge & Fit Metrics */}
          <div className="col-lg-4">
            <div className="glass-panel p-4 text-center h-100">
              <h5 className="text-white fw-bold mb-4 text-start">ATS Score Match</h5>

              {/* Radial Circle score */}
              <div className="d-flex justify-content-center mb-4">
                <div className="radial-progress-container">
                  <svg width="160" height="160">
                    <circle className="circle-bg" cx="80" cy="80" r="70" />
                    <circle
                      className="circle-progress"
                      cx="80"
                      cy="80"
                      r="70"
                      stroke={scoreColor}
                      strokeDasharray={circumference}
                      strokeDashoffset={offset}
                      style={{ animation: 'drawStroke 1s ease forwards' }}
                    />
                  </svg>
                  <div className="position-absolute text-center">
                    <div className="circle-score-text">{currentAnalysis.atsScore}</div>
                    <div className="circle-score-label">ATS Index</div>
                  </div>
                </div>
              </div>

              {/* Status callout */}
              <div className="py-2 px-3 rounded-pill bg-opacity-10 d-inline-block mb-4 fw-semibold text-center" style={{ backgroundColor: scoreColor + '15', color: scoreColor, border: `1px solid ${scoreColor}30` }}>
                {currentAnalysis.atsScore >= 75 ? '⚡ Strong Match Fit' : currentAnalysis.atsScore >= 50 ? '⏳ Moderate Gaps Found' : '❌ Critical Revision Required'}
              </div>

              {/* Document Info Card */}
              <div className="border-top border-light border-opacity-10 pt-4 text-start">
                <h6 className="text-secondary small fw-semibold mb-3">ASSESSMENT PARAMETERS</h6>
                <div className="mb-2.5 small">
                  <span className="text-muted d-block">Target Role:</span>
                  <span className="text-white fw-medium">{currentAnalysis.role}</span>
                </div>
                <div className="mb-2.5 small">
                  <span className="text-muted d-block">Experience:</span>
                  <span className="text-white fw-medium">{currentAnalysis.experience} Years</span>
                </div>
                <div className="small">
                  <span className="text-muted d-block">Analyzed Document:</span>
                  <span className="text-white fw-medium text-truncate d-block" title={currentAnalysis.fileName}>
                    {currentAnalysis.fileName}
                  </span>
                </div>
              </div>

            </div>
          </div>

          {/* Right Column: Dynamic Tabs (Skills, Suggestions, Detailed metrics) */}
          <div className="col-lg-8">
            <div className="glass-panel p-4 h-100">

              {/* Overall AI feedback Summary */}
              <div className="mb-4 p-4 rounded-3 bg-indigo bg-opacity-10 border border-indigo border-opacity-10 text-start">
                <h5 className="text-white d-flex align-items-center gap-2 mb-2">
                  <Award className="text-indigo" size={20} />
                  Executive AI Summary
                </h5>
                <p className="text-secondary small mb-0">{currentAnalysis.feedback}</p>
              </div>

              {/* Fit metrics row */}
              <div className="row g-3 mb-4 text-start">
                <div className="col-md-6">
                  <div className="p-3 bg-dark bg-opacity-40 border border-light border-opacity-10 rounded-3">
                    <span className="text-muted small">Job Role Matching Score</span>
                    <div className="d-flex align-items-center gap-2 mt-1.5">
                      <div className="progress flex-grow-1 bg-dark bg-opacity-60" style={{ height: '6px' }}>
                        <div className="progress-bar bg-success" role="progressbar" style={{ width: `${currentAnalysis.roleMatch}%` }}></div>
                      </div>
                      <span className="text-white fw-bold small">{currentAnalysis.roleMatch}%</span>
                    </div>
                  </div>
                </div>
                <div className="col-md-6">
                  <div className="p-3 bg-dark bg-opacity-40 border border-light border-opacity-10 rounded-3">
                    <span className="text-muted small">Experience Level Match</span>
                    <div className="d-flex align-items-center gap-2 mt-1.5">
                      <div className="progress flex-grow-1 bg-dark bg-opacity-60" style={{ height: '6px' }}>
                        <div className="progress-bar bg-indigo" role="progressbar" style={{ width: `${currentAnalysis.expScore}%` }}></div>
                      </div>
                      <span className="text-white fw-bold small">{currentAnalysis.expScore}%</span>
                    </div>
                  </div>
                </div>
              </div>

              {/* Custom tabs structure */}
              <ul className="nav nav-tabs-custom mb-3 print-hide">
                <li className="nav-tab-item active">Analysis & Action Plan</li>
              </ul>

              {/* SKILLS BREAKDOWN TAB PANEL */}
              <div className="text-start">
                <h5 className="text-white fw-semibold mb-3">Extracted Skills Breakdown</h5>

                {/* 1. Matched Hard Skills */}
                <div className="mb-4">
                  <h6 className="text-success small fw-semibold mb-2">MATCHED HARD SKILLS ({currentAnalysis.skills.hard.length})</h6>
                  <div className="d-flex flex-wrap gap-2">
                    {currentAnalysis.skills.hard.map((skill, index) => (
                      <span key={index} className="skill-badge badge-hard">
                        <CheckCircle2 size={12} />
                        {skill}
                      </span>
                    ))}
                  </div>
                </div>

                {/* 2. Matched Soft Skills */}
                <div className="mb-4">
                  <h6 className="text-cyan small fw-semibold mb-2">MATCHED SOFT SKILLS ({currentAnalysis.skills.soft.length})</h6>
                  <div className="d-flex flex-wrap gap-2">
                    {currentAnalysis.skills.soft.map((skill, index) => (
                      <span key={index} className="skill-badge badge-soft">
                        <CheckCircle2 size={12} />
                        {skill}
                      </span>
                    ))}
                  </div>
                </div>

                {/* 3. Missing Skills / Gaps */}
                <div className="mb-4">
                  <h6 className="text-warning small fw-semibold mb-2">IDENTIFIED SKILL GAPS / MISSING SKILLS ({currentAnalysis.skills.missing.length})</h6>
                  <div className="d-flex flex-wrap gap-2">
                    {currentAnalysis.skills.missing.map((skill, index) => (
                      <span key={index} className="skill-badge badge-missing">
                        <XCircle size={12} />
                        {skill}
                      </span>
                    ))}
                  </div>
                </div>
              </div>

              {/* AI SUGGESTIONS TAB PANEL */}
              <div className="text-start mt-5 border-top border-light border-opacity-10 pt-4">
                <h5 className="text-white fw-semibold mb-3">AI Suggestions & Actionable Feedback</h5>

                <div className="row g-3">
                  {currentAnalysis.suggestions.map((sug, index) => (
                    <div key={index} className="col-md-6">
                      <div className="suggestion-accordion h-100">
                        <div className="accordion-header-custom bg-dark bg-opacity-20">
                          <span className="text-white small fw-bold">{sug.title}</span>
                          <span className="badge bg-indigo rounded-pill text-indigo bg-opacity-10 small">{sug.category}</span>
                        </div>
                        <div className="accordion-body-custom small text-secondary">
                          {sug.description}
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* MATCHING JOBS TAB PANEL */}
              <div className="text-start mt-5 border-top border-light border-opacity-10 pt-4">
                <h5 className="text-white fw-semibold mb-3 d-flex align-items-center gap-2">
                  <Briefcase size={20} className="text-indigo" />
                  Real-time Matching Jobs
                </h5>

                {loadingJobs ? (
                  <div className="text-center py-4 text-secondary small">
                    <div className="spinner-border spinner-border-sm text-indigo me-2" role="status"></div>
                    Fetching live job listings from web...
                  </div>
                ) : matchingJobs.length > 0 ? (
                  <div className="row g-3">
                    {matchingJobs.map((job, idx) => (
                      <div key={idx} className="col-md-6">
                        <div className="p-3 bg-dark bg-opacity-40 border border-light border-opacity-10 rounded-3 h-100 d-flex flex-column">
                          <h6 className="text-white small fw-bold text-truncate mb-1" title={job.job_title}>{job.job_title}</h6>
                          <div className="text-muted small mb-2">{job.employer_name} • {job.job_city || job.job_country || 'Remote'}</div>
                          <div className="mt-auto pt-2 text-end border-top border-light border-opacity-10">
                            <a href={job.job_apply_link} target="_blank" rel="noopener noreferrer" className="btn btn-nexus py-1 px-3 small text-white text-decoration-none" style={{ fontSize: '0.8rem' }}>Apply Now</a>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="p-3 bg-dark bg-opacity-40 border border-light border-opacity-10 rounded-3 text-secondary small">
                    No active job listings found for this role at the moment.
                  </div>
                )}
              </div>

            </div>
          </div>

        </div>
      </div>
    )
  }
