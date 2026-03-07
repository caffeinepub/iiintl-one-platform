import { Layout } from "@/components/Layout";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Link } from "@tanstack/react-router";
import { ArrowRight, BookOpen, Globe, Megaphone, Users } from "lucide-react";
import { motion } from "motion/react";

const STATS = [
  { label: "Member Organizations", value: "340+", icon: <Globe size={18} /> },
  { label: "Active Members", value: "28,400+", icon: <Users size={18} /> },
  { label: "Active Campaigns", value: "120+", icon: <Megaphone size={18} /> },
  {
    label: "Resources Published",
    value: "1,200+",
    icon: <BookOpen size={18} />,
  },
];

const FEATURES = [
  {
    title: "Global Organizations",
    description:
      "Manage and connect with independent organizations worldwide across all regions and causes.",
    link: "/organizations",
    label: "View Organizations",
  },
  {
    title: "Active Campaigns",
    description:
      "Launch, join, and track civic campaigns with real-time participation and impact metrics.",
    link: "/campaigns",
    label: "Browse Campaigns",
  },
  {
    title: "Community Forums",
    description:
      "Engage in structured discussions, share insights, and collaborate across borders.",
    link: "/forums",
    label: "Join the Conversation",
  },
  {
    title: "Knowledge Resources",
    description:
      "Access guides, reports, documentation, and educational material for civic actors.",
    link: "/resources",
    label: "Explore Resources",
  },
];

export function HomePage() {
  return (
    <Layout breadcrumb="Home">
      {/* Hero Section */}
      <section className="relative civic-gradient overflow-hidden">
        <div className="absolute inset-0 opacity-5">
          <div
            className="absolute inset-0"
            style={{
              backgroundImage: `repeating-linear-gradient(
                0deg,
                transparent,
                transparent 40px,
                oklch(0.96 0.008 250 / 0.15) 40px,
                oklch(0.96 0.008 250 / 0.15) 41px
              ),
              repeating-linear-gradient(
                90deg,
                transparent,
                transparent 40px,
                oklch(0.96 0.008 250 / 0.15) 40px,
                oklch(0.96 0.008 250 / 0.15) 41px
              )`,
            }}
          />
        </div>

        <div className="relative max-w-5xl mx-auto px-6 py-20 lg:py-28">
          <motion.div
            initial={{ opacity: 0, y: 24 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, ease: "easeOut" }}
          >
            <Badge className="mb-6 bg-accent/20 text-accent-foreground border border-accent/30 text-xs font-semibold tracking-wide uppercase px-3 py-1">
              Independent · Interdependent · International
            </Badge>
            <h1 className="text-4xl lg:text-6xl font-display font-bold text-white leading-tight tracking-tight mb-6">
              One Platform.
              <br />
              <span
                style={{
                  background:
                    "linear-gradient(90deg, oklch(0.88 0.16 90), oklch(0.78 0.14 85))",
                  WebkitBackgroundClip: "text",
                  WebkitTextFillColor: "transparent",
                  backgroundClip: "text",
                }}
              >
                All People. Worldwide.
              </span>
            </h1>
            <p className="text-white/70 text-lg max-w-2xl mb-8 font-body leading-relaxed">
              IIIntl One is the global civic platform connecting independent
              organizations, activists, and communities across borders.
              Organize, campaign, and act — together.
            </p>
            <div className="flex flex-wrap gap-3">
              <Button
                asChild
                size="lg"
                className="bg-accent hover:bg-accent/90 text-accent-foreground font-semibold gap-2"
              >
                <Link to="/organizations">
                  Explore Organizations <ArrowRight size={16} />
                </Link>
              </Button>
              <Button
                asChild
                variant="outline"
                size="lg"
                className="border-white/30 text-white hover:bg-white/10 bg-transparent gap-2"
              >
                <Link to="/campaigns">View Campaigns</Link>
              </Button>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Stats Bar */}
      <section className="bg-white border-b border-border">
        <div className="max-w-5xl mx-auto px-6 py-8">
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-6">
            {STATS.map((stat, i) => (
              <motion.div
                key={stat.label}
                initial={{ opacity: 0, y: 12 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.1 + i * 0.07, duration: 0.35 }}
                className="flex items-center gap-3"
              >
                <div className="w-10 h-10 rounded-lg bg-primary/5 flex items-center justify-center text-primary">
                  {stat.icon}
                </div>
                <div>
                  <p className="text-xl font-display font-bold text-primary">
                    {stat.value}
                  </p>
                  <p className="text-xs text-muted-foreground">{stat.label}</p>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Feature Cards */}
      <section className="max-w-5xl mx-auto px-6 py-16">
        <div className="mb-10">
          <h2 className="text-2xl font-display font-bold text-primary mb-2">
            Platform Capabilities
          </h2>
          <div className="civic-rule w-12" />
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
          {FEATURES.map((feature, i) => (
            <motion.div
              key={feature.title}
              initial={{ opacity: 0, y: 16 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.08, duration: 0.4 }}
              className="bg-white rounded-xl border border-border p-6 hover:shadow-md hover:border-primary/20 transition-all duration-200 group"
            >
              <h3 className="font-display font-bold text-primary text-lg mb-2 group-hover:text-primary">
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
            </motion.div>
          ))}
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-border bg-white px-6 py-3">
        <p className="text-xs text-muted-foreground text-center">
          © {new Date().getFullYear()} IIIntl One Platform — Independent ·
          Interdependent · International. Built with ♥ using{" "}
          <a
            href={`https://caffeine.ai?utm_source=caffeine-footer&utm_medium=referral&utm_content=${encodeURIComponent(window.location.hostname)}`}
            target="_blank"
            rel="noopener noreferrer"
            className="text-primary hover:underline"
          >
            caffeine.ai
          </a>
        </p>
      </footer>
    </Layout>
  );
}
