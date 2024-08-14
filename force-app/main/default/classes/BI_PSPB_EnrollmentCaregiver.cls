/**
 * @description    This class is used to create a Physician .
 *                 Lead is being created by a guest user, so this class is enabled without sharing mode.
 * 
 * History:
 * Version    Author        Date         Detail              Description
 * 1.0        Ashif         05-01-2024   Created             Initial development
 */
public without sharing class BI_PSPB_EnrollmentCaregiver {
    private static String recordInsertionFailed =  BI_PSPB_EnrollmentConstantCtrl.getLabel('INSERTION_FAILED');
    private static String recordCannotFound =  BI_PSPB_EnrollmentConstantCtrl.getLabel('INSERTION_FAILED');
    private static String parameterError =  BI_PSPB_EnrollmentConstantCtrl.getLabel('PARAM_ERROR');
    private static String logSeverityError = BI_PSPB_EnrollmentConstantCtrl.getLabel('LOG_SEVERITY_ERROR');

    /**
     * @description   Creates a Caregiver record associated with a Lead.
     * @param         caregiverData - The wrapper class containing the caregiver data.
     * @param         leadId - The ID of the associated Lead record.
     * @return        Id - The ID of the created Caregiver record.
     */ 
    @AuraEnabled
    public static Id caregiverCreate(BI_PSPB_EnrollmentWrapper.DataWrapper caregiverData, String leadId) {
        if (hasInvalidParameters(caregiverData, leadId)) {
            BI_PSP_LogMessagesUtility.logError(parameterError, BI_PSPB_EnrollmentCaregiver.class.getName(), true, logSeverityError);
        }
        Id leadCgId;
        try {
            BI_PSPB_Lead_Caregiver__c care = createCaregiverRecord(caregiverData, leadId);
             Database.SaveResult[] leadCgList = BI_PSP_DatabaseOperationsUtility.insertOperation(
                new List<BI_PSPB_Lead_Caregiver__c>{ care },
                BI_PSPB_EnrollmentCaregiver.class.toString(),
                false
            );
          if (leadCgList != null && leadCgList.size() > 0 && leadCgList[0].isSuccess()) {
            leadCgId = leadCgList[0].getId();
        } 
        } catch (Exception ex) {
            BI_PSP_LogMessagesUtility.exceptionLogMessage(ex.getMessage(), BI_PSPB_EnrollmentCaregiver.class.getName(), ex);
        }
        return leadCgId;
    }

    /**
     * @description   Validates the parameters for the caregiver creation.
     * @param         caregiverData - The wrapper class containing the caregiver data.
     * @param         leadId - The ID of the associated Lead record.
     * @return        Boolean - True if parameters are invalid, false otherwise.
     */ 
    private static Boolean hasInvalidParameters(BI_PSPB_EnrollmentWrapper.DataWrapper caregiverData, String leadId) {
        return caregiverData == null || 
               String.isBlank(caregiverData.firstName) ||
               String.isBlank(caregiverData.lastName) || 
               String.isBlank(caregiverData.email) ||
               String.isBlank(caregiverData.dob) || 
               String.isBlank(caregiverData.relation) ||
               String.isBlank(leadId);
    }

    /**
     * @description   Creates a Caregiver record from the provided data.
     * @param         caregiverData - The wrapper class containing the caregiver data.
     * @param         leadId - The ID of the associated Lead record.
     * @return        BI_PSPB_Lead_Caregiver__c - The created Caregiver record.
     */ 
    private static BI_PSPB_Lead_Caregiver__c createCaregiverRecord(BI_PSPB_EnrollmentWrapper.DataWrapper caregiverData, String leadId) {
        return new BI_PSPB_Lead_Caregiver__c(
            BI_PSPB_First_Name__c = caregiverData.firstName,
            BI_PSPB_Last_Name__c = caregiverData.lastName,
            BI_PSPB_E_mail_ID__c = caregiverData.email,
            BI_PSPB_Date_of_Birth__c = Date.valueOf(caregiverData.dob),
            BI_PSPB_Phone_number__c = caregiverData.phone,
            BI_PSPB_Relationship_to_Patient__c = caregiverData.relation,
            BI_PSPB_Lead__c = leadId
        );
    }
}