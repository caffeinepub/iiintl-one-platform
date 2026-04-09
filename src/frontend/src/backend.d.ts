import type { Principal } from "@icp-sdk/core/principal";
export interface Some<T> {
    __kind__: "Some";
    value: T;
}
export interface None {
    __kind__: "None";
}
export type Option<T> = Some<T> | None;
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
export interface Wallet {
    linkedAt: bigint;
    walletType: WalletType;
    address: string;
    balanceICP: number;
    walletLabel: string;
}
export interface CrowdfundingMilestone {
    id: string;
    title: string;
    achievedAt?: bigint;
    bonusFSUAmount: bigint;
    description: string;
    targetCents: bigint;
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
export interface Vote {
    id: bigint;
    weight: bigint;
    voter: Principal;
    delegatedTo?: Principal;
    castAt: bigint;
    choice: VoteChoice;
    proposalId: bigint;
    rankedChoices: Array<RankedChoiceEntry>;
}
export interface CrowdfundingConfig {
    defaultFSUContributionBps: bigint;
    milestoneAchievementBonusBps: bigint;
    creatorFSUBonus: bigint;
}
export interface DAOTokenRecord {
    principal: Principal;
    balance: bigint;
    createdAt: bigint;
    totalEarned: bigint;
    totalBurned: bigint;
    lastAirdropAt?: bigint;
}
export interface Credential {
    id: string;
    status: CredentialStatus;
    title: string;
    expiresAt?: bigint;
    subject: Principal;
    metadata: string;
    approvedAt?: bigint;
    credentialType: CredentialType;
    description: string;
    updatedAt: bigint;
    isPublic: boolean;
    issuedAt: bigint;
    issuedBy: Principal;
    revokedAt?: bigint;
}
export interface Proposal {
    id: bigint;
    status: ProposalStatus;
    title: string;
    mechanism: VotingMechanism;
    enactedAt?: bigint;
    orgId?: string;
    createdAt: bigint;
    tags: Array<string>;
    description: string;
    quorumPercent: bigint;
    tenantId: string;
    proposalType: ProposalType;
    votingClosesAt?: bigint;
    updatedAt: bigint;
    votingOpensAt?: bigint;
    voteWindowHours: bigint;
    proposer: Principal;
    sponsors: Array<Principal>;
    sponsorThreshold: bigint;
}
export interface DAOTokenTransaction {
    id: bigint;
    to: Principal;
    from?: Principal;
    note: string;
    createdAt: bigint;
    txType: DAOTokenTxType;
    amount: bigint;
}
export interface RankedChoiceEntry {
    rank: bigint;
    candidateId: string;
}
export interface Notification {
    id: string;
    title: string;
    notifType: NotificationType;
    createdAt: bigint;
    recipient: Principal;
    isRead: boolean;
    message: string;
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
export interface UserProfile {
    bio: string;
    displayName: string;
    email: string;
    avatarUrl: string;
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
export interface TenantMember {
    principal: Principal;
    role: string;
    tenantId: string;
    addedAt: bigint;
}
export interface DelegationRecord {
    delegateTo: Principal;
    createdAt: bigint;
    isActive: boolean;
    delegator: Principal;
    proposalId?: bigint;
    revokedAt?: bigint;
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
export interface CrowdfundingRewardTier {
    id: string;
    title: string;
    description: string;
    maxBackers?: bigint;
    backerCount: bigint;
    minPledgeCents: bigint;
}
export interface RoyaltyPool {
    id: string;
    isDistributed: boolean;
    period: string;
    createdAt: bigint;
    totalUnits: bigint;
    poolType: RoyaltyPoolType;
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
export interface BillingRecord {
    id: string;
    status: string;
    createdAt: bigint;
    description: string;
    amountCents: bigint;
    tenantId: string;
}
export interface VoteTally {
    noVotes: bigint;
    abstainWeight: bigint;
    yesWeight: bigint;
    totalVoters: bigint;
    mechanism: VotingMechanism;
    yesVotes: bigint;
    quorumPercent: bigint;
    totalVotesCast: bigint;
    rankedResults: Array<[string, bigint]>;
    quorumMet: boolean;
    tallyComputedAt: bigint;
    abstainVotes: bigint;
    noWeight: bigint;
    proposalId: bigint;
    passed: boolean;
}
export interface ForumReply {
    id: bigint;
    body: string;
    createdAt: bigint;
    createdBy: Principal;
    isModeratorReply: boolean;
    threadId: bigint;
}
export interface DebateComment {
    id: bigint;
    isDeleted: boolean;
    content: string;
    parentCommentId?: bigint;
    createdAt: bigint;
    author: Principal;
    editedAt?: bigint;
    proposalId: bigint;
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
export interface FSUPoolStatus {
    totalOutstandingFSU: bigint;
    valuePerUnitCents: bigint;
    poolSizeUnits: bigint;
    nextDistributionLabel: string;
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
export enum CredentialStatus {
    active = "active",
    revoked = "revoked",
    pending = "pending",
    approved = "approved",
    rejected = "rejected"
}
export enum CredentialType {
    verifiedHuman = "verifiedHuman",
    orgRepresentative = "orgRepresentative",
    eventAttendee = "eventAttendee",
    expertiseBadge = "expertiseBadge",
    custom = "custom",
    activistCertification = "activistCertification"
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
export enum DAOTokenTxType {
    votingReward = "votingReward",
    transferred = "transferred",
    earned = "earned",
    airdrop = "airdrop",
    burned = "burned"
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
export enum NotificationType {
    warning = "warning",
    info = "info",
    credentialIssued = "credentialIssued",
    error = "error",
    success = "success",
    credentialApproved = "credentialApproved"
}
export enum OrgMemberRole {
    member = "member",
    admin = "admin"
}
export enum OrgStatus {
    active = "active",
    archived = "archived"
}
export enum ProposalStatus {
    review = "review",
    closed = "closed",
    cancelled = "cancelled",
    enacted = "enacted",
    rejected = "rejected",
    draft = "draft",
    openVote = "openVote"
}
export enum ProposalType {
    resolution = "resolution",
    communityInitiative = "communityInitiative",
    amendment = "amendment",
    budget = "budget",
    policy = "policy"
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
export enum VoteChoice {
    no = "no",
    yes = "yes",
    abstain = "abstain"
}
export enum VotingMechanism {
    simpleMajority = "simpleMajority",
    liquidDelegation = "liquidDelegation",
    supermajority66 = "supermajority66",
    supermajority75 = "supermajority75",
    rankedChoice = "rankedChoice"
}
export enum WalletType {
    internetIdentity = "internetIdentity",
    plug = "plug",
    stoic = "stoic"
}
export interface backendInterface {
    addBillingRecord(tenantId: string, amountCents: bigint, description: string, status: string): Promise<string>;
    addDebateComment(proposalId: bigint, content: string, parentCommentId: bigint | null): Promise<{
        __kind__: "ok";
        ok: bigint;
    } | {
        __kind__: "err";
        err: string;
    }>;
    addTenantMember(tenantId: string, member: Principal, role: string): Promise<boolean>;
    addToFSUPool(amount: bigint, description: string): Promise<void>;
    addToRoyaltyPool(poolId: string, amount: bigint): Promise<boolean>;
    addTransaction(walletAddress: string, amount: number, description: string, txType: TransactionType): Promise<void>;
    adminListAllCrowdfundingCampaigns(): Promise<Array<CrowdfundingCampaign>>;
    adminListCrowdfundingPledges(campaignId: string): Promise<Array<CrowdfundingPledge>>;
    /**
     * / Admin-only. Distributes IIINTL tokens to all MLM-initialized members based on their tier.
     * / Sends a notification to each recipient.
     */
    airdropToAllMembers(): Promise<{
        totalTokens: bigint;
        airdropped: bigint;
    }>;
    approveCredential(credId: string): Promise<boolean>;
    approveCrowdfundingCampaign(campaignId: string): Promise<boolean>;
    archiveCampaign(id: string): Promise<boolean>;
    archiveOrg(orgId: string): Promise<boolean>;
    archiveThread(threadId: bigint): Promise<boolean>;
    assignCallerUserRole(user: Principal, role: UserRole): Promise<void>;
    /**
     * / Burns the caller's tokens. Reduces total supply. Awards 10 platform credits per token burned.
     */
    burnDAOTokens(amount: bigint): Promise<{
        __kind__: "ok";
        ok: bigint;
    } | {
        __kind__: "err";
        err: string;
    }>;
    cancelProposal(proposalId: bigint): Promise<{
        __kind__: "ok";
        ok: string;
    } | {
        __kind__: "err";
        err: string;
    }>;
    cancelTenant(tenantId: string): Promise<boolean>;
    castVote(proposalId: bigint, choice: VoteChoice, rankedChoices: Array<RankedChoiceEntry>): Promise<{
        __kind__: "ok";
        ok: string;
    } | {
        __kind__: "err";
        err: string;
    }>;
    /**
     * / Admin-only. Iterates all tenants and suspends any that are in #trial
     * / status with a trialEndsAt timestamp that has already passed.
     * / Returns the count of tenants checked and the count expired.
     */
    checkAndExpireTrials(): Promise<{
        checked: bigint;
        expired: bigint;
    }>;
    /**
     * / Awards 50 IIINTL voting reward tokens to a member who voted on a proposal.
     * / Prevents double-claiming per proposal per member.
     */
    claimVotingReward(proposalId: bigint): Promise<{
        __kind__: "ok";
        ok: bigint;
    } | {
        __kind__: "err";
        err: string;
    }>;
    closeProposal(proposalId: bigint): Promise<{
        __kind__: "ok";
        ok: string;
    } | {
        __kind__: "err";
        err: string;
    }>;
    createCampaign(title: string, description: string, campaignType: CampaignType, orgId: string, goal: bigint, startDate: bigint, endDate: bigint, tags: Array<string>): Promise<string>;
    createCrowdfundingCampaign(title: string, description: string, category: CrowdfundingCategory, fundingModel: CrowdfundingFundingModel, goalCents: bigint, currency: string, deadline: bigint, coverImageUrl: string, rewardTiers: Array<CrowdfundingRewardTier>, milestones: Array<CrowdfundingMilestone>, fsuContributionBps: bigint | null): Promise<string>;
    createOrg(name: string, description: string, region: string, orgType: string, website: string, foundedYear: bigint): Promise<string>;
    createProposal(proposalType: ProposalType, title: string, description: string, mechanism: VotingMechanism, quorumPercent: bigint, sponsorThreshold: bigint, voteWindowHours: bigint, orgId: string | null, tags: Array<string>): Promise<{
        __kind__: "ok";
        ok: bigint;
    } | {
        __kind__: "err";
        err: string;
    }>;
    createRoyaltyPool(poolType: RoyaltyPoolType, period: string): Promise<string>;
    createTenant(name: string, tier: TenantTier, trialDays: bigint | null): Promise<string>;
    createThread(title: string, body: string, category: ForumCategory, orgId: string | null, tags: Array<string>): Promise<bigint>;
    deactivateCommissionRate(tier: MembershipTierLevel, depthLevel: bigint, earningType: EarningType): Promise<boolean>;
    delegateVote(delegateTo: Principal, proposalId: bigint | null): Promise<{
        __kind__: "ok";
        ok: string;
    } | {
        __kind__: "err";
        err: string;
    }>;
    distributeFSU(totalFSU: bigint, description: string): Promise<void>;
    distributeRoyaltyPool(poolId: string, minTierLevel: bigint): Promise<boolean>;
    editDebateComment(commentId: bigint, newContent: string): Promise<{
        __kind__: "ok";
        ok: string;
    } | {
        __kind__: "err";
        err: string;
    }>;
    enactProposal(proposalId: bigint): Promise<{
        __kind__: "ok";
        ok: string;
    } | {
        __kind__: "err";
        err: string;
    }>;
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
    getCredential(credId: string): Promise<Credential | null>;
    getCrowdfundingCampaign(campaignId: string): Promise<CrowdfundingCampaign | null>;
    getCrowdfundingConfig(): Promise<CrowdfundingConfig>;
    getCrowdfundingPledge(pledgeId: string): Promise<CrowdfundingPledge | null>;
    /**
     * / Returns platform-wide DAO token statistics. Public, no auth required.
     */
    getDAOTokenStats(): Promise<{
        treasuryBalance: bigint;
        totalHolders: bigint;
        totalSupply: bigint;
    }>;
    /**
     * / Returns all DAO transactions where the caller is sender or recipient.
     */
    getDAOTransactionHistory(): Promise<Array<DAOTokenTransaction>>;
    /**
     * / Returns the top 20 token holders by balance. Public, no auth required.
     */
    getDaoLeaderboard(): Promise<Array<DAOTokenRecord>>;
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
    getMemberVote(proposalId: bigint, member: Principal): Promise<Vote | null>;
    getMyCredentials(): Promise<Array<Credential>>;
    /**
     * / Returns the caller's DAO token record. Returns a zero-balance record if not yet initialized.
     */
    getMyDAOBalance(): Promise<DAOTokenRecord>;
    getMyDelegation(): Promise<DelegationRecord | null>;
    getMyDownline(): Promise<Array<DownlineMember>>;
    getMyEarnings(): Promise<Array<EarningRecord>>;
    getMyEarningsSummary(): Promise<EarningsSummary>;
    getMyFSURecord(): Promise<FSURecord | null>;
    getMyFSUTransactions(): Promise<Array<FSUTransaction>>;
    getMyNotifications(): Promise<Array<Notification>>;
    getMyPledges(): Promise<Array<CrowdfundingPledge>>;
    getMyReferralCode(): Promise<string | null>;
    getMyRoyaltyDistributions(): Promise<Array<EarningRecord>>;
    getMyTenant(): Promise<Tenant | null>;
    getMyTierRecord(): Promise<MemberTierRecord | null>;
    getMyUplineChain(): Promise<Array<MemberTierRecord>>;
    getOrg(orgId: string): Promise<Organization | null>;
    getOrgMembers(orgId: string): Promise<Array<OrgMember>>;
    getPreferredLanguage(): Promise<string>;
    getProposal(proposalId: bigint): Promise<Proposal | null>;
    getProposalComments(proposalId: bigint): Promise<Array<DebateComment>>;
    /**
     * / Returns all debate comments for a proposal.
     * / No authentication required.
     */
    getProposalCommentsPublic(proposalId: bigint): Promise<Array<DebateComment>>;
    /**
     * / Returns a single proposal by ID if it is not in draft or cancelled state.
     * / No authentication required.
     */
    getProposalPublic(proposalId: bigint): Promise<Proposal | null>;
    getProposalSponsors(proposalId: bigint): Promise<Array<Principal>>;
    getQuorumStatus(proposalId: bigint): Promise<{
        totalVoters: bigint;
        quorumPercent: bigint;
        percentVoted: bigint;
        quorumMet: boolean;
        votesCast: bigint;
    }>;
    getReplies(threadId: bigint): Promise<Array<ForumReply>>;
    getRoyaltyPool(poolId: string): Promise<RoyaltyPool | null>;
    getTenant(tenantId: string): Promise<Tenant | null>;
    getTenantBranding(tenantId: string): Promise<TenantBranding | null>;
    getThread(threadId: bigint): Promise<ForumThread | null>;
    getTransactionHistory(walletAddress: string | null): Promise<Array<Transaction>>;
    /**
     * / Returns the timestamp of the last heartbeat expiry check and
     * / a human-readable string showing how long until the next check fires.
     */
    getTrialAutomationStatus(): Promise<{
        lastCheck: bigint;
        nextCheckIn: string;
    }>;
    getUserOrgs(userId: string): Promise<Array<Organization>>;
    getUserProfile(user: Principal): Promise<UserProfile | null>;
    getVoteTally(proposalId: bigint): Promise<VoteTally | null>;
    /**
     * / Returns the current vote tally for a proposal.
     * / No authentication required.
     */
    getVoteTallyPublic(proposalId: bigint): Promise<VoteTally | null>;
    getVotesByProposal(proposalId: bigint): Promise<Array<Vote>>;
    getWalletBalance(address: string): Promise<number>;
    incrementThreadView(threadId: bigint): Promise<boolean>;
    initMemberMLM(sponsorCode: string | null): Promise<string>;
    isCallerAdmin(): Promise<boolean>;
    issueCredential(subject: Principal, credType: CredentialType, title: string, description: string, metadata: string, expiresAt: bigint | null): Promise<string>;
    joinCampaign(campaignId: string): Promise<boolean>;
    joinOrg(orgId: string): Promise<boolean>;
    leaveCampaign(campaignId: string): Promise<boolean>;
    leaveOrg(orgId: string): Promise<boolean>;
    linkWallet(walletType: WalletType, address: string, walletLabel: string): Promise<void>;
    listActiveCampaigns(): Promise<Array<Campaign>>;
    listActiveOrgs(): Promise<Array<Organization>>;
    listActiveProposals(): Promise<Array<Proposal>>;
    listAllCredentialsAdmin(): Promise<Array<Credential>>;
    /**
     * / Admin-only. Returns all DAO token records for admin oversight.
     */
    listAllDAOTokensAdmin(): Promise<Array<DAOTokenRecord>>;
    listAllMemberTiers(): Promise<Array<MemberTierRecord>>;
    listBillingHistory(tenantId: string): Promise<Array<BillingRecord>>;
    listCampaigns(): Promise<Array<Campaign>>;
    listCampaignsByOrg(orgId: string): Promise<Array<Campaign>>;
    listCrowdfundingCampaigns(): Promise<Array<CrowdfundingCampaign>>;
    listCrowdfundingCampaignsByCategory(category: CrowdfundingCategory): Promise<Array<CrowdfundingCampaign>>;
    listMyCrowdfundingCampaigns(): Promise<Array<CrowdfundingCampaign>>;
    listOrgs(): Promise<Array<Organization>>;
    listProposals(): Promise<Array<Proposal>>;
    listProposalsByStatus(status: ProposalStatus): Promise<Array<Proposal>>;
    listProposalsByType(proposalType: ProposalType): Promise<Array<Proposal>>;
    /**
     * / Returns all non-draft, non-cancelled proposals visible to the public feed.
     * / No authentication required.
     */
    listProposalsPublic(): Promise<Array<Proposal>>;
    listPublicCredentialsByType(credType: CredentialType): Promise<Array<Credential>>;
    listRoyaltyPools(): Promise<Array<RoyaltyPool>>;
    listTenantMembers(tenantId: string): Promise<Array<TenantMember>>;
    listTenants(): Promise<Array<Tenant>>;
    listThreads(): Promise<Array<ForumThread>>;
    listThreadsByCategory(category: ForumCategory): Promise<Array<ForumThread>>;
    listThreadsByOrg(orgId: string): Promise<Array<ForumThread>>;
    listUsers(): Promise<Array<UserSummary>>;
    lockThread(threadId: bigint): Promise<boolean>;
    markEarningPaid(earnId: string): Promise<boolean>;
    markNotificationRead(notifId: string): Promise<boolean>;
    openProposalForVoting(proposalId: bigint): Promise<{
        __kind__: "ok";
        ok: string;
    } | {
        __kind__: "err";
        err: string;
    }>;
    pinThread(threadId: bigint): Promise<boolean>;
    pledgeToCrowdfundingCampaign(campaignId: string, amountCents: bigint, rewardTierId: string | null, referrerCode: string | null): Promise<string>;
    processReferralChainBonus(referredMember: Principal, baseAmount: bigint, earningType: EarningType, description: string): Promise<void>;
    reactivateTenant(tenantId: string): Promise<boolean>;
    recordEarning(member: Principal, amountUnits: bigint, earningType: EarningType, description: string, sourceId: string): Promise<string>;
    redeemFSU(amount: bigint, description: string): Promise<boolean>;
    refundPledge(pledgeId: string): Promise<boolean>;
    registerUser(displayName: string, email: string): Promise<string>;
    rejectCredential(credId: string): Promise<boolean>;
    rejectCrowdfundingCampaign(campaignId: string): Promise<boolean>;
    removeTenantMember(tenantId: string, member: Principal): Promise<boolean>;
    replyToThread(threadId: bigint, body: string): Promise<bigint>;
    resolveReferralCode(code: string): Promise<Principal | null>;
    revokeCredential(credId: string): Promise<boolean>;
    revokeDelegation(proposalId: bigint | null): Promise<{
        __kind__: "ok";
        ok: string;
    } | {
        __kind__: "err";
        err: string;
    }>;
    runPayCycle(member: Principal): Promise<bigint>;
    saveCallerUserProfile(profile: UserProfile): Promise<void>;
    /**
     * / Sends in-platform notifications to tenant owners based on days remaining
     * / in their trial (7, 3, 1 days) and for already-expired trials.
     * / Returns a summary of how many notifications were sent.
     */
    sendTrialExpiryNotifications(): Promise<string>;
    setCommissionRate(tier: MembershipTierLevel, depthLevel: bigint, earningType: EarningType, basisPoints: bigint, flatAmountUnits: bigint): Promise<boolean>;
    setCrowdfundingConfig(defaultFSUContributionBps: bigint, creatorFSUBonus: bigint, milestoneAchievementBonusBps: bigint): Promise<void>;
    setMemberTier(target: Principal, tier: MembershipTierLevel): Promise<boolean>;
    setPreferredLanguage(lang: string): Promise<void>;
    sponsorProposal(proposalId: bigint): Promise<{
        __kind__: "ok";
        ok: string;
    } | {
        __kind__: "err";
        err: string;
    }>;
    suspendTenant(tenantId: string): Promise<boolean>;
    toggleCredentialPublic(credId: string, isPublic: boolean): Promise<boolean>;
    /**
     * / Peer-to-peer token transfer between members.
     */
    transferDAOTokens(to: Principal, amount: bigint, note: string): Promise<{
        __kind__: "ok";
        ok: bigint;
    } | {
        __kind__: "err";
        err: string;
    }>;
    unlinkWallet(address: string): Promise<void>;
    updateCampaign(id: string, title: string, description: string, campaignType: CampaignType, goal: bigint, startDate: bigint, endDate: bigint, tags: Array<string>): Promise<boolean>;
    updateCrowdfundingCampaign(campaignId: string, title: string, description: string, coverImageUrl: string): Promise<boolean>;
    updateOrg(orgId: string, name: string, description: string, region: string, orgType: string, website: string, foundedYear: bigint): Promise<boolean>;
    updateTenantBranding(tenantId: string, logoUrl: string, primaryColor: string, orgName: string, welcomeMessage: string): Promise<boolean>;
    upgradeMemberTier(tier: MembershipTierLevel): Promise<boolean>;
    withdrawSponsor(proposalId: bigint): Promise<{
        __kind__: "ok";
        ok: string;
    } | {
        __kind__: "err";
        err: string;
    }>;
}
