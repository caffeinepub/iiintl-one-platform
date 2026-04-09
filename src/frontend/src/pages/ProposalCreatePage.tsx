import { ProposalType, VotingMechanism } from "@/backend";
import { Layout } from "@/components/Layout";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { useBackend } from "@/hooks/useBackend";
import { cn } from "@/lib/utils";
import { Link, useNavigate } from "@tanstack/react-router";
import {
  ArrowLeft,
  BarChart3,
  CheckCircle2,
  DollarSign,
  FileEdit,
  FileText,
  Loader2,
  Scale,
  Users,
  Vote,
} from "lucide-react";
import { useState } from "react";
import { toast } from "sonner";

// ── Type config ───────────────────────────────────────────────────────────────
const PROPOSAL_TYPES = [
  {
    key: ProposalType.policy,
    label: "Policy",
    icon: FileText,
    desc: "Formal policy decisions that set rules or guidelines for the platform.",
    color: "border-blue-500/40 bg-blue-500/5 text-blue-400",
  },
  {
    key: ProposalType.resolution,
    label: "Resolution",
    icon: Scale,
    desc: "Non-binding resolutions expressing the community's collective position.",
    color: "border-purple-500/40 bg-purple-500/5 text-purple-400",
  },
  {
    key: ProposalType.budget,
    label: "Budget",
    icon: DollarSign,
    desc: "Budget allocations and financial decisions for platform operations.",
    color: "border-emerald-500/40 bg-emerald-500/5 text-emerald-400",
  },
  {
    key: ProposalType.amendment,
    label: "Amendment",
    icon: FileEdit,
    desc: "Modifications to existing policies, bylaws, or platform rules.",
    color: "border-amber-500/40 bg-amber-500/5 text-amber-400",
  },
  {
    key: ProposalType.communityInitiative,
    label: "Community Initiative",
    icon: Users,
    desc: "Community-driven programs, events, or initiatives for collective action.",
    color: "border-cyan-500/40 bg-cyan-500/5 text-cyan-400",
  },
] as const;

const MECHANISMS = [
  {
    key: VotingMechanism.simpleMajority,
    label: "Simple Majority",
    icon: Vote,
    desc: "More than 50% of votes cast must be Yes. Quickest path to decision.",
  },
  {
    key: VotingMechanism.supermajority66,
    label: "Supermajority 2/3",
    icon: BarChart3,
    desc: "At least 66.7% of votes must be Yes. For important policy changes.",
  },
  {
    key: VotingMechanism.supermajority75,
    label: "Supermajority 3/4",
    icon: BarChart3,
    desc: "At least 75% of votes must be Yes. For constitutional amendments.",
  },
  {
    key: VotingMechanism.rankedChoice,
    label: "Ranked Choice",
    icon: CheckCircle2,
    desc: "Voters rank options by preference. Winner by elimination rounds.",
  },
  {
    key: VotingMechanism.liquidDelegation,
    label: "Liquid Delegation",
    icon: Users,
    desc: "Vote yourself or delegate your vote to a trusted representative.",
  },
] as const;

// ── Form state ────────────────────────────────────────────────────────────────
interface FormState {
  title: string;
  description: string;
  orgId: string;
  proposalType: ProposalType;
  mechanism: VotingMechanism;
  quorumPercent: number;
  sponsorThreshold: number;
  voteWindowDays: number;
}

const DEFAULT: FormState = {
  title: "",
  description: "",
  orgId: "",
  proposalType: ProposalType.policy,
  mechanism: VotingMechanism.simpleMajority,
  quorumPercent: 20,
  sponsorThreshold: 5,
  voteWindowDays: 7,
};

export function ProposalCreatePage() {
  const backend = useBackend();
  const navigate = useNavigate();
  const [form, setForm] = useState<FormState>(DEFAULT);
  const [submitting, setSubmitting] = useState(false);
  const [section, setSection] = useState<1 | 2 | 3 | 4>(1);

  function update<K extends keyof FormState>(key: K, val: FormState[K]) {
    setForm((f) => ({ ...f, [key]: val }));
  }

  async function handleSubmit() {
    if (!backend) return;
    if (!form.title.trim()) {
      toast.error("Title is required");
      return;
    }
    if (!form.description.trim()) {
      toast.error("Description is required");
      return;
    }
    setSubmitting(true);
    try {
      const res = await backend.createProposal(
        form.proposalType,
        form.title.trim(),
        form.description.trim(),
        form.mechanism,
        BigInt(form.quorumPercent),
        BigInt(form.sponsorThreshold),
        BigInt(form.voteWindowDays * 24),
        form.orgId.trim() || null,
        [],
      );
      if ("ok" in res) {
        toast.success("Proposal created successfully!");
        navigate({ to: "/proposals/$id", params: { id: String(res.ok) } });
      } else {
        toast.error(res.err);
      }
    } catch {
      toast.error("Failed to create proposal. Please try again.");
    } finally {
      setSubmitting(false);
    }
  }

  const mechInfo = MECHANISMS.find((m) => m.key === form.mechanism);
  const typeInfo = PROPOSAL_TYPES.find((t) => t.key === form.proposalType);

  return (
    <Layout breadcrumb="Create Proposal">
      <div className="p-6 max-w-3xl mx-auto space-y-6">
        {/* Back + header */}
        <div className="flex items-center gap-3">
          <Link to="/proposals">
            <Button
              variant="ghost"
              size="sm"
              className="gap-2 text-muted-foreground"
              data-ocid="proposal_create.back_btn"
            >
              <ArrowLeft size={15} /> Proposals
            </Button>
          </Link>
        </div>
        <div>
          <h1 className="text-2xl font-display font-bold text-foreground flex items-center gap-2">
            <Scale size={22} className="text-primary" />
            Create Proposal
          </h1>
          <p className="text-muted-foreground text-sm mt-1">
            Submit a democratic proposal for community review and voting.
          </p>
        </div>

        {/* Step indicator */}
        <div
          className="flex items-center gap-2"
          data-ocid="proposal_create.steps"
        >
          {([1, 2, 3, 4] as const).map((s) => (
            <button
              type="button"
              key={s}
              onClick={() => setSection(s)}
              className={cn(
                "flex items-center justify-center w-8 h-8 rounded-full text-sm font-bold transition-all border-2",
                section === s
                  ? "bg-primary text-primary-foreground border-primary"
                  : s < section
                    ? "bg-primary/20 border-primary/40 text-primary"
                    : "border-border text-muted-foreground",
              )}
              data-ocid={`proposal_create.step_${s}`}
            >
              {s}
            </button>
          ))}
          <div className="h-px flex-1 bg-border" />
          <span className="text-xs text-muted-foreground">
            Step {section} of 4
          </span>
        </div>

        {/* ── Section 1: Basic Info ── */}
        {section === 1 && (
          <Card>
            <CardContent className="p-6 space-y-4">
              <h2 className="font-semibold text-foreground text-base">
                Basic Information
              </h2>
              <div className="space-y-2">
                <Label htmlFor="title">
                  Title <span className="text-destructive">*</span>
                </Label>
                <Input
                  id="title"
                  placeholder="Clear, concise proposal title…"
                  value={form.title}
                  onChange={(e) => update("title", e.target.value)}
                  data-ocid="proposal_create.title_input"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="desc">
                  Description <span className="text-destructive">*</span>
                </Label>
                <Textarea
                  id="desc"
                  placeholder="Explain your proposal in detail — the problem it solves, proposed solution, and expected outcomes…"
                  value={form.description}
                  onChange={(e) => update("description", e.target.value)}
                  rows={6}
                  data-ocid="proposal_create.description_input"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="org">
                  Organization ID{" "}
                  <span className="text-muted-foreground text-xs">
                    (optional)
                  </span>
                </Label>
                <Input
                  id="org"
                  placeholder="Scope to a specific organization…"
                  value={form.orgId}
                  onChange={(e) => update("orgId", e.target.value)}
                  data-ocid="proposal_create.org_input"
                />
              </div>
              <div className="flex justify-end pt-2">
                <Button
                  onClick={() => {
                    if (!form.title.trim() || !form.description.trim()) {
                      toast.error("Title and description are required");
                      return;
                    }
                    setSection(2);
                  }}
                  data-ocid="proposal_create.next_step1_btn"
                >
                  Next: Proposal Type
                </Button>
              </div>
            </CardContent>
          </Card>
        )}

        {/* ── Section 2: Proposal Type ── */}
        {section === 2 && (
          <Card>
            <CardContent className="p-6 space-y-4">
              <h2 className="font-semibold text-foreground text-base">
                Proposal Type
              </h2>
              <div
                className="grid grid-cols-1 gap-3"
                data-ocid="proposal_create.type_selector"
              >
                {PROPOSAL_TYPES.map((t) => {
                  const Icon = t.icon;
                  const selected = form.proposalType === t.key;
                  return (
                    <button
                      type="button"
                      key={t.key}
                      onClick={() => update("proposalType", t.key)}
                      className={cn(
                        "flex items-start gap-4 p-4 rounded-xl border-2 text-left transition-all",
                        selected
                          ? cn("border-2", t.color)
                          : "border-border hover:border-primary/30",
                      )}
                      data-ocid={`proposal_create.type_${t.key}`}
                    >
                      <div
                        className={cn(
                          "w-9 h-9 rounded-lg flex items-center justify-center flex-shrink-0 mt-0.5",
                          selected ? t.color : "bg-muted text-muted-foreground",
                        )}
                      >
                        <Icon size={16} />
                      </div>
                      <div>
                        <p className="font-semibold text-sm text-foreground">
                          {t.label}
                        </p>
                        <p className="text-xs text-muted-foreground mt-0.5">
                          {t.desc}
                        </p>
                      </div>
                    </button>
                  );
                })}
              </div>
              <div className="flex justify-between pt-2">
                <Button
                  variant="outline"
                  onClick={() => setSection(1)}
                  data-ocid="proposal_create.back_step2_btn"
                >
                  Back
                </Button>
                <Button
                  onClick={() => setSection(3)}
                  data-ocid="proposal_create.next_step2_btn"
                >
                  Next: Voting Config
                </Button>
              </div>
            </CardContent>
          </Card>
        )}

        {/* ── Section 3: Voting Configuration ── */}
        {section === 3 && (
          <Card>
            <CardContent className="p-6 space-y-5">
              <h2 className="font-semibold text-foreground text-base">
                Voting Configuration
              </h2>

              {/* Mechanism */}
              <div className="space-y-2">
                <Label>Voting Mechanism</Label>
                <div
                  className="grid grid-cols-1 gap-2"
                  data-ocid="proposal_create.mechanism_selector"
                >
                  {MECHANISMS.map((m) => {
                    const Icon = m.icon;
                    const selected = form.mechanism === m.key;
                    return (
                      <button
                        type="button"
                        key={m.key}
                        onClick={() => update("mechanism", m.key)}
                        className={cn(
                          "flex items-center gap-3 p-3 rounded-lg border-2 text-left transition-all",
                          selected
                            ? "border-primary bg-primary/5"
                            : "border-border hover:border-primary/30",
                        )}
                        data-ocid={`proposal_create.mechanism_${m.key}`}
                      >
                        <div
                          className={cn(
                            "w-8 h-8 rounded-md flex items-center justify-center flex-shrink-0",
                            selected
                              ? "bg-primary/15 text-primary"
                              : "bg-muted text-muted-foreground",
                          )}
                        >
                          <Icon size={14} />
                        </div>
                        <div>
                          <p
                            className={cn(
                              "font-medium text-sm",
                              selected ? "text-primary" : "text-foreground",
                            )}
                          >
                            {m.label}
                          </p>
                          <p className="text-xs text-muted-foreground">
                            {m.desc}
                          </p>
                        </div>
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* Numeric config */}
              <div className="grid grid-cols-3 gap-4">
                <div className="space-y-1.5">
                  <Label htmlFor="quorum" className="text-xs">
                    Quorum %
                  </Label>
                  <Input
                    id="quorum"
                    type="number"
                    min={1}
                    max={100}
                    value={form.quorumPercent}
                    onChange={(e) =>
                      update("quorumPercent", Number(e.target.value))
                    }
                    className="h-9"
                    data-ocid="proposal_create.quorum_input"
                  />
                  <p className="text-xs text-muted-foreground">
                    Min participation
                  </p>
                </div>
                <div className="space-y-1.5">
                  <Label htmlFor="threshold" className="text-xs">
                    Sponsor threshold
                  </Label>
                  <Input
                    id="threshold"
                    type="number"
                    min={1}
                    max={20}
                    value={form.sponsorThreshold}
                    onChange={(e) =>
                      update("sponsorThreshold", Number(e.target.value))
                    }
                    className="h-9"
                    data-ocid="proposal_create.threshold_input"
                  />
                  <p className="text-xs text-muted-foreground">
                    Co-signers needed
                  </p>
                </div>
                <div className="space-y-1.5">
                  <Label htmlFor="window" className="text-xs">
                    Vote window (days)
                  </Label>
                  <Input
                    id="window"
                    type="number"
                    min={1}
                    max={30}
                    value={form.voteWindowDays}
                    onChange={(e) =>
                      update("voteWindowDays", Number(e.target.value))
                    }
                    className="h-9"
                    data-ocid="proposal_create.window_input"
                  />
                  <p className="text-xs text-muted-foreground">Open period</p>
                </div>
              </div>

              <div className="flex justify-between pt-2">
                <Button
                  variant="outline"
                  onClick={() => setSection(2)}
                  data-ocid="proposal_create.back_step3_btn"
                >
                  Back
                </Button>
                <Button
                  onClick={() => setSection(4)}
                  data-ocid="proposal_create.next_step3_btn"
                >
                  Review & Submit
                </Button>
              </div>
            </CardContent>
          </Card>
        )}

        {/* ── Section 4: Review & Submit ── */}
        {section === 4 && (
          <Card>
            <CardContent className="p-6 space-y-5">
              <h2 className="font-semibold text-foreground text-base">
                Review & Submit
              </h2>
              <div className="rounded-lg border border-border bg-muted/30 p-4 space-y-3 text-sm">
                <div className="flex gap-2">
                  <span className="text-muted-foreground w-28 flex-shrink-0">
                    Title
                  </span>
                  <span className="font-medium text-foreground">
                    {form.title || "—"}
                  </span>
                </div>
                <div className="flex gap-2">
                  <span className="text-muted-foreground w-28 flex-shrink-0">
                    Type
                  </span>
                  <span className="font-medium text-foreground">
                    {typeInfo?.label ?? form.proposalType}
                  </span>
                </div>
                <div className="flex gap-2">
                  <span className="text-muted-foreground w-28 flex-shrink-0">
                    Mechanism
                  </span>
                  <span className="font-medium text-foreground">
                    {mechInfo?.label ?? form.mechanism}
                  </span>
                </div>
                <div className="flex gap-2">
                  <span className="text-muted-foreground w-28 flex-shrink-0">
                    Quorum
                  </span>
                  <span className="font-medium text-foreground">
                    {form.quorumPercent}%
                  </span>
                </div>
                <div className="flex gap-2">
                  <span className="text-muted-foreground w-28 flex-shrink-0">
                    Sponsors needed
                  </span>
                  <span className="font-medium text-foreground">
                    {form.sponsorThreshold}
                  </span>
                </div>
                <div className="flex gap-2">
                  <span className="text-muted-foreground w-28 flex-shrink-0">
                    Vote window
                  </span>
                  <span className="font-medium text-foreground">
                    {form.voteWindowDays} days
                  </span>
                </div>
                <div className="flex gap-2">
                  <span className="text-muted-foreground w-28 flex-shrink-0 pt-0.5">
                    Description
                  </span>
                  <span className="text-foreground/80 line-clamp-3">
                    {form.description || "—"}
                  </span>
                </div>
              </div>

              <div className="flex justify-between pt-2">
                <Button
                  variant="outline"
                  onClick={() => setSection(3)}
                  data-ocid="proposal_create.back_step4_btn"
                >
                  Back
                </Button>
                <Button
                  onClick={handleSubmit}
                  disabled={submitting}
                  className="gap-2"
                  data-ocid="proposal_create.submit_btn"
                >
                  {submitting && <Loader2 size={14} className="animate-spin" />}
                  {submitting ? "Submitting…" : "Submit Proposal"}
                </Button>
              </div>
            </CardContent>
          </Card>
        )}
      </div>
    </Layout>
  );
}
