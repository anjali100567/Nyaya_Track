import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Scale, Shield, User, ChevronRight } from 'lucide-react';
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
    <div className="login-container">
      <div className="login-glass-panel animate-fade-in">
        <div className="login-header">
          <div className="logo-circle">
            <Scale className="logo-icon" size={40} />
          </div>
          <h1>NYAYATRACK</h1>
          <p className="tagline">Justice. Transparency. Trust.</p>
        </div>

        <div className="role-selector">
          <button 
            className={`role-btn ${role === 'citizen' ? 'active' : ''}`}
            onClick={() => setRole('citizen')}
          >
            <User size={20} /> Citizen
          </button>
          <button 
            className={`role-btn ${role === 'officer' ? 'active' : ''}`}
            onClick={() => setRole('officer')}
          >
            <Shield size={20} /> Officer
          </button>
          <button 
            className={`role-btn ${role === 'admin' ? 'active' : ''}`}
            onClick={() => setRole('admin')}
          >
            <Scale size={20} /> Admin
          </button>
        </div>

        <form onSubmit={handleLogin} className="login-form">
          <div className="input-group">
            <label>Phone Number or Aadhar</label>
            <input type="text" placeholder="Enter details" required />
          </div>
          <div className="input-group">
            <label>Password</label>
            <input type="password" placeholder="••••••••" required />
          </div>
          
          <div className="form-options">
            <label className="checkbox-container">
              <input type="checkbox" />
              <span className="checkmark"></span>
              Remember me
            </label>
            <a href="#" className="forgot-link">Forgot password?</a>
          </div>

          <button type="submit" className="btn btn-primary full-width">
            Secure Login <ChevronRight size={18} />
          </button>
          
          <div className="divider"><span>OR</span></div>
          
          <button type="button" className="btn btn-outline full-width google-btn">
            <img src="https://www.gstatic.com/firebasejs/ui/2.0.0/images/auth/google.svg" alt="Google" width="18" />
            Sign in with Google
          </button>
        </form>
      </div>
    </div>
  );
};

export default Login;
