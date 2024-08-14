/**
 * @description Used to trigger and send notification for Treatment reminders.
 * History
 * Version	Author		Date		Detail		Description
 * 1.0		Niyas		24-07-2024	Created		Refactored Version
 */
public with sharing class BI_PSPB_TaskServiceCtrl {
	/**
	 * @description  Retrieves treatment reminders based on the given criteria.
	 * @param reminder The ID of the record related to the treatment reminders.
	 * @param daysDifference The type of reminder to filter by.
	 * @param daysCount The type of reminder to filter by.
	 * @return A list of BI_PSPB_Treatment_Reminder__c objects that match the criteria.
	 */
	public static Task createTask(
		BI_PSPB_Treatment_Reminder__c reminder,
		Integer daysDifference,
		BI_PSPB_TreatmentReminderDaysCtrl daysCount
	) {
		List<Task> tasks = new List<Task>();
			String subject;
            String category;
            String notificationType;
            String status;
			String formattedDate;
			Datetime treatmentDate;

			if (daysDifference == daysCount.before1Day) {
				treatmentDate = reminder.BI_PSPB_Date_of_Treatment__c;
				formattedDate = treatmentDate.format('MM/dd/yyyy');
				subject =
					BI_PSPB_NotificationConstantsCtrl.oneDayBeforeSubject +
					' ' +
					formattedDate;
                notificationType = BI_PSPB_NotificationConstantsCtrl.actionTypeGeneral;
                status = BI_PSPB_NotificationConstantsCtrl.actionTypeUnRead;
                category = BI_PSPB_NotificationConstantsCtrl.actionTypeTreatment;
			} else if (daysDifference == daysCount.before3Day) {
				treatmentDate = reminder.BI_PSPB_Date_of_Treatment__c;
				formattedDate = treatmentDate.format('MM/dd/yyyy');
				subject =
					BI_PSPB_NotificationConstantsCtrl.threeDayBeforeSubject +
					' ' +
					formattedDate;
                notificationType = BI_PSPB_NotificationConstantsCtrl.actionTypeGeneral;
                status = BI_PSPB_NotificationConstantsCtrl.actionTypeUnRead;
                category = BI_PSPB_NotificationConstantsCtrl.actionTypeTreatment;
			} else if (daysDifference == daysCount.before7Day) {
				subject = BI_PSPB_NotificationConstantsCtrl.sevenDayBeforeSubject;
                notificationType = BI_PSPB_NotificationConstantsCtrl.actionTypeAction;
                status = BI_PSPB_NotificationConstantsCtrl.actionTypeNotificatonTypeAction;
                category = BI_PSPB_NotificationConstantsCtrl.actionTypePrescription;
			} else if (daysDifference == daysCount.before10Day) {
				subject = BI_PSPB_NotificationConstantsCtrl.tenDayBeforeSubject;
                notificationType = BI_PSPB_NotificationConstantsCtrl.actionTypeAction;
                status = BI_PSPB_NotificationConstantsCtrl.actionTypeNotificatonTypeAction;
                category = BI_PSPB_NotificationConstantsCtrl.actionTypePrescription;
			} else if (daysDifference == daysCount.before14Day) {
				subject = BI_PSPB_NotificationConstantsCtrl.fourteenDayBeforeSubject;
                notificationType = BI_PSPB_NotificationConstantsCtrl.actionTypeAction;
                status = BI_PSPB_NotificationConstantsCtrl.actionTypeNotificatonTypeAction;
                category = BI_PSPB_NotificationConstantsCtrl.actionTypePrescription;
			} else {
				return null;
			}

			BI_PSPB_TaskParameters params = new BI_PSPB_TaskParameters(
				subject,
				notificationType,
				category,
				'',
				status
			);
			tasks = BI_PSPB_TaskCreationCtrl.createTasks(
				new List<Id>{ reminder.Id },
				params
			);
		return tasks.isEmpty() ? null : tasks[0];
	}
}