/** 
@description Case creation for account deletion request and account access request by patients
History:
Version    Author               Date              Detail         Description
1.0        Divya Bharathi S     6-Dec-2023        Created        Initial development
1.1        Divya Bharathi S     08-Apr-2024       Updated        Add null check
1.2        Divya Bharathi S     18-Apr-2024       Updated        Add Log
*/
public with sharing class BI_PSPB_CaseDeletionCtrl {
    /** 
    @description This method creates a case for account deletion based on the user's role.
    This method is used in biPspbPatientProfiledetails and biPspbCgPatientinfo LWC component.
    */
    @AuraEnabled
public static void createCase() {
    try {
        String currentUserName = UserInfo.getName();
        String currentUserEmail = UserInfo.getUserEmail();

        User currentUser = getCurrentUser(currentUserName, currentUserEmail);
        List<Account> relatedAccounts = getRelatedAccounts(currentUser, currentUserName, currentUserEmail);

        if (relatedAccounts.isEmpty()) {
            BI_PSP_LogMessagesUtility.logError(BI_PSPB_ProfileManagerConstCtrl.accountMessage,BI_PSPB_CaseDeletionCtrl.class.toString(),TRUE, BI_PSPB_ProfileManagerConstCtrl.LOG_SEVERITY_ERROR);
        }
       
         Id recordTypeId = BI_PSP_CommonQueryUtility.retrieveRecordTypeId('Case',BI_PSPB_ProfileManagerConstCtrl.caseRecordType);

        if (String.isBlank(recordTypeId)) {
            BI_PSP_LogMessagesUtility.logError(BI_PSPB_ProfileManagerConstCtrl.insertError,BI_PSPB_CaseDeletionCtrl.class.toString(),TRUE, BI_PSPB_ProfileManagerConstCtrl.LOG_SEVERITY_ERROR);
        }List<Case> casesToInsert = createCases(relatedAccounts, currentUser.Id, recordTypeId);

        if (!casesToInsert.isEmpty()) {saveCases(casesToInsert);
        }

    } catch (Exception ex) {
        BI_PSP_LogMessagesUtility.exceptionLogMessage(BI_PSPB_ProfileManagerConstCtrl.insertError, BI_PSPB_CaseDeletionCtrl.class.toString(),ex);
    }
}
/** 
//  @description Retrieves the current user record based on the user's name and email.
//   @param currentUserName The name of the current user.
//   @param currentUserEmail The email of the current user.
//   @return The User record of the current user.
*/
public static User getCurrentUser(String currentUserName, String currentUserEmail) {

    String sObjectType = 'User';
    String fields = 'Id, Name, Email, BI_PSPB_Caregiver__c';
    String conditions = 'Name = \'' + currentUserName + '\' AND Email = \'' + currentUserEmail + '\'';
    Boolean withUserMode = true;

    List<SObject> sObjectList = BI_PSP_CommonQueryUtility.executeQuery(sObjectType, fields, conditions, withUserMode);

    List<User> userList = (List<User>) sObjectList;
    return userList.isEmpty() ? null : userList[0];
}

/**
//  @description Retrieves the related accounts for the current user. If the user is a caregiver, it retrieves the selected patient account.
//               Otherwise, it retrieves the accounts matching the user's email and name.
//  @param currentUser The current user record.
//  @param currentUserName The name of the current user.
//  @param currentUserEmail The email of the current user.
//  @return A list of related Account records.
 */
public static List<Account> getRelatedAccounts(User currentUser, String currentUserName, String currentUserEmail) {
    List<Account> relatedAccounts = new List<Account>();

    if (currentUser.BI_PSPB_Caregiver__c) {

        String sObjectType = 'Account';
        String fields = 'Id, Name, PersonEmail, BI_PSPB_Selected_Patient_ID__c';
        String conditions = 'Name = \'' + currentUserName + 
                            '\' AND PersonEmail = \'' + currentUserEmail + 
                            '\' AND IsPersonAccount = TRUE AND BI_PSPB_Selected_Patient_ID__c != NULL';
        Boolean withUserMode = true; 

        List<SObject> sObjectList = BI_PSP_CommonQueryUtility.executeQuery(sObjectType, fields, conditions, withUserMode);

        List<Account> selectedPatientAccounts = (List<Account>) sObjectList;
        
        if (!selectedPatientAccounts.isEmpty()) {

            sObjectType = 'Account'; fields = 'Id, Name, PersonEmail';
            conditions = 'Id = \'' + String.escapeSingleQuotes(selectedPatientAccounts[0].BI_PSPB_Selected_Patient_ID__c) + '\'';
            
            sObjectList = BI_PSP_CommonQueryUtility.executeQuery(sObjectType, fields, conditions, withUserMode);

            relatedAccounts = (List<Account>) sObjectList;
        }
    } else {

        String sObjectType = 'Account';
        Boolean withUserMode = true; 
        String fields = 'Id, Name, PersonEmail';
        String conditions = 'PersonEmail = \'' + currentUserEmail + '\' AND Name = \'' + currentUserName + '\'';

        List<SObject> sObjectList = BI_PSP_CommonQueryUtility.executeQuery(sObjectType, fields, conditions, withUserMode);

        relatedAccounts = (List<Account>) sObjectList;
    }
    
    return relatedAccounts;
}
/** 
//  @description Creates a list of Case records for the related accounts.
//  @param relatedAccounts The list of related accounts.
//  @param ownerId The owner Id for the Case records.
//  @param recordTypeId The record type Id for the Case records.
//  @return A list of Case records to be inserted.
*/
public static List<Case> createCases(List<Account> relatedAccounts, Id ownerId, Id recordTypeId) {
    List<Case> casesToInsert = new List<Case>();

    for (Account relatedAccount : relatedAccounts) {
        Case newCase = new Case();
        newCase.Subject = BI_PSPB_ProfileManagerConstCtrl.deletionReq;
        newCase.Description = BI_PSPB_ProfileManagerConstCtrl.deletionReq;
        newCase.BI_PSP_Type__c = BI_PSPB_ProfileManagerConstCtrl.deletionReq;
        newCase.Status = '';
        newCase.Origin = '';
        newCase.Priority = BI_PSPB_ProfileManagerConstCtrl.high;
        newCase.AccountId = relatedAccount.Id;
        newCase.OwnerId = ownerId;
        newCase.RecordTypeId = recordTypeId;
        casesToInsert.add(newCase);
    }

    return casesToInsert;
}
/**
//   @description Saves the list of Case records and handles any errors that occur during the save operation.
//   @param casesToInsert The list of Case records to be inserted.
//   @throws AuraHandledException If there are any errors during the save operation.
 */
public static void saveCases(List<Case> casesToInsert) {
     BI_PSP_DatabaseOperationsUtility.insertOperation( casesToInsert ,BI_PSPB_CaseDeletionCtrl.class.toString(),FALSE);

    if (String.isNotBlank(BI_PSPB_ProfileManagerConstCtrl.errorMsg)) {
        BI_PSP_LogMessagesUtility.logError(BI_PSPB_ProfileManagerConstCtrl.insertError, BI_PSPB_CaseDeletionCtrl.class.toString(),false,BI_PSPB_ProfileManagerConstCtrl.LOG_SEVERITY_ERROR);
    }
}
    /**
    @description Retrieves the checkbox values for a given case record.
    This method is used in biPspbPatientProfiledetails and biPspbCgPatientinfo LWC component.
    @param relatedAccounts The Id of the related account.
    @return The Case record containing checkbox values.
    */
    @AuraEnabled(cacheable=true)
    public static Case checkboxAccountDeletion(String relatedAccounts) {
        // Initialize variables
        try {

            if (String.isBlank(relatedAccounts)) {
                BI_PSP_LogMessagesUtility.logError(BI_PSPB_ProfileManagerConstCtrl.recordCannotFound, BI_PSPB_CaseDeletionCtrl.class.toString(),false,BI_PSPB_ProfileManagerConstCtrl.LOG_SEVERITY_ERROR);
                return null;
            }
            String sObjectType = 'Case';
            String fields = 'Id, BI_PSP_Personal_Information_Request__c, BI_PSP_Account_Deletion_Request__c';
            String conditions = 'AccountId = \'' + String.escapeSingleQuotes(relatedAccounts) + '\' AND BI_PSP_Type__c = \'' + String.escapeSingleQuotes(BI_PSPB_ProfileManagerConstCtrl.deletionReq) + '\'';
            Boolean withUserMode = true; 
    
            // Execute the query using the common method
            List<SObject> sObjectList = BI_PSP_CommonQueryUtility.executeQuery(sObjectType, fields, conditions, withUserMode);

            List<Case> casesList = (List<Case>) sObjectList;

            if (!casesList.isEmpty()) {return casesList[0];
            }
            BI_PSP_LogMessagesUtility.logError(BI_PSPB_ProfileManagerConstCtrl.recordCannotFound, BI_PSPB_CaseDeletionCtrl.class.toString(),false,BI_PSPB_ProfileManagerConstCtrl.LOG_SEVERITY_ERROR );
            return null;
    
        } catch (Exception ex) {
            BI_PSP_LogMessagesUtility.exceptionLogMessage(BI_PSPB_ProfileManagerConstCtrl.caseDelete, BI_PSPB_CaseDeletionCtrl.class.toString(), ex);
            return null;
        }
    }
    
}