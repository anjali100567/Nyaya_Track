import React, { useState } from 'react';
import Sidebar from '../components/Sidebar';
import TopNav from '../components/TopNav';
import { Mic, MapPin, Upload, BrainCircuit, CheckCircle, ChevronRight, X } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import './RegisterFIR.css';

const RegisterFIR: React.FC = () => {
  const [step, setStep] = useState(1);
  const [isRecording, setIsRecording] = useState(false);
  const navigate = useNavigate();

  const handleNext = () => setStep(s => s + 1);

  return (
    <div className="dashboard-layout">
      <Sidebar />
      <main className="dashboard-content">
        <TopNav title="Register e-FIR" />
        
        <div className="registration-container">
          <div className="stepper glass-card">
            {[1, 2, 3, 4].map(s => (
              <div key={s} className={`step ${step >= s ? 'active' : ''}`}>
                <div className="step-number">{s}</div>
                <div className="step-label">
                  {s === 1 && 'Details'}
                  {s === 2 && 'Location'}
                  {s === 3 && 'Evidence'}
                  {s === 4 && 'AI Analysis'}
                </div>
                {s < 4 && <div className="step-line"></div>}
              </div>
            ))}
          </div>

          <div className="form-content glass-card animate-fade-in">
            {step === 1 && (
              <div className="step-panel">
                <h3>Incident Details</h3>
                <div className="input-group">
                  <label>Complaint Title</label>
                  <input type="text" placeholder="e.g. Mobile phone stolen at station" />
                </div>
                <div className="input-group">
                  <label>Category</label>
                  <select>
                    <option>Theft</option>
                    <option>Assault</option>
                    <option>Cyber Crime</option>
                  </select>
                </div>
                
                <div className="voice-input-section">
                  <div className="input-group">
                    <label>Description (Voice-to-Text supported)</label>
                    <textarea rows={5} placeholder="Speak or type your complaint here..."></textarea>
                  </div>
                  
                  <div className={`voice-btn-container ${isRecording ? 'recording' : ''}`}>
                    <button 
                      className={`btn-mic ${isRecording ? 'active' : ''}`}
                      onClick={() => setIsRecording(!isRecording)}
                    >
                      <Mic size={24} />
                    </button>
                    {isRecording && (
                      <div className="wave-animation">
                        <span></span><span></span><span></span><span></span>
                      </div>
                    )}
                    <span className="mic-label">{isRecording ? 'Listening in Hindi...' : 'Tap to speak (Hindi, English, etc.)'}</span>
                  </div>
                </div>
                <button className="btn btn-primary mt-4" onClick={handleNext}>Next Step <ChevronRight size={18}/></button>
              </div>
            )}

            {step === 2 && (
              <div className="step-panel">
                <h3>Incident Location</h3>
                <div className="input-group">
                  <label>Search Address</label>
                  <div className="search-loc">
                    <MapPin size={18} className="loc-icon"/>
                    <input type="text" placeholder="Search location..." />
                  </div>
                </div>
                <div className="map-placeholder">
                  <img src="https://maps.googleapis.com/maps/api/staticmap?center=New+Delhi&zoom=13&size=600x300&sensor=false" alt="Map" />
                  <div className="map-overlay">
                    <div className="ai-routing-badge">
                      <BrainCircuit size={16} /> AI Routing active
                    </div>
                    <p>Nearest Station: <strong>Connaught Place PS</strong></p>
                    <span className="warning-text">*May be transferred under Zero FIR</span>
                  </div>
                </div>
                <button className="btn btn-primary mt-4" onClick={handleNext}>Next Step <ChevronRight size={18}/></button>
              </div>
            )}

            {step === 3 && (
              <div className="step-panel">
                <h3>Upload Evidence</h3>
                <div className="upload-dropzone">
                  <Upload size={40} className="upload-icon" />
                  <h4>Drag & Drop files here</h4>
                  <p>Support for Images, Video, Audio, Documents</p>
                  <button className="btn btn-outline">Browse Files</button>
                </div>
                <button className="btn btn-primary mt-4" onClick={handleNext}>Run AI Analysis <BrainCircuit size={18}/></button>
              </div>
            )}

            {step === 4 && (
              <div className="step-panel">
                <div className="ai-analysis-header">
                  <BrainCircuit size={32} className="ai-icon" />
                  <h3>AI Complaint Analysis</h3>
                </div>
                
                <div className="analysis-card">
                  <h4>Detected Crime: Theft</h4>
                  <div className="bns-suggestions">
                    <div className="bns-tag">BNS Section 303 (Theft) <span className="conf">98% Match</span></div>
                  </div>
                  <p className="reasoning"><strong>Reasoning:</strong> The complaint explicitly mentions the unauthorized taking of a mobile phone from the victim's possession at the station.</p>
                </div>

                <div className="submit-section">
                  <button className="btn btn-primary full-width" onClick={() => navigate('/citizen/dashboard')}>
                    Submit FIR <CheckCircle size={18} />
                  </button>
                  <p className="disclaimer">By submitting, you declare all information is true to your knowledge.</p>
                </div>
              </div>
            )}
          </div>
        </div>
      </main>
    </div>
  );
};

export default RegisterFIR;
