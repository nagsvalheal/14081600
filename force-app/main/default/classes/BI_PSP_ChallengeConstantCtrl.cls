/**
 * @description Class used for storing constants related to challenges and their associated messages.
 * 
 * History:
 * Version    Author      Date              Detail         Description
 * 1.0        Gowsic N    5-Dec-2023        Created        Initial development
 * 1.1        Saran S     20-Apr-2024       Updated        Add log, null check, descriptions
 * 1.2        Nandha      08-Aug-2024       Updated        Refactored and documented constants
 */
public with sharing class BI_PSP_ChallengeConstantCtrl {
    
 /**
     * @description Label representing Symptom One.
     */
    public static String SymptomOne = System.Label.BI_PSP_SymptomOne;

    /**
     * @description Label representing Symptom Two.
     */
    public static String SymptomTwo = System.Label.BI_PSP_SymptomTwo;

    /**
     * @description Label representing Questionnaire Level One.
     */
    public static String QuestionnaireLevelOne = System.Label.BI_PSP_QuestionnaireLevelOne;

    /**
     * @description Label representing Questionnaire Level Three.
     */
    public static String QuestionnaireLevelThree = System.Label.BI_PSP_QuestionnaireLevelThree;

    /**
     * @description Label representing Questionnaire Level Two.
     */
    public static String QuestionnaireLevelTwo = System.Label.BI_PSP_QuestionnaireLevelTwo;

    /**
     * @description Label representing "I am Regular" Level One.
     */
    public static String IamRegularLevelOne = System.Label.BI_PSP_IamRegularLevelOne;

    /**
     * @description Label representing "I am Regular" Level Two.
     */
    public static String IamRegularLevelTwo = System.Label.BI_PSP_IamRegularLevelTwo;

    /**
     * @description Label representing "I am Regular" Level Three.
     */
    public static String IamRegularLevelThree = System.Label.BI_PSP_IamRegularLevelThree;

    /**
     * @description Label representing GPP Expert Level One.
     */
    public static String GppExpertLevelOne = System.Label.BI_PSP_GppExpertLevelOne;

    /**
     * @description Label representing GPP Expert Level Two.
     */
    public static String GppExpertLevelTwo = System.Label.BI_PSP_GppExpertLevelTwo;

    /**
     * @description Label representing GPP Expert Level Three.
     */
    public static String GppExpertLevelThree = System.Label.BI_PSP_GppExpertLevelThree;

    /**
     * @description Label indicating that an enrollee cannot be found.
     */
    public static String enrolleeNf = System.Label.BI_PSP_EnrolleeCannotFound;

    /**
     * @description Label indicating that a caregiver cannot be found.
     */
    public static String caregiverNf = System.Label.BI_PSP_CaregiverCannotFound;

    /**
     * @description Label indicating that an enrollee was not found.
     */
    public static String enrolleeNfNs = System.Label.BI_PSP_EnrolleeNotFound;

    /**
     * @description Label representing the status of a challenge that is active.
     */
    public static String challengeActive = System.Label.BI_PSP_ChallengeActive;

    /**
     * @description Label representing the status of a challenge that is available.
     */
    public static String challengeAvailable = System.Label.BI_PSP_ChallengeAvailable;

    /**
     * @description Label representing the status of a challenge that is completed.
     */
    public static String challengeCompleted = System.Label.BI_PSPB_ChallengeCompleted;

    /**
     * @description Label representing Challenge Level One.
     */
    public static String challengeLevelOne = System.Label.BI_PSP_ChallengeLevelOne;

    /**
     * @description Label representing Challenge Level Two.
     */
    public static String challengeLevelTwo = System.Label.BI_PSP_ChallengeLevelTwo;

    /**
     * @description Label representing Challenge Level Three.
     */
    public static String challengeLevelThree = System.Label.BI_PSP_ChallengeLevelThree;

    /**
     * @description Label indicating completion of one stage.
     */
    public static String completeOneSt = System.Label.BI_PSP_CompleteOneSt;

    /**
     * @description Label indicating completion of four stages.
     */
    public static String completeFourSt = System.Label.BI_PSP_CompleteFourSt;

    /**
     * @description Label indicating a challenge is currently completed.
     */
    public static String currentlyCompleted = System.Label.BI_PSP_CurrentlyCompleted;

    /**
     * @description Label for the WPAI (Work Productivity and Activity Impairment) assessment.
     */
    public static String assessmentWpai = System.Label.BI_PSP_AssessmentWpai;

    /**
     * @description Label representing the completed status of an assessment.
     */
    public static String assessmentStatusCompleted = System.Label.BI_PSP_Completed;

    /**
     * @description Label indicating completion of the WPAI assessment.
     */
    public static String completeWpai = System.Label.BI_PSP_CompleteWpai;

    /**
     * @description Label for the PSS (Perceived Stress Scale) assessment.
     */
    public static String assessmentPss = System.Label.BI_PSP_AssessmentPss;

    /**
     * @description Label indicating completion of the PSS assessment.
     */
    public static String completePss = System.Label.BI_PSP_CompletePss;

    /**
     * @description Label for the DLQI (Dermatology Life Quality Index) assessment.
     */
    public static String assessmentDlqi = System.Label.BI_PSP_AssessmentDlqi;

    /**
     * @description Label indicating completion of the DLQI assessment.
     */
    public static String completeDlqi = System.Label.BI_PSP_CompleteDlqi;

    /**
     * @description Label for the challenges error message.
     */
    public static String challengesErrorMessage = System.Label.BI_PSP_ChallengesErrorMessage;

    /**
     * @description Label for the user ID error message.
     */
    public static String userIdErrorMessage = System.Label.BI_PSP_UserIdErrorMessage;

    /**
     * @description Label for the Care Program Template error message.
     */
    public static String careProgramTemplateErrorMessage = System.Label.BI_PSP_CareProgramTemplateErrorMessage;

    /**
     * @description Label for the Care Program Enrollee error message.
     */
    public static String careProgramEnrolleeErrorMessage = System.Label.BI_PSP_CareProgramEnrolleeErrorMessage;

    /**
     * @description Label for the enrollee caregiver error message.
     */
    public static String enrolleeCaregiverErrorMessage = System.Label.BI_PSP_EnrolleeCaregiverErrorMessage;

    /**
     * @description Label for a successful login message.
     */
    public static String loginSuccess = System.Label.BI_PSP_LoginSuccess;

    /**
     * @description Label representing the "View" option.
     */
    public static String view = System.Label.BI_PSPB_View;

    /**
     * @description Label for the log severity level for errors.
     */
    public static final String LOG_SEVERITY_ERROR = System.Label.BI_PSP_ErrorSeverity;

    /**
     * @description Label representing Symptom Three.
     */
    public static String SymptomThree = System.Label.BI_PSP_SymptomThree;

    /**
     * @description Label for the error message while retrieving enrollee ID.
     */
    public static String errorWhileGetEnrolleeId = System.Label.BI_PSP_PatientEnrolleeError;

}