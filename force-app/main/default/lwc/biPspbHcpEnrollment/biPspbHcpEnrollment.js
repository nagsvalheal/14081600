//This lightningWebcomponent used for Create a lead for Guest User Created By HCP.
//To import libraries
import { LightningElement, wire, track } from "lwc";
import { loadStyle } from "lightning/platformResourceLoader";
import { getObjectInfo,getPicklistValues } from "lightning/uiObjectInfoApi";

//To import Apex class
import CREATE_LEAD_RECORD from "@salesforce/apex/BI_PSPB_EnrollmentHcpAndPatient.createLead";
import CREATE_HCP_RECORD from "@salesforce/apex/BI_PSPB_EnrollmentPhysician.hcpCreate";
import GET_EXISTING_ACCOUNTS from "@salesforce/apex/BI_PSPB_EnrollmentUtilities.getExistingAccounts";
import CREATE_CAREGIVER_RECORD from "@salesforce/apex/BI_PSPB_EnrollmentCaregiver.caregiverCreate";
import CREATE_PRESCRIPTION_RECORD from "@salesforce/apex/BI_PSPB_EnrollmentPrescription.prescriptionCreate";
import CREATE_CONSENT_RECORD from "@salesforce/apex/BI_PSPB_EnrollmentConsent.consentCreate";
import PRODUCT_LIST from "@salesforce/apex/BI_PSPB_ProductListCtrl.getProductList";
import REFERRING_PRACTITIONER from "@salesforce/apex/BI_PSPB_ReferringPractitionerCtrl.getPractitionerList";
import PRESCRITION_DATA from "@salesforce/apex/BI_PSPB_ProductListCtrl.getPrescritionData";
import COUNTRY from "@salesforce/apex/BI_PSPB_EnrollmentUtilities.getCountries";
import STATE from "@salesforce/apex/BI_PSPB_EnrollmentUtilities.getStates";
//To import schema for object

import { resource } from "c/biPspbEnrollmentFormResource";
export default class BiPspbHcpEnrollment extends LightningElement {
	//Html Labels
	placeLicense = resource.PLACE_LICENSE;
	placePractice = resource.PLACE_PRACTICE;
	placeFax = resource.PLACE_FAX;
	placeDrug = resource.PLACE_DRUG;
	placeDrugCode = resource.PLACE_DRUG_CODE;
	placeMg = resource.PLACE_MG;
	placeQuantity = resource.PLACE_QUANTITY;
	placeRefills = resource.PLACE_REFILLS;
	placeFirst = resource.PLACE_FIRST;
	placeLast = resource.PLACE_LAST;
	placeDob = resource.PLACE_DOB;
	placeSelect = resource.PLACE_SELECT;
	placeEmail = resource.PLACE_EMAIL;
	placePhysician = resource.PLACE_PHYSICIAN;
	placeAccess = resource.PLACE_ACCESS;
	placePhone = resource.PLACE_PHONE;
	placeAddress = resource.PLACE_ADDRESS;
	placeCountry = resource.PLACE_COUNTRY;
	placeCity = resource.PLACE_CITY;
	placeState = resource.PLACE_STATE;
	placeStreet = resource.PLACE_STREET;
	placeZip = resource.PLACE_ZIPCODE;
	prescriptedDate = resource.PRESCRIPTED_DATE;
	numberOfRefills = resource.NUMBER_OF_REFILLS;
	quentity = resource.QUENTITY;
	frequency = resource.FREQUENCY_LABEL;
	drugCode = resource.DRUG_CODE;
	dosage = resource.DOSAGE_LABEL;
	units = resource.UNITS;
	drugLabel = resource.DRUG_LABEL;
	unableToDrug = resource.UNABLE_TO_DRUG;
	alreadyExit = resource.ALREADY_EXIT;
	matchingInfo = resource.MATCHING_INFO;
	faxValid = resource.FAX_VALID;
	faxValue = resource.FAX_VALUE;
	practiceType = resource.PRACTICE_TYPE_VALUE;
	practiceRequired = resource.PRACTICE_REQUIRED;
	practiceValid = resource.PRACTICE_VALID;
	practiceName = resource.PRACTICE_NAME_LABEL;
	licenseValid = resource.LICENSE_VALID;
	licenseNumberLabel = resource.LICENSE_NUMBER_VALUE;
	clickHere = resource.CLICK_HERE;
	physicianId = resource.PHYSICIAN_ID;
	enrollPatient = resource.ENROLL_PATIENT;
	physicianName = resource.PHYSICIAN_NAME;
progressLabel = resource.PROGRESS_LABEL;
submit = resource.SUBMIT;
terms = resource.TERMS;
agree = resource.AGREE;
consentInfo = resource.CONSENT_INFO;
prescriptionInfo = resource.PRESCRIPTION_INFO;
fieldWidth = resource.FIELD_WIDTH;
areMandotory = resource.ARE_MANDOTORY ;
patientinfo = resource.PATIENT_INFO ;
firstNameLabel = resource.FIRST_NAME_LABEL ;
firstNameValid = resource.FIRSTNAME_VALIDE ;
lastNameValid = resource.LASTNAME_VALIDE ;
lastNameLabel = resource.LASTNAME_LABEL ;
dobLabel = resource.DOB_LABEL;
patientDobErr = resource.PATIENT_DATEOFBIRTH;
beforeAge = resource.BEFORE_EIGHTINE ;
yearOlder = resource.YEAR_OLDER ;
generalLabel = resource.GENDER_LABEL;
emailLabelMand = resource.EMAIL_LABEL_STAR ;
validEmail = resource.VALIDE_EMAIL ;
existingEmail = resource.EXISTING_EMAIL ;
cancelLabel = resource.CANCEL ;
nextLabel = resource.NEXT ;
numTwo = resource.NUM_TWO;
category = resource.HCP_LABEL;
numOne = resource.NUM_ONE;
physicianInfo = resource.PHYSICIAN_INFO ;
physicianInfoMand = resource.PHYSICIAN_INFO_MANDOTORY ;
unableToFind = resource.UNABLE_TO_FIND ;
contactInfo = resource.CONTACT_INFO ;
phoneNum = resource.PHONE_NUM ;
validPhone = resource.VALID_PHONE ;
or = resource.OR ;
previousValue = resource.PREVIOS ;
numberFour = resource.NUM_FOUR ;
numberThree = resource.NUM_THREE ;
countryLabel = resource.COUNTRY_LABEL;
stateLabel = resource.STATE_LABEL ;
streetLabel = resource.STREET_LABEL ;
zipCodeValue = resource.ZIP_CODE_LABEL ;
validZipCode = resource.VALID_ZIP_CODE ;
cityLabel = resource.CITY_LABEL ;
validCity = resource.VALID_CITY ;
labelCity = resource.CITYLABEL;
relationLabel = resource.RELATION_LABEL;
caregiverInfo = resource.CAREGIVER_INFO;
errorPage  = resource.ERROR_PAGE;
	//Proper naming conventions with camel case for all the variable will be followed in the future releases
	
	searchResults;
	avatarContentTop = resource.AVATAR_MSG_ONE;
	avatarContentMid = resource.AVATAR_MID_MSG_ONE;
	isLoaded = true;
	level = resource.NUM_THREE;
	numThree = false;
	numFour = false;
	practicetype;
	searchResultsOne;
	isButtonDisabled = false;
	searchResultsTwo;
	currentPageUrl;
	urlSegments;
	baseUrl;
	isAdult;
	leadGender;
	FrequencyUnit;
	Relationship;

	mailingCountryCode;
	@track leadFields = {};
	@track caregiverFields = {};
	@track hcpFields = {};
	@track prescriptionFields = {};
	@track consentFields = {};
	fieldMobile = false;
	referringErrorMessage = false;
	firstnameErrorMessage = false;
	lastnameErrorMessage = false;
	relationshipErrorMessage = false;
	dobErrorMessage = false;
	genderErrorMessage = false;
	emailErrorMessage = false;
	careFirstnameErrorMessage = false;
	careLastnameErrorMessage = false;
	careDobErrorMessage = false;
	careEmailErrorMessage = false;
	oneNineZeroZeroErrors = false;
	careOneNineZerZeroErrors = false;
	presOneNineZeroZeroErrors = false;
	code;
	hcpId;
	unique = false;
	matchEmail = false;
	rpFirstnameErrorMessage = false;
	rpLastnameErrorMessage = false;
	rpStateLicenseErrorMessage = false;
	rpPracticeNameErrorMessage = false;
	rpPracticeTypeErrorMessage = false;
	rpPhoneErrorMessage = false;
	rpEmailErrorMessage = false;
	rpStateCodeErrorMessage = false;
	rpCityErrorMessage = false;
	rpStreetErrorMessage = false;
	rpPostalCodeErrorMessage = false;
	drugErrorMessage = false;
	dateErrorMessage = false;
	authorizeErrorMessage = false;
	RpEmailErrorValid = false;
	emailErrorValid = false;
	cEmailErrorValid = false;
	createHcp = false;
	error;
	errors;
	fieldsMandatory = "para";
	errorss;
	minorError;
	isAddNew = false;
	physicianIdInputDisabled = false;
	matchCaregiverEmail = false;
	physicianNameInputDisabled = false;
	addNewHcpSectionClass = "addNewHcpSection";
	searchValueOne = "";
	searchValueTwo = "";
	searchValue = "";
	searchResultEmptyOne;
	searchResultEmptyTwo;
	searchResultEmpty = "";
	selectedunit;
	isSafari = false;
	rpCityErrorMessageValid = false;
	mobileValue = resource.AVATAR_MOB_MSG_ONE;
	divFalse = true;
	firstnameErrorMessagevaild = false;
	lastnameErrorMessagevaild = false;
	phnErrorValid = false;
	rpFirstnameErrorMessageVaild = false;
	rpLastnameErrorMessageValid = false;
	rpStateLicenseErrorMessageValid = false;
	rpFaxErrorMessage = false;
	careFirstnameErrorMessageValid = false;
	careLastnameErrorMessageValid = false;
	popupClass = "popup-hidden";
	currentStep;
	mobileValueTwo = resource.AVATAR_MOB_MSG_THREE;
	openModal = false;
	searchMain = true;
	searchMainTwo = true;
	searchValueLogo = true;
	selectedInitials = "";
	selectedName = "";
	isDropdownOpen = false;
	picklistOrderedTwo = [];
	selectedOption = {
		src: resource.PATIENT_AVATAR,
		name: ""
	};
	StateCode;


	firstNameError = resource.PATIENT_FIRSTNAME;
	refferingPractice = resource.PHYSICIAN_DETAILS;
	lastName = resource.PATIENT_LASTNAME;
	licenseNumber = resource.LICENSE_NUMBER;
	practicetypeError = resource.PRACTICE_TYPE_ERR;
	physicianEmail = resource.PHYSICIAN_EMAIL;
	phoneError = resource.PATIENT_PHONE;
	countrycode = resource.COUNTRY;
	stateCodeError = resource.STATE;
	cityError = resource.CITY;
	streetError = resource.STREET;
	pinCodeError = resource.PINCODE;
	patientDob = resource.PATIENT_DATEOFBIRTH;
	genderField = resource.PATIENT_GENDER;
	futureDateError = resource.DOB_ERROR;
	relationshipError = resource.CAREGIVER_RELATIONSHIP;
	drugError = resource.DRUGNAME;
	prescriptedError = resource.PRESCRIBED_DATE;
	preFutureDate = resource.PRESCRIBED_FUTURE_DATE;
	agreeError = resource.AGREE_MSG;

	BGpp = resource.BGPP;
	warning = resource.WARNING_ICON;
	uniqueEmail;
	uniqueFName;
	uniqueLname;
	uniqueDOB;
	caregiverID;
	prescriptionID;
	consentID;
	selectedCountry;
	selectedAvatarSrc = resource.PATIENT_AVATAR;

	selectedSearchResultTwo;
	hcpIdVariable;
	picklistOrdered = [];
	picklistOrderedOne = [];
	selectedSearchResult;
	selectedSearchResultOne;
	picklistOrderedThree = [];
	selectedSearchResultThree;

	get SELECTED_VALUE() {
		return this.selectedSearchResult?.label || this.searchValue;
	}
	get selectedValueOne() {
		return this.selectedSearchResultOne?.label || this.searchValueOne;
	}
	get selectedValueTwo() {
		return this.selectedSearchResultTwo?.label || this.searchValueTwo;
	}

	get selectedValueThree() {
		return this.selectedSearchResultThree?.label || this.searchValueThree;
	}

	threeclick() {
		this.mobileValue = this.mobileValueTwo;
		this.divFalse = false;
		this.fieldMobile = true;
	}
	handleClose() {
		this.divFalse = true;
		this.fieldMobile = false;
		this.mobileValue = resource.AVATAR_MOB_MSG_ONE;
	}

	
    @wire(getObjectInfo, { objectApiName: resource.LEAD })
    objectInfo;

    @wire(getObjectInfo, { objectApiName: resource.CONTACT })
    objectInfos;

    @wire(getObjectInfo, { objectApiName: resource.LEAD_PRESCRIPTION })
    objectInf;

    @wire(getObjectInfo, { objectApiName: resource.LEAD_CAREGIVER })
    objectInfocaregiver;

    handlePicklistValues({ data, errors }, targetField) {
        try {
            if (data) {
                this[targetField] = data.values;
				this.isLoaded = false;
            } else if (errors) {
                this.HandleToast(errors.body.message);
            }
        } catch (err) {
            this.HandleToast(err.message);
        }
    }

    @wire(getPicklistValues, {
        recordTypeId: "$objectInfo.data.defaultRecordTypeId",
        fieldApiName: resource.GENDER
    })
    leadGenderValues({ data, error }) {
        this.handlePicklistValues({ data, error }, 'leadGender');
    }

    @wire(getPicklistValues, {
        recordTypeId: "$objectInfos.data.defaultRecordTypeId",
        fieldApiName: resource.PRACTICE_TYPE
    })
    practicetypeValues({ data, error }) {
        this.handlePicklistValues({ data, error }, 'practicetype');
    }

    @wire(getPicklistValues, {
        recordTypeId: "$objectInf.data.defaultRecordTypeId",
        fieldApiName: resource.FREQUENCY_UNIT
    })
    FrequencyUnitValues({ data, error }) {
        this.handlePicklistValues({ data, error }, 'FrequencyUnit');
    }

    @wire(getPicklistValues, {
        recordTypeId: "$objectInfocaregiver.data.defaultRecordTypeId",
        fieldApiName: resource.RELATIONSHIP
    })
    RelationshipValues({ data, error }) {
        this.handlePicklistValues({ data, error }, 'Relationship');
    }

    // Example of HandleToast method implementation
    HandleToast(error) {
		let globalThis = window;
		globalThis.sessionStorage.setItem('errorMessage', error);
                        globalThis.location?.assign(this.baseUrl +  resource.BRANDED_URL + this.errorPage );
	
    }

	validateFirstNamePattern() {
		return /^[a-zA-ZÀ-ž\s\-'.`]+$/u;
	}
	PhysicianFnameErr() {
		const FIRST_NAME_FIELD = this.template.querySelector(
			'lightning-input[data-field="pFN"]'
		);
		FIRST_NAME_FIELD.className = "textInput-err";
		this.template.querySelector('div[data-field="pFN"]').className =
			"input-error-label";
	}
	PhysicianFname() {
		const FIRST_NAME_FIELD = this.template.querySelector(
			'lightning-input[data-field="pFN"]'
		);
		FIRST_NAME_FIELD.className = "textInput";
		this.template.querySelector('div[data-field="pFN"]').className =
			"input-label";
	}
	PhysicianLnameErr() {
		const LAST_NAME_CLASS = this.template.querySelector(
			'lightning-input[data-field="pLN"]'
		);
		LAST_NAME_CLASS.className = "textInput-err";
		this.template.querySelector('div[data-field="pLN"]').className =
			"input-error-label";
	}
	PhysicianLname() {
		const LAST_NAME_CLASS = this.template.querySelector(
			'lightning-input[data-field="pLN"]'
		);
		LAST_NAME_CLASS.className = "textInput";
		this.template.querySelector('div[data-field="pLN"]').className =
			"input-label";
	}
	PhysicianEmailErr() {
		const EMAIL_CLASS = this.template.querySelector(
			'lightning-input[data-field="pEmail"]'
		);
		EMAIL_CLASS.className = "textInput-err";
		this.template.querySelector('div[data-field="pEmail"]').className =
			"input-error-label";
	}
	PhysicianEmail() {
		const EMAIL_CLASS = this.template.querySelector(
			'lightning-input[data-field="pEmail"]'
		);
		EMAIL_CLASS.className = "textInput";
		this.template.querySelector('div[data-field="pEmail"]').className =
			"input-label";
	}
	PhysicianPhoneErr() {
		const PHONE_FIELD = this.template.querySelector(
			'lightning-input[data-field="pPhone"]'
		);
		PHONE_FIELD.className = "textInput-err";
		this.template.querySelector('div[data-field="pPhone"]').className =
			"input-error-label";
	}
	PhysicianPhone() {
		const PHONE_FIELD = this.template.querySelector(
			'lightning-input[data-field="pPhone"]'
		);
		PHONE_FIELD.className = "textInput";
		this.template.querySelector('div[data-field="pPhone"]').className =
			"input-label";
	}
	//This is Input onchange function for Patient details form in Hcp Enrollment
	handleInputChange(event) {
		const FIELD_NAME = event.target.name;
		const FIELD_VALUE = event.target.value.trim();

		if (FIELD_NAME === resource.LABEL_GENDER) {
			this.handleGenderChange(FIELD_VALUE);
		} else {
			this.handleFieldChange(FIELD_NAME, FIELD_VALUE);
		}
	}

	handleGenderChange(value) {
		this.selectedGender = value;
	}

	handleFieldChange(fieldName, fieldValue) {
		this.leadFields[fieldName] = fieldValue;

		switch (fieldName) {
			case resource.FIRSTNAME:
				this.handleFirstNameChangeOne(fieldValue);
				break;
			case resource.LAST_NAME:
				this.handleLastNameChangeOne(fieldValue);
				break;
			case resource.EMAIL:
				this.handleEmailChangeOne(fieldValue);
				break;
			case resource.PHONE:
				this.handlePhoneChangeOne(fieldValue);
				break;
			default:
				// Handle other fields if necessary
				break;
		}
	}

	handleFirstNameChangeOne(value) {
		this.leadFields.FirstName = value.charAt(0).toUpperCase() + value.slice(1);

		if (this.leadFields.FirstName === "") {
			this.firstnameErrorMessage = true;
			this.firstnameErrorMessagevaild = false;
			this.PhysicianFnameErr();
		} else if (!this.validateFirstNamePattern().test(this.leadFields.FirstName)) {
			this.firstnameErrorMessagevaild = true;
			this.firstnameErrorMessage = false;
			this.PhysicianFnameErr();
		} else {
			this.firstnameErrorMessagevaild = false;
			this.firstnameErrorMessage = false;
			this.PhysicianFname();
		}
	}

	handleLastNameChangeOne(value) {
		this.leadFields.LastName = value.charAt(0).toUpperCase() + value.slice(1);

		if (this.leadFields.LastName === "") {
			this.lastnameErrorMessage = true;
			this.lastnameErrorMessagevaild = false;
			this.PhysicianLnameErr();
		} else if (!this.validateFirstNamePattern().test(this.leadFields.LastName)) {
			this.lastnameErrorMessagevaild = true;
			this.lastnameErrorMessage = false;
			this.PhysicianLnameErr();
		} else {
			this.lastnameErrorMessagevaild = false;
			this.lastnameErrorMessage = false;
			this.PhysicianLname();
		}
	}

	handleEmailChangeOne(value) {
		this.leadFields.Email = value;

		if (!this.leadFields.Email) {
			this.emailErrorMessage = true;
			this.emailErrorValid = false;
			this.matchEmail = false;
			this.PhysicianEmailErr();
		} else if (!this.validateEmailRegex().test(this.leadFields.Email)) {
			this.emailErrorValid = true;
			this.matchEmail = false;
			this.PhysicianEmailErr();
		} else {
			this.emailErrorMessage = false;
			this.emailErrorValid = false;
			this.matchEmail = false;
			this.emailErrorValid = false;
			this.PhysicianEmail();
		}
	}

	handlePhoneChangeOne(value) {
		this.leadFields.Phone = value;

		if (!this.validatePhoneRegex().test(this.leadFields.Phone)) {
			this.phnErrorValid = true;
			this.PhysicianPhoneErr();
		} else if (this.leadFields.Phone === "") {
			this.phnErrorValid = false;
			this.PhysicianPhone();
		}
		else {
			this.phnErrorValid = false;
			this.PhysicianPhone();
		}


	}
	PhysicianGenderErr() {
		this.template.querySelector(
			'lightning-combobox[data-field="pGender"]'
		).className = "textInput-err";
		this.template.querySelector('div[data-field="pGender"]').className =
			"input-error-label";
	}

	PhysicianGender() {
		this.template.querySelector(
			'lightning-combobox[data-field="pGender"]'
		).className = "textInput";
		this.template.querySelector('div[data-field="pGender"]').className =
			"input-label";
	}
	PatientGenderChange(event) {
		this.selectedGender = event.target.value;
		if (this.selectedGender === "") {
			this.genderErrorMessage = true;

			this.PhysicianGenderErr();
		} else {
			this.genderErrorMessage = false;
			this.PhysicianGender();
		}
	}

	//This is Input onchange function for Physician details form in Hcp Enrollment
	handleInputChangehcp(event) {
		const FIELD_NAME_HCP = event.target.name;
		const TARGET_VALUE_HCP = event.target.value;

		switch (FIELD_NAME_HCP) {
			case resource.FIRSTNAME:
				this.handleFirstNameChange(TARGET_VALUE_HCP, event);
				break;
			case resource.LAST_NAME:
				this.handleLastNameChange(TARGET_VALUE_HCP, event);
				break;
			case resource.LABEL_PRACTICE_NAME:
				this.handlePracticeNameChange(TARGET_VALUE_HCP, event);
				break;
			case resource.LABEL_LICENSE_NUMBER:
				this.handleLicenseNumberChange(TARGET_VALUE_HCP, event);
				break;
			case resource.PRACTICE_TYPEE:
				this.handlePracticeTypeChange(TARGET_VALUE_HCP);
				break;
			case resource.EMAIL:
				this.handleEmailChange(TARGET_VALUE_HCP, event);
				break;
			case resource.PHONE:
				this.handlePhoneChange(TARGET_VALUE_HCP, event);
				break;
			case resource.FAX:
				this.handleFaxChange(TARGET_VALUE_HCP, event);
				break;
			case resource.MAILING_COUNTRYCODE:
				this.handleCountryCodeChange(TARGET_VALUE_HCP);
				break;
			case resource.MAILING_STATECODE:
				this.handleStateCodeChange(TARGET_VALUE_HCP);
				break;
			case resource.MAILING_CITY:
				this.handleCityChange(TARGET_VALUE_HCP, event);
				break;
			case resource.MAILING_STREET:
				this.handleStreetChange(TARGET_VALUE_HCP);
				break;
			case resource.MAILING_POSTAL_CODE:
				this.handlePostalCodeChange(TARGET_VALUE_HCP, event);
				break;
			default:
			// do nothing

		}
	}
	FirstNameTextErr() {
		const FIRST_NAME_FIELD = this.template.querySelector('lightning-input[data-field="hFN"]');
		FIRST_NAME_FIELD.className = "textInput-err";
		this.template.querySelector('div[data-field="hFN"]').className = "input-error-label";
	}
	FirstNameText() {
		const FIRST_NAME_FIELD = this.template.querySelector('lightning-input[data-field="hFN"]');
		FIRST_NAME_FIELD.className = "textInput";
		this.template.querySelector('div[data-field="hFN"]').className = "input-label";
	}
	handleFirstNameChange(value) {
		this.hcpFields.firstname = value.trim().charAt(0).toUpperCase() + value.trim().slice(1);
		if (this.hcpFields.firstname === "") {
			this.rpFirstnameErrorMessage = true;
			this.rpFirstnameErrorMessageVaild = false;
			this.FirstNameTextErr();
		} else if (!this.validateFirstNamePattern().test(this.hcpFields.firstname)) {
			this.FirstNameTextErr();
			this.rpFirstnameErrorMessageVaild = true;
			this.rpFirstnameErrorMessage = false;
		} else {
			this.rpFirstnameErrorMessageVaild = false;
			this.rpFirstnameErrorMessage = false;
			this.FirstNameText();
		}
	}
	LastNameErr() {
		const LAST_NAME_FIELD = this.template.querySelector('lightning-input[data-field="hLN"]');
		LAST_NAME_FIELD.className = "textInput-err";
		this.template.querySelector('div[data-field="hLN"]').className = "input-error-label";
	}
	LastNameText() {
		const LAST_NAME_FIELD = this.template.querySelector('lightning-input[data-field="hLN"]');
		LAST_NAME_FIELD.className = "textInput";
		this.template.querySelector('div[data-field="hLN"]').className = "input-label";
	}
	handleLastNameChange(value) {
		this.hcpFields.lastname = value.trim().charAt(0).toUpperCase() + value.trim().slice(1);
		if (this.hcpFields.lastname === "") {
			this.rpLastnameErrorMessage = true;
			this.rpLastnameErrorMessageValid = false;
			this.LastNameErr();
		} else if (!this.validateFirstNamePattern().test(this.hcpFields.lastname)) {
			this.LastNameErr();
			this.rpLastnameErrorMessageValid = true;
			this.rpLastnameErrorMessage = false;
		} else {
			this.rpLastnameErrorMessageValid = false;
			this.rpLastnameErrorMessage = false;
			this.LastNameText();
		}
	}
	PracticeNameErr() {
		const PRACTICE_NAME = this.template.querySelector('lightning-input[data-field="hPN"]');
		PRACTICE_NAME.className = "textInput-err";
		this.template.querySelector('div[data-field="hPN"]').className = "input-error-label";
	}
	PracticeName() {
		const PRACTICE_NAME = this.template.querySelector('lightning-input[data-field="hPN"]');
		PRACTICE_NAME.className = "textInput";
		this.template.querySelector('div[data-field="hPN"]').className = "input-label";
	}
	handlePracticeNameChange(value) {
		this.hcpFields.PRACTICE_NAME = value.charAt(0).toUpperCase() + value.slice(1);


		if (this.hcpFields.PRACTICE_NAME === "") {
			this.rpPracticeNameErrorMessage = true;
			this.RPPracticenameerrorMessagevalid = false;
			this.PracticeNameErr();
		} else if (!this.validateFirstNamePattern().test(this.hcpFields.PRACTICE_NAME)) {
			this.RPPracticenameerrorMessagevalid = true;
			this.rpPracticeNameErrorMessage = false;
			this.PracticeNameErr();
		} else {
			this.RPPracticenameerrorMessagevalid = false;
			this.rpPracticeNameErrorMessage = false;
			this.PracticeName();
		}
	}
	LicenseNumberErr() {
		const LICENSE_FIELD = this.template.querySelector('lightning-input[data-field="hLicense"]');
		LICENSE_FIELD.className = "textInput-err";
		this.template.querySelector('div[data-field="hLicense"]').className = "input-error-label";
	}
	LicenseNumber() {
		const LICENSE_FIELD = this.template.querySelector('lightning-input[data-field="hLicense"]');
		LICENSE_FIELD.className = "textInput";
		this.template.querySelector('div[data-field="hLicense"]').className = "input-label";
	}
	validateLisencePattern() {
		return /^\d+$/u;
	}
	handleLicenseNumberChange(value) {
		this.hcpFields.license = value;


		if (!this.validateLisencePattern().test(this.hcpFields.license)) {
			this.rpStateLicenseErrorMessage = false;
			this.rpStateLicenseErrorMessageValid = true;
			this.LicenseNumberErr();
		} else {
			this.rpStateLicenseErrorMessageValid = false;
			if (this.hcpFields.license === "") {
				this.rpStateLicenseErrorMessage = true;
				this.rpStateLicenseErrorMessageValid = false;
				this.LicenseNumberErr();
			} else {
				this.rpStateLicenseErrorMessage = false;
				this.rpStateLicenseErrorMessageValid = false;
				this.LicenseNumber();
			}
		}
	}
	PracticeFieldErr() {
		const PRACTICE_FIELD = this.template.querySelector('lightning-combobox[data-field="hType"]');
		PRACTICE_FIELD.className = "textInput-err";
		this.template.querySelector('div[data-field="hType"]').className = "input-error-label";
	}
	PracticeField() {
		const PRACTICE_FIELD = this.template.querySelector('lightning-combobox[data-field="hType"]');
		PRACTICE_FIELD.className = "textInput";
		this.template.querySelector('div[data-field="hType"]').className = "input-label";
	}
	handlePracticeTypeChange(value) {

		this.selectedtype = value;

		if (!this.selectedtype) {
			this.rpPracticeTypeErrorMessage = true;
			this.PracticeFieldErr();
		}
		else{
			this.rpPracticeTypeErrorMessage = false;
			this.PracticeField();
		}
	}
	EmailFieldErr() {
		const EMAIL_FIELD = this.template.querySelector('lightning-input[data-field="hEmail"]');
		EMAIL_FIELD.className = "textInput-err";
		this.template.querySelector('div[data-field="hEmail"]').className = "input-error-label";
	}
	EmailField() {
		const EMAIL_FIELD = this.template.querySelector('lightning-input[data-field="hEmail"]');
		EMAIL_FIELD.className = "textInput";
		this.template.querySelector('div[data-field="hEmail"]').className = "input-label";
	}
	handleEmailChange(value) {
		this.hcpFields.email = value;

		if (!this.hcpFields.email) {
			this.rpEmailErrorMessage = false;
			this.RpEmailErrorValid = false;
			this.EmailField();
		} else if (!this.validateEmailRegex().test(this.hcpFields.email)) {
			this.RpEmailErrorValid = true;
			this.rpEmailErrorMessage = false;
			this.EmailFieldErr();
		} else {
			this.rpEmailErrorMessage = false;
			this.RpEmailErrorValid = false;
			this.EmailField();
		}
	}
	PhoneFieldErr() {
		const PHONE_FIELD = this.template.querySelector('lightning-input[data-field="hPhone"]');
		PHONE_FIELD.className = "textInput-err";
		this.template.querySelector('div[data-field="hPhone"]').className = "input-error-label";
	}
	PhoneField() {
		const PHONE_FIELD = this.template.querySelector('lightning-input[data-field="hPhone"]');
		PHONE_FIELD.className = "textInput";
		this.template.querySelector('div[data-field="hPhone"]').className = "input-label";
	}
	handlePhoneChange(value) {
		this.hcpFields.phone = value;
		if (this.hcpFields.phone) {
			if (!this.validatePhoneRegex().test(this.hcpFields.phone)) {
				this.rpPhoneErrorMessage = true;
				this.PhoneFieldErr();
			} else {
				this.rpPhoneErrorMessage = false;
				this.PhoneField();
			}
		} else {
			this.rpPhoneErrorMessage = false;
			this.PhoneField();
		}
	}
	FaxFieldErr() {
		const FAX_FIELD = this.template.querySelector('lightning-input[data-field="hFax"]');
		FAX_FIELD.className = "textInput-err";
		this.template.querySelector('div[data-field="hFax"]').className = "input-error-label";
	}
	FaxField() {
		const FAX_FIELD = this.template.querySelector('lightning-input[data-field="hFax"]');
		FAX_FIELD.className = "textInput";
		this.template.querySelector('div[data-field="hFax"]').className = "input-label";
	}
	handleFaxChange(value) {
		this.hcpFields.fax = value;
		if (this.hcpFields.fax) {
			if (!this.validatePhoneRegex().test(this.hcpFields.fax)) {
				this.rpFaxErrorMessage = true;
				this.FaxFieldErr();
			} else {
				this.rpFaxErrorMessage = false;
				this.FaxField();
			}
		} else {
			this.rpFaxErrorMessage = false;
			this.FaxField();
		}
	}
	CountryFieldErr() {
		const MAILING_COUNTRY_CODE_FIELD = this.template.querySelector('lightning-combobox[data-field="hcc"]');
		MAILING_COUNTRY_CODE_FIELD.className = "textInput-err";
		this.template.querySelector('div[data-field="hcc"]').className = "input-error-label";
	}
	CountryField() {
		const MAILING_COUNTRY_CODE_FIELD = this.template.querySelector('lightning-combobox[data-field="hcc"]');
		MAILING_COUNTRY_CODE_FIELD.className = "textInput";
		this.template.querySelector('div[data-field="hcc"]').className = "input-label";
	}
	handleCountryCodeChange(value) {
		this.selectedCountry = value;


		if (!this.selectedCountry) {
			this.RPcountryerrorMessage = true;
			this.CountryFieldErr();
		} else {
			this.RPcountryerrorMessage = false;
			this.CountryFieldErr();
		}
	}

	handleStateCodeChange(value) {
		this.selectedstate = value;
		const MAILING_STATE_CODE_FIELD = this.template.querySelector('lightning-combobox[data-field="hsc"]');
		if (!this.selectedstate) {
			this.rpStateCodeErrorMessage = false;
			MAILING_STATE_CODE_FIELD.className = "textInput";
			this.template.querySelector('div[data-field="hsc"]').className = "input-label";
		}
		else{
			this.rpStateCodeErrorMessage = false;
			MAILING_STATE_CODE_FIELD.className = "textInput";
			this.template.querySelector('div[data-field="hsc"]').className = "input-label";
		}
	}
	CityFieldErr() {
		const CITY_FIELD = this.template.querySelector('lightning-input[data-field="hc"]');
		CITY_FIELD.className = "textInput-err";
		this.template.querySelector('div[data-field="hc"]').className = "input-error-label";
	}
	CityField() {
		const CITY_FIELD = this.template.querySelector('lightning-input[data-field="hc"]');
		CITY_FIELD.className = "textInput";
		this.template.querySelector('div[data-field="hc"]').className = "input-label";
	}
	handleCityChange(value) {
		this.hcpFields.city = value;

		if (this.hcpFields.city === "") {
			this.rpCityErrorMessage = true;
			this.rpCityErrorMessageValid = false;
			this.CityFieldErr();
		} else if (!this.validateFirstNamePattern().test(this.hcpFields.city)) {
			this.rpCityErrorMessage = false;
			this.rpCityErrorMessageValid = true;
			this.CityFieldErr();
		} else {
			this.rpCityErrorMessage = false;
			this.rpCityErrorMessageValid = false;
			this.CityField();
		}
	}
	StreetFieldErr() {
		const MAILING_STREET_FIELD = this.template.querySelector('lightning-textarea[data-field="hs"]');
		MAILING_STREET_FIELD.className = "textInput-err";
		this.template.querySelector('div[data-field="hs"]').className = "input-error-label";
	}
	StreetField() {
		const MAILING_STREET_FIELD = this.template.querySelector('lightning-textarea[data-field="hs"]');
		MAILING_STREET_FIELD.className = "textInput";
		this.template.querySelector('div[data-field="hs"]').className = "input-label";
	}
	handleStreetChange(value) {
		this.hcpFields.street = value;


		if (!this.hcpFields.street) {
			this.rpStreetErrorMessage = true;
			this.StreetFieldErr();
		} else {
			this.rpStreetErrorMessage = false;
			this.StreetField();
		}
	}
	ZipCodeRegex() {
		return /^[a-zA-Z0-9]+$/u;
	}
	PinCodeErr() {
		const ZIP_CODE = this.template.querySelector('lightning-input[data-field="hpc"]');
		ZIP_CODE.className = "textInput-err";
		this.template.querySelector('div[data-field="hpc"]').className = "input-error-label";

	}
	PinCode() {
		const ZIP_CODE = this.template.querySelector('lightning-input[data-field="hpc"]');
		ZIP_CODE.className = "textInput";
		this.template.querySelector('div[data-field="hpc"]').className = "input-label";

	}
	handlePostalCodeChange(value) {
		this.hcpFields.code = value;

		if (this.hcpFields.code) {
			if (!this.ZipCodeRegex().test(this.hcpFields.code)) {
				this.rpPostalCodeErrorMessage = false;
				this.RPpostalerrorMessagevalid = true;
				this.PinCodeErr();
			} else {
				this.rpPostalCodeErrorMessage = false;
				this.RPpostalerrorMessagevalid = false;
				this.PinCode();
			}
		} else {
			this.rpPostalCodeErrorMessage = true;
			this.RPpostalerrorMessagevalid = false;
			this.PinCodeErr();
		}
	}


	//This is Input onchange function for Caregiver details form in Hcp Enrollment
	handleInputChangeCaregiver(event) {
		const FIELD_NAME_CAREGIVER = event.target.name;
		const TARGET_VALUE_CAREGIVER = event.target.value;

		this.dispatchCaregiverFieldChange(FIELD_NAME_CAREGIVER, TARGET_VALUE_CAREGIVER, event);
	}

	dispatchCaregiverFieldChange(fieldName, fieldValue, event) {
		switch (fieldName) {
			case resource.CAREGIVER_FIRSTNAME:
				this.handleCaregiverFirstNameChange(fieldValue, event);
				break;
			case resource.CAREGIVER_LASTNAME:
				this.handleCaregiverLastNameChange(fieldValue, event);
				break;
			case resource.CAREGIVER_MAIL:
				this.handleCaregiverEmailChange(fieldValue, event);
				break;
			case resource.CAREGIVER_PHONE:
				this.handleCaregiverPhoneChange(fieldValue, event);
				break;
			case resource.CAREGIVER_RELATION:
				this.handleCaregiverRelationChange(fieldValue, event);
				break;
			default:
				break;
		}
	}
	CaregiverFnameErr() {
		this.template.querySelector("lightning-input.cFN").className = "textInput-err cFN";
		this.template.querySelector("div.cFN").className = "input-error-label cFN";
	}
	CaregiverFname() {
		this.template.querySelector("lightning-input.cFN").className = "textInput cFN";
		this.template.querySelector("div.cFN").className = "input-label cFN";
	}
	handleCaregiverFirstNameChange(value) {
		this.caregiverFields.FirstName = value.trim().charAt(0).toUpperCase() + value.trim().slice(1);
		if (this.caregiverFields.FirstName === "") {
			this.careFirstnameErrorMessage = true;
			this.careFirstnameErrorMessageValid = false;
			this.CaregiverFnameErr();
		} else if (!this.validateFirstNamePattern().test(this.caregiverFields.FirstName)) {
			this.careFirstnameErrorMessageValid = true;
			this.careFirstnameErrorMessage = false;
			this.CaregiverFnameErr();
		} else {
			this.careFirstnameErrorMessageValid = false;
			this.careFirstnameErrorMessage = false;
			this.CaregiverFname();
		}
	}
	CaregiverLnameErr() {
		this.template.querySelector("lightning-input.cLN").className = "textInput-err cLN";
		this.template.querySelector("div.cLN").className = "input-error-label cLN";
	}
	CaregiverLname() {
		this.template.querySelector("lightning-input.cLN").className = "textInput cLN";
		this.template.querySelector("div.cLN").className = "input-label cLN";
	}
	handleCaregiverLastNameChange(value) {
		this.caregiverFields.LastName = value.trim().charAt(0).toUpperCase() + value.trim().slice(1);
		if (this.caregiverFields.LastName === "") {
			this.careLastnameErrorMessage = true;
			this.careLastnameErrorMessageValid = false;
			this.CaregiverLnameErr();
		} else if (!this.validateFirstNamePattern().test(this.caregiverFields.LastName)) {
			this.careLastnameErrorMessageValid = true;
			this.careLastnameErrorMessage = false;
			this.CaregiverLnameErr();
		} else {
			this.careLastnameErrorMessageValid = false;
			this.careLastnameErrorMessage = false;
			this.CaregiverLname();
		}
	}
	CaregiverEmailErr() {
		this.template.querySelector("lightning-input.cEmail").className = "textInput-err cEmail";
		this.template.querySelector("div.cEmail").className = "input-error-label cEmail";
	}
	CaregiverEmail() {
		this.template.querySelector("lightning-input.cEmail").className = "textInput cEmail";
		this.template.querySelector("div.cEmail").className = "input-label cEmail";
	}
	handleCaregiverEmailChange(value) {
		this.caregiverFields.Email = value;
		if (!this.caregiverFields.Email) {
			this.careEmailErrorMessage = true;
			this.matchCaregiverEmail = false;
			this.cEmailErrorValid = false;
			this.CaregiverEmailErr();
		} else {
			this.careEmailErrorMessage = false;
			this.matchCaregiverEmail = false;
			if (!this.validateEmailRegex().test(this.caregiverFields.Email)) {
				this.cEmailErrorValid = true;
				this.matchCaregiverEmail = false;
				this.CaregiverEmailErr();
			} else {
				this.cEmailErrorValid = false;
				this.CaregiverEmail();
			}
		}
	}
	CaregiverPhoneErr() {
		const PHONE_FIELD = this.template.querySelector('lightning-input[data-field="cPhone"]');
		PHONE_FIELD.className = "textInput-err";
		this.template.querySelector('div[data-field="cPhone"]').className = "input-error-label";
	}
	CaregiverPhone() {
		const PHONE_FIELD = this.template.querySelector('lightning-input[data-field="cPhone"]');
		PHONE_FIELD.className = "textInput";
		this.template.querySelector('div[data-field="cPhone"]').className = "input-label";
	}
	handleCaregiverPhoneChange(value) {
		this.caregiverFields.Phone = value;

		if (!this.validatePhoneRegex().test(this.caregiverFields.Phone)) {
			this.cphoneerrorvalid = true;
			this.CaregiverPhoneErr();
		} else {
			this.cphoneerrorvalid = false;
			this.CaregiverPhone();

		}
		if (this.caregiverFields.Phone === "") {
			this.cphoneerrorvalid = false;
			this.CaregiverPhone();
		}
	}
	CaregiverRelationErr() {
		this.template.querySelector("lightning-combobox.cRel").className = "textInput-err cRel";
		this.template.querySelector("div.cRel").className = "input-error-label cRel";
	}
	CaregiverRelation() {
		this.template.querySelector("lightning-combobox.cRel").className = "textInput cRel";
		this.template.querySelector("div.cRel").className = "input-label cRel";
	}
	handleCaregiverRelationChange(value) {
		this.selectedRelationship = value;
		if (!this.selectedRelationship) {
			this.relationshipErrorMessage = true;
			this.CaregiverRelationErr();
		
		} else {
			this.relationshipErrorMessage = false;
			this.CaregiverRelation();
			
		}
	}

	//This is Input onchange function for Prescription details form in Hcp Enrollment
	handleInputChange2(event) {
		const FIELD_NAME = event.target.name;
		const TARGET_VALUE = event.target.value;

		switch (FIELD_NAME) {
			case resource.DOSAGE_CODE:
				this.prescriptionFields.DosageCode = TARGET_VALUE;
				break;
			case resource.FREQUCNCY_UNIT:
				this.selectedunit = TARGET_VALUE;
				break;
			case resource.DOSAGE_VALUE:
				this.prescriptionFields.Dosage = TARGET_VALUE;
				break;
			case resource.QUANTITY:
				if (!this.isNumeric(TARGET_VALUE)) {
					// If not numeric, clear the input value
					this.prescriptionFields.Quantity = "";
				} else {
					// If numeric, update the Quantity value
					this.prescriptionFields.Quantity = TARGET_VALUE;
				}
				break;
			case resource.FREQUENCY_VALUE:
				this.prescriptionFields.Frequency = TARGET_VALUE;
				break;
			case resource.REFILL:
				this.prescriptionFields.refill = TARGET_VALUE;
				break;
			case resource.DRUG_NAME:
				this.SELECTED_VALUE = TARGET_VALUE;
				break;
			default:
				// Do nothing for unhandled field names
				break;
		}
	}

	isNumeric(value) {
		return /^\d+$/u.test(value);
	}
	CheckBoxErr() {
		const checkBox = this.template.querySelector('span[data-field="checkbox"]');
		checkBox.className = "custom-checkbox-box_Error";
	}
	CheckBox() {
		const checkBox = this.template.querySelector('span[data-field="checkbox"]');
		checkBox.className = "custom-checkbox-box";
	}
	//This is onchange function for term and conditions in Hcp Enrollment
	handleInputChange3(event) {
		const TARGET_VALUE_AGREE = event.target.checked;
		this.consentFields.authorize = TARGET_VALUE_AGREE;

		if (this.consentFields.authorize === "") {
			this.authorizeErrorMessage = true;
			this.CheckBoxErr();
		} else {
			this.authorizeErrorMessage = false;
			this.CheckBox();
		}
	}

	//This function is used for creating lead in hcp enrollment
	handleCreateLead() {
		let globalThis = window;
		if (this.PrescriptionFieldsForm() && this.authorize() && !this.errorss) {
			this.isButtonDisabled = true;

			let hcpData = {
				firstName: this.hcpFields.firstname,
				lastName: this.hcpFields.lastname,
				email: this.hcpFields.email,
				phone: this.hcpFields.phone,
				city: this.hcpFields.city,
				street: this.hcpFields.street,
				country: this.selectedCountry,
				state: this.selectedstate,
				code: this.hcpFields.code
			};
			let hcpdetail = {
				practice: this.hcpFields.PRACTICE_NAME,
				type: this.selectedtype,
				lisence: this.hcpFields.license,
			}

			if (!this.hcpId) {
				CREATE_HCP_RECORD({ hcpData: hcpData ,hcpdetail: hcpdetail })
					.then((resulthcpId) => {
						this.hcpId = resulthcpId;
						this.createHcp = true;

						this.createLeadRecord();
					})
					.catch((error) => {
						this.isButtonDisabled = false;
						globalThis.sessionStorage.setItem('errorMessage', error.body.message);
                        globalThis.location?.assign(this.baseUrl +  resource.BRANDED_URL + this.errorPage );
					});
			} else {
				this.createLeadRecord();
			}
		} else {
			this.avatarContentTop = resource.AVATAR_MSG_ONE;
			this.avatarContentMid = resource.AVATAR_MID_MSG_FOUR;
		}
	}

	createLeadRecord() {
		let globalThis = window;
		const SEX = this.selectedGender;
		const { FirstName, LastName, Email, Phone, dob } = this.leadFields;

		let data = {
			firstName: FirstName,
			lastName: LastName,
			email: Email || "",
			dob: dob,
			phone: Phone || "",
			sex: SEX
		};

		CREATE_LEAD_RECORD({
			data: data,
			hcpId: this.hcpId,
		})
			.then((leadId) => {
				localStorage.setItem("recordId", leadId);
				localStorage.setItem("count", 1);
				this.isLoaded = true;
				this.handlesuccess(leadId);
				this.resetForm();
			})
			.catch((error) => {
				
				this.isButtonDisabled = false;
				globalThis.sessionStorage.setItem('errorMessage', error.body.message);
                        globalThis.location?.assign(this.baseUrl +  resource.BRANDED_URL + this.errorPage );
			});
	}


	//This function is used for creating Caregiver and lead consent in hcp enrollment
	handlesuccess(leadId) {
		
		if (this.isAdult === false) {
			
		this.createCaregiverRecord(leadId);
		}
		this.createPrescriptionRecord(leadId);
		this.createConsentRecord(leadId);
	}

	createCaregiverRecord(leadId) {
		let globalThis = window;
		const RELATIONSHIP_TO_PATIENT = this.selectedRelationship;

		let caregiverData = {
			firstName: this.caregiverFields.FirstName,
			lastName: this.caregiverFields.LastName,
			email: this.caregiverFields.Email,
			phone: this.caregiverFields.Phone ? this.caregiverFields.Phone : "",
			relation: RELATIONSHIP_TO_PATIENT,
			dob: this.caregiverFields.dob
		};

		CREATE_CAREGIVER_RECORD({ caregiverData: caregiverData, leadId: leadId })
			.then((careID) => {
				this.caregiverID = careID;
			})
			.catch((error) => {
				globalThis.sessionStorage.setItem('errorMessage', error.body.message);
                        globalThis.location?.assign(this.baseUrl +  resource.BRANDED_URL + this.errorPage );
			});
	}

	createPrescriptionRecord(leadId) {
		let globalThis = window;
		const { Quantity, refill, date } = this.prescriptionFields;
		

		let prescriptionData = {
			drug: this.SELECTED_VALUE,
			unit: this.selectedunit,
			frequency: this.prescriptionFields.Frequency,
			refill: refill ,
			quantity: Quantity
		};
		let data = {
			dob: date
			}


		CREATE_PRESCRIPTION_RECORD({
			prescriptionData: prescriptionData,
			leadId: leadId,data: data
			
		})
			.then((prescriptionID) => {
				this.prescriptionID = prescriptionID;
			})
			.catch((error) => {
				globalThis.sessionStorage.setItem('errorMessage', error.body.message);
                        globalThis.location?.assign(this.baseUrl +  resource.BRANDED_URL + this.errorPage );
			});
	}

	createConsentRecord(leadId) {
		let globalThis = window;

		CREATE_CONSENT_RECORD({ category: this.category, leadId: leadId })
			.then((consentID) => {
				this.consentID = consentID;
				window.location.href = resource.BRANDED_URL + resource.HCP_SUMMARY;
			})
			.catch((error) => {
				globalThis.sessionStorage.setItem('errorMessage', error.body.message);
                        globalThis.location?.assign(this.baseUrl +  resource.BRANDED_URL + this.errorPage );
			});
	}


	resetForm() {
		// Clear form fields
		this.leadFields = {};
		this.caregiverFields = {};
	}
	connectedCallback() {
		let globalThis = window;
		try {
			this.currentPageUrl = globalThis.location?.href;
            this.urlSegments = this.currentPageUrl.split("/");
            this.baseUrl = `${this.urlSegments[0]}//${this.urlSegments[2]}`;
			PRODUCT_LIST()
				// The error handle with null value throw from apex
				.then((result) => {
					if (result !== null && result.length > 0) {
						loadStyle(this, resource.ICON_CSS);
						loadStyle(this, resource.TEXT_ALIGN);
						let i;
						for (i = 0; i < result.length; i++) {
							this.picklistOrdered.push({
								label: result[i].Name,
								value: result[i].Id
							});
						}

						this.picklistOrdered = this.picklistOrdered.sort((a, b) => {
							if (a.label < b.label) {
								return -1;
							} else if (a.label > b.label) {
								return 1;
							}
							return 0; // If a.label is equal to b.label
						});
					} else if (result === null) {
						this.HandleToast(resource.ERROR_FOUND); // Catching Potential Error from apex
					}
				})
				.catch((error) => {
					this.HandleToast(error.body.message); // Catching Potential Error from lwc
				});

			REFERRING_PRACTITIONER()
				.then((result) => {

					if (result.length > 0) {
						let picklistOrderedOne = [];
						let picklistOrderedTwo = [];

						result.forEach(item => {
							if (item.BI_PSPB_License_number__c !== undefined) {
								picklistOrderedTwo.push({
									label: item.BI_PSPB_License_number__c,
									value: item.Id
								});
							} 
							if (result != null) {
								picklistOrderedOne.push({
									label: item.Name,
									labelForSpecialist: item?.BI_PSPB_Specialist__c,
									labelForCity: item?.MailingCity,
									value: item.Id
								});
							}
						});

						if (picklistOrderedOne.length > 0) {
							this.picklistOrderedOne = picklistOrderedOne.sort((a, b) => a.label.localeCompare(b.label));
						}

						if (picklistOrderedTwo.length > 0) {
							this.picklistOrderedTwo = picklistOrderedTwo.sort((a, b) => a.label.localeCompare(b.label));
						}
					}
				})
				.catch((error) => {
					this.HandleToast(error.body.message); // Handle errors from LWC
				});


		} catch (error) {
			this.HandleToast(error.body.message);
		}
	}

		



	openPopUp() {
		this.popupClass = "popup-visible";
	}

	HCPSubmit() {
		if (!this.HCPvalidateForm()) {
			// To call the method
			//no need to return
		}
	}
	Cancel() {
		this.popupClass = "popup-hidden";
	}

	goBackToStepOne() {
		this.handleClose();
		this.currentStep = resource.ONE;
		this.template.querySelector("div.stepTwo").classList.add("slds-hide");
		this.template.querySelector("div.stepOne").classList.remove("slds-hide");
		// Progress indicator
		this.template.querySelector("li.li-two").classList.remove("slds-is-active");
		this.template
			.querySelector("li.li-one")
			.classList.remove("slds-is-completed");
		this.template.querySelector("li.li-one").classList.add("slds-is-active");
		//To achieve the mobile responsiveness, the following strings are hard coded. Custom Labels can't be used, since they truncate the strings.
		//To achieve mobile responsiveness, we are using innerHTML. However, when attempting to use textContent, it does not meet the design requirements
		this.avatarContentTop = resource.AVATAR_MSG_ONE;
		this.avatarContentMid = resource.AVATAR_MID_MSG_ONE;

		this.mobileValueTwo = resource.AVATAR_MOB_MSG_THREE;

	}
	goBackToStepTwo() {
		this.handleClose();
		this.currentStep = resource.TWO;
		this.template.querySelector("div.stepThree").classList.add("slds-hide");
		this.template.querySelector("div.stepTwo").classList.remove("slds-hide");
		// Progress indicator
		this.template
			.querySelector("li.li-three")
			.classList.remove("slds-is-active");
		this.template.querySelector("li.li-three").classList.add("slds-hide");
		this.template
			.querySelector("li.li-two")
			.classList.remove("slds-is-completed");
		this.template.querySelector("li.li-two").classList.add("slds-is-active");


		this.level = resource.NUM_THREE;
		//To achieve the mobile responsiveness, the following strings are hard coded. Custom Labels can't be used, since they truncate the strings.
		//To achieve mobile responsiveness, we are using innerHTML. However, when attempting to use textContent, it does not meet the design requirements
		this.AvatarMsg();
	}
	goBackToStepThree() {
		this.matchCaregiverEmail = false;
		this.matchEmail = false;
		if (this.isAdult === true) {
			this.handleClose();
			this.currentStep = resource.TWO;
			this.fieldsMandatory = "para";
			this.template.querySelector("div.stepFour").classList.add("slds-hide");
			this.template.querySelector("div.stepTwo").classList.remove("slds-hide");
			// Progress indicator
			this.template
				.querySelector("li.li-four")
				.classList.remove("slds-is-active");
			this.template
				.querySelector("li.li-two")
				.classList.remove("slds-is-completed");
			this.template.querySelector("li.li-two").classList.add("slds-is-active");
			//To achieve the mobile responsiveness, the following strings are hard coded. Custom Labels can't be used, since they truncate the strings.
			//To achieve mobile responsiveness, we are using innerHTML. However, when attempting to use textContent, it does not meet the design requirements
			this.AvatarMsg();
		} else {
			this.handleClose();
			this.currentStep = resource.THREE;
			this.template.querySelector("div.stepFour").classList.add("slds-hide");
			this.template
				.querySelector("div.stepThree")
				.classList.remove("slds-hide");
			// Progress indicator
			this.template
				.querySelector("li.li-four")
				.classList.remove("slds-is-active");
			this.template
				.querySelector("li.li-three")
				.classList.remove("slds-is-completed");
			this.template
				.querySelector("li.li-three")
				.classList.add("slds-is-active");
			//To achieve the mobile responsiveness, the following strings are hard coded. Custom Labels can't be used, since they truncate the strings.
			//To achieve mobile responsiveness, we are using innerHTML. However, when attempting to use textContent, it does not meet the design requirements
			this.avatarContentTop = resource.AVATAR_MSG_TWO;
			this.avatarContentMid = resource.AVATAR_MID_MSG_TWO;

		}
		this.mobileValueTwo = resource.AVATAR_MOB_MSG_TWO;
	}
	goBackToStepFour() {
		this.handleClose();
		this.currentStep = resource.FOUR;
		this.fieldsMandatory = "para";
		this.template.querySelector("div.stepFive").classList.add("slds-hide");
		this.template.querySelector("div.stepFour").classList.remove("slds-hide");
	}
	goToStepTwo() {
		this.handleClose();
		if (!this.ReferringPracticeValidation()) {
			this.avatarContentTop = resource.AVATAR_MSG_ONE;
			this.avatarContentMid = resource.AVATAR_MID_MSG_FOUR;
			return;
		}
		if (
			this.physicianIdInputDisabled === true &&
			this.physicianNameInputDisabled === true
		) {
			this.avatarContentTop = resource.AVATAR_MSG_ONE;
			this.avatarContentMid = resource.AVATAR_MID_MSG_FOUR;
			if (!this.HCPvalidateForm()) {
				return;

			}
		}
		this.currentStep = resource.TWO;
		this.template.querySelector("div.stepOne").classList.add("slds-hide");
		this.template.querySelector("div.stepTwo").classList.remove("slds-hide");
		// Progress indicator
		this.template.querySelector("li.li-one").classList.remove("slds-is-active");
		this.template.querySelector("li.li-one").classList.add("slds-is-completed");
		this.template.querySelector("li.li-two").classList.add("slds-is-active");
		//To achieve the mobile responsiveness, the following strings are hard coded. Custom Labels can't be used, since they truncate the strings.
		//To achieve mobile responsiveness, we are using innerHTML. However, when attempting to use textContent, it does not meet the design requirements
		this.AvatarMsg();
	}
	AvatarMsg() {
		this.avatarContentTop = resource.THANK_FOR_CHOOSE;
		this.avatarContentMid = resource.AVATAR_MID_MSG_TWO;
		this.mobileValueTwo = resource.AVATAR_MOB_MSG_TWO;
	}
	goToStepThree() {
		// Close the current step
		this.handleClose();

		// Fetch existing accounts with the given email
		GET_EXISTING_ACCOUNTS({ email: this.leadFields.Email })
			.then((result) => {
				if (result && result.length > 0) {
					this.uniqueEmail = result.map(item => item.PersonEmail);
					this.uniqueFName = result.map(item => item.FirstName);
					this.uniqueLname = result.map(item => item.LastName);
					this.uniqueDOB = result.map(item => item.BI_PSP_Birthdate__c);

					if (!this.UniqueValidation()) {
						// Handle unique validation failure here if needed
					}
				} else {
					this.handlePatientValidation();
				}
			});
// No need to catch black
	}

	handlePatientValidation() {
		// Check various validations for the patient
		switch (true) {
			case !this.patientvalidateForm():
				this.updateAvatarContent();
				break;
			case !this.DOByearvalidationforPatient():
				this.updateAvatarContent();
				break;
			case !this.DOBfuturevalidationforPatient():
				this.updateAvatarContent();
				break;
			case this.isAdult === true:
				this.advanceToStepFour();
				break;
			default:
				this.returnToStepThree();
		}

	}

	updateAvatarContent() {
		this.avatarContentTop = resource.THANK_FOR_CHOOSE;
		this.avatarContentMid = resource.AVATAR_MID_MSG_THREE;
	}

	advanceToStepFour() {
		this.numThree = false;
		this.numFour = true;
		this.currentStep = resource.FOUR;
		this.fieldsMandatory = "paralast";

		this.template.querySelector("div.stepTwo").classList.add("slds-hide");
		this.template.querySelector("div.stepFour").classList.remove("slds-hide");

		this.template.querySelector("li.li-two").classList.remove("slds-is-active");
		this.template.querySelector("li.li-two").classList.add("slds-is-completed");
		this.template.querySelector("li.li-four").classList.add("slds-is-active");

		this.avatarContentTop = resource.THANK_FOR_CHOOSE;
		this.avatarContentMid = resource.AVATAR_MID_MSG_ONE;
		this.mobileValueTwo = resource.AVATAR_MOB_MSG_THREE;
	}

	returnToStepThree() {
		this.handleClose();
		this.currentStep = resource.THREE;

		this.template.querySelector("div.stepTwo").classList.add("slds-hide");
		this.template.querySelector("div.stepThree").classList.remove("slds-hide");

		this.template.querySelector("li.li-two").classList.remove("slds-is-active");
		this.template.querySelector("li.li-two").classList.add("slds-is-completed");
		this.template.querySelector("li.li-three").classList.remove("slds-hide");
		this.template.querySelector("li.li-three").classList.add("slds-is-active");

		this.numFour = false;
		this.numThree = true;
		this.level = resource.NUM_FOUR;

		this.AvatarMsg();
	}

	goToStepFour() {
		this.unique = false;
		this.handleClose();
		GET_EXISTING_ACCOUNTS({ email: this.caregiverFields.Email })
			// Null data is checked and AuraHandledException is thrown from the Apex
			.then((result) => {
				if (result && result.length > 0) {
					this.uniqueEmail = result.map((item) => item.PersonEmail);
					this.uniqueFName = result.map((item) => item.FirstName);
					this.uniqueLname = result.map((item) => item.LastName);
					this.uniqueDOB = result.map((item) => item.BI_PSP_Birthdate__c);

					if (!this.UniquecaregiverValidation()) {
						// to call the method
						// No need for a return here
					}
					else {
						this.Caregivervalidation();

					}
				} else {
					this.Caregivervalidation();

				}
			});
      //No need to catch black
	}

	//This Function is used for check validation for Patient date of birth in hcp enrollment form
	agecalculationEvent(event) {
    const SELECTED_DATE = event.target.value;
    this.leadFields.dob = SELECTED_DATE;

    const SELECTED_DATE_OBJ = new Date(SELECTED_DATE);
    const CURRENT_DATE = new Date();

    if (this.isDateEmpty(SELECTED_DATE)) {
        this.handleEmptyDate();
    } else if (this.isDateBefore1900(SELECTED_DATE_OBJ)) {
        this.handleDateBefore1900();
    } else if (this.isDateInFuture(SELECTED_DATE_OBJ, CURRENT_DATE)) {
        this.handleFutureDate();
    } else {
      this.error = false;
	this.dobErrorMessage = false;
        this.handleValidDate(SELECTED_DATE_OBJ, CURRENT_DATE);
    }
}

isDateEmpty(SELECTED_DATE) {
    return SELECTED_DATE === "";
}

isDateBefore1900(SELECTED_DATE_OBJ) {
    return SELECTED_DATE_OBJ.getFullYear() < 1900;
}

isDateInFuture(SELECTED_DATE_OBJ, CURRENT_DATE) {
    return SELECTED_DATE_OBJ > CURRENT_DATE;
}

handleEmptyDate() {

    this.dobErrorMessage = true;
    this.setFieldErrorStyles();
    this.error = false;
    this.oneNineZeroZeroErrors = false;
}

handleDateBefore1900() {

    this.setFieldErrorStyles();
    this.error = false;
    this.oneNineZeroZeroErrors = true;
    this.dobErrorMessage = false;
    this.isAdult = false;
    this.unique = false;
    this.leadFields.Email = '';
}

handleFutureDate() {

    this.setFieldErrorStyles();
    this.error = true;
    this.dobErrorMessage = false;
    this.isAdult = false;
    this.unique = false;
    this.leadFields.Email = '';
    this.oneNineZeroZeroErrors = false;
}

handleValidDate(SELECTED_DATE_OBJ, CURRENT_DATE) {
    
    const AGE = this.calculateAge(SELECTED_DATE_OBJ, CURRENT_DATE);
    if (AGE >= resource.Minorvalue) {
        this.isAdult = true;

        this.oneNineZeroZeroErrors = false;
		this.resetFieldStyles();
    } else {
        this.isAdult = false;

        this.unique = false;
        this.leadFields.Email = '';
        this.oneNineZeroZeroErrors = false;
		this.resetFieldStyles();
    }
}

setFieldErrorStyles() {
    this.template.querySelector('lightning-input[data-field="pdob"]').className = "textInput-err";
    this.template.querySelector('div[data-field="pdob"]').className = "input-error-label";
}

resetFieldStyles() {
    this.template.querySelector('lightning-input[data-field="pdob"]').className = "textInput";
    this.template.querySelector('div[data-field="pdob"]').className = "input-label";
}

calculateAge(SELECTED_DATE_OBJ, CURRENT_DATE) {
    return Math.floor((CURRENT_DATE - SELECTED_DATE_OBJ) / (365.25 * 24 * 60 * 60 * 1000)); // Rounding down to the nearest whole year
}

	onClickCalendar() {
		this.template.querySelector("div.formContainer").style.zIndex = "1001";
	}

	onBlurCalendar() {
		this.template.querySelector("div.formContainer").style.zIndex = "0";
	}

	//This Function is used for check validation for Caregiver date of birth in hcp enrollment form
	careagecalculation(event) {
		const SELECTED_DATE = event.target.value;
		this.caregiverFields.dob = SELECTED_DATE;
	
		const CURRENT_DATE = new Date();
		const CARE_SELECTED_DATE_OBJ = new Date(SELECTED_DATE);
	
		if (this.isDateEmpty(SELECTED_DATE)) {
			this.handleEmptyCareDate();

		} else if (this.isDateBefore1900(CARE_SELECTED_DATE_OBJ)) {
			this.handleCareDateBefore1900();

		} else if (this.isDateInFuture(CARE_SELECTED_DATE_OBJ, CURRENT_DATE)) {
			this.handleCareFutureDate();

		} else {
		
			this.handleValidCareDate(CARE_SELECTED_DATE_OBJ, CURRENT_DATE);
		}
	}
	
	// isDateEmpty(SELECTED_DATE) {
	// 	return SELECTED_DATE === "";
	// }
	
	// isDateBefore1900(SELECTED_DATE_OBJ) {
	// 	return SELECTED_DATE_OBJ.getFullYear() < 1900;
	// }
	
	// isDateInFuture(SELECTED_DATE_OBJ, CURRENT_DATE) {
	// 	return SELECTED_DATE_OBJ > CURRENT_DATE;
	// }
	
	handleEmptyCareDate() {
		this.careDobErrorMessage = true;
		this.minorError = false;
		this.careOneNineZerZeroErrors = false;
		this.errors = false;
		this.setCareFieldErrorStyles();

	}
	
	handleCareDateBefore1900() {
	
		this.setCareFieldErrorStyles();
		this.careOneNineZerZeroErrors = true;
		this.errors = false;
		this.isAdult = false;
		this.minorError = false;
		this.careDobErrorMessage = false;
	}
	
	handleCareFutureDate() {
		this.setCareFieldErrorStyles();

		this.errors = true;
		this.minorError = false;
		this.isAdult = false;
		this.careOneNineZerZeroErrors = false;
		this.careDobErrorMessage = false;
	}
	
	handleValidCareDate(CARE_SELECTED_DATE_OBJ, CURRENT_DATE) {
		this.resetCareFieldStyles();
		const AGE = this.calculateAge(CARE_SELECTED_DATE_OBJ, CURRENT_DATE);
		if (AGE < resource.Minorvalue) {
			this.handleMinorCareDate();

		} else {
			this.handleAdultCareDate();
	
		}
	}
	
	handleMinorCareDate() {
		this.isAdult = false;
		this.minorError = true;
		this.errors = false;
		this.setCareFieldErrorStyles();
		this.careOneNineZerZeroErrors = false;
		this.careDobErrorMessage = false;

	}
	
	handleAdultCareDate() {
		
		this.minorError = false;
		this.careOneNineZerZeroErrors = false;
		this.careDobErrorMessage = false;
		this.errors = false;
		this.resetCareFieldStyles();
		
	}
	
	setCareFieldErrorStyles() {
		this.template.querySelector("lightning-input.cDob").className = "red cDob";
		this.template.querySelector("div.cDob").className = "labelred cDob";
	}
	
	resetCareFieldStyles() {
		this.template.querySelector("lightning-input.cDob").className = "textInput cDob";
		this.template.querySelector("div.cDob").className = "input-label cDob";
	}
	
	
	prescritedDateErr(){
		this.template.querySelector("lightning-input.hpdate").className =
				"textInput-err hpdate";
			this.template.querySelector("div.hpdate").className =
				"input-error-label hpdate";
	}
	prescritedDate(){
		this.template.querySelector("lightning-input.hpdate").className =
					"textInput hpdate";
				this.template.querySelector("div.hpdate").className =
					"input-label hpdate";
	}
	//This Function is used for check validation for Prescription date in hcp enrollment form
	datecalculation(event) {
		const SELECTED_DATE = event.target.value;
		this.prescriptionFields.date = SELECTED_DATE;

		const CURRENT_DATE = new Date();
		const PRES_SELECTED_DATE_OBJ = new Date(SELECTED_DATE);
		if (SELECTED_DATE === "") {
			this.dateErrorMessage = true;
			this.errorss = false;
			this.presOneNineZeroZeroErrors = false;
			this.prescritedDateErr();
		} else {
			if (PRES_SELECTED_DATE_OBJ.getFullYear() < 1900) {
				this.prescritedDateErr();
				this.errorss = false;
				this.presOneNineZeroZeroErrors = true;
				this.dateErrorMessage = false;
			} else if (PRES_SELECTED_DATE_OBJ > CURRENT_DATE) {
				this.prescritedDateErr();
				this.errorss = true;
				this.presOneNineZeroZeroErrors = false;
				this.dateErrorMessage = false;
			} else {
				this.errorss = false;
				this.presOneNineZeroZeroErrors = false;
				this.dateErrorMessage = false;
				this.prescritedDate();
			}
		}
	}
	//This Function is used for check validation for Patient in hcp enrollment form
	patientvalidateForm() {
		let isValid = true;
	
		// Array of field names to validate
		const fieldsToValidate = [resource.FIRSTNAME_VALUE, resource.LASTNAME_VALUE, resource.DOB_VALUE, resource.GENDER_VALUE, resource.EMAIL, resource.PHONE_VALUE];
	
		// Iterate through each field and validate
		fieldsToValidate.forEach(field => {
			if (!this.validateField(field)) {
				isValid = false;
			}
		});
	
		return isValid;
	}
	
	validateField(field) {
		switch (field) {
			case resource.FIRSTNAME_VALUE:
				return this.validateFirstNameOne();
			case resource.LASTNAME_VALUE:
				return this.validateLastNameOne();
			case resource.DOB_VALUE:
				return this.validateDOB();
			case resource.GENDER_VALUE:
				return this.validateGender();
			case resource.EMAIL:
				return this.isAdult ? this.validateEmail() : true;
			case resource.PHONE_VALUE:
				return this.isAdult ? this.validatePhone() : true;
			default:
				return true;
		}
	}
	
	validateFirstNameOne() {
		if (!this.leadFields.FirstName) {
			this.PhysicianFnameErr();
			this.firstnameErrorMessage = true;
			return false;
		}
			this.firstnameErrorMessage = false;
			if (this.firstnameErrorMessage === true || this.firstnameErrorMessagevaild === true) {
				this.PhysicianFnameErr();
				return false;
			} 
				this.PhysicianFname();
				return true;
			
		}

	
	validateLastNameOne() {
		if (!this.leadFields.LastName) {
			this.PhysicianLnameErr();
			this.lastnameErrorMessage = true;
			return false;
		} 
			this.lastnameErrorMessage = false;
			if (this.lastnameErrorMessage === true || this.lastnameErrorMessagevaild === true) {
				this.PhysicianLnameErr();
				return false;
			} 
				this.PhysicianLname();
				return true;
			
		
	}
	
	validateDOB() {
		if (!this.leadFields.dob) {
			this.setFieldErrorStyles();
			this.dobErrorMessage = true;
			return false;
		} 
		else if (this.error === true) {
			this.setFieldErrorStyles();
			return false;
		} 
			this.resetFieldStyles();
		this.error = false; 
		this.oneNineZeroZeroErrors = false;
			this.dobErrorMessage = false;
			return true;
		
			
			
		
	}
	
	validateGender() {
		if (!this.selectedGender) {
			this.genderErrorMessage = true;
			this.PhysicianGenderErr();
			return false;
		} 
			this.genderErrorMessage = false;
			this.PhysicianGender();
			return true;
		
	}
	
	validateEmail() {
		if (!this.leadFields.Email) {
			this.PhysicianEmailErr();
			this.emailErrorMessage = true;
			this.emailErrorValid = false;
			return false;
		} 
			this.emailErrorMessage = false;
			this.emailErrorValid = false;
			this.PhysicianEmailErr();
	
			if (!this.validateEmailRegex().test(this.leadFields.Email)) {
				this.emailErrorValid = true;
				this.PhysicianEmailErr();
				return false;
			} 
				this.emailErrorValid = false;
				this.PhysicianEmail();
				return true;
			
		
	}
	
	validatePhone() {
		if (this.leadFields.Phone) {
			if (!this.validatePhoneRegex().test(this.leadFields.Phone)) {
				this.phnErrorValid = true;
				this.PhysicianEmailErr();
				return false;
			} 
				this.phnErrorValid = false;
				this.PhysicianEmail();
				return true;
			
		}
		return true; // If no phone is provided, it's valid
	}
	

	//This Function is used for check validation for Caregiver in hcp enrollment form
	carevalidateForm() {
		let isValid = true;
	
		// Array of field names to validate
		const fieldsToValidate = [resource.FIRSTNAME_VALUE, resource.LASTNAME_VALUE, resource.DOB_VALUE, resource.EMAIL, resource.RELATIONSHIP_LABEL,resource.PHONE_VALUE];
	
		// Iterate through each field and validate
		fieldsToValidate.forEach(field => {
			if (!this.validateCareField(field)) {
				isValid = false;
			}
		});
	
		return isValid;
	}
	
	validateCareField(field) {
		switch (field) {
			case resource.FIRSTNAME_VALUE:
				return this.validateCareFirstName();
			case resource.LASTNAME_VALUE:
				return this.validateCareLastName();
			case resource.DOB_VALUE:
				return this.validateCareDOB();
			case resource.EMAIL:
				return this.validateCareEmail();
			case resource.RELATIONSHIP_LABEL:
				return this.validateCareRelationship();
			case resource.PHONE_VALUE:
				return this.validateCarePhone();
			default:
				return true;
		}
	}
	
	validateCareFirstName() {
		if (!this.caregiverFields.FirstName) {
			this.CaregiverFnameErr();
			this.careFirstnameErrorMessage = true;
			return false;
		}
			this.careFirstnameErrorMessage = false;
			if (this.careFirstnameErrorMessage || this.careFirstnameErrorMessageValid) {
				this.CaregiverFnameErr();
				return false;
			} 
				this.CaregiverFname();
				return true;
			
	}
	
	validateCareLastName() {
		if (!this.caregiverFields.LastName) {
			this.CaregiverLnameErr();
			this.careLastnameErrorMessage = true;
			return false;
		} 
			this.careLastnameErrorMessage = false;
			if (this.careLastnameErrorMessage || this.careLastnameErrorMessageValid) {
				this.CaregiverLnameErr();
				return false;
			} 
				this.CaregiverLname();
				return true;
			
		
	}
	
	validateCareDOB() {
		if (!this.caregiverFields.dob) {
			this.setCareFieldErrorStyles();
			this.careDobErrorMessage = true;
			return false;
		} 
			this.careDobErrorMessage = false;
			if (this.errors || this.minorError || this.careOneNineZerZeroErrors) {
				this.setCareFieldErrorStyles();
				return false;
			} 
				this.resetCareFieldStyles();
				return true;
		
		
	}
	
	validateCareEmail() {
		if (!this.caregiverFields.Email) {
			this.CaregiverEmailErr();
			this.careEmailErrorMessage = true;
			return false;
		} 
			this.careEmailErrorMessage = false;
			if (!this.validateEmailRegex().test(this.caregiverFields.Email)) {
				this.cEmailErrorValid = true;
				this.CaregiverEmailErr();
				return false;
			} 
				this.cEmailErrorValid = false;
				this.CaregiverEmail();
				return true;
			
		
	}
	
	validateCareRelationship() {
		if (!this.selectedRelationship) {
			this.relationshipErrorMessage = true;
			this.CaregiverRelationErr();
			return false;
		} 
			this.relationshipErrorMessage = false;
			this.CaregiverRelation();
			return true;
		
	}
	
	validateCarePhone() {
		if (this.caregiverFields.Phone) {
			if (!this.validatePhoneRegex().test(this.caregiverFields.Phone)) {
				this.cphoneerrorvalid = true;
				this.CaregiverPhoneErr();
				return false;
			} 
				this.cphoneerrorvalid = false;
				this.CaregiverPhone();
				return true;
			
		}
		return true; // If no phone is provided, it's valid
	}
	

	//This Function is used for check validation for prescription in hcp enrollment form
	PrescriptionFieldsForm() {
		let isValid = true;
	
		if (!this.validateDrug()) {
			isValid = false;
		}
	
		if (!this.validatePrescribedDate()) {
			isValid = false;
		}
	
		if (!this.validateAuthorize()) {
			isValid = false;
		}
	
		return isValid;
	}
	
	validateDrug() {
		if (this.searchResultEmpty) {
			this.template.querySelector("lightning-input.hDrug").className = "textInput-err hDrug";
			this.template.querySelector("div.hDrug").className = "input-error-label hDrug";
			this.drugErrorMessage = false;
			return false;
		}
	
		if (!this.searchValue) {
			this.template.querySelector("lightning-input.hDrug").className = "textInput-err hDrug";
			this.template.querySelector("div.hDrug").className = "input-error-label hDrug";
			this.drugErrorMessage = true;
			return false;
		} 
			if (this.searchResultEmpty) {
				this.template.querySelector("lightning-input.hDrug").className = "textInput-err hDrug";
				this.template.querySelector("div.hDrug").className = "input-error-label hDrug";
				this.drugErrorMessage = false;
				return false;
			} 
				this.drugErrorMessage = false;
				this.template.querySelector("lightning-input.hDrug").className = "textInput hDrug";
				this.template.querySelector("div.hDrug").className = "input-label hDrug";
				return true;
			
		
	}
	
	validatePrescribedDate() {
		if (!this.prescriptionFields.date) {
			this.prescritedDateErr();
			this.dateErrorMessage = true;
			return false;
		} 
			if (this.errorss) {
				this.prescritedDateErr();
				return false;
			} 
				this.dateErrorMessage = false;
				this.prescritedDate();
				return true;
			
		
	}
	
	validateAuthorize() {
		if (!this.consentFields.authorize || this.consentFields === undefined) {
			this.authorizeErrorMessage = true;
			this.CheckBoxErr();
			return false;
		} 
			this.authorizeErrorMessage = false;
			this.CheckBox();
			return true;
		
	}
	

	HCPvalidateForm() {
		let isValid = true;
		isValid = this.validateFirstName() && isValid;
		isValid = this.validateLastName() && isValid;
		isValid = this.validateLicenseField() && isValid;
		isValid = this.validatePhoneField() && isValid;
		isValid = this.validateFaxField() && isValid;
		isValid = this.validateEmailField() && isValid;
		isValid = this.validateComboBoxField('hcc', 'RPcountryerrorMessage') && isValid;
		isValid = this.validateComboBoxField('hsc', 'rpStateCodeErrorMessage') && isValid;
		isValid = this.validateCityField() && isValid;
		isValid = this.validateMailingStreetField() && isValid;
		isValid = this.validatePostalCodeField() && isValid;
		isValid = this.validatePracticeNameField() && isValid;
		isValid = this.validatePracticeTypeField() && isValid;

		return isValid;
	}

	validateFirstName() {


		if (!this.hcpFields.firstname) {
			this.rpFirstnameErrorMessage = true;
			this.FirstNameTextErr();
			return false;
		}

		this.rpFirstnameErrorMessage = false;
		if (this.rpFirstnameErrorMessageVaild) {
			this.FirstNameTextErr();
			return false;
		}

		this.FirstNameText();
		return true;
	}

	validateLastName() {
	

		if (!this.hcpFields.lastname) {
			this.rpLastnameErrorMessage = true;
			this.LastNameErr();
			
			return false;
		}

		this.rpLastnameErrorMessage = false;
		if (this.rpLastnameErrorMessageValid) {
			this.LastNameErr();
			return false;
		}

		this.LastNameText();
		return true;
	}

	validateLicenseField() {
		const field = this.template.querySelector('lightning-input[data-field="hLicense"]');
		if (!field.value) {
			this.rpStateLicenseErrorMessage = true;
			this.rpStateLicenseErrorMessageValid = false;
			this.LicenseNumberErr();
			return false;
		}
		if (!this.validateLisencePattern().test(field.value)) {
			this.rpStateLicenseErrorMessage = false;
			this.rpStateLicenseErrorMessageValid = true;
			this.LicenseNumberErr();
			return false;
		}
		this.LicenseNumber();
		return true;
	}

	validatePhoneField() {
		const field = this.template.querySelector('lightning-input[data-field="hPhone"]');
		if (field.value && !this.validatePhoneRegex().test(field.value)) {
			this.rpPhoneErrorMessage = true;
			this.PhoneFieldErr();
			return false;
		}
		this.rpPhoneErrorMessage = false;
		this.PhoneField();
		return true;
	}
	validatePhoneRegex() {
		return /^\+?\d+$/u;
	}
	validateFaxField() {
		const field = this.template.querySelector('lightning-input[data-field="hFax"]');
		if (field.value && !this.validatePhoneRegex().test(field.value)) {
			this.rpFaxErrorMessage = true;
			this.FaxFieldErr();
			return false;
		}
		this.rpFaxErrorMessage = false;
		this.FaxField();
		return true;
	}
	validateEmailRegex() {
		return /^[^\s@]+@[^\s@]+\.[^\s@]+$/u;
	}
	validateEmailField() {
		const field = this.template.querySelector('lightning-input[data-field="hEmail"]');
		if (!field.value) {
			this.rpEmailErrorMessage = true;
			this.RpEmailErrorValid = false;
			this.EmailFieldErr();

			return false;
		}
		this.rpEmailErrorMessage = false;
		if (!this.validateEmailRegex().test(this.hcpFields.email)) {
			this.RpEmailErrorValid = true;
			this.EmailFieldErr();
			return false;
		}
		this.RpEmailErrorValid = false;
		this.EmailField();
		return true;
	}

	validateComboBoxField(dataField, errorMessageFlag) {
		const field = this.template.querySelector(`lightning-combobox[data-field="${dataField}"]`);
		if (!field.value) {
			this[errorMessageFlag] = true;
			field.className = "textInput-err";
			this.template.querySelector(`div[data-field="${dataField}"]`).className = "input-error-label";
			return false;
		}
		this[errorMessageFlag] = false;
		field.className = "textInput";
		this.template.querySelector(`div[data-field="${dataField}"]`).className = "input-label";
		return true;
	}

	validateCityField() {
		const field = this.template.querySelector('lightning-input[data-field="hc"]');
		if (!field.value) {
			this.rpCityErrorMessage = true;
			this.CityFieldErr();
			return false;
		}
		this.rpCityErrorMessage = false;
		if (this.rpCityErrorMessageValid) {
			this.CityFieldErr();
			return false;
		}
		this.CityField();
		return true;
	}

	validateMailingStreetField() {
		const field = this.template.querySelector('lightning-textarea[data-field="hs"]');
		if (!field.value) {
			this.rpStreetErrorMessage = true;
			this.StreetFieldErr();
			return false;
		}
		this.rpStreetErrorMessage = false;
		this.StreetField();
		return true;
	}

	validatePostalCodeField() {
		const field = this.template.querySelector('lightning-input[data-field="hpc"]');
		if (!field.value) {
			this.rpPostalCodeErrorMessage = true;
			this.PinCodeErr();
			return false;
		}
		if (!this.ZipCodeRegex().test(this.hcpFields.code)) {
			this.rpPostalCodeErrorMessage = false;
			this.RPpostalerrorMessagevalid = true;
			this.PinCodeErr();
			return false;
		}
		this.rpPostalCodeErrorMessage = false;
		this.ZiperrorMessagevalid = false;
		this.PinCode();
		return true;
	}

	validatePracticeNameField() {
		const field = this.template.querySelector('lightning-input[data-field="hPN"]');
		if (!field.value) {
			this.rpPracticeNameErrorMessage = true;
			this.PracticeNameErr();
			return false;
		}
		this.rpPracticeNameErrorMessage = false;
		if (this.rpLastnameErrorMessageValid) {
			this.PracticeNameErr();
			return false;
		}
		this.PracticeName();
		return true;
	}

	validatePracticeTypeField() {
		const field = this.template.querySelector('lightning-combobox[data-field="hType"]');
		if (!field.value) {
			this.rpPracticeTypeErrorMessage = true;
			this.PracticeFieldErr();
			return false;
		}
		this.rpPracticeTypeErrorMessage = false;
		this.PracticeField();
		return true;
	}

	searchHcpNameErr(){
		this.template.querySelector("lightning-input.searchHCPName").className =
		"textInput-err searchHCPName";
	this.template.querySelector("div.searchHCPName").className =
		"input-error-label searchHCPName";
	}
	searchHcpName(){
		this.template.querySelector("lightning-input.searchHCPName").className =
		"textInput searchHCPName";
	this.template.querySelector("div.searchHCPName").className =
		"input-label-front searchHCPName";
	}
	ReferringPracticeValidation() {
		let isValid = true;
	
		// Validate Physician Name
		if (!this.validatePhysicianName()) {
			isValid = false;
		}
	
		// Validate Physician ID
		if (!this.validatePhysicianId()) {
			isValid = false;
		}
	
		return isValid;
	}
	
	validatePhysicianName() {
		if (!this.physicianNameInputDisabled && (!this.selectedValueOne || this.searchResultEmptyOne)) {
			this.searchHcpNameErr();
			this.referringErrorMessage = true;
			return false;
		} 
			if (this.physicianNameInputDisabled === true) {
				this.updateFieldStyles('div.searchHCPName', 'Disable searchHCPName', '');
			} 
				this.updateFieldStyles('lightning-input.searchHCPName', 'textInput searchHCPName', 'input-label-front searchHCPName');
				this.referringErrorMessage = false;
			
			return true;
		
	}
	
	validatePhysicianId() {
		if (!this.physicianIdInputDisabled && (!this.selectedValueTwo || this.searchResultEmptyTwo)) {
			this.updateFieldStyles('lightning-input.searchHCPId', 'textInput-err searchHCPId', 'input-error-label searchHCPId');
			this.referringErrorMessage = true;
			return false;
		} 
			if (this.physicianIdInputDisabled === true) {
				this.updateFieldStyles('div.searchHCPId', 'input-label searchHCPId', '');
			} 
				this.updateFieldStyles('lightning-input.searchHCPId', 'textInput searchHCPId', 'input-label-front searchHCPId');
				this.referringErrorMessage = false;
			
			return true;
		
	}
	
	updateFieldStyles(inputSelector, inputClass, labelClass) {
		if (inputSelector) {
			this.template.querySelector(inputSelector).className = inputClass;
		}
		if (labelClass) {
			this.template.querySelector(`div.${inputSelector.split('.')[1]}`).className = labelClass;
		}
	}
	
	authorize() {
		// Add your validation logic here for each required field
		let isValid = true;
		if (!this.consentFields.authorize) {
			this.authorizeErrorMessage = true;
			this.CheckBoxErr();
			isValid = false;
		} else {
			this.authorizeErrorMessage = false;
			this.CheckBox();
		}
		return isValid;
	}

	showError(message) {
		const ERROR_MESSAGES = {
			title: "Error",
			message: message,
			variant: "error"
		};
		this.dispatchEvent(
			new CustomEvent("showtoast", { detail: ERROR_MESSAGES })
		);
	}
	showModal() {
		this.openModal = true;
		this.template.querySelector("div.formContainer").style.zIndex = 1001;
	}
	closeModal() {
		this.openModal = false;
		this.template.querySelector("div.formContainer").style.zIndex = 1000;
	}
	expandAddNewForm() {
		if (this.shouldReturnEarly()) {
			return;
		}
		if (this.isAddNew === false) {
			this.disablePhysicianInputs();
		} else {
			this.enablePhysicianInputs();
		}
		this.resetErrorMessages();
		this.setAvatarContent();
	}
	
	shouldReturnEarly() {
		return (this.physicianIdInputDisabled === true || this.physicianNameInputDisabled === true) && this.isAddNew === false;
	}
	
	disablePhysicianInputs() {
		this.physicianNameInputDisabled = true;
		this.physicianIdInputDisabled = true;
		this.updateFieldStyles('lightning-input.searchHCPName', 'InputDisabled searchHCPName', 'Disable searchHCPName');
		this.updateFieldStyles('lightning-input.searchHCPId', 'InputDisabled searchHCPId', 'Disable searchHCPId');
		this.referringErrorMessage = false;
		this.isAddNew = true;
	}
	
	enablePhysicianInputs() {
		this.physicianNameInputDisabled = false;
		this.physicianIdInputDisabled = false;
		this.updateFieldStyles('lightning-input.searchHCPName', 'textInput searchHCPName', 'input-label-front searchHCPName');
		this.updateFieldStyles('lightning-input.searchHCPId', 'textInput searchHCPId', 'input-label-front searchHCPId');
		this.isAddNew = false;
	}
	
	resetErrorMessages() {
		this.rpFirstnameErrorMessage = false;
		this.RPfirstnameerrorMessagevalid = false;
		this.rpLastnameErrorMessage = false;
		this.rpLastnameErrorMessageValid = false;
		this.rpStateLicenseErrorMessage = false;
		this.rpStateLicenseErrorMessageValid = false;
		this.rpPracticeNameErrorMessage = false;
		this.rpPracticeTypeErrorMessage = false;
		this.RpEmailErrorValid = false;
		this.rpEmailErrorMessage = false;
		this.RPpostalerrorMessagevalid = false;
		this.rpPostalCodeErrorMessage = false;
		this.rpStreetErrorMessage = false;
		this.rpCityErrorMessageValid = false;
		this.rpCityErrorMessage = false;
		this.rpStateCodeErrorMessage = false;
		this.RPcountryerrorMessage = false;
		this.rpPhoneErrorMessage = false;
	}
	
	setAvatarContent() {
		this.avatarContentTop = resource.AVATAR_MSG_ONE;
		this.avatarContentMid = resource.AVATAR_MID_MSG_ONE;
	}
	
	
	
	goToHome() {
		window.location.href = resource.BRANDED_URL + resource.HCP;
	}

	// HCP Name Search box handling methods
	// Start

	showHcpNamePicklist() {
		if (this.searchResultsOne !== 0) {
			this.searchResultsOne = this.picklistOrderedOne;
		}
		this.searchResultsOne = null;
		
	}
	SearchIdErr(){
		this.template.querySelector("div.searchHCPId").className =
				"input-error-label searchHCPId";
			this.template.querySelector("lightning-input.searchHCPId").className =
				"textInput-err searchHCPId";
	}
	SearchId(){
		this.template.querySelector("div.searchHCPId").className =
				"input-label searchHCPId";
			this.template.querySelector("lightning-input.searchHCPId").className =
				"textInput searchHCPId";
	}
	hcpNameOnChange(event) {
		this.selectedSearchResultOne = "";
		this.searchResultsTwo = null;
		this.searchMain = false;
		const INPUT = event.detail.value.toLowerCase();
		this.searchValueOne = event.detail.value;
		if (this.searchValueOne === "") {
			this.searchMain = true;
			this.physicianIdInputDisabled = true;
			this.addNewHcpSectionClass = "addNewHcpSection";
			this.searchResultsOne = null;
	
			this.referringErrorMessage = true;
			this.SearchIdErr();
				this.searchHcpNameErr();
		} else {
			this.referringErrorMessage = false;
			this.searchHcpName();
			this.SearchId();
		}

		if (INPUT === "") {
			
			this.referringErrorMessage = true;
			this.addNewHcpSectionClass = "addNewHcpSection";
			this.SearchIdErr();
			this.searchHcpNameErr();
		} else {
			this.physicianIdInputDisabled = true;
			this.referringErrorMessage = false;
			this.searchHcpName();
			this.SearchId();
		}

		this.searchResultsOne = this.picklistOrderedOne.filter(
			(picklistOptionOne) =>
				picklistOptionOne.label.toLowerCase().includes(INPUT)
		);
		const SEARCHED_RESULT_ONE = this.picklistOrderedOne.filter(
			(picklistOptionOne) =>
				picklistOptionOne.label.toLowerCase().includes(INPUT)
		);

		this.searchResultEmptyOne = SEARCHED_RESULT_ONE.length === 0 ;

		if (this.searchResultEmptyOne) {
			this.physicianIdInputDisabled = true;
			this.searchHcpNameErr();
			this.template.querySelector("div.searchHCPId").className =
				"input-label searchHCPId";
			this.addNewHcpSectionClass = "addNewHcpSection-disable";
		}
		if (INPUT.length === 0) {
			this.searchResultsOne = null;
			this.physicianIdInputDisabled = false;
		}
	}

	handleHcpNameOptionClick(event) {
		const SELECTED_VALUE_ONE = event.currentTarget.dataset.value;
		this.hcpId = SELECTED_VALUE_ONE;
		this.searchMain = false;

		this.selectedSearchResultOne = this.picklistOrderedOne.find(
			(picklistOptionOne) => picklistOptionOne.value === SELECTED_VALUE_ONE
		);
		const MESSAGE_EVENT = new CustomEvent(resource.CHANGE, {
			detail: SELECTED_VALUE_ONE
		});
		this.dispatchEvent(MESSAGE_EVENT);
		this.physicianIdInputDisabled = true;
		this.template.querySelector("div.searchHCPId").className =
			"input-label searchHCPId";
		this.addNewHcpSectionClass = "addNewHcpSection-disable";
		this.searchResultsOne = null;
	}

	//End
	// HCP Name Search box handling methods
	// Start
	hcpIdOnChange(event) {
		this.selectedSearchResultTwo = "";
		this.searchMainTwo = false;
		const INPUT = event.detail.value;
		this.searchValueTwo = event.detail.value;
		if (this.searchValueTwo === "") {
			this.searchMainTwo = true;
			this.referringErrorMessage = true;
			this.SearchIdErr();
			this.searchHcpNameErr();
		} else {
			this.searchHcpName();
			this.referringErrorMessage = false;
			this.SearchId();
		}
		if (INPUT === "") {
			this.physicianNameInputDisabled = false;
			this.addNewHcpSectionClass = "addNewHcpSection";
			this.searchHcpNameErr();
		} else {
			this.searchHcpName();
			this.referringErrorMessage = false;
			this.SearchId();
		}

		this.searchResultsTwo = this.picklistOrderedTwo
			.filter(
				(element) => element?.label !== null && element?.label !== undefined
			)
			.filter((picklistOptionTwo) =>
				picklistOptionTwo?.label.toString().includes(INPUT)
			);

		this.searchResult2 = this.picklistOrderedTwo
			.filter(
				(element) => element?.label !== null && element?.label !== undefined
			)
			.filter((picklistOptionTwo) =>
				picklistOptionTwo?.label.toString().includes(INPUT)
			);

		this.searchResultEmptyTwo = this.searchResult2.length === 0 ? true : false;

		if (this.searchResultEmptyTwo === true) {
			this.physicianNameInputDisabled = true;
			this.SearchIdErr();
			this.addNewHcpSectionClass = "addNewHcpSection-disable";
		}
		if (INPUT.length === 0) {
			this.searchResultsTwo = null;
		}
	}
	showHcpIdPicklist() {
		if (this.searchResultTwo.length !== 0) {
			this.searchResultsTwo = this.picklistOrderedTwo.filter(
				(element) => element?.label !== null && element?.label !== undefined
			);
		}
	}
	handleHcpIdOptionClick(event) {
		
		const SELECTED_VALUE_TWO = event.currentTarget.dataset.value;
		this.hcpId = SELECTED_VALUE_TWO;
		this.selectedSearchResultTwo = this.picklistOrderedTwo.find(
			(picklistOptionTwo) => picklistOptionTwo.value === SELECTED_VALUE_TWO
		);
		const MESSAGE_EVENT = new CustomEvent(resource.CHANGE, {
			detail: SELECTED_VALUE_TWO
		});
		this.dispatchEvent(MESSAGE_EVENT);
		this.physicianNameInputDisabled = true;
		this.addNewHcpSectionClass = "addNewHcpSection-disable";
		this.searchResultsTwo = null;
		
	}
	// We are using setTimeout to search the combobox in the Physician Id picklist field  to reset the searchResults variable to null.


	//End
	// Drug Search box handling methods
	//Start

	showPicklistOptions() {
		if (this.searchResults.length !== 0) {
			this.searchResults = this.picklistOrdered;
		}
	}
	HcpDrug()
	{
		this.template.querySelector("lightning-input.hDrug").className =
				"textInput hDrug";
			this.template.querySelector("div.hDrug").className =
				"input-label hDrug";
	}
	HcpDrugErr(){
		this.template.querySelector("lightning-input.hDrug").className =
				"textInput-err hDrug";
			this.template.querySelector("div.hDrug").className =
				"input-error-label hDrug";
	}
	//This function is used to search the Drug code Fields
	search(event) {
		this.searchValueLogo = false;
		this.searchValue = event.detail.value;
		if (this.SELECTED_VALUE === "") {
			this.searchValueLogo = true;
			this.prescriptionFields.DosageCode = "";
			this.prescriptionFields.Dosage = "";
			this.prescriptionFields.Unit = "";
		}
		if (this.searchValue) {
			this.drugErrorMessage = false;
			this.HcpDrug();
		}
		this.selectedSearchResult = "";
		let input = event.detail.value.toLowerCase();
		if (input === "") {
			this.searchValueLogo = true;
			this.HcpDrugErr();
			this.drugErrorMessage = true;
		} else {
			this.searchValueLogo = false;
			this.HcpDrug();
			this.drugErrorMessage = false;
		}

		this.searchResults = this.picklistOrdered.filter((picklistOption) =>
			picklistOption.label.toLowerCase().includes(input)
		);
		const SEARCH_RESULT = this.picklistOrdered.filter((picklistOption) =>
			picklistOption.label.toLowerCase().includes(input)
		);
		this.searchResultEmpty = SEARCH_RESULT.length === 0;
		if (this.searchResultEmpty) {
			this.drugErrorMessage = false;
		}
		if (input.length === 0) {
			this.searchResults = null;
		}
	}

	selectSearchResult(event) {
		this.searchValue = event.currentTarget.dataset.value;
		const SELECTED_VALUE = event.currentTarget.dataset.value;
		if (!SELECTED_VALUE) {
			this.HcpDrugErr();
			this.drugErrorMessage = true;
		}
		if (SELECTED_VALUE) {
			this.HcpDrug();
			this.drugErrorMessage = false;
			this.searchValueLogo = false;
			PRESCRITION_DATA({ productId: SELECTED_VALUE })
				// Null data is checked and AuraHandledException is thrown from the Apex
				.then((result) => {
					this.prescriptionFields.DosageCode =
						result[0].BI_PSPB_Product_code__c;
					this.prescriptionFields.Dosage = result[0].BI_PSPB_Dosage__c;
					this.prescriptionFields.Unit = result[0].BI_PSPB_Unit__r.Name;
				})
				.catch((error) => {
					// Handle any errors from the Apex call

					this.HandleToast(error.message);
				});
		} else {
			this.code = "";
		}
		this.selectedSearchResult = this.picklistOrdered.find(
			(picklistOption) => picklistOption.value === SELECTED_VALUE
		);
		const MESSAGE_EVENT = new CustomEvent(resource.CHANGE, {
			detail: SELECTED_VALUE
		});
		this.dispatchEvent(MESSAGE_EVENT);
		this.searchResults = null;
	}

	// We are using setTimeout to search the combobox in the Drug picklist field  to reset the searchResults variable to null.


	@wire(COUNTRY)
	wiredCountries({ error, data }) {
		
		if (data) {
			this.CountryCode = data.map((country) => ({
				label: country.label,
				value: country.value
			}));
		} else if (error) {
			this.HandleToast(error.message);
		}
	}
	
	handleCountryChange(event) {
		this.selectedCountry = event.target.value;
		if (!this.selectedCountry) {
			this.RPcountryerrorMessage = true;
			this.CountryFieldErr();

		} else {
			this.RPcountryerrorMessage = false;
			this.CountryField();
		}
		STATE({ selectedCountry: this.selectedCountry })
			.then((result) => {
				this.StateCode = result.map((state) => ({
					label: state.Name,
					value: state.BI_PSPB_StateCode__c
				}));
			})
			.catch((error) => {
				this.HandleToast(error.body.message);
			});
	}

	//This function is used to date validation in date of birth
	DOByearvalidationforPatient() {
		let isValid = true;
		if (this.oneNineZeroZeroErrors === true) {
			this.setFieldErrorStyles();
			this.oneNineZeroZeroErrors = true;
			isValid = false;
		} else {
			this.oneNineZeroZeroErrors = false;
			this.resetFieldStyles();
		}
		return isValid;
	}

	//This function is used to future date validation in date of birth
	DOBfuturevalidationforPatient() {
		let isValid = true;

		if (this.error === true) {
			this.setFieldErrorStyles();
			this.error = true;
			this.dobErrorMessage = false;
			isValid = false;
		} else {
			this.error = false;
			this.resetFieldStyles();
		}
		return isValid;
	}
	////This function is used to Number input fields
	handleKeyDown(event) {
		const CHAR_CODE = event.which ? event.which : event.keyCode; // Get the ASCII code of the pressed key
		if (CHAR_CODE !== 43 && (CHAR_CODE < 48 || CHAR_CODE > 57)) {
			// Allow only digits (48-57) and the plus symbol (43)
			event.preventDefault(); // Prevent the character from being entered
		}
	}

	//This function is used to Text input fields
	handleKeyDownOne(event) {
		// Allow only letters, backspace, and delete
		if (
			!(
				(event.keyCode >= 65 && event.keyCode <= 90) || // A-Z
				(event.keyCode >= 97 && event.keyCode <= 122) || // a-z
				event.keyCode === 8 || // Backspace
				event.keyCode === 46 || // Delete
				(event.keyCode >= 37 && event.keyCode <= 40) ||
				event.keyCode === 9 || // Tab
				(event.shiftKey && event.keyCode === 9)
			)
		) {
			event.preventDefault();
		}
	}
	handleKeyDownTwo(event) {
		// Allow only numbers, backspace, and delete
		if (
			!(
				(event.keyCode >= 48 && event.keyCode <= 57) || // 0-9
				(event.keyCode >= 96 && event.keyCode <= 105) ||
				event.keyCode === 8 || // Backspace
				event.keyCode === 46 || // Delete
				(event.keyCode >= 37 && event.keyCode <= 40) ||
				event.keyCode === 9 || // Tab
				(event.shiftKey && event.keyCode === 9)
			)
		) {
			event.preventDefault();
		}
		// Prevent input of special characters
		if (event.key.match(/[^a-zA-Z0-9]/u)) {
			event.preventDefault();
		}
	}
	handleKeyDownThree(event) {
		event.preventDefault();
	}

	//This function is used to check for Patient Validation
	UniqueValidation() {
		let isValid = true;
		if (this.isAdult === true) {
			if (
				this.uniqueEmail.includes(this.leadFields.Email) &&
				this.uniqueFName.includes(this.leadFields.FirstName) &&
				this.uniqueLname.includes(this.leadFields.LastName) &&
				this.uniqueDOB.includes(this.leadFields.dob)
			) {
				this.unique = true;
				isValid = false;
			} else {
				this.unique = false;
			}

			if (
				this.uniqueEmail.includes(this.leadFields.Email) &&
				this.unique === false
			) {
				this.matchEmail = true;
				this.PhysicianEmailErr();

				isValid = false;
			} else {
				this.matchEmail = false;
				this.PhysicianEmail();
			}
		}
		return isValid;
	}

	//The Caregivervalidation() function likely validates caregiver data for uniqueness
	//based on email and checks for existing caregiver records in the system.
	Caregivervalidation() {
		if (!this.carevalidateForm()) {
			// No need for a return here
			this.avatarContentTop = resource.THANK_FOR_CHOOSE;
			this.avatarContentMid = resource.AVATAR_MID_MSG_THREE;
		} else if (this.errors === true || this.minorError === true) {
			this.setCareFieldErrorStyles();
			// No need for a return here
		} else {
			// If none of the above conditions are met, execute the following code
			this.handleClose();
			this.currentStep = "4";
			this.fieldsMandatory = "paralast";
			this.template.querySelector("div.stepThree").classList.add("slds-hide");
			this.template.querySelector("div.stepFour").classList.remove("slds-hide");
			// Progress indicator
			this.template
				.querySelector("li.li-three")
				.classList.remove("slds-is-active");
			this.template
				.querySelector("li.li-three")
				.classList.add("slds-is-completed");
			this.template.querySelector("li.li-four").classList.add("slds-is-active");
			//To achieve the mobile responsiveness, the following strings are hard coded. Custom Labels can't be used, since they truncate the strings.
			//To achieve mobile responsiveness, we are using innerHTML. However, when attempting to use textContent, it does not meet the design requirements
			this.avatarContentTop = resource.AVATAR_MSG_ONE;
			this.avatarContentMid = resource.AVATAR_MID_MSG_ONE;
			this.mobileValueTwo = resource.AVATAR_MOB_MSG_THREE;
		}
	}

	//This function is used to check for Caregiver Validation
	UniquecaregiverValidation() {
		let isValid;
		if (
			this.uniqueEmail[0].includes(this.caregiverFields.Email) &&
			this.uniqueFName[0].includes(this.caregiverFields.FirstName) &&
			this.uniqueLname[0].includes(this.caregiverFields.LastName) &&
			this.uniqueDOB[0].includes(this.caregiverFields.dob)
		) {
			// Assuming isValid is declared before this block

			isValid = true;
		} else {
			if (this.uniqueEmail.includes(this.caregiverFields.Email)) {
				this.matchCaregiverEmail = true;
				this.CaregiverEmailErr();
				isValid = false;
			} else {
				this.matchCaregiverEmail = false;
				this.unique = false;
				this.CaregiverEmail();
			}
		}
		return isValid;
	}
	
}