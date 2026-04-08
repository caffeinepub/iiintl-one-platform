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
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
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
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Textarea } from "@/components/ui/textarea";
import { useBackend } from "@/hooks/useBackend";
import type {
  BillingRecord,
  BillingStatus,
  Tenant,
  TenantBranding,
  TenantMember,
  TenantSubscription,
  TenantUsage,
} from "@/types/appTypes";
import { PaymentMethod, TenantStatus, TenantTier } from "@/types/appTypes";
import {
  AlertTriangle,
  Ban,
  Building2,
  CalendarDays,
  Clock,
  CreditCard,
  Globe,
  HardDrive,
  Loader2,
  Paintbrush,
  Pencil,
  Receipt,
  RefreshCw,
  Rocket,
  Trash2,
  TrendingUp,
  UserPlus,
  Users,
} from "lucide-react";
import { useCallback, useEffect, useState } from "react";
import { toast } from "sonner";

function StatusBadge({ status }: { status: TenantStatus }) {
  const map: Record<TenantStatus, { label: string; className: string }> = {
    [TenantStatus.trial]: {
      label: "Trial",
      className: "bg-yellow-500/20 text-yellow-400 border-0",
    },
    [TenantStatus.active]: {
      label: "Active",
      className: "bg-emerald-500/20 text-emerald-400 border-0",
    },
    [TenantStatus.suspended]: {
      label: "Suspended",
      className: "bg-red-500/20 text-red-400 border-0",
    },
    [TenantStatus.cancelled]: {
      label: "Cancelled",
      className: "bg-muted text-muted-foreground border-0",
    },
  };
  const cfg = map[status] ?? { label: status, className: "" };
  return <Badge className={cfg.className}>{cfg.label}</Badge>;
}

function TierBadge({ tier }: { tier: TenantTier }) {
  const map: Record<TenantTier, { label: string; className: string }> = {
    [TenantTier.starter]: {
      label: "Starter",
      className: "bg-emerald-500/20 text-emerald-400 border-0",
    },
    [TenantTier.organization]: {
      label: "Organization",
      className: "bg-blue-500/20 text-blue-400 border-0",
    },
    [TenantTier.enterprise]: {
      label: "Enterprise",
      className: "bg-purple-500/20 text-purple-400 border-0",
    },
  };
  const cfg = map[tier] ?? { label: tier, className: "" };
  return <Badge className={cfg.className}>{cfg.label}</Badge>;
}

function formatNsDate(ns: bigint): string {
  return new Date(Number(ns) / 1_000_000).toLocaleDateString();
}

function OnboardingCard({ onCreated }: { onCreated: () => void }) {
  const backend = useBackend();
  const [orgName, setOrgName] = useState("");
  const [contactEmail, setContactEmail] = useState("");
  const [tier, setTier] = useState<TenantTier>(TenantTier.starter);
  const [paymentMethod, setPaymentMethod] = useState<PaymentMethod>(
    PaymentMethod.stripe,
  );
  const [loading, setLoading] = useState(false);

  async function handleCreate() {
    if (!backend) return;
    if (!orgName.trim() || !contactEmail.trim()) {
      toast.error("Please fill in all required fields");
      return;
    }
    setLoading(true);
    try {
      await backend.createTenant(
        orgName.trim(),
        contactEmail.trim(),
        tier,
        paymentMethod,
      );
      toast.success("Tenant created successfully!");
      onCreated();
    } catch {
      toast.error("Failed to create tenant");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="max-w-lg mx-auto" data-ocid="tenant.create.panel">
      <Card>
        <CardHeader className="text-center pb-4">
          <div className="w-12 h-12 bg-primary/10 rounded-2xl flex items-center justify-center mx-auto mb-3">
            <Rocket size={22} className="text-primary" />
          </div>
          <CardTitle>Set up your tenant</CardTitle>
          <CardDescription>
            Create your organisation's private space on the IIIntl One Platform.
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-1.5">
            <Label htmlFor="orgName">Organisation Name *</Label>
            <Input
              id="orgName"
              placeholder="e.g. Global Advocacy Network"
              value={orgName}
              onChange={(e) => setOrgName(e.target.value)}
              data-ocid="tenant.create.input"
            />
          </div>
          <div className="space-y-1.5">
            <Label htmlFor="contactEmail">Contact Email *</Label>
            <Input
              id="contactEmail"
              type="email"
              placeholder="admin@yourorg.org"
              value={contactEmail}
              onChange={(e) => setContactEmail(e.target.value)}
              data-ocid="tenant.create.email.input"
            />
          </div>
          <div className="space-y-1.5">
            <Label>Plan</Label>
            <Select
              value={tier}
              onValueChange={(v) => setTier(v as TenantTier)}
            >
              <SelectTrigger data-ocid="tenant.create.tier.select">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value={TenantTier.starter}>
                  Starter — $49/mo · 50 members
                </SelectItem>
                <SelectItem value={TenantTier.organization}>
                  Organisation — $299/mo · 500 members
                </SelectItem>
                <SelectItem value={TenantTier.enterprise}>
                  Enterprise — $999/mo · 10,000 members
                </SelectItem>
              </SelectContent>
            </Select>
          </div>
          <div className="space-y-1.5">
            <Label>Payment Method</Label>
            <Select
              value={paymentMethod}
              onValueChange={(v) => setPaymentMethod(v as PaymentMethod)}
            >
              <SelectTrigger data-ocid="tenant.create.payment.select">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value={PaymentMethod.stripe}>
                  Credit / Debit Card (Stripe)
                </SelectItem>
                <SelectItem value={PaymentMethod.icp}>ICP Token</SelectItem>
                <SelectItem value={PaymentMethod.invoice}>Invoice</SelectItem>
              </SelectContent>
            </Select>
          </div>
          <Button
            className="w-full mt-2"
            onClick={handleCreate}
            disabled={loading}
            data-ocid="tenant.create.submit_button"
          >
            {loading ? (
              <Loader2 size={14} className="mr-2 animate-spin" />
            ) : (
              <Rocket size={14} className="mr-2" />
            )}
            {loading ? "Creating..." : "Create Tenant"}
          </Button>
        </CardContent>
      </Card>
    </div>
  );
}

// ─── Usage Tab ────────────────────────────────────────────────────────────────
function UsageTab({ tenantId: _tenantId }: { tenantId: string }) {
  const backend = useBackend();
  const [usage, setUsage] = useState<TenantUsage | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!backend) return;
    backend
      .getTenantUsage()
      .then((u) => setUsage(u))
      .catch(() => toast.error("Failed to load usage"))
      .finally(() => setLoading(false));
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [backend]);

  if (loading) {
    return (
      <div className="space-y-3" data-ocid="tenant.usage.loading_state">
        <Skeleton className="h-24 w-full rounded-xl" />
        <Skeleton className="h-24 w-full rounded-xl" />
      </div>
    );
  }

  if (!usage) {
    return (
      <p
        className="text-muted-foreground text-sm"
        data-ocid="tenant.usage.empty_state"
      >
        Usage data unavailable.
      </p>
    );
  }

  const memberPct =
    usage.memberLimit > 0n
      ? Math.min(
          100,
          Math.round(
            (Number(usage.memberCount) / Number(usage.memberLimit)) * 100,
          ),
        )
      : 0;
  const storagePct =
    usage.storageLimit > 0n
      ? Math.min(
          100,
          Math.round((usage.storageUsedGB / Number(usage.storageLimit)) * 100),
        )
      : 0;

  function barColor(pct: number) {
    if (pct >= 100) return "bg-red-500";
    if (pct >= 80) return "bg-amber-500";
    return "bg-primary";
  }

  return (
    <div className="space-y-4">
      {usage.status === TenantStatus.trial && (
        <div className="flex items-center gap-3 p-3 rounded-lg bg-yellow-500/10 border border-yellow-500/20 text-yellow-400 text-sm">
          <Clock size={16} />
          <span>
            Your trial ends in{" "}
            <strong>{usage.daysLeftInTrial.toString()} days</strong>. Upgrade to
            keep access.
          </span>
        </div>
      )}
      <Card>
        <CardHeader className="pb-2">
          <CardTitle className="text-sm flex items-center gap-2">
            <Users size={14} /> Members
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-2">
          <div className="flex justify-between text-sm">
            <span className="text-muted-foreground">Used</span>
            <span className="font-medium">
              {usage.memberCount.toString()} / {usage.memberLimit.toString()}
            </span>
          </div>
          <div className="relative h-2 rounded-full bg-muted overflow-hidden">
            <div
              className={`h-full rounded-full transition-all ${barColor(memberPct)}`}
              style={{ width: `${memberPct}%` }}
            />
          </div>
          <p className="text-xs text-muted-foreground">{memberPct}% used</p>
        </CardContent>
      </Card>
      <Card>
        <CardHeader className="pb-2">
          <CardTitle className="text-sm flex items-center gap-2">
            <HardDrive size={14} /> Storage
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-2">
          <div className="flex justify-between text-sm">
            <span className="text-muted-foreground">Used</span>
            <span className="font-medium">
              {usage.storageUsedGB.toFixed(2)} GB /{" "}
              {usage.storageLimit.toString()} GB
            </span>
          </div>
          <div className="relative h-2 rounded-full bg-muted overflow-hidden">
            <div
              className={`h-full rounded-full transition-all ${barColor(storagePct)}`}
              style={{ width: `${storagePct}%` }}
            />
          </div>
          <p className="text-xs text-muted-foreground">{storagePct}% used</p>
        </CardContent>
      </Card>
    </div>
  );
}

// ─── Members Tab ──────────────────────────────────────────────────────────────
function MembersTab({ tenantId: _tenantId }: { tenantId: string }) {
  const backend = useBackend();
  const [members, setMembers] = useState<TenantMember[]>([]);
  const [count, setCount] = useState<bigint>(0n);
  const [loading, setLoading] = useState(true);
  const [newPrincipal, setNewPrincipal] = useState("");
  const [newRole, setNewRole] = useState("member");
  const [addLoading, setAddLoading] = useState(false);
  const [removeLoading, setRemoveLoading] = useState<string | null>(null);

  const loadMembers = useCallback(async () => {
    if (!backend) return;
    setLoading(true);
    try {
      const [m, c] = await Promise.all([
        backend.listTenantMembers(),
        backend.getTenantMemberCount(),
      ]);
      setMembers(m);
      setCount(c);
    } catch {
      toast.error("Failed to load members");
    } finally {
      setLoading(false);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [backend]);

  useEffect(() => {
    loadMembers();
  }, [loadMembers]);

  async function handleAdd() {
    if (!backend || !newPrincipal.trim()) return;
    setAddLoading(true);
    try {
      await backend.addTenantMember(newPrincipal.trim(), newRole);
      toast.success("Member added");
      setNewPrincipal("");
      await loadMembers();
    } catch {
      toast.error("Failed to add member");
    } finally {
      setAddLoading(false);
    }
  }

  async function handleRemove(principalStr: string) {
    if (!backend) return;
    setRemoveLoading(principalStr);
    try {
      await backend.removeTenantMember(principalStr);
      toast.success("Member removed");
      await loadMembers();
    } catch {
      toast.error("Failed to remove member");
    } finally {
      setRemoveLoading(null);
    }
  }

  return (
    <div className="space-y-4" data-ocid="tenant.members.panel">
      <div className="flex items-center justify-between">
        <h3 className="text-sm font-medium text-muted-foreground">
          {count.toString()} member{count !== 1n ? "s" : ""}
        </h3>
      </div>

      {/* Add member form */}
      <Card>
        <CardHeader className="pb-3">
          <CardTitle className="text-sm flex items-center gap-2">
            <UserPlus size={14} /> Add Member
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex flex-col sm:flex-row gap-2">
            <Input
              placeholder="Principal ID"
              value={newPrincipal}
              onChange={(e) => setNewPrincipal(e.target.value)}
              className="flex-1"
              data-ocid="tenant.add_member.input"
            />
            <Select value={newRole} onValueChange={setNewRole}>
              <SelectTrigger
                className="w-full sm:w-36"
                data-ocid="tenant.add_member.role.select"
              >
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="owner">Owner</SelectItem>
                <SelectItem value="admin">Admin</SelectItem>
                <SelectItem value="member">Member</SelectItem>
                <SelectItem value="viewer">Viewer</SelectItem>
              </SelectContent>
            </Select>
            <Button
              onClick={handleAdd}
              disabled={addLoading || !newPrincipal.trim()}
              data-ocid="tenant.add_member.button"
            >
              {addLoading ? (
                <Loader2 size={14} className="mr-1 animate-spin" />
              ) : (
                <UserPlus size={14} className="mr-1" />
              )}
              Add
            </Button>
          </div>
        </CardContent>
      </Card>

      {loading ? (
        <div className="space-y-2" data-ocid="tenant.members.loading_state">
          <Skeleton className="h-10 w-full" />
          <Skeleton className="h-10 w-full" />
          <Skeleton className="h-10 w-full" />
        </div>
      ) : members.length === 0 ? (
        <p
          className="text-sm text-muted-foreground text-center py-8"
          data-ocid="tenant.members.empty_state"
        >
          No members yet. Add the first member above.
        </p>
      ) : (
        <Table data-ocid="tenant.members.table">
          <TableHeader>
            <TableRow>
              <TableHead>Principal</TableHead>
              <TableHead>Role</TableHead>
              <TableHead>Added</TableHead>
              <TableHead />
            </TableRow>
          </TableHeader>
          <TableBody>
            {members.map((m, idx) => {
              const principalStr = m.memberPrincipal.toString();
              const short = `${principalStr.slice(0, 8)}…${principalStr.slice(-6)}`;
              return (
                <TableRow
                  key={principalStr}
                  data-ocid={`tenant.members.row.${idx + 1}`}
                >
                  <TableCell className="font-mono text-xs">{short}</TableCell>
                  <TableCell>
                    <Badge
                      className={
                        m.role === "owner"
                          ? "bg-purple-500/20 text-purple-400 border-0"
                          : m.role === "admin"
                            ? "bg-blue-500/20 text-blue-400 border-0"
                            : "bg-muted text-muted-foreground border-0"
                      }
                    >
                      {m.role}
                    </Badge>
                  </TableCell>
                  <TableCell className="text-xs text-muted-foreground">
                    {formatNsDate(m.addedAt)}
                  </TableCell>
                  <TableCell className="text-right">
                    <Button
                      variant="ghost"
                      size="sm"
                      disabled={
                        m.role === "owner" || removeLoading === principalStr
                      }
                      onClick={() => handleRemove(principalStr)}
                      data-ocid={`tenant.remove_member.delete_button.${idx + 1}`}
                    >
                      {removeLoading === principalStr ? (
                        <Loader2 size={13} className="animate-spin" />
                      ) : (
                        <Trash2 size={13} className="text-destructive" />
                      )}
                    </Button>
                  </TableCell>
                </TableRow>
              );
            })}
          </TableBody>
        </Table>
      )}
    </div>
  );
}

// ─── Branding Tab ─────────────────────────────────────────────────────────────
function BrandingTab({ tenantId: _tenantId }: { tenantId: string }) {
  const backend = useBackend();
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [logoError, setLogoError] = useState(false);

  const [brandName, setBrandName] = useState("");
  const [logoUrl, setLogoUrl] = useState("");
  const [primaryColor, setPrimaryColor] = useState("#6366f1");
  const [welcomeMessage, setWelcomeMessage] = useState("");

  useEffect(() => {
    if (!backend) return;
    backend
      .getMyTenantBranding()
      .then((b) => {
        if (b) {
          setBrandName(b.brandName);
          setLogoUrl(b.logoUrl);
          setPrimaryColor(b.primaryColor || "#6366f1");
          setWelcomeMessage(b.welcomeMessage);
        }
      })
      .catch(() => toast.error("Failed to load branding"))
      .finally(() => setLoading(false));
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [backend]);

  async function handleSave() {
    if (!backend) return;
    setSaving(true);
    try {
      await backend.updateTenantBranding(
        brandName,
        logoUrl,
        primaryColor,
        welcomeMessage,
      );
      toast.success("Branding saved successfully");
    } catch {
      toast.error("Failed to save branding");
    } finally {
      setSaving(false);
    }
  }

  if (loading) {
    return (
      <div className="space-y-3" data-ocid="tenant.branding.loading_state">
        <Skeleton className="h-32 w-full rounded-xl" />
        <Skeleton className="h-24 w-full rounded-xl" />
      </div>
    );
  }

  return (
    <div className="space-y-6" data-ocid="tenant.branding.panel">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-base">
            <Paintbrush size={16} className="text-primary" />
            White-label Branding
          </CardTitle>
          <CardDescription>
            Customise how your organisation appears across the platform.
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-5">
          {/* Brand Name */}
          <div className="space-y-1.5">
            <Label htmlFor="brandName">Brand Name</Label>
            <Input
              id="brandName"
              placeholder="e.g. Global Advocacy Network"
              value={brandName}
              onChange={(e) => setBrandName(e.target.value)}
              data-ocid="tenant.branding.name.input"
            />
          </div>

          {/* Logo URL */}
          <div className="space-y-1.5">
            <Label htmlFor="logoUrl">Logo URL</Label>
            <Input
              id="logoUrl"
              placeholder="https://yourorg.org/logo.png"
              value={logoUrl}
              onChange={(e) => {
                setLogoUrl(e.target.value);
                setLogoError(false);
              }}
              data-ocid="tenant.branding.logo.input"
            />
            {logoUrl && !logoError && (
              <div className="mt-2 flex items-center gap-3 p-3 rounded-lg bg-muted/40 border border-border">
                <img
                  src={logoUrl}
                  alt="Logo preview"
                  className="h-10 w-10 object-contain rounded"
                  onError={() => setLogoError(true)}
                />
                <span className="text-xs text-muted-foreground">
                  Logo preview
                </span>
              </div>
            )}
            {logoUrl && logoError && (
              <p className="text-xs text-destructive mt-1">
                Could not load image from this URL.
              </p>
            )}
          </div>

          {/* Accent Color */}
          <div className="space-y-1.5">
            <Label>Accent Colour</Label>
            <div className="flex items-center gap-3">
              <input
                type="color"
                value={primaryColor}
                onChange={(e) => setPrimaryColor(e.target.value)}
                className="h-9 w-12 rounded border border-border cursor-pointer bg-transparent"
                data-ocid="tenant.branding.color.input"
              />
              <Input
                value={primaryColor}
                onChange={(e) => setPrimaryColor(e.target.value)}
                className="w-32 font-mono text-sm"
                maxLength={7}
                placeholder="#6366f1"
              />
              <div
                className="h-9 w-9 rounded-lg border border-border flex-shrink-0"
                style={{ backgroundColor: primaryColor }}
              />
            </div>
          </div>

          {/* Welcome Message */}
          <div className="space-y-1.5">
            <Label htmlFor="welcomeMsg">Welcome Message</Label>
            <Textarea
              id="welcomeMsg"
              placeholder="Welcome to our platform space. Together we build a better world."
              value={welcomeMessage}
              onChange={(e) => setWelcomeMessage(e.target.value)}
              rows={3}
              data-ocid="tenant.branding.message.textarea"
            />
          </div>

          <Button
            onClick={handleSave}
            disabled={saving}
            data-ocid="tenant.branding.save_button"
          >
            {saving ? (
              <Loader2 size={14} className="mr-2 animate-spin" />
            ) : (
              <Paintbrush size={14} className="mr-2" />
            )}
            {saving ? "Saving..." : "Save Branding"}
          </Button>
        </CardContent>
      </Card>

      {/* Preview */}
      <Card
        className="overflow-hidden border-2"
        style={{ borderColor: `${primaryColor}40` }}
        data-ocid="tenant.branding.preview.card"
      >
        <div className="h-2" style={{ backgroundColor: primaryColor }} />
        <CardContent className="pt-5 pb-5">
          <div className="flex items-center gap-4">
            {logoUrl && !logoError && (
              <img
                src={logoUrl}
                alt="Brand logo"
                className="h-14 w-14 object-contain rounded-xl border border-border"
                onError={() => setLogoError(true)}
              />
            )}
            <div>
              <h3 className="text-lg font-bold" style={{ color: primaryColor }}>
                {brandName || "Your Brand Name"}
              </h3>
              {welcomeMessage && (
                <p className="text-sm text-muted-foreground mt-1 max-w-sm">
                  {welcomeMessage}
                </p>
              )}
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}

// ─── Billing Tab ──────────────────────────────────────────────────────────────
function BillingTab({ tenantId: _tenantId }: { tenantId: string }) {
  const backend = useBackend();
  const [records, setRecords] = useState<BillingRecord[]>([]);
  const [loading, setLoading] = useState(true);

  const loadBilling = useCallback(async () => {
    if (!backend) return;
    setLoading(true);
    try {
      const r = await backend.listBillingHistory();
      setRecords(r);
    } catch {
      toast.error("Failed to load billing history");
    } finally {
      setLoading(false);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [backend]);

  useEffect(() => {
    loadBilling();
  }, [loadBilling]);

  function statusBadgeClass(status: BillingStatus | string) {
    if (status === "paid") return "bg-emerald-500/20 text-emerald-400 border-0";
    if (status === "pending")
      return "bg-yellow-500/20 text-yellow-400 border-0";
    if (status === "failed") return "bg-red-500/20 text-red-400 border-0";
    return "bg-muted text-muted-foreground border-0";
  }

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h3 className="text-sm font-medium text-muted-foreground">
          Billing History
        </h3>
        <Button
          variant="outline"
          size="sm"
          onClick={loadBilling}
          disabled={loading}
        >
          <RefreshCw
            size={13}
            className={loading ? "animate-spin mr-1" : "mr-1"}
          />
          Refresh
        </Button>
      </div>

      {loading ? (
        <div className="space-y-2" data-ocid="tenant.billing.loading_state">
          <Skeleton className="h-10 w-full" />
          <Skeleton className="h-10 w-full" />
          <Skeleton className="h-10 w-full" />
        </div>
      ) : records.length === 0 ? (
        <div
          className="text-center py-12 text-muted-foreground"
          data-ocid="tenant.billing.empty_state"
        >
          <Receipt size={32} className="mx-auto mb-3 opacity-30" />
          <p className="text-sm">No billing records yet.</p>
        </div>
      ) : (
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Date</TableHead>
              <TableHead>Description</TableHead>
              <TableHead>Amount</TableHead>
              <TableHead>Currency</TableHead>
              <TableHead>Status</TableHead>
              <TableHead>Method</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {records.map((r, idx) => (
              <TableRow
                key={String(r.id)}
                data-ocid={`tenant.billing.row.${idx + 1}`}
              >
                <TableCell className="text-xs text-muted-foreground">
                  {formatNsDate(r.paidAt)}
                </TableCell>
                <TableCell className="text-sm">{r.description}</TableCell>
                <TableCell className="font-medium text-sm">
                  ${(Number(r.amountCents) / 100).toFixed(2)}
                </TableCell>
                <TableCell className="text-xs uppercase">
                  {r.currency}
                </TableCell>
                <TableCell>
                  <Badge className={statusBadgeClass(r.status as string)}>
                    {String(r.status)}
                  </Badge>
                </TableCell>
                <TableCell className="text-xs capitalize">
                  {String(r.paymentMethod)}
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      )}
    </div>
  );
}

// ─── Settings Tab ─────────────────────────────────────────────────────────────
function SettingsTab({
  tenant,
  onRefresh,
}: {
  tenant: Tenant;
  onRefresh: () => void;
}) {
  const backend = useBackend();
  const [editOrgName, setEditOrgName] = useState(tenant.orgName);
  const [editEmail, setEditEmail] = useState(tenant.contactEmail);
  const [editDomain, setEditDomain] = useState(tenant.customDomain ?? "");
  const [editLoading, setEditLoading] = useState(false);
  const [upgradeLoading, setUpgradeLoading] = useState(false);
  const [cancelLoading, setCancelLoading] = useState(false);
  const [cancelOpen, setCancelOpen] = useState(false);
  const [newTier, setNewTier] = useState<TenantTier>(tenant.tier);

  async function handleEdit() {
    if (!backend) return;
    setEditLoading(true);
    try {
      await backend.updateTenant(
        editOrgName.trim(),
        editEmail.trim(),
        editDomain.trim() || null,
      );
      toast.success("Tenant updated");
      onRefresh();
    } catch {
      toast.error("Failed to update tenant");
    } finally {
      setEditLoading(false);
    }
  }

  async function handleUpgrade() {
    if (!backend) return;
    if (newTier === tenant.tier) {
      toast.info("Already on this plan");
      return;
    }
    setUpgradeLoading(true);
    try {
      await backend.upgradeTenant(newTier);
      toast.success(`Upgraded to ${newTier} plan!`);
      onRefresh();
    } catch {
      toast.error("Failed to upgrade plan");
    } finally {
      setUpgradeLoading(false);
    }
  }

  async function handleCancel() {
    if (!backend) return;
    setCancelLoading(true);
    try {
      await backend.cancelTenant();
      toast.success("Subscription cancelled");
      setCancelOpen(false);
      onRefresh();
    } catch {
      toast.error("Failed to cancel subscription");
    } finally {
      setCancelLoading(false);
    }
  }

  return (
    <div className="space-y-6">
      {/* Edit Details */}
      <Card data-ocid="tenant.edit.panel">
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-base">
            <Pencil size={16} className="text-primary" />
            Edit Details
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="space-y-1.5">
              <Label>Organisation Name</Label>
              <Input
                value={editOrgName}
                onChange={(e) => setEditOrgName(e.target.value)}
                data-ocid="tenant.edit.input"
              />
            </div>
            <div className="space-y-1.5">
              <Label>Contact Email</Label>
              <Input
                type="email"
                value={editEmail}
                onChange={(e) => setEditEmail(e.target.value)}
                data-ocid="tenant.edit.email.input"
              />
            </div>
            <div className="space-y-1.5 sm:col-span-2">
              <Label>
                Custom Domain{" "}
                <span className="text-muted-foreground text-xs font-normal">
                  (optional)
                </span>
              </Label>
              <Input
                placeholder="e.g. platform.yourorg.org"
                value={editDomain}
                onChange={(e) => setEditDomain(e.target.value)}
                data-ocid="tenant.edit.domain.input"
              />
            </div>
          </div>
          <Button
            onClick={handleEdit}
            disabled={editLoading}
            data-ocid="tenant.edit.save_button"
          >
            {editLoading ? (
              <Loader2 size={14} className="mr-2 animate-spin" />
            ) : (
              <Pencil size={14} className="mr-2" />
            )}
            {editLoading ? "Saving..." : "Save Changes"}
          </Button>
        </CardContent>
      </Card>

      {/* Upgrade Plan */}
      <Card data-ocid="tenant.upgrade.panel">
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-base">
            <TrendingUp size={16} className="text-primary" />
            Upgrade Plan
          </CardTitle>
          <CardDescription>Change your subscription tier.</CardDescription>
        </CardHeader>
        <CardContent className="flex flex-wrap items-end gap-4">
          <div className="space-y-1.5 flex-1 min-w-40">
            <Label>New Plan</Label>
            <Select
              value={newTier}
              onValueChange={(v) => setNewTier(v as TenantTier)}
            >
              <SelectTrigger data-ocid="tenant.upgrade.select">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value={TenantTier.starter}>
                  Starter — $49/mo
                </SelectItem>
                <SelectItem value={TenantTier.organization}>
                  Organisation — $299/mo
                </SelectItem>
                <SelectItem value={TenantTier.enterprise}>
                  Enterprise — $999/mo
                </SelectItem>
              </SelectContent>
            </Select>
          </div>
          <Button
            onClick={handleUpgrade}
            disabled={upgradeLoading || newTier === tenant.tier}
            data-ocid="tenant.upgrade.button"
          >
            {upgradeLoading ? (
              <Loader2 size={14} className="mr-2 animate-spin" />
            ) : (
              <TrendingUp size={14} className="mr-2" />
            )}
            {upgradeLoading ? "Upgrading..." : "Upgrade"}
          </Button>
        </CardContent>
      </Card>

      {/* Cancel */}
      <Card className="border-destructive/30" data-ocid="tenant.cancel.panel">
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-base text-destructive">
            <AlertTriangle size={16} />
            Cancel Subscription
          </CardTitle>
          <CardDescription>
            This will cancel your plan. Your data is preserved but access will
            be restricted.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Dialog open={cancelOpen} onOpenChange={setCancelOpen}>
            <DialogTrigger asChild>
              <Button
                variant="destructive"
                data-ocid="tenant.cancel.open_modal_button"
              >
                Cancel Subscription
              </Button>
            </DialogTrigger>
            <DialogContent data-ocid="tenant.cancel.dialog">
              <DialogHeader>
                <DialogTitle>Cancel your subscription?</DialogTitle>
                <DialogDescription>
                  Your tenant will be marked as cancelled. Existing data is
                  preserved but no new activity will be allowed. You can
                  reactivate by contacting support.
                </DialogDescription>
              </DialogHeader>
              <DialogFooter>
                <Button
                  variant="outline"
                  onClick={() => setCancelOpen(false)}
                  data-ocid="tenant.cancel.cancel_button"
                >
                  Keep Subscription
                </Button>
                <Button
                  variant="destructive"
                  onClick={handleCancel}
                  disabled={cancelLoading}
                  data-ocid="tenant.cancel.confirm_button"
                >
                  {cancelLoading ? (
                    <Loader2 size={14} className="mr-2 animate-spin" />
                  ) : null}
                  {cancelLoading ? "Cancelling..." : "Yes, Cancel"}
                </Button>
              </DialogFooter>
            </DialogContent>
          </Dialog>
        </CardContent>
      </Card>
    </div>
  );
}

// ─── Overview Tab ─────────────────────────────────────────────────────────────
function OverviewTab({
  tenant,
  subscription,
}: {
  tenant: Tenant;
  subscription: TenantSubscription | null;
}) {
  return (
    <div className="space-y-6">
      {/* Summary */}
      <Card data-ocid="tenant.summary.card">
        <CardHeader>
          <div className="flex items-start justify-between">
            <div>
              <CardTitle className="flex items-center gap-2">
                <Building2 size={18} className="text-primary" />
                {tenant.orgName}
              </CardTitle>
              <CardDescription className="mt-1">
                {tenant.contactEmail}
              </CardDescription>
            </div>
            <div className="flex gap-2">
              <TierBadge tier={tenant.tier} />
              <StatusBadge status={tenant.status} />
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
            <div className="flex flex-col gap-1">
              <span className="text-xs text-muted-foreground flex items-center gap-1">
                <Users size={11} /> Members
              </span>
              <span className="font-semibold">
                {tenant.memberLimit.toString()}
              </span>
            </div>
            <div className="flex flex-col gap-1">
              <span className="text-xs text-muted-foreground flex items-center gap-1">
                <HardDrive size={11} /> Storage
              </span>
              <span className="font-semibold">
                {tenant.storageLimit.toString()} GB
              </span>
            </div>
            <div className="flex flex-col gap-1">
              <span className="text-xs text-muted-foreground flex items-center gap-1">
                <Globe size={11} /> Domain
              </span>
              <span className="font-semibold text-sm">
                {tenant.customDomain ?? "—"}
              </span>
            </div>
            <div className="flex flex-col gap-1">
              <span className="text-xs text-muted-foreground flex items-center gap-1">
                <CalendarDays size={11} /> Created
              </span>
              <span className="font-semibold text-sm">
                {formatNsDate(tenant.createdAt)}
              </span>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Subscription */}
      {subscription && (
        <Card data-ocid="tenant.subscription.card">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-base">
              <CreditCard size={16} className="text-primary" />
              Subscription
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
              <div className="flex flex-col gap-1">
                <span className="text-xs text-muted-foreground">
                  Monthly Fee
                </span>
                <span className="font-semibold">
                  ${subscription.monthlyFee}{" "}
                  <span className="text-xs text-muted-foreground">
                    {subscription.currency}
                  </span>
                </span>
              </div>
              <div className="flex flex-col gap-1">
                <span className="text-xs text-muted-foreground">Payment</span>
                <span className="font-semibold capitalize">
                  {subscription.paymentMethod}
                </span>
              </div>
              <div className="flex flex-col gap-1">
                <span className="text-xs text-muted-foreground">Next Due</span>
                <span className="font-semibold text-sm">
                  {formatNsDate(subscription.nextDueAt)}
                </span>
              </div>
              <div className="flex flex-col gap-1">
                <span className="text-xs text-muted-foreground">Last Paid</span>
                <span className="font-semibold text-sm">
                  {subscription.lastPaidAt
                    ? formatNsDate(subscription.lastPaidAt)
                    : "—"}
                </span>
              </div>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
}

// ─── Main Portal ──────────────────────────────────────────────────────────────
function TenantDashboard({
  tenant,
  subscription,
  onRefresh,
}: {
  tenant: Tenant;
  subscription: TenantSubscription | null;
  onRefresh: () => void;
}) {
  const isSuspended = tenant.status === TenantStatus.suspended;
  const isCancelled = tenant.status === TenantStatus.cancelled;

  return (
    <div className="space-y-6">
      {/* Access Gate Banners */}
      {isSuspended && (
        <div className="flex items-center gap-3 p-4 rounded-lg bg-red-500/10 border border-red-500/20 text-red-400">
          <Ban size={18} />
          <div className="flex-1">
            <p className="font-medium text-sm">Your account is suspended</p>
            <p className="text-xs opacity-80">
              Platform access has been restricted. Please contact support or
              choose a plan to reactivate.
            </p>
          </div>
          <a href="/pricing" className="text-xs underline whitespace-nowrap">
            View Plans
          </a>
        </div>
      )}
      {isCancelled && (
        <div className="flex items-center gap-3 p-4 rounded-lg bg-amber-500/10 border border-amber-500/20 text-amber-400">
          <AlertTriangle size={18} />
          <div className="flex-1">
            <p className="font-medium text-sm">
              Your subscription is cancelled
            </p>
            <p className="text-xs opacity-80">
              Your data is preserved. Choose a plan to restore full access.
            </p>
          </div>
          <a href="/pricing" className="text-xs underline whitespace-nowrap">
            Choose a Plan
          </a>
        </div>
      )}

      <Tabs defaultValue="overview" data-ocid="tenant.tabs">
        <TabsList className="grid w-full grid-cols-6 mb-6">
          <TabsTrigger value="overview" data-ocid="tenant.overview.tab">
            Overview
          </TabsTrigger>
          <TabsTrigger value="usage" data-ocid="tenant.usage.tab">
            Usage
          </TabsTrigger>
          <TabsTrigger value="members" data-ocid="tenant.members.tab">
            Members
          </TabsTrigger>
          <TabsTrigger value="branding" data-ocid="tenant.branding.tab">
            Branding
          </TabsTrigger>
          <TabsTrigger value="billing" data-ocid="tenant.billing.tab">
            Billing
          </TabsTrigger>
          <TabsTrigger value="settings" data-ocid="tenant.settings.tab">
            Settings
          </TabsTrigger>
        </TabsList>

        <TabsContent value="overview">
          <OverviewTab tenant={tenant} subscription={subscription} />
        </TabsContent>

        <TabsContent value="usage">
          <UsageTab tenantId={tenant.id} />
        </TabsContent>

        <TabsContent value="members">
          <MembersTab tenantId={tenant.id} />
        </TabsContent>

        <TabsContent value="branding">
          <BrandingTab tenantId={tenant.id} />
        </TabsContent>

        <TabsContent value="billing">
          <BillingTab tenantId={tenant.id} />
        </TabsContent>

        <TabsContent value="settings">
          <SettingsTab tenant={tenant} onRefresh={onRefresh} />
        </TabsContent>
      </Tabs>
    </div>
  );
}

export function TenantAdminPage() {
  const backend = useBackend();
  const [tenant, setTenant] = useState<Tenant | null>(null);
  const [subscription, setSubscription] = useState<TenantSubscription | null>(
    null,
  );
  const [loading, setLoading] = useState(true);

  const load = useCallback(async () => {
    if (!backend) return;
    setLoading(true);
    try {
      const [t, s] = await Promise.all([
        backend.getMyTenant(),
        backend.getMySubscription(),
      ]);
      setTenant(t);
      setSubscription(s);
    } catch {
      toast.error("Failed to load tenant data");
    } finally {
      setLoading(false);
    }
  }, [backend]);

  useEffect(() => {
    load();
  }, [load]);

  return (
    <Layout>
      <main className="max-w-4xl mx-auto px-4 py-10">
        <div className="mb-8">
          <h1 className="text-2xl font-bold text-foreground flex items-center gap-2">
            <Building2 size={22} className="text-primary" />
            Tenant Administration
          </h1>
          <p className="text-muted-foreground text-sm mt-1">
            Manage your organisation's private platform space.
          </p>
        </div>

        {loading ? (
          <div className="space-y-4" data-ocid="tenant.loading_state">
            <Skeleton className="h-36 w-full rounded-xl" />
            <Skeleton className="h-28 w-full rounded-xl" />
            <Skeleton className="h-32 w-full rounded-xl" />
          </div>
        ) : tenant ? (
          <TenantDashboard
            tenant={tenant}
            subscription={subscription}
            onRefresh={load}
          />
        ) : (
          <OnboardingCard onCreated={load} />
        )}
      </main>
    </Layout>
  );
}
