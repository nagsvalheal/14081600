/**
* @description  Used to
	create task when a video is uploaded and calling the method to
	send sms and email.
* History
* Version	Author			Date		Detail		Description
* 1.0		Niyas		24-07-2024		Created		Refactored Version
*/
public with sharing class BI_PSPB_TreatmentPastDueServiceCtrl {
	/**
	 * @description  Used to create task when a video is uploaded and calling the
	 * method to send sms and email.
	 */
	public static void processPastDueReminders() {
		try {
			Integer[] intervals = new List<Integer>{ 0, -1, -3 };
			Set<Date> targetDates = BI_PSPB_TreatmentDateCalculatorCtrl.calculateTargetDates(
				intervals
			);
			Map<Date, List<BI_PSPB_Treatment_Reminder__c>> remindersByDate = BI_PSPB_TreatmentRecordQueryCtrl.getTreatmentRecords(
				targetDates
			);

			ReminderProcessingContext context = new ReminderProcessingContext();
			processReminders(remindersByDate, targetDates, context);
			handleTasks(context.newTaskList);
			sendNotifications(
				context.enrolleeRecIds,
				context.enrolleePastOne,
				context.enrolleePastThree,
				context.pastDueDays
			);
		} catch (System.DmlException ex) {
            BI_PSP_LogMessagesUtility.logError(
          		ex.getMessage(),
          		BI_PSPB_TreatmentPastDueServiceCtrl.class.toString()
				,true
				,BI_PSPB_NotificationConstantsCtrl.severityError
        	);
        }
	}
	/**
	 * @description  Retrieves treatment reminders based on the given criteria.
	 * @param remindersByDate The ID of the record related to the treatment reminders.
	 * @param targetDates The type of reminder to filter by.
	 * @param context The type of reminder to filter by.
	 */
	private static void processReminders(
		Map<Date, List<BI_PSPB_Treatment_Reminder__c>> remindersByDate,
		Set<Date> targetDates,
		ReminderProcessingContext context
	) {
		for (Date targetDate : targetDates) {
			if (remindersByDate.containsKey(targetDate)) {
				processReminderList(
					remindersByDate.get(targetDate),
					targetDate,
					context
				);
			}
		}
	}

	/**
	 * @description  Retrieves treatment reminders based on the given criteria.
	 * @param reminders The ID of the record related to the treatment reminders.
	 * @param targetDate The type of reminder to filter by.
	 * @param context The type of reminder to filter by.
	 */
	private static void processReminderList(
		List<BI_PSPB_Treatment_Reminder__c> reminders,
		Date targetDate,
		ReminderProcessingContext context
	) {
		for (BI_PSPB_Treatment_Reminder__c reminder : reminders) {
			BI_PSPB_TaskCreationParams params = new BI_PSPB_TaskCreationParams(
				reminder,
				context.pastDueDays
			);
			Task newTask = BI_PSPB_PastDueTaskCreatorCtrl.createTask(
				targetDate,
				context.enrolleeRecIds,
				context.enrolleePastOne,
				context.enrolleePastThree,
				params
			);

			if (newTask != null) {
				context.newTaskList.add(newTask);
			}
		}
	}
	/**
	 * @description  Retrieves treatment reminders based on the given criteria.
	 * @param newTaskList The ID of the record related to the treatment reminders.
	 */
	public static void handleTasks(List<Task> newTaskList) {
		try {
            // Null check for the newTaskList parameter
        	if (newTaskList.isEmpty()) {
            	BI_PSP_LogMessagesUtility.logError(
                	BI_PSPB_NotificationConstantsCtrl.errorMsgRecordNotFound,
                	BI_PSPB_TreatmentPastDueServiceCtrl.class.toString(),
                	false,
                	BI_PSPB_NotificationConstantsCtrl.severityError
            	);
            	return;
        	}
			BI_PSP_DatabaseOperationsUtility.insertOperation(
				newTaskList,
				BI_PSPB_TreatmentPastDueServiceCtrl.class.toString(),
				false
			);
		} catch (System.DmlException ex) {
            BI_PSP_LogMessagesUtility.exceptionLogMessage(
                ex.getMessage(),
                BI_PSPB_TreatmentPastDueServiceCtrl.class.getName(),
                ex
            );
        }
	}
	/**
	 * @description  Retrieves treatment reminders based on the given criteria.
	 * @param enrolleeRecIds The ID of the record related to the treatment reminders.
	 * @param enrolleePastOne The type of reminder to filter by.
	 * @param enrolleePastThree The ID of the record related to the treatment reminders.
	 * @param pastDueDays The type of reminder to filter by.
	 */
	private static void sendNotifications(
		List<Id> enrolleeRecIds,
		List<Id> enrolleePastOne,
		List<Id> enrolleePastThree,
		BI_PSPB_TreatmentReminderDaysCtrl pastDueDays
	) {
		try {
			BI_PSPB_PastDueNotificationSender.sendNotifications(
				enrolleeRecIds,
				enrolleePastOne,
				enrolleePastThree,
				pastDueDays
			);
		} catch (Exception ex) {
			BI_PSP_LogMessagesUtility.exceptionLogMessage(
                ex.getMessage(),
                BI_PSPB_TreatmentPastDueServiceCtrl.class.getName(),
                ex
            );
		}
	}
	/**
	 * @description  Retrieves treatment reminders based on the given criteria.
	 * @param enrolleeRecIds The ID of the record related to the treatment reminders.
	 * @param enrolleePastOne The type of reminder to filter by.
	 * @param enrolleePastThree The ID of the record related to the treatment reminders.
	 * @param pastDueDays The type of reminder to filter by.
	 * @param newTaskList The type of reminder to filter by.
	 */
	public class ReminderProcessingContext {
		public List<Id> enrolleeRecIds = new List<Id>();
		public List<Id> enrolleePastOne = new List<Id>();
		public List<Id> enrolleePastThree = new List<Id>();
		public BI_PSPB_TreatmentReminderDaysCtrl pastDueDays = new BI_PSPB_TreatmentReminderDaysCtrl();
		public List<Task> newTaskList = new List<Task>();
	}
}