/**
 * @description     This class handles the creation of consent records related to enrollment. 
 *                   It provides a method to create a new consent record for a given lead with a specified category.
 *                   It uses utility classes to handle database operations and logging.
 * @history
 * Version  Author     Date             Detail      Description
 * 1.0      Sowmitha   30-July-2024     Created     Initial development of consent creation functionality.
 */
public class BI_PSPB_EnrollmentConsent {
    private static String recordInsertionFailed =  BI_PSPB_EnrollmentConstantCtrl.getLabel('INSERTION_FAILED');
    private static String recordCannotFound =  BI_PSPB_EnrollmentConstantCtrl.getLabel('RECORD_CANNOT_FOUND');
    private static string parameterError =  BI_PSPB_EnrollmentConstantCtrl.getLabel('PARAM_ERROR');
    /**
     * @description      Creates a new consent record for the specified lead and category. 
     *                   This method inserts a `BI_PSP_Lead_Consent__c` record and handles any potential 
     *                   errors during the insertion process. If the lead ID is blank or the record 
     *                   cannot be inserted, appropriate error messages are logged.
     * @param leadId      The ID of the lead for which the consent record is to be created.
     * @param category    The category of the consent.
     * @return           Returns the ID of the newly created consent record. If the record cannot be 
     *                   created, appropriate error logging is performed.
     * @throws           Throws a general `Exception` if there is an error during the insertion process.
     */
    @AuraEnabled
    public static Id consentCreate(String leadId,String category) {
        if (String.isBlank(leadId)) {
            BI_PSP_LogMessagesUtility.logError(parameterError,BI_PSPB_EnrollmentConsent.class.getName(),true,BI_PSPB_EnrollmentConstantCtrl.getLabel('LOG_SEVERITY_ERROR'));
        }
        
        Id consentId;
        try {
            BI_PSP_Lead_Consent__c consent = new BI_PSP_Lead_Consent__c(
                BI_PSP_I_agree__c = true,
                BI_PSPB_Consent_Category__c = category,
                BI_PSP_Lead__c = leadId
            );

            // Insert the consent record and handle any errors
             Database.SaveResult[] consentList = BI_PSP_DatabaseOperationsUtility.insertOperation(
                new List<BI_PSP_Lead_Consent__c>{ consent },
                BI_PSPB_EnrollmentConsent.class.toString(),
                false
            );

            if (consentList != null && consentList.size() > 0 && consentList[0].isSuccess()) {
            consentId = consentList[0].getId();
        } 
        } catch (Exception ex) {
            BI_PSP_LogMessagesUtility.exceptionLogMessage(
                ex.getMessage(),
                BI_PSPB_EnrollmentConsent.class.getName(),
                ex
            );
        }

        return consentId;
    }


}