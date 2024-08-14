/**
* @description Used to send and display all insite notification
* History
* Version	Author			Date		Detail		Description
* 1.0		Niyas		24-07-2024		Created		Refactored Version
*/
public without sharing class BI_PSPB_MessageCenterCtrl {
	/**
	* @description Fetching all general notifications for an enrollee.
	* @return Returning all general notifications.
	*/
    @AuraEnabled(cacheable=true)
	public static List<Task> getGeneralNotifyRecords() {
		List<Task> generalNotifications = new List<Task>();
		try {
            String enroleeId = BI_PSP_CurrentUser.getEnrolleeRecords()[0].id;
				generalNotifications = getNotifyRecords(
				enroleeId,
				BI_PSPB_NotificationConstantsCtrl.actionTypeGeneral,
				BI_PSPB_NotificationConstantsCtrl.actionTypeUnRead
			);
		} catch (Exception ex) {
			BI_PSP_LogMessagesUtility.exceptionLogMessage(
            ex.getMessage(),
            BI_PSPB_MessageCenterCtrl.class.toString(),
            ex
        );
		}
		return generalNotifications;
	}

	/**
	* @description Fetching all action notifications.
	* @return Returning all the action notifications.
	*/
    @AuraEnabled(cacheable=true)
	public static List<Task> getActionNotifyRecords() {
		List<Task> actionNotifications = new List<Task>();
		try {
            String enroleeId = BI_PSP_CurrentUser.getEnrolleeRecords()[0].id;
				actionNotifications = getNotifyRecords(
				enroleeId,
				BI_PSPB_NotificationConstantsCtrl.actionTypeAction,
				BI_PSPB_NotificationConstantsCtrl.actionTypeNotificatonTypeAction
				);
		} catch (Exception ex) {
			BI_PSP_LogMessagesUtility.exceptionLogMessage(
            ex.getMessage(),
            BI_PSPB_MessageCenterCtrl.class.toString(),
            ex
        );
		}
		return actionNotifications;
	}

	/**
	* @description Fetching all history notifications.
	* @return Returning history notifications.
	*/
    @AuraEnabled(cacheable=true)
	public static List<Task> getHistoryNotifyRecords() {
	List<Task> historyNotifications = new List<Task>();
	try {
        String enroleeId = BI_PSP_CurrentUser.getEnrolleeRecords()[0].id;
			historyNotifications = getNotificationRecords(
			enroleeId,
			null,
			null,
			true
			);
	} catch (Exception ex) {
		BI_PSP_LogMessagesUtility.exceptionLogMessage(
            ex.getMessage(),
            BI_PSPB_MessageCenterCtrl.class.toString(),
            ex
        );
	}
	return historyNotifications;
  }
	/**
	* @description Fetching all notifications.
	* @param enroleeId Enrollee Id of the logged in user.
	* @param notificationType Type of notification.
	* @param status Status of the notification.
	* @param isHistory Checking whether notification is history.
	* @return Returning all notification records.
	*/
	private static List<Task> getNotificationRecords(
    String enroleeId,
    String notificationType,
    String status,
    Boolean isHistory
) {
    List<SObject> relatedTasks = new List<SObject>();
    try {
        // Query to get related treatment records
        List<BI_PSPB_Treatment_Reminder__c> relatedTasksTreatmentRecords = getTreatmentReminders(enroleeId);
        Set<Id> careProgramEnrolleeIds = new Set<Id>();
            careProgramEnrolleeIds.add(enroleeId);
            for (BI_PSPB_Treatment_Reminder__c reminder : relatedTasksTreatmentRecords) {
                careProgramEnrolleeIds.add(reminder.Id);
            }
        // Validate the enroleeId
        if (String.isBlank(enroleeId)) {
            BI_PSP_LogMessagesUtility.logError(
                BI_PSPB_NotificationConstantsCtrl.errorMsgRecordNotFound,
                BI_PSPB_MessageCenterCtrl.class.toString(),
                true,
                BI_PSPB_NotificationConstantsCtrl.severityError
            );
            return relatedTasks; // Return empty list if enroleeId is blank
        }

        String fields =
            'ActivityDate, Description, WhoId, WhatId, OwnerId, ' +
            'Priority, Status, BI_PSP_ChatterType__c, BI_PSP_Category__c, ' +
            'CreatedDate, Subject, BI_PSPB_Treatment_Type__c, BI_PSP_Notification_Type__c';
        String conditions;
        String conditionIds =
			'(\'' +
			String.join(careProgramEnrolleeIds, '\', \'') +
			'\')';

        // Construct query conditions based on history flag and existence of related records
        if (isHistory) {
            conditions = 'WhatId IN ' + conditionIds + ' ' +
                'AND (Status = \'' + BI_PSPB_NotificationConstantsCtrl.notificationStatusComplete + '\' ' +
                'OR Status = \'' + BI_PSPB_NotificationConstantsCtrl.notificationStatusNotComplete + '\' ' +
                'OR Status = \'' + BI_PSPB_NotificationConstantsCtrl.actionTypeRead + '\' ' +
                'OR Status = \'' + BI_PSPB_NotificationConstantsCtrl.actionTypeNotificationTypeExpired + '\') ' +
                'ORDER BY CreatedDate DESC';
        } else {
            conditions = 'WhatId IN ' + conditionIds + ' ' +
                'AND BI_PSP_Notification_Type__c = \'' + notificationType + '\' ' +
                'AND Status = \'' + status + '\' ' +
                'ORDER BY CreatedDate DESC';
        }

        // Execute the query
        relatedTasks = BI_PSP_CommonQueryUtility.executeQuery(
            'Task',
            fields,
            conditions,
            false
        );
        
    } catch (Exception ex) {
        BI_PSP_LogMessagesUtility.exceptionLogMessage(
            ex.getMessage(),
            BI_PSPB_MessageCenterCtrl.class.toString(),
            ex
        );
    }
    return relatedTasks;
}


	/**
	* @description Calling the method to fetch all the notifications
	* @param enroleeId Enrollee Id of the logged in user.
	* @param notificationType Type of notification.
	* @param status Status of the notification.
	* @return Returning the notification records.
	*/
	private static List<Task> getNotifyRecords(
	String enroleeId,
	String notificationType,
	String status
	) {
	List<Task> notificationRecords = new List<Task>();
	try {
			notificationRecords = getNotificationRecords(
			enroleeId,
			notificationType,
			status,
			false
			);
	} catch (Exception ex) {
		BI_PSP_LogMessagesUtility.exceptionLogMessage(
            ex.getMessage(),
            BI_PSPB_MessageCenterCtrl.class.toString(),
            ex
        );
	}
	return notificationRecords;
	}
    
    /**
	 * @description  Retrieves treatment reminders based on the given criteria.
	 * @param enrolleeId The ID of the record related to the treatment reminders.
	 * @return A list of BI_PSPB_Treatment_Reminder__c objects that match the criteria.
	 */
	public static List<BI_PSPB_Treatment_Reminder__c> getTreatmentReminders(
		Id enrolleeId
	) {
		String fields = 'Id, Name, BI_PSPB_Care_Program_Enrollee__r.Id';
		String conditions =
			'BI_PSPB_Care_Program_Enrollee__r.Id = \'' +
			enrolleeId +
			'\' ';

		// Execute query and return results as List<Task>
		List<SObject> results = BI_PSP_CommonQueryUtility.executeQuery(
			'BI_PSPB_Treatment_Reminder__c',
			fields,
			conditions,
			false
		);
		return (List<BI_PSPB_Treatment_Reminder__c>) results;
	}
}