import type { backendInterface } from "@/backend";
import type {
  CrowdfundingCampaign,
  CrowdfundingCategory,
  CrowdfundingConfig,
  CrowdfundingFundingModel,
  CrowdfundingMilestone,
  CrowdfundingPledge,
  CrowdfundingRewardTier,
  CrowdfundingStatus,
} from "@/backend";
export type {
  CrowdfundingCategory,
  CrowdfundingFundingModel,
  CrowdfundingStatus,
  CrowdfundingRewardTier,
  CrowdfundingMilestone,
  CrowdfundingCampaign,
  CrowdfundingPledge,
  CrowdfundingConfig,
} from "@/backend";
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
// These types are generated from the backend DID — re-exported here for use in frontend pages.

import type {
  CommissionRate,
  DownlineMember,
  EarningRecord,
  EarningStatus,
  EarningType,
  EarningsSummary,
  FSUPoolStatus,
  FSURecord,
  FSUTransaction,
  FSUTxType,
  MemberTierRecord,
  MembershipTierLevel,
  RoyaltyPool,
  RoyaltyPoolType,
} from "@/backend";
export type {
  MembershipTierLevel,
  EarningType,
  EarningStatus,
  RoyaltyPoolType,
  FSUTxType,
  MemberTierRecord,
  EarningRecord,
  CommissionRate,
  EarningsSummary,
  DownlineMember,
  RoyaltyPool,
  FSURecord,
  FSUTransaction,
  FSUPoolStatus,
} from "@/backend";

// RoyaltyDistribution — backend now returns EarningRecord[] for pool distributions
export type RoyaltyDistribution = EarningRecord;

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

// ── Crowdfunding / FinFracFran™ Types ────────────────────────────────────────
// These types are now generated from the backend DID — re-exported at the top of this file.

// ── Extended Backend Interface ────────────────────────────────────────────────
// Augments the generated backendInterface with Tenant, MLM, Events, and Crowdfunding methods.

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
  checkAndExpireTrials(): Promise<{ expired: bigint; checked: bigint }>;
  getExpiringTrials(daysFromNow: bigint): Promise<Tenant[]>;

  // MLM - Tiers & Referrals
  initMemberMLM(sponsorCode: string | null): Promise<string>;
  getMyTierRecord(): Promise<MemberTierRecord | null>;
  getMemberTierRecord(
    p: import("@icp-sdk/core/principal").Principal,
  ): Promise<MemberTierRecord | null>;
  setMemberTier(
    target: import("@icp-sdk/core/principal").Principal,
    tier: MembershipTierLevel,
  ): Promise<boolean>;
  upgradeMemberTier(tier: MembershipTierLevel): Promise<boolean>;
  getMyReferralCode(): Promise<string | null>;
  resolveReferralCode(
    code: string,
  ): Promise<import("@icp-sdk/core/principal").Principal | null>;
  listAllMemberTiers(): Promise<MemberTierRecord[]>;
  setCommissionRate(
    tier: MembershipTierLevel,
    depthLevel: bigint,
    earningType: EarningType,
    basisPoints: bigint,
    flatAmountUnits: bigint,
  ): Promise<boolean>;
  deactivateCommissionRate(
    tier: MembershipTierLevel,
    depthLevel: bigint,
    earningType: EarningType,
  ): Promise<boolean>;
  getCommissionRate(
    tier: MembershipTierLevel,
    depthLevel: bigint,
    earningType: EarningType,
  ): Promise<CommissionRate | null>;
  getCommissionRates(): Promise<CommissionRate[]>;
  recordEarning(
    member: import("@icp-sdk/core/principal").Principal,
    amountUnits: bigint,
    earningType: EarningType,
    description: string,
    sourceId: string,
  ): Promise<string>;
  processReferralChainBonus(
    referredMember: import("@icp-sdk/core/principal").Principal,
    baseAmount: bigint,
    earningType: EarningType,
    description: string,
  ): Promise<void>;
  markEarningPaid(earnId: string): Promise<boolean>;
  getMyEarnings(): Promise<EarningRecord[]>;
  getMyEarningsSummary(): Promise<EarningsSummary>;
  getMyDownline(): Promise<DownlineMember[]>;
  getMyUplineChain(): Promise<MemberTierRecord[]>;
  getMemberEarnings(
    member: import("@icp-sdk/core/principal").Principal,
  ): Promise<EarningRecord[]>;
  runPayCycle(
    member: import("@icp-sdk/core/principal").Principal,
  ): Promise<bigint>;
  createRoyaltyPool(poolType: RoyaltyPoolType, period: string): Promise<string>;
  addToRoyaltyPool(poolId: string, amount: bigint): Promise<boolean>;
  distributeRoyaltyPool(poolId: string, minTierLevel: bigint): Promise<boolean>;
  getRoyaltyPool(poolId: string): Promise<RoyaltyPool | null>;
  listRoyaltyPools(): Promise<RoyaltyPool[]>;
  getMyRoyaltyDistributions(): Promise<RoyaltyDistribution[]>;
  addToFSUPool(amount: bigint, description: string): Promise<void>;
  getFSUPoolStatus(): Promise<FSUPoolStatus>;
  getMyFSURecord(): Promise<FSURecord | null>;
  distributeFSU(totalFSU: bigint, description: string): Promise<void>;
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

  // Cross-tenant admin queries (PaaS Phase F2)
  // These return all records across all tenants for super-admin oversight.
  // Regular list functions (listOrgs, listCampaigns, listThreads, listUsers)
  // now auto-scope to the caller's tenant — admins use these variants instead.
  listAllOrgsAdmin(): Promise<Array<import("@/backend").Organization>>;
  listAllCampaignsAdmin(): Promise<Array<import("@/backend").Campaign>>;
  listAllThreadsAdmin(): Promise<Array<import("@/backend").ForumThread>>;
  listAllUsersAdmin(): Promise<Array<import("@/backend").UserSummary>>;

  // ── Crowdfunding / FinFracFran™ ──────────────────────────────────────────
  // Config
  setCrowdfundingConfig(
    defaultFSUContributionBps: bigint,
    creatorFSUBonus: bigint,
    milestoneAchievementBonusBps: bigint,
  ): Promise<void>;
  getCrowdfundingConfig(): Promise<CrowdfundingConfig>;

  // Admin
  approveCrowdfundingCampaign(campaignId: string): Promise<boolean>;
  rejectCrowdfundingCampaign(campaignId: string): Promise<boolean>;
  adminListAllCrowdfundingCampaigns(): Promise<CrowdfundingCampaign[]>;
  adminListCrowdfundingPledges(
    campaignId: string,
  ): Promise<CrowdfundingPledge[]>;

  // CRUD
  createCrowdfundingCampaign(
    title: string,
    description: string,
    category: CrowdfundingCategory,
    fundingModel: CrowdfundingFundingModel,
    goalCents: bigint,
    currency: string,
    deadline: bigint,
    coverImageUrl: string,
    rewardTiers: CrowdfundingRewardTier[],
    milestones: CrowdfundingMilestone[],
    fsuContributionBps: bigint | null,
  ): Promise<string>;
  updateCrowdfundingCampaign(
    campaignId: string,
    title: string,
    description: string,
    coverImageUrl: string,
  ): Promise<boolean>;
  getCrowdfundingCampaign(
    campaignId: string,
  ): Promise<CrowdfundingCampaign | null>;
  listCrowdfundingCampaigns(): Promise<CrowdfundingCampaign[]>;
  listCrowdfundingCampaignsByCategory(
    category: CrowdfundingCategory,
  ): Promise<CrowdfundingCampaign[]>;
  listMyCrowdfundingCampaigns(): Promise<CrowdfundingCampaign[]>;
  finalizeCrowdfundingCampaign(campaignId: string): Promise<boolean>;

  // Pledges
  pledgeToCrowdfundingCampaign(
    campaignId: string,
    amountCents: bigint,
    rewardTierId: string | null,
    referrerCode: string | null,
  ): Promise<string>;
  getMyPledges(): Promise<CrowdfundingPledge[]>;
  getCampaignPledges(campaignId: string): Promise<CrowdfundingPledge[]>;
  getCrowdfundingPledge(pledgeId: string): Promise<CrowdfundingPledge | null>;
  refundPledge(pledgeId: string): Promise<boolean>;
}
