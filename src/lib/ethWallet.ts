import { ethers } from 'ethers';
type EthereumProvider = {
  request: (args: { method: string; params?: unknown[] }) => Promise<unknown>;
};
declare global {
  interface Window {
    ethereum?: EthereumProvider;
  }
}

export async function connectWallet(): Promise<string | null> {
  if (!window.ethereum) {
    alert('MetaMask is not installed!');
    return null;
  }
  try {
    const accounts = (await window.ethereum.request({ method: 'eth_requestAccounts' })) as string[];
    return accounts[0] || null;
  } catch {
    alert('Wallet connection failed.');
    return null;
  }
}

export async function payETH(to: string, amountEth: string): Promise<string | null> {
  if (!window.ethereum) {
    alert('MetaMask is not installed!');
    return null;
  }
  try {
    const provider = new ethers.BrowserProvider(window.ethereum);
    const signer = await provider.getSigner();
    const tx = await signer.sendTransaction({
      to,
      value: ethers.parseEther(amountEth),
    });
    await tx.wait();
    return tx.hash;
  } catch {
    alert('Payment failed.');
    return null;
  }
}
