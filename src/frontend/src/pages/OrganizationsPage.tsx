import type { Organization } from "@/backend";
import { Layout } from "@/components/Layout";
import { RoleGate } from "@/components/RoleGate";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
} from "@/components/ui/card";
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
import {
  type OrgRegion,
  type OrgType,
  getOrgColorClasses,
} from "@/data/mockData";
import { useActor } from "@/hooks/useActor";
import { cn } from "@/lib/utils";
import { Link } from "@tanstack/react-router";
import {
  ArrowRight,
  Building2,
  Calendar,
  ExternalLink,
  Globe,
  Megaphone,
  Plus,
  Search,
  Users,
} from "lucide-react";
import type { Variants } from "motion/react";
import { motion } from "motion/react";
import { useCallback, useEffect, useState } from "react";
import { toast } from "sonner";

const containerVariants: Variants = {
  hidden: { opacity: 0 },
  visible: { opacity: 1, transition: { staggerChildren: 0.06 } },
};

const cardVariants: Variants = {
  hidden: { opacity: 0, y: 20 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.3 } },
};

type FilterTab = "all" | "active" | "mine" | "archived";

const ORG_TYPES: OrgType[] = [
  "Global Secretariat",
  "Regional Chapter",
  "National Chapter",
  "Advocacy Group",
  "Youth Network",
  "Research Institute",
  "Coalition",
  "Task Force",
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

function CreateOrgDialog({
  open,
  onOpenChange,
  onCreated,
}: {
  open: boolean;
  onOpenChange: (v: boolean) => void;
  onCreated: () => void;
}) {
  const { actor } = useActor();
  const [name, setName] = useState("");
  const [region, setRegion] = useState<string>("");
  const [type, setType] = useState<string>("");
  const [description, setDescription] = useState("");
  const [website, setWebsite] = useState("");
  const [foundedYear, setFoundedYear] = useState<string>("");
  const [saving, setSaving] = useState(false);

  async function handleSubmit() {
    if (!name.trim()) return;
    setSaving(true);
    try {
      if (!actor) throw new Error("Not connected");
      await actor.createOrg(
        name.trim(),
        description.trim(),
        region || "Global",
        type || "Coalition",
        website.trim(),
        BigInt(foundedYear ? Number(foundedYear) : new Date().getFullYear()),
      );
      toast.success("Organization created successfully");
      onOpenChange(false);
      setName("");
      setRegion("");
      setType("");
      setDescription("");
      setWebsite("");
      setFoundedYear("");
      onCreated();
    } catch (err) {
      console.error(err);
      toast.error("Failed to create organization. Please try again.");
    } finally {
      setSaving(false);
    }
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-lg" data-ocid="orgs.create_modal">
        <DialogHeader>
          <DialogTitle className="font-display text-xl">
            Create Organization
          </DialogTitle>
          <DialogDescription>
            Add a new independent organization to the IIIntl One Platform global
            network.
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-4 py-2">
          <div className="space-y-1.5">
            <Label htmlFor="org-name" className="text-sm font-medium">
              Organization Name <span className="text-destructive">*</span>
            </Label>
            <Input
              id="org-name"
              placeholder="e.g. Pacific Islands Civic Coalition"
              value={name}
              onChange={(e) => setName(e.target.value)}
              data-ocid="orgs.create_name_input"
            />
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div className="space-y-1.5">
              <Label className="text-sm font-medium">Region</Label>
              <Select value={region} onValueChange={setRegion}>
                <SelectTrigger data-ocid="orgs.create_region_select">
                  <SelectValue placeholder="Select region" />
                </SelectTrigger>
                <SelectContent>
                  {ORG_REGIONS.map((r) => (
                    <SelectItem key={r} value={r}>
                      {r}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-1.5">
              <Label className="text-sm font-medium">Type</Label>
              <Select value={type} onValueChange={setType}>
                <SelectTrigger data-ocid="orgs.create_type_select">
                  <SelectValue placeholder="Select type" />
                </SelectTrigger>
                <SelectContent>
                  {ORG_TYPES.map((t) => (
                    <SelectItem key={t} value={t}>
                      {t}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>

          <div className="space-y-1.5">
            <Label htmlFor="org-desc" className="text-sm font-medium">
              Description
            </Label>
            <Textarea
              id="org-desc"
              placeholder="Describe this organization's mission and scope..."
              rows={3}
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              data-ocid="orgs.create_desc_textarea"
            />
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div className="space-y-1.5">
              <Label htmlFor="org-website" className="text-sm font-medium">
                Website (optional)
              </Label>
              <Input
                id="org-website"
                placeholder="https://example.org"
                value={website}
                onChange={(e) => setWebsite(e.target.value)}
                data-ocid="orgs.create_website_input"
              />
            </div>
            <div className="space-y-1.5">
              <Label htmlFor="org-year" className="text-sm font-medium">
                Founded Year
              </Label>
              <Input
                id="org-year"
                placeholder={String(new Date().getFullYear())}
                type="number"
                value={foundedYear}
                onChange={(e) => setFoundedYear(e.target.value)}
                data-ocid="orgs.create_year_input"
              />
            </div>
          </div>
        </div>

        <DialogFooter className="gap-2">
          <Button
            variant="outline"
            onClick={() => onOpenChange(false)}
            data-ocid="orgs.create_cancel_button"
          >
            Cancel
          </Button>
          <Button
            onClick={handleSubmit}
            disabled={!name.trim() || saving}
            data-ocid="orgs.create_submit_button"
          >
            {saving ? "Creating..." : "Create Organization"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}

function OrgCard({
  org,
  index,
  isMember,
  onJoin,
  onLeave,
}: {
  org: Organization;
  index: number;
  isMember: boolean;
  onJoin: (id: string) => Promise<void>;
  onLeave: (id: string) => Promise<void>;
}) {
  const { user } = useAuth();
  const [acting, setActing] = useState(false);

  // Use a deterministic color based on org id for display
  const colorKey = org.id.charCodeAt(org.id.length - 1) % 6;
  const colorPalette = ["blue", "green", "purple", "orange", "red", "teal"];
  const colors = getOrgColorClasses(colorPalette[colorKey]);

  const canManage =
    user?.role === "super_admin" ||
    user?.role === "admin" ||
    (user?.role === "org_admin" && isMember);

  async function handleJoin() {
    setActing(true);
    try {
      await onJoin(org.id);
    } finally {
      setActing(false);
    }
  }

  async function handleLeave() {
    setActing(true);
    try {
      await onLeave(org.id);
    } finally {
      setActing(false);
    }
  }

  return (
    <motion.div variants={cardVariants} data-ocid={`orgs.item.${index}`}>
      <Card className="h-full flex flex-col border-border hover:shadow-md transition-all duration-200 group overflow-hidden">
        <div className={cn("h-1 w-full", colors.bg)} />

        <CardHeader className="pb-2 pt-4 px-4">
          <div className="flex items-start gap-3">
            <div
              className={cn(
                "w-10 h-10 rounded-xl flex items-center justify-center flex-shrink-0 font-display font-bold text-sm text-white",
                colors.bg,
              )}
            >
              {org.name
                .split(" ")
                .slice(0, 2)
                .map((w) => w[0])
                .join("")
                .toUpperCase()}
            </div>
            <div className="flex-1 min-w-0">
              <h3 className="font-display font-semibold text-foreground text-sm leading-snug truncate group-hover:text-primary transition-colors">
                {org.name}
              </h3>
              <div className="flex flex-wrap gap-1 mt-1">
                <Badge
                  variant="outline"
                  className={cn(
                    "text-[10px] px-1.5 py-0 h-4 font-medium",
                    colors.text,
                    colors.border,
                    colors.lightBg,
                  )}
                >
                  {org.orgType}
                </Badge>
                <Badge
                  variant="secondary"
                  className="text-[10px] px-1.5 py-0 h-4"
                >
                  <Globe size={9} className="mr-0.5" />
                  {org.region}
                </Badge>
                {org.status !== "active" && (
                  <Badge
                    variant="outline"
                    className="text-[10px] px-1.5 py-0 h-4 text-muted-foreground"
                  >
                    {org.status}
                  </Badge>
                )}
              </div>
            </div>
          </div>
        </CardHeader>

        <CardContent className="px-4 pb-3 flex-1">
          <p className="text-xs text-muted-foreground leading-relaxed line-clamp-3">
            {org.description}
          </p>

          <div className="flex items-center gap-4 mt-3 pt-3 border-t border-border/60">
            <div className="flex items-center gap-1 text-[11px] text-muted-foreground">
              <Users size={11} />
              <span className="font-semibold text-foreground">
                {org.members.length.toLocaleString()}
              </span>
              <span>members</span>
            </div>
            <div className="flex items-center gap-1 text-[11px] text-muted-foreground ml-auto">
              <Calendar size={11} />
              <span>Est. {Number(org.foundedYear)}</span>
            </div>
          </div>
        </CardContent>

        <CardFooter className="px-4 pb-4 pt-0 flex items-center gap-2">
          <Button
            asChild
            variant="default"
            size="sm"
            className="flex-1 h-8 text-xs gap-1.5"
            data-ocid={`orgs.view_button.${index}`}
          >
            <Link to="/organizations/$id" params={{ id: org.id }}>
              View Details <ArrowRight size={11} />
            </Link>
          </Button>

          {canManage ? (
            <Button
              variant="outline"
              size="sm"
              className="h-8 text-xs"
              data-ocid={`orgs.manage_button.${index}`}
            >
              Manage
            </Button>
          ) : isMember ? (
            <Button
              variant="outline"
              size="sm"
              className="h-8 text-xs text-muted-foreground"
              disabled={acting}
              onClick={handleLeave}
              data-ocid={`orgs.leave_button.${index}`}
            >
              {acting ? "Leaving..." : "Leave"}
            </Button>
          ) : (
            <Button
              variant="outline"
              size="sm"
              className="h-8 text-xs text-primary hover:bg-primary/5"
              disabled={acting}
              onClick={handleJoin}
              data-ocid={`orgs.join_button.${index}`}
            >
              {acting ? "Joining..." : "Join"}
            </Button>
          )}

          {org.website && (
            <Button
              variant="ghost"
              size="sm"
              className="h-8 w-8 p-0 flex-shrink-0"
              asChild
            >
              <a href={org.website} target="_blank" rel="noopener noreferrer">
                <ExternalLink size={13} className="text-muted-foreground" />
              </a>
            </Button>
          )}
        </CardFooter>
      </Card>
    </motion.div>
  );
}

function OrgCardSkeleton() {
  return (
    <Card className="h-full flex flex-col border-border overflow-hidden">
      <div className="h-1 w-full bg-muted" />
      <CardHeader className="pb-2 pt-4 px-4">
        <div className="flex items-start gap-3">
          <Skeleton className="w-10 h-10 rounded-xl" />
          <div className="flex-1 space-y-2">
            <Skeleton className="h-4 w-3/4" />
            <Skeleton className="h-3 w-1/2" />
          </div>
        </div>
      </CardHeader>
      <CardContent className="px-4 pb-3 flex-1 space-y-2">
        <Skeleton className="h-3 w-full" />
        <Skeleton className="h-3 w-5/6" />
        <Skeleton className="h-3 w-2/3" />
      </CardContent>
      <CardFooter className="px-4 pb-4 pt-0">
        <Skeleton className="h-8 w-full" />
      </CardFooter>
    </Card>
  );
}

export function OrganizationsPage() {
  const { user } = useAuth();
  const { t } = useI18n();
  const { actor } = useActor();
  const [search, setSearch] = useState("");
  const [activeTab, setActiveTab] = useState<FilterTab>("all");
  const [createOpen, setCreateOpen] = useState(false);
  const [orgs, setOrgs] = useState<Organization[]>([]);
  const [myOrgIds, setMyOrgIds] = useState<Set<string>>(new Set());
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const canCreate =
    user?.role === "super_admin" ||
    user?.role === "admin" ||
    user?.role === "org_admin";

  const fetchOrgs = useCallback(async () => {
    if (!actor) return;
    setLoading(true);
    setError(null);
    try {
      const [allOrgs, userOrgs] = await Promise.all([
        actor.listOrgs(),
        user
          ? actor.getUserOrgs(user.id)
          : Promise.resolve([] as Organization[]),
      ]);
      setOrgs(allOrgs);
      setMyOrgIds(new Set(userOrgs.map((o) => o.id)));
    } catch (err) {
      console.error(err);
      setError("Failed to load organizations. Please refresh.");
    } finally {
      setLoading(false);
    }
  }, [user, actor]);

  useEffect(() => {
    fetchOrgs();
  }, [fetchOrgs]);

  async function handleJoin(orgId: string) {
    try {
      if (!actor) return;
      await actor.joinOrg(orgId);
      toast.success("Successfully joined the organization");
      await fetchOrgs();
    } catch (err) {
      console.error(err);
      toast.error("Failed to join organization.");
    }
  }

  async function handleLeave(orgId: string) {
    try {
      if (!actor) return;
      await actor.leaveOrg(orgId);
      toast.success("Left the organization");
      await fetchOrgs();
    } catch (err) {
      console.error(err);
      toast.error("Failed to leave organization.");
    }
  }

  const filtered = orgs.filter((org) => {
    const matchesSearch =
      !search ||
      org.name.toLowerCase().includes(search.toLowerCase()) ||
      org.region.toLowerCase().includes(search.toLowerCase()) ||
      org.orgType.toLowerCase().includes(search.toLowerCase());

    const matchesTab =
      activeTab === "all" ||
      (activeTab === "active" && org.status === "active") ||
      (activeTab === "mine" && myOrgIds.has(org.id)) ||
      (activeTab === "archived" && org.status === "archived");

    return matchesSearch && matchesTab;
  });

  const activeCount = orgs.filter((o) => o.status === "active").length;

  return (
    <Layout breadcrumb={t.orgs.title}>
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
              <Building2 size={22} className="opacity-80" />
              {t.orgs.title}
            </h1>
            <p className="text-muted-foreground text-sm mt-1">
              {loading
                ? "Loading organizations..."
                : `${orgs.length} independent organizations across the global IIIntl One network`}
            </p>
            <div className="mt-3 civic-rule w-12" />
          </div>

          <RoleGate roles={["super_admin", "admin", "org_admin"]}>
            <Button
              size="sm"
              className="gap-2 h-9 self-start sm:self-auto flex-shrink-0"
              onClick={() => setCreateOpen(true)}
              data-ocid="orgs.create_button"
            >
              <Plus size={14} />
              {t.orgs.createOrg}
            </Button>
          </RoleGate>
        </motion.div>

        {/* ── Search + Filter Bar ── */}
        <motion.div
          initial={{ opacity: 0, y: 8 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3, delay: 0.05 }}
          className="flex flex-col sm:flex-row gap-3 mb-5"
        >
          <div className="relative flex-1 max-w-sm">
            <Search
              size={14}
              className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground"
            />
            <Input
              placeholder={t.orgs.searchPlaceholder}
              className="pl-8 h-9 text-sm"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              data-ocid="orgs.search_input"
            />
          </div>

          <Tabs
            value={activeTab}
            onValueChange={(v) => setActiveTab(v as FilterTab)}
          >
            <TabsList className="h-9" data-ocid="orgs.filter_tabs">
              <TabsTrigger
                value="all"
                className="text-xs px-3"
                data-ocid="orgs.filter.tab"
              >
                All
                {!loading && (
                  <span className="ml-1.5 text-[10px] bg-secondary text-secondary-foreground rounded-full px-1.5 py-0">
                    {orgs.length}
                  </span>
                )}
              </TabsTrigger>
              <TabsTrigger
                value="active"
                className="text-xs px-3"
                data-ocid="orgs.filter.tab"
              >
                Active
                {!loading && (
                  <span className="ml-1.5 text-[10px] bg-secondary text-secondary-foreground rounded-full px-1.5 py-0">
                    {activeCount}
                  </span>
                )}
              </TabsTrigger>
              <TabsTrigger
                value="mine"
                className="text-xs px-3"
                data-ocid="orgs.filter.tab"
              >
                Mine
                {!loading && (
                  <span className="ml-1.5 text-[10px] bg-secondary text-secondary-foreground rounded-full px-1.5 py-0">
                    {myOrgIds.size}
                  </span>
                )}
              </TabsTrigger>
              <TabsTrigger
                value="archived"
                className="text-xs px-3"
                data-ocid="orgs.filter.tab"
              >
                Archived
              </TabsTrigger>
            </TabsList>
          </Tabs>
        </motion.div>

        {/* ── Results count ── */}
        {search && !loading && (
          <p className="text-xs text-muted-foreground mb-4">
            Showing {filtered.length} of {orgs.length} organizations
          </p>
        )}

        {/* ── Error state ── */}
        {error && (
          <div
            className="flex flex-col items-center justify-center py-16 text-center"
            data-ocid="orgs.error_state"
          >
            <p className="text-sm text-destructive mb-3">{error}</p>
            <Button size="sm" variant="outline" onClick={fetchOrgs}>
              Retry
            </Button>
          </div>
        )}

        {/* ── Loading state ── */}
        {loading && (
          <div
            className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4"
            data-ocid="orgs.loading_state"
          >
            {Array.from({ length: 6 }).map((_, i) => (
              // biome-ignore lint/suspicious/noArrayIndexKey: skeleton list
              <OrgCardSkeleton key={i} />
            ))}
          </div>
        )}

        {/* ── Organization Cards Grid ── */}
        {!loading &&
          !error &&
          (filtered.length === 0 ? (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="flex flex-col items-center justify-center py-24 text-center"
              data-ocid="orgs.empty_state"
            >
              <div className="w-16 h-16 rounded-2xl bg-secondary flex items-center justify-center mb-4">
                <Building2 size={24} className="text-muted-foreground/50" />
              </div>
              <h3 className="font-display font-semibold text-foreground mb-1">
                No organizations found
              </h3>
              <p className="text-sm text-muted-foreground max-w-xs">
                {search
                  ? `No organizations match "${search}". Try a different search term.`
                  : activeTab === "archived"
                    ? "There are no archived organizations."
                    : activeTab === "mine"
                      ? "You haven't joined any organizations yet."
                      : "No organizations available."}
              </p>
              {canCreate && (
                <Button
                  size="sm"
                  className="mt-4 gap-2"
                  onClick={() => setCreateOpen(true)}
                >
                  <Plus size={13} />
                  Create First Organization
                </Button>
              )}
            </motion.div>
          ) : (
            <motion.div
              variants={containerVariants}
              initial="hidden"
              animate="visible"
              className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4"
            >
              {filtered.map((org, i) => (
                <OrgCard
                  key={org.id}
                  org={org}
                  index={i + 1}
                  isMember={myOrgIds.has(org.id)}
                  onJoin={handleJoin}
                  onLeave={handleLeave}
                />
              ))}
            </motion.div>
          ))}
      </div>

      {/* Create Organization Modal */}
      <RoleGate roles={["super_admin", "admin", "org_admin"]}>
        <CreateOrgDialog
          open={createOpen}
          onOpenChange={setCreateOpen}
          onCreated={fetchOrgs}
        />
      </RoleGate>
    </Layout>
  );
}
