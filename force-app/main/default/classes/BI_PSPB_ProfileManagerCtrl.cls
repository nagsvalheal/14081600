/** 
* @description   This class is used for getting Account Id, Creating Contact,Creating Enrollee caregiver,grand access
*                Reason for using whithout sharing lead converted can only be accessed by admin user and can't be
*                accessed by external users,Enrolee caregiver contains a lookup field to a Care Program Enrollee, 
				 which is a Health Cloud object; hence, we cannot utilize user mode here.
*                
* History:
* Version	Author			Date			Detail				Description
* 1.0		NandhaKumar	    05-01-2024  	Created				Initial development
* 1.1		NandhaKumar 	01-Dec-2023		Updated				Updated the Caregiver record 
* 1.2		NandhaKumar 	04-Apr-2023		Updated				Catch log added
*/

public without sharing class BI_PSPB_ProfileManagerCtrl {

/**
     * @description Retrieves caregiver details based on the current user's ID.
     * The method fetches the caregiver's information by first obtaining the user's associated 
     * accounts and then retrieving the caregiver's details by ID.
     * @return List<Account> A list of Account records representing caregivers.
     */
    
@AuraEnabled(cacheable=true)
public static List<Account> userCaregiver() {
    List<Account> accounts = BI_PSPB_CaregiverServiceCtrl.fetchAccountByUser(UserInfo.getName(), UserInfo.getUserEmail());
  
    String caregiverId;
    try {
        
        caregiverId = BI_PSPB_CaregiverServiceCtrl.fetchCaregiverIdByAccountId(accounts[0].Id);
            if (accounts.isEmpty()) {
 	 BI_PSP_LogMessagesUtility.logError(BI_PSPB_ProfileManagerConstCtrl.recordCannotFound,BI_PSPB_ProfileManagerCtrl.class.toString(),TRUE, BI_PSP_QuestionnaireConstant.LOG_SEVERITY_ERROR);
             
        }
    } catch (Exception ex) {
            BI_PSP_LogMessagesUtility.exceptionLogMessage(
                ex.getMessage(),
                BI_PSPB_ProfileManagerConstCtrl.class.toString(),
                ex
            );
        }
    return BI_PSPB_CaregiverServiceCtrl.fetchCaregiverDetailsById(caregiverId);
}
 /**
     * @description Updates caregiver details in the Salesforce database.
     * This method updates the caregiver's profile based on the provided details and saves the changes.
     * @param cgprofile An instance of BI_PSPB_CaregiverDetailsWrapper containing the details to update.
     */
  @AuraEnabled
public static void updateCaregiverDetails(BI_PSPB_CaregiverDetailsWrapper cgprofile) {
    try {
        if (BI_PSPB_CaregiverServiceCtrl.isProfileValid(cgprofile)) {
            List<Account> accounts = BI_PSPB_CaregiverServiceCtrl.fetchAccountById(cgprofile.accountId);
            
            if (!accounts.isEmpty()) {
                Account accountToUpdate = accounts[0];
                BI_PSPB_ProfileManagerHelperCtrl.updateAccountDetails(accountToUpdate, cgprofile);
                
                 BI_PSPB_ProfileManagerHelperCtrl.saveAccount(accountToUpdate);
        
            
        } 
    }
    }
    
    catch (Exception ex) {
            BI_PSP_LogMessagesUtility.exceptionLogMessage(
                ex.getMessage(),
                BI_PSPB_ProfileManagerConstCtrl.class.toString(),
                ex
            );
        }
}
  /**
     * @description Updates the status and related records based on the checkbox selection.
     * This method modifies the status of the caregiver record and updates related contact and account records.
     * @param isChecked A boolean indicating whether the checkbox is checked (True) or not (False).
     */
@AuraEnabled
public static void updateContactFromCheckbox(Boolean isChecked) {
    try {
        if (isChecked == null) {
            BI_PSP_LogMessagesUtility.logError(BI_PSPB_ProfileManagerConstCtrl.recordCannotUpdate, BI_PSPB_ProfileManagerCtrl.class.toString(), false, BI_PSPB_ProfileManagerConstCtrl.LOG_SEVERITY_ERROR);
           
        }

        BI_PSPB_Enrollee_Caregiver__c ecRecord = BI_PSPB_CaregiverServiceCtrl.fetchEnrolleeCaregiver(BI_PSPB_ProfileManagerConstCtrl.userName, BI_PSPB_ProfileManagerConstCtrl.userEmail);
        if (ecRecord == null) {
            BI_PSP_LogMessagesUtility.logError(BI_PSPB_ProfileManagerConstCtrl.recordCannotFound, BI_PSPB_ProfileManagerCtrl.class.toString(), false, BI_PSPB_ProfileManagerConstCtrl.LOG_SEVERITY_ERROR);
          
        }

        ecRecord.BI_PSPB_Status__c = isChecked ? BI_PSPB_ProfileManagerConstCtrl.active : BI_PSPB_ProfileManagerConstCtrl.inActive;
         BI_PSPB_CaregiverServiceCtrl.updateEnrolleeCaregiver(ecRecord);
        Contact contact = BI_PSPB_CaregiverServiceCtrl.fetchContactById(ecRecord.BI_PSPB_Contact_Id__c);
        if (contact == null) {
            BI_PSP_LogMessagesUtility.logError(BI_PSPB_ProfileManagerConstCtrl.recordCannotFound, BI_PSPB_ProfileManagerCtrl.class.toString(), false, BI_PSPB_ProfileManagerConstCtrl.LOG_SEVERITY_ERROR);
            
        }
        contact.BI_PSPB_GrantAccess__c = isChecked;

        Account account = BI_PSPB_CaregiverServiceCtrl.fetchAccountId(ecRecord.BI_PSPB_Caregiver__c);
        if (account != null) {
            account.BI_PSPB_GrantCaregiverAccess__c = isChecked;
        }

         BI_PSPB_ProfileManagerHelperCtrl.updateContactAndAccount(contact, account);
        
    } catch (Exception ex) {
            BI_PSP_LogMessagesUtility.exceptionLogMessage(
                BI_PSPB_ProfileManagerConstCtrl.recordCannotFound,
                BI_PSPB_ProfileManagerCtrl.class.toString(),
                ex
            );
        }
}
  /**
     * @description Retrieves the list of caregiver records with their access permissions based on the logged-in user's email.
     * This method queries the caregiver records associated with the user's email.
     * @return List<BI_PSPB_Enrollee_Caregiver__c> A list of BI_PSPB_Enrollee_Caregiver__c records representing caregivers and their access permissions.
     */ 
  @AuraEnabled(cacheable=true)
public static List<BI_PSPB_Enrollee_Caregiver__c> grandAccessButton() {
     List<BI_PSPB_Enrollee_Caregiver__c> ecList = BI_PSPB_CaregiverServiceCtrl.fetchEnrolleeCaregiversByUserEmail(BI_PSPB_ProfileManagerConstCtrl.userEmail);
    try {
       
        
        if (ecList.isEmpty()) {
            return null;// when caregiver data newly insert so the record not available there that's why we return null value
            
        } 
    }  catch (Exception ex) {
            BI_PSP_LogMessagesUtility.exceptionLogMessage(
                BI_PSPB_ProfileManagerConstCtrl.recordCannotFound,
                BI_PSPB_ProfileManagerCtrl.class.toString(),
                ex
            );
        }
    return ecList;
}
 /**
     * @description Retrieves a list of BI_PSPB_Enrollee_Caregiver__c records based on the current user's ID.
     * This method fetches caregiver records related to the account associated with the current user.
     * @return List<BI_PSPB_Enrollee_Caregiver__c> A list of BI_PSPB_Enrollee_Caregiver__c records associated with the user's account.
     */  
 @AuraEnabled(cacheable=true)
public static List<BI_PSPB_Enrollee_Caregiver__c> getCaregiverDataView() {
    List<BI_PSPB_Enrollee_Caregiver__c> caregiverListData = new List<BI_PSPB_Enrollee_Caregiver__c> ();
    try {
      
       Account acc = BI_PSPB_CaregiverServiceCtrl.getAccountByNameAndEmail(BI_PSPB_ProfileManagerConstCtrl.userName, BI_PSPB_ProfileManagerConstCtrl.userEmail);
        Id accountId = (acc != null) ? acc.Id : null;

       caregiverListData = (accountId != null) ?
            BI_PSPB_CaregiverServiceCtrl.getCaregiverListByPatientId(accountId) : new List<BI_PSPB_Enrollee_Caregiver__c>();

        if (caregiverListData.isEmpty()) {
             return null; // when caregiver data newly insert so the record not available there that's why we return null value
          
        } 
    }  catch (Exception ex) {
            BI_PSP_LogMessagesUtility.exceptionLogMessage(
                ex.getMessage(),
                BI_PSPB_ProfileManagerConstCtrl.class.toString(),
                ex
            );
        }
      return caregiverListData;
}
 /**
     * @description Updates the contact record associated with the caregiverId and specified fields.
     * This method updates a contact record with new information about the caregiver.
     * @param caregiverwrapper An instance of BI_PSPB_CaregiverDetailsWrapper containing the details to update.
     * @return List<Contact> A list containing the updated Contact record, or an empty list if the update fails.
     */
@AuraEnabled
public static List<Contact> updateCaregivers(BI_PSPB_CaregiverDetailsWrapper wrapper) {
    try {
        if (wrapper == null || wrapper.accountId == null) {
           BI_PSP_LogMessagesUtility.logError(BI_PSPB_ProfileManagerConstCtrl.recordCannotFound, BI_PSPB_ProfileManagerCtrl.class.toString(), TRUE, BI_PSPB_ProfileManagerConstCtrl.LOG_SEVERITY_ERROR);
        }
        
        Contact contactToUpdate = BI_PSPB_CaregiverServiceCtrl.getContactById(wrapper.accountId);
        if (contactToUpdate == null) {
            BI_PSP_LogMessagesUtility.logError(BI_PSPB_ProfileManagerConstCtrl.recordCannotFound, BI_PSPB_ProfileManagerCtrl.class.toString(), TRUE, BI_PSPB_ProfileManagerConstCtrl.LOG_SEVERITY_ERROR);
        }
        
        BI_PSPB_ProfileManagerHelperCtrl.updateContactDetails(contactToUpdate, wrapper);
        BI_PSPB_ProfileManagerHelperCtrl.saveContacts(contactToUpdate);

       
        
        return new List<Contact>{ contactToUpdate };
    } 
       catch (Exception ex) {
            BI_PSP_LogMessagesUtility.exceptionLogMessage(
                ex.getMessage(),
                BI_PSPB_ProfileManagerConstCtrl.class.toString(),
                ex
            );
              // Ensure the method returns an empty list in case of an exception
        return new List<Contact>();
        }
}
 /**
     * @description Updates various fields of the patient account identified by the accountId parameter.
     * This method updates a patient's account information based on the provided details.
     * @param cgprofile An instance of BI_PSPB_CaregiverDetailsWrapper containing the patient details to update.
     */
 

 @AuraEnabled
public static void updatePatientExcistInfo(BI_PSPB_CaregiverDetailsWrapper wrapper) {
    try {
        
        
        // Fetch the account details
        Account accountToUpdate = BI_PSPB_CaregiverServiceCtrl.getAccountvalue(wrapper.accountId);
       
        // Update the account details
        BI_PSPB_ProfileManagerHelperCtrl.updateAccDetails(accountToUpdate, wrapper);
        
        // Save the updated account and handle errors if any
         BI_PSPB_ProfileManagerHelperCtrl.saveAccount(accountToUpdate);
       
        
    }  catch (Exception ex) {
            BI_PSP_LogMessagesUtility.exceptionLogMessage(
                ex.getMessage(),
                BI_PSPB_ProfileManagerConstCtrl.class.toString(),
                ex
            );
        }
}
  /**
     * @description Updates various fields of the patient or caregiver account identified by the accountId parameter.
     * This method updates either a patient or caregiver's account information based on the provided details.
     * @param cgprofile An instance of BI_PSPB_CaregiverDetailsWrapper containing the details to update.
     */
 @AuraEnabled
public static void updatePatientorCargiverInfo(BI_PSPB_CaregiverDetailsWrapper wrapper) {
   
    try {
        Account accountToUpdate = BI_PSPB_CaregiverServiceCtrl.getAccountvalue(wrapper.accountId);
        BI_PSPB_ProfileManagerHelperCtrl.updateAccDetails(accountToUpdate, wrapper);
        
        BI_PSPB_ProfileManagerHelperCtrl.saveAccount(accountToUpdate);
        
        
    }  catch (Exception ex) {
            BI_PSP_LogMessagesUtility.exceptionLogMessage(
                ex.getMessage(),
                BI_PSPB_ProfileManagerConstCtrl.class.toString(),
                ex
            );
        }
}
 /**
 * @description  Wrapper classes are used to hold a group of related data fields together.used to updateCaregivers,
                 updateCaregiverDetails,updatePatientExcistInfo,updatePatientorCargiverInfo
*/

  public class BI_PSPB_CaregiverDetailsWrapper {
         /**
 * @description  Wrapper classes are used to hold a group of related data fields together.used to updateCaregivers,
                 updateCaregiverDetails,updatePatientExcistInfo,updatePatientorCargiverInfo
 * @param        accountId The ID of the patient or caregiver account to update.
*/
    @AuraEnabled
    public String accountId { get; set; }
             /**
 * @description  Wrapper classes are used to hold a group of related data fields together.used to updateCaregivers,
                 updateCaregiverDetails,updatePatientExcistInfo,updatePatientorCargiverInfo
* @param        firstname The new first name of the patient or caregiver.
*/
    @AuraEnabled
    public String firstName { get; set; }
                 /**
 * @description  Wrapper classes are used to hold a group of related data fields together.used to updateCaregivers,
                 updateCaregiverDetails,updatePatientExcistInfo,updatePatientorCargiverInfo
 * @param        lastname The new last name of the patient or caregiver.
*/
    @AuraEnabled
    public String lastName { get; set; }
                 /**
 * @description  Wrapper classes are used to hold a group of related data fields together.used to updateCaregivers,
                 updateCaregiverDetails,updatePatientExcistInfo,updatePatientorCargiverInfo
* @param        personemail The new email address of the patient or caregiver.
*/
    @AuraEnabled
    public String personEmail { get; set; }
            /**
 * @description  Wrapper classes are used to hold a group of related data fields together.used to updateCaregivers,
                 updateCaregiverDetails,updatePatientExcistInfo,updatePatientorCargiverInfo
* @param        personbirthdate The new birthdate of the patient or caregiver.
*/
    @AuraEnabled
    public Date personBirthdate { get; set; }
                     /**
 * @description  Wrapper classes are used to hold a group of related data fields together.used to updateCaregivers,
                 updateCaregiverDetails,updatePatientExcistInfo,updatePatientorCargiverInfo
* @param        persongender The new gender of the patient or caregiver.
*/
    @AuraEnabled
    public String personGender { get; set; }
                 /**
 * @description  Wrapper classes are used to hold a group of related data fields together.used to updateCaregivers,
                 updateCaregiverDetails,updatePatientExcistInfo,updatePatientorCargiverInfo
 * @param        preferredmethodofcontact The new preferred method of contact for the patient or caregiver.
*/
    @AuraEnabled
    public String preferredMethodOfContact { get; set; }
                 /**
 * @description  Wrapper classes are used to hold a group of related data fields together.used to updateCaregivers,
                 updateCaregiverDetails,updatePatientExcistInfo,updatePatientorCargiverInfo
* @param        street The new street address of the patient or caregiver.
*/
    @AuraEnabled
    public String street { get; set; }
                 /**
 * @description  Wrapper classes are used to hold a group of related data fields together.used to updateCaregivers,
                 updateCaregiverDetails,updatePatientExcistInfo,updatePatientorCargiverInfo
 * @param        city The new city of the patient or caregiver.
*/
    @AuraEnabled
    public String city { get; set; }
                 /**
 * @description  Wrapper classes are used to hold a group of related data fields together.used to updateCaregivers,
                 updateCaregiverDetails,updatePatientExcistInfo,updatePatientorCargiverInfo
 * @param        state The new state of the patient or caregiver.
*/
    @AuraEnabled
    public String state { get; set; }
                 /**
 * @description  Wrapper classes are used to hold a group of related data fields together.used to updateCaregivers,
                 updateCaregiverDetails,updatePatientExcistInfo,updatePatientorCargiverInfo
 * @param        country The new country of the patient or caregiver.
*/
    @AuraEnabled
    public String country { get; set; }
                 /**
 * @description  Wrapper classes are used to hold a group of related data fields together.used to updateCaregivers,
                 updateCaregiverDetails,updatePatientExcistInfo,updatePatientorCargiverInfo
* @param        postalCode The new postal code of the patient or caregiver.
*/
    @AuraEnabled
    public String postalCode { get; set; }
                 /**
 * @description  Wrapper classes are used to hold a group of related data fields together.used to updateCaregivers,
                 updateCaregiverDetails,updatePatientExcistInfo,updatePatientorCargiverInfo
* @param        phone The new phone number of the patient or caregiver.
*/
    @AuraEnabled
    public String phone { get; set; }
                 /**
 * @description  Wrapper classes are used to hold a group of related data fields together.used to updateCaregivers,
                 updateCaregiverDetails,updatePatientExcistInfo,updatePatientorCargiverInfo
* @param        relations The new relations of the patient or caregiver.
*/
    @AuraEnabled
    public String relations { get; set; }
  }
}