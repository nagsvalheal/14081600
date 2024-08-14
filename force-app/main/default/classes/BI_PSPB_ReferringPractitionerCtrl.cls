/**
 * @description     This class is used to handle operations related to referring practitioners 
 *                   and other related data. It is designed for guest users with limited access 
 *                   and is used to retrieve data from the `Contact` and `BI_PSPB_State__c` objects. 
 *                   Methods in this class include fetching lists of physicians, countries, and states, 
 *                   and constructing query conditions. All methods are cacheable for improved 
 *                   performance in Lightning components.
 * 
 * @history
 * Version  Author    	Date          	Detail          Description
 * 1.0      Ashif     	05-Nov-2023    	Created         Initial development
 * 1.1      Ashif     	04-Apr-2024    	Updated         Catch log added
 * 1.2		Sowmitha	30-July-2024	Updates			Code refactored	
 */
public without sharing class BI_PSPB_ReferringPractitionerCtrl {
	/**
 * @description      Constructs the query conditions for filtering `Contact` records based on 
 *                   the record type ID and status group. This method builds a string of conditions 
 *                   used in SOQL queries to fetch contacts that match the specified criteria.
 * @param recordTypeId The record type ID used to filter contacts by their record type.
 * @return           Returns a string representing the query conditions for filtering `Contact` records.
 */
	public static String buildConditions(Id recordTypeId) {
		String conditions = '';
		conditions += 'RecordType.Id = \'' + recordTypeId + '\'';
		conditions += ' AND ';
		conditions += 'HealthCloudGA__StatusGroup__c = \'' +  BI_PSPB_EnrollmentConstantCtrl.getLabel('ACTIVE') + '\'';
	 	return conditions;

 	}
/**
 * @description      Retrieves a list of physician contacts based on the specified record type. 
 *                   This method queries the `Contact` object to fetch contacts that are designated 
 *                   as physicians and meet specific criteria. The result is intended to be used in 
 *                   Lightning Web Components (LWC) and is cacheable for improved performance.
 * @return           Returns a list of `Contact` objects where each contact represents a physician.
 */
	@AuraEnabled(cacheable=true)
	public static List<Contact> getPractitionerList() {
		List<Contact> practitionerList = new List<Contact>();
		try {
			Id recordTypeId = BI_PSP_CommonQueryUtility.retrieveRecordTypeId('Contact', BI_PSPB_EnrollmentConstantCtrl.getLabel('PHYSICIAN') );
			// Since this object is invoked from a Guest User Profile which has limited access, User Mode cannot be used here
			// This is a searchable combo box. If the Aura Enabled Exception is thrown, for every character search, the error 
			// will be displayed that disrupts the screen design. 
            //In the respective LWC, the error message is displayed as 'Unable to find' below the combo box input field 
            //(that will be visible to the user)  if the record is not found.
			String fields = 'Id, Name, BI_PSPB_Specialist__c, MailingCity,BI_PSPB_License_number__c';
			String conditions = buildConditions(recordTypeId);
			Boolean withSharingKeywrd = false;
			List<SObject> sObjectResponses = BI_PSP_CommonQueryUtility.executeQuery('Contact', fields, conditions, withSharingKeywrd);
			for (SObject sObj : sObjectResponses) {
                practitionerList.add((Contact) sObj);
            }

            // This is a searchable combo box. If the Aura Enabled Exception is thrown, for every character search, the error 
			// will be displayed that disrupts the screen design. 
            //In the respective LWC, the error message is displayed as 'Unable to find' below the combo box input field 
            //(that will be visible to the user)  if the record is not found.
		} catch (Exception ex) {
			BI_PSP_LogMessagesUtility.exceptionLogMessage(null, BI_PSPB_ReferringPractitionerCtrl.class.getName(), ex);
            // Returning null if an exception occurs
		}
		return practitionerList;
	}
  
}