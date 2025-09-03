"use client";

import { MetaMaskSDK } from "@metamask/sdk";

let sdk: MetaMaskSDK | null = null;

export function getMetaMaskSDK() {
  if (typeof window === "undefined") return null;
  
  if (!sdk) {
    sdk = new MetaMaskSDK({
      dappMetadata: {
        name: process.env.NEXT_PUBLIC_APP_NAME || "Web3 Comic Platform",
        url: process.env.NEXT_PUBLIC_APP_URL || window.location.origin,
      },
      preferDesktop: true,
      checkInstallationImmediately: false,
      checkInstallationOnAllCalls: true,
    });
  }
  
  return sdk;
}

export function getProvider() {
  // First try to get the injected provider (extension)
  if (typeof window !== "undefined" && window.ethereum) {
    return window.ethereum;
  }
  
  // Fallback to SDK provider
  const sdk = getMetaMaskSDK();
  return sdk?.getProvider();
}

export async function connectWallet() {
  try {
    let provider = getProvider();
    
    // If no provider, try to initialize SDK and get provider
    if (!provider) {
      const sdk = getMetaMaskSDK();
      if (sdk) {
        await sdk.connect();
        provider = sdk.getProvider();
      }
    }
    
    if (!provider) {
      throw new Error("MetaMask not available. Please install MetaMask extension or use MetaMask mobile app.");
    }

    const accounts = await provider.request({
      method: "eth_requestAccounts",
    }) as string[];

    if (!accounts.length) {
      throw new Error("No accounts found");
    }

    return {
      address: accounts[0],
      chainId: await provider.request({ method: "eth_chainId" }) as string,
    };
  } catch (error) {
    console.error("Failed to connect wallet:", error);
    throw error;
  }
}

export async function switchNetwork(chainId: string) {
  try {
    const provider = getProvider();
    if (!provider) throw new Error("MetaMask not available");

    await provider.request({
      method: "wallet_switchEthereumChain",
      params: [{ chainId }],
    });
  } catch (error) {
    console.error("Failed to switch network:", error);
    throw error;
  }
}

export async function signMessage(message: string, address: string) {
  try {
    const provider = getProvider();
    if (!provider) throw new Error("MetaMask not available");

    const signature = await provider.request({
      method: "personal_sign",
      params: [message, address],
    }) as string;

    return signature;
  } catch (error) {
    console.error("Failed to sign message:", error);
    throw error;
  }
}