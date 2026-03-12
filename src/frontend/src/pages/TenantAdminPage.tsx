import type { Tenant, TenantSubscription } from "@/backend.d";
import { PaymentMethod, TenantStatus, TenantTier } from "@/backend.d";
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
import { useBackend } from "@/hooks/useBackend";
import {
  AlertTriangle,
  Building2,
  CalendarDays,
  CreditCard,
  Globe,
  HardDrive,
  Loader2,
  Mail,
  Pencil,
  Rocket,
  TrendingUp,
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
            Create your organization's private space on the IIIntl One Platform.
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
                  Organization — $299/mo · 500 members
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

function TenantDashboard({
  tenant,
  subscription,
  onRefresh,
}: {
  tenant: Tenant;
  subscription: TenantSubscription | null;
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

      {/* Edit */}
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

      {/* Upgrade */}
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
                  Organization — $299/mo
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
      <main className="max-w-3xl mx-auto px-4 py-10">
        <div className="mb-8">
          <h1 className="text-2xl font-bold text-foreground flex items-center gap-2">
            <Building2 size={22} className="text-primary" />
            Tenant Administration
          </h1>
          <p className="text-muted-foreground text-sm mt-1">
            Manage your organization's private platform space.
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
