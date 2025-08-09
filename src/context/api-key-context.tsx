"use client";

import React, { createContext, useContext, useState, useEffect } from "react";

type ApiKeyContextType = {
  apiKey: string | null;
  setApiKey: (key: string) => void;
  isModalOpen: boolean;
  setIsModalOpen: (open: boolean) => void;
};

const ApiKeyContext = createContext<ApiKeyContextType | undefined>(undefined);

export function ApiKeyProvider({ children }: { children: React.ReactNode }) {
  const [apiKey, setApiKeyState] = useState<string | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

  useEffect(() => {
    const storedKey = localStorage.getItem("gemini_api_key");
    if (storedKey) {
      setApiKeyState(storedKey);
    } else {
      setIsModalOpen(true); // Show modal if no key saved
    }
  }, []);

  const setApiKey = (key: string) => {
    setApiKeyState(key);
    localStorage.setItem("gemini_api_key", key);
  };

  return (
    <ApiKeyContext.Provider value={{ apiKey, setApiKey, isModalOpen, setIsModalOpen }}>
      {children}
    </ApiKeyContext.Provider>
  );
}

export function useApiKey() {
  const context = useContext(ApiKeyContext);
  if (!context) {
    throw new Error("useApiKey must be used within ApiKeyProvider");
  }
  return context;
}
