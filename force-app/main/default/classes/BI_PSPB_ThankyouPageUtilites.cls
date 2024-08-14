/**
 * @description This class, BI_PSPB_ThankyouPageUtilites, contains utility methods and constants used for enrollment-related operations in the application. 
 *              It provides methods for fetching and managing records such as accounts, leads, caregivers, prescriptions, and healthcare providers. 
 *        
 * 
 * History:
 * Version    Author        Date         Detail              Description
 * 1.0        Ashif         20-07-2024   Created             Initial development
 * 1.0        Ashif         30-07-2024   Updated             Add LogMessages
 */
public without sharing class BI_PSPB_ThankyouPageUtilites {

 /**
 * @description This method fetches the lead record based on the provided lead ID and returns it for use in the LWC biPspbHcpEnrollment component.
 * 
 * @param createLeadId The ID of the created lead.
 * @return A list of Lead records. Returns null if the lead ID is blank or if no lead is found.
 * 
 * @throws CustomException if there is an error during the query execution or if the lead record is not found.
 */
   @AuraEnabled(cacheable=true)
public static List<Lead> getExistingLeads(String createLeadId) {
    List<Lead> leads = new List<Lead>();
    try {
        if (String.isBlank(createLeadId)) {
            // If there is no lead, we return null, ensuring the absence of an error when proceeding with the creation process.
            return null;
        }

        // Using the common query utility to execute the query
        String sObjectType = 'Lead';
        String fields = 'Id, FirstName, LastName, HealthCloudGA__BirthDate__c, Email, HealthCloudGA__Gender__c, Phone';
        String conditions = 'Id = \'' + createLeadId + '\'';
        Boolean withUserMode = false;

        leads = BI_PSP_CommonQueryUtility.executeQuery(sObjectType, fields, conditions, withUserMode);

        // Since this object is invoked from a Guest User Profile which has limited access, User Mode cannot be used here
        if (leads.isEmpty()) {
            return null;
        }

    } catch (Exception ex) {
        BI_PSP_LogMessagesUtility.exceptionLogMessage(BI_PSPB_EnrollmentConstantCtrl.getLabel('RECORD_CANNOT_FOUND'), BI_PSPB_EnrollmentUtilities.class.getName(), ex);
    }
    return leads;
}

/**
 * @description This method fetches the caregiver record based on the provided caregiver ID and returns it for use in the LWC biPspbHcpEnrollment component.
 * 
 * @param caregiverCreateId The ID of the created caregiver.
 * @return A list of BI_PSPB_Lead_Caregiver__c records. Returns null if the caregiver ID is blank or if no caregiver is found.
 * 
 * @throws CustomException if there is an error during the query execution or if the caregiver record is not found.
 */
    @AuraEnabled(cacheable=true)
public static List<BI_PSPB_Lead_Caregiver__c> getLeadCaregiver(String caregiverCreateId) {
    List<BI_PSPB_Lead_Caregiver__c> leadCaregiverList = new List<BI_PSPB_Lead_Caregiver__c>();
    try {
        if (String.isBlank(caregiverCreateId)) {
            // If there is no caregiverCreateId, return null to avoid errors in further processing
            return null;
        }

        // Using the common query utility to execute the query
        String sObjectType = 'BI_PSPB_Lead_Caregiver__c';
        String fields = 'Id, BI_PSPB_First_Name__c, BI_PSPB_Last_Name__c, BI_PSPB_E_mail_ID__c, BI_PSPB_Date_of_Birth__c, BI_PSPB_Phone_number__c, BI_PSPB_Relationship_to_Patient__c';
        String conditions = 'BI_PSPB_Lead__c = \'' + caregiverCreateId + '\'';
        Boolean withUserMode = false;

        leadCaregiverList = BI_PSP_CommonQueryUtility.executeQuery(sObjectType, fields, conditions, withUserMode);

        // Check if the query returned results
        if (leadCaregiverList.isEmpty()) {
            return null;
        }

    } catch (Exception ex) {
        BI_PSP_LogMessagesUtility.exceptionLogMessage(BI_PSPB_EnrollmentConstantCtrl.getLabel('ERROR_MSG_RECORD_NOT_FOUND'), BI_PSPB_EnrollmentUtilities.class.getName(), ex);
    }
    return leadCaregiverList;
}

/**
 * @description This method fetches the prescription record based on the provided prescription ID and returns it for use in the LWC biPspbHcpEnrollment component.
 * 
 * @param prescriptionCreateId The ID of the created prescription.
 * @return A list of BI_PSPB_Lead_Prescription__c records. Returns null if the prescription ID is blank or if no prescription is found.
 * 
 * @throws CustomException if there is an error during the query execution or if the prescription record is not found.
 */
   @AuraEnabled(cacheable=true)
public static List<BI_PSPB_Lead_Prescription__c> getLeadPrescription(String prescriptionCreateId) {
    List<BI_PSPB_Lead_Prescription__c> leadPrescriptionList = new List<BI_PSPB_Lead_Prescription__c>();
    try {
        if (String.isBlank(prescriptionCreateId)) {
            // If there is no prescriptionCreateId, return null to avoid errors in further processing
            return null;
        }

        // Using the common query utility to execute the query
        String sObjectType = 'BI_PSPB_Lead_Prescription__c';
        String fields = 'Id, BI_PSPB_Drug__r.Name, BI_PSPB_Dosage__c, BI_PSPB_Quantity__c, BI_PSPB_Frequency__c, BI_PSPB_of_Refills__c, BI_PSPB_Drug_Code__c, BI_PSPB_Unit__c, BI_PSPB_Prescribed_Date__c, BI_PSPB_Frequency_Unit__c, BI_PSPB_Drug__c';
        String conditions = 'BI_PSPB_Lead__c = \'' + prescriptionCreateId + '\'';
        Boolean withUserMode = false;

        leadPrescriptionList = BI_PSP_CommonQueryUtility.executeQuery(sObjectType, fields, conditions, withUserMode);

        // Check if the query returned results
        if (leadPrescriptionList.isEmpty()) {
            return null;
        }

    } catch (Exception ex) {
        BI_PSP_LogMessagesUtility.exceptionLogMessage(BI_PSPB_EnrollmentConstantCtrl.getLabel('ERROR_MSG_RECORD_NOT_FOUND'), BI_PSPB_EnrollmentUtilities.class.getName(), ex);
    }
    return leadPrescriptionList;
}

/**
 * @description This method checks if the caregiver data exists in both the BI_PSPB_Lead_Caregiver__c and Contact objects based on the provided caregiver ID.
 * 
 * @param caregiverCreateId The ID of the created caregiver.
 * @return A Boolean value. Returns true if the caregiver details exist in both objects, false otherwise.
 * 
 * @throws CustomException if there is an error during the query execution or if the caregiver data cannot be checked.
 */
    
  @AuraEnabled(cacheable=true)
public static Boolean checkCaregiverData(String caregiverCreateId) {
    if (String.isBlank(caregiverCreateId)) {
        return false;
    }

    try {
        // Query BI_PSPB_Lead_Caregiver__c to get caregiver details
        String sObjectType = 'BI_PSPB_Lead_Caregiver__c';
        String fields = 'Id, BI_PSPB_First_Name__c, BI_PSPB_Last_Name__c, BI_PSPB_E_mail_ID__c, BI_PSPB_Date_of_Birth__c, BI_PSPB_Phone_number__c, BI_PSPB_Relationship_to_Patient__c';
        String conditions = 'BI_PSPB_Lead__c = \'' + caregiverCreateId + '\'';
        Boolean withUserMode = false;

        List<BI_PSPB_Lead_Caregiver__c> leadCaregiverList = BI_PSP_CommonQueryUtility.executeQuery(sObjectType, fields, conditions, withUserMode);
        if (leadCaregiverList.isEmpty()) {
            return false;
        }
         
        // Query Contact to check if the caregiver details exist
        BI_PSPB_Lead_Caregiver__c leadCaregiver = leadCaregiverList[0];
        sObjectType = 'Contact';
        fields = 'Id, Name';
        conditions = 'FirstName = \'' + leadCaregiver.BI_PSPB_First_Name__c + '\' AND ' +
                     'LastName = \'' + leadCaregiver.BI_PSPB_Last_Name__c + '\' AND ' +
                     'Email = \'' + leadCaregiver.BI_PSPB_E_mail_ID__c + '\'';

        List<Contact> contacts = BI_PSP_CommonQueryUtility.executeQuery(sObjectType, fields, conditions, withUserMode);

        return contacts.size() == 1;

    } catch (Exception ex) {
        BI_PSP_LogMessagesUtility.exceptionLogMessage(BI_PSPB_EnrollmentConstantCtrl.getLabel('ERROR_GETTING_CONTACT'), BI_PSPB_EnrollmentUtilities.class.getName(), ex);
        return false;
    }
}

}