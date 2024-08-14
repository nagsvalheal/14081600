/**
 * @description This class provides methods to retrieve and manage Case records for Care Program Enrollees,
 * focusing on cases with draft status, adverse events, and platform support. It includes error logging
 * and supports usage with Lightning Web Components (LWC) via @AuraEnabled methods. The class enforces
 * sharing rules using "with sharing" to ensure data security.
 *  Version  Author          Date        Detail      Description
 * 59       Niyas       06-01-2024      Created     Initial Version
 * 59       Niyas       18-04-2024      Updated     Code review changes
 * 59       Rajaa       31-07-2024      Updated     Code refactor changes
 */
public with sharing class BI_PSPB_DraftSupportCtrl {
	/**
	 * @description Retrieves the latest draft Case record related to a specified Care Program Enrollee.
	 * @param accountId The Id of the Care Program Enrollee for which to retrieve the draft Case record.
	 * @return The latest draft Case record related to the specified Care Program Enrollee, or null if no matching records are found.
	 */
	@AuraEnabled(cacheable=true)
	public static List<Case> getPSPCaseRecordsMedical(String accountId) {
		if (String.isBlank(accountId)) {
			BI_PSP_LogMessagesUtility.logError(
				BI_PSPB_SupportCenterConstantsCtrl.errorMsgPatientIdNotFound,
				BI_PSPB_DraftSupportCtrl.class.toString(),
				false,
				BI_PSPB_SupportCenterConstantsCtrl.logError
			);
			return null;
		}
		try {
			// Ensure values are properly formatted and escaped
			String statusDraft = String.escapeSingleQuotes(
				BI_PSPB_SupportCenterConstantsCtrl.draft
			); 
			String statusNeedMoreInfo = String.escapeSingleQuotes(
				BI_PSPB_SupportCenterConstantsCtrl.needMoreInfo
			);
			String typeMedicalInfoEnquiry = String.escapeSingleQuotes(
				BI_PSPB_SupportCenterConstantsCtrl.medicalInfoEnquiry
			);

			// Constructing the dynamic query
			String query = 'SELECT Id, BI_PSPB_Sub_Type__c, Description, BI_PSP_Patient__r.AccountId, CreatedDate FROM Case ';
			query +=
				'WHERE Id = \'' +
				String.escapeSingleQuotes(accountId) +
				'\' ';
			query +=
				'AND (Status = \'' +
				statusDraft +
				'\' OR Status = \'' +
				statusNeedMoreInfo +
				'\') ';
			query +=
				'AND Type = \'' +
				typeMedicalInfoEnquiry +
				'\' ORDER BY CreatedDate DESC LIMIT 1';

			// Executing the query
			List<Case> relatedCases = BI_PSP_CommonQueryUtility.executeComplexQuery(
				query,
				false
			);

			if (!relatedCases.isEmpty()) {
				return relatedCases;
			} else { 
				BI_PSP_LogMessagesUtility.logError(
					BI_PSPB_SupportCenterConstantsCtrl.recordCannotFound,
					BI_PSPB_DraftSupportCtrl.class.toString(),
					false,
					BI_PSPB_SupportCenterConstantsCtrl.logError
				);
				return null;
			}
		} catch (Exception ex) {
			BI_PSP_LogMessagesUtility.exceptionLogMessage(
				ex.getMessage(),
				BI_PSPB_DraftSupportCtrl.class.toString(),
				ex
			);
			return null;
		}
	}

	/**
	 *@description  Retrieves the most recent Case record with specific criteria related to adverse events reporting.
	 * @param accountId The Id of the CareProgramEnrollee record associated with the Case.
	 * @return The most recent Case record meeting the criteria, or null if no matching record is found.
	 */

	@AuraEnabled(cacheable=true)
	public static List<Case> getPSPCaseRecordsReport(String accountId) {
		if (String.isBlank(accountId)) {
			BI_PSP_LogMessagesUtility.logError(
				BI_PSPB_SupportCenterConstantsCtrl.errorMsgCaseRecordNotFound,
				BI_PSPB_DraftSupportCtrl.class.toString(),
				false,
				BI_PSPB_SupportCenterConstantsCtrl.logError
			);
			return null;
		}
		try {
			//Since Careprogramenrollee lookup field is used we cannot use USER_MODE here.
			String statusDraft = String.escapeSingleQuotes(
				BI_PSPB_SupportCenterConstantsCtrl.draft
			);
			String statusNeedMoreInfo = String.escapeSingleQuotes(
				BI_PSPB_SupportCenterConstantsCtrl.needMoreInfo
			);
			String typeReportAdverseEvents = String.escapeSingleQuotes(
				BI_PSPB_SupportCenterConstantsCtrl.reportAdverseEvents
			);

			String query = 'SELECT Id,BI_PSPB_Sub_Type__c,Description,BI_PSP_Patient__r.AccountId,CreatedDate FROM Case ';
			query +=
				'WHERE Id = \'' +
				String.escapeSingleQuotes(accountId) +
				'\' ';
			query +=
				'AND (Status = \'' +
				statusDraft +
				'\' OR Status = \'' +
				statusNeedMoreInfo +
				'\') ';
			query +=
				'AND Type = \'' +
				typeReportAdverseEvents +
				'\' ORDER BY CreatedDate DESC LIMIT 1';
			List<Case> relatedCases = BI_PSP_CommonQueryUtility.executeComplexQuery(
				query,
				false
			);

			if (!relatedCases.isEmpty()) {
				return relatedCases;
			} else {
				BI_PSP_LogMessagesUtility.logError(
					BI_PSPB_SupportCenterConstantsCtrl.errorMsgCaseRecordNotFound,
					BI_PSPB_DraftSupportCtrl.class.toString(),
					false,
					BI_PSPB_SupportCenterConstantsCtrl.logError
				);
				return null;
			}
		} catch (Exception ex) {
			BI_PSP_LogMessagesUtility.exceptionLogMessage(
				ex.getMessage(),
				BI_PSPB_DraftSupportCtrl.class.toString(),
				ex
			);
			return null;
		}
	}
	/**
	 *@description  Retrieves a list of draft Case records related to a specified account.
	 * @param accountId The Id of the account for which to retrieve related Case records.
	 * @return A list of draft Case records related to the specified account.
	 */

	@AuraEnabled(cacheable=true)
	public static List<Case> getPSPCaseRecordsPlatformSupport(
		String accountId
	) {
		try {
			if (String.isBlank(accountId)) {
				BI_PSP_LogMessagesUtility.logError(
					BI_PSPB_SupportCenterConstantsCtrl.errorMsgPatientIdNotFound,
					BI_PSPB_DraftSupportCtrl.class.toString(),
					false,
					BI_PSPB_SupportCenterConstantsCtrl.logError
				);
			}
			//Since Careprogramenrollee lookup field is used we cannot use USER_MODE here.
			String statusDraft = String.escapeSingleQuotes(
				BI_PSPB_SupportCenterConstantsCtrl.draft
			);
			String statusNeedMoreInfo = String.escapeSingleQuotes(
				BI_PSPB_SupportCenterConstantsCtrl.needMoreInfo
			);
			String typePlatformSupport = String.escapeSingleQuotes(
				BI_PSPB_SupportCenterConstantsCtrl.platformSupport
			);

			String query = 'SELECT Id,BI_PSPB_Sub_Type__c,Description,BI_PSP_Patient__r.AccountId,CreatedDate FROM Case ';
			query +=
				'WHERE Id = \'' +
				String.escapeSingleQuotes(accountId) +
				'\' ';
			query +=
				'AND (Status = \'' +
				statusDraft +
				'\' OR Status = \'' +
				statusNeedMoreInfo +
				'\') ';
			query +=
				'AND Type = \'' +
				typePlatformSupport +
				'\' ORDER BY CreatedDate DESC LIMIT 1';

			// Executing the query
			List<Case> relatedCases = BI_PSP_CommonQueryUtility.executeComplexQuery(
				query,
				false
			);

			if (!relatedCases.isEmpty()) {
				return relatedCases;
			} else {
				BI_PSP_LogMessagesUtility.logError(
					BI_PSPB_SupportCenterConstantsCtrl.recordCannotFound,
					BI_PSPB_DraftSupportCtrl.class.toString(),
					false,
					BI_PSPB_SupportCenterConstantsCtrl.logError
				);
				return null;
			}
		} catch (Exception ex) {
			BI_PSP_LogMessagesUtility.exceptionLogMessage(
				ex.getMessage(),
				BI_PSPB_DraftSupportCtrl.class.toString(),
				ex
			);
			return null;
		}
	}
}