// This lightning web component is used to Create CommunityUsername for Patient Community before Navigate to any Community Page
// To import Libraries
import { LightningElement } from "lwc";
import { ShowToastEvent } from "lightning/platformShowToastEvent";
//  To import Apex Classes
import INSERT_COMMUNITY_USERNAME from "@salesforce/apex/BI_PSPB_FeedUsernameCtrl.insertCommunityUsername";
import LOGIN_COMMUNITY_USERNAME from "@salesforce/apex/BI_PSPB_FeedUsernameCtrl.getCommunityUsername";
import USER_AVATAR from "@salesforce/apex/BI_PSP_CurrentUser.getEnrolleeRecords";
// To import Custom labels and static resources
import * as label from "c/biPspbLabelAndResourceCommunity";

export default class BiPspbChatterUsername extends LightningElement {
  // Declaration of variables with @track
  userInputBox = "userInputBox";
  loggedUserAvatar;
  communityUsername;
  showError = false;
  showErrorForNull = false;
  normal = true;
  showSpinner;
  errorImg = label.WARNING_ICON;
  userId = label.ID;
  avatarContent = label.AVATAR_CONTENT;
  myProfile = label.MY_PROFILE;
  profileName = label.PROFILE_NAME;
  nameRequired = label.NAME_REQUIRED;
  nameValidation = label.NAME_VALIDATION;
  saveChanges = label.SAVE_CHANGES;
  alternateTextForAvatar = label.ALTERNATE_AVATAR;
  alternateTextForWarningIcon = label.ALTERNATE_WARNING_ICON;
  // //ConnectedCallback used to get the PATH and  find the site is Branded or Unassigned
  connectedCallback() {
    try {
      this.avatarFunction();
      this.detectBrandedOrUnassigned();
    } catch (error) {
      this.handleError(error.body.message); // Catching Potential Error for try-catch
    }
  }
  //Find the site is Branded or Unassigned and do the navigation accordingly
  avatarFunction() {
    this.showSpinner = true;
    USER_AVATAR()
      .then((result) => {
        if (result.length > 0 && result[0].BI_PSP_AvatarUrl__c) {
          this.loggedUserAvatar = result[0].BI_PSP_AvatarUrl__c;
          this.showSpinner = false;
        }
      })
      .catch((error) => {
        this.showSpinner = false;
        this.handleError(error.body.message); // then-catch error
      });
  }
  //create Community username and Validate  if Username is null,Username equal to firstName,lastName,email and phone of Account.
  handleCommunityUsername(event) {
    this.communityUsername = event.target.value;
    this.showError = false;
    this.showErrorForNull = false;
    this.normal = true;
  }
  // To save Community Username
  handleSave() {
    this.userInputBox = "userInputBox";
    if (!this.communityUsername) {
      //If Username is null and the save button is clicked show errors
      this.showErrorForNull = true;
      this.showError = false;
      this.normal = false;
      this.userInputBox = "userInputBoxError";
      return;
    }
    this.showSpinner = true;
    LOGIN_COMMUNITY_USERNAME()
      .then((result) => {
        if (result && result.length > 0) {
          this.userInputBox = "userInputBox";
          //Validate the Entered Name and Raise error if condition not met
          if (this.isUsernameInvalid(result[0])) {
            this.handleValidationError();
          }
          //if all Validations are cleared then Create the Username  and Navigate to all post Page
          else {
            this.handleValidUsername();
          }
        } else {
          this.userInputBox = "userInputBox";
          this.showSpinner = false;
          this.handleError(label.ACCOUNT_NOT_FOUND); // Catching Potential Error for then-catch
        }
      })
      .catch((error) => {
        this.userInputBox = "userInputBox";
        this.showSpinner = false;
        this.handleError(error.body.message); // Catching Potential Error for then-catch
      });
  }

  isUsernameInvalid(result) {
    const enteredName = (str) => str.toLowerCase().replace(/[^a-z0-9]/gu, "");
    // Get the community username and normalize it
    const CommunityUsername = this.communityUsername.toLowerCase();
    const enteredUsername = enteredName(CommunityUsername);
    // Get the account email from result and normalize it
    const enteredEmail = result.PersonEmail
      ? enteredName(result.PersonEmail)
      : "";
    // Check if the normalized username includes the normalized email
    if (enteredEmail && enteredUsername.includes(enteredEmail)) {
      return true; // Email is a partial or exact match
    }
    // Normalize strings and handle numeric extraction
    const normalize = (str) => str.toLowerCase().replace(/[^a-z]/gu, "");
    const normalizePhone = (str) => str.replace(/\D/gu, "");
    const extractNumbers = (str) => str.replace(/\D/gu, "");

    // Function to check if a normalized username is a partial match of any of the fields
    const isPartialMatch = (field, value) => value.includes(field);
    const username = this.communityUsername.toLowerCase();
    const normalizedUsername = normalize(username);
    const normalizedFirstName = result.FirstName
      ? normalize(result.FirstName)
      : "";
    const normalizedLastName = result.LastName
      ? normalize(result.LastName)
      : "";
    const normalizedPhone = result.Phone ? normalizePhone(result.Phone) : "";

    const usernameNumbers = extractNumbers(username);
    const phoneWithoutCountryCode =
      normalizedPhone.length > 2
        ? normalizedPhone.substring(2)
        : normalizedPhone;
    const isPhoneIncluded =
      phoneWithoutCountryCode &&
      isPartialMatch(phoneWithoutCountryCode, usernameNumbers);
    const isFirstNameMatch =
      normalizedFirstName &&
      isPartialMatch(normalizedFirstName, normalizedUsername);
    const isLastNameMatch =
      normalizedLastName &&
      isPartialMatch(normalizedLastName, normalizedUsername);

    // Check for invalid conditions
    const invalid =
      result && (isFirstNameMatch || isLastNameMatch || isPhoneIncluded);
    return invalid;
  }

  handleValidationError() {
    this.userInputBox = "userInputBoxError";
    this.showError = true;
    this.showErrorForNull = false;
    this.normal = false;
    this.showSpinner = false;
  }
  handleValidUsername() {
    this.userInputBox = "userInputBox";
    this.normal = true;
    this.showErrorForNull = false;
    this.showError = false;
    this.showSpinner = true;
    this.createUsernameAndNavigate();
  }
  createUsernameAndNavigate() {
    INSERT_COMMUNITY_USERNAME({ username: this.communityUsername })
      .then(() => {
        const globalThis = window;
        globalThis.location.assign(
          label.SLASH + this.urlName + label.ALL_POST_URL
        );
      })
      .catch((error) => {
        this.showSpinner = false;
        this.handleError(error.body.message); // Catching Potential Error for then-catch
      });
  }
  // Handle errors and display a toast message
  handleError(error) {
    let globalThis = window;
    globalThis.location.href = label.ERROR_PAGE;
    globalThis.sessionStorage.setItem("errorMessage", error);
  }
  // To check the site is branded or unassigned
  detectBrandedOrUnassigned() {
    try {
      const globalThis = window;
      const CURRENT_URL = globalThis.location.href;
      const URL_OBJECT = new URL(CURRENT_URL);
      const PATH = URL_OBJECT.pathname;
      const PATH_COMPONENTS = PATH.split(label.SLASH);
      const DESIRED_COMPONENTS = PATH_COMPONENTS.find((component) =>
        [
          label.BRANDED_URL.toLowerCase(),
          label.UNASSIGNED_URL.toLowerCase()
        ].includes(component.toLowerCase())
      );

      //set the url and navigation are done within branded site
      if (
        DESIRED_COMPONENTS &&
        DESIRED_COMPONENTS.toLowerCase() === label.BRANDED_URL.toLowerCase()
      ) {
        this.urlName = label.BRANDED_URL;
      } else {
        this.urlName = label.UNASSIGNED_URL;
      }
    } catch (error) {
      this.handleError(error.body.message); // Catching Potential Error for try-catch
    }
  }
  // show the Toast message if the catch runs
  showToast(title, message, variant) {
    if (typeof window !== "undefined") {
      const event = new ShowToastEvent({
        title: title,
        message: message,
        variant: variant
      });
      this.dispatchEvent(event);
    }
  }
}