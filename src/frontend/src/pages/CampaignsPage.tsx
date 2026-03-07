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
import {
  type CampaignCategory,
  type CampaignStatus,
  MOCK_CAMPAIGNS,
  MOCK_CTAS,
  MOCK_ORGANIZATIONS,
  MOCK_PETITIONS,
  type OrgRegion,
  getCampaignCategoryColor,
  getCampaignStatusBadgeClasses,
} from "@/data/mockData";
import { cn } from "@/lib/utils";
import { Link } from "@tanstack/react-router";
import {
  ArrowRight,
  Calendar,
  CheckCircle2,
  Globe,
  Grid3x3,
  LayoutList,
  Megaphone,
  PenSquare,
  Plus,
  Search,
  Star,
  Users,
  Zap,
} from "lucide-react";
import type { Variants } from "motion/react";
import { motion } from "motion/react";
import { useState } from "react";

const containerVariants: Variants = {
  hidden: { opacity: 0 },
  visible: { opacity: 1, transition: { staggerChildren: 0.06 } },
};

const cardVariants: Variants = {
  hidden: { opacity: 0, y: 20 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.3 } },
};

type FilterTab = "all" | CampaignStatus;

const CAMPAIGN_CATEGORIES: CampaignCategory[] = [
  "Climate Justice",
  "Digital Rights",
  "Labor Rights",
  "Electoral Reform",
  "Women's Rights",
  "Peace & Diplomacy",
  "Economic Justice",
  "Human Rights",
  "Youth Empowerment",
  "Immigration",
];

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

function CreateCampaignDialog({
  open,
  onOpenChange,
}: {
  open: boolean;
  onOpenChange: (v: boolean) => void;
}) {
  const [title, setTitle] = useState("");
  const [category, setCategory] = useState("");
  const [orgId, setOrgId] = useState("");
  const [region, setRegion] = useState("");
  const [description, setDescription] = useState("");
  const [goal, setGoal] = useState("");
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");
  const [tags, setTags] = useState("");
  const [saving, setSaving] = useState(false);

  function handleSubmit() {
    if (!title.trim()) return;
    setSaving(true);
    setTimeout(() => {
      setSaving(false);
      onOpenChange(false);
      setTitle("");
      setCategory("");
      setOrgId("");
      setRegion("");
      setDescription("");
      setGoal("");
      setStartDate("");
      setEndDate("");
      setTags("");
    }, 900);
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
              <Label className="text-sm font-medium">Category</Label>
              <Select value={category} onValueChange={setCategory}>
                <SelectTrigger data-ocid="campaigns.create_campaign.select">
                  <SelectValue placeholder="Select category" />
                </SelectTrigger>
                <SelectContent>
                  {CAMPAIGN_CATEGORIES.map((cat) => (
                    <SelectItem key={cat} value={cat}>
                      {cat}
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
            <Label className="text-sm font-medium">Region</Label>
            <Select value={region} onValueChange={setRegion}>
              <SelectTrigger data-ocid="campaigns.create_campaign.select">
                <SelectValue placeholder="Select region" />
              </SelectTrigger>
              <SelectContent>
                {ORG_REGIONS.map((r) => (
                  <SelectItem key={r} value={r}>
                    {r}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
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
              Campaign Goal
            </Label>
            <Textarea
              id="camp-goal"
              placeholder="What specific outcome does this campaign aim to achieve?"
              rows={2}
              value={goal}
              onChange={(e) => setGoal(e.target.value)}
              data-ocid="campaigns.create_campaign.textarea"
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
            {saving ? "Creating..." : "Create Campaign"}
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
}: {
  campaign: (typeof MOCK_CAMPAIGNS)[0];
  index: number;
  viewMode: "grid" | "list";
}) {
  const [joined, setJoined] = useState(false);

  const petition = MOCK_PETITIONS.find((p) => p.campaignId === campaign.id);
  const ctaCount = MOCK_CTAS.filter((c) => c.campaignId === campaign.id).length;

  const catColor = getCampaignCategoryColor(campaign.category);
  const statusColor = getCampaignStatusBadgeClasses(campaign.status);

  const sigPct = petition
    ? Math.round((petition.currentSignatures / petition.targetSignatures) * 100)
    : 0;

  if (viewMode === "list") {
    return (
      <motion.div variants={cardVariants} data-ocid={`campaigns.item.${index}`}>
        <Card
          className={cn(
            "border-border hover:shadow-md transition-all duration-200 group",
            campaign.featured && "ring-1 ring-amber-200 bg-amber-50/30",
          )}
        >
          <CardContent className="px-4 py-3">
            <div className="flex items-start gap-4">
              {/* Left: Status dot */}
              <div
                className={cn(
                  "w-2.5 h-2.5 rounded-full flex-shrink-0 mt-1.5",
                  campaign.status === "active"
                    ? "bg-emerald-500"
                    : campaign.status === "upcoming"
                      ? "bg-amber-500"
                      : campaign.status === "paused"
                        ? "bg-orange-400"
                        : "bg-slate-400",
                )}
              />

              {/* Main content */}
              <div className="flex-1 min-w-0">
                <div className="flex flex-wrap items-center gap-2 mb-1">
                  <Badge
                    variant="outline"
                    className={cn("text-[10px] px-1.5 py-0 h-4", catColor)}
                  >
                    {campaign.category}
                  </Badge>
                  <Badge
                    variant="outline"
                    className={cn(
                      "text-[10px] px-1.5 py-0 h-4 font-semibold",
                      statusColor,
                    )}
                  >
                    {campaign.status}
                  </Badge>
                  {campaign.featured && (
                    <Badge
                      variant="outline"
                      className="text-[10px] px-1.5 py-0 h-4 bg-amber-50 text-amber-700 border-amber-200"
                    >
                      <Star size={8} className="mr-0.5 fill-amber-500" />
                      Featured
                    </Badge>
                  )}
                </div>

                <h3 className="font-display font-semibold text-foreground text-sm group-hover:text-primary transition-colors">
                  {campaign.title}
                </h3>
                <p className="text-xs text-muted-foreground mt-0.5">
                  {campaign.organization} · {campaign.region}
                </p>
              </div>

              {/* Stats */}
              <div className="hidden sm:flex items-center gap-4 flex-shrink-0 text-xs text-muted-foreground">
                <span className="flex items-center gap-1">
                  <Users size={11} />
                  {campaign.participantCount.toLocaleString()}
                </span>
                <span className="flex items-center gap-1">
                  <Zap size={11} />
                  {ctaCount}
                </span>
              </div>

              {/* Actions */}
              <div className="flex items-center gap-2 flex-shrink-0">
                <Button
                  size="sm"
                  variant={joined ? "secondary" : "outline"}
                  className="h-7 text-xs"
                  onClick={() => setJoined(!joined)}
                  data-ocid={`campaigns.join_button.${index}`}
                >
                  {joined ? "Joined ✓" : "Join"}
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
      <Card
        className={cn(
          "h-full flex flex-col border-border hover:shadow-md transition-all duration-200 group overflow-hidden",
          campaign.featured &&
            "ring-1 ring-amber-200 shadow-sm shadow-amber-100",
        )}
      >
        {/* Category color accent */}
        <div
          className={cn(
            "h-0.5 w-full",
            campaign.category === "Climate Justice" && "bg-green-400",
            campaign.category === "Digital Rights" && "bg-blue-400",
            campaign.category === "Labor Rights" && "bg-orange-400",
            campaign.category === "Electoral Reform" && "bg-indigo-400",
            campaign.category === "Women's Rights" && "bg-pink-400",
            campaign.category === "Peace & Diplomacy" && "bg-sky-400",
            campaign.category === "Youth Empowerment" && "bg-purple-400",
            campaign.category === "Human Rights" && "bg-red-400",
            campaign.category === "Economic Justice" && "bg-yellow-400",
            campaign.category === "Immigration" && "bg-teal-400",
          )}
        />

        <CardHeader className="pb-2 pt-4 px-4">
          <div className="flex flex-wrap gap-1.5 mb-2">
            <Badge
              variant="outline"
              className={cn("text-[10px] px-1.5 py-0 h-4", catColor)}
            >
              {campaign.category}
            </Badge>
            <Badge
              variant="outline"
              className={cn(
                "text-[10px] px-1.5 py-0 h-4 font-semibold",
                statusColor,
              )}
            >
              {campaign.status}
            </Badge>
            {campaign.featured && (
              <Badge
                variant="outline"
                className="text-[10px] px-1.5 py-0 h-4 bg-amber-50 text-amber-700 border-amber-200 ml-auto"
              >
                <Star size={8} className="mr-0.5 fill-amber-500" />
                Featured
              </Badge>
            )}
          </div>

          <h3 className="font-display font-semibold text-foreground text-sm leading-snug group-hover:text-primary transition-colors">
            {campaign.title}
          </h3>
          <div className="flex items-center gap-1.5 mt-1 text-[11px] text-muted-foreground">
            <Globe size={10} />
            <span>
              {campaign.organization} · {campaign.region}
            </span>
          </div>
        </CardHeader>

        <CardContent className="px-4 pb-3 flex-1 space-y-3">
          <p className="text-xs text-muted-foreground leading-relaxed line-clamp-2">
            {campaign.description}
          </p>

          {/* Petition progress */}
          {petition && (
            <div className="space-y-1">
              <div className="flex items-center justify-between text-[10px] text-muted-foreground">
                <span>
                  {petition.currentSignatures.toLocaleString()} signatures
                </span>
                <span>{sigPct}%</span>
              </div>
              <Progress value={sigPct} className="h-1.5" />
              <p className="text-[10px] text-muted-foreground">
                of {petition.targetSignatures.toLocaleString()} target
              </p>
            </div>
          )}

          {/* Stats row */}
          <div className="flex items-center gap-3 pt-1 border-t border-border/60 text-[11px] text-muted-foreground">
            <span className="flex items-center gap-1">
              <Users size={10} />
              <strong className="text-foreground">
                {campaign.participantCount.toLocaleString()}
              </strong>{" "}
              joined
            </span>
            <span className="flex items-center gap-1">
              <Zap size={10} />
              <strong className="text-foreground">
                {campaign.actionCount.toLocaleString()}
              </strong>{" "}
              actions
            </span>
          </div>

          {/* Dates */}
          <div className="flex items-center gap-1 text-[10px] text-muted-foreground">
            <Calendar size={10} />
            <span>
              {new Date(campaign.startDate).toLocaleDateString("en-US", {
                month: "short",
                day: "numeric",
                year: "numeric",
              })}
              {campaign.endDate &&
                ` → ${new Date(campaign.endDate).toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" })}`}
            </span>
          </div>

          {/* Tags */}
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
            onClick={() => setJoined(!joined)}
            data-ocid={`campaigns.join_button.${index}`}
          >
            {joined ? "Joined ✓" : "Join"}
          </Button>
        </CardFooter>
      </Card>
    </motion.div>
  );
}

export function CampaignsPage() {
  const { user } = useAuth();
  const [search, setSearch] = useState("");
  const [activeTab, setActiveTab] = useState<FilterTab>("all");
  const [categoryFilter, setCategoryFilter] = useState<string>("all");
  const [regionFilter, setRegionFilter] = useState<string>("all");
  const [viewMode, setViewMode] = useState<"grid" | "list">("grid");
  const [createOpen, setCreateOpen] = useState(false);

  const canCreate =
    user?.role === "super_admin" ||
    user?.role === "admin" ||
    user?.role === "org_admin";

  const filtered = MOCK_CAMPAIGNS.filter((c) => {
    const q = search.toLowerCase();
    const matchesSearch =
      !search ||
      c.title.toLowerCase().includes(q) ||
      c.organization.toLowerCase().includes(q) ||
      c.tags.some((t) => t.toLowerCase().includes(q));

    const matchesTab = activeTab === "all" || c.status === activeTab;

    const matchesCat =
      categoryFilter === "all" || c.category === categoryFilter;

    const matchesRegion = regionFilter === "all" || c.region === regionFilter;

    return matchesSearch && matchesTab && matchesCat && matchesRegion;
  });

  // Stats
  const activeCount = MOCK_CAMPAIGNS.filter(
    (c) => c.status === "active",
  ).length;
  const totalParticipants = MOCK_CAMPAIGNS.reduce(
    (sum, c) => sum + c.participantCount,
    0,
  );
  const totalPetitions = MOCK_PETITIONS.length;
  const totalCTAs = MOCK_CTAS.length;

  return (
    <Layout breadcrumb="Campaigns">
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
              Campaigns
            </h1>
            <p className="text-muted-foreground text-sm mt-1">
              Discover, launch, and participate in civic campaigns worldwide.
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
              Create Campaign
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
              value: activeCount,
              icon: <Megaphone size={15} className="text-emerald-600" />,
              bg: "bg-emerald-50",
            },
            {
              label: "Total Participants",
              value: totalParticipants.toLocaleString(),
              icon: <Users size={15} className="text-blue-600" />,
              bg: "bg-blue-50",
            },
            {
              label: "Petitions",
              value: totalPetitions,
              icon: <CheckCircle2 size={15} className="text-indigo-600" />,
              bg: "bg-indigo-50",
            },
            {
              label: "Calls to Action",
              value: totalCTAs,
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
                placeholder="Search campaigns, orgs, tags..."
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

          {/* Row 2: Status Tabs + Category/Region Filters */}
          <div className="flex flex-wrap gap-3">
            <Tabs
              value={activeTab}
              onValueChange={(v) => setActiveTab(v as FilterTab)}
            >
              <TabsList className="h-9">
                {(
                  [
                    {
                      value: "all",
                      label: "All",
                      count: MOCK_CAMPAIGNS.length,
                    },
                    {
                      value: "active",
                      label: "Active",
                      count: MOCK_CAMPAIGNS.filter((c) => c.status === "active")
                        .length,
                    },
                    {
                      value: "upcoming",
                      label: "Upcoming",
                      count: MOCK_CAMPAIGNS.filter(
                        (c) => c.status === "upcoming",
                      ).length,
                    },
                    {
                      value: "completed",
                      label: "Completed",
                      count: MOCK_CAMPAIGNS.filter(
                        (c) => c.status === "completed",
                      ).length,
                    },
                    {
                      value: "paused",
                      label: "Paused",
                      count: MOCK_CAMPAIGNS.filter((c) => c.status === "paused")
                        .length,
                    },
                  ] as const
                ).map((tab) => (
                  <TabsTrigger
                    key={tab.value}
                    value={tab.value}
                    className="text-xs px-3"
                    data-ocid="campaigns.status_filter.tab"
                  >
                    {tab.label}
                    {tab.count > 0 && (
                      <span className="ml-1.5 text-[10px] bg-secondary text-secondary-foreground rounded-full px-1.5 py-0">
                        {tab.count}
                      </span>
                    )}
                  </TabsTrigger>
                ))}
              </TabsList>
            </Tabs>

            <Select value={categoryFilter} onValueChange={setCategoryFilter}>
              <SelectTrigger
                className="w-44 h-9 text-xs"
                data-ocid="campaigns.category_filter.select"
              >
                <SelectValue placeholder="All categories" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Categories</SelectItem>
                {CAMPAIGN_CATEGORIES.map((cat) => (
                  <SelectItem key={cat} value={cat}>
                    {cat}
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
        {(search || categoryFilter !== "all" || regionFilter !== "all") && (
          <p className="text-xs text-muted-foreground mb-4">
            Showing {filtered.length} of {MOCK_CAMPAIGNS.length} campaigns
          </p>
        )}

        {/* ── Campaign Cards ── */}
        {filtered.length === 0 ? (
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
              />
            ))}
          </motion.div>
        )}
      </div>

      {/* Create Campaign Modal */}
      <RoleGate roles={["super_admin", "admin", "org_admin"]}>
        <CreateCampaignDialog open={createOpen} onOpenChange={setCreateOpen} />
      </RoleGate>
    </Layout>
  );
}
