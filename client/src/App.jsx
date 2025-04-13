<<<<<<< HEAD
import { BrowserRouter as Router, Routes, Route, Navigate, Link } from 'react-router-dom';
=======
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { useAuth } from './context/AuthContext';
>>>>>>> dcc88fc (Initial commit)
import Navbar from './components/Navbar';
import Home from './pages/Home';
import Login from './pages/Login';
import Signup from './pages/Signup';
import Profile from './pages/Profile';
import { AuthProvider, useAuth } from './context/AuthContext';
import Chatbot from './pages/Chatbot';
<<<<<<< HEAD
import MoodCheck from './pages/MoodCheck';
import Report from './pages/Report';
import Meditation from './pages/Meditation';

// Protected Route Component
const ProtectedRoute = ({ children }) => {
  const { user } = useAuth();
  if (!user) {
    return <Navigate to="/login" />;
  }
  return children;
};

// Coming Soon Component
const ComingSoon = ({ title }) => (
  <div className="container mx-auto p-8">
    <h1 className="text-3xl font-bold mb-4">{title}</h1>
    <p className="text-gray-600">Coming Soon</p>
  </div>
);
=======
import Room from './pages/Room';
import MoodCheck from './pages/MoodCheck';
import Journal from './pages/Journal';
import Poses from './pages/Poses';
import YogaPoses from './pages/YogaPoses';

// Add this PrivateRoute component at the top of the file
const PrivateRoute = ({ children }) => {
  const { user } = useAuth();
  return user ? children : <Navigate to="/login" />;
};
>>>>>>> dcc88fc (Initial commit)

function App() {
  return (
    <AuthProvider>
      <Router>
        <div className="min-h-screen bg-gray-50">
          <Navbar />
          <Routes>
            {/* Public Routes */}
            <Route path="/" element={<Home />} />
            <Route path="/login" element={<Login />} />
            <Route path="/signup" element={<Signup />} />
<<<<<<< HEAD
            {/* Protected Routes */}
            <Route path="/mood-check" element={
              <ProtectedRoute>
                <MoodCheck />
              </ProtectedRoute>
            } />
            <Route path="/chatbot" element={
              <ProtectedRoute>
                <Chatbot />
              </ProtectedRoute>
            } />
            <Route path="/profile" element={
              <ProtectedRoute>
                <Profile />
              </ProtectedRoute>
            } />
            <Route path="/meditation" element={
              <ProtectedRoute>
                <Meditation />
              </ProtectedRoute>
            } />
            <Route path="/reports" element={
              <ProtectedRoute>
                <Report />
              </ProtectedRoute>
            } />

            {/* 404 Route */}
            <Route path="*" element={
              <div className="container mx-auto p-8 text-center">
                <h1 className="text-4xl font-bold text-gray-900 mb-4">404</h1>
                <p className="text-gray-600 mb-8">Page not found</p>
                <Link to="/" className="text-yellow-500 hover:text-yellow-600">
                  Return to Home
                </Link>
              </div>
            } />
=======
            <Route path="/room" element={<Room />} />
            <Route 
              path="/mood-check" 
              element={
                <PrivateRoute>
                  <MoodCheck />
                </PrivateRoute>
              } 
            />
            <Route 
              path="/journal" 
              element={
                <PrivateRoute>
                  <Journal />
                </PrivateRoute>
              } 
            />
            <Route 
              path="/chatbot" 
              element={
                <PrivateRoute>
                  <Chatbot />
                </PrivateRoute>
              } 
            />
            <Route path="/profile" element={<Profile />} />
            {/* Updated Yoga routes */}
            <Route path="/yoga-poses" element={<YogaPoses />} />
            <Route 
              path="/practice" 
              element={
                <PrivateRoute>
                  <Poses />
                </PrivateRoute>
              } 
            />
            <Route path="/login" element={<div className="p-4">Login/Signup Page (Coming Soon)</div>} />
>>>>>>> dcc88fc (Initial commit)
          </Routes>
        </div>
      </Router>
    </AuthProvider>
  );
}

export default App;
