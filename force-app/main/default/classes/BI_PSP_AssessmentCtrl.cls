/*
* @description       This class provides methods to retrieve questionnaire questions for different categories
                     such as Work & Activity Impairment (WPAI), Introduction, Psoriasis Symptom Scale (PSS), 
                     Dermatology Life Quality Index (DLQI), and Qualitative satisfaction questionnaire.
                     It also includes methods to handle the insertion of assessment records, including completed 
                     assessments and drafts, and methods to get the status of assessments and counts of completed
                     assessments of the current user.
* History:
* Version   Author      Date            Detail          Description.
* 1.0       Abinsha     05-Dec-2023     Created         Initial development.
* 1.1       Abinsha     01-Jan-2024     Updated         Updated for caregiver.
* 1.2       Abinsha     04-Apr-2024     Updated         Catch log added.
*/

public with sharing class BI_PSP_AssessmentCtrl {
	// Stores the ID of the Care Program Enrollee associated with the assessment.
	private static string enrolleeId;
	//variable that holds category
	private static String category;
	//varible that hold the count of answered Questions
	private static Integer answeredQuestions;
	//variable that holds active Questions
	private static Integer activeQuestionCount;
	//Variable that holds the number of assessments
	private static List<Integer> assessmentCounts;
	//Vraible that holds the initial rollout Questionnaire Dates
	private static List<BI_PSP_Questionnaire_Setups__c> questionnairesDate;
	//holds an assessment thats status is completed.
	private static List<Assessment> assessments;
	/**
	 * @Description AuraEnabled method to retrieve the count of answered questions in a category for a given assessment.
	 * Retrieves the category name from the Assessment record based on the provided assessment ID.
	 * Retrieves the count of answered questions in the category from the AssessmentQuestionResponse object.
	 * We use this method in biPspbPSSCompletedQuestionnaires,biPspbPsoriasisCard,biPspbPSSQuestionnaire,biPspbQSQuestionnaire1,
	 * biPspbQSQuestionnaire2,biPspbQualitativeCard,biPspbQualitativeCompletedQuestionnaire,
	 * biPspbQualitativeCompletedQuestionnaire2,biPspbWapiCard,biPspbWapiCompletedQuestionnaire,biPspbWAPIQuestionnaire,
	 * biPspbIntroductionCard,biPspbIntroductionPageone, biPspbIntroductionPagetwo biPspbIntroductionQuestionnaire,
	 * biPspbDlqiCard,biPspbDlqiCompletedQuestionnaire,biPspbDLQIquestionnaire LWC components.
	 * @param assessmentId The ID of the assessment
	 * @return The count of answered questions in the category
	 */

	@AuraEnabled(cacheable=true)
	public static Integer getCategoryStatus(String assessmentId) {
		try {
			// Query to get category from the AssessmentQuestionResponse
			if (assessmentId != null && !String.isBlank(assessmentId)) {
				// USER_MODE is not used because Assessment is an Salesforce Industry object using
				//Healthcare license.
				// Define fields and conditions for the category query
				String categoryFields = 'Name';
				String categoryConditions = 'Id = \'' + assessmentId + '\'';

				// Execute the query to get the category
				List<SObject> categoryResults = BI_PSP_CommonQueryUtility.executeQuery(
					'Assessment',
					categoryFields,
					categoryConditions,
					false // Assuming USER_MODE is not needed for this query
				);
				category = (String) categoryResults[0].get('Name');
			} else {
				BI_PSP_LogMessagesUtility.logError(BI_PSP_QuestionnaireConstant.emptyAssesment,
					BI_PSP_AssessmentCtrl.class.toString(),false,BI_PSP_QuestionnaireConstant.LOG_SEVERITY_ERROR
				);
			}
			// Query to get the count of answered questions in the category
			if (category != null && !String.isBlank(category)) {
				// USER_MODE is not used because AssessmentQuestionResponse is an Salesforce Industry
				//object using Healthcare license.
				// Constructing the dynamic SOQL query
				String query =
					'SELECT COUNT() FROM AssessmentQuestionResponse WHERE AssessmentId = \'' +
					assessmentId +
					'\' AND BI_PSP_Questionnaire_Name__c = \'' +
					category +
					'\'';

				// Using the common method to get the count.
				Boolean withUserMode = false; // Set this to true if you need WITH USER_MODE.
				answeredQuestions = BI_PSP_CommonQueryUtility.getCount(query, withUserMode);
			} else {
				BI_PSP_LogMessagesUtility.logError(
					BI_PSP_QuestionnaireConstant.emptyCategoryName,BI_PSP_AssessmentCtrl.class.toString(),
					false,BI_PSP_QuestionnaireConstant.LOG_SEVERITY_ERROR
				);
			}
		} catch (Exception ex) {
			BI_PSP_LogMessagesUtility.exceptionLogMessage(
				BI_PSP_QuestionnaireConstant.emptyAssesment,
				BI_PSP_AssessmentCtrl.class.toString(),
				ex
			);
		}
		return answeredQuestions;
	}

	/**
	 * @Description AuraEnabled method to retrieve the total count of active questions in a specified category.
	 * Retrieves the count of active questions from the AssessmentQuestionVersion object.
	 * Filters the questions by the provided category name and status 'Active'.
	 * Returns the total count of active questions in the category.
	 * We use this method in biPspbPSSQuestionnaire LWC component.
	 * @param categoryname The name of the category.
	 * @return The total count of active questions in the specified category.
	 */

	@AuraEnabled(cacheable=true)
	public static Integer getTotalquestionscount(String categoryname) {
		try {
			// USER_MODE is not used because AssessmentQuestionVersion is an Salesforce Industry.
			//object using Healthcare license.
			if (categoryname != null && !String.isBlank(categoryname)) {
				// Constructing the dynamic SOQL query
				String query =
					'SELECT COUNT() FROM AssessmentQuestionVersion WHERE status = \'' +
					BI_PSP_QuestionnaireConstant.active +
					'\' AND AssessmentQuestion.QuestionCategory = \'' +
					categoryname +
					'\'';

				// Using the common method to get the count
				Boolean withUserMode = false; // Set this to true if you need WITH USER_MODE
				activeQuestionCount = BI_PSP_CommonQueryUtility.getCount(query, withUserMode);
			} else {
				BI_PSP_LogMessagesUtility.logError(
					BI_PSP_QuestionnaireConstant.emptyCategoryName,
					BI_PSP_AssessmentCtrl.class.toString(),
					false,
					BI_PSP_QuestionnaireConstant.LOG_SEVERITY_ERROR
				);
			}
			if (activeQuestionCount < 0) {
				BI_PSP_LogMessagesUtility.logError(
					BI_PSP_QuestionnaireConstant.emptyQuestionVersion,
					BI_PSP_AssessmentCtrl.class.toString(),
					true,
					BI_PSP_QuestionnaireConstant.LOG_SEVERITY_ERROR
				);
			}
		} catch (Exception ex) {
			BI_PSP_LogMessagesUtility.exceptionLogMessage(
				BI_PSP_QuestionnaireConstant.emptyAssesment,
				BI_PSP_AssessmentCtrl.class.toString(),
				ex
			);
		}
		return activeQuestionCount;
	}

	/**
	 * @Description AuraEnabled method to create a new Assessment record with predefined values.
	 * Creates a new Assessment record with AssessmentStatus set to 'Completed'.
	 * Name set to 'Introduction', and EffectiveDateTime and ExpirationDateTime set to current time and
	 * future expiration date respectively.
	 * Inserts the newly created Assessment record into the database.
	 * If an exception occurs during the process, it is caught, logged, and handled gracefully.
	 * We use this method in All of the Completed Questionnaire Components such as biPspbQualitativeCompletedQuestionnaire2,
	 * biPspbQualitativeCompletedQuestionnaire,biPspbWapiCompletedQuestionnaire,biPspbPSSCompletedQuestionnaires,
	 * biPspbDlqiCompletedQuestionnaire
	 * @return this method returns a list of integers that has the count of number of assessments present for a specific user.
	 */

	@AuraEnabled(cacheable=true)
	public static List<Integer> getAssessmentCountsByCurrentUserName() {
		List<Integer> assessmentCounts = new List<Integer>();
		try {
			// Get the enrollee ID
			String enrolleeId = BI_PSP_CurrentUser.getEnrolleeRecords()[0].Id;

			// Define fields and conditions for the query
			String fields = 'Id, Name, AssessmentStatus, EffectiveDateTime, ExpirationDateTime';
			String conditions =
				'BI_PSP_CareProgramEnrollee__c = \'' +
				enrolleeId +
				'\' AND (AssessmentStatus = \'' +
				BI_PSP_QuestionnaireConstant.completed +
				'\' OR AssessmentStatus = \'' +
				BI_PSP_QuestionnaireConstant.expiredLabel +
				'\')';

			// Execute the query using the common utility
			List<SObject> assessments = BI_PSP_CommonQueryUtility.executeQuery(
				'Assessment',
				fields,
				conditions,
				false // Assuming USER_MODE is not needed for this query
			);

			// Initialize the assessment count map
			Map<String, Integer> assessmentCountMap = new Map<String, Integer>{
				'Work & Activity Impairment (WPAI)' => 0,
				'Psoriasis Symptom Scale (PSS)' => 0,
				'Dermatology Life Quality Index (DLQI)' => 0,
				'Qualitative satisfaction questionnaire' => 0
			};

			// Process the query results
			if (!assessments.isEmpty()) {
				for (SObject obj : assessments) {
					Assessment ass = (Assessment) obj;
					if (assessmentCountMap.containsKey(ass.Name)) {
						assessmentCountMap.put(ass.Name, assessmentCountMap.get(ass.Name) + 1);
					}
				}
			}

			// Convert the map values to a list
			assessmentCounts = new List<Integer>(assessmentCountMap.values());
		} catch (Exception ex) {
			// Log the exception
			BI_PSP_LogMessagesUtility.exceptionLogMessage(
				BI_PSP_QuestionnaireConstant.noEnroleeOrAssessment,
				BI_PSP_AssessmentCtrl.class.toString(),
				ex
			);
		}

		return assessmentCounts;
	}

	/**
	 * @Description Retrieves the counts of completed assessments for the current user.
	 * Queries the database for assessments associated with the current user's Care Program Enrollee ID.
	 * Counts the number of completed assessments for each predefined assessment type.
	 * Returns a list of integers representing the counts of completed assessments for each type.
	 * We use this method in All of the Outstanding Questionnaires.In Component such as biPspbIntroductionQuestionnaire,
	 * biPspbDLQIquestionnaire,biPspbPSSQuestionnaire,biPspbWAPIQuestionnaire,biPspbQSQuestionnaire1,biPspbQSQuestionnaire2.
	 * @return List<Integer> A list of integers representing the counts of completed assessments for each predefined
	 * assessment type.
	 */
	@AuraEnabled(cacheable=true)
	public static List<Integer> getCompletedAssessmentCountsByCurrentUserName() {
		List<Integer> assessmentCounts = new List<Integer>();
		try {
			// Get the enrollee ID
			String enrolleeId = BI_PSP_CurrentUser.getEnrolleeRecords()[0].Id;

			// Define fields and conditions for the query
			String fields = 'Id, Name, AssessmentStatus, EffectiveDateTime, ExpirationDateTime';
			String conditions =
				'BI_PSP_CareProgramEnrollee__c = \'' +
				enrolleeId +
				'\' AND AssessmentStatus = \'' +
				BI_PSP_QuestionnaireConstant.completed +
				'\'';

			List<SObject> assessments = BI_PSP_CommonQueryUtility.executeQuery(
				'Assessment',
				fields,
				conditions,
				false // Assuming USER_MODE is not needed for this query
			);
			// Initialize the assessment count map
			Map<String, Integer> assessmentCountMap = new Map<String, Integer>{
				'Work & Activity Impairment (WPAI)' => 0,
				'Psoriasis Symptom Scale (PSS)' => 0,
				'Dermatology Life Quality Index (DLQI)' => 0,
				'Qualitative satisfaction questionnaire' => 0
			};

			// Process the query results
			if (!assessments.isEmpty()) {
				for (SObject obj : assessments) {
					Assessment ass = (Assessment) obj;
					if (assessmentCountMap.containsKey(ass.Name)) {
						assessmentCountMap.put(ass.Name, assessmentCountMap.get(ass.Name) + 1);
					}
				}
			}

			// Convert the map values to a list
			assessmentCounts = new List<Integer>(assessmentCountMap.values());
			if (assessmentCounts.isEmpty()) {
				BI_PSP_LogMessagesUtility.logError(
					BI_PSP_QuestionnaireConstant.emptyAssesment,
					BI_PSP_AssessmentCtrl.class.toString(),
					true,
					BI_PSP_QuestionnaireConstant.LOG_SEVERITY_ERROR
				);
			}
		} catch (Exception ex) {
			// Log the exception
			BI_PSP_LogMessagesUtility.exceptionLogMessage(
				BI_PSP_QuestionnaireConstant.noEnroleeOrAssessment,
				BI_PSP_AssessmentCtrl.class.toString(),
				ex
			);
			throw new AuraHandledException(
				'An error occurred while retrieving completed assessment counts: ' + ex.getMessage()
			);
		}
		return assessmentCounts;
	}

	/**
	 * @Description Retrieves the rollout dates of questionnaires for the current user's care program enrollee.
	 * Queries the database for the current user's care program enrollee ID based on whether the user is a caregiver or not.
	 * Retrieves the rollout dates of questionnaires associated with the care program enrollee.
	 * We use this method in All the Questionnaire Cards in the Outastnding Questionnaire Page.
	 * @return List<BI_PSP_Questionnaire_Setups__c> A list of BI_PSP_Questionnaire_Setups__c records containing the rollout
	 * dates of questionnaires.
	 */

	@AuraEnabled(cacheable=true)
	public static List<BI_PSP_Questionnaire_Setups__c> getRolloutdate() {
		try {
			enrolleeId = BI_PSP_CurrentUser.getEnrolleeRecords()[0].Id;

			/*USER_MODE is not used because we have populated a lookup field thats related to CareProgramEnrollee
			 * which is a Salesforce Industry object using Healthcare license.*/
			// Define the fields and conditions for the query
			String fields = 'Id, Name, BI_PSP_DLQI_RollOutDate__c, BI_PSP_PSS_RollOutDate__c, BI_PSP_WAI_RollOutDate__c';
			String conditions = 'BI_PSP_CareProgramEnrollee__c = \'' + enrolleeId + '\'';

			// Execute the query using the common utility
			questionnairesDate = (List<BI_PSP_Questionnaire_Setups__c>) BI_PSP_CommonQueryUtility.executeQuery(
				'BI_PSP_Questionnaire_Setups__c',
				fields,
				conditions,
				false // Assuming USER_MODE is not needed for this query
			);
		} catch (Exception ex) {
			BI_PSP_LogMessagesUtility.exceptionLogMessage(
				BI_PSP_QuestionnaireConstant.noEnroleeOrAssessment,
				BI_PSP_AssessmentCtrl.class.toString(),
				ex
			);
		}
		return questionnairesDate;
	}
}