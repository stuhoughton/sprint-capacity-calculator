import { useReducer, useEffect } from 'react';
import { AppProvider } from './context/AppContext';
import { appReducer } from './hooks/useReducer';
import { loadState, saveState } from './utils/storage';
import { DEFAULT_CONFIG } from './constants';
import { AppState } from './types';
import { Header, MainContainer, Footer } from './components';

/**
 * Default initial state for the application
 */
const DEFAULT_STATE: AppState = {
  teamMembers: [],
  config: DEFAULT_CONFIG,
};

/**
 * App root component
 * Manages global state with Context API and useReducer
 * Initializes state from localStorage on mount
 * Syncs state to localStorage with 100ms debounce
 * Provides AppContext to all child components
 */
export default function App() {
  // Initialize state from localStorage or use default
  const [state, dispatch] = useReducer(appReducer, DEFAULT_STATE, (initial) => {
    try {
      const savedState = loadState();
      if (savedState) {
        return savedState;
      }
    } catch (error) {
      console.error('Failed to load state from localStorage:', error);
    }
    return initial;
  });

  // Debounced localStorage sync (100ms)
  useEffect(() => {
    const timer = setTimeout(() => {
      try {
        saveState(state);
      } catch (error) {
        console.error('Failed to save state to localStorage:', error);
      }
    }, 100);

    return () => clearTimeout(timer);
  }, [state]);

  return (
    <AppProvider state={state} dispatch={dispatch}>
      <div className="min-h-screen bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 md:py-8 lg:py-12">
          <Header />
          <MainContainer />
          <Footer />
        </div>
      </div>
    </AppProvider>
  );
}
