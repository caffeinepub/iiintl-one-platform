import { type ReactNode, createContext, useContext, useState } from "react";

export type Language = "EN" | "FR" | "ES" | "AR" | "ZH";

export const LANGUAGES: {
  code: Language;
  label: string;
  dir: "ltr" | "rtl";
}[] = [
  { code: "EN", label: "English", dir: "ltr" },
  { code: "FR", label: "Français", dir: "ltr" },
  { code: "ES", label: "Español", dir: "ltr" },
  { code: "AR", label: "العربية", dir: "rtl" },
  { code: "ZH", label: "中文", dir: "ltr" },
];

// ── Translation keys ──────────────────────────────────────────────────────────
export interface Translations {
  // Nav / Layout
  nav: {
    home: string;
    organizations: string;
    campaigns: string;
    forums: string;
    resources: string;
    store: string;
    signIn: string;
    getStarted: string;
    dashboard: string;
    profile: string;
    adminPanel: string;
    logout: string;
    switchRole: string;
  };
  sidebar: {
    main: string;
    community: string;
    knowledge: string;
    commerce: string;
    admin: string;
    dashboard: string;
    organizations: string;
    campaigns: string;
    activism: string;
    forums: string;
    members: string;
    directory: string;
    resources: string;
    faq: string;
    documentation: string;
    store: string;
    orders: string;
    users: string;
    settings: string;
    reports: string;
  };
  // Home Page
  home: {
    badge: string;
    headline1: string;
    headline2: string;
    subtext: string;
    exploreOrgs: string;
    viewCampaigns: string;
    platformCapabilities: string;
    statOrgs: string;
    statMembers: string;
    statCampaigns: string;
    statResources: string;
    feature1Title: string;
    feature1Desc: string;
    feature1Link: string;
    feature2Title: string;
    feature2Desc: string;
    feature2Link: string;
    feature3Title: string;
    feature3Desc: string;
    feature3Link: string;
    feature4Title: string;
    feature4Desc: string;
    feature4Link: string;
  };
  // Dashboard
  dashboard: {
    title: string;
    welcome: string;
    organizations: string;
    activeCampaigns: string;
    forumPosts: string;
    membersReached: string;
    joined: string;
    inProgress: string;
    contributed: string;
    acrossAllOrgs: string;
    quickActions: string;
    createCampaign: string;
    inviteMember: string;
    newPost: string;
    viewStore: string;
    myOrganizations: string;
    myCampaigns: string;
    recentActivity: string;
    adminOverview: string;
    totalUsers: string;
    totalOrgs: string;
    pendingApprovals: string;
    activeNow: string;
  };
  // Organizations
  orgs: {
    title: string;
    subtitle: string;
    searchPlaceholder: string;
    all: string;
    active: string;
    mine: string;
    archived: string;
    createOrg: string;
    members: string;
    campaigns: string;
    join: string;
    leave: string;
    manage: string;
    viewDetails: string;
  };
  // Campaigns
  campaigns: {
    title: string;
    subtitle: string;
    searchPlaceholder: string;
    all: string;
    active: string;
    planning: string;
    completed: string;
    createCampaign: string;
    participants: string;
    goal: string;
    startDate: string;
    endDate: string;
    joinCampaign: string;
    leaveCampaign: string;
    status: string;
  };
  // Forums
  forums: {
    title: string;
    subtitle: string;
    searchPlaceholder: string;
    newThread: string;
    allCategories: string;
    replies: string;
    views: string;
    lastActivity: string;
    pinned: string;
    locked: string;
    postReply: string;
    replyPlaceholder: string;
  };
  // Resources
  resources: {
    title: string;
    subtitle: string;
    searchPlaceholder: string;
    addResource: string;
    allTypes: string;
    article: string;
    guide: string;
    report: string;
    video: string;
    readMore: string;
    download: string;
  };
  // FAQ
  faq: {
    title: string;
    subtitle: string;
    searchPlaceholder: string;
    noResults: string;
    stillNeedHelp: string;
    contactSupport: string;
    allCategories: string;
  };
  // Docs
  docs: {
    title: string;
    subtitle: string;
    tableOfContents: string;
    onThisPage: string;
  };
  // Store
  store: {
    title: string;
    subtitle: string;
    searchPlaceholder: string;
    addToCart: string;
    viewVendor: string;
    allCategories: string;
    becomeVendor: string;
    manageStore: string;
    cart: string;
    checkout: string;
    myOrders: string;
    orderHistory: string;
    subtotal: string;
    shipping: string;
    total: string;
    freeShipping: string;
    quantity: string;
    remove: string;
  };
  // Members
  members: {
    title: string;
    subtitle: string;
    searchPlaceholder: string;
    allRoles: string;
    allRegions: string;
    viewProfile: string;
    sendMessage: string;
    inviteMember: string;
  };
  // Activism
  activism: {
    title: string;
    subtitle: string;
    signPetition: string;
    takeAction: string;
    shareEvent: string;
    signatures: string;
    goal: string;
    daysLeft: string;
    upcomingEvents: string;
    callsToAction: string;
    petitions: string;
  };
  // Auth
  auth: {
    loginTitle: string;
    loginSubtitle: string;
    registerTitle: string;
    registerSubtitle: string;
    email: string;
    password: string;
    confirmPassword: string;
    fullName: string;
    signIn: string;
    createAccount: string;
    noAccount: string;
    hasAccount: string;
    forgotPassword: string;
    demoAccounts: string;
    orContinueWith: string;
  };
  // Common
  common: {
    search: string;
    filter: string;
    sort: string;
    loading: string;
    error: string;
    save: string;
    cancel: string;
    delete: string;
    edit: string;
    create: string;
    submit: string;
    close: string;
    back: string;
    next: string;
    previous: string;
    seeAll: string;
    learnMore: string;
    readMore: string;
    viewAll: string;
    noResults: string;
    required: string;
    optional: string;
    region: string;
    type: string;
    status: string;
    date: string;
    by: string;
    on: string;
    in: string;
    and: string;
    or: string;
    of: string;
    loadMore: string;
    gridView: string;
    listView: string;
    sortBy: string;
    newest: string;
    oldest: string;
    popular: string;
    all: string;
  };
}

// ── English (default) ─────────────────────────────────────────────────────────
const EN: Translations = {
  nav: {
    home: "Home",
    organizations: "Organizations",
    campaigns: "Campaigns",
    forums: "Forums",
    resources: "Resources",
    store: "Store",
    signIn: "Sign In",
    getStarted: "Get Started",
    dashboard: "Dashboard",
    profile: "Profile",
    adminPanel: "Admin Panel",
    logout: "Logout",
    switchRole: "Switch Role (Demo)",
  },
  sidebar: {
    main: "Main",
    community: "Community",
    knowledge: "Knowledge",
    commerce: "Commerce",
    admin: "Admin",
    dashboard: "Dashboard",
    organizations: "Organizations",
    campaigns: "Campaigns",
    activism: "Activism",
    forums: "Forums",
    members: "Members",
    directory: "Directory",
    resources: "Resources",
    faq: "FAQ",
    documentation: "Documentation",
    store: "Store",
    orders: "Orders",
    users: "Users",
    settings: "Settings",
    reports: "Reports",
  },
  home: {
    badge: "Independent · Interdependent · International",
    headline1: "One Platform.",
    headline2: "All People. Worldwide.",
    subtext:
      "IIIntl One is the global civic platform connecting independent organizations, activists, and communities across borders. Organize, campaign, and act — together.",
    exploreOrgs: "Explore Organizations",
    viewCampaigns: "View Campaigns",
    platformCapabilities: "Platform Capabilities",
    statOrgs: "Member Organizations",
    statMembers: "Active Members",
    statCampaigns: "Active Campaigns",
    statResources: "Resources Published",
    feature1Title: "Global Organizations",
    feature1Desc:
      "Manage and connect with independent organizations worldwide across all regions and causes.",
    feature1Link: "View Organizations",
    feature2Title: "Active Campaigns",
    feature2Desc:
      "Launch, join, and track civic campaigns with real-time participation and impact metrics.",
    feature2Link: "Browse Campaigns",
    feature3Title: "Community Forums",
    feature3Desc:
      "Engage in structured discussions, share insights, and collaborate across borders.",
    feature3Link: "Join the Conversation",
    feature4Title: "Knowledge Resources",
    feature4Desc:
      "Access guides, reports, documentation, and educational material for civic actors.",
    feature4Link: "Explore Resources",
  },
  dashboard: {
    title: "Dashboard",
    welcome: "Welcome back",
    organizations: "Organizations",
    activeCampaigns: "Active Campaigns",
    forumPosts: "Forum Posts",
    membersReached: "Members Reached",
    joined: "joined",
    inProgress: "in progress",
    contributed: "contributed",
    acrossAllOrgs: "across all orgs",
    quickActions: "Quick Actions",
    createCampaign: "Create Campaign",
    inviteMember: "Invite Member",
    newPost: "New Post",
    viewStore: "View Store",
    myOrganizations: "My Organizations",
    myCampaigns: "My Campaigns",
    recentActivity: "Recent Activity",
    adminOverview: "Admin Overview",
    totalUsers: "Total Users",
    totalOrgs: "Total Orgs",
    pendingApprovals: "Pending Approvals",
    activeNow: "Active Now",
  },
  orgs: {
    title: "Organizations",
    subtitle: "Connect with independent organizations across the globe",
    searchPlaceholder: "Search organizations...",
    all: "All",
    active: "Active",
    mine: "Mine",
    archived: "Archived",
    createOrg: "Create Organization",
    members: "members",
    campaigns: "campaigns",
    join: "Join",
    leave: "Leave",
    manage: "Manage",
    viewDetails: "View Details",
  },
  campaigns: {
    title: "Campaigns",
    subtitle: "Join and lead civic campaigns across the platform",
    searchPlaceholder: "Search campaigns...",
    all: "All",
    active: "Active",
    planning: "Planning",
    completed: "Completed",
    createCampaign: "Create Campaign",
    participants: "participants",
    goal: "Goal",
    startDate: "Start Date",
    endDate: "End Date",
    joinCampaign: "Join Campaign",
    leaveCampaign: "Leave Campaign",
    status: "Status",
  },
  forums: {
    title: "Forums",
    subtitle: "Discuss, debate, and collaborate with the global community",
    searchPlaceholder: "Search threads...",
    newThread: "New Thread",
    allCategories: "All Categories",
    replies: "replies",
    views: "views",
    lastActivity: "Last activity",
    pinned: "Pinned",
    locked: "Locked",
    postReply: "Post Reply",
    replyPlaceholder: "Write your reply...",
  },
  resources: {
    title: "Resource Library",
    subtitle: "Guides, reports, and educational materials for civic actors",
    searchPlaceholder: "Search resources...",
    addResource: "Add Resource",
    allTypes: "All Types",
    article: "Article",
    guide: "Guide",
    report: "Report",
    video: "Video",
    readMore: "Read More",
    download: "Download",
  },
  faq: {
    title: "Frequently Asked Questions",
    subtitle: "Find answers to common questions about the platform",
    searchPlaceholder: "Search questions...",
    noResults: "No questions found matching your search.",
    stillNeedHelp: "Still need help?",
    contactSupport: "Contact Support",
    allCategories: "All Categories",
  },
  docs: {
    title: "Documentation",
    subtitle: "Complete guides and references for IIIntl One",
    tableOfContents: "Table of Contents",
    onThisPage: "On This Page",
  },
  store: {
    title: "Global Marketplace",
    subtitle: "Products and services from vendors across the world",
    searchPlaceholder: "Search products...",
    addToCart: "Add to Cart",
    viewVendor: "View Vendor",
    allCategories: "All Categories",
    becomeVendor: "Become a Vendor",
    manageStore: "Manage Store",
    cart: "Cart",
    checkout: "Checkout",
    myOrders: "My Orders",
    orderHistory: "Order History",
    subtotal: "Subtotal",
    shipping: "Shipping",
    total: "Total",
    freeShipping: "Free Shipping",
    quantity: "Quantity",
    remove: "Remove",
  },
  members: {
    title: "Member Directory",
    subtitle: "Find and connect with members from around the world",
    searchPlaceholder: "Search members...",
    allRoles: "All Roles",
    allRegions: "All Regions",
    viewProfile: "View Profile",
    sendMessage: "Send Message",
    inviteMember: "Invite Member",
  },
  activism: {
    title: "Activism Hub",
    subtitle: "Take action, sign petitions, and attend events",
    signPetition: "Sign Petition",
    takeAction: "Take Action",
    shareEvent: "Share Event",
    signatures: "signatures",
    goal: "Goal",
    daysLeft: "days left",
    upcomingEvents: "Upcoming Events",
    callsToAction: "Calls to Action",
    petitions: "Petitions",
  },
  auth: {
    loginTitle: "Welcome Back",
    loginSubtitle: "Sign in to your IIIntl One account",
    registerTitle: "Join IIIntl One",
    registerSubtitle: "Create your account to get started",
    email: "Email",
    password: "Password",
    confirmPassword: "Confirm Password",
    fullName: "Full Name",
    signIn: "Sign In",
    createAccount: "Create Account",
    noAccount: "Don't have an account?",
    hasAccount: "Already have an account?",
    forgotPassword: "Forgot password?",
    demoAccounts: "Demo Accounts",
    orContinueWith: "Or continue with",
  },
  common: {
    search: "Search",
    filter: "Filter",
    sort: "Sort",
    loading: "Loading...",
    error: "An error occurred",
    save: "Save",
    cancel: "Cancel",
    delete: "Delete",
    edit: "Edit",
    create: "Create",
    submit: "Submit",
    close: "Close",
    back: "Back",
    next: "Next",
    previous: "Previous",
    seeAll: "See All",
    learnMore: "Learn More",
    readMore: "Read More",
    viewAll: "View All",
    noResults: "No results found",
    required: "Required",
    optional: "Optional",
    region: "Region",
    type: "Type",
    status: "Status",
    date: "Date",
    by: "by",
    on: "on",
    in: "in",
    and: "and",
    or: "or",
    of: "of",
    loadMore: "Load More",
    gridView: "Grid View",
    listView: "List View",
    sortBy: "Sort By",
    newest: "Newest",
    oldest: "Oldest",
    popular: "Popular",
    all: "All",
  },
};

// ── French ────────────────────────────────────────────────────────────────────
const FR: Translations = {
  nav: {
    home: "Accueil",
    organizations: "Organisations",
    campaigns: "Campagnes",
    forums: "Forums",
    resources: "Ressources",
    store: "Boutique",
    signIn: "Connexion",
    getStarted: "Commencer",
    dashboard: "Tableau de bord",
    profile: "Profil",
    adminPanel: "Panneau admin",
    logout: "Déconnexion",
    switchRole: "Changer de rôle (Démo)",
  },
  sidebar: {
    main: "Principal",
    community: "Communauté",
    knowledge: "Savoir",
    commerce: "Commerce",
    admin: "Admin",
    dashboard: "Tableau de bord",
    organizations: "Organisations",
    campaigns: "Campagnes",
    activism: "Activisme",
    forums: "Forums",
    members: "Membres",
    directory: "Annuaire",
    resources: "Ressources",
    faq: "FAQ",
    documentation: "Documentation",
    store: "Boutique",
    orders: "Commandes",
    users: "Utilisateurs",
    settings: "Paramètres",
    reports: "Rapports",
  },
  home: {
    badge: "Indépendant · Interdépendant · International",
    headline1: "Une Plateforme.",
    headline2: "Tous les Peuples. Partout.",
    subtext:
      "IIIntl One est la plateforme civique mondiale qui connecte des organisations indépendantes, des militants et des communautés à travers les frontières. Organisez, faites campagne et agissez — ensemble.",
    exploreOrgs: "Explorer les organisations",
    viewCampaigns: "Voir les campagnes",
    platformCapabilities: "Capacités de la plateforme",
    statOrgs: "Organisations membres",
    statMembers: "Membres actifs",
    statCampaigns: "Campagnes actives",
    statResources: "Ressources publiées",
    feature1Title: "Organisations mondiales",
    feature1Desc:
      "Gérez et connectez-vous avec des organisations indépendantes dans le monde entier.",
    feature1Link: "Voir les organisations",
    feature2Title: "Campagnes actives",
    feature2Desc:
      "Lancez, rejoignez et suivez des campagnes civiques avec des indicateurs d'impact en temps réel.",
    feature2Link: "Parcourir les campagnes",
    feature3Title: "Forums communautaires",
    feature3Desc:
      "Participez à des discussions structurées et collaborez au-delà des frontières.",
    feature3Link: "Rejoindre la conversation",
    feature4Title: "Ressources éducatives",
    feature4Desc:
      "Accédez à des guides, rapports, documentation et matériel éducatif pour les acteurs civiques.",
    feature4Link: "Explorer les ressources",
  },
  dashboard: {
    title: "Tableau de bord",
    welcome: "Bon retour",
    organizations: "Organisations",
    activeCampaigns: "Campagnes actives",
    forumPosts: "Messages du forum",
    membersReached: "Membres atteints",
    joined: "rejoint",
    inProgress: "en cours",
    contributed: "contribué",
    acrossAllOrgs: "dans toutes les orgs",
    quickActions: "Actions rapides",
    createCampaign: "Créer une campagne",
    inviteMember: "Inviter un membre",
    newPost: "Nouveau message",
    viewStore: "Voir la boutique",
    myOrganizations: "Mes organisations",
    myCampaigns: "Mes campagnes",
    recentActivity: "Activité récente",
    adminOverview: "Aperçu admin",
    totalUsers: "Utilisateurs totaux",
    totalOrgs: "Orgs totales",
    pendingApprovals: "Approbations en attente",
    activeNow: "Actifs maintenant",
  },
  orgs: {
    title: "Organisations",
    subtitle:
      "Connectez-vous avec des organisations indépendantes du monde entier",
    searchPlaceholder: "Rechercher des organisations...",
    all: "Toutes",
    active: "Actives",
    mine: "Les miennes",
    archived: "Archivées",
    createOrg: "Créer une organisation",
    members: "membres",
    campaigns: "campagnes",
    join: "Rejoindre",
    leave: "Quitter",
    manage: "Gérer",
    viewDetails: "Voir les détails",
  },
  campaigns: {
    title: "Campagnes",
    subtitle: "Rejoignez et dirigez des campagnes civiques sur la plateforme",
    searchPlaceholder: "Rechercher des campagnes...",
    all: "Toutes",
    active: "Actives",
    planning: "Planification",
    completed: "Terminées",
    createCampaign: "Créer une campagne",
    participants: "participants",
    goal: "Objectif",
    startDate: "Date de début",
    endDate: "Date de fin",
    joinCampaign: "Rejoindre la campagne",
    leaveCampaign: "Quitter la campagne",
    status: "Statut",
  },
  forums: {
    title: "Forums",
    subtitle: "Discutez et collaborez avec la communauté mondiale",
    searchPlaceholder: "Rechercher des fils...",
    newThread: "Nouveau fil",
    allCategories: "Toutes les catégories",
    replies: "réponses",
    views: "vues",
    lastActivity: "Dernière activité",
    pinned: "Épinglé",
    locked: "Verrouillé",
    postReply: "Publier une réponse",
    replyPlaceholder: "Écrivez votre réponse...",
  },
  resources: {
    title: "Bibliothèque de ressources",
    subtitle:
      "Guides, rapports et matériaux éducatifs pour les acteurs civiques",
    searchPlaceholder: "Rechercher des ressources...",
    addResource: "Ajouter une ressource",
    allTypes: "Tous les types",
    article: "Article",
    guide: "Guide",
    report: "Rapport",
    video: "Vidéo",
    readMore: "Lire la suite",
    download: "Télécharger",
  },
  faq: {
    title: "Questions fréquemment posées",
    subtitle: "Trouvez des réponses aux questions courantes sur la plateforme",
    searchPlaceholder: "Rechercher des questions...",
    noResults: "Aucune question ne correspond à votre recherche.",
    stillNeedHelp: "Vous avez encore besoin d'aide?",
    contactSupport: "Contacter le support",
    allCategories: "Toutes les catégories",
  },
  docs: {
    title: "Documentation",
    subtitle: "Guides complets et références pour IIIntl One",
    tableOfContents: "Table des matières",
    onThisPage: "Sur cette page",
  },
  store: {
    title: "Marché mondial",
    subtitle: "Produits et services de vendeurs du monde entier",
    searchPlaceholder: "Rechercher des produits...",
    addToCart: "Ajouter au panier",
    viewVendor: "Voir le vendeur",
    allCategories: "Toutes les catégories",
    becomeVendor: "Devenir vendeur",
    manageStore: "Gérer la boutique",
    cart: "Panier",
    checkout: "Commander",
    myOrders: "Mes commandes",
    orderHistory: "Historique des commandes",
    subtotal: "Sous-total",
    shipping: "Livraison",
    total: "Total",
    freeShipping: "Livraison gratuite",
    quantity: "Quantité",
    remove: "Supprimer",
  },
  members: {
    title: "Annuaire des membres",
    subtitle: "Trouvez et connectez-vous avec des membres du monde entier",
    searchPlaceholder: "Rechercher des membres...",
    allRoles: "Tous les rôles",
    allRegions: "Toutes les régions",
    viewProfile: "Voir le profil",
    sendMessage: "Envoyer un message",
    inviteMember: "Inviter un membre",
  },
  activism: {
    title: "Centre d'activisme",
    subtitle: "Agissez, signez des pétitions et participez à des événements",
    signPetition: "Signer la pétition",
    takeAction: "Agir",
    shareEvent: "Partager l'événement",
    signatures: "signatures",
    goal: "Objectif",
    daysLeft: "jours restants",
    upcomingEvents: "Événements à venir",
    callsToAction: "Appels à l'action",
    petitions: "Pétitions",
  },
  auth: {
    loginTitle: "Bon retour",
    loginSubtitle: "Connectez-vous à votre compte IIIntl One",
    registerTitle: "Rejoindre IIIntl One",
    registerSubtitle: "Créez votre compte pour commencer",
    email: "Email",
    password: "Mot de passe",
    confirmPassword: "Confirmer le mot de passe",
    fullName: "Nom complet",
    signIn: "Se connecter",
    createAccount: "Créer un compte",
    noAccount: "Vous n'avez pas de compte?",
    hasAccount: "Vous avez déjà un compte?",
    forgotPassword: "Mot de passe oublié?",
    demoAccounts: "Comptes démo",
    orContinueWith: "Ou continuer avec",
  },
  common: {
    search: "Rechercher",
    filter: "Filtrer",
    sort: "Trier",
    loading: "Chargement...",
    error: "Une erreur s'est produite",
    save: "Enregistrer",
    cancel: "Annuler",
    delete: "Supprimer",
    edit: "Modifier",
    create: "Créer",
    submit: "Soumettre",
    close: "Fermer",
    back: "Retour",
    next: "Suivant",
    previous: "Précédent",
    seeAll: "Voir tout",
    learnMore: "En savoir plus",
    readMore: "Lire la suite",
    viewAll: "Voir tout",
    noResults: "Aucun résultat trouvé",
    required: "Obligatoire",
    optional: "Optionnel",
    region: "Région",
    type: "Type",
    status: "Statut",
    date: "Date",
    by: "par",
    on: "le",
    in: "dans",
    and: "et",
    or: "ou",
    of: "de",
    loadMore: "Charger plus",
    gridView: "Vue en grille",
    listView: "Vue en liste",
    sortBy: "Trier par",
    newest: "Plus récent",
    oldest: "Plus ancien",
    popular: "Populaire",
    all: "Tous",
  },
};

// ── Spanish ───────────────────────────────────────────────────────────────────
const ES: Translations = {
  nav: {
    home: "Inicio",
    organizations: "Organizaciones",
    campaigns: "Campañas",
    forums: "Foros",
    resources: "Recursos",
    store: "Tienda",
    signIn: "Iniciar sesión",
    getStarted: "Comenzar",
    dashboard: "Panel",
    profile: "Perfil",
    adminPanel: "Panel de admin",
    logout: "Cerrar sesión",
    switchRole: "Cambiar rol (Demo)",
  },
  sidebar: {
    main: "Principal",
    community: "Comunidad",
    knowledge: "Conocimiento",
    commerce: "Comercio",
    admin: "Admin",
    dashboard: "Panel",
    organizations: "Organizaciones",
    campaigns: "Campañas",
    activism: "Activismo",
    forums: "Foros",
    members: "Miembros",
    directory: "Directorio",
    resources: "Recursos",
    faq: "Preguntas frecuentes",
    documentation: "Documentación",
    store: "Tienda",
    orders: "Pedidos",
    users: "Usuarios",
    settings: "Configuración",
    reports: "Informes",
  },
  home: {
    badge: "Independiente · Interdependiente · Internacional",
    headline1: "Una Plataforma.",
    headline2: "Toda la Gente. En Todo el Mundo.",
    subtext:
      "IIIntl One es la plataforma cívica global que conecta organizaciones independientes, activistas y comunidades a través de las fronteras. Organice, haga campaña y actúe — juntos.",
    exploreOrgs: "Explorar organizaciones",
    viewCampaigns: "Ver campañas",
    platformCapabilities: "Capacidades de la plataforma",
    statOrgs: "Organizaciones miembro",
    statMembers: "Miembros activos",
    statCampaigns: "Campañas activas",
    statResources: "Recursos publicados",
    feature1Title: "Organizaciones globales",
    feature1Desc:
      "Gestione y conéctese con organizaciones independientes en todo el mundo.",
    feature1Link: "Ver organizaciones",
    feature2Title: "Campañas activas",
    feature2Desc:
      "Lance, únase y realice el seguimiento de campañas cívicas con métricas de impacto en tiempo real.",
    feature2Link: "Explorar campañas",
    feature3Title: "Foros comunitarios",
    feature3Desc:
      "Participe en debates estructurados y colabore más allá de las fronteras.",
    feature3Link: "Unirse a la conversación",
    feature4Title: "Recursos educativos",
    feature4Desc:
      "Acceda a guías, informes, documentación y material educativo para actores cívicos.",
    feature4Link: "Explorar recursos",
  },
  dashboard: {
    title: "Panel",
    welcome: "Bienvenido de nuevo",
    organizations: "Organizaciones",
    activeCampaigns: "Campañas activas",
    forumPosts: "Publicaciones en foros",
    membersReached: "Miembros alcanzados",
    joined: "unidos",
    inProgress: "en progreso",
    contributed: "contribuido",
    acrossAllOrgs: "en todas las orgs",
    quickActions: "Acciones rápidas",
    createCampaign: "Crear campaña",
    inviteMember: "Invitar miembro",
    newPost: "Nueva publicación",
    viewStore: "Ver tienda",
    myOrganizations: "Mis organizaciones",
    myCampaigns: "Mis campañas",
    recentActivity: "Actividad reciente",
    adminOverview: "Resumen de admin",
    totalUsers: "Usuarios totales",
    totalOrgs: "Orgs totales",
    pendingApprovals: "Aprobaciones pendientes",
    activeNow: "Activos ahora",
  },
  orgs: {
    title: "Organizaciones",
    subtitle: "Conéctese con organizaciones independientes de todo el mundo",
    searchPlaceholder: "Buscar organizaciones...",
    all: "Todas",
    active: "Activas",
    mine: "Las mías",
    archived: "Archivadas",
    createOrg: "Crear organización",
    members: "miembros",
    campaigns: "campañas",
    join: "Unirse",
    leave: "Salir",
    manage: "Gestionar",
    viewDetails: "Ver detalles",
  },
  campaigns: {
    title: "Campañas",
    subtitle: "Únase y lidere campañas cívicas en la plataforma",
    searchPlaceholder: "Buscar campañas...",
    all: "Todas",
    active: "Activas",
    planning: "Planificación",
    completed: "Completadas",
    createCampaign: "Crear campaña",
    participants: "participantes",
    goal: "Meta",
    startDate: "Fecha de inicio",
    endDate: "Fecha de fin",
    joinCampaign: "Unirse a la campaña",
    leaveCampaign: "Salir de la campaña",
    status: "Estado",
  },
  forums: {
    title: "Foros",
    subtitle: "Debate y colabora con la comunidad global",
    searchPlaceholder: "Buscar hilos...",
    newThread: "Nuevo hilo",
    allCategories: "Todas las categorías",
    replies: "respuestas",
    views: "vistas",
    lastActivity: "Última actividad",
    pinned: "Fijado",
    locked: "Bloqueado",
    postReply: "Publicar respuesta",
    replyPlaceholder: "Escribe tu respuesta...",
  },
  resources: {
    title: "Biblioteca de recursos",
    subtitle: "Guías, informes y materiales educativos para actores cívicos",
    searchPlaceholder: "Buscar recursos...",
    addResource: "Agregar recurso",
    allTypes: "Todos los tipos",
    article: "Artículo",
    guide: "Guía",
    report: "Informe",
    video: "Video",
    readMore: "Leer más",
    download: "Descargar",
  },
  faq: {
    title: "Preguntas frecuentes",
    subtitle: "Encuentre respuestas a preguntas comunes sobre la plataforma",
    searchPlaceholder: "Buscar preguntas...",
    noResults: "No se encontraron preguntas que coincidan con su búsqueda.",
    stillNeedHelp: "¿Aún necesita ayuda?",
    contactSupport: "Contactar soporte",
    allCategories: "Todas las categorías",
  },
  docs: {
    title: "Documentación",
    subtitle: "Guías completas y referencias para IIIntl One",
    tableOfContents: "Tabla de contenidos",
    onThisPage: "En esta página",
  },
  store: {
    title: "Mercado global",
    subtitle: "Productos y servicios de vendedores de todo el mundo",
    searchPlaceholder: "Buscar productos...",
    addToCart: "Agregar al carrito",
    viewVendor: "Ver vendedor",
    allCategories: "Todas las categorías",
    becomeVendor: "Convertirse en vendedor",
    manageStore: "Gestionar tienda",
    cart: "Carrito",
    checkout: "Pagar",
    myOrders: "Mis pedidos",
    orderHistory: "Historial de pedidos",
    subtotal: "Subtotal",
    shipping: "Envío",
    total: "Total",
    freeShipping: "Envío gratuito",
    quantity: "Cantidad",
    remove: "Eliminar",
  },
  members: {
    title: "Directorio de miembros",
    subtitle: "Encuentre y conéctese con miembros de todo el mundo",
    searchPlaceholder: "Buscar miembros...",
    allRoles: "Todos los roles",
    allRegions: "Todas las regiones",
    viewProfile: "Ver perfil",
    sendMessage: "Enviar mensaje",
    inviteMember: "Invitar miembro",
  },
  activism: {
    title: "Centro de activismo",
    subtitle: "Tome acción, firme peticiones y asista a eventos",
    signPetition: "Firmar petición",
    takeAction: "Tomar acción",
    shareEvent: "Compartir evento",
    signatures: "firmas",
    goal: "Meta",
    daysLeft: "días restantes",
    upcomingEvents: "Próximos eventos",
    callsToAction: "Llamadas a la acción",
    petitions: "Peticiones",
  },
  auth: {
    loginTitle: "Bienvenido de nuevo",
    loginSubtitle: "Inicie sesión en su cuenta IIIntl One",
    registerTitle: "Únase a IIIntl One",
    registerSubtitle: "Cree su cuenta para comenzar",
    email: "Correo electrónico",
    password: "Contraseña",
    confirmPassword: "Confirmar contraseña",
    fullName: "Nombre completo",
    signIn: "Iniciar sesión",
    createAccount: "Crear cuenta",
    noAccount: "¿No tiene una cuenta?",
    hasAccount: "¿Ya tiene una cuenta?",
    forgotPassword: "¿Olvidó su contraseña?",
    demoAccounts: "Cuentas de demostración",
    orContinueWith: "O continuar con",
  },
  common: {
    search: "Buscar",
    filter: "Filtrar",
    sort: "Ordenar",
    loading: "Cargando...",
    error: "Ocurrió un error",
    save: "Guardar",
    cancel: "Cancelar",
    delete: "Eliminar",
    edit: "Editar",
    create: "Crear",
    submit: "Enviar",
    close: "Cerrar",
    back: "Volver",
    next: "Siguiente",
    previous: "Anterior",
    seeAll: "Ver todo",
    learnMore: "Más información",
    readMore: "Leer más",
    viewAll: "Ver todo",
    noResults: "No se encontraron resultados",
    required: "Obligatorio",
    optional: "Opcional",
    region: "Región",
    type: "Tipo",
    status: "Estado",
    date: "Fecha",
    by: "por",
    on: "el",
    in: "en",
    and: "y",
    or: "o",
    of: "de",
    loadMore: "Cargar más",
    gridView: "Vista en cuadrícula",
    listView: "Vista en lista",
    sortBy: "Ordenar por",
    newest: "Más reciente",
    oldest: "Más antiguo",
    popular: "Popular",
    all: "Todo",
  },
};

// ── Arabic ────────────────────────────────────────────────────────────────────
const AR: Translations = {
  nav: {
    home: "الرئيسية",
    organizations: "المنظمات",
    campaigns: "الحملات",
    forums: "المنتديات",
    resources: "الموارد",
    store: "المتجر",
    signIn: "تسجيل الدخول",
    getStarted: "ابدأ الآن",
    dashboard: "لوحة التحكم",
    profile: "الملف الشخصي",
    adminPanel: "لوحة الإدارة",
    logout: "تسجيل الخروج",
    switchRole: "تغيير الدور (تجريبي)",
  },
  sidebar: {
    main: "الرئيسية",
    community: "المجتمع",
    knowledge: "المعرفة",
    commerce: "التجارة",
    admin: "الإدارة",
    dashboard: "لوحة التحكم",
    organizations: "المنظمات",
    campaigns: "الحملات",
    activism: "النشاط",
    forums: "المنتديات",
    members: "الأعضاء",
    directory: "الدليل",
    resources: "الموارد",
    faq: "الأسئلة الشائعة",
    documentation: "التوثيق",
    store: "المتجر",
    orders: "الطلبات",
    users: "المستخدمون",
    settings: "الإعدادات",
    reports: "التقارير",
  },
  home: {
    badge: "مستقل · متشابك · دولي",
    headline1: "منصة واحدة.",
    headline2: "كل الناس. في كل مكان.",
    subtext:
      "IIIntl One هي المنصة المدنية العالمية التي تربط المنظمات المستقلة والناشطين والمجتمعات عبر الحدود. نظم واعمل معاً.",
    exploreOrgs: "استكشاف المنظمات",
    viewCampaigns: "عرض الحملات",
    platformCapabilities: "إمكانيات المنصة",
    statOrgs: "المنظمات الأعضاء",
    statMembers: "الأعضاء النشطون",
    statCampaigns: "الحملات النشطة",
    statResources: "الموارد المنشورة",
    feature1Title: "المنظمات العالمية",
    feature1Desc: "إدارة والتواصل مع منظمات مستقلة في جميع أنحاء العالم.",
    feature1Link: "عرض المنظمات",
    feature2Title: "الحملات النشطة",
    feature2Desc: "أطلق حملات مدنية وانضم إليها وتابعها مع مقاييس الأثر.",
    feature2Link: "تصفح الحملات",
    feature3Title: "منتديات المجتمع",
    feature3Desc: "شارك في النقاشات المنظمة وتعاون عبر الحدود.",
    feature3Link: "انضم إلى الحوار",
    feature4Title: "الموارد التعليمية",
    feature4Desc: "الوصول إلى الأدلة والتقارير والوثائق للفاعلين المدنيين.",
    feature4Link: "استكشاف الموارد",
  },
  dashboard: {
    title: "لوحة التحكم",
    welcome: "مرحباً بعودتك",
    organizations: "المنظمات",
    activeCampaigns: "الحملات النشطة",
    forumPosts: "مشاركات المنتدى",
    membersReached: "الأعضاء المُتواصل معهم",
    joined: "انضم",
    inProgress: "قيد التنفيذ",
    contributed: "ساهم",
    acrossAllOrgs: "في جميع المنظمات",
    quickActions: "إجراءات سريعة",
    createCampaign: "إنشاء حملة",
    inviteMember: "دعوة عضو",
    newPost: "مشاركة جديدة",
    viewStore: "عرض المتجر",
    myOrganizations: "منظماتي",
    myCampaigns: "حملاتي",
    recentActivity: "النشاط الأخير",
    adminOverview: "نظرة عامة للمسؤول",
    totalUsers: "إجمالي المستخدمين",
    totalOrgs: "إجمالي المنظمات",
    pendingApprovals: "الموافقات المعلقة",
    activeNow: "نشط الآن",
  },
  orgs: {
    title: "المنظمات",
    subtitle: "التواصل مع منظمات مستقلة من جميع أنحاء العالم",
    searchPlaceholder: "البحث في المنظمات...",
    all: "الكل",
    active: "نشطة",
    mine: "منظماتي",
    archived: "مؤرشفة",
    createOrg: "إنشاء منظمة",
    members: "أعضاء",
    campaigns: "حملات",
    join: "انضم",
    leave: "غادر",
    manage: "إدارة",
    viewDetails: "عرض التفاصيل",
  },
  campaigns: {
    title: "الحملات",
    subtitle: "انضم إلى الحملات المدنية وقدها على المنصة",
    searchPlaceholder: "البحث في الحملات...",
    all: "الكل",
    active: "نشطة",
    planning: "قيد التخطيط",
    completed: "مكتملة",
    createCampaign: "إنشاء حملة",
    participants: "مشاركون",
    goal: "الهدف",
    startDate: "تاريخ البداية",
    endDate: "تاريخ النهاية",
    joinCampaign: "انضم للحملة",
    leaveCampaign: "مغادرة الحملة",
    status: "الحالة",
  },
  forums: {
    title: "المنتديات",
    subtitle: "ناقش وتعاون مع المجتمع العالمي",
    searchPlaceholder: "البحث في المواضيع...",
    newThread: "موضوع جديد",
    allCategories: "جميع الفئات",
    replies: "ردود",
    views: "مشاهدات",
    lastActivity: "آخر نشاط",
    pinned: "مثبت",
    locked: "مقفل",
    postReply: "نشر رد",
    replyPlaceholder: "اكتب ردك...",
  },
  resources: {
    title: "مكتبة الموارد",
    subtitle: "أدلة وتقارير ومواد تعليمية للفاعلين المدنيين",
    searchPlaceholder: "البحث في الموارد...",
    addResource: "إضافة مورد",
    allTypes: "جميع الأنواع",
    article: "مقالة",
    guide: "دليل",
    report: "تقرير",
    video: "فيديو",
    readMore: "اقرأ المزيد",
    download: "تحميل",
  },
  faq: {
    title: "الأسئلة الشائعة",
    subtitle: "اعثر على إجابات للأسئلة الشائعة حول المنصة",
    searchPlaceholder: "البحث في الأسئلة...",
    noResults: "لا توجد أسئلة تطابق بحثك.",
    stillNeedHelp: "لا تزال بحاجة إلى مساعدة؟",
    contactSupport: "اتصل بالدعم",
    allCategories: "جميع الفئات",
  },
  docs: {
    title: "التوثيق",
    subtitle: "أدلة شاملة ومراجع لـ IIIntl One",
    tableOfContents: "جدول المحتويات",
    onThisPage: "في هذه الصفحة",
  },
  store: {
    title: "السوق العالمي",
    subtitle: "منتجات وخدمات من بائعين حول العالم",
    searchPlaceholder: "البحث في المنتجات...",
    addToCart: "أضف إلى السلة",
    viewVendor: "عرض البائع",
    allCategories: "جميع الفئات",
    becomeVendor: "كن بائعاً",
    manageStore: "إدارة المتجر",
    cart: "سلة التسوق",
    checkout: "الدفع",
    myOrders: "طلباتي",
    orderHistory: "سجل الطلبات",
    subtotal: "المجموع الفرعي",
    shipping: "الشحن",
    total: "الإجمالي",
    freeShipping: "شحن مجاني",
    quantity: "الكمية",
    remove: "حذف",
  },
  members: {
    title: "دليل الأعضاء",
    subtitle: "اعثر على أعضاء من جميع أنحاء العالم وتواصل معهم",
    searchPlaceholder: "البحث في الأعضاء...",
    allRoles: "جميع الأدوار",
    allRegions: "جميع المناطق",
    viewProfile: "عرض الملف الشخصي",
    sendMessage: "إرسال رسالة",
    inviteMember: "دعوة عضو",
  },
  activism: {
    title: "مركز النشاط",
    subtitle: "اتخذ إجراءات، وقّع العرائض، وحضر الفعاليات",
    signPetition: "وقّع العريضة",
    takeAction: "اتخذ إجراءً",
    shareEvent: "شارك الحدث",
    signatures: "توقيع",
    goal: "الهدف",
    daysLeft: "أيام متبقية",
    upcomingEvents: "الفعاليات القادمة",
    callsToAction: "دعوات للعمل",
    petitions: "العرائض",
  },
  auth: {
    loginTitle: "مرحباً بعودتك",
    loginSubtitle: "تسجيل الدخول إلى حساب IIIntl One",
    registerTitle: "انضم إلى IIIntl One",
    registerSubtitle: "أنشئ حسابك للبدء",
    email: "البريد الإلكتروني",
    password: "كلمة المرور",
    confirmPassword: "تأكيد كلمة المرور",
    fullName: "الاسم الكامل",
    signIn: "تسجيل الدخول",
    createAccount: "إنشاء حساب",
    noAccount: "ليس لديك حساب؟",
    hasAccount: "لديك حساب بالفعل؟",
    forgotPassword: "نسيت كلمة المرور؟",
    demoAccounts: "حسابات تجريبية",
    orContinueWith: "أو المتابعة مع",
  },
  common: {
    search: "بحث",
    filter: "تصفية",
    sort: "ترتيب",
    loading: "جارٍ التحميل...",
    error: "حدث خطأ",
    save: "حفظ",
    cancel: "إلغاء",
    delete: "حذف",
    edit: "تعديل",
    create: "إنشاء",
    submit: "إرسال",
    close: "إغلاق",
    back: "رجوع",
    next: "التالي",
    previous: "السابق",
    seeAll: "عرض الكل",
    learnMore: "اعرف المزيد",
    readMore: "اقرأ المزيد",
    viewAll: "عرض الكل",
    noResults: "لا توجد نتائج",
    required: "مطلوب",
    optional: "اختياري",
    region: "المنطقة",
    type: "النوع",
    status: "الحالة",
    date: "التاريخ",
    by: "بواسطة",
    on: "في",
    in: "في",
    and: "و",
    or: "أو",
    of: "من",
    loadMore: "تحميل المزيد",
    gridView: "عرض الشبكة",
    listView: "عرض القائمة",
    sortBy: "ترتيب حسب",
    newest: "الأحدث",
    oldest: "الأقدم",
    popular: "الأكثر شيوعاً",
    all: "الكل",
  },
};

// ── Chinese ───────────────────────────────────────────────────────────────────
const ZH: Translations = {
  nav: {
    home: "首页",
    organizations: "组织",
    campaigns: "运动",
    forums: "论坛",
    resources: "资源",
    store: "商店",
    signIn: "登录",
    getStarted: "开始使用",
    dashboard: "仪表板",
    profile: "个人资料",
    adminPanel: "管理面板",
    logout: "退出登录",
    switchRole: "切换角色（演示）",
  },
  sidebar: {
    main: "主要",
    community: "社区",
    knowledge: "知识",
    commerce: "商业",
    admin: "管理",
    dashboard: "仪表板",
    organizations: "组织",
    campaigns: "运动",
    activism: "行动主义",
    forums: "论坛",
    members: "成员",
    directory: "目录",
    resources: "资源",
    faq: "常见问题",
    documentation: "文档",
    store: "商店",
    orders: "订单",
    users: "用户",
    settings: "设置",
    reports: "报告",
  },
  home: {
    badge: "独立 · 相互依存 · 国际",
    headline1: "一个平台。",
    headline2: "所有人。全世界。",
    subtext:
      "IIIntl One 是连接独立组织、活动人士和跨越国界的社区的全球公民平台。共同组织、开展运动、采取行动。",
    exploreOrgs: "探索组织",
    viewCampaigns: "查看运动",
    platformCapabilities: "平台功能",
    statOrgs: "成员组织",
    statMembers: "活跃成员",
    statCampaigns: "活跃运动",
    statResources: "已发布资源",
    feature1Title: "全球组织",
    feature1Desc: "管理并与全球各地区的独立组织联系。",
    feature1Link: "查看组织",
    feature2Title: "活跃运动",
    feature2Desc: "发起、加入并跟踪公民运动，实时了解参与和影响指标。",
    feature2Link: "浏览运动",
    feature3Title: "社区论坛",
    feature3Desc: "参与结构化讨论，跨越国界共同合作。",
    feature3Link: "加入对话",
    feature4Title: "知识资源",
    feature4Desc: "获取面向公民行动者的指南、报告、文档和教育材料。",
    feature4Link: "探索资源",
  },
  dashboard: {
    title: "仪表板",
    welcome: "欢迎回来",
    organizations: "组织",
    activeCampaigns: "活跃运动",
    forumPosts: "论坛帖子",
    membersReached: "覆盖成员",
    joined: "已加入",
    inProgress: "进行中",
    contributed: "已贡献",
    acrossAllOrgs: "所有组织",
    quickActions: "快速操作",
    createCampaign: "创建运动",
    inviteMember: "邀请成员",
    newPost: "新帖子",
    viewStore: "查看商店",
    myOrganizations: "我的组织",
    myCampaigns: "我的运动",
    recentActivity: "最近活动",
    adminOverview: "管理概览",
    totalUsers: "总用户数",
    totalOrgs: "总组织数",
    pendingApprovals: "待审批",
    activeNow: "当前活跃",
  },
  orgs: {
    title: "组织",
    subtitle: "与全球独立组织建立联系",
    searchPlaceholder: "搜索组织...",
    all: "全部",
    active: "活跃",
    mine: "我的",
    archived: "已归档",
    createOrg: "创建组织",
    members: "成员",
    campaigns: "运动",
    join: "加入",
    leave: "退出",
    manage: "管理",
    viewDetails: "查看详情",
  },
  campaigns: {
    title: "运动",
    subtitle: "加入并领导平台上的公民运动",
    searchPlaceholder: "搜索运动...",
    all: "全部",
    active: "活跃",
    planning: "计划中",
    completed: "已完成",
    createCampaign: "创建运动",
    participants: "参与者",
    goal: "目标",
    startDate: "开始日期",
    endDate: "结束日期",
    joinCampaign: "加入运动",
    leaveCampaign: "退出运动",
    status: "状态",
  },
  forums: {
    title: "论坛",
    subtitle: "与全球社区讨论和合作",
    searchPlaceholder: "搜索帖子...",
    newThread: "新话题",
    allCategories: "所有分类",
    replies: "回复",
    views: "浏览",
    lastActivity: "最后活动",
    pinned: "置顶",
    locked: "已锁定",
    postReply: "发表回复",
    replyPlaceholder: "写下你的回复...",
  },
  resources: {
    title: "资源库",
    subtitle: "面向公民行动者的指南、报告和教育材料",
    searchPlaceholder: "搜索资源...",
    addResource: "添加资源",
    allTypes: "所有类型",
    article: "文章",
    guide: "指南",
    report: "报告",
    video: "视频",
    readMore: "阅读更多",
    download: "下载",
  },
  faq: {
    title: "常见问题",
    subtitle: "查找有关平台的常见问题解答",
    searchPlaceholder: "搜索问题...",
    noResults: "未找到与您搜索匹配的问题。",
    stillNeedHelp: "仍需帮助？",
    contactSupport: "联系支持",
    allCategories: "所有分类",
  },
  docs: {
    title: "文档",
    subtitle: "IIIntl One 的完整指南和参考资料",
    tableOfContents: "目录",
    onThisPage: "本页内容",
  },
  store: {
    title: "全球市场",
    subtitle: "来自全球卖家的产品和服务",
    searchPlaceholder: "搜索产品...",
    addToCart: "加入购物车",
    viewVendor: "查看卖家",
    allCategories: "所有分类",
    becomeVendor: "成为卖家",
    manageStore: "管理店铺",
    cart: "购物车",
    checkout: "结账",
    myOrders: "我的订单",
    orderHistory: "订单历史",
    subtotal: "小计",
    shipping: "运费",
    total: "总计",
    freeShipping: "免费配送",
    quantity: "数量",
    remove: "删除",
  },
  members: {
    title: "成员目录",
    subtitle: "寻找并联系来自世界各地的成员",
    searchPlaceholder: "搜索成员...",
    allRoles: "所有角色",
    allRegions: "所有地区",
    viewProfile: "查看资料",
    sendMessage: "发送消息",
    inviteMember: "邀请成员",
  },
  activism: {
    title: "行动主义中心",
    subtitle: "采取行动、签署请愿书并参加活动",
    signPetition: "签署请愿书",
    takeAction: "采取行动",
    shareEvent: "分享活动",
    signatures: "签名",
    goal: "目标",
    daysLeft: "剩余天数",
    upcomingEvents: "即将到来的活动",
    callsToAction: "行动号召",
    petitions: "请愿书",
  },
  auth: {
    loginTitle: "欢迎回来",
    loginSubtitle: "登录您的 IIIntl One 账户",
    registerTitle: "加入 IIIntl One",
    registerSubtitle: "创建您的账户以开始使用",
    email: "电子邮件",
    password: "密码",
    confirmPassword: "确认密码",
    fullName: "全名",
    signIn: "登录",
    createAccount: "创建账户",
    noAccount: "没有账户？",
    hasAccount: "已有账户？",
    forgotPassword: "忘记密码？",
    demoAccounts: "演示账户",
    orContinueWith: "或继续使用",
  },
  common: {
    search: "搜索",
    filter: "筛选",
    sort: "排序",
    loading: "加载中...",
    error: "发生错误",
    save: "保存",
    cancel: "取消",
    delete: "删除",
    edit: "编辑",
    create: "创建",
    submit: "提交",
    close: "关闭",
    back: "返回",
    next: "下一步",
    previous: "上一步",
    seeAll: "查看全部",
    learnMore: "了解更多",
    readMore: "阅读更多",
    viewAll: "查看全部",
    noResults: "未找到结果",
    required: "必填",
    optional: "可选",
    region: "地区",
    type: "类型",
    status: "状态",
    date: "日期",
    by: "由",
    on: "于",
    in: "在",
    and: "和",
    or: "或",
    of: "的",
    loadMore: "加载更多",
    gridView: "网格视图",
    listView: "列表视图",
    sortBy: "排序方式",
    newest: "最新",
    oldest: "最旧",
    popular: "热门",
    all: "全部",
  },
};

// ── Translation map ───────────────────────────────────────────────────────────
const TRANSLATIONS: Record<Language, Translations> = { EN, FR, ES, AR, ZH };

// ── Context ───────────────────────────────────────────────────────────────────
interface I18nContextValue {
  language: Language;
  setLanguage: (lang: Language) => void;
  t: Translations;
  dir: "ltr" | "rtl";
}

const I18nContext = createContext<I18nContextValue>({
  language: "EN",
  setLanguage: () => {},
  t: EN,
  dir: "ltr",
});

export function I18nProvider({ children }: { children: ReactNode }) {
  const [language, setLanguageState] = useState<Language>(() => {
    try {
      const saved = localStorage.getItem("iiintl-language") as Language | null;
      return saved && TRANSLATIONS[saved] ? saved : "EN";
    } catch {
      return "EN";
    }
  });

  const setLanguage = (lang: Language) => {
    setLanguageState(lang);
    try {
      localStorage.setItem("iiintl-language", lang);
    } catch {}
    // Update document direction for RTL languages
    const langInfo = LANGUAGES.find((l) => l.code === lang);
    document.documentElement.dir = langInfo?.dir ?? "ltr";
    document.documentElement.lang = lang.toLowerCase();
  };

  const langInfo = LANGUAGES.find((l) => l.code === language);

  return (
    <I18nContext.Provider
      value={{
        language,
        setLanguage,
        t: TRANSLATIONS[language],
        dir: langInfo?.dir ?? "ltr",
      }}
    >
      {children}
    </I18nContext.Provider>
  );
}

export function useI18n() {
  return useContext(I18nContext);
}
