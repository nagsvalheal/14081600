/**
* @description  Used to
    create task when a video is uploaded and calling the method to
    send sms and email.
* History
* Version    Author          Date        Detail      Description
* 1.0        Niyas        24-07-2024        Created        Refactored Version
*/
public with sharing class BI_PSPB_QuestionsSymptomProcessor {
	/**
	 * @description  Retrieves treatment reminders based on the given criteria.
	 * @param enrolleeIds The ID of the record related to the treatment reminders.
	 * @param wpaiCount The type of reminder to filter by.
	 * @return A list of BI_PSPB_Treatment_Reminder__c objects that match the criteria.
	 */
	public static List<Id> processSymptomTrackers( 
		Set<Id> enrolleeIds,
		Integer wpaiCount
	) {
		List<Id> enrolleeRecIds = new List<Id>();
		try {
			List<BI_PSP_Symptom_Tracker__c> symptomTrackers = getEnrolleeQuery(
				enrolleeIds
			);
			if (symptomTrackers.isEmpty()) {
				logRecordNotFound();
				return enrolleeRecIds;
			}

			Map<Id, BI_PSP_Symptom_Tracker__c> latestSymptomMap = buildLatestSymptomMap(
				symptomTrackers
			);
			addRecentEnrolleeRecords(
				enrolleeRecIds,
				latestSymptomMap,
				wpaiCount
			);
		} catch (Exception ex) {
			logException(ex);
		}
		return enrolleeRecIds;
	}
	/**
	 * @description  Retrieves treatment reminders based on the given criteria.
	 * @param symptomTrackers The ID of the record related to the treatment reminders.
	 * @return A list of BI_PSPB_Treatment_Reminder__c objects that match the criteria.
	 */
	private static Map<Id, BI_PSP_Symptom_Tracker__c> buildLatestSymptomMap(
		List<BI_PSP_Symptom_Tracker__c> symptomTrackers
	) {
		Map<Id, BI_PSP_Symptom_Tracker__c> latestSymptomMap = new Map<Id, BI_PSP_Symptom_Tracker__c>();
		for (BI_PSP_Symptom_Tracker__c symptom : symptomTrackers) {
			latestSymptomMap.put(
				symptom.BI_PSP_Care_Program_Enrollee__c,
				symptom
			);
		}
		return latestSymptomMap;
	}
	/**
	 * @description  Retrieves treatment reminders based on the given criteria.
	 * @param enrolleeRecIds The ID of the record related to the treatment reminders.
	 * @param latestSymptomMap The ID of the record related to the treatment reminders.
	 * @param wpaiCount The ID of the record related to the treatment reminders.
	 */
	private static void addRecentEnrolleeRecords(
		List<Id> enrolleeRecIds,
		Map<Id, BI_PSP_Symptom_Tracker__c> latestSymptomMap,
		Integer wpaiCount
	) {
		for (
			BI_PSP_Symptom_Tracker__c latestSymptom : latestSymptomMap.values()
		) {
			if (isRecordWithinDays(latestSymptom, wpaiCount)) {
				enrolleeRecIds.add(
					latestSymptom.BI_PSP_Care_Program_Enrollee__c
				);
			}
		}
	}
	/**
	 * @description  Retrieves treatment reminders based on the given criteria.
	 * @param latestSymptom The ID of the record related to the treatment reminders.
	 * @param wpaiCount The type of reminder to filter by.
	 * @return A list of BI_PSPB_Treatment_Reminder__c objects that match the criteria.
	 */
	private static boolean isRecordWithinDays(
		BI_PSP_Symptom_Tracker__c latestSymptom,
		Integer wpaiCount
	) {
		if (latestSymptom.CreatedDate == null) {
			return false;
		}

		Date sevenDaysLaterDate = latestSymptom.CreatedDate.addDays(wpaiCount)
			.date();
		return Date.today() == sevenDaysLaterDate;
	}
	/**
	 * @description  Used to create task when a video is uploaded and calling the
	 * method to send sms and email.
	 */
	private static void logRecordNotFound() {
		BI_PSP_LogMessagesUtility.logError(
			BI_PSPB_NotificationConstantsCtrl.errorMsgRecordNotFound,
			BI_PSPB_QuestionsSymptomProcessor.class.toString(),
			false,
			BI_PSPB_NotificationConstantsCtrl.severityError
		);
	}
	/**
	 * @description  Retrieves treatment reminders based on the given criteria.
	 * @param ex The ID of the record related to the treatment reminders.
	 */
	private static void logException(Exception ex) {
		BI_PSP_LogMessagesUtility.exceptionLogMessage(
          ex.getMessage(),
          BI_PSPB_QuestionsSymptomProcessor.class.getName(),
          ex
        );
	}

	/**
	 * @description  Retrieves treatment reminders based on the given criteria.
	 * @param enrolleeIds The ID of the record related to the treatment reminders.
	 * @return A list of BI_PSPB_Treatment_Reminder__c objects that match the criteria.
	 */
	public static List<BI_PSP_Symptom_Tracker__c> getEnrolleeQuery(
		Set<Id> enrolleeIds
	) {
		List<String> enrolleeIdStrings = new List<String>();
		for (Id id : enrolleeIds) {
			enrolleeIdStrings.add(id.toString());
		}
		String conditionIds =
			'(\'' +
			String.join(enrolleeIdStrings, '\', \'') +
			'\')';
		String fields = 'Id, BI_PSP_Care_Program_Enrollee__c, CreatedDate';
		String conditions =
			'BI_PSP_Care_Program_Enrollee__c IN ' +
			conditionIds +
			' ORDER BY CreatedDate DESC';
		List<SObject> results = BI_PSP_CommonQueryUtility.executeQuery(
			'BI_PSP_Symptom_Tracker__c',
			fields,
			conditions,
			false
		);
		return (List<BI_PSP_Symptom_Tracker__c>) results;
	}
}