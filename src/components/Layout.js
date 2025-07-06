import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

const Layout = ({ children }) => {
  const { currentUser, logout, isAdmin, isPatient } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate("/login");
  };

  return (
    <div className="min-h-screen flex flex-col bg-gray-50">
      {/* Header/Navbar */}
      <header className="bg-gradient-to-r from-blue-600 to-blue-800 text-white shadow-lg">
        <div className="container mx-auto px-6 py-5 flex justify-between items-center">
          <Link to="/" className="text-2xl font-bold flex items-center">
            <span className="text-white">Dental Center Dashboard</span>
          </Link>

          {currentUser ? (
            <div className="flex items-center gap-5">
              <span className="hidden md:inline text-base font-medium">
                Welcome, {currentUser.name}
              </span>

              <button
                onClick={handleLogout}
                className="bg-white text-blue-700 hover:bg-blue-50 px-5 py-2 rounded-lg font-medium transition-all duration-200 transform hover:scale-105"
              >
                Logout
              </button>
            </div>
          ) : (
            <Link
              to="/login"
              className="bg-white text-blue-700 hover:bg-blue-50 px-5 py-2 rounded-lg font-medium transition-all duration-200 transform hover:scale-105"
            >
              Login
            </Link>
          )}
        </div>
      </header>

      {/* Sidebar for authenticated users */}
      {currentUser && (
        <div className="flex flex-1">
          <nav className="bg-white w-72 shadow-modern p-6 hidden md:block border-r border-gray-100">
            <div className="space-y-2">
              <p className="text-gray-500 uppercase font-semibold text-xs tracking-wider mb-4 pl-3">
                Menu
              </p>

              {isAdmin && (
                <>
                  <Link
                    to="/dashboard"
                    className="flex items-center py-3 px-4 rounded-lg hover:bg-blue-50 hover:text-blue-700 font-medium transition-all duration-200"
                  >
                    Dashboard
                  </Link>

                  <Link
                    to="/patients"
                    className="flex items-center py-3 px-4 rounded-lg hover:bg-blue-50 hover:text-blue-700 font-medium transition-all duration-200"
                  >
                    Patients Management
                  </Link>

                  <Link
                    to="/appointments"
                    className="flex items-center py-3 px-4 rounded-lg hover:bg-blue-50 hover:text-blue-700 font-medium transition-all duration-200"
                  >
                    Appointments
                  </Link>

                  <Link
                    to="/calendar"
                    className="flex items-center py-3 px-4 rounded-lg hover:bg-blue-50 hover:text-blue-700 font-medium transition-all duration-200"
                  >
                    Calendar
                  </Link>
                </>
              )}

              {isPatient && (
                <>
                  <Link
                    to="/my-profile"
                    className="flex items-center py-3 px-4 rounded-lg hover:bg-blue-50 hover:text-blue-700 font-medium transition-all duration-200"
                  >
                    My Profile
                  </Link>

                  <Link
                    to="/my-appointments"
                    className="flex items-center py-3 px-4 rounded-lg hover:bg-blue-50 hover:text-blue-700 font-medium transition-all duration-200"
                  >
                    My Appointments
                  </Link>
                </>
              )}
            </div>
          </nav>

          {/* Mobile Navigation */}
          <div className="md:hidden fixed bottom-0 w-full bg-white shadow-modern z-10 border-t border-gray-100">
            <div className="flex justify-around p-3">
              <Link
                to="/dashboard"
                className="p-2 text-center transition-all duration-200 hover:text-blue-700"
              >
                <span className="block text-sm font-medium">Dashboard</span>
              </Link>

              {isAdmin && (
                <>
                  <Link
                    to="/patients"
                    className="p-2 text-center transition-all duration-200 hover:text-blue-700"
                  >
                    <span className="block text-sm font-medium">Patients</span>
                  </Link>

                  <Link
                    to="/appointments"
                    className="p-2 text-center transition-all duration-200 hover:text-blue-700"
                  >
                    <span className="block text-sm font-medium">
                      Appointments
                    </span>
                  </Link>
                </>
              )}

              {isPatient && (
                <>
                  <Link
                    to="/my-profile"
                    className="p-2 text-center transition-all duration-200 hover:text-blue-700"
                  >
                    <span className="block text-sm font-medium">Profile</span>
                  </Link>

                  <Link
                    to="/my-appointments"
                    className="p-2 text-center transition-all duration-200 hover:text-blue-700"
                  >
                    <span className="block text-sm font-medium">
                      Appointments
                    </span>
                  </Link>
                </>
              )}
            </div>
          </div>

          {/* Main Content */}
          <main className="flex-1 p-6 md:p-8 bg-gray-50">{children}</main>
        </div>
      )}

      {/* For non-authenticated pages */}
      {!currentUser && <main className="flex-1">{children}</main>}

      {/* Footer */}
      <footer className="bg-gradient-to-r from-blue-800 to-blue-900 text-white text-center p-5 mt-auto shadow-lg">
        <div className="container mx-auto">
          <p className="text-base">
            © {new Date().getFullYear()} Dental Center Dashboard. All rights
            reserved.
          </p>
        </div>
      </footer>
    </div>
  );
};

export default Layout;
