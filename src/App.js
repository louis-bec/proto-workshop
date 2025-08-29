

import './App.css';
import LoginPage from './page/LoginPage';
import HomePage from './page/HomePage';
import WorklistPage from './page/WorklistPage';
import TaskGroupPage from './page/TaskGroupPage';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import React from 'react';

function RequireAuth({ children }) {
  const [loading, setLoading] = React.useState(true);
  const [authed, setAuthed] = React.useState(false);
  React.useEffect(() => {
    fetch('http://localhost:4000/api/me', { credentials: 'include' })
      .then(r => r.ok ? r.json() : Promise.reject())
      .then(() => { setAuthed(true); setLoading(false); })
      .catch(() => { setAuthed(false); setLoading(false); });
  }, []);
  if (loading) return <div>Loading...</div>;
  if (!authed) return <Navigate to="/login" replace />;
  return children;
}

export default function App() {
  return (
  <BrowserRouter future={{ v7_startTransition: true, v7_relativeSplatPath: true }}>
      <Routes>
        <Route path="/login" element={<LoginPage />} />
  <Route path="/" element={<RequireAuth><HomePage /></RequireAuth>} />
  <Route path="/worklist" element={<RequireAuth><WorklistPage /></RequireAuth>} />
  <Route path="/task-group" element={<RequireAuth><TaskGroupPage /></RequireAuth>} />
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </BrowserRouter>
  );
}
