//This lightning web component is used to Create Post by Selecting Category and Phrases in Patient Community Page
// To import Libraries
import { LightningElement } from "lwc";
import { ShowToastEvent } from "lightning/platformShowToastEvent";
//  To import Apex Classes
import CHECK_COMMUNITY_USERNAME from "@salesforce/apex/BI_PSPB_FeedUsernameCtrl.checkCommunityUsername";
import USER_AVATAR from "@salesforce/apex/BI_PSP_CurrentUser.getEnrolleeRecords";
import CREATE_FEED from "@salesforce/apex/BI_PSPB_FeedItemCtrl.insertFeedItem";
// To import Custom labels and static resources
import * as label from 'c/biPspbLabelAndResourceCommunity';

export default class BiPspbCreatePost extends LightningElement {
  // Declaration of variables 
  select = label.SELECT;
  topicPlaceHolder = label.TOPIC_PLACEHOLDER;
  subTopicPlaceHolder = label.PHRASE_PLACEHOLDER;
  alternateTextForAvatar = label.ALTERNATE_AVATAR;
  alternateTextForWarningIcon = label.ALTERNATE_WARNING_ICON;
  categoryPlaceHolder = this.select;
  phrasePlaceHolder = this.select;
  selectLengthWidthChild = "selectLengthWidth";
  selectLengthWidthParent = "selectLengthWidth";
  parentValue = "";
  childValue = "";
  childOptions = [];
  warningCategory = false;
  warningPhrase = false;
  childDropdownDisabled = true;
  isDesktop = false;
  loggedUserAvatar;
  isPopupOpen = false;
  category;
  subcategory;
  showSpinner ;
  urlName;
  warningIconImg = label.WARNING_ICON;
  userId = label.ID;
  handleResizeBound;
  avatarContent=label.AVATAR_CONTENT;
  createNewPost = label.CREATE_NEW_POST;
  categoryTitle = label.CATEGORY_TITLE;
  categoryValidation = label.CATEGORY_VALIDATION;
  phraseTitle = label.PHRASE_TITLE;
  phraseValidation = label.PHRASE_VALIDAITON;
  cancel = label.CANCEL;
  submit = label.SUBMIT;
  readyToSubmit = label.READY_TO_SUBMIT;
  postConfirmation = label.POST_CONFIRMATION;
  no = label.NO;
  yes = label.YES;
  //Category Option Values
  parentOptions = [
    { label: label.CHATTER_LIFESTYLE, value: label.CHATTER_LIFESTYLE },
    { label: label.CHATTER_SOCIAL, value: label.CHATTER_SOCIAL },
    { label: label.CHATTER_MEDICAL, value: label.CHATTER_MEDICAL },
    { label: label.CHATTER_PSYCHOLOGI, value: label.CHATTER_PSYCHOLOGI },
    { label: label.CHATTER_OCCUPATION, value: label.CHATTER_OCCUPATION },
    { label: label.CHATTER_GPP, value: label.CHATTER_GPP }
  ];

  //This connected callback used to find the site Branded/Unassigned ,and run getAvatarImg and for Static page without scroll when popup opens
  connectedCallback() {
    try {
      this.detectBrandedOrUnassigned();
      this.getAvatarImg();
      this.isDesktop = this.isDesktopView();
      // Bind the event handler once and store it in a variable
      this.handleResizeBound = this.handleResize.bind(this);
      let globalThis = window;
      // Add the event listener using the bound handler
      globalThis.addEventListener("resize", this.handleResizeBound);
    } catch (error) {
      this.handleError(error.body.message) // Catching Potential Error for try-catch
    }
  }
  //Used to remove the Event from the fixed screen
  disconnectedCallback() {
      window.removeEventListener("resize", this.handleResizeBound);
  }
  //set the desktop view to fix the screen for popup
  handleResize() {
    this.isDesktop = this.isDesktopView();
  }
  // This function used to Fix the screen as static if the popup opens as per requirement
  isDesktopView() {
    let globalThis = window;
    return globalThis.innerWidth <= 2024 || globalThis.innerWidth >= 200;
  }
  //Get Avatar for AvatarContent
  getAvatarImg() {
    this.showSpinner = true;
      USER_AVATAR()
        .then((result) => {
          if (result.length > 0 && result[0].BI_PSP_AvatarUrl__c) {
            this.loggedUserAvatar = result[0].BI_PSP_AvatarUrl__c;
            this.showSpinner = false;
          }
        })
        .catch((error) => {
          this.showSpinner = false
          this.handleError(error.body.message) // Catching Potential Error for then-catch
        });
  }
  //Confirmation popup for submit
  get popupClass() {
    let popupClass = this.isPopupOpen
      ? "popup-container"
      : "popup-container hidden";
    return popupClass;
  }
  //Onchange function for Category Dropdown
  handleParentDropdownChange(event) {
    this.selectLengthWidthParent = "selectLengthWidth";
    this.parentValue = event.target.value;
    this.childDropdownDisabled = false;
    this.childOptions = this.getChildOptions(this.parentValue);
  }
  getChildOptions(parentValue) {
    //Phrase Values Dependent to category options so According to phrase choosen by the user get Phrase option values
    const optionsMap = {
      [label.CHATTER_LIFESTYLE]: [
        label.LIFE_I_MISS,
        label.LIFE_WORKING,
        label.LIFE_NOT_ALWAYS,
        label.LIFE_MY_CLOTH,
        label.LIFE_I_WOULD,
        label.LIFE_EVEN_GPP,
        label.LIFE_AFTER_OVER,
        label.LIFE_THERE_ARE,
        label.LIFE_I_DID
      ],
      [label.CHATTER_SOCIAL]: [
        label.SOCIAL_ACTIVELY_WORK,
        label.SOCIAL_TO_EXPLAIN,
        label.SOCIAL_TALKING,
        label.SOCIAL_ONLY_CLOSE,
        label.SOCIAL_SHAREDMY,
        label.SOCIAL_STAYING,
        label.SOCIAL_WANT_TO_INTIMATE,
        label.SOCIAL_GOT_CHANCE,
        label.SOCIAL_EMBARRASE,
        label.SOCIAL_THINGS_BETTER
      ],
      [label.CHATTER_MEDICAL]: [label.MEDICAL_DONT_FEEL, label.MEDICAL_SEEN_DOC, label.MEDICAL_FINALLY],
      [label.CHATTER_PSYCHOLOGI]: [
        label.PSYC_FEEL_ALONE,
        label.PSYC_FEEL_ANXIOUS,
        label.PSYC_WORN_OUT,
        label.PSYC_THINGS_BETTER,
        label.PSYC_DONT_LET_GPP,
        label.PSYC_GPP_HARDBATTLE,
        label.PSYC_TODAY_FEEL,
        label.PSYC_EVEN_THOUGH,
        label.PSYC_I_ACCEPT
      ],
      [label.CHATTER_OCCUPATION]: [
        label.OCC_I_CANNOT,
        label.OCC_COMPLICATE,
        label.OCC_WORL_COLLEAGUE,
        label.OCC_FEEL_MYFAMILY
      ],
      [label.CHATTER_GPP]: [
        label.GPP_I_DONT_KNOW,
        label.GPP_WHILE_GIVING,
        label.GPP_SKIN_IMPROVE,
        label.GPP_ACTIVELY_EXPLORE,
        label.GPP_UNDERSTANDING,
        label.GPP_FEEL_ALONE
      ]
    };
    return (optionsMap[parentValue] || []).map((phrase) => ({
      label: phrase,
      value: phrase
    }));
  }
  //Onchange function for Phrases deopdown
  handleChildDropdownChange(event) {
    this.selectLengthWidthParent = "selectLengthWidth";
    this.selectLengthWidthChild = "selectLengthWidth";
    this.warningCategory = false;
    this.warningPhrase = false;
    //these query selector are used for to Dispaly/Remove  Error Message
    const CATEGORY_CLASS = this.template.querySelector(".valid"); //Category  For Error
    const PHRASE_CLASS = this.template.querySelector(".secondValid"); //Phrase For Error

    if (CATEGORY_CLASS?.classList.contains("firstInvalid")) {
      CATEGORY_CLASS.classList.remove("firstInvalid");
      CATEGORY_CLASS.classList.add("valid");
    }
    if ( PHRASE_CLASS?.classList.contains("secondInvalid")) {
      PHRASE_CLASS.classList.remove("secondInvalid");
      PHRASE_CLASS.classList.add("secondValid");
    }
    this.childValue = event.target.value;
  }

  //If Clear the Values or options or invalidation after clicking cancel button
  //Else Navigate to previous page if No error.
  toggleCancel() {
    this.categoryPlaceHolder = "Select";
    this.phrasePlaceHolder = "Select";
    this.selectLengthWidthChild = "selectLengthWidth";
    this.selectLengthWidthParent = "selectLengthWidth";
    this.warningCategory = false;
    this.warningPhrase = false;
    //first(category ) error message div
    const CATEGORY_CLASS = this.template.querySelector(".valid");
    //second(phrase) error messgae div
    const PHRASE_CLASS = this.template.querySelector(".secondValid");
    if (CATEGORY_CLASS?.classList.contains("firstInvalid")) {
      CATEGORY_CLASS.classList.remove("firstInvalid");
      CATEGORY_CLASS.classList.add("valid");
    }
    if (PHRASE_CLASS?.classList.contains("secondInvalid")) {
      PHRASE_CLASS.classList.remove("secondInvalid");
      PHRASE_CLASS.classList.add("secondValid");
    } else {
      let globalThis = window;
      globalThis.history.back();
    }
  }
  // Open confirmation popup for submit and check Null value
  togglePopup() {
    const CATEGORY_CLASS = this.template.querySelector(".valid");
    const PHRASE_CLASS = this.template.querySelector(".secondValid");
    if (!this.parentValue || !this.childValue) {
      //if category is null raise invalidation
      if (!this.parentValue) {
        CATEGORY_CLASS.classList.add("firstInvalid");
        this.warningCategory = true;
        this.selectLengthWidthParent = "errorSelectLengthWidth";
        this.selectLengthWidthChild = "errorSelectLengthWidth";
        this.categoryPlaceHolder = this.topicPlaceHolder;
      } else if (CATEGORY_CLASS.classList.contains("firstInvalid")) {
          CATEGORY_CLASS.classList.remove("firstInvalid");
          CATEGORY_CLASS.classList.add("valid");
          this.warningCategory = false;
      }
      //if phrase is null raise invalidation
      if (!this.childValue) {
        PHRASE_CLASS.classList.add("secondInvalid");
        this.warningPhrase = true;
        this.phrasePlaceHolder = this.subTopicPlaceHolder;
        this.selectLengthWidthChild = "errorSelectLengthWidth";
      } else if (PHRASE_CLASS.classList.contains("secondInvalid")) {
          PHRASE_CLASS.classList.remove("secondInvalid");
          PHRASE_CLASS.classList.add("secondValid");
          this.warningPhrase = false;
      }
    }
    //if none of the field is null , fix the normal text instead of error text
    else {
      CATEGORY_CLASS.classList.add("valid");
      PHRASE_CLASS.classList.add("secondValid");
      PHRASE_CLASS.classList.remove("secondInvalid");
      CATEGORY_CLASS.classList.remove("firstInvalid");
      this.warningPhrase = false;
      this.warningCategory = false;
      this.isPopupOpen = true;
      document.body.style.overflow = this.isDesktop ? "hidden" : "";
    }
  }
  //close the confirmation popup
  checkClosBtn() {
    this.isPopupOpen = false;
    document.body.style.overflow = "";
  }
  //submit button - after clicking yes in confirmation popup and create record then navigate to mypost page
  handleSubmit() {
    this.checkClosBtn();
    //show loading spinner after clicking the yes button on confirmation submit popup
    this.showSpinner = true;
    //Insert the  Category and phrases (Create FeedPost)
    CREATE_FEED({
      category: this.parentValue,
      subcategory: this.childValue
    })
      .then(() => {
        this.checkCommunity();
      })
      .catch((error) => {
        // Close the popup after submission
        this.showSpinner = false;
        this.handleError(error.body.message) // Catching Potential Error for then-catch
      });
    this.checkClosBtn();
  }
  //before navigate to mypost page after clicking yes on confirmation popup check the communityusername if not createit.
  checkCommunity() {
      CHECK_COMMUNITY_USERNAME()
        .then((result) => {
          const url = result
            ? `${label.SLASH}${this.urlName}${label.MY_POST_URL}`
            : `${label.SLASH}${this.urlName}${label.COMMUNITY_USERNAME_URL}`;
          window.location.assign(url);
        })
        .catch((error) => {
          this.showSpinner = false;
          this.handleError(error.body.message)
        });
  }
  // Handle errors and display a toast message
	handleError(error) {
		let globalThis=window;
		globalThis.location.href = label.ERROR_PAGE;
		globalThis.sessionStorage.setItem('errorMessage', error);
	}
  // To detect the site is branded or unassigned
  detectBrandedOrUnassigned() {
    let globalThis = window;
    const URL_OBJECT = new URL(globalThis.location.href);
    const PATH = URL_OBJECT.pathname;
    const PATH_COMPONENTS = PATH.split("/");
    const DESIRED_COMPONENT = PATH_COMPONENTS.find((component) =>
      [label.BRANDED_URL.toLowerCase(), label.UNASSIGNED_URL.toLowerCase()].includes(
        component.toLowerCase()
      )
    );
    //set the url and navigation are done within branded site
    if (
      DESIRED_COMPONENT &&
      DESIRED_COMPONENT.toLowerCase() === label.BRANDED_URL.toLowerCase()
    ) {
      this.urlName = label.BRANDED_URL;
    }
    //set the url and navigation are done within unassigned site
    else {
      this.urlName = label.UNASSIGNED_URL;
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