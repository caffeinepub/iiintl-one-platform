import { Layout } from "@/components/Layout";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { FileCheck } from "lucide-react";

export function SLAPage() {
  const lastUpdated = "March 2026";

  const sections = [
    {
      id: "1",
      title: "1. Purpose & Scope",
      content: (
        <>
          <p>
            This Service Level Agreement ("SLA") sets out the service
            availability commitments, support response obligations, and
            remediation procedures that IIIntl One Platform ("Platform", "we",
            "us") provides to paying subscribers ("Clients") on the Starter,
            Organization, and Enterprise subscription tiers.
          </p>
          <p className="mt-3">
            This SLA is incorporated by reference into the Platform's Terms of
            Service and is binding on both parties as of the Client's first
            payment for a paid subscription tier. Free-tier users and trial
            users are not covered by this SLA but may benefit from reasonable
            platform availability on a best-effort basis.
          </p>
          <p className="mt-3">
            For the avoidance of doubt, this SLA applies to the shared-instance
            PaaS model currently in operation. Dedicated Clone deployments (when
            available) will be governed by a separate addendum negotiated at the
            time of provisioning.
          </p>
        </>
      ),
    },
    {
      id: "2",
      title: "2. Definitions",
      content: (
        <>
          <div className="space-y-4">
            <div>
              <h4 className="font-semibold text-foreground">2.1 Uptime</h4>
              <p className="mt-1">
                "Uptime" means the percentage of time during a calendar month
                that the Platform is available and accessible to authenticated
                users, measured from the Platform's public endpoints. Uptime is
                calculated as:{" "}
                <em>
                  (Total Minutes − Downtime Minutes) ÷ Total Minutes × 100
                </em>
                .
              </p>
            </div>
            <div>
              <h4 className="font-semibold text-foreground">2.2 Downtime</h4>
              <p className="mt-1">
                "Downtime" means any period of more than five (5) consecutive
                minutes during which the Platform is wholly inaccessible to
                users due to a Platform-side failure. Partial degradation
                (reduced performance but continued access) does not constitute
                Downtime unless core functionality is unavailable.
              </p>
            </div>
            <div>
              <h4 className="font-semibold text-foreground">
                2.3 Scheduled Maintenance
              </h4>
              <p className="mt-1">
                "Scheduled Maintenance" means planned periods of reduced
                availability communicated to Clients in advance pursuant to
                Section 6. Scheduled Maintenance windows are excluded from
                Downtime calculations.
              </p>
            </div>
            <div>
              <h4 className="font-semibold text-foreground">2.4 Incident</h4>
              <p className="mt-1">
                "Incident" means any unplanned event that causes or risks
                causing service Downtime, data unavailability, or significant
                performance degradation. Incidents are classified by severity
                (P1–P4) as defined in Section 5.1.
              </p>
            </div>
          </div>
        </>
      ),
    },
    {
      id: "3",
      title: "3. Service Tiers & Coverage",
      content: (
        <>
          <p>
            SLA coverage varies by subscription tier. The following table
            summarises key commitments; full details are provided in Sections 4
            and 5.
          </p>
          <div className="mt-4 overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead className="font-semibold">Feature</TableHead>
                  <TableHead className="font-semibold text-center">
                    Starter
                  </TableHead>
                  <TableHead className="font-semibold text-center">
                    Organization
                  </TableHead>
                  <TableHead className="font-semibold text-center">
                    Enterprise
                  </TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                <TableRow>
                  <TableCell className="font-medium">Monthly Uptime</TableCell>
                  <TableCell className="text-center">99.5%</TableCell>
                  <TableCell className="text-center">99.7%</TableCell>
                  <TableCell className="text-center font-semibold text-primary">
                    99.9%
                  </TableCell>
                </TableRow>
                <TableRow>
                  <TableCell className="font-medium">
                    P1 Response Time
                  </TableCell>
                  <TableCell className="text-center">48 hours</TableCell>
                  <TableCell className="text-center">24 hours</TableCell>
                  <TableCell className="text-center font-semibold text-primary">
                    4 hours
                  </TableCell>
                </TableRow>
                <TableRow>
                  <TableCell className="font-medium">Support Channel</TableCell>
                  <TableCell className="text-center">Email</TableCell>
                  <TableCell className="text-center">Priority Email</TableCell>
                  <TableCell className="text-center font-semibold text-primary">
                    Dedicated Channel
                  </TableCell>
                </TableRow>
                <TableRow>
                  <TableCell className="font-medium">Service Credits</TableCell>
                  <TableCell className="text-center">Yes</TableCell>
                  <TableCell className="text-center">Yes</TableCell>
                  <TableCell className="text-center">Yes</TableCell>
                </TableRow>
                <TableRow>
                  <TableCell className="font-medium">Monthly Reports</TableCell>
                  <TableCell className="text-center">—</TableCell>
                  <TableCell className="text-center">—</TableCell>
                  <TableCell className="text-center">Yes</TableCell>
                </TableRow>
                <TableRow>
                  <TableCell className="font-medium">
                    Dedicated Clone SLA
                  </TableCell>
                  <TableCell className="text-center">—</TableCell>
                  <TableCell className="text-center">—</TableCell>
                  <TableCell className="text-center">Addendum</TableCell>
                </TableRow>
              </TableBody>
            </Table>
          </div>
          <div className="space-y-4 mt-6">
            <div>
              <h4 className="font-semibold text-foreground">
                3.1 Starter — Standard SLA
              </h4>
              <p className="mt-1">
                Starter tier Clients receive a 99.5% monthly uptime commitment,
                email support for incidents, and service credit eligibility for
                verified Downtime events. Response times follow the standard
                schedule in Section 5.2.
              </p>
            </div>
            <div>
              <h4 className="font-semibold text-foreground">
                3.2 Organization — Enhanced SLA
              </h4>
              <p className="mt-1">
                Organization tier Clients receive a 99.7% monthly uptime
                commitment, priority email support with faster P1/P2 response
                targets, and enhanced service credit calculations. Incidents
                affecting Organization tier clients are escalated in the support
                queue.
              </p>
            </div>
            <div>
              <h4 className="font-semibold text-foreground">
                3.3 Enterprise — Premium SLA
              </h4>
              <p className="mt-1">
                Enterprise tier Clients receive a 99.9% monthly uptime
                commitment, a dedicated support channel, the fastest incident
                response targets (P1: 4 hours), monthly availability reports,
                and the highest service credit rates. Enterprise Clients who
                have provisioned a Dedicated Clone deployment receive an
                additional SLA addendum covering cycle management, version
                control, and independent uptime measurement for their dedicated
                canister.
              </p>
            </div>
          </div>
        </>
      ),
    },
    {
      id: "4",
      title: "4. Uptime Commitments",
      content: (
        <>
          <div className="space-y-4">
            <div>
              <h4 className="font-semibold text-foreground">
                4.1 Target Availability Percentage Per Tier
              </h4>
              <p className="mt-1">
                Monthly uptime targets are: Starter 99.5% (allows up to ~3.6
                hours downtime/month), Organization 99.7% (allows up to ~2.2
                hours/month), Enterprise 99.9% (allows up to ~43 minutes/month).
                These targets apply to the Platform's core authentication,
                dashboard, and data access functions.
              </p>
            </div>
            <div>
              <h4 className="font-semibold text-foreground">
                4.2 Measurement Methodology
              </h4>
              <p className="mt-1">
                Uptime is measured from the Platform's public canister endpoints
                on the Internet Computer network. Measurements are taken at
                regular intervals and compared against Platform response
                benchmarks. The monthly uptime percentage is calculated at the
                end of each calendar month and is the basis for any service
                credit claims.
              </p>
            </div>
            <div>
              <h4 className="font-semibold text-foreground">4.3 Exclusions</h4>
              <p className="mt-1">
                The following do not count toward Downtime calculations and are
                excluded from uptime commitments:
              </p>
              <ul className="mt-2 list-disc list-inside space-y-1 text-muted-foreground">
                <li>
                  Internet Computer (ICP) network-wide outages or subnet
                  disruptions not caused by the Platform
                </li>
                <li>
                  Force majeure events (natural disasters, war, government
                  action, pandemics, major infrastructure failures)
                </li>
                <li>
                  Client-caused issues (misconfigured access, API misuse,
                  exceeding rate limits, unauthorized actions)
                </li>
                <li>Scheduled Maintenance windows notified per Section 6</li>
                <li>
                  Beta, preview, or experimental features not in general
                  availability
                </li>
                <li>Third-party service failures (Stripe, DNS providers)</li>
              </ul>
            </div>
          </div>
        </>
      ),
    },
    {
      id: "5",
      title: "5. Incident Response & Support",
      content: (
        <>
          <div className="space-y-4">
            <div>
              <h4 className="font-semibold text-foreground">
                5.1 Severity Classification (P1–P4)
              </h4>
              <ul className="mt-2 space-y-2">
                <li>
                  <span className="font-medium text-red-600">
                    P1 — Critical:
                  </span>{" "}
                  Complete Platform outage or total data inaccessibility
                  affecting all or most users.
                </li>
                <li>
                  <span className="font-medium text-orange-600">
                    P2 — High:
                  </span>{" "}
                  Significant degradation of core features (login, dashboard,
                  data reads/writes) affecting a substantial portion of users.
                </li>
                <li>
                  <span className="font-medium text-yellow-600">
                    P3 — Medium:
                  </span>{" "}
                  Partial outage of non-critical features, or critical features
                  with a workaround available.
                </li>
                <li>
                  <span className="font-medium text-blue-600">P4 — Low:</span>{" "}
                  Minor issues, cosmetic defects, documentation errors, or
                  non-urgent enhancement requests.
                </li>
              </ul>
            </div>
            <div>
              <h4 className="font-semibold text-foreground">
                5.2 Response Time Targets by Tier and Severity
              </h4>
              <div className="mt-2 overflow-x-auto">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Severity</TableHead>
                      <TableHead className="text-center">Starter</TableHead>
                      <TableHead className="text-center">
                        Organization
                      </TableHead>
                      <TableHead className="text-center">Enterprise</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    <TableRow>
                      <TableCell className="font-medium">P1 Critical</TableCell>
                      <TableCell className="text-center">48 hours</TableCell>
                      <TableCell className="text-center">24 hours</TableCell>
                      <TableCell className="text-center font-semibold">
                        4 hours
                      </TableCell>
                    </TableRow>
                    <TableRow>
                      <TableCell className="font-medium">P2 High</TableCell>
                      <TableCell className="text-center">
                        5 business days
                      </TableCell>
                      <TableCell className="text-center">48 hours</TableCell>
                      <TableCell className="text-center font-semibold">
                        24 hours
                      </TableCell>
                    </TableRow>
                    <TableRow>
                      <TableCell className="font-medium">P3 Medium</TableCell>
                      <TableCell className="text-center">
                        10 business days
                      </TableCell>
                      <TableCell className="text-center">
                        5 business days
                      </TableCell>
                      <TableCell className="text-center font-semibold">
                        48 hours
                      </TableCell>
                    </TableRow>
                    <TableRow>
                      <TableCell className="font-medium">P4 Low</TableCell>
                      <TableCell className="text-center">Best effort</TableCell>
                      <TableCell className="text-center">
                        10 business days
                      </TableCell>
                      <TableCell className="text-center font-semibold">
                        5 business days
                      </TableCell>
                    </TableRow>
                  </TableBody>
                </Table>
              </div>
            </div>
            <div>
              <h4 className="font-semibold text-foreground">
                5.3 Resolution Time Targets
              </h4>
              <p className="mt-1">
                Response time is the time to acknowledge and begin investigation
                of an incident. Resolution time is the target time to restore
                full service. P1 incidents on Enterprise tier target resolution
                within 24 hours of acknowledgement. P1 on Organization tier
                targets 72 hours. P1 on Starter tier targets 5 business days.
                Resolution times are targets, not guarantees, and may vary based
                on incident complexity.
              </p>
            </div>
            <div>
              <h4 className="font-semibold text-foreground">
                5.4 Escalation Process
              </h4>
              <p className="mt-1">
                If a P1 or P2 incident is not acknowledged within the response
                time target, Clients may escalate by contacting us via the
                emergency contact address provided at onboarding. Enterprise
                Clients have access to a dedicated escalation contact. Escalated
                incidents are reviewed by senior platform staff and receive
                priority allocation of engineering resources.
              </p>
            </div>
          </div>
        </>
      ),
    },
    {
      id: "6",
      title: "6. Scheduled Maintenance",
      content: (
        <>
          <div className="space-y-4">
            <div>
              <h4 className="font-semibold text-foreground">
                6.1 Advance Notice Requirements
              </h4>
              <p className="mt-1">
                We will provide at least 72 hours advance notice of any
                Scheduled Maintenance that is expected to result in service
                unavailability or degradation. Notice will be provided via
                in-platform notification and, where a contact email has been
                provided, by email to the Tenant's registered contact address.
                Emergency maintenance required to address active security
                threats or P1 incidents may be performed with shorter notice; we
                will provide as much notice as practicable in such cases.
              </p>
            </div>
            <div>
              <h4 className="font-semibold text-foreground">
                6.2 Maintenance Windows
              </h4>
              <p className="mt-1">
                Routine maintenance is scheduled during low-traffic periods
                (typically between 02:00–05:00 UTC on weekdays) to minimise
                impact on users. We aim to complete scheduled maintenance within
                the notified window. Enterprise Clients may request to be
                notified of all maintenance windows, including minor ones, as
                part of their subscription.
              </p>
            </div>
          </div>
        </>
      ),
    },
    {
      id: "7",
      title: "7. Cycle Management (Dedicated Clone Tenants)",
      content: (
        <>
          <p>
            This section applies exclusively to Enterprise Clients who have
            provisioned a Dedicated Clone deployment. It does not apply to
            shared-instance tenants.
          </p>
          <div className="space-y-4 mt-4">
            <div>
              <h4 className="font-semibold text-foreground">
                7.1 Cycle Top-Up Obligations
              </h4>
              <p className="mt-1">
                Canisters on the Internet Computer require "cycles" (compute
                fuel) to remain active. For Dedicated Clone deployments, we
                commit to maintaining an adequate cycles balance in the Client's
                dedicated canister. We will pre-fund cycles at provisioning and
                monitor balances on an ongoing basis. Costs for cycles are
                included in the Enterprise Dedicated Clone pricing and are not
                billed separately unless usage significantly exceeds projected
                levels, in which case we will notify the Client before incurring
                additional charges.
              </p>
            </div>
            <div>
              <h4 className="font-semibold text-foreground">
                7.2 Low-Cycle Alert Thresholds
              </h4>
              <p className="mt-1">
                We maintain automated monitoring of cycle balances for all
                Dedicated Clone canisters. When a canister's cycle balance falls
                below a defined threshold (currently set at 30 days of projected
                usage), we will trigger an automatic top-up. Clients will be
                notified of significant cycle consumption events or any top-ups
                that fall outside normal operating parameters.
              </p>
            </div>
            <div>
              <h4 className="font-semibold text-foreground">
                7.3 Freeze Prevention Guarantees
              </h4>
              <p className="mt-1">
                A canister that runs out of cycles on the IC enters a "frozen"
                state, making it inaccessible. We commit to preventing canister
                freezes through proactive cycle monitoring and top-up as
                described above. In the event a canister is frozen due to
                unforeseen circumstances, restoring canister availability is
                treated as a P1 Critical incident under Section 5.
              </p>
            </div>
          </div>
        </>
      ),
    },
    {
      id: "8",
      title: "8. Data Backup & Recovery",
      content: (
        <>
          <div className="space-y-4">
            <div>
              <h4 className="font-semibold text-foreground">
                8.1 On-Chain Data Durability
              </h4>
              <p className="mt-1">
                All Platform data is stored on the Internet Computer, a
                decentralised network with built-in replication across multiple
                nodes in a subnet. The ICP protocol provides a high degree of
                inherent data durability through cryptographic verification and
                subnet replication. Data stored on-chain is not subject to the
                same single-point-of-failure risks as traditional centralised
                databases.
              </p>
            </div>
            <div>
              <h4 className="font-semibold text-foreground">
                8.2 Recovery Procedures and Timelines
              </h4>
              <p className="mt-1">
                In the unlikely event of data loss due to a catastrophic
                canister failure, our recovery procedure is:
              </p>
              <ol className="mt-2 list-decimal list-inside space-y-1 text-muted-foreground">
                <li>
                  Immediate incident declaration and notification to affected
                  Clients (within 2 hours of detection)
                </li>
                <li>
                  Assessment of data integrity and scope of loss (within 4
                  hours)
                </li>
                <li>
                  Recovery from the most recent stable canister snapshot, if
                  available (timeline depends on IC subnet recovery tools)
                </li>
                <li>
                  Client notification of recovery outcome, data loss scope, and
                  remediation steps (within 24 hours of incident detection)
                </li>
              </ol>
              <p className="mt-3">
                We recommend that Enterprise Clients maintain their own export
                of critical records (member lists, billing records) through the
                Platform's export features where available.
              </p>
            </div>
          </div>
        </>
      ),
    },
    {
      id: "9",
      title: "9. Service Credits",
      content: (
        <>
          <div className="space-y-4">
            <div>
              <h4 className="font-semibold text-foreground">
                9.1 Credit Calculation Formula
              </h4>
              <p className="mt-1">
                If monthly uptime falls below the committed percentage for your
                tier, you are eligible for a service credit against your next
                invoice. Credits are calculated as follows:
              </p>
              <div className="mt-3 space-y-2">
                <div className="flex items-start gap-3 p-3 bg-muted rounded-lg">
                  <div className="flex-1">
                    <p className="font-medium text-sm">
                      Uptime 99.0%–99.4% (Starter) / 99.5%–99.6% (Org) /
                      99.5%–99.8% (Enterprise)
                    </p>
                    <p className="text-sm text-muted-foreground mt-1">
                      10% credit of that month's subscription fee
                    </p>
                  </div>
                </div>
                <div className="flex items-start gap-3 p-3 bg-muted rounded-lg">
                  <div className="flex-1">
                    <p className="font-medium text-sm">
                      Uptime below 99.0% (Starter/Org) / below 99.5%
                      (Enterprise)
                    </p>
                    <p className="text-sm text-muted-foreground mt-1">
                      25% credit of that month's subscription fee
                    </p>
                  </div>
                </div>
                <div className="flex items-start gap-3 p-3 bg-muted rounded-lg">
                  <div className="flex-1">
                    <p className="font-medium text-sm">
                      Uptime below 95.0% (any tier)
                    </p>
                    <p className="text-sm text-muted-foreground mt-1">
                      50% credit of that month's subscription fee
                    </p>
                  </div>
                </div>
              </div>
            </div>
            <div>
              <h4 className="font-semibold text-foreground">
                9.2 How to Claim Credits
              </h4>
              <p className="mt-1">
                To claim a service credit, submit a credit request within 30
                calendar days of the end of the affected month, using the
                contact method in Section 14. Your request must include the
                approximate dates and duration of the Downtime events and the
                affected features. We will review and respond within 10 business
                days. Approved credits will be applied to your next billing
                cycle.
              </p>
            </div>
            <div>
              <h4 className="font-semibold text-foreground">
                9.3 Credit Limitations and Exclusions
              </h4>
              <p className="mt-1">
                Service credits are the sole remedy for SLA breaches and do not
                constitute a waiver of any other rights. Credits:
              </p>
              <ul className="mt-2 list-disc list-inside space-y-1 text-muted-foreground">
                <li>
                  Are capped at 50% of the affected month's subscription fee
                </li>
                <li>Cannot be converted to cash or transferred</li>
                <li>Are forfeited if the Client's account is in arrears</li>
                <li>
                  Do not apply to Downtime caused by excluded events (Section
                  4.3) or Client-caused issues
                </li>
                <li>
                  Apply only to the subscription fees paid, not to overages
                </li>
              </ul>
            </div>
          </div>
        </>
      ),
    },
    {
      id: "10",
      title: "10. Monitoring & Reporting",
      content: (
        <>
          <div className="space-y-4">
            <div>
              <h4 className="font-semibold text-foreground">
                10.1 Status Page / Uptime Dashboard
              </h4>
              <p className="mt-1">
                We maintain a platform status indicator accessible within the
                Admin Dashboard. Clients can view current platform status,
                active incidents, and recent maintenance activity. In the event
                of a P1 or P2 incident, we will update the status indicator and
                send notifications to affected Clients as soon as practicable.
              </p>
            </div>
            <div>
              <h4 className="font-semibold text-foreground">
                10.2 Monthly Availability Reports (Enterprise)
              </h4>
              <p className="mt-1">
                Enterprise tier Clients receive a monthly availability report
                delivered within 5 business days of the end of each calendar
                month. The report includes: measured uptime percentage, summary
                of any incidents and their resolutions, maintenance windows that
                occurred, cycle balance activity (Dedicated Clone clients), and
                any service credits earned. Reports are delivered to the
                Client's registered contact email.
              </p>
            </div>
          </div>
        </>
      ),
    },
    {
      id: "11",
      title: "11. Tenant Responsibilities",
      content: (
        <>
          <p>
            To maintain SLA coverage and ensure accurate service delivery,
            Clients are responsible for the following:
          </p>
          <div className="space-y-4 mt-4">
            <div>
              <h4 className="font-semibold text-foreground">
                11.1 Accurate Billing & Contact Information
              </h4>
              <p className="mt-1">
                Clients must maintain accurate and up-to-date billing and
                contact information in their Tenant Admin Portal. This includes
                the registered organisation name, a valid contact email address
                for incident notifications and reports, and accurate payment
                method details. Failure to maintain accurate contact information
                may result in missed incident notifications and forfeiture of
                service credit claims.
              </p>
            </div>
            <div>
              <h4 className="font-semibold text-foreground">
                11.2 Prompt Payment to Maintain SLA Coverage
              </h4>
              <p className="mt-1">
                SLA coverage is contingent on the Client's subscription being in
                good standing. If a subscription payment fails and is not
                resolved within 7 calendar days, SLA coverage is suspended until
                payment is received. We will provide notice of payment failures
                and a grace period before suspending SLA coverage. Suspended SLA
                coverage cannot be backdated upon reinstatement.
              </p>
            </div>
          </div>
        </>
      ),
    },
    {
      id: "12",
      title: "12. SLA Exceptions & Exclusions",
      content: (
        <>
          <p>
            In addition to the uptime exclusions listed in Section 4.3, this SLA
            does not apply to:
          </p>
          <ul className="mt-3 list-disc list-inside space-y-2 text-muted-foreground">
            <li>Free-tier users and trial accounts</li>
            <li>
              Features explicitly marked as "beta", "preview", or "experimental"
              in the Platform interface
            </li>
            <li>
              Service disruptions caused by the Client's own members,
              administrators, or third-party integrations
            </li>
            <li>
              Issues arising from a Client's use of the Platform in a manner
              inconsistent with the Terms of Service or Platform documentation
            </li>
            <li>
              ICP network congestion or latency not resulting in complete
              inaccessibility
            </li>
            <li>
              Stripe or third-party payment processing outages that do not
              affect core Platform functionality
            </li>
            <li>Data migration operations requested by the Client</li>
            <li>
              Temporary performance degradation during periods of unusually high
              traffic that does not result in inaccessibility
            </li>
          </ul>
        </>
      ),
    },
    {
      id: "13",
      title: "13. Amendment & Termination of SLA",
      content: (
        <>
          <p>
            We reserve the right to amend this SLA at any time. Material changes
            — including reductions in uptime commitments or support response
            times — will be communicated to Clients at least 30 calendar days
            before taking effect, via in-platform notification and, where
            available, by email to the Tenant's registered contact.
          </p>
          <p className="mt-3">
            Clients who do not accept material changes to the SLA may terminate
            their subscription without early termination penalty within 30 days
            of the amendment notice, subject to the cancellation terms in the
            Terms of Service.
          </p>
          <p className="mt-3">
            This SLA terminates automatically upon cancellation or expiry of the
            Client's paid subscription. Upon termination, no further service
            credits will accrue, and any pending credit claims must be submitted
            within 30 days of the termination date.
          </p>
        </>
      ),
    },
    {
      id: "14",
      title: "14. Contact for SLA Claims",
      content: (
        <>
          <p>
            For SLA credit claims, incident escalations, or questions about this
            SLA, please contact us through the following channels:
          </p>
          <div className="mt-4 space-y-3">
            <div className="p-4 bg-muted rounded-lg">
              <p className="font-semibold text-foreground">
                General SLA Enquiries
              </p>
              <p className="text-muted-foreground mt-1">
                Use the support contact form within your Tenant Admin Portal
                (Settings tab) or email the platform support address provided at
                onboarding.
              </p>
            </div>
            <div className="p-4 bg-muted rounded-lg">
              <p className="font-semibold text-foreground">
                Enterprise — Dedicated Support Channel
              </p>
              <p className="text-muted-foreground mt-1">
                Enterprise Clients have access to a dedicated support channel
                communicated at the time of provisioning. P1 escalations should
                use this channel for the fastest response.
              </p>
            </div>
            <div className="p-4 bg-muted rounded-lg">
              <p className="font-semibold text-foreground">
                Response Commitment
              </p>
              <p className="text-muted-foreground mt-1">
                All SLA credit claim requests will receive an acknowledgement
                within 2 business days and a resolution decision within 10
                business days of submission.
              </p>
            </div>
          </div>
          <p className="mt-4">
            This SLA was last updated in {lastUpdated}. The current version of
            this SLA supersedes all previous versions and is effective from the
            date of publication.
          </p>
        </>
      ),
    },
  ];

  return (
    <Layout>
      <div data-ocid="sla.page" className="max-w-5xl mx-auto px-4 py-8">
        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center gap-3 mb-4">
            <div className="p-2 bg-primary/10 rounded-lg">
              <FileCheck className="h-6 w-6 text-primary" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h1 className="text-3xl font-bold text-foreground">
                  Service Level Agreement
                </h1>
                <Badge variant="outline" className="text-xs">
                  Paying Clients
                </Badge>
              </div>
              <p className="text-sm text-muted-foreground mt-1">
                Last updated: {lastUpdated}
              </p>
            </div>
          </div>
          <Separator />
        </div>

        {/* Paying clients notice */}
        <div className="mb-8 p-4 bg-blue-50 border border-blue-200 rounded-lg">
          <p className="text-sm text-blue-800">
            <strong>For Paying Subscribers Only.</strong> This Service Level
            Agreement applies exclusively to Clients on the{" "}
            <strong>Starter</strong>, <strong>Organization</strong>, and{" "}
            <strong>Enterprise</strong> paid subscription tiers. Free-tier users
            and trial accounts are not covered by this SLA. If you are a paying
            subscriber and have a question about your coverage, please refer to
            Section 3 (Service Tiers) or contact us via Section 14.
          </p>
        </div>

        <div className="flex flex-col lg:flex-row gap-8">
          {/* Table of Contents */}
          <aside data-ocid="sla.toc_panel" className="lg:w-64 flex-shrink-0">
            <div className="sticky top-6 p-4 bg-muted/50 rounded-lg border">
              <h2 className="text-sm font-semibold text-foreground mb-3">
                Table of Contents
              </h2>
              <nav className="space-y-1">
                {sections.map((section) => (
                  <a
                    key={section.id}
                    href={`#section-${section.id}`}
                    data-ocid={`sla.toc_link.${section.id}`}
                    className="block text-xs text-muted-foreground hover:text-foreground hover:bg-background rounded px-2 py-1.5 transition-colors"
                  >
                    {section.title}
                  </a>
                ))}
              </nav>
            </div>
          </aside>

          {/* Main content */}
          <main className="flex-1 min-w-0">
            <div className="space-y-10">
              {sections.map((section) => (
                <section
                  key={section.id}
                  id={`section-${section.id}`}
                  data-ocid={`sla.section.${section.id}`}
                >
                  <h2 className="text-xl font-semibold text-foreground mb-4">
                    {section.title}
                  </h2>
                  <div className="text-muted-foreground leading-relaxed">
                    {section.content}
                  </div>
                  <Separator className="mt-8" />
                </section>
              ))}
            </div>
          </main>
        </div>
      </div>
    </Layout>
  );
}
