import React from 'react';
import { FileText, ArrowRight } from 'lucide-react';

  // View: Form Details Setup Page (Automatically loaded after drop/browse)
  export default function AnalyzeSetup({ uploadedFile, setUploadedFile, setView, handleAnalyzeSubmit, roleInput, setRoleInput, formErrors, experienceInput, setExperienceInput, jdInput, setJdInput }) {
    return (
      <div className="container py-4 animate-slideup">
        <div className="row justify-content-center">
          <div className="col-lg-8">
            <div className="glass-panel p-5 border border-light border-opacity-10 position-relative">
              <h2 className="fw-bold text-white mb-2">Configure Analysis Details</h2>
              <p className="text-secondary small mb-4">NEXUS needs some job parameters to score your credentials effectively.</p>

              {/* File Info Alert */}
              {uploadedFile && (
                <div className="glass-panel bg-dark bg-opacity-20 border border-light border-opacity-10 p-3 rounded-3 d-flex align-items-center justify-content-between mb-4">
                  <div className="d-flex align-items-center gap-3">
                    <div className="bg-indigo bg-opacity-10 p-2.5 rounded-3 text-indigo">
                      <FileText size={28} />
                    </div>
                    <div className="text-start">
                      <h6 className="text-white mb-0 fw-semibold">{uploadedFile.name}</h6>
                      <span className="text-secondary small">File Size: {uploadedFile.size}</span>
                    </div>
                  </div>
                  <button
                    onClick={() => { setUploadedFile(null); setView('dashboard') }}
                    className="btn btn-sm btn-outline-secondary rounded-pill py-1 px-3 text-secondary"
                  >
                    Change File
                  </button>
                </div>
              )}

              <form onSubmit={handleAnalyzeSubmit}>

                {/* File input (shows uploaded) */}
                <div className="mb-4">
                  <label className="form-label text-secondary small fw-medium">UPLOADED RESUME (ESSENTIAL)</label>
                  <input
                    type="text"
                    className="form-control nexus-form-control ps-3 text-white-50"
                    value={uploadedFile ? `${uploadedFile.name} (Ready)` : 'No file loaded'}
                    disabled
                  />
                </div>

                {/* Role input (essential) */}
                <div className="mb-4 text-start">
                  <label className="form-label text-secondary small fw-medium">TARGET JOB ROLE (ESSENTIAL)</label>
                  <div className="position-relative">
                    <input
                      type="text"
                      className={`form-control nexus-form-control ps-3 ${formErrors.role ? 'is-invalid border-danger' : ''}`}
                      placeholder="e.g. Senior Java Backend Developer"
                      value={roleInput}
                      onChange={(e) => setRoleInput(e.target.value)}
                      required
                    />

                    {/* Pre-fill quick selections */}
                    <div className="d-flex flex-wrap gap-2 mt-2">
                      <span className="badge bg-secondary cursor-pointer py-1.5 px-2.5 rounded" onClick={() => setRoleInput('Java Backend Developer')}>
                        + Java Developer
                      </span>
                      <span className="badge bg-secondary cursor-pointer py-1.5 px-2.5 rounded" onClick={() => setRoleInput('React Frontend Developer')}>
                        + React Developer
                      </span>
                      <span className="badge bg-secondary cursor-pointer py-1.5 px-2.5 rounded" onClick={() => setRoleInput('Fullstack Engineer')}>
                        + Fullstack Engineer
                      </span>
                      <span className="badge bg-secondary cursor-pointer py-1.5 px-2.5 rounded" onClick={() => setRoleInput('Data Scientist')}>
                        + Data Scientist
                      </span>
                    </div>
                  </div>
                  {formErrors.role && <div className="text-danger small mt-1">{formErrors.role}</div>}
                </div>

                {/* Experience input (essential) */}
                <div className="mb-4 text-start">
                  <label className="form-label text-secondary small fw-medium">CANDIDATE EXPERIENCE YEARS (ESSENTIAL)</label>
                  <input
                    type="number"
                    className={`form-control nexus-form-control ps-3 ${formErrors.experience ? 'is-invalid border-danger' : ''}`}
                    placeholder="Enter experience in years (e.g. 4)"
                    value={experienceInput}
                    onChange={(e) => setExperienceInput(e.target.value)}
                    min="0"
                    required
                  />
                  {formErrors.experience && <div className="text-danger small mt-1">{formErrors.experience}</div>}
                </div>

                {/* Job description input (not essential) */}
                <div className="mb-4 text-start">
                  <label className="form-label text-secondary small fw-medium d-flex justify-content-between">
                    <span>TARGET JOB DESCRIPTION (OPTIONAL)</span>
                    <span className="text-muted small">Supports rich comparison scoring</span>
                  </label>
                  <textarea
                    className="form-control nexus-form-control ps-3 h-28"
                    style={{ height: '120px' }}
                    placeholder="Paste target job responsibilities and core skills here..."
                    value={jdInput}
                    onChange={(e) => setJdInput(e.target.value)}
                  />
                </div>

                <div className="d-flex justify-content-end gap-3 mt-5">
                  <button type="button" onClick={() => setView('dashboard')} className="btn btn-glass px-4 py-2.5">
                    Back
                  </button>
                  <button type="submit" className="btn btn-nexus px-5 py-2.5 d-flex align-items-center gap-2">
                    Submit & Scan
                    <ArrowRight size={18} />
                  </button>
                </div>

              </form>
            </div>
          </div>
        </div>
      </div>
    )
  }
