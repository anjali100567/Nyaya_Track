import React from 'react';
import Sidebar from '../components/Sidebar';
import TopNav from '../components/TopNav';
import { BarChart3, Users, Clock, AlertTriangle, ShieldCheck } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import './AdminDashboard.css';

const AdminDashboard: React.FC = () => {
  const navigate = useNavigate();

  const stats = [
    { label: 'Total FIRs', value: 142, icon: <BarChart3 size={24} />, color: 'navy' },
    { label: 'Pending Assignment', value: 5, icon: <Clock size={24} />, color: 'amber' },
    { label: 'Escalated Cases', value: 2, icon: <AlertTriangle size={24} />, color: 'red' },
    { label: 'Avg Rating', value: '4.8/5', icon: <Users size={24} />, color: 'gold' }
  ];

  const unassignedFIRs = [
    { id: 'FIR-2026-90D', title: 'Vehicle Theft', date: 'Oct 16, 2026', type: 'Theft' },
    { id: 'FIR-2026-91E', title: 'Cyber Harassment', date: 'Oct 17, 2026', type: 'Cyber' }
  ];

  return (
    <div className="dashboard-layout">
      <Sidebar />
      <main className="dashboard-content">
        <TopNav title="Station Admin Dashboard" />
        
        <div className="animate-fade-in">
          <section className="stats-grid grid-4">
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

          <div className="admin-bottom-grid">
            <section className="glass-card admin-section">
              <div className="section-header">
                <h3>Needs Assignment</h3>
                <span className="badge amber">Action Required</span>
              </div>
              <div className="fir-list">
                {unassignedFIRs.map((fir, idx) => (
                  <div key={idx} className="fir-row">
                    <div className="fir-details">
                      <span className="fir-id">{fir.id}</span>
                      <span className="fir-title">{fir.title}</span>
                      <span className="fir-date">{fir.date}</span>
                    </div>
                    <button 
                      className="btn btn-outline"
                      onClick={() => navigate('/admin/assign')}
                    >
                      Assign Officer
                    </button>
                  </div>
                ))}
              </div>
            </section>

            <section className="glass-card admin-section">
              <div className="section-header">
                <h3>Officer Workload</h3>
              </div>
              <div className="officer-list">
                <div className="officer-row">
                  <div className="off-info">
                    <ShieldCheck size={20} className="off-icon"/>
                    <div>
                      <strong>Insp. R. Sharma</strong>
                      <span>Theft Expert</span>
                    </div>
                  </div>
                  <div className="workload-bar">
                    <div className="fill" style={{width: '80%', background: 'var(--warning-amber)'}}></div>
                    <span className="load-text">8 Cases</span>
                  </div>
                </div>
                <div className="officer-row mt-3">
                  <div className="off-info">
                    <ShieldCheck size={20} className="off-icon"/>
                    <div>
                      <strong>Sub-Insp. A. Gupta</strong>
                      <span>Cyber Expert</span>
                    </div>
                  </div>
                  <div className="workload-bar">
                    <div className="fill" style={{width: '30%', background: 'var(--forest-green)'}}></div>
                    <span className="load-text">3 Cases</span>
                  </div>
                </div>
              </div>
            </section>
          </div>
        </div>
      </main>
    </div>
  );
};

export default AdminDashboard;
