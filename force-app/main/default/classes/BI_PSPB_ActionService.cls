/**
* @description  Used to
	create task when a video is uploaded and calling the method to
	send sms and email.
* History
* Version	Author			Date		Detail		Description
* 1.0		Niyas		24-07-2024		Created		Refactored Version
*/
public without sharing class BI_PSPB_ActionService {
	/**
	 * @description  Retrieves treatment reminders based on the given criteria.
	 * @param whatId The ID of the record related to the treatment reminders.
	 * @param reminderType The type of reminder to filter by.
	 * @return A list of BI_PSPB_Treatment_Reminder__c objects that match the criteria.
	 */
    @AuraEnabled(cacheable=false)
	public static List<BI_PSPB_Treatment_Reminder__c> getTreatmentReminders(
		Id whatId,
		String reminderType
	) {
		String fields = 'Id, BI_PSPB_Status__c, BI_PSPB_Reminder_Date__c, BI_PSPB_Care_Program_Enrollee__c, BI_PSPB_Reminder_Type__c';
		String conditions =
			'Id = \'' +
			whatId +
			'\' ' +
			'AND BI_PSPB_Status__c = \'' +
			BI_PSPB_NotificationConstantsCtrl.actionTypeActive +
			'\' ' +
			'AND BI_PSPB_Reminder_Type__c = \'' +
			reminderType +
			'\' ' +
			' ORDER BY BI_PSPB_Reminder_Date__c DESC LIMIT 1 ';

		// Execute query and return results as List<Task>
		List<SObject> results = BI_PSP_CommonQueryUtility.executeQuery(
			'BI_PSPB_Treatment_Reminder__c',
			fields,
			conditions,
			false
		);
		return (List<BI_PSPB_Treatment_Reminder__c>) results;
	}
	/**
	 * @description  Retrieves treatment reminders based on the given criteria.
	 * @param whatId The ID of the record related to the treatment reminders.
	 * @param reminderType The type of reminder to filter by.
	 * @return A list of BI_PSPB_Treatment_Reminder__c objects that match the criteria.
	 */
    @AuraEnabled(cacheable=false)
	public static BI_PSPB_Treatment_Reminder__c getDateOfTreatmentReminder(
		Id whatId,
		String reminderType
	) {
		String fields = 'Id, BI_PSPB_Status__c, BI_PSPB_Reminder_Date__c, BI_PSPB_Care_Program_Enrollee__c, BI_PSPB_Reminder_Type__c';
		String conditions =
			'Id = \'' +
			whatId +
			'\' ' +
			'AND BI_PSPB_Status__c = \'' +
			BI_PSPB_NotificationConstantsCtrl.actionTypeActive +
			'\' ' +
			'AND BI_PSPB_Reminder_Type__c = \'' +
			reminderType +
			'\' ' +
			' ORDER BY BI_PSPB_Reminder_Date__c DESC LIMIT 1 ';

		// Execute query and return results as List<Task>
		List<SObject> results = BI_PSP_CommonQueryUtility.executeQuery(
			'BI_PSPB_Treatment_Reminder__c',
			fields,
			conditions,
			false
		);
		return (BI_PSPB_Treatment_Reminder__c) results[0];
	}
}