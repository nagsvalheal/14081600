/**
* @description  Used to
	create task when a video is uploaded and calling the method to
	send sms and email.
* History
* Version	Author			Date		Detail		Description
* 1.0		Niyas		24-07-2024		Created		Refactored Version
*/
public without sharing class BI_PSPB_ActionTaskService {
    /**
	 * @description  Used to create task when a video is uploaded and calling the
	 * method to send sms and email.
	 * @param recordId The ID of the Task record to retrieve. This should be a valid Salesforce ID.
 	 * @return Task The Task record corresponding to the given record ID. If no record is found,
 	 * the method will throw an error due to accessing an empty list.
	 */
    @AuraEnabled(cacheable=false)
    public static Task getTask(String recordId) {
        String fields = 'Id, Status, WhatId';
		String conditions =
			'Id = \'' +
			recordId +
			'\' LIMIT 1 ';
		List<SObject> results = BI_PSP_CommonQueryUtility.executeQuery(
			'Task',
			fields,
			conditions,
			false
		);
		return (Task) results[0];
    }
}