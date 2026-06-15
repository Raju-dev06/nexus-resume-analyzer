import React from 'react';
import { UploadCloud } from 'lucide-react';

  // View: Signed-In Main Dashboard (Upload drag and drop modal/view)
  export default function Dashboard({ dragActive, handleDrag, handleDrop, handleFileInput }) {
    return (
      <div className="container py-4 animate-slideup">
        <div className="row justify-content-center text-center">
          <div className="col-lg-7">
            <h2 className="fw-bold text-white mb-2">Analyze A New Resume</h2>
            <p className="text-secondary mb-5">Drop your file below. NEXUS supports PDF and DOCX formats up to 10MB.</p>

            <div
              className={`upload-dropzone p-5 mb-4 ${dragActive ? 'dragging' : ''}`}
              onDragEnter={handleDrag}
              onDragLeave={handleDrag}
              onDragOver={handleDrag}
              onDrop={handleDrop}
            >
              <input
                type="file"
                id="file-upload-input"
                className="d-none"
                onChange={handleFileInput}
                accept=".pdf,.docx,.doc"
              />

              <label htmlFor="file-upload-input" className="cursor-pointer w-100 h-100 m-0">
                <div className="mb-4 text-indigo">
                  <UploadCloud size={64} strokeWidth={1.5} />
                </div>
                <h4 className="text-white h5 fw-semibold mb-2">Drag the resume or choose from your PC</h4>
                <p className="text-secondary small mb-3">Supported extensions: .pdf, .docx, .doc</p>
                <span className="btn btn-glass px-4 py-2 small">Browse Files</span>
              </label>
            </div>

            {/* Quick Helper */}
            <p className="text-secondary small text-start px-2">
              ⚠️ <strong>Security Note:</strong> All uploads are processed inside a isolated Java parsing sandbox. Your resume content is strictly protected and analyzed private.
            </p>
          </div>
        </div>
      </div>
    )
  }
