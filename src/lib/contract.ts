// NFT Contract ABI and Configuration
export const NFT_CONTRACT_ADDRESS = '0x522b5aAdE25E0f5795AB91A9447564b3978b9335';

export const NFT_CONTRACT_ABI = [
  "function safeMint(address to, string memory uri) public",
  "function tokenURI(uint256 tokenId) public view returns (string memory)",
  "function ownerOf(uint256 tokenId) public view returns (address)",
  "function balanceOf(address owner) public view returns (uint256)",
  "event Transfer(address indexed from, address indexed to, uint256 indexed tokenId)"
];

// Network configuration
export const NETWORK_CONFIG = {
  chainId: '0x1', // Ethereum Mainnet (change to '0x11155111' for Sepolia testnet)
  chainName: 'Ethereum Mainnet',
  rpcUrls: ['https://ethereum.publicnode.com'],
  blockExplorerUrls: ['https://etherscan.io/']
};
