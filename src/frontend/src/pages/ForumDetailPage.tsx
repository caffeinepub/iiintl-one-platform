import {
  ForumCategory,
  type ForumReply,
  type ForumThread,
  ThreadStatus,
} from "@/backend";
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
import { Skeleton } from "@/components/ui/skeleton";
import { Textarea } from "@/components/ui/textarea";
import { useAuth } from "@/context/AuthContext";
import { useBackend } from "@/hooks/useBackend";
import { cn } from "@/lib/utils";
import { Link, useParams } from "@tanstack/react-router";
import {
  Archive,
  ArrowLeft,
  ChevronRight,
  Clock,
  Eye,
  Lock,
  MessageCircle,
  MessageSquare,
  Pin,
  ShieldAlert,
} from "lucide-react";
import type { Variants } from "motion/react";
import { motion } from "motion/react";
import { useEffect, useState } from "react";
import { toast } from "sonner";

const containerVariants: Variants = {
  hidden: { opacity: 0 },
  visible: { opacity: 1, transition: { staggerChildren: 0.06 } },
};

const itemVariants: Variants = {
  hidden: { opacity: 0, y: 12 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.28 } },
};

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

function formatDateTime(ns: bigint): string {
  return new Date(nanoToMs(ns)).toLocaleDateString("en-US", {
    year: "numeric",
    month: "long",
    day: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  });
}

function truncatePrincipal(p: { toString(): string }): string {
  const s = p.toString();
  return s.length > 12 ? `${s.slice(0, 8)}…` : s;
}

function getAvatarColor(principal: { toString(): string }): string {
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
  const s = principal.toString();
  return colors[s.charCodeAt(0) % colors.length];
}

function PrincipalAvatar({
  principal,
  size = "sm",
}: {
  principal: { toString(): string };
  size?: "sm" | "md";
}) {
  const colorClass = getAvatarColor(principal);
  const sizeClass = size === "md" ? "w-10 h-10 text-sm" : "w-8 h-8 text-xs";
  const s = principal.toString();
  const initials = s.slice(0, 2).toUpperCase();

  return (
    <div
      className={cn(
        "rounded-full flex items-center justify-center font-bold flex-shrink-0",
        sizeClass,
        colorClass,
      )}
    >
      {initials}
    </div>
  );
}

function ReplyCard({
  reply,
  index,
}: {
  reply: ForumReply;
  index: number;
}) {
  return (
    <motion.div
      variants={itemVariants}
      data-ocid={`forum_detail.reply.item.${index}`}
    >
      <div
        className={cn(
          "rounded-xl border p-4",
          reply.isModeratorReply
            ? "border-amber-200 bg-amber-50/60"
            : "border-border bg-card",
        )}
      >
        {reply.isModeratorReply && (
          <div className="flex items-center gap-2 mb-3 pb-2 border-b border-amber-200">
            <ShieldAlert size={13} className="text-amber-600" />
            <span className="text-[11px] font-semibold text-amber-700 uppercase tracking-wide">
              Moderator Note
            </span>
          </div>
        )}

        <div className="flex items-start gap-3">
          <PrincipalAvatar principal={reply.createdBy} size="sm" />

          <div className="flex-1 min-w-0">
            <div className="flex flex-wrap items-center gap-2 mb-2">
              <span className="text-sm font-semibold text-foreground">
                {truncatePrincipal(reply.createdBy)}
              </span>
              <span className="text-[11px] text-muted-foreground ml-auto flex items-center gap-1">
                <Clock size={10} />
                {timeAgo(reply.createdAt)}
              </span>
            </div>

            <p className="text-sm text-foreground leading-relaxed">
              {reply.body}
            </p>

            <div className="flex items-center gap-3 mt-3 pt-2 border-t border-border/50">
              <span className="text-[10px] text-muted-foreground ml-auto">
                {formatDateTime(reply.createdAt)}
              </span>
            </div>
          </div>
        </div>
      </div>
    </motion.div>
  );
}

function PageSkeleton() {
  return (
    <Layout breadcrumb="Forums › Loading...">
      <div className="max-w-5xl mx-auto px-4 sm:px-6 py-6">
        <div className="space-y-4">
          <Skeleton className="h-4 w-40" />
          <Skeleton className="h-8 w-3/4" />
          <Skeleton className="h-4 w-1/3" />
          <Skeleton className="h-32 w-full" />
          <Skeleton className="h-24 w-full" />
          <Skeleton className="h-24 w-full" />
        </div>
      </div>
    </Layout>
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
  const backend = useBackend();

  const [thread, setThread] = useState<ForumThread | null>(null);
  const [replies, setReplies] = useState<ForumReply[]>([]);
  const [loading, setLoading] = useState(true);
  const [notFound, setNotFound] = useState(false);

  const [isPinned, setIsPinned] = useState(false);
  const [isLocked, setIsLocked] = useState(false);
  const [isArchived, setIsArchived] = useState(false);
  const [archiveDialogOpen, setArchiveDialogOpen] = useState(false);

  const [replyContent, setReplyContent] = useState("");
  const [replySending, setReplySending] = useState(false);
  const [replySuccess, setReplySuccess] = useState(false);

  useEffect(() => {
    if (!id || !backend) {
      if (!backend) return; // wait for backend
      setNotFound(true);
      setLoading(false);
      return;
    }

    let cancelled = false;
    async function load() {
      try {
        const threadId = BigInt(id as string);
        const [threadData, repliesData] = await Promise.all([
          backend!.getThread(threadId),
          backend!.getReplies(threadId),
        ]);

        // Fire-and-forget view increment
        backend!.incrementThreadView(threadId).catch(console.error);

        if (cancelled) return;

        if (!threadData) {
          setNotFound(true);
        } else {
          setThread(threadData);
          setIsPinned(threadData.isPinned);
          setIsLocked(threadData.status === ThreadStatus.locked);
          setIsArchived(threadData.status === ThreadStatus.archived);
          setReplies(repliesData);
        }
      } catch (err) {
        console.error(err);
        if (!cancelled) setNotFound(true);
      } finally {
        if (!cancelled) setLoading(false);
      }
    }

    load();
    return () => {
      cancelled = true;
    };
  }, [id, backend]);

  const isAdminRole =
    user?.role === "super_admin" ||
    user?.role === "admin" ||
    user?.role === "org_admin";

  async function handlePin() {
    if (!thread || !backend) return;
    try {
      await backend.pinThread(thread.id);
      setIsPinned((v) => !v);
      toast.success(isPinned ? "Thread unpinned" : "Thread pinned");
    } catch {
      toast.error("Failed to update pin status");
    }
  }

  async function handleLock() {
    if (!thread || !backend) return;
    try {
      await backend.lockThread(thread.id);
      setIsLocked((v) => !v);
      toast.success(isLocked ? "Thread unlocked" : "Thread locked");
    } catch {
      toast.error("Failed to update lock status");
    }
  }

  async function handleArchiveConfirm() {
    if (!thread || !backend) return;
    try {
      await backend.archiveThread(thread.id);
      setIsArchived(true);
      setIsLocked(true);
      setArchiveDialogOpen(false);
      toast.success("Thread archived");
    } catch {
      toast.error("Failed to archive thread");
    }
  }

  async function handleReply() {
    if (!replyContent.trim() || !thread || !backend) return;
    setReplySending(true);
    try {
      await backend.replyToThread(thread.id, replyContent.trim());
      const updatedReplies = await backend.getReplies(thread.id);
      setReplies(updatedReplies);
      setReplyContent("");
      setReplySuccess(true);
      toast.success("Reply posted!");
      setTimeout(() => setReplySuccess(false), 3000);
    } catch {
      toast.error("Failed to post reply. Please try again.");
    } finally {
      setReplySending(false);
    }
  }

  if (loading) return <PageSkeleton />;
  if (notFound || !thread) return <ThreadNotFound />;

  const catColor =
    CATEGORY_COLORS[thread.category] ??
    "bg-secondary text-foreground border-border";

  return (
    <Layout
      breadcrumb={`Forums › ${
        CATEGORY_LABELS[thread.category] ?? thread.category
      } › ${thread.title}`}
    >
      <div className="max-w-5xl mx-auto px-4 sm:px-6 py-6">
        {/* Back link */}
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
            {CATEGORY_LABELS[thread.category] ?? thread.category}
          </span>
          <ChevronRight size={11} className="text-border" />
          <span className="truncate max-w-xs text-foreground/70">
            {thread.title}
          </span>
        </motion.div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Main content */}
          <div className="lg:col-span-2 space-y-4">
            <motion.div
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.3 }}
            >
              <Card
                className={cn(
                  "overflow-hidden",
                  isPinned && "ring-1 ring-amber-200/60",
                  isArchived && "opacity-80",
                )}
              >
                {(isArchived || isLocked || isPinned) && (
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
                        <Lock size={13} /> This thread is locked.
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
                  <div className="flex flex-wrap gap-2 mb-3">
                    <Badge
                      variant="outline"
                      className={cn("text-[10px] px-2 py-0.5 h-5", catColor)}
                    >
                      {CATEGORY_LABELS[thread.category] ?? thread.category}
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
                    {isPinned && (
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

                  <div className="flex flex-wrap items-center gap-3 mb-4 pb-4 border-b border-border/60 text-xs text-muted-foreground">
                    <div className="flex items-center gap-2">
                      <PrincipalAvatar principal={thread.createdBy} size="sm" />
                      <span className="font-semibold text-foreground/90">
                        {truncatePrincipal(thread.createdBy)}
                      </span>
                    </div>
                    <span className="flex items-center gap-1">
                      <Clock size={10} />
                      {timeAgo(thread.createdAt)}
                    </span>
                    <div className="ml-auto flex items-center gap-3">
                      <span className="flex items-center gap-1">
                        <MessageCircle size={11} />
                        {Number(thread.replyCount)} replies
                      </span>
                      <span className="flex items-center gap-1">
                        <Eye size={11} />
                        {Number(thread.viewCount)}
                      </span>
                    </div>
                  </div>

                  <p className="text-sm text-foreground leading-relaxed whitespace-pre-line">
                    {thread.body}
                  </p>

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

                  {isAdminRole && (
                    <div className="flex items-center gap-2 mt-4 pt-3 border-t border-border/50">
                      <Button
                        variant="outline"
                        size="sm"
                        className={cn(
                          "h-7 text-xs gap-1.5",
                          isPinned
                            ? "border-amber-300 text-amber-700 hover:bg-amber-50"
                            : "border-border",
                        )}
                        onClick={handlePin}
                        data-ocid="thread.pin.button"
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
                        onClick={handleLock}
                        data-ocid="thread.lock.button"
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
                          data-ocid="thread.archive.button"
                        >
                          <Archive size={11} />
                          Archive
                        </Button>
                      )}
                    </div>
                  )}
                </CardContent>
              </Card>
            </motion.div>

            {/* Replies */}
            {replies.length > 0 && (
              <div>
                <div className="flex items-center gap-2 mb-3">
                  <MessageCircle size={15} className="text-primary" />
                  <h2 className="font-display font-semibold text-sm text-foreground">
                    {replies.length}{" "}
                    {replies.length === 1 ? "Reply" : "Replies"}
                  </h2>
                  <Separator className="flex-1" />
                </div>

                <motion.div
                  variants={containerVariants}
                  initial="hidden"
                  animate="visible"
                  className="space-y-3"
                >
                  {replies.map((reply, i) => (
                    <ReplyCard
                      key={String(reply.id)}
                      reply={reply}
                      index={i + 1}
                    />
                  ))}
                </motion.div>
              </div>
            )}

            {replies.length === 0 && (
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

            {/* Reply Form */}
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
                      ? "This thread is archived. No new replies."
                      : "This thread is locked. No new replies."}
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
                      <div className="w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center flex-shrink-0">
                        <span className="text-xs font-bold text-primary">
                          {user.name.slice(0, 2).toUpperCase()}
                        </span>
                      </div>
                      <div className="flex-1">
                        <Textarea
                          placeholder="Share your thoughts on this discussion..."
                          rows={4}
                          value={replyContent}
                          onChange={(e) => setReplyContent(e.target.value)}
                          className="resize-none"
                          data-ocid="forums.reply.input"
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
                          data-ocid="forums.reply.submit_button"
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

          {/* Sidebar */}
          <aside className="hidden lg:block space-y-4">
            <motion.div
              initial={{ opacity: 0, x: 12 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.3, delay: 0.1 }}
            >
              <Card>
                <CardHeader className="pb-2 pt-4 px-4">
                  <CardTitle className="text-sm font-semibold flex items-center gap-2">
                    <MessageSquare size={13} className="text-primary" />
                    Thread Info
                  </CardTitle>
                </CardHeader>
                <CardContent className="px-4 pb-4 space-y-2.5">
                  {[
                    {
                      label: "Author",
                      value: truncatePrincipal(thread.createdBy),
                    },
                    {
                      label: "Category",
                      value:
                        CATEGORY_LABELS[thread.category] ?? thread.category,
                    },
                    {
                      label: "Posted",
                      value: new Date(
                        nanoToMs(thread.createdAt),
                      ).toLocaleDateString("en-US", {
                        month: "short",
                        day: "numeric",
                        year: "numeric",
                      }),
                    },
                    {
                      label: "Replies",
                      value: Number(thread.replyCount),
                    },
                    {
                      label: "Views",
                      value: Number(thread.viewCount).toLocaleString(),
                    },
                  ].map((item) => (
                    <div
                      key={item.label}
                      className="flex items-center justify-between text-xs"
                    >
                      <span className="text-muted-foreground">
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

            {replies.length > 0 && (
              <motion.div
                initial={{ opacity: 0, x: 12 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.3, delay: 0.15 }}
              >
                <Card>
                  <CardHeader className="pb-2 pt-4 px-4">
                    <CardTitle className="text-sm font-semibold flex items-center gap-2">
                      <Clock size={13} className="text-emerald-600" />
                      Recent Replies
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="px-4 pb-3 space-y-2">
                    {replies
                      .slice(-5)
                      .reverse()
                      .map((reply, i) => (
                        <div
                          key={String(reply.id)}
                          className={cn(
                            "flex items-start gap-2 py-1.5",
                            i < Math.min(replies.length, 5) - 1 &&
                              "border-b border-border/40",
                          )}
                        >
                          <PrincipalAvatar
                            principal={reply.createdBy}
                            size="sm"
                          />
                          <div className="min-w-0 flex-1">
                            <p className="text-[11px] font-medium text-foreground/90 truncate">
                              {truncatePrincipal(reply.createdBy)}
                            </p>
                            <p className="text-[10px] text-muted-foreground line-clamp-1">
                              {reply.body.slice(0, 50)}
                              {reply.body.length > 50 && "…"}
                            </p>
                            <p className="text-[10px] text-muted-foreground/60 mt-0.5">
                              {timeAgo(reply.createdAt)}
                            </p>
                          </div>
                        </div>
                      ))}
                  </CardContent>
                </Card>
              </motion.div>
            )}

            <motion.div
              initial={{ opacity: 0, x: 12 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.3, delay: 0.2 }}
            >
              <Card>
                <CardHeader className="pb-2 pt-4 px-4">
                  <CardTitle className="text-sm font-semibold flex items-center gap-2">
                    <ArrowLeft size={13} className="text-primary" />
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

      {/* Archive Confirm Dialog */}
      <Dialog open={archiveDialogOpen} onOpenChange={setArchiveDialogOpen}>
        <DialogContent data-ocid="forum_detail.archive_confirm.dialog">
          <DialogHeader>
            <DialogTitle className="font-display flex items-center gap-2">
              <Archive size={16} className="text-slate-600" />
              Archive Thread?
            </DialogTitle>
            <DialogDescription>
              This thread will be archived and locked. It will be preserved for
              reference but no new replies can be posted.
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
