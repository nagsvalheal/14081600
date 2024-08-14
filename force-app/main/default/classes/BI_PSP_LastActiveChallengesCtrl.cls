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
public without sharing class BI_PSP_LastActiveChallengesCtrl {
 /**
 * @description Retrieves the last active challenges associated with the given enrollee ID.
 * This method returns a `HealthCloudGA__CarePlanTemplate__c` object that represents the most recent care plan template
 * for the specified enrollee, based on their last active award. If no active challenges or care plans are found, it returns `null`.
 * 
 * This method is AuraEnabled and cacheable, allowing it to be used in Lightning components with server-side caching.
 * 
 * @param enrolleId The ID of the enrollee whose last active challenges are to be retrieved.
 * @return The `HealthCloudGA__CarePlanTemplate__c` object representing the last active care plan template, or `null` if not found.
 * 
 * @throws AuraHandledException if there is an issue retrieving the care program plan template.
 */


@AuraEnabled(cacheable=true)
    public static HealthCloudGA__CarePlanTemplate__c getLastActiveChallenges(String enrolleId) {
        HealthCloudGA__CarePlanTemplate__c retrievedCarePlanTemplate = new HealthCloudGA__CarePlanTemplate__c();
        try {
            if (String.isBlank(enrolleId)) {
               BI_PSP_LogMessagesUtility.logError( BI_PSP_ChallengeConstantCtrl.challengesErrorMessage, BI_PSP_LastActiveChallengesCtrl.class.toString(),TRUE, BI_PSP_ChallengeConstantCtrl.LOG_SEVERITY_ERROR);
            }

            Id awardRecordType = getAwardRecordTypeId();
            Award lastActiveAward = getLastActiveAward(enrolleId, awardRecordType);

            if (lastActiveAward == null) {
                return null;
            }

            HealthCloudGA__CareProgramPlanTemplate__c careProgramPlanTemplate = getCareProgramPlanTemplate(lastActiveAward.BI_PSP_Care_Program_Plan_Template__c);

            if (careProgramPlanTemplate == null) {
               BI_PSP_LogMessagesUtility.logError( BI_PSP_ChallengeConstantCtrl.challengesErrorMessage, BI_PSP_LastActiveChallengesCtrl.class.toString(),TRUE, BI_PSP_ChallengeConstantCtrl.LOG_SEVERITY_ERROR);
            }

            retrievedCarePlanTemplate = getCarePlanTemplate(careProgramPlanTemplate.HealthCloudGA__CarePlanTemplate__r.Id);



        } catch (Exception ex) {
            BI_PSP_LogMessagesUtility.exceptionLogMessage(
                ex.getMessage(),
                BI_PSP_LastActiveChallengesCtrl.class.toString(),
                ex
            );
        }
        return retrievedCarePlanTemplate;
    }
/*
    @description Method to retrieve the RecordTypeId for the Award object.
    @return Id of the Award RecordType.
    */
    private static Id getAwardRecordTypeId() {
   
        return  BI_PSP_CommonQueryUtility.retrieveRecordTypeId('Award','BI_PSP_Challenge');
    
    }
/*
    @description Method to retrieve the last active Award record for a given enrollee.
    @param enrolleId The ID of the enrollee for whom to retrieve the last active Award.
    @param awardRecordType The RecordTypeId of the Award object.
    @return Award The last active Award record.
    */
    private static Award getLastActiveAward(String enrolleId, Id awardRecordType) {
        String sObjectType = 'Award';
        String fields = 'Id, BI_PSP_Care_Program_Plan_Template__c, BI_PSP_Care_Program_Enrollee__c';
        String conditions = 'RecordTypeId = \'' + awardRecordType + '\' AND BI_PSP_Care_Program_Enrollee__c = \'' + enrolleId + '\' AND BI_PSP_Status__c = \'' + BI_PSP_ChallengeConstantCtrl.challengeActive + '\'';
        Boolean withSharingKeywrd = false;

        List<SObject> results = BI_PSP_CommonQueryUtility.executeQuery(sObjectType, fields, conditions, withSharingKeywrd);

        if (results.isEmpty()) {
            return null;
        }

        // Type casting
        return (Award) results[0];
    }
/*
    @description Method to retrieve the CareProgramPlanTemplate record based on the provided careProgramPlanTemplateId.
    @param careProgramPlanTemplateId The Id of the CareProgramPlanTemplate record.
    @return HealthCloudGA__CareProgramPlanTemplate__c record.
    */
    private static HealthCloudGA__CareProgramPlanTemplate__c getCareProgramPlanTemplate(Id careProgramPlanTemplateId) {
        String sObjectType = 'HealthCloudGA__CareProgramPlanTemplate__c';
        String fields = 'Id, HealthCloudGA__CareProgram__c, HealthCloudGA__CarePlanTemplate__r.Id';
        String conditions = 'Id = \'' + careProgramPlanTemplateId + '\'';
        Boolean withSharingKeywrd = false;

        List<SObject> results = BI_PSP_CommonQueryUtility.executeQuery(sObjectType, fields, conditions, withSharingKeywrd);

        if (results.isEmpty()) {
            return null;
        }

        // Type casting
        return (HealthCloudGA__CareProgramPlanTemplate__c) results[0];
    }
/*
    @description Method to retrieve the CarePlanTemplate record based on the provided carePlanTemplateId.
    @param carePlanTemplateId The Id of the CarePlanTemplate record.
    @return HealthCloudGA__CarePlanTemplate__c record.
    */
    private static HealthCloudGA__CarePlanTemplate__c getCarePlanTemplate(Id carePlanTemplateId) {
        String sObjectType = 'HealthCloudGA__CarePlanTemplate__c';
        String fields = 'Id, BI_PSP_Challenge_Reward_Points__c, Name, HealthCloudGA__Description__c, BI_PSP_Challenge_Level__c, BI_PSP_Challenge_Image__c';
        String conditions = 'Id = \'' + carePlanTemplateId + '\' AND Name != NULL';
        Boolean withSharingKeywrd = false;

        List<SObject> results = BI_PSP_CommonQueryUtility.executeQuery(sObjectType, fields, conditions, withSharingKeywrd);

        if (results.isEmpty()) {
            return null;
        }

        // Type casting
        return (HealthCloudGA__CarePlanTemplate__c) results[0];
    }
 



}