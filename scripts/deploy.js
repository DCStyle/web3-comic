const { ethers } = require("hardhat");

async function main() {
  console.log("Deploying ComicPlatformPayment...");
  
  const [deployer] = await ethers.getSigners();
  console.log("Deploying with account:", deployer.address);
  console.log("Account balance:", (await deployer.getBalance()).toString());
  
  const ComicPlatformPayment = await ethers.getContractFactory("ComicPlatformPayment");
  const contract = await ComicPlatformPayment.deploy(deployer.address);
  
  await contract.deployed();
  
  console.log("ComicPlatformPayment deployed to:", contract.address);
  console.log("Network:", await ethers.provider.getNetwork());
  
  // Wait for confirmations if on a real network
  if (contract.deployTransaction) {
    console.log("Waiting for 5 confirmations...");
    await contract.deployTransaction.wait(5);
    console.log("Contract confirmed!");
  }
  
  // Display package information
  console.log("\nDefault packages created:");
  for (let i = 0; i < 3; i++) {
    const pkg = await contract.packages(i);
    console.log(`Package ${i}: ${pkg.credits} credits for ${ethers.utils.formatEther(pkg.priceWei)} ETH (${pkg.bonus}% bonus)`);
  }
}

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error);
    process.exit(1);
  });