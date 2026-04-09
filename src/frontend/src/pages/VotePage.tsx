import {
  type Proposal,
  ProposalStatus,
  type RankedChoiceEntry,
  VoteChoice,
  type VoteTally,
  VotingMechanism,
} from "@/backend";
import { Layout } from "@/components/Layout";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Skeleton } from "@/components/ui/skeleton";
import { useBackend } from "@/hooks/useBackend";
import { cn } from "@/lib/utils";
import { Link, useNavigate, useParams } from "@tanstack/react-router";
import {
  ArrowDown,
  ArrowLeft,
  ArrowUp,
  CheckCircle2,
  Clock,
  Loader2,
  MinusCircle,
  Scale,
  ThumbsDown,
  ThumbsUp,
  Users,
  Vote,
} from "lucide-react";
import { useEffect, useState } from "react";
import { toast } from "sonner";

// ── Helpers ───────────────────────────────────────────────────────────────────
const MECHANISM_LABELS: Record<string, string> = {
  simpleMajority: "Simple Majority",
  supermajority66: "Supermajority 2/3",
  supermajority75: "Supermajority 3/4",
  rankedChoice: "Ranked Choice",
  liquidDelegation: "Liquid Delegation",
};

function formatCountdown(ns: bigint): string {
  const diff = Number(ns) / 1_000_000 - Date.now();
  if (diff <= 0) return "Voting closed";
  const days = Math.floor(diff / 86400000);
  const hours = Math.floor((diff % 86400000) / 3600000);
  if (days > 0) return `${days}d ${hours}h remaining`;
  const mins = Math.floor((diff % 3600000) / 60000);
  return `${hours}h ${mins}m remaining`;
}

// ── Ranked-choice ordering ────────────────────────────────────────────────────
const RANKED_OPTIONS = ["Yes", "No", "Abstain"];

function RankedChoiceUI({
  order,
  onChange,
}: {
  order: string[];
  onChange: (o: string[]) => void;
}) {
  function move(idx: number, dir: -1 | 1) {
    const next = [...order];
    const target = idx + dir;
    if (target < 0 || target >= next.length) return;
    [next[idx], next[target]] = [next[target], next[idx]];
    onChange(next);
  }

  return (
    <div className="space-y-2" data-ocid="vote.ranked_choice_list">
      <p className="text-sm text-muted-foreground mb-3">
        Arrange your preferences from most (1st) to least preferred. Use the
        arrows to reorder.
      </p>
      {order.map((opt, i) => (
        <div
          key={opt}
          className={cn(
            "flex items-center gap-3 p-4 rounded-xl border-2 transition-all",
            i === 0
              ? "border-emerald-500/50 bg-emerald-500/5"
              : i === 1
                ? "border-primary/40 bg-primary/5"
                : "border-border bg-muted/20",
          )}
          data-ocid={`vote.ranked_item_${i + 1}`}
        >
          <div
            className={cn(
              "w-8 h-8 rounded-full flex items-center justify-center text-sm font-bold flex-shrink-0",
              i === 0
                ? "bg-emerald-500/20 text-emerald-400"
                : i === 1
                  ? "bg-primary/20 text-primary"
                  : "bg-muted text-muted-foreground",
            )}
          >
            {i + 1}
          </div>
          <span className="flex-1 font-medium text-sm text-foreground">
            {opt}
          </span>
          <div className="flex flex-col gap-0.5">
            <button
              type="button"
              onClick={() => move(i, -1)}
              disabled={i === 0}
              className="p-1 rounded hover:bg-muted disabled:opacity-30 transition-colors"
              aria-label="Move up"
              data-ocid={`vote.ranked_up_${i + 1}`}
            >
              <ArrowUp size={14} />
            </button>
            <button
              type="button"
              onClick={() => move(i, 1)}
              disabled={i === order.length - 1}
              className="p-1 rounded hover:bg-muted disabled:opacity-30 transition-colors"
              aria-label="Move down"
              data-ocid={`vote.ranked_down_${i + 1}`}
            >
              <ArrowDown size={14} />
            </button>
          </div>
        </div>
      ))}
    </div>
  );
}

// ── VotePage ──────────────────────────────────────────────────────────────────
export function VotePage() {
  const { id } = useParams({ from: "/vote/$id" });
  const backend = useBackend();
  const navigate = useNavigate();

  const [proposal, setProposal] = useState<Proposal | null>(null);
  const [tally, setTally] = useState<VoteTally | null>(null);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);

  // Simple/super majority vote
  const [choice, setChoice] = useState<VoteChoice | null>(null);

  // Ranked choice
  const [rankedOrder, setRankedOrder] = useState<string[]>([...RANKED_OPTIONS]);

  // Liquid delegation
  const [delegationMode, setDelegationMode] = useState<"self" | "delegate">(
    "self",
  );
  const [delegatePrincipal, setDelegatePrincipal] = useState("");

  // Success state
  const [voted, setVoted] = useState(false);
  const [postTally, setPostTally] = useState<VoteTally | null>(null);

  useEffect(() => {
    async function load() {
      if (!backend) return;
      try {
        const pid = BigInt(id);
        const [p, t] = await Promise.all([
          backend.getProposal(pid),
          backend.getVoteTally(pid),
        ]);
        if (!p) {
          navigate({ to: "/proposals" });
          return;
        }
        if (String(p.status) !== "openVote") {
          toast.error("This proposal is not currently open for voting.");
          navigate({ to: "/proposals/$id", params: { id } });
          return;
        }
        setProposal(p);
        setTally(t);
      } catch {
        toast.error("Failed to load proposal");
        navigate({ to: "/proposals" });
      } finally {
        setLoading(false);
      }
    }
    load();
  }, [backend, id, navigate]);

  async function handleVote() {
    if (!backend || !proposal) return;
    const mechKey = String(proposal.mechanism);
    setSubmitting(true);

    try {
      let res:
        | { __kind__: "ok"; ok: string }
        | { __kind__: "err"; err: string };

      if (mechKey === "liquidDelegation" && delegationMode === "delegate") {
        // Delegate
        if (!delegatePrincipal.trim()) {
          toast.error("Enter a delegate principal ID");
          setSubmitting(false);
          return;
        }
        const { Principal } = await import("@icp-sdk/core/principal");
        let delegatePrinc: import("@icp-sdk/core/principal").Principal;
        try {
          delegatePrinc = Principal.fromText(delegatePrincipal.trim());
        } catch {
          toast.error("Invalid principal ID");
          setSubmitting(false);
          return;
        }
        res = await backend.delegateVote(delegatePrinc, proposal.id);
      } else if (mechKey === "rankedChoice") {
        // Ranked choice — encode as rankedChoices array
        const ranked: RankedChoiceEntry[] = rankedOrder.map((opt, i) => ({
          rank: BigInt(i + 1),
          candidateId: opt.toLowerCase(),
        }));
        res = await backend.castVote(proposal.id, VoteChoice.yes, ranked);
      } else {
        // Simple/supermajority
        if (!choice) {
          toast.error("Please select a vote choice");
          setSubmitting(false);
          return;
        }
        res = await backend.castVote(proposal.id, choice, []);
      }

      if ("ok" in res) {
        const newTally = await backend.getVoteTally(proposal.id);
        setPostTally(newTally);
        setVoted(true);
        toast.success("Your vote has been recorded on-chain!");
      } else {
        toast.error(res.err);
      }
    } catch {
      toast.error("Failed to cast vote. Please try again.");
    } finally {
      setSubmitting(false);
    }
  }

  if (loading) {
    return (
      <Layout breadcrumb="Vote">
        <div className="p-6 max-w-2xl mx-auto space-y-4">
          <Skeleton className="h-8 w-48" />
          <Skeleton className="h-32 rounded-xl" />
          <Skeleton className="h-56 rounded-xl" />
        </div>
      </Layout>
    );
  }

  if (!proposal) return null;

  const mechKey = String(proposal.mechanism);
  const isLiquid = mechKey === "liquidDelegation";
  const isRanked = mechKey === "rankedChoice";
  const isSimple = !isLiquid && !isRanked;

  const deadline = proposal.votingClosesAt;

  // ── Success state ──
  if (voted && postTally) {
    const total =
      Number(postTally.yesVotes) +
      Number(postTally.noVotes) +
      Number(postTally.abstainVotes);
    const yesPct = total > 0 ? (Number(postTally.yesVotes) / total) * 100 : 0;
    const noPct = total > 0 ? (Number(postTally.noVotes) / total) * 100 : 0;

    return (
      <Layout breadcrumb="Vote Recorded">
        <div className="p-6 max-w-2xl mx-auto flex flex-col items-center gap-6 py-16">
          <div className="w-20 h-20 rounded-full bg-emerald-500/15 flex items-center justify-center">
            <CheckCircle2 size={40} className="text-emerald-400" />
          </div>
          <div className="text-center space-y-2">
            <h2 className="text-2xl font-display font-bold text-foreground">
              Vote Recorded!
            </h2>
            <p className="text-muted-foreground">
              Your vote has been permanently recorded on the Internet Computer.
            </p>
          </div>

          {/* Tally summary */}
          <Card className="w-full border-border/60">
            <CardContent className="p-5 space-y-3">
              <p className="text-sm font-semibold text-foreground mb-2">
                Current Tally
              </p>
              <div className="space-y-2">
                {[
                  {
                    label: "Yes",
                    pct: yesPct,
                    count: Number(postTally.yesVotes),
                    color: "bg-emerald-500",
                  },
                  {
                    label: "No",
                    pct: noPct,
                    count: Number(postTally.noVotes),
                    color: "bg-red-500",
                  },
                ].map((b) => (
                  <div key={b.label} className="space-y-1">
                    <div className="flex justify-between text-xs">
                      <span className="text-muted-foreground">{b.label}</span>
                      <span className="font-medium">
                        {b.pct.toFixed(1)}% ({b.count})
                      </span>
                    </div>
                    <div className="h-2 bg-muted rounded-full overflow-hidden">
                      <div
                        className={cn("h-full rounded-full", b.color)}
                        style={{ width: `${b.pct}%` }}
                      />
                    </div>
                  </div>
                ))}
              </div>
              <p className="text-xs text-muted-foreground text-center pt-1">
                {Number(postTally.totalVotesCast)} total votes cast •{" "}
                {postTally.quorumMet ? "Quorum met ✓" : "Quorum not yet met"}
              </p>
            </CardContent>
          </Card>

          <Link to="/proposals/$id" params={{ id: String(proposal.id) }}>
            <Button className="gap-2" data-ocid="vote.view_proposal_btn">
              <Scale size={15} />
              Back to Proposal
            </Button>
          </Link>
        </div>
      </Layout>
    );
  }

  return (
    <Layout breadcrumb="Cast Vote">
      <div className="p-6 max-w-2xl mx-auto space-y-6">
        {/* Back */}
        <Link to="/proposals/$id" params={{ id }}>
          <Button
            variant="ghost"
            size="sm"
            className="gap-2 text-muted-foreground"
            data-ocid="vote.back_btn"
          >
            <ArrowLeft size={15} /> Back to Proposal
          </Button>
        </Link>

        {/* Header */}
        <div className="space-y-2">
          <div className="flex items-center gap-2">
            <Vote size={20} className="text-primary" />
            <h1 className="text-xl font-display font-bold text-foreground">
              Cast Your Vote
            </h1>
          </div>
          <p className="text-sm text-muted-foreground line-clamp-2">
            {proposal.title}
          </p>
          <div className="flex gap-3 text-xs text-muted-foreground">
            <span className="flex items-center gap-1">
              <Vote size={11} />
              {MECHANISM_LABELS[mechKey] ?? mechKey}
            </span>
            {deadline && (
              <span className="flex items-center gap-1 text-amber-400 font-medium">
                <Clock size={11} />
                {formatCountdown(deadline)}
              </span>
            )}
          </div>
        </div>

        {/* Proposal excerpt */}
        <Card className="border-border/40 bg-muted/20">
          <CardContent className="p-4">
            <p className="text-sm text-foreground/80 line-clamp-3">
              {proposal.description}
            </p>
          </CardContent>
        </Card>

        {/* ── Voting UI ── */}
        <Card className="border-border/60">
          <CardContent className="p-5 space-y-5">
            {/* Liquid delegation toggle */}
            {isLiquid && (
              <div
                className="flex rounded-lg border border-border overflow-hidden"
                data-ocid="vote.delegation_toggle"
              >
                <button
                  type="button"
                  onClick={() => setDelegationMode("self")}
                  className={cn(
                    "flex-1 py-2.5 text-sm font-medium transition-colors",
                    delegationMode === "self"
                      ? "bg-primary text-primary-foreground"
                      : "text-muted-foreground hover:bg-muted",
                  )}
                  data-ocid="vote.delegation_self_tab"
                >
                  Vote Myself
                </button>
                <button
                  type="button"
                  onClick={() => setDelegationMode("delegate")}
                  className={cn(
                    "flex-1 py-2.5 text-sm font-medium transition-colors",
                    delegationMode === "delegate"
                      ? "bg-primary text-primary-foreground"
                      : "text-muted-foreground hover:bg-muted",
                  )}
                  data-ocid="vote.delegation_delegate_tab"
                >
                  Delegate My Vote
                </button>
              </div>
            )}

            {/* Simple/supermajority vote cards */}
            {(isSimple || (isLiquid && delegationMode === "self")) && (
              <div
                className="grid grid-cols-3 gap-3"
                data-ocid="vote.choice_selector"
              >
                {[
                  {
                    c: VoteChoice.yes,
                    label: "Yes",
                    icon: ThumbsUp,
                    color:
                      choice === VoteChoice.yes
                        ? "border-emerald-500 bg-emerald-500/10 text-emerald-400"
                        : "border-border hover:border-emerald-500/40",
                    ring: "ring-2 ring-emerald-500/30",
                  },
                  {
                    c: VoteChoice.no,
                    label: "No",
                    icon: ThumbsDown,
                    color:
                      choice === VoteChoice.no
                        ? "border-red-500 bg-red-500/10 text-red-400"
                        : "border-border hover:border-red-500/40",
                    ring: "ring-2 ring-red-500/30",
                  },
                  {
                    c: VoteChoice.abstain,
                    label: "Abstain",
                    icon: MinusCircle,
                    color:
                      choice === VoteChoice.abstain
                        ? "border-slate-500 bg-slate-500/10 text-slate-400"
                        : "border-border hover:border-slate-500/40",
                    ring: "ring-2 ring-slate-500/30",
                  },
                ].map(({ c, label, icon: Icon, color, ring }) => (
                  <button
                    type="button"
                    key={c}
                    onClick={() => setChoice(c)}
                    className={cn(
                      "flex flex-col items-center gap-3 p-5 rounded-xl border-2 transition-all",
                      color,
                      choice === c && ring,
                    )}
                    data-ocid={`vote.choice_${c}`}
                  >
                    <Icon size={24} />
                    <span className="font-semibold text-sm">{label}</span>
                  </button>
                ))}
              </div>
            )}

            {/* Ranked choice */}
            {isRanked && (
              <RankedChoiceUI order={rankedOrder} onChange={setRankedOrder} />
            )}

            {/* Liquid delegation input */}
            {isLiquid && delegationMode === "delegate" && (
              <div
                className="space-y-3"
                data-ocid="vote.delegate_input_section"
              >
                <Label htmlFor="delegate">Delegate to Principal ID</Label>
                <Input
                  id="delegate"
                  placeholder="e.g. rdmx6-jaaaa-aaaaa-aaadq-cai"
                  value={delegatePrincipal}
                  onChange={(e) => setDelegatePrincipal(e.target.value)}
                  data-ocid="vote.delegate_principal_input"
                />
                <p className="text-xs text-muted-foreground">
                  Enter the ICP principal ID of the member you want to delegate
                  your vote to for this proposal.
                </p>
                {delegatePrincipal && (
                  <div className="p-3 rounded-lg bg-primary/5 border border-primary/20 text-sm">
                    <Users size={13} className="inline mr-1.5 text-primary" />
                    Delegating to:{" "}
                    <span className="font-mono text-primary">
                      {delegatePrincipal.slice(0, 20)}…
                    </span>
                  </div>
                )}
              </div>
            )}
          </CardContent>
        </Card>

        {/* Live tally preview */}
        {tally && (
          <Card className="border-border/40 bg-muted/10">
            <CardContent className="p-4 space-y-2">
              <p className="text-xs font-semibold text-muted-foreground uppercase tracking-widest">
                Current Tally
              </p>
              {(() => {
                const t = tally;
                const tot =
                  Number(t.yesVotes) +
                  Number(t.noVotes) +
                  Number(t.abstainVotes);
                return (
                  <div className="flex gap-4 text-sm">
                    <span className="text-emerald-400 font-medium">
                      Yes: {Number(t.yesVotes)}
                    </span>
                    <span className="text-red-400 font-medium">
                      No: {Number(t.noVotes)}
                    </span>
                    <span className="text-muted-foreground">
                      Abstain: {Number(t.abstainVotes)}
                    </span>
                    <span className="ml-auto text-muted-foreground">
                      {tot} total
                    </span>
                  </div>
                );
              })()}
            </CardContent>
          </Card>
        )}

        {/* Submit */}
        <Button
          className="w-full gap-2 h-11 text-base font-semibold"
          onClick={handleVote}
          disabled={
            submitting ||
            (isSimple && !choice) ||
            (isLiquid && delegationMode === "self" && !choice) ||
            (isLiquid &&
              delegationMode === "delegate" &&
              !delegatePrincipal.trim())
          }
          data-ocid="vote.submit_vote_btn"
        >
          {submitting ? (
            <Loader2 size={16} className="animate-spin" />
          ) : (
            <Vote size={16} />
          )}
          {submitting ? "Recording vote…" : "Confirm Vote"}
        </Button>

        <p className="text-xs text-center text-muted-foreground">
          Your vote will be permanently recorded on the Internet Computer. Once
          submitted, it cannot be changed.
        </p>
      </div>
    </Layout>
  );
}
