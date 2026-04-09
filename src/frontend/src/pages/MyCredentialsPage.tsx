import { type Credential, CredentialStatus, CredentialType } from "@/backend";
import { Layout } from "@/components/Layout";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { Switch } from "@/components/ui/switch";
import { useBackend } from "@/hooks/useBackend";
import { cn } from "@/lib/utils";
import { Link } from "@tanstack/react-router";
import {
  Award,
  BadgeCheck,
  Clock,
  ExternalLink,
  Fingerprint,
  Lock,
  ShieldCheck,
  ShieldX,
  Star,
  Users,
  XCircle,
  Zap,
} from "lucide-react";
import type { Variants } from "motion/react";
import { motion } from "motion/react";
import { useEffect, useState } from "react";

// ── Type metadata ─────────────────────────────────────────────────────────────
const TYPE_META: Record<
  string,
  { label: string; icon: React.ReactNode; color: string; bg: string }
> = {
  verifiedHuman: {
    label: "Verified Human",
    icon: <Fingerprint size={14} />,
    color: "text-emerald-400",
    bg: "bg-emerald-500/15 border-emerald-500/30",
  },
  orgRepresentative: {
    label: "Org Representative",
    icon: <Users size={14} />,
    color: "text-blue-400",
    bg: "bg-blue-500/15 border-blue-500/30",
  },
  expertiseBadge: {
    label: "Expertise Badge",
    icon: <Star size={14} />,
    color: "text-amber-400",
    bg: "bg-amber-500/15 border-amber-500/30",
  },
  eventAttendee: {
    label: "Event Attendee",
    icon: <Award size={14} />,
    color: "text-purple-400",
    bg: "bg-purple-500/15 border-purple-500/30",
  },
  activistCertification: {
    label: "Activist Certification",
    icon: <Zap size={14} />,
    color: "text-orange-400",
    bg: "bg-orange-500/15 border-orange-500/30",
  },
  custom: {
    label: "Custom",
    icon: <BadgeCheck size={14} />,
    color: "text-cyan-400",
    bg: "bg-cyan-500/15 border-cyan-500/30",
  },
};

// ── Status config ─────────────────────────────────────────────────────────────
const STATUS_CONFIG: Record<
  string,
  { label: string; icon: React.ReactNode; color: string }
> = {
  active: {
    label: "Active",
    icon: <ShieldCheck size={12} />,
    color: "text-emerald-400",
  },
  approved: {
    label: "Approved",
    icon: <ShieldCheck size={12} />,
    color: "text-emerald-400",
  },
  pending: {
    label: "Pending Approval",
    icon: <Clock size={12} />,
    color: "text-amber-400",
  },
  revoked: {
    label: "Revoked",
    icon: <ShieldX size={12} />,
    color: "text-red-400",
  },
  rejected: {
    label: "Rejected",
    icon: <XCircle size={12} />,
    color: "text-red-400",
  },
};

// ── Mock credentials ──────────────────────────────────────────────────────────
const MOCK_MY_CREDENTIALS: Credential[] = [
  {
    id: "cred-001",
    credentialType: CredentialType.verifiedHuman,
    status: CredentialStatus.active,
    title: "Verified Human — Internet Identity",
    description: "Confirmed unique personhood via Internet Identity.",
    subject: { toText: () => "rdmx6-jaaaa-aaaaa-aaadq-cai" } as never,
    issuedBy: { toText: () => "rrkah-fqaaa-aaaaa-aaaaq-cai" } as never,
    metadata: "{}",
    isPublic: true,
    issuedAt: BigInt(Date.now() - 30 * 86400000) * 1000000n,
    approvedAt: BigInt(Date.now() - 29 * 86400000) * 1000000n,
    updatedAt: BigInt(Date.now()) * 1000000n,
  },
  {
    id: "cred-003",
    credentialType: CredentialType.expertiseBadge,
    status: CredentialStatus.active,
    title: "International Law & Diplomacy Expert",
    description: "Peer-endorsed expertise in international law.",
    subject: { toText: () => "rdmx6-jaaaa-aaaaa-aaadq-cai" } as never,
    issuedBy: { toText: () => "rrkah-fqaaa-aaaaa-aaaaq-cai" } as never,
    metadata: '{"domain":"international-law"}',
    isPublic: false,
    issuedAt: BigInt(Date.now() - 14 * 86400000) * 1000000n,
    approvedAt: BigInt(Date.now() - 13 * 86400000) * 1000000n,
    updatedAt: BigInt(Date.now()) * 1000000n,
  },
  {
    id: "cred-007",
    credentialType: CredentialType.activistCertification,
    status: CredentialStatus.pending,
    title: "Environmental Activist Certification",
    description: "Pending review for environmental activism campaigns.",
    subject: { toText: () => "rdmx6-jaaaa-aaaaa-aaadq-cai" } as never,
    issuedBy: { toText: () => "rrkah-fqaaa-aaaaa-aaaaq-cai" } as never,
    metadata: "{}",
    isPublic: false,
    issuedAt: BigInt(Date.now() - 3 * 86400000) * 1000000n,
    updatedAt: BigInt(Date.now()) * 1000000n,
  },
];

const containerVariants: Variants = {
  hidden: { opacity: 0 },
  visible: { opacity: 1, transition: { staggerChildren: 0.07 } },
};
const itemVariants: Variants = {
  hidden: { opacity: 0, x: -12 },
  visible: { opacity: 1, x: 0, transition: { duration: 0.3 } },
};

// ── CredentialRow ─────────────────────────────────────────────────────────────
function CredentialRow({
  cred,
  onTogglePublic,
  toggling,
}: {
  cred: Credential;
  onTogglePublic: (id: string, val: boolean) => void;
  toggling: string | null;
}) {
  const typeKey = String(cred.credentialType);
  const statusKey = String(cred.status);
  const meta = TYPE_META[typeKey] ?? TYPE_META.custom;
  const statusConf = STATUS_CONFIG[statusKey] ?? STATUS_CONFIG.pending;
  const isActive = statusKey === "active" || statusKey === "approved";
  const issuedDate = new Date(
    Number(cred.issuedAt) / 1_000_000,
  ).toLocaleDateString(undefined, {
    year: "numeric",
    month: "short",
    day: "numeric",
  });

  return (
    <motion.div variants={itemVariants}>
      <Card
        className={cn(
          "border-border/60 transition-all duration-200",
          isActive && "hover:border-emerald-500/30",
        )}
      >
        <CardContent className="p-4">
          <div className="flex items-start gap-4">
            {/* Type icon */}
            <div
              className={cn(
                "flex items-center justify-center w-9 h-9 rounded-lg border flex-shrink-0 mt-0.5",
                meta.bg,
                meta.color,
              )}
            >
              {meta.icon}
            </div>

            {/* Content */}
            <div className="flex-1 min-w-0">
              <div className="flex items-start justify-between gap-2 flex-wrap">
                <div>
                  <div className="flex items-center gap-2 flex-wrap mb-1">
                    <span
                      className={cn(
                        "text-[10px] font-semibold px-1.5 py-0.5 rounded-full border",
                        meta.bg,
                        meta.color,
                      )}
                    >
                      {meta.label}
                    </span>
                    <span
                      className={cn(
                        "flex items-center gap-0.5 text-[10px] font-semibold",
                        statusConf.color,
                      )}
                    >
                      {statusConf.icon}
                      {statusConf.label}
                    </span>
                  </div>
                  <h3 className="font-semibold text-sm text-foreground line-clamp-1">
                    {cred.title}
                  </h3>
                  <p className="text-xs text-muted-foreground mt-0.5 line-clamp-1">
                    {cred.description}
                  </p>
                  <p className="text-[11px] text-muted-foreground/60 mt-1">
                    Issued {issuedDate}
                  </p>
                </div>

                {/* Controls */}
                <div className="flex items-center gap-3 flex-shrink-0">
                  {isActive && (
                    <div className="flex items-center gap-2">
                      {cred.isPublic ? (
                        <ShieldCheck size={12} className="text-emerald-400" />
                      ) : (
                        <Lock size={12} className="text-muted-foreground" />
                      )}
                      <span className="text-[11px] text-muted-foreground hidden sm:block">
                        {cred.isPublic ? "Public" : "Private"}
                      </span>
                      <Switch
                        checked={cred.isPublic}
                        onCheckedChange={(val) => onTogglePublic(cred.id, val)}
                        disabled={toggling === cred.id}
                        className="data-[state=checked]:bg-emerald-500"
                        data-ocid={`my-credentials.toggle_public_${cred.id}`}
                        aria-label={`Toggle public visibility for ${cred.title}`}
                      />
                    </div>
                  )}

                  {isActive && (
                    <Link
                      to="/credentials/$id/verify"
                      params={{ id: cred.id }}
                      data-ocid={`my-credentials.view_verify_${cred.id}`}
                    >
                      <Button
                        size="sm"
                        variant="outline"
                        className="h-7 text-xs gap-1 border-emerald-500/30 text-emerald-400 hover:bg-emerald-500/10"
                      >
                        <ExternalLink size={11} />
                        <span className="hidden sm:inline">View</span>
                      </Button>
                    </Link>
                  )}
                </div>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </motion.div>
  );
}

// ── Section ───────────────────────────────────────────────────────────────────
function CredentialSection({
  title,
  icon,
  creds,
  onTogglePublic,
  toggling,
}: {
  title: string;
  icon: React.ReactNode;
  creds: Credential[];
  onTogglePublic: (id: string, val: boolean) => void;
  toggling: string | null;
}) {
  if (creds.length === 0) return null;
  return (
    <div className="space-y-3">
      <div className="flex items-center gap-2">
        {icon}
        <h2 className="font-semibold text-sm text-foreground">{title}</h2>
        <Badge variant="outline" className="text-[10px] h-4 px-1.5">
          {creds.length}
        </Badge>
      </div>
      <motion.div
        variants={containerVariants}
        initial="hidden"
        animate="visible"
        className="space-y-2"
      >
        {creds.map((c) => (
          <CredentialRow
            key={c.id}
            cred={c}
            onTogglePublic={onTogglePublic}
            toggling={toggling}
          />
        ))}
      </motion.div>
    </div>
  );
}

// ── MyCredentialsPage ─────────────────────────────────────────────────────────
export function MyCredentialsPage() {
  const backend = useBackend();
  const [credentials, setCredentials] = useState<Credential[]>([]);
  const [loading, setLoading] = useState(true);
  const [toggling, setToggling] = useState<string | null>(null);

  useEffect(() => {
    async function load() {
      try {
        if (!backend) throw new Error("no backend");
        const data = await backend.getMyCredentials();
        setCredentials(data.length > 0 ? data : MOCK_MY_CREDENTIALS);
      } catch {
        setCredentials(MOCK_MY_CREDENTIALS);
      } finally {
        setLoading(false);
      }
    }
    load();
  }, [backend]);

  const handleTogglePublic = async (id: string, val: boolean) => {
    setToggling(id);
    try {
      if (backend) await backend.toggleCredentialPublic(id, val);
      setCredentials((prev) =>
        prev.map((c) => (c.id === id ? { ...c, isPublic: val } : c)),
      );
    } catch {
      /* silently ignore */
    } finally {
      setToggling(null);
    }
  };

  const active = credentials.filter(
    (c) => String(c.status) === "active" || String(c.status) === "approved",
  );
  const pending = credentials.filter((c) => String(c.status) === "pending");
  const inactive = credentials.filter(
    (c) => String(c.status) === "revoked" || String(c.status) === "rejected",
  );

  return (
    <Layout breadcrumb="My Credentials">
      <div className="p-6 max-w-3xl mx-auto space-y-7">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3 }}
        >
          <div className="flex items-start gap-3 mb-2">
            <div className="w-10 h-10 rounded-xl bg-emerald-500/15 border border-emerald-500/30 flex items-center justify-center flex-shrink-0">
              <BadgeCheck size={20} className="text-emerald-400" />
            </div>
            <div>
              <h1 className="text-2xl font-display font-bold text-foreground">
                My Credentials
              </h1>
              <p className="text-sm text-muted-foreground mt-0.5">
                Your on-chain identity credentials. Control which ones are
                publicly visible.
              </p>
            </div>
          </div>

          {/* Summary */}
          {!loading && (
            <div className="flex gap-5 mt-4 pt-4 border-t border-border/50">
              {[
                {
                  label: "Active",
                  value: active.length,
                  color: "text-emerald-400",
                },
                {
                  label: "Pending",
                  value: pending.length,
                  color: "text-amber-400",
                },
                {
                  label: "Public",
                  value: active.filter((c) => c.isPublic).length,
                  color: "text-blue-400",
                },
              ].map((s) => (
                <div key={s.label} className="text-center">
                  <p className={cn("text-xl font-bold font-display", s.color)}>
                    {s.value}
                  </p>
                  <p className="text-[11px] text-muted-foreground">{s.label}</p>
                </div>
              ))}
            </div>
          )}
        </motion.div>

        {/* Content */}
        {loading ? (
          <div className="space-y-3">
            {Array.from({ length: 3 }, (_, i) => `s${i}`).map((k) => (
              <Skeleton key={k} className="h-20 rounded-xl" />
            ))}
          </div>
        ) : credentials.length === 0 ? (
          <div
            className="flex flex-col items-center py-16 text-center gap-4"
            data-ocid="my-credentials.empty_state"
          >
            <BadgeCheck size={48} className="text-emerald-500/30" />
            <div>
              <h3 className="text-lg font-semibold text-foreground">
                No credentials yet
              </h3>
              <p className="text-muted-foreground text-sm mt-1 max-w-sm">
                Credentials are issued by platform administrators to verified
                members. Complete your profile and participate in the community
                to become eligible.
              </p>
            </div>
            <Link to="/credentials">
              <Button
                variant="outline"
                className="gap-2 border-emerald-500/30 text-emerald-400 hover:bg-emerald-500/10"
                data-ocid="my-credentials.browse_btn"
              >
                <ShieldCheck size={15} />
                Browse All Credentials
              </Button>
            </Link>
          </div>
        ) : (
          <div className="space-y-7" data-ocid="my-credentials.sections">
            <CredentialSection
              title="Active Credentials"
              icon={<ShieldCheck size={16} className="text-emerald-400" />}
              creds={active}
              onTogglePublic={handleTogglePublic}
              toggling={toggling}
            />
            <CredentialSection
              title="Pending Approval"
              icon={<Clock size={16} className="text-amber-400" />}
              creds={pending}
              onTogglePublic={handleTogglePublic}
              toggling={toggling}
            />
            <CredentialSection
              title="Revoked / Rejected"
              icon={<ShieldX size={16} className="text-red-400" />}
              creds={inactive}
              onTogglePublic={handleTogglePublic}
              toggling={toggling}
            />
          </div>
        )}

        {/* Info note */}
        <motion.div
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          className="rounded-xl bg-card border border-border/60 p-4 flex items-start gap-3"
        >
          <Lock
            size={16}
            className="text-muted-foreground flex-shrink-0 mt-0.5"
          />
          <p className="text-xs text-muted-foreground leading-relaxed">
            <span className="font-semibold text-foreground">
              Privacy Control.
            </span>{" "}
            Only credentials you set to{" "}
            <span className="text-emerald-400">Public</span> appear in the
            public credentials directory. Private credentials remain visible
            only to you and authorized admins. All credentials are stored
            on-chain regardless of your privacy setting.
          </p>
        </motion.div>
      </div>
    </Layout>
  );
}
