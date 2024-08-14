/**
 * @description  Used to create task when a video is uploaded and calling the method to send sms and email.
 * History
 * Version    Author        Date        Detail        Description
 * 1.0        Niyas        24-07-2024        Created        Refactored Version
 */
public without sharing class BI_PSPB_QuestionTaskService {
	/**
	 * @description  Retrieves treatment reminders based on the given criteria.
	 * @param enrolleeRecIdToAssessmentNamesMap The ID of the record related to the treatment reminders.
	 * @return A list of BI_PSPB_Treatment_Reminder__c objects that match the criteria.
	 */
	public static List<Task> getTasksToUpdate(
		Map<Id, Map<String, String>> enrolleeRecIdToAssessmentNamesMap
	) {
		List<Task> tasksToUpdate = new List<Task>();
		try {
			// Extract keys from the map to create a List<Id>
			List<Id> assessmentIdList = new List<Id>(
				enrolleeRecIdToAssessmentNamesMap.keySet()
			);
			List<Task> taskRecords = queryTasks(assessmentIdList);
			for (Task taskToUpdate : taskRecords) {
				if (
					shouldUpdateTask(
						taskToUpdate,
						enrolleeRecIdToAssessmentNamesMap
					)
				) {
					taskToUpdate.Status = BI_PSPB_NotificationConstantsCtrl.notificationStatusComplete;
					tasksToUpdate.add(taskToUpdate);
				}
			}
		} catch (Exception ex) {
			BI_PSP_LogMessagesUtility.exceptionLogMessage(
                ex.getMessage(),
                BI_PSPB_QuestionTaskService.class.getName(),
                ex
            );
		}
		return tasksToUpdate;
	}

	/**
	 * @description  Retrieves treatment reminders based on the given criteria.
	 * @param assessmentIdList The ID of the record related to the treatment reminders.
	 * @return A list of BI_PSPB_Treatment_Reminder__c objects that match the criteria.
	 */
	private static List<Task> queryTasks(List<Id> assessmentIdList) {
		// Convert List<Id> to a comma-separated string for the query
		String conditionIds =
			'(\'' +
			String.join(assessmentIdList, '\', \'') +
			'\')';
		String fields = 'Id, Status, BI_PSP_Category__c, WhatId';
		String conditions =
			'WhatId IN ' +
			conditionIds +
			' ' +
			'AND Status = \'' +
			BI_PSPB_NotificationConstantsCtrl.taskStatusAction +
			'\' ' +
			'AND (BI_PSP_Category__c = \'' +
			BI_PSPB_NotificationConstantsCtrl.pss +
			'\' ' +
			'OR BI_PSP_Category__c = \'' +
			BI_PSPB_NotificationConstantsCtrl.wpai +
			'\' ' +
			'OR BI_PSP_Category__c = \'' +
			BI_PSPB_NotificationConstantsCtrl.dlqi +
			'\' ' +
			'OR BI_PSP_Category__c = \'' +
			BI_PSPB_NotificationConstantsCtrl.actionTypeQuestionnaires +
			'\' ' +
			'OR BI_PSP_Category__c = \'' +
			BI_PSPB_NotificationConstantsCtrl.qsq +
			'\')';

		// Execute query and return results as List<Task>
		List<SObject> results = BI_PSP_CommonQueryUtility.executeQuery(
			'Task',
			fields,
			conditions,
			false
		);
		return (List<Task>) results; // Cast results to List<Task>
	}

	/**
	 * @description  Retrieves treatment reminders based on the given criteria.
	 * @param taskToUpdate The ID of the record related to the treatment reminders.
	 * @param enrolleeRecIdToAssessmentNamesMap The ID of the record related to the treatment reminders.
	 * @return A list of BI_PSPB_Treatment_Reminder__c objects that match the criteria.
	 */
	private static Boolean shouldUpdateTask(
		Task taskToUpdate,
		Map<Id, Map<String, String>> enrolleeRecIdToAssessmentNamesMap
	) {
		Map<String, String> assessmentNames = enrolleeRecIdToAssessmentNamesMap.get(
			taskToUpdate.WhatId
		);
		return (taskToUpdate.BI_PSP_Category__c ==
			BI_PSPB_NotificationConstantsCtrl.dlqi &&
			assessmentNames.containsKey(
				BI_PSPB_NotificationConstantsCtrl.dlqiQuestionName
			)) ||
			(taskToUpdate.BI_PSP_Category__c ==
			BI_PSPB_NotificationConstantsCtrl.pss &&
			assessmentNames.containsKey(
				BI_PSPB_NotificationConstantsCtrl.pssQuestionName
			)) ||
			(taskToUpdate.BI_PSP_Category__c ==
			BI_PSPB_NotificationConstantsCtrl.wpai &&
			assessmentNames.containsKey(
				BI_PSPB_NotificationConstantsCtrl.wpaiQuestionName
			)) ||
			(taskToUpdate.BI_PSP_Category__c ==
			BI_PSPB_NotificationConstantsCtrl.qsq &&
			assessmentNames.containsKey(
				BI_PSPB_NotificationConstantsCtrl.qsqQuestionName
			)) ||
			(taskToUpdate.BI_PSP_Category__c ==
			BI_PSPB_NotificationConstantsCtrl.actionTypeQuestionnaires &&
			assessmentNames.containsKey(
				BI_PSPB_NotificationConstantsCtrl.questionnaireRecordName
			));
	}
}