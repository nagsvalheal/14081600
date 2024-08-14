/**
 * @description The BI_PSPB_CaregiverServiceCtrl class provides a set of methods to manage and retrieve caregiver information
 * within the Salesforce environment. It interacts with various Salesforce objects such as Account, Contact, 
 * and BI_PSPB_Enrollee_Caregiver__c, using SOQL queries to fetch and update records.
*/
public class BI_PSPB_CaregiverServiceCtrl {
    /**
     * @description Fetches a list of Account records by user name and user email.
     * @param userName The name of the user to search for.
     * @param userEmail The email of the user to search for.
     * @return A list of Account records matching the user name and email.
     */
    public static List<Account> fetchAccountByUser(String userName, String userEmail) {
        try{
        String sObjectType = 'Account';
        String fields = 'Id, Name';
        String conditions = 'Name = \'' + String.escapeSingleQuotes(userName) + '\' AND PersonEmail = \'' + String.escapeSingleQuotes(userEmail) + '\'';
        Boolean withUserMode = false; // Set this to true if you need to enforce user mode

        // Call the executeQuery method
        List<SObject> sObjectList = BI_PSP_CommonQueryUtility.executeQuery(sObjectType, fields, conditions, withUserMode);
        
        // Typecast the result to List<Account> and return
        return (List<Account>) sObjectList;
        }catch (Exception ex) {
            BI_PSP_LogMessagesUtility.exceptionLogMessage(
                ex.getMessage(),
                BI_PSPB_ProfileManagerConstCtrl.class.toString(),
                ex
            );
        }
         // Return an empty list if an exception occurs
    return new List<Account>();
    }

    /**
     * @description Fetches the Caregiver ID by Account ID.
     * @param accountId The ID of the account.
     * @return The Caregiver ID if found, otherwise null.
     */
    public static String fetchCaregiverIdByAccountId(Id accountId) {
        // Define the parameters for the executeQuery method
        String sObjectType = 'BI_PSPB_Enrollee_Caregiver__c';
        String fields = 'Id, BI_PSPB_Caregiver__c';
        String conditions = 'BI_PSPB_Caregiver__c = \'' + String.escapeSingleQuotes(accountId) + '\'';
        Boolean withUserMode = false; // Set this to true if you need to enforce user mode

        // Call the executeQuery method
        List<SObject> sObjectList = BI_PSP_CommonQueryUtility.executeQuery(sObjectType, fields, conditions, withUserMode);
        
        // Check if the query returned any results
        if (!sObjectList.isEmpty()) {
            BI_PSPB_Enrollee_Caregiver__c caregiver = (BI_PSPB_Enrollee_Caregiver__c) sObjectList[0];
            if (caregiver.BI_PSPB_Caregiver__c != null) {
                return caregiver.BI_PSPB_Caregiver__c;
            }
        }

        // If no valid caregiver is found, log an error and return null
        BI_PSP_LogMessagesUtility.logError(BI_PSPB_ProfileManagerConstCtrl.recordCannotFound, BI_PSPB_CaregiverServiceCtrl.class.toString(), false, BI_PSPB_ProfileManagerConstCtrl.LOG_SEVERITY_ERROR);
        return null;
    }

    /**
     * * @description Fetches caregiver details by caregiver ID.
     * @param caregiverId The ID of the caregiver.
     * @return A list of Account records with caregiver details.
     */
    public static List<Account> fetchCaregiverDetailsById(String caregiverId) {
        // Define the parameters for the executeQuery method
        String sObjectType = 'Account';
        String fields = 'Id, FirstName, LastName, BI_PSP_Birthdate__c, PersonEmail, Phone, BI_PSPB_Preferred_Communication_Method__c, BI_PSPB_Relationship_to_Patient__c';
        String conditions = 'Id = \'' + String.escapeSingleQuotes(caregiverId) + '\'';
        Boolean withUserMode = false; // Set this to true if you need to enforce user mode

        // Call the executeQuery method
        List<SObject> sObjectList = BI_PSP_CommonQueryUtility.executeQuery(sObjectType, fields, conditions, withUserMode);
        
        // Typecast the result to List<Account> and return
        return (List<Account>) sObjectList;
    }
    

    /**
     * @description Validates if the profile is valid.
     * @param cgprofile The caregiver profile wrapper object.
     * @return True if the profile is valid, otherwise false.
     */
    public static Boolean isProfileValid(BI_PSPB_ProfileManagerCtrl.BI_PSPB_CaregiverDetailsWrapper cgprofile) {
        return cgprofile != null && cgprofile.accountId != null;
    }

    /**
     * @description Fetches an Account record by Account ID.
     * @param accountId The ID of the account.
     * @return A list of Account records matching the account ID.
     */
    public static List<Account> fetchAccountById(Id accountId) {
        // Define the parameters for the executeQuery method
        String sObjectType = 'Account';
        String fields = 'Id, FirstName, LastName, PersonEmail, BI_PSP_Birthdate__c, BI_PSPB_Relationship_to_Patient__c, Phone, BI_PSPB_Preferred_Communication_Method__c';
        String conditions = 'Id = \'' + String.escapeSingleQuotes(accountId) + '\'';
        Boolean withUserMode = false; // Set this to true if needed

        // Call the executeQuery method
        List<SObject> sObjectList = BI_PSP_CommonQueryUtility.executeQuery(sObjectType, fields, conditions, withUserMode);
        
        // Typecast the result to List<Account> and return
        return (List<Account>) sObjectList;
    }

    /**
     * @description Fetches an Enrollee Caregiver record by user name and user email.
     * @param userName The name of the user.
     * @param userEmail The email of the user.
     * @return The first Enrollee Caregiver record matching the user name and email.
     */
    public static BI_PSPB_Enrollee_Caregiver__c fetchEnrolleeCaregiver(String userName, String userEmail) {
        // Define the parameters for the executeQuery method
        String sObjectType = 'BI_PSPB_Enrollee_Caregiver__c';
        String fields = 'Id, BI_PSPB_Patient__r.Id, BI_PSPB_Caregiver__c, BI_PSPB_Contact_Id__r.BI_PSPB_GrantAccess__c, BI_PSPB_Patient__r.Name, BI_PSPB_Contact_Id__c, BI_PSPB_Status__c';
        String conditions = 'BI_PSPB_Patient__r.Name = \'' + String.escapeSingleQuotes(userName) + '\' AND BI_PSPB_Patient__r.PersonEmail = \'' + String.escapeSingleQuotes(userEmail) + '\'';
        Boolean withUserMode = false; // Set this to true if needed

        // Call the executeQuery method
        List<SObject> sObjectList = BI_PSP_CommonQueryUtility.executeQuery(sObjectType, fields, conditions, withUserMode);
        
        // Check if the list is not empty and return the first element
        return !sObjectList.isEmpty() ? (BI_PSPB_Enrollee_Caregiver__c) sObjectList[0] : null;
        
    }

    /**
     * @description Updates an Enrollee Caregiver record.
     * @param ecRecord The Enrollee Caregiver record to update.
    */
    public static void updateEnrolleeCaregiver(BI_PSPB_Enrollee_Caregiver__c ecRecord) {
        BI_PSP_DatabaseOperationsUtility.updateOperation(new List<BI_PSPB_Enrollee_Caregiver__c>{ ecRecord }, BI_PSPB_ProfileManagerCtrl.class.toString(), FALSE);
       
    }

    /**
     * @description Fetches a Contact record by Contact ID.
     * @param contactId The ID of the contact.
     * @return The Contact record matching the contact ID, or null if not found.
     */
    public static Contact fetchContactById(Id contactId) {
        // Define the parameters for the executeQuery method
        String sObjectType = 'Contact';
        String fields = 'Id, FirstName, LastName, Email, BI_PSPB_GrantAccess__c';
        String conditions = 'Id = \'' + String.escapeSingleQuotes(contactId) + '\'';
        Boolean withUserMode = false; // Set this to true if needed

        // Call the executeQuery method
        List<SObject> sObjectList = BI_PSP_CommonQueryUtility.executeQuery(sObjectType, fields, conditions, withUserMode);
        
        // Check if the list is not empty and return the first element
        return !sObjectList.isEmpty() ? (Contact) sObjectList[0] : null;
    }

    /**
     * @description Fetches an Account record by Account ID.
     * @param accountId The ID of the account.
     * @return The Account record matching the account ID, or null if not found.
     */
    public static Account fetchAccountId(Id accountId) {
        // Define the parameters for the executeQuery method
        String sObjectType = 'Account';
        String fields = 'Id, FirstName, LastName, PersonEmail, BI_PSPB_GrantCaregiverAccess__c';
        String conditions = 'Id = \'' + String.escapeSingleQuotes(accountId) + '\'';
        Boolean withUserMode = false; // Set this to true if needed

        // Call the executeQuery method
        List<SObject> sObjectList = BI_PSP_CommonQueryUtility.executeQuery(sObjectType, fields, conditions, withUserMode);
        
        // Check if the list is not empty and return the first element
        return !sObjectList.isEmpty() ? (Account) sObjectList[0] : null;
    }

    /**
     * @description Fetches a list of Enrollee Caregiver records by user email.
     * @param userEmail The email of the user.
     * @return A list of Enrollee Caregiver records matching the user email.
     */
    public static List<BI_PSPB_Enrollee_Caregiver__c> fetchEnrolleeCaregiversByUserEmail(String userEmail) {
        List<SObject> sObjectList;
        try{
        // Define the parameters for the executeQuery method
        String sObjectType = 'BI_PSPB_Enrollee_Caregiver__c';
        String fields = 'Id, BI_PSPB_Contact_Id__c, BI_PSPB_Contact_Id__r.BI_PSPB_GrantAccess__c, BI_PSPB_Status__c';
        String conditions = 'BI_PSPB_Patient__r.PersonEmail = \'' + String.escapeSingleQuotes(userEmail) + '\'';
        Boolean withUserMode = false; // Set this to true if needed

        // Call the executeQuery method
       sObjectList  = BI_PSP_CommonQueryUtility.executeQuery(sObjectType, fields, conditions, withUserMode);

        // Convert the List<SObject> to List<BI_PSPB_Enrollee_Caregiver__c> and return
       
        }
        catch (Exception ex) {
            BI_PSP_LogMessagesUtility.exceptionLogMessage(
                ex.getMessage(),
                BI_PSPB_ProfileManagerConstCtrl.class.toString(),
                ex
            );
            
        }
         return (List<BI_PSPB_Enrollee_Caregiver__c>) sObjectList;
    }

    /**
     * @description Fetches a list of Enrollee Caregiver records by patient account ID.
     * @param accountId The ID of the patient account.
     * @return A list of Enrollee Caregiver records matching the patient account ID.
     */
    public static List<BI_PSPB_Enrollee_Caregiver__c> getCaregiverListByPatientId(Id accountId) {
         // Define the parameters for the executeQuery method
            String sObjectType = 'BI_PSPB_Enrollee_Caregiver__c';
            String fields = 'Id, Name, BI_PSPB_Patient__r.Id, BI_PSPB_Contact_Id__c, BI_PSPB_Contact_Id__r.FirstName, ' +
                            'BI_PSPB_Contact_Id__r.LastName, BI_PSPB_Contact_Id__r.Phone, BI_PSPB_Contact_Id__r.Email, ' +
                            'BI_PSPB_Contact_Id__r.BI_PSPB_Relationship_To_Patient__c, BI_PSPB_Contact_Id__r.BI_PSP_Birthdate__c, ' +
                            'BI_PSPB_Caregiver__c';
            String conditions = 'BI_PSPB_Patient__c = \'' + String.escapeSingleQuotes(accountId) + '\'';
            Boolean withUserMode = false; // Set this to true if needed

            // Call the executeQuery method
            List<SObject> sObjectList = BI_PSP_CommonQueryUtility.executeQuery(sObjectType, fields, conditions, withUserMode);

            // Convert the List<SObject> to List<BI_PSPB_Enrollee_Caregiver__c> and return
            return (List<BI_PSPB_Enrollee_Caregiver__c>) sObjectList;
       
    }

    /**
     * @description Fetches a Contact record by Contact ID.
     * @param contactId The ID of the contact.
     * @return The Contact record matching the contact ID, or null if not found.
     */
    public static Contact getContactById(Id contactId) {
         // Define the parameters for the executeQuery method
            String sObjectType = 'Contact';
            String fields = 'Id, FirstName, LastName, Phone, BI_PSP_Birthdate__c, Email, BI_PSPB_Relationship_To_Patient__c';
            String conditions = 'Id = \'' + String.escapeSingleQuotes(contactId) + '\'';
            Boolean withUserMode = false; // Set this to true if needed

            // Call the executeQuery method
            List<SObject> sObjectList = BI_PSP_CommonQueryUtility.executeQuery(sObjectType, fields, conditions, withUserMode);

            // Convert the List<SObject> to Contact and return the first element
            return (sObjectList.isEmpty()) ? null : (Contact) sObjectList[0];
       
    }

    

    /**
     * @description Fetches an Account record by Account ID.
     * @param accountId The ID of the account.
     * @return The Account record matching the account ID, or null if not found.
     */
    public static Account getAccountvalue(Id accountId) {
        
            // Define the parameters for the executeQuery method
            String sObjectType = 'Account';
            String fields = 'Id, FirstName, LastName, PersonEmail, BI_PSP_Birthdate__c, BI_PSP_Age__c, PersonMobilePhone, Phone, ' +
                            'HealthCloudGA__Gender__pc, BI_PSPB_Preferred_Communication_Method__c, PersonMailingAddress, ' +
                            'PersonMailingCity, PersonMailingCountryCode, PersonMailingPostalCode, PersonMailingStateCode, PersonMailingStreet';
            String conditions = 'Id = \'' + String.escapeSingleQuotes(accountId) + '\'';
            Boolean withUserMode = false; // Set this to true if needed

            // Call the executeQuery method
            List<SObject> sObjectList = BI_PSP_CommonQueryUtility.executeQuery(sObjectType, fields, conditions, withUserMode);

            // Convert the List<SObject> to Account and return the first element
            return sObjectList.isEmpty() ? null : (Account) sObjectList[0];
        
    }
    
    /**
 * Retrieves an Account record based on the provided name and email address.
 *
 * @param userName The name of the user associated with the account.
 * @param userEmail The email address of the user associated with the account.
 * @return The Account record that matches the given name and email, or null if no match is found.
 *
 * @description This method uses the BI_PSP_CommonQueryUtility class to execute a dynamic SOQL query
 *              that retrieves an Account record based on the provided name and email. The method
 *              returns the first matching Account record if found, otherwise it returns null. The
 *              query enforces sharing rules based on the value of the `withUserMode` parameter.
 */
    public static Account getAccountByNameAndEmail(String userName, String userEmail) {
    
        String sObjectType = 'Account';
        String fields = 'Id, Name, PersonEmail';
        String conditions = 'Name = \'' + userName + '\' AND PersonEmail = \'' + userEmail + '\'';
        Boolean withUserMode = true; // Set this based on your specific requirements
        
        List<SObject> results = BI_PSP_CommonQueryUtility.executeQuery(sObjectType, fields, conditions, withUserMode);
        return (Account) results[0];
   
}

    
    
}