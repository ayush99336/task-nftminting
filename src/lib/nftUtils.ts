import { ethers } from 'ethers';
import { NFT_CONTRACT_ADDRESS, NFT_CONTRACT_ABI } from './contract';

export interface NFTData {
  tokenId: string;
  owner: string;
  tokenURI: string;
  metadata?: {
    name: string;
    description: string;
    image: string;
  };
}

// getUserNFTs is deprecated and not used anymore since we always show all NFTs

export async function getAllNFTs(): Promise<NFTData[]> {
  try {
    // Use a public JSON-RPC provider for Sepolia so view works without MetaMask
    const provider = new ethers.JsonRpcProvider(process.env.NEXT_PUBLIC_SEPOLIA_RPC_URL || 'https://rpc.sepolia.org');
    const contract = new ethers.Contract(NFT_CONTRACT_ADDRESS, NFT_CONTRACT_ABI, provider);
    
    const nfts: NFTData[] = [];
    
    // Since we don't have totalSupply, we'll check tokens incrementally
    const maxTokensToCheck = 100; // Reasonable limit
    
    for (let tokenId = 0; tokenId < maxTokensToCheck; tokenId++) {
      try {
        const owner = await contract.ownerOf(tokenId);
        const tokenURI = await contract.tokenURI(tokenId);
        
        // Fetch metadata from IPFS
        let metadata;
        try {
          const response = await fetch(tokenURI);
          metadata = await response.json();
        } catch (error) {
          console.error('Error fetching metadata for token', tokenId.toString(), error);
        }
        
        nfts.push({
          tokenId: tokenId.toString(),
          owner,
          tokenURI,
          metadata
        });
      } catch (error) {
        // Token doesn't exist - we've reached the end
        break;
      }
    }
    
    return nfts;
  } catch (error) {
    console.error('Error fetching all NFTs:', error);
    throw error;
  }
}

// Helper function to get the next token ID that will be minted
export async function getNextTokenId(): Promise<number> {
  try {
    // @ts-expect-error - Using window.ethereum for MetaMask
    const provider = new ethers.BrowserProvider(window.ethereum);
    const contract = new ethers.Contract(NFT_CONTRACT_ADDRESS, NFT_CONTRACT_ABI, provider);
    
    // Find the next available token ID by checking incrementally
    let tokenId = 0;
    while (tokenId < 10000) { // Safety limit
      try {
        await contract.ownerOf(tokenId);
        tokenId++; // Token exists, check next
      } catch (error) {
        // Token doesn't exist, this is the next ID
        return tokenId;
      }
    }
    
    return tokenId;
  } catch (error) {
    console.error('Error getting next token ID:', error);
    return 0; // Fallback to 0
  }
}
