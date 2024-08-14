/**
* @description  Used to
	create task when a video is uploaded and calling the method to
	send sms and email.
* History
* Version	Author			Date		Detail		Description
* 1.0		Niyas		24-07-2024		Created		Refactored Version
*/
public with sharing class BI_PSPB_PssQuestionnaireServiceCtrl {
    /**
	* @description  Used to create task when a video is uploaded and calling the
	* method to send sms and email.
	*/
    public static void processWpaiQuestionnaires() { 
        try {
            List<Task> newTaskList = new List<Task>();
            List<Id> enrolleeSendIds = new List<Id>();

            Set<Id> enrolleeIds = BI_PSPB_EnrolleeQueryCtrl.fetchEnrolleeIds();

            if (!enrolleeIds.isEmpty()) {
                Integer wpaiCount = BI_PSPB_QuestionsDaysCountQueryCtrl.fetchPssCount();
                List<Id> enrolleeRecIds = BI_PSPB_QuestionsSymptomTrackerProcessor.processSymptomTrackers(enrolleeIds, wpaiCount);

                if (!enrolleeRecIds.isEmpty()) {
                    enrolleeSendIds = BI_PSPB_AssessmentHelperCtrl.fetchDueAssessments(enrolleeRecIds, BI_PSPB_NotificationConstantsCtrl.pssQuestionName);
                    BI_PSPB_TaskParameters params = new BI_PSPB_TaskParameters(
						BI_PSPB_NotificationConstantsCtrl.pssQuestionSubject,
						BI_PSPB_NotificationConstantsCtrl.actionTypeAction,
						BI_PSPB_NotificationConstantsCtrl.pss,
						'',
						BI_PSPB_NotificationConstantsCtrl.actionTypeNotificatonTypeAction
					);
					newTaskList = BI_PSPB_TaskCreationCtrl.createTasks(
						enrolleeSendIds,
						params
					);
                    BI_PSP_DatabaseOperationsUtility.insertOperation(
						newTaskList,
						BI_PSPB_DlqiQuestionnaireServiceCtrl.class.toString(),
						false
					);
                    BI_PSPB_NotificationSender.sendNotifications(enrolleeSendIds, BI_PSPB_NotificationConstantsCtrl.pss, new List<String>{''});
                }
            } else {
                BI_PSP_LogMessagesUtility.logError(
					BI_PSPB_NotificationConstantsCtrl.errorMsgRecordNotFound,
					BI_PSPB_PssQuestionnaireServiceCtrl.class.toString(),
					true,
					BI_PSPB_NotificationConstantsCtrl.severityError
				);
            }
        } catch (Exception ex) {
            BI_PSP_LogMessagesUtility.logError(
          		ex.getMessage(),
          		BI_PSPB_PssQuestionnaireServiceCtrl.class.toString()
				,true
				,BI_PSPB_NotificationConstantsCtrl.severityError
        	);
        }
    }
}