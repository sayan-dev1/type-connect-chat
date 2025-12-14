import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';

interface User {
  username: string;
  mbtiType: string;
  uid: string;
}

interface UserContextType {
  user: User | null;
  setUser: (user: User | null) => void;
  isAuthenticated: boolean;
  logout: () => void;
}

const UserContext = createContext<UserContextType | undefined>(undefined);

export const UserProvider = ({ children }: { children: ReactNode }) => {
  const [user, setUser] = useState<User | null>(() => {
    const saved = localStorage.getItem('typetalk_user');
    return saved ? JSON.parse(saved) : null;
  });

  useEffect(() => {
    if (user) {
      localStorage.setItem('typetalk_user', JSON.stringify(user));
    } else {
      localStorage.removeItem('typetalk_user');
    }
  }, [user]);

  const logout = () => {
    setUser(null);
    localStorage.removeItem('typetalk_user');
  };

  return (
    <UserContext.Provider value={{ 
      user, 
      setUser, 
      isAuthenticated: !!user,
      logout 
    }}>
      {children}
    </UserContext.Provider>
  );
};

export const useUser = () => {
  const context = useContext(UserContext);
  if (context === undefined) {
    throw new Error('useUser must be used within a UserProvider');
  }
  return context;
};
