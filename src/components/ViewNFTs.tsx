import { useState, useEffect } from 'react';
import { Button } from './ui/button';
import { Card, CardHeader, CardContent, CardTitle } from './ui/card';
import Image from 'next/image';
import { getUserNFTs, getAllNFTs, NFTData } from '@/lib/nftUtils';

interface ViewNFTsProps {
  wallet: string | null;
}

export default function ViewNFTs({ wallet }: ViewNFTsProps) {
  const [nfts, setNfts] = useState<NFTData[]>([]);
  const [loading, setLoading] = useState(false);
  const [viewMode, setViewMode] = useState<'my' | 'all'>('my');
  const [error, setError] = useState<string | null>(null);

  const loadNFTs = async () => {
    if (!wallet) {
      setError('Please connect your wallet first');
      return;
    }

    setLoading(true);
    setError(null);

    try {
      let fetchedNFTs: NFTData[];
      if (viewMode === 'my') {
        fetchedNFTs = await getUserNFTs(wallet);
      } else {
        fetchedNFTs = await getAllNFTs();
      }
      setNfts(fetchedNFTs);
    } catch (error) {
      console.error('Error loading NFTs:', error);
      setError(error instanceof Error ? error.message : 'Failed to load NFTs');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (wallet) {
      loadNFTs();
    }
  }, [wallet, viewMode]);

  const formatAddress = (address: string) => {
    return `${address.slice(0, 6)}...${address.slice(-4)}`;
  };

  const openInEtherscan = (tokenId: string) => {
    const url = `https://sepolia.etherscan.io/token/${process.env.NEXT_PUBLIC_CONTRACT_ADDRESS || '0x522b5aAdE25E0f5795AB91A9447564b3978b9335'}?a=${tokenId}`;
    window.open(url, '_blank');
  };

  const openInOpenSea = (tokenId: string) => {
    const contractAddress = process.env.NEXT_PUBLIC_CONTRACT_ADDRESS || '0x522b5aAdE25E0f5795AB91A9447564b3978b9335';
    const url = `https://testnets.opensea.io/assets/sepolia/${contractAddress}/${tokenId}`;
    window.open(url, '_blank');
  };

  return (
    <div className="space-y-6">
      {/* Header and Controls */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h2 className="text-2xl font-semibold">NFT Collection</h2>
          <p className="text-gray-600">
            {viewMode === 'my' ? 'Your minted NFTs' : 'All NFTs in the collection'}
          </p>
        </div>
        
        <div className="flex gap-2">
          <Button
            variant={viewMode === 'my' ? 'default' : 'outline'}
            onClick={() => setViewMode('my')}
            disabled={!wallet}
          >
            My NFTs
          </Button>
          <Button
            variant={viewMode === 'all' ? 'default' : 'outline'}
            onClick={() => setViewMode('all')}
            disabled={!wallet}
          >
            All NFTs
          </Button>
          <Button
            onClick={loadNFTs}
            disabled={loading || !wallet}
          >
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

      {/* Loading State */}
      {loading && (
        <div className="flex justify-center items-center py-8">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
          <span className="ml-2">Loading NFTs...</span>
        </div>
      )}

      {/* Empty State */}
      {!loading && nfts.length === 0 && !error && wallet && (
        <div className="text-center py-8">
          <div className="text-gray-400 text-6xl mb-4">🖼️</div>
          <h3 className="text-lg font-medium text-gray-900 mb-2">
            {viewMode === 'my' ? 'No NFTs found' : 'No NFTs in collection'}
          </h3>
          <p className="text-gray-600">
            {viewMode === 'my' 
              ? 'You haven\'t minted any NFTs yet. Try minting one in the NFT Minting tab!'
              : 'No NFTs have been minted in this collection yet.'
            }
          </p>
        </div>
      )}

      {/* Wallet Connection Required */}
      {!wallet && (
        <div className="text-center py-8">
          <div className="text-gray-400 text-6xl mb-4">🔗</div>
          <h3 className="text-lg font-medium text-gray-900 mb-2">Connect Your Wallet</h3>
          <p className="text-gray-600">Please connect your MetaMask wallet to view NFTs</p>
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
                {/* Image */}
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
                
                {/* Description */}
                {nft.metadata?.description && (
                  <p className="text-sm text-gray-600 mb-4 line-clamp-3">
                    {nft.metadata.description}
                  </p>
                )}
                
                {/* Owner */}
                <div className="text-xs text-gray-500 mb-4">
                  <span className="font-medium">Owner:</span>{' '}
                  <span className="font-mono">{formatAddress(nft.owner)}</span>
                  {wallet && nft.owner.toLowerCase() === wallet.toLowerCase() && (
                    <span className="ml-2 bg-green-100 text-green-800 px-2 py-1 rounded-full text-xs">
                      You
                    </span>
                  )}
                </div>
                
                {/* Action Buttons */}
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
                
                {/* Metadata Link */}
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
