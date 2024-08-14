/**
 * @description To send email when a post is being created.
 * History
 * Version	Author			Date		Detail		Description
 * 1.0		Niyas		24-07-2024		Created		Refactored Version
 */
public with sharing class BI_PSPB_DateOfTreatmentNotification {
	/**
	 * @description This method is used for general insite notification checking for sending symptomtracker, challenges,
	 * and community SMS, Email, and Insite Notification.
	 * @param newTasks The list of Task records being inserted.
	 */
	@AuraEnabled(cacheable=true)
	public static List<BI_PSPB_Treatment_Reminder__c> getDateOfTreatment(
		String accountId
	) {
		try {
			if (!String.isBlank(accountId)) {
				// This query has CareProgramEnrollee object query were it won't support With User_Mode
				List<BI_PSPB_Treatment_Reminder__c> tasks = getTreatmentQuery(accountId);

				if (!tasks.isEmpty()) {
					return tasks;
				}
			} else {
				logAndThrowError(
					BI_PSPB_NotificationConstantsCtrl.parameterError,
					BI_PSPB_NotificationConstantsCtrl.parameterError
				);
			}
		} catch (Exception ex) {
			logExceptionAndThrowError(ex);
		}
		return null; // Fallback return to satisfy method signature, although it should never reach here
	}
	/**
	 * @description This method is used for general insite notification checking for sending symptomtracker, challenges,
	 * and community SMS, Email, and Insite Notification.
	 * @param newTasks The list of Task records being inserted.
	 */
	private static void logAndThrowError(
		String logMessage,
		String errorMessage
	) {
		BI_PSP_LogMessagesUtility.logError(
			errorMessage,
			BI_PSPB_DateOfTreatmentNotification.class.toString(),
			false,
			logMessage
		);
	}
	/**
	 * @description This method is used for general insite notification checking for sending symptomtracker, challenges,
	 * and community SMS, Email, and Insite Notification.
	 * @param newTasks The list of Task records being inserted.
	 */
	private static void logExceptionAndThrowError(Exception ex) {
		BI_PSP_LogMessagesUtility.logError(
                    BI_PSPB_NotificationConstantsCtrl.errorMsgRecordNotFound,
                    BI_PSPB_DateOfTreatmentNotification.class.toString(),
                    false,
                    BI_PSPB_NotificationConstantsCtrl.severityError
                );
	}
	/**
	 * @description This method is used for general insite notification checking for sending symptomtracker, challenges,
	 * and community SMS, Email, and Insite Notification.
	 * @param newTasks The list of Task records being inserted.
	 */
	public static List<BI_PSPB_Treatment_Reminder__c> getTreatmentQuery(
		String enrolleeList
	) {
		String fields = 'Id, BI_PSPB_Subject__c, BI_PSPB_Date_of_Treatment__c, BI_PSPB_Reminder_Date__c';
		String conditions =
			'BI_PSPB_Care_Program_Enrollee__c = \'' + enrolleeList + '\' ';
		List<SObject> results = BI_PSP_CommonQueryUtility.executeQuery(
			'BI_PSPB_Treatment_Reminder__c',
			fields,
			conditions,
			false
		);
		return results;
	}
}