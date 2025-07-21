
"use client";

import React, { createContext, useState, useContext, useEffect } from 'react';

interface ApiKeyContextType {
  apiKey: string | null;
  setApiKey: (key: string | null) => void;
  isModalOpen: boolean;
  setIsModalOpen: (isOpen: boolean) => void;
}

const ApiKeyContext = createContext<ApiKeyContextType | undefined>(undefined);

export const ApiKeyProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [apiKey, setApiKeyInternal] = useState<string | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isInitialized, setIsInitialized] = useState(false);

  useEffect(() => {
    try {
      const storedKey = localStorage.getItem('gemini-api-key');
      if (storedKey) {
        setApiKeyInternal(storedKey);
      } else {
        setIsModalOpen(true);
      }
    } catch (error) {
      console.error("Could not access localStorage.", error);
      setIsModalOpen(true);
    }
    setIsInitialized(true);
  }, []);

  const setApiKey = (key: string | null) => {
    setApiKeyInternal(key);
    try {
      if (key) {
        localStorage.setItem('gemini-api-key', key);
        setIsModalOpen(false);
      } else {
        localStorage.removeItem('gemini-api-key');
      }
    } catch (error) {
      console.error("Could not access localStorage.", error);
    }
  };

  if (!isInitialized) {
    return null;
  }

  return (
    <ApiKeyContext.Provider value={{ apiKey, setApiKey, isModalOpen, setIsModalOpen }}>
       {children}
    </ApiKeyContext.Provider>
  );
};

export const useApiKey = () => {
  const context = useContext(ApiKeyContext);
  if (context === undefined) {
    throw new Error('useApiKey must be used within an ApiKeyProvider');
  }
  return context;
};
