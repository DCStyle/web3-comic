"use client";

import { ethers } from "ethers";
import contractABI from "@/contracts/abi/ComicPlatformPayment.json";

export class PaymentHandler {
  private provider: any;
  private contract: ethers.Contract | null = null;

  constructor(provider: any) {
    this.provider = provider;
    this.initializeContract();
  }

  private initializeContract() {
    if (!this.provider || !process.env.NEXT_PUBLIC_CONTRACT_ADDRESS) return;

    try {
      const ethersProvider = new ethers.providers.Web3Provider(this.provider);
      const signer = ethersProvider.getSigner();
      
      this.contract = new ethers.Contract(
        process.env.NEXT_PUBLIC_CONTRACT_ADDRESS,
        contractABI.abi,
        signer
      );
    } catch (error) {
      console.error("Failed to initialize contract:", error);
    }
  }

  async purchaseCredits(creditAmount: number): Promise<ethers.ContractReceipt> {
    if (!this.contract) {
      throw new Error("Contract not initialized");
    }

    try {
      // Get credit price from contract
      const creditPriceWei = await this.contract.creditPriceWei();
      const totalCost = creditPriceWei.mul(creditAmount);

      // Execute purchase transaction
      const tx = await this.contract.purchaseCredits(creditAmount, {
        value: totalCost,
        gasLimit: 300000, // Set reasonable gas limit
      });

      // Wait for confirmation
      const receipt = await tx.wait();
      
      if (receipt.status !== 1) {
        throw new Error("Transaction failed");
      }

      return receipt;
    } catch (error: any) {
      console.error("Purchase failed:", error);
      throw new Error(error.message || "Purchase transaction failed");
    }
  }

  async purchasePackage(packageId: number): Promise<ethers.ContractReceipt> {
    if (!this.contract) {
      throw new Error("Contract not initialized");
    }

    try {
      // Get package details
      const packageInfo = await this.contract.packages(packageId);
      
      if (!packageInfo.active) {
        throw new Error("Package is not active");
      }

      // Execute package purchase
      const tx = await this.contract.purchasePackage(packageId, {
        value: packageInfo.priceWei,
        gasLimit: 300000,
      });

      const receipt = await tx.wait();
      
      if (receipt.status !== 1) {
        throw new Error("Transaction failed");
      }

      return receipt;
    } catch (error: any) {
      console.error("Package purchase failed:", error);
      throw new Error(error.message || "Package purchase failed");
    }
  }

  async getPackages(): Promise<Array<{
    id: number;
    credits: number;
    priceWei: ethers.BigNumber;
    priceETH: string;
    bonus: number;
    active: boolean;
  }>> {
    if (!this.contract) {
      throw new Error("Contract not initialized");
    }

    try {
      const packageCount = await this.contract.packageCount();
      const packages = [];

      for (let i = 0; i < packageCount.toNumber(); i++) {
        const pkg = await this.contract.packages(i);
        if (pkg.active) {
          packages.push({
            id: i,
            credits: pkg.credits.toNumber(),
            priceWei: pkg.priceWei,
            priceETH: ethers.utils.formatEther(pkg.priceWei),
            bonus: pkg.bonus.toNumber(),
            active: pkg.active,
          });
        }
      }

      return packages;
    } catch (error) {
      console.error("Failed to fetch packages:", error);
      throw new Error("Failed to fetch credit packages");
    }
  }

  async getCreditPrice(): Promise<{ priceWei: ethers.BigNumber; priceETH: string }> {
    if (!this.contract) {
      throw new Error("Contract not initialized");
    }

    try {
      const priceWei = await this.contract.creditPriceWei();
      return {
        priceWei,
        priceETH: ethers.utils.formatEther(priceWei),
      };
    } catch (error) {
      console.error("Failed to get credit price:", error);
      throw new Error("Failed to get credit price");
    }
  }
}