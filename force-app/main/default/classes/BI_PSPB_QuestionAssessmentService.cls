/**
* @description  Used to
	create task when a video is uploaded and calling the method to
	send sms and email.
* History
* Version	Author			Date		Detail		Description
* 1.0		Niyas		24-07-2024		Created		Refactored Version
*/
public without sharing class BI_PSPB_QuestionAssessmentService {
	/**
	 * @description  Retrieves treatment reminders based on the given criteria.
	 * @param enrolleeId The ID of the record related to the treatment reminders.
	 * @return A list of BI_PSPB_Treatment_Reminder__c objects that match the criteria.
	 */
	public static Map<Id, Map<String, String>> getEnrolleeRecIdToAssessmentNamesMap(
		String enrolleeId
	) {
		Map<Id, Map<String, String>> enrolleeRecIdToAssessmentNamesMap = new Map<Id, Map<String, String>>();
        try {
			if (String.isBlank(enrolleeId)) {
				BI_PSP_LogMessagesUtility.logError(
					BI_PSPB_NotificationConstantsCtrl.errorMsgRecordNotFound,
					BI_PSPB_QuestionAssessmentService.class.toString(),
					true,
					BI_PSPB_NotificationConstantsCtrl.severityError
				);
			}           
            String fields = 'Id, Name, BI_PSP_CareProgramEnrollee__c, AssessmentStatus, AssessmentRating';
		    String conditions = 'BI_PSP_CareProgramEnrollee__c = \'' + enrolleeId + '\' ' +
			   'AND (Name = \'' + BI_PSPB_NotificationConstantsCtrl.dlqiQuestionName + '\' ' +
               'OR Name = \'' + BI_PSPB_NotificationConstantsCtrl.pssQuestionName + '\' ' +
               'OR Name = \'' + BI_PSPB_NotificationConstantsCtrl.wpaiQuestionName + '\' ' +
               'OR Name = \'' + BI_PSPB_NotificationConstantsCtrl.qsqQuestionName + '\' ' +
               'OR Name = \'' + BI_PSPB_NotificationConstantsCtrl.questionnaireRecordName + '\') ' ;
	   		List<SObject> results = BI_PSP_CommonQueryUtility.executeQuery('Assessment', fields, conditions, false);
			for (SObject record : results) {
				// Check if the record contains a non-null AssessmentRating__c and compare
                Object assessmentRating = record.get('AssessmentRating');
                if (assessmentRating != null && assessmentRating.equals(BI_PSPB_NotificationConstantsCtrl.assessmentRating)) {
                    Id enrolleeRecordId = (Id)record.get('BI_PSP_CareProgramEnrollee__c');
                    if (!enrolleeRecIdToAssessmentNamesMap.containsKey(enrolleeRecordId)) {
                        enrolleeRecIdToAssessmentNamesMap.put(enrolleeRecordId, new Map<String, String>());
                    }
                    enrolleeRecIdToAssessmentNamesMap.get(enrolleeRecordId)
                        .put((String)record.get('Name'), (String)record.get('Name'));
                }
			}
		} catch (Exception ex) {
			BI_PSP_LogMessagesUtility.exceptionLogMessage(
                ex.getMessage(),
                BI_PSPB_QuestionAssessmentService.class.getName(),
                ex
            );
		}
		return enrolleeRecIdToAssessmentNamesMap;
	}
}