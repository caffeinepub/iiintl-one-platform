import { Layout } from "@/components/Layout";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { Separator } from "@/components/ui/separator";
import { useAuth } from "@/context/AuthContext";
import { useI18n } from "@/context/I18nContext";
import {
  MOCK_CAMPAIGNS,
  MOCK_CAMPAIGN_UPDATES,
  MOCK_CTAS,
  MOCK_PETITIONS,
  getCampaignById,
  getCampaignCategoryColor,
} from "@/data/mockData";
import { useBackend } from "@/hooks/useBackend";
import { cn } from "@/lib/utils";
import { Link } from "@tanstack/react-router";
import {
  AlertCircle,
  ArrowRight,
  Award,
  BookOpen,
  Calendar,
  CheckCircle2,
  ExternalLink,
  FileText,
  Globe,
  Loader2,
  Megaphone,
  MessageSquare,
  PenSquare,
  Share2,
  Star,
  TrendingUp,
  UserPlus,
  Users,
  Zap,
} from "lucide-react";
import type { Variants } from "motion/react";
import { motion } from "motion/react";
import { useEffect, useState } from "react";

const containerVariants: Variants = {
  hidden: { opacity: 0 },
  visible: { opacity: 1, transition: { staggerChildren: 0.07 } },
};

const itemVariants: Variants = {
  hidden: { opacity: 0, y: 16 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.35 } },
};

const sectionVariants: Variants = {
  hidden: { opacity: 0, y: 20 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.4 } },
};

function CTAIcon({ type }: { type: string }) {
  switch (type) {
    case "contact_official":
      return <PenSquare size={20} className="text-blue-600" />;
    case "share_content":
      return <Megaphone size={20} className="text-pink-600" />;
    case "attend_event":
      return <Calendar size={20} className="text-green-600" />;
    case "donate":
      return <Star size={20} className="text-amber-600" />;
    case "volunteer":
      return <UserPlus size={20} className="text-purple-600" />;
    case "sign_petition":
      return <CheckCircle2 size={20} className="text-emerald-600" />;
    case "write_letter":
      return <FileText size={20} className="text-indigo-600" />;
    default:
      return <Zap size={20} className="text-amber-600" />;
  }
}

function CTAIconBg({ type }: { type: string }) {
  switch (type) {
    case "contact_official":
      return "bg-blue-50 border-blue-100";
    case "share_content":
      return "bg-pink-50 border-pink-100";
    case "attend_event":
      return "bg-green-50 border-green-100";
    case "donate":
      return "bg-amber-50 border-amber-100";
    case "volunteer":
      return "bg-purple-50 border-purple-100";
    case "sign_petition":
      return "bg-emerald-50 border-emerald-100";
    case "write_letter":
      return "bg-indigo-50 border-indigo-100";
    default:
      return "bg-secondary border-border";
  }
}

function UpdateTypeIcon({ type }: { type: string }) {
  switch (type) {
    case "milestone":
      return <Award size={14} className="text-amber-600" />;
    case "media":
      return <Globe size={14} className="text-blue-600" />;
    case "action":
      return <Zap size={14} className="text-emerald-600" />;
    default:
      return <BookOpen size={14} className="text-muted-foreground" />;
  }
}

const ACTIVISM_TYPES = [
  {
    icon: <CheckCircle2 size={24} className="text-emerald-600" />,
    bg: "bg-emerald-50",
    border: "border-emerald-200",
    title: "Petitions",
    description:
      "Sign and share petitions that pressure decision-makers to act. Every signature makes our demands impossible to ignore.",
  },
  {
    icon: <Megaphone size={24} className="text-red-600" />,
    bg: "bg-red-50",
    border: "border-red-200",
    title: "Calls to Action",
    description:
      "Take targeted, time-sensitive actions — contact officials, attend rallies, and amplify urgent campaign moments.",
  },
  {
    icon: <Calendar size={24} className="text-blue-600" />,
    bg: "bg-blue-50",
    border: "border-blue-200",
    title: "Events",
    description:
      "Attend marches, forums, strikes, and community gatherings. Collective physical presence sends an unmistakable message.",
  },
  {
    icon: <PenSquare size={24} className="text-indigo-600" />,
    bg: "bg-indigo-50",
    border: "border-indigo-200",
    title: "Letter Writing",
    description:
      "Write to officials, editors, and community leaders. Personal, thoughtful letters have changed minds and policies for centuries.",
  },
  {
    icon: <Share2 size={24} className="text-pink-600" />,
    bg: "bg-pink-50",
    border: "border-pink-200",
    title: "Sharing & Amplifying",
    description:
      "Reach thousands by sharing campaign content. Your network is your platform — use it to spread vital messages.",
  },
  {
    icon: <Users size={24} className="text-purple-600" />,
    bg: "bg-purple-50",
    border: "border-purple-200",
    title: "Volunteering",
    description:
      "Give your time and skills to causes you believe in. From field canvassing to digital outreach, every hour counts.",
  },
];

interface ActivismBackend {
  signPetition(petitionId: string): Promise<boolean>;
  hasSigned(petitionId: string): Promise<boolean>;
  getPetitionSignatureCount(petitionId: string): Promise<bigint>;
  recordAction(actionType: string, description: string): Promise<void>;
  getMyActions(): Promise<
    Array<{
      actionType: string;
      description: string;
      id: bigint;
      completedAt: bigint;
    }>
  >;
}

export function ActivismPage() {
  const { t } = useI18n();
  const { isAuthenticated } = useAuth();
  const actor = useBackend();
  const [signedPetitions, setSignedPetitions] = useState<Set<string>>(
    new Set(),
  );
  const [loadingPetitions, setLoadingPetitions] = useState<Set<string>>(
    new Set(),
  );
  const [completedCTAs, setCompletedCTAs] = useState<Set<string>>(new Set());
  const [loadingCTAs, setLoadingCTAs] = useState<Set<string>>(new Set());

  useEffect(() => {
    if (!isAuthenticated || !actor) return;
    const ab = actor as unknown as ActivismBackend;
    const init = async () => {
      try {
        const actions = await ab.getMyActions();
        setCompletedCTAs(new Set(actions.map((a) => a.actionType)));
      } catch {
        /* ignore */
      }
      try {
        await Promise.all(
          MOCK_PETITIONS.map(async (p) => {
            const signed = await ab.hasSigned(p.id);
            if (signed) setSignedPetitions((prev) => new Set([...prev, p.id]));
          }),
        );
      } catch {
        /* ignore */
      }
    };
    init();
  }, [isAuthenticated, actor]);

  async function handleSign(petitionId: string) {
    setLoadingPetitions((prev) => new Set([...prev, petitionId]));
    try {
      if (actor && isAuthenticated) {
        await (actor as unknown as ActivismBackend).signPetition(petitionId);
      }
      setSignedPetitions((prev) => new Set([...prev, petitionId]));
    } catch {
      /* ignore */
    }
    setLoadingPetitions((prev) => {
      const s = new Set(prev);
      s.delete(petitionId);
      return s;
    });
  }

  async function handleTakeAction(
    ctaId: string,
    ctaType: string,
    ctaTitle: string,
  ) {
    setLoadingCTAs((prev) => new Set([...prev, ctaId]));
    try {
      if (actor && isAuthenticated) {
        await (actor as unknown as ActivismBackend).recordAction(
          ctaType,
          ctaTitle,
        );
      }
      setCompletedCTAs((prev) => new Set([...prev, ctaType]));
    } catch {
      /* ignore */
    }
    setLoadingCTAs((prev) => {
      const s = new Set(prev);
      s.delete(ctaId);
      return s;
    });
  }

  const urgentCTAs = MOCK_CTAS.filter((c) => c.isUrgent);
  const recentUpdates = [...MOCK_CAMPAIGN_UPDATES]
    .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())
    .slice(0, 6);

  const activeCampaigns = MOCK_CAMPAIGNS.filter(
    (c) => c.status === "active",
  ).length;
  const totalSignatures = MOCK_PETITIONS.reduce(
    (sum, p) => sum + p.currentSignatures,
    0,
  );
  const totalParticipants = MOCK_CAMPAIGNS.reduce(
    (sum, c) => sum + c.participantCount,
    0,
  );

  return (
    <Layout breadcrumb={t.activism.title}>
      <div className="max-w-7xl mx-auto">
        {/* ── Hero Section ── */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.4 }}
          className="relative overflow-hidden civic-gradient px-6 py-10"
        >
          <div
            className="absolute inset-0 opacity-10"
            style={{
              backgroundImage:
                "radial-gradient(circle at 15% 40%, white 1px, transparent 1px), radial-gradient(circle at 70% 15%, white 1px, transparent 1px), radial-gradient(circle at 90% 70%, white 1px, transparent 1px)",
              backgroundSize: "50px 50px",
            }}
          />
          <div className="relative max-w-2xl">
            <Badge className="mb-3 bg-white/20 text-white border-white/30 text-[11px] font-semibold">
              <Zap size={10} className="mr-1 fill-white" />
              {t.activism.title}
            </Badge>
            <h1 className="text-3xl sm:text-4xl font-display font-bold text-white tracking-tight mb-3">
              {t.activism.subtitle}
            </h1>
            <p className="text-white/70 text-base leading-relaxed mb-6">
              Discover petitions, calls-to-action, events, and ways to make your
              voice heard — from your local community to the global stage.
            </p>
            <Button
              asChild
              size="sm"
              className="bg-white text-primary hover:bg-white/90 font-semibold h-9 gap-2"
            >
              <Link to="/campaigns">
                Explore All Campaigns
                <ArrowRight size={14} />
              </Link>
            </Button>
          </div>

          {/* Stats bar */}
          <div className="relative grid grid-cols-2 sm:grid-cols-4 gap-4 mt-8 pt-6 border-t border-white/15">
            {[
              {
                label: "Active Petitions",
                value: MOCK_PETITIONS.length,
                icon: <CheckCircle2 size={14} />,
              },
              {
                label: "Calls to Action",
                value: MOCK_CTAS.length,
                icon: <Zap size={14} />,
              },
              {
                label: "Active Campaigns",
                value: activeCampaigns,
                icon: <Megaphone size={14} />,
              },
              {
                label: "Members Taking Action",
                value: `${(totalParticipants / 1000).toFixed(1)}K`,
                icon: <Users size={14} />,
              },
            ].map((stat) => (
              <div key={stat.label} className="flex items-center gap-2">
                <span className="text-white/50">{stat.icon}</span>
                <div>
                  <p className="text-white font-display font-bold text-xl leading-none">
                    {stat.value}
                  </p>
                  <p className="text-white/50 text-[11px] mt-0.5">
                    {stat.label}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </motion.div>

        <div className="p-6 space-y-10">
          {/* ── Section 1: Urgent Actions ── */}
          <motion.section
            variants={sectionVariants}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: "-80px" }}
          >
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-2.5">
                <div className="w-8 h-8 rounded-lg bg-red-100 flex items-center justify-center">
                  <AlertCircle size={16} className="text-red-600" />
                </div>
                <div>
                  <h2 className="font-display font-bold text-lg text-foreground">
                    Urgent Actions
                  </h2>
                  <p className="text-xs text-muted-foreground">
                    Time-sensitive calls to action — act now
                  </p>
                </div>
              </div>
              <Badge className="bg-red-100 text-red-700 border-red-200 border text-[10px]">
                {urgentCTAs.length} urgent
              </Badge>
            </div>

            {urgentCTAs.length === 0 ? (
              <div
                className="text-center py-12 text-muted-foreground text-sm"
                data-ocid="activism.urgent.empty_state"
              >
                No urgent actions at this time.
              </div>
            ) : (
              <motion.div
                variants={containerVariants}
                initial="hidden"
                whileInView="visible"
                viewport={{ once: true }}
                className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4"
              >
                {urgentCTAs.map((cta, i) => {
                  const campaign = getCampaignById(cta.campaignId);
                  return (
                    <motion.div
                      key={cta.id}
                      variants={itemVariants}
                      data-ocid={`activism.urgent.item.${i + 1}`}
                    >
                      <Card className="h-full border-red-200 bg-red-50/20 hover:shadow-sm transition-shadow">
                        <CardContent className="px-4 py-4 flex flex-col h-full">
                          <div className="flex items-start gap-3 mb-3">
                            <div
                              className={cn(
                                "w-10 h-10 rounded-xl flex items-center justify-center flex-shrink-0 border",
                                CTAIconBg({ type: cta.type }),
                              )}
                            >
                              <CTAIcon type={cta.type} />
                            </div>
                            <div className="flex-1 min-w-0">
                              <div className="flex items-center gap-2 mb-0.5">
                                <Badge className="text-[9px] px-1.5 py-0 bg-red-100 text-red-700 border-red-200 border flex-shrink-0">
                                  Urgent
                                </Badge>
                              </div>
                              <h3 className="font-display font-semibold text-sm leading-snug">
                                {cta.title}
                              </h3>
                            </div>
                          </div>

                          <p className="text-xs text-muted-foreground leading-relaxed mb-3 flex-1">
                            {cta.description}
                          </p>

                          {campaign && (
                            <p className="text-[10px] text-muted-foreground mb-3 flex items-center gap-1">
                              <Megaphone size={10} />
                              Campaign:{" "}
                              <Link
                                to="/campaigns/$id"
                                params={{ id: campaign.id }}
                                className="text-primary hover:underline"
                              >
                                {campaign.title}
                              </Link>
                            </p>
                          )}

                          <div className="flex items-center justify-between">
                            <span className="text-[10px] text-muted-foreground flex items-center gap-1">
                              <CheckCircle2
                                size={10}
                                className="text-green-500"
                              />
                              {cta.completedCount.toLocaleString()} done
                            </span>
                            <Button
                              size="sm"
                              className={cn(
                                "h-7 text-xs",
                                completedCTAs.has(cta.type)
                                  ? "bg-green-600 hover:bg-green-700"
                                  : "bg-red-600 hover:bg-red-700",
                              )}
                              onClick={() =>
                                handleTakeAction(cta.id, cta.type, cta.title)
                              }
                              disabled={
                                completedCTAs.has(cta.type) ||
                                loadingCTAs.has(cta.id)
                              }
                              data-ocid={`activism.take_action_button.${i + 1}`}
                            >
                              {loadingCTAs.has(cta.id) ? (
                                <Loader2 size={11} className="animate-spin" />
                              ) : completedCTAs.has(cta.type) ? (
                                <>
                                  <CheckCircle2 size={11} className="mr-1" />
                                  Done
                                </>
                              ) : (
                                "Take Action"
                              )}
                            </Button>
                          </div>
                        </CardContent>
                      </Card>
                    </motion.div>
                  );
                })}
              </motion.div>
            )}
          </motion.section>

          <Separator />

          {/* ── Section 2: Active Petitions ── */}
          <motion.section
            variants={sectionVariants}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: "-80px" }}
          >
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-2.5">
                <div className="w-8 h-8 rounded-lg bg-emerald-100 flex items-center justify-center">
                  <CheckCircle2 size={16} className="text-emerald-600" />
                </div>
                <div>
                  <h2 className="font-display font-bold text-lg text-foreground">
                    Active Petitions
                  </h2>
                  <p className="text-xs text-muted-foreground">
                    Add your voice — every signature counts
                  </p>
                </div>
              </div>
              <span className="text-xs text-muted-foreground">
                {totalSignatures.toLocaleString()} total signatures collected
              </span>
            </div>

            <motion.div
              variants={containerVariants}
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true }}
              className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4"
            >
              {MOCK_PETITIONS.map((petition, i) => {
                const campaign = getCampaignById(petition.campaignId);
                const isSigned = signedPetitions.has(petition.id);
                const currentSigs = isSigned
                  ? petition.currentSignatures + 1
                  : petition.currentSignatures;
                const pct = Math.round(
                  (currentSigs / petition.targetSignatures) * 100,
                );
                const catColor = campaign
                  ? getCampaignCategoryColor(campaign.category)
                  : "bg-gray-100 text-gray-600";

                return (
                  <motion.div
                    key={petition.id}
                    variants={itemVariants}
                    data-ocid={`activism.petition.item.${i + 1}`}
                  >
                    <Card className="h-full hover:shadow-sm transition-shadow border-emerald-100">
                      <CardContent className="px-4 py-4 flex flex-col h-full">
                        {campaign && (
                          <div className="flex items-center gap-1.5 mb-2">
                            <Badge
                              variant="outline"
                              className={cn(
                                "text-[10px] px-1.5 py-0 h-4",
                                catColor,
                              )}
                            >
                              {campaign.category}
                            </Badge>
                          </div>
                        )}

                        <h3 className="font-display font-semibold text-sm leading-snug mb-2">
                          {petition.title}
                        </h3>

                        <p className="text-xs text-muted-foreground leading-relaxed mb-4 flex-1 line-clamp-3">
                          {petition.description}
                        </p>

                        {/* Progress */}
                        <div className="mb-3">
                          <div className="flex items-center justify-between text-[10px] text-muted-foreground mb-1">
                            <span className="font-semibold text-foreground">
                              {currentSigs.toLocaleString()} signatures
                            </span>
                            <span>{pct}%</span>
                          </div>
                          <Progress value={pct} className="h-2" />
                          <p className="text-[10px] text-muted-foreground mt-1">
                            of {petition.targetSignatures.toLocaleString()} goal
                          </p>
                        </div>

                        {petition.deadline && (
                          <p className="text-[10px] text-muted-foreground flex items-center gap-1 mb-3">
                            <Calendar size={10} />
                            Deadline:{" "}
                            {new Date(petition.deadline).toLocaleDateString(
                              "en-US",
                              {
                                month: "short",
                                day: "numeric",
                                year: "numeric",
                              },
                            )}
                          </p>
                        )}

                        <Button
                          size="sm"
                          className={cn(
                            "w-full h-8 text-xs",
                            isSigned && "bg-emerald-600 hover:bg-emerald-700",
                          )}
                          onClick={() => handleSign(petition.id)}
                          disabled={
                            isSigned || loadingPetitions.has(petition.id)
                          }
                          data-ocid={`activism.sign_petition_button.${i + 1}`}
                        >
                          {loadingPetitions.has(petition.id) ? (
                            <Loader2 size={12} className="animate-spin" />
                          ) : isSigned ? (
                            <>
                              <CheckCircle2 size={12} className="mr-1.5" />
                              Signed!
                            </>
                          ) : (
                            "Sign Now"
                          )}
                        </Button>
                      </CardContent>
                    </Card>
                  </motion.div>
                );
              })}
            </motion.div>
          </motion.section>

          <Separator />

          {/* ── Section 3: Recent Campaign Activity ── */}
          <motion.section
            variants={sectionVariants}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: "-80px" }}
          >
            <div className="flex items-center gap-2.5 mb-4">
              <div className="w-8 h-8 rounded-lg bg-blue-100 flex items-center justify-center">
                <TrendingUp size={16} className="text-blue-600" />
              </div>
              <div>
                <h2 className="font-display font-bold text-lg text-foreground">
                  Recent Campaign Activity
                </h2>
                <p className="text-xs text-muted-foreground">
                  Latest updates from across all campaigns
                </p>
              </div>
            </div>

            <Card>
              <CardContent className="px-4 py-2">
                {recentUpdates.map((update, i) => {
                  const campaign = getCampaignById(update.campaignId);
                  return (
                    <div key={update.id}>
                      <div
                        className="flex items-start gap-3 py-3.5"
                        data-ocid={`activism.activity.item.${i + 1}`}
                      >
                        <div
                          className={cn(
                            "w-8 h-8 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5",
                            update.type === "milestone"
                              ? "bg-amber-50"
                              : update.type === "media"
                                ? "bg-blue-50"
                                : update.type === "action"
                                  ? "bg-emerald-50"
                                  : "bg-secondary",
                          )}
                        >
                          <UpdateTypeIcon type={update.type} />
                        </div>
                        <div className="flex-1 min-w-0">
                          <div className="flex items-start justify-between gap-2">
                            <div>
                              {campaign && (
                                <Link
                                  to="/campaigns/$id"
                                  params={{ id: campaign.id }}
                                  className="text-[10px] font-semibold text-primary hover:underline flex items-center gap-1 mb-0.5"
                                >
                                  <Megaphone size={9} />
                                  {campaign.title}
                                </Link>
                              )}
                              <p className="text-sm font-medium text-foreground leading-snug">
                                {update.title}
                              </p>
                              <p className="text-xs text-muted-foreground mt-0.5 line-clamp-2">
                                {update.content}
                              </p>
                            </div>
                          </div>
                          <div className="flex items-center gap-1.5 text-[10px] text-muted-foreground mt-1.5">
                            <span>{update.author}</span>
                            <span>·</span>
                            <span>
                              {new Date(update.date).toLocaleDateString(
                                "en-US",
                                {
                                  month: "short",
                                  day: "numeric",
                                },
                              )}
                            </span>
                            {update.type === "milestone" && (
                              <>
                                <span>·</span>
                                <Badge className="text-[9px] px-1.5 py-0 bg-amber-100 text-amber-700 border-amber-200 border h-4">
                                  Milestone
                                </Badge>
                              </>
                            )}
                          </div>
                        </div>
                      </div>
                      {i < recentUpdates.length - 1 && (
                        <Separator className="opacity-50" />
                      )}
                    </div>
                  );
                })}
              </CardContent>
            </Card>
          </motion.section>

          <Separator />

          {/* ── Section 4: Ways to Get Involved ── */}
          <motion.section
            variants={sectionVariants}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: "-80px" }}
          >
            <div className="flex items-center gap-2.5 mb-6">
              <div className="w-8 h-8 rounded-lg bg-primary/10 flex items-center justify-center">
                <Globe size={16} className="text-primary" />
              </div>
              <div>
                <h2 className="font-display font-bold text-lg text-foreground">
                  Ways to Get Involved
                </h2>
                <p className="text-xs text-muted-foreground">
                  Every type of action matters — choose how you want to make
                  your impact
                </p>
              </div>
            </div>

            <motion.div
              variants={containerVariants}
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true }}
              className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4"
            >
              {ACTIVISM_TYPES.map((type, i) => (
                <motion.div
                  key={type.title}
                  variants={itemVariants}
                  data-ocid={`activism.involvement.item.${i + 1}`}
                >
                  <Card
                    className={cn(
                      "h-full hover:shadow-sm transition-all duration-200 group border",
                      type.border,
                    )}
                  >
                    <CardContent className="px-4 py-4">
                      <div
                        className={cn(
                          "w-12 h-12 rounded-xl flex items-center justify-center mb-3 transition-transform group-hover:scale-105",
                          type.bg,
                        )}
                      >
                        {type.icon}
                      </div>
                      <h3 className="font-display font-semibold text-sm text-foreground mb-1.5">
                        {type.title}
                      </h3>
                      <p className="text-xs text-muted-foreground leading-relaxed">
                        {type.description}
                      </p>
                    </CardContent>
                  </Card>
                </motion.div>
              ))}
            </motion.div>

            <div className="mt-6 flex flex-col sm:flex-row gap-3 justify-center">
              <Button
                asChild
                className="gap-2 h-10"
                data-ocid="activism.campaigns_link"
              >
                <Link to="/campaigns">
                  <Megaphone size={15} />
                  Browse All Campaigns
                </Link>
              </Button>
              <Button
                asChild
                variant="outline"
                className="gap-2 h-10"
                data-ocid="activism.members_link"
              >
                <Link to="/members">
                  <Users size={15} />
                  Find Fellow Activists
                </Link>
              </Button>
            </div>
          </motion.section>
        </div>
      </div>
    </Layout>
  );
}
