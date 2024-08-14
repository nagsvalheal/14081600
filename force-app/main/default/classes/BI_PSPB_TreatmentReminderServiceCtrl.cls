/**
* @description  Used to
	create task when a video is uploaded and calling the method to
	send sms and email.
* History
* Version	Author			Date		Detail		Description
* 1.0		Niyas		24-07-2024		Created		Refactored Version
*/
public with sharing class BI_PSPB_TreatmentReminderServiceCtrl {
    	/**
	 * @description  Used to create task when a video is uploaded and calling the
	 * method to send sms and email.
	 */
	public static void processReminders() {
        try {
		Date today = Date.today();
		List<BI_PSPB_Treatment_Reminder__c> reminders = getActiveReminders(
			today
		);
		if (reminders.isEmpty()) {
				BI_PSP_LogMessagesUtility.logError(
					BI_PSPB_NotificationConstantsCtrl.errorMsgRecordNotFound,
					BI_PSPB_TreatmentReminderServiceCtrl.class.toString(),
					true,
					BI_PSPB_NotificationConstantsCtrl.severityError
				);
			} else {
				BI_PSPB_TreatmentReminderDaysCtrl daysCount = new BI_PSPB_TreatmentReminderDaysCtrl();
				List<Task> newTaskList = new List<Task>();

				for (BI_PSPB_Treatment_Reminder__c reminder : reminders) {
					Integer daysDifference = reminder.BI_PSPB_Reminder_Date__c.daysBetween(
						reminder.BI_PSPB_Date_of_Treatment__c
					);
					Task newTask = BI_PSPB_TaskServiceCtrl.createTask(
						reminder,
						daysDifference,
						daysCount
					);
					if (newTask != null) {
						newTaskList.add(newTask);
					}
				}

				if (!newTaskList.isEmpty()) {
					BI_PSP_DatabaseOperationsUtility.insertOperation(
						newTaskList,
						BI_PSPB_TreatmentReminderServiceCtrl.class.toString(),
						false
					);
				}

				BI_PSPB_NotificationServiceCtrl.sendNotifications(
					reminders,
					daysCount
				);
			}
		} catch (Exception ex) {
			BI_PSP_LogMessagesUtility.logError(
          		ex.getMessage(),
          		BI_PSPB_TreatmentReminderServiceCtrl.class.toString()
				,true
				,BI_PSPB_NotificationConstantsCtrl.severityError
        	);
		}
	}
	/**
	 * @description  Retrieves treatment reminders based on the given criteria.
	 * @param today The ID of the record related to the treatment reminders.
	 * @return A list of BI_PSPB_Treatment_Reminder__c objects that match the criteria.
	 */
	private static List<BI_PSPB_Treatment_Reminder__c> getActiveReminders(
		Date today
	) {
		// Convert Date to a String in the format yyyy-MM-dd
		String formattedDate = DateTime.newInstance(
				today,
				Time.newInstance(0, 0, 0, 0)
			)
			.format('yyyy-MM-dd');

		// Construct the SOQL query
		String fields = 'BI_PSPB_Care_Program_Enrollee__c, BI_PSPB_Care_Program_Enrollee__r.AccountId, BI_PSPB_Reminder_Date__c, BI_PSPB_Date_of_Treatment__c';
		String conditions =
			'BI_PSPB_Reminder_Date__c = ' +
			formattedDate +
			' ' +
			'AND BI_PSPB_Status__c = \'' +
			BI_PSPB_NotificationConstantsCtrl.actionTypeActive +
			'\' ' +
			'AND (BI_PSPB_Reminder_Type__c = \'' +
			BI_PSPB_NotificationConstantsCtrl.actionTypeTreatment +
			'\' ' +
			'OR BI_PSPB_Reminder_Type__c = \'' +
			BI_PSPB_NotificationConstantsCtrl.actionTypePrescription +
			'\' )';

		// Execute the query using a utility method
		List<SObject> results = BI_PSP_CommonQueryUtility.executeQuery(
			'BI_PSPB_Treatment_Reminder__c',
			fields,
			conditions,
			false
		);

		// Return the results cast to the expected type
		return (List<BI_PSPB_Treatment_Reminder__c>) results;
	}
}