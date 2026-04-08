import { ForumCategory, type ForumThread, ThreadStatus } from "@/backend";
import type { backendInterface } from "@/backend";
import { Layout } from "@/components/Layout";
import { RoleGate } from "@/components/RoleGate";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
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
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Skeleton } from "@/components/ui/skeleton";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Textarea } from "@/components/ui/textarea";
import { useAuth } from "@/context/AuthContext";
import { useI18n } from "@/context/I18nContext";
import { useBackend } from "@/hooks/useBackend";
import { cn } from "@/lib/utils";
import type { ExtendedBackend } from "@/types/appTypes";
import { Link } from "@tanstack/react-router";
import {
  Archive,
  ChevronRight,
  Clock,
  Eye,
  Layers,
  Lock,
  MessageCircle,
  MessageSquare,
  Pin,
  Plus,
  Search,
  Tag,
  Users,
} from "lucide-react";
import type { Variants } from "motion/react";
import { motion } from "motion/react";
import { useCallback, useEffect, useState } from "react";
import { toast } from "sonner";

const containerVariants: Variants = {
  hidden: { opacity: 0 },
  visible: { opacity: 1, transition: { staggerChildren: 0.05 } },
};

const itemVariants: Variants = {
  hidden: { opacity: 0, y: 16 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.28 } },
};

type FilterTab = "all" | "pinned" | "archived";

const CATEGORY_LABELS: Record<ForumCategory, string> = {
  [ForumCategory.general]: "General Discussion",
  [ForumCategory.resources]: "Resources",
  [ForumCategory.regional]: "Regional News",
  [ForumCategory.campaigns]: "Campaigns",
  [ForumCategory.activism]: "Activism",
  [ForumCategory.announcements]: "Announcements",
};

const CATEGORY_COLORS: Record<ForumCategory, string> = {
  [ForumCategory.general]: "bg-blue-50 text-blue-700 border-blue-200",
  [ForumCategory.resources]:
    "bg-emerald-50 text-emerald-700 border-emerald-200",
  [ForumCategory.regional]: "bg-teal-50 text-teal-700 border-teal-200",
  [ForumCategory.campaigns]: "bg-violet-50 text-violet-700 border-violet-200",
  [ForumCategory.activism]: "bg-rose-50 text-rose-700 border-rose-200",
  [ForumCategory.announcements]: "bg-amber-50 text-amber-700 border-amber-200",
};

const BACKEND_CATEGORIES: ForumCategory[] = [
  ForumCategory.general,
  ForumCategory.resources,
  ForumCategory.regional,
  ForumCategory.campaigns,
  ForumCategory.activism,
  ForumCategory.announcements,
];

const SORT_OPTIONS = [
  { value: "latest", label: "Latest Activity" },
  { value: "replies", label: "Most Replies" },
  { value: "views", label: "Most Views" },
];

function nanoToMs(ns: bigint): number {
  return Number(ns / 1_000_000n);
}

function timeAgo(ns: bigint): string {
  const diff = Date.now() - nanoToMs(ns);
  const mins = Math.floor(diff / 60000);
  const hours = Math.floor(diff / 3600000);
  const days = Math.floor(diff / 86400000);
  if (days >= 7) return `${Math.floor(days / 7)}w ago`;
  if (days >= 1) return `${days}d ago`;
  if (hours >= 1) return `${hours}h ago`;
  if (mins >= 1) return `${mins}m ago`;
  return "just now";
}

function truncatePrincipal(p: { toString(): string }): string {
  const s = p.toString();
  return s.length > 12 ? `${s.slice(0, 8)}…` : s;
}

function ThreadSkeleton() {
  return (
    <div className="space-y-2">
      {[1, 2, 3, 4, 5].map((i) => (
        <Card key={i} className="border-border">
          <CardContent className="px-4 py-3.5">
            <div className="flex items-start gap-3">
              <Skeleton className="w-8 h-8 rounded-lg flex-shrink-0" />
              <div className="flex-1 space-y-2">
                <Skeleton className="h-3.5 w-1/4" />
                <Skeleton className="h-4 w-3/4" />
                <Skeleton className="h-3 w-1/2" />
              </div>
              <div className="hidden sm:flex flex-col items-end gap-2">
                <Skeleton className="h-3 w-16" />
                <Skeleton className="h-3 w-12" />
              </div>
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  );
}

function CreateThreadDialog({
  open,
  onOpenChange,
  onCreated,
  backend,
}: {
  open: boolean;
  onOpenChange: (v: boolean) => void;
  onCreated: () => void;
  backend: ExtendedBackend | null;
}) {
  const [title, setTitle] = useState("");
  const [category, setCategory] = useState<string>("");
  const [content, setContent] = useState("");
  const [tags, setTags] = useState("");
  const [saving, setSaving] = useState(false);

  async function handleSubmit() {
    if (!title.trim() || !category || !content.trim() || !backend) return;
    setSaving(true);
    try {
      const tagList = tags
        .split(",")
        .map((t) => t.trim())
        .filter(Boolean);
      await backend.createThread(
        title.trim(),
        content.trim(),
        category as ForumCategory,
        null,
        tagList,
      );
      toast.success("Thread posted successfully!");
      onCreated();
      onOpenChange(false);
      setTitle("");
      setCategory("");
      setContent("");
      setTags("");
    } catch (err) {
      toast.error("Failed to post thread. Please try again.");
      console.error(err);
    } finally {
      setSaving(false);
    }
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent
        className="sm:max-w-2xl max-h-[90vh] overflow-y-auto"
        data-ocid="forums.create_thread.dialog"
      >
        <DialogHeader>
          <DialogTitle className="font-display text-xl flex items-center gap-2">
            <MessageSquare size={18} className="text-primary" />
            Start a New Thread
          </DialogTitle>
          <DialogDescription>
            Share a question, resource, or discussion topic with the global
            IIIntl community.
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-4 py-2">
          <div className="space-y-1.5">
            <Label htmlFor="thread-title" className="text-sm font-medium">
              Thread Title <span className="text-destructive">*</span>
            </Label>
            <Input
              id="thread-title"
              placeholder="e.g. Best practices for grassroots coalition building"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              data-ocid="forums.new_thread.input"
            />
          </div>

          <div className="space-y-1.5">
            <Label className="text-sm font-medium">
              Category <span className="text-destructive">*</span>
            </Label>
            <Select value={category} onValueChange={setCategory}>
              <SelectTrigger data-ocid="forums.category.select">
                <SelectValue placeholder="Select a category" />
              </SelectTrigger>
              <SelectContent>
                {BACKEND_CATEGORIES.map((cat) => (
                  <SelectItem key={cat} value={cat}>
                    {CATEGORY_LABELS[cat]}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-1.5">
            <Label htmlFor="thread-content" className="text-sm font-medium">
              Opening Post <span className="text-destructive">*</span>
            </Label>
            <Textarea
              id="thread-content"
              placeholder="Share your question, insight, or discussion prompt in detail..."
              rows={6}
              value={content}
              onChange={(e) => setContent(e.target.value)}
              data-ocid="forums.new_thread.textarea"
            />
          </div>

          <div className="space-y-1.5">
            <Label htmlFor="thread-tags" className="text-sm font-medium">
              Tags{" "}
              <span className="text-muted-foreground font-normal">
                (comma-separated, optional)
              </span>
            </Label>
            <Input
              id="thread-tags"
              placeholder="e.g. climate, organizing, africa"
              value={tags}
              onChange={(e) => setTags(e.target.value)}
              data-ocid="forums.tags.input"
            />
          </div>
        </div>

        <DialogFooter className="gap-2">
          <Button
            variant="outline"
            onClick={() => onOpenChange(false)}
            data-ocid="forums.create_thread.cancel_button"
          >
            Cancel
          </Button>
          <Button
            onClick={handleSubmit}
            disabled={!title.trim() || !category || !content.trim() || saving}
            data-ocid="forums.create_thread.submit_button"
          >
            {saving ? "Posting..." : "Post Thread"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}

function ThreadStatusBadge({ thread }: { thread: ForumThread }) {
  if (thread.isPinned) {
    return (
      <Badge
        variant="outline"
        className="text-[10px] px-1.5 py-0 h-4 bg-amber-50 text-amber-700 border-amber-200 flex items-center gap-0.5"
      >
        <Pin size={8} className="fill-amber-500" />
        Pinned
      </Badge>
    );
  }
  if (thread.status === ThreadStatus.locked) {
    return (
      <Badge
        variant="outline"
        className="text-[10px] px-1.5 py-0 h-4 bg-gray-50 text-gray-600 border-gray-200 flex items-center gap-0.5"
      >
        <Lock size={8} />
        Locked
      </Badge>
    );
  }
  if (thread.status === ThreadStatus.archived) {
    return (
      <Badge
        variant="outline"
        className="text-[10px] px-1.5 py-0 h-4 bg-slate-50 text-slate-500 border-slate-200 flex items-center gap-0.5"
      >
        <Archive size={8} />
        Archived
      </Badge>
    );
  }
  return null;
}

function ThreadRow({
  thread,
  index,
}: {
  thread: ForumThread;
  index: number;
}) {
  const catColor =
    CATEGORY_COLORS[thread.category] ??
    "bg-secondary text-foreground border-border";

  return (
    <motion.div
      variants={itemVariants}
      data-ocid={`forums.thread.item.${index}`}
    >
      <Card
        className={cn(
          "border-border hover:shadow-sm transition-all duration-200 group overflow-hidden",
          thread.isPinned && "ring-1 ring-amber-200/60 bg-amber-50/20",
          thread.status === ThreadStatus.archived && "opacity-75",
        )}
      >
        <CardContent className="px-4 py-3.5">
          <div className="flex items-start gap-3">
            <div className="flex-shrink-0 mt-0.5">
              {thread.isPinned ? (
                <div className="w-8 h-8 rounded-lg bg-amber-100 flex items-center justify-center">
                  <Pin size={14} className="text-amber-600 fill-amber-500" />
                </div>
              ) : thread.status === ThreadStatus.locked ? (
                <div className="w-8 h-8 rounded-lg bg-gray-100 flex items-center justify-center">
                  <Lock size={14} className="text-gray-500" />
                </div>
              ) : thread.status === ThreadStatus.archived ? (
                <div className="w-8 h-8 rounded-lg bg-slate-100 flex items-center justify-center">
                  <Archive size={14} className="text-slate-500" />
                </div>
              ) : (
                <div className="w-8 h-8 rounded-lg bg-primary/10 flex items-center justify-center">
                  <MessageCircle size={14} className="text-primary" />
                </div>
              )}
            </div>

            <div className="flex-1 min-w-0">
              <div className="flex flex-wrap items-center gap-1.5 mb-1.5">
                <Badge
                  variant="outline"
                  className={cn("text-[10px] px-1.5 py-0 h-4", catColor)}
                >
                  {CATEGORY_LABELS[thread.category] ?? thread.category}
                </Badge>
                <ThreadStatusBadge thread={thread} />
              </div>

              <Link
                to="/forums/$id"
                params={{ id: String(thread.id) }}
                className="block"
              >
                <h3 className="font-display font-semibold text-sm text-foreground leading-snug group-hover:text-primary transition-colors cursor-pointer line-clamp-2">
                  {thread.title}
                </h3>
              </Link>

              <div className="flex flex-wrap items-center gap-2 mt-1 text-[11px] text-muted-foreground">
                <span className="flex items-center gap-1">
                  <Users size={10} />
                  <span className="font-medium text-foreground/80">
                    {truncatePrincipal(thread.createdBy)}
                  </span>
                </span>
                <span className="text-border">·</span>
                <span className="flex items-center gap-1">
                  <Clock size={10} />
                  {timeAgo(thread.createdAt)}
                </span>
              </div>

              {thread.tags.length > 0 && (
                <div className="flex flex-wrap gap-1 mt-1.5">
                  {thread.tags.slice(0, 3).map((tag) => (
                    <span
                      key={tag}
                      className="flex items-center gap-0.5 text-[10px] bg-secondary text-muted-foreground px-1.5 py-0.5 rounded"
                    >
                      <Tag size={8} />
                      {tag}
                    </span>
                  ))}
                  {thread.tags.length > 3 && (
                    <span className="text-[10px] text-muted-foreground px-1 py-0.5">
                      +{thread.tags.length - 3}
                    </span>
                  )}
                </div>
              )}
            </div>

            <div className="hidden sm:flex flex-col items-end gap-2 flex-shrink-0 min-w-[80px]">
              <div className="flex items-center gap-3 text-[11px] text-muted-foreground">
                <span className="flex items-center gap-1" title="Replies">
                  <MessageCircle size={11} />
                  {Number(thread.replyCount)}
                </span>
                <span className="flex items-center gap-1" title="Views">
                  <Eye size={11} />
                  {Number(thread.viewCount)}
                </span>
              </div>
              <div className="text-[10px] text-muted-foreground text-right">
                <span className="block">Posted</span>
                <span className="font-medium text-foreground/70">
                  {timeAgo(thread.createdAt)}
                </span>
              </div>
            </div>

            <Button
              asChild
              variant="ghost"
              size="sm"
              className="flex-shrink-0 h-8 w-8 p-0 opacity-0 group-hover:opacity-100 transition-opacity self-center"
            >
              <Link to="/forums/$id" params={{ id: String(thread.id) }}>
                <ChevronRight size={15} />
              </Link>
            </Button>
          </div>

          <div className="flex items-center gap-3 mt-2 sm:hidden text-[11px] text-muted-foreground border-t border-border/50 pt-2">
            <span className="flex items-center gap-1">
              <MessageCircle size={11} />
              {Number(thread.replyCount)} replies
            </span>
            <span className="flex items-center gap-1">
              <Eye size={11} />
              {Number(thread.viewCount)}
            </span>
            <span className="ml-auto flex items-center gap-1">
              <Clock size={10} />
              {timeAgo(thread.createdAt)}
            </span>
          </div>
        </CardContent>
      </Card>
    </motion.div>
  );
}

export function ForumsPage() {
  const { user } = useAuth();
  const { t } = useI18n();
  const backend = useBackend();
  const [search, setSearch] = useState("");
  const [activeTab, setActiveTab] = useState<FilterTab>("all");
  const [categoryFilter, setCategoryFilter] = useState<string>("all");
  const [sortBy, setSortBy] = useState<string>("latest");
  const [createOpen, setCreateOpen] = useState(false);

  const [threads, setThreads] = useState<ForumThread[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const canCreate =
    user?.role === "super_admin" ||
    user?.role === "admin" ||
    user?.role === "org_admin" ||
    user?.role === "member" ||
    user?.role === "activist";

  const loadThreads = useCallback(async () => {
    if (!backend) return;
    setLoading(true);
    setError(null);
    try {
      let data: ForumThread[];
      if (categoryFilter !== "all") {
        data = await backend.listThreadsByCategory(
          categoryFilter as ForumCategory,
        );
      } else {
        data = await backend.listThreads();
      }
      setThreads(data);
    } catch (err) {
      console.error(err);
      setError("Failed to load threads. Please try again.");
    } finally {
      setLoading(false);
    }
  }, [backend, categoryFilter]);

  useEffect(() => {
    loadThreads();
  }, [loadThreads]);

  const filtered = threads.filter((thread) => {
    const q = search.toLowerCase();
    const matchesSearch =
      !search ||
      thread.title.toLowerCase().includes(q) ||
      thread.tags.some((tag) => tag.toLowerCase().includes(q));

    const matchesTab =
      activeTab === "all"
        ? thread.status !== ThreadStatus.archived
        : activeTab === "pinned"
          ? thread.isPinned
          : activeTab === "archived"
            ? thread.status === ThreadStatus.archived
            : true;

    return matchesSearch && matchesTab;
  });

  const sorted = [...filtered].sort((a, b) => {
    if (a.isPinned && !b.isPinned) return -1;
    if (!a.isPinned && b.isPinned) return 1;
    switch (sortBy) {
      case "replies":
        return Number(b.replyCount - a.replyCount);
      case "views":
        return Number(b.viewCount - a.viewCount);
      default:
        return Number(b.createdAt - a.createdAt);
    }
  });

  const totalPosts = threads.reduce((s, t) => s + Number(t.replyCount), 0);
  const pinnedCount = threads.filter((t) => t.isPinned).length;
  const archivedCount = threads.filter(
    (t) => t.status === ThreadStatus.archived,
  ).length;

  const categoryCounts = BACKEND_CATEGORIES.map((cat) => ({
    cat,
    count: threads.filter((t) => t.category === cat).length,
  }));

  return (
    <Layout breadcrumb={`${t.sidebar.community} › ${t.forums.title}`}>
      <div className="p-6 max-w-7xl mx-auto">
        {/* Page Header */}
        <motion.div
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3 }}
          className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 mb-6"
        >
          <div>
            <h1 className="text-2xl font-display font-bold text-primary tracking-tight flex items-center gap-2.5">
              <MessageSquare size={22} className="opacity-80" />
              {t.forums.title}
            </h1>
            <p className="text-muted-foreground text-sm mt-1">
              {t.forums.subtitle}
            </p>
            <div className="mt-3 civic-rule w-12" />
          </div>

          {canCreate && (
            <Button
              size="sm"
              className="gap-2 h-9 self-start sm:self-auto flex-shrink-0"
              onClick={() => setCreateOpen(true)}
              data-ocid="forums.new_thread_button"
            >
              <Plus size={14} />
              {t.forums.newThread}
            </Button>
          )}
        </motion.div>

        {/* Stats Bar */}
        <motion.div
          initial={{ opacity: 0, y: 8 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3, delay: 0.04 }}
          className="grid grid-cols-2 sm:grid-cols-4 gap-3 mb-6"
        >
          {[
            {
              label: "Total Threads",
              value: threads.length,
              icon: <MessageSquare size={15} className="text-primary" />,
              bg: "bg-primary/5",
            },
            {
              label: "Total Replies",
              value: totalPosts,
              icon: <MessageCircle size={15} className="text-blue-600" />,
              bg: "bg-blue-50",
            },
            {
              label: "Pinned",
              value: pinnedCount,
              icon: <Pin size={15} className="text-amber-600" />,
              bg: "bg-amber-50",
            },
            {
              label: "Categories",
              value: BACKEND_CATEGORIES.length,
              icon: <Layers size={15} className="text-emerald-600" />,
              bg: "bg-emerald-50",
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

        {/* Main layout */}
        <div className="flex gap-6">
          {/* Category Sidebar (desktop) */}
          <motion.aside
            initial={{ opacity: 0, x: -12 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.3, delay: 0.08 }}
            className="hidden lg:block w-52 flex-shrink-0"
          >
            <div className="bg-card border border-border rounded-xl overflow-hidden">
              <div className="px-3 py-2.5 border-b border-border bg-secondary/30">
                <p className="text-[11px] font-semibold uppercase tracking-widest text-muted-foreground">
                  Categories
                </p>
              </div>
              <div className="py-1">
                <button
                  type="button"
                  onClick={() => setCategoryFilter("all")}
                  className={cn(
                    "w-full flex items-center justify-between px-3 py-2 text-xs transition-colors hover:bg-secondary/50",
                    categoryFilter === "all"
                      ? "font-semibold text-primary bg-primary/5"
                      : "text-foreground/80",
                  )}
                  data-ocid="forums.category.tab"
                >
                  <span>All Categories</span>
                  <span className="text-muted-foreground font-mono">
                    {threads.length}
                  </span>
                </button>
                {categoryCounts.map(({ cat, count }) =>
                  count > 0 ? (
                    <button
                      type="button"
                      key={cat}
                      onClick={() => setCategoryFilter(cat)}
                      className={cn(
                        "w-full flex items-center justify-between px-3 py-2 text-xs transition-colors hover:bg-secondary/50",
                        categoryFilter === cat
                          ? "font-semibold text-primary bg-primary/5"
                          : "text-foreground/80",
                      )}
                      data-ocid="forums.category.tab"
                    >
                      <span className="truncate mr-2">
                        {CATEGORY_LABELS[cat]}
                      </span>
                      <span className="text-muted-foreground font-mono flex-shrink-0">
                        {count}
                      </span>
                    </button>
                  ) : null,
                )}
              </div>
            </div>
          </motion.aside>

          {/* Thread list */}
          <div className="flex-1 min-w-0">
            <motion.div
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.3, delay: 0.07 }}
              className="space-y-3 mb-4"
            >
              <div className="relative">
                <Search
                  size={14}
                  className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground"
                />
                <Input
                  placeholder="Search threads, tags..."
                  className="pl-8 h-9 text-sm"
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                  data-ocid="forums.search_input"
                />
              </div>

              <div className="flex flex-wrap gap-2 items-center">
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
                          count: threads.filter(
                            (t) => t.status !== ThreadStatus.archived,
                          ).length,
                        },
                        {
                          value: "pinned",
                          label: "Pinned",
                          count: pinnedCount,
                        },
                        {
                          value: "archived",
                          label: "Archived",
                          count: archivedCount,
                        },
                      ] as const
                    ).map((tab) => (
                      <TabsTrigger
                        key={tab.value}
                        value={tab.value}
                        className="text-xs px-3"
                        data-ocid="forums.status_filter.tab"
                      >
                        {tab.value === "pinned" && (
                          <Pin size={10} className="mr-1" />
                        )}
                        {tab.value === "archived" && (
                          <Archive size={10} className="mr-1" />
                        )}
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

                <div className="lg:hidden">
                  <Select
                    value={categoryFilter}
                    onValueChange={setCategoryFilter}
                  >
                    <SelectTrigger
                      className="w-40 h-9 text-xs"
                      data-ocid="forums.category.select"
                    >
                      <SelectValue placeholder="Category" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">All Categories</SelectItem>
                      {BACKEND_CATEGORIES.map((cat) => (
                        <SelectItem key={cat} value={cat}>
                          {CATEGORY_LABELS[cat]}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                <Select value={sortBy} onValueChange={setSortBy}>
                  <SelectTrigger
                    className="w-44 h-9 text-xs ml-auto"
                    data-ocid="forums.sort_filter.select"
                  >
                    <SelectValue placeholder="Sort by" />
                  </SelectTrigger>
                  <SelectContent>
                    {SORT_OPTIONS.map((opt) => (
                      <SelectItem key={opt.value} value={opt.value}>
                        {opt.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </motion.div>

            {(search || categoryFilter !== "all") && (
              <p className="text-xs text-muted-foreground mb-3">
                Showing {sorted.length} of {threads.length} threads
              </p>
            )}

            {loading ? (
              <ThreadSkeleton />
            ) : error ? (
              <div
                className="flex flex-col items-center justify-center py-16 text-center"
                data-ocid="forums.error_state"
              >
                <p className="text-sm text-destructive mb-3">{error}</p>
                <Button size="sm" variant="outline" onClick={loadThreads}>
                  Retry
                </Button>
              </div>
            ) : sorted.length === 0 ? (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="flex flex-col items-center justify-center py-20 text-center"
                data-ocid="forums.empty_state"
              >
                <div className="w-16 h-16 rounded-2xl bg-secondary flex items-center justify-center mb-4">
                  <MessageSquare
                    size={24}
                    className="text-muted-foreground/50"
                  />
                </div>
                <h3 className="font-display font-semibold text-foreground mb-1">
                  No threads found
                </h3>
                <p className="text-sm text-muted-foreground max-w-xs">
                  {search
                    ? `No threads match "${search}". Try different keywords.`
                    : "No threads match your current filters."}
                </p>
                {canCreate && (
                  <Button
                    size="sm"
                    className="mt-4 gap-2"
                    onClick={() => setCreateOpen(true)}
                  >
                    <Plus size={13} />
                    Start the First Thread
                  </Button>
                )}
              </motion.div>
            ) : (
              <motion.div
                variants={containerVariants}
                initial="hidden"
                animate="visible"
                className="space-y-2"
              >
                {sorted.map((thread, i) => (
                  <ThreadRow
                    key={String(thread.id)}
                    thread={thread}
                    index={i + 1}
                  />
                ))}
              </motion.div>
            )}
          </div>
        </div>
      </div>

      <RoleGate
        roles={["super_admin", "admin", "org_admin", "member", "activist"]}
      >
        <CreateThreadDialog
          open={createOpen}
          onOpenChange={setCreateOpen}
          onCreated={loadThreads}
          backend={backend}
        />
      </RoleGate>
    </Layout>
  );
}
