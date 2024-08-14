/**
 * @description This class is used for displaying all posts,
 *              soft deleting the posts, creating a new post,
 *              and creating a comment for a particular post.
 * History:
 * Version Author      Date            Detail          Description
 * 1.0     Deepa       05-Dec-2023     Created         Initial development.
 * 1.1     Deepa       01-Jan-2024     Updated         Updated for caregiver.
 * 1.2     Deepa       04-Apr-2024     Updated         Catch log added.
 * 1.3     Deepa       22-Apr-2024     Updated         Code Review.
 * 1.4     Deepa       27-Apr-2024     Updated         Indentation.
 */
public with sharing class BI_PSPB_FeedItemCtrl {
	/**
	* @description	Used to softdelete a post from the database.
	* @param		feedItemId - The Id	of the post to be soft deleted.
	This method is used in biPspbMyPost LWC.
	*/
	@AuraEnabled
	public static void softDeleteFeedItem(String feedItemId) {
		try {
			if (String.isBlank(feedItemId)) {
				// Throwing exception when post is not deleted.
				logError(BI_PSPB_CommunityConstantCtrl.errorWhileDeleting);
			}
			// Define the parameters for the query
			String queryString =
				'SELECT Id, BI_PSP_SoftDelete__c FROM BI_PSP_FeedItem__c WHERE Id = \'' +
				feedItemId +
				'\'';

			List<BI_PSP_FeedItem__c> feedItemToUpdate = BI_PSP_CommonQueryUtility.executeComplexQuery(
				queryString,
				true
			);

			if (feedItemToUpdate[0] != null) {
				// Updating the 'BI_PSP_SoftDelete__c' field to softdelete the post.
				feedItemToUpdate[0]
					.BI_PSP_SoftDelete__c = BI_PSPB_CommunityConstantCtrl.softDelete;
				BI_PSP_DatabaseOperationsUtility.updateOperation(
					new List<BI_PSP_FeedItem__c>{ feedItemToUpdate[0] },
					BI_PSPB_FeedItemCtrl.class.toString(),
					true
				);
			} else {
				// Throwing exception when post is not found.
				logError(BI_PSPB_CommunityConstantCtrl.errorWhileFetchingPost);
			}
		} catch (System.DmlException ex) {
			BI_PSP_LogMessagesUtility.catchSystemException(
				BI_PSPB_CommunityConstantCtrl.errorWhileDeleting,
				BI_PSPB_FeedItemCtrl.class.toString(),ex
			);
		}
	}
	/**
	* @description		Used to create a post with category and 
						subcategory for that user.
	* @param			category - The	category of	the	post.
	* @param			subcategory - The subcategory of the post.
	This method is used in biPspbCreatePost LWC.
	*/
	@AuraEnabled
	public static void insertFeedItem(String category, String subcategory) {
		BI_PSP_FeedItem__c newFeedItem;
		try {
			if (String.isBlank(category) || String.isBlank(subcategory)) {
				// Throwing exception when post is not found.
				logError(BI_PSPB_CommunityConstantCtrl.errorWhileCreatingPost);
			}

			// Getting enrollee records
			List<CareProgramEnrollee> enrolleeRecords = BI_PSP_CurrentUser.getEnrolleeRecords();
			if (enrolleeRecords.isEmpty()) {
				logError(BI_PSPB_CommunityConstantCtrl.errorWhileCreatingPost);
				// Throwing exception when enrollee records are not found
				return;
			}
			//Creating new post with the entered category and sub category by the user.
			newFeedItem = new BI_PSP_FeedItem__c(
				BI_PSP_Phrase__c = subcategory,
				BI_PSP_Category__c = category,
				BI_PSP_CareProgramEnrollee__c = enrolleeRecords[0].Id
			);
			BI_PSP_DatabaseOperationsUtility.insertOperation(
				new List<BI_PSP_FeedItem__c>{ newFeedItem },
				BI_PSPB_FeedItemCtrl.class.toString(),
				false
			);
		} catch (System.DmlException ex) {
			BI_PSP_LogMessagesUtility.catchSystemException(
				BI_PSPB_CommunityConstantCtrl.errorWhileCreatingPost,
				BI_PSPB_FeedItemCtrl.class.toString(),ex
			);
		}
	}
	/**
	* @description	Used to get all posts that are created by the logged 
					in user to display in mypost.
	* @return		List<BI_PSP_FeedItem__c> - List of posts that are created 
					by the logged in user.
					The list is returned to biPspbMyPost LWC.
	*/
	@AuraEnabled(cacheable=true)
	public static List<BI_PSP_FeedItem__c> fetchMyPost() {
		List<BI_PSP_FeedItem__c> myPostRecords;
		try {
			// Getting the CareProgramEnrollee ID associated with the user ID.
			String cpeId = BI_PSP_CurrentUser.getEnrolleeRecords()[0].Id;
			if (String.isBlank(cpeId)) {
				// Throwing error when account not found.
				logError(BI_PSPB_CommunityConstantCtrl.errorWhileGetEnrolleeId);
				return myPostRecords;
			}
			//List of posts that are created by the logged in user with reactions and comments.
			// Define the parameters for the query
			String queryString =
				'SELECT ' +
				'Id, ' +
				'BI_PSP_Category__c, ' +
				'BI_PSP_Phrase__c, ' +
				'BI_PSP_SoftDelete__c, ' +
				'OwnerId, ' +
				'CreatedDate, ' +
				'(SELECT Id, BI_PSP_Comment__c, BI_PSP_CommentDelete__c ' +
				'FROM BI_PSP_FeedComment__r ' +
				'WHERE BI_PSP_CommentDelete__c != \'' +
				BI_PSPB_CommunityConstantCtrl.softDelete +
				'\'), ' +
				'(SELECT Id, BI_PSP_ReactionResult__c ' +
				'FROM BI_PSP_EmojiReactionController__r) ' +
				'FROM BI_PSP_FeedItem__c ' +
				'WHERE BI_PSP_CareProgramEnrollee__c = \'' +
				cpeId +
				'\' ' +
				'AND BI_PSP_SoftDelete__c != \'' +
				BI_PSPB_CommunityConstantCtrl.softDelete +
				'\' ' +
				'AND BI_PSP_Category__c != NULL ' +
				'AND BI_PSP_Phrase__c != NULL ' +
				'ORDER BY CreatedDate DESC';

			// Execute the query using the common query utility
			myPostRecords = BI_PSP_CommonQueryUtility.executeComplexQuery(
				queryString,
				false
			);
		} catch (Exception ex) {
			BI_PSP_LogMessagesUtility.exceptionLogMessage(
				BI_PSPB_CommunityConstantCtrl.errorWhileFetchingPost,
				BI_PSPB_FeedItemCtrl.class.toString(),
				ex
			);
		}
		/** Here 'filteredResults' is not checked for null exception as 
				it is handled in LWC.
				There are two different scenario such as it takes an action when 
				it is returned as null and another action when it is returned with values.
		*/
		return myPostRecords;
	}
	/**		
	* @description	Used to fetch all posts from database.Fetch and display 
					allposts and also display if the poster is 
					already being Followed by the current user.
	* @return		List<BI_PSP_FeedItem__c> List of posts	that are to	
					be	displayed in All post page.
					List is returned to biPspbAllPost LWC.
	*/
	@AuraEnabled(cacheable=true)
	public static List<BI_PSP_FeedItem__c> getAllPost() {
		List<BI_PSP_FeedItem__c> filteredResults = new List<BI_PSP_FeedItem__c>();
		try {
			// Getting the CareProgramEnrollee ID associated with the user ID.
			String cpeId = BI_PSP_CurrentUser.getEnrolleeRecords()[0].Id;
			if (String.isBlank(cpeId)) {
				// Throwing error when account not found.
				logError(BI_PSPB_CommunityConstantCtrl.errorWhileGetEnrolleeId);
				return filteredResults;
			}
			// Fetch all relevant Feed Items and their comments and reactions.
			List<BI_PSP_FeedItem__c> allPostRecords = fetchAllFeedItems();

			// Fetch current user follow statuses.
			Set<Id> followingUserIds = getFollowingUserIds(cpeId);
			for (BI_PSP_FeedItem__c item : allPostRecords) {
				//	Check if the creator of	the	post is	being followed.
				if (followingUserIds.contains(item.BI_PSP_CareProgramEnrollee__c)) {
					item.BI_PSP_FollowStatus__c = BI_PSPB_CommunityConstantCtrl.following;
				} else {
					item.BI_PSP_FollowStatus__c = BI_PSPB_CommunityConstantCtrl.follow;
				}
				filteredResults.add(item);
			}
		} catch (Exception ex) {
			BI_PSP_LogMessagesUtility.exceptionLogMessage(
				BI_PSPB_CommunityConstantCtrl.errorWhileFetchingPost,
				BI_PSPB_FeedItemCtrl.class.toString(),
				ex
			);
		}
		/** Here 'filteredResults' is not checked for null exception as 
			it is handled in LWC.
			There are two different scenario such as it takes an action when 
			it is returned as null and another action when it is returned with values.
		*/
		return filteredResults;
	}
	/**
	 * @description Fetches all feed items that are not soft deleted, have non-null categories and phrases,
	 *              and include their comments and reactions. This method returns a list of feed items
	 *              along with their related comments and reactions.
	 * @return List<BI_PSP_FeedItem__c> - A list of feed items with associated comments and reactions.
	 */
	private static List<BI_PSP_FeedItem__c> fetchAllFeedItems() {
		// Define the parameters for the query
		String queryString =
			'SELECT ' +
			'Id, ' +
			'BI_PSP_Category__c, ' +
			'BI_PSP_Phrase__c, ' +
			'BI_PSP_FollowStatus__c, ' +
			'BI_PSP_SoftDelete__c, ' +
			'BI_PSP_CareProgramEnrollee__c, ' +
			'CreatedDate, ' +
			'BI_PSP_CareProgramEnrollee__r.BI_PSP_AvatarUrl__c, ' +
			'BI_PSP_CareProgramEnrollee__r.BI_PSP_CommunityUsername__c, ' +
			'(SELECT Id, BI_PSP_Comment__c, BI_PSP_CommentDelete__c ' +
			'FROM BI_PSP_FeedComment__r ' +
			'WHERE BI_PSP_CommentDelete__c != \'' +
			BI_PSPB_CommunityConstantCtrl.softDelete +
			'\'), ' +
			'(SELECT Id, BI_PSP_ReactionResult__c ' +
			'FROM BI_PSP_EmojiReactionController__r) ' +
			'FROM BI_PSP_FeedItem__c ' +
			'WHERE BI_PSP_CareProgramEnrollee__c != NULL ' +
			'AND BI_PSP_SoftDelete__c != \'' +
			BI_PSPB_CommunityConstantCtrl.softDelete +
			'\' ' +
			'AND BI_PSP_Category__c != NULL ' +
			'AND BI_PSP_Phrase__c != NULL ' +
			'ORDER BY CreatedDate DESC';

		// Execute the query using the common query utility
		List<BI_PSP_FeedItem__c> allPostRecords = BI_PSP_CommonQueryUtility.executeComplexQuery(
			queryString,
			false
		);

		return allPostRecords;
	}
	private static Set<Id> getFollowingUserIds(String cpeId) {
		Set<Id> followingUserIds = new Set<Id>();

		// Define the parameters for the query
		String queryString =
			'SELECT Id, BI_PSP_CareProgramEnrolleeFollow__c FROM BI_PSP_FeedFollow__c WHERE BI_PSP_CareProgramEnrolleeAccount__c = \'' +
			cpeId +
			'\' AND BI_PSP_Type__c = \'' +
			BI_PSPB_CommunityConstantCtrl.following +
			'\' ';

		List<BI_PSP_FeedFollow__c> currentUserFollowing = BI_PSP_CommonQueryUtility.executeComplexQuery(
			queryString,
			false
		);

		for (BI_PSP_FeedFollow__c followRecord : currentUserFollowing) {
			followingUserIds.add(followRecord.BI_PSP_CareProgramEnrolleeFollow__c);
		}
		return followingUserIds;
	}
      // Method to log errors
    private static void logError(String errorMessage) {
        BI_PSP_LogMessagesUtility.logError(
            errorMessage,
            BI_PSPB_FeedItemCtrl.class.toString(),
            true,
            BI_PSPB_CommunityConstantCtrl.LOG_SEVERITY_ERROR
        );
    
    }
}