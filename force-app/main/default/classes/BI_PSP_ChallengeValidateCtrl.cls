/**
 * @description Class used for validating challenges related to symptom tracking and assessments based on Care Plan Templates.
 * This class provides methods to validate symptom tracking entries and assessments against different levels of care plans. 
 * It updates the challenge status and percentage in the provided success message object based on whether the criteria are met.
 * The class includes methods for validating symptom trackers and assessments for specific levels, utilizing utility functions 
 * to execute queries and process results. It ensures that the challenge is completed based on the required count or successful 
 * assessments, and updates the success message accordingly.
 *
 * Reason for using without sharing:
 * We use this class to access and validate Health Cloud data, specifically Care Program Enrollee-related information, where 
 * sharing rules may restrict access if user mode was utilized.
 *
 * History:
 * Version    Author      Date             Detail         Description
 * 1.0        Gowsic N    10-Aug-2024       Created        Initial development with methods for validating symptom trackers and assessments.
 * 1.1        Saran S     15-Aug-2024       Updated        Enhanced validation methods and descriptions.
 */

public class BI_PSP_ChallengeValidateCtrl {
      /**
     * @description Validates symptom tracker entries based on the Care Plan Template's level and updates the success message.
     *
     * This method checks the symptom tracker entries for the current month against the required count based on the care plan level.
     * If the count meets or exceeds the required threshold, it updates the challenge status to complete.
     *
     * @param carePlan The CarePlanTemplate record that defines the level and description to validate against.
     * @param challengetoUpdate The Award record representing the challenge to update.
     * @param successMessage The ChallengeWrapper object containing the success message to be updated.
     * @return BI_PSP_ChallengeCtrl.ChallengeWrapper The updated success message object with the status and percentage.
     */
    public static BI_PSP_ChallengeCtrl.ChallengeWrapper validateSymptomTrackerByLevel(HealthCloudGA__CarePlanTemplate__c carePlan, Award challengetoUpdate, BI_PSP_ChallengeCtrl.ChallengeWrapper successMessage) {
    if (carePlan.HealthCloudGA__Description__c == BI_PSP_ChallengeConstantCtrl.SymptomOne && carePlan.BI_PSP_Challenge_Level__c == BI_PSP_ChallengeConstantCtrl.challengeLevelOne) {
        return validateSymptomTracker(challengetoUpdate, successMessage, 1, BI_PSP_ChallengeConstantCtrl.completeOneSt);
    } else if (carePlan.HealthCloudGA__Description__c == BI_PSP_ChallengeConstantCtrl.SymptomTwo && carePlan.BI_PSP_Challenge_Level__c == BI_PSP_ChallengeConstantCtrl.challengeLevelTwo) {
        return validateSymptomTracker(challengetoUpdate, successMessage, 4, BI_PSP_ChallengeConstantCtrl.completeFourSt);
    } else if (carePlan.HealthCloudGA__Description__c == BI_PSP_ChallengeConstantCtrl.SymptomThree  && carePlan.BI_PSP_Challenge_Level__c == BI_PSP_ChallengeConstantCtrl.challengeLevelThree) {
        successMessage.challengeUpdated = challengetoUpdate;
        successMessage.percentage = 100;
    }
    return successMessage;
}

      /**
     * @description Validates the number of symptom tracker entries for a specific Care Program Enrollee and updates the success message.
     *
     * This method retrieves symptom tracker records for the current month and checks if the count meets or exceeds the required threshold.
     * It updates the challenge status and percentage in the success message object based on the validation result.
     *
     * @param challengetoUpdate The Award record representing the challenge to update.
     * @param successMessage The ChallengeWrapper object containing the success message to be updated.
     * @param requiredCount The number of symptom tracker entries required to complete the challenge.
     * @param errorMessage The error message to be displayed if the required count is not met.
     * @return BI_PSP_ChallengeCtrl.ChallengeWrapper The updated success message object with the status and percentage.
     */
    public static BI_PSP_ChallengeCtrl.ChallengeWrapper validateSymptomTracker(Award challengetoUpdate, BI_PSP_ChallengeCtrl.ChallengeWrapper successMessage, Integer requiredCount, String errorMessage) {
    // Define the query parameters
    String sObjectType = 'BI_PSP_Symptom_Tracker__c';
    String fields = 'Id, BI_PSP_Care_Program_Enrollee__c';
    String conditions = 'BI_PSP_Care_Program_Enrollee__c = \'' + challengetoUpdate.BI_PSP_Care_Program_Enrollee__r.Id + '\' AND BI_PSP_EditEntrydates__c = THIS_MONTH';
    Boolean withSharingKeyword = FALSE; // or false, based on your requirement

    // Execute the query using the utility class
    List<SObject> resultList = BI_PSP_CommonQueryUtility.executeQuery(sObjectType, fields, conditions, withSharingKeyword);

    // Type-cast the result to List<BI_PSP_Symptom_Tracker__c>
    List<BI_PSP_Symptom_Tracker__c> validateSymptom = (List<BI_PSP_Symptom_Tracker__c>)resultList;

    // Update successMessage based on the validation result
    if (validateSymptom.size() >= requiredCount) {
        successMessage.challengeUpdated = challengetoUpdate;
        successMessage.percentage = 100;
    } else {
        successMessage.error = errorMessage;
        successMessage.percentage = (Decimal) validateSymptom.size() / requiredCount * 100;
    }

    // Return the updated successMessage
    return successMessage;
}
      /**
     * @description Validates assessments based on the Care Plan Template's level and updates the success message.
     *
     * This method checks if the assessments in the provided list meet the required criteria for the given care plan level and 
     * updates the challenge status and percentage in the success message object.
     *
     * @param carePlan The CarePlanTemplate record that defines the level and description to validate against.
     * @param assesList The list of Assessment records to validate.
     * @param challengetoUpdate The Award record representing the challenge to update.
     * @param successMessage The ChallengeWrapper object containing the success message to be updated.
     * @return BI_PSP_ChallengeCtrl.ChallengeWrapper The updated success message object with the status and percentage.
     */
    public static BI_PSP_ChallengeCtrl.ChallengeWrapper validateAssessmentByLevel(HealthCloudGA__CarePlanTemplate__c carePlan, List<Assessment> assesList, Award challengetoUpdate, BI_PSP_ChallengeCtrl.ChallengeWrapper successMessage) {
    if (carePlan.HealthCloudGA__Description__c == BI_PSP_ChallengeConstantCtrl.QuestionnaireLevelOne && carePlan.BI_PSP_Challenge_Level__c == BI_PSP_ChallengeConstantCtrl.challengeLevelOne) {
        return validateAssessment(assesList, challengetoUpdate, BI_PSP_ChallengeConstantCtrl.assessmentWpai, successMessage, BI_PSP_ChallengeConstantCtrl.completeWpai);
    } else if (carePlan.HealthCloudGA__Description__c == BI_PSP_ChallengeConstantCtrl.QuestionnaireLevelTwo && carePlan.BI_PSP_Challenge_Level__c == BI_PSP_ChallengeConstantCtrl.challengeLevelTwo) {
        return validateAssessment(assesList, challengetoUpdate, BI_PSP_ChallengeConstantCtrl.assessmentPss, successMessage, BI_PSP_ChallengeConstantCtrl.completePss);
    } else if (carePlan.HealthCloudGA__Description__c == BI_PSP_ChallengeConstantCtrl.QuestionnaireLevelThree && carePlan.BI_PSP_Challenge_Level__c == BI_PSP_ChallengeConstantCtrl.challengeLevelThree) {
        return validateAssessment(assesList, challengetoUpdate, BI_PSP_ChallengeConstantCtrl.assessmentDlqi, successMessage, BI_PSP_ChallengeConstantCtrl.completeDlqi);
    }
    return successMessage;
}
    
    /**
     * @description Validates the presence of specific assessments in the provided list and updates the success message.
     *
     * This method checks if the assessments in the list match the specified name and status, and updates the challenge status
     * and percentage in the success message object based on whether the assessment is found.
     *
     * @param assesList The list of Assessment records to validate.
     * @param challengetoUpdate The Award record representing the challenge to update.
     * @param assessmentName The name of the assessment to check for.
     * @param successMessage The ChallengeWrapper object containing the success message to be updated.
     * @param errorMessage The error message to be displayed if the assessment is not found.
     * @return BI_PSP_ChallengeCtrl.ChallengeWrapper The updated success message object with the status and percentage.
     */
public static BI_PSP_ChallengeCtrl.ChallengeWrapper validateAssessment(List<Assessment> assesList,Award challengetoUpdate, String assessmentName, BI_PSP_ChallengeCtrl.ChallengeWrapper successMessage, String errorMessage) {
    Boolean validOne = false;
    for (Assessment asseloop : assesList) {
        if (asseloop.Name.contains(assessmentName) && asseloop.AssessmentStatus == BI_PSP_ChallengeConstantCtrl.assessmentStatusCompleted && asseloop.BI_PSP_DateForCQ__c != null) {
            validOne = true;
            break;
        }
    }
    if (validOne) {
       successMessage.challengeUpdated = challengetoUpdate;
        successMessage.percentage = 100;
    } else {
        successMessage.error = errorMessage;
        successMessage.percentage = 0;
    }
    return successMessage;
}
    
}