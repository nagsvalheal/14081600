/**
 * @description       : A BI_PSPB_HandleUtitlites Class for determining Capturing console messages while performing dmls .
 * History:
 * Version  Author      Date            Detail          Description
 * 1.0      Abinsha     10-Jul-2024     Created         Initial development.
 * 1.1      Ashif       16-Jul-2024     Updated         Updated for Dml Capturing.
 */
public inherited sharing class BI_PSP_DatabaseOperationsUtility {
 private static BI_SFCOE_LOG_App_Settings__c settings = BI_SFCOE_LOG_App_Settings__c.getValues('PSPB');
    public static string applicationName = settings != null ? settings.BI_SFCOE_LOG_Application__c : '';
    public static Database.SaveResult[] insertResults;
    public static Database.SaveResult[] updateResults;
    public static Database.SaveResult[] upsertResults;

  
/**
 * @description Inserts a list of SObject records into the database and handles errors.
 * The method supports user mode level access if specified. It returns the results of the insertion operation.
 * If any errors occur during the insertion, a DMLException is thrown with detailed error messages.
 * 
 * @param records List<SObject> A list of SObject records to be inserted.
 * @param className String The name of the class where the insertion is occurring, used for error logging.
 * @param userModeLevel Boolean Indicates whether to use user mode access level during the insertion.
 * 
 * @return Database.SaveResult[] An array of SaveResult objects representing the results of the insertion operation.
 * 
 * @throws DMLException If there are errors during the insertion operation.
 */
 public static Database.SaveResult[] insertOperation(List<SObject> records, String className, Boolean userModeLevel) {
       
     try{
        if (userModeLevel) {
            insertResults = Database.insert(records, true, AccessLevel.USER_MODE);
        } else {
            insertResults = Database.insert(records, true);
        }
       
     }
     catch(DMLException ex)
     {
         throw new DMLException('Unable to Insert : ' +ex.getMessage());
     }
        return insertResults;
    }
   /**
 * @description Updates a list of SObject records in the database and handles errors.
 * The method supports user mode level access if specified. It returns the results of the update operation.
 * If any errors occur during the update, a DMLException is thrown with detailed error messages.
 * 
 * @param records List<SObject> A list of SObject records to be updated.
 * @param className String The name of the class where the update is occurring, used for error logging.
 * @param userModeLevel Boolean Indicates whether to use user mode access level during the update.
 * 
 * @return Database.SaveResult[] An array of SaveResult objects representing the results of the update operation.
 * 
 * @throws DMLException If there are errors during the update operation.
 */ 
  public static Database.SaveResult[] updateOperation(List<SObject> records, String className, Boolean userModeLevel) {
       
     try{
        if (userModeLevel) {
            insertResults = Database.Update(records, true, AccessLevel.USER_MODE);
        } else {
            insertResults = Database.Update(records, true);
        }
       
     }
     catch(DMLException ex)
     {
         throw new DMLException('Unable to Update : ' +ex.getMessage());
     }
        return insertResults;
    }
    /**
 * @description Upserts a list of SObjects in either user mode or system mode.
 *
 * @param records The list of SObject records to upsert.
 * @param className The name of the class invoking this method, typically used for logging or debugging purposes.
 * @param userModeLevel A boolean indicating whether to use user mode (`true`) or system mode (`false`) for the upsert operation.
 * @return A list of Database.UpsertResult objects, representing the results of the upsert operation.
 * @throws DMLException If the upsert operation fails, an exception is thrown with an appropriate error message.
 */
  public static List<Database.UpsertResult> upsertOperation(List<SObject> records, String className, Boolean userModeLevel) {
    List<Database.UpsertResult> upsertResults;
    
    try {
        if (userModeLevel) {
            upsertResults = Database.upsert(records, true, AccessLevel.USER_MODE);
        } else {
            upsertResults = Database.upsert(records, true);
        }
    } catch(DMLException ex) {
        throw new DMLException('Unable to Upsert : ' + ex.getMessage());
    }
    
    return upsertResults;
}
/**
 * @description Deletes a list of SObjects in either user mode or system mode.
 *
 * @param records The list of SObject records to delete.
 * @param className The name of the class invoking this method, typically used for logging or debugging purposes.
 * @param userModeLevel A boolean indicating whether to use user mode (`true`) or system mode (`false`) for the delete operation.
 * @return A list of Database.DeleteResult objects, representing the results of the delete operation.
 * @throws DMLException If the delete operation fails, an exception is thrown with an appropriate error message.
 */
public static List<Database.DeleteResult> deleteOperation(List<SObject> records, String className, Boolean userModeLevel) {
    List<Database.DeleteResult> deleteResults;
    
    try {
        if (userModeLevel) {
            deleteResults = Database.delete(records, true, AccessLevel.USER_MODE);
        } else {
            deleteResults = Database.delete(records, true);
        }
    } catch(DMLException ex) {
        throw new DMLException('Unable to delete: ' + ex.getMessage());
    }
    
    return deleteResults;
}

    
}