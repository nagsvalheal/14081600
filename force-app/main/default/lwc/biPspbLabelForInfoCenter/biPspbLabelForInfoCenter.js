import { LightningElement } from 'lwc';
import BRANDED_URL from '@salesforce/label/c.BI_PSPB_SiteLabel';
import UNASSIGNED_URL from '@salesforce/label/c.BI_PSPB_UnAssignedLabel';
import WHAT_GPP_LABEL from '@salesforce/label/c.BI_PSP_WhatGppLabel';
import FACTS_GPP_LABEL from '@salesforce/label/c.BI_PSP_FactsGppLabel';
import RARE_GPP_LABEL from '@salesforce/label/c.BI_PSP_RareGppLabel';
import WHY_DO_I_HAVE_GPP_LABEL from '@salesforce/label/c.BI_PSP_WhyDoIHaveGppLabel';
import DIAGNOSIS_GPP_LABEL from '@salesforce/label/c.BI_PSP_DiagnosisGppLabel';
import GPP_CONTAGIOUS_LABEL from '@salesforce/label/c.BI_PSP_GppContagiousLabel';
import FRIENDS_FAMILY_LABEL from '@salesforce/label/c.BI_PSP_FriendsFamilyLabel';
import FEELING_EXCLUDED_LABEL from '@salesforce/label/c.BI_PSP_FeelingExcludedLabel';
import GPP_INTIMACY_LABEL from '@salesforce/label/c.BI_PSP_GppIntimacyLabel';
import GPP_PREGNANCY_LABEL from '@salesforce/label/c.BI_PSP_GppPregnancyLabel';
import MANAGE_FLARE_LABEL from '@salesforce/label/c.BI_PSP_ManageFlareLabel';
import GPP_COMORBIDITIES_LABEL from '@salesforce/label/c.BI_PSP_GppComorbiditiesLabel';
import MANAGE_GPP_SYMPTOMS_LABEL from '@salesforce/label/c.BI_PSP_ManageGppSymptomsLabel';
import ASK_DOCTOR_LABEL from '@salesforce/label/c.BI_PSP_AskDoctorLabel';
import SEEK_MEDICARE_LABEL from '@salesforce/label/c.BI_PSP_SeekMediCareLabel';
import SEEK_EMERGENCY_LABEL from '@salesforce/label/c.BI_PSP_SeekEmergencyLabel';
import MANAGE_SCARS_LABEL from '@salesforce/label/c.BI_PSP_ManageScarsLabel';
import COMPLICAT_GPP_LABEL from '@salesforce/label/c.BI_PSP_ComplicatGppLabel';
import RECOGNIZING_FLARES_LABEL from '@salesforce/label/c.BI_PSP_RecognizingFlaresLabel';
import VISIT_DOCTOR_LABEL from '@salesforce/label/c.BI_PSP_VisitDoctorLabel';
import DERMATOLOGIST_LABEL from '@salesforce/label/c.BI_PSP_DermatologistLabel';
import TALK_GPP_LABEL from '@salesforce/label/c.BI_PSP_TalkGppLabel';
import NOT_ALONE_LABEL from '@salesforce/label/c.BI_PSP_NotAloneLabel';
import POSITIVE_CHOICES_LABEL from '@salesforce/label/c.BI_PSP_PositiveChoicesLabel';
import TREATING_GPP_LABEL from '@salesforce/label/c.BI_PSPB_TreatingGppLabel';
import SPEVIGO_INFUSION_LABEL from '@salesforce/label/c.BI_PSPB_SpevigoInfusionLabel';
import PREVENTION_GPP_LABEL from '@salesforce/label/c.BI_PSPB_PreventionGppLabel';
import SPEVIGO_INJECTION_LABEL from '@salesforce/label/c.BI_PSPB_SpevigoInjectionLabel';
import WORK_IN_GPP_LABEL from '@salesforce/label/c.BI_PSPB_WorkInGppLabel';
import CHRONIC_STATUS from '@salesforce/label/c.BI_PSPB_ChronicStatus';
import CHRONIC_CATEGORY from '@salesforce/label/c.BI_PSPB_ChronicCategory';
import ACUTE_CATEGORY from '@salesforce/label/c.BI_PSPB_AcuteCategory';
import CHANNEL_NAME from '@salesforce/label/c.BI_PSP_ChannelName';
import ACUTE_STATUS from '@salesforce/label/c.BI_PSPB_Acute';
import ARTICLE_STRING from '@salesforce/label/c.BI_PSPB_ArticleString';
import FLARE_TREATMENT_CATEGORY from '@salesforce/label/c.BI_PSPB_FlareTreatmentCategory';
import FLARE_PREVENTION_CATEGORY from '@salesforce/label/c.BI_PSPB_FlarePreventionCategory';
import WHAT_IS_GPP_LABEL from '@salesforce/label/c.BI_PSP_WhatIsGppLabel';
import GPP_HEALTH_LABEL from '@salesforce/label/c.BI_PSP_GppHealthLabel';
import TALK_HCP_LABEL from '@salesforce/label/c.BI_PSP_TalkHcpLabel';
import MANAGE_GPP_LABEL from '@salesforce/label/c.BI_PSP_ManageGppLabel';
import FLARES_LABEL from '@salesforce/label/c.BI_PSP_FlaresLabel';
import ERROR_VARIANT from '@salesforce/label/c.BI_PSP_ErrorVariantToast';
import ERROR_MESSAGE from '@salesforce/label/c.BI_PSP_ConsoleError';
import UNASSIGNED_STATUS from '@salesforce/label/c.BI_PSP_Unassigned';
import BRANDED_SITE_URL from '@salesforce/label/c.BI_PSPB_BrandedSiteNaviUrl';
import UNASSIGNED_SITE_URL from '@salesforce/label/c.BI_PSPB_UnAssignedNaviUrl';
import DETAIL_PAGE from '@salesforce/label/c.BI_PSPB_InfoCenterDetailUrl';
import WHAT_GPP_MINS from '@salesforce/label/c.BI_PSP_WhatGppReadTime';
import FACTS_GPP_MINS from '@salesforce/label/c.BI_PSP_FactsGppReadTime';
import RARE_GPP_MINS from '@salesforce/label/c.BI_PSP_RareGppReadTime';
import WHY_DO_I_HAVE_GPP_MINS from '@salesforce/label/c.BI_PSP_WhyDoIHaveGppReadTime';
import DIAGNOSIS_GPP_MINS from '@salesforce/label/c.BI_PSP_DiagnosisGppReadTime';
import GPP_CONTAGIOUS_MINS from '@salesforce/label/c.BI_PSP_GppContagiousReadTime';
import FRIENDS_FAMILY_MINS from '@salesforce/label/c.BI_PSP_FriendsFamilyReadTime';
import FEELING_EXCLUDED_MINS from '@salesforce/label/c.BI_PSP_FeelingExcludedReadTime';
import GPP_INTIMACY_MINS from '@salesforce/label/c.BI_PSP_GppIntimacyReadTime';
import GPP_PREGNANCY_MINS from '@salesforce/label/c.BI_PSP_GppPregnancyReadTime';
import MANAGE_FLARE_MINS from '@salesforce/label/c.BI_PSP_ManageFlareReadTime';
import GPP_COMORBIDITIES_MINS from '@salesforce/label/c.BI_PSP_GppComorbiditiesReadTime';
import MANAGE_GPP_SYMPTOMS_MINS from '@salesforce/label/c.BI_PSP_ManageGppSymptomsReadTime';
import ASK_DOCTOR_MINS from '@salesforce/label/c.BI_PSP_AskDoctorReadTime';
import SEEK_MEDICARE_MINS from '@salesforce/label/c.BI_PSP_SeekMediCareReadTime';
import SEEK_EMERGENCY_MINS from '@salesforce/label/c.BI_PSP_SeekEmergencyReadTime';
import MANAGE_SCARS_MINS from '@salesforce/label/c.BI_PSP_ManageScarsReadTime';
import COMPLICAT_GPP_MINS from '@salesforce/label/c.BI_PSP_ComplicatGppReadTime';
import RECOGNIZING_FLARES_MINS from '@salesforce/label/c.BI_PSP_RecognizingFlaresReadTime';
import VISIT_DOCTOR_MINS from '@salesforce/label/c.BI_PSP_VisitDoctorReadTime';
import DERMATOLOGIST_MINS from '@salesforce/label/c.BI_PSP_DermatologistReadTime';
import TALK_GPP_MINS from '@salesforce/label/c.BI_PSP_TalkGppReadTime';
import NOT_ALONE_MINS from '@salesforce/label/c.BI_PSP_NotAloneReadTime';
import POSITIVE_CHOICES_MINS from '@salesforce/label/c.BI_PSP_PositiveChoicesReadTime';
import TREATING_GPP_MINS from '@salesforce/label/c.BI_PSPB_TreatingGppReadTime';
import SPEVIGO_INFUSION_MINS from '@salesforce/label/c.BI_PSPB_SpevigoInfusionReadTime';
import PREVENTION_GPP_MINS from '@salesforce/label/c.BI_PSPB_PreventionGppReadTime';
import SPEVIGO_INJECTION_MINS from '@salesforce/label/c.BI_PSPB_SpevigoInjectionReadTime';
import WORK_IN_GPP_MINS from '@salesforce/label/c.BI_PSPB_WorkInGppReadTime';
import VIEW_LABEL from '@salesforce/label/c.BI_PSPB_View';
import ENTER_EVENT from '@salesforce/label/c.BI_PSP_EventEnter';
import CATEGORY_PAGE from '@salesforce/label/c.BI_PSPB_InfoCenterCategoryUrl';
import CHRONIC_VIDEO_PAGE from '@salesforce/label/c.BI_PSPB_ChronicVideoUrl';
import ACUTE_VIDEO_PAGE from '@salesforce/label/c.BI_PSPB_AcuteVideoPage';
import SEARCH_PAGE from '@salesforce/label/c.BI_PSPB_InfoCenterSearchUrl';
import FLARE_TREATMENT_LABEL from '@salesforce/label/c.BI_PSPB_FlareTreatmentLabel';
import FLARE_PREVENTION_LABEL from '@salesforce/label/c.BI_PSPB_FlarePreventionLabel';
import WHAT_IS_GPP_CATEGORY from '@salesforce/label/c.BI_PSP_WhatIsGppCategory';
import MANAGE_GPP_CATEGORY from '@salesforce/label/c.BI_PSP_ManageGppCategory';
import TALK_HCP_CATEGORY from '@salesforce/label/c.BI_PSP_TalkHcpCategory';
import GPP_HEALTH_CATEGORY from '@salesforce/label/c.BI_PSP_GppHealthCategory';
import INTRODUCTION_CATEGORY from '@salesforce/label/c.BI_PSP_IntroductionLabel';
import FLARES_CATEGORY from '@salesforce/label/c.BI_PSP_FlaresCategory';
import COMPLETE_STATUS from '@salesforce/label/c.BI_PSP_Complete';
import NO_SEARCH_RESULTS from '@salesforce/label/c.BI_PSP_SearchNoResults';
import JUST_FOR_ME_CATEGORY from '@salesforce/label/c.BI_PSP_JustForMeCategory';
import LANDING_PAGE from '@salesforce/label/c.BI_PSPB_InfoCenterLandingUrl';
import SPEVIGO_CATEGORY from '@salesforce/label/c.BI_PSPB_SpevigoCategory';
import GEN_CATEGORY from '@salesforce/label/c.BI_PSP_GenMessageCategory';
import SOCIAL_LIFE_CATEGORY from '@salesforce/label/c.BI_PSP_SocialLifeCategory';
import MANAGEMENT_CATEGORY from '@salesforce/label/c.BI_PSP_ManagementCategory';
import MENTAL_HEALTH_CATEGORY from '@salesforce/label/c.BI_PSP_MentalHealthCategory';
import HEALTHY_LIFE_CATEGORY from '@salesforce/label/c.BI_PSPB_HealthyLifeCategory';
import GPP_FLARE from '@salesforce/label/c.BI_PSPB_GppFlare';
import GPP_TAG from '@salesforce/label/c.BI_PSPB_GppTag';
import WHAT_COMORBIDITIES from '@salesforce/label/c.BI_PSPB_WhatComorbidities';
import GPP_TREATMENT from '@salesforce/label/c.BI_PSPB_GppTreatment';
import GPP_FLARE_PREVENTION from '@salesforce/label/c.BI_PSPB_GppFlarePrevention';
import SPEV_ACTION_DOSE from '@salesforce/label/c.BI_PSPB_SpevActionDose';
import PATIENT_INJECTION from '@salesforce/label/c.BI_PSPB_PatientInjection';
import PATIENT_INFUSION from '@salesforce/label/c.BI_PSPB_PatientInfusion';
import PREVENTION_INJECT from '@salesforce/label/c.BI_PSPB_PreventionInject';
import GPP_FLARE_SPEVINFU from '@salesforce/label/c.BI_PSPB_GppFlareInfusion';
import SPEVIGO_INFUSION from '@salesforce/label/c.BI_PSPB_SpevigoInfusion';
import GPP_SYMPTOMS from '@salesforce/label/c.BI_PSPB_GppSymptoms';
import GPP_FLARE_TREATMENT from '@salesforce/label/c.BI_PSPB_GppFlareTreatment';
import HEALTH_CENTER from '@salesforce/label/c.BI_PSP_HealthCenter';
import INTRAVENOUS from '@salesforce/label/c.BI_PSPB_Intravenous';
import EFISAYIL_TWO from '@salesforce/label/c.BI_PSPB_EffisayilTwo';
import SUBCUTANEOUS from '@salesforce/label/c.BI_PSPB_Subcutaneous';
import SELF_INJECTION from '@salesforce/label/c.BI_PSPB_SelfInjection';
import IL36 from '@salesforce/label/c.BI_PSPB_IlThirtySix';
import BLOCKING from '@salesforce/label/c.BI_PSPB_Blocking';
import ACTION from '@salesforce/label/c.BI_PSPB_Action';
import MECHANISM from '@salesforce/label/c.BI_PSPB_Mechanism';
import SPEVIGO_INJECTION from '@salesforce/label/c.BI_PSPB_SpevigoInjection';
import INFUSION from '@salesforce/label/c.BI_PSPB_Infusion';
import GPP_CONTAGIOUS from '@salesforce/label/c.BI_PSPB_GppContagious';
import GPP_SPREAD from '@salesforce/label/c.BI_PSPB_GppSpreadLabel';
import EXPLANING_GPP_LABEL from '@salesforce/label/c.BI_PSPB_ExplaningGppLabel';
import GPP_INTIMACY from '@salesforce/label/c.BI_PSP_GppIntimacy';
import GPP_DISCOMFORT from '@salesforce/label/c.BI_PSPB_GppDiscomfortLabel';
import GPP_COMORBIDITIES from '@salesforce/label/c.BI_PSPB_GppComorbiditiesLabel';
import COMORBIDITIES from '@salesforce/label/c.BI_PSPB_Comorbidities';
import LETTING_HCP from '@salesforce/label/c.BI_PSPB_LettingHcpLabel';
import CHECKLIST from '@salesforce/label/c.BI_PSP_Checklist';
import PREPARING_ADVANCE from '@salesforce/label/c.BI_PSP_PreparingAdvance';
import IMP_SIGNS from '@salesforce/label/c.BI_PSP_ImpSigns';
import EMERCARE from '@salesforce/label/c.BI_PSP_EmergencyCare';
import QS_ASK from '@salesforce/label/c.BI_PSP_QsAsk';
import TALKING_TO_HCP from '@salesforce/label/c.BI_PSP_TalkingToHcp';
import GPP_VISIT from '@salesforce/label/c.BI_PSP_GppVisit';
import SYMPTOM_LIST from '@salesforce/label/c.BI_PSP_SymptomList';
import GPP_TYPES from '@salesforce/label/c.BI_PSP_GppTypes';
import TREATMENT_HELP from '@salesforce/label/c.BI_PSP_TreatmentsHelp';
import SUPPORT_GPP from '@salesforce/label/c.BI_PSP_SupportGpp';
import MANAGE_GPP from '@salesforce/label/c.BI_PSP_ManageGpp';
import MANAGE_FLARES from '@salesforce/label/c.BI_PSP_Manageflares';
import MEDI_HELP from '@salesforce/label/c.BI_PSP_GetMediHelp';
import FLARES_CAUSES from '@salesforce/label/c.BI_PSP_FlaresAndCauses';
import EFFSAYIL_ONE from '@salesforce/label/c.BI_PSPB_EffsayilOne';
import GPP_QUES from '@salesforce/label/c.BI_PSP_GppQues';
import GPP_CARE from '@salesforce/label/c.BI_PSP_GppCare';
import GPP_PREG from '@salesforce/label/c.BI_PSP_GppPregnancy';
import TALK_PARTNER from '@salesforce/label/c.BI_PSP_TalkPartner';
import DISCOMFORT_STRING from '@salesforce/label/c.BI_PSP_Discomfort';
import INTIMACY_STR from '@salesforce/label/c.BI_PSP_IntimacyStr';
import PREGN_GPP from '@salesforce/label/c.BI_PSP_PregnancyGpp';
import HCP_INFO from '@salesforce/label/c.BI_PSP_HcpInfo';
import GPP_CHALLENGES from '@salesforce/label/c.BI_PSP_GppChallenges';
import GPP_DIAGNOSIS from '@salesforce/label/c.BI_PSP_GppDiagnosis';
import GPP_EXPERIENCES from '@salesforce/label/c.BI_PSP_GppExperiences';
import ACCEPTANCE_TREATMENT from '@salesforce/label/c.BI_PSP_AcceptanceTreatment';
import SCARPROCESS from '@salesforce/label/c.BI_PSP_Scarprocess';
import DEAL_STRING from '@salesforce/label/c.BI_PSP_DealString';
import SCAR_GPP from '@salesforce/label/c.BI_PSP_ScarGpp';
import PROTECT_GPP from '@salesforce/label/c.BI_PSP_ProtectGpp';
import GPP_COMPLICAT from '@salesforce/label/c.BI_PSP_GppComplicat';
import AVOID_COMPLICAT from '@salesforce/label/c.BI_PSP_AvoidComplicat';
import PREGNANCY_STR from '@salesforce/label/c.BI_PSP_Pregnancy';
import CHOICES_GPP from '@salesforce/label/c.BI_PSP_ChoicesGpp';
import GPP_EAT from '@salesforce/label/c.BI_PSP_GppEat';
import ACT_GPP from '@salesforce/label/c.BI_PSP_ActGpp';
import CHOICES from '@salesforce/label/c.BI_PSP_Choices';
import EATING from '@salesforce/label/c.BI_PSP_Eating';
import STIGMA from '@salesforce/label/c.BI_PSP_Stigma';
import CHALLENGES from '@salesforce/label/c.BI_PSP_ChallengesName';
import GETTING_SUPPORT from '@salesforce/label/c.BI_PSP_GettingSupport';
import DIAGNOSIS_METHOD from '@salesforce/label/c.BI_PSP_DiagnosisMethod';
import SHARE_EXPERI from '@salesforce/label/c.BI_PSP_ShareExperi';
import HOW_TO_TALK from '@salesforce/label/c.BI_PSP_HowToTalk';
import SHARING from '@salesforce/label/c.BI_PSP_Sharing';
import WHAT from '@salesforce/label/c.BI_PSP_What';
import WHY from '@salesforce/label/c.BI_PSP_Why';
import WHO_OF_GPP from '@salesforce/label/c.BI_PSP_WhoOfGpp';
import CAUSES_GPP from '@salesforce/label/c.BI_PSP_CausesGpp';
import CONTAGIOUSNESS from '@salesforce/label/c.BI_PSP_Contagiousness';
import EXPLAIN_TO_OTHERS from '@salesforce/label/c.BI_PSP_ExplainToOthers';
import FLARES from '@salesforce/label/c.BI_PSP_Flares';
import SYMPTOMS_TO_RECOGNIZE from '@salesforce/label/c.BI_PSP_SymptomsToRecognize';
import INCIDENCE from '@salesforce/label/c.BI_PSP_Incidence';
import MEAN_OF_RARE_GPP from '@salesforce/label/c.BI_PSP_MeanOfRareGpp';
import MEANING_OF_RARE from '@salesforce/label/c.BI_PSPB_MeaningOfRare';
import RARE_OF_GPP from '@salesforce/label/c.BI_PSP_RareOfGpp';
import PEOPLE_WITH_GPP from '@salesforce/label/c.BI_PSP_PeopleWithGpp';
import ACTIVITY_ETC from '@salesforce/label/c.BI_PSP_ActivityEtc';
import CARE from '@salesforce/label/c.BI_PSP_Care';
import TALK_GPP_TO_HCP from '@salesforce/label/c.BI_PSP_TalkGppToHcp';
import COLLEGUESETC from '@salesforce/label/c.BI_PSP_ColleguesExtra';
import HOW_TO from '@salesforce/label/c.BI_PSP_HowTo';
import ITS_TRIGGERS from '@salesforce/label/c.BI_PSP_ItsTriggers';
import GPP_CAUSES from '@salesforce/label/c.BI_PSP_GppCauses';
import TRIGGERS_FOR_GPP from '@salesforce/label/c.BI_PSP_TriggersForGpp';
import GPP_FEELINGS from '@salesforce/label/c.BI_PSP_GppFeelings';
import MANAGING_GPP from '@salesforce/label/c.BI_PSP_ManaginingGpp';
import TIPS_ON_GPP from '@salesforce/label/c.BI_PSP_TipsOnGpp';
import LIVING_WITH_GPP from '@salesforce/label/c.BI_PSP_LivingWithGpp';
import TIPS from '@salesforce/label/c.BI_PSP_Tips';
import MANAGE_FEELING_LABEL from '@salesforce/label/c.BI_PSPB_ManageFeelingsLabel';
import LIKE_ERROR from '@salesforce/label/c.BI_PSPB_LikeErrorMessage';
import DISLIKE_LABEL from '@salesforce/label/c.BI_PSP_Dislike';
import LIKE_LABEL from '@salesforce/label/c.BI_PSP_Like';
import REFERENCES from '@salesforce/label/c.BI_PSP_References';
import TAGS_LABEL from '@salesforce/label/c.BI_PSP_Tags';
import ERROR_PAGE from '@salesforce/label/c.BI_PSP_DisplayErrorPage';
import SPEVIGO_ARTICLES from '@salesforce/label/c.BI_PSPB_SpevigoArticles';
import PATIENT_TREATMENT_VIDEOS from '@salesforce/label/c.BI_PSPB_PatientTreatmentVideo';
import ARTICLES from '@salesforce/label/c.BI_PSPB_Articles';
import ARTICLE_CATEGORIES from '@salesforce/label/c.BI_PSPB_ArticleCategories';
import ARTICLE_LIKE_QUESTION from '@salesforce/label/c.BI_PSPB_ArticleLikeQuestion';
import ARTICLE_SEARCH_AVATAR_MESSAGE from '@salesforce/label/c.BI_PSPB_ArticleSearchAvatarMessage';
import INFO_CENTER_LANDING_MESSAGE from '@salesforce/label/c.BI_PSPB_InfoCenterLandMessage';
import INFO_CENTER_LANDING_DETAIL_MESSAGE from '@salesforce/label/c.BI_PSPB_InfoCenterLandDetailMessage';
import MINUTES from '@salesforce/label/c.BI_PSP_MinutesForChatter';
import PREVEIOUS from '@salesforce/label/c.BI_PSPB_Previous';
import NEXT from '@salesforce/label/c.BI_PSP_NextButton';
import LOAD_MORE from '@salesforce/label/c.BI_PSP_LoadMoreLabel';
import RECENT_ARTICLES from '@salesforce/label/c.BI_PSP_RecentArticles';
import VISUAL_LEARNING from '@salesforce/label/c.BI_PSPB_VisualLearningLabel';
import WATCH_LEARN from '@salesforce/label/c.BI_PSPB_WatchLearn';
import VIDEO_LANDING_MSG from '@salesforce/label/c.BI_PSPB_VideoLandingMsg';
import WATCH_VIDEO from '@salesforce/label/c.BI_PSPB_WatchVideoLabel';
import RELATED_ARTICLES from '@salesforce/label/c.BI_PSP_RelatedArticles';
import ARTICLES_FOR_YOU from '@salesforce/label/c.BI_PSP_ArticleForYouLabel';
import VISIT_INFORMATION_CENTER from '@salesforce/label/c.BI_PSP_VisitInformationCenterLabel';
export const LABELS = {
    VISIT_INFORMATION_CENTER,
    ARTICLES_FOR_YOU,
    RELATED_ARTICLES,
    WATCH_VIDEO,
    VIDEO_LANDING_MSG,
    WATCH_LEARN,
    VISUAL_LEARNING,
    RECENT_ARTICLES,
    LOAD_MORE,
    PREVEIOUS,
    NEXT,
    MINUTES,
    INFO_CENTER_LANDING_MESSAGE,
    INFO_CENTER_LANDING_DETAIL_MESSAGE,
    ARTICLE_SEARCH_AVATAR_MESSAGE,
    ARTICLE_LIKE_QUESTION,
    ARTICLE_CATEGORIES,
    PATIENT_TREATMENT_VIDEOS,
    ARTICLES,
    SPEVIGO_ARTICLES,
    ERROR_PAGE,
    TAGS_LABEL,
    REFERENCES,
    LIKE_LABEL,
    DISLIKE_LABEL,
    LIKE_ERROR,
    GPP_FLARE,
    GEN_CATEGORY,
    SOCIAL_LIFE_CATEGORY,
    MANAGEMENT_CATEGORY,
    MENTAL_HEALTH_CATEGORY,
    HEALTHY_LIFE_CATEGORY,
    SPEVIGO_CATEGORY,
    LANDING_PAGE,
    JUST_FOR_ME_CATEGORY,
    NO_SEARCH_RESULTS,
    BRANDED_URL,
    UNASSIGNED_URL,
    WHAT_GPP_LABEL,
    FACTS_GPP_LABEL,
    RARE_GPP_LABEL,
    WHY_DO_I_HAVE_GPP_LABEL,
    DIAGNOSIS_GPP_LABEL,
    GPP_CONTAGIOUS_LABEL,
    FRIENDS_FAMILY_LABEL,
    FEELING_EXCLUDED_LABEL,
    GPP_INTIMACY_LABEL,
    GPP_PREGNANCY_LABEL,
    MANAGE_FLARE_LABEL,
    GPP_COMORBIDITIES_LABEL,
    MANAGE_GPP_SYMPTOMS_LABEL,
    ASK_DOCTOR_LABEL,
    SEEK_MEDICARE_LABEL,
    SEEK_EMERGENCY_LABEL,
    MANAGE_SCARS_LABEL,
    COMPLICAT_GPP_LABEL,
    RECOGNIZING_FLARES_LABEL,
    VISIT_DOCTOR_LABEL,
    DERMATOLOGIST_LABEL,
    TALK_GPP_LABEL,
    NOT_ALONE_LABEL,
    POSITIVE_CHOICES_LABEL,
    TREATING_GPP_LABEL,
    SPEVIGO_INFUSION_LABEL,
    PREVENTION_GPP_LABEL,
    SPEVIGO_INJECTION_LABEL,
    WORK_IN_GPP_LABEL,
    CHRONIC_STATUS,
    CHRONIC_CATEGORY,
    ACUTE_CATEGORY,
    CHANNEL_NAME,
    ACUTE_STATUS,
    ARTICLE_STRING,
    FLARE_TREATMENT_CATEGORY,
    FLARE_PREVENTION_CATEGORY,
    WHAT_IS_GPP_LABEL,
    GPP_HEALTH_LABEL,
    TALK_HCP_LABEL,
    MANAGE_GPP_LABEL,
    FLARES_LABEL,
    ERROR_VARIANT,
    ERROR_MESSAGE,
    UNASSIGNED_STATUS,
    BRANDED_SITE_URL,
    UNASSIGNED_SITE_URL,
    DETAIL_PAGE,
    WHAT_GPP_MINS,
    FACTS_GPP_MINS,
    RARE_GPP_MINS,
    WHY_DO_I_HAVE_GPP_MINS,
    DIAGNOSIS_GPP_MINS,
    GPP_CONTAGIOUS_MINS,
    FRIENDS_FAMILY_MINS,
    FEELING_EXCLUDED_MINS,
    GPP_INTIMACY_MINS,
    GPP_PREGNANCY_MINS,
    MANAGE_FLARE_MINS,
    GPP_COMORBIDITIES_MINS,
    MANAGE_GPP_SYMPTOMS_MINS,
    ASK_DOCTOR_MINS,
    SEEK_MEDICARE_MINS,
    SEEK_EMERGENCY_MINS,
    MANAGE_SCARS_MINS,
    COMPLICAT_GPP_MINS,
    RECOGNIZING_FLARES_MINS,
    VISIT_DOCTOR_MINS,
    DERMATOLOGIST_MINS,
    TALK_GPP_MINS,
    NOT_ALONE_MINS,
    POSITIVE_CHOICES_MINS,
    TREATING_GPP_MINS,
    SPEVIGO_INFUSION_MINS,
    PREVENTION_GPP_MINS,
    SPEVIGO_INJECTION_MINS,
    WORK_IN_GPP_MINS,
    VIEW_LABEL,
    ENTER_EVENT,
    CATEGORY_PAGE,
    CHRONIC_VIDEO_PAGE,
    ACUTE_VIDEO_PAGE,
    SEARCH_PAGE,
    FLARE_TREATMENT_LABEL,
    FLARE_PREVENTION_LABEL,
    WHAT_IS_GPP_CATEGORY,
    MANAGE_GPP_CATEGORY,
    TALK_HCP_CATEGORY,
    GPP_HEALTH_CATEGORY,
    INTRODUCTION_CATEGORY,
    FLARES_CATEGORY,
    COMPLETE_STATUS
};
export const MINSMAP = {
    [WHAT_GPP_LABEL]: [WHAT_GPP_MINS],
    [FACTS_GPP_LABEL]: [FACTS_GPP_MINS],
    [RARE_GPP_LABEL]: [RARE_GPP_MINS],
    [WHY_DO_I_HAVE_GPP_LABEL]: [WHY_DO_I_HAVE_GPP_MINS],
    [DIAGNOSIS_GPP_LABEL]: [DIAGNOSIS_GPP_MINS],
    [GPP_CONTAGIOUS_LABEL]: [GPP_CONTAGIOUS_MINS],
    [FRIENDS_FAMILY_LABEL]: [FRIENDS_FAMILY_MINS],
    [FEELING_EXCLUDED_LABEL]: [FEELING_EXCLUDED_MINS],
    [GPP_INTIMACY_LABEL]: [GPP_INTIMACY_MINS],
    [GPP_PREGNANCY_LABEL]: [GPP_PREGNANCY_MINS],
    [MANAGE_FLARE_LABEL]: [MANAGE_FLARE_MINS],
    [GPP_COMORBIDITIES_LABEL]: [GPP_COMORBIDITIES_MINS],
    [MANAGE_GPP_SYMPTOMS_LABEL]: [MANAGE_GPP_SYMPTOMS_MINS],
    [ASK_DOCTOR_LABEL]: [ASK_DOCTOR_MINS],
    [SEEK_MEDICARE_LABEL]: [SEEK_MEDICARE_MINS],
    [SEEK_EMERGENCY_LABEL]: [SEEK_EMERGENCY_MINS],
    [MANAGE_SCARS_LABEL]: [MANAGE_SCARS_MINS],
    [COMPLICAT_GPP_LABEL]: [COMPLICAT_GPP_MINS],
    [RECOGNIZING_FLARES_LABEL]: [RECOGNIZING_FLARES_MINS],
    [VISIT_DOCTOR_LABEL]: [VISIT_DOCTOR_MINS],
    [DERMATOLOGIST_LABEL]: [DERMATOLOGIST_MINS],
    [TALK_GPP_LABEL]: [TALK_GPP_MINS],
    [NOT_ALONE_LABEL]: [NOT_ALONE_MINS],
    [POSITIVE_CHOICES_LABEL]: [POSITIVE_CHOICES_MINS],
    [TREATING_GPP_LABEL]: [TREATING_GPP_MINS],
    [SPEVIGO_INFUSION_LABEL]: [SPEVIGO_INFUSION_MINS],
    [PREVENTION_GPP_LABEL]: [PREVENTION_GPP_MINS],
    [SPEVIGO_INJECTION_LABEL]: [SPEVIGO_INJECTION_MINS],
    [WORK_IN_GPP_LABEL]: [WORK_IN_GPP_MINS]
}
export const SEARCH_ARTICLE_MAP = [
    {
    tagValue: [GPP_SYMPTOMS],
    articles: [WHAT_GPP_LABEL, RECOGNIZING_FLARES_LABEL, SEEK_EMERGENCY_LABEL, MANAGE_GPP_SYMPTOMS_LABEL, VISIT_DOCTOR_LABEL, SEEK_MEDICARE_LABEL, DERMATOLOGIST_LABEL]
    },
    {
        tagValue: [GPP_TREATMENT],
        articles: [DIAGNOSIS_GPP_LABEL, MANAGE_GPP_SYMPTOMS_LABEL, SEEK_MEDICARE_LABEL]
        },
    {
        tagValue: [GPP_QUES],
        articles: [WHAT_GPP_LABEL, FACTS_GPP_LABEL]
    },
    {
        tagValue: [CAUSES_GPP],
        articles: [FACTS_GPP_LABEL,WHY_DO_I_HAVE_GPP_LABEL]
    },
    {
        tagValue: [WHO_OF_GPP],
        articles: [FACTS_GPP_LABEL]
    },
    {
        tagValue: [GPP_CONTAGIOUS],
        articles: [FACTS_GPP_LABEL, GPP_CONTAGIOUS_LABEL]

    },
    {
        tagValue: [GPP_SPREAD],
        articles: [GPP_CONTAGIOUS_LABEL]
    },
    {
        tagValue: [EXPLANING_GPP_LABEL],
        articles: [GPP_CONTAGIOUS_LABEL, TALK_GPP_LABEL, FRIENDS_FAMILY_LABEL, GPP_INTIMACY_LABEL]
    },
    {
        tagValue: [SCAR_GPP],
        articles: [MANAGE_SCARS_LABEL]
    },
    {
        tagValue: [PROTECT_GPP],
        articles: [MANAGE_SCARS_LABEL]

    },
    {
        tagValue: [GPP_COMPLICAT],
        articles: [COMPLICAT_GPP_LABEL]
    },
    {
        tagValue: [GPP_PREG],
        articles: [COMPLICAT_GPP_LABEL, GPP_PREGNANCY_LABEL]

    },
    {
        tagValue: [GPP_FLARE],
        articles: [RECOGNIZING_FLARES_LABEL, SEEK_EMERGENCY_LABEL, MANAGE_GPP_SYMPTOMS_LABEL, SEEK_MEDICARE_LABEL]

    },
    {
        tagValue: [GPP_TYPES],
        articles: [RECOGNIZING_FLARES_LABEL, SEEK_EMERGENCY_LABEL]

    }
    ,
    {
        tagValue: [RARE_OF_GPP],
        articles: [RARE_GPP_LABEL]

    },
    {
        tagValue: [PEOPLE_WITH_GPP],
        articles: [RARE_GPP_LABEL]

    },
    {
        tagValue: [GPP_CAUSES],
        articles: [WHY_DO_I_HAVE_GPP_LABEL]

    },
    {
        tagValue: [TRIGGERS_FOR_GPP],
        articles: [WHY_DO_I_HAVE_GPP_LABEL]

    },
    {
        tagValue: [TALKING_TO_HCP],
        articles: [TALK_GPP_LABEL, GPP_PREGNANCY_LABEL, GPP_COMORBIDITIES_LABEL, VISIT_DOCTOR_LABEL, ASK_DOCTOR_LABEL]

    },
    {
        tagValue: [TIPS_ON_GPP],
        articles: [NOT_ALONE_LABEL]

    },
    {
        tagValue: [MANAGING_GPP],
        articles: [NOT_ALONE_LABEL]

    },
    {
        tagValue: [GPP_FEELINGS],
        articles: [NOT_ALONE_LABEL]

    },
    {
        tagValue: [GPP_EXPERIENCES],
        articles: [FRIENDS_FAMILY_LABEL]

    },
    {
        tagValue: [SHARING],
        articles: [FRIENDS_FAMILY_LABEL]

    },
    {
        tagValue: [GPP_DIAGNOSIS],
        articles: [DIAGNOSIS_GPP_LABEL]

    },
    {
        tagValue: [SUPPORT_GPP],
        articles: [DIAGNOSIS_GPP_LABEL, FEELING_EXCLUDED_LABEL, MANAGE_FLARE_LABEL, GPP_COMORBIDITIES_LABEL]

    },
    {
        tagValue: [GPP_CHALLENGES],
        articles: [FEELING_EXCLUDED_LABEL]

    },
    {
        tagValue: [CHOICES_GPP],
        articles: [POSITIVE_CHOICES_LABEL]

    },
    {
        tagValue: [GPP_EAT],
        articles: [POSITIVE_CHOICES_LABEL]

    },
    {
        tagValue: [ACT_GPP],
        articles: [POSITIVE_CHOICES_LABEL]

    },
    {
        tagValue: [GPP_CARE],
        articles: [GPP_PREGNANCY_LABEL]

    },
    {
        tagValue: [WHAT_COMORBIDITIES],
        articles: [GPP_COMORBIDITIES_LABEL]
    },
    {
        tagValue: [GPP_INTIMACY],
        articles: [GPP_INTIMACY_LABEL]

    },
    {
        tagValue: [GPP_DISCOMFORT],
        articles: [GPP_INTIMACY_LABEL]

    },
    {
        tagValue: [MANAGE_GPP],
        articles: [MANAGE_FLARE_LABEL]

    },
    {
        tagValue: [SUPPORT_GPP],
        articles: [MANAGE_FLARE_LABEL]

    },
    {
        tagValue: [GPP_COMORBIDITIES],
        articles: [GPP_COMORBIDITIES_LABEL]

    },
    {
        tagValue: [GPP_VISIT],
        articles: [VISIT_DOCTOR_LABEL,DERMATOLOGIST_LABEL]

    },
    {
        tagValue: [GPP_FLARE_TREATMENT],
        articles: [TREATING_GPP_LABEL]

    },
    {
        tagValue: [EFFSAYIL_ONE],
        articles: [TREATING_GPP_LABEL]

    },		{
        tagValue: [SPEVIGO_INFUSION],
        articles: [TREATING_GPP_LABEL]

    },	{
        tagValue: [QS_ASK],
        articles: [ASK_DOCTOR_LABEL]

    },	
    {
        tagValue: [SYMPTOM_LIST],
        articles: [VISIT_DOCTOR_LABEL]

    },
    {
        tagValue: [GPP_FLARE_PREVENTION],
        articles: [PREVENTION_GPP_LABEL]

    },
    {
        tagValue: [EFISAYIL_TWO],
        articles: [PREVENTION_GPP_LABEL]

    },
    {
        tagValue: [SPEVIGO_INJECTION],
        articles: [PREVENTION_GPP_LABEL]

    },		{
        tagValue: [INFUSION],
        articles: [SPEVIGO_INFUSION_LABEL]

    },		{
        tagValue: [HEALTH_CENTER],
        articles: [SPEVIGO_INFUSION_LABEL]

    },		{
        tagValue: [INTRAVENOUS],
        articles: [SPEVIGO_INFUSION_LABEL]

    },		{
        tagValue: [SUBCUTANEOUS],
        articles: [SPEVIGO_INJECTION_LABEL]

    },		{
        tagValue: [SELF_INJECTION],
        articles: [SPEVIGO_INJECTION_LABEL]

    },		{
        tagValue: [IL36],
        articles: [WORK_IN_GPP_LABEL]

    },		{
        tagValue: [BLOCKING],
        articles: [WORK_IN_GPP_LABEL]

    },		{
        tagValue: [ACTION],
        articles: [WORK_IN_GPP_LABEL]

    },{
        tagValue: [MECHANISM],
        articles: [WORK_IN_GPP_LABEL]
    },
    {
        tagValue: [FLARES_CAUSES],
        articles: [WHAT_GPP_LABEL]

    },
    {
        tagValue: [WHAT],
        articles: [FACTS_GPP_LABEL]

    },
    {
        tagValue: [WHY],
        articles: [FACTS_GPP_LABEL]

    },
    {
        tagValue: [WHO_OF_GPP],
        articles: [FACTS_GPP_LABEL]

    },
    {
        tagValue: [CONTAGIOUSNESS],
        articles: [GPP_CONTAGIOUS_LABEL]

    },
    {
        tagValue: [EXPLAIN_TO_OTHERS],
        articles: [GPP_CONTAGIOUS_LABEL]

    },
    {
        tagValue: [SCARPROCESS],
        articles: [MANAGE_SCARS_LABEL]

    },
    {
        tagValue: [DEAL_STRING],
        articles: [MANAGE_SCARS_LABEL]

    },
    {
        tagValue: [AVOID_COMPLICAT],
        articles: [COMPLICAT_GPP_LABEL]

    },
    {
        tagValue: [PREGNANCY_STR],
        articles: [COMPLICAT_GPP_LABEL]

    },
    {
        tagValue: [FLARES],
        articles: [RECOGNIZING_FLARES_LABEL]

    },
    {
        tagValue: [SYMPTOMS_TO_RECOGNIZE],
        articles: [RECOGNIZING_FLARES_LABEL]

    },
    {
        tagValue: [INCIDENCE],
        articles: [RARE_GPP_LABEL]

    },
    {
        tagValue: [MEAN_OF_RARE_GPP],
        articles: [RARE_GPP_LABEL]

    },
    {
        tagValue: [MEANING_OF_RARE],
        articles: [RARE_GPP_LABEL]

    },
    {
        tagValue: [ITS_TRIGGERS],
        articles: [WHY_DO_I_HAVE_GPP_LABEL]

    },
    {
        tagValue: [TALK_GPP_TO_HCP],
        articles: [TALK_GPP_LABEL]

    },
    {
        tagValue: [COLLEGUESETC],
        articles: [TALK_GPP_LABEL]

    },
    {
        tagValue: [HOW_TO],
        articles: [TALK_GPP_LABEL]

    },
    {
        tagValue: [LIVING_WITH_GPP],
        articles: [NOT_ALONE_LABEL]

    },
    {
        tagValue: [TIPS],
        articles: [NOT_ALONE_LABEL]

    },
    {
        tagValue: [MANAGE_FEELING_LABEL],
        articles: [NOT_ALONE_LABEL]

    },
    {
        tagValue: [SHARE_EXPERI],
        articles: [FRIENDS_FAMILY_LABEL]

    },
    {
        tagValue: [HOW_TO_TALK],
        articles: [FRIENDS_FAMILY_LABEL]

    },
    {
        tagValue: [DIAGNOSIS_METHOD],
        articles: [DIAGNOSIS_GPP_LABEL]

    },
    {
        tagValue: [ACCEPTANCE_TREATMENT],
        articles: [DIAGNOSIS_GPP_LABEL]

    },
    {
        tagValue: [STIGMA],
        articles: [FEELING_EXCLUDED_LABEL]

    },
    {
        tagValue: [CHALLENGES],
        articles: [FEELING_EXCLUDED_LABEL]

    },
    {
        tagValue: [GETTING_SUPPORT],
        articles: [FEELING_EXCLUDED_LABEL]

    },
    {
        tagValue: [CHOICES],
        articles: [POSITIVE_CHOICES_LABEL]

    },
    {
        tagValue: [EATING],
        articles: [POSITIVE_CHOICES_LABEL]

    },
    {
        tagValue: [ACTIVITY_ETC],
        articles: [POSITIVE_CHOICES_LABEL]

    },
    {
        tagValue: [PREGN_GPP],
        articles: [GPP_PREGNANCY_LABEL]

    },
    {
        tagValue: [CARE],
        articles: [GPP_PREGNANCY_LABEL]

    },
    {
        tagValue: [HCP_INFO],
        articles: [GPP_PREGNANCY_LABEL]

    },
    {
        tagValue: [INTIMACY_STR],
        articles: [GPP_INTIMACY_LABEL]

    },
    {
        tagValue: [TALK_PARTNER],
        articles: [GPP_INTIMACY_LABEL]

    },
    {
        tagValue: [DISCOMFORT_STRING],
        articles: [GPP_INTIMACY_LABEL]

    },
    {
        tagValue: [MANAGE_FLARES],
        articles: [MANAGE_FLARE_LABEL]

    },
    {
        tagValue: [MEDI_HELP],
        articles: [MANAGE_FLARE_LABEL]

    },
    {
        tagValue: [COMORBIDITIES],
        articles: [GPP_COMORBIDITIES_LABEL]

    },
    {
        tagValue: [LETTING_HCP],
        articles: [GPP_COMORBIDITIES_LABEL]

    },
    {
        tagValue: [RECOGNIZING_FLARES_LABEL],
        articles: [SEEK_EMERGENCY_LABEL]

    },
    {
        tagValue: [IMP_SIGNS],
        articles: [SEEK_EMERGENCY_LABEL]

    },
    {
        tagValue: [EMERCARE],
        articles: [SEEK_EMERGENCY_LABEL]

    },
    {
        tagValue: [RECOGNIZING_FLARES_LABEL],
        articles: [MANAGE_GPP_SYMPTOMS_LABEL]

    },
    {
        tagValue: [TREATMENT_HELP],
        articles: [MANAGE_GPP_SYMPTOMS_LABEL]

    },
    {
        tagValue: [RECOGNIZING_FLARES_LABEL],
        articles: [SEEK_MEDICARE_LABEL]

    },
    {
        tagValue: [IMP_SIGNS],
        articles: [SEEK_MEDICARE_LABEL]

    },
    {
        tagValue: [EMERCARE],
        articles: [SEEK_MEDICARE_LABEL]
    },
    {
        tagValue: [CHECKLIST],
        articles: [DERMATOLOGIST_LABEL]

    },
    {
        tagValue: [PREPARING_ADVANCE],
        articles: [DERMATOLOGIST_LABEL]

    },
    {
        tagValue: [GPP_FLARE_SPEVINFU],
        articles: [TREATING_GPP_LABEL]

    },
    {
        tagValue: [PREVENTION_INJECT],
        articles: [PREVENTION_GPP_LABEL]

    },
    {
        tagValue: [PATIENT_INFUSION],
        articles: [SPEVIGO_INFUSION_LABEL]

    },
    {
        tagValue: [PATIENT_INJECTION],
        articles: [SPEVIGO_INJECTION_LABEL]

    },
    {
        tagValue: [SPEV_ACTION_DOSE],
        articles: [WORK_IN_GPP_LABEL]

    }

]

export const TAGDATA = [
{
searchTermn: [GPP_TAG, FLARES_CAUSES],
standardItem: [
{ id: 1, title: GPP_SYMPTOMS },
{ id: 2, title: GPP_QUES }
]
},
{
searchTermn: [WHAT, WHY, WHO_OF_GPP],
standardItem: [
{ id: 3, title: GPP_QUES },
{ id: 4, title: CAUSES_GPP },
{ id: 5, title: GPP_CONTAGIOUS }
]
},
{
searchTermn: [CONTAGIOUSNESS, EXPLAIN_TO_OTHERS],
standardItem: [
{ id: 6, title: GPP_CONTAGIOUS },
{ id: 7, title: GPP_SPREAD },
{ id: 8, title: EXPLANING_GPP_LABEL }
]
},
{
searchTermn: [SCARPROCESS, DEAL_STRING],
standardItem: [
{ id: 9, title: SCAR_GPP },
{ id: 10, title: PROTECT_GPP }
]
},
{
searchTermn: [AVOID_COMPLICAT, PREGNANCY_STR],
standardItem: [
{ id: 11, title: GPP_COMPLICAT },
{ id: 12, title: GPP_PREG }
]
},
{
searchTermn: [FLARES, SYMPTOMS_TO_RECOGNIZE],
standardItem: [
{ id: 13, title: GPP_FLARE },
{ id: 14, title: GPP_SYMPTOMS },
{ id: 15, title: GPP_TYPES }
]
},
{
searchTermn: [INCIDENCE, MEAN_OF_RARE_GPP,MEANING_OF_RARE],
standardItem: [
{ id: 16, title: RARE_OF_GPP },
{ id: 17, title: PEOPLE_WITH_GPP }
]
},
{
searchTermn: [ITS_TRIGGERS],
standardItem: [
{ id: 18, title: GPP_CAUSES },
{ id: 19, title: TRIGGERS_FOR_GPP }
]
},
{
searchTermn: [TALK_GPP_TO_HCP, COLLEGUESETC, HOW_TO],
standardItem: [
{ id: 20, title: EXPLANING_GPP_LABEL },
{ id: 21, title: TALKING_TO_HCP }
]
},
{
searchTermn: [LIVING_WITH_GPP, TIPS, MANAGE_FEELING_LABEL],
standardItem: [
{ id: 22, title: TIPS_ON_GPP },
{ id: 23, title: MANAGING_GPP },
{ id: 24, title: GPP_FEELINGS }
]
},
{
searchTermn: [SHARE_EXPERI, HOW_TO_TALK],
standardItem: [
{ id: 25, title: GPP_EXPERIENCES },
{ id: 26, title: SHARING },
{ id: 27, title: EXPLANING_GPP_LABEL }
]
},
{
searchTermn: [DIAGNOSIS_METHOD, ACCEPTANCE_TREATMENT],
standardItem: [
{ id: 28, title: GPP_DIAGNOSIS },
{ id: 29, title: SUPPORT_GPP },
{ id: 30, title: GPP_TREATMENT }
]
},
{
searchTermn: [STIGMA, CHALLENGES, GETTING_SUPPORT],
standardItem: [
{ id: 31, title: SUPPORT_GPP },
{ id: 32, title: GPP_CHALLENGES }
]
},
{
searchTermn: [CHOICES, EATING, ACTIVITY_ETC],
standardItem: [
{ id: 33, title: CHOICES_GPP },
{ id: 34, title: GPP_EAT },
{ id: 35, title: ACT_GPP }
]
},
{
searchTermn: [PREGN_GPP, CARE, HCP_INFO],
standardItem: [
{ id: 36, title: GPP_PREG },
{ id: 37, title: GPP_CARE },
{ id: 38, title: TALKING_TO_HCP }
]
},
{
searchTermn: [INTIMACY_STR, TALK_PARTNER, DISCOMFORT_STRING],
standardItem: [
{ id: 39, title: GPP_INTIMACY },
{ id: 40, title: GPP_DISCOMFORT },
{ id: 41, title: EXPLANING_GPP_LABEL }
]
},
{
searchTermn: [MANAGE_FLARES, MEDI_HELP],
standardItem: [
{ id: 42, title: MANAGE_GPP },
{ id: 43, title: SUPPORT_GPP }
]
},
{
searchTermn: [COMORBIDITIES, LETTING_HCP,WHAT_COMORBIDITIES],
standardItem: [
{ id: 44, title: GPP_COMORBIDITIES },
{ id: 45, title: SUPPORT_GPP },
{ id: 46, title: TALKING_TO_HCP }
]
},
{
searchTermn: [IMP_SIGNS, EMERCARE],
standardItem: [
{ id: 47, title:  GPP_FLARE},
{ id: 48, title:  GPP_SYMPTOMS},
{ id: 49, title:  GPP_TYPES},
{ id: 50, title:  GPP_TREATMENT}

]
},
{
searchTermn: [TREATMENT_HELP],
standardItem: [
{ id: 50, title: GPP_FLARE },
{ id: 51, title: GPP_SYMPTOMS },
{ id: 52, title: GPP_TREATMENT }
]
},
{
searchTermn: [RECOGNIZING_FLARES_LABEL],
standardItem: [
{ id: 571, title: GPP_FLARE },
{ id: 581, title: GPP_SYMPTOMS },
{ id: 591, title: GPP_TREATMENT },
{ id: 491, title: GPP_TYPES }
]
},
{
searchTermn: [SYMPTOM_LIST],
standardItem: [
{ id: 53, title: GPP_SYMPTOMS },
{ id: 54, title: TALKING_TO_HCP },
{ id: 55, title: GPP_VISIT }
]
},
{
searchTermn: [QS_ASK],
standardItem: [{ id: 56, title: TALKING_TO_HCP }]
},

{
searchTermn: [CHECKLIST, PREPARING_ADVANCE],
standardItem: [
{ id: 58, title: GPP_SYMPTOMS },
{ id: 57, title:  GPP_VISIT}

]
},
{
searchTermn: [GPP_FLARE_SPEVINFU],
standardItem: [
{ id: 57, title: GPP_FLARE_TREATMENT },
{ id: 58, title: EFFSAYIL_ONE },
{ id: 59, title:  SPEVIGO_INFUSION}
]
},
{
searchTermn: [PREVENTION_INJECT],
standardItem: [
{ id: 57, title: GPP_FLARE_PREVENTION },
{ id: 58, title: EFISAYIL_TWO },
{ id: 59, title:  SPEVIGO_INJECTION}
]
},
{
searchTermn: [PATIENT_INFUSION],
standardItem: [
{ id: 57, title: INFUSION },
{ id: 58, title: INTRAVENOUS },
{ id: 59, title:  HEALTH_CENTER}
]
},
{
searchTermn: [PATIENT_INJECTION],
standardItem: [
{ id: 57, title: SELF_INJECTION },
{ id: 58, title: SUBCUTANEOUS },
]
},
{
searchTermn: [SPEV_ACTION_DOSE],
standardItem: [
{ id: 57, title: IL36 },
{ id: 58, title: BLOCKING },
{ id: 59, title:  MECHANISM},
{ id: 60, title:  ACTION.toLowerCase()}

]
},
{
searchTermn: [BLOCKING, ACTION, MECHANISM, IL36 ],
standardItem: [
{ id: 57, title: IL36 },
{ id: 58, title: BLOCKING },
{ id: 59, title:  MECHANISM},
{ id: 60, title:  ACTION.toLowerCase()}

]
},
{
searchTermn: [SUBCUTANEOUS,SELF_INJECTION],
standardItem: [
{ id: 57, title: SELF_INJECTION },
{ id: 58, title:  SUBCUTANEOUS}
]
},{
searchTermn: [HEALTH_CENTER,INTRAVENOUS, INFUSION],
standardItem: [
{ id: 57, title: HEALTH_CENTER },
{ id: 58, title: INTRAVENOUS },
{ id: 59, title: INFUSION }

]
},{
searchTermn: [SPEVIGO_INJECTION, EFISAYIL_TWO, GPP_FLARE_PREVENTION],
standardItem: [
{ id: 57, title: GPP_FLARE_PREVENTION},
{ id: 58, title: EFISAYIL_TWO },
{ id: 59, title: SPEVIGO_INJECTION }

]
},{
searchTermn: [SPEVIGO_INFUSION, EFFSAYIL_ONE, GPP_FLARE_TREATMENT],
standardItem: [
{ id: 57, title: SPEVIGO_INFUSION},
{ id: 58, title: EFFSAYIL_ONE },
{ id: 59, title: GPP_FLARE_TREATMENT }

]
},{
searchTermn: [GPP_VISIT],
standardItem: [
{ id: 57, title: GPP_SYMPTOMS},
{ id: 58, title:  TALKING_TO_HCP},
{ id: 59, title:  GPP_VISIT}

]
},{
searchTermn: [GPP_COMORBIDITIES],
standardItem: [
{ id: 57, title: GPP_COMORBIDITIES},
{ id: 58, title:  SUPPORT_GPP},
{ id: 59, title:  TALKING_TO_HCP}

]
},
{
searchTermn: [MANAGE_GPP],
standardItem: [
{ id: 57, title: MANAGE_GPP},
{ id: 58, title:  SUPPORT_GPP}						
]
},{
searchTermn: [GPP_DISCOMFORT, GPP_INTIMACY],
standardItem: [
{ id: 57, title: GPP_DISCOMFORT},
{ id: 58, title:  GPP_INTIMACY},
{ id: 59, title:  EXPLANING_GPP_LABEL}

]
},{
searchTermn: [GPP_CARE],
standardItem: [
{ id: 57, title: GPP_PREG},
{ id: 58, title:  TALKING_TO_HCP},
{ id: 59, title:  GPP_CARE}

]
},{
searchTermn: [ACT_GPP,CHOICES_GPP,GPP_EAT],
standardItem: [
{ id: 57, title: CHOICES_GPP},
{ id: 58, title:  GPP_EAT},
{ id: 59, title:  ACT_GPP}

]
},{
searchTermn: [GPP_CHALLENGES],
standardItem: [
{ id: 57, title: GPP_CHALLENGES},
{ id: 58, title:  SUPPORT_GPP}
]
},{
searchTermn: [GPP_TREATMENT],
standardItem: [
{ id: 57, title: GPP_TREATMENT},
{ id: 58, title:  GPP_DIAGNOSIS},
{ id: 59, title:  SUPPORT_GPP},
{ id: 60, title:  GPP_FLARE},
{ id: 61, title:  GPP_SYMPTOMS}

]
},{
searchTermn: [SUPPORT_GPP],
standardItem: [
{ id: 57, title: GPP_DIAGNOSIS},
{ id: 58, title:  SUPPORT_GPP},
{ id: 59, title:  GPP_TREATMENT},
{ id: 60, title:  MANAGE_GPP},
{ id: 61, title:  GPP_COMORBIDITIES},
{ id: 62, title:  TALKING_TO_HCP},
{ id: 63, title:  GPP_CHALLENGES}



]
},{
searchTermn: [GPP_DIAGNOSIS],
standardItem: [
{ id: 57, title: GPP_DIAGNOSIS},
{ id: 58, title:  SUPPORT_GPP},
{ id: 59, title:  GPP_TREATMENT}
]
},{
searchTermn: [SHARING, GPP_EXPERIENCES],
standardItem: [
{ id: 57, title: SHARING},
{ id: 58, title:  GPP_EXPERIENCES},
{ id: 59, title:  EXPLANING_GPP_LABEL}
]
},{
searchTermn: [GPP_FEELINGS, MANAGING_GPP,TIPS_ON_GPP],
standardItem: [
{ id: 57, title: GPP_FEELINGS},
{ id: 58, title:  MANAGING_GPP},
{ id: 59, title:  TIPS_ON_GPP}
]
},{
searchTermn: [TALKING_TO_HCP],
standardItem: [
{ id: 57, title: EXPLANING_GPP_LABEL},
{ id: 58, title:  TALKING_TO_HCP},
{ id: 59, title:  GPP_PREG},
{ id: 60, title: GPP_COMORBIDITIES},
{ id: 61, title:  GPP_CARE},
{ id: 62, title:  SUPPORT_GPP},
{ id: 63, title: GPP_SYMPTOMS},
{ id: 64, title:  GPP_VISIT}																		]
},{
searchTermn: [EXPLANING_GPP_LABEL],
standardItem: [
{ id: 57, title: GPP_CONTAGIOUS},
{ id: 58, title:  GPP_SPREAD},
{ id: 59, title:  EXPLANING_GPP_LABEL},
{ id: 60, title: TALKING_TO_HCP},
{ id: 61, title:  GPP_EXPERIENCES},
{ id: 62, title:  SHARING},
{ id: 63, title: GPP_INTIMACY},
{ id: 64, title:  GPP_DISCOMFORT}																		]
},{
searchTermn: [TRIGGERS_FOR_GPP, GPP_CAUSES],
standardItem: [
{ id: 57, title: GPP_CAUSES},
{ id: 58, title:  TRIGGERS_FOR_GPP}
]
},{
searchTermn: [PEOPLE_WITH_GPP, RARE_OF_GPP],
standardItem: [
{ id: 57, title: PEOPLE_WITH_GPP},
{ id: 58, title:  RARE_OF_GPP}
]
},
{
searchTermn: [GPP_TYPES],
standardItem: [
{ id: 57, title: GPP_FLARE},
{ id: 58, title:  GPP_TYPES},
{ id: 59, title:  GPP_SYMPTOMS}

]
},
{
searchTermn: [GPP_FLARE],
standardItem: [
{ id: 57, title: GPP_FLARE},
{ id: 58, title:  GPP_SYMPTOMS},
{ id: 59, title:  GPP_TYPES},
{ id: 60, title:  GPP_TREATMENT}
]
},
{
searchTermn: [PREGN_GPP],
standardItem: [
{ id: 57, title: GPP_COMPLICAT},
{ id: 58, title:  PREGN_GPP},
{ id: 60, title:  TALK_GPP_TO_HCP}
]
},
{
searchTermn: [GPP_COMPLICAT],
standardItem: [
{ id: 57, title: GPP_COMPLICAT},
{ id: 58, title:  GPP_PREG}
]
},
{
searchTermn: [SCAR_GPP,PROTECT_GPP],
standardItem: [
{ id: 57, title: SCAR_GPP},
{ id: 58, title:  PROTECT_GPP}
]
},
{
searchTermn: [GPP_SPREAD],
standardItem: [
{ id: 57, title: GPP_CONTAGIOUS},
{ id: 58, title:  GPP_SPREAD},
{ id: 59, title: EXPLANING_GPP_LABEL}
]
},
{
searchTermn: [GPP_CONTAGIOUS],
standardItem: [
{ id: 57, title: GPP_QUES},
{ id: 58, title:  CAUSES_GPP},
{ id: 59, title: GPP_CONTAGIOUS},
{ id: 59, title: GPP_SPREAD},
{ id: 59, title: EXPLANING_GPP_LABEL}

]
},
{
searchTermn: [CAUSES_GPP],
standardItem: [
{ id: 57, title: CAUSES_GPP},
{ id: 58, title:  GPP_CONTAGIOUS},
{ id: 59, title: GPP_QUES}
]
},
{
searchTermn: [GPP_QUES],
standardItem: [
{ id: 57, title: GPP_SYMPTOMS},
{ id: 58, title:  CAUSES_GPP},
{ id: 59, title: GPP_QUES},
{ id: 60, title: GPP_CONTAGIOUS}

]
},
{
searchTermn: [GPP_PREG],
standardItem: [
{ id: 57, title: GPP_COMPLICAT},
{ id: 58, title:  GPP_PREG},
{ id: 59, title: GPP_CARE},
{ id: 60, title: TALKING_TO_HCP}

]
},
{
searchTermn: [GPP_SYMPTOMS],
standardItem: [
{ id: 57, title: GPP_SYMPTOMS},
{ id: 58, title:  GPP_QUES},
{ id: 59, title: GPP_FLARE},
{ id: 60, title: GPP_TYPES},
{ id: 61, title: GPP_TREATMENT},
{ id: 62, title: TALKING_TO_HCP},
{ id: 63, title: GPP_VISIT}

]
}
];
export default class BiPspbLabelForInfoCenter extends LightningElement {}