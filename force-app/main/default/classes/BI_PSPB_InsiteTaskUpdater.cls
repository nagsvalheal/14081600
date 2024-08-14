/**
* @description Used to update the status of the Task.
* History
* Version	Author			Date		Detail		Description
* 1.0		Niyas		24-07-2024		Created		Refactored Version
*/
public with sharing class BI_PSPB_InsiteTaskUpdater {
	/**
	* @description Updating the task status as Read.
	* @param tasks List of tasks to be updated.
	* @param newStatus Status of the task to be updated.
	* @return Returning the task marked as read.
	*/
    @AuraEnabled
	public static List<Task> updateTaskStatus(
		List<Task> tasks, String newStatus) {
		List<Task> updatedTask = new List<Task>();
		try{
			if(tasks.isEmpty() || String.isBlank(newStatus)){
				BI_PSP_LogMessagesUtility.logError(
					BI_PSPB_NotificationConstantsCtrl.errorMsgRecordNotFound,
					BI_PSPB_InsiteTaskUpdater.class.toString(),
					true,
                    BI_PSPB_NotificationConstantsCtrl.severityError
				);
			} else {
				for (Task task : tasks) {
					task.Status = newStatus;
					updatedTask.add(task);
				}
			}
		} catch (Exception ex) {
			BI_PSP_LogMessagesUtility.exceptionLogMessage(
                ex.getMessage(),
                BI_PSPB_InsiteTaskUpdater.class.getName(),
                ex
            );
		}
		// check for null
		return updatedTask;
	}
}