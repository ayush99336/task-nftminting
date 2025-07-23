import { Button } from "@/components/ui/button";

interface WalletBarProps {
  wallet: string | null;
  onConnect: () => void;
  onDisconnect: () => void;
}

export default function WalletBar({ wallet, onConnect, onDisconnect }: WalletBarProps) {
  return (
    <div className="flex items-center gap-2">
      {wallet ? (
        <>
          <span className="text-green-600 font-medium">{wallet.slice(0, 6)}...{wallet.slice(-4)}</span>
          <Button variant="outline" onClick={onDisconnect}>Disconnect</Button>
        </>
      ) : (
        <Button onClick={onConnect}>Connect Wallet</Button>
      )}
    </div>
  );
}
