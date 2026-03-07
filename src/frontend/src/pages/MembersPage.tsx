import { Layout } from "@/components/Layout";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Separator } from "@/components/ui/separator";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
} from "@/components/ui/sheet";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import type { UserRole } from "@/context/AuthContext";
import {
  MOCK_MEMBERS,
  type MockMember,
  type OrgRegion,
  getInitials,
  getRoleBadgeClasses,
  getStatusBadgeClasses,
} from "@/data/mockData";
import { cn } from "@/lib/utils";
import {
  Activity,
  Building2,
  CalendarDays,
  Filter,
  Globe,
  LayoutGrid,
  List,
  Megaphone,
  MessageSquare,
  Search,
  User,
  X,
} from "lucide-react";
import type { Variants } from "motion/react";
import { AnimatePresence, motion } from "motion/react";
import { useState } from "react";

// ─── Variants ─────────────────────────────────────────────────────────────────

const gridContainerVariants: Variants = {
  hidden: { opacity: 0 },
  visible: { opacity: 1, transition: { staggerChildren: 0.04 } },
};

const gridItemVariants: Variants = {
  hidden: { opacity: 0, y: 16 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.25 } },
};

// ─── Constants ────────────────────────────────────────────────────────────────

const ROLES: { value: string; label: string }[] = [
  { value: "all", label: "All Roles" },
  { value: "super_admin", label: "Super Admin" },
  { value: "admin", label: "Admin" },
  { value: "org_admin", label: "Org Admin" },
  { value: "member", label: "Member" },
  { value: "activist", label: "Activist" },
  { value: "guest", label: "Guest" },
];

const REGIONS: { value: string; label: string }[] = [
  { value: "all", label: "All Regions" },
  { value: "Global", label: "Global" },
  { value: "Americas", label: "Americas" },
  { value: "Europe", label: "Europe" },
  { value: "Africa", label: "Africa" },
  { value: "Asia-Pacific", label: "Asia-Pacific" },
  { value: "Middle East", label: "Middle East" },
  { value: "Caribbean", label: "Caribbean" },
  { value: "South Asia", label: "South Asia" },
];

const STATUSES = [
  { value: "all", label: "All Statuses" },
  { value: "active", label: "Active" },
  { value: "inactive", label: "Inactive" },
  { value: "pending", label: "Pending" },
];

const PAGE_SIZE = 9;

// ─── Member Profile Sheet ─────────────────────────────────────────────────────

function MemberProfileSheet({
  member,
  onClose,
}: {
  member: MockMember | null;
  onClose: () => void;
}) {
  return (
    <Sheet open={!!member} onOpenChange={(open) => !open && onClose()}>
      <SheetContent
        side="right"
        className="w-full sm:max-w-md overflow-y-auto"
        data-ocid="members.profile_sheet"
      >
        {member && (
          <>
            <SheetHeader className="pb-4">
              <div className="flex items-start gap-4">
                <Avatar className="h-14 w-14 ring-2 ring-border flex-shrink-0">
                  <AvatarFallback
                    className={cn(
                      "text-base font-bold",
                      getRoleBadgeClasses(member.role),
                    )}
                  >
                    {getInitials(member.name)}
                  </AvatarFallback>
                </Avatar>
                <div className="flex-1 min-w-0 pt-1">
                  <SheetTitle className="font-display text-lg leading-tight">
                    {member.name}
                  </SheetTitle>
                  {member.title && (
                    <p className="text-sm text-muted-foreground mt-0.5">
                      {member.title}
                    </p>
                  )}
                  <div className="flex flex-wrap gap-1.5 mt-2">
                    <Badge
                      variant="outline"
                      className={cn(
                        "text-[11px] px-2 py-0.5 capitalize font-medium",
                        getRoleBadgeClasses(member.role),
                      )}
                    >
                      {member.role.replace("_", " ")}
                    </Badge>
                    <Badge
                      variant="outline"
                      className={cn(
                        "text-[11px] px-2 py-0.5 capitalize",
                        getStatusBadgeClasses(member.status),
                      )}
                    >
                      {member.status}
                    </Badge>
                  </div>
                </div>
              </div>
            </SheetHeader>

            {/* Bio */}
            <div className="space-y-4">
              <div>
                <h4 className="text-xs font-semibold uppercase tracking-widest text-muted-foreground mb-2">
                  About
                </h4>
                <p className="text-sm text-foreground leading-relaxed">
                  {member.bio}
                </p>
              </div>

              <Separator />

              {/* Details */}
              <div>
                <h4 className="text-xs font-semibold uppercase tracking-widest text-muted-foreground mb-3">
                  Details
                </h4>
                <div className="space-y-2.5">
                  <div className="flex items-center gap-3">
                    <Building2
                      size={14}
                      className="text-muted-foreground flex-shrink-0"
                    />
                    <div>
                      <p className="text-xs text-muted-foreground">
                        Organization
                      </p>
                      <p className="text-sm font-medium">
                        {member.organization}
                      </p>
                    </div>
                  </div>
                  <div className="flex items-center gap-3">
                    <Globe
                      size={14}
                      className="text-muted-foreground flex-shrink-0"
                    />
                    <div>
                      <p className="text-xs text-muted-foreground">Region</p>
                      <p className="text-sm font-medium">{member.region}</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-3">
                    <CalendarDays
                      size={14}
                      className="text-muted-foreground flex-shrink-0"
                    />
                    <div>
                      <p className="text-xs text-muted-foreground">
                        Member since
                      </p>
                      <p className="text-sm font-medium">
                        {new Date(member.joinedDate).toLocaleDateString(
                          "en-US",
                          {
                            month: "long",
                            day: "numeric",
                            year: "numeric",
                          },
                        )}
                      </p>
                    </div>
                  </div>
                </div>
              </div>

              <Separator />

              {/* Activity stats */}
              <div>
                <h4 className="text-xs font-semibold uppercase tracking-widest text-muted-foreground mb-3">
                  Activity
                </h4>
                <div className="grid grid-cols-3 gap-3">
                  <div className="bg-secondary/50 rounded-xl p-3 text-center">
                    <div className="flex justify-center mb-1">
                      <Megaphone size={14} className="text-green-600" />
                    </div>
                    <p className="text-xl font-display font-bold text-foreground">
                      {member.campaignCount}
                    </p>
                    <p className="text-[10px] text-muted-foreground">
                      Campaigns
                    </p>
                  </div>
                  <div className="bg-secondary/50 rounded-xl p-3 text-center">
                    <div className="flex justify-center mb-1">
                      <MessageSquare size={14} className="text-purple-600" />
                    </div>
                    <p className="text-xl font-display font-bold text-foreground">
                      {member.postCount}
                    </p>
                    <p className="text-[10px] text-muted-foreground">Posts</p>
                  </div>
                  <div className="bg-secondary/50 rounded-xl p-3 text-center">
                    <div className="flex justify-center mb-1">
                      <Activity size={14} className="text-blue-600" />
                    </div>
                    <p className="text-xl font-display font-bold text-foreground">
                      {member.campaignCount + member.postCount}
                    </p>
                    <p className="text-[10px] text-muted-foreground">Total</p>
                  </div>
                </div>
              </div>

              <Separator />

              {/* Actions */}
              <div className="flex gap-2">
                <Button
                  size="sm"
                  className="flex-1 h-9 text-sm gap-2"
                  data-ocid="members.profile_message_button"
                >
                  <MessageSquare size={13} />
                  Message
                </Button>
                <Button
                  size="sm"
                  variant="outline"
                  className="flex-1 h-9 text-sm gap-2"
                  data-ocid="members.profile_view_button"
                >
                  <User size={13} />
                  Full Profile
                </Button>
              </div>
            </div>
          </>
        )}
      </SheetContent>
    </Sheet>
  );
}

// ─── Member Grid Card ─────────────────────────────────────────────────────────

function MemberGridCard({
  member,
  index,
  onClick,
}: {
  member: MockMember;
  index: number;
  onClick: () => void;
}) {
  return (
    <motion.div variants={gridItemVariants} data-ocid={`members.item.${index}`}>
      <Card
        className="h-full flex flex-col hover:shadow-md transition-all duration-200 cursor-pointer group border-border"
        onClick={onClick}
      >
        <CardContent className="p-4 flex flex-col items-center text-center flex-1">
          <Avatar className="h-14 w-14 mb-3 ring-2 ring-border group-hover:ring-primary transition-all">
            <AvatarFallback
              className={cn(
                "text-sm font-bold",
                getRoleBadgeClasses(member.role),
              )}
            >
              {getInitials(member.name)}
            </AvatarFallback>
          </Avatar>

          <h3 className="font-display font-semibold text-sm text-foreground group-hover:text-primary transition-colors leading-tight">
            {member.name}
          </h3>

          {member.title && (
            <p className="text-[11px] text-muted-foreground mt-0.5 line-clamp-1">
              {member.title}
            </p>
          )}

          <div className="flex flex-wrap justify-center gap-1 mt-2">
            <Badge
              variant="outline"
              className={cn(
                "text-[10px] px-1.5 py-0 h-4 capitalize font-medium",
                getRoleBadgeClasses(member.role),
              )}
            >
              {member.role.replace("_", " ")}
            </Badge>
          </div>

          <div className="mt-3 pt-3 border-t border-border/60 w-full space-y-1">
            <div className="flex items-center justify-center gap-1 text-[11px] text-muted-foreground">
              <Building2 size={10} />
              <span className="truncate max-w-[140px]">
                {member.organization}
              </span>
            </div>
            <div className="flex items-center justify-center gap-1 text-[11px] text-muted-foreground">
              <Globe size={10} />
              <span>{member.region}</span>
            </div>
            <div className="flex items-center justify-center gap-1 text-[11px] text-muted-foreground">
              <CalendarDays size={10} />
              <span>
                Joined{" "}
                {new Date(member.joinedDate).toLocaleDateString("en-US", {
                  month: "short",
                  year: "numeric",
                })}
              </span>
            </div>
          </div>

          <Button
            size="sm"
            variant="outline"
            className="mt-3 h-7 text-xs w-full"
            data-ocid={`members.view_button.${index}`}
          >
            View Profile
          </Button>
        </CardContent>
      </Card>
    </motion.div>
  );
}

// ─── Main Page ────────────────────────────────────────────────────────────────

export function MembersPage() {
  const [search, setSearch] = useState("");
  const [roleFilter, setRoleFilter] = useState("all");
  const [regionFilter, setRegionFilter] = useState("all");
  const [statusFilter, setStatusFilter] = useState("all");
  const [viewMode, setViewMode] = useState<"grid" | "table">("grid");
  const [showFilters, setShowFilters] = useState(false);
  const [selectedMember, setSelectedMember] = useState<MockMember | null>(null);
  const [page, setPage] = useState(1);

  // Filter logic
  const filtered = MOCK_MEMBERS.filter((m) => {
    const matchesSearch =
      !search ||
      m.name.toLowerCase().includes(search.toLowerCase()) ||
      m.email.toLowerCase().includes(search.toLowerCase()) ||
      m.organization.toLowerCase().includes(search.toLowerCase()) ||
      (m.title ?? "").toLowerCase().includes(search.toLowerCase());

    const matchesRole = roleFilter === "all" || m.role === roleFilter;
    const matchesRegion =
      regionFilter === "all" || m.region === (regionFilter as OrgRegion);
    const matchesStatus = statusFilter === "all" || m.status === statusFilter;

    return matchesSearch && matchesRole && matchesRegion && matchesStatus;
  });

  const _totalPages = Math.ceil(filtered.length / PAGE_SIZE);
  const paginated = filtered.slice(0, page * PAGE_SIZE);
  const hasMore = paginated.length < filtered.length;

  const hasActiveFilters =
    roleFilter !== "all" || regionFilter !== "all" || statusFilter !== "all";

  function clearFilters() {
    setRoleFilter("all");
    setRegionFilter("all");
    setStatusFilter("all");
    setSearch("");
    setPage(1);
  }

  return (
    <Layout breadcrumb="Community › Members">
      <div className="p-6 max-w-7xl mx-auto">
        {/* ── Page Header ── */}
        <motion.div
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3 }}
          className="mb-6"
        >
          <h1 className="text-2xl font-display font-bold text-primary tracking-tight flex items-center gap-2.5">
            <User size={22} className="opacity-80" />
            Member Directory
          </h1>
          <p className="text-muted-foreground text-sm mt-1">
            {MOCK_MEMBERS.length} members across the IIIntl One global network
          </p>
          <div className="mt-3 civic-rule w-12" />
        </motion.div>

        {/* ── Search + Controls ── */}
        <motion.div
          initial={{ opacity: 0, y: 8 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3, delay: 0.05 }}
          className="flex flex-col sm:flex-row gap-3 mb-3"
        >
          {/* Search */}
          <div className="relative flex-1">
            <Search
              size={14}
              className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground"
            />
            <Input
              placeholder="Search by name, email, organization..."
              className="pl-8 h-9 text-sm"
              value={search}
              onChange={(e) => {
                setSearch(e.target.value);
                setPage(1);
              }}
              data-ocid="members.search_input"
            />
          </div>

          {/* Filter toggle */}
          <Button
            variant={showFilters ? "default" : "outline"}
            size="sm"
            className="h-9 gap-2 text-xs flex-shrink-0"
            onClick={() => setShowFilters(!showFilters)}
            data-ocid="members.filter_button"
          >
            <Filter size={13} />
            Filters
            {hasActiveFilters && (
              <span className="bg-white text-primary rounded-full w-4 h-4 flex items-center justify-center text-[10px] font-bold">
                {
                  [
                    roleFilter !== "all",
                    regionFilter !== "all",
                    statusFilter !== "all",
                  ].filter(Boolean).length
                }
              </span>
            )}
          </Button>

          {/* View toggle */}
          <div className="flex border border-border rounded-md overflow-hidden flex-shrink-0">
            <Button
              variant={viewMode === "grid" ? "default" : "ghost"}
              size="sm"
              className="h-9 rounded-none px-3 border-0"
              onClick={() => setViewMode("grid")}
              data-ocid="members.grid_toggle"
            >
              <LayoutGrid size={14} />
            </Button>
            <Separator orientation="vertical" className="h-9" />
            <Button
              variant={viewMode === "table" ? "default" : "ghost"}
              size="sm"
              className="h-9 rounded-none px-3 border-0"
              onClick={() => setViewMode("table")}
              data-ocid="members.table_toggle"
            >
              <List size={14} />
            </Button>
          </div>
        </motion.div>

        {/* ── Filter Panel ── */}
        <AnimatePresence>
          {showFilters && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: "auto" }}
              exit={{ opacity: 0, height: 0 }}
              transition={{ duration: 0.2 }}
              className="overflow-hidden mb-4"
            >
              <Card className="border-border">
                <CardContent className="p-4">
                  <div className="flex flex-wrap gap-3 items-center">
                    <Select
                      value={roleFilter}
                      onValueChange={(v) => {
                        setRoleFilter(v);
                        setPage(1);
                      }}
                    >
                      <SelectTrigger
                        className="h-8 text-xs w-40"
                        data-ocid="members.role_filter_select"
                      >
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        {ROLES.map((r) => (
                          <SelectItem
                            key={r.value}
                            value={r.value}
                            className="text-xs"
                          >
                            {r.label}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>

                    <Select
                      value={regionFilter}
                      onValueChange={(v) => {
                        setRegionFilter(v);
                        setPage(1);
                      }}
                    >
                      <SelectTrigger
                        className="h-8 text-xs w-44"
                        data-ocid="members.region_filter_select"
                      >
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        {REGIONS.map((r) => (
                          <SelectItem
                            key={r.value}
                            value={r.value}
                            className="text-xs"
                          >
                            {r.label}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>

                    <Select
                      value={statusFilter}
                      onValueChange={(v) => {
                        setStatusFilter(v);
                        setPage(1);
                      }}
                    >
                      <SelectTrigger
                        className="h-8 text-xs w-40"
                        data-ocid="members.status_filter_select"
                      >
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        {STATUSES.map((s) => (
                          <SelectItem
                            key={s.value}
                            value={s.value}
                            className="text-xs"
                          >
                            {s.label}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>

                    {hasActiveFilters && (
                      <Button
                        variant="ghost"
                        size="sm"
                        className="h-8 text-xs gap-1.5 text-muted-foreground"
                        onClick={clearFilters}
                        data-ocid="members.clear_filters_button"
                      >
                        <X size={12} />
                        Clear filters
                      </Button>
                    )}
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          )}
        </AnimatePresence>

        {/* ── Results count ── */}
        <div className="flex items-center justify-between mb-4">
          <p className="text-xs text-muted-foreground">
            Showing{" "}
            <span className="font-semibold text-foreground">
              {Math.min(paginated.length, filtered.length)}
            </span>{" "}
            of{" "}
            <span className="font-semibold text-foreground">
              {filtered.length}
            </span>{" "}
            members
          </p>
          {hasActiveFilters && (
            <div className="flex items-center gap-2">
              {roleFilter !== "all" && (
                <Badge variant="secondary" className="text-[10px] gap-1">
                  Role: {roleFilter.replace("_", " ")}
                  <button
                    type="button"
                    onClick={() => setRoleFilter("all")}
                    className="hover:opacity-70"
                  >
                    <X size={10} />
                  </button>
                </Badge>
              )}
              {regionFilter !== "all" && (
                <Badge variant="secondary" className="text-[10px] gap-1">
                  Region: {regionFilter}
                  <button
                    type="button"
                    onClick={() => setRegionFilter("all")}
                    className="hover:opacity-70"
                  >
                    <X size={10} />
                  </button>
                </Badge>
              )}
            </div>
          )}
        </div>

        {/* ── Empty state ── */}
        {filtered.length === 0 && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="flex flex-col items-center justify-center py-24 text-center"
            data-ocid="members.empty_state"
          >
            <div className="w-16 h-16 rounded-2xl bg-secondary flex items-center justify-center mb-4">
              <User size={24} className="text-muted-foreground/50" />
            </div>
            <h3 className="font-display font-semibold text-foreground mb-1">
              No members found
            </h3>
            <p className="text-sm text-muted-foreground max-w-xs">
              {search || hasActiveFilters
                ? "No members match your current search and filters."
                : "No members available."}
            </p>
            {(search || hasActiveFilters) && (
              <Button
                variant="outline"
                size="sm"
                className="mt-4 gap-1.5"
                onClick={clearFilters}
              >
                <X size={13} />
                Clear all filters
              </Button>
            )}
          </motion.div>
        )}

        {/* ── Grid View ── */}
        {filtered.length > 0 && viewMode === "grid" && (
          <motion.div
            variants={gridContainerVariants}
            initial="hidden"
            animate="visible"
            className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4"
          >
            {paginated.map((member, i) => (
              <MemberGridCard
                key={member.id}
                member={member}
                index={i + 1}
                onClick={() => setSelectedMember(member)}
              />
            ))}
          </motion.div>
        )}

        {/* ── Table View ── */}
        {filtered.length > 0 && viewMode === "table" && (
          <motion.div
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.25 }}
          >
            <Card>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead className="text-xs">Member</TableHead>
                    <TableHead className="text-xs">Role</TableHead>
                    <TableHead className="text-xs hidden sm:table-cell">
                      Organization
                    </TableHead>
                    <TableHead className="text-xs hidden md:table-cell">
                      Region
                    </TableHead>
                    <TableHead className="text-xs hidden lg:table-cell">
                      Status
                    </TableHead>
                    <TableHead className="text-xs hidden lg:table-cell">
                      Joined
                    </TableHead>
                    <TableHead className="text-xs">Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {paginated.map((member, i) => (
                    <TableRow
                      key={member.id}
                      className="hover:bg-secondary/30 cursor-pointer"
                      data-ocid={`members.item.${i + 1}`}
                      onClick={() => setSelectedMember(member)}
                    >
                      <TableCell>
                        <div className="flex items-center gap-2.5">
                          <Avatar className="h-8 w-8">
                            <AvatarFallback
                              className={cn(
                                "text-[10px] font-bold",
                                getRoleBadgeClasses(member.role),
                              )}
                            >
                              {getInitials(member.name)}
                            </AvatarFallback>
                          </Avatar>
                          <div>
                            <p className="text-xs font-semibold">
                              {member.name}
                            </p>
                            <p className="text-[10px] text-muted-foreground">
                              {member.title ?? member.email}
                            </p>
                          </div>
                        </div>
                      </TableCell>
                      <TableCell>
                        <Badge
                          variant="outline"
                          className={cn(
                            "text-[10px] px-1.5 py-0 h-4 capitalize font-medium",
                            getRoleBadgeClasses(member.role),
                          )}
                        >
                          {member.role.replace("_", " ")}
                        </Badge>
                      </TableCell>
                      <TableCell className="hidden sm:table-cell">
                        <span className="text-xs text-muted-foreground">
                          {member.organization}
                        </span>
                      </TableCell>
                      <TableCell className="hidden md:table-cell">
                        <span className="text-xs text-muted-foreground">
                          {member.region}
                        </span>
                      </TableCell>
                      <TableCell className="hidden lg:table-cell">
                        <Badge
                          variant="outline"
                          className={cn(
                            "text-[10px] px-1.5 py-0 h-4 capitalize",
                            getStatusBadgeClasses(member.status),
                          )}
                        >
                          {member.status}
                        </Badge>
                      </TableCell>
                      <TableCell className="hidden lg:table-cell">
                        <span className="text-xs text-muted-foreground">
                          {new Date(member.joinedDate).toLocaleDateString(
                            "en-US",
                            {
                              month: "short",
                              year: "numeric",
                            },
                          )}
                        </span>
                      </TableCell>
                      <TableCell>
                        <Button
                          size="sm"
                          variant="ghost"
                          className="h-7 text-xs text-primary"
                          onClick={(e) => {
                            e.stopPropagation();
                            setSelectedMember(member);
                          }}
                          data-ocid={`members.view_button.${i + 1}`}
                        >
                          View
                        </Button>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </Card>
          </motion.div>
        )}

        {/* ── Load More ── */}
        {hasMore && filtered.length > 0 && (
          <div className="flex justify-center mt-6">
            <Button
              variant="outline"
              size="sm"
              className="h-9 text-sm gap-2"
              onClick={() => setPage((p) => p + 1)}
              data-ocid="members.load_more_button"
            >
              Load More Members
              <span className="text-muted-foreground text-xs">
                ({filtered.length - paginated.length} remaining)
              </span>
            </Button>
          </div>
        )}
      </div>

      {/* ── Member Profile Sheet ── */}
      <MemberProfileSheet
        member={selectedMember}
        onClose={() => setSelectedMember(null)}
      />
    </Layout>
  );
}
