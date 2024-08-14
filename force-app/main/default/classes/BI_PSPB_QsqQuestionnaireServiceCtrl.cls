/**
* @description  Used to
	create task when a video is uploaded and calling the method to
	send sms and email.
* History
* Version	Author			Date		Detail		Description
* 1.0		Niyas		24-07-2024		Created		Refactored Version
*/
public with sharing class BI_PSPB_QsqQuestionnaireServiceCtrl {
  /**
   * @description  Used to create task when a video is uploaded and calling the
   * method to send sms and email.
   */
  public static void processQsqQuestionnaires() {
    try {
      Integer qsqCount = BI_PSPB_QuestionsDaysCountQueryCtrl.fetchQsqCount();
      Integer qsqTwoCount = BI_PSPB_QuestionsDaysCountQueryCtrl.fetchQsqTwoCount();
      List<Id> enrolleeQsqOneIds = BI_PSPB_QsqEnrolleeProcessorCtrl.processEnrollees(
        qsqCount
      );
        system.debug('enrolleeQsqOneIds'+enrolleeQsqOneIds);
        if (!enrolleeQsqOneIds.isEmpty()) {
        processQsq(
          enrolleeQsqOneIds,
          BI_PSPB_NotificationConstantsCtrl.qsqQuestionName,
          BI_PSPB_NotificationConstantsCtrl.qsqQuestionSubject,
          BI_PSPB_NotificationConstantsCtrl.qsq,
          BI_PSPB_NotificationConstantsCtrl.actionTypeNotificatonTypeAction
        );
      }
      List<Id> enrolleeQsqTwoIds = BI_PSPB_QsqEnrolleeProcessorCtrl.processEnrollees(
        qsqTwoCount
      );
        system.debug('enrolleeQsqTwoIds'+enrolleeQsqTwoIds);
      
		if (!enrolleeQsqTwoIds.isEmpty()) {
        processQsq(
          enrolleeQsqTwoIds,
          BI_PSPB_NotificationConstantsCtrl.qsqQuestionName,
          BI_PSPB_NotificationConstantsCtrl.qsqQuestionSubject,
          BI_PSPB_NotificationConstantsCtrl.qsq,
          BI_PSPB_NotificationConstantsCtrl.actionTypeNotificatonTypeAction
        );
        }
    } catch (Exception ex) {
        BI_PSP_LogMessagesUtility.logError(
            ex.getMessage(),
            BI_PSPB_QsqQuestionnaireServiceCtrl.class.toString()
      ,true
      ,BI_PSPB_NotificationConstantsCtrl.severityError
        );
      }
  }

  /**
   * @description  Creates tasks when a list of enrollee IDs is provided, and calls methods to send SMS and email notifications.
   * @param enrolleeQsqIds A list of enrollee IDs that need to be processed. This list should not be null or empty.
   * @param questionName The name of the question related to the assessment. This is used for fetching due assessments.
   * @param actionLabel The label for the action to be taken. This will be used when creating tasks.
   * @param notificationType The type of notification to be sent (e.g., SMS, email). This determines the type of notification that will be sent.
   * @param actionType The type of action being performed. This is used to categorize or specify the nature of the action.
   */
  public static void processQsq(
    List<Id> enrolleeQsqIds,
    String questionName,
    String actionLabel,
    String notificationType,
    String actionType
  ) {
    try {
      if (!enrolleeQsqIds.isEmpty()) {
        List<Id> enrolleeSendQsqIds = BI_PSPB_AssessmentHelperCtrl.fetchDueAssessments(
          enrolleeQsqIds,
          questionName
        );
        BI_PSPB_TaskParameters params = new BI_PSPB_TaskParameters(
          actionLabel,
          BI_PSPB_NotificationConstantsCtrl.actionTypeAction,
          BI_PSPB_NotificationConstantsCtrl.qsq,
          '',
          actionType
        );

        List<Task> newTaskList = BI_PSPB_TaskCreationCtrl.createTasks(
          enrolleeSendQsqIds,
          params
        );
        BI_PSP_DatabaseOperationsUtility.insertOperation(
          newTaskList,
          BI_PSPB_QsqQuestionnaireServiceCtrl.class.toString(),
          false
        );
       /** BI_PSPB_NotificationSender.sendNotifications(
          enrolleeSendQsqIds,
          notificationType,
          new List<String>{ '' }
        );*/
      } else {
          BI_PSP_LogMessagesUtility.logError(
      BI_PSPB_NotificationConstantsCtrl.errorMsgRecordNotFound,
      BI_PSPB_QsqQuestionnaireServiceCtrl.class.toString(),
      true,
      BI_PSPB_NotificationConstantsCtrl.severityError
    );
      }
    } catch (Exception ex) {
        BI_PSP_LogMessagesUtility.logError(
            ex.getMessage(),
            BI_PSPB_QsqQuestionnaireServiceCtrl.class.toString()
      ,true
      ,BI_PSPB_NotificationConstantsCtrl.severityError
        );
    }
  }
}