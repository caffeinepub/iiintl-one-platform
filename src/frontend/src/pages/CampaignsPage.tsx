import { type Campaign, CampaignType } from "@/backend";
import { Layout } from "@/components/Layout";
import { RoleGate } from "@/components/RoleGate";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
} from "@/components/ui/card";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
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
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Textarea } from "@/components/ui/textarea";
import { useAuth } from "@/context/AuthContext";
import { useI18n } from "@/context/I18nContext";
import { MOCK_ORGANIZATIONS, type OrgRegion } from "@/data/mockData";
import { useBackend } from "@/hooks/useBackend";
import { cn } from "@/lib/utils";
import { Link } from "@tanstack/react-router";
import {
  ArrowRight,
  Calendar,
  CheckCircle2,
  Globe,
  Grid3x3,
  LayoutList,
  Loader2,
  Megaphone,
  Plus,
  Search,
  Star,
  Users,
  Zap,
} from "lucide-react";
import type { Variants } from "motion/react";
import { motion } from "motion/react";
import { useCallback, useEffect, useState } from "react";
import { toast } from "sonner";

const containerVariants: Variants = {
  hidden: { opacity: 0 },
  visible: { opacity: 1, transition: { staggerChildren: 0.06 } },
};

const cardVariants: Variants = {
  hidden: { opacity: 0, y: 20 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.3 } },
};

type BackendCampaignStatus = "active" | "completed" | "draft" | "archived";
type FilterTab = "all" | BackendCampaignStatus;

const CAMPAIGN_TYPE_LABELS: Record<string, string> = {
  action: "Action",
  awareness: "Awareness",
  fundraiser: "Fundraiser",
  petition: "Petition",
};

const CAMPAIGN_TYPE_COLORS: Record<string, string> = {
  action: "bg-orange-50 text-orange-700 border-orange-200",
  awareness: "bg-blue-50 text-blue-700 border-blue-200",
  fundraiser: "bg-emerald-50 text-emerald-700 border-emerald-200",
  petition: "bg-indigo-50 text-indigo-700 border-indigo-200",
};

const STATUS_COLORS: Record<string, string> = {
  active: "bg-emerald-50 text-emerald-700 border-emerald-200",
  completed: "bg-slate-50 text-slate-600 border-slate-200",
  draft: "bg-amber-50 text-amber-700 border-amber-200",
  archived: "bg-red-50 text-red-600 border-red-200",
};

const ORG_REGIONS: OrgRegion[] = [
  "Global",
  "Americas",
  "Europe",
  "Africa",
  "Asia-Pacific",
  "Middle East",
  "Caribbean",
  "South Asia",
];

function bigintToDate(ns: bigint): Date {
  return new Date(Number(ns) / 1_000_000);
}

function dateToBigint(dateStr: string): bigint {
  return BigInt(new Date(dateStr).getTime()) * 1_000_000n;
}

function getCampaignProgress(campaign: Campaign): number {
  if (!campaign.goal || campaign.goal === 0n) return 0;
  return Math.min(
    100,
    Math.round((Number(campaign.progress) / Number(campaign.goal)) * 100),
  );
}

function CreateCampaignDialog({
  open,
  onOpenChange,
  onCreated,
}: {
  open: boolean;
  onOpenChange: (v: boolean) => void;
  onCreated: () => void;
}) {
  const backend = useBackend();
  const [title, setTitle] = useState("");
  const [campaignType, setCampaignType] = useState<CampaignType>(
    CampaignType.petition,
  );
  const [orgId, setOrgId] = useState("");
  const [description, setDescription] = useState("");
  const [goal, setGoal] = useState("");
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");
  const [tags, setTags] = useState("");
  const [saving, setSaving] = useState(false);

  async function handleSubmit() {
    if (!title.trim()) return;
    if (!backend) {
      toast.error("Not connected to backend. Please log in.");
      return;
    }
    setSaving(true);
    try {
      const tagList = tags
        .split(",")
        .map((t) => t.trim())
        .filter(Boolean);
      const goalBig = goal ? BigInt(Math.round(Number(goal))) : 0n;
      const startBig = startDate
        ? dateToBigint(startDate)
        : BigInt(Date.now()) * 1_000_000n;
      const endBig = endDate
        ? dateToBigint(endDate)
        : startBig + BigInt(90 * 24 * 60 * 60) * 1_000_000_000n;

      await backend.createCampaign(
        title.trim(),
        description.trim(),
        campaignType,
        orgId,
        goalBig,
        startBig,
        endBig,
        tagList,
      );
      toast.success("Campaign created successfully!");
      onOpenChange(false);
      onCreated();
      setTitle("");
      setCampaignType(CampaignType.petition);
      setOrgId("");
      setDescription("");
      setGoal("");
      setStartDate("");
      setEndDate("");
      setTags("");
    } catch (err) {
      toast.error("Failed to create campaign. Please try again.");
      console.error(err);
    } finally {
      setSaving(false);
    }
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent
        className="sm:max-w-xl max-h-[90vh] overflow-y-auto"
        data-ocid="campaigns.create_campaign.modal"
      >
        <DialogHeader>
          <DialogTitle className="font-display text-xl">
            Create Campaign
          </DialogTitle>
          <DialogDescription>
            Launch a new civic campaign on the IIIntl One Platform.
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-4 py-2">
          <div className="space-y-1.5">
            <Label htmlFor="camp-title" className="text-sm font-medium">
              Campaign Title <span className="text-destructive">*</span>
            </Label>
            <Input
              id="camp-title"
              placeholder="e.g. Global Climate Justice Summit 2026"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              data-ocid="campaigns.create_campaign.input"
            />
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div className="space-y-1.5">
              <Label className="text-sm font-medium">Campaign Type</Label>
              <Select
                value={campaignType}
                onValueChange={(v) => setCampaignType(v as CampaignType)}
              >
                <SelectTrigger data-ocid="campaigns.create_campaign.select">
                  <SelectValue placeholder="Select type" />
                </SelectTrigger>
                <SelectContent>
                  {Object.values(CampaignType).map((ct) => (
                    <SelectItem key={ct} value={ct}>
                      {CAMPAIGN_TYPE_LABELS[ct] ?? ct}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-1.5">
              <Label className="text-sm font-medium">Organization</Label>
              <Select value={orgId} onValueChange={setOrgId}>
                <SelectTrigger data-ocid="campaigns.create_campaign.select">
                  <SelectValue placeholder="Select org" />
                </SelectTrigger>
                <SelectContent>
                  {MOCK_ORGANIZATIONS.map((org) => (
                    <SelectItem key={org.id} value={org.id}>
                      {org.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>

          <div className="space-y-1.5">
            <Label htmlFor="camp-desc" className="text-sm font-medium">
              Description
            </Label>
            <Textarea
              id="camp-desc"
              placeholder="Describe this campaign's mission and approach..."
              rows={3}
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              data-ocid="campaigns.create_campaign.textarea"
            />
          </div>

          <div className="space-y-1.5">
            <Label htmlFor="camp-goal" className="text-sm font-medium">
              Goal (numeric target)
            </Label>
            <Input
              id="camp-goal"
              type="number"
              min="0"
              placeholder="e.g. 10000 (signatures, participants, etc.)"
              value={goal}
              onChange={(e) => setGoal(e.target.value)}
              data-ocid="campaigns.create_campaign.input"
            />
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div className="space-y-1.5">
              <Label htmlFor="camp-start" className="text-sm font-medium">
                Start Date
              </Label>
              <Input
                id="camp-start"
                type="date"
                value={startDate}
                onChange={(e) => setStartDate(e.target.value)}
                data-ocid="campaigns.create_campaign.input"
              />
            </div>
            <div className="space-y-1.5">
              <Label htmlFor="camp-end" className="text-sm font-medium">
                End Date (optional)
              </Label>
              <Input
                id="camp-end"
                type="date"
                value={endDate}
                onChange={(e) => setEndDate(e.target.value)}
                data-ocid="campaigns.create_campaign.input"
              />
            </div>
          </div>

          <div className="space-y-1.5">
            <Label htmlFor="camp-tags" className="text-sm font-medium">
              Tags (comma-separated)
            </Label>
            <Input
              id="camp-tags"
              placeholder="e.g. climate, youth, africa"
              value={tags}
              onChange={(e) => setTags(e.target.value)}
              data-ocid="campaigns.create_campaign.input"
            />
          </div>
        </div>

        <DialogFooter className="gap-2">
          <Button
            variant="outline"
            onClick={() => onOpenChange(false)}
            data-ocid="campaigns.create_campaign.cancel_button"
          >
            Cancel
          </Button>
          <Button
            onClick={handleSubmit}
            disabled={!title.trim() || saving}
            data-ocid="campaigns.create_campaign.submit_button"
          >
            {saving ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Creating...
              </>
            ) : (
              "Create Campaign"
            )}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}

function CampaignCard({
  campaign,
  index,
  viewMode,
  onJoinLeave,
}: {
  campaign: Campaign;
  index: number;
  viewMode: "grid" | "list";
  onJoinLeave: (campaignId: string, joined: boolean) => Promise<void>;
}) {
  const [joined, setJoined] = useState(false);
  const [actionLoading, setActionLoading] = useState(false);

  const typeKey =
    typeof campaign.campaignType === "object"
      ? Object.keys(campaign.campaignType as object)[0]
      : String(campaign.campaignType);
  const statusKey =
    typeof campaign.status === "object"
      ? Object.keys(campaign.status as object)[0]
      : String(campaign.status);

  const typeLabel = CAMPAIGN_TYPE_LABELS[typeKey] ?? typeKey;
  const typeColor = CAMPAIGN_TYPE_COLORS[typeKey] ?? "";
  const statusColor = STATUS_COLORS[statusKey] ?? "";
  const progressPct = getCampaignProgress(campaign);

  const startDateObj = bigintToDate(campaign.startDate);
  const endDateObj = bigintToDate(campaign.endDate);

  async function handleJoinLeave() {
    setActionLoading(true);
    try {
      await onJoinLeave(campaign.id, joined);
      setJoined(!joined);
    } catch {
      // error handled by parent
    } finally {
      setActionLoading(false);
    }
  }

  if (viewMode === "list") {
    return (
      <motion.div variants={cardVariants} data-ocid={`campaigns.item.${index}`}>
        <Card className="border-border hover:shadow-md transition-all duration-200 group">
          <CardContent className="px-4 py-3">
            <div className="flex items-start gap-4">
              {/* Status dot */}
              <div
                className={cn(
                  "w-2.5 h-2.5 rounded-full flex-shrink-0 mt-1.5",
                  statusKey === "active"
                    ? "bg-emerald-500"
                    : statusKey === "draft"
                      ? "bg-amber-500"
                      : statusKey === "completed"
                        ? "bg-slate-400"
                        : "bg-red-400",
                )}
              />
              {/* Main content */}
              <div className="flex-1 min-w-0">
                <div className="flex flex-wrap items-center gap-2 mb-1">
                  <Badge
                    variant="outline"
                    className={cn("text-[10px] px-1.5 py-0 h-4", typeColor)}
                  >
                    {typeLabel}
                  </Badge>
                  <Badge
                    variant="outline"
                    className={cn(
                      "text-[10px] px-1.5 py-0 h-4 font-semibold",
                      statusColor,
                    )}
                  >
                    {statusKey}
                  </Badge>
                </div>
                <h3 className="font-display font-semibold text-foreground text-sm group-hover:text-primary transition-colors">
                  {campaign.title}
                </h3>
                <p className="text-xs text-muted-foreground mt-0.5">
                  Org: {campaign.orgId}
                </p>
              </div>

              {/* Stats */}
              <div className="hidden sm:flex items-center gap-4 flex-shrink-0 text-xs text-muted-foreground">
                <span className="flex items-center gap-1">
                  <Users size={11} />
                  {Number(campaign.supporterCount).toLocaleString()}
                </span>
                <span className="flex items-center gap-1">
                  <Star size={11} />
                  {progressPct}%
                </span>
              </div>

              {/* Actions */}
              <div className="flex items-center gap-2 flex-shrink-0">
                <Button
                  size="sm"
                  variant={joined ? "secondary" : "outline"}
                  className="h-7 text-xs"
                  onClick={handleJoinLeave}
                  disabled={actionLoading}
                  data-ocid={`campaigns.join_button.${index}`}
                >
                  {actionLoading ? (
                    <Loader2 size={10} className="animate-spin" />
                  ) : joined ? (
                    "Joined ✓"
                  ) : (
                    "Join"
                  )}
                </Button>
                <Button
                  asChild
                  size="sm"
                  className="h-7 text-xs"
                  data-ocid={`campaigns.view_button.${index}`}
                >
                  <Link to="/campaigns/$id" params={{ id: campaign.id }}>
                    View
                  </Link>
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>
      </motion.div>
    );
  }

  // Grid mode
  return (
    <motion.div variants={cardVariants} data-ocid={`campaigns.item.${index}`}>
      <Card className="h-full flex flex-col border-border hover:shadow-md transition-all duration-200 group overflow-hidden">
        {/* Type color accent */}
        <div
          className={cn(
            "h-0.5 w-full",
            typeKey === "petition" && "bg-indigo-400",
            typeKey === "fundraiser" && "bg-emerald-400",
            typeKey === "awareness" && "bg-blue-400",
            typeKey === "action" && "bg-orange-400",
          )}
        />

        <CardHeader className="pb-2 pt-4 px-4">
          <div className="flex flex-wrap gap-1.5 mb-2">
            <Badge
              variant="outline"
              className={cn("text-[10px] px-1.5 py-0 h-4", typeColor)}
            >
              {typeLabel}
            </Badge>
            <Badge
              variant="outline"
              className={cn(
                "text-[10px] px-1.5 py-0 h-4 font-semibold",
                statusColor,
              )}
            >
              {statusKey}
            </Badge>
          </div>

          <h3 className="font-display font-semibold text-foreground text-sm leading-snug group-hover:text-primary transition-colors">
            {campaign.title}
          </h3>
          <div className="flex items-center gap-1.5 mt-1 text-[11px] text-muted-foreground">
            <Globe size={10} />
            <span className="truncate">Org: {campaign.orgId}</span>
          </div>
        </CardHeader>

        <CardContent className="px-4 pb-3 flex-1 space-y-3">
          <p className="text-xs text-muted-foreground leading-relaxed line-clamp-2">
            {campaign.description}
          </p>

          {/* Progress bar */}
          {campaign.goal > 0n && (
            <div className="space-y-1">
              <div className="flex items-center justify-between text-[10px] text-muted-foreground">
                <span>
                  {Number(campaign.progress).toLocaleString()} progress
                </span>
                <span>{progressPct}%</span>
              </div>
              <Progress value={progressPct} className="h-1.5" />
              <p className="text-[10px] text-muted-foreground">
                of {Number(campaign.goal).toLocaleString()} goal
              </p>
            </div>
          )}

          {/* Stats row */}
          <div className="flex items-center gap-3 pt-1 border-t border-border/60 text-[11px] text-muted-foreground">
            <span className="flex items-center gap-1">
              <Users size={10} />
              <strong className="text-foreground">
                {Number(campaign.supporterCount).toLocaleString()}
              </strong>{" "}
              supporters
            </span>
            <span className="flex items-center gap-1">
              <Zap size={10} />
              <strong className="text-foreground">{progressPct}%</strong>{" "}
              complete
            </span>
          </div>

          {/* Dates */}
          <div className="flex items-center gap-1 text-[10px] text-muted-foreground">
            <Calendar size={10} />
            <span>
              {startDateObj.toLocaleDateString("en-US", {
                month: "short",
                day: "numeric",
                year: "numeric",
              })}
              {" → "}
              {endDateObj.toLocaleDateString("en-US", {
                month: "short",
                day: "numeric",
                year: "numeric",
              })}
            </span>
          </div>

          {/* Tags */}
          {campaign.tags.length > 0 && (
            <div className="flex flex-wrap gap-1">
              {campaign.tags.slice(0, 3).map((tag) => (
                <span
                  key={tag}
                  className="text-[10px] bg-secondary text-muted-foreground px-1.5 py-0.5 rounded"
                >
                  #{tag}
                </span>
              ))}
              {campaign.tags.length > 3 && (
                <span className="text-[10px] text-muted-foreground px-1 py-0.5">
                  +{campaign.tags.length - 3} more
                </span>
              )}
            </div>
          )}
        </CardContent>

        <CardFooter className="px-4 pb-4 pt-0 flex items-center gap-2">
          <Button
            asChild
            variant="default"
            size="sm"
            className="flex-1 h-8 text-xs gap-1.5"
            data-ocid={`campaigns.view_button.${index}`}
          >
            <Link to="/campaigns/$id" params={{ id: campaign.id }}>
              View Campaign <ArrowRight size={11} />
            </Link>
          </Button>

          <Button
            size="sm"
            variant={joined ? "secondary" : "outline"}
            className="h-8 text-xs px-3"
            onClick={handleJoinLeave}
            disabled={actionLoading}
            data-ocid={`campaigns.join_button.${index}`}
          >
            {actionLoading ? (
              <Loader2 size={10} className="animate-spin" />
            ) : joined ? (
              "Joined ✓"
            ) : (
              "Join"
            )}
          </Button>
        </CardFooter>
      </Card>
    </motion.div>
  );
}

export function CampaignsPage() {
  const { user } = useAuth();
  const { t } = useI18n();
  const backend = useBackend();

  const [campaigns, setCampaigns] = useState<Campaign[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const [search, setSearch] = useState("");
  const [activeTab, setActiveTab] = useState<FilterTab>("all");
  const [typeFilter, setTypeFilter] = useState<string>("all");
  const [regionFilter, setRegionFilter] = useState<string>("all");
  const [viewMode, setViewMode] = useState<"grid" | "list">("grid");
  const [createOpen, setCreateOpen] = useState(false);

  const canCreate =
    user?.role === "super_admin" ||
    user?.role === "admin" ||
    user?.role === "org_admin";

  const loadCampaigns = useCallback(async () => {
    if (!backend) return;
    setLoading(true);
    setError(null);
    try {
      const data = await backend.listCampaigns();
      setCampaigns(data);
    } catch (err) {
      setError("Failed to load campaigns. Please try again.");
      console.error(err);
    } finally {
      setLoading(false);
    }
  }, [backend]);

  useEffect(() => {
    loadCampaigns();
  }, [loadCampaigns]);

  async function handleJoinLeave(campaignId: string, currentlyJoined: boolean) {
    if (!backend) {
      toast.error("Please log in to join campaigns.");
      return;
    }
    try {
      if (currentlyJoined) {
        await backend.leaveCampaign(campaignId);
        toast.success("Left campaign.");
      } else {
        await backend.joinCampaign(campaignId);
        toast.success("Joined campaign!");
      }
      await loadCampaigns();
    } catch (err) {
      toast.error("Action failed. Please try again.");
      console.error(err);
    }
  }

  const getStatusKey = (campaign: Campaign): string => {
    return typeof campaign.status === "object"
      ? Object.keys(campaign.status as object)[0]
      : String(campaign.status);
  };

  const getTypeKey = (campaign: Campaign): string => {
    return typeof campaign.campaignType === "object"
      ? Object.keys(campaign.campaignType as object)[0]
      : String(campaign.campaignType);
  };

  const filtered = campaigns.filter((c) => {
    const q = search.toLowerCase();
    const matchesSearch =
      !search ||
      c.title.toLowerCase().includes(q) ||
      c.description.toLowerCase().includes(q) ||
      c.tags.some((tag) => tag.toLowerCase().includes(q));

    const statusKey = getStatusKey(c);
    const matchesTab = activeTab === "all" || statusKey === activeTab;

    const typeKey = getTypeKey(c);
    const matchesType = typeFilter === "all" || typeKey === typeFilter;

    return matchesSearch && matchesTab && matchesType;
  });

  // Stats derived from loaded campaigns
  const activeCount = campaigns.filter(
    (c) => getStatusKey(c) === "active",
  ).length;
  const totalSupporters = campaigns.reduce(
    (sum, c) => sum + Number(c.supporterCount),
    0,
  );
  const draftCount = campaigns.filter(
    (c) => getStatusKey(c) === "draft",
  ).length;
  const completedCount = campaigns.filter(
    (c) => getStatusKey(c) === "completed",
  ).length;

  const tabCounts: Record<string, number> = {
    all: campaigns.length,
    active: activeCount,
    draft: draftCount,
    completed: completedCount,
    archived: campaigns.filter((c) => getStatusKey(c) === "archived").length,
  };

  return (
    <Layout breadcrumb={t.campaigns.title}>
      <div className="p-6 max-w-7xl mx-auto">
        {/* ── Page Header ── */}
        <motion.div
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3 }}
          className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 mb-6"
        >
          <div>
            <h1 className="text-2xl font-display font-bold text-primary tracking-tight flex items-center gap-2.5">
              <Megaphone size={22} className="opacity-80" />
              {t.campaigns.title}
            </h1>
            <p className="text-muted-foreground text-sm mt-1">
              {t.campaigns.subtitle}
            </p>
            <div className="mt-3 civic-rule w-12" />
          </div>

          {canCreate && (
            <Button
              size="sm"
              className="gap-2 h-9 self-start sm:self-auto flex-shrink-0"
              onClick={() => setCreateOpen(true)}
              data-ocid="campaigns.create_campaign.open_modal_button"
            >
              <Plus size={14} />
              {t.campaigns.createCampaign}
            </Button>
          )}
        </motion.div>

        {/* ── Stats Bar ── */}
        <motion.div
          initial={{ opacity: 0, y: 8 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3, delay: 0.04 }}
          className="grid grid-cols-2 sm:grid-cols-4 gap-3 mb-6"
        >
          {[
            {
              label: "Active Campaigns",
              value: loading ? "—" : activeCount,
              icon: <Megaphone size={15} className="text-emerald-600" />,
              bg: "bg-emerald-50",
            },
            {
              label: "Total Supporters",
              value: loading ? "—" : totalSupporters.toLocaleString(),
              icon: <Users size={15} className="text-blue-600" />,
              bg: "bg-blue-50",
            },
            {
              label: "Completed",
              value: loading ? "—" : completedCount,
              icon: <CheckCircle2 size={15} className="text-indigo-600" />,
              bg: "bg-indigo-50",
            },
            {
              label: "Drafts",
              value: loading ? "—" : draftCount,
              icon: <Zap size={15} className="text-amber-600" />,
              bg: "bg-amber-50",
            },
          ].map((stat) => (
            <div
              key={stat.label}
              className={cn(
                "rounded-lg border border-border p-3 flex items-center gap-3",
                stat.bg,
              )}
            >
              <div className="bg-white rounded-md p-1.5 shadow-xs flex-shrink-0">
                {stat.icon}
              </div>
              <div>
                <p className="font-display font-bold text-lg leading-none text-foreground">
                  {stat.value}
                </p>
                <p className="text-[11px] text-muted-foreground mt-0.5">
                  {stat.label}
                </p>
              </div>
            </div>
          ))}
        </motion.div>

        {/* ── Search + Filter Bar ── */}
        <motion.div
          initial={{ opacity: 0, y: 8 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3, delay: 0.07 }}
          className="space-y-3 mb-5"
        >
          {/* Row 1: Search + View Toggle */}
          <div className="flex gap-3">
            <div className="relative flex-1 max-w-sm">
              <Search
                size={14}
                className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground"
              />
              <Input
                placeholder="Search campaigns, tags..."
                className="pl-8 h-9 text-sm"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                data-ocid="campaigns.search_input"
              />
            </div>

            <div className="flex items-center gap-1 border border-border rounded-md p-0.5">
              <Button
                variant={viewMode === "grid" ? "secondary" : "ghost"}
                size="sm"
                className="h-7 w-7 p-0"
                onClick={() => setViewMode("grid")}
                data-ocid="campaigns.grid_toggle.button"
              >
                <Grid3x3 size={13} />
              </Button>
              <Button
                variant={viewMode === "list" ? "secondary" : "ghost"}
                size="sm"
                className="h-7 w-7 p-0"
                onClick={() => setViewMode("list")}
                data-ocid="campaigns.list_toggle.button"
              >
                <LayoutList size={13} />
              </Button>
            </div>
          </div>

          {/* Row 2: Status Tabs + Type Filter */}
          <div className="flex flex-wrap gap-3">
            <Tabs
              value={activeTab}
              onValueChange={(v) => setActiveTab(v as FilterTab)}
            >
              <TabsList className="h-9">
                {(
                  [
                    { value: "all", label: "All" },
                    { value: "active", label: "Active" },
                    { value: "draft", label: "Drafts" },
                    { value: "completed", label: "Completed" },
                    { value: "archived", label: "Archived" },
                  ] as const
                ).map((tab) => (
                  <TabsTrigger
                    key={tab.value}
                    value={tab.value}
                    className="text-xs px-3"
                    data-ocid="campaigns.status_filter.tab"
                  >
                    {tab.label}
                    {!loading && tabCounts[tab.value] > 0 && (
                      <span className="ml-1.5 text-[10px] bg-secondary text-secondary-foreground rounded-full px-1.5 py-0">
                        {tabCounts[tab.value]}
                      </span>
                    )}
                  </TabsTrigger>
                ))}
              </TabsList>
            </Tabs>

            <Select value={typeFilter} onValueChange={setTypeFilter}>
              <SelectTrigger
                className="w-44 h-9 text-xs"
                data-ocid="campaigns.type_filter.select"
              >
                <SelectValue placeholder="All types" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Types</SelectItem>
                {Object.values(CampaignType).map((ct) => (
                  <SelectItem key={ct} value={ct}>
                    {CAMPAIGN_TYPE_LABELS[ct] ?? ct}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>

            <Select value={regionFilter} onValueChange={setRegionFilter}>
              <SelectTrigger
                className="w-36 h-9 text-xs"
                data-ocid="campaigns.region_filter.select"
              >
                <SelectValue placeholder="All regions" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Regions</SelectItem>
                {ORG_REGIONS.map((r) => (
                  <SelectItem key={r} value={r}>
                    {r}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </motion.div>

        {/* ── Results count ── */}
        {!loading && (search || typeFilter !== "all") && (
          <p className="text-xs text-muted-foreground mb-4">
            Showing {filtered.length} of {campaigns.length} campaigns
          </p>
        )}

        {/* ── Loading State ── */}
        {loading && (
          <div
            className="flex flex-col items-center justify-center py-24 gap-3"
            data-ocid="campaigns.loading_state"
          >
            <Loader2 size={32} className="animate-spin text-primary/50" />
            <p className="text-sm text-muted-foreground">
              Loading campaigns...
            </p>
          </div>
        )}

        {/* ── Error State ── */}
        {!loading && error && (
          <div
            className="flex flex-col items-center justify-center py-24 text-center gap-3"
            data-ocid="campaigns.error_state"
          >
            <p className="text-sm text-destructive">{error}</p>
            <Button size="sm" variant="outline" onClick={loadCampaigns}>
              Try Again
            </Button>
          </div>
        )}

        {/* ── Campaign Cards ── */}
        {!loading &&
          !error &&
          (filtered.length === 0 ? (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="flex flex-col items-center justify-center py-24 text-center"
              data-ocid="campaigns.empty_state"
            >
              <div className="w-16 h-16 rounded-2xl bg-secondary flex items-center justify-center mb-4">
                <Megaphone size={24} className="text-muted-foreground/50" />
              </div>
              <h3 className="font-display font-semibold text-foreground mb-1">
                No campaigns found
              </h3>
              <p className="text-sm text-muted-foreground max-w-xs">
                {search
                  ? `No campaigns match "${search}". Try a different search term.`
                  : "No campaigns match your current filters."}
              </p>
              {canCreate && (
                <Button
                  size="sm"
                  className="mt-4 gap-2"
                  onClick={() => setCreateOpen(true)}
                >
                  <Plus size={13} />
                  Create First Campaign
                </Button>
              )}
            </motion.div>
          ) : viewMode === "grid" ? (
            <motion.div
              variants={containerVariants}
              initial="hidden"
              animate="visible"
              className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4"
            >
              {filtered.map((campaign, i) => (
                <CampaignCard
                  key={campaign.id}
                  campaign={campaign}
                  index={i + 1}
                  viewMode="grid"
                  onJoinLeave={handleJoinLeave}
                />
              ))}
            </motion.div>
          ) : (
            <motion.div
              variants={containerVariants}
              initial="hidden"
              animate="visible"
              className="space-y-2"
            >
              {filtered.map((campaign, i) => (
                <CampaignCard
                  key={campaign.id}
                  campaign={campaign}
                  index={i + 1}
                  viewMode="list"
                  onJoinLeave={handleJoinLeave}
                />
              ))}
            </motion.div>
          ))}
      </div>

      {/* Create Campaign Modal */}
      <RoleGate roles={["super_admin", "admin", "org_admin"]}>
        <CreateCampaignDialog
          open={createOpen}
          onOpenChange={setCreateOpen}
          onCreated={loadCampaigns}
        />
      </RoleGate>
    </Layout>
  );
}
