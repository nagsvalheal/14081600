/**
 * @class BI_PSP_SymptomTrackerAllergyCtrl
 * @description This class provides methods for managing AllergyIntolerance records based on symptom tracker data. 
 * It includes functionality for validating input parameters, creating and updating AllergyIntolerance records, 
 * and retrieving existing records. The class uses a wrapper class to encapsulate symptom tracker data and 
 * ensures that the AllergyIntolerance records are handled appropriately based on the provided data.
 */
public class BI_PSP_SymptomTrackerAllergyCtrl {
    /**
	 * @description Validates the input parameters for null values.
	 *
	 * @param record The Symptom Tracker wrapper object that contains symptom-related data.
	 * @param bodyParts A list of body parts associated with the symptom.
	 * @throws AuraHandledException If either the record or bodyParts parameters are null.
	 */
	// Helper method to validate input parameters
	public static void validateInputs(
		BI_PSPB_Symptomtrackerwrapeermethod record,
		List<String> bodyParts
	) {
		if (record == null || bodyParts == null) {
			BI_PSP_LogMessagesUtility.logError(
				BI_PSP_SymptomTrackerConstantCtrl.symptomErrorMsg,
				BI_PSP_SymptomTrackerCtrl.class.toString(),
				true,
				BI_PSP_SymptomTrackerConstantCtrl.LOG_SEVERITY_ERROR
			);
		}
	}
    
    /**
	 * @description Creates a new AllergyIntolerance record based on the provided symptom tracker data.
	 *
	 * @param record The wrapper method containing data for the new AllergyIntolerance record.
	 * @param bodyParts A list of body parts associated with the symptom.
	 * @param careProgramId The ID of the care program associated with the symptom.
	 * @param accountId The ID of the patient account.
	 * @return The newly created AllergyIntolerance record.
	 */

	// Helper method to create AllergyIntolerance record
	public static AllergyIntolerance createAllergyIntolerance(
		BI_PSPB_Symptomtrackerwrapeermethod record,
		List<String> bodyParts,
		Id careProgramId,
		String accountId
	) {
		AllergyIntolerance ai = new AllergyIntolerance();
		ai.BI_PSP_Symptoms__c = careProgramId;
		ai.BI_PSP_Symptom_Name__c = record.symptomId;
        ai.PatientId = accountId;
		ai.BI_PSP_Bodyparts__c = (bodyParts != null && !bodyParts.isEmpty())
			? String.join(bodyParts, ';')
			: null;
		ai.BI_PSP_Intensity__c = (record.sliderValue != null &&
			record.sliderValue != 0)
			? Decimal.valueOf(record.sliderValue)
			: null;
		ai.BI_PSP_Temperature__c = (record.valoF != null &&
			String.valueOf(record.valoF) != '0')
			? record.valoF
			: null;
		ai.BI_PSP_Mood__c = (!String.isEmpty(record.moodvalues))
			? record.moodvalues
			: null;
	
		return ai;
	}
	/**
	 * @description Retrieves the most recent existing AllergyIntolerance record for a given account and care program.
	 *
	 * @param accountId The ID of the patient account.
	 * @param careProgramId The ID of the care program associated with the symptom.
	 * @return The most recent AllergyIntolerance record if found.
	 * @throws AuraHandledException If no existing Allergy Intolerance records are found.
	 */
	// Helper method to retrieve existing AllergyIntolerance record
	public static AllergyIntolerance getExistingAllergyIntoleranceRecord(
		String accountId,
		Id careProgramId
	) {
		if (String.isBlank(accountId) || String.isBlank(careProgramId)) {
            BI_PSP_LogMessagesUtility.logError(
				BI_PSP_SymptomTrackerConstantCtrl.symptomErrorMsg,
				BI_PSP_SymptomTrackerCtrl.class.toString(),
				true,
				BI_PSP_SymptomTrackerConstantCtrl.LOG_SEVERITY_ERROR
			);
		}

		String query =
			'SELECT Id, BI_PSP_Bodyparts__c, BI_PSP_Intensity__c, BI_PSP_Temperature__c, BI_PSP_Mood__c ' +
			'FROM AllergyIntolerance ' +
			'WHERE PatientId = \'' +
			accountId +
			'\' AND BI_PSP_Symptoms__c = \'' +
			careProgramId +
			'\' ' +
			'ORDER BY CreatedDate DESC ' +
			'LIMIT 1';

		// Execute the dynamic query
		//

		List<AllergyIntolerance> existingRecords = BI_PSP_CommonQueryUtility.executeComplexQuery(
			query,false
		);

		return existingRecords[0];
	}

	/**
	 * @description Updates an existing AllergyIntolerance record with new values.
	 *
	 * @param existingRecord The existing AllergyIntolerance record to update.
	 * @param record The wrapper method containing new values for the AllergyIntolerance record.
	 * @param bodyParts A list of body parts associated with the symptom.
	 */

	// Helper method to update AllergyIntolerance record
	public static void updateAllergyIntoleranceRecord(
		AllergyIntolerance existingRecord,
		BI_PSPB_Symptomtrackerwrapeermethod record,
		List<String> bodyParts
	) {
		existingRecord.BI_PSP_Symptom_Name__c = record.symptomId;
		existingRecord.BI_PSP_Bodyparts__c = (bodyParts != null &&
			!bodyParts.isEmpty())
			? String.join(bodyParts, ';')
			: null;
		existingRecord.BI_PSP_Intensity__c = (record.sliderValue != null &&
			record.sliderValue != 0)
			? Decimal.valueOf(record.sliderValue)
			: null;
		existingRecord.BI_PSP_Temperature__c = (record.valoF != null &&
			String.valueOf(record.valoF) != '0')
			? record.valoF
			: null;
		existingRecord.BI_PSP_Mood__c = (!String.isEmpty(record.moodvalues))
			? record.moodvalues
			: null;
	}
    
    /**
	 * Represents a wrapper class for symptom tracker data in Salesforce.
	 *
	 * @description This class is used to encapsulate the data related to symptom tracking, including various attributes such as care program ID, slider value, symptom ID, and other related information. It is designed to facilitate the transfer of symptom tracker data between components and Apex controllers.
	 */

	public class BI_PSPB_Symptomtrackerwrapeermethod {
		/**
		 * @description The ID of the care program associated with the symptom tracker.
		 */
		@AuraEnabled
		public String careProgramId { get; set; }
		/**
		 * @description The value of the slider used for symptom tracking.
		 */
		@AuraEnabled
		public Integer sliderValue { get; set; }
		/**
		 * @description A decimal value that represents a specific metric or measurement in the symptom tracker data.
		 */
		@AuraEnabled
		public Decimal valoF { get; set; }
		/**
		 * @description The ID of the symptom associated with the symptom tracker.
		 */
		@AuraEnabled
		public String symptomId { get; set; }
		/**
		 * @description The gender of the person for whom the symptom tracker data is recorded.
		 */
		@AuraEnabled
		public String personGender { get; set; }
		/**
		 * @description Mood-related values associated with the symptom tracker data.
		 */
		@AuraEnabled
		public String moodvalues { get; set; }
		/**
		 * @description The name of the symptom being tracked.
		 */
		@AuraEnabled
		public String symptomname { get; set; }
	}

}