/**
 * @description To send email when a post is being created.
 * History
 * Version	Author			Date		Detail		Description
 * 1.0		Niyas		24-07-2024		Created		Refactored Version
 */
public with sharing class BI_PSPB_TaskEnrolleeQueryCtrl {
	/**
	 * @description  Retrieves treatment reminders based on the given criteria.
	 * @param recordIds The ID of the record related to the treatment reminders.
	 * @return A list of BI_PSPB_Treatment_Reminder__c objects that match the criteria.
	 */
    public static List<CareProgramEnrollee> fetchEnrolleeRecords(List<Id> recordIds) {
        String fields = 'Id';
        // Convert List<Id> to a comma-separated string for the query
        String conditionIds = '(\'' + String.join(recordIds, '\', \'') + '\')';
        String conditions = 'Id IN ' + conditionIds + ' LIMIT 1';
	   	List<SObject> results = BI_PSP_CommonQueryUtility.executeQuery('CareProgramEnrollee', fields, conditions, false);
        return (List<CareProgramEnrollee>) results;
    }
}