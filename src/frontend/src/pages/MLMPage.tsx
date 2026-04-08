import { MembershipTierLevel } from "@/backend";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Progress } from "@/components/ui/progress";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
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
import { useAuth } from "@/context/AuthContext";
import { useBackend } from "@/hooks/useBackend";
import type {
  DownlineMember,
  EarningRecord,
  EarningsSummary,
  FSUPoolStatus,
  FSURecord,
  FSUTransaction,
  MemberTierRecord,
  RoyaltyDistribution,
  RoyaltyPool,
} from "@/types/appTypes";
import {
  Award,
  CheckCircle,
  ChevronRight,
  Copy,
  DollarSign,
  Loader2,
  Network,
  Star,
  TrendingUp,
  Users,
} from "lucide-react";
import { motion } from "motion/react";
import { useCallback, useEffect, useState } from "react";
import { toast } from "sonner";

type Tab =
  | "overview"
  | "earnings"
  | "network"
  | "finfracfran"
  | "royalty"
  | "leaderboard"
  | "challenges";

const TIER_COLORS: Record<MembershipTierLevel, string> = {
  free: "bg-slate-500",
  associate: "bg-blue-500",
  affiliate: "bg-teal-500",
  partner: "bg-purple-500",
  executive: "bg-orange-500",
  ambassador: "bg-yellow-500",
  founder: "bg-red-500",
};

const TIER_LABELS: Record<MembershipTierLevel, string> = {
  free: "Free",
  associate: "Associate",
  affiliate: "Affiliate",
  partner: "Partner",
  executive: "Executive",
  ambassador: "Ambassador",
  founder: "Founder",
};

const EARNING_TYPE_COLORS: Record<string, string> = {
  directReferral: "bg-blue-100 text-blue-800",
  levelOverride: "bg-purple-100 text-purple-800",
  royaltyPool: "bg-green-100 text-green-800",
  eventCommission: "bg-orange-100 text-orange-800",
  finFracFran: "bg-yellow-100 text-yellow-800",
  activityBonus: "bg-teal-100 text-teal-800",
};

const EARNING_TYPE_LABELS: Record<string, string> = {
  directReferral: "Direct Referral",
  levelOverride: "Level Override",
  royaltyPool: "Royalty Pool",
  eventCommission: "Event Commission",
  finFracFran: "FinFracFran™",
  activityBonus: "Activity Bonus",
};

const STATUS_COLORS: Record<string, string> = {
  pending: "bg-amber-100 text-amber-800",
  processing: "bg-sky-100 text-sky-800",
  paid: "bg-emerald-100 text-emerald-800",
};

function centsToDisplay(cents: bigint): string {
  return `$${(Number(cents) / 100).toFixed(2)}`;
}

function formatTs(ts: bigint): string {
  return new Date(Number(ts) / 1_000_000).toLocaleDateString();
}

function TierBadge({ tier }: { tier: MembershipTierLevel }) {
  return (
    <span
      className={`inline-flex items-center gap-1 rounded-full px-2.5 py-0.5 text-xs font-semibold text-white ${TIER_COLORS[tier]}`}
    >
      <Star size={10} />
      {TIER_LABELS[tier]}
    </span>
  );
}

export function MLMPage() {
  const backend = useBackend();
  const { isAuthenticated } = useAuth();
  const [activeTab, setActiveTab] = useState<Tab>("overview");

  const [tierRecord, setTierRecord] = useState<MemberTierRecord | null>(null);
  const [summary, setSummary] = useState<EarningsSummary | null>(null);
  const [referralCode, setReferralCode] = useState<string | null>(null);
  const [earnings, setEarnings] = useState<EarningRecord[]>([]);
  const [downline, setDownline] = useState<DownlineMember[]>([]);
  const [upline, setUpline] = useState<MemberTierRecord[]>([]);
  const [fsuPool, setFsuPool] = useState<FSUPoolStatus | null>(null);
  const [fsuRecord, setFsuRecord] = useState<FSURecord | null>(null);
  const [fsuTxs, setFsuTxs] = useState<FSUTransaction[]>([]);
  const [royaltyPools, setRoyaltyPools] = useState<RoyaltyPool[]>([]);
  const [royaltyDists, setRoyaltyDists] = useState<RoyaltyDistribution[]>([]);

  const [loading, setLoading] = useState(true);
  const [enrolling, setEnrolling] = useState(false);
  const [upgradeOpen, setUpgradeOpen] = useState(false);
  const [upgradeTier, setUpgradeTier] = useState<MembershipTierLevel>(
    MembershipTierLevel.associate,
  );
  const [upgrading, setUpgrading] = useState(false);
  const [redeemAmount, setRedeemAmount] = useState("");
  const [redeemDesc, setRedeemDesc] = useState("");
  const [redeeming, setRedeeming] = useState(false);

  const loadData = useCallback(async () => {
    if (!backend) return;
    setLoading(true);
    try {
      const [tier, ref] = await Promise.all([
        backend.getMyTierRecord(),
        backend.getMyReferralCode(),
      ]);
      setTierRecord(tier);
      setReferralCode(ref);
      if (tier) {
        const [sum, earn, dl, ul, fsp, fsr, ftx, rp, rd] = await Promise.all([
          backend.getMyEarningsSummary(),
          backend.getMyEarnings(),
          backend.getMyDownline(),
          backend.getMyUplineChain(),
          backend.getFSUPoolStatus(),
          backend.getMyFSURecord(),
          backend.getMyFSUTransactions(),
          backend.listRoyaltyPools(),
          backend.getMyRoyaltyDistributions(),
        ]);
        setSummary(sum);
        setEarnings(earn);
        setDownline(dl);
        setUpline(ul);
        setFsuPool(fsp);
        setFsuRecord(fsr);
        setFsuTxs(ftx);
        setRoyaltyPools(rp);
        setRoyaltyDists(rd);
      }
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  }, [backend]);

  useEffect(() => {
    if (isAuthenticated && backend) loadData();
  }, [isAuthenticated, backend, loadData]);

  async function handleEnroll() {
    if (!backend) return;
    setEnrolling(true);
    try {
      await backend.initMemberMLM(null);
      toast.success("Welcome to the Rewards program!");
      await loadData();
    } catch {
      toast.error("Enrollment failed. Please try again.");
    } finally {
      setEnrolling(false);
    }
  }

  async function handleUpgrade() {
    if (!backend) return;
    setUpgrading(true);
    try {
      await backend.upgradeMemberTier(upgradeTier);
      toast.success(`Upgraded to ${TIER_LABELS[upgradeTier]}!`);
      setUpgradeOpen(false);
      await loadData();
    } catch {
      toast.error("Upgrade failed.");
    } finally {
      setUpgrading(false);
    }
  }

  async function handleRedeem() {
    if (!backend || !redeemAmount) return;
    setRedeeming(true);
    try {
      await backend.redeemFSU(
        BigInt(redeemAmount),
        redeemDesc || "FSU redemption",
      );
      toast.success("FSU redeemed successfully!");
      setRedeemAmount("");
      setRedeemDesc("");
      await loadData();
    } catch {
      toast.error("Redemption failed.");
    } finally {
      setRedeeming(false);
    }
  }

  function copyReferralLink() {
    if (!referralCode) return;
    const url = `${window.location.origin}/register?ref=${referralCode}`;
    navigator.clipboard.writeText(url);
    toast.success("Referral link copied!");
  }

  const referralUrl = referralCode
    ? `${window.location.origin}/register?ref=${referralCode}`
    : "";

  return (
    <div className="min-h-screen bg-background">
      <div className="mx-auto max-w-6xl px-4 py-8">
        <motion.div
          initial={{ opacity: 0, y: -16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4 }}
        >
          <div className="mb-6 flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-primary text-primary-foreground">
              <TrendingUp size={20} />
            </div>
            <div>
              <h1 className="text-2xl font-bold text-foreground">
                Rewards & MLM Hub
              </h1>
              <p className="text-sm text-muted-foreground">
                Earn commissions, grow your network, and participate in
                FinFracFran™
              </p>
            </div>
          </div>
        </motion.div>

        {loading ? (
          <div className="space-y-4">
            <Skeleton className="h-40 w-full" />
            <Skeleton className="h-64 w-full" />
          </div>
        ) : (
          <Tabs value={activeTab} onValueChange={(v) => setActiveTab(v as Tab)}>
            <TabsList
              className="mb-6 grid w-full grid-cols-7"
              data-ocid="mlm.tab"
            >
              <TabsTrigger value="overview">Overview</TabsTrigger>
              <TabsTrigger value="earnings">Earnings</TabsTrigger>
              <TabsTrigger value="network">My Network</TabsTrigger>
              <TabsTrigger value="finfracfran">FinFracFran™</TabsTrigger>
              <TabsTrigger value="royalty">Royalty Pools</TabsTrigger>
              <TabsTrigger value="leaderboard">Leaderboard</TabsTrigger>
              <TabsTrigger value="challenges">Challenges</TabsTrigger>
            </TabsList>

            {/* OVERVIEW */}
            <TabsContent value="overview">
              {!tierRecord ? (
                <motion.div
                  initial={{ opacity: 0, scale: 0.97 }}
                  animate={{ opacity: 1, scale: 1 }}
                  className="flex flex-col items-center justify-center rounded-2xl border-2 border-dashed border-border bg-card px-8 py-16 text-center"
                  data-ocid="mlm.empty_state"
                >
                  <Award size={48} className="mb-4 text-primary" />
                  <h2 className="mb-2 text-xl font-bold">
                    Join the Rewards Program
                  </h2>
                  <p className="mb-6 max-w-md text-muted-foreground">
                    Unlock earning potential through referrals, commissions,
                    royalty pools, and FinFracFran™ fractal rewards. Free to
                    join.
                  </p>
                  <Button
                    onClick={handleEnroll}
                    disabled={enrolling}
                    data-ocid="mlm.primary_button"
                  >
                    {enrolling && (
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    )}
                    {enrolling ? "Enrolling..." : "Join Rewards Program"}
                  </Button>
                </motion.div>
              ) : (
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  className="space-y-6"
                >
                  {/* Tier + referral */}
                  <div className="flex flex-wrap items-start justify-between gap-4 rounded-2xl border bg-card p-6">
                    <div className="space-y-2">
                      <p className="text-sm text-muted-foreground">
                        Current Tier
                      </p>
                      <TierBadge tier={tierRecord.tier} />
                      <p className="text-xs text-muted-foreground">
                        Member since {formatTs(tierRecord.joinedAt)}
                      </p>
                    </div>
                    <div className="space-y-2">
                      <p className="text-sm text-muted-foreground">
                        Your Referral Link
                      </p>
                      <div className="flex items-center gap-2">
                        <code className="rounded bg-muted px-2 py-1 text-xs">
                          {referralUrl.slice(0, 48)}...
                        </code>
                        <Button
                          size="sm"
                          variant="outline"
                          onClick={copyReferralLink}
                          data-ocid="mlm.secondary_button"
                        >
                          <Copy size={14} />
                        </Button>
                      </div>
                    </div>
                    <Dialog open={upgradeOpen} onOpenChange={setUpgradeOpen}>
                      <DialogTrigger asChild>
                        <Button
                          variant="outline"
                          data-ocid="mlm.open_modal_button"
                        >
                          Upgrade Tier
                        </Button>
                      </DialogTrigger>
                      <DialogContent data-ocid="mlm.dialog">
                        <DialogHeader>
                          <DialogTitle>Upgrade Membership Tier</DialogTitle>
                        </DialogHeader>
                        <div className="space-y-4 py-2">
                          <Label>Select new tier</Label>
                          <Select
                            value={upgradeTier}
                            onValueChange={(v) =>
                              setUpgradeTier(v as MembershipTierLevel)
                            }
                          >
                            <SelectTrigger data-ocid="mlm.select">
                              <SelectValue />
                            </SelectTrigger>
                            <SelectContent>
                              {(
                                [
                                  "associate",
                                  "affiliate",
                                  "partner",
                                  "executive",
                                  "ambassador",
                                  "founder",
                                ] as MembershipTierLevel[]
                              ).map((t) => (
                                <SelectItem key={t} value={t}>
                                  {TIER_LABELS[t]}
                                </SelectItem>
                              ))}
                            </SelectContent>
                          </Select>
                          <div className="flex gap-2">
                            <Button
                              onClick={handleUpgrade}
                              disabled={upgrading}
                              data-ocid="mlm.confirm_button"
                            >
                              {upgrading && (
                                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                              )}
                              Upgrade
                            </Button>
                            <Button
                              variant="outline"
                              onClick={() => setUpgradeOpen(false)}
                              data-ocid="mlm.cancel_button"
                            >
                              Cancel
                            </Button>
                          </div>
                        </div>
                      </DialogContent>
                    </Dialog>
                  </div>

                  {/* Stat cards */}
                  {summary && (
                    <div className="grid grid-cols-2 gap-4 md:grid-cols-4">
                      {[
                        {
                          label: "Total Earned",
                          value: centsToDisplay(summary.totalLifetime),
                          icon: <DollarSign size={18} />,
                        },
                        {
                          label: "Pending",
                          value: centsToDisplay(summary.totalPending),
                          icon: <TrendingUp size={18} />,
                        },
                        {
                          label: "Paid Out",
                          value: centsToDisplay(summary.totalPaid),
                          icon: <CheckCircle size={18} />,
                        },
                        {
                          label: "FSU Balance",
                          value: fsuRecord ? String(fsuRecord.balance) : "0",
                          icon: <Star size={18} />,
                        },
                      ].map((s) => (
                        <Card key={s.label}>
                          <CardContent className="flex items-center gap-3 p-4">
                            <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-primary/10 text-primary">
                              {s.icon}
                            </div>
                            <div>
                              <p className="text-xs text-muted-foreground">
                                {s.label}
                              </p>
                              <p className="text-lg font-bold">{s.value}</p>
                            </div>
                          </CardContent>
                        </Card>
                      ))}
                    </div>
                  )}

                  {/* Earnings breakdown */}
                  {summary && (
                    <Card>
                      <CardHeader>
                        <CardTitle className="text-base">
                          Earnings Breakdown
                        </CardTitle>
                      </CardHeader>
                      <CardContent className="space-y-3">
                        {(
                          [
                            ["directReferral", summary.directReferral],
                            ["levelOverride", summary.levelOverride],
                            ["royaltyPool", summary.royaltyPool],
                            ["eventCommission", summary.eventCommission],
                            ["finFracFran", summary.finFracFran],
                            ["activityBonus", summary.activityBonus],
                          ] as [string, bigint][]
                        ).map(([type, cents]) => {
                          const total =
                            summary.totalLifetime > 0n
                              ? summary.totalLifetime
                              : 1n;
                          const pct = Math.round(
                            (Number(cents) / Number(total)) * 100,
                          );
                          return (
                            <div key={type}>
                              <div className="mb-1 flex justify-between text-xs">
                                <span className="font-medium">
                                  {EARNING_TYPE_LABELS[type]}
                                </span>
                                <span className="text-muted-foreground">
                                  {centsToDisplay(cents)}
                                </span>
                              </div>
                              <Progress value={pct} className="h-1.5" />
                            </div>
                          );
                        })}
                      </CardContent>
                    </Card>
                  )}
                </motion.div>
              )}
            </TabsContent>

            {/* EARNINGS */}
            <TabsContent value="earnings">
              <Card>
                <CardHeader>
                  <CardTitle>Earnings History</CardTitle>
                </CardHeader>
                <CardContent>
                  {earnings.length === 0 ? (
                    <div
                      className="py-12 text-center text-muted-foreground"
                      data-ocid="earnings.empty_state"
                    >
                      No earnings yet. Start referring members to earn
                      commissions.
                    </div>
                  ) : (
                    <Table data-ocid="earnings.table">
                      <TableHeader>
                        <TableRow>
                          <TableHead>Date</TableHead>
                          <TableHead>Description</TableHead>
                          <TableHead>Type</TableHead>
                          <TableHead>Level</TableHead>
                          <TableHead>Amount</TableHead>
                          <TableHead>Status</TableHead>
                        </TableRow>
                      </TableHeader>
                      <TableBody>
                        {earnings.map((e, i) => (
                          <TableRow
                            key={String(e.id)}
                            data-ocid={`earnings.item.${i + 1}`}
                          >
                            <TableCell className="text-sm">
                              {formatTs(e.createdAt)}
                            </TableCell>
                            <TableCell className="text-sm">
                              {e.description}
                            </TableCell>
                            <TableCell>
                              <span
                                className={`rounded-full px-2 py-0.5 text-xs font-medium ${
                                  EARNING_TYPE_COLORS[e.earningType] ??
                                  "bg-gray-100 text-gray-800"
                                }`}
                              >
                                {EARNING_TYPE_LABELS[e.earningType] ??
                                  e.earningType}
                              </span>
                            </TableCell>
                            <TableCell className="text-sm">
                              L{e.depthLevel}
                            </TableCell>
                            <TableCell className="font-medium">
                              {centsToDisplay(e.amountUnits)}
                            </TableCell>
                            <TableCell>
                              <span
                                className={`rounded-full px-2 py-0.5 text-xs font-medium ${
                                  STATUS_COLORS[e.status] ?? "bg-gray-100"
                                }`}
                              >
                                {e.status}
                              </span>
                            </TableCell>
                          </TableRow>
                        ))}
                      </TableBody>
                    </Table>
                  )}
                </CardContent>
              </Card>
            </TabsContent>

            {/* NETWORK */}
            <TabsContent value="network">
              <div className="space-y-6">
                {/* Referral link */}
                <Card>
                  <CardHeader>
                    <CardTitle className="text-base">
                      Your Referral Link
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="flex items-center gap-2">
                      <Input
                        readOnly
                        value={referralUrl}
                        className="font-mono text-xs"
                        data-ocid="network.input"
                      />
                      <Button
                        variant="outline"
                        onClick={copyReferralLink}
                        data-ocid="network.secondary_button"
                      >
                        <Copy size={14} className="mr-1" />
                        Copy
                      </Button>
                    </div>
                  </CardContent>
                </Card>

                {/* Downline */}
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2 text-base">
                      <Users size={16} /> Direct Downline
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    {downline.length === 0 ? (
                      <p
                        className="py-6 text-center text-sm text-muted-foreground"
                        data-ocid="downline.empty_state"
                      >
                        No direct referrals yet. Share your link to grow your
                        network.
                      </p>
                    ) : (
                      <div
                        className="grid gap-3 sm:grid-cols-2"
                        data-ocid="downline.list"
                      >
                        {downline.map((m, i) => (
                          <div
                            key={m.referralCode}
                            className="flex items-center gap-3 rounded-xl border bg-card p-3"
                            data-ocid={`downline.item.${i + 1}`}
                          >
                            <div className="flex h-9 w-9 items-center justify-center rounded-full bg-primary text-xs font-bold text-primary-foreground">
                              {String(m.referralCode).slice(0, 2).toUpperCase()}
                            </div>
                            <div className="min-w-0 flex-1">
                              <p className="truncate text-sm font-medium">
                                {m.referralCode}
                              </p>
                              <p className="font-mono text-xs text-muted-foreground">
                                {typeof m.principal === "object" &&
                                m.principal !== null &&
                                "toText" in (m.principal as object)
                                  ? (m.principal as { toText: () => string })
                                      .toText()
                                      .slice(0, 12)
                                  : String(m.principal).slice(0, 12)}
                                ...
                              </p>
                            </div>
                            <div className="text-right">
                              <TierBadge tier={m.tier} />
                              <p className="mt-1 text-xs text-muted-foreground">
                                {String(m.directReferralCount)} refs
                              </p>
                            </div>
                          </div>
                        ))}
                      </div>
                    )}
                  </CardContent>
                </Card>

                {/* Upline */}
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2 text-base">
                      <Network size={16} /> Upline Chain
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    {upline.length === 0 ? (
                      <p
                        className="py-4 text-center text-sm text-muted-foreground"
                        data-ocid="upline.empty_state"
                      >
                        No upline. You are a founding member.
                      </p>
                    ) : (
                      <div className="space-y-2">
                        {upline.map((u, i) => (
                          <div
                            key={`upline-${i}-${u.tier}`}
                            className="flex items-center gap-3 rounded-lg border bg-muted/30 p-3"
                            data-ocid={`upline.item.${i + 1}`}
                          >
                            <span className="text-xs font-bold text-muted-foreground">
                              L{i + 1}
                            </span>
                            <ChevronRight
                              size={14}
                              className="text-muted-foreground"
                            />
                            <TierBadge tier={u.tier} />
                          </div>
                        ))}
                      </div>
                    )}
                  </CardContent>
                </Card>
              </div>
            </TabsContent>

            {/* FINFRACFRAN */}
            <TabsContent value="finfracfran">
              <div className="space-y-6">
                {/* Header */}
                <div className="rounded-2xl bg-gradient-to-r from-yellow-500 via-amber-400 to-orange-400 p-8 text-white">
                  <h2 className="mb-2 text-2xl font-bold">
                    FinFracFran™ Fractal Franchise
                  </h2>
                  <p className="max-w-2xl text-sm text-yellow-100">
                    Every transaction on the platform generates a micro-share
                    that propagates fractally through the entire active
                    membership — ensuring everyone participates in the
                    platform&apos;s economic output.
                  </p>
                </div>

                <div className="grid gap-4 md:grid-cols-2">
                  {/* Pool Status */}
                  <Card>
                    <CardHeader>
                      <CardTitle className="text-base">
                        FSU Pool Status
                      </CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-3">
                      {fsuPool ? (
                        <>
                          <div className="flex justify-between">
                            <span className="text-sm text-muted-foreground">
                              Pool Size
                            </span>
                            <span className="font-semibold">
                              {centsToDisplay(fsuPool.poolSizeUnits)}
                            </span>
                          </div>
                          <div className="flex justify-between">
                            <span className="text-sm text-muted-foreground">
                              FSU Value Each
                            </span>
                            <span className="font-semibold">
                              {centsToDisplay(fsuPool.valuePerUnitCents)}
                            </span>
                          </div>
                          <div className="flex justify-between">
                            <span className="text-sm text-muted-foreground">
                              Total Outstanding
                            </span>
                            <span className="font-semibold">
                              {String(fsuPool.totalOutstandingFSU)} FSU
                            </span>
                          </div>
                          <div className="flex justify-between">
                            <span className="text-sm text-muted-foreground">
                              Next Distribution
                            </span>
                            <span className="font-semibold text-amber-600">
                              {fsuPool.nextDistributionLabel}
                            </span>
                          </div>
                        </>
                      ) : (
                        <p className="text-sm text-muted-foreground">
                          Pool data unavailable
                        </p>
                      )}
                    </CardContent>
                  </Card>

                  {/* My Balance */}
                  <Card>
                    <CardHeader>
                      <CardTitle className="text-base">
                        My FSU Balance
                      </CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-3">
                      {fsuRecord ? (
                        <>
                          <div className="flex justify-between">
                            <span className="text-sm text-muted-foreground">
                              Current Balance
                            </span>
                            <span className="text-xl font-bold text-amber-600">
                              {String(fsuRecord.balance)} FSU
                            </span>
                          </div>
                          <div className="flex justify-between">
                            <span className="text-sm text-muted-foreground">
                              Lifetime Earned
                            </span>
                            <span className="font-semibold">
                              {String(fsuRecord.lifetimeEarned)} FSU
                            </span>
                          </div>
                        </>
                      ) : (
                        <p className="text-sm text-muted-foreground">
                          No FSU balance yet
                        </p>
                      )}
                    </CardContent>
                  </Card>
                </div>

                {/* Redeem */}
                <Card>
                  <CardHeader>
                    <CardTitle className="text-base">Redeem FSU</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="flex flex-wrap gap-3">
                      <div className="flex-1">
                        <Label className="mb-1 block text-xs">FSU Amount</Label>
                        <Input
                          type="number"
                          placeholder="e.g. 100"
                          value={redeemAmount}
                          onChange={(e) => setRedeemAmount(e.target.value)}
                          data-ocid="fsu.input"
                        />
                      </div>
                      <div className="flex-1">
                        <Label className="mb-1 block text-xs">
                          Description (optional)
                        </Label>
                        <Input
                          placeholder="Redemption reason"
                          value={redeemDesc}
                          onChange={(e) => setRedeemDesc(e.target.value)}
                        />
                      </div>
                      <div className="flex items-end">
                        <Button
                          onClick={handleRedeem}
                          disabled={redeeming || !redeemAmount}
                          data-ocid="fsu.submit_button"
                        >
                          {redeeming && (
                            <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                          )}
                          Redeem
                        </Button>
                      </div>
                    </div>
                  </CardContent>
                </Card>

                {/* FSU History */}
                <Card>
                  <CardHeader>
                    <CardTitle className="text-base">
                      FSU Transaction History
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    {fsuTxs.length === 0 ? (
                      <p
                        className="py-6 text-center text-sm text-muted-foreground"
                        data-ocid="fsu.empty_state"
                      >
                        No FSU transactions yet.
                      </p>
                    ) : (
                      <Table data-ocid="fsu.table">
                        <TableHeader>
                          <TableRow>
                            <TableHead>Date</TableHead>
                            <TableHead>Type</TableHead>
                            <TableHead>FSU</TableHead>
                            <TableHead>USD Value</TableHead>
                            <TableHead>Description</TableHead>
                          </TableRow>
                        </TableHeader>
                        <TableBody>
                          {fsuTxs.map((tx, i) => (
                            <TableRow
                              key={String(tx.id)}
                              data-ocid={`fsu.item.${i + 1}`}
                            >
                              <TableCell className="text-sm">
                                {formatTs(tx.createdAt)}
                              </TableCell>
                              <TableCell>
                                <Badge
                                  variant={
                                    tx.txType === "earned"
                                      ? "default"
                                      : "secondary"
                                  }
                                >
                                  {tx.txType}
                                </Badge>
                              </TableCell>
                              <TableCell className="font-mono">
                                {String(tx.amount)}
                              </TableCell>
                              <TableCell>
                                {centsToDisplay(tx.valuePerUnitCents)}
                              </TableCell>
                              <TableCell className="text-sm text-muted-foreground">
                                {tx.description}
                              </TableCell>
                            </TableRow>
                          ))}
                        </TableBody>
                      </Table>
                    )}
                  </CardContent>
                </Card>
              </div>
            </TabsContent>

            {/* ROYALTY */}
            <TabsContent value="royalty">
              <div className="space-y-6">
                <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
                  {royaltyPools.length === 0 ? (
                    <div
                      className="col-span-full py-12 text-center text-muted-foreground"
                      data-ocid="royalty.empty_state"
                    >
                      No royalty pools available.
                    </div>
                  ) : (
                    royaltyPools.map((pool, i) => (
                      <Card
                        key={String(pool.id)}
                        data-ocid={`royalty.item.${i + 1}`}
                      >
                        <CardContent className="p-5">
                          <div className="mb-3 flex items-start justify-between">
                            <Badge variant="outline" className="capitalize">
                              {pool.poolType}
                            </Badge>
                            <span
                              className={`rounded-full px-2 py-0.5 text-xs font-medium ${
                                pool.isDistributed
                                  ? "bg-green-100 text-green-800"
                                  : "bg-amber-100 text-amber-800"
                              }`}
                            >
                              {pool.isDistributed ? "Distributed" : "Open"}
                            </span>
                          </div>
                          <p className="mb-1 text-sm font-medium">
                            {pool.period}
                          </p>
                          <p className="text-xl font-bold">
                            {centsToDisplay(pool.totalUnits)}
                          </p>
                          <p className="text-xs text-muted-foreground">Units</p>
                        </CardContent>
                      </Card>
                    ))
                  )}
                </div>

                <Card>
                  <CardHeader>
                    <CardTitle className="text-base">
                      My Distribution History
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    {royaltyDists.length === 0 ? (
                      <p
                        className="py-6 text-center text-sm text-muted-foreground"
                        data-ocid="royaltydist.empty_state"
                      >
                        No distributions received yet.
                      </p>
                    ) : (
                      <Table data-ocid="royaltydist.table">
                        <TableHeader>
                          <TableRow>
                            <TableHead>Date</TableHead>
                            <TableHead>Pool</TableHead>
                            <TableHead>Amount</TableHead>
                          </TableRow>
                        </TableHeader>
                        <TableBody>
                          {royaltyDists.map((d, i) => (
                            <TableRow
                              key={d.id}
                              data-ocid={`royaltydist.item.${i + 1}`}
                            >
                              <TableCell className="text-sm">
                                {formatTs(d.createdAt)}
                              </TableCell>
                              <TableCell className="text-sm">
                                Pool #{d.sourceId}
                              </TableCell>
                              <TableCell className="font-medium">
                                {centsToDisplay(d.amountUnits)}
                              </TableCell>
                            </TableRow>
                          ))}
                        </TableBody>
                      </Table>
                    )}
                  </CardContent>
                </Card>
              </div>
            </TabsContent>
            {/* LEADERBOARD */}
            <TabsContent value="leaderboard">
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <h3 className="font-display font-semibold text-lg text-foreground">
                    Top Recruiters This Month
                  </h3>
                  <span className="text-sm text-muted-foreground">
                    Period:{" "}
                    {new Date().toLocaleString("default", {
                      month: "long",
                      year: "numeric",
                    })}
                  </span>
                </div>
                <Card className="border-border/60">
                  <CardContent className="p-0">
                    <Table data-ocid="leaderboard.table">
                      <TableHeader>
                        <TableRow className="bg-muted/30">
                          <TableHead className="w-14 text-center">
                            Rank
                          </TableHead>
                          <TableHead>Member</TableHead>
                          <TableHead>Tier</TableHead>
                          <TableHead className="text-right">
                            Referrals
                          </TableHead>
                          <TableHead className="text-right">
                            Total Earned
                          </TableHead>
                        </TableRow>
                      </TableHeader>
                      <TableBody>
                        {[
                          {
                            name: "Sofia A.",
                            tier: "founder" as const,
                            refs: 34,
                            earned: 1840,
                          },
                          {
                            name: "Marcus T.",
                            tier: "ambassador" as const,
                            refs: 28,
                            earned: 1420,
                          },
                          {
                            name: "Priya K.",
                            tier: "ambassador" as const,
                            refs: 22,
                            earned: 1100,
                          },
                          {
                            name: "Jordan L.",
                            tier: "executive" as const,
                            refs: 19,
                            earned: 870,
                          },
                          {
                            name: "Alex M.",
                            tier: "executive" as const,
                            refs: 15,
                            earned: 680,
                          },
                          {
                            name: "Chen W.",
                            tier: "partner" as const,
                            refs: 12,
                            earned: 490,
                          },
                          {
                            name: "Fatima N.",
                            tier: "partner" as const,
                            refs: 10,
                            earned: 390,
                          },
                          {
                            name: "Liam B.",
                            tier: "affiliate" as const,
                            refs: 8,
                            earned: 270,
                          },
                          {
                            name: "Amara S.",
                            tier: "affiliate" as const,
                            refs: 6,
                            earned: 190,
                          },
                          {
                            name: "Ivan P.",
                            tier: "associate" as const,
                            refs: 4,
                            earned: 90,
                          },
                        ].map((entry, i) => (
                          <TableRow
                            key={entry.name}
                            data-ocid={`leaderboard.item.${i + 1}`}
                            className="hover:bg-muted/20"
                          >
                            <TableCell className="text-center">
                              {i === 0 ? (
                                <span className="text-lg">🥇</span>
                              ) : i === 1 ? (
                                <span className="text-lg">🥈</span>
                              ) : i === 2 ? (
                                <span className="text-lg">🥉</span>
                              ) : (
                                <span className="text-muted-foreground font-mono text-sm">
                                  #{i + 1}
                                </span>
                              )}
                            </TableCell>
                            <TableCell>
                              <div className="flex items-center gap-2">
                                <div
                                  className={`w-8 h-8 rounded-full ${TIER_COLORS[entry.tier]} flex items-center justify-center text-white text-xs font-bold`}
                                >
                                  {entry.name.slice(0, 2).toUpperCase()}
                                </div>
                                <span className="font-medium text-sm">
                                  {entry.name}
                                </span>
                              </div>
                            </TableCell>
                            <TableCell>
                              <Badge
                                className={`${TIER_COLORS[entry.tier]} text-white text-xs border-0`}
                              >
                                {TIER_LABELS[entry.tier]}
                              </Badge>
                            </TableCell>
                            <TableCell className="text-right font-semibold">
                              {entry.refs}
                            </TableCell>
                            <TableCell className="text-right font-semibold text-emerald-600">
                              ${entry.earned.toLocaleString()}
                            </TableCell>
                          </TableRow>
                        ))}
                      </TableBody>
                    </Table>
                  </CardContent>
                </Card>
                <p
                  className="text-xs text-center text-muted-foreground py-2"
                  data-ocid="leaderboard.empty_state"
                >
                  Live leaderboard coming soon — rankings update each pay cycle
                </p>
              </div>
            </TabsContent>

            {/* CHALLENGES */}
            <TabsContent value="challenges">
              <div className="space-y-6">
                <div>
                  <h3 className="font-display font-semibold text-lg text-foreground mb-1">
                    Active Bonus Challenges
                  </h3>
                  <p className="text-sm text-muted-foreground">
                    Complete challenges to earn extra bonuses. Challenges reset
                    each calendar month.
                  </p>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {[
                    {
                      name: "Fast Start Bonus",
                      desc: "Recruit 3 new members within your first 14 days on the platform.",
                      reward: "$50 bonus",
                      deadline: "Ends in 14 days",
                      progress: 0,
                      target: 3,
                      icon: "⚡",
                    },
                    {
                      name: "Power Recruiter",
                      desc: "Refer 5 new paying members (Associate tier or above) in a single calendar month.",
                      reward: "2× commission multiplier",
                      deadline: "Ends in 7 days",
                      progress: 0,
                      target: 5,
                      icon: "🚀",
                    },
                    {
                      name: "Volume Builder",
                      desc: "Accumulate $500 in combined downline purchase volume this month.",
                      reward: "$100 bonus",
                      deadline: "Ends in 21 days",
                      progress: 0,
                      target: 500,
                      icon: "📈",
                    },
                    {
                      name: "Team Titan",
                      desc: "Have at least 10 active members in your direct downline by end of month.",
                      reward: "Royalty pool entry",
                      deadline: "Ends in 30 days",
                      progress: 0,
                      target: 10,
                      icon: "👑",
                    },
                  ].map((challenge, i) => (
                    <motion.div
                      key={challenge.name}
                      initial={{ opacity: 0, y: 12 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: i * 0.05 }}
                      data-ocid={`challenges.item.${i + 1}`}
                    >
                      <Card className="border-border/60 h-full hover:shadow-sm transition-shadow">
                        <CardHeader className="pb-3">
                          <div className="flex items-start justify-between gap-2">
                            <div className="flex items-center gap-2">
                              <span className="text-2xl">{challenge.icon}</span>
                              <CardTitle className="text-base font-semibold">
                                {challenge.name}
                              </CardTitle>
                            </div>
                            <Badge className="bg-amber-100 text-amber-800 border-amber-200 text-xs shrink-0">
                              Active
                            </Badge>
                          </div>
                        </CardHeader>
                        <CardContent className="space-y-3">
                          <p className="text-sm text-muted-foreground leading-relaxed">
                            {challenge.desc}
                          </p>
                          <div className="flex items-center justify-between text-xs">
                            <span className="font-semibold text-emerald-600">
                              🎁 {challenge.reward}
                            </span>
                            <span className="text-muted-foreground">
                              {challenge.deadline}
                            </span>
                          </div>
                          <div>
                            <div className="flex justify-between text-xs text-muted-foreground mb-1">
                              <span>Progress</span>
                              <span>
                                {challenge.progress} / {challenge.target}
                              </span>
                            </div>
                            <Progress
                              value={0}
                              className="h-1.5"
                              data-ocid={`challenges.item.${i + 1}`}
                            />
                          </div>
                        </CardContent>
                      </Card>
                    </motion.div>
                  ))}
                </div>

                <div>
                  <h4 className="font-semibold text-sm text-muted-foreground uppercase tracking-wide mb-3">
                    Completed Challenges
                  </h4>
                  <div
                    className="rounded-xl border border-dashed border-border/60 py-10 text-center text-sm text-muted-foreground"
                    data-ocid="challenges.empty_state"
                  >
                    No completed challenges yet — complete an active challenge
                    to see it here.
                  </div>
                </div>
              </div>
            </TabsContent>
          </Tabs>
        )}
      </div>
    </div>
  );
}
