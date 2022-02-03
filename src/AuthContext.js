import React, { useEffect, useState } from 'react'
import { auth } from './firebase'


export const AuthContext = React.createContext();

export const AuthProvider = ({ children }) => {
  const [currentUser, setCurrentUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(()=>{
    auth.onAuthStateChanged((user) => {
      setCurrentUser(user);
      setLoading(false);
    });
  }, []);

  if (loading){
    return <div>Loading</div>;
  }

  return (
  <AuthContext.Provider
    value={{currentUser,}}
  >
    {children}
  </AuthContext.Provider>
  );
};
