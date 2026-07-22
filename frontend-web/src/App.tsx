import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import Login from './screens/Login';
import CitizenDashboard from './screens/CitizenDashboard';
import RegisterFIR from './screens/RegisterFIR';
import TrackFIR from './screens/TrackFIR';
import OfficerDashboard from './screens/OfficerDashboard';
import CaseDetail from './screens/CaseDetail';
import AdminDashboard from './screens/AdminDashboard';
import AssignOfficer from './screens/AssignOfficer';

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/login" element={<Login />} />
        <Route path="/citizen/dashboard" element={<CitizenDashboard />} />
        <Route path="/citizen/register-fir" element={<RegisterFIR />} />
        <Route path="/citizen/track" element={<TrackFIR />} />
        
        <Route path="/officer/dashboard" element={<OfficerDashboard />} />
        <Route path="/officer/case/:id" element={<CaseDetail />} />
        
        <Route path="/admin/dashboard" element={<AdminDashboard />} />
        <Route path="/admin/assign" element={<AssignOfficer />} />

        <Route path="*" element={<Navigate to="/login" replace />} />
      </Routes>
    </Router>
  );
}

export default App;
