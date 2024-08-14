/**
 * @description This class serves as a centralized repository for custom labels used across the Personalization module.
 * It provides easy access to various labels such as patient status, article topics, question responses, and error messages.
 *
 * History:
 * Version    Author             Date            Detail          Description
 * 1.0        Gokul Krishnan     15-Jul-2024     Created         Common custom labels added for personalization
 */
public with sharing class BI_PSPB_PersonalizationConstantCtrl {
	// General messages category custom label
	public static String generalMessageCategory = System.Label.BI_PSP_GenMessageCategory;
	public static String mondayFridayCategory = System.Label.BI_PSP_MondayFridayMessageCategory;

	// Custom label for patient status
	public static String chronicStatus = System.Label.BI_PSPB_ChronicStatus;
	public static String acuteStatus = System.Label.BI_PSPB_Acute;
	// Custom label for articles
	// What is GPP?
	public static String whatGppLabel = System.Label.BI_PSP_WhatGppLabel;
	// Important facts about GPP
	public static String factsGppLabel = System.Label.BI_PSP_FactsGppLabel;
	// How rare is GPP?
	public static String rareGppLabel = System.Label.BI_PSP_RareGppLabel;
	// Why do I have GPP?
	public static String whyDoIHaveGppLabel = System.Label.BI_PSP_WhyDoIHaveGppLabel;
	// Diagnosis and acceptance of GPP
	public static String diagnosisGppLabel = System.Label.BI_PSP_DiagnosisGppLabel;
	// Is GPP contagious?
	public static String gppContagiousLabel = System.Label.BI_PSP_GppContagiousLabel;
	// Talking to friends and family
	public static String friendsFamilyLabel = System.Label.BI_PSP_FriendsFamilyLabel;
	// Feeling misunderstood and excluded
	public static String feelingExcludedLabel = System.Label.BI_PSP_FeelingExcludedLabel;
	// GPP and intimacy
	public static String gppIntimacyLabel = System.Label.BI_PSP_GppIntimacyLabel;
	// GPP and pregnancy
	public static String gppPregnancyLabel = System.Label.BI_PSP_GppPregnancyLabel;
	// How to manage a flare
	public static String manageFlareLabel = System.Label.BI_PSP_ManageFlareLabel;
	// GPP and comorbidities
	public static String gppComorbiditiesLabel = System.Label.BI_PSP_GppComorbiditiesLabel;
	// How to manage your GPP symptoms
	public static String manageGppSymptomsLabel = System.Label.BI_PSP_ManageGppSymptomsLabel;
	// What to ask your doctor
	public static String askDoctorLabel = System.Label.BI_PSP_AskDoctorLabel;
	// When to seek medical care
	public static String seekMediCareLabel = System.Label.BI_PSP_SeekMediCareLabel;
	// When to seek emergency treatment
	public static String seekEmergencyLabel = System.Label.BI_PSP_SeekEmergencyLabel;
	// Managing your scars
	public static String manageScarsLabel = System.Label.BI_PSP_ManageScarsLabel;
	// How to avoid complications with GPP
	public static String complicatGppLabel = System.Label.BI_PSP_ComplicatGppLabel;
	// Recognizing flares
	public static String recognizingFlaresLabel = System.Label.BI_PSP_RecognizingFlaresLabel;
	// Being prepared for a visit to your doctor
	public static String visitDoctorLabel = System.Label.BI_PSP_VisitDoctorLabel;
	// Teaming up with your dermatologist
	public static String dermatologistLabel = System.Label.BI_PSP_DermatologistLabel;
	// How to talk about GPP
	public static String talkGppLabel = System.Label.BI_PSP_TalkGppLabel;
	// You're not alone
	public static String notAloneLabel = System.Label.BI_PSP_NotAloneLabel;
	// Making positive choices
	public static String positiveChoicesLabel = System.Label.BI_PSP_PositiveChoicesLabel;
	// Treating GPP flares with Spevigo®
	public static String treatingGppLabel = System.Label.BI_PSPB_TreatingGppLabel;
	// SPEVIGO® (spesolimab) infusion: Patient guide on dosing and administration
	public static String spevigoInfusionLabel = System.Label.BI_PSPB_SpevigoInfusionLabel;
	// Prevention of GPP flares with Spevigo®
	public static String preventionGppLabel = System.Label.BI_PSPB_PreventionGppLabel;
	// SPEVIGO® (spesolimab) subcutaneous injection: Patient guide on dosing and administration
	public static String spevigoInjectionLabel = System.Label.BI_PSPB_SpevigoInjectionLabel;
	// Spevigo®: How does it work in GPP?
	public static String workInGppLabel = System.Label.BI_PSPB_WorkInGppLabel;

	// Custom label for response
	public static String maybeResponse = System.Label.BI_PSP_RbMaybe;
	public static String noResponse = System.Label.BI_PSP_OptionValueNo;
	public static String yesResponse = System.Label.BI_PSP_OptionValueYes;

	// Custom label for message categories
	public static String managementCategory = System.Label.BI_PSP_ManagementCategory;
	public static String mentalHealthCategory = System.Label.BI_PSP_MentalHealthCategory;
	public static String socialLifeCategory = System.Label.BI_PSP_SocialLifeCategory;
	public static String healthyLifeStyleCategory = System.Label.BI_PSPB_HealthyLifeCategory;

	// Custom label for personalize questions
	// Do you often discuss GPP with your friends and family?
	public static String oftenDiscussQstn = System.Label.BI_PSP_OftenDiscussQstn;
	// What aspects of your life have been affected by GPP?
	public static String affectGppQstn = System.Label.BI_PSP_AffectGppQstn;
	// Do you have other medical conditions?
	public static String haveMediConditionQstn = System.Label.BI_PSP_HaveMediConditionQstn;
	// I have a complete understanding of my Generalized pustular psoriasis (GPP).
	public static String completeUnderstandGppQstn = System.Label.BI_PSP_CompleteUnderstandGppQstn;
	// I feel confident about recognizing GPP flares.
	public static String feelConfidentQstn = System.Label.BI_PSP_FeelConfidentQstn;
	// I can manage my GPP flares.
	public static String manageFlareQstn = System.Label.BI_PSP_ManageFlareQstn;
	// I have complete understanding of Spevigo® (spesolimab) and how it is used to treat my GPP.
	public static String understandSpevigoQstn = System.Label.BI_PSP_UnderstandSpevigoQstn;
	// I am not good at talking to my physician about my GPP.
	public static String notGoodTalkingQstn = System.Label.BI_PSP_NotGoodTalkingQstn;
	// I rely only on my physician to manage my GPP.
	public static String relyPhysicianQstn = System.Label.BI_PSP_RelyPhysicianQstn;
	// I don’t feel like I am doing enough to stay healthy in terms of diet, exercise, etc.
	public static String stayHealthyQstn = System.Label.BI_PSP_StayHealthyQstn;
	// GPP is affecting my mental health (e.g. leading to depression and/or anxiety).
	public static String affectMentalHealthQstn = System.Label.BI_PSP_AffectMentalHealthQstn;
	// I have required support at home from my family members and/or caregiver to manage my GPP condition.
	public static String requireSupportQstn = System.Label.BI_PSP_RequireSupportQstn;
	// I am able to afford my GPP treatment
	public static String affortTreatmentQstn = System.Label.BI_PSP_AffortTreatmentQstn;
	// How Long you have been diagnosed with Generalized Pustular Psoriasis (GPP)?
	public static String howLongGppQstn = System.Label.BI_PSP_HowLongGppQstn;
	// What is your gender?
	public static String whatGenderQstn = System.Label.BI_PSP_WhatGenderQstn;

	// Custom label for question response
	public static String relationshipWithFriends = System.Label.BI_PSP_RbFamAndFriends;
	public static String relationshipWithPartner = System.Label.BI_PSP_RbWithPartner;
	public static String selfEsteem = System.Label.BI_PSP_RbSelfEsteem;
	public static String female = System.Label.BI_PSP_RbFemale;
	public static String male = System.Label.BI_PSP_RbMale;
	public static String other = System.Label.BI_PSP_RbOther;
	public static String preferNotToSay = System.Label.BI_PSP_RbNotToSay;
	public static String lessThanMonth = System.Label.BI_PSP_RbOneMonth;
	public static String moreThanYear = System.Label.BI_PSP_RbOneYearMore;
	public static String sixMonths = System.Label.BI_PSP_RbSixMnth;
	public static String lessThanYear = System.Label.BI_PSP_RbOneYear;

	// Assessment query custom label
	public static String completeStatus = System.Label.BI_PSP_Complete;
	public static String introductionQuestionaire = System.Label.BI_PSP_IntroductionLabel;
	public static String letsPersonalizeQuestionaire = System.Label.BI_PSP_LetsPersonalizeIntroductionQuestionaire;
	public static String friday = System.Label.BI_PSP_Friday;
	public static String monday = System.Label.BI_PSP_Monday;
	public static String mon = System.Label.BI_PSP_Mon;
	public static String fri = System.Label.BI_PSP_Fri;

	// Custom Error label
	public static String errorPersonalizedMessagesRetrieve = System.Label.BI_PSP_NoPersonalizedMessages;
	public static String errorNoUserFound = System.Label.BI_PSP_NoUserFound;
	public static String errorNoAssessment = System.Label.BI_PSP_NoLetsPersonalizeAssessment;
	public static String errorRetrievePersonalizedArticles = System.Label.BI_PSPB_ErrorRetrievePersonalizedArticles;
	public static String errorForAccount = System.Label.BI_PSP_AccountError;
	public static String caregiverNullError = System.Label.BI_PSPB_CaregiverNullError;
	public static String enrolleNotFoundError = System.Label.BI_PSP_EnrolleeNotFound;
	public static Map<String, Map<String, Set<String>>> negativeResponseMap = new Map<String, Map<String, Set<String>>>{
		whatGenderQstn => new Map<String, Set<String>>{
			female => new Set<String>{ gppPregnancyLabel },
			other => new Set<String>{ gppPregnancyLabel },
			preferNotToSay => new Set<String>{ gppPregnancyLabel }
		},
		oftenDiscussQstn => new Map<String, Set<String>>{
			noResponse => new Set<String>{ friendsFamilyLabel }
		},
		haveMediConditionQstn => new Map<String, Set<String>>{
			yesResponse => new Set<String>{ gppComorbiditiesLabel }
		},
		completeUnderstandGppQstn => new Map<String, Set<String>>{
			noResponse => new Set<String>{ whatGppLabel, seekMediCareLabel },
			maybeResponse => new Set<String>{
				factsGppLabel,
				seekEmergencyLabel
			}
		},
		feelConfidentQstn => new Map<String, Set<String>>{
			noResponse => new Set<String>{ recognizingFlaresLabel },
			maybeResponse => new Set<String>{ manageGppSymptomsLabel }
		},
		manageFlareQstn => new Map<String, Set<String>>{
			noResponse => new Set<String>{ manageFlareLabel },
			maybeResponse => new Set<String>{ complicatGppLabel }
		},
		understandSpevigoQstn => new Map<String, Set<String>>{
			noResponse => new Set<String>{
				preventionGppLabel,
				spevigoInjectionLabel,
				workInGppLabel,
				treatingGppLabel,
				spevigoInfusionLabel
			},
			maybeResponse => new Set<String>{
				preventionGppLabel,
				spevigoInjectionLabel,
				workInGppLabel,
				treatingGppLabel,
				spevigoInfusionLabel
			}
		},
		notGoodTalkingQstn => new Map<String, Set<String>>{
			yesResponse => new Set<String>{ askDoctorLabel, visitDoctorLabel },
			maybeResponse => new Set<String>{ askDoctorLabel, visitDoctorLabel }
		},
		relyPhysicianQstn => new Map<String, Set<String>>{
			noResponse => new Set<String>{ dermatologistLabel },
			maybeResponse => new Set<String>{ dermatologistLabel }
		},
		stayHealthyQstn => new Map<String, Set<String>>{
			yesResponse => new Set<String>{ positiveChoicesLabel },
			maybeResponse => new Set<String>{ positiveChoicesLabel }
		},
		affectMentalHealthQstn => new Map<String, Set<String>>{
			yesResponse => new Set<String>{ feelingExcludedLabel },
			maybeResponse => new Set<String>{ notAloneLabel }
		},
		requireSupportQstn => new Map<String, Set<String>>{
			noResponse => new Set<String>{ friendsFamilyLabel },
			maybeResponse => new Set<String>{ friendsFamilyLabel }
		}
	};
	public static Set<String> articlesPositive = new Set<String>{
		seekMediCareLabel,
		dermatologistLabel,
		positiveChoicesLabel,
		rareGppLabel,
		preventionGppLabel,
		spevigoInjectionLabel,
		workInGppLabel,
		treatingGppLabel,
		spevigoInfusionLabel,
		askDoctorLabel
	};
	public static Map<String, Map<String, Set<String>>> positiveResponseMap = new Map<String, Map<String, Set<String>>>{
		howLongGppQstn => new Map<String, Set<String>>{
			lessThanMonth => new Set<String>{ whyDoIHaveGppLabel },
			moreThanYear => new Set<String>{ notAloneLabel },
			sixMonths => new Set<String>{ diagnosisGppLabel },
			lessThanYear => new Set<String>{ factsGppLabel }
		},
		whatGenderQstn => new Map<String, Set<String>>{
			male => new Set<String>{}
		},
		haveMediConditionQstn => new Map<String, Set<String>>{
			noResponse => articlesPositive
		},
		completeUnderstandGppQstn => new Map<String, Set<String>>{
			yesResponse => new Set<String>{ 'flag' }
		},
		oftenDiscussQstn => new Map<String, Set<String>>{
			yesResponse => articlesPositive
		},
		feelConfidentQstn => new Map<String, Set<String>>{
			yesResponse => articlesPositive
		},
		requireSupportQstn => new Map<String, Set<String>>{
			yesResponse => articlesPositive
		},
		manageFlareQstn => new Map<String, Set<String>>{
			yesResponse => articlesPositive
		},
		understandSpevigoQstn => new Map<String, Set<String>>{
			yesResponse => articlesPositive
		},
		notGoodTalkingQstn => new Map<String, Set<String>>{
			noResponse => articlesPositive
		},
		relyPhysicianQstn => new Map<String, Set<String>>{
			yesResponse => articlesPositive
		},
		stayHealthyQstn => new Map<String, Set<String>>{
			noResponse => articlesPositive
		},
		affectMentalHealthQstn => new Map<String, Set<String>>{
			noResponse => articlesPositive
		},
		affortTreatmentQstn => new Map<String, Set<String>>{
			noResponse => new Set<String>{ '' },
			yesResponse => new Set<String>{ '' },
			maybeResponse => new Set<String>{ '' }
		}
	};
	public static Map<String, Map<String, String>> questionResponseCategoryMap = new Map<String, Map<String, String>>{
		oftenDiscussQstn => new Map<String, String>{
			noResponse => socialLifeCategory
		},
		requireSupportQstn => new Map<String, String>{
			noResponse => socialLifeCategory
		},
		affectGppQstn => new Map<String, String>{
			relationshipWithFriends => socialLifeCategory,
			relationshipWithPartner => socialLifeCategory,
			selfEsteem => socialLifeCategory
		},
		completeUnderstandGppQstn => new Map<String, String>{
			noResponse => managementCategory,
			maybeResponse => managementCategory
		},
		understandSpevigoQstn => new Map<String, String>{
			noResponse => managementCategory,
			maybeResponse => managementCategory
		},
		feelConfidentQstn => new Map<String, String>{
			noResponse => managementCategory,
			maybeResponse => managementCategory
		},
		manageFlareQstn => new Map<String, String>{
			noResponse => managementCategory,
			maybeResponse => managementCategory
		},
		relyPhysicianQstn => new Map<String, String>{
			noResponse => managementCategory,
			maybeResponse => managementCategory
		},
		notGoodTalkingQstn => new Map<String, String>{
			yesResponse => managementCategory
		},
		affectMentalHealthQstn => new Map<String, String>{
			yesResponse => mentalHealthCategory
		},
		stayHealthyQstn => new Map<String, String>{
			yesResponse => healthyLifeStyleCategory,
			maybeResponse => healthyLifeStyleCategory
		}
	};
}