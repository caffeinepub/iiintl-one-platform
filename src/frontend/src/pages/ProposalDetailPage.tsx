import {
  type DebateComment,
  type Proposal,
  ProposalStatus,
  ProposalType,
  VoteChoice,
  type VoteTally,
  VotingMechanism,
} from "@/backend";
import { Layout } from "@/components/Layout";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Textarea } from "@/components/ui/textarea";
import { useAuth } from "@/context/AuthContext";
import { useBackend } from "@/hooks/useBackend";
import { cn } from "@/lib/utils";
import type { Principal } from "@icp-sdk/core/principal";
import { Link, useParams } from "@tanstack/react-router";
import {
  ArrowLeft,
  CheckCircle2,
  Clock,
  FileText,
  Loader2,
  MessageSquare,
  Scale,
  Shield,
  Users,
  Vote,
  XCircle,
} from "lucide-react";
import { useEffect, useState } from "react";
import { toast } from "sonner";

// ── Label / color helpers ─────────────────────────────────────────────────────
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
  cancelled: "bg-gray-500/15 text-gray-400 border-gray-500/30",
};

const MECHANISM_LABELS: Record<string, string> = {
  simpleMajority: "Simple Majority",
  supermajority66: "Supermajority 2/3",
  supermajority75: "Supermajority 3/4",
  rankedChoice: "Ranked Choice",
  liquidDelegation: "Liquid Delegation",
};

const LIFECYCLE_STAGES = [
  { key: "draft", label: "Draft" },
  { key: "review", label: "Review" },
  { key: "openVote", label: "Open Vote" },
  { key: "closed", label: "Closed" },
  { key: "enacted", label: "Enacted" },
] as const;

function formatDate(ns: bigint) {
  return new Date(Number(ns) / 1_000_000).toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
  });
}

function principalText(p: unknown): string {
  if (typeof p === "object" && p !== null && "toText" in p)
    return (p as { toText: () => string }).toText();
  return String(p);
}

function shortPrincipal(p: unknown): string {
  const s = principalText(p);
  return `${s.slice(0, 8)}…${s.slice(-4)}`;
}

// ── Tally bar component ───────────────────────────────────────────────────────
function TallySection({ tally }: { tally: VoteTally }) {
  const total =
    Number(tally.yesVotes) + Number(tally.noVotes) + Number(tally.abstainVotes);
  const yesPct = total > 0 ? (Number(tally.yesVotes) / total) * 100 : 0;
  const noPct = total > 0 ? (Number(tally.noVotes) / total) * 100 : 0;
  const abstainPct = total > 0 ? (Number(tally.abstainVotes) / total) * 100 : 0;

  const isRanked = String(tally.mechanism) === "rankedChoice";

  return (
    <Card className="border-border/60">
      <CardHeader className="pb-3">
        <CardTitle className="text-sm flex items-center gap-2">
          <Vote size={15} className="text-primary" />
          Live Tally
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        {/* Quorum indicator */}
        <div className="flex items-center justify-between text-xs">
          <span className="text-muted-foreground">
            Quorum: {Number(tally.quorumPercent)}% required
          </span>
          <span
            className={cn(
              "font-medium",
              tally.quorumMet ? "text-emerald-400" : "text-orange-400",
            )}
          >
            {Number(tally.totalVotesCast)} votes cast{" "}
            {tally.quorumMet ? "✓ Met" : "⚠ Not met"}
          </span>
        </div>

        {!isRanked ? (
          <>
            {/* Yes bar */}
            <div className="space-y-1">
              <div className="flex justify-between text-xs font-medium">
                <span className="text-emerald-400">
                  Yes — {Number(tally.yesVotes)}
                </span>
                <span className="text-muted-foreground">
                  {yesPct.toFixed(1)}%
                </span>
              </div>
              <div className="h-2 bg-muted rounded-full overflow-hidden">
                <div
                  className="h-full bg-emerald-500 rounded-full transition-all"
                  style={{ width: `${yesPct}%` }}
                />
              </div>
            </div>
            {/* No bar */}
            <div className="space-y-1">
              <div className="flex justify-between text-xs font-medium">
                <span className="text-red-400">
                  No — {Number(tally.noVotes)}
                </span>
                <span className="text-muted-foreground">
                  {noPct.toFixed(1)}%
                </span>
              </div>
              <div className="h-2 bg-muted rounded-full overflow-hidden">
                <div
                  className="h-full bg-red-500 rounded-full transition-all"
                  style={{ width: `${noPct}%` }}
                />
              </div>
            </div>
            {/* Abstain */}
            <div className="space-y-1">
              <div className="flex justify-between text-xs font-medium">
                <span className="text-muted-foreground">
                  Abstain — {Number(tally.abstainVotes)}
                </span>
                <span className="text-muted-foreground">
                  {abstainPct.toFixed(1)}%
                </span>
              </div>
              <div className="h-2 bg-muted rounded-full overflow-hidden">
                <div
                  className="h-full bg-slate-500 rounded-full transition-all"
                  style={{ width: `${abstainPct}%` }}
                />
              </div>
            </div>

            {/* Pass / fail */}
            {tally.passed !== undefined && (
              <div
                className={cn(
                  "flex items-center gap-2 p-2.5 rounded-lg text-sm font-semibold",
                  tally.passed
                    ? "bg-emerald-500/10 text-emerald-400"
                    : "bg-red-500/10 text-red-400",
                )}
              >
                {tally.passed ? (
                  <CheckCircle2 size={15} />
                ) : (
                  <XCircle size={15} />
                )}
                {tally.passed ? "Proposal Passed" : "Proposal Failed"}
              </div>
            )}
          </>
        ) : (
          // Ranked choice results table
          <div className="space-y-2">
            <p className="text-xs text-muted-foreground">Ranked results:</p>
            {tally.rankedResults.length > 0 ? (
              tally.rankedResults.map(([candidate, votes], i) => (
                <div
                  key={candidate}
                  className="flex items-center justify-between text-sm"
                >
                  <span className="flex items-center gap-2">
                    <span className="w-5 h-5 rounded-full bg-primary/15 text-primary text-xs flex items-center justify-center font-bold">
                      {i + 1}
                    </span>
                    {candidate}
                  </span>
                  <span className="text-muted-foreground font-mono">
                    {String(votes)} pts
                  </span>
                </div>
              ))
            ) : (
              <p className="text-xs text-muted-foreground">No results yet.</p>
            )}
          </div>
        )}
      </CardContent>
    </Card>
  );
}

// ── DebateTab ─────────────────────────────────────────────────────────────────
function DebateTab({
  proposalId,
  comments,
  onRefresh,
}: {
  proposalId: bigint;
  comments: DebateComment[];
  onRefresh: () => void;
}) {
  const backend = useBackend();
  const { isAuthenticated } = useAuth();
  const [text, setText] = useState("");
  const [replyTo, setReplyTo] = useState<bigint | null>(null);
  const [editingId, setEditingId] = useState<bigint | null>(null);
  const [editText, setEditText] = useState("");
  const [posting, setPosting] = useState(false);

  async function submitComment() {
    if (!backend || !text.trim()) return;
    setPosting(true);
    try {
      const res = await backend.addDebateComment(
        proposalId,
        text.trim(),
        replyTo,
      );
      if ("ok" in res) {
        setText("");
        setReplyTo(null);
        onRefresh();
        toast.success("Comment posted");
      } else {
        toast.error(res.err);
      }
    } catch {
      toast.error("Failed to post comment");
    } finally {
      setPosting(false);
    }
  }

  async function submitEdit(id: bigint) {
    if (!backend || !editText.trim()) return;
    setPosting(true);
    try {
      const res = await backend.editDebateComment(id, editText.trim());
      if ("ok" in res) {
        setEditingId(null);
        setEditText("");
        onRefresh();
        toast.success("Comment updated");
      } else {
        toast.error(res.err);
      }
    } catch {
      toast.error("Failed to update comment");
    } finally {
      setPosting(false);
    }
  }

  const topLevel = comments.filter((c) => !c.parentCommentId);
  const replies = (parentId: bigint) =>
    comments.filter((c) => c.parentCommentId && c.parentCommentId === parentId);

  return (
    <div className="space-y-5">
      {/* Comment input */}
      {isAuthenticated && (
        <div className="space-y-2">
          {replyTo && (
            <div className="flex items-center gap-2 text-xs text-muted-foreground bg-muted/30 px-3 py-1.5 rounded-md">
              <MessageSquare size={11} />
              Replying to comment #{String(replyTo)}
              <button
                type="button"
                onClick={() => setReplyTo(null)}
                className="ml-auto hover:text-foreground transition-colors"
              >
                Cancel
              </button>
            </div>
          )}
          <Textarea
            placeholder={replyTo ? "Write a reply…" : "Join the debate…"}
            value={text}
            onChange={(e) => setText(e.target.value)}
            rows={3}
            data-ocid="proposal_detail.comment_input"
          />
          <div className="flex justify-end">
            <Button
              size="sm"
              onClick={submitComment}
              disabled={posting || !text.trim()}
              data-ocid="proposal_detail.post_comment_btn"
            >
              {posting && <Loader2 size={12} className="animate-spin mr-1" />}
              Post Comment
            </Button>
          </div>
        </div>
      )}

      {/* Comment list */}
      {topLevel.length === 0 ? (
        <div
          className="py-12 text-center text-muted-foreground"
          data-ocid="proposal_detail.no_comments"
        >
          <MessageSquare size={32} className="mx-auto mb-3 opacity-30" />
          <p className="text-sm">No comments yet. Start the debate!</p>
        </div>
      ) : (
        <div className="space-y-4">
          {topLevel.map((comment) => (
            <div key={String(comment.id)} className="space-y-3">
              <CommentItem
                comment={comment}
                onReply={(id) => setReplyTo(id)}
                onEdit={(id, content) => {
                  setEditingId(id);
                  setEditText(content);
                }}
                editingId={editingId}
                editText={editText}
                onEditChange={setEditText}
                onEditSubmit={submitEdit}
                posting={posting}
              />
              {/* Replies */}
              {replies(comment.id).map((reply) => (
                <div
                  key={String(reply.id)}
                  className="ml-8 pl-4 border-l border-border/40"
                >
                  <CommentItem
                    comment={reply}
                    onReply={(id) => setReplyTo(id)}
                    onEdit={(id, content) => {
                      setEditingId(id);
                      setEditText(content);
                    }}
                    editingId={editingId}
                    editText={editText}
                    onEditChange={setEditText}
                    onEditSubmit={submitEdit}
                    posting={posting}
                  />
                </div>
              ))}
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

function CommentItem({
  comment,
  onReply,
  onEdit,
  editingId,
  editText,
  onEditChange,
  onEditSubmit,
  posting,
}: {
  comment: DebateComment;
  onReply: (id: bigint) => void;
  onEdit: (id: bigint, content: string) => void;
  editingId: bigint | null;
  editText: string;
  onEditChange: (t: string) => void;
  onEditSubmit: (id: bigint) => void;
  posting: boolean;
}) {
  const { user } = useAuth();
  const authorText = principalText(comment.author);
  const isEditing = editingId === comment.id;

  if (comment.isDeleted) {
    return (
      <div className="p-3 rounded-lg bg-muted/20 text-xs text-muted-foreground italic">
        [Comment removed]
      </div>
    );
  }

  return (
    <div
      className="p-3 rounded-lg bg-card border border-border/40"
      data-ocid={`proposal_detail.comment_${String(comment.id)}`}
    >
      <div className="flex items-center justify-between mb-1.5">
        <span className="text-xs font-mono text-muted-foreground">
          {shortPrincipal(comment.author)}
        </span>
        <span className="text-xs text-muted-foreground">
          {formatDate(comment.createdAt)}
          {comment.editedAt && (
            <span className="ml-1 opacity-60">(edited)</span>
          )}
        </span>
      </div>
      {isEditing ? (
        <div className="space-y-2">
          <Textarea
            value={editText}
            onChange={(e) => onEditChange(e.target.value)}
            rows={3}
            className="text-sm"
            data-ocid="proposal_detail.edit_comment_input"
          />
          <div className="flex gap-2 justify-end">
            <Button
              variant="ghost"
              size="sm"
              onClick={() => onEdit(-1n, "")}
              data-ocid="proposal_detail.cancel_edit_btn"
            >
              Cancel
            </Button>
            <Button
              size="sm"
              onClick={() => onEditSubmit(comment.id)}
              disabled={posting}
              data-ocid="proposal_detail.save_edit_btn"
            >
              Save
            </Button>
          </div>
        </div>
      ) : (
        <>
          <p className="text-sm text-foreground/90">{comment.content}</p>
          <div className="flex gap-3 mt-2">
            <button
              type="button"
              className="text-xs text-muted-foreground hover:text-primary transition-colors"
              onClick={() => onReply(comment.id)}
              data-ocid="proposal_detail.reply_btn"
            >
              Reply
            </button>
            {user &&
              principalText(comment.author).startsWith(
                authorText.slice(0, 5),
              ) && (
                <button
                  type="button"
                  className="text-xs text-muted-foreground hover:text-primary transition-colors"
                  onClick={() => onEdit(comment.id, comment.content)}
                  data-ocid="proposal_detail.edit_comment_btn"
                >
                  Edit
                </button>
              )}
          </div>
        </>
      )}
    </div>
  );
}

// ── ProposalDetailPage ────────────────────────────────────────────────────────
export function ProposalDetailPage() {
  const { id } = useParams({ from: "/proposals/$id" });
  const backend = useBackend();
  const { user } = useAuth();

  const [proposal, setProposal] = useState<Proposal | null>(null);
  const [sponsors, setSponsors] = useState<Principal[]>([]);
  const [tally, setTally] = useState<VoteTally | null>(null);
  const [comments, setComments] = useState<DebateComment[]>([]);
  const [loading, setLoading] = useState(true);
  const [actioning, setActioning] = useState(false);

  const isAdmin = user?.role === "admin" || user?.role === "super_admin";
  const isAuthenticated = !!user;

  const load = async () => {
    if (!backend) return;
    try {
      const pid = BigInt(id);
      const [p, s, t, c] = await Promise.all([
        backend.getProposal(pid),
        backend.getProposalSponsors(pid),
        backend.getVoteTally(pid),
        backend.getProposalComments(pid),
      ]);
      setProposal(p);
      setSponsors(s);
      setTally(t);
      setComments(c);
    } catch {
      toast.error("Failed to load proposal");
    } finally {
      setLoading(false);
    }
  };

  // biome-ignore lint/correctness/useExhaustiveDependencies: load is stable within backend+id scope
  useEffect(() => {
    load();
  }, [backend, id]);

  async function doAdminAction(
    fn: () => Promise<
      { __kind__: "ok"; ok: string } | { __kind__: "err"; err: string }
    >,
    successMsg: string,
  ) {
    setActioning(true);
    try {
      const res = await fn();
      if ("ok" in res) {
        toast.success(successMsg);
        load();
      } else {
        toast.error(res.err);
      }
    } catch {
      toast.error("Action failed");
    } finally {
      setActioning(false);
    }
  }

  async function handleSponsor() {
    if (!backend || !proposal) return;
    await doAdminAction(
      () => backend.sponsorProposal(proposal.id),
      "Sponsored proposal!",
    );
  }

  async function handleWithdrawSponsor() {
    if (!backend || !proposal) return;
    await doAdminAction(
      () => backend.withdrawSponsor(proposal.id),
      "Sponsor withdrawn",
    );
  }

  if (loading) {
    return (
      <Layout breadcrumb="Proposal">
        <div className="p-6 max-w-4xl mx-auto space-y-4">
          <Skeleton className="h-8 w-48" />
          <Skeleton className="h-24 rounded-xl" />
          <Skeleton className="h-64 rounded-xl" />
        </div>
      </Layout>
    );
  }

  if (!proposal) {
    return (
      <Layout breadcrumb="Proposal">
        <div className="p-6 max-w-4xl mx-auto flex flex-col items-center py-24 gap-4">
          <Scale size={48} className="text-muted-foreground/30" />
          <h2 className="text-xl font-semibold">Proposal not found</h2>
          <Link to="/proposals">
            <Button variant="outline">Back to Proposals</Button>
          </Link>
        </div>
      </Layout>
    );
  }

  const typeKey = String(proposal.proposalType);
  const statusKey = String(proposal.status);
  const mechKey = String(proposal.mechanism);
  const isOpenVote = statusKey === "openVote";
  const canVote = isOpenVote && isAuthenticated;
  const canSponsor =
    isAuthenticated &&
    (statusKey === "draft" || statusKey === "review") &&
    !sponsors.some(
      (s) => principalText(s) === principalText(proposal.proposer),
    );

  const stageIndex = LIFECYCLE_STAGES.findIndex((s) => s.key === statusKey);

  return (
    <Layout breadcrumb="Proposal Detail">
      <div className="p-6 max-w-4xl mx-auto space-y-6">
        {/* Back */}
        <Link to="/proposals">
          <Button
            variant="ghost"
            size="sm"
            className="gap-2 text-muted-foreground"
            data-ocid="proposal_detail.back_btn"
          >
            <ArrowLeft size={15} /> Proposals
          </Button>
        </Link>

        {/* Hero */}
        <div className="space-y-3">
          <div className="flex flex-wrap gap-2">
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
            <span className="text-xs font-medium px-2 py-0.5 rounded-full border border-primary/30 bg-primary/10 text-primary/80">
              <Vote size={10} className="inline mr-1" />
              {MECHANISM_LABELS[mechKey] ?? mechKey}
            </span>
          </div>
          <h1 className="text-2xl font-display font-bold text-foreground">
            {proposal.title}
          </h1>
          <div className="flex flex-wrap gap-4 text-xs text-muted-foreground">
            <span className="flex items-center gap-1">
              <FileText size={11} />
              Proposer: {shortPrincipal(proposal.proposer)}
            </span>
            <span className="flex items-center gap-1">
              <Clock size={11} />
              Submitted {formatDate(proposal.createdAt)}
            </span>
            {proposal.orgId && (
              <span className="flex items-center gap-1">
                <Users size={11} />
                Org: {proposal.orgId}
              </span>
            )}
          </div>
        </div>

        {/* Lifecycle timeline */}
        <div
          className="flex items-center gap-0"
          data-ocid="proposal_detail.lifecycle"
        >
          {LIFECYCLE_STAGES.map((stage, i) => {
            const isPast = i < stageIndex;
            const isCurrent = i === stageIndex;
            const isEnded =
              statusKey === "rejected" || statusKey === "cancelled";
            return (
              <div key={stage.key} className="flex items-center flex-1 min-w-0">
                <div
                  className={cn(
                    "flex items-center justify-center w-7 h-7 rounded-full text-[10px] font-bold flex-shrink-0 border-2 transition-colors",
                    isCurrent && isEnded
                      ? "border-red-500 bg-red-500/15 text-red-400"
                      : isCurrent
                        ? "border-primary bg-primary/15 text-primary"
                        : isPast
                          ? "border-emerald-500/40 bg-emerald-500/10 text-emerald-400"
                          : "border-border text-muted-foreground",
                  )}
                >
                  {isPast ? <CheckCircle2 size={12} /> : i + 1}
                </div>
                <div className="hidden sm:block ml-1.5 mr-3 flex-shrink-0">
                  <p
                    className={cn(
                      "text-[10px] font-medium",
                      isCurrent ? "text-foreground" : "text-muted-foreground",
                    )}
                  >
                    {stage.label}
                  </p>
                </div>
                {i < LIFECYCLE_STAGES.length - 1 && (
                  <div
                    className={cn(
                      "flex-1 h-px mx-1",
                      isPast ? "bg-emerald-500/40" : "bg-border",
                    )}
                  />
                )}
              </div>
            );
          })}
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Main content */}
          <div className="lg:col-span-2 space-y-5">
            {/* Description */}
            <Card className="border-border/60">
              <CardContent className="p-5">
                <p className="text-sm text-foreground/90 leading-relaxed whitespace-pre-wrap">
                  {proposal.description}
                </p>
              </CardContent>
            </Card>

            {/* Tally (if relevant) */}
            {(isOpenVote ||
              statusKey === "closed" ||
              statusKey === "enacted" ||
              statusKey === "rejected") &&
              tally && <TallySection tally={tally} />}

            {/* Tabs */}
            <Tabs defaultValue="debate" data-ocid="proposal_detail.tabs">
              <TabsList className="w-full justify-start gap-1 h-9">
                <TabsTrigger
                  value="debate"
                  className="text-xs gap-1"
                  data-ocid="proposal_detail.debate_tab"
                >
                  <MessageSquare size={12} />
                  Debate ({comments.length})
                </TabsTrigger>
                <TabsTrigger
                  value="sponsors"
                  className="text-xs gap-1"
                  data-ocid="proposal_detail.sponsors_tab"
                >
                  <Users size={12} />
                  Sponsors ({sponsors.length})
                </TabsTrigger>
                {(statusKey === "closed" ||
                  statusKey === "enacted" ||
                  statusKey === "rejected") && (
                  <TabsTrigger
                    value="voters"
                    className="text-xs gap-1"
                    data-ocid="proposal_detail.voters_tab"
                  >
                    <Vote size={12} />
                    Voters
                  </TabsTrigger>
                )}
                <TabsTrigger
                  value="audit"
                  className="text-xs gap-1"
                  data-ocid="proposal_detail.audit_tab"
                >
                  <Shield size={12} />
                  Audit
                </TabsTrigger>
              </TabsList>

              <TabsContent value="debate" className="mt-4">
                <DebateTab
                  proposalId={proposal.id}
                  comments={comments}
                  onRefresh={load}
                />
              </TabsContent>

              <TabsContent value="sponsors" className="mt-4">
                <div className="space-y-2">
                  {sponsors.length === 0 ? (
                    <p className="text-sm text-muted-foreground py-8 text-center">
                      No sponsors yet. Co-sign to advance this proposal.
                    </p>
                  ) : (
                    sponsors.map((s, i) => (
                      <div
                        key={principalText(s)}
                        className="flex items-center gap-3 p-3 rounded-lg bg-card border border-border/40"
                        data-ocid={`proposal_detail.sponsor_${i + 1}`}
                      >
                        <div className="w-7 h-7 rounded-full bg-primary/15 flex items-center justify-center text-primary text-xs font-bold">
                          {i + 1}
                        </div>
                        <span className="font-mono text-sm">
                          {shortPrincipal(s)}
                        </span>
                      </div>
                    ))
                  )}
                </div>
              </TabsContent>

              <TabsContent value="voters" className="mt-4">
                <p className="text-sm text-muted-foreground py-8 text-center">
                  Voter list available after voting closes.
                </p>
              </TabsContent>

              <TabsContent value="audit" className="mt-4">
                <div className="space-y-2">
                  <div
                    className="flex items-center justify-between p-3 rounded-lg bg-card border border-border/40 text-sm"
                    data-ocid="proposal_detail.audit_created"
                  >
                    <span className="text-muted-foreground">
                      Proposal created
                    </span>
                    <span className="font-mono text-xs">
                      {formatDate(proposal.createdAt)}
                    </span>
                  </div>
                  {proposal.votingOpensAt && (
                    <div className="flex items-center justify-between p-3 rounded-lg bg-card border border-border/40 text-sm">
                      <span className="text-muted-foreground">
                        Voting opened
                      </span>
                      <span className="font-mono text-xs">
                        {formatDate(proposal.votingOpensAt)}
                      </span>
                    </div>
                  )}
                  {proposal.votingClosesAt && (
                    <div className="flex items-center justify-between p-3 rounded-lg bg-card border border-border/40 text-sm">
                      <span className="text-muted-foreground">
                        Voting closes
                      </span>
                      <span className="font-mono text-xs">
                        {formatDate(proposal.votingClosesAt)}
                      </span>
                    </div>
                  )}
                  {proposal.enactedAt && (
                    <div className="flex items-center justify-between p-3 rounded-lg bg-emerald-500/5 border border-emerald-500/20 text-sm">
                      <span className="text-emerald-400">Proposal enacted</span>
                      <span className="font-mono text-xs">
                        {formatDate(proposal.enactedAt)}
                      </span>
                    </div>
                  )}
                </div>
              </TabsContent>
            </Tabs>
          </div>

          {/* Sidebar */}
          <div className="space-y-4">
            {/* Action panel */}
            <Card className="border-border/60">
              <CardContent className="p-4 space-y-3">
                <p className="text-xs font-semibold uppercase tracking-widest text-muted-foreground">
                  Actions
                </p>

                {/* Vote button */}
                {canVote && (
                  <Link to="/vote/$id" params={{ id: String(proposal.id) }}>
                    <Button
                      className="w-full gap-2"
                      data-ocid="proposal_detail.vote_btn"
                    >
                      <Vote size={14} />
                      Cast Your Vote
                    </Button>
                  </Link>
                )}

                {/* Sponsor actions */}
                {canSponsor && (
                  <Button
                    variant="outline"
                    className="w-full gap-2"
                    onClick={handleSponsor}
                    disabled={actioning}
                    data-ocid="proposal_detail.sponsor_btn"
                  >
                    {actioning ? (
                      <Loader2 size={13} className="animate-spin" />
                    ) : (
                      <Users size={13} />
                    )}
                    Co-sign Proposal
                  </Button>
                )}

                {isAuthenticated &&
                  (statusKey === "draft" || statusKey === "review") &&
                  sponsors.some(
                    (s) =>
                      principalText(s) !== principalText(proposal.proposer),
                  ) && (
                    <Button
                      variant="ghost"
                      size="sm"
                      className="w-full text-muted-foreground"
                      onClick={handleWithdrawSponsor}
                      disabled={actioning}
                      data-ocid="proposal_detail.withdraw_sponsor_btn"
                    >
                      Withdraw Co-signature
                    </Button>
                  )}

                {/* Admin actions */}
                {isAdmin && (
                  <div className="space-y-2 pt-2 border-t border-border/40">
                    <p className="text-[10px] uppercase tracking-widest text-amber-400 font-semibold">
                      Admin
                    </p>
                    {statusKey === "review" && (
                      <Button
                        variant="outline"
                        size="sm"
                        className="w-full text-emerald-400 border-emerald-500/30 hover:bg-emerald-500/10"
                        onClick={() =>
                          doAdminAction(
                            () => backend!.openProposalForVoting(proposal.id),
                            "Voting opened!",
                          )
                        }
                        disabled={actioning}
                        data-ocid="proposal_detail.admin_open_vote_btn"
                      >
                        Open for Voting
                      </Button>
                    )}
                    {statusKey === "openVote" && (
                      <Button
                        variant="outline"
                        size="sm"
                        className="w-full text-orange-400 border-orange-500/30 hover:bg-orange-500/10"
                        onClick={() =>
                          doAdminAction(
                            () => backend!.closeProposal(proposal.id),
                            "Voting closed",
                          )
                        }
                        disabled={actioning}
                        data-ocid="proposal_detail.admin_close_btn"
                      >
                        Close Voting
                      </Button>
                    )}
                    {statusKey === "closed" && (
                      <Button
                        variant="outline"
                        size="sm"
                        className="w-full text-green-400 border-green-500/30 hover:bg-green-500/10"
                        onClick={() =>
                          doAdminAction(
                            () => backend!.enactProposal(proposal.id),
                            "Proposal enacted!",
                          )
                        }
                        disabled={actioning}
                        data-ocid="proposal_detail.admin_enact_btn"
                      >
                        Enact Proposal
                      </Button>
                    )}
                    {(statusKey === "draft" ||
                      statusKey === "review" ||
                      statusKey === "closed") && (
                      <Button
                        variant="ghost"
                        size="sm"
                        className="w-full text-destructive hover:bg-destructive/10"
                        onClick={() =>
                          doAdminAction(
                            () => backend!.cancelProposal(proposal.id),
                            "Proposal cancelled",
                          )
                        }
                        disabled={actioning}
                        data-ocid="proposal_detail.admin_cancel_btn"
                      >
                        Cancel Proposal
                      </Button>
                    )}
                  </div>
                )}
              </CardContent>
            </Card>

            {/* Metadata */}
            <Card className="border-border/60">
              <CardContent className="p-4 space-y-2 text-xs">
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Quorum</span>
                  <span className="font-medium">
                    {Number(proposal.quorumPercent)}%
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Sponsors needed</span>
                  <span className="font-medium">
                    {sponsors.length}/{Number(proposal.sponsorThreshold)}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Vote window</span>
                  <span className="font-medium">
                    {Number(proposal.voteWindowHours) / 24}d
                  </span>
                </div>
                {proposal.tags.length > 0 && (
                  <div className="flex flex-wrap gap-1 pt-1">
                    {proposal.tags.map((tag) => (
                      <Badge
                        key={tag}
                        variant="secondary"
                        className="text-[10px]"
                      >
                        {tag}
                      </Badge>
                    ))}
                  </div>
                )}
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </Layout>
  );
}
