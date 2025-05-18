import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from './components/Router';
import Login from './pages/Login';
import Dashboard from './pages/Dashboard';
import Settings from './pages/Settings';
import Layout from './components/Layout';
import { useAuthStore } from './stores/authStore';

function App() {
  const { isAuthenticated } = useAuthStore();

  return (
    <Router>
      <Routes>
        <Route path="/login" element={!isAuthenticated ? <Login /> : <Navigate to="/" />} />
        <Route path="/" element={
          isAuthenticated ? (
            <Layout>
              <Dashboard />
            </Layout>
          ) : <Navigate to="/login" />
        } />
        <Route path="/settings" element={
          isAuthenticated ? (
            <Layout>
              <Settings />
            </Layout>
          ) : <Navigate to="/login" />
        } />
      </Routes>
    </Router>
  );
}

export default App;