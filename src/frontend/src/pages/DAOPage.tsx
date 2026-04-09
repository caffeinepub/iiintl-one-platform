import type {
  DAOTokenRecord,
  DAOTokenTransaction,
  DAOTokenTxType,
} from "@/backend";
import { DAOTokenTxType as TxType } from "@/backend";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Skeleton } from "@/components/ui/skeleton";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useBackend } from "@/hooks/useBackend";
import { cn } from "@/lib/utils";
import { Principal } from "@icp-sdk/core/principal";
import { Link } from "@tanstack/react-router";
import {
  ArrowRightLeft,
  Award,
  Coins,
  ExternalLink,
  Flame,
  Loader2,
  Medal,
  Sparkles,
  Trophy,
  Users,
  Zap,
} from "lucide-react";
import { useCallback, useEffect, useState } from "react";
import { toast } from "sonner";
import { Layout } from "../components/Layout";

// ── Helpers ────────────────────────────────────────────────────────────────

function maskPrincipal(p: Principal | string): string {
  const s = typeof p === "string" ? p : p.toText();
  if (s.length <= 14) return s;
  return `${s.slice(0, 6)}…${s.slice(-6)}`;
}

function formatTokens(n: bigint): string {
  const num = Number(n);
  if (num >= 1_000_000) return `${(num / 1_000_000).toFixed(2)}M`;
  if (num >= 1_000) return `${(num / 1_000).toFixed(1)}K`;
  return num.toLocaleString();
}

function formatDate(ts: bigint): string {
  return new Date(Number(ts) / 1_000_000).toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
  });
}

const TX_META: Record<
  DAOTokenTxType,
  { label: string; colorClass: string; bgClass: string; borderClass: string }
> = {
  [TxType.airdrop]: {
    label: "Airdrop",
    colorClass: "text-amber-400",
    bgClass: "bg-amber-500/15",
    borderClass: "border-amber-500/30",
  },
  [TxType.earned]: {
    label: "Earned",
    colorClass: "text-emerald-400",
    bgClass: "bg-emerald-500/15",
    borderClass: "border-emerald-500/30",
  },
  [TxType.transferred]: {
    label: "Transfer",
    colorClass: "text-blue-400",
    bgClass: "bg-blue-500/15",
    borderClass: "border-blue-500/30",
  },
  [TxType.burned]: {
    label: "Burned",
    colorClass: "text-red-400",
    bgClass: "bg-red-500/15",
    borderClass: "border-red-500/30",
  },
  [TxType.votingReward]: {
    label: "Vote Reward",
    colorClass: "text-purple-400",
    bgClass: "bg-purple-500/15",
    borderClass: "border-purple-500/30",
  },
};

const TIER_AIRDROP: { tier: string; label: string; amount: number }[] = [
  { tier: "Ambassador", label: "Ambassador", amount: 10_000 },
  { tier: "Executive", label: "Executive", amount: 5_000 },
  { tier: "Partner", label: "Partner", amount: 2_500 },
  { tier: "Founder", label: "Founder", amount: 1_500 },
  { tier: "Associate", label: "Associate", amount: 750 },
  { tier: "Affiliate", label: "Affiliate", amount: 250 },
  { tier: "Free", label: "Free", amount: 50 },
];

const EARN_OPPORTUNITIES = [
  {
    icon: <Zap size={18} />,
    title: "Vote on Proposals",
    desc: "Earn 50 IIINTL for each proposal you vote on",
    reward: "50 IIINTL / vote",
    action: "claim",
  },
  {
    icon: <Users size={18} />,
    title: "Refer New Members",
    desc: "MLM commission chain earns you tokens automatically",
    reward: "Variable via MLM",
    action: "mlm",
  },
  {
    icon: <Sparkles size={18} />,
    title: "DAO Airdrop",
    desc: "Tier-based airdrop distributed to all eligible members",
    reward: "See tier table",
    action: null,
  },
  {
    icon: <Award size={18} />,
    title: "Platform Activity",
    desc: "Bonuses for campaigns, crowdfunding, and activism",
    reward: "Automatic",
    action: null,
  },
];

// ── Sub-components ──────────────────────────────────────────────────────────

function StatBadge({ label, value }: { label: string; value: string }) {
  return (
    <div className="flex flex-col gap-0.5">
      <p className="text-[11px] uppercase tracking-widest font-semibold text-muted-foreground">
        {label}
      </p>
      <p className="text-lg font-display font-bold text-foreground">{value}</p>
    </div>
  );
}

function TxTypeBadge({ type }: { type: DAOTokenTxType }) {
  const m = TX_META[type] ?? TX_META[TxType.earned];
  return (
    <span
      className={cn(
        "inline-flex items-center px-2 py-0.5 rounded text-[10px] font-semibold border",
        m.bgClass,
        m.colorClass,
        m.borderClass,
      )}
    >
      {m.label}
    </span>
  );
}

function BalanceHero({
  record,
  rank,
}: { record: DAOTokenRecord | null; rank: number | null }) {
  return (
    <div
      className="relative overflow-hidden rounded-xl border border-border bg-card p-6 token-accent shadow-sm"
      style={{
        background:
          "linear-gradient(135deg, oklch(0.72 0.12 85 / 0.12), oklch(0.7 0.12 90 / 0.06), transparent)",
      }}
    >
      <div
        className="absolute inset-0 token-shimmer opacity-20 rounded-xl"
        style={{
          background:
            "linear-gradient(90deg, transparent, oklch(0.75 0.14 85 / 0.3), transparent)",
          backgroundSize: "200% 100%",
        }}
      />
      <div className="relative flex flex-col sm:flex-row sm:items-center gap-6">
        <div className="flex-1">
          <div className="flex items-center gap-2 mb-1">
            <Coins size={18} className="text-amber-500" />
            <span className="text-xs font-semibold uppercase tracking-widest text-muted-foreground">
              IIINTL Balance
            </span>
          </div>
          {record === null ? (
            <Skeleton className="h-12 w-48 mt-1" />
          ) : (
            <p
              className="text-5xl font-display font-bold tracking-tight"
              style={{ color: "oklch(0.65 0.14 85)" }}
            >
              {formatTokens(record.balance)}
            </p>
          )}
          <p className="text-xs text-muted-foreground mt-1">
            IIINTL Governance Token
          </p>
        </div>
        <div className="flex gap-6 flex-wrap">
          {record === null ? (
            <>
              <Skeleton className="h-10 w-24" />
              <Skeleton className="h-10 w-24" />
              <Skeleton className="h-10 w-24" />
            </>
          ) : (
            <>
              <StatBadge
                label="Total Earned"
                value={formatTokens(record.totalEarned)}
              />
              <StatBadge
                label="Total Burned"
                value={formatTokens(record.totalBurned)}
              />
              {record.lastAirdropAt ? (
                <StatBadge
                  label="Last Airdrop"
                  value={formatDate(record.lastAirdropAt)}
                />
              ) : (
                <StatBadge label="Last Airdrop" value="Never" />
              )}
              {rank !== null && (
                <StatBadge label="Leaderboard Rank" value={`#${rank}`} />
              )}
            </>
          )}
        </div>
      </div>
    </div>
  );
}

// ── Overview Tab ────────────────────────────────────────────────────────────

function OverviewTab({
  record,
  stats,
  rank,
}: {
  record: DAOTokenRecord | null;
  stats: {
    totalSupply: bigint;
    treasuryBalance: bigint;
    totalHolders: bigint;
  } | null;
  rank: number | null;
}) {
  return (
    <div className="space-y-5">
      <BalanceHero record={record} rank={rank} />
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        {[
          {
            label: "Total Supply",
            value: stats ? formatTokens(stats.totalSupply) : null,
            icon: <Coins size={16} className="text-amber-500" />,
          },
          {
            label: "Token Holders",
            value: stats ? formatTokens(stats.totalHolders) : null,
            icon: <Users size={16} className="text-blue-500" />,
          },
          {
            label: "Treasury Reserve",
            value: stats ? formatTokens(stats.treasuryBalance) : null,
            icon: <Award size={16} className="text-purple-500" />,
          },
        ].map(({ label, value, icon }) => (
          <Card key={label} className="border-border bg-card">
            <CardContent className="p-4 flex items-center gap-3">
              <div className="p-2 rounded-lg bg-muted/60">{icon}</div>
              <div>
                <p className="text-xs text-muted-foreground">{label}</p>
                {value === null ? (
                  <Skeleton className="h-5 w-20 mt-1" />
                ) : (
                  <p className="text-lg font-display font-bold text-foreground">
                    {value}
                  </p>
                )}
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
}

// ── History Tab ─────────────────────────────────────────────────────────────

function HistoryTab({
  transactions,
  loading,
}: { transactions: DAOTokenTransaction[]; loading: boolean }) {
  if (loading)
    return (
      <div className="space-y-2">
        {["sk-h-1", "sk-h-2", "sk-h-3", "sk-h-4", "sk-h-5"].map((k) => (
          <Skeleton key={k} className="h-12 w-full" />
        ))}
      </div>
    );

  if (transactions.length === 0)
    return (
      <div className="py-16 text-center" data-ocid="dao.history.empty_state">
        <Coins size={40} className="mx-auto text-muted-foreground/20 mb-3" />
        <p className="text-sm font-medium text-muted-foreground">
          No transactions yet
        </p>
        <p className="text-xs text-muted-foreground/60 mt-1">
          Earn tokens by voting, referrals, or awaiting the next airdrop
        </p>
      </div>
    );

  return (
    <div className="overflow-x-auto rounded-lg border border-border">
      <Table data-ocid="dao.history.table">
        <TableHeader>
          <TableRow className="border-border bg-muted/30">
            <TableHead className="text-xs font-semibold text-muted-foreground">
              Type
            </TableHead>
            <TableHead className="text-xs font-semibold text-muted-foreground text-right">
              Amount
            </TableHead>
            <TableHead className="text-xs font-semibold text-muted-foreground">
              From / To
            </TableHead>
            <TableHead className="text-xs font-semibold text-muted-foreground hidden md:table-cell">
              Note
            </TableHead>
            <TableHead className="text-xs font-semibold text-muted-foreground whitespace-nowrap">
              Date
            </TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {transactions.map((tx, idx) => (
            <TableRow
              key={String(tx.id)}
              className="border-border"
              data-ocid={`dao.history.row.${idx + 1}`}
            >
              <TableCell>
                <TxTypeBadge type={tx.txType} />
              </TableCell>
              <TableCell
                className="text-right font-display font-bold text-sm"
                style={{ color: "oklch(0.65 0.14 85)" }}
              >
                +{formatTokens(tx.amount)}
              </TableCell>
              <TableCell className="text-xs font-mono text-muted-foreground">
                {tx.from ? maskPrincipal(tx.from) : "—"} →{" "}
                {maskPrincipal(tx.to)}
              </TableCell>
              <TableCell className="text-xs text-muted-foreground hidden md:table-cell">
                <span className="line-clamp-1">{tx.note || "—"}</span>
              </TableCell>
              <TableCell className="text-xs text-muted-foreground whitespace-nowrap">
                {formatDate(tx.createdAt)}
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
}

// ── Earn & Claim Tab ─────────────────────────────────────────────────────────

function EarnTab({ onClaimed }: { onClaimed: () => void }) {
  const backend = useBackend();
  const [proposalId, setProposalId] = useState("");
  const [claiming, setClaiming] = useState(false);

  const handleClaim = async () => {
    if (!backend || !proposalId.trim()) return;
    setClaiming(true);
    try {
      const id = BigInt(proposalId.trim());
      const res = await backend.claimVotingReward(id);
      if ("ok" in res) {
        toast.success(`Claimed ${formatTokens(res.ok)} IIINTL!`);
        setProposalId("");
        onClaimed();
      } else {
        toast.error(res.err);
      }
    } catch {
      toast.error("Failed to claim reward");
    } finally {
      setClaiming(false);
    }
  };

  return (
    <div className="space-y-5">
      {/* Earn Opportunities */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        {EARN_OPPORTUNITIES.map((opp) => (
          <Card key={opp.title} className="border-border bg-card">
            <CardContent className="p-4 flex flex-col gap-3">
              <div className="flex items-start gap-3">
                <div className="p-2 rounded-lg bg-muted/60 text-amber-600 flex-shrink-0">
                  {opp.icon}
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-semibold text-foreground">
                    {opp.title}
                  </p>
                  <p className="text-xs text-muted-foreground mt-0.5">
                    {opp.desc}
                  </p>
                  <p
                    className="text-xs font-semibold mt-1"
                    style={{ color: "oklch(0.65 0.14 85)" }}
                  >
                    {opp.reward}
                  </p>
                </div>
              </div>
              {opp.action === "claim" && (
                <div className="flex gap-2 items-end">
                  <div className="flex-1">
                    <Label
                      htmlFor="proposal-id"
                      className="text-xs text-muted-foreground mb-1 block"
                    >
                      Proposal ID
                    </Label>
                    <Input
                      id="proposal-id"
                      value={proposalId}
                      onChange={(e) => setProposalId(e.target.value)}
                      placeholder="e.g. 42"
                      className="h-8 text-sm"
                      data-ocid="dao.earn.proposal_id_input"
                    />
                  </div>
                  <Button
                    size="sm"
                    onClick={handleClaim}
                    disabled={claiming || !proposalId.trim()}
                    data-ocid="dao.earn.claim_button"
                  >
                    {claiming ? (
                      <Loader2 size={14} className="animate-spin" />
                    ) : (
                      <Zap size={14} />
                    )}
                    Claim
                  </Button>
                </div>
              )}
              {opp.action === "mlm" && (
                <Button
                  size="sm"
                  variant="outline"
                  asChild
                  data-ocid="dao.earn.mlm_link"
                >
                  <Link to="/mlm">
                    View Rewards Hub <ExternalLink size={12} className="ml-1" />
                  </Link>
                </Button>
              )}
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Tier Airdrop Table */}
      <Card className="border-border bg-card">
        <CardHeader className="pb-3 pt-4 px-5">
          <CardTitle className="text-sm font-semibold flex items-center gap-2">
            <Sparkles size={15} className="text-amber-500" /> Tier Airdrop
            Allocation
          </CardTitle>
        </CardHeader>
        <CardContent className="px-5 pb-5">
          <div className="overflow-x-auto rounded-lg border border-border">
            <Table data-ocid="dao.earn.tier_table">
              <TableHeader>
                <TableRow className="bg-muted/30 border-border">
                  <TableHead className="text-xs font-semibold text-muted-foreground">
                    Tier
                  </TableHead>
                  <TableHead className="text-xs font-semibold text-muted-foreground text-right">
                    IIINTL Tokens
                  </TableHead>
                  <TableHead className="text-xs font-semibold text-muted-foreground text-right hidden sm:table-cell">
                    Relative Share
                  </TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {TIER_AIRDROP.map((t) => (
                  <TableRow
                    key={t.tier}
                    className="border-border"
                    data-ocid={`dao.earn.tier_row.${t.tier.toLowerCase()}`}
                  >
                    <TableCell className="font-medium text-sm capitalize">
                      {t.label}
                    </TableCell>
                    <TableCell
                      className="text-right font-display font-bold text-sm"
                      style={{ color: "oklch(0.65 0.14 85)" }}
                    >
                      {t.amount.toLocaleString()}
                    </TableCell>
                    <TableCell className="hidden sm:table-cell text-right">
                      <div className="flex items-center justify-end gap-2">
                        <div className="w-24 h-1.5 bg-muted rounded-full overflow-hidden">
                          <div
                            className="h-full rounded-full"
                            style={{
                              width: `${(t.amount / 10_000) * 100}%`,
                              background:
                                "linear-gradient(90deg, oklch(0.75 0.14 85), oklch(0.7 0.12 90))",
                            }}
                          />
                        </div>
                        <span className="text-xs text-muted-foreground w-10 text-right">
                          {Math.round((t.amount / 10_000) * 100)}%
                        </span>
                      </div>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}

// ── Transfer & Burn Tab ──────────────────────────────────────────────────────

function TransferBurnTab({ onUpdate }: { onUpdate: () => void }) {
  const backend = useBackend();
  const [toAddr, setToAddr] = useState("");
  const [transferAmt, setTransferAmt] = useState("");
  const [note, setNote] = useState("");
  const [burnAmt, setBurnAmt] = useState("");
  const [transferring, setTransferring] = useState(false);
  const [burning, setBurning] = useState(false);

  const handleTransfer = async () => {
    if (!backend || !toAddr.trim() || !transferAmt.trim()) return;
    setTransferring(true);
    try {
      const to = Principal.fromText(toAddr.trim());
      const res = await backend.transferDAOTokens(
        to,
        BigInt(transferAmt),
        note,
      );
      if ("ok" in res) {
        toast.success(`Transferred ${formatTokens(res.ok)} IIINTL`);
        setToAddr("");
        setTransferAmt("");
        setNote("");
        onUpdate();
      } else {
        toast.error(res.err);
      }
    } catch {
      toast.error("Invalid principal or amount");
    } finally {
      setTransferring(false);
    }
  };

  const handleBurn = async () => {
    if (!backend || !burnAmt.trim()) return;
    setBurning(true);
    try {
      const res = await backend.burnDAOTokens(BigInt(burnAmt));
      if ("ok" in res) {
        const credits = Number(res.ok) * 10;
        toast.success(
          `Burned ${burnAmt} IIINTL → earned ${credits.toLocaleString()} platform credits`,
        );
        setBurnAmt("");
        onUpdate();
      } else {
        toast.error(res.err);
      }
    } catch {
      toast.error("Failed to burn tokens");
    } finally {
      setBurning(false);
    }
  };

  const burnPreviewCredits =
    burnAmt && !Number.isNaN(Number(burnAmt))
      ? (Number(burnAmt) * 10).toLocaleString()
      : null;

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
      {/* Transfer */}
      <Card className="border-border bg-card">
        <CardHeader className="pb-3 pt-4 px-5">
          <CardTitle className="text-sm font-semibold flex items-center gap-2">
            <ArrowRightLeft size={15} className="text-blue-500" /> Transfer
            Tokens
          </CardTitle>
        </CardHeader>
        <CardContent className="px-5 pb-5 space-y-4">
          <div className="space-y-1.5">
            <Label
              htmlFor="transfer-to"
              className="text-xs font-medium uppercase tracking-wide text-muted-foreground"
            >
              Recipient Principal
            </Label>
            <Input
              id="transfer-to"
              value={toAddr}
              onChange={(e) => setToAddr(e.target.value)}
              placeholder="e.g. aaaaa-aa..."
              className="h-9 text-sm font-mono"
              data-ocid="dao.transfer.recipient_input"
            />
          </div>
          <div className="space-y-1.5">
            <Label
              htmlFor="transfer-amt"
              className="text-xs font-medium uppercase tracking-wide text-muted-foreground"
            >
              Amount (IIINTL)
            </Label>
            <Input
              id="transfer-amt"
              type="number"
              min="1"
              value={transferAmt}
              onChange={(e) => setTransferAmt(e.target.value)}
              placeholder="100"
              className="h-9 text-sm"
              data-ocid="dao.transfer.amount_input"
            />
          </div>
          <div className="space-y-1.5">
            <Label
              htmlFor="transfer-note"
              className="text-xs font-medium uppercase tracking-wide text-muted-foreground"
            >
              Note (optional)
            </Label>
            <Input
              id="transfer-note"
              value={note}
              onChange={(e) => setNote(e.target.value)}
              placeholder="Reason for transfer"
              className="h-9 text-sm"
              data-ocid="dao.transfer.note_input"
            />
          </div>
          <Button
            className="w-full"
            onClick={handleTransfer}
            disabled={transferring || !toAddr.trim() || !transferAmt.trim()}
            data-ocid="dao.transfer.submit_button"
          >
            {transferring ? (
              <Loader2 size={14} className="mr-1.5 animate-spin" />
            ) : (
              <ArrowRightLeft size={14} className="mr-1.5" />
            )}
            Transfer Tokens
          </Button>
        </CardContent>
      </Card>

      {/* Burn */}
      <Card className="border-border bg-card">
        <CardHeader className="pb-3 pt-4 px-5">
          <CardTitle className="text-sm font-semibold flex items-center gap-2">
            <Flame size={15} className="text-red-500" /> Burn Tokens
          </CardTitle>
        </CardHeader>
        <CardContent className="px-5 pb-5 space-y-4">
          <p className="text-xs text-muted-foreground">
            Burning tokens permanently reduces total supply and earns you{" "}
            <strong>10 platform credits per IIINTL burned</strong>.
          </p>
          <div className="space-y-1.5">
            <Label
              htmlFor="burn-amt"
              className="text-xs font-medium uppercase tracking-wide text-muted-foreground"
            >
              Amount to Burn (IIINTL)
            </Label>
            <Input
              id="burn-amt"
              type="number"
              min="1"
              value={burnAmt}
              onChange={(e) => setBurnAmt(e.target.value)}
              placeholder="50"
              className="h-9 text-sm"
              data-ocid="dao.burn.amount_input"
            />
          </div>
          {burnPreviewCredits && (
            <div className="rounded-lg border border-border bg-muted/30 px-4 py-3">
              <p className="text-xs text-muted-foreground">You will receive</p>
              <p className="text-xl font-display font-bold text-foreground mt-0.5">
                {burnPreviewCredits}{" "}
                <span className="text-sm text-muted-foreground font-normal">
                  platform credits
                </span>
              </p>
            </div>
          )}
          <Button
            variant="destructive"
            className="w-full"
            onClick={handleBurn}
            disabled={burning || !burnAmt.trim()}
            data-ocid="dao.burn.submit_button"
          >
            {burning ? (
              <Loader2 size={14} className="mr-1.5 animate-spin" />
            ) : (
              <Flame size={14} className="mr-1.5" />
            )}
            Burn Tokens
          </Button>
        </CardContent>
      </Card>
    </div>
  );
}

// ── Leaderboard Tab ──────────────────────────────────────────────────────────

const MEDAL_COLORS = ["text-amber-500", "text-slate-400", "text-amber-700"];

function LeaderboardTab({
  leaderboard,
  loading,
}: { leaderboard: DAOTokenRecord[]; loading: boolean }) {
  if (loading)
    return (
      <div className="space-y-2">
        {[
          "sk-l-1",
          "sk-l-2",
          "sk-l-3",
          "sk-l-4",
          "sk-l-5",
          "sk-l-6",
          "sk-l-7",
          "sk-l-8",
          "sk-l-9",
          "sk-l-10",
        ].map((k) => (
          <Skeleton key={k} className="h-14 w-full" />
        ))}
      </div>
    );

  const maxBalance = leaderboard[0]?.balance ?? BigInt(1);

  return (
    <div className="space-y-2" data-ocid="dao.leaderboard.list">
      {leaderboard.map((entry, idx) => {
        const pct = Number(entry.balance) / Number(maxBalance);
        return (
          <div
            key={entry.principal.toText()}
            className={cn(
              "flex items-center gap-4 p-4 rounded-lg border bg-card transition-colors",
              idx === 0
                ? "border-amber-500/30 bg-amber-500/10"
                : "border-border hover:bg-muted/20",
            )}
            data-ocid={`dao.leaderboard.row.${idx + 1}`}
          >
            <div className="w-8 flex-shrink-0 text-center">
              {idx < 3 ? (
                <Medal size={20} className={MEDAL_COLORS[idx]} />
              ) : (
                <span className="text-sm font-bold text-muted-foreground">
                  #{idx + 1}
                </span>
              )}
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-sm font-mono text-foreground truncate">
                {maskPrincipal(entry.principal)}
              </p>
              <div className="mt-1.5 h-1.5 bg-muted rounded-full overflow-hidden">
                <div
                  className="h-full rounded-full"
                  style={{
                    width: `${pct * 100}%`,
                    background:
                      "linear-gradient(90deg, oklch(0.75 0.14 85), oklch(0.7 0.12 90))",
                  }}
                />
              </div>
            </div>
            <div className="text-right flex-shrink-0">
              <p
                className="text-base font-display font-bold"
                style={{ color: "oklch(0.65 0.14 85)" }}
              >
                {formatTokens(entry.balance)}
              </p>
              <p className="text-[10px] text-muted-foreground">IIINTL</p>
            </div>
          </div>
        );
      })}
      {leaderboard.length === 0 && (
        <div
          className="py-16 text-center"
          data-ocid="dao.leaderboard.empty_state"
        >
          <Trophy size={40} className="mx-auto text-muted-foreground/20 mb-3" />
          <p className="text-sm text-muted-foreground">
            No token holders yet — be first!
          </p>
        </div>
      )}
    </div>
  );
}

// ── Main Page ────────────────────────────────────────────────────────────────

export function DAOPage() {
  const backend = useBackend();

  const [record, setRecord] = useState<DAOTokenRecord | null>(null);
  const [stats, setStats] = useState<{
    totalSupply: bigint;
    treasuryBalance: bigint;
    totalHolders: bigint;
  } | null>(null);
  const [transactions, setTransactions] = useState<DAOTokenTransaction[]>([]);
  const [leaderboard, setLeaderboard] = useState<DAOTokenRecord[]>([]);
  const [loadingRecord, setLoadingRecord] = useState(true);
  const [loadingTxns, setLoadingTxns] = useState(true);
  const [loadingLeaderboard, setLoadingLeaderboard] = useState(true);
  const [rank, setRank] = useState<number | null>(null);

  const fetchRecord = useCallback(async () => {
    if (!backend) return;
    try {
      const [rec, st] = await Promise.all([
        backend.getMyDAOBalance(),
        backend.getDAOTokenStats(),
      ]);
      setRecord(rec);
      setStats(st);
    } catch {
      /* silent */
    } finally {
      setLoadingRecord(false);
    }
  }, [backend]);

  const fetchTransactions = useCallback(async () => {
    if (!backend) return;
    setLoadingTxns(true);
    try {
      const txns = await backend.getDAOTransactionHistory();
      setTransactions(
        [...txns].sort((a, b) => Number(b.createdAt - a.createdAt)),
      );
    } catch {
      /* silent */
    } finally {
      setLoadingTxns(false);
    }
  }, [backend]);

  const fetchLeaderboard = useCallback(async () => {
    if (!backend) return;
    setLoadingLeaderboard(true);
    try {
      const lb = await backend.getDaoLeaderboard();
      setLeaderboard(lb);
      if (record) {
        const idx = lb.findIndex(
          (r) => r.principal.toText() === record.principal.toText(),
        );
        setRank(idx >= 0 ? idx + 1 : null);
      }
    } catch {
      /* silent */
    } finally {
      setLoadingLeaderboard(false);
    }
  }, [backend, record]);

  useEffect(() => {
    fetchRecord();
  }, [fetchRecord]);
  useEffect(() => {
    fetchTransactions();
  }, [fetchTransactions]);
  useEffect(() => {
    fetchLeaderboard();
  }, [fetchLeaderboard]);

  const refreshAll = () => {
    fetchRecord();
    fetchTransactions();
    fetchLeaderboard();
  };

  return (
    <Layout breadcrumb="DAO Token">
      <div className="p-6 max-w-5xl mx-auto space-y-6">
        {/* Page Header */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div>
            <div className="flex items-center gap-2 mb-1">
              <div
                className="w-8 h-8 rounded-lg flex items-center justify-center"
                style={{
                  background:
                    "linear-gradient(135deg, oklch(0.75 0.14 85), oklch(0.65 0.12 90))",
                }}
              >
                <Coins size={16} className="text-white" />
              </div>
              <h1 className="text-2xl font-display font-bold text-foreground">
                IIINTL DAO Token
              </h1>
            </div>
            <p className="text-sm text-muted-foreground">
              Governance token for the IIIntl One Platform
            </p>
          </div>
          <Badge
            variant="outline"
            className="self-start sm:self-center text-xs px-3 py-1.5 border-amber-200"
            style={{
              color: "oklch(0.65 0.14 85)",
              background: "oklch(0.75 0.14 85 / 0.08)",
            }}
          >
            <Sparkles size={11} className="mr-1" /> On-Chain Governance
          </Badge>
        </div>

        {/* Tabs */}
        <Tabs defaultValue="overview" data-ocid="dao.tabs">
          <TabsList className="w-full grid grid-cols-5 h-auto">
            {[
              { value: "overview", label: "Overview" },
              { value: "history", label: "History" },
              { value: "earn", label: "Earn & Claim" },
              { value: "transfer", label: "Transfer" },
              { value: "leaderboard", label: "Leaderboard" },
            ].map(({ value, label }) => (
              <TabsTrigger
                key={value}
                value={value}
                className="text-xs sm:text-sm py-2"
                data-ocid={`dao.tab.${value}`}
              >
                {label}
              </TabsTrigger>
            ))}
          </TabsList>

          <TabsContent value="overview" className="mt-5">
            <OverviewTab
              record={loadingRecord ? null : record}
              stats={stats}
              rank={rank}
            />
          </TabsContent>

          <TabsContent value="history" className="mt-5">
            <HistoryTab transactions={transactions} loading={loadingTxns} />
          </TabsContent>

          <TabsContent value="earn" className="mt-5">
            <EarnTab onClaimed={refreshAll} />
          </TabsContent>

          <TabsContent value="transfer" className="mt-5">
            <TransferBurnTab onUpdate={refreshAll} />
          </TabsContent>

          <TabsContent value="leaderboard" className="mt-5">
            <LeaderboardTab
              leaderboard={leaderboard}
              loading={loadingLeaderboard}
            />
          </TabsContent>
        </Tabs>
      </div>
    </Layout>
  );
}
