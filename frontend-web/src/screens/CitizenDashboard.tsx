import React, { useState, useEffect } from 'react';
import Sidebar from '../components/Sidebar';
import TopNav from '../components/TopNav';
import { FileText, Clock, CheckCircle, AlertTriangle, ArrowRight, QrCode, PhoneCall, Calendar } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { getMyFIRs, FIR } from '../api/firs';
import './CitizenDashboard.css';

const CitizenDashboard: React.FC = () => {
  const navigate = useNavigate();
  const [firs, setFirs] = useState<FIR[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchFirs = async () => {
      try {
        const data = await getMyFIRs();
        setFirs(data);
      } catch (error) {
        console.error("Failed to fetch dashboard data", error);
      } finally {
        setLoading(false);
      }
    };
    fetchFirs();
  }, []);

  const totalFirs = firs.length;
  const closedCases = firs.filter(f => f.status === 'disposed').length;
  const activeCases = totalFirs - closedCases;

  const stats = [
    { label: 'Total FIRs', value: totalFirs, icon: <FileText size={24} />, color: 'navy' },
    { label: 'Active Cases', value: activeCases, icon: <Clock size={24} />, color: 'amber' },
    { label: 'Closed Cases', value: closedCases, icon: <CheckCircle size={24} />, color: 'green' },
    { label: 'Upcoming Hearings', value: 0, icon: <Calendar size={24} />, color: 'gold' }
  ];

  const recentFIRs = firs.slice(0, 3); // Get top 3 recent FIRs

  return (
    <div className="dashboard-layout">
      <Sidebar />
      <main className="dashboard-content">
        <TopNav title="Citizen Dashboard" />
        
        <div className="animate-fade-in">
          <section className="welcome-section glass-card">
            <div className="welcome-text">
              <h3>Welcome back, Ramesh!</h3>
              <p>Your digital portal for justice and transparency.</p>
            </div>
            <button className="btn btn-primary" onClick={() => navigate('/citizen/register-fir')}>
              Register New FIR <ArrowRight size={18} />
            </button>
          </section>

          <section className="stats-grid">
            {stats.map((stat, idx) => (
              <div key={idx} className={`stat-card glass-card ${stat.color}`}>
                <div className="stat-icon-wrapper">{stat.icon}</div>
                <div className="stat-info">
                  <span className="stat-value">{stat.value}</span>
                  <span className="stat-label">{stat.label}</span>
                </div>
              </div>
            ))}
          </section>

          <div className="bottom-grid">
            <section className="recent-firs glass-card">
              <div className="section-header">
                <h3>Recent FIRs</h3>
                <a href="#" className="view-all" onClick={(e) => {e.preventDefault(); navigate('/citizen/my-firs');}}>View All</a>
              </div>
              <div className="fir-list">
                {loading ? (
                  <p style={{ padding: '16px' }}>Loading recent FIRs...</p>
                ) : recentFIRs.length === 0 ? (
                  <p style={{ padding: '16px' }}>No FIRs registered yet.</p>
                ) : recentFIRs.map((fir) => (
                  <div key={fir.id} className="fir-row">
                    <div className="fir-details">
                      <span className="fir-id">{fir.fir_number}</span>
                      <span className="fir-title">{fir.incident_type}</span>
                      <span className="fir-date">{new Date(fir.created_at).toLocaleDateString()}</span>
                    </div>
                    <div className={`status-badge ${fir.status === 'disposed' ? 'closed' : 'active'}`}>
                      {fir.status.replace('_', ' ').toUpperCase()}
                    </div>
                  </div>
                ))}
              </div>
            </section>

            <div className="side-panels">
              <section className="quick-actions-panel glass-card mb-4">
                <div className="section-header">
                  <h3>Quick Actions</h3>
                </div>
                <div className="quick-actions-grid">
                  <button className="qa-btn" onClick={() => navigate('/citizen/register-fir')}>
                    <FileText size={20} /> File FIR
                  </button>
                  <button className="qa-btn" onClick={() => navigate('/citizen/track')}>
                    <Clock size={20} /> Track FIR
                  </button>
                  <button className="qa-btn">
                    <QrCode size={20} /> Scan QR
                  </button>
                  <button className="qa-btn red">
                    <PhoneCall size={20} /> Emergency
                  </button>
                </div>
              </section>
              
              <section className="notifications-panel glass-card">
                <div className="section-header">
                  <h3>Recent Activity</h3>
                </div>
                <div className="notification-list">
                  <div className="notification-item unread">
                    <div className="notif-icon"><AlertTriangle size={16} /></div>
                    <div className="notif-content">
                      <p><strong>FIR-2026-89A</strong> has been assigned to Officer Sharma.</p>
                      <span>2 hours ago</span>
                    </div>
                  </div>
                </div>
              </section>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
};

export default CitizenDashboard;
