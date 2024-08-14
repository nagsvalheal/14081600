//The LWC displays a card that includes challenge title, description, reward points, and an optional link to an article based on challenge criteria
//To import Libraries
import { LightningElement, wire, api } from "lwc";
import { ShowToastEvent } from "lightning/platformShowToastEvent";
import { resources } from "c/biPspLabelAndResourceChallenges";
//To import apex classess
import INDIVIDUAL_CHALLENGES from "@salesforce/apex/BI_PSP_IndividualChallengesCtrl.getIndividualChallenges";
//To import custom labels

export default class BiPspbCompletedChallengeComponent extends LightningElement {
  //Proper naming conventions with camel case for all the variable will be followed in the future releases
  @api completechallengeid;
  challengeBookworm = resources.CH_BOOK_WORM;
  challengeLevelOne = resources.CHALLENGE_LEVEL_ONE;
  challengeLevelTwo = resources.CHALLENGE_LEVEL_TWO;
  siteUrlBranded = resources.BR_SITE_URL;
  gppArticle = resources.IC_LANDING_PAGE;
  beingActive = resources.WHY_BEING_ACTIVE;
  errorMsg = resources.ERROR_MESSAGES;
  errorVariant = resources.ERROR_VARIANT;
  brandedUrl = resources.BRANDED_URL;
  unAssignedUrl = resources.UNASSIGNED_URL;
  brandedNaviUrl = resources.BR_SITE_URL;
  unAssignedNaviUrl = resources.UN_ASSIGNED_URL_NAVI;
  beingActiveLink = resources.BEING_ACTIVE;
  linkArticle = resources.LINKARTICLE;
  Title;
  Description;
  RewardPoints;
  DateofCompletion;
  LinktoArticle;
  WhyBeingActive;
  Level;
  Image;
  urlq;

  @wire(INDIVIDUAL_CHALLENGES, { challengeId: "$completechallengeid" })
  wiredAccount({ error, data }) {
    let globalThis = window;
    if (data) {
      try {
        this.processIndividualChallengeData(data[0]);
      } catch (err) {
        globalThis.sessionStorage.setItem("errorMessage", err.body.message);
        globalThis.location?.assign(
          this.baseUrl + this.siteUrlBranded + this.displayErrorPage
        );
      }
    } else if (error) {
      globalThis.sessionStorage.setItem("errorMessage", error.body.message);
      globalThis.location?.assign(
        this.baseUrl + this.siteUrlBranded + this.displayErrorPage
      );
    }
  }

  processIndividualChallengeData(data) {
    this.setTitleAndLevel(data);
    this.setVisibility();
    this.setDescription(data);
    this.setRewardPoints(data);
    this.setImage(data);
  }

  setTitleAndLevel(data) {
    this.Title = data.Name;
    this.Level = data.BI_PSP_Challenge_Level__c;
  }

  setVisibility() {
    const isBookworm = this.Title.includes(this.challengeBookworm);

    this.WhyBeingActive = false;
    this.LinktoArticle = false;

    if (isBookworm) {
      if (this.Level === this.challengeLevelOne) {
        this.LinktoArticle = true;
      } else if (this.Level === this.challengeLevelTwo) {
        this.WhyBeingActive = true;
      }
    }
  }

  setDescription(data) {
    if (data.HealthCloudGA__Description__c) {
      this.Description = data.HealthCloudGA__Description__c.replace(/<[^<>]+>/gu, "");
    }
  }

  setRewardPoints(data) {
    if (data.BI_PSP_Challenge_Reward_Points__c) {
      this.RewardPoints = data.BI_PSP_Challenge_Reward_Points__c;
    }
  }

  setImage(data) {
    if (data.BI_PSP_Challenge_Image__c) {
      const desiredWidth = "135px";
      const desiredHeight = "70px";
      const imgTagRegex = /<img\s+[^>]*?src="([^"]+)"[^>]*?>/gi;

      this.Image = data.BI_PSP_Challenge_Image__c.replace(
        imgTagRegex,
        (match, src) =>
          `<img src="${src}" alt="${resources.ALTVALUE}" width="${desiredWidth}" height="${desiredHeight}">`
      );
    }
  }
  renderedCallback() {
    let globalThis = window;
    try {
      const currentURL = window.location.href;
      const urlObject = new URL(currentURL);
      const path = urlObject.pathname;
      const pathComponents = path.split("/");
      const desiredComponent = pathComponents.find((component) =>
        [this.brandedUrl, this.unAssignedUrl].includes(component)
      );

      if (desiredComponent === this.brandedUrl) {
        this.urlq = this.brandedNaviUrl;
      } else {
        this.urlq = this.unAssignedNaviUrl;
      }
    } catch (error) {
      globalThis.sessionStorage.setItem("errorMessage", error.body.message);
      globalThis.location?.assign(
        this.baseUrl + this.siteUrlBranded + this.displayErrorPage
      );
    }
  }
  //Navigation for articles
  openArticles() {
    window.location.assign(this.urlq + this.gppArticle);
  }
  openArticlesActive() {
    window.location.assign(this.urlq + this.beingActive);
  }
  // showToast used for all the error messages caught
  showToast(title, message, variant) {
    const event = new ShowToastEvent({
      title: title,
      message: message,
      variant: variant
    });
    if (typeof window !== "undefined") {
      this.dispatchEvent(event);
    }
  }
}