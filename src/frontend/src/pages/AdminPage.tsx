import type {
  Campaign,
  Credential,
  DAOTokenRecord,
  ForumThread,
  Organization,
} from "@/backend";
import {
  CampaignStatus,
  OrgStatus,
  ProposalStatus,
  ProposalType,
  ThreadStatus,
} from "@/backend";
import type { CredentialType } from "@/backend";
import type { Proposal } from "@/backend";
import type { Tenant } from "@/backend";
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
  CrowdfundingCampaign,
  CrowdfundingConfig,
  CrowdfundingPledge,
  ExtendedBackend,
  FSUPoolStatus,
  PlatformAnalytics,
} from "@/types/appTypes";
import type { Principal } from "@icp-sdk/core/principal";

// Helper: cast backend to ExtendedBackend for admin cross-tenant calls
function asAdmin(
  backend: ReturnType<typeof useBackend>,
): ExtendedBackend | null {
  return backend as unknown as ExtendedBackend | null;
}
import { TenantStatus, TenantTier } from "@/types/appTypes";
import {
  Activity,
  Award,
  BarChart2,
  BookOpen,
  Building,
  Building2,
  CheckCircle,
  Clock,
  Coins,
  FileText,
  HelpCircle,
  Loader2,
  Lock,
  MessageSquare,
  Pin,
  Radio,
  Scale,
  Shield,
  ShoppingBag,
  Sparkles,
  Target,
  Trash2,
  TrendingUp,
  Users,
  Vote,
  Wallet,
  XCircle,
  Zap,
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

  // Trial expiry automation state
  const [expiryRunning, setExpiryRunning] = useState(false);
  const [expiryResult, setExpiryResult] = useState<{
    expired: bigint;
    checked: bigint;
  } | null>(null);
  const [expiryError, setExpiryError] = useState<string | null>(null);
  const [expiringTrials, setExpiringTrials] = useState<Tenant[]>([]);
  const [expiringLoading, setExpiringLoading] = useState(true);

  // Auto-timer status state
  const [timerStatus, setTimerStatus] = useState<{
    lastCheck: bigint;
    nextCheckIn: string;
  } | null>(null);
  const [timerStatusLoading, setTimerStatusLoading] = useState(true);

  // Send notifications state
  const [notifSending, setNotifSending] = useState(false);
  const [notifMessage, setNotifMessage] = useState<string | null>(null);

  const loadExpiringTrials = useCallback(async () => {
    if (!backend) return;
    setExpiringLoading(true);
    try {
      const eb = backend as unknown as ExtendedBackend;
      const results = await eb.getExpiringTrials(BigInt(7));
      setExpiringTrials(results);
    } catch {
      // non-critical — silently ignore
    } finally {
      setExpiringLoading(false);
    }
  }, [backend]);

  const loadTimerStatus = useCallback(async () => {
    if (!backend) return;
    setTimerStatusLoading(true);
    try {
      const eb = backend as unknown as ExtendedBackend;
      const status = await eb.getTrialAutomationStatus();
      setTimerStatus(status);
    } catch {
      setTimerStatus(null);
    } finally {
      setTimerStatusLoading(false);
    }
  }, [backend]);

  useEffect(() => {
    if (!backend) return;
    setLoading(true);
    backend
      .listAllTenants()
      .then((data) => setTenants(data))
      .catch(() => {})
      .finally(() => setLoading(false));
    loadExpiringTrials();
    loadTimerStatus();
  }, [backend, loadExpiringTrials, loadTimerStatus]);

  async function handleRunExpiryCheck() {
    if (!backend) return;
    setExpiryRunning(true);
    setExpiryResult(null);
    setExpiryError(null);
    try {
      const eb = backend as unknown as ExtendedBackend;
      const result = await eb.checkAndExpireTrials();
      setExpiryResult(result);
      // Refresh both lists after running
      const [updatedTenants] = await Promise.all([
        backend.listAllTenants(),
        loadExpiringTrials(),
      ]);
      setTenants(updatedTenants);
    } catch (err) {
      setExpiryError(
        err instanceof Error ? err.message : "Failed to run expiry check",
      );
    } finally {
      setExpiryRunning(false);
    }
  }

  async function handleSendNotifications() {
    if (!backend) return;
    setNotifSending(true);
    setNotifMessage(null);
    try {
      const eb = backend as unknown as ExtendedBackend;
      const msg = await eb.sendTrialExpiryNotifications();
      setNotifMessage(msg);
      toast.success(msg || "Trial expiry notifications sent");
    } catch (err) {
      const errMsg =
        err instanceof Error ? err.message : "Failed to send notifications";
      toast.error(errMsg);
    } finally {
      setNotifSending(false);
    }
  }

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

  return (
    <div className="space-y-6">
      {/* ── Trial Expiry Automation Panel ─────────────────────────────────── */}
      <Card
        className="border-border bg-card"
        data-ocid="admin.tenants.expiry_automation"
      >
        <CardHeader className="pb-3">
          <div className="flex items-center justify-between gap-4 flex-wrap">
            <CardTitle className="flex items-center gap-2 text-sm font-semibold">
              <Clock size={15} className="text-primary" />
              Trial Expiry Automation
            </CardTitle>
            <div className="flex items-center gap-2 flex-wrap">
              <Button
                size="sm"
                variant="outline"
                className="text-xs"
                disabled={notifSending}
                onClick={handleSendNotifications}
                data-ocid="admin.tenants.send_notifications.button"
              >
                {notifSending ? (
                  <Loader2 size={12} className="mr-1.5 animate-spin" />
                ) : (
                  <Radio size={12} className="mr-1.5" />
                )}
                {notifSending ? "Sending…" : "Send Trial Notifications"}
              </Button>
              <Button
                size="sm"
                variant="outline"
                className="text-xs"
                disabled={expiryRunning}
                onClick={handleRunExpiryCheck}
                data-ocid="admin.tenants.run_expiry_check.button"
              >
                {expiryRunning ? (
                  <Loader2 size={12} className="mr-1.5 animate-spin" />
                ) : (
                  <Clock size={12} className="mr-1.5" />
                )}
                {expiryRunning ? "Running…" : "Run Expiry Check"}
              </Button>
            </div>
          </div>
        </CardHeader>
        <CardContent className="space-y-4">
          {/* Auto-timer status card */}
          <div
            className="flex items-center gap-3 rounded-md border border-emerald-500/30 bg-emerald-500/5 px-3 py-2.5"
            data-ocid="admin.tenants.timer_status_card"
          >
            {timerStatusLoading ? (
              <span className="text-xs text-muted-foreground">
                Auto-timer: Active — checking…
              </span>
            ) : (
              <div className="flex flex-col gap-0.5 min-w-0">
                <div className="flex items-center gap-1.5">
                  <span className="w-2 h-2 rounded-full bg-emerald-500 shrink-0 animate-pulse" />
                  <span className="text-xs font-medium text-emerald-500">
                    Auto-timer: Active
                  </span>
                </div>
                <span className="text-xs text-muted-foreground pl-3.5">
                  Next check: {timerStatus?.nextCheckIn ?? "in ~24h"}
                </span>
              </div>
            )}
          </div>

          {/* Notifications result banner */}
          {notifMessage && (
            <div
              className="flex items-center gap-2 rounded-md bg-sky-500/10 border border-sky-500/30 px-3 py-2 text-sm text-sky-400"
              data-ocid="admin.tenants.notif_result_banner"
            >
              <CheckCircle size={14} className="shrink-0" />
              {notifMessage}
            </div>
          )}

          {/* Result / error banners */}
          {expiryResult && (
            <div
              className="flex items-center gap-2 rounded-md bg-emerald-500/10 border border-emerald-500/30 px-3 py-2 text-sm text-emerald-400"
              data-ocid="admin.tenants.expiry_result_banner"
            >
              <CheckCircle size={14} className="shrink-0" />
              Checked{" "}
              <span className="font-semibold">
                {String(expiryResult.checked)}
              </span>{" "}
              tenant{expiryResult.checked !== BigInt(1) ? "s" : ""} —{" "}
              <span className="font-semibold">
                {String(expiryResult.expired)}
              </span>{" "}
              trial{expiryResult.expired !== BigInt(1) ? "s" : ""} suspended.
            </div>
          )}
          {expiryError && (
            <div
              className="flex items-center gap-2 rounded-md bg-red-500/10 border border-red-500/30 px-3 py-2 text-sm text-red-400"
              data-ocid="admin.tenants.expiry_error_banner"
            >
              <XCircle size={14} className="shrink-0" />
              {expiryError}
            </div>
          )}

          {/* Expiring Soon sub-section */}
          <div>
            <p className="text-xs font-medium text-muted-foreground mb-2">
              Expiring Soon (next 7 days)
            </p>
            {expiringLoading ? (
              <div className="space-y-1.5">
                <Skeleton className="h-8 w-full rounded" />
                <Skeleton className="h-8 w-full rounded" />
              </div>
            ) : expiringTrials.length === 0 ? (
              <p
                className="text-xs text-muted-foreground italic"
                data-ocid="admin.tenants.expiring_empty"
              >
                No trials expiring in the next 7 days.
              </p>
            ) : (
              <div
                className="space-y-1"
                data-ocid="admin.tenants.expiring_list"
              >
                {expiringTrials.map((t, idx) => (
                  <div
                    key={t.id}
                    className="flex items-center justify-between gap-3 rounded-md bg-muted/30 px-3 py-2 text-xs"
                    data-ocid={`admin.tenants.expiring_item.${idx + 1}`}
                  >
                    <span className="font-medium truncate min-w-0">
                      {t.name}
                    </span>
                    <span className="font-mono text-muted-foreground shrink-0">
                      {t.ownerPrincipal.toString().slice(0, 10)}…
                    </span>
                    <span className="shrink-0">{tierBadge(t.tier)}</span>
                    <span className="text-muted-foreground shrink-0">
                      {t.trialEndsAt
                        ? new Date(
                            Number(t.trialEndsAt) / 1_000_000,
                          ).toLocaleDateString()
                        : "—"}
                    </span>
                  </div>
                ))}
              </div>
            )}
          </div>
        </CardContent>
      </Card>

      {/* ── Tenant Table ───────────────────────────────────────────────────── */}
      {loading ? (
        <div data-ocid="admin.tenants.loading_state" className="space-y-3">
          {[1, 2, 3].map((i) => (
            <Skeleton key={i} className="h-12 w-full rounded-lg" />
          ))}
        </div>
      ) : tenants.length === 0 ? (
        <div
          data-ocid="admin.tenants.empty_state"
          className="text-center py-16 text-muted-foreground"
        >
          <Building size={32} className="mx-auto mb-3 opacity-30" />
          <p className="text-sm">No tenants registered yet.</p>
        </div>
      ) : (
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
                  <TableCell className="font-medium">{tenant.name}</TableCell>
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
      )}
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

// ── Crowdfunding Admin Tab ────────────────────────────────────────────────────
function CrowdfundingAdminTab() {
  const backend = useBackend();
  const ext = backend as unknown as ExtendedBackend;

  // FinFracFran™ Config state
  const [config, setConfig] = useState<CrowdfundingConfig | null>(null);
  const [configLoading, setConfigLoading] = useState(true);
  const [cfgFSUBps, setCfgFSUBps] = useState("500");
  const [cfgCreatorBonus, setCfgCreatorBonus] = useState("100");
  const [cfgMilestoneBps, setCfgMilestoneBps] = useState("200");
  const [savingConfig, setSavingConfig] = useState(false);

  // Campaign list state
  const [campaigns, setCampaigns] = useState<CrowdfundingCampaign[]>([]);
  const [campaignsLoading, setCampaignsLoading] = useState(true);
  const [actionLoading, setActionLoading] = useState<string | null>(null);
  const [selectedCampaignId, setSelectedCampaignId] = useState<string | null>(
    null,
  );

  // Pledge analytics state
  const [pledges, setPledges] = useState<CrowdfundingPledge[]>([]);
  const [pledgesLoading, setPledgesLoading] = useState(false);

  // FSU Pool state
  const [fsuStatus, setFsuStatus] = useState<FSUPoolStatus | null>(null);
  const [fsuLoading, setFsuLoading] = useState(true);
  const [fsuFundAmt, setFsuFundAmt] = useState("");
  const [fsuFundDesc, setFsuFundDesc] = useState("");
  const [fsuFunding, setFsuFunding] = useState(false);
  const [fsuDistUnits, setFsuDistUnits] = useState("");
  const [fsuDistDesc, setFsuDistDesc] = useState("");
  const [fsuDistributing, setFsuDistributing] = useState(false);

  const loadConfig = useCallback(async () => {
    if (!backend) return;
    setConfigLoading(true);
    try {
      const cfg = await ext.getCrowdfundingConfig();
      setConfig(cfg);
      setCfgFSUBps(String(Number(cfg.defaultFSUContributionBps ?? 500n) / 100));
      setCfgCreatorBonus(String(Number(cfg.creatorFSUBonus ?? 100n)));
      setCfgMilestoneBps(
        String(Number(cfg.milestoneAchievementBonusBps ?? 200n) / 100),
      );
    } catch {
      toast.error("Failed to load crowdfunding config");
    } finally {
      setConfigLoading(false);
    }
  }, [backend, ext]);

  const loadCampaigns = useCallback(async () => {
    if (!backend) return;
    setCampaignsLoading(true);
    try {
      const data = await ext.adminListAllCrowdfundingCampaigns();
      setCampaigns(data);
    } catch {
      toast.error("Failed to load campaigns");
    } finally {
      setCampaignsLoading(false);
    }
  }, [backend, ext]);

  const loadFSUStatus = useCallback(async () => {
    if (!backend) return;
    setFsuLoading(true);
    try {
      const status = await ext.getFSUPoolStatus();
      setFsuStatus(status);
    } catch {
      toast.error("Failed to load FSU pool status");
    } finally {
      setFsuLoading(false);
    }
  }, [backend, ext]);

  useEffect(() => {
    loadConfig();
    loadCampaigns();
    loadFSUStatus();
  }, [loadConfig, loadCampaigns, loadFSUStatus]);

  // Load pledges when a campaign is selected
  useEffect(() => {
    if (!selectedCampaignId || !backend) return;
    setPledgesLoading(true);
    ext
      .adminListCrowdfundingPledges(selectedCampaignId)
      .then(setPledges)
      .catch(() => toast.error("Failed to load pledges"))
      .finally(() => setPledgesLoading(false));
  }, [selectedCampaignId, backend, ext]);

  async function handleSaveConfig() {
    if (!backend) return;
    setSavingConfig(true);
    try {
      await ext.setCrowdfundingConfig(
        BigInt(Math.round(Number.parseFloat(cfgFSUBps) * 100)),
        BigInt(Math.round(Number.parseFloat(cfgCreatorBonus))),
        BigInt(Math.round(Number.parseFloat(cfgMilestoneBps) * 100)),
      );
      toast.success("Config saved");
      await loadConfig();
    } catch {
      toast.error("Failed to save config");
    } finally {
      setSavingConfig(false);
    }
  }

  async function handleApprove(id: string) {
    if (!backend) return;
    setActionLoading(`approve-${id}`);
    try {
      const res = await ext.approveCrowdfundingCampaign(id);
      if (!res) throw new Error("Approval failed");
      toast.success("Campaign approved");
      await loadCampaigns();
    } catch {
      toast.error("Failed to approve campaign");
    } finally {
      setActionLoading(null);
    }
  }

  async function handleReject(id: string) {
    if (!backend) return;
    setActionLoading(`reject-${id}`);
    try {
      const res = await ext.rejectCrowdfundingCampaign(id);
      if (!res) throw new Error("Rejection failed");
      toast.success("Campaign rejected");
      await loadCampaigns();
    } catch {
      toast.error("Failed to reject campaign");
    } finally {
      setActionLoading(null);
    }
  }

  async function handleFinalize(id: string) {
    if (!backend) return;
    setActionLoading(`finalize-${id}`);
    try {
      const res = await ext.finalizeCrowdfundingCampaign(id);
      if (!res) throw new Error("Finalization failed");
      toast.success("Campaign finalized");
      await loadCampaigns();
    } catch {
      toast.error("Failed to finalize campaign");
    } finally {
      setActionLoading(null);
    }
  }

  async function handleFundFSU() {
    if (!backend || !fsuFundAmt) return;
    setFsuFunding(true);
    try {
      await ext.addToFSUPool(
        BigInt(Math.round(Number.parseFloat(fsuFundAmt) * 100)),
        fsuFundDesc || "Admin FSU pool funding",
      );
      toast.success("FSU pool funded");
      setFsuFundAmt("");
      setFsuFundDesc("");
      await loadFSUStatus();
    } catch {
      toast.error("Failed to fund FSU pool");
    } finally {
      setFsuFunding(false);
    }
  }

  async function handleDistributeFSU() {
    if (!backend || !fsuDistUnits) return;
    setFsuDistributing(true);
    try {
      await ext.distributeFSU(
        BigInt(Math.round(Number.parseFloat(fsuDistUnits))),
        fsuDistDesc || "Admin distribution",
      );
      toast.success("FSU distributed");
      setFsuDistUnits("");
      setFsuDistDesc("");
      await loadFSUStatus();
    } catch {
      toast.error("Failed to distribute FSU");
    } finally {
      setFsuDistributing(false);
    }
  }

  function getCampaignStatus(c: CrowdfundingCampaign): string {
    return Object.keys(c.status ?? {})[0] ?? "pending";
  }

  function getCampaignCategory(c: CrowdfundingCampaign): string {
    return Object.keys(c.category ?? {})[0] ?? "civic";
  }

  function formatMoney(cents: bigint): string {
    return `$${(Number(cents) / 100).toLocaleString("en-US", { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`;
  }

  function truncatePrincipal(p: { toString(): string } | string): string {
    const s = typeof p === "string" ? p : p.toString();
    if (s.length <= 16) return s;
    return `${s.slice(0, 8)}…${s.slice(-6)}`;
  }

  const statusBadgeClass: Record<string, string> = {
    pending: "bg-amber-500/20 text-amber-300",
    active: "bg-green-500/20 text-green-300",
    funded: "bg-emerald-500/20 text-emerald-300",
    failed: "bg-red-500/20 text-red-300",
    cancelled: "bg-slate-600/30 text-slate-400",
  };

  // ── Pledge detail view ────────────────────────────────────────────────────
  if (selectedCampaignId) {
    const campaign = campaigns.find((c) => c.id === selectedCampaignId);
    const totalRaised = pledges.reduce((sum, p) => sum + p.amountCents, 0n);
    const totalFSU = pledges.reduce((sum, p) => sum + p.fsuEarned, 0n);

    return (
      <div className="space-y-6" data-ocid="admin.crowdfunding.pledges.view">
        <div className="flex items-center gap-3">
          <Button
            variant="outline"
            size="sm"
            onClick={() => {
              setSelectedCampaignId(null);
              setPledges([]);
            }}
            className="text-xs h-7"
            data-ocid="admin.crowdfunding.pledges.back"
          >
            ← Back to Campaigns
          </Button>
          <h3 className="text-sm font-semibold text-foreground truncate">
            {campaign?.title ?? selectedCampaignId}
          </h3>
        </div>

        {/* Summary cards */}
        <div className="grid grid-cols-3 gap-4">
          <Card className="border border-border">
            <CardContent className="p-4">
              <p className="text-xs text-muted-foreground">Total Pledges</p>
              <p className="text-2xl font-bold text-foreground font-display">
                {pledges.length}
              </p>
            </CardContent>
          </Card>
          <Card className="border border-border">
            <CardContent className="p-4">
              <p className="text-xs text-muted-foreground">Total Raised</p>
              <p className="text-2xl font-bold text-emerald-600 font-display">
                {formatMoney(totalRaised)}
              </p>
            </CardContent>
          </Card>
          <Card className="border border-border">
            <CardContent className="p-4">
              <p className="text-xs text-muted-foreground">
                Total FSU Distributed
              </p>
              <p className="text-2xl font-bold text-amber-600 font-display">
                {Number(totalFSU).toLocaleString()}
              </p>
            </CardContent>
          </Card>
        </div>

        <Card className="border border-border">
          <CardHeader className="pb-3">
            <CardTitle className="text-sm flex items-center gap-2">
              <Coins size={14} className="text-amber-500" />
              Pledge Analytics
            </CardTitle>
          </CardHeader>
          <CardContent className="p-0">
            {pledgesLoading ? (
              <div
                className="p-4"
                data-ocid="admin.crowdfunding.pledges.loading_state"
              >
                <TableSkeleton rows={4} cols={6} />
              </div>
            ) : pledges.length === 0 ? (
              <div
                className="text-center py-10 text-muted-foreground text-sm"
                data-ocid="admin.crowdfunding.pledges.empty_state"
              >
                No pledges yet for this campaign.
              </div>
            ) : (
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead className="text-xs">Backer</TableHead>
                    <TableHead className="text-xs text-right">Amount</TableHead>
                    <TableHead className="text-xs text-right">
                      FSU Earned
                    </TableHead>
                    <TableHead className="text-xs">Reward Tier</TableHead>
                    <TableHead className="text-xs">Referral Code</TableHead>
                    <TableHead className="text-xs">Status</TableHead>
                    <TableHead className="text-xs">Date</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {pledges.map((p) => (
                    <TableRow
                      key={p.id}
                      data-ocid={`admin.crowdfunding.pledge.item.${p.id}`}
                    >
                      <TableCell className="text-xs font-mono">
                        {truncatePrincipal(p.backer)}
                      </TableCell>
                      <TableCell className="text-xs text-right font-medium">
                        {formatMoney(p.amountCents)}
                      </TableCell>
                      <TableCell className="text-xs text-right text-amber-600 font-medium">
                        {Number(p.fsuEarned).toLocaleString()}
                      </TableCell>
                      <TableCell className="text-xs">
                        {p.rewardTierId ?? "—"}
                      </TableCell>
                      <TableCell className="text-xs font-mono">
                        {p.referrerCode ?? "—"}
                      </TableCell>
                      <TableCell>
                        <span
                          className={`px-1.5 py-0.5 rounded text-xs ${statusBadgeClass[p.status] ?? "bg-muted text-muted-foreground"}`}
                        >
                          {p.status}
                        </span>
                      </TableCell>
                      <TableCell className="text-xs text-muted-foreground">
                        {formatDate(p.createdAt)}
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            )}
          </CardContent>
        </Card>
      </div>
    );
  }

  // ── Main tab view ─────────────────────────────────────────────────────────
  return (
    <div className="space-y-6" data-ocid="admin.crowdfunding.tab">
      {/* 1. FinFracFran™ Config */}
      <Card className="border border-border">
        <CardHeader className="pb-3">
          <CardTitle className="text-sm flex items-center gap-2">
            <Coins size={14} className="text-amber-500" />
            FinFracFran™ Contribution Settings
          </CardTitle>
          <CardDescription className="text-xs">
            Configure how each pledge contributes to the FSU fractal pool and
            creator bonuses
          </CardDescription>
        </CardHeader>
        <CardContent>
          {configLoading ? (
            <div data-ocid="admin.crowdfunding.config.loading_state">
              <TableSkeleton rows={1} cols={3} />
            </div>
          ) : (
            <div className="space-y-4">
              {/* Current values */}
              {config && (
                <div className="grid grid-cols-3 gap-3 p-3 rounded-lg bg-muted/30 border border-border">
                  <div>
                    <p className="text-xs text-muted-foreground">
                      Default FSU Contribution
                    </p>
                    <p className="text-sm font-semibold text-amber-600">
                      {(Number(config.defaultFSUContributionBps) / 100).toFixed(
                        2,
                      )}
                      %
                    </p>
                  </div>
                  <div>
                    <p className="text-xs text-muted-foreground">
                      Creator Launch Bonus
                    </p>
                    <p className="text-sm font-semibold text-emerald-600">
                      {Number(config.creatorFSUBonus).toLocaleString()} FSU
                    </p>
                  </div>
                  <div>
                    <p className="text-xs text-muted-foreground">
                      Milestone Bonus
                    </p>
                    <p className="text-sm font-semibold text-primary">
                      {(
                        Number(config.milestoneAchievementBonusBps) / 100
                      ).toFixed(2)}
                      %
                    </p>
                  </div>
                </div>
              )}
              {/* Edit form */}
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <div className="space-y-1">
                  <Label className="text-xs">
                    Default FSU Contribution (%)
                  </Label>
                  <Input
                    type="number"
                    step="0.01"
                    min="0"
                    max="100"
                    value={cfgFSUBps}
                    onChange={(e) => setCfgFSUBps(e.target.value)}
                    className="h-8 text-xs"
                    data-ocid="admin.crowdfunding.config.fsu_bps.input"
                  />
                </div>
                <div className="space-y-1">
                  <Label className="text-xs">
                    Creator Launch Bonus (FSU units)
                  </Label>
                  <Input
                    type="number"
                    step="1"
                    min="0"
                    value={cfgCreatorBonus}
                    onChange={(e) => setCfgCreatorBonus(e.target.value)}
                    className="h-8 text-xs"
                    data-ocid="admin.crowdfunding.config.creator_bonus.input"
                  />
                </div>
                <div className="space-y-1">
                  <Label className="text-xs">
                    Milestone Achievement Bonus (%)
                  </Label>
                  <Input
                    type="number"
                    step="0.01"
                    min="0"
                    max="100"
                    value={cfgMilestoneBps}
                    onChange={(e) => setCfgMilestoneBps(e.target.value)}
                    className="h-8 text-xs"
                    data-ocid="admin.crowdfunding.config.milestone_bps.input"
                  />
                </div>
              </div>
              <Button
                size="sm"
                onClick={handleSaveConfig}
                disabled={savingConfig}
                className="h-8 text-xs"
                data-ocid="admin.crowdfunding.config.save.button"
              >
                {savingConfig ? (
                  <Loader2 size={12} className="animate-spin mr-1" />
                ) : null}
                Save Config
              </Button>
            </div>
          )}
        </CardContent>
      </Card>

      {/* 2. Campaign Review Queue */}
      <Card className="border border-border">
        <CardHeader className="pb-3 flex flex-row items-center justify-between">
          <div>
            <CardTitle className="text-sm flex items-center gap-2">
              <Target size={14} className="text-primary" />
              Campaign Review Queue
            </CardTitle>
            <CardDescription className="text-xs mt-0.5">
              Approve, reject, or finalize crowdfunding campaigns across all
              tenants
            </CardDescription>
          </div>
          <Button
            variant="outline"
            size="sm"
            onClick={loadCampaigns}
            disabled={campaignsLoading}
            className="h-7 text-xs"
            data-ocid="admin.crowdfunding.campaigns.refresh"
          >
            {campaignsLoading ? (
              <Loader2 size={11} className="animate-spin" />
            ) : (
              "Refresh"
            )}
          </Button>
        </CardHeader>
        <CardContent className="p-0">
          {campaignsLoading ? (
            <div
              className="p-4"
              data-ocid="admin.crowdfunding.campaigns.loading_state"
            >
              <TableSkeleton rows={4} cols={6} />
            </div>
          ) : campaigns.length === 0 ? (
            <div
              className="text-center py-12 text-muted-foreground text-sm"
              data-ocid="admin.crowdfunding.campaigns.empty_state"
            >
              <Coins size={32} className="mx-auto mb-3 opacity-30" />
              No campaigns yet
            </div>
          ) : (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead className="text-xs">Campaign Title</TableHead>
                  <TableHead className="text-xs">Creator</TableHead>
                  <TableHead className="text-xs">Category</TableHead>
                  <TableHead className="text-xs text-right">Goal</TableHead>
                  <TableHead className="text-xs text-right">Raised</TableHead>
                  <TableHead className="text-xs">Status</TableHead>
                  <TableHead className="text-xs">Deadline</TableHead>
                  <TableHead className="text-xs text-right">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {campaigns.map((c) => {
                  const status = getCampaignStatus(c);
                  const category = getCampaignCategory(c);
                  return (
                    <TableRow
                      key={c.id}
                      className="cursor-pointer hover:bg-muted/30"
                      onClick={() => setSelectedCampaignId(c.id)}
                      data-ocid={`admin.crowdfunding.campaign.item.${c.id}`}
                    >
                      <TableCell className="text-xs font-medium max-w-[180px] truncate">
                        {c.title}
                      </TableCell>
                      <TableCell className="text-xs font-mono">
                        {truncatePrincipal(c.creator)}
                      </TableCell>
                      <TableCell>
                        <span className="px-1.5 py-0.5 rounded text-xs bg-primary/10 text-primary capitalize">
                          {category}
                        </span>
                      </TableCell>
                      <TableCell className="text-xs text-right">
                        {formatMoney(c.goalCents)}
                      </TableCell>
                      <TableCell className="text-xs text-right font-medium text-emerald-600">
                        {formatMoney(c.raisedCents)}
                      </TableCell>
                      <TableCell>
                        <span
                          className={`px-1.5 py-0.5 rounded text-xs ${statusBadgeClass[status] ?? "bg-muted text-muted-foreground"}`}
                        >
                          {status}
                        </span>
                      </TableCell>
                      <TableCell className="text-xs text-muted-foreground">
                        {new Date(
                          Number(c.deadline) / 1_000_000,
                        ).toLocaleDateString()}
                      </TableCell>
                      <TableCell className="text-right">
                        {/* Stop row click from propagating when clicking action buttons */}
                        <div
                          className="flex gap-1 justify-end"
                          onClick={(e) => e.stopPropagation()}
                          onKeyDown={(e) => e.stopPropagation()}
                        >
                          {status === "pending" && (
                            <>
                              <Button
                                size="sm"
                                variant="outline"
                                disabled={actionLoading === `approve-${c.id}`}
                                onClick={() => handleApprove(c.id)}
                                className="h-6 px-2 text-[10px] border-emerald-500/40 text-emerald-600 hover:bg-emerald-500/10"
                                data-ocid={`admin.crowdfunding.approve.${c.id}`}
                              >
                                {actionLoading === `approve-${c.id}` ? (
                                  <Loader2 size={10} className="animate-spin" />
                                ) : (
                                  "Approve"
                                )}
                              </Button>
                              <Button
                                size="sm"
                                variant="outline"
                                disabled={actionLoading === `reject-${c.id}`}
                                onClick={() => handleReject(c.id)}
                                className="h-6 px-2 text-[10px] border-red-500/40 text-red-600 hover:bg-red-500/10"
                                data-ocid={`admin.crowdfunding.reject.${c.id}`}
                              >
                                {actionLoading === `reject-${c.id}` ? (
                                  <Loader2 size={10} className="animate-spin" />
                                ) : (
                                  "Reject"
                                )}
                              </Button>
                            </>
                          )}
                          {status === "active" && (
                            <Button
                              size="sm"
                              variant="outline"
                              disabled={actionLoading === `finalize-${c.id}`}
                              onClick={() => handleFinalize(c.id)}
                              className="h-6 px-2 text-[10px] border-primary/40 text-primary hover:bg-primary/10"
                              data-ocid={`admin.crowdfunding.finalize.${c.id}`}
                            >
                              {actionLoading === `finalize-${c.id}` ? (
                                <Loader2 size={10} className="animate-spin" />
                              ) : (
                                "Finalize"
                              )}
                            </Button>
                          )}
                        </div>
                      </TableCell>
                    </TableRow>
                  );
                })}
              </TableBody>
            </Table>
          )}
        </CardContent>
      </Card>

      {/* 3. FSU Pool Management */}
      <Card className="border border-border">
        <CardHeader className="pb-3 flex flex-row items-center justify-between">
          <div>
            <CardTitle className="text-sm flex items-center gap-2">
              <TrendingUp size={14} className="text-amber-500" />
              FSU Pool Management
            </CardTitle>
            <CardDescription className="text-xs mt-0.5">
              Fund and distribute FinFracFran™ Franchise Share Units
            </CardDescription>
          </div>
          <Button
            variant="outline"
            size="sm"
            onClick={loadFSUStatus}
            disabled={fsuLoading}
            className="h-7 text-xs"
            data-ocid="admin.crowdfunding.fsu.refresh"
          >
            {fsuLoading ? (
              <Loader2 size={11} className="animate-spin" />
            ) : (
              "Refresh"
            )}
          </Button>
        </CardHeader>
        <CardContent className="space-y-4">
          {/* Pool status cards */}
          {fsuStatus ? (
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
              <div className="rounded-lg bg-muted/30 border border-border p-3">
                <p className="text-xs text-muted-foreground">Pool Size</p>
                <p className="text-lg font-bold text-amber-600 font-display">
                  ${(Number(fsuStatus.poolSizeUnits ?? 0) / 100).toFixed(2)}
                </p>
              </div>
              <div className="rounded-lg bg-muted/30 border border-border p-3">
                <p className="text-xs text-muted-foreground">FSU Value</p>
                <p className="text-lg font-bold text-primary font-display">
                  ${(Number(fsuStatus.valuePerUnitCents ?? 0) / 100).toFixed(4)}
                </p>
              </div>
              <div className="rounded-lg bg-muted/30 border border-border p-3">
                <p className="text-xs text-muted-foreground">Outstanding FSU</p>
                <p className="text-lg font-bold text-foreground font-display">
                  {Number(fsuStatus.totalOutstandingFSU ?? 0).toLocaleString()}
                </p>
              </div>
              <div className="rounded-lg bg-muted/30 border border-border p-3">
                <p className="text-xs text-muted-foreground">
                  Next Distribution
                </p>
                <p className="text-sm font-semibold text-foreground">
                  {fsuStatus.nextDistributionLabel ?? "—"}
                </p>
              </div>
            </div>
          ) : (
            <div
              className="text-xs text-muted-foreground"
              data-ocid="admin.crowdfunding.fsu.loading_state"
            >
              Loading FSU status…
            </div>
          )}

          {/* Fund & Distribute actions */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label className="text-xs">Fund FSU Pool ($)</Label>
              <div className="flex gap-2">
                <Input
                  type="number"
                  step="0.01"
                  placeholder="Amount in $"
                  value={fsuFundAmt}
                  onChange={(e) => setFsuFundAmt(e.target.value)}
                  className="h-8 text-xs flex-1"
                  data-ocid="admin.crowdfunding.fsu_fund.input"
                />
                <Input
                  placeholder="Description (optional)"
                  value={fsuFundDesc}
                  onChange={(e) => setFsuFundDesc(e.target.value)}
                  className="h-8 text-xs flex-1"
                  data-ocid="admin.crowdfunding.fsu_fund_desc.input"
                />
                <Button
                  size="sm"
                  onClick={handleFundFSU}
                  disabled={fsuFunding || !fsuFundAmt}
                  className="h-8 text-xs bg-amber-600 hover:bg-amber-700 whitespace-nowrap"
                  data-ocid="admin.crowdfunding.fsu_fund.button"
                >
                  {fsuFunding ? (
                    <Loader2 size={11} className="animate-spin" />
                  ) : (
                    "Fund Pool"
                  )}
                </Button>
              </div>
            </div>
            <div className="space-y-2">
              <Label className="text-xs">Distribute FSU Units</Label>
              <div className="flex gap-2">
                <Input
                  type="number"
                  placeholder="Units"
                  value={fsuDistUnits}
                  onChange={(e) => setFsuDistUnits(e.target.value)}
                  className="h-8 text-xs w-28"
                  data-ocid="admin.crowdfunding.fsu_dist_units.input"
                />
                <Input
                  placeholder="Description"
                  value={fsuDistDesc}
                  onChange={(e) => setFsuDistDesc(e.target.value)}
                  className="h-8 text-xs flex-1"
                  data-ocid="admin.crowdfunding.fsu_dist_desc.input"
                />
                <Button
                  size="sm"
                  onClick={handleDistributeFSU}
                  disabled={fsuDistributing || !fsuDistUnits}
                  className="h-8 text-xs bg-rose-600 hover:bg-rose-700 whitespace-nowrap"
                  data-ocid="admin.crowdfunding.fsu_distribute.button"
                >
                  {fsuDistributing ? (
                    <Loader2 size={11} className="animate-spin" />
                  ) : (
                    "Distribute"
                  )}
                </Button>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}

// ── Governance Admin Tab ─────────────────────────────────────────────────────
const PROPOSAL_STATUS_LABELS: Record<string, string> = {
  draft: "Draft",
  review: "In Review",
  openVote: "Open Vote",
  closed: "Closed",
  enacted: "Enacted",
  rejected: "Rejected",
  cancelled: "Cancelled",
};

const PROPOSAL_STATUS_COLORS: Record<string, string> = {
  draft: "bg-slate-500/15 text-slate-400",
  review: "bg-blue-500/15 text-blue-400",
  openVote: "bg-emerald-500/15 text-emerald-400",
  closed: "bg-orange-500/15 text-orange-400",
  enacted: "bg-green-500/15 text-green-400",
  rejected: "bg-red-500/15 text-red-400",
  cancelled: "bg-muted text-muted-foreground",
};

const PROP_TYPE_LABELS: Record<string, string> = {
  policy: "Policy",
  resolution: "Resolution",
  budget: "Budget",
  amendment: "Amendment",
  communityInitiative: "Community",
};

function GovernanceAdminTab() {
  const backend = useBackend();
  const [proposals, setProposals] = useState<Proposal[]>([]);
  const [loading, setLoading] = useState(true);
  const [statusFilter, setStatusFilter] = useState<string>("all");
  const [actioning, setActioning] = useState<bigint | null>(null);
  const [showTenant, setShowTenant] = useState(true);

  // Governance Settings — session-local defaults (not persisted to backend)
  const [govSettings, setGovSettings] = useState({
    quorumPercent: 51,
    sponsorThreshold: 3,
    voteWindowDays: 7,
  });

  const load = async () => {
    if (!backend) return;
    setLoading(true);
    try {
      const data = await backend.listProposals();
      setProposals(data);
    } catch {
      toast.error("Failed to load proposals");
    } finally {
      setLoading(false);
    }
  };

  // biome-ignore lint/correctness/useExhaustiveDependencies: load stable within backend scope
  useEffect(() => {
    load();
  }, [backend]);

  async function adminAction(
    pid: bigint,
    fn: () => Promise<
      { __kind__: "ok"; ok: string } | { __kind__: "err"; err: string }
    >,
    msg: string,
  ) {
    setActioning(pid);
    try {
      const res = await fn();
      if ("ok" in res) {
        toast.success(msg);
        load();
      } else {
        toast.error(res.err);
      }
    } catch {
      toast.error("Action failed");
    } finally {
      setActioning(null);
    }
  }

  const filtered = proposals.filter(
    (p) => statusFilter === "all" || String(p.status) === statusFilter,
  );

  const counts = {
    total: proposals.length,
    openVote: proposals.filter((p) => String(p.status) === "openVote").length,
    enacted: proposals.filter((p) => String(p.status) === "enacted").length,
    review: proposals.filter((p) => String(p.status) === "review").length,
  };

  // ── Voting Analytics (derived client-side) ───────────────────────────────
  const nonDraft = proposals.filter((p) => String(p.status) !== "draft");
  const enactedCount = proposals.filter(
    (p) => String(p.status) === "enacted",
  ).length;
  const closedOrRejected = proposals.filter((p) =>
    ["enacted", "rejected", "closed"].includes(String(p.status)),
  ).length;
  const participationRate =
    nonDraft.length > 0
      ? Math.round((enactedCount / nonDraft.length) * 100)
      : 0;
  const quorumPassRate =
    closedOrRejected > 0
      ? Math.round((enactedCount / closedOrRejected) * 100)
      : 0;
  const mechCounts = proposals.reduce<Record<string, number>>((acc, p) => {
    const k = String(p.mechanism);
    acc[k] = (acc[k] ?? 0) + 1;
    return acc;
  }, {});
  const topMech =
    Object.entries(mechCounts).sort((a, b) => b[1] - a[1])[0]?.[0] ?? null;
  const mechDisplayMap: Record<string, string> = {
    simpleMajority: "Simple Majority",
    supermajority66: "Supermajority 2/3",
    supermajority75: "Supermajority 3/4",
    rankedChoice: "Ranked Choice",
    liquidDelegation: "Liquid Delegation",
  };
  const avgSponsors =
    proposals.length > 0
      ? (
          proposals.reduce((sum, p) => sum + p.sponsors.length, 0) /
          proposals.length
        ).toFixed(1)
      : "N/A";

  function copyGovSettings() {
    const json = JSON.stringify(
      {
        defaultQuorumPercent: govSettings.quorumPercent,
        defaultSponsorThreshold: govSettings.sponsorThreshold,
        defaultVoteWindowDays: govSettings.voteWindowDays,
      },
      null,
      2,
    );
    navigator.clipboard.writeText(json).then(() => {
      toast.success("Settings copied to clipboard");
    });
  }

  return (
    <div className="space-y-6" data-ocid="admin.governance.tab_content">
      {/* Stats row */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard icon={Scale} label="Total Proposals" value={counts.total} />
        <StatCard
          icon={Vote}
          label="Open Votes"
          value={counts.openVote}
          color="emerald-500"
        />
        <StatCard
          icon={CheckCircle}
          label="Enacted"
          value={counts.enacted}
          color="green-500"
        />
        <StatCard
          icon={Clock}
          label="Pending Review"
          value={counts.review}
          color="blue-500"
        />
      </div>

      {/* ── Voting Analytics ─────────────────────────────────────────────── */}
      <div data-ocid="admin.governance.voting_analytics">
        <div className="flex items-center gap-2 mb-3">
          <BarChart2 size={15} className="text-primary" />
          <h3 className="text-sm font-semibold">Voting Analytics</h3>
          <span className="text-xs text-muted-foreground">
            — calculated from all loaded proposals
          </span>
        </div>
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
          <Card className="border-border">
            <CardContent className="pt-4 pb-4">
              <p className="text-xs text-muted-foreground mb-1">
                Participation Rate
              </p>
              <p
                className="text-2xl font-bold text-primary"
                data-ocid="admin.governance.analytics_participation"
              >
                {participationRate}%
              </p>
              <p className="text-xs text-muted-foreground mt-1">
                enacted / non-draft
              </p>
            </CardContent>
          </Card>
          <Card className="border-border">
            <CardContent className="pt-4 pb-4">
              <p className="text-xs text-muted-foreground mb-1">
                Quorum Pass Rate
              </p>
              <p
                className="text-2xl font-bold text-emerald-400"
                data-ocid="admin.governance.analytics_quorum"
              >
                {quorumPassRate}%
              </p>
              <p className="text-xs text-muted-foreground mt-1">
                enacted / decided
              </p>
            </CardContent>
          </Card>
          <Card className="border-border">
            <CardContent className="pt-4 pb-4">
              <p className="text-xs text-muted-foreground mb-1">
                Top Mechanism
              </p>
              {topMech ? (
                <Badge
                  variant="secondary"
                  className="mt-1 text-xs"
                  data-ocid="admin.governance.analytics_top_mech"
                >
                  {mechDisplayMap[topMech] ?? topMech}
                </Badge>
              ) : (
                <p className="text-sm text-muted-foreground">N/A</p>
              )}
              <p className="text-xs text-muted-foreground mt-2">
                most used voting type
              </p>
            </CardContent>
          </Card>
          <Card className="border-border">
            <CardContent className="pt-4 pb-4">
              <p className="text-xs text-muted-foreground mb-1">Avg Sponsors</p>
              <p
                className="text-2xl font-bold text-blue-400"
                data-ocid="admin.governance.analytics_avg_sponsors"
              >
                {avgSponsors}
              </p>
              <p className="text-xs text-muted-foreground mt-1">per proposal</p>
            </CardContent>
          </Card>
        </div>
      </div>

      {/* Filters + tenant toggle */}
      <div className="flex items-center justify-between flex-wrap gap-2">
        <div
          className="flex gap-2 flex-wrap"
          data-ocid="admin.governance.status_filter"
        >
          {[
            "all",
            "draft",
            "review",
            "openVote",
            "closed",
            "enacted",
            "cancelled",
          ].map((s) => (
            <button
              type="button"
              key={s}
              onClick={() => setStatusFilter(s)}
              className={`px-3 py-1 rounded-full text-xs font-medium transition-colors border ${
                statusFilter === s
                  ? "bg-primary text-primary-foreground border-primary"
                  : "border-border text-muted-foreground hover:border-primary/30"
              }`}
              data-ocid={`admin.governance.filter_${s}`}
            >
              {s === "all" ? "All" : (PROPOSAL_STATUS_LABELS[s] ?? s)}
            </button>
          ))}
        </div>
        {/* Cross-tenant visibility toggle */}
        <button
          type="button"
          onClick={() => setShowTenant((v) => !v)}
          className={`flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-medium border transition-colors ${
            showTenant
              ? "bg-primary/10 border-primary/40 text-primary"
              : "border-border text-muted-foreground hover:border-primary/30"
          }`}
          data-ocid="admin.governance.toggle_tenant_col"
        >
          <Building2 size={12} />
          {showTenant ? "Tenant column: on" : "Tenant column: off"}
        </button>
      </div>

      {/* Proposals table */}
      {loading ? (
        <TableSkeleton rows={5} cols={6} />
      ) : filtered.length === 0 ? (
        <div
          className="text-center py-16 text-muted-foreground"
          data-ocid="admin.governance.empty_state"
        >
          <Scale size={40} className="mx-auto mb-3 opacity-30" />
          <p className="text-sm">No proposals match this filter.</p>
        </div>
      ) : (
        <div className="overflow-x-auto rounded-lg border border-border">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead className="w-12">ID</TableHead>
                <TableHead>Title</TableHead>
                {showTenant && (
                  <TableHead className="text-xs">Tenant</TableHead>
                )}
                <TableHead>Type</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Mechanism</TableHead>
                <TableHead>Created</TableHead>
                <TableHead className="text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filtered.map((p) => {
                const statusKey = String(p.status);
                const typeKey = String(p.proposalType);
                const mechKey = String(p.mechanism);
                const isActioning = actioning === p.id;
                const mechLabel =
                  {
                    simpleMajority: "Simple",
                    supermajority66: "Super 2/3",
                    supermajority75: "Super 3/4",
                    rankedChoice: "Ranked",
                    liquidDelegation: "Delegation",
                  }[mechKey] ?? mechKey;

                return (
                  <TableRow
                    key={String(p.id)}
                    data-ocid={`admin.governance.proposal_row_${String(p.id)}`}
                  >
                    <TableCell className="font-mono text-xs text-muted-foreground">
                      #{String(p.id)}
                    </TableCell>
                    <TableCell>
                      <p className="font-medium text-sm max-w-xs truncate">
                        {p.title}
                      </p>
                    </TableCell>
                    {showTenant && (
                      <TableCell>
                        <Badge
                          variant="outline"
                          className="text-xs font-mono max-w-[120px] truncate"
                          data-ocid={`admin.governance.tenant_badge_${String(p.id)}`}
                        >
                          {p.tenantId || "platform"}
                        </Badge>
                      </TableCell>
                    )}
                    <TableCell>
                      <Badge variant="secondary" className="text-xs">
                        {PROP_TYPE_LABELS[typeKey] ?? typeKey}
                      </Badge>
                    </TableCell>
                    <TableCell>
                      <span
                        className={`text-xs font-medium px-2 py-0.5 rounded-full ${PROPOSAL_STATUS_COLORS[statusKey] ?? ""}`}
                      >
                        {PROPOSAL_STATUS_LABELS[statusKey] ?? statusKey}
                      </span>
                    </TableCell>
                    <TableCell className="text-xs text-muted-foreground">
                      {mechLabel}
                    </TableCell>
                    <TableCell className="text-xs text-muted-foreground">
                      {new Date(
                        Number(p.createdAt) / 1_000_000,
                      ).toLocaleDateString()}
                    </TableCell>
                    <TableCell>
                      <div className="flex gap-1 justify-end flex-wrap">
                        {statusKey === "review" && (
                          <Button
                            size="sm"
                            variant="outline"
                            className="h-7 text-xs text-emerald-400 border-emerald-500/30"
                            disabled={isActioning}
                            onClick={() =>
                              adminAction(
                                p.id,
                                () => backend!.openProposalForVoting(p.id),
                                "Voting opened",
                              )
                            }
                            data-ocid={`admin.governance.open_vote_${String(p.id)}`}
                          >
                            {isActioning ? (
                              <Loader2 size={11} className="animate-spin" />
                            ) : (
                              "Open Vote"
                            )}
                          </Button>
                        )}
                        {statusKey === "openVote" && (
                          <Button
                            size="sm"
                            variant="outline"
                            className="h-7 text-xs text-orange-400 border-orange-500/30"
                            disabled={isActioning}
                            onClick={() =>
                              adminAction(
                                p.id,
                                () => backend!.closeProposal(p.id),
                                "Voting closed",
                              )
                            }
                            data-ocid={`admin.governance.close_${String(p.id)}`}
                          >
                            Close
                          </Button>
                        )}
                        {statusKey === "closed" && (
                          <Button
                            size="sm"
                            variant="outline"
                            className="h-7 text-xs text-green-400 border-green-500/30"
                            disabled={isActioning}
                            onClick={() =>
                              adminAction(
                                p.id,
                                () => backend!.enactProposal(p.id),
                                "Enacted!",
                              )
                            }
                            data-ocid={`admin.governance.enact_${String(p.id)}`}
                          >
                            Enact
                          </Button>
                        )}
                        {(statusKey === "draft" ||
                          statusKey === "review" ||
                          statusKey === "closed") && (
                          <Button
                            size="sm"
                            variant="ghost"
                            className="h-7 text-xs text-destructive"
                            disabled={isActioning}
                            onClick={() =>
                              adminAction(
                                p.id,
                                () => backend!.cancelProposal(p.id),
                                "Cancelled",
                              )
                            }
                            data-ocid={`admin.governance.cancel_${String(p.id)}`}
                          >
                            Cancel
                          </Button>
                        )}
                      </div>
                    </TableCell>
                  </TableRow>
                );
              })}
            </TableBody>
          </Table>
        </div>
      )}

      {/* ── Governance Settings ───────────────────────────────────────────── */}
      <Card
        className="border-border"
        data-ocid="admin.governance.settings_panel"
      >
        <CardHeader className="pb-3">
          <div className="flex items-center justify-between flex-wrap gap-2">
            <div>
              <CardTitle className="text-sm flex items-center gap-2">
                <Shield size={15} className="text-primary" />
                Governance Settings
              </CardTitle>
              <CardDescription className="text-xs mt-0.5">
                Session defaults — resets on page reload. Persistent governance
                configuration will be available in a future update.
              </CardDescription>
            </div>
            <Button
              size="sm"
              variant="outline"
              className="h-8 text-xs"
              onClick={copyGovSettings}
              data-ocid="admin.governance.settings_copy"
            >
              <FileText size={12} className="mr-1.5" />
              Copy as JSON
            </Button>
          </div>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div className="space-y-1.5">
              <Label
                htmlFor="gov-quorum"
                className="text-xs text-muted-foreground"
              >
                Default Quorum %
              </Label>
              <Input
                id="gov-quorum"
                type="number"
                min={1}
                max={100}
                value={govSettings.quorumPercent}
                onChange={(e) =>
                  setGovSettings((s) => ({
                    ...s,
                    quorumPercent: Math.min(
                      100,
                      Math.max(1, Number(e.target.value)),
                    ),
                  }))
                }
                className="h-8 text-sm"
                data-ocid="admin.governance.settings_quorum"
              />
              <p className="text-xs text-muted-foreground">
                Minimum participation to pass (1–100)
              </p>
            </div>
            <div className="space-y-1.5">
              <Label
                htmlFor="gov-sponsors"
                className="text-xs text-muted-foreground"
              >
                Default Sponsor Threshold
              </Label>
              <Input
                id="gov-sponsors"
                type="number"
                min={1}
                max={20}
                value={govSettings.sponsorThreshold}
                onChange={(e) =>
                  setGovSettings((s) => ({
                    ...s,
                    sponsorThreshold: Math.min(
                      20,
                      Math.max(1, Number(e.target.value)),
                    ),
                  }))
                }
                className="h-8 text-sm"
                data-ocid="admin.governance.settings_sponsors"
              />
              <p className="text-xs text-muted-foreground">
                Co-signers required to advance (1–20)
              </p>
            </div>
            <div className="space-y-1.5">
              <Label
                htmlFor="gov-window"
                className="text-xs text-muted-foreground"
              >
                Default Vote Window (days)
              </Label>
              <Input
                id="gov-window"
                type="number"
                min={1}
                max={365}
                value={govSettings.voteWindowDays}
                onChange={(e) =>
                  setGovSettings((s) => ({
                    ...s,
                    voteWindowDays: Math.min(
                      365,
                      Math.max(1, Number(e.target.value)),
                    ),
                  }))
                }
                className="h-8 text-sm"
                data-ocid="admin.governance.settings_window"
              />
              <p className="text-xs text-muted-foreground">
                Voting period length (1–365)
              </p>
            </div>
          </div>
          <div className="mt-4 rounded-md bg-muted/40 border border-border px-3 py-2 flex items-start gap-2">
            <HelpCircle
              size={13}
              className="text-muted-foreground mt-0.5 shrink-0"
            />
            <p className="text-xs text-muted-foreground">
              These defaults auto-fill the proposal creation form when members
              submit new proposals. Use{" "}
              <span className="font-medium text-foreground">Copy as JSON</span>{" "}
              to document your organisation's preferred governance
              configuration.
            </p>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}

// ── Credentials Admin Tab ─────────────────────────────────────────────────────
const CRED_TYPE_OPTIONS: { value: string; label: string }[] = [
  { value: "verifiedHuman", label: "Verified Human" },
  { value: "orgRepresentative", label: "Org Representative" },
  { value: "expertiseBadge", label: "Expertise Badge" },
  { value: "eventAttendee", label: "Event Attendee" },
  { value: "activistCertification", label: "Activist Certification" },
  { value: "custom", label: "Custom" },
];

const CRED_STATUS_COLORS: Record<string, string> = {
  pending: "bg-amber-500/20 text-amber-400",
  approved: "bg-sky-500/20 text-sky-400",
  active: "bg-emerald-500/20 text-emerald-400",
  revoked: "bg-red-500/20 text-red-400",
  rejected: "bg-muted text-muted-foreground",
};

function CredentialsAdminTab() {
  const backend = useBackend();

  // All credentials list
  const [credentials, setCredentials] = useState<Credential[]>([]);
  const [credsLoading, setCredsLoading] = useState(true);
  const [actionLoading, setActionLoading] = useState<string | null>(null);

  // Issue form
  const [issueSubject, setIssueSubject] = useState("");
  const [issueType, setIssueType] = useState("verifiedHuman");
  const [issueTitle, setIssueTitle] = useState("");
  const [issueDesc, setIssueDesc] = useState("");
  const [issueMeta, setIssueMeta] = useState("");
  const [issueExpiry, setIssueExpiry] = useState("");
  const [issuing, setIssuing] = useState(false);

  const loadCredentials = useCallback(async () => {
    if (!backend) return;
    setCredsLoading(true);
    try {
      const data = await backend.listAllCredentialsAdmin();
      setCredentials(data);
    } catch {
      toast.error("Failed to load credentials");
    } finally {
      setCredsLoading(false);
    }
  }, [backend]);

  useEffect(() => {
    loadCredentials();
  }, [loadCredentials]);

  async function handleApprove(credId: string) {
    if (!backend) return;
    setActionLoading(`approve-${credId}`);
    try {
      await backend.approveCredential(credId);
      toast.success("Credential approved");
      await loadCredentials();
    } catch {
      toast.error("Failed to approve credential");
    } finally {
      setActionLoading(null);
    }
  }

  async function handleReject(credId: string) {
    if (!backend) return;
    setActionLoading(`reject-${credId}`);
    try {
      await backend.rejectCredential(credId);
      toast.success("Credential rejected");
      await loadCredentials();
    } catch {
      toast.error("Failed to reject credential");
    } finally {
      setActionLoading(null);
    }
  }

  async function handleRevoke(credId: string) {
    if (!backend) return;
    setActionLoading(`revoke-${credId}`);
    try {
      await backend.revokeCredential(credId);
      toast.success("Credential revoked");
      await loadCredentials();
    } catch {
      toast.error("Failed to revoke credential");
    } finally {
      setActionLoading(null);
    }
  }

  async function handleIssue() {
    if (!backend || !issueSubject.trim() || !issueTitle.trim()) return;
    setIssuing(true);
    try {
      const expiresAt = issueExpiry
        ? BigInt(new Date(issueExpiry).getTime() * 1_000_000)
        : null;
      await backend.issueCredential(
        issueSubject.trim() as unknown as Principal,
        issueType as CredentialType,
        issueTitle.trim(),
        issueDesc.trim(),
        issueMeta.trim(),
        expiresAt,
      );
      toast.success("Credential issued successfully");
      setIssueSubject("");
      setIssueTitle("");
      setIssueDesc("");
      setIssueMeta("");
      setIssueExpiry("");
      await loadCredentials();
    } catch {
      toast.error("Failed to issue credential");
    } finally {
      setIssuing(false);
    }
  }

  const pending = credentials.filter((c) => String(c.status) === "pending");
  const others = credentials.filter((c) => String(c.status) !== "pending");

  function truncatePrincipal(p: { toString(): string } | string): string {
    const s = typeof p === "string" ? p : p.toString();
    return s.length > 16 ? `${s.slice(0, 8)}…${s.slice(-6)}` : s;
  }

  return (
    <div className="space-y-6" data-ocid="admin.credentials.tab_content">
      {/* Header Stats */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard
          icon={Award}
          label="Total Credentials"
          value={credentials.length}
        />
        <StatCard
          icon={Clock}
          label="Pending Approval"
          value={pending.length}
          color="amber-500"
        />
        <StatCard
          icon={CheckCircle}
          label="Active"
          value={
            credentials.filter((c) => String(c.status) === "active").length
          }
          color="emerald-500"
        />
        <StatCard
          icon={XCircle}
          label="Revoked"
          value={
            credentials.filter((c) => String(c.status) === "revoked").length
          }
          color="red-500"
        />
      </div>

      {/* ── Approval Queue ──────────────────────────────────────────────── */}
      <Card
        className="border border-emerald-500/20 bg-card"
        data-ocid="admin.credentials.approval_queue"
      >
        <CardHeader className="pb-3 flex flex-row items-center justify-between">
          <div>
            <CardTitle className="text-sm flex items-center gap-2">
              <Clock size={14} className="text-amber-500" />
              Approval Queue
              {pending.length > 0 && (
                <span className="ml-1 px-1.5 py-0.5 rounded-full text-[10px] font-bold bg-amber-500/20 text-amber-400">
                  {pending.length}
                </span>
              )}
            </CardTitle>
            <CardDescription className="text-xs mt-0.5">
              Credentials awaiting admin review
            </CardDescription>
          </div>
          <Button
            variant="outline"
            size="sm"
            onClick={loadCredentials}
            disabled={credsLoading}
            className="h-7 text-xs"
            data-ocid="admin.credentials.refresh.button"
          >
            {credsLoading ? (
              <Loader2 size={11} className="animate-spin" />
            ) : (
              "Refresh"
            )}
          </Button>
        </CardHeader>
        <CardContent className="p-0">
          {credsLoading ? (
            <div className="p-4" data-ocid="admin.credentials.loading_state">
              <TableSkeleton rows={3} cols={5} />
            </div>
          ) : pending.length === 0 ? (
            <div
              className="text-center py-10 text-muted-foreground text-sm"
              data-ocid="admin.credentials.queue_empty_state"
            >
              <Award size={32} className="mx-auto mb-3 opacity-30" />
              No credentials pending approval
            </div>
          ) : (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead className="text-xs">Subject</TableHead>
                  <TableHead className="text-xs">Title</TableHead>
                  <TableHead className="text-xs">Type</TableHead>
                  <TableHead className="text-xs">Issued</TableHead>
                  <TableHead className="text-xs text-right">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {pending.map((cred, i) => (
                  <TableRow
                    key={cred.id}
                    data-ocid={`admin.credentials.queue_row.${i + 1}`}
                  >
                    <TableCell className="text-xs font-mono">
                      {truncatePrincipal(cred.subject)}
                    </TableCell>
                    <TableCell className="text-xs font-medium max-w-[180px] truncate">
                      {cred.title}
                    </TableCell>
                    <TableCell>
                      <span className="px-1.5 py-0.5 rounded text-xs bg-emerald-500/10 text-emerald-400 capitalize">
                        {String(cred.credentialType)}
                      </span>
                    </TableCell>
                    <TableCell className="text-xs text-muted-foreground">
                      {formatDate(cred.issuedAt)}
                    </TableCell>
                    <TableCell className="text-right">
                      <div className="flex gap-1.5 justify-end">
                        <Button
                          size="sm"
                          variant="outline"
                          disabled={actionLoading === `approve-${cred.id}`}
                          onClick={() => handleApprove(cred.id)}
                          className="h-6 px-2 text-[10px] border-emerald-500/40 text-emerald-500 hover:bg-emerald-500/10"
                          data-ocid={`admin.credentials.approve.button.${i + 1}`}
                        >
                          {actionLoading === `approve-${cred.id}` ? (
                            <Loader2 size={10} className="animate-spin" />
                          ) : (
                            "Approve"
                          )}
                        </Button>
                        <Button
                          size="sm"
                          variant="outline"
                          disabled={actionLoading === `reject-${cred.id}`}
                          onClick={() => handleReject(cred.id)}
                          className="h-6 px-2 text-[10px] border-red-500/40 text-red-500 hover:bg-red-500/10"
                          data-ocid={`admin.credentials.reject.button.${i + 1}`}
                        >
                          {actionLoading === `reject-${cred.id}` ? (
                            <Loader2 size={10} className="animate-spin" />
                          ) : (
                            "Reject"
                          )}
                        </Button>
                      </div>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          )}
        </CardContent>
      </Card>

      {/* ── Issue Credential Form ───────────────────────────────────────── */}
      <Card
        className="border border-emerald-500/20 bg-card"
        data-ocid="admin.credentials.issue_form"
      >
        <CardHeader className="pb-3">
          <CardTitle className="text-sm flex items-center gap-2">
            <Zap size={14} className="text-emerald-500" />
            Issue Credential
          </CardTitle>
          <CardDescription className="text-xs mt-0.5">
            Directly issue a verified credential to any member principal
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-4">
            <div className="space-y-1.5">
              <Label className="text-xs">Subject Principal</Label>
              <Input
                placeholder="xxxxx-xxxxx-xxxxx-xxxxx-cai"
                value={issueSubject}
                onChange={(e) => setIssueSubject(e.target.value)}
                className="h-8 text-xs"
                data-ocid="admin.credentials.issue_subject.input"
              />
            </div>
            <div className="space-y-1.5">
              <Label className="text-xs">Credential Type</Label>
              <Select value={issueType} onValueChange={setIssueType}>
                <SelectTrigger
                  className="h-8 text-xs"
                  data-ocid="admin.credentials.issue_type.select"
                >
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {CRED_TYPE_OPTIONS.map((o) => (
                    <SelectItem
                      key={o.value}
                      value={o.value}
                      className="text-xs"
                    >
                      {o.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-1.5">
              <Label className="text-xs">Title</Label>
              <Input
                placeholder="e.g. Verified Founding Member"
                value={issueTitle}
                onChange={(e) => setIssueTitle(e.target.value)}
                className="h-8 text-xs"
                data-ocid="admin.credentials.issue_title.input"
              />
            </div>
            <div className="space-y-1.5">
              <Label className="text-xs">Expiry Date (optional)</Label>
              <Input
                type="date"
                value={issueExpiry}
                onChange={(e) => setIssueExpiry(e.target.value)}
                className="h-8 text-xs"
                data-ocid="admin.credentials.issue_expiry.input"
              />
            </div>
            <div className="space-y-1.5 sm:col-span-2">
              <Label className="text-xs">Description</Label>
              <Input
                placeholder="Brief description of this credential"
                value={issueDesc}
                onChange={(e) => setIssueDesc(e.target.value)}
                className="h-8 text-xs"
                data-ocid="admin.credentials.issue_desc.input"
              />
            </div>
            <div className="space-y-1.5 sm:col-span-2">
              <Label className="text-xs">
                Metadata (optional JSON or notes)
              </Label>
              <Input
                placeholder='e.g. {"program":"founding","cohort":"2026-Q1"}'
                value={issueMeta}
                onChange={(e) => setIssueMeta(e.target.value)}
                className="h-8 text-xs font-mono"
                data-ocid="admin.credentials.issue_meta.input"
              />
            </div>
          </div>
          <Button
            size="sm"
            onClick={handleIssue}
            disabled={issuing || !issueSubject.trim() || !issueTitle.trim()}
            className="h-8 text-xs bg-emerald-600 hover:bg-emerald-700 text-white"
            data-ocid="admin.credentials.issue.submit_button"
          >
            {issuing ? (
              <Loader2 size={12} className="animate-spin mr-1.5" />
            ) : (
              <Zap size={12} className="mr-1.5" />
            )}
            {issuing ? "Issuing…" : "Issue Credential"}
          </Button>
        </CardContent>
      </Card>

      {/* ── All Credentials Table ───────────────────────────────────────── */}
      <Card
        className="border border-emerald-500/20 bg-card"
        data-ocid="admin.credentials.all_table"
      >
        <CardHeader className="pb-3 flex flex-row items-center justify-between">
          <div>
            <CardTitle className="text-sm flex items-center gap-2">
              <Award size={14} className="text-emerald-500" />
              All Credentials ({credentials.length})
            </CardTitle>
            <CardDescription className="text-xs mt-0.5">
              Full registry of issued credentials across all tenants
            </CardDescription>
          </div>
        </CardHeader>
        <CardContent className="p-0">
          {credsLoading ? (
            <div className="p-4">
              <TableSkeleton rows={4} cols={6} />
            </div>
          ) : credentials.length === 0 ? (
            <div
              className="text-center py-12 text-muted-foreground text-sm"
              data-ocid="admin.credentials.all_empty_state"
            >
              <Award size={32} className="mx-auto mb-3 opacity-30" />
              No credentials issued yet
            </div>
          ) : (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead className="text-xs">Subject</TableHead>
                  <TableHead className="text-xs">Title</TableHead>
                  <TableHead className="text-xs">Type</TableHead>
                  <TableHead className="text-xs">Status</TableHead>
                  <TableHead className="text-xs">Issued</TableHead>
                  <TableHead className="text-xs">Expires</TableHead>
                  <TableHead className="text-xs text-right">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {[...pending, ...others].map((cred, i) => {
                  const statusKey = String(cred.status);
                  const isActive = statusKey === "active";
                  return (
                    <TableRow
                      key={cred.id}
                      data-ocid={`admin.credentials.row.${i + 1}`}
                      className={statusKey === "revoked" ? "opacity-50" : ""}
                    >
                      <TableCell className="text-xs font-mono">
                        {truncatePrincipal(cred.subject)}
                      </TableCell>
                      <TableCell className="text-xs font-medium max-w-[160px] truncate">
                        {cred.title}
                      </TableCell>
                      <TableCell>
                        <span className="px-1.5 py-0.5 rounded text-xs bg-primary/10 text-primary capitalize">
                          {String(cred.credentialType)}
                        </span>
                      </TableCell>
                      <TableCell>
                        <span
                          className={`px-1.5 py-0.5 rounded text-xs capitalize ${CRED_STATUS_COLORS[statusKey] ?? "bg-muted text-muted-foreground"}`}
                        >
                          {statusKey}
                        </span>
                      </TableCell>
                      <TableCell className="text-xs text-muted-foreground">
                        {formatDate(cred.issuedAt)}
                      </TableCell>
                      <TableCell className="text-xs text-muted-foreground">
                        {cred.expiresAt ? formatDate(cred.expiresAt) : "—"}
                      </TableCell>
                      <TableCell className="text-right">
                        {isActive && (
                          <Button
                            size="sm"
                            variant="outline"
                            disabled={actionLoading === `revoke-${cred.id}`}
                            onClick={() => handleRevoke(cred.id)}
                            className="h-6 px-2 text-[10px] border-red-500/30 text-red-500 hover:bg-red-500/10"
                            data-ocid={`admin.credentials.revoke.button.${i + 1}`}
                          >
                            {actionLoading === `revoke-${cred.id}` ? (
                              <Loader2 size={10} className="animate-spin" />
                            ) : (
                              "Revoke"
                            )}
                          </Button>
                        )}
                        {statusKey === "pending" && (
                          <div className="flex gap-1 justify-end">
                            <Button
                              size="sm"
                              variant="outline"
                              disabled={actionLoading === `approve-${cred.id}`}
                              onClick={() => handleApprove(cred.id)}
                              className="h-6 px-2 text-[10px] border-emerald-500/40 text-emerald-500 hover:bg-emerald-500/10"
                              data-ocid={`admin.credentials.all_approve.button.${i + 1}`}
                            >
                              Approve
                            </Button>
                            <Button
                              size="sm"
                              variant="outline"
                              disabled={actionLoading === `reject-${cred.id}`}
                              onClick={() => handleReject(cred.id)}
                              className="h-6 px-2 text-[10px] border-red-500/40 text-red-500 hover:bg-red-500/10"
                              data-ocid={`admin.credentials.all_reject.button.${i + 1}`}
                            >
                              Reject
                            </Button>
                          </div>
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
  );
}

// ── DAO Token Admin Tab ───────────────────────────────────────────────────────
function DAOTokenAdminTab() {
  const backend = useBackend();

  // Stats
  const [stats, setStats] = useState<{
    totalSupply: bigint;
    treasuryBalance: bigint;
    totalHolders: bigint;
  } | null>(null);
  const [statsLoading, setStatsLoading] = useState(true);

  // Holders table
  const [holders, setHolders] = useState<DAOTokenRecord[]>([]);
  const [holdersLoading, setHoldersLoading] = useState(true);

  // Airdrop
  const [airdropping, setAirdropping] = useState(false);
  const [airdropResult, setAirdropResult] = useState<{
    totalTokens: bigint;
    airdropped: bigint;
  } | null>(null);
  const [airdropError, setAirdropError] = useState<string | null>(null);

  const loadStats = useCallback(async () => {
    if (!backend) return;
    setStatsLoading(true);
    try {
      const data = await backend.getDAOTokenStats();
      setStats(data);
    } catch {
      toast.error("Failed to load DAO token stats");
    } finally {
      setStatsLoading(false);
    }
  }, [backend]);

  const loadHolders = useCallback(async () => {
    if (!backend) return;
    setHoldersLoading(true);
    try {
      const data = await backend.listAllDAOTokensAdmin();
      setHolders(data);
    } catch {
      toast.error("Failed to load token holders");
    } finally {
      setHoldersLoading(false);
    }
  }, [backend]);

  useEffect(() => {
    loadStats();
    loadHolders();
  }, [loadStats, loadHolders]);

  async function handleAirdrop() {
    if (!backend) return;
    setAirdropping(true);
    setAirdropResult(null);
    setAirdropError(null);
    try {
      const result = await backend.airdropToAllMembers();
      setAirdropResult(result);
      toast.success(
        `Airdrop complete — ${Number(result.airdropped)} members received tokens`,
      );
      await Promise.all([loadStats(), loadHolders()]);
    } catch (err) {
      const msg = err instanceof Error ? err.message : "Airdrop failed";
      setAirdropError(msg);
      toast.error(msg);
    } finally {
      setAirdropping(false);
    }
  }

  function truncatePrincipal(p: { toString(): string } | string): string {
    const s = typeof p === "string" ? p : p.toString();
    return s.length > 16 ? `${s.slice(0, 8)}…${s.slice(-6)}` : s;
  }

  const tierAirdropAmounts: Record<string, number> = {
    supporter: 100,
    associate: 200,
    community: 500,
    activist: 1000,
    partner: 2000,
    ambassador: 5000,
    founder: 10000,
  };

  return (
    <div className="space-y-6" data-ocid="admin.dao_token.tab_content">
      {/* ── Token Stats ─────────────────────────────────────────────────── */}
      <div
        className="grid grid-cols-1 sm:grid-cols-3 gap-4"
        data-ocid="admin.dao_token.stats_section"
      >
        {statsLoading ? (
          <>
            <Skeleton className="h-24" />
            <Skeleton className="h-24" />
            <Skeleton className="h-24" />
          </>
        ) : stats ? (
          <>
            <Card className="border border-amber-500/20 bg-card">
              <CardContent className="p-5">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-lg flex items-center justify-center bg-amber-500/10">
                    <Coins size={18} className="text-amber-500" />
                  </div>
                  <div>
                    <p className="text-xs text-muted-foreground font-medium">
                      Total Supply
                    </p>
                    <p className="text-2xl font-bold text-amber-500 font-display">
                      {Number(stats.totalSupply).toLocaleString()}
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>
            <Card className="border border-amber-500/20 bg-card">
              <CardContent className="p-5">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-lg flex items-center justify-center bg-amber-500/10">
                    <Wallet size={18} className="text-amber-400" />
                  </div>
                  <div>
                    <p className="text-xs text-muted-foreground font-medium">
                      Treasury Balance
                    </p>
                    <p className="text-2xl font-bold text-foreground font-display">
                      {Number(stats.treasuryBalance).toLocaleString()}
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>
            <Card className="border border-amber-500/20 bg-card">
              <CardContent className="p-5">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-lg flex items-center justify-center bg-amber-500/10">
                    <Users size={18} className="text-amber-400" />
                  </div>
                  <div>
                    <p className="text-xs text-muted-foreground font-medium">
                      Token Holders
                    </p>
                    <p className="text-2xl font-bold text-foreground font-display">
                      {Number(stats.totalHolders).toLocaleString()}
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </>
        ) : (
          <div className="col-span-3 text-center py-8 text-muted-foreground text-sm">
            Could not load token stats
          </div>
        )}
      </div>

      {/* ── Airdrop Panel ───────────────────────────────────────────────── */}
      <Card
        className="border border-amber-500/20 bg-card"
        data-ocid="admin.dao_token.airdrop_panel"
      >
        <CardHeader className="pb-3">
          <CardTitle className="text-sm flex items-center gap-2">
            <Sparkles size={14} className="text-amber-500" />
            Token Airdrop
          </CardTitle>
          <CardDescription className="text-xs mt-0.5">
            Distribute IIINTL governance tokens to all MLM-initialized members
            based on membership tier
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          {/* Tier distribution reference */}
          <div className="rounded-lg border border-amber-500/15 bg-amber-500/5 p-4">
            <p className="text-xs font-medium text-amber-500 mb-3 flex items-center gap-1.5">
              <Coins size={12} />
              Tier-Based Distribution Amounts
            </p>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
              {Object.entries(tierAirdropAmounts).map(([tier, amount]) => (
                <div
                  key={tier}
                  className="flex items-center justify-between rounded bg-amber-500/10 px-2.5 py-1.5"
                >
                  <span className="text-xs capitalize text-muted-foreground">
                    {tier}
                  </span>
                  <span className="text-xs font-bold text-amber-400">
                    {amount.toLocaleString()}
                  </span>
                </div>
              ))}
            </div>
          </div>

          {/* Airdrop trigger */}
          <div className="flex items-center gap-4 flex-wrap">
            <Button
              size="default"
              onClick={handleAirdrop}
              disabled={airdropping}
              className="bg-amber-500 hover:bg-amber-600 text-white font-semibold px-6"
              data-ocid="admin.dao_token.airdrop.trigger_button"
            >
              {airdropping ? (
                <>
                  <Loader2 size={14} className="animate-spin mr-2" />
                  Distributing Tokens…
                </>
              ) : (
                <>
                  <Sparkles size={14} className="mr-2" />
                  Trigger Airdrop to All Members
                </>
              )}
            </Button>
            <p className="text-xs text-muted-foreground">
              This action distributes tokens to all members who have initialized
              their MLM profile.
            </p>
          </div>

          {/* Result banner */}
          {airdropResult && (
            <div
              className="flex items-start gap-2 rounded-md bg-amber-500/10 border border-amber-500/30 px-4 py-3 text-sm"
              data-ocid="admin.dao_token.airdrop.result_banner"
            >
              <CheckCircle
                size={15}
                className="text-amber-500 shrink-0 mt-0.5"
              />
              <div>
                <p className="font-semibold text-amber-400">
                  Airdrop complete —{" "}
                  {Number(airdropResult.airdropped).toLocaleString()} member
                  {airdropResult.airdropped !== BigInt(1) ? "s" : ""} received
                  tokens
                </p>
                <p className="text-xs text-muted-foreground mt-0.5">
                  {Number(airdropResult.totalTokens).toLocaleString()} total
                  tokens distributed
                </p>
              </div>
            </div>
          )}
          {airdropError && (
            <div
              className="flex items-center gap-2 rounded-md bg-red-500/10 border border-red-500/30 px-4 py-3 text-sm text-red-400"
              data-ocid="admin.dao_token.airdrop.error_banner"
            >
              <XCircle size={15} className="shrink-0" />
              {airdropError}
            </div>
          )}
        </CardContent>
      </Card>

      {/* ── All Token Holders Table ──────────────────────────────────────── */}
      <Card
        className="border border-amber-500/20 bg-card"
        data-ocid="admin.dao_token.holders_table"
      >
        <CardHeader className="pb-3 flex flex-row items-center justify-between">
          <div>
            <CardTitle className="text-sm flex items-center gap-2">
              <Users size={14} className="text-amber-500" />
              All Token Holders ({holders.length})
            </CardTitle>
            <CardDescription className="text-xs mt-0.5">
              Complete token holder registry sorted by balance
            </CardDescription>
          </div>
          <Button
            variant="outline"
            size="sm"
            onClick={loadHolders}
            disabled={holdersLoading}
            className="h-7 text-xs"
            data-ocid="admin.dao_token.holders.refresh.button"
          >
            {holdersLoading ? (
              <Loader2 size={11} className="animate-spin" />
            ) : (
              "Refresh"
            )}
          </Button>
        </CardHeader>
        <CardContent className="p-0">
          {holdersLoading ? (
            <div
              className="p-4"
              data-ocid="admin.dao_token.holders.loading_state"
            >
              <TableSkeleton rows={5} cols={5} />
            </div>
          ) : holders.length === 0 ? (
            <div
              className="text-center py-12 text-muted-foreground text-sm"
              data-ocid="admin.dao_token.holders.empty_state"
            >
              <Wallet size={32} className="mx-auto mb-3 opacity-30" />
              No token holders yet — trigger an airdrop to get started
            </div>
          ) : (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead className="text-xs">#</TableHead>
                  <TableHead className="text-xs">Principal</TableHead>
                  <TableHead className="text-xs text-right">Balance</TableHead>
                  <TableHead className="text-xs text-right">
                    Total Earned
                  </TableHead>
                  <TableHead className="text-xs text-right">
                    Total Burned
                  </TableHead>
                  <TableHead className="text-xs">Last Airdrop</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {[...holders]
                  .sort((a, b) => Number(b.balance) - Number(a.balance))
                  .map((holder, i) => (
                    <TableRow
                      key={holder.principal.toString()}
                      data-ocid={`admin.dao_token.holder_row.${i + 1}`}
                    >
                      <TableCell className="text-xs text-muted-foreground w-8">
                        {i + 1}
                      </TableCell>
                      <TableCell className="text-xs font-mono">
                        {truncatePrincipal(holder.principal)}
                      </TableCell>
                      <TableCell className="text-xs text-right font-bold text-amber-500">
                        {Number(holder.balance).toLocaleString()}
                      </TableCell>
                      <TableCell className="text-xs text-right text-emerald-500 font-medium">
                        {Number(holder.totalEarned).toLocaleString()}
                      </TableCell>
                      <TableCell className="text-xs text-right text-muted-foreground">
                        {Number(holder.totalBurned).toLocaleString()}
                      </TableCell>
                      <TableCell className="text-xs text-muted-foreground">
                        {holder.lastAirdropAt
                          ? formatDate(holder.lastAirdropAt)
                          : "—"}
                      </TableCell>
                    </TableRow>
                  ))}
              </TableBody>
            </Table>
          )}
        </CardContent>
      </Card>
    </div>
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
        const admin = asAdmin(backend);
        // Use admin cross-tenant variants so the super-admin sees all data
        // across every tenant (PaaS Phase F2). Falls back to scoped methods
        // if the new backend functions are not yet deployed.
        const [orgData, campaignData, threadData] = await Promise.all([
          admin?.listAllOrgsAdmin?.() ?? backend.listOrgs(),
          admin?.listAllCampaignsAdmin?.() ?? backend.listCampaigns(),
          admin?.listAllThreadsAdmin?.() ?? backend.listThreads(),
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
            <TabsTrigger
              value="crowdfunding"
              className="text-xs gap-1.5"
              data-ocid="admin.crowdfunding.tab_trigger"
            >
              <Coins size={13} />
              Crowdfunding
            </TabsTrigger>
            <TabsTrigger
              value="governance"
              className="text-xs gap-1.5"
              data-ocid="admin.governance.tab"
            >
              <Scale size={13} />
              Governance
            </TabsTrigger>
            <TabsTrigger
              value="credentials"
              className="text-xs gap-1.5"
              data-ocid="admin.credentials.tab"
            >
              <Award size={13} />
              Credentials
            </TabsTrigger>
            <TabsTrigger
              value="dao-token"
              className="text-xs gap-1.5"
              data-ocid="admin.dao_token.tab"
            >
              <Coins size={13} />
              DAO Token
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
          <TabsContent value="crowdfunding">
            <CrowdfundingAdminTab />
          </TabsContent>
          <TabsContent value="governance">
            <GovernanceAdminTab />
          </TabsContent>
          <TabsContent value="credentials">
            <CredentialsAdminTab />
          </TabsContent>
          <TabsContent value="dao-token">
            <DAOTokenAdminTab />
          </TabsContent>
        </Tabs>
      </div>
    </Layout>
  );
}
