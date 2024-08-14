/**
 * @description This class, BI_PSPB_EnrollmentUtilities, contains utility methods and constants used for enrollment-related operations in the application. 
 *              It provides methods for fetching and managing records such as accounts, leads, caregivers, prescriptions, and healthcare providers. 
 *        
 * 
 * History:
 * Version    Author        Date         Detail              Description
 * 1.0        Ashif         20-07-2024   Created             Initial development
 * 1.0        Ashif         30-07-2024   Updated             Add LogMessages
 */

 public without sharing class BI_PSPB_EnrollmentUtilities {
	private static String recordCannotFound =  BI_PSPB_EnrollmentConstantCtrl.getLabel('RECORD_CANNOT_FOUND');
	private static string parameterError =BI_PSPB_EnrollmentConstantCtrl.getLabel('PARAM_ERROR');
   /**  
	* @description This method retrieves a list of Account records based on the provided email address. It returns the list of accounts if they exist; otherwise, it returns null. The method is cacheable for improved performance and is intended to be used in Lightning components.
	* 
	* @param email The email address used to filter and retrieve the Account records. If the email is blank, the method returns null.
	* 
	* @return A list of Account records that match the provided email address, or null if no such records are found.
	* 
	* @throws AuraHandledException If an error occurs during the query execution, an exception is logged.
   */
	   @AuraEnabled(cacheable=true)
	   public static List<Account> getExistingAccounts(String email) {
		   List<Account> acc = new List<Account>();
		   try {
			   if(String.isBlank(email)){
				 // If there is no account, we return null, ensuring the absence of an error when proceeding with the creation process.
				   return null;
			   }
			   // Using the common query utility to execute the query
			   String sObjectType = 'Account';
			   String fields = 'Id, FirstName, LastName, BI_PSP_Birthdate__c, RecordType.Name, BI_PSPB_User_Type__c, PersonEmail';
			   String conditions = 'PersonEmail = \'' + email + '\'';
			   Boolean withUserMode = false; 
				  acc = BI_PSP_CommonQueryUtility.executeQuery(sObjectType, fields, conditions, withUserMode);
			   //Since this object is invoked from a Guest User Profile which has limited access, User Mode cannot be used here
			   if(acc.IsEmpty())
			   {
				  return null; 
			   }
   
		   } catch (Exception ex) {
			   BI_PSP_LogMessagesUtility.exceptionLogMessage(recordCannotFound,BI_PSPB_EnrollmentUtilities.class.getName(),ex);    
		   }
		   return acc;
	   }
   
		  /**
		* @description Retrieves the Contact record associated with the specified access code.
		* @param accessCode The access code used to retrieve the Contact record.
		* @return The Contact record matching the access code, or null if not found.
		*/
	   @AuraEnabled(cacheable=true)
	   public static Contact hcpAccessCode(String accessCode) {
		   if (String.isBlank(accessCode)) {
			   BI_PSP_LogMessagesUtility.logError(parameterError,BI_PSPB_EnrollmentUtilities.class.getName(),false,BI_PSPB_EnrollmentConstantCtrl.getLabel('LOG_SEVERITY_ERROR'));
		   }
		   
		   Contact conToReturn = new Contact();
		   try {
			   // Using the common query utility to execute the query
			   String sObjectType = 'Contact';
			   String fields = 'Id';
			   String conditions = 'BI_PSPB_Access_Code__c = \'' + accessCode + '\' AND HealthCloudGA__StatusGroup__c = \'' + BI_PSPB_EnrollmentConstantCtrl.getLabel('ACTIVE') + '\'';
			   Boolean withUserMode = false; 
   
			   List<Contact> contacts = BI_PSP_CommonQueryUtility.executeQuery(sObjectType, fields, conditions, withUserMode);
			   if(!contacts.isEmpty())
			   {
				   conToReturn = contacts[0];
			   } 
   
		   } catch (Exception ex) {
			   BI_PSP_LogMessagesUtility.exceptionLogMessage(recordCannotFound,BI_PSPB_EnrollmentUtilities.class.getName(),ex);
		   }
		   return conToReturn;
	   }
	   /**
		* @description Retrieves a Lead Caregiver record based on the Lead Id.
		* @param leadId The Id of the Lead record.
		* @return The Lead Caregiver record.
		*/
	   @AuraEnabled(cacheable=true)
	   public static BI_PSPB_Lead_Caregiver__c getEnrolleeCaregiverId(String leadId) {
		   if (String.isBlank(leadId)) {
			   BI_PSP_LogMessagesUtility.logError(parameterError,BI_PSPB_EnrollmentUtilities.class.getName(),false,BI_PSPB_EnrollmentConstantCtrl.getLabel('LOG_SEVERITY_ERROR'));
		   }
		   
		   BI_PSPB_Lead_Caregiver__c leadCaregiverRecord = new BI_PSPB_Lead_Caregiver__c();
		   try {
			   // Using the common query utility to execute the query
			   String sObjectType = 'BI_PSPB_Lead_Caregiver__c';
			   String fields = 'Id, BI_PSPB_First_Name__c, BI_PSPB_Last_Name__c, BI_PSPB_Date_of_Birth__c, BI_PSPB_Preferred_Communication_Method__c, BI_PSPB_E_mail_ID__c, BI_PSPB_Phone_number__c, BI_PSPB_Lead__c, BI_PSPB_Lead__r.BI_PSPB_Do_you_have_an_HCP_Access_Code__c, BI_PSPB_Relationship_to_Patient__c, BI_PSPB_Lead__r.BI_PSPB_HCP_Access_Code__c';
			   String conditions = 'BI_PSPB_Lead__r.Id = \'' + leadId + '\'';
			   Boolean withUserMode = false; 
   
			   List<BI_PSPB_Lead_Caregiver__c> caregiverRecords = BI_PSP_CommonQueryUtility.executeQuery(sObjectType, fields, conditions, withUserMode);
			   
			   if (caregiverRecords.isEmpty()) {
				   return null;
			   } else {
				   leadCaregiverRecord = caregiverRecords[0];
			   }
		   } catch (Exception ex) {
			   BI_PSP_LogMessagesUtility.exceptionLogMessage(
				   ex.getMessage(),
				   BI_PSPB_EnrollmentUtilities.class.getName(),
				   ex
			   );
		   }
		   return leadCaregiverRecord;
	   }
	   /**
	   * @description This method retrieves a list of `Lead` records based on the provided lead ID, including related Physician information.
	*              It throws an exception if the lead ID is blank or if no lead record is found for the provided lead ID.
	*              The method is intended to be used in Lightning components and is cacheable for improved performance.
	* 
	* @param leadId The ID of the lead used to retrieve the lead and related Physician information.
	* 
	* @return A list of `Lead` records associated with the provided lead ID, or null if no such record is found.
	* 
	* @throws AuraHandledException If the lead ID is blank or if no lead record is found for the provided lead ID.
		*/
	   @AuraEnabled(cacheable=true)
	   public static List<Lead> getHcpDetails(String leadId) {
		   List<Lead> leadRecords = new List<Lead>();
		   try {
			   if (String.isBlank(leadId)) {
			   BI_PSP_LogMessagesUtility.logError(parameterError,BI_PSPB_EnrollmentUtilities.class.getName(),false,BI_PSPB_EnrollmentConstantCtrl.getLabel('LOG_SEVERITY_ERROR'));
			   }
			   
			   // Using the common query utility to execute the query
			   String sObjectType = 'Lead';
			   String fields = 'Id, Email, BI_PSPB_Physician_Name__r.FirstName, BI_PSPB_Physician_Name__r.LastName, BI_PSPB_Physician_Name__r.BI_PSPB_Preferred_Communication_Method__c, BI_PSPB_Physician_Name__r.Email, BI_PSPB_Physician_Name__r.Phone, BI_PSPB_Physician_Name__r.BI_PSPB_Address_Line__c';
			   String conditions = 'Id = \'' + leadId + '\'';
			   Boolean withUserMode = false;
   
			   leadRecords = BI_PSP_CommonQueryUtility.executeQuery(sObjectType, fields, conditions, withUserMode);
			   
			   if (leadRecords.isEmpty()) {
				   BI_PSP_LogMessagesUtility.logError(recordCannotFound,BI_PSPB_EnrollmentUtilities.class.getName(),false,BI_PSPB_EnrollmentConstantCtrl.getLabel('LOG_SEVERITY_ERROR'));
				   return null;
			   }
		   } catch (Exception ex) {
			   BI_PSP_LogMessagesUtility.exceptionLogMessage(
				   ex.getMessage(),
				   BI_PSPB_EnrollmentUtilities.class.getName(),
				   ex
			   );
		   }
		   return leadRecords;
	   }
   
	   /**
	* @description      This method retrieves the list of active country options from the 
	*                   MailingCountryCode field on the Contact object. Each country option is represented as a 
	*                   map containing the country code and its corresponding label. The method is intended to be used 
	*                   in Lightning components, and the result is cacheable for improved performance.
	* @return           Returns a list of maps where each map contains the keys 'value' and 'label' representing the country code and its label, respectively.
	*/
	   @AuraEnabled(cacheable=true)
	   public static List<Map<String, String>> getCountries() {
		   List<Map<String, String>> options = new List<Map<String, String>>();
		   try {
			   Schema.DescribeFieldResult fieldResult = Contact.MailingCountryCode.getDescribe();
			   List<Schema.PicklistEntry> ple = fieldResult.getPicklistValues();
			   for (Schema.PicklistEntry f : ple) {
				   if (f.isActive() ) {
				   Map<String, String> option = new Map<String, String>();
				   option.put('value', f.getValue());
				   option.put('label', f.getLabel());
				   options.add(option);
			   }
			   }
		   } catch (Exception e) {
			   // Handle exception
			   BI_PSP_LogMessagesUtility.exceptionLogMessage( BI_PSPB_EnrollmentConstantCtrl.getLabel('ERROR_RETRIEVE_COUNTRY'), BI_PSPB_EnrollmentUtilities.class.getName(), e);
		   }
		   return options;
	   }
   
   /**
	* @description      Fetches the list of states based on the selected country code. 
	*                   The method retrieves active state options from the `BI_PSPB_State__c` custom object 
	*                   that match the provided country code. This method 
	*                   is intended to be used in Lightning components and the result is cacheable 
	*                   for improved performance.
	* @param selectedCountry The country code for which the state options are to be retrieved.
	* @return           Returns a list of maps where each map contains the keys 'Id', 'Name', 
	*                   and 'BI_PSPB_StateCode__c' representing the state id, name, and state code, respectively.
	*/
	   @AuraEnabled(cacheable=true)
	   public static List<Map<String, String>> getStates(String selectedCountry) {
		   List<Map<String, String>> options = new List<Map<String, String>>();
		   try {
			   // Query for states related to the selected country
			   List<BI_PSPB_State__c> states = new List<BI_PSPB_State__c>();
			   String fields = 'Id, Name, BI_PSPB_StateCode__c';
			   String conditions = 'BI_PSPB_CountryCode__c = \'' + selectedCountry + '\'';
			   Boolean withSharingKeywrd = false;
			   List<SObject> sObjectResponses = BI_PSP_CommonQueryUtility.executeQuery('BI_PSPB_State__c', fields, conditions, withSharingKeywrd);
			   for (SObject sObj : sObjectResponses) {
				   states.add((BI_PSPB_State__c) sObj);
			   }
			   
			   for (BI_PSPB_State__c state : states) {
				   Map<String, String> stateMap = new Map<String, String>();
				   stateMap.put('Id', state.Id);
				   stateMap.put('Name', state.Name);
				   stateMap.put('BI_PSPB_StateCode__c', state.BI_PSPB_StateCode__c);
				   options.add(stateMap);
			   }
		   } catch (Exception e) {
			   // Handle exception
			   BI_PSP_LogMessagesUtility.exceptionLogMessage(BI_PSPB_EnrollmentConstantCtrl.getLabel('ERROR_RETRIEVE_STATE'), BI_PSPB_EnrollmentUtilities.class.getName(), e);
		   }
		   return options;
	   }	
  /**
 * @description Retrieves a lead record based on the provided first name, last name, and date of birth.
 * The method uses a common query utility to fetch the lead records and returns the first matching lead.
 * 
 * @param firstName The first name of the lead.
 * @param lastName The last name of the lead.
 * @param dateOfBirth The birth date of the lead.
 * @return Lead The lead record that matches the given criteria. Returns null if no match is found.
 * @throws AuraHandledException If any of the input parameters are invalid or no matching lead record is found.
 */
	@AuraEnabled(cacheable=true)
	   public static Lead retrieveLeadRecord(String firstName, String lastName, Date dateOfBirth) {
           
		   if (
			   String.isBlank(firstName) ||
			   String.isBlank(lastName) ||
			   dateOfBirth == null
		   ) {
			   throw new AuraHandledException(
				   BI_PSPB_EnrollmentConstantCtrl.getLabel('ERROR_MSG_RECORD_NOT_FOUND')
			   );
		   }
		
		   Lead leadRecord = null;
		   try {
               DateTime dateBirth = DateTime.newInstance(dateOfBirth, Time.newInstance(0, 0, 0, 0));
               String formattedDate = dateBirth.format('yyyy-MM-dd');
			   
			   // Query for the lead record that matches the provided first name, last name, and date of birth
			   // The query is designed to return only one lead record
			   // This is regarding to guestuser so can't use User_mode.
               String sObjectType = 'Lead';
               String fields = 'Id, FirstName, LastName, HealthCloudGA__BirthDate__c, HealthCloudGA__Gender__c, Email, Phone';
               String conditions = 'FirstName = \'' + firstName + '\' AND ' +
                   'LastName = \'' + lastName + '\' AND ' +
                   'HealthCloudGA__BirthDate__c = ' +formattedDate ;
               Boolean withUserMode = false;

   
				   // Call the common query utility method
				   List<Lead> leads = BI_PSP_CommonQueryUtility.executeQuery(sObjectType, fields, conditions, withUserMode);
			   
				if(!leads.isEmpty())
			   {
				   leadRecord = leads[0];
			   } 
		   } catch (Exception ex) {
			   
			   BI_PSP_LogMessagesUtility.exceptionLogMessage(ex.getMessage(),BI_PSPB_EnrollmentUtilities.class.getName(),ex);
		   }
		   return leadRecord;
	   }

	   /**
	 * @description Retrieves a list of enrollee caregiver records associated with the current user's name and email.
	 * The method uses a common query utility to fetch the records and returns the list of matching enrollee caregivers.
	 * This method is designed to work for guest users and does not operate in user mode.
	 * 
	 * @return List<BI_PSPB_Enrollee_Caregiver__c> The list of enrollee caregiver records that match the given criteria.
	 * @throws AuraHandledException If any errors occur during the query process, an exception is logged.
	 */
	   
	   @AuraEnabled(cacheable=true)
	   public static List<BI_PSPB_Enrollee_Caregiver__c> getEnrolleeCaregiver() {
		   List<BI_PSPB_Enrollee_Caregiver__c> enrolleeList = new List<BI_PSPB_Enrollee_Caregiver__c>();
		   try {
			   // This is regarding to guestuser so can't use User_mode.
			   String sObjectType = 'BI_PSPB_Enrollee_Caregiver__c';
			   String fields = 'Id,BI_PSPB_Patient__r.Name, BI_PSPB_Care_Program_Enrollee__r.Name, BI_PSPB_Care_Program_Enrollee__r.BI_PSP_Patient_status__c, BI_PSPB_Care_Program_Enrollee__r.BI_PSP_Loginattempt__c, BI_PSPB_Patient__r.PersonEmail,BI_PSPB_Caregiver__r.Name,BI_PSPB_Caregiver__r.PersonEmail';
			   Boolean withUserMode = false;
			   String conditions = 'BI_PSPB_Caregiver__r.Name = \'' + UserInfo.getName() + '\' AND BI_PSPB_Caregiver__r.PersonEmail = \'' + UserInfo.getUserEmail() + '\'';
			   // Call the common query utility method
			   List<BI_PSPB_Enrollee_Caregiver__c> listEnrollee = BI_PSP_CommonQueryUtility.executeQuery(sObjectType, fields, conditions, withUserMode);
			   if(!listEnrollee.isEmpty())
			   {
				   enrolleeList = (List<BI_PSPB_Enrollee_Caregiver__c>) listEnrollee;
			   }
			   if(enrolleeList.isEmpty())
			   {
					BI_PSP_LogMessagesUtility.logError(BI_PSPB_EnrollmentConstantCtrl.getLabel('ENROLLEE_CAREGIVER_ERROR'),BI_PSPB_EnrollmentUtilities.class.getName(),true,BI_PSPB_EnrollmentConstantCtrl.getLabel('LOG_SEVERITY_ERROR'));
			   }
			   
		   } catch (Exception ex) {
			   BI_PSP_LogMessagesUtility.exceptionLogMessage(BI_PSPB_EnrollmentConstantCtrl.getLabel('ENROLLEE_CAREGIVER_ERROR'),BI_PSPB_EnrollmentUtilities.class.getName(),ex);
		   }
		   return enrolleeList;
	   }
   }