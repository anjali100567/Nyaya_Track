import React, { useState } from 'react';
import Sidebar from '../components/Sidebar';
import TopNav from '../components/TopNav';
import { Upload, Camera, FileText, BrainCircuit, Activity, Edit3 } from 'lucide-react';
import './CaseDetail.css';

const CaseDetail: React.FC = () => {
  const [activeTab, setActiveTab] = useState<'overview' | 'evidence' | 'ai'>('overview');

  return (
    <div className="dashboard-layout">
      <Sidebar />
      <main className="dashboard-content">
        <TopNav title="Case Details: CASE-2026-89A" />
        
        <div className="animate-fade-in">
          <div className="case-header-actions glass-card">
            <div>
              <h2>Mobile Theft at Station</h2>
              <p>Filed by: Ramesh Kumar | Date: Oct 12, 2026</p>
            </div>
            <div className="action-buttons">
              <button className="btn btn-outline"><Edit3 size={18} /> Update Status</button>
              <button className="btn btn-primary"><FileText size={18} /> Generate Report</button>
            </div>
          </div>

          <div className="tabs glass-card">
            <button className={`tab ${activeTab === 'overview' ? 'active' : ''}`} onClick={() => setActiveTab('overview')}>
              <Activity size={18} /> Overview
            </button>
            <button className={`tab ${activeTab === 'evidence' ? 'active' : ''}`} onClick={() => setActiveTab('evidence')}>
              <Camera size={18} /> Evidence
            </button>
            <button className={`tab ${activeTab === 'ai' ? 'active' : ''}`} onClick={() => setActiveTab('ai')}>
              <BrainCircuit size={18} /> AI Analysis
            </button>
          </div>

          {activeTab === 'overview' && (
            <div className="tab-content glass-card">
              <h3>Incident Description</h3>
              <p className="desc-text">Victim states that while waiting at Platform 2 of New Delhi Railway Station around 2:30 PM, an unidentified male snatched his Samsung Galaxy S23 from his hand and ran towards the exit. The victim tried to chase but lost the suspect in the crowd.</p>
              
              <h3 className="mt-4">Current Status</h3>
              <div className="status-timeline">
                <div className="timeline-item">
                  <div className="dot"></div>
                  <div className="content">
                    <strong>Investigation Started</strong>
                    <span>Oct 14, 2026 - Officer Sharma</span>
                    <p>Visited the station and requested CCTV footage from Platform 2.</p>
                  </div>
                </div>
                <div className="timeline-item">
                  <div className="dot"></div>
                  <div className="content">
                    <strong>Case Assigned</strong>
                    <span>Oct 12, 2026 - Admin</span>
                  </div>
                </div>
              </div>
            </div>
          )}

          {activeTab === 'evidence' && (
            <div className="tab-content glass-card">
              <div className="evidence-header">
                <h3>Case Evidence</h3>
                <button className="btn btn-primary"><Upload size={18} /> Upload New Evidence</button>
              </div>
              
              <div className="evidence-grid">
                <div className="evidence-item">
                  <div className="evidence-thumb video">
                    <Camera size={32} />
                  </div>
                  <div className="evidence-info">
                    <h4>CCTV_Platform2.mp4</h4>
                    <span>Uploaded by Officer Sharma • Oct 15</span>
                    <span className="hash">SHA256: 8f4e...99a2</span>
                  </div>
                </div>
              </div>
            </div>
          )}

          {activeTab === 'ai' && (
            <div className="tab-content glass-card">
              <div className="ai-header">
                <BrainCircuit size={32} className="ai-icon" />
                <h3>AI Assistant Suggestions</h3>
              </div>
              
              <div className="bns-card">
                <h4>Suggested BNS Sections</h4>
                <ul>
                  <li><strong>Section 303 (Theft):</strong> Punishment for theft. High confidence based on the description of snatching property.</li>
                </ul>
                <button className="btn btn-outline mt-4">Confirm BNS Sections</button>
              </div>
            </div>
          )}
        </div>
      </main>
    </div>
  );
};

export default CaseDetail;
