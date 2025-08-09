"use client";

import { createContext, useContext, useState, useEffect } from 'react';

const ApiKeyContext = createContext(null);

export function ApiKeyProvider({ children }) {
  const [apiKey, setApiKey] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

  // Load the API key from local storage on initial mount
  useEffect(() => {
    const storedKey = localStorage.getItem('geminiAPIKey');
    if (storedKey) {
      setApiKey(storedKey);
    } else {
      setIsModalOpen(true); // Open the modal if no key is found
    }
  }, []);

  // Function to save the API key to local storage and update state
  const saveApiKey = (key) => {
    localStorage.setItem('geminiAPIKey', key);
    setApiKey(key);
  };

  return (
    <ApiKeyContext.Provider value={{ apiKey, setApiKey: saveApiKey, isModalOpen, setIsModalOpen }}>
      {children}
    </ApiKeyContext.Provider>
  );
}

export function useApiKey() {
  const context = useContext(ApiKeyContext);
  if (!context) {
    throw new Error('useApiKey must be used within an ApiKeyProvider');
  }
  return context;
}
