/**
 * @description This class provides helper methods for managing Symptom Tracker records.
 * It includes methods for retrieving, saving, and validating records, as well as creating
 * and updating related records such as AllergyIntolerance.
 */
public with sharing class BI_PSP_SymptomTrackerHelperCtrl {
	/**
	 * @description Retrieves a Symptom Tracker record by its ID.
	 *
	 * @param symptomTrackerId The ID of the Symptom Tracker record to retrieve.
	 * @return The Symptom Tracker record if found; otherwise, null.
	 */

	public static BI_PSP_Symptom_Tracker__c getSymptomTrackerById(
		String symptomTrackerId
	) {
		if (String.isBlank(symptomTrackerId)) {
			BI_PSP_LogMessagesUtility.logError(
				BI_PSP_SymptomTrackerConstantCtrl.symptomErrorMsg,
				BI_PSP_SymptomTrackerCtrl.class.toString(),
				true,
				BI_PSP_SymptomTrackerConstantCtrl.LOG_SEVERITY_ERROR
			);
		}
		String symptomTrackerIdValue = String.valueOf(symptomTrackerId);

		String queryString =
			'SELECT Id, BI_PSP_Care_Program_Enrollee__c, BI_PSP_Are_you_currently_experiencing__c, BI_PSP_EditEntrydates__c ' +
			'FROM BI_PSP_Symptom_Tracker__c ' +
			'WHERE Id = \'' +
			symptomTrackerIdValue +
			'\' ' +
			'LIMIT 1';

		List<BI_PSP_Symptom_Tracker__c> records = BI_PSP_CommonQueryUtility.executeComplexQuery(
			queryString,false
		);
		return records.isEmpty() ? null : records[0];
	}
	/**
	 * @description Saves the provided Symptom Tracker record and handles any errors that occur during the save operation.
	 *
	 * @param symptomTracker The Symptom Tracker record to be saved.
	 * @throws AuraHandledException If an error occurs during the save operation.
	 */

	// Helper method to save a symptom tracker and handle errors
    @AuraEnabled(cacheable=false)
	public static void saveSymptomTracker(
		BI_PSP_Symptom_Tracker__c symptomTracker
	) {
		try {
			BI_PSP_DatabaseOperationsUtility.updateOperation(
				new List<BI_PSP_Symptom_Tracker__c>{ symptomTracker },
				BI_PSP_SymptomTrackerCtrl.class.toString(),
                false
			);
		} catch (System.DmlException ex) {
			BI_PSP_LogMessagesUtility.catchSystemException(
				BI_PSP_SymptomTrackerConstantCtrl.applicationPhotoMsg,
				BI_PSP_SymptomTrackerCtrl.class.toString(),
				ex
			);
		}
	}

	/**
	 * @description Checks if there is an existing inactive Symptom Tracker record for the specified care program enrollee and edit entry date.
	 *
	 * @param cpeList The ID of the Care Program Enrollee.
	 * @param editEntryDate The date when the entry was edited.
	 * @return True if there is at least one inactive record for the given care program enrollee and edit entry date, otherwise false.
	 */

	// Helper method to check if an existing inactive record exists
	public static Boolean isExistingInactiveRecord(
		String cpeList,
		Date editEntryDate
	) {
		if (String.isBlank(cpeList) || editEntryDate == null) {
			BI_PSP_LogMessagesUtility.logError(
				BI_PSP_SymptomTrackerConstantCtrl.symptomErrorMsg,
				BI_PSP_SymptomTrackerCtrl.class.toString(),
				true,
				BI_PSP_SymptomTrackerConstantCtrl.LOG_SEVERITY_ERROR
			);
			return false; // Early return in case of error
		}

		// Convert variables to strings
		String editEntryDateValue = String.valueOf(editEntryDate);
		String inActiveStatusValue = String.valueOf(
			BI_PSP_SymptomTrackerConstantCtrl.inActive
		);

		// Construct the dynamic query string
		String queryString =
			'SELECT Id ' +
			'FROM BI_PSP_Symptom_Tracker__c ' +
			'WHERE BI_PSP_Care_Program_Enrollee__c = \'' +
			cpeList +
			'\' ' +
			'AND BI_PSP_EditEntrydates__c = ' +
			editEntryDateValue +
			' ' +
			'AND BI_PSP_Symptom_Staus__c = \'' +
			inActiveStatusValue +
			'\' ' +
			'LIMIT 1';

		// Execute the query

		List<BI_PSP_Symptom_Tracker__c> existingRecords = BI_PSP_CommonQueryUtility.executeComplexQuery(
			queryString,false
		);

		// Return true if the list is not empty, otherwise return false
		return !existingRecords.isEmpty();
	}

	
	/**
	 * @description Retrieves the Account ID associated with the given care program ID.
	 *
	 * @param careProgramId The ID of the care program.
	 * @return The Account ID associated with the care program.
	 * @throws AuraHandledException If the CareProgramEnrollee record is not found or if the Account ID is null.
	 */

	// Helper method to retrieve AccountId
	public static String getAccountId(String careProgramId) {
		CareProgramEnrollee cpes = getCareProgramEnrollee(careProgramId);
		if (cpes == null || cpes.AccountId == null) {
			BI_PSP_LogMessagesUtility.logError(
				BI_PSP_SymptomTrackerConstantCtrl.symptomErrorMsg,
				BI_PSP_SymptomTrackerCtrl.class.toString(),
				true,
				BI_PSP_SymptomTrackerConstantCtrl.LOG_SEVERITY_ERROR
			);
		}
		return cpes.AccountId;
	}
	/**
	 * @description Retrieves a CareProgramEnrollee record by its ID.
	 *
	 * @param careProgramId The ID of the CareProgramEnrollee record to retrieve.
	 * @return The CareProgramEnrollee record if found, otherwise null.
	 */
	// Helper method to retrieve CareProgramEnrollee
	public static CareProgramEnrollee getCareProgramEnrollee(
		String careProgramId
	) {
		if (String.isBlank(careProgramId)) {
			BI_PSP_LogMessagesUtility.logError(
				BI_PSP_SymptomTrackerConstantCtrl.symptomErrorMsg,
				BI_PSP_SymptomTrackerCtrl.class.toString(),
				true,
				BI_PSP_SymptomTrackerConstantCtrl.LOG_SEVERITY_ERROR
			);
		}

		Id careProgramIdNew = careProgramId;

		// Construct the query string
		String query =
			'SELECT Id, AccountId ' +
			'FROM CareProgramEnrollee ' +
			'WHERE Id  = \'' +
			careProgramIdNew +
			'\' ' +
			'LIMIT 1';

		// Execute the dynamic query
		List<CareProgramEnrollee> cpesList = BI_PSP_CommonQueryUtility.executeComplexQuery(
			query,false
		);

		return cpesList.isEmpty() ? null : cpesList[0];
	}
	/**
	 * @description Retrieves a CarePlanTemplate record by its name.
	 *
	 * @param name The name of the CarePlanTemplate to retrieve.
	 * @return The CarePlanTemplate record if found.
	 * @throws AuraHandledException If no CarePlanTemplate records are found with the given name.
	 */

	// Helper method to retrieve CarePlanTemplate
	public static HealthCloudGA__CarePlanTemplate__c getCarePlanTemplate(
		String name
	) {
		String query =
			'SELECT Id ' +
			'FROM HealthCloudGA__CarePlanTemplate__c ' +
			'WHERE Name = \'' +
			name +
			'\' ' +
			'LIMIT 1';

		// Execute the dynamic query

		List<HealthCloudGA__CarePlanTemplate__c> cptList = BI_PSP_CommonQueryUtility.executeComplexQuery(
			query,false
		);
		if (cptList.isEmpty()) {
			BI_PSP_LogMessagesUtility.logError(
				BI_PSP_SymptomTrackerConstantCtrl.symptomErrorMsg,
				BI_PSP_SymptomTrackerCtrl.class.toString(),
				true,
				BI_PSP_SymptomTrackerConstantCtrl.LOG_SEVERITY_ERROR
			);
		}
		return cptList[0];
	}
	/**
	 * @description Retrieves a CareProgramPlanTemplate record associated with a given CarePlanTemplate ID.
	 *
	 * @param cptId The ID of the CarePlanTemplate.
	 * @return The CareProgramPlanTemplate record if found.
	 * @throws AuraHandledException If no CareProgramPlanTemplate records are found.
	 */
	// Helper method to retrieve CareProgramPlanTemplate
	@AuraEnabled(cacheable=true)
	public static HealthCloudGA__CareProgramPlanTemplate__c getCareProgramPlanTemplate(
		Id cptId
	) {
		if (String.isBlank(cptId)) {
			BI_PSP_LogMessagesUtility.logError(
				BI_PSP_SymptomTrackerConstantCtrl.symptomErrorMsg,
				BI_PSP_SymptomTrackerCtrl.class.toString(),
				true,
				BI_PSP_SymptomTrackerConstantCtrl.LOG_SEVERITY_ERROR
			);
		}

		String query =
			'SELECT Id ' +
			'FROM HealthCloudGA__CareProgramPlanTemplate__c ' +
			'WHERE HealthCloudGA__CarePlanTemplate__c = \'' +
			cptId +
			'\' ' +
			'LIMIT 1';

		// Execute the dynamic query
		//

		List<HealthCloudGA__CareProgramPlanTemplate__c> careProgramList = BI_PSP_CommonQueryUtility.executeComplexQuery(
			query,false
		);

		return careProgramList[0];
	}

	
}