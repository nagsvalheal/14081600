/**
* @description  Used to
	create task when a video is uploaded and calling the method to
	send sms and email.
* History
* Version	Author			Date		Detail		Description
* 1.0		Niyas		24-07-2024		Created		Refactored Version
*/
public with sharing class BI_PSPB_SymptomActionNotificationCtrl {
	/**
	 * @description  Used to create task when a video is uploaded and calling the
	 * method to send sms and email.
	 */
	public static void processSymptomNotifications() {
		try {

			List<SObject> enrolleeIds = BI_PSP_CommonQueryUtility.executeQuery(
				'CareProgramEnrollee',
				'Id',
				null,
				false
			);

			if (!enrolleeIds.isEmpty()) {
				List<BI_PSP_Symptom_Tracker__c> symptomTrackers = BI_PSPB_SymptomTrackerQueryCtrl.fetchSymptomTrackers(
					enrolleeIds
				);
                
				if (!symptomTrackers.isEmpty()) {
					List<Id> symptomTrackerIds = new List<Id>();
					for (BI_PSP_Symptom_Tracker__c tracker : symptomTrackers) {
						symptomTrackerIds.add(
							tracker.BI_PSP_Care_Program_Enrollee__c
						);
					}
					BI_PSPB_TaskParameters params = new BI_PSPB_TaskParameters(
						BI_PSPB_NotificationConstantsCtrl.symptomTrackerActionSubject,
						BI_PSPB_NotificationConstantsCtrl.actionTypeAction,
						BI_PSPB_NotificationConstantsCtrl.actionTypeSymptomTracker,
						'',
						BI_PSPB_NotificationConstantsCtrl.actionTypeNotificatonTypeAction
					);
					List<Task> newTaskList = BI_PSPB_TaskCreationCtrl.createTasks(
						symptomTrackerIds,
						params
					);

					BI_PSP_DatabaseOperationsUtility.insertOperation(
						newTaskList,
						BI_PSPB_SymptomActionNotificationCtrl.class
							.toString(),
						false
					);
					BI_PSPB_NotificationSender.sendNotifications(
						symptomTrackerIds,
						BI_PSPB_NotificationConstantsCtrl.actionSymptomTracker,
                        new List<String>{''}
					);
				} else {
					BI_PSP_LogMessagesUtility.logError(
					BI_PSPB_NotificationConstantsCtrl.errorMsgRecordNotFound,
					BI_PSPB_SymptomActionNotificationCtrl.class.toString(),
					true,
					BI_PSPB_NotificationConstantsCtrl.severityError
				);
				}
			} else {
				BI_PSP_LogMessagesUtility.logError(
					BI_PSPB_NotificationConstantsCtrl.errorMsgRecordNotFound,
					BI_PSPB_SymptomActionNotificationCtrl.class.toString(),
					true,
					BI_PSPB_NotificationConstantsCtrl.severityError
				);
			}
		} catch (Exception ex) {
        BI_PSP_LogMessagesUtility.logError(
            ex.getMessage(),
            BI_PSPB_SymptomActionNotificationCtrl.class.toString()
      ,true
      ,BI_PSPB_NotificationConstantsCtrl.severityError
        );
    }
	}
}