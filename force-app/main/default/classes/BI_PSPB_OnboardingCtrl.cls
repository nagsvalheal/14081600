/**
 * @description This BI_PSPB_OnboardingCtrl class used to Onboarding the Patient.
 * History:
 * Version  Author          Date            Detail              Description
 * 1.0      Ashif           20-7-2024     Created             Initial development
 */
public with sharing class BI_PSPB_OnboardingCtrl {
	private static String accountError =  BI_PSPB_EnrollmentConstantCtrl.getLabel('ACC_ERROR');
	private static String logSeverityError  = BI_PSPB_EnrollmentConstantCtrl.getLabel('LOG_SEVERITY_ERROR');
	private static String conversionErr =  BI_PSPB_EnrollmentConstantCtrl.getLabel('CONVERSION_ERROR');
 /**
 * @description Converts a list of leads into accounts and updates them if necessary. The method prepares lead conversion operations, executes them, and handles any resulting errors.
 * @param leadIdList - A list of lead IDs that need to be converted.
 */
	public static void convertLead(List<ID> leadIdList) {
		if (leadIdList.isEmpty()) {
			return;
		}
		List<Database.LeadConvert> leadConverts = prepareLeadConverts(leadIdList);
		List<Database.LeadConvertResult> leadConvertResults = Database.convertLead(leadConverts, false);

		Map<Id, Lead> leadMap = mapConvertedLeads(leadConvertResults);
		if (leadMap.isEmpty()) {
			BI_PSP_LogMessagesUtility.logError(conversionErr,BI_PSPB_OnboardingCtrl.class.getName(),false,logSeverityError);
		}

		List<Account> accountsToUpdate = updateAccounts(leadMap);
		if (!accountsToUpdate.isEmpty()) 
		{
			BI_PSP_DatabaseOperationsUtility.updateOperation( accountsToUpdate,BI_PSPB_OnboardingCtrl.class.toString(), FALSE);
		}else{
			BI_PSP_LogMessagesUtility.logError(accountError,BI_PSPB_OnboardingCtrl.class.getName(),false,logSeverityError);
		}

	}

	private static List<Database.LeadConvert> prepareLeadConverts(List<Id> leadIdList) {
		List<Database.LeadConvert> leadConverts = new List<Database.LeadConvert>();
		for (Id leadId : leadIdList) {
			Database.LeadConvert leadConvertRecord = new Database.LeadConvert();
			leadConvertRecord.setLeadId(leadId);
			leadConvertRecord.setConvertedStatus( BI_PSPB_EnrollmentConstantCtrl.getLabel('CONVERTED'));
			leadConvertRecord.bypassaccountdedupecheck = false;
			leadConvertRecord.bypassContactDedupeCheck = false;
			leadConverts.add(leadConvertRecord);
		}
		return leadConverts;
	}

	private static Map<Id, Lead> mapConvertedLeads(List<Database.LeadConvertResult> leadConvertResults) {
		Map<Id, Lead> leadMap = new Map<Id, Lead>();
		Set<Id> leadIds = new Set<Id>();
	
		// Collect all lead IDs for successful conversions
		for (Database.LeadConvertResult result : leadConvertResults) {
			if (result.isSuccess()) {
				leadIds.add(result.getLeadId());
			} else {
				BI_PSP_LogMessagesUtility.logError(conversionErr, BI_PSPB_OnboardingCtrl.class.getName(), false, logSeverityError);
			}
		}
	
		if (!leadIds.isEmpty()) {
            try{
			List<Lead> leads = new List<Lead>();
			String fields = 'Id, FirstName, LastName, Email, MobilePhone, BI_PSPB_Care_Program__c, HealthCloudGA__Gender__c, HealthCloudGA__BirthDate__c, BI_PSPB_Care_Program__r.Name, BI_PSPB_Enrolled_By__c, convertedAccountId, LeadSource, BI_PSPB_Physician_Name__c, BI_PSPB_Preferred_Communication_Method__c';
			List<String> leadIdsList = new List<String>();
			for (Id leadId : leadIds) {
				leadIdsList.add(leadId);
			}
			String leadIdsString = '\'' + String.join(leadIdsList, '\',\'') + '\'';
			String conditions = 'Id IN (' + leadIdsString + ')';
			Boolean withSharingKeywrd = false;
			List<SObject> sObjectResponses = BI_PSP_CommonQueryUtility.executeQuery('Lead', fields, conditions, withSharingKeywrd);
			for (SObject sObj : sObjectResponses) {
				leads.add((Lead) sObj);
			}
	
			// Map the leads by their converted Account Id
			for (Lead lead : leads) {
				leadMap.put(lead.convertedAccountId, lead);
			}
                 } catch (Exception ex) {
            BI_PSP_LogMessagesUtility.logError(conversionErr, BI_PSPB_OnboardingCtrl.class.getName(), false, logSeverityError);
            
        }
		}
	
		return leadMap;
	}
	
/**
 * @description Updates a list of Account records based on the provided map of Lead records. The method retrieves existing Account records, updates their fields with data from the corresponding Leads, and returns the list of updated Account records.
 * @param leadMap Map<Id, Lead> - A map where the key is the ID of the Lead and the value is the corresponding Lead record that contains updated information.
 * @return List<Account> - A list of Account records that have been updated with data from the corresponding Leads.
 */
	public static List<Account> updateAccounts(Map<Id, Lead> leadMap) {
		List<Account> accountsToUpdate = new List<Account>();
		Set<Id> accountIds = new Set<Id>();

		// Collect all account IDs
		for (Lead lead : leadMap.values()) {
			accountIds.add(lead.convertedAccountId);
		}

		// Perform a single SOQL query outside the loop
		if (!accountIds.isEmpty()) {
		
			List<Account> accounts = new List<Account>();
			String fields = 'Id, PersonEmail, FirstName, LastName, HealthCloudGA__Gender__pc, BI_PSP_Birthdate__c, BI_PSPB_Preferred_Communication_Method__c, PersonMobilePhone, BI_PSPB_Enrolled_By__c, BI_PSPB_User_Type__c';
			List<String> accountIdsList = new List<String>();
			for (Id accountId : accountIds) {
				accountIdsList.add(accountId);
			}
			String accountIdsString = '\'' + String.join(accountIdsList, '\',\'') + '\'';
			String conditions = 'Id IN (' + accountIdsString + ')';
			Boolean withSharingKeywrd = true;
			List<SObject> sObjectResponses = BI_PSP_CommonQueryUtility.executeQuery('Account', fields, conditions, withSharingKeywrd);
			for (SObject sObj : sObjectResponses) {
				accounts.add((Account) sObj);
			}
			Map<Id, Account> accountMap = new Map<Id, Account>(accounts);

			// Update the account records based on the leads
			for (Lead lead : leadMap.values()) {
				Account accountRecord = accountMap.get(lead.convertedAccountId);
				if (accountRecord != null) {
					accountRecord.PersonEmail = lead.Email;
					accountRecord.HealthCloudGA__Gender__pc = lead.HealthCloudGA__Gender__c;
					accountRecord.BI_PSP_Birthdate__c = lead.HealthCloudGA__BirthDate__c;
					accountRecord.BI_PSPB_Preferred_Communication_Method__c = lead.BI_PSPB_Preferred_Communication_Method__c;
					accountRecord.PersonMobilePhone = lead.MobilePhone;
					accountRecord.BI_PSPB_Enrolled_By__c = lead.BI_PSPB_Enrolled_By__c;
					accountsToUpdate.add(accountRecord);
				} else {
					BI_PSP_LogMessagesUtility.logError(accountError, BI_PSPB_OnboardingCtrl.class.getName(), false, logSeverityError);
				}
			}
		}

		return accountsToUpdate;
	}


  
}