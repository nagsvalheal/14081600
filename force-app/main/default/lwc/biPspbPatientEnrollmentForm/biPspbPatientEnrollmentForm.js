//This LWC is used for create patient detail record enrollment processs.
//Proper naming conventions with camel case for all the variable will be followed in the future releases
// To import Libraries
import { LightningElement, wire, api } from "lwc";
import { ShowToastEvent } from "lightning/platformShowToastEvent";
import { loadStyle } from "lightning/platformResourceLoader";
import { getObjectInfo, getPicklistValues } from "lightning/uiObjectInfoApi";
import { NavigationMixin } from "lightning/navigation";

// Importing Apex classes to interact with Salesforce backend for data retrieval.
import HCP_ACCESSCODE from "@salesforce/apex/BI_PSPB_EnrollmentUtilities.hcpAccessCode";
import UPDATE_LEAD_PATIENT_RECORD from "@salesforce/apex/BI_PSPB_EnrollmentHcpAndPatient.createLead";
import HCP_CREATE from "@salesforce/apex/BI_PSPB_EnrollmentPhysician.hcpCreate";
import CREATE_CONSENT_RECORD from "@salesforce/apex/BI_PSPB_EnrollmentConsent.consentCreate";
import VALUES_GET_FROM_TABLE from "@salesforce/apex/BI_PSPB_ReferringPractitionerCtrl.getPractitionerList";
import EXISTING_ACCOUNTS from "@salesforce/apex/BI_PSPB_EnrollmentUtilities.getExistingAccounts";
import COUNTRYS from "@salesforce/apex/BI_PSPB_EnrollmentUtilities.getCountries";
import STATES from "@salesforce/apex/BI_PSPB_EnrollmentUtilities.getStates";

import { resource } from "c/biPspbEnrollmentFormResource";

// Imports scheme to define structured data exchange protocol within component for consistency and interoperability.

export default class BiPspbPatientEnrollmentForm extends NavigationMixin(
  LightningElement
) {
  @api
  get selectedValueOne() {
    return this.selectedSearchResultOne?.label || this.selectedSearchResultOne;
  }
  get selectedValues() {
    return this.selectedSearchResult ? this.selectedSearchResult.label : null;
  }
  errorPage = resource.ERROR_PAGE;
  showSpinner = true;
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
  contentSix = resource.CONTENT_SIX;
  contentOne = resource.CONTENT_ONE;
  contentTwo = resource.CONTENT_TWO;
  contentThree = resource.CONTENT_THREE;
  contentFour = resource.CONTENT_FOUR;
  contentFive = resource.CONTENT_FIVE;
  consentInfo = resource.CONSENT_INFO;

  terms = resource.TERMS;
  agree = resource.AGREE;
  condition = resource.CONDITION;
  agreeMsg = resource.AGREE_MSG;
  submit = resource.SUBMIT;
  progressLabel = resource.PROGRESS_LABEL;
  accountExit = resource.ACCOUNT_EXIST;
  accountExistMsg = resource.ACCOUNT_EXIST_MSG;
  goToLogin = resource.GO_TO_LOGIN;
  labelCity = resource.CITYLABEL;
  fieldWidth = resource.FIELD_WIDTH;
  areMandotory = resource.ARE_MANDOTORY;
  patientEnrollHead = resource.PATIENT_ENROLL;
  patientinfo = resource.PATIENT_INFO;
  firstNameLabel = resource.FIRST_NAME_LABEL;
  firstNameValid = resource.FIRSTNAME_VALIDE;
  lastNameValid = resource.LASTNAME_VALIDE;
  lastNameLabel = resource.LASTNAME_LABEL;
  dobLabel = resource.DOB_LABEL;
  beforeAge = resource.BEFORE_EIGHTINE;
  yearOlder = resource.YEAR_OLDER;
  generalLabel = resource.GENDER_LABEL;
  emailLabelMand = resource.EMAIL_LABEL_STAR;
  validEmail = resource.VALIDE_EMAIL;
  existingEmail = resource.EXISTING_EMAIL;
  cancelLabel = resource.CANCEL;
  nextLabel = resource.NEXT;
  physicianDetails = resource.PHYSICIAN_DETAILS;
  numTwo = resource.NUM_TWO;
  numOne = resource.NUM_ONE;
  physicianInfo = resource.PHYSICIAN_INFO;
  physicianInfoMand = resource.PHYSICIAN_INFO_MANDOTORY;
  accessCodeMsg = resource.ACCESS_CODE_MSG;
  hcpAccessCode = resource.HCP_ACCESS_CODE;
  yesValue = resource.YES_VALUE;
  noValue = resource.NO_VALUE;
  searchPhysician = resource.SEARCH_PHYSICIAN;
  physicainInfoValid = resource.PHYSICIAN_INFO_VALID;
  unableToFind = resource.UNABLE_TO_FIND;
  accessCodeLabel = resource.ACCESS_CODE;
  validAccessCode = resource.VALID_ACCESS_CODE;
  accessCodeKit = resource.ACCESS_CODE_KIT;
  addPhysician = resource.ADD_PHYSICIAN;
  contactInfo = resource.CONTACT_INFO;
  phoneNum = resource.PHONE_NUM;
  phoneNumMandotory = resource.PHONE_NUM_MANDOTORY;
  validPhone = resource.VALID_PHONE;
  or = resource.OR;
  emailLabel = resource.EMAIL_LABEL;
  addressLineLabel = resource.ADDRESS_LINE;
  addressLineRequired = resource.ADDRESS_LINE_REQUIRED;
  previousValue = resource.PREVIOS;
  numFour = resource.NUM_FOUR;
  numThree = resource.NUM_THREE;
  pmcLabel = resource.PMC_LABEL;
  countryLabel = resource.COUNTRY_LABEL;
  stateLabel = resource.STATE_LABEL;
  streetLabel = resource.STREET_LABEL;
  zipCodeValue = resource.ZIP_CODE_LABEL;
  validZipCode = resource.VALID_ZIP_CODE;
  cityLabel = resource.CITY_LABEL;
  validCity = resource.VALID_CITY;
  avatarContentTop = resource.P_AVATAR_MSG_ONE;
  avatarContentMid = resource.P_AVATAR_MID_MSG_ONE;
  avatarContentLast = resource.P_AVATAR_LAST_MSG_ONE;
  category = resource.PATIENT;
  breakLine = true;
  breakLineOne = true;
  avatarContMid = true;
  avatarContLast = true;
  requiredMsg = false;
  phoneMandotary = true;
  phoneVisible = false;
  emailMandatory = true;
  emailVisible = false;
  selectedValue;
  searchResultsList;
  searchResults;
  recordId;
  consentID;
  addNewHcpSectionClass = "addNewHcpSection"; // to invoke CSS class
  firstNameErrorMessage = false;
  dobSelfMessage = false;
  physicianErrorMessage = false;
  physicianRequireMessage = false;
  lastNameErrorMessage = false;
  genderErrorMessage = false;
  emailErrorMessage = false;
  careFirstNameErrorMessage = false;
  careLastNameErrorMessage = false;
  isButtonDisabled = false;
  careDobErrorMessage = false;
  hcpFirstNameErrorMessage = false;
  hcpLastNameErrorMessage = false;
  hcpPhoneNumberErrorMessage = false;
  hcpEmailErrorMessage = false;
  hcpAddressLineErrorMessage = false;
  isSearchCleared = false;
  emailError = false;
  selectedCountryCode = "";
  selectedStateCode = "";
  CountryCode = [];
  StateCode = [];
  isUnbranded = false;
  showInfoQuestion = false;
  oldYearError = false;
  RpCityErrorMessageValid = false;
  fieldBox = false;
  variable = false;
  doAccess = true;
  doAccessHcp = false;
  careId;
  hideSearchIcon = true;
  hideUpArrow = "hideuparrow";
  matchEmail = false;
  currentStep = "";
  hcpFirstName = "";
  hcpLastName = "";
  hcpPhone = "";
  hcpEmail = "";
  addressLine = "";
  checkBox;
  checkBoxRequired = false;
  selectedReferringPractitioner = "";
  accessCodeId;
  searchResultEmpty = false;
  accessCode;
  openModal = false;
  dobErrorMessage = false;
  submitModal = false;
  divFalse = true;
  subValue;
  isModalOpen = false;
  phone = "";
  pmc = "";
  country = "";
  state = "";
  city = "";
  street = "";
  zipCode = "";
  firstName = "";
  gender = "";
  email = "";
  lastName = "";
  firstNameErrorMessageValid = false;
  lastNameErrorMessageValid = false;
  phoneNumberMandatory = false;
  phoneNumberVisible = true;
  careDob;
  errorMessage = "";
  conPhoneErrorMessage = false;
  conPmcErrorMessage = false;
  conCountryErrorMessage = false;
  conStateErrorMessage = false;
  conCityErrorMessage = false;
  conStreetErrorMessage = false;
  conZipCodeErrorMessage = false;
  showUpdateForm = true;
  showInsertForm = true;
  selectedPreValues = "";
  age;
  showAccessCode = false;
  showReferringPractitioner = false;
  accessCodeErrorMessage = false;
  accordionStatusClose = false;
  accordionStatus = false;
  minor = false; // Initialize to false
  dob; // Date of Birth attribute
  leadId;
  isAdult = false;
  popUpClass = "popup-hidden";
  showContactNumber = false;
  careEmailErrorMessage = false;
  // Custom Labels for the following 2 variables cannot be created since it truncates the content in mobile devices
  mobileView = resource.P_AVATAR_MOB_MSG_ONE;
  mobileViewSub = resource.P_AVATAR_MOB_MSG_FIVE;
  selectedOption = {
    src: resource.OLD_GUY_JPEG_URL,
    name: ""
  };
  uniqueEmail;
  uniqueFirstName;
  uniqueLastName;
  uniqueDob;
  selectedCountry;
  selectedAvatarSrc = resource.OLD_GUY_JPEG_URL;
  leadGender;
  leadPmc;
  PreferredMethodOfCommunication;
  account = "";
  leadIds = "";
  calenderIcon = resource.CALENDER_ICON;
  userId = resource.ID;
  showDetailscg6 = false;
  showDetailscg5 = false;
  showDetailscg4 = false;
  showDetails1 = false;
  showDetailscg2 = false;
  showDetailscg3 = false;
  beyandGpp = resource.BGPP;
  warningIcons = resource.WARNING_ICON;

  patientFirstName = resource.PATIENT_FIRSTNAME;
  patientLastName = resource.PATIENT_LASTNAME;
  patientDob = resource.PATIENT_DATEOFBIRTH;
  patientGender = resource.PATIENT_GENDER;
  patientEmail = resource.PATIENT_EMAIL;
  patientPhone = resource.PATIENT_PHONE;
  patientPmc = resource.PREFERRED_CONTACT_METHOD;
  pinCode = resource.PINCODE;
  streetcode = resource.STREET;
  cityCode = resource.CITY;
  statecode = resource.STATE;
  countryfield = resource.COUNTRY;

  picklistOrdered = [];
  picklistOrderedGet = [];
  options = [];

  // Fetches Lead object info and country picklist values, handles errors.

  @wire(getObjectInfo, { objectApiName: resource.LEAD_LABEL })
  objectInfo;
  @wire(COUNTRYS)
  wiredCountries({ error, data }) {
  
    if (data) {
      this.CountryCode = data.map((country) => ({   

        label: country.label,
        value: country.value
      }));
    } else if (error) {
      let globalThis = window;
      globalThis.sessionStorage.setItem("errorMessage", error.body.message);
      globalThis.location?.assign(
        this.baseUrl + resource.BRANDED_URL + this.errorPage
      );
    }
  }

  // Loads styles and fetches values from Table 1, populating a picklist and handling errors.

  connectedCallback() {
    try {
      loadStyle(this, resource.TEXT_ALIGN);
      loadStyle(this, resource.ICON_CSS);
      VALUES_GET_FROM_TABLE()
        // Null data is checked and AuraHandledException is thrown from the Apex
        .then((result) => {
          if (result !== null && result.length > 0) {
            let i;
            for (i = 0; i < result.length; i++) {
              this.picklistOrderedGet.push({
                label: result[i].Name,
                labelForSpecialist: result[i]?.BI_PSPB_Specialist__c,
                labelForCity: result[i]?.MailingCity,
                value: result[i].Id
              });
            }
            this.picklistOrderedGet = this.picklistOrderedGet.toSorted((a, b) => {
              if (a.label < b.label) {
                return -1;
              } else if (a.label > b.label) {
                return 1;
              }
              return 0;
            });
          } else if (result === null) {
            this.HandleToast(resource.ERROR_FOUND);
          }
        });
    } catch (error) {
      let globalThis = window;
      globalThis.sessionStorage.setItem("errorMessage", error.body.message);
      globalThis.location?.assign(
        this.baseUrl + resource.BRANDED_URL + this.errorPage
      );
    }
  }
  HandleToast(error) {
    this.showToast(
      resource.ERROR_MESSAGE,
      error.message,
      resource.ERROR_VARIANT
    );
  }
  
  // Call an Apex method to retrieve lead PicklistValues
  // Utility method for handling errors
  handleError(error) {
    let globalThis = window;
    globalThis.sessionStorage.setItem("errorMessage", error.body.message);
    globalThis.location?.assign(
        `${this.baseUrl}${resource.BRANDED_URL}${this.errorPage}`
    );
}

// Utility method for handling picklist values
handlePicklistValues({ data, errors }, targetField) {
    try {
        if (data) {
            this[targetField] = data.values;
            this.checkAllDataLoaded();
        } else if (errors) {
            this[targetField] = undefined; // Set to undefined in case of error
            this.handleError(errors);
        }
    } catch (err) {
        this.handleError(err);
    }
}

// Check if all data is loaded
checkAllDataLoaded() {
  this.showSpinner = false;
}


@wire(getPicklistValues, {
    recordTypeId: "$objectInfo.data.defaultRecordTypeId",
    fieldApiName: resource.GENDER
})
wiredLeadGenderValues(result) {
    this.handlePicklistValues(result, 'leadGender');
}

@wire(getPicklistValues, {
    recordTypeId: "$objectInfo.data.defaultRecordTypeId",
    fieldApiName: resource.BI_PSPB_Preferred_Communication_Method__c
})
wiredPmcValues(result) {
    this.handlePicklistValues(result, 'leadPmc');
}
  handleCountryCodeChange(event) {
    this.selectedCountryCode = event.detail.value;
    this.selectedStateCode = ""; // Reset selected state when country changes
  }
  AvatarContent() {
    this.avatarContentTop = resource.P_AVATAR_MSG_ONE;
    this.avatarContentMid = resource.P_AVATAR_MID_MSG_ONE;
    this.avatarContentLast = resource.P_AVATAR_LAST_MSG_ONE;
  }
  physicianNameErr() {
    const PHYSICIAN_FIELD = this.template.querySelector(
      'lightning-input[data-field="physician"]'
    );
    PHYSICIAN_FIELD.className = "textInput-err";
    this.template.querySelector('div[data-field="physician"]').className =
      "input-label";
  }
  physicianName() {
    const PHYSICIAN_FIELD = this.template.querySelector(
      'lightning-input[data-field="physician"]'
    );
    PHYSICIAN_FIELD.className = "textInput";
    this.template.querySelector('div[data-field="physician"]').className =
      "input-label";
  }
  goBackToStepOne() {
    const HCP_ACCESS_CODE_FIELD = this.template.querySelector(
      'lightning-input[data-field="hcpaccesscode"]'
    );
    this.currentStep = resource.ONE;
    this.handleBackProgressBar(2, 1);
    //To achieve the mobile responsiveness, the following strings are hard coded. Custom Labels can't be used, since they truncate the strings.
    //To achieve mobile responsiveness, we are using innerHTML. However, when attempting to use textContent, it does not meet the design requirements
    this.AvatarContent();
    this.BreakLine();
    this.handleClose();
    this.mobileView = resource.P_AVATAR_MOB_MSG_ONE;
    this.mobileViewSub = resource.P_AVATAR_MOB_MSG_FIVE;
    if (this.physicianRequireMessage === true) {
      this.physicianRequireMessage = false;

      this.physicianName();
    } else if (this.accessCodeErrorMessage === true) {
      this.accessCodeErrorMessage = false;
      HCP_ACCESS_CODE_FIELD.className = "textInput";
    }
  }
  BreakLine() {
    this.breakLine = true;
    this.breakLineOne = true;
    this.avatarContLast = true;
    this.avatarContMid = true;
  }
  goBackToStepTwo() {
    this.currentStep = resource.TWO;
    this.handleBackProgressBar(3, 2);
    //To achieve the mobile responsiveness, the following strings are hard coded. Custom Labels can't be used, since they truncate the strings.
    //To achieve mobile responsiveness, we are using innerHTML. However, when attempting to use textContent, it does not meet the design requirements
    this.AvatarContent();
    this.BreakLine();
    this.handleClose();
    this.mobileView = resource.P_AVATAR_MOB_MSG_ONE;
    this.mobileViewSub = resource.P_AVATAR_MOB_MSG_FIVE;
  }
  AvatarConentTwo() {
    this.avatarContentTop = resource.P_AVATAR_MSG_TWO;
    this.avatarContentMid = resource.P_AVATAR_MID_MSG_TWO;
  }
  AvatarMobConent() {
    this.mobileView = resource.P_AVATAR_MOB_MSG_TWO;
    this.mobileViewSub = resource.P_AVATAR_MOB_MSG_SIX;
  }
  goBackToStepThree() {
    this.currentStep = resource.THREE;
    this.handleBackProgressBar(4, 3);
    //To achieve the mobile responsiveness, the following strings are hard coded. Custom Labels can't be used, since they truncate the strings.
    //To achieve mobile responsiveness, we are using innerHTML. However, when attempting to use textContent, it does not meet the design requirements
    this.AvatarConentTwo();
    this.avatarContentLast = ``;
    this.breakLine = false;
    this.breakLineOne = true;
    this.avatarContLast = false;
    this.avatarContMid = true;
    this.handleClose();
    this.AvatarMobConent();
  }
  goBackToStepThreeOne() {
    this.currentStep = resource.TWO;
    this.handleBackProgressBar(4, 2);
    //To achieve the mobile responsiveness, the following strings are hard coded. Custom Labels can't be used, since they truncate the strings.
    //To achieve mobile responsiveness, we are using innerHTML. However, when attempting to use textContent, it does not meet the design requirements
    this.AvatarConentTwo();
    this.avatarContentLast = ``;
    this.avatarContMid = true;
    this.breakLine = false;
    this.breakLineOne = true;
    this.avatarContLast = false;
    this.handleClose();
    this.AvatarMobConent();
  }
  goBackToStepOnes() {
    this.currentStep = resource.ONE;
    this.template.querySelector("div.stepFour").classList.add("slds-hide");
    this.template.querySelector("div.stepOne").classList.remove("slds-hide");
  }
  goBackToStepFour() {
    this.currentStep = resource.FOUR;
    this.template.querySelector("div.stepFive").classList.add("slds-hide");
    this.template.querySelector("div.stepFour").classList.remove("slds-hide");
  }


  handleProgressBar(from, to) {
    this.template
      .querySelector(`li.li-${from}`)
      .classList.remove("slds-is-active");
    this.template
      .querySelector(`li.li-${from}`)
      .classList.add("slds-is-completed");
    this.template.querySelector(`li.li-${to}`).classList.add("slds-is-active");

    this.template.querySelector(`div.step-${from}`).classList.add("slds-hide");
    this.template.querySelector(`div.step-${to}`).classList.remove("slds-hide");
  }

  handleBackProgressBar(from, to) {
    this.template
      .querySelector(`li.li-${from}`)
      .classList.remove("slds-is-active");
    this.template
      .querySelector(`li.li-${from}`)
      .classList.remove("slds-is-completed");
    this.template
      .querySelector(`li.li-${to}`)
      .classList.remove("slds-is-completed");
    this.template.querySelector(`li.li-${to}`).classList.add("slds-is-active");

    this.template.querySelector(`div.step-${from}`).classList.add("slds-hide");
    this.template.querySelector(`div.step-${to}`).classList.remove("slds-hide");
  }

  goToStepTwo() {
    EXISTING_ACCOUNTS({ email: this.email })
        .then((result) => {
            if (result) {
                this.uniqueEmail = result.map((item) => item.PersonEmail);
                this.uniqueFirstName = result.map((item) => item.FirstName);
                this.uniqueLastName = result.map((item) => item.LastName);
                this.uniqueDob = result.map((item) => item.BI_PSP_Birthdate__c);

                if (!this.UniqueValidation()) {
                    return;
                }

                this.matchEmail = true;
            }
        })
        .then(() => {
            // Check if matchEmail is true, stop further execution
            if (this.matchEmail) {
                return;
            }

            // Validation for the form
            if (!this.patientvalidateForm()) {
                this.avatarContentTop = resource.P_AVATAR_MSG_THREE;
                this.avatarContentMid = resource.P_AVATAR_MID_MSG_ONE;
                this.avatarContentLast = resource.P_AVATAR_LAST_MSG_ONE;
                this.BreakLine();
                return;
            }

            // Move to the next step only if matchEmail is false
            this.isUnbranded = false;
            this.matchEmail = false;
            this.handleProgressBar(1, 2);
            this.currentStep = resource.TWO;
            this.AvatarConentTwo();
            this.avatarContentLast = ``;
            this.breakLine = false;
            this.breakLineOne = true;
            this.avatarContLast = false;
            this.avatarContMid = true;
            this.handleClose();
            this.AvatarMobConent();
        });
}


  UniqueValidation() {
    let isValid = true;
    if (
      this.uniqueEmail.includes(this.email) &&
      this.uniqueFirstName.includes(this.firstName) &&
      this.uniqueLastName.includes(this.lastName) &&
      this.uniqueDob.includes(this.dob)
    ) {
      this.submitModal = true;
      isValid = false;
    } else if (this.uniqueEmail.includes(this.email)) {
      isValid = false;
     
      this.matchEmail = true;
      this.emailError = false;
      this.emailErrorMessage = false;
      this.EmailErr();
    } else {
 
      this.matchEmail = false;
      this.Email();
    }
    return isValid;
  }

  goToStepThreeOne() {
   
    const HCP_ACCESS_CODE_FIELD = this.template.querySelector(
      'lightning-input[data-field="hcpaccesscode"]'
    );
    let success = false;

    let promise;

    // if (this.accordionStatus) {
    // 	//promise = this.handleCreateHcp();
    // } else
    if (this.showAccessCode) {
      promise = this.hcpAccessCodeChange();
    } else {
      promise = Promise.resolve();
    }
    if (!this.physicianvalidateForm()) {
      return;
    }

    promise
      .then(() => {
        if (this.accordionStatus || this.showReferringPractitioner) {
          success = true;
        } else if (this.showAccessCode) {
          if (!this.accessCodeId) {
            this.accessCodeErrorMessage = true;
            HCP_ACCESS_CODE_FIELD.classList.add("textInput-err");
          } else {
            this.accessCodeErrorMessage = false;
            HCP_ACCESS_CODE_FIELD.classList.remove("textInput-err");
            HCP_ACCESS_CODE_FIELD.classList.add("textInput");
            success = true;
          }
        }

        if (success) {
          this.currentStep = resource.FOUR;
          this.handleProgressBar(2, 4);
          this.avatarContentTop = resource.P_AVATAR_MSG_FOUR;
          this.avatarContentMid = ``;
          this.avatarContentLast = ``;
          this.avatarContLast = false;
          this.breakLine = false;
          this.breakLineOne = false;
          this.avatarContMid = false;
          this.handleClose();
          this.mobileView = resource.P_AVATAR_MOB_MSG_FOUR;
          this.mobileViewSub = resource.P_AVATAR_MSG_FOUR;
        }
        
      })
      .catch((error) => {
        let globalThis = window;
        globalThis.sessionStorage.setItem("errorMessage", error.body.message);
        globalThis.location?.assign(
          this.baseUrl + resource.BRANDED_URL + this.errorPage
        );
      });
  }

  hcpAccessCodeChange() {
    return HCP_ACCESSCODE({ accessCode: this.accessCode })
      .then((accessId) => {
        this.accessCodeId = accessId.Id;
        this.selectedPreValues = this.accessCodeId;
      })
      .catch((error) => {
        let globalThis = window;
        globalThis.sessionStorage.setItem("errorMessage", error.body.message);
        globalThis.location?.assign(
          this.baseUrl + resource.BRANDED_URL + this.errorPage
        );
      });
  }

  checkboxrequire(event) {
    this.checkBox = event.target.checked;
    const CHECK_BOX = this.template.querySelector(
      'span[data-field="checkbox"]'
    );
    if (this.checkBox === "") {
      this.checkBoxRequired = true;
      CHECK_BOX.className = "custom-checkbox-box_Error";
    } else {
      this.checkBoxRequired = false;
      CHECK_BOX.className = "custom-checkbox-box";
    }
  }
  handleKeyDownThree(event) {
    event.preventDefault();
  }
  NameRegex() {
    return /^[a-zA-ZÀ-ž\s\-'.`]+$/u;
  }
  HcpFirstNameErr() {
    const HCP_FIRST_NAME_FIELD = this.template.querySelector(
      'lightning-input[data-field="pFN"]'
    );
    const LABEL_FIELD = this.template.querySelector('div[data-field="pFN"]');
    HCP_FIRST_NAME_FIELD.className = "textInput-err";
    LABEL_FIELD.className = "input-error-label";
  }
  HcpFirstName() {
    const HCP_FIRST_NAME_FIELD = this.template.querySelector(
      'lightning-input[data-field="pFN"]'
    );
    const LABEL_FIELD = this.template.querySelector('div[data-field="pFN"]');
    HCP_FIRST_NAME_FIELD.className = "textInput";
    LABEL_FIELD.className = "input-label";
  }
  handleHcpFirstNameChange(event) {
    // Define the field and label elements
    // Get and format the HCP first name
    let newFirstName = event.target.value.trim();
    this.hcpFirstName =
      newFirstName.charAt(0).toUpperCase() + newFirstName.slice(1);

    // Regular expression for valid characters

    // Check if the new name is valid
    if (this.hcpFirstName === "") {
      // Handle empty name case
      this.hcpFirstNameErrorMessage = true;
      this.firstNameErrorMessageValid = false;
      this.HcpFirstNameErr();
    } else if (!this.NameRegex().test(this.hcpFirstName)) {
      // Handle invalid characters case
      this.hcpFirstNameErrorMessage = false;
      this.firstNameErrorMessageValid = true;
      this.HcpFirstNameErr();
    } else {
      // Handle valid name case
      this.hcpFirstNameErrorMessage = false;
      this.firstNameErrorMessageValid = false;
      this.HcpFirstName();
    }
  }
  HcpLastNameErr() {
    const HCP_LAST_NAME_FIELD = this.template.querySelector(
      'lightning-input[data-field="pLN"]'
    );
    const LABEL_FIELD = this.template.querySelector('div[data-field="pLN"]');
    HCP_LAST_NAME_FIELD.className = "textInput-err";
    LABEL_FIELD.className = "input-error-label";
  }
  HcpLastName() {
    const HCP_LAST_NAME_FIELD = this.template.querySelector(
      'lightning-input[data-field="pLN"]'
    );
    const LABEL_FIELD = this.template.querySelector('div[data-field="pLN"]');
    HCP_LAST_NAME_FIELD.className = "textInput";
    LABEL_FIELD.className = "input-label";
  }
  handleHcpLastNameChange(event) {
    // Get and format the HCP last name
    let newLastName = event.target.value.trim();
    this.hcpLastName =
      newLastName.charAt(0).toUpperCase() + newLastName.slice(1);

    // Regular expression for valid characters
    // Check if the new name is valid
    if (this.hcpLastName === "") {
      // Handle empty name case
      this.hcpLastNameErrorMessage = true;
      this.lastNameErrorMessageValid = false;
      this.HcpLastNameErr();
    } else if (!this.NameRegex().test(this.hcpLastName)) {
      // Handle invalid characters case
      this.hcpLastNameErrorMessage = false;
      this.lastNameErrorMessageValid = true;
      this.HcpLastNameErr();
    } else {
      // Handle valid name case
      this.hcpLastNameErrorMessage = false;
      this.lastNameErrorMessageValid = false;
      this.HcpLastName();
    }
  }
  HcpAccNameErr() {
    const HCP_ADDRESS_LINE_FIELD = this.template.querySelector(
      'lightning-textarea[data-field="pAddressLine"]'
    );
    HCP_ADDRESS_LINE_FIELD.className = "textInput-err";
    // Double quotes can't be avoided since it's invoked from CSS
    this.template.querySelector('div[data-field="pAddressLine"]').className =
      "input-error-label";
  }
  HcpAccName() {
    const HCP_ADDRESS_LINE_FIELD = this.template.querySelector(
      'lightning-textarea[data-field="pAddressLine"]'
    );
    HCP_ADDRESS_LINE_FIELD.className = "textInput";
    // Double quotes can't be avoided since it's invoked from CSS
    this.template.querySelector('div[data-field="pAddressLine"]').className =
      "input-label";
  }
  handleHcpAccNameChange(event) {
    this.addressLine = event.target.value;
    // Double quotes can't be avoided since it's invoked from CSS
    if (this.addressLine === "") {
      this.hcpAddressLineErrorMessage = true;
      this.accordionStatusClose = true;
      this.hideUpArrow = "hidearrowforclose";
      this.HcpAccNameErr();
    } else {
      this.hideUpArrow = "hideuparrow";
      this.accordionStatusClose = false;
      this.hcpAddressLineErrorMessage = false;
      this.HcpAccName();
    }
  }
  HcpPhoneFieldErr() {
    const HCP_PHONE_NUMBER_FIELD = this.template.querySelector(
      'lightning-input[data-field="pPhone"]'
    );
    HCP_PHONE_NUMBER_FIELD.className = "textInput-err";
    // Double quotes can't be avoided since it's invoked from CSS
    this.template.querySelector('div[data-field="pPhone"]').className =
      "input-error-label";
  }
  HcpPhoneField() {
    const HCP_PHONE_NUMBER_FIELD = this.template.querySelector(
      'lightning-input[data-field="pPhone"]'
    );
    HCP_PHONE_NUMBER_FIELD.className = "textInput";
    // Double quotes can't be avoided since it's invoked from CSS
    this.template.querySelector('div[data-field="pPhone"]').className =
      "input-label";
  }
  handleHcpPhoneChangeEmpty(event) {
    this.hcpPhone = event.target.value;

    // Double quotes can't be avoided since it's invoked from CSS
    this.hcpPhoneNumberErrorMessage = false;
    this.PhoneerrorMessagevalid = false;

    if (!this.PhoneRegex().test(this.hcpPhone)) {
      this.emailMandatory = true;

      this.emailVisible = false;
      this.hcpPhoneNumberErrorMessage = false;
      this.PhoneerrorMessagevalid = true;
      this.HcpPhoneFieldErr();
    } else {
      this.emailMandatory = true;
      this.emailVisible = false;
      this.PhoneerrorMessagevalid = false;
      this.HcpPhoneField();
    }
  }
  PhoneRegex() {
    return /^\+?\d+$/u;
  }

  handleHcpPhoneChange(event) {
    // Get the phone input field and label elements

    // Get and store the phone number value
    const newPhone = event.target.value;
    this.hcpPhone = newPhone;

    // Regular expression for valid phone numbers

    // Initial states
    this.hcpPhoneNumberErrorMessage = false;
    this.PhoneerrorMessagevalid = false;
    this.emailMandatory = true;
    this.emailVisible = false;

    // Validate phone number
    if (newPhone === "") {
      // Handle empty phone number
      this.hcpPhoneNumberErrorMessage = true;
      this.HcpPhoneFieldErr();
    } else if (!this.PhoneRegex().test(newPhone)) {
      // Handle invalid phone number
      this.hcpPhoneNumberErrorMessage = false;
      this.PhoneerrorMessagevalid = true;
      this.HcpPhoneFieldErr();
    } else {
      // Handle valid phone number
      this.hcpPhoneNumberErrorMessage = false;
      this.PhoneerrorMessagevalid = false;
      this.emailMandatory = false;
      this.emailVisible = true;
      this.HcpPhoneField();
    }
  }

  HcpEmailErr() {
    const HCP_EMAIL_FIELD = this.template.querySelector(
      'lightning-input[data-field="pEmail"]'
    );
    HCP_EMAIL_FIELD.className = "textInput-err";
    // Double quotes can't be avoided since it's invoked from CSS
    this.template.querySelector('div[data-field="pEmail"]').className =
      "input-error-label";
  }
  HcpEmail() {
    const HCP_EMAIL_FIELD = this.template.querySelector(
      'lightning-input[data-field="pEmail"]'
    );
    HCP_EMAIL_FIELD.className = "textInput";
    // Double quotes can't be avoided since it's invoked from CSS
    this.template.querySelector('div[data-field="pEmail"]').className =
      "input-label";
  }
  handleHcpEmailChangeEmpty(event) {
    this.hcpEmail = event.target.value;

    // Double quotes can't be avoided since it's invoked from CSS
    this.hcpEmailErrorMessage = false;
    this.emailError = false;
    if (!this.validateEmail(this.hcpEmail)) {
      this.hcpEmailErrorMessage = false;
      this.emailError = true;
      this.matchEmail = false;
      this.accordionStatusClose = true;
      this.hideUpArrow = "hidearrowforclose";
      this.HcpEmailErr();
    } else {
      this.hideUpArrow = "hideuparrow";
      this.accordionStatusClose = false;
      this.emailError = false;
      this.hcpEmailErrorMessage = false;
      this.HcpEmail();
    }
  }
  handleHcpEmailChange(event) {
    // Define the email field and label elements
    // Get and store the email value
    const newEmail = event.target.value;
    this.hcpEmail = newEmail;

    // Initial states
    this.hcpEmailErrorMessage = false;
    this.emailError = false;
    this.phoneMandotary = true;
    this.phoneVisible = false;
    this.accordionStatusClose = true;
    this.hideUpArrow = "hidearrowforclose";

    // Validate email
    if (newEmail === "") {
      // Handle empty email case
      this.hcpEmailErrorMessage = true;
      this.HcpEmailErr();
    } else if (!this.validateEmail(newEmail)) {
      // Handle invalid email case
      this.hcpEmailErrorMessage = false;
      this.emailError = true;
      this.matchEmail = false;
      this.HcpEmailErr();
    } else {
      // Handle valid email case
      this.phoneMandotary = false;
      this.phoneVisible = true;
      this.accordionStatusClose = false;
      this.hideUpArrow = "hideuparrow";
      this.HcpEmail();
    }
  }

  handleHcpAccessCode(event) {
    this.accessCode = event.detail.value;
    const HCP_ACCESS_CODE_FIELD = this.template.querySelector(
      'lightning-input[data-field="hcpaccesscode"]'
    );
    if (this.showAccessCode) {
      if (!HCP_ACCESS_CODE_FIELD.value) {
        this.accessCodeErrorMessage = true;
        HCP_ACCESS_CODE_FIELD.className = "textInput-err";
      } else {
        this.accessCodeErrorMessage = false;
        HCP_ACCESS_CODE_FIELD.className = "textInput";
      }
    }
  }
  handleChange(event) {
    this.selectedReferringPractitioner = event.detail.value;
  }

  showModal() {
    this.openModal = true;
  }
  closeModal() {
    this.openModal = false;
  }

  // handleChange2() {
  // 	this.showDetailscg2 = !this.showDetailscg2;
  // }

  // handleChange3() {
  // 	this.showDetailscg3 = !this.showDetailscg3;
  // }

  // handleChange1(event) {
  // 	if (event.detail.value === resource.YES) {
  // 		this.showDetails1 = true;
  // 	} else {
  // 		this.showDetails1 = false;
  // 	}
  // }

  // handleChange4() {
  // 	this.showDetailscg4 = !this.showDetailscg4;
  // }

  // handleChange5() {
  // 	this.showDetailscg5 = !this.showDetailscg5;
  // }

  // handleChange6() {
  // 	this.showDetailscg6 = !this.showDetailscg6;
  // }

  // handleContactSaveSuccess() {
  // 	if (typeof window !== "undefined") {
  // 		this.dispatchEvent(
  // 			new ShowToastEvent({
  // 				title: "Enrollment Completed",
  // 				message: "You have successfully enrolled in Patient Support Program!",
  // 				variant: "success"
  // 			})
  // 		);
  // 	}
  // }

  // handleNavigation() {
  // 	this[NavigationMixin.Navigate]({
  // 		type: "comm__namedPage",
  // 		attributes: {
  // 			name: "thankyou__c"
  // 		}
  // 	});
  // }

  showToast(title, message, variant) {
    if (typeof window !== resource.UNDIFINED) {
      const event = new ShowToastEvent({
        title: title,
        message: message,
        variant: variant
      });
      this.dispatchEvent(event);
    }
  }

  FirstNameErr() {
    const FIRST_NAME_FIELD = this.template.querySelector(
      'lightning-input[data-field="FN"]'
    );
    FIRST_NAME_FIELD.className = "textInput-err";
    this.template.querySelector('div[data-field="FN"]').className =
      "input-error-label";
  }
  FirstName() {
    const FIRST_NAME_FIELD = this.template.querySelector(
      'lightning-input[data-field="FN"]'
    );
    FIRST_NAME_FIELD.className = "textInput";
    this.template.querySelector('div[data-field="FN"]').className =
      "input-label";
  }
  validateFirstName() {
    if (!this.firstName) {
      this.firstNameErrorMessage = true;
      this.firstNameErrorMessageValid = false;
      this.FirstNameErr();
      return false;
    } else if (!this.NameRegex().test(this.firstName)) {
      this.firstNameErrorMessageValid = true;
      this.firstNameErrorMessage = false;
      this.FirstNameErr();
      return false;
    }
    this.firstNameErrorMessage = false;
    this.firstNameErrorMessageValid = false;
    this.FirstName();
    return true;
  }
  LastNameErr() {
    const LAST_NAME_FIELD = this.template.querySelector(
      'lightning-input[data-field="LN"]'
    );
    LAST_NAME_FIELD.className = "textInput-err";
    this.template.querySelector('div[data-field="LN"]').className =
      "input-error-label";
  }
  LastName() {
    const LAST_NAME_FIELD = this.template.querySelector(
      'lightning-input[data-field="LN"]'
    );
    LAST_NAME_FIELD.className = "textInput";
    this.template.querySelector('div[data-field="LN"]').className =
      "input-label";
  }
  validateLastName() {
    if (!this.lastName) {
      this.lastNameErrorMessage = true;
      this.lastNameErrorMessageValid = false;
      this.LastNameErr();
      return false;
    } else if (!this.NameRegex().test(this.lastName)) {
      this.lastNameErrorMessageValid = true;
      this.lastNameErrorMessage = false;
      this.LastNameErr();
      return false;
    }
    this.lastNameErrorMessage = false;
    this.lastNameErrorMessageValid = false;
    this.LastName();
    return true;
  }
  DateFieldError() {
    const DOB_FIELD = this.template.querySelector(
      'lightning-input[data-field="dob"]'
    );
    DOB_FIELD.className = "textInput-err";
    this.template.querySelector('div[data-field="dob"]').className =
      "input-error-label";
  }
  DateField() {
    const DOB_FIELD = this.template.querySelector(
      'lightning-input[data-field="dob"]'
    );
    DOB_FIELD.className = "textInput";
    this.template.querySelector('div[data-field="dob"]').className =
      "input-label";
  }
  validateDOB() {
    const DOB_FIELD = this.template.querySelector(
      'lightning-input[data-field="dob"]'
    );
    if (!DOB_FIELD.value) {
      this.doberrorMessage = true;
      this.DateFieldError();
      return false;
    }
    this.doberrorMessage = false;
    this.DateField();
    return true;
  }
  GenderFieldErr() {
    const GENDER_FIELD = this.template.querySelector(
      'lightning-combobox[data-field="gender"]'
    );
    GENDER_FIELD.className = "textInput-err";
    this.template.querySelector('div[data-field="gender"]').className =
      "input-error-label";
  }
  GenderField() {
    const GENDER_FIELD = this.template.querySelector(
      'lightning-combobox[data-field="gender"]'
    );
    GENDER_FIELD.className = "textInput";
    this.template.querySelector('div[data-field="gender"]').className =
      "input-label";
  }
  validateGender() {
    const GENDER_FIELD = this.template.querySelector(
      'lightning-combobox[data-field="gender"]'
    );
    if (!GENDER_FIELD.value) {
      this.genderErrorMessage = true;
      this.GenderFieldErr();
      return false;
    }
    this.genderErrorMessage = false;
    this.GenderField();
    return true;
  }
  EmailErr() {
    const EMAIL_FIELD = this.template.querySelector(
      'lightning-input[data-field="email"]'
    );
    EMAIL_FIELD.className = "textInput-err";
    this.template.querySelector('div[data-field="email"]').className =
      "input-error-label";
  }
  Email() {
    const EMAIL_FIELD = this.template.querySelector(
      'lightning-input[data-field="email"]'
    );
    EMAIL_FIELD.className = "textInput";
    this.template.querySelector('div[data-field="email"]').className =
      "input-label";
  }
  validateTheEmail() {
    const EMAIL_FIELD = this.template.querySelector(
      'lightning-input[data-field="email"]'
    );
    if (!EMAIL_FIELD.value) {
      this.emailErrorMessage = true;
      this.matchEmail = false;
      this.emailError = false;
      this.EmailErr();
      return false;
    } else if (!this.validateEmail(EMAIL_FIELD.value)) {
      this.emailErrorMessage = false;
      this.emailError = true;
      this.matchEmail = false;
      this.EmailErr();
      return false;
    }
    this.emailError = false;
    this.emailErrorMessage = false;
    this.Email();
    return true;
  }
  patientvalidateForm() {
    let isValid = true;

    isValid = this.validateFirstName() && isValid;
    isValid = this.validateLastName() && isValid;
    isValid = this.validateDOB() && isValid;
    isValid = this.validateGender() && isValid;
    isValid = this.validateTheEmail() && isValid;

    return isValid;
  }

  validateAccordionFields() {
    let isValid = true;

    isValid = this.validateHcpFirstName() && isValid;
    isValid = this.validateHcpLastName() && isValid;
    isValid = this.validatePhoneNumber() && isValid;
    isValid = this.validateHcpEmail() && isValid;
    isValid = this.validateAddressLine() && isValid;

    return isValid;
  }

  validateHcpFirstName() {
    const FIELD = this.template.querySelector(
      'lightning-input[data-field="pFN"]'
    );
    const value = FIELD.value;

    if (!value) {
      this.accordionStatusClose = true;
      this.doAccessHcp = true;
      this.doAccess = false;
      this.hideUpArrow = " hidearrowforclose";
      this.hcpFirstNameErrorMessage = true;
      this.firstNameErrorMessageValid = false;
      this.HcpFirstNameErr();
      return false;
    } else if (!this.NameRegex().test(value)) {
      this.firstNameErrorMessageValid = true;
      this.hcpFirstNameErrorMessage = false;
      this.HcpFirstNameErr();
      return false;
    }
    this.hideUpArrow = "hideuparrow";
    this.accordionStatusClose = false;
    this.doAccessHcp = false;
    this.doAccess = true;
    this.hcpFirstNameErrorMessage = false;
    this.firstNameErrorMessageValid = false;
    this.HcpFirstName();
    return true;
  }

  validateHcpLastName() {
    const FIELD = this.template.querySelector(
      'lightning-input[data-field="pLN"]'
    );
    const value = FIELD.value;

    if (!value) {
      this.accordionStatusClose = true;
      this.hideUpArrow = " hidearrowforclose";
      this.hcpLastNameErrorMessage = true;
      this.lastNameErrorMessageValid = false;
      FIELD.className = "textInput-err";
      this.template.querySelector('div[data-field="pLN"]').className =
        "input-error-label";
      return false;
    } else if (!this.NameRegex().test(value)) {
      this.lastNameErrorMessageValid = true;
      this.hcpLastNameErrorMessage = false;
      FIELD.className = "textInput-err";
      this.template.querySelector('div[data-field="pLN"]').className =
        "input-error-label";
      return false;
    }
    this.hideUpArrow = "hideuparrow";
    this.accordionStatusClose = false;
    this.hcpLastNameErrorMessage = false;
    FIELD.className = "textInput";
    this.template.querySelector('div[data-field="pLN"]').className =
      "input-label";
    return true;
  }

  validatePhoneNumber() {
    const PHONE_FIELD = this.template.querySelector(
      'lightning-input[data-field="pPhone"]'
    );
    const EMAIL_FIELD = this.template.querySelector(
      'lightning-input[data-field="pEmail"]'
    );
    const phoneValue = PHONE_FIELD.value;
    const emailValue = EMAIL_FIELD.value;

    if (emailValue && !phoneValue) {
      this.hideUpArrow = "hideuparrow";
      this.accordionStatusClose = false;
      this.hcpPhoneNumberErrorMessage = false;
      this.PhoneerrorMessagevalid = false;
      this.HcpPhoneField();
      return true;
    } else if (!phoneValue) {
      this.accordionStatusClose = true;
      this.hideUpArrow = " hidearrowforclose";
      this.hcpPhoneNumberErrorMessage = true;
      this.PhoneerrorMessagevalid = false;
      this.HcpPhoneFieldErr();
      return false;
    } else if (!this.PhoneRegex().test(phoneValue)) {
      this.hcpPhoneNumberErrorMessage = false;
      this.PhoneerrorMessagevalid = true;
      this.HcpPhoneFieldErr();
      return false;
    }

    this.hideUpArrow = "hideuparrow";
    this.accordionStatusClose = false;
    this.hcpPhoneNumberErrorMessage = false;
    this.PhoneerrorMessagevalid = false;
    this.HcpPhoneField();
    return true;
  }

  validateHcpEmail() {
    const EMAIL_FIELD = this.template.querySelector(
      'lightning-input[data-field="pEmail"]'
    );
    const PHONE_FIELD = this.template.querySelector(
      'lightning-input[data-field="pPhone"]'
    );
    const emailValue = EMAIL_FIELD.value;
    const phoneValue = PHONE_FIELD.value;

    if (!emailValue && phoneValue) {
      this.hideUpArrow = "hideuparrow";
      this.accordionStatusClose = false;
      this.emailError = false;
      this.hcpEmailErrorMessage = false;
      this.HcpEmail();
      return true;
    } else if (!emailValue) {
      this.accordionStatusClose = true;
      this.hideUpArrow = " hidearrowforclose";
      this.hcpEmailErrorMessage = true;
      this.emailError = false;
      this.HcpEmailErr();
      return false;
    } else if (!this.validateEmailFormat(emailValue)) {
      this.hcpEmailErrorMessage = false;
      this.emailError = true;
      this.matchEmail = false;
      this.accordionStatusClose = true;
      this.hideUpArrow = " hidearrowforclose";
      this.HcpEmailErr();
      return false;
    }

    this.hideUpArrow = "hideuparrow";
    this.accordionStatusClose = false;
    this.emailError = false;
    this.hcpEmailErrorMessage = false;
    this.HcpEmail();
    return true;
  }

  validateAddressLine() {
    const FIELD = this.template.querySelector(
      'lightning-textarea[data-field="pAddressLine"]'
    );
    const value = FIELD.value;

    if (!value) {
      this.hcpAddressLineErrorMessage = true;
      this.accordionStatusClose = true;
      this.hideUpArrow = " hidearrowforclose";
      this.HcpAccNameErr();
      return false;
    }

    this.hideUpArrow = "hideuparrow";
    this.accordionStatusClose = false;
    this.hcpAddressLineErrorMessage = false;
    this.HcpAccName();
    return true;
  }

  validateEmailFormat(email) {
    // Assuming this is a custom method for email validation.
    const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/u;
    return emailPattern.test(email);
  }

  validateNonAccordionFields() {
    let isValid = true;
    const PHYSICIAN_FIELD = this.template.querySelector(
      'lightning-input[data-field="physician"]'
    );
    const HCP_ACCESS_CODE_FIELD = this.template.querySelector(
      'lightning-input[data-field="hcpaccesscode"]'
    );

    if (!this.showAccessCode && !this.showReferringPractitioner) {
      this.requiredMsg = true;
      isValid = false;
    } else {
      this.requiredMsg = false;
    }

    if (this.showAccessCode) {
      if (!HCP_ACCESS_CODE_FIELD.value) {
        this.accessCodeErrorMessage = true;
        HCP_ACCESS_CODE_FIELD.className = "textInput-err";
        isValid = false;
      } else {
        this.accessCodeErrorMessage = false;
        HCP_ACCESS_CODE_FIELD.className = "textInput";
      }
    }

    if (this.showReferringPractitioner) {
      if (this.searchResultEmpty === true) {
        this.physicianRequireMessage = false;
        this.hideSearchIcon = false;
        this.physicianNameErr();
        isValid = false;
      } else if (!PHYSICIAN_FIELD.value) {
        this.physicianRequireMessage = true;
        this.searchResultEmpty = false;
        this.physicianErrorMessage = false;
        this.physicianNameErr();
        isValid = false;
      } else {
        this.physicianRequireMessage = false;
        this.physicianErrorMessage = false;
        this.searchResultEmpty = false;
        this.hideSearchIcon = false;
        this.physicianName();
      }
    }

    return isValid;
  }

  physicianvalidateForm() {
    let isValid = true;

    if (this.accordionStatus) {
      isValid = this.validateAccordionFields();
    } else {
      isValid = this.validateNonAccordionFields();
    }

    return isValid;
  }

  accordionBodyChange() {
    this.searchResultsList = null;
    this.physicianRequireMessage = false;
    this.accordionStatus = !this.accordionStatus;
    if (this.accordionStatus === false) {
      this.doAccessHcp = false;
      this.doAccess = true;
      this.hideSearchIcon = true;
      this.hideUpArrow = "hideuparrow";
      this.accordionStatusClose = false;
      this.physicianvalidateFormerrorclear();
    } else {
      this.hideSearchIcon = false;
      // Double quotes can't be avoided since it's invoked from CSS

      this.hideSearchIcon = false;
      this.hideUpArrow = "hideuparrow";
      this.physicianErrorMessage = false;
      this.physicianName();
    }
  }
  physicianvalidateFormerrorclear() {
    this.hcpFirstNameErrorMessage = false;
    this.firstNameErrorMessageValid = false;
    this.HcpFirstName();

    this.hcpLastNameErrorMessage = false;
    this.lastNameErrorMessageValid = false;
    this.HcpLastName();

    this.hcpPhoneNumberErrorMessage = false;
    this.HcpPhoneField();

    this.emailError = false;
    this.hcpEmailErrorMessage = false;
    this.HcpEmail();

    this.hcpAddressLineErrorMessage = false;
    this.HcpAccName();
  }
  handleAccessCodeChange(event) {
    this.requiredMsg = false;
    //To achieve the mobile responsiveness, the following strings are hard coded. Custom Labels can't be used, since they truncate the strings.
    //To achieve mobile responsiveness, we are using innerHTML. However, when attempting to use textContent, it does not meet the design requirements
    const SELECTED_VALUE = event.target.value;
    if (SELECTED_VALUE === resource.YES) {
      this.showAccessCode = true;
      this.physicianRequireMessage = false;
      this.physicianErrorMessage = false;
      this.doAccess = true;
      this.doAccessHcp = false;
      this.accordionStatus = false;
      this.showReferringPractitioner = false;
      this.showInfoQuestion = false;
      this.accordionStatusClose = false;
      this.searchResultEmpty = false;
      this.hideSearchIcon = true;
      this.selectedSearchResultOne = "";
      this.addNewHcpSectionClass = "addNewHcpSection";
      this.hcpFirstNameErrorMessage = false;
      this.hcpLastNameErrorMessage = false;
      this.hcpPhoneNumberErrorMessage = false;
      this.hcpEmailErrorMessage = false;
      this.hcpAddressLineErrorMessage = false;

      //To achieve the mobile responsiveness, the following strings are hard coded. Custom Labels can't be used, since they truncate the strings.
      //To achieve mobile responsiveness, we are using innerHTML. However, when attempting to use textContent, it does not meet the design requirements
      this.avatarContentTop = resource.P_AVATAR_MSG_FIVE;
      this.avatarContentMid = ``;
      this.avatarContentLast = ``;
      this.avatarContLast = false;
      this.avatarContMid = false;
      this.breakLine = false;
      this.breakLineOne = false;
      this.handleClose();
      this.mobileView = resource.P_AVATAR_MOB_MSG_THREE;
      this.mobileViewSub = resource.P_AVATAR_MSG_FIVE;
    } else {
      this.showAccessCode = false;
      this.showReferringPractitioner = true;
      this.accessCodeErrorMessage = false;
      this.showInfoQuestion = true;
      this.accessCode = "";
      //To achieve the mobile responsiveness, the following strings are hard coded. Custom Labels can't be used, since they truncate the strings.
      //To achieve mobile responsiveness, we are using innerHTML. However, when attempting to use textContent, it does not meet the design requirements
      this.avatarContentTop = resource.P_AVATAR_MSG_TWO;
      this.avatarContentMid = resource.P_AVATAR_MID_MSG_TWO;
      this.avatarContentLast = ``;
      this.breakLine = false;
      this.breakLineOne = true;
      this.avatarContLast = false;
      this.avatarContMid = true;
      this.handleClose();
      this.mobileView = resource.P_AVATAR_MOB_MSG_TWO;
      this.mobileViewSub = resource.P_AVATAR_MOB_MSG_SIX;
    }
  }

  handleCommunicationMethodChange(event) {
    const SELECTED_VALUE = event.detail.value;
    this.PreferredMethodOfCommunication = SELECTED_VALUE;
    if (SELECTED_VALUE === resource.PHONE || SELECTED_VALUE === resource.SMS) {
      this.showContactNumber = true;
    } else {
      this.showContactNumber = false;
    }
  }

  openPopUp() {
    this.popUpClass = "popup-visible";
  }

  HCPSubmit() {
    // Double quotes can't be avoided since it's invoked from CSS
    let regForm = this.template.querySelector(
      'lightning-record-edit-form[data-id="regForm"]'
    );
    regForm.submit();
    this.popUpClass = "popup-hidden";
    if (typeof window !== resource.UNDIFINED) {
      this.dispatchEvent(
        new ShowToastEvent({
          title: resource.NEWPRACTITIONER,
          message: resource.SUBMIT_SUCCESS,
          variant: resource.LOGIN_SUCCESS
        })
      );
    }
  }

  Cancel() {
    this.popUpClass = "popup-hidden";
  }

  agecalculationEvent(event) {
    const DOB_DATE = new Date(event.target.value);
    const TODAY = new Date();
    const AGE = Math.floor((TODAY - DOB_DATE) / (365.25 * 24 * 60 * 60 * 1000));
    // Check if the individual is under 18 years old
    this.minor = AGE < resource.MINORAGE;

    // Check if the selected date is in the future
    if (DOB_DATE > TODAY) {
      // Display the validation message
      const ERROR_MESSAGE_DOB = resource.DOB_ERROR;
      // Double quotes can't be avoided since it's invoked from CSS
      this.template.querySelector('[data-field="dob-error"]').textContent =
        ERROR_MESSAGE_DOB;

      // Clear the input field or take other appropriate actions as needed
      event.target.value = "";

      // You can also prevent the form from submitting if needed
      event.preventDefault();
    } else {
      // Clear the validation message if the date is valid
      // Double quotes can't be avoided since it's invoked from CSS
      this.template.querySelector('[data-field="dob-error"]').textContent = "";
      if (AGE < resource.MINORAGE) {
        this.patientorcaregiver = this.caregiver;
        this.consentName = this.consentNameCaregiver;
      } else {
        this.patientorcaregiver = this.patient;
        this.consentName = this.consentNamePatient;
      }
    }
  }

  handleLeadIdChange(event) {
    this.leadId = event.target.value;
  }

  updateBtn() {
    if (this.careId !== null) {
      this.showUpdateForm = false;
      this.showInsertForm = true;
    } else {
      // Handle error
      this.showInsertForm = false;
      this.showUpdateForm = true;
    }
  }

  // handleButtonClick() {
  // 	try {
  // 		ENROLLEE_CAREGIVER_ID({ firstName: this.firstName })
  // 			// Null data is checked and AuraHandledException is thrown from the Apex
  // 			.then((result) => {
  // 				this.recordId = result;
  // 			})
  // 			.catch((error) => {
  // 				let globalThis = window;
  // 			globalThis.sessionStorage.setItem('errorMessage', error.body.message);
  //                     globalThis.location?.assign(this.baseUrl +  resource.BRANDED_URL + this.errorPage );
  // 			});
  // 	} catch (err) {
  // 		this.HandleToast(err.message);
  // 	}
  // }

  search(event) {
    const INPUT = event.detail.value.toLowerCase();
    const RESULT = this.picklistOrdered.filter((picklistOption) =>
      picklistOption.label.toLowerCase().includes(INPUT)
    );
    this.searchResults = RESULT;
  }
  searchOne(event) {
    this.hideSearchIcon = false;

    const INPUT = event.detail.value.toLowerCase();
    if (INPUT === "") {
      this.isSearchCleared = true;
      this.physicianRequireMessage = false;
      this.searchResultEmpty = false;
      this.addNewHcpSectionClass = "addNewHcpSection";
      this.hideSearchIcon = false;
      this.physicianName();
    } else if (INPUT) {
      this.physicianRequireMessage = false;
    } else if (this.showReferringPractitioner) {
      if (this.searchResultEmpty === true) {
        this.physicianRequireMessage = false;
        this.hideSearchIcon = false;
        this.physicianNameErr();
      }
    } else {
      this.physicianRequireMessage = false;
      this.physicianErrorMessage = false;
      this.searchResultEmpty = false;
      this.physicianName();
    }
    this.searchResultsList = this.picklistOrderedGet.filter((picklistOption1) =>
      picklistOption1.label.toLowerCase().includes(INPUT)
    );
    const SEARCHEDRESULTONE = this.picklistOrderedGet.filter(
      (picklistOption1) => picklistOption1.label.toLowerCase().includes(INPUT)
    );
    this.searchResultEmpty = SEARCHEDRESULTONE.length === 0;

    this.physicianNameErr();
    
    if (SEARCHEDRESULTONE.length > 0) {
        this.physicianName();
    }
    
    if (INPUT.length === 0) {
        this.searchResultsList = null;
    }
  }

  selectSearchResult(event) {
    const SELECTED_VALUE = event.currentTarget.dataset.value;
    this.selectedSearchResult = this.picklistOrdered.find(
      (picklistOption) => picklistOption.value === SELECTED_VALUE
    );
    const MESSAGE_EVENT = new CustomEvent(resource.CHANGE, {
      detail: {
        SELECTED_VALUE: this.SELECTED_VALUE
      }
    });
    if (typeof window !== resource.UNDIFINED) {
      this.dispatchEvent(MESSAGE_EVENT);
      this.clearSearchResults();
    }
  }
  selectSearchResultOne(event) {
    this.hideSearchIcon = false;
    const SELECTED_VALUE_ONE = event.currentTarget.dataset.value;
    this.selectedPreValues = event.currentTarget.dataset.value;

    this.searchResultEmpty = false;
    this.physicianErrorMessage = false;
    this.physicianRequireMessage = false;
    this.physicianName();
    this.selectedSearchResultOne = this.picklistOrderedGet.find(
      (picklistOption1) => picklistOption1.value === SELECTED_VALUE_ONE
    );

    const MESSAGE_EVENT = new CustomEvent(resource.CHANGE, {
      detail: {
        SELECTED_VALUE_ONE: SELECTED_VALUE_ONE
      }
    });
    this.addNewHcpSectionClass = "addNewHcpSection-disable";
    if (typeof window !== resource.UNDIFINED) {
      this.dispatchEvent(MESSAGE_EVENT);
      this.clearSearchResultsOne();
    }
    this.searchResultsList = null;
  }
  clearSearchResults() {
    this.searchResults = null;
  }
  clearSearchResultsOne() {
    this.searchResultsList = null;
  }
  showPicklistOptions() {
    if (!this.searchResults) {
      this.searchResults = this.picklistOrdered;
    }
  }

  ContactvalidateForm() {
    let isValid = true;

    isValid = this.validateMOCField() && isValid;
    isValid = this.validateCountryField() && isValid;
    isValid = this.validateStateField() && isValid;
    isValid = this.validateCityField() && isValid;
    isValid = this.validateStreetField() && isValid;
    isValid = this.validateZipCodeField() && isValid;
    isValid = this.validateCheckBox() && isValid;
    if (this.phoneNumberMandatory) {
      isValid = this.validatePhoneField() && isValid;
    }

    return isValid;
  }
  PmcFieldErr() {
    const field = this.template.querySelector(
      'lightning-combobox[data-field="conPmc"]'
    );
    field.className = "textInput-err";
    this.template.querySelector('div[data-field="conPmc"]').className =
      "input-error-label";
  }
  PmcField() {
    const field = this.template.querySelector(
      'lightning-combobox[data-field="conPmc"]'
    );
    field.className = "textInput";
    this.template.querySelector('div[data-field="conPmc"]').className =
      "input-label";
  }
  validateMOCField() {
    const field = this.template.querySelector(
      'lightning-combobox[data-field="conPmc"]'
    );
    if (!field.value) {
      this.conPmcErrorMessage = true;
      this.PmcFieldErr();
      return false;
    }
    this.conPmcErrorMessage = false;
    this.PmcField();
    return true;
  }
  CountryFieldErr() {
    const field = this.template.querySelector(
      'lightning-combobox[data-field="conCountry"]'
    );
    field.className = "textInput-err";
    this.template.querySelector('div[data-field="conCountry"]').className =
      "input-error-label";
  }
  CountryField() {
    const field = this.template.querySelector(
      'lightning-combobox[data-field="conCountry"]'
    );
    field.className = "textInput";
    this.template.querySelector('div[data-field="conCountry"]').className =
      "input-label";
  }
  validateCountryField() {
    const field = this.template.querySelector(
      'lightning-combobox[data-field="conCountry"]'
    );
    if (!field.value) {
      this.conCountryErrorMessage = true;
      this.CountryFieldErr();
      return false;
    }
    this.conCountryErrorMessage = false;
    this.CountryField();
    return true;
  }
  StateFieldErr() {
    const field = this.template.querySelector(
      'lightning-combobox[data-field="conState"]'
    );
    field.className = "textInput-err";
    this.template.querySelector('div[data-field="conState"]').className =
      "input-error-label";
  }
  StateField() {
    const field = this.template.querySelector(
      'lightning-combobox[data-field="conState"]'
    );
    field.className = "textInput";
    this.template.querySelector('div[data-field="conState"]').className =
      "input-label";
  }
  validateStateField() {
    const field = this.template.querySelector(
      'lightning-combobox[data-field="conState"]'
    );
    if (!field.value) {
      this.conStateErrorMessage = true;
      this.StateFieldErr();
      return false;
    }
    this.conStateErrorMessage = false;
    this.StateField();
    return true;
  }
  CityFieldErr() {
    const field = this.template.querySelector(
      'lightning-input[data-field="conCity"]'
    );
    field.className = "textInput-err";
    this.template.querySelector('div[data-field="conCity"]').className =
      "input-error-label";
  }
  CityField() {
    const field = this.template.querySelector(
      'lightning-input[data-field="conCity"]'
    );
    field.className = "textInput";
    this.template.querySelector('div[data-field="conCity"]').className =
      "input-label";
  }
  validateCityField() {
    const field = this.template.querySelector(
      'lightning-input[data-field="conCity"]'
    );
    if (!field.value) {
      this.conCityErrorMessage = true;
      this.RpCityErrorMessageValid = false;
      this.CityFieldErr();
      return false;
    } else if (!this.NameRegex().test(this.city)) {
      this.conCityErrorMessage = false;
      this.RpCityErrorMessageValid = true;
      this.CityFieldErr();
      return false;
    }
    this.conCityErrorMessage = false;
    this.RpCityErrorMessageValid = false;
    this.CityField();
    return true;
  }
  StreetFieldErr() {
    const field = this.template.querySelector(
      'lightning-textarea[data-field="conStreet"]'
    );
    field.className = "textInput-err";
    this.template.querySelector('div[data-field="conStreet"]').className =
      "input-error-label";
  }
  StreetField() {
    const field = this.template.querySelector(
      'lightning-textarea[data-field="conStreet"]'
    );
    field.className = "textInput";
    this.template.querySelector('div[data-field="conStreet"]').className =
      "input-label";
  }
  validateStreetField() {
    const field = this.template.querySelector(
      'lightning-textarea[data-field="conStreet"]'
    );
    if (!field.value) {
      this.conStreetErrorMessage = true;
      this.StreetFieldErr();
      return false;
    }
    this.conStreetErrorMessage = false;
    this.StreetField();
    return true;
  }
  ZipCodeRegex() {
    return /^[a-zA-Z0-9]+$/u;
  }
  ZipCodeFieldErr() {
    const field = this.template.querySelector(
      'lightning-input[data-field="conZipCode"]'
    );
    field.className = "textInput-err";
    this.template.querySelector('div[data-field="conZipCode"]').className =
      "input-error-label";
  }
  ZipCodeField() {
    const field = this.template.querySelector(
      'lightning-input[data-field="conZipCode"]'
    );
    field.className = "textInput";
    this.template.querySelector('div[data-field="conZipCode"]').className =
      "input-label";
  }
  validateZipCodeField() {
    const field = this.template.querySelector(
      'lightning-input[data-field="conZipCode"]'
    );
    this.ZiperrorMessagevalid = false;
    if (!field.value) {
      this.conZipCodeErrorMessage = true;
      this.ZiperrorMessagevalid = false;
      this.ZipCodeFieldErr();
      return false;
    } else if (!this.ZipCodeRegex().test(this.ZIP_CODE)) {
      this.conZipCodeErrorMessage = false;
      this.ZiperrorMessagevalid = true;
      this.ZipCodeFieldErr();
      return false;
    }
    this.conZipCodeErrorMessage = false;
    this.ZiperrorMessagevalid = false;
    this.ZipCodeField();
    return true;
  }

  validateCheckBox() {
    const checkBox = this.template.querySelector('span[data-field="checkbox"]');
    if (!this.checkBox) {
      this.checkBoxRequired = true;
      checkBox.className = "custom-checkbox-box_Error";
      return false;
    }
    this.checkBoxRequired = false;
    checkBox.className = "custom-checkbox-box";
    return true;
  }
  ConPhoneErr() {
    const field = this.template.querySelector(
      'lightning-input[data-field="conPhoneNumber"]'
    );
    field.className = "textInput-err";
    this.template.querySelector(
      'div[data-field="conPhoneNumber"]'
    ).className = "input-error-label";
  }
  ConPhone() {
    const field = this.template.querySelector(
      'lightning-input[data-field="conPhoneNumber"]'
    );
    field.className = "textInput";
    this.template.querySelector(
      'div[data-field="conPhoneNumber"]'
    ).className = "input-label";
  }
  validatePhoneField() {
    const field = this.template.querySelector(
      'lightning-input[data-field="conPhoneNumber"]'
    );
    if (!field.value) {
      this.conPhoneErrorMessage = true;
      this.PhoneerrorMessagevalid = false;
      this.ConPhoneErr();
      return false;
    } else if (!this.PhoneRegex().test(this.phone)) {
      this.conPhoneErrorMessage = false;
      this.PhoneerrorMessagevalid = true;
      this.ConPhoneErr();
      return false;
    }
    this.conPhoneErrorMessage = false;
    this.ConPhone();
    return true;
  }

  handleFirstNameChange(event) {
    this.firstName = event.target.value;
    this.firstName =
      event.target.value.trim().charAt(0).toUpperCase() +
      event.target.value.trim().slice(1);
    if (!this.NameRegex().test(this.firstName)) {
      this.firstNameErrorMessageValid = true;
      this.firstNameErrorMessage = false;
      this.FirstNameErr();
    } else if (this.firstName === "") {
      this.firstNameErrorMessage = true;
      this.FirstNameErr();
      this.firstNameErrorMessageValid = false;
    } else {
      this.firstNameErrorMessageValid = false;
      this.firstNameErrorMessage = false;
      this.FirstName();
    }
  }

  handlelastNameChange(event) {
    // Double quotes can't be avoided since it's invoked from CSS

    this.lastName = event.target.value;
    this.lastName =
      event.target.value.trim().charAt(0).toUpperCase() +
      event.target.value.trim().slice(1);
    if (!this.NameRegex().test(this.lastName)) {
      this.lastNameErrorMessageValid = true;
      this.lastNameErrorMessage = false;
      this.LastNameErr();
    } else if (this.lastName === "") {
      this.lastNameErrorMessage = true;
      this.lastNameErrorMessageValid = false;
      this.LastNameErr();
    } else {
      this.lastNameErrorMessage = false;
      this.lastNameErrorMessageValid = false;
      this.LastName();
    }
  }
  handleGenderChange(event) {
    // Double quotes can't be avoided since it's invoked from CSS
    this.gender = event.target.value;
    if (this.gender === "") {
      this.genderErrorMessage = true;
      this.lastNameErrorMessageValid = false;
      this.GenderFieldErr();
    } else {
      this.genderErrorMessage = false;
      this.lastNameErrorMessageValid = false;
      this.GenderField();
    }
  }
  handleDobChange(event) {
    this.dob = event.target.value;
    const SELECTED_DATE_ONES = new Date(this.dob);
    const CURRENT_DATE = new Date();
    const YEAR = SELECTED_DATE_ONES.getFullYear();
    const DOB_FIELD = this.template.querySelector(
      'lightning-input[data-field="dob"]'
    );
    if (YEAR < 1900) {
      this.oldYearError = true;
      this.DateFieldError();
    } else {
      this.oldYearError = false;
      this.DateField();
    }
    if (!DOB_FIELD.value) {
      this.doberrorMessage = true;
      this.DateFieldError();
    } else {
      this.doberrorMessage = false;
      this.DateField();
    }

    const MIN_AGE = resource.MINORAGE;
    const Age = Math.floor(
      (CURRENT_DATE - SELECTED_DATE_ONES) / (365.25 * 24 * 60 * 60 * 1000)
    );

    if (Age < MIN_AGE) {
      this.dobSelfMessage = true;
      this.DateFieldError();
    } else {
      this.dobSelfMessage = false;
      this.DateField();
    }

    this.validateDate();
  }

  validateDate() {
    // Double quotes can't be avoided since it's invoked from CSS

    const SELECTED_DATE_ONES = new Date(this.dob);
    const YEAR = SELECTED_DATE_ONES.getFullYear();
    if (YEAR < 1900) {
      this.oldYearError = true;
      this.DateFieldError();
    } else {
      this.oldYearError = false;
      this.DateField();
    }
    // Validate that the date is not in the future
    const CURRENT_DATE = new Date();
    const SELECTED_DATE = new Date(this.dob);
    if (SELECTED_DATE > CURRENT_DATE) {
      this.dobErrorMessage = resource.DOB_ERROR;
      this.dobSelfMessage = false;
      this.DateFieldError();
      return;
    }
    this.dobErrorMessage = false;

    // Validate that the user is not a minor (you can set a minimum age)
    const MIN_AGE = resource.MINORAGE;
    const Age = Math.floor(
      (CURRENT_DATE - SELECTED_DATE_ONES) / (365.25 * 24 * 60 * 60 * 1000)
    );

    if (Age < MIN_AGE) {
      this.dobSelfMessage = true;
      this.DateFieldError();

      return;
    }
    // If both validations pass, clear the error message
    this.dobErrorMessage = false;
  }

  handleEmailChange(event) {
    // Double quotes can't be avoided since it's invoked from CSS
    this.email = event.target.value;

    if (this.email === "") {
      this.emailErrorMessage = true;
      this.matchEmail = false;
      this.emailError = false;
      this.EmailErr();
    } else if (!this.validateEmail(this.email)) {
      this.emailErrorMessage = false;
      this.emailError = true;
      this.matchEmail = false;
      this.EmailErr();
    } else {
      this.emailError = false;
      this.emailErrorMessage = false;
      this.matchEmail = false;
      this.Email();
    }
  }

  handlePhoneChange(event) {
    // Double quotes can't be avoided since it's invoked from CSS
    this.phone = event.target.value;
    this.phone =
      event.target.value.trim().charAt(0).toUpperCase() +
      event.target.value.trim().slice(1);

    if (this.phone === "") {
      this.conPhoneErrorMessage = true;
      this.PhoneerrorMessagevalid = false;
      this.ConPhoneErr();
    } else if (!this.PhoneRegex().test(this.phone)) {
      this.conPhoneErrorMessage = false;
      this.PhoneerrorMessagevalid = true;
      this.ConPhoneErr();
    } else {
      this.conPhoneErrorMessage = false;
      this.PhoneerrorMessagevalid = false;
      this.ConPhone();
    }
  }
  handlePhoneChangeempty(event) {
    this.phone = event.target.value;
    if (this.phone === "") {
      this.handlePhoneErr();
    } else if (!this.PhoneRegex().test(this.phone)) {
      this.conPhoneErrorMessage = false;
      this.PhoneerrorMessagevalid = true;
      this.ConPhoneErr();
    } else {
      this.handlePhoneErr();
    }
  }
  handlePhoneErr(){
    this.conPhoneErrorMessage = false;
    this.PhoneerrorMessagevalid = false;
    this.ConPhone();
  }
  handlePmcChange(event) {
    this.pmc = event.target.value;
    if (this.pmc === resource.SMS || this.pmc === resource.PHONE) {
      this.phoneNumberMandatory = true;
      this.phoneNumberVisible = false;
      this.conPmcErrorMessage = false;
      this.PmcField();
    } else {
      this.phoneNumberMandatory = false;
      this.phoneNumberVisible = true;
      this.conPmcErrorMessage = true;
      this.PmcFieldErr();
      if (this.pmc === "") {
        this.conPmcErrorMessage = true;
        this.PmcFieldErr();
      } else {
        this.conPmcErrorMessage = false;
        this.PmcField();
      }
    }
  }

  handleCountryChange(event) {
    this.country = event.target.value;
    STATES({ selectedCountry: this.country })
      .then((result) => {
        this.StateCode = result.map((state) => ({
          label: state.Name,
          value: state.BI_PSPB_StateCode__c
        }));
      })
      .catch((error) => {
        let globalThis = window;
        globalThis.sessionStorage.setItem("errorMessage", error.body.message);
        globalThis.location?.assign(
          this.baseUrl + resource.BRANDED_URL + this.errorPage
        );
      });
    // Double quotes can't be avoided since it's invoked from CSS
    this.country = event.target.value;
    if (this.country === "") {
      this.conCountryErrorMessage = true;
      this.CountryFieldErr();
    } else {
      this.conCountryErrorMessage = false;
      this.CountryField();
    }
  }
  handleStateChange(event) {
    // Double quotes can't be avoided since it's invoked from CSS
    this.state = event.target.value;
    if (this.state === "") {
      this.conStateErrorMessage = true;
      this.StateFieldErr();
    } else {
      this.conStateErrorMessage = false;
      this.StateField();
    }
  }
  handleCityChange(event) {
    // Double quotes can't be avoided since it's invoked from CSS
    this.city = event.target.value;
    this.city =
      event.target.value.trim().charAt(0).toUpperCase() +
      event.target.value.trim().slice(1);
    if (this.city === "") {
      this.conCityErrorMessage = true;
      this.RpCityErrorMessageValid = false;
      this.CityFieldErr();
    } else if (!this.NameRegex().test(this.city)) {
      this.conCityErrorMessage = false;
      this.RpCityErrorMessageValid = true;
      this.CityFieldErr();
    } else {
      this.conCityErrorMessage = false;
      this.RpCityErrorMessageValid = false;
      this.CityField();
    }
  }
  handleStreetChange(event) {
    // Double quotes can't be avoided since it's invoked from CSS
    this.street = event.target.value;
    this.street =
      event.target.value.trim().charAt(0).toUpperCase() +
      event.target.value.trim().slice(1);
    if (this.street === "") {
      this.conStreetErrorMessage = true;
      this.StreetFieldErr();
    } else {
      this.conStreetErrorMessage = false;
      this.StreetField();
    }
  }
  handleZipCodeChange(event) {
    // Double quotes can't be avoided since it's invoked from CSS
    this.zipCode = event.target.value;
    this.zipCode =
      event.target.value.trim().charAt(0).toUpperCase() +
      event.target.value.trim().slice(1);
    if (this.zipCode === "") {
      this.conZipCodeErrorMessage = true;
      this.ZiperrorMessagevalid = false;
      this.ZipCodeFieldErr();
    } else if (!this.ZipCodeRegex().test(this.zipCode)) {
      this.conZipCodeErrorMessage = false;
      this.ZiperrorMessagevalid = true;
      this.ZipCodeFieldErr();
    } else {
      this.conZipCodeErrorMessage = false;
      this.ZiperrorMessagevalid = false;
      this.ZipCodeField();
    }
  }

  handleCreateLead() {
    // Validate the contact form
    if (!this.ContactvalidateForm()) {
      return;
    }

    // Prepare data for lead creation
    let hcpData = {
      firstName: this.hcpFirstName,
      lastName: this.hcpLastName,
      email: this.hcpEmail || "",
      phone: this.hcpPhone
    };
    let hcpdetail = {
      addressLine: this.addressLine
    };

    // If `selectedPreValues` is defined, create the HCP record and then create the lead record
    if (!this.selectedPreValues) {
      this.isButtonDisabled = true;
      HCP_CREATE({ hcpData: hcpData, hcpdetail: hcpdetail })
        .then((LEAD_ID) => {
          this.selectedPreValues = LEAD_ID;
          this.createLeadRecord();
        })
        .catch((error) => {
          let globalThis = window;
          globalThis.sessionStorage.setItem("errorMessage", error.body.message);
          globalThis.location?.assign(
            this.errorPage
          );
        });
    } else {
      // Create the lead record directly if `selectedPreValues` is not defined
      this.createLeadRecord();
    }
  }

  createLeadRecord() {
    let globalThis = window;
    let data = {
      firstName: this.firstName,
      lastName: this.lastName,
      dob: this.dob,
      sex: this.gender,
      email: this.email,
      phone: this.phone,
      prefferedMethodOfCom: this.pmc,
      country: this.country,
      state: this.state,
      city: this.city,
      street: this.street,
      zipCode: this.zipCode
    };

    try {
      this.isButtonDisabled = true;
      UPDATE_LEAD_PATIENT_RECORD({ data: data, hcpId: this.selectedPreValues })
        // Null data is checked and AuraHandledException is thrown from the Apex
        .then((leadId) => {
          this.leadIds = leadId;
               this.createConsentRecord(leadId);
          globalThis?.localStorage.setItem("recordId", this.leadIds);

          this.showSpinner = true;
          globalThis.location.assign(resource.PS_URL);

          // Perform any additional actions on success
        })
        .catch((error) => {
          // Check if it's a specific Salesforce API error
          globalThis.sessionStorage.setItem("errorMessage", error.body.message);
          globalThis.location?.assign(
            this.baseUrl + resource.BRANDED_URL + this.errorPage
          );
        });
    } catch (error) {
      // Handle any unexpected errors
      globalThis.sessionStorage.setItem("errorMessage", error.body.message);
      globalThis.location?.assign(
        this.baseUrl + resource.BRANDED_URL + this.errorPage
      );
    }
  }
createConsentRecord(leadId) {
		let globalThis = window;

		CREATE_CONSENT_RECORD({ category: this.category, leadId: leadId })
			.then((consentID) => {
				this.consentID = consentID;
			})
			.catch((error) => {
				globalThis.sessionStorage.setItem('errorMessage', error.body.message);
                        globalThis.location?.assign(this.baseUrl +  resource.BRANDED_URL + this.errorPage );
			});
	}
  goToHome() {
    let globalThis = window;
    globalThis.location.assign(resource.IAM_PATIENT_URL);
  }

  openModalOne() {
    // Handle your submit logic here

    // Set the isModalOpen to true to show the modal
    this.isModalOpen = true;
  }

  closeModalOne() {
    // Set the isModalOpen to false to hide the modal
    this.isModalOpen = false;
  }

  openItchinessModal() {
    this.submitModal = true;
  }
  closeItchinessModal() {
    this.submitModal = false;
  }

  validateEmail(email) {
    return String(email)
      .toLowerCase()
      .match(
        /^(([^<>()[\]\\.,;:\s@']+(\.[^<>()[\]\\.,;:\s@']+)*)|.('.+'))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/u
      );
  }

  handleKeyDown(event) {
    const CHAR_CODE = event.which ? event.which : event.keyCode; // Get the ASCII code of the pressed key
    if (CHAR_CODE !== 43 && (CHAR_CODE < 48 || CHAR_CODE > 57)) {
      // Allow only digits (48-57) and the plus symbol (43)
      event.preventDefault(); // Prevent the character from being entered
    }
  }

  click() {
    this.subValue = this.mobileView;
    this.mobileView = this.mobileViewSub;
    this.divFalse = false;
    this.fieldBox = true;
  }
  handleClose() {
    this.divFalse = true;
    this.mobileView = this.subValue;
    this.fieldBox = false;
  }
}