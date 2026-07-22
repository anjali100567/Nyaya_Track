import React from 'react';
import { NavLink, useLocation } from 'react-router-dom';
import { Home, FileText, Bell, User, PlusCircle } from 'lucide-react';
import './BottomNav.css';

const BottomNav: React.FC = () => {
  const location = useLocation();
  
  if (location.pathname === '/login' || location.pathname === '/') {
    return null;
  }

  return (
    <nav className="bottom-nav">
      <NavLink to="/citizen/dashboard" className={({isActive}) => `nav-item ${isActive ? 'active' : ''}`} end>
        <Home size={24} />
        <span>Home</span>
      </NavLink>
      
      <NavLink to="/citizen/my-firs" className={({isActive}) => `nav-item ${isActive ? 'active' : ''}`}>
        <FileText size={24} />
        <span>My FIR</span>
      </NavLink>

      <NavLink to="/citizen/register-fir" className="nav-item center-fab">
        <div className="fab-button">
          <PlusCircle size={32} />
        </div>
      </NavLink>

      <NavLink to="/citizen/notifications" className={({isActive}) => `nav-item ${isActive ? 'active' : ''}`}>
        <div className="icon-badge-wrapper">
          <Bell size={24} />
          <span className="badge">2</span>
        </div>
        <span>Alerts</span>
      </NavLink>

      <NavLink to="/citizen/settings" className={({isActive}) => `nav-item ${isActive ? 'active' : ''}`}>
        <User size={24} />
        <span>Profile</span>
      </NavLink>
    </nav>
  );
};

export default BottomNav;
