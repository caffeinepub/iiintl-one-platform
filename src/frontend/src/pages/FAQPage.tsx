import { Layout } from "@/components/Layout";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Textarea } from "@/components/ui/textarea";
import { useI18n } from "@/context/I18nContext";
import { cn } from "@/lib/utils";
import {
  Building2,
  CheckCircle2,
  HelpCircle,
  Lock,
  Megaphone,
  MessageSquare,
  Search,
  Send,
  Settings,
  Shield,
  Users,
  Wrench,
  Zap,
} from "lucide-react";
import type { Variants } from "motion/react";
import { motion } from "motion/react";
import { useMemo, useState } from "react";

// ─── Types ────────────────────────────────────────────────────────────────────

type FAQCategory =
  | "Membership"
  | "Organizations"
  | "Campaigns"
  | "Platform & Features"
  | "Privacy & Data"
  | "Technical Support";

interface FAQItem {
  id: string;
  question: string;
  answer: string;
  category: FAQCategory;
}

// ─── FAQ Data ─────────────────────────────────────────────────────────────────

const FAQ_ITEMS: FAQItem[] = [
  // ── Membership ──
  {
    id: "m-1",
    category: "Membership",
    question: "How do I create an account on IIIntl One?",
    answer:
      'Creating an account is straightforward. Click the "Get Started" button in the top navigation, fill in your name, email address, and choose a secure password. Once registered, you\'ll be assigned the Member role by default. Your organization administrator can then upgrade your permissions based on your responsibilities within the organization. Be sure to use an email address you have regular access to — it will be used for important platform notifications.',
  },
  {
    id: "m-2",
    category: "Membership",
    question: "What are the different membership roles and what can each do?",
    answer:
      "IIIntl One has six roles with increasing levels of access:\n\n• Guest — Can view public content like the home page, FAQ, and public resources, but cannot interact with community features.\n• Member — Can participate in forums, join campaigns, sign petitions, and access the full resource library.\n• Activist — Has all Member permissions plus the ability to create activism actions like calls to action and events.\n• Org Admin — Can manage a specific organization: invite members, create campaigns, and manage that org's resources.\n• Admin — Can manage the full platform including all organizations, members, and content.\n• Super Admin — Full platform control including system settings and user management.",
  },
  {
    id: "m-3",
    category: "Membership",
    question: "Can I be a member of multiple organizations?",
    answer:
      "Yes. IIIntl One is designed as a multi-organization platform. You can hold membership in multiple organizations simultaneously. Your profile page shows all your current organizational affiliations. Organization administrators control membership for their org — they can invite you or approve a membership request. Each organization may have its own access permissions, so your effective capabilities may differ depending on which organization context you're operating in.",
  },
  {
    id: "m-4",
    category: "Membership",
    question: "How do I update my profile information?",
    answer:
      "Navigate to your Profile page via the dropdown menu in the top-right corner of the platform. From there you can update your display name, bio, contact information, and notification preferences. Profile changes take effect immediately. If you need to change your email address, that requires re-verification — a confirmation email will be sent to both your old and new address to prevent unauthorized changes.",
  },
  // ── Organizations ──
  {
    id: "o-1",
    category: "Organizations",
    question: "How do I create a new organization?",
    answer:
      "Users with Admin or Super Admin roles can create new organizations. Navigate to the Organizations page and click \"Create Organization.\" You'll need to provide the organization name, type, region, description, and optionally a website and tagline. Once created, you can set yourself as the organization's admin or assign another qualified member. Note that Org Admin, Member, and Activist roles cannot create new organizations — they can only join existing ones.",
  },
  {
    id: "o-2",
    category: "Organizations",
    question: "How do I invite new members to my organization?",
    answer:
      "Organization Admins can invite members from the Organization Detail page. Go to the Members tab and click \"Invite Member.\" You can invite by email address. If the person already has a platform account, they'll receive a notification and can accept directly. If they don't have an account, they'll receive an email with instructions to register and join. Invitations expire after 7 days if not accepted, but can be resent.",
  },
  {
    id: "o-3",
    category: "Organizations",
    question:
      "Can I change an organization's settings after it's been created?",
    answer:
      "Yes. Organization Admins can edit organization settings at any time from the Organization Detail page, Settings tab. You can update the description, tagline, website, and contact information. The organization name and region can also be changed, though regional reassignments may affect how the organization appears in search and discovery features. Changes to the organization type require Admin-level approval to prevent misuse of platform categorizations.",
  },
  {
    id: "o-4",
    category: "Organizations",
    question: "What happens to an organization's data if it's archived?",
    answer:
      "Archiving an organization preserves all historical data — campaigns, forum posts, resources, and member history — but makes the organization inactive on the platform. Archived organizations no longer appear in search results or the active directory. Members retain their platform accounts but can no longer take actions under that organization's banner. An archived organization can be restored by a Super Admin if the situation changes.",
  },
  // ── Campaigns ──
  {
    id: "c-1",
    category: "Campaigns",
    question: "Who can create a campaign?",
    answer:
      "Campaigns can be created by Organization Admins, Admins, and Super Admins. If you're a Member or Activist who wants to run a campaign, reach out to your Organization Admin to create it on your behalf, or request an upgrade of your permissions. When creating a campaign, you'll need to set a title, description, goals, start and end dates, and a target region. You can also attach petitions and calls to action to the campaign.",
  },
  {
    id: "c-2",
    category: "Campaigns",
    question: "How do I track campaign progress?",
    answer:
      "Each campaign has a dedicated detail page with a Progress tab showing key metrics: participant count versus goal, petition signatures, calls to action completed, and timeline milestones. Organization Admins can see additional analytics including conversion rates and engagement trends. Campaign progress is updated in real time as members participate. You can share campaign links to recruit participants from outside the platform.",
  },
  {
    id: "c-3",
    category: "Campaigns",
    question: "Can I run a petition as part of a campaign?",
    answer:
      "Yes. Petitions are a core feature of campaigns. When creating or editing a campaign, you can attach one or more petitions with specific targets, signature goals, and deadline dates. Members can sign petitions directly from the campaign page. The platform tracks total signatures, and Org Admins can export signature lists (without personal contact information by default) for submission to decision-makers.",
  },
  {
    id: "c-4",
    category: "Campaigns",
    question: "What's the difference between a Campaign and a Call to Action?",
    answer:
      'A Campaign is a sustained, multi-faceted effort with a defined goal and timeline — it can include petitions, calls to action, events, and educational resources. A Call to Action (CTA) is a specific, time-bounded action item within a campaign — like "Call your representative," "Attend this meeting," or "Submit a public comment by Friday." CTAs can exist independently or be nested within campaigns. Think of the Campaign as the strategic container and CTAs as individual tactical steps.',
  },
  // ── Platform & Features ──
  {
    id: "p-1",
    category: "Platform & Features",
    question: "Is IIIntl One available in multiple languages?",
    answer:
      "The platform currently supports English, French, Spanish, Arabic, and Chinese (Mandarin) through the language switcher in the top navigation bar. The interface automatically displays in your selected language. Content uploaded by organizations (forum posts, resource documents) remains in its original language. We're actively expanding our language support — if you'd like to see your language added, contact the platform team through the feedback form below.",
  },
  {
    id: "p-2",
    category: "Platform & Features",
    question: "How does the forum moderation system work?",
    answer:
      "Forums are community-moderated with support from Organization Admins and Platform Admins. Members can flag inappropriate content using the report function on any post. Organization Admins can pin important threads, lock threads to prevent new replies, or archive entire threads. Platform Admins can remove content that violates community standards. All moderation actions are logged and reversible. IIIntl One's Community Standards document (available in the Documentation section) outlines what content is and isn't permitted.",
  },
  {
    id: "p-3",
    category: "Platform & Features",
    question: "Can I access IIIntl One on mobile devices?",
    answer:
      "Yes. IIIntl One is fully responsive and works on all modern mobile browsers. The interface adapts to smaller screens with a collapsible sidebar, touch-friendly controls, and optimized layouts for key features like forums, campaigns, and the resource library. A dedicated mobile app is in our product roadmap for a future release.",
  },
  {
    id: "p-4",
    category: "Platform & Features",
    question: "How do I use the Member Directory?",
    answer:
      "The Member Directory is accessible from the Community section of the sidebar. It shows all platform members filtered by organization, region, and role. You can search by name or keyword, toggle between grid and table views, and click any member's card to view their full profile — including their bio, organizational affiliations, campaign participation history, and forum activity. Members control their own privacy settings to determine what's publicly visible.",
  },
  // ── Privacy & Data ──
  {
    id: "d-1",
    category: "Privacy & Data",
    question: "What data does IIIntl One collect about me?",
    answer:
      "IIIntl One collects the information you provide during registration (name, email, organization) and activity data generated by your platform use (forum posts, campaign participation, resource views). We do not collect payment data, precise location, or any biometric information. Activity data is used solely to power the platform's features — your personal feed, recommendations, and organization management. We do not sell your data to third parties under any circumstances.",
  },
  {
    id: "d-2",
    category: "Privacy & Data",
    question: "Who can see my profile and activity?",
    answer:
      "By default, your name, organization affiliations, and general activity (campaign participation, forum posts) are visible to other logged-in platform members. Your email address is only visible to Organization Admins of orgs you belong to, and to Platform Admins. You can control your privacy settings from the Profile page — you can choose to hide your activity feed, limit profile visibility to your organization only, or request full account anonymization from the platform admin.",
  },
  {
    id: "d-3",
    category: "Privacy & Data",
    question: "How can I request deletion of my account and data?",
    answer:
      'To request full account deletion, navigate to your Profile page, scroll to the "Account" section, and click "Delete Account." You\'ll be asked to confirm your password and provide an optional reason. Account deletion removes your personal information (name, email, bio) but preserves anonymized activity records (e.g., forum posts appear as "[Deleted User]"). Complete data erasure, including activity records, can be requested by contacting the platform admin directly.',
  },
  // ── Technical Support ──
  {
    id: "t-1",
    category: "Technical Support",
    question: "What should I do if I can't log in to my account?",
    answer:
      "First, try the \"Forgot Password\" link on the login page — this will send a password reset email to your registered address. Check your spam folder if you don't see it within a few minutes. If you no longer have access to your registered email, contact your Organization Admin who can reach platform support on your behalf. If you're a demo user testing the platform, use the Demo Accounts panel on the login page to test any of the six predefined roles.",
  },
  {
    id: "t-2",
    category: "Technical Support",
    question:
      "I found a bug or something isn't working correctly. What do I do?",
    answer:
      "We appreciate bug reports. Use the feedback form below with a detailed description of the issue including: what you were trying to do, what happened instead, your browser and operating system, and steps to reproduce the problem. Screenshots are very helpful. For critical issues affecting your organization's work, contact your Platform Admin directly through your organization's communication channels for faster escalation.",
  },
  {
    id: "t-3",
    category: "Technical Support",
    question: "Which browsers are officially supported?",
    answer:
      "IIIntl One officially supports the latest two major versions of Chrome, Firefox, Safari, and Edge. Internet Explorer is not supported. For the best experience, we recommend Chrome or Firefox on desktop, and Safari on iOS. If you're experiencing issues on a supported browser, try clearing your browser cache and cookies — this resolves the majority of display and session issues.",
  },
];

const CATEGORIES: FAQCategory[] = [
  "Membership",
  "Organizations",
  "Campaigns",
  "Platform & Features",
  "Privacy & Data",
  "Technical Support",
];

function getCategoryIcon(cat: FAQCategory) {
  switch (cat) {
    case "Membership":
      return <Users size={14} />;
    case "Organizations":
      return <Building2 size={14} />;
    case "Campaigns":
      return <Megaphone size={14} />;
    case "Platform & Features":
      return <Zap size={14} />;
    case "Privacy & Data":
      return <Shield size={14} />;
    case "Technical Support":
      return <Wrench size={14} />;
    default:
      return <HelpCircle size={14} />;
  }
}

function getCategoryColor(cat: FAQCategory): string {
  switch (cat) {
    case "Membership":
      return "bg-blue-50 text-blue-700 border-blue-200";
    case "Organizations":
      return "bg-emerald-50 text-emerald-700 border-emerald-200";
    case "Campaigns":
      return "bg-amber-50 text-amber-700 border-amber-200";
    case "Platform & Features":
      return "bg-purple-50 text-purple-700 border-purple-200";
    case "Privacy & Data":
      return "bg-slate-50 text-slate-700 border-slate-200";
    case "Technical Support":
      return "bg-rose-50 text-rose-700 border-rose-200";
    default:
      return "bg-secondary text-muted-foreground";
  }
}

// ─── Motion Variants ──────────────────────────────────────────────────────────

const containerVariants: Variants = {
  hidden: { opacity: 0 },
  visible: { opacity: 1, transition: { staggerChildren: 0.04 } },
};

const itemVariants: Variants = {
  hidden: { opacity: 0, y: 10 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.24 } },
};

// ─── Main Page ────────────────────────────────────────────────────────────────

export function FAQPage() {
  const { t } = useI18n();
  const [search, setSearch] = useState("");
  const [categoryFilter, setCategoryFilter] = useState<string>("all");
  const [feedbackQuestion, setFeedbackQuestion] = useState("");
  const [feedbackSubmitted, setFeedbackSubmitted] = useState(false);
  const [feedbackSubmitting, setFeedbackSubmitting] = useState(false);

  const filtered = useMemo(() => {
    const q = search.toLowerCase();
    return FAQ_ITEMS.filter((item) => {
      const matchesSearch =
        !search ||
        item.question.toLowerCase().includes(q) ||
        item.answer.toLowerCase().includes(q);
      const matchesCat =
        categoryFilter === "all" || item.category === categoryFilter;
      return matchesSearch && matchesCat;
    });
  }, [search, categoryFilter]);

  function handleFeedbackSubmit() {
    if (!feedbackQuestion.trim()) return;
    setFeedbackSubmitting(true);
    setTimeout(() => {
      setFeedbackSubmitting(false);
      setFeedbackSubmitted(true);
      setFeedbackQuestion("");
    }, 1200);
  }

  return (
    <Layout breadcrumb={`${t.sidebar.knowledge} › ${t.sidebar.faq}`}>
      <div className="p-6 max-w-4xl mx-auto">
        {/* ── Page Header ── */}
        <motion.div
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3 }}
          className="mb-8 text-center"
        >
          <div className="inline-flex items-center justify-center w-14 h-14 rounded-2xl bg-primary/10 mb-4">
            <HelpCircle size={26} className="text-primary" />
          </div>
          <h1 className="text-3xl font-display font-bold text-primary tracking-tight">
            {t.faq.title}
          </h1>
          <p className="text-muted-foreground text-sm mt-2 max-w-xl mx-auto">
            {t.faq.subtitle}
          </p>
          <div className="mt-4 civic-rule w-12 mx-auto" />
        </motion.div>

        {/* ── Search ── */}
        <motion.div
          initial={{ opacity: 0, y: 8 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3, delay: 0.05 }}
          className="relative mb-4"
        >
          <Search
            size={16}
            className="absolute left-3.5 top-1/2 -translate-y-1/2 text-muted-foreground"
          />
          <Input
            placeholder={t.faq.searchPlaceholder}
            className="pl-10 h-10 text-sm"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            data-ocid="faq.search_input"
          />
        </motion.div>

        {/* ── Category Filter Tabs ── */}
        <motion.div
          initial={{ opacity: 0, y: 8 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3, delay: 0.07 }}
          className="mb-5"
        >
          <Tabs value={categoryFilter} onValueChange={setCategoryFilter}>
            <TabsList className="h-9 flex-wrap w-full sm:w-auto">
              <TabsTrigger
                value="all"
                className="text-xs px-3"
                data-ocid="faq.category_filter.tab"
              >
                All ({FAQ_ITEMS.length})
              </TabsTrigger>
              {CATEGORIES.map((cat) => {
                const count = FAQ_ITEMS.filter(
                  (f) => f.category === cat,
                ).length;
                return (
                  <TabsTrigger
                    key={cat}
                    value={cat}
                    className="text-xs px-2.5 gap-1.5"
                    data-ocid="faq.category_filter.tab"
                  >
                    {getCategoryIcon(cat)}
                    <span className="hidden sm:inline">{cat}</span>
                    <span className="text-[10px] opacity-70">({count})</span>
                  </TabsTrigger>
                );
              })}
            </TabsList>
          </Tabs>
        </motion.div>

        {/* Results count when searching */}
        {search && (
          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="text-xs text-muted-foreground mb-3"
          >
            {filtered.length} result{filtered.length !== 1 ? "s" : ""} found for
            &ldquo;{search}&rdquo;
          </motion.p>
        )}

        {/* ── FAQ Accordion ── */}
        {filtered.length === 0 ? (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="flex flex-col items-center justify-center py-20 text-center"
            data-ocid="faq.empty_state"
          >
            <div className="w-14 h-14 rounded-2xl bg-secondary flex items-center justify-center mb-4">
              <Search size={22} className="text-muted-foreground/50" />
            </div>
            <h3 className="font-display font-semibold text-foreground mb-1">
              No matching questions
            </h3>
            <p className="text-sm text-muted-foreground max-w-xs">
              {search
                ? `No FAQ items match "${search}". Try different keywords or scroll down to submit your question.`
                : "No FAQ items match the selected category."}
            </p>
          </motion.div>
        ) : (
          <motion.div
            variants={containerVariants}
            initial="hidden"
            animate="visible"
          >
            {(categoryFilter === "all"
              ? CATEGORIES
              : [categoryFilter as FAQCategory]
            ).map((cat) => {
              const items = filtered.filter((f) => f.category === cat);
              if (items.length === 0) return null;
              const catColor = getCategoryColor(cat as FAQCategory);
              return (
                <motion.div key={cat} variants={itemVariants} className="mb-6">
                  <div className="flex items-center gap-2 mb-3">
                    <Badge
                      variant="outline"
                      className={cn(
                        "text-xs px-2.5 py-1 h-6 flex items-center gap-1.5",
                        catColor,
                      )}
                    >
                      {getCategoryIcon(cat as FAQCategory)}
                      {cat}
                    </Badge>
                    <div className="flex-1 h-px bg-border" />
                    <span className="text-[11px] text-muted-foreground">
                      {items.length} Q&amp;A
                    </span>
                  </div>

                  <Accordion type="multiple" className="space-y-2">
                    {items.map((item, i) => (
                      <AccordionItem
                        key={item.id}
                        value={item.id}
                        className="border border-border rounded-lg overflow-hidden bg-card shadow-xs"
                        data-ocid={`faq.item.${i + 1}`}
                      >
                        <AccordionTrigger className="px-4 py-3.5 hover:no-underline hover:bg-secondary/40 text-left font-display font-semibold text-sm text-foreground [&[data-state=open]]:bg-secondary/40 transition-colors">
                          <span className="flex items-start gap-2.5 pr-3 text-left">
                            <HelpCircle
                              size={14}
                              className="text-primary flex-shrink-0 mt-0.5"
                            />
                            {item.question}
                          </span>
                        </AccordionTrigger>
                        <AccordionContent className="px-4 pb-4 pt-0">
                          <div className="pl-6 border-l-2 border-primary/20 ml-0.5">
                            {item.answer.split("\n").map((line, li) => {
                              const lineKey = `${item.id}-line-${li}`;
                              if (line.startsWith("•")) {
                                return (
                                  <p
                                    key={lineKey}
                                    className="text-sm text-muted-foreground leading-relaxed mt-1 flex items-start gap-1.5"
                                  >
                                    <span className="text-primary flex-shrink-0 mt-0.5">
                                      •
                                    </span>
                                    <span>{line.slice(2)}</span>
                                  </p>
                                );
                              }
                              return line ? (
                                <p
                                  key={lineKey}
                                  className="text-sm text-muted-foreground leading-relaxed mt-2 first:mt-0"
                                >
                                  {line}
                                </p>
                              ) : null;
                            })}
                          </div>
                        </AccordionContent>
                      </AccordionItem>
                    ))}
                  </Accordion>
                </motion.div>
              );
            })}
          </motion.div>
        )}

        {/* ── Contact / Feedback Section ── */}
        <motion.div
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3, delay: 0.15 }}
          className="mt-12"
        >
          <Card className="border-border bg-secondary/30 overflow-hidden">
            <CardContent className="px-6 py-6">
              <div className="flex items-start gap-4">
                <div className="w-10 h-10 rounded-xl bg-primary/10 flex items-center justify-center flex-shrink-0">
                  <MessageSquare size={18} className="text-primary" />
                </div>
                <div className="flex-1 min-w-0">
                  <h2 className="font-display font-bold text-foreground text-base mb-1">
                    Didn&apos;t find your answer?
                  </h2>
                  <p className="text-sm text-muted-foreground mb-4">
                    Submit your question below and our team will get back to you
                    — we also use submitted questions to improve this FAQ.
                  </p>

                  {feedbackSubmitted ? (
                    <motion.div
                      initial={{ opacity: 0, scale: 0.95 }}
                      animate={{ opacity: 1, scale: 1 }}
                      className="flex items-center gap-3 py-3 px-4 bg-emerald-50 border border-emerald-200 rounded-lg"
                      data-ocid="faq.feedback.success_state"
                    >
                      <CheckCircle2
                        size={18}
                        className="text-emerald-600 flex-shrink-0"
                      />
                      <div>
                        <p className="text-sm font-semibold text-emerald-800">
                          Question received — thank you!
                        </p>
                        <p className="text-xs text-emerald-700 mt-0.5">
                          We typically respond within 2-3 business days.
                        </p>
                      </div>
                    </motion.div>
                  ) : (
                    <div className="space-y-3">
                      <div className="space-y-1.5">
                        <Label
                          htmlFor="faq-feedback"
                          className="text-sm font-medium"
                        >
                          Your Question
                        </Label>
                        <Textarea
                          id="faq-feedback"
                          placeholder="Describe what you're trying to find out or what isn't covered in the FAQ..."
                          rows={3}
                          value={feedbackQuestion}
                          onChange={(e) => setFeedbackQuestion(e.target.value)}
                          data-ocid="faq.feedback.textarea"
                        />
                      </div>
                      <Button
                        size="sm"
                        className="gap-2"
                        onClick={handleFeedbackSubmit}
                        disabled={
                          !feedbackQuestion.trim() || feedbackSubmitting
                        }
                        data-ocid="faq.submit_button"
                      >
                        {feedbackSubmitting ? (
                          <>
                            <Lock size={13} className="animate-pulse" />
                            Submitting...
                          </>
                        ) : (
                          <>
                            <Send size={13} />
                            Submit Question
                          </>
                        )}
                      </Button>
                    </div>
                  )}
                </div>
              </div>
            </CardContent>
          </Card>
        </motion.div>

        {/* ── Quick Links ── */}
        <motion.div
          initial={{ opacity: 0, y: 8 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3, delay: 0.18 }}
          className="mt-6 flex flex-wrap gap-3 justify-center"
        >
          {[
            {
              icon: <Settings size={13} />,
              label: "Platform Docs",
              href: "/docs",
            },
            {
              icon: <Users size={13} />,
              label: "Member Directory",
              href: "/members",
            },
            {
              icon: <HelpCircle size={13} />,
              label: "Admin Guide",
              href: "/docs",
            },
          ].map((link) => (
            <a
              key={link.label}
              href={link.href}
              className="inline-flex items-center gap-1.5 text-xs text-muted-foreground hover:text-primary transition-colors px-3 py-1.5 rounded-full border border-border hover:border-primary/30 hover:bg-primary/5"
            >
              {link.icon}
              {link.label}
            </a>
          ))}
        </motion.div>
      </div>
    </Layout>
  );
}
