import React, { useState } from 'react';
import Sidebar from '../components/Sidebar';
import TopNav from '../components/TopNav';
import { BrainCircuit, Send, Sparkles } from 'lucide-react';
import { useLocation } from 'react-router-dom';
import './NyayaAI.css';

const NyayaAI: React.FC = () => {
  const location = useLocation();
  const role = location.pathname.split('/')[1] || 'citizen';
  const [query, setQuery] = useState('');
  
  let suggestionChips = [];
  if (role === 'citizen') {
    suggestionChips = ['Explain my FIR status', 'What documents do I need for vehicle theft?', 'BNS Section for Assault?'];
  } else if (role === 'officer') {
    suggestionChips = ['Draft Investigation Summary', 'Generate Missing Evidence Checklist', 'Suggest BNS for Cyber Fraud'];
  } else {
    suggestionChips = ['Predict Officer Workload next week', 'Detect Delayed Cases', 'Generate Analytics Summary'];
  }

  return (
    <div className="dashboard-layout">
      <Sidebar />
      <main className="dashboard-content">
        <TopNav title="NyayaAI Assistant" />
        
        <div className="ai-container animate-fade-in">
          <div className="ai-chat-window glass-card">
            <div className="ai-chat-header">
              <BrainCircuit size={28} className="gold-icon" />
              <div>
                <h3>NyayaAI</h3>
                <p>Your intelligent legal and operational assistant.</p>
              </div>
            </div>
            
            <div className="ai-chat-body">
              <div className="chat-bubble ai">
                <Sparkles size={16} />
                <p>Hello! I am NyayaAI. I can help you with your tasks today. Try clicking one of the suggestions below or ask me anything.</p>
              </div>
              
              <div className="suggestion-chips">
                {suggestionChips.map((chip, idx) => (
                  <button key={idx} className="chip" onClick={() => setQuery(chip)}>
                    {chip}
                  </button>
                ))}
              </div>
            </div>
            
            <div className="ai-chat-input-area">
              <input 
                type="text" 
                placeholder="Ask NyayaAI..." 
                value={query}
                onChange={(e) => setQuery(e.target.value)}
              />
              <button className="send-btn">
                <Send size={20} />
              </button>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
};

export default NyayaAI;
