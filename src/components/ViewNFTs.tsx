'use client';

import { useState, useEffect } from 'react';
import { Button } from './ui/button';
import { Card, CardHeader, CardContent, CardTitle } from './ui/card';
import Image from 'next/image';
import { getAllNFTs, NFTData } from '@/lib/nftUtils';

export default function ViewNFTs() {
  const [nfts, setNfts] = useState<NFTData[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    loadNFTs();
  }, []);

  async function loadNFTs() {
    setLoading(true);
    setError(null);
    try {
      const fetchedNFTs = await getAllNFTs();
      setNfts(fetchedNFTs);
    } catch (error) {
      setError(error instanceof Error ? error.message : 'Failed to load NFTs');
    } finally {
      setLoading(false);
    }
  }

  function formatAddress(address: string) {
    return `${address.slice(0, 6)}...${address.slice(-4)}`;
  }

  function openInEtherscan(tokenId: string) {
    const url = `https://sepolia.etherscan.io/token/${
      process.env.NEXT_PUBLIC_CONTRACT_ADDRESS || '0x522b5aAdE25E0f5795AB91A9447564b3978b9335'
    }?a=${tokenId}`;
    window.open(url, '_blank');
  }

  function openInOpenSea(tokenId: string) {
    const contractAddress =
      process.env.NEXT_PUBLIC_CONTRACT_ADDRESS || '0x522b5aAdE25E0f5795AB91A9447564b3978b9335';
    const url = `https://testnets.opensea.io/assets/sepolia/${contractAddress}/${tokenId}`;
    window.open(url, '_blank');
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h2 className="text-2xl font-semibold">NFT Collection</h2>
          <p className="text-gray-600">All NFTs in the collection</p>
        </div>
        <div className="flex gap-2">
          <Button onClick={loadNFTs} disabled={loading}>
            {loading ? 'Loading...' : 'Refresh'}
          </Button>
        </div>
      </div>

      {/* Error Message */}
      {error && (
        <div className="bg-red-50 border border-red-200 rounded-lg p-4">
          <p className="text-red-700">{error}</p>
        </div>
      )}

      {/* Loading Spinner */}
      {loading && (
        <div className="flex justify-center items-center py-8">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
          <span className="ml-2">Loading NFTs...</span>
        </div>
      )}

      {/* Empty State */}
      {!loading && nfts.length === 0 && !error && (
        <div className="text-center py-8">
          <div className="text-gray-400 text-6xl mb-4">🖼️</div>
          <h3 className="text-lg font-medium text-gray-900 mb-2">No NFTs in collection</h3>
          <p className="text-gray-600">No NFTs have been minted in this collection yet.</p>
        </div>
      )}

      {/* NFTs Grid */}
      {!loading && nfts.length > 0 && (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
          {nfts.map((nft) => (
            <Card key={nft.tokenId} className="overflow-hidden hover:shadow-lg transition-shadow">
              <CardHeader className="p-4">
                <CardTitle className="text-lg">
                  {nft.metadata?.name || `NFT #${nft.tokenId}`}
                </CardTitle>
                <p className="text-sm text-gray-600">Token ID: #{nft.tokenId}</p>
              </CardHeader>
              <CardContent className="p-4 pt-0">
                {nft.metadata?.image && (
                  <div className="relative w-full h-48 mb-4 rounded-lg overflow-hidden bg-gray-100">
                    <Image
                      src={nft.metadata.image}
                      alt={nft.metadata.name || `NFT #${nft.tokenId}`}
                      fill
                      style={{ objectFit: 'cover' }}
                      className="hover:scale-105 transition-transform duration-200"
                    />
                  </div>
                )}
                {nft.metadata?.description && (
                  <p className="text-sm text-gray-600 mb-4 line-clamp-3">
                    {nft.metadata.description}
                  </p>
                )}
                <div className="text-xs text-gray-500 mb-4">
                  <span className="font-medium">Owner:</span>{' '}
                  <span className="font-mono">{formatAddress(nft.owner)}</span>
                </div>
                <div className="flex gap-2">
                  <Button
                    size="sm"
                    variant="outline"
                    onClick={() => openInEtherscan(nft.tokenId)}
                    className="flex-1 text-xs"
                  >
                    Etherscan
                  </Button>
                  <Button
                    size="sm"
                    variant="outline"
                    onClick={() => openInOpenSea(nft.tokenId)}
                    className="flex-1 text-xs"
                  >
                    OpenSea
                  </Button>
                </div>
                <div className="mt-2">
                  <a
                    href={nft.tokenURI}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-xs text-blue-600 hover:underline"
                  >
                    View Metadata →
                  </a>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
}
