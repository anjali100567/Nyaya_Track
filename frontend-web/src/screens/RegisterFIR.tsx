import React, { useState, useRef } from 'react';
import Sidebar from '../components/Sidebar';
import TopNav from '../components/TopNav';
import { Mic, MapPin, Upload, BrainCircuit, CheckCircle, ChevronRight, X, Loader } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import LocationPicker from '../components/LocationPicker';
import { createFIR } from '../api/firs';
import './RegisterFIR.css';

const RegisterFIR: React.FC = () => {
  const [step, setStep] = useState(1);
  const navigate = useNavigate();

  // Form State
  const [title, setTitle] = useState('');
  const [category, setCategory] = useState('Theft');
  const [description, setDescription] = useState('');
  const [locationAddress, setLocationAddress] = useState('');
  const [bnsSection, setBnsSection] = useState('Analysis pending...');
  const [bnsReasoning, setBnsReasoning] = useState('Awaiting manual submission or AI processing.');

  // Audio Recording State
  const [isRecording, setIsRecording] = useState(false);
  const [isProcessingAI, setIsProcessingAI] = useState(false);
  const [mediaRecorder, setMediaRecorder] = useState<MediaRecorder | null>(null);
  const audioChunks = useRef<Blob[]>([]);

  const handleNext = () => setStep(s => s + 1);

  const handleMicClick = async () => {
    if (isRecording && mediaRecorder) {
      mediaRecorder.stop();
      setIsRecording(false);
      // Stop all tracks to release the mic
      mediaRecorder.stream.getTracks().forEach(track => track.stop());
    } else {
      try {
        const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
        const recorder = new MediaRecorder(stream);
        
        recorder.ondataavailable = (e) => {
          if (e.data.size > 0) audioChunks.current.push(e.data);
        };
        
        recorder.onstop = async () => {
          const audioBlob = new Blob(audioChunks.current, { type: 'audio/webm' });
          audioChunks.current = []; // Reset chunks for next recording
          await processVoiceInput(audioBlob);
        };
        
        recorder.start();
        setMediaRecorder(recorder);
        setIsRecording(true);
      } catch (err) {
        console.error("Error accessing microphone", err);
        alert("Please enable microphone permissions to use Voice AI.");
      }
    }
  };

  const processVoiceInput = async (blob: Blob) => {
    setIsProcessingAI(true);
    const formData = new FormData();
    // Provide a generic filename that the backend will accept
    formData.append('audio', blob, 'recording.webm');
    
    try {
      const res = await fetch('http://localhost:8000/api/ai-extract-fir/', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('authToken') || 'mock_citizen'}`
        },
        body: formData
      });
      
      const data = await res.json();
      
      if (res.ok) {
        if (data.title) setTitle(data.title);
        if (data.incident_type) setCategory(data.incident_type);
        if (data.description) setDescription(data.description);
        if (data.location) setLocationAddress(data.location);
        if (data.bns_section) setBnsSection(data.bns_section);
        if (data.bns_reasoning) setBnsReasoning(data.bns_reasoning);
        
        // Show success alert
        alert("AI processing complete! Your details have been auto-filled. You can review and edit them manually.");
      } else {
        alert(data.error || "Failed to process audio via AI.");
      }
    } catch (e) {
      console.error(e);
      alert("Network error connecting to AI processing server.");
    } finally {
      setIsProcessingAI(false);
    }
  };

  const handleSubmit = async () => {
    try {
      await createFIR({
        incident_type: category,
        description,
        location: locationAddress,
        date: new Date().toISOString(),
        station: 1
      });
      alert('FIR Submitted Successfully!');
      navigate('/citizen/dashboard');
    } catch (e: any) {
      alert('Error submitting FIR: ' + (e.response?.data?.error || e.message));
    }
  };

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
                  <input 
                    type="text" 
                    placeholder="e.g. Mobile phone stolen at station" 
                    value={title}
                    onChange={(e) => setTitle(e.target.value)}
                  />
                </div>
                
                <div className="input-group">
                  <label>Category</label>
                  <select value={category} onChange={(e) => setCategory(e.target.value)}>
                    <option value="Theft">Theft</option>
                    <option value="Assault">Assault</option>
                    <option value="Cyber Crime">Cyber Crime</option>
                    <option value="Lost Property">Lost Property</option>
                    <option value="Fraud">Fraud</option>
                  </select>
                </div>
                
                <div className="voice-input-section">
                  <div className="input-group">
                    <label>Description (Voice AI translates regional languages to English)</label>
                    <textarea 
                      rows={5} 
                      placeholder="Speak in Bhojpuri, Maithili, or Hindi, or type manually..."
                      value={description}
                      onChange={(e) => setDescription(e.target.value)}
                    ></textarea>
                  </div>
                  
                  <div className={`voice-btn-container ${isRecording ? 'recording' : ''}`}>
                    <button 
                      className={`btn-mic ${isRecording ? 'active' : ''}`}
                      onClick={handleMicClick}
                      disabled={isProcessingAI}
                    >
                      {isProcessingAI ? <Loader className="spin" size={24} /> : <Mic size={24} />}
                    </button>
                    {isRecording && (
                      <div className="wave-animation">
                        <span></span><span></span><span></span><span></span>
                      </div>
                    )}
                    <span className="mic-label">
                      {isProcessingAI ? 'AI Translating & Extracting Details...' : 
                       isRecording ? 'Listening... Tap to stop' : 
                       'Tap to use Smart Voice AI (Auto-fills form)'}
                    </span>
                  </div>
                </div>
                
                <button 
                  className="btn btn-primary mt-4" 
                  onClick={handleNext}
                  disabled={!title.trim() || !description.trim()}
                  title={!title.trim() || !description.trim() ? "Title and Description are mandatory" : ""}
                >
                  Next Step <ChevronRight size={18}/>
                </button>
              </div>
            )}

            {step === 2 && (
              <div className="step-panel">
                <h3>Incident Location</h3>
                
                {locationAddress && (
                  <div className="alert-info" style={{ marginBottom: '16px', padding: '12px', background: 'rgba(56, 189, 248, 0.1)', border: '1px solid var(--primary-blue)', borderRadius: '8px' }}>
                    <strong>AI Detected Location:</strong> {locationAddress}
                  </div>
                )}
                
                <LocationPicker onLocationSelect={(loc) => setLocationAddress(loc.address)} />

                <div className="map-overlay" style={{ marginTop: '16px', position: 'relative', background: 'rgba(0,0,0,0.2)', padding: '12px', borderRadius: '8px' }}>
                  <div className="ai-routing-badge">
                    <BrainCircuit size={16} /> AI Routing active
                  </div>
                  <p>Nearest Station: <strong>Auto-detecting based on location...</strong></p>
                  <span className="warning-text">*May be transferred under Zero FIR</span>
                </div>
                <div style={{ display: 'flex', gap: '12px', marginTop: '16px' }}>
                  <button className="btn btn-outline" onClick={() => setStep(s => s - 1)}>Back</button>
                  <button 
                    className="btn btn-primary" 
                    onClick={handleNext}
                    disabled={!locationAddress.trim()}
                    title={!locationAddress.trim() ? "Location is mandatory" : ""}
                  >
                    Next Step <ChevronRight size={18}/>
                  </button>
                </div>
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
                <div style={{ display: 'flex', gap: '12px', marginTop: '16px' }}>
                  <button className="btn btn-outline" onClick={() => setStep(s => s - 1)}>Back</button>
                  <button className="btn btn-primary" onClick={handleNext}>Run AI Analysis <BrainCircuit size={18}/></button>
                </div>
              </div>
            )}

            {step === 4 && (
              <div className="step-panel">
                <div className="ai-analysis-header">
                  <BrainCircuit size={32} className="ai-icon" />
                  <h3>AI Complaint Analysis</h3>
                </div>
                
                <div className="analysis-card">
                  <h4>Detected Crime: {category}</h4>
                  <div className="bns-suggestions">
                    <div className="bns-tag">{bnsSection}</div>
                  </div>
                  <p className="reasoning"><strong>Reasoning:</strong> {bnsReasoning}</p>
                </div>

                <div className="submit-section" style={{ display: 'flex', gap: '12px', flexDirection: 'column' }}>
                  <div style={{ display: 'flex', gap: '12px', width: '100%' }}>
                    <button className="btn btn-outline" onClick={() => setStep(s => s - 1)} style={{ flex: 1 }}>Back</button>
                    <button className="btn btn-primary" onClick={handleSubmit} style={{ flex: 2 }}>
                      Submit FIR <CheckCircle size={18} />
                    </button>
                  </div>
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
