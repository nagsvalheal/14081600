//This lightning web component is used to display Navigation Bar in the Patient Community  Pages
// To import Libraries
import { LightningElement } from "lwc";
import { ShowToastEvent } from "lightning/platformShowToastEvent";
//  To import Apex Classes
import CHECK_COMMUNITY_USERNAME from "@salesforce/apex/BI_PSPB_FeedUsernameCtrl.checkCommunityUsername";
// To import Custom labels and static resources
import * as label from 'c/biPspbLabelAndResourceCommunity';

export default class BiPspbChatterNavBar extends LightningElement {
  // Declaration of variables with @track
  navColor = "navColor";
  navColor1 = "navColor1";
  navColor2 = "navColor2";
  navColor3 = "navColor3";
  urlName;
  userId = label.ID;
  myFollowingLabel= label.MY_FOLLOWING_POST_LABEL;
  myFollowersLabel= label.MY_FOLLOWERS_POST_LABEL;
  myPostLabel= label.MY_POST_LABEL;
  allPostLabel= label.ALL_POST_LABEL;
  //ConnectedCallback used to get the PATH and  find the site is Branded or Unassigned
  renderedCallback() {
    if (this.hasRendered) {
      return;
    }
    this.hasRendered = true;
    try {
      this.pageFind();
      this.detectBrandedOrUnassigned();
    } catch (error) {
      this.handleError(error.body.message) // Result Null/other Exception
    }
  }

  //find the PATH name of current page
  pageFind() {
    try {
      const PATH = window.location.pathname;
      const START_INDEX = PATH.indexOf("/s/") + 3; // Adding 3 to skip '/s/'
      const AFTER_S_SEGMENT = PATH.substring(START_INDEX);
      //Highlight  the color of the navbar - condition
      this.resetNavColors();
      switch (AFTER_S_SEGMENT) {
        case label.ALL_POST_NAVIGATION:
          this.navColor = "navColorHighlight";
          break;
        case label.MY_POST_NAVIGATION:
          this.navColor1 = "navColorHighlight";
          break;
        case label.FOLLOWER_NAVIGATION:
          this.navColor2 = "navColorHighlight";
          break;
        case label.FOLLOWING_NAVIGATION:
          this.navColor3 = "navColorHighlight";
          break;
        default:
          this.resetNavColors();
          break;
      }
    } catch (error) {
      this.handleError(error.body.message) // Result Null/other Exception
    }
  }
  //reset the color in normal form (like as existing)
  resetNavColors() {
    try {
      this.navColor = "navColor";
      this.navColor1 = "navColor1";
      this.navColor2 = "navColor2";
      this.navColor3 = "navColor3";
    } catch (error) {
      this.handleError(error.body.message) // Result Null/other Exception
    }
  }
  // Handle errors and display a toast message
	handleError(error) {
		let globalThis=window;
		globalThis.location.href = label.ERROR_PAGE;
		globalThis.sessionStorage.setItem('errorMessage', error);
	}
  //Find the site is Branded or Unassigned and do the navigation accordingly
  detectBrandedOrUnassigned() {
    try {
      let globalThis=window; 
      const CURRENT_URL = globalThis.location.href;
      const URL_OBJECT = new URL(CURRENT_URL);
      const PATH = URL_OBJECT.pathname;
      const PATH_COMPONENTS = PATH.split(label.SLASH);
      const DESIRED_COMPONENTS = PATH_COMPONENTS.find((component) =>
        [label.BRANDED_URL.toLowerCase(), label.UNASSIGNED_URL.toLowerCase()].includes(
          component.toLowerCase()
        )
      );
      //set the url and navigation are done within branded site
      if (
        DESIRED_COMPONENTS &&
        DESIRED_COMPONENTS.toLowerCase() === label.BRANDED_URL.toLowerCase()
      ) {
        this.urlName = label.BRANDED_URL;
      }
      //set the url and navigation are done within unassigned site
      else {
        this.urlName = label.UNASSIGNED_URL;
      }
    } catch (error) {
      this.handleError(error.body.message) // Result Null/other Exception
    }
  }
  navAllPost() {
    this.handleNavigation(label.ALL_POST_URL);
  }

  navMyPost() {
    this.handleNavigation(label.MY_POST_URL);
  }

  navMyFollowers() {
    this.handleNavigation(label.FOLLOWER_URL);
  }

  navFollowing() {
    this.handleNavigation(label.FOLLOWING_URL);
  }

  //navigate the page and check if community username is already exist for the current user
  handleNavigation(url) {
    CHECK_COMMUNITY_USERNAME()
      .then((result) => {
        if (result === true) {
          // If the community username exists, navigate to the specified URL
          window.location.assign(label.SLASH + this.urlName + url);
        } else if (result === false) {
          // If the community username does not exist, navigate to the username creation page
          window.location.assign(label.SLASH + this.urlName + label.COMMUNITY_USERNAME_URL);
        } 
      })
      .catch((error) => {
        this.handleError(error.body.message)
      });
  }
  // show the Toast message if the catch runs
  showToast(title, message, variant) {
    const EVENT = new ShowToastEvent({
      title: title,
      message: message,
      variant: variant
    });
    this.dispatchEvent(EVENT);
  }
}