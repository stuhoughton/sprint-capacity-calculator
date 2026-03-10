import React, { createContext, useContext, ReactNode } from 'react';
import { AppState, AppAction } from '../types';

/**
 * Context for application state and dispatch
 * Provides access to global state and reducer dispatch function
 */
interface AppContextType {
  state: AppState;
  dispatch: React.Dispatch<AppAction>;
}

/**
 * Create the AppContext with undefined as default
 * This will be provided by AppProvider
 */
export const AppContext = createContext<AppContextType | undefined>(undefined);

/**
 * Provider component that wraps the application with AppContext
 * @param children - React components to wrap
 * @param state - Current application state
 * @param dispatch - Reducer dispatch function
 */
export interface AppProviderProps {
  children: ReactNode;
  state: AppState;
  dispatch: React.Dispatch<AppAction>;
}

export const AppProvider: React.FC<AppProviderProps> = ({
  children,
  state,
  dispatch,
}) => {
  return (
    <AppContext.Provider value={{ state, dispatch }}>
      {children}
    </AppContext.Provider>
  );
};

/**
 * Custom hook for accessing AppContext
 * Must be used within an AppProvider
 * @returns Object containing state and dispatch
 * @throws Error if used outside of AppProvider
 */
export const useAppContext = (): AppContextType => {
  const context = useContext(AppContext);

  if (context === undefined) {
    throw new Error(
      'useAppContext must be used within an AppProvider. ' +
        'Make sure your component is wrapped with <AppProvider>.'
    );
  }

  return context;
};
