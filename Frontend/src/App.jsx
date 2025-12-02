import { BrowserRouter, Routes, Route } from 'react-router-dom';
import MainLayout from './layouts/MainLayout';
import AdminLayout from './layouts/AdminLayout';
import Home from './pages/Home/Home';
import Questionnaire from './pages/Questionnaire/Questionnaire';
import Explorer from './pages/Explorer/Explorer';
import Results from './pages/Results/Results';
import Dashboard from './pages/AdminDashboard/Dashboard';

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<MainLayout />}>
          <Route index element={<Home />} />
          <Route path="vragenlijst" element={<Questionnaire />} />
          <Route path="explorer" element={<Explorer />} />
          <Route path="resultaten" element={<Results />} />
        </Route>

        <Route path="/dashboard" element={<AdminLayout />}>
          <Route index element={<Dashboard />} />
        </Route>
      </Routes>
    </BrowserRouter>
  );
}

export default App;
