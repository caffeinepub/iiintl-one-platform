import type { Principal } from "@icp-sdk/core/principal";
export interface Some<T> {
    __kind__: "Some";
    value: T;
}
export interface None {
    __kind__: "None";
}
export type Option<T> = Some<T> | None;
export interface ForumReply {
    id: bigint;
    body: string;
    createdAt: bigint;
    createdBy: Principal;
    isModeratorReply: boolean;
    threadId: bigint;
}
export interface OrgMember {
    userId: string;
    joinedAt: bigint;
    role: OrgMemberRole;
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
export interface Transaction {
    id: bigint;
    description: string;
    walletAddress: string;
    timestamp: bigint;
    txType: TransactionType;
    amountICP: number;
}
export interface Wallet {
    linkedAt: bigint;
    walletType: WalletType;
    address: string;
    balanceICP: number;
    walletLabel: string;
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
export enum ForumCategory {
    resources = "resources",
    general = "general",
    regional = "regional",
    campaigns = "campaigns",
    activism = "activism",
    announcements = "announcements"
}
export enum OrgMemberRole {
    member = "member",
    admin = "admin"
}
export enum OrgStatus {
    active = "active",
    archived = "archived"
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
export interface UserSummary {
  id: string;
  displayName: string;
  role: UserRole;
  bio: string;
  avatarUrl: string;
  joinedAt: bigint;
  isActive: boolean;
}
export enum TenantTier {
    starter = "starter",
    organization = "organization",
    enterprise = "enterprise"
}
export enum TenantStatus {
    trial = "trial",
    active = "active",
    suspended = "suspended",
    cancelled = "cancelled"
}
export enum PaymentMethod {
    icp = "icp",
    stripe = "stripe",
    invoice = "invoice"
}
export enum BillingStatus {
    paid = "paid",
    pending = "pending",
    failed = "failed",
    refunded = "refunded"
}
export interface TenantBranding {
    brandName: string;
    logoUrl: string;
    primaryColor: string;
    welcomeMessage: string;
}
export interface TenantMember {
    tenantId: bigint;
    memberPrincipal: Principal;
    role: string;
    addedAt: bigint;
    addedBy: Principal;
}
export interface BillingRecord {
    id: bigint;
    tenantId: bigint;
    amountCents: bigint;
    currency: string;
    status: BillingStatus;
    paymentMethod: PaymentMethod;
    description: string;
    paidAt: bigint;
    periodStart: bigint;
    periodEnd: bigint;
}
export interface TenantUsage {
    memberCount: bigint;
    memberLimit: bigint;
    storageUsedGB: number;
    storageLimit: bigint;
    tier: TenantTier;
    status: TenantStatus;
    daysLeftInTrial: bigint;
    createdAt: bigint;
}
export interface TenantAccessResult {
    allowed: boolean;
    reason: string;
}
export interface TierCount {
    starter: bigint;
    organization: bigint;
    enterprise: bigint;
}
export interface TenantStats {
    id: bigint;
    orgName: string;
    tier: TenantTier;
    status: TenantStatus;
    memberCount: bigint;
    memberLimit: bigint;
    daysActive: bigint;
    monthlyFee: number;
    hasBranding: boolean;
}
export interface PlatformAnalytics {
    totalTenants: bigint;
    activeTenants: bigint;
    trialTenants: bigint;
    suspendedTenants: bigint;
    cancelledTenants: bigint;
    tierBreakdown: TierCount;
    totalMonthlyRevenue: number;
    totalMembers: bigint;
    tenantsWithBranding: bigint;
}
export interface Tenant {
    id: string;
    ownerPrincipal: Principal;
    orgName: string;
    contactEmail: string;
    tier: TenantTier;
    status: TenantStatus;
    memberLimit: bigint;
    storageLimit: bigint;
    billingCycleStart: bigint;
    createdAt: bigint;
    customDomain: string | null;
    branding: TenantBranding | null;
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
export interface backendInterface {
    addTransaction(walletAddress: string, amount: number, description: string, txType: TransactionType): Promise<void>;
    archiveCampaign(id: string): Promise<boolean>;
    archiveOrg(orgId: string): Promise<boolean>;
    archiveThread(threadId: bigint): Promise<boolean>;
    assignCallerUserRole(user: Principal, role: UserRole): Promise<void>;
    createCampaign(title: string, description: string, campaignType: CampaignType, orgId: string, goal: bigint, startDate: bigint, endDate: bigint, tags: Array<string>): Promise<string>;
    createOrg(name: string, description: string, region: string, orgType: string, website: string, foundedYear: bigint): Promise<string>;
    createThread(title: string, body: string, category: ForumCategory, orgId: string | null, tags: Array<string>): Promise<bigint>;
    getCallerUserProfile(): Promise<UserProfile | null>;
    getCallerUserRole(): Promise<UserRole>;
    getCampaign(id: string): Promise<Campaign | null>;
    getCampaignProgress(campaignId: string): Promise<{
        goal: bigint;
        progress: bigint;
    } | null>;
    getCampaignSupporterCount(campaignId: string): Promise<bigint | null>;
    getLinkedWallets(): Promise<Array<Wallet>>;
    getOrg(orgId: string): Promise<Organization | null>;
    getOrgMembers(orgId: string): Promise<Array<OrgMember>>;
    getReplies(threadId: bigint): Promise<Array<ForumReply>>;
    getThread(threadId: bigint): Promise<ForumThread | null>;
    getTransactionHistory(walletAddress: string | null): Promise<Array<Transaction>>;
    getUserOrgs(userId: string): Promise<Array<Organization>>;
    getUserProfile(user: Principal): Promise<UserProfile | null>;
    getWalletBalance(address: string): Promise<number>;
    incrementThreadView(threadId: bigint): Promise<boolean>;
    isCallerAdmin(): Promise<boolean>;
    joinCampaign(campaignId: string): Promise<boolean>;
    joinOrg(orgId: string): Promise<boolean>;
    leaveCampaign(campaignId: string): Promise<boolean>;
    leaveOrg(orgId: string): Promise<boolean>;
    linkWallet(walletType: WalletType, address: string, walletLabel: string): Promise<void>;
    listActiveCampaigns(): Promise<Array<Campaign>>;
    listActiveOrgs(): Promise<Array<Organization>>;
    listCampaigns(): Promise<Array<Campaign>>;
    listCampaignsByOrg(orgId: string): Promise<Array<Campaign>>;
    listOrgs(): Promise<Array<Organization>>;
    listUsers(): Promise<Array<UserSummary>>;
    listThreads(): Promise<Array<ForumThread>>;
    listThreadsByCategory(category: ForumCategory): Promise<Array<ForumThread>>;
    listThreadsByOrg(orgId: string): Promise<Array<ForumThread>>;
    lockThread(threadId: bigint): Promise<boolean>;
    pinThread(threadId: bigint): Promise<boolean>;
    getPreferredLanguage(): Promise<string>;
    registerUser(displayName: string, email: string): Promise<string>;
    replyToThread(threadId: bigint, body: string): Promise<bigint>;
    saveCallerUserProfile(profile: UserProfile): Promise<void>;
    setPreferredLanguage(lang: string): Promise<void>;
    unlinkWallet(address: string): Promise<void>;
    updateCampaign(id: string, title: string, description: string, campaignType: CampaignType, goal: bigint, startDate: bigint, endDate: bigint, tags: Array<string>): Promise<boolean>;
    updateOrg(orgId: string, name: string, description: string, region: string, orgType: string, website: string, foundedYear: bigint): Promise<boolean>;
    createTenant(orgName: string, contactEmail: string, tier: TenantTier, paymentMethod: PaymentMethod): Promise<string>;
    getTenant(tenantId: string): Promise<Tenant | null>;
    getMyTenant(): Promise<Tenant | null>;
    getMySubscription(): Promise<TenantSubscription | null>;
    listAllTenants(): Promise<Array<Tenant>>;
    updateTenant(orgName: string, contactEmail: string, customDomain: string | null): Promise<boolean>;
    suspendTenant(tenantId: string): Promise<boolean>;
    reactivateTenant(tenantId: string): Promise<boolean>;
    upgradeTenant(newTier: TenantTier): Promise<boolean>;
    cancelTenant(): Promise<boolean>;
    addTenantMember(memberPrincipal: string, role: string): Promise<boolean>;
    removeTenantMember(memberPrincipal: string): Promise<boolean>;
    listTenantMembers(): Promise<Array<TenantMember>>;
    getTenantMemberCount(): Promise<bigint>;
    updateTenantBranding(brandName: string, logoUrl: string, primaryColor: string, welcomeMessage: string): Promise<boolean>;
    getTenantBranding(tenantId: bigint): Promise<TenantBranding | null>;
    getMyTenantBranding(): Promise<TenantBranding | null>;
    checkTenantAccess(): Promise<TenantAccessResult>;
    getTenantUsage(): Promise<TenantUsage | null>;
    recordPayment(amountCents: bigint, currency: string, description: string, periodStart: bigint, periodEnd: bigint): Promise<bigint>;
    listBillingHistory(): Promise<Array<BillingRecord>>;
    getLatestBillingRecord(): Promise<BillingRecord | null>;
    listTenantBillingHistory(tenantId: bigint): Promise<Array<BillingRecord>>;
    getTenantStats(): Promise<TenantStats | null>;
    getPlatformAnalytics(): Promise<PlatformAnalytics | null>;
}
