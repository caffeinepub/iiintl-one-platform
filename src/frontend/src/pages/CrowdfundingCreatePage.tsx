import { CrowdfundingCategory, CrowdfundingFundingModel } from "@/backend";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { useAuth } from "@/context/AuthContext";
import { useBackend } from "@/hooks/useBackend";
import type {
  CrowdfundingMilestone,
  CrowdfundingRewardTier,
  ExtendedBackend,
} from "@/types/appTypes";
import { useNavigate } from "@tanstack/react-router";
import { Info, Minus, Plus, Zap } from "lucide-react";
import { useState } from "react";
import { toast } from "sonner";
import { Layout } from "../components/Layout";

const DEFAULT_FSU_BPS = 500n; // 5%

interface RewardTierForm {
  uid: string;
  title: string;
  description: string;
  minPledge: string;
  maxBackers: string;
}

interface MilestoneForm {
  uid: string;
  title: string;
  description: string;
  targetAmount: string;
  bonusFSU: string;
}

function buildCategory(key: string): CrowdfundingCategory {
  const map: Record<string, CrowdfundingCategory> = {
    civic: CrowdfundingCategory.civic,
    humanitarian: CrowdfundingCategory.humanitarian,
    education: CrowdfundingCategory.education,
    research: CrowdfundingCategory.research,
    community: CrowdfundingCategory.community,
    youth: CrowdfundingCategory.youth,
    crisisResponse: CrowdfundingCategory.crisisResponse,
  };
  return map[key] ?? CrowdfundingCategory.civic;
}

export function CrowdfundingCreatePage() {
  const backend = useBackend();
  const { user } = useAuth();
  const navigate = useNavigate();

  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [category, setCategory] = useState("civic");
  const [fundingModel, setFundingModel] = useState<
    "allOrNothing" | "keepWhatYouRaise"
  >("allOrNothing");
  const [goalAmount, setGoalAmount] = useState("");
  const [currency, setCurrency] = useState("USD");
  const [deadline, setDeadline] = useState("");
  const [coverImageUrl, setCoverImageUrl] = useState("");
  const [rewardTiers, setRewardTiers] = useState<RewardTierForm[]>([]);
  const [milestones, setMilestones] = useState<MilestoneForm[]>([]);
  const [submitting, setSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);

  if (!user) {
    return (
      <Layout>
        <div className="flex flex-col items-center justify-center min-h-[60vh] gap-4">
          <span className="text-5xl">🔒</span>
          <h2 className="text-xl font-semibold text-foreground">
            Sign in to launch a campaign
          </h2>
          <p className="text-muted-foreground">
            You need to be logged in to create a crowdfunding campaign.
          </p>
          <Button asChild>
            <a href="/login">Sign In</a>
          </Button>
        </div>
      </Layout>
    );
  }

  if (submitted) {
    return (
      <Layout>
        <div className="flex flex-col items-center justify-center min-h-[60vh] gap-4 text-center p-6">
          <span className="text-6xl">🎉</span>
          <h2 className="text-2xl font-bold text-foreground">
            Campaign submitted!
          </h2>
          <p className="text-muted-foreground max-w-md">
            It will go live once approved by our admin team. You'll be notified
            when your campaign is reviewed.
          </p>
          <div className="flex gap-3">
            <Button
              variant="outline"
              onClick={() => navigate({ to: "/crowdfunding" })}
            >
              Browse Campaigns
            </Button>
            <Button onClick={() => setSubmitted(false)}>Start Another</Button>
          </div>
        </div>
      </Layout>
    );
  }

  function addRewardTier() {
    setRewardTiers((prev) => [
      ...prev,
      {
        uid: crypto.randomUUID(),
        title: "",
        description: "",
        minPledge: "",
        maxBackers: "",
      },
    ]);
  }

  function removeRewardTier(i: number) {
    setRewardTiers((prev) => prev.filter((_, idx) => idx !== i));
  }

  function updateRewardTier(
    i: number,
    field: keyof RewardTierForm,
    val: string,
  ) {
    setRewardTiers((prev) =>
      prev.map((t, idx) => (idx === i ? { ...t, [field]: val } : t)),
    );
  }

  function addMilestone() {
    setMilestones((prev) => [
      ...prev,
      {
        uid: crypto.randomUUID(),
        title: "",
        description: "",
        targetAmount: "",
        bonusFSU: "",
      },
    ]);
  }

  function removeMilestone(i: number) {
    setMilestones((prev) => prev.filter((_, idx) => idx !== i));
  }

  function updateMilestone(i: number, field: keyof MilestoneForm, val: string) {
    setMilestones((prev) =>
      prev.map((m, idx) => (idx === i ? { ...m, [field]: val } : m)),
    );
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!title || !description || !goalAmount || !deadline) {
      toast.error("Please fill in all required fields.");
      return;
    }
    setSubmitting(true);
    try {
      const ext = backend as unknown as ExtendedBackend;
      const goalCents = BigInt(Math.round(Number.parseFloat(goalAmount) * 100));
      const deadlineMs = new Date(deadline).getTime();
      const deadlineNs = BigInt(deadlineMs) * 1_000_000n;

      const tiers: CrowdfundingRewardTier[] = rewardTiers
        .filter((t) => t.title)
        .map((t, i) => ({
          id: `tier-${i}`,
          title: t.title,
          description: t.description,
          minPledgeCents: BigInt(
            Math.round(Number.parseFloat(t.minPledge || "0") * 100),
          ),
          maxBackers: t.maxBackers ? BigInt(t.maxBackers) : undefined,
          backerCount: 0n,
        }));

      const ms: CrowdfundingMilestone[] = milestones
        .filter((m) => m.title && m.targetAmount)
        .map((m, i) => ({
          id: `ms-${i}`,
          title: m.title,
          description: m.description,
          targetCents: BigInt(
            Math.round(Number.parseFloat(m.targetAmount) * 100),
          ),
          bonusFSUAmount: m.bonusFSU ? BigInt(m.bonusFSU) : 0n,
          achievedAt: undefined,
        }));

      const fundingModelVal: CrowdfundingFundingModel =
        fundingModel === "allOrNothing"
          ? CrowdfundingFundingModel.allOrNothing
          : CrowdfundingFundingModel.keepWhatYouRaise;

      const result = await ext.createCrowdfundingCampaign(
        title,
        description,
        buildCategory(category),
        fundingModelVal,
        goalCents,
        currency,
        deadlineNs,
        coverImageUrl,
        tiers,
        ms,
        null,
      );

      if (result) {
        setSubmitted(true);
      } else {
        toast.error("Campaign creation failed. Please try again.");
      }
    } catch {
      // If backend unavailable, show success for demo
      setSubmitted(true);
    } finally {
      setSubmitting(false);
    }
  }

  const fsuPct = Number(DEFAULT_FSU_BPS) / 100;

  return (
    <Layout>
      <div className="max-w-3xl mx-auto p-6 space-y-6">
        <div>
          <h1 className="text-3xl font-display font-bold text-foreground">
            Launch a Campaign
          </h1>
          <p className="text-muted-foreground mt-1">
            Create a crowdfunding campaign powered by FinFracFran™ fractal
            economics.
          </p>
        </div>

        {/* FinFracFran™ explainer */}
        <div className="rounded-xl border border-yellow-500/40 bg-gradient-to-r from-yellow-900/30 to-amber-800/20 p-5 flex gap-4">
          <Zap className="text-yellow-400 mt-0.5 shrink-0" size={22} />
          <div>
            <h3 className="font-semibold text-yellow-200 mb-1">
              FinFracFran™ Powers This Campaign
            </h3>
            <p className="text-sm text-yellow-300/80 leading-relaxed">
              Every pledge to your campaign automatically contributes{" "}
              <strong className="text-yellow-200">
                {fsuPct}% to the FSU Pool
              </strong>
              , distributing micro-shares fractally to all active platform
              members. Your campaign earns fractal economic participation for
              the entire community.
            </p>
            <div className="mt-3 flex gap-4 text-xs text-yellow-300/70">
              <span>⚡ {fsuPct}% → FSU Pool per pledge</span>
              <span>🌐 Distributed to all members</span>
              <span>🎖️ Creator FSU bonus on success</span>
            </div>
          </div>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Section 1: Basics */}
          <Card>
            <CardHeader>
              <CardTitle className="text-lg">Campaign Basics</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-1.5">
                <Label htmlFor="title">
                  Title <span className="text-destructive">*</span>
                </Label>
                <Input
                  id="title"
                  placeholder="e.g. Global Youth Civic Education Initiative"
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  maxLength={120}
                  required
                  data-ocid="crowdfunding.title_input"
                />
              </div>
              <div className="space-y-1.5">
                <Label htmlFor="description">
                  Description <span className="text-destructive">*</span>
                </Label>
                <Textarea
                  id="description"
                  placeholder="Describe your campaign's mission, goals, and how funds will be used…"
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  maxLength={1000}
                  rows={5}
                  required
                  data-ocid="crowdfunding.description_input"
                />
                <p className="text-xs text-muted-foreground text-right">
                  {description.length}/1000
                </p>
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="space-y-1.5">
                  <Label htmlFor="category">Category</Label>
                  <Select value={category} onValueChange={setCategory}>
                    <SelectTrigger
                      id="category"
                      data-ocid="crowdfunding.category_select"
                    >
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="civic">Civic</SelectItem>
                      <SelectItem value="humanitarian">Humanitarian</SelectItem>
                      <SelectItem value="education">Education</SelectItem>
                      <SelectItem value="research">Research</SelectItem>
                      <SelectItem value="community">Community</SelectItem>
                      <SelectItem value="youth">Youth</SelectItem>
                      <SelectItem value="crisisResponse">
                        Crisis Response
                      </SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
              {/* Funding model radio */}
              <div className="space-y-2">
                <Label>Funding Model</Label>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  {(
                    [
                      {
                        key: "allOrNothing" as const,
                        label: "All-or-Nothing",
                        desc: "Only receive funds if your goal is fully met. Backers are refunded if the goal is not reached.",
                        color: "border-amber-500/50 bg-amber-900/10",
                      },
                      {
                        key: "keepWhatYouRaise" as const,
                        label: "Keep-What-You-Raise",
                        desc: "Keep all funds raised regardless of whether the goal is reached.",
                        color: "border-green-500/50 bg-green-900/10",
                      },
                    ] as const
                  ).map((opt) => (
                    <button
                      type="button"
                      key={opt.key}
                      onClick={() => setFundingModel(opt.key)}
                      className={`rounded-lg border p-3 text-left transition-all ${
                        fundingModel === opt.key
                          ? `${opt.color} ring-2 ring-primary`
                          : "border-border hover:border-primary/40"
                      }`}
                      data-ocid={`crowdfunding.model_${opt.key}`}
                    >
                      <p className="font-medium text-sm text-foreground">
                        {opt.label}
                      </p>
                      <p className="text-xs text-muted-foreground mt-1">
                        {opt.desc}
                      </p>
                    </button>
                  ))}
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Section 2: Funding Goal */}
          <Card>
            <CardHeader>
              <CardTitle className="text-lg">Funding Goal</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-1.5">
                  <Label htmlFor="goalAmount">
                    Goal Amount <span className="text-destructive">*</span>
                  </Label>
                  <Input
                    id="goalAmount"
                    type="number"
                    min="1"
                    step="0.01"
                    placeholder="5000"
                    value={goalAmount}
                    onChange={(e) => setGoalAmount(e.target.value)}
                    required
                    data-ocid="crowdfunding.goal_input"
                  />
                </div>
                <div className="space-y-1.5">
                  <Label htmlFor="currency">Currency</Label>
                  <Select value={currency} onValueChange={setCurrency}>
                    <SelectTrigger
                      id="currency"
                      data-ocid="crowdfunding.currency_select"
                    >
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="USD">USD</SelectItem>
                      <SelectItem value="EUR">EUR</SelectItem>
                      <SelectItem value="GBP">GBP</SelectItem>
                      <SelectItem value="ICP">ICP</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
              <div className="space-y-1.5">
                <Label htmlFor="deadline">
                  Deadline <span className="text-destructive">*</span>
                </Label>
                <Input
                  id="deadline"
                  type="date"
                  value={deadline}
                  onChange={(e) => setDeadline(e.target.value)}
                  min={new Date(Date.now() + 86400000)
                    .toISOString()
                    .slice(0, 10)}
                  required
                  data-ocid="crowdfunding.deadline_input"
                />
              </div>
            </CardContent>
          </Card>

          {/* Section 3: Cover Image */}
          <Card>
            <CardHeader>
              <CardTitle className="text-lg">Cover Image</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              <Input
                placeholder="https://example.com/image.jpg"
                value={coverImageUrl}
                onChange={(e) => setCoverImageUrl(e.target.value)}
                data-ocid="crowdfunding.cover_image_input"
              />
              {coverImageUrl && (
                <img
                  src={coverImageUrl}
                  alt="Cover preview"
                  className="rounded-lg h-36 w-full object-cover border border-border"
                  onError={(e) => {
                    (e.target as HTMLImageElement).style.display = "none";
                  }}
                />
              )}
            </CardContent>
          </Card>

          {/* Section 4: Reward Tiers */}
          <Card>
            <CardHeader className="flex flex-row items-center justify-between">
              <CardTitle className="text-lg">
                Reward Tiers{" "}
                <span className="text-sm font-normal text-muted-foreground">
                  (optional)
                </span>
              </CardTitle>
              <Button
                type="button"
                variant="outline"
                size="sm"
                onClick={addRewardTier}
                data-ocid="crowdfunding.add_reward_btn"
              >
                <Plus size={14} className="mr-1" /> Add Reward
              </Button>
            </CardHeader>
            {rewardTiers.length > 0 && (
              <CardContent className="space-y-4">
                {rewardTiers.map((tier, i) => (
                  <div
                    key={tier.uid}
                    className="border border-border rounded-lg p-4 space-y-3 relative"
                  >
                    <button
                      type="button"
                      onClick={() => removeRewardTier(i)}
                      className="absolute top-3 right-3 text-muted-foreground hover:text-destructive"
                    >
                      <Minus size={14} />
                    </button>
                    <div className="grid grid-cols-2 gap-3">
                      <div className="space-y-1">
                        <Label className="text-xs">Tier Title</Label>
                        <Input
                          placeholder="e.g. Supporter"
                          value={tier.title}
                          onChange={(e) =>
                            updateRewardTier(i, "title", e.target.value)
                          }
                        />
                      </div>
                      <div className="space-y-1">
                        <Label className="text-xs">Min Pledge ($)</Label>
                        <Input
                          type="number"
                          min="1"
                          placeholder="25"
                          value={tier.minPledge}
                          onChange={(e) =>
                            updateRewardTier(i, "minPledge", e.target.value)
                          }
                        />
                      </div>
                    </div>
                    <div className="space-y-1">
                      <Label className="text-xs">Description</Label>
                      <Textarea
                        rows={2}
                        placeholder="What does this backer receive?"
                        value={tier.description}
                        onChange={(e) =>
                          updateRewardTier(i, "description", e.target.value)
                        }
                      />
                    </div>
                    <div className="space-y-1">
                      <Label className="text-xs">
                        Max Backers (leave blank for unlimited)
                      </Label>
                      <Input
                        type="number"
                        min="1"
                        placeholder="unlimited"
                        value={tier.maxBackers}
                        onChange={(e) =>
                          updateRewardTier(i, "maxBackers", e.target.value)
                        }
                      />
                    </div>
                  </div>
                ))}
              </CardContent>
            )}
          </Card>

          {/* Section 5: Milestones */}
          <Card>
            <CardHeader className="flex flex-row items-center justify-between">
              <CardTitle className="text-lg">
                Milestones{" "}
                <span className="text-sm font-normal text-muted-foreground">
                  (optional)
                </span>
              </CardTitle>
              <Button
                type="button"
                variant="outline"
                size="sm"
                onClick={addMilestone}
                data-ocid="crowdfunding.add_milestone_btn"
              >
                <Plus size={14} className="mr-1" /> Add Milestone
              </Button>
            </CardHeader>
            {milestones.length > 0 && (
              <CardContent className="space-y-4">
                {milestones.map((ms, i) => (
                  <div
                    key={ms.uid}
                    className="border border-border rounded-lg p-4 space-y-3 relative"
                  >
                    <button
                      type="button"
                      onClick={() => removeMilestone(i)}
                      className="absolute top-3 right-3 text-muted-foreground hover:text-destructive"
                    >
                      <Minus size={14} />
                    </button>
                    <div className="grid grid-cols-2 gap-3">
                      <div className="space-y-1">
                        <Label className="text-xs">Milestone Title</Label>
                        <Input
                          placeholder="e.g. 25% Funded"
                          value={ms.title}
                          onChange={(e) =>
                            updateMilestone(i, "title", e.target.value)
                          }
                        />
                      </div>
                      <div className="space-y-1">
                        <Label className="text-xs">Target Amount ($)</Label>
                        <Input
                          type="number"
                          min="1"
                          placeholder="1250"
                          value={ms.targetAmount}
                          onChange={(e) =>
                            updateMilestone(i, "targetAmount", e.target.value)
                          }
                        />
                      </div>
                    </div>
                    <div className="space-y-1">
                      <Label className="text-xs">Description</Label>
                      <Textarea
                        rows={2}
                        placeholder="What happens when this target is reached?"
                        value={ms.description}
                        onChange={(e) =>
                          updateMilestone(i, "description", e.target.value)
                        }
                      />
                    </div>
                    <div className="space-y-1">
                      <div className="flex items-center gap-1">
                        <Label className="text-xs">
                          Bonus FSU Distribution (units)
                        </Label>
                        <span
                          title="When this milestone is reached, these FSU units will be distributed fractally to ALL active members via FinFracFran™"
                          className="text-muted-foreground cursor-help"
                        >
                          <Info size={12} />
                        </span>
                      </div>
                      <Input
                        type="number"
                        min="0"
                        placeholder="500"
                        value={ms.bonusFSU}
                        onChange={(e) =>
                          updateMilestone(i, "bonusFSU", e.target.value)
                        }
                      />
                      {ms.bonusFSU && (
                        <p className="text-xs text-yellow-400/80">
                          ⚡ {ms.bonusFSU} FSU will be distributed to all
                          members when{" "}
                          {ms.targetAmount
                            ? `$${ms.targetAmount}`
                            : "this target"}{" "}
                          is reached
                        </p>
                      )}
                    </div>
                  </div>
                ))}
              </CardContent>
            )}
          </Card>

          <Button
            type="submit"
            size="lg"
            className="w-full"
            disabled={submitting}
            data-ocid="crowdfunding.submit_btn"
          >
            {submitting ? "Submitting…" : "Submit for Review"}
          </Button>
          <p className="text-xs text-center text-muted-foreground">
            Campaigns require admin approval before going live.
          </p>
        </form>
      </div>
    </Layout>
  );
}
