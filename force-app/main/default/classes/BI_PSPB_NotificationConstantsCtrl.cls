/**
* @description  Used to
	create task when a video is uploaded and calling the method to
	send sms and email.
* History
* Version	Author			Date		Detail		Description
* 1.0		Niyas		24-07-2024		Created		Refactored Version
*/
public with sharing class BI_PSPB_NotificationConstantsCtrl { 
    public static string actionTypeGeneral = System.Label.BI_PSPB_General;
    public static string actionTypeAction = System.Label.BI_PSPB_Action;
    public static string actionTypeNotificatonTypeAction = System.Label.BI_PSPB_ActionRequiredValue;
    public static String actionDqliNotificationSubject= system.Label.BI_PSPB_ActionDlqiNotification;
    public static string daysCountOfTreatment = System.Label.BI_PSPB_DaysCountofTreatment;
    public static string video = System.Label.BI_PSPB_Video;
    public static String generalDemonstrationVideoSubject = System.Label.BI_PSPB_GeneralDemonstrationVideo;
    public static string notificationStatusComplete = System.Label.BI_PSP_Completed;
    public static String actionTreatmentDate = System.Label.BI_PSPB_ActionTreatmentDate;
    public static String actionTreatmentDueTwentyFour = System.Label.BI_PSPB_ActionDueTwentyFour;
    public static String actionTreatmentDueSeventyTwo = System.Label.BI_PSPB_ActionDueSeventyTwo;
    public static String statusDateOfTreatment = System.Label.BI_PSP_DateOfTreatment;
    public static String dayOfTreatment = 'Day of Treatment';
    public static String dateOfTreatment = 'Date of Treatment';
    public static String pastDueDate = System.Label.BI_PSPB_PastDueDate;
    public static String pastDueDateTwo = System.Label.BI_PSPB_PastDueDateTwo;
    // Error Messages
    public static String severityInfo = 'INFO';
    public static String severityError  = 'ERROR';
     public static String errorSeverity  = System.Label.BI_PSP_ErrorSeverity;
    public static string errorMsgRecordNotFound = System.Label.BI_PSPB_EnrolleRecNotFound;
    public static string errorMsgSymptomTrackerNotFound = System.Label.BI_PSP_SymptomTrackerError;
    public static String recordNotFound = System.Label.BI_PSP_RecordNotFoundMsg;
    public static string errorTreatmentReminderSched = 'Failed Treatment reminder schedule';
    public static string errorTreatmentReminderService = 'Failed Treatment reminder service';
    public static string errorCreatingTask = 'Error while creating tasks';
    public static string errorUpdatingTask = 'Error while updating tasks';
    public static string httpResponseError = System.Label.BI_PSPB_ReceivedNonResponse; //Received a non-200 response code
    public static string errorReturning = System.Label.BI_PSPB_ErrorReturning; //Error Returning
    ///////////////
    public static string generalSymptomTracker = System.Label.BI_PSPB_GeneralSymptomTracker; //GeneralSymptomTracker
    public static string urlSymptomTracker = System.Label.BI_PSPB_SymptomMainPage; // /s/bi-pspb-symptomtrackermainpage
    public static string generalChallenges = System.Label.BI_PSPB_GeneralChallenges; //GeneralChallenges
    public static string generalComment = System.Label.BI_PSPB_GeneralComment; //GeneralComment
    public static string actionTypeSymptomTracker = System.Label.BI_PSP_SymptomTrackerValue; //'Symptom Tracker'
    public static string urlChallenges = System.Label.BI_PSPB_UrlChallenges; // /s/bi-pspb-challenges
    public static string actionTypeChallenges = System.Label.BI_PSP_ChallengesName; //'Challenges'
    public static string urlMyPost = System.Label.BI_PSPB_MyPostPageUrl; // /s/bi-pspb-mypost
    public static string actionTypeGeneralCommunity = System.Label.BI_PSPB_Community; //Community
    public static string generalCreatePost = System.Label.BI_PSPB_GeneralCreatePost; //GeneralCreatePost
    public static string urlAllPost = System.Label.BI_PSPB_AllPostUrl; // /s/bi-pspb-allpost
    public static string urlFollower = System.Label.BI_PSPB_UrlFollower; // /s/bi-pspb-followers
    public static string generalFollow = System.Label.BI_PSPB_GeneralFollow; //GeneralFollow
    public static String notificationQuestionaries = System.Label.BI_PSP_NotificationQuestionnaires;
    public static string treatmentOne = System.Label.BI_PSPB_TrOne; //TR1 tr1
    public static string urlDashboard = System.Label.BI_PSPB_UrlDashboard; // /s/bi-pspb-dashboard
    public static string treatmentThree = System.Label.BI_PSPB_TreatmentReminderThree; //TR3 tr3
    public static string treatmentSeven = System.Label.BI_PSPB_TreatmentReminderSeven; //TR7 tr7
    public static string treatmentTen = System.Label.BI_PSPB_TrTen; //TR10 tr10
    public static string treatmentFourteen = System.Label.BI_PSPB_TrFourteen; //TR14 tr14
    public static string pastDueDateZero = System.Label.BI_PSPB_Pd; //PD0 pd0
    public static string pastDueDateOne = System.Label.BI_PSPB_PdOne; //PD1 pd1
    public static string pastDueDateThree = System.Label.BI_PSPB_PdThree; //PD3 pd3 
    public static string wpai = System.Label.BI_PSP_AssessmentWpai; //WPAI;
    public static string qsq = System.Label.BI_PSP_Qsq; //QSQ
    public static string qsqTwo = 'QSQ2'; //QSQ2
    public static string dlqi = System.Label.BI_PSP_AssessmentDlqi; //DLQI
    public static string pss = System.Label.BI_PSP_AssessmentPss; //PSS;
    public static string urlDlqiQuestionnaires = System.Label.BI_PSPB_UrlQuestionnaires; // /s/bi-psp-dlqi-questionnaire
    public static string urlPssQuestionnaires = System.Label.BI_PSPB_PssQuestionariesUrl; // /s/bi-psp-pss-questionnaire
    public static string urlWpaiQuestionnaires = System.Label.BI_PSPB_WpaiQuestionariesUrl; // /s/bi-psp-wpai-questionnaire
    public static string urlQsqQuestionnaires = System.Label.BI_PSPB_QsqQuestionariesUrl; // /s/bi-psp-qsq-questionnaire2
    public static string urlQsqTwoQuestionnaires = '/s/bi-psp-qsq-questionnaire2';
    public static string generalReaction = System.Label.BI_PSPB_GeneralReaction; //GeneralReaction
    public static string siteUrl = System.Label.BI_PSPB_SiteUrlSite; //BI_PSPB_SiteUrl
    public static string actionSymptomTracker = System.Label.BI_PSPB_ActionSymptomTracker; //ActionSymptomTracker

    //SMS And Email Templates
    public static string generalSymptomSms = System.Label.BI_PSPB_GeneralSymptomSms; //BI_PSP_GeneralSTNSms
    public static string generalSymptomEmail = System.Label.BI_PSPB_GeneralSymptomEmail; //BI_PSP_GSTN
    public static string generalChallengesSms = System.Label.BI_PSPB_ChallengesSms; //BI_PSPB_ChallengesSms
    public static string generalChallengesEmail = System.Label.BI_PSPB_GeneralChallengesEmail; //BI_PSPB_Challenges
    public static string generalPostEmail = System.Label.BI_PSPB_GeneralPostEmail; //BI_PSP_CommunitySharingExperiences
    public static string generalCommentEmail = System.Label.BI_PSPB_GeneralCommentEmail; //BI_PSP_Communitypost
    public static string generalReactionEmail = System.Label.BI_PSPB_GeneralReactionEmail; //BI_PSPB_CommunityReaction
    public static string generalFollowEmail = System.Label.BI_PSPB_GeneralFollowEmail; //BI_PSP_CommunityJourney
    public static string generalVideoSms = System.Label.BI_PSPB_GeneralVideoSms; //BI_PSP_NewDemoVideoSms
    public static string generalVideoEmail = System.Label.BI_PSPB_GeneralVideoEmail; //BI_PSPB_Demo
    public static string actionSymptomSms = System.Label.BI_PSPB_ActionSymptomSms; //BI_PSP_ARSTNSms
    public static string actionSymptomEmail = System.Label.BI_PSPB_ActionSymptomEmail; //BI_PSP_ARSTN
    public static string actionTreatmentOneSms = System.Label.BI_PSPB_ActionTrOneSms; //BI_PSPB_TR1DaybeforeSms actionT1Sms
    public static string actionTreatmentOneEmail = System.Label.BI_PSPB_ActionTrOneEmail; //BI_PSPB_TR1daybefore actionT1Email
    public static string actionTreatmentThreeSms = System.Label.BI_PSPB_ActionTrThreeSms; //BI_PSPB_TR3DaysBeforeSms actionT3Sms
    public static string actionTreatmentThreeEmail = System.Label.BI_PSPB_TrThreeDaysBefore; //BI_PSPB_TR3DaysBefore actionT3Email
    public static string actionTreatmentSevenSms = System.Label.BI_PSPB_ActionTrSevenSms; //BI_PSPB_PR7daysbeforeSms actionT7Sms
    public static string actionTreatmentSevenEmail = System.Label.BI_PSPB_PrSevenDaysBefore; //BI_PSPB_PR7daysbefore actionT7Email
    public static string actionTreatmentTenSms = System.Label.BI_PSPB_ActionTrTenSms; //BI_PSPB_PR10daysbeforeSms actionT10Sms
    public static string actionTreatmentTenEmail = System.Label.BI_PSPB_PrTenDaysBefore; //BI_PSPB_PR10daysbefore actionT10Email
    public static string actionTreatmentFourteenSms = System.Label.BI_PSPB_ActionTrFourteenSms; //BI_PSPB_PR14daysbeforeSms actionT14Sms
    public static string actionTreatmentFourteenEmail = System.Label.BI_PSPB_PrFourteenDaysBefore; //BI_PSPB_PR14daysbefore actionT14Email
    public static string actionPastDueSms = System.Label.BI_PSPB_ActionPdSms; //BI_PSPB_TRDayofTreatmentSms actionPdSms
    public static string actionPastDueEmail = System.Label.BI_PSPB_DateOfTreatment; //BI_PSPB_TRDayofTreatment actionPdEmail
    public static string actionPastDueOneSms = System.Label.BI_PSPB_ActionPdOneSms; // BI_PSPB_TRPastDue24Sms actionPd1Sms
    public static string actionPastDueOneEmail = System.Label.BI_PSPB_ActionPdOneEmail; //BI_PSPB_TRPastDue24 actionPd1Email
    public static string actionPastDueThreeSms = System.Label.BI_PSPB_ActionPdThreeSms; //BI_PSPB_TRPastDue72Sms actionPd3Sms
    public static string actionPastDueThreeEmail = System.Label.BI_PSPB_ActionPdThreeEmail; //BI_PSPB_TRPastDue72 actionPd3Email
    public static string actionDlqiSms = System.Label.BI_PSPB_ActionDlqiSms; //BI_PSP_NFQ_DLQI_SMS
    public static string actionDlqiEmail = System.Label.BI_PSPB_ActionDlqiEmail; // BI_PSP_NFQ_DLQI
    public static string actionPssSms = System.Label.BI_PSPB_ActionPssSms; //BI_PSP_NFQ_PSS_Sms
    public static string actionPssEmail = System.Label.BI_PSPB_ActionPssEmail; //BI_PSP_NFQ_PSS
    public static string actionWpaiSms = System.Label.BI_PSPB_ActionWpaiSms; //BI_PSP_NFQ_WPAI_SMS
    public static string actionWpaiEmail = System.Label.BI_PSPB_ActionWpaiEmail; //BI_PSP_NFQ_WPAI
    public static string actionQsqSms = System.Label.BI_PSPB_ActionQsqSms; //BI_PSP_NFQ_QSQ_Sms
    public static string actionQsqEmail = System.Label.BI_PSPB_ActionQsqEmail; //BI_PSP_NFQ_QSQ
    //
    public static string actionTypeNotificatonTypeCompleted = System.Label.BI_PSP_Completed; //'Completed'
    public static string actionTypeNotificatonTypeIncompleted = System.Label.BI_PSP_NotCompleted; //'Not Completed'
    public static string createPost = System.Label.BI_PSP_CreatePost; //CreatePost
    public static string inProgressType = System.Label.BI_PSP_InProgressTxt; //'In Progress'
    public static String progress = System.label.BI_PSPB_Progress; //Progress
    public static string actionTypeNotificationTypeExpired = System.Label.BI_PSP_Expired; //'Expired'
    public static string actionTypeRead = System.Label.BI_PSPB_Read; //'Read'
    public static string actionTypeActive = System.Label.BI_PSPB_Active; //'Active'
    public static string actionTypeUnRead = System.Label.BI_PSPB_UnRead; //'UnRead'
    public static string actionTypeTreatment = System.Label.BI_PSPB_Treatment; //'Treatment'
    public static string actionTypePrescription = System.Label.BI_PSPB_Prescription; //'Prescription'
    public static string dlqiQuestionName = System.Label.BI_PSP_DlqiCategory; // /s/bi-psp-qsq-questionnaire2
    public static string pssQuestionName = System.Label.BI_PSP_PssCategory; // /s/bi-psp-qsq-questionnaire2
    public static string wpaiQuestionName = System.Label.BI_PSP_WapiCategory; // /s/bi-psp-qsq-questionnaire2
    public static string qsqQuestionName = System.Label.BI_PSPB_QsqQuetionnaire; // /s/bi-psp-qsq-questionnaire2
    public static String treatmentVideo = 'Treatment Video'; // Treatment Video
    public static string notificationStatusNotComplete = System.Label.BI_PSP_NotCompleted; //'Not Completed'
    public static STRING actionResponseYes = System.Label.BI_PSPB_Yes; // 'Yes'
    public static STRING actionResponseNo = System.Label.BI_PSP_OptionValueNo; //No
    public static string parameterError = System.Label.BI_PSPB_ErrorParameter; //Error in passing parameter
    public static string questionnaireRecordName = System.Label.BI_PSP_IntroductionLabel; //'Introduction'
    public static string assessmentRating = System.Label.BI_PSPB_PriorityHigh; //High
    public static String taskStatusAction = System.label.BI_PSPB_ActionRequired; //Action Required
    public static string actionTypeQuestionnaires = System.Label.BI_PSPB_MyQuestionnaires; // 'My Questionnaires'
    public static string comment = System.Label.BI_PSP_Comment; //Comment;
    public static string reaction = System.Label.BI_PSP_Reaction; //Reaction;
    public static string follow = System.Label.BI_PSP_Follow; //Follow
    public static string treatmentAndRx = System.Label.BI_PSPB_TreatmentRxRemainders; //Treatment and Rx Reminders
//Email Batch
    public static  String logInfo = System.Label.BI_PSP_InfoSeverity;
    public static  String privacyPolicyUrl = System.Label.BI_PSPB_PrivacyPolicysUrl;
    public static  String contactError = System.Label.BI_PSP_ContactErrorMessage;
    public static String endPoint = System.Label.BI_PSPB_ApiEndPoint;
    public static  String finish = System.Label.BI_PSPB_Finish;
    public static string queued = System.Label.BI_PSPB_Queued; //queued
    public static string errorMsgUpdate = System.Label.BI_PSPB_UnableToUpdateRecord; //Unable to update record
    public static String emailGetMethod = System.Label.BI_PSPB_EmailMethod;
// Sms Batch
    public static String smsEndpoint = System.Label.BI_PSPB_SmsEndpoint;
    public static  String logError = System.Label.BI_PSP_ErrorSeverity;
    public static String recordError = System.Label.BI_PSPB_ErrorInRecord;
    public static String smsGetmethod = System.Label.BI_PSPB_SmsMethod;
    //
    public static String dlqiQuestionSubject = System.Label.BI_PSPB_DlqiInsiteSubject;
    public static String wpaiQuestionSubject = System.Label.BI_PSPB_ActionWpaiNotification;
    public static String pssQuestionSubject = System.Label.BI_PSPB_PssInsiteSubject;
    public static String symptomTrackerActionSubject = System.Label.BI_PSPB_SymptomInsiteSubject;
    public static String qsqQuestionSubject = System.Label.BI_PSPB_QsqInsiteSubject;
    public static String oneDayBeforeSubject = System.Label.BI_PSPB_OneDayBeforeTreatment;
    public static String threeDayBeforeSubject = System.Label.BI_PSPB_ThreeDayBeforeTreatment;
    public static String sevenDayBeforeSubject = System.Label.BI_PSPB_SevenDayBeforeTreatment;
    public static String tenDayBeforeSubject = System.Label.BI_PSPB_TenDayBeforeTreatment;
    public static String fourteenDayBeforeSubject = System.Label.BI_PSPB_FourteenDayBeforeTreatment;
    public static String newContentUpdates = System.Label.BI_PSPB_NewContentUpdates;
    
    public static String notificationExpiredCount = 'BI_PSPB_ExpiryDate';
    public static string assessmentSubject = System.Label.BI_PSP_Personalize; //'Let’s personalize. Complete your onboarding to get a personalized Spevigo experience'
}