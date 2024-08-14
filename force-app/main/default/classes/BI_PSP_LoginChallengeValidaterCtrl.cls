/**
 * @description Class used for validating login history and article likes associated with Care Plan Templates, 
 * and updating challenge-related values for Awards.
 * This class includes methods to validate login history based on care plan levels and article likes, updating the success 
 * message object accordingly. It also includes a utility method for padding strings.
 * The class is declared without sharing to ensure access to relevant data regardless of sharing rules, especially when
 * dealing with sensitive objects like Health Cloud's Care Program Enrollee.
 *
 * Reason for using without sharing:
 * We utilize Care Program Enrollee, which is a Health Cloud object; hence, we cannot utilize user mode here.
 *
 * History:
 * Version    Author      Date             Detail         Description
 * 1.0        Nandha    5-Dec-2023       Created        Initial development
 */

public class BI_PSP_LoginChallengeValidaterCtrl {
    /**
 * @description Validates login history for a user based on the specified care plan level and updates the success message accordingly.
 *
 * This method checks the login history against different levels defined in the care plan and updates the success message
 * object based on the number of logins required for each level. The challenge is considered complete if the login count
 * meets or exceeds the required threshold for the specified level.
 *
 * @param carePlan The CarePlanTemplate record that defines the care plan level and description.
 * @param userId The ID of the user whose login history is being validated.
 * @param challengetoUpdate The Award record representing the challenge to update.
 * @param successMessage The ChallengeWrapper object containing the success message to be updated.
 * @return BI_PSP_ChallengeCtrl.ChallengeWrapper The updated success message object with the status and percentage.
 */
    public static BI_PSP_ChallengeCtrl.ChallengeWrapper validateLoginHistoryByLevel(HealthCloudGA__CarePlanTemplate__c carePlan, String userId, Award challengetoUpdate, BI_PSP_ChallengeCtrl.ChallengeWrapper successMessage) {
    if (carePlan.HealthCloudGA__Description__c == BI_PSP_ChallengeConstantCtrl.iamRegularLevelOne && carePlan.BI_PSP_Challenge_Level__c == BI_PSP_ChallengeConstantCtrl.challengeLevelOne) {
        return validateLoginHistory(userId, challengetoUpdate, 4, successMessage);
    } else if (carePlan.HealthCloudGA__Description__c == BI_PSP_ChallengeConstantCtrl.iamRegularLevelTwo && carePlan.BI_PSP_Challenge_Level__c == BI_PSP_ChallengeConstantCtrl.challengeLevelTwo) {
        return validateLoginHistory(userId, challengetoUpdate, 8, successMessage);
    } else if (carePlan.HealthCloudGA__Description__c == BI_PSP_ChallengeConstantCtrl.iamRegularLevelThree && carePlan.BI_PSP_Challenge_Level__c == BI_PSP_ChallengeConstantCtrl.challengeLevelThree) {
        return validateLoginHistory(userId, challengetoUpdate, 15, successMessage);
    }
    return successMessage;
}
    


    /**
 * @description Validates the login history of a user for a specific month and updates the success message based on the required login count.
 *
 * This method retrieves the user's login history for the current month, counting unique successful login days, and updates
 * the success message object based on whether the login count meets or exceeds the required threshold.
 *
 * @param userId The ID of the user whose login history is being validated.
 * @param challengetoUpdate The Award record representing the challenge to update.
 * @param requiredCount The number of unique login days required to complete the challenge.
 * @param successMessage The ChallengeWrapper object containing the success message to be updated.
 * @return BI_PSP_ChallengeCtrl.ChallengeWrapper The updated success message object with the status and percentage.
 */

public static BI_PSP_ChallengeCtrl.ChallengeWrapper validateLoginHistory(String userId, Award challengetoUpdate, Integer requiredCount, BI_PSP_ChallengeCtrl.ChallengeWrapper successMessage) {
    // Define start and end date of the month
    Date startDateOfMonth = Date.today().toStartOfMonth();
    Date endDateOfMonth = startDateOfMonth.addMonths(1).addDays(-1);
    
    // Construct DateTime values for SOQL query
    DateTime startDateTime = DateTime.newInstance(startDateOfMonth, Time.newInstance(0, 0, 0, 0));
    DateTime endDateTime = DateTime.newInstance(endDateOfMonth, Time.newInstance(23, 59, 59, 999));
    
    // Define the query parameters
    String sObjectType = 'LoginHistory';
    String fields = 'Id, UserId, LoginTime, Status, LoginType';
    String conditions = 'UserId = \'' + String.escapeSingleQuotes(userId) + '\' AND ' +
                        'LoginTime >= ' + startDateTime.format('yyyy-MM-dd\'T\'HH:mm:ss\'Z\'') + ' AND ' +
                        'LoginTime <= ' + endDateTime.format('yyyy-MM-dd\'T\'HH:mm:ss\'Z\'');
    Boolean withSharingKeyword = true;

    // Execute the query using the common query utility
    List<SObject> resultList = BI_PSP_CommonQueryUtility.executeQuery(sObjectType, fields, conditions, withSharingKeyword);

    // Process the results
    Set<Integer> uniqueDates = new Set<Integer>();
    for (SObject record : resultList) {
        LoginHistory logHistory = (LoginHistory) record;
        if (logHistory.Status == BI_PSP_ChallengeConstantCtrl.loginSuccess) {
            uniqueDates.add(logHistory.LoginTime.dayGMT());
        }
    }

    Integer uniqueDateCount = uniqueDates.size();
    if (uniqueDateCount >= requiredCount) {
        successMessage.challengeUpdated = challengetoUpdate;
        successMessage.percentage = 100;
    } else {
        successMessage.error = BI_PSP_ChallengeConstantCtrl.completeFourSt + uniqueDateCount + BI_PSP_ChallengeConstantCtrl.currentlyCompleted;
        successMessage.percentage = (Decimal) uniqueDateCount / requiredCount * 100;
    }

    return successMessage;
}
    
     /**
   * @description Validates article likes based on the level of the provided Care Plan Template.
   *
   * This method updates the provided challenge record based on the Care Plan Template's description and challenge level.
   * It increments the article like count according to the corresponding level rules and updates the success message accordingly.
   *
   * @param carePlan The Care Plan Template record that defines the level and description to validate against.
   * @param challengetoUpdate The Award record representing the challenge to update.
   * @param successMessage The ChallengeWrapper object containing the success message to be updated.
   * @return ChallengeWrapper The updated success message object.
   */
  public static BI_PSP_ChallengeCtrl.ChallengeWrapper validateArticleLikeByLevel(
    HealthCloudGA__CarePlanTemplate__c carePlan,
    Award challengetoUpdate,
    BI_PSP_ChallengeCtrl.ChallengeWrapper successMessage
  ) {
    if (
      carePlan.HealthCloudGA__Description__c ==
      BI_PSP_ChallengeConstantCtrl.gppExpertLevelOne &&
      carePlan.BI_PSP_Challenge_Level__c ==
      BI_PSP_ChallengeConstantCtrl.challengeLevelOne
    ) {
      return validateArticleLike(challengetoUpdate, 2, successMessage);
    } else if (
      carePlan.HealthCloudGA__Description__c ==
      BI_PSP_ChallengeConstantCtrl.gppExpertLevelTwo &&
      carePlan.BI_PSP_Challenge_Level__c ==
      BI_PSP_ChallengeConstantCtrl.challengeLevelTwo
    ) {
      return validateArticleLike(challengetoUpdate, 5, successMessage);
    } else if (
      carePlan.HealthCloudGA__Description__c ==
      BI_PSP_ChallengeConstantCtrl.gppExpertLevelThree &&
      carePlan.BI_PSP_Challenge_Level__c ==
      BI_PSP_ChallengeConstantCtrl.challengeLevelThree
    ) {
      return validateArticleLike(challengetoUpdate, 10, successMessage);
    }
    return successMessage;
  }

      /**
   * @description Validates article likes for a given award and updates the success message accordingly.
   *
   * This method retrieves article like records based on the specified conditions and updates the success message object
   * with the completion status and percentage. If the number of likes meets or exceeds the required count, the challenge
   * is considered complete.
   *
   * @param challengetoUpdate The Award record representing the challenge to update.
   * @param requiredCount The minimum number of article likes required for the challenge to be considered complete.
   * @param successMessage The ChallengeWrapper object containing the success message to be updated.
   * @return ChallengeWrapper The updated success message object with the status and percentage.
   */
  public static BI_PSP_ChallengeCtrl.ChallengeWrapper validateArticleLike(
    Award challengetoUpdate,
    Integer requiredCount,
    BI_PSP_ChallengeCtrl.ChallengeWrapper successMessage
  ) {
    // Define the query parameters
    String sObjectType = 'BI_PSPB_Article_like__c';
    String fields = 'BI_PSPB_CareProgramEnrollee__c, BI_PSPB_Reaction__c';
    String conditions =
      'BI_PSPB_CareProgramEnrollee__c = \'' +
      challengetoUpdate.BI_PSP_Care_Program_Enrollee__r.Id +
      '\' AND BI_PSPB_Reaction__c = \'' +
      BI_PSP_ChallengeConstantCtrl.view +
      '\'';
    Boolean withSharingKeyword = false; // or false, based on your requirement

    // Execute the query using the utility class
    List<SObject> resultList = BI_PSP_CommonQueryUtility.executeQuery(
      sObjectType,
      fields,
      conditions,
      withSharingKeyword
    );

    // Type-cast the result to List<BI_PSPB_Article_like__c>
    List<BI_PSPB_Article_like__c> articleLikeRecords = (List<BI_PSPB_Article_like__c>) resultList;

    // Update successMessage based on the count of article likes
    if (articleLikeRecords.size() >= requiredCount) {
      successMessage.challengeUpdated = challengetoUpdate;
      successMessage.percentage = 100;
    } else {
      successMessage.error =
        BI_PSP_ChallengeConstantCtrl.completeFourSt +
        articleLikeRecords.size() +
        BI_PSP_ChallengeConstantCtrl.currentlyCompleted;
      successMessage.percentage =
        (Decimal) articleLikeRecords.size() /
        requiredCount *
        100;
    }

    // Return the updated successMessage
    return successMessage;
  }

}