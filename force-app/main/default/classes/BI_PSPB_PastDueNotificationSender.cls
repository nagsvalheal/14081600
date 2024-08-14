/**
* @description To check the days to send notification and calling
another method to create tasks.
* History
* Version	Author			Date		Detail		Description
* 1.0		Niyas		24-07-2024		Created		Refactored Version 
*/
public with sharing class BI_PSPB_PastDueNotificationSender {
	/**
	 * @description  Retrieves treatment reminders based on the given criteria.
	 * @param enrolleeRecIds The ID of the record related to the treatment reminders.
	 * @param enrolleePastOne The type of reminder to filter by.
	 * @param enrolleePastThree The type of reminder to filter by.
	 * @param pastDueDays The type of reminder to filter by.
	 */
	public static void sendNotifications(
		List<Id> enrolleeRecIds,
		List<Id> enrolleePastOne,
		List<Id> enrolleePastThree,
		BI_PSPB_TreatmentReminderDaysCtrl pastDueDays
	) {
		try {
			if (!enrolleeRecIds.isEmpty()) {
				BI_PSPB_SmsAndEmailSenderCtrl.handleTrigger(
					enrolleeRecIds,
					BI_PSPB_NotificationConstantsCtrl.pastDueDateZero,
					new List<String>{''},
					''
				);
			}
			if (!enrolleePastOne.isEmpty()) {
				BI_PSPB_SmsAndEmailSenderCtrl.handleTrigger(
					enrolleePastOne,
					BI_PSPB_NotificationConstantsCtrl.pastDueDateOne,
					new List<String>{''},
					''
				);
			}
			if (!enrolleePastThree.isEmpty()) {
				BI_PSPB_SmsAndEmailSenderCtrl.handleTrigger(
					enrolleePastThree,
					BI_PSPB_NotificationConstantsCtrl.pastDueDateThree,
					new List<String>{''},
					''
				);
			}
		} catch (System.DmlException ex) {
			BI_PSP_LogMessagesUtility.catchSystemException(
				BI_PSPB_CommunityConstantCtrl.errorWhileDeleting,
				BI_PSPB_FeedItemCtrl.class.toString(),
				ex
			);
		}
	}
}