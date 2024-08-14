/**
    * @description Updates account details with the provided caregiver profile information.
    * @param account The account to be updated.
    * @param wrapper The caregiver profile data used to update the account.
    */
public class BI_PSPB_ProfileManagerHelperCtrl {

    /**
    * @description Updates account details with the provided caregiver profile information.
    * @param accToUpdate The account to be updated.
    * @param cgprofile The caregiver profile data used to update the account.
    */
    public static void updateAccountDetails(Account accToUpdate, BI_PSPB_ProfileManagerCtrl.BI_PSPB_CaregiverDetailsWrapper cgprofile) {
        accToUpdate.FirstName = cgprofile.firstName;
        accToUpdate.LastName = cgprofile.lastName;
        accToUpdate.BI_PSP_Birthdate__c = Date.valueOf(cgprofile.personBirthdate);
        accToUpdate.BI_PSPB_Relationship_to_Patient__c = cgprofile.relations;
        accToUpdate.PersonEmail = cgprofile.personEmail;
        accToUpdate.Phone = cgprofile.phone;
        accToUpdate.BI_PSPB_Preferred_Communication_Method__c = cgprofile.preferredMethodOfContact;
    }

    /**
    * @description Saves the account to the database and handles any errors that occur during the update.
    * @param accountToUpdate The account to be saved.
    * @return A string containing an error message if an error occurs, otherwise an empty string.
    */
    public static void saveAccount(Account accountToUpdate) {
        List<Account> accountToUpdateList = new List<Account> { accountToUpdate };
       BI_PSP_DatabaseOperationsUtility.updateOperation(accountToUpdateList, BI_PSPB_ProfileManagerCtrl.class.toString(), FALSE);
        
    }

    /**
    * @description Updates contact details with the provided caregiver profile information.
    * @param contact The contact to be updated.
    * @param wrapper The caregiver profile data used to update the contact.
    */
    public static void updateContactDetails(Contact contact, BI_PSPB_ProfileManagerCtrl.BI_PSPB_CaregiverDetailsWrapper wrapper) {
        contact.FirstName = wrapper.firstName;
        contact.LastName = wrapper.lastName;
        contact.BI_PSPB_Relationship_To_Patient__c = wrapper.relations;
        contact.Phone = wrapper.phone;
        contact.BI_PSP_Birthdate__c = Date.valueOf(wrapper.personBirthdate);
        contact.Email = wrapper.personEmail;
    }

    /**
    * @description Saves the contact to the database and handles any errors that occur during the update.
    * @param contact The contact to be saved.
    * @return A list of Database.SaveResult objects containing the results of the save operation.
    */
    public static Database.SaveResult[] saveContacts(Contact contact) {
        
        BI_PSP_DatabaseOperationsUtility.updateOperation(new List<Contact> { contact }, BI_PSPB_ProfileManagerCtrl.class.toString(), FALSE);
        return new Database.SaveResult[] {};
    }

    /**
    * @description Updates both contact and account records in the database and handles any errors that occur during the update.
    * @param contact The contact to be updated.
    * @param account The account to be updated.
    * @return A string containing an error message if an error occurs, otherwise an empty string.
    */
    public static void updateContactAndAccount(Contact contact, Account account) {
        try{
        BI_PSP_DatabaseOperationsUtility.updateOperation(new List<SObject> { contact, account }, BI_PSPB_ProfileManagerCtrl.class.toString(), FALSE);
        }catch (Exception ex) {
            BI_PSP_LogMessagesUtility.exceptionLogMessage(
                BI_PSPB_ProfileManagerConstCtrl.recordCannotFound,
                BI_PSPB_ProfileManagerCtrl.class.toString(),
                ex
            );
        }
    }


    /**
    * @description Saves the account to the database and handles any errors that occur during the update.
    * @param account The account to be saved.
    * @return A list of Database.SaveResult objects containing the results of the save operation.
    */
    public static Database.SaveResult[] saveAccounts(Account account) {
        BI_PSP_DatabaseOperationsUtility.updateOperation(new List<Account> { account }, BI_PSPB_ProfileManagerCtrl.class.toString(), FALSE);
        return new Database.SaveResult[] {};
    }

    /**
    * @description Updates account details with the provided caregiver profile information.
    * @param account The account to be updated.
    * @param wrapper The caregiver profile data used to update the account.
    */
    public static void updateAccDetails(Account account, BI_PSPB_ProfileManagerCtrl.BI_PSPB_CaregiverDetailsWrapper wrapper) {
        account.FirstName = wrapper.firstName;
        account.LastName = wrapper.lastName;
        account.PersonEmail = wrapper.personEmail;
        account.BI_PSP_Birthdate__c = wrapper.personBirthDate;
        account.HealthCloudGA__Gender__pc = wrapper.personGender;
        account.BI_PSPB_Preferred_Communication_Method__c = wrapper.preferredMethodOfContact;
        account.PersonMailingStreet = wrapper.street;
        account.PersonMailingCity = wrapper.city;
        account.PersonMailingStateCode = wrapper.state;
        account.PersonMailingCountryCode = wrapper.country;
        account.PersonMailingPostalCode = wrapper.postalCode;
        account.Phone = wrapper.phone;
    }

   
}