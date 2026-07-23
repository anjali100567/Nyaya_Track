import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Scale, Shield, User } from 'lucide-react';
import Logo from '../components/Logo';
import './Login.css';

const Login: React.FC = () => {
  const [role, setRole] = useState<'citizen' | 'officer' | 'admin'>('citizen');
  const navigate = useNavigate();

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    if (role === 'citizen') navigate('/citizen/dashboard');
    else if (role === 'officer') navigate('/officer/dashboard');
    else if (role === 'admin') navigate('/admin/dashboard');
  };

  return (
    <div className="login-split-container">
      {/* Left Branding Panel (Desktop Only) */}
      <div className="login-left-panel desktop-only animate-fade-in">
        <div className="branding-wrapper">
          <Logo size={140} />
          <h1 className="brand-text">NYAYA TRACK</h1>
          <div className="tagline-ribbon">Justice. Transparency. Trust.</div>
        </div>

        <div className="role-selector-vertical">
          <button 
            className={`role-btn-vertical citizen ${role === 'citizen' ? 'active' : ''}`}
            onClick={() => setRole('citizen')}
          >
            <div className="role-icon-wrapper orange"><User size={20} /></div>
            Citizen
          </button>
          
          <button 
            className={`role-btn-vertical officer ${role === 'officer' ? 'active' : ''}`}
            onClick={() => setRole('officer')}
          >
            <div className="role-icon-wrapper green"><Shield size={20} /></div>
            Police Officer
          </button>
          
          <button 
            className={`role-btn-vertical admin ${role === 'admin' ? 'active' : ''}`}
            onClick={() => setRole('admin')}
          >
            <div className="role-icon-wrapper purple"><Scale size={20} /></div>
            Admin
          </button>
        </div>
      </div>

      {/* Right Form Panel */}
      <div className="login-right-panel animate-fade-in" style={{ animationDelay: '0.1s' }}>
        <div className="login-form-wrapper">
          
          {/* Mobile Only Branding & Roles */}
          <div className="mobile-only mobile-header-section">
            <Logo size={80} className="mobile-logo" />
            <h1 className="mobile-brand">NYAYA TRACK</h1>
            <div className="tagline-ribbon mobile-ribbon">Justice. Transparency. Trust.</div>
            
            <div className="role-selector-horizontal">
              <button 
                className={`role-btn-horiz citizen ${role === 'citizen' ? 'active' : ''}`}
                onClick={() => setRole('citizen')}
              >
                <User size={16} /> Citizen
              </button>
              <button 
                className={`role-btn-horiz officer ${role === 'officer' ? 'active' : ''}`}
                onClick={() => setRole('officer')}
              >
                <Shield size={16} /> Officer
              </button>
              <button 
                className={`login-btn ${role}`}
                onClick={() => {
                  localStorage.setItem('authToken', `mock_${role}`);
                  navigate(`/${role}`);
                }}
              >
                Login
              </button>
            </div>
          </div>

          <div className="form-header">
            <h2>Welcome Back</h2>
            <p>Sign in to continue</p>
          </div>

          <form onSubmit={handleLogin} className="login-form">
            <div className="input-group">
              <label>Email / Mobile Number</label>
              <div className="input-with-icon">
                <User size={18} className="input-icon" />
                <input type="text" placeholder="Enter email or mobile" required />
              </div>
            </div>
            
            <div className="input-group">
              <label>Password</label>
              <div className="input-with-icon">
                <Shield size={18} className="input-icon" />
                <input type="password" placeholder="Enter password" required />
              </div>
            </div>
            
            <div className="form-options right-align">
              <a href="#" className="forgot-link">Forgot Password?</a>
            </div>

            <button type="submit" className="btn btn-login full-width">
              Login
            </button>
            
            <div className="signup-prompt">
              Don't have an account? <a href="#">Sign up</a>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default Login;
