import { Layout } from "@/components/Layout";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { FileText } from "lucide-react";

export function TermsOfServicePage() {
  const lastUpdated = "March 2026";

  const sections = [
    {
      id: "1",
      title: "1. Acceptance of Terms",
      content: (
        <p>
          By accessing or using IIIntl One Platform, you agree to be bound by
          these Terms of Service. If you do not agree to these Terms, you must
          discontinue use of the Platform immediately. These Terms constitute a
          legally binding agreement between you and the Platform operator. Your
          continued use of the Platform following any updates to these Terms
          constitutes your acceptance of the revised agreement.
        </p>
      ),
    },
    {
      id: "2",
      title: "2. Definitions",
      content: (
        <div className="space-y-3">
          <div>
            <h4 className="font-semibold text-foreground">2.1 Platform</h4>
            <p className="mt-1">
              "Platform" means IIIntl One Platform and all associated services,
              interfaces, tools, APIs, and infrastructure provided by the
              Platform operator.
            </p>
          </div>
          <div>
            <h4 className="font-semibold text-foreground">2.2 User</h4>
            <p className="mt-1">
              "User" means any individual who accesses or uses the Platform,
              whether registered or not.
            </p>
          </div>
          <div>
            <h4 className="font-semibold text-foreground">2.3 Organization</h4>
            <p className="mt-1">
              "Organization" means a group or entity created or managed within
              the Platform by one or more registered users.
            </p>
          </div>
          <div>
            <h4 className="font-semibold text-foreground">2.4 Tenant</h4>
            <p className="mt-1">
              "Tenant" means an organization renting the Platform under the
              Platform-as-a-Service (PaaS) model, with its own private space,
              member management, and operational independence.
            </p>
          </div>
          <div>
            <h4 className="font-semibold text-foreground">2.5 PaaS Client</h4>
            <p className="mt-1">
              "PaaS Client" means a paying subscriber to the
              Platform-as-a-Service offering, operating as a Tenant under one of
              the available subscription tiers.
            </p>
          </div>
        </div>
      ),
    },
    {
      id: "3",
      title: "3. Eligibility & Account Registration",
      content: (
        <>
          <p>
            You must be at least 13 years of age to use the Platform. In
            jurisdictions where a higher minimum age applies for digital
            services (such as 16 years in certain EU member states under GDPR),
            the higher age threshold applies. By registering, you represent and
            warrant that you meet the applicable age requirement.
          </p>
          <p className="mt-3">
            Authentication is provided via Internet Identity by ICP, the primary
            sign-in method for the Platform. You are responsible for maintaining
            the security of your authentication credentials and for all activity
            conducted under your account. You agree to notify the Platform
            operator immediately of any unauthorized use of your account.
          </p>
        </>
      ),
    },
    {
      id: "4",
      title: "4. Acceptable Use Policy",
      content: (
        <div className="space-y-4">
          <div>
            <h4 className="font-semibold text-foreground">
              4.1 Prohibited Conduct
            </h4>
            <p className="mt-1">
              The following activities are strictly prohibited on the Platform:
              illegal activities of any kind; harassment, bullying, or
              threatening behavior; hate speech targeting individuals or groups
              based on protected characteristics; unsolicited commercial
              messages (spam); distribution of malware, viruses, or harmful
              code; impersonating other users, organizations, or the Platform
              operator; unauthorized collection, scraping, or harvesting of user
              data; and any activity that interferes with the normal operation
              of the Platform.
            </p>
          </div>
          <div>
            <h4 className="font-semibold text-foreground">
              4.2 Civic & Community Standards
            </h4>
            <p className="mt-1">
              All content posted on the Platform must be respectful, lawful, and
              consistent with the Platform's civic mission of independent,
              interdependent, and international collaboration. Content that
              undermines civil discourse, democratic principles, or the peaceful
              operation of civil society organizations is not permitted.
            </p>
          </div>
          <div>
            <h4 className="font-semibold text-foreground">
              4.3 Multi-Organization Responsibilities
            </h4>
            <p className="mt-1">
              Users who create or manage organizations within the Platform are
              responsible for their organization's compliance with these Terms,
              including the conduct of all members they add or invite. If your
              organization violates these Terms, the Platform operator may take
              action against the organization and its administrators.
            </p>
          </div>
        </div>
      ),
    },
    {
      id: "5",
      title: "5. Intellectual Property",
      content: (
        <div className="space-y-4">
          <div>
            <h4 className="font-semibold text-foreground">
              5.1 Platform Ownership
            </h4>
            <p className="mt-1">
              All Platform code, design, user interface, infrastructure,
              trademarks, and documentation are owned by or licensed to the
              Platform operator. Nothing in these Terms transfers any
              intellectual property rights to users. You may not copy,
              reproduce, distribute, or create derivative works from any
              Platform content without prior written permission.
            </p>
          </div>
          <div>
            <h4 className="font-semibold text-foreground">
              5.2 User-Generated Content License
            </h4>
            <p className="mt-1">
              By posting, uploading, or submitting content to the Platform, you
              grant the Platform operator a non-exclusive, royalty-free,
              worldwide license to store, display, distribute, and process that
              content within the Platform for the purpose of service delivery.
              You retain ownership of your content. This license terminates when
              you remove your content or close your account, subject to any
              technical or legal retention obligations.
            </p>
          </div>
        </div>
      ),
    },
    {
      id: "6",
      title: "6. Free / General User Terms",
      content: (
        <div className="space-y-4">
          <div>
            <h4 className="font-semibold text-foreground">
              6.1 No-Cost Access Scope
            </h4>
            <p className="mt-1">
              Free accounts provide access to core Platform features including
              organization participation, campaign engagement, forum
              contributions, resource browsing, activism tools, and community
              directories, subject to availability and fair use limits.
            </p>
          </div>
          <div>
            <h4 className="font-semibold text-foreground">
              6.2 Service Availability
            </h4>
            <p className="mt-1">
              Free tier access is provided on a best-effort basis. The Platform
              operator makes no uptime guarantees for free accounts. Scheduled
              or unscheduled maintenance may affect availability without prior
              notice.
            </p>
          </div>
          <div>
            <h4 className="font-semibold text-foreground">
              6.3 Feature Limitations
            </h4>
            <p className="mt-1">
              Certain features are reserved for paying subscribers and are not
              available on free accounts. These include advanced analytics, PaaS
              tenant management, white-label branding, dedicated storage
              allocations, and access to the Tenant Admin portal. Free users may
              upgrade to a paid tier at any time via the Pricing page.
            </p>
          </div>
        </div>
      ),
    },
    {
      id: "7",
      title: "7. Paying Client Terms (PaaS Tenants)",
      content: (
        <div className="space-y-4">
          <div>
            <h4 className="font-semibold text-foreground">
              7.1 Subscription Tiers
            </h4>
            <p className="mt-1">
              Three subscription tiers are available: <strong>Starter</strong>{" "}
              ($49/month, up to 50 members, 1 GB storage),{" "}
              <strong>Organization</strong> ($299/month, up to 500 members, 10
              GB storage), and <strong>Enterprise</strong> ($999/month, up to
              10,000 members, 100 GB storage). Specific feature availability and
              limits are detailed on the Pricing page and subject to change with
              reasonable notice.
            </p>
          </div>
          <div>
            <h4 className="font-semibold text-foreground">
              7.2 Payment Obligations
            </h4>
            <p className="mt-1">
              Subscription fees are billed monthly. Payment is accepted via
              Stripe (credit and debit cards in supported currencies) or via ICP
              token transfer for crypto-native clients. Enterprise clients may
              arrange invoice-based payment. Payment is due at the start of each
              billing cycle. Failure to pay may result in service restriction or
              suspension.
            </p>
          </div>
          <div>
            <h4 className="font-semibold text-foreground">
              7.3 Auto-Renewal & Cancellation
            </h4>
            <p className="mt-1">
              Subscriptions automatically renew at the end of each billing cycle
              unless cancelled before the renewal date. Cancellation can be
              initiated at any time from the Tenant Admin portal. Access
              continues until the end of the current paid period, after which
              the account transitions to an inactive state.
            </p>
          </div>
          <div>
            <h4 className="font-semibold text-foreground">7.4 Refund Policy</h4>
            <p className="mt-1">
              All subscription payments are non-refundable except where required
              by applicable law. If you believe a billing error has occurred,
              contact Platform support within 30 days of the charge. Legitimate
              billing errors will be investigated and, where confirmed,
              corrected or refunded at the Platform operator's discretion.
            </p>
          </div>
          <div>
            <h4 className="font-semibold text-foreground">
              7.5 Overage Charges
            </h4>
            <p className="mt-1">
              Usage exceeding your tier's member or storage limits may result in
              overage fees or temporary service restriction. You will be
              notified via the Platform's notification system before any overage
              charges are applied. Upgrading your tier will immediately expand
              your available limits.
            </p>
          </div>
          <div>
            <h4 className="font-semibold text-foreground">7.6 Trial Period</h4>
            <p className="mt-1">
              A 14-day free trial is available for new Tenant registrations. No
              payment information is required during the trial period. At the
              end of the trial, continued access requires selecting a
              subscription tier and completing payment. Trial access may be
              modified or terminated by the Platform operator at its discretion
              without liability.
            </p>
          </div>
        </div>
      ),
    },
    {
      id: "8",
      title: "8. Tenant Responsibilities",
      content: (
        <div className="space-y-4">
          <div>
            <h4 className="font-semibold text-foreground">
              8.1 Member Management
            </h4>
            <p className="mt-1">
              Tenant owners are solely responsible for adding, managing, and
              removing members within their tenant space. The Platform operator
              is not responsible for unauthorized access, data breaches, or
              other harms arising from tenant-managed permissions, role
              assignments, or member onboarding decisions.
            </p>
          </div>
          <div>
            <h4 className="font-semibold text-foreground">
              8.2 Content Responsibility
            </h4>
            <p className="mt-1">
              Tenants are responsible for all content posted, uploaded, or
              shared by their members within the tenant space. All content must
              comply with these Terms of Service and applicable laws. The
              Platform operator may remove content that violates these Terms
              regardless of the tenant's approval.
            </p>
          </div>
          <div>
            <h4 className="font-semibold text-foreground">
              8.3 Legal Compliance
            </h4>
            <p className="mt-1">
              Tenants must comply with all applicable laws and regulations in
              their own jurisdiction and in the jurisdictions of their members.
              This includes, without limitation, data protection and privacy
              laws (such as GDPR, CCPA, or equivalent), employment laws,
              anti-spam regulations, and any sector-specific compliance
              requirements relevant to the tenant's operations.
            </p>
          </div>
        </div>
      ),
    },
    {
      id: "9",
      title: "9. Platform Owner Rights",
      content: (
        <div className="space-y-4">
          <div>
            <h4 className="font-semibold text-foreground">
              9.1 Suspension & Termination
            </h4>
            <p className="mt-1">
              The Platform operator reserves the right to suspend or terminate
              any user account or tenant subscription at any time for violation
              of these Terms, non-payment of fees, conduct that endangers the
              Platform or other users, or for any other reason at the Platform
              operator's reasonable discretion. Where possible, advance notice
              will be provided.
            </p>
          </div>
          <div>
            <h4 className="font-semibold text-foreground">
              9.2 Content Moderation
            </h4>
            <p className="mt-1">
              The Platform reserves the right to review, modify, or remove any
              content that violates these Terms, applicable law, or community
              standards. Content moderation decisions are final and may be
              exercised without prior notice.
            </p>
          </div>
          <div>
            <h4 className="font-semibold text-foreground">
              9.3 Platform Modifications
            </h4>
            <p className="mt-1">
              The Platform may add, modify, or discontinue features or services
              at any time. Material changes that significantly affect paying
              clients will be communicated with reasonable advance notice via
              the Platform's notification system or direct communication.
            </p>
          </div>
        </div>
      ),
    },
    {
      id: "10",
      title: "10. Disclaimers & Limitation of Liability",
      content: (
        <>
          <p>
            The Platform is provided "as is" and "as available" without
            warranties of any kind, whether express, implied, or statutory,
            including warranties of merchantability, fitness for a particular
            purpose, or non-infringement. The Platform operator does not warrant
            that the Platform will be uninterrupted, error-free, or free of
            harmful components.
          </p>
          <p className="mt-3">
            To the maximum extent permitted by applicable law, the Platform
            operator is not liable for any indirect, incidental, consequential,
            special, exemplary, or punitive damages arising from or related to
            your use of or inability to use the Platform, even if advised of the
            possibility of such damages.
          </p>
          <p className="mt-3">
            In no event shall the Platform operator's total liability to you for
            all claims exceed the total fees paid by you to the Platform in the
            three (3) months immediately preceding the event giving rise to the
            claim.
          </p>
          <p className="mt-3">
            The Internet Computer network is operated by DFINITY Foundation and
            independent node providers. The Platform operator assumes no
            liability for outages, data loss, or service disruptions arising
            from ICP protocol-level events outside its control.
          </p>
        </>
      ),
    },
    {
      id: "11",
      title: "11. Indemnification",
      content: (
        <p>
          You agree to indemnify, defend, and hold harmless the Platform
          operator and its officers, directors, employees, agents, and
          affiliates from and against any and all claims, liabilities, damages,
          losses, costs, and expenses (including reasonable legal fees) arising
          out of or related to: your use of or access to the Platform; content
          you post, submit, or transmit through the Platform; your violation of
          these Terms; your violation of any applicable law or regulation; or
          your violation of any third-party rights.
        </p>
      ),
    },
    {
      id: "12",
      title: "12. Governing Law & Dispute Resolution",
      content: (
        <>
          <p>
            These Terms of Service are governed by and construed in accordance
            with the laws applicable to the Platform operator's jurisdiction,
            without regard to conflict of law principles.
          </p>
          <p className="mt-3">
            In the event of a dispute arising from or relating to these Terms or
            your use of the Platform, the parties agree to first attempt
            informal resolution by contacting Platform support with a written
            description of the dispute. The Platform operator will make
            reasonable efforts to resolve the dispute within 30 days.
          </p>
          <p className="mt-3">
            If informal resolution fails, disputes shall be submitted to binding
            arbitration or resolved through the competent courts in the
            applicable jurisdiction. Nothing in this section prevents either
            party from seeking emergency injunctive relief where necessary.
          </p>
        </>
      ),
    },
    {
      id: "13",
      title: "13. Modifications to Terms",
      content: (
        <p>
          The Platform operator reserves the right to modify these Terms of
          Service at any time. When material changes are made, users will be
          notified via the Platform's notification system and the "Last Updated"
          date on this page will be revised. Continued use of the Platform after
          changes are posted constitutes your acceptance of the revised Terms.
          If you do not agree to the revised Terms, you must discontinue use of
          the Platform.
        </p>
      ),
    },
    {
      id: "14",
      title: "14. Contact & Notices",
      content: (
        <p>
          For legal notices, billing disputes, Terms-related inquiries, or
          account termination requests, please contact us through the Platform's
          support channels available in the Help section, or via the contact
          information listed on the Platform's official homepage. Legal notices
          of a formal nature should be submitted in writing and directed to the
          Platform operator's registered address. We aim to acknowledge all
          formal legal notices within 10 business days.
        </p>
      ),
    },
  ];

  return (
    <Layout>
      <div className="max-w-4xl mx-auto px-4 py-10" data-ocid="terms.page">
        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center gap-3 mb-4">
            <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center">
              <FileText className="w-5 h-5 text-primary" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h1 className="text-2xl font-display font-bold text-foreground">
                  Terms of Service
                </h1>
                <Badge variant="outline" className="text-xs">
                  All Users & Paying Clients
                </Badge>
              </div>
              <p className="text-sm text-muted-foreground">
                Last updated: {lastUpdated}
              </p>
            </div>
          </div>
          <p className="text-muted-foreground leading-relaxed">
            These Terms of Service govern your use of IIIntl One Platform,
            including all free and paying accounts, tenant organizations, and
            Platform-as-a-Service clients. Please read these Terms carefully
            before using the Platform.
          </p>
        </div>

        {/* Paying Client Highlight */}
        <div className="mb-8 p-4 bg-amber-50 border border-amber-200 rounded-lg">
          <div className="flex items-start gap-3">
            <span className="text-amber-600 text-lg">⚠</span>
            <div>
              <p className="text-sm font-semibold text-amber-800">
                Important Notice for PaaS Clients & Paying Subscribers
              </p>
              <p className="text-sm text-amber-700 mt-1">
                If you are a paying subscriber or PaaS Tenant, please pay
                particular attention to{" "}
                <a
                  href="#section-7"
                  className="underline font-medium hover:text-amber-900"
                >
                  Section 7 (Paying Client Terms)
                </a>{" "}
                and{" "}
                <a
                  href="#section-8"
                  className="underline font-medium hover:text-amber-900"
                >
                  Section 8 (Tenant Responsibilities)
                </a>
                , which contain billing, subscription, cancellation, refund, and
                compliance obligations specific to your account type.
              </p>
            </div>
          </div>
        </div>

        <Separator className="mb-8" />

        {/* Table of Contents */}
        <div
          className="mb-8 p-4 bg-muted/40 rounded-lg border"
          data-ocid="terms.toc_panel"
        >
          <h2 className="text-sm font-semibold text-foreground mb-3">
            Table of Contents
          </h2>
          <ol className="grid grid-cols-1 sm:grid-cols-2 gap-1">
            {sections.map((s) => (
              <li key={s.id}>
                <a
                  href={`#section-${s.id}`}
                  className="text-sm text-primary hover:underline"
                  data-ocid={`terms.toc_link.${s.id}`}
                >
                  {s.title}
                </a>
              </li>
            ))}
          </ol>
        </div>

        {/* Sections */}
        <div className="space-y-10">
          {sections.map((section) => (
            <div
              key={section.id}
              id={`section-${section.id}`}
              data-ocid={`terms.section.${section.id}`}
            >
              <h2 className="text-lg font-display font-semibold text-foreground mb-3">
                {section.title}
              </h2>
              <div className="text-muted-foreground leading-relaxed text-sm">
                {section.content}
              </div>
              <Separator className="mt-8" />
            </div>
          ))}
        </div>

        {/* Footer note */}
        <div className="mt-8 p-4 bg-primary/5 rounded-lg border border-primary/20">
          <p className="text-xs text-muted-foreground">
            <strong className="text-foreground">
              Note on Internet Computer Infrastructure:
            </strong>{" "}
            This Platform is built on the DFINITY Internet Computer, a
            decentralized blockchain network. Certain operational
            characteristics, such as data immutability and global node
            distribution, are inherent to the underlying protocol and may affect
            how these Terms are applied in practice. For questions, please
            contact us as described in Section 14.
          </p>
        </div>
      </div>
    </Layout>
  );
}
