import { createContext, useState, useContext, useEffect } from 'react';

const AuthContext = createContext();

export const useAuth = () => {
  return useContext(AuthContext);
};

export const AuthProvider = ({ children }) => {
  const [currentUser, setCurrentUser] = useState(null);
  const [loading, setLoading] = useState(true);

  // Check localStorage for an existing user session on app load
  useEffect(() => {
    const storedUser = localStorage.getItem('dentalUser');
    if (storedUser) {
      setCurrentUser(JSON.parse(storedUser));
    }
    setLoading(false);
  }, []);

  // Login function
  const login = (email, password) => {
    // Simulate authentication (in a real app, this would be an API call)
    // For demo purposes, we'll have predefined users
    
    const users = [
      { id: '1', name: 'Admin User', email: 'admin@dental.com', password: 'admin123', role: 'admin' },
      { id: '2', name: 'Patient One', email: 'patient1@example.com', password: 'patient123', role: 'patient' },
      { id: '3', name: 'Patient Two', email: 'patient2@example.com', password: 'patient123', role: 'patient' },
    ];

    const user = users.find(user => user.email === email && user.password === password);
    
    if (user) {
      // Remove password before storing user object
      const { password, ...userWithoutPassword } = user;
      localStorage.setItem('dentalUser', JSON.stringify(userWithoutPassword));
      setCurrentUser(userWithoutPassword);
      return { success: true, user: userWithoutPassword };
    } else {
      return { success: false, message: 'Invalid email or password' };
    }
  };

  // Logout function
  const logout = () => {
    localStorage.removeItem('dentalUser');
    setCurrentUser(null);
  };

  // Check if user has a specific role
  const hasRole = (role) => {
    return currentUser?.role === role;
  };

  const value = {
    currentUser,
    login,
    logout,
    hasRole,
    isAdmin: currentUser?.role === 'admin',
    isPatient: currentUser?.role === 'patient',
  };

  return (
    <AuthContext.Provider value={value}>
      {!loading && children}
    </AuthContext.Provider>
  );
};
