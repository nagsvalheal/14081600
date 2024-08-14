/**
* @description  Used to
	create task when a video is uploaded and calling the method to
	send sms and email.
* History
* Version	Author			Date		Detail		Description
* 1.0		Niyas		24-07-2024		Created		Refactored Version
*/
public with sharing class BI_PSPB_SmsAndEmailSenderCtrl {
	/**
	 * @description  Retrieves treatment reminders based on the given criteria.
	 * @param recordId The ID of the record related to the treatment reminders.
	 * @param notificationTypes The type of reminder to filter by.
     * @param communityUserName The type of reminder to filter by.
     * @param treatmentDate The type of reminder to filter by. 
	 */
    public static void handleTrigger(List<Id> recordId, String notificationTypes, List<String> communityUserName, String treatmentDate) {
        try {
        	if (recordId.isEmpty() && String.isBlank(notificationTypes)) {
            	BI_PSP_LogMessagesUtility.logError(
					BI_PSPB_NotificationConstantsCtrl.errorMsgRecordNotFound,
					BI_PSPB_SmsAndEmailSenderCtrl.class.toString(),
					false,
					BI_PSPB_NotificationConstantsCtrl.severityError
				);
            	return;
        	}
            BI_PSPB_SmsAndEmailNotificationCtrl notificationDetails = BI_PSPB_SmsAndEmailNotificationHelper.getNotificationDetails(notificationTypes, communityUserName);
            List<Id> contactIdsToSendSMS = new List<Id>();
            List<Id> contactIdsToSendEmail = new List<Id>();
            List<Id> enrolIds = new List<Id>();
            List<Id> accountRec = new List<Id>();

            // Retrieve enrollees
            List<CareProgramEnrollee> enrollees = BI_PSPB_EnrolleeQueryHelper.getEnrollees(recordId);
            for (CareProgramEnrollee enrollee : enrollees) {
                enrolIds.add(enrollee.Id);
                accountRec.add(enrollee.AccountId);
            }

            // Retrieve notifications
            Map<Id, List<BI_PSP_Notification_Setting__c>> accountToNotificationsMap = BI_PSPB_NotificationSetting.getAccountToNotificationsMap(enrolIds, notificationDetails.notificationType);
            // Filter and add contacts
            BI_PSPB_SmsAndEmailNotificationHelper.addContactsToSend(accountToNotificationsMap, enrollees, contactIdsToSendEmail, contactIdsToSendSMS);
            // URL      
            String url = BI_PSPB_SmsAndEmailNotificationHelper.getNotificationUrl(notificationDetails);
            if (!contactIdsToSendEmail.isEmpty()) {
				 BI_PSPB_EmailBatch sendEmail = new BI_PSPB_EmailBatch(
				 	contactIdsToSendEmail,
				 	notificationDetails.emailSubject,
				 	url,
				 	treatmentDate,
				 	notificationDetails.followName
				 );
				 database.executeBatch(sendEmail, 45);
			}
			if (!contactIdsToSendSMS.isEmpty()) {
				 BI_PSPB_SmsBatch sendSms = new BI_PSPB_SmsBatch(
				 	contactIdsToSendSMS,
				 	notificationDetails.subject,
				 	url,
				 	null
				 );
				 database.executeBatch(sendSms, 45);
			}
        } catch (Exception ex) {
            BI_PSP_LogMessagesUtility.exceptionLogMessage(
				ex.getMessage(),
				BI_PSPB_SmsAndEmailSenderCtrl.class.getName(),
				ex
			);
        }
    }
}