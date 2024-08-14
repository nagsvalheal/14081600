/**
* @description			This class is used to insert files related to cases by creating ContentDocumentLink records.
*                    	It ensures that files are properly linked to their respective cases and handles errors during the process.
* History:
* Version	Author			Date			Detail			Description
* 1.0		Joyal			05-Dec-2023		Created			Initial development
* 1.1		Joyal			01-Jan-2024		Updated			Update  Database Insert 
* 1.2		Joyal			04-Apr-2024		Updated			Catch log added
* 1.3		Gokul Krishnan	15-Jul-2024		refactored 		The method getContentDocumentLinks will 
															only receive the created caseId, 
															eliminating unnecessary null checks. 
															A utility class will handle error 
															logging and database errors to 
															streamline the process.
*/
public with sharing class BI_PSPB_PatientCasesFilesCtrl {
	//Store the error message custom labels
	private static String errorMsg = '';
	/**
* @description		Method to create ContentDocumentLinks for uploading files related to a case record
* @param			fileIds (List<String>)-  this string store the file ids. 
* @param			caseId (Id) this string store the related account ids.
This method used in BI_PSPB_InsertCaserecordforUpdateRx apex.
*/
	public static void getContentDocumentLinks(
		List<String> fileIds,
		string caseId
	) {
		// List to hold ContentDocumentLink records to be inserted.
		List<ContentDocumentLink> fileLinks = new List<ContentDocumentLink>();
		try {
			// The values in the fileIds can be null.Hence null check is not done.
			if (String.isNotBlank(caseId)) {
				// Loop through the list of fileIds provided.
				for (String fileId : fileIds) {
					// Create a ContentDocumentLink record for each fileId.
					ContentDocumentLink link = new ContentDocumentLink(
						ContentDocumentId = fileId,
						LinkedEntityId = caseId,
						ShareType = BI_PSPB_PrescriptionConstantCtrl.shareType // 'V' for sharing the file with the record.
					);
					fileLinks.add(link); // Add the ContentDocumentLink record to the list.
				}
				// Check if there are ContentDocumentLink records to be inserted.
			if(!fileLinks.isEmpty()){
				BI_PSP_DatabaseOperationsUtility.insertOperation(
					new List<ContentDocumentLink>{ fileLinks[0] },
					BI_PSPB_PatientCasesFilesCtrl.class.toString(),
					true
				);
				}
			}
		} catch (Exception ex) {
			BI_PSP_LogMessagesUtility.exceptionLogMessage(
				BI_PSPB_PrescriptionConstantCtrl.errorForInsert,
				BI_PSPB_PatientCasesFilesCtrl.class.toString(),
				ex
			);
		}
	}
}