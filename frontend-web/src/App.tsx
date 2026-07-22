import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import Login from './screens/Login';
import CitizenDashboard from './screens/CitizenDashboard';
import RegisterFIR from './screens/RegisterFIR';
import TrackFIR from './screens/TrackFIR';

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/login" element={<Login />} />
        <Route path="/citizen/dashboard" element={<CitizenDashboard />} />
        <Route path="/citizen/register-fir" element={<RegisterFIR />} />
        <Route path="/citizen/track" element={<TrackFIR />} />
        <Route path="*" element={<Navigate to="/login" replace />} />
      </Routes>
    </Router>
  );
}

export default App;
