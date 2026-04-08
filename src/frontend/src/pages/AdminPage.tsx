import type { Campaign, ForumThread, Organization } from "@/backend";
import { CampaignStatus, OrgStatus, ThreadStatus } from "@/backend";
import { Layout } from "@/components/Layout";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Progress } from "@/components/ui/progress";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
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
import { useAuth } from "@/context/AuthContext";
import { useBackend } from "@/hooks/useBackend";
import type {
  ExtendedBackend,
  PlatformAnalytics,
  Tenant,
} from "@/types/appTypes";
import { TenantStatus, TenantTier } from "@/types/appTypes";
import {
  Activity,
  BarChart2,
  BookOpen,
  Building,
  Building2,
  CheckCircle,
  FileText,
  HelpCircle,
  Loader2,
  Lock,
  MessageSquare,
  Pin,
  Radio,
  Shield,
  ShoppingBag,
  Target,
  Trash2,
  TrendingUp,
  Users,
  XCircle,
} from "lucide-react";
import { useCallback, useEffect, useState } from "react";
import { toast } from "sonner";

// ── Store admin type augmentation ─────────────────────────────────────────────
interface VendorAdmin {
  id: bigint;
  ownerId: string;
  name: string;
  description: string;
  status: { pending?: null; approved?: null; suspended?: null };
  createdAt: bigint;
}
interface AdminStoreBackend {
  listAllVendors(): Promise<VendorAdmin[]>;
  approveVendor(id: bigint): Promise<boolean>;
  suspendVendor(id: bigint): Promise<boolean>;
}

// ── Content admin type augmentation ──────────────────────────────────────────
interface ResourceAdmin {
  id: bigint;
  title: string;
  category: string;
  isPublished: boolean;
  createdAt: bigint;
}
interface FaqAdmin {
  id: bigint;
  question: string;
  category: string;
  isPublished: boolean;
}
interface DocAdmin {
  id: bigint;
  title: string;
  slug: string;
  isPublished: boolean;
}
interface AdminContentBackend {
  listResources(category: null, language: null): Promise<ResourceAdmin[]>;
  listAllFaqItems(): Promise<FaqAdmin[]>;
  listAllDocPages(category: null): Promise<DocAdmin[]>;
  publishResource(id: bigint): Promise<boolean>;
  unpublishResource(id: bigint): Promise<boolean>;
  publishFaqItem(id: bigint): Promise<boolean>;
  unpublishFaqItem(id: bigint): Promise<boolean>;
  publishDocPage(id: bigint): Promise<boolean>;
  unpublishDocPage(id: bigint): Promise<boolean>;
}

// ── Helpers ───────────────────────────────────────────────────────────────────
function formatDate(ns: bigint | string | number): string {
  const ms =
    typeof ns === "bigint" ? Number(ns) / 1_000_000 : Number(ns) / 1_000_000;
  return new Date(ms).toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
  });
}

function getVendorStatus(
  status: VendorAdmin["status"],
): "pending" | "approved" | "suspended" {
  if (status.approved !== undefined) return "approved";
  if (status.suspended !== undefined) return "suspended";
  return "pending";
}

function TableSkeleton({
  rows = 4,
  cols = 4,
}: { rows?: number; cols?: number }) {
  return (
    <div className="space-y-2">
      {Array.from({ length: rows }).map((_, i) => (
        // biome-ignore lint/suspicious/noArrayIndexKey: skeleton
        <div key={i} className="flex gap-3">
          {Array.from({ length: cols }).map((_, j) => (
            // biome-ignore lint/suspicious/noArrayIndexKey: skeleton
            <Skeleton key={j} className="h-9 flex-1" />
          ))}
        </div>
      ))}
    </div>
  );
}

function StatCard({
  icon: Icon,
  label,
  value,
  color = "primary",
}: {
  icon: React.ElementType;
  label: string;
  value: string | number;
  color?: string;
}) {
  return (
    <Card className="border border-border">
      <CardContent className="p-5">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-lg flex items-center justify-center bg-primary/10">
            <Icon size={18} className={`text-${color}`} />
          </div>
          <div>
            <p className="text-xs text-muted-foreground font-medium">{label}</p>
            <p className="text-2xl font-bold text-foreground font-display">
              {value}
            </p>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}

// ── Overview Tab ─────────────────────────────────────────────────────────────
function OverviewTab({
  orgs,
  campaigns,
  threads,
  loading,
}: {
  orgs: Organization[];
  campaigns: Campaign[];
  threads: ForumThread[];
  loading: boolean;
}) {
  const recentCampaigns = [...campaigns]
    .sort((a, b) => Number(b.createdAt) - Number(a.createdAt))
    .slice(0, 5);
  const recentThreads = [...threads]
    .sort((a, b) => Number(b.createdAt) - Number(a.createdAt))
    .slice(0, 5);

  if (loading) {
    return (
      <div className="space-y-6" data-ocid="admin.overview.loading_state">
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
          {Array.from({ length: 4 }).map((_, i) => (
            // biome-ignore lint/suspicious/noArrayIndexKey: skeleton
            <Skeleton key={i} className="h-24" />
          ))}
        </div>
        <Skeleton className="h-48" />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Stats */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard
          icon={Building2}
          label="Total Organizations"
          value={orgs.length}
        />
        <StatCard
          icon={Target}
          label="Total Campaigns"
          value={campaigns.length}
        />
        <StatCard
          icon={MessageSquare}
          label="Forum Threads"
          value={threads.length}
        />
        <Card className="border border-border">
          <CardContent className="p-5">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-lg flex items-center justify-center bg-emerald-500/10">
                <Radio size={18} className="text-emerald-500" />
              </div>
              <div>
                <p className="text-xs text-muted-foreground font-medium">
                  Platform Status
                </p>
                <div className="flex items-center gap-1.5 mt-0.5">
                  <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
                  <p className="text-base font-bold text-emerald-600">Live</p>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Recent Activity */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Recent Campaigns */}
        <Card className="border border-border">
          <CardHeader className="pb-3">
            <CardTitle className="text-sm font-semibold flex items-center gap-2">
              <Target size={15} className="text-primary" />
              Recent Campaigns
            </CardTitle>
          </CardHeader>
          <CardContent className="p-0">
            {recentCampaigns.length === 0 ? (
              <p className="text-sm text-muted-foreground text-center py-6 px-4">
                No campaigns yet
              </p>
            ) : (
              <div className="divide-y divide-border">
                {recentCampaigns.map((c) => (
                  <div
                    key={c.id}
                    className="flex items-center justify-between px-4 py-3"
                  >
                    <div className="min-w-0 flex-1">
                      <p className="text-sm font-medium text-foreground truncate">
                        {c.title}
                      </p>
                      <p className="text-xs text-muted-foreground">
                        {formatDate(c.createdAt)}
                      </p>
                    </div>
                    <Badge
                      variant={
                        c.status === "active"
                          ? "default"
                          : c.status === "draft"
                            ? "secondary"
                            : "outline"
                      }
                      className="text-[10px] ml-2 flex-shrink-0"
                    >
                      {c.status}
                    </Badge>
                  </div>
                ))}
              </div>
            )}
          </CardContent>
        </Card>

        {/* Recent Threads */}
        <Card className="border border-border">
          <CardHeader className="pb-3">
            <CardTitle className="text-sm font-semibold flex items-center gap-2">
              <MessageSquare size={15} className="text-primary" />
              Recent Forum Threads
            </CardTitle>
          </CardHeader>
          <CardContent className="p-0">
            {recentThreads.length === 0 ? (
              <p className="text-sm text-muted-foreground text-center py-6 px-4">
                No threads yet
              </p>
            ) : (
              <div className="divide-y divide-border">
                {recentThreads.map((t) => (
                  <div
                    key={t.id.toString()}
                    className="flex items-center justify-between px-4 py-3"
                  >
                    <div className="min-w-0 flex-1">
                      <p className="text-sm font-medium text-foreground truncate">
                        {t.title}
                      </p>
                      <p className="text-xs text-muted-foreground">
                        {t.category} · {formatDate(t.createdAt)}
                      </p>
                    </div>
                    {t.isPinned && (
                      <Pin
                        size={12}
                        className="text-amber-500 ml-2 flex-shrink-0"
                      />
                    )}
                  </div>
                ))}
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}

// ── Vendors Tab ───────────────────────────────────────────────────────────────
function VendorsTab() {
  const backend = useBackend();
  const [vendors, setVendors] = useState<VendorAdmin[]>([]);
  const [loading, setLoading] = useState(true);
  const [actionLoading, setActionLoading] = useState<string | null>(null);

  const fetchVendors = useCallback(async () => {
    if (!backend) return;
    setLoading(true);
    try {
      const storeBackend = backend as unknown as AdminStoreBackend;
      const data = await storeBackend.listAllVendors();
      setVendors(data);
    } catch {
      toast.error("Failed to load vendors");
    } finally {
      setLoading(false);
    }
  }, [backend]);

  useEffect(() => {
    fetchVendors();
  }, [fetchVendors]);

  async function handleApprove(vendor: VendorAdmin, idx: number) {
    if (!backend) return;
    const key = `approve-${idx}`;
    setActionLoading(key);
    try {
      const storeBackend = backend as unknown as AdminStoreBackend;
      await storeBackend.approveVendor(vendor.id);
      toast.success(`${vendor.name} approved`);
      await fetchVendors();
    } catch {
      toast.error("Failed to approve vendor");
    } finally {
      setActionLoading(null);
    }
  }

  async function handleSuspend(vendor: VendorAdmin, idx: number) {
    if (!backend) return;
    const key = `suspend-${idx}`;
    setActionLoading(key);
    try {
      const storeBackend = backend as unknown as AdminStoreBackend;
      await storeBackend.suspendVendor(vendor.id);
      toast.success(`${vendor.name} suspended`);
      await fetchVendors();
    } catch {
      toast.error("Failed to suspend vendor");
    } finally {
      setActionLoading(null);
    }
  }

  if (loading) {
    return (
      <div data-ocid="admin.vendors.loading_state">
        <TableSkeleton rows={5} cols={5} />
      </div>
    );
  }

  if (vendors.length === 0) {
    return (
      <div
        className="text-center py-16 text-muted-foreground"
        data-ocid="admin.vendors.empty_state"
      >
        <ShoppingBag size={36} className="mx-auto mb-3 opacity-30" />
        <p className="font-semibold text-foreground/60">
          No vendors registered
        </p>
        <p className="text-sm mt-1">Vendors will appear here once they apply</p>
      </div>
    );
  }

  return (
    <Table>
      <TableHeader>
        <TableRow>
          <TableHead>Vendor Name</TableHead>
          <TableHead>Owner</TableHead>
          <TableHead>Status</TableHead>
          <TableHead>Created</TableHead>
          <TableHead className="text-right">Actions</TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {vendors.map((vendor, i) => {
          const status = getVendorStatus(vendor.status);
          const approveKey = `approve-${i}`;
          const suspendKey = `suspend-${i}`;
          return (
            <TableRow key={vendor.id.toString()}>
              <TableCell className="font-medium">{vendor.name}</TableCell>
              <TableCell className="text-muted-foreground text-sm">
                {vendor.ownerId
                  ? `${vendor.ownerId.toString().slice(0, 8)}…`
                  : "—"}
              </TableCell>
              <TableCell>
                <Badge
                  variant={
                    status === "approved"
                      ? "default"
                      : status === "pending"
                        ? "secondary"
                        : "destructive"
                  }
                  className="text-[10px]"
                >
                  {status}
                </Badge>
              </TableCell>
              <TableCell className="text-sm text-muted-foreground">
                {formatDate(vendor.createdAt)}
              </TableCell>
              <TableCell className="text-right">
                <div className="flex items-center justify-end gap-2">
                  {(status === "pending" || status === "suspended") && (
                    <Button
                      size="sm"
                      variant="default"
                      className="h-7 text-xs px-2"
                      disabled={actionLoading === approveKey}
                      onClick={() => handleApprove(vendor, i)}
                      data-ocid={`admin.vendor.approve_button.${i + 1}`}
                    >
                      {actionLoading === approveKey ? (
                        <Loader2 size={12} className="animate-spin" />
                      ) : (
                        <CheckCircle size={12} className="mr-1" />
                      )}
                      Approve
                    </Button>
                  )}
                  {status === "approved" && (
                    <Button
                      size="sm"
                      variant="destructive"
                      className="h-7 text-xs px-2"
                      disabled={actionLoading === suspendKey}
                      onClick={() => handleSuspend(vendor, i)}
                      data-ocid={`admin.vendor.delete_button.${i + 1}`}
                    >
                      {actionLoading === suspendKey ? (
                        <Loader2 size={12} className="animate-spin" />
                      ) : (
                        <XCircle size={12} className="mr-1" />
                      )}
                      Suspend
                    </Button>
                  )}
                </div>
              </TableCell>
            </TableRow>
          );
        })}
      </TableBody>
    </Table>
  );
}

// ── Forums Tab ────────────────────────────────────────────────────────────────
function ForumsTab({ threads: initialThreads }: { threads: ForumThread[] }) {
  const backend = useBackend();
  const [threads, setThreads] = useState<ForumThread[]>(initialThreads);
  const [actionLoading, setActionLoading] = useState<string | null>(null);

  useEffect(() => {
    setThreads(initialThreads);
  }, [initialThreads]);

  async function handlePin(thread: ForumThread, idx: number) {
    if (!backend) return;
    const key = `pin-${idx}`;
    setActionLoading(key);
    try {
      await backend.pinThread(thread.id);
      toast.success(`"${thread.title}" pinned`);
      setThreads((prev) =>
        prev.map((t) => (t.id === thread.id ? { ...t, isPinned: true } : t)),
      );
    } catch {
      toast.error("Failed to pin thread");
    } finally {
      setActionLoading(null);
    }
  }

  async function handleLock(thread: ForumThread, idx: number) {
    if (!backend) return;
    const key = `lock-${idx}`;
    setActionLoading(key);
    try {
      await backend.lockThread(thread.id);
      toast.success(`"${thread.title}" locked`);
      setThreads((prev) =>
        prev.map((t) =>
          t.id === thread.id ? { ...t, status: ThreadStatus.locked } : t,
        ),
      );
    } catch {
      toast.error("Failed to lock thread");
    } finally {
      setActionLoading(null);
    }
  }

  async function handleArchive(thread: ForumThread, idx: number) {
    if (!backend) return;
    const key = `archive-${idx}`;
    setActionLoading(key);
    try {
      await backend.archiveThread(thread.id);
      toast.success(`"${thread.title}" archived`);
      setThreads((prev) =>
        prev.map((t) =>
          t.id === thread.id ? { ...t, status: ThreadStatus.archived } : t,
        ),
      );
    } catch {
      toast.error("Failed to archive thread");
    } finally {
      setActionLoading(null);
    }
  }

  if (threads.length === 0) {
    return (
      <div
        className="text-center py-16 text-muted-foreground"
        data-ocid="admin.forums.empty_state"
      >
        <MessageSquare size={36} className="mx-auto mb-3 opacity-30" />
        <p className="font-semibold text-foreground/60">No forum threads yet</p>
      </div>
    );
  }

  return (
    <Table>
      <TableHeader>
        <TableRow>
          <TableHead>Title</TableHead>
          <TableHead>Category</TableHead>
          <TableHead>Status</TableHead>
          <TableHead>Replies</TableHead>
          <TableHead className="text-right">Actions</TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {threads.map((thread, i) => {
          const isArchived = thread.status === "archived";
          const isLocked =
            thread.status === "locked" || thread.status === "archived";
          return (
            <TableRow
              key={thread.id.toString()}
              className={isArchived ? "opacity-50" : ""}
            >
              <TableCell className="font-medium">
                <div className="flex items-center gap-1.5">
                  {thread.isPinned && (
                    <Pin size={12} className="text-amber-500 flex-shrink-0" />
                  )}
                  <span className="truncate max-w-[220px]">{thread.title}</span>
                </div>
              </TableCell>
              <TableCell className="text-sm text-muted-foreground capitalize">
                {thread.category}
              </TableCell>
              <TableCell>
                <Badge
                  variant={
                    thread.status === "open"
                      ? "default"
                      : thread.status === "locked"
                        ? "secondary"
                        : "destructive"
                  }
                  className="text-[10px]"
                >
                  {thread.status}
                </Badge>
              </TableCell>
              <TableCell className="text-sm text-muted-foreground">
                {thread.replyCount.toString()}
              </TableCell>
              <TableCell className="text-right">
                <div className="flex items-center justify-end gap-1.5">
                  {!thread.isPinned && !isArchived && (
                    <Button
                      size="sm"
                      variant="outline"
                      className="h-7 text-xs px-2"
                      disabled={actionLoading === `pin-${i}`}
                      onClick={() => handlePin(thread, i)}
                      data-ocid={`admin.forum.pin_button.${i + 1}`}
                    >
                      {actionLoading === `pin-${i}` ? (
                        <Loader2 size={11} className="animate-spin" />
                      ) : (
                        <Pin size={11} className="mr-1" />
                      )}
                      Pin
                    </Button>
                  )}
                  {!isLocked && (
                    <Button
                      size="sm"
                      variant="outline"
                      className="h-7 text-xs px-2"
                      disabled={actionLoading === `lock-${i}`}
                      onClick={() => handleLock(thread, i)}
                      data-ocid={`admin.forum.toggle.${i + 1}`}
                    >
                      {actionLoading === `lock-${i}` ? (
                        <Loader2 size={11} className="animate-spin" />
                      ) : (
                        <Lock size={11} className="mr-1" />
                      )}
                      Lock
                    </Button>
                  )}
                  {!isArchived && (
                    <Button
                      size="sm"
                      variant="destructive"
                      className="h-7 text-xs px-2"
                      disabled={actionLoading === `archive-${i}`}
                      onClick={() => handleArchive(thread, i)}
                      data-ocid={`admin.forum.delete_button.${i + 1}`}
                    >
                      {actionLoading === `archive-${i}` ? (
                        <Loader2 size={11} className="animate-spin" />
                      ) : (
                        <Trash2 size={11} className="mr-1" />
                      )}
                      Archive
                    </Button>
                  )}
                </div>
              </TableCell>
            </TableRow>
          );
        })}
      </TableBody>
    </Table>
  );
}

// ── Campaigns & Orgs Tab ──────────────────────────────────────────────────────
function CampaignsOrgsTab({
  orgs: initialOrgs,
  campaigns: initialCampaigns,
}: {
  orgs: Organization[];
  campaigns: Campaign[];
}) {
  const backend = useBackend();
  const [orgs, setOrgs] = useState<Organization[]>(initialOrgs);
  const [campaigns, setCampaigns] = useState<Campaign[]>(initialCampaigns);
  const [actionLoading, setActionLoading] = useState<string | null>(null);

  useEffect(() => {
    setOrgs(initialOrgs);
    setCampaigns(initialCampaigns);
  }, [initialOrgs, initialCampaigns]);

  async function handleArchiveOrg(org: Organization, idx: number) {
    if (!backend) return;
    const key = `org-${idx}`;
    setActionLoading(key);
    try {
      await backend.archiveOrg(org.id);
      toast.success(`"${org.name}" archived`);
      setOrgs((prev) =>
        prev.map((o) =>
          o.id === org.id ? { ...o, status: OrgStatus.archived } : o,
        ),
      );
    } catch {
      toast.error("Failed to archive organization");
    } finally {
      setActionLoading(null);
    }
  }

  async function handleArchiveCampaign(campaign: Campaign, idx: number) {
    if (!backend) return;
    const key = `campaign-${idx}`;
    setActionLoading(key);
    try {
      await backend.archiveCampaign(campaign.id);
      toast.success(`"${campaign.title}" archived`);
      setCampaigns((prev) =>
        prev.map((c) =>
          c.id === campaign.id ? { ...c, status: CampaignStatus.archived } : c,
        ),
      );
    } catch {
      toast.error("Failed to archive campaign");
    } finally {
      setActionLoading(null);
    }
  }

  return (
    <div className="space-y-8">
      {/* Organizations */}
      <div>
        <h3 className="text-sm font-semibold text-foreground mb-3 flex items-center gap-2">
          <Building2 size={15} className="text-primary" />
          Organizations ({orgs.length})
        </h3>
        {orgs.length === 0 ? (
          <p className="text-sm text-muted-foreground py-4">
            No organizations found
          </p>
        ) : (
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Name</TableHead>
                <TableHead>Region</TableHead>
                <TableHead>Status</TableHead>
                <TableHead className="text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {orgs.map((org, i) => (
                <TableRow
                  key={org.id}
                  className={org.status === "archived" ? "opacity-50" : ""}
                >
                  <TableCell className="font-medium">{org.name}</TableCell>
                  <TableCell className="text-sm text-muted-foreground">
                    {org.region}
                  </TableCell>
                  <TableCell>
                    <Badge
                      variant={
                        org.status === "active" ? "default" : "secondary"
                      }
                      className="text-[10px]"
                    >
                      {org.status}
                    </Badge>
                  </TableCell>
                  <TableCell className="text-right">
                    {org.status === "active" && (
                      <Button
                        size="sm"
                        variant="destructive"
                        className="h-7 text-xs px-2"
                        disabled={actionLoading === `org-${i}`}
                        onClick={() => handleArchiveOrg(org, i)}
                        data-ocid={`admin.orgs.delete_button.${i + 1}`}
                      >
                        {actionLoading === `org-${i}` ? (
                          <Loader2 size={11} className="animate-spin" />
                        ) : (
                          <Trash2 size={11} className="mr-1" />
                        )}
                        Archive
                      </Button>
                    )}
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        )}
      </div>

      {/* Campaigns */}
      <div>
        <h3 className="text-sm font-semibold text-foreground mb-3 flex items-center gap-2">
          <Target size={15} className="text-primary" />
          Campaigns ({campaigns.length})
        </h3>
        {campaigns.length === 0 ? (
          <p className="text-sm text-muted-foreground py-4">
            No campaigns found
          </p>
        ) : (
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Title</TableHead>
                <TableHead>Type</TableHead>
                <TableHead>Status</TableHead>
                <TableHead className="text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {campaigns.map((campaign, i) => (
                <TableRow
                  key={campaign.id}
                  className={campaign.status === "archived" ? "opacity-50" : ""}
                >
                  <TableCell className="font-medium">
                    <span className="truncate max-w-[220px] block">
                      {campaign.title}
                    </span>
                  </TableCell>
                  <TableCell className="text-sm text-muted-foreground capitalize">
                    {campaign.campaignType}
                  </TableCell>
                  <TableCell>
                    <Badge
                      variant={
                        campaign.status === "active"
                          ? "default"
                          : campaign.status === "draft"
                            ? "secondary"
                            : "outline"
                      }
                      className="text-[10px]"
                    >
                      {campaign.status}
                    </Badge>
                  </TableCell>
                  <TableCell className="text-right">
                    {(campaign.status === "active" ||
                      campaign.status === "draft") && (
                      <Button
                        size="sm"
                        variant="destructive"
                        className="h-7 text-xs px-2"
                        disabled={actionLoading === `campaign-${i}`}
                        onClick={() => handleArchiveCampaign(campaign, i)}
                        data-ocid={`admin.campaigns.delete_button.${i + 1}`}
                      >
                        {actionLoading === `campaign-${i}` ? (
                          <Loader2 size={11} className="animate-spin" />
                        ) : (
                          <Trash2 size={11} className="mr-1" />
                        )}
                        Archive
                      </Button>
                    )}
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        )}
      </div>
    </div>
  );
}

// ── Content Tab ───────────────────────────────────────────────────────────────
function ContentTab() {
  const backend = useBackend();
  const [resources, setResources] = useState<ResourceAdmin[]>([]);
  const [faqs, setFaqs] = useState<FaqAdmin[]>([]);
  const [docs, setDocs] = useState<DocAdmin[]>([]);
  const [loading, setLoading] = useState(true);
  const [actionLoading, setActionLoading] = useState<string | null>(null);

  useEffect(() => {
    async function fetchContent() {
      if (!backend) return;
      setLoading(true);
      try {
        const contentBackend = backend as unknown as AdminContentBackend;
        const [resData, faqData, docData] = await Promise.all([
          contentBackend.listResources(null, null),
          contentBackend.listAllFaqItems(),
          contentBackend.listAllDocPages(null),
        ]);
        setResources(resData);
        setFaqs(faqData);
        setDocs(docData);
      } catch {
        toast.error("Failed to load content");
      } finally {
        setLoading(false);
      }
    }
    fetchContent();
  }, [backend]);

  async function toggleResource(item: ResourceAdmin, idx: number) {
    if (!backend) return;
    const key = `res-${idx}`;
    setActionLoading(key);
    const contentBackend = backend as unknown as AdminContentBackend;
    try {
      if (item.isPublished) {
        await contentBackend.unpublishResource(item.id);
        toast.success(`"${item.title}" unpublished`);
      } else {
        await contentBackend.publishResource(item.id);
        toast.success(`"${item.title}" published`);
      }
      setResources((prev) =>
        prev.map((r) =>
          r.id === item.id ? { ...r, isPublished: !r.isPublished } : r,
        ),
      );
    } catch {
      toast.error("Action failed");
    } finally {
      setActionLoading(null);
    }
  }

  async function toggleFaq(item: FaqAdmin, idx: number) {
    if (!backend) return;
    const key = `faq-${idx}`;
    setActionLoading(key);
    const contentBackend = backend as unknown as AdminContentBackend;
    try {
      if (item.isPublished) {
        await contentBackend.unpublishFaqItem(item.id);
        toast.success("FAQ item unpublished");
      } else {
        await contentBackend.publishFaqItem(item.id);
        toast.success("FAQ item published");
      }
      setFaqs((prev) =>
        prev.map((f) =>
          f.id === item.id ? { ...f, isPublished: !f.isPublished } : f,
        ),
      );
    } catch {
      toast.error("Action failed");
    } finally {
      setActionLoading(null);
    }
  }

  async function toggleDoc(item: DocAdmin, idx: number) {
    if (!backend) return;
    const key = `doc-${idx}`;
    setActionLoading(key);
    const contentBackend = backend as unknown as AdminContentBackend;
    try {
      if (item.isPublished) {
        await contentBackend.unpublishDocPage(item.id);
        toast.success(`"${item.title}" unpublished`);
      } else {
        await contentBackend.publishDocPage(item.id);
        toast.success(`"${item.title}" published`);
      }
      setDocs((prev) =>
        prev.map((d) =>
          d.id === item.id ? { ...d, isPublished: !d.isPublished } : d,
        ),
      );
    } catch {
      toast.error("Action failed");
    } finally {
      setActionLoading(null);
    }
  }

  if (loading) {
    return (
      <div data-ocid="admin.content.loading_state">
        <TableSkeleton rows={6} cols={4} />
      </div>
    );
  }

  const hasContent = resources.length > 0 || faqs.length > 0 || docs.length > 0;
  if (!hasContent) {
    return (
      <div
        className="text-center py-16 text-muted-foreground"
        data-ocid="admin.content.empty_state"
      >
        <BookOpen size={36} className="mx-auto mb-3 opacity-30" />
        <p className="font-semibold text-foreground/60">No content yet</p>
        <p className="text-sm mt-1">
          Resources, FAQ items, and docs will appear here
        </p>
      </div>
    );
  }

  return (
    <div className="space-y-8">
      {/* Resources */}
      {resources.length > 0 && (
        <div>
          <h3 className="text-sm font-semibold text-foreground mb-3 flex items-center gap-2">
            <FileText size={15} className="text-primary" />
            Resources ({resources.length})
          </h3>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Title</TableHead>
                <TableHead>Category</TableHead>
                <TableHead>Status</TableHead>
                <TableHead className="text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {resources.map((r, i) => (
                <TableRow key={r.id.toString()}>
                  <TableCell className="font-medium">{r.title}</TableCell>
                  <TableCell className="text-sm text-muted-foreground capitalize">
                    {r.category}
                  </TableCell>
                  <TableCell>
                    <Badge
                      variant={r.isPublished ? "default" : "secondary"}
                      className="text-[10px]"
                    >
                      {r.isPublished ? "Published" : "Draft"}
                    </Badge>
                  </TableCell>
                  <TableCell className="text-right">
                    <Button
                      size="sm"
                      variant={r.isPublished ? "outline" : "default"}
                      className="h-7 text-xs px-2"
                      disabled={actionLoading === `res-${i}`}
                      onClick={() => toggleResource(r, i)}
                      data-ocid={`admin.content.toggle.${i + 1}`}
                    >
                      {actionLoading === `res-${i}` ? (
                        <Loader2 size={11} className="animate-spin" />
                      ) : r.isPublished ? (
                        "Unpublish"
                      ) : (
                        "Publish"
                      )}
                    </Button>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
      )}

      {/* FAQ */}
      {faqs.length > 0 && (
        <div>
          <h3 className="text-sm font-semibold text-foreground mb-3 flex items-center gap-2">
            <HelpCircle size={15} className="text-primary" />
            FAQ Items ({faqs.length})
          </h3>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Question</TableHead>
                <TableHead>Category</TableHead>
                <TableHead>Status</TableHead>
                <TableHead className="text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {faqs.map((f, i) => (
                <TableRow key={f.id.toString()}>
                  <TableCell className="font-medium">
                    <span className="truncate max-w-[280px] block">
                      {f.question}
                    </span>
                  </TableCell>
                  <TableCell className="text-sm text-muted-foreground capitalize">
                    {f.category}
                  </TableCell>
                  <TableCell>
                    <Badge
                      variant={f.isPublished ? "default" : "secondary"}
                      className="text-[10px]"
                    >
                      {f.isPublished ? "Published" : "Draft"}
                    </Badge>
                  </TableCell>
                  <TableCell className="text-right">
                    <Button
                      size="sm"
                      variant={f.isPublished ? "outline" : "default"}
                      className="h-7 text-xs px-2"
                      disabled={actionLoading === `faq-${i}`}
                      onClick={() => toggleFaq(f, i)}
                      data-ocid={`admin.content.toggle.${resources.length + i + 1}`}
                    >
                      {actionLoading === `faq-${i}` ? (
                        <Loader2 size={11} className="animate-spin" />
                      ) : f.isPublished ? (
                        "Unpublish"
                      ) : (
                        "Publish"
                      )}
                    </Button>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
      )}

      {/* Docs */}
      {docs.length > 0 && (
        <div>
          <h3 className="text-sm font-semibold text-foreground mb-3 flex items-center gap-2">
            <BookOpen size={15} className="text-primary" />
            Doc Pages ({docs.length})
          </h3>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Title</TableHead>
                <TableHead>Slug</TableHead>
                <TableHead>Status</TableHead>
                <TableHead className="text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {docs.map((d, i) => (
                <TableRow key={d.id.toString()}>
                  <TableCell className="font-medium">{d.title}</TableCell>
                  <TableCell className="text-sm text-muted-foreground font-mono">
                    /{d.slug}
                  </TableCell>
                  <TableCell>
                    <Badge
                      variant={d.isPublished ? "default" : "secondary"}
                      className="text-[10px]"
                    >
                      {d.isPublished ? "Published" : "Draft"}
                    </Badge>
                  </TableCell>
                  <TableCell className="text-right">
                    <Button
                      size="sm"
                      variant={d.isPublished ? "outline" : "default"}
                      className="h-7 text-xs px-2"
                      disabled={actionLoading === `doc-${i}`}
                      onClick={() => toggleDoc(d, i)}
                      data-ocid={`admin.content.toggle.${
                        resources.length + faqs.length + i + 1
                      }`}
                    >
                      {actionLoading === `doc-${i}` ? (
                        <Loader2 size={11} className="animate-spin" />
                      ) : d.isPublished ? (
                        "Unpublish"
                      ) : (
                        "Publish"
                      )}
                    </Button>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
      )}
    </div>
  );
}

function AnalyticsTab() {
  const backend = useBackend();
  const [analytics, setAnalytics] = useState<PlatformAnalytics | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);

  useEffect(() => {
    if (!backend) return;
    setLoading(true);
    setError(false);
    backend
      .getPlatformAnalytics()
      .then((data) => {
        setAnalytics(data);
        if (!data) setError(true);
      })
      .catch(() => setError(true))
      .finally(() => setLoading(false));
  }, [backend]);

  if (loading) {
    return (
      <div data-ocid="admin.analytics.loading_state" className="space-y-4">
        <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
          {[1, 2, 3, 4, 5, 6].map((i) => (
            <Skeleton key={i} className="h-24 w-full rounded-xl" />
          ))}
        </div>
        <Skeleton className="h-40 w-full rounded-xl" />
        <Skeleton className="h-32 w-full rounded-xl" />
      </div>
    );
  }

  if (error || !analytics) {
    return (
      <div
        data-ocid="admin.analytics.error_state"
        className="text-center py-16 text-muted-foreground"
      >
        <BarChart2 size={40} className="mx-auto mb-3 opacity-40" />
        <p className="font-medium">Analytics unavailable</p>
        <p className="text-sm mt-1">Could not load platform analytics data.</p>
      </div>
    );
  }

  const totalTenants = Number(analytics.totalTenants);
  const activeTenants = Number(analytics.activeTenants);
  const trialTenants = Number(analytics.trialTenants);
  const suspendedTenants = Number(analytics.suspendedTenants);
  const cancelledTenants = Number(analytics.cancelledTenants);
  const totalMembers = Number(analytics.totalMembers);
  const tenantsWithBranding = Number(analytics.tenantsWithBranding);
  const revenue = analytics.totalMonthlyRevenue;
  const starterCount = Number(analytics.tierBreakdown.starter);
  const orgCount = Number(analytics.tierBreakdown.organization);
  const enterpriseCount = Number(analytics.tierBreakdown.enterprise);

  const statCards = [
    {
      label: "Total Tenants",
      value: totalTenants,
      icon: <Building size={16} />,
      color: "text-primary",
    },
    {
      label: "Active Tenants",
      value: activeTenants,
      icon: <CheckCircle size={16} />,
      color: "text-emerald-500",
    },
    {
      label: "Trial Tenants",
      value: trialTenants,
      icon: <Radio size={16} />,
      color: "text-yellow-500",
    },
    {
      label: "Monthly Revenue",
      value: `$${revenue.toLocaleString("en-US", { minimumFractionDigits: 0, maximumFractionDigits: 0 })}`,
      icon: <TrendingUp size={16} />,
      color: "text-blue-500",
    },
    {
      label: "Total Members",
      value: totalMembers,
      icon: <Users size={16} />,
      color: "text-violet-500",
    },
    {
      label: "With Branding",
      value: tenantsWithBranding,
      icon: <Shield size={16} />,
      color: "text-pink-500",
    },
  ];

  return (
    <div className="space-y-6">
      {/* Key metrics */}
      <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
        {statCards.map((card, idx) => (
          <Card
            key={card.label}
            data-ocid={
              idx === 0
                ? "admin.analytics.total_tenants.card"
                : idx === 3
                  ? "admin.analytics.revenue.card"
                  : idx === 4
                    ? "admin.analytics.members.card"
                    : undefined
            }
          >
            <CardContent className="pt-4 pb-4">
              <div className={`flex items-center gap-2 mb-1 ${card.color}`}>
                {card.icon}
                <span className="text-xs font-medium text-muted-foreground">
                  {card.label}
                </span>
              </div>
              <p className="text-2xl font-bold">{card.value}</p>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Status breakdown */}
      <Card data-ocid="admin.analytics.status.panel">
        <CardHeader className="pb-2">
          <CardTitle className="text-sm font-semibold flex items-center gap-2">
            <Activity size={14} />
            Tenant Status Breakdown
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-3">
          {[
            {
              label: "Active",
              count: activeTenants,
              total: totalTenants,
              cls: "bg-emerald-500",
            },
            {
              label: "Trial",
              count: trialTenants,
              total: totalTenants,
              cls: "bg-yellow-500",
            },
            {
              label: "Suspended",
              count: suspendedTenants,
              total: totalTenants,
              cls: "bg-red-500",
            },
            {
              label: "Cancelled",
              count: cancelledTenants,
              total: totalTenants,
              cls: "bg-muted-foreground",
            },
          ].map(({ label, count, total }) => (
            <div key={label} className="space-y-1">
              <div className="flex justify-between text-xs text-muted-foreground">
                <span>{label}</span>
                <span>
                  {count} / {total}
                </span>
              </div>
              <Progress
                value={total > 0 ? (count / total) * 100 : 0}
                className="h-2"
              />
            </div>
          ))}
        </CardContent>
      </Card>

      {/* Tier breakdown */}
      <Card data-ocid="admin.analytics.tier.panel">
        <CardHeader className="pb-2">
          <CardTitle className="text-sm font-semibold flex items-center gap-2">
            <Building size={14} />
            Tier Breakdown
          </CardTitle>
        </CardHeader>
        <CardContent className="flex flex-wrap gap-3">
          <div className="flex items-center gap-2">
            <Badge className="bg-emerald-500/20 text-emerald-400 border-0">
              Starter
            </Badge>
            <span className="text-sm font-bold">{starterCount}</span>
          </div>
          <div className="flex items-center gap-2">
            <Badge className="bg-blue-500/20 text-blue-400 border-0">
              Organization
            </Badge>
            <span className="text-sm font-bold">{orgCount}</span>
          </div>
          <div className="flex items-center gap-2">
            <Badge className="bg-purple-500/20 text-purple-400 border-0">
              Enterprise
            </Badge>
            <span className="text-sm font-bold">{enterpriseCount}</span>
          </div>
        </CardContent>
      </Card>

      {/* MRR card */}
      <Card>
        <CardHeader className="pb-2">
          <CardTitle className="text-sm font-semibold flex items-center gap-2">
            <TrendingUp size={14} />
            Monthly Recurring Revenue
          </CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-3xl font-bold text-primary">
            $
            {revenue.toLocaleString("en-US", {
              minimumFractionDigits: 0,
              maximumFractionDigits: 0,
            })}
          </p>
          <p className="text-xs text-muted-foreground mt-1">
            Based on active subscriptions
          </p>
        </CardContent>
      </Card>
    </div>
  );
}

function TenantsTab() {
  const backend = useBackend();
  const [tenants, setTenants] = useState<Tenant[]>([]);
  const [loading, setLoading] = useState(true);
  const [actionLoading, setActionLoading] = useState<Record<string, boolean>>(
    {},
  );

  useEffect(() => {
    if (!backend) return;
    setLoading(true);
    backend
      .listAllTenants()
      .then((data) => setTenants(data))
      .catch(() => {})
      .finally(() => setLoading(false));
  }, [backend]);

  async function handleSuspend(id: string) {
    if (!backend) return;
    setActionLoading((p) => ({ ...p, [id]: true }));
    try {
      await backend.suspendTenant(id);
      toast.success("Tenant suspended");
      setTenants((prev) =>
        prev.map((t) =>
          t.id === id ? { ...t, status: TenantStatus.suspended } : t,
        ),
      );
    } catch {
      toast.error("Failed to suspend tenant");
    } finally {
      setActionLoading((p) => ({ ...p, [id]: false }));
    }
  }

  async function handleReactivate(id: string) {
    if (!backend) return;
    setActionLoading((p) => ({ ...p, [id]: true }));
    try {
      await backend.reactivateTenant(id);
      toast.success("Tenant reactivated");
      setTenants((prev) =>
        prev.map((t) =>
          t.id === id ? { ...t, status: TenantStatus.active } : t,
        ),
      );
    } catch {
      toast.error("Failed to reactivate tenant");
    } finally {
      setActionLoading((p) => ({ ...p, [id]: false }));
    }
  }

  const tierBadge = (tier: TenantTier) => {
    const map: Record<TenantTier, string> = {
      [TenantTier.starter]: "bg-emerald-500/20 text-emerald-400 border-0",
      [TenantTier.organization]: "bg-blue-500/20 text-blue-400 border-0",
      [TenantTier.enterprise]: "bg-purple-500/20 text-purple-400 border-0",
    };
    return <Badge className={map[tier] ?? ""}>{tier}</Badge>;
  };

  const statusBadge = (status: TenantStatus) => {
    const map: Record<TenantStatus, string> = {
      [TenantStatus.trial]: "bg-yellow-500/20 text-yellow-400 border-0",
      [TenantStatus.active]: "bg-emerald-500/20 text-emerald-400 border-0",
      [TenantStatus.suspended]: "bg-red-500/20 text-red-400 border-0",
      [TenantStatus.cancelled]: "bg-muted text-muted-foreground border-0",
    };
    return <Badge className={map[status] ?? ""}>{status}</Badge>;
  };

  if (loading) {
    return (
      <div data-ocid="admin.tenants.loading_state" className="space-y-3">
        {[1, 2, 3].map((i) => (
          <Skeleton key={i} className="h-12 w-full rounded-lg" />
        ))}
      </div>
    );
  }

  if (tenants.length === 0) {
    return (
      <div
        data-ocid="admin.tenants.empty_state"
        className="text-center py-16 text-muted-foreground"
      >
        <Building size={32} className="mx-auto mb-3 opacity-30" />
        <p className="text-sm">No tenants registered yet.</p>
      </div>
    );
  }

  return (
    <div data-ocid="admin.tenants.table">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>ID</TableHead>
            <TableHead>Org Name</TableHead>
            <TableHead>Owner</TableHead>
            <TableHead>Tier</TableHead>
            <TableHead>Status</TableHead>
            <TableHead>Created</TableHead>
            <TableHead>Actions</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {tenants.map((tenant, idx) => (
            <TableRow
              key={tenant.id}
              data-ocid={`admin.tenants.row.${idx + 1}`}
            >
              <TableCell className="font-mono text-xs text-muted-foreground">
                {tenant.id.slice(0, 8)}...
              </TableCell>
              <TableCell className="font-medium">{tenant.orgName}</TableCell>
              <TableCell className="font-mono text-xs text-muted-foreground">
                {tenant.ownerPrincipal.toString().slice(0, 12)}...
              </TableCell>
              <TableCell>{tierBadge(tenant.tier)}</TableCell>
              <TableCell>{statusBadge(tenant.status)}</TableCell>
              <TableCell className="text-xs text-muted-foreground">
                {new Date(
                  Number(tenant.createdAt) / 1_000_000,
                ).toLocaleDateString()}
              </TableCell>
              <TableCell>
                {tenant.status === TenantStatus.suspended ||
                tenant.status === TenantStatus.cancelled ? (
                  <Button
                    size="sm"
                    variant="outline"
                    className="text-xs"
                    disabled={actionLoading[tenant.id]}
                    onClick={() => handleReactivate(tenant.id)}
                    data-ocid={`admin.tenants.reactivate.button.${idx + 1}`}
                  >
                    {actionLoading[tenant.id] ? (
                      <Loader2 size={11} className="mr-1 animate-spin" />
                    ) : null}
                    Reactivate
                  </Button>
                ) : (
                  <Button
                    size="sm"
                    variant="destructive"
                    className="text-xs"
                    disabled={actionLoading[tenant.id]}
                    onClick={() => handleSuspend(tenant.id)}
                    data-ocid={`admin.tenants.suspend.button.${idx + 1}`}
                  >
                    {actionLoading[tenant.id] ? (
                      <Loader2 size={11} className="mr-1 animate-spin" />
                    ) : null}
                    Suspend
                  </Button>
                )}
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
}

// ── MLM Admin Tab ─────────────────────────────────────────────────────────────
function MLMAdminTab() {
  const backend = useBackend();

  // ── Rate Table state ──────────────────────────────────────────────────────
  const [rates, setRates] = useState<any[]>([]);
  const [ratesLoading, setRatesLoading] = useState(false);
  const [rateTier, setRateTier] = useState("associate");
  const [rateLevel, setRateLevel] = useState("1");
  const [rateEarningType, setRateEarningType] = useState("directReferral");
  const [ratePercent, setRatePercent] = useState("");
  const [rateFlatAmt, setRateFlatAmt] = useState("");
  const [rateSaving, setRateSaving] = useState(false);

  const loadRates = useCallback(async () => {
    if (!backend) return;
    setRatesLoading(true);
    try {
      const result = await (backend as any).getCommissionRates();
      setRates(result ?? []);
    } catch {
      toast.error("Failed to load commission rates");
    } finally {
      setRatesLoading(false);
    }
  }, [backend]);

  useEffect(() => {
    loadRates();
  }, [loadRates]);

  const handleSaveRate = async () => {
    if (!backend) return;
    setRateSaving(true);
    try {
      await (backend as any).setCommissionRate(
        rateTier,
        BigInt(Number(rateLevel)),
        rateEarningType,
        BigInt(Math.round(Number(ratePercent) * 100)),
        BigInt(Math.round(Number(rateFlatAmt) * 100)),
      );
      toast.success("Commission rate saved");
      loadRates();
    } catch {
      toast.error("Failed to save rate");
    } finally {
      setRateSaving(false);
    }
  };

  const handleDeactivateRate = async (
    tier: string,
    level: bigint,
    earningType: string,
  ) => {
    if (!backend) return;
    try {
      await (backend as any).deactivateCommissionRate(tier, level, earningType);
      toast.success("Rate deactivated");
      loadRates();
    } catch {
      toast.error("Failed to deactivate rate");
    }
  };

  // ── Member Tiers state ────────────────────────────────────────────────────
  const [memberTiers, setMemberTiers] = useState<any[]>([]);
  const [memberTiersLoading, setMemberTiersLoading] = useState(false);
  const [setTierPrincipal, setSetTierPrincipal] = useState("");
  const [setTierValue, setSetTierValue] = useState("associate");
  const [setTierSaving, setSetTierSaving] = useState(false);

  const loadMemberTiers = useCallback(async () => {
    if (!backend) return;
    setMemberTiersLoading(true);
    try {
      const result = await (backend as any).listAllMemberTiers();
      setMemberTiers(result ?? []);
    } catch {
      toast.error("Failed to load member tiers");
    } finally {
      setMemberTiersLoading(false);
    }
  }, [backend]);

  const handleSetTier = async () => {
    if (!backend || !setTierPrincipal.trim()) return;
    setSetTierSaving(true);
    try {
      await (backend as any).setMemberTier(
        setTierPrincipal.trim(),
        setTierValue,
      );
      toast.success("Member tier updated");
      loadMemberTiers();
      setSetTierPrincipal("");
    } catch {
      toast.error("Failed to set tier");
    } finally {
      setSetTierSaving(false);
    }
  };

  // ── Pay Cycle state ───────────────────────────────────────────────────────
  const [payCyclePrincipal, setPayCyclePrincipal] = useState("");
  const [payCycleRunning, setPayCycleRunning] = useState(false);
  const [payCycleResult, setPayCycleResult] = useState<string | null>(null);
  const [earningsPrincipal, setEarningsPrincipal] = useState("");
  const [earningsLoading, setEarningsLoading] = useState(false);
  const [memberEarnings, setMemberEarnings] = useState<any[]>([]);

  const handleRunPayCycle = async () => {
    if (!backend || !payCyclePrincipal.trim()) return;
    setPayCycleRunning(true);
    setPayCycleResult(null);
    try {
      const result = await (backend as any).runPayCycle(
        payCyclePrincipal.trim(),
      );
      const count = typeof result === "bigint" ? Number(result) : (result ?? 0);
      setPayCycleResult(`${count} earnings marked as paid`);
      toast.success(`Pay cycle complete: ${count} records updated`);
    } catch {
      toast.error("Pay cycle failed");
    } finally {
      setPayCycleRunning(false);
    }
  };

  const handleLoadEarnings = async () => {
    if (!backend || !earningsPrincipal.trim()) return;
    setEarningsLoading(true);
    try {
      const result = await (backend as any).getMemberEarnings(
        earningsPrincipal.trim(),
      );
      setMemberEarnings(result ?? []);
    } catch {
      toast.error("Failed to load earnings");
    } finally {
      setEarningsLoading(false);
    }
  };

  // ── Reports & Pools state ─────────────────────────────────────────────────
  const [royaltyPools, setRoyaltyPools] = useState<any[]>([]);
  const [poolsLoading, setPoolsLoading] = useState(false);
  const [fsuStatus, setFsuStatus] = useState<any>(null);
  const [newPoolType, setNewPoolType] = useState("global");
  const [newPoolCurrency, setNewPoolCurrency] = useState("USD");
  const [newPoolStart, setNewPoolStart] = useState("");
  const [newPoolEnd, setNewPoolEnd] = useState("");
  const [poolCreating, setPoolCreating] = useState(false);
  const [fundPoolId, setFundPoolId] = useState("");
  const [fundPoolAmt, setFundPoolAmt] = useState("");
  const [fundPoolLoading, setFundPoolLoading] = useState(false);
  const [distPoolId, setDistPoolId] = useState("");
  const [distMinTier, setDistMinTier] = useState("0");
  const [distPoolLoading, setDistPoolLoading] = useState(false);
  const [fsuFundAmt, setFsuFundAmt] = useState("");
  const [fsuFunding, setFsuFunding] = useState(false);
  const [fsuDistUnits, setFsuDistUnits] = useState("");
  const [fsuDistDesc, setFsuDistDesc] = useState("");
  const [fsuDistributing, setFsuDistributing] = useState(false);

  const loadPools = useCallback(async () => {
    if (!backend) return;
    setPoolsLoading(true);
    try {
      const [pools, fsu] = await Promise.all([
        (backend as any).listRoyaltyPools(),
        (backend as any).getFSUPoolStatus(),
      ]);
      setRoyaltyPools(pools ?? []);
      setFsuStatus(fsu ?? null);
    } catch {
      toast.error("Failed to load pool data");
    } finally {
      setPoolsLoading(false);
    }
  }, [backend]);

  useEffect(() => {
    loadPools();
  }, [loadPools]);

  const handleCreatePool = async () => {
    if (!backend || !newPoolStart || !newPoolEnd) return;
    setPoolCreating(true);
    try {
      const startMs = new Date(newPoolStart).getTime();
      const endMs = new Date(newPoolEnd).getTime();
      await (backend as any).createRoyaltyPool(
        newPoolType,
        newPoolCurrency,
        BigInt(startMs * 1_000_000),
        BigInt(endMs * 1_000_000),
      );
      toast.success("Royalty pool created");
      loadPools();
    } catch {
      toast.error("Failed to create pool");
    } finally {
      setPoolCreating(false);
    }
  };

  const handleFundPool = async () => {
    if (!backend || !fundPoolId || !fundPoolAmt) return;
    setFundPoolLoading(true);
    try {
      await (backend as any).addToRoyaltyPool(
        BigInt(fundPoolId),
        BigInt(Math.round(Number(fundPoolAmt) * 100)),
      );
      toast.success("Pool funded");
      loadPools();
    } catch {
      toast.error("Failed to fund pool");
    } finally {
      setFundPoolLoading(false);
    }
  };

  const handleDistributePool = async () => {
    if (!backend || !distPoolId) return;
    setDistPoolLoading(true);
    try {
      await (backend as any).distributeRoyaltyPool(
        BigInt(distPoolId),
        BigInt(Number(distMinTier)),
      );
      toast.success("Pool distributed");
      loadPools();
    } catch {
      toast.error("Failed to distribute pool");
    } finally {
      setDistPoolLoading(false);
    }
  };

  const handleFundFSU = async () => {
    if (!backend || !fsuFundAmt) return;
    setFsuFunding(true);
    try {
      await (backend as any).addToFSUPool(
        BigInt(Math.round(Number(fsuFundAmt) * 100)),
      );
      toast.success("FSU pool funded");
      loadPools();
    } catch {
      toast.error("Failed to fund FSU pool");
    } finally {
      setFsuFunding(false);
    }
  };

  const handleDistributeFSU = async () => {
    if (!backend || !fsuDistUnits) return;
    setFsuDistributing(true);
    try {
      await (backend as any).distributeFSU(
        BigInt(Number(fsuDistUnits)),
        fsuDistDesc || "FSU Distribution",
      );
      toast.success("FSU distributed");
      loadPools();
    } catch {
      toast.error("Failed to distribute FSU");
    } finally {
      setFsuDistributing(false);
    }
  };

  const tierOptions = [
    "free",
    "associate",
    "affiliate",
    "partner",
    "executive",
    "ambassador",
    "founder",
  ];
  const earningTypeOptions = [
    "directReferral",
    "levelOverride",
    "royaltyPool",
    "eventCommission",
    "finFracFran",
    "activityBonus",
  ];
  const poolTypeOptions = ["global", "leadership", "event", "finFracFran"];

  const tierBadgeColor: Record<string, string> = {
    free: "bg-slate-500/20 text-slate-300",
    associate: "bg-blue-500/20 text-blue-300",
    affiliate: "bg-indigo-500/20 text-indigo-300",
    partner: "bg-violet-500/20 text-violet-300",
    executive: "bg-amber-500/20 text-amber-300",
    ambassador: "bg-emerald-500/20 text-emerald-300",
    founder: "bg-rose-500/20 text-rose-300",
  };

  const earningTypeBadgeColor: Record<string, string> = {
    directReferral: "bg-blue-500/20 text-blue-300",
    levelOverride: "bg-indigo-500/20 text-indigo-300",
    royaltyPool: "bg-amber-500/20 text-amber-300",
    eventCommission: "bg-emerald-500/20 text-emerald-300",
    finFracFran: "bg-rose-500/20 text-rose-300",
    activityBonus: "bg-cyan-500/20 text-cyan-300",
  };

  return (
    <Tabs defaultValue="rate-table" className="w-full">
      <TabsList className="mb-4 flex-wrap h-auto gap-1 bg-slate-800/50">
        <TabsTrigger
          value="rate-table"
          data-ocid="admin.mlm.rate_table.tab"
          className="text-xs"
        >
          Rate Table
        </TabsTrigger>
        <TabsTrigger
          value="member-tiers"
          data-ocid="admin.mlm.member_tiers.tab"
          className="text-xs"
        >
          Member Tiers
        </TabsTrigger>
        <TabsTrigger
          value="pay-cycles"
          data-ocid="admin.mlm.pay_cycles.tab"
          className="text-xs"
        >
          Pay Cycles
        </TabsTrigger>
        <TabsTrigger
          value="reports"
          data-ocid="admin.mlm.reports.tab"
          className="text-xs"
        >
          Reports &amp; Pools
        </TabsTrigger>
      </TabsList>

      {/* ── Rate Table ──────────────────────────────────────────────────── */}
      <TabsContent value="rate-table">
        <div className="space-y-6">
          <Card className="bg-slate-800/40 border-slate-700">
            <CardHeader>
              <CardTitle className="text-sm text-slate-200">
                Add / Edit Commission Rate
              </CardTitle>
              <CardDescription className="text-xs text-slate-400">
                Configure the MLM commission rate matrix
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-2 md:grid-cols-3 gap-3 mb-4">
                <div className="space-y-1">
                  <Label className="text-xs text-slate-400">Tier</Label>
                  <Select value={rateTier} onValueChange={setRateTier}>
                    <SelectTrigger
                      className="bg-slate-900 border-slate-600 text-slate-200 text-xs h-8"
                      data-ocid="admin.mlm.rate_tier.select"
                    >
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent className="bg-slate-900 border-slate-700">
                      {tierOptions.map((t) => (
                        <SelectItem
                          key={t}
                          value={t}
                          className="text-xs capitalize"
                        >
                          {t}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-1">
                  <Label className="text-xs text-slate-400">Level (1–6)</Label>
                  <Input
                    value={rateLevel}
                    onChange={(e) => setRateLevel(e.target.value)}
                    type="number"
                    min={1}
                    max={6}
                    className="bg-slate-900 border-slate-600 text-slate-200 text-xs h-8"
                    data-ocid="admin.mlm.rate_level.input"
                  />
                </div>
                <div className="space-y-1">
                  <Label className="text-xs text-slate-400">Earning Type</Label>
                  <Select
                    value={rateEarningType}
                    onValueChange={setRateEarningType}
                  >
                    <SelectTrigger
                      className="bg-slate-900 border-slate-600 text-slate-200 text-xs h-8"
                      data-ocid="admin.mlm.rate_type.select"
                    >
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent className="bg-slate-900 border-slate-700">
                      {earningTypeOptions.map((t) => (
                        <SelectItem key={t} value={t} className="text-xs">
                          {t}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-1">
                  <Label className="text-xs text-slate-400">Percent (%)</Label>
                  <Input
                    value={ratePercent}
                    onChange={(e) => setRatePercent(e.target.value)}
                    type="number"
                    step="0.01"
                    placeholder="e.g. 10.00"
                    className="bg-slate-900 border-slate-600 text-slate-200 text-xs h-8"
                    data-ocid="admin.mlm.rate_percent.input"
                  />
                </div>
                <div className="space-y-1">
                  <Label className="text-xs text-slate-400">
                    Flat Amount ($)
                  </Label>
                  <Input
                    value={rateFlatAmt}
                    onChange={(e) => setRateFlatAmt(e.target.value)}
                    type="number"
                    step="0.01"
                    placeholder="e.g. 10.00"
                    className="bg-slate-900 border-slate-600 text-slate-200 text-xs h-8"
                    data-ocid="admin.mlm.rate_flat.input"
                  />
                </div>
                <div className="flex items-end">
                  <Button
                    onClick={handleSaveRate}
                    disabled={rateSaving}
                    size="sm"
                    className="w-full h-8 text-xs bg-indigo-600 hover:bg-indigo-700"
                    data-ocid="admin.mlm.rate.save_button"
                  >
                    {rateSaving ? (
                      <Loader2 className="h-3 w-3 animate-spin mr-1" />
                    ) : null}
                    Save Rate
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="bg-slate-800/40 border-slate-700">
            <CardHeader className="flex flex-row items-center justify-between py-3">
              <CardTitle className="text-sm text-slate-200">
                Commission Rate Table
              </CardTitle>
              <Button
                variant="outline"
                size="sm"
                onClick={loadRates}
                disabled={ratesLoading}
                className="text-xs h-7 border-slate-600"
                data-ocid="admin.mlm.rates.button"
              >
                {ratesLoading ? (
                  <Loader2 className="h-3 w-3 animate-spin" />
                ) : (
                  "Refresh"
                )}
              </Button>
            </CardHeader>
            <CardContent className="p-0">
              {ratesLoading ? (
                <div className="p-4" data-ocid="admin.mlm.rates.loading_state">
                  <Skeleton className="h-32 w-full" />
                </div>
              ) : rates.length === 0 ? (
                <div
                  className="p-8 text-center text-slate-500 text-sm"
                  data-ocid="admin.mlm.rates.empty_state"
                >
                  No commission rates configured yet.
                </div>
              ) : (
                <Table>
                  <TableHeader>
                    <TableRow className="border-slate-700">
                      <TableHead className="text-xs text-slate-400">
                        Tier
                      </TableHead>
                      <TableHead className="text-xs text-slate-400">
                        Level
                      </TableHead>
                      <TableHead className="text-xs text-slate-400">
                        Type
                      </TableHead>
                      <TableHead className="text-xs text-slate-400">
                        %
                      </TableHead>
                      <TableHead className="text-xs text-slate-400">
                        Flat ($)
                      </TableHead>
                      <TableHead className="text-xs text-slate-400">
                        Status
                      </TableHead>
                      <TableHead className="text-xs text-slate-400" />
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {rates.map((r, i) => {
                      const tier = Object.keys(r.tier ?? {})[0] ?? "unknown";
                      const etype =
                        Object.keys(r.earningType ?? {})[0] ?? "unknown";
                      const level = Number(r.level ?? 0);
                      const pct = (Number(r.basisPoints ?? 0) / 100).toFixed(2);
                      const flat = (
                        Number(r.flatAmountCents ?? 0) / 100
                      ).toFixed(2);
                      return (
                        <TableRow
                          key={`${tier}-${String(level)}-${etype}`}
                          className="border-slate-700"
                          data-ocid={`admin.mlm.rate.item.${i + 1}`}
                        >
                          <TableCell>
                            <span
                              className={`px-1.5 py-0.5 rounded text-xs ${tierBadgeColor[tier] ?? "bg-slate-600/30 text-slate-300"}`}
                            >
                              {tier}
                            </span>
                          </TableCell>
                          <TableCell className="text-slate-300 text-xs">
                            {level}
                          </TableCell>
                          <TableCell>
                            <span
                              className={`px-1.5 py-0.5 rounded text-xs ${earningTypeBadgeColor[etype] ?? "bg-slate-600/30 text-slate-300"}`}
                            >
                              {etype}
                            </span>
                          </TableCell>
                          <TableCell className="text-slate-300 text-xs">
                            {pct}%
                          </TableCell>
                          <TableCell className="text-slate-300 text-xs">
                            ${flat}
                          </TableCell>
                          <TableCell>
                            {r.active ? (
                              <span className="px-1.5 py-0.5 rounded text-xs bg-emerald-500/20 text-emerald-300">
                                Active
                              </span>
                            ) : (
                              <span className="px-1.5 py-0.5 rounded text-xs bg-slate-600/30 text-slate-400">
                                Inactive
                              </span>
                            )}
                          </TableCell>
                          <TableCell>
                            {r.active && (
                              <Button
                                variant="ghost"
                                size="sm"
                                onClick={() =>
                                  handleDeactivateRate(
                                    tier,
                                    BigInt(level),
                                    etype,
                                  )
                                }
                                className="h-6 text-xs text-rose-400 hover:text-rose-300 hover:bg-rose-900/20"
                                data-ocid={`admin.mlm.rate.delete_button.${i + 1}`}
                              >
                                Deactivate
                              </Button>
                            )}
                          </TableCell>
                        </TableRow>
                      );
                    })}
                  </TableBody>
                </Table>
              )}
            </CardContent>
          </Card>
        </div>
      </TabsContent>

      {/* ── Member Tiers ─────────────────────────────────────────────────── */}
      <TabsContent value="member-tiers">
        <div className="space-y-6">
          <Card className="bg-slate-800/40 border-slate-700">
            <CardHeader>
              <CardTitle className="text-sm text-slate-200">
                Set Member Tier
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex gap-3 items-end flex-wrap">
                <div className="space-y-1 flex-1 min-w-[200px]">
                  <Label className="text-xs text-slate-400">
                    Member Principal
                  </Label>
                  <Input
                    value={setTierPrincipal}
                    onChange={(e) => setSetTierPrincipal(e.target.value)}
                    placeholder="xxxxx-xxxxx-..."
                    className="bg-slate-900 border-slate-600 text-slate-200 text-xs h-8"
                    data-ocid="admin.mlm.set_tier_principal.input"
                  />
                </div>
                <div className="space-y-1">
                  <Label className="text-xs text-slate-400">New Tier</Label>
                  <Select value={setTierValue} onValueChange={setSetTierValue}>
                    <SelectTrigger
                      className="bg-slate-900 border-slate-600 text-slate-200 text-xs h-8 w-40"
                      data-ocid="admin.mlm.set_tier.select"
                    >
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent className="bg-slate-900 border-slate-700">
                      {tierOptions.map((t) => (
                        <SelectItem
                          key={t}
                          value={t}
                          className="text-xs capitalize"
                        >
                          {t}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                <Button
                  onClick={handleSetTier}
                  disabled={setTierSaving || !setTierPrincipal.trim()}
                  size="sm"
                  className="h-8 text-xs bg-indigo-600 hover:bg-indigo-700"
                  data-ocid="admin.mlm.set_tier.save_button"
                >
                  {setTierSaving ? (
                    <Loader2 className="h-3 w-3 animate-spin mr-1" />
                  ) : null}
                  Set Tier
                </Button>
              </div>
            </CardContent>
          </Card>

          <Card className="bg-slate-800/40 border-slate-700">
            <CardHeader className="flex flex-row items-center justify-between py-3">
              <CardTitle className="text-sm text-slate-200">
                All Member Tiers
              </CardTitle>
              <Button
                variant="outline"
                size="sm"
                onClick={loadMemberTiers}
                disabled={memberTiersLoading}
                className="text-xs h-7 border-slate-600"
                data-ocid="admin.mlm.member_tiers.button"
              >
                {memberTiersLoading ? (
                  <Loader2 className="h-3 w-3 animate-spin" />
                ) : (
                  "Refresh"
                )}
              </Button>
            </CardHeader>
            <CardContent className="p-0">
              {memberTiersLoading ? (
                <div
                  className="p-4"
                  data-ocid="admin.mlm.member_tiers.loading_state"
                >
                  <Skeleton className="h-32 w-full" />
                </div>
              ) : memberTiers.length === 0 ? (
                <div
                  className="p-8 text-center text-slate-500 text-sm"
                  data-ocid="admin.mlm.member_tiers.empty_state"
                >
                  No member tier records yet.
                </div>
              ) : (
                <Table>
                  <TableHeader>
                    <TableRow className="border-slate-700">
                      <TableHead className="text-xs text-slate-400">
                        Principal
                      </TableHead>
                      <TableHead className="text-xs text-slate-400">
                        Tier
                      </TableHead>
                      <TableHead className="text-xs text-slate-400">
                        Level
                      </TableHead>
                      <TableHead className="text-xs text-slate-400">
                        Joined
                      </TableHead>
                      <TableHead className="text-xs text-slate-400">
                        Upgraded
                      </TableHead>
                      <TableHead className="text-xs text-slate-400">
                        Status
                      </TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {memberTiers.map((m, i) => {
                      const tier = Object.keys(m.tier ?? {})[0] ?? "free";
                      const tierLevelMap: Record<string, number> = {
                        free: 0,
                        associate: 1,
                        affiliate: 2,
                        partner: 3,
                        executive: 4,
                        ambassador: 5,
                        founder: 6,
                      };
                      return (
                        <TableRow
                          key={String(m.memberId ?? i)}
                          className="border-slate-700"
                          data-ocid={`admin.mlm.member_tier.item.${i + 1}`}
                        >
                          <TableCell className="font-mono text-xs text-slate-300">
                            {String(m.memberId ?? "").slice(0, 12)}…
                          </TableCell>
                          <TableCell>
                            <span
                              className={`px-1.5 py-0.5 rounded text-xs capitalize ${tierBadgeColor[tier] ?? "bg-slate-600/30 text-slate-300"}`}
                            >
                              {tier}
                            </span>
                          </TableCell>
                          <TableCell className="text-slate-300 text-xs">
                            {tierLevelMap[tier] ?? 0}
                          </TableCell>
                          <TableCell className="text-slate-300 text-xs">
                            {m.joinedAt
                              ? new Date(
                                  Number(m.joinedAt) / 1_000_000,
                                ).toLocaleDateString()
                              : "—"}
                          </TableCell>
                          <TableCell className="text-slate-300 text-xs">
                            {m.upgradedAt && m.upgradedAt.length > 0
                              ? new Date(
                                  Number(m.upgradedAt[0]) / 1_000_000,
                                ).toLocaleDateString()
                              : "—"}
                          </TableCell>
                          <TableCell>
                            {m.isActive ? (
                              <span className="px-1.5 py-0.5 rounded text-xs bg-emerald-500/20 text-emerald-300">
                                Active
                              </span>
                            ) : (
                              <span className="px-1.5 py-0.5 rounded text-xs bg-slate-600/30 text-slate-400">
                                Inactive
                              </span>
                            )}
                          </TableCell>
                        </TableRow>
                      );
                    })}
                  </TableBody>
                </Table>
              )}
            </CardContent>
          </Card>
        </div>
      </TabsContent>

      {/* ── Pay Cycles ───────────────────────────────────────────────────── */}
      <TabsContent value="pay-cycles">
        <div className="space-y-6">
          <Card className="bg-slate-800/40 border-slate-700">
            <CardHeader>
              <CardTitle className="text-sm text-slate-200">
                Run Pay Cycle
              </CardTitle>
              <CardDescription className="text-xs text-slate-400">
                Mark all pending earnings as paid for a specific member
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="flex gap-3 items-end flex-wrap">
                <div className="space-y-1 flex-1 min-w-[240px]">
                  <Label className="text-xs text-slate-400">
                    Member Principal
                  </Label>
                  <Input
                    value={payCyclePrincipal}
                    onChange={(e) => setPayCyclePrincipal(e.target.value)}
                    placeholder="xxxxx-xxxxx-..."
                    className="bg-slate-900 border-slate-600 text-slate-200 text-xs h-8"
                    data-ocid="admin.mlm.pay_cycle_principal.input"
                  />
                </div>
                <Button
                  onClick={handleRunPayCycle}
                  disabled={payCycleRunning || !payCyclePrincipal.trim()}
                  size="sm"
                  className="h-8 text-xs bg-emerald-600 hover:bg-emerald-700"
                  data-ocid="admin.mlm.pay_cycle.button"
                >
                  {payCycleRunning ? (
                    <Loader2 className="h-3 w-3 animate-spin mr-1" />
                  ) : null}
                  Run Pay Cycle
                </Button>
              </div>
              {payCycleResult && (
                <div
                  className="mt-3 px-3 py-2 rounded bg-emerald-900/30 border border-emerald-700/40 text-emerald-300 text-xs"
                  data-ocid="admin.mlm.pay_cycle.success_state"
                >
                  ✓ {payCycleResult}
                </div>
              )}
            </CardContent>
          </Card>

          <Card className="bg-slate-800/40 border-slate-700">
            <CardHeader>
              <CardTitle className="text-sm text-slate-200">
                View Member Earnings
              </CardTitle>
              <CardDescription className="text-xs text-slate-400">
                Load the full earnings ledger for any member
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="flex gap-3 items-end flex-wrap mb-4">
                <div className="space-y-1 flex-1 min-w-[240px]">
                  <Label className="text-xs text-slate-400">
                    Member Principal
                  </Label>
                  <Input
                    value={earningsPrincipal}
                    onChange={(e) => setEarningsPrincipal(e.target.value)}
                    placeholder="xxxxx-xxxxx-..."
                    className="bg-slate-900 border-slate-600 text-slate-200 text-xs h-8"
                    data-ocid="admin.mlm.earnings_principal.input"
                  />
                </div>
                <Button
                  onClick={handleLoadEarnings}
                  disabled={earningsLoading || !earningsPrincipal.trim()}
                  size="sm"
                  className="h-8 text-xs bg-indigo-600 hover:bg-indigo-700"
                  data-ocid="admin.mlm.load_earnings.button"
                >
                  {earningsLoading ? (
                    <Loader2 className="h-3 w-3 animate-spin mr-1" />
                  ) : null}
                  Load Earnings
                </Button>
              </div>
              {memberEarnings.length > 0 ? (
                <Table>
                  <TableHeader>
                    <TableRow className="border-slate-700">
                      <TableHead className="text-xs text-slate-400">
                        Date
                      </TableHead>
                      <TableHead className="text-xs text-slate-400">
                        Type
                      </TableHead>
                      <TableHead className="text-xs text-slate-400">
                        Amount ($)
                      </TableHead>
                      <TableHead className="text-xs text-slate-400">
                        Level
                      </TableHead>
                      <TableHead className="text-xs text-slate-400">
                        Status
                      </TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {memberEarnings.map((e, i) => {
                      const etype =
                        Object.keys(e.earningType ?? {})[0] ?? "unknown";
                      const status =
                        Object.keys(e.status ?? {})[0] ?? "pending";
                      const statusColor =
                        status === "paid"
                          ? "bg-emerald-500/20 text-emerald-300"
                          : status === "processing"
                            ? "bg-sky-500/20 text-sky-300"
                            : "bg-amber-500/20 text-amber-300";
                      return (
                        <TableRow
                          key={String(e.id ?? i)}
                          className="border-slate-700"
                          data-ocid={`admin.mlm.earning.item.${i + 1}`}
                        >
                          <TableCell className="text-slate-300 text-xs">
                            {e.createdAt
                              ? new Date(
                                  Number(e.createdAt) / 1_000_000,
                                ).toLocaleDateString()
                              : "—"}
                          </TableCell>
                          <TableCell>
                            <span
                              className={`px-1.5 py-0.5 rounded text-xs ${earningTypeBadgeColor[etype] ?? "bg-slate-600/30 text-slate-300"}`}
                            >
                              {etype}
                            </span>
                          </TableCell>
                          <TableCell className="text-slate-200 text-xs font-medium">
                            ${(Number(e.amountCents ?? 0) / 100).toFixed(2)}
                          </TableCell>
                          <TableCell className="text-slate-300 text-xs">
                            {Number(e.level ?? 0)}
                          </TableCell>
                          <TableCell>
                            <span
                              className={`px-1.5 py-0.5 rounded text-xs ${statusColor}`}
                            >
                              {status}
                            </span>
                          </TableCell>
                        </TableRow>
                      );
                    })}
                  </TableBody>
                </Table>
              ) : earningsPrincipal && !earningsLoading ? (
                <div
                  className="text-center text-slate-500 text-sm py-6"
                  data-ocid="admin.mlm.earnings.empty_state"
                >
                  No earnings found for this member.
                </div>
              ) : null}
            </CardContent>
          </Card>
        </div>
      </TabsContent>

      {/* ── Reports & Pools ──────────────────────────────────────────────── */}
      <TabsContent value="reports">
        <div className="space-y-6">
          {/* FSU Pool Status */}
          <Card className="bg-slate-800/40 border-slate-700">
            <CardHeader className="flex flex-row items-center justify-between py-3">
              <div>
                <CardTitle className="text-sm text-slate-200">
                  FinFracFran™ FSU Pool
                </CardTitle>
                <CardDescription className="text-xs text-slate-400">
                  Fractal Franchise Share Unit distribution pool
                </CardDescription>
              </div>
              <Button
                variant="outline"
                size="sm"
                onClick={loadPools}
                disabled={poolsLoading}
                className="text-xs h-7 border-slate-600"
                data-ocid="admin.mlm.pools.button"
              >
                {poolsLoading ? (
                  <Loader2 className="h-3 w-3 animate-spin" />
                ) : (
                  "Refresh"
                )}
              </Button>
            </CardHeader>
            <CardContent>
              {fsuStatus ? (
                <div className="grid grid-cols-3 gap-4 mb-4">
                  <div className="bg-slate-900/60 rounded p-3">
                    <p className="text-xs text-slate-400">Pool Size</p>
                    <p className="text-lg font-semibold text-amber-400">
                      $
                      {(Number(fsuStatus.totalPoolCents ?? 0) / 100).toFixed(2)}
                    </p>
                  </div>
                  <div className="bg-slate-900/60 rounded p-3">
                    <p className="text-xs text-slate-400">FSU Outstanding</p>
                    <p className="text-lg font-semibold text-slate-200">
                      {Number(
                        fsuStatus.totalFSUOutstanding ?? 0,
                      ).toLocaleString()}
                    </p>
                  </div>
                  <div className="bg-slate-900/60 rounded p-3">
                    <p className="text-xs text-slate-400">Value / FSU</p>
                    <p className="text-lg font-semibold text-emerald-400">
                      ${(Number(fsuStatus.fsuValueCents ?? 0) / 100).toFixed(4)}
                    </p>
                  </div>
                </div>
              ) : (
                <div
                  className="text-xs text-slate-500 mb-4"
                  data-ocid="admin.mlm.fsu.loading_state"
                >
                  Loading FSU status…
                </div>
              )}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label className="text-xs text-slate-400">
                    Fund FSU Pool ($)
                  </Label>
                  <div className="flex gap-2">
                    <Input
                      value={fsuFundAmt}
                      onChange={(e) => setFsuFundAmt(e.target.value)}
                      type="number"
                      step="0.01"
                      placeholder="Amount in $"
                      className="bg-slate-900 border-slate-600 text-slate-200 text-xs h-8"
                      data-ocid="admin.mlm.fsu_fund.input"
                    />
                    <Button
                      onClick={handleFundFSU}
                      disabled={fsuFunding || !fsuFundAmt}
                      size="sm"
                      className="h-8 text-xs bg-amber-600 hover:bg-amber-700 whitespace-nowrap"
                      data-ocid="admin.mlm.fsu_fund.button"
                    >
                      {fsuFunding ? (
                        <Loader2 className="h-3 w-3 animate-spin" />
                      ) : (
                        "Fund Pool"
                      )}
                    </Button>
                  </div>
                </div>
                <div className="space-y-2">
                  <Label className="text-xs text-slate-400">
                    Distribute FSU Units
                  </Label>
                  <div className="flex gap-2">
                    <Input
                      value={fsuDistUnits}
                      onChange={(e) => setFsuDistUnits(e.target.value)}
                      type="number"
                      placeholder="Units"
                      className="bg-slate-900 border-slate-600 text-slate-200 text-xs h-8 w-24"
                      data-ocid="admin.mlm.fsu_dist_units.input"
                    />
                    <Input
                      value={fsuDistDesc}
                      onChange={(e) => setFsuDistDesc(e.target.value)}
                      placeholder="Description"
                      className="bg-slate-900 border-slate-600 text-slate-200 text-xs h-8 flex-1"
                      data-ocid="admin.mlm.fsu_dist_desc.input"
                    />
                    <Button
                      onClick={handleDistributeFSU}
                      disabled={fsuDistributing || !fsuDistUnits}
                      size="sm"
                      className="h-8 text-xs bg-rose-600 hover:bg-rose-700 whitespace-nowrap"
                      data-ocid="admin.mlm.fsu_distribute.button"
                    >
                      {fsuDistributing ? (
                        <Loader2 className="h-3 w-3 animate-spin" />
                      ) : (
                        "Distribute"
                      )}
                    </Button>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Royalty Pools */}
          <Card className="bg-slate-800/40 border-slate-700">
            <CardHeader>
              <CardTitle className="text-sm text-slate-200">
                Royalty Pools
              </CardTitle>
              <CardDescription className="text-xs text-slate-400">
                Create, fund, and distribute royalty pools
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              {/* Create Pool */}
              <div className="rounded border border-slate-700 p-4 bg-slate-900/30">
                <p className="text-xs font-medium text-slate-300 mb-3">
                  Create New Pool
                </p>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                  <div className="space-y-1">
                    <Label className="text-xs text-slate-400">Pool Type</Label>
                    <Select value={newPoolType} onValueChange={setNewPoolType}>
                      <SelectTrigger
                        className="bg-slate-900 border-slate-600 text-slate-200 text-xs h-8"
                        data-ocid="admin.mlm.new_pool_type.select"
                      >
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent className="bg-slate-900 border-slate-700">
                        {poolTypeOptions.map((t) => (
                          <SelectItem key={t} value={t} className="text-xs">
                            {t}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="space-y-1">
                    <Label className="text-xs text-slate-400">Currency</Label>
                    <Select
                      value={newPoolCurrency}
                      onValueChange={setNewPoolCurrency}
                    >
                      <SelectTrigger
                        className="bg-slate-900 border-slate-600 text-slate-200 text-xs h-8"
                        data-ocid="admin.mlm.new_pool_currency.select"
                      >
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent className="bg-slate-900 border-slate-700">
                        {["USD", "EUR", "GBP", "ICP"].map((c) => (
                          <SelectItem key={c} value={c} className="text-xs">
                            {c}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="space-y-1">
                    <Label className="text-xs text-slate-400">
                      Period Start
                    </Label>
                    <Input
                      value={newPoolStart}
                      onChange={(e) => setNewPoolStart(e.target.value)}
                      type="date"
                      className="bg-slate-900 border-slate-600 text-slate-200 text-xs h-8"
                      data-ocid="admin.mlm.new_pool_start.input"
                    />
                  </div>
                  <div className="space-y-1">
                    <Label className="text-xs text-slate-400">Period End</Label>
                    <Input
                      value={newPoolEnd}
                      onChange={(e) => setNewPoolEnd(e.target.value)}
                      type="date"
                      className="bg-slate-900 border-slate-600 text-slate-200 text-xs h-8"
                      data-ocid="admin.mlm.new_pool_end.input"
                    />
                  </div>
                </div>
                <Button
                  onClick={handleCreatePool}
                  disabled={poolCreating || !newPoolStart || !newPoolEnd}
                  size="sm"
                  className="mt-3 h-8 text-xs bg-indigo-600 hover:bg-indigo-700"
                  data-ocid="admin.mlm.create_pool.button"
                >
                  {poolCreating ? (
                    <Loader2 className="h-3 w-3 animate-spin mr-1" />
                  ) : null}
                  Create Pool
                </Button>
              </div>

              {/* Fund / Distribute */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="rounded border border-slate-700 p-4 bg-slate-900/30 space-y-2">
                  <p className="text-xs font-medium text-slate-300">
                    Fund a Pool
                  </p>
                  <div className="flex gap-2">
                    <Input
                      value={fundPoolId}
                      onChange={(e) => setFundPoolId(e.target.value)}
                      type="number"
                      placeholder="Pool ID"
                      className="bg-slate-900 border-slate-600 text-slate-200 text-xs h-8 w-24"
                      data-ocid="admin.mlm.fund_pool_id.input"
                    />
                    <Input
                      value={fundPoolAmt}
                      onChange={(e) => setFundPoolAmt(e.target.value)}
                      type="number"
                      step="0.01"
                      placeholder="Amount ($)"
                      className="bg-slate-900 border-slate-600 text-slate-200 text-xs h-8 flex-1"
                      data-ocid="admin.mlm.fund_pool_amt.input"
                    />
                    <Button
                      onClick={handleFundPool}
                      disabled={fundPoolLoading || !fundPoolId || !fundPoolAmt}
                      size="sm"
                      className="h-8 text-xs bg-amber-600 hover:bg-amber-700"
                      data-ocid="admin.mlm.fund_pool.button"
                    >
                      {fundPoolLoading ? (
                        <Loader2 className="h-3 w-3 animate-spin" />
                      ) : (
                        "Fund"
                      )}
                    </Button>
                  </div>
                </div>
                <div className="rounded border border-slate-700 p-4 bg-slate-900/30 space-y-2">
                  <p className="text-xs font-medium text-slate-300">
                    Distribute a Pool
                  </p>
                  <div className="flex gap-2">
                    <Input
                      value={distPoolId}
                      onChange={(e) => setDistPoolId(e.target.value)}
                      type="number"
                      placeholder="Pool ID"
                      className="bg-slate-900 border-slate-600 text-slate-200 text-xs h-8 w-24"
                      data-ocid="admin.mlm.dist_pool_id.input"
                    />
                    <Input
                      value={distMinTier}
                      onChange={(e) => setDistMinTier(e.target.value)}
                      type="number"
                      min={0}
                      max={6}
                      placeholder="Min Tier (0-6)"
                      className="bg-slate-900 border-slate-600 text-slate-200 text-xs h-8 flex-1"
                      data-ocid="admin.mlm.dist_min_tier.input"
                    />
                    <Button
                      onClick={handleDistributePool}
                      disabled={distPoolLoading || !distPoolId}
                      size="sm"
                      className="h-8 text-xs bg-emerald-600 hover:bg-emerald-700"
                      data-ocid="admin.mlm.distribute_pool.button"
                    >
                      {distPoolLoading ? (
                        <Loader2 className="h-3 w-3 animate-spin" />
                      ) : (
                        "Distribute"
                      )}
                    </Button>
                  </div>
                </div>
              </div>

              {/* Pool Table */}
              {poolsLoading ? (
                <div data-ocid="admin.mlm.pools.loading_state">
                  <Skeleton className="h-24 w-full" />
                </div>
              ) : royaltyPools.length === 0 ? (
                <div
                  className="text-center text-slate-500 text-sm py-6"
                  data-ocid="admin.mlm.pools.empty_state"
                >
                  No royalty pools created yet.
                </div>
              ) : (
                <Table>
                  <TableHeader>
                    <TableRow className="border-slate-700">
                      <TableHead className="text-xs text-slate-400">
                        ID
                      </TableHead>
                      <TableHead className="text-xs text-slate-400">
                        Type
                      </TableHead>
                      <TableHead className="text-xs text-slate-400">
                        Total ($)
                      </TableHead>
                      <TableHead className="text-xs text-slate-400">
                        Currency
                      </TableHead>
                      <TableHead className="text-xs text-slate-400">
                        Period
                      </TableHead>
                      <TableHead className="text-xs text-slate-400">
                        Distributed
                      </TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {royaltyPools.map((p, i) => {
                      const poolType =
                        Object.keys(p.poolType ?? {})[0] ?? "global";
                      const distributed = p.isDistributed ?? false;
                      return (
                        <TableRow
                          key={String(p.id ?? i)}
                          className="border-slate-700"
                          data-ocid={`admin.mlm.pool.item.${i + 1}`}
                        >
                          <TableCell className="text-slate-300 text-xs font-mono">
                            {String(p.id ?? "")}
                          </TableCell>
                          <TableCell>
                            <span className="px-1.5 py-0.5 rounded text-xs bg-violet-500/20 text-violet-300">
                              {poolType}
                            </span>
                          </TableCell>
                          <TableCell className="text-slate-200 text-xs font-medium">
                            $
                            {(Number(p.totalAmountCents ?? 0) / 100).toFixed(2)}
                          </TableCell>
                          <TableCell className="text-slate-300 text-xs">
                            {p.currency ?? "USD"}
                          </TableCell>
                          <TableCell className="text-slate-300 text-xs">
                            {p.periodStart
                              ? new Date(
                                  Number(p.periodStart) / 1_000_000,
                                ).toLocaleDateString()
                              : "—"}{" "}
                            –{" "}
                            {p.periodEnd
                              ? new Date(
                                  Number(p.periodEnd) / 1_000_000,
                                ).toLocaleDateString()
                              : "—"}
                          </TableCell>
                          <TableCell>
                            {distributed ? (
                              <span className="px-1.5 py-0.5 rounded text-xs bg-emerald-500/20 text-emerald-300">
                                Yes
                              </span>
                            ) : (
                              <span className="px-1.5 py-0.5 rounded text-xs bg-amber-500/20 text-amber-300">
                                Pending
                              </span>
                            )}
                          </TableCell>
                        </TableRow>
                      );
                    })}
                  </TableBody>
                </Table>
              )}
            </CardContent>
          </Card>
        </div>
      </TabsContent>
    </Tabs>
  );
}

// ── Main AdminPage ────────────────────────────────────────────────────────────
export function AdminPage() {
  const { user } = useAuth();
  const backend = useBackend();
  const [orgs, setOrgs] = useState<Organization[]>([]);
  const [campaigns, setCampaigns] = useState<Campaign[]>([]);
  const [threads, setThreads] = useState<ForumThread[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchOverview() {
      if (!backend) return;
      setLoading(true);
      try {
        const [orgData, campaignData, threadData] = await Promise.all([
          backend.listOrgs(),
          backend.listCampaigns(),
          backend.listThreads(),
        ]);
        setOrgs(orgData);
        setCampaigns(campaignData);
        setThreads(threadData);
      } catch {
        toast.error("Failed to load platform data");
      } finally {
        setLoading(false);
      }
    }
    fetchOverview();
  }, [backend]);

  return (
    <Layout breadcrumb="Admin Dashboard">
      {/* Page Header */}
      <div className="civic-gradient text-white px-6 py-7 relative overflow-hidden">
        <div
          className="absolute inset-0 opacity-10"
          style={{
            backgroundImage:
              "radial-gradient(circle at 80% 50%, white 1px, transparent 1px)",
            backgroundSize: "24px 24px",
          }}
        />
        <div className="relative">
          <div className="flex items-center gap-2 mb-1">
            <Shield size={18} className="text-amber-400" />
            <span className="text-xs font-bold uppercase tracking-widest text-amber-400">
              Admin
            </span>
          </div>
          <h1 className="text-2xl font-bold font-display">Admin Dashboard</h1>
          <p className="text-sm text-white/70 mt-0.5">
            Platform management and moderation
          </p>
          {user && (
            <div className="mt-2 flex items-center gap-2">
              <Badge className="bg-white/15 text-white border-0 text-xs">
                <Users size={10} className="mr-1" />
                {user.name}
              </Badge>
              <Badge className="bg-amber-500/30 text-amber-200 border-0 text-xs">
                <Activity size={10} className="mr-1" />
                {user.role.replace("_", " ")}
              </Badge>
            </div>
          )}
        </div>
      </div>

      <div className="px-4 sm:px-6 py-6">
        <Tabs defaultValue="overview">
          <TabsList className="mb-6 flex-wrap h-auto gap-1 bg-muted/50 p-1">
            <TabsTrigger
              value="overview"
              className="text-xs gap-1.5"
              data-ocid="admin.overview.tab"
            >
              <Activity size={13} />
              Overview
            </TabsTrigger>
            <TabsTrigger
              value="vendors"
              className="text-xs gap-1.5"
              data-ocid="admin.vendors.tab"
            >
              <ShoppingBag size={13} />
              Vendors
            </TabsTrigger>
            <TabsTrigger
              value="forums"
              className="text-xs gap-1.5"
              data-ocid="admin.forums.tab"
            >
              <MessageSquare size={13} />
              Forums
            </TabsTrigger>
            <TabsTrigger
              value="orgs"
              className="text-xs gap-1.5"
              data-ocid="admin.orgs.tab"
            >
              <Building2 size={13} />
              Orgs & Campaigns
            </TabsTrigger>
            <TabsTrigger
              value="content"
              className="text-xs gap-1.5"
              data-ocid="admin.content.tab"
            >
              <BookOpen size={13} />
              Content
            </TabsTrigger>
            <TabsTrigger
              value="tenants"
              className="text-xs gap-1.5"
              data-ocid="admin.tenants.tab"
            >
              <Building size={13} />
              Tenants
            </TabsTrigger>
            <TabsTrigger
              value="analytics"
              className="text-xs gap-1.5"
              data-ocid="admin.analytics.tab"
            >
              <BarChart2 size={13} />
              Analytics
            </TabsTrigger>
            <TabsTrigger
              value="mlm"
              className="text-xs gap-1.5"
              data-ocid="admin.mlm.tab"
            >
              <TrendingUp size={13} />
              MLM
            </TabsTrigger>
          </TabsList>

          <TabsContent value="overview">
            <OverviewTab
              orgs={orgs}
              campaigns={campaigns}
              threads={threads}
              loading={loading}
            />
          </TabsContent>

          <TabsContent value="vendors">
            <VendorsTab />
          </TabsContent>

          <TabsContent value="forums">
            {loading ? (
              <div data-ocid="admin.forums.loading_state">
                <TableSkeleton rows={5} cols={5} />
              </div>
            ) : (
              <ForumsTab threads={threads} />
            )}
          </TabsContent>

          <TabsContent value="orgs">
            {loading ? (
              <div data-ocid="admin.overview.loading_state">
                <TableSkeleton rows={5} cols={4} />
              </div>
            ) : (
              <CampaignsOrgsTab orgs={orgs} campaigns={campaigns} />
            )}
          </TabsContent>

          <TabsContent value="content">
            <ContentTab />
          </TabsContent>
          <TabsContent value="tenants">
            <TenantsTab />
          </TabsContent>
          <TabsContent value="analytics">
            <AnalyticsTab />
          </TabsContent>
          <TabsContent value="mlm">
            <MLMAdminTab />
          </TabsContent>
        </Tabs>
      </div>
    </Layout>
  );
}
