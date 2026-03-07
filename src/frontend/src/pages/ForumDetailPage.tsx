import { Layout } from "@/components/Layout";
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
import { Separator } from "@/components/ui/separator";
import { Textarea } from "@/components/ui/textarea";
import { useAuth } from "@/context/AuthContext";
import {
  type MockForumPost,
  type MockForumThread,
  getForumCategoryColor,
  getForumThreadById,
  getPostsByThreadId,
} from "@/data/mockData";
import { cn } from "@/lib/utils";
import { Link, useParams } from "@tanstack/react-router";
import {
  Archive,
  ArrowLeft,
  ChevronRight,
  Clock,
  Eye,
  Globe,
  Lock,
  MessageCircle,
  MessageSquare,
  Pin,
  ShieldAlert,
  ThumbsUp,
  Users,
} from "lucide-react";
import type { Variants } from "motion/react";
import { motion } from "motion/react";
import { useState } from "react";

const containerVariants: Variants = {
  hidden: { opacity: 0 },
  visible: { opacity: 1, transition: { staggerChildren: 0.06 } },
};

const itemVariants: Variants = {
  hidden: { opacity: 0, y: 12 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.28 } },
};

function timeAgo(dateStr: string): string {
  const diff = Date.now() - new Date(dateStr).getTime();
  const mins = Math.floor(diff / 60000);
  const hours = Math.floor(diff / 3600000);
  const days = Math.floor(diff / 86400000);
  if (days >= 7) return `${Math.floor(days / 7)}w ago`;
  if (days >= 1) return `${days}d ago`;
  if (hours >= 1) return `${hours}h ago`;
  if (mins >= 1) return `${mins}m ago`;
  return "just now";
}

function formatDateTime(dateStr: string): string {
  return new Date(dateStr).toLocaleDateString("en-US", {
    year: "numeric",
    month: "long",
    day: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  });
}

function getRoleLabel(role: string): string {
  switch (role) {
    case "super_admin":
      return "Super Admin";
    case "admin":
      return "Admin";
    case "org_admin":
      return "Org Admin";
    case "activist":
      return "Activist";
    case "member":
      return "Member";
    default:
      return "Guest";
  }
}

function getRoleBadgeClasses(role: string): string {
  switch (role) {
    case "super_admin":
    case "admin":
      return "bg-red-50 text-red-700 border-red-200";
    case "org_admin":
      return "bg-amber-50 text-amber-700 border-amber-200";
    case "activist":
      return "bg-blue-50 text-blue-700 border-blue-200";
    default:
      return "bg-gray-50 text-gray-600 border-gray-200";
  }
}

function getInitials(name: string): string {
  return name
    .split(" ")
    .map((n) => n[0])
    .join("")
    .toUpperCase()
    .slice(0, 2);
}

function AuthorAvatar({
  name,
  size = "sm",
}: {
  name: string;
  size?: "sm" | "md";
}) {
  const colors = [
    "bg-blue-100 text-blue-700",
    "bg-emerald-100 text-emerald-700",
    "bg-purple-100 text-purple-700",
    "bg-amber-100 text-amber-700",
    "bg-rose-100 text-rose-700",
    "bg-teal-100 text-teal-700",
    "bg-indigo-100 text-indigo-700",
    "bg-orange-100 text-orange-700",
  ];
  const colorIndex = name.charCodeAt(0) % colors.length;
  const colorClass = colors[colorIndex];
  const sizeClass = size === "md" ? "w-10 h-10 text-sm" : "w-8 h-8 text-xs";

  return (
    <div
      className={cn(
        "rounded-full flex items-center justify-center font-bold flex-shrink-0",
        sizeClass,
        colorClass,
      )}
    >
      {getInitials(name)}
    </div>
  );
}

function PostCard({
  post,
  index,
}: {
  post: MockForumPost;
  index: number;
}) {
  const [upvoted, setUpvoted] = useState(false);
  const [upvoteCount, setUpvoteCount] = useState(post.upvoteCount);

  function handleUpvote() {
    if (upvoted) {
      setUpvoted(false);
      setUpvoteCount((c) => c - 1);
    } else {
      setUpvoted(true);
      setUpvoteCount((c) => c + 1);
    }
  }

  return (
    <motion.div
      variants={itemVariants}
      data-ocid={`forum_detail.post.item.${index}`}
    >
      <div
        className={cn(
          "rounded-xl border p-4",
          post.isModeratorNote
            ? "border-amber-200 bg-amber-50/60"
            : "border-border bg-card",
        )}
      >
        {post.isModeratorNote && (
          <div className="flex items-center gap-2 mb-3 pb-2 border-b border-amber-200">
            <ShieldAlert size={13} className="text-amber-600" />
            <span className="text-[11px] font-semibold text-amber-700 uppercase tracking-wide">
              Moderator Note
            </span>
          </div>
        )}

        <div className="flex items-start gap-3">
          <AuthorAvatar name={post.authorName} size="sm" />

          <div className="flex-1 min-w-0">
            <div className="flex flex-wrap items-center gap-2 mb-2">
              <span className="text-sm font-semibold text-foreground">
                {post.authorName}
              </span>
              <Badge
                variant="outline"
                className={cn(
                  "text-[10px] px-1.5 py-0 h-4",
                  getRoleBadgeClasses(post.authorRole),
                )}
              >
                {getRoleLabel(post.authorRole)}
              </Badge>
              <span className="text-[11px] text-muted-foreground">
                {post.authorOrganization}
              </span>
              <span className="text-[11px] text-muted-foreground ml-auto flex items-center gap-1">
                <Clock size={10} />
                {timeAgo(post.createdAt)}
              </span>
            </div>

            <p className="text-sm text-foreground leading-relaxed">
              {post.content}
            </p>

            <div className="flex items-center gap-3 mt-3 pt-2 border-t border-border/50">
              <Button
                variant="ghost"
                size="sm"
                className={cn(
                  "h-7 gap-1.5 text-xs px-2",
                  upvoted
                    ? "text-primary bg-primary/10 hover:bg-primary/15"
                    : "text-muted-foreground hover:text-primary",
                )}
                onClick={handleUpvote}
                data-ocid={`forum_detail.upvote_button.${index}`}
              >
                <ThumbsUp size={12} className={upvoted ? "fill-primary" : ""} />
                <span>{upvoteCount}</span>
              </Button>
              <span className="text-[10px] text-muted-foreground ml-auto">
                {formatDateTime(post.createdAt)}
              </span>
            </div>
          </div>
        </div>
      </div>
    </motion.div>
  );
}

function ThreadNotFound() {
  return (
    <Layout breadcrumb="Forums › Not Found">
      <div
        className="p-6 flex flex-col items-center justify-center py-24 text-center"
        data-ocid="forum_detail.error_state"
      >
        <div className="w-16 h-16 rounded-2xl bg-secondary flex items-center justify-center mb-4">
          <MessageSquare size={24} className="text-muted-foreground/50" />
        </div>
        <h3 className="font-display font-bold text-xl text-foreground mb-2">
          Thread Not Found
        </h3>
        <p className="text-sm text-muted-foreground mb-6 max-w-xs">
          This thread doesn't exist or may have been removed.
        </p>
        <Button asChild variant="outline">
          <Link to="/forums" data-ocid="forum_detail.back_link">
            <ArrowLeft size={14} className="mr-2" />
            Back to Forums
          </Link>
        </Button>
      </div>
    </Layout>
  );
}

export function ForumDetailPage() {
  const { id } = useParams({ strict: false }) as { id?: string };
  const { user } = useAuth();

  // Local mock state for moderation
  const originalThread = id ? getForumThreadById(id) : null;
  const [isPinned, setIsPinned] = useState(originalThread?.isPinned ?? false);
  const [isLocked, setIsLocked] = useState(originalThread?.isLocked ?? false);
  const [isArchived, setIsArchived] = useState(
    originalThread?.status === "archived",
  );
  const [archiveDialogOpen, setArchiveDialogOpen] = useState(false);

  // Reply state
  const [replyContent, setReplyContent] = useState("");
  const [replySending, setReplySending] = useState(false);
  const [replySuccess, setReplySuccess] = useState(false);

  // Opening post upvote
  const [threadUpvoted, setThreadUpvoted] = useState(false);
  const [threadUpvoteCount, setThreadUpvoteCount] = useState(
    originalThread?.upvoteCount ?? 0,
  );

  if (!originalThread) {
    return <ThreadNotFound />;
  }

  const thread: MockForumThread = {
    ...originalThread,
    isPinned,
    isLocked,
    status: isArchived
      ? "archived"
      : isPinned
        ? "pinned"
        : originalThread.status,
  };

  const posts = getPostsByThreadId(thread.id);
  const catColor = getForumCategoryColor(thread.category);

  const isAdminRole =
    user?.role === "super_admin" ||
    user?.role === "admin" ||
    user?.role === "org_admin";

  function handleReply() {
    if (!replyContent.trim()) return;
    setReplySending(true);
    setTimeout(() => {
      setReplySending(false);
      setReplySuccess(true);
      setReplyContent("");
      setTimeout(() => setReplySuccess(false), 3000);
    }, 1000);
  }

  function handleArchiveConfirm() {
    setIsArchived(true);
    setIsLocked(true);
    setArchiveDialogOpen(false);
  }

  function handleThreadUpvote() {
    if (threadUpvoted) {
      setThreadUpvoted(false);
      setThreadUpvoteCount((c) => c - 1);
    } else {
      setThreadUpvoted(true);
      setThreadUpvoteCount((c) => c + 1);
    }
  }

  return (
    <Layout breadcrumb={`Forums › ${thread.category} › ${thread.title}`}>
      <div className="max-w-5xl mx-auto px-4 sm:px-6 py-6">
        {/* ── Back link + breadcrumb ── */}
        <motion.div
          initial={{ opacity: 0, y: -8 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.25 }}
          className="flex items-center gap-1 text-xs text-muted-foreground mb-5"
        >
          <Link
            to="/forums"
            className="flex items-center gap-1 hover:text-primary transition-colors font-medium"
            data-ocid="forum_detail.back_link"
          >
            <ArrowLeft size={12} />
            Forums
          </Link>
          <ChevronRight size={11} className="text-border" />
          <span
            className={cn(
              "px-1.5 py-0.5 rounded text-[10px] font-medium border",
              catColor,
            )}
          >
            {thread.category}
          </span>
          <ChevronRight size={11} className="text-border" />
          <span className="truncate max-w-xs text-foreground/70">
            {thread.title}
          </span>
        </motion.div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* ── Main content column ── */}
          <div className="lg:col-span-2 space-y-4">
            {/* Thread header card */}
            <motion.div
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.3 }}
            >
              <Card
                className={cn(
                  "overflow-hidden",
                  thread.isPinned && "ring-1 ring-amber-200/60",
                  isArchived && "opacity-80",
                )}
              >
                {/* Status header bar */}
                {(isArchived || isLocked || thread.isPinned) && (
                  <div
                    className={cn(
                      "px-4 py-2 flex items-center gap-2 text-xs font-medium",
                      isArchived
                        ? "bg-slate-50 text-slate-600 border-b border-slate-200"
                        : isLocked
                          ? "bg-gray-50 text-gray-600 border-b border-gray-200"
                          : "bg-amber-50 text-amber-700 border-b border-amber-200",
                    )}
                  >
                    {isArchived ? (
                      <>
                        <Archive size={13} /> This thread has been archived.
                      </>
                    ) : isLocked ? (
                      <>
                        <Lock size={13} /> This thread is locked. No new replies
                        can be posted.
                      </>
                    ) : (
                      <>
                        <Pin size={13} className="fill-amber-500" /> Pinned
                        thread
                      </>
                    )}
                  </div>
                )}

                <CardContent className="px-5 py-5">
                  {/* Title + badges */}
                  <div className="flex flex-wrap gap-2 mb-3">
                    <Badge
                      variant="outline"
                      className={cn("text-[10px] px-2 py-0.5 h-5", catColor)}
                    >
                      {thread.category}
                    </Badge>
                    {isArchived && (
                      <Badge
                        variant="outline"
                        className="text-[10px] px-2 py-0.5 h-5 bg-slate-50 text-slate-500 border-slate-200"
                      >
                        <Archive size={9} className="mr-1" />
                        Archived
                      </Badge>
                    )}
                    {isLocked && !isArchived && (
                      <Badge
                        variant="outline"
                        className="text-[10px] px-2 py-0.5 h-5 bg-gray-50 text-gray-600 border-gray-200"
                      >
                        <Lock size={9} className="mr-1" />
                        Locked
                      </Badge>
                    )}
                    {thread.isPinned && (
                      <Badge
                        variant="outline"
                        className="text-[10px] px-2 py-0.5 h-5 bg-amber-50 text-amber-700 border-amber-200"
                      >
                        <Pin size={9} className="mr-1 fill-amber-500" />
                        Pinned
                      </Badge>
                    )}
                  </div>

                  <h1 className="text-xl font-display font-bold text-foreground leading-snug mb-3">
                    {thread.title}
                  </h1>

                  {/* Author info + stats */}
                  <div className="flex flex-wrap items-center gap-3 mb-4 pb-4 border-b border-border/60 text-xs text-muted-foreground">
                    <div className="flex items-center gap-2">
                      <AuthorAvatar name={thread.authorName} size="sm" />
                      <div>
                        <span className="font-semibold text-foreground/90">
                          {thread.authorName}
                        </span>
                        <span className="mx-1.5">·</span>
                        <span className="flex items-center gap-1 inline-flex">
                          <Globe size={10} />
                          {thread.organization}
                        </span>
                      </div>
                    </div>
                    <span className="flex items-center gap-1">
                      <Clock size={10} />
                      {timeAgo(thread.createdAt)}
                    </span>

                    {/* Stats */}
                    <div className="ml-auto flex items-center gap-3">
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
                        {threadUpvoteCount}
                      </span>
                    </div>
                  </div>

                  {/* Opening post content */}
                  <p className="text-sm text-foreground leading-relaxed whitespace-pre-line">
                    {thread.content}
                  </p>

                  {/* Tags */}
                  {thread.tags.length > 0 && (
                    <div className="flex flex-wrap gap-1.5 mt-4">
                      {thread.tags.map((tag) => (
                        <span
                          key={tag}
                          className="text-[10px] bg-secondary text-muted-foreground px-2 py-0.5 rounded"
                        >
                          #{tag}
                        </span>
                      ))}
                    </div>
                  )}

                  {/* Opening post actions */}
                  <div className="flex items-center gap-2 mt-4 pt-3 border-t border-border/50">
                    <Button
                      variant="ghost"
                      size="sm"
                      className={cn(
                        "h-7 gap-1.5 text-xs px-2",
                        threadUpvoted
                          ? "text-primary bg-primary/10 hover:bg-primary/15"
                          : "text-muted-foreground hover:text-primary",
                      )}
                      onClick={handleThreadUpvote}
                      data-ocid="forum_detail.upvote_button.1"
                    >
                      <ThumbsUp
                        size={12}
                        className={threadUpvoted ? "fill-primary" : ""}
                      />
                      <span>{threadUpvoteCount}</span>
                    </Button>

                    {/* Moderation toolbar */}
                    {isAdminRole && (
                      <div className="ml-auto flex items-center gap-2">
                        <Button
                          variant="outline"
                          size="sm"
                          className={cn(
                            "h-7 text-xs gap-1.5",
                            isPinned
                              ? "border-amber-300 text-amber-700 hover:bg-amber-50"
                              : "border-border",
                          )}
                          onClick={() => setIsPinned(!isPinned)}
                          data-ocid="forum_detail.pin_button"
                        >
                          <Pin
                            size={11}
                            className={isPinned ? "fill-amber-500" : ""}
                          />
                          {isPinned ? "Unpin" : "Pin"}
                        </Button>
                        <Button
                          variant="outline"
                          size="sm"
                          className={cn(
                            "h-7 text-xs gap-1.5",
                            isLocked
                              ? "border-gray-400 text-gray-700 hover:bg-gray-50"
                              : "border-border",
                          )}
                          onClick={() => setIsLocked(!isLocked)}
                          data-ocid="forum_detail.lock_button"
                        >
                          <Lock size={11} />
                          {isLocked ? "Unlock" : "Lock"}
                        </Button>
                        {!isArchived && (
                          <Button
                            variant="outline"
                            size="sm"
                            className="h-7 text-xs gap-1.5 border-slate-300 text-slate-600 hover:bg-slate-50"
                            onClick={() => setArchiveDialogOpen(true)}
                            data-ocid="forum_detail.archive_button"
                          >
                            <Archive size={11} />
                            Archive
                          </Button>
                        )}
                      </div>
                    )}
                  </div>
                </CardContent>
              </Card>
            </motion.div>

            {/* ── Replies Section ── */}
            {posts.length > 0 && (
              <div>
                <div className="flex items-center gap-2 mb-3">
                  <MessageCircle size={15} className="text-primary" />
                  <h2 className="font-display font-semibold text-sm text-foreground">
                    {posts.length} {posts.length === 1 ? "Reply" : "Replies"}
                  </h2>
                  <Separator className="flex-1" />
                </div>

                <motion.div
                  variants={containerVariants}
                  initial="hidden"
                  animate="visible"
                  className="space-y-3"
                >
                  {posts.map((post, i) => (
                    <PostCard key={post.id} post={post} index={i + 1} />
                  ))}
                </motion.div>
              </div>
            )}

            {posts.length === 0 && (
              <div
                className="text-center py-10 text-muted-foreground text-sm rounded-xl border border-border/50 bg-secondary/20"
                data-ocid="forum_detail.replies.empty_state"
              >
                <MessageCircle
                  size={20}
                  className="mx-auto mb-2 text-muted-foreground/40"
                />
                No replies yet. Be the first to respond.
              </div>
            )}

            {/* ── Reply Form ── */}
            <motion.div
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.3, delay: 0.2 }}
            >
              {isLocked || isArchived ? (
                <div className="rounded-xl border border-border bg-secondary/30 px-5 py-4 flex items-center gap-3">
                  {isArchived ? (
                    <Archive
                      size={16}
                      className="text-muted-foreground flex-shrink-0"
                    />
                  ) : (
                    <Lock
                      size={16}
                      className="text-muted-foreground flex-shrink-0"
                    />
                  )}
                  <p className="text-sm text-muted-foreground">
                    {isArchived
                      ? "This thread is archived. No new replies can be posted."
                      : "This thread is locked. No new replies can be posted."}
                  </p>
                </div>
              ) : !user || user.role === "guest" ? (
                <div className="rounded-xl border border-border bg-secondary/20 px-5 py-4 flex items-center justify-between gap-4">
                  <p className="text-sm text-muted-foreground">
                    You must be logged in to reply.
                  </p>
                  <Button
                    asChild
                    size="sm"
                    className="h-8 text-xs flex-shrink-0"
                  >
                    <Link to="/login">Log in to reply</Link>
                  </Button>
                </div>
              ) : (
                <Card>
                  <CardHeader className="pb-2 pt-4 px-5">
                    <CardTitle className="text-sm font-semibold flex items-center gap-2">
                      <MessageSquare size={14} className="text-primary" />
                      Post a Reply
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="px-5 pb-4 space-y-3">
                    <div className="flex items-start gap-3">
                      <AuthorAvatar name={user.name} size="sm" />
                      <div className="flex-1">
                        <Textarea
                          placeholder="Share your thoughts on this discussion..."
                          rows={4}
                          value={replyContent}
                          onChange={(e) => setReplyContent(e.target.value)}
                          className="resize-none"
                          data-ocid="forum_detail.reply.textarea"
                        />
                      </div>
                    </div>

                    <div className="flex items-center justify-between">
                      {replySuccess && (
                        <p className="text-xs text-emerald-600 font-medium flex items-center gap-1">
                          ✓ Reply posted successfully
                        </p>
                      )}
                      <div className="ml-auto">
                        <Button
                          size="sm"
                          disabled={!replyContent.trim() || replySending}
                          onClick={handleReply}
                          className="h-8 text-xs gap-1.5"
                          data-ocid="forum_detail.reply.submit_button"
                        >
                          {replySending ? "Posting..." : "Post Reply"}
                        </Button>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              )}
            </motion.div>
          </div>

          {/* ── Activity Sidebar (desktop) ── */}
          <aside className="hidden lg:block space-y-4">
            {/* Thread info */}
            <motion.div
              initial={{ opacity: 0, x: 12 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.3, delay: 0.1 }}
            >
              <Card>
                <CardHeader className="pb-2 pt-4 px-4">
                  <CardTitle className="text-sm font-semibold flex items-center gap-2">
                    <Users size={13} className="text-blue-600" />
                    Thread Info
                  </CardTitle>
                </CardHeader>
                <CardContent className="px-4 pb-4 space-y-2.5">
                  {[
                    {
                      label: "Author",
                      value: thread.authorName,
                      icon: <Users size={11} />,
                    },
                    {
                      label: "Organization",
                      value: thread.organization,
                      icon: <Globe size={11} />,
                    },
                    {
                      label: "Region",
                      value: thread.region,
                      icon: <Globe size={11} />,
                    },
                    {
                      label: "Posted",
                      value: new Date(thread.createdAt).toLocaleDateString(
                        "en-US",
                        { month: "short", day: "numeric", year: "numeric" },
                      ),
                      icon: <Clock size={11} />,
                    },
                    {
                      label: "Replies",
                      value: thread.replyCount,
                      icon: <MessageCircle size={11} />,
                    },
                    {
                      label: "Views",
                      value: thread.viewCount.toLocaleString(),
                      icon: <Eye size={11} />,
                    },
                  ].map((item) => (
                    <div
                      key={item.label}
                      className="flex items-center justify-between text-xs"
                    >
                      <span className="flex items-center gap-1.5 text-muted-foreground">
                        {item.icon}
                        {item.label}
                      </span>
                      <span className="font-medium text-foreground/80 text-right max-w-[120px] truncate">
                        {item.value}
                      </span>
                    </div>
                  ))}
                </CardContent>
              </Card>
            </motion.div>

            {/* Recent thread activity */}
            {posts.length > 0 && (
              <motion.div
                initial={{ opacity: 0, x: 12 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.3, delay: 0.15 }}
              >
                <Card>
                  <CardHeader className="pb-2 pt-4 px-4">
                    <CardTitle className="text-sm font-semibold flex items-center gap-2">
                      <Clock size={13} className="text-emerald-600" />
                      Thread Activity
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="px-4 pb-3 space-y-2">
                    {posts
                      .slice(-5)
                      .reverse()
                      .map((post, i) => (
                        <div
                          key={post.id}
                          className={cn(
                            "flex items-start gap-2 py-1.5",
                            i < posts.slice(-5).length - 1 &&
                              "border-b border-border/40",
                          )}
                        >
                          <AuthorAvatar name={post.authorName} size="sm" />
                          <div className="min-w-0 flex-1">
                            <p className="text-[11px] font-medium text-foreground/90 truncate">
                              {post.authorName}
                            </p>
                            <p className="text-[10px] text-muted-foreground line-clamp-1">
                              {post.content.slice(0, 50)}
                              {post.content.length > 50 && "…"}
                            </p>
                            <p className="text-[10px] text-muted-foreground/60 mt-0.5">
                              {timeAgo(post.createdAt)}
                            </p>
                          </div>
                        </div>
                      ))}
                  </CardContent>
                </Card>
              </motion.div>
            )}

            {/* Related threads */}
            <motion.div
              initial={{ opacity: 0, x: 12 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.3, delay: 0.2 }}
            >
              <Card>
                <CardHeader className="pb-2 pt-4 px-4">
                  <CardTitle className="text-sm font-semibold flex items-center gap-2">
                    <MessageSquare size={13} className="text-primary" />
                    Back to Forums
                  </CardTitle>
                </CardHeader>
                <CardContent className="px-4 pb-4">
                  <Button
                    asChild
                    variant="outline"
                    size="sm"
                    className="w-full h-8 text-xs gap-1.5"
                    data-ocid="forum_detail.back_link"
                  >
                    <Link to="/forums">
                      <ArrowLeft size={11} />
                      All Threads
                    </Link>
                  </Button>
                </CardContent>
              </Card>
            </motion.div>
          </aside>
        </div>
      </div>

      {/* ── Archive Confirm Dialog ── */}
      <Dialog open={archiveDialogOpen} onOpenChange={setArchiveDialogOpen}>
        <DialogContent data-ocid="forum_detail.archive_confirm.dialog">
          <DialogHeader>
            <DialogTitle className="font-display flex items-center gap-2">
              <Archive size={16} className="text-slate-600" />
              Archive Thread?
            </DialogTitle>
            <DialogDescription>
              This thread will be archived and locked. It will be preserved for
              reference but no new replies can be posted. This action can be
              reversed by a moderator.
            </DialogDescription>
          </DialogHeader>
          <DialogFooter className="gap-2">
            <Button
              variant="outline"
              onClick={() => setArchiveDialogOpen(false)}
              data-ocid="forum_detail.archive_confirm.cancel_button"
            >
              Cancel
            </Button>
            <Button
              variant="default"
              className="bg-slate-700 hover:bg-slate-800 text-white"
              onClick={handleArchiveConfirm}
              data-ocid="forum_detail.archive_confirm.confirm_button"
            >
              <Archive size={13} className="mr-1.5" />
              Archive Thread
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </Layout>
  );
}
