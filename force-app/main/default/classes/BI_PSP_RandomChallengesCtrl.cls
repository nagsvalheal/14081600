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
public without sharing class BI_PSP_RandomChallengesCtrl {
/**
 * @description Retrieves a list of random challenges associated with the given person account ID and status.
 * This method returns a list of `ChallengeWrapperCommon` objects, each representing a challenge related to the enrollee.
 * The method is cacheable and can be used in Lightning components for efficient data retrieval.
 * 
 * @param personAccountId The ID of the person account for which to retrieve challenges.
 * @param status The status of the challenges to filter by.
 * @return A list of `ChallengeWrapperCommon` objects containing challenge information. Returns an empty list if no challenges are found or if inputs are invalid.
 */

 @AuraEnabled(cacheable=true)
    public static List<ChallengeWrapperCommon> getRandomChallenges(String personAccountId, String status) {
        List<ChallengeWrapperCommon> successList = new List<ChallengeWrapperCommon>();
        try {
            if (String.isBlank(personAccountId) || String.isBlank(status)) {
                return successList;
            }

             Id awardRecordTypeId = BI_PSP_CommonQueryUtility.retrieveRecordTypeId('Award','BI_PSP_Challenge');

            CareProgramEnrollee patientEnrollee = getCareProgramEnrollee(personAccountId);
            if (patientEnrollee == null) {
                //return successList;
                BI_PSP_LogMessagesUtility.logError( BI_PSP_ChallengeConstantCtrl.challengesErrorMessage, BI_PSP_RandomChallengesCtrl.class.toString(),true, BI_PSP_ChallengeConstantCtrl.LOG_SEVERITY_ERROR);
            }

            List<Award> challengeList = getChallengeList(patientEnrollee.Id, awardRecordTypeId);
            if (challengeList.isEmpty()) {
                return successList;
            }

            for (Award getAllChallenge : challengeList) {
                addChallengeToSuccessList(successList, getAllChallenge, patientEnrollee, status);
            }

        } catch (Exception ex) {
            BI_PSP_LogMessagesUtility.exceptionLogMessage(
                BI_PSP_ChallengeConstantCtrl.enrolleeNf,
                BI_PSP_RandomChallengesCtrl.class.toString(),
                ex
            );
        }
        return successList;
    }
 /*
    @description Method to retrieve the CareProgramEnrollee record based on the provided person account ID.
    @param personAccountId The ID of the care program enrollee.
    @return CareProgramEnrollee record if found, otherwise null.
    */
    private static CareProgramEnrollee getCareProgramEnrollee(String personAccountId) {
        String sObjectType = 'CareProgramEnrollee';
        String fields = 'Id, AccountId, BI_PSP_Challenge_Rank__c';
        String conditions = 'Id = \'' + personAccountId + '\'';
        Boolean withSharingKeywrd = false;

        List<SObject> results = BI_PSP_CommonQueryUtility.executeQuery(sObjectType, fields, conditions, withSharingKeywrd);
        if (results.isEmpty()) {
            return null;
        }

        // Type casting
        return (CareProgramEnrollee)results[0];
    }
 /*
    @description Method to retrieve the list of Award records for a given enrollee ID and award record type ID.
    @param enrolleeId The ID of the enrollee.
    @param awardRecordTypeId The RecordTypeId of the Award object.
    @return List of Award records.
    */
    public static List<Award> getChallengeList(Id enrolleeId, Id awardRecordTypeId) {
        String sObjectType = 'Award';
        String fields = 'Id, BI_PSP_Care_Program_Plan_Template__r.Id, BI_PSP_Status__c, BI_PSP_Care_Program_Plan_Template__c';
        String conditions = 'RecordTypeId = \'' + awardRecordTypeId + '\' AND BI_PSP_Care_Program_Enrollee__c = \'' + enrolleeId + '\' ORDER BY LastModifiedDate DESC';
        Boolean withSharingKeywrd = false;

        List<SObject> results = BI_PSP_CommonQueryUtility.executeQuery(sObjectType, fields, conditions, withSharingKeywrd);
        
        // Type casting
        List<Award> challengeList = new List<Award>();
        for (SObject result : results) {
            challengeList.add((Award)result);
        }
        
        return challengeList;
    }
/*
    @description Method to add a challenge to the success list if it matches the given status.
    @param successList The list of ChallengeWrapperCommon objects to add to.
    @param getAllChallenge The Award record representing the challenge.
    @param patientEnrollee The CareProgramEnrollee record.
    @param status The status of the challenges to retrieve (e.g., Active, Completed).
    */
    public static void addChallengeToSuccessList(List<ChallengeWrapperCommon> successList, Award getAllChallenge, CareProgramEnrollee patientEnrollee, String status) {
        if (getAllChallenge.BI_PSP_Care_Program_Plan_Template__c == null || getAllChallenge.BI_PSP_Status__c != status) {
            return;
        }

        ChallengeWrapperCommon successMessage = new ChallengeWrapperCommon();
        successMessage.availableChallenge = getAllChallenge.BI_PSP_Care_Program_Plan_Template__r.Id;
        successMessage.challengeIdToUpdate = getAllChallenge.Id;

        if (getAllChallenge.BI_PSP_Status__c == BI_PSP_ChallengeConstantCtrl.assessmentStatusCompleted) {
            successMessage.imageRank = patientEnrollee.BI_PSP_Challenge_Rank__c;
        }

        successList.add(successMessage);
    }
    
   /**
 * @description A wrapper class that represents common properties for challenges.
 * It includes information about the available challenge, the challenge ID to update,
 * and the rank of the challenge image.
 */
    public class ChallengeWrapperCommon {
// Represents the available challenge Id
@AuraEnabled
public String availableChallenge;

// Represents the challenge Id to update
@AuraEnabled
public String challengeIdToUpdate;

// Represents the rank of the challenge image
@AuraEnabled
public String imageRank;
}

}