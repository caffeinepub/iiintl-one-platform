import { Layout } from "@/components/Layout";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { useAuth } from "@/context/AuthContext";
import { useI18n } from "@/context/I18nContext";
import { Link } from "@tanstack/react-router";
import {
  ArrowRight,
  BookOpen,
  CheckCircle2,
  Globe,
  Megaphone,
  Users,
  Zap,
} from "lucide-react";
import type { Variants } from "motion/react";
import { motion } from "motion/react";

// ─── Globe SVG Motif ──────────────────────────────────────────────────────────

function GlobeMotif() {
  return (
    <svg
      viewBox="0 0 480 480"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      aria-hidden="true"
      className="absolute right-0 top-0 w-[320px] lg:w-[480px] h-auto opacity-[0.06] pointer-events-none select-none"
    >
      {/* Outer circle */}
      <circle cx="240" cy="240" r="220" stroke="white" strokeWidth="1.5" />
      {/* Equator */}
      <ellipse
        cx="240"
        cy="240"
        rx="220"
        ry="220"
        stroke="white"
        strokeWidth="1.5"
      />
      {/* Meridian 1 */}
      <ellipse
        cx="240"
        cy="240"
        rx="110"
        ry="220"
        stroke="white"
        strokeWidth="1"
      />
      {/* Meridian 2 – tilted */}
      <ellipse
        cx="240"
        cy="240"
        rx="55"
        ry="220"
        stroke="white"
        strokeWidth="1"
      />
      {/* Horizontal latitude lines */}
      <ellipse
        cx="240"
        cy="190"
        rx="204"
        ry="50"
        stroke="white"
        strokeWidth="0.75"
      />
      <ellipse
        cx="240"
        cy="290"
        rx="204"
        ry="50"
        stroke="white"
        strokeWidth="0.75"
      />
      <ellipse
        cx="240"
        cy="140"
        rx="170"
        ry="35"
        stroke="white"
        strokeWidth="0.5"
      />
      <ellipse
        cx="240"
        cy="340"
        rx="170"
        ry="35"
        stroke="white"
        strokeWidth="0.5"
      />
      {/* Pole dots */}
      <circle cx="240" cy="20" r="4" fill="white" />
      <circle cx="240" cy="460" r="4" fill="white" />
      {/* Accent dots on globe surface */}
      <circle cx="160" cy="200" r="3" fill="white" />
      <circle cx="320" cy="260" r="3" fill="white" />
      <circle cx="200" cy="310" r="2.5" fill="white" />
      <circle cx="340" cy="180" r="2.5" fill="white" />
      <circle cx="110" cy="260" r="2" fill="white" />
      <circle cx="370" cy="320" r="2" fill="white" />
      {/* Connection lines between dots */}
      <line
        x1="160"
        y1="200"
        x2="320"
        y2="260"
        stroke="white"
        strokeWidth="0.5"
        strokeDasharray="4 4"
      />
      <line
        x1="200"
        y1="310"
        x2="340"
        y2="180"
        stroke="white"
        strokeWidth="0.5"
        strokeDasharray="4 4"
      />
      <line
        x1="110"
        y1="260"
        x2="370"
        y2="320"
        stroke="white"
        strokeWidth="0.5"
        strokeDasharray="4 4"
      />
    </svg>
  );
}

// ─── Data ─────────────────────────────────────────────────────────────────────

const HOW_IT_WORKS = [
  {
    step: "01",
    title: "Join an Organization",
    description:
      "Connect with global chapters, regional coalitions, and advocacy groups that align with your mission and values.",
    icon: <Users size={22} />,
    color: "text-blue-400",
  },
  {
    step: "02",
    title: "Launch a Campaign",
    description:
      "Create campaigns with measurable goals, track signatures on petitions, coordinate calls-to-action, and manage your activist network.",
    icon: <Megaphone size={22} />,
    color: "text-amber-400",
  },
  {
    step: "03",
    title: "Make Change",
    description:
      "Mobilize members across borders. Share resources, coordinate in forums, and turn collective momentum into real-world impact.",
    icon: <Zap size={22} />,
    color: "text-emerald-400",
  },
];

const REGIONS = [
  {
    name: "The Americas",
    description:
      "North, Central & South America — from Anchorage to Ushuaia. Connecting over 120 organizations across 35 nations.",
    flag: "🌎",
    orgs: "120+",
    members: "11,000+",
    color: "from-blue-900/80 to-blue-800/60",
  },
  {
    name: "Europe & Africa",
    description:
      "Spanning the EU, African Union nations, and diaspora communities. A bridge of peoples across two continents.",
    flag: "🌍",
    orgs: "95+",
    members: "9,400+",
    color: "from-emerald-900/80 to-emerald-800/60",
  },
  {
    name: "Asia-Pacific",
    description:
      "From the Pacific Islands to South Asia, East Asia to Central Asia — diverse peoples united by shared civic purpose.",
    flag: "🌏",
    orgs: "85+",
    members: "8,000+",
    color: "from-violet-900/80 to-violet-800/60",
  },
];

const staggerContainer: Variants = {
  hidden: { opacity: 0 },
  visible: { opacity: 1, transition: { staggerChildren: 0.1 } },
};

const fadeUp: Variants = {
  hidden: { opacity: 0, y: 20 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.45 } },
};

export function HomePage() {
  const { t } = useI18n();
  const { isAuthenticated } = useAuth();

  const STATS = [
    {
      label: t.home.statOrgs,
      value: "340+",
      icon: <Globe size={20} />,
      color: "text-blue-500",
    },
    {
      label: t.home.statMembers,
      value: "28,400+",
      icon: <Users size={20} />,
      color: "text-emerald-500",
    },
    {
      label: t.home.statCampaigns,
      value: "120+",
      icon: <Megaphone size={20} />,
      color: "text-amber-500",
    },
    {
      label: t.home.statResources,
      value: "1,200+",
      icon: <BookOpen size={20} />,
      color: "text-violet-500",
    },
  ];

  const FEATURES = [
    {
      title: t.home.feature1Title,
      description: t.home.feature1Desc,
      link: "/organizations",
      label: t.home.feature1Link,
      icon: <Building2Icon />,
    },
    {
      title: t.home.feature2Title,
      description: t.home.feature2Desc,
      link: "/campaigns",
      label: t.home.feature2Link,
      icon: <MegaphoneIcon />,
    },
    {
      title: t.home.feature3Title,
      description: t.home.feature3Desc,
      link: "/forums",
      label: t.home.feature3Link,
      icon: <ForumIcon />,
    },
    {
      title: t.home.feature4Title,
      description: t.home.feature4Desc,
      link: "/resources",
      label: t.home.feature4Link,
      icon: <ResourcesIcon />,
    },
  ];

  return (
    <Layout breadcrumb={t.nav.home} hideFooter>
      {/* ── Hero Section ── */}
      <section className="relative civic-gradient overflow-hidden min-h-[520px] lg:min-h-[580px] flex items-center">
        {/* Globe motif */}
        <GlobeMotif />

        {/* Grid overlay */}
        <div
          className="absolute inset-0 opacity-[0.04]"
          style={{
            backgroundImage: `repeating-linear-gradient(
              0deg,
              transparent,
              transparent 48px,
              oklch(0.96 0.008 250 / 0.4) 48px,
              oklch(0.96 0.008 250 / 0.4) 49px
            ),
            repeating-linear-gradient(
              90deg,
              transparent,
              transparent 48px,
              oklch(0.96 0.008 250 / 0.4) 48px,
              oklch(0.96 0.008 250 / 0.4) 49px
            )`,
          }}
        />

        {/* Gold accent glow — bottom left */}
        <div
          className="absolute bottom-0 left-0 w-96 h-64 pointer-events-none"
          style={{
            background:
              "radial-gradient(ellipse at 0% 100%, oklch(0.78 0.14 85 / 0.12) 0%, transparent 60%)",
          }}
        />

        <div className="relative w-full max-w-6xl mx-auto px-6 py-16 lg:py-24">
          <motion.div
            variants={staggerContainer}
            initial="hidden"
            animate="visible"
            className="max-w-3xl"
          >
            <motion.div variants={fadeUp}>
              <Badge className="mb-6 bg-accent/20 text-accent border border-accent/40 text-xs font-semibold tracking-widest uppercase px-3 py-1">
                {t.home.badge}
              </Badge>
            </motion.div>

            <motion.h1
              variants={fadeUp}
              className="text-5xl lg:text-7xl font-display font-bold text-white leading-[1.05] tracking-tight mb-6"
            >
              {t.home.headline1}
              <br />
              <span
                style={{
                  background:
                    "linear-gradient(90deg, oklch(0.92 0.18 90), oklch(0.78 0.14 85))",
                  WebkitBackgroundClip: "text",
                  WebkitTextFillColor: "transparent",
                  backgroundClip: "text",
                }}
              >
                {t.home.headline2}
              </span>
            </motion.h1>

            <motion.p
              variants={fadeUp}
              className="text-white/65 text-lg lg:text-xl max-w-2xl mb-10 font-body leading-relaxed"
            >
              {t.home.subtext}
            </motion.p>

            <motion.div variants={fadeUp} className="flex flex-wrap gap-3">
              <Button
                asChild
                size="lg"
                className="bg-accent hover:bg-accent/90 text-accent-foreground font-semibold gap-2 h-12 px-6 text-base"
                data-ocid="home.explore_orgs_button"
              >
                <Link to="/organizations">
                  Explore Organizations <ArrowRight size={16} />
                </Link>
              </Button>
              <Button
                asChild
                size="lg"
                className="border-white/30 text-white hover:bg-white/10 bg-transparent gap-2 h-12 px-6 text-base border"
                data-ocid="home.join_campaign_button"
              >
                <Link to="/campaigns">Join a Campaign</Link>
              </Button>
              {!isAuthenticated && (
                <Button
                  asChild
                  size="lg"
                  variant="ghost"
                  className="text-white/70 hover:text-white hover:bg-white/5 gap-2 h-12 px-6 text-base"
                  data-ocid="home.register_free_button"
                >
                  <Link to="/register">Register Free →</Link>
                </Button>
              )}
            </motion.div>
          </motion.div>
        </div>
      </section>

      {/* ── Stats Bar ── */}
      <section className="bg-white border-b border-border">
        <div className="max-w-6xl mx-auto px-6 py-10">
          <motion.div
            variants={staggerContainer}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            className="grid grid-cols-2 lg:grid-cols-4 gap-8 lg:gap-12"
          >
            {STATS.map((stat) => (
              <motion.div
                key={stat.label}
                variants={fadeUp}
                className="flex items-center gap-4"
              >
                <div
                  className={`w-12 h-12 rounded-xl bg-primary/5 flex items-center justify-center flex-shrink-0 ${stat.color}`}
                >
                  {stat.icon}
                </div>
                <div>
                  <p className="text-3xl font-display font-bold text-primary tracking-tight leading-none mb-1">
                    {stat.value}
                  </p>
                  <p className="text-xs text-muted-foreground font-medium">
                    {stat.label}
                  </p>
                </div>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </section>

      {/* ── How It Works ── */}
      <section className="max-w-6xl mx-auto px-6 py-20">
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.45 }}
          className="mb-12 text-center"
        >
          <Badge
            variant="outline"
            className="mb-4 text-xs font-semibold uppercase tracking-widest border-primary/20 text-primary/70"
          >
            Platform
          </Badge>
          <h2 className="text-3xl lg:text-4xl font-display font-bold text-primary tracking-tight mb-4">
            How It Works
          </h2>
          <div className="civic-rule w-16 mx-auto" />
          <p className="mt-6 text-base text-muted-foreground max-w-xl mx-auto leading-relaxed">
            IIIntl One gives independent organizations the tools to collaborate
            globally — from local chapters to international coalitions.
          </p>
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 lg:gap-8">
          {HOW_IT_WORKS.map((step, i) => (
            <motion.div
              key={step.step}
              initial={{ opacity: 0, y: 24 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.12, duration: 0.45 }}
              className="relative group"
            >
              {/* Connector line between cards */}
              {i < HOW_IT_WORKS.length - 1 && (
                <div
                  className="hidden md:block absolute top-10 left-full w-full h-px border-t border-dashed border-border z-0"
                  style={{
                    width: "calc(100% + 2rem)",
                    left: "calc(100% - 1rem)",
                  }}
                />
              )}
              <div className="relative bg-white rounded-2xl border border-border p-8 hover:shadow-md hover:border-primary/20 transition-all duration-300 z-10">
                <div className="flex items-start gap-4 mb-5">
                  <div className="w-14 h-14 rounded-2xl bg-primary flex items-center justify-center flex-shrink-0">
                    <span className={step.color}>{step.icon}</span>
                  </div>
                  <div className="flex-1 pt-1">
                    <span className="text-[10px] font-bold text-muted-foreground/60 tracking-[0.2em] uppercase font-display">
                      Step {step.step}
                    </span>
                    <h3 className="font-display font-bold text-primary text-xl mt-0.5">
                      {step.title}
                    </h3>
                  </div>
                </div>
                <p className="text-sm text-muted-foreground leading-relaxed">
                  {step.description}
                </p>
              </div>
            </motion.div>
          ))}
        </div>
      </section>

      {/* ── Platform Capabilities ── */}
      <section className="bg-secondary/30 border-y border-border">
        <div className="max-w-6xl mx-auto px-6 py-20">
          <motion.div
            initial={{ opacity: 0, y: 16 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.45 }}
            className="mb-12"
          >
            <h2 className="text-3xl lg:text-4xl font-display font-bold text-primary tracking-tight mb-3">
              {t.home.platformCapabilities}
            </h2>
            <div className="civic-rule w-14" />
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
            {FEATURES.map((feature, i) => (
              <motion.div
                key={feature.title}
                initial={{ opacity: 0, y: 16 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.08, duration: 0.4 }}
                className="bg-white rounded-xl border border-border p-6 hover:shadow-md hover:border-primary/20 transition-all duration-200 group flex gap-5"
              >
                <div className="w-10 h-10 rounded-lg bg-primary/5 flex items-center justify-center text-primary flex-shrink-0 mt-0.5 group-hover:bg-primary/10 transition-colors">
                  {feature.icon}
                </div>
                <div className="flex-1 min-w-0">
                  <h3 className="font-display font-bold text-primary text-base mb-1.5">
                    {feature.title}
                  </h3>
                  <p className="text-sm text-muted-foreground mb-4 leading-relaxed">
                    {feature.description}
                  </p>
                  <Link
                    to={feature.link}
                    className="text-sm font-semibold text-accent hover:text-accent/80 flex items-center gap-1.5 transition-colors"
                  >
                    {feature.label} <ArrowRight size={14} />
                  </Link>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* ── Who We Serve ── */}
      <section className="max-w-6xl mx-auto px-6 py-20">
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.45 }}
          className="mb-12 text-center"
        >
          <Badge
            variant="outline"
            className="mb-4 text-xs font-semibold uppercase tracking-widest border-primary/20 text-primary/70"
          >
            Global Reach
          </Badge>
          <h2 className="text-3xl lg:text-4xl font-display font-bold text-primary tracking-tight mb-4">
            Who We Serve
          </h2>
          <div className="civic-rule w-16 mx-auto" />
          <p className="mt-6 text-base text-muted-foreground max-w-xl mx-auto leading-relaxed">
            A platform built for every corner of the world — uniting communities
            across every border, culture, and language.
          </p>
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {REGIONS.map((region, i) => (
            <motion.div
              key={region.name}
              initial={{ opacity: 0, scale: 0.97 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.1, duration: 0.4 }}
              className="relative group overflow-hidden rounded-2xl cursor-default"
            >
              <div
                className={`absolute inset-0 bg-gradient-to-br ${region.color}`}
              />
              <div
                className="absolute inset-0 opacity-20"
                style={{
                  backgroundImage:
                    "radial-gradient(circle at 70% 30%, white 1px, transparent 1px)",
                  backgroundSize: "24px 24px",
                }}
              />
              <div className="relative p-8">
                <div className="text-5xl mb-5">{region.flag}</div>
                <h3 className="font-display font-bold text-white text-2xl mb-3">
                  {region.name}
                </h3>
                <p className="text-white/70 text-sm leading-relaxed mb-6">
                  {region.description}
                </p>
                <div className="flex items-center gap-5">
                  <div>
                    <p className="text-xl font-display font-bold text-white">
                      {region.orgs}
                    </p>
                    <p className="text-[11px] text-white/60 font-medium uppercase tracking-wide">
                      Organizations
                    </p>
                  </div>
                  <div className="w-px h-8 bg-white/20" />
                  <div>
                    <p className="text-xl font-display font-bold text-white">
                      {region.members}
                    </p>
                    <p className="text-[11px] text-white/60 font-medium uppercase tracking-wide">
                      Members
                    </p>
                  </div>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </section>

      {/* ── CTA Banner ── */}
      {!isAuthenticated && (
        <section className="civic-gradient mx-6 mb-16 rounded-2xl overflow-hidden relative">
          <div
            className="absolute inset-0 opacity-[0.04]"
            style={{
              backgroundImage: `repeating-linear-gradient(
                45deg,
                transparent,
                transparent 20px,
                oklch(0.96 0.008 250 / 0.5) 20px,
                oklch(0.96 0.008 250 / 0.5) 21px
              )`,
            }}
          />
          <div className="relative px-8 py-12 lg:py-16 text-center">
            <motion.div
              initial={{ opacity: 0, y: 16 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.45 }}
            >
              <p className="text-white/60 text-sm font-semibold uppercase tracking-widest mb-4">
                Join the Movement
              </p>
              <h2 className="text-3xl lg:text-4xl font-display font-bold text-white mb-4 tracking-tight">
                Ready to make global change?
              </h2>
              <p className="text-white/65 max-w-lg mx-auto mb-8 leading-relaxed">
                Thousands of activists, organizers, and civic leaders are
                already on the platform. Your organization belongs here.
              </p>
              <div className="flex flex-wrap items-center justify-center gap-3">
                <Button
                  asChild
                  size="lg"
                  className="bg-accent hover:bg-accent/90 text-accent-foreground font-semibold gap-2 h-12 px-8"
                  data-ocid="home.cta_register_button"
                >
                  <Link to="/register">
                    Register Free <ArrowRight size={16} />
                  </Link>
                </Button>
                <Button
                  asChild
                  variant="outline"
                  size="lg"
                  className="border-white/30 text-white hover:bg-white/10 bg-transparent h-12 px-8"
                  data-ocid="home.cta_explore_button"
                >
                  <Link to="/organizations">Explore Organizations</Link>
                </Button>
              </div>
              <div className="flex items-center justify-center gap-6 mt-8">
                {[
                  "Free to join",
                  "Multi-lingual",
                  "Global reach",
                  "Open platform",
                ].map((item) => (
                  <div
                    key={item}
                    className="flex items-center gap-1.5 text-white/60 text-xs font-medium"
                  >
                    <CheckCircle2 size={12} className="text-accent" />
                    {item}
                  </div>
                ))}
              </div>
            </motion.div>
          </div>
        </section>
      )}

      {/* ── Full-Width Footer ── */}
      <footer className="border-t border-border bg-primary text-primary-foreground">
        <div className="max-w-6xl mx-auto px-6 py-12">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-10 mb-10">
            {/* Brand */}
            <div className="md:col-span-1">
              <div className="flex items-center gap-2.5 mb-4">
                <div className="w-9 h-9 rounded-lg border border-white/20 flex items-center justify-center">
                  <span className="font-display font-bold text-white text-sm">
                    II
                  </span>
                </div>
                <div>
                  <p className="font-display font-bold text-white text-sm">
                    IIIntl One
                  </p>
                  <p className="text-[9px] text-white/40">
                    Independent · Interdependent
                  </p>
                </div>
              </div>
              <p className="text-xs text-white/50 leading-relaxed max-w-[200px]">
                A global civic platform for independent organizations worldwide.
              </p>
            </div>

            {/* Platform links */}
            <div>
              <p className="text-[10px] font-bold uppercase tracking-widest text-white/40 mb-3">
                Platform
              </p>
              <ul className="space-y-2">
                {[
                  { to: "/organizations", label: "Organizations" },
                  { to: "/campaigns", label: "Campaigns" },
                  { to: "/forums", label: "Forums" },
                  { to: "/activism", label: "Activism Hub" },
                ].map((l) => (
                  <li key={l.to}>
                    <Link
                      to={l.to}
                      className="text-xs text-white/60 hover:text-white transition-colors"
                    >
                      {l.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>

            {/* Resources links */}
            <div>
              <p className="text-[10px] font-bold uppercase tracking-widest text-white/40 mb-3">
                Resources
              </p>
              <ul className="space-y-2">
                {[
                  { to: "/resources", label: "Resource Library" },
                  { to: "/faq", label: "FAQ" },
                  { to: "/docs", label: "Documentation" },
                  { to: "/members", label: "Member Directory" },
                ].map((l) => (
                  <li key={l.to}>
                    <Link
                      to={l.to}
                      className="text-xs text-white/60 hover:text-white transition-colors"
                    >
                      {l.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>

            {/* Commerce links */}
            <div>
              <p className="text-[10px] font-bold uppercase tracking-widest text-white/40 mb-3">
                Commerce
              </p>
              <ul className="space-y-2">
                {[
                  { to: "/store", label: "Global Store" },
                  { to: "/cart", label: "My Orders" },
                ].map((l) => (
                  <li key={l.to}>
                    <Link
                      to={l.to}
                      className="text-xs text-white/60 hover:text-white transition-colors"
                    >
                      {l.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          </div>

          <div className="border-t border-white/10 pt-6 flex flex-col sm:flex-row items-center justify-between gap-3">
            <p className="text-xs text-white/40">
              © {new Date().getFullYear()} IIIntl One Platform — Independent ·
              Interdependent · International
            </p>
            <p className="text-xs text-white/40">
              Built with ♥ using{" "}
              <a
                href={`https://caffeine.ai?utm_source=caffeine-footer&utm_medium=referral&utm_content=${encodeURIComponent(window.location.hostname)}`}
                target="_blank"
                rel="noopener noreferrer"
                className="text-white/60 hover:text-white underline"
              >
                caffeine.ai
              </a>
            </p>
          </div>
        </div>
      </footer>
    </Layout>
  );
}

// ─── Icon components (inline SVG-style using Lucide) ─────────────────────────

function Building2Icon() {
  return (
    <svg
      width="18"
      height="18"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
      role="img"
    >
      <title>Organizations</title>
      <rect width="16" height="20" x="4" y="2" rx="2" ry="2" />
      <path d="M9 22v-4h6v4" />
      <path d="M8 6h.01" />
      <path d="M16 6h.01" />
      <path d="M12 6h.01" />
      <path d="M12 10h.01" />
      <path d="M12 14h.01" />
      <path d="M16 10h.01" />
      <path d="M16 14h.01" />
      <path d="M8 10h.01" />
      <path d="M8 14h.01" />
    </svg>
  );
}

function MegaphoneIcon() {
  return (
    <svg
      width="18"
      height="18"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
      role="img"
    >
      <title>Campaigns</title>
      <path d="m3 11 18-5v12L3 14v-3z" />
      <path d="M11.6 16.8a3 3 0 1 1-5.8-1.6" />
    </svg>
  );
}

function ForumIcon() {
  return (
    <svg
      width="18"
      height="18"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
      role="img"
    >
      <title>Forums</title>
      <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z" />
    </svg>
  );
}

function ResourcesIcon() {
  return (
    <svg
      width="18"
      height="18"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
      role="img"
    >
      <title>Resources</title>
      <path d="M2 3h6a4 4 0 0 1 4 4v14a3 3 0 0 0-3-3H2z" />
      <path d="M22 3h-6a4 4 0 0 0-4 4v14a3 3 0 0 1 3-3h7z" />
    </svg>
  );
}
