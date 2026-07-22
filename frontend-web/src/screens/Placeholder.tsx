import React from 'react';
import Sidebar from '../components/Sidebar';
import TopNav from '../components/TopNav';
import { Construction } from 'lucide-react';
import { useLocation } from 'react-router-dom';

const Placeholder: React.FC = () => {
  const location = useLocation();
  const path = location.pathname.split('/').pop()?.replace('-', ' ');
  const title = path ? path.charAt(0).toUpperCase() + path.slice(1) : 'Coming Soon';

  return (
    <div className="dashboard-layout">
      <Sidebar />
      <main className="dashboard-content">
        <TopNav title={title} />
        
        <div className="animate-fade-in" style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', height: '60vh', textAlign: 'center' }}>
          <div style={{ background: 'rgba(212, 175, 55, 0.1)', padding: '24px', borderRadius: '50%', color: 'var(--brass-gold)', marginBottom: '24px' }}>
            <Construction size={48} />
          </div>
          <h2 style={{ fontSize: '24px', color: 'var(--primary-navy)', marginBottom: '12px' }}>This page is under construction!</h2>
          <p style={{ color: 'var(--text-light)', maxWidth: '400px', lineHeight: '1.6' }}>
            The <strong>{title}</strong> module is currently being developed as part of our massive platform expansion. Check back soon.
          </p>
        </div>
      </main>
    </div>
  );
};

export default Placeholder;
