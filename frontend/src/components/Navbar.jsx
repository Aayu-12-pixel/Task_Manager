import { useContext } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext';
import { ThemeContext } from '../context/ThemeContext';
import { LayoutDashboard, CheckSquare, LogOut, LogIn, UserPlus, Moon, Sun } from 'lucide-react';

export default function Navbar() {
  const { user, logout } = useContext(AuthContext);
  const { theme, toggleTheme } = useContext(ThemeContext);
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  return (
    <nav className="bg-white dark:bg-gray-800 shadow relative z-10 w-full transition-colors duration-300">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16">
          <div className="flex">
            <Link to="/" className="flex-shrink-0 flex items-center">
              <CheckSquare className="h-8 w-8 text-indigo-600 dark:text-indigo-400" />
              <span className="ml-2 text-xl font-bold text-gray-900 dark:text-white tracking-tight">TaskMaster</span>
            </Link>
            {user && (
              <div className="hidden sm:ml-8 sm:flex sm:space-x-8">
                <Link to="/" className="border-transparent text-gray-500 dark:text-gray-300 hover:border-indigo-500 hover:text-indigo-700 dark:hover:text-indigo-400 inline-flex items-center px-1 pt-1 border-b-2 text-sm font-medium transition-colors">
                  <LayoutDashboard className="h-4 w-4 mr-2" /> Dashboard
                </Link>
                <Link to="/tasks" className="border-transparent text-gray-500 dark:text-gray-300 hover:border-indigo-500 hover:text-indigo-700 dark:hover:text-indigo-400 inline-flex items-center px-1 pt-1 border-b-2 text-sm font-medium transition-colors">
                  <CheckSquare className="h-4 w-4 mr-2" /> Tasks
                </Link>
                {user.role === 'admin' && (
                  <Link to="/admin" className="border-transparent text-red-500 dark:text-red-400 hover:border-red-600 hover:text-red-600 dark:hover:text-red-300 inline-flex items-center px-1 pt-1 border-b-2 text-sm font-bold transition-colors">
                    Admin Panel
                  </Link>
                )}
              </div>
            )}
          </div>
          <div className="flex items-center space-x-2 sm:space-x-4">
            <button 
              onClick={toggleTheme} 
              className="p-2 text-gray-400 hover:text-indigo-600 dark:text-gray-300 dark:hover:text-indigo-400 transition-colors focus:outline-none rounded-full hover:bg-gray-100 dark:hover:bg-gray-700"
              aria-label="Toggle Dark Mode"
            >
              {theme === 'light' ? <Moon className="h-5 w-5" /> : <Sun className="h-5 w-5" />}
            </button>
            {user ? (
              <div className="flex items-center space-x-4">
                <span className="text-sm font-medium text-gray-700 dark:text-gray-200 hidden sm:block">Welcome, {user.name}</span>
                <button
                  onClick={handleLogout}
                  className="inline-flex items-center px-3 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 transition-colors shadow-sm"
                >
                  <LogOut className="h-4 w-4 mr-2" /> Logout
                </button>
              </div>
            ) : (
              <div className="flex space-x-3">
                <Link to="/login" className="text-gray-600 dark:text-gray-300 hover:text-indigo-600 dark:hover:text-indigo-400 px-3 py-2 rounded-md text-sm font-medium inline-flex items-center transition-colors">
                  <LogIn className="h-4 w-4 mr-1 sm:mr-2" /> Login
                </Link>
                <Link to="/register" className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700 shadow-sm transition-colors cursor-pointer">
                  <UserPlus className="h-4 w-4 mr-1 sm:mr-2" /> Register
                </Link>
              </div>
            )}
          </div>
        </div>
      </div>
    </nav>
  );
}
