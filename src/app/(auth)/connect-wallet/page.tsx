import { WalletConnect } from "@/components/web3/WalletConnect";
import { FloatingElements } from "@/components/ui/floating-elements";

export default function ConnectWalletPage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-primary/10 to-secondary/10 relative overflow-hidden">
      {/* Background Elements */}
      <div className="absolute inset-0 bg-gradient-hero opacity-10" />
      <FloatingElements count={15} variant="geometric" animated />
      
      {/* Main Content */}
      <div className="relative z-10">
        <WalletConnect />
      </div>
    </div>
  );
}