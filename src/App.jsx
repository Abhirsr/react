import React, { useState } from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import SignIn from './components/SignIn';
import SignUp from './components/SignUp';
import Dashboard from './components/Dashboard';
import Sidebar from './components/Sidebar';

const App = () => {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  const toggleSidebar = () => {
    setIsSidebarOpen(!isSidebarOpen);
  };

  return (
    <Router>
      <Routes>
        <Route path="/" element={<SignUp />} />
        <Route path="/signin" element={<SignIn />} />
        
        <Route
          path="/dashboard"
          element={
            <div className="app-container">
              <Dashboard toggleSidebar={toggleSidebar} />
              {isSidebarOpen && <Sidebar onClose={toggleSidebar} />}
              <main className="app-content">
              </main>
            </div>
          }
        />
      </Routes>
    </Router>
  );
};

export default App;