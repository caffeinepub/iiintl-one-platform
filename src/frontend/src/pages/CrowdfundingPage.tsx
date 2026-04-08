import {
  CrowdfundingCategory,
  CrowdfundingFundingModel,
  CrowdfundingStatus,
} from "@/backend";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { useAuth } from "@/context/AuthContext";
import { useBackend } from "@/hooks/useBackend";
import type { CrowdfundingCampaign, ExtendedBackend } from "@/types/appTypes";
import { Link } from "@tanstack/react-router";
import { motion } from "motion/react";
import { useEffect, useState } from "react";
import { Layout } from "../components/Layout";

const CATEGORY_LABELS: Record<string, string> = {
  civic: "Civic",
  humanitarian: "Humanitarian",
  education: "Education",
  research: "Research",
  community: "Community",
  youth: "Youth",
  crisisResponse: "Crisis Response",
};

const CATEGORY_COLORS: Record<string, string> = {
  civic: "bg-blue-500/20 text-blue-300 border-blue-500/30",
  humanitarian: "bg-red-500/20 text-red-300 border-red-500/30",
  education: "bg-green-500/20 text-green-300 border-green-500/30",
  research: "bg-purple-500/20 text-purple-300 border-purple-500/30",
  community: "bg-amber-500/20 text-amber-300 border-amber-500/30",
  youth: "bg-pink-500/20 text-pink-300 border-pink-500/30",
  crisisResponse: "bg-orange-500/20 text-orange-300 border-orange-500/30",
};

function getCategoryKey(category: CrowdfundingCampaign["category"]): string {
  return String(category);
}

function getFundingModelKey(
  model: CrowdfundingCampaign["fundingModel"],
): string {
  return String(model);
}

function formatCurrency(cents: bigint, currency = "USD"): string {
  const amount = Number(cents) / 100;
  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency,
    maximumFractionDigits: 0,
  }).format(amount);
}

function getDaysRemaining(deadlineNs: bigint): string {
  const deadlineMs = Number(deadlineNs) / 1_000_000;
  const diff = deadlineMs - Date.now();
  if (diff <= 0) return "Ended";
  const days = Math.ceil(diff / (1000 * 60 * 60 * 24));
  return `${days} day${days !== 1 ? "s" : ""} left`;
}

const MOCK_CAMPAIGNS: CrowdfundingCampaign[] = [
  {
    id: "mock-1",
    creator: { toText: () => "rdmx6-jaaaa-aaaaa-aaadq-cai" } as never,
    tenantId: "platform",
    title: "Global Youth Civic Education Initiative",
    description:
      "Empowering the next generation of civic leaders with digital education tools across 50 countries.",
    category: CrowdfundingCategory.youth,
    fundingModel: CrowdfundingFundingModel.allOrNothing,
    status: CrowdfundingStatus.active,
    goalCents: 5000000n,
    raisedCents: 2750000n,
    backerCount: 143n,
    currency: "USD",
    deadline: BigInt(Date.now() + 14 * 24 * 60 * 60 * 1000) * 1000000n,
    coverImageUrl: "",
    rewardTiers: [],
    milestones: [],
    fsuContributionBps: 500n,
    totalFSUDistributed: 12450n,
    approvedByAdmin: true,
    createdAt: BigInt(Date.now() - 5 * 24 * 60 * 60 * 1000) * 1000000n,
    updatedAt: BigInt(Date.now()) * 1000000n,
  },
  {
    id: "mock-2",
    creator: { toText: () => "rrkah-fqaaa-aaaaa-aaaaq-cai" } as never,
    tenantId: "platform",
    title: "Crisis Response Network Infrastructure",
    description:
      "Building a global rapid-response coordination network for humanitarian crises and emergencies.",
    category: CrowdfundingCategory.crisisResponse,
    fundingModel: CrowdfundingFundingModel.keepWhatYouRaise,
    status: CrowdfundingStatus.active,
    goalCents: 10000000n,
    raisedCents: 8200000n,
    backerCount: 312n,
    currency: "USD",
    deadline: BigInt(Date.now() + 30 * 24 * 60 * 60 * 1000) * 1000000n,
    coverImageUrl: "",
    rewardTiers: [],
    milestones: [],
    fsuContributionBps: 750n,
    totalFSUDistributed: 45800n,
    approvedByAdmin: true,
    createdAt: BigInt(Date.now() - 10 * 24 * 60 * 60 * 1000) * 1000000n,
    updatedAt: BigInt(Date.now()) * 1000000n,
  },
];

const FILTERS = [
  "All",
  "Civic",
  "Humanitarian",
  "Education",
  "Research",
  "Community",
  "Youth",
  "Crisis Response",
] as const;

function CampaignCard({
  campaign,
  index,
}: {
  campaign: CrowdfundingCampaign;
  index: number;
}) {
  const categoryKey = getCategoryKey(campaign.category);
  const modelKey = getFundingModelKey(campaign.fundingModel);
  const pct =
    campaign.goalCents > 0n
      ? Number((campaign.raisedCents * 100n) / campaign.goalCents)
      : 0;
  const barColor =
    pct >= 80 ? "bg-green-500" : pct >= 40 ? "bg-amber-500" : "bg-primary";
  const creatorText =
    typeof campaign.creator === "object" && "toText" in campaign.creator
      ? (campaign.creator as { toText: () => string }).toText()
      : String(campaign.creator);

  return (
    <motion.div
      initial={{ opacity: 0, y: 24 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: index * 0.07, duration: 0.4 }}
    >
      <Card className="overflow-hidden border-border/50 hover:border-primary/40 transition-all duration-200 hover:shadow-lg flex flex-col h-full">
        {/* Cover image / gradient placeholder */}
        <div className="relative h-44 overflow-hidden">
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
                  ? "from-pink-900/60 to-purple-900/60"
                  : categoryKey === "crisisResponse"
                    ? "from-orange-900/60 to-red-900/60"
                    : categoryKey === "humanitarian"
                      ? "from-red-900/60 to-rose-900/60"
                      : categoryKey === "education"
                        ? "from-green-900/60 to-emerald-900/60"
                        : categoryKey === "research"
                          ? "from-purple-900/60 to-indigo-900/60"
                          : categoryKey === "community"
                            ? "from-amber-900/60 to-yellow-900/60"
                            : "from-blue-900/60 to-indigo-900/60"
              } flex items-center justify-center`}
            >
              <span className="text-5xl">
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
          <div className="absolute top-3 left-3 flex gap-2 flex-wrap">
            <span
              className={`text-xs font-medium px-2 py-0.5 rounded-full border ${CATEGORY_COLORS[categoryKey] ?? CATEGORY_COLORS.civic}`}
            >
              {CATEGORY_LABELS[categoryKey]}
            </span>
          </div>
        </div>

        <CardContent className="flex-1 flex flex-col p-4 gap-3">
          <div>
            <h3 className="font-semibold text-foreground text-sm leading-snug line-clamp-2 mb-1">
              {campaign.title}
            </h3>
            <p className="text-xs text-muted-foreground font-mono truncate">
              {creatorText.slice(0, 20)}…
            </p>
          </div>

          {/* Progress bar */}
          <div>
            <div className="flex justify-between text-xs mb-1">
              <span className="text-muted-foreground font-medium">
                {Math.min(pct, 100)}% funded
              </span>
              <span className="text-muted-foreground">
                {campaign.backerCount.toString()} backers
              </span>
            </div>
            <div className="h-1.5 bg-muted rounded-full overflow-hidden">
              <div
                className={`h-full rounded-full transition-all ${barColor}`}
                style={{ width: `${Math.min(pct, 100)}%` }}
              />
            </div>
          </div>

          <div className="flex items-center justify-between text-xs text-muted-foreground">
            <span className="font-semibold text-foreground">
              {formatCurrency(campaign.goalCents, campaign.currency)} goal
            </span>
            <span>{getDaysRemaining(campaign.deadline)}</span>
          </div>

          {/* Model + FSU badges */}
          <div className="flex flex-wrap gap-1.5">
            {modelKey === "allOrNothing" ? (
              <Badge
                variant="outline"
                className="text-xs border-amber-500/40 text-amber-300 bg-amber-500/10"
              >
                All-or-Nothing
              </Badge>
            ) : (
              <Badge
                variant="outline"
                className="text-xs border-green-500/40 text-green-300 bg-green-500/10"
              >
                Keep-What-You-Raise
              </Badge>
            )}
            <Badge
              variant="outline"
              className="text-xs border-yellow-500/40 text-yellow-200 bg-yellow-500/10"
            >
              ⚡ {Number(campaign.fsuContributionBps) / 100}% → FSU Pool
            </Badge>
          </div>

          <div className="mt-auto pt-1">
            <Link to="/crowdfunding/$id" params={{ id: campaign.id }}>
              <Button
                size="sm"
                className="w-full"
                data-ocid="crowdfunding.back_btn"
              >
                Back this Campaign
              </Button>
            </Link>
          </div>
        </CardContent>
      </Card>
    </motion.div>
  );
}

export function CrowdfundingPage() {
  const backend = useBackend();
  const { user } = useAuth();
  const [campaigns, setCampaigns] = useState<CrowdfundingCampaign[]>([]);
  const [loading, setLoading] = useState(true);
  const [activeFilter, setActiveFilter] = useState<string>("All");

  useEffect(() => {
    async function load() {
      try {
        if (!backend) throw new Error("no backend");
        const ext = backend as unknown as ExtendedBackend;
        const data = await ext.listCrowdfundingCampaigns();
        setCampaigns(
          data.filter(
            (c) =>
              c.status === CrowdfundingStatus.active ||
              c.status === CrowdfundingStatus.funded,
          ),
        );
      } catch {
        setCampaigns(MOCK_CAMPAIGNS);
      } finally {
        setLoading(false);
      }
    }
    load();
  }, [backend]);

  const filtered = campaigns.filter((c) => {
    if (activeFilter === "All") return true;
    const key = getCategoryKey(c.category);
    return CATEGORY_LABELS[key]?.toLowerCase() === activeFilter.toLowerCase();
  });

  return (
    <Layout>
      <div className="p-6 max-w-7xl mx-auto space-y-6">
        {/* Header */}
        <div className="flex items-start justify-between gap-4 flex-wrap">
          <div>
            <h1 className="text-3xl font-display font-bold text-foreground">
              Crowdfunding
            </h1>
            <p className="text-muted-foreground mt-1">
              Back campaigns powered by FinFracFran™ — every pledge earns you
              FSU shares
            </p>
          </div>
          {user && (
            <Link to="/crowdfunding/create">
              <Button data-ocid="crowdfunding.start_btn">
                + Start a Campaign
              </Button>
            </Link>
          )}
        </div>

        {/* FinFracFran™ banner */}
        <div className="rounded-xl border border-yellow-500/30 bg-gradient-to-r from-yellow-900/20 to-amber-900/20 p-4 flex items-center gap-3">
          <span className="text-2xl">⚡</span>
          <div>
            <span className="text-sm font-semibold text-yellow-200">
              FinFracFran™ Active
            </span>
            <p className="text-xs text-yellow-300/80 mt-0.5">
              Every pledge contributes a percentage to the FSU Pool —
              distributed fractally to all active members of the platform.
            </p>
          </div>
        </div>

        {/* Filter tabs */}
        <div
          className="flex gap-2 flex-wrap"
          data-ocid="crowdfunding.filter_tabs"
        >
          {FILTERS.map((f) => (
            <button
              type="button"
              key={f}
              onClick={() => setActiveFilter(f)}
              className={`px-3 py-1.5 rounded-full text-sm font-medium transition-all ${
                activeFilter === f
                  ? "bg-primary text-primary-foreground"
                  : "bg-muted text-muted-foreground hover:bg-muted/80"
              }`}
            >
              {f}
            </button>
          ))}
        </div>

        {/* Campaign grid */}
        {loading ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {Array.from({ length: 6 }, (_, i) => `skel-${i}`).map((k) => (
              <Skeleton key={k} className="h-96 rounded-xl" />
            ))}
          </div>
        ) : filtered.length === 0 ? (
          <div
            className="flex flex-col items-center justify-center py-24 text-center"
            data-ocid="crowdfunding.empty_state"
          >
            <span className="text-6xl mb-4">🌱</span>
            <h3 className="text-xl font-semibold text-foreground mb-2">
              No active campaigns yet
            </h3>
            <p className="text-muted-foreground mb-6">
              Be the first to launch a campaign powered by FinFracFran™.
            </p>
            {user && (
              <Link to="/crowdfunding/create">
                <Button>Start the First Campaign</Button>
              </Link>
            )}
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {filtered.map((c, i) => (
              <CampaignCard key={c.id} campaign={c} index={i} />
            ))}
          </div>
        )}
      </div>
    </Layout>
  );
}
