// This LWC is used for prepopulating hcp caregiver information.
// To import Libraries
import { LightningElement, api, wire, track } from "lwc";
import { getObjectInfo } from "lightning/uiObjectInfoApi";
import { NavigationMixin } from "lightning/navigation";
import { loadStyle } from "lightning/platformResourceLoader";
//  To import Apex Classes
import CREATE_LEAD_RECORD from "@salesforce/apex/BI_PSPB_PatientEntityCtrl.updateLeadCareRecord";
import LEAD_ID from "@salesforce/apex/BI_PSPB_EnrollmentUtilities.retrieveLeadRecord";
import CREATE_LEAD from "@salesforce/apex/BI_PSPB_PatientEntityCtrl.updateLead";
import LEAD_CAREGIVER from "@salesforce/apex/BI_PSPB_EnrollmentUtilities.getEnrolleeCaregiverId";
import COUNTRY from "@salesforce/apex/BI_PSPB_EnrollmentUtilities.getCountries";
import STATE from "@salesforce/apex/BI_PSPB_EnrollmentUtilities.getStates";
// To import Static Resources
import { resource } from "c/biPspbEnrollmentFormResource";
//To import fields from Lead

// To import Custom Labels

export default class biPspbHcpPrepopulateCaregiverForm extends NavigationMixin(
  LightningElement
) {
  showSpinner = true;
  relationLabel = resource.RELATION_LABEL;
  relationValue = resource.RELATION_VALUE;
  caregiverInfo = resource.CAREGIVER_INFO;
  placeCountry = resource.PLACE_COUNTRY;
  placeCity = resource.PLACE_CITY;
  placeState = resource.PLACE_STATE;
  placeStreet = resource.PLACE_STREET;
  placeZip = resource.PLACE_ZIPCODE;
  placePhone = resource.PLACE_PHONE;
  placeFirst = resource.PLACE_FIRST;
  placeLast = resource.PLACE_LAST;
  placeDob = resource.PLACE_DOB;
  placeSelect = resource.PLACE_SELECT;
  placeEmail = resource.PLACE_EMAIL;
  pinCode = resource.PINCODE;
  streetcode = resource.STREET;
  cityCode = resource.CITY;
  statecode = resource.STATE;
  countryfield = resource.COUNTRY;
  patientFirstName = resource.PATIENT_FIRSTNAME;
  patientLastName = resource.PATIENT_LASTNAME;
  patientDob = resource.PATIENT_DATEOFBIRTH;
  validDob = resource.VALID_DOB;
  genderRequired = resource.PATIENT_GENDER;
  phoneRequired = resource.PATIENT_PHONE;
  pmcRequired = resource.PREFERRED_CONTACT_METHOD;
  invalidInfo = resource.INVALID_DETAILS;
  patientVerify = resource.PATIENT_VERIFICATION;
  terms = resource.TERMS;
  agree = resource.AGREE;
  agreeMsg = resource.AGREE_MSG;
  submit = resource.SUBMIT;
  progressLabel = resource.PROGRESS_LABEL;
  fieldWidth = resource.FIELD_WIDTH;
  areMandotory = resource.ARE_MANDOTORY;
  patientEnrollHead = resource.PATIENT_ENROLL;
  patientinfo = resource.PATIENT_INFO;
  firstNameLabel = resource.FIRST_NAME_LABEL;
  firstNameRequired = resource.FIRSTNAME_VALIDE;
  lastNameValid = resource.LASTNAME_VALIDE;
  lastNameLabel = resource.LASTNAME_LABEL;
  dobLabel = resource.DOB_LABEL;
  generalLabel = resource.GENDER_LABEL;
  emailLabelMand = resource.EMAIL_LABEL_STAR;
  nextLabel = resource.NEXT;
  numTwo = resource.NUM_TWO;
  numOne = resource.NUM_ONE;
  contactInfo = resource.CONTACT_INFO;
  phoneNum = resource.PHONE_NUM;
  phoneNumMandotory = resource.PHONE_NUM_MANDOTORY;
  validPhone = resource.VALID_PHONE;
  emailLabel = resource.EMAIL_LABEL;
  previousValue = resource.PREVIOS;
  numThree = resource.NUM_THREE;
  pmcLabel = resource.PMC_LABEL;
  countryLabel = resource.COUNTRY_LABEL;
  stateLabel = resource.STATE_LABEL;
  streetLabel = resource.STREET_LABEL;
  zipCodeValue = resource.ZIP_CODE_LABEL;
  validZipCode = resource.VALID_ZIP_CODE;
  cityLabel = resource.CITY_LABEL;
  validCity = resource.VALID_CITY;
  consentInfo = resource.CONSENT_INFO;
  errorPage = resource.ERROR_PAGE;
  //Proper naming conventions with camel case for all the variables will be followed in the future releases
  // Declaration of variables with @api
  @api searchResults;
  @api searchResultss;
  Phonedisable = false;
  // Declaration of variables with
  avatarContentTop = resource.CARE_AVATAR_MSG_ONE;
  avatarContentMid = resource.CARE_AVATAR_MSG_THREE;
  selectedCountryCode = "";
  fieldBox = false;
  isButtonDisabled = false;
  selectedStateCode = "";
  phoneNumberMandatory = false;
  phoneNumberVisible = true;
  countryCode = [];
  stateCode = [];
  zipCodeValid = false;
  mobileView = resource.CARE_AVATAR_MSG_SIX;
  leadFields = {};
  caregiverFields = {};
  prescriptionFields = {};
  consentFields = {};
  firstNameErrorMessage = false;
  lastNameErrorMessage = false;
  genderErrorMessage = false;
  emailErrorMessage = false;
  careFirstNameErrorMessage = false;
  careLastNameErrorMessage = false;
  careDobErrorMessage = false;
  careEmailErrorMessage = false;
  drugErrorMessage = false;
  dateErrorMessage = false;
  frequencyErrorMessage = false;
  frequencyUnitErrorMessage = false;
  authorizeErrorMessage = false;
  error;
  errors;
  errorss;
  isAddNew = false;
  threeDot = true;
  caregiverLastName = false;
  caregiverRelationship = false;
  caregiverEmail = false;
  caregiverPhoneNumber = false;
  caregiverPreferred = false;
  careRelationship;
  carePhone;
  prefereedMode;
  checkBoxName = false;
  checkbox;
  country = "";
  state = "";
  city = "";
  street = "";
  zipCode = "";
  leadId;
  showDetails = false;
  showForm = true;
  countryRequire = false;
  stateRequire = false;
  cityRequire = false;
  streetRequire = false;
  zipCodeRequire = false;

  clabelErrors = "input-label";

  slabelErrors = "input-label";
  cilabelError = false;
  cilabelErrors = "input-label";
  stlabelError = false;
  stlabelErrors = "input-label";
  zlabelError = false;
  zlabelerrors = "input-label";
  currentStep;
  normalHeading = true;
  normalHeadingOne = false;
  firstNameValid = false;
  lastNameChangeValid = false;
  dateOfBirthVaild = false;
  phoneNumber = "";
  pmocValue = "";
  genderRequire = false;
  genderValue = "";
  openModal = false;
  @track leadGender = [
    { label: resource.MALE, value: resource.MALE },
    { label: resource.FEMALE, value: resource.FEMALE },
    { label: resource.OTHER, value: resource.OTHER },
    { label: resource.PREFER, value: resource.PREFER }
  ];
  @track rswp = [
    { label: resource.PARENT, value: resource.PARENT },
    { label: resource.SIBILING, value: resource.SIBILING },
    { label: resource.LOVEDONE, value: resource.LOVEDONE },
    { label: resource.GUARDIAN, value: resource.GUARDIAN },
    { label: resource.FRIEND, value: resource.FRIEND },
    { label: resource.RELATIVE, value: resource.RELATIVE }
  ];
  @track leadPmc = [
    { label: resource.SMS, value: resource.SMS },
    { label: resource.PHONE, value: resource.PHONE },
    { label: resource.EMAIL, value: resource.EMAIL }
  ];
  leadFirstName;
  leadLastName;
  leadDob;
  selectedValue;
  leadEmail;
  lastName = "";
  firstName = "";
  dob = "";
  rwp = "";
  firstNameRequire = false;
  lastNameChangeRequire = false;
  dateOfBirthRequire = false;
  rwpRequire = false;
  phoneRequire = false;
  pmocRequire = false;
  leadCareId;
  leadCareFirstName;
  leadCareLastName;
  leadCareDob;
  leadCareEmail;
  leadCarePhone;
  // Declaration of Global variables
  selectedGender = "";
  warningIcons = resource.WARNING_ICON;
  selectedAvatarSrc = resource.OLD_GUY_JPEG_URL;
  BEYOND_GPP_LOGO = resource.BGPP;
  picklistOrdered = [];
  picklistOrderedOne = [];
  selectedSearchResult;
  selectedSearchResultOne;
  selectedCountry;

  // Importing wire adapters to retrieve object information and picklist values
  connectedCallback() {
    loadStyle(this, resource.TEXT_ALIGN);
  }
  @wire(getObjectInfo, { objectApiName: "Lead" })
  objectInfo;

  // Wire adapter to retrieve picklist values for the State field, based on selected country
  @wire(COUNTRY)
  wiredCountries({ error, data }) {
    let globalThis = window;
    try {
      if (data) {
        this.showSpinner = false;
        this.countryCode = data.map((country) => ({
          label: country.label,
          value: country.value
        }));
      } else if (error) {
        globalThis.sessionStorage.setItem("errorMessage", error.message);
        globalThis.location?.assign(
          this.baseUrl + resource.BRANDED_URL + this.errorPage
        );
      }
    } catch (err) {
      // Log the error and navigate to the error page
      globalThis.sessionStorage.setItem("errorMessage", err.message);
      globalThis.location?.assign(
        this.baseUrl + resource.BRANDED_URL + this.errorPage
      );
    }
  }

  // Function to handle input changes related to caregiver information
  handleInputChangecaregiver(event) {
    this.careRelationship = event.target.value;
    this.carePhone = event.target.value;
    this.prefereedMode = event.target.value;
    this.caregiverRelationship = false;
    this.caregiverPreferred = false;
    this.caregiverPhoneNumber = false;
  }

  handleInputChange3(event) {
    this.checkBox = event.target.checked;
    const checkBox = this.template.querySelector('span[data-field="checkbox"]');
    if (this.checkBox === "") {
      this.checkBoxName = true;
      checkBox.className = "custom-checkbox-box_Error";
    } else {
      this.checkBoxName = false;
      checkBox.className = "custom-checkbox-box";
    }
  }
  CountryFieldErr() {
    const COUNTRY_FIELD_ERROR = this.template.querySelector(
      'lightning-combobox[data-field="Country"]'
    );
    COUNTRY_FIELD_ERROR.className = "textInput-err";
    this.clabelErrors = "input-error-label";
  }
  CountryField() {
    const COUNTRY_FIELD_ERROR = this.template.querySelector(
      'lightning-combobox[data-field="Country"]'
    );
    COUNTRY_FIELD_ERROR.className = "textInput";
    this.clabelErrors = "input-label";
  }
  //to validate country
  handleCountryChange(event) {
    let globalThis = window;
    this.country = event.target.value;

    STATE({ selectedCountry: this.country })
      .then((result) => {
        this.stateCode = result.map((state) => ({
          label: state.Name,
          value: state.BI_PSPB_StateCode__c
        }));
      })
      .catch((error) => {
        globalThis.sessionStorage.setItem("errorMessage", error.body.message);
        globalThis.location?.assign(
          this.baseUrl + resource.BRANDED_URL + this.errorPage
        );
      });
    // Get the selected country value
    this.country = event.target.value;

    // Check if the country is empty
    if (this.country === "") {
      this.countryRequire = true;
      this.CountryFieldErr();
    } else {
      this.countryRequire = false;
      this.CountryField();
    }
  }
  StateFieldErr() {
    const STATE_FIELD_ERROR = this.template.querySelector(
      'lightning-combobox[data-field="State"]'
    );
    STATE_FIELD_ERROR.className = "textInput-err";
    this.slabelErrors = "input-error-label";
  }
  StateField() {
    const STATE_FIELD_ERROR = this.template.querySelector(
      'lightning-combobox[data-field="State"]'
    );
    STATE_FIELD_ERROR.className = "textInput";
    this.slabelErrors = "input-label";
  }
  //to validate state
  handleStateChange(event) {
    // Get the selected state value
    this.state = event.target.value;

    // Check if the state is empty
    if (this.state === "") {
      this.stateRequire = true;
      this.StateFieldErr();
    } else {
      this.stateRequire = false;
      this.StateField();
    }
  }
  CityFieldErr() {
    const cityField = this.template.querySelector(
      'lightning-input[data-field="City"]'
    );
    cityField.className = "textInput-err"; //css classes for UI
    this.template.querySelector('div[data-field="City"]').className =
      "input-error-label";
  }
  CityField() {
    const cityField = this.template.querySelector(
      'lightning-input[data-field="City"]'
    );
    cityField.className = "textInput"; //css classes for UI
    this.template.querySelector('div[data-field="City"]').className =
      "input-label";
  }
  NamesRegex() {
    return  /^[a-zA-ZÀ-ž\s\-'.`]+$/u;
  }
  //to validate city
  handleCityChange(event) {
    // Get the entered city value
    this.city = event.target.value;
    this.city =
      event.target.value.trim().charAt(0).toUpperCase() +
      event.target.value.trim().slice(1);
    //to get data field value from html

    // Check if the city is empty
    if (this.city === "") {
      this.cityValid = false;
      this.cityRequire = true;
      this.CityFieldErr();
    }
    // Check if city contains only alphabets
    else if (!this.NamesRegex().test(this.city)) {
      this.cityRequire = false;
      this.cityValid = true;
      this.CityFieldErr();
    } else {
      this.cityRequire = false;
      this.cityValid = false;
      this.CityField();
    }
  }

  StreetFieldErr() {
    const STREET_FIELD = this.template.querySelector(
      'lightning-textarea[data-field="Street"]'
    );
    STREET_FIELD.className = "textInput-err";
    this.stlabelErrors = "input-error-label";
  }
  StreetField() {
    const STREET_FIELD = this.template.querySelector(
      'lightning-textarea[data-field="Street"]'
    );
    STREET_FIELD.className = "textInput";
    this.stlabelErrors = "input-label";
  }
  //to validate street
  handleStreetChange(event) {
    // Get the entered street value
    this.street = event.target.value;
    this.street =
      event.target.value.trim().charAt(0).toUpperCase() +
      event.target.value.trim().slice(1);

    // Check if the street is empty
    if (this.street === "") {
      this.streetRequire = true;
      this.StreetFieldErr();
      this.stlabelError = true;
    } else {
      this.streetRequire = false;
      this.StreetField();
      this.stlabelError = false;
    }
  }
  ZipCodeFieldErr() {
    const ZIP_CODE = this.template.querySelector(
      'lightning-input[data-field="ZipCode"]'
    );
    ZIP_CODE.className = "textInput-err";
    this.template.querySelector('div[data-field="ZipCode"]').className =
      "input-error-label";
  }
  ZipCodeField() {
    const ZIP_CODE = this.template.querySelector(
      'lightning-input[data-field="ZipCode"]'
    );
    ZIP_CODE.className = "textInput";
    this.template.querySelector('div[data-field="ZipCode"]').className =
      "input-label";
  }
  ZipCodeRegex() {
    return /^[a-zA-Z0-9]+$/u;
  }
  //to validate zipcode
  handleZipCodeChange(event) {
    // Get the entered zip code value
    this.zipCode = event.target.value;
    this.zipCode =
      event.target.value.trim().charAt(0).toUpperCase() +
      event.target.value.trim().slice(1);

    // Check if the zip code is not numeric
    if (!this.ZipCodeRegex().test(this.zipCode)) {
      this.zipCodeRequire = false;
      this.zipCodeValid = true;
      this.ZipCodeFieldErr();
    }
    // Check if the zip code is empty
    else if (this.zipCode === "") {
      this.zipCodeRequire = true;
      this.zipCodeValid = false;
      this.ZipCodeFieldErr();
    } else {
      // Reset flags and update classes
      this.zipCodeRequire = false;
      this.zipCodeValid = false;
      this.ZipCodeField();
    }
  }

  // Central validation method
  Contactvalidform() {
    let isValid = true;

    // Call individual validation methods
    isValid &= this.validateCountry();
    isValid &= this.validateState();
    isValid &= this.validateCity();
    isValid &= this.validateStreet();
    isValid &= this.validateZipCode();
    isValid &= this.validateCheckbox();

    // Additional content setup
    this.AvatarContentOne();
    this.Xmark();

    return !!isValid; // Convert bitwise result to boolean
  }

  // Individual validation methods

  validateCountry() {
    if (this.country === "") {
      this.countryRequire = true;
      this.CountryFieldErr();

      return false;
    }

    this.countryRequire = false;
    this.CountryField();

    return true;
  }

  validateState() {
    if (this.state === "") {
      this.stateRequire = true;
      this.StateFieldErr();

      return false;
    }
    this.stateRequire = false;
    this.StateField();

    return true;
  }

  validateCity() {
    if (this.city === "") {
      this.cityRequire = true;
      this.cityValid = false;
      this.CityFieldErr();
      this.cilabelError = true;
      return false;
    } else if (!this.NamesRegex().test(this.city)) {
      this.cityRequire = false;
      this.cityValid = true;
      this.CityFieldErr();
      return false;
    }
    this.cityRequire = false;
    this.cityValid = false;
    this.CityField();
    this.cilabelError = false;
    return true;
  }

  validateStreet() {
    if (this.street === "") {
      this.streetRequire = true;
      this.StreetFieldErr();
      this.stlabelError = true;
      return false;
    }
    this.streetRequire = false;
    this.StreetField();
    this.stlabelError = false;
    return true;
  }

  validateZipCode() {
    if (this.zipCode === "") {
      this.zipCodeRequire = true;
      this.zipCodeValid = false;
      this.ZipCodeFieldErr();
      this.zlabelError = true;
      return false;
    } else if (!this.ZipCodeRegex().test(this.zipCode)) {
      this.zipCodeRequire = false;
      this.zipCodeValid = true;
      this.ZipCodeFieldErr();
      return false;
    }

    this.zipCodeRequire = false;
    this.zipCodeValid = false;
    this.ZipCodeField();
    this.zlabelError = false;
    return true;
  }

  validateCheckbox() {
    const checkBox = this.template.querySelector('span[data-field="checkbox"]');
    if (!this.checkBox) {
      this.checkBoxName = true;
      checkBox.className = "custom-checkbox-box_Error";
      return false;
    }
    this.checkBoxName = false;
    checkBox.className = "custom-checkbox-box";
    return true;
  }

  //to update lead record
  handleCreateLead() {
    let globalThis = window;
    if (!this.Contactvalidform()) {
      return;
    }

    let leadWrapper = {
      leadId: this.leadId,
      country: this.country,
      gender: this.selectedValue,
      state: this.state,
      city: this.city,
      street: this.street,
      zipCode: this.zipCode
    };
    //try {

    this.isButtonDisabled = true;
    this.showSpinner = true;

    CREATE_LEAD_RECORD({ leadWrapper: leadWrapper })
      .then(() => {
        CREATE_LEAD({
          leadId: this.leadId,
          preferredMethodofCommunication: this.pmocValue,
          relation:this.rwp,
          phone:this.phoneNumber

        })
          .then(() => {
            globalThis?.localStorage.setItem("recordId", this.leadId);
             try {
          globalThis.location.assign(resource.THANK_FORM_URL);
        } catch (error) {
          globalThis.sessionStorage.setItem("errorMessage", error.body.message);
          globalThis.location?.assign(
            this.baseUrl + resource.BRANDED_URL + this.errorPage
          );
        }
          })
          .catch((error) => {
            globalThis.sessionStorage.setItem(
              "errorMessage",
              error.body.message
            );
            globalThis.location?.assign(
              this.baseUrl + resource.BRANDED_URL + this.errorPage
            );
          });

       
      })

      .catch((error) => {
        globalThis.sessionStorage.setItem("errorMessage", error.body.message);
        globalThis.location?.assign(
          this.baseUrl + resource.BRANDED_URL + this.errorPage
        );
      });
    // }
    // catch (err) {
    // 	this.HandleToast(err.message); // Catching Potential Error from LWC
    // }
    this.avatarContentTop = resource.CARE_AVATAR_MSG_ONE;
    this.avatarContentMid = resource.CARE_AVATAR_MSG_THREE;
    this.Xmark();
  }

  //to go to previous page - 1
  goBackToStepOne() {
    this.currentStep = resource.ONE;
    this.template.querySelector("div.stepTwo").classList.add("slds-hide");
    this.template.querySelector("div.stepOne").classList.remove("slds-hide");
    this.template.querySelector("div.slds-progress").classList.add("slds-hide");
    this.avatarContentTop = resource.CARE_AVATAR_MSG_ONE;
    this.avatarContentMid = resource.CARE_AVATAR_MSG_THREE;
    this.Xmark();
  }

  //to go to previous page - 2
  goBackToStepTwo() {
    this.currentStep = resource.TWO;

    this.template.querySelector("div.stepThree").classList.add("slds-hide");
    this.template.querySelector("div.stepTwo").classList.remove("slds-hide");
    // Progress indicator
    this.template.querySelector("li.li-two").classList.remove("slds-is-active");
    this.template
      .querySelector("li.li-one")
      .classList.remove("slds-is-completed");
    this.template.querySelector("li.li-one").classList.add("slds-is-active");
    this.avatarContentTop = resource.CARE_AVATAR_MSG_ONE;
    this.avatarContentMid = resource.CARE_AVATAR_MSG_THREE;
    this.Xmark();
  }
  //to go to previous page - 3
  goBackToStepThree() {
    this.currentStep = resource.THREE;
    this.template.querySelector("div.stepFour").classList.add("slds-hide");
    this.template.querySelector("div.stepThree").classList.remove("slds-hide");
    // Progress indicator
    this.template
      .querySelector("li.li-three")
      .classList.remove("slds-is-active");
    this.template
      .querySelector("li.li-two")
      .classList.remove("slds-is-completed");
    this.template.querySelector("li.li-two").classList.add("slds-is-active");
    this.avatarContentTop = resource.CARE_AVATAR_MSG_ONE;
    this.avatarContentMid = resource.CARE_AVATAR_MSG_THREE;
    this.Xmark();
  }
 

  //to go to next page by validating fields
  goToStepTwo() {
   
    const FIRST_NAME_FIELD = this.template.querySelector(
      'lightning-input[data-field="FN"]'
    );
    const LAST_NAME_FIELD = this.template.querySelector(
      'lightning-input[data-field="LN"]'
    );
    const DOB_FIELD = this.template.querySelector(
      'lightning-input[data-field="dob"]'
    );

    if (this.firstName !== "" && this.lastName !== "" && this.dob !== "") {
      LEAD_ID({
        firstName: this.firstName,
        lastName: this.lastName,
        dateOfBirth: this.dob
      })
        .then((result) => {
          this.leadId = result.Id;
          this.leadFirstName = result.FirstName;
          this.leadLastName = result.LastName;
          this.leadDob = result.HealthCloudGA__BirthDate__c;
          this.selectedValue = result.HealthCloudGA__Gender__c;
          this.leadEmail = result.Email;
          this.leadCaregiverecordget(result.Id);

          if (this.leadId !== "") {
            this.currentStep = resource.TWO;
            this.template
              .querySelector("div.stepOne")
              .classList.add("slds-hide");
            this.template
              .querySelector("div.stepTwo")
              .classList.remove("slds-hide");
            // Progress indicator
            this.template
              .querySelector("div.slds-progress")
              .classList.remove("slds-hide");
          }
          this.avatarContentTop = resource.CARE_AVATAR_MSG_ONE;
          this.avatarContentMid = resource.CARE_AVATAR_MSG_THREE;
          this.Xmark();
        })
        .catch(() => {
          //handle error message in UI
          // this.showToast(ERROR_MESSAGE, error.message, ERROR_VARIANT); // Catching Potential Error from Apex
          this.normalHeading = false;
          this.normalHeadingOne = true;
          this.firstNameValid = true;
          this.firstNameRequire = false;
          FIRST_NAME_FIELD.value = "";
          this.FirstNameFieldErr();
          this.firstname = "";

          this.lastNameChangeValid = true;
          LAST_NAME_FIELD.value = "";
          this.LastNameFieldErr();
          this.lastName = "";

          this.dateOfBirthVaild = true;
          DOB_FIELD.value = "";
          this.DateFieldErr();
          this.leadFields.dob = "";
          this.avatarContentTop = resource.CARE_AVATAR_MSG_ONE;
          this.avatarContentMid = resource.CARE_AVATAR_MSG_THREE;
          this.Xmark();
        });
    } else {
      this.validateFirstName();
      this.validateLastName();
      this.validateDOB();
      this.avatarContentTop = resource.CARE_AVATAR_MSG_TWO;
      this.avatarContentMid = resource.CARE_AVATAR_MSG_FOUR;
      this.Xmark();
    }
  }
  FirstNameFieldErr() {
    const FIRST_NAME_FIELD = this.template.querySelector(
      'lightning-input[data-field="FN"]'
    );
    FIRST_NAME_FIELD.className = "textInput-err";
    this.template.querySelector('div[data-field="FN"]').className =
      "input-error-label";
  }
  FirstNameField() {
    const FIRST_NAME_FIELD = this.template.querySelector(
      'lightning-input[data-field="FN"]'
    );
    FIRST_NAME_FIELD.className = "textInput";
    this.template.querySelector('div[data-field="FN"]').className =
      "input-label";
  }
  validateFirstName() {
    if (!this.FIRST_NAME_FIELD) {
      this.firstNameRequire = true;
      this.firstNameValid = false;
      this.FirstNameFieldErr();
      this.normalHeadingOne = true;
      this.normalHeading = false;
    } else {
      this.firstNameRequire = false;
      this.firstNameValid = false;
      this.FirstNameField();
      this.normalHeadingOne = false;
      this.normalHeading = true;
    }
  }
  LastNameFieldErr() {
    const LAST_NAME_FIELD = this.template.querySelector(
      'lightning-input[data-field="LN"]'
    );
    LAST_NAME_FIELD.className = "textInput-err";
    this.template.querySelector('div[data-field="LN"]').className =
      "input-error-label";
  }
  LastNameField() {
    const LAST_NAME_FIELD = this.template.querySelector(
      'lightning-input[data-field="LN"]'
    );
    LAST_NAME_FIELD.className = "textInput";
    this.template.querySelector('div[data-field="LN"]').className =
      "input-label";
  }
  validateLastName() {
    if (this.lastName === "") {
      this.lastNameChangeRequire = true;
      this.lastNameChangeValid = false;
      this.LastNameFieldErr();
      this.normalHeadingOne = true;
      this.normalHeading = false;
    } else {
      this.lastNameChangeRequire = false;
      this.lastNameChangeValid = false;
      this.LastNameField();
      this.normalHeadingOne = false;
      this.normalHeading = true;
    }
  }
  DateFieldErr() {
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
    if (!this.DOB_FIELD) {
      this.dateOfBirthRequire = true;
      this.dateOfBirthVaild = false;
      this.DateFieldErr();
      this.normalHeadingOne = true;
      this.normalHeading = false;
    } else {
      this.dateOfBirthRequire = false;
      this.dateOfBirthVaild = false;
      this.DateField();
      this.normalHeadingOne = false;
      this.normalHeading = true;
    }
  }
  //to store relationship with patient field
  handlerwcChange(event) {
    this.rwp = event.target.value;
    this.rwpRequire = false;
  }
  PhoneFieldErr() {
    const phoneField = this.template.querySelector(
      'lightning-input[data-field="phone"]'
    );
    phoneField.className = "textInput-err";
    this.template.querySelector('div[data-field="phone"]').className =
      "input-error-label";
  }
  PhoneField() {
    const phoneField = this.template.querySelector(
      'lightning-input[data-field="phone"]'
    );
    phoneField.className = "textInput";
    this.template.querySelector('div[data-field="phone"]').className =
      "input-label";
  }
  handlePhoneChangeEmpty(event) {
    this.phoneNumber = event.target.value;

    if (this.phoneNumber === "") {
      this.phoneRequire = false;
      this.Phonedisable = false;
      this.PhoneField();
    }
  }
  //to store value in PHONE field
  handlephoneChange(event) {
    this.phoneNumber = event.target.value;

    if (this.phoneNumber === "") {
      this.phoneRequire = true;
      this.Phonedisable = false;
      this.PhoneFieldErr();
    } else {
      this.Phonedisable = false;
      this.phoneRequire = false; // Reset error flag
      this.PhoneField();
    }
  }
  PmcFieldErr() {
    const PMOC_FIELD = this.template.querySelector(
      'lightning-combobox[data-field="pmoc"]'
    );
    PMOC_FIELD.className = "textInput-err";
    this.template.querySelector('div[data-field="pmoc"]').className =
      "input-error-label";
  }
  PmcField() {
    const PMOC_FIELD = this.template.querySelector(
      'lightning-combobox[data-field="pmoc"]'
    );
    PMOC_FIELD.className = "textInput";
    this.template.querySelector('div[data-field="pmoc"]').className =
      "input-label";
  }
  //to store preferred method of communication field
  handlepmocChange(event) {
    this.pmocValue = event.target.value;

    if (this.pmocValue === resource.SMS || this.pmocValue === resource.PHONE) {
      this.phoneNumberMandatory = true;
      this.phoneNumberVisible = false;
      this.pmocRequire = false;
      this.PmcField();
    } else if (this.pmocValue === "") {
      this.pmocRequire = true;
      this.PmcFieldErr();
    } else {
      this.phoneNumberMandatory = false;
      this.phoneNumberVisible = true;
      this.phoneRequire = false;
      this.PmcField();
    }
  }
  MoveToNext() {
    this.currentStep = resource.THREE;
    this.template.querySelector("div.stepTwo").classList.add("slds-hide");
    this.template.querySelector("div.stepThree").classList.remove("slds-hide");
    // Progress indicator
    this.template.querySelector("li.li-one").classList.remove("slds-is-active");
    this.template.querySelector("li.li-one").classList.add("slds-is-completed");
    this.template.querySelector("li.li-two").classList.add("slds-is-active");
    this.AvatarContent();
    this.Xmark();
  }
  //to go to next page by validating fields
  goToStepThree() {
    this.Xmark();
    // Reset error flags
    this.rwpRequire = false;
    this.pmocRequire = false;
    this.phoneRequire = false;

    if (this.rwp && this.phoneNumber && this.pmocValue) {
      this.MoveToNext();
    } else if (
      !this.phoneField &&
      this.pmocValue !== resource.SMS &&
      this.pmocValue !== resource.PHONE &&
      this.pmocValue
    ) {
      this.MoveToNext();
    } else {
      this.validatePMOC();
      this.validateRWP();
      this.validatePhoneNumber();
      this.AvatarContentOne();
      this.Xmark();
    }
  }
  AvatarContent() {
    this.avatarContentTop = resource.CARE_AVATAR_MSG_ONE;
    this.avatarContentMid = resource.CARE_AVATAR_MSG_THREE;
  }
  AvatarContentOne() {
    this.avatarContentTop = resource.CARE_AVATAR_MSG_TWO;
    this.avatarContentMid = resource.CARE_AVATAR_MSG_FOUR;
  }

  validatePMOC() {
    if (!this.pmocValue) {
      this.pmocRequire = true;
      this.PmcFieldErr();
    } else {
      this.pmocRequire = false; // Reset error flag
      this.PmcField();
    }
  }

  validateRWP() {
    const RWP_FIELD = this.template.querySelector(
      'lightning-combobox[data-field="rwp"]'
    );
    if (!this.rwp) {
      this.rwpRequire = true;
      RWP_FIELD.className = "textInput-err";
      this.template.querySelector('div[data-field="rwp"]').className =
        "input-error-label";
    } else {
      this.rwpRequire = false; // Reset error flag
      RWP_FIELD.className = "textInput"; // Remove error class
      this.template.querySelector('div[data-field="rwp"]').className =
        "input-label";
    }
  }

  validatePhoneNumber() {
    if (this.phoneNumberMandatory) {
      if (!this.phoneNumber) {
        this.phoneRequire = true;
        this.Phonedisable = false;
        this.PhoneFieldErr();
      } else {
        this.phoneRequire = false; // Reset error flag
        this.PhoneField();
      }
    }
  }
  //to store value in gender field
  handleGenderChange(event) {
    this.genderValue = event.target.value;
    this.genderRequire = false;
  }

  //to go to next page by validating fields
  goToStepFour() {
    const LAST_NAME_FIELD = this.template.querySelector(
      'lightning-combobox[data-field="GN"]'
    );
    this.Xmark();
    
    if (this.selectedValue !== "") {
        this.currentStep = resource.FOUR;
        this.template.querySelector("div.stepThree").classList.add("slds-hide");
        this.template.querySelector("div.stepFour").classList.remove("slds-hide");
        // Progress indicator
        this.template
            .querySelector("li.li-two")
            .classList.remove("slds-is-active");
        this.template
            .querySelector("li.li-two")
            .classList.add("slds-is-completed");
        this.template
            .querySelector("li.li-three")
            .classList.add("slds-is-active");
    } else {
        // Handle empty selectedValue case
        this.handleEmptySelectedValue(LAST_NAME_FIELD);
    }
}

handleEmptySelectedValue(LAST_NAME_FIELD) {
    if (this.genderValue === "") {
        this.genderRequire = true;
        LAST_NAME_FIELD.className = "textInput-err";
        this.template.querySelector('div[data-field="GN"]').className =
          "input-error-label";
    }
}

  //to validate terms and condition checkbox
  authorize() {
    let isValid = true;

    // authorize
    if (!this.consentFields.authorize) {
      this.authorizeErrorMessage = true;
      isValid = false;
    } else {
      this.authorizeErrorMessage = false;
    }
    return isValid;
  }

 

  //to display terms and condition popup
  showModal() {
    this.openModal = true;
  }
  //to close terms and condition popup
  closeModal() {
    this.openModal = false;
  }

  //to validate firstname field
  handleFirstNameChange(event) {
    this.firstName = event.target.value;
    this.firstName =
      event.target.value.trim().charAt(0).toUpperCase() +
      event.target.value.trim().slice(1);

    if (!this.NamesRegex().test(this.firstName)) {
      this.firstNameValid = true;
      this.firstNameRequire = false;
      this.FirstNameFieldErr();
    } else {
      this.firstNameValid = false;
      this.firstNameRequire = false;
      this.FirstNameField();
    }
  }

  //to validate lastname field
  handleLastNameChange(event) {
    this.lastName = event.target.value;
    this.lastName =
      event.target.value.trim().charAt(0).toUpperCase() +
      event.target.value.trim().slice(1);

    if (!this.NamesRegex().test(this.lastName)) {
      this.lastNameChangeValid = true;
      this.lastNameChangeRequire = false;
      this.LastNameFieldErr();
    } else {
      this.lastNameChangeValid = false;
      this.lastNameChangeRequire = false;
      this.LastNameField();
    }
  }

  //to validate dob field
  handleDobChange(event) {
     console.log(this.dob)
    this.dob = event.target.value;
    if (this.dob === "") {
      this.dateOfBirthRequire = true;
      this.dateOfBirthVaild = false;
      this.DateFieldErr();
    } else {
      this.normalHeadingOne = false;
      this.dateOfBirthRequire = false;
      this.dateOfBirthVaild = false;
      this.DateField();
    }
  }

  //to get lead caregiver from LEAD_ID
  leadCaregiverecordget(resuldId) {
    //	try {
    LEAD_CAREGIVER({ leadId: resuldId })
      .then((result) => {
        this.leadCareFirstName = result.BI_PSPB_First_Name__c;
        this.leadCareLastName = result.BI_PSPB_Last_Name__c;
        this.leadCareDob = result.BI_PSPB_Date_of_Birth__c;
        this.leadCareEmail = result.BI_PSPB_E_mail_ID__c;
        this.phoneNumber = result.BI_PSPB_Phone_number__c;
        this.rwp = result.BI_PSPB_Relationship_to_Patient__c;
        this.pmocValue = result.BI_PSPB_Preferred_Communication_Method__c;

        if (this.phoneNumber) {
          this.Phonedisable = true;
        } else {
          this.Phonedisable = false;
        }
        if (
          this.pmocValue === resource.SMS ||
          this.pmocValue === resource.PHONE
        ) {
          this.phoneNumberMandatory = true;
          this.phoneNumberVisible = false;
        } else {
          this.phoneNumberMandatory = false;
          this.phoneNumberVisible = true;
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
  //to validate PHONE
  handleKeyDown(event) {
    const CHAR_CODE = event.which ? event.which : event.keyCode; // Get the ASCII code of the pressed key
    if (CHAR_CODE !== 43 && (CHAR_CODE < 48 || CHAR_CODE > 57)) {
      // Allow only digits (48-57) and the plus symbol (43)
      event.preventDefault(); // Prevent the character from being entered
    }
  }
  HandleToast(error) {
    this.showToast(
      resource.ERROR_MESSAGE,
      error.message,
      resource.ERROR_VARIANT
    );
  }
  //to get avatar content
  click() {
    this.threeDot = false;
    this.fieldBox = true;
    this.mobileView = resource.CARE_AVATAR_MSG_SEVEN;
  }
  //to get avatar content in mobile view
  Xmark() {
    this.mobileView = resource.CARE_AVATAR_MSG_SIX;
    this.threeDot = true;
    this.fieldBox = false;
  }
  handleKeyPressTrems(event){
    if (event.key === 'Enter' || event.key === ' ') {
      event.preventDefault();
      this.showModal();
  }
  }
}