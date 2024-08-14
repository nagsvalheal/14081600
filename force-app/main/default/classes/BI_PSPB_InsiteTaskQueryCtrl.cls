/**
 * @description Used to update the status of the Task.
 * History
 * Version	Author			Date		Detail		Description
 * 1.0		Niyas		24-07-2024		Created		Refactored Version
 */
public without sharing class BI_PSPB_InsiteTaskQueryCtrl {
	/**
	 * @description Retrieves a list of tasks based on the given task ID.
	 * @param taskId The ID of the Task to be fetched.
	 * @return A list of Task records that match the given ID.
	 */
	public static List<Task> fetchTasks(String taskId) {
		String fields = 'Id, Status, BI_PSP_Category__c, BI_PSP_ChatterType__c, BI_PSP_ChatterFeedId__c';
		String conditions = 'Id = \'' + taskId + '\' ' + 'LIMIT 1';
		List<SObject> results = BI_PSP_CommonQueryUtility.executeQuery(
			'Task',
			fields,
			conditions,
			false
		);
		return (List<Task>) results;
	}
}