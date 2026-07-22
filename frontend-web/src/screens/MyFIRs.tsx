import React from 'react';
import Sidebar from '../components/Sidebar';
import TopNav from '../components/TopNav';
import { Search, ChevronRight } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

const MyFIRs: React.FC = () => {
  const navigate = useNavigate();

  const firList = [
    { id: 'FIR-2026-89A', title: 'Mobile Theft at Station', station: 'New Delhi PS', status: 'Investigation', officer: 'Insp. R. Sharma', priority: 'High', date: 'Oct 12, 2026' },
    { id: 'FIR-2026-42B', title: 'Lost Wallet', station: 'Connaught Place PS', status: 'Disposed', officer: 'SI A. Gupta', priority: 'Low', date: 'Sep 05, 2026' },
    { id: 'FIR-2026-11C', title: 'Cyber Fraud (UPI)', station: 'Cyber Cell HQ', status: 'Charge Sheet', officer: 'Insp. V. Singh', priority: 'Medium', date: 'Aug 21, 2026' }
  ];

  return (
    <div className="dashboard-layout">
      <Sidebar />
      <main className="dashboard-content">
        <TopNav title="My FIRs" />
        
        <div className="animate-fade-in glass-card" style={{ padding: '24px' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '24px' }}>
            <div className="search-bar">
              <Search size={18} className="search-icon" />
              <input type="text" placeholder="Search by ID or Title..." />
            </div>
            <button className="btn btn-primary" onClick={() => navigate('/citizen/register-fir')}>File New FIR</button>
          </div>

          <table className="cases-table">
            <thead>
              <tr>
                <th>FIR No</th>
                <th>Title</th>
                <th>Police Station</th>
                <th>Status</th>
                <th>Assigned Officer</th>
                <th>Last Updated</th>
                <th>Action</th>
              </tr>
            </thead>
            <tbody>
              {firList.map((fir, idx) => (
                <tr key={idx}>
                  <td><strong>{fir.id}</strong></td>
                  <td>{fir.title}</td>
                  <td>{fir.station}</td>
                  <td><span className={`priority-badge ${fir.status === 'Disposed' ? 'low' : 'medium'}`}>{fir.status}</span></td>
                  <td>{fir.officer}</td>
                  <td>{fir.date}</td>
                  <td>
                    <button className="btn-text" onClick={() => navigate('/citizen/track')}>
                      Track <ChevronRight size={16} />
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

export default MyFIRs;
