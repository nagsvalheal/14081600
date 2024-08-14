/**
* @description			This class is used to insert case records for 
						updating prescriptions
						and to display related cases based on selected prescription status.
* History:
* Version	Author			Date			Detail			Description
* 1.0		Joyal			05-Dec-2023		Created			Initial development
* 1.1		Joyal			01-Jan-2024		Updated			Update  Database Insert 
* 1.2		Joyal			04-Apr-2024		Updated			Catch log added
* 1.3 		Gokul Krishnan 	10-Jul-2024		Refactored		In the createCaseRecordWithFiles method, 
															error handling is replaced with utility 
															class methods, and the method name is 
															updated to reflect its functionality. 
															Unnecessary null checks for the patientId 
															parameter are removed, and the currentuser 
															utility class is used to replace and 
															remove redundant methods.
*/
public with sharing class BI_PSPB_PatientPrescriptionCtrl {
	/**
	@description	This method creates the Case record for the prescriptions
					that are updated for the patient.
	@param			wrapper (class) - BI_PSPB_e_prescription__c,BI_PSPB_physical_copy__c,
					BI_PSPB_prescription_sent_to__c,BI_PSPB_Additional_Comments__c. 
	@param			fileIds (List<String>) - store the list of related case files.
	This method used in biPspbupdateRX component.
	*/
	@AuraEnabled(cacheable=false)
	public static void createCaseRecordWithFiles(
		BI_PSPB_caseForUpdateRxWrapper wrapper,
		List<String> fileIds
	) {
		// The values in the wrapper won't be null.Hence null check is not done.
		// The values in the fileIds can be null.Hence null check is not done.
		try {
			Id patientId = BI_PSP_CurrentUser.returnTheAccounts()[0].id;
			// Create a new Case instance and set its fields.
			Case newCase = new Case(
				RecordTypeId = BI_PSPB_PrescriptionConstantCtrl.recordTypeId,
				AccountId = patientId,
				BI_PSPB_e_prescription__c = wrapper.eprescription,
				BI_PSPB_physical_copy__c = wrapper.physicalCopy,
				BI_PSPB_prescription_sent_to__c = wrapper.prescriptionSentTo,
				BI_PSPB_Additional_Comments__c = wrapper.additionalComments
			);
			// Insert the new case record.
			BI_PSP_DatabaseOperationsUtility.insertOperation(
				new List<Case>{ newCase },
				BI_PSPB_PatientPrescriptionCtrl.class.toString(),
				true
			);

			/**If there are fileIds provided, associate
			 them with the newly created case.*/
			BI_PSPB_PatientCasesFilesCtrl.getContentDocumentLinks(
				fileIds,
				newCase.Id
			);
		} catch (Exception ex) {
			BI_PSP_LogMessagesUtility.exceptionLogMessage(
				ex.getMessage(),
				BI_PSPB_PatientPrescriptionCtrl.class.toString(),
				ex
			);
		}
	}
	/**
	@description	Used to show the case prescription status.
	@param			caseStatus (String) - selected Prescription status
	@return			List<Case> return the list of case records in
					prescriptionStatus Component.
	*/
	@AuraEnabled(cacheable=true)
	public static List<Case> getCasesForPatient(String caseStatus) {
		List<Case> patientCases = new List<Case>();
		try {
			// Retrieve the CareProgramEnrollee related to the patient.
			Id careProgramEnrolleeId = BI_PSP_CurrentUser.getEnrolleeRecords()[0]
				.id;
			if (String.isNotBlank(caseStatus)) {
				/**Retrieve cases for the patient with the specified status and record 
				type.USER_MODE could not be used because of the HealthCloud 
				Object limitation for CareProgramEnrollee which is the lookup object for 
				field BI_PSP_Patient__c.*/

				// Define the parameters for the query
				String sObjectType = 'Case';
				String fields = 'Id, CaseNumber, BI_PSP_Patient__c, AccountId, Status, BI_PSP_Type__c, BI_PSPB_Additional_Comments__c, CreatedDate';
				String conditions =
					'BI_PSP_Patient__c = \'' +
					careProgramEnrolleeId +
					'\' AND Status = \'' +
					caseStatus +
					'\' AND RecordTypeId = \'' +
					BI_PSPB_PrescriptionConstantCtrl.recordTypeId +
					'\'';
				Boolean withUserMode = false; // or false based on your need

				// Execute the query using the utility method
				// Cast the results to the specific object type
				patientCases = BI_PSP_CommonQueryUtility.executeQuery(
					sObjectType,
					fields,
					conditions,
					withUserMode
				);
			} else {
				/** Retrieve all cases for the patient with the specified record type.
				USER_MODE could not be used because of the HealthCloud Object 
				limitation for CareProgramEnrollee which is the lookup object for 
				field BI_PSP_Patient__c*/
				// Define the parameters for the query
				String sObjectType = 'Case';
				String fields = 'Id, CaseNumber, BI_PSP_Patient__c, AccountId, Status, BI_PSP_Type__c, BI_PSPB_Additional_Comments__c, CreatedDate';
				String conditions =
					'BI_PSP_Patient__c = \'' +
					careProgramEnrolleeId +
					'\' AND RecordTypeId = \'' +
					BI_PSPB_PrescriptionConstantCtrl.recordTypeId +
					'\'';
				Boolean withUserMode = false; // or false based on your need

				// Execute the query using the utility method
				// Cast the results to the specific object type
				patientCases = BI_PSP_CommonQueryUtility.executeQuery(
					sObjectType,
					fields,
					conditions,
					withUserMode
				);
			}
		} catch (Exception ex) {
			BI_PSP_LogMessagesUtility.exceptionLogMessage(
				BI_PSPB_PrescriptionConstantCtrl.errorForCase,
				BI_PSPB_PatientPrescriptionCtrl.class.toString(),
				ex
			);
		}
		return patientCases;
	}
	/**
	 * @description This class is used to store the values of case insert fields for updating prescriptions.
	 */
	public class BI_PSPB_caseForUpdateRxWrapper {
		/**
		 * @description The e-prescription details.
		 */
		@AuraEnabled
		public String eprescription { get; set; }

		/**
		 * @description The physical copy details.
		 */
		@AuraEnabled
		public String physicalCopy { get; set; }

		/**
		 * @description The details of where the prescription is sent to.
		 */
		@AuraEnabled
		public String prescriptionSentTo { get; set; }

		/**
		 * @description Any additional comments related to the prescription.
		 */
		@AuraEnabled
		public String additionalComments { get; set; }
	}
}