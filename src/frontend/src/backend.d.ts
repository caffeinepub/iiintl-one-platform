import type { Principal } from "@icp-sdk/core/principal";
export interface Some<T> {
    __kind__: "Some";
    value: T;
}
export interface None {
    __kind__: "None";
}
export type Option<T> = Some<T> | None;
export interface FSUPoolStatus {
    totalOutstandingFSU: bigint;
    valuePerUnitCents: bigint;
    poolSizeUnits: bigint;
    nextDistributionLabel: string;
}
export interface CommissionRate {
    basisPoints: bigint;
    tier: MembershipTierLevel;
    flatAmountUnits: bigint;
    isActive: boolean;
    earningType: EarningType;
    depthLevel: bigint;
}
export interface Tenant {
    id: string;
    status: TenantStatus;
    subscription?: TenantSubscription;
    ownerPrincipal: Principal;
    name: string;
    createdAt: bigint;
    memberCount: bigint;
    tier: TenantTier;
    storageUsedMb: bigint;
    updatedAt: bigint;
    branding?: TenantBranding;
    trialEndsAt?: bigint;
}
export interface CrowdfundingCampaign {
    id: string;
    status: CrowdfundingStatus;
    coverImageUrl: string;
    title: string;
    creator: Principal;
    rewardTiers: Array<CrowdfundingRewardTier>;
    fundingModel: CrowdfundingFundingModel;
    approvedByAdmin: boolean;
    createdAt: bigint;
    description: string;
    deadline: bigint;
    tenantId: string;
    goalCents: bigint;
    updatedAt: bigint;
    fsuContributionBps: bigint;
    backerCount: bigint;
    currency: string;
    totalFSUDistributed: bigint;
    category: CrowdfundingCategory;
    raisedCents: bigint;
    milestones: Array<CrowdfundingMilestone>;
}
export interface EarningsSummary {
    eventCommission: bigint;
    activityBonus: bigint;
    totalPaid: bigint;
    totalLifetime: bigint;
    directReferral: bigint;
    levelOverride: bigint;
    totalPending: bigint;
    royaltyPool: bigint;
    finFracFran: bigint;
}
export interface OrgMember {
    userId: string;
    joinedAt: bigint;
    role: OrgMemberRole;
}
export interface TenantMember {
    principal: Principal;
    role: string;
    tenantId: string;
    addedAt: bigint;
}
export interface FSUTransaction {
    id: string;
    member: Principal;
    valuePerUnitCents: bigint;
    createdAt: bigint;
    description: string;
    txType: FSUTxType;
    amount: bigint;
}
export interface DownlineMember {
    principal: Principal;
    referralCode: string;
    joinedAt: bigint;
    tier: MembershipTierLevel;
    directReferralCount: bigint;
}
export interface Transaction {
    id: bigint;
    description: string;
    walletAddress: string;
    timestamp: bigint;
    txType: TransactionType;
    amountICP: number;
}
export interface TenantSubscription {
    monthlyCents: bigint;
    tier: TenantTier;
    renewalDate: bigint;
    startDate: bigint;
}
export interface Wallet {
    linkedAt: bigint;
    walletType: WalletType;
    address: string;
    balanceICP: number;
    walletLabel: string;
}
export interface CrowdfundingRewardTier {
    id: string;
    title: string;
    description: string;
    maxBackers?: bigint;
    backerCount: bigint;
    minPledgeCents: bigint;
}
export interface CrowdfundingMilestone {
    id: string;
    title: string;
    achievedAt?: bigint;
    bonusFSUAmount: bigint;
    description: string;
    targetCents: bigint;
}
export interface RoyaltyPool {
    id: string;
    isDistributed: boolean;
    period: string;
    createdAt: bigint;
    totalUnits: bigint;
    poolType: RoyaltyPoolType;
}
export interface UserSummary {
    id: string;
    bio: string;
    displayName: string;
    joinedAt: bigint;
    role: Role;
    isActive: boolean;
    avatarUrl: string;
}
export interface FSURecord {
    member: Principal;
    balance: bigint;
    lifetimeEarned: bigint;
}
export interface CrowdfundingPledge {
    id: string;
    status: string;
    referrerCode?: string;
    receiptCode: string;
    createdAt: bigint;
    backer: Principal;
    campaignId: string;
    amountCents: bigint;
    rewardTierId?: string;
    fsuEarned: bigint;
}
export interface Campaign {
    id: string;
    status: CampaignStatus;
    title: string;
    endDate: bigint;
    orgId: string;
    goal: bigint;
    createdAt: bigint;
    createdBy: Principal;
    tags: Array<string>;
    description: string;
    progress: bigint;
    supporterCount: bigint;
    campaignType: CampaignType;
    startDate: bigint;
}
export interface EarningRecord {
    id: string;
    member: Principal;
    status: EarningStatus;
    createdAt: bigint;
    description: string;
    sourceId: string;
    earningType: EarningType;
    amountUnits: bigint;
    depthLevel: bigint;
}
export interface CrowdfundingConfig {
    defaultFSUContributionBps: bigint;
    milestoneAchievementBonusBps: bigint;
    creatorFSUBonus: bigint;
}
export interface BillingRecord {
    id: string;
    status: string;
    createdAt: bigint;
    description: string;
    amountCents: bigint;
    tenantId: string;
}
export interface ForumReply {
    id: bigint;
    body: string;
    createdAt: bigint;
    createdBy: Principal;
    isModeratorReply: boolean;
    threadId: bigint;
}
export interface ForumThread {
    id: bigint;
    status: ThreadStatus;
    title: string;
    orgId?: string;
    body: string;
    createdAt: bigint;
    createdBy: Principal;
    tags: Array<string>;
    viewCount: bigint;
    replyCount: bigint;
    category: ForumCategory;
    isPinned: boolean;
}
export interface TenantBranding {
    orgName: string;
    primaryColor: string;
    logoUrl: string;
    welcomeMessage: string;
}
export interface Organization {
    id: string;
    region: string;
    status: OrgStatus;
    members: Array<OrgMember>;
    orgType: string;
    foundedYear: bigint;
    name: string;
    createdAt: bigint;
    createdBy: Principal;
    description: string;
    website: string;
}
export interface MemberTierRecord {
    principal: Principal;
    referralCode: string;
    joinedAt: bigint;
    tier: MembershipTierLevel;
    upgradedAt: bigint;
    sponsorPrincipal?: Principal;
    sponsorCode?: string;
}
export interface UserProfile {
    bio: string;
    displayName: string;
    email: string;
    avatarUrl: string;
}
export enum CampaignStatus {
    active = "active",
    completed = "completed",
    draft = "draft",
    archived = "archived"
}
export enum CampaignType {
    action = "action",
    awareness = "awareness",
    fundraiser = "fundraiser",
    petition = "petition"
}
export enum CrowdfundingCategory {
    research = "research",
    civic = "civic",
    education = "education",
    community = "community",
    crisisResponse = "crisisResponse",
    humanitarian = "humanitarian",
    youth = "youth"
}
export enum CrowdfundingFundingModel {
    allOrNothing = "allOrNothing",
    keepWhatYouRaise = "keepWhatYouRaise"
}
export enum CrowdfundingStatus {
    active = "active",
    cancelled = "cancelled",
    pending = "pending",
    funded = "funded",
    failed = "failed"
}
export enum EarningStatus {
    pending = "pending",
    paid = "paid",
    processing = "processing"
}
export enum EarningType {
    eventCommission = "eventCommission",
    activityBonus = "activityBonus",
    directReferral = "directReferral",
    levelOverride = "levelOverride",
    royaltyPool = "royaltyPool",
    finFracFran = "finFracFran"
}
export enum FSUTxType {
    redeemed = "redeemed",
    transferred = "transferred",
    earned = "earned"
}
export enum ForumCategory {
    resources = "resources",
    general = "general",
    regional = "regional",
    campaigns = "campaigns",
    activism = "activism",
    announcements = "announcements"
}
export enum MembershipTierLevel {
    free = "free",
    founder = "founder",
    executive = "executive",
    affiliate = "affiliate",
    ambassador = "ambassador",
    partner = "partner",
    associate = "associate"
}
export enum OrgMemberRole {
    member = "member",
    admin = "admin"
}
export enum OrgStatus {
    active = "active",
    archived = "archived"
}
export enum Role {
    member = "member",
    admin = "admin",
    moderator = "moderator",
    guest = "guest"
}
export enum RoyaltyPoolType {
    event = "event",
    leadership = "leadership",
    global = "global",
    finFracFran = "finFracFran"
}
export enum TenantStatus {
    trial = "trial",
    active = "active",
    cancelled = "cancelled",
    suspended = "suspended"
}
export enum TenantTier {
    enterprise = "enterprise",
    starter = "starter",
    organization = "organization"
}
export enum ThreadStatus {
    open = "open",
    locked = "locked",
    archived = "archived"
}
export enum TransactionType {
    sent = "sent",
    received = "received"
}
export enum UserRole {
    admin = "admin",
    user = "user",
    guest = "guest"
}
export enum WalletType {
    internetIdentity = "internetIdentity",
    plug = "plug",
    stoic = "stoic"
}
export interface backendInterface {
    addBillingRecord(tenantId: string, amountCents: bigint, description: string, status: string): Promise<string>;
    addTenantMember(tenantId: string, member: Principal, role: string): Promise<boolean>;
    addToFSUPool(amount: bigint, description: string): Promise<void>;
    addToRoyaltyPool(poolId: string, amount: bigint): Promise<boolean>;
    addTransaction(walletAddress: string, amount: number, description: string, txType: TransactionType): Promise<void>;
    adminListAllCrowdfundingCampaigns(): Promise<Array<CrowdfundingCampaign>>;
    adminListCrowdfundingPledges(campaignId: string): Promise<Array<CrowdfundingPledge>>;
    approveCrowdfundingCampaign(campaignId: string): Promise<boolean>;
    archiveCampaign(id: string): Promise<boolean>;
    archiveOrg(orgId: string): Promise<boolean>;
    archiveThread(threadId: bigint): Promise<boolean>;
    assignCallerUserRole(user: Principal, role: UserRole): Promise<void>;
    cancelTenant(tenantId: string): Promise<boolean>;
    /**
     * / Admin-only. Iterates all tenants and suspends any that are in #trial
     * / status with a trialEndsAt timestamp that has already passed.
     * / Returns the count of tenants checked and the count expired.
     */
    checkAndExpireTrials(): Promise<{
        checked: bigint;
        expired: bigint;
    }>;
    createCampaign(title: string, description: string, campaignType: CampaignType, orgId: string, goal: bigint, startDate: bigint, endDate: bigint, tags: Array<string>): Promise<string>;
    createCrowdfundingCampaign(title: string, description: string, category: CrowdfundingCategory, fundingModel: CrowdfundingFundingModel, goalCents: bigint, currency: string, deadline: bigint, coverImageUrl: string, rewardTiers: Array<CrowdfundingRewardTier>, milestones: Array<CrowdfundingMilestone>, fsuContributionBps: bigint | null): Promise<string>;
    createOrg(name: string, description: string, region: string, orgType: string, website: string, foundedYear: bigint): Promise<string>;
    createRoyaltyPool(poolType: RoyaltyPoolType, period: string): Promise<string>;
    createTenant(name: string, tier: TenantTier, trialDays: bigint | null): Promise<string>;
    createThread(title: string, body: string, category: ForumCategory, orgId: string | null, tags: Array<string>): Promise<bigint>;
    deactivateCommissionRate(tier: MembershipTierLevel, depthLevel: bigint, earningType: EarningType): Promise<boolean>;
    distributeFSU(totalFSU: bigint, description: string): Promise<void>;
    distributeRoyaltyPool(poolId: string, minTierLevel: bigint): Promise<boolean>;
    finalizeCrowdfundingCampaign(campaignId: string): Promise<boolean>;
    getCallerUserProfile(): Promise<UserProfile | null>;
    getCallerUserRole(): Promise<UserRole>;
    getCampaign(id: string): Promise<Campaign | null>;
    getCampaignPledges(campaignId: string): Promise<Array<CrowdfundingPledge>>;
    getCampaignProgress(campaignId: string): Promise<{
        goal: bigint;
        progress: bigint;
    } | null>;
    getCampaignSupporterCount(campaignId: string): Promise<bigint | null>;
    getCommissionRate(tier: MembershipTierLevel, depthLevel: bigint, earningType: EarningType): Promise<CommissionRate | null>;
    getCommissionRates(): Promise<Array<CommissionRate>>;
    getCrowdfundingCampaign(campaignId: string): Promise<CrowdfundingCampaign | null>;
    getCrowdfundingConfig(): Promise<CrowdfundingConfig>;
    getCrowdfundingPledge(pledgeId: string): Promise<CrowdfundingPledge | null>;
    /**
     * / Returns all tenants whose trial will expire within the next `daysFromNow` days,
     * / including any that are already past their trial end date but not yet suspended.
     * / Sorted by trialEndsAt ascending (earliest expiry first).
     */
    getExpiringTrials(daysFromNow: bigint): Promise<Array<Tenant>>;
    getFSUPoolStatus(): Promise<FSUPoolStatus>;
    getLinkedWallets(): Promise<Array<Wallet>>;
    getMemberEarnings(member: Principal): Promise<Array<EarningRecord>>;
    getMemberTierRecord(p: Principal): Promise<MemberTierRecord | null>;
    getMyDownline(): Promise<Array<DownlineMember>>;
    getMyEarnings(): Promise<Array<EarningRecord>>;
    getMyEarningsSummary(): Promise<EarningsSummary>;
    getMyFSURecord(): Promise<FSURecord | null>;
    getMyFSUTransactions(): Promise<Array<FSUTransaction>>;
    getMyPledges(): Promise<Array<CrowdfundingPledge>>;
    getMyReferralCode(): Promise<string | null>;
    getMyRoyaltyDistributions(): Promise<Array<EarningRecord>>;
    getMyTenant(): Promise<Tenant | null>;
    getMyTierRecord(): Promise<MemberTierRecord | null>;
    getMyUplineChain(): Promise<Array<MemberTierRecord>>;
    getOrg(orgId: string): Promise<Organization | null>;
    getOrgMembers(orgId: string): Promise<Array<OrgMember>>;
    getPreferredLanguage(): Promise<string>;
    getReplies(threadId: bigint): Promise<Array<ForumReply>>;
    getRoyaltyPool(poolId: string): Promise<RoyaltyPool | null>;
    getTenant(tenantId: string): Promise<Tenant | null>;
    getTenantBranding(tenantId: string): Promise<TenantBranding | null>;
    getThread(threadId: bigint): Promise<ForumThread | null>;
    getTransactionHistory(walletAddress: string | null): Promise<Array<Transaction>>;
    getUserOrgs(userId: string): Promise<Array<Organization>>;
    getUserProfile(user: Principal): Promise<UserProfile | null>;
    getWalletBalance(address: string): Promise<number>;
    incrementThreadView(threadId: bigint): Promise<boolean>;
    initMemberMLM(sponsorCode: string | null): Promise<string>;
    isCallerAdmin(): Promise<boolean>;
    joinCampaign(campaignId: string): Promise<boolean>;
    joinOrg(orgId: string): Promise<boolean>;
    leaveCampaign(campaignId: string): Promise<boolean>;
    leaveOrg(orgId: string): Promise<boolean>;
    linkWallet(walletType: WalletType, address: string, walletLabel: string): Promise<void>;
    listActiveCampaigns(): Promise<Array<Campaign>>;
    listActiveOrgs(): Promise<Array<Organization>>;
    listAllMemberTiers(): Promise<Array<MemberTierRecord>>;
    listBillingHistory(tenantId: string): Promise<Array<BillingRecord>>;
    listCampaigns(): Promise<Array<Campaign>>;
    listCampaignsByOrg(orgId: string): Promise<Array<Campaign>>;
    listCrowdfundingCampaigns(): Promise<Array<CrowdfundingCampaign>>;
    listCrowdfundingCampaignsByCategory(category: CrowdfundingCategory): Promise<Array<CrowdfundingCampaign>>;
    listMyCrowdfundingCampaigns(): Promise<Array<CrowdfundingCampaign>>;
    listOrgs(): Promise<Array<Organization>>;
    listRoyaltyPools(): Promise<Array<RoyaltyPool>>;
    listTenantMembers(tenantId: string): Promise<Array<TenantMember>>;
    listTenants(): Promise<Array<Tenant>>;
    listThreads(): Promise<Array<ForumThread>>;
    listThreadsByCategory(category: ForumCategory): Promise<Array<ForumThread>>;
    listThreadsByOrg(orgId: string): Promise<Array<ForumThread>>;
    listUsers(): Promise<Array<UserSummary>>;
    lockThread(threadId: bigint): Promise<boolean>;
    markEarningPaid(earnId: string): Promise<boolean>;
    pinThread(threadId: bigint): Promise<boolean>;
    pledgeToCrowdfundingCampaign(campaignId: string, amountCents: bigint, rewardTierId: string | null, referrerCode: string | null): Promise<string>;
    processReferralChainBonus(referredMember: Principal, baseAmount: bigint, earningType: EarningType, description: string): Promise<void>;
    reactivateTenant(tenantId: string): Promise<boolean>;
    recordEarning(member: Principal, amountUnits: bigint, earningType: EarningType, description: string, sourceId: string): Promise<string>;
    redeemFSU(amount: bigint, description: string): Promise<boolean>;
    refundPledge(pledgeId: string): Promise<boolean>;
    registerUser(displayName: string, email: string): Promise<string>;
    rejectCrowdfundingCampaign(campaignId: string): Promise<boolean>;
    removeTenantMember(tenantId: string, member: Principal): Promise<boolean>;
    replyToThread(threadId: bigint, body: string): Promise<bigint>;
    resolveReferralCode(code: string): Promise<Principal | null>;
    runPayCycle(member: Principal): Promise<bigint>;
    saveCallerUserProfile(profile: UserProfile): Promise<void>;
    setCommissionRate(tier: MembershipTierLevel, depthLevel: bigint, earningType: EarningType, basisPoints: bigint, flatAmountUnits: bigint): Promise<boolean>;
    setCrowdfundingConfig(defaultFSUContributionBps: bigint, creatorFSUBonus: bigint, milestoneAchievementBonusBps: bigint): Promise<void>;
    setMemberTier(target: Principal, tier: MembershipTierLevel): Promise<boolean>;
    setPreferredLanguage(lang: string): Promise<void>;
    suspendTenant(tenantId: string): Promise<boolean>;
    unlinkWallet(address: string): Promise<void>;
    updateCampaign(id: string, title: string, description: string, campaignType: CampaignType, goal: bigint, startDate: bigint, endDate: bigint, tags: Array<string>): Promise<boolean>;
    updateCrowdfundingCampaign(campaignId: string, title: string, description: string, coverImageUrl: string): Promise<boolean>;
    updateOrg(orgId: string, name: string, description: string, region: string, orgType: string, website: string, foundedYear: bigint): Promise<boolean>;
    updateTenantBranding(tenantId: string, logoUrl: string, primaryColor: string, orgName: string, welcomeMessage: string): Promise<boolean>;
    upgradeMemberTier(tier: MembershipTierLevel): Promise<boolean>;
}
