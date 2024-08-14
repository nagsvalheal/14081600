/**
* @description  Used to
	create task when a video is uploaded and calling the method to
	send sms and email.
* History
* Version	Author			Date		Detail		Description
* 1.0		Niyas		24-07-2024		Created		Refactored Version
*/
public class BI_PSPB_NotificationStatusExpiredBatch implements Database.Batchable<SObject> {
    /**
     * @description
     * Initializes the batch job by defining the query to select Task records that need to be processed.
     * This method retrieves Task records with specific fields where the status is either 'UnRead' or 'Action Required'.
     * The query results are returned as a Database.QueryLocator, which is used by the batch framework to process records in batches.
     * @param bc The context of the batch job being executed.
     * @return A Database.QueryLocator that includes Task records matching the specified criteria.
     */
	public Database.QueryLocator start(Database.BatchableContext bc) {
		String fields = 'Id, Status, BI_PSP_Category__c, BI_PSPB_Treatment_Type__c, BI_PSP_Notification_Type__c, CreatedDate';
		String conditions = '(Status = \''+ BI_PSPB_NotificationConstantsCtrl.actionTypeUnRead
		+'\' OR Status = \''
		+ BI_PSPB_NotificationConstantsCtrl.taskStatusAction + '\')';
		String query = 'SELECT ' + fields + ' FROM Task WHERE ' + conditions;
		return Database.getQueryLocator(query);
	}
	/**
	 * @description
	 * Processes a batch of Task records by evaluating their status and expiration based on predefined thresholds.
	 * This method updates the status of Tasks to 'Expired' if they meet the expiration criteria, and performs
	 * a bulk update on the modified Task records.
	 * @param bc The context of the batch job being executed.
	 * @param tasks A list of Task records to be processed.
	 */
	public void execute(Database.BatchableContext bc, List<Task> tasks) {
        Integer oneCount = BI_PSPB_NotificationExpiredDaysCtrl.oneCount();
        Integer sevenCount = BI_PSPB_NotificationExpiredDaysCtrl.sevenCount();
        Integer twentyEightCount = BI_PSPB_NotificationExpiredDaysCtrl.twentyEightCount();
        Integer thirtyCount = BI_PSPB_NotificationExpiredDaysCtrl.thirtyCount();
		Date today = System.today();
		Map<String, Date> thresholds = new Map<String, Date>{
			'oneDay' => today.addDays(-oneCount),
			'sevenDays' => today.addDays(-sevenCount),
			'twentyEightDays' => today.addDays(-twentyEightCount),
			'thirtyDays' => today.addDays(-thirtyCount)
		};
		List<Task> tasksToUpdate = new List<Task>();
		for (Task task : tasks) {
			if (shouldExpire(task, thresholds)) {
				task.Status = BI_PSPB_NotificationConstantsCtrl.actionTypeNotificationTypeExpired;
				tasksToUpdate.add(task);
			}
		}
		if (!tasksToUpdate.isEmpty()) {
			update tasksToUpdate;
		}
	}
	/**
	 * @description
	 * Determines if a Task record meets the criteria for expiration based on various conditions.
	 * This method evaluates the Task's creation date against predefined expiration thresholds and specific criteria
	 * to decide if the Task should be marked as expired.
	 * @param task The Task record to be evaluated for expiration.
	 * @param thresholds A map of expiration thresholds based on days.
	 * @return A Boolean value indicating whether the Task meets the expiration criteria (true) or not (false).
	 */
	private Boolean shouldExpire(Task task, Map<String, Date> thresholds) {
		Date taskDate = task.CreatedDate.date();
		if (
			isExpirationCriteriaMet(
				task,
				BI_PSPB_NotificationConstantsCtrl.taskStatusAction,
				BI_PSPB_NotificationConstantsCtrl.actionTypeAction,
				taskDate,
				thresholds.get('oneDay')
			)
		) {
			return true;
		}
		if (
			isGeneralExpirationCriteriaMet(
				task,
				BI_PSPB_NotificationConstantsCtrl.actionTypeUnRead,
				BI_PSPB_NotificationConstantsCtrl.actionTypeGeneral,
				taskDate,
				thresholds.get('sevenDays')
			)
		) {
			return true;
		}
		if (
			isSpecialExpirationCriteriaMet(
				task,
				BI_PSPB_NotificationConstantsCtrl.actionTypeNotificatonTypeAction,
				BI_PSPB_NotificationConstantsCtrl.actionTypeAction,
				taskDate,
				thresholds.get('twentyEightDays')
			)
		) {
			return true;
		}
		if (
			isQSQExpirationCriteriaMet(
				task,
				BI_PSPB_NotificationConstantsCtrl.actionTypeNotificatonTypeAction,
				BI_PSPB_NotificationConstantsCtrl.actionTypeAction,
				taskDate,
				thresholds.get('thirtyDays')
			)
		) {
			return true;
		}

		return false;
	}
	/**
	 * @description
	 * Evaluates whether a Task record meets specific expiration criteria based on its status, notification type,
	 * and creation date compared to a given threshold date.
	 * This method checks if the Task satisfies conditions related to its type, status, and notification type,
	 * and whether its creation date matches the provided threshold date.
	 * @param task The Task record to be evaluated.
	 * @param status The status that the Task should have to meet the criteria.
	 * @param notificationType The notification type that the Task should match.
	 * @param taskDate The creation date of the Task to be compared.
	 * @param thresholdDate The date against which the Task's creation date is compared.
	 * @return A Boolean value indicating whether the Task meets the expiration criteria (true) or not (false).
	 */
	private Boolean isExpirationCriteriaMet(
		Task task,
		String status,
		String notificationType,
		Date taskDate,
		Date thresholdDate
	) {
		return (isSymptomTrackerOrPrescriptionOrTreatment(task) &&
		task.Status == status &&
		task.BI_PSP_Notification_Type__c == notificationType &&
		taskDate == thresholdDate);
	}
	/**
	 * @description
	 * Evaluates whether a Task record meets general expiration criteria based on its status, notification type,
	 * and creation date compared to a specified threshold date.
	 * This method checks if the Task belongs to a general notification category, and whether its status and
	 * notification type match the provided values, and its creation date is equal to the given threshold date.
	 * @param task The Task record to be evaluated.
	 * @param status The status that the Task should have to meet the criteria.
	 * @param notificationType The notification type that the Task should match.
	 * @param taskDate The creation date of the Task to be compared.
	 * @param thresholdDate The date against which the Task's creation date is compared.
	 * @return A Boolean value indicating whether the Task meets the general expiration criteria (true) or not (false).
	 */
	private Boolean isGeneralExpirationCriteriaMet(
		Task task,
		String status,
		String notificationType,
		Date taskDate,
		Date thresholdDate
	) {
		return (isGeneralNotificationCategory(task) &&
		task.Status == status &&
		task.BI_PSP_Notification_Type__c == notificationType &&
		taskDate == thresholdDate);
	}
	/**
	 * @description
	 * Evaluates whether a Task record meets special expiration criteria based on its status, notification type,
	 * and creation date compared to a specified threshold date.
	 * This method checks if the Task belongs to a special category, and whether its status and notification type
	 * match the provided values, and its creation date is equal to the given threshold date.
	 * @param task The Task record to be evaluated.
	 * @param status The status that the Task should have to meet the criteria.
	 * @param notificationType The notification type that the Task should match.
	 * @param taskDate The creation date of the Task to be compared.
	 * @param thresholdDate The date against which the Task's creation date is compared.
	 * @return A Boolean value indicating whether the Task meets the special expiration criteria (true) or not (false).
	 */
	private Boolean isSpecialExpirationCriteriaMet(
		Task task,
		String status,
		String notificationType,
		Date taskDate,
		Date thresholdDate
	) {
		return (isSpecialCategory(task) &&
		task.Status == status &&
		task.BI_PSP_Notification_Type__c == notificationType &&
		taskDate == thresholdDate);
	}
	/**
	 * @description
	 * Evaluates whether a Task record meets QSQ-specific expiration criteria based on its status, notification type,
	 * and creation date compared to a specified threshold date.
	 * This method checks if the Task belongs to the 'QSQ' category, and whether its status and notification type
	 * match the provided values, with its creation date being equal to the given threshold date.
	 * @param task The Task record to be evaluated.
	 * @param status The status that the Task should have to meet the criteria.
	 * @param notificationType The notification type that the Task should match.
	 * @param taskDate The creation date of the Task to be compared.
	 * @param thresholdDate The date against which the Task's creation date is compared.
	 * @return A Boolean value indicating whether the Task meets the QSQ-specific expiration criteria (true) or not (false).
	 */
	private Boolean isQSQExpirationCriteriaMet(
		Task task,
		String status,
		String notificationType,
		Date taskDate,
		Date thresholdDate
	) {
		return (task.BI_PSP_Category__c == BI_PSPB_NotificationConstantsCtrl.qsq &&
		task.Status == status &&
		task.BI_PSP_Notification_Type__c == notificationType &&
		taskDate == thresholdDate);
	}
	/**
	 * @description
	 * Checks if a Task record belongs to one of the specified categories: 'Symptom Tracker', 'Prescription', or 'Treatment'.
	 * This method determines if the Task's category matches any of the defined categories.
	 * @param task The Task record to be evaluated.
	 * @return A Boolean value indicating whether the Task belongs to one of the specified categories (true) or not (false).
	 */
	private Boolean isSymptomTrackerOrPrescriptionOrTreatment(Task task) {
		Set<String> categories = new Set<String>{
			BI_PSPB_NotificationConstantsCtrl.actionTypeSymptomTracker,
			BI_PSPB_NotificationConstantsCtrl.actionTypePrescription,
			BI_PSPB_NotificationConstantsCtrl.actionTypeTreatment
		};
		return categories.contains(task.BI_PSP_Category__c) &&
			task.BI_PSPB_Treatment_Type__c != BI_PSPB_NotificationConstantsCtrl.pastDueDateTwo;
	}
	/**
	 * @description
	 * Checks if a Task record belongs to one of the general notification categories.
	 * This method determines if the Task's category is among the predefined set of general categories.
	 * @param task The Task record to be evaluated.
	 * @return A Boolean value indicating whether the Task belongs to one of the general notification categories (true) or not (false).
	 */
	private Boolean isGeneralNotificationCategory(Task task) {
		Set<String> categories = new Set<String>{
			BI_PSPB_NotificationConstantsCtrl.actionTypeTreatment,
			BI_PSPB_NotificationConstantsCtrl.actionTypeChallenges,
			BI_PSPB_NotificationConstantsCtrl.actionTypeSymptomTracker,
			BI_PSPB_NotificationConstantsCtrl.newContentUpdates,
			BI_PSPB_NotificationConstantsCtrl.actionTypeGeneralCommunity,
			BI_PSPB_NotificationConstantsCtrl.treatmentVideo
		};
		return categories.contains(task.BI_PSP_Category__c);
	}
	/**
	 * @description
	 * Checks if a Task record belongs to one of the special categories or has a specific treatment type.
	 * This method evaluates whether the Task's category is in a predefined set of special categories or if the
	 * treatment type is 'Past Due Date2'.
	 * @param task The Task record to be evaluated.
	 * @return A Boolean value indicating whether the Task belongs to a special category or has the specified treatment type (true) or not (false).
	 */
	private Boolean isSpecialCategory(Task task) {
		Set<String> categories = new Set<String>{
			BI_PSPB_NotificationConstantsCtrl.dlqi,
			BI_PSPB_NotificationConstantsCtrl.pss,
			BI_PSPB_NotificationConstantsCtrl.wpai,
			BI_PSPB_NotificationConstantsCtrl.actionTypeQuestionnaires,
			BI_PSPB_NotificationConstantsCtrl.qsqTwo
		};
		return categories.contains(task.BI_PSP_Category__c) ||
			task.BI_PSPB_Treatment_Type__c == BI_PSPB_NotificationConstantsCtrl.pastDueDateTwo;
	}
	/**
	 * @description
	 * This method is called after all batch records have been processed.
	 * It allows for any final operations or clean-up tasks to be performed once the batch processing is complete.
	 * This method is optional and can be used to perform additional actions, such as sending notifications or updating records.
	 * @param bc The context of the batch job being executed.
	 */
	public void finish(Database.BatchableContext bc) {
		BI_PSP_LogMessagesUtility.logError(
			BI_PSPB_NotificationConstantsCtrl.finish,
			BI_PSPB_NotificationStatusExpiredBatch.class.toString(),
			false,
			BI_PSPB_NotificationConstantsCtrl.logInfo
			
		);
	}
}