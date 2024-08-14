/**
 * @description Class used for retrieving account details.
 * Reason for using without sharing is to ensure that all necessary account records are accessible,
 * regardless of the current user's sharing rules.
 *
 * @history
 * Version    Author      Date              Detail               Description
 * 1.0        Nandha      25-7-2023         Created              Initial development
 */
public without sharing class BI_PSPB_AccountDetailsCtrl {
     /**
     * @description Retrieves the details of an account based on the current user's email and name.
     * @return Account object containing the details of the user's account, or null if not found.
     * @throws AuraHandledException if an error occurs during the retrieval process.
     */

    @AuraEnabled(cacheable=true)
    public static Account getAccDetails() {
        Account resultAccount = null;
        String userEmail = UserInfo.getUserEmail();
        String userName = UserInfo.getName();

        try {
            // Define the fields for the query
            String fields = 'Id, FirstName, LastName, BI_PSP_Birthdate__c, HealthCloudGA__Gender__pc, '
                          + 'PersonEmail, BI_PSP_Age__c, Phone, BI_PSPB_Preferred_Communication_Method__c, '
                          + 'PersonMailingCountryCode, PersonMailingStateCode, PersonMailingState, '
                          + 'PersonMailingCity, PersonMailingStreet, PersonMailingPostalCode';

            // Construct the conditions for the query with proper variable binding
            String conditions = 'Name = \'' + userName + '\' AND PersonEmail = \'' + userEmail + '\'';

            // Execute the query using the common utility method with sharing rules enforced
            List<SObject> results = BI_PSP_CommonQueryUtility.executeQuery('Account', fields, conditions, FALSE);

            // Early return if no account is found
            if (!results.isEmpty() && results[0] instanceof Account) {
                resultAccount = (Account) results[0];
            }else{
                // Throwing exception when post is not found.
				BI_PSP_LogMessagesUtility.logError(
					BI_PSPB_ProfileManagerConstCtrl.recordCannotFound,
					BI_PSPB_AccountDetailsCtrl.class.toString(),true,
					BI_PSPB_ProfileManagerConstCtrl.LOG_SEVERITY_ERROR
				);
            }
        } catch (Exception ex) {
            // Log and throw an AuraHandledException if an exception occurs
            BI_PSP_LogMessagesUtility.exceptionLogMessage(BI_PSPB_ProfileManagerConstCtrl.recordCannotFound, BI_PSPB_AccountDetailsCtrl.class.toString(), ex);
          
        }

        return resultAccount;
    }
}