import React from 'react';
import Sidebar from '../components/Sidebar';
import TopNav from '../components/TopNav';
import { Briefcase, AlertTriangle, FileText, ChevronRight } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import './OfficerDashboard.css';

const OfficerDashboard: React.FC = () => {
  const navigate = useNavigate();

  const stats = [
    { label: 'Assigned Cases', value: 8, icon: <Briefcase size={24} />, color: 'navy' },
    { label: 'Pending Updates', value: 3, icon: <AlertTriangle size={24} />, color: 'amber' },
    { label: 'High Priority', value: 1, icon: <FileText size={24} />, color: 'red' }
  ];

  const recentCases = [
    { id: 'CASE-2026-89A', title: 'Mobile Theft at Station', status: 'Pending Investigation', priority: 'High', date: 'Oct 12, 2026' },
    { id: 'CASE-2026-42B', title: 'Assault near Market', status: 'Evidence Collection', priority: 'Medium', date: 'Oct 10, 2026' },
    { id: 'CASE-2026-11C', title: 'Cyber Fraud (UPI)', status: 'Charge Sheet Prep', priority: 'Low', date: 'Oct 01, 2026' }
  ];

  return (
    <div className="dashboard-layout">
      <Sidebar />
      <main className="dashboard-content">
        <TopNav title="Officer Portal" />
        
        <div className="animate-fade-in">
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

          <section className="cases-table-section glass-card mt-4">
            <div className="section-header">
              <h3>Active Cases</h3>
              <div className="filters">
                <select className="filter-select">
                  <option>All Priorities</option>
                  <option>High Priority</option>
                </select>
                <select className="filter-select">
                  <option>All Statuses</option>
                  <option>Pending Investigation</option>
                </select>
              </div>
            </div>
            
            <table className="cases-table">
              <thead>
                <tr>
                  <th>Case ID</th>
                  <th>Title</th>
                  <th>Priority</th>
                  <th>Status</th>
                  <th>Assigned Date</th>
                  <th>Action</th>
                </tr>
              </thead>
              <tbody>
                {recentCases.map((c, idx) => (
                  <tr key={idx}>
                    <td><strong>{c.id}</strong></td>
                    <td>{c.title}</td>
                    <td>
                      <span className={`priority-badge ${c.priority.toLowerCase()}`}>{c.priority}</span>
                    </td>
                    <td>{c.status}</td>
                    <td>{c.date}</td>
                    <td>
                      <button 
                        className="btn-text"
                        onClick={() => navigate('/officer/case/1')}
                      >
                        View <ChevronRight size={16} />
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </section>
        </div>
      </main>
    </div>
  );
};

export default OfficerDashboard;
