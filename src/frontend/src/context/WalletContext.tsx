import type { backendInterface } from "@/backend";
import type { TransactionType, WalletType } from "@/backend";
import type { Transaction, Wallet } from "@/backend";
import {
  createContext,
  useCallback,
  useContext,
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
  addTransaction: (
    walletAddress: string,
    amountICP: number,
    description: string,
    txType: TransactionType,
  ) => Promise<void>;
  refreshWallets: () => Promise<void>;
  totalBalanceICP: number;
  _setActor: (actor: backendInterface | null) => void;
}

const WalletContext = createContext<WalletContextType | null>(null);

export function WalletProvider({ children }: { children: React.ReactNode }) {
  const [wallets, setWallets] = useState<Wallet[]>([]);
  const [transactions, setTransactions] = useState<Transaction[]>([]);
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
      setWallets(fetchedWallets);
      setTransactions(fetchedTxns);
    } catch {
      // keep current state on error
    } finally {
      setIsLoading(false);
    }
  }, []);

  const addWallet = useCallback(
    async (walletType: WalletType, address: string, walletLabel: string) => {
      const actor = actorRef.current;
      if (actor) {
        await actor.linkWallet(walletType, address, walletLabel);
        await refreshWallets();
        return;
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
        await actor.unlinkWallet(address);
        await refreshWallets();
        return;
      }
      setWallets((prev) => prev.filter((w) => w.address !== address));
    },
    [refreshWallets],
  );

  const addTransaction = useCallback(
    async (
      walletAddress: string,
      amountICP: number,
      description: string,
      txType: TransactionType,
    ) => {
      const actor = actorRef.current;
      if (actor) {
        try {
          await actor.addTransaction(
            walletAddress,
            amountICP,
            description,
            txType,
          );
          await refreshWallets();
          return;
        } catch {
          // fall through to optimistic
        }
      }
      const optimistic: Transaction = {
        id: BigInt(Date.now()),
        walletAddress,
        amountICP,
        description,
        txType,
        timestamp: BigInt(Date.now()),
      };
      setTransactions((prev) => [optimistic, ...prev]);
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
        addTransaction,
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
