import type { UserRole } from "@/context/AuthContext";

// ─── Organization Types ───────────────────────────────────────────────────────

export type OrgType =
  | "Global Secretariat"
  | "Regional Chapter"
  | "National Chapter"
  | "Advocacy Group"
  | "Youth Network"
  | "Research Institute"
  | "Coalition"
  | "Task Force";

export type OrgStatus = "active" | "inactive" | "archived";
export type OrgRegion =
  | "Global"
  | "Americas"
  | "Europe"
  | "Africa"
  | "Asia-Pacific"
  | "Middle East"
  | "Caribbean"
  | "South Asia";

export interface MockOrganization {
  id: string;
  name: string;
  type: OrgType;
  region: OrgRegion;
  description: string;
  memberCount: number;
  campaignCount: number;
  resourceCount: number;
  activityCount: number;
  foundedYear: number;
  status: OrgStatus;
  website?: string;
  tagline?: string;
  color: string;
}

// ─── Member Types ─────────────────────────────────────────────────────────────

export type MemberStatus = "active" | "inactive" | "pending";

export interface MockMember {
  id: string;
  name: string;
  email: string;
  role: UserRole;
  organization: string;
  organizationId: string;
  region: OrgRegion;
  bio: string;
  joinedDate: string;
  status: MemberStatus;
  campaignCount: number;
  postCount: number;
  avatar: null;
  title?: string;
}

// ─── Mock Organizations ───────────────────────────────────────────────────────

export const MOCK_ORGANIZATIONS: MockOrganization[] = [
  {
    id: "org-1",
    name: "IIIntl Global Council",
    type: "Global Secretariat",
    region: "Global",
    description:
      "The governing body of the IIIntl One Platform, coordinating independent organizations worldwide to advance shared civic goals and global interdependence.",
    memberCount: 340,
    campaignCount: 18,
    resourceCount: 42,
    activityCount: 1240,
    foundedYear: 2018,
    status: "active",
    website: "https://iiintl.org",
    tagline: "Connecting the world through independence and solidarity",
    color: "blue",
  },
  {
    id: "org-2",
    name: "Americas Chapter",
    type: "Regional Chapter",
    region: "Americas",
    description:
      "Representing member organizations across North, Central, and South America, driving civic engagement and political advocacy throughout the Western Hemisphere.",
    memberCount: 87,
    campaignCount: 7,
    resourceCount: 18,
    activityCount: 385,
    foundedYear: 2019,
    status: "active",
    website: "https://americas.iiintl.org",
    tagline: "One hemisphere, many voices, shared purpose",
    color: "green",
  },
  {
    id: "org-3",
    name: "Africa Region",
    type: "Regional Chapter",
    region: "Africa",
    description:
      "Uniting activists, scholars, and community leaders across the African continent to amplify marginalized voices and build sustainable civic infrastructure.",
    memberCount: 63,
    campaignCount: 5,
    resourceCount: 12,
    activityCount: 274,
    foundedYear: 2020,
    status: "active",
    website: "https://africa.iiintl.org",
    tagline: "Africa's future is built by Africa's people",
    color: "orange",
  },
  {
    id: "org-4",
    name: "European Alliance",
    type: "Regional Chapter",
    region: "Europe",
    description:
      "A coalition of European civic organizations advocating for democratic values, digital rights, and cross-border solidarity within the EU and beyond.",
    memberCount: 112,
    campaignCount: 9,
    resourceCount: 24,
    activityCount: 520,
    foundedYear: 2019,
    status: "active",
    website: "https://europe.iiintl.org",
    tagline: "Democratic values, European solidarity",
    color: "indigo",
  },
  {
    id: "org-5",
    name: "Asia-Pacific Network",
    type: "Regional Chapter",
    region: "Asia-Pacific",
    description:
      "Bridging diverse cultures and political contexts across Southeast Asia, East Asia, Australia, and the Pacific Islands through civic education and cross-cultural exchange.",
    memberCount: 95,
    campaignCount: 6,
    resourceCount: 16,
    activityCount: 318,
    foundedYear: 2020,
    status: "active",
    website: "https://apac.iiintl.org",
    tagline: "Diversity is our strength, unity our goal",
    color: "purple",
  },
  {
    id: "org-6",
    name: "Middle East Dialogue Forum",
    type: "Advocacy Group",
    region: "Middle East",
    description:
      "Fostering peaceful dialogue, civic empowerment, and cross-community cooperation across the Middle East and North Africa region.",
    memberCount: 41,
    campaignCount: 3,
    resourceCount: 9,
    activityCount: 142,
    foundedYear: 2021,
    status: "active",
    website: "https://mena.iiintl.org",
    tagline: "Peace through understanding",
    color: "yellow",
  },
  {
    id: "org-7",
    name: "Global Youth Coalition",
    type: "Youth Network",
    region: "Global",
    description:
      "Empowering the next generation of civic leaders and activists worldwide, with dedicated programs for youth aged 16-30 across all member organizations.",
    memberCount: 156,
    campaignCount: 11,
    resourceCount: 22,
    activityCount: 680,
    foundedYear: 2019,
    status: "active",
    website: "https://youth.iiintl.org",
    tagline: "Young voices driving global change",
    color: "pink",
  },
  {
    id: "org-8",
    name: "Digital Rights Task Force",
    type: "Task Force",
    region: "Global",
    description:
      "A specialized body addressing internet freedom, data sovereignty, algorithmic accountability, and digital inclusion across all member regions.",
    memberCount: 28,
    campaignCount: 4,
    resourceCount: 31,
    activityCount: 196,
    foundedYear: 2022,
    status: "active",
    website: "https://digital.iiintl.org",
    tagline: "Your rights don't end at the firewall",
    color: "teal",
  },
  {
    id: "org-9",
    name: "Caribbean Solidarity Network",
    type: "National Chapter",
    region: "Caribbean",
    description:
      "Uniting island communities across the Caribbean basin to address climate resilience, sovereignty, and economic justice for small island developing states.",
    memberCount: 34,
    campaignCount: 3,
    resourceCount: 8,
    activityCount: 118,
    foundedYear: 2021,
    status: "active",
    tagline: "Small islands, mighty voices",
    color: "cyan",
  },
  {
    id: "org-10",
    name: "South Asia Policy Institute",
    type: "Research Institute",
    region: "South Asia",
    description:
      "Conducting rigorous research and policy analysis on civic governance, electoral integrity, and human rights across South Asian democracies.",
    memberCount: 52,
    campaignCount: 4,
    resourceCount: 47,
    activityCount: 229,
    foundedYear: 2020,
    status: "active",
    website: "https://sapi.iiintl.org",
    tagline: "Evidence-based advocacy for South Asia",
    color: "rose",
  },
];

// ─── Mock Members ─────────────────────────────────────────────────────────────

export const MOCK_MEMBERS: MockMember[] = [
  {
    id: "mem-1",
    name: "Alex Rivera",
    email: "alex@iiintl.org",
    role: "admin",
    organization: "IIIntl Global Council",
    organizationId: "org-1",
    region: "Americas",
    bio: "Platform administrator and global coordinator. Former human rights attorney with 15 years of experience in international advocacy. Passionate about digital democracy and civic technology.",
    joinedDate: "2018-03-12",
    status: "active",
    campaignCount: 12,
    postCount: 87,
    avatar: null,
    title: "Global Platform Administrator",
  },
  {
    id: "mem-2",
    name: "Maria Santos",
    email: "maria@iiintl.org",
    role: "org_admin",
    organization: "Americas Chapter",
    organizationId: "org-2",
    region: "Americas",
    bio: "Americas Chapter lead and community organizer based in São Paulo, Brazil. Specializes in grassroots mobilization, labor rights, and democratic participation in Latin America.",
    joinedDate: "2019-06-04",
    status: "active",
    campaignCount: 8,
    postCount: 54,
    avatar: null,
    title: "Americas Chapter Director",
  },
  {
    id: "mem-3",
    name: "James Okonkwo",
    email: "james@iiintl.org",
    role: "member",
    organization: "Africa Region",
    organizationId: "org-3",
    region: "Africa",
    bio: "Environmental justice advocate and community leader from Lagos, Nigeria. Works on climate adaptation, land rights, and clean energy access for rural African communities.",
    joinedDate: "2020-02-18",
    status: "active",
    campaignCount: 5,
    postCount: 32,
    avatar: null,
    title: "Environmental Justice Coordinator",
  },
  {
    id: "mem-4",
    name: "Priya Sharma",
    email: "priya@iiintl.org",
    role: "activist",
    organization: "Asia-Pacific Network",
    organizationId: "org-5",
    region: "Asia-Pacific",
    bio: "Digital rights activist and tech policy researcher based in Mumbai. Focuses on algorithmic accountability, surveillance reform, and internet access for underserved communities.",
    joinedDate: "2020-09-30",
    status: "active",
    campaignCount: 7,
    postCount: 61,
    avatar: null,
    title: "Digital Rights Researcher",
  },
  {
    id: "mem-5",
    name: "Elena Volkov",
    email: "elena@iiintl.org",
    role: "member",
    organization: "European Alliance",
    organizationId: "org-4",
    region: "Europe",
    bio: "Democracy advocate and election observer from Warsaw, Poland. Specializes in electoral integrity, anti-disinformation, and civic education programs for young Europeans.",
    joinedDate: "2019-11-08",
    status: "active",
    campaignCount: 4,
    postCount: 28,
    avatar: null,
    title: "Democracy & Elections Specialist",
  },
  {
    id: "mem-6",
    name: "Fatima Al-Rashid",
    email: "fatima@iiintl.org",
    role: "activist",
    organization: "Middle East Dialogue Forum",
    organizationId: "org-6",
    region: "Middle East",
    bio: "Peace educator and interfaith dialogue facilitator from Amman, Jordan. Builds bridges across religious and cultural divides through community dialogue and civic education programs.",
    joinedDate: "2021-04-15",
    status: "active",
    campaignCount: 3,
    postCount: 19,
    avatar: null,
    title: "Peace Education Facilitator",
  },
  {
    id: "mem-7",
    name: "Tomás García",
    email: "tomas@iiintl.org",
    role: "member",
    organization: "Americas Chapter",
    organizationId: "org-2",
    region: "Americas",
    bio: "Labor rights organizer and policy advocate from Mexico City. Works with migrant worker communities across North America on fair wage campaigns and legal protections.",
    joinedDate: "2020-07-22",
    status: "active",
    campaignCount: 6,
    postCount: 41,
    avatar: null,
    title: "Labor Rights Organizer",
  },
  {
    id: "mem-8",
    name: "Aisha Kamara",
    email: "aisha@iiintl.org",
    role: "activist",
    organization: "Africa Region",
    organizationId: "org-3",
    region: "Africa",
    bio: "Women's rights advocate and community health worker from Freetown, Sierra Leone. Champions maternal health access, girls' education, and gender-based violence prevention.",
    joinedDate: "2021-01-09",
    status: "active",
    campaignCount: 4,
    postCount: 22,
    avatar: null,
    title: "Women's Rights Advocate",
  },
  {
    id: "mem-9",
    name: "Hiroshi Nakamura",
    email: "hiroshi@iiintl.org",
    role: "member",
    organization: "Asia-Pacific Network",
    organizationId: "org-5",
    region: "Asia-Pacific",
    bio: "Nuclear disarmament advocate and peace researcher based in Hiroshima. Leads youth education programs about atomic bomb history and global non-proliferation advocacy.",
    joinedDate: "2020-08-06",
    status: "active",
    campaignCount: 3,
    postCount: 17,
    avatar: null,
    title: "Peace Research Coordinator",
  },
  {
    id: "mem-10",
    name: "Amara Diallo",
    email: "amara@iiintl.org",
    role: "org_admin",
    organization: "Africa Region",
    organizationId: "org-3",
    region: "Africa",
    bio: "Community development specialist and civic trainer from Conakry, Guinea. Manages the Africa Region chapter operations and leads capacity-building programs for civil society.",
    joinedDate: "2020-03-14",
    status: "active",
    campaignCount: 7,
    postCount: 48,
    avatar: null,
    title: "Africa Region Chapter Lead",
  },
  {
    id: "mem-11",
    name: "Sofia Andersen",
    email: "sofia@iiintl.org",
    role: "member",
    organization: "European Alliance",
    organizationId: "org-4",
    region: "Europe",
    bio: "Climate justice activist and renewable energy campaigner from Copenhagen, Denmark. Works on EU climate policy advocacy and community energy transition projects.",
    joinedDate: "2019-09-17",
    status: "active",
    campaignCount: 5,
    postCount: 33,
    avatar: null,
    title: "Climate Justice Campaigner",
  },
  {
    id: "mem-12",
    name: "Kaveh Rashidian",
    email: "kaveh@iiintl.org",
    role: "activist",
    organization: "Middle East Dialogue Forum",
    organizationId: "org-6",
    region: "Middle East",
    bio: "Human rights lawyer and civic journalist based in Vienna (originally from Tehran). Focuses on freedom of press, political prisoner advocacy, and diaspora civic engagement.",
    joinedDate: "2021-05-20",
    status: "active",
    campaignCount: 2,
    postCount: 14,
    avatar: null,
    title: "Human Rights & Press Freedom",
  },
  {
    id: "mem-13",
    name: "Destiny Osei",
    email: "destiny@iiintl.org",
    role: "activist",
    organization: "Global Youth Coalition",
    organizationId: "org-7",
    region: "Africa",
    bio: "Youth climate activist and student organizer from Accra, Ghana. Co-founder of a school climate strike network across West Africa and UN youth delegate for climate policy.",
    joinedDate: "2021-09-01",
    status: "active",
    campaignCount: 9,
    postCount: 71,
    avatar: null,
    title: "Youth Climate Organizer",
  },
  {
    id: "mem-14",
    name: "Zara Ahmed",
    email: "zara@iiintl.org",
    role: "member",
    organization: "South Asia Policy Institute",
    organizationId: "org-10",
    region: "South Asia",
    bio: "Policy researcher and elections expert based in Karachi, Pakistan. Analyzes electoral systems, voter suppression patterns, and civic participation trends across South Asia.",
    joinedDate: "2020-11-25",
    status: "active",
    campaignCount: 2,
    postCount: 19,
    avatar: null,
    title: "Elections Policy Researcher",
  },
  {
    id: "mem-15",
    name: "Miguel Fernandes",
    email: "miguel@iiintl.org",
    role: "member",
    organization: "Caribbean Solidarity Network",
    organizationId: "org-9",
    region: "Caribbean",
    bio: "Climate resilience coordinator and coastal community advocate from Kingston, Jamaica. Leads small island climate adaptation initiatives and loss-and-damage advocacy at international forums.",
    joinedDate: "2021-03-08",
    status: "active",
    campaignCount: 3,
    postCount: 21,
    avatar: null,
    title: "Climate Resilience Coordinator",
  },
  {
    id: "mem-16",
    name: "Yuki Tanaka",
    email: "yuki@iiintl.org",
    role: "activist",
    organization: "Digital Rights Task Force",
    organizationId: "org-8",
    region: "Asia-Pacific",
    bio: "Privacy technologist and open-source advocate based in Tokyo. Builds tools for secure communications, fights biometric surveillance expansion, and trains activists in digital security.",
    joinedDate: "2022-02-11",
    status: "active",
    campaignCount: 4,
    postCount: 36,
    avatar: null,
    title: "Privacy Technologist",
  },
  {
    id: "mem-17",
    name: "Isabelle Morin",
    email: "isabelle@iiintl.org",
    role: "org_admin",
    organization: "European Alliance",
    organizationId: "org-4",
    region: "Europe",
    bio: "EU policy coordinator and democracy advocate from Paris. Specializes in European Parliament liaison work, EU digital regulation, and cross-border civil society networking.",
    joinedDate: "2019-07-29",
    status: "active",
    campaignCount: 6,
    postCount: 44,
    avatar: null,
    title: "EU Policy Coordinator",
  },
];

// ─── Helper Functions ─────────────────────────────────────────────────────────

export function getOrgById(id: string): MockOrganization | undefined {
  return MOCK_ORGANIZATIONS.find((org) => org.id === id);
}

export function getMembersByOrgId(orgId: string): MockMember[] {
  return MOCK_MEMBERS.filter((m) => m.organizationId === orgId);
}

export function getRoleBadgeClasses(role: UserRole): string {
  switch (role) {
    case "super_admin":
      return "bg-red-100 text-red-700 border-red-200";
    case "admin":
      return "bg-orange-100 text-orange-700 border-orange-200";
    case "org_admin":
      return "bg-yellow-100 text-yellow-700 border-yellow-200";
    case "member":
      return "bg-green-100 text-green-700 border-green-200";
    case "activist":
      return "bg-blue-100 text-blue-700 border-blue-200";
    case "guest":
      return "bg-gray-100 text-gray-600 border-gray-200";
    default:
      return "bg-gray-100 text-gray-600 border-gray-200";
  }
}

export function getStatusBadgeClasses(
  status: MemberStatus | OrgStatus,
): string {
  switch (status) {
    case "active":
      return "bg-green-100 text-green-700 border-green-200";
    case "inactive":
      return "bg-gray-100 text-gray-500 border-gray-200";
    case "archived":
      return "bg-gray-100 text-gray-500 border-gray-200";
    case "pending":
      return "bg-yellow-100 text-yellow-700 border-yellow-200";
    default:
      return "bg-gray-100 text-gray-500 border-gray-200";
  }
}

export function getOrgColorClasses(color: string): {
  bg: string;
  text: string;
  border: string;
  lightBg: string;
} {
  const map: Record<
    string,
    { bg: string; text: string; border: string; lightBg: string }
  > = {
    blue: {
      bg: "bg-blue-600",
      text: "text-blue-700",
      border: "border-blue-200",
      lightBg: "bg-blue-50",
    },
    green: {
      bg: "bg-green-600",
      text: "text-green-700",
      border: "border-green-200",
      lightBg: "bg-green-50",
    },
    orange: {
      bg: "bg-orange-500",
      text: "text-orange-700",
      border: "border-orange-200",
      lightBg: "bg-orange-50",
    },
    indigo: {
      bg: "bg-indigo-600",
      text: "text-indigo-700",
      border: "border-indigo-200",
      lightBg: "bg-indigo-50",
    },
    purple: {
      bg: "bg-purple-600",
      text: "text-purple-700",
      border: "border-purple-200",
      lightBg: "bg-purple-50",
    },
    yellow: {
      bg: "bg-yellow-500",
      text: "text-yellow-700",
      border: "border-yellow-200",
      lightBg: "bg-yellow-50",
    },
    pink: {
      bg: "bg-pink-500",
      text: "text-pink-700",
      border: "border-pink-200",
      lightBg: "bg-pink-50",
    },
    teal: {
      bg: "bg-teal-600",
      text: "text-teal-700",
      border: "border-teal-200",
      lightBg: "bg-teal-50",
    },
    cyan: {
      bg: "bg-cyan-500",
      text: "text-cyan-700",
      border: "border-cyan-200",
      lightBg: "bg-cyan-50",
    },
    rose: {
      bg: "bg-rose-500",
      text: "text-rose-700",
      border: "border-rose-200",
      lightBg: "bg-rose-50",
    },
  };
  return map[color] ?? map.blue;
}

export function getInitials(name: string): string {
  return name
    .split(" ")
    .map((n) => n[0])
    .join("")
    .toUpperCase()
    .slice(0, 2);
}

// ─── Campaign Types ───────────────────────────────────────────────────────────

export type CampaignStatus = "active" | "upcoming" | "completed" | "paused";
export type CampaignCategory =
  | "Climate Justice"
  | "Digital Rights"
  | "Labor Rights"
  | "Electoral Reform"
  | "Women's Rights"
  | "Peace & Diplomacy"
  | "Economic Justice"
  | "Human Rights"
  | "Youth Empowerment"
  | "Immigration";

export interface MockCampaign {
  id: string;
  title: string;
  slug: string;
  status: CampaignStatus;
  category: CampaignCategory;
  organizationId: string;
  organization: string;
  region: OrgRegion;
  description: string;
  goal: string;
  startDate: string;
  endDate?: string;
  participantCount: number;
  signatureCount?: number;
  targetSignatures?: number;
  actionCount: number;
  updatesCount: number;
  createdBy: string;
  tags: string[];
  featured: boolean;
}

export interface MockPetition {
  id: string;
  campaignId: string;
  title: string;
  description: string;
  currentSignatures: number;
  targetSignatures: number;
  deadline?: string;
}

export type CTAType =
  | "contact_official"
  | "share_content"
  | "attend_event"
  | "donate"
  | "volunteer"
  | "sign_petition"
  | "write_letter";

export interface MockCTA {
  id: string;
  campaignId: string;
  type: CTAType;
  title: string;
  description: string;
  actionUrl?: string;
  completedCount: number;
  isUrgent: boolean;
}

export interface CampaignUpdate {
  id: string;
  campaignId: string;
  title: string;
  content: string;
  author: string;
  date: string;
  type: "update" | "milestone" | "media" | "action";
}

// ─── Mock Campaigns ───────────────────────────────────────────────────────────

export const MOCK_CAMPAIGNS: MockCampaign[] = [
  {
    id: "camp-1",
    title: "Global Climate Justice Summit 2026",
    slug: "global-climate-justice-summit-2026",
    status: "active",
    category: "Climate Justice",
    organizationId: "org-1",
    organization: "IIIntl Global Council",
    region: "Global",
    description:
      "A coordinated global advocacy push to ensure that climate finance obligations are met and that frontline communities — especially in the Global South — receive direct, accessible support. This campaign unites member organizations across all regions to present unified demands at the next major UN climate conference.",
    goal: "Secure binding commitments from G20 nations to redirect $100B annually toward frontline climate adaptation, with direct community access and zero bureaucratic gatekeeping.",
    startDate: "2026-03-01",
    endDate: "2026-06-30",
    participantCount: 1847,
    signatureCount: 42300,
    targetSignatures: 100000,
    actionCount: 6240,
    updatesCount: 8,
    createdBy: "Alex Rivera",
    tags: ["climate", "finance", "un", "global south", "adaptation"],
    featured: true,
  },
  {
    id: "camp-2",
    title: "Youth Climate Strike — West Africa",
    slug: "youth-climate-strike-west-africa",
    status: "active",
    category: "Climate Justice",
    organizationId: "org-7",
    organization: "Global Youth Coalition",
    region: "Africa",
    description:
      "Building on the legacy of global youth climate strikes, this campaign mobilizes young people across West Africa to demand immediate action on deforestation, flooding, and the fossil fuel subsidies that continue to devastate their communities.",
    goal: "Organize synchronized strike days across 14 West African nations, reaching 500,000 participants and compelling national governments to commit to climate emergency declarations.",
    startDate: "2026-02-20",
    endDate: "2026-05-31",
    participantCount: 312,
    signatureCount: 18700,
    targetSignatures: 50000,
    actionCount: 1820,
    updatesCount: 5,
    createdBy: "Destiny Osei",
    tags: ["youth", "west africa", "strike", "deforestation", "fossil fuels"],
    featured: true,
  },
  {
    id: "camp-3",
    title: "Stop Mass Surveillance Act",
    slug: "stop-mass-surveillance-act",
    status: "active",
    category: "Digital Rights",
    organizationId: "org-8",
    organization: "Digital Rights Task Force",
    region: "Global",
    description:
      "Governments worldwide are passing mass surveillance legislation under the guise of public safety. This campaign fights back with legal challenges, public education, and coordinated pressure on legislators to repeal or amend these laws.",
    goal: "Achieve repeal or substantive reform of mass surveillance statutes in at least 5 jurisdictions, and establish international norms against warrantless bulk data collection.",
    startDate: "2026-01-15",
    participantCount: 428,
    signatureCount: 31500,
    targetSignatures: 75000,
    actionCount: 2410,
    updatesCount: 6,
    createdBy: "Yuki Tanaka",
    tags: ["surveillance", "privacy", "legislation", "civil liberties"],
    featured: false,
  },
  {
    id: "camp-4",
    title: "Fair Wages for Migrant Workers",
    slug: "fair-wages-for-migrant-workers",
    status: "active",
    category: "Labor Rights",
    organizationId: "org-2",
    organization: "Americas Chapter",
    region: "Americas",
    description:
      "Migrant workers across North and South America face wage theft, dangerous conditions, and zero legal recourse. This campaign coordinates legal advocacy, public pressure on employers, and policy change at the regional level.",
    goal: "Pass binding wage parity legislation in 3 countries, establish a cross-border migrant worker legal aid fund, and secure back-pay for 10,000 documented wage theft victims.",
    startDate: "2026-01-20",
    endDate: "2026-09-30",
    participantCount: 683,
    signatureCount: 24800,
    targetSignatures: 60000,
    actionCount: 3180,
    updatesCount: 7,
    createdBy: "Maria Santos",
    tags: ["migrant workers", "wage theft", "labor", "americas"],
    featured: false,
  },
  {
    id: "camp-5",
    title: "EU Electoral Integrity Initiative",
    slug: "eu-electoral-integrity-initiative",
    status: "upcoming",
    category: "Electoral Reform",
    organizationId: "org-4",
    organization: "European Alliance",
    region: "Europe",
    description:
      "Ahead of a critical European Parliament election cycle, this initiative trains 2,000 volunteer election observers and campaigns for standardized digital voting audit requirements across all EU member states.",
    goal: "Deploy credentialed observers to elections in 12 EU nations, publish comparative integrity reports, and push through mandatory source-code auditing for any electronic voting system.",
    startDate: "2026-04-01",
    endDate: "2026-10-31",
    participantCount: 156,
    actionCount: 420,
    updatesCount: 2,
    createdBy: "Elena Volkov",
    tags: ["elections", "eu", "observers", "digital voting", "audit"],
    featured: false,
  },
  {
    id: "camp-6",
    title: "End Child Marriage Campaign",
    slug: "end-child-marriage-campaign",
    status: "active",
    category: "Women's Rights",
    organizationId: "org-3",
    organization: "Africa Region",
    region: "Africa",
    description:
      "Child marriage remains a severe and underreported crisis across Sub-Saharan Africa. This campaign drives legislative reform, community education programs, and support services for girls at risk and survivors.",
    goal: "Secure legislative bans on child marriage in 6 target countries, establish 40 community safe house programs, and reach 250,000 families through awareness campaigns.",
    startDate: "2026-02-14",
    endDate: "2026-12-31",
    participantCount: 521,
    signatureCount: 37200,
    targetSignatures: 80000,
    actionCount: 2870,
    updatesCount: 9,
    createdBy: "Aisha Kamara",
    tags: [
      "child marriage",
      "women",
      "africa",
      "girls education",
      "legislation",
    ],
    featured: true,
  },
  {
    id: "camp-7",
    title: "Digital Privacy for All",
    slug: "digital-privacy-for-all",
    status: "completed",
    category: "Digital Rights",
    organizationId: "org-8",
    organization: "Digital Rights Task Force",
    region: "Global",
    description:
      "A two-year campaign that successfully pushed for the adoption of baseline digital privacy standards across 8 member nations. The campaign included public education, model legislation drafting, and direct lobbying.",
    goal: "Pass comprehensive digital privacy legislation in 8 jurisdictions with enforceable penalties, established in December 2025.",
    startDate: "2024-01-01",
    endDate: "2025-12-31",
    participantCount: 2340,
    signatureCount: 89200,
    targetSignatures: 100000,
    actionCount: 14500,
    updatesCount: 22,
    createdBy: "Priya Sharma",
    tags: ["privacy", "gdpr", "data rights", "legislation"],
    featured: false,
  },
  {
    id: "camp-8",
    title: "Caribbean Climate Resilience Fund",
    slug: "caribbean-climate-resilience-fund",
    status: "active",
    category: "Climate Justice",
    organizationId: "org-9",
    organization: "Caribbean Solidarity Network",
    region: "Caribbean",
    description:
      "Small island developing states face existential climate threats while contributing almost nothing to global emissions. This campaign fights for a dedicated Caribbean Climate Resilience Fund — financed by wealthy polluting nations — to protect island infrastructure, coastal communities, and ecosystems.",
    goal: "Establish a $10B Caribbean Climate Resilience Fund with direct community disbursement, approved through the UNFCCC process with binding donor commitments.",
    startDate: "2026-02-01",
    endDate: "2026-11-30",
    participantCount: 287,
    signatureCount: 15400,
    targetSignatures: 40000,
    actionCount: 1240,
    updatesCount: 4,
    createdBy: "Miguel Fernandes",
    tags: ["caribbean", "small islands", "loss and damage", "resilience fund"],
    featured: false,
  },
  {
    id: "camp-9",
    title: "South Asia Election Observer Network",
    slug: "south-asia-election-observer-network",
    status: "upcoming",
    category: "Electoral Reform",
    organizationId: "org-10",
    organization: "South Asia Policy Institute",
    region: "South Asia",
    description:
      "A new regional network of trained, credentialed election observers who will deploy to elections across South Asia to document irregularities, train local monitors, and publish independent integrity assessments.",
    goal: "Train 500 election observers across 6 South Asian countries, publish independent integrity reports for 8 upcoming elections, and establish permanent monitoring infrastructure.",
    startDate: "2026-05-01",
    endDate: "2027-01-31",
    participantCount: 89,
    actionCount: 220,
    updatesCount: 1,
    createdBy: "Zara Ahmed",
    tags: ["elections", "south asia", "observers", "democracy"],
    featured: false,
  },
  {
    id: "camp-10",
    title: "Youth Leadership Academy",
    slug: "youth-leadership-academy",
    status: "active",
    category: "Youth Empowerment",
    organizationId: "org-7",
    organization: "Global Youth Coalition",
    region: "Global",
    description:
      "A global civic leadership program that recruits 500 young activists aged 18–28 per cohort, providing intensive training in campaigning, policy analysis, community organizing, and international advocacy.",
    goal: "Graduate 1,500 trained youth civic leaders across three cohorts by 2027, with alumni leading campaigns in 40+ countries and occupying at least 20 elected or appointed policy positions.",
    startDate: "2026-01-10",
    endDate: "2026-12-31",
    participantCount: 487,
    actionCount: 3600,
    updatesCount: 11,
    createdBy: "Destiny Osei",
    tags: ["youth", "leadership", "training", "organizing", "global"],
    featured: true,
  },
  {
    id: "camp-11",
    title: "Middle East Interfaith Dialogue Week",
    slug: "middle-east-interfaith-dialogue-week",
    status: "upcoming",
    category: "Peace & Diplomacy",
    organizationId: "org-6",
    organization: "Middle East Dialogue Forum",
    region: "Middle East",
    description:
      "A week of coordinated interfaith events, public forums, and community dialogues across the Middle East and North Africa, bringing together religious leaders, civil society, and young people to build bridges across sectarian divides.",
    goal: "Host 60 interfaith events across 12 MENA cities, engage 15,000 direct participants, and produce a joint declaration of civic solidarity signed by 500 community leaders.",
    startDate: "2026-06-01",
    endDate: "2026-06-07",
    participantCount: 72,
    actionCount: 340,
    updatesCount: 2,
    createdBy: "Fatima Al-Rashid",
    tags: ["interfaith", "dialogue", "mena", "peace", "community"],
    featured: false,
  },
  {
    id: "camp-12",
    title: "Workers Rights Across Borders",
    slug: "workers-rights-across-borders",
    status: "completed",
    category: "Labor Rights",
    organizationId: "org-2",
    organization: "Americas Chapter",
    region: "Americas",
    description:
      "A completed cross-border labor rights campaign that successfully established a tri-national worker protection treaty between Mexico, the United States, and Canada, with enforceable provisions against wage theft and union suppression.",
    goal: "Ratify a tri-national worker protection agreement with independent enforcement mechanisms — achieved in late 2025 after 18 months of advocacy.",
    startDate: "2024-06-01",
    endDate: "2025-11-30",
    participantCount: 3210,
    signatureCount: 124000,
    targetSignatures: 150000,
    actionCount: 21400,
    updatesCount: 18,
    createdBy: "Tomás García",
    tags: ["labor rights", "trade", "americas", "workers", "treaty"],
    featured: false,
  },
];

// ─── Mock Petitions ───────────────────────────────────────────────────────────

export const MOCK_PETITIONS: MockPetition[] = [
  {
    id: "pet-1",
    campaignId: "camp-1",
    title: "Demand Climate Finance Justice Now",
    description:
      "Sign to demand that G20 nations fulfill and expand their climate finance obligations. Every signature will be delivered directly to finance ministers before the next COP meeting.",
    currentSignatures: 42300,
    targetSignatures: 100000,
    deadline: "2026-05-31",
  },
  {
    id: "pet-2",
    campaignId: "camp-2",
    title: "African Youth Climate Emergency Declaration",
    description:
      "We, the youth of West Africa, demand that our governments declare a climate emergency and halt all new fossil fuel projects. Our futures are not for sale.",
    currentSignatures: 18700,
    targetSignatures: 50000,
    deadline: "2026-04-20",
  },
  {
    id: "pet-3",
    campaignId: "camp-3",
    title: "Repeal the Mass Surveillance Act",
    description:
      "This legislation violates the fundamental right to privacy for millions of people. Sign this petition to demand immediate repeal and a return to targeted, warrant-based surveillance only.",
    currentSignatures: 31500,
    targetSignatures: 75000,
    deadline: "2026-06-15",
  },
  {
    id: "pet-4",
    campaignId: "camp-6",
    title: "End Child Marriage — Act Now",
    description:
      "Child marriage robs girls of their education, health, and futures. Sign to demand that your government pass and enforce binding legislation banning marriage under 18 with no exceptions.",
    currentSignatures: 37200,
    targetSignatures: 80000,
    deadline: "2026-10-11",
  },
  {
    id: "pet-5",
    campaignId: "camp-8",
    title: "Caribbean Climate Fund — No More Delays",
    description:
      "Our islands are underwater. Literally. Sign to demand immediate establishment of the Caribbean Climate Resilience Fund, financed by the nations whose emissions caused this crisis.",
    currentSignatures: 15400,
    targetSignatures: 40000,
    deadline: "2026-09-01",
  },
];

// ─── Mock Calls to Action ─────────────────────────────────────────────────────

export const MOCK_CTAS: MockCTA[] = [
  {
    id: "cta-1",
    campaignId: "camp-1",
    type: "contact_official",
    title: "Email Your Finance Minister",
    description:
      "Send a personalized message to your national finance minister demanding they support the $100B climate finance commitment at the next G20 summit.",
    actionUrl: "#",
    completedCount: 2840,
    isUrgent: true,
  },
  {
    id: "cta-2",
    campaignId: "camp-2",
    type: "attend_event",
    title: "Join the West Africa Strike Day",
    description:
      "Register to participate in the coordinated West Africa Climate Strike on April 22. Events are happening in Accra, Lagos, Abidjan, Dakar, and 10 more cities.",
    actionUrl: "#",
    completedCount: 892,
    isUrgent: true,
  },
  {
    id: "cta-3",
    campaignId: "camp-3",
    type: "write_letter",
    title: "Write to Your Legislator",
    description:
      "Use our template to write a personalized letter to your legislator demanding they vote against the surveillance bill — or co-sponsor the repeal.",
    actionUrl: "#",
    completedCount: 1240,
    isUrgent: false,
  },
  {
    id: "cta-4",
    campaignId: "camp-4",
    type: "share_content",
    title: "Share Migrant Worker Stories",
    description:
      "Amplify the voices of migrant workers by sharing our documented testimony series on social media. Use #FairWagesNow to join the conversation.",
    actionUrl: "#",
    completedCount: 3180,
    isUrgent: false,
  },
  {
    id: "cta-5",
    campaignId: "camp-6",
    type: "volunteer",
    title: "Train as a Community Educator",
    description:
      "Volunteer for a 2-day training to become a certified End Child Marriage community educator. We're deploying 500 educators across 6 countries this year.",
    actionUrl: "#",
    completedCount: 347,
    isUrgent: false,
  },
  {
    id: "cta-6",
    campaignId: "camp-8",
    type: "contact_official",
    title: "Demand Caribbean Fund Commitment",
    description:
      "Contact your national climate envoy and demand they publicly commit to contributing to the Caribbean Climate Resilience Fund at UNFCCC negotiations.",
    actionUrl: "#",
    completedCount: 614,
    isUrgent: true,
  },
  {
    id: "cta-7",
    campaignId: "camp-10",
    type: "volunteer",
    title: "Apply for Youth Leadership Academy",
    description:
      "Applications are open for Cohort 3 of the Youth Leadership Academy. Positions are available for activists aged 18–28 from all member regions.",
    actionUrl: "#",
    completedCount: 487,
    isUrgent: false,
  },
  {
    id: "cta-8",
    campaignId: "camp-1",
    type: "donate",
    title: "Fund Frontline Climate Delegates",
    description:
      "Help us send 50 frontline community representatives to the next COP summit. Donations cover travel, accommodation, and interpretation services.",
    actionUrl: "#",
    completedCount: 1620,
    isUrgent: true,
  },
];

// ─── Mock Campaign Updates ────────────────────────────────────────────────────

export const MOCK_CAMPAIGN_UPDATES: CampaignUpdate[] = [
  {
    id: "upd-1",
    campaignId: "camp-1",
    title: "10,000 Signatures in 48 Hours!",
    content:
      "We reached 10,000 signatures in just 48 hours of launch — an extraordinary show of global solidarity. The petition is now being translated into 12 languages to accelerate our momentum before the G20 finance meeting in May.",
    author: "Alex Rivera",
    date: "2026-03-04",
    type: "milestone",
  },
  {
    id: "upd-2",
    campaignId: "camp-1",
    title: "Letter delivered to 15 Finance Ministries",
    content:
      "Thanks to 2,840 participants who sent the climate finance demand letter, we have now delivered formal correspondence to finance ministries in 15 countries. Several have acknowledged receipt and requested follow-up meetings.",
    author: "Alex Rivera",
    date: "2026-03-18",
    type: "action",
  },
  {
    id: "upd-3",
    campaignId: "camp-2",
    title: "Strike dates confirmed in 14 cities",
    content:
      "Coordinating committees have now confirmed strike events in 14 cities across West Africa: Accra, Lagos, Abidjan, Dakar, Lomé, Cotonou, Ouagadougou, Conakry, Freetown, Monrovia, Banjul, Bissau, Bamako, and Niamey.",
    author: "Destiny Osei",
    date: "2026-03-10",
    type: "milestone",
  },
  {
    id: "upd-4",
    campaignId: "camp-3",
    title: "Legal challenge filed in three jurisdictions",
    content:
      "Our legal team has filed constitutional challenges to mass surveillance statutes in Germany, Brazil, and South Korea. These cases will set important precedents and are expected to reach high courts within 12 months.",
    author: "Yuki Tanaka",
    date: "2026-02-28",
    type: "update",
  },
  {
    id: "upd-5",
    campaignId: "camp-4",
    title: "Coalition expanded to 47 labor unions",
    content:
      "The Fair Wages campaign coalition has grown to include 47 labor unions and 23 migrant worker legal aid organizations across 9 countries. This is the largest cross-border labor alliance in the Americas Chapter's history.",
    author: "Maria Santos",
    date: "2026-02-14",
    type: "milestone",
  },
  {
    id: "upd-6",
    campaignId: "camp-6",
    title: "First Safe House Network Opens in Freetown",
    content:
      "The first cohort of 5 community safe houses under the End Child Marriage campaign is now operational in Freetown, Sierra Leone. 43 girls have already received direct support, legal assistance, and educational resources.",
    author: "Aisha Kamara",
    date: "2026-03-01",
    type: "action",
  },
  {
    id: "upd-7",
    campaignId: "camp-8",
    title: "Caribbean Fund proposal submitted to UNFCCC",
    content:
      "The formal Caribbean Climate Resilience Fund proposal has been submitted to the UNFCCC secretariat. It includes technical specifications, disbursement protocols, and a shortlist of donor nations to be approached directly.",
    author: "Miguel Fernandes",
    date: "2026-02-28",
    type: "update",
  },
  {
    id: "upd-8",
    campaignId: "camp-10",
    title: "Cohort 2 graduates 312 civic leaders",
    content:
      "Congratulations to the 312 graduates of Youth Leadership Academy Cohort 2! Alumni are now deploying to campaigns in 38 countries, including leadership roles in 6 of our ongoing IIIntl One campaigns.",
    author: "Destiny Osei",
    date: "2026-02-20",
    type: "milestone",
  },
  {
    id: "upd-9",
    campaignId: "camp-1",
    title: "Media coverage in 34 countries",
    content:
      "The Global Climate Justice Summit campaign has now received substantive coverage in 34 countries, including front-page features in major outlets across Europe, Africa, and Latin America. Our communications team is tracking an estimated 240M media impressions since launch.",
    author: "Alex Rivera",
    date: "2026-03-22",
    type: "media",
  },
  {
    id: "upd-10",
    campaignId: "camp-4",
    title: "First wage theft case settled: $2.1M recovered",
    content:
      "A landmark settlement in the first major wage theft case supported by our campaign has recovered $2.1M for 847 migrant workers in the agricultural sector. This is a proof of concept for the legal strategy we will replicate across 9 more pending cases.",
    author: "Tomás García",
    date: "2026-03-15",
    type: "milestone",
  },
];

// ─── Campaign Helper Functions ────────────────────────────────────────────────

export function getCampaignById(id: string): MockCampaign | undefined {
  return MOCK_CAMPAIGNS.find((c) => c.id === id);
}

export function getCampaignsByOrgId(orgId: string): MockCampaign[] {
  return MOCK_CAMPAIGNS.filter((c) => c.organizationId === orgId);
}

export function getPetitionsByCampaignId(campaignId: string): MockPetition[] {
  return MOCK_PETITIONS.filter((p) => p.campaignId === campaignId);
}

export function getCTAsByCampaignId(campaignId: string): MockCTA[] {
  return MOCK_CTAS.filter((c) => c.campaignId === campaignId);
}

export function getUpdatesByCampaignId(campaignId: string): CampaignUpdate[] {
  return MOCK_CAMPAIGN_UPDATES.filter((u) => u.campaignId === campaignId);
}

export function getCampaignStatusBadgeClasses(status: CampaignStatus): string {
  switch (status) {
    case "active":
      return "bg-emerald-100 text-emerald-700 border-emerald-200";
    case "upcoming":
      return "bg-amber-100 text-amber-700 border-amber-200";
    case "completed":
      return "bg-slate-100 text-slate-600 border-slate-200";
    case "paused":
      return "bg-orange-100 text-orange-700 border-orange-200";
    default:
      return "bg-gray-100 text-gray-600 border-gray-200";
  }
}

export function getCampaignCategoryColor(category: CampaignCategory): string {
  switch (category) {
    case "Climate Justice":
      return "bg-green-100 text-green-700 border-green-200";
    case "Digital Rights":
      return "bg-blue-100 text-blue-700 border-blue-200";
    case "Labor Rights":
      return "bg-orange-100 text-orange-700 border-orange-200";
    case "Electoral Reform":
      return "bg-indigo-100 text-indigo-700 border-indigo-200";
    case "Women's Rights":
      return "bg-pink-100 text-pink-700 border-pink-200";
    case "Peace & Diplomacy":
      return "bg-sky-100 text-sky-700 border-sky-200";
    case "Economic Justice":
      return "bg-yellow-100 text-yellow-700 border-yellow-200";
    case "Human Rights":
      return "bg-red-100 text-red-700 border-red-200";
    case "Youth Empowerment":
      return "bg-purple-100 text-purple-700 border-purple-200";
    case "Immigration":
      return "bg-teal-100 text-teal-700 border-teal-200";
    default:
      return "bg-gray-100 text-gray-600 border-gray-200";
  }
}

// ─── Mock Activity Feed ───────────────────────────────────────────────────────

export interface ActivityItem {
  id: string;
  type:
    | "joined"
    | "campaign_launched"
    | "post_made"
    | "member_invited"
    | "resource_added";
  actor: string;
  description: string;
  time: string;
}

export const MOCK_ORG_ACTIVITIES: ActivityItem[] = [
  {
    id: "act-1",
    type: "campaign_launched",
    actor: "Alex Rivera",
    description: "Launched campaign: Global Climate Justice Summit",
    time: "2 days ago",
  },
  {
    id: "act-2",
    type: "member_invited",
    actor: "Maria Santos",
    description: "Invited Tomás García to Americas Chapter",
    time: "3 days ago",
  },
  {
    id: "act-3",
    type: "post_made",
    actor: "James Okonkwo",
    description: "Posted in the Africa Region forum: Land Rights Update",
    time: "4 days ago",
  },
  {
    id: "act-4",
    type: "joined",
    actor: "Priya Sharma",
    description: "Joined the Digital Rights Task Force",
    time: "5 days ago",
  },
  {
    id: "act-5",
    type: "resource_added",
    actor: "Isabelle Morin",
    description: "Added resource: EU Digital Rights Charter (2026 Update)",
    time: "1 week ago",
  },
  {
    id: "act-6",
    type: "campaign_launched",
    actor: "Destiny Osei",
    description: "Launched campaign: Youth Climate Strike — West Africa",
    time: "1 week ago",
  },
  {
    id: "act-7",
    type: "joined",
    actor: "Zara Ahmed",
    description: "Joined South Asia Policy Institute",
    time: "10 days ago",
  },
  {
    id: "act-8",
    type: "post_made",
    actor: "Elena Volkov",
    description: "Posted in EU forum: Election Observer Report Q1 2026",
    time: "2 weeks ago",
  },
];

// ─── Forum Types ──────────────────────────────────────────────────────────────

export type ForumCategory =
  | "General Discussion"
  | "Climate & Environment"
  | "Digital Rights"
  | "Labor & Economic Justice"
  | "Democracy & Elections"
  | "Women's Rights"
  | "Youth & Education"
  | "Peace & Diplomacy"
  | "Org Announcements"
  | "Regional News";

export type ThreadStatus = "open" | "pinned" | "locked" | "archived";

export interface MockForumThread {
  id: string;
  title: string;
  category: ForumCategory;
  authorId: string;
  authorName: string;
  organizationId: string;
  organization: string;
  region: OrgRegion;
  content: string;
  createdAt: string;
  lastActivityAt: string;
  replyCount: number;
  viewCount: number;
  upvoteCount: number;
  status: ThreadStatus;
  tags: string[];
  isPinned: boolean;
  isLocked: boolean;
}

export interface MockForumPost {
  id: string;
  threadId: string;
  authorId: string;
  authorName: string;
  authorRole: UserRole;
  authorOrganization: string;
  content: string;
  createdAt: string;
  upvoteCount: number;
  isModeratorNote: boolean;
}

// ─── Mock Forum Threads ───────────────────────────────────────────────────────

export const MOCK_FORUM_THREADS: MockForumThread[] = [
  {
    id: "thread-1",
    title:
      "How do we make climate campaigns resonate with non-activist communities?",
    category: "Climate & Environment",
    authorId: "mem-13",
    authorName: "Destiny Osei",
    organizationId: "org-7",
    organization: "Global Youth Coalition",
    region: "Africa",
    content:
      "One of the biggest challenges in our West Africa youth strike campaigns is reaching beyond people who are already convinced. Many communities see climate as an abstract or distant issue, even when they're living through flooding and crop failures right now. I want to open a discussion about messaging strategies, entry points, and community-led framing that has worked for others. What has your chapter found effective in bridging this gap?",
    createdAt: "2026-03-01T09:00:00Z",
    lastActivityAt: "2026-03-06T14:22:00Z",
    replyCount: 14,
    viewCount: 312,
    upvoteCount: 41,
    status: "open",
    tags: ["climate", "messaging", "community"],
    isPinned: false,
    isLocked: false,
  },
  {
    id: "thread-2",
    title: "Digital surveillance expansion in South Korea — what can we do?",
    category: "Digital Rights",
    authorId: "mem-16",
    authorName: "Yuki Tanaka",
    organizationId: "org-8",
    organization: "Digital Rights Task Force",
    region: "Asia-Pacific",
    content:
      "Following the passage of the revised Telecommunications Security Act in South Korea last month, we're tracking a significant expansion of warrantless access to communications metadata. This is one of three jurisdictions where our legal challenge was filed. I'm looking for anyone with contacts in Korean civil society, legal scholars specializing in constitutional challenges, or activists who have experience with similar fights in other Asian democracies.",
    createdAt: "2026-02-28T11:30:00Z",
    lastActivityAt: "2026-03-05T16:45:00Z",
    replyCount: 9,
    viewCount: 187,
    upvoteCount: 28,
    status: "open",
    tags: ["surveillance", "south korea", "legal"],
    isPinned: false,
    isLocked: false,
  },
  {
    id: "thread-3",
    title: "ANNOUNCEMENT: Platform-wide Town Hall — March 20, 2026",
    category: "Org Announcements",
    authorId: "mem-1",
    authorName: "Alex Rivera",
    organizationId: "org-1",
    organization: "IIIntl Global Council",
    region: "Global",
    content:
      "The IIIntl Global Council is hosting a full platform town hall on March 20, 2026 at 14:00 UTC. All members, activists, org admins, and observers are welcome. The agenda includes: Q2 campaign priorities, regional chapter updates, multi-lingual platform rollout, webstore launch timeline, and open Q&A. Connection details will be sent via email to all verified members. Please share this with your local networks.",
    createdAt: "2026-03-01T08:00:00Z",
    lastActivityAt: "2026-03-04T10:00:00Z",
    replyCount: 22,
    viewCount: 548,
    upvoteCount: 67,
    status: "pinned",
    tags: ["town hall", "announcement", "global"],
    isPinned: true,
    isLocked: false,
  },
  {
    id: "thread-4",
    title: "Best practices for election observer training — sharing what works",
    category: "Democracy & Elections",
    authorId: "mem-5",
    authorName: "Elena Volkov",
    organizationId: "org-4",
    organization: "European Alliance",
    region: "Europe",
    content:
      "We've now trained 340 election observers across EU member states using our Observer Academy curriculum. I want to share what's worked and learn from other regional chapters. Key lessons from our experience: (1) Scenario-based simulations are far more effective than lecture-style training; (2) Legal knowledge of each specific jurisdiction is non-negotiable; (3) Pairing experienced and new observers builds confidence. What has worked in other regions?",
    createdAt: "2026-02-25T13:00:00Z",
    lastActivityAt: "2026-03-03T09:15:00Z",
    replyCount: 11,
    viewCount: 203,
    upvoteCount: 35,
    status: "open",
    tags: ["elections", "training", "observers"],
    isPinned: false,
    isLocked: false,
  },
  {
    id: "thread-5",
    title: "Migrant worker wage theft documentation — need legal researchers",
    category: "Labor & Economic Justice",
    authorId: "mem-7",
    authorName: "Tomás García",
    organizationId: "org-2",
    organization: "Americas Chapter",
    region: "Americas",
    content:
      "Our Fair Wages campaign has now collected sworn testimony from over 2,400 migrant workers documenting wage theft, illegal deductions, and contract violations. We're building the evidentiary basis for 9 more legal cases following our first landmark settlement. We urgently need legal researchers who can analyze existing case law in Mexico, Guatemala, Colombia, and Ecuador. Pro bono attorneys and legal interns are also welcome to reach out.",
    createdAt: "2026-02-22T15:45:00Z",
    lastActivityAt: "2026-03-04T11:30:00Z",
    replyCount: 8,
    viewCount: 156,
    upvoteCount: 22,
    status: "open",
    tags: ["labor", "legal", "migrant workers"],
    isPinned: false,
    isLocked: false,
  },
  {
    id: "thread-6",
    title: "Feminist organizing across cultures — what doesn't translate?",
    category: "Women's Rights",
    authorId: "mem-8",
    authorName: "Aisha Kamara",
    organizationId: "org-3",
    organization: "Africa Region",
    region: "Africa",
    content:
      "I've been working with partner organizations in West Africa on the End Child Marriage campaign, and we frequently run into situations where strategies that are successful in one country don't transfer well to another — even within the same region. This is about more than language. It's about different relationships between family structure, religion, government, and civil society. I'd love to hear from members across different regions about how they navigate this complexity.",
    createdAt: "2026-02-20T10:00:00Z",
    lastActivityAt: "2026-03-02T17:00:00Z",
    replyCount: 17,
    viewCount: 289,
    upvoteCount: 49,
    status: "open",
    tags: ["feminism", "culture", "organizing"],
    isPinned: false,
    isLocked: false,
  },
  {
    id: "thread-7",
    title: "Youth civic education resources — building a shared curriculum",
    category: "Youth & Education",
    authorId: "mem-13",
    authorName: "Destiny Osei",
    organizationId: "org-7",
    organization: "Global Youth Coalition",
    region: "Global",
    content:
      "The Global Youth Coalition is developing a shared curriculum for youth civic education that can be adapted by any chapter. We need contributions from educators and organizers across all regions. What works for engaging 16-22 year olds in civic participation? What have you tried that hasn't worked? We're especially interested in modules on: how government works, how to run a campaign, media literacy, and knowing your rights.",
    createdAt: "2026-02-18T14:30:00Z",
    lastActivityAt: "2026-03-01T12:00:00Z",
    replyCount: 13,
    viewCount: 224,
    upvoteCount: 38,
    status: "open",
    tags: ["youth", "education", "curriculum"],
    isPinned: false,
    isLocked: false,
  },
  {
    id: "thread-8",
    title: "Caribbean climate negotiations — who's going to COP?",
    category: "Climate & Environment",
    authorId: "mem-15",
    authorName: "Miguel Fernandes",
    organizationId: "org-9",
    organization: "Caribbean Solidarity Network",
    region: "Caribbean",
    content:
      "We're coordinating the Caribbean delegation for the upcoming UNFCCC intersessional meeting in Bonn and need to know who from our member organizations plans to attend. We're also building a shared briefing packet on the Caribbean Climate Resilience Fund proposal to distribute to sympathetic delegates. If you'll be in Bonn, please reply here or DM me directly. We're also looking for members who can participate remotely as research and communications support.",
    createdAt: "2026-02-15T09:00:00Z",
    lastActivityAt: "2026-03-02T08:30:00Z",
    replyCount: 7,
    viewCount: 143,
    upvoteCount: 19,
    status: "open",
    tags: ["cop", "caribbean", "unfccc"],
    isPinned: false,
    isLocked: false,
  },
  {
    id: "thread-9",
    title:
      "Interfaith dialogue resources — what works across religious divides?",
    category: "Peace & Diplomacy",
    authorId: "mem-6",
    authorName: "Fatima Al-Rashid",
    organizationId: "org-6",
    organization: "Middle East Dialogue Forum",
    region: "Middle East",
    content:
      "In preparation for the Middle East Interfaith Dialogue Week in June, our team is gathering resources, case studies, and methodologies from practitioners worldwide. We're particularly interested in approaches that have worked in contexts with deep historical conflict — not just theoretical frameworks but real-world applications. What has your organization used? What facilitator training has been most valuable?",
    createdAt: "2026-02-12T11:00:00Z",
    lastActivityAt: "2026-02-28T14:00:00Z",
    replyCount: 10,
    viewCount: 178,
    upvoteCount: 31,
    status: "open",
    tags: ["interfaith", "dialogue", "peace"],
    isPinned: false,
    isLocked: false,
  },
  {
    id: "thread-10",
    title:
      "South Asia observer network — partner organization expressions of interest",
    category: "Regional News",
    authorId: "mem-14",
    authorName: "Zara Ahmed",
    organizationId: "org-10",
    organization: "South Asia Policy Institute",
    region: "South Asia",
    content:
      "The South Asia Election Observer Network is now formally accepting expressions of interest from civil society organizations across Bangladesh, India, Nepal, Pakistan, Sri Lanka, and Bhutan. We're looking for partner organizations with existing civic education or legal programs who can help recruit and vet observer candidates. Please reply here with your organization name, country, and a brief description of your existing work.",
    createdAt: "2026-02-10T13:00:00Z",
    lastActivityAt: "2026-02-27T10:00:00Z",
    replyCount: 6,
    viewCount: 112,
    upvoteCount: 15,
    status: "open",
    tags: ["south asia", "elections", "partners"],
    isPinned: false,
    isLocked: false,
  },
  {
    id: "thread-11",
    title: "Platform feature request: multilingual posting support",
    category: "General Discussion",
    authorId: "mem-4",
    authorName: "Priya Sharma",
    organizationId: "org-5",
    organization: "Asia-Pacific Network",
    region: "Asia-Pacific",
    content:
      "Many of our members are not native English speakers and are hesitant to participate in forum discussions. I'd like to formally request that the platform team prioritize multilingual forum posting — at minimum, the ability to post in non-Latin scripts without corruption, and ideally auto-translation of thread titles. The platform says multilingual is a priority, so let's talk about what members actually need here.",
    createdAt: "2026-02-08T10:00:00Z",
    lastActivityAt: "2026-02-25T16:00:00Z",
    replyCount: 19,
    viewCount: 367,
    upvoteCount: 58,
    status: "open",
    tags: ["multilingual", "feature request", "accessibility"],
    isPinned: false,
    isLocked: false,
  },
  {
    id: "thread-12",
    title:
      "How we built a coalition of 47 labor unions — lessons from the Americas",
    category: "Labor & Economic Justice",
    authorId: "mem-2",
    authorName: "Maria Santos",
    organizationId: "org-2",
    organization: "Americas Chapter",
    region: "Americas",
    content:
      "Several members have asked how the Americas Chapter managed to build a coalition of 47 labor unions and 23 migrant worker legal aid organizations so quickly. The short answer: trust first, structure second. The long answer is what I'll share here. [Thread continues with detailed coalition-building methodology...]",
    createdAt: "2026-02-06T14:00:00Z",
    lastActivityAt: "2026-02-24T11:00:00Z",
    replyCount: 12,
    viewCount: 254,
    upvoteCount: 44,
    status: "open",
    tags: ["coalition", "labor", "organizing"],
    isPinned: false,
    isLocked: false,
  },
  {
    id: "thread-13",
    title: "[ARCHIVED] Digital Privacy for All — Post-Campaign Debrief",
    category: "Digital Rights",
    authorId: "mem-4",
    authorName: "Priya Sharma",
    organizationId: "org-8",
    organization: "Digital Rights Task Force",
    region: "Global",
    content:
      "Now that the Digital Privacy for All campaign has officially concluded with legislation passed in 8 jurisdictions, this thread serves as an archive of lessons learned. This post and all replies are preserved for members to learn from what worked and what we would do differently.",
    createdAt: "2025-12-15T10:00:00Z",
    lastActivityAt: "2026-01-15T09:00:00Z",
    replyCount: 24,
    viewCount: 478,
    upvoteCount: 72,
    status: "archived",
    tags: ["privacy", "campaign debrief", "completed"],
    isPinned: false,
    isLocked: true,
  },
  {
    id: "thread-14",
    title: "Mental health and activist burnout — we need to talk about this",
    category: "General Discussion",
    authorId: "mem-9",
    authorName: "Hiroshi Nakamura",
    organizationId: "org-5",
    organization: "Asia-Pacific Network",
    region: "Asia-Pacific",
    content:
      "I've been doing peace advocacy work for over a decade and I want to raise something that almost no civic organization talks about openly: activist burnout and mental health. Several members I respect deeply have stepped back from organizing in the past year, and burnout is a major reason. I'm not asking for solutions right now — I'm asking if we can just acknowledge this exists and talk about it honestly.",
    createdAt: "2026-01-28T15:00:00Z",
    lastActivityAt: "2026-02-20T13:30:00Z",
    replyCount: 31,
    viewCount: 512,
    upvoteCount: 89,
    status: "open",
    tags: ["mental health", "burnout", "wellbeing"],
    isPinned: false,
    isLocked: false,
  },
  {
    id: "thread-15",
    title: "POLICY: Forum moderation guidelines (please read)",
    category: "Org Announcements",
    authorId: "mem-1",
    authorName: "Alex Rivera",
    organizationId: "org-1",
    organization: "IIIntl Global Council",
    region: "Global",
    content:
      "All forum participants must adhere to the IIIntl One Platform Community Standards. Key rules: (1) Treat all members with respect — critique ideas, not people; (2) No sharing of private personal information about individuals without consent; (3) Campaign-related coordination should happen in campaign threads, not general discussion; (4) Moderators may lock, pin, or archive threads at their discretion. Moderation decisions can be appealed to the Platform Administrator. Thank you for making this space valuable for everyone.",
    createdAt: "2026-01-01T08:00:00Z",
    lastActivityAt: "2026-01-01T08:00:00Z",
    replyCount: 3,
    viewCount: 892,
    upvoteCount: 124,
    status: "pinned",
    tags: ["policy", "moderation", "rules"],
    isPinned: true,
    isLocked: false,
  },
];

// ─── Mock Forum Posts ─────────────────────────────────────────────────────────

export const MOCK_FORUM_POSTS: MockForumPost[] = [
  // thread-1: climate messaging
  {
    id: "post-1-1",
    threadId: "thread-1",
    authorId: "mem-3",
    authorName: "James Okonkwo",
    authorRole: "member",
    authorOrganization: "Africa Region",
    content:
      "In Nigeria we found that framing climate around food security and farmer livelihoods worked far better than abstract 'carbon' language. When we talk about how rainfall patterns have shifted and what it means for the planting calendar, farmers listen immediately. The science is in their hands every season.",
    createdAt: "2026-03-01T11:30:00Z",
    upvoteCount: 18,
    isModeratorNote: false,
  },
  {
    id: "post-1-2",
    threadId: "thread-1",
    authorId: "mem-11",
    authorName: "Sofia Andersen",
    authorRole: "member",
    authorOrganization: "European Alliance",
    content:
      "From the EU context: local air quality and public health messaging has been our strongest entry point in communities that are skeptical of 'globalist' climate framing. 'Your children's lungs' lands differently than 'save the planet'. Copenhagen's cycling infrastructure campaigns are a good model — civic improvement as climate action without the label.",
    createdAt: "2026-03-01T14:00:00Z",
    upvoteCount: 12,
    isModeratorNote: false,
  },
  {
    id: "post-1-3",
    threadId: "thread-1",
    authorId: "mem-15",
    authorName: "Miguel Fernandes",
    authorRole: "member",
    authorOrganization: "Caribbean Solidarity Network",
    content:
      "In the Caribbean we don't need to convince people climate is real — they're watching their coastlines disappear. Our challenge is translating urgency into political action when governments are captured by tourism and real estate interests. We've had success by connecting climate to sovereignty and national survival narratives.",
    createdAt: "2026-03-02T09:00:00Z",
    upvoteCount: 21,
    isModeratorNote: false,
  },
  {
    id: "post-1-4",
    threadId: "thread-1",
    authorId: "mem-13",
    authorName: "Destiny Osei",
    authorRole: "activist",
    authorOrganization: "Global Youth Coalition",
    content:
      "Thank you all — this is exactly the kind of exchange I was hoping for. The sovereignty angle is powerful, Miguel. I'm going to try incorporating that into our West Africa messaging. The food security framing from James is already something we use but hearing it reinforced helps. Sofia — the local air quality angle is interesting to adapt for urban youth in Lagos and Accra.",
    createdAt: "2026-03-03T10:00:00Z",
    upvoteCount: 9,
    isModeratorNote: false,
  },
  {
    id: "post-1-5",
    threadId: "thread-1",
    authorId: "mem-10",
    authorName: "Amara Diallo",
    authorRole: "org_admin",
    authorOrganization: "Africa Region",
    content:
      "One more approach we've tested in Guinea: connecting to traditional ecological knowledge. Many elders in rural communities have sophisticated multi-generational climate observations. Positioning the campaign as amplifying their knowledge — not bringing outside science — completely changes the dynamic.",
    createdAt: "2026-03-04T13:00:00Z",
    upvoteCount: 27,
    isModeratorNote: false,
  },
  // thread-3: town hall announcement
  {
    id: "post-3-1",
    threadId: "thread-3",
    authorId: "mem-2",
    authorName: "Maria Santos",
    authorRole: "org_admin",
    authorOrganization: "Americas Chapter",
    content:
      "The Americas Chapter will have 12 members joining. We'll be raising the migrant worker fair wages campaign update and the Q2 coalition expansion plan. Is there a way to submit agenda items in advance?",
    createdAt: "2026-03-01T09:30:00Z",
    upvoteCount: 8,
    isModeratorNote: false,
  },
  {
    id: "post-3-2",
    threadId: "thread-3",
    authorId: "mem-10",
    authorName: "Amara Diallo",
    authorRole: "org_admin",
    authorOrganization: "Africa Region",
    content:
      "Africa Region will be there. Agenda item request: the multilingual platform rollout — we need a concrete timeline for Swahili, French, and Hausa support. This affects member participation across our chapter significantly.",
    createdAt: "2026-03-01T10:15:00Z",
    upvoteCount: 15,
    isModeratorNote: false,
  },
  {
    id: "post-3-3",
    threadId: "thread-3",
    authorId: "mem-17",
    authorName: "Isabelle Morin",
    authorRole: "org_admin",
    authorOrganization: "European Alliance",
    content:
      "European Alliance confirmed. We'd like to raise the cross-border data sharing concerns related to the platform's expansion into additional jurisdictions — there are GDPR compliance implications we should discuss collectively.",
    createdAt: "2026-03-01T11:00:00Z",
    upvoteCount: 11,
    isModeratorNote: false,
  },
  {
    id: "post-3-4",
    threadId: "thread-3",
    authorId: "mem-1",
    authorName: "Alex Rivera",
    authorRole: "admin",
    authorOrganization: "IIIntl Global Council",
    content:
      "Agenda items noted — multilingual rollout and GDPR compliance will both be on the formal agenda. @Maria, yes — please email the secretariat with your agenda items by March 15. We'll compile and distribute the full agenda to all registered attendees by March 18.",
    createdAt: "2026-03-02T08:00:00Z",
    upvoteCount: 14,
    isModeratorNote: false,
  },
  {
    id: "post-3-5",
    threadId: "thread-3",
    authorId: "mem-6",
    authorName: "Fatima Al-Rashid",
    authorRole: "activist",
    authorOrganization: "Middle East Dialogue Forum",
    content:
      "Will the town hall have interpretation? Several of our MENA members are most comfortable in Arabic. If not this time, this should be on the roadmap — it's a barrier to genuine global participation.",
    createdAt: "2026-03-02T12:30:00Z",
    upvoteCount: 22,
    isModeratorNote: false,
  },
  {
    id: "post-3-6",
    threadId: "thread-3",
    authorId: "mem-1",
    authorName: "Alex Rivera",
    authorRole: "admin",
    authorOrganization: "IIIntl Global Council",
    content:
      "Fatima — we will have Arabic interpretation for this town hall. English, Spanish, French, and Arabic will be supported. We're working toward a permanent multi-language simultaneous interpretation model for all future global calls.",
    createdAt: "2026-03-03T09:00:00Z",
    upvoteCount: 31,
    isModeratorNote: false,
  },
  // thread-6: feminist organizing
  {
    id: "post-6-1",
    threadId: "thread-6",
    authorId: "mem-4",
    authorName: "Priya Sharma",
    authorRole: "activist",
    authorOrganization: "Asia-Pacific Network",
    content:
      "This resonates deeply. In South Asia we've found that framing women's rights through economic empowerment and family wellbeing — rather than individual autonomy — opens doors in conservative communities. It's not compromising the goals; it's meeting people where they are and building trust before expanding the conversation.",
    createdAt: "2026-02-21T09:00:00Z",
    upvoteCount: 24,
    isModeratorNote: false,
  },
  {
    id: "post-6-2",
    threadId: "thread-6",
    authorId: "mem-5",
    authorName: "Elena Volkov",
    authorRole: "member",
    authorOrganization: "European Alliance",
    content:
      "There's a real risk here of inadvertently reinforcing instrumental justifications for women's rights — 'women's rights because it helps the economy' versus 'women's rights because women are human beings'. I understand the pragmatic case for meeting people where they are, but I worry we sometimes give up the principled ground too early.",
    createdAt: "2026-02-21T14:00:00Z",
    upvoteCount: 19,
    isModeratorNote: false,
  },
  {
    id: "post-6-3",
    threadId: "thread-6",
    authorId: "mem-8",
    authorName: "Aisha Kamara",
    authorRole: "activist",
    authorOrganization: "Africa Region",
    content:
      "Elena raises something important and I've wrestled with this too. My current thinking: the principled framing needs to be held firmly inside the organization and in formal advocacy — that's non-negotiable. But community entry points can use whatever language creates trust. The risk is when the instrumental framing starts to displace the principled one even within our own ranks.",
    createdAt: "2026-02-22T10:00:00Z",
    upvoteCount: 33,
    isModeratorNote: false,
  },
  // thread-14: burnout
  {
    id: "post-14-1",
    threadId: "thread-14",
    authorId: "mem-4",
    authorName: "Priya Sharma",
    authorRole: "activist",
    authorOrganization: "Asia-Pacific Network",
    content:
      "Thank you for naming this, Hiroshi. I nearly stepped away from the platform last year because of burnout. What helped me: taking a month where I only did things I could finish in a day. No campaigns, no coalitions, just small completable tasks. The feeling of finishing things was medicine.",
    createdAt: "2026-01-29T09:00:00Z",
    upvoteCount: 45,
    isModeratorNote: false,
  },
  {
    id: "post-14-2",
    threadId: "thread-14",
    authorId: "mem-2",
    authorName: "Maria Santos",
    authorRole: "org_admin",
    authorOrganization: "Americas Chapter",
    content:
      "I think organizations bear responsibility here too. We build cultures that celebrate sacrifice and criticize rest. I've tried to change this in how I run the Americas Chapter — celebrating when members take breaks, not just when they deliver results. It's slow going against cultural norms but I believe it matters.",
    createdAt: "2026-01-30T13:00:00Z",
    upvoteCount: 52,
    isModeratorNote: false,
  },
  {
    id: "post-14-3",
    threadId: "thread-14",
    authorId: "mem-1",
    authorName: "Alex Rivera",
    authorRole: "admin",
    authorOrganization: "IIIntl Global Council",
    content:
      "This thread is one of the most important conversations on this platform right now. I'm going to bring a proposal to the Global Council to establish a formal member wellbeing program — peer support network, licensed counselor access for members dealing with vicarious trauma, and a culture audit tool for chapters. Will share updates here.",
    createdAt: "2026-02-02T10:00:00Z",
    upvoteCount: 78,
    isModeratorNote: false,
  },
  {
    id: "post-14-4",
    threadId: "thread-14",
    authorId: "mem-9",
    authorName: "Hiroshi Nakamura",
    authorRole: "member",
    authorOrganization: "Asia-Pacific Network",
    content:
      "Alex, that means a great deal. In Japan there's still enormous stigma around mental health disclosure in professional contexts. A formal program with visible leadership support would help change the culture here significantly. Arigato for hearing this.",
    createdAt: "2026-02-03T08:30:00Z",
    upvoteCount: 41,
    isModeratorNote: false,
  },
  // thread-11: multilingual feature request
  {
    id: "post-11-1",
    threadId: "thread-11",
    authorId: "mem-10",
    authorName: "Amara Diallo",
    authorRole: "org_admin",
    authorOrganization: "Africa Region",
    content:
      "Strongly support this. In our chapter meetings we regularly lose valuable contributions because members are self-conscious about their English. Auto-translation of at minimum thread titles and first posts would dramatically increase participation from French and Swahili-speaking members.",
    createdAt: "2026-02-09T10:00:00Z",
    upvoteCount: 29,
    isModeratorNote: false,
  },
  {
    id: "post-11-2",
    threadId: "thread-11",
    authorId: "mem-6",
    authorName: "Fatima Al-Rashid",
    authorRole: "activist",
    authorOrganization: "Middle East Dialogue Forum",
    content:
      "Arabic, Farsi, and Turkish-speaking members are significantly underrepresented in forum discussions relative to their numbers and the quality of their contributions in other contexts. Right-to-left script support is a prerequisite before any of our MENA members will comfortably post long-form content.",
    createdAt: "2026-02-10T11:00:00Z",
    upvoteCount: 35,
    isModeratorNote: false,
  },
  {
    id: "post-11-3",
    threadId: "thread-11",
    authorId: "mem-1",
    authorName: "Alex Rivera",
    authorRole: "admin",
    authorOrganization: "IIIntl Global Council",
    content:
      "This is valuable feedback and I'm taking it directly to the platform development roadmap. RTL script support and basic translation are both on the Phase 8 implementation list. I'd like to invite the members who've commented here to participate in a working group to prioritize specific languages and features. Reply here if interested.",
    createdAt: "2026-02-12T09:00:00Z",
    upvoteCount: 43,
    isModeratorNote: false,
  },
];

// ─── Forum Helper Functions ───────────────────────────────────────────────────

export function getForumThreadById(id: string): MockForumThread | undefined {
  return MOCK_FORUM_THREADS.find((t) => t.id === id);
}

export function getPostsByThreadId(threadId: string): MockForumPost[] {
  return MOCK_FORUM_POSTS.filter((p) => p.threadId === threadId);
}

export function getForumCategoryColor(category: ForumCategory): string {
  switch (category) {
    case "Climate & Environment":
      return "bg-green-100 text-green-700 border-green-200";
    case "Digital Rights":
      return "bg-blue-100 text-blue-700 border-blue-200";
    case "Labor & Economic Justice":
      return "bg-orange-100 text-orange-700 border-orange-200";
    case "Democracy & Elections":
      return "bg-indigo-100 text-indigo-700 border-indigo-200";
    case "Women's Rights":
      return "bg-pink-100 text-pink-700 border-pink-200";
    case "Youth & Education":
      return "bg-purple-100 text-purple-700 border-purple-200";
    case "Peace & Diplomacy":
      return "bg-sky-100 text-sky-700 border-sky-200";
    case "Org Announcements":
      return "bg-amber-100 text-amber-700 border-amber-200";
    case "Regional News":
      return "bg-teal-100 text-teal-700 border-teal-200";
    default:
      return "bg-gray-100 text-gray-600 border-gray-200";
  }
}
