/** 
 * @description       : A CurrentUser Utility Class for determining user type whether it is a patient or caregiver 
                       and capturing console messages while performing DMLs.
 * History:
 * Version  Author      Date            Detail          Description.
 * 1.0      Abinsha     10-Jul-2024     Created         Initial development.
 * 1.1      Ashif        1-Aug -2024     Updated        Refactor the code
 */
public inherited sharing class BI_PSP_CurrentUser {
	/**
 * @description Returns a list of accounts based on the current user's role.
 * If the user is a caregiver, it returns the associated patient's account.
 * If the user is a patient, it returns the patient's account.
 * 
 * @return List<Account> - A list of Account records. If the user is a caregiver, 
 * it returns the selected patient's account. If the user is a patient, it returns the patient's account.

 */
	@AuraEnabled(cacheable=true)
	public static List<Account> returnTheAccounts() {
		User currentUser = getCurrentUser();

		if (currentUser.BI_PSPB_Caregiver__c) {
			return getCaregiverAccounts();
		} else {
			return getPatientAccounts();
		}
	}
	/**
 * @description Retrieves the current user details.
 * This method fetches the user information from the User object based on the current logged-in user's ID.
 * If no user is found, it logs an error message.
 * 
 * @return User - The current user record.

 */
	@AuraEnabled(cacheable=true)
	public static User getCurrentUser() {
		String sObjectType = 'User';
		String fields = 'Id, Name, LastName, Email, FirstName, BI_PSPB_Caregiver__c, Profile.Name';
		String conditions = 'Id = \'' + UserInfo.getUserId() + '\'';
		Boolean withUserMode = false;

		List<SObject> users = BI_PSP_CommonQueryUtility.executeQuery(
			sObjectType,
			fields,
			conditions,
			withUserMode
		);
		return (User) users[0];
	}

	private static List<Account> getCaregiverAccounts() {
		Account caregiverAccount = getCaregiverAccount();
		if (caregiverAccount == null) {
			BI_PSP_LogMessagesUtility.logError(
				BI_PSP_QuestionnaireConstant.careGiversPatientAccountErr,
				BI_PSP_CurrentUser.class.toString(),
				true,
				BI_PSP_QuestionnaireConstant.LOG_SEVERITY_ERROR
			);
			return new List<Account>();
		}

		Account selectedPatientAccount = getSelectedPatientAccount(caregiverAccount.BI_PSPB_Selected_Patient_ID__c
		);
		if (selectedPatientAccount == null) {
			BI_PSP_LogMessagesUtility.logError(
				BI_PSP_QuestionnaireConstant.careGiversSelectedPatientErrMsg,BI_PSP_CurrentUser.class.toString(),
				true,BI_PSP_QuestionnaireConstant.LOG_SEVERITY_ERROR
			);
			return new List<Account>();
		}

		return new List<Account>{ selectedPatientAccount };
	}

	private static List<Account> getPatientAccounts() {
		Account patientAccount = getPatientAccount();
		if (patientAccount == null) {
			BI_PSP_LogMessagesUtility.logError(
				BI_PSP_QuestionnaireConstant.patientAccountErrorMsg,BI_PSP_CurrentUser.class.toString(),
				true,BI_PSP_QuestionnaireConstant.LOG_SEVERITY_ERROR
			);
			return new List<Account>();
		}

		return new List<Account>{ patientAccount };
	}

	private static Account getCaregiverAccount() {
		String sObjectType = 'Account';
		String fields = 'Id, Name, PersonEmail, BI_PSPB_Selected_Patient_ID__c';
		String conditions =
			'Name = \'' +
			UserInfo.getName() +
			'\' AND ' +
			'PersonEmail = \'' +
			UserInfo.getUserEmail() +
			'\' AND ' +
			'IsPersonAccount = TRUE AND ' +
			'BI_PSPB_User_Type__c = \'Caregiver\'';
		Boolean withUserMode = true;

		List<SObject> accounts = BI_PSP_CommonQueryUtility.executeQuery(
			sObjectType,
			fields,
			conditions,
			withUserMode
		);
		return accounts.isEmpty() ? null : (Account) accounts[0];
	}

	private static Account getSelectedPatientAccount(Id selectedPatientId) {
		String sObjectType = 'Account';
		String fields = 'Id, Name, PersonEmail';
		String conditions = 'Id = \'' + selectedPatientId + '\'';
		Boolean withUserMode = true;

		List<SObject> accounts = BI_PSP_CommonQueryUtility.executeQuery(
			sObjectType,fields,conditions,withUserMode
		);
		return accounts.isEmpty() ? null : (Account) accounts[0];
	}

	private static Account getPatientAccount() {
		String sObjectType = 'Account';
		String fields = 'Id, Name, PersonEmail';
		String conditions =
			'PersonEmail = \'' +
			UserInfo.getUserEmail() +
			'\' AND ' +
			'Name = \'' +
			UserInfo.getName() +
			'\'';
		Boolean withUserMode = true;

		List<SObject> accounts = BI_PSP_CommonQueryUtility.executeQuery(
			sObjectType,
			fields,
			conditions,
			withUserMode
		);
		return accounts.isEmpty() ? null : (Account) accounts[0];
	}
	/**
 * @description Retrieves enrollee records associated with the current user's accounts.
 * This method fetches the enrollee records from the CareProgramEnrollee object based on the associated account's ID.
 * If no enrollees are found, it logs an error message.
 * 
 * @return List<CareProgramEnrollee> - A list of CareProgramEnrollee records associated with the current user's accounts.

 */
	@AuraEnabled(cacheable=true)
	public static List<CareProgramEnrollee> getEnrolleeRecords() {
		List<Account> accounts = returnTheAccounts();
		List<CareProgramEnrollee> enrollees = new List<CareProgramEnrollee>();

		if (!accounts.isEmpty()) {
			String sObjectType = 'CareProgramEnrollee';
			String fields = 'Id, Name, BI_PSP_AvatarUrl__c, BI_PSPB_PatientStatus__c,Account.BI_PSPB_User_Type__c,BI_PSP_Total_Reward_Points__c, BI_PSP_Challenge_Rank__c, BI_PSP_Loginattempt__c, Account.Name';
			String conditions = 'AccountID = \'' + accounts[0].Id + '\'';
			Boolean withUserMode = false; // Set to true if needed

			List<SObject> results = BI_PSP_CommonQueryUtility.executeQuery(
				sObjectType,
				fields,
				conditions,
				withUserMode
			);
			enrollees = (List<CareProgramEnrollee>) results;

			if (enrollees.isEmpty()) {
				BI_PSP_LogMessagesUtility.logError(BI_PSP_QuestionnaireConstant.emptyEnrolleRecrd,
					BI_PSP_CurrentUser.class.toString(),true,BI_PSP_QuestionnaireConstant.LOG_SEVERITY_ERROR
				);
			}
		}

		return enrollees;
	}
}