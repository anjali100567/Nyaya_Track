import React from 'react';
import Sidebar from '../components/Sidebar';
import TopNav from '../components/TopNav';
import { FileText, Clock, CheckCircle, AlertTriangle, ArrowRight, QrCode, PhoneCall, Calendar } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import './CitizenDashboard.css';

const CitizenDashboard: React.FC = () => {
  const navigate = useNavigate();

  const stats = [
    { label: 'Total FIRs', value: 3, icon: <FileText size={24} />, color: 'navy' },
    { label: 'Active Cases', value: 1, icon: <Clock size={24} />, color: 'amber' },
    { label: 'Closed Cases', value: 2, icon: <CheckCircle size={24} />, color: 'green' },
    { label: 'Upcoming Hearings', value: 1, icon: <Calendar size={24} />, color: 'gold' }
  ];

  const recentFIRs = [
    { id: 'FIR-2026-89A', title: 'Mobile Theft at Station', date: 'Oct 12, 2026', status: 'Under Investigation' },
    { id: 'FIR-2026-42B', title: 'Lost Wallet', date: 'Sep 05, 2026', status: 'Disposed' }
  ];

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
                {recentFIRs.map((fir, idx) => (
                  <div key={idx} className="fir-row">
                    <div className="fir-details">
                      <span className="fir-id">{fir.id}</span>
                      <span className="fir-title">{fir.title}</span>
                      <span className="fir-date">{fir.date}</span>
                    </div>
                    <div className={`status-badge ${fir.status === 'Disposed' ? 'closed' : 'active'}`}>
                      {fir.status}
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
