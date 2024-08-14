/**
 * @description Controller class for BI_PSPB_Widget, providing methods to fetch treatment reminders associated with a given Care program enrolle .
 * History
 * Version 	Author					Date				Detail		Description
 * 1.0		Anand S					16-Dec-2024			Created		This was an intial development.
 * 1.1		Rajaa					06-Apr-2024			Updated		Code Review Changes.
 * 1.2      Rajaa                   22-July-2024        Updated     Code Refactor.
 */
public with Sharing class BI_PSPB_TreatmentWidgetCtrl {
		/**
		* @description Fetches a list of BI_PSPB_Treatment_Reminder__c records with a non-null Date of Treatment for a given Care program enrolle .
		* @return List of BI_PSPB_Treatment_Reminder__c records.
		* @throws Exception if any error occurs during processing.
		*/
	   @AuraEnabled(cacheable=true)
	   public static List<BI_PSPB_Treatment_Reminder__c> getTasksWithDateOfTreatment() {
		   List<BI_PSPB_Treatment_Reminder__c> tasks;
		   try {
			   String careProgramEnrolleeId = BI_PSP_CurrentUser.getEnrolleeRecords()[0].id;
                if (careProgramEnrolleeId != null) {
			   tasks = getTreatmentReminders(careProgramEnrolleeId);		
                }
               else{
                    BI_PSP_LogMessagesUtility.logError(BI_PSPB_TreatmentConstantsClassCtrl.cpeNotFound, BI_PSPB_TreatmentWidgetCtrl.class.toString(), true, BI_PSPB_TreatmentConstantsClassCtrl.logError);
               }
		   } catch (Exception ex) {
			   BI_PSP_LogMessagesUtility.exceptionLogMessage(ex.getMessage(),BI_PSPB_TreatmentWidgetCtrl.class.toString(),ex);
		   }
		   return tasks;
	   }
   /**
		* @description Retrieves a list of BI_PSPB_Treatment_Reminder__c records for a given CareProgramEnrollee ID.
		* @param careProgramEnrolleeId ID of the CareProgramEnrollee to fetch treatment reminders for.
		* @return List of BI_PSPB_Treatment_Reminder__c records.
		*/
	   private static List<BI_PSPB_Treatment_Reminder__c> getTreatmentReminders(String careProgramEnrolleeId) {
		   String fields = 'Id, BI_PSPB_Subject__c, BI_PSPB_Date_of_Treatment__c, BI_PSPB_Status__c, BI_PSPB_Reminder_Date__c, BI_PSPB_Care_Program_Enrollee__c';
		   String conditions = 'BI_PSPB_Care_Program_Enrollee__c = \'' + careProgramEnrolleeId + '\' ' +
			   'AND BI_PSPB_Date_of_Treatment__c != NULL ' +
			   'AND BI_PSPB_Reminder_Date__c > TODAY ' +
			   'AND BI_PSPB_Reminder_Date__c != TODAY ' +
			   'AND BI_PSPB_Status__c = \'' + BI_PSPB_TreatmentConstantsClassCtrl.actionTypeActive + '\' ' +
			   'ORDER BY BI_PSPB_Reminder_Date__c ASC ' +
			   'LIMIT 1';
		   
		   List<SObject> results = BI_PSP_CommonQueryUtility.executeQuery('BI_PSPB_Treatment_Reminder__c', fields, conditions, false);   
           
		   return (List<BI_PSPB_Treatment_Reminder__c>) results;
	   } 
	  /**
	* @description Retrieves prepopulated values for a given enrolleeId. This includes
	*              the latest treatment date and selected checkboxes.	
	* @return Map<String, Object> A map containing the prepopulated values, including the date of treatment and selected checkboxes.
	* @throws AuraHandledException if an error occurs or if required records are not found.
	*/
	   @AuraEnabled(cacheable=true)
	   public static Map<String, Object> prepopulatedValues() {
		   Map<String, Object> prepopulatedValues = new Map<String, Object>();
		   String enrolleeId = BI_PSP_CurrentUser.getEnrolleeRecords()[0].id;//null check has been handeled in the current user class 		   
		   try {
			 // Retrieve the latest Treatment Reminder record
		   String fields = 'BI_PSPB_Date_of_Treatment__c';
		   String conditions = 'BI_PSPB_Care_Program_Enrollee__c = \'' + enrolleeId + '\' ' +
							   'AND BI_PSPB_Status__c = \'' + BI_PSPB_TreatmentConstantsClassCtrl.actionTypeActive + '\' ' +
							   'ORDER BY CreatedDate DESC ' +
							   'LIMIT 1';
		   List<SObject> results = BI_PSP_CommonQueryUtility.executeQuery('BI_PSPB_Treatment_Reminder__c', fields, conditions, false);		   
		   if (!results.isEmpty()) {
			   BI_PSPB_Treatment_Reminder__c latestTreatmentReminder = (BI_PSPB_Treatment_Reminder__c) results[0];
			   prepopulatedValues.put(BI_PSPB_TreatmentConstantsClassCtrl.dayOfTreatment, latestTreatmentReminder.BI_PSPB_Date_of_Treatment__c);
		   } else {
               BI_PSP_LogMessagesUtility.logError(BI_PSPB_TreatmentConstantsClassCtrl.taskRecNotFound, BI_PSPB_TreatmentWidgetCtrl.class.toString(),false,BI_PSPB_TreatmentConstantsClassCtrl.logError);			   
		   }   
		   // Retrieve checkbox values from CareProgramEnrollee
		   fields = 'BI_PSPB_Selected_Checkboxes__c';
		   conditions = 'Id = \'' + enrolleeId + '\'';
		   results = BI_PSP_CommonQueryUtility.executeQuery('CareProgramEnrollee', fields, conditions, false);
		   
		   if (!results.isEmpty()) {
			   CareProgramEnrollee enrollee = (CareProgramEnrollee) results[0];
			   prepopulatedValues.put(BI_PSPB_TreatmentConstantsClassCtrl.selectedCheckBox, enrollee.BI_PSPB_Selected_Checkboxes__c);
		   } else {
			   BI_PSP_LogMessagesUtility.logError(BI_PSPB_TreatmentConstantsClassCtrl.cpeNotFound, BI_PSPB_TreatmentWidgetCtrl.class.toString(),false,BI_PSPB_TreatmentConstantsClassCtrl.logError);
			   		   }   
		    if (prepopulatedValues.isEmpty()) {
                BI_PSP_LogMessagesUtility.logError(BI_PSPB_TreatmentConstantsClassCtrl.cpeNotFound, BI_PSPB_TreatmentWidgetCtrl.class.toString(),false,BI_PSPB_TreatmentConstantsClassCtrl.logError);			   	
            }
		   
		   } catch (Exception ex) {			 
			   BI_PSP_LogMessagesUtility.exceptionLogMessage(ex.getMessage(),BI_PSPB_TreatmentWidgetCtrl.class.toString(),ex);			   
		   }
		   
	   return prepopulatedValues;
   }
   
	   
   }