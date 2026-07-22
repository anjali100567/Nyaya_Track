import React from 'react';
import { Bell, Search, User as UserIcon } from 'lucide-react';
import './TopNav.css';

interface TopNavProps {
  title: string;
}

const TopNav: React.FC<TopNavProps> = ({ title }) => {
  return (
    <header className="topnav glass-card">
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
