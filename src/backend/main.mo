import Int "mo:core/Int";
import Set "mo:core/Set";
import Time "mo:core/Time";
import Map "mo:core/Map";
import Iter "mo:core/Iter";
import Array "mo:core/Array";
import Runtime "mo:core/Runtime";
import Nat "mo:core/Nat";
import Float "mo:core/Float";
import Principal "mo:core/Principal";
import MixinAuthorization "mo:caffeineai-authorization/MixinAuthorization";
import AccessControl "mo:caffeineai-authorization/access-control";
import Migration "migration";



(with migration = Migration.run)
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

  // =========================================================================
  // === MLM / REFERRAL / ROYALTY / FINFRACFRAN™ MODULE =====================
  // =========================================================================

  // --- MLM Types ---

  public type MembershipTierLevel = {
    #free;       // 0
    #associate;  // 1
    #affiliate;  // 2
    #partner;    // 3
    #executive;  // 4
    #ambassador; // 5
    #founder;    // 6
  };

  public type EarningType = {
    #directReferral;
    #levelOverride;
    #royaltyPool;
    #eventCommission;
    #finFracFran;
    #activityBonus;
  };

  public type EarningStatus = {
    #pending;
    #processing;
    #paid;
  };

  public type MemberTierRecord = {
    principal : Principal;
    tier : MembershipTierLevel;
    referralCode : Text;
    sponsorCode : ?Text;
    sponsorPrincipal : ?Principal;
    joinedAt : Int;
    upgradedAt : Int;
  };

  public type EarningRecord = {
    id : Text;
    member : Principal;
    amountUnits : Nat;
    earningType : EarningType;
    description : Text;
    sourceId : Text;
    depthLevel : Nat;
    status : EarningStatus;
    createdAt : Int;
  };

  public type CommissionRate = {
    tier : MembershipTierLevel;
    depthLevel : Nat;
    earningType : EarningType;
    basisPoints : Nat;
    flatAmountUnits : Nat;
    isActive : Bool;
  };

  public type EarningsSummary = {
    totalLifetime : Nat;
    totalPending : Nat;
    totalPaid : Nat;
    directReferral : Nat;
    levelOverride : Nat;
    royaltyPool : Nat;
    eventCommission : Nat;
    finFracFran : Nat;
    activityBonus : Nat;
  };

  public type DownlineMember = {
    principal : Principal;
    tier : MembershipTierLevel;
    referralCode : Text;
    joinedAt : Int;
    directReferralCount : Nat;
  };

  public type RoyaltyPoolType = {
    #global;
    #leadership;
    #event;
    #finFracFran;
  };

  public type RoyaltyPool = {
    id : Text;
    poolType : RoyaltyPoolType;
    totalUnits : Nat;
    period : Text;
    isDistributed : Bool;
    createdAt : Int;
  };

  public type FSUTxType = {
    #earned;
    #redeemed;
    #transferred;
  };

  public type FSURecord = {
    member : Principal;
    balance : Nat;
    lifetimeEarned : Nat;
  };

  public type FSUTransaction = {
    id : Text;
    member : Principal;
    txType : FSUTxType;
    amount : Nat;
    valuePerUnitCents : Nat;
    description : Text;
    createdAt : Int;
  };

  public type FSUPoolStatus = {
    poolSizeUnits : Nat;
    valuePerUnitCents : Nat;
    totalOutstandingFSU : Nat;
    nextDistributionLabel : Text;
  };

  // --- MLM Storage ---

  let memberTiers = Map.empty<Principal, MemberTierRecord>();
  let referralCodeIndex = Map.empty<Text, Principal>();
  let earningRecords = Map.empty<Text, EarningRecord>();
  let memberEarningsIndex = Map.empty<Principal, [Text]>();
  let commissionRates = Map.empty<Text, CommissionRate>();
  let royaltyPools = Map.empty<Text, RoyaltyPool>();
  let fsuRecords = Map.empty<Principal, FSURecord>();
  let fsuTransactions = Map.empty<Text, FSUTransaction>();
  let memberFSUTxIndex = Map.empty<Principal, [Text]>();
  var fsuPool : Nat = 0;
  var nextEarningId : Nat = 1;
  var nextFSUTxId : Nat = 1;
  var nextRoyaltyPoolId : Nat = 1;

  // --- MLM Private Helpers ---

  private func _tierWeight(tier : MembershipTierLevel) : Nat {
    switch tier {
      case (#free)       { 0 };
      case (#associate)  { 1 };
      case (#affiliate)  { 2 };
      case (#partner)    { 3 };
      case (#executive)  { 4 };
      case (#ambassador) { 5 };
      case (#founder)    { 6 };
    };
  };

  private func _tierFromWeight(w : Nat) : MembershipTierLevel {
    if      (w == 1) #associate
    else if (w == 2) #affiliate
    else if (w == 3) #partner
    else if (w == 4) #executive
    else if (w == 5) #ambassador
    else if (w == 6) #founder
    else             #free;
  };

  private func _recordEarning(member : Principal, amountUnits : Nat, earningType : EarningType, description : Text, sourceId : Text) : Text {
    let earningId = "earn-" # nextEarningId.toText();
    nextEarningId += 1;
    let record : EarningRecord = {
      id = earningId;
      member;
      amountUnits;
      earningType;
      description;
      sourceId;
      depthLevel = 0;
      status = #pending;
      createdAt = Time.now();
    };
    earningRecords.add(earningId, record);
    let existingIds = switch (memberEarningsIndex.get(member)) {
      case (null)    { [] };
      case (?ids)    { ids };
    };
    memberEarningsIndex.add(member, existingIds.concat([earningId]));
    // Update FSU balance if finFracFran earning
    switch (earningType) {
      case (#finFracFran) {
        let existing = switch (fsuRecords.get(member)) {
          case (null) { { member; balance = 0; lifetimeEarned = 0 } };
          case (?r)   { r };
        };
        fsuRecords.add(member, { existing with balance = existing.balance + amountUnits; lifetimeEarned = existing.lifetimeEarned + amountUnits });
      };
      case (_) {};
    };
    earningId;
  };

  private func _addToFSUPool(amount : Nat, _description : Text) {
    fsuPool += amount;
  };

  private func _processReferralChainBonus(referredMember : Principal, baseAmount : Nat, earningType : EarningType, description : Text) {
    var current = referredMember;
    var depth = 1;
    while (depth <= 6) {
      switch (memberTiers.get(current)) {
        case (null) { depth := 7 };
        case (?rec) {
          switch (rec.sponsorPrincipal) {
            case (null) { depth := 7 };
            case (?sponsor) {
              let tierW = _tierWeight(rec.tier);
              if (tierW >= depth) {
                let commissionAmt = baseAmount * (if (depth < 7) { Nat.sub(7, depth) } else { 0 }) / 100;
                if (commissionAmt > 0) {
                  ignore _recordEarning(sponsor, commissionAmt, earningType, description # " (L" # depth.toText() # ")", "chain");
                };
              };
              current := sponsor;
              depth += 1;
            };
          };
        };
      };
    };
  };

  private func _distributeFSU(totalFSU : Nat, description : Text) {
    let members = memberTiers.values().toArray();
    let totalWeight = members.foldLeft(0, func(acc, m) { acc + _tierWeight(m.tier) });
    if (totalWeight == 0) { return };
    members.forEach(func(m) {
      let w = _tierWeight(m.tier);
      if (w > 0) {
        let share = totalFSU * w / totalWeight;
        if (share > 0) {
          ignore _recordEarning(m.principal, share, #finFracFran, description, "fsu-dist");
        };
      };
    });
  };

  // --- MLM Public Functions ---

  public shared ({ caller }) func initMemberMLM(sponsorCode : ?Text) : async Text {
    if (not (AccessControl.hasPermission(accessControlState, caller, #user))) {
      Runtime.trap("Unauthorized");
    };
    switch (memberTiers.get(caller)) {
      case (?_) { Runtime.trap("MLM already initialized") };
      case (null) {};
    };
    let code = "REF-" # caller.toText().size().toText() # "-" # Time.now().toText();
    var sponsorPrincipal : ?Principal = null;
    switch (sponsorCode) {
      case (null) {};
      case (?sc) {
        sponsorPrincipal := referralCodeIndex.get(sc);
      };
    };
    let rec : MemberTierRecord = {
      principal = caller;
      tier = #free;
      referralCode = code;
      sponsorCode;
      sponsorPrincipal;
      joinedAt = Time.now();
      upgradedAt = Time.now();
    };
    memberTiers.add(caller, rec);
    referralCodeIndex.add(code, caller);
    code;
  };

  public query ({ caller }) func getMyTierRecord() : async ?MemberTierRecord {
    memberTiers.get(caller);
  };

  public query func getMemberTierRecord(p : Principal) : async ?MemberTierRecord {
    memberTiers.get(p);
  };

  public shared ({ caller }) func setMemberTier(target : Principal, tier : MembershipTierLevel) : async Bool {
    if (not AccessControl.isAdmin(accessControlState, caller)) {
      Runtime.trap("Unauthorized: Admins only");
    };
    switch (memberTiers.get(target)) {
      case (null) { false };
      case (?rec) {
        memberTiers.add(target, { rec with tier; upgradedAt = Time.now() });
        true;
      };
    };
  };

  public shared ({ caller }) func upgradeMemberTier(tier : MembershipTierLevel) : async Bool {
    if (not (AccessControl.hasPermission(accessControlState, caller, #user))) {
      Runtime.trap("Unauthorized");
    };
    switch (memberTiers.get(caller)) {
      case (null) { false };
      case (?rec) {
        if (_tierWeight(tier) <= _tierWeight(rec.tier)) {
          Runtime.trap("Cannot downgrade tier");
        };
        memberTiers.add(caller, { rec with tier; upgradedAt = Time.now() });
        true;
      };
    };
  };

  public query ({ caller }) func getMyReferralCode() : async ?Text {
    switch (memberTiers.get(caller)) {
      case (null)  { null };
      case (?rec)  { ?rec.referralCode };
    };
  };

  public query func resolveReferralCode(code : Text) : async ?Principal {
    referralCodeIndex.get(code);
  };

  public shared ({ caller }) func setCommissionRate(
    tier : MembershipTierLevel,
    depthLevel : Nat,
    earningType : EarningType,
    basisPoints : Nat,
    flatAmountUnits : Nat,
  ) : async Bool {
    if (not AccessControl.isAdmin(accessControlState, caller)) {
      Runtime.trap("Unauthorized: Admins only");
    };
    let key = _tierWeight(tier).toText() # "-" # depthLevel.toText() # "-" # debug_show(earningType);
    commissionRates.add(key, { tier; depthLevel; earningType; basisPoints; flatAmountUnits; isActive = true });
    true;
  };

  public shared ({ caller }) func deactivateCommissionRate(
    tier : MembershipTierLevel,
    depthLevel : Nat,
    earningType : EarningType,
  ) : async Bool {
    if (not AccessControl.isAdmin(accessControlState, caller)) {
      Runtime.trap("Unauthorized: Admins only");
    };
    let key = _tierWeight(tier).toText() # "-" # depthLevel.toText() # "-" # debug_show(earningType);
    switch (commissionRates.get(key)) {
      case (null) { false };
      case (?rate) {
        commissionRates.add(key, { rate with isActive = false });
        true;
      };
    };
  };

  public query func getCommissionRate(tier : MembershipTierLevel, depthLevel : Nat, earningType : EarningType) : async ?CommissionRate {
    let key = _tierWeight(tier).toText() # "-" # depthLevel.toText() # "-" # debug_show(earningType);
    commissionRates.get(key);
  };

  public query func getCommissionRates() : async [CommissionRate] {
    commissionRates.values().toArray();
  };

  public shared ({ caller }) func recordEarning(
    member : Principal,
    amountUnits : Nat,
    earningType : EarningType,
    description : Text,
    sourceId : Text,
  ) : async Text {
    if (not AccessControl.isAdmin(accessControlState, caller)) {
      Runtime.trap("Unauthorized: Admins only");
    };
    _recordEarning(member, amountUnits, earningType, description, sourceId);
  };

  public query ({ caller }) func getMyEarnings() : async [EarningRecord] {
    let ids = switch (memberEarningsIndex.get(caller)) {
      case (null) { return [] };
      case (?ids) { ids };
    };
    ids.filterMap(func(id) { earningRecords.get(id) });
  };

  public query ({ caller }) func getMyEarningsSummary() : async EarningsSummary {
    let ids = switch (memberEarningsIndex.get(caller)) {
      case (null) { return { totalLifetime = 0; totalPending = 0; totalPaid = 0; directReferral = 0; levelOverride = 0; royaltyPool = 0; eventCommission = 0; finFracFran = 0; activityBonus = 0 } };
      case (?ids) { ids };
    };
    let earnings = ids.filterMap(func(id) { earningRecords.get(id) });
    var totalLifetime = 0;
    var totalPending = 0;
    var totalPaid = 0;
    var directReferral = 0;
    var levelOverride = 0;
    var royaltyPool = 0;
    var eventCommission = 0;
    var finFracFran = 0;
    var activityBonus = 0;
    earnings.forEach(func(e) {
      totalLifetime += e.amountUnits;
      switch (e.status) {
        case (#pending)    { totalPending    += e.amountUnits };
        case (#processing) { totalPending    += e.amountUnits };
        case (#paid)       { totalPaid       += e.amountUnits };
      };
      switch (e.earningType) {
        case (#directReferral)  { directReferral  += e.amountUnits };
        case (#levelOverride)   { levelOverride   += e.amountUnits };
        case (#royaltyPool)     { royaltyPool     += e.amountUnits };
        case (#eventCommission) { eventCommission += e.amountUnits };
        case (#finFracFran)     { finFracFran     += e.amountUnits };
        case (#activityBonus)   { activityBonus   += e.amountUnits };
      };
    });
    { totalLifetime; totalPending; totalPaid; directReferral; levelOverride; royaltyPool; eventCommission; finFracFran; activityBonus };
  };

  public shared ({ caller }) func markEarningPaid(earnId : Text) : async Bool {
    if (not AccessControl.isAdmin(accessControlState, caller)) {
      Runtime.trap("Unauthorized: Admins only");
    };
    switch (earningRecords.get(earnId)) {
      case (null) { false };
      case (?e) {
        earningRecords.add(earnId, { e with status = #paid });
        true;
      };
    };
  };

  public query ({ caller }) func getMyDownline() : async [DownlineMember] {
    let myTierOpt = memberTiers.get(caller);
    let myCode = switch (myTierOpt) {
      case (null)  { return [] };
      case (?rec)  { rec.referralCode };
    };
    memberTiers.values().filter(
      func(rec) {
        switch (rec.sponsorCode) {
          case (null) { false };
          case (?sc)  { sc == myCode };
        };
      }
    ).map(func(rec) : DownlineMember {
      let directCount = memberTiers.values().filter(
        func(r) {
          switch (r.sponsorCode) {
            case (null) { false };
            case (?sc)  { sc == rec.referralCode };
          };
        }
      ).size();
      { principal = rec.principal; tier = rec.tier; referralCode = rec.referralCode; joinedAt = rec.joinedAt; directReferralCount = directCount };
    }).toArray();
  };

  public query ({ caller }) func getMyUplineChain() : async [MemberTierRecord] {
    var result : [MemberTierRecord] = [];
    var current = caller;
    var depth = 0;
    while (depth < 6) {
      switch (memberTiers.get(current)) {
        case (null) { depth := 7 };
        case (?rec) {
          switch (rec.sponsorPrincipal) {
            case (null) { depth := 7 };
            case (?sponsor) {
              switch (memberTiers.get(sponsor)) {
                case (null) { depth := 7 };
                case (?sr) {
                  result := result.concat([sr]);
                  current := sponsor;
                  depth += 1;
                };
              };
            };
          };
        };
      };
    };
    result;
  };

  public shared ({ caller }) func processReferralChainBonus(
    referredMember : Principal,
    baseAmount : Nat,
    earningType : EarningType,
    description : Text,
  ) : async () {
    if (not AccessControl.isAdmin(accessControlState, caller)) {
      Runtime.trap("Unauthorized: Admins only");
    };
    _processReferralChainBonus(referredMember, baseAmount, earningType, description);
  };

  public shared ({ caller }) func addToFSUPool(amount : Nat, description : Text) : async () {
    if (not AccessControl.isAdmin(accessControlState, caller)) {
      Runtime.trap("Unauthorized: Admins only");
    };
    _addToFSUPool(amount, description);
  };

  public query func getFSUPoolStatus() : async FSUPoolStatus {
    let outstanding = fsuRecords.values().foldLeft(0, func(acc, r) { acc + r.balance });
    {
      poolSizeUnits = fsuPool;
      valuePerUnitCents = if (outstanding > 0) { fsuPool / outstanding } else { 1 };
      totalOutstandingFSU = outstanding;
      nextDistributionLabel = "End of current period";
    };
  };

  public query ({ caller }) func getMyFSURecord() : async ?FSURecord {
    fsuRecords.get(caller);
  };

  public query ({ caller }) func getMyFSUTransactions() : async [FSUTransaction] {
    let ids = switch (memberFSUTxIndex.get(caller)) {
      case (null) { return [] };
      case (?ids) { ids };
    };
    ids.filterMap(func(id) { fsuTransactions.get(id) });
  };

  public shared ({ caller }) func distributeFSU(totalFSU : Nat, description : Text) : async () {
    if (not AccessControl.isAdmin(accessControlState, caller)) {
      Runtime.trap("Unauthorized: Admins only");
    };
    _distributeFSU(totalFSU, description);
  };

  public shared ({ caller }) func redeemFSU(amount : Nat, description : Text) : async Bool {
    if (not (AccessControl.hasPermission(accessControlState, caller, #user))) {
      Runtime.trap("Unauthorized");
    };
    switch (fsuRecords.get(caller)) {
      case (null) { false };
      case (?rec) {
        if (rec.balance < amount) { Runtime.trap("Insufficient FSU balance") };
        fsuRecords.add(caller, { rec with balance = Nat.sub(rec.balance, amount) });
        let txId = "fsu-" # nextFSUTxId.toText();
        nextFSUTxId += 1;
        let valuePerUnit : Nat = 1;
        let tx : FSUTransaction = {
          id = txId;
          member = caller;
          txType = #redeemed;
          amount;
          valuePerUnitCents = valuePerUnit;
          description;
          createdAt = Time.now();
        };
        fsuTransactions.add(txId, tx);
        let existing = switch (memberFSUTxIndex.get(caller)) {
          case (null) { [] };
          case (?ids) { ids };
        };
        memberFSUTxIndex.add(caller, existing.concat([txId]));
        true;
      };
    };
  };

  public shared ({ caller }) func createRoyaltyPool(poolType : RoyaltyPoolType, period : Text) : async Text {
    if (not AccessControl.isAdmin(accessControlState, caller)) {
      Runtime.trap("Unauthorized: Admins only");
    };
    let poolId = "pool-" # nextRoyaltyPoolId.toText();
    nextRoyaltyPoolId += 1;
    let pool : RoyaltyPool = {
      id = poolId;
      poolType;
      totalUnits = 0;
      period;
      isDistributed = false;
      createdAt = Time.now();
    };
    royaltyPools.add(poolId, pool);
    poolId;
  };

  public shared ({ caller }) func addToRoyaltyPool(poolId : Text, amount : Nat) : async Bool {
    if (not AccessControl.isAdmin(accessControlState, caller)) {
      Runtime.trap("Unauthorized: Admins only");
    };
    switch (royaltyPools.get(poolId)) {
      case (null) { false };
      case (?pool) {
        royaltyPools.add(poolId, { pool with totalUnits = pool.totalUnits + amount });
        true;
      };
    };
  };

  public shared ({ caller }) func distributeRoyaltyPool(poolId : Text, minTierLevel : Nat) : async Bool {
    if (not AccessControl.isAdmin(accessControlState, caller)) {
      Runtime.trap("Unauthorized: Admins only");
    };
    switch (royaltyPools.get(poolId)) {
      case (null) { false };
      case (?pool) {
        if (pool.isDistributed) { Runtime.trap("Pool already distributed") };
        let eligible = memberTiers.values().filter(func(rec) { _tierWeight(rec.tier) >= minTierLevel }).toArray();
        if (eligible.size() > 0) {
          let share = pool.totalUnits / eligible.size();
          eligible.forEach(func(rec) {
            ignore _recordEarning(rec.principal, share, #royaltyPool, "Royalty pool distribution: " # poolId, poolId);
          });
        };
        royaltyPools.add(poolId, { pool with isDistributed = true });
        true;
      };
    };
  };

  public query func getRoyaltyPool(poolId : Text) : async ?RoyaltyPool {
    royaltyPools.get(poolId);
  };

  public query func listRoyaltyPools() : async [RoyaltyPool] {
    royaltyPools.values().toArray();
  };

  public query ({ caller }) func getMyRoyaltyDistributions() : async [EarningRecord] {
    let ids = switch (memberEarningsIndex.get(caller)) {
      case (null) { return [] };
      case (?ids) { ids };
    };
    ids.filterMap(func(id) {
      switch (earningRecords.get(id)) {
        case (null) { null };
        case (?e) {
          switch (e.earningType) {
            case (#royaltyPool) { ?e };
            case (_) { null };
          };
        };
      };
    });
  };

  public query func listAllMemberTiers() : async [MemberTierRecord] {
    memberTiers.values().toArray();
  };

  public query ({ caller }) func getMemberEarnings(member : Principal) : async [EarningRecord] {
    if (not AccessControl.isAdmin(accessControlState, caller)) {
      Runtime.trap("Unauthorized: Admins only");
    };
    let ids = switch (memberEarningsIndex.get(member)) {
      case (null) { return [] };
      case (?ids) { ids };
    };
    ids.filterMap(func(id) { earningRecords.get(id) });
  };

  public shared ({ caller }) func runPayCycle(member : Principal) : async Nat {
    if (not AccessControl.isAdmin(accessControlState, caller)) {
      Runtime.trap("Unauthorized: Admins only");
    };
    let ids = switch (memberEarningsIndex.get(member)) {
      case (null) { return 0 };
      case (?ids) { ids };
    };
    var count = 0;
    ids.forEach(func(id) {
      switch (earningRecords.get(id)) {
        case (null) {};
        case (?e) {
          switch (e.status) {
            case (#pending) {
              earningRecords.add(id, { e with status = #paid });
              count += 1;
            };
            case (_) {};
          };
        };
      };
    });
    count;
  };

  // =========================================================================
  // === CROWDFUNDING MODULE (FinFracFran™ at Core) ==========================
  // =========================================================================

  // --- Crowdfunding Types ---

  public type CrowdfundingCategory = {
    #civic;
    #humanitarian;
    #education;
    #research;
    #community;
    #youth;
    #crisisResponse;
  };

  public type CrowdfundingFundingModel = {
    #allOrNothing;
    #keepWhatYouRaise;
  };

  public type CrowdfundingStatus = {
    #pending;
    #active;
    #funded;
    #failed;
    #cancelled;
  };

  public type CrowdfundingRewardTier = {
    id : Text;
    title : Text;
    description : Text;
    minPledgeCents : Nat;
    maxBackers : ?Nat;
    backerCount : Nat;
  };

  public type CrowdfundingMilestone = {
    id : Text;
    title : Text;
    description : Text;
    targetCents : Nat;
    bonusFSUAmount : Nat;
    achievedAt : ?Int;
  };

  public type CrowdfundingCampaign = {
    id : Text;
    creator : Principal;
    tenantId : Text;
    title : Text;
    description : Text;
    category : CrowdfundingCategory;
    fundingModel : CrowdfundingFundingModel;
    status : CrowdfundingStatus;
    goalCents : Nat;
    currency : Text;
    raisedCents : Nat;
    backerCount : Nat;
    deadline : Int;
    coverImageUrl : Text;
    rewardTiers : [CrowdfundingRewardTier];
    milestones : [CrowdfundingMilestone];
    fsuContributionBps : Nat;
    totalFSUDistributed : Nat;
    approvedByAdmin : Bool;
    createdAt : Int;
    updatedAt : Int;
  };

  public type CrowdfundingPledge = {
    id : Text;
    campaignId : Text;
    backer : Principal;
    amountCents : Nat;
    rewardTierId : ?Text;
    fsuEarned : Nat;
    referrerCode : ?Text;
    status : Text;
    receiptCode : Text;
    createdAt : Int;
  };

  public type CrowdfundingConfig = {
    defaultFSUContributionBps : Nat;
    creatorFSUBonus : Nat;
    milestoneAchievementBonusBps : Nat;
  };

  // --- Crowdfunding Storage ---

  let crowdfundingCampaigns = Map.empty<Text, CrowdfundingCampaign>();
  let crowdfundingPledges = Map.empty<Text, CrowdfundingPledge>();
  let campaignPledgeIndex = Map.empty<Text, [Text]>();
  let backerPledgeIndex = Map.empty<Principal, [Text]>();
  var nextCrowdfundingCampaignId : Nat = 1;
  var nextCrowdfundingPledgeId : Nat = 1;
  var crowdfundingConfig : CrowdfundingConfig = {
    defaultFSUContributionBps = 500;
    creatorFSUBonus = 100;
    milestoneAchievementBonusBps = 200;
  };

  // --- Crowdfunding Public Functions ---

  public shared ({ caller }) func setCrowdfundingConfig(
    defaultFSUContributionBps : Nat,
    creatorFSUBonus : Nat,
    milestoneAchievementBonusBps : Nat,
  ) : async () {
    if (not AccessControl.isAdmin(accessControlState, caller)) {
      Runtime.trap("Unauthorized: Admins only");
    };
    crowdfundingConfig := {
      defaultFSUContributionBps;
      creatorFSUBonus;
      milestoneAchievementBonusBps;
    };
  };

  public query func getCrowdfundingConfig() : async CrowdfundingConfig {
    crowdfundingConfig;
  };

  public shared ({ caller }) func approveCrowdfundingCampaign(campaignId : Text) : async Bool {
    if (not AccessControl.isAdmin(accessControlState, caller)) {
      Runtime.trap("Unauthorized: Admins only");
    };
    switch (crowdfundingCampaigns.get(campaignId)) {
      case (null) { false };
      case (?c) {
        crowdfundingCampaigns.add(campaignId, { c with approvedByAdmin = true; status = #active; updatedAt = Time.now() });
        true;
      };
    };
  };

  public shared ({ caller }) func rejectCrowdfundingCampaign(campaignId : Text) : async Bool {
    if (not AccessControl.isAdmin(accessControlState, caller)) {
      Runtime.trap("Unauthorized: Admins only");
    };
    switch (crowdfundingCampaigns.get(campaignId)) {
      case (null) { false };
      case (?c) {
        crowdfundingCampaigns.add(campaignId, { c with status = #cancelled; updatedAt = Time.now() });
        true;
      };
    };
  };

  public query ({ caller }) func adminListAllCrowdfundingCampaigns() : async [CrowdfundingCampaign] {
    if (not AccessControl.isAdmin(accessControlState, caller)) {
      Runtime.trap("Unauthorized: Admins only");
    };
    crowdfundingCampaigns.values().toArray();
  };

  public query ({ caller }) func adminListCrowdfundingPledges(campaignId : Text) : async [CrowdfundingPledge] {
    if (not AccessControl.isAdmin(accessControlState, caller)) {
      Runtime.trap("Unauthorized: Admins only");
    };
    let ids = switch (campaignPledgeIndex.get(campaignId)) {
      case (null) { return [] };
      case (?ids) { ids };
    };
    ids.filterMap(func(id) { crowdfundingPledges.get(id) });
  };

  public shared ({ caller }) func createCrowdfundingCampaign(
    title : Text,
    description : Text,
    category : CrowdfundingCategory,
    fundingModel : CrowdfundingFundingModel,
    goalCents : Nat,
    currency : Text,
    deadline : Int,
    coverImageUrl : Text,
    rewardTiers : [CrowdfundingRewardTier],
    milestones : [CrowdfundingMilestone],
    fsuContributionBps : ?Nat,
  ) : async Text {
    if (not (AccessControl.hasPermission(accessControlState, caller, #user))) {
      Runtime.trap("Unauthorized");
    };
    let campaignId = "cf-" # nextCrowdfundingCampaignId.toText();
    nextCrowdfundingCampaignId += 1;
    let bps = switch (fsuContributionBps) {
      case (null) { crowdfundingConfig.defaultFSUContributionBps };
      case (?v)   { v };
    };
    let campaign : CrowdfundingCampaign = {
      id = campaignId;
      creator = caller;
      tenantId = "platform";
      title;
      description;
      category;
      fundingModel;
      status = #pending;
      goalCents;
      currency;
      raisedCents = 0;
      backerCount = 0;
      deadline;
      coverImageUrl;
      rewardTiers;
      milestones;
      fsuContributionBps = bps;
      totalFSUDistributed = 0;
      approvedByAdmin = false;
      createdAt = Time.now();
      updatedAt = Time.now();
    };
    crowdfundingCampaigns.add(campaignId, campaign);
    campaignId;
  };

  public shared ({ caller }) func updateCrowdfundingCampaign(
    campaignId : Text,
    title : Text,
    description : Text,
    coverImageUrl : Text,
  ) : async Bool {
    if (not (AccessControl.hasPermission(accessControlState, caller, #user))) {
      Runtime.trap("Unauthorized");
    };
    switch (crowdfundingCampaigns.get(campaignId)) {
      case (null) { false };
      case (?c) {
        if (c.creator != caller and not AccessControl.isAdmin(accessControlState, caller)) {
          Runtime.trap("Unauthorized: Only creator or admin");
        };
        crowdfundingCampaigns.add(campaignId, { c with title; description; coverImageUrl; updatedAt = Time.now() });
        true;
      };
    };
  };

  public query func getCrowdfundingCampaign(campaignId : Text) : async ?CrowdfundingCampaign {
    crowdfundingCampaigns.get(campaignId);
  };

  public query func listCrowdfundingCampaigns() : async [CrowdfundingCampaign] {
    crowdfundingCampaigns.values().filter(func(c) { c.approvedByAdmin and c.status == #active }).toArray();
  };

  public query func listCrowdfundingCampaignsByCategory(category : CrowdfundingCategory) : async [CrowdfundingCampaign] {
    crowdfundingCampaigns.values().filter(func(c) { c.approvedByAdmin and c.status == #active and c.category == category }).toArray();
  };

  public query ({ caller }) func listMyCrowdfundingCampaigns() : async [CrowdfundingCampaign] {
    crowdfundingCampaigns.values().filter(func(c) { c.creator == caller }).toArray();
  };

  public shared ({ caller }) func finalizeCrowdfundingCampaign(campaignId : Text) : async Bool {
    if (not AccessControl.isAdmin(accessControlState, caller)) {
      Runtime.trap("Unauthorized: Admins only");
    };
    switch (crowdfundingCampaigns.get(campaignId)) {
      case (null) { false };
      case (?c) {
        let newStatus : CrowdfundingStatus = if (c.raisedCents >= c.goalCents) { #funded } else {
          switch (c.fundingModel) {
            case (#allOrNothing)    { #failed };
            case (#keepWhatYouRaise){ #funded };
          };
        };
        crowdfundingCampaigns.add(campaignId, { c with status = newStatus; updatedAt = Time.now() });
        true;
      };
    };
  };

  public shared ({ caller }) func pledgeToCrowdfundingCampaign(
    campaignId : Text,
    amountCents : Nat,
    rewardTierId : ?Text,
    referrerCode : ?Text,
  ) : async Text {
    if (not (AccessControl.hasPermission(accessControlState, caller, #user))) {
      Runtime.trap("Unauthorized");
    };
    let campaign = switch (crowdfundingCampaigns.get(campaignId)) {
      case (null) { Runtime.trap("Campaign not found") };
      case (?c)   { c };
    };
    if (campaign.status != #active) {
      Runtime.trap("Campaign is not active");
    };

    // Compute FSU contribution
    let fsuContribution = amountCents * campaign.fsuContributionBps / 10000;
    _addToFSUPool(fsuContribution, "Pledge to crowdfunding campaign: " # campaignId);

    // Backer earns FSU
    let backerFSU = fsuContribution;
    if (backerFSU > 0) {
      ignore _recordEarning(caller, backerFSU, #finFracFran, "FSU from crowdfunding pledge: " # campaignId, campaignId);
    };

    // Referral chain bonus
    switch (referrerCode) {
      case (null) {};
      case (?code) {
        switch (referralCodeIndex.get(code)) {
          case (null) {};
          case (?referrer) {
            let referralBonus = amountCents * 3 / 100;
            if (referralBonus > 0) {
              ignore _recordEarning(referrer, referralBonus, #directReferral, "Crowdfunding referral bonus: " # campaignId, campaignId);
              _processReferralChainBonus(referrer, referralBonus, #levelOverride, "Crowdfunding referral chain: " # campaignId);
            };
          };
        };
      };
    };

    // Create pledge record
    let pledgeId = "pledge-" # nextCrowdfundingPledgeId.toText();
    nextCrowdfundingPledgeId += 1;
    let receiptCode = "RCPT-" # caller.toText().size().toText() # "-" # Time.now().toText();
    let pledge : CrowdfundingPledge = {
      id = pledgeId;
      campaignId;
      backer = caller;
      amountCents;
      rewardTierId;
      fsuEarned = backerFSU;
      referrerCode;
      status = "confirmed";
      receiptCode;
      createdAt = Time.now();
    };
    crowdfundingPledges.add(pledgeId, pledge);

    // Update campaign indexes
    let existingCampaignPledges = switch (campaignPledgeIndex.get(campaignId)) {
      case (null) { [] };
      case (?ids) { ids };
    };
    campaignPledgeIndex.add(campaignId, existingCampaignPledges.concat([pledgeId]));
    let existingBackerPledges = switch (backerPledgeIndex.get(caller)) {
      case (null) { [] };
      case (?ids) { ids };
    };
    backerPledgeIndex.add(caller, existingBackerPledges.concat([pledgeId]));

    // Update campaign raised amount and backer count
    let updatedCampaign = {
      campaign with
      raisedCents = campaign.raisedCents + amountCents;
      backerCount = campaign.backerCount + 1;
      updatedAt = Time.now();
    };

    // Check milestones and distribute bonus FSU
    var newTotalFSU = campaign.totalFSUDistributed;
    let updatedMilestones = updatedCampaign.milestones.map(func(m : CrowdfundingMilestone) : CrowdfundingMilestone {
      switch (m.achievedAt) {
        case (?_) { m };
        case (null) {
          if (updatedCampaign.raisedCents >= m.targetCents) {
            let bonusFSU = m.bonusFSUAmount;
            if (bonusFSU > 0) {
              _distributeFSU(bonusFSU, "Milestone achieved: " # m.title # " for campaign: " # campaignId);
              newTotalFSU += bonusFSU;
            };
            { m with achievedAt = ?Time.now() };
          } else {
            m;
          };
        };
      };
    });

    crowdfundingCampaigns.add(campaignId, {
      updatedCampaign with
      milestones = updatedMilestones;
      totalFSUDistributed = newTotalFSU;
    });

    pledgeId;
  };

  public query ({ caller }) func getMyPledges() : async [CrowdfundingPledge] {
    let ids = switch (backerPledgeIndex.get(caller)) {
      case (null) { return [] };
      case (?ids) { ids };
    };
    ids.filterMap(func(id) { crowdfundingPledges.get(id) });
  };

  public query func getCampaignPledges(campaignId : Text) : async [CrowdfundingPledge] {
    let ids = switch (campaignPledgeIndex.get(campaignId)) {
      case (null) { return [] };
      case (?ids) { ids };
    };
    ids.filterMap(func(id) { crowdfundingPledges.get(id) });
  };

  public query func getCrowdfundingPledge(pledgeId : Text) : async ?CrowdfundingPledge {
    crowdfundingPledges.get(pledgeId);
  };

  public shared ({ caller }) func refundPledge(pledgeId : Text) : async Bool {
    if (not AccessControl.isAdmin(accessControlState, caller)) {
      Runtime.trap("Unauthorized: Admins only");
    };
    switch (crowdfundingPledges.get(pledgeId)) {
      case (null) { false };
      case (?pledge) {
        crowdfundingPledges.add(pledgeId, { pledge with status = "refunded" });
        true;
      };
    };
  };

  // =========================================================================
  // === TENANT MODULE =======================================================
  // =========================================================================

  // --- Tenant Types ---

  public type TenantTier = {
    #starter;
    #organization;
    #enterprise;
  };

  public type TenantStatus = {
    #trial;
    #active;
    #suspended;
    #cancelled;
  };

  public type TenantBranding = {
    logoUrl : Text;
    primaryColor : Text;
    orgName : Text;
    welcomeMessage : Text;
  };

  public type TenantSubscription = {
    tier : TenantTier;
    startDate : Int;
    renewalDate : Int;
    monthlyCents : Nat;
  };

  public type Tenant = {
    id : Text;
    name : Text;
    ownerPrincipal : Principal;
    tier : TenantTier;
    status : TenantStatus;
    trialEndsAt : ?Int;
    subscription : ?TenantSubscription;
    branding : ?TenantBranding;
    memberCount : Nat;
    storageUsedMb : Nat;
    createdAt : Int;
    updatedAt : Int;
  };

  public type TenantMember = {
    tenantId : Text;
    principal : Principal;
    role : Text;
    addedAt : Int;
  };

  public type BillingRecord = {
    id : Text;
    tenantId : Text;
    amountCents : Nat;
    description : Text;
    status : Text;
    createdAt : Int;
  };

  // --- Tenant Storage ---

  let tenants = Map.empty<Text, Tenant>();
  let ownerToTenantId = Map.empty<Principal, Text>();
  let tenantMembers = Map.empty<Text, [TenantMember]>();
  let billingRecords = Map.empty<Text, BillingRecord>();
  var nextTenantId : Nat = 1;
  var nextBillingId : Nat = 1;

  // --- Tenant Functions ---

  public shared ({ caller }) func createTenant(
    name : Text,
    tier : TenantTier,
    trialDays : ?Nat,
  ) : async Text {
    if (not AccessControl.isAdmin(accessControlState, caller)) {
      Runtime.trap("Unauthorized: Admins only");
    };
    let tenantId = "tenant-" # nextTenantId.toText();
    nextTenantId += 1;
    let trialEndsAt : ?Int = switch (trialDays) {
      case (null) { null };
      case (?days) { ?(Time.now() + days * 24 * 60 * 60 * 1_000_000_000) };
    };
    let tenant : Tenant = {
      id = tenantId;
      name;
      ownerPrincipal = caller;
      tier;
      status = if (trialEndsAt != null) { #trial } else { #active };
      trialEndsAt;
      subscription = null;
      branding = null;
      memberCount = 0;
      storageUsedMb = 0;
      createdAt = Time.now();
      updatedAt = Time.now();
    };
    tenants.add(tenantId, tenant);
    ownerToTenantId.add(caller, tenantId);
    tenantId;
  };

  public query func getTenant(tenantId : Text) : async ?Tenant {
    tenants.get(tenantId);
  };

  public query ({ caller }) func getMyTenant() : async ?Tenant {
    switch (ownerToTenantId.get(caller)) {
      case (null) { null };
      case (?tid) { tenants.get(tid) };
    };
  };

  public shared ({ caller }) func suspendTenant(tenantId : Text) : async Bool {
    if (not AccessControl.isAdmin(accessControlState, caller)) {
      Runtime.trap("Unauthorized: Admins only");
    };
    switch (tenants.get(tenantId)) {
      case (null) { false };
      case (?t) {
        tenants.add(tenantId, { t with status = #suspended; updatedAt = Time.now() });
        true;
      };
    };
  };

  public shared ({ caller }) func reactivateTenant(tenantId : Text) : async Bool {
    if (not AccessControl.isAdmin(accessControlState, caller)) {
      Runtime.trap("Unauthorized: Admins only");
    };
    switch (tenants.get(tenantId)) {
      case (null) { false };
      case (?t) {
        tenants.add(tenantId, { t with status = #active; updatedAt = Time.now() });
        true;
      };
    };
  };

  public shared ({ caller }) func cancelTenant(tenantId : Text) : async Bool {
    if (not AccessControl.isAdmin(accessControlState, caller)) {
      Runtime.trap("Unauthorized: Admins only");
    };
    switch (tenants.get(tenantId)) {
      case (null) { false };
      case (?t) {
        tenants.add(tenantId, { t with status = #cancelled; updatedAt = Time.now() });
        true;
      };
    };
  };

  public query func listTenants() : async [Tenant] {
    tenants.values().toArray();
  };

  public shared ({ caller }) func addTenantMember(tenantId : Text, member : Principal, role : Text) : async Bool {
    if (not AccessControl.isAdmin(accessControlState, caller)) {
      Runtime.trap("Unauthorized: Admins only");
    };
    let existing = switch (tenantMembers.get(tenantId)) {
      case (null) { [] };
      case (?ms)  { ms };
    };
    let newMember : TenantMember = { tenantId; principal = member; role; addedAt = Time.now() };
    tenantMembers.add(tenantId, existing.concat([newMember]));
    true;
  };

  public shared ({ caller }) func removeTenantMember(tenantId : Text, member : Principal) : async Bool {
    if (not AccessControl.isAdmin(accessControlState, caller)) {
      Runtime.trap("Unauthorized: Admins only");
    };
    switch (tenantMembers.get(tenantId)) {
      case (null) { false };
      case (?ms) {
        tenantMembers.add(tenantId, ms.filter(func(m) { m.principal != member }));
        true;
      };
    };
  };

  public query func listTenantMembers(tenantId : Text) : async [TenantMember] {
    switch (tenantMembers.get(tenantId)) {
      case (null) { [] };
      case (?ms)  { ms };
    };
  };

  public shared ({ caller }) func addBillingRecord(
    tenantId : Text,
    amountCents : Nat,
    description : Text,
    status : Text,
  ) : async Text {
    if (not AccessControl.isAdmin(accessControlState, caller)) {
      Runtime.trap("Unauthorized: Admins only");
    };
    let billingId = "bill-" # nextBillingId.toText();
    nextBillingId += 1;
    let record : BillingRecord = { id = billingId; tenantId; amountCents; description; status; createdAt = Time.now() };
    billingRecords.add(billingId, record);
    billingId;
  };

  public query func listBillingHistory(tenantId : Text) : async [BillingRecord] {
    billingRecords.values().filter(func(r) { r.tenantId == tenantId }).toArray();
  };

  public shared ({ caller }) func updateTenantBranding(
    tenantId : Text,
    logoUrl : Text,
    primaryColor : Text,
    orgName : Text,
    welcomeMessage : Text,
  ) : async Bool {
    if (not AccessControl.isAdmin(accessControlState, caller)) {
      Runtime.trap("Unauthorized: Admins only");
    };
    switch (tenants.get(tenantId)) {
      case (null) { false };
      case (?t) {
        let branding : TenantBranding = { logoUrl; primaryColor; orgName; welcomeMessage };
        tenants.add(tenantId, { t with branding = ?branding; updatedAt = Time.now() });
        true;
      };
    };
  };

  public query func getTenantBranding(tenantId : Text) : async ?TenantBranding {
    switch (tenants.get(tenantId)) {
      case (null) { null };
      case (?t)   { t.branding };
    };
  };

  // =========================================================================
  // === NOTIFICATIONS MODULE ================================================
  // =========================================================================

  public type NotificationType = {
    #info;
    #warning;
    #success;
    #error;
    #credentialIssued;
    #credentialApproved;
  };

  public type Notification = {
    id : Text;
    recipient : Principal;
    title : Text;
    message : Text;
    notifType : NotificationType;
    isRead : Bool;
    createdAt : Int;
  };

  let notifications = Map.empty<Text, Notification>();
  let recipientNotifIndex = Map.empty<Principal, [Text]>();
  var nextNotificationId : Nat = 1;

  private func _createNotification(
    recipient : Principal,
    title : Text,
    message : Text,
    notifType : NotificationType,
  ) {
    let notifId = "notif-" # nextNotificationId.toText();
    nextNotificationId += 1;
    let notif : Notification = {
      id = notifId;
      recipient;
      title;
      message;
      notifType;
      isRead = false;
      createdAt = Time.now();
    };
    notifications.add(notifId, notif);
    let existing = switch (recipientNotifIndex.get(recipient)) {
      case (null) { [] };
      case (?ids) { ids };
    };
    recipientNotifIndex.add(recipient, existing.concat([notifId]));
  };

  public query ({ caller }) func getMyNotifications() : async [Notification] {
    let ids = switch (recipientNotifIndex.get(caller)) {
      case (null) { return [] };
      case (?ids) { ids };
    };
    ids.filterMap(func(id) { notifications.get(id) });
  };

  public shared ({ caller }) func markNotificationRead(notifId : Text) : async Bool {
    switch (notifications.get(notifId)) {
      case (null) { false };
      case (?n) {
        if (n.recipient != caller) { Runtime.trap("Unauthorized") };
        notifications.add(notifId, { n with isRead = true });
        true;
      };
    };
  };

  // =========================================================================
  // === TRIAL AUTO-EXPIRY AUTOMATION ========================================
  // =========================================================================

  // Last time the heartbeat ran the expiry check (nanoseconds, 0 = never)
  var lastExpiryCheck : Int = 0;

  // 24 hours in nanoseconds
  let _24hNs : Int = 86_400_000_000_000;

  // Heartbeat: runs every consensus round; fires expiry logic once per 24h
  system func heartbeat() : async () {
    let now = Time.now();
    if (now - lastExpiryCheck >= _24hNs) {
      lastExpiryCheck := now;
      // Inline expiry logic (same as checkAndExpireTrials, no caller needed)
      for ((tenantId, tenant) in tenants.entries()) {
        switch (tenant.status) {
          case (#trial) {
            switch (tenant.trialEndsAt) {
              case (null) {};
              case (?endsAt) {
                if (endsAt < now) {
                  tenants.add(tenantId, { tenant with status = #suspended; updatedAt = now });
                };
              };
            };
          };
          case (_) {};
        };
      };
    };
  };

  // --- Trial Auto-Expiry Functions ---

  /// Admin-only. Iterates all tenants and suspends any that are in #trial
  /// status with a trialEndsAt timestamp that has already passed.
  /// Returns the count of tenants checked and the count expired.
  public shared ({ caller }) func checkAndExpireTrials() : async { expired : Nat; checked : Nat } {
    if (not AccessControl.isAdmin(accessControlState, caller)) {
      Runtime.trap("Unauthorized: Admins only");
    };
    let now = Time.now();
    var expired = 0;
    var checked = 0;
    for ((tenantId, tenant) in tenants.entries()) {
      checked += 1;
      switch (tenant.status) {
        case (#trial) {
          switch (tenant.trialEndsAt) {
            case (null) {};
            case (?endsAt) {
              if (endsAt < now) {
                tenants.add(tenantId, { tenant with status = #suspended; updatedAt = now });
                expired += 1;
              };
            };
          };
        };
        case (_) {};
      };
    };
    { expired; checked };
  };

  /// Returns all tenants whose trial will expire within the next `daysFromNow` days,
  /// including any that are already past their trial end date but not yet suspended.
  /// Sorted by trialEndsAt ascending (earliest expiry first).
  public query func getExpiringTrials(daysFromNow : Nat) : async [Tenant] {
    let now = Time.now();
    let windowNs : Int = daysFromNow * 24 * 60 * 60 * 1_000_000_000;
    let cutoff : Int = now + windowNs;
    let expiring = tenants.values().filter(func(t) {
      if (t.status != #trial) { return false };
      switch (t.trialEndsAt) {
        case (null)    { false };
        case (?endsAt) { endsAt <= cutoff };
      };
    }).toArray();
    // Sort ascending by trialEndsAt (earliest first)
    expiring.sort(func(a : Tenant, b : Tenant) : { #less; #equal; #greater } {
      let aEnd = switch (a.trialEndsAt) { case (?v) v; case (null) 0 };
      let bEnd = switch (b.trialEndsAt) { case (?v) v; case (null) 0 };
      Int.compare(aEnd, bEnd);
    });
  };

  /// Sends in-platform notifications to tenant owners based on days remaining
  /// in their trial (7, 3, 1 days) and for already-expired trials.
  /// Returns a summary of how many notifications were sent.
  public shared ({ caller }) func sendTrialExpiryNotifications() : async Text {
    if (not AccessControl.isAdmin(accessControlState, caller)) {
      Runtime.trap("Unauthorized: Admins only");
    };
    let now = Time.now();
    var sentCount = 0;
    for ((_tenantId, tenant) in tenants.entries()) {
      switch (tenant.status) {
        case (#trial) {
          switch (tenant.trialEndsAt) {
            case (null) {};
            case (?endsAt) {
              let diffNs : Int = endsAt - now;
              let dayNs : Int = 86_400_000_000_000;
              let daysLeft : Int = diffNs / dayNs;
              if (daysLeft <= 0) {
                _createNotification(
                  tenant.ownerPrincipal,
                  "Trial Expired — Account Suspended",
                  "Your trial period has ended and your account has been suspended. Please upgrade to restore access.",
                  #warning,
                );
                sentCount += 1;
              } else if (daysLeft == 1) {
                _createNotification(
                  tenant.ownerPrincipal,
                  "Trial Ending Tomorrow",
                  "Your IIIntl trial ends tomorrow. Upgrade immediately to maintain access.",
                  #warning,
                );
                sentCount += 1;
              } else if (daysLeft == 3) {
                _createNotification(
                  tenant.ownerPrincipal,
                  "Trial Ending in 3 Days",
                  "Your IIIntl trial ends in 3 days. Upgrade now to avoid suspension.",
                  #warning,
                );
                sentCount += 1;
              } else if (daysLeft == 7) {
                _createNotification(
                  tenant.ownerPrincipal,
                  "Trial Ending in 7 Days",
                  "Your IIIntl trial ends in 7 days. Upgrade now to keep your data and access.",
                  #warning,
                );
                sentCount += 1;
              };
            };
          };
        };
        case (_) {};
      };
    };
    "Sent " # sentCount.toText() # " trial expiry notifications";
  };

  /// Returns the timestamp of the last heartbeat expiry check and
  /// a human-readable string showing how long until the next check fires.
  public query func getTrialAutomationStatus() : async { lastCheck : Int; nextCheckIn : Text } {
    let now = Time.now();
    let dayNs : Int = 86_400_000_000_000;
    let hourNs : Int = 3_600_000_000_000;
    let minuteNs : Int = 60_000_000_000;

    let nextCheckIn : Text = if (lastExpiryCheck == 0) {
      "Next check in ~24h (never run)"
    } else {
      let elapsed : Int = now - lastExpiryCheck;
      let remaining : Int = dayNs - elapsed;
      if (remaining <= 0) {
        "Check due now"
      } else {
        let hours : Int = remaining / hourNs;
        let mins : Int = (remaining - hours * hourNs) / minuteNs;
        "Next check in " # hours.toText() # "h " # mins.toText() # "m"
      };
    };

    { lastCheck = lastExpiryCheck; nextCheckIn };
  };

  // ==================== VOTING & DEMOCRACY ENGINE (G1+G2) ====================

  // === G1 Types: Proposal Foundation ===

  public type ProposalType = {
    #policy;
    #resolution;
    #budget;
    #amendment;
    #communityInitiative;
  };

  public type ProposalStatus = {
    #draft;
    #review;
    #openVote;
    #closed;
    #enacted;
    #rejected;
    #cancelled;
  };

  public type VotingMechanism = {
    #simpleMajority;
    #supermajority66;
    #supermajority75;
    #rankedChoice;
    #liquidDelegation;
  };

  public type Proposal = {
    id : Nat;
    proposer : Principal;
    tenantId : Text;
    orgId : ?Text;
    proposalType : ProposalType;
    title : Text;
    description : Text;
    status : ProposalStatus;
    mechanism : VotingMechanism;
    quorumPercent : Nat;
    sponsorThreshold : Nat;
    sponsors : [Principal];
    voteWindowHours : Nat;
    votingOpensAt : ?Int;
    votingClosesAt : ?Int;
    createdAt : Int;
    updatedAt : Int;
    enactedAt : ?Int;
    tags : [Text];
  };

  public type DebateComment = {
    id : Nat;
    proposalId : Nat;
    author : Principal;
    content : Text;
    parentCommentId : ?Nat;
    createdAt : Int;
    editedAt : ?Int;
    isDeleted : Bool;
  };

  // === G2 Types: Voting Engine ===

  public type VoteChoice = {
    #yes;
    #no;
    #abstain;
  };

  public type RankedChoiceEntry = {
    candidateId : Text;
    rank : Nat;
  };

  public type Vote = {
    id : Nat;
    proposalId : Nat;
    voter : Principal;
    choice : VoteChoice;
    rankedChoices : [RankedChoiceEntry];
    weight : Nat;
    delegatedTo : ?Principal;
    castAt : Int;
  };

  public type DelegationRecord = {
    delegator : Principal;
    delegateTo : Principal;
    proposalId : ?Nat;
    createdAt : Int;
    revokedAt : ?Int;
    isActive : Bool;
  };

  public type VoteTally = {
    proposalId : Nat;
    mechanism : VotingMechanism;
    totalVoters : Nat;
    totalVotesCast : Nat;
    yesVotes : Nat;
    noVotes : Nat;
    abstainVotes : Nat;
    yesWeight : Nat;
    noWeight : Nat;
    abstainWeight : Nat;
    quorumMet : Bool;
    quorumPercent : Nat;
    passed : Bool;
    rankedResults : [(Text, Nat)];
    tallyComputedAt : Int;
  };

  // === G1 Storage ===

  let proposals = Map.empty<Nat, Proposal>();
  let proposalSponsorIndex = Map.empty<Nat, [Principal]>();
  let debateComments = Map.empty<Nat, DebateComment>();
  let proposalCommentIndex = Map.empty<Nat, [Nat]>();
  let proposerIndex = Map.empty<Principal, [Nat]>();
  var nextProposalId : Nat = 1;
  var nextCommentId : Nat = 1;

  // === G2 Storage ===

  let votes = Map.empty<Nat, Vote>();
  let proposalVoteIndex = Map.empty<Nat, [Nat]>();
  let memberVoteIndex = Map.empty<Principal, [Nat]>();
  let delegations = Map.empty<Principal, DelegationRecord>();
  var nextVoteId : Nat = 1;

  // === G1 Functions: Proposal Lifecycle ===

  public shared ({ caller }) func createProposal(
    proposalType : ProposalType,
    title : Text,
    description : Text,
    mechanism : VotingMechanism,
    quorumPercent : Nat,
    sponsorThreshold : Nat,
    voteWindowHours : Nat,
    orgId : ?Text,
    tags : [Text],
  ) : async { #ok : Nat; #err : Text } {
    if (not (AccessControl.hasPermission(accessControlState, caller, #user))) {
      return #err("Unauthorized: Only authenticated users can create proposals");
    };
    let tenantId = switch (ownerToTenantId.get(caller)) {
      case (?tid) { tid };
      case (null) { "platform" };
    };
    let now = Time.now();
    let proposalId = nextProposalId;
    nextProposalId += 1;
    let threshold = if (sponsorThreshold == 0) { 1 } else { sponsorThreshold };
    let initialStatus : ProposalStatus = if (threshold == 1) { #review } else { #draft };
    let newProposal : Proposal = {
      id = proposalId;
      proposer = caller;
      tenantId;
      orgId;
      proposalType;
      title;
      description;
      status = initialStatus;
      mechanism;
      quorumPercent;
      sponsorThreshold = threshold;
      sponsors = [caller];
      voteWindowHours;
      votingOpensAt = null;
      votingClosesAt = null;
      createdAt = now;
      updatedAt = now;
      enactedAt = null;
      tags;
    };
    proposals.add(proposalId, newProposal);
    proposalSponsorIndex.add(proposalId, [caller]);
    let existingProposerIds = switch (proposerIndex.get(caller)) {
      case (null) { [] };
      case (?ids) { ids };
    };
    proposerIndex.add(caller, existingProposerIds.concat([proposalId]));
    #ok(proposalId);
  };

  public shared ({ caller }) func sponsorProposal(proposalId : Nat) : async { #ok : Text; #err : Text } {
    if (not (AccessControl.hasPermission(accessControlState, caller, #user))) {
      return #err("Unauthorized: Only authenticated users can sponsor proposals");
    };
    switch (proposals.get(proposalId)) {
      case (null) { #err("Proposal not found") };
      case (?proposal) {
        if (proposal.status != #draft) {
          return #err("Proposal is not in draft status");
        };
        let currentSponsors = switch (proposalSponsorIndex.get(proposalId)) {
          case (null) { [] };
          case (?s) { s };
        };
        let alreadySponsored = currentSponsors.find(func(p : Principal) : Bool { p == caller });
        if (alreadySponsored != null) {
          return #err("Already a sponsor of this proposal");
        };
        let newSponsors = currentSponsors.concat([caller]);
        proposalSponsorIndex.add(proposalId, newSponsors);
        let now = Time.now();
        let updatedProposal = if (newSponsors.size() >= proposal.sponsorThreshold) {
          { proposal with sponsors = newSponsors; status = #review; updatedAt = now }
        } else {
          { proposal with sponsors = newSponsors; updatedAt = now }
        };
        proposals.add(proposalId, updatedProposal);
        #ok("Proposal sponsored successfully");
      };
    };
  };

  public shared ({ caller }) func withdrawSponsor(proposalId : Nat) : async { #ok : Text; #err : Text } {
    if (not (AccessControl.hasPermission(accessControlState, caller, #user))) {
      return #err("Unauthorized: Only authenticated users can withdraw sponsorship");
    };
    switch (proposals.get(proposalId)) {
      case (null) { #err("Proposal not found") };
      case (?proposal) {
        if (proposal.status == #openVote or proposal.status == #closed or
            proposal.status == #enacted or proposal.status == #cancelled) {
          return #err("Cannot withdraw sponsorship at this stage");
        };
        let currentSponsors = switch (proposalSponsorIndex.get(proposalId)) {
          case (null) { [] };
          case (?s) { s };
        };
        let newSponsors = currentSponsors.filter(func(p : Principal) : Bool { p != caller });
        proposalSponsorIndex.add(proposalId, newSponsors);
        let now = Time.now();
        let newStatus : ProposalStatus = if (
          proposal.status == #review and newSponsors.size() < proposal.sponsorThreshold
        ) { #draft } else { proposal.status };
        proposals.add(proposalId, { proposal with sponsors = newSponsors; status = newStatus; updatedAt = now });
        #ok("Sponsorship withdrawn");
      };
    };
  };

  public shared ({ caller }) func openProposalForVoting(proposalId : Nat) : async { #ok : Text; #err : Text } {
    if (not AccessControl.isAdmin(accessControlState, caller)) {
      return #err("Unauthorized: Admins only");
    };
    switch (proposals.get(proposalId)) {
      case (null) { #err("Proposal not found") };
      case (?proposal) {
        if (proposal.status != #review) {
          return #err("Proposal must be in review status to open for voting");
        };
        let now = Time.now();
        let hourNs : Int = 3_600_000_000_000;
        let windowNs : Int = proposal.voteWindowHours.toInt() * hourNs;
        let opensAt = now;
        let closesAt = now + windowNs;
        let updatedProposal = {
          proposal with
          status = #openVote;
          votingOpensAt = ?opensAt;
          votingClosesAt = ?closesAt;
          updatedAt = now;
        };
        proposals.add(proposalId, updatedProposal);
        // Broadcast notification to all registered users
        for ((principal, _userId) in principalToUserId.entries()) {
          _createNotification(
            principal,
            "New Proposal Open for Voting",
            "A proposal titled \"" # proposal.title # "\" is now open for voting. Cast your vote before it closes.",
            #info,
          );
        };
        #ok("Proposal opened for voting");
      };
    };
  };

  public shared ({ caller }) func closeProposal(proposalId : Nat) : async { #ok : Text; #err : Text } {
    if (not AccessControl.isAdmin(accessControlState, caller)) {
      return #err("Unauthorized: Admins only");
    };
    switch (proposals.get(proposalId)) {
      case (null) { #err("Proposal not found") };
      case (?proposal) {
        if (proposal.status != #openVote and proposal.status != #review) {
          return #err("Proposal cannot be closed from its current status");
        };
        let now = Time.now();
        proposals.add(proposalId, { proposal with status = #closed; updatedAt = now });
        ignore _computeTally(proposalId);
        #ok("Proposal closed");
      };
    };
  };

  public shared ({ caller }) func enactProposal(proposalId : Nat) : async { #ok : Text; #err : Text } {
    if (not AccessControl.isAdmin(accessControlState, caller)) {
      return #err("Unauthorized: Admins only");
    };
    switch (proposals.get(proposalId)) {
      case (null) { #err("Proposal not found") };
      case (?proposal) {
        if (proposal.status != #closed) {
          return #err("Proposal must be closed before it can be enacted");
        };
        let now = Time.now();
        proposals.add(proposalId, { proposal with status = #enacted; enactedAt = ?now; updatedAt = now });
        #ok("Proposal enacted");
      };
    };
  };

  public shared ({ caller }) func cancelProposal(proposalId : Nat) : async { #ok : Text; #err : Text } {
    if (not (AccessControl.hasPermission(accessControlState, caller, #user))) {
      return #err("Unauthorized: Only authenticated users can cancel proposals");
    };
    switch (proposals.get(proposalId)) {
      case (null) { #err("Proposal not found") };
      case (?proposal) {
        let isProposer = proposal.proposer == caller;
        let isAdmin = AccessControl.isAdmin(accessControlState, caller);
        if (not isProposer and not isAdmin) {
          return #err("Unauthorized: Only the proposer or an admin can cancel");
        };
        if (proposal.status == #openVote) {
          return #err("Cannot cancel a proposal that is currently open for voting");
        };
        let now = Time.now();
        proposals.add(proposalId, { proposal with status = #cancelled; updatedAt = now });
        #ok("Proposal cancelled");
      };
    };
  };

  public query func getProposal(proposalId : Nat) : async ?Proposal {
    proposals.get(proposalId);
  };

  public query func listProposals() : async [Proposal] {
    let result = proposals.values().filter(func(p : Proposal) : Bool { p.status != #cancelled }).toArray();
    result.sort(func(a : Proposal, b : Proposal) : { #less; #equal; #greater } {
      Int.compare(b.createdAt, a.createdAt)
    });
  };

  public query func listProposalsByStatus(status : ProposalStatus) : async [Proposal] {
    proposals.values().filter(func(p : Proposal) : Bool { p.status == status }).toArray();
  };

  public query func listProposalsByType(proposalType : ProposalType) : async [Proposal] {
    proposals.values().filter(func(p : Proposal) : Bool { p.proposalType == proposalType and p.status != #cancelled }).toArray();
  };

  public query func getProposalSponsors(proposalId : Nat) : async [Principal] {
    switch (proposalSponsorIndex.get(proposalId)) {
      case (null) { [] };
      case (?sponsors) { sponsors };
    };
  };

  public shared ({ caller }) func addDebateComment(
    proposalId : Nat,
    content : Text,
    parentCommentId : ?Nat,
  ) : async { #ok : Nat; #err : Text } {
    if (not (AccessControl.hasPermission(accessControlState, caller, #user))) {
      return #err("Unauthorized: Only authenticated users can comment");
    };
    switch (proposals.get(proposalId)) {
      case (null) { #err("Proposal not found") };
      case (?proposal) {
        if (proposal.status == #cancelled) {
          return #err("Cannot comment on a cancelled proposal");
        };
        let commentId = nextCommentId;
        nextCommentId += 1;
        let now = Time.now();
        let comment : DebateComment = {
          id = commentId;
          proposalId;
          author = caller;
          content;
          parentCommentId;
          createdAt = now;
          editedAt = null;
          isDeleted = false;
        };
        debateComments.add(commentId, comment);
        let existingCommentIds = switch (proposalCommentIndex.get(proposalId)) {
          case (null) { [] };
          case (?ids) { ids };
        };
        proposalCommentIndex.add(proposalId, existingCommentIds.concat([commentId]));
        #ok(commentId);
      };
    };
  };

  public shared ({ caller }) func editDebateComment(commentId : Nat, newContent : Text) : async { #ok : Text; #err : Text } {
    if (not (AccessControl.hasPermission(accessControlState, caller, #user))) {
      return #err("Unauthorized: Only authenticated users can edit comments");
    };
    switch (debateComments.get(commentId)) {
      case (null) { #err("Comment not found") };
      case (?comment) {
        if (comment.author != caller) {
          return #err("Unauthorized: Only the comment author can edit");
        };
        debateComments.add(commentId, {
          comment with
          content = newContent;
          editedAt = ?Time.now();
        });
        #ok("Comment updated");
      };
    };
  };

  public query func getProposalComments(proposalId : Nat) : async [DebateComment] {
    let ids = switch (proposalCommentIndex.get(proposalId)) {
      case (null) { return [] };
      case (?ids) { ids };
    };
    let allComments = ids.filterMap(func(id : Nat) : ?DebateComment { debateComments.get(id) });
    let active = allComments.filter(func(c : DebateComment) : Bool { not c.isDeleted });
    active.sort(func(a : DebateComment, b : DebateComment) : { #less; #equal; #greater } {
      Int.compare(a.createdAt, b.createdAt)
    });
  };

  // === G2 Functions: Voting Engine ===

  public shared ({ caller }) func castVote(
    proposalId : Nat,
    choice : VoteChoice,
    rankedChoices : [RankedChoiceEntry],
  ) : async { #ok : Text; #err : Text } {
    if (not (AccessControl.hasPermission(accessControlState, caller, #user))) {
      return #err("Unauthorized: Only authenticated users can vote");
    };
    switch (proposals.get(proposalId)) {
      case (null) { #err("Proposal not found") };
      case (?proposal) {
        if (proposal.status != #openVote) {
          return #err("Proposal is not open for voting");
        };
        let now = Time.now();
        switch (proposal.votingClosesAt) {
          case (?closesAt) {
            if (now > closesAt) {
              return #err("Voting window has closed");
            };
          };
          case (null) {};
        };
        // Check if already voted
        let existingVoteIds = switch (memberVoteIndex.get(caller)) {
          case (null) { [] };
          case (?ids) { ids };
        };
        let existingProposalVotes = switch (proposalVoteIndex.get(proposalId)) {
          case (null) { [] };
          case (?ids) { ids };
        };
        let alreadyVoted = existingVoteIds.find(func(vid : Nat) : Bool {
          existingProposalVotes.find(func(pvid : Nat) : Bool { pvid == vid }) != null
        });
        if (alreadyVoted != null) {
          return #err("Already voted on this proposal");
        };
        let voteId = nextVoteId;
        nextVoteId += 1;
        let newVote : Vote = {
          id = voteId;
          proposalId;
          voter = caller;
          choice;
          rankedChoices;
          weight = 1;
          delegatedTo = null;
          castAt = now;
        };
        votes.add(voteId, newVote);
        proposalVoteIndex.add(proposalId, existingProposalVotes.concat([voteId]));
        memberVoteIndex.add(caller, existingVoteIds.concat([voteId]));
        // For liquidDelegation: cast on behalf of any delegators who delegated to caller
        if (proposal.mechanism == #liquidDelegation) {
          for ((delegator, delegation) in delegations.entries()) {
              if (delegation.isActive and delegation.delegateTo == caller) {
              let delegatorMatch = switch (delegation.proposalId) {
                case (null) { true };
                case (?pid) { pid == proposalId };
              };
              if (delegatorMatch) {
                let delegatorVoteIds = switch (memberVoteIndex.get(delegator)) {
                  case (null) { [] };
                  case (?ids) { ids };
                };
                let delegatorProposalVoteIds = switch (proposalVoteIndex.get(proposalId)) {
                  case (null) { [] };
                  case (?ids) { ids };
                };
                let delegatorAlreadyVoted = delegatorVoteIds.find(func(vid : Nat) : Bool {
                  delegatorProposalVoteIds.find(func(pvid : Nat) : Bool { pvid == vid }) != null
                });
                if (delegatorAlreadyVoted == null) {
                  let delegatedVoteId = nextVoteId;
                  nextVoteId += 1;
                  let delegatedVote : Vote = {
                    id = delegatedVoteId;
                    proposalId;
                    voter = delegator;
                    choice;
                    rankedChoices;
                    weight = 1;
                    delegatedTo = ?caller;
                    castAt = now;
                  };
                  votes.add(delegatedVoteId, delegatedVote);
                  let latestProposalVoteIds = switch (proposalVoteIndex.get(proposalId)) {
                    case (null) { [] };
                    case (?ids) { ids };
                  };
                  proposalVoteIndex.add(proposalId, latestProposalVoteIds.concat([delegatedVoteId]));
                  memberVoteIndex.add(delegator, delegatorVoteIds.concat([delegatedVoteId]));
                };
              };
            };
          };
        };
        #ok("Vote cast successfully");
      };
    };
  };

  public shared ({ caller }) func delegateVote(delegateTo : Principal, proposalId : ?Nat) : async { #ok : Text; #err : Text } {
    if (not (AccessControl.hasPermission(accessControlState, caller, #user))) {
      return #err("Unauthorized: Only authenticated users can delegate votes");
    };
    if (caller == delegateTo) {
      return #err("Cannot delegate to yourself");
    };
    let now = Time.now();
    let record : DelegationRecord = {
      delegator = caller;
      delegateTo;
      proposalId;
      createdAt = now;
      revokedAt = null;
      isActive = true;
    };
    delegations.add(caller, record);
    #ok("Vote delegation set");
  };

  public shared ({ caller }) func revokeDelegation(proposalId : ?Nat) : async { #ok : Text; #err : Text } {
    if (not (AccessControl.hasPermission(accessControlState, caller, #user))) {
      return #err("Unauthorized: Only authenticated users can revoke delegations");
    };
    switch (delegations.get(caller)) {
      case (null) { #err("No active delegation found") };
      case (?record) {
        let matchesScope = switch (proposalId) {
          case (null) { record.proposalId == null };
          case (?pid) {
            switch (record.proposalId) {
              case (null) { false };
              case (?rpid) { rpid == pid };
            };
          };
        };
        if (not matchesScope) {
          return #err("Delegation scope does not match");
        };
        delegations.add(caller, { record with isActive = false; revokedAt = ?Time.now() });
        #ok("Delegation revoked");
      };
    };
  };

  public query ({ caller }) func getMyDelegation() : async ?DelegationRecord {
    switch (delegations.get(caller)) {
      case (null) { null };
      case (?record) {
        if (record.isActive) { ?record } else { null };
      };
    };
  };

  public query func getVotesByProposal(proposalId : Nat) : async [Vote] {
    let voteIds = switch (proposalVoteIndex.get(proposalId)) {
      case (null) { return [] };
      case (?ids) { ids };
    };
    voteIds.filterMap(func(vid : Nat) : ?Vote { votes.get(vid) });
  };

  public query func getMemberVote(proposalId : Nat, member : Principal) : async ?Vote {
    let memberVoteIds = switch (memberVoteIndex.get(member)) {
      case (null) { return null };
      case (?ids) { ids };
    };
    let proposalVoteIds = switch (proposalVoteIndex.get(proposalId)) {
      case (null) { return null };
      case (?ids) { ids };
    };
    // Find a vote that belongs to both member and proposal
    let matchingVoteId = memberVoteIds.find(func(vid : Nat) : Bool {
      proposalVoteIds.find(func(pvid : Nat) : Bool { pvid == vid }) != null
    });
    switch (matchingVoteId) {
      case (null) { null };
      case (?vid) { votes.get(vid) };
    };
  };

  public query func getVoteTally(proposalId : Nat) : async ?VoteTally {
    _computeTally(proposalId);
  };

  private func _computeTally(proposalId : Nat) : ?VoteTally {
    switch (proposals.get(proposalId)) {
      case (null) { null };
      case (?proposal) {
        let voteIds = switch (proposalVoteIndex.get(proposalId)) {
          case (null) { [] };
          case (?ids) { ids };
        };
        let proposalVotes = voteIds.filterMap(func(vid : Nat) : ?Vote { votes.get(vid) });
        let totalVoters = users.size();
        let totalVotesCast = proposalVotes.size();
        var yesVotes : Nat = 0;
        var noVotes : Nat = 0;
        var abstainVotes : Nat = 0;
        var yesWeight : Nat = 0;
        var noWeight : Nat = 0;
        var abstainWeight : Nat = 0;
        // Tally ranked-choice candidate counts
        let rankedCounts = Map.empty<Text, Nat>();
        for (v in proposalVotes.values()) {
          switch (v.choice) {
            case (#yes) { yesVotes += 1; yesWeight += v.weight };
            case (#no)  { noVotes += 1;  noWeight += v.weight };
            case (#abstain) { abstainVotes += 1; abstainWeight += v.weight };
          };
          if (proposal.mechanism == #rankedChoice) {
            // Count first-preference votes for ranked choice
            let firstChoice = v.rankedChoices.find(func(e : RankedChoiceEntry) : Bool { e.rank == 1 });
            switch (firstChoice) {
              case (null) {};
              case (?entry) {
                let current = switch (rankedCounts.get(entry.candidateId)) {
                  case (null) { 0 };
                  case (?c) { c };
                };
                rankedCounts.add(entry.candidateId, current + 1);
              };
            };
          };
        };
        let quorumMet = if (proposal.quorumPercent == 0) {
          true
        } else if (totalVoters == 0) {
          false
        } else {
          (totalVotesCast * 100 / totalVoters) >= proposal.quorumPercent
        };
        let contested = yesWeight + noWeight;
        let passed : Bool = if (not quorumMet) {
          false
        } else {
          switch (proposal.mechanism) {
            case (#simpleMajority or #liquidDelegation) {
              yesWeight > noWeight
            };
            case (#supermajority66) {
              contested > 0 and (yesWeight * 10000 / contested) >= 6667
            };
            case (#supermajority75) {
              contested > 0 and (yesWeight * 10000 / contested) >= 7500
            };
            case (#rankedChoice) {
              // Simple plurality for first-preference in ranked choice
              var maxCandidate = ("", 0 : Nat);
              for ((cand, cnt) in rankedCounts.entries()) {
                if (cnt > maxCandidate.1) { maxCandidate := (cand, cnt) };
              };
              let maxEntry = maxCandidate;
              maxEntry.1 > 0
            };
          };
        };
        let rankedResultsUnsorted = rankedCounts.entries().toArray();
        let rankedResults = rankedResultsUnsorted.sort(func(a : (Text, Nat), b : (Text, Nat)) : { #less; #equal; #greater } {
          Nat.compare(b.1, a.1)
        });
        ?{
          proposalId;
          mechanism = proposal.mechanism;
          totalVoters;
          totalVotesCast;
          yesVotes;
          noVotes;
          abstainVotes;
          yesWeight;
          noWeight;
          abstainWeight;
          quorumMet;
          quorumPercent = proposal.quorumPercent;
          passed;
          rankedResults;
          tallyComputedAt = Time.now();
        };
      };
    };
  };

  public query func getQuorumStatus(proposalId : Nat) : async {
    totalVoters : Nat;
    votesCast : Nat;
    quorumPercent : Nat;
    quorumMet : Bool;
    percentVoted : Nat;
  } {
    switch (proposals.get(proposalId)) {
      case (null) {
        { totalVoters = 0; votesCast = 0; quorumPercent = 0; quorumMet = false; percentVoted = 0 }
      };
      case (?proposal) {
        let voteIds = switch (proposalVoteIndex.get(proposalId)) {
          case (null) { [] };
          case (?ids) { ids };
        };
        let totalVoters = users.size();
        let votesCast = voteIds.size();
        let percentVoted = if (totalVoters == 0) { 0 } else { votesCast * 100 / totalVoters };
        let quorumMet = if (proposal.quorumPercent == 0) {
          true
        } else {
          percentVoted >= proposal.quorumPercent
        };
        { totalVoters; votesCast; quorumPercent = proposal.quorumPercent; quorumMet; percentVoted };
      };
    };
  };

  public query func listActiveProposals() : async [Proposal] {
    let now = Time.now();
    proposals.values().filter(func(p : Proposal) : Bool {
      if (p.status != #openVote) { false }
      else switch (p.votingClosesAt) {
        case (null) { true };
        case (?closesAt) { now < closesAt };
      };
    }).toArray();
  };

  // === Public (unauthenticated) Proposal Feed ===

  /// Returns all non-draft, non-cancelled proposals visible to the public feed.
  /// No authentication required.
  public query func listProposalsPublic() : async [Proposal] {
    let result = proposals.values().filter(func(p : Proposal) : Bool {
      p.status != #draft and p.status != #cancelled
    }).toArray();
    result.sort(func(a : Proposal, b : Proposal) : { #less; #equal; #greater } {
      Int.compare(b.createdAt, a.createdAt)
    });
  };

  /// Returns a single proposal by ID if it is not in draft or cancelled state.
  /// No authentication required.
  public query func getProposalPublic(proposalId : Nat) : async ?Proposal {
    switch (proposals.get(proposalId)) {
      case (null) { null };
      case (?p) {
        if (p.status == #draft or p.status == #cancelled) { null }
        else { ?p };
      };
    };
  };

  /// Returns all debate comments for a proposal.
  /// No authentication required.
  public query func getProposalCommentsPublic(proposalId : Nat) : async [DebateComment] {
    let ids = switch (proposalCommentIndex.get(proposalId)) {
      case (null) { return [] };
      case (?ids) { ids };
    };
    let allComments = ids.filterMap(func(id : Nat) : ?DebateComment { debateComments.get(id) });
    let active = allComments.filter(func(c : DebateComment) : Bool { not c.isDeleted });
    active.sort(func(a : DebateComment, b : DebateComment) : { #less; #equal; #greater } {
      Int.compare(a.createdAt, b.createdAt)
    });
  };

  /// Returns the current vote tally for a proposal.
  /// No authentication required.
  public query func getVoteTallyPublic(proposalId : Nat) : async ?VoteTally {
    _computeTally(proposalId);
  };

  // =========================================================================
  // === DAO GOVERNANCE TOKEN MODULE =========================================
  // =========================================================================

  // --- DAO Token Types ---

  public type DAOTokenTxType = {
    #airdrop;
    #earned;
    #transferred;
    #burned;
    #votingReward;
  };

  public type DAOTokenRecord = {
    principal : Principal;
    balance : Nat;
    totalEarned : Nat;
    totalBurned : Nat;
    lastAirdropAt : ?Int;
    createdAt : Int;
  };

  public type DAOTokenTransaction = {
    id : Nat;
    txType : DAOTokenTxType;
    from : ?Principal;
    to : Principal;
    amount : Nat;
    note : Text;
    createdAt : Int;
  };

  // --- DAO Token Storage ---

  let daoTokenLedger = Map.empty<Principal, DAOTokenRecord>();
  let daoTokenTransactions = Map.empty<Nat, DAOTokenTransaction>();
  // claimedVotingRewards key: principalText # ":" # proposalIdText
  let claimedVotingRewards = Map.empty<Text, Bool>();
  var daoTotalSupply : Nat = 0;
  var daoTreasuryBalance : Nat = 0;
  var nextDaoTxId : Nat = 1;

  // --- DAO Token Private Helpers ---

  private func _ensureDAORecord(p : Principal) : DAOTokenRecord {
    switch (daoTokenLedger.get(p)) {
      case (?rec) { rec };
      case (null) {
        let rec : DAOTokenRecord = {
          principal = p;
          balance = 0;
          totalEarned = 0;
          totalBurned = 0;
          lastAirdropAt = null;
          createdAt = Time.now();
        };
        daoTokenLedger.add(p, rec);
        rec;
      };
    };
  };

  private func _recordDaoTx(txType : DAOTokenTxType, from : ?Principal, to : Principal, amount : Nat, note : Text) : Nat {
    let txId = nextDaoTxId;
    nextDaoTxId += 1;
    let tx : DAOTokenTransaction = {
      id = txId;
      txType;
      from;
      to;
      amount;
      note;
      createdAt = Time.now();
    };
    daoTokenTransactions.add(txId, tx);
    txId;
  };

  /// Private helper for reward distribution — called by voting and participation hooks.
  private func earnDAOTokens(recipient : Principal, amount : Nat, note : Text, txType : DAOTokenTxType) {
    let rec = _ensureDAORecord(recipient);
    daoTokenLedger.add(recipient, {
      rec with
      balance = rec.balance + amount;
      totalEarned = rec.totalEarned + amount;
    });
    daoTotalSupply += amount;
    ignore _recordDaoTx(txType, null, recipient, amount, note);
  };

  private func _airdropAmountForTier(tier : MembershipTierLevel) : Nat {
    switch (tier) {
      case (#founder)    { 10000 };
      case (#ambassador) { 5000  };
      case (#executive)  { 2000  };
      case (#partner)    { 2000  };
      case (#affiliate)  { 1000  };
      case (#associate)  { 200   };
      case (#free)       { 100   };
    };
  };

  // --- DAO Token Public Functions ---

  /// Returns the caller's DAO token record. Returns a zero-balance record if not yet initialized.
  public query ({ caller }) func getMyDAOBalance() : async DAOTokenRecord {
    if (not (AccessControl.hasPermission(accessControlState, caller, #user))) {
      Runtime.trap("Unauthorized: Only authenticated users can view DAO balance");
    };
    switch (daoTokenLedger.get(caller)) {
      case (?rec) { rec };
      case (null) {
        {
          principal = caller;
          balance = 0;
          totalEarned = 0;
          totalBurned = 0;
          lastAirdropAt = null;
          createdAt = Time.now();
        };
      };
    };
  };

  /// Returns platform-wide DAO token statistics. Public, no auth required.
  public query func getDAOTokenStats() : async {
    totalSupply : Nat;
    treasuryBalance : Nat;
    totalHolders : Nat;
  } {
    {
      totalSupply = daoTotalSupply;
      treasuryBalance = daoTreasuryBalance;
      totalHolders = daoTokenLedger.size();
    };
  };

  /// Peer-to-peer token transfer between members.
  public shared ({ caller }) func transferDAOTokens(to : Principal, amount : Nat, note : Text) : async { #ok : Nat; #err : Text } {
    if (not (AccessControl.hasPermission(accessControlState, caller, #user))) {
      return #err("Unauthorized: Only authenticated users can transfer tokens");
    };
    if (caller == to) {
      return #err("Cannot transfer tokens to yourself");
    };
    if (amount == 0) {
      return #err("Transfer amount must be greater than zero");
    };
    let senderRec = _ensureDAORecord(caller);
    if (senderRec.balance < amount) {
      return #err("Insufficient DAO token balance");
    };
    // Debit sender
    daoTokenLedger.add(caller, { senderRec with balance = Nat.sub(senderRec.balance, amount) });
    // Credit recipient
    let recipientRec = _ensureDAORecord(to);
    daoTokenLedger.add(to, {
      recipientRec with
      balance = recipientRec.balance + amount;
      totalEarned = recipientRec.totalEarned + amount;
    });
    let txId = _recordDaoTx(#transferred, ?caller, to, amount, note);
    #ok(txId);
  };

  /// Burns the caller's tokens. Reduces total supply. Awards 10 platform credits per token burned.
  public shared ({ caller }) func burnDAOTokens(amount : Nat) : async { #ok : Nat; #err : Text } {
    if (not (AccessControl.hasPermission(accessControlState, caller, #user))) {
      return #err("Unauthorized: Only authenticated users can burn tokens");
    };
    if (amount == 0) {
      return #err("Burn amount must be greater than zero");
    };
    let rec = _ensureDAORecord(caller);
    if (rec.balance < amount) {
      return #err("Insufficient DAO token balance");
    };
    daoTokenLedger.add(caller, {
      rec with
      balance = Nat.sub(rec.balance, amount);
      totalBurned = rec.totalBurned + amount;
    });
    daoTotalSupply := Nat.sub(daoTotalSupply, amount);
    let txId = _recordDaoTx(#burned, ?caller, caller, amount, "Burned for platform credits");
    // Platform credits: 1 IIINTL = 10 credits — record as activity bonus in MLM
    let platformCredits = amount * 10;
    ignore _recordEarning(caller, platformCredits, #activityBonus, "DAO token burn: " # amount.toText() # " IIINTL -> " # platformCredits.toText() # " credits", "dao-burn");
    #ok(txId);
  };

  /// Returns all DAO transactions where the caller is sender or recipient.
  public query ({ caller }) func getDAOTransactionHistory() : async [DAOTokenTransaction] {
    if (not (AccessControl.hasPermission(accessControlState, caller, #user))) {
      Runtime.trap("Unauthorized: Only authenticated users can view DAO transaction history");
    };
    daoTokenTransactions.values().filter(func(tx : DAOTokenTransaction) : Bool {
      let isSender = switch (tx.from) {
        case (null) { false };
        case (?f) { f == caller };
      };
      let isRecipient = tx.to == caller;
      isSender or isRecipient;
    }).toArray();
  };

  /// Returns the top 20 token holders by balance. Public, no auth required.
  public query func getDaoLeaderboard() : async [DAOTokenRecord] {
    let all = daoTokenLedger.values().toArray();
    let sorted = all.sort(func(a : DAOTokenRecord, b : DAOTokenRecord) : { #less; #equal; #greater } {
      Nat.compare(b.balance, a.balance)
    });
    if (sorted.size() <= 20) { sorted }
    else { sorted.sliceToArray(0, 20) };
  };

  /// Admin-only. Distributes IIINTL tokens to all MLM-initialized members based on their tier.
  /// Sends a notification to each recipient.
  public shared ({ caller }) func airdropToAllMembers() : async { airdropped : Nat; totalTokens : Nat } {
    if (not AccessControl.isAdmin(accessControlState, caller)) {
      Runtime.trap("Unauthorized: Admins only");
    };
    let now = Time.now();
    var airdropped = 0;
    var totalTokens = 0;
    for ((_p, tierRec) in memberTiers.entries()) {
      let amount = _airdropAmountForTier(tierRec.tier);
      if (amount > 0) {
        let rec = _ensureDAORecord(tierRec.principal);
        daoTokenLedger.add(tierRec.principal, {
          rec with
          balance = rec.balance + amount;
          totalEarned = rec.totalEarned + amount;
          lastAirdropAt = ?now;
        });
        daoTotalSupply += amount;
        ignore _recordDaoTx(#airdrop, null, tierRec.principal, amount, "DAO governance token airdrop");
        _createNotification(
          tierRec.principal,
          "IIINTL Token Airdrop Received",
          "You received " # amount.toText() # " IIINTL governance tokens based on your " # debug_show(tierRec.tier) # " membership tier.",
          #success,
        );
        airdropped += 1;
        totalTokens += amount;
      };
    };
    { airdropped; totalTokens };
  };

  /// Awards 50 IIINTL voting reward tokens to a member who voted on a proposal.
  /// Prevents double-claiming per proposal per member.
  public shared ({ caller }) func claimVotingReward(proposalId : Nat) : async { #ok : Nat; #err : Text } {
    if (not (AccessControl.hasPermission(accessControlState, caller, #user))) {
      return #err("Unauthorized: Only authenticated users can claim voting rewards");
    };
    let rewardKey = caller.toText() # ":" # proposalId.toText();
    if (claimedVotingRewards.containsKey(rewardKey)) {
      return #err("Voting reward already claimed for this proposal");
    };
    // Verify the caller actually voted on this proposal
    let memberVoteIds = switch (memberVoteIndex.get(caller)) {
      case (null) { return #err("You did not vote on this proposal") };
      case (?ids) { ids };
    };
    let proposalVoteIds = switch (proposalVoteIndex.get(proposalId)) {
      case (null) { return #err("Proposal not found or has no votes") };
      case (?ids) { ids };
    };
    let didVote = memberVoteIds.find(func(vid : Nat) : Bool {
      proposalVoteIds.find(func(pvid : Nat) : Bool { pvid == vid }) != null
    });
    if (didVote == null) {
      return #err("You did not vote on this proposal");
    };
    // Mark as claimed
    claimedVotingRewards.add(rewardKey, true);
    // Award 50 IIINTL tokens
    let rewardAmount : Nat = 50;
    earnDAOTokens(caller, rewardAmount, "Voting reward for proposal #" # proposalId.toText(), #votingReward);
    _createNotification(
      caller,
      "Voting Reward Claimed",
      "You earned " # rewardAmount.toText() # " IIINTL tokens for participating in proposal #" # proposalId.toText() # ".",
      #success,
    );
    let txId = nextDaoTxId - 1;
    #ok(txId);
  };

  /// Admin-only. Returns all DAO token records for admin oversight.
  public query ({ caller }) func listAllDAOTokensAdmin() : async [DAOTokenRecord] {
    if (not AccessControl.isAdmin(accessControlState, caller)) {
      Runtime.trap("Unauthorized: Admins only");
    };
    daoTokenLedger.values().toArray();
  };

  // =========================================================================
  // === DECENTRALIZED IDENTITY & VERIFIED CREDENTIALS MODULE ================
  // =========================================================================

  public type CredentialType = {
    #verifiedHuman;
    #orgRepresentative;
    #expertiseBadge;
    #eventAttendee;
    #activistCertification;
    #custom;
  };

  public type CredentialStatus = {
    #pending;
    #approved;
    #active;
    #revoked;
    #rejected;
  };

  public type Credential = {
    id : Text;
    credentialType : CredentialType;
    status : CredentialStatus;
    subject : Principal;
    issuedBy : Principal;
    title : Text;
    description : Text;
    metadata : Text;
    isPublic : Bool;
    issuedAt : Int;
    approvedAt : ?Int;
    expiresAt : ?Int;
    revokedAt : ?Int;
    updatedAt : Int;
  };

  // Credentials storage
  let credentials = Map.empty<Text, Credential>();
  let credentialsBySubject = Map.empty<Principal, [Text]>();
  var nextCredentialCounter : Nat = 1;

  // Private helper: generate a unique credential ID
  private func _generateCredentialId() : Text {
    let id = "CRED-" # Time.now().toText() # "-" # nextCredentialCounter.toText();
    nextCredentialCounter += 1;
    id;
  };

  // Admin only: issue a new credential (creates in #pending status)
  public shared ({ caller }) func issueCredential(
    subject : Principal,
    credType : CredentialType,
    title : Text,
    description : Text,
    metadata : Text,
    expiresAt : ?Int,
  ) : async Text {
    if (not (AccessControl.hasPermission(accessControlState, caller, #admin))) {
      Runtime.trap("Unauthorized: Admin only");
    };
    let credId = _generateCredentialId();
    let now = Time.now();
    let cred : Credential = {
      id = credId;
      credentialType = credType;
      status = #pending;
      subject;
      issuedBy = caller;
      title;
      description;
      metadata;
      isPublic = false;
      issuedAt = now;
      approvedAt = null;
      expiresAt;
      revokedAt = null;
      updatedAt = now;
    };
    credentials.add(credId, cred);
    // Index by subject
    let existing = switch (credentialsBySubject.get(subject)) {
      case (null) { [] };
      case (?ids) { ids };
    };
    credentialsBySubject.add(subject, existing.concat([credId]));
    // Notify the subject
    _createNotification(
      subject,
      "New Credential Issued",
      "A new credential has been issued to you: " # title # ". Pending admin approval.",
      #credentialIssued,
    );
    credId;
  };

  // Admin only: approve a pending credential → sets status to #active
  public shared ({ caller }) func approveCredential(credId : Text) : async Bool {
    if (not (AccessControl.hasPermission(accessControlState, caller, #admin))) {
      Runtime.trap("Unauthorized: Admin only");
    };
    switch (credentials.get(credId)) {
      case (null) { Runtime.trap("Credential not found") };
      case (?cred) {
        if (cred.status != #pending) {
          Runtime.trap("Credential is not in pending status");
        };
        let now = Time.now();
        credentials.add(credId, { cred with status = #active; approvedAt = ?now; updatedAt = now });
        _createNotification(
          cred.subject,
          "Credential Approved",
          "Your credential has been approved and is now active: " # cred.title,
          #credentialApproved,
        );
        true;
      };
    };
  };

  // Admin only: revoke an active credential
  public shared ({ caller }) func revokeCredential(credId : Text) : async Bool {
    if (not (AccessControl.hasPermission(accessControlState, caller, #admin))) {
      Runtime.trap("Unauthorized: Admin only");
    };
    switch (credentials.get(credId)) {
      case (null) { Runtime.trap("Credential not found") };
      case (?cred) {
        let now = Time.now();
        credentials.add(credId, { cred with status = #revoked; revokedAt = ?now; updatedAt = now });
        true;
      };
    };
  };

  // Admin only: reject a pending credential
  public shared ({ caller }) func rejectCredential(credId : Text) : async Bool {
    if (not (AccessControl.hasPermission(accessControlState, caller, #admin))) {
      Runtime.trap("Unauthorized: Admin only");
    };
    switch (credentials.get(credId)) {
      case (null) { Runtime.trap("Credential not found") };
      case (?cred) {
        let now = Time.now();
        credentials.add(credId, { cred with status = #rejected; updatedAt = now });
        true;
      };
    };
  };

  // Authenticated: subject toggles public/private visibility of their own credential
  public shared ({ caller }) func toggleCredentialPublic(credId : Text, isPublic : Bool) : async Bool {
    if (not (AccessControl.hasPermission(accessControlState, caller, #user))) {
      Runtime.trap("Unauthorized: Must be logged in");
    };
    switch (credentials.get(credId)) {
      case (null) { Runtime.trap("Credential not found") };
      case (?cred) {
        if (cred.subject != caller) {
          Runtime.trap("Unauthorized: Only the credential subject can change visibility");
        };
        credentials.add(credId, { cred with isPublic; updatedAt = Time.now() });
        true;
      };
    };
  };

  // Authenticated: returns all credentials where subject = caller
  public query ({ caller }) func getMyCredentials() : async [Credential] {
    let ids = switch (credentialsBySubject.get(caller)) {
      case (null) { return [] };
      case (?ids) { ids };
    };
    ids.filterMap(func(id : Text) : ?Credential { credentials.get(id) });
  };

  // Public: returns a credential by ID (no auth required)
  public query func getCredential(credId : Text) : async ?Credential {
    credentials.get(credId);
  };

  // Public: returns all active + public credentials of a given type
  public query func listPublicCredentialsByType(credType : CredentialType) : async [Credential] {
    credentials.values().filter(func(c : Credential) : Bool {
      c.status == #active and c.isPublic and c.credentialType == credType
    }).toArray();
  };

  // Admin only: returns all credentials for admin panel
  public query ({ caller }) func listAllCredentialsAdmin() : async [Credential] {
    if (not (AccessControl.hasPermission(accessControlState, caller, #admin))) {
      Runtime.trap("Unauthorized: Admin only");
    };
    credentials.values().toArray();
  };

};
