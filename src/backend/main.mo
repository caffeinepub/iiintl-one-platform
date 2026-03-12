import Int "mo:core/Int";
import Set "mo:core/Set";
import Time "mo:core/Time";
import Map "mo:core/Map";
import Iter "mo:core/Iter";
import Array "mo:core/Array";
import Runtime "mo:core/Runtime";
import Nat "mo:core/Nat";
import Float "mo:core/Float";
import MixinAuthorization "authorization/MixinAuthorization";
import AccessControl "authorization/access-control";



actor {
  // Initialize the access control system
  let accessControlState = AccessControl.initState();
  include MixinAuthorization(accessControlState);

  // === Existing Types ===

  public type Role = {
    #admin;
    #moderator;
    #member;
    #guest;
  };

  public type User = {
    id : Text;
    displayName : Text;
    email : Text;
    role : Role;
    joinedAt : Int;
    bio : Text;
    avatarUrl : Text;
    isActive : Bool;
  };

  public type UserProfile = {
    displayName : Text;
    email : Text;
    bio : Text;
    avatarUrl : Text;
  };

  public type Organization = {
    id : Text;
    name : Text;
    description : Text;
    region : Text;
    orgType : Text;
    website : Text;
    status : OrgStatus;
    foundedYear : Int;
    createdAt : Int;
    createdBy : Principal;
    members : [OrgMember];
  };

  public type OrgStatus = {
    #active;
    #archived;
  };

  public type OrgMember = {
    userId : Text;
    role : OrgMemberRole;
    joinedAt : Int;
  };

  public type OrgMemberRole = {
    #member;
    #admin;
  };

  public type CampaignType = {
    #petition;
    #fundraiser;
    #awareness;
    #action;
  };

  public type CampaignStatus = {
    #draft;
    #active;
    #completed;
    #archived;
  };

  public type Campaign = {
    id : Text;
    title : Text;
    description : Text;
    campaignType : CampaignType;
    status : CampaignStatus;
    orgId : Text;
    createdBy : Principal;
    createdAt : Int;
    goal : Nat;
    progress : Nat;
    supporterCount : Nat;
    startDate : Int;
    endDate : Int;
    tags : [Text];
  };

  // Forums Types
  public type ForumCategory = {
    #general;
    #campaigns;
    #resources;
    #activism;
    #announcements;
    #regional;
  };

  public type ThreadStatus = {
    #open;
    #locked;
    #archived;
  };

  public type ForumThread = {
    id : Nat;
    title : Text;
    body : Text;
    category : ForumCategory;
    orgId : ?Text;
    tags : [Text];
    createdBy : Principal;
    createdAt : Int;
    status : ThreadStatus;
    isPinned : Bool;
    replyCount : Nat;
    viewCount : Nat;
  };

  public type ForumReply = {
    id : Nat;
    threadId : Nat;
    body : Text;
    createdBy : Principal;
    createdAt : Int;
    isModeratorReply : Bool;
  };

  // === Wallet Module Types ===

  public type WalletType = {
    #internetIdentity;
    #plug;
    #stoic;
  };

  public type Wallet = {
    address : Text;
    walletType : WalletType;
    walletLabel : Text; // Renamed from label to walletLabel
    balanceICP : Float;
    linkedAt : Int;
  };

  public type Transaction = {
    id : Nat;
    walletAddress : Text;
    amountICP : Float;
    description : Text;
    txType : TransactionType;
    timestamp : Int;
  };

  public type TransactionType = {
    #sent;
    #received;
  };


  public type UserSummary = {
    id : Text;
    displayName : Text;
    role : Role;
    bio : Text;
    avatarUrl : Text;
    joinedAt : Int;
    isActive : Bool;
  };

  // Storage variables
  let users = Map.empty<Text, User>();
  let principalToUserId = Map.empty<Principal, Text>();
  let organizations = Map.empty<Text, Organization>();
  let campaigns = Map.empty<Text, Campaign>();
  let campaignSupporters = Map.empty<Text, Set.Set<Principal>>();

  // Forums storage
  let forumThreads = Map.empty<Nat, ForumThread>();
  let forumReplies = Map.empty<Nat, ForumReply>();
  let threadReplies = Map.empty<Nat, Set.Set<Nat>>();
  var nextThreadId = 1;
  var nextReplyId = 1;

  // === Wallet Storage ===
  let userWallets = Map.empty<Principal, Map.Map<Text, Wallet>>();
  let userTransactions = Map.empty<Principal, Map.Map<Nat, Transaction>>();
  var nextTransactionId = 1;
  let userLanguages = Map.empty<Principal, Text>();

  // === User Functions ===

  public shared ({ caller }) func registerUser(displayName : Text, email : Text) : async Text {
    if (not (AccessControl.hasPermission(accessControlState, caller, #user))) {
      Runtime.trap("Unauthorized: Only authenticated users can register");
    };

    let userId = caller.toText();

    // Check already registered
    switch (users.get(userId)) {
      case (?_) { Runtime.trap("User already registered") };
      case (null) {
        let newUser : User = {
          id = userId;
          displayName;
          email;
          role = #member;
          joinedAt = Time.now();
          bio = "";
          avatarUrl = "";
          isActive = true;
        };
        users.add(userId, newUser);
        principalToUserId.add(caller, userId);
        userId;
      };
    };
  };

  // === Organization Functions ===

  public shared ({ caller }) func createOrg(
    name : Text,
    description : Text,
    region : Text,
    orgType : Text,
    website : Text,
    foundedYear : Int,
  ) : async Text {
    if (not (AccessControl.hasPermission(accessControlState, caller, #user))) {
      Runtime.trap("Unauthorized: Only authenticated users can create organizations");
    };

    let orgId = "org-" # Time.now().toText();

    let newOrg : Organization = {
      id = orgId;
      name;
      description;
      region;
      orgType;
      website;
      status = #active;
      foundedYear;
      createdAt = Time.now();
      createdBy = caller;
      members = [{
        userId = caller.toText();
        role = #admin;
        joinedAt = Time.now();
      }];
    };

    organizations.add(orgId, newOrg);
    orgId;
  };

  public query ({ caller }) func getOrg(orgId : Text) : async ?Organization {
    organizations.get(orgId);
  };

  public query ({ caller }) func listOrgs() : async [Organization] {
    organizations.values().toArray();
  };

  public query ({ caller }) func listActiveOrgs() : async [Organization] {
    let activeOrgs = organizations.values().filter(
      func(org) { org.status == #active }
    );
    activeOrgs.toArray();
  };

  public shared ({ caller }) func updateOrg(
    orgId : Text,
    name : Text,
    description : Text,
    region : Text,
    orgType : Text,
    website : Text,
    foundedYear : Int,
  ) : async Bool {
    if (not (AccessControl.hasPermission(accessControlState, caller, #user))) {
      Runtime.trap("Unauthorized: Only authenticated users can update organizations");
    };

    switch (organizations.get(orgId)) {
      case (null) { return false };
      case (?org) {
        let callerIsOrgAdmin = org.members.find(func(m) { m.userId == caller.toText() and m.role == #admin });
        if (callerIsOrgAdmin == null and not AccessControl.isAdmin(accessControlState, caller)) {
          Runtime.trap("Unauthorized: Only org admins or system admins can update");
        };

        let updatedOrg = {
          org with
          name;
          description;
          region;
          orgType;
          website;
          foundedYear;
        };
        organizations.add(orgId, updatedOrg);
        return true;
      };
    };
  };

  public shared ({ caller }) func archiveOrg(orgId : Text) : async Bool {
    if (not (AccessControl.hasPermission(accessControlState, caller, #user))) {
      Runtime.trap("Unauthorized: Only authenticated users can archive organizations");
    };

    switch (organizations.get(orgId)) {
      case (null) { return false };
      case (?org) {
        let callerIsOrgAdmin = org.members.find(func(m) { m.userId == caller.toText() and m.role == #admin });
        if (callerIsOrgAdmin == null and not AccessControl.isAdmin(accessControlState, caller)) {
          Runtime.trap("Unauthorized: Only org admins or system admins can archive");
        };

        let updatedOrg = { org with status = #archived };
        organizations.add(orgId, updatedOrg);
        return true;
      };
    };
  };

  public shared ({ caller }) func joinOrg(orgId : Text) : async Bool {
    if (not (AccessControl.hasPermission(accessControlState, caller, #user))) {
      Runtime.trap("Unauthorized: Only authenticated users can join organizations");
    };

    switch (organizations.get(orgId)) {
      case (null) { return false };
      case (?org) {
        let existingMember = org.members.find(func(m) { m.userId == caller.toText() });
        if (existingMember != null) { return false };

        let newMember : OrgMember = {
          userId = caller.toText();
          role = #member;
          joinedAt = Time.now();
        };

        let updatedMembers = org.members.concat([newMember]);
        let updatedOrg = { org with members = updatedMembers };
        organizations.add(orgId, updatedOrg);
        return true;
      };
    };
  };

  public shared ({ caller }) func leaveOrg(orgId : Text) : async Bool {
    if (not (AccessControl.hasPermission(accessControlState, caller, #user))) {
      Runtime.trap("Unauthorized: Only authenticated users can leave organizations");
    };

    switch (organizations.get(orgId)) {
      case (null) { return false };
      case (?org) {
        let updatedMembers = org.members.filter(func(m) { m.userId != caller.toText() });
        let updatedOrg = { org with members = updatedMembers };
        organizations.add(orgId, updatedOrg);
        return true;
      };
    };
  };

  public query ({ caller }) func getOrgMembers(orgId : Text) : async [OrgMember] {
    switch (organizations.get(orgId)) {
      case (null) { [] };
      case (?org) { org.members };
    };
  };

  public query ({ caller }) func getUserOrgs(userId : Text) : async [Organization] {
    let userOrgs = organizations.values().filter(
      func(org) {
        org.members.find(func(m) { m.userId == userId }) != null
      }
    );
    userOrgs.toArray();
  };

  // === User Profile Functions ===

  public query ({ caller }) func getCallerUserProfile() : async ?UserProfile {
    if (not (AccessControl.hasPermission(accessControlState, caller, #user))) {
      Runtime.trap("Unauthorized: Only authenticated users can access profiles");
    };

    let userId = caller.toText();
    switch (users.get(userId)) {
      case (null) { null };
      case (?user) {
        ?{
          displayName = user.displayName;
          email = user.email;
          bio = user.bio;
          avatarUrl = user.avatarUrl;
        };
      };
    };
  };

  public shared ({ caller }) func saveCallerUserProfile(profile : UserProfile) : async () {
    if (not (AccessControl.hasPermission(accessControlState, caller, #user))) {
      Runtime.trap("Unauthorized: Only authenticated users can save profiles");
    };

    let userId = caller.toText();
    switch (users.get(userId)) {
      case (null) {
        let newUser : User = {
          id = userId;
          displayName = profile.displayName;
          email = profile.email;
          role = #member;
          joinedAt = Time.now();
          bio = profile.bio;
          avatarUrl = profile.avatarUrl;
          isActive = true;
        };
        users.add(userId, newUser);
        principalToUserId.add(caller, userId);
      };
      case (?user) {
        let updatedUser = {
          user with
          displayName = profile.displayName;
          email = profile.email;
          bio = profile.bio;
          avatarUrl = profile.avatarUrl;
        };
        users.add(userId, updatedUser);
      };
    };
  };

  public query ({ caller }) func getUserProfile(user : Principal) : async ?UserProfile {
    let userId = user.toText();

    switch (users.get(userId)) {
      case (null) { null };
      case (?u) {
        ?{
          displayName = u.displayName;
          email = u.email;
          bio = u.bio;
          avatarUrl = u.avatarUrl;
        };
      };
    };
  };


  // List all registered users (public summaries)
  public query func listUsers() : async [UserSummary] {
    users.values().map(func(u : User) : UserSummary {
      {
        id = u.id;
        displayName = u.displayName;
        role = u.role;
        bio = u.bio;
        avatarUrl = u.avatarUrl;
        joinedAt = u.joinedAt;
        isActive = u.isActive;
      }
    }).toArray();
  };

  // === Language Preference Functions ===

  public shared ({ caller }) func setPreferredLanguage(lang : Text) : async () {
    userLanguages.add(caller, lang);
  };

  public query ({ caller }) func getPreferredLanguage() : async Text {
    switch (userLanguages.get(caller)) {
      case (null) { "en" };
      case (?lang) { lang };
    };
  };

  // === Campaign Functions ===

  public shared ({ caller }) func createCampaign(
    title : Text,
    description : Text,
    campaignType : CampaignType,
    orgId : Text,
    goal : Nat,
    startDate : Int,
    endDate : Int,
    tags : [Text],
  ) : async Text {
    if (not (AccessControl.hasPermission(accessControlState, caller, #user))) {
      Runtime.trap("Unauthorized: Only authenticated users can create campaigns");
    };

    switch (organizations.get(orgId)) {
      case (null) { Runtime.trap("Organization not found") };
      case (?org) {
        let isOrgMember = org.members.find(func(m) { m.userId == caller.toText() });
        if (isOrgMember == null and not AccessControl.isAdmin(accessControlState, caller)) {
          Runtime.trap("Unauthorized: Only org members or system admins can create campaigns");
        };
      };
    };

    let campaignId = "campaign-" # Time.now().toText();

    let newCampaign : Campaign = {
      id = campaignId;
      title;
      description;
      campaignType;
      status = #draft;
      orgId;
      createdBy = caller;
      createdAt = Time.now();
      goal;
      progress = 0;
      supporterCount = 0;
      startDate;
      endDate;
      tags;
    };

    campaigns.add(campaignId, newCampaign);
    campaignId;
  };

  public shared ({ caller }) func updateCampaign(
    id : Text,
    title : Text,
    description : Text,
    campaignType : CampaignType,
    goal : Nat,
    startDate : Int,
    endDate : Int,
    tags : [Text],
  ) : async Bool {
    if (not (AccessControl.hasPermission(accessControlState, caller, #user))) {
      Runtime.trap("Unauthorized: Only authenticated users can update campaigns");
    };

    switch (campaigns.get(id)) {
      case (null) { return false };
      case (?campaign) {
        switch (organizations.get(campaign.orgId)) {
          case (null) { Runtime.trap("Organization not found") };
          case (?org) {
            let isOrgAdmin = org.members.find(func(m) { m.userId == caller.toText() and m.role == #admin });
            if (
              isOrgAdmin == null and
              caller != campaign.createdBy and
              not AccessControl.isAdmin(accessControlState, caller)
            ) {
              Runtime.trap("Unauthorized: Only org admins, campaign creator, or system admins can update");
            };
          };
        };

        let updatedCampaign = {
          campaign with
          title;
          description;
          campaignType;
          goal;
          startDate;
          endDate;
          tags;
        };
        campaigns.add(id, updatedCampaign);
        return true;
      };
    };
  };

  public shared ({ caller }) func joinCampaign(campaignId : Text) : async Bool {
    if (not (AccessControl.hasPermission(accessControlState, caller, #user))) {
      Runtime.trap("Unauthorized: Only authenticated users can join campaigns");
    };

    switch (campaigns.get(campaignId)) {
      case (null) { return false };
      case (?campaign) {
        switch (campaignSupporters.get(campaignId)) {
          case (null) {
            let newSupporters = Set.singleton(caller);
            campaignSupporters.add(campaignId, newSupporters);
            campaigns.add(
              campaignId,
              { campaign with supporterCount = 1 }
            );
            return true;
          };
          case (?supporters) {
            if (supporters.contains(caller)) { return false };
            supporters.add(caller);
            campaigns.add(
              campaignId,
              { campaign with supporterCount = supporters.size() }
            );
            return true;
          };
        };
      };
    };
  };

  public shared ({ caller }) func leaveCampaign(campaignId : Text) : async Bool {
    if (not (AccessControl.hasPermission(accessControlState, caller, #user))) {
      Runtime.trap("Unauthorized: Only authenticated users can leave campaigns");
    };

    switch (campaigns.get(campaignId)) {
      case (null) { return false };
      case (?campaign) {
        switch (campaignSupporters.get(campaignId)) {
          case (null) { return false };
          case (?supporters) {
            if (not supporters.contains(caller)) { return false };
            supporters.remove(caller);
            campaigns.add(
              campaignId,
              { campaign with supporterCount = supporters.size() }
            );
            return true;
          };
        };
      };
    };
  };

  public shared ({ caller }) func archiveCampaign(id : Text) : async Bool {
    if (not (AccessControl.hasPermission(accessControlState, caller, #user))) {
      Runtime.trap("Unauthorized: Only authenticated users can archive campaigns");
    };

    switch (campaigns.get(id)) {
      case (null) { return false };
      case (?campaign) {
        switch (organizations.get(campaign.orgId)) {
          case (null) { Runtime.trap("Organization not found") };
          case (?org) {
            let isOrgAdmin = org.members.find(func(m) { m.userId == caller.toText() and m.role == #admin });
            if (
              isOrgAdmin == null and
              caller != campaign.createdBy and
              not AccessControl.isAdmin(accessControlState, caller)
            ) {
              Runtime.trap("Unauthorized: Only org admins, campaign creator, or system admins can archive");
            };
          };
        };

        let updatedCampaign = { campaign with status = #archived };
        campaigns.add(id, updatedCampaign);
        return true;
      };
    };
  };

  public query ({ caller }) func getCampaign(id : Text) : async ?Campaign {
    campaigns.get(id);
  };

  public query ({ caller }) func listCampaigns() : async [Campaign] {
    campaigns.values().toArray();
  };

  public query ({ caller }) func listCampaignsByOrg(orgId : Text) : async [Campaign] {
    let orgCampaigns = campaigns.values().filter(
      func(campaign) { campaign.orgId == orgId }
    );
    orgCampaigns.toArray();
  };

  public query ({ caller }) func listActiveCampaigns() : async [Campaign] {
    let activeCampaigns = campaigns.values().filter(
      func(campaign) { campaign.status == #active }
    );
    activeCampaigns.toArray();
  };

  public query ({ caller }) func getCampaignSupporterCount(campaignId : Text) : async ?Nat {
    switch (campaigns.get(campaignId)) {
      case (null) { null };
      case (?campaign) { ?campaign.supporterCount };
    };
  };

  public query ({ caller }) func getCampaignProgress(campaignId : Text) : async ?{ progress : Nat; goal : Nat } {
    switch (campaigns.get(campaignId)) {
      case (null) { null };
      case (?campaign) {
        ?{
          progress = campaign.progress;
          goal = campaign.goal;
        };
      };
    };
  };

  // === Forums Functions ===

  public shared ({ caller }) func createThread(
    title : Text,
    body : Text,
    category : ForumCategory,
    orgId : ?Text,
    tags : [Text],
  ) : async Nat {
    if (not (AccessControl.hasPermission(accessControlState, caller, #user))) {
      Runtime.trap("Unauthorized: Only authenticated users can create threads");
    };

    let threadId = nextThreadId;
    nextThreadId += 1;

    let newThread : ForumThread = {
      id = threadId;
      title;
      body;
      category;
      orgId;
      tags;
      createdBy = caller;
      createdAt = Time.now();
      status = #open;
      isPinned = false;
      replyCount = 0;
      viewCount = 0;
    };

    forumThreads.add(threadId, newThread);
    threadId;
  };

  public shared ({ caller }) func replyToThread(threadId : Nat, body : Text) : async Nat {
    if (not (AccessControl.hasPermission(accessControlState, caller, #user))) {
      Runtime.trap("Unauthorized: Only authenticated users can reply to threads");
    };

    switch (forumThreads.get(threadId)) {
      case (null) { Runtime.trap("Thread not found") };
      case (?thread) {
        if (thread.status == #locked) {
          Runtime.trap("Thread is locked");
        };

        let replyId = nextReplyId;
        nextReplyId += 1;

        let newReply : ForumReply = {
          id = replyId;
          threadId;
          body;
          createdBy = caller;
          createdAt = Time.now();
          isModeratorReply = AccessControl.isAdmin(accessControlState, caller);
        };

        forumReplies.add(replyId, newReply);

        let updatedReplies = switch (threadReplies.get(threadId)) {
          case (null) { Set.singleton<Nat>(replyId) };
          case (?existing) {
            existing.add(replyId);
            existing;
          };
        };
        threadReplies.add(threadId, updatedReplies);

        let updatedThread = {
          thread with
          replyCount = thread.replyCount + 1;
        };
        forumThreads.add(threadId, updatedThread);

        replyId;
      };
    };
  };

  public query ({ caller }) func getThread(threadId : Nat) : async ?ForumThread {
    forumThreads.get(threadId);
  };

  public query ({ caller }) func listThreads() : async [ForumThread] {
    forumThreads.values().toArray();
  };

  public query ({ caller }) func listThreadsByCategory(category : ForumCategory) : async [ForumThread] {
    let filteredThreads = forumThreads.values().filter(
      func(thread) { thread.category == category }
    );
    filteredThreads.toArray();
  };

  public query ({ caller }) func listThreadsByOrg(orgId : Text) : async [ForumThread] {
    let filteredThreads = forumThreads.values().filter(
      func(thread) {
        switch (thread.orgId) {
          case (null) { false };
          case (?id) { id == orgId };
        };
      }
    );
    filteredThreads.toArray();
  };

  public query ({ caller }) func getReplies(threadId : Nat) : async [ForumReply] {
    let replyIds = switch (threadReplies.get(threadId)) {
      case (null) { Set.empty<Nat>() };
      case (?ids) { ids };
    };
    replyIds.toArray().map(
      func(id) {
        switch (forumReplies.get(id)) {
          case (null) { null };
          case (?reply) { ?reply };
        };
      }
    ).filter(func(replyOpt) { replyOpt != null }).map(
      func(replyOpt) { switch (replyOpt) { case (null) { Runtime.trap("Internal error") }; case (?r) { r } } }
    );
  };

  public shared ({ caller }) func pinThread(threadId : Nat) : async Bool {
    if (not (AccessControl.isAdmin(accessControlState, caller))) {
      Runtime.trap("Unauthorized: Only admins can pin threads");
    };

    switch (forumThreads.get(threadId)) {
      case (null) { Runtime.trap("Thread not found") };
      case (?thread) {
        if (thread.status == #archived) {
          Runtime.trap("Cannot pin an archived thread");
        };

        let updatedThread = { thread with isPinned = true };
        forumThreads.add(threadId, updatedThread);
        true;
      };
    };
  };

  public shared ({ caller }) func lockThread(threadId : Nat) : async Bool {
    if (not (AccessControl.isAdmin(accessControlState, caller))) {
      Runtime.trap("Unauthorized: Only admins can lock threads");
    };

    switch (forumThreads.get(threadId)) {
      case (null) { Runtime.trap("Thread not found") };
      case (?thread) {
        if (thread.status == #archived) {
          Runtime.trap("Cannot lock an archived thread");
        };

        let updatedThread = { thread with status = #locked };
        forumThreads.add(threadId, updatedThread);
        true;
      };
    };
  };

  public shared ({ caller }) func archiveThread(threadId : Nat) : async Bool {
    if (not (AccessControl.isAdmin(accessControlState, caller))) {
      Runtime.trap("Unauthorized: Only admins can archive threads");
    };

    switch (forumThreads.get(threadId)) {
      case (null) { Runtime.trap("Thread not found") };
      case (?thread) {
        let updatedThread = { thread with status = #archived };
        forumThreads.add(threadId, updatedThread);
        true;
      };
    };
  };

  public shared ({ caller }) func incrementThreadView(threadId : Nat) : async Bool {
    if (not (AccessControl.hasPermission(accessControlState, caller, #user))) {
      Runtime.trap("Unauthorized: Only authenticated users can increment view count");
    };

    switch (forumThreads.get(threadId)) {
      case (null) { false };
      case (?thread) {
        let updatedThread = { thread with viewCount = thread.viewCount + 1 };
        forumThreads.add(threadId, updatedThread);
        true;
      };
    };
  };

  // === WALLET MODULE FUNCTIONS ===

  // Link a new wallet to the caller
  public shared ({ caller }) func linkWallet(walletType : WalletType, address : Text, walletLabel : Text) : async () {
    if (not (AccessControl.hasPermission(accessControlState, caller, #user))) {
      Runtime.trap("Unauthorized: Only authenticated users can link wallets");
    };

    // Check if caller already has this wallet linked
    let userWalletMap = switch (userWallets.get(caller)) {
      case (null) { Map.empty<Text, Wallet>() };
      case (?walletMap) { walletMap };
    };

    if (userWalletMap.containsKey(address)) {
      Runtime.trap("Wallet already linked");
    };

    let wallet : Wallet = {
      address;
      walletType;
      walletLabel;
      balanceICP = 0.0; // Start with zero balance
      linkedAt = Time.now();
    };

    userWalletMap.add(address, wallet);
    userWallets.add(caller, userWalletMap);
  };

  // Unlink a wallet from the caller
  public shared ({ caller }) func unlinkWallet(address : Text) : async () {
    if (not (AccessControl.hasPermission(accessControlState, caller, #user))) {
      Runtime.trap("Unauthorized: Only authenticated users can unlink wallets");
    };

    switch (userWallets.get(caller)) {
      case (null) { Runtime.trap("No wallets found for caller") };
      case (?walletMap) {
        if (not walletMap.containsKey(address)) {
          Runtime.trap("Wallet not linked");
        };
        walletMap.remove(address);
        userWallets.add(caller, walletMap);
      };
    };
  };

  // Get all wallets linked to the caller
  public query ({ caller }) func getLinkedWallets() : async [Wallet] {
    if (not (AccessControl.hasPermission(accessControlState, caller, #user))) {
      Runtime.trap("Unauthorized: Only authenticated users can view wallets");
    };

    switch (userWallets.get(caller)) {
      case (null) { [] };
      case (?walletMap) { walletMap.values().toArray() };
    };
  };

  // Get balance for a specific wallet
  public query ({ caller }) func getWalletBalance(address : Text) : async Float {
    if (not (AccessControl.hasPermission(accessControlState, caller, #user))) {
      Runtime.trap("Unauthorized: Only authenticated users can view balances");
    };

    switch (userWallets.get(caller)) {
      case (null) { Runtime.trap("No wallets found for caller") };
      case (?walletMap) {
        switch (walletMap.get(address)) {
          case (null) { Runtime.trap("Wallet not found") };
          case (?wallet) { wallet.balanceICP };
        };
      };
    };
  };

  // Add a transaction to the caller's transaction history
  public shared ({ caller }) func addTransaction(walletAddress : Text, amount : Float, description : Text, txType : TransactionType) : async () {
    if (not (AccessControl.hasPermission(accessControlState, caller, #user))) {
      Runtime.trap("Unauthorized: Only authenticated users can add transactions");
    };

    // Update wallet balance
    switch (userWallets.get(caller)) {
      case (null) { Runtime.trap("No wallets found for caller") };
      case (?walletMap) {
        switch (walletMap.get(walletAddress)) {
          case (null) { Runtime.trap("Wallet not found") };
          case (?wallet) {
            let updatedBalance = switch (txType) {
              case (#sent) { wallet.balanceICP - amount };
              case (#received) { wallet.balanceICP + amount };
            };

            if (txType == #sent and amount > wallet.balanceICP) {
              Runtime.trap("Insufficient balance");
            };

            let updatedWallet = { wallet with balanceICP = updatedBalance };
            walletMap.add(walletAddress, updatedWallet);
            userWallets.add(caller, walletMap);
          };
        };
      };
    };

    // Add transaction to user's transaction history
    let transactionId = nextTransactionId;
    nextTransactionId += 1;

    let transaction : Transaction = {
      id = transactionId;
      walletAddress;
      amountICP = amount;
      description;
      txType;
      timestamp = Time.now();
    };

    let userTransactionMap = switch (userTransactions.get(caller)) {
      case (null) { Map.empty<Nat, Transaction>() };
      case (?txMap) { txMap };
    };

    userTransactionMap.add(transactionId, transaction);
    userTransactions.add(caller, userTransactionMap);
  };

  // Get the transaction history for the caller, optionally filtered by wallet address
  public query ({ caller }) func getTransactionHistory(walletAddress : ?Text) : async [Transaction] {
    if (not (AccessControl.hasPermission(accessControlState, caller, #user))) {
      Runtime.trap("Unauthorized: Only authenticated users can view transactions");
    };

    switch (userTransactions.get(caller)) {
      case (null) { [] };
      case (?txMap) {
        let transactions = txMap.values().toArray();
        switch (walletAddress) {
          case (null) { transactions };
          case (?address) {
            transactions.filter(
              func(tx) { tx.walletAddress == address }
            );
          };
        };
      };
    };
  };
};
