import type { Metadata } from 'next';
import { Inter } from 'next/font/google';
import './globals.css';
import { FhevmProvider } from '@fhevm/sdk/react';

const inter = Inter({ subsets: ['latin'] });

export const metadata: Metadata = {
  title: 'FHEVM Next.js Example - Anonymous Court',
  description: 'Privacy-preserving court investigation system using FHEVM SDK',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className={inter.className}>
        <FhevmProvider
          config={{
            network: {
              chainId: 11155111,
              name: 'Sepolia',
              rpcUrl: process.env.NEXT_PUBLIC_RPC_URL || 'https://sepolia.infura.io/v3/YOUR_KEY',
            },
          }}
        >
          {children}
        </FhevmProvider>
      </body>
    </html>
  );
}
