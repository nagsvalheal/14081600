import Id from '@salesforce/user/Id';
//To Import The Static Resources
import DEFAULT_AVATAR_NAVIGATION from '@salesforce/resourceUrl/BI_PSPB_DefaultAvatarNavigation';
//To Import the Custom Labels
import ERROR_VARIANT from '@salesforce/label/c.BI_PSP_ErrorVariantToast';
import BR_SITE_URL from '@salesforce/label/c.BI_PSPB_BrandedSiteNaviUrl';
import ERROR_MESSAGE from '@salesforce/label/c.BI_PSP_ConsoleError';
import AVATAR_QUESTIONNAIRE_TWO_URL from '@salesforce/label/c.BI_PSP_AvatarQuestionnaireTwoUrl';
import AVATAR_QUESTIONNAIRE_URL from '@salesforce/label/c.BI_PSP_AvatarQuestionnaireUrl';
import OUTSTANDING_QUESTIONNAIRE_URL from '@salesforce/label/c.BI_PSPB_OutstndngPageUrl';
import LETS_PERSONALIZE_URL from '@salesforce/label/c.BI_PSPB_LetsPersonalizeUrl';
import DLQI_QUESTIONNAIRE_URL from '@salesforce/label/c.BI_PSPB_DlqiQuestionnaireUrl';
import PSS_QUESTIONNAIRE_URL from '@salesforce/label/c.BI_PSPB_PsoriasisQuesUrl';
import WAPI_QUESTIONNAIRE_URL from '@salesforce/label/c.BI_PSPB_WapiQuestionnaire';
import QSQ_TWOMONTHS_URL from '@salesforce/label/c.BI_PSPB_QualitativeTwoMonths';
import QSQ_FOURTEENWEEKS_URL from '@salesforce/label/c.BI_PSPB_FourteenWeeks';
import WAPI_COMPLETED from '@salesforce/label/c.BI_PSPB_WapiCompletedQuestionnaire';
import PSS_COMPLETED_URL from '@salesforce/label/c.BI_PSPB_PsoriasisCompletedQuesUrl';
import DLQI_COMPLETED_URL from '@salesforce/label/c.BI_PSPB_DlqiCompletedUrl';
import QSQ_TWOMONTHS_COMPLETED_URL from '@salesforce/label/c.BI_PSPB_QualitativeTwoMonthsCompletedUrl';
import QSQ_FOURTEENWEEKS_COMPLETED_URL from '@salesforce/label/c.BI_PSPB_QualitativeFourteenwksCompletedUrl';
import PATIENT_FIRST_AVATAR from '@salesforce/label/c.BI_PSPB_PatientFirstAvatar';
import DLQI_CATEGORY from '@salesforce/label/c.BI_PSP_DlqiCategory';
import PSS_CATEGORY from '@salesforce/label/c.BI_PSP_PssCategory';
import WAPI_CATEGORY from '@salesforce/label/c.BI_PSP_WapiCategory';
import XP_VALUE from '@salesforce/label/c.BI_PSPB_XpValue';
import SUMMARY_URL from '@salesforce/label/c.BI_PSPB_SummaryUrl';
import EXPIRED from '@salesforce/label/c.BI_PSP_Expired';
import COMPLETE from '@salesforce/label/c.BI_PSP_Complete';
import IN_PROGRESS from '@salesforce/label/c.BI_PSP_InProgressTxt';
import COMPLETED_LABEL from '@salesforce/label/c.BI_PSP_Completed';
import QUALITATIVE_LABEL from '@salesforce/label/c.BI_PSP_QualitativeCategory';

import SUMMARY_WPAI from '@salesforce/label/c.BI_PSP_SummaryWpai';
import WPAIN_VALUE from '@salesforce/label/c.BI_PSPB_WpaiValue';
import WPAIN_VALUE_THREE from '@salesforce/label/c.BI_PSPB_WapiValueThree';
import QUES_ON_PAGE from '@salesforce/label/c.BI_PSPB_QuesOnPage';
import DLQI_CATEGERY from '@salesforce/label/c.BI_PSP_DlqiCategory';
import QUES_MOB_ONE from '@salesforce/label/c.BI_PSPB_QuesMobOne';
import QUES_MOB_TWO from '@salesforce/label/c.BI_PSPB_QuesValueTwo';
import QUES_MOB_THREE from '@salesforce/label/c.BI_PSPB_QuesValueThree';
import QUES_VALUE_FOUR from '@salesforce/label/c.BI_PSPB_QuesValueFour';
import QUES_VALUE_FIVE from '@salesforce/label/c.BI_PSPB_QuesValueFive';
import QUES_VALUE_SIX from '@salesforce/label/c.BI_PSPB_QuesValueSix';
import QUES_VALUE_SEVEN from '@salesforce/label/c.BI_PSPB_QuesValueSeven';
import QUES_VALUE_EIGHT from '@salesforce/label/c.BI_PSPB_QuesValueEight';
import QUES_VALUE_NINE from '@salesforce/label/c.BI_PSPB_QuesValueNine';
import THE_GRAPH_VALUE from '@salesforce/label/c.BI_PSPB_TheGraphValue';
import SELECT_PATIENT_VALUE from '@salesforce/label/c.BI_PSPB_SelectPatientValue';
import SELECT_MOB_ONE from '@salesforce/label/c.BI_PSPB_SelectMobOne';
import SELECT_MOB_TWO from '@salesforce/label/c.BI_PSPB_SelectMobTwo';
import SELECT_PATIENT_ONE from '@salesforce/label/c.BI_PSPB_SelectPatientOne';
import PERSONALIZE_MSG_ONE from '@salesforce/label/c.BI_PSPB_PersonalizeMsgOne';
import LETS_PERSONAL_MOB_ONE from '@salesforce/label/c.BI_PSPB_LetsPersonalMobTwo';
import LETS_PERSONAL_MOB_TWO from '@salesforce/label/c.BI_PSPB_LetsPersonalMobTwo';
import WE_WANT_LEARN from '@salesforce/label/c.BI_PSPB_WeLearn';
import YOUR_SELF from '@salesforce/label/c.BI_PSPB_PersonalizeYourSelf';
import KNOW_YOUR from '@salesforce/label/c.BI_PSPB_KnowYour';
import QUESOUTSTAND_VALUE_TWO from '@salesforce/label/c.BI_PSPB_OutstandingValueTwo';
import QUESOUTSTAND_VALUE_SIX from '@salesforce/label/c.BI_PSPB_OutstandingValueSix';
import QUESOUTSTAND_VALUE_THREE from '@salesforce/label/c.BI_PSPB_OutstandingValueThree';
import QUESOUTSTAND_VALUE_FOUR from '@salesforce/label/c.BI_PSPB_OutstandingValueFour';
import AIM_DERMATOLOGY from '@salesforce/label/c.BI_PSPB_AimDermatology';
import PERSONALIZE_MOB from '@salesforce/label/c.BI_PSPB_PersonalizeMob';
import PERSONALIZE_VALUE_ONE from '@salesforce/label/c.BI_PSPB_PsoriasisValueOne';
import MONTHS_TWO from '@salesforce/label/c.BI_PSPB_TwoMonthsTwo';
import COME_BACK from '@salesforce/label/c.BI_PSPB_ComeBack';
import COMPLETED_MOB_QUES from '@salesforce/label/c.BI_PSPB_WapiCompletedQuestionnaire';
import WPAI_VALUE_FOUR from '@salesforce/label/c.BI_PSPB_WapiValueFour';
import PSORIUS_MOB_THREE from '@salesforce/label/c.BI_PSPB_PsoriasisMobThree';
import PSORIUS_VALUE_TWO from '@salesforce/label/c.BI_PSPB_PsoriasisValueTwo';
import QUES_VALUE_ONE from '@salesforce/label/c.BI_PSPB_QuestionnaireValueOne';
import QUES_HERE from '@salesforce/label/c.BI_PSPB_QuestionaireHere';
import STATISFATION_HERE from '@salesforce/label/c.BI_PSPB_SatisfactionHere';
import STATISFATION_HERE_MOB from '@salesforce/label/c.BI_PSPB_SatisfationHereMob';
import WPAI_MOB_TWO from '@salesforce/label/c.BI_PSPB_WapiMobTwo';
import WORK_PRODUCT from '@salesforce/label/c.BI_PSPB_WorkProduct';
import QUES_PROBLEM from '@salesforce/label/c.BI_PSPB_QuesProblem';
import AIM_GRAPH from '@salesforce/label/c.BI_PSPB_AimGraph';
import WPAI_PUSTULAR from '@salesforce/label/c.BI_PSPB_WpaiPustular';
import WPAI_RESPONCE from '@salesforce/label/c.BI_PSPB_WpaiResponce';
import LISTED_PEOPLE from '@salesforce/label/c.BI_PSPB_ListedPeople';
import LISTED_QUESTIONAIRE from '@salesforce/label/c.BI_PSPB_ListedQuestionaire';
import YOU_SUBMIT from '@salesforce/label/c.BI_PSPB_YouSubmit';
import KNOW_RESULT from '@salesforce/label/c.BI_PSPB_KnowResults';
import KNOW_RESULT_DOCTER from '@salesforce/label/c.BI_PSPB_KnowResultDocter';
import AIM_DLQI from '@salesforce/label/c.BI_PSPB_AimDlqi';
import AIM_DLQI_LAST from '@salesforce/label/c.BI_PSPB_AimOverLast';
import AIM_QUES from '@salesforce/label/c.BI_PSPB_AimQues';
import AIM_DRAFT_SUBMIT from '@salesforce/label/c.BI_PSPB_AimDraftSubmit';
import UNDEFINED from '@salesforce/label/c.BI_PSP_Undefined';
import NO from '@salesforce/label/c.BI_PSPB_No';
import QUALITY_SATISFACTION from '@salesforce/label/c.BI_PSPB_QualitySatisfaction';

export const resource = {
    Id,
    DEFAULT_AVATAR_NAVIGATION,
    ERROR_VARIANT,
    BR_SITE_URL,
ERROR_MESSAGE,
AVATAR_QUESTIONNAIRE_TWO_URL ,
AVATAR_QUESTIONNAIRE_URL ,
OUTSTANDING_QUESTIONNAIRE_URL,
LETS_PERSONALIZE_URL ,
DLQI_QUESTIONNAIRE_URL ,
PSS_QUESTIONNAIRE_URL ,
WAPI_QUESTIONNAIRE_URL ,
QSQ_TWOMONTHS_URL ,
QSQ_FOURTEENWEEKS_URL ,
WAPI_COMPLETED ,
PSS_COMPLETED_URL ,
DLQI_COMPLETED_URL,
QSQ_TWOMONTHS_COMPLETED_URL ,
QSQ_FOURTEENWEEKS_COMPLETED_URL ,
PATIENT_FIRST_AVATAR ,
DLQI_CATEGORY ,
PSS_CATEGORY ,
WAPI_CATEGORY ,
XP_VALUE ,
SUMMARY_URL ,
EXPIRED ,
COMPLETE ,
IN_PROGRESS ,
COMPLETED_LABEL ,
QUALITATIVE_LABEL,
SUMMARY_WPAI ,
WPAIN_VALUE,
WPAIN_VALUE_THREE ,
QUES_ON_PAGE ,
DLQI_CATEGERY ,
QUES_MOB_ONE ,
QUES_MOB_TWO ,
QUES_MOB_THREE ,
QUES_VALUE_FOUR ,
QUES_VALUE_FIVE ,
QUES_VALUE_SIX ,
QUES_VALUE_SEVEN ,
QUES_VALUE_EIGHT,
QUES_VALUE_NINE ,
THE_GRAPH_VALUE ,
SELECT_PATIENT_VALUE,
SELECT_MOB_ONE ,
SELECT_MOB_TWO ,
SELECT_PATIENT_ONE ,
PERSONALIZE_MSG_ONE ,
LETS_PERSONAL_MOB_ONE,
LETS_PERSONAL_MOB_TWO ,
WE_WANT_LEARN,
YOUR_SELF ,
KNOW_YOUR ,
QUESOUTSTAND_VALUE_TWO ,
QUESOUTSTAND_VALUE_SIX ,
QUESOUTSTAND_VALUE_THREE ,
QUESOUTSTAND_VALUE_FOUR ,
AIM_DERMATOLOGY ,
PERSONALIZE_MOB ,
PERSONALIZE_VALUE_ONE ,
MONTHS_TWO ,
COME_BACK ,
COMPLETED_MOB_QUES ,
WPAI_VALUE_FOUR ,
PSORIUS_MOB_THREE ,
PSORIUS_VALUE_TWO ,
QUES_VALUE_ONE ,
QUES_HERE ,
STATISFATION_HERE ,
STATISFATION_HERE_MOB,
WPAI_MOB_TWO ,
WORK_PRODUCT ,
QUES_PROBLEM ,
AIM_GRAPH ,
WPAI_PUSTULAR ,
WPAI_RESPONCE ,
LISTED_PEOPLE ,
LISTED_QUESTIONAIRE ,
YOU_SUBMIT,
KNOW_RESULT,
KNOW_RESULT_DOCTER ,
AIM_DLQI ,
AIM_DLQI_LAST ,
AIM_QUES ,
AIM_DRAFT_SUBMIT ,
UNDEFINED ,
NO ,
QUALITY_SATISFACTION ,
}