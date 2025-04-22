'use client';

import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { Asset } from '@tristeroresearch/mach-sdk-types';

interface AssetsCollection {
  [network: string]: {
    [symbol: string]: Asset; // Each token is an Asset
    assets?: { [symbol: string]: Asset }; // Optional assets property
  };
}

interface MachContextType {
  assets: AssetsCollection | null;
  loadingAssets: boolean;
}

const MachContext = createContext<MachContextType | undefined>(undefined);

interface MachProviderProps {
  children: ReactNode;
}

export const MachProvider: React.FC<MachProviderProps> = ({ children }) => {
  const [assets, setAssets] = useState<AssetsCollection | null>(null);
  const [loadingAssets, setLoadingAssets] = useState(true);

  useEffect(() => {
    const fetchAssets = async () => {
      try {
        setLoadingAssets(true);
        const response = await fetch('/api/assets');
        if (!response.ok) throw new Error(`HTTP error! Status: ${response.status}`);
        const responseJson = await response.json();
        const assetData = responseJson.data as AssetsCollection;
        setAssets(assetData);
      } catch (error) {
        console.error('Error fetching assets:', error);
        setAssets(null);
      } finally {
        setLoadingAssets(false);
      }
    };

    fetchAssets();
  }, []);

  const value = {
    assets,
    loadingAssets,
  };

  return <MachContext.Provider value={value}>{children}</MachContext.Provider>;
};

export const useMach = (): MachContextType => {
  const context = useContext(MachContext);
  if (context === undefined) throw new Error('useMach must be used within a MachProvider');
  return context;
};
