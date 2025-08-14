import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Navbar from './components/Navbar';

import Dashboard from './pages/Dashboard';

import Login from './pages/Login';
import Register from './pages/Register';
import Profile from './pages/Profile';

// Safety Incidents
import IncidentsList from './pages/safety/IncidentsList';
import IncidentCreate from './pages/safety/IncidentCreate';
import IncidentEdit from './pages/safety/IncidentEdit';
import IncidentView from './pages/safety/IncidentView';

// Equipment Compliance
import ComplianceList from './pages/equipments/ComplianceList';
import ComplianceCreate from './pages/equipments/ComplianceCreate';
import ComplianceEdit from './pages/equipments/ComplianceEdit';
import ComplianceView from './pages/equipments/ComplianceView';

// Hazard Reports
import ReportsList from './pages/hazards/ReportsList';
import ReportsCreate from './pages/hazards/ReportCreate';
import ReportsEdit from './pages/hazards/ReportEdit';
import ReportView from './pages/hazards/ReportView';

// Safety Gear Logs
import GearLogsList from './pages/safety/GearLogsList';
import GearLogCreate from './pages/safety/GearLogCreate';
import GearLogEdit from './pages/safety/GearLogEdit';
import GearLogView from './pages/safety/GearLogView';

function App() {
  return (
    <Router>
      <Navbar />
      <Routes>
        {/* Dashboard */}
        <Route path="/" element={<Dashboard />} />

        {/* Authentication */}
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route path="/profile" element={<Profile />} />

        {/* Safety Incidents */}
        <Route path="/safety-incidents" element={<IncidentsList />} />
        <Route path="/safety-incidents/new" element={<IncidentCreate />} />
        <Route path="/safety-incidents/edit/:id" element={<IncidentEdit />} />
        <Route path="/safety-incidents/view/:id" element={<IncidentView />} />

        {/* Equipment Compliance */}
        <Route path="/equipment-compliance" element={<ComplianceList />} />
        <Route path="/equipment-compliance/new" element={<ComplianceCreate />} />
        <Route path="/equipment-compliance/edit/:id" element={<ComplianceEdit />} />
        <Route path="/equipment-compliance/view/:id" element={<ComplianceView />} />

        {/* Hazard Reports */}
        <Route path="/hazard-reports" element={<ReportsList />} />
        <Route path="/hazard-reports/new" element={<ReportsCreate />} />
        <Route path="/hazard-reports/edit/:id" element={<ReportsEdit />} />
        <Route path="/hazard-reports/view/:id" element={<ReportView />} />

        {/* Safety Gear Logs */}
        <Route path="/gear-logs" element={<GearLogsList />} />
        <Route path="/gear-logs/new" element={<GearLogCreate />} />
        <Route path="/gear-logs/edit/:id" element={<GearLogEdit />} />
        <Route path="/gear-logs/view/:id" element={<GearLogView />} />
      </Routes>
    </Router>
  );
}

export default App;
