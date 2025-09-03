"use client";

import { create } from 'zustand';
import { immer } from 'zustand/middleware/immer';
import { connectWallet, getProvider, switchNetwork } from '@/lib/web3/metamask';

interface Web3State {
  isConnected: boolean;
  address: string | null;
  chainId: string | null;
  isConnecting: boolean;
  error: string | null;
}

interface Web3Actions {
  connect: () => Promise<void>;
  disconnect: () => void;
  switchChain: (chainId: string) => Promise<void>;
  clearError: () => void;
  setConnecting: (connecting: boolean) => void;
}

export const useWeb3Store = create<Web3State & Web3Actions>()(
  immer((set, get) => ({
    // State
    isConnected: false,
    address: null,
    chainId: null,
    isConnecting: false,
    error: null,

    // Actions
    connect: async () => {
      try {
        set((state) => {
          state.isConnecting = true;
          state.error = null;
        });

        const { address, chainId } = await connectWallet();
        
        set((state) => {
          state.isConnected = true;
          state.address = address;
          state.chainId = chainId;
          state.isConnecting = false;
        });
      } catch (error) {
        set((state) => {
          state.error = error instanceof Error ? error.message : 'Connection failed';
          state.isConnecting = false;
        });
        throw error;
      }
    },

    disconnect: () => {
      set((state) => {
        state.isConnected = false;
        state.address = null;
        state.chainId = null;
        state.error = null;
      });
    },

    switchChain: async (chainId: string) => {
      try {
        set((state) => {
          state.error = null;
        });

        await switchNetwork(chainId);
        
        set((state) => {
          state.chainId = chainId;
        });
      } catch (error) {
        set((state) => {
          state.error = error instanceof Error ? error.message : 'Network switch failed';
        });
        throw error;
      }
    },

    clearError: () => {
      set((state) => {
        state.error = null;
      });
    },

    setConnecting: (connecting: boolean) => {
      set((state) => {
        state.isConnecting = connecting;
      });
    },
  }))
);