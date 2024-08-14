/**
 * @description This class implements the Schedulable interface to perform scheduled actions related to date and time.This class is used for the
 * CRM Analytics in the CRM Analytics it should get date everyday that is the use of this class it will generate the date every day and insert the date in this
 * BI_PSPB_DateTimeDimension__c object as a record .
 * History
 * Version 	Author		Date			Detail		Description
 * 1.0		Rajaa		01-Apr-2024		Created		This was an intial development.
 * 1.1		Rajaa		06-Apr-2024		Updated		Code Review Changes.
 */
public with sharing class BI_PSPB_DateTimeSched implements Schedulable {
    public static String insertError = System.Label.BI_PSPB_InsertError;
      public static final String LOG_SEVERITY_ERROR  = System.Label.BI_PSP_ErrorSeverity;
	/**
	 * @description  Executes the scheduled job to insert a record containing the current date into the BI_PSPB_DateTimeDimension__c object.
	 * @param ctx The context in which the job is executed.
	 */
    
	public void execute(SchedulableContext ctx) {
		try {
			Datetime currentDateTime = System.now();
			Date currentDate = currentDateTime.date();
			List<BI_PSPB_DateTimeDimension__c> dateObjsToInsert = new List<BI_PSPB_DateTimeDimension__c>();
			BI_PSPB_DateTimeDimension__c newObj = new BI_PSPB_DateTimeDimension__c();
			newObj.Name = string.valueof(currentDate);
			newObj.BI_PSPB_Date__c = currentDate;
			dateObjsToInsert.add(newObj);
			//System.now value is stored in dateObjsToInsert list and so it can never be empty. So nullcheck is not done
			BI_PSP_DatabaseOperationsUtility.insertOperation(dateObjsToInsert,BI_PSPB_DateTimeSched.class.toString(),True);

			 
		} catch (Exception ex) { 
			 BI_PSP_LogMessagesUtility.logError(insertError,BI_PSPB_DateTimeSched.class.toString(),false,LOG_SEVERITY_ERROR);
		}
	}
}