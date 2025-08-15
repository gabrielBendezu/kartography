import React, { createContext, useContext, useState, ReactNode, useCallback } from 'react';

interface TerrainMask {
  id: string;
  points: number[];
  width: number;
}

interface TerrainMaskContextType {
  terrainMasks: TerrainMask[];
  addTerrainMask: (mask: TerrainMask) => void;
  clearTerrainMasks: () => void;
}

const TerrainMaskContext = createContext<TerrainMaskContextType | undefined>(undefined);

export const TerrainMaskProvider = ({ children }: { children: ReactNode }) => {
  const [terrainMasks, setTerrainMasks] = useState<TerrainMask[]>([]);

  const addTerrainMask = useCallback((mask: TerrainMask) => {
    setTerrainMasks(prev => [...prev, mask]);
  }, []);

  const clearTerrainMasks = useCallback(() => {
    setTerrainMasks([]);
  }, []);

  return (
    <TerrainMaskContext.Provider value={{ terrainMasks, addTerrainMask, clearTerrainMasks }}>
      {children}
    </TerrainMaskContext.Provider>
  );
};

export const useTerrainMask = () => {
  const context = useContext(TerrainMaskContext);
  if (context === undefined) {
    throw new Error('useTerrainMask must be used within a TerrainMaskProvider');
  }
  return context;
};