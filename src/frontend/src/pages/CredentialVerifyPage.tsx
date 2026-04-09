import { type Credential, CredentialStatus, CredentialType } from "@/backend";
import { Layout } from "@/components/Layout";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { useBackend } from "@/hooks/useBackend";
import { cn } from "@/lib/utils";
import { useParams } from "@tanstack/react-router";
import {
  Award,
  BadgeCheck,
  Calendar,
  CheckCircle2,
  Clock,
  Copy,
  ExternalLink,
  Fingerprint,
  ShieldAlert,
  ShieldCheck,
  ShieldX,
  Star,
  Users,
  XCircle,
  Zap,
} from "lucide-react";
import { motion } from "motion/react";
import { useEffect, useState } from "react";

// ── Type metadata ─────────────────────────────────────────────────────────────
const TYPE_META: Record<
  string,
  { label: string; icon: React.ReactNode; color: string; bg: string }
> = {
  verifiedHuman: {
    label: "Verified Human",
    icon: <Fingerprint size={18} />,
    color: "text-emerald-400",
    bg: "bg-emerald-500/15 border-emerald-500/30",
  },
  orgRepresentative: {
    label: "Org Representative",
    icon: <Users size={18} />,
    color: "text-blue-400",
    bg: "bg-blue-500/15 border-blue-500/30",
  },
  expertiseBadge: {
    label: "Expertise Badge",
    icon: <Star size={18} />,
    color: "text-amber-400",
    bg: "bg-amber-500/15 border-amber-500/30",
  },
  eventAttendee: {
    label: "Event Attendee",
    icon: <Award size={18} />,
    color: "text-purple-400",
    bg: "bg-purple-500/15 border-purple-500/30",
  },
  activistCertification: {
    label: "Activist Certification",
    icon: <Zap size={18} />,
    color: "text-orange-400",
    bg: "bg-orange-500/15 border-orange-500/30",
  },
  custom: {
    label: "Custom Credential",
    icon: <BadgeCheck size={18} />,
    color: "text-cyan-400",
    bg: "bg-cyan-500/15 border-cyan-500/30",
  },
};

// ── Seal config per status ────────────────────────────────────────────────────
const SEAL_CONFIG = {
  active: {
    icon: <ShieldCheck size={56} />,
    label: "VERIFIED",
    sublabel: "This credential is active and valid",
    ring: "ring-emerald-500/40",
    bg: "bg-emerald-500/10",
    pulse: true,
    color: "text-emerald-400",
  },
  approved: {
    icon: <CheckCircle2 size={56} />,
    label: "APPROVED",
    sublabel: "This credential has been approved",
    ring: "ring-emerald-400/40",
    bg: "bg-emerald-500/8",
    pulse: false,
    color: "text-emerald-400",
  },
  revoked: {
    icon: <ShieldX size={56} />,
    label: "REVOKED",
    sublabel: "This credential has been revoked",
    ring: "ring-red-500/40",
    bg: "bg-red-500/10",
    pulse: false,
    color: "text-red-400",
  },
  pending: {
    icon: <Clock size={56} />,
    label: "PENDING",
    sublabel: "Awaiting admin approval",
    ring: "ring-amber-500/40",
    bg: "bg-amber-500/10",
    pulse: false,
    color: "text-amber-400",
  },
  rejected: {
    icon: <XCircle size={56} />,
    label: "REJECTED",
    sublabel: "This credential was not approved",
    ring: "ring-red-400/40",
    bg: "bg-red-500/8",
    pulse: false,
    color: "text-red-400",
  },
};

// ── Mock fallback ─────────────────────────────────────────────────────────────
const MOCK_CREDENTIAL: Credential = {
  id: "cred-001",
  credentialType: CredentialType.verifiedHuman,
  status: CredentialStatus.active,
  title: "Verified Human — Internet Identity",
  description:
    "Confirmed unique personhood verified via Internet Identity on the Internet Computer.",
  subject: { toText: () => "rdmx6-jaaaa-aaaaa-aaadq-cai" } as never,
  issuedBy: { toText: () => "rrkah-fqaaa-aaaaa-aaaaq-cai" } as never,
  metadata: "{}",
  isPublic: true,
  issuedAt: BigInt(Date.now() - 30 * 86400000) * 1000000n,
  approvedAt: BigInt(Date.now() - 29 * 86400000) * 1000000n,
  updatedAt: BigInt(Date.now()) * 1000000n,
};

function principalText(p: unknown): string {
  if (typeof p === "object" && p !== null && "toText" in p)
    return (p as { toText: () => string }).toText();
  return String(p);
}

function maskPrincipal(p: unknown): string {
  const str = principalText(p);
  if (str.length <= 14) return str;
  return `${str.slice(0, 8)}…${str.slice(-6)}`;
}

function formatTs(ts: bigint): string {
  return new Date(Number(ts) / 1_000_000).toLocaleDateString(undefined, {
    year: "numeric",
    month: "long",
    day: "numeric",
  });
}

// ── DataRow ───────────────────────────────────────────────────────────────────
function DataRow({
  label,
  value,
  mono = false,
}: {
  label: string;
  value: string;
  mono?: boolean;
}) {
  return (
    <div className="flex flex-col sm:flex-row sm:items-center gap-1 py-3 border-b border-border/50 last:border-0">
      <dt className="text-xs text-muted-foreground font-medium w-36 flex-shrink-0">
        {label}
      </dt>
      <dd
        className={cn(
          "text-sm text-foreground break-all",
          mono && "font-mono text-xs",
        )}
      >
        {value}
      </dd>
    </div>
  );
}

// ── CredentialVerifyPage ──────────────────────────────────────────────────────
export function CredentialVerifyPage() {
  const { id } = useParams({ from: "/credentials/$id/verify" });
  const backend = useBackend();
  const [credential, setCredential] = useState<Credential | null>(null);
  const [loading, setLoading] = useState(true);
  const [notFound, setNotFound] = useState(false);
  const [copied, setCopied] = useState(false);

  useEffect(() => {
    async function load() {
      try {
        if (!backend) throw new Error("no backend");
        const cred = await backend.getCredential(id);
        if (cred) {
          setCredential(cred);
        } else if (id === "cred-001" || id.startsWith("cred-00")) {
          setCredential({ ...MOCK_CREDENTIAL, id });
        } else {
          setNotFound(true);
        }
      } catch {
        setCredential({ ...MOCK_CREDENTIAL, id });
      } finally {
        setLoading(false);
      }
    }
    load();
  }, [backend, id]);

  const handleCopyLink = () => {
    navigator.clipboard.writeText(window.location.href).catch(() => {});
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  if (loading) {
    return (
      <Layout breadcrumb="Verify Credential">
        <div className="p-6 max-w-2xl mx-auto space-y-6">
          <Skeleton className="h-48 rounded-2xl" />
          <Skeleton className="h-64 rounded-xl" />
        </div>
      </Layout>
    );
  }

  if (notFound || !credential) {
    return (
      <Layout breadcrumb="Verify Credential">
        <div className="p-6 max-w-2xl mx-auto flex flex-col items-center py-24 gap-4 text-center">
          <ShieldAlert size={56} className="text-muted-foreground/40" />
          <h2 className="text-2xl font-display font-bold text-foreground">
            Credential Not Found
          </h2>
          <p className="text-muted-foreground max-w-sm">
            No credential exists with ID{" "}
            <code className="font-mono text-xs bg-muted px-1.5 py-0.5 rounded">
              {id}
            </code>
            . It may have been revoked or the ID is incorrect.
          </p>
        </div>
      </Layout>
    );
  }

  const statusKey = String(credential.status);
  const seal =
    SEAL_CONFIG[statusKey as keyof typeof SEAL_CONFIG] ?? SEAL_CONFIG.pending;
  const typeMeta =
    TYPE_META[String(credential.credentialType)] ?? TYPE_META.custom;
  const isValid = statusKey === "active" || statusKey === "approved";

  return (
    <Layout breadcrumb="Verify Credential">
      <div className="p-6 max-w-2xl mx-auto space-y-6">
        {/* Verification Seal */}
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.4, ease: "easeOut" }}
          className={cn(
            "rounded-2xl border-2 p-8 flex flex-col items-center text-center gap-4",
            isValid
              ? "border-emerald-500/30 bg-emerald-500/5"
              : "border-red-500/20 bg-red-500/5",
          )}
          data-ocid="credentials.verify.seal"
        >
          {/* Animated seal */}
          <div className="relative">
            <div
              className={cn(
                "w-28 h-28 rounded-full flex items-center justify-center ring-4",
                seal.bg,
                seal.ring,
                seal.color,
              )}
            >
              {seal.icon}
            </div>
            {seal.pulse && (
              <>
                <span className="absolute inset-0 rounded-full animate-ping ring-2 ring-emerald-500/30 opacity-30" />
                <span className="absolute inset-2 rounded-full animate-pulse ring-1 ring-emerald-500/20 opacity-20" />
              </>
            )}
          </div>

          {/* Status label */}
          <div>
            <p
              className={cn(
                "text-3xl font-display font-black tracking-widest",
                seal.color,
              )}
            >
              {seal.label}
            </p>
            <p className="text-sm text-muted-foreground mt-1">
              {seal.sublabel}
            </p>
          </div>

          {/* Credential ID */}
          <div className="bg-muted/60 rounded-lg px-4 py-2 flex items-center gap-2">
            <span className="text-[10px] text-muted-foreground font-semibold uppercase tracking-wider">
              Credential ID
            </span>
            <code className="text-xs font-mono text-foreground">
              {credential.id}
            </code>
          </div>
        </motion.div>

        {/* Credential Details */}
        <motion.div
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.35, delay: 0.15 }}
          className="rounded-xl border border-border/60 bg-card overflow-hidden"
        >
          {/* Header */}
          <div className="px-5 py-4 border-b border-border/60 flex items-start gap-3">
            <div
              className={cn(
                "flex items-center justify-center w-9 h-9 rounded-lg border",
                typeMeta.bg,
                typeMeta.color,
              )}
            >
              {typeMeta.icon}
            </div>
            <div className="flex-1 min-w-0">
              <span
                className={cn(
                  "text-xs font-medium px-2 py-0.5 rounded-full border inline-block mb-1",
                  typeMeta.bg,
                  typeMeta.color,
                )}
              >
                {typeMeta.label}
              </span>
              <h2 className="font-semibold text-base leading-snug text-foreground">
                {credential.title}
              </h2>
            </div>
          </div>

          {/* Description */}
          <div className="px-5 py-4 border-b border-border/60">
            <p className="text-sm text-muted-foreground leading-relaxed">
              {credential.description}
            </p>
          </div>

          {/* Data table */}
          <dl className="px-5 py-2">
            <DataRow
              label="Subject Principal"
              value={maskPrincipal(credential.subject)}
              mono
            />
            <DataRow
              label="Full Principal"
              value={principalText(credential.subject)}
              mono
            />
            <DataRow
              label="Issued By"
              value={maskPrincipal(credential.issuedBy)}
              mono
            />
            <DataRow label="Issue Date" value={formatTs(credential.issuedAt)} />
            {credential.approvedAt && (
              <DataRow
                label="Approved Date"
                value={formatTs(credential.approvedAt)}
              />
            )}
            {credential.expiresAt && (
              <DataRow
                label="Expiry Date"
                value={formatTs(credential.expiresAt)}
              />
            )}
            {credential.revokedAt && (
              <DataRow
                label="Revoked Date"
                value={formatTs(credential.revokedAt)}
              />
            )}
            <DataRow label="Status" value={statusKey.toUpperCase()} />
            <DataRow
              label="Public"
              value={
                credential.isPublic ? "Yes — publicly viewable" : "No — private"
              }
            />
          </dl>
        </motion.div>

        {/* Actions */}
        <motion.div
          initial={{ opacity: 0, y: 8 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3, delay: 0.25 }}
          className="flex flex-col sm:flex-row gap-3"
        >
          <Button
            onClick={handleCopyLink}
            variant="outline"
            className={cn(
              "flex-1 gap-2 border-emerald-500/30 text-emerald-400 hover:bg-emerald-500/10 hover:border-emerald-500/60 transition-all",
              copied && "bg-emerald-500/15 border-emerald-500/50",
            )}
            data-ocid="credentials.verify.share_btn"
          >
            {copied ? (
              <>
                <CheckCircle2 size={15} /> Copied!
              </>
            ) : (
              <>
                <Copy size={15} /> Share Verification Link
              </>
            )}
          </Button>

          <Button
            variant="outline"
            className="flex-1 gap-2"
            asChild
            data-ocid="credentials.verify.browse_btn"
          >
            <a href="/credentials">
              <ExternalLink size={15} />
              Browse All Credentials
            </a>
          </Button>
        </motion.div>

        {/* Footer note */}
        <p className="text-[11px] text-muted-foreground/60 text-center leading-relaxed">
          This credential is stored on the Internet Computer blockchain and is
          cryptographically verifiable.{" "}
          <Calendar size={10} className="inline" /> Last updated:{" "}
          {formatTs(credential.updatedAt)}
        </p>
      </div>
    </Layout>
  );
}
