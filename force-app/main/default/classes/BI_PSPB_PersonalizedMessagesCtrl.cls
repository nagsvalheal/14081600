/**
* @description This class is used to retrieve personalized messages based on
 Let's Personalize questionnaires responses.
* History:
* Version	Author			Date			Detail				Description
* 1.0		Gokul Krishnan	05-Nov-2023		Created				Initial development
* 1.1		Gokul Krishnan 	05-Feb-2024		Updated				Updated the patient status retrieve
* 1.2		Gokul Krishnan	04-Apr-2024		Updated				Catch log added
* 1.3 		Gokul Krishnan 	10-Jul-2024		Refactored			Refactored the logic of messages and articles retrieve
*/

public with sharing class BI_PSPB_PersonalizedMessagesCtrl {
	/**
 * @description   Get the personalized messages by given category
  				  return in lwc biPspbArticleContentAvatar, biPspbWelcomeAvatar
 * @param         category - String indicating the category of messages to retrieve
 * @return        List<String> - List of personalized messages for the specified category
 */

	@AuraEnabled(cacheable=true)
	public static List<String> getCategoryMessages(String category) {
		List<String> messagesList = new List<String>();
		try {
			String categoryToUse = String.isBlank(category)
				? BI_PSPB_PersonalizationConstantCtrl.generalMessageCategory
				: category;
			String sObjectType = 'BI_PSP_Personalized_messages__c';
			String fields = 'BI_PSP_Message_body__c';
			String conditions =
				'BI_PSP_Category__c = \'' +
				categoryToUse +
				'\'';
			Boolean withUserMode = true;

			List<BI_PSP_Personalized_messages__c> messages = BI_PSP_CommonQueryUtility.executeQuery(
				sObjectType,
				fields,
				conditions,
				withUserMode
			);

			for (BI_PSP_Personalized_messages__c message : messages) {
				messagesList.add(message.BI_PSP_Message_body__c);
			}

			if (messagesList.isEmpty()) {
				throw new AuraHandledException(
					BI_PSPB_PersonalizationConstantCtrl.errorPersonalizedMessagesRetrieve
				);
			}
		} catch (Exception ex) {
			BI_PSP_LogMessagesUtility.exceptionLogMessage(
				BI_PSPB_PersonalizationConstantCtrl.errorPersonalizedMessagesRetrieve,
				BI_PSPB_PersonalizedMessagesCtrl.class.toString(),
				ex
			);
		}
		return messagesList;
	}
	/**
	* @description   Get personalized messages for the current user based on assessments and the day of the week
					 return in lwc biPspbWelcomeAvatar
	* @return        List<String> containing personalized messages
	*/

	@AuraEnabled(cacheable=true)
	public static List<String> fetchPersonalizedMessages() {
		List<String> personalizedMessagesList = new List<String>();
		try {
			List<Assessment> assessments = BI_PSP_CaregiverAndPatientCtrl.getAssessmentsByCurrentUserName(
				BI_PSPB_PersonalizationConstantCtrl.introductionQuestionaire
			);
			DateTime todayDate = (DateTime) System.now();
			String dayOfWeek = todayDate.format('E');

			// Get day-specific messages
			personalizedMessagesList.addAll(getDaySpecificMessages(dayOfWeek));

			if (!assessments.isEmpty()) {
				// User mode is not enabled because AssessmentQuestionResponse is health cloud object
				String sObjectType = 'AssessmentQuestionResponse';
				String fields = 'ResponseText, AssessmentQuestion.QuestionText';
				String conditions =
					'AssessmentId = \'' +
					assessments[0].Id +
					'\'';
				Boolean withUserMode = false;
				List<AssessmentQuestionResponse> assessmentResponses = BI_PSP_CommonQueryUtility.executeQuery(
					sObjectType,
					fields,
					conditions,
					withUserMode
				);

				Set<String> filteredResponses = new Set<String>();
				for (
					AssessmentQuestionResponse response : assessmentResponses
				) {
					String questionName = response.AssessmentQuestion.QuestionText;
					String answer = response.ResponseText;
					Map<String, String> answerCategoryMap = BI_PSPB_PersonalizationConstantCtrl.questionResponseCategoryMap.get(
						questionName
					);
					if (answerCategoryMap != null) {
						String category = answerCategoryMap.get(answer);
						filteredResponses.add(
							String.isNotBlank(category) ? category : null
						);
						filteredResponses.remove(null);
					}
				}

				List<String> personalizedMessages = getMessages(
					filteredResponses
				);
				personalizedMessagesList.addAll(personalizedMessages);
			}
		} catch (Exception ex) {
			BI_PSP_LogMessagesUtility.exceptionLogMessage(
				BI_PSPB_PersonalizationConstantCtrl.errorNoAssessment,
				BI_PSPB_PersonalizedMessagesCtrl.class.toString(),
				ex
			);
		}
		return personalizedMessagesList;
	}

	/**
	 * @description     Retrieve Personalized messages based on the day of the week
	 * @param			dayOfWeek - String value of the day of the week
	 * @return          List<String> of personalized messages
	 */
	@TestVisible
	private static List<String> getDaySpecificMessages(String dayOfWeek) {
		List<String> daySpecificMessagesList = new List<String>();
		if (
			dayOfWeek == BI_PSPB_PersonalizationConstantCtrl.fri ||
			dayOfWeek == BI_PSPB_PersonalizationConstantCtrl.mon
		) {
			String sObjectType = 'BI_PSP_Personalized_messages__c';
			String fields = 'BI_PSP_Message_body__c';
			String conditions =
				'BI_PSP_Category__c = \'' +
				BI_PSPB_PersonalizationConstantCtrl.mondayFridayCategory +
				'\'';
			Boolean withUserMode = true;
			List<BI_PSP_Personalized_messages__c> dayMessages = BI_PSP_CommonQueryUtility.executeQuery(
				sObjectType,
				fields,
				conditions,
				withUserMode
			);

			for (BI_PSP_Personalized_messages__c message : dayMessages) {
				if (
					dayOfWeek == BI_PSPB_PersonalizationConstantCtrl.fri &&
					message.BI_PSP_Message_body__c.contains(
						BI_PSPB_PersonalizationConstantCtrl.friday
					)
				) {
					daySpecificMessagesList.add(message.BI_PSP_Message_body__c);
				}
				if (
					dayOfWeek == BI_PSPB_PersonalizationConstantCtrl.mon &&
					message.BI_PSP_Message_body__c.containsIgnoreCase(
						BI_PSPB_PersonalizationConstantCtrl.monday
					)
				) {
					daySpecificMessagesList.add(message.BI_PSP_Message_body__c);
				}
			}
		}
		return daySpecificMessagesList;
	}

	/**
	 * @description     Retrieve Personalized messages based on the category
	 * @param			categories - set of categories based on the assessment response
	 * @return          List<String> of personalized messages
	 */
	private static List<String> getMessages(Set<String> categories) {
		Set<String> messagesList = new Set<String>();
		for (String category : categories) {
			messagesList.addAll(getCategoryMessages(category));
		}
		return new List<String>(messagesList);
	}
}