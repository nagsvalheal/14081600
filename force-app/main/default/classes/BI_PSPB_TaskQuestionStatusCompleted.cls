/**
* @description  Used to
	create task when a video is uploaded and calling the method to
	send sms and email.
* History
* Version	Author			Date		Detail		Description
* 1.0		Niyas		24-07-2024		Created		Refactored Version
*/
public with sharing class BI_PSPB_TaskQuestionStatusCompleted {
	/**
	 * @description  Retrieves treatment reminders based on the given criteria.
	 * @param enrolleeId The ID of the record related to the treatment reminders.
	 * @return A list of BI_PSPB_Treatment_Reminder__c objects that match the criteria.
	 */
	@AuraEnabled
	public static List<Task> markTaskQuestionCompleted() {
		List<Task> tasksToUpdate = new List<Task>();
		try {
            String enrolleeId = BI_PSP_CurrentUser.getEnrolleeRecords()[0].id;
			Map<Id, Map<String, String>> enrolleeRecIdToAssessmentNamesMap = BI_PSPB_QuestionAssessmentService.getEnrolleeRecIdToAssessmentNamesMap(
				enrolleeId
			);
			tasksToUpdate = BI_PSPB_QuestionTaskService.getTasksToUpdate(
				enrolleeRecIdToAssessmentNamesMap
			);
			if (!tasksToUpdate.isEmpty()) {
				BI_PSP_DatabaseOperationsUtility.updateOperation(
					tasksToUpdate,
					BI_PSPB_TaskQuestionStatusCompleted.class.toString(),
					false
				);
			} else {
				BI_PSP_LogMessagesUtility.logError(
					BI_PSPB_NotificationConstantsCtrl.errorMsgRecordNotFound,
					BI_PSPB_TaskQuestionStatusCompleted.class.toString(),
					false,
					BI_PSPB_NotificationConstantsCtrl.severityError
				);
			}
		} catch (Exception ex) {
			BI_PSP_LogMessagesUtility.exceptionLogMessage(
                ex.getMessage(),
                BI_PSPB_TaskQuestionStatusCompleted.class.getName(),
                ex
            );
		}
		return tasksToUpdate;
	}
}