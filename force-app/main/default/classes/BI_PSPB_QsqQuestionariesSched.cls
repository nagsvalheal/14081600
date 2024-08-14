/**
* @description  Used to
	create task when a video is uploaded and calling the method to
	send sms and email.
* History
* Version	Author			Date		Detail		Description
* 1.0		Niyas		24-07-2024		Created		Refactored Version
*/
public with sharing class BI_PSPB_QsqQuestionariesSched implements Schedulable {
	/**
	 * @description  Used to create task when a video is uploaded and calling the
	 * method to send sms and email.
	 */
	public void execute(SchedulableContext ctx) {
		try {
			BI_PSPB_QsqQuestionnaireServiceCtrl.processQsqQuestionnaires();
		} catch (Exception ex) {
			BI_PSP_LogMessagesUtility.logError(
          		ex.getMessage(),
          		BI_PSPB_QsqQuestionariesSched.class.toString()
				,false
				,BI_PSPB_NotificationConstantsCtrl.severityError
        	);
		}
	}
}