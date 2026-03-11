import type { backendInterface } from "@/backend";
import { TransactionType, WalletType } from "@/backend";
import type { Transaction, Wallet } from "@/backend";
import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useRef,
  useState,
} from "react";

export type Currency = "ICP" | "USD" | "EUR" | "GBP";

const EXCHANGE_RATES: Record<Exclude<Currency, "ICP">, number> = {
  USD: 12.5,
  EUR: 11.4,
  GBP: 9.8,
};

export function convertFromICP(amountICP: number, currency: Currency): number {
  if (currency === "ICP") return amountICP;
  return amountICP * EXCHANGE_RATES[currency];
}

export function formatAmount(amount: number, currency: Currency): string {
  if (currency === "ICP") {
    return `${amount.toFixed(4)} ICP`;
  }
  const symbols: Record<Exclude<Currency, "ICP">, string> = {
    USD: "$",
    EUR: "€",
    GBP: "£",
  };
  return `${symbols[currency]}${amount.toFixed(2)}`;
}

const MOCK_WALLETS: Wallet[] = [
  {
    linkedAt: BigInt(Date.now() - 86400000 * 30),
    walletType: WalletType.internetIdentity,
    address: "2vxsx-fae...8d2n",
    balanceICP: 45.2,
    walletLabel: "Primary Identity",
  },
  {
    linkedAt: BigInt(Date.now() - 86400000 * 14),
    walletType: WalletType.plug,
    address: "rrkah-fqb...7m9c",
    balanceICP: 12.8,
    walletLabel: "Plug Wallet",
  },
  {
    linkedAt: BigInt(Date.now() - 86400000 * 7),
    walletType: WalletType.stoic,
    address: "w3gef-eqb...4k2p",
    balanceICP: 8.5,
    walletLabel: "Stoic Savings",
  },
];

const MOCK_TRANSACTIONS: Transaction[] = [
  {
    id: BigInt(1),
    description: "Campaign donation – Global Climate Action",
    walletAddress: "2vxsx-fae...8d2n",
    timestamp: BigInt(Date.now() - 86400000 * 2),
    txType: TransactionType.sent,
    amountICP: 5.0,
  },
  {
    id: BigInt(2),
    description: "Membership fee refund",
    walletAddress: "rrkah-fqb...7m9c",
    timestamp: BigInt(Date.now() - 86400000 * 5),
    txType: TransactionType.received,
    amountICP: 2.5,
  },
  {
    id: BigInt(3),
    description: "Forum contributor reward",
    walletAddress: "2vxsx-fae...8d2n",
    timestamp: BigInt(Date.now() - 86400000 * 8),
    txType: TransactionType.received,
    amountICP: 1.2,
  },
  {
    id: BigInt(4),
    description: "Store purchase – Advocacy Toolkit",
    walletAddress: "w3gef-eqb...4k2p",
    timestamp: BigInt(Date.now() - 86400000 * 12),
    txType: TransactionType.sent,
    amountICP: 3.8,
  },
  {
    id: BigInt(5),
    description: "Organization grant received",
    walletAddress: "rrkah-fqb...7m9c",
    timestamp: BigInt(Date.now() - 86400000 * 18),
    txType: TransactionType.received,
    amountICP: 10.0,
  },
  {
    id: BigInt(6),
    description: "Resource library subscription",
    walletAddress: "2vxsx-fae...8d2n",
    timestamp: BigInt(Date.now() - 86400000 * 25),
    txType: TransactionType.sent,
    amountICP: 0.75,
  },
];

interface WalletContextType {
  wallets: Wallet[];
  transactions: Transaction[];
  activeCurrency: Currency;
  isLoading: boolean;
  setActiveCurrency: (c: Currency) => void;
  addWallet: (
    walletType: WalletType,
    address: string,
    walletLabel: string,
  ) => Promise<void>;
  removeWallet: (address: string) => Promise<void>;
  refreshWallets: () => Promise<void>;
  totalBalanceICP: number;
  /** Called by WalletSync to inject the backend actor */
  _setActor: (actor: backendInterface | null) => void;
}

const WalletContext = createContext<WalletContextType | null>(null);

export function WalletProvider({ children }: { children: React.ReactNode }) {
  const [wallets, setWallets] = useState<Wallet[]>(MOCK_WALLETS);
  const [transactions, setTransactions] =
    useState<Transaction[]>(MOCK_TRANSACTIONS);
  const [activeCurrency, setActiveCurrency] = useState<Currency>("ICP");
  const [isLoading, setIsLoading] = useState(false);
  const actorRef = useRef<backendInterface | null>(null);

  const _setActor = useCallback((actor: backendInterface | null) => {
    actorRef.current = actor;
  }, []);

  const refreshWallets = useCallback(async () => {
    const actor = actorRef.current;
    if (!actor) return;
    setIsLoading(true);
    try {
      const [fetchedWallets, fetchedTxns] = await Promise.all([
        actor.getLinkedWallets(),
        actor.getTransactionHistory(null),
      ]);
      if (fetchedWallets.length > 0) setWallets(fetchedWallets);
      if (fetchedTxns.length > 0) setTransactions(fetchedTxns);
    } catch {
      // fall back to mock data
    } finally {
      setIsLoading(false);
    }
  }, []);

  const addWallet = useCallback(
    async (walletType: WalletType, address: string, walletLabel: string) => {
      const actor = actorRef.current;
      if (actor) {
        try {
          await actor.linkWallet(walletType, address, walletLabel);
          await refreshWallets();
          return;
        } catch {
          // fall through to optimistic
        }
      }
      const newWallet: Wallet = {
        linkedAt: BigInt(Date.now()),
        walletType,
        address,
        balanceICP: 0,
        walletLabel,
      };
      setWallets((prev) => [...prev, newWallet]);
    },
    [refreshWallets],
  );

  const removeWallet = useCallback(
    async (address: string) => {
      const actor = actorRef.current;
      if (actor) {
        try {
          await actor.unlinkWallet(address);
          await refreshWallets();
          return;
        } catch {
          // fall through to optimistic
        }
      }
      setWallets((prev) => prev.filter((w) => w.address !== address));
    },
    [refreshWallets],
  );

  const totalBalanceICP = wallets.reduce((sum, w) => sum + w.balanceICP, 0);

  return (
    <WalletContext.Provider
      value={{
        wallets,
        transactions,
        activeCurrency,
        isLoading,
        setActiveCurrency,
        addWallet,
        removeWallet,
        refreshWallets,
        totalBalanceICP,
        _setActor,
      }}
    >
      {children}
    </WalletContext.Provider>
  );
}

export function useWallet() {
  const ctx = useContext(WalletContext);
  if (!ctx) throw new Error("useWallet must be used within WalletProvider");
  return ctx;
}
