import Map "mo:core/Map";
import Principal "mo:core/Principal";

module {
  // Old NotificationType had only 4 variants
  type OldNotificationType = {
    #info;
    #warning;
    #success;
    #error;
  };

  type OldNotification = {
    id : Text;
    recipient : Principal;
    title : Text;
    message : Text;
    notifType : OldNotificationType;
    isRead : Bool;
    createdAt : Int;
  };

  // New NotificationType adds 2 more variants
  type NewNotificationType = {
    #info;
    #warning;
    #success;
    #error;
    #credentialIssued;
    #credentialApproved;
  };

  type NewNotification = {
    id : Text;
    recipient : Principal;
    title : Text;
    message : Text;
    notifType : NewNotificationType;
    isRead : Bool;
    createdAt : Int;
  };

  type OldActor = {
    notifications : Map.Map<Text, OldNotification>;
  };

  type NewActor = {
    notifications : Map.Map<Text, NewNotification>;
  };

  public func run(old : OldActor) : NewActor {
    let notifications = old.notifications.map<Text, OldNotification, NewNotification>(
      func(_id, n) {
        let newType : NewNotificationType = switch (n.notifType) {
          case (#info) { #info };
          case (#warning) { #warning };
          case (#success) { #success };
          case (#error) { #error };
        };
        { n with notifType = newType };
      }
    );
    { notifications };
  };
};
