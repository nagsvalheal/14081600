/**
 * @description Controller class for managing Symptom Tracker details.
 * Provides methods to retrieve and process symptom records based on enrollee ID and date range.
 */
public with sharing class BI_PSP_SymptomTrackerGraphCtrl {
	/**
	 * @description Retrieves symptom tracker details based on enrollee ID and date range.
	 *
	 * @param erolleId The enrollee ID to filter the symptom records.
	 * @return A list of SymptomTracker objects representing the symptom tracker details, or null if no records are found or an error occurs.
	 */
	@AuraEnabled(cacheable=true)
	public static List<SymptomTracker> getSymptomTrackerDetails(String erolleId) {
		try {
			List<BI_PSP_Symptom_Tracker__c> recordSymptom = fetchSymptomRecords(
				erolleId
			);

			if (recordSymptom.isEmpty()) {
				return null;
			}

			List<SymptomTracker> symptomTrackers = processSymptomRecords(
				recordSymptom
			);

			return symptomTrackers.isEmpty() ? null : symptomTrackers;
		} catch (Exception ex) {
			BI_PSP_LogMessagesUtility.logError(
				BI_PSP_SymptomTrackerConstantCtrl.symptomErrorMsg,
				BI_PSP_SymptomTrackerGraphCtrl.class.toString(),
				true,
				BI_PSP_SymptomTrackerConstantCtrl.LOG_SEVERITY_ERROR
			);

			return null;
		}
	}
	/**
	 * @description Fetches symptom records from the database based on the given parameters.
	 *
	 * @param erolleId The enrollee ID to filter the records.
	 * @return A list of BI_PSP_Symptom_Tracker__c records matching the criteria.
	 */
	private static List<BI_PSP_Symptom_Tracker__c> fetchSymptomRecords(
		String erolleId
	) {
		String activeStatusValue = String.valueOf(
			BI_PSP_QuestionnaireConstant.symptomStatusInactive
		);
		String query =
			'SELECT Id, LastModifiedDate, BI_PSP_Care_Program_Enrollee__c, BI_PSP_EditEntrydates__c, CreatedDate ' +
			'FROM BI_PSP_Symptom_Tracker__c ' +
			'WHERE BI_PSP_Care_Program_Enrollee__c = \'' +
			erolleId +
			'\' ' +
			'AND BI_PSP_Symptom_Staus__c != \'' +
			activeStatusValue +
			'\' ' +
			'ORDER BY BI_PSP_EditEntrydates__c ASC';

		List<BI_PSP_Symptom_Tracker__c> symptomRecords = BI_PSP_CommonQueryUtility.executeComplexQuery(
			query,
			false
		);
		return symptomRecords;
	}
	
	/**
	 * @description Processes the symptom records and creates a list of SymptomTracker objects.
	 *
	 * @param recordSymptom A list of BI_PSP_Symptom_Tracker__c records to process.
	 * @return A list of SymptomTracker objects based on the provided symptom records.
	 */
	private static List<SymptomTracker> processSymptomRecords(
		List<BI_PSP_Symptom_Tracker__c> recordSymptom
	) {
		List<SymptomTracker> symptomTrackers = new List<SymptomTracker>();
		Set<Id> symptomIds = extractSymptomIds(recordSymptom);

		if (!symptomIds.isEmpty()) {
			List<AllergyIntolerance> allergyTrack = fetchAllergyIntolerance(
				symptomIds
			);

			if (!allergyTrack.isEmpty()) {
				for (AllergyIntolerance allergy : allergyTrack) {
					symptomTrackers.add(createSymptomTracker(allergy));
				}
			}
		}
		return symptomTrackers;
	}
	/**
	 * @description Extracts symptom IDs from the list of BI_PSP_Symptom_Tracker__c records.
	 *
	 * @param recordSymptom A list of BI_PSP_Symptom_Tracker__c records.
	 * @return A set of symptom IDs extracted from the records.
	 */
	private static Set<Id> extractSymptomIds(
		List<BI_PSP_Symptom_Tracker__c> recordSymptom
	) {
		Set<Id> symptomIds = new Set<Id>();
		for (BI_PSP_Symptom_Tracker__c symp : recordSymptom) {
			if (symp.Id != null) {
				// Ensure Id is not null
				symptomIds.add(symp.Id);
			}
		}

		return symptomIds;
	}
	/**
	 * @description Fetches allergy intolerance records based on symptom IDs.
	 *
	 * @param symptomIds A set of symptom IDs to filter the allergy intolerance records.
	 * @return A list of AllergyIntolerance records matching the symptom IDs.
	 */
	private static List<AllergyIntolerance> fetchAllergyIntolerance(
		Set<Id> symptomIds
	) {
		String symptomIdsString = '\'' + String.join(symptomIds, '\',\'') + '\'';
		String query =
			'SELECT Id, BI_PSP_Graph_Symptom_Name__c, BI_PSP_Symptom_Name__r.BI_PSP_EditEntrydates__c, ' +
			'BI_PSP_Symptoms__r.HealthCloudGA__CarePlanTemplate__r.Name ' +
			'FROM AllergyIntolerance ' +
			'WHERE BI_PSP_Symptom_Name__r.Id IN (' +
			symptomIdsString +
			')' +
			'AND BI_PSP_Symptoms__r.HealthCloudGA__CarePlanTemplate__r.Name != NULL ' +
			'AND BI_PSP_Symptoms__c != NULL ' +
			'ORDER BY BI_PSP_Symptom_Name__r.BI_PSP_EditEntrydates__c';

		List<AllergyIntolerance> allergyIntoleranceRecords = BI_PSP_CommonQueryUtility.executeComplexQuery(
			query,
			false
		);
		return allergyIntoleranceRecords;
	}
	/**
	 * @description Creates a SymptomTracker object from an AllergyIntolerance record.
	 *
	 * @param allergy The AllergyIntolerance record to convert.
	 * @return A SymptomTracker object representing the provided AllergyIntolerance record.
	 */
	private static SymptomTracker createSymptomTracker(
		AllergyIntolerance allergy
	) {
		SymptomTracker symp = new SymptomTracker();
		symp.symptom = allergy.BI_PSP_Graph_Symptom_Name__c;
		symp.symptom = allergy.BI_PSP_Symptom_Name__c;
		symp.dates = allergy.BI_PSP_Symptom_Name__r.BI_PSP_EditEntrydates__c;
		symp.name = allergy.BI_PSP_Symptoms__r.HealthCloudGA__CarePlanTemplate__r.Name;

		return symp;
	}

	/**
	 * Represents a wrapper class for symptom tracker data in Salesforce.
	 * @description This class encapsulates symptom tracking information retrieved from Salesforce records.
	 */
	public class SymptomTracker {
		/**
		 * The date of the symptom tracker record.
		 * @description This field represents when the symptom record was created or last modified.
		 */
		@AuraEnabled
		public Date dates; // Date of the symptom tracker record.

		/**
		 * The name associated with the symptom.
		 * @description This field represents the name of the symptom as recorded in Salesforce.
		 */
		@AuraEnabled
		public String name; // Name associated with the symptom.

		/**
		 * The description of the symptom.
		 * @description This field provides a description or additional information about the symptom.
		 */
		@AuraEnabled
		public String symptom; // Description of the symptom.
	}
}