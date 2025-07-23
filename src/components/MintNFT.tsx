import { useState } from 'react';
import { Button } from './ui/button';
import { ethers } from 'ethers';
import Image from 'next/image';
import { NFT_CONTRACT_ADDRESS, NFT_CONTRACT_ABI } from '@/lib/contract';

interface NFTMetadata {
  name: string;
  description: string;
  image: string;
}

export default function MintNFT({ wallet }: { wallet: string | null }) {
  const [file, setFile] = useState<File | null>(null);
  const [preview, setPreview] = useState<string | null>(null);
  const [name, setName] = useState('');
  const [description, setDescription] = useState('');
  const [minting, setMinting] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [imageIpfsUrl, setImageIpfsUrl] = useState<string | null>(null);
  const [metadataIpfsUrl, setMetadataIpfsUrl] = useState<string | null>(null);
  const [txHash, setTxHash] = useState<string | null>(null);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const selectedFile = e.target.files[0];
      setFile(selectedFile);
      
      // Create preview URL
      const previewUrl = URL.createObjectURL(selectedFile);
      setPreview(previewUrl);
    }
  };

  const uploadImageToIPFS = async () => {
    if (!file) return null;
    const formData = new FormData();
    formData.append('file', file);
    const res = await fetch('/api/files', {
      method: 'POST',
      body: formData,
    });
    const data = await res.json();
    if (res.status !== 200) throw new Error(data.error || 'Upload failed');
    return data; // This will be the URL from our API
  };

  const uploadMetadataToIPFS = async (metadata: NFTMetadata) => {
    const metadataBlob = new Blob([JSON.stringify(metadata, null, 2)], { type: 'application/json' });
    const metadataFile = new File([metadataBlob], 'metadata.json', { type: 'application/json' });
    
    const formData = new FormData();
    formData.append('file', metadataFile);
    const res = await fetch('/api/files', {
      method: 'POST',
      body: formData,
    });
    const data = await res.json();
    if (res.status !== 200) throw new Error(data.error || 'Metadata upload failed');
    return data; // This will be the URL from our API
  };

  const handleMint = async () => {
    if (!wallet || !file || !name.trim()) {
      alert('Please connect wallet, select a file, and enter a name');
      return;
    }
    
    setMinting(true);
    setUploading(true);
    
    try {
      // Step 1: Upload image to IPFS
      console.log('Uploading image to IPFS...');
      const imageUrl = await uploadImageToIPFS();
      setImageIpfsUrl(imageUrl);
      console.log('Image uploaded:', imageUrl);

      // Step 2: Create and upload metadata
      const metadata: NFTMetadata = {
        name: name.trim(),
        description: description.trim() || 'NFT created with Pinata and Ethereum',
        image: imageUrl
      };

      console.log('Uploading metadata to IPFS...');
      const metadataUrl = await uploadMetadataToIPFS(metadata);
      setMetadataIpfsUrl(metadataUrl);
      console.log('Metadata uploaded:', metadataUrl);
      
      setUploading(false);

      // Step 3: Mint NFT
      console.log('Minting NFT...');
      // @ts-expect-error - Using window.ethereum for MetaMask
      const provider = new ethers.BrowserProvider(window.ethereum);
      const signer = await provider.getSigner();
      const contract = new ethers.Contract(NFT_CONTRACT_ADDRESS, NFT_CONTRACT_ABI, signer);
      
      const tx = await contract.safeMint(wallet, metadataUrl);
      setTxHash(tx.hash);
      console.log('Transaction sent:', tx.hash);
      
      await tx.wait();
      console.log('NFT minted successfully!');
      alert('NFT minted successfully!');
      
      // Reset form
      setFile(null);
      setPreview(null);
      setName('');
      setDescription('');
      
    } catch (error) {
      console.error('Mint failed:', error);
      alert(`Mint failed: ${error instanceof Error ? error.message : 'Unknown error'}`);
    } finally {
      setMinting(false);
      setUploading(false);
    }
  };

  return (
    <div className="space-y-6">
      {/* File Upload */}
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">
          Upload Image
        </label>
        <input 
          type="file" 
          accept="image/*" 
          onChange={handleFileChange}
          className="block w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-blue-50 file:text-blue-700 hover:file:bg-blue-100"
        />
      </div>

      {/* Preview */}
      {preview && (
        <div className="border rounded-lg p-4">
          <label className="block text-sm font-medium text-gray-700 mb-2">Preview</label>
          <div className="relative w-48 h-48 mx-auto">
            <Image
              src={preview}
              alt="Preview"
              fill
              style={{ objectFit: 'cover' }}
              className="rounded-lg"
            />
          </div>
        </div>
      )}

      {/* NFT Details */}
      <div className="space-y-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            NFT Name *
          </label>
          <input
            type="text"
            value={name}
            onChange={(e) => setName(e.target.value)}
            placeholder="Enter NFT name"
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>
        
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Description
          </label>
          <textarea
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            placeholder="Enter NFT description (optional)"
            rows={3}
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>
      </div>

      {/* Mint Button */}
      <Button 
        onClick={handleMint} 
        disabled={!file || !wallet || !name.trim() || minting}
        className="w-full py-3 text-lg"
      >
        {minting ? (uploading ? 'Uploading to IPFS...' : 'Minting NFT...') : 'Mint NFT'}
      </Button>

      {/* Progress Info */}
      {(imageIpfsUrl || metadataIpfsUrl || txHash) && (
        <div className="bg-gray-50 rounded-lg p-4 space-y-2">
          <h4 className="font-medium text-gray-800">Minting Progress:</h4>
          {imageIpfsUrl && (
            <div className="text-sm">
              <span className="text-green-600">✓</span> Image uploaded to IPFS: 
              <a href={imageIpfsUrl} target="_blank" rel="noopener noreferrer" className="text-blue-600 hover:underline ml-1 break-all">
                {imageIpfsUrl}
              </a>
            </div>
          )}
          {metadataIpfsUrl && (
            <div className="text-sm">
              <span className="text-green-600">✓</span> Metadata uploaded to IPFS:
              <a href={metadataIpfsUrl} target="_blank" rel="noopener noreferrer" className="text-blue-600 hover:underline ml-1 break-all">
                {metadataIpfsUrl}
              </a>
            </div>
          )}
          {txHash && (
            <div className="text-sm">
              <span className="text-green-600">✓</span> Transaction hash:
              <a href={`https://etherscan.io/tx/${txHash}`} target="_blank" rel="noopener noreferrer" className="text-blue-600 hover:underline ml-1 break-all">
                {txHash}
              </a>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
