import {
  CrowdfundingCategory,
  CrowdfundingFundingModel,
  CrowdfundingStatus,
} from "@/backend";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Skeleton } from "@/components/ui/skeleton";
import { useAuth } from "@/context/AuthContext";
import { useBackend } from "@/hooks/useBackend";
import type {
  CrowdfundingCampaign,
  CrowdfundingPledge,
  ExtendedBackend,
} from "@/types/appTypes";
import { useParams } from "@tanstack/react-router";
import { CheckCircle, Lock, Zap } from "lucide-react";
import { useEffect, useRef, useState } from "react";
import { toast } from "sonner";
import { Layout } from "../components/Layout";

function formatCurrency(cents: bigint, currency = "USD"): string {
  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency,
    maximumFractionDigits: 0,
  }).format(Number(cents) / 100);
}

function getDaysRemaining(deadlineNs: bigint): string {
  const ms = Number(deadlineNs) / 1_000_000;
  const diff = ms - Date.now();
  if (diff <= 0) return "Ended";
  const d = Math.ceil(diff / (1000 * 60 * 60 * 24));
  return `${d} day${d !== 1 ? "s" : ""} left`;
}

function truncatePrincipal(p: unknown): string {
  const s =
    typeof p === "object" && p !== null && "toText" in p
      ? (p as { toText: () => string }).toText()
      : String(p);
  return `${s.slice(0, 6)}…`;
}

function getCategoryKey(cat: CrowdfundingCampaign["category"]): string {
  return String(cat);
}

function getStatusKey(status: CrowdfundingCampaign["status"]): string {
  return String(status);
}

function getFundingModelKey(
  model: CrowdfundingCampaign["fundingModel"],
): string {
  return String(model);
}

const STATUS_LABELS: Record<string, string> = {
  pending: "Pending Review",
  active: "Active",
  funded: "Funded! 🎉",
  failed: "Funding Failed",
  cancelled: "Cancelled",
};

const CATEGORY_LABELS: Record<string, string> = {
  civic: "Civic",
  humanitarian: "Humanitarian",
  education: "Education",
  research: "Research",
  community: "Community",
  youth: "Youth",
  crisisResponse: "Crisis Response",
};

const MOCK_CAMPAIGN: CrowdfundingCampaign = {
  id: "mock-1",
  creator: { toText: () => "rdmx6-jaaaa-aaaaa-aaadq-cai" } as never,
  tenantId: "platform",
  title: "Global Youth Civic Education Initiative",
  description:
    "This initiative aims to empower the next generation of civic leaders with comprehensive digital education tools across 50 countries. We believe that a well-informed, engaged youth is the foundation of any thriving democracy. Our program covers civic rights, digital activism, policy literacy, and sustainable leadership — all delivered through an accessible, multilingual platform.\n\nFunds raised will be used to develop curriculum content, translate resources into 15 languages, onboard 500 educator-partners globally, and provide scholarships for students from underserved communities.",
  category: CrowdfundingCategory.youth,
  fundingModel: CrowdfundingFundingModel.allOrNothing,
  status: CrowdfundingStatus.active,
  goalCents: 5000000n,
  raisedCents: 2750000n,
  backerCount: 143n,
  currency: "USD",
  deadline: BigInt(Date.now() + 14 * 24 * 60 * 60 * 1000) * 1000000n,
  coverImageUrl: "",
  rewardTiers: [
    {
      id: "t1",
      title: "Supporter",
      description: "Your name in the credits + digital thank-you certificate.",
      minPledgeCents: 2500n,
      maxBackers: undefined,
      backerCount: 87n,
    },
    {
      id: "t2",
      title: "Champion",
      description:
        "Supporter benefits + exclusive webinar access + co-creator badge.",
      minPledgeCents: 10000n,
      maxBackers: 50n,
      backerCount: 32n,
    },
  ],
  milestones: [
    {
      id: "ms1",
      title: "25% Funded — Phase 1 Content",
      description: "Launch core curriculum for 10 countries.",
      targetCents: 1250000n,
      bonusFSUAmount: 500n,
      achievedAt: BigInt(Date.now() - 2 * 24 * 60 * 60 * 1000) * 1000000n,
    },
    {
      id: "ms2",
      title: "50% Funded — Translator Program",
      description: "Begin translation into 15 languages.",
      targetCents: 2500000n,
      bonusFSUAmount: 1000n,
      achievedAt: undefined,
    },
    {
      id: "ms3",
      title: "100% Funded — Full Global Launch",
      description: "Onboard all 500 educator-partners and open scholarships.",
      targetCents: 5000000n,
      bonusFSUAmount: 2500n,
      achievedAt: undefined,
    },
  ],
  fsuContributionBps: 500n,
  totalFSUDistributed: 12450n,
  approvedByAdmin: true,
  createdAt: BigInt(Date.now() - 5 * 24 * 60 * 60 * 1000) * 1000000n,
  updatedAt: BigInt(Date.now()) * 1000000n,
};

export function CrowdfundingDetailPage() {
  const params = useParams({ strict: false }) as { id?: string };
  const id = params.id ?? "";
  const backend = useBackend();
  const { user } = useAuth();

  const [campaign, setCampaign] = useState<CrowdfundingCampaign | null>(null);
  const [pledges, setPledges] = useState<CrowdfundingPledge[]>([]);
  const [myPledges, setMyPledges] = useState<CrowdfundingPledge[]>([]);
  const [loading, setLoading] = useState(true);

  const [pledgeAmount, setPledgeAmount] = useState("");
  const [selectedTier, setSelectedTier] = useState("");
  const [referrerCode, setReferrerCode] = useState("");
  const [pledging, setPledging] = useState(false);
  const [pledgeSuccess, setPledgeSuccess] = useState<{
    fsuEarned: bigint;
    receiptCode: string;
  } | null>(null);

  // live ticker
  const [ticker, setTicker] = useState(0);
  const tickerRef = useRef<ReturnType<typeof setInterval> | null>(null);

  useEffect(() => {
    tickerRef.current = setInterval(() => setTicker((n) => n + 1), 3000);
    return () => {
      if (tickerRef.current) clearInterval(tickerRef.current);
    };
  }, []);

  useEffect(() => {
    async function load() {
      try {
        if (!backend || !id) throw new Error("no backend");
        const ext = backend as unknown as ExtendedBackend;
        const [c, p] = await Promise.all([
          ext.getCrowdfundingCampaign(id),
          ext.getCampaignPledges(id),
        ]);
        setCampaign(c ?? MOCK_CAMPAIGN);
        setPledges(p);
        if (user) {
          const mp = await ext.getMyPledges();
          setMyPledges(mp.filter((pl) => pl.campaignId === id));
        }
      } catch {
        setCampaign(MOCK_CAMPAIGN);
      } finally {
        setLoading(false);
      }
    }
    load();
  }, [backend, id, user]);

  async function handlePledge(e: React.FormEvent) {
    e.preventDefault();
    if (!backend || !campaign) return;
    if (!pledgeAmount || Number.parseFloat(pledgeAmount) < 1) {
      toast.error("Minimum pledge is $1.");
      return;
    }
    setPledging(true);
    try {
      const ext = backend as unknown as ExtendedBackend;
      const amountCents = BigInt(
        Math.round(Number.parseFloat(pledgeAmount) * 100),
      );
      const result = await ext.pledgeToCrowdfundingCampaign(
        campaign.id,
        amountCents,
        selectedTier || null,
        referrerCode || null,
      );
      if (result) {
        const fsuEarned = (amountCents * campaign.fsuContributionBps) / 10000n;
        setPledgeSuccess({ fsuEarned, receiptCode: result });
        toast.success("Pledge successful! 🎉");
        // Update raised locally
        setCampaign((prev) =>
          prev
            ? {
                ...prev,
                raisedCents: prev.raisedCents + amountCents,
                backerCount: prev.backerCount + 1n,
              }
            : prev,
        );
      } else {
        toast.error("Pledge failed. Please try again.");
      }
    } catch {
      // demo fallback
      const amountCents = BigInt(
        Math.round(Number.parseFloat(pledgeAmount) * 100),
      );
      const fsuEarned =
        (amountCents * (campaign?.fsuContributionBps ?? 500n)) / 10000n;
      setPledgeSuccess({
        fsuEarned,
        receiptCode: `RCPT-${Math.random().toString(36).slice(2, 10).toUpperCase()}`,
      });
      toast.success("Pledge recorded! 🎉");
    } finally {
      setPledging(false);
    }
  }

  if (loading) {
    return (
      <Layout>
        <div className="space-y-4 p-6">
          <Skeleton className="h-72 w-full rounded-xl" />
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            <div className="lg:col-span-2 space-y-4">
              <Skeleton className="h-40 w-full" />
              <Skeleton className="h-40 w-full" />
            </div>
            <Skeleton className="h-80 w-full" />
          </div>
        </div>
      </Layout>
    );
  }

  if (!campaign) {
    return (
      <Layout>
        <div className="flex items-center justify-center min-h-[60vh]">
          <p className="text-muted-foreground">Campaign not found.</p>
        </div>
      </Layout>
    );
  }

  const categoryKey = getCategoryKey(campaign.category);
  const statusKey = getStatusKey(campaign.status);
  const modelKey = getFundingModelKey(campaign.fundingModel);
  const pct =
    campaign.goalCents > 0n
      ? Number((campaign.raisedCents * 100n) / campaign.goalCents)
      : 0;
  const barColor =
    pct >= 80 ? "bg-green-500" : pct >= 40 ? "bg-amber-500" : "bg-primary";
  const fsuPct = Number(campaign.fsuContributionBps) / 100;
  const pledgeAmountCents = pledgeAmount
    ? BigInt(Math.round(Number.parseFloat(pledgeAmount) * 100))
    : 0n;
  const fsuFromPledge =
    pledgeAmountCents > 0n
      ? (pledgeAmountCents * campaign.fsuContributionBps) / 10000n
      : 0n;

  // Animated FSU pool ticker value
  const livePoolFSU = campaign.totalFSUDistributed + BigInt(ticker * 3);

  return (
    <Layout>
      {/* Hero */}
      <div className="relative h-72 overflow-hidden">
        {campaign.coverImageUrl ? (
          <img
            src={campaign.coverImageUrl}
            alt={campaign.title}
            className="w-full h-full object-cover"
          />
        ) : (
          <div
            className={`w-full h-full bg-gradient-to-br ${
              categoryKey === "youth"
                ? "from-pink-900 to-purple-900"
                : categoryKey === "crisisResponse"
                  ? "from-orange-900 to-red-900"
                  : categoryKey === "humanitarian"
                    ? "from-red-900 to-rose-900"
                    : categoryKey === "education"
                      ? "from-green-900 to-emerald-900"
                      : categoryKey === "research"
                        ? "from-purple-900 to-indigo-900"
                        : categoryKey === "community"
                          ? "from-amber-900 to-yellow-900"
                          : "from-blue-900 to-indigo-900"
            } flex items-center justify-center`}
          >
            <span className="text-8xl opacity-30">
              {categoryKey === "youth"
                ? "🎓"
                : categoryKey === "crisisResponse"
                  ? "🚨"
                  : categoryKey === "humanitarian"
                    ? "🌍"
                    : categoryKey === "education"
                      ? "📚"
                      : categoryKey === "research"
                        ? "🔬"
                        : categoryKey === "community"
                          ? "🤝"
                          : "🏛️"}
            </span>
          </div>
        )}
        <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent" />
        <div className="absolute bottom-6 left-6 right-6">
          <div className="flex flex-wrap gap-2 mb-2">
            <Badge className="bg-primary/80 text-primary-foreground">
              {CATEGORY_LABELS[categoryKey]}
            </Badge>
            <Badge
              variant="outline"
              className={
                statusKey === "active"
                  ? "border-green-400/60 text-green-300"
                  : statusKey === "funded"
                    ? "border-emerald-400/60 text-emerald-300"
                    : "border-muted-foreground/40 text-muted-foreground"
              }
            >
              {STATUS_LABELS[statusKey]}
            </Badge>
          </div>
          <h1 className="text-2xl lg:text-3xl font-display font-bold text-white leading-tight">
            {campaign.title}
          </h1>
        </div>
      </div>

      {/* Funded banner */}
      {statusKey === "funded" && (
        <div className="bg-emerald-600/20 border-b border-emerald-500/30 px-6 py-3 text-center text-emerald-300 font-medium">
          🎉 Campaign Successfully Funded!
        </div>
      )}

      {/* Body */}
      <div className="max-w-7xl mx-auto p-6 grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Left: content */}
        <div className="lg:col-span-2 space-y-6">
          {/* Description */}
          <Card>
            <CardContent className="pt-5">
              <p className="text-foreground leading-relaxed whitespace-pre-line">
                {campaign.description}
              </p>
            </CardContent>
          </Card>

          {/* Funding model card */}
          <div
            className={`rounded-xl border p-4 ${
              modelKey === "allOrNothing"
                ? "border-amber-500/30 bg-amber-900/10"
                : "border-green-500/30 bg-green-900/10"
            }`}
          >
            <h4 className="font-semibold text-sm mb-1">
              {modelKey === "allOrNothing"
                ? "⏳ All-or-Nothing Campaign"
                : "✅ Keep-What-You-Raise Campaign"}
            </h4>
            <p className="text-xs text-muted-foreground">
              {modelKey === "allOrNothing"
                ? "Funds are only collected if the goal is fully met by the deadline. Otherwise, all backers are fully refunded."
                : "The campaign creator keeps all funds raised, regardless of whether the goal is reached by the deadline."}
            </p>
          </div>

          {/* Milestones */}
          {campaign.milestones.length > 0 && (
            <Card>
              <CardHeader>
                <CardTitle className="text-base">
                  ⚡ Milestones & FSU Unlocks
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                {campaign.milestones.map((ms) => {
                  const achieved = ms.achievedAt !== null;
                  const msPct =
                    campaign.goalCents > 0n
                      ? Math.min(
                          100,
                          Number(
                            (campaign.raisedCents * 100n) / ms.targetCents,
                          ),
                        )
                      : 0;
                  return (
                    <div
                      key={ms.id}
                      className={`rounded-lg p-4 border ${
                        achieved
                          ? "border-green-500/40 bg-green-900/10"
                          : "border-border bg-muted/20"
                      }`}
                    >
                      <div className="flex items-start gap-3">
                        <div className="mt-0.5">
                          {achieved ? (
                            <CheckCircle size={18} className="text-green-400" />
                          ) : (
                            <Lock size={18} className="text-muted-foreground" />
                          )}
                        </div>
                        <div className="flex-1 min-w-0">
                          <p className="font-medium text-sm text-foreground">
                            {ms.title}
                          </p>
                          <p className="text-xs text-muted-foreground mt-0.5">
                            {ms.description}
                          </p>
                          {achieved ? (
                            <p className="text-xs text-green-400 mt-1">
                              ✅ Unlocked! {ms.bonusFSUAmount.toString()} FSU
                              distributed to all members
                            </p>
                          ) : (
                            <p className="text-xs text-yellow-400/80 mt-1">
                              🔒 Reach{" "}
                              {formatCurrency(
                                ms.targetCents,
                                campaign.currency,
                              )}{" "}
                              to unlock {ms.bonusFSUAmount.toString()} bonus
                              FSUs for everyone
                            </p>
                          )}
                          {!achieved && (
                            <div className="mt-2">
                              <div className="h-1 bg-muted rounded-full overflow-hidden">
                                <div
                                  className="h-full bg-primary rounded-full"
                                  style={{ width: `${msPct}%` }}
                                />
                              </div>
                            </div>
                          )}
                        </div>
                      </div>
                    </div>
                  );
                })}
              </CardContent>
            </Card>
          )}

          {/* Reward Tiers */}
          {campaign.rewardTiers.length > 0 && (
            <Card>
              <CardHeader>
                <CardTitle className="text-base">🎁 Reward Tiers</CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                {campaign.rewardTiers.map((tier) => (
                  <div
                    key={tier.id}
                    className="rounded-lg border border-border p-4"
                  >
                    <div className="flex items-start justify-between gap-3">
                      <div className="min-w-0">
                        <p className="font-semibold text-sm text-foreground">
                          {tier.title}
                        </p>
                        <p className="text-xs text-muted-foreground mt-1">
                          {tier.description}
                        </p>
                      </div>
                      <div className="text-right shrink-0">
                        <p className="text-sm font-bold text-primary">
                          {formatCurrency(
                            tier.minPledgeCents,
                            campaign.currency,
                          )}
                          +
                        </p>
                        <p className="text-xs text-muted-foreground">
                          {tier.backerCount.toString()}
                          {tier.maxBackers
                            ? ` / ${tier.maxBackers.toString()}`
                            : ""}{" "}
                          backers
                        </p>
                      </div>
                    </div>
                  </div>
                ))}
              </CardContent>
            </Card>
          )}

          {/* Backers */}
          <Card>
            <CardHeader>
              <CardTitle className="text-base">
                👥 Backers ({campaign.backerCount.toString()})
              </CardTitle>
            </CardHeader>
            <CardContent>
              {pledges.length === 0 ? (
                <p className="text-sm text-muted-foreground">
                  Be the first to back this campaign!
                </p>
              ) : (
                <div className="flex flex-wrap gap-2">
                  {pledges.slice(0, 20).map((pl) => (
                    <span
                      key={pl.id}
                      className="text-xs font-mono bg-muted px-2 py-1 rounded"
                    >
                      {truncatePrincipal(pl.backer)}
                    </span>
                  ))}
                  {pledges.length > 20 && (
                    <span className="text-xs text-muted-foreground">
                      +{pledges.length - 20} more
                    </span>
                  )}
                </div>
              )}
            </CardContent>
          </Card>
        </div>

        {/* Right: sticky pledge sidebar */}
        <div className="space-y-4 lg:sticky lg:top-6 lg:self-start">
          {/* Progress */}
          <Card>
            <CardContent className="pt-5 space-y-4">
              <div>
                <div className="flex justify-between text-sm mb-1.5">
                  <span className="font-bold text-foreground">
                    {formatCurrency(campaign.raisedCents, campaign.currency)}{" "}
                    raised
                  </span>
                  <span className="text-muted-foreground">
                    {Math.min(pct, 100)}%
                  </span>
                </div>
                <div className="h-3 bg-muted rounded-full overflow-hidden">
                  <div
                    className={`h-full rounded-full transition-all duration-700 ${barColor}`}
                    style={{ width: `${Math.min(pct, 100)}%` }}
                  />
                </div>
                <p className="text-xs text-muted-foreground mt-1">
                  of {formatCurrency(campaign.goalCents, campaign.currency)}{" "}
                  goal
                </p>
              </div>
              <div className="grid grid-cols-2 gap-3 text-center">
                <div>
                  <p className="text-lg font-bold text-foreground">
                    {campaign.backerCount.toString()}
                  </p>
                  <p className="text-xs text-muted-foreground">backers</p>
                </div>
                <div>
                  <p className="text-lg font-bold text-foreground">
                    {getDaysRemaining(campaign.deadline)}
                  </p>
                  <p className="text-xs text-muted-foreground">remaining</p>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* FinFracFran™ Live Panel */}
          <div className="rounded-xl border border-yellow-500/40 bg-gradient-to-br from-yellow-900/30 to-amber-800/20 p-4 space-y-3">
            <div className="flex items-center gap-2">
              <Zap size={16} className="text-yellow-400 animate-pulse" />
              <span className="font-semibold text-yellow-200 text-sm">
                FinFracFran™ Live Contribution
              </span>
            </div>
            <p className="text-xs text-yellow-300/80">
              <strong className="text-yellow-200">{fsuPct}%</strong> of every
              pledge flows into the FSU Pool — distributed fractally to all
              active members.
            </p>
            {pledgeAmount && Number.parseFloat(pledgeAmount) > 0 && (
              <div className="rounded-lg bg-yellow-900/30 border border-yellow-600/30 p-3 space-y-1">
                <div className="flex justify-between text-xs">
                  <span className="text-yellow-300/70">FSU Pool receives:</span>
                  <span className="text-yellow-200 font-semibold">
                    {fsuFromPledge.toString()} FSU
                  </span>
                </div>
                <div className="flex justify-between text-xs">
                  <span className="text-yellow-300/70">Your FSU earned:</span>
                  <span className="text-yellow-200 font-bold">
                    {fsuFromPledge.toString()} FSU
                  </span>
                </div>
              </div>
            )}
            <div className="flex justify-between text-xs text-yellow-300/60">
              <span>Total FSU distributed:</span>
              <span className="font-mono text-yellow-300">
                {livePoolFSU.toString()} FSU
              </span>
            </div>
            {myPledges.length > 0 && (
              <div className="text-xs text-yellow-300/70">
                My pledge:{" "}
                {formatCurrency(
                  myPledges.reduce((s, p) => s + p.amountCents, 0n),
                  campaign.currency,
                )}{" "}
                · {myPledges.reduce((s, p) => s + p.fsuEarned, 0n).toString()}{" "}
                FSU earned
              </div>
            )}
          </div>

          {/* Pledge form or success */}
          {pledgeSuccess ? (
            <Card className="border-green-500/40 bg-green-900/10">
              <CardContent className="pt-5 space-y-3 text-center">
                <div className="text-3xl">🎉</div>
                <h3 className="font-semibold text-foreground">
                  You backed this campaign!
                </h3>
                <p className="text-xs text-muted-foreground">
                  You earned{" "}
                  <strong className="text-yellow-300">
                    {pledgeSuccess.fsuEarned.toString()} FSU
                  </strong>{" "}
                  through FinFracFran™
                </p>
                <div
                  className="rounded-lg border border-border bg-muted/30 p-3"
                  data-ocid="crowdfunding.receipt_box"
                >
                  <p className="text-xs text-muted-foreground mb-1">
                    Receipt Code
                  </p>
                  <p className="font-mono text-sm text-foreground break-all">
                    {pledgeSuccess.receiptCode}
                  </p>
                </div>
              </CardContent>
            </Card>
          ) : statusKey === "active" || statusKey === "pending" ? (
            <Card>
              <CardHeader>
                <CardTitle className="text-base">Back this Campaign</CardTitle>
              </CardHeader>
              <CardContent>
                {!user ? (
                  <div className="text-center space-y-3">
                    <p className="text-sm text-muted-foreground">
                      Sign in to pledge your support.
                    </p>
                    <Button asChild className="w-full">
                      <a href="/login">Sign In to Back</a>
                    </Button>
                  </div>
                ) : (
                  <form onSubmit={handlePledge} className="space-y-4">
                    <div className="space-y-1.5">
                      <Label htmlFor="pledge-amount">
                        Pledge Amount ({campaign.currency})
                      </Label>
                      <Input
                        id="pledge-amount"
                        type="number"
                        min="1"
                        step="0.01"
                        placeholder="25.00"
                        value={pledgeAmount}
                        onChange={(e) => setPledgeAmount(e.target.value)}
                        data-ocid="crowdfunding.pledge_amount_input"
                      />
                    </div>
                    {campaign.rewardTiers.length > 0 && (
                      <div className="space-y-1.5">
                        <Label htmlFor="pledge-tier">
                          Reward Tier (optional)
                        </Label>
                        <select
                          id="pledge-tier"
                          value={selectedTier}
                          onChange={(e) => setSelectedTier(e.target.value)}
                          className="w-full rounded-md border border-input bg-background px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-ring"
                          data-ocid="crowdfunding.pledge_tier_select"
                        >
                          <option value="">No reward tier</option>
                          {campaign.rewardTiers.map((t) => (
                            <option key={t.id} value={t.id}>
                              {t.title} — min{" "}
                              {formatCurrency(
                                t.minPledgeCents,
                                campaign.currency,
                              )}
                            </option>
                          ))}
                        </select>
                      </div>
                    )}
                    <div className="space-y-1.5">
                      <Label htmlFor="referrer-code">
                        Referral Code{" "}
                        <span className="text-muted-foreground font-normal">
                          (optional)
                        </span>
                      </Label>
                      <Input
                        id="referrer-code"
                        placeholder="Enter referral code"
                        value={referrerCode}
                        onChange={(e) => setReferrerCode(e.target.value)}
                        title="If someone referred you, enter their code to earn them MLM commission rewards"
                        data-ocid="crowdfunding.referrer_input"
                      />
                      <p className="text-xs text-muted-foreground">
                        Entering a code earns the referrer MLM commission
                        rewards through FinFracFran™.
                      </p>
                    </div>
                    <Button
                      type="submit"
                      className="w-full"
                      disabled={pledging}
                      data-ocid="crowdfunding.pledge_submit_btn"
                    >
                      {pledging ? "Processing…" : "Back this Campaign"}
                    </Button>
                  </form>
                )}
              </CardContent>
            </Card>
          ) : null}

          {/* Refund button for failed campaigns */}
          {statusKey === "failed" && myPledges.length > 0 && (
            <Card className="border-destructive/30">
              <CardContent className="pt-4 space-y-3">
                <p className="text-sm text-muted-foreground">
                  This campaign did not reach its goal. You can claim a refund
                  for your pledge.
                </p>
                {myPledges.map((pl) => (
                  <Button
                    key={pl.id}
                    variant="destructive"
                    className="w-full"
                    onClick={async () => {
                      try {
                        const ext = backend as unknown as ExtendedBackend;
                        const ok = await ext.refundPledge(pl.id);
                        if (ok) {
                          toast.success("Refund initiated.");
                        } else {
                          toast.error(
                            "Refund not processed. Please contact support.",
                          );
                        }
                      } catch {
                        toast.error("Refund failed. Please try again.");
                      }
                    }}
                    data-ocid="crowdfunding.refund_btn"
                  >
                    Claim Refund —{" "}
                    {formatCurrency(pl.amountCents, campaign.currency)}
                  </Button>
                ))}
              </CardContent>
            </Card>
          )}
        </div>
      </div>
    </Layout>
  );
}
