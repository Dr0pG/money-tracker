import React, { createContext, useContext, ReactNode } from "react";
import auth, { FirebaseAuthTypes } from "@react-native-firebase/auth";

// Define the context type
interface UserContextType {
  user: FirebaseAuthTypes.User | null;
}

// Create the context
const UserContext = createContext<UserContextType | undefined>(undefined);

interface UserProviderProps {
  children: ReactNode;
}

export const UserProvider = ({ children }: UserProviderProps) => {
  const currentUser: FirebaseAuthTypes.User | null = auth().currentUser;

  return (
    <UserContext.Provider value={{ user: currentUser }}>
      {children}
    </UserContext.Provider>
  );
};

export const getUser = (): UserContextType => {
  const context = useContext(UserContext);
  if (!context) {
    throw new Error("Can't get any user!");
  }
  return context;
};
