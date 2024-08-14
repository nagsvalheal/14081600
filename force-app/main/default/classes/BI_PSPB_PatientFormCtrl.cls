/**
 * @description Class used for retrieving account details.
 * Reason for using without sharing is to ensure that all necessary account records are accessible,
 * regardless of the current user's sharing rules.
 *
 * @history
 * Version    Author      Date              Detail               Description
 * 1.0        Nandha      25-7-2023         Created              Initial development
 */

public with sharing class BI_PSPB_PatientFormCtrl {
 
    
    /**
     * @description Retrieves patient details based on the current user's ID.
     * @return An Account record containing the patient details or null if not found.
     */
    @AuraEnabled(cacheable=true)
    public static Account getPatientInfo() {
        String userEmail = UserInfo.getUserEmail();
        String userName = UserInfo.getName();
        Account patientAccount = null;
        
        try {
            // Fetch the primary account based on user's email and name using Common Query Utility
            List<SObject> accountList = BI_PSP_CommonQueryUtility.executeQuery(
                'Account',
                'Id, FirstName, LastName, PersonEmail, BI_PSPB_Selected_Patient_ID__c',
                'Name = \'' + userName + '\' AND PersonEmail = \'' + userEmail + '\'',
                false
            );

            // Early return if no account is found
            if (accountList.isEmpty()) {
                BI_PSP_LogMessagesUtility.logError(BI_PSPB_ProfileManagerConstCtrl.recordCannotFound,BI_PSPB_PatientFormCtrl.class.toString(),TRUE,BI_PSPB_ProfileManagerConstCtrl.LOG_SEVERITY_ERROR);
              
            }

            // Fetch the related patient account using Common Query Utility
            List<SObject> accountRecord = BI_PSP_CommonQueryUtility.executeQuery(
                'Account',
                'Id, FirstName, LastName, PersonEmail, BI_PSP_Birthdate__c, BI_PSP_Age__c, Phone, HealthCloudGA__Gender__pc, BI_PSPB_Preferred_Communication_Method__c, PersonMailingAddress, PersonMailingCity, PersonMailingCountryCode, PersonMailingPostalCode, PersonMailingStateCode, PersonMailingStreet',
                'Id = \'' + ((Account)accountList[0]).BI_PSPB_Selected_Patient_ID__c + '\'',
                false
            );

            // Early return if no related patient account is found
            if (!accountRecord.isEmpty()) {
               
                patientAccount = (Account)accountRecord[0];
            }
            else{
                BI_PSP_LogMessagesUtility.logError(
				BI_PSPB_ProfileManagerConstCtrl.recordCannotFound,BI_PSPB_PatientFormCtrl.class.toString(),true,BI_PSPB_ProfileManagerConstCtrl.LOG_SEVERITY_ERROR);
            }

            // Return the found patient account
            
        } catch (Exception ex) {
            // Log the exception without throwing it
            BI_PSP_LogMessagesUtility.exceptionLogMessage(BI_PSPB_ProfileManagerConstCtrl.recordCannotFound, BI_PSPB_PatientFormCtrl.class.toString(), ex);
           
        }

        return patientAccount;
    }
}