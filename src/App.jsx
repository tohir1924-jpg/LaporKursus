import { Navigate, Route, Routes } from 'react-router-dom';
import { AppShell } from './components/layout/AppShell';
import { AttendancePage } from './pages/AttendancePage';
import { BillingPage } from './pages/BillingPage';
import { DashboardPage } from './pages/DashboardPage';
import { PlaceholderPage } from './pages/PlaceholderPage';
import { ProjectsPage } from './pages/ProjectsPage';
import { ReminderPage } from './pages/ReminderPage';
import { StudentProfilePage } from './pages/StudentProfilePage';

function App() {
  return (
    <AppShell>
      <Routes>
        <Route path="/" element={<DashboardPage />} />
        <Route path="/dashboard" element={<DashboardPage />} />
        <Route path="/students" element={<PlaceholderPage title="Siswa" />} />
        <Route path="/classes" element={<PlaceholderPage title="Kelas" />} />
        <Route path="/attendance" element={<AttendancePage />} />
        <Route path="/billing" element={<BillingPage />} />
        <Route path="/reminders" element={<ReminderPage />} />
        <Route path="/projects" element={<ProjectsPage />} />
        <Route path="/profile" element={<StudentProfilePage />} />
        <Route path="/reports" element={<PlaceholderPage title="Laporan" />} />
        <Route path="/settings" element={<PlaceholderPage title="Pengaturan" />} />
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </AppShell>
  );
}

export default App;
