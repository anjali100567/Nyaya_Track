import React from 'react';
import { NavLink } from 'react-router-dom';
import { Home, FileText, Activity, Bell, PhoneCall, LogOut, Scale } from 'lucide-react';
import './Sidebar.css';

const Sidebar: React.FC = () => {
  return (
    <aside className="sidebar glass-card">
      <div className="sidebar-header">
        <div className="logo-mini">
          <Scale size={24} className="gold-icon" />
        </div>
        <h2>NYAYATRACK</h2>
      </div>
      
      <nav className="sidebar-nav">
        <NavLink to="/citizen/dashboard" className={({isActive}) => `nav-item ${isActive ? 'active' : ''}`} end>
          <Home size={20} /> Dashboard
        </NavLink>
        <NavLink to="/citizen/register-fir" className={({isActive}) => `nav-item ${isActive ? 'active' : ''}`}>
          <FileText size={20} /> Register FIR
        </NavLink>
        <NavLink to="/citizen/track" className={({isActive}) => `nav-item ${isActive ? 'active' : ''}`}>
          <Activity size={20} /> Track Case
        </NavLink>
        <NavLink to="/citizen/notifications" className={({isActive}) => `nav-item ${isActive ? 'active' : ''}`}>
          <Bell size={20} /> Notifications
        </NavLink>
        <div className="nav-divider"></div>
        <a href="#" className="nav-item warning">
          <PhoneCall size={20} /> Emergency 112
        </a>
      </nav>

      <div className="sidebar-footer">
        <NavLink to="/login" className="nav-item logout">
          <LogOut size={20} /> Logout
        </NavLink>
      </div>
    </aside>
  );
};

export default Sidebar;
