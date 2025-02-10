"use client";
import Image from "next/image";
import { ModeToggle } from "./Modetoggle";
import { useAccount } from "wagmi";
import { Button } from "./ui/button";
import { useWeb3Modal } from "@web3modal/wagmi/react";
import { truncateAddress } from "@/lib/utils";

export default function Nav() {
  const { isConnected, address } = useAccount();
  const { open } = useWeb3Modal();

  const handleConnect = () => {
    open();
  };

  return (
    <header className="">
      <nav>
        <ul className="flex items-center justify-between">
          <li>
            <Image
              src="/morphLogo.png"
              alt="Morph Logo"
              className="dark:invert"
              width={100}
              height={24}
              priority
            />
          </li>

          <li>
            <div className="flex items-center gap-3">
              {!isConnected ? (
                <Button onClick={handleConnect}>Connect Wallet</Button>
              ) : (
                <p>{truncateAddress(address)}</p>
              )}
              <ModeToggle />
            </div>
          </li>
        </ul>
      </nav>
    </header>
  );
}
