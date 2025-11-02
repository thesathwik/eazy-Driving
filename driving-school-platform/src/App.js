import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import Navigation from './components/common/Navigation';
import Footer from './components/common/Footer';
import Home from './pages/Home';
import Instructors from './pages/Instructors';
import LearnerLogin from './pages/auth/LearnerLogin';
import InstructorLogin from './pages/auth/InstructorLogin';
import LearnerSignup from './pages/auth/LearnerSignup';
import InstructorSignup from './pages/auth/InstructorSignup';
import CompleteInstructorProfile from './pages/auth/CompleteInstructorProfile';
import InstructorDashboard from './pages/instructor/InstructorDashboard';
import './styles/global.css';

function App() {
  return (
    <AuthProvider>
      <Router>
        <div className="App">
          <Navigation />
          <main>
            <Routes>
              <Route path="/" element={<Home />} />
              <Route path="/instructors" element={<Instructors />} />
              <Route path="/login/learner" element={<LearnerLogin />} />
              <Route path="/login/instructor" element={<InstructorLogin />} />
              <Route path="/signup/learner" element={<LearnerSignup />} />
              <Route path="/signup/instructor" element={<InstructorSignup />} />
              <Route path="/instructor/complete-profile" element={<CompleteInstructorProfile />} />
              <Route path="/instructor/dashboard" element={<InstructorDashboard />} />
              <Route path="/signup" element={<LearnerSignup />} />
              {/* Additional routes can be added here */}
            </Routes>
          </main>
          <Footer />
        </div>
      </Router>
    </AuthProvider>
  );
}

export default App;
