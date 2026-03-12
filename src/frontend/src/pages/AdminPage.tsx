import type { Campaign, ForumThread, Organization } from "@/backend.d";
import { CampaignStatus, OrgStatus, ThreadStatus } from "@/backend.d";
import { Layout } from "@/components/Layout";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
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
import {
  Activity,
  BookOpen,
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
        </Tabs>
      </div>
    </Layout>
  );
}
