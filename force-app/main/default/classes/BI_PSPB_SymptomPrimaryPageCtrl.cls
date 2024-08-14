/**
Apex Class Name   	BI_PSPB_SymptomPrimaryPageCtrl
Created Date         06.12.2023
@description        This class is used for inserting and updating symptom records such as allergy intolerance
				      and also deletin records in symptom records.
                    When a class is declared with "without sharing," it allows the code in that class to access and manipulate records even if the user 
	                  running the code does not have the necessary permissions based on the organization's sharing settings or record-level security.	 

@author             Karthikeyan.P
Modification Log
Ver   Date         Author                               Modification
59   08-04-2024   Karthikeyan.P.                     Initial Version
*/

public without sharing class BI_PSPB_SymptomPrimaryPageCtrl {
	/**
		
		@description     Method to retrieve symptom record data based on symptomTrackerId
                      USER_MODE cannot be implemented here, as it is querying health cloud object.
		@param           symptomTrackerId  The ID of the user for whom the symptoms are to be displayed.
		@return			 Returns all symptom tracking records for the current user.this values return pass to biPspbSymptomPrimarypage
		*/
	@AuraEnabled(cacheable=true)
	public static List<BI_PSP_Symptom_Tracker__c> getSymptomRecordData(
		String symptomTrackerId
	) {
		List<BI_PSP_Symptom_Tracker__c> primaryPageSymptom = new List<BI_PSP_Symptom_Tracker__c>();
		try {
			if (String.isBlank(symptomTrackerId)) {
				BI_PSP_LogMessagesUtility.logError(
					BI_PSP_SymptomTrackerConstantCtrl.symptomErrorMsg,
					BI_PSP_SymptomTrackerCtrl.class.toString(),
					true,
					BI_PSP_SymptomTrackerConstantCtrl.LOG_SEVERITY_ERROR
				);
			}
			String sObjectType = 'BI_PSP_Symptom_Tracker__c';
			String fields = ' Id,BI_PSP_EditEntrydates__c,BI_PSP_Patient__c,BI_PSP_Recent_Activities__c,BI_PSP_Are_you_currently_experiencing__c,BI_PSP_Care_Program_Enrollee__c';
			String conditions = 'Id = \'' + symptomTrackerId + '\'   LIMIT 1';

			// Use utility to execute query
			primaryPageSymptom = BI_PSP_CommonQueryUtility.executeQuery(
				sObjectType,
				fields,
				conditions,
				false
			);

			return primaryPageSymptom;
		} catch (Exception ex) {
			BI_PSP_LogMessagesUtility.logError(
				BI_PSP_SymptomTrackerConstantCtrl.error,
				BI_PSP_SymptomTrackerCtrl.class.toString(),
				true,
				BI_PSP_SymptomTrackerConstantCtrl.LOG_SEVERITY_ERROR
			);
		}
		return null;
	}

	/**
		
		@description     Method to retrieve allergy intolerance data based on symptomTrackerId
		@param           symptomTrackerId  The ID of the user who currently logged in.
		@return          Returns all allergy intolerance records.this values return pass to biPspbItchiness,biPspbFatiguesymptom
		                  biPspbMood,biPspbTemperaturesymtom,biPspbPainsymptom,biPspbRednesssymptom,biPspbPustulessymptom
		*/
	@AuraEnabled(cacheable=true)
	public static List<AllergyIntolerance> getAllergyIntoleranceData(
		String symptomTrackerId
	) {
		List<AllergyIntolerance> primaryAllergyIntolerance = new List<AllergyIntolerance>();
		try {
			if (String.isBlank(symptomTrackerId)) {
				BI_PSP_LogMessagesUtility.logError(
					BI_PSP_SymptomTrackerConstantCtrl.alleryRecord,
					BI_PSP_SymptomTrackerCtrl.class.toString(),
					true,
					BI_PSP_SymptomTrackerConstantCtrl.LOG_SEVERITY_ERROR
				);
			}
			String queryString =
				'SELECT Id, BI_PSP_Bodyparts__c,BI_PSP_Mood__c,BI_PSP_Intensity__c,BI_PSP_Temperature__c, BI_PSP_Symptoms__r.HealthCloudGA__CarePlanTemplate__r.Name FROM AllergyIntolerance WHERE BI_PSP_Symptom_Name__c = \'' +
				symptomTrackerId +
				'\'';

			primaryAllergyIntolerance = BI_PSP_CommonQueryUtility.executeComplexQuery(
				queryString,
				false
			);
			return primaryAllergyIntolerance;
		} catch (Exception ex) {
			BI_PSP_LogMessagesUtility.logError(
				BI_PSP_SymptomTrackerConstantCtrl.error,
				BI_PSP_SymptomTrackerCtrl.class.toString(),
				true,
				BI_PSP_SymptomTrackerConstantCtrl.LOG_SEVERITY_ERROR
			);
		}
		return null;
	}
	/** 
		@description     Method to retrieve base64 image based on symptomTrackerId
                        USER_MODE cannot be implemented here, as it is querying health cloud object.
		@param           symptomTrackerId Id of the user to view image
		@return          Image base64 is being returned in this method this values return pass to biPspbSymptomPrimarypage
		*/
	@AuraEnabled(cacheable=true)
	public static List<String> getBase64Image(Id symptomTrackerId) {
		List<String> base64URLs = new List<String>();

		try {
			if (String.isBlank(String.valueOf(symptomTrackerId))) {
				BI_PSP_LogMessagesUtility.logError(
					BI_PSP_SymptomTrackerConstantCtrl.symptomErrormsg,
					BI_PSP_SymptomTrackerCtrl.class.toString(),
					true,
					BI_PSP_SymptomTrackerConstantCtrl.LOG_SEVERITY_ERROR
				);
				return base64URLs; // Early return in case of error
			}

			// Query for ContentDocumentLinks related to the Symptom Tracker
			String queryString =
				'SELECT ContentDocumentId ' +
				'FROM ContentDocumentLink ' +
				'WHERE LinkedEntityId = \'' +
				symptomTrackerId +
				'\'' +
				'AND ContentDocument.FileType IN (\'jpg\', \'png\')';

			List<ContentDocumentLink> documentLinks = BI_PSP_CommonQueryUtility.executeComplexQuery(
				queryString,
				false
			);

			if (!documentLinks.isEmpty()) {
				List<Id> contentDocumentIds = new List<Id>();
				for (ContentDocumentLink docLink : documentLinks) {
					contentDocumentIds.add(docLink.ContentDocumentId);
				}

				// Convert List<Id> to a comma-separated string
				String contentDocumentIdsString =
					'\'' +
					String.join(contentDocumentIds, '\',\'') +
					'\'';

				// Query for the actual image data in ContentVersion
				String queryStringImagesGet =
					'SELECT VersionData, FileType ' +
					'FROM ContentVersion ' +
					'WHERE ContentDocumentId IN (' +
					contentDocumentIdsString +
					')' +
					'AND FileType IN (\'jpg\', \'png\') ' +
					'ORDER BY CreatedDate DESC';

				List<ContentVersion> contentVersions = BI_PSP_CommonQueryUtility.executeComplexQuery(
					queryStringImagesGet,
					false
				);

				for (ContentVersion content : contentVersions) {
					String base64URL =
						'data:image/' +
						content.FileType +
						';base64,' +
						EncodingUtil.base64Encode(content.VersionData);
					base64URLs.add(base64URL);
				}
			}
		} catch (Exception ex) {
			BI_PSP_LogMessagesUtility.logError(
				BI_PSP_SymptomTrackerConstantCtrl.applicationPhotoMsg,
				BI_PSP_SymptomTrackerCtrl.class.toString(),
				true,
				BI_PSP_SymptomTrackerConstantCtrl.LOG_SEVERITY_ERROR
			);
		}

		return base64URLs;
	}

	/**
		@description     Method to delete symptom tracker records based on symptomTrackerId
                        USER_MODE cannot be implemented here, as it is querying health cloud object.
		@param           symptomTrackerId Id of the user who deletes the record 
	
		*/
	@AuraEnabled
	public static void deleteSymptomTrackerRecords(Id symptomTrackerId) {
		try {
			String queryString =
				'SELECT Id, BI_PSP_Symptom_Staus__c FROM BI_PSP_Symptom_Tracker__c WHERE Id = \'' +
				symptomTrackerId +
				'\' ';

			List<BI_PSP_Symptom_Tracker__c> symptomTrackersToUpdate = BI_PSP_CommonQueryUtility.executeComplexQuery(
				queryString,
				false
			);

			if (symptomTrackersToUpdate.isEmpty()) {
				// Changes the status to "Inactive" for each record

				BI_PSP_LogMessagesUtility.logError(
					BI_PSP_SymptomTrackerConstantCtrl.stausChange,
					BI_PSP_SymptomTrackerCtrl.class.toString(),
					true,
					BI_PSP_SymptomTrackerConstantCtrl.LOG_SEVERITY_ERROR
				);
			}
			for (BI_PSP_Symptom_Tracker__c tracker : symptomTrackersToUpdate) {
				tracker.BI_PSP_Symptom_Staus__c = BI_PSP_SymptomTrackerConstantCtrl.symptomTrackerInactive;
			}

			BI_PSP_DatabaseOperationsUtility.updateOperation(
				symptomTrackersToUpdate,
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
	
		@description     Method to retrieve all latest record for the careprogram enrollee
                        USER_MODE cannot be implemented here, as it is querying health cloud object.
		@return          returns the recently updated records.this values return pass to biPspbSymptomPrimarypage
		*/
	@AuraEnabled(cacheable=true)
	public static List<String> getLatestSymptomRecord() {
		List<String> result = new List<String>();
		// Getting enrollee records
		ID careProgramEnrolleeId = BI_PSP_CurrentUser.getEnrolleeRecords()[0].Id;
		String symptomRecordTypeValue = String.valueOf(
			BI_PSP_SymptomTrackerConstantCtrl.symptomTrackerInactive
		);
		try {
			if (String.isBlank(careProgramEnrolleeId)) {
				BI_PSP_LogMessagesUtility.logError(
					BI_PSP_SymptomTrackerConstantCtrl.symptomErrormsg,
					BI_PSP_SymptomTrackerCtrl.class.toString(),
					true,
					BI_PSP_SymptomTrackerConstantCtrl.LOG_SEVERITY_ERROR
				);
			}
			// Query for the latest record based on the entry date
			String sObjectType = 'BI_PSP_Symptom_Tracker__c';
			String fields = 'Id, BI_PSP_EditEntrydates__c, BI_PSP_Care_Program_Enrollee__c';
			String conditions =
				'BI_PSP_Care_Program_Enrollee__c = \'' +
				careProgramEnrolleeId +
				'\' AND BI_PSP_Symptom_Staus__c != \'' +
				symptomRecordTypeValue +
				'\' ORDER BY BI_PSP_EditEntrydates__c DESC LIMIT 1';

			// Use utility to execute query
			List<BI_PSP_Symptom_Tracker__c> latestRecords = BI_PSP_CommonQueryUtility.executeQuery(
				sObjectType,
				fields,
				conditions,
				false
			);
			if (latestRecords.isEmpty()) {
				result.add(BI_PSP_SymptomTrackerConstantCtrl.error);
				return result;
			}
			// Access the fields of the latest record
			BI_PSP_Symptom_Tracker__c latestRecord = latestRecords[0];
			String recordId = latestRecord.Id;
			Datetime entryDate = latestRecord.BI_PSP_EditEntrydates__c;
			result.add(recordId);
			result.add(String.valueOf(entryDate));
		} catch (Exception ex) {
			BI_PSP_LogMessagesUtility.logError(
				BI_PSP_SymptomTrackerConstantCtrl.latestRecord,
				BI_PSP_SymptomTrackerCtrl.class.toString(),
				true,
				BI_PSP_SymptomTrackerConstantCtrl.LOG_SEVERITY_ERROR
			);
		}

		return result; //result null check is handled in the LWC
	}
}