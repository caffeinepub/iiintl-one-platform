import type { OrgMember, Organization } from "@/backend";
import { Layout } from "@/components/Layout";
import { RoleGate } from "@/components/RoleGate";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Separator } from "@/components/ui/separator";
import { Skeleton } from "@/components/ui/skeleton";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Textarea } from "@/components/ui/textarea";
import { useAuth } from "@/context/AuthContext";
import { MOCK_ORG_ACTIVITIES, getOrgColorClasses } from "@/data/mockData";
import { useActor } from "@/hooks/useActor";
import { cn } from "@/lib/utils";
import { Link, useParams } from "@tanstack/react-router";
import {
  Activity,
  AlertTriangle,
  ArrowLeft,
  BookOpen,
  Building2,
  Calendar,
  ExternalLink,
  Globe,
  Megaphone,
  Search,
  Settings,
  UserPlus,
  Users,
} from "lucide-react";
import type { Variants } from "motion/react";
import { motion } from "motion/react";
import { useCallback, useEffect, useRef, useState } from "react";
import { toast } from "sonner";

const itemVariants: Variants = {
  hidden: { opacity: 0, y: 12 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.3 } },
};

const containerVariants: Variants = {
  hidden: { opacity: 0 },
  visible: { opacity: 1, transition: { staggerChildren: 0.07 } },
};

// Mock campaigns per org — retained as local mock (not in Organizations backend yet)
const MOCK_CAMPAIGNS_BY_ORG: Record<
  string,
  Array<{
    id: string;
    title: string;
    status: string;
    dates: string;
    participants: number;
  }>
> = {
  "org-1": [
    {
      id: "c1",
      title: "Global Climate Justice Summit",
      status: "Active",
      dates: "Mar 1 – Apr 30, 2026",
      participants: 284,
    },
    {
      id: "c2",
      title: "Digital Rights Charter Initiative",
      status: "Active",
      dates: "Feb 15 – May 15, 2026",
      participants: 193,
    },
    {
      id: "c3",
      title: "Youth Leadership Fellowship",
      status: "Upcoming",
      dates: "Apr 10 – Jun 30, 2026",
      participants: 47,
    },
  ],
  "org-2": [
    {
      id: "c4",
      title: "Latin America Voter Rights Campaign",
      status: "Active",
      dates: "Jan 20 – May 1, 2026",
      participants: 78,
    },
    {
      id: "c5",
      title: "Indigenous Land Rights Petition",
      status: "Completed",
      dates: "Nov 2025 – Jan 2026",
      participants: 340,
    },
  ],
};

function getCampaignStatusClasses(status: string): string {
  switch (status) {
    case "Active":
      return "bg-green-100 text-green-700 border-green-200";
    case "Upcoming":
      return "bg-yellow-100 text-yellow-700 border-yellow-200";
    case "Completed":
      return "bg-gray-100 text-gray-600 border-gray-200";
    default:
      return "bg-gray-100 text-gray-600";
  }
}

function ActivityIcon({ type }: { type: string }) {
  switch (type) {
    case "campaign_launched":
      return <Megaphone size={13} className="text-green-600" />;
    case "member_invited":
      return <UserPlus size={13} className="text-blue-600" />;
    case "post_made":
      return <BookOpen size={13} className="text-purple-600" />;
    case "joined":
      return <Users size={13} className="text-orange-600" />;
    case "resource_added":
      return <BookOpen size={13} className="text-teal-600" />;
    default:
      return <Activity size={13} className="text-muted-foreground" />;
  }
}

function ActivityIconBg({ type }: { type: string }) {
  switch (type) {
    case "campaign_launched":
      return "bg-green-50";
    case "member_invited":
      return "bg-blue-50";
    case "post_made":
      return "bg-purple-50";
    case "joined":
      return "bg-orange-50";
    case "resource_added":
      return "bg-teal-50";
    default:
      return "bg-secondary";
  }
}

function getInitials(name: string): string {
  return name
    .split(" ")
    .slice(0, 2)
    .map((w) => w[0])
    .join("")
    .toUpperCase();
}

export function OrganizationDetailPage() {
  const { id } = useParams({ strict: false }) as { id?: string };
  const { user } = useAuth();
  const { actor } = useActor();
  const [memberSearch, setMemberSearch] = useState("");
  const [activeTab, setActiveTab] = useState("overview");

  const [org, setOrg] = useState<Organization | null>(null);
  const [members, setMembers] = useState<OrgMember[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [isMember, setIsMember] = useState(false);
  const [joining, setJoining] = useState(false);
  const [savingSettings, setSavingSettings] = useState(false);
  const [archiving, setArchiving] = useState(false);

  // settings form state
  const settingsNameRef = useRef<HTMLInputElement>(null);
  const settingsDescRef = useRef<HTMLTextAreaElement>(null);
  const settingsWebsiteRef = useRef<HTMLInputElement>(null);

  const isAdminRole =
    user?.role === "super_admin" ||
    user?.role === "admin" ||
    user?.role === "org_admin";

  const fetchOrg = useCallback(async () => {
    if (!id || !actor) return;
    setLoading(true);
    setError(null);
    try {
      const [orgData, membersData, userOrgs] = await Promise.all([
        actor.getOrg(id),
        actor.getOrgMembers(id),
        user
          ? actor.getUserOrgs(user.id)
          : Promise.resolve([] as Organization[]),
      ]);
      setOrg(orgData);
      setMembers(membersData);
      setIsMember(userOrgs.some((o) => o.id === id));
    } catch (err) {
      console.error(err);
      setError("Failed to load organization details.");
    } finally {
      setLoading(false);
    }
  }, [id, user, actor]);

  useEffect(() => {
    fetchOrg();
  }, [fetchOrg]);

  async function handleJoin() {
    if (!id) return;
    setJoining(true);
    try {
      if (!actor) return;
      await actor.joinOrg(id);
      toast.success("Joined organization successfully");
      await fetchOrg();
    } catch (err) {
      console.error(err);
      toast.error("Failed to join organization.");
    } finally {
      setJoining(false);
    }
  }

  async function handleLeave() {
    if (!id) return;
    setJoining(true);
    try {
      if (!actor) return;
      await actor.leaveOrg(id);
      toast.success("Left organization");
      await fetchOrg();
    } catch (err) {
      console.error(err);
      toast.error("Failed to leave organization.");
    } finally {
      setJoining(false);
    }
  }

  async function handleSaveSettings() {
    if (!org || !id) return;
    setSavingSettings(true);
    try {
      const name = settingsNameRef.current?.value ?? org.name;
      const description = settingsDescRef.current?.value ?? org.description;
      const website = settingsWebsiteRef.current?.value ?? org.website;
      if (!actor) return;
      await actor.updateOrg(
        id,
        name,
        description,
        org.region,
        org.orgType,
        website,
        org.foundedYear,
      );
      toast.success("Organization updated successfully");
      await fetchOrg();
    } catch (err) {
      console.error(err);
      toast.error("Failed to save changes.");
    } finally {
      setSavingSettings(false);
    }
  }

  async function handleArchive() {
    if (!id) return;
    setArchiving(true);
    try {
      if (!actor) return;
      await actor.archiveOrg(id);
      toast.success("Organization archived");
      await fetchOrg();
    } catch (err) {
      console.error(err);
      toast.error("Failed to archive organization.");
    } finally {
      setArchiving(false);
    }
  }

  // ── Loading ──
  if (loading) {
    return (
      <Layout breadcrumb="Organizations › Loading...">
        <div
          className="p-6 max-w-6xl mx-auto space-y-4"
          data-ocid="org_detail.loading_state"
        >
          <Skeleton className="h-48 w-full rounded-xl" />
          <Skeleton className="h-9 w-64" />
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
            <Skeleton className="h-40" />
            <Skeleton className="h-40" />
          </div>
        </div>
      </Layout>
    );
  }

  // ── Error ──
  if (error || !org) {
    return (
      <Layout breadcrumb="Organizations › Not Found">
        <div className="p-6 text-center" data-ocid="org_detail.error_state">
          <p className="text-muted-foreground">
            {error ?? "Organization not found."}
          </p>
          <Button asChild variant="outline" className="mt-4">
            <Link to="/organizations">← Back to Organizations</Link>
          </Button>
        </div>
      </Layout>
    );
  }

  const colorKey = org.id.charCodeAt(org.id.length - 1) % 6;
  const colorPalette = ["blue", "green", "purple", "orange", "red", "teal"];
  const colors = getOrgColorClasses(colorPalette[colorKey]);
  const campaigns = MOCK_CAMPAIGNS_BY_ORG[org.id] ?? [];

  const filteredMembers = members.filter(
    (m) =>
      !memberSearch ||
      m.userId.toLowerCase().includes(memberSearch.toLowerCase()) ||
      m.role.toLowerCase().includes(memberSearch.toLowerCase()),
  );

  const orgInitials = org.name
    .split(" ")
    .slice(0, 2)
    .map((w) => w[0])
    .join("")
    .toUpperCase();

  return (
    <Layout breadcrumb={`Organizations › ${org.name}`}>
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
            <Button
              asChild
              variant="ghost"
              size="sm"
              className="text-white/70 hover:text-white hover:bg-white/10 h-8 gap-1.5 mb-4 -ml-1"
              data-ocid="org_detail.back_button"
            >
              <Link to="/organizations">
                <ArrowLeft size={14} />
                Organizations
              </Link>
            </Button>

            <div className="flex flex-col sm:flex-row sm:items-end gap-4">
              <div
                className={cn(
                  "w-16 h-16 rounded-2xl flex items-center justify-center font-display font-bold text-xl text-white flex-shrink-0 shadow-lg",
                  colors.bg,
                )}
              >
                {orgInitials}
              </div>

              <div className="flex-1 min-w-0">
                <div className="flex flex-wrap items-center gap-2 mb-1">
                  <Badge className="text-[10px] px-2 py-0.5 bg-white/20 text-white border-white/30 font-semibold">
                    {org.orgType}
                  </Badge>
                  <Badge className="text-[10px] px-2 py-0.5 bg-white/20 text-white border-white/30">
                    <Globe size={9} className="mr-1" />
                    {org.region}
                  </Badge>
                  {org.status !== "active" && (
                    <Badge className="text-[10px] px-2 py-0.5 bg-orange-500/80 text-white border-orange-400/30">
                      {org.status}
                    </Badge>
                  )}
                </div>
                <h1 className="text-2xl font-display font-bold text-white tracking-tight">
                  {org.name}
                </h1>
                <div className="flex flex-wrap items-center gap-4 mt-2 text-white/60 text-xs">
                  <span className="flex items-center gap-1">
                    <Calendar size={11} />
                    Est. {Number(org.foundedYear)}
                  </span>
                  {org.website && (
                    <a
                      href={org.website}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex items-center gap-1 hover:text-white transition-colors"
                    >
                      <ExternalLink size={11} />
                      {org.website.replace("https://", "")}
                    </a>
                  )}
                </div>
              </div>

              <div className="flex gap-2 flex-shrink-0">
                {isMember ? (
                  <Button
                    size="sm"
                    className="h-8 text-xs bg-white/20 text-white hover:bg-white/30 font-semibold"
                    onClick={handleLeave}
                    disabled={joining}
                    data-ocid="org_detail.leave_button"
                  >
                    {joining ? "Leaving..." : "Leave Organization"}
                  </Button>
                ) : (
                  <Button
                    size="sm"
                    className="h-8 text-xs bg-white text-primary hover:bg-white/90 font-semibold"
                    onClick={handleJoin}
                    disabled={joining}
                    data-ocid="org_detail.join_button"
                  >
                    {joining ? "Joining..." : "Join Organization"}
                  </Button>
                )}
                <RoleGate roles={["super_admin", "admin", "org_admin"]}>
                  <Button
                    size="sm"
                    variant="outline"
                    className="h-8 text-xs border-white/30 text-white hover:bg-white/10"
                    onClick={() => setActiveTab("settings")}
                    data-ocid="org_detail.manage_button"
                  >
                    <Settings size={12} className="mr-1.5" />
                    Manage
                  </Button>
                </RoleGate>
              </div>
            </div>
          </div>

          {/* Stats bar */}
          <div className="bg-white/10 border-t border-white/10 px-6 py-3 grid grid-cols-2 sm:grid-cols-3 gap-4">
            {[
              {
                label: "Members",
                value: members.length.toLocaleString(),
                icon: <Users size={13} />,
              },
              {
                label: "Campaigns",
                value: campaigns.length,
                icon: <Megaphone size={13} />,
              },
              {
                label: "Founded",
                value: Number(org.foundedYear),
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
                data-ocid="org_detail.tab"
              >
                Overview
              </TabsTrigger>
              <TabsTrigger
                value="members"
                className="text-xs"
                data-ocid="org_detail.tab"
              >
                Members ({members.length})
              </TabsTrigger>
              <TabsTrigger
                value="campaigns"
                className="text-xs"
                data-ocid="org_detail.tab"
              >
                Campaigns ({campaigns.length})
              </TabsTrigger>
              <TabsTrigger
                value="activity"
                className="text-xs"
                data-ocid="org_detail.tab"
              >
                Activity
              </TabsTrigger>
              {isAdminRole && (
                <TabsTrigger
                  value="settings"
                  className="text-xs"
                  data-ocid="org_detail.tab"
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
                className="space-y-5"
              >
                {/* About */}
                <motion.div variants={itemVariants}>
                  <Card>
                    <CardHeader className="pb-2 pt-4 px-4">
                      <CardTitle className="text-sm font-semibold flex items-center gap-2">
                        <Building2 size={14} className="text-primary" />
                        About {org.name}
                      </CardTitle>
                    </CardHeader>
                    <CardContent className="px-4 pb-4">
                      <p className="text-sm text-muted-foreground leading-relaxed">
                        {org.description}
                      </p>
                    </CardContent>
                  </Card>
                </motion.div>

                <div className="grid grid-cols-1 lg:grid-cols-5 gap-5">
                  {/* Recent campaigns */}
                  <motion.div variants={itemVariants} className="lg:col-span-3">
                    <Card>
                      <CardHeader className="pb-2 pt-4 px-4">
                        <div className="flex items-center justify-between">
                          <CardTitle className="text-sm font-semibold flex items-center gap-2">
                            <Megaphone size={14} className="text-green-600" />
                            Recent Campaigns
                          </CardTitle>
                          <Button
                            variant="ghost"
                            size="sm"
                            className="h-7 text-xs text-primary gap-1"
                            onClick={() => setActiveTab("campaigns")}
                            data-ocid="org_detail.view_all_campaigns_button"
                          >
                            View all
                          </Button>
                        </div>
                      </CardHeader>
                      <CardContent className="px-4 pb-4 space-y-2">
                        {campaigns.slice(0, 3).map((c, i) => (
                          <div
                            key={c.id}
                            className="flex items-start justify-between gap-3 p-2.5 rounded-lg bg-secondary/40 hover:bg-secondary/70 transition-colors"
                            data-ocid={`org_detail.campaigns.item.${i + 1}`}
                          >
                            <div className="min-w-0">
                              <p className="text-xs font-semibold text-foreground truncate">
                                {c.title}
                              </p>
                              <p className="text-[11px] text-muted-foreground mt-0.5">
                                {c.dates}
                              </p>
                            </div>
                            <div className="flex items-center gap-2 flex-shrink-0">
                              <span className="text-[10px] text-muted-foreground">
                                {c.participants} joined
                              </span>
                              <Badge
                                variant="outline"
                                className={cn(
                                  "text-[10px] px-1.5 py-0 h-4 font-semibold border-0",
                                  getCampaignStatusClasses(c.status),
                                )}
                              >
                                {c.status}
                              </Badge>
                            </div>
                          </div>
                        ))}
                        {campaigns.length === 0 && (
                          <p className="text-xs text-muted-foreground text-center py-4">
                            No campaigns yet.
                          </p>
                        )}
                      </CardContent>
                    </Card>
                  </motion.div>

                  {/* Recent members */}
                  <motion.div variants={itemVariants} className="lg:col-span-2">
                    <Card>
                      <CardHeader className="pb-2 pt-4 px-4">
                        <div className="flex items-center justify-between">
                          <CardTitle className="text-sm font-semibold flex items-center gap-2">
                            <Users size={14} className="text-blue-600" />
                            Members
                          </CardTitle>
                          <Button
                            variant="ghost"
                            size="sm"
                            className="h-7 text-xs text-primary gap-1"
                            onClick={() => setActiveTab("members")}
                            data-ocid="org_detail.view_all_members_button"
                          >
                            View all
                          </Button>
                        </div>
                      </CardHeader>
                      <CardContent className="px-4 pb-4">
                        <div className="flex flex-wrap gap-1.5">
                          {members.slice(0, 8).map((m, i) => (
                            <div
                              key={m.userId}
                              className="group relative"
                              title={`${m.userId} — ${m.role}`}
                              data-ocid={`org_detail.members.item.${i + 1}`}
                            >
                              <Avatar className="h-9 w-9 ring-2 ring-white hover:ring-primary transition-all cursor-pointer">
                                <AvatarFallback className="text-[11px] font-bold bg-secondary">
                                  {getInitials(m.userId)}
                                </AvatarFallback>
                              </Avatar>
                            </div>
                          ))}
                          {members.length > 8 && (
                            <div className="h-9 w-9 rounded-full bg-secondary border-2 border-white flex items-center justify-center">
                              <span className="text-[10px] font-semibold text-muted-foreground">
                                +{members.length - 8}
                              </span>
                            </div>
                          )}
                        </div>
                        {members.length === 0 && (
                          <p className="text-xs text-muted-foreground text-center py-4">
                            No members yet.
                          </p>
                        )}
                      </CardContent>
                    </Card>
                  </motion.div>
                </div>

                {/* Activity preview */}
                <motion.div variants={itemVariants}>
                  <Card>
                    <CardHeader className="pb-2 pt-4 px-4">
                      <div className="flex items-center justify-between">
                        <CardTitle className="text-sm font-semibold flex items-center gap-2">
                          <Activity size={14} className="text-purple-600" />
                          Latest Activity
                        </CardTitle>
                        <Button
                          variant="ghost"
                          size="sm"
                          className="h-7 text-xs text-primary gap-1"
                          onClick={() => setActiveTab("activity")}
                          data-ocid="org_detail.view_all_activity_button"
                        >
                          View all
                        </Button>
                      </div>
                    </CardHeader>
                    <CardContent className="px-4 pb-4 space-y-0">
                      {MOCK_ORG_ACTIVITIES.slice(0, 4).map((item, i) => (
                        <div key={item.id}>
                          <div
                            className="flex items-start gap-3 py-2.5"
                            data-ocid={`org_detail.activity.item.${i + 1}`}
                          >
                            <div
                              className={cn(
                                "w-7 h-7 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5",
                                ActivityIconBg({ type: item.type }),
                              )}
                            >
                              <ActivityIcon type={item.type} />
                            </div>
                            <div className="flex-1 min-w-0">
                              <p className="text-xs text-foreground leading-snug">
                                {item.description}
                              </p>
                              <p className="text-[10px] text-muted-foreground mt-0.5">
                                {item.actor} · {item.time}
                              </p>
                            </div>
                          </div>
                          {i < 3 && <Separator className="opacity-50" />}
                        </div>
                      ))}
                    </CardContent>
                  </Card>
                </motion.div>
              </motion.div>
            </TabsContent>

            {/* ── Members Tab ── */}
            <TabsContent value="members">
              <motion.div
                initial={{ opacity: 0, y: 8 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.25 }}
              >
                <div className="flex items-center justify-between gap-3 mb-4">
                  <div className="relative flex-1 max-w-xs">
                    <Search
                      size={13}
                      className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground"
                    />
                    <Input
                      placeholder="Search members..."
                      value={memberSearch}
                      onChange={(e) => setMemberSearch(e.target.value)}
                      className="pl-8 h-9 text-sm"
                      data-ocid="org_detail.members_search_input"
                    />
                  </div>
                  <RoleGate roles={["super_admin", "admin", "org_admin"]}>
                    <Button
                      size="sm"
                      className="h-9 text-xs gap-1.5"
                      data-ocid="org_detail.invite_member_button"
                    >
                      <UserPlus size={13} />
                      Invite Member
                    </Button>
                  </RoleGate>
                </div>

                <Card>
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead className="text-xs">Member ID</TableHead>
                        <TableHead className="text-xs">Role</TableHead>
                        <TableHead className="text-xs hidden md:table-cell">
                          Joined
                        </TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {filteredMembers.length === 0 ? (
                        <TableRow>
                          <TableCell
                            colSpan={3}
                            className="text-center text-xs text-muted-foreground py-8"
                            data-ocid="org_detail.members.empty_state"
                          >
                            No members match your search.
                          </TableCell>
                        </TableRow>
                      ) : (
                        filteredMembers.map((m, i) => (
                          <TableRow
                            key={m.userId}
                            data-ocid={`org_detail.members.row.${i + 1}`}
                            className="hover:bg-secondary/30"
                          >
                            <TableCell>
                              <div className="flex items-center gap-2.5">
                                <Avatar className="h-7 w-7">
                                  <AvatarFallback className="text-[10px] font-bold bg-secondary">
                                    {getInitials(m.userId)}
                                  </AvatarFallback>
                                </Avatar>
                                <p className="text-xs font-semibold font-mono">
                                  {m.userId.slice(0, 16)}…
                                </p>
                              </div>
                            </TableCell>
                            <TableCell>
                              <Badge
                                variant="outline"
                                className="text-[10px] px-1.5 py-0 h-4 font-medium capitalize"
                              >
                                {m.role}
                              </Badge>
                            </TableCell>
                            <TableCell className="hidden md:table-cell">
                              <span className="text-xs text-muted-foreground">
                                {new Date(
                                  Number(m.joinedAt) / 1_000_000,
                                ).toLocaleDateString("en-US", {
                                  month: "short",
                                  year: "numeric",
                                })}
                              </span>
                            </TableCell>
                          </TableRow>
                        ))
                      )}
                    </TableBody>
                  </Table>
                </Card>
              </motion.div>
            </TabsContent>

            {/* ── Campaigns Tab ── */}
            <TabsContent value="campaigns">
              <motion.div
                initial={{ opacity: 0, y: 8 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.25 }}
                className="space-y-3"
              >
                {campaigns.length === 0 ? (
                  <div
                    className="text-center py-16 text-muted-foreground text-sm"
                    data-ocid="org_detail.campaigns.empty_state"
                  >
                    No campaigns yet for this organization.
                  </div>
                ) : (
                  campaigns.map((c, i) => (
                    <Card
                      key={c.id}
                      className="hover:shadow-sm transition-shadow"
                      data-ocid={`org_detail.campaigns.card.${i + 1}`}
                    >
                      <CardContent className="px-4 py-3 flex items-center gap-4">
                        <div
                          className={cn(
                            "w-2 h-2 rounded-full flex-shrink-0",
                            c.status === "Active"
                              ? "bg-green-500"
                              : c.status === "Upcoming"
                                ? "bg-yellow-500"
                                : "bg-gray-400",
                          )}
                        />
                        <div className="flex-1 min-w-0">
                          <p className="text-sm font-semibold text-foreground">
                            {c.title}
                          </p>
                          <p className="text-xs text-muted-foreground mt-0.5">
                            {c.dates} · {c.participants} participants
                          </p>
                        </div>
                        <Badge
                          variant="outline"
                          className={cn(
                            "text-[10px] px-1.5 py-0.5 flex-shrink-0 font-semibold",
                            getCampaignStatusClasses(c.status),
                          )}
                        >
                          {c.status}
                        </Badge>
                        <Button
                          size="sm"
                          variant="ghost"
                          className="h-7 text-xs text-primary"
                          data-ocid={`org_detail.campaigns.view_button.${i + 1}`}
                        >
                          View
                        </Button>
                      </CardContent>
                    </Card>
                  ))
                )}
              </motion.div>
            </TabsContent>

            {/* ── Activity Tab ── */}
            <TabsContent value="activity">
              <motion.div
                initial={{ opacity: 0, y: 8 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.25 }}
              >
                <Card>
                  <CardContent className="px-4 pb-4 pt-2 space-y-0">
                    {MOCK_ORG_ACTIVITIES.map((item, i) => (
                      <div key={item.id}>
                        <div
                          className="flex items-start gap-3 py-3"
                          data-ocid={`org_detail.activity_feed.item.${i + 1}`}
                        >
                          <div
                            className={cn(
                              "w-8 h-8 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5",
                              ActivityIconBg({ type: item.type }),
                            )}
                          >
                            <ActivityIcon type={item.type} />
                          </div>
                          <div className="flex-1 min-w-0">
                            <p className="text-sm text-foreground leading-snug">
                              {item.description}
                            </p>
                            <p className="text-[11px] text-muted-foreground mt-0.5">
                              {item.actor} · {item.time}
                            </p>
                          </div>
                        </div>
                        {i < MOCK_ORG_ACTIVITIES.length - 1 && (
                          <Separator className="opacity-40" />
                        )}
                      </div>
                    ))}
                  </CardContent>
                </Card>
              </motion.div>
            </TabsContent>

            {/* ── Settings Tab (Admin only) ── */}
            <RoleGate roles={["super_admin", "admin", "org_admin"]}>
              <TabsContent value="settings">
                <motion.div
                  initial={{ opacity: 0, y: 8 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.25 }}
                  className="space-y-5"
                >
                  {/* Edit org info */}
                  <Card>
                    <CardHeader className="pb-3 pt-4 px-4">
                      <CardTitle className="text-sm font-semibold">
                        Organization Settings
                      </CardTitle>
                    </CardHeader>
                    <CardContent className="px-4 pb-4 space-y-4">
                      <div className="space-y-1.5">
                        <Label className="text-sm font-medium">
                          Organization Name
                        </Label>
                        <Input
                          ref={settingsNameRef}
                          defaultValue={org.name}
                          data-ocid="org_detail.settings_name_input"
                        />
                      </div>
                      <div className="space-y-1.5">
                        <Label className="text-sm font-medium">
                          Description
                        </Label>
                        <Textarea
                          ref={settingsDescRef}
                          defaultValue={org.description}
                          rows={3}
                          data-ocid="org_detail.settings_desc_textarea"
                        />
                      </div>
                      <div className="space-y-1.5">
                        <Label className="text-sm font-medium">Website</Label>
                        <Input
                          ref={settingsWebsiteRef}
                          defaultValue={org.website ?? ""}
                          placeholder="https://example.org"
                          data-ocid="org_detail.settings_website_input"
                        />
                      </div>
                      <div className="flex justify-end">
                        <Button
                          size="sm"
                          className="h-9 text-sm"
                          onClick={handleSaveSettings}
                          disabled={savingSettings}
                          data-ocid="org_detail.settings_save_button"
                        >
                          {savingSettings ? "Saving..." : "Save Changes"}
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
                          <p className="text-sm font-medium">
                            Archive Organization
                          </p>
                          <p className="text-xs text-muted-foreground">
                            Mark this organization as archived. It will no
                            longer appear in active listings.
                          </p>
                        </div>
                        <Button
                          variant="outline"
                          size="sm"
                          className="flex-shrink-0 border-orange-300 text-orange-700 hover:bg-orange-50"
                          onClick={handleArchive}
                          disabled={archiving || org.status === "archived"}
                          data-ocid="org_detail.archive_button"
                        >
                          {archiving
                            ? "Archiving..."
                            : org.status === "archived"
                              ? "Archived"
                              : "Archive"}
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
    </Layout>
  );
}
