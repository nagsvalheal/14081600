/**
 * @description To send email when a post is being created.
 * History
 * Version	Author			Date		Detail		Description
 * 1.0		Niyas		24-07-2024		Created		Refactored Version
 */
public with sharing class BI_PSPB_TaskRecordCtrl {
	/**
	 * @description This method is used for general insite notification checking for sending symptomtracker, challenges,
	 * and community SMS, Email, and Insite Notification.
	 * @param newTasks The list of Task records being inserted.
	 */
	public static void handleAfterInsert(List<Task> newTasks) {
		try {
			if (!newTasks.isEmpty()) {
				Task singleTask = newTasks[0];
				List<Id> recordId = new List<Id>{ singleTask.WhatId };
				List<String> communityUserName = new List<String>{
					singleTask.BI_PSP_CommunityUserName__c
				};

				String category = singleTask.BI_PSP_Category__c;
				String notificationType = singleTask.BI_PSP_Notification_Type__c;
				String chatterType = singleTask.BI_PSP_ChatterType__c;

				List<SObject> enrolleeRecords = BI_PSPB_TaskEnrolleeQueryCtrl.fetchEnrolleeRecords(
					recordId
				);
				if (enrolleeRecords.isEmpty()) {
					BI_PSP_LogMessagesUtility.logError(
					BI_PSPB_NotificationConstantsCtrl.errorMsgRecordNotFound,
					BI_PSPB_TaskRecordCtrl.class.toString(),
					false,
					BI_PSPB_NotificationConstantsCtrl.severityError
				);
				} else {
                    BI_PSPB_NotificationContext params = new BI_PSPB_NotificationContext(
								category,
								notificationType,
                        		chatterType,
                        		communityUserName,
								recordId
							);
							BI_PSPB_TaskNotificationHandler.handleNotifications(
								enrolleeRecords,
								params
							);
				}
			} else {
				BI_PSP_LogMessagesUtility.logError(
					BI_PSPB_NotificationConstantsCtrl.errorMsgRecordNotFound,
					BI_PSPB_TaskRecordCtrl.class.toString(),
					false,
					BI_PSPB_NotificationConstantsCtrl.severityError
				);
			}
		} catch (Exception ex) {
			BI_PSP_LogMessagesUtility.exceptionLogMessage(
				ex.getMessage(),
				BI_PSPB_TaskRecordCtrl.class.getName(),
				ex
			);
		}
	}
}