import { WalletType } from "@/backend.d";
import { TransactionType } from "@/backend.d";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Separator } from "@/components/ui/separator";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  type Currency,
  convertFromICP,
  formatAmount,
  useWallet,
} from "@/context/WalletContext";
import { cn } from "@/lib/utils";
import {
  ArrowDownLeft,
  ArrowUpRight,
  Check,
  Copy,
  Fingerprint,
  Link2,
  Loader2,
  Plus,
  Trash2,
  Wallet,
} from "lucide-react";
import { useState } from "react";
import { Layout } from "../components/Layout";

const WALLET_TYPE_META: Record<
  WalletType,
  { label: string; colorClass: string; bgClass: string; icon: React.ReactNode }
> = {
  [WalletType.internetIdentity]: {
    label: "Internet Identity",
    colorClass: "text-blue-700",
    bgClass: "bg-blue-100 border-blue-200",
    icon: <Fingerprint size={14} />,
  },
  [WalletType.plug]: {
    label: "Plug Wallet",
    colorClass: "text-emerald-700",
    bgClass: "bg-emerald-100 border-emerald-200",
    icon: <Link2 size={14} />,
  },
  [WalletType.stoic]: {
    label: "Stoic Wallet",
    colorClass: "text-purple-700",
    bgClass: "bg-purple-100 border-purple-200",
    icon: <Wallet size={14} />,
  },
};

const CURRENCIES: Currency[] = ["ICP", "USD", "EUR", "GBP"];

function CopyButton({ text }: { text: string }) {
  const [copied, setCopied] = useState(false);
  const handleCopy = () => {
    navigator.clipboard.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 1500);
  };
  return (
    <button
      type="button"
      onClick={handleCopy}
      className="ml-1 p-0.5 rounded hover:bg-muted transition-colors"
      aria-label="Copy address"
      data-ocid="wallet.copy_button"
    >
      {copied ? (
        <Check size={12} className="text-green-600" />
      ) : (
        <Copy size={12} className="text-muted-foreground" />
      )}
    </button>
  );
}

export function WalletPage() {
  const {
    wallets,
    transactions,
    activeCurrency,
    setActiveCurrency,
    addWallet,
    removeWallet,
    totalBalanceICP,
  } = useWallet();

  const [addOpen, setAddOpen] = useState(false);
  const [newWalletType, setNewWalletType] = useState<WalletType>(
    WalletType.internetIdentity,
  );
  const [newAddress, setNewAddress] = useState("");
  const [newLabel, setNewLabel] = useState("");
  const [isAdding, setIsAdding] = useState(false);

  const [unlinkTarget, setUnlinkTarget] = useState<string | null>(null);
  const [isRemoving, setIsRemoving] = useState(false);

  const handleAddWallet = async () => {
    if (!newAddress.trim() || !newLabel.trim()) return;
    setIsAdding(true);
    try {
      await addWallet(newWalletType, newAddress.trim(), newLabel.trim());
      setAddOpen(false);
      setNewAddress("");
      setNewLabel("");
      setNewWalletType(WalletType.internetIdentity);
    } finally {
      setIsAdding(false);
    }
  };

  const handleUnlink = async () => {
    if (!unlinkTarget) return;
    setIsRemoving(true);
    try {
      await removeWallet(unlinkTarget);
      setUnlinkTarget(null);
    } finally {
      setIsRemoving(false);
    }
  };

  const formatDate = (ts: bigint) => {
    return new Date(Number(ts)).toLocaleDateString("en-US", {
      month: "short",
      day: "numeric",
      year: "numeric",
    });
  };

  return (
    <Layout breadcrumb="Wallet">
      <div className="p-6 max-w-5xl mx-auto space-y-6">
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <h1 className="text-2xl font-display font-bold text-foreground">
              My Wallets
            </h1>
            <p className="text-sm text-muted-foreground mt-0.5">
              Manage your linked wallets and transaction history
            </p>
          </div>
          {/* Currency Switcher */}
          <div
            className="flex items-center gap-1 bg-secondary/60 rounded-lg p-1"
            data-ocid="wallet.currency_toggle"
          >
            {CURRENCIES.map((c) => (
              <button
                type="button"
                key={c}
                onClick={() => setActiveCurrency(c)}
                data-ocid={`wallet.currency.${c.toLowerCase()}.toggle`}
                className={cn(
                  "px-3 py-1.5 rounded-md text-xs font-semibold transition-all",
                  activeCurrency === c
                    ? "bg-primary text-primary-foreground shadow-sm"
                    : "text-muted-foreground hover:text-foreground",
                )}
              >
                {c}
              </button>
            ))}
          </div>
        </div>

        {/* Total Balance Banner */}
        <Card className="border-border bg-gradient-to-r from-primary/10 via-primary/5 to-transparent">
          <CardContent className="px-6 py-4 flex flex-wrap items-center gap-6">
            <div>
              <p className="text-xs font-medium text-muted-foreground uppercase tracking-widest">
                Total Balance
              </p>
              <p className="text-3xl font-display font-bold text-foreground mt-1">
                {formatAmount(
                  convertFromICP(totalBalanceICP, activeCurrency),
                  activeCurrency,
                )}
              </p>
            </div>
            <Separator
              orientation="vertical"
              className="h-10 hidden sm:block"
            />
            <div>
              <p className="text-xs text-muted-foreground">
                Across {wallets.length} wallet{wallets.length !== 1 ? "s" : ""}
              </p>
              <p className="text-sm font-medium text-foreground">
                {totalBalanceICP.toFixed(4)} ICP
              </p>
            </div>
          </CardContent>
        </Card>

        {/* Wallets List */}
        <Card className="border-border">
          <CardHeader className="pb-3 pt-4 px-5">
            <div className="flex items-center justify-between">
              <CardTitle className="text-sm font-semibold flex items-center gap-2">
                <Wallet size={15} className="text-primary" />
                Linked Wallets
              </CardTitle>
              <Dialog open={addOpen} onOpenChange={setAddOpen}>
                <DialogTrigger asChild>
                  <Button
                    size="sm"
                    className="gap-1.5 h-8 text-xs"
                    data-ocid="wallet.open_modal_button"
                  >
                    <Plus size={13} /> Link New Wallet
                  </Button>
                </DialogTrigger>
                <DialogContent
                  className="sm:max-w-md"
                  data-ocid="wallet.dialog"
                >
                  <DialogHeader>
                    <DialogTitle className="font-display">
                      Link a New Wallet
                    </DialogTitle>
                    <DialogDescription>
                      Connect an ICP-compatible wallet to your account.
                    </DialogDescription>
                  </DialogHeader>
                  <div className="space-y-5 py-2">
                    <div className="space-y-2">
                      <Label className="text-xs font-medium uppercase tracking-wide text-muted-foreground">
                        Wallet Type
                      </Label>
                      <RadioGroup
                        value={newWalletType}
                        onValueChange={(v) => setNewWalletType(v as WalletType)}
                        className="space-y-2"
                        data-ocid="wallet.wallet_type.radio"
                      >
                        {Object.entries(WALLET_TYPE_META).map(
                          ([type, meta]) => (
                            <div
                              key={type}
                              className={cn(
                                "flex items-center gap-3 p-3 rounded-lg border cursor-pointer transition-colors",
                                newWalletType === type
                                  ? "border-primary bg-primary/5"
                                  : "border-border hover:bg-muted/50",
                              )}
                            >
                              <RadioGroupItem
                                value={type}
                                id={`wallet-type-${type}`}
                              />
                              <label
                                htmlFor={`wallet-type-${type}`}
                                className="flex items-center gap-2 cursor-pointer flex-1"
                              >
                                <span
                                  className={cn(
                                    "flex-shrink-0",
                                    meta.colorClass,
                                  )}
                                >
                                  {meta.icon}
                                </span>
                                <span className="text-sm font-medium">
                                  {meta.label}
                                </span>
                              </label>
                            </div>
                          ),
                        )}
                      </RadioGroup>
                    </div>
                    <div className="space-y-1.5">
                      <Label
                        htmlFor="wallet-address"
                        className="text-xs font-medium uppercase tracking-wide text-muted-foreground"
                      >
                        Wallet Address
                      </Label>
                      <Input
                        id="wallet-address"
                        value={newAddress}
                        onChange={(e) => setNewAddress(e.target.value)}
                        placeholder="e.g. 2vxsx-fae..."
                        className="h-9 text-sm font-mono"
                        data-ocid="wallet.address.input"
                      />
                    </div>
                    <div className="space-y-1.5">
                      <Label
                        htmlFor="wallet-label"
                        className="text-xs font-medium uppercase tracking-wide text-muted-foreground"
                      >
                        Wallet Label
                      </Label>
                      <Input
                        id="wallet-label"
                        value={newLabel}
                        onChange={(e) => setNewLabel(e.target.value)}
                        placeholder="e.g. My Main Wallet"
                        className="h-9 text-sm"
                        data-ocid="wallet.label.input"
                      />
                    </div>
                  </div>
                  <DialogFooter>
                    <Button
                      variant="outline"
                      onClick={() => setAddOpen(false)}
                      data-ocid="wallet.cancel_button"
                    >
                      Cancel
                    </Button>
                    <Button
                      onClick={handleAddWallet}
                      disabled={
                        isAdding || !newAddress.trim() || !newLabel.trim()
                      }
                      data-ocid="wallet.submit_button"
                    >
                      {isAdding ? (
                        <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                      ) : null}
                      {isAdding ? "Linking..." : "Link Wallet"}
                    </Button>
                  </DialogFooter>
                </DialogContent>
              </Dialog>
            </div>
          </CardHeader>
          <CardContent className="px-5 pb-5">
            {wallets.length === 0 ? (
              <div className="py-12 text-center" data-ocid="wallet.empty_state">
                <Wallet
                  size={36}
                  className="mx-auto text-muted-foreground/30 mb-3"
                />
                <p className="text-sm font-medium text-muted-foreground">
                  No wallets linked yet
                </p>
                <p className="text-xs text-muted-foreground/60 mt-1">
                  Link a wallet to manage your ICP balance
                </p>
              </div>
            ) : (
              <div className="space-y-3">
                {wallets.map((wallet, idx) => {
                  const meta = WALLET_TYPE_META[wallet.walletType];
                  const displayBalance = convertFromICP(
                    wallet.balanceICP,
                    activeCurrency,
                  );
                  const ocidSuffix = idx + 1;
                  return (
                    <div
                      key={wallet.address}
                      className="flex flex-col sm:flex-row sm:items-center gap-3 p-4 rounded-lg border border-border bg-card hover:bg-muted/20 transition-colors"
                      data-ocid={`wallet.item.${ocidSuffix}`}
                    >
                      {/* Wallet Type Badge */}
                      <div
                        className={cn(
                          "inline-flex items-center gap-1.5 px-2.5 py-1.5 rounded-md border text-xs font-semibold flex-shrink-0",
                          meta.bgClass,
                          meta.colorClass,
                        )}
                      >
                        {meta.icon}
                        {meta.label}
                      </div>
                      {/* Info */}
                      <div className="flex-1 min-w-0">
                        <p className="text-sm font-semibold text-foreground">
                          {wallet.walletLabel}
                        </p>
                        <div className="flex items-center gap-1 mt-0.5">
                          <span className="text-xs font-mono text-muted-foreground truncate">
                            {wallet.address}
                          </span>
                          <CopyButton text={wallet.address} />
                        </div>
                      </div>
                      {/* Balance */}
                      <div className="text-right flex-shrink-0">
                        <p className="text-sm font-bold font-display text-foreground">
                          {formatAmount(displayBalance, activeCurrency)}
                        </p>
                        {activeCurrency !== "ICP" && (
                          <p className="text-[10px] text-muted-foreground">
                            {wallet.balanceICP.toFixed(4)} ICP
                          </p>
                        )}
                      </div>
                      {/* Unlink */}
                      <Dialog
                        open={unlinkTarget === wallet.address}
                        onOpenChange={(open) => !open && setUnlinkTarget(null)}
                      >
                        <DialogTrigger asChild>
                          <Button
                            variant="ghost"
                            size="icon"
                            className="h-8 w-8 flex-shrink-0 text-destructive/60 hover:text-destructive hover:bg-destructive/10"
                            onClick={() => setUnlinkTarget(wallet.address)}
                            data-ocid={`wallet.delete_button.${ocidSuffix}`}
                          >
                            <Trash2 size={14} />
                          </Button>
                        </DialogTrigger>
                        <DialogContent data-ocid="wallet.unlink.dialog">
                          <DialogHeader>
                            <DialogTitle className="font-display">
                              Unlink Wallet?
                            </DialogTitle>
                            <DialogDescription>
                              Are you sure you want to unlink{" "}
                              <strong>{wallet.walletLabel}</strong>? This cannot
                              be undone.
                            </DialogDescription>
                          </DialogHeader>
                          <DialogFooter>
                            <Button
                              variant="outline"
                              onClick={() => setUnlinkTarget(null)}
                              data-ocid="wallet.unlink.cancel_button"
                            >
                              Cancel
                            </Button>
                            <Button
                              variant="destructive"
                              onClick={handleUnlink}
                              disabled={isRemoving}
                              data-ocid="wallet.unlink.confirm_button"
                            >
                              {isRemoving ? (
                                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                              ) : null}
                              Unlink
                            </Button>
                          </DialogFooter>
                        </DialogContent>
                      </Dialog>
                    </div>
                  );
                })}
              </div>
            )}
          </CardContent>
        </Card>

        {/* Transaction History */}
        <Card className="border-border">
          <CardHeader className="pb-3 pt-4 px-5">
            <CardTitle className="text-sm font-semibold flex items-center gap-2">
              <ArrowDownLeft size={15} className="text-primary" />
              Transaction History
            </CardTitle>
          </CardHeader>
          <CardContent className="px-5 pb-5">
            {transactions.length === 0 ? (
              <div
                className="py-10 text-center"
                data-ocid="wallet.transactions.empty_state"
              >
                <ArrowUpRight
                  size={32}
                  className="mx-auto text-muted-foreground/30 mb-2"
                />
                <p className="text-sm text-muted-foreground">
                  No transactions yet
                </p>
              </div>
            ) : (
              <div className="overflow-x-auto">
                <Table data-ocid="wallet.transactions.table">
                  <TableHeader>
                    <TableRow className="border-border">
                      <TableHead className="text-xs font-semibold text-muted-foreground">
                        Date
                      </TableHead>
                      <TableHead className="text-xs font-semibold text-muted-foreground">
                        Wallet
                      </TableHead>
                      <TableHead className="text-xs font-semibold text-muted-foreground">
                        Type
                      </TableHead>
                      <TableHead className="text-xs font-semibold text-muted-foreground text-right">
                        Amount
                      </TableHead>
                      <TableHead className="text-xs font-semibold text-muted-foreground hidden md:table-cell">
                        Description
                      </TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {transactions.map((tx, idx) => {
                      const wallet = wallets.find(
                        (w) => w.address === tx.walletAddress,
                      );
                      const displayAmt = convertFromICP(
                        tx.amountICP,
                        activeCurrency,
                      );
                      const isSent = tx.txType === TransactionType.sent;
                      return (
                        <TableRow
                          key={String(tx.id)}
                          className="border-border"
                          data-ocid={`wallet.transactions.row.${idx + 1}`}
                        >
                          <TableCell className="text-xs text-muted-foreground whitespace-nowrap">
                            {formatDate(tx.timestamp)}
                          </TableCell>
                          <TableCell className="text-xs">
                            {wallet ? (
                              <span
                                className={cn(
                                  "inline-flex items-center gap-1 px-1.5 py-0.5 rounded text-[10px] font-semibold border",
                                  WALLET_TYPE_META[wallet.walletType].bgClass,
                                  WALLET_TYPE_META[wallet.walletType]
                                    .colorClass,
                                )}
                              >
                                {WALLET_TYPE_META[wallet.walletType].icon}
                                {wallet.walletLabel}
                              </span>
                            ) : (
                              <span className="font-mono text-muted-foreground">
                                {tx.walletAddress}
                              </span>
                            )}
                          </TableCell>
                          <TableCell>
                            <Badge
                              variant="outline"
                              className={cn(
                                "text-[10px] font-semibold border gap-1",
                                isSent
                                  ? "bg-amber-50 text-amber-700 border-amber-200"
                                  : "bg-green-50 text-green-700 border-green-200",
                              )}
                            >
                              {isSent ? (
                                <ArrowUpRight size={9} />
                              ) : (
                                <ArrowDownLeft size={9} />
                              )}
                              {isSent ? "Sent" : "Received"}
                            </Badge>
                          </TableCell>
                          <TableCell
                            className={cn(
                              "text-sm font-bold font-display text-right whitespace-nowrap",
                              isSent ? "text-amber-700" : "text-green-700",
                            )}
                          >
                            {isSent ? "-" : "+"}
                            {formatAmount(displayAmt, activeCurrency)}
                          </TableCell>
                          <TableCell className="text-xs text-muted-foreground hidden md:table-cell">
                            <span className="line-clamp-1">
                              {tx.description}
                            </span>
                          </TableCell>
                        </TableRow>
                      );
                    })}
                  </TableBody>
                </Table>
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </Layout>
  );
}
