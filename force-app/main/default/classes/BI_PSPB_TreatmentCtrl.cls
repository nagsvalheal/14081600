/**
 * @description BI_PSPB_TreatmentCtrl class handles the creation and management of treatment reminder records.
 * History
 * Version 	Author					Date				Detail		Description
 * 1.0		Anand S					16-Dec-2024			Created		This was an initial development.
 * 1.1		Rajaa					06-Apr-2024			Updated		Code Review Changes.
 * 1.2		Rajaa					23-July-2024		Updated 	Code Refactor.
 */ 
public with sharing class BI_PSPB_TreatmentCtrl {
    /**
     * @description Creates reminder records for the selected date, reminders, and treatments.
     * @param selectedDate The date of the treatment.
     * @param selectedReminders A list of selected reminder IDs.
     * @param selectedTreatment A list of selected treatment IDs.
     */
    @AuraEnabled(cacheable=false)
    public static void createRemainderRecord(        
        Date selectedDate,
        List<String> selectedReminders,
        List<String> selectedTreatment
    ) {
        try {
            if (selectedDate != null && !selectedReminders.isEmpty() && !selectedTreatment.isEmpty()) {
                Id accountId = BI_PSP_CurrentUser.getEnrolleeRecords()[0].id; 
                
                if (accountId != null) {   
                    List<BI_PSPB_Treatment_Reminder__c> remaindersToInsert = new List<BI_PSPB_Treatment_Reminder__c>();
                    Map<Integer, String> reminderMap = getMetadataMap(getRemindersMetadata());
                    Map<Integer, String> treatmentMap = getMetadataMap(getTreatmentsMetadata());
                    String dayOfTreatmentSubject = getDayOfTreatmentSubject();

                    updateExistingReminders(accountId);

                    remaindersToInsert.addAll(createReminderRecords(accountId, selectedDate, selectedReminders, reminderMap, BI_PSPB_TreatmentConstantsClassCtrl.actionTypePrescription));
                    remaindersToInsert.addAll(createReminderRecords(accountId, selectedDate, selectedTreatment, treatmentMap, BI_PSPB_TreatmentConstantsClassCtrl.actionTypeTreatment));
                    remaindersToInsert.add(createAdditionalRecord(accountId, selectedDate, dayOfTreatmentSubject));

                    insertReminderRecords(remaindersToInsert);
                    updateCareProgramEnrollee(accountId, selectedReminders, selectedTreatment);
                } else {
                    BI_PSP_LogMessagesUtility.logError(BI_PSPB_TreatmentConstantsClassCtrl.cpeNotFound, BI_PSPB_TreatmentCtrl.class.toString(), true, BI_PSPB_TreatmentConstantsClassCtrl.logError);
                }
            } else {
                BI_PSP_LogMessagesUtility.logError(BI_PSPB_TreatmentConstantsClassCtrl.parameterError, BI_PSPB_TreatmentCtrl.class.toString(), true, BI_PSPB_TreatmentConstantsClassCtrl.logError);
            }
        } catch (Exception ex) {
            BI_PSP_LogMessagesUtility.exceptionLogMessage(BI_PSPB_TreatmentConstantsClassCtrl.insertError, BI_PSPB_TreatmentCtrl.class.toString(), ex);
        }
    }

    /**
     * @description Updates existing reminders for a given account ID to inactive status.
     * @param accountId The account ID to update reminders for.
     */
    private static void updateExistingReminders(Id accountId) {
        try{
        String fields = 'Id';
        String conditions = 'BI_PSPB_Care_Program_Enrollee__c = \'' + accountId + '\' AND BI_PSPB_Status__c = \'' + BI_PSPB_TreatmentConstantsClassCtrl.actionTypeActive + '\'';
        Boolean withSharingKeywrd = false; // Adjust this as needed

        List<SObject> remindersToUpdate = BI_PSP_CommonQueryUtility.executeQuery('BI_PSPB_Treatment_Reminder__c', fields, conditions, withSharingKeywrd);
        List<BI_PSPB_Treatment_Reminder__c> remindersToUpdateList = new List<BI_PSPB_Treatment_Reminder__c>();

        if (!remindersToUpdate.isEmpty()) {
            for (SObject obj : remindersToUpdate) {
                BI_PSPB_Treatment_Reminder__c reminder = (BI_PSPB_Treatment_Reminder__c) obj;
                reminder.BI_PSPB_Status__c = BI_PSPB_TreatmentConstantsClassCtrl.actionTypeInactive;
                remindersToUpdateList.add(reminder);
            }
            
            BI_PSP_DatabaseOperationsUtility.updateOperation(remindersToUpdateList, BI_PSPB_TreatmentCtrl.class.toString(), false);
        } else {
            BI_PSP_LogMessagesUtility.logError(BI_PSPB_TreatmentConstantsClassCtrl.trtNotFound, BI_PSPB_TreatmentCtrl.class.toString(), false, BI_PSPB_TreatmentConstantsClassCtrl.logError);
        }
        }catch (Exception ex) {
            BI_PSP_LogMessagesUtility.exceptionLogMessage(BI_PSPB_TreatmentConstantsClassCtrl.insertError, BI_PSPB_TreatmentCtrl.class.toString(), ex);
        }
        
    }

    /**
     * @description Updates the CareProgramEnrollee record with the selected reminders and treatments.
     * @param accountId The account ID to update.
     * @param selectedReminders List of selected reminders.
     * @param selectedTreatment List of selected treatments.
     */
    private static void updateCareProgramEnrollee(Id accountId, List<String> selectedReminders, List<String> selectedTreatment) {
        try{
        CareProgramEnrollee careProgramEnrollee = getCareProgramEnrollee(accountId);
        if (careProgramEnrollee != null) {
            List<String> checkBoxes = new List<String>();
            checkBoxes.addAll(selectedReminders);
            checkBoxes.addAll(selectedTreatment);
            careProgramEnrollee.BI_PSPB_Selected_Checkboxes__c = String.join(checkBoxes, ';');
            
            BI_PSP_DatabaseOperationsUtility.updateOperation(new List<CareProgramEnrollee>{careProgramEnrollee}, BI_PSPB_TreatmentCtrl.class.toString(), false);
        } else {
            BI_PSP_LogMessagesUtility.logError(BI_PSPB_TreatmentConstantsClassCtrl.cpeNotFound, BI_PSPB_TreatmentCtrl.class.toString(), true, BI_PSPB_TreatmentConstantsClassCtrl.logError);
        }
    }
    
    catch (Exception ex) {
            BI_PSP_LogMessagesUtility.exceptionLogMessage(ex.getMessage(), BI_PSPB_TreatmentCtrl.class.toString(), ex);
        }
}
    /**
     * @description Retrieves the CareProgramEnrollee record for a given account ID.
     * @param accountId ID of the account to fetch the CareProgramEnrollee record for.
     * @return CareProgramEnrollee record.
     */
    private static CareProgramEnrollee getCareProgramEnrollee(Id accountId) {
        String fields = 'Id, BI_PSPB_Selected_Checkboxes__c';
        String conditions = 'Id = \'' + accountId + '\' LIMIT 1';
        Boolean withSharingKeywrd = false; // Adjust this as needed

        List<SObject> results = BI_PSP_CommonQueryUtility.executeQuery('CareProgramEnrollee', fields, conditions, withSharingKeywrd);
        return results.isEmpty() ? null : (CareProgramEnrollee) results[0];
    }

    /**
     * @description Retrieves all BI_PSPB_Notification__mdt metadata records.
     * @return List of BI_PSPB_Notification__mdt records.
     */
    private static List<BI_PSPB_Notification__mdt> getAllRemindersMetadata() {
        return BI_PSPB_Notification__mdt.getAll().values();
    }

    /**
     * @description Retrieves the reminder metadata records based on predefined constants.
     * @return List of BI_PSPB_Notification__mdt records.
     */
    private static List<BI_PSPB_Notification__mdt> getRemindersMetadata() {
        return getFilteredMetadata(
            getAllRemindersMetadata(),
            new Set<String>{
                BI_PSPB_TreatmentConstantsClassCtrl.treatmentFourteenDays,
                BI_PSPB_TreatmentConstantsClassCtrl.treatmentTenDays,
                BI_PSPB_TreatmentConstantsClassCtrl.treatmentSevenDays
            }
        );
    }

    /**
     * @description Retrieves the treatment metadata records based on predefined constants.
     * @return List of BI_PSPB_Notification__mdt records.
     */
    private static List<BI_PSPB_Notification__mdt> getTreatmentsMetadata() {
        return getFilteredMetadata(
            getAllRemindersMetadata(),
            new Set<String>{
                BI_PSPB_TreatmentConstantsClassCtrl.treatmentThreeDays,
                BI_PSPB_TreatmentConstantsClassCtrl.treatmentOneDay
            }
        );
    }

    /**
     * @description Filters metadata records based on provided developer names.
     * @param allMetadata List of all metadata records.
     * @param developerNames Set of developer names to filter by.
     * @return List of filtered metadata records.
     */
    private static List<BI_PSPB_Notification__mdt> getFilteredMetadata(List<BI_PSPB_Notification__mdt> allMetadata, Set<String> developerNames) {
        List<BI_PSPB_Notification__mdt> filteredMetadata = new List<BI_PSPB_Notification__mdt>();
        for (BI_PSPB_Notification__mdt notification : allMetadata) {
            if (developerNames.contains(notification.DeveloperName)) {
                filteredMetadata.add(notification);
            }
        }
        return filteredMetadata;
    }

    /**
     * @description Converts a list of metadata records to a map.
     * @param metadataList List of metadata records.
     * @return Map of metadata records with treatment days as keys.
     */
    private static Map<Integer, String> getMetadataMap(List<BI_PSPB_Notification__mdt> metadataList) {
        Map<Integer, String> metadataMap = new Map<Integer, String>();
        for (BI_PSPB_Notification__mdt metadata : metadataList) {
            metadataMap.put(Integer.valueOf(metadata.BI_PSPB_TreatmentDaysLeft__c), metadata.BI_PSPB_Subject__c);
        }
        return metadataMap;
    }

    /**
     * @description Retrieves the subject for the day of treatment reminder.
     * @return Subject for the day of treatment reminder.
     */
    private static String getDayOfTreatmentSubject() {
        List<BI_PSPB_Notification__mdt> dayOfTreatMetadata = getFilteredMetadata(
            getAllRemindersMetadata(),
            new Set<String>{ BI_PSPB_TreatmentConstantsClassCtrl.trDayOfTreatment }
        );
        return dayOfTreatMetadata.isEmpty() ? '' : dayOfTreatMetadata[0].BI_PSPB_Subject__c;
    }

    /**
     * @description Creates reminder records for the selected date, items, and metadata.
     * @param careProgramId ID of the CareProgramEnrollee.
     * @param selectedDate The date of the treatment.
     * @param selectedItems A list of selected items.
     * @param metadataMap A map of metadata records.
     * @param reminderType The type of reminder.
     * @return List of created reminder records.
     */
    private static List<BI_PSPB_Treatment_Reminder__c> createReminderRecords(
        Id careProgramId,
        Date selectedDate,
        List<String> selectedItems,
        Map<Integer, String> metadataMap,
        String reminderType
    ) {
        List<BI_PSPB_Treatment_Reminder__c> reminderRecords = new List<BI_PSPB_Treatment_Reminder__c>();
        for (String item : selectedItems) {
            BI_PSPB_Treatment_Reminder__c record = new BI_PSPB_Treatment_Reminder__c();
            record.BI_PSPB_Care_Program_Enrollee__c = careProgramId;
            record.BI_PSPB_Date_of_Treatment__c = selectedDate;
            record.BI_PSPB_Reminder_Date__c = selectedDate.addDays(-Integer.valueOf(item));
            record.BI_PSPB_Reminder_Type__c = reminderType;
            record.BI_PSPB_Status__c = BI_PSPB_TreatmentConstantsClassCtrl.actionTypeActive;
            record.BI_PSPB_Subject__c = metadataMap.get(Integer.valueOf(item));
            reminderRecords.add(record);
        }
        return reminderRecords;
    }

    /**
     * @description Creates an additional reminder record for the day of treatment.
     * @param careProgramId ID of the CareProgramEnrollee.
     * @param selectedDate The date of the treatment.
     * @param dayOfTreatmentSubject Subject for the day of treatment reminder.
     * @return Created reminder record.
     */
    private static BI_PSPB_Treatment_Reminder__c createAdditionalRecord(Id careProgramId, Date selectedDate, String dayOfTreatmentSubject) {
        BI_PSPB_Treatment_Reminder__c additionalRecord = new BI_PSPB_Treatment_Reminder__c();
        additionalRecord.BI_PSPB_Care_Program_Enrollee__c = careProgramId;
        additionalRecord.BI_PSPB_Date_of_Treatment__c = selectedDate;
        additionalRecord.BI_PSPB_Reminder_Date__c = selectedDate;
        additionalRecord.BI_PSPB_Reminder_Type__c = BI_PSPB_TreatmentConstantsClassCtrl.actionTypeDateOfTreatment;
        additionalRecord.BI_PSPB_Status__c = BI_PSPB_TreatmentConstantsClassCtrl.actionTypeActive;
        additionalRecord.BI_PSPB_Subject__c = dayOfTreatmentSubject;
        return additionalRecord;
    }

    /**
     * @description Inserts reminder records into the database.
     * @param reminderRecords List of reminder records to insert.
     */
    private static void insertReminderRecords(List<BI_PSPB_Treatment_Reminder__c> reminderRecords) {
       BI_PSP_DatabaseOperationsUtility.insertOperation(reminderRecords, BI_PSPB_TreatmentCtrl.class.toString(), false);
    }
}