import React from 'react';
import Sidebar from '../components/Sidebar';
import TopNav from '../components/TopNav';
import { UserCheck, Search, ShieldCheck } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import './AssignOfficer.css';

const AssignOfficer: React.FC = () => {
  const navigate = useNavigate();

  return (
    <div className="dashboard-layout">
      <Sidebar />
      <main className="dashboard-content">
        <TopNav title="Assign Investigating Officer" />
        
        <div className="animate-fade-in assignment-grid">
          <div className="glass-card assign-details">
            <h3>FIR Details</h3>
            <div className="fir-summary">
              <h4>FIR-2026-90D</h4>
              <p className="type">Vehicle Theft</p>
              <p className="desc">Complainant states his Hero Honda Splendor (DL-XX-1234) was stolen from outside the station at 8 PM.</p>
              
              <div className="ai-suggestion-box mt-4">
                <h5>AI Recommended Expert: Theft</h5>
                <p>Based on BNS Section 303.</p>
              </div>
            </div>
          </div>

          <div className="glass-card officers-list">
            <div className="search-bar full">
              <Search size={18} className="search-icon" />
              <input type="text" placeholder="Search officers..." />
            </div>

            <div className="officer-card recommended mt-4">
              <div className="off-header">
                <div className="off-profile">
                  <ShieldCheck size={24} className="gold-icon" />
                  <div>
                    <h4>Insp. R. Sharma</h4>
                    <span>Expertise: Theft, Burglary</span>
                  </div>
                </div>
                <div className="workload-badge heavy">8 Active Cases</div>
              </div>
              <button 
                className="btn btn-primary full-width mt-3"
                onClick={() => navigate('/admin/dashboard')}
              >
                Assign to R. Sharma <UserCheck size={18} />
              </button>
            </div>

            <div className="officer-card mt-3">
              <div className="off-header">
                <div className="off-profile">
                  <ShieldCheck size={24} className="navy-icon" />
                  <div>
                    <h4>Sub-Insp. A. Gupta</h4>
                    <span>Expertise: Cyber, General</span>
                  </div>
                </div>
                <div className="workload-badge light">3 Active Cases</div>
              </div>
              <button 
                className="btn btn-outline full-width mt-3"
                onClick={() => navigate('/admin/dashboard')}
              >
                Assign to A. Gupta
              </button>
            </div>

          </div>
        </div>
      </main>
    </div>
  );
};

export default AssignOfficer;
