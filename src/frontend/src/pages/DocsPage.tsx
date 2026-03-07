import { Layout } from "@/components/Layout";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import { cn } from "@/lib/utils";
import {
  BookOpen,
  Building2,
  ChevronDown,
  ChevronRight,
  Code2,
  FileText,
  Globe,
  HelpCircle,
  LayoutDashboard,
  Lock,
  Megaphone,
  Menu,
  MessageSquare,
  Settings,
  Shield,
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
    <Layout breadcrumb="Knowledge › Documentation">
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
