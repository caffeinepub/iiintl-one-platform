import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Link } from "@tanstack/react-router";
import {
  ArrowRight,
  Check,
  Globe,
  Star,
  Store,
  TrendingUp,
  Users,
  X,
  Zap,
} from "lucide-react";
import { motion } from "motion/react";
import { useEffect, useRef, useState } from "react";

const TIERS = [
  {
    level: "Free",
    color: "bg-slate-500",
    dues: "$0",
    depth: "—",
    royalty: false,
    fsu: false,
    events: false,
  },
  {
    level: "Associate",
    color: "bg-blue-500",
    dues: "$9/mo",
    depth: "1 level",
    royalty: false,
    fsu: false,
    events: true,
  },
  {
    level: "Affiliate",
    color: "bg-teal-500",
    dues: "$29/mo",
    depth: "2 levels",
    royalty: false,
    fsu: true,
    events: true,
  },
  {
    level: "Partner",
    color: "bg-purple-500",
    dues: "$79/mo",
    depth: "3 levels",
    royalty: false,
    fsu: true,
    events: true,
  },
  {
    level: "Executive",
    color: "bg-orange-500",
    dues: "$149/mo",
    depth: "4 levels",
    royalty: true,
    fsu: true,
    events: true,
  },
  {
    level: "Ambassador",
    color: "bg-yellow-500",
    dues: "$299/mo",
    depth: "5 levels",
    royalty: true,
    fsu: true,
    events: true,
  },
  {
    level: "Founder",
    color: "bg-red-500",
    dues: "$499/mo",
    depth: "6 levels",
    royalty: true,
    fsu: true,
    events: true,
  },
];

const FEATURES = [
  {
    icon: Users,
    title: "Multi-Org Collaboration",
    desc: "Join or lead organizations across the globe. Coordinate campaigns, share resources, and build civic coalitions that span borders.",
    color: "text-blue-500",
    bg: "bg-blue-50 dark:bg-blue-950/30",
  },
  {
    icon: Zap,
    title: "Campaign & Activism Tools",
    desc: "Launch petitions, organize pledges, and mobilize communities. Real-time activism infrastructure built for impact at scale.",
    color: "text-teal-500",
    bg: "bg-teal-50 dark:bg-teal-950/30",
  },
  {
    icon: Store,
    title: "Multi-Vendor Store",
    desc: "Shop or sell in a global marketplace. Multi-currency support with ICP, USD, EUR, and GBP ensures everyone can participate.",
    color: "text-purple-500",
    bg: "bg-purple-50 dark:bg-purple-950/30",
  },
  {
    icon: TrendingUp,
    title: "FinFracFran™ Rewards",
    desc: "Every transaction generates a micro-share that propagates fractally through the network. Earn simply by being an active member.",
    color: "text-yellow-500",
    bg: "bg-yellow-50 dark:bg-yellow-950/30",
  },
];

export function ReferralLandingPage() {
  const [refCode, setRefCode] = useState<string | null>(null);
  const featuresRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const ref = params.get("ref");
    if (ref) setRefCode(ref);
  }, []);

  const registerHref = refCode
    ? `/register?ref=${encodeURIComponent(refCode)}`
    : "/register";

  const scrollToFeatures = () => {
    featuresRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  return (
    <div className="min-h-screen bg-background text-foreground">
      {/* Nav */}
      <header className="sticky top-0 z-50 border-b border-border/50 bg-background/80 backdrop-blur-md">
        <div className="max-w-6xl mx-auto px-6 h-16 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-lg civic-gradient flex items-center justify-center">
              <span className="text-white font-bold text-sm">II</span>
            </div>
            <span className="font-display font-bold text-primary text-base">
              IIIntl One
            </span>
          </div>
          <div className="flex items-center gap-3">
            <Link to="/login">
              <Button variant="ghost" size="sm">
                Sign In
              </Button>
            </Link>
            <Link to={registerHref}>
              <Button size="sm" data-ocid="referral.primary_button">
                Join Now <ArrowRight size={14} className="ml-1" />
              </Button>
            </Link>
          </div>
        </div>
      </header>

      {/* Hero */}
      <section className="relative overflow-hidden">
        <div className="absolute inset-0 civic-gradient opacity-10 pointer-events-none" />
        <div className="relative max-w-6xl mx-auto px-6 py-24 md:py-36 text-center">
          {refCode && (
            <motion.div
              initial={{ opacity: 0, y: -8 }}
              animate={{ opacity: 1, y: 0 }}
              className="inline-flex items-center gap-2 bg-primary/10 border border-primary/20 text-primary rounded-full px-4 py-1.5 text-sm font-medium mb-6"
            >
              <Star size={14} className="fill-current" />
              You were invited by a member — referral code:{" "}
              <code className="font-mono font-bold">{refCode}</code>
            </motion.div>
          )}

          <motion.h1
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="text-4xl md:text-6xl font-display font-bold text-primary leading-tight mb-6"
          >
            Join the Global Movement
          </motion.h1>

          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.1 }}
            className="text-lg md:text-xl text-muted-foreground max-w-2xl mx-auto mb-10"
          >
            IIIntl One Platform connects organizations, campaigns, and
            individuals in a borderless civic ecosystem — with built-in rewards
            that grow with your network.
          </motion.p>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.2 }}
            className="flex flex-wrap justify-center gap-4"
          >
            <Link to={registerHref}>
              <Button
                size="lg"
                className="px-8 text-base"
                data-ocid="referral.hero_primary_button"
              >
                Join Now — It&apos;s Free{" "}
                <ArrowRight size={16} className="ml-2" />
              </Button>
            </Link>
            <Button
              size="lg"
              variant="outline"
              className="px-8 text-base"
              onClick={scrollToFeatures}
              data-ocid="referral.learn_more_button"
            >
              Learn More
            </Button>
          </motion.div>

          <div className="mt-14 flex flex-wrap justify-center gap-8 text-sm text-muted-foreground">
            <div className="flex items-center gap-2">
              <Globe size={14} />
              <span>80+ countries</span>
            </div>
            <div className="flex items-center gap-2">
              <Users size={14} />
              <span>340+ organizations</span>
            </div>
            <div className="flex items-center gap-2">
              <Star size={14} />
              <span>7 membership tiers</span>
            </div>
          </div>
        </div>
      </section>

      {/* Features */}
      <section ref={featuresRef} className="py-20 bg-muted/30">
        <div className="max-w-6xl mx-auto px-6">
          <motion.div
            initial={{ opacity: 0, y: 16 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-12"
          >
            <h2 className="text-3xl font-display font-bold text-primary mb-3">
              Everything You Need to Make Impact
            </h2>
            <p className="text-muted-foreground text-lg">
              A complete platform for civic action, community building, and
              shared prosperity.
            </p>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {FEATURES.map((f, i) => (
              <motion.div
                key={f.title}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.1 }}
              >
                <Card className="h-full border-border/60 hover:shadow-md transition-shadow">
                  <CardContent className="p-6">
                    <div
                      className={`w-12 h-12 rounded-xl ${f.bg} flex items-center justify-center mb-4`}
                    >
                      <f.icon size={22} className={f.color} />
                    </div>
                    <h3 className="font-display font-semibold text-lg text-foreground mb-2">
                      {f.title}
                    </h3>
                    <p className="text-muted-foreground text-sm leading-relaxed">
                      {f.desc}
                    </p>
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Tier Table */}
      <section className="py-20">
        <div className="max-w-6xl mx-auto px-6">
          <motion.div
            initial={{ opacity: 0, y: 16 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-12"
          >
            <h2 className="text-3xl font-display font-bold text-primary mb-3">
              Membership Tiers
            </h2>
            <p className="text-muted-foreground text-lg">
              Start free. Upgrade as your network grows.
            </p>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 16 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="overflow-x-auto rounded-xl border border-border/60"
            data-ocid="referral.table"
          >
            <Table>
              <TableHeader>
                <TableRow className="bg-muted/50">
                  <TableHead className="font-semibold">Tier</TableHead>
                  <TableHead className="font-semibold">Monthly Dues</TableHead>
                  <TableHead className="font-semibold">
                    Commission Depth
                  </TableHead>
                  <TableHead className="font-semibold text-center">
                    Royalty Pool
                  </TableHead>
                  <TableHead className="font-semibold text-center">
                    FinFracFran™ FSU
                  </TableHead>
                  <TableHead className="font-semibold text-center">
                    Event Commissions
                  </TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {TIERS.map((tier, i) => (
                  <TableRow
                    key={tier.level}
                    data-ocid={`referral.item.${i + 1}`}
                    className="hover:bg-muted/30"
                  >
                    <TableCell>
                      <div className="flex items-center gap-2">
                        <span
                          className={`w-3 h-3 rounded-full ${tier.color}`}
                        />
                        <span className="font-medium">{tier.level}</span>
                      </div>
                    </TableCell>
                    <TableCell className="text-muted-foreground">
                      {tier.dues}
                    </TableCell>
                    <TableCell className="text-muted-foreground">
                      {tier.depth}
                    </TableCell>
                    <TableCell className="text-center">
                      {tier.royalty ? (
                        <Check size={16} className="mx-auto text-emerald-500" />
                      ) : (
                        <X
                          size={16}
                          className="mx-auto text-muted-foreground/40"
                        />
                      )}
                    </TableCell>
                    <TableCell className="text-center">
                      {tier.fsu ? (
                        <Check size={16} className="mx-auto text-emerald-500" />
                      ) : (
                        <X
                          size={16}
                          className="mx-auto text-muted-foreground/40"
                        />
                      )}
                    </TableCell>
                    <TableCell className="text-center">
                      {tier.events ? (
                        <Check size={16} className="mx-auto text-emerald-500" />
                      ) : (
                        <X
                          size={16}
                          className="mx-auto text-muted-foreground/40"
                        />
                      )}
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </motion.div>
        </div>
      </section>

      {/* FinFracFran Spotlight */}
      <section className="py-20 bg-muted/30">
        <div className="max-w-6xl mx-auto px-6">
          <motion.div
            initial={{ opacity: 0, scale: 0.98 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            className="rounded-2xl p-8 md:p-12 text-center"
            style={{
              background:
                "linear-gradient(135deg, oklch(0.55 0.15 65), oklch(0.50 0.18 50), oklch(0.45 0.12 30))",
            }}
          >
            <div className="inline-flex items-center justify-center w-14 h-14 rounded-full bg-white/20 mb-6">
              <TrendingUp size={24} className="text-white" />
            </div>
            <h2 className="text-3xl md:text-4xl font-display font-bold text-white mb-4">
              FinFracFran™ Fractal Economics
            </h2>
            <p className="text-white/80 text-lg max-w-3xl mx-auto mb-6 leading-relaxed">
              <strong className="text-white">
                Financial Fractal Franchise
              </strong>{" "}
              — every transaction on the platform contributes a micro-share to a
              pool that distributes fractally across the entire active
              membership. The deeper and more active your network, the larger
              your proportional share.
            </p>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-8 text-left">
              {[
                {
                  title: "Earn Passively",
                  desc: "Every purchase by any member generates FSU units credited to your account",
                },
                {
                  title: "Accumulate FSUs",
                  desc: "Franchise Share Units represent your fractional stake in platform revenue",
                },
                {
                  title: "Redeem Anytime",
                  desc: "Convert FSUs to ICP, extend your membership, or gift them to teammates",
                },
              ].map((item) => (
                <div key={item.title} className="bg-white/10 rounded-xl p-4">
                  <h4 className="text-white font-semibold mb-1">
                    {item.title}
                  </h4>
                  <p className="text-white/70 text-sm">{item.desc}</p>
                </div>
              ))}
            </div>
          </motion.div>
        </div>
      </section>

      {/* Footer CTA */}
      <section className="py-20">
        <div className="max-w-2xl mx-auto px-6 text-center">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
          >
            {refCode ? (
              <>
                <Badge variant="secondary" className="mb-4 text-sm px-4 py-1.5">
                  🎟️ Referral code:{" "}
                  <code className="font-mono font-bold ml-1">{refCode}</code>
                </Badge>
                <h2 className="text-3xl font-display font-bold text-primary mb-3">
                  You&apos;re one step away
                </h2>
                <p className="text-muted-foreground mb-8">
                  Your referral code will be automatically applied when you
                  create your account. Your sponsor earns a bonus when you join
                  — and so will you when you share your own link.
                </p>
              </>
            ) : (
              <>
                <h2 className="text-3xl font-display font-bold text-primary mb-3">
                  Ready to join the movement?
                </h2>
                <p className="text-muted-foreground mb-8">
                  Create your free account today and start building connections
                  that matter.
                </p>
              </>
            )}

            <Link to={registerHref}>
              <Button
                size="lg"
                className="w-full max-w-sm text-base h-14"
                data-ocid="referral.footer_primary_button"
              >
                Create Your Account <ArrowRight size={18} className="ml-2" />
              </Button>
            </Link>

            <p className="mt-4 text-xs text-muted-foreground">
              Already have an account?{" "}
              <Link
                to="/login"
                className="text-primary underline underline-offset-2"
              >
                Sign in
              </Link>
            </p>
          </motion.div>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-border/50 py-8">
        <div className="max-w-6xl mx-auto px-6 flex flex-col md:flex-row items-center justify-between gap-4 text-sm text-muted-foreground">
          <span>
            © {new Date().getFullYear()}. Built with ♥ using{" "}
            <a
              href={`https://caffeine.ai?utm_source=caffeine-footer&utm_medium=referral&utm_content=${encodeURIComponent(window.location.hostname)}`}
              target="_blank"
              rel="noopener noreferrer"
              className="text-primary hover:underline"
            >
              caffeine.ai
            </a>
          </span>
          <div className="flex gap-4">
            <Link
              to="/legal/privacy"
              className="hover:text-foreground transition-colors"
            >
              Privacy
            </Link>
            <Link
              to="/legal/terms"
              className="hover:text-foreground transition-colors"
            >
              Terms
            </Link>
            <Link
              to="/legal/sla"
              className="hover:text-foreground transition-colors"
            >
              SLA
            </Link>
          </div>
        </div>
      </footer>
    </div>
  );
}
