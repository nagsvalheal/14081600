/**
* @description Updating the status of the Task when notification
is read.
* History
* Version	Author			Date		Detail		Description
* 1.0		Ragavi		24-07-2024		Created		Refactored Version
*/
public without sharing class BI_PSPB_NotificationStatusCtrl {
	/**
	 * @description Updating the task status as Read.
	 * @param taskId Id of the Task to be updated.
	 * @return Returning the task marked as read.
	 */
	@AuraEnabled
	public static List<Task> markTaskRead(String taskId) {
		List<Task> listOfTasks = new List<Task>();
		try {
			listOfTasks = updateTaskStatus(
				taskId,
				BI_PSPB_NotificationConstantsCtrl.actionTypeRead
			);
			if (!listOfTasks.isEmpty()) {
				BI_PSP_DatabaseOperationsUtility.updateOperation(
					listOfTasks,
					BI_PSPB_NotificationStatusCtrl.class.toString(),
					false
				);
			}
		} catch (Exception ex) {
			BI_PSP_LogMessagesUtility.exceptionLogMessage(
                ex.getMessage(),
                BI_PSPB_NotificationStatusCtrl.class.getName(),
                ex
            );
		}
		return listOfTasks;
	}
    /**
	 * @description Updating the task status as Completed.
	 * @param taskId Id of the Task to be updated.
	 * @return Returning the task marked as read.
	 */
	@AuraEnabled
	public static List<Task> markTaskCompleted(String taskId) {
		List<Task> updateTasks = new List<Task>();
		try {
			updateTasks = updateTaskStatus(
				taskId,
				BI_PSPB_NotificationConstantsCtrl.notificationStatusComplete
			);
            if (!updateTasks.isEmpty()) {
				BI_PSP_DatabaseOperationsUtility.updateOperation(
					updateTasks,
					BI_PSPB_NotificationStatusCtrl.class.toString(),
					false
				);
            }
		} catch (Exception ex) {
			BI_PSP_LogMessagesUtility.exceptionLogMessage(
                ex.getMessage(),
                BI_PSPB_NotificationStatusCtrl.class.getName(),
                ex
            );
		}
		return updateTasks;
	}
	/**
	 * @description Updating the task status as mentioned.
	 * @param taskId Id of the Task to be updated.
	 * @param newStatus Status of the Task to be updated.
	 * @return Returning the task updated.
	 */
	private static List<Task> updateTaskStatus(
		String taskId,
		String newStatus
	) {
		List<SObject> tasksToUpdate = new List<SObject>();
		List<Task> updatedTasks = new List<Task>();
		try {
			if (String.isBlank(taskId)) {
				BI_PSP_LogMessagesUtility.logError(
					BI_PSPB_NotificationConstantsCtrl.errorMsgRecordNotFound,
					BI_PSPB_NotificationStatusCtrl.class.toString(),
					false,
					BI_PSPB_NotificationConstantsCtrl.severityError
				);
			}
			tasksToUpdate = BI_PSPB_InsiteTaskQueryctrl.fetchTasks(taskId);
			if (tasksToUpdate.isEmpty()) {
				BI_PSP_LogMessagesUtility.logError(
					BI_PSPB_NotificationConstantsCtrl.errorMsgRecordNotFound,
					BI_PSPB_NotificationStatusCtrl.class.toString(),
					false,
					BI_PSPB_NotificationConstantsCtrl.severityError
				);
			}

			updatedTasks = BI_PSPB_InsiteTaskUpdater.updateTaskStatus(
				tasksToUpdate,
				newStatus
			);
			if (!updatedTasks.isEmpty()) {
				BI_PSP_DatabaseOperationsUtility.updateOperation(
					updatedTasks,
					BI_PSPB_NotificationStatusCtrl.class.toString(),
					false
				);
			}
		} catch (System.DmlException ex) {
			BI_PSP_LogMessagesUtility.exceptionLogMessage(
                ex.getMessage(),
                BI_PSPB_NotificationStatusCtrl.class.getName(),
                ex
            );
		}
		return updatedTasks;
	}
}