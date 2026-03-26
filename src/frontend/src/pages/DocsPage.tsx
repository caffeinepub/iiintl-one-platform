import { Layout } from "@/components/Layout";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import { useI18n } from "@/context/I18nContext";
import { cn } from "@/lib/utils";
import {
  BookOpen,
  Building2,
  ChevronDown,
  ChevronRight,
  Code2,
  FileText,
  Gift,
  Globe,
  HelpCircle,
  LayoutDashboard,
  Lock,
  Megaphone,
  Menu,
  MessageSquare,
  Settings,
  Shield,
  Star,
  TrendingUp,
  Users,
  Zap,
} from "lucide-react";
import type { Variants } from "motion/react";
import { motion } from "motion/react";
import { useEffect, useRef, useState } from "react";

// ─── Types ────────────────────────────────────────────────────────────────────

interface DocSubsection {
  id: string;
  title: string;
  content: React.ReactNode;
}

interface DocSection {
  id: string;
  title: string;
  icon: React.ReactNode;
  badge?: string;
  subsections: DocSubsection[];
}

// ─── Documentation Content ────────────────────────────────────────────────────

const DOC_SECTIONS: DocSection[] = [
  {
    id: "getting-started",
    title: "Getting Started",
    icon: <LayoutDashboard size={15} />,
    subsections: [
      {
        id: "platform-overview",
        title: "Platform Overview",
        content: (
          <div className="space-y-4">
            <p className="text-sm text-muted-foreground leading-relaxed">
              IIIntl One is an all-in-one civic engagement platform built for
              the global Independent Interdependent International network. It
              brings together organization management, campaign coordination,
              community forums, resource sharing, and a multi-vendor marketplace
              under a single, unified interface.
            </p>
            <p className="text-sm text-muted-foreground leading-relaxed">
              The platform is built on the Internet Computer Protocol (ICP), a
              decentralized computing network that provides high-availability
              hosting, tamper-resistant data storage, and sovereign identity
              management through Internet Identity. This means your data and
              your organization's operations remain secure and
              censorship-resistant.
            </p>
            <div className="bg-secondary/40 rounded-lg p-4 border border-border">
              <h4 className="font-display font-semibold text-sm text-foreground mb-2">
                Core Platform Modules
              </h4>
              <ul className="space-y-1.5">
                {[
                  "Organization Management — Create and manage civic organizations globally",
                  "Member Directory — Connect with activists and leaders worldwide",
                  "Campaign Engine — Launch petitions, events, and coordinated actions",
                  "Community Forums — Discuss, collaborate, and strategize",
                  "Resource Library — Share guides, reports, toolkits, and training",
                  "Activism Hub — Petitions, calls to action, and event coordination",
                  "Multi-Vendor Store — Merchandise and resource marketplace",
                  "Multi-Language Interface — Five languages, more coming",
                ].map((item) => (
                  <li
                    key={item}
                    className="flex items-start gap-2 text-xs text-muted-foreground"
                  >
                    <ChevronRight
                      size={12}
                      className="text-primary flex-shrink-0 mt-0.5"
                    />
                    {item}
                  </li>
                ))}
              </ul>
            </div>
          </div>
        ),
      },
      {
        id: "creating-account",
        title: "Creating an Account",
        content: (
          <div className="space-y-4">
            <p className="text-sm text-muted-foreground leading-relaxed">
              To create an account on IIIntl One, navigate to the registration
              page by clicking &quot;Get Started&quot; in the top navigation
              bar. You will need to provide your full name, a valid email
              address, and a password of at least 8 characters.
            </p>
            <p className="text-sm text-muted-foreground leading-relaxed">
              New accounts are assigned the <strong>Member</strong> role by
              default. Organization administrators can upgrade your role within
              their organization&apos;s context. Platform administrators can
              assign global admin roles for platform management.
            </p>
            <div className="bg-amber-50 border border-amber-200 rounded-lg p-4">
              <h4 className="font-display font-semibold text-sm text-amber-800 mb-1.5 flex items-center gap-1.5">
                <Shield size={13} className="text-amber-600" />
                Demo Mode
              </h4>
              <p className="text-xs text-amber-700 leading-relaxed">
                The platform includes a demo mode accessible from the login
                page. Click any demo account to instantly experience the
                platform as each of the six roles: Guest, Member, Activist, Org
                Admin, Admin, and Super Admin.
              </p>
            </div>
          </div>
        ),
      },
      {
        id: "navigating-platform",
        title: "Navigating the Platform",
        content: (
          <div className="space-y-4">
            <p className="text-sm text-muted-foreground leading-relaxed">
              The platform uses a dual-navigation system: a persistent sidebar
              on desktop for deep navigation, and a top navigation bar for quick
              access to major sections and account management. On mobile, the
              sidebar collapses into a slide-out drawer accessed via the menu
              icon.
            </p>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              {[
                {
                  title: "Sidebar Sections",
                  items: [
                    "Main (Dashboard, Orgs, Campaigns, Activism)",
                    "Community (Forums, Members, Directory)",
                    "Knowledge (Resources, FAQ, Docs)",
                    "Commerce (Store, Orders)",
                    "Admin (Admin-only: Users, Settings, Reports)",
                  ],
                },
                {
                  title: "Top Bar Controls",
                  items: [
                    "Platform-wide navigation links",
                    "Language switcher (5 languages)",
                    "Login / Register (unauthenticated)",
                    "User dropdown + role switcher (authenticated)",
                    "Mobile sidebar trigger",
                  ],
                },
              ].map((col) => (
                <div
                  key={col.title}
                  className="bg-secondary/30 rounded-lg p-3 border border-border"
                >
                  <h4 className="font-display font-semibold text-xs text-foreground mb-2">
                    {col.title}
                  </h4>
                  <ul className="space-y-1">
                    {col.items.map((item) => (
                      <li
                        key={item}
                        className="flex items-start gap-1.5 text-xs text-muted-foreground"
                      >
                        <ChevronRight
                          size={10}
                          className="text-primary flex-shrink-0 mt-0.5"
                        />
                        {item}
                      </li>
                    ))}
                  </ul>
                </div>
              ))}
            </div>
          </div>
        ),
      },
    ],
  },
  {
    id: "organizations",
    title: "Organizations",
    icon: <Building2 size={15} />,
    subsections: [
      {
        id: "creating-org",
        title: "Creating an Organization",
        content: (
          <div className="space-y-4">
            <p className="text-sm text-muted-foreground leading-relaxed">
              Organizations are the primary structural unit of IIIntl One.
              Platform Admins and Super Admins can create new organizations.
              Navigate to the Organizations page and click &quot;Create
              Organization.&quot; Fill in the required fields: organization
              name, type, region, and description.
            </p>
            <p className="text-sm text-muted-foreground leading-relaxed">
              Organization types include Global Secretariat, Regional Chapter,
              National Chapter, Advocacy Group, Youth Network, Research
              Institute, Coalition, and Task Force. The type affects how the
              organization is categorized and displayed in the directory.
            </p>
            <div className="overflow-hidden rounded-lg border border-border">
              <table className="w-full text-xs">
                <thead className="bg-secondary/50">
                  <tr>
                    <th className="text-left px-3 py-2 font-semibold text-foreground">
                      Field
                    </th>
                    <th className="text-left px-3 py-2 font-semibold text-foreground">
                      Required
                    </th>
                    <th className="text-left px-3 py-2 font-semibold text-foreground">
                      Notes
                    </th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-border">
                  {[
                    ["Name", "Yes", "Must be unique across the platform"],
                    ["Type", "Yes", "Select from 8 organization types"],
                    ["Region", "Yes", "Geographic focus of the organization"],
                    ["Description", "Yes", "Min 50 characters recommended"],
                    ["Website", "No", "External URL for the organization"],
                    ["Tagline", "No", "Short mission statement"],
                  ].map(([field, req, note]) => (
                    <tr key={field} className="hover:bg-secondary/20">
                      <td className="px-3 py-2 font-medium text-foreground">
                        {field}
                      </td>
                      <td className="px-3 py-2">
                        <Badge
                          variant="outline"
                          className={cn(
                            "text-[10px] h-4 px-1.5 py-0",
                            req === "Yes"
                              ? "border-destructive/30 text-destructive bg-destructive/5"
                              : "border-border text-muted-foreground",
                          )}
                        >
                          {req}
                        </Badge>
                      </td>
                      <td className="px-3 py-2 text-muted-foreground">
                        {note}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        ),
      },
      {
        id: "managing-members",
        title: "Managing Members",
        content: (
          <div className="space-y-4">
            <p className="text-sm text-muted-foreground leading-relaxed">
              Organization Admins manage their member roster from the
              Organization Detail page, Members tab. Members can be invited by
              email, have their roles adjusted within the organization, or be
              removed when necessary. All membership changes are logged in the
              organization&apos;s activity history.
            </p>
            <div className="space-y-2">
              {[
                {
                  action: "Invite Member",
                  desc: "Send email invitation to a new or existing platform user. Invite expires after 7 days.",
                },
                {
                  action: "Adjust Role",
                  desc: "Change a member's organizational role. Requires Org Admin or higher permission.",
                },
                {
                  action: "Remove Member",
                  desc: "Removes the member from the organization. Their platform account is not deleted.",
                },
                {
                  action: "Transfer Admin",
                  desc: "Assign Org Admin role to another member. The previous admin retains member status.",
                },
              ].map((item) => (
                <div
                  key={item.action}
                  className="flex items-start gap-3 p-3 rounded-lg bg-secondary/30 border border-border"
                >
                  <Badge
                    variant="outline"
                    className="text-[10px] h-5 px-2 border-primary/30 text-primary bg-primary/5 flex-shrink-0 mt-0.5"
                  >
                    {item.action}
                  </Badge>
                  <p className="text-xs text-muted-foreground leading-relaxed">
                    {item.desc}
                  </p>
                </div>
              ))}
            </div>
          </div>
        ),
      },
      {
        id: "roles-permissions",
        title: "Roles & Permissions",
        content: (
          <div className="space-y-4">
            <p className="text-sm text-muted-foreground leading-relaxed">
              IIIntl One uses a hierarchical role system. Global roles (Super
              Admin, Admin) apply platform-wide. Org Admin applies within the
              scope of a specific organization. Member and Activist roles
              control individual feature access.
            </p>
            <div className="overflow-hidden rounded-lg border border-border">
              <table className="w-full text-xs">
                <thead className="bg-secondary/50">
                  <tr>
                    <th className="text-left px-3 py-2 font-semibold text-foreground">
                      Role
                    </th>
                    <th className="text-left px-3 py-2 font-semibold text-foreground">
                      Key Capabilities
                    </th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-border">
                  {[
                    [
                      "Super Admin",
                      "Full platform control, system settings, all org management",
                    ],
                    [
                      "Admin",
                      "All org management, user management, content moderation",
                    ],
                    [
                      "Org Admin",
                      "Manage one org: members, campaigns, resources, settings",
                    ],
                    [
                      "Activist",
                      "Create activism actions, join campaigns, post forums",
                    ],
                    [
                      "Member",
                      "Join campaigns, sign petitions, post in forums",
                    ],
                    ["Guest", "View public pages only — no community features"],
                  ].map(([role, caps]) => (
                    <tr key={role} className="hover:bg-secondary/20">
                      <td className="px-3 py-2 font-medium text-foreground whitespace-nowrap">
                        {role}
                      </td>
                      <td className="px-3 py-2 text-muted-foreground">
                        {caps}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        ),
      },
    ],
  },
  {
    id: "campaigns",
    title: "Campaigns",
    icon: <Megaphone size={15} />,
    subsections: [
      {
        id: "launching-campaign",
        title: "Launching a Campaign",
        content: (
          <div className="space-y-4">
            <p className="text-sm text-muted-foreground leading-relaxed">
              Campaigns are the primary vehicle for organized civic action on
              IIIntl One. Organization Admins and higher can create campaigns
              from the Campaigns page or the Campaign tab within an
              organization&apos;s detail view.
            </p>
            <p className="text-sm text-muted-foreground leading-relaxed">
              A well-structured campaign includes a compelling title, a clear
              description of the problem and goal, measurable targets (signature
              count, participation number), defined start and end dates, and an
              associated organization. Campaigns move through statuses: Draft →
              Active → Paused → Completed or Archived.
            </p>
            <div className="bg-secondary/40 rounded-lg p-4 border border-border">
              <h4 className="font-display font-semibold text-sm text-foreground mb-2">
                Campaign Status Flow
              </h4>
              <div className="flex items-center gap-2 flex-wrap text-xs">
                {["Draft", "Active", "Paused", "Completed"].map(
                  (status, i, arr) => (
                    <span key={status} className="flex items-center gap-2">
                      <Badge variant="outline" className="text-[10px] h-5 px-2">
                        {status}
                      </Badge>
                      {i < arr.length - 1 && (
                        <ChevronRight
                          size={12}
                          className="text-muted-foreground"
                        />
                      )}
                    </span>
                  ),
                )}
              </div>
            </div>
          </div>
        ),
      },
      {
        id: "petitions-ctas",
        title: "Petitions & CTAs",
        content: (
          <div className="space-y-4">
            <p className="text-sm text-muted-foreground leading-relaxed">
              Campaigns can include Petitions and Calls to Action (CTAs) as
              tactical components. Petitions collect member signatures toward a
              stated goal and can be exported for formal submission to
              decision-makers. CTAs are specific, time-bound action requests
              like calling a representative or attending a meeting.
            </p>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              {[
                {
                  title: "Petitions",
                  points: [
                    "Set a signature target and deadline",
                    "Members sign with one click",
                    "Real-time progress tracking",
                    "Export signature list (admin only)",
                    "Share unique petition URL",
                  ],
                },
                {
                  title: "Calls to Action",
                  points: [
                    "Define a specific action and steps",
                    "Set urgency level and deadline",
                    "Track completion count",
                    "Attach scripts and talking points",
                    "Nest within a Campaign or standalone",
                  ],
                },
              ].map((col) => (
                <div
                  key={col.title}
                  className="bg-secondary/30 rounded-lg p-3 border border-border"
                >
                  <h4 className="font-display font-semibold text-xs text-foreground mb-2">
                    {col.title}
                  </h4>
                  <ul className="space-y-1">
                    {col.points.map((p) => (
                      <li
                        key={p}
                        className="flex items-start gap-1.5 text-xs text-muted-foreground"
                      >
                        <ChevronRight
                          size={10}
                          className="text-primary flex-shrink-0 mt-0.5"
                        />
                        {p}
                      </li>
                    ))}
                  </ul>
                </div>
              ))}
            </div>
          </div>
        ),
      },
      {
        id: "campaign-admin",
        title: "Campaign Admin Controls",
        content: (
          <div className="space-y-4">
            <p className="text-sm text-muted-foreground leading-relaxed">
              Organization Admins can manage campaigns through the Campaign
              Detail page, Admin tab. Controls include editing campaign details,
              changing campaign status, and accessing analytics. Campaign
              analytics show participation trends, conversion rates from views
              to actions, regional distribution of participants, and timeline
              milestones.
            </p>
            <div className="space-y-2">
              {[
                {
                  icon: "✏️",
                  title: "Edit Campaign",
                  desc: "Update title, description, goals, dates, or attached petitions at any time.",
                },
                {
                  icon: "⏸️",
                  title: "Pause Campaign",
                  desc: "Temporarily halt a campaign without losing progress. Useful for strategic recalibration.",
                },
                {
                  icon: "🏁",
                  title: "Complete Campaign",
                  desc: "Mark a campaign as achieved. Participants receive a completion notification.",
                },
                {
                  icon: "📦",
                  title: "Archive Campaign",
                  desc: "Move a campaign to archive. Preserves all data but removes from active listings.",
                },
              ].map((item) => (
                <div
                  key={item.title}
                  className="flex items-start gap-3 p-3 rounded-lg bg-secondary/30 border border-border"
                >
                  <span className="text-base flex-shrink-0">{item.icon}</span>
                  <div>
                    <p className="text-xs font-semibold text-foreground mb-0.5">
                      {item.title}
                    </p>
                    <p className="text-xs text-muted-foreground leading-relaxed">
                      {item.desc}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        ),
      },
    ],
  },
  {
    id: "forums",
    title: "Forums",
    icon: <MessageSquare size={15} />,
    subsections: [
      {
        id: "posting-replying",
        title: "Posting & Replying",
        content: (
          <div className="space-y-4">
            <p className="text-sm text-muted-foreground leading-relaxed">
              The IIIntl One Forums are organized into categories reflecting the
              platform&apos;s thematic areas: General Discussion, Climate &amp;
              Environment, Digital Rights, Labor &amp; Economic Justice,
              Democracy &amp; Elections, Women&apos;s Rights, Youth &amp;
              Education, Peace &amp; Diplomacy, Org Announcements, and Regional
              News.
            </p>
            <p className="text-sm text-muted-foreground leading-relaxed">
              Members, Activists, Org Admins, Admins, and Super Admins can
              create new threads. All authenticated users can reply to open
              threads. Threads support plain text with markdown-like formatting,
              and you can add comma-separated tags to improve discoverability.
            </p>
            <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
              <h4 className="font-display font-semibold text-xs text-blue-800 mb-1.5">
                Tips for Quality Posts
              </h4>
              <ul className="space-y-1">
                {[
                  "Choose a specific, descriptive title — avoid vague titles like 'Question'",
                  "Include regional context when relevant — it helps others engage meaningfully",
                  "Use tags to connect your thread to ongoing campaigns or topics",
                  "Keep opening posts focused — detailed threads get better responses",
                ].map((tip) => (
                  <li
                    key={tip}
                    className="flex items-start gap-1.5 text-xs text-blue-700"
                  >
                    <ChevronRight size={10} className="flex-shrink-0 mt-0.5" />
                    {tip}
                  </li>
                ))}
              </ul>
            </div>
          </div>
        ),
      },
      {
        id: "moderation-guide",
        title: "Moderation Guide",
        content: (
          <div className="space-y-4">
            <p className="text-sm text-muted-foreground leading-relaxed">
              Forum moderation is carried out by Organization Admins (within
              their org&apos;s threads) and Platform Admins (across the entire
              platform). All moderation actions are logged with a timestamp,
              moderator identity, and reason. Moderation decisions can be
              appealed by contacting the platform administration team.
            </p>
            <div className="overflow-hidden rounded-lg border border-border">
              <table className="w-full text-xs">
                <thead className="bg-secondary/50">
                  <tr>
                    <th className="text-left px-3 py-2 font-semibold text-foreground">
                      Action
                    </th>
                    <th className="text-left px-3 py-2 font-semibold text-foreground">
                      Who Can Do It
                    </th>
                    <th className="text-left px-3 py-2 font-semibold text-foreground">
                      Effect
                    </th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-border">
                  {[
                    [
                      "Pin Thread",
                      "Org Admin+",
                      "Thread always appears at top of its category",
                    ],
                    [
                      "Lock Thread",
                      "Org Admin+",
                      "No new replies; thread remains readable",
                    ],
                    [
                      "Archive Thread",
                      "Org Admin+",
                      "Thread hidden from main listings",
                    ],
                    [
                      "Delete Post",
                      "Admin+",
                      "Removes specific post; leaves thread intact",
                    ],
                    [
                      "Remove Thread",
                      "Admin+",
                      "Removes entire thread and all replies",
                    ],
                    [
                      "Flag Content",
                      "Any Member",
                      "Sends alert to moderators for review",
                    ],
                  ].map(([action, who, effect]) => (
                    <tr key={action} className="hover:bg-secondary/20">
                      <td className="px-3 py-2 font-medium text-foreground">
                        {action}
                      </td>
                      <td className="px-3 py-2 text-muted-foreground">{who}</td>
                      <td className="px-3 py-2 text-muted-foreground">
                        {effect}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        ),
      },
      {
        id: "community-standards",
        title: "Community Standards",
        content: (
          <div className="space-y-4">
            <p className="text-sm text-muted-foreground leading-relaxed">
              IIIntl One&apos;s forums are designed for constructive civic
              dialogue across cultural and political boundaries. The community
              standards reflect the platform&apos;s core values: independence,
              interdependence, and international solidarity.
            </p>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div className="bg-emerald-50 border border-emerald-200 rounded-lg p-3">
                <h4 className="font-display font-semibold text-xs text-emerald-800 mb-2">
                  Encouraged
                </h4>
                <ul className="space-y-1">
                  {[
                    "Sharing local organizing experiences",
                    "Constructive critique of policy and tactics",
                    "Cross-regional solidarity and support",
                    "Evidence-based discussion",
                    "Multilingual participation",
                  ].map((item) => (
                    <li
                      key={item}
                      className="flex items-start gap-1.5 text-xs text-emerald-700"
                    >
                      <span className="text-emerald-500 flex-shrink-0">✓</span>
                      {item}
                    </li>
                  ))}
                </ul>
              </div>
              <div className="bg-rose-50 border border-rose-200 rounded-lg p-3">
                <h4 className="font-display font-semibold text-xs text-rose-800 mb-2">
                  Not Permitted
                </h4>
                <ul className="space-y-1">
                  {[
                    "Harassment or personal attacks",
                    "Incitement to violence",
                    "Disinformation or fabricated content",
                    "Spam or commercial solicitation",
                    "Sharing personal data without consent",
                  ].map((item) => (
                    <li
                      key={item}
                      className="flex items-start gap-1.5 text-xs text-rose-700"
                    >
                      <span className="text-rose-500 flex-shrink-0">✕</span>
                      {item}
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          </div>
        ),
      },
    ],
  },
  {
    id: "resources-knowledge",
    title: "Resources & Knowledge",
    icon: <BookOpen size={15} />,
    subsections: [
      {
        id: "adding-resources",
        title: "Adding Resources",
        content: (
          <div className="space-y-4">
            <p className="text-sm text-muted-foreground leading-relaxed">
              Organization Admins, Platform Admins, and Super Admins can add
              resources to the Resource Library. Navigate to the Resources page
              and click &quot;Add Resource.&quot; You&apos;ll need to provide:
              title, description, category, type, region, publishing
              organization, and optionally a URL.
            </p>
            <p className="text-sm text-muted-foreground leading-relaxed">
              Resource categories are: Guides &amp; Toolkits, Research &amp;
              Reports, Policy Briefs, Training Materials, and Multimedia.
              Resource types are: Article, PDF, Video, Toolkit, and Template.
              Good descriptions (3-5 sentences) significantly improve
              discoverability and usage.
            </p>
            <div className="bg-secondary/40 rounded-lg p-4 border border-border">
              <h4 className="font-display font-semibold text-xs text-foreground mb-2">
                Resource Quality Checklist
              </h4>
              <ul className="space-y-1">
                {[
                  "Description explains the content and intended audience",
                  "Category and type are correctly assigned",
                  "Region reflects the primary geographic focus",
                  "URL leads to an accessible, stable resource",
                  "Organization is correctly attributed",
                ].map((item) => (
                  <li
                    key={item}
                    className="flex items-start gap-1.5 text-xs text-muted-foreground"
                  >
                    <Lock
                      size={10}
                      className="text-primary flex-shrink-0 mt-0.5"
                    />
                    {item}
                  </li>
                ))}
              </ul>
            </div>
          </div>
        ),
      },
      {
        id: "faq-management",
        title: "FAQ Management",
        content: (
          <div className="space-y-4">
            <p className="text-sm text-muted-foreground leading-relaxed">
              The FAQ section is managed by Platform Admins. When a member
              submits a question via the &quot;Didn&apos;t find your
              answer?&quot; form, it enters a review queue visible to Platform
              Admins. Admins can approve, edit, and publish questions with
              answers, or dismiss duplicates.
            </p>
            <p className="text-sm text-muted-foreground leading-relaxed">
              FAQ items are organized into six categories: Membership,
              Organizations, Campaigns, Platform &amp; Features, Privacy &amp;
              Data, and Technical Support. Each FAQ item supports formatted text
              in the answer field, allowing for bullet lists and structured
              responses.
            </p>
          </div>
        ),
      },
      {
        id: "documentation-structure",
        title: "Documentation",
        content: (
          <div className="space-y-4">
            <p className="text-sm text-muted-foreground leading-relaxed">
              The Documentation section (you are reading it now) is maintained
              by Platform Admins and Super Admins. It follows a section-based
              structure with collapsible subsections. The sidebar provides quick
              navigation between all sections and subsections.
            </p>
            <p className="text-sm text-muted-foreground leading-relaxed">
              Documentation updates are versioned — changes are logged with a
              date and author. On mobile, the sidebar collapses into a
              &quot;Contents&quot; drawer accessible from the navigation bar at
              the top of the docs page.
            </p>
          </div>
        ),
      },
    ],
  },
  {
    id: "activism-tools",
    title: "Activism Tools",
    icon: <Zap size={15} />,
    badge: "New",
    subsections: [
      {
        id: "petitions",
        title: "Petitions",
        content: (
          <div className="space-y-4">
            <p className="text-sm text-muted-foreground leading-relaxed">
              Petitions are standalone or campaign-linked signature collection
              tools. They can target governments, corporations, international
              bodies, or other decision-makers. Each petition has a title, the
              target recipient, a body statement, a signature goal, and an
              optional deadline.
            </p>
            <p className="text-sm text-muted-foreground leading-relaxed">
              Members sign petitions with a single click from the campaign page,
              the activism hub, or the petition&apos;s direct URL. Signatures
              are attributed to the member&apos;s platform identity.
              Organization Admins can export signature data for formal
              submissions — by default, the export includes names and
              organizational affiliations but not email addresses.
            </p>
          </div>
        ),
      },
      {
        id: "events",
        title: "Events",
        content: (
          <div className="space-y-4">
            <p className="text-sm text-muted-foreground leading-relaxed">
              Events can be created by Activists, Org Admins, Admins, and Super
              Admins. Events include a title, description, date and time,
              location (physical address or virtual link), organizer, and
              optional campaign association. Events display on the Activism Hub
              with RSVP tracking.
            </p>
            <div className="bg-secondary/40 rounded-lg p-4 border border-border">
              <h4 className="font-display font-semibold text-xs text-foreground mb-2">
                Event Types Supported
              </h4>
              <div className="flex flex-wrap gap-2">
                {[
                  "Rally",
                  "Town Hall",
                  "Workshop",
                  "Webinar",
                  "Fundraiser",
                  "Solidarity Action",
                  "Training",
                  "Community Meeting",
                ].map((type) => (
                  <Badge
                    key={type}
                    variant="outline"
                    className="text-[10px] h-5 px-2"
                  >
                    {type}
                  </Badge>
                ))}
              </div>
            </div>
          </div>
        ),
      },
      {
        id: "calls-to-action",
        title: "Calls to Action",
        content: (
          <div className="space-y-4">
            <p className="text-sm text-muted-foreground leading-relaxed">
              Calls to Action (CTAs) are specific, actionable requests that
              mobilize members toward a concrete step. Unlike petitions (which
              collect signatures), CTAs ask members to take an external action —
              calling an official, writing a letter, attending a meeting, or
              sharing content on social media.
            </p>
            <p className="text-sm text-muted-foreground leading-relaxed">
              Each CTA can include a title, detailed instructions, target
              audience, urgency level (Low / Medium / High / Critical), a
              deadline, and optional script or talking points. CTAs track
              completion count — members mark them complete to register their
              participation.
            </p>
          </div>
        ),
      },
    ],
  },
  {
    id: "admin-guide",
    title: "Admin Guide",
    icon: <Settings size={15} />,
    subsections: [
      {
        id: "user-management",
        title: "User Management",
        content: (
          <div className="space-y-4">
            <p className="text-sm text-muted-foreground leading-relaxed">
              Platform Admins and Super Admins access the Admin Panel via the
              sidebar Admin section or the user dropdown. The Users tab shows
              all registered members with their roles, organizations, join
              dates, and activity status. Admins can search, filter, and export
              user data.
            </p>
            <div className="space-y-2">
              {[
                {
                  title: "Change User Role",
                  desc: "Upgrade or downgrade a user's global role. Org-level roles are managed from the org's member list.",
                },
                {
                  title: "Suspend Account",
                  desc: "Temporarily prevent a user from logging in. Useful while reviewing conduct complaints.",
                },
                {
                  title: "Reset Password",
                  desc: "Trigger a password reset email on behalf of a user who has lost account access.",
                },
                {
                  title: "Delete Account",
                  desc: "Permanently remove a user. Anonymizes their historical contributions before deletion.",
                },
              ].map((item) => (
                <div
                  key={item.title}
                  className="flex items-start gap-3 p-3 rounded-lg bg-secondary/30 border border-border"
                >
                  <div>
                    <p className="text-xs font-semibold text-foreground mb-0.5">
                      {item.title}
                    </p>
                    <p className="text-xs text-muted-foreground leading-relaxed">
                      {item.desc}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        ),
      },
      {
        id: "platform-settings",
        title: "Platform Settings",
        content: (
          <div className="space-y-4">
            <p className="text-sm text-muted-foreground leading-relaxed">
              Super Admins can access platform-wide settings from the Admin
              Panel, Settings tab. This includes platform name and branding,
              registration settings (open vs. invite-only), default language,
              feature flags for enabling/disabling modules, and notification
              configuration.
            </p>
            <div className="bg-amber-50 border border-amber-200 rounded-lg p-4">
              <h4 className="font-display font-semibold text-xs text-amber-800 mb-2 flex items-center gap-1.5">
                <Shield size={12} className="text-amber-600" />
                Super Admin Only Settings
              </h4>
              <ul className="space-y-1">
                {[
                  "Feature flag management (enable/disable platform modules)",
                  "Registration mode (open, invite-only, closed)",
                  "Platform branding and theme configuration",
                  "Data export and backup controls",
                  "Security and audit log access",
                ].map((item) => (
                  <li
                    key={item}
                    className="flex items-start gap-1.5 text-xs text-amber-700"
                  >
                    <ChevronRight size={10} className="flex-shrink-0 mt-0.5" />
                    {item}
                  </li>
                ))}
              </ul>
            </div>
          </div>
        ),
      },
      {
        id: "reports-analytics",
        title: "Reports & Analytics",
        content: (
          <div className="space-y-4">
            <p className="text-sm text-muted-foreground leading-relaxed">
              The Reports section gives Platform Admins a high-level view of
              platform health and engagement. Reports cover: member growth over
              time, organization activity rankings, campaign performance
              summaries, forum engagement metrics, and resource access
              statistics.
            </p>
            <p className="text-sm text-muted-foreground leading-relaxed">
              Reports can be filtered by date range, region, organization, and
              module. All reports are exportable as CSV for external analysis.
              Scheduled reports can be set up to email summaries to designated
              admin addresses on a weekly or monthly basis.
            </p>
          </div>
        ),
      },
    ],
  },
  {
    id: "api-integrations",
    title: "API & Integrations",
    icon: <Code2 size={15} />,
    badge: "Advanced",
    subsections: [
      {
        id: "api-overview",
        title: "Overview",
        content: (
          <div className="space-y-4">
            <p className="text-sm text-muted-foreground leading-relaxed">
              IIIntl One is built on the Internet Computer Protocol (ICP) using
              Motoko canisters as the backend. The platform exposes both query
              calls (read-only, fast) and update calls (state-changing) via the
              ICP actor interface. Programmatic access is available through the
              ICP SDK and the platform&apos;s canister interface.
            </p>
            <div className="bg-secondary/40 rounded-lg p-4 border border-border font-mono text-xs space-y-2">
              <p className="text-muted-foreground">
                {"// Platform Canister IDs"}
              </p>
              <p>
                <span className="text-primary">backend_canister</span>
                <span className="text-muted-foreground">
                  : "rrkah-fqaaa-aaaaa-aaaaq-cai"
                </span>
              </p>
              <p>
                <span className="text-primary">frontend_canister</span>
                <span className="text-muted-foreground">
                  : "ryjl3-tyaaa-aaaaa-aaaba-cai"
                </span>
              </p>
            </div>
          </div>
        ),
      },
      {
        id: "api-auth",
        title: "Authentication",
        content: (
          <div className="space-y-4">
            <p className="text-sm text-muted-foreground leading-relaxed">
              IIIntl One uses Internet Identity for authentication — ICP&apos;s
              native, decentralized identity system. Internet Identity provides
              anonymous, secure credentials per device without passwords or
              email. For programmatic access, authentication is handled through
              the ICP agent with a delegated identity.
            </p>
            <div className="bg-secondary/40 rounded-lg p-4 border border-border font-mono text-xs space-y-2">
              <p className="text-muted-foreground">
                {"// Client-side authentication pattern"}
              </p>
              <p>
                <span className="text-blue-600">import</span>
                <span className="text-muted-foreground">
                  {" "}
                  {"{ AuthClient }"}{" "}
                </span>
                <span className="text-blue-600">from</span>
                <span className="text-muted-foreground">
                  {" "}
                  "@dfinity/auth-client";
                </span>
              </p>
              <p>
                <span className="text-muted-foreground">const client = </span>
                <span className="text-blue-600">await</span>
                <span className="text-muted-foreground">
                  {" "}
                  AuthClient.create();
                </span>
              </p>
              <p>
                <span className="text-blue-600">await</span>
                <span className="text-muted-foreground">
                  {" "}
                  client.login({"{ identityProvider }"});
                </span>
              </p>
            </div>
          </div>
        ),
      },
      {
        id: "api-http-outcalls",
        title: "HTTP Outcalls",
        content: (
          <div className="space-y-4">
            <p className="text-sm text-muted-foreground leading-relaxed">
              The Motoko backend cannot make outbound HTTP requests directly
              (ICP canisters are sandboxed). External data integrations must be
              handled client-side in TypeScript/React. The frontend can freely
              call any external API and pass results to the canister via update
              calls.
            </p>
            <div className="bg-rose-50 border border-rose-200 rounded-lg p-4">
              <h4 className="font-display font-semibold text-xs text-rose-800 mb-2">
                Important Architecture Note
              </h4>
              <p className="text-xs text-rose-700 leading-relaxed">
                Never attempt to fetch external URLs from Motoko canister code.
                Always fetch client-side and pass data to the canister. This
                applies to webhook delivery, external API consumption, and any
                network I/O beyond inter-canister calls.
              </p>
            </div>
            <p className="text-sm text-muted-foreground leading-relaxed">
              ICP does support HTTPS Outcalls from canisters for specific use
              cases with consensus requirements. Contact the IIIntl platform
              team if your integration requires server-side HTTP — this can be
              enabled for specific canisters with appropriate governance
              approval.
            </p>
          </div>
        ),
      },
    ],
  },
  {
    id: "platform-as-a-service",
    title: "Platform as a Service",
    icon: <Building2 size={15} />,
    badge: "PaaS",
    subsections: [
      {
        id: "paas-architecture",
        title: "Architecture Overview",
        content: (
          <div className="space-y-4">
            <p className="text-sm text-muted-foreground leading-relaxed">
              IIIntl One Platform supports multi-tenancy, where each renting
              organization receives an isolated namespace scoped by a unique
              tenant ID. All data — members, campaigns, forums, store orders,
              resources — is tagged with that tenant ID and is never visible to
              other tenants.
            </p>
            <div className="bg-secondary/40 rounded-lg p-4 border border-border">
              <h4 className="font-display font-semibold text-sm text-foreground mb-2">
                Deployment Tiers
              </h4>
              <ul className="space-y-2">
                <li className="text-xs text-muted-foreground">
                  <strong className="text-foreground">Shared Instance</strong> —
                  Starter and Organization plans share a single canister; data
                  is strictly isolated by tenant ID. Lower cost, fastest setup.
                </li>
                <li className="text-xs text-muted-foreground">
                  <strong className="text-foreground">Dedicated Clone</strong> —
                  Enterprise plans receive their own canister on the Internet
                  Computer. Maximum data sovereignty and isolation, ideal for
                  large or regulated organizations.
                </li>
              </ul>
            </div>
            <div className="bg-secondary/40 rounded-lg p-4 border border-border">
              <h4 className="font-display font-semibold text-sm text-foreground mb-2">
                Tenant Status Lifecycle
              </h4>
              <ul className="space-y-1.5">
                <li className="text-xs text-muted-foreground">
                  <strong className="text-foreground">Trial</strong> — 14-day
                  free access, full features. Converts to Active on first
                  payment.
                </li>
                <li className="text-xs text-muted-foreground">
                  <strong className="text-foreground">Active</strong> —
                  Subscription current. Full platform access.
                </li>
                <li className="text-xs text-muted-foreground">
                  <strong className="text-foreground">Suspended</strong> —
                  Payment overdue or admin action. Read-only access until
                  reactivated.
                </li>
                <li className="text-xs text-muted-foreground">
                  <strong className="text-foreground">Cancelled</strong> —
                  Access ends at billing period close.
                </li>
              </ul>
            </div>
          </div>
        ),
      },
      {
        id: "tenant-onboarding",
        title: "Tenant Onboarding Guide",
        content: (
          <div className="space-y-4">
            <p className="text-sm text-muted-foreground leading-relaxed">
              Follow these steps to bring your organization onto the IIIntl PaaS
              platform:
            </p>
            <ol className="space-y-3 list-none">
              <li className="text-xs text-muted-foreground">
                <strong className="text-foreground">1. Choose a plan</strong> —
                Visit /pricing and compare Starter, Organization, and Enterprise
                tiers. Click &quot;Get Started&quot; on your chosen plan.
              </li>
              <li className="text-xs text-muted-foreground">
                <strong className="text-foreground">2. Sign in</strong> — Log in
                with Internet Identity (ICP). This becomes your tenant owner
                identity.
              </li>
              <li className="text-xs text-muted-foreground">
                <strong className="text-foreground">
                  3. Create your tenant
                </strong>{" "}
                — Complete the tenant creation form at /tenant: enter your
                organization name, contact email, tier, and preferred payment
                method (Stripe card or ICP token).
              </li>
              <li className="text-xs text-muted-foreground">
                <strong className="text-foreground">
                  4. Access the Admin Portal
                </strong>{" "}
                — Your 6-tab Tenant Admin Portal is immediately available at
                /tenant: Overview, Usage, Members, Branding, Billing, and
                Settings.
              </li>
              <li className="text-xs text-muted-foreground">
                <strong className="text-foreground">
                  5. Configure branding
                </strong>{" "}
                — Open the Branding tab to set your brand name, logo URL, accent
                color, and a custom welcome message for your members.
              </li>
              <li className="text-xs text-muted-foreground">
                <strong className="text-foreground">6. Invite your team</strong>{" "}
                — Open the Members tab and add team members by their Internet
                Identity principal. Assign roles: owner, admin, member, or
                viewer.
              </li>
            </ol>
          </div>
        ),
      },
      {
        id: "pricing-billing",
        title: "Pricing & Billing Policy",
        content: (
          <div className="space-y-4">
            <div className="bg-secondary/40 rounded-lg p-4 border border-border">
              <h4 className="font-display font-semibold text-sm text-foreground mb-3">
                Subscription Tiers
              </h4>
              <ul className="space-y-2">
                <li className="text-xs text-muted-foreground">
                  <strong className="text-foreground">Starter — $49/mo</strong>:
                  Up to 50 members, 1 GB storage. All core modules included.
                </li>
                <li className="text-xs text-muted-foreground">
                  <strong className="text-foreground">
                    Organization — $299/mo
                  </strong>
                  : Up to 500 members, 10 GB storage. Priority support, custom
                  branding.
                </li>
                <li className="text-xs text-muted-foreground">
                  <strong className="text-foreground">
                    Enterprise — $999/mo
                  </strong>
                  : Up to 10,000 members, 100 GB storage. Dedicated canister,
                  SLA, white-label.
                </li>
              </ul>
            </div>
            <p className="text-sm text-muted-foreground leading-relaxed">
              All tiers include a{" "}
              <strong className="text-foreground">14-day free trial</strong>{" "}
              with full feature access — no payment required to start. Annual
              billing is available at a discounted rate (equivalent to 2 months
              free).
            </p>
            <p className="text-sm text-muted-foreground leading-relaxed">
              <strong className="text-foreground">Payment methods:</strong>{" "}
              Credit and debit cards via Stripe, or ICP tokens for crypto-native
              organizations. Enterprise clients may arrange invoice-based
              billing.
            </p>
            <p className="text-sm text-muted-foreground leading-relaxed">
              <strong className="text-foreground">Cancellation:</strong> You may
              cancel at any time from the Settings tab. Access continues until
              the end of the current billing period. No refunds are issued for
              partial periods.
            </p>
          </div>
        ),
      },
      {
        id: "tenant-admin-manual",
        title: "Tenant Admin Manual",
        content: (
          <div className="space-y-4">
            <p className="text-sm text-muted-foreground leading-relaxed">
              The Tenant Admin Portal at{" "}
              <strong className="text-foreground">/tenant</strong> has six tabs:
            </p>
            <ul className="space-y-3">
              <li className="text-xs text-muted-foreground">
                <strong className="text-foreground">Overview</strong> — Plan
                summary card showing your current tier, subscription status,
                monthly fee, and next billing date. Contains the &quot;Pay with
                Card&quot; button for Stripe payments.
              </li>
              <li className="text-xs text-muted-foreground">
                <strong className="text-foreground">Usage</strong> — Live
                progress bars for members used vs. tier limit and storage
                consumed vs. allocation. Amber warning at 80% capacity. Red
                warning at 100%. Trial countdown banner shows days remaining.
              </li>
              <li className="text-xs text-muted-foreground">
                <strong className="text-foreground">Members</strong> — Add
                members by pasting their Internet Identity principal. Assign a
                role (owner, admin, member, or viewer). Remove members at any
                time. The owner role cannot be removed.
              </li>
              <li className="text-xs text-muted-foreground">
                <strong className="text-foreground">Branding</strong> — Set your
                organization&apos;s brand name, logo URL (with live preview),
                accent color, and welcome message. Saved to the Internet
                Computer and applied across your tenant space.
              </li>
              <li className="text-xs text-muted-foreground">
                <strong className="text-foreground">Billing</strong> — Full
                payment history table: date, description, amount, currency,
                status (paid/pending/failed), and payment method. Refreshable on
                demand.
              </li>
              <li className="text-xs text-muted-foreground">
                <strong className="text-foreground">Settings</strong> — Edit
                organization name, contact email, and custom domain. Upgrade to
                a higher tier. Cancel your subscription.
              </li>
            </ul>
          </div>
        ),
      },
      {
        id: "super-admin-management",
        title: "Super-Admin Management",
        content: (
          <div className="space-y-4">
            <p className="text-sm text-muted-foreground leading-relaxed">
              Platform owners with the{" "}
              <strong className="text-foreground">super_admin</strong> role
              access the Admin Dashboard at{" "}
              <strong className="text-foreground">/admin</strong>. The following
              tabs are relevant to PaaS management:
            </p>
            <ul className="space-y-3">
              <li className="text-xs text-muted-foreground">
                <strong className="text-foreground">Tenants tab</strong> — View
                all registered tenants with tier and status badges. Suspend
                active tenants or reactivate suspended ones. Each row shows org
                name, owner principal, creation date, and current status.
              </li>
              <li className="text-xs text-muted-foreground">
                <strong className="text-foreground">Analytics tab</strong> —
                Platform-wide revenue and growth metrics: total tenants, monthly
                recurring revenue (MRR), active vs. trial breakdown, tier
                distribution (Starter / Organization / Enterprise counts), total
                members across all tenants, and branding adoption rate.
              </li>
              <li className="text-xs text-muted-foreground">
                <strong className="text-foreground">Stripe tab</strong> — Enter
                your Stripe secret key and allowed countries to enable
                credit/debit card payments for tenants. Status badge confirms
                whether Stripe is active.
              </li>
              <li className="text-xs text-muted-foreground">
                <strong className="text-foreground">Content tab</strong> —
                Publish or unpublish Resources, FAQ items, and Docs pages
                platform-wide. Controls visibility for all tenants on the shared
                instance.
              </li>
            </ul>
            <p className="text-sm text-muted-foreground leading-relaxed">
              Super-admin actions are permanent and immediate. Suspending a
              tenant blocks all write operations for their members. Always
              communicate with the tenant owner before taking administrative
              action.
            </p>
          </div>
        ),
      },
      {
        id: "dedicated-clone-roadmap",
        title: "Dedicated Clone Roadmap",
        content: (
          <div className="space-y-4">
            <p className="text-sm text-muted-foreground leading-relaxed">
              <strong className="text-foreground">Dedicated Clone</strong> is
              the next major infrastructure milestone for IIIntl One Platform.
              It upgrades Enterprise tenants from the current shared-instance
              model to a fully isolated deployment — each organization runs on
              their own canister with independent storage, compute, and upgrade
              control.
            </p>
            <div className="rounded-md border border-amber-500/30 bg-amber-500/5 p-3">
              <p className="text-xs font-semibold text-amber-600 dark:text-amber-400 mb-1">
                Roadmap Status — Planned (Phase E)
              </p>
              <p className="text-xs text-muted-foreground">
                Not yet implemented. The shared-instance model (Phases A–D) is
                fully live and production-ready. Dedicated Clone is the planned
                Phase E expansion, to be built when Enterprise demand justifies
                it.
              </p>
            </div>
            <p className="text-sm font-semibold text-foreground">
              What Dedicated Clone Delivers
            </p>
            <ul className="space-y-3">
              <li className="text-xs text-muted-foreground">
                <strong className="text-foreground">
                  Full data sovereignty
                </strong>{" "}
                — No other tenant's data ever touches the organization's
                canister. Ideal for compliance-sensitive or regulated
                environments.
              </li>
              <li className="text-xs text-muted-foreground">
                <strong className="text-foreground">
                  Independent upgrade control
                </strong>{" "}
                — The platform owner can push updates to each clone on its own
                schedule. Enterprise clients can negotiate upgrade windows.
              </li>
              <li className="text-xs text-muted-foreground">
                <strong className="text-foreground">
                  Custom domain / subdomain
                </strong>{" "}
                — Each clone operates at its own URL (e.g.{" "}
                <code className="bg-muted px-1 rounded">
                  orgname.iiintl.one
                </code>{" "}
                or the client's own domain), reinforcing white-label branding.
              </li>
              <li className="text-xs text-muted-foreground">
                <strong className="text-foreground">
                  Dedicated compute and storage
                </strong>{" "}
                — No resource contention with other tenants. Storage and
                throughput limits are governed solely by the organization's
                canister.
              </li>
            </ul>
            <p className="text-sm font-semibold text-foreground">
              Phase E Build Plan
            </p>
            <ul className="space-y-2">
              {[
                {
                  phase: "E1",
                  label: "Canister Factory",
                  desc: "New Motoko factory canister using the IC management API to programmatically spin up and fund new tenant canisters on demand.",
                },
                {
                  phase: "E2",
                  label: "Wasm Build Pipeline",
                  desc: "Reproducible build process that compiles the platform backend to a Wasm binary, embeds it in the factory, and supports versioned updates.",
                },
                {
                  phase: "E3",
                  label: "Tenant Registry",
                  desc: "Maps Tenant ID → Canister ID → frontend URL; tracks canister health and platform code version per clone.",
                },
                {
                  phase: "E4",
                  label: "Frontend Routing Layer",
                  desc: "Subdomain routing (wildcard DNS) or path-based routing so each clone resolves to its own URL.",
                },
                {
                  phase: "E5",
                  label: "Super-Admin Provisioning UI",
                  desc: "One-click 'Create Dedicated Clone' action in the Admin Dashboard for qualifying Enterprise tenants.",
                },
                {
                  phase: "E6",
                  label: "Cycles Monitoring Dashboard",
                  desc: "Alerts and top-up tooling so no tenant canister is ever frozen due to cycle depletion.",
                },
              ].map(({ phase, label, desc }) => (
                <li
                  key={phase}
                  className="flex gap-3 text-xs text-muted-foreground"
                >
                  <span className="shrink-0 font-mono font-semibold text-foreground bg-muted rounded px-1.5 py-0.5">
                    {phase}
                  </span>
                  <span>
                    <strong className="text-foreground">{label}</strong> —{" "}
                    {desc}
                  </span>
                </li>
              ))}
            </ul>
            <p className="text-sm font-semibold text-foreground">
              Platform Owner Obligations
            </p>
            <ul className="space-y-2">
              {[
                [
                  "Cycle funding",
                  "Pre-fund each new canister at creation; automate or monitor ongoing top-ups to prevent freezing.",
                ],
                [
                  "Wasm versioning",
                  "Maintain a versioned build pipeline; coordinate update rollouts with Enterprise clients.",
                ],
                [
                  "Uptime monitoring",
                  "Track cycle levels across all clone canisters; set alerts at threshold levels.",
                ],
                [
                  "SLA documentation",
                  "Define and publish uptime commitments, cycle-depletion recovery procedures, and support response times.",
                ],
                [
                  "Onboarding process",
                  "Client signs contract → pays → canister provisioned → client receives URL and admin credentials within agreed SLA window.",
                ],
                [
                  "Support boundary",
                  "Platform owner is responsible for infrastructure (canister health, cycles). Tenant owner is responsible for content, members, and data.",
                ],
              ].map(([title, desc]) => (
                <li key={title} className="text-xs text-muted-foreground">
                  <strong className="text-foreground">{title}</strong> — {desc}
                </li>
              ))}
            </ul>
            <p className="text-sm font-semibold text-foreground">
              Pricing Recommendation
            </p>
            <p className="text-xs text-muted-foreground leading-relaxed">
              Dedicated Clone is best positioned as a custom-quoted add-on above
              the standard Enterprise tier ($999/month), priced to cover cycle
              costs (~$10–$20/month per canister), provisioning labour, and a
              margin for ongoing monitoring. A one-time setup fee ($500–$2,000)
              is also recommended to cover onboarding and DNS configuration.
            </p>
            <p className="text-sm font-semibold text-foreground">
              When to Build It
            </p>
            <p className="text-xs text-muted-foreground leading-relaxed">
              The current shared-instance model (Phases A–D) is sufficient for
              most organizations including large ones. Proceed to Phase E when
              at least one Enterprise client requires data residency, compliance
              isolation, or independent upgrade control — or when three or more
              Enterprise clients express interest. Until then, Dedicated Clone
              can be offered as a roadmap commitment at contract signing.
            </p>
          </div>
        ),
      },
    ],
  },
  {
    id: "mlm-rewards",
    title: "MLM & Rewards System",
    icon: <TrendingUp size={15} />,
    badge: "MLM",
    subsections: [
      {
        id: "mlm-overview",
        title: "System Overview",
        content: (
          <div className="space-y-4">
            <p className="text-sm text-muted-foreground leading-relaxed">
              The{" "}
              <strong className="text-foreground">
                IIIntl MLM & Rewards System
              </strong>{" "}
              is a multi-level membership, referral, royalty, and{" "}
              <strong className="text-foreground">FinFracFran™</strong> fractal
              franchise economics engine built directly into the platform. It
              enables members — individuals and organizations — to earn
              commissions, royalty pool distributions, and Franchise Share Units
              (FSUs) through participation, recruitment, and purchasing activity
              across the network.
            </p>
            <div className="rounded-md border border-emerald-500/30 bg-emerald-500/5 p-3">
              <p className="text-xs font-semibold text-emerald-600 dark:text-emerald-400 mb-1">
                Live &amp; Active
              </p>
              <p className="text-xs text-muted-foreground">
                The full MLM system — backend, frontend, admin panel, referral
                links, leaderboard, and bonus challenges — is implemented and
                live. Access it via the <strong>/mlm</strong> route (Rewards
                &amp; MLM Hub) in the sidebar under Commerce.
              </p>
            </div>
            <p className="text-sm font-semibold text-foreground">
              Key Components
            </p>
            <ul className="space-y-2">
              {[
                [
                  "Membership Tiers",
                  "7 levels (Free → Founder) with increasing earning depth and royalty access.",
                ],
                [
                  "Commission Rate Table",
                  "Admin-configurable matrix: tier × depth level × earning type → percentage + flat amount.",
                ],
                [
                  "Referral Chain",
                  "Unique referral codes per member; upline/downline genealogy stored on-chain.",
                ],
                [
                  "Royalty Pools",
                  "Global, Leadership, Event, and FinFracFran™ pools distributed each pay cycle.",
                ],
                [
                  "FinFracFran™ FSU Engine",
                  "Fractal Franchise Share Units accumulate with every platform transaction and are distributed proportionally by tier weight.",
                ],
                [
                  "Event Ticketing",
                  "Members earn commissions on ticket sales they refer; admins create events with tiered ticket types.",
                ],
                [
                  "Bonus Challenges",
                  "Time-limited recruitment and activity challenges with extra reward payouts.",
                ],
              ].map(([title, desc]) => (
                <li
                  key={title as string}
                  className="text-xs text-muted-foreground"
                >
                  <strong className="text-foreground">{title}</strong> — {desc}
                </li>
              ))}
            </ul>
          </div>
        ),
      },
      {
        id: "mlm-user-access",
        title: "User Access & Getting Started",
        content: (
          <div className="space-y-4">
            <p className="text-sm text-muted-foreground leading-relaxed">
              Any registered member can access the Rewards &amp; MLM Hub. Here
              is how to get started as a user.
            </p>
            <p className="text-sm font-semibold text-foreground">
              Step 1 — Join the MLM System
            </p>
            <ol className="space-y-2 list-decimal list-inside">
              {[
                "Log in with your Internet Identity or registered account.",
                "Navigate to Rewards & MLM in the sidebar (Commerce section) or go directly to /mlm.",
                "If you have a referral code from your sponsor, it will already be applied if you registered via a /join?ref=CODE link. Otherwise you can enter a sponsor's code manually.",
                "Click Join the MLM System to initialize your membership record. This registers you at the Free tier and generates your personal referral code.",
              ].map((step) => (
                <li key={step} className="text-xs text-muted-foreground">
                  {step}
                </li>
              ))}
            </ol>
            <p className="text-sm font-semibold text-foreground">
              Step 2 — Navigate the Rewards Hub
            </p>
            <p className="text-xs text-muted-foreground leading-relaxed">
              The Rewards Hub at <strong>/mlm</strong> has 7 tabs:
            </p>
            <div className="space-y-2">
              {[
                [
                  "Overview",
                  "Your current tier badge, referral code with copy button, 4 stat cards (Total Earned, Pending, Paid Out, FSU Balance), and an earnings breakdown by type.",
                ],
                [
                  "Earnings History",
                  "Full table of every commission, bonus, and royalty distribution — date, description, type badge, level depth, dollar amount, and payout status.",
                ],
                [
                  "My Network",
                  "Your personal referral URL, direct downline member cards showing each member's tier and referral count, and your upline chain with level indicators.",
                ],
                [
                  "FinFracFran™",
                  "Live FSU pool status (pool size, value per unit, next distribution), your personal FSU balance, redemption form, and full FSU transaction history.",
                ],
                [
                  "Royalty Pools",
                  "Active and past royalty pool listings (Global, Leadership, Event, FinFracFran™) with your personal distribution history per pool.",
                ],
                [
                  "Leaderboard",
                  "Top 10 recruiters for the current period with trophy medals, tier badges, and referral counts. Refreshes each pay cycle.",
                ],
                [
                  "Challenges",
                  "Active bonus challenge cards with progress bars, deadlines, and reward amounts. Complete challenges to earn extra flat bonuses.",
                ],
              ].map(([tab, desc]) => (
                <li
                  key={tab as string}
                  className="flex gap-3 text-xs text-muted-foreground list-none"
                >
                  <span className="shrink-0 font-semibold text-foreground w-32">
                    {tab}
                  </span>
                  <span>{desc}</span>
                </li>
              ))}
            </div>
            <p className="text-sm font-semibold text-foreground">
              Step 3 — Share Your Referral Link
            </p>
            <p className="text-xs text-muted-foreground leading-relaxed">
              Go to <strong>My Network</strong> tab and copy your unique
              referral URL (format:{" "}
              <code className="bg-muted px-1 rounded">/join?ref=YOURCODE</code>
              ). Share it via social media, email, or direct message. When
              someone registers using your link, they are permanently linked to
              you as your Level 1 downline, and you begin earning commissions on
              their dues payments and purchases immediately — up to 6 levels
              deep depending on your tier.
            </p>
            <p className="text-sm font-semibold text-foreground">
              Step 4 — Upgrade Your Tier
            </p>
            <p className="text-xs text-muted-foreground leading-relaxed">
              Your tier controls how many levels deep you earn commissions. On
              the Overview tab, click <strong>Upgrade Tier</strong> to request a
              tier upgrade. Tier upgrades above Free require admin approval or
              automatic qualification based on the criteria set in the rate
              table (dues paid, recruitment count, downline volume). Once
              upgraded, new earnings depth takes effect immediately on the next
              qualifying transaction.
            </p>
          </div>
        ),
      },
      {
        id: "mlm-earning-types",
        title: "Earning Types & Commissions",
        content: (
          <div className="space-y-4">
            <p className="text-sm text-muted-foreground leading-relaxed">
              The system supports 6 distinct earning types, each generated by
              different on-platform activities.
            </p>
            <div className="space-y-3">
              {[
                {
                  type: "Direct Referral Bonus",
                  badge: "Level 1",
                  desc: "Triggered when someone you directly referred makes a qualifying payment (membership dues, store purchase, ticket). You earn a percentage of their payment amount or a flat bonus — whichever the admin has configured in the rate table.",
                },
                {
                  type: "Level Override Commission",
                  badge: "Levels 2–6",
                  desc: "Passive income from the activity of your downline's downline. Each level deeper earns a smaller percentage (e.g. 10% → 6% → 4% → 2% → 1% → 0.5%). You must be at the appropriate tier to unlock each level.",
                },
                {
                  type: "Royalty Pool Distribution",
                  badge: "Pools",
                  desc: "Periodic distributions from the Global Pool (% of all platform revenue), Leadership Pool (Executive+ members), and Event Pool (ticket sale revenue). Distributed each pay cycle by the admin.",
                },
                {
                  type: "Event Commission",
                  badge: "Tickets",
                  desc: "When someone you referred purchases a ticket to a platform event, you earn the commission rate set on that ticket tier (e.g. 5% of the ticket price). Issued instantly on purchase.",
                },
                {
                  type: "FinFracFran™ FSU",
                  badge: "Fractal",
                  desc: "Franchise Share Units accumulate from a micro-contribution on every platform transaction. Distributed proportionally by tier weight each pay cycle. Redeem FSUs for ICP/cash equivalent in your wallet, convert to membership credit, or hold for accumulation.",
                },
                {
                  type: "Activity Bonus",
                  badge: "Challenges",
                  desc: "Flat bonuses for completing time-limited challenges (e.g. recruit 3 members in 7 days = $50 bonus) or hitting activity milestones (forum posts, campaign joins, events attended).",
                },
              ].map(({ type, badge, desc }) => (
                <div
                  key={type}
                  className="rounded-md border border-border p-3 space-y-1"
                >
                  <div className="flex items-center gap-2">
                    <span className="text-xs font-semibold text-foreground">
                      {type}
                    </span>
                    <span className="text-xs bg-muted text-muted-foreground rounded px-1.5 py-0.5">
                      {badge}
                    </span>
                  </div>
                  <p className="text-xs text-muted-foreground">{desc}</p>
                </div>
              ))}
            </div>
            <p className="text-sm font-semibold text-foreground">Payout Flow</p>
            <ol className="space-y-1 list-decimal list-inside">
              {[
                "Qualifying event occurs (dues payment, purchase, ticket sale, referral).",
                "System creates an EarningRecord with status Pending.",
                "Admin runs a Pay Cycle (or it is triggered automatically for eligible members).",
                "EarningRecord status moves to Processing, then Paid.",
                "Paid amount appears in your Earnings History and can be withdrawn to your ICP wallet or requested as a fiat payout.",
              ].map((step) => (
                <li key={step} className="text-xs text-muted-foreground">
                  {step}
                </li>
              ))}
            </ol>
          </div>
        ),
      },
      {
        id: "mlm-finfracfran",
        title: "FinFracFran™ System",
        content: (
          <div className="space-y-4">
            <p className="text-sm text-muted-foreground leading-relaxed">
              <strong className="text-foreground">FinFracFran™</strong> —
              Financial Fractal Franchise — is a proprietary economic model
              where every transaction on the platform contributes a micro-share
              to a communal pool, then distributes that pool fractally across
              the entire active membership network. Everyone participates in the
              economic output of the whole.
            </p>
            <p className="text-sm font-semibold text-foreground">
              How FSUs Work
            </p>
            <ul className="space-y-2">
              {[
                [
                  "Accumulation",
                  "A small percentage of every dues payment, store purchase, and ticket sale flows into the FinFracFran™ pool.",
                ],
                [
                  "Distribution",
                  "Each pay cycle, the admin distributes the pool across all active members. Each member's share = their tier weight × network depth contribution. Higher tiers and larger networks receive proportionally more.",
                ],
                [
                  "FSU Value",
                  "The value of one FSU is recalculated each distribution cycle as pool total ÷ total outstanding FSUs.",
                ],
                [
                  "Redemption",
                  "On the FinFracFran™ tab of the Rewards Hub, enter the number of FSUs to redeem. The equivalent USD-cent value is transferred to your earnings balance for withdrawal.",
                ],
                [
                  "Membership Credit",
                  "Instead of cash redemption, apply FSUs as a credit toward your next membership dues payment.",
                ],
                [
                  "Accumulation Strategy",
                  "Members who stay active and recruit larger networks accumulate FSUs faster. Long-term holders benefit as the pool grows with platform revenue.",
                ],
              ].map(([title, desc]) => (
                <li
                  key={title as string}
                  className="text-xs text-muted-foreground"
                >
                  <strong className="text-foreground">{title}</strong> — {desc}
                </li>
              ))}
            </ul>
            <div className="rounded-md border border-amber-500/30 bg-amber-500/5 p-3">
              <p className="text-xs font-semibold text-amber-600 dark:text-amber-400 mb-1">
                FinFracFran™ Dashboard
              </p>
              <p className="text-xs text-muted-foreground">
                Find your live FSU balance, the current pool size, FSU value per
                unit, next distribution date, and full transaction history on
                the <strong>FinFracFran™</strong> tab of the Rewards Hub at{" "}
                <code className="bg-muted px-1 rounded">/mlm</code>.
              </p>
            </div>
          </div>
        ),
      },
      {
        id: "mlm-events-tickets",
        title: "Events & Ticket Commissions",
        content: (
          <div className="space-y-4">
            <p className="text-sm text-muted-foreground leading-relaxed">
              The platform supports ticketed events with multiple ticket tiers.
              Members earn commissions when people they referred purchase
              tickets.
            </p>
            <p className="text-sm font-semibold text-foreground">
              Browsing & Buying Tickets (Users)
            </p>
            <ol className="space-y-1 list-decimal list-inside">
              {[
                "Navigate to Events in the sidebar (Commerce section) or go to /events.",
                "Filter by Upcoming, Live, or Past. Click any event card to view full details.",
                "On the event detail page, select a ticket tier (General, VIP, Early Bird, VIP+). Each tier shows its capacity, price, and the commission rate paid to the referring member.",
                "Click Purchase Ticket. If you have a referral code from the event promoter, enter it in the referral code field — this ensures your ticket purchase earns them their commission.",
                "After purchase, your ticket appears at /my-tickets with a QR code and unique verification code for check-in.",
              ].map((step) => (
                <li key={step} className="text-xs text-muted-foreground">
                  {step}
                </li>
              ))}
            </ol>
            <p className="text-sm font-semibold text-foreground">
              Promoting Events (Members)
            </p>
            <p className="text-xs text-muted-foreground leading-relaxed">
              Share your referral link with the event URL as context. When
              someone registers via your referral code and then purchases a
              ticket, your event commission is issued automatically as an
              EarningRecord of type
              <code className="bg-muted px-1 rounded mx-1">
                eventCommission
              </code>
              . The commission rate is set per ticket tier by the event
              organizer.
            </p>
            <p className="text-sm font-semibold text-foreground">
              Hosting an Event (Organizers)
            </p>
            <ol className="space-y-1 list-decimal list-inside">
              {[
                "On the Events page (/events), expand the Host an Event panel.",
                "Fill in the event name, description, date/time, location, and cover image URL.",
                "Submit the form — the event is created with Upcoming status.",
                "Add ticket tiers via the Ticket Tiers section on the event detail page: set type, price, capacity, and the commission basis points (100 = 1%) paid to referring members.",
                "Share the event URL and your referral link to start earning event commissions.",
              ].map((step) => (
                <li key={step} className="text-xs text-muted-foreground">
                  {step}
                </li>
              ))}
            </ol>
          </div>
        ),
      },
      {
        id: "mlm-admin-config",
        title: "Admin Configuration Guide",
        content: (
          <div className="space-y-4">
            <p className="text-sm text-muted-foreground leading-relaxed">
              Super-admins manage the entire MLM system from the{" "}
              <strong className="text-foreground">Admin Dashboard</strong> at{" "}
              <code className="bg-muted px-1 rounded">/admin</code> → MLM tab.
              The MLM tab has 4 sub-tabs: Rate Table, Member Tiers, Pay Cycles,
              and Reports &amp; Pools.
            </p>
            <p className="text-sm font-semibold text-foreground">
              Rate Table Sub-tab
            </p>
            <p className="text-xs text-muted-foreground leading-relaxed mb-2">
              The commission rate matrix controls exactly how much each member
              earns on each type of qualifying event, at each downline depth,
              for each membership tier.
            </p>
            <ul className="space-y-2">
              {[
                [
                  "Add a Rate",
                  "Click Add Rate. Select the member's Tier (Free → Founder), the downline Level (1–6), the Earning Type (directReferral, levelOverride, royaltyPool, eventCommission, finFracFran, activityBonus), enter the Basis Points (100 = 1%) and optional Flat Amount in cents. Save.",
                ],
                [
                  "Edit a Rate",
                  "Rates are immutable once saved (for audit integrity). Deactivate the old rate and add a corrected new one.",
                ],
                [
                  "Deactivate a Rate",
                  "Click the × button on any active rate row. Deactivated rates no longer apply to new transactions but are retained in the audit log.",
                ],
                [
                  "Viewing the Matrix",
                  "All active rates are displayed in the table sorted by tier, level, and type. Use this to verify the full incentive structure at a glance.",
                ],
              ].map(([action, desc]) => (
                <li
                  key={action as string}
                  className="text-xs text-muted-foreground"
                >
                  <strong className="text-foreground">{action}</strong> — {desc}
                </li>
              ))}
            </ul>
            <p className="text-sm font-semibold text-foreground">
              Member Tiers Sub-tab
            </p>
            <ul className="space-y-2">
              {[
                [
                  "View All Members",
                  "The full table shows every member's principal, current tier level, referral code, sponsor, join date, and last upgrade date.",
                ],
                [
                  "Set Tier Manually",
                  "Enter a member's principal ID and select the target tier. Use this to onboard founding members, correct errors, or grant promotional upgrades. All manual changes are logged.",
                ],
              ].map(([action, desc]) => (
                <li
                  key={action as string}
                  className="text-xs text-muted-foreground"
                >
                  <strong className="text-foreground">{action}</strong> — {desc}
                </li>
              ))}
            </ul>
            <p className="text-sm font-semibold text-foreground">
              Pay Cycles Sub-tab
            </p>
            <ul className="space-y-2">
              {[
                [
                  "Run Pay Cycle",
                  "Enter a member's principal and click Run Pay Cycle. This marks all Pending earnings for that member as Paid. Run this for each qualifying member each billing period, or use it to process a specific member on demand.",
                ],
                [
                  "View Earnings",
                  "Enter a principal and click Load Earnings to see the full EarningRecord table for that member — useful for auditing or resolving disputes.",
                ],
              ].map(([action, desc]) => (
                <li
                  key={action as string}
                  className="text-xs text-muted-foreground"
                >
                  <strong className="text-foreground">{action}</strong> — {desc}
                </li>
              ))}
            </ul>
            <p className="text-sm font-semibold text-foreground">
              Reports &amp; Pools Sub-tab
            </p>
            <ul className="space-y-2">
              {[
                [
                  "FSU Pool Status",
                  "Displays the current FinFracFran™ pool size, FSU value per unit, and total outstanding FSUs.",
                ],
                [
                  "Fund FSU Pool",
                  "Enter an amount in USD cents and a description, then click Fund to add to the FinFracFran™ pool.",
                ],
                [
                  "Distribute FSU",
                  "Enter the total number of FSU to distribute and a description. The system calculates each active member's weighted share and creates EarningRecords automatically.",
                ],
                [
                  "Royalty Pools Table",
                  "Lists all royalty pools (Global, Leadership, Event, FinFracFran™) with their period, total amount, and distribution status.",
                ],
                [
                  "Create Royalty Pool",
                  "Select the pool type, enter a period label, amount in cents, and currency. Click Create Pool.",
                ],
                [
                  "Fund Royalty Pool",
                  "Select an existing pool and add more funds before distribution.",
                ],
                [
                  "Distribute Royalty Pool",
                  "Select a pool, set the minimum member tier level required to qualify, and click Distribute. The system splits the pool equally among all qualifying members.",
                ],
              ].map(([action, desc]) => (
                <li
                  key={action as string}
                  className="text-xs text-muted-foreground"
                >
                  <strong className="text-foreground">{action}</strong> — {desc}
                </li>
              ))}
            </ul>
          </div>
        ),
      },
      {
        id: "mlm-admin-events",
        title: "Admin Event Management",
        content: (
          <div className="space-y-4">
            <p className="text-sm text-muted-foreground leading-relaxed">
              Admins have full control over events and ticket tiers from both
              the Events page and the Admin Dashboard.
            </p>
            <p className="text-sm font-semibold text-foreground">
              Managing Event Status
            </p>
            <p className="text-xs text-muted-foreground leading-relaxed">
              On the Events page (
              <code className="bg-muted px-1 rounded">/events</code>), admins
              can change any event's status via the Admin controls panel:
            </p>
            <div className="space-y-1">
              {[
                [
                  "Upcoming → Active",
                  "Opens ticket sales and marks the event as live.",
                ],
                [
                  "Active → Past",
                  "Closes ticket sales after the event concludes.",
                ],
                [
                  "Any → Cancelled",
                  "Cancels the event. Existing ticket holders should be notified and refunded manually.",
                ],
              ].map(([transition, desc]) => (
                <div
                  key={transition as string}
                  className="flex gap-3 text-xs text-muted-foreground"
                >
                  <code className="shrink-0 bg-muted rounded px-1.5 py-0.5 text-foreground">
                    {transition}
                  </code>
                  <span>{desc}</span>
                </div>
              ))}
            </div>
            <p className="text-sm font-semibold text-foreground">
              Ticket Check-in
            </p>
            <p className="text-xs text-muted-foreground leading-relaxed">
              At the event, use the admin panel to mark tickets as used. Enter
              the ticket's unique QR verification code and click Mark Used. The
              ticket stub at{" "}
              <code className="bg-muted px-1 rounded">/my-tickets</code> will
              display a USED stamp overlay for the attendee.
            </p>
            <p className="text-sm font-semibold text-foreground">
              Viewing All Tickets
            </p>
            <p className="text-xs text-muted-foreground leading-relaxed">
              Use{" "}
              <code className="bg-muted px-1 rounded">
                adminListAllTickets()
              </code>{" "}
              via the backend or the Admin panel to see every ticket across all
              events — useful for capacity planning, revenue reporting, and
              commission audits.
            </p>
          </div>
        ),
      },
      {
        id: "mlm-referral-system",
        title: "Referral Links & Challenges",
        content: (
          <div className="space-y-4">
            <p className="text-sm text-muted-foreground leading-relaxed">
              The referral system is the growth engine of the MLM network. Every
              member gets a unique code that tracks their entire downline
              on-chain.
            </p>
            <p className="text-sm font-semibold text-foreground">
              Using Your Referral Link
            </p>
            <ol className="space-y-1 list-decimal list-inside">
              {[
                "Go to /mlm → My Network tab.",
                "Copy your referral URL (format: /join?ref=YOURCODE).",
                "Share the link. When someone visits it, they land on a public marketing page showcasing the platform features and membership tier benefits.",
                "When they click Get Started and register, your referral code is automatically captured and linked to their account.",
                "You begin earning Level 1 direct referral commissions on their first qualifying payment.",
              ].map((step) => (
                <li key={step} className="text-xs text-muted-foreground">
                  {step}
                </li>
              ))}
            </ol>
            <p className="text-sm font-semibold text-foreground">
              Referral Landing Page
            </p>
            <p className="text-xs text-muted-foreground leading-relaxed">
              The <code className="bg-muted px-1 rounded">/join?ref=CODE</code>{" "}
              page is a public-facing marketing page that displays: the platform
              mission, all 7 membership tiers with earning depth, the
              FinFracFran™ spotlight, and a prominent Get Started CTA that
              pre-fills the referral code on the registration form.
            </p>
            <p className="text-sm font-semibold text-foreground">
              Bonus Challenges
            </p>
            <p className="text-xs text-muted-foreground leading-relaxed">
              Active bonus challenges appear on the <strong>Challenges</strong>{" "}
              tab of the Rewards Hub. Each challenge card shows:
            </p>
            <ul className="space-y-1">
              {[
                "Challenge name and objective (e.g. Recruit 3 new members in 7 days)",
                "Current progress bar (tracked against your downline activity)",
                "Deadline date",
                "Reward amount (flat bonus in USD cents, paid as an activityBonus EarningRecord on completion)",
              ].map((item) => (
                <li
                  key={item}
                  className="text-xs text-muted-foreground list-disc list-inside"
                >
                  {item}
                </li>
              ))}
            </ul>
            <p className="text-xs text-muted-foreground leading-relaxed">
              Admins create and manage bonus challenges from the Admin
              Dashboard. Challenges can be set to double commission periods,
              enrollment bonuses during promo windows, or flat recruitment
              bonuses.
            </p>
            <p className="text-sm font-semibold text-foreground">Leaderboard</p>
            <p className="text-xs text-muted-foreground leading-relaxed">
              The <strong>Leaderboard</strong> tab shows the top 10 recruiters
              for the current pay cycle with trophy medals (🥇🥈🥉), member
              name, tier badge, and referral count. Use this for social proof,
              recognition programs, and motivating network growth.
            </p>
          </div>
        ),
      },
      {
        id: "mlm-tiers-table",
        title: "Membership Tiers Reference",
        content: (
          <div className="space-y-4">
            <p className="text-sm text-muted-foreground leading-relaxed">
              There are 7 membership tiers. Each tier unlocks deeper commission
              earning levels, royalty pool access, and FinFracFran™ weight.
            </p>
            <div className="overflow-x-auto">
              <table className="w-full text-xs border-collapse">
                <thead>
                  <tr className="border-b border-border">
                    <th className="text-left py-2 pr-4 font-semibold text-foreground">
                      Tier
                    </th>
                    <th className="text-left py-2 pr-4 font-semibold text-foreground">
                      Level
                    </th>
                    <th className="text-left py-2 pr-4 font-semibold text-foreground">
                      Commission Depth
                    </th>
                    <th className="text-left py-2 font-semibold text-foreground">
                      Royalty Access
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {[
                    ["Free Member", "0", "None", "None"],
                    ["Associate", "1", "1 level", "None"],
                    ["Affiliate", "2", "2 levels", "None"],
                    ["Partner", "3", "3 levels", "None"],
                    ["Executive", "4", "4 levels", "Leadership Pool"],
                    [
                      "Ambassador",
                      "5",
                      "5 levels",
                      "+ Global Pool + Event Pool",
                    ],
                    [
                      "Founder",
                      "6",
                      "6 levels (max)",
                      "+ FinFracFran™ Founder Pool",
                    ],
                  ].map(([tier, level, depth, royalty]) => (
                    <tr
                      key={tier as string}
                      className="border-b border-border/50"
                    >
                      <td className="py-1.5 pr-4 font-medium text-foreground">
                        {tier}
                      </td>
                      <td className="py-1.5 pr-4 text-muted-foreground">
                        {level}
                      </td>
                      <td className="py-1.5 pr-4 text-muted-foreground">
                        {depth}
                      </td>
                      <td className="py-1.5 text-muted-foreground">
                        {royalty}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
            <p className="text-xs text-muted-foreground leading-relaxed">
              Tier qualification criteria (dues amount, recruitment count,
              downline volume, activity score) are configured by the admin in
              the Rate Table. Members can request upgrades from the Overview
              tab; admins can set tiers manually from the Admin Dashboard → MLM
              → Member Tiers.
            </p>
          </div>
        ),
      },
    ],
  },
];

// ─── Motion Variants ──────────────────────────────────────────────────────────

const sectionVariants: Variants = {
  hidden: { opacity: 0, y: 16 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.3 } },
};

// ─── Sidebar Navigation ───────────────────────────────────────────────────────

function DocsSidebar({
  activeSection,
  onSelect,
  onLinkClick,
}: {
  activeSection: string;
  onSelect: (id: string) => void;
  onLinkClick?: () => void;
}) {
  const [expandedSections, setExpandedSections] = useState<Set<string>>(
    new Set(DOC_SECTIONS.map((s) => s.id)),
  );

  function toggleSection(id: string) {
    setExpandedSections((prev) => {
      const next = new Set(prev);
      if (next.has(id)) {
        next.delete(id);
      } else {
        next.add(id);
      }
      return next;
    });
  }

  return (
    <nav className="py-2">
      <div className="px-3 py-2 mb-1">
        <p className="text-[10px] font-semibold uppercase tracking-widest text-muted-foreground flex items-center gap-1.5">
          <FileText size={10} />
          Contents
        </p>
      </div>
      {DOC_SECTIONS.map((section) => {
        const isExpanded = expandedSections.has(section.id);
        return (
          <div key={section.id}>
            <button
              type="button"
              onClick={() => {
                toggleSection(section.id);
                onSelect(section.id);
                onLinkClick?.();
              }}
              data-ocid={`docs.sidebar.${section.id}.button`}
              className={cn(
                "w-full flex items-center justify-between px-3 py-2.5 text-xs font-semibold transition-colors group",
                activeSection === section.id
                  ? "text-primary bg-primary/8"
                  : "text-foreground/80 hover:text-foreground hover:bg-secondary/60",
              )}
            >
              <span className="flex items-center gap-2">
                <span
                  className={cn(
                    "flex-shrink-0",
                    activeSection === section.id
                      ? "text-primary"
                      : "text-muted-foreground group-hover:text-foreground",
                  )}
                >
                  {section.icon}
                </span>
                {section.title}
                {section.badge && (
                  <Badge
                    variant="outline"
                    className={cn(
                      "text-[9px] h-3.5 px-1 py-0",
                      section.badge === "New"
                        ? "border-emerald-300 text-emerald-700 bg-emerald-50"
                        : "border-blue-300 text-blue-700 bg-blue-50",
                    )}
                  >
                    {section.badge}
                  </Badge>
                )}
              </span>
              <ChevronDown
                size={12}
                className={cn(
                  "text-muted-foreground transition-transform duration-200",
                  isExpanded && "rotate-180",
                )}
              />
            </button>

            {isExpanded && (
              <div className="ml-3 border-l border-border pl-2 mb-1">
                {section.subsections.map((sub) => (
                  <button
                    type="button"
                    key={sub.id}
                    onClick={() => {
                      onSelect(sub.id);
                      onLinkClick?.();
                    }}
                    data-ocid={`docs.sidebar.${sub.id}.link`}
                    className={cn(
                      "w-full text-left px-3 py-2 text-xs transition-colors rounded-sm",
                      activeSection === sub.id
                        ? "text-primary font-semibold"
                        : "text-muted-foreground hover:text-foreground hover:bg-secondary/40",
                    )}
                  >
                    {sub.title}
                  </button>
                ))}
              </div>
            )}
          </div>
        );
      })}
    </nav>
  );
}

// ─── Main Page ────────────────────────────────────────────────────────────────

export function DocsPage() {
  const { t } = useI18n();
  const [activeSection, setActiveSection] = useState("platform-overview");
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const contentRef = useRef<HTMLDivElement>(null);
  const sectionRefs = useRef<Record<string, HTMLElement | null>>({});

  // Collect all subsections in a flat list for navigation
  const allSubsections = DOC_SECTIONS.flatMap((s) =>
    s.subsections.map((sub) => ({ ...sub, sectionId: s.id })),
  );

  function scrollToSection(id: string) {
    setActiveSection(id);
    const el = sectionRefs.current[id];
    if (el) {
      el.scrollIntoView({ behavior: "smooth", block: "start" });
    }
  }

  // Track active section on scroll
  useEffect(() => {
    const container = contentRef.current;
    if (!container) return;

    function handleScroll() {
      const ids = allSubsections.map((s) => s.id);
      for (const id of [...ids].reverse()) {
        const el = sectionRefs.current[id];
        if (el) {
          const rect = el.getBoundingClientRect();
          if (rect.top <= 120) {
            setActiveSection(id);
            break;
          }
        }
      }
    }

    container.addEventListener("scroll", handleScroll, { passive: true });
    return () => container.removeEventListener("scroll", handleScroll);
  }, [allSubsections]);

  return (
    <Layout breadcrumb={`${t.sidebar.knowledge} › ${t.sidebar.documentation}`}>
      <div className="flex h-[calc(100vh-4rem)] overflow-hidden">
        {/* ── Desktop Sidebar ── */}
        <aside className="hidden lg:block w-[260px] flex-shrink-0 border-r border-border bg-secondary/20 overflow-hidden">
          <div className="h-full overflow-y-auto">
            <div className="px-4 py-4 border-b border-border bg-white/60">
              <div className="flex items-center gap-2">
                <div className="w-7 h-7 rounded-lg bg-primary/10 flex items-center justify-center">
                  <FileText size={14} className="text-primary" />
                </div>
                <div>
                  <h2 className="font-display font-bold text-xs text-foreground">
                    Platform Docs
                  </h2>
                  <p className="text-[10px] text-muted-foreground">
                    v1.0 —{" "}
                    {new Date().toLocaleDateString("en-US", {
                      month: "short",
                      year: "numeric",
                    })}
                  </p>
                </div>
              </div>
            </div>
            <DocsSidebar
              activeSection={activeSection}
              onSelect={scrollToSection}
            />
          </div>
        </aside>

        {/* ── Main Content ── */}
        <div ref={contentRef} className="flex-1 overflow-y-auto">
          {/* Mobile header with Contents trigger */}
          <div className="lg:hidden sticky top-0 z-10 bg-white/95 backdrop-blur-sm border-b border-border px-4 py-2.5 flex items-center gap-3">
            <Sheet open={mobileMenuOpen} onOpenChange={setMobileMenuOpen}>
              <SheetTrigger asChild>
                <Button
                  variant="outline"
                  size="sm"
                  className="h-8 gap-2 text-xs"
                  data-ocid="docs.mobile_contents.button"
                >
                  <Menu size={14} />
                  Contents
                </Button>
              </SheetTrigger>
              <SheetContent
                side="left"
                className="p-0 w-72 bg-white border-border"
                data-ocid="docs.mobile_contents.sheet"
              >
                <div className="h-full overflow-y-auto">
                  <div className="px-4 py-4 border-b border-border">
                    <h2 className="font-display font-bold text-sm text-foreground">
                      Documentation
                    </h2>
                  </div>
                  <DocsSidebar
                    activeSection={activeSection}
                    onSelect={scrollToSection}
                    onLinkClick={() => setMobileMenuOpen(false)}
                  />
                </div>
              </SheetContent>
            </Sheet>
            <p className="text-xs text-muted-foreground truncate">
              {allSubsections.find((s) => s.id === activeSection)?.title ??
                "Documentation"}
            </p>
          </div>

          <div className="max-w-3xl mx-auto px-6 py-8">
            {/* ── Docs Header ── */}
            <motion.div
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.3 }}
              className="mb-10"
            >
              <div className="flex items-center gap-3 mb-3">
                <div className="w-10 h-10 rounded-xl bg-primary/10 flex items-center justify-center">
                  <FileText size={20} className="text-primary" />
                </div>
                <div>
                  <h1 className="text-2xl font-display font-bold text-primary tracking-tight">
                    IIIntl One Documentation
                  </h1>
                  <p className="text-xs text-muted-foreground">
                    Platform guide for members, organizers, and administrators
                  </p>
                </div>
              </div>
              <div className="civic-rule w-16" />
              <div className="mt-4 grid grid-cols-2 sm:grid-cols-4 gap-3">
                {[
                  {
                    icon: <Globe size={13} className="text-blue-600" />,
                    label: "8 Sections",
                    bg: "bg-blue-50",
                  },
                  {
                    icon: <FileText size={13} className="text-emerald-600" />,
                    label: "24 Topics",
                    bg: "bg-emerald-50",
                  },
                  {
                    icon: <Users size={13} className="text-purple-600" />,
                    label: "All Roles",
                    bg: "bg-purple-50",
                  },
                  {
                    icon: <HelpCircle size={13} className="text-amber-600" />,
                    label: "v1.0",
                    bg: "bg-amber-50",
                  },
                ].map((stat) => (
                  <div
                    key={stat.label}
                    className={cn(
                      "rounded-lg border border-border p-2.5 flex items-center gap-2",
                      stat.bg,
                    )}
                  >
                    <div className="bg-white rounded p-1 shadow-xs flex-shrink-0">
                      {stat.icon}
                    </div>
                    <span className="text-xs font-medium text-foreground">
                      {stat.label}
                    </span>
                  </div>
                ))}
              </div>
            </motion.div>

            {/* ── Documentation Sections ── */}
            {DOC_SECTIONS.map((section, sIdx) => (
              <motion.div
                key={section.id}
                variants={sectionVariants}
                initial="hidden"
                whileInView="visible"
                viewport={{ once: true, amount: 0.05 }}
                className="mb-12"
                id={section.id}
                ref={(el) => {
                  sectionRefs.current[section.id] = el;
                }}
              >
                {/* Section header */}
                <div
                  className="flex items-center gap-3 mb-6"
                  data-ocid={`docs.section.${section.id}.panel`}
                >
                  <div className="w-9 h-9 rounded-xl bg-primary/10 flex items-center justify-center flex-shrink-0">
                    <span className="text-primary">{section.icon}</span>
                  </div>
                  <div className="flex-1">
                    <h2 className="font-display font-bold text-lg text-foreground flex items-center gap-2">
                      {section.title}
                      {section.badge && (
                        <Badge
                          variant="outline"
                          className={cn(
                            "text-[10px] h-4 px-1.5",
                            section.badge === "New"
                              ? "border-emerald-300 text-emerald-700 bg-emerald-50"
                              : "border-blue-300 text-blue-700 bg-blue-50",
                          )}
                        >
                          {section.badge}
                        </Badge>
                      )}
                    </h2>
                    <div className="flex items-center gap-2 mt-0.5">
                      <div
                        className="civic-rule w-8"
                        style={{ height: "2px" }}
                      />
                      <span className="text-[10px] text-muted-foreground">
                        Section {sIdx + 1}
                      </span>
                    </div>
                  </div>
                </div>

                {/* Subsections */}
                <div className="space-y-8">
                  {section.subsections.map((sub) => (
                    <div
                      key={sub.id}
                      id={sub.id}
                      ref={(el) => {
                        sectionRefs.current[sub.id] = el;
                      }}
                      className="scroll-mt-8"
                      data-ocid={`docs.subsection.${sub.id}.panel`}
                    >
                      <h3 className="font-display font-semibold text-base text-foreground mb-3 flex items-center gap-2">
                        <span className="w-1.5 h-1.5 rounded-full bg-primary inline-block flex-shrink-0" />
                        {sub.title}
                      </h3>
                      <div className="pl-4 border-l-2 border-border/60">
                        {sub.content}
                      </div>
                    </div>
                  ))}
                </div>

                {sIdx < DOC_SECTIONS.length - 1 && (
                  <div className="mt-8 border-t border-border" />
                )}
              </motion.div>
            ))}

            {/* ── Docs Footer ── */}
            <div className="mt-8 pt-6 border-t border-border">
              <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
                <div>
                  <p className="text-xs text-muted-foreground">
                    Last updated:{" "}
                    {new Date().toLocaleDateString("en-US", {
                      month: "long",
                      day: "numeric",
                      year: "numeric",
                    })}
                  </p>
                  <p className="text-xs text-muted-foreground">
                    Maintained by the IIIntl Platform Team
                  </p>
                </div>
                <div className="flex gap-2">
                  <Button
                    variant="outline"
                    size="sm"
                    className="h-8 text-xs gap-1.5"
                    asChild
                    data-ocid="docs.footer.faq_link"
                  >
                    <a href="/faq">
                      <HelpCircle size={12} />
                      FAQ
                    </a>
                  </Button>
                  <Button
                    variant="outline"
                    size="sm"
                    className="h-8 text-xs gap-1.5"
                    asChild
                    data-ocid="docs.footer.resources_link"
                  >
                    <a href="/resources">
                      <BookOpen size={12} />
                      Resources
                    </a>
                  </Button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </Layout>
  );
}
