/**
 * @description Apex class to handle triggers for Assessment object.
 *              It provides functionality to format the EffectiveDateTime field 
 *              and populate the custom field BI_PSP_DateForCQ__c with the formatted date.
 * History:
 * Version    Author      Date            Detail          Description
 * 1.0        Abinsha     05-Dec-2023     Created         Initial development.
 * 1.1        Abinsha     01-Jan-2024     Updated         Updated for caregiver.
 * 1.2        Abinsha     04-Apr-2024     Updated         Catch log added.
 */
public with sharing class BI_PSP_AssessmentTriggerHandler {

    /**
     * @description Handles before insert trigger events for Assessment object.
     *              Formats the EffectiveDateTime field and populates the custom field BI_PSP_DateForCQ__c with the formatted date.
     * @param newRecords List of new Assessment records.
     */
    public static void handleBeforeInsert(List<Assessment> newRecords) {
        try {
            formatEffectiveDateTime(newRecords);
            // Loop through the records in the trigger
            for (Assessment record : newRecords) {
                // Check if the Status__c field is changed to 'Complete' or AssessmentStatus is 'Completed' and Priority__c is not 'High'
                if ((record.BI_PSP_StatusForPersonalization__c == BI_PSP_QuestionnaireConstant.complete || 
                     record.AssessmentStatus == BI_PSP_QuestionnaireConstant.completed) && 
                    record.AssessmentRating != BI_PSP_QuestionnaireConstant.priorityHigh) {
                    // Set Priority__c to 'High'
                    record.AssessmentRating = BI_PSP_QuestionnaireConstant.priorityHigh;
                }
            }
        } catch (Exception ex) {
            BI_PSP_LogMessagesUtility.exceptionLogMessage('', BI_PSP_AssessmentTriggerHandler.class.toString(), ex);
        }
    }

    /**
     * @description Formats the EffectiveDateTime field of Assessment records and populates the custom field BI_PSP_DateForCQ__c with the formatted date.
     * @param records List of Assessment records.
     */
    private static void formatEffectiveDateTime(List<Assessment> records) {
        try {
            for (Assessment record : records) {
                if (record.EffectiveDateTime != null) {
                    // Format month name
                    String monthName = record.EffectiveDateTime.format('MMMM yyyy');
                    String formattedDate = monthName;

                    record.BI_PSP_DateForCQ__c = formattedDate;
                } else {
                    BI_PSP_LogMessagesUtility.logError(BI_PSP_QuestionnaireConstant.emptyAssessmentDate, BI_PSP_AssessmentTriggerHandler.class.toString(), false, BI_PSP_QuestionnaireConstant.LOG_SEVERITY_INFO);
                    NullPointerException e = new NullPointerException();
                    throw e;
                }
            }
        } catch (Exception ex) {
           BI_PSP_LogMessagesUtility.exceptionLogMessage('', BI_PSP_AssessmentTriggerHandler.class.toString(), ex);
        }
    }
}