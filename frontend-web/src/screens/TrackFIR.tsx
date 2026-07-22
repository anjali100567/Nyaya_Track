import React from 'react';
import Sidebar from '../components/Sidebar';
import TopNav from '../components/TopNav';
import { FileText, User, Search, Scale, CheckCircle, Clock } from 'lucide-react';
import './TrackFIR.css';

const TrackFIR: React.FC = () => {
  const steps = [
    { label: 'FIR Filed', desc: 'Received at station', completed: true, date: 'Oct 12, 10:30 AM', icon: <FileText /> },
    { label: 'Assigned', desc: 'Officer Sharma assigned', completed: true, date: 'Oct 12, 02:15 PM', icon: <User /> },
    { label: 'Investigation', desc: 'Evidence collection in progress', completed: true, date: 'Oct 14, 09:00 AM', active: true, icon: <Search /> },
    { label: 'Charge Sheet', desc: 'Pending submission', completed: false, date: '-', icon: <FileText /> },
    { label: 'In Court', desc: 'Pending hearing', completed: false, date: '-', icon: <Scale /> },
    { label: 'Closed', desc: 'Case disposed', completed: false, date: '-', icon: <CheckCircle /> }
  ];

  return (
    <div className="dashboard-layout">
      <Sidebar />
      <main className="dashboard-content">
        <TopNav title="Track Case Progress" />
        
        <div className="tracking-container animate-fade-in">
          <div className="case-header glass-card">
            <div>
              <h3>FIR-2026-89A</h3>
              <p>Mobile Theft at Station</p>
            </div>
            <div className="status-badge active">Under Investigation</div>
          </div>

          <div className="timeline-card glass-card">
            <h4>Live Tracking</h4>
            <div className="timeline-container">
              {steps.map((step, idx) => (
                <div key={idx} className={`timeline-node ${step.completed ? 'completed' : ''} ${step.active ? 'active' : ''}`}>
                  <div className="node-icon">{step.icon}</div>
                  <div className="node-content">
                    <h5>{step.label}</h5>
                    <p>{step.desc}</p>
                    <span className="node-date"><Clock size={12} /> {step.date}</span>
                  </div>
                  {idx < steps.length - 1 && <div className="node-line"></div>}
                </div>
              ))}
            </div>
          </div>

          <div className="explainer-card glass-card">
            <h4>Status Explainer</h4>
            <div className="explainer-content">
              <div className="explainer-badge">Current: Investigation</div>
              <p><strong>Meaning:</strong> Evidence collection and witness interviews are currently in progress by the assigned investigating officer.</p>
              <p><strong>Expected Duration:</strong> Typically 7–15 days depending on the complexity of the crime.</p>
              <p><strong>Citizen Guidance:</strong> Please ensure you have uploaded any relevant evidence (photos, documents) to assist the officer.</p>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
};

export default TrackFIR;
