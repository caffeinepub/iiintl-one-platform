import { Layout } from "@/components/Layout";
import { RoleGate } from "@/components/RoleGate";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
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
import { Separator } from "@/components/ui/separator";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Textarea } from "@/components/ui/textarea";
import { useAuth } from "@/context/AuthContext";
import {
  type CampaignCategory,
  MOCK_MEMBERS,
  getCTAsByCampaignId,
  getCampaignById,
  getCampaignCategoryColor,
  getCampaignStatusBadgeClasses,
  getPetitionsByCampaignId,
  getUpdatesByCampaignId,
} from "@/data/mockData";
import { cn } from "@/lib/utils";
import { Link, useParams } from "@tanstack/react-router";
import {
  AlertTriangle,
  Archive,
  ArrowLeft,
  Award,
  BookOpen,
  Calendar,
  Camera,
  CheckCircle2,
  Clock,
  ExternalLink,
  FileText,
  Globe,
  Megaphone,
  PauseCircle,
  PenSquare,
  Settings,
  Star,
  Target,
  TrendingUp,
  Tv,
  UserPlus,
  Users,
  Zap,
} from "lucide-react";
import type { Variants } from "motion/react";
import { motion } from "motion/react";
import { useState } from "react";

const itemVariants: Variants = {
  hidden: { opacity: 0, y: 12 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.3 } },
};

const containerVariants: Variants = {
  hidden: { opacity: 0 },
  visible: { opacity: 1, transition: { staggerChildren: 0.07 } },
};

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

function CTAIcon({ type }: { type: string }) {
  switch (type) {
    case "contact_official":
      return <PenSquare size={16} className="text-blue-600" />;
    case "share_content":
      return <Megaphone size={16} className="text-pink-600" />;
    case "attend_event":
      return <Calendar size={16} className="text-green-600" />;
    case "donate":
      return <Star size={16} className="text-amber-600" />;
    case "volunteer":
      return <UserPlus size={16} className="text-purple-600" />;
    case "sign_petition":
      return <CheckCircle2 size={16} className="text-emerald-600" />;
    case "write_letter":
      return <FileText size={16} className="text-indigo-600" />;
    default:
      return <Zap size={16} className="text-amber-600" />;
  }
}

function CTAIconBg({ type }: { type: string }) {
  switch (type) {
    case "contact_official":
      return "bg-blue-50";
    case "share_content":
      return "bg-pink-50";
    case "attend_event":
      return "bg-green-50";
    case "donate":
      return "bg-amber-50";
    case "volunteer":
      return "bg-purple-50";
    case "sign_petition":
      return "bg-emerald-50";
    case "write_letter":
      return "bg-indigo-50";
    default:
      return "bg-secondary";
  }
}

function UpdateIcon({ type }: { type: string }) {
  switch (type) {
    case "milestone":
      return <Award size={14} className="text-amber-600" />;
    case "media":
      return <Tv size={14} className="text-blue-600" />;
    case "action":
      return <Zap size={14} className="text-emerald-600" />;
    default:
      return <BookOpen size={14} className="text-muted-foreground" />;
  }
}

function UpdateIconBg({ type }: { type: string }) {
  switch (type) {
    case "milestone":
      return "bg-amber-50";
    case "media":
      return "bg-blue-50";
    case "action":
      return "bg-emerald-50";
    default:
      return "bg-secondary";
  }
}

function formatDate(dateStr: string) {
  return new Date(dateStr).toLocaleDateString("en-US", {
    month: "long",
    day: "numeric",
    year: "numeric",
  });
}

function DaysLeft({ endDate }: { endDate: string }) {
  const end = new Date(endDate);
  const now = new Date();
  const diff = Math.ceil(
    (end.getTime() - now.getTime()) / (1000 * 60 * 60 * 24),
  );
  if (diff < 0) return <span className="text-red-600">Deadline passed</span>;
  if (diff === 0)
    return <span className="text-red-500 font-semibold">Last day!</span>;
  return (
    <span
      className={cn(
        "font-semibold",
        diff <= 7
          ? "text-red-500"
          : diff <= 30
            ? "text-amber-600"
            : "text-foreground",
      )}
    >
      {diff} days left
    </span>
  );
}

export function CampaignDetailPage() {
  const { id } = useParams({ strict: false }) as { id?: string };
  const { user } = useAuth();
  const [joined, setJoined] = useState(false);
  const [activeTab, setActiveTab] = useState("overview");
  const [signatureCount, setSignatureCount] = useState<number | null>(null);
  const [signed, setSigned] = useState(false);
  const [confirmAction, setConfirmAction] = useState<
    "pause" | "archive" | null
  >(null);
  const [ctaFilter, setCtaFilter] = useState("all");

  const campaign = id ? getCampaignById(id) : null;

  const isAdminRole =
    user?.role === "super_admin" ||
    user?.role === "admin" ||
    user?.role === "org_admin";

  if (!campaign) {
    return (
      <Layout breadcrumb="Campaigns › Not Found">
        <div
          className="p-6 flex flex-col items-center justify-center py-24 text-center"
          data-ocid="campaign_detail.error_state"
        >
          <div className="w-16 h-16 rounded-2xl bg-secondary flex items-center justify-center mb-4">
            <Megaphone size={24} className="text-muted-foreground/50" />
          </div>
          <h3 className="font-display font-bold text-xl text-foreground mb-2">
            Campaign Not Found
          </h3>
          <p className="text-sm text-muted-foreground mb-6 max-w-xs">
            This campaign doesn't exist or may have been removed.
          </p>
          <Button asChild variant="outline">
            <Link to="/campaigns">
              <ArrowLeft size={14} className="mr-2" />
              Back to Campaigns
            </Link>
          </Button>
        </div>
      </Layout>
    );
  }

  const petitions = getPetitionsByCampaignId(campaign.id);
  const ctas = getCTAsByCampaignId(campaign.id);
  const updates = getUpdatesByCampaignId(campaign.id);
  const petition = petitions[0] ?? null;

  const displayedSignatures =
    signatureCount ?? petition?.currentSignatures ?? 0;
  const sigPct = petition
    ? Math.round((displayedSignatures / petition.targetSignatures) * 100)
    : 0;

  const catColor = getCampaignCategoryColor(campaign.category);
  const statusColor = getCampaignStatusBadgeClasses(campaign.status);

  const filteredCTAs =
    ctaFilter === "all" ? ctas : ctas.filter((c) => c.type === ctaFilter);

  function handleSign() {
    if (signed || !petition) return;
    setSigned(true);
    setSignatureCount(displayedSignatures + 1);
  }

  return (
    <Layout breadcrumb={`Campaigns › ${campaign.title}`}>
      <div className="max-w-6xl mx-auto">
        {/* ── Hero Banner ── */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.4 }}
          className="relative overflow-hidden civic-gradient"
        >
          <div
            className="absolute inset-0 opacity-10"
            style={{
              backgroundImage:
                "radial-gradient(circle at 20% 50%, white 1px, transparent 1px), radial-gradient(circle at 80% 20%, white 1px, transparent 1px)",
              backgroundSize: "60px 60px",
            }}
          />
          <div className="relative px-6 py-8">
            {/* Back link */}
            <Button
              asChild
              variant="ghost"
              size="sm"
              className="text-white/70 hover:text-white hover:bg-white/10 h-8 gap-1.5 mb-4 -ml-1"
              data-ocid="campaign_detail.back_button"
            >
              <Link to="/campaigns">
                <ArrowLeft size={14} />
                Campaigns
              </Link>
            </Button>

            <div className="flex flex-col sm:flex-row sm:items-end gap-4">
              <div className="flex-1 min-w-0">
                <div className="flex flex-wrap items-center gap-2 mb-2">
                  <Badge
                    className={cn(
                      "text-[10px] px-2 py-0.5 font-semibold border-0",
                      catColor,
                    )}
                  >
                    {campaign.category}
                  </Badge>
                  <Badge
                    className={cn(
                      "text-[10px] px-2 py-0.5 font-semibold border-0",
                      statusColor,
                    )}
                  >
                    {campaign.status}
                  </Badge>
                  {campaign.featured && (
                    <Badge className="text-[10px] px-2 py-0.5 bg-amber-100 text-amber-800 border-0">
                      <Star
                        size={8}
                        className="mr-0.5 fill-amber-600 text-amber-600"
                      />
                      Featured
                    </Badge>
                  )}
                </div>

                <h1 className="text-2xl font-display font-bold text-white tracking-tight">
                  {campaign.title}
                </h1>
                <div className="flex flex-wrap items-center gap-3 mt-1.5 text-white/70 text-xs">
                  <span className="flex items-center gap-1">
                    <Globe size={11} />
                    {campaign.organization}
                  </span>
                  <span className="flex items-center gap-1">
                    <Target size={11} />
                    {campaign.region}
                  </span>
                  <span className="flex items-center gap-1">
                    <Users size={11} />
                    By {campaign.createdBy}
                  </span>
                </div>
              </div>

              <div className="flex gap-2 flex-shrink-0">
                <Button
                  size="sm"
                  className={cn(
                    "h-8 text-xs font-semibold",
                    joined
                      ? "bg-white/20 text-white border border-white/30 hover:bg-white/30"
                      : "bg-white text-primary hover:bg-white/90",
                  )}
                  onClick={() => setJoined(!joined)}
                  data-ocid="campaign_detail.join_button"
                >
                  {joined ? "✓ Joined" : "Join Campaign"}
                </Button>
                <RoleGate roles={["super_admin", "admin", "org_admin"]}>
                  <Button
                    size="sm"
                    variant="outline"
                    className="h-8 text-xs border-white/30 text-white hover:bg-white/10"
                    onClick={() => setActiveTab("settings")}
                    data-ocid="campaign_detail.edit_button"
                  >
                    <Settings size={12} className="mr-1.5" />
                    Edit
                  </Button>
                </RoleGate>
              </div>
            </div>
          </div>

          {/* Stats bar */}
          <div className="bg-white/10 border-t border-white/10 px-6 py-3 grid grid-cols-2 sm:grid-cols-4 gap-4">
            {[
              {
                label: "Participants",
                value: campaign.participantCount.toLocaleString(),
                icon: <Users size={13} />,
              },
              {
                label: "Actions Done",
                value: campaign.actionCount.toLocaleString(),
                icon: <Zap size={13} />,
              },
              {
                label: "Updates",
                value: campaign.updatesCount,
                icon: <BookOpen size={13} />,
              },
              {
                label: "Started",
                value: new Date(campaign.startDate).toLocaleDateString(
                  "en-US",
                  { month: "short", year: "numeric" },
                ),
                icon: <Calendar size={13} />,
              },
            ].map((stat) => (
              <div key={stat.label} className="flex items-center gap-2">
                <span className="text-white/50">{stat.icon}</span>
                <div>
                  <p className="text-white font-display font-bold text-lg leading-none">
                    {stat.value}
                  </p>
                  <p className="text-white/50 text-[11px]">{stat.label}</p>
                </div>
              </div>
            ))}
          </div>
        </motion.div>

        {/* ── Tabs ── */}
        <div className="px-6 py-4">
          <Tabs value={activeTab} onValueChange={setActiveTab}>
            <TabsList className="mb-4 h-9">
              <TabsTrigger
                value="overview"
                className="text-xs"
                data-ocid="campaign_detail.overview_tab"
              >
                Overview
              </TabsTrigger>
              <TabsTrigger
                value="actions"
                className="text-xs"
                data-ocid="campaign_detail.actions_tab"
              >
                Actions
                {ctas.length > 0 && (
                  <span className="ml-1.5 text-[10px] bg-secondary text-secondary-foreground rounded-full px-1.5 py-0">
                    {ctas.length}
                  </span>
                )}
              </TabsTrigger>
              {petition && (
                <TabsTrigger
                  value="petition"
                  className="text-xs"
                  data-ocid="campaign_detail.petition_tab"
                >
                  Petition
                </TabsTrigger>
              )}
              <TabsTrigger
                value="updates"
                className="text-xs"
                data-ocid="campaign_detail.updates_tab"
              >
                Updates
                {updates.length > 0 && (
                  <span className="ml-1.5 text-[10px] bg-secondary text-secondary-foreground rounded-full px-1.5 py-0">
                    {updates.length}
                  </span>
                )}
              </TabsTrigger>
              {isAdminRole && (
                <TabsTrigger
                  value="settings"
                  className="text-xs"
                  data-ocid="campaign_detail.settings_tab"
                >
                  <Settings size={12} className="mr-1.5" />
                  Settings
                </TabsTrigger>
              )}
            </TabsList>

            {/* ── Overview Tab ── */}
            <TabsContent value="overview">
              <motion.div
                variants={containerVariants}
                initial="hidden"
                animate="visible"
                className="grid grid-cols-1 lg:grid-cols-3 gap-5"
              >
                {/* Main content */}
                <div className="lg:col-span-2 space-y-5">
                  {/* Description */}
                  <motion.div variants={itemVariants}>
                    <Card>
                      <CardHeader className="pb-2 pt-4 px-4">
                        <CardTitle className="text-sm font-semibold flex items-center gap-2">
                          <Megaphone size={14} className="text-primary" />
                          About This Campaign
                        </CardTitle>
                      </CardHeader>
                      <CardContent className="px-4 pb-4">
                        <p className="text-sm text-muted-foreground leading-relaxed">
                          {campaign.description}
                        </p>
                      </CardContent>
                    </Card>
                  </motion.div>

                  {/* Goal callout */}
                  <motion.div variants={itemVariants}>
                    <div className="rounded-lg border border-primary/20 bg-primary/5 p-4">
                      <div className="flex items-start gap-3">
                        <div className="w-8 h-8 rounded-lg bg-primary/10 flex items-center justify-center flex-shrink-0">
                          <Target size={15} className="text-primary" />
                        </div>
                        <div>
                          <h4 className="font-display font-semibold text-sm text-primary mb-1">
                            Campaign Goal
                          </h4>
                          <p className="text-sm text-foreground leading-relaxed">
                            {campaign.goal}
                          </p>
                        </div>
                      </div>
                    </div>
                  </motion.div>

                  {/* Petition preview */}
                  {petition && (
                    <motion.div variants={itemVariants}>
                      <Card className="border-emerald-200 bg-emerald-50/30">
                        <CardContent className="px-4 py-4">
                          <div className="flex items-center justify-between gap-3 mb-3">
                            <h4 className="font-display font-semibold text-sm flex items-center gap-2">
                              <CheckCircle2
                                size={14}
                                className="text-emerald-600"
                              />
                              Active Petition
                            </h4>
                            <Button
                              size="sm"
                              variant="outline"
                              className="h-7 text-xs"
                              onClick={() => setActiveTab("petition")}
                            >
                              View Petition
                            </Button>
                          </div>
                          <p className="text-xs font-semibold text-foreground mb-2">
                            {petition.title}
                          </p>
                          <Progress value={sigPct} className="h-2 mb-2" />
                          <div className="flex items-center justify-between text-xs text-muted-foreground">
                            <span>
                              {displayedSignatures.toLocaleString()} signatures
                            </span>
                            <span>
                              Goal: {petition.targetSignatures.toLocaleString()}
                            </span>
                          </div>
                        </CardContent>
                      </Card>
                    </motion.div>
                  )}

                  {/* Tags */}
                  <motion.div variants={itemVariants}>
                    <Card>
                      <CardContent className="px-4 py-3">
                        <p className="text-xs font-semibold text-muted-foreground mb-2 uppercase tracking-wide">
                          Tags
                        </p>
                        <div className="flex flex-wrap gap-1.5">
                          {campaign.tags.map((tag) => (
                            <span
                              key={tag}
                              className="text-xs bg-secondary text-muted-foreground px-2 py-1 rounded-md"
                            >
                              #{tag}
                            </span>
                          ))}
                        </div>
                      </CardContent>
                    </Card>
                  </motion.div>
                </div>

                {/* Sidebar */}
                <div className="space-y-4">
                  {/* Campaign progress */}
                  {petition && (
                    <motion.div variants={itemVariants}>
                      <Card>
                        <CardHeader className="pb-2 pt-4 px-4">
                          <CardTitle className="text-sm font-semibold flex items-center gap-2">
                            <TrendingUp
                              size={14}
                              className="text-emerald-600"
                            />
                            Signature Progress
                          </CardTitle>
                        </CardHeader>
                        <CardContent className="px-4 pb-4">
                          <div className="text-3xl font-display font-bold text-foreground mb-1">
                            {displayedSignatures.toLocaleString()}
                          </div>
                          <p className="text-xs text-muted-foreground mb-3">
                            of {petition.targetSignatures.toLocaleString()}{" "}
                            target signatures
                          </p>
                          <Progress value={sigPct} className="h-3 mb-2" />
                          <div className="flex items-center justify-between text-xs text-muted-foreground mb-3">
                            <span>{sigPct}% reached</span>
                            {petition.deadline && (
                              <DaysLeft endDate={petition.deadline} />
                            )}
                          </div>
                          <Button
                            size="sm"
                            className="w-full h-8 text-xs"
                            onClick={handleSign}
                            disabled={signed}
                            data-ocid="campaign_detail.sign_petition_button"
                          >
                            {signed ? "✓ Signed!" : "Sign This Petition"}
                          </Button>
                        </CardContent>
                      </Card>
                    </motion.div>
                  )}

                  {/* Organization card */}
                  <motion.div variants={itemVariants}>
                    <Card>
                      <CardHeader className="pb-2 pt-4 px-4">
                        <CardTitle className="text-sm font-semibold flex items-center gap-2">
                          <Globe size={14} className="text-blue-600" />
                          Organization
                        </CardTitle>
                      </CardHeader>
                      <CardContent className="px-4 pb-4">
                        <p className="text-sm font-semibold text-foreground mb-0.5">
                          {campaign.organization}
                        </p>
                        <p className="text-xs text-muted-foreground mb-3">
                          {campaign.region} Region
                        </p>
                        <Button
                          asChild
                          variant="outline"
                          size="sm"
                          className="w-full h-7 text-xs gap-1.5"
                        >
                          <Link
                            to="/organizations/$id"
                            params={{ id: campaign.organizationId }}
                          >
                            View Organization <ExternalLink size={10} />
                          </Link>
                        </Button>
                      </CardContent>
                    </Card>
                  </motion.div>

                  {/* Quick stats */}
                  <motion.div variants={itemVariants}>
                    <Card>
                      <CardContent className="px-4 py-4 space-y-3">
                        {[
                          {
                            label: "Start Date",
                            value: formatDate(campaign.startDate),
                            icon: <Calendar size={13} />,
                          },
                          campaign.endDate
                            ? {
                                label: "End Date",
                                value: formatDate(campaign.endDate),
                                icon: <Clock size={13} />,
                              }
                            : null,
                          {
                            label: "Created by",
                            value: campaign.createdBy,
                            icon: <Users size={13} />,
                          },
                          {
                            label: "Actions",
                            value: `${ctas.length} available`,
                            icon: <Zap size={13} />,
                          },
                        ]
                          .filter(Boolean)
                          .map((item) =>
                            item ? (
                              <div
                                key={item.label}
                                className="flex items-center gap-2 text-xs"
                              >
                                <span className="text-muted-foreground flex-shrink-0">
                                  {item.icon}
                                </span>
                                <span className="text-muted-foreground">
                                  {item.label}:
                                </span>
                                <span className="font-medium text-foreground ml-auto text-right">
                                  {item.value}
                                </span>
                              </div>
                            ) : null,
                          )}
                      </CardContent>
                    </Card>
                  </motion.div>
                </div>
              </motion.div>
            </TabsContent>

            {/* ── Actions Tab ── */}
            <TabsContent value="actions">
              <motion.div
                initial={{ opacity: 0, y: 8 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.25 }}
                className="space-y-4"
              >
                {/* CTA type filter */}
                <div className="flex items-center gap-2 flex-wrap">
                  <span className="text-xs font-medium text-muted-foreground">
                    Filter by type:
                  </span>
                  {[
                    "all",
                    "contact_official",
                    "attend_event",
                    "volunteer",
                    "sign_petition",
                    "write_letter",
                    "share_content",
                    "donate",
                  ].map((type) => (
                    <button
                      type="button"
                      key={type}
                      onClick={() => setCtaFilter(type)}
                      className={cn(
                        "text-[11px] px-2 py-1 rounded border transition-colors",
                        ctaFilter === type
                          ? "bg-primary text-primary-foreground border-primary"
                          : "border-border text-muted-foreground hover:bg-secondary",
                      )}
                    >
                      {type === "all"
                        ? "All"
                        : type
                            .replace(/_/g, " ")
                            .replace(/\b\w/g, (c) => c.toUpperCase())}
                    </button>
                  ))}
                </div>

                {filteredCTAs.length === 0 ? (
                  <div
                    className="text-center py-16 text-muted-foreground text-sm"
                    data-ocid="campaign_detail.actions.empty_state"
                  >
                    No calls to action available for this filter.
                  </div>
                ) : (
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    {filteredCTAs.map((cta, i) => (
                      <Card
                        key={cta.id}
                        className={cn(
                          "hover:shadow-sm transition-shadow",
                          cta.isUrgent && "border-red-200 bg-red-50/30",
                        )}
                        data-ocid={`campaign_detail.actions.item.${i + 1}`}
                      >
                        <CardContent className="px-4 py-4">
                          <div className="flex items-start gap-3 mb-3">
                            <div
                              className={cn(
                                "w-9 h-9 rounded-xl flex items-center justify-center flex-shrink-0",
                                CTAIconBg({ type: cta.type }),
                              )}
                            >
                              <CTAIcon type={cta.type} />
                            </div>
                            <div className="flex-1 min-w-0">
                              <div className="flex items-start justify-between gap-2">
                                <h4 className="font-display font-semibold text-sm leading-snug">
                                  {cta.title}
                                </h4>
                                {cta.isUrgent && (
                                  <Badge className="text-[9px] px-1.5 py-0 bg-red-100 text-red-700 border-red-200 border flex-shrink-0">
                                    Urgent
                                  </Badge>
                                )}
                              </div>
                              <p className="text-xs text-muted-foreground capitalize mt-0.5">
                                {cta.type.replace(/_/g, " ")}
                              </p>
                            </div>
                          </div>

                          <p className="text-xs text-muted-foreground leading-relaxed mb-3">
                            {cta.description}
                          </p>

                          <div className="flex items-center justify-between">
                            <span className="text-[11px] text-muted-foreground flex items-center gap-1">
                              <CheckCircle2
                                size={11}
                                className="text-green-500"
                              />
                              {cta.completedCount.toLocaleString()} completed
                            </span>
                            <Button
                              size="sm"
                              className="h-7 text-xs"
                              asChild={!!cta.actionUrl}
                              data-ocid={`campaign_detail.take_action_button.${i + 1}`}
                            >
                              {cta.actionUrl ? (
                                <a
                                  href={cta.actionUrl}
                                  target="_blank"
                                  rel="noopener noreferrer"
                                >
                                  Take Action
                                  <ExternalLink size={10} className="ml-1" />
                                </a>
                              ) : (
                                "Take Action"
                              )}
                            </Button>
                          </div>
                        </CardContent>
                      </Card>
                    ))}
                  </div>
                )}
              </motion.div>
            </TabsContent>

            {/* ── Petition Tab ── */}
            {petition && (
              <TabsContent value="petition">
                <motion.div
                  initial={{ opacity: 0, y: 8 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.25 }}
                  className="max-w-2xl mx-auto space-y-5"
                >
                  <Card className="border-emerald-200">
                    <CardContent className="px-6 py-6">
                      <div className="flex items-center gap-3 mb-4">
                        <div className="w-10 h-10 rounded-xl bg-emerald-100 flex items-center justify-center">
                          <CheckCircle2
                            size={20}
                            className="text-emerald-600"
                          />
                        </div>
                        <div>
                          <h3 className="font-display font-bold text-lg">
                            {petition.title}
                          </h3>
                          <p className="text-xs text-muted-foreground capitalize">
                            Official Petition
                          </p>
                        </div>
                      </div>

                      <p className="text-sm text-muted-foreground leading-relaxed mb-6">
                        {petition.description}
                      </p>

                      {/* Big counter */}
                      <div className="text-center py-6 border-y border-border mb-6">
                        <div className="text-5xl font-display font-bold text-foreground mb-1">
                          {displayedSignatures.toLocaleString()}
                        </div>
                        <p className="text-muted-foreground text-sm">
                          signatures of{" "}
                          <strong className="text-foreground">
                            {petition.targetSignatures.toLocaleString()}
                          </strong>{" "}
                          goal
                        </p>
                        <Progress
                          value={sigPct}
                          className="h-3 mt-4 mx-auto max-w-xs"
                        />
                        <p className="text-sm font-semibold text-foreground mt-2">
                          {sigPct}% of goal reached
                        </p>
                      </div>

                      {petition.deadline && (
                        <div className="flex items-center justify-center gap-2 mb-6 text-sm">
                          <Clock size={14} className="text-muted-foreground" />
                          <span className="text-muted-foreground">
                            Deadline:
                          </span>
                          <span className="font-medium">
                            {formatDate(petition.deadline)}
                          </span>
                          <span className="text-muted-foreground">·</span>
                          <DaysLeft endDate={petition.deadline} />
                        </div>
                      )}

                      <Button
                        size="lg"
                        className="w-full h-12 text-sm font-semibold gap-2"
                        onClick={handleSign}
                        disabled={signed}
                        data-ocid="campaign_detail.sign_petition_button"
                      >
                        {signed ? (
                          <>
                            <CheckCircle2 size={16} />
                            Thank you for signing!
                          </>
                        ) : (
                          <>
                            <PenSquare size={16} />
                            Sign This Petition
                          </>
                        )}
                      </Button>
                    </CardContent>
                  </Card>

                  {/* Recent signers */}
                  <Card>
                    <CardHeader className="pb-2 pt-4 px-4">
                      <CardTitle className="text-sm font-semibold flex items-center gap-2">
                        <Users size={14} className="text-blue-600" />
                        Recent Signers
                      </CardTitle>
                    </CardHeader>
                    <CardContent className="px-4 pb-4 space-y-2">
                      {MOCK_MEMBERS.slice(0, 6).map((member, i) => (
                        <div
                          key={member.id}
                          className="flex items-center gap-3 py-1.5"
                          data-ocid={`campaign_detail.petition.signer.${i + 1}`}
                        >
                          <div className="w-7 h-7 rounded-full bg-secondary flex items-center justify-center text-[10px] font-bold text-muted-foreground">
                            {member.name
                              .split(" ")
                              .map((n) => n[0])
                              .join("")
                              .toUpperCase()
                              .slice(0, 2)}
                          </div>
                          <div>
                            <p className="text-xs font-medium">{member.name}</p>
                            <p className="text-[10px] text-muted-foreground">
                              {member.organization} ·{" "}
                              {new Date(member.joinedDate).toLocaleDateString(
                                "en-US",
                                {
                                  month: "short",
                                  year: "numeric",
                                },
                              )}
                            </p>
                          </div>
                        </div>
                      ))}
                    </CardContent>
                  </Card>
                </motion.div>
              </TabsContent>
            )}

            {/* ── Updates Tab ── */}
            <TabsContent value="updates">
              <motion.div
                initial={{ opacity: 0, y: 8 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.25 }}
              >
                {updates.length === 0 ? (
                  <div
                    className="text-center py-16 text-muted-foreground text-sm"
                    data-ocid="campaign_detail.updates.empty_state"
                  >
                    No updates yet for this campaign.
                  </div>
                ) : (
                  <div className="space-y-4">
                    {updates.map((update, i) => (
                      <motion.div
                        key={update.id}
                        initial={{ opacity: 0, y: 8 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: i * 0.05, duration: 0.25 }}
                        data-ocid={`campaign_detail.updates.item.${i + 1}`}
                      >
                        <Card
                          className={cn(
                            "overflow-hidden",
                            update.type === "milestone" &&
                              "border-amber-200 bg-amber-50/20",
                          )}
                        >
                          <CardContent className="px-4 py-4">
                            <div className="flex items-start gap-3">
                              <div
                                className={cn(
                                  "w-9 h-9 rounded-xl flex items-center justify-center flex-shrink-0",
                                  UpdateIconBg({ type: update.type }),
                                )}
                              >
                                <UpdateIcon type={update.type} />
                              </div>
                              <div className="flex-1 min-w-0">
                                <div className="flex items-start justify-between gap-2 mb-1">
                                  <h4 className="font-display font-semibold text-sm">
                                    {update.title}
                                  </h4>
                                  <div className="flex items-center gap-2 flex-shrink-0">
                                    {update.type === "milestone" && (
                                      <Badge className="text-[9px] px-1.5 py-0 bg-amber-100 text-amber-700 border-amber-200 border">
                                        Milestone
                                      </Badge>
                                    )}
                                    {update.type === "media" && (
                                      <Badge className="text-[9px] px-1.5 py-0 bg-blue-100 text-blue-700 border-blue-200 border">
                                        Media
                                      </Badge>
                                    )}
                                    {update.type === "action" && (
                                      <Badge className="text-[9px] px-1.5 py-0 bg-emerald-100 text-emerald-700 border-emerald-200 border">
                                        Action
                                      </Badge>
                                    )}
                                  </div>
                                </div>
                                <p className="text-xs text-muted-foreground leading-relaxed mb-2">
                                  {update.content}
                                </p>
                                <div className="flex items-center gap-1.5 text-[10px] text-muted-foreground">
                                  <span>{update.author}</span>
                                  <span>·</span>
                                  <span>{formatDate(update.date)}</span>
                                </div>
                              </div>
                            </div>
                          </CardContent>
                        </Card>
                      </motion.div>
                    ))}
                  </div>
                )}
              </motion.div>
            </TabsContent>

            {/* ── Settings Tab (Admin only) ── */}
            <RoleGate roles={["super_admin", "admin", "org_admin"]}>
              <TabsContent value="settings">
                <motion.div
                  initial={{ opacity: 0, y: 8 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.25 }}
                  className="space-y-5 max-w-2xl"
                >
                  {/* Edit Form */}
                  <Card>
                    <CardHeader className="pb-3 pt-4 px-4">
                      <CardTitle className="text-sm font-semibold">
                        Campaign Settings
                      </CardTitle>
                    </CardHeader>
                    <CardContent className="px-4 pb-4 space-y-4">
                      <div className="space-y-1.5">
                        <Label className="text-sm font-medium">
                          Campaign Title
                        </Label>
                        <Input
                          defaultValue={campaign.title}
                          data-ocid="campaign_detail.settings.title_input"
                        />
                      </div>
                      <div className="grid grid-cols-2 gap-3">
                        <div className="space-y-1.5">
                          <Label className="text-sm font-medium">
                            Category
                          </Label>
                          <Select defaultValue={campaign.category}>
                            <SelectTrigger data-ocid="campaign_detail.settings.category_select">
                              <SelectValue />
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
                          <Label className="text-sm font-medium">Status</Label>
                          <Select defaultValue={campaign.status}>
                            <SelectTrigger data-ocid="campaign_detail.settings.status_select">
                              <SelectValue />
                            </SelectTrigger>
                            <SelectContent>
                              <SelectItem value="active">Active</SelectItem>
                              <SelectItem value="upcoming">Upcoming</SelectItem>
                              <SelectItem value="paused">Paused</SelectItem>
                              <SelectItem value="completed">
                                Completed
                              </SelectItem>
                            </SelectContent>
                          </Select>
                        </div>
                      </div>
                      <div className="space-y-1.5">
                        <Label className="text-sm font-medium">
                          Description
                        </Label>
                        <Textarea
                          defaultValue={campaign.description}
                          rows={3}
                          data-ocid="campaign_detail.settings.description_textarea"
                        />
                      </div>
                      <div className="space-y-1.5">
                        <Label className="text-sm font-medium">
                          Campaign Goal
                        </Label>
                        <Textarea
                          defaultValue={campaign.goal}
                          rows={2}
                          data-ocid="campaign_detail.settings.goal_textarea"
                        />
                      </div>
                      <div className="grid grid-cols-2 gap-3">
                        <div className="space-y-1.5">
                          <Label className="text-sm font-medium">
                            Start Date
                          </Label>
                          <Input
                            type="date"
                            defaultValue={campaign.startDate}
                            data-ocid="campaign_detail.settings.start_date_input"
                          />
                        </div>
                        <div className="space-y-1.5">
                          <Label className="text-sm font-medium">
                            End Date
                          </Label>
                          <Input
                            type="date"
                            defaultValue={campaign.endDate ?? ""}
                            data-ocid="campaign_detail.settings.end_date_input"
                          />
                        </div>
                      </div>
                      <div className="flex justify-end">
                        <Button
                          size="sm"
                          className="h-9 text-sm"
                          data-ocid="campaign_detail.settings.save_button"
                        >
                          Save Changes
                        </Button>
                      </div>
                    </CardContent>
                  </Card>

                  {/* Danger zone */}
                  <Card className="border-destructive/30 bg-destructive/5">
                    <CardHeader className="pb-2 pt-4 px-4">
                      <CardTitle className="text-sm font-semibold text-destructive flex items-center gap-2">
                        <AlertTriangle size={14} />
                        Danger Zone
                      </CardTitle>
                    </CardHeader>
                    <CardContent className="px-4 pb-4 space-y-3">
                      <div className="flex items-center justify-between gap-4 p-3 bg-white rounded-lg border border-destructive/20">
                        <div>
                          <p className="text-sm font-medium">Pause Campaign</p>
                          <p className="text-xs text-muted-foreground">
                            Temporarily pause this campaign. It can be
                            reactivated at any time.
                          </p>
                        </div>
                        <Button
                          variant="outline"
                          size="sm"
                          className="flex-shrink-0 border-amber-300 text-amber-700 hover:bg-amber-50 gap-1.5"
                          onClick={() => setConfirmAction("pause")}
                          data-ocid="campaign_detail.pause_button"
                        >
                          <PauseCircle size={13} />
                          Pause
                        </Button>
                      </div>
                      <div className="flex items-center justify-between gap-4 p-3 bg-white rounded-lg border border-destructive/20">
                        <div>
                          <p className="text-sm font-medium text-destructive">
                            Archive Campaign
                          </p>
                          <p className="text-xs text-muted-foreground">
                            Archive this campaign. It will be removed from
                            active listings but data will be preserved.
                          </p>
                        </div>
                        <Button
                          variant="destructive"
                          size="sm"
                          className="flex-shrink-0 gap-1.5"
                          onClick={() => setConfirmAction("archive")}
                          data-ocid="campaign_detail.archive_button"
                        >
                          <Archive size={13} />
                          Archive
                        </Button>
                      </div>
                    </CardContent>
                  </Card>
                </motion.div>
              </TabsContent>
            </RoleGate>
          </Tabs>
        </div>
      </div>

      {/* Confirm Dialog */}
      <Dialog
        open={confirmAction !== null}
        onOpenChange={() => setConfirmAction(null)}
      >
        <DialogContent data-ocid="campaign_detail.confirm_dialog">
          <DialogHeader>
            <DialogTitle className="font-display">
              {confirmAction === "pause"
                ? "Pause Campaign?"
                : "Archive Campaign?"}
            </DialogTitle>
            <DialogDescription>
              {confirmAction === "pause"
                ? "This campaign will be paused and removed from active listings. You can reactivate it at any time from the settings."
                : "This campaign will be archived. The campaign data, signatures, and updates will be preserved but the campaign will no longer appear in active listings."}
            </DialogDescription>
          </DialogHeader>
          <DialogFooter className="gap-2">
            <Button
              variant="outline"
              onClick={() => setConfirmAction(null)}
              data-ocid="campaign_detail.cancel_button"
            >
              Cancel
            </Button>
            <Button
              variant={confirmAction === "archive" ? "destructive" : "default"}
              onClick={() => setConfirmAction(null)}
              data-ocid="campaign_detail.confirm_button"
            >
              {confirmAction === "pause"
                ? "Pause Campaign"
                : "Archive Campaign"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </Layout>
  );
}
