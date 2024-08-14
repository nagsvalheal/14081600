public inherited sharing class BI_PSP_QuestionnaireConstant {
    
    /*custom label that displays an error message when there is no enrolled Date Registered in database for the
     / current patient.*/
    public static String noEnroleeOrAssessment= System.Label.BI_PSP_EnrolleeOrAssessment;
	public static String symptomErrorMsg = System.Label.BI_PSP_SymptomTrackerError;
     public static String symptomStatusInactive = System.Label.BI_PSP_Inactive;
    public static String errorForDates = System.Label.BI_PSP_QualitativeDateError;
    public static String falseParemeter = System.Label.BI_PSP_FalseInputParameters;
      //holds the label for expired text.
    public static String expiredLabel = System.Label.BI_PSP_Expired;
     //holds the label for active text.
    public static String active = System.Label.BI_PSP_Active;
    public static String emptyCategoryName = System.Label.BI_PSP_EmptyCategoryError;
    public static String acute = System.Label.BI_PSP_Acute;
    // for Chronic
    public static String chronic = System.Label.BI_PSP_Chronic;
    // for unassigned
    public static String unassigned = System.Label.BI_PSP_Unassigned;
    
    public static List<Account> caregiverAccount;
    public static String categoryName;
    public static Assessment assidss;
    //Assessment Class ends
    public static String emptyEnrolleRecrd = System.Label.BI_PSP_EmptyCareProgramEnrl;
    public static String conditions;
    public static final String careGiversPatientAccountErr = System.Label.BI_PSP_CaregiversPatient;
    public static final String LOG_SEVERITY_INFO = System.Label.BI_PSP_InfoSeverity;
    public static final String LOG_SEVERITY_ERROR  = System.Label.BI_PSP_ErrorSeverity;
    public static final String careGiversSelectedPatientErrMsg = System.Label.BI_PSP_SelectedPatientAccount;
    public static final String selctdPatientEnrolleeErrorMsg = System.Label.BI_PSP_SelectedPatientEnrollee;
    public static final String patientAccountErrorMsg = System.Label.BI_PSP_PatientAccountError;
    public static final String patientEnrolleeErrorMsg = System.Label.BI_PSP_PatientEnrolleeError;
    public static final String introduction = System.Label.BI_PSP_IntroductionTxt;
    public static final String inProgress = System.Label.BI_PSP_InProgressTxt;
    public static final String complete = System.Label.BI_PSP_Complete;
    public static final String emptyQuestioniareResponse = System.Label.BI_PSP_EmptyQuestionResponse;
    public static final String emptyAssesment = System.Label.BI_PSP_EmptyAssessment;
    public static final String emptyQuestionVersion = System.Label.BI_PSP_EmptyQuestionVersion;
    public static final String questionsNotAvailable = System.Label.BI_PSP_QuestionsUnavailable;
    public static final String assessmentFailed = System.Label.BI_PSP_AssessmentSubFailed;
    public static final String respnsNotDeltd = System.Label.BI_PSP_RespDelFailed;
    public static final String errorPersnltnStatus = System.Label.BI_PSP_PersnlatnStatus;
    public static String priorityHigh=System.Label.BI_PSPB_PriorityHigh;
     public static String emptyAssessmentDate = System.Label.BI_PSP_EmptyCompletedDate;
     public static Integer twoMonthsInt = Integer.valueOf(
        System.Label.BI_PSP_QsqAfterTwoMonths
    );
    //used to store the fourteen weeks date.and it gets result from the custom label.the custom label holds the value for Fourteen weeks.
    public static Integer fourteenWeeksInt = Integer.valueOf(
        System.Label.BI_PSP_QsqAfterFourteenWeeks
    );
       // custom label that displays an error message when there is no rollout date present.
    public static String rolloutDateerrormessage = System.Label.BI_PSP_RolloutErrorMsg;
        // Holds the label for completed assessment status.
    public static String completed = System.Label.BI_PSP_Completed;
	 // Public static list of AssessmentQuestionResponse
    public static List<AssessmentQuestionResponse> assResList = new List<AssessmentQuestionResponse>();
    public static List<AssessmentQuestionResponse> existingResponsesToUpdate= new List<AssessmentQuestionResponse>();
	public static Set<Id> assessmentIdsToUpdate=new Set<Id>();
    // Expiration date for assessment
    public static final Integer expireDate = Integer.valueOf(System.Label.BI_PSP_ExpireDateForQualitative);
	public static Map<String, AssessmentQuestionResponse> existingResponsesMap=new Map<String, AssessmentQuestionResponse>(); 
     //holds the response Value of Questions.
    public static final String responseText;
     // Holds the category label for pageOne
    public static String pageOne = System.Label.BI_PSP_PageOne;
    // Holds the category label for pageTwo
    public static String pageTwo = System.Label.BI_PSP_PageTwo;
    public static String activeVersionId;
    //holds the id of Questions.
    public static final String questionId;
    //this vriable holds the personalisation status.
    public static integer personalizeStatus;
     // Holds the label for the qualitative category.
    public static String qualiCategory = System.Label.BI_PSP_QualitativeCategory;
    
     public static final String applicationName;
    static {
        BI_SFCOE_LOG_App_Settings__c settings = BI_SFCOE_LOG_App_Settings__c.getValues('PSPB');
        applicationName = settings != null ? settings.BI_SFCOE_LOG_Application__c : '';
    }
    
    public static String pickListValue;
     public static string enrolleeId;
    public static List<AssessmentQuestion> listOfAssQuVer =new List<AssessmentQuestion>();
    public static List<Assessment> existingAssessments = new List<Assessment>();


}