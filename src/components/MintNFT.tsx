import { useState } from 'react';
import { Button } from './ui/button';
import { ethers } from 'ethers';

const CONTRACT_ADDRESS = '0x522b5aAdE25E0f5795AB91A9447564b3978b9335';
const CONTRACT_ABI = [
  "function safeMint(address to, string memory uri) public",
];

export default function MintNFT({ wallet }: { wallet: string | null }) {
  const [file, setFile] = useState<File | null>(null);
  const [minting, setMinting] = useState(false);
  const [ipfsUrl, setIpfsUrl] = useState<string | null>(null);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setFile(e.target.files[0]);
    }
  };

  const uploadToIPFS = async () => {
    if (!file) return null;
    const formData = new FormData();
    formData.append('file', file);
    const res = await fetch('/api/pinata-upload', {
      method: 'POST',
      body: formData,
    });
    const data = await res.json();
    return data.ipfsUrl;
  };

  const handleMint = async () => {
    if (!wallet || !file) return;
    setMinting(true);
    try {
      const ipfsUrl = await uploadToIPFS();
      setIpfsUrl(ipfsUrl);
      if (!ipfsUrl) throw new Error('IPFS upload failed');
      // @ts-ignore
      const provider = new ethers.BrowserProvider(window.ethereum);
      const signer = await provider.getSigner();
      const contract = new ethers.Contract(CONTRACT_ADDRESS, CONTRACT_ABI, signer);
      const tx = await contract.safeMint(wallet, ipfsUrl);
      await tx.wait();
      alert('NFT minted!');
    } catch (e) {
      alert('Mint failed');
    }
    setMinting(false);
  };

  return (
    <div className="border p-4 rounded mb-4">
      <h2 className="font-bold mb-2">Mint NFT</h2>
      <input type="file" accept="image/*" onChange={handleFileChange} />
      <Button onClick={handleMint} disabled={!file || !wallet || minting} className="ml-2">
        {minting ? 'Minting...' : 'Mint NFT'}
      </Button>
      {ipfsUrl && (
        <div className="mt-2 text-xs break-all">IPFS: {ipfsUrl}</div>
      )}
    </div>
  );
}
