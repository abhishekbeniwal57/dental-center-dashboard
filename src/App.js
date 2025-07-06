import {
  BrowserRouter as Router,
  Routes,
  Route,
  Navigate,
} from "react-router-dom";
import { AuthProvider, useAuth } from "./context/AuthContext";
import { DataProvider } from "./context/DataContext";

// Pages
import Login from "./pages/Login";
import Dashboard from "./pages/Dashboard";
import Patients from "./pages/Patients";
import PatientDetails from "./pages/PatientDetails";
import Appointments from "./pages/Appointments";
import NewAppointment from "./pages/NewAppointment";
import AppointmentDetails from "./pages/AppointmentDetails";
import Calendar from "./pages/Calendar";
import MyProfile from "./pages/MyProfile";
import MyAppointments from "./pages/MyAppointments";

// Protected Route Component
const ProtectedRoute = ({ children }) => {
  const { currentUser } = useAuth();

  if (!currentUser) {
    return <Navigate to="/login" />;
  }

  return children;
};

// Role-based redirect component
const RoleBasedRedirect = () => {
  const { isAdmin } = useAuth();

  if (isAdmin) {
    return <Navigate to="/dashboard" />;
  } else {
    return <Navigate to="/my-profile" />;
  }
};

function App() {
  return (
    <Router>
      <AuthProvider>
        <DataProvider>
          <Routes>
            {/* Public routes */}
            <Route path="/login" element={<Login />} />

            {/* Protected routes */}
            <Route
              path="/"
              element={
                <ProtectedRoute>
                  {/* Redirect based on user role */}
                  <RoleBasedRedirect />
                </ProtectedRoute>
              }
            />

            {/* Admin Routes */}
            <Route
              path="/dashboard"
              element={
                <ProtectedRoute>
                  <Dashboard />
                </ProtectedRoute>
              }
            />

            <Route
              path="/patients"
              element={
                <ProtectedRoute>
                  <Patients />
                </ProtectedRoute>
              }
            />

            <Route
              path="/patients/:id"
              element={
                <ProtectedRoute>
                  <PatientDetails />
                </ProtectedRoute>
              }
            />

            <Route
              path="/appointments"
              element={
                <ProtectedRoute>
                  <Appointments />
                </ProtectedRoute>
              }
            />

            <Route
              path="/appointments/new"
              element={
                <ProtectedRoute>
                  <NewAppointment />
                </ProtectedRoute>
              }
            />

            <Route
              path="/appointments/:id"
              element={
                <ProtectedRoute>
                  <AppointmentDetails />
                </ProtectedRoute>
              }
            />

            <Route
              path="/calendar"
              element={
                <ProtectedRoute>
                  <Calendar />
                </ProtectedRoute>
              }
            />

            {/* Patient Routes */}
            <Route
              path="/my-profile"
              element={
                <ProtectedRoute>
                  <MyProfile />
                </ProtectedRoute>
              }
            />

            <Route
              path="/my-appointments"
              element={
                <ProtectedRoute>
                  <MyAppointments />
                </ProtectedRoute>
              }
            />

            {/* Fallback route */}
            <Route path="*" element={<Navigate to="/" />} />
          </Routes>
        </DataProvider>
      </AuthProvider>
    </Router>
  );
}

export default App;
