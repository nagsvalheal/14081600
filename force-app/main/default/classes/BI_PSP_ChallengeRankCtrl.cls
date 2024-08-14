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
public without sharing class BI_PSP_ChallengeRankCtrl {
    
/**
    @description Method to retrieve the rank of a care program enrollee based on their ID.
    This method returns a list of care program enrollees with their corresponding ranks.
    @param personAccountId The ID of the care program enrollee.
    @return List of care program enrollees with their ranks if found, otherwise null.
    */

 @AuraEnabled(cacheable=true)
    public static List<CareProgramEnrollee> getRank(String personAccountId) {
        List<CareProgramEnrollee> patientEnrolle = new List<CareProgramEnrollee>();
        try {
            if (String.isBlank(personAccountId)) {
                BI_PSP_LogMessagesUtility.logError( BI_PSP_ChallengeConstantCtrl.challengesErrorMessage, BI_PSP_ChallengeRankCtrl.class.toString(),true, BI_PSP_ChallengeConstantCtrl.LOG_SEVERITY_ERROR);
            }

            patientEnrolle = getPatientEnrolle(personAccountId);

            if (patientEnrolle.isEmpty()) {
                BI_PSP_LogMessagesUtility.logError( BI_PSP_ChallengeConstantCtrl.challengesErrorMessage, BI_PSP_ChallengeRankCtrl.class.toString(),true, BI_PSP_ChallengeConstantCtrl.LOG_SEVERITY_ERROR);
            }
        }catch (Exception ex) {
            BI_PSP_LogMessagesUtility.exceptionLogMessage(
                ex.getMessage(),
                BI_PSP_RandomChallengesCtrl.class.toString(),
                ex
            );
        }
        return patientEnrolle;
    }
/**
    @description Private method to retrieve patient enrollee records based on the provided person account ID.
    @param personAccountId The ID of the person account to retrieve enrollee records for.
    @return List of CareProgramEnrollee records if found, otherwise an empty list.
    */
    private static List<CareProgramEnrollee> getPatientEnrolle(String personAccountId) {
        String sObjectType = 'CareProgramEnrollee';
        String fields = 'Id, BI_PSP_Total_Reward_Points__c, BI_PSP_DOC_Novice__c, BI_PSP_DOC_Intermediate__c, BI_PSP_DOC_Proficient__c, BI_PSP_DOC_Expert__c, BI_PSP_Challenge_Rank__c, BI_PSP_DOC_Beginner__c';
        String conditions = 'Id = \'' + personAccountId + '\'';
        Boolean withSharingKeywrd = false;
        
        List<SObject> results = BI_PSP_CommonQueryUtility.executeQuery(sObjectType, fields, conditions, withSharingKeywrd);
        List<CareProgramEnrollee> patientEnrolle = new List<CareProgramEnrollee>();
        
        // Ensure type casting
        for (SObject result : results) {
            if (result instanceof CareProgramEnrollee) {
                patientEnrolle.add((CareProgramEnrollee)result);
            } else {
                 BI_PSP_LogMessagesUtility.logError( BI_PSP_ChallengeConstantCtrl.challengesErrorMessage, BI_PSP_ChallengeRankCtrl.class.toString(),false, BI_PSP_ChallengeConstantCtrl.LOG_SEVERITY_ERROR);
            }
        }
        
        return patientEnrolle;
    }

   
}