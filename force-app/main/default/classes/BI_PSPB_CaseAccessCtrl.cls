/**
@description Case creation for account deletion request and account access request by patients
History:
Version    Author               Date              Detail         Description
1.0        Divya Bharathi S     6-Dec-2023        Created        Initial development
1.1        Divya Bharathi S     08-Apr-2024       Updated        Add null check
1.2        Divya Bharathi S     18-Apr-2024       Updated        Add Log
*/
public with sharing class BI_PSPB_CaseAccessCtrl {
  /**
  @description This method creates a case for account access based on the user's role.
  This method is used in biPspbPatientProfiledetails and biPspbCgPatientinfo LWC component.
  */
  @AuraEnabled
public static void createAccessCase() {
  try {
      String currentUserName = UserInfo.getName();
      String currentUserEmail = UserInfo.getUserEmail();

      User currentUser = getCurrentUser(currentUserName, currentUserEmail);
      List<Account> relatedAccounts = getRelatedAccounts(currentUser, currentUserName, currentUserEmail);

      if (relatedAccounts.isEmpty()) {
        BI_PSP_LogMessagesUtility.logError(BI_PSPB_ProfileManagerConstCtrl.accountMessage,BI_PSPB_CaseAccessCtrl.class.toString(),TRUE, BI_PSPB_ProfileManagerConstCtrl.LOG_SEVERITY_ERROR);
      }
      Id recordTypeId = getCaseRecordTypeId();
      List<Case> casesToInsert = createCases(relatedAccounts, currentUser.Id, recordTypeId);

      if (!casesToInsert.isEmpty()) { saveCases(casesToInsert);
      }
  } catch (Exception ex) {
    BI_PSP_LogMessagesUtility.exceptionLogMessage(BI_PSPB_ProfileManagerConstCtrl.insertError,BI_PSPB_CaseAccessCtrl.class.toString(),ex);
      
  }
}

public static User getCurrentUser(String currentUserName, String currentUserEmail) {
  String sObjectType = 'User';
  String fields = 'Id, Name, Email, BI_PSPB_Caregiver__c';
  String conditions = 'Name = \'' + currentUserName + '\' AND Email = \'' + currentUserEmail + '\'';
  Boolean withUserMode = true; 

  List<SObject> sObjectList = BI_PSP_CommonQueryUtility.executeQuery(sObjectType, fields, conditions, withUserMode);

  List<User> userList = (List<User>) sObjectList;
  if (!userList.isEmpty()) {
      return userList[0];
   
  } else {  return null;
  }
}

public static List<Account> getRelatedAccounts(User currentUser, String currentUserName, String currentUserEmail) {
  List<Account> relatedAccounts = new List<Account>();

  if (currentUser.BI_PSPB_Caregiver__c) {
    String sObjectType = 'Account';
    String fields = 'Id, Name, PersonEmail, BI_PSPB_Selected_Patient_ID__c';
    String conditions = 'Name = \'' + currentUserName + '\' AND PersonEmail = \'' + currentUserEmail + 
                        '\' AND IsPersonAccount = TRUE AND BI_PSPB_Selected_Patient_ID__c != NULL';
    Boolean withUserMode = true;

    List<SObject> sObjectList = BI_PSP_CommonQueryUtility.executeQuery(sObjectType, fields, conditions, withUserMode);
    List<Account> selectedPatientAccounts = (List<Account>) sObjectList;

    if (!selectedPatientAccounts.isEmpty()) {

        sObjectType = 'Account'; fields = 'Id, Name, PersonEmail';
        conditions = 'Id = \'' + selectedPatientAccounts[0].BI_PSPB_Selected_Patient_ID__c + '\'';

        sObjectList = BI_PSP_CommonQueryUtility.executeQuery(sObjectType, fields, conditions, withUserMode);
        relatedAccounts = (List<Account>) sObjectList;
    }
} else {
    String sObjectType = 'Account';
    String fields = 'Id, Name, PersonEmail';
    String conditions = 'PersonEmail = \'' + currentUserEmail + 
                        '\' AND Name = \'' + currentUserName + '\'';
    Boolean withUserMode = true; 

    List<SObject> sObjectList = BI_PSP_CommonQueryUtility.executeQuery(sObjectType, fields, conditions, withUserMode);
    relatedAccounts = (List<Account>) sObjectList;
}
  return relatedAccounts;
}
public static Id getCaseRecordTypeId() {

     Id recordTypeId = BI_PSP_CommonQueryUtility.retrieveRecordTypeId('Case',BI_PSPB_ProfileManagerConstCtrl.caseRecordType);
  
  if (String.isBlank(recordTypeId)) {
    BI_PSP_LogMessagesUtility.logError(BI_PSPB_ProfileManagerConstCtrl.accountMessage,BI_PSPB_CaseAccessCtrl.class.toString(),TRUE, BI_PSPB_ProfileManagerConstCtrl.LOG_SEVERITY_ERROR);
  } return recordTypeId;
}
public static List<Case> createCases(List<Account> relatedAccounts, Id ownerId, Id recordTypeId) {
  List<Case> casesToInsert = new List<Case>();

  for (Account relatedAccount : relatedAccounts) {
      Case newCase = new Case();
      newCase.Subject = BI_PSPB_ProfileManagerConstCtrl.accessReq;
      newCase.Description = BI_PSPB_ProfileManagerConstCtrl.accessReq;
      newCase.BI_PSP_Type__c = BI_PSPB_ProfileManagerConstCtrl.accessReq;
      newCase.Priority = BI_PSPB_ProfileManagerConstCtrl.medium;
      newCase.OwnerId = ownerId;
      newCase.AccountId = relatedAccount.Id;
      newCase.RecordTypeId = recordTypeId;
      casesToInsert.add(newCase);
  } return casesToInsert;
}

public static void saveCases(List<Case> casesToInsert) {
  BI_PSP_DatabaseOperationsUtility.insertOperation( casesToInsert ,BI_PSPB_CaseAccessCtrl.class.toString(),FALSE);

}
  /**
   * @description Retrieves the checkbox values for a given case record.
   *              This method is used in biPspbPatientProfiledetails and biPspbCgPatientinfo LWC components.
   * @param relatedAccounts The Id of the related account.
   * @return The Case record containing checkbox values if found; otherwise, null.
   */
  @AuraEnabled(cacheable=true)
  public static Case checkboxPersonalAccess(String relatedAccounts) {
      Case caseRecord;
      try {
          if (String.isBlank(relatedAccounts)) {
            BI_PSP_LogMessagesUtility.logError(BI_PSPB_ProfileManagerConstCtrl.caseAccess, BI_PSPB_CaseAccessCtrl.class.toString(),false,BI_PSPB_ProfileManagerConstCtrl.LOG_SEVERITY_ERROR);
          }

String sObjectType = 'Case';
String fields = 'Id, BI_PSP_Personal_Information_Request__c, BI_PSP_Account_Deletion_Request__c';
String conditions = 'AccountId = \'' + relatedAccounts + 
                    '\' AND BI_PSP_Type__c = \'' + BI_PSPB_ProfileManagerConstCtrl.accessReq + '\'';
Boolean withUserMode = true; 

List<SObject> sObjectList = BI_PSP_CommonQueryUtility.executeQuery(sObjectType, fields, conditions, withUserMode);

List<Case> casesList = (List<Case>) sObjectList;

if (!casesList.isEmpty()) {
    caseRecord = casesList[0];
}
          if (caseRecord == null) {
            BI_PSP_LogMessagesUtility.logError(BI_PSPB_ProfileManagerConstCtrl.caseAccess, BI_PSPB_CaseAccessCtrl.class.toString(),false,BI_PSPB_ProfileManagerConstCtrl.LOG_SEVERITY_ERROR);
              return null;
          }
    
      } catch (Exception ex) {
        BI_PSP_LogMessagesUtility.exceptionLogMessage(BI_PSPB_ProfileManagerConstCtrl.caseAccess, BI_PSPB_CaseAccessCtrl.class.toString(),ex);
      }
      return caseRecord;
  }    
}