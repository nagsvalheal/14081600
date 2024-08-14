public with sharing class BI_PSPB_NotificationSender {
    /**
     * @description  Retrieves treatment reminders based on the given criteria.
     * @param enrolleeIds The ID of the record related to the treatment reminders.
     * @param notificationType The type of reminder to filter by.
     * @param communityUserNames The type of reminder to filter by.
     */
    public static void sendNotifications(
        List<Id> enrolleeIds,
        String notificationType, 
        List<String> communityUserNames
    ) {
        try {
            // Check if enrolleeIds is not empty and notificationType is not blank
            if (!enrolleeIds.isEmpty() && !String.isBlank(notificationType)) {
                BI_PSPB_SmsAndEmailSenderCtrl.handleTrigger(
                    enrolleeIds,
                    notificationType,
                    communityUserNames,
                    ''
                );
            } else {
                BI_PSP_LogMessagesUtility.logError(
                    BI_PSPB_NotificationConstantsCtrl.errorMsgRecordNotFound,
                    BI_PSPB_NotificationSender.class.toString(),
                    true,
                    BI_PSPB_NotificationConstantsCtrl.severityError
                );
            }
        } catch (Exception ex) {
            BI_PSP_LogMessagesUtility.exceptionLogMessage(
				ex.getMessage(),
				BI_PSPB_SmsAndEmailNotificationSetting.class.getName(),
				ex
			);
        }
    }
}