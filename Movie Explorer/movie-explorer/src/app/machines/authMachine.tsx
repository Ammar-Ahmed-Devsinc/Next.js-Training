// app/machines/authMachine.ts
import { createMachine, assign } from "xstate";

// Check if user was previously logged in
const isLoggedIn = 
  typeof window !== 'undefined' ? 
  localStorage.getItem('isLoggedIn') === 'true' : 
  false;

export const authMachine = createMachine({
  id: "auth",
  initial: isLoggedIn ? "loggedIn" : "loggedOut",
  states: {
    loggedOut: {
      on: {
        LOGIN: "loading"
      }
    },
    loading: {
      on: {
        SUCCESS: {
          target: "loggedIn",
          actions: assign({
            // You can store user data here if needed
          })
        },
        FAILURE: "loggedOut"
      }
    },
    loggedIn: {
      on: {
        LOGOUT: {
          target: "loggedOut",
          actions: assign({
            // Clear user data here
          })
        }
      }
    }
  }
});