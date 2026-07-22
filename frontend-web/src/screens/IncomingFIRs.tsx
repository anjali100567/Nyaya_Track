import React from 'react';
import Sidebar from '../components/Sidebar';
import TopNav from '../components/TopNav';
import { Search, ChevronRight, UserCheck, AlertTriangle } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

const IncomingFIRs: React.FC = () => {
  const navigate = useNavigate();

  const incomingList = [
    { id: 'FIR-2026-90D', title: 'Vehicle Theft', station: 'Central HQ', category: 'Theft', date: 'Oct 16, 2026', aiMatch: 'Insp. R. Sharma' },
    { id: 'FIR-2026-91E', title: 'Cyber Harassment', station: 'Cyber Cell', category: 'Cyber Crime', date: 'Oct 17, 2026', aiMatch: 'SI A. Gupta' },
    { id: 'FIR-2026-92F', title: 'Property Dispute', station: 'North West PS', category: 'Civil', date: 'Oct 17, 2026', aiMatch: 'Insp. V. Singh' }
  ];

  return (
    <div className="dashboard-layout">
      <Sidebar />
      <main className="dashboard-content">
        <TopNav title="Incoming FIR Queue" />
        
        <div className="animate-fade-in glass-card" style={{ padding: '24px' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '24px' }}>
            <div className="search-bar" style={{ width: '400px' }}>
              <Search size={18} className="search-icon" />
              <input type="text" placeholder="Filter by Category, Station, or ID..." style={{ width: '100%' }} />
            </div>
            <div style={{ display: 'flex', gap: '12px' }}>
              <select className="filter-select">
                <option>All Stations</option>
                <option>Central HQ</option>
              </select>
              <select className="filter-select">
                <option>Sort: Newest First</option>
                <option>Priority: High to Low</option>
              </select>
            </div>
          </div>

          <table className="cases-table">
            <thead>
              <tr>
                <th>FIR No</th>
                <th>Title</th>
                <th>Category</th>
                <th>Filing Date</th>
                <th>AI Suggested Officer</th>
                <th>Action</th>
              </tr>
            </thead>
            <tbody>
              {incomingList.map((fir, idx) => (
                <tr key={idx}>
                  <td><strong>{fir.id}</strong></td>
                  <td>{fir.title}</td>
                  <td><span className="priority-badge medium">{fir.category}</span></td>
                  <td>{fir.date}</td>
                  <td>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '6px', color: 'var(--primary-navy)' }}>
                      <UserCheck size={16} /> {fir.aiMatch}
                    </div>
                  </td>
                  <td>
                    <button className="btn btn-outline" style={{ padding: '8px 16px', fontSize: '13px' }} onClick={() => navigate('/admin/assign')}>
                      Review & Assign <ChevronRight size={16} style={{marginLeft: '4px'}}/>
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </main>
    </div>
  );
};

export default IncomingFIRs;
