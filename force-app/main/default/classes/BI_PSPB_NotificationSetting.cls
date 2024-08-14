/**
* @description  Used to
	create task when a video is uploaded and calling the method to
	send sms and email.
* History
* Version	Author			Date		Detail		Description
* 1.0		Niyas		24-07-2024		Created		Refactored Version
*/
public with sharing class BI_PSPB_NotificationSetting {
	/**
	 * @description  Retrieves treatment reminders based on the given criteria.
	 * @param accountRec The ID of the record related to the treatment reminders.
	 * @param notificationType The type of reminder to filter by.
	 * @return A list of BI_PSPB_Treatment_Reminder__c objects that match the criteria.
	 */
	public static Map<Id, List<BI_PSP_Notification_Setting__c>> getAccountToNotificationsMap(
		List<Id> accountRec,
		String notificationType
	) {
		Map<Id, List<BI_PSP_Notification_Setting__c>> accountToNotificationsMap = new Map<Id, List<BI_PSP_Notification_Setting__c>>();
		try {
			// Convert List<Id> to a comma-separated string for the query
			String conditionIds =
				'(\'' +
				String.join(accountRec, '\', \'') +
				'\')';
			String fields = 'Id, BI_PSP_Enrollee__c, BI_PSP_Patient__c, BI_PSP_Patient__r.BI_PSP_Birthdate__c, BI_PSP_Patient__r.PersonContactId, BI_PSP_SMS__c, BI_PSP_Email__c, BI_PSP_Notification_Type__c';
			String conditions =
				'BI_PSP_Enrollee__c IN ' +
				conditionIds +
				' ' +
				'AND BI_PSP_Notification_Type__c = \'' +
				notificationType +
				'\' ';

			// Execute query and return results as List<Task>
			List<BI_PSP_Notification_Setting__c> results = (List<BI_PSP_Notification_Setting__c>) BI_PSP_CommonQueryUtility.executeQuery(
				'BI_PSP_Notification_Setting__c',
				fields,
				conditions,
				false
			);
            if (results.isEmpty()) {
            	BI_PSP_LogMessagesUtility.logError(
                	BI_PSPB_NotificationConstantsCtrl.errorMsgRecordNotFound,
                	BI_PSPB_NotificationSetting.class.toString(),
                	false,
                	BI_PSPB_NotificationConstantsCtrl.severityError
            	);
        	}
			for (BI_PSP_Notification_Setting__c setting : results) {
				if (
					!accountToNotificationsMap.containsKey(
						setting.BI_PSP_Enrollee__c
					)
				) {
					accountToNotificationsMap.put(
						setting.BI_PSP_Enrollee__c,
						new List<BI_PSP_Notification_Setting__c>()
					);
				}
				accountToNotificationsMap.get(setting.BI_PSP_Enrollee__c)
					.add(setting);
			}
		} catch (Exception ex) {
			BI_PSP_LogMessagesUtility.exceptionLogMessage(
				ex.getMessage(),
				BI_PSPB_NotificationSetting.class.getName(),
				ex
			);
		}
		return accountToNotificationsMap;
	}
}