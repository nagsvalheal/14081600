/**
 * @description This class defines constants used in the Community Module.
 * @history
 * Version   Author         Date         Detail       Description
 * 1.0        Deepa       23-07-2024   Created      Initial Version
 */
public class BI_PSPB_CommunityConstantCtrl {
   // Custom labels for various error messages.
    public static String error = System.Label.BI_PSP_ConsoleError; // General console error
    public static String errorWhileGetUsername = System.Label.BI_PSP_ErrorForUserName;
    public static String errorWhileGetEnrolleeId = System.Label.BI_PSP_PatientEnrolleeError;
    public static String errorWhileGetAccountId = System.Label.BI_PSP_AccountError;
    public static String errorWhileCreatingUsername = System.Label.BI_PSP_ErrorForCreateUserName;
    public static String errorWhileGetAvatar = System.Label.BI_PSP_ErrorForImage;
    public static String errorWhileDeleting = System.Label.BI_PSP_ErrorForPostDeletion;
    public static String errorWhileFetchingPost = System.Label.BI_PSP_ErrorForPostSelection;
    public static String errorWhileCreatingPost = System.Label.BI_PSP_ErrorForPostCreation;
    public static String errorWhileCreatingComment = System.Label.BI_PSP_ErrorForCommenting;
    public static String errorWhileGettingComment = System.Label.BI_PSP_ErrorForComment;
    public static String errorWhileEditingComment = System.Label.BI_PSP_ErrorForUpdating;
    public static String errorWhileDeletingComment = System.Label.BI_PSP_ErrorForDeleteComment;
    public static String errorWhileReacting = System.Label.BI_PSP_ErrorForReactPost;
    public static String errorWhileGetReactions = System.Label.BI_PSP_ErrorForDisplayReaction;
    public static String errorWhileUnreacting = System.Label.BI_PSP_ErrorForUnreactPost;
    public static String errorWhileGetFollowStatus = System.Label.BI_PSP_ErrorForCheckingFollowStatus;
	public static String errorWhileUnfollowing = System.Label.BI_PSP_ErrorForUnfollow;
	public static String errorWhileFollowing = System.Label.BI_PSP_ErrorForFollowAccount;
	public static String errorWhileGettingFollowers = System.Label.BI_PSP_ErrorForGettingFollower;
    public static String alreadyFollowing = System.Label.BI_PSP_ErrorForFollowUser;
    public static final String LOG_SEVERITY_ERROR  = 'ERROR';
    public static String softDelete = System.Label.BI_PSP_SoftDelete;//Label for soft delete action.
    //Emoji reaction types.
    public static String thumbsUp = System.Label.BI_PSP_ThumbsUpNumber;
    public static String smile = System.Label.BI_PSP_Smile;
    public static String foldedHands = System.Label.BI_PSP_FoldedHandNumber;
    public static String heart = System.Label.BI_PSP_Heart;
    public static String thinkingFace = System.Label.BI_PSP_ThinkingFaceNumber;
    public static String noReaction = System.Label.BI_PSP_MessageForNoReactions; //Message indicating no reactions.
	public static String follower = System.Label.BI_PSP_Follower;//Label for follower.
    public static String follow = System.Label.BI_PSP_Follow;//Label for follow action.
    public static String following = System.Label.BI_PSP_Following;//Label for following status. 
}