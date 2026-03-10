import { RoleGate } from "@/components/RoleGate";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { useAuth } from "@/context/AuthContext";
import { useI18n } from "@/context/I18nContext";
import { cn } from "@/lib/utils";
import {
  AlertTriangle,
  ArrowRight,
  BarChart3,
  BookOpen,
  Building2,
  CalendarDays,
  Flag,
  Globe,
  Megaphone,
  MessageCircle,
  MessageSquare,
  ShieldAlert,
  ShoppingBag,
  TrendingUp,
  UserCheck,
  UserPlus,
  Users,
  Zap,
} from "lucide-react";
import type { Variants } from "motion/react";
import { motion } from "motion/react";
import { Layout } from "../components/Layout";

const containerVariants: Variants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.08,
    },
  },
};

const itemVariants: Variants = {
  hidden: { opacity: 0, y: 16 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.35 } },
};

const STATS = [
  {
    label: "Organizations",
    value: "3",
    sub: "joined",
    icon: <Building2 size={20} />,
    color: "text-blue-600",
    bg: "bg-blue-50",
    ocid: "dashboard.orgs_card",
  },
  {
    label: "Active Campaigns",
    value: "7",
    sub: "in progress",
    icon: <Megaphone size={20} />,
    color: "text-green-600",
    bg: "bg-green-50",
    ocid: "dashboard.campaigns_card",
  },
  {
    label: "Forum Posts",
    value: "24",
    sub: "contributed",
    icon: <MessageSquare size={20} />,
    color: "text-purple-600",
    bg: "bg-purple-50",
    ocid: "dashboard.posts_card",
  },
  {
    label: "Members Reached",
    value: "1,240",
    sub: "across all orgs",
    icon: <Users size={20} />,
    color: "text-orange-600",
    bg: "bg-orange-50",
    ocid: "dashboard.members_card",
  },
];

const QUICK_ACTIONS = [
  {
    label: "Create Campaign",
    icon: <Megaphone size={16} />,
    to: "/campaigns",
    ocid: "dashboard.create_campaign_button",
    variant: "default" as const,
  },
  {
    label: "Post in Forum",
    icon: <MessageCircle size={16} />,
    to: "/forums",
    ocid: "dashboard.post_forum_button",
    variant: "outline" as const,
  },
  {
    label: "Browse Store",
    icon: <ShoppingBag size={16} />,
    to: "/store",
    ocid: "dashboard.browse_store_button",
    variant: "outline" as const,
  },
  {
    label: "View Directory",
    icon: <BookOpen size={16} />,
    to: "/members",
    ocid: "dashboard.view_directory_button",
    variant: "outline" as const,
  },
];

const MY_ORGS = [
  {
    name: "IIIntl Global Council",
    region: "Global",
    members: 340,
    icon: <Globe size={16} />,
    color: "bg-blue-100 text-blue-700",
  },
  {
    name: "Americas Chapter",
    region: "North America",
    members: 87,
    icon: <Flag size={16} />,
    color: "bg-green-100 text-green-700",
  },
  {
    name: "Africa Region",
    region: "Sub-Saharan Africa",
    members: 63,
    icon: <Zap size={16} />,
    color: "bg-orange-100 text-orange-700",
  },
];

const CAMPAIGNS = [
  {
    title: "Global Climate Justice Summit",
    status: "Active",
    dates: "Mar 1 – Apr 30, 2026",
    statusColor: "bg-green-100 text-green-700",
  },
  {
    title: "Digital Rights Charter",
    status: "Active",
    dates: "Feb 15 – May 15, 2026",
    statusColor: "bg-green-100 text-green-700",
  },
  {
    title: "Youth Leadership Initiative",
    status: "Upcoming",
    dates: "Apr 10 – Jun 30, 2026",
    statusColor: "bg-yellow-100 text-yellow-700",
  },
];

const ACTIVITY_FEED = [
  {
    icon: <Building2 size={14} className="text-blue-600" />,
    text: "You joined IIIntl Global Council",
    time: "2 days ago",
    bg: "bg-blue-50",
  },
  {
    icon: <MessageSquare size={14} className="text-purple-600" />,
    text: "Posted in Digital Rights Forum",
    time: "5 hours ago",
    bg: "bg-purple-50",
  },
  {
    icon: <Megaphone size={14} className="text-green-600" />,
    text: "Signed petition: Climate Justice Now",
    time: "1 day ago",
    bg: "bg-green-50",
  },
  {
    icon: <UserCheck size={14} className="text-orange-600" />,
    text: "Profile approved by Africa Region admin",
    time: "3 days ago",
    bg: "bg-orange-50",
  },
  {
    icon: <TrendingUp size={14} className="text-indigo-600" />,
    text: "Youth Leadership Initiative launch announced",
    time: "4 days ago",
    bg: "bg-indigo-50",
  },
];

export function DashboardPage() {
  const { user } = useAuth();
  const { t } = useI18n();

  return (
    <Layout breadcrumb={t.dashboard.title}>
      <div className="p-6 max-w-7xl mx-auto">
        <motion.div
          variants={containerVariants}
          initial="hidden"
          animate="visible"
          className="space-y-6"
        >
          {/* Page Header */}
          <motion.div
            variants={itemVariants}
            className="flex items-start justify-between gap-4"
          >
            <div>
              <h1 className="text-2xl font-display font-bold text-primary tracking-tight">
                {t.dashboard.welcome}, {user?.name?.split(" ")[0]}
              </h1>
              <p className="text-muted-foreground text-sm mt-0.5">
                Here&apos;s an overview of your platform activity
              </p>
              <div className="mt-3 civic-rule w-12" />
            </div>
            <Badge
              variant="outline"
              className="capitalize border-primary/30 text-primary font-semibold text-xs flex-shrink-0 mt-1"
            >
              {user?.role.replace("_", " ")}
            </Badge>
          </motion.div>

          {/* Stats Row */}
          <motion.div
            variants={itemVariants}
            className="grid grid-cols-2 lg:grid-cols-4 gap-4"
            data-ocid="dashboard.section"
          >
            {STATS.map((stat) => (
              <Card
                key={stat.label}
                className="border-border hover:shadow-md hover:border-primary/20 transition-all duration-200"
                data-ocid={stat.ocid}
              >
                <CardContent className="p-4">
                  <div className="flex items-start justify-between">
                    <div>
                      <p className="text-2xl font-display font-bold text-foreground">
                        {stat.value}
                      </p>
                      <p className="text-xs text-muted-foreground mt-0.5">
                        {stat.label}
                      </p>
                      <p className="text-[10px] text-muted-foreground/60 mt-0.5">
                        {stat.sub}
                      </p>
                    </div>
                    <div
                      className={cn(
                        "w-9 h-9 rounded-lg flex items-center justify-center flex-shrink-0",
                        stat.bg,
                        stat.color,
                      )}
                    >
                      {stat.icon}
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </motion.div>

          {/* Quick Actions */}
          <motion.div variants={itemVariants}>
            <Card className="border-border">
              <CardHeader className="pb-3 pt-4 px-4">
                <CardTitle className="text-sm font-semibold text-foreground">
                  Quick Actions
                </CardTitle>
              </CardHeader>
              <CardContent className="px-4 pb-4">
                <div className="flex flex-wrap gap-2">
                  {QUICK_ACTIONS.map((action) => (
                    <Button
                      key={action.label}
                      variant={action.variant}
                      size="sm"
                      className="h-9 gap-2 text-xs font-medium"
                      data-ocid={action.ocid}
                    >
                      {action.icon}
                      {action.label}
                    </Button>
                  ))}
                </div>
              </CardContent>
            </Card>
          </motion.div>

          {/* Main Content Grid */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* My Organizations */}
            <motion.div variants={itemVariants} className="lg:col-span-1">
              <Card className="border-border h-full">
                <CardHeader className="pb-3 pt-4 px-4">
                  <div className="flex items-center justify-between">
                    <CardTitle className="text-sm font-semibold text-foreground flex items-center gap-2">
                      <Building2 size={15} className="text-blue-600" />
                      My Organizations
                    </CardTitle>
                    <Button
                      variant="ghost"
                      size="sm"
                      className="h-7 text-xs text-primary gap-1"
                      data-ocid="dashboard.view_all_orgs_button"
                    >
                      All <ArrowRight size={11} />
                    </Button>
                  </div>
                </CardHeader>
                <CardContent className="px-4 pb-4 space-y-3">
                  {MY_ORGS.map((org, i) => (
                    <div
                      key={org.name}
                      className="flex items-start gap-3 p-2.5 rounded-lg bg-secondary/40 hover:bg-secondary/70 transition-colors"
                      data-ocid={`dashboard.orgs.item.${i + 1}`}
                    >
                      <div
                        className={cn(
                          "w-8 h-8 rounded-md flex items-center justify-center flex-shrink-0",
                          org.color,
                        )}
                      >
                        {org.icon}
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="text-xs font-semibold text-foreground truncate">
                          {org.name}
                        </p>
                        <p className="text-[10px] text-muted-foreground">
                          {org.region} · {org.members} members
                        </p>
                      </div>
                      <Button
                        variant="ghost"
                        size="sm"
                        className="h-6 text-[10px] px-2 text-primary flex-shrink-0"
                        data-ocid={`dashboard.orgs.view_button.${i + 1}`}
                      >
                        View
                      </Button>
                    </div>
                  ))}
                </CardContent>
              </Card>
            </motion.div>

            {/* Upcoming Campaigns */}
            <motion.div variants={itemVariants} className="lg:col-span-1">
              <Card className="border-border h-full">
                <CardHeader className="pb-3 pt-4 px-4">
                  <div className="flex items-center justify-between">
                    <CardTitle className="text-sm font-semibold text-foreground flex items-center gap-2">
                      <Megaphone size={15} className="text-green-600" />
                      Campaigns
                    </CardTitle>
                    <Button
                      variant="ghost"
                      size="sm"
                      className="h-7 text-xs text-primary gap-1"
                      data-ocid="dashboard.view_all_campaigns_button"
                    >
                      All <ArrowRight size={11} />
                    </Button>
                  </div>
                </CardHeader>
                <CardContent className="px-4 pb-4 space-y-3">
                  {CAMPAIGNS.map((campaign, i) => (
                    <div
                      key={campaign.title}
                      className="p-2.5 rounded-lg bg-secondary/40 hover:bg-secondary/70 transition-colors"
                      data-ocid={`dashboard.campaigns.item.${i + 1}`}
                    >
                      <div className="flex items-start justify-between gap-2 mb-1">
                        <p className="text-xs font-semibold text-foreground leading-snug">
                          {campaign.title}
                        </p>
                        <Badge
                          className={cn(
                            "text-[10px] px-1.5 py-0 flex-shrink-0 font-semibold border-0",
                            campaign.statusColor,
                          )}
                        >
                          {campaign.status}
                        </Badge>
                      </div>
                      <div className="flex items-center gap-1 text-[10px] text-muted-foreground">
                        <CalendarDays size={10} />
                        {campaign.dates}
                      </div>
                    </div>
                  ))}
                </CardContent>
              </Card>
            </motion.div>

            {/* Recent Activity */}
            <motion.div variants={itemVariants} className="lg:col-span-1">
              <Card className="border-border h-full">
                <CardHeader className="pb-3 pt-4 px-4">
                  <CardTitle className="text-sm font-semibold text-foreground flex items-center gap-2">
                    <BarChart3 size={15} className="text-purple-600" />
                    Recent Activity
                  </CardTitle>
                </CardHeader>
                <CardContent className="px-4 pb-4 space-y-0">
                  {ACTIVITY_FEED.map((item, i) => (
                    // biome-ignore lint/suspicious/noArrayIndexKey: static list
                    <div key={i}>
                      <div
                        className="flex items-start gap-3 py-2.5"
                        data-ocid={`dashboard.activity.item.${i + 1}`}
                      >
                        <div
                          className={cn(
                            "w-7 h-7 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5",
                            item.bg,
                          )}
                        >
                          {item.icon}
                        </div>
                        <div className="flex-1 min-w-0">
                          <p className="text-xs text-foreground leading-snug">
                            {item.text}
                          </p>
                          <p className="text-[10px] text-muted-foreground mt-0.5">
                            {item.time}
                          </p>
                        </div>
                      </div>
                      {i < ACTIVITY_FEED.length - 1 && (
                        <Separator className="opacity-50" />
                      )}
                    </div>
                  ))}
                </CardContent>
              </Card>
            </motion.div>
          </div>

          {/* Role-gated Admin Widget */}
          <RoleGate roles={["admin", "super_admin", "org_admin"]}>
            <motion.div variants={itemVariants}>
              <Card
                className="border-orange-200 bg-orange-50/50"
                data-ocid="dashboard.admin_panel"
              >
                <CardHeader className="pb-3 pt-4 px-4">
                  <CardTitle className="text-sm font-semibold text-orange-800 flex items-center gap-2">
                    <ShieldAlert size={15} className="text-orange-600" />
                    Admin Overview
                    <Badge className="text-[10px] px-1.5 bg-orange-100 text-orange-700 border-orange-200 font-semibold">
                      Admin only
                    </Badge>
                  </CardTitle>
                </CardHeader>
                <CardContent className="px-4 pb-4">
                  <div className="grid grid-cols-3 gap-3">
                    <div
                      className="p-3 bg-white rounded-lg border border-orange-200 text-center"
                      data-ocid="dashboard.admin.pending_users_card"
                    >
                      <div className="flex items-center justify-center gap-1.5 mb-1">
                        <UserPlus size={14} className="text-orange-500" />
                      </div>
                      <p className="text-xl font-display font-bold text-orange-700">
                        4
                      </p>
                      <p className="text-[10px] text-orange-600/80 font-medium">
                        Pending Users
                      </p>
                    </div>
                    <div
                      className="p-3 bg-white rounded-lg border border-orange-200 text-center"
                      data-ocid="dashboard.admin.new_reports_card"
                    >
                      <div className="flex items-center justify-center gap-1.5 mb-1">
                        <BarChart3 size={14} className="text-orange-500" />
                      </div>
                      <p className="text-xl font-display font-bold text-orange-700">
                        2
                      </p>
                      <p className="text-[10px] text-orange-600/80 font-medium">
                        New Reports
                      </p>
                    </div>
                    <div
                      className="p-3 bg-white rounded-lg border border-orange-200 text-center"
                      data-ocid="dashboard.admin.flagged_posts_card"
                    >
                      <div className="flex items-center justify-center gap-1.5 mb-1">
                        <AlertTriangle size={14} className="text-orange-500" />
                      </div>
                      <p className="text-xl font-display font-bold text-orange-700">
                        1
                      </p>
                      <p className="text-[10px] text-orange-600/80 font-medium">
                        Flagged Posts
                      </p>
                    </div>
                  </div>
                  <div className="mt-3 flex justify-end">
                    <Button
                      variant="outline"
                      size="sm"
                      className="h-7 text-xs border-orange-300 text-orange-700 hover:bg-orange-100 gap-1"
                      data-ocid="dashboard.admin.go_to_panel_button"
                    >
                      Admin Panel <ArrowRight size={11} />
                    </Button>
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          </RoleGate>
        </motion.div>
      </div>
    </Layout>
  );
}
