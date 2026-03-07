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
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Textarea } from "@/components/ui/textarea";
import { useAuth } from "@/context/AuthContext";
import {
  type ForumCategory,
  MOCK_FORUM_THREADS,
  type OrgRegion,
  getForumCategoryColor,
} from "@/data/mockData";
import { cn } from "@/lib/utils";
import { Link } from "@tanstack/react-router";
import {
  Archive,
  ChevronRight,
  Clock,
  Eye,
  Globe,
  Layers,
  Lock,
  MessageCircle,
  MessageSquare,
  Pin,
  Plus,
  Search,
  Tag,
  ThumbsUp,
  Users,
} from "lucide-react";
import type { Variants } from "motion/react";
import { motion } from "motion/react";
import { useState } from "react";

const containerVariants: Variants = {
  hidden: { opacity: 0 },
  visible: { opacity: 1, transition: { staggerChildren: 0.05 } },
};

const itemVariants: Variants = {
  hidden: { opacity: 0, y: 16 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.28 } },
};

type FilterTab = "all" | "pinned" | "archived" | "myregion";

const FORUM_CATEGORIES: ForumCategory[] = [
  "General Discussion",
  "Climate & Environment",
  "Digital Rights",
  "Labor & Economic Justice",
  "Democracy & Elections",
  "Women's Rights",
  "Youth & Education",
  "Peace & Diplomacy",
  "Org Announcements",
  "Regional News",
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

const SORT_OPTIONS = [
  { value: "latest", label: "Latest Activity" },
  { value: "replies", label: "Most Replies" },
  { value: "views", label: "Most Views" },
  { value: "upvotes", label: "Most Upvoted" },
];

function timeAgo(dateStr: string): string {
  const diff = Date.now() - new Date(dateStr).getTime();
  const mins = Math.floor(diff / 60000);
  const hours = Math.floor(diff / 3600000);
  const days = Math.floor(diff / 86400000);
  if (days >= 7) return `${Math.floor(days / 7)}w ago`;
  if (days >= 1) return `${days}d ago`;
  if (hours >= 1) return `${hours}h ago`;
  return `${mins}m ago`;
}

function CreateThreadDialog({
  open,
  onOpenChange,
}: {
  open: boolean;
  onOpenChange: (v: boolean) => void;
}) {
  const [title, setTitle] = useState("");
  const [category, setCategory] = useState<string>("");
  const [content, setContent] = useState("");
  const [tags, setTags] = useState("");
  const [saving, setSaving] = useState(false);

  function handleSubmit() {
    if (!title.trim() || !category || !content.trim()) return;
    setSaving(true);
    setTimeout(() => {
      setSaving(false);
      onOpenChange(false);
      setTitle("");
      setCategory("");
      setContent("");
      setTags("");
    }, 1000);
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent
        className="sm:max-w-2xl max-h-[90vh] overflow-y-auto"
        data-ocid="forums.new_thread.modal"
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
              <SelectTrigger data-ocid="forums.new_thread.select">
                <SelectValue placeholder="Select a category" />
              </SelectTrigger>
              <SelectContent>
                {FORUM_CATEGORIES.map((cat) => (
                  <SelectItem key={cat} value={cat}>
                    {cat}
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
              data-ocid="forums.new_thread.input"
            />
          </div>
        </div>

        <DialogFooter className="gap-2">
          <Button
            variant="outline"
            onClick={() => onOpenChange(false)}
            data-ocid="forums.new_thread.cancel_button"
          >
            Cancel
          </Button>
          <Button
            onClick={handleSubmit}
            disabled={!title.trim() || !category || !content.trim() || saving}
            data-ocid="forums.new_thread.submit_button"
          >
            {saving ? "Posting..." : "Post Thread"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}

function ThreadStatusBadge({
  thread,
}: { thread: (typeof MOCK_FORUM_THREADS)[0] }) {
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
  if (thread.isLocked || thread.status === "locked") {
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
  if (thread.status === "archived") {
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
  thread: (typeof MOCK_FORUM_THREADS)[0];
  index: number;
}) {
  const catColor = getForumCategoryColor(thread.category);

  return (
    <motion.div
      variants={itemVariants}
      data-ocid={`forums.thread.item.${index}`}
    >
      <Card
        className={cn(
          "border-border hover:shadow-sm transition-all duration-200 group overflow-hidden",
          thread.isPinned && "ring-1 ring-amber-200/60 bg-amber-50/20",
          thread.status === "archived" && "opacity-75",
        )}
      >
        <CardContent className="px-4 py-3.5">
          <div className="flex items-start gap-3">
            {/* Status icon column */}
            <div className="flex-shrink-0 mt-0.5">
              {thread.isPinned ? (
                <div className="w-8 h-8 rounded-lg bg-amber-100 flex items-center justify-center">
                  <Pin size={14} className="text-amber-600 fill-amber-500" />
                </div>
              ) : thread.isLocked ? (
                <div className="w-8 h-8 rounded-lg bg-gray-100 flex items-center justify-center">
                  <Lock size={14} className="text-gray-500" />
                </div>
              ) : thread.status === "archived" ? (
                <div className="w-8 h-8 rounded-lg bg-slate-100 flex items-center justify-center">
                  <Archive size={14} className="text-slate-500" />
                </div>
              ) : (
                <div className="w-8 h-8 rounded-lg bg-primary/10 flex items-center justify-center">
                  <MessageCircle size={14} className="text-primary" />
                </div>
              )}
            </div>

            {/* Main content */}
            <div className="flex-1 min-w-0">
              {/* Top row: category + status badges */}
              <div className="flex flex-wrap items-center gap-1.5 mb-1.5">
                <Badge
                  variant="outline"
                  className={cn("text-[10px] px-1.5 py-0 h-4", catColor)}
                >
                  {thread.category}
                </Badge>
                <ThreadStatusBadge thread={thread} />
              </div>

              {/* Title */}
              <Link
                to="/forums/$id"
                params={{ id: thread.id }}
                className="block"
              >
                <h3 className="font-display font-semibold text-sm text-foreground leading-snug group-hover:text-primary transition-colors cursor-pointer line-clamp-2">
                  {thread.title}
                </h3>
              </Link>

              {/* Author + meta row */}
              <div className="flex flex-wrap items-center gap-2 mt-1 text-[11px] text-muted-foreground">
                <span className="flex items-center gap-1">
                  <Users size={10} />
                  <span className="font-medium text-foreground/80">
                    {thread.authorName}
                  </span>
                </span>
                <span className="text-border">·</span>
                <span className="flex items-center gap-1">
                  <Globe size={10} />
                  {thread.organization}
                </span>
                <span className="text-border">·</span>
                <span className="flex items-center gap-1">
                  <Clock size={10} />
                  {timeAgo(thread.createdAt)}
                </span>
              </div>

              {/* Tags */}
              {thread.tags.length > 0 && (
                <div className="flex flex-wrap gap-1 mt-1.5">
                  {thread.tags.slice(0, 2).map((tag) => (
                    <span
                      key={tag}
                      className="flex items-center gap-0.5 text-[10px] bg-secondary text-muted-foreground px-1.5 py-0.5 rounded"
                    >
                      <Tag size={8} />
                      {tag}
                    </span>
                  ))}
                  {thread.tags.length > 2 && (
                    <span className="text-[10px] text-muted-foreground px-1 py-0.5">
                      +{thread.tags.length - 2}
                    </span>
                  )}
                </div>
              )}
            </div>

            {/* Right: Stats + Last activity */}
            <div className="hidden sm:flex flex-col items-end gap-2 flex-shrink-0 min-w-[100px]">
              <div className="flex items-center gap-3 text-[11px] text-muted-foreground">
                <span className="flex items-center gap-1" title="Replies">
                  <MessageCircle size={11} />
                  {thread.replyCount}
                </span>
                <span className="flex items-center gap-1" title="Views">
                  <Eye size={11} />
                  {thread.viewCount}
                </span>
                <span className="flex items-center gap-1" title="Upvotes">
                  <ThumbsUp size={11} />
                  {thread.upvoteCount}
                </span>
              </div>
              <div className="text-[10px] text-muted-foreground text-right">
                <span className="block">Last reply</span>
                <span className="font-medium text-foreground/70">
                  {timeAgo(thread.lastActivityAt)}
                </span>
              </div>
            </div>

            {/* Arrow */}
            <Button
              asChild
              variant="ghost"
              size="sm"
              className="flex-shrink-0 h-8 w-8 p-0 opacity-0 group-hover:opacity-100 transition-opacity self-center"
            >
              <Link to="/forums/$id" params={{ id: thread.id }}>
                <ChevronRight size={15} />
              </Link>
            </Button>
          </div>

          {/* Mobile stats row */}
          <div className="flex items-center gap-3 mt-2 sm:hidden text-[11px] text-muted-foreground border-t border-border/50 pt-2">
            <span className="flex items-center gap-1">
              <MessageCircle size={11} />
              {thread.replyCount} replies
            </span>
            <span className="flex items-center gap-1">
              <Eye size={11} />
              {thread.viewCount}
            </span>
            <span className="flex items-center gap-1">
              <ThumbsUp size={11} />
              {thread.upvoteCount}
            </span>
            <span className="ml-auto flex items-center gap-1">
              <Clock size={10} />
              {timeAgo(thread.lastActivityAt)}
            </span>
          </div>
        </CardContent>
      </Card>
    </motion.div>
  );
}

export function ForumsPage() {
  const { user } = useAuth();
  const [search, setSearch] = useState("");
  const [activeTab, setActiveTab] = useState<FilterTab>("all");
  const [categoryFilter, setCategoryFilter] = useState<string>("all");
  const [regionFilter, setRegionFilter] = useState<string>("all");
  const [sortBy, setSortBy] = useState<string>("latest");
  const [createOpen, setCreateOpen] = useState(false);

  const canCreate =
    user?.role === "super_admin" ||
    user?.role === "admin" ||
    user?.role === "org_admin" ||
    user?.role === "member" ||
    user?.role === "activist";

  // Filter logic
  const filtered = MOCK_FORUM_THREADS.filter((t) => {
    const q = search.toLowerCase();
    const matchesSearch =
      !search ||
      t.title.toLowerCase().includes(q) ||
      t.content.toLowerCase().includes(q) ||
      t.tags.some((tag) => tag.toLowerCase().includes(q)) ||
      t.authorName.toLowerCase().includes(q);

    const matchesTab =
      activeTab === "all"
        ? true
        : activeTab === "pinned"
          ? t.isPinned
          : activeTab === "archived"
            ? t.status === "archived"
            : activeTab === "myregion"
              ? t.region === user?.organization
              : true;

    const matchesCat =
      categoryFilter === "all" || t.category === categoryFilter;
    const matchesRegion = regionFilter === "all" || t.region === regionFilter;

    return matchesSearch && matchesTab && matchesCat && matchesRegion;
  });

  // Sort: pinned threads always at top, then apply sort
  const sorted = [...filtered].sort((a, b) => {
    if (a.isPinned && !b.isPinned) return -1;
    if (!a.isPinned && b.isPinned) return 1;
    switch (sortBy) {
      case "replies":
        return b.replyCount - a.replyCount;
      case "views":
        return b.viewCount - a.viewCount;
      case "upvotes":
        return b.upvoteCount - a.upvoteCount;
      default: // latest
        return (
          new Date(b.lastActivityAt).getTime() -
          new Date(a.lastActivityAt).getTime()
        );
    }
  });

  // Stats
  const totalPosts = MOCK_FORUM_THREADS.reduce((s, t) => s + t.replyCount, 0);
  const uniqueAuthors = new Set(MOCK_FORUM_THREADS.map((t) => t.authorId)).size;
  const pinnedCount = MOCK_FORUM_THREADS.filter((t) => t.isPinned).length;

  // Category counts
  const categoryCounts = FORUM_CATEGORIES.map((cat) => ({
    cat,
    count: MOCK_FORUM_THREADS.filter((t) => t.category === cat).length,
  }));

  return (
    <Layout breadcrumb="Community › Forums">
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
              <MessageSquare size={22} className="opacity-80" />
              Community Forums
            </h1>
            <p className="text-muted-foreground text-sm mt-1">
              Open discussions with activists, organizers, and civic leaders
              worldwide.
            </p>
            <div className="mt-3 civic-rule w-12" />
          </div>

          {canCreate && (
            <Button
              size="sm"
              className="gap-2 h-9 self-start sm:self-auto flex-shrink-0"
              onClick={() => setCreateOpen(true)}
              data-ocid="forums.new_thread.open_modal_button"
            >
              <Plus size={14} />
              New Thread
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
              label: "Total Threads",
              value: MOCK_FORUM_THREADS.length,
              icon: <MessageSquare size={15} className="text-primary" />,
              bg: "bg-primary/5",
            },
            {
              label: "Total Posts",
              value: totalPosts,
              icon: <MessageCircle size={15} className="text-blue-600" />,
              bg: "bg-blue-50",
            },
            {
              label: "Active Members",
              value: uniqueAuthors,
              icon: <Users size={15} className="text-emerald-600" />,
              bg: "bg-emerald-50",
            },
            {
              label: "Categories",
              value: FORUM_CATEGORIES.length,
              icon: <Layers size={15} className="text-amber-600" />,
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

        {/* ── Main layout: sidebar + thread list ── */}
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
                >
                  <span>All Categories</span>
                  <span className="text-muted-foreground font-mono">
                    {MOCK_FORUM_THREADS.length}
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
                    >
                      <span className="truncate mr-2">{cat}</span>
                      <span className="text-muted-foreground font-mono flex-shrink-0">
                        {count}
                      </span>
                    </button>
                  ) : null,
                )}
              </div>
            </div>
          </motion.aside>

          {/* Thread list column */}
          <div className="flex-1 min-w-0">
            {/* ── Search + Filter Bar ── */}
            <motion.div
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.3, delay: 0.07 }}
              className="space-y-3 mb-4"
            >
              {/* Row 1: Search */}
              <div className="relative">
                <Search
                  size={14}
                  className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground"
                />
                <Input
                  placeholder="Search threads, authors, tags..."
                  className="pl-8 h-9 text-sm"
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                  data-ocid="forums.search_input"
                />
              </div>

              {/* Row 2: Tabs + Filters */}
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
                          count: MOCK_FORUM_THREADS.filter(
                            (t) => t.status !== "archived",
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
                          count: MOCK_FORUM_THREADS.filter(
                            (t) => t.status === "archived",
                          ).length,
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

                {/* Mobile category filter */}
                <div className="lg:hidden">
                  <Select
                    value={categoryFilter}
                    onValueChange={setCategoryFilter}
                  >
                    <SelectTrigger
                      className="w-40 h-9 text-xs"
                      data-ocid="forums.category_filter.select"
                    >
                      <SelectValue placeholder="Category" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">All Categories</SelectItem>
                      {FORUM_CATEGORIES.map((cat) => (
                        <SelectItem key={cat} value={cat}>
                          {cat}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                <Select value={regionFilter} onValueChange={setRegionFilter}>
                  <SelectTrigger
                    className="w-36 h-9 text-xs"
                    data-ocid="forums.region_filter.select"
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

            {/* Results count */}
            {(search || categoryFilter !== "all" || regionFilter !== "all") && (
              <p className="text-xs text-muted-foreground mb-3">
                Showing {sorted.length} of {MOCK_FORUM_THREADS.length} threads
              </p>
            )}

            {/* ── Thread List ── */}
            {sorted.length === 0 ? (
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
                  <ThreadRow key={thread.id} thread={thread} index={i + 1} />
                ))}
              </motion.div>
            )}
          </div>
        </div>
      </div>

      {/* Create Thread Modal */}
      <RoleGate
        roles={["super_admin", "admin", "org_admin", "member", "activist"]}
      >
        <CreateThreadDialog open={createOpen} onOpenChange={setCreateOpen} />
      </RoleGate>
    </Layout>
  );
}
