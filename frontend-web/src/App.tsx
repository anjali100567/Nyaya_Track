import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import Login from './screens/Login';
import CitizenDashboard from './screens/CitizenDashboard';
import RegisterFIR from './screens/RegisterFIR';
import TrackFIR from './screens/TrackFIR';
import OfficerDashboard from './screens/OfficerDashboard';
import CaseDetail from './screens/CaseDetail';
import AdminDashboard from './screens/AdminDashboard';
import AssignOfficer from './screens/AssignOfficer';
import MyFIRs from './screens/MyFIRs';
import NyayaAI from './screens/NyayaAI';
import IncomingFIRs from './screens/IncomingFIRs';
import Placeholder from './screens/Placeholder';
import BottomNav from './components/BottomNav';

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/login" element={<Login />} />
        <Route path="/citizen/dashboard" element={<CitizenDashboard />} />
        <Route path="/citizen/register-fir" element={<RegisterFIR />} />
        <Route path="/citizen/my-firs" element={<MyFIRs />} />
        <Route path="/citizen/track" element={<TrackFIR />} />
        <Route path="/citizen/nyaya-ai" element={<NyayaAI />} />
        <Route path="/citizen/*" element={<Placeholder />} />
        
        <Route path="/officer/dashboard" element={<OfficerDashboard />} />
        <Route path="/officer/case/:id" element={<CaseDetail />} />
        <Route path="/officer/nyaya-ai" element={<NyayaAI />} />
        <Route path="/officer/*" element={<Placeholder />} />
        
        <Route path="/admin/dashboard" element={<AdminDashboard />} />
        <Route path="/admin/assign" element={<AssignOfficer />} />
        <Route path="/admin/incoming" element={<IncomingFIRs />} />
        <Route path="/admin/nyaya-ai" element={<NyayaAI />} />
        <Route path="/admin/*" element={<Placeholder />} />

        <Route path="*" element={<Navigate to="/login" replace />} />
      </Routes>
      <BottomNav />
    </Router>
  );
}

export default App;
