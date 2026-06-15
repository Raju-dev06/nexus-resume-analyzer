import React from 'react';
import { Search, FileText, Eye, Trash2, FolderOpen } from 'lucide-react';

const getScoreColor = (score) => {
  if (score >= 75) return '#10b981';
  if (score >= 50) return '#f59e0b';
  return '#ef4444';
};

  // View: Resume Scan History Logs
  export default function History({ historyList, historySearchQuery, setHistorySearchQuery, setCurrentAnalysis, setView, handleDeleteHistory, filteredHistory }) {
    return (
      <div className="container py-4 animate-slideup">

        {/* Page Header */}
        <div className="d-flex flex-wrap justify-content-between align-items-start mb-5 gap-3">
          <div>
            <h2 className="fw-bold text-white mb-1">Resume History Log</h2>
            <p className="mb-0" style={{ color: '#9ca3af', fontSize: '0.9rem' }}>
              Review past scans, calculated ATS scores, and target roles.
              <span className="ms-2 badge rounded-pill" style={{ background: 'rgba(99,102,241,0.15)', color: '#818cf8', border: '1px solid rgba(99,102,241,0.3)', fontWeight: 600 }}>
                {historyList.length} record{historyList.length !== 1 ? 's' : ''}
              </span>
            </p>
          </div>
        </div>

        {/* Filter Bar */}
        <div className="glass-panel p-3 mb-4 d-flex align-items-center gap-3">
          <div className="position-relative flex-grow-1" style={{ maxWidth: '480px' }}>
            <span className="position-absolute" style={{ left: '14px', top: '50%', transform: 'translateY(-50%)', color: '#6b7280', pointerEvents: 'none' }}>
              <Search size={16} />
            </span>
            <input
              type="text"
              className="form-control"
              style={{
                background: 'rgba(17,24,39,0.6)',
                border: '1px solid rgba(255,255,255,0.1)',
                color: '#f3f4f6',
                borderRadius: '10px',
                padding: '10px 16px 10px 40px',
                fontSize: '0.9rem',
                outline: 'none'
              }}
              placeholder="Filter logs by Role or File Name..."
              value={historySearchQuery}
              onChange={(e) => setHistorySearchQuery(e.target.value)}
            />
          </div>
          {historySearchQuery && (
            <button onClick={() => setHistorySearchQuery('')} className="btn btn-sm" style={{ color: '#9ca3af', background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.1)', borderRadius: '8px' }}>
              Clear
            </button>
          )}
        </div>

        {/* History Table */}
        <div className="glass-panel overflow-hidden">
          <div className="table-responsive">
            <table className="table m-0 align-middle text-start" style={{ borderCollapse: 'collapse' }}>
              <thead>
                <tr style={{ background: 'rgba(99,102,241,0.08)', borderBottom: '1px solid rgba(255,255,255,0.08)' }}>
                  <th className="py-3 px-4 border-0 fw-semibold" style={{ color: '#a5b4fc', fontSize: '0.75rem', textTransform: 'uppercase', letterSpacing: '0.08em', whiteSpace: 'nowrap' }}>Resume Name</th>
                  <th className="py-3 px-3 border-0 fw-semibold" style={{ color: '#a5b4fc', fontSize: '0.75rem', textTransform: 'uppercase', letterSpacing: '0.08em' }}>Target Job Role</th>
                  <th className="py-3 px-3 border-0 fw-semibold text-center" style={{ color: '#a5b4fc', fontSize: '0.75rem', textTransform: 'uppercase', letterSpacing: '0.08em' }}>ATS Score</th>
                  <th className="py-3 px-3 border-0 fw-semibold" style={{ color: '#a5b4fc', fontSize: '0.75rem', textTransform: 'uppercase', letterSpacing: '0.08em' }}>Date Scanned</th>
                  <th className="py-3 px-4 border-0 fw-semibold text-end" style={{ color: '#a5b4fc', fontSize: '0.75rem', textTransform: 'uppercase', letterSpacing: '0.08em' }}>Action</th>
                </tr>
              </thead>
              <tbody>
                {filteredHistory.length > 0 ? (
                  filteredHistory.map((item) => (
                    <tr key={item.id} className="history-table-row">
                      <td className="py-3 px-4 fw-medium text-white">
                        <div className="d-flex align-items-center gap-2">
                          <span className="history-file-icon"><FileText size={18} /></span>
                          <span className="text-truncate" style={{ maxWidth: '200px' }}>{item.fileName}</span>
                        </div>
                      </td>
                      <td className="py-3">
                        <div className="fw-semibold text-white">{item.role}</div>
                        <div className="small mt-1" style={{ color: '#9ca3af' }}>{item.experience} Yrs Experience</div>
                      </td>
                      <td className="py-3 text-center">
                        <span
                          className="history-score-badge"
                          style={{
                            backgroundColor: getScoreColor(item.atsScore) + '20',
                            color: getScoreColor(item.atsScore),
                            border: `1px solid ${getScoreColor(item.atsScore)}40`,
                            boxShadow: `0 0 8px ${getScoreColor(item.atsScore)}20`
                          }}
                        >
                          {item.atsScore}%
                        </span>
                      </td>
                      <td className="py-3" style={{ color: '#cbd5e1' }}>
                        <div>{new Date(item.date).toLocaleDateString('en-GB', { day: '2-digit', month: 'short', year: 'numeric' })}</div>
                        <div className="small mt-1" style={{ color: '#9ca3af' }}>{new Date(item.date).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</div>
                      </td>
                      <td className="py-3 px-4">
                        <div className="d-flex gap-2 justify-content-end">
                          <button
                            onClick={() => { setCurrentAnalysis(item); setView('results') }}
                            className="history-action-btn history-view-btn"
                            title="View Analysis"
                          >
                            <Eye size={15} />
                          </button>
                          <button
                            onClick={() => handleDeleteHistory(item.id)}
                            className="history-action-btn history-delete-btn"
                            title="Delete Log"
                          >
                            <Trash2 size={15} />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan="5" className="py-5 text-center" style={{ background: 'transparent' }}>
                      <div className="mb-3" style={{ color: '#4b5563' }}><FolderOpen size={48} /></div>
                      <p className="fw-semibold mb-1" style={{ color: '#9ca3af' }}>
                        {historySearchQuery ? 'No results match your filter.' : 'No scan history yet.'}
                      </p>
                      <p className="small mb-0" style={{ color: '#6b7280' }}>
                        {historySearchQuery ? 'Try a different search term.' : 'Upload and scan a resume to start building your history.'}
                      </p>
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>

      </div>
    )
  }
