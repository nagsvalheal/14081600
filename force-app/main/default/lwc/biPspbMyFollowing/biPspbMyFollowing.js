//This component is used to display all following users of the logged User and the user can unfollow Users.
// To import Libraries
import { LightningElement } from "lwc";
import { ShowToastEvent } from "lightning/platformShowToastEvent";
//  To import Apex Classes
import DISPLAY_FOLLOWINGS from "@salesforce/apex/BI_PSPB_FollowUserCtrl.getMyFollowers";
import UNFOLLOW_USER from "@salesforce/apex/BI_PSPB_FollowUserCtrl.unfollowUser";
import USER_AVATAR from "@salesforce/apex/BI_PSP_CurrentUser.getEnrolleeRecords";
// To import Custom labels and static resources
import * as label from 'c/biPspbLabelAndResourceCommunity';
export default class BiPspbMyFollowing extends LightningElement {
  // Declaration of variables
  userNames;
  numberOfFollowings = 0;
  followingPopup = false;
  followingPopupConfirmation = false;
  followOrUnFollowButton = false;
  following = false;
  avatarFollow;
  isLoading;
  selectedUser;
  loggedUserAvatar;
  showToastForUnFollow = false;
  ToastMsg = '';
  isDesktop = false;
  allPostImg = label.ALL_POST;
  followingsCount = false;
  ticIcon = label.TICK_ICON;
  handleResizeBound;
  avatarContent=label.AVATAR_CONTENT;
  followingLabel = label.FOLLOWING_LABEL;
  yes = label.YES;
  no = label.NO;
  unFollowingToastContent = label.UNFOLLOW_TOAST;
  unFollowingPartToastContent = label.UNFOLLOW_PART_TOAST;
  profileLabel = label.PROFILE_LABEL;
  unFollowUserText = label.UNFOLLOW_USER;
  unFollowPopupHeading = label.UNFOLLOW_POPUP_HEADING;
  unFollowPopupContent = label.UNFOLLOW_POPUP_CONTENT;
  noFollowingContent = label.NO_FOLLOWING_CONTENT;
  alternateTextForAvatar = label.ALTERNATE_AVATAR;
  alternateTextForTick = label.ALTERNATE_TICK;
	alternateForPost = label.ALTERNATE_POST;
	alternateForUserAvatar = label.ALTERNATE_USER_AVATAR;
  //This connected callback used to get Avatar ,Get followers list and resize the desktop view when popup opens
  connectedCallback() {
    try {
      this.retrieveAvatar();
      this.retrieveFollowings();
      this.isDesktop = this.isDesktopView();
      this.detectBrandedOrUnassigned();
      // Bind the event handler once and store it in a variable
      this.handleResizeBound = this.handleResize.bind(this);
      const globalThis = window;
      // Add the event listener using the bound handler
      globalThis.addEventListener("resize", this.handleResizeBound);
    } catch (error) {
      this.handleError(error.body.message) // Catching Potential Error
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
    const globalThis = window;
    const VIEWPORT_PATH = globalThis.innerWidth;
    return VIEWPORT_PATH <= 2024 || VIEWPORT_PATH >= 200;
  }
  // To get avatar of the users
  retrieveAvatar() {
      USER_AVATAR()
        .then((result) => {
          if (result.length > 0 && result[0].BI_PSP_AvatarUrl__c) {
            this.loggedUserAvatar = result[0].BI_PSP_AvatarUrl__c;
          }
        })
        .catch((error) => {
          this.handleError(error.body.message) // Catching Potential Error
        });
  }
  // To retrieve all followers
  retrieveFollowings() {
      this.isLoading = true;
      DISPLAY_FOLLOWINGS()
        .then((result) => {
          if (result.length === 0 || result === null) {
            this.followingsCount = false;
            this.isLoading = false;
            this.numberOfFollowings = 0;
            return;
          }

          // Filter followers based on type
          let followings = result.filter(
            (follower) => follower?.BI_PSP_Type__c === label.FOLLOWING_LABEL
          );

          this.numberOfFollowings = followings.length;
          this.followingsCount = this.numberOfFollowings > 0;

          this.userNames = followings.map((follower) => ({
            ...follower,
            followOrUnFollowButton: label.FOLLOWING_LABEL,
            userAvatarForEnrollee:
              follower.BI_PSP_CareProgramEnrolleeFollow__r?.BI_PSP_AvatarUrl__c ||
              this.loggedUserAvatar
          }));
          this.isLoading = false;
        })
        .catch((error) => {
          this.isLoading = false;
          this.handleError(error.body.message)
        });
  }

  // To unFollow the user
  handleUnFollowConfirmation() {
      this.isLoading = true;
      UNFOLLOW_USER({ enrolleeIdToUnFollow: this.enrolleeIdToUnFollow })
        .then(() => {
          this.retrieveFollowings();
          this.showToastForUnFollow = true;
          this.ToastMsg = this.unFollowingToastContent + ' ' + this.selectedUser + ' ' +this.unFollowingPartToastContent;
          this.isLoading = false;
        })
        .catch((error) => {
          this.isLoading = false;
          this.handleError(error.body.message) // Catching Potential Error
        });
      this.closePopup();
      window.scrollTo({ top: 0, behavior: "smooth" });
  }

  // To close toast message
  closeUnfollowToastMessage() {
    this.showToastForUnFollow = false;
  }
  // To close the popup
  closePopup() {
    this.followingPopup = false;
    this.followingPopupConfirmation = false;
    document.body.style.overflow = "";
  }

  // Helper method to set body overflow based on device type
  setBodyOverflow(isDesktop) {
    document.body.style.overflow = isDesktop ? "hidden" : "";
  }

  // To handle follow followFollwingButton on click
  handleFollowButtonClick(event) {
    this.selectedUser = event.target.dataset.username;
    this.enrolleeIdToUnFollow = event.target.dataset.enrollee;
    this.avatarFollow = event.target.dataset.avatar;
    this.following = true;
    this.followingPopup = true;
    this.setBodyOverflow(this.isDesktop);
  }

  // To handle follow popup when clicked on profile
  handleFollowProfileButton(event) {
    this.selectedUser = event.target.dataset.username;
    this.enrolleeIdToUnFollow = event.target.dataset.enrollee;
    this.avatarFollow = event.target.dataset.avatar;
    this.followingPopupConfirmation = true;
    this.setBodyOverflow(this.isDesktop);
  }

  // To handle following followFollwingButton when clicked
  handleFollowingPopupButtonClick() {
    this.following = false;
    this.followingPopup = false;
    this.followingPopupConfirmation = true;
    this.setBodyOverflow(this.isDesktop);
  }
  // Handle errors and display a toast message
	handleError(error) {
		let globalThis=window;
		globalThis.location.href = label.ERROR_PAGE;
		globalThis.sessionStorage.setItem('errorMessage', error);
	}
  // To detect the site is branded or unassigned
	detectBrandedOrUnassigned() {
		try {
			let globalThis = window;
			const CURRENT_URL = globalThis.location.href;
			const URL_OBJECT = new URL(CURRENT_URL);
			const PATH = URL_OBJECT.pathname;
			const PATH_COMPONENTS = PATH.split("/");
			const DESIRED_COMPONENTS = PATH_COMPONENTS.find((component) =>
				[
					label.BRANDED_URL.toLowerCase(),
					label.UNASSIGNED_URL.toLowerCase()
				].includes(component.toLowerCase())
			);
			if (
				DESIRED_COMPONENTS &&
				DESIRED_COMPONENTS.toLowerCase() === label.BRANDED_URL.toLowerCase()
			) {
				this.urlq = label.BRANDED_URL;
			}
			//Set the url and navigations are done within unassigned site
			else {
				this.urlq = label.UNASSIGNED_URL;
			}
		} catch (error) {
			this.handleError(label.URL_ERROR);
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