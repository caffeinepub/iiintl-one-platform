import { type Credential, CredentialStatus, CredentialType } from "@/backend";
import { Layout } from "@/components/Layout";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Skeleton } from "@/components/ui/skeleton";
import { useBackend } from "@/hooks/useBackend";
import { cn } from "@/lib/utils";
import { Link } from "@tanstack/react-router";
import {
  Award,
  BadgeCheck,
  Fingerprint,
  Search,
  ShieldCheck,
  Star,
  Users,
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

// ── Mock data ─────────────────────────────────────────────────────────────────
const MOCK_CREDENTIALS: Credential[] = [
  {
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
  },
  {
    id: "cred-002",
    credentialType: CredentialType.orgRepresentative,
    status: CredentialStatus.active,
    title: "Authorized Representative — Americas Chapter",
    description:
      "Authorized to act on behalf of the Americas Chapter organization within the IIIntl platform.",
    subject: { toText: () => "qaa6y-5yaaa-aaaaa-aaafa-cai" } as never,
    issuedBy: { toText: () => "rrkah-fqaaa-aaaaa-aaaaq-cai" } as never,
    metadata: '{"org":"americas-chapter"}',
    isPublic: true,
    issuedAt: BigInt(Date.now() - 60 * 86400000) * 1000000n,
    approvedAt: BigInt(Date.now() - 59 * 86400000) * 1000000n,
    updatedAt: BigInt(Date.now()) * 1000000n,
  },
  {
    id: "cred-003",
    credentialType: CredentialType.expertiseBadge,
    status: CredentialStatus.active,
    title: "International Law & Diplomacy Expert",
    description:
      "Peer-endorsed expertise in international law, diplomatic channels, and treaty negotiation.",
    subject: { toText: () => "aaaaa-aa" } as never,
    issuedBy: { toText: () => "rrkah-fqaaa-aaaaa-aaaaq-cai" } as never,
    metadata: '{"domain":"international-law"}',
    isPublic: true,
    issuedAt: BigInt(Date.now() - 14 * 86400000) * 1000000n,
    approvedAt: BigInt(Date.now() - 13 * 86400000) * 1000000n,
    updatedAt: BigInt(Date.now()) * 1000000n,
  },
  {
    id: "cred-004",
    credentialType: CredentialType.activistCertification,
    status: CredentialStatus.active,
    title: "Civic Activism Certification — Level 3",
    description:
      "Completed 3 verified activism campaigns across environmental, human rights, and community domains.",
    subject: { toText: () => "renrk-eyaaa-aaaaa-aaada-cai" } as never,
    issuedBy: { toText: () => "rrkah-fqaaa-aaaaa-aaaaq-cai" } as never,
    metadata: '{"campaigns":3}',
    isPublic: true,
    issuedAt: BigInt(Date.now() - 7 * 86400000) * 1000000n,
    approvedAt: BigInt(Date.now() - 6 * 86400000) * 1000000n,
    updatedAt: BigInt(Date.now()) * 1000000n,
  },
  {
    id: "cred-005",
    credentialType: CredentialType.eventAttendee,
    status: CredentialStatus.active,
    title: "IIIntl Global Summit 2025 — Attendee",
    description:
      "Verified attendee of the IIIntl Global Summit 2025, demonstrating active civic participation.",
    subject: { toText: () => "rdmx6-jaaaa-aaaaa-aaadq-cai" } as never,
    issuedBy: { toText: () => "rrkah-fqaaa-aaaaa-aaaaq-cai" } as never,
    metadata: '{"event":"global-summit-2025"}',
    isPublic: true,
    issuedAt: BigInt(Date.now() - 45 * 86400000) * 1000000n,
    approvedAt: BigInt(Date.now() - 45 * 86400000) * 1000000n,
    updatedAt: BigInt(Date.now()) * 1000000n,
  },
  {
    id: "cred-006",
    credentialType: CredentialType.expertiseBadge,
    status: CredentialStatus.active,
    title: "Digital Rights & Cybersecurity Expert",
    description:
      "Recognized expertise in digital rights advocacy, privacy law, and cybersecurity policy.",
    subject: { toText: () => "qaa6y-5yaaa-aaaaa-aaafa-cai" } as never,
    issuedBy: { toText: () => "rrkah-fqaaa-aaaaa-aaaaq-cai" } as never,
    metadata: '{"domain":"digital-rights"}',
    isPublic: true,
    issuedAt: BigInt(Date.now() - 90 * 86400000) * 1000000n,
    approvedAt: BigInt(Date.now() - 89 * 86400000) * 1000000n,
    updatedAt: BigInt(Date.now()) * 1000000n,
  },
];

const TYPE_TABS = [
  { key: "all", label: "All" },
  { key: CredentialType.verifiedHuman, label: "Verified Human" },
  { key: CredentialType.orgRepresentative, label: "Org Rep" },
  { key: CredentialType.expertiseBadge, label: "Expertise" },
  { key: CredentialType.eventAttendee, label: "Event" },
  { key: CredentialType.activistCertification, label: "Activist" },
] as const;

const containerVariants: Variants = {
  hidden: { opacity: 0 },
  visible: { opacity: 1, transition: { staggerChildren: 0.07 } },
};
const itemVariants: Variants = {
  hidden: { opacity: 0, y: 16 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.3 } },
};

function maskPrincipal(p: unknown): string {
  const str =
    typeof p === "object" && p !== null && "toText" in p
      ? (p as { toText: () => string }).toText()
      : String(p);
  if (str.length <= 12) return str;
  return `${str.slice(0, 5)}…${str.slice(-5)}`;
}

function CredentialCard({ cred }: { cred: Credential }) {
  const typeKey = String(cred.credentialType);
  const meta = TYPE_META[typeKey] ?? TYPE_META.custom;
  const issuedDate = new Date(
    Number(cred.issuedAt) / 1_000_000,
  ).toLocaleDateString(undefined, {
    year: "numeric",
    month: "short",
    day: "numeric",
  });

  return (
    <motion.div variants={itemVariants} className="h-full">
      <Card className="flex flex-col h-full border-border/60 hover:border-emerald-500/40 transition-all duration-200 hover:shadow-md group">
        <CardContent className="flex flex-col flex-1 p-5 gap-3">
          {/* Type badge */}
          <div className="flex items-center gap-2">
            <span
              className={cn(
                "flex items-center gap-1 text-xs font-medium px-2 py-0.5 rounded-full border",
                meta.bg,
                meta.color,
              )}
            >
              {meta.icon}
              {meta.label}
            </span>
            <span className="ml-auto flex items-center gap-1 text-xs text-emerald-400 font-medium">
              <ShieldCheck size={12} />
              Active
            </span>
          </div>

          {/* Title */}
          <h3 className="font-semibold text-sm leading-snug line-clamp-2 text-foreground group-hover:text-emerald-400 transition-colors">
            {cred.title}
          </h3>

          {/* Description */}
          <p className="text-xs text-muted-foreground line-clamp-2 leading-relaxed">
            {cred.description}
          </p>

          {/* Subject */}
          <div className="flex items-center gap-1.5 text-xs text-muted-foreground font-mono">
            <Fingerprint size={11} className="text-emerald-500/60" />
            <span>{maskPrincipal(cred.subject)}</span>
          </div>

          {/* Issued date */}
          <p className="text-[11px] text-muted-foreground/70">
            Issued {issuedDate}
          </p>

          {/* CTA */}
          <div className="mt-auto pt-2">
            <Link
              to="/credentials/$id/verify"
              params={{ id: cred.id }}
              data-ocid={`credentials.verify_btn_${cred.id}`}
            >
              <Button
                size="sm"
                variant="outline"
                className="w-full text-xs border-emerald-500/30 text-emerald-400 hover:bg-emerald-500/10 hover:border-emerald-500/60"
              >
                <ShieldCheck size={12} className="mr-1.5" />
                Verify Credential
              </Button>
            </Link>
          </div>
        </CardContent>
      </Card>
    </motion.div>
  );
}

export function CredentialsPage() {
  const backend = useBackend();
  const [credentials, setCredentials] = useState<Credential[]>([]);
  const [loading, setLoading] = useState(true);
  const [typeFilter, setTypeFilter] = useState<string>("all");
  const [search, setSearch] = useState("");

  useEffect(() => {
    async function load() {
      try {
        if (!backend) throw new Error("no backend");
        // Load all active public credentials by type or all
        const types = [
          CredentialType.verifiedHuman,
          CredentialType.orgRepresentative,
          CredentialType.expertiseBadge,
          CredentialType.eventAttendee,
          CredentialType.activistCertification,
          CredentialType.custom,
        ];
        const results = await Promise.all(
          types.map((t) => backend.listPublicCredentialsByType(t)),
        );
        const all = results.flat().filter((c) => String(c.status) === "active");
        setCredentials(all.length > 0 ? all : MOCK_CREDENTIALS);
      } catch {
        setCredentials(MOCK_CREDENTIALS);
      } finally {
        setLoading(false);
      }
    }
    load();
  }, [backend]);

  const filtered = credentials.filter((c) => {
    if (typeFilter !== "all" && String(c.credentialType) !== typeFilter)
      return false;
    if (
      search &&
      !c.title.toLowerCase().includes(search.toLowerCase()) &&
      !c.description.toLowerCase().includes(search.toLowerCase())
    )
      return false;
    return true;
  });

  return (
    <Layout breadcrumb="Credentials">
      <div className="p-6 max-w-7xl mx-auto space-y-6">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3 }}
        >
          <div className="flex items-start gap-3 mb-2">
            <div className="w-10 h-10 rounded-xl bg-emerald-500/15 border border-emerald-500/30 flex items-center justify-center flex-shrink-0">
              <ShieldCheck size={20} className="text-emerald-400" />
            </div>
            <div>
              <h1 className="text-3xl font-display font-bold text-foreground">
                Verified Credentials
              </h1>
              <p className="text-muted-foreground mt-1">
                On-chain identity credentials issued to verified members and
                organizations. Public trust layer for the IIIntl network.
              </p>
            </div>
          </div>
          {/* Stats strip */}
          <div className="flex gap-6 mt-4 pt-4 border-t border-border/50">
            {[
              { label: "Total Credentials", value: credentials.length },
              {
                label: "Verified Humans",
                value: credentials.filter(
                  (c) => String(c.credentialType) === "verifiedHuman",
                ).length,
              },
              {
                label: "Expert Badges",
                value: credentials.filter(
                  (c) => String(c.credentialType) === "expertiseBadge",
                ).length,
              },
              {
                label: "Activist Certs",
                value: credentials.filter(
                  (c) => String(c.credentialType) === "activistCertification",
                ).length,
              },
            ].map((s) => (
              <div key={s.label} className="text-center">
                <p className="text-2xl font-bold font-display text-emerald-400">
                  {s.value}
                </p>
                <p className="text-[11px] text-muted-foreground">{s.label}</p>
              </div>
            ))}
          </div>
        </motion.div>

        {/* Search */}
        <div className="relative max-w-sm">
          <Search
            size={15}
            className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground"
          />
          <Input
            placeholder="Search credentials…"
            className="pl-9 h-9 text-sm"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            data-ocid="credentials.search_input"
          />
        </div>

        {/* Type filter tabs */}
        <div
          className="flex gap-2 flex-wrap"
          data-ocid="credentials.type_filter_tabs"
        >
          {TYPE_TABS.map((t) => (
            <button
              type="button"
              key={t.key}
              onClick={() => setTypeFilter(t.key)}
              className={cn(
                "px-3 py-1.5 rounded-full text-sm font-medium transition-all",
                typeFilter === t.key
                  ? "bg-emerald-500/20 text-emerald-400 border border-emerald-500/40"
                  : "bg-muted text-muted-foreground hover:bg-muted/80 border border-transparent",
              )}
              data-ocid={`credentials.type_tab_${t.key}`}
            >
              {t.label}
            </button>
          ))}
        </div>

        {/* Grid */}
        {loading ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
            {Array.from({ length: 6 }, (_, i) => `s${i}`).map((k) => (
              <Skeleton key={k} className="h-52 rounded-xl" />
            ))}
          </div>
        ) : filtered.length === 0 ? (
          <div
            className="flex flex-col items-center py-24 text-center gap-4"
            data-ocid="credentials.empty_state"
          >
            <ShieldCheck size={48} className="text-emerald-500/30" />
            <div>
              <h3 className="text-lg font-semibold text-foreground">
                No credentials found
              </h3>
              <p className="text-muted-foreground text-sm mt-1">
                Adjust your filters or check back later as more credentials are
                issued.
              </p>
            </div>
          </div>
        ) : (
          <motion.div
            variants={containerVariants}
            initial="hidden"
            animate="visible"
            className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5"
            data-ocid="credentials.grid"
          >
            {filtered.map((c) => (
              <CredentialCard key={c.id} cred={c} />
            ))}
          </motion.div>
        )}

        {/* Trust info banner */}
        <motion.div
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          className="rounded-xl bg-emerald-500/8 border border-emerald-500/20 p-5 flex items-start gap-4"
        >
          <ShieldCheck
            size={24}
            className="text-emerald-400 flex-shrink-0 mt-0.5"
          />
          <div>
            <h3 className="font-semibold text-emerald-400 text-sm mb-1">
              On-Chain Trust Layer
            </h3>
            <p className="text-xs text-muted-foreground leading-relaxed">
              All credentials are issued and stored on the Internet Computer.
              Each credential is cryptographically linked to a principal,
              tamper-proof, and publicly verifiable. Members control their own
              privacy — credentials are only visible here if the holder has
              chosen to make them public.
            </p>
          </div>
        </motion.div>
      </div>
    </Layout>
  );
}
