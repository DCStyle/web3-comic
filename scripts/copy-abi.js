const fs = require('fs');
const path = require('path');

// Create ABI directory if it doesn't exist
const abiDir = path.join(__dirname, '..', 'src', 'contracts', 'abi');
if (!fs.existsSync(abiDir)) {
  fs.mkdirSync(abiDir, { recursive: true });
}

// Copy ComicPlatformPayment ABI
const artifactPath = path.join(__dirname, '..', 'artifacts', 'contracts', 'ComicPlatformPayment.sol', 'ComicPlatformPayment.json');
const abiPath = path.join(abiDir, 'ComicPlatformPayment.json');

if (fs.existsSync(artifactPath)) {
  const artifact = JSON.parse(fs.readFileSync(artifactPath, 'utf8'));
  const abi = {
    abi: artifact.abi,
    bytecode: artifact.bytecode
  };
  
  fs.writeFileSync(abiPath, JSON.stringify(abi, null, 2));
  console.log('ABI copied to:', abiPath);
} else {
  console.error('Artifact not found. Make sure to compile contracts first.');
}