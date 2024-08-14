/**
@description Class used for retrieving care programm erolle with challenges associated 
and updating challenges related values.
Reason for using whithout sharing is we use Care Program Enrollee, 
which is a Health Cloud object;
hence, we cannot utilize user mode here.
History:
Version    Author      Date              Detail         Description
1.0        Gowsic N    5-Dec-2023        Created        Initial development
1.1        Saran S     20-Apr-2024       Updated        Add log, null check, descriptions
1.2        Nandha     	08-Aug-2024       Updated         
*/
public without sharing class BI_PSP_ChallengeCtrl {
  /**
   * @description Updates challenges based on provided parameters.
   * @param challenge The ID of the challenge to be updated.
   * @param activeAvailable The status of the challenge (active, available, or completed).
   * @param userId The ID of the user performing the update.
   * @return List of ChallengeWrapper objects containing the update status and any error messages.
   * @throws AuraHandledException If any validation fails or an error occurs during execution.
   */

  @AuraEnabled
  public static list<ChallengeWrapper> updateChallenges(
    String challenge,
    String activeAvailable,
    String userId
  ) {
    try {
      validateInputs(challenge, activeAvailable);

      Award challengetoUpdate = getAward(challenge);
      challengetoUpdate.BI_PSP_Status__c = getChallengeStatus(activeAvailable);
      list<HealthCloudGA__CareProgramPlanTemplate__c> careProgramValues = getCareProgram(
        challengetoUpdate.BI_PSP_Care_Program_Plan_Template__r.Id
      );
    
      HealthCloudGA__CarePlanTemplate__c carePlan = getTrackingChallenge(
        careProgramValues[0].HealthCloudGA__CarePlanTemplate__r.Id,
        challengetoUpdate
      );

      List<Assessment> assesList = getAssessments(
        challengetoUpdate.BI_PSP_Care_Program_Enrollee__r.Id
      );
      ChallengeWrapper successMessage = validateChallenge(
        activeAvailable,
        carePlan,
        assesList,
        userId,
        challengetoUpdate
      );

      if (successMessage != null && successMessage.error == null) {
        saveAward(challengetoUpdate);
      }

      List<ChallengeWrapper> successList = new List<ChallengeWrapper>{
        successMessage
      };
      return successList;
    }      catch (Exception ex) {
      BI_PSP_LogMessagesUtility.exceptionLogMessage(
        ex.getMessage(),
        BI_PSP_ChallengeCtrl.class.toString(),
        ex
      );
      // Handle the exception and return an appropriate error list
      return handleException(ex);
    }
  }
  /**
   * @description Validates the input parameters.
   * @param challenge The challenge parameter to be validated.
   * @param activeAvailable The activeAvailable parameter to be validated.
   * @throws AuraHandledException If any parameter is blank.
   */
  public static void validateInputs(String challenge, String activeAvailable) {
    if (String.isBlank(challenge) || String.isBlank(activeAvailable)) {
      BI_PSP_LogMessagesUtility.logError(
        BI_PSP_ChallengeConstantCtrl.challengesErrorMessage,
        BI_PSP_ChallengeCtrl.class.toString(),
        TRUE,
        BI_PSP_ChallengeConstantCtrl.LOG_SEVERITY_ERROR
      );
    }
  }

  /**
   * @description Retrieves an Award record based on the given challenge ID.
   * @param challenge The ID of the challenge.
   * @return The Award record associated with the challenge ID.
   */
  private static Award getAward(String challenge) {
    // Define the SObject type and query parameters
    String sObjectType = 'Award';
    String fields = 'Id, BI_PSP_Care_Program_Enrollee__r.Id, BI_PSP_Care_Program_Enrollee__c, BI_PSP_Care_Program_Plan_Template__r.Id, BI_PSP_Status__c, BI_PSP_Care_Program_Plan_Template__c';
    String conditions = 'Id = \'' + challenge + '\'';
    Boolean withSharingKeyword = false; // or false, based on your requirement

    // Execute the query using the utility class
    List<SObject> resultList = BI_PSP_CommonQueryUtility.executeQuery(
      sObjectType,
      fields,
      conditions,
      withSharingKeyword
    );

    // Type-cast the first result to Award
    Award awardRecord = (Award) resultList[0];

    // Return the Award record
    return awardRecord;
  }

  /**
   * @description Retrieves the challenge status based on the activeAvailable parameter.
   * @param activeAvailable The activeAvailable parameter to determine the status.
   * @return The challenge status.
   * @throws AuraHandledException If the activeAvailable parameter does not match any known status.
   */

  public static String getChallengeStatus(String activeAvailable) {
    if (activeAvailable == BI_PSP_ChallengeConstantCtrl.challengeActive) {
      return BI_PSP_ChallengeConstantCtrl.challengeActive;
    } else if (
      activeAvailable == BI_PSP_ChallengeConstantCtrl.challengeAvailable
    ) {
      return BI_PSP_ChallengeConstantCtrl.challengeAvailable;
    } else if (
      activeAvailable == BI_PSP_ChallengeConstantCtrl.challengeCompleted
    ) {
      return BI_PSP_ChallengeConstantCtrl.challengeCompleted;
    } else {
      
 	// BI_PSP_LogMessagesUtility.logError( BI_PSP_ChallengeConstantCtrl.challengesErrorMessage, BI_PSP_ChallengeCtrl.class.toString(),TRUE, BI_PSP_ChallengeConstantCtrl.LOG_SEVERITY_ERROR);
    BI_PSP_LogMessagesUtility.logError(
        BI_PSP_ChallengeConstantCtrl.challengesErrorMessage,
        BI_PSP_ChallengeCtrl.class.toString(),
        TRUE,
        BI_PSP_ChallengeConstantCtrl.LOG_SEVERITY_ERROR
      );
        // Return a default or error status
        return BI_PSP_ChallengeConstantCtrl.challengesErrorMessage;
    }
  }

  /**
   * @description Retrieves CareProgramPlanTemplate records based on the given plan template ID.
   * @param planTemplateId The ID of the plan template.
   * @return List of CareProgramPlanTemplate records.
   * @throws AuraHandledException If no records are found.
   */

  private static List<HealthCloudGA__CareProgramPlanTemplate__c> getCareProgram(
    String planTemplateId
  ) {
    // Define the query parameters
    String sObjectType = 'HealthCloudGA__CareProgramPlanTemplate__c';
    String fields = 'Id, Name, HealthCloudGA__CarePlanTemplate__r.Id';
    String conditions = 'Id = \'' + planTemplateId + '\'';
    Boolean withSharingKeyword = false; // or false, based on your requirement

    // Execute the query using the utility class
    List<SObject> resultList = BI_PSP_CommonQueryUtility.executeQuery(
      sObjectType,
      fields,
      conditions,
      withSharingKeyword
    );

    // Type-cast the result to List<HealthCloudGA__CareProgramPlanTemplate__c>
    List<HealthCloudGA__CareProgramPlanTemplate__c> careProgramList = (List<HealthCloudGA__CareProgramPlanTemplate__c>) resultList;

    // Handle the case where no records are found
    if (careProgramList.isEmpty()) {
    
      BI_PSP_LogMessagesUtility.logError( BI_PSP_ChallengeConstantCtrl.challengesErrorMessage, BI_PSP_ChallengeCtrl.class.toString(),false, BI_PSP_ChallengeConstantCtrl.LOG_SEVERITY_ERROR);
    }

    // Return the list of Care Program Plan Templates
    return careProgramList;
  }

  /**
   * @description Retrieves a CarePlanTemplate record based on the given care plan template ID.
   * @param carePlanTemplateId The ID of the care plan template.
   * @param challangersId The ID of the challenger.
   * @return The CarePlanTemplate record or a new CarePlanTemplate object if no valid care plan is found.
   */

  private static HealthCloudGA__CarePlanTemplate__c getTrackingChallenge(
    String carePlanTemplateId,
    Award challangersId
  ) {
    // Define the query parameters
    String sObjectType = 'HealthCloudGA__CarePlanTemplate__c';
    String fields = 'Id, Name, BI_PSP_Challenge_Level__c, HealthCloudGA__Description__c';

    // Construct the conditions string
    String conditions =
      'Id = \'' +
      String.escapeSingleQuotes(carePlanTemplateId) +
      '\' AND ' +
      'HealthCloudGA__Description__c IN (' +
      '\'' +
      String.escapeSingleQuotes(BI_PSP_ChallengeConstantCtrl.SymptomOne) +
      '\', ' +
      '\'' +
      String.escapeSingleQuotes(BI_PSP_ChallengeConstantCtrl.SymptomTwo) +
      '\', ' +
      '\'' +
      String.escapeSingleQuotes(BI_PSP_ChallengeConstantCtrl.QuestionnaireLevelOne) +
      '\', ' +
      '\'' +
      String.escapeSingleQuotes(BI_PSP_ChallengeConstantCtrl.QuestionnaireLevelTwo) +
      '\', ' +
      '\'' +
      String.escapeSingleQuotes(BI_PSP_ChallengeConstantCtrl.QuestionnaireLevelThree) +
      '\', ' +
      '\'' +
      String.escapeSingleQuotes(BI_PSP_ChallengeConstantCtrl.IamRegularLevelOne) +
      '\', ' +
      '\'' +
      String.escapeSingleQuotes(BI_PSP_ChallengeConstantCtrl.IamRegularLevelTwo) +
      '\', ' +
      '\'' +
      String.escapeSingleQuotes(BI_PSP_ChallengeConstantCtrl.IamRegularLevelThree) +
      '\', ' +
      '\'' +
      String.escapeSingleQuotes(BI_PSP_ChallengeConstantCtrl.GppExpertLevelOne) +
      '\', ' +
      '\'' +
      String.escapeSingleQuotes(BI_PSP_ChallengeConstantCtrl.GppExpertLevelTwo) +
      '\', ' +
      '\'' +
      String.escapeSingleQuotes(BI_PSP_ChallengeConstantCtrl.GppExpertLevelThree) +
      '\'' +
      ')';

    Boolean withSharingKeyword = false;

    // Execute the query using the common query utility
    List<SObject> resultList = BI_PSP_CommonQueryUtility.executeQuery(
      sObjectType,
      fields,
      conditions,
      withSharingKeyword
    );

    // Check if any results were returned
    if (!resultList.isEmpty()) {
      return (HealthCloudGA__CarePlanTemplate__c) resultList[0];
    } else {
      // Perform fallback operation if no matching care plan is found
      saveAward(challangersId);

      // Return a new HealthCloudGA__CarePlanTemplate__c object to indicate no valid care plan was found
      return new HealthCloudGA__CarePlanTemplate__c();
    }
  }
  /**
   * @description Retrieves Assessment records based on the given enrollee ID.
   * @param enrolleeId The ID of the enrollee.
   * @return List of Assessment records.
   */
  private static List<Assessment> getAssessments(String enrolleeId) {
    // Define the query parameters
    String sObjectType = 'Assessment';
    String fields = 'Id, Name, AssessmentStatus, BI_PSP_DateForCQ__c, BI_PSP_CareProgramEnrollee__c';
    String conditions =
      'BI_PSP_CareProgramEnrollee__c = \'' +
      enrolleeId +
      '\'';
    Boolean withSharingKeyword = false; // or false, based on your requirement

    // Execute the query using the utility class
    List<SObject> resultList = BI_PSP_CommonQueryUtility.executeQuery(
      sObjectType,
      fields,
      conditions,
      withSharingKeyword
    );

    // Type-cast the result to List<Assessment>
    List<Assessment> assessmentsList = (List<Assessment>) resultList;

    // Return the list of assessments
    return assessmentsList;
  }
  /**
   * @description Validates the challenge and returns a ChallengeWrapper object with the update status.
   * @param activeAvailable The status of the challenge (active, available, or completed).
   * @param carePlan The CarePlanTemplate record.
   * @param assesList The list of Assessment records.
   * @param userId The ID of the user performing the validation.
   * @param challengetoUpdate The Award record to be updated.
   * @return ChallengeWrapper object containing the update status and any error messages.
   */

  private static ChallengeWrapper validateChallenge(
    String activeAvailable,
    HealthCloudGA__CarePlanTemplate__c carePlan,
    List<Assessment> assesList,
    String userId,
    Award challengetoUpdate
  ) {
    ChallengeWrapper successMessage = new ChallengeWrapper();

    if (activeAvailable == BI_PSP_ChallengeConstantCtrl.challengeCompleted) {
      if (isSymptomLevel(carePlan)) {
        return BI_PSP_ChallengeValidateCtrl.validateSymptomTrackerByLevel(
          carePlan,
          challengetoUpdate,
          successMessage
        );
      } else if (isQuestionnaireLevel(carePlan)) {
        return BI_PSP_ChallengeValidateCtrl.validateAssessmentByLevel(
          carePlan,
          assesList,
          challengetoUpdate,
          successMessage
        );
      } else if (isRegularLevel(carePlan)) {
        return BI_PSP_LoginChallengeValidaterCtrl.validateLoginHistoryByLevel(
          carePlan,
          userId,
          challengetoUpdate,
          successMessage
        );
      } else if (isGppExpertLevel(carePlan)) {
        return BI_PSP_LoginChallengeValidaterCtrl.validateArticleLikeByLevel(
          carePlan,
          challengetoUpdate,
          successMessage
        );
      }
    } else {
      successMessage.challengeUpdated = challengetoUpdate;
      successMessage.percentage = 100;
    }

    return successMessage;
  }

  private static Boolean isSymptomLevel(
    HealthCloudGA__CarePlanTemplate__c carePlan
  ) {
    return carePlan.HealthCloudGA__Description__c ==
      BI_PSP_ChallengeConstantCtrl.SymptomOne ||
      carePlan.HealthCloudGA__Description__c ==
      BI_PSP_ChallengeConstantCtrl.SymptomTwo ||
      carePlan.HealthCloudGA__Description__c ==
      BI_PSP_ChallengeConstantCtrl.SymptomThree;
  }

  private static Boolean isQuestionnaireLevel(
    HealthCloudGA__CarePlanTemplate__c carePlan
  ) {
    return carePlan.HealthCloudGA__Description__c ==
      BI_PSP_ChallengeConstantCtrl.QuestionnaireLevelOne ||
      carePlan.HealthCloudGA__Description__c ==
      BI_PSP_ChallengeConstantCtrl.QuestionnaireLevelTwo ||
      carePlan.HealthCloudGA__Description__c ==
      BI_PSP_ChallengeConstantCtrl.QuestionnaireLevelThree;
  }

  /**
   * @description Determines if the provided Care Plan Template corresponds to a "Regular Level" challenge.
   *
   * This method checks if the description of the provided Care Plan Template matches any of the
   * predefined descriptions for Regular Level challenges.
   *
   * @param carePlan The Care Plan Template record to check for level classification.
   * @return Boolean True if the Care Plan Template corresponds to a Regular Level challenge, otherwise false.
   */

  public static Boolean isRegularLevel(
    HealthCloudGA__CarePlanTemplate__c carePlan
  ) {
    return carePlan.HealthCloudGA__Description__c ==
      BI_PSP_ChallengeConstantCtrl.iamRegularLevelOne ||
      carePlan.HealthCloudGA__Description__c ==
      BI_PSP_ChallengeConstantCtrl.iamRegularLevelTwo ||
      carePlan.HealthCloudGA__Description__c ==
      BI_PSP_ChallengeConstantCtrl.iamRegularLevelThree;
  }

  /**
   * @description Determines if the provided Care Plan Template corresponds to a "GPP Expert Level" challenge.
   *
   * This method checks if the description of the provided Care Plan Template matches any of the
   * predefined descriptions for GPP Expert Level challenges.
   *
   * @param carePlan The Care Plan Template record to check for level classification.
   * @return Boolean True if the Care Plan Template corresponds to a GPP Expert Level challenge, otherwise false.
   */

  public static Boolean isGppExpertLevel(
    HealthCloudGA__CarePlanTemplate__c carePlan
  ) {
    return carePlan.HealthCloudGA__Description__c ==
      BI_PSP_ChallengeConstantCtrl.gppExpertLevelOne ||
      carePlan.HealthCloudGA__Description__c ==
      BI_PSP_ChallengeConstantCtrl.gppExpertLevelTwo ||
      carePlan.HealthCloudGA__Description__c ==
      BI_PSP_ChallengeConstantCtrl.gppExpertLevelThree;
  }



  private static void saveAward(Award challengetoUpdate) {
    BI_PSP_DatabaseOperationsUtility.updateOperation(
      new List<Award>{ challengetoUpdate },
      BI_PSP_ChallengeCtrl.class.toString(),
      false
    );
  }
  /**
   * @description Returns an error list with a default error message.
   * @return List of ChallengeWrapper objects containing the error message.
   */
  private static List<ChallengeWrapper> throwErrorList() {
    
    BI_PSP_LogMessagesUtility.logError( BI_PSP_ChallengeConstantCtrl.challengesErrorMessage, BI_PSP_ChallengeCtrl.class.toString(),TRUE, BI_PSP_ChallengeConstantCtrl.LOG_SEVERITY_ERROR);   
  // Return an empty list or a list with an error wrapper
    return new List<BI_PSP_ChallengeCtrl.ChallengeWrapper>();
  }
  /**
   * @description Handles exceptions and returns a list of ChallengeWrapper objects containing the error message.
   * @param ex The exception to be handled.
   * @return List of ChallengeWrapper objects containing the error message.
   */
 private static List<ChallengeWrapper> handleException(Exception ex) {
    ChallengeWrapper errorMessage = new ChallengeWrapper();
    errorMessage.error = ex.getMessage();
    List<ChallengeWrapper> errorList = new List<ChallengeWrapper>{ errorMessage };
    BI_PSP_LogMessagesUtility.exceptionLogMessage(ex.getMessage(), BI_PSP_ChallengeCtrl.class.toString(), ex);
    return errorList;
  }

  /**
@description Wrapper class to hold information about a patient enrollee and any error messages.
*/
  public class EnrollWrapper {
    /* The patient enrollee information.*/
    @AuraEnabled
    public CareProgramEnrollee patientEnrolle;

    /** Any error message associated with the patient enrollee.*/
    @AuraEnabled
    public String error;
  }

  /** @description Wrapper class for Challenge details including the updated challenge, error message, and completion percentage.*/
  public class ChallengeWrapper {
    // AuraEnabled attributes to be exposed to the client side

    // The updated challenge
    @AuraEnabled
    public Award challengeUpdated;

    // Error message if an exception occurs
    @AuraEnabled
    public String error;

    // Completion percentage of the challenge
    @AuraEnabled
    public Decimal percentage;
  }
  /**
@description Wrapper class to represent common attributes of a challenge.
This class is used to structure data related to challenges in Aura-enabled components.
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