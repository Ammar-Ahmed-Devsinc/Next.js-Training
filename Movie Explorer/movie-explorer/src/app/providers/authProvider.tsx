"use client";

import { createActorContext } from '@xstate/react';
import { authMachine } from '../machines/authMachine';

export const AuthContext = createActorContext(authMachine);

export const AuthProvider = ({ children }: { children: React.ReactNode }) => {
  return <AuthContext.Provider>{children}</AuthContext.Provider>;
};

export const useAuth = () => {
  const actor = AuthContext.useActorRef();
  const state = AuthContext.useSelector((state) => state);

  const login = () => {
    actor.send({ type: 'LOGIN' });
    // Simulate login
    setTimeout(() => {
      actor.send({ type: 'SUCCESS' });
      // Persist login state
      if (typeof window !== 'undefined') {
        localStorage.setItem('isLoggedIn', 'true');
      }
    }, 500);
  };

  const logout = () => {
    actor.send({ type: 'LOGOUT' });
    // Clear persisted state
    if (typeof window !== 'undefined') {
      localStorage.removeItem('isLoggedIn');
    }
  };

  return {
    isLoggedIn: state.matches('loggedIn'),
    isLoading: state.matches('loading'),
    login,
    logout,
  };
};