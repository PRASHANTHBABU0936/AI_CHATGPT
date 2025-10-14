// import React, { createContext, useContext, useState, useEffect } from 'react';
// import axios from 'axios';

// const AuthContext = createContext();

// // Configure axios defaults
// axios.defaults.baseURL = 'http://localhost:8080/api';
// axios.defaults.headers.common['Content-Type'] = 'application/json';

// // Add request interceptor to include auth token
// axios.interceptors.request.use(
//   (config) => {
//     const token = localStorage.getItem('token');
//     if (token) {
//       config.headers.Authorization = `Bearer ${token}`;
//     }
//     return config;
//   },
//   (error) => {
//     return Promise.reject(error);
//   }
// );

// // Add response interceptor to handle auth errors
// axios.interceptors.response.use(
//   (response) => response,
//   (error) => {
//     if (error.response?.status === 401) {
//       localStorage.removeItem('token');
//       localStorage.removeItem('user');
//       window.location.href = '/login';
//     }
//     return Promise.reject(error);
//   }
// );

// export const useAuth = () => {
//   const context = useContext(AuthContext);
//   if (!context) {
//     throw new Error('useAuth must be used within an AuthProvider');
//   }
//   return context;
// };

// export const AuthProvider = ({ children }) => {
//   const [user, setUser] = useState(null);
//   const [token, setToken] = useState(null);
//   const [loading, setLoading] = useState(true);
//   const [error, setError] = useState(null);

//   // Initialize auth state from localStorage
//   useEffect(() => {
//     const initializeAuth = async () => {
//       try {
//         const storedToken = localStorage.getItem('token');
//         const storedUser = localStorage.getItem('user');

//         if (storedToken && storedUser) {
//           setToken(storedToken);
//           setUser(JSON.parse(storedUser));
          
//           // Verify token is still valid
//           try {
//             const response = await axios.get('/auth/verify');
//             if (response.data.valid) {
//               setUser(response.data.user);
//               localStorage.setItem('user', JSON.stringify(response.data.user));
//             } else {
//               throw new Error('Invalid token');
//             }
//           } catch (error) {
//             // Token is invalid, clear storage
//             localStorage.removeItem('token');
//             localStorage.removeItem('user');
//             setToken(null);
//             setUser(null);
//           }
//         }
//       } catch (error) {
//         console.error('Auth initialization error:', error);
//         localStorage.removeItem('token');
//         localStorage.removeItem('user');
//       } finally {
//         setLoading(false);
//       }
//     };

//     initializeAuth();
//   }, []);

//   const login = async (email, password) => {
//     try {
//       setError(null);
//       setLoading(true);

//       const response = await axios.post('/auth/login', {
//         email,
//         password
//       });

//       const { token: newToken, user: userData } = response.data;

//       // Store in localStorage
//       localStorage.setItem('token', newToken);
//       localStorage.setItem('user', JSON.stringify(userData));

//       // Update state
//       setToken(newToken);
//       setUser(userData);

//       return { success: true };
//     } catch (error) {
//       const errorMessage = error.response?.data?.error || 'Login failed';
//       setError(errorMessage);
//       return { success: false, error: errorMessage };
//     } finally {
//       setLoading(false);
//     }
//   };

//   const register = async (name, email, password, confirmPassword) => {
//     try {
//       setError(null);
//       setLoading(true);

//       const response = await axios.post('/auth/register', {
//         name,
//         email,
//         password,
//         confirmPassword
//       });

//       const { token: newToken, user: userData } = response.data;

//       // Store in localStorage
//       localStorage.setItem('token', newToken);
//       localStorage.setItem('user', JSON.stringify(userData));

//       // Update state
//       setToken(newToken);
//       setUser(userData);

//       return { success: true };
//     } catch (error) {
//       const errorMessage = error.response?.data?.error || 'Registration failed';
//       setError(errorMessage);
//       return { success: false, error: errorMessage };
//     } finally {
//       setLoading(false);
//     }
//   };

//   const logout = async () => {
//     try {
//       // Call logout endpoint if token exists
//       if (token) {
//         await axios.post('/auth/logout');
//       }
//     } catch (error) {
//       console.error('Logout error:', error);
//     } finally {
//       // Clear storage and state regardless of API call success
//       localStorage.removeItem('token');
//       localStorage.removeItem('user');
//       setToken(null);
//       setUser(null);
//       setError(null);
//     }
//   };

//   const updateProfile = async (updates) => {
//     try {
//       setError(null);
//       setLoading(true);

//       const response = await axios.put('/auth/profile', updates);
//       const updatedUser = response.data.user;

//       // Update localStorage and state
//       localStorage.setItem('user', JSON.stringify(updatedUser));
//       setUser(updatedUser);

//       return { success: true, user: updatedUser };
//     } catch (error) {
//       const errorMessage = error.response?.data?.error || 'Profile update failed';
//       setError(errorMessage);
//       return { success: false, error: errorMessage };
//     } finally {
//       setLoading(false);
//     }
//   };

//   const changePassword = async (currentPassword, newPassword) => {
//     try {
//       setError(null);
//       setLoading(true);

//       await axios.put('/auth/change-password', {
//         currentPassword,
//         newPassword
//       });

//       return { success: true };
//     } catch (error) {
//       const errorMessage = error.response?.data?.error || 'Password change failed';
//       setError(errorMessage);
//       return { success: false, error: errorMessage };
//     } finally {
//       setLoading(false);
//     }
//   };

//   const clearError = () => {
//     setError(null);
//   };

//   const value = {
//     user,
//     token,
//     loading,
//     error,
//     login,
//     register,
//     logout,
//     updateProfile,
//     changePassword,
//     clearError,
//     isAuthenticated: !!user && !!token
//   };

//   return (
//     <AuthContext.Provider value={value}>
//       {children}
//     </AuthContext.Provider>
//   );
// };



// import React, { createContext, useContext, useState, useEffect } from 'react';
// import axios from 'axios';
// import { useNavigate } from 'react-router-dom';  // ✅ Added this

// const AuthContext = createContext();

// // Configure axios defaults
// axios.defaults.baseURL = 'http://localhost:8080/api';
// axios.defaults.headers.common['Content-Type'] = 'application/json';

// // Add request interceptor to include auth token
// axios.interceptors.request.use(
//   (config) => {
//     const token = localStorage.getItem('token');
//     if (token) {
//       config.headers.Authorization = `Bearer ${token}`;
//     }
//     return config;
//   },
//   (error) => {
//     return Promise.reject(error);
//   }
// );

// // Add response interceptor to handle auth errors
// axios.interceptors.response.use(
//   (response) => response,
//   (error) => {
//     if (error.response?.status === 401) {
//       localStorage.removeItem('token');
//       localStorage.removeItem('user');
//       window.location.href = '/login';
//     }
//     return Promise.reject(error);
//   }
// );

// export const useAuth = () => {
//   const context = useContext(AuthContext);
//   if (!context) {
//     throw new Error('useAuth must be used within an AuthProvider');
//   }
//   return context;
// };

// export const AuthProvider = ({ children }) => {
//   const navigate = useNavigate();  // ✅ Add this here

//   const [user, setUser] = useState(null);
//   const [token, setToken] = useState(null);
//   const [loading, setLoading] = useState(true);
//   const [error, setError] = useState(null);

//   // Initialize auth state from localStorage
//   useEffect(() => {
//     const initializeAuth = async () => {
//       try {
//         const storedToken = localStorage.getItem('token');
//         const storedUser = localStorage.getItem('user');

//         if (storedToken && storedUser) {
//           setToken(storedToken);
//           setUser(JSON.parse(storedUser));
          
//           // Verify token is still valid
//           try {
//             const response = await axios.get('/auth/verify');
//             if (response.data.valid) {
//               setUser(response.data.user);
//               localStorage.setItem('user', JSON.stringify(response.data.user));
//             } else {
//               throw new Error('Invalid token');
//             }
//           } catch (error) {
//             // Token is invalid, clear storage
//             localStorage.removeItem('token');
//             localStorage.removeItem('user');
//             setToken(null);
//             setUser(null);
//           }
//         }
//       } catch (error) {
//         console.error('Auth initialization error:', error);
//         localStorage.removeItem('token');
//         localStorage.removeItem('user');
//       } finally {
//         setLoading(false);
//       }
//     };

//     initializeAuth();
//   }, []);

//   const login = async (email, password) => {
//     try {
//       setError(null);
//       setLoading(true);

//       const response = await axios.post('/auth/login', {
//         email,
//         password
//       });

//       const { token: newToken, user: userData } = response.data;

//       // Store in localStorage
//       localStorage.setItem('token', newToken);
//       localStorage.setItem('user', JSON.stringify(userData));

//       // Update state
//       setToken(newToken);
//       setUser(userData);

//       navigate('/'); // ✅ Redirect to home/dashboard

//       return { success: true };
//     } catch (error) {
//       const errorMessage = error.response?.data?.error || 'Login failed';
//       setError(errorMessage);
//       return { success: false, error: errorMessage };
//     } finally {
//       setLoading(false);
//     }
//   };

//   const register = async (name, email, password, confirmPassword) => {
//     try {
//       setError(null);
//       setLoading(true);

//       const response = await axios.post('/auth/register', {
//         name,
//         email,
//         password,
//         confirmPassword
//       });

//       const { token: newToken, user: userData } = response.data;

//       // Store in localStorage
//       localStorage.setItem('token', newToken);
//       localStorage.setItem('user', JSON.stringify(userData));

//       // Update state
//       setToken(newToken);
//       setUser(userData);

//       navigate('/'); // ✅ Redirect after signup

//       return { success: true };
//     } catch (error) {
//       const errorMessage = error.response?.data?.error || 'Registration failed';
//       setError(errorMessage);
//       return { success: false, error: errorMessage };
//     } finally {
//       setLoading(false);
//     }
//   };

//   const logout = async () => {
//     try {
//       if (token) {
//         await axios.post('/auth/logout');
//       }
//     } catch (error) {
//       console.error('Logout error:', error);
//     } finally {
//       localStorage.removeItem('token');
//       localStorage.removeItem('user');
//       setToken(null);
//       setUser(null);
//       setError(null);
//       navigate('/login'); // ✅ Redirect after logout
//     }
//   };

//   const updateProfile = async (updates) => {
//     try {
//       setError(null);
//       setLoading(true);

//       const response = await axios.put('/auth/profile', updates);
//       const updatedUser = response.data.user;

//       localStorage.setItem('user', JSON.stringify(updatedUser));
//       setUser(updatedUser);

//       return { success: true, user: updatedUser };
//     } catch (error) {
//       const errorMessage = error.response?.data?.error || 'Profile update failed';
//       setError(errorMessage);
//       return { success: false, error: errorMessage };
//     } finally {
//       setLoading(false);
//     }
//   };

//   const changePassword = async (currentPassword, newPassword) => {
//     try {
//       setError(null);
//       setLoading(true);

//       await axios.put('/auth/change-password', {
//         currentPassword,
//         newPassword
//       });

//       return { success: true };
//     } catch (error) {
//       const errorMessage = error.response?.data?.error || 'Password change failed';
//       setError(errorMessage);
//       return { success: false, error: errorMessage };
//     } finally {
//       setLoading(false);
//     }
//   };

//   const clearError = () => {
//     setError(null);
//   };

//   const value = {
//     user,
//     token,
//     loading,
//     error,
//     login,
//     register,
//     logout,
//     updateProfile,
//     changePassword,
//     clearError,
//     isAuthenticated: !!user && !!token
//   };

//   return (
//     <AuthContext.Provider value={value}>
//       {children}
//     </AuthContext.Provider>
//   );
// };




import React, { createContext, useContext, useState, useEffect } from 'react';
import axios from 'axios';

const AuthContext = createContext();

// Axios configuration
axios.defaults.baseURL = 'http://localhost:8080/api';
axios.defaults.headers.common['Content-Type'] = 'application/json';

// Add request interceptor to include auth token
axios.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

// Add response interceptor to handle auth errors globally
axios.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      localStorage.removeItem('token');
      localStorage.removeItem('user');
      window.location.href = '/login';
    }
    return Promise.reject(error);
  }
);

// Custom hook to use AuthContext
export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [token, setToken] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Initialize auth state from localStorage
  useEffect(() => {
    const initializeAuth = async () => {
      try {
        const storedToken = localStorage.getItem('token');
        const storedUser = localStorage.getItem('user');

        if (storedToken && storedUser) {
          setToken(storedToken);
          setUser(JSON.parse(storedUser));

          // Verify token validity
          try {
            const response = await axios.get('/auth/verify');
            if (response.data.valid) {
              setUser(response.data.user);
              localStorage.setItem('user', JSON.stringify(response.data.user));
            } else {
              throw new Error('Invalid token');
            }
          } catch {
            localStorage.removeItem('token');
            localStorage.removeItem('user');
            setToken(null);
            setUser(null);
          }
        }
      } catch (err) {
        console.error('Auth initialization error:', err);
        localStorage.removeItem('token');
        localStorage.removeItem('user');
      } finally {
        setLoading(false);
      }
    };

    initializeAuth();
  }, []);

  // Login function
  const login = async (email, password) => {
    try {
      setError(null);
      setLoading(true);

      const response = await axios.post('/auth/login', { email, password });
      const { token: newToken, user: userData } = response.data;

      localStorage.setItem('token', newToken);
      localStorage.setItem('user', JSON.stringify(userData));

      setToken(newToken);
      setUser(userData);

      return { success: true };
    } catch (err) {
      const errorMessage = err.response?.data?.error || 'Login failed';
      setError(errorMessage);
      return { success: false, error: errorMessage };
    } finally {
      setLoading(false);
    }
  };

  // Register function
  const register = async (name, email, password, confirmPassword) => {
    try {
      setError(null);
      setLoading(true);

      const response = await axios.post('/auth/register', {
        name,
        email,
        password,
        confirmPassword
      });

      const { token: newToken, user: userData } = response.data;

      localStorage.setItem('token', newToken);
      localStorage.setItem('user', JSON.stringify(userData));

      setToken(newToken);
      setUser(userData);

      return { success: true };
    } catch (err) {
      const errorMessage = err.response?.data?.error || 'Registration failed';
      setError(errorMessage);
      return { success: false, error: errorMessage };
    } finally {
      setLoading(false);
    }
  };

  // Logout function
  const logout = async () => {
    try {
      if (token) {
        await axios.post('/auth/logout');
      }
    } catch (err) {
      console.error('Logout error:', err);
    } finally {
      localStorage.removeItem('token');
      localStorage.removeItem('user');
      setToken(null);
      setUser(null);
      setError(null);
      window.location.href = '/login'; // Redirect after logout
    }
  };

  // Profile update
  const updateProfile = async (updates) => {
    try {
      setError(null);
      setLoading(true);

      const response = await axios.put('/auth/profile', updates);
      const updatedUser = response.data.user;

      localStorage.setItem('user', JSON.stringify(updatedUser));
      setUser(updatedUser);

      return { success: true, user: updatedUser };
    } catch (err) {
      const errorMessage = err.response?.data?.error || 'Profile update failed';
      setError(errorMessage);
      return { success: false, error: errorMessage };
    } finally {
      setLoading(false);
    }
  };

  // Change password
  const changePassword = async (currentPassword, newPassword) => {
    try {
      setError(null);
      setLoading(true);

      await axios.put('/auth/change-password', { currentPassword, newPassword });
      return { success: true };
    } catch (err) {
      const errorMessage = err.response?.data?.error || 'Password change failed';
      setError(errorMessage);
      return { success: false, error: errorMessage };
    } finally {
      setLoading(false);
    }
  };

  const clearError = () => setError(null);

  const value = {
    user,
    token,
    loading,
    error,
    login,
    register,
    logout,
    updateProfile,
    changePassword,
    clearError,
    isAuthenticated: !!user && !!token
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};
