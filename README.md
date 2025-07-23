# NFT Minting Platform

A decentralized NFT minting platform built with Next.js, Ethereum, and IPFS integration via Pinata V3 API.

## ✨ Features

- 🎨 **NFT Minting**: Upload images and mint them as NFTs on Ethereum
- 📁 **IPFS Storage**: Decentralized storage using Pinata V3 API
- 🔗 **MetaMask Integration**: Connect and interact with Ethereum wallets
- 📱 **Responsive Design**: Modern UI with Tailwind CSS
- 🔒 **Metadata Standards**: ERC-721 compatible NFT metadata
- 🧪 **IPFS Upload Testing**: Standalone upload functionality for testing

## 🚀 Live Demo

The application provides two main interfaces:
1. **IPFS Upload Test**: Simple file upload to test Pinata integration
2. **NFT Minting**: Full NFT creation with metadata and blockchain integration

## 📋 Smart Contract

- **Contract Address**: `0x522b5aAdE25E0f5795AB91A9447564b3978b9335`
- **Network**: Ethereum (or testnet where deployed)

## 🛠️ Setup Instructions

### 1. Clone and Install Dependencies

```bash
git clone <your-repo-url>
cd task-nftminting
npm install
```

### 2. Environment Configuration

Your `.env` file should contain:

```env
PINATA_JWT=your_pinata_jwt_token_here
NEXT_PUBLIC_GATEWAY_URL=gateway.pinata.cloud
```

### 3. Getting Pinata Credentials

1. Sign up at [Pinata.cloud](https://pinata.cloud)
2. Go to API Keys section
3. Create a new API key with upload permissions
4. Copy the JWT token to your `.env` file
5. Use `gateway.pinata.cloud` as your gateway URL

### 4. MetaMask Setup

1. Install [MetaMask](https://metamask.io/) browser extension
2. Create or import a wallet
3. Ensure you have some ETH for gas fees
4. Connect to the appropriate network where your NFT contract is deployed

### 5. Run the Application

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) to see the application.

## 🔄 How It Works

### IPFS Upload Test
1. **Select File**: Choose any file to upload
2. **Upload to IPFS**: File gets stored on IPFS via Pinata V3 API
3. **Get URL**: Receive a permanent IPFS gateway URL

### NFT Minting Process
1. **Connect Wallet**: Users connect their MetaMask wallet
2. **Upload Image**: Select and upload an image file
3. **Add Metadata**: Enter NFT name and description
4. **IPFS Upload**: Image and metadata are uploaded to IPFS via Pinata
5. **Mint NFT**: Smart contract mints the NFT with IPFS metadata URI

## 📁 Project Structure

```
src/
├── app/
│   ├── api/
│   │   └── files/route.ts      # Pinata V3 upload API
│   ├── layout.tsx              
│   └── page.tsx                # Tabbed interface (Upload + Minting)
├── components/
│   ├── MintNFT.tsx            # NFT minting component
│   ├── WalletBar.tsx          # Wallet connection UI
│   └── ui/                    # UI components
├── lib/
│   ├── contract.ts            # Smart contract configuration
│   └── ethWallet.ts           # Ethereum wallet utilities
utils/
└── config.ts                  # Pinata SDK V3 instance
```

## 🔧 Technology Stack

- **Frontend**: Next.js 15, React 19, TypeScript
- **Styling**: Tailwind CSS
- **Blockchain**: Ethers.js for Ethereum interaction
- **Storage**: Pinata V3 API for IPFS
- **Wallet**: MetaMask integration

## 📋 API Updates

This project uses **Pinata SDK V3** with the latest API changes:

```typescript
// V3 API Usage
const upload = await pinata.upload.public.file(file);
const url = `https://gateway.pinata.cloud/ipfs/${upload.cid}`;
```

Key changes from V2:
- Methods now require `.public` or `.private` specification
- Simplified metadata handling
- Direct CID access from upload response

## 🎯 Smart Contract ABI

The application uses a simplified ERC-721 contract with the following method:

```solidity
function safeMint(address to, string memory uri) public
```

## 🌐 Environment Variables

Required environment variables:

- `PINATA_JWT`: Your Pinata API JWT token
- `NEXT_PUBLIC_GATEWAY_URL`: Your Pinata gateway URL (usually `gateway.pinata.cloud`)

## 🧪 Testing

1. **Test IPFS Upload**: Use the "IPFS Upload Test" tab to verify Pinata integration
2. **Test NFT Minting**: Use the "NFT Minting" tab to test full blockchain integration

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Test thoroughly
5. Submit a pull request

## 📄 License

This project is open source and available under the [MIT License](LICENSE).

## 💬 Support

For questions or support, please open an issue in the repository.

## Deploy on Vercel

The easiest way to deploy your Next.js app is to use the [Vercel Platform](https://vercel.com/new?utm_medium=default-template&filter=next.js&utm_source=create-next-app&utm_campaign=create-next-app-readme) from the creators of Next.js.

Check out our [Next.js deployment documentation](https://nextjs.org/docs/app/building-your-application/deploying) for more details.
