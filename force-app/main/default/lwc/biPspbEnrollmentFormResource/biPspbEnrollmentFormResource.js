// Import current user ID
import ID from "@salesforce/user/Id";
// Importing Custom Labels
import PATIENT_FIRSTNAME from "@salesforce/label/c.BI_PSPB_CaregiverFirstNameErrMsg";
import IAM_PATIENT_URL from "@salesforce/label/c.BI_PSPB_IamPatient";
import MINORAGE from "@salesforce/label/c.BI_PSPB_MInorAge";
import PATIENT_LASTNAME from "@salesforce/label/c.BI_PSPB_CaregiverLastNameErrMsg";
import PATIENT_DATEOFBIRTH from "@salesforce/label/c.BI_PSPB_PatientDateOfBirthErrMsg";
import PATIENT_GENDER from "@salesforce/label/c.BI_PSPB_PatientGenterErrMsg";
import PATIENT_EMAIL from "@salesforce/label/c.BI_PSPB_CaregiverEmailErrMsg";
import COUNTRY from "@salesforce/label/c.BI_PSPB_PatientCountryRequiredErrMsg";
import STATE from "@salesforce/label/c.BI_PSPB_PatientStateErrMsg";
import CITY from "@salesforce/label/c.BI_PSPB_PatientCityErrMsg";
import STREET from "@salesforce/label/c.BI_PSPB_PatientStreetErrMsg";
import PINCODE from "@salesforce/label/c.BI_PSPB_PatientZipCodeErrMsg";
import PATIENT_PHONE from "@salesforce/label/c.BI_PSPB_PhoneRequiredErrMsg";
import PREFERRED_CONTACT_METHOD from "@salesforce/label/c.BI_PSPB_PatientPrefferMethodErrMsg";
import ERROR_MESSAGE from "@salesforce/label/c.BI_PSP_ConsoleError";
import ERROR_VARIANT from "@salesforce/label/c.BI_PSP_ErrorVariantToast";
import DOB_ERROR from "@salesforce/label/c.BI_PSPB_PatientFutureDateErrMsg";
import PS_URL from "@salesforce/label/c.BI_PSPB_PatientSummaryUrl";
import SMS from "@salesforce/label/c.BI_PSP_SmsLabel";
import PHONE from "@salesforce/label/c.BI_PSPB_Phone";
import YES from "@salesforce/label/c.BI_PSP_SoftDelete";
import ERROR_FOUND from "@salesforce/label/c.BI_PSP_RecordNotFoundMsg";
import SHOW_TOAST from "@salesforce/label/c.BI_PSP_ShowToasts";
import REFERRING_PRACTICE from "@salesforce/label/c.BI_PSPB_PhysicianDetailsErrMsg";
import LICENSE_NUMBER from "@salesforce/label/c.BI_PSPB_PhysicianLicenseErrMsg";
import PRACTICE from "@salesforce/label/c.BI_PSPB_PracticeNameErrMsg";
import Minorvalue from "@salesforce/label/c.BI_PSPB_MInorAge";
import PRACTICE_TYPE_ERR from "@salesforce/label/c.BI_PSPB_PhysicianPracticeTypeErrMsg";
import PHYSICIAN_EMAIL from "@salesforce/label/c.BI_PSPB_PatientEmailErrMsg";
import CAREGIVER_RELATIONSHIP from "@salesforce/label/c.BI_PSPB_CaregiverRelationErrMsg";
import CAREGIVER_EMAIL from "@salesforce/label/c.BI_PSPB_PatientEmailErrMsg";
import DRUGNAME from "@salesforce/label/c.BI_PSPB_DrugNameErrMsg";
import DRUGCODE from "@salesforce/label/c.BI_PSPB_DrugCodeErrMsg";
import DOSAGE from "@salesforce/label/c.BI_PSPB_DosageErrMsg";
import DOSAGE_UNITS from "@salesforce/label/c.BI_PSPB_DosageUnitErrMsg";
import FREQUENCY from "@salesforce/label/c.BI_PSPB_FrequencyErrMsg";
import FREQUENCY_UNITS from "@salesforce/label/c.BI_PSPB_FrequencyUnitErrMsg";
import PRESCRIBED_DATE from "@salesforce/label/c.BI_PSPB_PrescribedDateErrMsg";
import PRESCRIBED_FUTURE_DATE from "@salesforce/label/c.BI_PSPB_PrescribedFutureDateErrMsg";
import LABEL_GENDER from "@salesforce/label/c.BI_PSPB_HealthCloudGender";
import LAST_NAME from "@salesforce/label/c.BI_PSPB_LastName";
import FIRSTNAME from "@salesforce/label/c.BI_PSPB_FirstName";
import HCP from "@salesforce/label/c.BI_PSPB_IamHcp";
import LABEL_PRACTICE_NAME from "@salesforce/label/c.BI_PSPB_PracticeName";
import LABEL_LICENSE_NUMBER from "@salesforce/label/c.BI_PSPB_LicenseNumber";
import MAILING_POSTAL_CODE from "@salesforce/label/c.BI_PSPB_MailingPostalCode";
import MAILING_STREET from "@salesforce/label/c.BI_PSPB_MailingStreet";
import MAILING_CITY from "@salesforce/label/c.BI_PSPB_MailingCity";
import MAILING_STATECODE from "@salesforce/label/c.BI_PSPB_MailingStateCode";
import MAILING_COUNTRYCODE from "@salesforce/label/c.BI_PSPB_MailingCountryCode";
import FAX from "@salesforce/label/c.BI_PSPB_Fax";
import PRACTICE_TYPEE from "@salesforce/label/c.BI_PSPB_PracticeType";
import HCP_SUMMARY from "@salesforce/label/c.BI_PSPB_HcpSummaryUrl";
import REFILL from "@salesforce/label/c.BI_PSPB_Refill";
import FREQUENCY_VALUE from "@salesforce/label/c.BI_PSPB_Frequency";
import DOSAGE_VALUE from "@salesforce/label/c.BI_PSPB_Dosage";
import QUANTITY from "@salesforce/label/c.BI_PSPB_Quantity";
import FREQUCNCY_UNIT from "@salesforce/label/c.BI_PSPB_FrequencyUnit";
import DOSAGE_CODE from "@salesforce/label/c.BI_PSPB_DosageCode";
import DRUG_NAME from "@salesforce/label/c.BI_PSPB_DrugName";
import CAREGIVER_PHONE from "@salesforce/label/c.BI_PSPB_CaregiverPhone";
import CAREGIVER_MAIL from "@salesforce/label/c.BI_PSPB_CaregiverEmail";
import CAREGIVER_FIRSTNAME from "@salesforce/label/c.BI_PSPB_CaregiverFirstName";
import CAREGIVER_LASTNAME from "@salesforce/label/c.BI_PSPB_CaregiverLastName";
import CAREGIVER_RELATION from "@salesforce/label/c.BI_PSPB_CaregiverRelationship";
import EMAIL from "@salesforce/label/c.BI_PSP_NotificationEmail";
import AGREE from "@salesforce/label/c.BI_PSPB_Agree";
import BRANDED_URL from "@salesforce/label/c.BI_PSPB_BrandedSiteNaviUrl";
import HCP_LABEL from "@salesforce/label/c.BI_PSPB_HealthcareProvider";
import THANK_FORM_URL from "@salesforce/label/c.BI_PSPB_PreThankFormUrl";
import FEMALE from "@salesforce/label/c.BI_PSP_RbFemale";
import MALE from "@salesforce/label/c.BI_PSP_RbMale";
import OTHER from "@salesforce/label/c.BI_PSP_RbOther";
import PREFER from "@salesforce/label/c.BI_PSP_RbNotToSay";
import PARENT from "@salesforce/label/c.BI_PSP_NotificationParent";
import SIBILING from "@salesforce/label/c.BI_PSP_NotificationSibling";
import LOVEDONE from "@salesforce/label/c.BI_PSP_LovedOne";
import GUARDIAN from "@salesforce/label/c.BI_PSP_NotificationGuardian";
import FRIEND from "@salesforce/label/c.BI_PSP_NotificationFriend";
import RELATIVE from "@salesforce/label/c.BI_PSP_NotificationOtherRelative";
import HCPENROLLMSG from "@salesforce/label/c.BI_PSPB_HcpMinorEnrollMsg";
import THANKYOU_MSG_ONE from "@salesforce/label/c.BI_PSPB_CheckEmail";
import THANKYOU_MSG_TWO from "@salesforce/label/c.BI_PSPB_ThankYouMessage";
import THANKYOU_MSG_THREE from "@salesforce/label/c.BI_PSPB_ThankYouContent";
import THANKYOU_MSG_FOUR from "@salesforce/label/c.BI_PSPB_ThankYouEmailSent";
import IMG from "@salesforce/resourceUrl/BI_PSPB_ThankYouImage";
import SEND_AVATAR_MSG from '@salesforce/label/c.BI_PSPB_SendAvatarMsg';
import PRIVACYURL from '@salesforce/label/c.BI_PSPB_PrivacyNotice';
import TERMSURL from '@salesforce/label/c.BI_PSPB_TermsOfUse';
import CONTACTURL from '@salesforce/label/c.BI_PSPB_ContactUs';
import BI_PSPB_Preferred_Communication_Method__c from '@salesforce/schema/Lead.BI_PSPB_Preferred_Communication_Method__c';
//InnerHtml Contents labels For Hcp
import AVATAR_MSG_ONE from '@salesforce/label/c.BI_PSPB_HcpMsgOne';
import AVATAR_MSG_TWO from '@salesforce/label/c.BI_PSPB_HcpMsgTwo';
import THANK_FOR_CHOOSE from '@salesforce/label/c.BI_PSPB_ThanksForChoose';
import AVATAR_MID_MSG_ONE from '@salesforce/label/c.BI_PSPB_HcpMidMsgOne';
import AVATAR_MID_MSG_TWO from '@salesforce/label/c.BI_PSPB_HcpMidMsgTwo';
import AVATAR_MID_MSG_THREE from '@salesforce/label/c.BI_PSPB_HcpMidMsgThree';
import AVATAR_MID_MSG_FOUR from '@salesforce/label/c.BI_PSPB_HcpMidMsgFour';
import AVATAR_MOB_MSG_ONE from '@salesforce/label/c.BI_PSPB_HcpMobOne';
import AVATAR_MOB_MSG_TWO from '@salesforce/label/c.BI_PSPB_HcpMobTwo';
import AVATAR_MOB_MSG_THREE from '@salesforce/label/c.BI_PSPB_HcpMobThree';
//InnerHtml Contents labels For Patient
import P_AVATAR_MSG_ONE from '@salesforce/label/c.BI_PSPB_PatientMsgOne';
import P_AVATAR_MSG_TWO from '@salesforce/label/c.BI_PSPB_PatientMsgTwo';
import P_AVATAR_MSG_THREE from '@salesforce/label/c.BI_PSPB_PatientMsgThree';
import P_AVATAR_MSG_FOUR from '@salesforce/label/c.BI_PSPB_PatientMsgFour';
import P_AVATAR_MSG_FIVE from '@salesforce/label/c.BI_PSPB_PatientMsgFive';
import P_AVATAR_MID_MSG_ONE from '@salesforce/label/c.BI_PSPB_PatientMidMsgOne';
import P_AVATAR_MID_MSG_TWO from '@salesforce/label/c.BI_PSPB_PatientMidMsgTwo';
import P_AVATAR_LAST_MSG_ONE from '@salesforce/label/c.BI_PSPB_PatientLastMsgOne';
import P_AVATAR_MOB_MSG_ONE from '@salesforce/label/c.BI_PSPB_PatientMobMsgOne';
import P_AVATAR_MOB_MSG_TWO from '@salesforce/label/c.BI_PSPB_PatientMobMsgTwo';
import P_AVATAR_MOB_MSG_THREE from '@salesforce/label/c.BI_PSPB_PatientMobMsgThree';
import P_AVATAR_MOB_MSG_FOUR from '@salesforce/label/c.BI_PSPB_PatientMobMsgFour';
import P_AVATAR_MOB_MSG_FIVE from '@salesforce/label/c.BI_PSPB_PatientMobMsgFive';
import P_AVATAR_MOB_MSG_SIX from '@salesforce/label/c.BI_PSPB_PatientMobMsgSix';
//InnerHtml Contents labels For PrePatient
import PRE_AVATAR_MSG_ONE from '@salesforce/label/c.BI_PSPB_MsgOnePatient';
import PRE_AVATAR_MSG_TWO from '@salesforce/label/c.BI_PSPB_MsgTwoPatient';
import PRE_AVATAR_MSG_THREE from '@salesforce/label/c.BI_PSPB_MsgThreePatient';
import PRE_AVATAR_MSG_FOUR from '@salesforce/label/c.BI_PSPB_MsgFourPatient';
import PRE_AVATAR_MSG_FIVE from '@salesforce/label/c.BI_PSP_MobMsgOnePatient';
import PRE_AVATAR_MSG_SIX from '@salesforce/label/c.BI_PSPB_MobMsgTwoPatient';
//InnerHtml Contents labels For Precaregiver
import CARE_AVATAR_MSG_ONE from '@salesforce/label/c.BI_PSPB_MsgOneCaregiver';
import CARE_AVATAR_MSG_TWO from '@salesforce/label/c.BI_PSPB_MsgTwoCaregiver';
import CARE_AVATAR_MSG_THREE from '@salesforce/label/c.BI_PSPB_MsgThreeCaregiver';
import CARE_AVATAR_MSG_FOUR from '@salesforce/label/c.BI_PSPB_MsgFourCaregiver';
import CARE_AVATAR_MSG_FIVE from '@salesforce/label/c.BI_PSPB_MsgFiveCaregiver';
import CARE_AVATAR_MSG_SIX from '@salesforce/label/c.BI_PSPB_MobMsgOneCaregiver';
import CARE_AVATAR_MSG_SEVEN from '@salesforce/label/c.BI_PSPB_MobMsgTwoCaregiver';
//Schema
import LEAD from "@salesforce/schema/Lead";
import CONTACT from "@salesforce/schema/Contact";
import PRACTICE_TYPE from "@salesforce/schema/Contact.BI_PSPB_Practice_Type__c";
import GENDER from "@salesforce/schema/Lead.HealthCloudGA__Gender__c";
import FREQUENCY_UNIT from "@salesforce/schema/BI_PSPB_Lead_Prescription__c.BI_PSPB_Frequency_Unit__c";
import LEAD_PRESCRIPTION from "@salesforce/schema/BI_PSPB_Lead_Prescription__c";
import LEAD_CAREGIVER from "@salesforce/schema/BI_PSPB_Lead_Caregiver__c";
import RELATIONSHIP from "@salesforce/schema/BI_PSPB_Lead_Caregiver__c.BI_PSPB_Relationship_to_Patient__c";

// Imports resourceUrl to reference external resources for proper rendering and functionality.
import BGPP from "@salesforce/resourceUrl/BI_PSPB_BeyondGppLogo";
import TEXT_ALIGN from "@salesforce/resourceUrl/BI_PSPB_TextAlignmentHcp";
import WARNING_ICON from "@salesforce/resourceUrl/BI_PSP_WarningIcon";
import CALENDER_ICON from "@salesforce/resourceUrl/BI_PSPB_CalenderIconSymp";
import ICON_CSS from "@salesforce/resourceUrl/BI_PSPB_InputSearchIcon";
import OLD_GUY_JPEG_URL from "@salesforce/resourceUrl/BI_PSPB_PatientEntrollAvatar";
import SPEVIGO_LOGO_JPEG_URL from '@salesforce/resourceUrl/BI_PSPB_HeaderSpevigo';
import BIFOOTER_LOGO_JPEG_URL from '@salesforce/resourceUrl/BI_PSPB_FooterCopyright';
import CAREGIVER_IMG from '@salesforce/resourceUrl/BI_PSPB_PrepopulatedAvatar';
import HOME_ICON from '@salesforce/resourceUrl/BI_PSPB_HomeIcon';
import HOME_ICON_MOBILE from '@salesforce/resourceUrl/BI_PSPB_HomeIconForMobile';
import PATIENT_AVATAR from "@salesforce/resourceUrl/BI_PSPB_HcpEntrollmentPatientAvatar";

//
import FIELD_WIDTH from '@salesforce/label/c.BI_PSPB_FieldWith';
import ARE_MANDOTORY from '@salesforce/label/c.BI_PSPB_AreMandatory';
import PATIENT_ENROLL from '@salesforce/label/c.BI_PSPB_PatientEnrollHead';
import PATIENT_INFO from '@salesforce/label/c.BI_PSPB_PatientInformation';
import FIRST_NAME_LABEL from '@salesforce/label/c.BI_PSPB_FirstNameLabel';
import FIRSTNAME_VALIDE from '@salesforce/label/c.BI_PSPB_ValidFirstNameErrMsg';
import LASTNAME_VALIDE from '@salesforce/label/c.BI_PSPB_ValidLastNameErrMsg';
import LASTNAME_LABEL from '@salesforce/label/c.BI_PSPB_LastNameLabel';
import DOB_LABEL from '@salesforce/label/c.BI_PSPB_DobLabel';
import BEFORE_EIGHTINE from '@salesforce/label/c.BI_PSPB_PatientLastMsgOne';
import YEAR_OLDER from '@salesforce/label/c.BI_PSPB_YearOlderErrMsg';
import GENDER_LABEL from '@salesforce/label/c.BI_PSPB_Gender';
import EMAIL_LABEL_STAR from '@salesforce/label/c.BI_PSPB_EmailLabel';
import VALIDE_EMAIL from '@salesforce/label/c.BI_PSPB_ValidEmail';
import EXISTING_EMAIL from '@salesforce/label/c.BI_PSPB_AlreadyExistEmail';
import CANCEL from '@salesforce/label/c.BI_PSP_CancelButton';
import NEXT from '@salesforce/label/c.BI_PSPB_Next';
import PHYSICIAN_DETAILS from '@salesforce/label/c.BI_PSPB_PhysicianDetailsErrMsg';
import NUM_TWO from '@salesforce/label/c.BI_PSPB_NumTwo';
import NUM_ONE from '@salesforce/label/c.BI_PSPB_NumOne';
import PHYSICIAN_INFO from '@salesforce/label/c.BI_PSPB_PhysicianInformation';
import PHYSICIAN_INFO_MANDOTORY from '@salesforce/label/c.BI_PSPB_PhysicianInfoMandatory';
import ACCESS_CODE_MSG from '@salesforce/label/c.BI_PSPB_AccessCodeMsg';
import HCP_ACCESS_CODE from '@salesforce/label/c.BI_PSPB_HcpAccessCode';
import YES_VALUE from '@salesforce/label/c.BI_PSPB_Yes';
import NO_VALUE from '@salesforce/label/c.BI_PSP_OptionValueNo';
import SEARCH_PHYSICIAN from '@salesforce/label/c.BI_PSPB_SearchPhysician';
import PHYSICIAN_INFO_VALID from '@salesforce/label/c.BI_PSPB_PhysicianInfoValid';
import UNABLE_TO_FIND from '@salesforce/label/c.BI_PSPB_UnableToFind';
import ACCESS_CODE from '@salesforce/label/c.BI_PSPB_AccessCode';
import VALID_ACCESS_CODE from '@salesforce/label/c.BI_PSPB_ValidAccessCode';
import ACCESS_CODE_KIT from '@salesforce/label/c.BI_PSPB_AccessCodeKit';
import ADD_PHYSICIAN from '@salesforce/label/c.BI_PSPB_AddPhysician';
import CONTACT_INFO from '@salesforce/label/c.BI_PSPB_ContactInformation';
import PHONE_NUM from '@salesforce/label/c.BI_PSPB_PhoneNumberLabel';
import PHONE_NUM_MANDOTORY from '@salesforce/label/c.BI_PSPB_PhoneNumberMandatory';
import VALID_PHONE from '@salesforce/label/c.BI_PSPB_PhysicianPhoneErrMsg';
import OR from '@salesforce/label/c.BI_PSPB_Or';
import EMAIL_LABEL from '@salesforce/label/c.BI_PSP_NotificationEmail';
import ADDRESS_LINE from '@salesforce/label/c.BI_PSPB_AddressLine';
import ADDRESS_LINE_REQUIRED from '@salesforce/label/c.BI_PSPB_AddressLineRequired';
import PREVIOS from '@salesforce/label/c.BI_PSPB_Previous';
import NUM_FOUR from '@salesforce/label/c.BI_PSPB_NumFour';
import NUM_THREE from '@salesforce/label/c.BI_PSPB_NumThree';
import PMC_LABEL from '@salesforce/label/c.BI_PSPB_PrefferedLabel';
import COUNTRY_LABEL from '@salesforce/label/c.BI_PSPB_CountryLabel';
import STATE_LABEL from '@salesforce/label/c.BI_PSPB_StateLabel';
import STREET_LABEL from '@salesforce/label/c.BI_PSPB_StreetAddress';
import ZIP_CODE_LABEL from '@salesforce/label/c.BI_PSPB_ZipCodelabel';
import VALID_ZIP_CODE from '@salesforce/label/c.BI_PSPB_CaregiverValidPinCodeErrMsg';
import CITY_LABEL from '@salesforce/label/c.BI_PSPB_CityLabel';
import VALID_CITY from '@salesforce/label/c.BI_PSPB_ValidCityMsg';
import CITYLABEL from '@salesforce/label/c.BI_PSPB_City';
import CONSENT_INFO from '@salesforce/label/c.BI_PSPB_ConsentInformation';
import TERMS from '@salesforce/label/c.BI_PSPB_Terms';
import AGREE_MSG from '@salesforce/label/c.BI_PSPB_AgreeErrMsg';
import TERMS_AND_CONDITION from '@salesforce/label/c.BI_PSPB_TermsAndCondition';
import SUBMIT from '@salesforce/label/c.BI_PSP_ButtonSubmit';
import PROGRESS_LABEL from '@salesforce/label/c.BI_PSPB_ProgressLabel';
import ACCOUNT_EXIST from '@salesforce/label/c.BI_PSPB_AccountExist';
import ACCOUNT_EXIST_MSG from '@salesforce/label/c.BI_PSPB_AccountExistMsg';
import GO_TO_LOGIN from '@salesforce/label/c.BI_PSPB_GoToLogin';
import CONTENT_ONE from '@salesforce/label/c.BI_PSPB_ContentOne';
import CONTENT_TWO from '@salesforce/label/c.BI_PSPB_ContentTwo';
import CONTENT_THREE from '@salesforce/label/c.BI_PSPB_ContentThree';
import CONTENT_FOUR from '@salesforce/label/c.BI_PSPB_ContentFour';
import CONTENT_FIVE from '@salesforce/label/c.BI_PSPB_ContentFive';
import CONTENT_SIX from '@salesforce/label/c.BI_PSPB_ContentSix';
import PLACE_FIRST from '@salesforce/label/c.BI_PSPB_EnterFirstName';
import PLACE_LAST from '@salesforce/label/c.BI_PSPB_EnterLastName';
import PLACE_DOB from '@salesforce/label/c.BI_PSPB_DobPlaceHolder';
import PLACE_SELECT from '@salesforce/label/c.BI_PSP_Select';
import PLACE_EMAIL from '@salesforce/label/c.BI_PSPB_EnterEmail';
import PLACE_PHYSICIAN from '@salesforce/label/c.BI_PSPB_EnterPhysicianName';
import PLACE_ACCESS from '@salesforce/label/c.BI_PSPB_EnterAccessCode';
import PLACE_PHONE from '@salesforce/label/c.BI_PSPB_EnterPhoneNumber';
import PLACE_ADDRESS from '@salesforce/label/c.BI_PSPB_EnterAdress';
import PLACE_COUNTRY from '@salesforce/label/c.BI_PSPB_SelectCountry';
import PLACE_STATE from '@salesforce/label/c.BI_PSPB_SelectState';
import PLACE_CITY from '@salesforce/label/c.BI_PSPB_EnterCity';
import PLACE_STREET from '@salesforce/label/c.BI_PSPB_EnterStreet';
import PLACE_ZIPCODE from '@salesforce/label/c.BI_PSPB_EnterZipCode';
import LEAD_LABEL from '@salesforce/label/c.BI_PSPB_Lead';
import ONE from '@salesforce/label/c.BI_PSPB_CurrentTabOne';
import TWO from '@salesforce/label/c.BI_PSPB_CurrentTabTwo';
import THREE from '@salesforce/label/c.BI_PSPB_CurrentTabThree';
import FOUR from '@salesforce/label/c.BI_PSPB_CurrentTabFour';
import UNDIFINED from '@salesforce/label/c.BI_PSP_Undefined';
import NEWPRACTITIONER from '@salesforce/label/c.BI_PSPB_NewPractitioner';
import SUBMIT_SUCCESS from '@salesforce/label/c.BI_PSPB_SubmitSuccessfully';
import LOGIN_SUCCESS from '@salesforce/label/c.BI_PSP_LoginSuccess';
import CHANGE from '@salesforce/label/c.BI_PSPB_Change';
import PATIENT_VERIFICATION from '@salesforce/label/c.BI_PSPB_PatientVerification';
import INVALID_DETAILS from '@salesforce/label/c.BI_PSPB_InvalidDetails';
import VALID_DOB from '@salesforce/label/c.BI_PSPB_ValidDateOfBirth';
import CAREGIVER_INFO from '@salesforce/label/c.BI_PSP_CaregiverInfo';
import RELATION_VALUE from '@salesforce/label/c.BI_PSPB_RelationShipValue';
import RELATION_LABEL from '@salesforce/label/c.BI_PSPB_RelationLabel';
//
import THANKS_ENROLL from '@salesforce/label/c.BI_PSPB_ThankForEnroll';
import YOUR_PATIENT from '@salesforce/label/c.BI_PSPB_YourPatientTitle';
import ENROLL_SUMMARY from '@salesforce/label/c.BI_PSPB_EnrollmentSummary';
import NAME_COLAN from '@salesforce/label/c.BI_PSPB_Name';
import DOB_COLAN from '@salesforce/label/c.BI_PSPB_DateOfBirth';
import EMAIL_COLAN from '@salesforce/label/c.BI_PSPB_Email';
import PHONE_COLAN from '@salesforce/label/c.BI_PSPB_PhoneNo';
import PRESCRIPTION_INFO from '@salesforce/label/c.BI_PSPB_PrescriptionInfo';
import PRODUCT_COLAN from '@salesforce/label/c.BI_PSPB_Product';
import PRODUCT_CODE_COLAN from '@salesforce/label/c.BI_PSPB_ProductCode';
import PRESCRIPTED_COLAN from '@salesforce/label/c.BI_PSPB_PrescriptedDate';
import DOSAGE_COLAN from '@salesforce/label/c.BI_PSPB_DosageValue';
import FREQUENCY_COLAN from '@salesforce/label/c.BI_PSPB_FrequencyValue';
import REFILS_COLAN from '@salesforce/label/c.BI_PSPB_Refills';
import QUANTITY_COLAN from '@salesforce/label/c.BI_PSPB_Quentity';
import RELATION_COLAN from '@salesforce/label/c.BI_PSPB_RelationShip';
import TO_ACTIVE from '@salesforce/label/c.BI_PSPB_ToActive';
import ENROLL_THANK from '@salesforce/label/c.BI_PSPB_EnrollThank';
import ADRRESS_COLAN from '@salesforce/label/c.BI_PSPB_AddressColan';
import VERIFY_THE_INFO from '@salesforce/label/c.BI_PSPB_VerifyTheInfo';
import VERIFY_YOUR_INFO from '@salesforce/label/c.BI_PSPB_VerifyYourInfo';
import VERIFY_COMPLETE from '@salesforce/label/c.BI_PSPB_VerificationComplete';
import  ALL_SET from '@salesforce/label/c.BI_PSPB_AllSet';
import CONGRATULATION from '@salesforce/label/c.BI_PSPB_CongratulationPatient';
import LEAVE_THIS_PAGE from '@salesforce/label/c.BI_PSPB_LeaveThisPage';
import CHANGE_MADE from '@salesforce/label/c.BI_PSPB_ChangesYouMade';
import OKAY from '@salesforce/label/c.BI_PSPB_Okay';

import ENROLL_PATIENT from "@salesforce/label/c.BI_PSPB_EnrollPatientValue";
import PHYSICIAN_NAME from "@salesforce/label/c.BI_PSPB_PhysicianName";
import PHYSICIAN_ID from "@salesforce/label/c.BI_PSPB_PhysicianId";
import CLICK_HERE from "@salesforce/label/c.BI_PSPB_ClickHereToAdd";
import LICENSE_NUMBER_VALUE from "@salesforce/label/c.BI_PSPB_LicenseNum";
import LICENSE_VALID from "@salesforce/label/c.BI_PSPB_LicenseNumValid";
import PRACTICE_NAME_LABEL from "@salesforce/label/c.BI_PSPB_PracticeNameValue";
import PRACTICE_REQUIRED from "@salesforce/label/c.BI_PSPB_PracticeRequired";
import PRACTICE_VALID from "@salesforce/label/c.BI_PSPB_PracticeValid";
import PRACTICE_TYPE_VALUE from "@salesforce/label/c.BI_PSPB_PracticeTypeValue";
import FAX_VALUE from "@salesforce/label/c.BI_PSPB_FaxValue";
import FAX_VALID from "@salesforce/label/c.BI_PSPB_FaxValid";
import MATCHING_INFO from "@salesforce/label/c.BI_PSPB_MatchingInfo";
import ALREADY_EXIT from "@salesforce/label/c.BI_PSPB_AlreadyExit";
import PATIENT from "@salesforce/label/c.BI_PSPB_Patient";
import DRUG_LABEL from "@salesforce/label/c.BI_PSPB_DrugLabel";
import UNABLE_TO_DRUG from "@salesforce/label/c.BI_PSPB_UnableToDrug";
import UNITS from "@salesforce/label/c.BI_PSPB_Units";
import PRESCRIPTED_DATE from "@salesforce/label/c.BI_PSPB_PrescritedDate";
import NUMBER_OF_REFILLS from "@salesforce/label/c.BI_PSPB_NumberOfRefills";
import DOSAGE_LABEL from "@salesforce/label/c.BI_PSPB_Dosage";
import QUENTITY from "@salesforce/label/c.BI_PSPB_Quantity";
import FREQUENCY_LABEL from "@salesforce/label/c.BI_PSPB_Frequency";
import DRUG_CODE from "@salesforce/label/c.BI_PSPB_DrugCode";
import PLACE_LICENSE from "@salesforce/label/c.BI_PSPB_PlaceLicense";
import PLACE_PRACTICE from "@salesforce/label/c.BI_PSPB_PlacePracticeName";
import PLACE_FAX from "@salesforce/label/c.BI_PSPB_PlaceFax";
import PLACE_DRUG from "@salesforce/label/c.BI_PSPB_PlaceDrug";
import PLACE_DRUG_CODE from "@salesforce/label/c.BI_PSPB_PlaceDrugCode";
import PLACE_MG from "@salesforce/label/c.BI_PSPB_PlaceMg";
import PLACE_QUANTITY from "@salesforce/label/c.BI_PSPB_PlaceQuantity";
import PLACE_REFILLS from "@salesforce/label/c.BI_PSPB_PlaceRefills";
import FIRSTNAME_VALUE from "@salesforce/label/c.BI_PSPB_FirstName";
import LASTNAME_VALUE from "@salesforce/label/c.BI_PSPB_LastName";
import DOB_VALUE from "@salesforce/label/c.BI_PSPB_Dob";
import GENDER_VALUE from "@salesforce/label/c.BI_PSPB_GenderValue";
import PHONE_VALUE from "@salesforce/label/c.BI_PSPB_PhoneValue";
import RELATIONSHIP_LABEL from "@salesforce/label/c.BI_PSPB_RelationValue";
import PRIVACY_NOTICE from '@salesforce/label/c.BI_PSPB_PrivacyNoticeLabel';
import TERMS_OF_USE from '@salesforce/label/c.BI_PSPB_TermsOfUseLabel';
import CONTACT_US from '@salesforce/label/c.BI_PSPB_ContactUsLabel';
import ERROR_PAGE from '@salesforce/label/c.BI_PSP_DisplayErrorPage';
export const resource = {
	ID,
//
THANK_FOR_CHOOSE,
ERROR_PAGE,
ENROLL_PATIENT ,
PRIVACY_NOTICE,
TERMS_OF_USE,
CONTACT_US,
PHYSICIAN_NAME ,
PHYSICIAN_ID ,
CLICK_HERE ,
LICENSE_NUMBER_VALUE ,
LICENSE_VALID ,
PRACTICE_NAME_LABEL ,
PRACTICE_REQUIRED ,
PRACTICE_VALID ,
PRACTICE_TYPE_VALUE ,
FAX_VALUE ,
FAX_VALID ,
MATCHING_INFO ,
ALREADY_EXIT ,
DRUG_LABEL ,
UNABLE_TO_DRUG ,
UNITS ,
PRESCRIPTED_DATE ,
NUMBER_OF_REFILLS ,
DOSAGE_LABEL ,
QUENTITY ,
FREQUENCY_LABEL ,
DRUG_CODE ,
HCP_LABEL,
PATIENT,
PLACE_LICENSE ,
PLACE_PRACTICE ,
PLACE_FAX ,
PLACE_DRUG ,
PLACE_DRUG_CODE ,
PLACE_MG ,
PLACE_QUANTITY ,
PLACE_REFILLS ,
FIRSTNAME_VALUE ,
LASTNAME_VALUE ,
DOB_VALUE,
GENDER_VALUE ,
PHONE_VALUE ,
RELATIONSHIP_LABEL,
LEAVE_THIS_PAGE,
CHANGE_MADE,
OKAY,
CONGRATULATION,
VERIFY_COMPLETE,
ALL_SET,
VERIFY_THE_INFO,
VERIFY_YOUR_INFO,
TO_ACTIVE,
ENROLL_THANK,
ADRRESS_COLAN,
THANKS_ENROLL,
YOUR_PATIENT ,
ENROLL_SUMMARY ,
NAME_COLAN ,
DOB_COLAN ,
EMAIL_COLAN ,
PHONE_COLAN ,
PRESCRIPTION_INFO ,
PRODUCT_COLAN ,
PRODUCT_CODE_COLAN ,
PRESCRIPTED_COLAN ,
DOSAGE_COLAN ,
FREQUENCY_COLAN ,
REFILS_COLAN ,
QUANTITY_COLAN,
RELATION_COLAN ,

CAREGIVER_INFO,
RELATION_LABEL,
RELATION_VALUE,
PATIENT_VERIFICATION,
VALID_DOB,
INVALID_DETAILS,
FIRST_NAME_LABEL ,
FIRSTNAME_VALIDE,
LASTNAME_VALIDE,
LASTNAME_LABEL ,
DOB_LABEL,
BEFORE_EIGHTINE ,
YEAR_OLDER ,
GENDER_LABEL ,
EMAIL_LABEL_STAR ,
VALIDE_EMAIL ,
EXISTING_EMAIL ,
CANCEL ,
NEXT ,
PHYSICIAN_DETAILS ,
NUM_TWO ,
NUM_ONE ,
PHYSICIAN_INFO ,
PHYSICIAN_INFO_MANDOTORY ,
ACCESS_CODE_MSG ,
HCP_ACCESS_CODE ,
YES_VALUE ,
NO_VALUE ,
SEARCH_PHYSICIAN ,
PHYSICIAN_INFO_VALID ,
UNABLE_TO_FIND ,
ACCESS_CODE ,
VALID_ACCESS_CODE ,
ACCESS_CODE_KIT ,
ADD_PHYSICIAN,
CONTACT_INFO ,
PHONE_NUM ,
PHONE_NUM_MANDOTORY ,
VALID_PHONE ,
OR ,
EMAIL_LABEL ,
ADDRESS_LINE ,
ADDRESS_LINE_REQUIRED ,
PREVIOS ,
NUM_FOUR ,
NUM_THREE ,
PMC_LABEL ,
COUNTRY_LABEL ,
STATE_LABEL ,
STREET_LABEL ,
ZIP_CODE_LABEL ,
VALID_ZIP_CODE ,
CITY_LABEL,
VALID_CITY ,
CITYLABEL,
CONSENT_INFO ,
TERMS ,
AGREE_MSG ,
TERMS_AND_CONDITION ,
SUBMIT ,
PROGRESS_LABEL,
ACCOUNT_EXIST ,
ACCOUNT_EXIST_MSG ,
GO_TO_LOGIN ,
CONTENT_ONE ,
CONTENT_TWO ,
CONTENT_THREE ,
CONTENT_FOUR ,
CONTENT_FIVE ,
CONTENT_SIX ,
PLACE_FIRST ,
PLACE_LAST ,
PLACE_DOB ,
PLACE_SELECT ,
PLACE_EMAIL,
PLACE_PHYSICIAN,
PLACE_ACCESS,
PLACE_PHONE ,
PLACE_ADDRESS,
PLACE_COUNTRY,
PLACE_STATE ,
PLACE_CITY ,
PLACE_STREET ,
PLACE_ZIPCODE ,
FIELD_WIDTH,
LEAD_LABEL,
ARE_MANDOTORY,
PATIENT_ENROLL,
PATIENT_INFO,
ONE,
TWO ,
THREE ,
FOUR ,
UNDIFINED ,
NEWPRACTITIONER ,
SUBMIT_SUCCESS ,
LOGIN_SUCCESS ,
CHANGE ,
	//static
	BGPP,
	IMG,
	TEXT_ALIGN,
	WARNING_ICON,
	CALENDER_ICON,
	ICON_CSS,
	OLD_GUY_JPEG_URL,

	//CustomLabels
	BI_PSPB_Preferred_Communication_Method__c,
	PRIVACYURL,
	CONTACTURL,
	TERMSURL,
	CARE_AVATAR_MSG_ONE,
	CARE_AVATAR_MSG_TWO,
	CARE_AVATAR_MSG_THREE,
	CARE_AVATAR_MSG_FOUR,
	CARE_AVATAR_MSG_FIVE,
	CARE_AVATAR_MSG_SIX,
	CARE_AVATAR_MSG_SEVEN,
	PRE_AVATAR_MSG_ONE,
	PRE_AVATAR_MSG_TWO,
	PRE_AVATAR_MSG_THREE,
	PRE_AVATAR_MSG_FOUR,
	PRE_AVATAR_MSG_FIVE,
	PRE_AVATAR_MSG_SIX,
	P_AVATAR_MSG_ONE,
	P_AVATAR_MSG_TWO,
	P_AVATAR_MSG_THREE,
	P_AVATAR_MSG_FOUR,
	P_AVATAR_MSG_FIVE,
	P_AVATAR_MID_MSG_ONE,
	P_AVATAR_MID_MSG_TWO,
	P_AVATAR_LAST_MSG_ONE,
	P_AVATAR_MOB_MSG_ONE,
	P_AVATAR_MOB_MSG_TWO,
	P_AVATAR_MOB_MSG_THREE,
	P_AVATAR_MOB_MSG_FOUR,
	P_AVATAR_MOB_MSG_FIVE,
	P_AVATAR_MOB_MSG_SIX,
	AVATAR_MSG_ONE,
	AVATAR_MSG_TWO,
	AVATAR_MID_MSG_ONE,
	AVATAR_MID_MSG_TWO,
	AVATAR_MID_MSG_THREE,
	AVATAR_MID_MSG_FOUR,
	AVATAR_MOB_MSG_ONE,
	AVATAR_MOB_MSG_TWO,
	AVATAR_MOB_MSG_THREE,
	HOME_ICON,
	PATIENT_AVATAR,
	HOME_ICON_MOBILE,
	SPEVIGO_LOGO_JPEG_URL,
	BIFOOTER_LOGO_JPEG_URL,
	CAREGIVER_IMG,
	LEAD,
	CONTACT,
	GENDER,
	RELATIONSHIP,
	LEAD_CAREGIVER,
	LEAD_PRESCRIPTION,
	FREQUENCY_UNIT,
	PRACTICE_TYPE,
	THANKYOU_MSG_ONE,
	SEND_AVATAR_MSG,
	THANKYOU_MSG_TWO,
	THANKYOU_MSG_THREE,
	THANKYOU_MSG_FOUR,
	PATIENT_FIRSTNAME,
	IAM_PATIENT_URL,
	MINORAGE,
	PATIENT_LASTNAME,
	PATIENT_DATEOFBIRTH,
	PATIENT_GENDER,
	PATIENT_EMAIL,
	COUNTRY,
	STATE,
	CITY,
	STREET,
	PINCODE,
	PATIENT_PHONE,
	PREFERRED_CONTACT_METHOD,
	ERROR_MESSAGE,
	ERROR_VARIANT,
	DOB_ERROR,
	PS_URL,HCPENROLLMSG,
	SMS,
	PHONE,
	YES,
	ERROR_FOUND,
	SHOW_TOAST,
	REFERRING_PRACTICE,
	LICENSE_NUMBER,
	PRACTICE,
	Minorvalue,
	PRACTICE_TYPE_ERR,
	PHYSICIAN_EMAIL,
	CAREGIVER_RELATIONSHIP,
	CAREGIVER_EMAIL,
	DRUGNAME,
	DRUGCODE,
	DOSAGE,
	DOSAGE_UNITS,
	FREQUENCY,
	FREQUENCY_UNITS,
	PRESCRIBED_DATE,
	PRESCRIBED_FUTURE_DATE,
	LABEL_GENDER,
	LAST_NAME,
	FIRSTNAME,
	HCP,
	LABEL_PRACTICE_NAME,
	LABEL_LICENSE_NUMBER,
	MAILING_POSTAL_CODE,
	MAILING_STREET,
	MAILING_CITY,
	MAILING_STATECODE,
	MAILING_COUNTRYCODE,
	FAX,
	PRACTICE_TYPEE,
	HCP_SUMMARY,
	REFILL,
	FREQUENCY_VALUE,
	DOSAGE_VALUE,
	QUANTITY,
	FREQUCNCY_UNIT,
	DOSAGE_CODE,
	DRUG_NAME,
	CAREGIVER_PHONE,
	CAREGIVER_MAIL,
	CAREGIVER_FIRSTNAME,
	CAREGIVER_LASTNAME,
	CAREGIVER_RELATION,
	EMAIL,
	AGREE,
	BRANDED_URL,
 THANK_FORM_URL ,
 FEMALE, 
 MALE ,
 OTHER ,
 PREFER ,
 PARENT ,
 SIBILING,
 LOVEDONE,
 GUARDIAN ,
 FRIEND ,
 RELATIVE 

}