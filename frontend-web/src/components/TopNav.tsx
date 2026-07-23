import React from 'react';
import { Bell, Search, User as UserIcon } from 'lucide-react';
import { useLocation } from 'react-router-dom';
import './TopNav.css';

interface TopNavProps {
  title: string;
}

const TopNav: React.FC<TopNavProps> = ({ title }) => {
  const location = useLocation();
  const role = location.pathname.split('/')[1] || 'citizen';
  
  let bgColor = 'var(--citizen-green)';
  if (role === 'officer') bgColor = 'var(--officer-navy)';
  if (role === 'admin') bgColor = 'var(--admin-purple)';
  
  const navStyle = { backgroundColor: bgColor };

  return (
    <header className="top-nav" style={navStyle}>
      <div className="topnav-title">
        <h2>{title}</h2>
      </div>
      
      <div className="topnav-actions">
        <div className="search-bar">
          <Search size={18} className="search-icon" />
          <input type="text" placeholder="Search FIRs, Cases..." />
        </div>
        
        <button className="icon-btn">
          <Bell size={20} />
          <span className="badge">2</span>
        </button>
        
        <div className="profile-menu">
          <div className="avatar">
            <UserIcon size={20} />
          </div>
          <div className="profile-info">
            <span className="name">Ramesh Kumar</span>
            <span className="role">Citizen</span>
          </div>
        </div>
      </div>
    </header>
  );
};

export default TopNav;
