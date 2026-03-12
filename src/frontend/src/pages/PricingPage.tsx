import { Layout } from "@/components/Layout";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { useAuth } from "@/context/AuthContext";
import { Link } from "@tanstack/react-router";
import {
  Building2,
  Check,
  ChevronDown,
  Globe,
  HelpCircle,
  Mail,
  Rocket,
  Shield,
  Zap,
} from "lucide-react";
import { motion } from "motion/react";
import { useState } from "react";

const TIERS = [
  {
    id: "starter",
    name: "Starter",
    price: "$49",
    period: "/month",
    description: "Perfect for small organizations getting started",
    icon: Zap,
    color: "text-emerald-400",
    bgColor: "bg-emerald-500/10",
    borderColor: "border-emerald-500/30",
    badge: null,
    features: [
      "Up to 50 members",
      "1 GB secure storage",
      "All core modules",
      "Campaigns & forums",
      "Multi-lingual support",
      "Community support",
    ],
    cta: "Get Started",
    ctaLink: "/register",
    ocid: "pricing.starter.button",
  },
  {
    id: "organization",
    name: "Organization",
    price: "$299",
    period: "/month",
    description: "Built for growing organizations with advanced needs",
    icon: Building2,
    color: "text-blue-400",
    bgColor: "bg-blue-500/10",
    borderColor: "border-blue-500/30",
    badge: "Most Popular",
    features: [
      "Up to 500 members",
      "10 GB secure storage",
      "All core modules",
      "Priority support",
      "Custom branding",
      "Advanced analytics",
      "Multi-wallet payments",
      "Vendor marketplace",
    ],
    cta: "Get Started",
    ctaLink: "/register",
    ocid: "pricing.org.button",
  },
  {
    id: "enterprise",
    name: "Enterprise",
    price: "$999",
    period: "/month",
    description: "Maximum power for large-scale international operations",
    icon: Globe,
    color: "text-purple-400",
    bgColor: "bg-purple-500/10",
    borderColor: "border-purple-500/30",
    badge: "Full Power",
    features: [
      "Up to 10,000 members",
      "100 GB dedicated storage",
      "Dedicated canister instance",
      "SLA guarantee",
      "White-label option",
      "Dedicated onboarding",
      "Custom domain",
      "Enterprise security",
      "Priority direct support",
    ],
    cta: "Contact Us",
    ctaLink: "/register",
    ocid: "pricing.enterprise.button",
  },
];

const FAQS = [
  {
    q: "What is a tenant?",
    a: "A tenant is your organization's private, isolated space on the IIIntl One Platform. Each tenant gets their own members, campaigns, forums, documents, and store — all independently managed with full role-based access control. Your data is never visible to other tenants.",
  },
  {
    q: "Can I upgrade my plan later?",
    a: "Yes. You can upgrade from Starter to Organization or Enterprise at any time from your Tenant Admin panel. Your data and members are carried over seamlessly, and your new limits take effect immediately after the plan change.",
  },
  {
    q: "How does billing work?",
    a: "We support multiple payment methods: ICP token payments (native to the Internet Computer), Stripe (credit/debit cards in USD, EUR, GBP), and invoice-based billing for enterprise clients. Billing cycles are monthly, and annual prepayment discounts are available on request.",
  },
  {
    q: "Is my organization's data private and secure?",
    a: "Absolutely. All data is scoped to your tenant ID and stored on the Internet Computer blockchain. No other tenant or user can access your organization's data. Enterprise plans include dedicated canister instances for maximum data sovereignty.",
  },
];

function FAQItem({ q, a }: { q: string; a: string }) {
  const [open, setOpen] = useState(false);
  return (
    <div className="border border-border rounded-xl overflow-hidden">
      <button
        type="button"
        onClick={() => setOpen(!open)}
        className="w-full flex items-center justify-between p-5 text-left hover:bg-muted/40 transition-colors"
        data-ocid="pricing.faq.toggle"
      >
        <span className="font-medium text-foreground flex items-center gap-2">
          <HelpCircle size={16} className="text-primary shrink-0" />
          {q}
        </span>
        <ChevronDown
          size={16}
          className={`text-muted-foreground transition-transform duration-200 shrink-0 ${
            open ? "rotate-180" : ""
          }`}
        />
      </button>
      {open && (
        <div className="px-5 pb-5 text-muted-foreground text-sm leading-relaxed border-t border-border pt-4">
          {a}
        </div>
      )}
    </div>
  );
}

export function PricingPage() {
  const { isAuthenticated } = useAuth();
  return (
    <Layout>
      <main className="min-h-screen">
        {/* Hero */}
        <section className="relative py-20 px-4 text-center overflow-hidden">
          <div className="absolute inset-0 bg-gradient-to-b from-primary/5 via-transparent to-transparent pointer-events-none" />
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="relative max-w-3xl mx-auto"
          >
            <div className="inline-flex items-center gap-2 bg-primary/10 border border-primary/20 rounded-full px-4 py-1.5 text-sm text-primary font-medium mb-6">
              <Rocket size={14} />
              Platform as a Service
            </div>
            <h1 className="text-4xl sm:text-5xl font-bold tracking-tight text-foreground mb-4">
              One platform.{" "}
              <span className="text-primary">Every organization.</span>
            </h1>
            <p className="text-lg text-muted-foreground max-w-xl mx-auto">
              Rent your own private, fully-featured IIIntl space. Independent
              operations, isolated data, complete control — backed by the
              Internet Computer.
            </p>
          </motion.div>
        </section>

        {/* Pricing Cards */}
        <section className="px-4 pb-20 max-w-6xl mx-auto">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {TIERS.map((tier, i) => (
              <motion.div
                key={tier.id}
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: i * 0.1 }}
              >
                <Card
                  className={`h-full flex flex-col border-2 ${
                    tier.id === "organization"
                      ? "border-blue-500/50 shadow-lg shadow-blue-500/10"
                      : "border-border"
                  }`}
                >
                  <CardHeader className="pb-4">
                    <div className="flex items-start justify-between mb-3">
                      <div
                        className={`w-10 h-10 rounded-xl ${tier.bgColor} flex items-center justify-center`}
                      >
                        <tier.icon size={20} className={tier.color} />
                      </div>
                      {tier.badge && (
                        <Badge
                          variant="secondary"
                          className="text-xs bg-primary/10 text-primary border-0"
                        >
                          {tier.badge}
                        </Badge>
                      )}
                    </div>
                    <div>
                      <h3 className="text-xl font-bold text-foreground">
                        {tier.name}
                      </h3>
                      <p className="text-sm text-muted-foreground mt-1">
                        {tier.description}
                      </p>
                    </div>
                    <div className="flex items-baseline gap-1 mt-4">
                      <span className="text-4xl font-bold text-foreground">
                        {tier.price}
                      </span>
                      <span className="text-muted-foreground text-sm">
                        {tier.period}
                      </span>
                    </div>
                  </CardHeader>
                  <CardContent className="flex-1 flex flex-col gap-6">
                    <ul className="space-y-2.5">
                      {tier.features.map((feat) => (
                        <li
                          key={feat}
                          className="flex items-center gap-2 text-sm text-foreground"
                        >
                          <Check
                            size={14}
                            className="text-emerald-500 shrink-0"
                          />
                          {feat}
                        </li>
                      ))}
                    </ul>
                    <div className="mt-auto">
                      {tier.id === "enterprise" ? (
                        <a href="mailto:hello@iiintl.org">
                          <Button
                            className="w-full"
                            variant="outline"
                            data-ocid={tier.ocid}
                          >
                            <Mail size={14} className="mr-2" />
                            {tier.cta}
                          </Button>
                        </a>
                      ) : (
                        <Link
                          to={
                            (tier.id === "enterprise"
                              ? tier.ctaLink
                              : isAuthenticated
                                ? "/tenant"
                                : "/register") as "/tenant" | "/register"
                          }
                        >
                          <Button
                            className={`w-full ${
                              tier.id === "organization"
                                ? "bg-primary hover:bg-primary/90"
                                : ""
                            }`}
                            variant={
                              tier.id === "organization" ? "default" : "outline"
                            }
                            data-ocid={tier.ocid}
                          >
                            {tier.cta}
                          </Button>
                        </Link>
                      )}
                    </div>
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </div>
        </section>

        {/* Trust bar */}
        <section className="border-y border-border bg-muted/30 py-10 px-4">
          <div className="max-w-4xl mx-auto grid grid-cols-2 md:grid-cols-4 gap-6 text-center">
            {[
              { icon: Shield, label: "Data isolated per tenant" },
              { icon: Globe, label: "5 languages + RTL" },
              { icon: Building2, label: "Multi-org support" },
              { icon: Zap, label: "Internet Computer powered" },
            ].map(({ icon: Icon, label }) => (
              <div key={label} className="flex flex-col items-center gap-2">
                <Icon size={20} className="text-primary" />
                <span className="text-xs text-muted-foreground font-medium">
                  {label}
                </span>
              </div>
            ))}
          </div>
        </section>

        {/* FAQ */}
        <section className="py-20 px-4 max-w-3xl mx-auto">
          <div className="text-center mb-10">
            <h2 className="text-2xl font-bold text-foreground">
              Common questions
            </h2>
            <p className="text-muted-foreground mt-2">
              Everything you need to know before getting started.
            </p>
          </div>
          <div className="space-y-3">
            {FAQS.map((faq) => (
              <FAQItem key={faq.q} {...faq} />
            ))}
          </div>
        </section>

        <Separator />

        {/* Bottom CTA */}
        <section className="py-16 px-4 text-center">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="max-w-xl mx-auto"
          >
            <h2 className="text-2xl font-bold text-foreground mb-3">
              Ready to launch your organization?
            </h2>
            <p className="text-muted-foreground mb-6">
              Start a free trial — no credit card required.
            </p>
            <Link
              to={
                (isAuthenticated ? "/tenant" : "/register") as
                  | "/tenant"
                  | "/register"
              }
            >
              <Button size="lg" data-ocid="pricing.cta.primary_button">
                <Rocket size={16} className="mr-2" />
                Start Free Trial
              </Button>
            </Link>
          </motion.div>
        </section>
      </main>
    </Layout>
  );
}
