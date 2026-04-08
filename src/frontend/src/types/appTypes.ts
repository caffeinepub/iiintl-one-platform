import type { backendInterface } from "@/backend";
/**
 * Supplemental application types for features not yet reflected in the backend DID.
 * These types support the Tenant/PaaS, MLM/Rewards, and Events modules
 * that are wired to backend calls via runtime casting.
 */
import type { Principal } from "@icp-sdk/core/principal";

// ── Tenant / PaaS Types ──────────────────────────────────────────────────────

export enum TenantTier {
  starter = "starter",
  organization = "organization",
  enterprise = "enterprise",
}

export enum TenantStatus {
  trial = "trial",
  active = "active",
  suspended = "suspended",
  cancelled = "cancelled",
}

export enum PaymentMethod {
  icp = "icp",
  stripe = "stripe",
  invoice = "invoice",
}

export type BillingStatus = "paid" | "pending" | "failed" | "refunded";

export interface TenantBranding {
  brandName: string;
  logoUrl: string;
  primaryColor: string;
  welcomeMessage: string;
}

export interface Tenant {
  id: string;
  orgName: string;
  contactEmail: string;
  ownerPrincipal: Principal;
  tier: TenantTier;
  status: TenantStatus;
  customDomain: string | null;
  branding: TenantBranding | null;
  memberLimit: number;
  storageLimit: number;
  createdAt: bigint;
  trialEndsAt: bigint | null;
}

export interface TenantSubscription {
  tenantId: string;
  tier: TenantTier;
  monthlyFee: number;
  currency: string;
  paymentMethod: PaymentMethod;
  lastPaidAt: bigint | null;
  nextDueAt: bigint;
}

export interface TenantMember {
  tenantId: string;
  memberPrincipal: Principal;
  role: string;
  addedAt: bigint;
  addedBy: Principal;
}

export interface TenantUsage {
  memberCount: number;
  memberLimit: number;
  storageUsedGB: number;
  storageLimit: number;
  tier: TenantTier;
  status: TenantStatus;
  daysLeftInTrial: number;
  createdAt: bigint;
}

export interface TenantAccessResult {
  allowed: boolean;
  reason: string;
}

export interface BillingRecord {
  id: bigint;
  tenantId: string;
  amountCents: number;
  currency: string;
  status: BillingStatus;
  paymentMethod: PaymentMethod;
  description: string;
  paidAt: bigint;
  periodStart: bigint;
  periodEnd: bigint;
}

export interface TenantStats {
  id: string;
  orgName: string;
  tier: TenantTier;
  status: TenantStatus;
  memberCount: number;
  memberLimit: number;
  daysActive: number;
  monthlyFee: number;
  hasBranding: boolean;
}

export interface TierCount {
  starter: number;
  organization: number;
  enterprise: number;
}

export interface PlatformAnalytics {
  totalTenants: number;
  activeTenants: number;
  trialTenants: number;
  suspendedTenants: number;
  cancelledTenants: number;
  tierBreakdown: TierCount;
  totalMonthlyRevenue: number;
  totalMembers: number;
  tenantsWithBranding: number;
}

// ── MLM / Rewards Types ──────────────────────────────────────────────────────

export type MembershipTierLevel =
  | "free"
  | "associate"
  | "affiliate"
  | "partner"
  | "executive"
  | "ambassador"
  | "founder";
export type EarningType =
  | "directReferral"
  | "levelOverride"
  | "royaltyPool"
  | "eventCommission"
  | "finFracFran"
  | "activityBonus";
export type EarningStatus = "pending" | "processing" | "paid";
export type RoyaltyPoolType = "global" | "leadership" | "event" | "finFracFran";
export type FSUTxType = "earned" | "redeemed" | "transferred";

export interface MemberTierRecord {
  memberId: Principal;
  tier: MembershipTierLevel;
  referralCode: string;
  sponsorId: Principal | null;
  joinedAt: bigint;
  upgradedAt: bigint | null;
  isActive: boolean;
}

export interface EarningRecord {
  id: bigint;
  memberId: Principal;
  /** amount in cents as bigint */
  amountCents: bigint;
  currency: string;
  earningType: EarningType;
  status: EarningStatus;
  /** depth level — pages reference this as `depthLevel` */
  depthLevel: bigint;
  sourceId: string;
  description: string;
  createdAt: bigint;
}

export interface CommissionRate {
  tier: MembershipTierLevel;
  level: bigint;
  earningType: EarningType;
  basisPoints: bigint;
  flatAmountCents: bigint;
  active: boolean;
}

export interface EarningsSummary {
  /** total lifetime cents as bigint */
  totalCents: bigint;
  pendingCents: bigint;
  paidCents: bigint;
  directReferralCents: bigint;
  levelOverrideCents: bigint;
  royaltyPoolCents: bigint;
  eventCommissionCents: bigint;
  finFracFranCents: bigint;
  activityBonusCents: bigint;
  fsuBalance: bigint;
}

/** Downline member with display info as expected by MLMPage */
export interface DownlineMember {
  /** string representation of principal */
  principal: string;
  displayName: string;
  tier: MembershipTierLevel;
  directReferralCount: number;
  joinedAt: bigint;
  isActive: boolean;
}

export interface RoyaltyPool {
  id: bigint;
  poolType: RoyaltyPoolType;
  /** totalCents as bigint */
  totalCents: bigint;
  currency: string;
  /** human-readable period label e.g. "Jan 2026 – Feb 2026" */
  periodLabel: string;
  isDistributed: boolean;
  createdAt: bigint;
}

export interface RoyaltyDistribution {
  id: bigint;
  poolId: bigint;
  memberId: Principal;
  /** amountCents as bigint */
  amountCents: bigint;
  currency: string;
  distributedAt: bigint;
}

export interface FSURecord {
  memberId: Principal;
  /** balance — pages reference as `fsuBalance` */
  fsuBalance: bigint;
  lifetimeEarned: bigint;
}

export interface FSUTransaction {
  id: bigint;
  memberId: Principal;
  txType: FSUTxType;
  /** FSU units — pages reference as `fsuAmount` */
  fsuAmount: bigint;
  /** USD cent value — pages reference as `usdCentsValue` */
  usdCentsValue: bigint;
  description: string;
  /** timestamp — pages reference as `createdAt` */
  createdAt: bigint;
}

export interface FSUPoolStatus {
  /** pool size cents — pages reference as `poolSizeCents` */
  poolSizeCents: bigint;
  totalFSUOutstanding: bigint;
  /** fsu value per unit cents — pages reference as `fsuValueCentsEach` */
  fsuValueCentsEach: bigint;
  nextDistributionLabel: string;
}

// ── Event / Ticketing Types ──────────────────────────────────────────────────

export type TicketTierType = "general" | "vip" | "earlyBird" | "vipPlus";
export type EventStatus = "upcoming" | "active" | "past" | "cancelled";

export interface MLMEvent {
  id: bigint;
  title: string;
  description: string;
  location: string;
  /** event date — pages reference as `eventDate` (single timestamp) */
  eventDate: bigint;
  status: EventStatus;
  imageUrl: string | null;
  currency: string;
  totalRevenueCents: bigint;
  createdAt: bigint;
  createdBy: string;
}

export interface TicketTier {
  id: bigint;
  eventId: bigint;
  tierType: TicketTierType;
  name: string;
  priceCents: bigint;
  currency: string;
  capacity: bigint;
  sold: bigint;
  commissionBasisPoints: bigint;
}

export interface Ticket {
  id: bigint;
  eventId: bigint;
  tierId: bigint;
  qrCode: string;
  isUsed: boolean;
  pricePaidCents: bigint;
  purchasedAt: bigint;
}

// ── Extended Backend Interface ────────────────────────────────────────────────
// Augments the generated backendInterface with Tenant, MLM, and Events methods.

export interface ExtendedBackend extends backendInterface {
  // Tenant / PaaS
  createTenant(
    orgName: string,
    contactEmail: string,
    tier?: TenantTier,
    paymentMethod?: PaymentMethod,
  ): Promise<string>;
  getMyTenant(): Promise<Tenant | null>;
  getTenant(id: string): Promise<Tenant | null>;
  listAllTenants(): Promise<Tenant[]>;
  updateTenant(
    orgName: string,
    contactEmail: string,
    customDomain: string | null,
  ): Promise<boolean>;
  suspendTenant(id: string): Promise<boolean>;
  reactivateTenant(id: string): Promise<boolean>;
  upgradeTenant(tier: TenantTier): Promise<boolean>;
  cancelTenant(): Promise<boolean>;
  getMySubscription(): Promise<TenantSubscription | null>;
  addTenantMember(memberPrincipal: string, role: string): Promise<boolean>;
  removeTenantMember(memberPrincipal: string): Promise<boolean>;
  listTenantMembers(): Promise<TenantMember[]>;
  getTenantMemberCount(): Promise<bigint>;
  checkTenantAccess(): Promise<TenantAccessResult>;
  getTenantUsage(): Promise<TenantUsage | null>;
  recordPayment(
    amountCents: number,
    currency: string,
    paymentMethod: PaymentMethod,
    description: string,
  ): Promise<bigint>;
  listBillingHistory(): Promise<BillingRecord[]>;
  getLatestBillingRecord(): Promise<BillingRecord | null>;
  listTenantBillingHistory(tenantId: string): Promise<BillingRecord[]>;
  updateTenantBranding(
    brandName: string,
    logoUrl: string,
    primaryColor: string,
    welcomeMessage: string,
  ): Promise<boolean>;
  getTenantBranding(tenantId: string): Promise<TenantBranding | null>;
  getMyTenantBranding(): Promise<TenantBranding | null>;
  getTenantStats(): Promise<TenantStats | null>;
  getPlatformAnalytics(): Promise<PlatformAnalytics>;

  // MLM - Tiers & Referrals
  initMemberMLM(sponsorCode: string | null): Promise<boolean>;
  getMyTierRecord(): Promise<MemberTierRecord | null>;
  getMemberTierRecord(memberId: string): Promise<MemberTierRecord | null>;
  setMemberTier(target: string, tier: MembershipTierLevel): Promise<boolean>;
  upgradeMemberTier(tier: MembershipTierLevel): Promise<boolean>;
  getMyReferralCode(): Promise<string>;
  resolveReferralCode(code: string): Promise<string | null>;
  listAllMemberTiers(): Promise<MemberTierRecord[]>;
  setCommissionRate(
    tier: MembershipTierLevel,
    level: bigint,
    earningType: EarningType,
    basisPoints: bigint,
    flatAmountCents: bigint,
  ): Promise<boolean>;
  deactivateCommissionRate(
    tier: MembershipTierLevel,
    level: bigint,
    earningType: EarningType,
  ): Promise<boolean>;
  getCommissionRate(
    tier: MembershipTierLevel,
    level: bigint,
    earningType: EarningType,
  ): Promise<CommissionRate | null>;
  getCommissionRates(): Promise<CommissionRate[]>;
  recordEarning(
    memberId: string,
    amountCents: number,
    currency: string,
    earningType: EarningType,
    level: number,
    sourceId: string,
    description: string,
  ): Promise<bigint>;
  processReferralChainBonus(
    memberId: string,
    amountCents: number,
    earningType: EarningType,
    sourceId: string,
  ): Promise<boolean>;
  markEarningPaid(earnId: bigint): Promise<boolean>;
  getMyEarnings(): Promise<EarningRecord[]>;
  getMyEarningsSummary(): Promise<EarningsSummary>;
  getMyDownline(): Promise<DownlineMember[]>;
  getMyUplineChain(): Promise<MemberTierRecord[]>;
  getMemberEarnings(memberId: string): Promise<EarningRecord[]>;
  runPayCycle(memberId: string): Promise<bigint>;
  createRoyaltyPool(
    poolType: RoyaltyPoolType,
    currency: string,
    periodStart: bigint,
    periodEnd: bigint,
  ): Promise<bigint>;
  addToRoyaltyPool(poolId: bigint, amountCents: bigint): Promise<boolean>;
  distributeRoyaltyPool(poolId: bigint, minTierLevel: bigint): Promise<boolean>;
  getRoyaltyPool(poolId: bigint): Promise<RoyaltyPool | null>;
  listRoyaltyPools(): Promise<RoyaltyPool[]>;
  getMyRoyaltyDistributions(): Promise<RoyaltyDistribution[]>;
  addToFSUPool(amountCents: bigint): Promise<boolean>;
  getFSUPoolStatus(): Promise<FSUPoolStatus>;
  getMyFSURecord(): Promise<FSURecord | null>;
  distributeFSU(totalFSU: bigint, description: string): Promise<boolean>;
  redeemFSU(amount: bigint, description: string): Promise<boolean>;
  getMyFSUTransactions(): Promise<FSUTransaction[]>;

  // Events & Ticketing — pages call listMLMEvents / createMLMEvent / getMLMEvent
  createMLMEvent(
    title: string,
    description: string,
    location: string,
    eventDate: bigint,
    currency: string,
    imageUrl: string | null,
  ): Promise<bigint>;
  updateEventStatus(eventId: bigint, status: EventStatus): Promise<boolean>;
  getMLMEvent(eventId: bigint): Promise<MLMEvent | null>;
  listMLMEvents(): Promise<MLMEvent[]>;
  listUpcomingEvents(): Promise<MLMEvent[]>;
  createTicketTier(
    eventId: bigint,
    tierType: TicketTierType,
    name: string,
    priceCents: bigint,
    currency: string,
    capacity: bigint,
    commissionBasisPoints: bigint,
  ): Promise<bigint>;
  getTicketTier(tierId: bigint): Promise<TicketTier | null>;
  listEventTicketTiers(eventId: bigint): Promise<TicketTier[]>;
  purchaseTicket(
    eventId: bigint,
    tierId: bigint,
    referrerCode: string | null,
  ): Promise<bigint>;
  useTicket(ticketId: bigint): Promise<boolean>;
  getMyTickets(): Promise<Ticket[]>;
  listEventTickets(eventId: bigint): Promise<Ticket[]>;
  adminListAllTickets(): Promise<Ticket[]>;
}
