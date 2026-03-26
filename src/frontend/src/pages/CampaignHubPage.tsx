import { Layout } from "@/components/Layout";
import { Button } from "@/components/ui/button";
import { Link } from "@tanstack/react-router";
import {
  ArrowRight,
  BookOpen,
  Building2,
  Check,
  Copy,
  Globe,
  Languages,
  Linkedin,
  Megaphone,
  MessageSquare,
  Server,
  ShieldCheck,
  Twitter,
  Zap,
} from "lucide-react";
import { motion } from "motion/react";
import { useState } from "react";
import { toast } from "sonner";

const stats = [
  { label: "5 Languages", icon: <Languages size={14} /> },
  { label: "Multi-Wallet", icon: <Zap size={14} /> },
  { label: "PaaS Ready", icon: <Server size={14} /> },
  { label: "Blockchain Powered", icon: <ShieldCheck size={14} /> },
];

const cards = [
  {
    image: "/assets/generated/hub-organizations.dim_800x500.jpg",
    badgeLabel: "Organizations",
    badgeClass: "bg-blue-100 text-blue-700",
    headline: "Build & Grow Organizations Worldwide",
    description:
      "Create or join organizations spanning borders and time zones. Manage members, set roles, and collaborate on shared goals — all within a secure, permissioned workspace. From local chapters to global coalitions, IIIntl One is your organizational backbone.",
    cta: "Explore Organizations",
    href: "/organizations",
    icon: <Building2 size={16} />,
  },
  {
    image: "/assets/generated/hub-campaigns.dim_800x500.jpg",
    badgeLabel: "Campaigns & Activism",
    badgeClass: "bg-amber-100 text-amber-700",
    headline: "Launch Campaigns That Drive Real Change",
    description:
      "Mobilize supporters, run petitions, and track pledges across your network. Our activism tools empower your members to take measurable action — online and on the ground. Every signature, pledge, and action is recorded on the blockchain.",
    cta: "Start a Campaign",
    href: "/campaigns",
    icon: <Megaphone size={16} />,
  },
  {
    image: "/assets/generated/hub-forums.dim_800x500.jpg",
    badgeLabel: "Community Forums",
    badgeClass: "bg-green-100 text-green-700",
    headline: "Global Dialogue, Local Impact",
    description:
      "Engage in structured, moderated discussions across categories and organizations. Our forums support 5 languages including full RTL for Arabic, ensuring every voice is heard. Build consensus, share knowledge, and strengthen your community.",
    cta: "Join the Conversation",
    href: "/forums",
    icon: <MessageSquare size={16} />,
  },
  {
    image: "/assets/generated/hub-paas.dim_800x500.jpg",
    badgeLabel: "Platform as a Service",
    badgeClass: "bg-purple-100 text-purple-700",
    headline: "Rent the Platform. Own Your Space.",
    description:
      "IIIntl One is available as a fully managed Platform-as-a-Service. Organizations can rent their own private, permissioned instance with isolated data, custom branding, and independent member management — starting from $49/month.",
    cta: "View Pricing Plans",
    href: "/pricing",
    icon: <Server size={16} />,
  },
  {
    image: "/assets/generated/hub-multilingual.dim_800x500.jpg",
    badgeLabel: "Global Reach",
    badgeClass: "bg-teal-100 text-teal-700",
    headline: "One Platform. Five Languages. Zero Barriers.",
    description:
      "Operate in English, Français, Español, العربية (with full RTL layout), or 中文. Language preferences are persisted per user and respected across every corner of the platform. Built for a truly global audience from day one.",
    cta: "See the Platform",
    href: "/",
    icon: <Globe size={16} />,
  },
  {
    image: "/assets/generated/hub-security.dim_800x500.jpg",
    badgeLabel: "Secure Identity",
    badgeClass: "bg-indigo-100 text-indigo-700",
    headline: "Decentralized Identity. Zero Passwords.",
    description:
      "Sign in securely with Internet Identity — ICP's blockchain-native, passwordless authentication system. No usernames, no passwords, no data breaches. Your identity lives on-chain, giving you full sovereignty over your account.",
    cta: "Sign In Securely",
    href: "/login",
    icon: <ShieldCheck size={16} />,
  },
  {
    image: "/assets/generated/hub-knowledge.dim_800x500.jpg",
    badgeLabel: "Knowledge Hub",
    badgeClass: "bg-rose-100 text-rose-700",
    headline: "Resources, Docs & FAQs at Your Fingertips",
    description:
      "Access comprehensive documentation, curated resources, and an ever-growing FAQ library. From onboarding guides to PaaS technical docs, our knowledge base equips every member and administrator with the answers they need.",
    cta: "Explore Resources",
    href: "/resources",
    icon: <BookOpen size={16} />,
  },
];

const containerVariants = {
  hidden: {},
  visible: {
    transition: {
      staggerChildren: 0.1,
    },
  },
};

const cardVariants = {
  hidden: { opacity: 0, y: 32 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.5, ease: "easeOut" as const },
  },
};

export function CampaignHubPage() {
  const [copied, setCopied] = useState(false);

  const shareText = encodeURIComponent(
    "🌍 Discover IIIntl One Platform — a global civic network for independent, interdependent international collaboration. Built on the Internet Computer blockchain. #IIIntlOne #CivicTech #Web3",
  );
  const shareUrl = encodeURIComponent(window.location.href);

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(window.location.href);
      setCopied(true);
      toast.success("Link copied!");
      setTimeout(() => setCopied(false), 2500);
    } catch {
      toast.error("Could not copy link");
    }
  };

  return (
    <Layout breadcrumb="Campaign Hub">
      {/* ── Hero Section ── */}
      <section
        className="relative w-full overflow-hidden"
        style={{ minHeight: "420px" }}
        data-ocid="hub.hero_section"
      >
        {/* Background image */}
        <div
          className="absolute inset-0 bg-cover bg-center"
          style={{
            backgroundImage:
              "url('/assets/generated/hub-hero.dim_1200x500.jpg')",
          }}
        />
        {/* Dark gradient overlay */}
        <div className="absolute inset-0 bg-gradient-to-b from-slate-900/80 via-slate-900/65 to-slate-900/90" />

        {/* Hero content */}
        <div className="relative z-10 flex flex-col items-center justify-center text-center px-4 py-20 md:py-28">
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, ease: "easeOut" }}
            className="mb-4"
          >
            <span className="inline-flex items-center gap-2 bg-white/10 text-white/90 border border-white/20 rounded-full px-4 py-1.5 text-xs font-semibold tracking-widest uppercase backdrop-blur-sm">
              <Globe size={12} />
              Global Civic Network
            </span>
          </motion.div>

          <motion.h1
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, delay: 0.1, ease: "easeOut" }}
            className="font-display text-4xl md:text-6xl font-bold text-white tracking-tight leading-tight max-w-4xl mb-5"
          >
            IIIntl One Platform
          </motion.h1>

          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, delay: 0.2, ease: "easeOut" }}
            className="text-white/75 text-base md:text-xl max-w-2xl leading-relaxed mb-8"
          >
            A Global Civic Network for Independent, Interdependent International
            Collaboration
          </motion.p>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, delay: 0.3, ease: "easeOut" }}
            className="flex flex-col sm:flex-row gap-3 justify-center"
          >
            <Button
              asChild
              size="lg"
              className="bg-white text-slate-900 hover:bg-white/90 font-semibold gap-2 px-6"
              data-ocid="hub.hero_join_button"
            >
              <Link to="/register">
                Join the Movement <ArrowRight size={16} />
              </Link>
            </Button>
            <Button
              asChild
              size="lg"
              variant="outline"
              className="border-white/40 text-white hover:bg-white/10 hover:text-white font-semibold px-6"
              data-ocid="hub.hero_explore_button"
            >
              <Link to="/organizations">Explore Platform</Link>
            </Button>
          </motion.div>
        </div>

        {/* Stats bar */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, delay: 0.5, ease: "easeOut" }}
          className="relative z-10 flex flex-wrap justify-center gap-3 pb-8 px-4"
        >
          {stats.map((stat) => (
            <div
              key={stat.label}
              className="flex items-center gap-2 bg-white/10 backdrop-blur-sm border border-white/20 rounded-full px-4 py-2 text-white text-xs font-semibold"
            >
              {stat.icon}
              {stat.label}
            </div>
          ))}
        </motion.div>
      </section>

      {/* ── Campaign Cards Grid ── */}
      <section className="bg-slate-50 py-16 px-4" data-ocid="hub.cards_section">
        <div className="max-w-6xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 16 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5 }}
            className="text-center mb-12"
          >
            <h2 className="font-display text-3xl md:text-4xl font-bold text-slate-900 mb-3">
              Everything You Need to Organize Globally
            </h2>
            <p className="text-slate-500 text-base max-w-xl mx-auto">
              Discover the powerful modules that power IIIntl One Platform —
              from campaigns to communities, knowledge to commerce.
            </p>
          </motion.div>

          <motion.div
            className="grid grid-cols-1 lg:grid-cols-2 gap-6"
            variants={containerVariants}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: "-60px" }}
          >
            {cards.map((card, index) => (
              <motion.article
                key={card.href + card.badgeLabel}
                variants={cardVariants}
                className="bg-white rounded-xl overflow-hidden shadow-md hover:shadow-xl hover:-translate-y-1 transition-all duration-300 flex flex-col group"
                data-ocid={`hub.section_card.${index + 1}`}
              >
                {/* Card image — acts as visual logo/banner */}
                <div className="relative overflow-hidden">
                  <img
                    src={card.image}
                    alt={card.headline}
                    className="w-full h-52 object-cover group-hover:scale-105 transition-transform duration-500"
                  />
                  {/* Badge overlay */}
                  <div className="absolute top-3 left-3">
                    <span
                      className={`inline-flex items-center gap-1.5 text-xs font-semibold px-3 py-1 rounded-full ${card.badgeClass} backdrop-blur-sm shadow-sm`}
                    >
                      {card.icon}
                      {card.badgeLabel}
                    </span>
                  </div>
                </div>

                {/* Card body */}
                <div className="flex flex-col flex-1 p-6">
                  <h3 className="font-display font-bold text-slate-900 text-xl leading-snug mb-3">
                    {card.headline}
                  </h3>
                  <p className="text-slate-500 text-sm leading-relaxed flex-1 mb-5">
                    {card.description}
                  </p>
                  <Button
                    asChild
                    variant="outline"
                    className="w-full sm:w-auto self-start gap-2 font-semibold border-slate-200 hover:bg-slate-900 hover:text-white hover:border-slate-900 transition-colors"
                    data-ocid={`hub.section_cta.${index + 1}`}
                  >
                    <Link to={card.href}>
                      {card.cta} <ArrowRight size={14} />
                    </Link>
                  </Button>
                </div>
              </motion.article>
            ))}
          </motion.div>
        </div>
      </section>

      {/* ── Social Sharing Bar ── */}
      <section
        className="bg-white border-y border-slate-200 py-10 px-4"
        data-ocid="hub.share_section"
      >
        <div className="max-w-2xl mx-auto text-center">
          <motion.div
            initial={{ opacity: 0, y: 12 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5 }}
          >
            <h3 className="font-display font-bold text-slate-900 text-xl mb-2">
              Share This Platform
            </h3>
            <p className="text-slate-500 text-sm mb-6">
              Help us grow the global civic network — share IIIntl One with your
              organization.
            </p>
            <div className="flex flex-wrap justify-center gap-3">
              <Button
                asChild
                variant="outline"
                className="gap-2 font-semibold border-slate-200 hover:bg-slate-900 hover:text-white hover:border-slate-900 transition-colors"
                data-ocid="hub.share_twitter_button"
              >
                <a
                  href={`https://twitter.com/intent/tweet?text=${shareText}&url=${shareUrl}`}
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  <Twitter size={15} />
                  Share on X
                </a>
              </Button>

              <Button
                asChild
                variant="outline"
                className="gap-2 font-semibold border-slate-200 hover:bg-blue-700 hover:text-white hover:border-blue-700 transition-colors"
                data-ocid="hub.share_linkedin_button"
              >
                <a
                  href={`https://www.linkedin.com/sharing/share-offsite/?url=${shareUrl}`}
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  <Linkedin size={15} />
                  Share on LinkedIn
                </a>
              </Button>

              <Button
                variant="outline"
                className="gap-2 font-semibold border-slate-200 hover:bg-slate-100 transition-colors"
                onClick={handleCopy}
                data-ocid="hub.copy_link_button"
              >
                {copied ? (
                  <>
                    <Check size={15} className="text-green-600" />
                    Copied!
                  </>
                ) : (
                  <>
                    <Copy size={15} />
                    Copy Link
                  </>
                )}
              </Button>
            </div>
          </motion.div>
        </div>
      </section>

      {/* ── Final CTA Footer Banner ── */}
      <section
        className="relative overflow-hidden py-20 px-4"
        data-ocid="hub.cta_section"
      >
        <div className="absolute inset-0 bg-gradient-to-br from-slate-900 via-blue-950 to-slate-900" />
        <div
          className="absolute inset-0 opacity-10"
          style={{
            backgroundImage:
              "radial-gradient(circle at 20% 50%, #3b82f6 0%, transparent 50%), radial-gradient(circle at 80% 20%, #6366f1 0%, transparent 50%)",
          }}
        />
        <div className="relative z-10 max-w-2xl mx-auto text-center">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
          >
            <div className="w-14 h-14 rounded-2xl bg-white/10 border border-white/20 flex items-center justify-center mx-auto mb-6">
              <Globe size={26} className="text-white" />
            </div>
            <h2 className="font-display text-3xl md:text-4xl font-bold text-white mb-4 leading-tight">
              Ready to Join the Global Movement?
            </h2>
            <p className="text-white/60 text-base md:text-lg mb-8 leading-relaxed">
              Create your free account today. No credit card required.
            </p>
            <div className="flex flex-col sm:flex-row gap-3 justify-center">
              <Button
                asChild
                size="lg"
                className="bg-white text-slate-900 hover:bg-white/90 font-semibold gap-2 px-8"
                data-ocid="hub.cta_register_button"
              >
                <Link to="/register">
                  Get Started Free <ArrowRight size={16} />
                </Link>
              </Button>
              <Button
                asChild
                size="lg"
                variant="outline"
                className="border-white/30 text-white hover:bg-white/10 hover:text-white font-semibold px-8"
                data-ocid="hub.cta_docs_button"
              >
                <Link to="/docs">Learn More</Link>
              </Button>
            </div>
          </motion.div>
        </div>
      </section>
    </Layout>
  );
}
