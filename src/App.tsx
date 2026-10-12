import { HashRouter, Routes, Route } from 'react-router-dom';
import { Toaster } from 'sonner';
import { SelectionProvider } from '@/context/SelectionContext';
import { AppLayout } from '@/components/layout/AppLayout';
import { useTheme } from '@/hooks/useTheme';
import DatabasePage from '@/pages/DatabasePage';
import ProjectFormPage from '@/pages/ProjectFormPage';
import ComparisonPage from '@/pages/ComparisonPage';
import BackupPage from '@/pages/BackupPage';
import HelpPage from '@/pages/HelpPage';

export default function App() {
  const { theme } = useTheme();

  return (
    <SelectionProvider>
      <HashRouter>
        <Routes>
          <Route element={<AppLayout />}>
            <Route path="/" element={<DatabasePage />} />
            <Route path="/projects/new" element={<ProjectFormPage mode="new" />} />
            <Route path="/projects/:id" element={<ProjectFormPage mode="view" />} />
            <Route path="/projects/:id/edit" element={<ProjectFormPage mode="edit" />} />
            <Route path="/comparison" element={<ComparisonPage />} />
            <Route path="/backup" element={<BackupPage />} />
            <Route path="/help" element={<HelpPage />} />
          </Route>
        </Routes>
      </HashRouter>
      <Toaster richColors position="top-right" theme={theme} />
    </SelectionProvider>
  );
}
