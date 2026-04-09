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
// Superset of backendInterface — adds Tenant, MLM, Events, and legacy methods.
// useBackend() returns this type. Do NOT make this extend backendInterface directly
// because the stale Tenant/TenantBranding/BillingRecord types would cause
// structural conflicts. All usages are safe via runtime cast (as unknown as ExtendedBackend).

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export interface ExtendedBackend {
  // ── Base backendInterface passthrough (structurally compatible subset) ──
  // All methods on the generated Backend class are available at runtime.
  // Declare only those that pages reference directly on an ExtendedBackend variable.
  isCallerAdmin(): Promise<boolean>;
  registerUser(displayName: string, email: string): Promise<string>;
  getCallerUserProfile(): Promise<import("@/backend").UserProfile | null>;
  saveCallerUserProfile(
    profile: import("@/backend").UserProfile,
  ): Promise<void>;
  getCallerUserRole(): Promise<import("@/backend").UserRole>;
  assignCallerUserRole(
    user: Principal,
    role: import("@/backend").UserRole,
  ): Promise<void>;
  getPreferredLanguage(): Promise<string>;
  setPreferredLanguage(lang: string): Promise<void>;
  createOrg(
    name: string,
    description: string,
    region: string,
    orgType: string,
    website: string,
    foundedYear: bigint,
  ): Promise<string>;
  updateOrg(
    orgId: string,
    name: string,
    description: string,
    region: string,
    orgType: string,
    website: string,
    foundedYear: bigint,
  ): Promise<boolean>;
  archiveOrg(orgId: string): Promise<boolean>;
  listOrgs(): Promise<import("@/backend").Organization[]>;
  listActiveOrgs(): Promise<import("@/backend").Organization[]>;
  getOrg(orgId: string): Promise<import("@/backend").Organization | null>;
  getOrgMembers(orgId: string): Promise<import("@/backend").OrgMember[]>;
  joinOrg(orgId: string): Promise<boolean>;
  leaveOrg(orgId: string): Promise<boolean>;
  getUserOrgs(userId: string): Promise<import("@/backend").Organization[]>;
  listUsers(): Promise<import("@/backend").UserSummary[]>;
  getUserProfile(
    user: Principal,
  ): Promise<import("@/backend").UserProfile | null>;
  createCampaign(
    title: string,
    description: string,
    campaignType: import("@/backend").CampaignType,
    orgId: string,
    goal: bigint,
    startDate: bigint,
    endDate: bigint,
    tags: string[],
  ): Promise<string>;
  updateCampaign(
    id: string,
    title: string,
    description: string,
    campaignType: import("@/backend").CampaignType,
    goal: bigint,
    startDate: bigint,
    endDate: bigint,
    tags: string[],
  ): Promise<boolean>;
  archiveCampaign(id: string): Promise<boolean>;
  listCampaigns(): Promise<import("@/backend").Campaign[]>;
  listActiveCampaigns(): Promise<import("@/backend").Campaign[]>;
  listCampaignsByOrg(orgId: string): Promise<import("@/backend").Campaign[]>;
  getCampaign(id: string): Promise<import("@/backend").Campaign | null>;
  joinCampaign(campaignId: string): Promise<boolean>;
  leaveCampaign(campaignId: string): Promise<boolean>;
  getCampaignProgress(
    campaignId: string,
  ): Promise<{ goal: bigint; progress: bigint } | null>;
  getCampaignSupporterCount(campaignId: string): Promise<bigint | null>;
  createThread(
    title: string,
    body: string,
    category: import("@/backend").ForumCategory,
    orgId: string | null,
    tags: string[],
  ): Promise<bigint>;
  listThreads(): Promise<import("@/backend").ForumThread[]>;
  listThreadsByCategory(
    category: import("@/backend").ForumCategory,
  ): Promise<import("@/backend").ForumThread[]>;
  listThreadsByOrg(orgId: string): Promise<import("@/backend").ForumThread[]>;
  getThread(threadId: bigint): Promise<import("@/backend").ForumThread | null>;
  replyToThread(threadId: bigint, body: string): Promise<bigint>;
  getReplies(threadId: bigint): Promise<import("@/backend").ForumReply[]>;
  pinThread(threadId: bigint): Promise<boolean>;
  lockThread(threadId: bigint): Promise<boolean>;
  archiveThread(threadId: bigint): Promise<boolean>;
  incrementThreadView(threadId: bigint): Promise<boolean>;
  linkWallet(
    walletType: import("@/backend").WalletType,
    address: string,
    walletLabel: string,
  ): Promise<void>;
  unlinkWallet(address: string): Promise<void>;
  getLinkedWallets(): Promise<import("@/backend").Wallet[]>;
  getWalletBalance(address: string): Promise<number>;
  addTransaction(
    walletAddress: string,
    amount: number,
    description: string,
    txType: import("@/backend").TransactionType,
  ): Promise<void>;
  getTransactionHistory(
    walletAddress: string | null,
  ): Promise<import("@/backend").Transaction[]>;
  // Trial automation
  checkAndExpireTrials(): Promise<{ checked: bigint; expired: bigint }>;
  getExpiringTrials(daysFromNow: bigint): Promise<import("@/backend").Tenant[]>;
  sendTrialExpiryNotifications(): Promise<string>;
  getTrialAutomationStatus(): Promise<{
    lastCheck: bigint;
    nextCheckIn: string;
  }>;
  // Notifications
  getMyNotifications(): Promise<import("@/backend").Notification[]>;
  markNotificationRead(notifId: string): Promise<boolean>;
  // Tenant / PaaS
  createTenant(
    name: string,
    tier: import("@/backend").TenantTier,
    trialDays: bigint | null,
  ): Promise<string>;
  getMyTenant(): Promise<import("@/backend").Tenant | null>;
  getTenant(id: string): Promise<import("@/backend").Tenant | null>;
  listTenants(): Promise<import("@/backend").Tenant[]>;
  listAllTenants(): Promise<import("@/backend").Tenant[]>;
  suspendTenant(id: string): Promise<boolean>;
  reactivateTenant(id: string): Promise<boolean>;
  cancelTenant(tenantId: string): Promise<boolean>;
  addTenantMember(
    tenantId: string,
    member: Principal,
    role: string,
  ): Promise<boolean>;
  removeTenantMember(tenantId: string, member: Principal): Promise<boolean>;
  listTenantMembers(
    tenantId: string,
  ): Promise<import("@/backend").TenantMember[]>;
  addBillingRecord(
    tenantId: string,
    amountCents: bigint,
    description: string,
    status: string,
  ): Promise<string>;
  listBillingHistory(
    tenantId: string,
  ): Promise<import("@/backend").BillingRecord[]>;
  upgradeTenant(tier: TenantTier): Promise<boolean>;
  getMySubscription(): Promise<TenantSubscription | null>;
  getTenantMemberCount(): Promise<bigint>;
  getTenantUsage(): Promise<TenantUsage | null>;
  recordPayment(
    amountCents: number,
    currency: string,
    paymentMethod: PaymentMethod,
    description: string,
  ): Promise<bigint>;
  getLatestBillingRecord(): Promise<BillingRecord | null>;
  listTenantBillingHistory(
    tenantId: string,
  ): Promise<import("@/backend").BillingRecord[]>;
  updateTenantBranding(
    tenantId: string,
    logoUrl: string,
    primaryColor: string,
    orgName: string,
    welcomeMessage: string,
  ): Promise<boolean>;
  getTenantBranding(
    tenantId: string,
  ): Promise<import("@/backend").TenantBranding | null>;
  getMyTenantBranding(): Promise<import("@/backend").TenantBranding | null>;
  updateTenant(
    orgName: string,
    contactEmail: string,
    customDomain: string | null,
  ): Promise<boolean>;
  getTenantStats(): Promise<TenantStats | null>;
  getPlatformAnalytics(): Promise<PlatformAnalytics>;
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

  // ── MLM — Tiers, Referrals, Earnings, Royalty, FSU ──────────────────────
  initMemberMLM(sponsorCode: string | null): Promise<string>;
  getMyTierRecord(): Promise<MemberTierRecord | null>;
  getMemberTierRecord(p: Principal): Promise<MemberTierRecord | null>;
  setMemberTier(target: Principal, tier: MembershipTierLevel): Promise<boolean>;
  upgradeMemberTier(tier: MembershipTierLevel): Promise<boolean>;
  getMyReferralCode(): Promise<string | null>;
  resolveReferralCode(code: string): Promise<Principal | null>;
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
    member: Principal,
    amountUnits: bigint,
    earningType: EarningType,
    description: string,
    sourceId: string,
  ): Promise<string>;
  processReferralChainBonus(
    referredMember: Principal,
    baseAmount: bigint,
    earningType: EarningType,
    description: string,
  ): Promise<void>;
  markEarningPaid(earnId: string): Promise<boolean>;
  getMyEarnings(): Promise<EarningRecord[]>;
  getMyEarningsSummary(): Promise<EarningsSummary>;
  getMyDownline(): Promise<DownlineMember[]>;
  getMyUplineChain(): Promise<MemberTierRecord[]>;
  getMemberEarnings(member: Principal): Promise<EarningRecord[]>;
  runPayCycle(member: Principal): Promise<bigint>;
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

  // ── Events & Ticketing ────────────────────────────────────────────────────
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

  // ── Governance / Voting & Democracy Engine ───────────────────────────────
  createProposal(
    proposalType: import("@/backend").ProposalType,
    title: string,
    description: string,
    mechanism: import("@/backend").VotingMechanism,
    quorumPercent: bigint,
    sponsorThreshold: bigint,
    voteWindowHours: bigint,
    orgId: string | null,
    tags: string[],
  ): Promise<{ __kind__: "ok"; ok: bigint } | { __kind__: "err"; err: string }>;
  sponsorProposal(
    proposalId: bigint,
  ): Promise<{ __kind__: "ok"; ok: string } | { __kind__: "err"; err: string }>;
  withdrawSponsor(
    proposalId: bigint,
  ): Promise<{ __kind__: "ok"; ok: string } | { __kind__: "err"; err: string }>;
  openProposalForVoting(
    proposalId: bigint,
  ): Promise<{ __kind__: "ok"; ok: string } | { __kind__: "err"; err: string }>;
  closeProposal(
    proposalId: bigint,
  ): Promise<{ __kind__: "ok"; ok: string } | { __kind__: "err"; err: string }>;
  enactProposal(
    proposalId: bigint,
  ): Promise<{ __kind__: "ok"; ok: string } | { __kind__: "err"; err: string }>;
  cancelProposal(
    proposalId: bigint,
  ): Promise<{ __kind__: "ok"; ok: string } | { __kind__: "err"; err: string }>;
  castVote(
    proposalId: bigint,
    choice: import("@/backend").VoteChoice,
    rankedChoices: import("@/backend").RankedChoiceEntry[],
  ): Promise<{ __kind__: "ok"; ok: string } | { __kind__: "err"; err: string }>;
  delegateVote(
    delegateTo: import("@icp-sdk/core/principal").Principal,
    proposalId: bigint | null,
  ): Promise<{ __kind__: "ok"; ok: string } | { __kind__: "err"; err: string }>;
  revokeDelegation(
    proposalId: bigint | null,
  ): Promise<{ __kind__: "ok"; ok: string } | { __kind__: "err"; err: string }>;
  getProposal(proposalId: bigint): Promise<import("@/backend").Proposal | null>;
  listProposals(): Promise<import("@/backend").Proposal[]>;
  listProposalsByStatus(
    status: import("@/backend").ProposalStatus,
  ): Promise<import("@/backend").Proposal[]>;
  listProposalsByType(
    proposalType: import("@/backend").ProposalType,
  ): Promise<import("@/backend").Proposal[]>;
  listActiveProposals(): Promise<import("@/backend").Proposal[]>;
  getProposalSponsors(
    proposalId: bigint,
  ): Promise<import("@icp-sdk/core/principal").Principal[]>;
  getVoteTally(
    proposalId: bigint,
  ): Promise<import("@/backend").VoteTally | null>;
  getVotesByProposal(proposalId: bigint): Promise<import("@/backend").Vote[]>;
  getMemberVote(
    proposalId: bigint,
    member: import("@icp-sdk/core/principal").Principal,
  ): Promise<import("@/backend").Vote | null>;
  getQuorumStatus(proposalId: bigint): Promise<{
    totalVoters: bigint;
    quorumPercent: bigint;
    percentVoted: bigint;
    quorumMet: boolean;
    votesCast: bigint;
  }>;
  addDebateComment(
    proposalId: bigint,
    content: string,
    parentCommentId: bigint | null,
  ): Promise<{ __kind__: "ok"; ok: bigint } | { __kind__: "err"; err: string }>;
  editDebateComment(
    commentId: bigint,
    newContent: string,
  ): Promise<{ __kind__: "ok"; ok: string } | { __kind__: "err"; err: string }>;
  getProposalComments(
    proposalId: bigint,
  ): Promise<import("@/backend").DebateComment[]>;
  // Public (unauthenticated) governance queries
  listProposalsPublic(): Promise<import("@/backend").Proposal[]>;
  getProposalPublic(
    proposalId: bigint,
  ): Promise<import("@/backend").Proposal | null>;
  getProposalCommentsPublic(
    proposalId: bigint,
  ): Promise<import("@/backend").DebateComment[]>;
  getVoteTallyPublic(
    proposalId: bigint,
  ): Promise<import("@/backend").VoteTally | null>;
  getMyDelegation(): Promise<import("@/backend").DelegationRecord | null>;

  // ── Credentials (Decentralized Identity) ────────────────────────────────
  issueCredential(
    subject: import("@icp-sdk/core/principal").Principal,
    credType: import("@/backend").CredentialType,
    title: string,
    description: string,
    metadata: string,
    expiresAt: bigint | null,
  ): Promise<string>;
  approveCredential(credId: string): Promise<boolean>;
  rejectCredential(credId: string): Promise<boolean>;
  revokeCredential(credId: string): Promise<boolean>;
  listAllCredentialsAdmin(): Promise<import("@/backend").Credential[]>;
  getCredential(credId: string): Promise<import("@/backend").Credential | null>;
  getMyCredentials(): Promise<import("@/backend").Credential[]>;
  listPublicCredentialsByType(
    credType: import("@/backend").CredentialType,
  ): Promise<import("@/backend").Credential[]>;
  toggleCredentialPublic(credId: string, isPublic: boolean): Promise<boolean>;

  // ── DAO Governance Token ─────────────────────────────────────────────────
  airdropToAllMembers(): Promise<{ totalTokens: bigint; airdropped: bigint }>;
  getDAOTokenStats(): Promise<{
    treasuryBalance: bigint;
    totalHolders: bigint;
    totalSupply: bigint;
  }>;
  listAllDAOTokensAdmin(): Promise<import("@/backend").DAOTokenRecord[]>;
  getMyDAOBalance(): Promise<import("@/backend").DAOTokenRecord>;
  getDaoLeaderboard(): Promise<import("@/backend").DAOTokenRecord[]>;
  getDAOTransactionHistory(): Promise<
    import("@/backend").DAOTokenTransaction[]
  >;
  burnDAOTokens(
    amount: bigint,
  ): Promise<{ __kind__: "ok"; ok: bigint } | { __kind__: "err"; err: string }>;
  transferDAOTokens(
    to: import("@icp-sdk/core/principal").Principal,
    amount: bigint,
    note: string,
  ): Promise<{ __kind__: "ok"; ok: bigint } | { __kind__: "err"; err: string }>;
  claimVotingReward(
    proposalId: bigint,
  ): Promise<{ __kind__: "ok"; ok: bigint } | { __kind__: "err"; err: string }>;
}
