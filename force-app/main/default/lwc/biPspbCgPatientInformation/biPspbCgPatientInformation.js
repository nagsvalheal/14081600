// This component is used to retrieve caregiver data, access patient information, and create cases based on the account settings.
// To import Libraries
import { LightningElement, track, api, wire } from "lwc";
import { ShowToastEvent } from "lightning/platformShowToastEvent";
import { loadStyle } from "lightning/platformResourceLoader";

// To import current user ID
import Id from "@salesforce/user/Id";
//  To import Apex Classes
import UPDATE_PATIENT_DETAILS from "@salesforce/apex/BI_PSPB_ProfileManagerCtrl.updatePatientExcistInfo";
import CREATE_CASE from "@salesforce/apex/BI_PSPB_CaseDeletionCtrl.createCase";
import CREATE_ACCESS_CASE from "@salesforce/apex/BI_PSPB_CaseAccessCtrl.createAccessCase";
import CHECKBOX_VALUES from "@salesforce/apex/BI_PSPB_CaseAccessCtrl.checkboxPersonalAccess";
import CHECKBOX_VALUES_REQUEST from "@salesforce/apex/BI_PSPB_CaseDeletionCtrl.checkboxAccountDeletion";
import PATIENT_INFO from "@salesforce/apex/BI_PSPB_PatientFormCtrl.getPatientInfo";
import COUNTRYS from "@salesforce/apex/BI_PSPB_EnrollmentUtilities.getCountries";
import STATES from "@salesforce/apex/BI_PSPB_EnrollmentUtilities.getStates";

// To import Static Resources

import { resources } from "c/biPspbResourceProfileManager";
export default class BiPspbCgPatientInformation extends LightningElement {
  //Proper naming conventions with camel case for all the variables will be followed in the future releases
  // Declaration of variables with @api

  @api isLoaded = false;
  @api account;
  @api caregiverForm;
  @api selectedValue;

  // Declaration of variables with
  patientFirstName = "";
  firstNameErrorMessageValid = false;
  lastNameErrorMessageValid = false;
  RpCityErrorMessageValid = false;
  showDiv = false;
  showDiv1 = false;
  isFirstNameDisabled = true;
  isLastNameDisabled = true;
  isDOBDisabled = true;
  isEmailDisabled = true;
  isMobilePhoneDisabled = true;
  isGenderDisabled = true;
  isPOMDisabled = true;
  isMaillingCountryDisabled = true;
  isMaillingStateDisabled = true;
  isMaillingStreetDisabled = true;
  isMaillingPostalcodeDisabled = true;
  isMaillingCityDisabled = true;
  firstNameErrorMessage = false;
  lastNameErrorMessage = false;
  relationshipErrorMessage = false;
  dobErrorMessage = false;
  emailErrorMessage = false;
  phoneErrorMessage = false;
  conPmcErrorMessage = false;
  MobileErrorMessage = false;
  genderMessage = false;
  pmcMessage = false;
  countryCodeMessage = false;
  stateCodeMessage = false;
  cityMessage = false;
  streetMessage = false;
  postalCodeMessage = false;
  adult = false;
  ZipErrorMessagevalid = false;
  isCaregiver = false;
  patientId;
  patientLastName = "";
  patientDOB = "";
  patientAge = "";
  patientGender = "";
  patientEmail = "";
  preferredCommunication = "";
  patientMobilePhone = "";
  patientCountry = "";
  patientState = "";
  patientCity = "";
  patientStreet = "";
  patientZipCode = "";
  PersonBirthDate = "";

  futureDobError;
  openModal = false;
  validerrorMessage = false;
  FirstName;
  accountId;
  result;
  isDeletePopupOpen = false;
  isAccessPopupOpen = false;
  isAdult = false;
  @track relation = [];
  selectedCountryCode = "";
  selectedStateCode = "";
  @track countryCode = [];

  relations = "";
  dobrequired = false;
  country;
  state;

  deletepopup;
  accesspopup;

  GenderErrorMessage = false;
  DeleteMessage = false;
  accessMessage = false;
  colorChnage = "outlined-button"; //css class
  colorChanage = "outlined-button"; //css class
  boxedIcon = resources.BOXEDD_ICON;
  minorError = false;
  @track leadPmc = [
    { label: resources.MALE, value: resources.MALE },
    { label: resources.FEMALE, value: resources.FEMALE },
    { label: resources.PREFERNOT, value: resources.PREFERNOT },
    { label: resources.OTHERS, value: resources.OTHERS }
  ];
  @track preffer = [
    { label: resources.SMS_LABEL, value: resources.SMS_LABEL },
    { label: resources.PHONE_LABEL, value: resources.PHONE_LABEL },
    { label: resources.EMAIL_LABEL, value: resources.EMAIL_LABEL }
  ];
  phoneNumberMandatory = false;
  accountSettingHide = true;

  updatePopup = false;
  touch = false;
  down = true;
  up = false;
  pmcName = resources.PHONE_MANDATORY;
  // Declaration of Global variables
  enrolleeids;
  isButtonDeleteDisabled = false;
  isAccessButtonDisabled = false;

  userId = Id;
  caregiverAccountIds;
  rightimg = resources.RIGHT_ICON;
  firstNameError = resources.FIRST_NAMEERROR;
  lastNameError = resources.LAST_NAMEERROR;
  emailError = resources.EMAIL_ERROR;
  dobError = resources.DOB;
  genderError = resources.GENDER;
  aboveError = resources.ABOVE_ERROR;
  futureError = resources.FUTHURE_DATE;
  minorMsg = resources.MINOR_ERROR;
  mobileError = resources.MOBILE;
  phoneError = resources.PHONE_ERROR;
  preferredMode = resources.PREFERRED_CONTACT_METHOD;
  countryError = resources.COUNTRY;
  stateError = resources.STATE;
  cityError = resources.CITY;
  streetError = resources.STREET;
  pincodeError = resources.PINCODE;
  almostThere = resources.ALMOST_THERE;
  updatePatientInfo = resources.UPDATE_PATIENT;
  deleteAccount = resources.DELETE_ACCOUNT;
  address = resources.ADDRESS;
  communicationDetails = resources.COMMUNICATION_DETAILS;
  personalInformation = resources.PERSONAL_INFORMATION;
  accountSettings = resources.ACCOUNT_SETTINGS;
  Warningicon = resources.WARNING;
  validateLastNameError = resources.VALIDLNAME;
  validateFirstNameError = resources.VALIDFNAME;
  quickLinks = resources.QUICKLINKS;
  firstnamelabel = resources.FIRSTNAME_LABEL;
  lastnameLabel = resources.LASTNAME_LABEL;
  dobLabel = resources.DOB_LABEL;
  genderLabel = resources.GENDER_LABEL;
  emailLabel = resources.EMAIL_HEADING;
  prefferedLabel = resources.PREFFERED_LABEL;
  enterPreferredMode = resources.ENTER_PREFERRED;
  countryLabel = resources.COUNTRY_LABEL;
  stateLabel = resources.STATE_LABEL;
  citylabel = resources.CITY_LABEL;
  streetAddress = resources.STREET_ADDRESS;
  zipcodeLabel = resources.ZIPCODE_LABEL;
  validError = resources.VALIDPINCODE;
  saveChanges = resources.SAVECHANGES;
  deleteAccountLabel = resources.DELETEACCOUNT;
  deleteRequest = resources.DELETEREQUEST;
  deleteButton = resources.DELETE_BUTTON;
  requestButton = resources.REQUEST_BUTTON;
  yesButton = resources.YES_BUTTON;
  noButton = resources.NO_BUTTON;
  validCity = resources.VALIDCITY;
  personalInfo = resources.PERSONAL_INFO;
  accessRequest = resources.ACCESS_REQUEST;
  requestAccess = resources.REQUEST_ACCESS;
  requestDelete = resources.REQUEST_DELETE;
  personalRequest = resources.PERSONAL_REQUEST;
  sendRequest = resources.SEND_REQUEST;
  dateError = resources.DOB;
  enterDob = resources.ENTER_DOB;
  enterLastName = resources.ENTER_LASTNAME;
  enterFirstName = resources.ENTER_FIRSTNAME;
  enterEmail = resources.ENTER_EMAIL;
  select = resources.SELECT;
  enterPhone = resources.PHONE_NUMBER;
  enterCountry = resources.ENTER_COUNTRY;
  enterState = resources.ENTER_STATE;
  enterCity = resources.ENTER_CITY;
  enterZipcode = resources.ENTER_ZIPCODE;
  enterStreet = resources.ENTER_STREET;
  StateCode = [];
  checkbox1Value;
  checkbox2Value;

  // Wire method to retrieve object information for the Account object

  //get country values
  @wire(COUNTRYS)
  wiredCountries({ error, data }) {
     loadStyle(this, resources.TEXT_ALIGN);
    if (data) {
      this.countryCode = data.map((country) => ({
        label: country.label,
        value: country.value
      }));
    } else if (error) {
      let globalThis = window;
      this.error = resources.COUNTRY_NOT_FOUND;
      globalThis.location.href = resources.ERROR_PAGE;
      globalThis.sessionStorage.setItem("errorMessage", this.error);
    }
  }  

  //wire method for prepopulating patient information
  @wire(PATIENT_INFO)
  wiredCaregiverAccounts({ error, data }) {
    try {
      if (data && data !== null) {
        this.accountId = data.Id;
        this.patientFirstName = data.FirstName;
        this.patientLastName = data.LastName;
        this.patientDOB = data.BI_PSP_Birthdate__c;
        this.patientAge = data.BI_PSP_Age__c;
        this.patientEmail = data.PersonEmail;
        this.patientMobilePhone = data.Phone;
        this.relations = data.HealthCloudGA__Gender__pc;
        this.preferredCommunication =
          data.BI_PSPB_Preferred_Communication_Method__c;
        this.country = data.PersonMailingCountryCode;
        this.state = data.PersonMailingStateCode;
        this.patientCity = data.PersonMailingCity;
        this.patientStreet = data.PersonMailingStreet;
        this.patientZipCode = data.PersonMailingPostalCode;

        if (this.country && this.state) {
          this.loadState();
        }
        if (typeof window !== 'undefined') {
					this.dispatchEvent(new CustomEvent('load'));
				}
        if (
          (this.patientDOB !== null || this.patientDOB !== undefined) &&
          this.patientAge <= resources.MINOR_AGE
        ) {
          this.phoneNumberMandatory = true;
          this.isFirstNameDisabled = false;
          this.isLastNameDisabled = false;
          this.isDOBDisabled = false;
          this.isGenderDisabled = false;
          this.isEmailDisabled = false;
          this.isMobilePhoneDisabled = false;
          this.isPOMDisabled = false;
          this.isMaillingCityDisabled = false;
          this.isMaillingCountryDisabled = false;
          this.isMaillingPostalcodeDisabled = false;
          this.isMaillingStateDisabled = false;
          this.isMaillingStreetDisabled = false;
          this.isMobilePhoneDisabled = false;
          this.isAdult = true;
        } else if (
          (this.patientDOB !== null || this.patientDOB !== undefined) &&
          this.patientAge > resources.MINOR_AGE
        ) {
          if (this.preferredCommunication === "Email") {
            this.pmcName = resources.PHONE_NUMBER_LABEL;
          } else {
            this.pmcName = resources.PHONE_MANDATORY;
          }
          this.isFirstNameDisabled = true;
          this.accountSettingHide = false;
          this.isLastNameDisabled = true;
          this.isDOBDisabled = true;
          this.isGenderDisabled = true;
          this.isEmailDisabled = true;
          this.isMobilePhoneDisabled = false;
          this.isPOMDisabled = false;
          this.isMaillingCityDisabled = false;
          this.isMaillingCountryDisabled = false;
          this.isMaillingPostalcodeDisabled = false;
          this.isMaillingStateDisabled = false;
          this.isMaillingStreetDisabled = false;
          this.isMobilePhoneDisabled = false;
          this.isAdult = false;
        }
      } else if (error) {
        let globalThis = window;
        this.error = error.body.message;
        globalThis.location.href = resources.ERROR_PAGE;
        globalThis.sessionStorage.setItem("errorMessage", this.error);
      }
      
    } catch (err) {
      let globalThis = window;
      globalThis.location.href = resources.ERROR_PAGE;
      globalThis.sessionStorage.setItem("errorMessage", err);
    }
  }
  //Get the checkbox values from created cases for patient in account setting(Request access)
  @wire(CHECKBOX_VALUES, { relatedAccounts: "$accountId" })
  wiredCheckboxValues({ data, error }) {
    try {
      /*For a null check, the error is logged. It cannot be thrown as an Aura handled Exception because there may 
		  be a possibility the user has no case records. The toast message can be disruptive to the UI/UX design.*/
      if (data) {
        this.checkbox1Value = data.BI_PSP_Personal_Information_Request__c;

        if (this.checkbox1Value === true) {
          this.isAccessButtonDisabled = false;
          this.colorChnage = "outlined-button";
        } else {
          this.isAccessButtonDisabled = true;
          this.colorChnage = "button-bttn";
          this.accessMessage = true;
        }
      }else if (error) {
        let globalThis = window;
        globalThis.location.href = resources.ERROR_PAGE;
        globalThis.sessionStorage.setItem("errorMessage", error.body.message);
      }
    } catch (err) {
      let globalThis = window;
      globalThis.location.href = resources.ERROR_PAGE;
      globalThis.sessionStorage.setItem("errorMessage", err);
    }
  }
  //Get the checkbox values from created cases for patient in account setting (Delete Access)
  @wire(CHECKBOX_VALUES_REQUEST, { relatedAccounts: "$accountId" })
  wiredCheckboxValuestwo({ data,error }) {
    try {
      /*For a null check, the error is logged. It cannot be thrown as an Aura handled Exception because there may 
		  be a possibility the user has no case records. The toast message can be disruptive to the UI/UX design.*/
      if (data) {
        this.checkbox2Value = data.BI_PSP_Account_Deletion_Request__c;
        if (this.checkbox2Value === true) {
          this.isButtonDeleteDisabled = false;
          this.colorChanage = "outlined-button";
        } else {
          this.isButtonDeleteDisabled = true;
          this.colorChanage = "button-bttn";
          this.DeleteMessage = true;
        }
      }else if (error) {
        let globalThis = window;
        this.error = error.body.message;
        globalThis.location.href = resources.ERROR_PAGE;
        globalThis.sessionStorage.setItem("errorMessage", this.error);
      }
    } catch (err) {
      let globalThis = window;
      globalThis.location.href = resources.ERROR_PAGE;
      globalThis.sessionStorage.setItem("errorMessage", err);
    }
  }

  //to validate the first name
  handleFieldChange(event) {
    // Assuming you're using event.target.value to get the value from the input field
    this.patientFirstName = event.target.value;
    this.patientFirstName =
      event.target.value.trim().charAt(0).toUpperCase() +
      event.target.value.trim().slice(1);

    this.firstNameErrorMessage = false;

    this.validateFirstName(); // Call the method to validate the first name
  }

  // to validate the first name
  validateFirstName() {
    const FIRST_NAME_FIELD = this.template.querySelector(
      'lightning-input[data-field="FirstName"]'
    );
    if (!this.patientFirstName) {
      this.firstNameErrorMessage = true;
      this.firstNameErrorMessageValid = false;
      // Add CSS classes to highlight the input field and label with an error
      //to get data field value from html
      FIRST_NAME_FIELD.className = "textInput-err";
      this.template.querySelector('label[data-field="FirstName"]').className =
        "input-error-label";
    } else if (!/^[a-zA-ZÀ-ž\s\-`'.]+$/u.test(this.patientFirstName)) {
      this.firstNameErrorMessage = false;
      this.firstNameErrorMessageValid = true;
      FIRST_NAME_FIELD.className = "textInput-err";
      this.template.querySelector('label[data-field="FirstName"]').className =
        "input-error-label";
    } else {
      this.firstNameErrorMessage = false;
      this.firstNameErrorMessageValid = false;
      // Remove CSS classes if the validation passes
      FIRST_NAME_FIELD.className = "textInput";
      this.template.querySelector('label[data-field="FirstName"]').className =
        "input-label";
    }
  }

  // to validate the last name
  handlelastname(event) {
    this.patientLastName = event.target.value;
    this.patientLastName =
      event.target.value.trim().charAt(0).toUpperCase() +
      event.target.value.trim().slice(1);

    this.lastNameErrorMessage = false;
    this.validatelastName();
  }

  

  agecalculationEvent(event) {
    this.patientDOB = event.target.value;
    this.validateDate();
  }

  validateDate() {
    const CURRENTDATE = new Date();
    const SELECTEDDATE = new Date(this.patientDOB);
    const MINAGE = resources.MINOR_AGE;

    // Reset error messages and input styles
    this.resetErrors();

    // Check if the date is in the future
    if (SELECTEDDATE > CURRENTDATE) {
      this.minorErrorThree = true;
      this.dobrequired = false;
      this.dobErrorMessage = false;
      this.setFieldError("Birthdate");

      return;
    }

    if (!this.patientDOB) {
      this.dobrequired = true;
      this.template.querySelector(
        'lightning-input[data-field="Birthdate"]'
      ).className = "textInput-err";
      this.template.querySelector('label[data-field="Birthdate"]').className =
        "input-error-label";
    } else {
      this.dobrequired = false;
      this.template.querySelector(
        'lightning-input[data-field="Birthdate"]'
      ).className = "textInput";
      this.template.querySelector('label[data-field="Birthdate"]').className =
        "input-label";
    }
    // Check if the user is a MINOR

    if (SELECTEDDATE > MINAGE || this.patientDOB > MINAGE) {
      this.adult = true;
    }
    // Check if the date is before 1900
    if (SELECTEDDATE < new Date("1900-01-01")) {
      this.minorErrorTwo = true;
      this.dobErrorMessage = false;
      this.setFieldError("Birthdate");
      return;
    }

    // If all validations pass, clear the error message
    this.dobErrorMessage = "";
  }

  resetErrors() {
    this.minorError = false;
    this.minorErrorTwo = false;
    this.minorErrorThree = false;
    this.clearFieldError("Birthdate");
  }

  setFieldError(fieldName) {
    const INPUT_FIELD = this.template.querySelector(
      `lightning-input[data-field="${fieldName}"]`
    );
    INPUT_FIELD.className = "textInput-err";
    const labelField = this.template.querySelector(
      `label[data-field="${fieldName}"]`
    );
    labelField.className = "input-error-label";
  }

  clearFieldError(fieldName) {
    const INPUT_FIELD = this.template.querySelector(
      `lightning-input[data-field="${fieldName}"]`
    );
    INPUT_FIELD.className = "textInput";
    const labelField = this.template.querySelector(
      `label[data-field="${fieldName}"]`
    );
    labelField.className = "input-label";
  }

  //to validate phone field
  handleFielphone(event) {
    this.patientMobilePhone = event.target.value;
    if (
      this.patientMobilePhone === "" &&
      this.pmcName === resources.PHONE_MANDATORY
    ) {
      this.phoneErrorMessage = true;
      this.template.querySelector(
        'lightning-input[data-field="phone"]'
      ).className = "textInput-err";
      this.template.querySelector('label[data-field="phone"]').className =
        "input-error-label";
    } else {
      this.phoneErrorMessage = false;
      this.template.querySelector(
        'lightning-input[data-field="phone"]'
      ).className = "textInput";
      this.template.querySelector('label[data-field="phone"]').className =
        "input-label";
    }
  }
  //to validate relationship field
  relationshipEvent(event) {
    this.relations = event.target.value;
    this.relationshipErrorMessage = false;
    this.template.querySelector(
      'lightning-combobox[data-field="relationship"]'
    ).className = "textInput";
    this.template.querySelector('label[data-field="relationship"]').className =
      "input-label";
  }

  //to validate preferred communication method
  handlePmcChange(event) {
    this.preferredCommunication = event.target.value;

    if (
      this.preferredCommunication === resources.SMS_LABEL ||
      this.preferredCommunication === resources.PHONE_LABEL
    ) {
      this.pmcName = resources.PHONE_MANDATORY;
      if (
        this.patientMobilePhone === "" ||
        this.patientMobilePhone === undefined
      ) {
        this.phoneErrorMessage = true;
        this.template.querySelector(
          'lightning-input[data-field="phone"]'
        ).className = "textInput-err";
        this.template.querySelector('label[data-field="phone"]').className =
          "input-error-label";
      } else {
        this.pmcName = resources.PHONE_MANDATORY;

        this.phoneErrorMessage = false;
        this.template.querySelector(
          'lightning-input[data-field="phone"]'
        ).className = "textInput";
        this.template.querySelector('label[data-field="phone"]').className =
          "input-label";
      }
    } else {
      this.pmcName = resources.PHONE_NUMBER_LABEL;

      this.phoneErrorMessage = false;
      this.template.querySelector(
        'lightning-input[data-field="phone"]'
      ).className = "textInput";
      this.template.querySelector('label[data-field="phone"]').className =
        "input-label";
    }

    if (this.preferredCommunication === "") {
      this.conPmcErrorMessage = true;
      this.template.querySelector(
        'lightning-combobox[data-field="conPmc"]'
      ).className = "textInput-err";
      this.template.querySelector('label[data-field="conPmc"]').className =
        "input-error-label";
    } else {
      this.conPmcErrorMessage = false;
      this.template.querySelector(
        'lightning-combobox[data-field="conPmc"]'
      ).className = "textInput";
      this.template.querySelector('label[data-field="conPmc"]').className =
        "input-label";
    }
  }
  //to validate country field
  handleFielcountry(event) {
    const COUNTRYCLASS = this.template.querySelector(
      'lightning-input[data-field="country"]'
    );
    this.country = event.target.value;
    this.state = null;
    this.loadState();
    if (this.country === "") {
      this.countryCodeMessage = true;
      COUNTRYCLASS.className = "textInput-err";
      this.template.querySelector('label[data-field="country"]').className =
        "input-error-label";
    }
    this.countryCodeMessage = false;
    COUNTRYCLASS.className = "textInput";
    this.template.querySelector('label[data-field="country"]').className =
      "input-label";
  }
  loadState() {
    STATES({ selectedCountry: this.country })
      .then((result) => {
        this.StateCode = result.map((state) => ({
          label: state.Name,
          value: state.BI_PSPB_StateCode__c
        }));
      })
      .catch(() => {
        let globalThis = window;
        this.error = resources.STATE_NOT_FOUND;
        globalThis.location.href = resources.ERROR_PAGE;
        globalThis.sessionStorage.setItem("errorMessage", this.error);
      });
  }
  //to validate state field
  handleFieldstate(event) {
    this.state = event.target.value;

    if (this.state === "") {
      this.stateCodeMessage = true;
      this.template.querySelector(
        'lightning-combobox[data-field="state"]'
      ).className = "textInput-err";
      this.template.querySelector('label[data-field="state"]').className =
        "input-error-label";
    } else {
      this.stateCodeMessage = false;
      this.template.querySelector(
        'lightning-combobox[data-field="state"]'
      ).className = "textInput";
      this.template.querySelector('label[data-field="state"]').className =
        "input-label";
    }
  }
  //to validate city field
  handleFieldCity(event) {
    const CITYCLASS = this.template.querySelector(
      'lightning-input[data-field="city"]'
    );
    this.patientCity = event.target.value;
    this.patientCity =
      event.target.value.trim().charAt(0).toUpperCase() +
      event.target.value.trim().slice(1);
    if (this.patientCity === "") {
      this.cityMessage = true;
      this.RpCityErrorMessageValid = false;
      CITYCLASS.className = "textInput-err";
      this.template.querySelector('label[data-field="city"]').className =
        "input-error-label";
    } else if (!/^[a-zA-ZÀ-ž\s\-`'.]+$/u.test(this.patientCity)) {
      this.cityMessage = false;
      this.RpCityErrorMessageValid = true;
      CITYCLASS.className = "textInput-err";
      this.template.querySelector('label[data-field="city"]').className =
        "input-error-label";
    } else {
      this.cityMessage = false;
      this.RpCityErrorMessageValid = false;
      CITYCLASS.className = "textInput";
      this.template.querySelector('label[data-field="city"]').className =
        "input-label";
    }
  }
  //validate street field
  handleFieldstreet(event) {
    const STREETCLASS = this.template.querySelector(
      'lightning-input[data-field="street"]'
    );
    this.patientStreet = event.target.value;
    if (this.patientStreet === "") {
      this.streetMessage = true;
      STREETCLASS.className = "textInput-err";
      this.template.querySelector('label[data-field="street"]').className =
        "input-error-label";
    } else {
      this.streetMessage = false;
      STREETCLASS.className = "textInput";
      this.template.querySelector('label[data-field="street"]').className =
        "input-label";
    }
  }
  //validate pincode field
  handleFieldcode(event) {
    const PINCODECLASS = this.template.querySelector(
      'lightning-input[data-field="zipcode"]'
    );
    this.patientZipCode = event.target.value;
    if (this.patientZipCode === "") {
      this.postalCodeMessage = true;
      this.ZipErrorMessagevalid = false;
      PINCODECLASS.className = "textInput-err";
      this.template.querySelector('label[data-field="zipcode"]').className =
        "input-error-label";
    } else if (!/^[a-zA-Z0-9]+$/u.test(this.patientZipCode)) {
      this.postalCodeMessage = false;
      this.ZipErrorMessagevalid = true;
      PINCODECLASS.className = "textInput-err";
      this.template.querySelector('label[data-field="zipcode"]').className =
        "input-error-label";
    } else {
      this.postalCodeMessage = false;
      this.ZipErrorMessagevalid = false;
      PINCODECLASS.className = "textInput";
      this.template.querySelector('label[data-field="zipcode"]').className =
        "input-label";
    }
  }

  //validate phone field
  validatePhoneInput(event) {
    const CHARCODE = event.which ? event.which : event.keyCode; // Get the ASCII code of the pressed key
    if (CHARCODE !== 43 && (CHARCODE < 48 || CHARCODE > 57)) {
      // Allow only digits (48-57) and the plus symbol (43)
      event.preventDefault(); // Prevent the character from being entered
    }
  }

  //FIRST_NAME and LAST_NAME regex
  handleKeyDown1(event) {
    const ALLOWEDCHARACTERS = /^[A-Za-z]+$/u;
    if (!ALLOWEDCHARACTERS.test(event.key)) {
      event.preventDefault();
    }
  }
  // Not allow paste event in FIRST_NAME and last name
  handlePaste(event) {
    // Prevent default paste behavior
    event.preventDefault();
  }

  handleKeyDownThree(event) {
    event.preventDefault();
  }
  //checks whether all fields have values and updates patient information
  handle_Success() {
    this.validateFirstName();
    this.validatelastName();
    this.validateDOB();
    this.validateRelationship();
    this.validateCountry();
    this.validateState();
    this.validateCity();
    this.validateStreet();
    this.validateZipCode();
    this.validatePhoneAndCommunication();
  }

 

  validatelastName() {
    const LAST_NAME_FIELD = this.template.querySelector(
      'lightning-input[data-field="LastName"]'
    );
    if (!this.patientLastName) {
      this.lastNameErrorMessage = true;
      this.lastNameErrorMessageValid = false;
      LAST_NAME_FIELD.className = "textInput-err";
      this.template.querySelector('label[data-field="LastName"]').className =
        "input-error-label";
    } else if (!/^[a-zA-ZÀ-ž\s\-`'.]+$/u.test(this.patientLastName)) {
      this.lastNameErrorMessage = false;
      this.lastNameErrorMessageValid = true;
      LAST_NAME_FIELD.className = "textInput-err";
      this.template.querySelector('label[data-field="LastName"]').className =
        "input-error-label";
    } else {
      this.lastNameErrorMessage = false;
      this.lastNameErrorMessageValid = false;
      LAST_NAME_FIELD.className = "textInput";
      this.template.querySelector('label[data-field="LastName"]').className =
        "input-label";
    }
  }

  validateDOB() {
    if (!this.patientDOB) {
      this.dobrequired = true;
      this.template.querySelector(
        'lightning-input[data-field="Birthdate"]'
      ).className = "textInput-err";
      this.template.querySelector('label[data-field="Birthdate"]').className =
        "input-error-label";
    } else {
      this.dobrequired = false;
      this.template.querySelector(
        'lightning-input[data-field="Birthdate"]'
      ).className = "textInput";
      this.template.querySelector('label[data-field="Birthdate"]').className =
        "input-label";
      this.validateDate();
    }
  }

  validateRelationship() {
    if (!this.relations) {
      this.relationshipErrorMessage = true;
      this.template.querySelector(
        'lightning-combobox[data-field="relationship"]'
      ).className = "textInput-err";
      this.template.querySelector(
        'label[data-field="relationship"]'
      ).className = "input-error-label";
    } else {
      this.relationshipErrorMessage = false;
      this.template.querySelector(
        'lightning-combobox[data-field="relationship"]'
      ).className = "textInput";
      this.template.querySelector(
        'label[data-field="relationship"]'
      ).className = "input-label";
    }
  }

  validateCountry() {
    if (!this.country) {
      this.countryCodeMessage = true;
      this.template.querySelector(
        'lightning-combobox[data-field="country"]'
      ).className = "textInput-err";
      this.template.querySelector('label[data-field="country"]').className =
        "input-error-label";
    } else {
      this.countryCodeMessage = false;
      this.template.querySelector(
        'lightning-combobox[data-field="country"]'
      ).className = "textInput";
      this.template.querySelector('label[data-field="country"]').className =
        "input-label";
    }
  }

  validateState() {
    if (!this.state) {
      this.stateCodeMessage = true;
      this.template.querySelector(
        'lightning-combobox[data-field="state"]'
      ).className = "textInput-err";
      this.template.querySelector('label[data-field="state"]').className =
        "input-error-label";
    } else {
      this.stateCodeMessage = false;
      this.template.querySelector(
        'lightning-combobox[data-field="state"]'
      ).className = "textInput";
      this.template.querySelector('label[data-field="state"]').className =
        "input-label";
    }
  }

  validateCity() {
    if (!this.patientCity) {
      this.cityMessage = true;
      this.RpCityErrorMessageValid = false;
      this.template.querySelector(
        'lightning-input[data-field="city"]'
      ).className = "textInput-err";
      this.template.querySelector('label[data-field="city"]').className =
        "input-error-label";
    } else if (!/^[a-zA-ZÀ-ž\s\-`'.]+$/u.test(this.patientCity)) {
      this.cityMessage = false;
      this.RpCityErrorMessageValid = true;
      this.template.querySelector(
        'lightning-input[data-field="city"]'
      ).className = "textInput-err";
      this.template.querySelector('label[data-field="city"]').className =
        "input-error-label";
    } else {
      this.cityMessage = false;
      this.RpCityErrorMessageValid = false;
      this.template.querySelector(
        'lightning-input[data-field="city"]'
      ).className = "textInput";
      this.template.querySelector('label[data-field="city"]').className =
        "input-label";
    }
  }

  validateStreet() {
    if (!this.patientStreet) {
      this.streetMessage = true;
      this.template.querySelector(
        'lightning-input[data-field="street"]'
      ).className = "textInput-err";
      this.template.querySelector('label[data-field="street"]').className =
        "input-error-label";
    } else {
      this.streetMessage = false;
      this.template.querySelector(
        'lightning-input[data-field="street"]'
      ).className = "textInput";
      this.template.querySelector('label[data-field="street"]').className =
        "input-label";
    }
  }

  validateZipCode() {
    if (!this.patientZipCode) {
      this.postalCodeMessage = true;
      this.template.querySelector(
        'lightning-input[data-field="zipcode"]'
      ).className = "textInput-err";
      this.template.querySelector('label[data-field="zipcode"]').className =
        "input-error-label";
    } else if (!/^[a-zA-Z0-9]+$/u.test(this.patientZipCode)) {
      this.postalCodeMessage = false;
      this.ZipErrorMessagevalid = true;
      this.template.querySelector(
        'lightning-input[data-field="zipcode"]'
      ).className = "textInput-err";
      this.template.querySelector('label[data-field="zipcode"]').className =
        "input-error-label";
    } else {
      this.postalCodeMessage = false;
      this.ZipErrorMessagevalid = false;
      this.template.querySelector(
        'lightning-input[data-field="zipcode"]'
      ).className = "textInput";
      this.template.querySelector('label[data-field="zipcode"]').className =
        "input-label";
    }
  }

  validatePhoneAndCommunication() {
    if (this.patientAge > resources.MINOR_AGE) {
      this.validatePhone();
      this.validatePreferredCommunication();
      this.validateEmail();
      this.checkAndExecuteUpdate();
    } else {
      this.checkAndUpdateForMinor();
    }
  }

  validatePhone() {
    if (
      !this.patientMobilePhone &&
      (this.preferredCommunication === resources.SMS_LABEL ||
        this.preferredCommunication === resources.PHONE_LABEL)
    ) {
      this.phoneErrorMessage = true;
      this.setFieldErrorStyles("phone");
    } else {
      this.phoneErrorMessage = false;
    }
  }

  validatePreferredCommunication() {
    if (!this.preferredCommunication) {
      this.conPmcErrorMessage = true;
      this.setFieldErrorStyles("conPmc");
    } else {
      this.conPmcErrorMessage = false;
    }
  }

  validateEmail() {
    this.emailErrorMessage = !this.patientEmail;
  }

  checkAndExecuteUpdate() {
    if (!this.hasAnyError() && !this.hasAnyValidationError()) {
      this.updatePatientDetails();
    }
  }

  checkAndUpdateForMinor() {
    if (
      this.dobrequired === false &&
      this.patientMobilePhone === undefined &&
      !this.hasAnyValidationError()
    ) {
      this.updatePatientDetails();
    }
  }

  hasAnyError() {
    return (
      this.firstNameErrorMessage ||
      this.lastNameErrorMessage ||
      this.relationshipErrorMessage ||
      this.countryCodeMessage ||
      this.stateCodeMessage ||
      this.cityMessage ||
      this.streetMessage ||
      this.postalCodeMessage ||
      this.phoneErrorMessage ||
      this.conPmcErrorMessage
    );
  }

  hasAnyValidationError() {
    return (
      this.dobrequired ||
      this.ZipErrorMessagevalid ||
      this.minorErrorTwo ||
      this.minorErrorThree ||
      this.minorError ||
      this.dobErrorMessage ||
      this.firstNameErrorMessageValid ||
      this.lastNameErrorMessageValid ||
      this.RpCityErrorMessageValid
    );
  }

  setFieldErrorStyles(fieldName) {
    this.template.querySelector(
      `lightning-input[data-field="${fieldName}"]`
    ).className = "textInput-err";
    this.template.querySelector(`label[data-field="${fieldName}"]`).className =
      "input-error-label";
  }

  updateThePatientDetails() {
    let caregiverDetails = {
      accountId: this.accountId,
      firstName: this.patientFirstName,
      lastName: this.patientLastName,
      personEmail: this.patientEmail,
      personBirthdate: this.patientDOB,
      personGender: this.relations,
      preferredMethodOfContact: this.preferredCommunication,
      street: this.patientStreet,
      city: this.patientCity,
      state: this.state,
      country: this.country,
      postalCode: this.patientZipCode,
      phone: this.patientMobilePhone
    };

    UPDATE_PATIENT_DETAILS({
      wrapper: caregiverDetails
    })
      .then(() => {
        this.updatePopup = true;
        window.scrollTo({ top: 0, behavior: "smooth" });
      })
      .catch(() => {
        let globalThis = window;
        this.error = resources.PATIENT_NOT_UPDATE;
        globalThis.location.href = resources.ERROR_PAGE;
        globalThis.sessionStorage.setItem("errorMessage", this.error);
      });
  }

  updatePatientDetails() {
    let caregiverDetails = {
      accountId: this.accountId,
      firstName: this.patientFirstName,
      lastName: this.patientLastName,
      personEmail: this.patientEmail,
      personBirthdate: this.patientDOB,
      personGender: this.relations,
      preferredMethodOfContact: this.preferredCommunication,
      street: this.patientStreet,
      city: this.patientCity,
      state: this.state,
      country: this.country,
      postalCode: this.patientZipCode,
      phone: this.patientMobilePhone
    };

    UPDATE_PATIENT_DETAILS({
      wrapper: caregiverDetails
    })
      .then(() => {
        this.updatePopup = true;
        window.scrollTo({ top: 0, behavior: "smooth" });
      })
      .catch(() => {
        let globalThis = window;
        this.error = resources.PATIENT_NOT_UPDATE;
        globalThis.location.href = resources.ERROR_PAGE;
        globalThis.sessionStorage.setItem("errorMessage", this.error);
      });
  }

  // Now use this placeholderText in your template

  handleDeletPopup() {
    this.isDeletePopupOpen = !this.isDeletePopupOpen;
    document.body.style.overflow = "";
  }
  handleDeletPopupopen() {
    this.isDeletePopupOpen = !this.isDeletePopupOpen;
    document.body.style.overflow = "hidden";
  }

  handleAccessPopup() {
    this.isAccessPopupOpen = !this.isAccessPopupOpen;
    this.accesspopup = false;
    document.body.style.overflow = "";
  }
  handleAccessPopupopen() {
    this.isAccessPopupOpen = !this.isAccessPopupOpen;
    this.accesspopup = false;
    document.body.style.overflow = "hidden";
  }
  handleYesButtonClick() {
    this.isButtonDeleteDisabled = true;

    this.colorChanage = "button-bttn";
    this.DeleteMessage = true;
    this.deletepopup = true;
    this.isDeletePopupOpen = false;
    this.showDiv1 = true;
    document.body.style.overflow = "";

    // Call the Apex method to create a case

    CREATE_CASE()
      .then(() => {
        window.scrollTo({ top: 0, behavior: "smooth" });
      })
      .catch(() => {
        let globalThis = window;
        this.error = resources.CASE_NOT_CREATE;
        globalThis.location.href = resources.ERROR_PAGE;
        globalThis.sessionStorage.setItem("errorMessage", this.error);
      });

    if (this.checkbox1Value.checked) {
      this.isButtonDeleteDisabled = false;
    } else {
      this.isButtonDeleteDisabled = true;
    }
  }

  showToast(title, message, variant) {
    const toastEvent = new ShowToastEvent({
      title: title,
      message: message,
      variant: variant
    });
    if (typeof window !== "undefined") {
      this.dispatchEvent(toastEvent);
    }
  }

  handleYesButtonClickTwo() {
    this.isAccessPopupOpen = false;
    this.isAccessButtonDisabled = true;
    this.colorChnage = "button-btn";
    this.accessMessage = true;
    this.accesspopup = true;
    document.body.style.overflow = "";
    this.showDiv = true;

    // Call the Apex method to create a case

    CREATE_ACCESS_CASE()
      .then(() => {
        window.scrollTo({ top: 0, behavior: "smooth" });
      })
      .catch((error) => {
        let globalThis = window;
        this.error = error.body.message;
        globalThis.location.href = resources.ERROR_PAGE;
        globalThis.sessionStorage.setItem("errorMessage", this.error);
      });

    if (this.checkbox2Value.checked) {
      this.isAccessButtonDisabled = false;
    } else {
      this.isAccessButtonDisabled = true;
    }
  }

  handleclose() {
    this.showDiv = false;
    this.showDiv1 = false;
    this.updatePopup = false;
  }

  click() {
    this.touch = true;
    this.down = false;
    this.up = true;
  }
  notclick() {
    this.touch = false;
    this.down = true;
    this.up = false;
  }
}