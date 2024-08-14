/*
@description       This Apex class is responsible for retrieving assessments based on the 
				   current user's role (caregiver or patient).It determines the user's role based
				   on their profile and retrieves the latest assessment for the specified category.
* History:
* Version	Author		Date			Detail			Description
* 1.0		Harish		05-Dec-2023		Created			Initial development.
* 1.1		Harish 	    01-Jan-2024		Updated			Updated for caregiver.
* 1.2		Abinsha		04-Apr-2024		Updated			Catch log added.
*/
public with sharing class BI_PSP_CaregiverAndPatientCtrl {
	// Holds the Care Program Enrollee ID.
	private static string enrolleeId;
	/**
     * @description Retrieves the latest assessment for the specified category based on the current
     * user's role (caregiver or patient).we are using this apex class in LWCs such as cards,Questionnaire
				  biPspbQualitativeCompletedQuestionnaire2,  biPspbQualitativeCompletedQuestionnaire,
				  biPspbWapiCompletedQuestionnaire,biPspbPSSCompletedQuestionnaires, 
				  biPspbDlqiCompletedQuestionnaire.
     * @param categoryname The name of the assessment category.
     * @return List of assessments matching the specified category for the current user.
     */
	@AuraEnabled(cacheable=true)
	public static List<Assessment> getAssessmentsByCurrentUserName(String categoryname) {
		List<Assessment> assessments = new List<Assessment>();
		try {
			enrolleeId = BI_PSP_CurrentUser.getEnrolleeRecords()[0].id;
			if (!String.isBlank(enrolleeId)) {
				BI_PSP_LogMessagesUtility.logError(
					BI_PSP_QuestionnaireConstant.emptyEnrolleRecrd,
					BI_PSP_CaregiverAndPatientCtrl.class.toString(),
					false,
					BI_PSP_QuestionnaireConstant.LOG_SEVERITY_ERROR
				);
			}
			// Prepare the fields and conditions for the query
			String sObjectType = 'Assessment';
			String fields =
				'Id, Name, AssessmentStatus, EffectiveDateTime, ExpirationDateTime, ' +
				'BI_PSP_StatusForPersonalization__c, BI_PSP_RolloutforCompletedQuestionnarie__c';
			String conditions =
				'BI_PSP_CareProgramEnrollee__c = \'' +
				enrolleeId +
				'\' AND Name = \'' +
				categoryname +
				'\'';
			String orderByClause = 'ORDER BY EffectiveDateTime DESC';
			String limitClause = 'LIMIT 1';

			Boolean withUserMode = false; // Set to true if user mode security is needed

			// Execute the query using the common query method
			List<SObject> result = BI_PSP_CommonQueryUtility.executeQuery(
				sObjectType,
				fields,
				conditions + ' ' + orderByClause + ' ' + limitClause,
				withUserMode
			);

			if (!result.isEmpty()) {
				assessments = (List<Assessment>) result;
			} else {
				BI_PSP_LogMessagesUtility.logError(
					BI_PSP_QuestionnaireConstant.emptyAssesment,
					BI_PSP_CaregiverAndPatientCtrl.class.toString(),
					false,
					BI_PSP_QuestionnaireConstant.LOG_SEVERITY_ERROR
				);
			}
		} catch (Exception ex) {
			BI_PSP_LogMessagesUtility.exceptionLogMessage(
				BI_PSP_QuestionnaireConstant.emptyEnrollerecrd,
				BI_PSP_CaregiverAndPatientCtrl.class.toString(),
				ex
			);
		}
		return assessments;
	}
}