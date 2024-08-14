/**
 * @description To send email when a post is being created.
 * History
 * Version    Author          Date        Detail      Description
 * 1.0        Niyas           24-07-2024  Created     Refactored Version
 */
public class BI_PSPB_TreatmentReminderRecords {
	/**
	 * @description This method is used for general insite notification checking for sending symptom tracker, challenges,
	 * and community SMS, Email, and Insite Notification.
	 * @param careProgramEnrolleeId The Id of the Care Program Enrollee record.
	 * @return A list of Treatment Reminder records.
	 */
	public static List<BI_PSPB_Treatment_Reminder__c> getTreatmentReminders(
		Set<Id> careProgramEnrolleeId
	) {
		String fields = 'Id, BI_PSPB_Care_Program_Enrollee__c';
		String conditions =
			'BI_PSPB_Care_Program_Enrollee__c = \'' +
			careProgramEnrolleeId +
			'\' ORDER BY BI_PSPB_Reminder_Date__c ASC LIMIT 3';

		// Execute query and return results as List<BI_PSPB_Treatment_Reminder__c>
		List<SObject> sObjectResults = BI_PSP_CommonQueryUtility.executeQuery(
			'BI_PSPB_Treatment_Reminder__c',
			fields,
			conditions,
			false
		);

		List<BI_PSPB_Treatment_Reminder__c> treatmentReminders = new List<BI_PSPB_Treatment_Reminder__c>();

		for (SObject sObj : sObjectResults) {
			treatmentReminders.add((BI_PSPB_Treatment_Reminder__c) sObj);
		}
		return treatmentReminders;
	}
}