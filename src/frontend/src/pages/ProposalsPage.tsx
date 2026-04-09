import {
  type Proposal,
  ProposalStatus,
  ProposalType,
  VotingMechanism,
} from "@/backend";
import { Layout } from "@/components/Layout";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Skeleton } from "@/components/ui/skeleton";
import { useAuth } from "@/context/AuthContext";
import { useBackend } from "@/hooks/useBackend";
import { cn } from "@/lib/utils";
import { Link } from "@tanstack/react-router";
import {
  CheckCircle2,
  Clock,
  FileText,
  Info,
  LogIn,
  Plus,
  Scale,
  Search,
  Vote,
} from "lucide-react";
import type { Variants } from "motion/react";
import { motion } from "motion/react";
import { useEffect, useState } from "react";

const containerVariants: Variants = {
  hidden: { opacity: 0 },
  visible: { opacity: 1, transition: { staggerChildren: 0.06 } },
};

const itemVariants: Variants = {
  hidden: { opacity: 0, y: 18 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.3 } },
};

// ── Label / Color maps ──────────────────────────────────────────────────────
const TYPE_LABELS: Record<string, string> = {
  policy: "Policy",
  resolution: "Resolution",
  budget: "Budget",
  amendment: "Amendment",
  communityInitiative: "Community Initiative",
};

const TYPE_COLORS: Record<string, string> = {
  policy: "bg-blue-500/15 text-blue-400 border-blue-500/30",
  resolution: "bg-purple-500/15 text-purple-400 border-purple-500/30",
  budget: "bg-emerald-500/15 text-emerald-400 border-emerald-500/30",
  amendment: "bg-amber-500/15 text-amber-400 border-amber-500/30",
  communityInitiative: "bg-cyan-500/15 text-cyan-400 border-cyan-500/30",
};

const STATUS_LABELS: Record<string, string> = {
  draft: "Draft",
  review: "In Review",
  openVote: "Open Vote",
  closed: "Closed",
  enacted: "Enacted",
  rejected: "Rejected",
  cancelled: "Cancelled",
};

const STATUS_COLORS: Record<string, string> = {
  draft: "bg-slate-500/15 text-slate-400 border-slate-500/30",
  review: "bg-blue-500/15 text-blue-400 border-blue-500/30",
  openVote: "bg-emerald-500/15 text-emerald-400 border-emerald-500/30",
  closed: "bg-orange-500/15 text-orange-400 border-orange-500/30",
  enacted: "bg-green-500/15 text-green-400 border-green-500/30",
  rejected: "bg-red-500/15 text-red-400 border-red-500/30",
  cancelled: "bg-muted text-muted-foreground border-border",
};

const MECHANISM_LABELS: Record<string, string> = {
  simpleMajority: "Simple Majority",
  supermajority66: "Supermajority 2/3",
  supermajority75: "Supermajority 3/4",
  rankedChoice: "Ranked Choice",
  liquidDelegation: "Liquid Delegation",
};

// ── Mock data ─────────────────────────────────────────────────────────────────
const MOCK_PROPOSALS: Proposal[] = [
  {
    id: 1n,
    status: ProposalStatus.openVote,
    proposalType: ProposalType.policy,
    mechanism: VotingMechanism.simpleMajority,
    title: "Adopt Global Civic Education Framework",
    description:
      "A comprehensive policy to integrate civic education across all member organizations, fostering democratic participation worldwide.",
    proposer: { toText: () => "rdmx6-jaaaa-aaaaa-aaadq-cai" } as never,
    sponsors: [],
    sponsorThreshold: 5n,
    quorumPercent: 20n,
    voteWindowHours: 168n,
    tenantId: "platform",
    tags: ["education", "civic"],
    createdAt: BigInt(Date.now() - 3 * 86400000) * 1000000n,
    updatedAt: BigInt(Date.now()) * 1000000n,
    votingOpensAt: BigInt(Date.now() - 86400000) * 1000000n,
    votingClosesAt: BigInt(Date.now() + 6 * 86400000) * 1000000n,
  },
  {
    id: 2n,
    status: ProposalStatus.review,
    proposalType: ProposalType.resolution,
    mechanism: VotingMechanism.supermajority66,
    title: "Resolution on Digital Sovereignty for Member States",
    description:
      "Formal resolution affirming the right of member organizations to maintain digital sovereignty and data ownership.",
    proposer: { toText: () => "rrkah-fqaaa-aaaaa-aaaaq-cai" } as never,
    sponsors: [],
    sponsorThreshold: 5n,
    quorumPercent: 33n,
    voteWindowHours: 72n,
    tenantId: "platform",
    tags: ["digital-rights", "sovereignty"],
    createdAt: BigInt(Date.now() - 7 * 86400000) * 1000000n,
    updatedAt: BigInt(Date.now()) * 1000000n,
  },
  {
    id: 3n,
    status: ProposalStatus.enacted,
    proposalType: ProposalType.budget,
    mechanism: VotingMechanism.supermajority75,
    title: "2026 Platform Infrastructure Budget Allocation",
    description:
      "Approval of Q1 2026 budget for platform infrastructure, development, and community initiatives totalling $2.4M.",
    proposer: { toText: () => "aaaaa-aa" } as never,
    sponsors: [],
    sponsorThreshold: 5n,
    quorumPercent: 40n,
    voteWindowHours: 120n,
    tenantId: "platform",
    tags: ["budget", "infrastructure"],
    createdAt: BigInt(Date.now() - 30 * 86400000) * 1000000n,
    updatedAt: BigInt(Date.now()) * 1000000n,
    enactedAt: BigInt(Date.now() - 5 * 86400000) * 1000000n,
  },
  {
    id: 4n,
    status: ProposalStatus.draft,
    proposalType: ProposalType.amendment,
    mechanism: VotingMechanism.rankedChoice,
    title: "Amendment to Membership Tier Eligibility Criteria",
    description:
      "Proposed changes to the requirements for advancing from Associate to Partner tier, lowering the referral threshold.",
    proposer: { toText: () => "qaa6y-5yaaa-aaaaa-aaafa-cai" } as never,
    sponsors: [],
    sponsorThreshold: 5n,
    quorumPercent: 25n,
    voteWindowHours: 96n,
    tenantId: "platform",
    tags: ["membership", "tiers"],
    createdAt: BigInt(Date.now() - 2 * 86400000) * 1000000n,
    updatedAt: BigInt(Date.now()) * 1000000n,
  },
  {
    id: 5n,
    status: ProposalStatus.closed,
    proposalType: ProposalType.communityInitiative,
    mechanism: VotingMechanism.liquidDelegation,
    title: "Launch Youth Civic Leadership Program",
    description:
      "Community initiative to establish a global mentorship program connecting experienced civic leaders with youth members aged 16-25.",
    proposer: { toText: () => "renrk-eyaaa-aaaaa-aaada-cai" } as never,
    sponsors: [],
    sponsorThreshold: 3n,
    quorumPercent: 15n,
    voteWindowHours: 48n,
    tenantId: "platform",
    tags: ["youth", "mentorship"],
    createdAt: BigInt(Date.now() - 14 * 86400000) * 1000000n,
    updatedAt: BigInt(Date.now()) * 1000000n,
  },
];

// ── Status filter tabs ────────────────────────────────────────────────────────
const STATUS_TABS = [
  { key: "all", label: "All" },
  { key: ProposalStatus.openVote, label: "Open Vote" },
  { key: ProposalStatus.review, label: "In Review" },
  { key: ProposalStatus.enacted, label: "Enacted" },
  { key: ProposalStatus.closed, label: "Closed" },
  { key: ProposalStatus.draft, label: "Draft" },
] as const;

const TYPE_TABS = [
  { key: "all", label: "All Types" },
  { key: ProposalType.policy, label: "Policy" },
  { key: ProposalType.resolution, label: "Resolution" },
  { key: ProposalType.budget, label: "Budget" },
  { key: ProposalType.amendment, label: "Amendment" },
  { key: ProposalType.communityInitiative, label: "Community" },
] as const;

// ── ProposalCard ──────────────────────────────────────────────────────────────
function ProposalCard({ proposal }: { proposal: Proposal }) {
  const typeKey = String(proposal.proposalType);
  const statusKey = String(proposal.status);
  const mechanismKey = String(proposal.mechanism);
  const proposerText =
    typeof proposal.proposer === "object" && "toText" in proposal.proposer
      ? (proposal.proposer as { toText: () => string }).toText()
      : String(proposal.proposer);
  const shortProposer = `${proposerText.slice(0, 8)}…`;
  const isOpen = statusKey === "openVote";
  const deadlineDays =
    isOpen && proposal.votingClosesAt
      ? Math.max(
          0,
          Math.ceil(
            (Number(proposal.votingClosesAt) / 1_000_000 - Date.now()) /
              86400000,
          ),
        )
      : null;

  return (
    <motion.div variants={itemVariants} className="h-full">
      <Card className="flex flex-col h-full border-border/60 hover:border-primary/50 transition-all duration-200 hover:shadow-md">
        <CardContent className="flex flex-col flex-1 p-5 gap-3">
          {/* Badges */}
          <div className="flex flex-wrap gap-1.5">
            <span
              className={cn(
                "text-xs font-medium px-2 py-0.5 rounded-full border",
                TYPE_COLORS[typeKey] ?? TYPE_COLORS.policy,
              )}
            >
              {TYPE_LABELS[typeKey] ?? typeKey}
            </span>
            <span
              className={cn(
                "text-xs font-medium px-2 py-0.5 rounded-full border",
                STATUS_COLORS[statusKey] ?? STATUS_COLORS.draft,
              )}
            >
              {STATUS_LABELS[statusKey] ?? statusKey}
            </span>
          </div>

          {/* Title */}
          <h3 className="font-semibold text-sm leading-snug line-clamp-2 text-foreground">
            {proposal.title}
          </h3>

          {/* Mechanism */}
          <div className="flex items-center gap-1.5 text-xs text-muted-foreground">
            <Vote size={12} />
            <span>{MECHANISM_LABELS[mechanismKey] ?? mechanismKey}</span>
          </div>

          {/* Proposer + sponsors */}
          <div className="flex items-center justify-between text-xs text-muted-foreground">
            <div className="flex items-center gap-1">
              <FileText size={11} />
              <span className="font-mono">{shortProposer}</span>
            </div>
            <span>
              {proposal.sponsors.length}/{Number(proposal.sponsorThreshold)}{" "}
              sponsors
            </span>
          </div>

          {/* Vote window countdown */}
          {isOpen && deadlineDays !== null && (
            <div className="flex items-center gap-1 text-xs font-medium text-emerald-400">
              <Clock size={11} />
              <span>
                {deadlineDays} day{deadlineDays !== 1 ? "s" : ""} remaining
              </span>
            </div>
          )}

          {/* Enacted badge */}
          {statusKey === "enacted" && (
            <div className="flex items-center gap-1 text-xs font-medium text-green-400">
              <CheckCircle2 size={11} />
              <span>Enacted</span>
            </div>
          )}

          {/* CTA */}
          <div className="mt-auto pt-2">
            <Link to="/proposals/$id" params={{ id: String(proposal.id) }}>
              <Button
                size="sm"
                variant={isOpen ? "default" : "outline"}
                className="w-full text-xs"
                data-ocid="proposals.view_details_btn"
              >
                {isOpen ? "View & Vote" : "View Details"}
              </Button>
            </Link>
          </div>
        </CardContent>
      </Card>
    </motion.div>
  );
}

// ── ProposalsPage ─────────────────────────────────────────────────────────────
export function ProposalsPage() {
  const backend = useBackend();
  const { isAuthenticated } = useAuth();
  const [proposals, setProposals] = useState<Proposal[]>([]);
  const [loading, setLoading] = useState(true);
  const [statusFilter, setStatusFilter] = useState<string>("all");
  const [typeFilter, setTypeFilter] = useState<string>("all");
  const [search, setSearch] = useState("");

  useEffect(() => {
    async function load() {
      try {
        if (!backend) throw new Error("no backend");
        // Use public function — works for both authenticated and unauthenticated
        const data = await backend.listProposalsPublic();
        setProposals(data.length > 0 ? data : MOCK_PROPOSALS);
      } catch {
        setProposals(MOCK_PROPOSALS);
      } finally {
        setLoading(false);
      }
    }
    load();
  }, [backend]);

  const filtered = proposals.filter((p) => {
    const sk = String(p.status);
    const tk = String(p.proposalType);
    if (statusFilter !== "all" && sk !== statusFilter) return false;
    if (typeFilter !== "all" && tk !== typeFilter) return false;
    if (
      search &&
      !p.title.toLowerCase().includes(search.toLowerCase()) &&
      !p.description.toLowerCase().includes(search.toLowerCase())
    )
      return false;
    return true;
  });

  return (
    <Layout breadcrumb="Proposals">
      <div className="p-6 max-w-7xl mx-auto space-y-6">
        {/* Header */}
        <div className="flex items-start justify-between gap-4 flex-wrap">
          <div>
            <div className="flex items-center gap-2 mb-1">
              <Scale size={22} className="text-primary" />
              <h1 className="text-3xl font-display font-bold text-foreground">
                Proposals
              </h1>
            </div>
            <p className="text-muted-foreground">
              On-chain democratic governance — propose, debate, and vote on
              collective decisions
            </p>
          </div>
          {isAuthenticated && (
            <Link to="/proposals/create">
              <Button
                className="gap-2"
                data-ocid="proposals.create_proposal_btn"
              >
                <Plus size={16} /> Create Proposal
              </Button>
            </Link>
          )}
        </div>

        {/* Public access callout for unauthenticated visitors */}
        {!isAuthenticated && (
          <div
            className="flex items-center gap-3 p-4 rounded-xl border border-cyan-500/30 bg-cyan-500/5 text-sm"
            data-ocid="proposals.public_access_banner"
          >
            <Info size={16} className="text-cyan-400 flex-shrink-0" />
            <p className="text-cyan-300/90 flex-1">
              You're viewing proposals publicly. Log in to vote, sponsor, or
              create proposals.
            </p>
            <Link to="/login">
              <Button
                size="sm"
                variant="outline"
                className="gap-1.5 text-xs border-cyan-500/40 text-cyan-300 hover:bg-cyan-500/10 flex-shrink-0"
                data-ocid="proposals.login_cta_btn"
              >
                <LogIn size={13} /> Log in
              </Button>
            </Link>
          </div>
        )}

        {/* Search */}
        <div className="relative max-w-sm">
          <Search
            size={15}
            className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground"
          />
          <Input
            placeholder="Search proposals…"
            className="pl-9 h-9 text-sm"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            data-ocid="proposals.search_input"
          />
        </div>

        {/* Status filter tabs */}
        <div
          className="flex gap-2 flex-wrap"
          data-ocid="proposals.status_filter_tabs"
        >
          {STATUS_TABS.map((t) => (
            <button
              type="button"
              key={t.key}
              onClick={() => setStatusFilter(t.key)}
              className={cn(
                "px-3 py-1.5 rounded-full text-sm font-medium transition-all",
                statusFilter === t.key
                  ? "bg-primary text-primary-foreground"
                  : "bg-muted text-muted-foreground hover:bg-muted/80",
              )}
              data-ocid={`proposals.status_tab_${t.key}`}
            >
              {t.label}
            </button>
          ))}
        </div>

        {/* Type filter tabs */}
        <div
          className="flex gap-2 flex-wrap"
          data-ocid="proposals.type_filter_tabs"
        >
          {TYPE_TABS.map((t) => (
            <button
              type="button"
              key={t.key}
              onClick={() => setTypeFilter(t.key)}
              className={cn(
                "px-2.5 py-1 rounded-md text-xs font-medium border transition-all",
                typeFilter === t.key
                  ? "bg-secondary border-primary/40 text-primary"
                  : "border-border text-muted-foreground hover:border-primary/30",
              )}
              data-ocid={`proposals.type_tab_${t.key}`}
            >
              {t.label}
            </button>
          ))}
        </div>

        {/* Grid */}
        {loading ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
            {Array.from({ length: 6 }, (_, i) => `s${i}`).map((k) => (
              <Skeleton key={k} className="h-56 rounded-xl" />
            ))}
          </div>
        ) : filtered.length === 0 ? (
          <div
            className="flex flex-col items-center py-24 text-center gap-4"
            data-ocid="proposals.empty_state"
          >
            <Scale size={48} className="text-muted-foreground/40" />
            <div>
              <h3 className="text-lg font-semibold text-foreground">
                No proposals found
              </h3>
              <p className="text-muted-foreground text-sm mt-1">
                {isAuthenticated
                  ? "Adjust your filters or be the first to create a proposal."
                  : "Adjust your filters or log in to create the first proposal."}
              </p>
            </div>
            {isAuthenticated && (
              <Link to="/proposals/create">
                <Button data-ocid="proposals.empty_create_btn">
                  <Plus size={15} className="mr-1.5" /> Create First Proposal
                </Button>
              </Link>
            )}
            {!isAuthenticated && (
              <Link to="/login">
                <Button
                  variant="outline"
                  className="gap-2"
                  data-ocid="proposals.empty_login_btn"
                >
                  <LogIn size={15} /> Log in to participate
                </Button>
              </Link>
            )}
          </div>
        ) : (
          <motion.div
            variants={containerVariants}
            initial="hidden"
            animate="visible"
            className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5"
          >
            {filtered.map((p) => (
              <ProposalCard key={String(p.id)} proposal={p} />
            ))}
          </motion.div>
        )}
      </div>
    </Layout>
  );
}
