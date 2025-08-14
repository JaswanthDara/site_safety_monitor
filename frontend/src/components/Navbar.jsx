import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

const Navbar = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  return (
    <nav className="bg-blue-700 text-white p-4 flex justify-between items-center shadow-md">
      <Link
        to="/"
        className="text-xl font-bold hover:text-gray-300 cursor-pointer transition-colors duration-200"
      >
        Site Safety Monitor
      </Link>

      <div className="flex items-center space-x-6 text-sm md:text-base">
        {user ? (
          <>
            <Link
              to="/"
              className="hover:text-gray-300 cursor-pointer transition-colors duration-200"
            >
              Home
            </Link>
            <Link
              to="/safety-incidents"
              className="hover:text-gray-300 cursor-pointer transition-colors duration-200"
            >
              Safety Incidents
            </Link>
            <Link
              to="/equipment-compliance"
              className="hover:text-gray-300 cursor-pointer transition-colors duration-200"
            >
              Equipment Compliance
            </Link>
            <Link
              to="/hazard-reports"
              className="hover:text-gray-300 cursor-pointer transition-colors duration-200"
            >
              Hazard Reports
            </Link>
            <Link
              to="/gear-logs"
              className="hover:text-gray-300 cursor-pointer transition-colors duration-200"
            >
              Gear Logs
            </Link>
            <Link
              to="/profile"
              className="hover:text-gray-300 cursor-pointer transition-colors duration-200"
            >
              Profile
            </Link>
            <button
              onClick={handleLogout}
              className="bg-red-600 hover:bg-red-700 transition-colors duration-200 px-4 py-1 rounded text-sm cursor-pointer focus:outline-none focus:ring-2 focus:ring-red-400"
              type="button"
            >
              Logout
            </button>
          </>
        ) : (
          <>
            <Link
              to="/"
              className="hover:text-gray-300 cursor-pointer transition-colors duration-200"
            >
              Home
            </Link>
            <Link
              to="/login"
              className="hover:text-gray-300 cursor-pointer transition-colors duration-200"
            >
              Login
            </Link>
            <Link
              to="/register"
              className="bg-green-600 hover:bg-green-700 transition-colors duration-200 px-4 py-1 rounded text-sm cursor-pointer focus:outline-none focus:ring-2 focus:ring-green-400"
            >
              Register
            </Link>
          </>
        )}
      </div>
    </nav>
  );
};

export default Navbar;
