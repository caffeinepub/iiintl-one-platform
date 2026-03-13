import { Layout } from "@/components/Layout";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { Shield } from "lucide-react";

export function PrivacyPolicyPage() {
  const lastUpdated = "March 2026";

  const sections = [
    {
      id: "1",
      title: "1. Introduction & Scope",
      content: (
        <>
          <p>
            IIIntl One Platform ("Platform", "we", "us", or "our") is committed
            to protecting the privacy and personal data of all users. This
            Privacy Policy explains what information we collect, how we use it,
            who we share it with, and what rights you have in connection with
            your data.
          </p>
          <p className="mt-3">
            This Policy applies to all users of the Platform, including general
            registered users, organization members, campaign participants, forum
            contributors, store customers, and Platform-as-a-Service (PaaS)
            tenant clients and their members.
          </p>
          <p className="mt-3">
            By accessing or using the Platform, you acknowledge that you have
            read and understood this Privacy Policy. If you do not agree, please
            discontinue use of the Platform.
          </p>
        </>
      ),
    },
    {
      id: "2",
      title: "2. Data Controller Information",
      content: (
        <>
          <p>
            The data controller for all personal data processed on this Platform
            is the operating entity behind IIIntl One Platform. For questions or
            requests regarding your personal data, please use the contact
            details provided in Section 14 of this Policy.
          </p>
          <p className="mt-3">
            Where the Platform is rented to a tenant organization under the PaaS
            model, that tenant organization acts as a co-controller for personal
            data belonging to their own members and content. The Platform
            operator remains a controller for platform-level account and
            infrastructure data.
          </p>
        </>
      ),
    },
    {
      id: "3",
      title: "3. Information We Collect",
      content: (
        <>
          <div className="space-y-4">
            <div>
              <h4 className="font-semibold text-foreground">
                3.1 Account & Identity Data
              </h4>
              <p className="mt-1">
                When you register or sign in, we collect your Internet Identity
                principal (a cryptographic identifier assigned by the Internet
                Computer), and any profile information you voluntarily provide
                such as display name and role. We do not collect email addresses
                or passwords for standard Internet Identity authentication.
              </p>
            </div>
            <div>
              <h4 className="font-semibold text-foreground">3.2 Usage Data</h4>
              <p className="mt-1">
                We collect records of actions you take on the Platform,
                including organizations joined, campaigns participated in,
                forums posted to, petitions signed, pledges made, and store
                orders placed. Timestamps are recorded for most actions.
              </p>
            </div>
            <div>
              <h4 className="font-semibold text-foreground">
                3.3 Organization & Campaign Data
              </h4>
              <p className="mt-1">
                Content you create or contribute — including organization
                records, campaign details, forum threads and replies, resources,
                and FAQ entries — is stored on the Platform and associated with
                your principal identifier.
              </p>
            </div>
            <div>
              <h4 className="font-semibold text-foreground">
                3.4 Payment Data
              </h4>
              <p className="mt-1">
                Payment processing is handled by Stripe (for card payments) and
                the Internet Computer protocol (for ICP token payments). We do
                not store full card numbers, CVV codes, or other raw payment
                credentials. We retain billing records including transaction
                amounts, dates, currencies, payment methods, and subscription
                status for accounting and subscription management purposes.
              </p>
            </div>
            <div>
              <h4 className="font-semibold text-foreground">
                3.5 Communications & Forum Content
              </h4>
              <p className="mt-1">
                Any content you post publicly — forum threads, replies, resource
                descriptions, campaign content — is stored on the Internet
                Computer and may be visible to other authenticated users of the
                Platform or the relevant tenant space.
              </p>
            </div>
          </div>
        </>
      ),
    },
    {
      id: "4",
      title: "4. How We Use Your Data",
      content: (
        <>
          <div className="space-y-4">
            <div>
              <h4 className="font-semibold text-foreground">
                4.1 Platform Operation and Service Delivery
              </h4>
              <p className="mt-1">
                We use your data to authenticate you, provide access to the
                features you have signed up for, display your profile and
                contributions, and allow you to interact with other users,
                organizations, and content.
              </p>
            </div>
            <div>
              <h4 className="font-semibold text-foreground">
                4.2 Authentication and Security
              </h4>
              <p className="mt-1">
                Your Internet Identity principal is used to verify your identity
                across sessions, enforce role-based access control, and prevent
                unauthorized access to restricted features.
              </p>
            </div>
            <div>
              <h4 className="font-semibold text-foreground">
                4.3 Billing and Subscription Management (Paying Clients)
              </h4>
              <p className="mt-1">
                For PaaS tenant clients, we use subscription and billing data to
                manage your plan tier, enforce usage limits, process payments,
                send renewal reminders, and maintain billing history records.
              </p>
            </div>
            <div>
              <h4 className="font-semibold text-foreground">
                4.4 Analytics and Platform Improvement
              </h4>
              <p className="mt-1">
                Aggregated, non-personally-identifiable usage data may be used
                to understand how the Platform is used, identify issues, and
                improve features and performance. Individual usage data is not
                sold or shared with advertisers.
              </p>
            </div>
          </div>
        </>
      ),
    },
    {
      id: "5",
      title: "5. Data Storage & the Internet Computer",
      content: (
        <>
          <div className="space-y-4">
            <div>
              <h4 className="font-semibold text-foreground">
                5.1 On-Chain Storage (Immutability Notice)
              </h4>
              <p className="mt-1">
                This Platform runs on the Internet Computer (ICP), a
                decentralized blockchain network. Data stored in canisters
                (smart contracts) on the ICP may be immutable or persistent by
                design. Certain data — particularly public forum posts,
                organization records, and action history — may not be fully
                deletable once written to the chain. We will make best efforts
                to fulfill deletion requests, but we cannot guarantee complete
                erasure of all on-chain data.
              </p>
            </div>
            <div>
              <h4 className="font-semibold text-foreground">
                5.2 Data Residency (ICP Node Geography)
              </h4>
              <p className="mt-1">
                The Internet Computer operates on a globally distributed network
                of node machines. Data may be replicated across nodes in
                multiple geographic regions, including the European Union, North
                America, and Asia. We do not have full control over the
                geographic placement of individual data replicas. Users in
                jurisdictions with strict data residency requirements should
                consider this when using the Platform.
              </p>
            </div>
          </div>
        </>
      ),
    },
    {
      id: "6",
      title: "6. Data Sharing & Third Parties",
      content: (
        <>
          <div className="space-y-4">
            <div>
              <h4 className="font-semibold text-foreground">
                6.1 Stripe (Payment Processing)
              </h4>
              <p className="mt-1">
                When you make a payment using a credit or debit card, your
                payment information is transmitted directly to Stripe, Inc. and
                processed under Stripe's Privacy Policy. We receive confirmation
                of payment status and basic transaction metadata. We do not
                receive or store your full card details.
              </p>
            </div>
            <div>
              <h4 className="font-semibold text-foreground">
                6.2 ICP / DFINITY Infrastructure
              </h4>
              <p className="mt-1">
                The Platform is built on the Internet Computer protocol managed
                by the DFINITY Foundation and the Internet Computer community.
                Node providers operating the network infrastructure may have
                access to encrypted canister data as part of network operations,
                subject to ICP protocol security guarantees.
              </p>
            </div>
            <div>
              <h4 className="font-semibold text-foreground">
                6.3 No Sale of Personal Data
              </h4>
              <p className="mt-1">
                We do not sell, rent, or trade your personal data to any third
                parties for marketing or advertising purposes.
              </p>
            </div>
          </div>
        </>
      ),
    },
    {
      id: "7",
      title: "7. Tenant & PaaS Data Handling",
      content: (
        <>
          <div className="space-y-4">
            <div>
              <h4 className="font-semibold text-foreground">
                7.1 Tenant Data Isolation
              </h4>
              <p className="mt-1">
                Each PaaS tenant organization's data is isolated within the
                Platform by a unique tenant identifier. Tenant members can only
                access data within their own tenant space. Other tenants cannot
                access your organization's members, campaigns, forums, or
                content.
              </p>
            </div>
            <div>
              <h4 className="font-semibold text-foreground">
                7.2 Platform Owner Access for Support and Oversight
              </h4>
              <p className="mt-1">
                Platform super-administrators may access tenant data for the
                purpose of billing verification, technical support, dispute
                resolution, compliance enforcement, or platform integrity. Such
                access is limited in scope and logged where possible.
              </p>
            </div>
          </div>
        </>
      ),
    },
    {
      id: "8",
      title: "8. Cookies & Local Storage",
      content: (
        <p>
          The Platform uses browser local storage to maintain your session,
          language preference, and wallet connection state. We do not use
          third-party advertising cookies. Internet Identity authentication may
          set cookies managed by the identity.ic0.app domain, which are subject
          to the DFINITY Foundation's privacy practices. You can clear local
          storage via your browser settings, which will log you out of the
          Platform.
        </p>
      ),
    },
    {
      id: "9",
      title: "9. Your Rights",
      content: (
        <>
          <div className="space-y-4">
            <div>
              <h4 className="font-semibold text-foreground">
                9.1 Access, Correction, and Deletion Requests
              </h4>
              <p className="mt-1">
                You have the right to request access to the personal data we
                hold about you, request corrections to inaccurate data, and
                request deletion of your account and associated data. To
                exercise these rights, contact us using the details in Section
                14.
              </p>
            </div>
            <div>
              <h4 className="font-semibold text-foreground">
                9.2 Limitations Due to Blockchain Immutability
              </h4>
              <p className="mt-1">
                As noted in Section 5.1, certain data stored on the Internet
                Computer blockchain may not be fully removable. We will honor
                deletion requests to the best of our technical ability, and will
                deactivate your account and remove identifiable profile data
                where possible, even if underlying on-chain transaction records
                cannot be erased.
              </p>
            </div>
          </div>
        </>
      ),
    },
    {
      id: "10",
      title: "10. Data Retention",
      content: (
        <p>
          We retain your account and profile data for as long as your account is
          active. Billing records and transaction history are retained for a
          minimum of 7 years for financial compliance purposes. Public forum
          posts and organizational content may be retained indefinitely as part
          of the platform record. Upon account deletion, identifiable profile
          information is removed, though associated content may remain in
          anonymized or archived form.
        </p>
      ),
    },
    {
      id: "11",
      title: "11. Children's Privacy",
      content: (
        <p>
          The Platform is not intended for use by individuals under the age of
          13 (or 16 in jurisdictions where a higher age threshold applies for
          digital services, such as the European Union under GDPR). If you
          believe a child under the applicable age has created an account,
          please contact us immediately and we will take steps to remove the
          account and associated data.
        </p>
      ),
    },
    {
      id: "12",
      title: "12. International Users",
      content: (
        <p>
          The Platform is designed for a global audience. By using the Platform,
          you consent to the processing and storage of your data as described in
          this Policy, including in jurisdictions outside your own. Users in the
          European Economic Area (EEA) or United Kingdom have additional rights
          under GDPR and UK GDPR respectively. Users in California may have
          rights under CCPA. If you have specific jurisdiction-based requests,
          please contact us as set out in Section 14.
        </p>
      ),
    },
    {
      id: "13",
      title: "13. Changes to This Policy",
      content: (
        <p>
          We may update this Privacy Policy from time to time to reflect changes
          in our practices, technology, legal requirements, or other factors.
          When we make material changes, we will update the "Last Updated" date
          at the top of this page and may notify active users via the Platform's
          notification system. Continued use of the Platform after changes are
          posted constitutes your acceptance of the revised Policy.
        </p>
      ),
    },
    {
      id: "14",
      title: "14. Contact Information",
      content: (
        <p>
          For privacy-related inquiries, data access requests, deletion
          requests, or any questions about this Policy, please contact us
          through the platform support channels available at the Help section,
          or via the contact information listed on the Platform's official
          homepage. We aim to respond to all privacy requests within 30 days.
        </p>
      ),
    },
  ];

  return (
    <Layout>
      <div className="max-w-4xl mx-auto px-4 py-10" data-ocid="privacy.page">
        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center gap-3 mb-4">
            <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center">
              <Shield className="w-5 h-5 text-primary" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h1 className="text-2xl font-display font-bold text-foreground">
                  Privacy Policy
                </h1>
                <Badge variant="outline" className="text-xs">
                  All Users
                </Badge>
              </div>
              <p className="text-sm text-muted-foreground">
                Last updated: {lastUpdated}
              </p>
            </div>
          </div>
          <p className="text-muted-foreground leading-relaxed">
            This Privacy Policy describes how IIIntl One Platform collects,
            uses, stores, and protects your personal data. It applies to all
            users of the Platform, including free users, PaaS tenant clients,
            and their members.
          </p>
        </div>

        <Separator className="mb-8" />

        {/* Table of Contents */}
        <div
          className="mb-8 p-4 bg-muted/40 rounded-lg border"
          data-ocid="privacy.toc_panel"
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
                  data-ocid={`privacy.toc_link.${s.id}`}
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
              data-ocid={`privacy.section.${section.id}`}
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
              Note on Internet Computer Storage:
            </strong>{" "}
            This platform runs on the DFINITY Internet Computer, a decentralized
            blockchain network. Some data stored in smart contracts may be
            replicated across global nodes and may not be fully erasable. We
            honor deletion requests to the best of our technical ability within
            the constraints of the underlying protocol.
          </p>
        </div>
      </div>
    </Layout>
  );
}
