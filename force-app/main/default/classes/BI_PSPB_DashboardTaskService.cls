/**
 * @description To send email when a post is being created.
 * History
 * Version	Author			Date		Detail		Description
 * 1.0		Niyas		24-07-2024		Created		Refactored Version
 */
public class BI_PSPB_DashboardTaskService {
	/**
	 * @description  Retrieves treatment reminders based on the given criteria.
	 * @param relatedIds The ID of the record related to the treatment reminders.
	 * @return A list of BI_PSPB_Treatment_Reminder__c objects that match the criteria.
	 */
	public static List<Task> getGetTopNotificationTasks(Set<Id> relatedIds) {
		String conditionIds = '(\'' + String.join(relatedIds, '\', \'') + '\')';
		String fields = 'Id, Subject, CreatedDate, Status, BI_PSP_ChatterFeedId__c, BI_PSP_Category__c, BI_PSP_ChatterType__c, BI_PSP_Notification_Type__c';
		String conditions =
			'WhatId IN ' +
			conditionIds +
			' ' +
			'AND (BI_PSP_Notification_Type__c = \'' +
			BI_PSPB_NotificationConstantsCtrl.actionTypeAction +
			'\' ' +
            /*
			'OR BI_PSP_Notification_Type__c = \'' +
			BI_PSPB_NotificationConstantsCtrl.actionTypeGeneral +
			'\') ' +
			'AND (Status = \'' +
			BI_PSPB_NotificationConstantsCtrl.actionTypeUnRead +
			'\' ' +*/
			'OR Status = \'' +
			BI_PSPB_NotificationConstantsCtrl.actionTypeNotificatonTypeAction +
			'\') ORDER BY CreatedDate DESC ';

		// Execute query and return results as List<Task>
		List<SObject> results = BI_PSP_CommonQueryUtility.executeQuery(
			'Task',
			fields,
			conditions,
			false
		);
		return results;
	}
}