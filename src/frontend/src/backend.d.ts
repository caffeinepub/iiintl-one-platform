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
    listThreads(): Promise<Array<ForumThread>>;
    listThreadsByCategory(category: ForumCategory): Promise<Array<ForumThread>>;
    listThreadsByOrg(orgId: string): Promise<Array<ForumThread>>;
    lockThread(threadId: bigint): Promise<boolean>;
    pinThread(threadId: bigint): Promise<boolean>;
    registerUser(displayName: string, email: string): Promise<string>;
    replyToThread(threadId: bigint, body: string): Promise<bigint>;
    saveCallerUserProfile(profile: UserProfile): Promise<void>;
    unlinkWallet(address: string): Promise<void>;
    updateCampaign(id: string, title: string, description: string, campaignType: CampaignType, goal: bigint, startDate: bigint, endDate: bigint, tags: Array<string>): Promise<boolean>;
    updateOrg(orgId: string, name: string, description: string, region: string, orgType: string, website: string, foundedYear: bigint): Promise<boolean>;
}
