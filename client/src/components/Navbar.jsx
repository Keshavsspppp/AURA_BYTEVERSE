import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import logo from '../assets/img/logo.jpg';

const navigation = [
  { name: 'Home', href: '/' },
  { name: 'Mood Check', href: '/mood-check' },
  { name: 'Reports', href: '/reports' },
  { name: 'Chat Support', href: '/chatbot' },
  { name: 'Meditation', href: '/meditation' },
];

const Navbar = () => {
  const navigate = useNavigate();
  const [isOpen, setIsOpen] = useState(false);
  const { user, logout } = useAuth();

  return (
<<<<<<< HEAD
    <nav className="bg-gradient-to-r from-white to-yellow-50 shadow-lg backdrop-blur-sm">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16">
          <div className="flex items-center">
            <Link to="/" className="flex-shrink-0 flex items-center">
              <span className="text-2xl font-bold bg-gradient-to-r from-yellow-500 to-yellow-600 bg-clip-text text-transparent transition-all duration-300">Aura</span>
=======
    <nav className="bg-white shadow-lg fixed w-full z-50">
      <div className="container mx-auto px-4">
        <div className="flex justify-between items-center h-16">
          <div className="flex items-center">
            <Link to="/" className="flex-shrink-0 flex items-center">
              <img src={logo} alt="Aura Logo" className="h-12 w-auto object-contain" />
>>>>>>> dcc88fc (Initial commit)
            </Link>
          </div>

          {/* Desktop Menu */}
<<<<<<< HEAD
          <div className="hidden md:flex items-center space-x-4">
            {navigation.map((item) => (
              <Link
                key={item.name}
                to={item.href}
                className="text-gray-600 hover:text-yellow-600 px-3 py-2 rounded-md transition-all duration-300 hover:bg-yellow-50"
              >
                {item.name}
              </Link>
            ))}
            {user ? (
              <>
                <Link to="/profile" className="text-gray-600 hover:text-yellow-600 px-3 py-2 rounded-md transition-all duration-300 hover:bg-yellow-50">
                  Profile
                </Link>
=======
          <div className="hidden md:flex items-center space-x-6">
            <Link to="/" className="nav-link">Home</Link>
            <Link to="/mood-check" className="nav-link">Mood Check</Link>
            <Link to="/journal" className="nav-link">Journal</Link>
            <Link to="/practice" className="nav-link">Practice</Link>
            <Link to="/yoga-poses" className="nav-link">Yoga Poses</Link>
            <Link to="/chatbot" className="nav-link">Chatbot</Link>
            <Link to="/room" className="nav-link">Room</Link>
            {user ? (
              <div className="flex items-center space-x-4">
                <Link to="/profile" className="nav-link">Profile</Link>
>>>>>>> dcc88fc (Initial commit)
                <button
                  onClick={() => {
                    logout();
                    navigate('/');
                  }}
<<<<<<< HEAD
                  className="bg-gradient-to-r from-yellow-500 to-yellow-600 text-white hover:from-yellow-600 hover:to-yellow-700 px-4 py-2 rounded-md transition-all duration-300 transform hover:scale-105 hover:shadow-md"
=======
                  className="bg-yellow-500 text-white hover:bg-yellow-600 px-4 py-2 rounded-lg transition-all duration-200 transform hover:scale-105"
>>>>>>> dcc88fc (Initial commit)
                >
                  Logout
                </button>
              </div>
            ) : (
<<<<<<< HEAD
              <Link to="/login" className="bg-gradient-to-r from-yellow-500 to-yellow-600 text-white hover:from-yellow-600 hover:to-yellow-700 px-4 py-2 rounded-md transition-all duration-300 transform hover:scale-105 hover:shadow-md">
=======
              <Link 
                to="/login" 
                className="bg-yellow-500 text-white hover:bg-yellow-600 px-4 py-2 rounded-lg transition-all duration-200 transform hover:scale-105"
              >
>>>>>>> dcc88fc (Initial commit)
                Login/Signup
              </Link>
            )}
          </div>

          {/* Mobile Menu Button */}
          <div className="md:hidden">
            <button
              onClick={() => setIsOpen(!isOpen)}
<<<<<<< HEAD
              className="inline-flex items-center justify-center p-2 rounded-md text-gray-400 hover:text-yellow-600 hover:bg-yellow-50 transition-all duration-300"
=======
              className="inline-flex items-center justify-center p-2 rounded-lg text-gray-600 hover:text-yellow-500 hover:bg-gray-100 transition-colors duration-200"
>>>>>>> dcc88fc (Initial commit)
            >
              <span className="sr-only">Open main menu</span>
              {!isOpen ? (
                <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
                </svg>
              ) : (
                <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              )}
            </button>
          </div>
        </div>

<<<<<<< HEAD
      {/* Mobile Menu */}
      {isOpen && (
        <div className="md:hidden">
          <div className="px-2 pt-2 pb-3 space-y-1 sm:px-3">
            {navigation.map((item) => (
              <Link
                key={item.name}
                to={item.href}
                className="block text-gray-600 hover:text-yellow-600 px-3 py-2 rounded-md transition-all duration-300 hover:bg-yellow-50"
              >
                {item.name}
              </Link>
            ))}
            {user ? (
              <>
                <Link to="/profile" className="block text-gray-600 hover:text-yellow-600 px-3 py-2 rounded-md transition-all duration-300 hover:bg-yellow-50">
                  Profile
                </Link>
                <button
                  onClick={() => {
                    logout();
                    navigate('/');
                  }}
                  className="block w-full text-left text-gray-600 hover:text-yellow-600 px-3 py-2 rounded-md transition-all duration-300 hover:bg-yellow-50"
                >
                  Logout
                </button>
              </>
            ) : (
              <Link to="/login" className="block bg-gradient-to-r from-yellow-500 to-yellow-600 text-white hover:from-yellow-600 hover:to-yellow-700 px-4 py-2 rounded-md transition-all duration-300 transform hover:scale-105 hover:shadow-md">
=======
        {/* Mobile Menu */}
        <div className={`md:hidden transition-all duration-300 ease-in-out ${isOpen ? 'max-h-screen opacity-100' : 'max-h-0 opacity-0 overflow-hidden'}`}>
          <div className="px-2 pt-2 pb-3 space-y-2">
            <Link to="/" className="mobile-nav-link">Home</Link>
            <Link to="/mood-check" className="mobile-nav-link">Mood Check</Link>
            <Link to="/journal" className="mobile-nav-link">Journal</Link>
            <Link to="/yoga-poses" className="mobile-nav-link">Yoga Poses</Link>
            <Link to="/chatbot" className="mobile-nav-link">Chatbot</Link>
            <Link to="/room" className="mobile-nav-link">Room</Link>
            {user && (
              <Link to="/profile" className="mobile-nav-link">Profile</Link>
            )}
            {user ? (
              <button
                onClick={() => {
                  logout();
                  navigate('/');
                  setIsOpen(false);
                }}
                className="w-full text-left bg-yellow-500 text-white hover:bg-yellow-600 px-4 py-2 rounded-lg transition-colors duration-200"
              >
                Logout
              </button>
            ) : (
              <Link 
                to="/login" 
                className="block w-full bg-yellow-500 text-white hover:bg-yellow-600 px-4 py-2 rounded-lg transition-colors duration-200"
              >
>>>>>>> dcc88fc (Initial commit)
                Login/Signup
              </Link>
            )}
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;