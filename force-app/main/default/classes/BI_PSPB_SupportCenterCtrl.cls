/**
 * @description  This class provides methods to support the operations related to Case records,
 *               including updating case details and linking files to cases.
 */
public with sharing class BI_PSPB_SupportCenterCtrl {
   /**
     * @description Updates a Case record with the provided information and links files to it.
     * @param recId The Id of the Case record to update.
     * @param type The new Type value for the Case.
     * @param description The new Description value for the Case.
     * @param fileIds A List of file Ids (ContentDocumentIds) to link to the Case.
     * @return The Id of the updated Case record.
     */
    @AuraEnabled(cacheable=false)
    public static Id updateCase(
        String recId,
        String type,
        String description,
        List<String> fileIds
    ) {
        try {            
            // Check for blank inputs
            if (String.isBlank(recId)  || String.isBlank(description)) {
                BI_PSP_LogMessagesUtility.logError(
                    BI_PSPB_SupportCenterConstantsCtrl.errorMsgCaseRecordNotFound,
						BI_PSPB_SupportCenterCtrl.class.toString(),
						false,
						BI_PSPB_SupportCenterConstantsCtrl.logError
					);
                    return null;
            }                  
            String sObjectType = 'Case';
			String fields = 'Id, Type,BI_PSPB_Sub_Type__c, Description';
			String conditions = 'Id = \'' + recId + '\'';
			Boolean withUserMode = false; // Set this based on your requirement
            List<SObject> results = BI_PSP_CommonQueryUtility.executeQuery(
                sObjectType, 
                fields, 
                conditions, 
                withUserMode
            ); 
            // Handle case not found
            if (results == null) {
                BI_PSP_LogMessagesUtility.logError(
                    BI_PSPB_SupportCenterConstantsCtrl.errorMsgCaseRecordNotFound,
						BI_PSPB_SupportCenterCtrl.class.toString(),
						false,
						BI_PSPB_SupportCenterConstantsCtrl.logError
					);
                   
            }            
            Case supportCaseToUpdate = (Case)results[0];
            // Update the Case record
            supportCaseToUpdate.BI_PSPB_Sub_Type__c = type;
            system.debug(supportCaseToUpdate.BI_PSPB_Sub_Type__c+'supportCaseToUpdate.BI_PSPB_Sub_Type__c');
            supportCaseToUpdate.Description = description;
            supportCaseToUpdate.Status = BI_PSPB_SupportCenterConstantsCtrl.submitted;
            BI_PSP_DatabaseOperationsUtility.updateOperation(
					new List<Case>{ supportCaseToUpdate },
					BI_PSPB_SupportCenterCtrl.class.toString(),
					false
				);
            if (fileIds != null) {
                BI_PSPB_PatientCasesFilesCtrl.getContentDocumentLinks(fileIds, supportCaseToUpdate.Id);
            }
                 
            // Return updated Case Id
            return supportCaseToUpdate.Id;            
        } catch(Exception ex) {
            BI_PSP_LogMessagesUtility.exceptionLogMessage(
				BI_PSPB_SupportCenterConstantsCtrl.recordCannotFound,
				BI_PSPB_SupportCenterCtrl.class.toString(),
				ex
			);
			return null;
        }
    }    
/** * @description Updates a Case record in draft status with the provided information and links files to it.
     * @param recId The Id of the Case record to update.
     * @param type The new Type value for the Case.
     * @param description The new Description value for the Case.
     * @param fileIds A List of file Ids (ContentDocumentIds) to link to the Case.
     * @return The Id of the updated Case record. */
    @AuraEnabled(cacheable=false)
    public static Id updateDraft(
        String recId,
        String type,
        String description,
        List<String> fileIds
    ) {
        try {
            if (
                String.isBlank(recId) ||
                String.isBlank(description)
            ) {
                BI_PSP_LogMessagesUtility.logError(
                    BI_PSPB_SupportCenterConstantsCtrl.errorMsgCaseRecordNotFound,
						BI_PSPB_SupportCenterCtrl.class.toString(),
						false,
						BI_PSPB_SupportCenterConstantsCtrl.logError
					);
                    return null;
            }
            //Since Careprogramenrollee lookup field is used we cannot use USER_MODE here.
            String sObjectType = 'Case';
			String fields = 'Id, Type,BI_PSPB_Sub_Type__c, Description';
			String conditions = 'Id = \'' + recId + '\'';
			Boolean withUserMode = false; // Set this based on your requirement
            List<SObject> results = BI_PSP_CommonQueryUtility.executeQuery(
                sObjectType, 
                fields, 
                conditions, 
                withUserMode
            );
            if (results == null) {
                BI_PSP_LogMessagesUtility.logError(
                    BI_PSPB_SupportCenterConstantsCtrl.errorMsgCaseRecordNotFound,
						BI_PSPB_SupportCenterCtrl.class.toString(),
						false,
						BI_PSPB_SupportCenterConstantsCtrl.logError
					);                    
            }
            Case supportCaseToUpdate = (Case)results[0];
            supportCaseToUpdate.BI_PSPB_Sub_Type__c = type;
            supportCaseToUpdate.Description = description;
            supportCaseToUpdate.Status = BI_PSPB_SupportCenterConstantsCtrl.draft;
            BI_PSP_DatabaseOperationsUtility.updateOperation(
					new List<Case>{ supportCaseToUpdate },
					BI_PSPB_SupportCenterCtrl.class.toString(),
					false
				);
            if (supportCaseToUpdate == null) {
                BI_PSP_LogMessagesUtility.logError(
                    BI_PSPB_SupportCenterConstantsCtrl.errorMsgRecordNotFound,
						BI_PSPB_SupportCenterCtrl.class.toString(),false,BI_PSPB_SupportCenterConstantsCtrl.logError
					);
                   
            }
            if(!fileIds.isEmpty()){
                BI_PSPB_PatientCasesFilesCtrl.getContentDocumentLinks(fileIds,supportCaseToUpdate.Id);
            }
            return supportCaseToUpdate != null ? supportCaseToUpdate.Id : null;
        } catch (Exception ex) {
            BI_PSP_LogMessagesUtility.exceptionLogMessage(
				BI_PSPB_SupportCenterConstantsCtrl.recordCannotFound,
				BI_PSPB_SupportCenterCtrl.class.toString(),
				ex
			);
			return null;
        }
    }

}