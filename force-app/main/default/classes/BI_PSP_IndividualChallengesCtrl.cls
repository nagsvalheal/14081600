/**
@description Class used for retrieving care programm erolle with challenges associated 
and updating challenges related values.
Reason for using whithout sharing is we use Care Program Enrollee, 
which is a Health Cloud object;
hence, we cannot utilize user mode here.
History:
Version    Author      Date              Detail         Description
1.0        Nandha      25-7-2023        Created        Initial development 
 
*/
public without sharing class BI_PSP_IndividualChallengesCtrl {
/*
    @description Method to retrieve individual challenges based on the provided challengeId.
    Returns a list of HealthCloudGA__CarePlanTemplate__c objects representing individual challenges.
    This method is exposed to Aura-enabled components and is cacheable.
    @param challengeId The Id of the challenge for which to retrieve individual challenges.
    @return List of HealthCloudGA__CarePlanTemplate__c objects representing individual challenges.
    */


 @AuraEnabled(cacheable=true)
    public static List<HealthCloudGA__CarePlanTemplate__c> getIndividualChallenges(String challengeId) {
        List<HealthCloudGA__CarePlanTemplate__c> carePlanTemplateRecords = new List<HealthCloudGA__CarePlanTemplate__c>();
        try {
            if (String.isBlank(challengeId)) {
                BI_PSP_LogMessagesUtility.logError( BI_PSP_ChallengeConstantCtrl.challengesErrorMessage, BI_PSP_ChallengeCtrl.class.toString(),TRUE, BI_PSP_ChallengeConstantCtrl.LOG_SEVERITY_ERROR);
            }

            HealthCloudGA__CareProgramPlanTemplate__c careProgram = getCareProgramPlanTemplate(challengeId);
            Id carePlanTemplateRecordTypeId = getCarePlanTemplateRecordTypeId();

            carePlanTemplateRecords = getCarePlanTemplateRecords(
                careProgram.HealthCloudGA__CarePlanTemplate__r.Id,
                carePlanTemplateRecordTypeId
            );

            if (carePlanTemplateRecords.isEmpty()) {
                 BI_PSP_LogMessagesUtility.logError( BI_PSP_ChallengeConstantCtrl.challengesErrorMessage, BI_PSP_ChallengeCtrl.class.toString(),TRUE, BI_PSP_ChallengeConstantCtrl.LOG_SEVERITY_ERROR);
            }

        } catch (Exception ex) {
            BI_PSP_LogMessagesUtility.exceptionLogMessage(
                BI_PSP_ChallengeConstantCtrl.careProgramTemplateErrorMessage,
                BI_PSP_IndividualChallengesCtrl.class.toString(),
                ex
            );
        }
        return carePlanTemplateRecords;
    }
 /*
    @description Method to retrieve the CareProgramPlanTemplate record based on the provided challengeId.
    @param challengeId The Id of the challenge for which to retrieve the CareProgramPlanTemplate record.
    @return HealthCloudGA__CareProgramPlanTemplate__c record.
    */
    public static HealthCloudGA__CareProgramPlanTemplate__c getCareProgramPlanTemplate(String challengeId) {
        String sObjectType = 'HealthCloudGA__CareProgramPlanTemplate__c';
        String fields = 'Id, HealthCloudGA__CareProgram__c, HealthCloudGA__CarePlanTemplate__r.Id';
        String conditions = 'Id = \'' + challengeId + '\'';
        Boolean withSharingKeywrd = FALSE;

        List<SObject> results = BI_PSP_CommonQueryUtility.executeQuery(sObjectType, fields, conditions, withSharingKeywrd);
        if (results.isEmpty()) {
            return null;
        }
        return (HealthCloudGA__CareProgramPlanTemplate__c) results[0];
    }
/*
    @description Method to retrieve the RecordTypeId for the CarePlanTemplate.
    @return Id of the CarePlanTemplate RecordType.
    */
    public static Id getCarePlanTemplateRecordTypeId() {
       
         return  BI_PSP_CommonQueryUtility.retrieveRecordTypeId('HealthCloudGA__CarePlanTemplate__c','BI_PSP_Challenge');
    }

     /*
    @description Method to retrieve the CarePlanTemplate records based on the provided carePlanTemplateId and carePlanTemplateRecordTypeId.
    @param carePlanTemplateId The Id of the CarePlanTemplate.
    @param carePlanTemplateRecordTypeId The RecordTypeId of the CarePlanTemplate.
    @return List of HealthCloudGA__CarePlanTemplate__c records.
    */

    public static List<HealthCloudGA__CarePlanTemplate__c> getCarePlanTemplateRecords(Id carePlanTemplateId, Id carePlanTemplateRecordTypeId) {
        String sObjectType = 'HealthCloudGA__CarePlanTemplate__c';
        String fields = 'Id, BI_PSP_Challenge_Reward_Points__c, Name, HealthCloudGA__Description__c, BI_PSP_Challenge_Level__c, BI_PSP_Challenge_Image__c';
        String conditions = 'Id = \'' + carePlanTemplateId + '\' AND Name != NULL AND RecordTypeId = \'' + carePlanTemplateRecordTypeId + '\'';
        Boolean withSharingKeywrd = FALSE;

        List<SObject> results = BI_PSP_CommonQueryUtility.executeQuery(sObjectType, fields, conditions, withSharingKeywrd);
        return (List<HealthCloudGA__CarePlanTemplate__c>) results;
    }


}