// Importing Static Resources
import NOVICE_IMAGE from '@salesforce/resourceUrl/BI_PSP_NoviceImage';
import BEGINNER_IMAGE from '@salesforce/resourceUrl/BI_PSP_BeginnerImage';
import INTERMEDIATE_IMAGE from '@salesforce/resourceUrl/BI_PSP_IntermediateImage';
import PROFICIENT_IMAGE from '@salesforce/resourceUrl/BI_PSP_ProficientImage';
import EXPERT_IMAGE from '@salesforce/resourceUrl/BI_PSP_ExpertImage';
import CELEBRATION from '@salesforce/resourceUrl/BI_PSP_Celebration';
import CRO_ICON from '@salesforce/resourceUrl/BI_PSP_CrossIcon';
import ACTIVE_NO from '@salesforce/resourceUrl/BI_PSP_ActiveNo';
import CHALLENGE_ARROW_SMALL from '@salesforce/resourceUrl/BI_PSP_ChallengeArrowSmall';
import CHALLENGE_ARROW_LARGE from '@salesforce/resourceUrl/BI_PSP_ChallengeArrowLarge';
import WIDGET from '@salesforce/resourceUrl/BI_PSP_ChallengeWidget';
import NOVICE_STAR from '@salesforce/resourceUrl/BI_PSP_NoviceImageNoStar';
import BEGINNER_STAR from '@salesforce/resourceUrl/BI_PSP_BeginnerImageNoStar';
import INTERMEDIATE_STAR from '@salesforce/resourceUrl/BI_PSP_IntermediateImageNoStar';
import PROFICIENT_STAR from '@salesforce/resourceUrl/BI_PSP_ProficientImageNoStar';
import EXPERT_STAR from '@salesforce/resourceUrl/BI_PSP_ExpertImageNoStar';

// Importing Custom Labels
import ERROR_MESSAGES from '@salesforce/label/c.BI_PSP_ConsoleError';
import ERROR_VARIANT from '@salesforce/label/c.BI_PSP_ErrorVariantToast';
import LABLE_STATUS_ACTIVE from '@salesforce/label/c.BI_PSPB_Active';
import LABLE_STATUS_COMPLETED from '@salesforce/label/c.BI_PSPB_ChallengeCompleted';
import LABLE_AVAILABLE from '@salesforce/label/c.BI_PSP_AvailableLabel';
import RANK_LEVEL_ONE from '@salesforce/label/c.BI_PSP_RankLevelOne';
import RANK_LEVEL_TWO from '@salesforce/label/c.BI_PSP_RankLevelTwo';
import RANK_LEVEL_THREE from '@salesforce/label/c.BI_PSP_RankLevelThree';
import RANK_LEVEL_FOUR from '@salesforce/label/c.BI_PSP_RankLevelFour'
import RANK_LEVEL_FIVE from '@salesforce/label/c.BI_PSP_RankLevelFive';
import RANK_LEVEL_SIX from '@salesforce/label/c.BI_PSP_RankLevelSix';
import CH_RANK_TWO from '@salesforce/label/c.BI_PSP_RankTwo';
import CH_RANK_THREE from '@salesforce/label/c.BI_PSP_RankThree';
import CH_RANK_FOUR from '@salesforce/label/c.BI_PSP_RankFour';
import CH_RANK_FIVE from '@salesforce/label/c.BI_PSP_RankFive';
import CH_RANK_SIX from '@salesforce/label/c.BI_PSP_RankSix';
import BR_SITE_URL from '@salesforce/label/c.BI_PSPB_BrandedSiteNaviUrl';
import BR_TROPHY_CASE_SITE_URL from '@salesforce/label/c.BI_PSP_TrophyPageUrl';
import ERR_MSG_PL from '@salesforce/label/c.BI_PSP_ErrorMsgPi';
import EXPERT_GPP from '@salesforce/label/c.BI_PSP_ExpertGpp';
import BEGINNER_GPP from '@salesforce/label/c.BI_PSP_BeginnerGpp';
import INTERMEDIATE_GPP from '@salesforce/label/c.BI_PSP_IntermediateGpp';
import NOVICE_GPP from '@salesforce/label/c.BI_PSP_NoviceGpp';
import PROFICIENT_GPP from '@salesforce/label/c.BI_PSP_ProficientGppChallenges';
import NOVICE_GPPS from '@salesforce/label/c.BI_PSP_Novice';
import BEGINNER from '@salesforce/label/c.BI_PSP_Beginner';
import INTERMEDIATE from '@salesforce/label/c.BI_PSP_Intermediate';
import PROFICIENT from '@salesforce/label/c.BI_PSP_Proficient';
import EXPERT from '@salesforce/label/c.BI_PSP_Expert';
import BRANDED_URL from '@salesforce/label/c.BI_PSPB_SiteLabel';
import UNASSIGNED_URL from '@salesforce/label/c.BI_PSPB_UnAssignedLabel';
import SLASH_URL from '@salesforce/label/c.BI_PSP_ChatterSlash';
import SLASH_SITEURL from '@salesforce/label/c.BI_PSP_SlashSiteUrl';
import BRANDED_CHALLENGES_SITEURL from '@salesforce/label/c.BI_PSP_ChallengesNaviUrl';
import TOTAL_XP from '@salesforce/label/c.BI_PSP_TotalXp';


import BEING_ACTIVE from '@salesforce/label/c.BI_PSPB_BeingActive';
import TRACK_YOUR_ANSWER from '@salesforce/label/c.BI_PSPB_TrackYourAnswer';
import LINKARTICLE from '@salesforce/label/c.BI_PSPB_LinkArticle';
import GPPWORKLIFELINK from '@salesforce/label/c.BI_PSPB_GppWorkLifeLink';
import GPPSYMPTOMSLINK from '@salesforce/label/c.BI_PSPB_GppSymptomsLink';
import GPPQUALITYLIFELINK from '@salesforce/label/c.BI_PSPB_GppQualityLife';
import QUESTONNAIREVAL from '@salesforce/label/c.BI_PSPB_QuestionnaireLink';
import ACCEPTCHALLENGEBUTTON from '@salesforce/label/c.BI_PSPB_AcceptChallengeButton';
import COMPLETECHALLENGEBUTTON from '@salesforce/label/c.BI_PSPB_CompleteChallengeButton';

import CHALLENGE_UNDERSTANDING from '@salesforce/label/c.BI_PSPB_ChallengesUnderstanding';
import CHALLENGES from '@salesforce/label/c.BI_PSPB_Challenge';
import START_CHALLENGE from '@salesforce/label/c.BI_PSPB_StartChallenge';
import AVAILABLE_CHALLENGES from '@salesforce/label/c.BI_PSPB_AvailableChallenges';
import COMPLETED_CHALLENGES from '@salesforce/label/c.BI_PSPB_AlreadyCompletedChallenges';
import VIEW_TROPHIES from '@salesforce/label/c.BI_PSPB_ViewTrophies';
import CHALLENGES_LIMIT from '@salesforce/label/c.BI_PSPB_ChallengesLimit';
import CHALLENGES_XP from '@salesforce/label/c.BI_PSPB_ChallengesXp';
import XP_TILL_LEVEL from '@salesforce/label/c.BI_PSPB_XpTillLevel';
import BI_PSP_DISPLAYERRORPAGE from '@salesforce/label/c.BI_PSP_DisplayErrorPage';
import BRSITE_URL from '@salesforce/label/c.BI_PSPB_BrandedSiteNaviUrl';

import TROPHY_CASE from '@salesforce/label/c.BI_PSPB_TropyCase';
import CHALLENGES_COMPLETED from '@salesforce/label/c.BI_PSPB_CompletedChallenges';
import CHALLENGES_NOT_COMPLETED from '@salesforce/label/c.BI_PSPB_ChallengesNotCompleted';
import LOAD_MORE from '@salesforce/label/c.BI_PSPB_LoadMore';
import LOAD_LESS from '@salesforce/label/c.BI_PSPB_LoadLess';

import CHALLENGES_REACH from '@salesforce/label/c.BI_PSPB_ChallengesReach';
import LEVEL from '@salesforce/label/c.BI_PSPB_Level';
import CHALLENGES_MAX_LEVEL from '@salesforce/label/c.BI_PSPB_ChallengesMaxLevel';
import CHALLENGES_EXCELLENT from '@salesforce/label/c.BI_PSPB_ChallengesExcellent';
import ACTIVE_CHALLENGES from '@salesforce/label/c.BI_PSPB_ActiveChallenges';
import NO_ACTIVE_CHALLENGES from '@salesforce/label/c.BI_PSPB_NoActiveChallenges';
import ACCEPT_CHALLENGE from '@salesforce/label/c.BI_PSPB_AcceptChallenge';
import NO_AVAILABLE_CHALLENGE from '@salesforce/label/c.BI_PSPB_NoAvailableChallenges';
import COMPLETE_CHALLENGE_POINTS from '@salesforce/label/c.BI_PSPB_CompleteChallengePoints';
import CONGRATULATIONS from '@salesforce/label/c.BI_PSPB_Congratulations';
import YOU_EARNED from '@salesforce/label/c.BI_PSPB_YouEarned';
import SUCCESS_CHALLENGES from '@salesforce/label/c.BI_PSPB_SuccessChallenges';
import CONFIRM_CHALLENGES from '@salesforce/label/c.BI_PSPB_ConfirmChallenges';
import CHALLENGES_HELP from '@salesforce/label/c.BI_PSPB_ChallengesHelp';
import CANCEL from '@salesforce/label/c.BI_PSP_CancelButton';
import CANNOT_COMPLETE_CHALLENGE from '@salesforce/label/c.BI_PSPB_CannotCompleteChallenge';
import LOADING from '@salesforce/label/c.BI_PSPB_Loading';
import NO_CHALLENGES_NOW from '@salesforce/label/c.BI_PSPB_NoAvailableChallengesNow';
import CHECK_TROPHIES from '@salesforce/label/c.BI_PSPB_CheckTrophies';
import TAP_ABOVE from '@salesforce/label/c.BI_PSPB_TapAbove';
import ALTVALUE from '@salesforce/label/c.BI_PSPB_AltValue';
import CHALLENGE_LEVEL_ONE from '@salesforce/label/c.BI_PSP_ChallengeLevelOne';
import CHALLENGE_LEVEL_TWO from '@salesforce/label/c.BI_PSP_ChallengeLevelTwo';
import CH_BOOK_WORM from '@salesforce/label/c.BI_PSP_ChallengeBookworm';
import QUESTIONNAIRELINK from '@salesforce/label/c.BI_PSPB_QuestionnaireLink';

import UN_ASSIGNED_URL_NAVI from "@salesforce/label/c.BI_PSPB_UnAssignedNaviUrl";
import IC_LANDING_PAGE from "@salesforce/label/c.BI_PSP_GppArticle";
import WHY_BEING_ACTIVE from "@salesforce/label/c.BI_PSP_ActiveArticle";
import BR_WAPI_QUESTIONNAIRE from "@salesforce/label/c.BI_PSPB_WapiQuestionnaire";
import PSS_QUESTIONNAIRE from "@salesforce/label/c.BI_PSPB_PsoriasisQuesUrl";
import DLQI_QUESTIONNAIRE from "@salesforce/label/c.BI_PSPB_DlqiQuestionnaireUrl";
import CHALLENGE_LEVEL_THREE from "@salesforce/label/c.BI_PSP_ChallengeLevelThree";
import TRACK_YOUR_GPP_LABEL from "@salesforce/label/c.BI_PSP_TrackYourGppLabel";
import BRDLQICOMPLETEDURL from "@salesforce/label/c.BI_PSPB_DlqiCompletedUrl";
import BRWAPICOMPLETEDURL from "@salesforce/label/c.BI_PSPB_WapiCompletedQuestionnaire";
import BRPSSCOMPLETEDURL from "@salesforce/label/c.BI_PSPB_PsoriasisCompletedQuesUrl";
import VIEW_LABEL from "@salesforce/label/c.BI_PSPB_View";
import MANAGEYOURGPP from '@salesforce/label/c.BI_PSP_ChallengeManageYourGpp';
import SYMPTOMTRACKER from '@salesforce/label/c.BI_PSP_ManageyourGppValue';
import CHART_PERCENTAGE from '@salesforce/label/c.BI_PSP_GraphPercentage';
import CHALLANGENAVVALUE from '@salesforce/label/c.BI_PSP_NavicationChallengeValue';
import TROPHYCASENAVVALUE from '@salesforce/label/c.BI_PSP_TrophyCase';


// Exporting all resources in an organized object
export const resources = {
	
	// Apex Classes

	// Static Resources
    TROPHYCASENAVVALUE,
    CHALLANGENAVVALUE,
    CHART_PERCENTAGE,
    SYMPTOMTRACKER,
    MANAGEYOURGPP,
    VIEW_LABEL,
    BRPSSCOMPLETEDURL,
    BRWAPICOMPLETEDURL,
    BRDLQICOMPLETEDURL,
    TRACK_YOUR_GPP_LABEL,
    CHALLENGE_LEVEL_THREE,
    DLQI_QUESTIONNAIRE,
    PSS_QUESTIONNAIRE,
    BR_WAPI_QUESTIONNAIRE,
    WHY_BEING_ACTIVE,
    IC_LANDING_PAGE,
    UN_ASSIGNED_URL_NAVI,
    QUESTIONNAIRELINK,
    CH_BOOK_WORM,
	NOVICE_IMAGE,
    PROFICIENT_STAR,
    EXPERT_STAR,
    INTERMEDIATE_STAR,
    BEGINNER_STAR,
    NOVICE_STAR,
    BEGINNER_IMAGE,
    INTERMEDIATE_IMAGE,
    PROFICIENT_IMAGE,
    EXPERT_IMAGE,
    CELEBRATION,
    CRO_ICON,
    ACTIVE_NO,
    CHALLENGE_ARROW_LARGE,
    CHALLENGE_ARROW_SMALL,
    WIDGET,
	// Custom Labels
    BRANDED_URL,
	ERROR_MESSAGES,
    ERROR_VARIANT,
    LABLE_STATUS_ACTIVE,
    LABLE_STATUS_COMPLETED,
    LABLE_AVAILABLE,
    RANK_LEVEL_ONE,
    RANK_LEVEL_TWO,
    RANK_LEVEL_THREE,
    RANK_LEVEL_FOUR,
    RANK_LEVEL_FIVE,
    RANK_LEVEL_SIX,
    CH_RANK_TWO,
    CH_RANK_THREE,
    CH_RANK_FOUR,
    CH_RANK_FIVE,
    CH_RANK_SIX,
    BR_SITE_URL,
    BR_TROPHY_CASE_SITE_URL,
    ERR_MSG_PL,
    EXPERT_GPP,
    BEGINNER_GPP,
    INTERMEDIATE_GPP,
    NOVICE_GPP,
    PROFICIENT_GPP,
    NOVICE_GPPS,
    BEGINNER,
    INTERMEDIATE,
    PROFICIENT,
    EXPERT,
    UNASSIGNED_URL,
    SLASH_URL,
    SLASH_SITEURL,
    BRANDED_CHALLENGES_SITEURL,
    TOTAL_XP,
    BEING_ACTIVE,
    TRACK_YOUR_ANSWER,
    LINKARTICLE,
    GPPWORKLIFELINK,
    GPPSYMPTOMSLINK,
    GPPQUALITYLIFELINK,
    QUESTONNAIREVAL,
    ACCEPTCHALLENGEBUTTON,
    COMPLETECHALLENGEBUTTON,
    CHALLENGES,
    CHALLENGE_UNDERSTANDING,
    START_CHALLENGE,
    AVAILABLE_CHALLENGES,
    COMPLETED_CHALLENGES,
    VIEW_TROPHIES,
    CHALLENGES_LIMIT,
    CHALLENGES_XP,
    XP_TILL_LEVEL,
    BI_PSP_DISPLAYERRORPAGE,
    BRSITE_URL,
    TROPHY_CASE,
    CHALLENGES_COMPLETED,
    CHALLENGES_NOT_COMPLETED,
    LOAD_MORE,
    LOAD_LESS,
    CHALLENGES_REACH,
    LEVEL,
    CHALLENGES_MAX_LEVEL,
    CHALLENGES_EXCELLENT,
    ACTIVE_CHALLENGES,
    NO_ACTIVE_CHALLENGES,
    ACCEPT_CHALLENGE,
    NO_AVAILABLE_CHALLENGE,
    COMPLETE_CHALLENGE_POINTS,
    CONGRATULATIONS,
    YOU_EARNED,
    SUCCESS_CHALLENGES,
    CONFIRM_CHALLENGES,
    CHALLENGES_HELP,
    CANCEL,
    CANNOT_COMPLETE_CHALLENGE,
    LOADING,
    NO_CHALLENGES_NOW,
    CHECK_TROPHIES,
    TAP_ABOVE,
    ALTVALUE,
    CHALLENGE_LEVEL_ONE,
    CHALLENGE_LEVEL_TWO

};