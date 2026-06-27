import React, { useState, useEffect } from 'react';
import { Users, FileText, Activity, ShieldCheck, Download, Trash2 } from 'lucide-react';

export default function AdminDashboard({ user }) {
  const [stats, setStats] = useState({ totalUsers: 0, totalScans: 0, avgAtsScore: 0, apiCost: 0 });
  const [scans, setScans] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchAdminData = async () => {
      try {
        const statsRes = await fetch(`${import.meta.env.VITE_API_BASE_URL}/api/admin/stats`, {
          headers: { 'Authorization': `Bearer ${user.token}` }
        });
        const scansRes = await fetch(`${import.meta.env.VITE_API_BASE_URL}/api/admin/scans`, {
          headers: { 'Authorization': `Bearer ${user.token}` }
        });

        if (statsRes.ok && scansRes.ok) {
          setStats(await statsRes.json());
          setScans(await scansRes.json());
        }
      } catch (err) {
        console.error("Failed to load admin data", err);
      } finally {
        setLoading(false);
      }
    };

    if (user && user.token) {
      fetchAdminData();
    }
  }, [user]);

  if (loading) {
    return (
      <div className="container py-5 text-center text-white">
        <div className="spinner-border text-indigo mb-3" role="status"></div>
        <h5>Loading Administrative Data...</h5>
      </div>
    );
  }

  return (
    <div className="container py-4 animate-slideup">
      {/* Header */}
      <div className="d-flex align-items-center justify-content-between mb-5">
        <div>
          <h2 className="fw-bold text-white mb-1 d-flex align-items-center gap-2">
            <ShieldCheck className="text-indigo" size={28} />
            Global Admin Dashboard
          </h2>
          <p className="text-secondary mb-0">System metrics and platform-wide scan monitoring.</p>
        </div>
      </div>

      {/* KPI Stat Cards */}
      <div className="row g-4 mb-5">
        <div className="col-md-4">
          <div className="glass-panel p-4 h-100 d-flex flex-column justify-content-center">
            <div className="d-flex align-items-center justify-content-between mb-3">
              <span className="text-muted small fw-bold text-uppercase">Total Users</span>
              <Users className="text-indigo" size={20} />
            </div>
            <h2 className="text-white fw-bold m-0">{stats.totalUsers}</h2>
          </div>
        </div>
        <div className="col-md-4">
          <div className="glass-panel p-4 h-100 d-flex flex-column justify-content-center">
            <div className="d-flex align-items-center justify-content-between mb-3">
              <span className="text-muted small fw-bold text-uppercase">Resumes Scanned</span>
              <FileText className="text-success" size={20} />
            </div>
            <h2 className="text-white fw-bold m-0">{stats.totalScans}</h2>
          </div>
        </div>
        <div className="col-md-4">
          <div className="glass-panel p-4 h-100 d-flex flex-column justify-content-center">
            <div className="d-flex align-items-center justify-content-between mb-3">
              <span className="text-muted small fw-bold text-uppercase">Avg Global ATS Score</span>
              <Activity className="text-warning" size={20} />
            </div>
            <h2 className="text-white fw-bold m-0">{stats.avgAtsScore}%</h2>
          </div>
        </div>
      </div>

      {/* Data Table */}
      <h5 className="text-white fw-bold mb-3">Platform Activity Log</h5>
      <div className="glass-panel overflow-hidden">
        <div className="table-responsive">
          <table className="table m-0 align-middle text-start" style={{ borderCollapse: 'collapse' }}>
            <thead>
              <tr style={{ background: 'rgba(99,102,241,0.08)', borderBottom: '1px solid rgba(255,255,255,0.08)' }}>
                <th className="py-3 px-4 border-0 fw-semibold text-uppercase" style={{ color: '#a5b4fc', fontSize: '0.75rem', letterSpacing: '0.08em' }}>ID</th>
                <th className="py-3 px-3 border-0 fw-semibold text-uppercase" style={{ color: '#a5b4fc', fontSize: '0.75rem', letterSpacing: '0.08em' }}>File Name</th>
                <th className="py-3 px-3 border-0 fw-semibold text-uppercase" style={{ color: '#a5b4fc', fontSize: '0.75rem', letterSpacing: '0.08em' }}>Target Role</th>
                <th className="py-3 px-3 border-0 fw-semibold text-uppercase" style={{ color: '#a5b4fc', fontSize: '0.75rem', letterSpacing: '0.08em' }}>Timestamp</th>
              </tr>
            </thead>
            <tbody>
              {scans.length > 0 ? (
                scans.map((scan) => (
                  <tr key={scan.id} className="history-table-row">
                    <td className="py-3 px-4 text-white small fw-bold">#{scan.id}</td>
                    <td className="py-3 text-white small text-truncate" style={{ maxWidth: '200px' }}>{scan.fileName}</td>
                    <td className="py-3 text-white small">{scan.roleApplied} <span className="text-secondary">({scan.experienceYears}y)</span></td>
                    <td className="py-3 text-secondary small">
                      {new Date(scan.uploadedAt).toLocaleString()}
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan="4" className="py-5 text-center text-secondary">
                    No scans have been processed on the platform yet.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
