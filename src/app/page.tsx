"use client";

import { useState } from "react";
import Image from "next/image";
import { connectWallet } from "@/lib/ethWallet";
import WalletBar from "@/components/WalletBar";
import MintNFT from "@/components/MintNFT";
import ViewNFTs from "@/components/ViewNFTs";

export default function Home() {
  const [file, setFile] = useState<File>();
  const [url, setUrl] = useState("");
  const [uploading, setUploading] = useState(false);
  const [wallet, setWallet] = useState<string | null>(null);
  const [activeTab, setActiveTab] = useState<'upload' | 'mint' | 'view'>('upload');

  const uploadFile = async () => {
    try {
      if (!file) {
        alert("No file selected");
        return;
      }

      setUploading(true);
      const data = new FormData();
      data.set("file", file);
      const uploadRequest = await fetch("/api/files", {
        method: "POST",
        body: data,
      });
      const signedUrl = await uploadRequest.json();
      setUrl(signedUrl);
      setUploading(false);
    } catch (e) {
      console.log(e);
      setUploading(false);
      alert("Trouble uploading file");
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFile(e.target?.files?.[0]);
  };

  const handleConnect = async () => {
    const account = await connectWallet();
    setWallet(account);
  };

  const handleDisconnect = () => {
    setWallet(null);
  };

  return (
    <main className="min-h-screen bg-gradient-to-br from-blue-50 to-purple-50">
      <div className="container mx-auto px-4 py-8">
        {/* Header */}
        <div className="flex justify-between items-center mb-8">
          <div>
            <h1 className="text-4xl font-bold text-gray-800 mb-2">NFT Minting Platform</h1>
            <p className="text-gray-600">Upload to IPFS and mint NFTs on the blockchain</p>
          </div>
          <WalletBar
            wallet={wallet}
            onConnect={handleConnect}
            onDisconnect={handleDisconnect}
          />
        </div>

        {/* Tab Navigation */}
        <div className="max-w-4xl mx-auto mb-6">
          <div className="border-b border-gray-200">
            <nav className="-mb-px flex space-x-8">
              <button
                onClick={() => setActiveTab('upload')}
                className={`py-2 px-1 border-b-2 font-medium text-sm ${
                  activeTab === 'upload'
                    ? 'border-blue-500 text-blue-600'
                    : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                }`}
              >
                IPFS Upload Test
              </button>
              <button
                onClick={() => setActiveTab('mint')}
                className={`py-2 px-1 border-b-2 font-medium text-sm ${
                  activeTab === 'mint'
                    ? 'border-blue-500 text-blue-600'
                    : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                }`}
              >
                NFT Minting
              </button>
              <button
                onClick={() => setActiveTab('view')}
                className={`py-2 px-1 border-b-2 font-medium text-sm ${
                  activeTab === 'view'
                    ? 'border-blue-500 text-blue-600'
                    : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                }`}
              >
                View NFTs
              </button>
            </nav>
          </div>
        </div>

        {/* Tab Content */}
        <div className="max-w-4xl mx-auto">
          {activeTab === 'upload' && (
            <div className="bg-white rounded-lg shadow-lg p-6">
              <h2 className="text-2xl font-semibold mb-4 text-center">Test IPFS Upload</h2>
              <p className="text-gray-600 mb-6 text-center">
                Upload a file to test Pinata IPFS integration
              </p>
              
              <div className="flex flex-col items-center space-y-4">
                <input 
                  type="file" 
                  onChange={handleChange}
                  className="block w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-blue-50 file:text-blue-700 hover:file:bg-blue-100"
                />
                <button 
                  type="button" 
                  disabled={uploading || !file} 
                  onClick={uploadFile}
                  className="px-6 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 disabled:bg-gray-400 disabled:cursor-not-allowed"
                >
                  {uploading ? "Uploading..." : "Upload to IPFS"}
                </button>
                
                {url && (
                  <div className="mt-6 w-full max-w-md">
                    <p className="text-sm text-gray-600 mb-2">Uploaded successfully!</p>
                    <div className="bg-gray-50 p-3 rounded-lg break-all text-xs mb-4">
                      {url}
                    </div>
                    <Image 
                      src={url} 
                      alt="Uploaded to Pinata" 
                      width={400} 
                      height={300} 
                      className="rounded-lg shadow-md mx-auto"
                      style={{ objectFit: 'cover' }}
                    />
                  </div>
                )}
              </div>
            </div>
          )}

          {activeTab === 'mint' && (
            <div className="bg-white rounded-lg shadow-lg p-6">
              <h2 className="text-2xl font-semibold mb-4 text-center">Mint Your NFT</h2>
              <p className="text-gray-600 mb-6 text-center">
                Upload your artwork and mint it as an NFT on the Ethereum blockchain
              </p>
              <MintNFT wallet={wallet} />
            </div>
          )}

          {activeTab === 'view' && (
            <div className="bg-white rounded-lg shadow-lg p-6">
              <ViewNFTs />
            </div>
          )}
        </div>

        {/* Info Section */}
        <div className="max-w-4xl mx-auto mt-8 bg-white rounded-lg shadow-lg p-6">
          <h3 className="text-xl font-semibold mb-4">How it works</h3>
          <div className="grid md:grid-cols-3 gap-6">
            <div>
              <h4 className="font-medium text-blue-600 mb-2">IPFS Upload</h4>
              <div className="space-y-2 text-sm text-gray-600">
                <div className="flex items-start gap-2">
                  <span className="bg-blue-500 text-white rounded-full w-5 h-5 flex items-center justify-center text-xs font-semibold mt-0.5">1</span>
                  <span>Select any file to upload</span>
                </div>
                <div className="flex items-start gap-2">
                  <span className="bg-blue-500 text-white rounded-full w-5 h-5 flex items-center justify-center text-xs font-semibold mt-0.5">2</span>
                  <span>File gets uploaded to IPFS via Pinata</span>
                </div>
                <div className="flex items-start gap-2">
                  <span className="bg-blue-500 text-white rounded-full w-5 h-5 flex items-center justify-center text-xs font-semibold mt-0.5">3</span>
                  <span>Receive a permanent IPFS URL</span>
                </div>
              </div>
            </div>
            <div>
              <h4 className="font-medium text-purple-600 mb-2">NFT Minting</h4>
              <div className="space-y-2 text-sm text-gray-600">
                <div className="flex items-start gap-2">
                  <span className="bg-purple-500 text-white rounded-full w-5 h-5 flex items-center justify-center text-xs font-semibold mt-0.5">1</span>
                  <span>Connect your MetaMask wallet</span>
                </div>
                <div className="flex items-start gap-2">
                  <span className="bg-purple-500 text-white rounded-full w-5 h-5 flex items-center justify-center text-xs font-semibold mt-0.5">2</span>
                  <span>Upload image and add metadata</span>
                </div>
                <div className="flex items-start gap-2">
                  <span className="bg-purple-500 text-white rounded-full w-5 h-5 flex items-center justify-center text-xs font-semibold mt-0.5">3</span>
                  <span>NFT gets minted to your address</span>
                </div>
              </div>
            </div>
            <div>
              <h4 className="font-medium text-green-600 mb-2">View Collection</h4>
              <div className="space-y-2 text-sm text-gray-600">
                <div className="flex items-start gap-2">
                  <span className="bg-green-500 text-white rounded-full w-5 h-5 flex items-center justify-center text-xs font-semibold mt-0.5">1</span>
                  <span>Browse your minted NFTs</span>
                </div>
                <div className="flex items-start gap-2">
                  <span className="bg-green-500 text-white rounded-full w-5 h-5 flex items-center justify-center text-xs font-semibold mt-0.5">2</span>
                  <span>View all NFTs in the collection</span>
                </div>
                <div className="flex items-start gap-2">
                  <span className="bg-green-500 text-white rounded-full w-5 h-5 flex items-center justify-center text-xs font-semibold mt-0.5">3</span>
                  <span>Access on Etherscan & OpenSea</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </main>
  );
}
