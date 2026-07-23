import React from 'react';
import { NavLink, useLocation } from 'react-router-dom';
import { 
  Home, FileText, Activity, Bell, PhoneCall, LogOut, Scale, User, 
  Settings, HelpCircle, BarChart3, Briefcase, Camera, Calendar, Inbox, Users
} from 'lucide-react';
import Logo from './Logo';
import './Sidebar.css';

const Sidebar: React.FC = () => {
  const location = useLocation();
  const pathParts = location.pathname.split('/');
  const role = pathParts[1] || 'citizen'; // defaults to citizen

  const citizenLinks = [
    { to: '/citizen/dashboard', icon: <Home size={20} />, label: 'Dashboard' },
    { to: '/citizen/register-fir', icon: <FileText size={20} />, label: 'File New FIR' },
    { to: '/citizen/my-firs', icon: <FileText size={20} />, label: 'My FIRs' },
    { to: '/citizen/track', icon: <Activity size={20} />, label: 'Track Case' },
    { to: '/citizen/nyaya-ai', icon: <User size={20} />, label: 'NyayaAI Assistant' },
  ];

  const officerLinks = [
    { to: '/officer/dashboard', icon: <Home size={20} />, label: 'Dashboard' },
    { to: '/officer/assigned', icon: <Briefcase size={20} />, label: 'Assigned Cases' },
    { to: '/officer/queue', icon: <Activity size={20} />, label: 'Investigation Queue' },
    { to: '/officer/evidence', icon: <Camera size={20} />, label: 'Evidence Manager' },
    { to: '/officer/nyaya-ai', icon: <User size={20} />, label: 'AI Assistant' },
  ];

  const adminLinks = [
    { to: '/admin/dashboard', icon: <Home size={20} />, label: 'Dashboard' },
    { to: '/admin/incoming', icon: <Inbox size={20} />, label: 'Incoming FIRs' },
    { to: '/admin/assign', icon: <User size={20} />, label: 'Officer Assignment' },
    { to: '/admin/all-cases', icon: <Briefcase size={20} />, label: 'All Cases' },
    { to: '/admin/analytics', icon: <BarChart3 size={20} />, label: 'Analytics' },
    { to: '/admin/officers', icon: <Users size={20} />, label: 'Officers' },
  ];

  let links = citizenLinks;
  let bgColor = 'var(--citizen-green)';
  
  if (role === 'officer') {
    links = officerLinks;
    bgColor = 'var(--officer-navy)';
  }
  if (role === 'admin') {
    links = adminLinks;
    bgColor = 'var(--admin-purple)';
  }

  const sidebarStyle = { backgroundColor: bgColor };

  return (
    <aside className="sidebar" style={sidebarStyle}>
      <div className="sidebar-header">
        <Logo size={40} className="sidebar-logo" />
        <h2>NYAYATRACK</h2>
      </div>
      
      <nav className="sidebar-nav">
        {links.map((link, idx) => (
          <NavLink 
            key={idx} 
            to={link.to} 
            className={({isActive}) => `nav-item ${isActive || location.pathname.startsWith(link.to) && link.to !== `/${role}/dashboard` ? 'active' : ''}`}
            end={link.to.endsWith('dashboard')}
          >
            {link.icon} {link.label}
          </NavLink>
        ))}

        <div className="nav-divider"></div>
        <NavLink to={`/${role}/notifications`} className={({isActive}) => `nav-item ${isActive ? 'active' : ''}`}>
          <Bell size={20} /> Notifications
        </NavLink>
        <NavLink to={`/${role}/settings`} className={({isActive}) => `nav-item ${isActive ? 'active' : ''}`}>
          <Settings size={20} /> Profile & Settings
        </NavLink>
        
        {role === 'citizen' && (
          <a href="#" className="nav-item warning">
            <PhoneCall size={20} /> Emergency 112
          </a>
        )}
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
