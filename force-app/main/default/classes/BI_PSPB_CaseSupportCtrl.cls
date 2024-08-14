/*** @description This class provides support for managing the My Cases page. It is responsible for retrieving and displaying case records.
 * History
 * Version   Author   Date         Detail          Description
 * 1.0       Rajaa    20-Dec-2024  Created         Initial development.
 * 1.1       Rajaa    06-Apr-2024  Updated         Code review changes. */

 public with sharing class BI_PSPB_CaseSupportCtrl {
	
	/** * @description Retrieves a list of cases based on the provided filter criteria, including type, status, and account Id.
	 * Queries the Case object and returns matching records. The query uses the CareProgramEnrollee lookup field, so user mode cannot be added here.
	 * @param type The type of cases to retrieve. Pass 'all' to retrieve all types.
	 * @param status The status of cases to retrieve. Pass 'all' to retrieve cases with all statuses.
	 * @return A list of Case records matching the provided filter criteria. This return is used in the BI_PSPB_CaseSupportCtrl component.
	 */
	@AuraEnabled(cacheable=true)
	public static List<Case> getCases(String type, String status) {
		String programId = BI_PSP_CurrentUser.getEnrolleeRecords()[0].Id;
		String enrolleeFields = 'Id, AccountId';
		String enrolleeConditions = 'Id = \'' + programId + '\' LIMIT 1';
		Boolean withUserMode = false;

		List<SObject> enrolleeResults = BI_PSP_CommonQueryUtility.executeQuery(
			'CareProgramEnrollee',
			enrolleeFields,
			enrolleeConditions,
			withUserMode
		);
		if (enrolleeResults.isEmpty()) {
			BI_PSP_LogMessagesUtility.logError(
				BI_PSPB_SupportCenterConstantsCtrl.errorMsgCaseRecordNotFound,
				BI_PSPB_CaseSupportCtrl.class.toString(),
				false,
				BI_PSPB_SupportCenterConstantsCtrl.logError
			);
			return null;
		}

		CareProgramEnrollee careProgram = (CareProgramEnrollee) enrolleeResults[0];
		Id accountId = careProgram.AccountId;

		List<SObject> caseResults = buildCaseQuery(accountId, status, type);

		if (caseResults.isEmpty()) {
			BI_PSP_LogMessagesUtility.logError(
				BI_PSPB_SupportCenterConstantsCtrl.errorMsgCaseRecordNotFound,
				BI_PSPB_CaseSupportCtrl.class.toString(),
				false,
				BI_PSPB_SupportCenterConstantsCtrl.logError
			);
			return null;
		}
		return (List<Case>) caseResults;
	}

	private static List<SObject> buildCaseQuery(
		Id accountId,
		String status,
		String type
	) {
		String caseFields = 'Id, CaseNumber, Subject, Status, Priority, Type, BI_PSP_Patient__c, BI_PSPB_Sub_Type__c, Description, CreatedDate';
		String caseConditions =
			'AccountId = \'' +
			accountId +
			'\' AND RecordType.Name = \'' +
			BI_PSPB_SupportCenterConstantsCtrl.supportCenter +
			'\'';

		String query =
			'SELECT ' +
			caseFields +
			' FROM Case WHERE ' +
			caseConditions;

		String statusFilter = buildStatusFilter(status);
		String typeFilter = buildTypeFilter(type);

		if (!String.isBlank(statusFilter)) {
			query += statusFilter;
		}
		if (!String.isBlank(typeFilter)) {
			query += typeFilter;
		}

		query += ' ORDER BY CreatedDate DESC LIMIT 10000';

		Boolean withUserMode = false;
		return BI_PSP_CommonQueryUtility.executeComplexQuery(
			query,
			withUserMode
		);
	}

	private static String buildStatusFilter(String status) {
		if (String.isBlank(status)) {
			return '';
		}
	switch on status.toLowerCase() {
        when 'all' {
            return ' AND (Status = \'Submitted\' OR Status = \'Draft\' OR Status = \'Need More Information\')';
        }
        when 'draft' {
            return ' AND (Status = \'Draft\' OR Status = \'Need More Information\')';
        }
        when 'submitted' {
            return ' AND (Status = \'Submitted\')';
        }
        when else {
            return ' AND Status = \'' + status + '\'';
        }
    }
}

	private static String buildTypeFilter(String type) {
        if (String.isBlank(type)) {
			return '';
		}
	switch on type.toLowerCase() {
        when 'all' {
            return ' AND (type = \'Medical Information Enquiry\' OR type = \'Report an Adverse Events\' OR type = \'PSP Platform Support\')';
        }
        when 'medical information enquiry' {
            return ' AND (type = \'Medical Information Enquiry\')';
        }
        when 'report adverse events' {
            return ' AND (type = \'Report an Adverse Events\')';
        }
        when 'psp platform support' {
            return ' AND (type = \'PSP Platform Support\')';
        }
        when else {
            return ' AND Type = \'' + type + '\'';
        }
    }
}
    
	/** * @description Retrieves the details of a specific Case record identified by the caseId parameter.
	 * Queries the Case object and returns the corresponding Case record with various details.
	 * @param caseId The Id of the Case record to retrieve details for.
	 * @return The Case record containing details such as Id, Subject, Type, Description, Status, Sub-Type, Created Date, and Created By Id. */
	@AuraEnabled
	public static Case getCaserecord(Id caseId) {
		if (caseId == null) {
			BI_PSP_LogMessagesUtility.logError(
				BI_PSPB_SupportCenterConstantsCtrl.parameterError,
				BI_PSPB_CaseSupportCtrl.class.toString(),
				false,
				BI_PSPB_SupportCenterConstantsCtrl.logError
			);
			return null;
		}
		String caseFields = 'Id, Subject, Type, Description, Status, BI_PSPB_Sub_Type__c, CreatedDate, CreatedBy.Name';
		String caseConditions = 'Id = \'' + caseId + '\'';
		Boolean withUserMode = true;
		List<SObject> results = BI_PSP_CommonQueryUtility.executeQuery(
			'Case',
			caseFields,
			caseConditions,
			withUserMode
		);
		if (results.isEmpty()) {
			BI_PSP_LogMessagesUtility.logError(
				BI_PSPB_SupportCenterConstantsCtrl.errorMsgCaseRecordNotFound,
				BI_PSPB_CaseSupportCtrl.class.toString(),false,BI_PSPB_SupportCenterConstantsCtrl.logError
			);
			return null;
		}
		return (Case) results[0];
	}

	/** * @description Retrieves the base64 encoded image data associated with the provided caseId.
	 * If image data is found, it is returned as a base64 encoded string. If no image data is found, an empty string is returned.
	 * @param caseId The Id of the Case for which to retrieve the image data.
	 * @return A base64 encoded string representing the image data, or an empty string if no image data is found.*/

	// @AuraEnabled(cacheable=true)
	// public static String getBaseImage(Id caseId) {
	// 	if (caseId == null) {
	// 		BI_PSP_LogMessagesUtility.logError(
	// 			BI_PSPB_SupportCenterConstantsCtrl.parameterError,
	// 			BI_PSPB_CaseSupportCtrl.class.toString(),false,BI_PSPB_SupportCenterConstantsCtrl.logError
	// 		);
	// 	}
	// 	ContentDocumentLink contentDoc = getContentDocumentId(caseId);
	// 	if (contentDoc == null) {
	// 		BI_PSP_LogMessagesUtility.logError(
	// 			BI_PSPB_SupportCenterConstantsCtrl.errorMsgCaseRecordNotFound,
	// 			BI_PSPB_CaseSupportCtrl.class.toString(),
	// 			false,
	// 			BI_PSPB_SupportCenterConstantsCtrl.logError
	// 		);
	// 	}
	// 	return getImage(contentDoc);
	// }

	public class ImageWrapper {
		@AuraEnabled
		public String base64Image { get; set; }
		@AuraEnabled
		public String title { get; set; }
		@AuraEnabled
    public String fileType { get; set; } // Add fileType property

	
		public ImageWrapper(String base64Image, String title,String fileType) {
			this.base64Image = base64Image;
			this.title = title;
			this.fileType = fileType; 
		}
	}
	@AuraEnabled(cacheable=true)
public static ImageWrapper getBaseImage(Id caseId) {
    if (caseId == null) {
        BI_PSP_LogMessagesUtility.logError(
            BI_PSPB_SupportCenterConstantsCtrl.parameterError,
            BI_PSPB_CaseSupportCtrl.class.toString(), 
            false, 
            BI_PSPB_SupportCenterConstantsCtrl.logError
        );
        return null;
    }
    ContentDocumentLink contentDoc = getContentDocumentId(caseId);
    if (contentDoc == null) {
        BI_PSP_LogMessagesUtility.logError(
            BI_PSPB_SupportCenterConstantsCtrl.errorMsgCaseRecordNotFound,
            BI_PSPB_CaseSupportCtrl.class.toString(),
            false,
            BI_PSPB_SupportCenterConstantsCtrl.logError
        );
        return null;
    }
    return getImage(contentDoc);
}


// private static ImageWrapper getImage(ContentDocumentLink contentDoc) {
//     String sObjectType = 'ContentVersion';
//     String ContentId = contentDoc.ContentDocumentId;
//     String fields = 'VersionData, Title, FileType';
//     String conditions = 
//         'ContentDocumentId = \'' + ContentId + 
//         '\' AND FileType IN (\'jpg\', \'png\', \'pdf\') WITH USER_MODE ORDER BY CreatedDate DESC LIMIT 1';
//     Boolean withUserMode = false;

//     // Use the utility method to execute the query
//     List<SObject> results = BI_PSP_CommonQueryUtility.executeQuery(
//         sObjectType,
//         fields,
//         conditions,
//         withUserMode
//     );
//     List<ContentVersion> contents = (List<ContentVersion>) results;
//     System.debug(contents + ' contents');

//     if (contents.isEmpty() || contents[0].VersionData == null) {
//         BI_PSP_LogMessagesUtility.logError(
//             BI_PSPB_SupportCenterConstantsCtrl.error,
//             BI_PSPB_CaseSupportCtrl.class.toString(),
//             false,
//             BI_PSPB_SupportCenterConstantsCtrl.logError
//         );
//         return null;
//     }
    
//     String base64Image = BI_PSPB_SupportCenterConstantsCtrl.baseImage + EncodingUtil.base64Encode(contents[0].VersionData);
//     String title = contents[0].Title;
// 	String fileType = contents[0].FileType;
//     System.debug(title + ' BI_PSPB_SupportC');
    
//     return new ImageWrapper(base64Image, title,fileType);
// }

private static ImageWrapper getImage(ContentDocumentLink contentDoc) {
    String sObjectType = 'ContentVersion';
    String ContentId = contentDoc.ContentDocumentId;
    String fields = 'VersionData, Title, FileType';
    String conditions = 
        'ContentDocumentId = \'' + ContentId + 
        '\' AND FileType IN (\'jpg\', \'png\', \'pdf\') WITH USER_MODE ORDER BY CreatedDate DESC LIMIT 1';
    Boolean withUserMode = false;

    List<SObject> results = BI_PSP_CommonQueryUtility.executeQuery(
        sObjectType,
        fields,
        conditions,
        withUserMode
    );
    List<ContentVersion> contents = (List<ContentVersion>) results;

    if (contents.isEmpty() || contents[0].VersionData == null) {
        BI_PSP_LogMessagesUtility.logError(
            BI_PSPB_SupportCenterConstantsCtrl.error,
            BI_PSPB_CaseSupportCtrl.class.toString(),
            false,
            BI_PSPB_SupportCenterConstantsCtrl.logError
        );
        return null;
    }

    String base64Image = BI_PSPB_SupportCenterConstantsCtrl.baseImage + EncodingUtil.base64Encode(contents[0].VersionData);
    String title = contents[0].Title;
    String fileType = contents[0].FileType; // Get the file type
    
    return new ImageWrapper(base64Image, title, fileType);
}


	/** * @description Retrieves the ContentDocumentId related to the provided caseId.
	 * @param caseId The Id of the Case for which to retrieve the ContentDocumentId.
	 * @return The ContentDocumentId associated with the Case, or null if no document link is found.*/

	private static ContentDocumentLink getContentDocumentId(Id caseId) {
		String fields = 'ContentDocumentId,ContentDocument.Title';
		String sObjectType = 'ContentDocumentLink';
		String conditions =
			'LinkedEntityId = \'' +
			caseId +
			'\' AND ContentDocument.FileType IN (\'jpg\', \'png\', \'pdf\') WITH USER_MODE ORDER BY SystemModstamp DESC LIMIT 1';
		Boolean withUserMode = false; // Enforce sharing rules

		// Use the utility method to execute the query
		List<SObject> results = BI_PSP_CommonQueryUtility.executeQuery(
			sObjectType,
			fields,
			conditions,
			withUserMode
		);
        System.debug('Results: ' + results);
		List<ContentDocumentLink> docLinks = (List<ContentDocumentLink>) results;
		System.debug('docLinks: ' + docLinks);
		return docLinks.isEmpty() ? null : docLinks[0];
	}

	/** * @description Retrieves the base64 encoded image data from the ContentVersion based on the provided ContentDocumentId.
	 * @param contentDocumentId The Id of the ContentDocument to retrieve image data for.
	 * @return A base64 encoded string representing the image data, or an empty string if no image data is found. */
	// private static String getImage(ContentDocumentLink contentDoc) {
	// 	String sObjectType = 'ContentVersion';
    //     String ContentId= contentDoc.contentDocumentId;
	// 	String fields = 'VersionData,Title,FileType';
	// 	String conditions =
	// 		'ContentDocumentId = \'' +
	// 		ContentId +
	// 		'\' AND FileType IN (\'jpg\', \'png\', \'pdf\') WITH USER_MODE  ORDER BY CreatedDate  DESC LIMIT 1';
	// 	Boolean withUserMode = false;
    //    // String OrderBy = 'ORDER BY CreatedDate DESC  limit 1';

	// 	// Use the utility method to execute the query
	// 	List<SObject> results = BI_PSP_CommonQueryUtility.executeQuery(
	// 		sObjectType,
	// 		fields,
	// 		conditions,
	// 		withUserMode
	// 	);
	// 	List<ContentVersion> contents = (List<ContentVersion>) results;
    //     System.debug(contents+'contents');
        
	// 	if (contents.isEmpty() || contents[0].VersionData == null) {
	// 		BI_PSP_LogMessagesUtility.logError(
	// 			BI_PSPB_SupportCenterConstantsCtrl.error,
	// 			BI_PSPB_CaseSupportCtrl.class.toString(),false,BI_PSPB_SupportCenterConstantsCtrl.logError
	// 		);
	// 	}
	// 	System.debug(contents[0].Title+'BI_PSPB_SupportC');
	// 	return BI_PSPB_SupportCenterConstantsCtrl.baseImage + EncodingUtil.base64Encode(contents[0].VersionData,contents[0]);
	// }
}