/*
 * @description Used for symptomtracker, challenges and community SMS,Email and Insite Notification.
 * History
 * Version		Date		 Author		Description
 * 59		06-01-2024		Niyas		Initial Version
 * 59		12-04-2024		Niyas		Code review changes
 */
public without sharing class BI_PSPB_LetPersonaliseNotification {
/**
 * @description This method ensures that appropriate tasks are created or updated based on the presence of assessments 
 * and existing tasks for the current user. It first retrieves the enrollee ID for the current user and checks for any 
 * existing assessments and tasks. If no assessments and tasks are found, it creates a new task for symptom tracking 
 * or challenges. If assessments exist but no tasks are present, it creates a new task. If existing tasks are found, 
 * it updates the status of the first task found. The method also handles scenarios where the enrollee ID is not found 
 * or any exceptions during execution, logging appropriate error messages.
 * @throws Exception If an error occurs during the creation or updating of tasks.
 */
    @AuraEnabled
    public static void createTaskIfNoAssessment() {
        try {
            String enrolleeId = BI_PSP_CurrentUser.getEnrolleeRecords()[0].id;
                // Check for assessments and existing tasks
                List<Assessment> assessments = getAssessments(enrolleeId);
                List<Task> existingTasks = getExistingTasks(enrolleeId);

                // If no assessments and no existing tasks, create a new task
                if (assessments.isEmpty() && existingTasks.isEmpty()) {
                    createTask(enrolleeId, BI_PSPB_ConstantsClassCtrl.actionTypeNotificatonTypeAction);
                } 
                // If assessments exist but no existing tasks, create a new task
                else if (!assessments.isEmpty() && existingTasks.isEmpty()) {
                    createTask(enrolleeId, BI_PSPB_ConstantsClassCtrl.actionTypeNotificatonTypeAction);
                } 
                // If existing tasks are found, update the status
                else if (!existingTasks.isEmpty()) {
                    Task existingTask = existingTasks[0];
                    existingTask.Status = BI_PSPB_ConstantsClassCtrl.actionTypeNotificatonTypeAction;
                    BI_PSP_DatabaseOperationsUtility.updateOperation(
						new List<Task>{existingTask},
						BI_PSPB_LetPersonaliseNotification.class.toString(),
						false
					);
                }
        } catch (Exception ex) {
			BI_PSP_LogMessagesUtility.logError(
            	ex.getMessage(),
            	BI_PSPB_LetPersonaliseNotification.class.toString()
      			,false
      			,BI_PSPB_NotificationConstantsCtrl.severityError
        	);
		}
    }
/**
 * @description This method retrieves a list of Task records associated with the specified enrollee ID. 
 * It queries for tasks with a subject matching a predefined constant (`BI_PSPB_NotificationConstantsCtrl.assessmentSubject`) 
 * and returns up to one result. The method is used to check for the existence of tasks related to an enrollee 
 * based on the provided subject and enrollee ID.
 * @param enrolleeId The ID of the enrollee whose tasks are being queried.
 * @return A list of Task records that match the specified criteria. If no tasks are found, the list will be empty.
 */
    public static List<Task> getExistingTasks(String enrolleeId) {
        String fields = 'Id, Subject, WhatId';
		String conditions = 'WhatId = \'' + enrolleeId + '\' ' +
            'AND Subject = \'' + BI_PSPB_NotificationConstantsCtrl.assessmentSubject + '\' ' +'LIMIT 1';
		List<SObject> results = BI_PSP_CommonQueryUtility.executeQuery(
			'Task',
			fields,
			conditions,
			false
		);
		return (List<Task>) results; 
    }
/**
 * @description This method creates a new Task record with the specified enrollee ID and status. 
 * It sets the subject, status, category, and notification type for the task based on predefined constants. 
 * After creating the task, it performs an insert operation through the `BI_PSP_DatabaseOperationsUtility` class. 
 * If an error occurs during the insert operation, it logs the error message using the `BI_PSP_LogMessagesUtility` class.
 * @param enrolleeId The ID of the enrollee to associate with the new task.
 * @param status The status to assign to the new task.
 */
     @AuraEnabled(cacheable=true)
    public static void createTask(String enrolleeId, String status) {
        try {
        Task newTask = new Task(
            Subject = BI_PSPB_ConstantsClassCtrl.assessmentSubject,
            Status = status,
            BI_PSP_Category__c = BI_PSPB_ConstantsClassCtrl.actionTypeQuestionnaires,
            BI_PSP_Notification_Type__c = BI_PSPB_ConstantsClassCtrl.actionTypeAction,
            WhatId = enrolleeId
        );
            BI_PSP_DatabaseOperationsUtility.insertOperation(
						new List<Task>{newTask},
						BI_PSPB_LetPersonaliseNotification.class.toString(),
						false
					);
            } catch (Exception ex) {
			BI_PSP_LogMessagesUtility.logError(
            	ex.getMessage(),
            	BI_PSPB_LetPersonaliseNotification.class.toString()
      			,false
      			,BI_PSPB_NotificationConstantsCtrl.severityError
        	);
		}
    }
/**
 * @description This method retrieves a list of Assessment records associated with the specified enrollee ID. 
 * It queries for assessments that have a status of 'in progress', as defined by a constant (`BI_PSPB_NotificationConstantsCtrl.inProgressType`), 
 * and returns up to one result. The method is used to check for ongoing assessments related to an enrollee 
 * based on the provided enrollee ID.
 * @param enrolleeId The ID of the enrollee whose assessments are being queried.
 * @return A list of Assessment records that match the specified criteria. If no assessments are found, the list will be empty.
 */
    public static List<Assessment> getAssessments(String enrolleeId) {
         String fields = 'Id, AssessmentStatus, BI_PSP_CareProgramEnrollee__c';
		String conditions = 'BI_PSP_CareProgramEnrollee__c = \'' + enrolleeId + '\' ' +
            'AND AssessmentStatus = \'' + BI_PSPB_NotificationConstantsCtrl.inProgressType + '\' ' +'LIMIT 1';
		List<SObject> results = BI_PSP_CommonQueryUtility.executeQuery(
			'Assessment',
			fields,
			conditions,
			false
		);
		return (List<Assessment>) results;
    }
}