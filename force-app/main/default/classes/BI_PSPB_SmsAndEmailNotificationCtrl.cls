/**
* @description  Used to
	create task when a video is uploaded and calling the method to
	send sms and email.
* History
* Version	Author			Date		Detail		Description
* 1.0		Niyas		24-07-2024		Created		Refactored Version
*/
public with sharing class BI_PSPB_SmsAndEmailNotificationCtrl {
    public String subject;
    public String emailSubject;
    public String urlPage;
    public String notificationType;
    public List<String> followName;
	/**
	 * @description  Retrieves treatment reminders based on the given criteria.
	 * @param subject The ID of the record related to the treatment reminders.
	 * @param emailSubject The type of reminder to filter by.
	 * @param urlPage The type of reminder to filter by.
     * @param notificationType The type of reminder to filter by.
     * @param followName The type of reminder to filter by.
	 */
    public BI_PSPB_SmsAndEmailNotificationCtrl(String subject, String emailSubject, String urlPage, String notificationType, List<String> followName) {
        this.subject = subject;
        this.emailSubject = emailSubject;
        this.urlPage = urlPage;
        this.notificationType = notificationType;
        this.followName = followName;
    }
}