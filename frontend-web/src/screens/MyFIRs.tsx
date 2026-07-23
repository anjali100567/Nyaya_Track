import React, { useState, useEffect } from 'react';
import Sidebar from '../components/Sidebar';
import TopNav from '../components/TopNav';
import { Search, ChevronRight } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

import { getMyFIRs, FIR } from '../api/firs';

const MyFIRs: React.FC = () => {
  const navigate = useNavigate();
  const [firs, setFirs] = useState<FIR[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchFirs = async () => {
      try {
        const data = await getMyFIRs();
        setFirs(data);
      } catch (error) {
        console.error("Failed to fetch FIRs", error);
      } finally {
        setLoading(false);
      }
    };
    fetchFirs();
  }, []);

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
              {loading ? (
                <tr><td colSpan={7} style={{ textAlign: 'center' }}>Loading FIRs...</td></tr>
              ) : firs.length === 0 ? (
                <tr><td colSpan={7} style={{ textAlign: 'center' }}>No FIRs found.</td></tr>
              ) : firs.map((fir) => (
                <tr key={fir.id}>
                  <td><strong>{fir.fir_number}</strong></td>
                  <td>{fir.incident_type}</td>
                  <td>{fir.station_name}</td>
                  <td><span className={`priority-badge ${fir.status === 'disposed' ? 'low' : 'medium'}`}>{fir.status.replace('_', ' ').toUpperCase()}</span></td>
                  <td>{fir.case_details?.assigned_officer_name || 'Unassigned'}</td>
                  <td>{new Date(fir.date).toLocaleDateString()}</td>
                  <td>
                    <button className="btn-text" onClick={() => navigate(`/citizen/track/${fir.tracking_code}`)}>
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
