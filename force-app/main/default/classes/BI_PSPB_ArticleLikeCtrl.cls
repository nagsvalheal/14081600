/**
 * Controller class for managing article reactions.
 *
 * @description This class provides functionality to check, update, and insert user reactions (like or dislike) for articles.
 * Version	Author			Date			Detail				Description
 * 1.0		Angelin Irin	26-Jul-2024		Created				Initial development
 * 1.1		Angelin Irin	28-Jul-2024		Updated				Updated checkReaction,updateReaction methods to Retrieve the reaction (like or dislike) for a given article based on the current user and  Update an existing reaction or inserts a new reaction based on the given article name and reaction.
 */
public with sharing class BI_PSPB_ArticleLikeCtrl {
	/**
	 * Retrieves the user's reaction to a specific article.
	 *
	 * @description Retrieves the reaction (like or dislike) for a given article based on the current user.
	 * @param articleName The name of the article.
	 * @return The user's reaction (like or dislike). Returns default dislike if no reaction found.
	 * @throws AuraHandledException if the article name is invalid or empty.
	 */
	@AuraEnabled(cacheable=true)
	public static String checkReaction(String articleName) {
		String reaction = '';
		try {
			validateArticleName(articleName);
			Id enrolleeId = BI_PSP_CurrentUser.getEnrolleeRecords()[0].id;
			List<BI_PSPB_Article_like__c> reactions = fetchReactions(
				articleName,
				enrolleeId
			);
			reaction = reactions.isEmpty()
				? BI_PSPB_InfoCenterConstantCtrl.errorDislikeLabel
				: reactions[0].BI_PSPB_Reaction__c;
		} catch (Exception ex) {
			BI_PSP_LogMessagesUtility.exceptionLogMessage(
				BI_PSPB_InfoCenterConstantCtrl.errorRetrieveLike,
				BI_PSPB_ArticleLikeCtrl.class.toString(),
				ex
			);
		}
		return reaction;
	}

	/**
	 * Updates or deletes the user's reaction to a specific article.
	 *
	 * @description Updates an existing reaction or inserts a new reaction based on the given article name and reaction.
	 * @param articleName The name of the article.
	 * @param reaction The user's reaction (like or dislike).
	 * @throws AuraHandledException if the article name or reaction is invalid.
	 */
	@AuraEnabled(cacheable=false)
	public static void updateReaction(String articleName, String reaction) {
		try {
			validateArticleName(articleName);
			validateReaction(reaction);
			Id enrolleeId = BI_PSP_CurrentUser.getEnrolleeRecords()[0].id;
			List<BI_PSPB_Article_like__c> existingReactions = fetchReactions(
				articleName,
				enrolleeId
			);

			if (!existingReactions.isEmpty()) {
				processExistingReaction(existingReactions[0], reaction);
			} else {
				insertNewReaction(articleName, reaction, enrolleeId);
			}
		} catch (Exception ex) {
			BI_PSP_LogMessagesUtility.exceptionLogMessage(
				BI_PSPB_InfoCenterConstantCtrl.errorInsertLabel,
				BI_PSPB_ArticleLikeCtrl.class.toString(),
				ex
			);
		}
	}

	/**
	 * Validates that the article name is not null or empty.
	 *
	 * @description Throws an exception if the article name is invalid.
	 * @param articleName The name of the article.
	 * @throws AuraHandledException if the article name is null or blank.
	 */
	private static void validateArticleName(String articleName) {
		if (String.isBlank(articleName)) {
			throw new AuraHandledException(
				BI_PSPB_InfoCenterConstantCtrl.articleParameterError
			);
		}
	}

	/**
	 * Validates that the reaction is not null or empty.
	 *
	 * @description Throws an exception if the reaction is invalid.
	 * @param reaction The user's reaction.
	 * @throws AuraHandledException if the reaction is null or blank.
	 */
	private static void validateReaction(String reaction) {
		if (String.isBlank(reaction)) {
			throw new AuraHandledException(
				BI_PSPB_InfoCenterConstantCtrl.articleParameterError
			);
		}
	}

	/**
	 * Fetches existing reactions for a specific article and user.
	 *
	 * @description Executes a query to fetch reactions for the given article and user.
	 * @param articleName The name of the article.
	 * @param enrolleeId The enrollee ID of the user.
	 * @return A list of existing reactions.
	 */
	private static List<BI_PSPB_Article_like__c> fetchReactions(
		String articleName,
		Id enrolleeId
	) {
		String escapedArticleName = String.escapeSingleQuotes(articleName);

		String sObjectType = 'BI_PSPB_Article_like__c';
		String fields = 'Id, BI_PSPB_Reaction__c';
		String conditions =
			'BI_PSPB_CareProgramEnrollee__c = \'' +
			enrolleeId +
			'\' AND ' +
			'BI_PSPB_Article_name__c = \'' +
			escapedArticleName +
			'\' AND ' +
			'(BI_PSPB_Reaction__c = \'' +
			BI_PSPB_InfoCenterConstantCtrl.errorLikeLabel +
			'\' OR ' +
			'BI_PSPB_Reaction__c = \'' +
			BI_PSPB_InfoCenterConstantCtrl.errorDislikeLabel +
			'\')';
		Boolean withUserMode = false;

		List<SObject> results = BI_PSP_CommonQueryUtility.executeQuery(
			sObjectType,
			fields,
			conditions,
			withUserMode
		);
		return (List<BI_PSPB_Article_like__c>) results;
	}

	/**
	 * Processes an existing reaction based on the new reaction value.
	 *
	 * @description Updates or deletes the existing reaction based on the new reaction value.
	 * @param reaction The existing reaction record.
	 * @param newReaction The new reaction value.
	 */
	private static void processExistingReaction(
		BI_PSPB_Article_like__c reaction,
		String newReaction
	) {
		if (newReaction == BI_PSPB_InfoCenterConstantCtrl.errorLikeLabel) {
			updateReactionRecord(reaction, newReaction);
		} else if (
			newReaction == BI_PSPB_InfoCenterConstantCtrl.errorDislikeLabel
		) {
			deleteReactionRecord(new List<BI_PSPB_Article_like__c>{ reaction });
		}
	}

	/**
	 * Inserts a new reaction (like or view) into the database.
	 *
	 * @description Creates and inserts a new reaction record based on the reaction type.
	 * @param articleName The name of the article.
	 * @param reaction The reaction type (like or view).
	 * @param enrolleeId The enrollee ID of the user.
	 */
	private static void insertNewReaction(
		String articleName,
		String reaction,
		Id enrolleeId
	) {
		if (reaction == BI_PSPB_InfoCenterConstantCtrl.errorLikeLabel) {
			insertLikeRecord(articleName, reaction, enrolleeId);
		} else if (reaction == BI_PSPB_InfoCenterConstantCtrl.viewLabel) {
			insertViewRecord(articleName, reaction, enrolleeId);
		}
	}

	/**
	 * Updates the reaction record with a new reaction value.
	 *
	 * @description Updates an existing reaction record in the database.
	 * @param record The existing reaction record.
	 * @param reaction The new reaction value.
	 */
	private static void updateReactionRecord(
		BI_PSPB_Article_like__c record,
		String reaction
	) {
		record.BI_PSPB_Reaction__c = reaction;
		BI_PSP_DatabaseOperationsUtility.updateOperation(
			new List<BI_PSPB_Article_like__c>{ record },
			BI_PSPB_ArticleLikeCtrl.class.toString(),
			false
		);
	}

	/**
	 * Deletes reaction records from the database.
	 *
	 * @description Deletes the specified reaction records from the database.
	 * @param records A list of reaction records to delete.
	 */
	private static void deleteReactionRecord(
		List<BI_PSPB_Article_like__c> records
	) {
		BI_PSP_DatabaseOperationsUtility.deleteOperation(
			records,
			BI_PSPB_ArticleLikeCtrl.class.toString(),
			False
		);
	}

	/**
	 * Inserts a new like record into the database.
	 *
	 * @description Creates and inserts a new like reaction record.
	 * @param articleName The name of the article.
	 * @param reaction The reaction type (like).
	 * @param enrolleeId The enrollee ID of the user.
	 */
	private static void insertLikeRecord(
		String articleName,
		String reaction,
		Id enrolleeId
	) {
		BI_PSPB_Article_like__c likeRecord = new BI_PSPB_Article_like__c(
			BI_PSPB_Article_name__c = articleName,
			BI_PSPB_Reaction__c = reaction,
			BI_PSPB_CareProgramEnrollee__c = enrolleeId
		);
		BI_PSP_DatabaseOperationsUtility.insertOperation(
			new List<BI_PSPB_Article_like__c>{ likeRecord },
			BI_PSPB_ArticleLikeCtrl.class.toString(),
			false
		);
	}

	/**
	 * Inserts a new view record into the database.
	 *
	 * @description Creates and upserts a new view reaction record.
	 * @param articleName The name of the article.
	 * @param reaction The reaction type (view).
	 * @param enrolleeId The enrollee ID of the user.
	 */
	private static void insertViewRecord(
		String articleName,
		String reaction,
		Id enrolleeId
	) {
		BI_PSPB_Article_like__c viewRecord = new BI_PSPB_Article_like__c(
			BI_PSPB_Article_name__c = articleName,
			BI_PSPB_Reaction__c = reaction,
			BI_PSPB_CareProgramEnrollee__c = enrolleeId
		);
		//UPSERT
		BI_PSP_DatabaseOperationsUtility.upsertOperation(
			new List<BI_PSPB_Article_like__c>{ viewRecord },
			BI_PSPB_ArticleLikeCtrl.class.toString(),
			false
		);
	}
}