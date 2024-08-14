/**
 * @description This class provides functionality for managing comments related to posts. It includes operations for creating, updating, deleting, and fetching comments associated with a specific post.
 * @history
 * Version    Author    Date        Detail    Description
 * 1.0        Deepa     05-Dec-2023 Created   Initial development.
 * 1.1        Deepa     17-Jul-2024 Updated   Code Refactor.
 */
public with sharing class BI_PSPB_FeedCommentCtrl {
	/**
	* @description	Used to insert the comments for a particular post.
	* @param		commentContent - The content of	the	comment	
					to	be	inserted.
	* @param		postId - The ID	of	the	post to	which the comment belongs.
	This method is used in biPspbCreatePost LWC.
	*/
	@AuraEnabled
	public static void insertComment(String commentContent, String postId) {
		BI_PSP_FeedComment__c createComment;
		try {
			if ((String.isBlank(commentContent)) || (String.isBlank(postId))) {
				// Throwing error when post is not found.
				logError(BI_PSPB_CommunityConstantCtrl.errorWhileCreatingComment);
			}
			// Getting account Id of the user.
			String enrolleeId = BI_PSP_CurrentUser.getEnrolleeRecords()[0].id;
			if (String.isBlank(enrolleeId)) {
				// Throwing error when account not found.
				logError(BI_PSPB_CommunityConstantCtrl.errorWhileGetEnrolleeId);
			}
			// Create a comment for a post.
			createComment = new BI_PSP_FeedComment__c();
			createComment.BI_PSP_Comment__c = commentContent;
			createComment.BI_PSP_FeedItem__c = postId;
			createComment.BI_PSP_CareProgramEnrolleeCmt__c = enrolleeId;
			BI_PSP_DatabaseOperationsUtility.insertOperation(
				new List<BI_PSP_FeedComment__c>{ createComment },
				BI_PSPB_FeedCommentCtrl.class.toString(),
				false
			);
		} catch (System.DmlException ex) {
			BI_PSP_LogMessagesUtility.catchSystemException(
				BI_PSPB_CommunityConstantCtrl.errorWhileCreatingComment,
				BI_PSPB_FeedCommentCtrl.class.toString(),ex
			);
		}
	}
	/**
	* @description	Used to fetch all the comments for each post.
	* @param		feedItemId - The ID of the post for which to retrieve 
					comments.
	* @return		List<BI_PSP_FeedComment__c>	- List	of	comments for that 
					particular post.
					List is returned to biPspbAllPost and biPspbMyPost LWC.
	*/
	@AuraEnabled
	public static list<BI_PSP_FeedComment__c> viewComments(string feedItemId) {
		list<BI_PSP_FeedComment__c> comments;
		try {
			if (String.isBlank(feedItemId)) {
				// Throwing error when post not found.
				logError(BI_PSPB_CommunityConstantCtrl.errorWhileGettingComment);
				return comments;
			}
			// Comments of the particular posts.
			// Construct query conditions
			String sObjectType = 'BI_PSP_FeedComment__c';
			String fields = 'id, BI_PSP_Comment__c, BI_PSP_CommentDelete__c, CreatedDate, BI_PSP_FeedItem__c, BI_PSP_CareProgramEnrolleeCmt__r.BI_PSP_AvatarUrl__c, BI_PSP_CareProgramEnrolleeCmt__r.BI_PSP_CommunityUsername__c, BI_PSP_CareProgramEnrolleeCmt__c';
			String conditions =
				'BI_PSP_FeedItem__c = \'' +
				feedItemId +
				'\' AND BI_PSP_CommentDelete__c != \'' +
				BI_PSPB_CommunityConstantCtrl.softDelete +
				'\' AND BI_PSP_CareProgramEnrolleeCmt__c != NULL ORDER BY CreatedDate DESC';

			// Use utility to execute query
			comments = BI_PSP_CommonQueryUtility.executeQuery(
				sObjectType,
				fields,
				conditions,
				false
			);
		} catch (Exception ex) {
			BI_PSP_LogMessagesUtility.exceptionLogMessage(
				BI_PSPB_CommunityConstantCtrl.errorWhileGettingComment,
				BI_PSPB_FeedCommentCtrl.class.toString(),
				ex
			);
		}
		/** Here 'comments' is not checked for null exception as 
			it is handled in LWC.
			There are two different scenario such as it takes an action when 
			it is returned as null and another action when it is returned with values.
		*/
		return comments;
	}
	/**
	* @description		Used to	update the existing comment for a post.
	* @param			commentToUpdate - The string of	the	comment	that 
						is to be updated.
	* @param			commentId - The	ID	of	the	comment	to	be	edited.
	* @return			BI_PSP_FeedComment__c - The	edited	feed comment record.
						List is returned to biPspbAllPost and biPspbMyPost LWC.
	*/
	@AuraEnabled
	public static BI_PSP_FeedComment__c editComment(
		String commentToUpdate,
		String commentId
	) {
		List<BI_PSP_FeedComment__c> commentToEdit;
		try {
			if ((String.isBlank(commentToUpdate)) || (String.isBlank(commentId))) {
				logError(BI_PSPB_CommunityConstantCtrl.errorWhileEditingComment);
				return commentToEdit[0];
			}
			// Fetching the comment that is to be updated.
			// Define the parameters for the query
			String sObjectType = 'BI_PSP_FeedComment__c';
			String fields = 'Id, BI_PSP_Comment__c';
			String conditions = 'Id = \'' + commentId + '\'';
			Boolean withUserMode = true;

			commentToEdit = BI_PSP_CommonQueryUtility.executeQuery(
				sObjectType,
				fields,
				conditions,
				withUserMode
			);
			if (commentToEdit[0] != null) {
				commentToEdit[0].BI_PSP_Comment__c = commentToUpdate;
				BI_PSP_DatabaseOperationsUtility.updateOperation(
					new List<BI_PSP_FeedComment__c>{ commentToEdit[0] },
					BI_PSPB_FeedCommentCtrl.class.toString(),
					true
				);
			} else {
				// Throwing error when comments not found.
				logError(BI_PSPB_CommunityConstantCtrl.errorWhileGettingComment);
			}
		} catch (System.DmlException ex) {
			BI_PSP_LogMessagesUtility.catchSystemException(
				BI_PSPB_CommunityConstantCtrl.errorWhileEditingComment,
				BI_PSPB_FeedCommentCtrl.class.toString(),ex
			);
		}
		/** Here 'commentToEdit' is not checked for null exception as 
				it is handled in LWC.
			*/
		return commentToEdit[0];
	}
	/**
	* @description	Used to	softdelete a comment from particular post.
	* @param		feedCommentItemId -	The	ID of the feed comment 
					item to be soft deleted.
	This method is used in biPspbMyPost,biPspbAllPost LWC.
	*/
	@AuraEnabled
	public static void softDeleteFeedCommentItem(String feedCommentItemId) {
		try {
			if (String.isBlank(feedCommentItemId)) {
				// Throwing error when comment not found.
				logError(BI_PSPB_CommunityConstantCtrl.errorWhileDeletingComment);
			}
			// Fetchig the comment that is to be deleted.
			// // Construct query conditions
			// Define the parameters for the query
			String sObjectType = 'BI_PSP_FeedComment__c';
			String fields = 'Id, BI_PSP_CommentDelete__c';
			String conditions = 'Id = \'' + feedCommentItemId + '\'';
			Boolean withUserMode = true;

			List<BI_PSP_FeedComment__c> feedCommentItemToUpdate = BI_PSP_CommonQueryUtility.executeQuery(
				sObjectType,
				fields,
				conditions,
				withUserMode
			);
			if (feedCommentItemToUpdate[0] != null) {
				feedCommentItemToUpdate[0]
					.BI_PSP_CommentDelete__c = BI_PSPB_CommunityConstantCtrl.softDelete;
				BI_PSP_DatabaseOperationsUtility.updateOperation(
					new List<BI_PSP_FeedComment__c>{ feedCommentItemToUpdate[0] },
					BI_PSPB_FeedCommentCtrl.class.toString(),
					true
				);
			} else {
				// Throwing error when comment not found.
				logError(BI_PSPB_CommunityConstantCtrl.errorWhileGettingComment);
			}
		} catch (System.DmlException ex) {
			BI_PSP_LogMessagesUtility.catchSystemException(
				BI_PSPB_CommunityConstantCtrl.errorWhileDeletingComment,
				BI_PSPB_FeedCommentCtrl.class.toString(),ex
			);
		}
	}
	/**
	* @description	Used to	fetch list of comment options for a	particular	post.
	* @param		feedItemId - The ID	of the	post  for which	to 
					retrieve	comment	options.
	* @return		list<BI_PSP_FeedItem__c> - List of	BI_PSP_FeedItem__c	
					objects	representing comment options.
					List is returned to biPspbMyPost LWC.
	*/
	@AuraEnabled(cacheable=true)
	public static list<BI_PSP_FeedItem__c> getCommentOptions(string feedItemId) {
		list<BI_PSP_FeedItem__c> feedRecords;
		try {
			if (String.isBlank(feedItemId)) {
				logError(BI_PSPB_CommunityConstantCtrl.errorWhileGettingComment);
				return feedRecords;
			}
			// List of comment options for respective category and sub-category.
			// Define the parameters for the query
			String sObjectType = 'BI_PSP_FeedItem__c';
			String fields = 'id, BI_PSP_Phrase__c, BI_PSP_Category__c';
			String conditions = 'Id = \'' + feedItemId + '\'' ;
			Boolean withUserMode = true;

			feedRecords = BI_PSP_CommonQueryUtility.executeQuery(
				sObjectType,
				fields,
				conditions,
				withUserMode
			);

			if (feedRecords.isEmpty()) {
				logError(BI_PSPB_CommunityConstantCtrl.errorWhileGettingComment);
			}
		} catch (Exception ex) {
			BI_PSP_LogMessagesUtility.exceptionLogMessage(
				BI_PSPB_CommunityConstantCtrl.errorWhileGettingComment,
				BI_PSPB_FeedCommentCtrl.class.toString(),
				ex
			);
		}
		return feedRecords;
	}
	// Method to log errors
	private static void logError(String errorMessage) {
        BI_PSP_LogMessagesUtility.logError(
            errorMessage,
            BI_PSPB_FeedCommentCtrl.class.toString(),
            true,
            BI_PSPB_CommunityConstantCtrl.LOG_SEVERITY_ERROR
        );
    
    }
}