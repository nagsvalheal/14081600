/**
* @description To check the days to send notification and calling
another method to create tasks.
* History
* Version	Author			Date		Detail		Description
* 1.0		Niyas		24-07-2024		Created		Refactored Version 
*/
public with sharing class BI_PSPB_TaskCreationParams {
    public BI_PSPB_Treatment_Reminder__c reminder;
    public BI_PSPB_TreatmentReminderDaysCtrl pastDueDays;
	/**
	 * @description  Retrieves treatment reminders based on the given criteria.
	 * @param reminder The ID of the record related to the treatment reminders.
	 * @param pastDueDays The type of reminder to filter by.
	 */
    public BI_PSPB_TaskCreationParams(
        BI_PSPB_Treatment_Reminder__c reminder,
        BI_PSPB_TreatmentReminderDaysCtrl pastDueDays
    ) {
        this.reminder = reminder;
        this.pastDueDays = pastDueDays;
    }
}