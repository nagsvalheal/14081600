/**
 * @description     This class handles the creation of prescription records for enrollment purposes. 
 *                   It includes a method to create a new prescription record using the provided data, 
 *                   such as drug information, quantity, refill details, and associated lead ID. 
 *                   The method performs error handling and logging for various failure scenarios.
 * @history
 * Version  Author       Date           Detail      Description
 * 1.0      Sowmitha     30-July-2024   Created     Refactored code
 */
public without sharing class BI_PSPB_EnrollmentPrescription {
    private static String recordInsertionFailed =  BI_PSPB_EnrollmentConstantCtrl.getLabel('INSERTION_FAILED');
    private static String recordCannotFound =  BI_PSPB_EnrollmentConstantCtrl.getLabel('RECORD_CANNOT_FOUND');
    private static string parameterError =  BI_PSPB_EnrollmentConstantCtrl.getLabel('PARAM_ERROR');
    private static String logSeverityError  = BI_PSPB_EnrollmentConstantCtrl.getLabel('LOG_SEVERITY_ERROR');

    /**
     * @description     Creates a new prescription record in Salesforce. The method takes in prescription 
     *                   data, including quantity, refill information, and a lead ID, and creates a new prescription 
     *                   record in the `BI_PSPB_Lead_Prescription__c` object. The method performs validation checks, 
     *                   queries to retrieve necessary drug information, and handles errors with logging.
     * @param prescriptionData The data wrapper containing drug information, quantity, frequency, and refill details.
     * @param data The data wrapper containing additional information such as date of birth.
     * @param leadId The ID of the lead associated with the prescription.
     * @return           Returns the ID of the newly created prescription record. If the record is not created, 
     *                   appropriate error handling and logging are performed.
     */
    @AuraEnabled
    public static Id prescriptionCreate(
        BI_PSPB_EnrollmentWrapper.HcpWrapper prescriptionData,
        BI_PSPB_EnrollmentWrapper.DataWrapper data,
        String leadId
    ) {

        Id presId;
        try {
            // Query the CareProgramProduct object
            List<CareProgramProduct> drug = new List<CareProgramProduct>();
            String fields = 'Id, BI_PSPB_Unit__c, BI_PSPB_Dosage__c, BI_PSPB_Product_code__c';
			String conditions ='Name = \'' + prescriptionData.drug + '\''+
                        'LIMIT 1';
			Boolean withSharingKeywrd = false;
			List<SObject> sObjectResponses = BI_PSP_CommonQueryUtility.executeQuery('CareProgramProduct', fields, conditions, withSharingKeywrd);
			for (SObject sObj : sObjectResponses) {
                drug.add((CareProgramProduct) sObj);
			}

            //drug cannot be null as only when the user selects the drug it comes to this class and also this is handled in LWC
            // Create and populate the BI_PSPB_Lead_Prescription__c object
            BI_PSPB_Lead_Prescription__c pres = new BI_PSPB_Lead_Prescription__c(
                BI_PSPB_Dosage__c = drug[0].BI_PSPB_Dosage__c,
                BI_PSPB_Quantity__c = Integer.valueOf(prescriptionData.quantity),
                BI_PSPB_Frequency__c = Integer.valueOf(prescriptionData.frequency),
                BI_PSPB_of_Refills__c = Integer.valueOf(prescriptionData.refill),
                BI_PSPB_Drug_Code__c = drug[0].BI_PSPB_Product_code__c,
                BI_PSPB_Unit__c = drug[0].BI_PSPB_Unit__c,
                BI_PSPB_Prescribed_Date__c = Date.valueOf(data.dob),
                BI_PSPB_Frequency_Unit__c = prescriptionData.unit,
                BI_PSPB_Drug__c = drug[0].Id,
                BI_PSPB_Lead__c = leadId
            );

            // Insert the prescription
             Database.SaveResult[] presList = BI_PSP_DatabaseOperationsUtility.insertOperation(
                new List<BI_PSPB_Lead_Prescription__c>{ pres },
                BI_PSPB_EnrollmentPrescription.class.toString(),
                false
            );

           if (presList != null && presList.size() > 0 && presList[0].isSuccess()) {
            presId = presList[0].getId();
        } 
        } catch (Exception ex) {
            BI_PSP_LogMessagesUtility.exceptionLogMessage(
                ex.getMessage(),
                BI_PSPB_EnrollmentPrescription.class.getName(),
                ex
            );
        }

        return presId;
    }


}