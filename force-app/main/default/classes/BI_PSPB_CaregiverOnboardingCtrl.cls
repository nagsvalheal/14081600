/** 
@description This class facilitates the creation of caregiver community users.
It eures that caregiver users are created for specific account types and associates them with the appropriate profiles.
Reason for using whithout sharing lead converted can only be accessed by admin user and can't be accessed by external users
This apex is invoked the flow
History:
Version    Author               Date              Detail         Description
1.0        Nandha	     		8-1-2024          Created        Initial development

*/
public without sharing class BI_PSPB_CaregiverOnboardingCtrl {

    /**
 * @description Creates a new caregiver record based on the provided DataWrapper object.
 * @param newCaregiver A DataWrapper object containing the details of the new caregiver.
 *                     Must include fields such as firstName, lastName, relation, email, dob, phone, and caregiverId.
 * @return Id The Id of the newly created Contact record associated with the caregiver.
 *            Returns null if the creation fails or if newCaregiver is null.
 * @throws Exception Logs any exceptions encountered during the record creation process.
 *                   If newCaregiver is null, logs an error and returns null.
 */
  @AuraEnabled
public static Id createCaregiverRecord(DataWrapper newCaregiver) {
  
  if (newCaregiver == null) {
        BI_PSP_LogMessagesUtility.logError(
            BI_PSPB_ProfileManagerConstCtrl.recordCannotFound,
            BI_PSPB_CaregiverOnboardingCtrl.class.toString(),
            false,
            BI_PSPB_ProfileManagerConstCtrl.LOG_SEVERITY_ERROR
        );
       }
    Id contactId = null;

    try {
        // Create a new Contact record
        Id recordTypeId = BI_PSP_CommonQueryUtility.retrieveRecordTypeId('contact', 'BI_PSPB_Caregiver');
        Contact contactToInsert = new Contact(
            FirstName = newCaregiver.firstName,
            LastName = newCaregiver.lastName,
            BI_PSPB_Relationship_To_Patient__c = newCaregiver.relation,
            Email = newCaregiver.email,
            BI_PSP_Birthdate__c = Date.valueOf(newCaregiver.dob),
            Phone = newCaregiver.phone,
            RecordTypeId = recordTypeId
        );

        List<Database.SaveResult> contactSaveResults = BI_PSP_DatabaseOperationsUtility.insertOperation(
            new List<Contact>{contactToInsert},
            BI_PSPB_CaregiverOnboardingCtrl.class.toString(),
            false
        );

        if (contactSaveResults.isEmpty() || !contactSaveResults[0].isSuccess()) {
          BI_PSP_LogMessagesUtility.logError(BI_PSPB_ProfileManagerConstCtrl.recordCannotUpdate, BI_PSPB_CaregiverOnboardingCtrl.class.toString(),
                                             false, BI_PSPB_ProfileManagerConstCtrl.LOG_SEVERITY_ERROR);
            }

        contactId = contactSaveResults[0].getId();
        // Query the CareProgramEnrollee record by Id
        String fields = 'Id, AccountId';
        String conditions = 'Id = \'' + newCaregiver.caregiverId + '\'';
        List<SObject> enrolleeRecords = BI_PSP_CommonQueryUtility.executeQuery(
            'CareProgramEnrollee',
            fields,
            conditions,
            false
        );

        if (enrolleeRecords.isEmpty()) {
            BI_PSP_LogMessagesUtility.logError(BI_PSPB_ProfileManagerConstCtrl.recordCannotFound,
      		BI_PSPB_CaregiverOnboardingCtrl.class.toString(),false, BI_PSPB_ProfileManagerConstCtrl.LOG_SEVERITY_ERROR
            );
            }

        CareProgramEnrollee enrollee = (CareProgramEnrollee) enrolleeRecords[0];

        // Create a new BI_PSPB_Enrollee_Caregiver__c record
        BI_PSPB_Enrollee_Caregiver__c caregiverToInsert = new BI_PSPB_Enrollee_Caregiver__c(
            Name = contactToInsert.FirstName,
            BI_PSPB_Care_Program_Enrollee__c = enrollee.Id,
            BI_PSPB_Patient__c = enrollee.AccountId,
            BI_PSPB_Contact_Id__c = contactId
        );

        List<Database.SaveResult> cgSaveResults = BI_PSP_DatabaseOperationsUtility.insertOperation(
            new List<BI_PSPB_Enrollee_Caregiver__c>{ caregiverToInsert },
            BI_PSPB_CaregiverOnboardingCtrl.class.toString(),
            false
        );

        if (cgSaveResults.isEmpty() || !cgSaveResults[0].isSuccess()) {
           BI_PSP_LogMessagesUtility.logError(BI_PSPB_ProfileManagerConstCtrl.recordCannotUpdate,
                                              BI_PSPB_CaregiverOnboardingCtrl.class.toString(), false,
                                              	BI_PSPB_ProfileManagerConstCtrl.LOG_SEVERITY_ERROR);
        }

    } catch (Exception ex) {
        BI_PSP_LogMessagesUtility.exceptionLogMessage(
            ex.getMessage(),
            BI_PSPB_ProfileManagerConstCtrl.class.toString(),
            ex
        );
    }

    return contactId;
}



    
/**
 * @description Wrapper class to hold caregiver information for creating new caregiver records.
 */
    public class DataWrapper {
         /**
     * @description The first name of the caregiver.
     * @type String
     * @example 'John'
     */
        @AuraEnabled
        public String firstName { get; set; }
        /**
     * @description The last name of the caregiver.
     * @type String
     * @example 'Doe'
     */
        @AuraEnabled
        public String lastName { get; set; }
         /**
     * @description The email address of the caregiver.
     * @type String
     * @example 'john.doe@example.com'
     */
        @AuraEnabled
        public String email { get; set; }

    /**
     * @description The phone number of the caregiver.
     * @type String
     * @example '123-456-7890'
     */
        @AuraEnabled
        public String phone { get; set; }
         /**
     * @description The date of birth of the caregiver, formatted as a string in the 'yyyy-MM-dd' format.
     * @type String
     * @example '1980-01-01'
     */
        @AuraEnabled
        public String dob { get; set; }
          /**
     * @description The relationship of the caregiver to the patient.
     * @type String
     * @example 'Spouse'
     */
        @AuraEnabled
        public String relation { get; set; }
       /**
     * @description The Id of the CareProgramEnrollee record associated with the caregiver.
     * @type String
     * @example 'a1B2C3D4E5F6G7H8I9J0'
     */
        @AuraEnabled
        public String caregiverId { get; set; }
    }
    
    

}