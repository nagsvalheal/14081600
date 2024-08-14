// Importing Static Resources
import SITE_LOGO from '@salesforce/resourceUrl/BI_PSPB_SiteLogo';
import NOTIFIC_ICON from '@salesforce/resourceUrl/BI_PSPB_NotiIcon';
import MENU_ICON from '@salesforce/resourceUrl/BI_PSPB_MenuIcon';
import NOTIFIC_ICON_COLOR from '@salesforce/resourceUrl/BI_PSPB_NotIconColored';
import CROSS_ICON from '@salesforce/resourceUrl/BI_PSP_CrossIcon';
import SELECT_ICON from '@salesforce/resourceUrl/BI_PSPB_SelectIcon';
import DOWN_HEAD_ICON from '@salesforce/resourceUrl/BI_PSPB_downHeadIcon';
import HOME_ICON from "@salesforce/resourceUrl/BI_PSPB_HomeIcon";
import BANNER_IMG from '@salesforce/resourceUrl/BI_PSPB_BannerImage';
import BEYOND_GPP from '@salesforce/resourceUrl/BI_PSPB_BeyondGppLogo';
import IMAGE_FOR_FOOTER from '@salesforce/resourceUrl/BI_PSP_BiFooter';
// Importing Custom Labels
import ERROR_MESSAGE from '@salesforce/label/c.BI_PSP_ConsoleError';
import ERROR_VARIANT from '@salesforce/label/c.BI_PSP_ErrorVariantToast';
import SYSTEM_ADMIN_PROFILE from '@salesforce/label/c.BI_PSP_SystemAdminProfile';
import PATIENT_PROFILE from '@salesforce/label/c.BI_PSP_PatientProfile';
import CAREGIVER_PROFILE from '@salesforce/label/c.BI_PSPB_CaregiverProfile';
import BRANDED_DEV_UI_PROFILES from '@salesforce/label/c.BI_PSP_BrandedDevProfile';
import BRSITE_URL from '@salesforce/label/c.BI_PSPB_BrandedSiteNaviUrl';
import CHALLENGES_URL from '@salesforce/label/c.BI_PSP_ChallengesNaviUrl';
import ALLPOST_URL from '@salesforce/label/c.BI_PSPB_ChatterAllPost';
import CHATTER_SIGNUP_URL from '@salesforce/label/c.BI_PSP_ChatterSignUpUrl';
import INFO_LANDINGPAGE_URL from '@salesforce/label/c.BI_PSPB_InfoCenterLandingUrl';
import TROPHY_CASE_SITEURL from '@salesforce/label/c.BI_PSP_TrophyPageUrl';
import SYMPTOM_TRACKER_LP_URL from '@salesforce/label/c.BI_PSP_SymptomTrackerLandingPageUrl';
import LOGIN from '@salesforce/label/c.BI_PSP_Login';
import SUPPORT_PAGE_URL from '@salesforce/label/c.BI_PSPB_SupportCenterPageUrl';
import MYCASE_PAGE_URL from '@salesforce/label/c.BI_PSPB_MyCasesPageUrl';
import MESSAGE_CENTER_URL from '@salesforce/label/c.BI_PSPB_MessageCenterPageUrl';
import CAREGIVER_NOTIFICATION_URL from '@salesforce/label/c.BI_PSPB_CaregiverNotificationPageUrl';
import ARTICLE_CATEGORY_URL from '@salesforce/label/c.BI_PSPB_ArticleCategoryUrl';
import SEARCH_RESULT_URL from '@salesforce/label/c.BI_PSPB_SearchResults';
import DETAILED_ARTICLE_URL from '@salesforce/label/c.BI_PSPB_DetailedArticle';
import SYMPTOM_TRACKER_GRAPH_URL from '@salesforce/label/c.BI_PSPB_SymptomTrkGraphUrl';
import MEDICAL_INFO_ENQUIRY_URL from '@salesforce/label/c.BI_PSPB_MedicalInfoEnquiryUrl';
import REPORT_ADVERSE_EVENT_URL from '@salesforce/label/c.BI_PSPB_ReportAdverseEvent';
import PLATFORM_SUPPORT_URL from '@salesforce/label/c.BI_PSPB_PlatformSupportUrl';
import OUTSTANDINGPAGE_URL from '@salesforce/label/c.BI_PSPB_OutstndngPageUrl';
import IAMHCPSITE_URL from '@salesforce/label/c.BI_PSPB_IamHcp';
import IAMPATIENTSITE_URL from '@salesforce/label/c.BI_PSPB_IamPatientUrl';
import CHRONICVIDEOPAGE_URL from '@salesforce/label/c.BI_PSPB_ChronicVideoUrl';
import CHATTER_MYPOST from '@salesforce/label/c.BI_PSPB_ChatterMyPost';
import FOLLOWERS_URL from '@salesforce/label/c.BI_PSPB_ChatterFollower';
import FOLLOWING_URL from '@salesforce/label/c.BI_PSPB_ChatterFollowing';
import SUMMARY_URL from '@salesforce/label/c.BI_PSPB_SummaryUrl';
import LETSPERSONALISE_URL from '@salesforce/label/c.BI_PSPB_LetsPersonalizeUrl';
import REMINDERSITE_URL from '@salesforce/label/c.BI_PSPB_ReminderUrl';
import UPDATE_PRESCRIPTION_URL from '@salesforce/label/c.BI_PSPB_UpdatePrescriptionUrl';
import PRESCRIPTION_STATUS_URL from '@salesforce/label/c.BI_PSPB_PrescriptionStatusUrl';
import ACTION_SITEURL from '@salesforce/label/c.BI_PSPB_ActionUrl';
import HISTORY_SITEURL from '@salesforce/label/c.BI_PSPB_HistoryUrl';
import WAPI_COMPLETED_SITEURL from '@salesforce/label/c.BI_PSPB_WapiCompletedQuestionnaire';
import DLQI_COMPLETED_SITEURL from '@salesforce/label/c.BI_PSPB_DlqiCompletedUrl';
import PSS_COMPLETED_SITEURL from '@salesforce/label/c.BI_PSPB_PsoriasisCompletedQuesUrl';
import QSQ_COMPLETED_TWOMONTHS_URL from '@salesforce/label/c.BI_PSPB_QualitativeTwoMonthsCompletedUrl';
import QSQ_COMPLETED_FOURTEENWEEKS_URL from '@salesforce/label/c.BI_PSPB_QualitativeFourteenwksCompletedUrl';
import PATIENT_MYPROFILE_URL from '@salesforce/label/c.BI_PSPB_PatientMyProfileUrl';
import CAREGIVER_PROFILE_URL from '@salesforce/label/c.BI_PSPB_CaregiverProfileUrl';
import MYCAREGIVER_URL from '@salesforce/label/c.BI_PSPB_MyCaregiverUrl';
import PATIENT_SELECT_AVATAR_URL from '@salesforce/label/c.BI_PSPB_PatientSelectAvatarUrl';
import PATIENT_NOTIFICATION_URL from '@salesforce/label/c.BI_PSPB_PatientNotificationUrl';
import CAREGIVER_PATIENT_URL from '@salesforce/label/c.BI_PSPB_CaregiverPatientUrl';
import CAREGIVER_SELECT_AVATAR_URL from '@salesforce/label/c.BI_PSPB_CaregiverSelectAvatarUrl';
import SYMPTOM_TRACKER_MAINPAGE_URL from '@salesforce/label/c.BI_PSPB_SymptomTrackerMainPages';
import PSORIASIS_SITEURL from '@salesforce/label/c.BI_PSPB_PsoriasisQuesUrl';
import WAPI_SITEURL from '@salesforce/label/c.BI_PSPB_WapiQuestionnaire';
import QUALITATIVE_TWOMONTHS_URL from '@salesforce/label/c.BI_PSPB_QualitativeTwoMonths';
import QUALITATIVE_FOURTEENWEEKS_URL from '@salesforce/label/c.BI_PSPB_QualitativeFourteenWeeks';
import DASHBOARD_SITEURL from '@salesforce/label/c.BI_PSPB_Dashboad';
import CREATEPOST_URL from '@salesforce/label/c.BI_PSPB_CreatePostPageUrl';
import ACUTE from '@salesforce/label/c.BI_PSPB_Acute';
import UNASSIGNED from '@salesforce/label/c.BI_PSP_Unassigned';
import SECURE_LOGOUT from '@salesforce/label/c.BI_PSPB_SecureLogout';
import COMPLETED from '@salesforce/label/c.BI_PSP_Completed';
import EXPIRED from '@salesforce/label/c.BI_PSP_Expired';
import CAREGIVER_FIRST_AVATAR from '@salesforce/label/c.BI_PSPB_CaregiverFirstAvatar'
import ACUTE_VIDEO_PAGE from '@salesforce/label/c.BI_PSPB_AcuteVideoPage';
import UNASSIGNED_URL from '@salesforce/label/c.BI_PSPB_UnAssignedNaviUrl';
import LOGIN_PAGE from '@salesforce/label/c.BI_PSPB_LoginPage';
import UNASSIGNED_LABEL from "@salesforce/label/c.BI_PSPB_UnAssignedLabel";
import ACUTE_DASHBOARD from "@salesforce/label/c.BI_PSPB_AcuteDashboard";
import PUBLIC_TERMS_OF_USE from '@salesforce/label/c.BI_PSPB_PublicTermsOfUse';
import PUBLIC_PRIVACY_NOTICE from '@salesforce/label/c.BI_PSPB_PublicPrivacyNotice';
import PUBLIC_CONTACT_US from '@salesforce/label/c.BI_PSPB_PublicContactUs';
import CONTACT_US from '@salesforce/label/c.BI_PSPB_ContactUs';
import CONTACT_US_LOGIN from '@salesforce/label/c.BI_PSPB_ContactUsLogin';
import PRIVACY_LOGIN from '@salesforce/label/c.BI_PSPB_PrivacyLogin';
import TERMS_LOGIN from '@salesforce/label/c.BI_PSPB_TermsOfUseLogin';
import TERMS_OF_USE from '@salesforce/label/c.BI_PSPB_TermsOfUse';
import PRIVACY_NOTICE from '@salesforce/label/c.BI_PSPB_PrivacyNotice';
import BRANDED_URL from '@salesforce/label/c.BI_PSPB_SiteLabel';
import QUESTIONNAIRE_ONE_URL from '@salesforce/label/c.BI_PSP_AvatarQuestionnaireUrl';
import QUESTIONNAIRE_TWO_URL from '@salesforce/label/c.BI_PSP_AvatarQuestionnaireTwoUrl';
import BI_PSPB_IMPRINT from '@salesforce/label/c.BI_PSPB_ImPrint';
import BI_PSPB_DATA from '@salesforce/label/c.BI_PSPB_Data';
import BI_PSPB_REGISTRATION from '@salesforce/label/c.BI_PSPB_Registration';
import BI_PSPB_LOG from '@salesforce/label/c.BI_PSPB_Log';
import BI_PSPB_COOKIES from '@salesforce/label/c.BI_PSPB_Cookies';
import BI_PSPB_OFFERINGS from '@salesforce/label/c.BI_PSPB_Offerings';
import BI_PSPB_LISTENING from '@salesforce/label/c.BI_PSPB_Listening';
import BI_PSPB_PHARMACOVIGILANCE from '@salesforce/label/c.BI_PSPB_PharmaCoVigilance';
import BI_PSPB_FURTHER from '@salesforce/label/c.BI_PSPB_Further';
import BI_PSPB_PROCESSOR from '@salesforce/label/c.BI_PSPB_Processor';
import BI_PSPB_COMPANIES from '@salesforce/label/c.BI_PSPB_Companies';
import BI_PSPB_TRANSFER from '@salesforce/label/c.BI_PSPB_Transfer';
import BI_PSPB_PHARMACEUTICAL from '@salesforce/label/c.BI_PSPB_Pharmaceutical';
import BI_PSPB_CONTENT from '@salesforce/label/c.BI_PSPB_Content';
import BI_PSPB_RECIPIENTS from '@salesforce/label/c.BI_PSPB_Recipients';
import BI_PSPB_RETENTION from '@salesforce/label/c.BI_PSPB_Retention';
import BI_PSPB_RIGHTS from '@salesforce/label/c.BI_PSPB_Rights';
import BI_PSPB_QUESTIONS from '@salesforce/label/c.BI_PSPB_Questions';
import BI_PSPB_CHANGESPRIVACY from '@salesforce/label/c.BI_PSPB_ChangesPrivacy';
import BI_PSPB_FACEBOOK from '@salesforce/label/c.BI_PSPB_Facebook';
import BI_PSPB_LEGAL from '@salesforce/label/c.BI_PSPB_Legal';
import BI_PSPB_TWITTER from '@salesforce/label/c.BI_PSPB_Twitter';
import BI_PSPB_LINKEDIN from '@salesforce/label/c.BI_PSPB_Linkedin';
import BI_PSPB_CONTROLLER from '@salesforce/label/c.BI_PSPB_Controller';
import BI_PSPB_ADDENDUM from '@salesforce/label/c.BI_PSPB_Addendum';
import BI_PSP_DISPLAYERRORPAGE from '@salesforce/label/c.BI_PSP_DisplayErrorPage';
import BI_PSP_BEYONDGPP from '@salesforce/label/c.BI_PSP_BeyondGpp';
import ACCOUNT_MANAGER from '@salesforce/label/c.BI_PSPB_AccountManager';
import NOTIFICATION_CENTER from '@salesforce/label/c.BI_PSPB_NotificationCenter';
import TREATMENT_PRES_VALUE from '@salesforce/label/c.BI_PSPB_TreatmentAndPresValue';
import UPDATE_PRESCRIPTION from '@salesforce/label/c.BI_PSPB_UpdatePrescription';
import SWITCH_PATIENTS from '@salesforce/label/c.BI_PSPB_SwitchPatient';
import LOGOUT from '@salesforce/label/c.BI_PSPB_Logout';
import HOME from '@salesforce/label/c.BI_PSPB_Home';
import INFORMATION_CENTER from '@salesforce/label/c.BI_PSPB_InformationCenter';
import SYMPTOM_TRACKER from '@salesforce/label/c.BI_PSPB_SymptomTracker';
import CHALLENGES from '@salesforce/label/c.BI_PSPB_Challenge';
import MY_QUESTIONNAIRE from '@salesforce/label/c.BI_PSPB_MyQuestionnaires';
import COMMUNITY from '@salesforce/label/c.BI_PSPB_Community';
import SUPPORT from '@salesforce/label/c.BI_PSPB_Support';
import LOGIN_LABEL from '@salesforce/label/c.BI_PSPB_Login';
import BACK from '@salesforce/label/c.BI_PSPB_Back';
import MY_PROFILE from '@salesforce/label/c.BI_PSP_MyProfile';
import PRES_STATUS from '@salesforce/label/c.BI_PSPB_PrescriptionStatus';
import GENERAL from '@salesforce/label/c.BI_PSPB_General';
import ACTION_REQUIRED from '@salesforce/label/c.BI_PSPB_ActionRequired';
import HISTORY from '@salesforce/label/c.BI_PSPB_History';
import PATIENT_INFO from '@salesforce/label/c.BI_PSPB_PatientInformation';
import SELECT_AVATAR from '@salesforce/label/c.BI_PSPB_SelectAvatar';
import NOTIFIC_SETTING from '@salesforce/label/c.BI_PSPB_NotificationSetting';
import SUPPORT_CENTER from '@salesforce/label/c.BI_PSPB_SupportCenterValue';
import MY_CASE from '@salesforce/label/c.BI_PSPB_MyCase';
import ARTICLES from '@salesforce/label/c.BI_PSPB_Articles';
import PATIENT_TREATMENT_VIDEO from '@salesforce/label/c.BI_PSPB_PatientTreatmentVideo';
import TROPHY_CASE from '@salesforce/label/c.BI_PSPB_TropyCase';
import ALL_POSTS from '@salesforce/label/c.BI_PSP_AllPosts';
import MY_POSTS from '@salesforce/label/c.BI_PSP_MyPosts';
import MY_FOLLOWERS from '@salesforce/label/c.BI_PSP_MyFollowers';
import FOLLOWING from '@salesforce/label/c.BI_PSP_Following';
import OUTSTANDING_PAGE from '@salesforce/label/c.BI_PSP_OutstndngPageTxt';
import SUMMARY from '@salesforce/label/c.BI_PSPB_Summary';
import COMPLETED_QUES from '@salesforce/label/c.BI_PSP_CompletedQuestionnaireTxt';
import LETS_PERSONALIZE from '@salesforce/label/c.BI_PSP_PersonlizeHeading';
import MY_CAREGIVER from '@salesforce/label/c.BI_PSPB_MyCaregiver';
import PATIENT_BACK from '@salesforce/label/c.BI_PSPB_PatientBackValue';
import LOGOUT_WARNING from '@salesforce/label/c.BI_PSPB_LogoutWarning';
import LOGOUT_CONTENT from '@salesforce/label/c.BI_PSPB_LogoutContent';
import YES from '@salesforce/label/c.BI_PSPB_Yes';
import CANCEL from '@salesforce/label/c.BI_PSP_CancelButton';
import CONTACT_US_LABEL from '@salesforce/label/c.BI_PSPB_ContactUsLabel';
import REDIRECTION_LABEL from '@salesforce/label/c.BI_PSPB_RedirectionLabel';
import TERMS_OF_USE_LABEL from '@salesforce/label/c.BI_PSPB_TermsOfUseLabel';
import PRIVACY_NOTICE_LABEL from '@salesforce/label/c.BI_PSPB_PrivacyNoticeLabel';
import COPYRIGHTS from '@salesforce/label/c.BI_PSPB_Copyrights';
import DISPLAY_NAV_ERRORPAGE from '@salesforce/label/c.BI_PSP_DisplayNavErrorPage';
import WELCOME from '@salesforce/label/c.BI_PSPB_WelcomeTo';
import WELCOME_MSG from '@salesforce/label/c.BI_PSPB_WelcomeMsg';
import IAM_HCP from '@salesforce/label/c.BI_PSPB_IamHcpMsg';
import IAM_PATIENT from '@salesforce/label/c.BI_PSPB_IamPatientMsg';
import CARE_BACK from '@salesforce/label/c.BI_PSPB_CareBack';
import EXTRA from '@salesforce/label/c.BI_PSPB_Extra';
import LOGIN_COPYRIGHTS from '@salesforce/label/c.BI_PSP_LoginCopyrights';
import CHRONIC_STATUS from '@salesforce/label/c.BI_PSPB_ChronicStatus';
import FLARE_TREATMENT_LABEL from '@salesforce/label/c.BI_PSPB_FlareTreatmentLabel';
import FLARE_PREVENTION_LABEL from '@salesforce/label/c.BI_PSPB_FlarePreventionLabel';
import SPEVIGO_ARTICLES from '@salesforce/label/c.BI_PSPB_SpevigoArticles';
import CATEGORY_PAGE from '@salesforce/label/c.BI_PSPB_InfoCenterCategoryUrl';
// Exporting all resources in an organized object
export const resources = {
	
	// Apex Classes

	// Static Resources
	SITE_LOGO,
	NOTIFIC_ICON,
	MENU_ICON,
	NOTIFIC_ICON_COLOR,
	CROSS_ICON,
	SELECT_ICON,
	DOWN_HEAD_ICON,
    HOME_ICON,
	BEYOND_GPP,
	BANNER_IMG,
	IMAGE_FOR_FOOTER,

	// Custom Labels
	SPEVIGO_ARTICLES,
	CATEGORY_PAGE,
	FLARE_TREATMENT_LABEL,
	FLARE_PREVENTION_LABEL,
	CHRONIC_STATUS,
	PRIVACY_NOTICE,
	BRANDED_URL,
	QUESTIONNAIRE_ONE_URL,
	QUESTIONNAIRE_TWO_URL,
	PRIVACY_LOGIN,
	TERMS_LOGIN,
	TERMS_OF_USE,
	PUBLIC_TERMS_OF_USE,
	CONTACT_US_LOGIN,
	CONTACT_US,
	PUBLIC_PRIVACY_NOTICE,
	PUBLIC_CONTACT_US,
    ACUTE_DASHBOARD,
	ERROR_MESSAGE,
	ERROR_VARIANT,
	SYSTEM_ADMIN_PROFILE,
	PATIENT_PROFILE,
	CAREGIVER_PROFILE,
	BRANDED_DEV_UI_PROFILES,
	BRSITE_URL,
	CHALLENGES_URL,
	ALLPOST_URL,
	CHATTER_SIGNUP_URL,
	INFO_LANDINGPAGE_URL,
	TROPHY_CASE_SITEURL,
	SYMPTOM_TRACKER_LP_URL,
	LOGIN,
	SUPPORT_PAGE_URL,
	MYCASE_PAGE_URL,
	MESSAGE_CENTER_URL,
	CAREGIVER_NOTIFICATION_URL,
	ARTICLE_CATEGORY_URL,
	SEARCH_RESULT_URL,
	DETAILED_ARTICLE_URL,
	SYMPTOM_TRACKER_GRAPH_URL,
	MEDICAL_INFO_ENQUIRY_URL,
	REPORT_ADVERSE_EVENT_URL,
	PLATFORM_SUPPORT_URL,
	OUTSTANDINGPAGE_URL,
	IAMHCPSITE_URL,
	IAMPATIENTSITE_URL,
	CHRONICVIDEOPAGE_URL,
	CHATTER_MYPOST,
	FOLLOWERS_URL,
	FOLLOWING_URL,
	SUMMARY_URL,
	LETSPERSONALISE_URL,
	REMINDERSITE_URL,
	UPDATE_PRESCRIPTION_URL,
	PRESCRIPTION_STATUS_URL,
	ACTION_SITEURL,
	HISTORY_SITEURL,
	WAPI_COMPLETED_SITEURL,
	DLQI_COMPLETED_SITEURL,
	PSS_COMPLETED_SITEURL,
	QSQ_COMPLETED_TWOMONTHS_URL,
	QSQ_COMPLETED_FOURTEENWEEKS_URL,
	PATIENT_MYPROFILE_URL,
	CAREGIVER_PROFILE_URL,
	MYCAREGIVER_URL,
	PATIENT_SELECT_AVATAR_URL,
	PATIENT_NOTIFICATION_URL,
	CAREGIVER_PATIENT_URL,
	CAREGIVER_SELECT_AVATAR_URL,
	SYMPTOM_TRACKER_MAINPAGE_URL,
	PSORIASIS_SITEURL,
	WAPI_SITEURL,
	QUALITATIVE_TWOMONTHS_URL,
	QUALITATIVE_FOURTEENWEEKS_URL,
	DASHBOARD_SITEURL,
	CREATEPOST_URL,
	ACUTE,
	UNASSIGNED,
	SECURE_LOGOUT,
	COMPLETED,
	EXPIRED,
	CAREGIVER_FIRST_AVATAR,
	ACUTE_VIDEO_PAGE,
	UNASSIGNED_URL,
	LOGIN_PAGE,
    UNASSIGNED_LABEL,
	BI_PSPB_IMPRINT,
	BI_PSPB_DATA,
	BI_PSPB_REGISTRATION,
	BI_PSPB_LOG,
	BI_PSPB_COOKIES,
	BI_PSPB_OFFERINGS,
	BI_PSPB_LISTENING,
	BI_PSPB_PHARMACOVIGILANCE,
	BI_PSPB_FURTHER,
	BI_PSPB_PROCESSOR,
	BI_PSPB_COMPANIES,
	BI_PSPB_TRANSFER,
	BI_PSPB_PHARMACEUTICAL,
	BI_PSPB_CONTENT,
	BI_PSPB_RECIPIENTS,
	BI_PSPB_RETENTION,
	BI_PSPB_RIGHTS,
	BI_PSPB_QUESTIONS,
	BI_PSPB_CHANGESPRIVACY,
	BI_PSPB_FACEBOOK,
	BI_PSPB_LEGAL,
	BI_PSPB_TWITTER,
	BI_PSPB_LINKEDIN,
	BI_PSPB_CONTROLLER,
	BI_PSPB_ADDENDUM,
	BI_PSP_DISPLAYERRORPAGE,
	BI_PSP_BEYONDGPP,
	ACCOUNT_MANAGER,
	NOTIFICATION_CENTER,
	TREATMENT_PRES_VALUE,
	UPDATE_PRESCRIPTION,
	SWITCH_PATIENTS,
	LOGOUT,
	HOME,
	INFORMATION_CENTER,
	SYMPTOM_TRACKER,
	CHALLENGES,
	MY_QUESTIONNAIRE,
	COMMUNITY,
	SUPPORT,
	LOGIN_LABEL,
	BACK,
	MY_PROFILE,
	PRES_STATUS,
	GENERAL,
	ACTION_REQUIRED,
	HISTORY,
	PATIENT_INFO,
	SELECT_AVATAR,
	NOTIFIC_SETTING,
	SUPPORT_CENTER,
	MY_CASE,
	ARTICLES,
	PATIENT_TREATMENT_VIDEO,
	TROPHY_CASE,
	ALL_POSTS,
	MY_POSTS,
	MY_FOLLOWERS,
	FOLLOWING,
	OUTSTANDING_PAGE,
	SUMMARY,
	COMPLETED_QUES,
	LETS_PERSONALIZE,
	MY_CAREGIVER,
	PATIENT_BACK,
	LOGOUT_WARNING,
	LOGOUT_CONTENT,
	YES,
	CANCEL,
	CONTACT_US_LABEL,
	REDIRECTION_LABEL,
	TERMS_OF_USE_LABEL,
	PRIVACY_NOTICE_LABEL,
	COPYRIGHTS,
	DISPLAY_NAV_ERRORPAGE,
	WELCOME,
	WELCOME_MSG,
	IAM_HCP,
	IAM_PATIENT,
	CARE_BACK,
	EXTRA,
	LOGIN_COPYRIGHTS

};