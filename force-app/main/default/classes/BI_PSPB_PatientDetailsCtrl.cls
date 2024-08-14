/**
* @description 	This class is used for getting the data Enrollee Caregiver custom object with patient associated to the caregiver.
				
* History
* Version 	Author		Date			Detail		Description
* 1.0		Anand S		30-Dec-2024		Created		This was an intial development.
* 1.1		Rajaa		06-Apr-2024		Updated		Code Review Changes.
* 1.2		Sowmitha	24-July-2024	Updated		Refactored
*/
public with sharing class BI_PSPB_PatientDetailsCtrl {
	private static String conditions;
	private static String accountError =  BI_PSPB_EnrollmentConstantCtrl.getLabel('ACC_ERROR');
	private static String caregiverError =  BI_PSPB_EnrollmentConstantCtrl.getLabel('ENROLLEE_CAREGIVER_ERROR');
    private static string parameterError =  BI_PSPB_EnrollmentConstantCtrl.getLabel('PARAM_ERROR');
 	/**
     * @description Builds the SOQL conditions string based on the given parameters.
     * @param currentUserName The name of the current user.
     * @param currentUserEmail The email of the current user.
     * @param isActive Indicates whether to include the active status condition.
     * @return A string representing the conditions to be used in the SOQL query.
     */
	public static String buildConditions(String currentUserName, String currentUserEmail,Boolean isActive) {
		String conditions = '';
		conditions += 'BI_PSPB_Caregiver__r.Name = \'' + currentUserName + '\'';
		conditions += ' AND ';
		conditions += 'BI_PSPB_Caregiver__r.PersonEmail = \'' + currentUserEmail + '\'';
		if(isActive)
		{
			conditions += ' AND ';
			conditions += 'BI_PSPB_Status__c = \'' +  BI_PSPB_EnrollmentConstantCtrl.getLabel('ACTIVE') + '\'';

		}
		 
	 	return conditions;

 	}

	/**
     * @description Retrieves the list of caregiver accounts based on the current user's name and email.
     * @param isActive Indicates whether to filter by active status.
     * @return List of BI_PSPB_Enrollee_Caregiver__c records.
     * @throws Exception If there is an issue with the query or processing.
     */
	@AuraEnabled(cacheable=true)
    public static List<BI_PSPB_Enrollee_Caregiver__c> getCareEnrolleeCaregiver(Boolean isActive) {
        List<BI_PSPB_Enrollee_Caregiver__c> enrolleList = new List<BI_PSPB_Enrollee_Caregiver__c>();
        try {
            String currentUserName = UserInfo.getName();
            String currentUserEmail = UserInfo.getUserEmail();
			Boolean withSharingKeywrd = true;
			String fields = 'Id, Name, BI_PSPB_Patient__r.Id, BI_PSPB_Caregiver__c, BI_PSPB_Patient__r.Name,BI_PSPB_Patient__r.BI_PSP_Loginattempt__c, BI_PSPB_Contact_Id__c, BI_PSPB_Status__c';
			conditions = buildConditions(currentUserName,currentUserEmail,isActive);
			List<SObject> sObjectResponses = BI_PSP_CommonQueryUtility.executeQuery('BI_PSPB_Enrollee_Caregiver__c', fields, conditions, withSharingKeywrd);
            for (SObject sObj : sObjectResponses) {
                enrolleList.add((BI_PSPB_Enrollee_Caregiver__c) sObj);
            }
            if (enrolleList.isEmpty()) {
                BI_PSP_LogMessagesUtility.logError(caregiverError,BI_PSPB_PatientDetailsCtrl.class.getName(),true,BI_PSPB_EnrollmentConstantCtrl.getLabel('LOG_SEVERITY_ERROR'));
            }
        } catch (Exception ex) {
            BI_PSP_LogMessagesUtility.exceptionLogMessage(caregiverError, BI_PSPB_PatientDetailsCtrl.class.getName(), ex);
        }
        return enrolleList;
    }

	/**
	 * @description 	Retrieves the caregiver account for the specified account ID.
	 * @param 			accountId The ID of the account for which to retrieve the caregiver account.
	 * @return 			The caregiver account with specified ID, if found; otherwise, null.
	 * 					this return in the biPspbCaregiverpostlogin component
	 */
	@AuraEnabled(cacheable=true)
	public static Account getcaregiverAccountforSwitch(String accountId) {
		Account accountToReturn = new Account();
		try {
			if (String.isBlank(accountId)) {
				BI_PSP_LogMessagesUtility.logError(parameterError,BI_PSPB_PatientDetailsCtrl.class.getName(),true,BI_PSPB_EnrollmentConstantCtrl.getLabel('LOG_SEVERITY_ERROR'));
			}
			String fields = 'Id,BI_PSPB_Selected_Patient_ID__c,BI_PSPB_CaregiverCheck__c';
			conditions = 'Id = \'' + accountId + '\'';
			Boolean withSharingKeywrd = true;
			List<SObject> sObjectResponses = BI_PSP_CommonQueryUtility.executeQuery('Account', fields, conditions, withSharingKeywrd);
			for (SObject sObj : sObjectResponses) {
				accountToReturn = (Account) sObjectResponses[0];
			}
			if(accountToReturn == null)
			{
				BI_PSP_LogMessagesUtility.logError(accountError,BI_PSPB_PatientDetailsCtrl.class.getName(),true,BI_PSPB_EnrollmentConstantCtrl.getLabel('LOG_SEVERITY_ERROR'));
			}
		} catch (Exception ex) {
			BI_PSP_LogMessagesUtility.exceptionLogMessage(accountError,BI_PSPB_PatientDetailsCtrl.class.getName(),ex);
		}
		return accountToReturn;
	}
	/**
	 * @description	 	Updates the selected patient ID and caregiver check for the specified user account.
	 * @param 			userId The ID of the user account to update.
	 * @param 			selectedAccountId The ID of the selected patient account.
	 * @param			check Boolean variable to check caregiver or not
	 * @return 			ContactToUpdate The user account that was updated.this return in the biPspbCaregiverpostlogin component
	 */

	@AuraEnabled(cacheable=false)
	public static Account updateSwitchSelectedPatientID(
		String userId,
		String selectedAccountId,
		Boolean check
	) {
		Account accountToUpdate = new Account();
		try {
			//SelectedAccountId has to be null for SelectedAccountId according to our requirement
			if (
                !String.isBlank(userId) && 
                !String.isBlank(selectedAccountId) && 
                check!=null
            ) {
				accountToUpdate = new Account(Id = userId);
				accountToUpdate.BI_PSPB_Selected_Patient_ID__c = selectedAccountId;
				accountToUpdate.BI_PSPB_CaregiverCheck__c = check;
				BI_PSP_DatabaseOperationsUtility.updateOperation(new List<Account>{ accountToUpdate },BI_PSPB_PatientDetailsCtrl.class.toString(),true);
			} else {
				//Null has to be returned as per the business logic for logout functionality.
				return null;
			}
		} catch (Exception ex) {
			BI_PSP_LogMessagesUtility.exceptionLogMessage(accountError,BI_PSPB_PatientDetailsCtrl.class.getName(),ex);
		}
		return accountToUpdate;
	}
}